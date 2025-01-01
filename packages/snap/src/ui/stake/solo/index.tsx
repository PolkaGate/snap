import { Box, Container, Section } from "@metamask/snaps-sdk/jsx";
import { StakingInitContextType } from "../types";
import { HexString } from "@polkadot/util/types";
import getChainName from "../../../util/getChainName";
import { toTitleCase } from "../../../utils";
import { Balances } from "../../../util";
import { BALANCE_FETCH_TYPE, handleBalancesAll } from "../../../util/handleBalancesAll";
import { YourStake } from "./components/YourStake";
import { Unstaking } from "./components/Unstaking";
import { Redeemable } from "./components/Redeemable";
import { ActionRow } from "../../components/ActionRow";
import { BN } from "@polkadot/util";
import { getSoloRewards } from "../utils/getSoloTotalReward";
import { Rewards } from "./components/Rewards";
import { FlowHeader } from "../../components/FlowHeader";

export async function stakeSoloReview(
  id: string,
  context: StakingInitContextType,
  maybeGenesisHash: HexString | undefined,
  withUpdate?: boolean
) {

  const { balancesAll, pricesInUsd } = await handleBalancesAll(withUpdate ? BALANCE_FETCH_TYPE.FORCE_UPDATE : BALANCE_FETCH_TYPE.SAVED_ONLY);
  const genesisHash = maybeGenesisHash || context?.genesisHash;

  const stakedBalances = balancesAll.filter(({ soloTotal, genesisHash: _gh }) => soloTotal && _gh === genesisHash);
  const rewardsInfo = await getSoloRewards(stakedBalances);
  const totalRewardsEarned = rewardsInfo.find((reward) => reward.genesisHash === genesisHash);

  const stakedToken = stakedBalances.find((balance) => balance.genesisHash === genesisHash)
  const price = pricesInUsd.find((price) => price.genesisHash === stakedToken!.genesisHash)?.price?.value || 0;
  const sanitizedChainName = await getChainName(genesisHash, true);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(price, sanitizedChainName, stakedToken, totalRewardsEarned?.reward),
      context: {
        ...(context || {}),
        price,
        genesisHash,
        ...stakedToken,
        transferable: stakedToken?.transferable?.toString(),
        soloTotal: stakedToken?.soloTotal?.toString(),
        active: stakedToken?.solo?.active?.toString(),
        redeemable: stakedToken?.solo?.redeemable?.toString(),
      }
    },
  });
}

const ui = (
  price: number,
  sanitizedChainName: string | undefined,
  stakedToken: Balances,
  reward: BN | undefined,
) => {

  const { token, decimal, solo: { active, unlocking, redeemable, toBeReleased } } = stakedToken;

  return (
    <Container>
      <Box>
        <FlowHeader
          action='stakeIndex'
          label={`${toTitleCase(sanitizedChainName)} staking`}
          isSubAction
          tooltipType='staking'
        />
        <Redeemable
          amount={redeemable}
          decimal={decimal}
          token={token}
          price={price}
        />
        <Rewards
          amount={reward}
          decimal={decimal}
          token={token}
          price={price}
        />
        <YourStake
          amount={active}
          decimal={decimal}
          token={token}
          price={price}
        />
        <Unstaking
          amount={unlocking}
          toBeReleased={toBeReleased}
          decimal={decimal}
          token={token}
          price={price}
        />
        <Section>
          <ActionRow
            label='Stake more'
            icon='add'
            name='soloStakeMore'
            disabled={!active || new BN(active).isZero()}
          />
          <ActionRow
            label='Unstake'
            icon='minus'
            name='soloUnstake'
            disabled={!active || new BN(active).isZero()}
          />
          <ActionRow
            label='Rewards destination'
            icon='wallet'
            name='rewardsDestination'
            disabled={!active || new BN(active).isZero()}
          />
          <ActionRow
            label='Pending rewards'
            icon='flag'
            name='pendingRewards'
            disabled={!active || new BN(active).isZero()}
          />
          <ActionRow
            label='Your validators'
            icon='security-tick'
            name='yourValidators'
            disabled={!active || new BN(active).isZero()}
          />
        </Section>
      </Box>
    </Container>
  );
};