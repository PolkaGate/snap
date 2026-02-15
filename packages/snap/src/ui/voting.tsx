import { Box, Button, Container, Footer, Link, Section, Text } from "@metamask/snaps-sdk/jsx";
import { FlowHeader } from "./components/FlowHeader";

const ui = () => {

  return (
    <Container>
      <Box direction="vertical" alignment="start">
        <FlowHeader
          action='backToHomeWithoutUpdate'
          label='Vote'
          showHome
        />
        <Text alignment='start' color='muted'>
          Here are the recommended governance dapps where you can cast your votes
        </Text>
        <Section alignment="start" direction="horizontal">
          <Text alignment='start'>1- </Text>
          <Link href={'https://subsquare.io'}>
            subsquare.io
          </Link>
        </Section>
        <Section alignment="start" direction="horizontal">
          <Text alignment='start'>2- </Text>
          <Link href={'https://apps.polkagate.xyz'}>
            apps.polkagate.xyz
          </Link>
        </Section>
      </Box>
      <Footer>
        <Button name='backToHomeWithoutUpdate'>
          Back
        </Button>
      </Footer>
    </Container>
  );
};

export async function voting(id: string) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui()
    },
  });
}