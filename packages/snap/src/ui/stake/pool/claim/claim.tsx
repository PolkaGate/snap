// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Section, Text, Footer, Button, Heading, Checkbox, Form, Image } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { Balance } from "@polkadot/types/interfaces";
import { Row2 } from "../../components/Row2";
import { StakingInitContextType } from "../../types";
import { BN } from "@polkadot/util";
import { birdDown } from "../../../image/icons";
import { getClaimFee } from "./util/getClaimFee";
import { Account } from "../../components/Account";
import { POOL_CLAIMABLE_DECIMAL } from "../components/ClaimRewards";
import { FlowHeader } from "../../../components/FlowHeader";

export async function claim(
  id: string,
  context: StakingInitContextType,
  restakeRewards?: boolean
) {

  let { address, genesisHash } = context;

  const fee = await getClaimFee(address, genesisHash, restakeRewards)

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(context, fee),
      context: {
        ...(context || {}),
        restakeRewards
      }
    },
  });
}

const ui = (
  context: StakingInitContextType,
  fee: Balance
) => {

  let { address, claimable, decimal, token, price, genesisHash } = context;
  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;
  const amount = new BN(claimable);

  return (
    <Container>
      <Box>
        <FlowHeader
          action='stakeDetailsPool'
          label='Claim rewards'
          showHome
          isSubAction
          tooltipType='staking'
        />
        <Box direction="vertical" alignment="center" center>
          <Heading size="lg">
            {`${amountToHuman(amount, decimal, POOL_CLAIMABLE_DECIMAL, true)} ${token}`}
          </Heading>
          <Text color="muted">
            ${(Number(amountToHuman(amount, decimal) || 0) * price).toFixed(2)}
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
          <Box direction="horizontal" alignment="space-between" center>
            <Box direction="vertical" alignment="start">
              <Text>
                Restake rewards
              </Text>
              <Text color="muted">
                Your tokens will return to stake
              </Text>
            </Box>
            <Form name="poolClaimableRestakeForm">
              <Checkbox name='restakeRewards' variant="toggle" />
            </Form>
          </Box>
        </Section>
        <Box direction="horizontal" alignment="end" center>
          <Image src={birdDown} />
        </Box>
      </Box>
      <Footer>
        <Button name='claimConfirm'>
          Confirm
        </Button>
      </Footer>
    </Container >
  );
};