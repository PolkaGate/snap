import { Box, Button, Container, Footer, Image, Heading, Section, Text, Icon } from '@metamask/snaps-sdk/jsx';
import { FlowHeader } from '../send/FlowHeader';
import { handleBalancesAll } from '../../util/handleBalancesAll';
import { amountToHuman } from '../../util/amountToHuman';
import { getClaimableRewards } from '../../util';

export async function stakingIndex(id: string) {

  const { address, balancesAll, logos, pricesInUsd } = await handleBalancesAll();
  const stakedTokens = balancesAll.filter(({ pooledBalance }) => pooledBalance && !pooledBalance.isZero());
  const rewardsInfo = await getClaimableRewards(address, stakedTokens);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(stakedTokens, logos, pricesInUsd, rewardsInfo)
    },
  });
}

const ui = (stakedTokens, logos, pricesInUsd, rewardsInfo) => {

  return (
    <Container>
      <Box direction='vertical' alignment='start'>
        <FlowHeader
          action='backToHome'
          label='Stake'
        />
        <Heading>Staked Tokens</Heading>
        {stakedTokens.map((tokenInfo) => {
          const { token, pooledBalance, decimal } = tokenInfo;
          const foundLogoInfo = logos.find(({ genesisHash }) => genesisHash === tokenInfo.genesisHash);
          const foundRewardInfo = rewardsInfo.find(({ genesisHash }) => genesisHash === tokenInfo.genesisHash);
          const netStaked = pooledBalance.sub(foundRewardInfo.reward);

          return (
            <Section>
              <Box direction='horizontal' alignment='space-between'>
                <Box direction='horizontal'>
                  <Image src={foundLogoInfo.logo} />
                  <Box direction='vertical'>
                    <Text>
                      {token}
                    </Text>
                    <Text color='muted'>
                      claimable rewards
                    </Text>
                  </Box>
                </Box>
                <Box direction='vertical' alignment='end'>
                  <Text alignment='end'>
                    {`${amountToHuman(netStaked, decimal, 4, true)} ${token}`}
                  </Text>
                  <Box direction='horizontal' alignment='end'>
                    <Button name='claimRewards' >
                      <Icon name='download' />
                    </Button>
                    <Text color='success' alignment='end'>
                      {`${amountToHuman(foundRewardInfo.reward, decimal, 6, true)} ${token}`}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Section>
          )
        })
        }
      </Box>
      <Footer>
        <Button name='backToHome' variant='destructive'>
          Back
        </Button>
        <Button name='claimRewards' variant='destructive'>
          Claim
        </Button>
      </Footer>
    </Container>
  );
};