import { Address, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { WowFish } from '../wrappers/WowFish';

export async function run(provider: NetworkProvider) {
    const wowfish = provider.open(await WowFish.fromInit());
    await wowfish.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(wowfish.address);
    
    //console.log("wow ", wowfishBank.address)
    // run methods on `wowfishBank`
}
