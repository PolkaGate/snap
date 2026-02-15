import { noop } from "@polkadot/util/cjs/noop";
import { getAllChains } from "../chains";
import { updateSnapState } from "../rpc/stateManagement";
import { sanitizeChainName } from "./getChainName";
import { createAssets } from '@polkagate/apps-config/assets';
import { toCamelCase } from "../utils";

export type PriceValue = {
  value: number;
  change: number;
}

export type PricesType = {
  [priceId: string]: PriceValue;
}

/** 
 * some chains have a different priceId than its sanitizedChainName,
 * hence we will replace their price Id using EXTRA_PRICE_IDS 
 */
export const EXTRA_PRICE_IDS: Record<string, string> = {
  nodle: 'nodle-network',
  vara: 'vara-network',
  parallel: 'parallel-finance',
  pendulum: 'pendulum-chain'
};

/**
 * Retrieves the price IDs for the selected chains and their associated assets.
 * Filters out testnets and sanitizes chain names before retrieving the price IDs from the assets.
 * Duplicated price IDs are eliminated and returned as an array of unique price IDs.
 * @returns An array of unique price IDs or null if no price IDs are found.
 */
const getPriceIds = (): string[] | null => {
  const assetsChains = createAssets();

  let selectedChainsChainName = getAllChains()?.filter(({ genesisHash, isTestnet }) => genesisHash && !isTestnet)?.map(({ displayName }) => toCamelCase(sanitizeChainName(displayName) as string));

  const assetsInfoOfMultiAssetSelectedChains = selectedChainsChainName?.map((chainName) => chainName && assetsChains[chainName]?.map((asset) => asset?.priceId))?.flat().filter((item) => !!item);

  selectedChainsChainName = selectedChainsChainName?.map((item) => item?.replace('AssetHub', '')); // to remove assetHub from chainName since we fetch prices of native tokens based on their chain name
  const nonDuplicatedPriceIds = new Set([...(selectedChainsChainName ?? []), ...(assetsInfoOfMultiAssetSelectedChains ?? [])]);

  return nonDuplicatedPriceIds.size ? [...nonDuplicatedPriceIds] as string[] : null;
}

/**
 * Fetches the latest cryptocurrency prices for the selected chains and assets using the CoinGecko API.
 * It retrieves the price in the specified currency (default is 'usd') and includes 24-hour price change data.
 * The price information is stored in the Snap state for future reference.
 * @param currencyCode - The currency code (default is 'usd') to fetch prices in.
 * @returns The price information, including the currency code, timestamp, and prices of the selected assets, or undefined if the request fails.
 */
export default async function getPrices(currencyCode = 'usd'): Promise<{ currencyCode: string, date: number, prices: PricesType } | undefined> {
  const priceIds = getPriceIds();

  if (!priceIds) {
    return;
  }

  const revisedPriceIds = priceIds.map((item) => (EXTRA_PRICE_IDS[item] ?? item));
  
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

    await updateSnapState('priceInfo', price).catch(noop);

    return price;
  } catch {
    await updateSnapState('alerts',
      {
        id: 'priceInfo',
        severity: 'warning',
        text: 'Something went wrong while getting prices! Check your internet connection, and try again!'
      }
    ).catch(noop);

    return undefined;
  }
}

/**
 * Makes a GET request to the specified API and returns the response data as a JSON object.
 * @param api - The URL of the API endpoint to fetch data from.
 * @returns A promise that resolves to the parsed JSON data from the response.
 * @throws Throws an error if the fetch request fails or the response is not successful.
 */
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
