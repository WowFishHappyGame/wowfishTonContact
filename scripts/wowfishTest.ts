import { Address, Cell, toNano , comment, ContractProvider} from '@ton/core';
import { WowFish } from '../wrappers/WowFish';
import { NetworkProvider } from '@ton/blueprint';
import { JettonMaster } from '@ton/ton';

export async function run(provider: NetworkProvider) {
    

     //console.log("content", content)

    const router = provider.open(WowFish.fromAddress(Address.parse("EQAE9rHcUWSfcz7ubbzQU0rXKgta1TxnGaPNrXRGi8u0y5eG")
    ));

    const jt = new JettonMaster(Address.parse("EQB1ygejEd6q3HQ6I2BqGXCr-hCcMl8AmkH8nuBn-yQoszCW"))

    const jw = await jt.getWalletAddress
    (provider.provider(Address.parse("EQB1ygejEd6q3HQ6I2BqGXCr-hCcMl8AmkH8nuBn-yQoszCW")), 
    Address.parse("EQBge-c1OWe8a0m_hxsZBlSgDAUCBTRO8YhgujokOOeT-dUZ"))

    console.log("wallet address", jw)

    await router.send(
        provider.sender(),
        {
            value: toNano('0.5'),
        },
        {
            $$type:"UserWithdrawToken",
            bankWallet: jw,
            amount:toNano("1"),
            queryId:1n
        }
    );

    // run methods on `wowfishBank`
}
