import type { Compact, u128 } from '@polkadot/types';
import type { BN } from '@polkadot/util';

const FLOATING_POINT_DIGIT = 4;

/**
 * Formats a number or string by fixing the floating-point digits.
 *
 * @param _number - The number to be formatted.
 * @param decimalDigit - The number of decimal digits to include.
 * @param commify - If true, adds commas for thousands separator.
 * @returns The formatted number.
 */
export function fixFloatingPoint(
  _number: number | string,
  decimalDigit = FLOATING_POINT_DIGIT,
  commify?: boolean,
): string {
  // make number positive if it is negative
  const sNumber =
    Number(_number) < 0 ? String(-Number(_number)) : String(_number);

  const dotIndex = sNumber.indexOf('.');

  if (dotIndex < 0) {
    return sNumber;
  }

  let integerDigits = sNumber.slice(0, dotIndex);

  integerDigits = commify
    ? Number(integerDigits).toLocaleString()
    : integerDigits;
  const fractionalDigits = sNumber.slice(dotIndex, dotIndex + decimalDigit + 1);

  return integerDigits + fractionalDigits;
}

/**
 * Converts an amount, which may be a BN, to human-readable format.
 *
 * @param amount - The amount to be formatted.
 * @param decimals - The number of decimal places for the chain.
 * @param decimalDigits - The number of decimal digits to include.
 * @param commify - If true, adds commas for thousands separator.
 * @returns The human-readable amount.
 */
export function amountToHuman(
  amount: string | number | BN | bigint | Compact<u128> | undefined,
  decimals: number | undefined,
  decimalDigits?: number,
  commify?: boolean,
): string {
  if (!amount || !decimals) {
    return '';
  }

  // eslint-disable-next-line no-param-reassign
  amount = String(amount).replace(/,/gu, '');

  const x = 10 ** decimals;

  return fixFloatingPoint(Number(amount) / x, decimalDigits, commify);
}
