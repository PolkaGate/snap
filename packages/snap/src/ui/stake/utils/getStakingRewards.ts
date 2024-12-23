import { Balances } from "../../../util";
import { RewardsInfo } from "../../../util/types";
import { getClaimableRewards } from "./getClaimableRewards";
import { getPoolTotalRewards } from "./getPoolClaimedRewards";
import { getSoloRewards } from "./getSoloTotalReward";


export async function getPoolRewards(address: string, stakedTokens: Balances[]): Promise<RewardsInfo[] | null> {
  if (!address) {
    console.error('address is null in getting get Staking Rewards ');

    return null;
  }

  const claimables = await getClaimableRewards(address, stakedTokens);
  const poolTotalRewards = await getPoolTotalRewards(address, stakedTokens);

  return claimables.concat(poolTotalRewards)
}

export async function getStakingRewards(address: string, stakedTokens: Balances[]): Promise<RewardsInfo[] | null> {
  if (!address) {
    console.error('address is null in getting get Staking Rewards ');

    return null;
  }

  const poolRewards = await getPoolRewards(address, stakedTokens);
  const soloTotalRewards = await getSoloRewards(stakedTokens);

  return (poolRewards||[]).concat(soloTotalRewards);
}