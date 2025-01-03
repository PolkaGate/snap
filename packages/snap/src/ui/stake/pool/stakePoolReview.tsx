import { Box, Container, Section } from "@metamask/snaps-sdk/jsx";
import { StakingPoolContextType } from "../types";
import { HexString } from "@polkadot/util/types";
import getChainName from "../../../util/getChainName";
import { toTitleCase } from "../../../utils";
import { poolRewardsBreakDown } from "../components/StakedTokens";
import { Balances } from "../../../util";
import { BALANCE_FETCH_TYPE, handleBalancesAll } from "../../../util/handleBalancesAll";
import { getPoolRewards } from "../utils/getStakingRewards";
import { RewardsInfo } from "../../../util/types";
import { YourPool } from "./components/YourPool";
import { YourStake } from "./components/YourStake";
import { Unstaking } from "./components/Unstaking";
import { Redeemable } from "./components/Redeemable";
import { Rewards } from "./components/Rewards";
import { ActionRow } from "../../components/ActionRow";
import { BN } from "@polkadot/util";
import { FlowHeader } from "../../components/FlowHeader";

export async function stakePoolReview(
  id: string,
  context: StakingPoolContextType,
  maybeGenesisHash: HexString,
  withUpdate?: boolean
) {

  const { address, balancesAll, pricesInUsd } = await handleBalancesAll(withUpdate ? BALANCE_FETCH_TYPE.FORCE_UPDATE : BALANCE_FETCH_TYPE.SAVED_ONLY);
  const genesisHash = maybeGenesisHash || context?.genesisHash;

  const stakedPoolBalances = balancesAll.filter(({ pooled, genesisHash: _gh }) => pooled && _gh === genesisHash);
  const rewardsInfo = await getPoolRewards(address, stakedPoolBalances);

  const stakedToken = stakedPoolBalances.find((balance) => balance.genesisHash === genesisHash)
  const price = pricesInUsd.find((price) => price.genesisHash === stakedToken!.genesisHash)?.price?.value || 0;
  const sanitizedChainName = await getChainName(genesisHash, true);

  const { poolTotalClaimed } = poolRewardsBreakDown(rewardsInfo, stakedToken);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(price, sanitizedChainName, stakedToken, poolTotalClaimed),
      context: {
        ...(context || {}),
        price,
        genesisHash,
        ...stakedToken,
        transferable: stakedToken?.transferable?.toString(),
        pooledBalance: stakedToken?.pooledBalance?.toString(),
        claimable: stakedToken?.pooled?.claimable?.toString(),
        redeemable: stakedToken?.pooled?.redeemable?.toString(),
        active: stakedToken?.pooled?.active?.toString(),
      }
    },
  });
}

const ui = (
  price: number,
  sanitizedChainName: string | undefined,
  stakedToken: Balances,
  poolTotalClaimed: RewardsInfo | undefined,
) => {

  const { token, decimal, poolId, poolName, pooled: { active, claimable, unlocking, redeemable, toBeReleased } } = stakedToken;

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
          amount={poolTotalClaimed?.reward}
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
        <YourPool
          poolId={poolId}
          poolName={poolName}
        />
      </Box>
    </Container>
  );
};