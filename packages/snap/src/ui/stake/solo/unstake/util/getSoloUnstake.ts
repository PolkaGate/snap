import type { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import type { Balance } from "@polkadot/types/interfaces";
import { amountToHuman } from "../../../../../util/amountToHuman";
import type { Option, u32 } from '@polkadot/types';
import type { PalletStakingStakingLedger } from '@polkadot/types/lookup';
import { handleOutput } from "../../../../../util/handleOutput";
import { amountToMachine } from "../../../../../util/amountToMachine";
import type { CallParamsType } from "../../../types";
import { DEFAULT_DECIMAL_POINT } from "../../../const";
import { getSpanCount } from "../../../utils/getSpanCount";

export const getSoloUnstake = async (
  address: string,
  userInputAmount: string,
  genesisHash: HexString,
  output?: number
): Promise<CallParamsType | Balance> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const decimal = api.registry.chainDecimals[0];
  let _amount = amountToMachine(userInputAmount, decimal);

  const stakingLedger = (await api.query.staking.ledger(address)) as Option<PalletStakingStakingLedger>;
  const unlockingLen = stakingLedger.isSome ? stakingLedger.unwrap().unlocking?.length : 0;
  const active = stakingLedger.isSome ? stakingLedger.unwrap().active : 0;
  const maxUnlockingChunks = (api.consts.staking.maxUnlockingChunks as u32).toNumber();
  const spanCount = await getSpanCount(api, address)

  const unbonded = api.tx.staking.unbond;
  let call = unbonded;
  const params = [] as unknown[];

  if (unlockingLen > maxUnlockingChunks) {
    const withdrawUnbonded = api.tx.staking.withdrawUnbonded;
    params.push(withdrawUnbonded(spanCount));
  }

  const isUnstakingAll = Number(amountToHuman(active, decimal, DEFAULT_DECIMAL_POINT)) === Number(userInputAmount);

  if (isUnstakingAll) {
    _amount = active;

    const nominators = await api.query.staking.nominators(address);
    const hasNominators = nominators.isSome && nominators.unwrap().targets?.length;

    if (hasNominators) {
      const chill = api.tx.staking.chill;
      params.push(chill());
    }
  }

  if (params.length) {
    call = api.tx.utility.batchAll;
    params.push(unbonded(_amount));
  }

  const _params = params.length ? [params] : [_amount];

  return await handleOutput(address, api, call, _params, output);
}