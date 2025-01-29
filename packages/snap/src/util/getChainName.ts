// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';
import { getChain, getChainFromMetadata } from '../chains';

export const sanitizeChainName = (chainName: string | undefined): string | null => {
  return chainName
    ? chainName
      .replace(' Relay Chain', '')
      .replace(' Network', '')
      .replace(' chain', '')
      .replace(' Chain', '')
      .replace(' Finance', '')
      .replace(' Mainnet', '')
      .replace(' Protocol', '')
      .replace(/\s/gu, '')
    : null;
}

/**
 * Fetches the chain name for a given genesis hash, optionally sanitizing and converting it to lowercase.
 * @param _genesisHash - The genesis hash of the blockchain.
 * @param sanitizeAndLowerCase - A flag to indicate whether to sanitize and convert the name to lowercase (optional).
 * @returns A Promise that resolves to the chain name as a string, or undefined if the genesis hash is invalid or no chain name is found.
 */
export default async function getChainName(_genesisHash: HexString | undefined, sanitizeAndLowerCase?: boolean): Promise<string | undefined> {
  if (!_genesisHash) {
    return undefined;
  }

  const maybeChain = getChain(_genesisHash);
  let chainName = maybeChain?.displayName ?? maybeChain?.network;

  if (!chainName) {
    chainName = (await getChainFromMetadata(_genesisHash))?.name;
  }

  if (sanitizeAndLowerCase) {
    return sanitizeChainName(chainName)?.toLocaleLowerCase() as string;
  }

  return chainName;
}
