import { Box, Container, Section, Footer, Button, Heading, Text, Image } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import type { Balance } from "@polkadot/types/interfaces";
import { Row2 } from "../../../components/Row2";
import { StakingSoloContextType } from "../../types";
import { Account } from "../../../components/Account";
import { FlowHeader } from "../../../components/FlowHeader";
import { OUTPUT_TYPE } from "../../../../constants";
import { getPayout } from "./util/getPayout";
import { birdDown } from "../../../image/icons";
import { SOLO_REDEEMABLE_DECIMAL } from "../../components/Redeemable";
import { Price } from "../../../components";

const ui = (
  fee: Balance,
  context: StakingSoloContextType) => {

  let { address, decimal, genesisHash, token, price, selectedAmountToPayout } = context;
  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  return (
    <Container>
      <Box>
        <FlowHeader
          action='pendingRewards'
          label='Payout rewards'
        />
        <Box direction="vertical" alignment="center" center>
          <Heading size="lg">
            {`${amountToHuman(selectedAmountToPayout, decimal, SOLO_REDEEMABLE_DECIMAL, true)} ${token}`}
          </Heading>
          <Price
            amount={selectedAmountToPayout}
            decimal={decimal}
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
            value={`${amountToHuman(String(fee), decimal, 4, true)} ${token}`}
            extra={`$${feeInUsd.toFixed(2)}`}
          />
        </Section>
        <Box direction="horizontal" alignment="end" center>
          <Image src={birdDown} />
        </Box>
      </Box>
      <Footer>
        <Button name='payoutConfirm'>
          Confirm
        </Button>
      </Footer>
    </Container >
  );
};

export async function reviewPayout(
  id: string,
  context: StakingSoloContextType
) {

  let { address, genesisHash, selectedPayouts } = context;
  const fee = await getPayout(address, genesisHash, selectedPayouts!, OUTPUT_TYPE.FEE) as Balance;

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(fee, context),
      context: {
        ...(context ?? {})
      }
    },
  });
}