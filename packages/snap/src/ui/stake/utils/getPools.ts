// Copyright 2019-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Codec } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
import { getApi } from '../../../util/getApi';
import { HexString } from '@polkadot/util/types';
import type { PalletNominationPoolsBondedPoolInner } from '@polkadot/types/lookup';


export interface PoolInfo {
  poolId: number;
  bondedPool: PalletNominationPoolsBondedPoolInner | null;
  metadata: string | null;
}

export interface PoolAccounts {
  rewardId: string;
  stashId: string;
}

import { bnToU8a, stringToU8a, u8aConcat } from '@polkadot/util';

const EMPTY_H256 = new Uint8Array(32);
const MOD_PREFIX = stringToU8a('modl');

export function createAccount (api: ApiPromise, poolId: number | bigint | BN | null | undefined, index: number): string {
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

function getPoolAccounts (api: ApiPromise, poolId: number | bigint | BN | null | undefined): PoolAccounts {
  return {
    rewardId: createAccount(api, poolId, 1),
    stashId: createAccount(api, poolId, 0)
  };
}

const handleInfo = (info: [Codec, Codec][], lastBatchLength: number) =>
  info.map((i, index) => {
    if (i[1].isSome) {
      const bondedPool = i[1].unwrap();

      return {
        bondedPool,
        metadata: i[0]?.length
          ? i[0]?.isUtf8
            ? i[0]?.toUtf8()
            : i[0]?.toString()
          : null,
        poolId: index + lastBatchLength + 1, // works because pools id is not reuseable for now
      };
    } else {
      return undefined;
    }
  })?.filter((f) => f !== undefined);

export default async function getPools(genesisHash: HexString):Promise<PoolInfo[] | undefined> {
  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const lastPoolId = ((await api.query.nominationPools.lastPoolId())?.toNumber() || 0) as number;

  if (!lastPoolId) {
   // no pools on this chain!

    return;
  }

  let poolsInfo: PoolInfo[] = [];
  let upperBond;
  const page = 50;
  let totalFetched = 0;

  while (lastPoolId > totalFetched) {
    const queries = [];

    upperBond = totalFetched + page < lastPoolId ? totalFetched + page : lastPoolId;

    for (let poolId = totalFetched + 1; poolId <= upperBond; poolId++) {
      // const { stashId } = getPoolAccounts(api, poolId);

      queries.push(Promise.all([
        api.query.nominationPools.metadata(poolId),
        api.query['nominationPools']['bondedPools'](poolId),
      ]));
    }

    const i = await Promise.all(queries);

    const info = handleInfo(i, totalFetched);

    poolsInfo = poolsInfo.concat(info);
    totalFetched += page;
  }



  return poolsInfo;
}
