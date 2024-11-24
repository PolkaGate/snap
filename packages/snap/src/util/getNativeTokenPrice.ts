import { HexString } from '@polkadot/util/types';
import { PriceValue } from './getPrices';
import { getSnapState } from '../rpc/stateManagement';
import getChainName, { sanitizeChainName } from './getChainName';

const PRICE_VALIDITY_PERIOD = 5 * 60 * 1000;

const DEFAULT_PRICE_VALUE = {
  value: 0,
  change: 0
}
/**
 * To get the chain's native token price.
 */
export async function getNativeTokenPrice(genesisHash: HexString): Promise<{genesisHash:HexString, price:PriceValue}> {
  const chainName = await getChainName(genesisHash);
  const priceId = sanitizeChainName(chainName)?.toLowerCase();

  if (!priceId) {
    console.info('No priceId for genesisHash:', genesisHash)

    return {genesisHash, price: DEFAULT_PRICE_VALUE};
  }

  const { priceInfo } = await getSnapState();

  let price = DEFAULT_PRICE_VALUE;
  if (priceInfo?.date && Date.now() - priceInfo.date < PRICE_VALIDITY_PERIOD && priceInfo.prices[priceId]) {
    // price exists and is updated
    price= priceInfo.prices[priceId];
  }


  return {genesisHash, price};
}
