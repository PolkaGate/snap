import { Box, Container, Section } from "@metamask/snaps-sdk/jsx";
import { StakingPoolContextType } from "../types";
import type { HexString } from "@polkadot/util/types";
import getChainName from "../../../util/getChainName";
import { toTitleCase } from "../../../utils";
import type { Balances } from "../../../util";
import { BALANCE_FETCH_TYPE, handleBalancesAll } from "../../../util/handleBalancesAll";
import { YourPool } from "./components/YourPool";
import { YourStake } from "./components/YourStake";
import { Rewards } from "./components/Rewards";
import { ActionRow } from "../../components/ActionRow";
import { BN, BN_ZERO } from "@polkadot/util";
import { FlowHeader } from "../../components/FlowHeader";
import { getPoolClaimedReward } from "../utils/getPoolClaimedRewards";
import { Redeemable } from "../components/Redeemable";
import { Unstaking } from "../components/Unstaking";

const ui = (
  price: number,
  sanitizedChainName: string | undefined,
  stakedToken: Balances,
  poolTotalClaimed: BN
) => {

  const { token, decimal, poolId, poolName, pooled: { active, claimable, unlocking, redeemable, toBeReleased } } = stakedToken;
  const hasRedeemable = !!redeemable && !new BN(redeemable).isZero();
  const hasUnlocking = !!unlocking && !new BN(unlocking).isZero();

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
            decimal={decimal}
            name='poolRedeem'
            token={token}
            price={price}
          />
        }
        <Rewards
          amount={poolTotalClaimed}
          claimable={claimable}
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
            type= 'pool'
          />
        }
        <Section>
          <ActionRow
            label='Stake more'
            icon='add'
            name='poolStakeMore'
            disabled={!active || new BN(active).isZero()}
          />
          <ActionRow
            label='Unstake'
            icon='minus'
            name='poolUnstake'
            disabled={!active || new BN(active).isZero()}
          />
        </Section>
        {poolId !== undefined &&
          <YourPool
            poolId={poolId}
            poolName={poolName}
          />}
      </Box>
    </Container>
  );
};

export async function stakePoolIndex(
  id: string,
  context: StakingPoolContextType,
  maybeGenesisHash: HexString,
  fetchType?: BALANCE_FETCH_TYPE
) {

  const { address, balancesAll, pricesInUsd } = await handleBalancesAll(fetchType);
  const genesisHash = maybeGenesisHash || context?.genesisHash;
  const stakedPoolBalances = balancesAll.filter(({ pooled, genesisHash: _gh }) => pooled && _gh === genesisHash);
  const stakedToken = stakedPoolBalances.find((balance) => balance.genesisHash === genesisHash)
  const price = pricesInUsd.find((price) => price.genesisHash === stakedToken?.genesisHash)?.price?.value || 0;
  const sanitizedChainName = await getChainName(genesisHash, true, true);

  let poolTotalClaimed = BN_ZERO;
  if (fetchType === BALANCE_FETCH_TYPE.FORCE_UPDATE) {
    poolTotalClaimed = await getPoolClaimedReward(sanitizedChainName!, address)
  } else {
    poolTotalClaimed = context.rewardsInfo.find((info) => info.genesisHash === genesisHash && info.subType === 'TotalClaimed')?.reward || BN_ZERO;
  }

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(price, sanitizedChainName, stakedToken!, poolTotalClaimed),
      context: {
        ...(context ?? {}),
        price,
        genesisHash,
        ...stakedToken,
        transferable: stakedToken?.transferable?.toString(),
        pooledBalance: stakedToken?.pooledBalance?.toString(),
        claimable: stakedToken?.pooled?.claimable?.toString(),
        redeemable: stakedToken?.pooled?.redeemable?.toString(),
        active: stakedToken?.pooled?.active?.toString(),
        unlocking: stakedToken?.pooled?.unlocking?.toString(),
      }
    },
  });
}