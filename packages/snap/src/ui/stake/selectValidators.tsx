import { Box, Button, Container, Footer, Text, Divider, Tooltip, Icon, Checkbox, Form, Avatar } from '@metamask/snaps-sdk/jsx';
import { WentWrong } from './components/WentWrong';
import { getValidators } from './utils/getValidators';
import { getValidatorsIdentities, Identities } from './utils/getValidatorIdentities';
import { ellipsis } from './components/PoolSelector';
import { StakingInitContextType, ValidatorInfo } from './types';
import { FlowHeader } from '../components/FlowHeader';

export async function selectValidators(
  id: string,
  context: StakingInitContextType,
  validatorSelectionForm?: Record<string, boolean>,
  showMode?: boolean
) {
  const { genesisHash } = context;
  const _validators = await getValidators(genesisHash);
  const allValidators = _validators.current.concat(_validators.waiting);

  const validatorsIds = allValidators.map(({ accountId }) => accountId.toString());
  const identities = await getValidatorsIdentities(genesisHash, validatorsIds);

  const selectedValidators = !validatorSelectionForm
    ? context.recommendedValidators[context.sanitizedChainName]
    : Object.entries(validatorSelectionForm).filter(([, value]) => value).map(([key]) => key.split(',')[1]);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(allValidators, context, identities, selectedValidators, showMode),
      context: {
        ...context,
        selectedValidators
      }
    },
  });
}

const ui = (
  allValidators: ValidatorInfo[],
  context: StakingInitContextType,
  identities: Identities[] | null,
  selectedValidators: string[],
  showMode?: boolean
) => {

  const { recommendedValidators, sanitizedChainName } = context;
  const maxRecommendedValidators = recommendedValidators[sanitizedChainName].length;
  const validatorsToList = showMode
    ? allValidators.filter(({ accountId }) => selectedValidators.includes(accountId.toString()))
    : allValidators;

  return (
    <Container>
      <Box direction='vertical' alignment='start'>
        <FlowHeader
          action='stakeInit'
          label='Select validators'
          showHome
          isSubAction
          tooltipType='staking'
        />
        {!allValidators
          ? <WentWrong label='Something went wrong while fetching ...' />
          : <Box>
            <Box direction='horizontal' alignment='space-between'>
              <Text color='muted'>
                VALIDATORS: {String(showMode ? selectedValidators.length : allValidators.length)}
              </Text>
              <Text color='muted'>
                COMMISSION
              </Text>
            </Box>
            <Divider />
            {
              <Form name="validatorSelectionForm">
                {validatorsToList.map(({ accountId, validatorPrefs, exposure }) => {

                  const isSelected = selectedValidators.includes(accountId.toString());
                  const maybeIdentity = identities?.find((item) => item.accountId === String(accountId))?.identity;

                  return (
                    <Box direction='horizontal' alignment='space-between' center>
                      <Box direction='horizontal' alignment='start' center>
                        {!showMode &&
                          <Checkbox name={`selectedValidator,${accountId}`} checked={isSelected} />
                        }
                        {maybeIdentity
                          ? <Box direction='horizontal' alignment='start' center>
                            <Avatar address={`polkadot:91b171bb158e2d3848fa23a9f1c25182:${accountId}`} size='sm' />
                            <Text alignment='start'>
                              {ellipsis(maybeIdentity.display)}
                            </Text>
                          </Box>
                          : //<Address address={`polkadot:91b171bb158e2d3848fa23a9f1c25182:${accountId}`} /> //this can be used instead, when avatar size is available
                          <Box direction='horizontal' alignment='start' center>
                            <Avatar address={`polkadot:91b171bb158e2d3848fa23a9f1c25182:${accountId}`} size='sm' />
                            <Text alignment='start'>
                              {ellipsis(String(accountId), 20)}
                            </Text>
                          </Box>
                        }
                      </Box>
                      <Box direction='horizontal' alignment='end' center>
                        <Text alignment='end'>
                          {String(Number(validatorPrefs.commission) / (10 ** 7) < 1 ? 0 : Number(validatorPrefs.commission) / (10 ** 7))}%
                        </Text>
                        <Tooltip content={`Members: ${exposure?.others?.length || 0}`}>
                          <Icon name="info" color='muted' />
                        </Tooltip>
                      </Box>
                    </Box>
                  )
                })}
              </Form>
            }
          </Box>
        }
      </Box>
      <Footer>
        <Button name={showMode ? 'stakeInitWithSelectedValidators' : 'selectValidatorsShow'}>
          {showMode ? 'Continue' : `Show selected: ${selectedValidators?.length} (max ${maxRecommendedValidators})`}
        </Button>
      </Footer>
    </Container>
  );
};