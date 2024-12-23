// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0


import { Box, Heading, Icon, Text, Button, SnapComponent, Bold } from '@metamask/snaps-sdk/jsx';

interface Props {
  hideBalance: boolean | undefined;
  totalBalance: number;
  availableBalance: number;
  totalBalanceChanges: number;
}

export const TotalBalance: SnapComponent<Props> = ({ availableBalance, hideBalance, totalBalance, totalBalanceChanges }) => {

  const signOfChanges = totalBalanceChanges > 0 ? '+' : totalBalanceChanges < 0 ? '-' : '';
  const colorOfChanges = totalBalanceChanges > 0 ? 'success' : totalBalanceChanges < 0 ? 'error' : 'default';
  const locked = totalBalance - availableBalance;

  return (
    <Box >
      <Box alignment='space-between' direction='horizontal' center>
        <Text color='muted'>
          <Bold>Total balance</Bold>
        </Text>
        <Box alignment='end' direction='horizontal'>
          <Icon name='lock' color='muted' />
          <Text alignment='end' color='muted'>
            {hideBalance
              ? '••••••••'
              : `$${locked.toFixed(2)}`
            }
          </Text>
        </Box>
      </Box>
      <Box alignment='space-between' direction='horizontal' center>
        <Box alignment='start' direction='horizontal' center>
          <Heading size='lg'>
            {hideBalance
              ? '●●●●●●●●'
              : `$${totalBalance.toFixed(2)}`
            }
          </Heading>
          <Button name={hideBalance ? 'showBalance' : 'hideBalance'}>
            {hideBalance
              ? <Icon name='eye-slash' size='md' color='muted' />
              : <Icon name='eye' size='md' color='muted' />
            }
          </Button>
        </Box>
        <Text alignment='start' color={colorOfChanges}>
          {hideBalance
            ? '••••••••'
            : `${signOfChanges}$${Math.abs(totalBalanceChanges).toFixed(2)}`
          }
        </Text>
      </Box>
    </Box>
  )
}