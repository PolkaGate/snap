import { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import { BN, BN_ZERO } from "@polkadot/util";
import { Balance } from "@polkadot/types/interfaces";
import { OUTPUT_TYPE } from "../../../../../constants";
import { SubmittableExtrinsicFunction } from "@polkadot/api/types";
import { AnyTuple } from "@polkadot/types/types";


export const getSoloStakeMore = async (
  address: string,
  amount: BN,
  genesisHash: HexString,
  outputType?: OUTPUT_TYPE
): Promise<Balance | { call: SubmittableExtrinsicFunction<"promise", AnyTuple>; params: BN[]; }> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  let feeAsBalance = api.createType('Balance', BN_ZERO);

  const params = [amount];
  let call = api.tx['staking']['bondExtra'];

  if (call && (!outputType || outputType === OUTPUT_TYPE.FEE)) {
    const { partialFee } = await call(...params).paymentInfo(address);
    feeAsBalance = api.createType('Balance', partialFee || BN_ZERO);
  }

  return outputType === OUTPUT_TYPE.CALL_PARAMS
    ? { call, params }
    : feeAsBalance as Balance;
}