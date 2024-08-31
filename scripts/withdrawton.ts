import { Address, toNano, beginCell } from '@ton/core';
import { Akedo } from '../wrappers/Akedo';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const akedo = provider.open(Akedo.fromAddress(Address.parse("EQCoAo_iusie5jmq5EWa39klEg7CQ7q8FSeF0Z3y2RTkq3aP")));

    await akedo.send(
        provider.sender(),
        {
            value: toNano('0.5'),
        },
        {
            $$type: 'WithdrawTon',
            amount: 130000000n,
            nonce: 1723640684776432n,
            payload: beginCell().storeStringTail("test115").endCell(),
            expireTime: 1723643684n,
            signature: beginCell().storeBuffer(
                Buffer.from("d0bdb33ddfbc8f8101686f52ca95315f9359b100e56046f0f30bde764e01c1b126d6aad3e5be8214da4641abcf5ab342e469963aca7ec7ff0a522385238d7605", 'hex')
            ).endCell(),
        }
    );

    //await provider.waitForDeploy(wowfishBank.address);

    // run methods on `wowfishBank`
}
