// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {  UserInputEventType } from '@metamask/snaps-sdk';
import type {
  OnHomePageHandler,
  OnInstallHandler,
  OnRpcRequestHandler,
  OnUserInputHandler,
} from '@metamask/snaps-sdk';

import { getGenesisHash } from './chains';
import {
  getMetadataList,
  setMetadata,
  getAddress,
  signJSON,
  signRaw,
} from './rpc';
import {
  showSpinner,
  accountDemo,
  accountInfo,
  exportAccount,
  showJsonContent,
} from './ui';
import { getBalances, getKeyPair } from './util';
import { POLKADOT_GENESIS } from '@polkadot/apps-config';
import { getLogo } from './ui/image/chains/getLogo';
import { HexString } from '@polkadot/util/types';
import { staking } from './ui/staking';
import { voting } from './ui/voting';
import { polkagateApps } from './ui/polkagateApps';
import { getSnapState, setSnapState, updateSnapState } from './rpc/stateManagement';
import { getCurrentChainTokenPrice } from './util/getCurrentChainTokenPrice';
import getChainName from './util/getChainName';
import { DEFAULT_CHAIN_NAME } from './defaults';
import { welcomeScreen } from './ui/welcomeScreen';

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
  const currentChainName = DEFAULT_CHAIN_NAME; // to reset chain on each new visit
  const { address } = await getKeyPair(currentChainName);
  const genesisHash = await getGenesisHash(currentChainName) ?? POLKADOT_GENESIS; // These will be changed when dropdown component will be available
  const balances = await getBalances(genesisHash, address);
  const logo = await getLogo(genesisHash);
  const priceInUsd = await getCurrentChainTokenPrice();

  return {
    content: accountDemo(address, genesisHash, balances, logo, priceInUsd),
  };
};

/**
 * Handle installation of the snap. This handler is called when the snap is
 * installed.
 */
export const onInstall: OnInstallHandler = async () => {
  setSnapState({ currentGenesisHash: POLKADOT_GENESIS }).catch(console.error);

  const genesisHash = POLKADOT_GENESIS;
  const { address } = await getKeyPair(undefined, genesisHash);
  const logo = await getLogo(genesisHash)


  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content:welcomeScreen(address, genesisHash, logo)
    },
  });
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  if (event.type === UserInputEventType.ButtonClickEvent || event.type === UserInputEventType.InputChangeEvent) {

    switch (event.name) {
      case 'switchChain': {
        const genesisHash = event.value;
        const destinationChainName = await getChainName(genesisHash)
        await showSpinner(id, `Switching chain to ${destinationChainName} ...`);
        await updateSnapState('currentGenesisHash', genesisHash);
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
        const state = await getSnapState();
        await accountInfo(id, state?.currentGenesisHash as HexString);
        break;

      default:
        break;
    }
  }

  if (event.type === UserInputEventType.FormSubmitEvent) {
    const { value } = event;

    switch (event.name) {
      case 'saveExportedAccount':
        if (value?.password) {
          await showSpinner(id, 'Exporting the account ...');
          await showJsonContent(id, value.password as string);
        }
        break;

      default:
        break;
    }
  }
};
