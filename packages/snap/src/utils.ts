import { assert } from '@metamask/utils';
import { BN, hexToBn, isHex } from '@polkadot/util';
import { POLKADOT_TEST_NETS } from './constants';

/**
 * Get the current count from the Snap state.
 * @returns The current count.
 */
export async function getCurrent(): Promise<number> {
  const state = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'get',
    },
  });

  if (!state) {
    return 0;
  }

  assert(typeof state.count === 'number', 'Expected count to be a number.');
  return state.count;
}

/**
 * Converts a string to a BN (BigNumber) object, interpreting it as a hex string if applicable.
 * @param i - The string to be converted, which can be a valid hex string or a regular string representing a number.
 * @returns The converted BN object, or undefined if the input is not provided.
 */
export const isHexToBn = (i?: string): BN | undefined => i
  ? isHex(i) ? hexToBn(i) : new BN(i)
  : undefined;

/**
 * Converts a string to title case, where the first letter of each word is capitalized.
 * @param input - The string to be converted to title case. If undefined or empty, returns undefined.
 * @returns The input string in title case, or undefined if the input is not provided.
 */
export function toTitleCase(input: string | undefined | null): string | undefined {
  if (!input) {
    return undefined;
  }

  let words = input.replace(/([A-Z])/g, ' $1')?.replace(/[_-]/g, ' ')?.split(' ');

  words = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return words.join(' ');
}

/**
 * Converts a given string to camelCase format.
 * @param str - The string to be converted.
 * @returns The converted string in camelCase format.
 */
export function toCamelCase(str: string): string {
  if (!str) {
    return '';
  }

  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) => {
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  })?.replace(/\s+/g, '');
}

/**
 * Checks if an object is empty (i.e., has no own properties).
 * @param obj - The object to be checked.
 * @returns True if the object has no own properties, otherwise false.
 */
export function isEmptyObject(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Formats a number with commas as thousands separators and optional decimal precision.
 * @param number - The number to be formatted.
 * @param options - Optional settings for decimal precision.
 * @param options.minimumFractionDigits - The minimum number of decimal places to display (default is 0).
 * @param options.maximumFractionDigits - The maximum number of decimal places to display (default is 2).
 * @returns The formatted number as a string.
 */
export function commifyNumber(
  number: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const { minimumFractionDigits = 0, maximumFractionDigits = 2 } = options;

  return number
    .toLocaleString('en-US', { minimumFractionDigits, maximumFractionDigits });
}

/**
 * Checks whether the given chain genesis hash belongs to a known Polkadot test network.
 * @param genesisHash - The genesis hash of the chain to check.
 * @returns `true` if the hash is one of the test nets, otherwise `false`.
 */
export function isTestNet(genesisHash: string | undefined): boolean {
  return POLKADOT_TEST_NETS?.includes(genesisHash ?? '');
}