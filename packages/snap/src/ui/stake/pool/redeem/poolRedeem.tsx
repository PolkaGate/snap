// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Section, Text, Footer, Button, Heading, Image } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { StakeFlowHeader } from "../../components/StakeFlowHeader";
import { Balance } from "@polkadot/types/interfaces";
import { Row2 } from "../../components/Row2";
import { StakingInitContextType } from "../../types";
import { BN } from "@polkadot/util";
import { birdDown } from "../../../image/icons";
import { getRedeem } from "./util/getRedeem";

export async function poolRedeem(
  id: string,
  context: StakingInitContextType,
) {

  let { address, redeemable, decimal, token, price, genesisHash } = context;

  const fee = await getRedeem(address, genesisHash)

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(redeemable, decimal, token, price, fee),
      context: {
        ...(context || {}),
      }
    },
  });
}

const ui = (
  redeemable: string | undefined,
  decimal: number,
  token: string,
  price: number,
  fee: Balance
) => {

  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;
  const amount = new BN(redeemable);

  return (
    <Container>
      <Box>
        <StakeFlowHeader
          action='stakeDetailsPool'
          label='Redeem'
          showHome
          isSubAction
        />
        <Box direction="vertical" alignment="center" center>
          <Heading size="lg">
            {`${amountToHuman(amount, decimal, 4, true)} ${token}`}
          </Heading>
          <Text color="muted">
            ${(Number(amountToHuman(amount, decimal) || 0) * price).toFixed(2)}
          </Text>
        </Box>
        <Section>
          <Row2
            label=' Network fee'
            value={`${amountToHuman(String(fee), decimal, 4, true)} ${token}`}
            extra={`$${feeInUsd.toFixed(2)}`}
          />
        </Section>
        <Box direction="horizontal" alignment="end" center>
          <Image src={birdDown} />
        </Box>
      </Box>
      <Footer>
        <Button name='poolRedeemConfirm'>
          Confirm
        </Button>
      </Footer>
    </Container >
  );
};