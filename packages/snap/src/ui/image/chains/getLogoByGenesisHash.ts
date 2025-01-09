import { HexString } from "@polkadot/util/types";
import getChainName, { sanitizeChainName } from "../../../util/getChainName";
import { ajuna, acala, astar, bittensor, bifrost, basilisk, centrifuge, composable, darwinia, karura, kulupu, picasso, globe, hydradx, kusama, ternoa, nodle, polkadot, westend, zeitgeist, edgeware, equilibrium, frequency, integritee, parallel, pendulum, phala, polimec, polymesh, sora, vara, paseo, polkadotAssetHub, kusamaAssetHub, westendAssetHub, paseoAssetHub } from ".";
import { KusamaSqr, PaseoSqr, PolkadotSqr, WestendSqr } from "../chainsSquare";

export const getLogoByChainName = (chainName?: string, showSquare?: boolean): string => {
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
        case 'edgeware':
            return edgeware;
        case 'equilibrium':
            return equilibrium;
        case 'frequency':
            return frequency;
        case 'integritee':
            return integritee;
        case 'polkadot':
            return showSquare ? PolkadotSqr : polkadot;
        case 'parallel':
            return parallel;
        case 'centrifuge':
            return centrifuge;
        case 'bittensor':
            return bittensor;
        case 'darwinia':
            return darwinia;
        case 'pendulum':
            return pendulum;
        case 'polymesh':
            return polymesh;
        case 'sora':
            return sora;
        case 'phala':
            return phala;
        case 'polimec':
            return polimec;
        case 'hydradx':
        case 'hydration':
            return hydradx;
        case 'karura':
            return karura;
        case 'kulupu':
            return kulupu;
        case 'kusama':
            return showSquare ? KusamaSqr : kusama;
        case 'paseo':
            return showSquare ? PaseoSqr : paseo;
        case 'picasso':
            return picasso;
        case 'nodle':
            return nodle;
        case 'ternoa':
            return ternoa;
        case 'westend':
            return showSquare ? WestendSqr : westend;
        case 'zeitgeist':
            return zeitgeist;
        case 'polkadotassethub':
            return polkadotAssetHub;

        case 'kusamaassethub':
            return kusamaAssetHub;

        case 'westendassethub':
            return westendAssetHub;

        case 'paseoassethub':
            return paseoAssetHub;
            
        case 'vara':
            return vara;

        default:
            return globe;
    }
};

export const getLogoByGenesisHash = async (genesisHash: HexString, showSquare?: boolean): Promise<string> => {
    const chainName = await getChainName(genesisHash);
    return getLogoByChainName(chainName, showSquare);
};