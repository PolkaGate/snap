import { BN_ZERO } from "@polkadot/util";
import type { Balance } from "@polkadot/types/interfaces";
import { OUTPUT_TYPE } from "../constants";
import type { CallParamsType } from "../ui/stake/types";
import type { ApiPromise } from "@polkadot/api";

/**
 * Handles the output for a blockchain call, either returning the fee balance or the call parameters.
 * @param address - The address to be used for the call.
 * @param api - The API instance used to interact with the blockchain.
 * @param call - The blockchain call function.
 * @param params - The parameters to be passed to the call function.
 * @param output - The type of output, either fee or call parameters.
 * @returns A Promise that resolves to the fee balance or the call parameters.
 */
export const handleOutput = async (
  address: string,
  api: ApiPromise,
  call:CallParamsType["call"],
  params: unknown[],
  output?: number
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