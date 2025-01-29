import { BN, BN_TEN, BN_ZERO } from '@polkadot/util';

/**
 * Converts a human-readable amount to a machine-readable BN.
 * @param amount - The amount as a string, with optional decimals.
 * @param decimal - The chain's decimal precision.
 * @returns The machine-readable BN representation of the amount.
 * @throws If the number of decimals in `amount` exceeds `decimal`.
 */
export function amountToMachine(amount: string | undefined, decimal: number | undefined): BN {
  if (!amount || !Number(amount) || !decimal) {
    return BN_ZERO;
  }

  const dotIndex = amount.indexOf('.');
  let newAmount = amount;

  if (dotIndex >= 0) {
    const wholePart = amount.slice(0, dotIndex);
    const fractionalPart = amount.slice(dotIndex + 1);

    newAmount = wholePart + fractionalPart;
    // eslint-disable-next-line no-param-reassign
    decimal -= fractionalPart.length;

    if (decimal < 0) {
      throw new Error("decimal should be more than amount's decimals digits");
    }
  }

  return new BN(newAmount).mul(BN_TEN.pow(new BN(decimal)));
}