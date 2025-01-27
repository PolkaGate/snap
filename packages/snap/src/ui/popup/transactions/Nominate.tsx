// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyTuple } from '@polkadot/types/types';
import { Address, Section, SnapComponent, Text } from '@metamask/snaps-sdk/jsx';

type Props = {
  args: AnyTuple;
}

export const Nominate: SnapComponent<Props> = ({ args }) => {

  const validators = String(args[0]);
  const addresses = validators
    .replace(/[\[\]]/g, "")
    .split(", ")
    .map(addr => addr.trim());

  return (
    <Section>
      <Text color='muted' size='sm'>
        Validators
      </Text>

      {addresses.map((address) => (
        <Address address={`polkadot:91b171bb158e2d3848fa23a9f1c25182:${address}`} />
      ))}
    </Section>
  );
};
