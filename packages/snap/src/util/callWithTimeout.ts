/**
 * Type representing an asynchronous function that accepts parameters of type Params and returns a Promise of type ReturnType.
 * @template ReturnType - The type of the value that the asynchronous function returns.
 * @template Params - The type of the parameters that the asynchronous function accepts.
 */
type AsyncFunctionWithParams<ReturnType, Params extends any[]> = (...args: Params) => Promise<ReturnType>;

/**
 * Calls an asynchronous function with a specified timeout and returns either the result or a default value in case of a timeout.
 * @param asyncFn - The asynchronous function to call.
 * @param params - The parameters to pass to the asynchronous function.
 * @param defaultValue - The value to return if the asynchronous function times out.
 * @param timeout - The timeout in milliseconds. Defaults to 60,000 ms (60 seconds).
 * @returns  A promise that resolves to the result of the function or the default value if the function times out.
 * @template ReturnType - The type of the result returned by the asynchronous function.
 * @template Params - The type of the parameters passed to the asynchronous function.
 */
export const callWithTimeout = async <ReturnType, Params extends any[]>(
  asyncFn: AsyncFunctionWithParams<ReturnType, Params>,
  params: Params,
  defaultValue: ReturnType | null,
  timeout: number = 60000
): Promise<ReturnType | null> => {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout exceeded')), timeout)
  );

  try {
    const result = await Promise.race([asyncFn(...params), timeoutPromise]);
    return result;
  } catch {
    return defaultValue;
  }
};