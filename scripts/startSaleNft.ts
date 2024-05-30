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
    //sr
    //const jetton_token = provider.open(await NftCollection.fromAddress(Address.parse("EQD2z4QvkFKESVFDIIT5uUWwB7srPdmYMk8PoUynAfIHz2To")));
    
    //ssr
    const jetton_token = provider.open(await NftCollection.fromAddress(Address.parse("EQAru3NVhkA-3kwb0y9SayCJdhzqNxFskBthQ4bq6RRGFEzD")));
    
    
    //100000000000
    //1000000100n

    await jetton_token.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: "MintControl",
            lastTime: 1719736668n,
            maxCountInTime: 100n
        }
    );

    await provider.waitForDeploy(jetton_token.address);

    console.log("jetton_token address",jetton_token.address )

    // run methods on `wowfishBank`
}
