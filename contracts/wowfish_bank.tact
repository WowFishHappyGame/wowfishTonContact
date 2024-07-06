import "@stdlib/deploy";
import "@stdlib/ownable";
import "./message";

struct Cache {
    to: Address;
    amount: Int as int256;
}

contract WowfishBank with OwnableTransferable, Deployable {
    master: Address;
    deployTime: Int as uint32;
    const _dayWithdrawAmount : Int = 100000000000000;
    _withdrawedAmount: Int as uint256;
    _amount: Int as uint256;
    owner: Address;

    init(master: Address, amount: Int) {
        self.owner = sender();
        self.master = master;
        self.deployTime = now(); //
        self._withdrawedAmount = 0;
        self._amount = amount;
    }

    receive(msg: TokenExcesses){
    }

    receive(msg: TokenNotification){
        self._withdrawedAmount +=  msg.amount;
        self._amount -= msg.amount;
    }

    receive(msg: Withdraw){

        require(sender() == self.master, "Access denied");

        let availableAmount: Int = self.availableAmount();
        require(self._amount >=   msg.amount && availableAmount >=  msg.amount, "Insufficient balance");
        require( msg.amount >0, "Insufficient withdraw");

        send(SendParameters{
                to: msg.bankWallet, 
                value: 0, 
                bounce: true,
                mode: SendRemainingValue,
                body: TokenTransfer{ 
                    queryId:  msg.queryId,
                    amount:  msg.amount,
                    destination: msg.toWalletAddress,
                    response_destination: msg.toWalletAddress,
                    custom_payload: emptyCell(),
                    forward_ton_amount: 1000000,
                    forward_payload: msg.payload
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

    get fun availableAmount(): Int{
        let dayDelta: Int= (( now() - self.deployTime) / (24*60*60)) + 1;
        let availableAmount: Int = dayDelta * self._dayWithdrawAmount;
        return availableAmount - self._withdrawedAmount;
    }
}

message ChangeMaster{
    newMaster: Address;
}
