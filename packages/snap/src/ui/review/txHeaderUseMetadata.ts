// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  RowVariant,
  divider,
  heading,
  panel,
  row,
  text,
} from '@metamask/snaps-sdk';
import type { SignerPayloadJSON } from '@polkadot/types/types';

import { txBody } from './txBody';
import type { Decoded } from '../../rpc';
import { formatCamelCase } from '../../util/formatCamelCase';
import getChainLogoSvg from '../../util/getChainLogoSvg';
import { Chain } from '@polkadot/extension-chains/types';

export const txHeaderUseMetadata = (
  chain: Chain,
  origin: string,
  payload: SignerPayloadJSON,
  decoded: Decoded,
) => {
  const headingText = `Transaction Approval Request from ${origin}.`;

  const registry = chain.registry;
  registry.setSignedExtensions(payload.signedExtensions, chain.definition.userExtensions);

  const { args, callIndex } = registry.createType('Call', payload.method);
  const { method, section } = registry.findMetaCall(callIndex);
  const { tokenDecimals: decimal, tokenSymbol: token } = chain;

  const action = `${section}_${method}`;
  const chainName = chain.name;

  const chainLogoSvg = getChainLogoSvg(payload.genesisHash);

  const header = [
    heading(headingText),
    divider(),
    row(
      'Action: ',
      text(
        `**${formatCamelCase(section) ?? ''}** (**${formatCamelCase(method) ?? ''
        }**)`,
      ),
    ),
    divider(),
  ];

  const footer = [
    divider(),
    row('Chain Name:', text(`**${formatCamelCase(chainName) ?? ''}**`)),
    // divider(),
    // row('Chain Logo:', image(chainLogoSvg)), // uncomment when image size adjustment will be enabled by Metamask
    divider(),
    row(
      'More info:',
      text(`**${decoded.docs || 'Update metadata to view this!'}**`),
      RowVariant.Default,
    ),
    row(
      'Warning:',
      text(`${'proceed only if you understand the details above!'}`),
      RowVariant.Warning,
    ),
  ];

  return panel([
    ...header,
    ...txBody(decimal, token, args, action, decoded),
    ...footer,
  ]);
};
