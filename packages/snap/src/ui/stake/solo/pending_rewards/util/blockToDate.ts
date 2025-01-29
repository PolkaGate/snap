// Copyright 2019-2025 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Converts a block number to a date, relative to the current block.
 * @param blockNumber - The block number to convert.
 * @param currentBlock - The current block number to calculate the difference.
 * @param option - Optional options for formatting the date.
 * @returns The formatted date or 'N/A' if input values are missing.
 */
export default function blockToDate (blockNumber?: number, currentBlock?: number, option?: Intl.DateTimeFormatOptions):string {
  if (!blockNumber || !currentBlock) {
    return 'N/A';
  }

  if (blockNumber >= currentBlock) {
    const time = (blockNumber - currentBlock) * 6000;
    const now = Date.now();

    return new Date(now + time).toLocaleDateString('en-US', option ?? { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const diff = (currentBlock - blockNumber) * 6000;
  const now = Date.now();

  return new Date(now - diff).toLocaleDateString('en-US', option ?? { day: 'numeric', month: 'short', year: 'numeric' });
}
