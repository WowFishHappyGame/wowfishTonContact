import { Address, toNano, beginCell } from '@ton/core';
import { Akedo } from '../wrappers/Akedo';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const akedo = provider.open(Akedo.fromAddress(Address.parse("EQCmj-Gk7B-AwCr1hPZ_JmAouoKGDAA1d1tuKkT98u3gUPRn")));

    await akedo.send(
        provider.sender(),
        {
            value: toNano('0.5'),
        },
        {
            $$type: 'WithdrawTon',
            amount: 130000000n,
            nonce: 1723456680969385n,
            payload: beginCell().storeStringTail("test3").endCell(),
            expireTime: 1723456700n,
            signature: beginCell().storeBuffer(
                Buffer.from("7096030b573ed47cd8c41f27da6cb100882f53058cb89e0a9f0e2f0fd046afabc5ce85a6c7e1b1ee92d12ffdd5028292af4985b183bc0531119b01128ae7ec00", 'hex')
            ).endCell(),
        }
    );

    //await provider.waitForDeploy(wowfishBank.address);

    // run methods on `wowfishBank`
}
