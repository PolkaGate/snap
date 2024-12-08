import type { SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Box, Button, Container, Copyable, Divider, Footer, Heading, Image, Link, Section, Text } from '@metamask/snaps-sdk/jsx';
import { success } from '../image/icons';
import { sanitizeChainName } from '../../util/getChainName';

type Props = {
  chainName?: string;
  txHash: string;
}

/**
 * A component that shows the confirmation of a transaction.
 *
 * @returns The SendConfirmation component.
 */
export const SendConfirmation: SnapComponent<Props> = ({ chainName, txHash }) => (
  <Container>
    <Box>
      <Box alignment='center' center direction='horizontal'>
        <Heading>
          Transaction sent!
        </Heading>
      </Box>
      <Section>
        <Box alignment='center' center direction='horizontal'>
          <Image src={success} alt='success' />
        </Box>
        <Divider />
        <Text alignment='start'>
          Transaction hash
        </Text>
        <Copyable value={txHash} />
        <Divider />
        <Box direction='horizontal' alignment='space-between'>
          <Text>
            View on explorer
          </Text>
          <Link href={`https://${sanitizeChainName(chainName)}.subscan.io/extrinsic/${String(txHash)}`}>
            subscan
          </Link>
        </Box>
      </Section>
    </Box>
    <Footer>
      <Button name="backToHome" >
        Home
      </Button>
    </Footer>
  </Container>
);