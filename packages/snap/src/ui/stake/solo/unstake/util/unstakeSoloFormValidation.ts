import { BN } from "@polkadot/util";
import { amountToHuman } from "../../../../../util/amountToHuman";
import { StakeFormErrors, StakingSoloContextType } from "../../../types";
import { SoloUnstakeFormState } from "../types";
import { amountToMachine } from "../../../../../util/amountToMachine";
import { STAKED_AMOUNT_DECIMAL_POINT } from "../../../components/UnstakeForm";

/**
 * Validate the unstake form.
 *
 * @param formState - The state of the staking form.
 * @param context - The context of the interface.
 * @returns The form errors.
 */
export function unstakeSoloFormValidation(
  formState?: SoloUnstakeFormState,
  context?: StakingSoloContextType | null,
): StakeFormErrors {

  const errors: Partial<StakeFormErrors> = {};
  const amount = formState?.soloUnstakeAmount;

  if (amount && Number(amount) && context) {

    const { decimal, active, minNominatorBond, minimumActiveStake, token } = context;
    const netStaked = new BN(active!);
    const remaining = netStaked.sub(amountToMachine(String(amount), decimal));

    const isUnstakingAll = Number(amountToHuman(active, decimal, STAKED_AMOUNT_DECIMAL_POINT)) === Number(amount);
    if (isUnstakingAll) {
      return errors;
    }
    
    if (Number(amount) > Number(amountToHuman(netStaked, decimal))) {

      errors.amount = 'More than staked amount!';

    } else if (remaining.lt(new BN(minNominatorBond!))) {

      errors.amount = `Remaining stake cannot be less than the minimum(${amountToHuman(new BN(minNominatorBond!), decimal)} ${token})!`;

    } else if (remaining.lt(new BN(minimumActiveStake!))) {

      errors.amount = `Remaining stake less than the minimum(${amountToHuman(new BN(minimumActiveStake!), decimal)} ${token}) won't receive rewards!`;
    }
  }

  return errors;
}