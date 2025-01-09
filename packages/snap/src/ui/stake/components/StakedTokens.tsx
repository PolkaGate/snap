import { Box, Button, Image, Section, Text, Icon, SnapComponent, Bold } from '@metamask/snaps-sdk/jsx';
import { amountToHuman } from '../../../util/amountToHuman';
import { Balances } from '../../../util';
import { RewardsInfo } from '../../../util/types';
import { sanitizeChainName } from '../../../util/getChainName';
import { getChain } from '../../../chains';
import { poolSmall, soloSmall } from '../../image/icons';
import { BN, BN_ZERO } from '@polkadot/util';
import { ActiveStatus } from '../pool/components/ActiveStatus';

export const poolRewardsBreakDown = (rewardsInfo: RewardsInfo[], stakedToken: Balances) => {
  const poolRewards = rewardsInfo.filter(({ genesisHash, type }) => genesisHash === stakedToken.genesisHash && type === 'Pool');
  const poolClaimable = poolRewards.find(({ subType }) => subType === 'Claimable');
  const poolTotalClaimed = poolRewards.find(({ subType }) => subType === 'TotalClaimed');
  const poolReward = (poolTotalClaimed?.reward || BN_ZERO).add(poolClaimable?.reward || BN_ZERO);
  const netPoolStaked = stakedToken.pooledBalance?.sub(poolClaimable?.reward || BN_ZERO);

  return {
    poolClaimable,
    poolTotalClaimed,
    poolReward,
    netPoolStaked
  }
}

interface ChainRowProps {
  logo: string;
  sanitizedChainName: string;
  netStaked: BN | string | undefined;
  hasDualStaking: boolean;
  genesisHash: string;
  type: 'Solo' | 'Pool';
}

const ChainRow: SnapComponent<ChainRowProps> = ({ logo, netStaked, sanitizedChainName, hasDualStaking, genesisHash, type }) => {
  return (
    <Box direction='horizontal' alignment='space-between'>
      <Box direction='horizontal' center>
        <Image src={logo || ''} />
        <Text color='muted'>
          {sanitizedChainName.toUpperCase()}
        </Text>
      </Box>
      <Box direction='horizontal' alignment='end' center>
        {!!netStaked && new BN(netStaked).isZero() &&
          <ActiveStatus amount={netStaked} />
        }
        {hasDualStaking &&
          <Box direction='horizontal' alignment='end'>
            <Image src={type === 'Pool' ? poolSmall : soloSmall} />
            <Text color='muted'>
              {type.toUpperCase()}
            </Text>
          </Box>
        }
        <Button name={`stakeDetails${type},${genesisHash}`} variant='primary' >
          <Icon name='arrow-right' color='primary' size='md' />
        </Button>
      </Box>
    </Box>
  )
}

interface StakedRowProps {
  amount: BN;
  decimal: number;
  token: string;
}

const StakedRow: SnapComponent<StakedRowProps> = ({ amount, decimal, token }) => {
  return (
    <Box direction='horizontal' alignment='space-between'>
      <Box direction='horizontal'>
        <Icon name='stake' color='muted' />
        <Text color='muted'>
          Staked
        </Text>
      </Box>
      <Text alignment='end'>
        {`${amountToHuman(amount, decimal, 4, true)} ${token}`}
      </Text>
    </Box>
  )
}
interface RewardsRowProps {
  amount: BN;
  decimal: number;
  token: string;
}

const RewardsRow: SnapComponent<RewardsRowProps> = ({ amount, decimal, token }) => {
  return (
    <Box direction='horizontal' alignment='space-between'>
      <Box direction='horizontal'>
        <Icon name='graph' color='muted' />
        <Text color='muted'>
          Rewards
        </Text>
      </Box>
      <Text alignment='end'>
        <Bold>
          {`${amountToHuman(amount, decimal, 6, true)} ${token}`}
        </Bold>
      </Text>
    </Box>
  )
}

interface RateRowProps {
  amount: number;
}

const RateRow: SnapComponent<RateRowProps> = ({ amount }) => {
  return (
    <Box direction='horizontal' alignment='space-between'>
      <Box direction='horizontal'>
        <Icon name='chart' color='muted' />
        <Text color='muted'>
          Rate
        </Text>
      </Box>
      <Box direction='horizontal' alignment='end'>
        <Text color='success' alignment='end'>
          {`+${amount}%`}
        </Text>
        <Text color='muted'>
          / year
        </Text>
      </Box>
    </Box>
  )
}

interface StakedTokenProps {
  decimal: number;
  logo: string | undefined;
  genesisHash: string;
  hasDualStaking: boolean;
  hasStaked: boolean | undefined;
  netStaked: BN;
  rate: number;
  reward: BN;
  sanitizedChainName: string;
  token: string;
  type: 'Solo' | 'Pool';
}

export const StakedToken: SnapComponent<StakedTokenProps> = ({ hasStaked, logo, sanitizedChainName, netStaked, hasDualStaking, genesisHash, type, decimal, token, rate, reward }) => {

  return (
    <Box>
      {!!hasStaked &&
        <Section>
          <ChainRow
            logo={logo || ''}
            netStaked={netStaked}
            sanitizedChainName={sanitizedChainName}
            hasDualStaking={hasDualStaking}
            genesisHash={genesisHash}
            type={type}
          />
          <StakedRow
            amount={netStaked}
            decimal={decimal}
            token={token}
          />
          <RewardsRow
            amount={reward}
            decimal={decimal}
            token={token}
          />
          <RateRow
            amount={rate}
          />
        </Section>
      }
    </Box>
  )
}

interface Props {
  logos: { genesisHash: string; logo: string; }[];
  rewardsInfo: RewardsInfo[];
  stakedTokens: Balances[];
  stakingRates: Record<string, number>;
}

export const StakedTokens: SnapComponent<Props> = ({ logos, rewardsInfo, stakedTokens, stakingRates }) => {

  return (
    <Box direction='vertical' >
      {
        stakedTokens.map((stakedToken) => {

          const { token, solo, soloTotal, pooled, decimal, genesisHash } = stakedToken;
          const foundLogoInfo = logos.find(({ genesisHash }) => genesisHash === stakedToken.genesisHash);

          const maybeChain = getChain(genesisHash);
          const chainName = maybeChain?.displayName || maybeChain?.network;
          const sanitizedChainName = sanitizeChainName(chainName)?.toLocaleLowerCase() as string;
          const rate = stakingRates[sanitizedChainName];

          const netPoolStaked = new BN(pooled?.active || 0);
          const hasPoolStaked = pooled && (!new BN(pooled.total).isZero())

          const { poolReward } = poolRewardsBreakDown(rewardsInfo, stakedToken);

          const soloRewardInfo = rewardsInfo.find(({ genesisHash, type }) => genesisHash === stakedToken.genesisHash && type === 'Solo')?.reward || BN_ZERO;

          const hasDualStaking = !!netPoolStaked && !netPoolStaked.isZero() && !!soloTotal && !soloTotal.isZero();

          return (
            <Box>
              <StakedToken
                hasStaked={hasPoolStaked}
                logo={foundLogoInfo?.logo || ''}
                sanitizedChainName={sanitizedChainName}
                netStaked={netPoolStaked}
                hasDualStaking={hasDualStaking}
                genesisHash={genesisHash}
                type='Pool'
                decimal={decimal}
                token={token}
                rate={rate}
                reward={poolReward}
              />
              <StakedToken
                hasStaked={!!soloTotal && !soloTotal.isZero()}
                logo={foundLogoInfo?.logo || ''}
                sanitizedChainName={sanitizedChainName}
                netStaked={solo?.active ? new BN(solo.active) : BN_ZERO}
                hasDualStaking={hasDualStaking}
                genesisHash={genesisHash}
                type='Solo'
                decimal={decimal}
                token={token}
                rate={rate}
                reward={soloRewardInfo}
              />
            </Box>
          )
        })}
    </Box >
  );
};