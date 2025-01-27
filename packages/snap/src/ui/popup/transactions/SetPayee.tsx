// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyTuple } from '@polkadot/types/types';
import { Section, SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Row2 } from '../../components';

type Props = {
  args: AnyTuple;
}

export const SetPayee: SnapComponent<Props> = ({ args }) => {

  const payee = String(args[0]);

  return (
    <Section>
      <Row2
        label='Payee'
        labelSize='sm'
        value={payee}
      />
    </Section>
  );
};
