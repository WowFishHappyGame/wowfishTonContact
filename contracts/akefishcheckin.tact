import "@stdlib/deploy";

contract AkeFishCheckin with Deployable {
    const MinTonForStorage: Int = ton("0.003"); // enough for 1 KB of storage for 2.5 years

    init() {
       
    }
    receive(){
        
    }
    receive (msg: Checkin){
        if (myBalance() - context().value < self.MinTonForStorage) {
            send(SendParameters{
                to: sender(),
                bounce: true,
                value: myBalance() - self.MinTonForStorage,
                mode:  SendIgnoreErrors
            });
        }else{
             send(SendParameters{
                to: sender(),
                bounce: true,
                value: 0,
                mode: SendRemainingValue + SendIgnoreErrors
            });
        }
        
    }
}

message Checkin{
 tgid: String;
}

