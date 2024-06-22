import { DEFAULT_CHAIN_NAME } from '../defaults';
import { getKeyPair } from '../util/getKeyPair';
import { accountDemo } from '../ui/accountDemo';
import { getDefaultTokenBalances } from '../util/getDefaultTokenBalances';

export const getAddress = async (chainName?: string): Promise<string> => {
  const account = await getKeyPair(chainName || DEFAULT_CHAIN_NAME);

  if (!account) {
    throw new Error('account not found');
  }

  const { address } = account;

  showAccount(address); // This can be removed in favour of  onHomePage or onInstall

  return address;
};

/**
 * To show address(es) in some main chains format to users for a short while.
 *
 * @param address - The any chain address.
 */
async function showAccount(address: string) {
  const balances = await getDefaultTokenBalances(address);

  /** to show the address to user */
  snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: accountDemo(address, balances), // TODO: fix parameters
    },
  });
}
