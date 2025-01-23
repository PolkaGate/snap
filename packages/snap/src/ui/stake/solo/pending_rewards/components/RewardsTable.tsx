// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Section, Text, Tooltip, Icon, Checkbox, Form, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../../util/amountToHuman";
import { StakingSoloContextType } from "../../../types";
import { BN } from "@polkadot/util";
import { PendingRewardsOutput } from "../util/getPendingRewards";
import { eraToRemaining } from "../util/utils";
import { STAKED_AMOUNT_DECIMAL_POINT } from "../../../const";

interface Props {
  context: StakingSoloContextType,
  unpaidRewards: PendingRewardsOutput | undefined,
  selectedPayouts: string[] | undefined,
  selectedAmount: BN
}

export const RewardsTable: SnapComponent<Props> = ({ context, unpaidRewards, selectedPayouts, selectedAmount }) => {
  let { decimal, token } = context;
  const totalRewardsCount = Object.values(unpaidRewards?.info || {}).reduce((total, rewards) => {
    return total + Object.keys(rewards).length;
  }, 0);

  const isAllSelected = selectedPayouts && selectedPayouts.length === totalRewardsCount;

  return (
    <Box>
      {/* header */}
      <Form name="selectAllToPayOutForm">
        <Box direction="horizontal" alignment="space-between">
          <Box direction="horizontal" alignment="start">
            <Checkbox name='selectAllToPayOut' checked={!!isAllSelected} />
            <Text color='muted' size="sm">
              REWARD
            </Text>
          </Box>

          <Text color='muted' size="sm">
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
        <Text color='muted' size="sm">
          SELECTED:
        </Text>
        <Text color='muted'>
          {`${amountToHuman(String(selectedAmount), decimal, 4, true)} ${token}`}
        </Text>
      </Section>
    </Box>
  );
}