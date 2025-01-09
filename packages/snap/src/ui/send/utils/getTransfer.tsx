import { HexString } from "@polkadot/util/types";
import { amountToMachine } from "../../../util/amountToMachine";
import { getApi } from "../../../util/getApi";
import { checkAndUpdateMetaData } from "../../../rpc";
import { Balance } from "@polkadot/types/interfaces";
import { OUTPUT_TYPE } from "../../../constants";
import { handleOutput } from "../../../util/handleOutput";
import { CallParamsType } from "../../stake/types";

export const getTransfer = async (
  address: string,
  amount: number,
  genesisHash: HexString,
  recipient: string,
  output?:OUTPUT_TYPE
): Promise<Balance | CallParamsType> => {
  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const decimal = api.registry.chainDecimals[0];
  const amountAsBN = amountToMachine(String(amount), decimal);
  
  const params = [recipient, amountAsBN];
  const call = api.tx.balances.transferKeepAlive;

  checkAndUpdateMetaData(api).catch(console.error);

  return await handleOutput(address, api, call, params, output);

}
