// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN, BN_ZERO, noop } from '@polkadot/util';
import type { Balances } from '../../../util';
import type { RewardsInfo, StakingType, SubStakingType } from '../../../util/types';
import getChainName, { sanitizeChainName } from '../../../util/getChainName';
import postData from './getSoloTotalReward';
import { getSnapState, updateSnapState } from '../../../rpc/stateManagement';
import { REWARDS_SAVED_INFO_VALIDITY_PERIOD } from '../const';

export type SubscanClaimedRewardInfo = {
  amount: string,
}

export type ClaimedRewardInfo = {
  amount: BN;
}

const MAX_PAGE_SIZE = 100;
const NAME_IN_STORAGE = 'POOL_TOTAL_REWARDS'

/**
 * Fetches the total claimed rewards for a specific chain and address.
 * @param chainName - The name of the chain to query.
 * @param address - The user's address to fetch rewards for.
 * @returns A promise that resolves with the total claimed rewards as a Big Number (BN).
 */
export async function getPoolClaimedReward(chainName: string | null, address: string): Promise<BN> {
  try {
    if (!chainName) {
      return BN_ZERO;
    }

    const result = await postData(`https://${chainName}.api.subscan.io/api/scan/nomination_pool/rewards`, {
      address,
      row: MAX_PAGE_SIZE
    });

    const list = result?.data.list as SubscanClaimedRewardInfo[];
    const claimedRewardsFromSubscan: ClaimedRewardInfo[] | undefined = list?.map((i: SubscanClaimedRewardInfo): ClaimedRewardInfo => {
      return {
        amount: new BN(i.amount),
      } as ClaimedRewardInfo;
    });

    let sum = BN_ZERO;
    if (claimedRewardsFromSubscan.length) {
      sum = claimedRewardsFromSubscan.reduce((acc, { amount }) => acc.add(amount), BN_ZERO)
    }

    return sum;
  } catch {
    await updateSnapState('alerts',
      {
        id: 'totalClaimedRewards',
        severity: 'warning',
        text: 'Something went wrong while getting claimed rewards! Check your internet connection!'
      }
    ).catch(noop);
    return BN_ZERO;
  }
}

/**
 * Retrieves the total rewards for a staking pool, optionally updating the rewards data.
 * @param address - The user's address for which to fetch rewards.
 * @param stakedTokens - The list of tokens staked by the user.
 * @param withUpdate - Optional flag to force updating rewards data.
 * @returns A promise that resolves with the total rewards information.
 */
export async function getPoolTotalRewards(address: string, stakedTokens: Balances[], withUpdate?: boolean): Promise<RewardsInfo[]> {
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

  const chainNames = await Promise.all(
    stakedTokens.map(async ({ genesisHash }) => getChainName(genesisHash))
  );

  const sanitizedChainNames = chainNames.map((name) => sanitizeChainName(name));

  const rewards = await Promise.all(
    sanitizedChainNames.map(async (sanitizedChainName) => getPoolClaimedReward(sanitizedChainName, address))
  )

  const result = stakedTokens.map(({ genesisHash }, index) =>
  ({
    type: 'Pool' as StakingType,
    subType: 'TotalClaimed' as SubStakingType,
    genesisHash,
    reward: new BN(rewards[index])
  }));

  // save rewards in snap state
  const toSaveRewards = result.map((r) => {
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

  return result;
}
