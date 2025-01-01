import { Box, Button, Container, Footer, Text, Divider, Avatar, Tooltip } from '@metamask/snaps-sdk/jsx';
import { amountToHuman } from '../../util/amountToHuman';
import getPools, { PoolInfo } from './utils/getPools';
import { WentWrong } from '../components/WentWrong';
import { StakingInitContextType } from './types';
import { FlowHeader } from '../components/FlowHeader';

const MAX_POOL_NAME_TO_SHOW = 30;

const ellipsis = (poolName: string) => {
  return poolName.slice(0, MAX_POOL_NAME_TO_SHOW) + '...'
}

export async function selectPool(id: string, context: StakingInitContextType) {
  const { genesisHash } = context;
  const poolsInfo = await getPools(genesisHash);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(poolsInfo, context),
      context: {
        ...context
      }
    },
  });
}

const ui = (
  poolsInfo: PoolInfo[] | undefined,
  context: StakingInitContextType
) => {

  const activePoolsCount = poolsInfo?.length;
  const { decimal, token } = context;

  return (
    <Container>
      <Box direction='vertical' alignment='start'>
        <FlowHeader
          action='stakeInit'
          label='Select pool'
          showHome
          tooltipType='staking'
        />
        {!activePoolsCount
          ? <WentWrong label='Something went wrong while fetching pools ...' />
          : <Box>
            <Box direction='horizontal' alignment='space-between'>
              <Text color='muted'>
                ACTIVE POOLS: {String(activePoolsCount)}
              </Text>
              <Text color='muted'>
                MEMBERS
              </Text>
            </Box>
            <Divider />
            {
              poolsInfo.map(({ metadata, bondedPool }) => {

                const members = bondedPool.memberCounter;
                const depositor = bondedPool.roles.depositor;
                const staked = bondedPool.points;
                const ellipsisPoolName = metadata && metadata.length > MAX_POOL_NAME_TO_SHOW ? ellipsis(metadata) : metadata;

                return (
                  <Box direction='horizontal' alignment='space-between' center>
                    <Box direction='horizontal' alignment='start' center>
                      <Avatar address={`polkadot:91b171bb158e2d3848fa23a9f1c25182:${depositor}`} size='sm' />
                      <Box direction='vertical' alignment='start'>
                        <Tooltip content={String(metadata)}>
                          <Text>
                            {String(ellipsisPoolName)}
                          </Text>
                        </Tooltip>
                        <Text color='success'>
                          {`${amountToHuman(staked, decimal, 2, true)} ${token}`}
                        </Text>
                      </Box>
                    </Box>
                    <Text alignment='end'>
                      {String(members)}
                    </Text>
                  </Box>
                )
              })
            }
          </Box>
        }
      </Box>
      <Footer>
        <Button name='stakeInit' variant='destructive'>
          Back
        </Button>
      </Footer>
    </Container>
  );
};