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
          'Below are the recommended governance dapps where you can cast your votes.',
        ),
        text('Subsquare: **[subsquare.io](https://subsquare.io)**'),
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
