
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from "@polkadot/util/types";
import { SendContextType } from "./types";
import { amountToHuman } from "../../util/amountToHuman";
import { FlowHeader } from "../components/FlowHeader";
import { Box, Button, Container, Footer, Heading, Section } from "@metamask/snaps-sdk/jsx";
import { Account } from "../components/Account";
import { Row2 } from "../components/Row2";
import { Network } from "../components/Network";
import getChainName from "../../util/getChainName";
import { Price } from "../components";

const ui = (
  amount: string,
  chainName: string,
  context: SendContextType,
  genesisHash: HexString,
  recipient: string
) => {
  const { address, price, decimal, token, fee } = context;

  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  return (
    <Container>
      <Box>
        <FlowHeader
          action='send'
          label='Send'
          tooltipType='send'
        />
        <Box direction="vertical" alignment="center" center>
          <Heading size="lg">
            {`- ${amount} ${token}`}
          </Heading>
          <Price
            amount={amount}
            price={price}
          />
        </Box>
        <Section>
          <Network
            chainName={chainName}
          />
          <Account
            label='Sender'
            address={address}
            genesisHash={genesisHash}
          />
          <Row2
            label='Network fee'
            value={`${amountToHuman(fee, decimal, 4, true)} ${token}`}
            extra={`$${feeInUsd.toFixed(2)}`}
          />
        </Section>
        <Section>
          <Account
            label='Recipient'
            address={recipient}
            genesisHash={genesisHash}
          />
        </Section>
      </Box>
      <Footer>
        <Button name="sendConfirm">
          Confirm
        </Button>
      </Footer>
    </Container>
  )
};

export async function reviewSend(id: string, genesisHash: HexString, amount: string, recipient: string, context: SendContextType) {
  const chainName = await getChainName(genesisHash, true);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(amount, chainName, context, genesisHash, recipient),
      context: {
        ...(context ?? {}),
        genesisHash,
      }
    },
  });
};