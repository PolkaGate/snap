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
import type { ApiPromise } from '@polkadot/api';
import type { Balance } from '@polkadot/types/interfaces';
import type { SignerPayloadJSON } from '@polkadot/types/types';

import { txBody } from './txBody';
import type { Decoded } from '../../rpc';
import { formatCamelCase } from '../../util/formatCamelCase';
import getChainName from '../../util/getChainName';
import getChainLogoSvg from '../../util/getChainLogoSvg';

export const txHeaderUseApi = (
  api: ApiPromise,
  origin: string,
  payload: SignerPayloadJSON,
  partialFee: Balance,
  decoded: Decoded,
  maybeReceiverIdentity: string | null,
) => {
  const headingText = `Transaction Approval Request from ${origin}`;

  const { args, callIndex } = api.createType('Call', payload.method);
  const { method, section } = api.registry.findMetaCall(callIndex);

  const decimal = api.registry.chainDecimals[0];
  const token = api.registry.chainTokens[0];

  const action = `${section}_${method}`;
  const chainName = getChainName(payload.genesisHash);

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
    row('Estimated Fee:', text(`**${partialFee.toHuman()}**`)),
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
    ...txBody(decimal, token, args, action, decoded, maybeReceiverIdentity),
    ...footer,
  ]);
};
