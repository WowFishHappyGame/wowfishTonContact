import { Address, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { WowFish } from '../wrappers/WowFish';

export async function run(provider: NetworkProvider) {
    console.log("key: ", process.env.Key as string)
    const wowfish = provider.open(await WowFish.fromInit(BigInt(process.env.Key as string)));
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
