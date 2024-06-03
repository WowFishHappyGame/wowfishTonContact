import { Address, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { WowFish } from '../wrappers/WowFish';

export async function run(provider: NetworkProvider) {
    const wowfish = provider.open(await WowFish.fromAddress(
        Address.parse("EQCHvAxMlQeLmI6lFazfbYiYElesa3VazPSUsgktEH1Hh-_V")));
    await wowfish.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: "BankAddress",
           bankAddress: Address.parse("EQD3gdA-wuqipxnB3wcCLyvEbhPwh9T7L9Avyw-Db4HZxZ2p")
        }
    );


    // await wowfish.send(
    //     provider.sender(),
    //     {
    //         value: toNano('0.05'),
    //     },
    //     {
    //         $$type: "PayableAddress",
    //        payableAddress: Address.parse("0QCK1aD3YvDLjUverSfse5MFIPgsnD3xUrScc0rsB33mgmt2")
    //     }
    // );

    // await wowfish.send(
    //     provider.sender(),
    //     {
    //         value: toNano('0.05'),
    //     },
    //     {
    //         $$type: "ChangePublic",
    //        pub:BigInt(process.env.Key as string)
    //     }
    // );

    //console.log("wow ", wowfishBank.address)
    // run methods on `wowfishBank`
}
