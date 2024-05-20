import "@stdlib/deploy";
import "@stdlib/ownable";

contract InfrasRouter with OwnableTransferable, Deployable {
    owner: Address;
    a: Int as uint256 = 0;
    const MinTonForStorage: Int = ton("0.01");

    init() {
        self.owner = sender();
    }


    receive(msg: Transfer){
        //0.01 for fee
        //let transferValue: Int =  context().value / 100 * 99;
        //1 => 0.01
        // send(SendParameters{
        //     to: msg.to,
        //     bounce: true,
        //     value: transferValue,
        //     mode: SendIgnoreErrors,
        //     body: msg.comment.asComment()
        // });
        let transferValue: Int =  context().value / 100 * 99;
        self.a += transferValue;
      //  b += context().value - transferValue;
    }

    receive(msg: TTransfer){
        //0.1 for fee
        let transferAmount: Int =  msg.amount * 99 / 100;

       send(SendParameters{
                to: msg.to, 
                value: 0, 
                bounce: true,
                mode: SendRemainingValue,
                body: TokenTransfer{ 
                    queryId: msg.queryId,
                    amount:  transferAmount,
                    destination: msg.to,
                    response_destination: sender(),
                    custom_payload: emptyCell(),
                    forward_ton_amount: msg.forwardTonAmount,
                    forward_payload: beginCell().
                                    storeUint(0, 1).
                                    asSlice()
                }.toCell()
            });

    }

    receive("withdraw"){
        self.requireOwner();
        send(SendParameters{
            to: sender(),
            bounce: true,
            value: myBalance() - context().value - self.MinTonForStorage,
            mode: SendRemainingValue + SendIgnoreErrors
        });
    }

    receive(msg: WithdrawToken){
        self.requireOwner();
        send(SendParameters{
                to: msg.tokenAddress, 
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

    get fun geta(): Int{
        return self.a;
    }
}

message WithdrawToken{
    tokenAddress: Address;
    amount: Int as coins;
    queryId: Int as uint64;
}

message Transfer{
    to: Address;
    comment: String;
}

message TTransfer{
    to: Address;
    amount: Int as coins;
    queryId: Int as uint64;
    forwardTonAmount: Int as coins;
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
