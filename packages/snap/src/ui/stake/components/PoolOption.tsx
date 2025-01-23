import { Box, Section, Image, Text, SnapComponent, Button, Bold } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../util/amountToHuman";
import { Row2 } from "./Row2";
import { pool, poolBlue } from "../../image/icons";
import { PoolInfo } from "../utils/getPools";
import { PoolSelector } from "./PoolSelector";
import { StakingInitContextType } from "../types";
import { check, unCheck } from "../../image/option";

interface Props {
  context: StakingInitContextType;
  poolsInfo: PoolInfo[] | undefined;
  isSelected: boolean
}

export const PoolOption: SnapComponent<Props> = ({
  context,
  poolsInfo,
  isSelected
}
) => {
  const { decimal, token, stakingData, stakingInfo } = context;
  const minJoinBondInHuman = Number(amountToHuman(stakingInfo.minJoinBond, decimal) || 0);

  return (
    <Box direction="vertical">
      <Section direction='horizontal' alignment='space-between'>
        <Box direction="vertical" alignment="start">
          <Box direction='horizontal' alignment='start' center>
            <Button name='stakingTypeOptions,Pool'>
              <Image src={isSelected ? check : unCheck} />
            </Button>
            <Text color={isSelected ? 'default' : 'muted'}>
              <Bold> POOL STAKING </Bold>
            </Text>
          </Box>
          <Row2
            alignment="start"
            label="Minimum stake"
            labelSize="sm"
            valueSize="sm"
            value={`${minJoinBondInHuman || 1} ${token}`}
            valueColor="muted"
          />
          <Row2
            alignment="start"
            label="Rewards"
            labelSize="sm"
            valueSize="sm"
            value='Claim manually'
            valueColor="muted"
          />
        </Box>
        <Box direction="vertical" alignment="start">
          <Button name='stakingTypeOptions,Pool'>
            <Image src={isSelected ? poolBlue : pool} />
          </Button>
        </Box>
      </Section>
      {isSelected &&
        <PoolSelector
          poolsInfo={poolsInfo}
          selectedPoolId={stakingData?.pool?.id}
          context={context}
        />}
    </Box>
  );
}