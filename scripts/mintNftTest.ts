import { Address, Cell, toNano } from '@ton/core';
import {NftCollection} from "../build/NftCollection/tact_NftCollection";
import { NetworkProvider } from '@ton/blueprint'
import { beginCell } from '@ton/core';

export async function run(provider: NetworkProvider) {
    

    const owner = provider.sender().address!
    const jetton_token = provider.open(await NftCollection.fromAddress(Address.parse("EQAa3jUP0lYWFWDLDDXevrShP32cJUb0mOY2qrtj2-OIee9u")));
    //100000000000
    //1000000100n

    await jetton_token.send(
        provider.sender(),
        {
            value: toNano('0.5'),
        },
        "Mint",
    );

    //await provider.waitForDeploy(jetton_token.address);

    console.log("jetton_token address",jetton_token.address )

    // run methods on `wowfishBank`
}
