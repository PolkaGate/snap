// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';
import getEndpoint from './getEndpoint';

/**
 * Checks if an endpoint exists for a given genesis hash.
 * @param genesisHash - The genesis hash of the chain.
 * @returns A promise that resolves to a boolean indicating whether the endpoint exists.
 */
export async function hasEndpoint(genesisHash: HexString): Promise<boolean> {
  const endpoint = await getEndpoint(genesisHash);

  return !!endpoint;
}
