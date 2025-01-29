import type { BN } from "@polkadot/util";
import type { HexString } from "@polkadot/util/types";

type PriceValue = {
  value: number,
  change: number
}

export type PricesType = {
  [priceId: string]: PriceValue;
}

export type Prices = {
  currencyCode: string;
  date: number;
  prices: PricesType;
};

export type StakingType = 'Solo' | 'Pool';
export type SubStakingType = 'Claimable' | 'TotalClaimed';

export type RewardsInfo = {
  type: StakingType;
  subType?: SubStakingType;
  genesisHash: HexString;
  reward: BN;
}