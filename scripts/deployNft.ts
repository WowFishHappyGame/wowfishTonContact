import { Address, Cell, toNano } from '@ton/core';
import {SampleJetton } from '../wrappers/TestToken';
import {NftCollection} from "../build/NftCollection/tact_NftCollection";
import { NetworkProvider } from '@ton/blueprint'
import { beginCell } from '@ton/core';

export async function run(provider: NetworkProvider) {
    
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const string_first = "https://tan-glad-sailfish-119.mypinata.cloud/ipfs/QmYwzNq9WRGrJEjjPsK7tDgw4mohwLfhR3pgxK3pLnDJHF/"; // Change to the content URL you prepared
    let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();

     
     //console.log("content", content)

    const owner = provider.sender().address!
    const jetton_token = provider.open(await NftCollection.fromInit(owner,
        newContent, {
            $$type: "RoyaltyParams",
        numerator: 50n, // 50n = 5%
        denominator: 1000n,
        destination: owner,
        },
        100000n,
        BigInt(process.env.Key as string),
        "SSR"
    ));
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
