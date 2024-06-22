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
import {
  getMetadataList,
  setMetadata,
  updateState,
  getAddress,
  signJSON,
  signRaw,
} from './rpc';
import {
  showSpinner,
  accountDemo,
  accountInfo,
  showDappList,
  exportAccount,
  showJsonContent,
  getNextChain,
} from './ui';
import { getBalances, getCurrentChain, getKeyPair } from './util';

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
  const balances = await getBalances(genesisHash, address);

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
          "To access your account's information, navigate to **Menu → Snaps** and click on the Polkagate icon.",
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
      case 'switchChain': {
        await showSpinner(id, 'Switching chain ...');
        const nextChainName = await getNextChain();
        await accountInfo(id, nextChainName);
        break;
      }

      case 'dapp':
        await showDappList(id);
        break;

      case 'showExportAccount':
        await exportAccount(id);
        break;

      case 'backToHome':
        await showSpinner(id, 'Loading ...');
        await accountInfo(id);
        break;

      default:
        break;
    }
  }

  if (event.type === UserInputEventType.FormSubmitEvent) {
    const { value } = event;

    switch (event.name) {
      // case 'transferInput': // will be uncommented when JSX components will be released
      //   if (!event?.value?.amount) {
      //     break;
      //   }
      //   await showSpinner(id);
      //   await transferReview(id, value);
      //   break;

      case 'saveExportedAccount':
        await showSpinner(id, 'Exporting the account ...');
        await showJsonContent(id, value?.password);
        break;

      default:
        break;
    }
  }
};
