import {
  divider,
  heading,
  panel,
  text,
  UserInputEventType,
} from '@metamask/snaps-sdk';
import type {
  OnHomePageHandler,
  OnInstallHandler,
  OnRpcRequestHandler,
  OnUserInputHandler,
} from '@metamask/snaps-sdk';

import { getGenesisHash } from './chains';
import { DEFAULT_CHAIN_NAME } from './defaults';
import { getAddress, signJSON, signRaw } from './rpc';
import { getMetadataList, setMetadata, updateState } from './rpc/metadata';
import { accountDemo } from './ui/accountDemo';
import { accountInfo } from './ui/accountInfo';
import { showDappList } from './ui/dappList';
import { showSpinner, showTransferInputs, transfer } from './ui/transfer';
import { getBalances2 } from './util/getBalance';
import { getCurrentChain } from './util/getCurrentChain';
import { getKeyPair } from './util/getKeyPair';

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  const _params = request.params;

  switch (request.method) {
    case 'signJSON':
      return _params?.payload && (await signJSON(origin, _params.payload));
    case 'signRaw':
      return _params?.raw && (await signRaw(origin, _params.raw));
    case 'getAddress':
      return await getAddress(_params?.chainName);
    case 'setMetadata' /** To manage snap state */:
      return (
        _params?.metaData && (await setMetadata(origin, _params?.metaData))
      );
    case 'getMetadataList':
      return await getMetadataList();

    default:
      throw new Error('Method not found in the snap onRpcRequest.');
  }
};

/**
 * Handle incoming home page requests from the MetaMask clients.
 *
 * @returns A static panel rendered with custom UI.
 */
export const onHomePage: OnHomePageHandler = async () => {
  const currentChainName = await getCurrentChain();
  const { address } = await getKeyPair(currentChainName);

  const genesisHash = getGenesisHash(currentChainName); // These will be changed when dropdown component will be available
  const balances = await getBalances2(genesisHash, address);

  return {
    content: accountDemo(address, currentChainName, balances),
  };
};

/**
 * Handle installation of the snap. This handler is called when the snap is
 * installed.
 */
export const onInstall: OnInstallHandler = async () => {
  updateState({ currentChain: DEFAULT_CHAIN_NAME }).catch(console.error);

  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([
        heading('🏠 Your account is now created 🚀'),
        divider(),
        text(
          "To access your account's information, navigate to Menu → Snaps and click on the Polkagate icon.",
        ),
        text(
          'To manage your account, please visit: **[https://apps.polkagate.xyz](https://apps.polkagate.xyz)**',
        ),
      ]),
    },
  });
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  if (event.type === UserInputEventType.ButtonClickEvent) {
    switch (event.name) {
      case 'switchChain':
        await showSpinner(id, 'Switching chain ...');
        await accountInfo(id);
        break;

      case 'transfer':
        await showTransferInputs(id);
        break;

      case 'dapp':
        await showDappList(id);
        break;

      default:
        break;
    }
  }

  if (event.type === UserInputEventType.FormSubmitEvent) {
    const chainName = await getCurrentChain();

    const value = { ...(event?.value || {}), chainName } as unknown as Record<
      string,
      string
    >;

    switch (event.name) {
      case 'transferInput':
        await showSpinner(id);
        await transfer(id, value);
        break;

      default:
        break;
    }
  }
};
