// Copyright 2019-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Codec } from '@polkadot/types/types';
import { getApi } from '../../../util/getApi';
import type { HexString } from '@polkadot/util/types';
import type { PalletNominationPoolsBondedPoolInner } from '@polkadot/types/lookup';


export type PoolInfo = {
  poolId: number;
  bondedPool: PalletNominationPoolsBondedPoolInner | null;
  metadata: string | null;
}

const handleInfo = (info: [Codec, Codec][], lastBatchLength: number): PoolInfo[] => {
  return info.map((i, index) => {
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
}

/**
 * Fetches information about nomination pools from the specified blockchain network.
 * @param genesisHash - The genesis hash of the blockchain to connect to.
 * @returns An array of `PoolInfo` objects containing details about each pool, or `undefined` if no pools are found.
 * @throws An error if the API connection fails or the network is unreachable.
 */
export default async function getPools(genesisHash: HexString): Promise<PoolInfo[] | undefined> {
  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const lastPoolId = ((await api.query.nominationPools.lastPoolId())?.toNumber() ?? 0) as number;

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
