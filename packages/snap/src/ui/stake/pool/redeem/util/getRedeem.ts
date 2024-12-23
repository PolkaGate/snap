import { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import { BN_ZERO } from "@polkadot/util";
import { Balance } from "@polkadot/types/interfaces";
import { OUTPUT_TYPE } from "../../../../../constants";
import { SubmittableExtrinsicFunction } from "@polkadot/api/types";
import { AnyTuple } from "@polkadot/types/types";


export const getRedeem = async (
  address: string,
  genesisHash: HexString,
  output?: OUTPUT_TYPE
): Promise<
  Balance |
  {
    call: SubmittableExtrinsicFunction<"promise", AnyTuple>;
    params: unknown[];
  }> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  let feeAsBalance = api.createType('Balance', BN_ZERO);

  const call = api.tx['nominationPools']['withdrawUnbonded'];

  const optSpans = await api.query['staking']['slashingSpans'](address) as any;
  const spanCount = optSpans.isNone ? 0 : optSpans.unwrap().prior.length + 1;
  const params = [address, spanCount];


  if (call && (!output || output === OUTPUT_TYPE.FEE)) {
    const { partialFee } = await call(...params).paymentInfo(address);
    feeAsBalance = api.createType('Balance', partialFee || BN_ZERO);
  }

  return output === OUTPUT_TYPE.CALL_PARAMS
    ? { call, params }
    : feeAsBalance as Balance;
}