/**
 * The state of the stake form.
 *
 * @property amount - The amount to stake.
 * @property accountSelector - The selected account.
 */

export type StakeFormState = {
  stakeAmount: string;
  stakeTokenSelector: string;
};

/**
 * The form errors.
 *
 * @property amount - The error for the amount.
 */
export type StakeFormErrors = {
  amount?: string;
};


/**
 * The context of the send flow interface.
 *
 * @property transferable - The available balance of the selected token.
 * @property decimal - The decimal of selected token
 */
export type StakeFlowContext = {
  decimal:number;
  stakingInfo: Record<string, any>;
  transferable: string
};