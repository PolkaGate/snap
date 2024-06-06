import {
  copyable,
  divider,
  heading,
  panel,
  row,
  text,
  button,
} from '@metamask/snaps-sdk';
import type { SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Bold, Button, Box, Text } from '@metamask/snaps-sdk/jsx';
import { Balances } from '../util/getBalance';
import { getGenesisHash } from '../chains';
import { getFormatted } from '../util/getFormatted';
import { formatChainName } from '../util/formatChainName';

export const accountDemo = (
  address: string,
  chainName: string,
  balances: Balances,
) => {
  const genesisHash = getGenesisHash(chainName);
  const formatted = getFormatted(genesisHash, address);

  const { total, transferable, locked } = balances;
  return panel([
    heading(`Your Account on ${formatChainName(chainName)}`),
    divider(),
    panel([
      text('Address'),
      copyable(formatted),
      row('Total', text(`**${total.toHuman()}**`)),
      row('Transferable', text(`**${transferable.toHuman()}**`)),
      row('Locked', text(`**${locked.toHuman()}**`)),
      divider(),
      button({
        value: 'Transfer Fund',
        name: 'transfer',
      }),
      button({
        variant: 'secondary',
        value: 'View App list',
        name: 'dapp',
      }),
      button({
        variant: 'secondary',
        value: 'Click to switch chain',
        name: 'switchChain',
      }),
    ]),
  ]);
};
