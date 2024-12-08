// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HexString } from '@polkadot/util/types';
import { getChain, getChainFromMetadata } from '../chains';

export const sanitizeChainName = (chainName: string | undefined) =>
  chainName
    ? chainName
      ?.replace(' Relay Chain', '')
      ?.replace(' Network', '')
      ?.replace(' chain', '')
      ?.replace(' Chain', '')
      ?.replace(' Finance', '')
      ?.replace(' Mainnet', '')
      ?.replace(' Protocol', '')
      ?.replace(/\s/gu, '')
    : null;

// eslint-disable-next-line jsdoc/require-jsdoc
export default async function getChainName(_genesisHash: HexString | undefined): Promise<string | undefined> {
  if (!_genesisHash) {
    console.info('_genesisHash should not be undefined');
    return undefined;
  }

  const maybeChain = getChain(_genesisHash);
  let chainName = maybeChain?.displayName || maybeChain?.network;

  if (!chainName) {
    chainName = (await getChainFromMetadata(_genesisHash))?.name;
  }

  return chainName;
}
