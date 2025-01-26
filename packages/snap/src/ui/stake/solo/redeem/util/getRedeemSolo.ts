import type { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import type { Balance } from "@polkadot/types/interfaces";
import { handleOutput } from "../../../../../util/handleOutput";
import type { CallParamsType } from "../../../types";


export const getRedeemSolo = async (
  address: string,
  genesisHash: HexString,
  output?: number
): Promise<Balance | CallParamsType> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const call = api.tx.staking.withdrawUnbonded;

  const optSpans = await api.query.staking.slashingSpans(address) as any;
  const spanCount = optSpans.isNone ? 0 : optSpans.unwrap().prior.length + 1;
  const params = [spanCount];

  return await handleOutput(address, api, call, params, output);
}