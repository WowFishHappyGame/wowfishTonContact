import { Address, Cell, toNano , comment} from '@ton/core';
import { InfrasRouter } from '../wrappers/InfrasRouter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    

     //console.log("content", content)

    const router = provider.open(InfrasRouter.fromAddress(Address.parse("EQD8CvnjFem3suCL4Mr2snpgGzh0m5SSPRYcfMY4I1Gn0Gn3")
    ));


    await router.send(
        provider.sender(),
        {
            value: toNano('0.001'),
        },
        "withdraw"
    );

    // run methods on `wowfishBank`
}
