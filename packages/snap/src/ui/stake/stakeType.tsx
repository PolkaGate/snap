import { Box, Container, Footer, Button } from "@metamask/snaps-sdk/jsx";
import { StakingInitContextType, StakingType } from "./types";
import getPools, { PoolInfo } from "./utils/getPools";
import { PoolOption } from "./components/PoolOption";
import { SoloOption } from "./components/SoloOption";
import { FlowHeader } from "../components/FlowHeader";

export async function stakeType(
  id: string,
  context: StakingInitContextType,
  selectedOption: StakingType
) {

  const { genesisHash, stakingData } = context;
  const stakingType = selectedOption || stakingData?.type;
  const poolsInfo = stakingType === 'Pool' ? await getPools(genesisHash) : [];

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      context: {
        ...(context || {}),
        stakingType
      },
      id,
      ui: ui(context, poolsInfo, stakingType),
    },
  });
}

const ui = (
  context: StakingInitContextType,
  poolsInfo: PoolInfo[] | undefined,
  selectedOption: "Solo" | "Pool" | undefined
) => {

  return (
    <Container>
      <Box>
        <FlowHeader
          action='stakeInit'
          label='Staking type'
          tooltipType='staking'
        />
        <PoolOption
          isSelected={selectedOption === 'Pool'}
          context={context}
          poolsInfo={poolsInfo}
        />
        <SoloOption
          isSelected={selectedOption === 'Solo'}
          context={context}
        />
      </Box>
      <Footer>
        <Button name='stakeInit'>
          Continue
        </Button>
      </Footer>
    </Container >
  );
};