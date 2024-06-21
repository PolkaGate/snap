import {
  copyable,
  divider,
  panel,
  row,
  text,
  button,
} from '@metamask/snaps-sdk';

import { getGenesisHash } from '../chains';
import { formatChainName } from '../util/formatChainName';
import type { Balances } from '../util/getBalance';
import { getFormatted } from '../util/getFormatted';

export const accountDemo = (
  address: string,
  chainName: string,
  balances: Balances,
) => {
  const genesisHash = getGenesisHash(chainName);
  const formatted = getFormatted(genesisHash, address);

  const { total, transferable, locked } = balances;
  return panel([
    // heading(`Your Account on ${formatChainName(chainName)}`),
    row('Account info on', text(`**${formatChainName(chainName)}**`)),
    copyable(formatted),
    divider(),
    panel([
      row('Total Balance', text(`**${total.toHuman()}**`)),
      row('Transferable', text(`**${transferable.toHuman()}**`)),
      row('Locked', text(`**${locked.toHuman()}**`)),
      divider(),
      // button({
      //   value: 'Transfer fund',
      //   name: 'transfer',
      // }),
      button({
        variant: 'primary',
        value: 'View dApp list',
        name: 'dapp',
      }),
      button({
        variant: 'secondary',
        value: 'Click to switch chain',
        name: 'switchChain',
      }),
      button({
        variant: 'secondary',
        value: 'Export account',
        name: 'showExportAccount',
      }),
    ]),
  ]);
};
