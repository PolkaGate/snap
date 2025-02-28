import { Box, Section, Text, SnapComponent, Icon, Tooltip, Button } from '@metamask/snaps-sdk/jsx';
import { amountToHuman } from '../../../util/amountToHuman';
import { DEFAULT_DECIMAL_POINT } from '../const';

interface Props {
  toBeReleased: {
    amount: string;
    date: number;
  }[],
  token: string;
  decimal: number;
  price: number;
  type: 'pool' | 'solo';
}

export const DATE_OPTIONS = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions;

export const Unstaking: SnapComponent<Props> = ({ toBeReleased, decimal, token, type }) => {

  return (
    <Section direction='vertical' alignment='center'>
      <Box direction='horizontal' alignment='space-between'>
        <Text color='muted'>
          Unstaking
        </Text>
        {type === 'solo' &&
          <Button name='restake'>
            <Icon name='close' color='primary' />
          </Button>}
      </Box>
      {toBeReleased.map(({ amount, date }) => (
        <Box direction='horizontal' alignment='space-between'>
          <Text>
            {`${amountToHuman(amount, decimal, DEFAULT_DECIMAL_POINT, true)} ${token}`}
          </Text>
          <Box direction='horizontal' alignment='end'>
            <Text color='muted'>
              {new Date(date).toLocaleDateString(undefined, DATE_OPTIONS)}
            </Text>
            <Tooltip content='Date the amount becomes redeemable'>
              <Icon name='clock' color='muted' />
            </Tooltip>
          </Box>
        </Box>
      ))}
    </Section>
  )
}