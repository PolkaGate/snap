import {
  Box,
  Field,
  Form,
  Icon,
  Input,
  Text,
  type SnapComponent,
} from '@metamask/snaps-sdk/jsx';

import { TokenSelector } from '../send/TokenSelector';
import { PriceValue } from '../../util/getPrices';
import { Balances } from '../../util';
import { SendFormErrors } from '../send/types';

export type StakeFormProps = {
  formErrors: SendFormErrors;
  logos: {
    genesisHash: string;
    logo: string;
  }[];
  nonZeroBalances: Balances[];
  pricesInUsd: { genesisHash: string, price: PriceValue }[];
  selectedToken: Balances;
};

export const StakeForm: SnapComponent<StakeFormProps> = ({
  formErrors,
  logos,
  nonZeroBalances,
  pricesInUsd,
  selectedToken,
}) => {

  const _selectedToken = selectedToken || nonZeroBalances[0];

  return (
    <Form name="stakeForm">
      <TokenSelector
        selectedToken={_selectedToken}
        nonZeroBalances={nonZeroBalances}
        logos={logos}
        pricesInUsd={pricesInUsd}
      />
      <Field label="Stake amount" error={formErrors?.amount}>
        <Box>
          <Icon name='stake' color='muted' />
        </Box>
        <Input name="stakeAmount" type="number" placeholder="Enter amount to stake" />
        <Box direction="horizontal" center>
          <Text color="alternative">
            {_selectedToken.token}
          </Text>
        </Box>
      </Field>
    </Form>
  )
};