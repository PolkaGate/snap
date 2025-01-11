/**
 * The state of the stake form.
 *
 * @property amount - The amount to stake.
 * @property accountSelector - The selected account.
 */

import { SubmittableExtrinsicFunction } from "@polkadot/api/types";
import { AnyTuple } from "@polkadot/types/types";
import { BN } from "@polkadot/util";
import { HexString } from "@polkadot/util/types";
import type { DeriveAccountInfo, DeriveStakingQuery } from '@polkadot/api-derive/types';
import { RewardsInfo } from "../../util/types";
import { Balances } from "../../util";
import { Balance } from "@polkadot/types/interfaces";

export type StakeFormState = {
  stakeAmount: number;
  stakeTokenSelector: string;
};

export type StakeMoreFormState = {
  stakeMoreAmount: string;
};

export type StakeTypeFormState = {
  stakingTypeOptions?: 'Solo' | 'Pool';
};

export type PoolSelectorFormState = {
  poolSelector: string;
};

/**
 * The form errors.
 *
 * @property amount - The error for the amount.
 */
export type StakeFormErrors = {
  amount?: string;
};


/**
 * The context of the send flow interface.
 *
 * @property transferable - The available balance of the selected token.
 * @property decimal - The decimal of selected token
 */
export type StakeFlowContext = {
  decimal: number;
  stakingInfo: Record<string, any>;
  transferable: string
};

export interface StakingDataType {
  type: 'Pool' | 'Solo';
  pool?: {
    id: number;
    name: string;
  };
  solo?: {
    validators?: HexString[] // selected validator ids
  }
}

export interface StakingInfoType {
  bondingDuration: number;
  decimal: number;
  eraIndex: number;
  existentialDeposit: number;
  maxNominations: number;
  maxNominatorRewardedPerValidator: number;
  minNominatorBond: number;
  minJoinBond: number;
  minimumActiveStake: number;
  token: string;
  eraDuration: number;
  unbondingDuration: number;
}

export interface ExposureOverview {
  total: BN;
  own: BN
  nominatorCount: BN;
  pageCount: BN;
}

export interface Other {
  who: string;
  value: BN;
}

export interface ValidatorInfo extends DeriveStakingQuery {
  exposure: {
    own: BN,
    total: BN,
    others: Other[]
  };
  accountInfo?: DeriveAccountInfo;
  apy?: string | null;
  isOversubscribed?: {
    notSafe: boolean;
    safe: boolean;
  }
}

export interface AllValidators {
  current: ValidatorInfo[];
  waiting: ValidatorInfo[];
  eraIndex: string;
}

export interface StakingIndexContextType {
  balancesAll: Balances[];
  sanitizedChainName: string | undefined;
  stakingInfo: StakingInfoType;
  stakingRates: Record<string, number>;
  recommendedValidators: string[];
}

export interface StakingInitContextType {
  address: string;
  amount: string | undefined;
  call?: SubmittableExtrinsicFunction<"promise", AnyTuple>;
  claimable?: string;
  pooledBalance?: string;
  redeemable?: string;
  decimal: number;
  genesisHash: HexString;
  logo: string;
  fee?: string;
  params?: unknown[];
  price: number;
  rate: number;
  recommendedValidators: HexString[];
  restakeRewards?: boolean;
  rewardsInfo: RewardsInfo[];
  stakedTokens: Balances[];
  sanitizedChainName: string;
  selectedValidators?: string[];
  stakingData: StakingDataType | undefined;
  stakingRates: Record<string, number>;
  stakingInfo?: StakingInfoType;
  token: string;
  transferable: string;
  validators?: AllValidators;
}

export interface StakingPoolContextType extends StakingInitContextType {
  active?: string;
  unlocking?: string;
  logos: { genesisHash: HexString, logo: string }[];
  poolId?: number;
  minJoinBond?: string;
}

export interface PayeeAccount { Account: string }
export type Payee = 'Staked' | 'Controller' | 'Stash' | PayeeAccount;


export type SoloBalances = {
  soloTotal?: Balance;
  solo?: SoloBalance;
  rewardsDestination?: string | null;
};

export interface SoloBalance {
  total: string;
  active: string;
  unlocking: string;
  redeemable: string;
  nominators?: HexString[];
  toBeReleased?: {
    amount: string;
    date: number;
  }[]
}

export interface StakingSoloContextType extends StakingInitContextType {
  active?: string;
  unlocking?: string;
  minNominatorBond?: string;
  unbondingDuration?: number;
  recommendedValidatorsOnThisChain: string[];
  minimumActiveStake?: string;
  logos: { genesisHash: HexString, logo: string }[];
  payee?: { initial: Payee, maybeNew: Payee };
  solo?: SoloBalance | undefined,
  selectedPayouts?: string[] | undefined;
  selectedAmountToPayout?: string;
}

export interface CallParamsType {
  call: SubmittableExtrinsicFunction<"promise", AnyTuple>;
  params: unknown[];
}