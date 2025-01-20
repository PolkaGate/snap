import { Box, Container, Section } from "@metamask/snaps-sdk/jsx";
import { StakingSoloContextType } from "../types";
import { HexString } from "@polkadot/util/types";
import getChainName from "../../../util/getChainName";
import { toTitleCase } from "../../../utils";
import { Balances } from "../../../util";
import { BALANCE_FETCH_TYPE, handleBalancesAll } from "../../../util/handleBalancesAll";
import { Unstaking } from "../components/Unstaking";
import { Redeemable } from "../components/Redeemable";
import { ActionRow } from "../../components/ActionRow";
import { BN } from "@polkadot/util";
import { getSoloRewards } from "../utils/getSoloTotalReward";
import { Rewards } from "./components/Rewards";
import { FlowHeader } from "../../components/FlowHeader";
import { YourStake } from "../pool/components/YourStake";
import { WentWrong } from "../../components/WentWrong";

export async function stakeSoloIndex(
  id: string,
  context: StakingSoloContextType,
  maybeGenesisHash: HexString | undefined,
  fetchType?: BALANCE_FETCH_TYPE
) {

  const { balancesAll, pricesInUsd } = await handleBalancesAll(fetchType);
  const genesisHash = maybeGenesisHash || context?.genesisHash;

  const stakedBalances = balancesAll.filter(({ soloTotal, genesisHash: _gh }) => soloTotal && _gh === genesisHash);
  const rewardsInfo = await getSoloRewards(stakedBalances);
  const totalRewardsEarned = rewardsInfo.find((reward) => reward.genesisHash === genesisHash);

  const stakedToken = stakedBalances.find((balance) => balance.genesisHash === genesisHash)
  const price = pricesInUsd.find((price) => price.genesisHash === genesisHash)?.price?.value || 0;
  const sanitizedChainName = (await getChainName(genesisHash, true))?.toLowerCase();

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      context: {
        ...(context || {}),
        price,
        genesisHash,
        ...stakedToken,
        sanitizedChainName,
        active: stakedToken?.solo?.active?.toString(),
        unlocking: stakedToken?.solo?.unlocking?.toString(),
        redeemable: stakedToken?.solo?.redeemable?.toString(),
        soloTotal: stakedToken?.soloTotal?.toString(),
        transferable: stakedToken?.transferable?.toString(),
      },
      ui: !stakedToken
        ? <WentWrong label='Something went wrong. Please refresh on the homepage.' />
        : ui(price, sanitizedChainName, stakedToken, totalRewardsEarned?.reward)
    },
  });
}

const ui = (
  price: number,
  sanitizedChainName: string | undefined,
  stakedToken: Balances,
  reward: BN | undefined,
) => {

  const { token, decimal, solo: { active, nominators, unlocking, redeemable, toBeReleased } } = stakedToken;
  const hasUnlocking = !!unlocking && !new BN(unlocking).isZero();
  const hasRedeemable = !!redeemable && !new BN(redeemable).isZero();

  return (
    <Container>
      <Box>
        <FlowHeader
          action='stakeIndex'
          label={`${toTitleCase(sanitizedChainName)} staking`}
          tooltipType='staking'
        />
        {hasRedeemable &&
          <Redeemable
            amount={redeemable}
            name='soloRedeem'
            decimal={decimal}
            token={token}
            price={price}
          />
        }
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
        {hasUnlocking &&
          <Unstaking
            toBeReleased={toBeReleased}
            decimal={decimal}
            token={token}
            price={price}
          />
        }
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
            tag={nominators?.length || 0}
            icon='security-tick'
            name='yourValidators'
            disabled={!active || new BN(active).isZero()}
          />
        </Section>
      </Box>
    </Container>
  );
};