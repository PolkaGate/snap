import { button, heading, panel, text, divider } from '@metamask/snaps-sdk';

/**
 * This shows a staking page including staking websites
 *
 * @param id - The id of UI interface to be updated.
 */
export async function staking(id: string) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel([
        heading('Stake Here!'),
        divider(),
        text('Here are the recommended staking dapps where you can safely stake your tokens:'),
        divider(),
        text('1- Dashboard: **[staking.polkadot.cloud](https://staking.polkadot.cloud)**'),
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
