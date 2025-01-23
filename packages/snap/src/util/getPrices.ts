import { getAllChains } from "../chains";
import { updateSnapState } from "../rpc/stateManagement";
import { sanitizeChainName } from "./getChainName";
import { createAssets } from '@polkagate/apps-config/assets';

export interface PriceValue {
  value: number;
  change: number;
}

export interface PricesType {
  [priceId: string]: PriceValue;
}

/** some chains have a different priceId than its sanitizedChainName,
 * hence we will replace their price Id using EXTRA_PRICE_IDS */
export const EXTRA_PRICE_IDS: Record<string, string> = {
  nodle: 'nodle-network',
  parallel: 'parallel-finance',
  pendulum: 'pendulum-chain'
};

export function toCamelCase(str: string): string {
  if (!str) {
    return '';
  }

  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) => {
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  })?.replace(/\s+/g, '');
}


const getPriceIds = () => {
  const assetsChains = createAssets();

  let selectedChainsChainName = getAllChains()?.filter(({ genesisHash, isTestnet }) => genesisHash && !isTestnet)?.map(({ displayName }) => toCamelCase(sanitizeChainName(displayName) as string));

  const assetsInfoOfMultiAssetSelectedChains = selectedChainsChainName?.map((chainName) => chainName && assetsChains[chainName]?.map((asset) => asset?.priceId))?.flat().filter((item) => !!item);

  selectedChainsChainName = selectedChainsChainName?.map((item) => item?.replace('AssetHub', '')); // TODO: needs double check
  const nonDuplicatedPriceIds = new Set([...(selectedChainsChainName || []), ...(assetsInfoOfMultiAssetSelectedChains || [])]);

  return nonDuplicatedPriceIds.size ? [...nonDuplicatedPriceIds] as string[] : null;
}

export default async function getPrices(currencyCode = 'usd') {
  const priceIds = getPriceIds();

  if (!priceIds) {
    console.error('No price ids!');
    return;
  }

  const revisedPriceIds = priceIds.map((item) => (EXTRA_PRICE_IDS[item] || item));
  try {
    const prices = await getReq(`https://api.coingecko.com/api/v3/simple/price?ids=${revisedPriceIds.join(',')}&vs_currencies=${currencyCode}&include_24hr_change=true`);

    const outputObjectPrices: PricesType = {};

    for (const [key, value] of Object.entries(prices)) {
      outputObjectPrices[key] = {
        change: value[`${currencyCode}_24h_change`] as number,
        value: value[currencyCode] as number,
      };
    }

    const price = { currencyCode, date: Date.now(), prices: outputObjectPrices };

    await updateSnapState('priceInfo', price).catch(console.error);

    return price;
  } catch {
    // Something went wrong while getting prices! Try again later
  }
}

async function getReq(api: string): Promise<Record<string, any>> {
  const response = await fetch(api, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
