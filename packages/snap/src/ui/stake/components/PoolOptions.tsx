import { Box, Section, Image, Heading, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../util/amountToHuman";
import { Row2 } from "./Row2";
import { pool } from "../../image/icons";
import { PoolInfo } from "../utils/getPools";
import { PoolSelector } from "./PoolSelector";
import { StakingInitContextType } from "../types";

interface Props {
  context: StakingInitContextType;
  poolsInfo: PoolInfo[] | undefined;
}

export const PoolOptions: SnapComponent<Props> = ({
  context,
  poolsInfo
}
) => {
  const { decimal, token, stakingData, stakingInfo } = context;
  const minJoinBondInHuman = Number(amountToHuman(stakingInfo.minJoinBond, decimal) || 0);

  return (
    <Box>
      <Section>
        <Box direction="horizontal" alignment="space-between" center>
          <Heading size="lg">
            Pool staking
          </Heading>
          <Image src={pool} />
        </Box>
        <Row2
          alignment="start"
          label="Minimum stake"
          value={`${minJoinBondInHuman || 1} ${token}`}
          valueColor="muted"
        />
        <Row2
          alignment="start"
          label="Rewards"
          value='Claim manually'
          valueColor="muted"
        />
      </Section>
      <PoolSelector
        poolsInfo={poolsInfo}
        selectedPoolId={stakingData?.pool?.id}
        context={context}
      />
    </Box>
  );
}