import { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import { BN, BN_ZERO } from "@polkadot/util";
import { Balance } from "@polkadot/types/interfaces";
import { SubmittableExtrinsicFunction } from "@polkadot/api/types";
import { AnyTuple } from "@polkadot/types/types";
import { OUTPUT_TYPE } from "../../../../../constants";
import type { Option } from '@polkadot/types';
import type { PalletStakingStakingLedger } from '@polkadot/types/lookup';
import { handleOutput } from "../../../../../util/handleOutput";

export const getPoolUnstake = async (
  address: string,
  amount: BN,
  genesisHash: HexString,
  poolId: number,
  output?: OUTPUT_TYPE
): Promise<{ call: SubmittableExtrinsicFunction<"promise", AnyTuple>; params: unknown[]; } | Balance> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const stakingLedger = (await api.query.staking.ledger(address)) as Option<PalletStakingStakingLedger>;
  const unlockingLen = stakingLedger.isSome ?stakingLedger.unwrap().unlocking?.length : 0;

  const maxUnlockingChunks = api.consts['staking']['maxUnlockingChunks'].toNumber();

  const optSpans = await api.query['staking']['slashingSpans'](address);
  const spanCount = optSpans.isNone ? 0 : optSpans.unwrap().prior.length + 1;

  let call = api.tx['nominationPools']['unbond'];
  let params = [address, amount] as unknown[];

  if (unlockingLen > maxUnlockingChunks) {
    const unbonded = api.tx['nominationPools']['unbond'];
    const poolWithdrawUnbonded = api.tx['nominationPools']['poolWithdrawUnbonded'];

    call = api.tx['utility']['batchAll'];
    params = [[poolWithdrawUnbonded(poolId, spanCount), unbonded(address, amount)]];
  }

    return await handleOutput(address, api, call, params, output);
}