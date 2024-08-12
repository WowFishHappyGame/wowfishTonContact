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
        const transferRes =   await deployer.send({
            to: akedo.address,
            value:toNano('10'),
        })
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

    // it('user withdraw', async () => {
    //         const increaser2 = await blockchain.treasury('withdraw2');

    //         const tokenWallet = await token.getGetWalletAddress(akedo.address)

    //         console.log("ssss-", increaser2.getSender().address)
    //         const price =  toNano('0.2')
    //         const increaseResulte = await akedo.send(
    //             increaser2.getSender(),
    //             {
    //                 value: price * 2n,
    //             },
    //             {
    //                 $$type: "WithdrawToken",
    //                 tokenWallet: tokenWallet,
    //                 amount: 130000000n,
    //                 nonce: 1722920108833485n,
    //                 payload: beginCell().storeStringTail("testwithdraw4").endCell(),
    //                 expireTime:1722920208n,
    //                 signature: beginCell().storeBuffer(
    //                     Buffer.from("0155e1b138b495288582ed45f079383cc0d96d47d691343237a26e9e587a85972931be4533e3c1585ca1541b847a02d11f146d760870b55e61a3bf4279ebd607", 'hex')
    //                 ).endCell(),
    //             }
    //         );

    //         expect(increaseResulte.transactions).toHaveTransaction({
    //             from: increaser2.address,
    //             to: akedo.address,
    //             success: true,
    //         });
    // });

    it('user withdraw ton', async () => {
        const increaser2 = await blockchain.treasury('withdraw2');


        console.log("withdraw ton-", increaser2.getSender().address)
        const price =  toNano('0.2')
        const increaseResulte = await akedo.send(
            increaser2.getSender(),
            {
                value: price * 2n,
            },
            {
                $$type: "WithdrawTon",
                amount: 130000000n,
                nonce: 1723455542154002n,
                payload: beginCell().storeStringTail("42958262894593").endCell(),
                expireTime: 1723455642n,
                signature: beginCell().storeBuffer(
                    Buffer.from("47210571c70f9025cdb981bfdef1ecc9cd0fd35bc28142f4664b0bb2390efab4167d3a0731afb110d3b38a1691a08902607be87cf219fa78da0ddf740f084d07", 'hex')
                ).endCell(),
            }
        );

        expect(increaseResulte.transactions).toHaveTransaction({
            from: increaser2.address,
            to: akedo.address,
            success: true,
        });

        // const increaseResulte2 = await akedo.send(
        //     increaser2.getSender(),
        //     {
        //         value: price * 2n,
        //     },
        //     {
        //         $$type: "WithdrawTon",
        //         amount: 130000000n,
        //         nonce: 1723454680984229n,
        //         payload: beginCell().storeStringTail("42958262894593_122122").endCell(),
        //         expireTime: 1723454780n,
        //         signature: beginCell().storeBuffer(
        //             Buffer.from("dd09b4562807719214f1d8ddf025584e53d655dab4ffd9337cef18bbb7ee30ce5982ce791830b385493f45d385f47f4ee3dafd9085ab3d52cca1964553a9410b", 'hex')
        //         ).endCell(),
        //     }
        // );

        // expect(increaseResulte2.transactions).toHaveTransaction({
        //     from: increaser2.address,
        //     to: akedo.address,
        //     success: true,
        // });
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
