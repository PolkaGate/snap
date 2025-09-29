import { Avatar, Box, Button, Field, Form, Icon, Image, Input, Text, type SnapComponent } from '@metamask/snaps-sdk/jsx';

import jazzicon1 from '../../image/jazzicon/jazzicon1.svg';
import { TokenSelector } from './TokenSelector';
import { PriceValue } from '../../../util/getPrices';
import type { Balances } from '../../../util';
import { SendFormErrors } from '../types';

export type SendFormProps = {
  clearAddress?: boolean;
  displayClearIcon?: boolean;
  formErrors: SendFormErrors;
  logos: {
    genesisHash: string;
    logo: string;
  }[];
  tokensToList: Balances[] | undefined;
  pricesInUsd: { genesisHash: string, price: PriceValue }[];
  recipient: string | undefined;
  selectedToken: Balances | undefined;
};

export const SendForm: SnapComponent<SendFormProps> = ({
  clearAddress,
  displayClearIcon,
  formErrors,
  logos,
  tokensToList,
  pricesInUsd,
  recipient,
  selectedToken
}) => {

  const _selectedToken = selectedToken || tokensToList?.[0];

  return (
    <Form name='sendForm'>
      <TokenSelector
        selectedToken={_selectedToken}
        tokensToList={tokensToList}
        logos={logos}
        pricesInUsd={pricesInUsd}
      />
      <Field label='Send amount' error={formErrors?.amount}>
        <Box>
          <Icon name='wallet' color='muted' />
        </Box>
        <Input
          name='amount'
          type='number'
          placeholder='Enter amount to send'
        />
        <Box direction='horizontal' center>
          <Text color='alternative'>
            {_selectedToken?.token || 'Unknown'}
          </Text>
        </Box>
      </Field>
      <Field label='To account' error={formErrors?.to}>
        <Box>
          {recipient
            ? <Avatar address={`polkadot:91b171bb158e2d3848fa23a9f1c25182:${recipient}`} />
            : <Image src={jazzicon1} />
          }
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