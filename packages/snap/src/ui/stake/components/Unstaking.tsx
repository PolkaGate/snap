import { Box, Section, Text, SnapComponent, Icon, Tooltip } from '@metamask/snaps-sdk/jsx';
import { amountToHuman } from '../../../util/amountToHuman';
import { DEFAULT_DECIMAL_POINT } from '../const';
import { ActionRow } from '../../components/ActionRow';

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

/**
 * Renders an unstaking section displaying amounts scheduled for release.
 * 
 * @param toBeReleased - An array of unstaking entries, each containing an amount and release date.
 * @param token - The token symbol.
 * @param decimal - The number of decimal places for the token.
 * @param price - The token price.
 * @param type - The staking type, either 'pool' or 'solo'.
 * @returns A JSX element representing the unstaking section.
 */
export const Unstaking: SnapComponent<Props> = ({ toBeReleased, decimal, token, type }) => {

  return (
    <Section direction='vertical' alignment='center'>
      <Box direction='horizontal' alignment='space-between'>
        <Text color='muted'>
          Unstaking
        </Text>
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
      {type === 'solo' &&
        <ActionRow
          label='Re-stake'
          icon='plus-minus'
          name='restake'
        />}
    </Section>
  )
}