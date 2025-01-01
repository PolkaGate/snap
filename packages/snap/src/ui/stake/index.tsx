import { Box, Button, Container, Footer, Checkbox, Form } from '@metamask/snaps-sdk/jsx';
import { handleBalancesAll } from '../../util/handleBalancesAll';
import { Balances } from '../../util';
import { STAKING_CHAINS, STAKING_TEST_CHAINS } from './const';
import getChainName from '../../util/getChainName';
import { HexString } from '@polkadot/util/types';
import { StakedTokens } from './components/StakedTokens';
import { StakeAndEarn } from './components/StakeAndEarn';
import { RewardsInfo } from '../../util/types';
import { getStakingRewards } from './utils/getStakingRewards';
import { BN } from '@polkadot/util';
import { getSnapState } from '../../rpc/stateManagement';
import { FlowHeader } from '../components/FlowHeader';

async function fetchStaking(): Promise<Record<string, unknown>> {
  const response = await fetch('https://raw.githubusercontent.com/PolkaGate/snap/refs/heads/main/packages/snap/staking.json');
  if (!response.ok) {
    throw new Error('Failed to fetch JSON file');
  }

  const info = await response.json();
  return info;
}

export interface StakingIndexContextType {
  balancesAll: Balances[],
  stakingRates: Record<string, number>;
  recommendedValidators: string[];
}

export async function stakingIndex(id: string) {
  const { address, balancesAll, logos } = await handleBalancesAll();

  const isTestNetStakingEnabled = await getSnapState('enableTestnetStaking') ?? true; 

  const stakedTokens = balancesAll
    .filter(({ genesisHash }) =>
      isTestNetStakingEnabled ? true : !STAKING_TEST_CHAINS.includes(genesisHash)
    ).filter(({ pooled, soloTotal }) =>
      (!new BN(pooled?.total || 0).isZero() || (soloTotal && !soloTotal.isZero()))
    );

  const rewardsInfo = await getStakingRewards(address, stakedTokens);
  const { rates: stakingRates, validators: recommendedValidators } = await fetchStaking();

  const notStakedChains = STAKING_CHAINS
    .filter((item) =>
      isTestNetStakingEnabled ? true : !STAKING_TEST_CHAINS.includes(item)
    ).filter((item) =>
      !stakedTokens.find(({ genesisHash }) => item === String(genesisHash))
    );

  const nonStakedChainNames = (await Promise.all(notStakedChains.map((genesisHash) => getChainName(genesisHash as HexString))))
  const nonStakedChainInfo = notStakedChains.map((genesisHash, index) => ({ genesisHash, name: nonStakedChainNames[index] })).filter(({ name }) => !!name);


  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(balancesAll, isTestNetStakingEnabled, logos, nonStakedChainInfo, rewardsInfo, stakedTokens, stakingRates),
      context: {
        address,
        logos,
        recommendedValidators,
        stakingRates,
        stakedTokens,
        rewardsInfo,
      }
    },
  });
}

const ui = (
  balancesAll: Balances[],
  isTestNetStakingEnabled: boolean | undefined,
  logos: { genesisHash: string; logo: string; }[],
  nonStakedChainInfo: { genesisHash: HexString, name: string }[],
  rewardsInfo: RewardsInfo[],
  stakedTokens: Balances[],
  stakingRates: Record<string, number>
) => {

  return (
    <Container>
      <Box direction='vertical' alignment='start'>
        <FlowHeader
          action='backToHome'
          label='Staking'
          tooltipType='staking'
        />
        {
          !!stakedTokens.length &&
          <StakedTokens
            logos={logos}
            rewardsInfo={rewardsInfo}
            stakedTokens={stakedTokens}
            stakingRates={stakingRates}
          />
        }
        {
          !!nonStakedChainInfo.length &&
          <StakeAndEarn
            balancesAll={balancesAll}
            nonStakedChainInfo={nonStakedChainInfo}
            stakingRates={stakingRates}
          />
        }
        <Box direction='horizontal' alignment='center'>
          <Form name='testNetStaking'>
            <Checkbox name="enableTestnetStaking" label="Enable test networks" checked={isTestNetStakingEnabled} />
          </Form>
        </Box>
      </Box>
      <Footer>
        <Button name='backToHome' variant='destructive'>
          Back
        </Button>
      </Footer>
    </Container>
  );
};