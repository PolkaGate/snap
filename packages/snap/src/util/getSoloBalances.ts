import type { Balance } from '@polkadot/types/interfaces';
import type { Option } from '@polkadot/types';
import type { PalletStakingRewardDestination } from '@polkadot/types/lookup';

import { BN } from '@polkadot/util';
import type { ApiPromise } from '@polkadot/api';
import type { SoloBalance, SoloBalances } from '../ui/stake/types';

/**
 * To get the balances including locked one of an address.
 * @param api - The api of the chain will be used to find an endpoint to use.
 * @param formatted - An formatted address to get its solo balances.
 * @returns The total, active, and unlocking balances.
 */
export async function getSoloBalances(api: ApiPromise, formatted: string,): Promise<SoloBalances> {
  let soloTotal;
  let solo = {} as SoloBalance;

  let rewardsDestination;

  if (api.query.staking?.ledger) {
    const [ledger, progress, nominators] = await Promise.all([
      api.query.staking.ledger(formatted),
      api.derive.session.progress(),
      api.query['staking']['nominators'](formatted)
    ])

    if (ledger.isSome) {
      soloTotal = api.createType('Balance', ledger.unwrap().total) as unknown as Balance;
      const { active, total, unlocking } = ledger.unwrap();
      solo = {
        active: active.toString(),
        total: total.toString(),
        unlocking: '0',
        toBeReleased: [] as { amount: string; date: number; }[],
        redeemable: '0',
        nominators: nominators.isSome && nominators.unwrap().targets

      };

      if (unlocking.length) {
        const { currentEra, eraLength, eraProgress } = progress;

        for (const { value, era } of unlocking) {
          const _era = new BN(String(era));
          const _value = new BN(String(value));

          const remainingEras = _era.sub(currentEra);

          if (!remainingEras.isNeg() || remainingEras.gtn(0)) {
            solo.unlocking = (new BN(solo.unlocking).add(_value)).toString();

            const secToBeReleased = remainingEras.subn(1).mul(eraLength).add(eraLength.sub(eraProgress)).muln(6);
            solo.toBeReleased.push({
              amount: String(_value),
              date: Date.now() + Number(secToBeReleased.muln(1000))
            });

          } else {

            solo.redeemable = (new BN(solo.redeemable).add(_value)).toString();
          }
        }
      }

      const payee = (await api.query.staking.payee(formatted)) as Option<PalletStakingRewardDestination>;
      if (payee.isSome) {
        const unwrappedPayee = payee.unwrap();
        rewardsDestination = (unwrappedPayee.isStash || unwrappedPayee.isStaked)
          ? formatted
          : unwrappedPayee.isAccount
            ? String(unwrappedPayee.asAccount)
            : null
      }
    }
  }

  return {
    rewardsDestination,
    soloTotal,
    solo
  };
}
