// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Footer, Button, Image, Section } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { getKeyPair } from "../../../../util";
import { StakeForm } from "../../components/StakeForm";
import { Row2 } from "../../../components/Row2";
import { StakeFormErrors, StakingSoloContextType } from "../../types";
import { BN, BN_ZERO } from "@polkadot/util";
import { getSoloRestake } from "./util/getSoloRestake";
import { amountToMachine } from "../../../../util/amountToMachine";
import { birdUp } from "../../../image/icons";
import { isEmptyObject } from "../../../../utils";
import { OUTPUT_TYPE } from "../../../../constants";
import { FlowHeader } from "../../../components/FlowHeader";
import { SoloStakeMoreExtraInfo } from "../stakeMore/component/SoloStakeMoreExtraInfo";

const ui = (
  amount: string | undefined,
  decimal: number,
  formErrors: StakeFormErrors,
  logo: string,
  token: string,
  unlocking: string,
  price: number,
  fee: BN,
) => {

  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  return (
    <Container>
      <Box>
        <FlowHeader
          action='stakeSoloIndex'
          label='Re-stake'
          showHome
          tooltipType='staking'
        />
        <StakeForm
          amount={amount}
          decimal={decimal}
          formErrors={formErrors}
          logo={logo}
          name='restakeAmountSolo'
          placeHolder="0"
          token={token}
          available={unlocking}
          price={price}
        />
        <Section>
          <Row2
            label='Network fee'
            value={`${amountToHuman(String(fee), decimal, 4, true)} ${token}`}
            extra={`$${feeInUsd.toFixed(2)}`}
          />
        </Section>
        <SoloStakeMoreExtraInfo />
        <Box direction="horizontal" alignment='start'>
          <Image src={birdUp} />
        </Box>
      </Box>
      <Footer>
        <Button name='soloRestakeReview' disabled={!Number(amount) || !isEmptyObject(formErrors)}>
          Continue
        </Button>
      </Footer>
    </Container >
  );
};

export async function soloRestake(
  id: string,
  formAmount: string | undefined,
  formErrors: StakeFormErrors,
  context: StakingSoloContextType,
) {

  const { address, amount, decimal, genesisHash, logos, price, token, unlocking } = context;
  const _amount = formAmount !== undefined ? String(formAmount) : amount;

  const _address = address || (await getKeyPair(undefined, genesisHash)).address;
  const _logo = logos.find((logo) => logo.genesisHash === genesisHash)?.logo;

  const fee = context.fee || await getSoloRestake(address, amountToMachine(amount, decimal) || BN_ZERO, genesisHash, OUTPUT_TYPE.FEE);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      context: {
        ...(context ?? {}),
        address: _address,
        amount: _amount,
        decimal,
        genesisHash,
        fee: String(fee),
        logo: _logo,
        unlocking,
        token,
      },
      id,
      ui: ui(_amount, decimal, formErrors, _logo, token, unlocking, price, fee),
    },
  });
}