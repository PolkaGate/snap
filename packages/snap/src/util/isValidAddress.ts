import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

/**
 * Validates whether a given address is a valid blockchain address.
 * @param _address - The address to be validated, which can be a string or undefined.
 * @returns A boolean indicating whether the address is valid.
 */
export default function isValidAddress(_address: string | undefined): boolean {
  try {
    encodeAddress(
      isHex(_address)
        ? hexToU8a(_address)
        : decodeAddress(_address)
    );

    return true;
  } catch {
    return false;
  }
}
