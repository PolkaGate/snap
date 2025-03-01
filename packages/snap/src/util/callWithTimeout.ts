/**
 * Type representing an asynchronous function that accepts parameters of type P and returns a Promise of type T.
 * 
 * @template T - The type of the value that the asynchronous function returns.
 * @template P - The type of the parameters that the asynchronous function accepts.
 */
type AsyncFunctionWithParams<T, P extends any[]> = (...args: P) => Promise<T>;

/**
 * Calls an asynchronous function with a specified timeout and returns either the result or a default value in case of a timeout.
 * 
 * @param {AsyncFunctionWithParams<T, P>} asyncFn - The asynchronous function to call.
 * @param {P} params - The parameters to pass to the asynchronous function.
 * @param {number} [timeout=60000] - The timeout in milliseconds. Defaults to 60,000 ms (60 seconds).
 * @param {T | null} defaultValue - The value to return if the asynchronous function times out.
 * 
 * @returns {Promise<T | null>} A promise that resolves to the result of the function or the default value if the function times out.
 * 
 * @template T - The type of the result returned by the asynchronous function.
 * @template P - The type of the parameters passed to the asynchronous function.
 */
export const callWithTimeout = async <T, P extends any[]>(
  asyncFn: AsyncFunctionWithParams<T, P>,
  params: P,
  timeout: number = 60000,
  defaultValue: T | null
): Promise<T | null> => {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout exceeded')), timeout)
  );

  try {
    const result = await Promise.race([asyncFn(...params), timeoutPromise]);
    return result;
  } catch (error) {
    return defaultValue; 
    
  }
};