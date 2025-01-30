import { BN } from "@polkadot/util";
import { amountToHuman } from "../../../../../util/amountToHuman";
import type { StakeFormErrors, StakingPoolContextType } from "../../../types";
import type { PoolUnstakeFormState } from "../types";
import { amountToMachine } from "../../../../../util/amountToMachine";
import { STAKED_AMOUNT_DECIMAL_POINT } from "../../../const";

/**
 * Validate the unstake stake pool form.
 * @param formState - The state of the staking form.
 * @param context - The context of the interface.
 * @returns The form errors.
 */
export function unstakePoolFormValidation(
  formState?: PoolUnstakeFormState,
  context?: StakingPoolContextType | null,
): StakeFormErrors {

  const errors: Partial<StakeFormErrors> = {};
  const amount = formState?.poolUnstakeAmount;

  if (amount && Number(amount) && context) {

    const { decimal, claimable, pooledBalance, minJoinBond, token } = context;
    const netStaked = new BN(pooledBalance ?? 0).sub(new BN(claimable ?? 0));
    const remaining = netStaked.sub(amountToMachine(String(amount), decimal));

    const isUnstakingAll = Number(amountToHuman(netStaked, decimal, STAKED_AMOUNT_DECIMAL_POINT)) === Number(amount);
    if (isUnstakingAll) {
      return errors;
    }

    if (Number(amount) > Number(amountToHuman(netStaked, decimal))) {
      
      errors.amount = 'More than staked amount!';

    } else if (remaining.lt(new BN(minJoinBond ?? 0))) {
      errors.amount = `Remaining stake cannot be less than the minimum(${amountToHuman(new BN(minJoinBond ?? 0), decimal)} ${token})!`;
    }
  }

  return errors;
}