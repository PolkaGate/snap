import { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import { Balance } from "@polkadot/types/interfaces";
import { OUTPUT_TYPE } from "../../../../../constants";
import { CallParamsType } from "../../../types";
import { handleOutput } from "../../../../../util/handleOutput";

export const getRedeem = async (
  address: string,
  genesisHash: HexString,
  output?: OUTPUT_TYPE
): Promise<Balance | CallParamsType> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const call = api.tx['nominationPools']['withdrawUnbonded'];

  const optSpans = await api.query['staking']['slashingSpans'](address) as any;
  const spanCount = optSpans.isNone ? 0 : optSpans.unwrap().prior.length + 1;
  const params = [address, spanCount];

  return await handleOutput(address, api, call, params, output);
}