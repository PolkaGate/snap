/* eslint-disable no-case-declarations */
/* eslint-disable jsdoc/require-jsdoc */
import {
  ButtonType,
  button,
  form,
  heading,
  input,
  panel,
  text,
  spinner,
  row,
  divider,
  copyable,
} from '@metamask/snaps-sdk';

import { Balance } from '@polkadot/types/interfaces';
import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { getGenesisHash } from '../chains';
import { getApi } from '../util/getApi';
import { getKeyPair } from '../util/getKeyPair';
import { amountToMachine } from '../util/amountToMachine';
import { getCurrentChain } from '../util/getCurrentChain';
import { formatCamelCase } from '../util/formatCamelCase';

type Inputs = {
  partialFee: Balance;
  call: SubmittableExtrinsic<'promise', ISubmittableResult>;
  amount: string;
  recipient: string;
  chainName: string;
  token: string;
  keyPair: KeyringPair;
};

export async function transfer(id: string, values: Record<string, string>) {
  console.log('transferring inputs ?');

  const { amount, recipient, chainName } = values;
  const genesisHash = getGenesisHash(chainName);
  const api = await getApi(genesisHash);
  const decimal = api.registry.chainDecimals[0];
  const token = api.registry.chainTokens[0];

  const amountAsBN = amountToMachine(amount, decimal);

  const params = [recipient, amountAsBN];

  const keyPair = await getKeyPair(genesisHash);

  const call = api.tx.balances.transferKeepAlive(...params);

  const { partialFee } = await call.paymentInfo(keyPair.address);

  // const inputs: Inputs = {
  //   partialFee,
  //   call,
  //   ...values,
  //   token,
  //   keyPair,
  // };

  // showConfirm(id, inputs);

  const txHash = await call.signAndSend(keyPair);

  const result = {
    address: keyPair.address,
    chainName,
    txHash: String(txHash),
  };

  showResult(id, result);
}

// export async function transfer(id: string, values: Record<string, string>) {
//   console.log('transfer fund ...', values);

//   // const { amount, recipient, call } = values;

//   // const txHash = await call.signAndSend(keyPair);

//   // const result = {
//   //   address: keyPair.address,
//   //   chainName: values.chainName,
//   //   txHash: String(txHash),
//   // };

//   // showResult(id, result);
// }

export async function showTransferInputs(id: string) {
  const currentChainName = await getCurrentChain();

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel([
        heading('Transfer Fund'),
        text(`on ${currentChainName} chain`),
        form({
          name: 'transferInput',
          children: [
            input({
              inputType: 'number',
              label: 'Amount',
              name: 'amount',
              placeholder: 'enter the amount you want to transfer',
            }),
            input({
              inputType: 'text',
              label: 'Recipient',
              name: 'recipient',
              placeholder: 'paste the recipient address here',
            }),
            button({
              variant: 'primary',
              value: 'Confirm',
              name: 'transferReview',
              buttonType: 'submit',
            }),
          ],
        }),
      ]),
    },
  });
}

export async function showConfirm(id: string, inputs: Inputs) {
  const { amount, recipient, chainName, partialFee, call, token } = inputs;

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel([
        heading('Transaction Review!'),
        divider(),
        row('Chain Name:', text(`**${formatCamelCase(chainName)}**`)),
        row('Amount:', text(`**${amount} ${token}** `)),
        text('Recipient'),
        copyable(recipient),
        row('Estimated Fee:', text(`**${partialFee.toHuman()}**`)),
        divider(),
        form({
          name: 'transferConfirm',
          children: [button('Confirm', ButtonType.Submit, 'submit')],
        }),
      ]),
    },
  });
}

export async function showResult(id: string, result: Record<string, string>) {
  const { address, txHash, chainName } = result;

  console.log('result:', result);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel([
        heading('Transaction completed!'),
        divider(),
        text('**Hash**'),
        copyable(txHash),
        row(
          'More info:',
          text(
            `**[subscan](https://${chainName}.subscan.io/account/${String(
              address,
            )})**`,
          ),
        ),
        form({
          name: 'sendDone',
          children: [button('Done', ButtonType.Submit, 'submit')],
        }),
      ]),
    },
  });
}

export async function showSpinner(id: string, title?: string) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel([
        heading('Processing'),
        divider(),
        text(title || 'We are working on your transaction, Please wait ...'),
        spinner(),
      ]),
    },
  });
}
