import {
  Card,
  Field,
  Selector,
  SelectorOption,
  type SnapComponent,
} from '@metamask/snaps-sdk/jsx';

import type { Balances } from '../../../util';
import { PriceValue } from '../../../util/getPrices';
import { amountToHuman } from '../../../util/amountToHuman';

/**
 * The props for the {@link AccountSelector} component.
 *
 * @property selectedAccount - The currently selected account.
 * @property accounts - The available accounts.
 */
export type TokenSelectorProps = {
  nonZeroBalances: Balances[],
  selectedToken: Balances,
  pricesInUsd: { genesisHash: string, price: PriceValue }[];
  logos: {
    genesisHash: string;
    logo: string;
  }[];
};

export const TokenSelector: SnapComponent<TokenSelectorProps> = ({
  nonZeroBalances,
  selectedToken,
  logos,
  pricesInUsd
}) => {

  return (
    <Field label={'Token'}>
      <Selector
        name="tokenSelector"
        title="Select token"
        value={`${selectedToken.token},${selectedToken.genesisHash}`}
      >
        {nonZeroBalances.map(({ decimal, token, genesisHash, transferable }) => {
          const icon = logos.find((logo) => logo.genesisHash === genesisHash)?.logo;
          const price = pricesInUsd.find((item) => item.genesisHash === genesisHash)?.price.value || 0;
          const transferableInUsd = parseFloat(amountToHuman(transferable, decimal)) * price;

          return (
            <SelectorOption value={`${token},${genesisHash}`}>
              <Card
                image={icon}
                title={token}
                description={`$${price}`}
                value={`${amountToHuman(transferable, decimal, 2, true)} ${token}`}
                extra={`$${transferableInUsd.toFixed(2)}`}
              />
            </SelectorOption>
          )
        })}
      </Selector>
    </Field>
  )
};