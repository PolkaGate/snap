import { Box, Container, Section, Text, Footer, Button, Heading } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../util/amountToHuman";
import { Balance } from "@polkadot/types/interfaces";
import { getStakingFee } from "./utils/getStakingFee";
import { Row2 } from "./components/Row2";
import { StakingInitContextType } from "./types";
import { Account } from "../components/Account";
import { FlowHeader } from "../components/FlowHeader";
import { ellipsis } from "./utils/ellipsis";
import { MAX_POOL_NAME_TO_SHOW } from "./const";

export async function stakeFirstTimeReview(
  id: string,
  context: StakingInitContextType
) {


  let { address, amount, genesisHash, stakingData } = context;
  const fee = await getStakingFee(address, amount, genesisHash, stakingData)

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(fee, context),
      context: {
        ...(context || {})
      }
    },
  });
}

const ui = (
  fee: Balance,
  context: StakingInitContextType,
) => {

  let { address, amount, decimal, genesisHash, token, price, stakingData, DEFAULT_STAKING_DATA } = context;

  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  return (
    <Container>
      <Box>
        <FlowHeader
          action='stakeInit'
          label='Start staking'
          showHome
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
            value={`${amountToHuman(String(fee), decimal, 4, true)} ${token}`}
            extra={`$${feeInUsd.toFixed(2)}`}
          />
        </Section>
        <Section>
          <Row2
            label='Staking type'
            value={`${stakingData.type} staking`}
          />
          {stakingData.type === 'Pool'
            ? <Row2
              label='Pool'
              value={ellipsis(stakingData?.pool?.name || 'Unknown', MAX_POOL_NAME_TO_SHOW)}
            />
            : <Row2
              label='Validators'
              value={`${stakingData.solo.validators.length} (max ${DEFAULT_STAKING_DATA.solo.validators.length})`}
            />
          }
        </Section>
      </Box>
      <Footer>
        <Button name='stakeConfirm'>
          Confirm
        </Button>
      </Footer>
    </Container >
  );
};