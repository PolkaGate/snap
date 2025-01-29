import { BN, BN_ZERO } from '@polkadot/util';

/**
 * Convert an amount to BN based on the provided decimal precision.
 * @param amount - The amount (as a string) to be converted.
 * @param decimal - The decimal precision of the chain.
 * @returns The BN equivalent of the amount in machine-readable format.
 */
export function amountToMachine(amount: string | undefined, decimal: number): BN {
  if (!amount || !decimal || isNaN(Number(amount))) {
    return BN_ZERO;
  }

  // Split the amount into the whole part and fractional part
  const [wholePart, fractionalPart = ''] = amount.split('.');

  // Ensure the fractional part is correctly truncated or padded to the given decimal precision
  let adjustedFraction = fractionalPart.slice(0, decimal); // Truncate if it's longer than the decimal
  adjustedFraction = adjustedFraction.padEnd(decimal, '0'); // Pad with zeros if it's shorter

  // Combine the whole part and the adjusted fractional part into a single numeric string
  const numericValue = wholePart + adjustedFraction;

  // Convert the numeric string to BN
  return new BN(numericValue);
}