import type { HexString } from "@polkadot/util/types";
import getChainName, { sanitizeChainName } from "../../../util/getChainName";
import { ajuna, acala, astar, bittensor, bifrost, basilisk, centrifuge, composable, darwinia, karura, kulupu, picasso, globe, hydradx, kusama, ternoa, nodle, polkadot, westend, zeitgeist, edgeware, equilibrium, frequency, integritee, parallel, pendulum, phala, polimec, polymesh, sora, vara, paseo, polkadotAssetHub, kusamaAssetHub, westendAssetHub, paseoAssetHub, polkadotPeople, westendPeople, kusamaPeople, paseoPeople } from ".";
import { KusamaSqr, PaseoSqr, PolkadotSqr, WestendSqr } from "../chainsSquare";

/**
 * Fetches the logo URL based on the given chain name, with an optional square format option.
 * @param chainName - The name of the chain for which the logo is to be fetched.
 * @param showSquare - Optional flag to return a square logo version (default is false).
 * @returns A string representing the URL of the logo for the given chain name.
 */
export const getLogoByChainName = (chainName?: string, showSquare?: boolean): string => {
    const sanitizedChainName = sanitizeChainName(chainName)?.toLowerCase();

    if (!sanitizedChainName) {
        return globe
    }

    switch (sanitizedChainName) {
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

        case 'polkadotpeople':
            return polkadotPeople;

        case 'westendpeople':
            return westendPeople;

        case 'kusamapeople':
            return kusamaPeople;

        case 'paseopeople':
            return paseoPeople;

        case 'vara':
            return vara;

        default:
            return globe;
    }
};

/**
 * Fetches the logo for a given genesis hash, optionally adjusting for square format.
 * @param genesisHash - The genesis hash of the chain.
 * @param showSquare - Optional flag to determine whether to show a square logo (default is false).
 * @returns A promise that resolves to the logo URL as a string.
 */
export const getLogoByGenesisHash = async (genesisHash: HexString, showSquare?: boolean): Promise<string> => {
    const chainName = await getChainName(genesisHash);
    return getLogoByChainName(chainName, showSquare);
};