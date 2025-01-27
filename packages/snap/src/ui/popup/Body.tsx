// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyTuple } from '@polkadot/types/types';
import { Section, SnapComponent, Text } from '@metamask/snaps-sdk/jsx';
import { Bond, Nominate, PoolBondExtra, SetPayee, Transfer, Unbond, Vote } from './transactions';
import { Join } from './transactions/Join';
import type { Decoded } from '../../util/decodeTxMethod';

type Props = {
  decimal: number;
  token: string;
  args: AnyTuple;
  action: string;
  decoded: Decoded;
  maybeReceiverIdentity?: string | null;
}

export const KNOWN_METHODS = [
  'balances_transfer',
  'balances_transferKeepAlive',
  'balances_transferAll',
  'staking_bond',
  'staking_nominate',
  'nominationPools_unbond',
  'staking_unbond',
  'staking_bondExtra',
  'staking_setPayee',
  'nominationPools_join',
  'nominationPools_bondExtra',
  'convictionVoting_vote',
];

export const Body: SnapComponent<Props> = ({ token, decimal, args, action, decoded, maybeReceiverIdentity }) => {
  const isNoArgsMethod = args?.length === 0 && 'noArgsMethods';
  const decodedArgs = decoded?.args;

  switch (isNoArgsMethod || action) {
    case 'balances_transfer':
    case 'balances_transferKeepAlive':
    case 'balances_transferAll':
      return <Transfer
        decimal={decimal}
        token={token}
        args={args}
        maybeReceiverIdentity={maybeReceiverIdentity}
      />

    case 'staking_bond':
      return <Bond
        decimal={decimal}
        token={token}
        args={args}
      />

    case 'staking_nominate':
      return <Nominate
        args={args}
      />

    case 'nominationPools_unbond':
    case 'staking_unbond':
    case 'staking_bondExtra':
      return <Unbond
        decimal={decimal}
        token={token}
        args={args}
        action={action}
      />

    case 'staking_setPayee':
      return <SetPayee
        args={args}
      />

    case 'nominationPools_join':
      return <Join
        decimal={decimal}
        token={token}
        args={args}
      />

    case 'nominationPools_bondExtra':
      return <PoolBondExtra
        decimal={decimal}
        token={token}
        args={args}
      />

    case 'convictionVoting_vote':
      return <Vote
        decimal={decimal}
        token={token}
        args={args}
      />

    case 'noArgsMethods':
      return [];

    default:
      return (
        <Section>
          <Text color='muted' size='sm'>
            Details
          </Text>
          <Text>
            {JSON.stringify(decodedArgs || args, null, 2)}
          </Text>
        </Section>
      )
  }
};
