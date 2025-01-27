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
}

export const Join: SnapComponent<Props> = ({   decimal,  token, args }) => {
  const  amount = String(args[0]);
  const poolId = String(args[1]);
  
  return (
    <Section>
      <Row2
        label='Amount'
        labelSize='sm'
        value={`${amountToHuman(amount, decimal, 4, true)} ${token}`}
      />
      <Row2
        label='Pool Id'
        labelSize='sm'
        value={poolId}
        />
    </Section>
  );
};
