import "@stdlib/deploy";
import "@stdlib/ownable";

contract WowFish with OwnableTransferable, Deployable {
    owner: Address;
    const withdrawFee: Int = ton("0.01");
    const MinTonForStorage: Int = ton("0.01"); // enough for 1 KB of storage for 2.5 years

    bankAddress: Address;
    payableAddress: Address;

    pub: Int;
    nonceMap: map<Int, Int>;
    init(pub: Int) {
        self.owner = sender();
        self.bankAddress = newAddress(0, 0);
        self.payableAddress = newAddress(0, 0);
        self.pub = pub;
        self.nonceMap = emptyMap();
    }

    //用户提现
    receive( msg: UserWithdrawToken){
        let nonceCheck: Int? = self.nonceMap.get(msg.nonce);
        require(nonceCheck == null, "nonce repetion");

        let hash: Int = beginCell().storeAddress(sender()).storeCoins(msg.amount).storeInt(msg.nonce, 64).endCell().hash();        
        let check: Bool = checkSignature(hash, msg.signature, self.pub);
        require(check, "signature error");

        self.nonceMap.set(msg.nonce, 1);

        send(SendParameters{
                to: self.bankAddress, 
                value: context().value - self.withdrawFee, 
                bounce: true,
                body: Withdraw{
                    bankWallet: msg.bankWallet,
                    toWalletAddress: sender(),
                    amount: msg.amount,
                    queryId: msg.queryId
                }.toCell()
            });

    }

     //收到token，用户消费
    receive(tokenNotification: TokenNotification){
        //扣除手续费
        send(SendParameters{
                to: sender(), 
                value: context().value - self.withdrawFee,
                bounce: true,
                body: TokenTransfer{ 
                    queryId: tokenNotification.queryId,
                    amount:  tokenNotification.amount,
                    destination: self.payableAddress,
                    response_destination: tokenNotification.from,
                    custom_payload: emptyCell(),
                    forward_ton_amount: 1000000,
                    forward_payload: tokenNotification.forward_payload
                }.toCell()
            });
    }

    //支出token
    receive(msg: TokenExcesses){
        
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

    receive(msg: WithdrawToken) {
        require(sender() == self.owner, "Only deployer is allowed to withdraw");
        send(SendParameters{
                to:  msg.walletAddress,
                value: 0, 
                bounce: true,
                mode: SendRemainingValue,
                body: TokenTransfer{ 
                    queryId: msg.queryId,
                    amount:  msg.amount,
                    destination: sender(),
                    response_destination: sender(),
                    custom_payload: emptyCell(),
                    forward_ton_amount: 1000000,
                    forward_payload: beginCell().
                                    storeUint(0, 1).
                                    asSlice()
                }.toCell()
            });
    }

    receive(bank: BankAddress){
        self.bankAddress = bank.bankAddress;
    }

    receive(payable: PayableAddress){
        self.payableAddress = payable.payableAddress;
    }

    get fun bankAddress(): Address{
        return self.bankAddress;
    }

     get fun payableAddress(): Address{
        return self.payableAddress;
    }

}

message UserWithdrawToken{
    bankWallet: Address;
    amount: Int as uint256;
    queryId: Int as uint64;
    nonce: Int as uint64;
    signature: Slice;
}


message WithdrawToken{
    queryId: Int as uint64;
    walletAddress: Address;
    amount: Int as uint256;
}

message BankAddress{
    bankAddress: Address;
}

message PayableAddress{
    payableAddress: Address;
}

message ChangePublic{
    pub: Int;
}

message Withdraw{
    bankWallet: Address;
    toWalletAddress: Address;
    amount: Int as uint256;
    queryId: Int as uint64;
}

message(0xf8a7ea5) TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton
}

message(0x7362d09c) TokenNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton 
}

message(0xd53276db) TokenExcesses {
    queryId: Int as uint64;
}