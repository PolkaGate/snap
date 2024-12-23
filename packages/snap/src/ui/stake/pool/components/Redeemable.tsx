import { Box, Section, Text, SnapComponent, Button, Image } from '@metamask/snaps-sdk/jsx';
import { amountToHuman } from '../../../../util/amountToHuman';
import { BN } from '@polkadot/util';
import { ringingBell } from '../../../image/icons';

interface Props {
  amount: string | undefined;
  token: string;
  decimal: number;
  price: number;
}

export const Redeemable: SnapComponent<Props> = ({ amount, decimal, token }) => {

  const hasRedeemable = !!amount && !new BN(amount).isZero();

  return (
    <Box>
      {
        hasRedeemable &&
        <Section direction='vertical' alignment='center'>
          <Box direction='horizontal' alignment='start' center>
            <Image src={ringingBell} />
            <Text color='muted'>
              Redeemable
            </Text>
          </Box>
          <Box direction='horizontal' alignment='space-between'>
            <Text>
              {`${amountToHuman(amount, decimal, 3, true)} ${token}`}
            </Text>
            <Button name='poolRedeem' variant='primary' type='button'>
              Redeem
            </Button>
          </Box>
        </Section>
      }
    </Box>
  )
}