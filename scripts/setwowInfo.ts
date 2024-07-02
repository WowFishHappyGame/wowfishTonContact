import { Address, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { WowFish } from '../wrappers/WowFish';

export async function run(provider: NetworkProvider) {

    
    // const wowfish = provider.open(await WowFish.fromAddress(
    //     Address.parse("EQDU1KAA5kUUr-L-dxa58E0fm1L8UShHmEKJifcEiwHkNN84")));

    //测试环境用的正式链管理合约
    const wowfish = provider.open(await WowFish.fromAddress(
          Address.parse("EQBRqg2d_l-rdKX8tTiZykbUl9ApRVFmYZoW_LEgLSZaHho1")));

    //正式环境用的管理合约
    // const wowfish = provider.open(await WowFish.fromAddress(
    //     Address.parse("EQBRqg2d_l-rdKX8tTiZykbUl9ApRVFmYZoW_LEgLSZaHho1")));
        //
    // await wowfish.send(
    //     provider.sender(),
    //     {
    //         value: toNano('0.05'),
    //     },
    //     {
    //         $$type: "BankAddress",
    //        bankAddress: Address.parse("EQD3gdA-wuqipxnB3wcCLyvEbhPwh9T7L9Avyw-Db4HZxZ2p")
    //     }
    // );


    await wowfish.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: "PayableAddress",
           payableAddress: Address.parse("UQAoS5sqlgCouZI7_4hLxG8gK9J6LZKb3KASmFUoUTy7dU7z")
        }
    );

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
