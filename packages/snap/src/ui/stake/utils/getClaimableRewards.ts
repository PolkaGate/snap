// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0


import { Balances } from '../../../util';
import { isHexToBn } from '../../../utils';
import { getApi } from '../../../util/getApi';
import { RewardsInfo, StakingType, SubStakingType } from '../../../util/types';
import { BN_ZERO } from '@polkadot/util';

export const getClaimableRewards = async (address: string, stakedTokens: Balances[]): Promise<RewardsInfo[]> => {
  const apiPromises = stakedTokens.map(({ genesisHash }) => getApi(genesisHash));
  const filteredApis = (await Promise.all(apiPromises)).filter(Boolean);

  const rewardsPromises = filteredApis.map((api) => api!.call['nominationPoolsApi']['pendingRewards'](address))
  const rewards = await Promise.all(rewardsPromises);

  const rewardsInfo = filteredApis.map((api, index) => {
    return {
      type: 'Pool' as StakingType,
      subType: 'Claimable' as SubStakingType,
      genesisHash: api!.genesisHash.toHex(),
      reward: isHexToBn(String(rewards[index])) || BN_ZERO
    }
  });

  return rewardsInfo;
}