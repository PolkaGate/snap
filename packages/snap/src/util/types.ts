import { BN } from "@polkadot/util";
import { HexString } from "@polkadot/util/types";

interface PriceValue {
  value: number,
  change: number
}

export interface PricesType {
  [priceId: string]: PriceValue;
}

export interface Prices {
  currencyCode: string;
  date: number;
  prices: PricesType;
};

export type StakingType= 'Solo' | 'Pool';
export type SubStakingType='Claimable' | 'TotalClaimed';

export interface RewardsInfo {
  type: StakingType;
  subType?:SubStakingType;
  genesisHash: HexString;
  reward: BN;
}