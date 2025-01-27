import { Box, Container, Image, Section, Text, Footer, Button, Heading } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { Row2 } from "../../../components/Row2";
import { StakingPoolContextType } from "../../types";
import { birdDown } from "../../../image/icons";
import { PoolStakeMoreExtraInfo } from "./PoolStakeMoreExtraInfo";
import { Account } from "../../../components/Account";
import { FlowHeader } from "../../../components/FlowHeader";
import { Price } from "../../../components";

const ui = (
  context: StakingPoolContextType
) => {

  let { address, amount, decimal, genesisHash, token, price, claimable, fee } = context;
  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  return (
    <Container>
      <Box>
        <FlowHeader
          action='poolStakeMore'
          label='Stake more'
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

export async function poolStakeMoreReview(
  id: string,
  context: StakingPoolContextType
) {

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