import { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import { BN } from "@polkadot/util";
import { Balance } from "@polkadot/types/interfaces";
import { OUTPUT_TYPE } from "../../../../../constants";
import { handleOutput } from "../../../../../util/handleOutput";
import { CallParamsType } from "../../../types";


export const getSoloStakeMore = async (
  address: string,
  amount: BN,
  genesisHash: HexString,
  output?: OUTPUT_TYPE
): Promise<Balance | CallParamsType > => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const params = [amount];
  let call = api.tx['staking']['bondExtra'];

  return await handleOutput(address, api, call, params, output);
}