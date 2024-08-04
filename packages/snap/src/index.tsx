// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
  setSnapState,
  getAddress,
  signJSON,
  signRaw,
  getState,
} from './rpc';
import {
  showSpinner,
  accountDemo,
  accountInfo,
  exportAccount,
  showJsonContent,
} from './ui';
import { getBalances, getCurrentChain, getKeyPair } from './util';
import { POLKADOT_GENESIS } from '@polkadot/apps-config';
import { getLogo } from './ui/image/chains/getLogo';
import { HexString } from '@polkadot/util/types';
import { staking } from './ui/staking';
import { voting } from './ui/voting';
import { polkagateApps } from './ui/polkagateApps';

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

  const genesisHash = await getGenesisHash(currentChainName) ?? POLKADOT_GENESIS; // These will be changed when dropdown component will be available

  const balances = await getBalances(genesisHash, address);
  const logo = await getLogo(genesisHash);

  return {
    content: accountDemo(address, genesisHash, balances, logo),
  };
};

/**
 * Handle installation of the snap. This handler is called when the snap is
 * installed.
 */
export const onInstall: OnInstallHandler = async () => {
  setSnapState({ currentChain: DEFAULT_CHAIN_NAME }).catch(console.error); // This runs only once
  setSnapState({ currentGenesisHash: POLKADOT_GENESIS }).catch(console.error); // we can replace currentChainName with this currentGenesisHash

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
  console.log('event:', event.type, event.name, event.value)
  const state = await getState();
  if (event.type === UserInputEventType.ButtonClickEvent || event.type === UserInputEventType.InputChangeEvent) {

    switch (event.name) {
      case 'switchChain': {
        await showSpinner(id, 'Switching chain ...');
        const genesisHash = event.value;
        await accountInfo(id, genesisHash);
        break;
      }

      case 'send':
        await polkagateApps(id);
        break;

      case 'stake':
        await staking(id);
        break;

      case 'vote':
        await voting(id);
        break;

      case 'export':
        await exportAccount(id);
        break;

      case 'backToHome':
        await showSpinner(id, 'Loading ...');
        await accountInfo(id, state?.currentGenesisHash as HexString);
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
        if(value?.password){
          await showSpinner(id, 'Exporting the account ...');
          await showJsonContent(id, value.password as string);
        }
        break;

      default:
        break;
    }
  }
};
