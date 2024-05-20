import { Address, Cell, toNano , comment} from '@ton/core';
import { WowFish } from '../wrappers/WowFish';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    

     //console.log("content", content)

    const router = provider.open(WowFish.fromAddress(Address.parse("EQCUk2KRGefl92Tga6A--bR78Jhea2vTzJNQq5VNNz7TFUw0")
    ));


    await router.send(
        provider.sender(),
        {
            value: toNano('0.5'),
        },
        {
            $$type:"UserWithdrawToken",
            bankWallet: Address.parse("kQB1ygejEd6q3HQ6I2BqGXCr-hCcMl8AmkH8nuBn-yQos4sc"),
            amount:toNano("1"),
            queryId:1n
        }
    );

    // run methods on `wowfishBank`
}
