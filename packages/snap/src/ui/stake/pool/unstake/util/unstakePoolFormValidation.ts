import { BN } from "@polkadot/util";
import { amountToHuman } from "../../../../../util/amountToHuman";
import { StakeFormErrors, StakingInitContextType } from "../../../types";
import { PoolUnstakeFormState } from "../types";

/**
 * Validate the unstake stake pool form.
 *
 * @param formState - The state of the staking form.
 * @param context - The context of the interface.
 * @returns The form errors.
 */
export function unstakePoolFormValidation(
  formState?: PoolUnstakeFormState,
  context?: StakingInitContextType | null,
): StakeFormErrors {

  const errors: Partial<StakeFormErrors> = {};
  const amount = formState?.poolUnstakeAmount;

  if (amount && Number(amount) && context) {

    const { decimal, claimable, pooledBalance, minJoinBond, token } = context;
    const netStaked = new BN(pooledBalance).sub(new BN(claimable || 0));

    if (
      Number(amount) >
      Number(amountToHuman(netStaked, decimal))
    ) {
      errors.amount = 'More than staked amount!';

    } else if (
      Number(amount) <
      Number(amountToHuman(new BN(minJoinBond), decimal))
    ) {
      errors.amount = `Remaining stake cannot be less than the minimum(${amountToHuman(new BN(minJoinBond), decimal)} ${token})!`;
    }
  }

  return errors;
}