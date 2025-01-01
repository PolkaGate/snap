import { amountToHuman } from "../../../../../util/amountToHuman";
import { StakeMoreFormState } from "../../../types";
import { StakeFormErrors, StakingInitContextType } from "../../../types";

export type StakeMoreSoloFormState = {
  stakeMoreAmountSolo: string;
};

/**
 * Validate the stake more form.
 *
 * @param formState - The state of the staking more form.
 * @param context - The context of the interface.
 * @returns The form errors.
 */
export function stakeMoreSoloFormValidation(
  formState?: StakeMoreSoloFormState,
  context?: StakingInitContextType | null,
): StakeFormErrors {

  const errors: Partial<StakeFormErrors> = {};

  if (formState?.stakeMoreAmountSolo && Number(formState.stakeMoreAmountSolo) && context) {

    const { decimal, transferable } = context;

    if (
      Number(formState.stakeMoreAmountSolo) >
      Number(amountToHuman(transferable, decimal))
    ) {
      errors.amount = 'Insufficient funds';
    }
  }

  return errors;
}