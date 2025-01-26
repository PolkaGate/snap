import type { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import type { SpStakingPagedExposureMetadata, PalletStakingValidatorPrefs, Option } from "@polkadot/types/interfaces";
import type { BN } from "@polkadot/util";
import { getFormatted } from "../../../../../util/getFormatted";

type ValidatorPrefOverview = {
  address: string;
  prefs: PalletStakingValidatorPrefs;
  overviews: SpStakingPagedExposureMetadata | null;
};

export type ValidatorInfoClipped = {
  activeValidators: string[];
  elected: ValidatorPrefOverview[];
  waiting: ValidatorPrefOverview[];
};

export type Other = {
  who: string;
  value: BN;
}

export const getValidatorsInfo = async (
  address: string,
  genesisHash: HexString,
  nominators: string[]
): Promise<ValidatorInfoClipped> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const eraIndex = (await api.query.staking.currentEra()).toString();

  const infoAsPromise = nominators.map(async (_address) => {
    const [prefs, overviews] = await Promise.all([
      api.query.staking.validators(_address),
      api.query.staking.erasStakersOverview(eraIndex, _address),
    ]);

    return { address: _address, prefs, overviews };
  });

  let validatorsInfo = await Promise.all(infoAsPromise);

  validatorsInfo = validatorsInfo.map((res) => {
    return {
      ...res,
      overviews: res.overviews.unwrapOr(null)
    }
  })

  // separate waiting and elected validators
  const [elected, waiting] = validatorsInfo.reduce<[typeof validatorsInfo[0][], typeof validatorsInfo[0][]]>(
    ([_elected, _waiting], validator) => {
      if (validator.overviews?.nominatorCount) {
        _elected.push(validator);
      } else {
        _waiting.push(validator);
      }
      return [_elected, _waiting];
    },
    [[], []]
  );

  // get nominators for elected validators
  const erasStakersPagedAsPromises = elected.map(async (ev) => api.query.staking.erasStakersPaged.entries(eraIndex, ev.address));

  const validatorsPaged = await Promise.all(erasStakersPagedAsPromises);

  const currentNominators: Record<string, Other[]> = {};

  validatorsPaged.forEach((pages) => {
    if (pages[0]) {
      const validatorAddress = pages[0][0].args[1].toString();

      currentNominators[validatorAddress] = [];

      pages.forEach(([, value]) => currentNominators[validatorAddress].push(...((value as Option<any>).unwrap()?.others || [])));
    }
  });

  const activeValidators: string[] = [];
  const formatted = getFormatted(genesisHash, address);

  Object.entries(currentNominators).forEach(([validator, others]) => {
    const found = others.find(({ who }) => String(who) === formatted);

    if (found) {
      activeValidators.push(validator);
    }
  });

  return { activeValidators, elected, waiting };
}