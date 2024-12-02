import { HexString } from "@polkadot/util/types";
import getChainName, { sanitizeChainName } from "../../../util/getChainName";
import { assetHub, ajuna, acala, astar, bittensor, bifrost, basilisk, centrifuge, composable, darwinia, karura, kulupu, picasso, globe, hydradx, kusama, ternoa, nodle, polkadot, westend, zeitgeist } from ".";

export const getLogo = async (genesisHash: HexString): Promise<string> => {
    const chainName = await getChainName(genesisHash);
    const sanitizedChainName = sanitizeChainName(chainName);

    switch (sanitizedChainName?.toLowerCase()) {
        case 'astar':
            return astar;
        case 'acala':
            return acala;
        case 'ajuna':
            return ajuna;
        case 'basilisk':
            return basilisk;
        case 'bifrost':
            return bifrost;
        case 'composable':
            return composable;
        case 'polkadot':
            return polkadot;
        case 'centrifuge':
            return centrifuge;
        case 'bittensor':
            return bittensor;
        case 'darwinia':
            return darwinia;
        case 'hydradx':
        case 'hydration':
            return hydradx;
        case 'karura':
            return karura;
        case 'kulupu':
            return kulupu;
        case 'kusama':
            return kusama;
        case 'picasso':
            return picasso;
        case 'nodle':
            return nodle;
        case 'ternoa':
            return ternoa;
        case 'westend':
            return westend;
        case 'zeitgeist':
            return zeitgeist;
        case 'westendassethub':
        case 'kusamaassethub':
        case 'polkadotassethub':
            return assetHub;
            
        default:
            return globe;
    }
};