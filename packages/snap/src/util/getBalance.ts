import type { Balance } from '@polkadot/types/interfaces';
import type { AccountData } from '@polkadot/types/interfaces/balances/types';

import { getApi } from './getApi';
import { getFormatted } from './getFormatted';
import { ApiPromise } from '@polkadot/api';
import { BN, BN_ONE, BN_ZERO, bnToU8a, stringToU8a, u8aConcat } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';

export interface PoolAccounts {
  rewardId: string;
  stashId: string;
}

export type Balances = {
  total: Balance;
  transferable: Balance;
  locked: Balance;
  soloTotal?: Balance;
  pooledBalance?: Balance;
  decimal: number;
};

/**
 * To get the balances including locked one of an address.
 *
 * @param genesisHash - The genesisHash of the chain will be used to find an endpoint to use.
 * @param address - An address to get its balances.
 * @returns The total, transferable, and locked balances.
 */
export async function getBalances(genesisHash: HexString, address: string,): Promise<Balances> {
  console.info(`getting balances for ${address} on ${genesisHash}`)

  const api = await getApi(genesisHash);
  const formatted = getFormatted(genesisHash, address);
  console.info(`Formatted address for ${address} is ${formatted}`)

  const balances = (await api.query.system.account(formatted)) as unknown as {
    data: AccountData;
  };

  let soloTotal;
  if (api.query.staking?.ledger) {
    const ledger = await api.query.staking.ledger(formatted);

    if (ledger.isSome) {
      soloTotal = api.createType(
        'Balance',
        ledger.unwrap().total
      ) as unknown as Balance;
    }
  }

  let pooledBalance: Balance | undefined = undefined;

  if (api.query.staking?.ledger) {
    const mayBePooledBalance = await getPooledBalance(api, formatted);

    if (mayBePooledBalance) {
      pooledBalance = api.createType(
        'Balance',
        mayBePooledBalance
      ) as unknown as Balance;
    }
  }

  const transferable = api.createType(
    'Balance',
    balances.data.free.sub(balances.data.frozen),
  ) as unknown as Balance;

  const total = api.createType(
    'Balance',
    balances.data.free.add(balances.data.reserved),
  ) as unknown as Balance;

  const locked = api.createType(
    'Balance',
    balances.data.frozen,
  ) as unknown as Balance;

  const decimal = api.registry.chainDecimals[0];

  return { total, transferable, locked, soloTotal, pooledBalance, decimal };
}


const EMPTY_H256 = new Uint8Array(32);
const MOD_PREFIX = stringToU8a('modl');

export function createAccount(api: ApiPromise, poolId: number | bigint | BN | null | undefined, index: number): string {
  return api.registry.createType(
    'AccountId32',
    u8aConcat(
      MOD_PREFIX,
      api.consts.nominationPools.palletId.toU8a(),
      new Uint8Array([index]),
      bnToU8a(poolId, { bitLength: 32 }),
      EMPTY_H256
    )
  ).toString();
}

function getPoolAccounts(api: ApiPromise, poolId: number | bigint | BN | null | undefined): PoolAccounts {
  return {
    rewardId: createAccount(api, poolId, 1),
    stashId: createAccount(api, poolId, 0)
  };
}


async function getPooledBalance(api: ApiPromise, address: string): Promise<BN> {
  const response = await api.query.nominationPools.poolMembers(address);
  const member = response && response.unwrapOr(undefined);

  if (!member) {
    return BN_ZERO;
  }

  const poolId = member.poolId;
  const accounts = poolId && getPoolAccounts(api, poolId);

  if (!accounts) {
    return BN_ZERO;
  }

  const [bondedPool, stashIdAccount, myClaimable] = await Promise.all([
    api.query['nominationPools']['bondedPools'](poolId),
    api.derive.staking.account(accounts.stashId),
    api.call['nominationPoolsApi']['pendingRewards'](address)
  ]);

  const active = member.points.isZero()
    ? BN_ZERO
    : (new BN(String(member.points)).mul(new BN(String(stashIdAccount.stakingLedger.active)))).div(new BN(String(bondedPool.unwrap()?.points ?? BN_ONE)));

  const rewards = myClaimable as unknown as BN;
  let unlockingValue = BN_ZERO;

  member?.unbondingEras?.forEach((value: BN) => {
    unlockingValue = unlockingValue.add(value);
  });

  return active.add(rewards).add(unlockingValue);
}
