import { DEFAULT_CHAIN_NAME } from '../constants';
import { getKeyPair } from '../util/getKeyPair';

export const getAddress = async (chainName?: string): Promise<string> => {
  const account = await getKeyPair(chainName ?? DEFAULT_CHAIN_NAME);

  if (!account) {
    throw new Error('account not found');
  }

  const { address } = account;

  return address;
};