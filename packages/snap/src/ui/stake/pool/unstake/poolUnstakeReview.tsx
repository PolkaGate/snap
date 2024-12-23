import { Box, Container, Image, Section, Text, Footer, Button, Heading } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { StakeFlowHeader } from "../../components/StakeFlowHeader";
import { Row2 } from "../../components/Row2";
import { StakingInitContextType } from "../../types";
import { PoolUnstakeExtraInfo } from "./component/PoolUnstakeExtraInfo";

export async function poolUnstakeReview(
  id: string,
  context: StakingInitContextType
) {

  let { amount, decimal, token, price, claimable, fee, unbondingDuration } = context;
  
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(amount, claimable, decimal, token, price, fee, unbondingDuration),
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
  unbondingDuration: number,
) => {

  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  return (
    <Container>
      <Box>
        <StakeFlowHeader
          action='poolUnstake'
          label='Unstake'
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
        <PoolUnstakeExtraInfo
          claimable={claimable}
          decimal={decimal}
          token={token}
          unbondingDuration={unbondingDuration}
        />
      </Box>
      <Footer>
        <Button name='poolUnstakeConfirm'>
          Confirm
        </Button>
      </Footer>
    </Container >
  );
};