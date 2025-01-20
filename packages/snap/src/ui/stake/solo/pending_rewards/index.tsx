// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Footer, Button } from "@metamask/snaps-sdk/jsx";
import { StakingSoloContextType } from "../../types";
import { BN, BN_ZERO } from "@polkadot/util";
import { FlowHeader } from "../../../components/FlowHeader";
import getPendingRewards, { PendingRewardsOutput } from "./util/getPendingRewards";
import { RewardsTable } from "./components/RewardsTable";
import { PendingRewardsBanner } from "./components/PendingRewardsBanner";
import { NoPendingRewards } from "./components/NoPendingRewards";

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
      if (selectedPayouts?.includes(searchKey)) {
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

  return (
    <Container>
      <Box>
        <FlowHeader
          action='stakeSoloIndex'
          label='Pending rewards'
          showHome
        />
        <PendingRewardsBanner />
        {unpaidRewards?.info
          ? <RewardsTable
            context={context}
            unpaidRewards={unpaidRewards}
            selectedPayouts={selectedPayouts}
            selectedAmount={selectedAmount}
          />
          : <NoPendingRewards />
        }
      </Box>
      <Footer>
        <Button name='payoutReview' disabled={!selectedAmount || selectedAmount?.isZero()}>
          Continue
        </Button>
      </Footer>
    </Container >
  );
};
