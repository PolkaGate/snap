import { Box, Container, Section, Footer, Button, Heading } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { Row2 } from "../../../components/Row2";
import { StakingSoloContextType } from "../../types";
import { SoloUnstakeExtraInfo } from "./component/SoloUnstakeExtraInfo";
import { Account } from "../../../components/Account";
import { FlowHeader } from "../../../components/FlowHeader";
import { Price } from "../../../components";

const ui = (context: StakingSoloContextType) => {

  let { address, amount, decimal, genesisHash, token, price, fee, unbondingDuration } = context;
  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  return (
    <Container>
      <Box>
        <FlowHeader
          action='soloUnstake'
          label='Unstake'
          showHome
          tooltipType='staking'
        />
        <Box direction="vertical" alignment="center" center>
          <Heading size="lg">
            {`${amount} ${token}`}
          </Heading>
          <Price
            amount={amount}
            price={price}
          />
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
        <SoloUnstakeExtraInfo
          unbondingDuration={unbondingDuration}
        />
      </Box>
      <Footer>
        <Button name='soloUnstakeConfirm'>
          Confirm
        </Button>
      </Footer>
    </Container >
  );
};

export async function soloUnstakeReview(id: string, context: StakingSoloContextType) {

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(context),
      context: {
        ...(context ?? {})
      }
    },
  });
}