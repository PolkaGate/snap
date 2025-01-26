import { amountToHuman } from "../../../../../util/amountToHuman";
import type { StakeMoreFormState } from "../../../types";
import type { StakeFormErrors, StakingInitContextType } from "../../../types";

/**
 * Validate the stake more form.
 * @param formState - The state of the staking more form.
 * @param context - The context of the interface.
 * @returns The form errors.
 */
export function stakeMorePoolFormValidation(
  formState?: StakeMoreFormState,
  context?: StakingInitContextType | null,
): StakeFormErrors {

  const errors: Partial<StakeFormErrors> = {};

  if (formState?.stakeMoreAmount && Number(formState.stakeMoreAmount) && context) {

    const { decimal, transferable } = context;

    if (
      Number(formState.stakeMoreAmount) >
      Number(amountToHuman(transferable, decimal))
    ) {
      errors.amount = 'Insufficient funds';
    }
  }

  return errors;
}