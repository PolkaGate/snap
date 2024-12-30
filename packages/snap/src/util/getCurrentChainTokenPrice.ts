import getPrices, { PricesType } from './getPrices';
import { getSnapState } from '../rpc/stateManagement';
import { getCurrentChain } from './getCurrentChain';
import { PRICE_VALIDITY_PERIOD } from '../constants';

/**
 * To get the current chain's native token price.
 */
export async function getCurrentChainTokenPrice(): Promise<number> {
  const currentChainName = await getCurrentChain();
  const { priceInfo } = await getSnapState();

  console.info('chain name in get current chain token price is:', currentChainName)
  console.info('price info:', priceInfo)

  if (priceInfo?.date && Date.now() - priceInfo.date < PRICE_VALIDITY_PERIOD && priceInfo.prices[currentChainName]) {
    // price exists and is updated
    return priceInfo.prices[currentChainName].value || 0;
  }

  const newPriceInfo = await getPrices();

  return newPriceInfo?.prices[currentChainName]?.value || 0;
}

export async function updateTokenPrices(): Promise<PricesType | undefined> {
  const { priceInfo } = await getSnapState();

  console.info('price info:', priceInfo)

  if (priceInfo?.date && Date.now() - priceInfo.date < PRICE_VALIDITY_PERIOD) {
    // price exists and is updated
    return priceInfo.prices;
  }

  const newPriceInfo = await getPrices();

  return newPriceInfo?.prices;
}
