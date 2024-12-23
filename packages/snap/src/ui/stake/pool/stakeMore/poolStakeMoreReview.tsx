import { Box, Container, Image, Section, Text, Footer, Button, Heading } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { StakeFlowHeader } from "../../components/StakeFlowHeader";
import { Row2 } from "../../components/Row2";
import { StakingInitContextType } from "../../types";
import { birdDown } from "../../../image/icons";
import { PoolStakeMoreExtraInfo } from "./PoolStakeMoreExtraInfo";

export async function poolStakeMoreReview(
  id: string,
  context: StakingInitContextType
) {

  let { amount, decimal, token, price, claimable, fee } = context;

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(amount, claimable, decimal, token, price, fee),
      context: {
        ...(context || {})
      }
    },
  });
}

const ui = (
  amount: string | undefined,
  claimable: string,
  decimal: number,
  token: string,
  price: number,
  fee: string,
) => {

  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  return (
    <Container>
      <Box>
        <StakeFlowHeader
          action='poolStakeMore'
          label='Stake more'
          showHome
          isSubAction
        />
        <Box direction="vertical" alignment="center" center>
          <Heading size="lg">
            {`${amount} ${token}`}
          </Heading>
          <Text color="muted">
            ${(Number(amount || 0) * price).toFixed(2)}
          </Text>
        </Box>
        <Section>
          <Row2
            label=' Network fee'
            value={`${amountToHuman(fee, decimal, 4, true)} ${token}`}
            extra={`$${feeInUsd.toFixed(2)}`}
          />
        </Section>
        <PoolStakeMoreExtraInfo
          claimable={claimable}
          decimal={decimal}
          token={token}
        />
        <Box direction="horizontal" alignment='end'>
          <Image src={birdDown} />
        </Box>
      </Box>
      <Footer>
        <Button name='poolStakeMoreConfirm'>
          Confirm
        </Button>
      </Footer>
    </Container >
  );
};