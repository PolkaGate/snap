import type { HexString } from "@polkadot/util/types";

/**
 * The state of the send form.
 *
 * @property to - The receiving address.
 * @property amount - The amount to send.
 * @property accountSelector - The selected account.
 */
export type SendFormState = {
  to: string;
  amount: string;
  tokenSelector: string;
};

export type PayoutSelectionFormState = {
  [selectAllToPayOut: string]: boolean;
}
export type SelectAllToPayOutFormState = Record<string, boolean>;

/**
 * The form errors.
 *
 * @property to - The error for the receiving address.
 * @property amount - The error for the amount.
 */
export type SendFormErrors = {
  to?: string;
  amount?: string;
};

export interface SendContextType {
  amount: number | undefined,
  address: string,
  recipient: string | undefined,
  decimal: number,
  price: number,
  genesisHash: HexString,
  fee: string | undefined,
  token: string,
  transferable: string,
}