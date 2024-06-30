import { button, heading, panel, text, divider } from '@metamask/snaps-sdk';

/**
 * This shows a dapp list to users.
 *
 * @param id - The id of UI interface to be updated.
 */
export async function showDappList(id: string) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel([
        heading('DApps List'),
        divider(),
        text(
          'Explore these dApps to streamline your daily tasks and engage with the Polkadot ecosystem.',
        ),
        text('General : **[apps.polkagate.xyz](https://apps.polkagate.xyz)**'),
        text(
          'Staking : **[staking.polkadot.cloud](https://staking.polkadot.cloud/)**',
        ),
        text('Governance : **Coming Soon ...**'),
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
