// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyTuple } from '@polkadot/types/types';
import { amountToHuman } from '../../../util/amountToHuman';
import { Section, SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Row2 } from '../../components';
import type { PalletConvictionVotingVoteVoting } from '@polkadot/types/lookup';
import { getConviction, getVoteType } from '../../../util/governance';

type Props = {
  decimal: number;
  token: string; args: AnyTuple;
}

export const Vote: SnapComponent<Props> = ({ decimal, token, args }) => {
  const refId = String(args[0]);
  const vote = args[1] as PalletConvictionVotingVoteVoting;
  const type = getVoteType(vote);

  if (vote.isStandard) {
    const conviction = getConviction(vote.asStandard.vote);

    return (
      <Section>
        <Row2
          label='Referendum'
          labelSize='sm'
          value={refId}
        />
        <Row2
          label='Amount'
          labelSize='sm'
          value={`${amountToHuman(vote.asStandard.balance, decimal)} ${token}`}
        />
        <Row2
          label='Vote'
          labelSize='sm'
          value={type || 'Unknown'}
        />
        <Row2
          label='Conviction'
          labelSize='sm'
          value={String(conviction)}
        />
      </Section>
    );
  }

  if (vote.isSplit) {

    return (
      <Section>
        <Row2
          label='Referendum'
          labelSize='sm'
          value={refId}
        />
        <Row2
          label='Vote'
          labelSize='sm'
          value={type || 'Unknown'}
        />
        <Row2
          label='Aye'
          labelSize='sm'
          value={`${amountToHuman(vote.asSplit.aye, decimal)} ${token}`}
        />
        <Row2
          label='Nay'
          labelSize='sm'
          value={`${amountToHuman(vote.asSplit.nay, decimal)} ${token}`}
        />
      </Section>
    );
  }

  if (vote.isSplitAbstain) {

    return (
      <Section>
        <Row2
          label='Referendum'
          labelSize='sm'
          value={refId}
        />
        <Row2
          label='Vote'
          labelSize='sm'
          value={type || 'Unknown'}
        />
        <Row2
          label='Abstain'
          labelSize='sm'
          value={`${amountToHuman(vote.asSplitAbstain.abstain, decimal)} ${token}`}
        />
        <Row2
          label='Aye'
          labelSize='sm'
          value={`${amountToHuman(vote.asSplitAbstain.aye, decimal)} ${token}`}
        />
        <Row2
          label='Nay'
          labelSize='sm'
          value={`${amountToHuman(vote.asSplitAbstain.nay, decimal)} ${token}`}
        />
      </Section>
    );
  }
};
