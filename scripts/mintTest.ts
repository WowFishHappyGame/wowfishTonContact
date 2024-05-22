import { Address, Cell, toNano } from '@ton/core';
import { SampleJetton } from '../wrappers/TestToken';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    

     //console.log("content", content)

    const jetton_token = provider.open(SampleJetton.fromAddress(Address.parse("EQB1ygejEd6q3HQ6I2BqGXCr-hCcMl8AmkH8nuBn-yQoszCW")
    ));

    // const jetton_token = provider.open(SampleJetton.fromAddress(Address.parse("EQB1ygejEd6q3HQ6I2BqGXCr-hCcMl8AmkH8nuBn-yQoszCW")
    // ));

    //

    //UQAU_LmEvt-EpjoE3D15HTZK_9_FwPHDC7fwHyL0aYajxEH7

    console.log("owner", await jetton_token.getOwner()) 

    //console.log("getGetJettonData", await jetton_token.getGetJettonData())

    await jetton_token.send(
        provider.sender(),
        {
            value: toNano('0.2'),
        },
        {
            $$type:"Mint",
            amount: BigInt("1000000000000000"),
            //receiver:Address.parse("UQAU_LmEvt-EpjoE3D15HTZK_9_FwPHDC7fwHyL0aYajxEH7")

            //receiver:Address.parse("UQBUo1yw9uUk-9Zwu91W4ydksuPVuWasxC_GjZjms0WhzN5R")

            receiver:Address.parse("EQBtoa9Jz8Qgm9gNm6jeP4S3dI-Nib5ngLAEwzXz9rRx2AJ7")
        }
    );

    console.log("jetton_token address",jetton_token.address )

    // run methods on `wowfishBank`
}
