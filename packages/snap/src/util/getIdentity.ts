import { ApiPromise } from '@polkadot/api';
import type { Registration } from '@polkadot/types/interfaces';
import type { Option } from '@polkadot/types';

import { hexToString } from '@polkadot/util';

/**
 * To get the display name of an account's on-chain identity.
 *
 * @param api - The api to connect to a remote node.
 * @param formatted - The address to fetch its on-chain identity.
 */
export async function getIdentity(
  api: ApiPromise,
  formatted: string,
): Promise<string> {
  const identity = (await api.query.identity.identityOf(
    formatted,
  )) as Option<Registration>;

  const displayName = identity?.isSome
    ? hexToString(identity.unwrap().info.display.asRaw.toHex())
    : 'Unknown';

  return displayName;
}
