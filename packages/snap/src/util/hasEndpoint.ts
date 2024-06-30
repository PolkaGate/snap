// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import getEndpoint from './getEndpoint';

/**
 * To see if we have endpoint for a chain or not.
 *
 * @param genesisHash - The genesisHash of the chain will be used to find an endpoint.
 */
export function hasEndpoint(genesisHash: string): boolean {
  const endpoint = getEndpoint(genesisHash);

  return !!endpoint;
}
