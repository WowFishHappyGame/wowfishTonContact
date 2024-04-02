import { Address, toNano } from '@ton/core';
import { WowfishBank } from '../wrappers/WowfishBank';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const wowfishBank = provider.open(await WowfishBank.fromInit
        (Address.parse("UQBUo1yw9uUk-9Zwu91W4ydksuPVuWasxC_GjZjms0WhzN5R"), BigInt("41000000000000000")));
    await wowfishBank.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(wowfishBank.address);
    
    //console.log("wow ", wowfishBank.address)
    // run methods on `wowfishBank`
}
