// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0


import type { Balances } from '../../../util';
import { isHexToBn } from '../../../utils';
import { getApi } from '../../../util/getApi';
import type { RewardsInfo, StakingType, SubStakingType } from '../../../util/types';
import { BN, BN_ZERO } from '@polkadot/util';
import { getSnapState, updateSnapState } from '../../../rpc/stateManagement';
import { REWARDS_SAVED_INFO_VALIDITY_PERIOD } from '../const';
import type { HexString } from '@polkadot/util/types';

const NAME_IN_STORAGE = 'CLAIMABLE_REWARDS'

export const getClaimableRewards = async (address: string, stakedTokens: Balances[], withUpdate?: boolean): Promise<RewardsInfo[]> => {

  if (!withUpdate) {
    const maybeSavedRewards = (await getSnapState(NAME_IN_STORAGE)) as { rewards: RewardsInfo[], date: number } | null;
    if (maybeSavedRewards && Date.now() - maybeSavedRewards.date < REWARDS_SAVED_INFO_VALIDITY_PERIOD) {
      // more check: check if selected network has changed since last savings
      return maybeSavedRewards.rewards.map((r) => {
        return {
          ...r,
          reward: new BN(r.reward)
        }
      });
    }
  }

  const apiPromises = stakedTokens.map(async ({ genesisHash }) => getApi(genesisHash));
  const filteredApis = (await Promise.all(apiPromises)).filter(Boolean);

  const rewardsPromises = filteredApis.map(async (api) => api?.call.nominationPoolsApi.pendingRewards(address))
  const rewards = await Promise.all(rewardsPromises);

  const rewardsInfo = filteredApis.map((api, index) => {
    return {
      type: 'Pool' as StakingType,
      subType: 'Claimable' as SubStakingType,
      genesisHash: api?.genesisHash.toHex() as HexString,
      reward: isHexToBn(String(rewards[index])) ?? BN_ZERO
    }
  });

  // save rewards in snap state
  const toSaveRewards = rewardsInfo.map((r) => {
    return {
      ...r,
      reward: r.reward.toString()
    };
  });

  await updateSnapState(NAME_IN_STORAGE,
    {
      rewards: toSaveRewards,
      date: Date.now()
    });

  return rewardsInfo;
}