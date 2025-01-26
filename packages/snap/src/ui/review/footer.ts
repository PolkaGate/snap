// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  RowVariant,
  divider,
  row,
  text,
} from '@metamask/snaps-sdk';
import type { Balance } from '@polkadot/types/interfaces';

/**
 * Replaces text formatted like a link `[A](B)` with a different format `(A)(B)`.
 * @param str - The input string that may contain link-like formatted text.
 * @returns A sanitized string with the replaced format.
 */
export const sanitizeText = (str?: string): string | undefined => {
  return str?.replace(/\[(.*?)\]\((.*?)\)/g, '($1)($2)');
};

export const txFooter = (
  docs: string,
  chainName: string | undefined,
  partialFee?: Balance,
): unknown => {

  const _rest = [
    divider(),
    row('Chain Name:', text(`**${chainName ?? ''}**`)),
    divider(),
    row(
      'More info:',
      text(`**${sanitizeText(docs) ?? 'Update metadata to view this!'}**`),
      RowVariant.Default,
    ),
    row(
      'Warning:',
      text(`${'proceed only if you understand the details above!'}`),
      RowVariant.Warning,
    ),
  ]

  return partialFee
    ? [
      divider(),
      row('Estimated Fee:', text(`**${partialFee.toHuman()}**`)),
      ..._rest
    ]
    : [..._rest]
};
