import { Address, Cell, toNano , comment} from '@ton/core';
import { InfrasRouter } from '../wrappers/InfrasRouter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    

     //console.log("content", content)

    const router = provider.open(InfrasRouter.fromAddress(Address.parse("EQBakSFwsCLAO-blj07i0M4Ta32W9OHagLkaO0jDiulqVpPs")
    ));


    await router.send(
        provider.sender(),
        {
            value: toNano('0.01'),
        },
        {
            $$type:"Transfer",
            to: Address.parse("0QCK1aD3YvDLjUverSfse5MFIPgsnD3xUrScc0rsB33mgmt2"),
            comment: "test comment"
        }
    );

    // run methods on `wowfishBank`
}
