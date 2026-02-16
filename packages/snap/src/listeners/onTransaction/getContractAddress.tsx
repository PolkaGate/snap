// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Transaction } from '@metamask/utils';
import { ApiPromise } from '@polkadot/api/cjs/index';
import { getCreateAddress } from 'ethers';
import { evmToPolkadotAddress } from '../../util/evmToPolkadotAddress';
import { ContractAddress } from './types';


export const getContractAddress = async (api: ApiPromise, transaction: Transaction, chainId: `${string}:${string}`): Promise<ContractAddress> => {
  const { from } = transaction;
  const nonce = await api.call.reviveApi.nonce(from) as number;

  const address = getCreateAddress({ from, nonce: Number(nonce) });

  return {
    evm: address,
    substrate: evmToPolkadotAddress(from as string, chainId)
  }
}
