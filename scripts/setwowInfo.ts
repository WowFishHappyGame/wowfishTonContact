import { Address, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { WowFish } from '../wrappers/WowFish';

export async function run(provider: NetworkProvider) {

    
    const wowfish = provider.open(await WowFish.fromAddress(
        Address.parse("EQAf4ZPl5tfYTWB-7q_c_fO9874X0HnimlKPzBtL579Iqepd")));

    //测试环境用的正式链管理合约
    // const wowfish = provider.open(await WowFish.fromAddress(
    //       Address.parse("EQBRqg2d_l-rdKX8tTiZykbUl9ApRVFmYZoW_LEgLSZaHho1")));

    //正式环境用的管理合约
    // const wowfish = provider.open(await WowFish.fromAddress(
    //     Address.parse("EQBRqg2d_l-rdKX8tTiZykbUl9ApRVFmYZoW_LEgLSZaHho1")));
        //
    await wowfish.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: "BankAddress",
           bankAddress: Address.parse("EQBSaW7vzSFpMQAxqHaN3URGLv8khgL0Mp75qr5XPDI_O-TI")
        }
    );


    // await wowfish.send(
    //     provider.sender(),
    //     {
    //         value: toNano('0.05'),
    //     },
    //     {
    //         $$type: "PayableAddress",
    //        payableAddress: Address.parse("UQAoS5sqlgCouZI7_4hLxG8gK9J6LZKb3KASmFUoUTy7dU7z")
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
