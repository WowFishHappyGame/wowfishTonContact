import { Address, Cell, toNano } from '@ton/core';
import { Akedo } from '../wrappers/Akedo';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
   
 
    const akedo = provider.open(Akedo.fromAddress(Address.parse("EQCmj-Gk7B-AwCr1hPZ_JmAouoKGDAA1d1tuKkT98u3gUPRn")));
    //100000000000
    //1000000100n
    console.log( toNano("15"))

    await akedo.send(
        provider.sender(),
        {
            value: toNano('0.005'),
        },
        {
            $$type: "MaxWithAmount",
            amount: toNano("15"),
        }
    );

    console.log("akedo address",akedo.address )

    // run methods on `wowfishBank`
}
