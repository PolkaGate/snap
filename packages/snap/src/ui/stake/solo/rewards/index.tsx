// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Footer, Button, Section } from "@metamask/snaps-sdk/jsx";
import { Payee, StakingSoloContextType } from "../../types";
import { RewardsDestinationOptions } from "./types";
import { Row2 } from "../../components/Row2";
import { amountToHuman } from "../../../../util/amountToHuman";
import { Balance } from "@polkadot/types/interfaces";
import { PayoutAccount } from "./component/PayoutAccount";
import { GET_PAYEE_OUTPUT_TYPE, getPayee } from "./util/getPayee";
import { FlowHeader } from "../../../components/FlowHeader";
import { Options } from "../../../components/Options";

const makePayee = (value: string | undefined): Payee | undefined => {
  if (value === 'restakeRewards') {
    return 'Staked';
  }

  if (value === 'sendToAccount') {
    return 'Stash';
  }

  // if (newAccount) {
  //   return { Account: newAccount };
  // }

  return undefined;
}

export async function rewardsDestination(
  id: string,
  context: StakingSoloContextType,
  selectedRewardsDestinationOption: RewardsDestinationOptions,
) {

  const { address, genesisHash } = context;

  const { payee, fee } = context?.payee?.initial && context?.fee
    ? { payee: context.payee.initial, fee: context.fee }
    : await getPayee(address, genesisHash, GET_PAYEE_OUTPUT_TYPE.FEE_AND_PAYEE);

  const maybeNew = makePayee(selectedRewardsDestinationOption);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      context: {
        ...(context || {}),
        payee: { maybeNew, initial: payee },
        fee: fee,
      },
      id,
      ui: ui(context, payee, fee, maybeNew, selectedRewardsDestinationOption),
    },
  });
}

const ui = (context: StakingSoloContextType, payee: Payee, fee: Balance, maybeNew: Payee | undefined, selectedRewardsDestinationOption: RewardsDestinationOptions) => {

  const { address, genesisHash, decimal, price, token } = context;

  const initialOption = payee === 'Staked' ? 'restakeRewards' : 'sendToAccount';
  const maybeNewOption = maybeNew && (maybeNew === 'Staked' ? 'restakeRewards' : 'sendToAccount');
  const isContinueDisabled = !maybeNewOption || initialOption === maybeNewOption;
  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  const showPayoutAccount = !maybeNewOption ? initialOption === 'sendToAccount' : maybeNewOption === 'sendToAccount';

  return (
    <Container>
      <Box>
        <FlowHeader
          action='stakeDetailsSolo'
          label='Rewards destination'
          showHome
          isSubAction
          tooltipType='staking'
        />
        <Options
          title='Rewards destination'
          text1='Restake rewards'
          text2='Send to account'
          description1='Compound rewards for higher returns'
          description2='Transfer rewards to your account'
          form='rewardsDestinationOptions'
          selectedOption={maybeNewOption || initialOption}
          optionNames={{
            1: 'restakeRewards',
            2: 'sendToAccount',
          }}
        />
        <PayoutAccount
          show={showPayoutAccount}
          genesisHash={genesisHash}
          address={address}
        />
        <Section>
          <Row2
            label='Network fee'
            value={`${amountToHuman(String(fee), decimal, 4, true)} ${token}`}
            extra={`$${feeInUsd.toFixed(2)}`}
          />
        </Section>
      </Box>
      <Footer>
        <Button name='rewardsDestinationReview' disabled={isContinueDisabled}>
          Continue
        </Button>
      </Footer>
    </Container >
  );
};