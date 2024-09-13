import "@stdlib/deploy";
import "@stdlib/ownable";

struct Prize {
    prize: Int as coins;
    name: String;
    probability: Int;
}

message(0xf1368ddf) DrawLottery {
}

contract Lottery with Deployable, OwnableTransferable {
    const minTonsForStorage: Int = ton("0.01");
    const gasConsumption: Int = ton("0.01");
    owner: Address;
    prizes: map<Int, Prize>;
    prizeCount: Int = 0;
    totalProbability: Int = 10000;
    init() {
        self.owner = sender();
        self.generatePrizes();
    }

    receive("DepositTON") {
        require(sender() == self.owner, "Only owner can deposit");
    }
    receive("WithdrawTON") {
        require(sender() == self.owner, "Only owner can withdraw");
        send(SendParameters{
            to: sender(),
            value: myBalance(),
            mode: SendRemainingBalance
        });
    }
    fun generatePrizes() {
        self.prizes.set(0, Prize{prize: 1000, name: "1000 Points", probability: 3500}); //35%
        self.prizes.set(1, Prize{prize: 0, name:"Thanks", probability: 1895}); //18.95%
        self.prizes.set(2, Prize{prize: 5000, name: "5000 Points", probability: 1500}); //15%
        self.prizes.set(3, Prize{prize: ton("1"), name: "1 TON", probability: 1500});//15%
        self.prizes.set(4, Prize{prize: 10000, name: "10000 Points", probability: 1000}); //10%
        self.prizes.set(5, Prize{prize: ton("10"), name: "10 TON", probability: 600}); //6%
        self.prizes.set(6, Prize{prize: ton("100"), name: "100 TON", probability: 5}); //0.05%
        self.prizeCount = 7;
        self.reply("".asComment());
    }

    receive(msg: DrawLottery) {
        let ctx: Context = context(); 
        let fwdFee: Int = 2 * ctx.readForwardFee();  
        let final: Int =  self.gasConsumption + self.minTonsForStorage + fwdFee;
        require(ctx.value >= ton("1") + min(final, ton("0.01")), "greater than 1 TON");
        let sender: Address = ctx.sender;
        let cumulativeProbability: Int = 0;
        let i: Int = 0;
        let randomNumber: Int = random(0,self.totalProbability) + 1;
        let continueLoop: Bool = true;
        repeat(self.prizeCount) {
            if (continueLoop) {
                let prize: Prize = self.prizes.get(i)!!;
                cumulativeProbability = cumulativeProbability + prize.probability;
                if (randomNumber <= cumulativeProbability) {
                    if (prize.prize >= ton("1")) {
                        let balance: Int = myBalance();
                        if (balance >= prize.prize) {
                            continueLoop = false;
                            send(SendParameters{
                                bounce: false,
                                to: sender, 
                                value: prize.prize, 
                                mode:  SendPayGasSeparately,
                                body: beginCell().storeSlice(prize.name.asSlice()).endCell()
                            });
                        } else {
                            continueLoop = false;
                            self.reply("not enough balance".asComment());
                        }
                    } else {
                        continueLoop = false;
                        send(SendParameters{
                                bounce: false,
                                to: sender, 
                                value: 0, 
                                mode:  SendPayGasSeparately,
                                body: beginCell().storeSlice(prize.name.asSlice()).endCell()
                            });
                    }
                } 
                i = i + 1;
            }
        }
    }
}