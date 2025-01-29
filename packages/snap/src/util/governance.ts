import type { AccountId32 } from '@polkadot/types/interfaces/runtime';

import type { BN } from '@polkadot/util';

const AYE_BITS = 0b10000000;
const CON_MASK = 0b01111111;

export type Vote = {
  standard?: {
    vote: string;
    balance: number;
  };
  delegations?: {
    votes: BN;
    capital: BN;
  };
  splitAbstain?: {
    abstain: number;
    aye: number;
    nay: number;
  };
  delegating?: {
    balance: BN;
    aye?: boolean;
    nay?: boolean;
    abstain?: BN;
    conviction: number;
    target?: AccountId32;
    voted?: boolean;
    delegations: {
      votes: BN;
      capital: BN;
    };
    prior: any;
  };
};

export const isAye = (vote: string): boolean => (vote & AYE_BITS) === AYE_BITS;
export const getConviction = (vote: string): number => (vote & CON_MASK) === 0 ? 0.1 : (vote & CON_MASK);

export const getVoteType = (vote: Vote | null | undefined): string | undefined => {
  if (vote) {
    if (vote.isStandard) {
      return isAye(vote.asStandard.vote) ? 'Aye' : 'Nay';
    }

    if (vote.isSplitAbstain) {
      return 'Abstain';
    }

    if (vote.isSplit) {
      return 'Split';
    }
  }

  return undefined;
};
