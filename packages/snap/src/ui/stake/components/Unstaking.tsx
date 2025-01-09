import { Box, Section, Text, SnapComponent, Icon } from '@metamask/snaps-sdk/jsx';
import { amountToHuman } from '../../../util/amountToHuman';

interface Props {
  toBeReleased: {
    amount: string;
    date: number;
  }[],
  token: string;
  decimal: number;
  price: number;
}

export const DATE_OPTIONS = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions;

export const Unstaking: SnapComponent<Props> = ({ toBeReleased, decimal, token }) => {

  return (
    <Section direction='vertical' alignment='center'>
      <Box direction='horizontal' alignment='start'>
        <Text color='muted'>
          Unstaking
        </Text>
      </Box>
      {toBeReleased.map(({ amount, date }) => (
        <Box direction='horizontal' alignment='space-between'>
          <Text>
            {`${amountToHuman(amount, decimal, 3, true)} ${token}`}
          </Text>
          <Box direction='horizontal' alignment='end'>
            <Text color='muted'>
              {new Date(date).toLocaleDateString(undefined, DATE_OPTIONS)}
            </Text>
            <Icon name='clock' color='muted' />
          </Box>
        </Box>
      ))}
    </Section>
  )
}