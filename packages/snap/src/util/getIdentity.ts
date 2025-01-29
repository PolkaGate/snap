import type { ApiPromise } from '@polkadot/api';
import type { Registration } from '@polkadot/types/interfaces';
import type { Option } from '@polkadot/types';

import { hexToString } from '@polkadot/util';
import { PEOPLE_CHAINS } from '../constants';
import { getApi } from './getApi';

/**
 * Retrieves the identity display name for a given formatted account address.
 * This function checks if the provided account belongs to a supported people chain and, 
 * if so, fetches and decodes the display name from the identity module. 
 * If the account does not have an identity or if the chain is unsupported, it returns null.
 * @param api - The API instance for the chain.
 * @param formatted - The formatted account address for which the identity is to be fetched.
 * @returns - Returns the identity's display name as a string, or null if not found or unsupported.
 */
export async function getIdentity(api: ApiPromise, formatted: string): Promise<string | null> {
  const genesisHash = api.genesisHash.toHex();
  const peopleChainGenesis = PEOPLE_CHAINS[genesisHash];

  if (!peopleChainGenesis) {
    return null;
  }

  const _api = await getApi(peopleChainGenesis);

  if (!_api) {
    return null;
  }

  const identity = (await _api.query.identity.identityOf(
    formatted,
  )) as Option<Registration>;

  const displayName = identity?.isSome && identity.unwrap().info
    ? hexToString(identity.unwrap().info.display.asRaw.toHex())
    : null;

  return displayName;
}
