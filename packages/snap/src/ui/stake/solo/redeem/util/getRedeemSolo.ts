import { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import { Balance } from "@polkadot/types/interfaces";
import { OUTPUT_TYPE } from "../../../../../constants";
import { SubmittableExtrinsicFunction } from "@polkadot/api/types";
import { AnyTuple } from "@polkadot/types/types";
import { handleOutput } from "../../../../../util/handleOutput";


export const getRedeemSolo = async (
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

  const call = api.tx['staking']['withdrawUnbonded'];

  const optSpans = await api.query['staking']['slashingSpans'](address) as any;
  const spanCount = optSpans.isNone ? 0 : optSpans.unwrap().prior.length + 1;
  const params = [spanCount];

  return await handleOutput(address, api, call, params, output);
}