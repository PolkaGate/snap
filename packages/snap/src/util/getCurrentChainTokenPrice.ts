import type { PricesType } from './getPrices';
import getPrices from './getPrices';
import { getSnapState } from '../rpc/stateManagement';
import { getCurrentChain } from './getCurrentChain';
import { PRICE_VALIDITY_PERIOD } from '../constants';

/**
 * Retrieves the current token price for the active chain.
 * If the price is cached and valid, it returns the cached price; otherwise, it fetches the latest price.
 * @returns A Promise that resolves to the current token price as a number.
 */
export async function getCurrentChainTokenPrice(): Promise<number> {
  const currentChainName = await getCurrentChain();
  const { priceInfo } = await getSnapState();

  if (priceInfo?.date && Date.now() - priceInfo.date < PRICE_VALIDITY_PERIOD && priceInfo.prices[currentChainName]) {
    // price exists and is updated
    return priceInfo.prices[currentChainName].value ?? 0;
  }

  const newPriceInfo = await getPrices();

  return newPriceInfo?.prices[currentChainName]?.value ?? 0;
}

/**
 * Updates the token prices by fetching the latest price information if the cached price is outdated.
 * @returns A Promise that resolves to the updated prices, or `undefined` if no prices are available.
 */
export async function updateTokenPrices(): Promise<PricesType | undefined> {
  const { priceInfo } = await getSnapState();

  if (priceInfo?.date && Date.now() - priceInfo.date < PRICE_VALIDITY_PERIOD) {
    // price exists and is updated
    return priceInfo.prices;
  }

  const newPriceInfo = await getPrices();

  return newPriceInfo?.prices;
}
