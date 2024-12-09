import type { SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Box, Text, Heading, Icon, Link, Section, Divider } from '@metamask/snaps-sdk/jsx';

/**
 * A component that shows the stake advanced section.
 *
 * @returns The StakeViaDapps component.
 */
export const StakeViaDapps: SnapComponent = () => (
  <Section>
    <Box direction='horizontal' alignment='center'>
    <Icon name="coin" size="md"/>
      <Heading size='md'>Stake via dApps</Heading>
    </Box>
    <Divider />
    <Text alignment='start' color='muted'> Here are the list of dapps where you can safely stake your tokens:</Text>
    <Box alignment="start" direction="horizontal">
      <Text alignment='start' color='muted'>1- </Text>
      <Link href={'https://staking.polkadot.cloud'}>
        staking.polkadot.cloud
      </Link>
    </Box>
    <Box alignment="start" direction="horizontal">
      <Text alignment='start' color='muted'>2- </Text>
      <Link href={'https://apps.polkagate.xyz'}>
        apps.polkagate.xyz
      </Link>
    </Box>
  </Section>
);