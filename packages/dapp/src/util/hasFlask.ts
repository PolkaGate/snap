import detectEthereumProvider from '@metamask/detect-provider';

/**
 *  to check if metamask Flask is installed of not
 */
export async function hasFlask() {
  // This resolves to the value of window.ethereum or null
  const provider = await detectEthereumProvider();

  // web3_clientVersion returns the installed MetaMask version as a string
  const isFlask = (
    await (provider as any)?.request({ method: 'web3_clientVersion' })
  )?.includes('flask');

  if (provider && isFlask) {
    // Now you can use Snaps!
    return true;
  } else {
    return false;
  }
}