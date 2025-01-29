// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Footer, Button, Image, Section } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { getBalances, getKeyPair } from "../../../../util";
import { StakeForm } from "../../components/StakeForm";
import { Row2 } from "../../../components/Row2";
import { StakeFormErrors, StakingSoloContextType } from "../../types";
import { BN, BN_ZERO } from "@polkadot/util";
import { getSoloStakeMore } from "./util/getSoloStakeMore";
import { amountToMachine } from "../../../../util/amountToMachine";
import { birdUp } from "../../../image/icons";
import { SoloStakeMoreExtraInfo } from "./component/SoloStakeMoreExtraInfo";
import { isEmptyObject } from "../../../../utils";
import { OUTPUT_TYPE } from "../../../../constants";
import { FlowHeader } from "../../../components/FlowHeader";

const ui = (
  amount: string | undefined,
  decimal: number,
  formErrors: StakeFormErrors,
  logo: string,
  token: string,
  transferable: number,
  price: number,
  fee: BN,
) => {

  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  return (
    <Container>
      <Box>
        <FlowHeader
          action='stakeSoloIndex'
          label='Stake more'
          showHome
          tooltipType='staking'
        />
        <StakeForm
          amount={amount}
          decimal={decimal}
          formErrors={formErrors}
          logo={logo}
          name='stakeMoreAmountSolo'
          placeHolder="0"
          token={token}
          transferable={transferable}
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
        <Button name='soloStakeMoreReview' disabled={!Number(amount) || !isEmptyObject(formErrors)}>
          Continue
        </Button>
      </Footer>
    </Container >
  );
};

export async function soloStakeMore(
  id: string,
  formAmount: string | undefined,
  formErrors: StakeFormErrors,
  context: StakingSoloContextType,
) {

  const { address, amount, decimal, genesisHash, logos, price, token, transferable } = context;
  const _amount = formAmount !== undefined ? String(formAmount) : amount;

  const _address = address || (await getKeyPair(undefined, genesisHash)).address;
  const _logo = logos.find((logo) => logo.genesisHash === genesisHash)?.logo;

  let _transferable = transferable;
  let _token = token;
  let _decimal = decimal;

  if (!(_transferable || _decimal)) {
    const balances = await getBalances(genesisHash, _address)
    _transferable = balances.transferable.toNumber();
    _token = balances.token;
    _decimal = balances.decimal;
  }

  const fee = context.fee || await getSoloStakeMore(address, amountToMachine(amount, decimal) || BN_ZERO, genesisHash, OUTPUT_TYPE.FEE);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      context: {
        ...(context ?? {}),
        address: _address,
        amount: _amount,
        decimal: _decimal!,
        genesisHash,
        fee: String(fee),
        logo: _logo,
        transferable: _transferable!,
        token: _token!,
      },
      id,
      ui: ui(_amount, _decimal, formErrors, _logo, _token, _transferable, price, fee),
    },
  });
}