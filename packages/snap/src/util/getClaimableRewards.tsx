// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0


import { Balances } from '.';
import { isHexToBn } from '../utils';
import { getApi } from './getApi';

export const getClaimableRewards = async (address: string, stakedTokens: Balances[]) => {

  const apiPromises = stakedTokens.map(({ genesisHash }) => getApi(genesisHash));
  const apis = await Promise.all(apiPromises);

  const rewardsPromises = apis.filter(Boolean).map((api) => api?.call['nominationPoolsApi']['pendingRewards'](address))
  const rewards = await Promise.all(rewardsPromises);

  
  const rewardsInfo = apis.map((_, index) => {
    return { genesisHash: apis[index].genesisHash.toHex(), reward: isHexToBn(rewards[index]) }
  });


  return rewardsInfo;
}