import { HexString } from '@polkadot/util/types';
import getPrices from '../getPrices';
import { getSnapState } from '../rpc/stateManagement';
import getChainName, { sanitizeChainName } from './getChainName';
import { getCurrentChain } from './getCurrentChain';

const PRICE_VALIDITY_PERIOD = 5 * 60 * 1000;
/**
 * To get the chain's native token price.
 */
export async function getNativeTokenPrice(genesisHash:HexString): Promise<number> {
  const chainName = await getChainName(genesisHash);
  const priceId = sanitizeChainName(chainName)?.toLowerCase();

  if(!priceId){
    console.info('No priceId for genesisHash:', genesisHash)
  
    return 0;
  }

  const { priceInfo } = await getSnapState();

  console.info('chain name in getNativeTokenPrice is:', priceId)
  console.info('price info:', priceInfo)

  if (priceInfo?.date && Date.now() - priceInfo.date < PRICE_VALIDITY_PERIOD && priceInfo.prices[priceId]) {
    // price exists and is updated
    return priceInfo.prices[priceId].value || 0;
  }

  const newPriceInfo = await getPrices();

  return newPriceInfo?.prices[priceId]?.value || 0;
}
