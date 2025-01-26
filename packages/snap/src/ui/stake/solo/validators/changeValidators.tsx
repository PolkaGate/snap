
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StakingSoloContextType } from "../../types";
import { fetchStaking } from "../../utils/fetchStaking";
import { areArraysEqual } from "../../../../util/areArraysEqual";
import { Image, Box, Button, Icon, Section, Text, Bold } from "@metamask/snaps-sdk/jsx";
import { FlowHeader } from "../../../components/FlowHeader";
import { WentWrong } from "../../../components/WentWrong";
import { recommended } from "../../../image/icons";

const ui = (
  isAlreadySelectedRecommended: boolean,
  nominators: string[],
  recommendedValidatorsOnThisChain: string[],
) => {

  return (
    <Box direction='vertical' alignment='start'>
      <FlowHeader
        action='yourValidators'
        label='Change validators'
        tooltipType="staking"
      />
      <Section >
        <Box direction='horizontal' alignment="space-between">
          <Box direction="vertical" alignment="start">
            {isAlreadySelectedRecommended
              ? <Text color='success'>
                <Bold> You already have selected the recommended validators</Bold>
              </Text>
              : <Text>
                <Bold>  Stake with recommended validators</Bold>
              </Text>
            }
            <Text color='muted' size="sm">
              PolkaGate selects top validators for security and profitability
            </Text>
          </Box>
          <Box direction="vertical" alignment="start">
            <Image src={recommended} />
          </Box>
        </Box>
        {!isAlreadySelectedRecommended &&
          <Button name='changeValidatorsByRecommended' variant='primary' type='button'>
            Continue
          </Button>
        }
      </Section>
      <Section direction="horizontal" alignment="space-between">
        <Button name='changeValidatorsByMySelf' variant='primary' type='button'>
          Select Your Own
        </Button>
        <Box alignment="end" direction="horizontal">
          <Text color='muted'>
            {`${nominators.length} (max${recommendedValidatorsOnThisChain.length})`}
          </Text>
          <Button name='changeValidatorsByMySelf' type='button'>
            <Icon name='arrow-right' color='muted' size='md' />
          </Button>
        </Box>
      </Section>
    </Box >
  );
};

export async function changeValidators(id: string, context: StakingSoloContextType) {
  const { sanitizedChainName, solo: { nominators } } = context;

  const { validators: recommendedValidators } = await fetchStaking();
  const recommendedValidatorsOnThisChain = recommendedValidators[sanitizedChainName]
  const isAlreadySelectedRecommended = areArraysEqual(nominators, recommendedValidatorsOnThisChain);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      context: {
        ...(context ?? {}),
        recommendedValidatorsOnThisChain,
        action: 'changeValidators'
      },
      ui: !recommendedValidators
        ? <WentWrong label='Something went wrong. Check your internet connection and try again!' />
        : ui(isAlreadySelectedRecommended, nominators, recommendedValidatorsOnThisChain),
    },
  });
};
