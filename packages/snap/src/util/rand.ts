/**
 * Creates a secure random number.
 * @returns A random number between 0 to 2^32 - 1.
 */
export function rand(): number {
  const cryptoBuffer = new Uint32Array(1);
  window.crypto.getRandomValues(cryptoBuffer);
  return cryptoBuffer[0];
}
