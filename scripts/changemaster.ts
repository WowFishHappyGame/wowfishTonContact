import { Address, toNano } from '@ton/core';
import { WowfishBank } from '../wrappers/WowfishBank';
import { JettonMaster, JettonWallet ,ContractProvider} from '@ton/ton';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const bank = "EQALuB62y0HtUdlxwhjdK7__IhJtW_9eviKM05EaA9RTqRP3"
    const wowfishBank = provider.open(WowfishBank.fromAddress(Address.parse(bank)));
    
   // console.log(await wowfishBank.getBalance())
   // console.log(await wowfishBank.getWithdrawed())
    
    await wowfishBank.send(
        provider.sender(),
        {
            value: toNano('0.2'),
        },
        {
            $$type: 'ChangeMaster',
            newMaster: Address.parse("UQAu6nL4g_if9LUHCBoYSvflAWybZJPym7G52JT2Mg7XCLiU"),
        }
    );

    //await provider.waitForDeploy(wowfishBank.address);

    // run methods on `wowfishBank`
}
