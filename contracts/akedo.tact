import "@stdlib/deploy";
import "@stdlib/ownable";
import "./message";

contract Akedo with OwnableTransferable, Deployable {
    owner: Address;
    const MinTonForStorage: Int = ton("0.03"); // enough for 1 KB of storage for 2.5 years

    pub: Int;
    nonceMap: map<Int, Address>;
    maxAmount: Int;
    init(pub: Int) {
        self.owner = sender();
        self.pub = pub;
        self.nonceMap = emptyMap();
        self.maxAmount = ton("2");
    }

    //用户提现Token
    receive( msg: WithdrawToken){
        self.authentication(msg.nonce, msg.amount, msg.payload, msg.expireTime, msg.signature);
        let ctx: Context = context();
        self.nonceMap.set(msg.nonce, sender());
        let msgValue: Int = ctx.value;
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = self.MinTonForStorage - min(tonBalanceBeforeMsg, self.MinTonForStorage);
        msgValue = msgValue - storageFee;

         send(SendParameters{
                to: msg.tokenWallet, 
                value: msgValue, 
                bounce: true,
                mode: SendIgnoreErrors,
                body: TokenTransfer{ 
                    queryId:  msg.nonce,
                    amount:  msg.amount,
                    destination: sender(),
                    response_destination: myAddress(),
                    custom_payload: emptyCell(),
                    forward_ton_amount: 1000000,
                    forward_payload: msg.payload
                }.toCell()
            });

    }

    //用户提现ton
    receive( msg: WithdrawTon){
        self.authentication(msg.nonce, msg.amount, msg.payload, msg.expireTime, msg.signature);
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: msg.amount,
            mode: SendRemainingValue,
            body: msg.payload.asString().asComment()
        });
    }
    receive(tokenNotification: TokenNotification){
    }

    //支出token
    receive(msg: TokenExcesses){
        let withdrawer: Address? = self.nonceMap.get(msg.queryId);
        if (withdrawer != null){
            send(SendParameters{
                to: withdrawer!!,
                value: 0, 
                bounce: true,
                mode: SendRemainingValue + SendIgnoreErrors
            });
        }
    }

    receive(msg: ChangePublic){
        require(sender() == self.owner, "Only deployer is allowed to withdraw");
        self.pub = msg.pub;
    }

    receive(msg: MaxWithAmount){
        require(sender() == self.owner, "Only deployer is allowed to withdraw");
        self.maxAmount = msg.amount;
    }

    receive(msg: AdminWithdraw) {
        require(sender() == self.owner, "Only deployer is allowed to withdraw");
        send(SendParameters{
                to: msg.tokenWallet, 
                value: 0, 
                bounce: true,
                mode: SendRemainingValue,
                body: TokenTransfer{ 
                    queryId:  0,
                    amount:  msg.amount,
                    destination: sender(),
                    response_destination: sender(),
                    custom_payload: emptyCell(),
                    forward_ton_amount: 0,
                    forward_payload: emptySlice()
                }.toCell()
            });
    }
    receive() {
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

    fun authentication( nonce: Int, amount: Int, payload: Slice, expireTime: Int, signature: Slice){
        require(expireTime - now() > 0, "expire");
        let nonceCheck: Address? = self.nonceMap.get(nonce);
        require(nonceCheck == null, "nonce repetion");
        require(amount <= self.maxAmount, "amount error");
        let hash: Int = beginCell()
        .storeAddress(sender())
        .storeCoins(amount)
        .storeSlice(payload)
        .storeInt(nonce, 64)
        .storeInt(expireTime, 32)
        .endCell()
        .hash();        
        let check: Bool = checkSignature(hash, signature, self.pub);
        require(check, "signature error");
    }

}

message WithdrawToken{
    tokenWallet: Address;
    amount: Int as coins;
    nonce: Int as uint64;
    expireTime: Int as uint32;
    signature: Slice;
    payload: Slice as remaining;
}

message WithdrawTon{
    amount: Int as coins;
    nonce: Int as uint64;
    expireTime: Int as uint32;
    signature: Slice;
    payload: Slice as remaining;
}


message AdminWithdraw{
    tokenWallet: Address;
    amount: Int as coins;
}

message MaxWithAmount{
    amount: Int as coins;
}

