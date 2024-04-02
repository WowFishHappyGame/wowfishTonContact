import { Address, toNano } from '@ton/core';
import { WowfishBank } from '../wrappers/WowfishBank';
import { JettonMaster, JettonWallet ,ContractProvider} from '@ton/ton';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    //prod
    // const token = "EQAKnvanaCL64KvUiiia6cHCXbiGHrscZbHM57wvKSMvMPdx"
    // const bank = "EQD2EuwrGsmqn6un68fUhiX111vPnQew8aTTkOu02Q9jcPm4"

    //test
    const token = "EQB1ygejEd6q3HQ6I2BqGXCr-hCcMl8AmkH8nuBn-yQoszCW"
    const bank = "EQALuB62y0HtUdlxwhjdK7__IhJtW_9eviKM05EaA9RTqRP3"
    

    const jetton =  new JettonMaster(Address.parse(token))
    const contractProvider = provider.provider(Address.parse(token))

    const selfAddress = await jetton.getWalletAddress(contractProvider, Address.parse(bank))

    console.log("self wallet", selfAddress.toString())
    // const toAddress = await jetton.getWalletAddress(contractProvider, Address.parse("UQBUo1yw9uUk-9Zwu91W4ydksuPVuWasxC_GjZjms0WhzN5R"))

    // console.log("to wallet", toAddress.toString())
   // const wowfishBank = provider.open(WowfishBank.fromAddress(Address.parse("EQA7-9iwWAgAMxh-ZFiFWgpTyEH6-gCwds0wdLEAYEXDGcwo")));
    
    const wowfishBank = provider.open(WowfishBank.fromAddress(Address.parse(bank)));
    
   // console.log(await wowfishBank.getBalance())
   // console.log(await wowfishBank.getWithdrawed())
    
    await wowfishBank.send(
        provider.sender(),
        {
            value: toNano('0.2'),
        },
        {
            $$type: 'Withdraw',
            selfWalletAddress: selfAddress,
            queryId: BigInt("1223")
        }
    );

    //await provider.waitForDeploy(wowfishBank.address);

    // run methods on `wowfishBank`
}
