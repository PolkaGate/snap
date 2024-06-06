/**
 * Format input string as CamelCase.
 *
 * @param input - A string.
 * @param chainName
 * @returns A string.
 */
export function formatChainName(chainName: string) {
  return chainName[0].toUpperCase() + chainName.slice(1);
}
