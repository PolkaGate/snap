import {
  button,
  heading,
  panel,
  text,
  divider,
  input,
  form,
  copyable,
} from '@metamask/snaps-sdk';

import { getJsonKeyPair } from '../util';

/**
 * This will show the alert to get password to export account as JSON file.
 *
 * @param id - The id of UI interface to be updated.
 */
export async function exportAccount(id: string) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel([
        heading('Export Account'),
        divider(),
        text(
          'Here, you can export your account as a JSON file, which can be used to import your account in another extension or wallet.'),
        form({
          name: 'saveExportedAccount',
          children: [
            input({
              inputType: 'password',
              label: 'Enter a password to encrypt your export data:',
              name: 'password',
              placeholder: 'password ...',
            }),
            button({
              variant: 'primary',
              value: 'Export',
              name: 'exportAccountBtn',
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
 * This will show the exported account content that can be copied in a file.
 *
 * @param id - The id of UI interface to be updated.
 * @param password - The password to encode the content.
 */
export async function showJsonContent(id: string, password: string | null) {
  if (!password) {
    return;
  }
  const json = await getJsonKeyPair(password);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel([
        heading('Export Account'),
        divider(),
        text(
          'Copy and save the following content in a (.json) file. This file can be imported later in extensions and wallets.',
        ),
        copyable(json),
        button({
          variant: 'secondary',
          value: 'Back',
          name: 'backToHome',
        }),
      ]),
    },
  });
}
