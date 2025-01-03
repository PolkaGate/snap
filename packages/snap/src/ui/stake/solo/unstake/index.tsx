// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Footer, Button, Section } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { getBalances, getKeyPair } from "../../../../util";
import { Row2 } from "../../components/Row2";
import { StakeFormErrors, StakingSoloContextType } from "../../types";
import { BN, BN_ZERO } from "@polkadot/util";
import { amountToMachine } from "../../../../util/amountToMachine";
import { UnstakeForm } from "../../components/UnstakeForm";
import { getStakingInfo } from "../../utils/getStakingInfo";
import { Balance } from "@polkadot/types/interfaces";
import { SoloUnstakeExtraInfo } from "./component/SoloUnstakeExtraInfo";
import { isEmptyObject } from "../../../../utils";
import { getSoloUnstake } from "./util/getSoloUnstake";
import { OUTPUT_TYPE } from "../../../../constants";
import { FlowHeader } from "../../../components/FlowHeader";

export async function soloUnstake(
  id: string,
  formAmount: string | undefined,
  formErrors: StakeFormErrors,
  context: StakingSoloContextType,
) {

  const { address, active, amount, decimal, genesisHash, logos, price, token, transferable } = context;
  const _amount = formAmount !== undefined ? formAmount : amount;

  const netStaked = new BN(active || 0);
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

  const fee = context.fee || await getSoloUnstake(address, _amount || '0', genesisHash, OUTPUT_TYPE.FEE);
  const stakingInfo = context.stakingInfo || await getStakingInfo(genesisHash);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      context: {
        ...(context || {}),
        address: _address,
        ...stakingInfo,
        amount: _amount,
        decimal: _decimal!,
        genesisHash,
        fee: String(fee),
        logo: _logo,
        price,
        transferable: _transferable!,
        token: _token!,
      },
      id,
      ui: ui(_amount, _decimal, formErrors, _logo, netStaked, _token, price, fee, stakingInfo.unbondingDuration),
    },
  });
}

const ui = (
  amount: string | undefined,
  decimal: number,
  formErrors: StakeFormErrors,
  logo: string,
  netStaked: BN,
  token: string,
  price: number,
  fee: string | Balance,
  unbondingDuration: number,
) => {

  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  return (
    <Container>
      <Box>
        <FlowHeader
          action='stakeDetailsSolo'
          label='Unstake'
          showHome
          tooltipType='staking'
        />
        <UnstakeForm
          amount={amount}
          decimal={decimal}
          formErrors={formErrors}
          logo={logo}
          name='soloUnstakeAmount'
          placeHolder="0"
          token={token}
          staked={netStaked}
          price={price}
        />
        <Section>
          <Row2
            label='Network fee'
            value={`${amountToHuman(String(fee), decimal, 4, true)} ${token}`}
            extra={`$${feeInUsd.toFixed(2)}`}
          />
        </Section>
        <SoloUnstakeExtraInfo
          unbondingDuration={unbondingDuration}
        />
      </Box>
      <Footer>
        <Button name='soloUnstakeReview' disabled={!Number(amount) || !isEmptyObject(formErrors)}>
          Continue
        </Button>
      </Footer>
    </Container >
  );
};