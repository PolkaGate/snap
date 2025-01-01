import { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import { BN, BN_ZERO } from "@polkadot/util";
import { Balance } from "@polkadot/types/interfaces";
import { SubmittableExtrinsicFunction } from "@polkadot/api/types";
import { AnyTuple } from "@polkadot/types/types";
import { OUTPUT_TYPE } from "../../../../../constants";
import { amountToHuman } from "../../../../../util/amountToHuman";
import { STAKED_AMOUNT_DECIMAL_POINT } from "../../../components/UnstakeForm";
import type { Option } from '@polkadot/types';
import type { PalletStakingStakingLedger } from '@polkadot/types/lookup';


export const getSoloUnstake = async (
  address: string,
  amount: BN,
  genesisHash: HexString,
  output?: OUTPUT_TYPE
): Promise<{ call: SubmittableExtrinsicFunction<"promise", AnyTuple>; params: unknown[]; } | Balance> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const decimal = api.registry.chainDecimals[0];
  const stakingLedger = (await api.query.staking.ledger(address)) as Option<PalletStakingStakingLedger>;
  const unlockingLen = stakingLedger.isSome ? stakingLedger.unwrap().unlocking?.length : 0;
  const active = stakingLedger.isSome ? stakingLedger.unwrap().active : 0;
  const maxUnlockingChunks = api.consts['staking']['maxUnlockingChunks'].toNumber();
  let _amount = amount;

  const isUnstakingAll = Number(amountToHuman(active, decimal, STAKED_AMOUNT_DECIMAL_POINT)) === Number(amount);

  const optSpans = await api.query['staking']['slashingSpans'](address);
  const spanCount = optSpans.isNone ? 0 : optSpans.unwrap().prior.length + 1;

  const unbonded = api.tx['staking']['unbond'];
  let call = unbonded;
  let params = [] as unknown[];

  if (unlockingLen > maxUnlockingChunks) {
    const withdrawUnbonded = api.tx['staking']['withdrawUnbonded'];
    params.push([withdrawUnbonded(spanCount)]);
  }

  if (isUnstakingAll) {
    _amount = active;

    const nominators = await api.query['staking']['nominators'](address);
    const hasNominators = nominators.isSome && nominators.unwrap().targets?.length;

    if (hasNominators) {
      const chill = api.tx['staking']['chill'];
      params.push(chill());
    }
  }

  if (params.length) {
    call = api.tx['utility']['batchAll'];
    params.push([unbonded(amount)]);
  }

  let feeAsBalance = api.createType('Balance', BN_ZERO);
  const _params = params.length ? [params] : [_amount];

  if ((!output || output === OUTPUT_TYPE.FEE) && call) {
    const { partialFee } = await call(..._params).paymentInfo(address);
    feeAsBalance = api.createType('Balance', partialFee || BN_ZERO);
  }


  return output === OUTPUT_TYPE.CALL_PARAMS
    ? { call, params: _params }
    : feeAsBalance as Balance;
}