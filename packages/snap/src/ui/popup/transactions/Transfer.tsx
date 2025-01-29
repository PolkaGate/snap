// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyTuple } from '@polkadot/types/types';
import { amountToHuman } from '../../../util/amountToHuman';
import { Address, Box, Section, SnapComponent, Text } from '@metamask/snaps-sdk/jsx';
import { Row2 } from '../../components';

type Props = {
  decimal: number;
  token: string;
  args: AnyTuple;
  maybeReceiverIdentity?: string | null;
}

export const Transfer: SnapComponent<Props> = ({ token, decimal, args, maybeReceiverIdentity }) => {

  const amount = String(args[1]);
  const to = `${args[0]}`;

  return (
    <Section>
      <Row2
        label='Amount'
        labelSize='sm'
        value={`${amountToHuman(amount, decimal, 4, true)} ${token}`}
      />
      <Box direction='horizontal' alignment='space-between'>
        <Text color='muted' size='sm'>
          To
        </Text>
        {maybeReceiverIdentity
          ? <Text>
            {maybeReceiverIdentity}
          </Text>
          : <Address address={`polkadot:91b171bb158e2d3848fa23a9f1c25182:${to}`} />
        }
      </Box>
    </Section>
  );
};
