import type { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import type { BN } from "@polkadot/util";
import type { Balance } from "@polkadot/types/interfaces";
import { handleOutput } from "../../../../../util/handleOutput";
import type { CallParamsType } from "../../../types";

export const getSoloStakeMore = async (
  address: string,
  amount: BN,
  genesisHash: HexString,
  output?: number
): Promise<Balance | CallParamsType> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const params = [amount];
  const call = api.tx['staking']['bondExtra'];

  return await handleOutput(address, api, call, params, output);
}