// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Transaction } from '@metamask/utils';
import { ApiPromise } from '@polkadot/api/cjs/index';
import { keccak256 } from 'ethers';
import { encode } from '@ethersproject/rlp';
import { evmToPolkadotAddress } from '../../util/evmToPolkadotAddress';
import { ContractAddress } from './types';



/**
 * Convert a number (e.g., nonce) to minimal bytes for RLP
 */
function numberToBytes(num: number): Uint8Array {
  if (num === 0) return new Uint8Array([]);
  const hex = num.toString(16).padStart(2, '0');
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return new Uint8Array(bytes);
}

export const getContractAddress = async (api: ApiPromise, transaction: Transaction, chainId: `${string}:${string}`): Promise<ContractAddress> => {
  const { from } = transaction;
  const nonce = await api.call.reviveApi.nonce(from) as number;

  const nonceBytes = numberToBytes(nonce);
  const rlpEncoded = encode([from, nonceBytes]);
  const hash = keccak256(rlpEncoded);
  const address = '0x' + hash.slice(-40)

  return {
    evm: address as `0x${string}`,
    substrate: evmToPolkadotAddress(address, chainId)
  }
}
