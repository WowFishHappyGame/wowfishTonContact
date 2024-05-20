import { Address, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { InfrasRouter } from '../wrappers/InfrasRouter';

export async function run(provider: NetworkProvider) {
    const router = provider.open(await InfrasRouter.fromInit());
    await router.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(router.address);
    
    console.log("router ", router.address)
    // run methods on `wowfishBank`
}
