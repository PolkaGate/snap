import { ApiPromise, HttpProvider } from '@polkadot/api';

import getEndpoint from './getEndpoint';
import type { HexString } from '@polkadot/util/types';
import { callWithTimeout } from './callWithTimeout';

const createAirPromise = async (httpProvider: HttpProvider) => ApiPromise.create({ provider: httpProvider })

/**
 * Retrieves the API for the given blockchain genesis hash by creating an HTTP connection.
 * @param genesisHash - The genesis hash of the blockchain to connect to.
 * @returns A Promise that resolves to the ApiPromise instance, or null if the connection fails.
 */
export async function getApi(genesisHash: HexString): Promise<ApiPromise | null> {
  try {
    const endpoints = await getEndpoint(genesisHash, true, true) as string[];
    if (!endpoints?.length) {
      return null;
    }
    const adjustedUrls = endpoints.map((value) => value.replace('wss://', 'https://'));  // Replace 'wss://' with 'https://' as MetaMask Snap does not support WebSockets at the moment
    const httpProviders = adjustedUrls.map((url) => new HttpProvider(url));

    const api = await Promise.race(httpProviders.map(
      (httpProvider) => callWithTimeout(createAirPromise, [httpProvider], 60000, null)
    ));

    return api;

  } catch {

    return null;
  }
}
