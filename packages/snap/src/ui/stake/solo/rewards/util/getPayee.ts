import { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import { BN_ZERO } from "@polkadot/util";
import { Balance } from "@polkadot/types/interfaces";
import { CallParamsType, Payee } from "../../../types";

export enum GET_PAYEE_OUTPUT_TYPE {
  FEE_AND_PAYEE,
  CALL_PARAMS
}

export const getPayee = async (
  address: string,
  genesisHash: HexString,
  output?: GET_PAYEE_OUTPUT_TYPE,
  newPayee?: Payee,
): Promise<CallParamsType| { fee: Balance, payee: Payee }> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  let currentPayee = 'Staked' as Payee;
  const call = api.tx['staking']['setPayee'];
  let params = [newPayee || 'Staked'] as unknown[];

  let fee = api.createType('Balance', BN_ZERO) as Balance;

  if ((output === undefined || output === GET_PAYEE_OUTPUT_TYPE.FEE_AND_PAYEE) && call) {
    const { partialFee } = await call(...params).paymentInfo(address);
    fee = api.createType('Balance', partialFee || BN_ZERO) as Balance;
    currentPayee = (await api.query.staking.payee(address)).toHuman() as unknown as Payee;
  }

  return output === GET_PAYEE_OUTPUT_TYPE.CALL_PARAMS
    ? { call, params }
    : { fee, payee: currentPayee };
}