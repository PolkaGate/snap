// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UserInputEventType } from '@metamask/snaps-sdk';
import type { OnUserInputHandler } from '@metamask/snaps-sdk';

import {
  showSpinner,
  accountInfo,
  exportAccount,
  showJsonContent,
  staking,
  voting
} from '../ui';
import { updateSnapState } from '../rpc/stateManagement';
import getChainName from '../util/getChainName';
import { showMore } from '../ui/showMore';
import { receive } from '../ui/receive';
import { balanceDetails } from '../ui/balanceDetails';
import { send } from '../ui/send';
import { SendFormState } from '../ui/send/types';
import { formValidation } from '../ui/send/utils';
import { approveSend } from '../ui/send/approveSend';
import { HexString } from '@polkadot/util/types';
import { transfer } from '../ui/send/transfer';

export const onUserInput: OnUserInputHandler = async ({ id, event, context }) => {

  const state = await snap.request({
    method: 'snap_getInterfaceState',
    params: { id },
  });
  const sendForm = state.sendForm as SendFormState;

  if (event.type === UserInputEventType.ButtonClickEvent || event.type === UserInputEventType.InputChangeEvent) {

    switch (event.name) {
      case 'switchChain': {
        const genesisHash = event.value;
        const destinationChainName = await getChainName(genesisHash)
        await showSpinner(id, `Switching format to ${destinationChainName} ...`);
        await updateSnapState('currentGenesisHash', genesisHash);
        await receive(id, genesisHash);
        break;
      }

      case 'send':
      case 'tokenSelector':
      case 'amount':
      case 'clear':
      case 'to':
        const formErrors = formValidation(sendForm, context);
        const clearAddress = event.name === 'clear';
        const displayClearIcon = !clearAddress && sendForm && Boolean(sendForm.to) && sendForm.to !== '';

        await send(id, sendForm?.tokenSelector, sendForm?.amount, sendForm?.to, formErrors, displayClearIcon, clearAddress);
        break;

      case 'sendReview':
        await showSpinner(id, 'Loading, please wait ...');
        const { tokenSelector, amount, to } = sendForm;
        const genesisHash = tokenSelector.split(',')[1] as HexString;
        await approveSend(id, genesisHash, amount, to);
        break;

      case 'confirmSend':
        await showSpinner(id, 'Working, please wait ...');
        await transfer(id, context.payload);
        break;

      case 'receive':
        await receive(id);
        break;

      case 'more':
        await showMore(id);
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

      case 'balanceDetails':
        await balanceDetails(id, context?.show === undefined ? true : !context.show);
        break;

      case 'backToHome':
      case 'cancelSend':
        await showSpinner(id, 'Loading, please wait ...');
        await accountInfo(id);
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