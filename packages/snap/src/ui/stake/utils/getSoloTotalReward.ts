import { BN } from "@polkadot/util";
import type { Balances } from "../../../util";
import getChainName, { sanitizeChainName } from "../../../util/getChainName";
import type { RewardsInfo } from "../../../util/types";
import { getSnapState, updateSnapState } from "../../../rpc/stateManagement";
import { REWARDS_SAVED_INFO_VALIDITY_PERIOD } from "../const";

/**
 * Sends a POST request to the specified URL with the provided data.
 * @param url - The URL to which the POST request is sent.
 * @param data - The data to be sent in the body of the request. Defaults to an empty object.
 * @returns A promise that resolves to the parsed JSON response.
 * @throws An error if the response cannot be parsed as JSON.
 */
export default async function postData(url: string, data = {}): Promise<any> {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  return response.json(); // parses JSON response into native JavaScript objects
}

/**
 * Retrieves the total solo staking reward for a given address on a specific chain.
 * @param chainName - The name of the chain to query. Must not be null.
 * @param address - The address for which to fetch staking rewards. Must not be null or undefined.is the reward destination which can be stashId or any other account Ids
 * @returns A promise that resolves to the total solo staking reward as a string. Returns '0' if an error occurs or the data is unavailable.
 */export async function getSoloReward(chainName: string | null, address: string | null | undefined): Promise<string> {
  if (!address || !chainName) {
    return '0';
  }

  return new Promise((resolve) => {
    try {
      postData('https://' + chainName + '.api.subscan.io/api/scan/staking_history',
        {
          address,
          page: 0,
          row: 20
        })
        .then((data: { message: string; data: { sum: string; }; }) => {
          if (data.message === 'Success') {
            const reward = data.data.sum;

            resolve(reward);
          } else {
            resolve('0');
          }
        })
        .catch(() => {
          resolve('0');
        });
    } catch {
      // something went wrong while getting get Staking Rewards
      resolve('0');
    }
  });
}

const NAME_IN_STORAGE = 'SOLO_TOTAL_REWARDS'

/**
 * Retrieves the solo staking rewards for a list of staked tokens.
 * If rewards are recently saved and valid, they are returned from the local state.
 * Otherwise, the rewards are fetched from an external API.
 * @param stakedTokens - An array of staked tokens, each containing staking information such as rewards destinations and genesis hashes.
 * @returns A promise that resolves to an array of rewards information for each staked token.
 */
export async function getSoloRewards(stakedTokens: Balances[]): Promise<RewardsInfo[]> {
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

  const rewardsDestination = stakedTokens.map((r) => r.rewardsDestination);
  const chainNames = await Promise.all(
    stakedTokens.map(async ({ genesisHash }) => getChainName(genesisHash))
  );

  const sanitizedChainNames = chainNames.map((name) => sanitizeChainName(name));

  const rewards = await Promise.all(
    rewardsDestination.map(async (address, index) => getSoloReward(sanitizedChainNames[index], address))
  )

  const result = stakedTokens.map(({ genesisHash }, index) =>
  ({
    type: 'Solo' as 'Solo' | 'Pool',
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
