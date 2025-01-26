import type { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import { BN_ZERO } from "@polkadot/util";
import type { Balance } from "@polkadot/types/interfaces";
import type { CallParamsType, Payee } from "../../../types";

export const GET_PAYEE_OUTPUT_TYPE = {
  FEE_AND_PAYEE: 1,
  CALL_PARAMS: 2
}

export const getPayee = async (
  address: string,
  genesisHash: HexString,
  output: number,
  newPayee?: Payee,
): Promise<CallParamsType | { fee: Balance, payee: Payee }> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  let currentPayee = 'Staked' as Payee;
  const call = api.tx['staking']['setPayee'];
  const params = [newPayee ?? 'Staked'] as unknown[];

  let fee = api.createType('Balance', BN_ZERO) as unknown as Balance;

  if ((output === undefined || output === GET_PAYEE_OUTPUT_TYPE.FEE_AND_PAYEE) && call) {
    const { partialFee } = await call(...params).paymentInfo(address);
    fee = api.createType('Balance', partialFee ?? BN_ZERO);
    currentPayee = (await api.query.staking.payee(address)).toHuman() as unknown as Payee;
  }

  return output === GET_PAYEE_OUTPUT_TYPE.CALL_PARAMS
    ? { call, params }
    : { fee, payee: currentPayee };
}