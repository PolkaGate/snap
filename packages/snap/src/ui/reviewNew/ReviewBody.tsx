// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyTuple } from '@polkadot/types/types';
import { amountToHuman } from '../../util/amountToHuman';
import { Decoded } from '../../util/decodeTxMethod';
import { Address, Box, Row, Section, SnapComponent, Text } from '@metamask/snaps-sdk/jsx';

type Props = {
  decimal: number;
  token: string;
  args: AnyTuple;
  action: string;
  decoded: Decoded;
  maybeReceiverIdentity?: string | null;
}

export const ReviewBody: SnapComponent<Props> = ({ decimal, token, args, action, decoded, maybeReceiverIdentity }) => {

  let amount;
  const isNoArgsMethod = args?.length === 0 && 'noArgsMethods';
  const decodedArgs = decoded?.args;

  switch (isNoArgsMethod || action) {
    case 'balances_transfer':
    case 'balances_transferKeepAlive':
    case 'balances_transferAll':
      const to = `${args[0]}`;
      amount = String(args[1]);

      return (
        <Section>
          <Row label="Amount">
            <Text>
              {`${amountToHuman(amount, decimal, 4, true)} ${token}`}
            </Text>
          </Row>
          <Box direction='horizontal' alignment='space-between'>
            <Text>
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
    // case 'staking_bond':
    //   amount = `${args[0]}`;
    //   const payee = String(args[1]);

    //   return [
    //     row('Amount:', text(`**${amountToHuman(amount, decimal)} ${token}** `)),
    //     row('Payee:', text(`**${payee}** `)),
    //   ];
    // case 'staking_nominate':
    //   return [row('Validators:', text(`**${args[0]}**`))];

    // case 'nominationPools_unbond':
    // case 'staking_unbond':
    // case 'staking_bondExtra':
    //   amount = `${args[action === 'nominationPools_unbond' ? 1 : 0]}`;

    //   return [row('Amount:', text(`**${amountToHuman(amount, decimal)} ${token}**`))];

    // case 'staking_setPayee':
    //   return [row('Payee:', text(`**${args[0]}**`))];

    // case 'nominationPools_join':
    //   amount = `${args[0]}`;
    //   const poolId = String(args[1]);

    //   return [
    //     panel([
    //       row(
    //         'Amount:',
    //         text(`**${amountToHuman(amount, decimal)} ${token}**`),
    //       ),
    //       row('Pool Id:', text(`**${poolId}** `)),
    //     ]),
    //   ];
    // case 'nominationPools_bondExtra':
    //   let extra = String(args[0]);
    //   if (extra === 'Rewards') {
    //     extra = 'Rewards';
    //   } else {
    //     const { freeBalance } = JSON.parse(extra);
    //     extra = `${amountToHuman(freeBalance, decimal)} ${token}`;
    //   }

    //   return [row('Extra:', text(`**${extra}**`))];
    // case 'convictionVoting_vote':
    //   const refId = `${args[0]}`;
    //   const vote = args[1] as PalletConvictionVotingVoteVoting;
    //   const type = getVoteType(vote);

    //   if (vote.isStandard) {
    //     const conviction = getConviction(vote.asStandard.vote);

    //     return [
    //       panel([
    //         row('Referendum:', text(`**${refId}**`)),
    //         row('Vote:', text(`**${type}**`)),
    //         row(
    //           'Amount:',
    //           text(
    //             `**${amountToHuman(
    //               vote.asStandard.balance,
    //               decimal,
    //             )}** **${token}**`,
    //           ),
    //         ),
    //         row('Conviction:', text(`**${conviction}** `)),
    //       ]),
    //     ];
    //   }

    //   if (vote.isSplit) {
    //     return [
    //       panel([
    //         row('Referendum:', text(`**${refId}**`)),
    //         row('Vote:', text(`**${type}**`)),
    //         row(
    //           'Aye:',
    //           text(
    //             `**${amountToHuman(vote.asSplit.aye, decimal)}** **${token}**`,
    //           ),
    //         ),
    //         row(
    //           'Nay:',
    //           text(
    //             `**${amountToHuman(vote.asSplit.nay, decimal)}** **${token}**`,
    //           ),
    //         ),
    //       ]),
    //     ];
    //   }

    //   if (vote.isSplitAbstain) {
    //     return [
    //       panel([
    //         row('Referendum:', text(`**${refId}**`)),
    //         row('Vote:', text(`**${type}**`)),
    //         row(
    //           'Abstain:',
    //           text(
    //             `**${amountToHuman(
    //               vote.asSplitAbstain.abstain,
    //               decimal,
    //             )}** **${token}**`,
    //           ),
    //         ),
    //         row(
    //           'Aye:',
    //           text(
    //             `**${amountToHuman(
    //               vote.asSplitAbstain.aye,
    //               decimal,
    //             )}** **${token}**`,
    //           ),
    //         ),
    //         row(
    //           'Nay:',
    //           text(
    //             `**${amountToHuman(
    //               vote.asSplitAbstain.nay,
    //               decimal,
    //             )}** **${token}**`,
    //           ),
    //         ),
    //       ]),
    //     ];
    //   }
    //   break;
    // case 'noArgsMethods':
    //   return [];

    default:
      return (
        <Box>
          <Text >
            Details
          </Text>
          <Text>
            {JSON.stringify(decodedArgs || args, null, 2)}
          </Text>
        </Box>
      )
  }

  return [];
};
