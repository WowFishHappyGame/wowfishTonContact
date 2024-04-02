import { Address, Cell, toNano } from '@ton/core';
import {TokenParent } from '../wrappers/SsToken';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    
    const owner  = Address.parse("EQBUo1yw9uUk-9Zwu91W4ydksuPVuWasxC_GjZjms0WhzIOU")
     
     //console.log("content", content)

    const jetton_token = provider.open(await TokenParent.fromInit());
    //100000000000
    //1000000100n

    await jetton_token.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(jetton_token.address);

    console.log("jetton_token address",jetton_token.address )

    // run methods on `wowfishBank`
}
