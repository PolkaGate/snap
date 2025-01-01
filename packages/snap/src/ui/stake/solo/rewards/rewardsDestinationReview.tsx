// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Section, Footer, Button } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { Row2 } from "../../components/Row2";
import { StakingSoloContextType } from "../../types";
import { Account } from "../../components/Account";
import { FlowHeader } from "../../../components/FlowHeader";

export async function rewardsDestinationReview(
  id: string,
  context: StakingSoloContextType
) {

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(context),
      context: {
        ...(context || {})
      }
    },
  });
}

const ui = (context: StakingSoloContextType) => {

  let { address, decimal, genesisHash, token, price, fee, payee } = context;
  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;
  const destination = payee?.maybeNew === 'Staked' ? 'Restake rewards' : 'Transfer to account';

  return (
    <Container>
      <Box>
        <FlowHeader
          action='rewardsDestination'
          label='Rewards destination'
          showHome
          isSubAction
          tooltipType='staking'
        />
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
        <Section>
          <Row2
            label='Rewards destination'
            value={destination}
          />
          {payee?.maybeNew !== 'Staked' &&
            <Account
              address={address}
              genesisHash={genesisHash}
              label='Payout account'
            />
          }
        </Section>
      </Box>
      <Footer>
        <Button name='rewardsDestinationConfirm'>
          Confirm
        </Button>
      </Footer>
    </Container >
  );
};