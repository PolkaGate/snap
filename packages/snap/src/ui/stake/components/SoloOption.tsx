import { Box, Section, Text, Button, Image, Bold, SnapComponent, Icon } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../util/amountToHuman";
import { Row2 } from "./Row2";
import { solo, soloBlue } from "../../image/icons";
import { StakingInitContextType } from "../types";
import { check, unCheck } from "../../image/option";

interface Props {
  context: StakingInitContextType;
  isSelected: boolean;
}

export const SoloOption: SnapComponent<Props> = ({
  context,
  isSelected
}
) => {

  const { decimal, token, stakingData, stakingInfo } = context;
  const minimumActiveStakeInHuman = Number(amountToHuman(stakingInfo?.minimumActiveStake, decimal) || 0);

  return (
    <Box direction="vertical">
      <Section direction='horizontal' alignment='space-between'>
        <Box direction="vertical" alignment="start">
          <Box direction='horizontal' alignment='start' center>
            <Button name='stakingTypeOptions,Solo'>
              <Image src={isSelected ? check : unCheck} />
            </Button>
            <Text color={isSelected ? 'default' : 'muted'}>
              <Bold>SOLO STAKING </Bold>
            </Text>
          </Box>
          <Row2
            alignment="start"
            label="Minimum stake"
            labelSize="sm"
            valueSize="sm"
            value={`${minimumActiveStakeInHuman} ${token}`}
            valueColor="muted"
          />
          <Row2
            alignment="start"
            label="Rewards"
            labelSize="sm"
            valueSize="sm"
            value='Paid automatically'
            valueColor="muted"
          />
          {/* <Text color="muted" size='sm'>
          Reuse tokens in Governance
        </Text> */}
          <Text color="muted" size="sm">
            Advanced staking management
          </Text>
        </Box>
        <Box direction="vertical" alignment="start">
          <Button name='stakingTypeOptions,Solo'>
            <Image src={isSelected ? soloBlue : solo} />
          </Button>
        </Box>
      </Section>
      {isSelected &&
        <Section>
          <Box direction="horizontal" alignment="space-between" center>
            <Box direction="vertical" alignment="start">
              <Text size="sm">
                Validators
              </Text>
              <Text color='success' size="sm">
                Recommended
              </Text>
            </Box>
            <Box direction="horizontal" alignment="end" center>
              <Text color="muted">
                {String(stakingData?.solo?.validators?.length || 0)}
              </Text>
              <Button name='selectValidators' variant='primary'>
                <Icon name='arrow-right' color='muted' size='md' />
              </Button>
            </Box>
          </Box>
        </Section>
      }
    </Box>
  );
};