import "@stdlib/deploy";
import "@stdlib/ownable";

contract WowFish with OwnableTransferable, Deployable {
    owner: Address;
    const withdrawFee: Int = ton("0.01");
    const MinTonForStorage: Int = ton("0.01"); // enough for 1 KB of storage for 2.5 years

    bankAddress: Address;
    payableAddress: Address;
    init() {
        self.owner = sender();
        self.bankAddress = newAddress(0, 0);
        self.payableAddress = newAddress(0, 0);
    }

    //用户提现
    receive( msg: UserWithdrawToken){
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
        let amount: Int = tokenNotification.amount * 90 / 100;
        send(SendParameters{
                to: sender(), 
                value: 0, 
                bounce: true,
                mode: SendRemainingValue,
                body: TokenTransfer{ 
                    queryId: tokenNotification.queryId,
                    amount:  amount,
                    destination: self.payableAddress,
                    response_destination: tokenNotification.from,
                    custom_payload: tokenNotification.forward_payload.asCell(),
                    forward_ton_amount: 0,
                    forward_payload: beginCell().
                                    storeUint(0, 1).
                                    asSlice()
                }.toCell()
            });
    }

    //支出token
    receive(msg: TokenExcesses){
        
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