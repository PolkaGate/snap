
import type { ApiPromise } from '@polkadot/api';
import type { Balance } from '@polkadot/types/interfaces';
import { BN, BN_ONE, BN_ZERO, bnToU8a, stringToU8a, u8aConcat } from '@polkadot/util';

export type PoolAccounts = {
  rewardId: string;
  stashId: string;
}
export type PoolBalances = {
  total: string | BN | Balance;
  active: string | BN | Balance;
  claimable: string | BN | Balance;
  unlocking: string | BN | Balance;
  redeemable: string | BN | Balance;
  toBeReleased?: {
    amount: string | BN | Balance;
    date: number;
  }[]
}

const EMPTY_H256 = new Uint8Array(32);
const MOD_PREFIX = stringToU8a('modl');

/**
 * Creates an account ID for a given nomination pool using the provided parameters.
 * @param api - The API instance to interact with the blockchain.
 * @param poolId - The ID of the nomination pool. It can be a number, bigint, or BN.
 * @param index - The index to uniquely identify the account.
 * @returns A string representing the generated account ID.
 */
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

/**
 * Retrieves the accounts associated with a specific nomination pool.
 * @param api - The API instance to interact with the blockchain.
 * @param poolId - The ID of the nomination pool. It can be a number, bigint, or BN.
 * @returns An object containing the reward and stash account IDs for the pool.
 */
function getPoolAccounts(api: ApiPromise, poolId: number | bigint | BN | null | undefined): PoolAccounts {
  return {
    rewardId: createAccount(api, poolId, 1),
    stashId: createAccount(api, poolId, 0)
  };
}

export type PooledBalance = {
  pooledBalance: BN;
  poolId?: number;
  metadata?: string;
  pooled?: PoolBalances
}

/**
 * Retrieves the pooled balance for a specific address in the nomination pool.
 * @param api - The API instance to interact with the blockchain.
 * @param address - The address whose pooled balance is to be fetched.
 * @returns An object containing the pooled balance details, including total, active, claimable, unlocking, redeemable, and the pool ID.
 */
export async function getPooledBalance(api: ApiPromise, address: string): Promise<PooledBalance> {
  const response = await api.query.nominationPools.poolMembers(address);
  const member = response?.unwrapOr(undefined);

  if (!member) {
    return { pooledBalance: BN_ZERO };
  }

  const poolId = member.poolId;
  const accounts = poolId && getPoolAccounts(api, poolId);

  if (!accounts) {
    return { pooledBalance: BN_ZERO };
  }

  const [bondedPool, progress, stashIdAccount, claimable, metadata] = await Promise.all([
    api.query['nominationPools']['bondedPools'](poolId),
    api.derive.session.progress(),
    api.derive.staking.account(accounts.stashId),
    api.call['nominationPoolsApi']['pendingRewards'](address) as unknown as BN,
    api.query.nominationPools.metadata(poolId),
  ]);

  const { currentEra, eraLength, eraProgress } = progress;

  const active = member.points.isZero()
    ? BN_ZERO
    : (new BN(String(member.points)).mul(new BN(String(stashIdAccount.stakingLedger.active)))).div(new BN(String(bondedPool.unwrap()?.points ?? BN_ONE)));

  let unlocking = BN_ZERO;
  let redeemable = BN_ZERO;
  const toBeReleased = [];

  if (member && !member.unbondingEras.isEmpty) {

    for (const [era, unbondingPoint] of Object.entries(member.unbondingEras.toJSON())) {
      const _era = new BN(era);
      const points = new BN(unbondingPoint as string);
      const remainingEras = _era.sub(currentEra);

      if (remainingEras.gtn(0)) {
        unlocking = unlocking.add(points);
        const secToBeReleased = remainingEras.subn(1).mul(eraLength).add(eraLength.sub(eraProgress)).muln(6);
        toBeReleased.push({ amount: String(points), date: Date.now() + Number(secToBeReleased.muln(1000)) });
      } else {
        redeemable = redeemable.add(points);
      }
    }
  }

  return {
    pooledBalance: active.add(claimable).add(unlocking),
    pooled: {
      total: active.add(claimable).add(unlocking).add(redeemable).toString(),
      active: active.toString(),
      claimable: claimable.toString(),
      unlocking: unlocking.toString(),
      redeemable: redeemable.toString(),
      toBeReleased
    },
    poolId: poolId ? Number(poolId) : undefined,
    metadata: metadata?.length
      ? metadata.isUtf8
        ? metadata.toUtf8()
        : metadata.toString()
      : null
  }
}
