import { BN_ZERO } from "@polkadot/util";
import { Balance } from "@polkadot/types/interfaces";
import { OUTPUT_TYPE } from "../constants";
import { CallParamsType } from "../ui/stake/types";
import { SubmittableExtrinsicFunction } from "@polkadot/api/types";
import { AnyTuple } from "@polkadot/types/types";
import { ApiPromise } from "@polkadot/api";

export const handleOutput = async (
  address: string,
  api: ApiPromise,
  call: SubmittableExtrinsicFunction<"promise", AnyTuple>,
  params: unknown[],
  output?: OUTPUT_TYPE
): Promise<Balance | CallParamsType> => {

  let feeAsBalance = api.createType('Balance', BN_ZERO);

  if ((output === undefined || output === OUTPUT_TYPE.FEE) && call) {
    const { partialFee } = await call(...params).paymentInfo(address);
    feeAsBalance = api.createType('Balance', partialFee || BN_ZERO);
  }

  return output === OUTPUT_TYPE.CALL_PARAMS
    ? { call, params }
    : feeAsBalance as Balance;
}