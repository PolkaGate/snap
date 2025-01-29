import { hexToU8a, stringToU8a } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';

export function verifySignature(address: string, message: string, signature: string): boolean {
  // Convert the message and signature to Uint8Array
  const messageU8a = stringToU8a(message);
  const signatureU8a = hexToU8a(signature);

  // Verify the signature
  const { isValid } = signatureVerify(messageU8a, signatureU8a, address);

  return isValid;
}