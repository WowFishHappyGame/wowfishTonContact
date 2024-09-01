import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano ,Address, beginCell, Cell, comment} from '@ton/core';
import { AkeFishCheckin } from '../wrappers/AkeFishCheckin';
import '@ton/test-utils';
//import { ContractSystem } from "@tact-lang/emulator";
import * as dotenv from 'dotenv';

import { SampleJetton } from '../wrappers/TestToken';

// 在测试文件开头加载 .env
dotenv.config();


describe('Akedo', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let akedo: SandboxContract<AkeFishCheckin>;

    let token: SandboxContract<SampleJetton>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        akedo = blockchain.openContract(await AkeFishCheckin.fromInit());
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

    });

    it('should deploy', async () => {


        // the check is done inside beforeEach
        // blockchain and wowfishBank are ready to use

    });

  
    it('check in', async () => {
        const increaser2 = await blockchain.treasury('withdraw2');


        console.log("withdraw ton-", increaser2.getSender().address)
        const price =  toNano('0.008')
        const increaseResulte = await akedo.send(
            increaser2.getSender(),
            {
                value: price
            },
            {
                $$type: "Checkin",
                tgid: "6052416422"
            }
        );

        expect(increaseResulte.transactions).toHaveTransaction({
            from: increaser2.address,
            to: akedo.address,
            success: true,
        });
    });
    it('check in2', async () => {
        const increaser2 = await blockchain.treasury('withdraw2');


        console.log("withdraw ton-", increaser2.getSender().address)
        const price =  toNano('0.008')
        const increaseResulte = await akedo.send(
            increaser2.getSender(),
            {
                value: price
            },
            {
                $$type: "Checkin",
                tgid: "6052416422"
            }
        );

        expect(increaseResulte.transactions).toHaveTransaction({
            from: increaser2.address,
            to: akedo.address,
            success: true,
        });
    });
});
