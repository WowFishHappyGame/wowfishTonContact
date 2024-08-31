import { Address, Cell, toNano } from '@ton/core';
import { AkeFishCheckin } from '../wrappers/AkeFishCheckin';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
   
 
    const akefishCheckin = provider.open(await AkeFishCheckin.fromInit());
    //100000000000
    //1000000100n
    console.log( toNano("15"))

    await akefishCheckin.send(
        provider.sender(),
        {
            value: toNano('0.005'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    console.log("akefishCheckin address",akefishCheckin.address )

    // run methods on `wowfishBank`
}
