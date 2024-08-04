// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { JsonBIP44CoinTypeNode } from '@metamask/key-tree';
import { Keyring } from '@polkadot/keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import { stringToU8a } from '@polkadot/util';

import { getChain, getChainFromMetadata } from '../chains';
import { DEFAULT_CHAIN_NAME, DEFAULT_COIN_TYPE, DEFAULT_NETWORK_PREFIX } from '../defaults';
import { HexString } from '@polkadot/util/types';

export const getKeyPair = async (
  chainName: string = DEFAULT_CHAIN_NAME,
  genesisHash?: HexString,
): Promise<KeyringPair> => {

  let prefix: number | undefined;
  prefix = getChain(genesisHash ?? chainName)?.prefix;

  if (prefix === undefined && genesisHash) {
    prefix = (await getChainFromMetadata(genesisHash))?.ss58Format;
  }

  const BIP44CoinNode = (await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: DEFAULT_COIN_TYPE,
    },
  })) as JsonBIP44CoinTypeNode;

  const seed = BIP44CoinNode?.privateKey?.slice(0, 32);
  const keyring = new Keyring({ ss58Format: prefix ?? DEFAULT_NETWORK_PREFIX });
  const keyPair = keyring.addFromSeed(stringToU8a(seed));

  return keyPair;
};
