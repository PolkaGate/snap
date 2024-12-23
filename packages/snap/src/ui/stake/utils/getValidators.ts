// Copyright 2019-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getApi } from '../../../util/getApi';
import { HexString } from '@polkadot/util/types';

import type { Option, StorageKey } from '@polkadot/types';
import type { AccountId } from '@polkadot/types/interfaces';
// @ts-ignore
import type { PalletStakingValidatorPrefs } from '@polkadot/types/lookup';
import type { AnyJson, AnyTuple, Codec } from '@polkadot/types/types';

import { BN_ZERO } from '@polkadot/util';
import { getSnapState, updateSnapState } from '../../../rpc/stateManagement';
import { AllValidators, ExposureOverview, Other, ValidatorInfo } from '../types';

const SAVED_VALIDITY_PERIOD = 2 * 60 * 60 * 1000;

export const getValidators = async (genesisHash: HexString): Promise<AllValidators> => {
  const nameInStorage =`validators_${genesisHash}`;
  const savedResult = await getSnapState(nameInStorage);
  if (savedResult) {
    const { result, date } = savedResult;
    if (Date.now() - date < SAVED_VALIDITY_PERIOD) {
      return result;
    }
  }

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const eraIndex = (await api.query.staking.currentEra()).toString();

  const [prefs, overview] = await Promise.all([
    api.query['staking']['validators'].entries(),
    api.query['staking']['erasStakersOverview'].entries(eraIndex)
  ]);

  const validatorPrefs: Record<string, PalletStakingValidatorPrefs> = Object.fromEntries(
    prefs.map(([key, value]) => {
      const validatorAddress = key.toHuman() as string;

      return [validatorAddress, value as PalletStakingValidatorPrefs];
    }));

  const currentEraValidatorsOverview = Object.fromEntries(
    overview.map(([keys, value]) => {
      const validatorAddress = (keys.toHuman() as AnyJson[])[1] as string;
      const { nominatorCount, own, pageCount, total } = (value as Option<any>).unwrap() as ExposureOverview;

      return [validatorAddress, { nominatorCount, own, pageCount, total }];
    }));

  const validatorKeys = Object.keys(currentEraValidatorsOverview);

  const PAGE_SIZE = 10;
  let totalFetched = 0;
  let validatorsPaged = [] as [StorageKey<AnyTuple>, Codec][][];

  while (validatorKeys.length > totalFetched) {
    const validatorsPagedPartial = await Promise.all(
      validatorKeys.slice(totalFetched, totalFetched + PAGE_SIZE).map((v) =>
        api.query['staking']['erasStakersPaged'].entries(eraIndex, v)
      )
    );

    validatorsPaged = validatorsPaged.concat(validatorsPagedPartial);
    totalFetched = totalFetched + PAGE_SIZE;
  }

  const currentNominators: Record<string, Other[]> = {};

  validatorsPaged.forEach((pages) => {
    if (pages[0]) {
      const validatorAddress = pages[0][0].args[1].toString();

      currentNominators[validatorAddress] = [];

      pages.forEach(([, value]) => currentNominators[validatorAddress].push(...((value as Option<any>).unwrap()?.others || [])));
    }
  });

  const current: ValidatorInfo[] = [];
  const waiting: ValidatorInfo[] = [];

  for (const v of Object.keys(validatorPrefs)) {
    if (Object.keys(currentEraValidatorsOverview).includes(v)) {
      // const apy = await getValidatorApy(api, v, currentEraValidatorsOverview[v].total, validatorPrefs[v].commission, currentEraIndex);

      current.push(
        {
          accountId: v as unknown as AccountId,
          // apy,
          exposure: {
            ...currentEraValidatorsOverview[v],
            others: currentNominators[v]
          },
          stashId: v as unknown as AccountId,
          validatorPrefs: validatorPrefs[v]
        } as unknown as ValidatorInfo // types need to be revised!
      );
    } else {
      waiting.push(
        {
          accountId: v as unknown as AccountId,
          exposure: {
            others: [],
            own: BN_ZERO,
            total: BN_ZERO
          },
          stashId: v as unknown as AccountId,
          validatorPrefs: validatorPrefs[v]
        } as unknown as ValidatorInfo
      );
    }
  }

  const result = {
    current,
    eraIndex,
    waiting
  };

  await updateSnapState(nameInStorage, { result, date: Date.now() });

  return result;
};