
export type StakingRecommended = {
  rates: {
    [chain: string]: number; // Maps chain names to their respective rates
  };
  validators: {
    [chain: string]: string[]; // Maps chain names to arrays of recommended validator addresses
  };
};

/**
 * Fetches staking information from a remote JSON file.
 * @returns A promise that resolves with staking rates and recommended validators.
 * @throws An error if the fetch request fails.
 */
export async function fetchStaking(): Promise<StakingRecommended> {
  const response = await fetch('https://raw.githubusercontent.com/PolkaGate/snap/refs/heads/main/packages/snap/staking.json');
  if (!response.ok) {
    throw new Error('Failed to fetch staking JSON file');
  }

  const info = await response.json();
  return info;
}
