// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Section, Footer, Button, Image } from "@metamask/snaps-sdk/jsx";
import type { Balance } from "@polkadot/types/interfaces";
import { getKeyPair } from "../../../util";
import { getReviveMapAccount } from "./getReviveMapAccount";
import { HexString } from "@polkadot/util/types";
import { amountToHuman } from "../../../util/amountToHuman";
import { FlowHeader } from "../../components/FlowHeader";
import { Account } from "../../components/Account";
import { Row2 } from "../../components";
import { birdDown } from "../../image/icons";
import { getNativeTokenPrice } from "../../../util/getNativeTokenPrice";
import getChainName from "../../../util/getChainName";
import { Network } from "../../components/Network";

const ui = (
  address: string,
  chainName:string,
  context: { genesisHash: HexString },
  decimal: number,
  fee: Balance,
  price: number,
  token: string
) => {

  let { genesisHash } = context;

  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  return (
    <Container>
      <Box>
        <FlowHeader
          action='register'
          label='Register'
          showHome
        />
        <Section>
          <Account
            address={address}
            genesisHash={genesisHash}
          />
        </Section>
        <Section>
          <Network
            chainName={chainName}
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
        <Button name='registerAccountConfirm'>
          Confirm
        </Button>
      </Footer>
    </Container >
  );
};

export async function reviewRegisterAccount(
  id: string,
  context: any,
) {

  let { genesisHash } = context;
  const { address } = await getKeyPair();

  const { fee, decimal, token } = await getReviveMapAccount(address, genesisHash) as Balance;

  const { price } = await getNativeTokenPrice(genesisHash);
  const chainName = await getChainName(genesisHash);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(address, chainName, context, decimal, fee, price.value, token),
      context: {
        ...(context ?? {}),
        address,
        chainName,
        price,
        decimal,
        token
      }
    },
  });
}