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
            value: toNano('0.02'),
        },
        {
            $$type: 'ChangeMaster',
            newMaster: Address.parse("UQBUo1yw9uUk-9Zwu91W4ydksuPVuWasxC_GjZjms0WhzN5R"),
        }
    );

    //await provider.waitForDeploy(wowfishBank.address);

    // run methods on `wowfishBank`
}
