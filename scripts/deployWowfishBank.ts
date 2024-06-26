import { Address, toNano } from '@ton/core';
import { WowfishBank } from '../wrappers/WowfishBank';
import { NetworkProvider } from '@ton/blueprint';
import { JettonMaster } from '@ton/ton';

export async function run(provider: NetworkProvider) {

    //获取wallet_address
    const token_address = "EQB1ygejEd6q3HQ6I2BqGXCr-hCcMl8AmkH8nuBn-yQoszCW"

    const jetton_master = JettonMaster.create(Address.parse(token_address))
    
    const wowfishBank = provider.open(await WowfishBank.fromInit
        
        (Address.parse("EQBWX3YRml6ba2g-oTXrLyyIhjAy9YolbSt5vgroHIlIIYob"), BigInt("41000000000000000")));
    await wowfishBank.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(wowfishBank.address);
    
    //console.log("wow ", wowfishBank.address)
    // run methods on `wowfishBank`
}
