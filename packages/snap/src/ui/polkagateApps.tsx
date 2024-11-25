import { Bold, Box, Button, Container, Divider, Footer, Heading, Icon, Link, Section, Text } from "@metamask/snaps-sdk/jsx";

export async function polkagateApps(id: string) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui()
    },
  });
}

const ui = () => {

  return (
    <Container>
      <Box direction="vertical" alignment="start">
        <Section>
          <Box direction='horizontal' alignment='start'>
            <Icon name="send-1" size="md" />
            <Heading>Send Funds!</Heading>
          </Box>
          <Divider />
          <Text alignment='start'> With the PolkaGate app, you can <Bold>send</Bold> funds, <Bold>stake</Bold> tokens, <Bold>vote</Bold> on referenda, create an <Bold>identity</Bold>, view <Bold>assets</Bold> across chains, <Bold>unlock</Bold> tokens, and more.</Text>
          <Box alignment="start" direction="horizontal">
            <Text alignment='start'>Visit:</Text>
            <Link href={'https://apps.polkagate.xyz'}>
              apps.polkagate.xyz
            </Link>
          </Box>
        </Section>
      </Box>
      <Footer>
        <Button name='backToHome' variant="destructive">
          Back
        </Button>
      </Footer>
    </Container>
  );
};