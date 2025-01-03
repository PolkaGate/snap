// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import getEndpoint from './getEndpoint';

/**
 * To see if we have endpoint for a chain or not.
 *
 * @param genesisHash - The genesisHash of the chain will be used to find an endpoint.
 */
export async function hasEndpoint(genesisHash: string): Promise<boolean> {
  const endpoint = await getEndpoint(genesisHash);

  return !!endpoint;
}
