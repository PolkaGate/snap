/**
 * The state of the send form.
 *
 * @property to - The receiving address.
 * @property amount - The amount to send.
 * @property accountSelector - The selected account.
 */
export type SendFormState = {
  to: string;
  amount: number;
  tokenSelector: string;
};

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


/**
 * The context of the send flow interface.
 *
 * @property transferable - The available balance of the selected token.
 * @property decimal - The decimal of selected token
 */
export type SendFlowContext = {
  decimal:number;
  transferable: string
};