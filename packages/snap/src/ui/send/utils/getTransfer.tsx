import type { HexString } from "@polkadot/util/types";
import { amountToMachine } from "../../../util/amountToMachine";
import { getApi } from "../../../util/getApi";
import { checkAndUpdateMetaData } from "../../../rpc";
import type { Balance } from "@polkadot/types/interfaces";
import { handleOutput } from "../../../util/handleOutput";
import type { CallParamsType } from "../../stake/types";
import { noop } from "@polkadot/util/cjs/noop";

export const getTransfer = async (
  address: string,
  amount: number,
  genesisHash: HexString,
  recipient: string,
  output?: number
): Promise<Balance | CallParamsType> => {
  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const decimal = api.registry.chainDecimals[0];
  const amountAsBN = amountToMachine(String(amount), decimal);

  const params = [recipient, amountAsBN];
  const call = api.tx.balances.transferKeepAlive;

  checkAndUpdateMetaData(api).catch(noop);

  return await handleOutput(address, api, call, params, output);
}
