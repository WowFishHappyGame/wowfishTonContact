import "./structs";
import "./messages";
import "./../nft_item/nft_item";
import "@stdlib/ownable";
import "@stdlib/deploy";

contract NftCollection with Deployable , OwnableTransferable{
    
    const minTonsForStorage: Int = ton("0.03");
    const gasConsumption: Int = ton("0.03"); // gas consuption for different operations may differ, so it's better to separate such consts

    next_item_index: Int as uint32 = 0;
    owner_address: Address;
    royalty_params: RoyaltyParams;                      
    collection_content: Cell;   

    maxCount: Int as uint64;
    owner: Address;
    control: MintControlInfo;
    pub: Int;
    nftType: String;
    nonceMap: map<Int, Int>;

    init(owner_address: Address, collection_content: Cell, royalty_params: RoyaltyParams, maxCount: Int, pub: Int , t: String){
        self.owner_address = owner_address;
        self.collection_content = collection_content; 
        self.royalty_params = royalty_params;
        self.maxCount = maxCount;
        self.owner = sender();
        self.control = MintControlInfo{
            lastTime: 0,
            maxCountInTime: 0
        };
        self.pub = pub;
        self.nftType = t;
        self.nonceMap = emptyMap();
    }

    // [Collection Contract] -> Transfer -> OwnershipAssigned -> NFTExcesses
    receive(m: Mint){
        let ctx: Context = context(); // get sender Info
        let msgValue: Int = ctx.value;
        self.proveSignature(m.count, m.price, m.nonce, m.queryId, m.signature);
        require(msgValue >= m.price * m.count, "price limit");
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);
        msgValue = msgValue - (storageFee + self.gasConsumption);
        repeat (m.count) {   
            self.mint(ctx.sender, msgValue / m.count, m.queryId);
        }
    }

    receive(m: MintControl){
        require(sender() == self.owner, "Only owner is allowed to control");
        self.control = MintControlInfo{
            lastTime: m.lastTime,
            maxCountInTime: m.maxCountInTime
        };
    }

    // ===== Private Methods ===== //
    fun mint(sender: Address, msgValue: Int, queryId: Int) {
        require(now() < self.control.lastTime && self.next_item_index < self.control.maxCountInTime, "non-sequential NFTs");
        require(self.next_item_index >= 0 && self.next_item_index < self.maxCount, "non-sequential NFTs");
        let nft_init: StateInit = self.getNftItemInit(self.next_item_index);
        send(SendParameters{
                to: contractAddress(nft_init), 
                value: msgValue, 
                bounce: false,
                mode: SendIgnoreErrors,
                body: Transfer {
                    query_id: queryId,
                    new_owner: sender,
                    response_destination: self.owner,//value to owner
                    custom_payload: emptyCell(),
                    forward_amount: 0,
                    forward_payload: emptySlice()
                }.toCell(),
                code: nft_init.code,
                data: nft_init.data
            });
        self.next_item_index = self.next_item_index + 1;
    }

    fun proveSignature(count: Int, price: Int, nonce: Int, queryID: Int, signature: Slice){
        let hash: Int = beginCell().storeAddress(sender()).storeSlice(
            self.nftType.asSlice()
        ).storeInt(count, 32).storeCoins(price).storeInt(queryID, 64).
        storeInt(nonce, 64).endCell().hash();        
        let check: Bool = checkSignature(hash, signature, self.pub);
        let nonceCheck: Int? = self.nonceMap.get(nonce);
        require(nonceCheck == null, "nonce repetion");
        require(check , "signature error");
    }

    receive("withdraw") {
        require(sender() == self.owner, "Only owner is allowed to withdraw");
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: myBalance() - context().value - self.minTonsForStorage,
            mode: SendRemainingValue + SendIgnoreErrors
        });
    }

    receive(msg: GetRoyaltyParams) {   
        let ctx: Context = context(); // get sender Info
        send(SendParameters{
            to: ctx.sender,
            value: 0,
            mode: 64, 
            bounce: false,
            body: ReportRoyaltyParams {
                query_id: msg.query_id,
                numerator:  self.royalty_params.numerator,
                denominator: self.royalty_params.denominator,
                destination: self.owner_address
            }.toCell()
        });        
    }

     receive(msg: ChangePublic){
        require(sender() == self.owner, "Only deployer is allowed to withdraw");
        self.pub = msg.pub;
    }

    // ------------------ Get Function  ------------------ //
    get fun get_collection_data(): CollectionData {     
        let b: StringBuilder = beginString();
        let collectionDataString: String = self.collection_content.asSlice().asString();
        b.append(collectionDataString);
        b.append("collectionsr.json"); // You can changed this your self.
        return CollectionData{
            next_item_index: self.next_item_index, 
            collection_content: b.toCell(), 
            owner_address: self.owner_address
        };
    }

    get fun get_nft_address_by_index(item_index: Int): Address?{      
        let initCode: StateInit = self.getNftItemInit(item_index);
        return contractAddress(initCode);
    }

    get fun getNftItemInit(item_index: Int): StateInit {
        return initOf NftItem(myAddress(), item_index, self.owner_address, self.collection_content);
    }
    
    get fun get_nft_content(index: Int, individual_content: Cell): Cell { 
        let b: StringBuilder = beginString();
        let ic: String = individual_content.asSlice().asString();
        b.append(ic);
        return b.toCell();
    }

    get fun royalty_params(): RoyaltyParams {
        return self.royalty_params;
    }
}