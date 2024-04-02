import "@stdlib/deploy";
import "@stdlib/ownable";

contract WowfishBank with OwnableTransferable, Deployable {
    master: Address;
    deployTime: Int as uint32;
    const _dayWithdrawAmount : Int = 100000000000000;
    _withdrawedAmount: Int as uint256;
    _amount: Int as uint256;
    _queryId: Int as uint64;
    owner: Address;

    transferAmount: Int as uint256;

    init(master: Address, amount: Int) {
        self.owner = sender();
        self.master = master;
        self.deployTime = now(); //
        self._withdrawedAmount = 0;
        self._amount = amount;
        self._queryId = 0;
        self.transferAmount = 0;
    }

    receive(msg: TokenExcesses){
        if(msg.queryId == self._queryId){
            self._withdrawedAmount += self.transferAmount;
            self._amount -= self.transferAmount;
            self.transferAmount = 0;
        }
    }

    receive(msg: TokenNotification){
        
    }

    receive(msg: Withdraw){

        require(sender() == self.master, "Access denied");
       
        let dayDelta: Int= (( now() - self.deployTime) / (24*60*60)) + 1;
        let availableAmount: Int = dayDelta * self._dayWithdrawAmount;
        self.transferAmount = availableAmount - self._withdrawedAmount;

        require(self._amount >=  self.transferAmount, "Insufficient balance");
        require( self.transferAmount >0, "Insufficient withdraw");

        self._queryId = msg.queryId;

        send(SendParameters{
                to: msg.selfWalletAddress, 
                value: 0, 
                bounce: true,
                mode: SendRemainingValue,
                body: TokenTransfer{ 
                    queryId: self._queryId,
                    amount:  self.transferAmount,
                    destination: self.master,
                    response_destination: myAddress(),
                    custom_payload: emptyCell(),
                    forward_ton_amount: 1000000,
                    forward_payload: beginCell().
                                    storeUint(0, 1).
                                    asSlice()
                }.toCell()
            });
    }

    receive(msg: ChangeMaster){
        self.requireOwner();
        self.master = msg.newMaster;
    }

    get fun withdrawed(): Int{
        return self._withdrawedAmount;
    }

    get fun master(): Address{
        return self.master;
    }

    get fun amount(): Int{
        return self._amount;
    }

    get fun daily(): Int{
        return self._dayWithdrawAmount;
    }
}

message Withdraw{
    selfWalletAddress: Address;
    queryId: Int as uint64;
}

message ChangeMaster{
    newMaster: Address;
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


message(0xd53276db) TokenExcesses {
    queryId: Int as uint64;
}

message(0x7362d09c) TokenNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton 
}