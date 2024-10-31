import { Box, Button, Container, Divider, Footer, Heading, Icon, Link, Section, Text } from "@metamask/snaps-sdk/jsx";

export async function voting(id: string) {
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
          <Icon name="tag" size="md" />
          <Heading>Participate in Governance!</Heading>
        </Box>
        <Divider />
        <Text alignment='start'>Here are the recommended governance dapps where you can cast your votes:</Text>
        <Box alignment="start" direction="horizontal">
          <Text alignment='start'>1- </Text>
          <Link href={'https://subsquare.io'}>
            subsquare.io
          </Link>
        </Box>
        <Box alignment="start" direction="horizontal">
          <Text alignment='start'>2- </Text>
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