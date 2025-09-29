import { Box, Section, Text, SnapComponent, Button, Image } from '@metamask/snaps-sdk/jsx';
import { amountToHuman } from '../../../util/amountToHuman';
import { ringingBell } from '../../image/icons';

interface Props {
  amount: string | undefined;
  decimal: number;
  name: string;
  token: string;
  price: number;
}

export const SOLO_REDEEMABLE_DECIMAL = 4;


export const Redeemable: SnapComponent<Props> = ({ amount, decimal,name, token }) => {

  return (
    <Section direction='vertical' alignment='center'>
      <Box direction='horizontal' alignment='start' center>
        <Image src={ringingBell} />
        <Text color='muted' size='sm'>
          Redeemable
        </Text>
      </Box>
      <Box direction='horizontal' alignment='space-between'>
        <Text>
          {`${amountToHuman(amount, decimal, SOLO_REDEEMABLE_DECIMAL, true)} ${token}`}
        </Text>
        <Button name={name} variant='primary' type='button'>
          Redeem
        </Button>
      </Box>
    </Section>
  )
}