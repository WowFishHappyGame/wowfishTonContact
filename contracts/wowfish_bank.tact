import "@stdlib/deploy";
import "@stdlib/ownable";

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


    transferCache: map<Int, Cache>;

    init(master: Address, amount: Int) {
        self.owner = sender();
        self.master = master;
        self.deployTime = now(); //
        self._withdrawedAmount = 0;
        self._amount = amount;
        self.transferCache = emptyMap();
    }

    receive(msg: TokenExcesses){
        let cache: Cache? = self.transferCache.get(msg.queryId);
        if(cache != null){
            self._withdrawedAmount += (cache!!).amount;
            self._amount -= (cache!!).amount;

            send(SendParameters{
                to: (cache!!).to, 
                value: 0,
                bounce: false,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: TokenExcesses{
                    queryId: msg.queryId
                }.toCell()
            });
        }
    }

    receive(msg: TokenNotification){
        
    }

    receive(msg: Withdraw){

        require(sender() == self.master, "Access denied");

        let queryIdCheck: Cache? = self.transferCache.get(msg.queryId);
        require(queryIdCheck == null, "queryId repetion");
       
        let availableAmount: Int = self.availableAmount();
        
        require(self._amount >=   msg.amount && availableAmount >=  msg.amount, "Insufficient balance");
        require( msg.amount >0, "Insufficient withdraw");

        self.transferCache.set(msg.queryId, Cache{
            to: msg.toWalletAddress,
            amount: msg.amount
        });

        send(SendParameters{
                to: msg.bankWallet, 
                value: 0, 
                bounce: true,
                mode: SendRemainingValue,
                body: TokenTransfer{ 
                    queryId:  msg.queryId,
                    amount:  msg.amount,
                    destination: msg.toWalletAddress,
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

    get fun availableAmount(): Int{
        let dayDelta: Int= (( now() - self.deployTime) / (24*60*60)) + 1;
        let availableAmount: Int = dayDelta * self._dayWithdrawAmount;
        return availableAmount - self._withdrawedAmount;
    }
}

message Withdraw{
    bankWallet: Address;
    toWalletAddress: Address;
    amount: Int as uint256;
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