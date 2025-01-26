// Copyright 2019-2025 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32, u64 } from '@polkadot/types';
import type { DeriveSessionProgress } from '@polkadot/api-derive/types';

import { BN, BN_ZERO } from '@polkadot/util';
import { isHexToBn } from '../../../../../utils';
import type { ExposureOverview, Other } from '../../../types';
import { getApi } from '../../../../../util/getApi';
import type { HexString } from '@polkadot/util/types';
import getChainName from '../../../../../util/getChainName';
import { getFormatted } from '../../../../../util/getFormatted';
import type { ApiPromise } from '@polkadot/api';
import type { Forcing } from '@polkadot/types/interfaces';
import { getSnapState, updateSnapState } from '../../../../../rpc/stateManagement';
import _ from 'lodash'; // Use lodash for deep cloning

export const toBN = (i: unknown): BN => isHexToBn(String(i));

export type ExposureValue = {
  others: Other[];
  own: BN;
  total: BN;
}

// Record<era, EraUnclaimedPayouts>
export type Exposure = {
  own: BN;
  total: BN;
}

export type ExposureInfo = {
  exposedPage: number,
  myStaked: BN,
  total: BN,
  validatorAddress: string
}
export type EraExposureInfo = {
  eraIndex: number;
  exposureInfo: ExposureInfo[]
}
export type EraValidaTorPair = {
  eraIndex: number;
  validatorAddress: string
}

// Record<era, EraUnclaimedPayouts>
export type UnclaimedPayouts = Record<string, EraUnclaimedPayouts> | null;

// Record<validator, [page, amount]>
export type EraUnclaimedPayouts = Record<string, [number, BN]>;

export const PAGED_REWARD_START_ERA: Record<string, number> = {
  kusama: 6514,
  polkadot: 1420,
  westend: 7167,
  paseo: 1210 // not strict
};

export type AnyApi = any;
export type AnyJson = any;

const isRewardsPaged = (chainName: string | undefined, era: number): boolean => {
  if (!chainName) {
    return false;
  }

  const startEra = PAGED_REWARD_START_ERA[chainName];

  return startEra ? era >= startEra : false;
};

export const MAX_SUPPORTED_PAYOUT_ERAS = 7; // check: can increase to more if needed after enough tests

export type PendingRewardsOutput = {
  extra: {
    progress: DeriveSessionProgress;
    forcing: Forcing;
    historyDepth: BN;
    currentBlock: number;
  },
  info: UnclaimedPayouts | undefined;
}

/**
 * Fetches pending rewards for a given address and network.
 * @param address - The address to fetch pending rewards for.
 * @param genesisHash - The genesis hash of the network.
 * @param returnSaved - Optional flag to return saved state from storage if available.
 * @returns The pending rewards information, or undefined if no rewards are found.
 */
export default async function getPendingRewards(address: string, genesisHash: HexString, returnSaved?: boolean): Promise<PendingRewardsOutput | undefined> {

  const nameInStorage = `pendingRewards_${genesisHash}`;
  if (returnSaved) {
    const savedResult = await getSnapState(nameInStorage) as PendingRewardsOutput;
    if (savedResult) {
      savedResult.extra.progress.sessionLength = new BN(savedResult.extra.progress.sessionLength) as u64;
      savedResult.extra.progress.activeEra = new BN(savedResult.extra.progress.activeEra) as u32;
      savedResult.extra.progress.eraLength = new BN(savedResult.extra.progress.eraLength) as u32;
      savedResult.extra.progress.sessionProgress = new BN(savedResult.extra.progress.sessionProgress) as u32;
      savedResult.extra.progress.eraProgress = new BN(savedResult.extra.progress.eraProgress) as u32;
      savedResult.extra.historyDepth = new BN(savedResult.extra.historyDepth);

      const convertedInfo = savedResult.info
        ? Object.entries(savedResult.info).reduce<UnclaimedPayouts>(
          (acc, [era, eraUnclaimed]) => {
            if (!acc) acc = {}; // Ensure `acc` is not `null`.
            acc[era] = Object.entries(eraUnclaimed).reduce<EraUnclaimedPayouts>(
              (innerAcc, [validator, [page, amount]]) => {
                innerAcc[validator] = [page, isHexToBn(amount) as BN];
                return innerAcc;
              },
              {}
            );
            return acc;
          }, {})
        : null;

      return {
        ...savedResult,
        info: convertedInfo,
      };
    }
  }

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const chainName = await getChainName(genesisHash, true);
  const formatted = getFormatted(genesisHash, address)

  const maybeActiveEra = await api.query.staking.activeEra();
  const activeEra = maybeActiveEra.isSome ? maybeActiveEra.unwrap().index.toNumber() : 0;

  if (!activeEra) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const endEra = activeEra ? activeEra - MAX_SUPPORTED_PAYOUT_ERAS - 1 : 1;

  const fetchEraExposure = async (_api: ApiPromise, eraIndex: number): Promise<EraExposureInfo | null | undefined> => {
    if (!_api) {
      return;
    }

    if (isRewardsPaged(chainName, eraIndex)) {
      const overview = await _api.query.staking.erasStakersOverview.entries(eraIndex);

      const validatorsExposures = overview.reduce((prev: Record<string, Exposure>, [keys, value]) => {
        const validator = keys.toHuman()[1] as string;
        const { own, total } = value.unwrap() as ExposureOverview;

        return { ...prev, [validator]: { own: toBN(own), total: toBN(total) } };
      }, {});

      const validatorKeys = Object.keys(validatorsExposures);
      const pagedResults = await Promise.all(
        validatorKeys.map(async (v) =>
          _api.query.staking.erasStakersPaged.entries(eraIndex, v)
        )
      );

      const result: ExposureInfo[] = [];
      let i = 0;

      for (const pagedResult of pagedResults) {
        const validatorAddress = validatorKeys[i];

        pagedResult.forEach(([, v], index) => {
          const o = (v.unwrap()?.others ?? []) as Other[];
          const found = o.find(({ who }) => who.toString() === formatted);

          if (found) {
            const { value } = found;
            const { total } = validatorsExposures[validatorAddress];

            return result.push({
              exposedPage: index,
              myStaked: toBN(value),
              total: toBN(total),
              validatorAddress
            });
          }
        });

        i++;
      }

      return result.length ? { eraIndex, exposureInfo: result } : null;
    }
  };

  const getAllExposures = async (): Promise<EraExposureInfo[] | undefined> => {
    if (!api || !activeEra) {
      return;
    }

    let currentEra = activeEra - 1;
    const allExposures: EraExposureInfo[] = [];

    while (endEra < currentEra) {
      const eraExposureInfo = await fetchEraExposure(api, currentEra);

      if (eraExposureInfo) {
        allExposures.push(eraExposureInfo);
      }
      currentEra -= 1;
    }

    return allExposures;
  };

  const getExposedPage = (_eraIndex: number, _validatorAddress: string, allExposures: EraExposureInfo[]): number | undefined => {
    const found = allExposures.find(({ eraIndex }) => eraIndex === _eraIndex);

    if (found) {
      const { exposureInfo } = found;

      return exposureInfo.find(({ validatorAddress }) => validatorAddress === _validatorAddress)?.exposedPage;
    }

    return undefined;
  };

  const getEraExposure = (_eraIndex: number, _validatorAddress: string, allExposures: EraExposureInfo[]): ExposureInfo | null => {
    const found = allExposures.find(({ eraIndex }) => eraIndex === _eraIndex);

    if (found) {
      const { exposureInfo } = found;

      const foundInfo = exposureInfo.find(({ validatorAddress }) => validatorAddress === _validatorAddress);

      return foundInfo ?? null;
    }

    return null;
  };

  const handleUnclaimedRewards = async (allExposures: EraExposureInfo[]): Promise<{ [x: string]: EraUnclaimedPayouts; } | undefined> => {
    if (!api) {
      return;
    }

    const eraValidatorsToCheck: EraValidaTorPair[] = [];

    allExposures.forEach((exposures) => {
      const { eraIndex, exposureInfo } = exposures;

      exposureInfo.forEach((info) => {
        const { validatorAddress } = info;

        eraValidatorsToCheck.push({ eraIndex, validatorAddress });
      });
    });

    // History of claimed paged rewards by era and validator.
    const claimedRewards = await Promise.all(
      eraValidatorsToCheck.map(async ({ eraIndex, validatorAddress }) =>
        api.query.staking.claimedRewards<AnyApi>(eraIndex, validatorAddress)
      )
    );

    // Unclaimed rewards by validator. Record<validator, eraIndex[]>
    const unclaimedRewards: Record<number, string[]> = {};

    for (let i = 0; i < claimedRewards.length; i++) {
      const pages = (claimedRewards[i].toHuman() ?? []) as string[];

      const { eraIndex, validatorAddress } = eraValidatorsToCheck[i];
      const exposedPage = getExposedPage(eraIndex, validatorAddress, allExposures);

      // if payout page has not yet been claimed
      if (!pages.includes(String(exposedPage))) {
        if (unclaimedRewards?.[eraIndex]) {
          unclaimedRewards[eraIndex].push(validatorAddress);
        } else {
          unclaimedRewards[eraIndex] = [validatorAddress];
        }
      }
    }

    // calls needed to calculate rewards.
    const calls: AnyApi[] = [];

    Object.entries(unclaimedRewards).forEach(([eraIndex, validators]) => {
      if (validators.length > 0) {
        calls.push(
          Promise.all([
            api.query.staking.erasValidatorReward<AnyApi>(eraIndex),
            api.query.staking.erasRewardPoints<AnyApi>(eraIndex),
            ...validators.map(async (validator: AnyJson) =>
              api.query.staking.erasValidatorPrefs<AnyApi>(eraIndex, validator)
            )
          ])
        );
      }
    });

    // determine unclaimed payouts Record<era, Record<validator, unclaimedPayout>>.
    const unclaimed: UnclaimedPayouts = {};
    let i = 0;

    for (const [eraTotalPayout, erasRewardPoints, ...prefs] of await Promise.all(calls)) {
      const eraIndex = Object.keys(unclaimedRewards)[i];
      const unclaimedValidators = unclaimedRewards[eraIndex];

      let j = 0;

      for (const eraValidatorPrefs of prefs) {
        const commission = toBN(eraValidatorPrefs.commission).divn(10 ** 7);
        const validator = (unclaimedValidators?.[j] ?? '') as string;
        const exposureInfo = getEraExposure(Number(eraIndex), validator, allExposures);
        const myStaked = exposureInfo?.myStaked ?? BN_ZERO;
        const total = exposureInfo?.total ?? BN_ZERO;
        const exposedPage = exposureInfo?.exposedPage ?? 0;
        const totalRewardPoints = erasRewardPoints.total;
        const validatorRewardPoints = new BN(erasRewardPoints.toHuman().individual?.[validator]?.replace(/,/g, '') ?? 0);
        const available = toBN(eraTotalPayout).mul(validatorRewardPoints).div(totalRewardPoints);
        const valCut = commission.mul(available).divn(100);

        const unclaimedPayout = total.isZero()
          ? BN_ZERO
          : available.sub(valCut).mul(myStaked).div(total);

        if (!unclaimedPayout.isZero()) {
          unclaimed[eraIndex] = {
            ...unclaimed[eraIndex],
            [validator]: [exposedPage, unclaimedPayout]
          };
          j++;
        }
      }

      i++;
    }

    return { ...unclaimed };
  };

  const allExposures = await getAllExposures();

  let historyDepth = api.query['staking']?.['historyDepth'] && await api.query['staking']['historyDepth']();
  historyDepth = historyDepth ?? api.consts['staking']['historyDepth'];

  const [progress, forcing, header] = await Promise.all([
    api.derive.session.progress(),
    api.query['staking']['forceEra'](),
    api?.rpc.chain.getHeader()
  ]);

  const extra = {
    progress,
    forcing: forcing as Forcing,
    historyDepth: historyDepth as unknown as BN,
    currentBlock: header.number.unwrap().toNumber()
  }

  if (allExposures?.length) {
    const result = {
      extra,
      info: await handleUnclaimedRewards(allExposures)
    }

    // prepare to save to snap state
    const convertedInfo = result.info
      ? Object.entries(result.info).reduce<UnclaimedPayouts>((acc, [era, eraUnclaimed]) => {
        if (!acc) acc = {}; // just to suppress TS
        acc[era] = Object.entries(eraUnclaimed).reduce<EraUnclaimedPayouts>(
          (innerAcc, [validator, [page, amount]]) => {
            innerAcc[validator] = [page, String(amount)];
            return innerAcc;
          }, {});
        return acc;
      }, {})
      : null;

    const resultToSave = {
      ..._.cloneDeep(result),
      info: convertedInfo,
    };

    resultToSave.extra.progress.sessionLength = String(result.extra.progress.sessionLength);
    resultToSave.extra.progress.eraLength = String(result.extra.progress.eraLength);
    resultToSave.extra.progress.sessionProgress = String(result.extra.progress.sessionProgress);
    resultToSave.extra.progress.eraProgress = String(result.extra.progress.eraProgress);
    resultToSave.extra.progress.activeEra = String(result.extra.progress.activeEra);
    resultToSave.extra.historyDepth = String(result.extra.historyDepth);

    await updateSnapState(nameInStorage, resultToSave);

    return result;
  }
  return undefined;
}
