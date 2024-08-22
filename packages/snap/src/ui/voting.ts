import { button, heading, panel, text, divider } from '@metamask/snaps-sdk';

/**
 * This shows a voting page including governance websites
 *
 * @param id - The id of UI interface to be updated.
 */
export async function voting(id: string) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel([
        heading('Participate in Governance!'),
        divider(),
        text(
          'Here are the recommended governance dapps where you can cast your votes:',
        ),
        divider(),
        text('1- Subsquare: **[subsquare.io](https://subsquare.io)**'),
        text('2- PolkaGate Apps: **[apps.polkagate.xyz](https://apps.polkagate.xyz)**'),
        divider(),
        button({
          variant: 'secondary',
          value: 'Back',
          name: 'backToHome',
        }),
      ]),
    },
  });
}
