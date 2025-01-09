import { ApiPromise, HttpProvider } from '@polkadot/api';

import getEndpoint from './getEndpoint';
import { HexString } from '@polkadot/util/types';

/**
 * To get the api for a chain.
 *
 * @param genesisHash - The genesisHash of the chain will be used to find an endpoint to use.
 */
export async function getApi(genesisHash: HexString): Promise<ApiPromise | null> {
  try {
    console.info(`Preparing API for ${genesisHash}`)

    const endpoints = await getEndpoint(genesisHash, true, true) as string[];
    if (!endpoints?.length) {
      console.error(`No endpoint with genesisHash: '${genesisHash}'.`);

      return null;
    }
    console.info(`Selected Endpoints on ${genesisHash} is ${endpoints} `)

    const adjustedUrls = endpoints.map((value) => value.replace('wss://', 'https://'));  // Replace 'wss://' with 'https://' as MetaMask Snap does not support WebSockets at the moment
    const httpProviders = adjustedUrls.map((url) => new HttpProvider(url));

    const api = await Promise.race(httpProviders.map((httpProvider) => ApiPromise.create({ provider: httpProvider })));

    return api;

  } catch(error) {
    console.error(`Something went wrong while getting api for ${genesisHash}`, error)
    return null;
  }
}
