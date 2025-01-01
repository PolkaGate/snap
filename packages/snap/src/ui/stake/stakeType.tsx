import { Box, Container, Footer, Button, RadioGroup, Radio, Field, Form } from "@metamask/snaps-sdk/jsx";
import { StakeTypeFormState, StakingInitContextType } from "./types";
import getPools, { PoolInfo } from "./utils/getPools";
import { PoolOptions } from "./components/PoolOptions";
import { SoloOptions } from "./components/SoloOptions";
import { FlowHeader } from "../components/FlowHeader";

export async function stakeType(
  id: string,
  context: StakingInitContextType,
  stakeFormType: StakeTypeFormState
) {

  const { genesisHash, stakingData } = context;
  const selectedOption = stakeFormType?.stakingTypeOptions || stakingData?.type;
  const poolsInfo = selectedOption === 'Pool' ? await getPools(genesisHash) : [];

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      context: {
        ...(context || {})
      },
      id,
      ui: ui(context, stakeFormType, poolsInfo),
    },
  });
}

const ui = (
  context: StakingInitContextType,
  stakeFormType: StakeTypeFormState,
  poolsInfo: PoolInfo[] | undefined
) => {

  const { stakingData } = context;

  const selectedOption = stakeFormType?.stakingTypeOptions || stakingData?.type;

  return (
    <Container>
      <Box>
        <FlowHeader
          action='stakeInit'
          label='Staking type'
          showHome
          isSubAction
          tooltipType='staking'
        />
        <Box alignment="center" center>
          <Form name="stakeTypeForm">
            <Field>
              <RadioGroup name="stakingTypeOptions" value={selectedOption}>
                <Radio value="Pool">Pool staking</Radio>
                <Radio value="Solo">Solo staking</Radio>
              </RadioGroup>
            </Field>
          </Form>
        </Box>
        {selectedOption === 'Pool'
          ? <PoolOptions
            context={context}
            poolsInfo={poolsInfo}
          />
          : <SoloOptions
            context={context}
          />
        }
      </Box>
      <Footer>
        <Button name='stakeInit'>
          Continue
        </Button>
      </Footer>
    </Container >
  );
};