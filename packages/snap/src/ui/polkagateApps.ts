import { button, heading, panel, text, divider } from '@metamask/snaps-sdk';

/**
 * This shows a staking page including staking websites
 *
 * @param id - The id of UI interface to be updated.
 */
export async function polkagateApps(id: string) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel([
        heading('Send Funds!'),
        divider(),
        text(
          'With the PolkaGate app, you can **send** funds, **stake** tokens, **vote** on referenda, create an **identity**, view **assets** across chains, **unlock** tokens, and more.'),
        text('**[apps.polkagate.xyz](https://apps.polkagate.xyz)**'),
        divider(),
        button({
          variant: 'primary',
          value: 'Back',
          name: 'backToHome',
        }),
      ]),
    },
  });
}
