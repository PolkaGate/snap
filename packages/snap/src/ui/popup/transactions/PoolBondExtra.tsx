// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyTuple } from '@polkadot/types/types';
import { amountToHuman } from '../../../util/amountToHuman';
import { Section, SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Row2 } from '../../components';

type Props = {
  decimal: number;
  token: string;  args: AnyTuple;
}

export const PoolBondExtra: SnapComponent<Props> = ({   decimal, token, args }) => {
  let extra = String(args[0]);

  if (extra === 'Rewards') {
    extra = 'Rewards';
  } else {
    const { freeBalance } = JSON.parse(extra);
    extra = `${amountToHuman(freeBalance, decimal)} ${token}`;
  }

  return (
    <Section>
      <Row2
        label='Extra'
        labelSize='sm'
        value={extra}
      />
    </Section>
  );
};
