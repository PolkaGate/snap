import { HexString } from "@polkadot/util/types";
import { amountToHuman } from "../../util/amountToHuman";
import { amountToMachine } from "../../util/amountToMachine";
import { getApi } from "../../util/getApi";
import { checkAndUpdateMetaData } from "../../rpc";
import { BN_ONE, BN_ZERO } from "@polkadot/util";
import { Balance } from "@polkadot/types/interfaces";
import { StakeFlowContext, StakeFormErrors, StakeFormState } from "./types";

/**
 * Validate the send form.
 *
 * @param formState - The state of the send form.
 * @param context - The context of the interface.
 * @returns The form errors.
 */
export function stakeFormValidation(
  formState?: StakeFormState,
  context?: StakeFlowContext | null,
): StakeFormErrors {
  const errors: Partial<StakeFormErrors> = {};

  if (formState?.stakeAmount && Number(formState.stakeAmount) && context) {

    if (
      Number(formState.stakeAmount) >
      Number(amountToHuman(context.transferable, context.decimal))
    ) {
      errors.amount = 'Insufficient funds';
    }

    if (
      Number(formState.stakeAmount) <
      Number(amountToHuman(context.stakingInfo.minJoinBond, context.decimal))
    ) {
      errors.amount = 'Less than minimum';
    }
  }

  return errors;
}


export const getStakingInfo = async (address: string, amount: string | undefined, genesisHash: HexString): Promise<{ minJoinBond: Balance, fee: Balance, token:string }> => {
  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }
  checkAndUpdateMetaData(api).catch(console.error);

  const decimal = api.registry.chainDecimals[0];
  const token = api.registry.chainTokens[0];
  const amountAsBN = amountToMachine(amount, decimal);
  const params = [amountAsBN, BN_ONE];
  const call = api.tx['nominationPools']['join'](...params); // can add auto compound tx fee as well
  const { partialFee } = await call.paymentInfo(address);
  const feeAsBalance = api.createType('Balance', partialFee || BN_ZERO);

  const minJoinBond = await api.query.nominationPools.minJoinBond();
  const minJoinBondAsBalance = api.createType('Balance', minJoinBond);

  return {
    minJoinBond: minJoinBondAsBalance as Balance,
    fee: feeAsBalance as Balance,
    token
  };
}
