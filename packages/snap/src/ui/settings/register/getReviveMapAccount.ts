import type { HexString } from "@polkadot/util/types";
import type { Balance } from "@polkadot/types/interfaces";
import { handleOutput } from "../../../util/handleOutput";
import { CallParamsType } from "../../stake/types";
import { getApi } from "../../../util/getApi";


export const getReviveMapAccount = async (
  address: string,
  genesisHash: HexString,
  output?: number
): Promise<Balance | CallParamsType> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const call = api.tx.revive.mapAccount;
  const params = [];

  const decimal = api.registry.chainDecimals[0];
  const token = api.registry.chainTokens;

  return {
    decimal,
    token,
    fee: await handleOutput(address, api, call, params, output)
  }
}