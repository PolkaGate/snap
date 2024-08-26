import {
  ButtonType,
  button,
  form,
  heading,
  input,
  panel,
  text,
  row,
  divider,
  copyable,
} from '@metamask/snaps-sdk';

import { getGenesisHash } from '../chains';
import { amountToMachine } from '../util/amountToMachine';
import { formatCamelCase } from '../util/formatCamelCase';
import { getApi } from '../util/getApi';
import { getCurrentChain } from '../util/getCurrentChain';
import { getKeyPair } from '../util/getKeyPair';

/**
 * Run the transfer extrinsics and then show the result page.
 *
 * @param id - The id of interface.
 * @param values - The parameters of the transaction.
 */
// TODO: can not send params from review page to transfer since review page is not a form, this will be resolved when new snap JSX components will be available
export async function transfer(id: string, values: Record<string, string>) {
  const { amount, recipient, chainName } = values;
  const genesisHash = await getGenesisHash(chainName);
  const api = await getApi(genesisHash);
  const decimal = api.registry.chainDecimals[0];

  const amountAsBN = amountToMachine(amount, decimal);

  const params = [recipient, amountAsBN];

  const keyPair = await getKeyPair(genesisHash);

  const call = api.tx.balances.transferKeepAlive(...params);

  const txHash = await call.signAndSend(keyPair);

  const result = {
    address: keyPair.address,
    chainName,
    txHash: String(txHash),
  };

  await showResult(id, result);
}

/**
 * Show amount and recipient input boxes.
 *
 * @param id - The id of interface.
 */
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
            }),
            button({
              variant: 'secondary',
              value: 'Back',
              name: 'backToHome',
            }),
          ],
        }),
      ]),
    },
  });
}

/**
 * Show the details of the transaction before submitting.
 * @param id - The id of interface.
 * @param values - The transaction parameters.
 */
export async function transferReview(
  id: string,
  values: Record<string, string | null>,
) {
  const { amount, recipient } = values;
  const chainName = await getCurrentChain();
  const genesisHash = await getGenesisHash(chainName);
  const api = await getApi(genesisHash);
  const decimal = api.registry.chainDecimals[0];
  const token = api.registry.chainTokens[0];

  const amountAsBN = amountToMachine(amount, decimal);

  const params = [recipient, amountAsBN];

  const keyPair = await getKeyPair(genesisHash);

  const call = api.tx.balances.transferKeepAlive(...params);

  const { partialFee } = await call.paymentInfo(keyPair.address);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel([
        heading('Transaction Review!'),
        divider(),
        row('Chain Name:', text(`**${formatCamelCase(chainName) ?? ''}**`)),
        row('Amount:', text(`**${amount} ${token}** `)),
        text('Recipient'),
        copyable(recipient),
        row('Estimated Fee:', text(`**${partialFee.toHuman()}**`)),
        divider(),
        button({
          variant: 'primary',
          value: 'Confirm',
          name: 'transferReview',
        }),
        button({
          variant: 'secondary',
          value: 'Back',
          name: 'backToHome',
        }),
      ]),
    },
  });
}

/**
 *
 * @param id
 * @param result
 */
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