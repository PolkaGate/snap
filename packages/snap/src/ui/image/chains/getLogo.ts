import { HexString } from "@polkadot/util/types";
import getChainName, { sanitizeChainName } from "../../../util/getChainName";
import { astar, bittensor, globe, kusama, polkadot } from ".";

export const getLogo = async (genesisHash: HexString): Promise<string> => {
    const chainName = await getChainName(genesisHash);
    const sanitizedChainName = sanitizeChainName(chainName);

    switch (sanitizedChainName?.toLowerCase()) {
        case 'astar':
            return astar;
        case 'polkadot':
            return polkadot;
        case 'bittensor':
            return bittensor;
        case 'kusama':
            return kusama;
            
        default:
            return globe;
    }
};