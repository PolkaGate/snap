/**
 * Format input string as CamelCase.
 * @param input - A string.
 * @returns A string.
 */
export function formatCamelCase(input?: string): string {
  return input
    ?.replace(/([a-z])([A-Z])/gu, '$1 $2') // Add space between camelCase
    ?.replace(/\b(\w)/u, (char) => char.toUpperCase()); // Capitalize the first letter
}
