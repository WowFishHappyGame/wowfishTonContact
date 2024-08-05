import { Address, Cell, toNano } from '@ton/core';
import { Akedo } from '../wrappers/Akedo';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
   
 
    const akedo = provider.open(await Akedo.fromInit(BigInt(process.env.AkedoKey as string) ));
    //100000000000
    //1000000100n

    await akedo.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(akedo.address);

    console.log("akedo address",akedo.address )

    // run methods on `wowfishBank`
}
