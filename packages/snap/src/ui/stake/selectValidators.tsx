import { Box, Button, Container, Footer, Text, Divider, Form } from '@metamask/snaps-sdk/jsx';
import { getValidators } from './utils/getValidators';
import { getValidatorsIdentities, Identities } from './utils/getValidatorIdentities';
import { StakingInitContextType, ValidatorInfo } from './types';
import { FlowHeader } from '../components/FlowHeader';
import { ShowValidator } from './solo/components/ShowValidator';
import { WentWrong } from '../components/WentWrong';

const ui = (
  allValidators: ValidatorInfo[],
  context: StakingInitContextType,
  identities: Identities[] | null,
  selectedValidators: string[],
  showMode?: boolean
) => {

  const { action, recommendedValidators, sanitizedChainName } = context;
  const maxRecommendedValidators = recommendedValidators[sanitizedChainName].length;
  const validatorsToList = showMode
    ? allValidators.filter(({ accountId }) => selectedValidators.includes(accountId.toString()))
    : allValidators;

  const isChangeValidators = action === 'changeValidators';

  return (
    <Container>
      <Box direction='vertical' alignment='start'>
        <FlowHeader
          action='stakeInit'
          label='Select validators'
          showHome
          tooltipType='staking'
        />
        {!allValidators
          ? <WentWrong label='Something went wrong while fetching ...' />
          : <Box>
            <Box direction='horizontal' alignment='space-between'>
              <Text color='muted' size='sm'>
                VALIDATORS: {String(showMode ? selectedValidators.length : allValidators.length)}
              </Text>
              <Text color='muted' size='sm'>
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
                    <ShowValidator
                      accountId={accountId}
                      commission={validatorPrefs.commission}
                      identity={maybeIdentity}
                      isSelected={isSelected}
                      nominatorsCount={exposure?.others?.length}
                      showCheckBox={!showMode}
                    />
                  )
                })}
              </Form>
            }
          </Box>
        }
      </Box>
      <Footer>
        <Button
          name={
            showMode
              ? isChangeValidators
                ? 'changeValidatorsReview'
                : 'stakeInitWithSelectedValidators'
              : 'selectValidatorsShow'
          }
        >
          {showMode ? 'Continue' : `Show selected: ${selectedValidators?.length} (max ${maxRecommendedValidators})`}
        </Button>
      </Footer>
    </Container>
  );
};

export async function selectValidators(
  id: string,
  context: StakingInitContextType,
  validatorSelectionForm?: string[],
  showMode?: boolean
) {
  const { genesisHash, sanitizedChainName } = context;
  const _validators = await getValidators(genesisHash);
  const allValidators = _validators.current.concat(_validators.waiting);

  const validatorsIds = allValidators.map(({ accountId }) => accountId.toString());
  const identities = await getValidatorsIdentities(genesisHash, validatorsIds);

  const selectedValidators = !validatorSelectionForm
    ? context.recommendedValidators[sanitizedChainName]
    : validatorSelectionForm;

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