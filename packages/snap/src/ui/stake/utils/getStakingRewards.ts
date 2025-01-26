import type { Balances } from "../../../util";
import type { RewardsInfo } from "../../../util/types";
import { getClaimableRewards } from "./getClaimableRewards";
import { getPoolTotalRewards } from "./getPoolClaimedRewards";
import { getSoloRewards } from "./getSoloTotalReward";

/**
 * Fetches the total pool rewards and claimable rewards for a given address and staked tokens.
 * @param address - The address for which to fetch rewards.
 * @param stakedTokens - An array of staked tokens associated with the address.
 * @param withUpdate - (Optional) Flag to indicate whether to fetch updated rewards. Defaults to `false`.
 * @returns An array of `RewardsInfo` objects containing the rewards information, or `null` if the address is invalid.
 * @throws Will throw an error if the rewards fetching operations fail.
 */
export async function getPoolRewards(address: string, stakedTokens: Balances[], withUpdate?: boolean): Promise<RewardsInfo[] | null> {
  if (!address) {
    return null;
  }

  const claimables = await getClaimableRewards(address, stakedTokens, withUpdate);
  const poolTotalRewards = await getPoolTotalRewards(address, stakedTokens, withUpdate);

  return claimables.concat(poolTotalRewards)
}

/**
 * Fetches the staking rewards (both pool and solo) for a given address and staked tokens.
 * @param address - The address for which to fetch staking rewards.
 * @param stakedTokens - An array of staked tokens associated with the address.
 * @returns An array of `RewardsInfo` objects containing the staking rewards, or `null` if the address is invalid.
 * @throws Will throw an error if the rewards fetching operations fail.
 */
export async function getStakingRewards(address: string, stakedTokens: Balances[]): Promise<RewardsInfo[] | null> {
  if (!address) {
    return null;
  }

  const poolRewards = await getPoolRewards(address, stakedTokens);
  const soloTotalRewards = await getSoloRewards(stakedTokens);

  return (poolRewards ?? []).concat(soloTotalRewards);
}