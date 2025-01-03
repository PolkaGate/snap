// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Footer, Button, Image, Section } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { getBalances, getKeyPair } from "../../../../util";
import { getSnapState } from "../../../../rpc/stateManagement";
import { StakeForm } from "../../components/StakeForm";
import { Row2 } from "../../components/Row2";
import { StakeFormErrors, StakingPoolContextType } from "../../types";
import { BN, BN_ZERO } from "@polkadot/util";
import { getPoolStakeMoreFee } from "./util/getPoolStakeMoreFee";
import { amountToMachine } from "../../../../util/amountToMachine";
import { birdUp } from "../../../image/icons";
import { PoolStakeMoreExtraInfo } from "./PoolStakeMoreExtraInfo";
import { isEmptyObject } from "../../../../utils";
import { FlowHeader } from "../../../components/FlowHeader";

export async function poolStakeMore(
  id: string,
  formAmount: number | undefined,
  formErrors: StakeFormErrors,
  context: StakingPoolContextType,
) {

  const { address, amount, claimable, decimal, genesisHash, logos, price, rate, sanitizedChainName, stakingRates, token, transferable } = context;
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

  let _price = price;
  let _rate = rate;

  if (_price === undefined || !_rate) {
    const priceInfo = await getSnapState('priceInfo');

    _price = priceInfo?.prices?.[sanitizedChainName]?.value || 0;
    _rate = stakingRates?.[sanitizedChainName || ''] || 0;
  }

  const fee = context.fee || await getPoolStakeMoreFee(address, amountToMachine(amount, decimal) || BN_ZERO, genesisHash);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      context: {
        ...(context || {}),
        address: _address,
        amount: _amount,
        decimal: _decimal!,
        genesisHash,
        fee: String(fee),
        logo: _logo,
        price: _price!,
        transferable: _transferable!,
        token: _token!,
      },
      id,
      ui: ui(_amount, claimable, _decimal, formErrors, _logo, _token, _transferable, _price, fee),
    },
  });
}

const ui = (
  amount: string | undefined,
  claimable: string | undefined,
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
          action='stakeDetailsPool'
          label='Stake more'
          showHome
          tooltipType='staking'
        />
        <StakeForm
          amount={amount}
          decimal={decimal}
          formErrors={formErrors}
          logo={logo}
          name='stakeMoreAmount'
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
        <PoolStakeMoreExtraInfo
          claimable={claimable}
          decimal={decimal}
          token={token}
        />
        <Box direction="horizontal" alignment='start'>
          <Image src={birdUp} />
        </Box>
      </Box>
      <Footer>
        <Button name='poolStakeMoreReview' disabled={!Number(amount) || !isEmptyObject(formErrors)}>
          Continue
        </Button>
      </Footer>
    </Container >
  );
};