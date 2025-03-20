import type { HexString } from '@polkadot/util/types';
import { EXTRA_PRICE_IDS, type PriceValue } from './getPrices';
import { getSnapState } from '../rpc/stateManagement';
import getChainName, { sanitizeChainName } from './getChainName';
import { PRICE_VALIDITY_PERIOD } from '../constants';

const DEFAULT_PRICE_VALUE = {
  value: 0,
  change: 0
}

/**
 * Fetches the current price for the native token of a given chain.
 * @param genesisHash - The genesis hash of the blockchain for which to fetch the native token price.
 * @returns An object containing the genesis hash and the native token price, either the default price or the updated one if available.
 */
export async function getNativeTokenPrice(genesisHash: HexString): Promise<{ genesisHash: HexString, price: PriceValue }> {
  const chainName = await getChainName(genesisHash);
  const maybePriceId = sanitizeChainName(chainName)?.toLowerCase();
  const priceId = maybePriceId ? EXTRA_PRICE_IDS[maybePriceId] ?? maybePriceId : undefined;
  
  if (!priceId) {
    return { genesisHash, price: DEFAULT_PRICE_VALUE };
  }

  const { priceInfo } = await getSnapState();

  let price = DEFAULT_PRICE_VALUE;
  if (priceInfo?.date && Date.now() - priceInfo.date < PRICE_VALIDITY_PERIOD && priceInfo.prices[priceId]) {
    // price exists and is updated
    price = priceInfo.prices[priceId];
  }

  return { genesisHash, price };
}
