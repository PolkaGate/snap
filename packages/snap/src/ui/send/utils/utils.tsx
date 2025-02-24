import type { HexString } from "@polkadot/util/types";
import { amountToHuman } from "../../../util/amountToHuman";
import { amountToMachine } from "../../../util/amountToMachine";
import { getApi } from "../../../util/getApi";
import isValidAddress from "../../../util/isValidAddress";
import { SendFormState, SendFormErrors, SendContextType } from "../types";
import { checkAndUpdateMetaData } from "../../../rpc";
import { BN_ZERO, noop } from "@polkadot/util";
import type { Balance } from "@polkadot/types/interfaces";

/**
 * Validate the send form.
 *
 * @param formState - The state of the send form.
 * @param context - The context of the interface.
 * @returns The form errors.
 */
export function formValidation(
  formState?: SendFormState,
  context?: SendContextType | null,
): SendFormErrors {
  const errors: Partial<SendFormErrors> = {};

  if (formState?.to?.length && !isValidAddress(formState.to)) {
    errors.to = 'Invalid address';
  }

  if (
    formState?.amount && context &&
    Number(formState.amount) >
    Number(amountToHuman(context.transferable, context.decimal))
  ) {
    errors.amount = 'Insufficient funds';
  }

  return errors;
}


export const getTransferFee = async (address: string, amount: number, genesisHash: HexString, recipient: string): Promise<Balance> => {
  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const decimal = api.registry.chainDecimals[0];
  const amountAsBN = amountToMachine(String(amount), decimal);
  const params = [recipient, amountAsBN];
  const call = api.tx.balances.transferKeepAlive(...params);
  checkAndUpdateMetaData(api).catch(noop);

  const { partialFee } = await call.paymentInfo(address);
  const feeAsBalance = api.createType('Balance', partialFee || BN_ZERO);

  return feeAsBalance as Balance;
}
