import { Box, Container, Image, Section, Text, Footer, Button, Heading } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { Row2 } from "../../components/Row2";
import { StakingSoloContextType } from "../../types";
import { birdDown } from "../../../image/icons";
import { SoloStakeMoreExtraInfo } from "./component/SoloStakeMoreExtraInfo";
import { Account } from "../../components/Account";
import { FlowHeader } from "../../../components/FlowHeader";

export async function soloStakeMoreReview(
  id: string,
  context: StakingSoloContextType
) {

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(context),
      context: {
        ...(context || {})
      }
    },
  });
}

const ui = (
  context: StakingSoloContextType
) => {

  let { address, amount, decimal, genesisHash, token, price, claimable, fee } = context;
  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  return (
    <Container>
      <Box>
        <FlowHeader
          action='soloStakeMore'
          label='Stake more'
          showHome
          isSubAction
          tooltipType='staking'
        />
        <Box direction="vertical" alignment="center" center>
          <Heading size="lg">
            {`+ ${amount} ${token}`}
          </Heading>
          <Text color="muted">
            ${(Number(amount || 0) * price).toFixed(2)}
          </Text>
        </Box>
        <Section>
          <Account
            address={address}
            genesisHash={genesisHash}
          />
          <Row2
            label='Network fee'
            value={`${amountToHuman(fee, decimal, 4, true)} ${token}`}
            extra={`$${feeInUsd.toFixed(2)}`}
          />
        </Section>
        <SoloStakeMoreExtraInfo
          claimable={claimable}
          decimal={decimal}
          token={token}
        />
        <Box direction="horizontal" alignment='end'>
          <Image src={birdDown} />
        </Box>
      </Box>
      <Footer>
        <Button name='soloStakeMoreConfirm'>
          Confirm
        </Button>
      </Footer>
    </Container >
  );
};