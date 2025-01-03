import { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import { Balance } from "@polkadot/types/interfaces";
import { OUTPUT_TYPE } from "../../../../../constants";
import { CallParamsType } from "../../../types";
import { handleOutput } from "../../../../../util/handleOutput";


export const getClaim = async (
  address: string,
  genesisHash: HexString,
  restakeRewards: boolean | undefined,
  output?: OUTPUT_TYPE
): Promise<Balance | CallParamsType> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  let params = [] as unknown[];
  let call = api.tx['nominationPools']['claimPayout'];

  if (restakeRewards) {
    params = ['Rewards'];
    call = api.tx['nominationPools']['bondExtra'];
  }

  return await handleOutput(address, api, call, params, output);
}