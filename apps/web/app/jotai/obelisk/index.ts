"use client";

import { atom } from "jotai";
import { Obelisk, loadMetadata} from "@0xobelisk/sui-client";
import { NETWORK, PACKAGE_ID } from "../../chain/config";

const init_obelisk_client = async () => {
    const metadata = await loadMetadata(NETWORK, PACKAGE_ID);
    const obelisk = new Obelisk({
        // fullnodeUrls:[
        //     "https://rpc-testnet.suiscan.xyz:443"
        // ],
        networkType: NETWORK,
        packageId: PACKAGE_ID,
        metadata: metadata,
    });
    return obelisk;
}

const obelisk_client = atom(init_obelisk_client);

export {
    obelisk_client,
    init_obelisk_client
    
}
