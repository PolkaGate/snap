import { amountToHuman } from "../../../../../util/amountToHuman";
import type { StakeFormErrors, StakingSoloContextType } from "../../../types";

export type RestakeSoloFormState = {
  restakeAmountSolo: string;
};

/**
 * Validate the re-stake form.
 * @param formState - The state of the re-staking form.
 * @param context - The context of the interface.
 * @returns The form errors.
 */
export function restakeSoloFormValidation(
  formState?: RestakeSoloFormState,
  context?: StakingSoloContextType | null,
): StakeFormErrors {

  const errors: Partial<StakeFormErrors> = {};

  if (formState?.restakeAmountSolo && Number(formState.restakeAmountSolo) && context) {

    const { decimal, unlocking } = context;

    if (
      Number(formState.restakeAmountSolo) >
      Number(amountToHuman(unlocking, decimal))
    ) {
      errors.amount = 'Insufficient funds';
    }
  }

  return errors;
}