import { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import { BN, BN_ZERO } from "@polkadot/util";
import { Balance } from "@polkadot/types/interfaces";
import { OUTPUT_TYPE } from "../../../../../constants";
import { CallParamsType } from "../../../types";
import { handleOutput } from "../../../../../util/handleOutput";


export const getPoolStakeMore = async (
  address: string,
  amount: BN,
  genesisHash: HexString,
  output?: OUTPUT_TYPE
): Promise<Balance | CallParamsType> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  let params = [{ FreeBalance: amount.toString() }];
  let call = api.tx['nominationPools']['bondExtra'];

  return await handleOutput(address, api, call, params, output);
}