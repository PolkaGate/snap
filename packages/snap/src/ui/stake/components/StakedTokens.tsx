import { Box, Button, Image, Section, Text, Icon, SnapComponent, Bold } from '@metamask/snaps-sdk/jsx';
import { amountToHuman } from '../../../util/amountToHuman';
import { Balances } from '../../../util';
import { RewardsInfo } from '../../../util/types';
import { sanitizeChainName } from '../../../util/getChainName';
import { getChain } from '../../../chains';
import { poolSmall, soloSmall } from '../../image/icons';
import { BN, BN_ZERO } from '@polkadot/util';

interface Props {
  logos: { genesisHash: string; logo: string; }[];
  rewardsInfo: RewardsInfo[];
  stakedTokens: Balances[];
  stakingRates: Record<string, number>;
}

export const poolRewardsBreakDown = (rewardsInfo: RewardsInfo[], stakedToken: Balances) => {
  const poolRewards = rewardsInfo.filter(({ genesisHash, type }) => genesisHash === stakedToken.genesisHash && type === 'Pool');
  const poolClaimable = poolRewards.find(({ subType }) => subType === 'Claimable');
  const poolTotalClaimed = poolRewards.find(({ subType }) => subType === 'TotalClaimed');
  const poolReward = (poolTotalClaimed?.reward || BN_ZERO).add(poolClaimable?.reward || BN_ZERO);
  const netPoolStaked = stakedToken.pooledBalance.sub(poolClaimable.reward);

  return {
    poolClaimable,
    poolTotalClaimed,
    poolReward,
    netPoolStaked
  }
}

export const StakedTokens: SnapComponent<Props> = ({ logos, rewardsInfo, stakedTokens, stakingRates }) => {

  return (
    <Box direction='vertical' >
      {
        stakedTokens.map((stakedToken) => {

          const { token, soloTotal, pooled, decimal, genesisHash } = stakedToken;
          const foundLogoInfo = logos.find(({ genesisHash }) => genesisHash === stakedToken.genesisHash);

          const maybeChain = getChain(genesisHash);
          const chainName = maybeChain?.displayName || maybeChain?.network;
          const sanitizedChainName = sanitizeChainName(chainName)?.toLocaleLowerCase() as string;
          const rate = stakingRates[sanitizedChainName];

          const netPoolStaked =  new BN(pooled?.active || 0);
          const hasPoolStaked = pooled && (!new BN(pooled.total).isZero())

          const { poolReward } = poolRewardsBreakDown(rewardsInfo, stakedToken);

          const soloRewardInfo = rewardsInfo.find(({ genesisHash, type }) => genesisHash === stakedToken.genesisHash && type === 'Solo');

          const hasDualStaking = !!netPoolStaked && !netPoolStaked.isZero() && !!soloTotal && !soloTotal.isZero();

          return (
            <Box>
              {!!hasPoolStaked &&
                <Section>
                  <Box direction='horizontal' alignment='space-between'>
                    <Box direction='horizontal'>
                      <Image src={foundLogoInfo.logo} />
                      <Text color='muted'>
                        {sanitizedChainName.toUpperCase()}
                      </Text>
                    </Box>
                    <Box direction='horizontal' alignment='end' center>
                      {hasDualStaking &&
                        <Box direction='horizontal' alignment='end'>
                          <Image src={poolSmall} />
                          <Text color='muted'>
                            POOL
                          </Text>
                        </Box>
                      }
                      <Button name={`stakeDetailsPool,${genesisHash}`} variant='primary' >
                        <Icon name='arrow-right' color='primary' size='md' />
                      </Button>
                    </Box>
                  </Box>

                  <Box direction='horizontal' alignment='space-between'>
                    <Box direction='horizontal'>
                      <Icon name='stake' color='muted' />
                      <Text color='muted'>
                        Staked
                      </Text>
                    </Box>
                    <Text alignment='end'>
                      {`${amountToHuman(netPoolStaked, decimal, 4, true)} ${token}`}
                    </Text>
                  </Box>

                  <Box direction='horizontal' alignment='space-between'>
                    <Box direction='horizontal'>
                      <Icon name='graph' color='muted' />
                      <Text color='muted'>
                        Rewards
                      </Text>
                    </Box>
                    <Text alignment='end'>
                      <Bold>
                        {`${amountToHuman(poolReward, decimal, 6, true)} ${token}`}
                      </Bold>
                    </Text>
                  </Box>

                  <Box direction='horizontal' alignment='space-between'>
                    <Box direction='horizontal'>
                      <Icon name='chart' color='muted' />
                      <Text color='muted'>
                        Rate
                      </Text>
                    </Box>
                    <Box direction='horizontal' alignment='end'>
                      <Text color='success' alignment='end'>
                        {`+${rate}%`}
                      </Text>
                      <Text color='muted'>
                        / year
                      </Text>
                    </Box>
                  </Box>
                </Section>
              }

              {!!soloTotal && !soloTotal.isZero() &&
                <Section>
                  <Box direction='horizontal' alignment='space-between'>
                    <Box direction='horizontal' alignment='start'>
                      <Image src={foundLogoInfo.logo} />
                      <Text color='muted'>
                        {sanitizedChainName.toUpperCase()}
                      </Text>
                    </Box>
                    <Box direction='horizontal' alignment='end' center>
                      {hasDualStaking &&
                        <Box direction='horizontal' alignment='end'>
                          <Image src={soloSmall} />
                          <Text color='muted'>
                            SOLO
                          </Text>
                        </Box>
                      }
                      <Button name={`stakeDetailsSolo,${genesisHash}`} variant='primary'>
                        <Icon name='arrow-right' color='primary' size='md' />
                      </Button>
                    </Box>
                  </Box>

                  <Box direction='horizontal' alignment='space-between'>
                    <Box direction='horizontal'>
                      <Icon name='stake' color='muted' />
                      <Text color='muted'>
                        Staked
                      </Text>
                    </Box>
                    <Text alignment='end'>
                      {`${amountToHuman(soloTotal, decimal, 4, true)} ${token}`}
                    </Text>
                  </Box>

                  <Box direction='horizontal' alignment='space-between'>
                    <Box direction='horizontal'>
                      <Icon name='graph' color='muted' />
                      <Text color='muted'>
                        Rewards
                      </Text>
                    </Box>
                    <Text alignment='end'>
                      <Bold>
                        {`${amountToHuman(soloRewardInfo.reward, decimal, 6, true)} ${token}`}
                      </Bold>
                    </Text>
                  </Box>

                  <Box direction='horizontal' alignment='space-between'>
                    <Box direction='horizontal'>
                      <Icon name='chart' color='muted' />
                      <Text color='muted'>
                        Rate
                      </Text>
                    </Box>
                    <Box direction='horizontal' alignment='end'>
                      <Text color='success' alignment='end'>
                        {`+${rate}%`}
                      </Text>
                      <Text color='muted'>
                        / year
                      </Text>
                    </Box>
                  </Box>
                </Section>
              }
            </Box>
          )
        })}
    </Box >
  );
};