import { Address, Cell, toNano } from '@ton/core';
import { SampleJetton } from '../wrappers/TestToken';
import { NetworkProvider } from '@ton/blueprint';
import { NftCollection } from '../wrappers/NftCollection';

export async function run(provider: NetworkProvider) {
    


    const nft = provider.open(NftCollection.fromAddress(Address.parse("EQB1ygejEd6q3HQ6I2BqGXCr-hCcMl8AmkH8nuBn-yQoszCW")
    ));


    await nft.send(
        provider.sender(),
        {
            value: toNano('0.2'),
        },
        {
            $$type:"ChangePublic",
            pub: BigInt("41000000000000000"),
        }
    );

    console.log("jetton_token address",nft.address)

    // run methods on `wowfishBank`
}
