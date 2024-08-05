import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano ,Address, beginCell, Cell, comment} from '@ton/core';
import { Akedo } from '../wrappers/Akedo';
import '@ton/test-utils';
//import { ContractSystem } from "@tact-lang/emulator";
import * as dotenv from 'dotenv';

import { SampleJetton } from '../wrappers/TestToken';

// 在测试文件开头加载 .env
dotenv.config();


describe('Akedo', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let akedo: SandboxContract<Akedo>;

    let token: SandboxContract<SampleJetton>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        akedo = blockchain.openContract(await Akedo.fromInit( BigInt(process.env.AkedoKey as string)));
        let deployResult = await akedo.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: akedo.address,
            deploy: true,
            success: true,
        });

        console.log("deploy finish")
        console.log("akedo", akedo.address)

        //部署token

        token = blockchain.openContract(await SampleJetton.fromInit(deployer.address,
            new Cell(), BigInt(100000000000000000)
        ));
        let tokenRes = await token.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(tokenRes.transactions).toHaveTransaction({
            from: deployer.address,
            to: token.address,
            deploy: true,
            success: true,
        });

        // //mint
        const mintRes =  await token.send(
            deployer.getSender(),
            {
                value: toNano('0.2'),
            },
            {
                $$type:"Mint",
                amount: BigInt("1000000000000"),
                receiver:akedo.address
            }
        );

        expect(mintRes.transactions).toHaveTransaction({
            from: deployer.address,
            to: token.address,
            deploy: false,
            success: true,
        });

        //转ton
        const transferRes = await akedo.send(
            deployer.getSender(),
            {
                value: toNano('10'),
            },
            "recive ton"
        )
        expect(transferRes.transactions).toHaveTransaction({
            from: deployer.address,
            to: akedo.address,
            deploy: false,
            success: true,
        });
    

    });

    it('should deploy', async () => {


        // the check is done inside beforeEach
        // blockchain and wowfishBank are ready to use

    });

    it('user withdraw', async () => {
            const increaser2 = await blockchain.treasury('withdraw2');

            const tokenWallet = await token.getGetWalletAddress(akedo.address)

            console.log("ssss-", increaser2.getSender().address)
            const price =  toNano('0.2')
            const increaseResulte = await akedo.send(
                increaser2.getSender(),
                {
                    value: price * 2n,
                },
                {
                    $$type: "WithdrawToken",
                    tokenWallet: tokenWallet,
                    amount: 130000000n,
                    nonce: 1722486221526437n,
                    payload: beginCell().storeStringTail("huehwqeweu1").endCell(),
                    signature: beginCell().storeBuffer(
                        Buffer.from("a21b04e83fe2f749fa490a904ea75e39d860517e8d42cdcc4fb8a6c0c29d696ff0c33657fa89ea332c6aa7e5a8b2033a218f99d7cf60cf7e6b07a276429a7f0d", 'hex')
                    ).endCell(),
                }
            );

            expect(increaseResulte.transactions).toHaveTransaction({
                from: increaser2.address,
                to: akedo.address,
                success: true,
            });
    });

    it('withdraw test', async ()=>{

        const price =  toNano('0.2')
        const tokenWallet = await token.getGetWalletAddress(akedo.address)
        const increaseResulte = await akedo.send(
            deployer.getSender(),
            {
                value: price * 2n,
            },
            {
                $$type: "AdminWithdraw",
                tokenWallet: tokenWallet,
                amount: 100000000000n
            }
        );

        expect(increaseResulte.transactions).toHaveTransaction({
            from: deployer.address,
            to: akedo.address,
            success: true,
        });

        const wResault = await akedo.send(deployer.getSender(),
        {
            value: price * 2n,
        },
        "withdraw")
        expect(wResault.transactions).toHaveTransaction({
            from: deployer.address,
            to: akedo.address,
            success: true,
        });
    })
});
