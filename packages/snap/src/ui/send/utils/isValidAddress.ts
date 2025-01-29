import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';

/**
 * Validates whether a given address is a valid blockchain address.
 * @param _address - The address to validate.
 * @returns True if the address is valid; otherwise, false.
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
