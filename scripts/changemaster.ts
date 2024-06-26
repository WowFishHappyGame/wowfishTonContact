import { Address, toNano } from '@ton/core';
import { WowfishBank } from '../wrappers/WowfishBank';
import { JettonMaster, JettonWallet ,ContractProvider} from '@ton/ton';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const bank = "EQD3gdA-wuqipxnB3wcCLyvEbhPwh9T7L9Avyw-Db4HZxZ2p"
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
            newMaster: Address.parse("EQCHvAxMlQeLmI6lFazfbYiYElesa3VazPSUsgktEH1Hh-_V"),
        }
    );

    //await provider.waitForDeploy(wowfishBank.address);

    // run methods on `wowfishBank`
}
