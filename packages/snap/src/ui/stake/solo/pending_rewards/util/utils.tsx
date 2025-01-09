// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN, BN_ONE } from "@polkadot/util";
import { PendingRewardsOutput } from "./getPendingRewards";
import blockToDate from "./blockToDate";

const calculateEndEraInBlock = (era: number, unpaidRewards: PendingRewardsOutput): BN | undefined => {
  if (!unpaidRewards?.extra) {
    return undefined;
  }

  const { progress, forcing, historyDepth, currentBlock } = unpaidRewards.extra;

  if (!(currentBlock && historyDepth && era && forcing && progress && progress.sessionLength.gt(BN_ONE))) {
    return undefined;
  }

  return (
    (forcing.isForceAlways ? progress.sessionLength : progress.eraLength)
      .mul(historyDepth.sub(progress.activeEra).addn(era).add(BN_ONE))
      .sub(forcing.isForceAlways ? progress.sessionProgress : progress.eraProgress)
  );
};

export const eraToDate = (era: number, unpaidRewards: PendingRewardsOutput): string | undefined => {
  const EndEraInBlock = calculateEndEraInBlock(era, unpaidRewards);

  if (!EndEraInBlock) {
    return undefined;
  }

  return blockToDate(EndEraInBlock.addn(unpaidRewards.extra.currentBlock).toNumber(), unpaidRewards.extra.currentBlock, { day: 'numeric', month: 'short' });
};

export const eraToRemaining = (era: number, unpaidRewards: PendingRewardsOutput): string | undefined => {
  const EndEraInBlock = calculateEndEraInBlock(era, unpaidRewards);

  if (!EndEraInBlock) {
    return undefined;
  }

  const remainingBlocks = EndEraInBlock.addn(unpaidRewards.extra.currentBlock).subn(unpaidRewards.extra.currentBlock).toNumber();
  const remainingMillis = remainingBlocks * 6000; // Convert blocks to milliseconds
  const remainingSeconds = Math.floor(remainingMillis / 1000);

  if (remainingSeconds <= 0) {
    return 'Expired';
  }

  const days = Math.floor(remainingSeconds / (3600 * 24));
  const hours = Math.floor((remainingSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
};