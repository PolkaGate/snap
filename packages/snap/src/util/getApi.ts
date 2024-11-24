import { ApiPromise, HttpProvider } from '@polkadot/api';

import getEndpoint from './getEndpoint';
import { HexString } from '@polkadot/util/types';

/**
 * To get the api for a chain.
 *
 * @param genesisHash - The genesisHash of the chain will be used to find an endpoint to use.
 */
export async function getApi(genesisHash: HexString): Promise<ApiPromise | null> {
  console.info(`Preparing API for ${genesisHash}`)

  const endpoint = await getEndpoint(genesisHash);
  console.info(`Selected Endpoint on ${genesisHash} is ${endpoint} `)

  if (!endpoint) {
    console.error(`No endpoint with genesisHash: '${genesisHash}'.`);
    
    return null;
  }
  const adjustedUrl = endpoint.replace('wss://', 'https://'); // since Metamask snap does not support web sockets at the moment we use https instead
  const httpProvider = new HttpProvider(adjustedUrl);

  const api = await ApiPromise.create({ provider: httpProvider });

  return api;
}
