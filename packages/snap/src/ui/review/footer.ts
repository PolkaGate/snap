// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  RowVariant,
  divider,
  row,
  text,
} from '@metamask/snaps-sdk';
import type { Balance } from '@polkadot/types/interfaces';

import getChainLogoSvg from '../../util/getChainLogoSvg';

export const sanitizeText = (text?: string) => {
  // To replace text formatted like a link [A](B) with an something different like (A)(B)
  return text?.replace(/\[(.*?)\]\((.*?)\)/g, '($1)($2)');
};

export const txFooter = (
  docs: string,
  chainName: string | undefined,
  partialFee?: Balance,
) => {
  const chainLogoSvg = getChainLogoSvg(chainName ||'');

  const _rest = [
    divider(),
    row('Chain Name:', text(`**${chainName ?? ''}**`)),
    // divider(),
    // row('Chain Logo:', image(chainLogoSvg)), // uncomment when image size adjustment will be enabled by Metamask
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
