// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { copyable, panel, row, text } from '@metamask/snaps-sdk';
import type { AnyTuple } from '@polkadot/types/types';
import type { PalletConvictionVotingVoteVoting } from '@polkadot/types/lookup';
import { amountToHuman } from '../../util/amountToHuman';
import type { Decoded } from '../../util/decodeTxMethod';
import { getConviction, getVoteType } from '../../util/governance';

export const txBody = (
  decimal: number,
  token: string,
  args: AnyTuple,
  action: string,
  decoded: Decoded,
  maybeReceiverIdentity?: string | null,
): any[] => {

  let amount;
  const isNoArgsMethod = args?.length === 0 && 'noArgsMethods';
  const decodedArgs = decoded?.args;

  switch (isNoArgsMethod || action) {
    case 'balances_transfer':
    case 'balances_transferKeepAlive':
    case 'balances_transferAll':
      const to = String(args[0]);
      amount = String(args[1]);

      return [
        row('Amount:', text(`**${amountToHuman(amount, decimal)} ${token}** `)),
        text(
          `To: ${maybeReceiverIdentity ? `**${maybeReceiverIdentity}**` : ''} `,
        ),
        copyable(to),
      ];
    case 'staking_bond':
      amount = String(args[0]);
      const payee = String(args[1]);

      return [
        row('Amount:', text(`**${amountToHuman(amount, decimal)} ${token}** `)),
        row('Payee:', text(`**${payee}** `)),
      ];
    case 'staking_nominate':
      return [row('Validators:', text(`**${String(args[0])}**`))];

    case 'nominationPools_unbond':
    case 'staking_unbond':
    case 'staking_bondExtra':
      const index=action === 'nominationPools_unbond' ? 1 : 0;
      amount = `${String(args[index])}`;

      return [row('Amount:', text(`**${amountToHuman(amount, decimal)} ${token}**`))];

    case 'staking_setPayee':
      return [row('Payee:', text(`**${String(args[0])}**`))];

    case 'nominationPools_join':
      amount = String(args[0]);
      const poolId = String(args[1]);

      return [
        panel([
          row(
            'Amount:',
            text(`**${amountToHuman(amount, decimal)} ${token}**`),
          ),
          row('Pool Id:', text(`**${poolId}** `)),
        ]),
      ];
    case 'nominationPools_bondExtra':
      let extra = String(args[0]);
      if (extra === 'Rewards') {
        extra = 'Rewards';
      } else {
        const { freeBalance } = JSON.parse(extra);
        extra = `${amountToHuman(freeBalance, decimal)} ${token}`;
      }

      return [row('Extra:', text(`**${extra}**`))];
    case 'convictionVoting_vote':
      const refId = String(args[0]);
      const vote = args[1] as PalletConvictionVotingVoteVoting;
      const type = getVoteType(vote);

      if (vote.isStandard) {
        const conviction = getConviction(vote.asStandard.vote);

        return [
          panel([
            row('Referendum:', text(`**${refId}**`)),
            row('Vote:', text(`**${type}**`)),
            row(
              'Amount:',
              text(
                `**${amountToHuman(
                  vote.asStandard.balance,
                  decimal,
                )}** **${token}**`,
              ),
            ),
            row('Conviction:', text(`**${conviction}** `)),
          ]),
        ];
      }

      if (vote.isSplit) {
        return [
          panel([
            row('Referendum:', text(`**${refId}**`)),
            row('Vote:', text(`**${type}**`)),
            row(
              'Aye:',
              text(
                `**${amountToHuman(vote.asSplit.aye, decimal)}** **${token}**`,
              ),
            ),
            row(
              'Nay:',
              text(
                `**${amountToHuman(vote.asSplit.nay, decimal)}** **${token}**`,
              ),
            ),
          ]),
        ];
      }

      if (vote.isSplitAbstain) {
        return [
          panel([
            row('Referendum:', text(`**${refId}**`)),
            row('Vote:', text(`**${type}**`)),
            row(
              'Abstain:',
              text(
                `**${amountToHuman(
                  vote.asSplitAbstain.abstain,
                  decimal,
                )}** **${token}**`,
              ),
            ),
            row(
              'Aye:',
              text(
                `**${amountToHuman(
                  vote.asSplitAbstain.aye,
                  decimal,
                )}** **${token}**`,
              ),
            ),
            row(
              'Nay:',
              text(
                `**${amountToHuman(
                  vote.asSplitAbstain.nay,
                  decimal,
                )}** **${token}**`,
              ),
            ),
          ]),
        ];
      }
      break;
    case 'noArgsMethods':
      return [];

    default:
      return [
        text(`_Details_: `),
        text(JSON.stringify(decodedArgs ?? args, null, 2)), // decodedArgs show the args' labels as well
      ];
  }

  return [];
};
