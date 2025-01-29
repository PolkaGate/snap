// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Section, Footer, Button, Heading, Image } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import type { Balance } from "@polkadot/types/interfaces";
import { Row2 } from "../../../components/Row2";
import { StakingSoloContextType } from "../../types";
import { BN } from "@polkadot/util";
import { birdDown } from "../../../image/icons";
import { getRedeemSolo } from "./util/getRedeemSolo";
import { Account } from "../../../components/Account";
import { SOLO_REDEEMABLE_DECIMAL } from "../../components/Redeemable";
import { FlowHeader } from "../../../components/FlowHeader";
import { Price } from "../../../components";

const ui = (
  context: StakingSoloContextType,
  fee: Balance
) => {

  let { address, redeemable, decimal, token, price, genesisHash } = context;

  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;
  const amount = new BN(redeemable!);

  return (
    <Container>
      <Box>
        <FlowHeader
          action='stakeSoloIndex'
          label='Redeem'
          showHome
        />
        <Box direction="vertical" alignment="center" center>
          <Heading size="lg">
            {`${amountToHuman(amount, decimal, SOLO_REDEEMABLE_DECIMAL, true)} ${token}`}
          </Heading>
          <Price
            amount={amount}
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
        <Button name='soloRedeemConfirm'>
          Confirm
        </Button>
      </Footer>
    </Container >
  );
};

export async function soloRedeem(
  id: string,
  context: StakingSoloContextType,
) {

  let { address, genesisHash } = context;

  const fee = await getRedeemSolo(address, genesisHash) as Balance;

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(context, fee),
      context: {
        ...(context ?? {}),
      }
    },
  });
}