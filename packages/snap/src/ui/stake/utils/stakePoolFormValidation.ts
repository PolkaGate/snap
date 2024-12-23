import { amountToHuman } from "../../../util/amountToHuman";
import { StakeFormErrors, StakeFormState, StakingInitContextType } from "../types";

/**
 * Validate the stake initial form.
 *
 * @param formState - The state of the staking init form.
 * @param context - The context of the interface.
 * @returns The form errors.
 */
export function stakePoolFormValidation(
  formState?: StakeFormState,
  context?: StakingInitContextType | null,
): StakeFormErrors {

  const errors: Partial<StakeFormErrors> = {};

  if (formState?.stakeAmount && Number(formState.stakeAmount) && context) {
    const { decimal, minJoinBond } = context.stakingInfo;

    if (
      Number(formState.stakeAmount) >
      Number(amountToHuman(context.transferable, decimal))
    ) {
      errors.amount = 'Insufficient funds';
    }

    if (
      Number(formState.stakeAmount) <
      Number(amountToHuman(minJoinBond, decimal))
    ) {
      errors.amount = 'Less than minimum';
    }
  }

  return errors;
}