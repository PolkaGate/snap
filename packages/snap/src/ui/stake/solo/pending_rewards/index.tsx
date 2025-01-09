// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Section, Text, Footer, Button, Image, Bold, Tooltip, Icon, Checkbox, Form } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { StakingSoloContextType } from "../../types";
import { BN, BN_ZERO } from "@polkadot/util";
import { calendar } from "../../../image/icons";
import { FlowHeader } from "../../../components/FlowHeader";
import getPendingRewards, { PendingRewardsOutput } from "./util/getPendingRewards";
import { STAKED_AMOUNT_DECIMAL_POINT } from "../../components/UnstakeForm";
import { eraToRemaining } from "./util/utils";

export async function pendingRewards(
  id: string,
  context: StakingSoloContextType,
  selectedPayouts: string[] | undefined
) {

  let { address, genesisHash, selectedPayouts: selectedPayoutsFromContext } = context;
  const _selectedPayouts = selectedPayouts || selectedPayoutsFromContext;

  const unpaidRewards = await getPendingRewards(address, genesisHash, !!selectedPayouts?.length);

  let selectedAmount = BN_ZERO;
  !!unpaidRewards?.info && Object.entries(unpaidRewards.info).map(([era, rewards]) => (
    Object.entries(rewards).map(([validator, [page, amount]]) => {
      const searchKey = `${validator},${Number(era)},${page}`;
      if(selectedPayouts?.includes(searchKey)){
        selectedAmount = selectedAmount.add(amount);
      }
    })
  ));

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(context, unpaidRewards, _selectedPayouts, selectedAmount),
      context: {
        ...(context || {}),
        selectedPayouts: _selectedPayouts,
        selectedAmountToPayout: selectedAmount.toString()
      }
    },
  });
}

const ui = (
  context: StakingSoloContextType,
  unpaidRewards: PendingRewardsOutput | undefined,
  selectedPayouts: string[] | undefined,
  selectedAmount: BN
) => {

  let { decimal, token } = context;

  const totalRewardsCount = Object.values(unpaidRewards?.info || {}).reduce((total, rewards) => {
    return total + Object.keys(rewards).length;
  }, 0);

  const isAllSelected = selectedPayouts && selectedPayouts.length === totalRewardsCount;

  return (
    <Container>
      <Box>
        <FlowHeader
          action='stakeDetailsSolo'
          label='Pending rewards'
          showHome
        />
        <Section>
          <Box direction='horizontal' alignment="space-between">
            <Box direction="vertical" alignment="start">
              <Text color='warning'>
                <Bold> Validators issue rewards every 2–3 days</Bold>
              </Text>
              <Text color='muted'>
                You can claim them before they expire, but a fee applies
              </Text>
            </Box>
            <Box direction="vertical" alignment="start">
              <Image src={calendar} />
            </Box>
          </Box>
        </Section>

        {/* header */}
        <Form name="selectAllToPayOutForm">
          <Box direction="horizontal" alignment="space-between">
            <Box direction="horizontal" alignment="start">
              <Checkbox name='selectAllToPayOut' checked={!!isAllSelected} />
              <Text color='muted'>
                REWARD
              </Text>
            </Box>

            <Text color='muted'>
              EXPIRES IN
            </Text>
          </Box>
        </Form>
        {/* body */}
        <Form name="payoutSelectionForm">
          <Section direction="vertical" alignment="start">
            {!!unpaidRewards?.info && Object.entries(unpaidRewards.info).map(([era, rewards]) => (
              <Box direction="vertical" alignment="start">
                {Object.entries(rewards).map(([validator, [page, amount]]) => {

                  const searchKey = `${validator},${Number(era)},${page}`;
                  const isSelected = selectedPayouts?.includes(searchKey);

                  return (
                    <Box direction="horizontal" alignment="space-between">
                      <Box direction="horizontal" alignment="space-between">
                        <Checkbox name={`selectedPendingReward,${validator},${Number(era)},${page}`} checked={!!isSelected} />
                        <Text>
                          {`${amountToHuman(amount, decimal, STAKED_AMOUNT_DECIMAL_POINT, true)} ${token}`}
                        </Text>
                      </Box>
                      <Box direction="horizontal" alignment="space-between">
                        <Text>
                          {`${eraToRemaining(Number(era), unpaidRewards) || 'Unknown'}`}
                        </Text>
                        <Tooltip content={`validator ${validator}, Era ${era}`}>
                          <Icon name='info' color='muted' />
                        </Tooltip>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            ))}
          </Section>
        </Form>

        <Section alignment="start" direction="horizontal">
          <Text color='muted'>
            SELECTED:
          </Text>
          <Text color='muted'>
            {`${amountToHuman(String(selectedAmount), decimal, 4, true)} ${token}`}
          </Text>
        </Section>
      </Box>
      <Footer>
        <Button name='payoutReview'>
          Continue
        </Button>
      </Footer>
    </Container >
  );
};