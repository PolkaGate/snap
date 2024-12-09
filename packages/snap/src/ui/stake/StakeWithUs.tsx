import type { SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Box, Text, Heading, Icon, Section, Divider, Button } from '@metamask/snaps-sdk/jsx';

/**
 * A component that shows the Stake With Us section.
 *
 * @returns The StakeWithUs component.
 */
export const StakeWithUs: SnapComponent = () => (
  <Section>
    <Box direction='horizontal' alignment='center' center>
      <Icon name="stake" size="inherit" />
      <Heading size='md'>Stake with Us</Heading>
    </Box>
    <Text color='success' alignment='center'>
      Recommended
    </Text>
    <Divider />
    <Text alignment='start' color='muted'>Join PolkaGate Staking Pools and Start Earning Rewards with as Little as 1 DOT.</Text>
    <Button name='stakeWithUs' type="button" variant="primary">
      START
    </Button>
  </Section>
);