import "@stdlib/deploy";
import "@stdlib/ownable";
import "./message";

message AirdropWithdraw{
    tokenWallet: Address;
    amount: Int as coins;
    nonce: Int as uint64;
    payload: Slice as remaining;
    signature: Slice;
}


contract JettonWithdraw with OwnableTransferable, Deployable{
    pub: Int;
    owner: Address;
    const withdrawFee: Int = ton("0.01");
    const MinTonForStorage: Int = ton("0.01"); 
    nonceMap: map<Int, Int>;

    init(pub: Int) {
        self.pub = pub;
        self.owner = sender();
        self.nonceMap = emptyMap();
    }


    receive( msg: AirdropWithdraw){
        let nonceCheck: Int? = self.nonceMap.get(msg.nonce);
        require(nonceCheck == null, "nonce repetion");

        let hash: Int = beginCell().storeAddress(sender()).storeAddress(msg.tokenWallet).storeCoins(msg.amount).storeUint(msg.nonce, 64).storeRef(msg.payload).endCell().hash();        
        let check: Bool = checkSignature(hash, msg.signature, self.pub);
        require(check, "signature error");

        //withdraw
        send(SendParameters{
                to: msg.tokenWallet, 
                value: context().value - self.withdrawFee, 
                bounce: true,
                body: TokenTransfer{ 
                    queryId: 0,
                    amount:  msg.amount,
                    destination: sender(),
                    response_destination: sender(),
                    custom_payload: emptyCell(),
                    forward_ton_amount: 1000000,
                    forward_payload: msg.payload
                }.toCell()
            });
    }

    receive(msg: ChangePublic){
        require(sender() == self.owner, "Only deployer is allowed to withdraw");
        self.pub = msg.pub;
    }

     receive("withdraw") {
        require(sender() == self.owner, "Only deployer is allowed to withdraw");
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: myBalance() - context().value - self.MinTonForStorage,
            mode: SendRemainingValue + SendIgnoreErrors
        });
    }

    receive(msg: TokenExcesses){}
}