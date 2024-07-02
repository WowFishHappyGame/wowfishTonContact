import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano ,Address, beginCell} from '@ton/core';
import { NftCollection } from '../wrappers/NftCollection';
import '@ton/test-utils';
//import { ContractSystem } from "@tact-lang/emulator";

describe('WowfishBank', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nft: SandboxContract<NftCollection>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        const OFFCHAIN_CONTENT_PREFIX = 0x01;
        const string_first = "https://tan-glad-sailfish-119.mypinata.cloud/ipfs/QmZoxsp29V2iNJkyctwhVAC3YKNkxEuiK25bFbAHwe69JP/"; // Change to the content URL you prepared
        let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();
    
        nft = blockchain.openContract(await NftCollection.fromInit(
            deployer.address, 
            newContent,
            {
                $$type: "RoyaltyParams",
                numerator: 50n, // 50n = 5%
                denominator: 1000n,
                destination: deployer.address,
            },
            1000000n,
            BigInt(process.env.Key as string),
            "SR"
        ));
        const deployResult = await nft.send(
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
            to: nft.address,
            deploy: true,
            success: true,
        });

        console.log("deploy finish")

        console.log("wowfish", nft.address)
    });

    it('should deploy', async () => {


        // the check is done inside beforeEach
        // blockchain and wowfishBank are ready to use

    });
    it('open sale', async () => {

        const increaseResult = await nft.send(
            deployer.getSender(),
                {
                    value: toNano('0.1'),
                },
                {
                    $$type: "MintControl",
                    lastTime: 1722310164n,//befor7-30
                    maxCountInTime: 100n
                }
        )
        expect(increaseResult.transactions).toHaveTransaction({
                        from: deployer.address,
                        to: nft.address,
                        success: true,
                    });
    })

    it('mint', async () => {
            const increaser2 = await blockchain.treasury('withdraw2');

            console.log("ssss-", increaser2.getSender().address)
            const price =  toNano('0.2')
            const increaseResulte = await nft.send(
                increaser2.getSender(),
                {
                    value: price * 2n,
                },
                {
                    $$type: "Mint",
                    price: price,
                    count: 2n,
                    nonce: 1717222031134457n,
                    queryId: 1717222031134457n,
                    signature: beginCell().storeBuffer(
                        Buffer.from("fc7ac65680b26cb81211112b9a8d9fa508694eb5d9da1d5b1a322292936991b54ba26c9f836cfb2d080da18b5a64e35a79cb51e9498a6b9363d0966be6783304", 'hex')
                    ).endCell()
                }
            );

            expect(increaseResulte.transactions).toHaveTransaction({
                from: increaser2.address,
                to: nft.address,
                success: true,
            });
    });

    // it('withdraw test', async ()=>{

    //     let system = await ContractSystem.create();
    //     let contract = system.open(await WowFish.fromInit());
    //     let owner = system.treasure("owner");
    //     await contract.send(owner, {
    //         value: toNano('0.1'),
    //     },
    //     {
    //         $$type: 'UserWithdrawToken',
    //         bankWallet: Address.parse("EQD60P_ISLmoDnzzQ-EvehzA9hTEyFxyxnQ-HIx3hwFEZkbm"),
    //         amount: toNano("0.1"),
    //         queryId:0n,
    //         nonce: 1716451160954894n,
    //         signature: beginCell().storeBuffer(
    //             Buffer.from("41ed3d52155ed7fac9e32ababdec35eddcef508e220d93833fe60e56173ed8c73926f0c869054ad14c5b1924020e44bfdd3dd9439acbb3bdcbd283258358f60a", 'hex')
    //         ).endCell()
    //     });
    //     await system.run();
    // })
});
