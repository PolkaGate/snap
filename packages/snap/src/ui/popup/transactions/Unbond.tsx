// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyTuple } from '@polkadot/types/types';
import { amountToHuman } from '../../../util/amountToHuman';
import { Section, SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Row2 } from '../../components';

type Props = {
  decimal: number;
  token: string;
  args: AnyTuple;
  action: string
}

export const Unbond: SnapComponent<Props> = ({ token,decimal,args, action }) => {
  const index = action === 'nominationPools_unbond' ? 1 : 0;
  const amount = String(args[index]);

  return (
    <Section>
      <Row2
        label='Amount'
        labelSize='sm'
        value={`${amountToHuman(amount, decimal, 4, true)} ${token}`}
      />
    </Section>
  );
};
