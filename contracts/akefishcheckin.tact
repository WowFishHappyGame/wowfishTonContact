import "@stdlib/deploy";

contract AkeFishCheckin with Deployable {
    const MinTonForStorage: Int = ton("0.01"); // enough for 1 KB of storage for 2.5 years

    init() {
       
    }
    receive (msg: Checkin){
         send(SendParameters{
            to: sender(),
            bounce: true,
            value: 0,
            mode: SendRemainingValue
        });
    }
}

message Checkin{

}

