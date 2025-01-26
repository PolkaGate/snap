import type { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import type { Balance } from "@polkadot/types/interfaces";
import { handleOutput } from "../../../../../util/handleOutput";
import type { CallParamsType } from "../../../types";

export const getPayout = async (
  address: string,
  genesisHash: HexString,
  selectedToPayout: string[], // validator,era,page
  output?: number
): Promise<
  Balance | CallParamsType> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const payoutStakers = api.tx['staking']['payoutStakersByPage'];
  const batch = api.tx['utility']['batchAll'];

  let call = payoutStakers;
  let params = [];

  if (selectedToPayout.length === 1) {
    const [validator, era, page] = selectedToPayout[0].split(',');
    params = [validator, Number(era), Number(page)];

  } else {
    call = batch;
    params = [selectedToPayout.map((p) => {
      const [validator, era, page] = p.split(',');
      return payoutStakers(validator, Number(era), Number(page))
    })]
  }

  return await handleOutput(address, api, call, params, output);
}