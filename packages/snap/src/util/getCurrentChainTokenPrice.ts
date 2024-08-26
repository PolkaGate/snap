import getPrices from '../getPrices';
import { getSnapState } from '../rpc/stateManagement';
import { getCurrentChain } from './getCurrentChain';

const PRICE_VALIDITY_PERIOD = 5 * 60 * 1000;
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
