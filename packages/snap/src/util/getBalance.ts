import { Balance } from '@polkadot/types/interfaces';
import type { AccountData } from '@polkadot/types/interfaces/balances/types';
import { getApi } from './getApi';
import { getFormatted } from './getFormatted';

export type Balances = {
  total: Balance;
  transferable: Balance;
  locked: Balance;
};

/**
 * To get the balance of an address.
 *
 * @param genesisHash - The genesisHash of the chain will be used to find an endpoint to use.
 * @param address - An address to get its balances.
 * @returns The total, transferable balance.
 */
export async function getBalances(
  genesisHash: string,
  address: string,
): Promise<Balances> {
  const api = await getApi(genesisHash);
  const formatted = getFormatted(genesisHash, address);
  const token = api.registry.chainTokens[0];

  const balances = (await api.query.system.account(formatted)) as unknown as {
    data: AccountData;
  };

  const transferable = api.createType(
    'Balance',
    balances.data.free.sub(balances.data.frozen),
  ) as Balance;
  const total = api.createType(
    'Balance',
    balances.data.free.add(balances.data.reserved),
  ) as Balance;

  return { total, transferable, token };
}

/**
 *
 * @param genesisHash
 * @param address
 */
export async function getBalances2(
  genesisHash: string,
  address: string,
): Promise<Balances> {
  const api = await getApi(genesisHash);
  console.log('api ', api);

  const formatted = getFormatted(genesisHash, address);
  console.log('formatted ', formatted);

  const balances = (await api.query.system.account(formatted)) as unknown as {
    data: AccountData;
  };

  console.log('balances ', balances);

  const transferable = api.createType(
    'Balance',
    balances.data.free.sub(balances.data.frozen),
  ) as Balance;

  const total = api.createType(
    'Balance',
    balances.data.free.add(balances.data.reserved),
  ) as Balance;

  const locked = api.createType('Balance', balances.data.frozen) as Balance;

  return { total, transferable, locked };
}
