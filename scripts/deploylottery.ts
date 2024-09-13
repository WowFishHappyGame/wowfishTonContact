import { Address, Cell, toNano } from '@ton/core';
import { Lottery } from '../wrappers/Lottery';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
   
 
    const lottery = provider.open(await Lottery.fromInit());
    //100000000000
    //1000000100n

    await lottery.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(lottery.address);

    console.log("lottery address",lottery.address )

    // run methods on `wowfishBank`
}
