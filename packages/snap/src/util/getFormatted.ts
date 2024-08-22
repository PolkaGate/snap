// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { getChain } from '../chains';
import { DEFAULT_NETWORK_PREFIX } from '../defaults';

/**
 * To get the formatted address of an address.
 *
 * @param genesisHash - The genesisHash of the chain will be used to find an endpoint to use.
 * @param address - The substrate format of an address.
 * @returns The formatted address.
 */
export function getFormatted(genesisHash: string, address: string): string {
  console.info(`Preparing formatted address for ${address} on ${genesisHash}`)

  const maybeChain = getChain(genesisHash as string);
  const publicKey = decodeAddress(address);

  const prefix = maybeChain?.prefix ?? DEFAULT_NETWORK_PREFIX;
  return encodeAddress(publicKey, prefix);
}
