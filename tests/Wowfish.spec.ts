import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano ,Address,Cell, beginCell, comment} from '@ton/core';
import { WowFish } from '../wrappers/WowFish';
import { WowfishBank } from '../wrappers/WowfishBank';
import { SampleJetton } from '../wrappers/TestToken';
import '@ton/test-utils';

import * as dotenv from 'dotenv';

// 在测试文件开头加载 .env
dotenv.config();

describe("withdraw", ()=>{
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let wowfish: SandboxContract<WowFish>;
    let wowfisBank: SandboxContract<WowfishBank>;
    let wowfishToken: SandboxContract<SampleJetton>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        console.log("process.env.Key as string",process.env.Key as string)
        wowfish = blockchain.openContract(await WowFish.fromInit( BigInt(process.env.Key as string)));
        let deployResult = await wowfish.send(
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
            to: wowfish.address,
            deploy: true,
            success: true,
        });

        console.log("deploy finish")

        console.log("wowfish", wowfish.address)

        //depoly bank
        wowfisBank = blockchain.openContract(await WowfishBank.fromInit( wowfish.address, 4100000000n))
        deployResult = await wowfisBank.send(
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
            to: wowfisBank.address,
            deploy: true,
            success: true,
        });
        console.log("wowowfisBankwfish", wowfisBank.address)
         //depoly token
        wowfishToken = blockchain.openContract(await SampleJetton.fromInit(deployer.address, new Cell(), BigInt(100000000000000000)))
        deployResult = await wowfishToken.send(deployer.getSender(),
            {
            value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            })

            expect(deployResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: wowfishToken.address,
                deploy: true,
                success: true,
            });

            console.log("wowfishToken", wowfishToken.address)
    });

    it("mint", async ()=>{

        console.log("deployer", await deployer.address) 
        console.log("owner", await wowfishToken.getOwner()) 
        const mintRes = await wowfishToken.send(
            deployer.getSender(),
            {
                value: toNano("0.2")
            },
            {
                $$type:"Mint",
                amount:4100000000000000n,
                receiver:wowfisBank.address
            }
        )
        expect(mintRes.transactions).toHaveTransaction({
            from: deployer.address,
            to: wowfishToken.address,
            success: true,
        });
    })

    it("set wowinfo", async ()=>{
        const setInfoRes = await wowfish.send(
            deployer.getSender(),
            {
                value: toNano("0.1")
            },
            {
                $$type:"BankAddress",
                bankAddress: wowfisBank.address
            }
        )
        expect(setInfoRes.transactions).toHaveTransaction({
            from: deployer.address,
            to: wowfish.address,
            success: true,
        });
    })

    it("withdraw", async ()=>{
        const user = await blockchain.treasury('user');
        console.log("withdraw user", user.address)

        console.log("amount", toNano("41"))

        const walletAddress = await wowfishToken.getGetWalletAddress(wowfisBank.address)

        const withDrawRes = await wowfish.send(user.getSender(),{
            value: toNano("0.2")
        },{
            $$type:"UserWithdrawToken",
            bankWallet:walletAddress,
            amount:toNano("41"),
            queryId:BigInt(0),
            nonce:1720187951820129n,
            payload:beginCell().storeStringTail("withdraw comment").endCell(),
            //payload: comment("withdraw comment"),
            signature:beginCell().storeBuffer(
                Buffer.from("d7923264437cf93aea6c11859a2be296ce7768d18046c5ae0b16b2b0b6e81c0fdd8e6f9208b8aabff66527b665f34b509e4937cae7c1b524b5f66e748c6f8908", 'hex')
            ).endCell()
        })

        expect(withDrawRes.transactions).toHaveTransaction({
            from: user.address,
            to: wowfish.address,
            success: true,
        });
    })
})