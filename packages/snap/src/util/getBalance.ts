import type { Balance } from '@polkadot/types/interfaces';
import type { AccountData } from '@polkadot/types/interfaces/balances/types';

import { getApi } from './getApi';
import { getFormatted } from './getFormatted';
import type { BN } from '@polkadot/util';
import { BN_ZERO, bnMax } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { PoolBalances } from './getPooledBalance';
import { getPooledBalance } from './getPooledBalance';
import { getSoloBalances } from './getSoloBalances';
import type { SoloBalance } from '../ui/stake/types';
import { isHexToBn } from '../utils';

export type Balances = {
  total: BN | Balance;
  transferable: BN | Balance;
  locked: BN | Balance;
  soloTotal?: BN | Balance;
  rewardsDestination?: string | null;
  pooledBalance?: BN | Balance;
  pooled?: PoolBalances,
  poolId?: number;
  solo?: SoloBalance;
  poolName?: string;
  decimal: number;
  genesisHash: HexString;
  token: string;
};

/**
 * To get the balances including locked one of an address.
 * @param genesisHash - The genesisHash of the chain will be used to find an endpoint to use.
 * @param address - An address to get its balances.
 * @returns The total, transferable, and locked balances.
 */
export async function getBalances(genesisHash: HexString, address: string,): Promise<Balances> {
  const SOLO_BALANCES_DEFAULT = {
    total: BN_ZERO,
    active: BN_ZERO,
    unlocking: BN_ZERO,
    redeemable: BN_ZERO
  }

  const POOLED_BALANCES_DEFAULT = {
    total: BN_ZERO,
    active: BN_ZERO,
    claimable: BN_ZERO,
    unlocking: BN_ZERO,
    redeemable: BN_ZERO
  }

  const DEFAULT_RETURN = {
    genesisHash,
    total: BN_ZERO,
    transferable: BN_ZERO,
    locked: BN_ZERO,
    soloTotal: BN_ZERO,
    pooledBalance: BN_ZERO,
    pooled: POOLED_BALANCES_DEFAULT,
    solo: SOLO_BALANCES_DEFAULT,
    decimal: 10,
    token: 'Unit'
  };

  try {
    const api = await getApi(genesisHash);

    if (!api) {
      return DEFAULT_RETURN;
    }

    const decimal = api.registry.chainDecimals[0];
    const token = api.registry.chainTokens[0];
    const formatted = getFormatted(genesisHash, address);

    const balances = (await api.query.system.account(formatted)) as unknown as {
      data: AccountData;
    };

    if (balances.data.free.isZero()) {
      // no need to more check!!
      const ZERO_BALANCE = api.createType('Balance', BN_ZERO) as unknown as Balance;

      return {
        genesisHash,
        total: ZERO_BALANCE,
        transferable: ZERO_BALANCE,
        locked: ZERO_BALANCE,
        soloTotal: ZERO_BALANCE,
        pooledBalance: ZERO_BALANCE,
        pooled: POOLED_BALANCES_DEFAULT,
        solo: SOLO_BALANCES_DEFAULT,
        decimal,
        token
      };
    }

    const { soloTotal, solo, rewardsDestination } = await getSoloBalances(api, formatted);

    let pooledBalance: Balance | undefined = undefined;
    let pooledBalanceDetails: PoolBalances | undefined = undefined;
    let maybePoolId;
    let maybePoolName;

    if (api.query.nominationPools?.poolMembers) {
      const { pooledBalance: mayBePooledBalance, pooled, poolId, metadata } = await getPooledBalance(api, formatted);

      if (mayBePooledBalance) {
        pooledBalance = api.createType('Balance', mayBePooledBalance) as unknown as Balance;
        maybePoolId = poolId;
        maybePoolName = metadata;
        pooledBalanceDetails = pooled;
      }
    }

    const frozenBalance = balances.data.frozen ?? balances.data.miscFrozen ?? BN_ZERO;
    const noFrozenReserved = frozenBalance.isZero() && balances.data.reserved?.isZero();
    const ED = isHexToBn(String(api.consts['balances']['existentialDeposit']));
    const frozenReserveDiff = frozenBalance.sub(balances.data.reserved ?? BN_ZERO);
    const maybeED = noFrozenReserved ? BN_ZERO : (ED ?? BN_ZERO);
    const untouchable = bnMax(maybeED, frozenReserveDiff);

    const transferable = api.createType('Balance', balances.data.free ? (balances.data.free).sub(untouchable) : BN_ZERO) as unknown as Balance;

    const total = api.createType('Balance', balances.data.free.add(balances.data.reserved)) as unknown as Balance;
    const locked = api.createType('Balance', (frozenBalance)) as unknown as Balance;

    return {
      decimal,
      genesisHash,
      locked,
      pooledBalance,
      pooled: pooledBalanceDetails,
      poolId: maybePoolId,
      poolName: maybePoolName,
      solo,
      rewardsDestination,
      soloTotal,
      total,
      transferable,
      token
    };
  } catch {
    return DEFAULT_RETURN;
  }
}
