// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  divider,
  heading,
  row,
  text,
} from '@metamask/snaps-sdk';

import { formatCamelCase } from '../../util/formatCamelCase';

export const txHeader = (
  method: string,
  origin: string,
  section: any,
) => {
  const headingText = `Transaction Approval Request from ${origin}`;

  return [
    heading(headingText),
    divider(),
    row(
      'Action: ',
      text(
        `**${formatCamelCase(section) ?? ''}** (**${formatCamelCase(method) ?? ''}**)`,
      ),
    ),
    divider(),
  ]
};
