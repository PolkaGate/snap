// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Footer, Button, Field, RadioGroup, Radio, Section, Form } from "@metamask/snaps-sdk/jsx";
import { Payee, StakingSoloContextType } from "../../types";
import { RewardsDestinationOptions } from "./types";
import { Row2 } from "../../components/Row2";
import { amountToHuman } from "../../../../util/amountToHuman";
import { Balance } from "@polkadot/types/interfaces";
import { PayoutAccount } from "./component/PayoutAccount";
import { GET_PAYEE_OUTPUT_TYPE, getPayee } from "./util/getPayee";
import { FlowHeader } from "../../../components/FlowHeader";

const makePayee = (value: string | undefined): Payee | undefined => {
  if (value === 'restakeRewards') {
    return 'Staked';
  }

  if (value === 'transferRewardsToAccount') {
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
      ui: ui(context, payee, fee, maybeNew),
    },
  });
}

const ui = (context: StakingSoloContextType, payee: Payee, fee: Balance, maybeNew: Payee | undefined) => {

  const { address, genesisHash, decimal, price, token } = context;

  const initialOption = payee === 'Staked' ? 'restakeRewards' : 'transferRewardsToAccount';
  const maybeNewOption = maybeNew && (maybeNew === 'Staked' ? 'restakeRewards' : 'transferRewardsToAccount');
  const isContinueDisabled = !maybeNewOption || initialOption === maybeNewOption;
  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  const showPayoutAccount = !maybeNewOption ? initialOption === 'transferRewardsToAccount' : maybeNewOption === 'transferRewardsToAccount';

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
        <Section>
          <Form name="rewardsDestinationForm">
            <Field label="Rewards destination">
              <RadioGroup name="rewardsDestinationOptions" value={maybeNewOption || initialOption}>
                <Radio value="restakeRewards">
                  Restake rewards
                </Radio>
                <Radio value="transferRewardsToAccount">
                  Transfer to account
                </Radio>
              </RadioGroup>
            </Field>
          </Form>
        </Section>
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