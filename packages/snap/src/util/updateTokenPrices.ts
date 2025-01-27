import type { PricesType } from './getPrices';
import getPrices from './getPrices';
import { getSnapState } from '../rpc/stateManagement';
import { PRICE_VALIDITY_PERIOD } from '../constants';

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
