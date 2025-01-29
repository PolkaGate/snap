import { Image, Box, Button, Container, Footer, Heading, Section, Text, Divider, Bold } from "@metamask/snaps-sdk/jsx";
import type { HexString } from "@polkadot/util/types";
import getChainName, { sanitizeChainName } from "../../util/getChainName";
import { amountToHuman } from "../../util/amountToHuman";
import { alertBell, coinStack, reward, timer } from "../image/icons";
import { getSnapState } from "../../rpc/stateManagement";
import { BALANCE_FETCH_TYPE, handleBalancesAll } from "../../util/handleBalancesAll";
import type { Balances } from "../../util";
import { getStakingInfo } from "./utils/getStakingInfo";
import { StakingIndexContextType, StakingInfoType } from "./types";
import { STAKED_AMOUNT_DECIMAL_POINT } from "./const";

const DEFAULT_MIN_JOIN_BOND = '1';//token

const ui = (
  balances: Balances | undefined,
  chainName: string | undefined,
  context: StakingIndexContextType,
  price: number,
  stakingInfo: StakingInfoType
) => {

  const { stakingRates } = context;
  const sanitizedChainName = sanitizeChainName(chainName)?.toLocaleLowerCase();
  const rate = sanitizedChainName ? stakingRates[sanitizedChainName] : 0;
  const { decimal, minJoinBond, token, eraDuration, unbondingDuration } = stakingInfo;
  const available = amountToHuman(balances?.transferable, decimal, 2);
  const availableValue = (Number(available) * price).toFixed(2);
  const min = amountToHuman(minJoinBond, decimal, STAKED_AMOUNT_DECIMAL_POINT, true) || DEFAULT_MIN_JOIN_BOND;

  return (
    <Container>
      <Box direction="vertical" alignment="start">
        <Heading size='sm'>
          Earn up to {String(rate)}% annually on {token} tokens!
        </Heading>
        <Section>
          <Box direction="horizontal" alignment="start">
            <Image src={coinStack} />
            <Text color='alternative'>
              Stake anytime with as little as <Bold>{min} {token}</Bold> and start earning rewards actively within <Bold>{String(2 * eraDuration)}</Bold> hours!
            </Text>
          </Box>
          <Divider />
          <Box direction="horizontal" alignment="start">
            <Image src={timer} />
            <Text color='alternative'>
              Unstake anytime and redeem your funds after <Bold>{String(unbondingDuration)}</Bold> days. Note that rewards will not be earned during the unstaking period.
            </Text>
          </Box>
          <Divider />
          <Box direction="horizontal" alignment="start">
            <Image src={reward} />
            <Text color='alternative'>
              Rewards accumulate every <Bold>{String(eraDuration)}</Bold> hours.
            </Text>
          </Box>
          <Divider />
          <Box direction="horizontal" alignment="start">
            <Image src={alertBell} />
            <Text color='alternative'>
              Rewards and staking status vary over time. Be sure to monitor your stake periodically.
            </Text>
          </Box>
        </Section>
        <Text color='muted' alignment="center">
          Available balance: {available} {token} (${availableValue})
        </Text>
      </Box>
      <Footer>
        <Button name='stakeIndex' variant="destructive">
          Back
        </Button>
        <Button name='stakeInit' variant="destructive">
          Start staking
        </Button>
      </Footer>
    </Container>
  );
};

export async function stakingInfo(id: string, genesisHash: HexString, context: StakingIndexContextType) {

  const { balancesAll } = await handleBalancesAll(BALANCE_FETCH_TYPE.SAVED_ONLY);
  const balances = balancesAll.find((balance) => balance.genesisHash === genesisHash)

  const chainName = await getChainName(genesisHash);
  const stakingInfo = await getStakingInfo(genesisHash);

  if (!stakingInfo || !chainName) {
    throw new Error('Failed to fetch online info, please check internet connection!')
  }

  const priceInfo = await getSnapState('priceInfo');
  const sanitizedChainName = sanitizeChainName(chainName)?.toLocaleLowerCase();

  const price = priceInfo?.prices?.[sanitizedChainName]?.value || 0;

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(balances, chainName, context, price, stakingInfo),
      context: {
        ...context,
        genesisHash,
        sanitizedChainName,
        stakingInfo
      }
    },
  });
}