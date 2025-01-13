import { Box, Section, Text, Button, Image, Heading, SnapComponent, Icon } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../util/amountToHuman";
import { Row2 } from "./Row2";
import { solo } from "../../image/icons";
import { StakingInitContextType } from "../types";

interface Props {
  context: StakingInitContextType;
}

export const SoloOptions: SnapComponent<Props> = ({
  context,
}
) => {

  const { decimal, token, stakingData, stakingInfo } = context;
  const minimumActiveStakeInHuman = Number(amountToHuman(stakingInfo.minimumActiveStake, decimal) || 0);

  return (
    <Box direction="vertical">
      <Section>
        <Box direction="horizontal" alignment="space-between" center>
          <Heading size="lg">
            Solo staking
          </Heading>
          <Image src={solo} />
        </Box>
        <Row2
          alignment="start"
          label="Minimum stake"
          value={`${minimumActiveStakeInHuman} ${token}`}
          valueColor="muted"
        />
        <Row2
          alignment="start"
          label="Rewards"
          value='Paid automatically'
          valueColor="muted"
        />
        <Text color="muted">
          Reuse tokens in Governance
        </Text>
        <Text color="muted">
          Advanced staking management
        </Text>
      </Section>
      <Section>
        <Box direction="horizontal" alignment="space-between" center>
          <Box direction="vertical" alignment="start">
            <Text>
              Validators
            </Text>
            <Text color='success'>
              Recommended
            </Text>
          </Box>
          <Box direction="horizontal" alignment="end" center>
            <Text color="muted">
              {String(stakingData?.solo.validators.length || 0)}
            </Text>
            <Button name='selectValidators' variant='primary'>
              <Icon name='arrow-right' color='muted' size='md' />
            </Button>
          </Box>
        </Box>
      </Section>
    </Box>
  );
};