import {
  Box,
  Button,
  Field,
  Form,
  Icon,
  Image,
  Input,
  Text,
  type SnapComponent,
} from '@metamask/snaps-sdk/jsx';

import jazzicon1 from '../image/jazzicon/jazzicon1.svg';
import { TokenSelector } from './TokenSelector';
import { PriceValue } from '../../util/getPrices';
import { Balances } from '../../util';
import { SendFormErrors } from './types';

export type SendFormProps = {
  clearAddress?: boolean;
  displayClearIcon?: boolean;
  formErrors: SendFormErrors;
  logos: {
    genesisHash: string;
    logo: string;
  }[];
  nonZeroBalances: Balances[];
  pricesInUsd: { genesisHash: string, price: PriceValue }[];
  selectedToken: Balances;
};

export const SendForm: SnapComponent<SendFormProps> = ({
  clearAddress,
  displayClearIcon,
  formErrors,
  logos,
  nonZeroBalances,
  pricesInUsd,
  selectedToken,
}) => {

  const _selectedToken = selectedToken || nonZeroBalances[0];

  return (
    <Form name='sendForm'>
      <TokenSelector
        selectedToken={_selectedToken}
        nonZeroBalances={nonZeroBalances}
        logos={logos}
        pricesInUsd={pricesInUsd}
      />
      <Field label='Send amount' error={formErrors?.amount}>
        <Box>
          <Icon name='send-2' color='muted' />
        </Box>
        <Input name='amount' type='number' placeholder='Enter amount to send' />
        <Box direction='horizontal' center>
          <Text color='alternative'>{_selectedToken.token}</Text>
        </Box>
      </Field>
      <Field label='To account' error={formErrors?.to}>
        <Box>
          <Image src={jazzicon1} />
        </Box>
        <Input
          name='to'
          placeholder='Enter receiving address'
          value={clearAddress ? '' : undefined}
        />
        {displayClearIcon && (
          <Box>
            <Button name='clear'>
              <Icon name='close' color='primary' />
            </Button>
          </Box>
        )}
      </Field>
    </Form>
  )
};