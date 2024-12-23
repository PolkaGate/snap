// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN, BN_ZERO } from '@polkadot/util';
import { Balances } from '../../../util';
import { RewardsInfo, StakingType, SubStakingType } from '../../../util/types';
import getChainName, { sanitizeChainName } from '../../../util/getChainName';
import postData from './getSoloTotalReward';

interface AccountDisplay {
  address: string;
  display: string;
  judgements: string;
  account_index: string;
  identity: boolean;
  parent: unknown;
}

export interface Transfers {
  amount: string;
  asset_symbol: string;
  block_num: number;
  block_timestamp: number;
  extrinsic_index: string;
  fee: string;
  from: string;
  from_account_display: AccountDisplay;
  hash: string;
  module: string;
  nonce: number;
  success: boolean
  to: string;
  to_account_display: AccountDisplay;
}

export interface TransferRequest {
  code: number;
  data: {
    list: unknown;
    count: number;
    transfers: Transfers[];
  };
  generated_at: number;
  message: string;
}

export interface SubscanClaimedRewardInfo {
  era: number,
  pool_id: number,
  account_display: { address: string },
  amount: string,
  block_timestamp: number,
  event_index: string,
  module_id: string,
  event_id: string,
  extrinsic_index: string
}

export interface ClaimedRewardInfo {
  era: number;
  amount: BN;
  date?: string;
  timeStamp: number;
}

const MAX_PAGE_SIZE = 100;

export async function getPoolClaimedReward(chainName: string, address: string): Promise<BN> {
  try {

    const result = await postData(`https://${chainName}.api.subscan.io/api/scan/nomination_pool/rewards`, {
      address,
      row: MAX_PAGE_SIZE
    });

    const list = result?.data.list as SubscanClaimedRewardInfo[];
    const claimedRewardsFromSubscan: ClaimedRewardInfo[] | undefined = list?.map((i: SubscanClaimedRewardInfo): ClaimedRewardInfo => {
      return {
        amount: new BN(i.amount),
        timeStamp: i.block_timestamp
      } as ClaimedRewardInfo;
    });

    let sum = BN_ZERO;
    if (claimedRewardsFromSubscan.length) {
      sum = claimedRewardsFromSubscan.reduce((acc, { amount }) => acc.add(amount), BN_ZERO)
    }

    return sum;
  } catch {
    return BN_ZERO;
  }
}

export async function getPoolTotalRewards(address: string, stakedTokens: Balances[]): Promise<RewardsInfo[]> {
  const chainNames = await Promise.all(
    stakedTokens.map(({ genesisHash }) => getChainName(genesisHash))
  );

  const sanitizedChainNames = chainNames.map((name) => sanitizeChainName(name)).filter(Boolean);

  const rewards = await Promise.all(
    sanitizedChainNames.map((sanitizedChainName) => getPoolClaimedReward(sanitizedChainName!, address))
  )

  const result = stakedTokens.map(({ genesisHash }, index) =>
  ({
    type: 'Pool' as StakingType,
    subType: 'TotalClaimed' as SubStakingType,
    genesisHash,
    reward: new BN(rewards[index])
  }));

  return result;
}
