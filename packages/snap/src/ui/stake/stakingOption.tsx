import { Box, Button, Container, Divider, Footer, Heading, Icon, Link, Section, Text } from "@metamask/snaps-sdk/jsx";
import { FlowHeader } from "../send/FlowHeader";
import { StakeViaDapps } from "./StakeViaDapps";
import { StakeWithUs } from "./StakeWithUs";

export async function stakingOption(id: string) {
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
        <FlowHeader
          action='backToHome'
          label='Stake'
        />
        <StakeWithUs />
        <StakeViaDapps />
      </Box>
      <Footer>
        <Button name='backToHome' variant="destructive">
          Back
        </Button>
      </Footer>
    </Container>
  );
};