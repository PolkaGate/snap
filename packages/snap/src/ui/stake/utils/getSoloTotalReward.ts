import { BN } from "@polkadot/util";
import { Balances } from "../../../util";
import getChainName, { sanitizeChainName } from "../../../util/getChainName";
import { RewardsInfo } from "../../../util/types";

export default async function postData(url: string, data = {}) {
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

// address: is the reward destination which can be stashId or any other account Ids
export async function getSoloReward(chainName: string | null, address: string | null | undefined): Promise<string> {
  if (!address || !chainName) {
    console.error('address is null in getting get Solo Staking Rewards ');

    return '0';
  }

  console.log(`Getting Staking Reward from subscan  on ${chainName} for ${address} ... `);

  return new Promise((resolve) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
            console.log(`Fetching message ${data.message}`);
            resolve('0');
          }
        });
    } catch (error) {
      console.log('something went wrong while getting get Staking Rewards ');
      resolve('0');
    }
  });
}

export async function getSoloRewards(stakedTokens: Balances[]): Promise<RewardsInfo[]> {
  const rewardsDestination = stakedTokens.map(({ rewardsDestination }) => rewardsDestination);
  const chainNames = await Promise.all(
    stakedTokens.map(({ genesisHash }) => getChainName(genesisHash))
  );

  const sanitizedChainNames = chainNames.map((name) => sanitizeChainName(name));

  const rewards = await Promise.all(
    rewardsDestination.map((address, index) => getSoloReward(sanitizedChainNames[index], address))
  )

  const result = stakedTokens.map(({ genesisHash }, index) =>
  ({
    type:'Solo' as 'Solo' | 'Pool',
    genesisHash,
    reward: new BN(rewards[index])
  }));

  return result;
}
