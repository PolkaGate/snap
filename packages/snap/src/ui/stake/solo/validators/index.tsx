// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Text, Bold, Icon, Image } from "@metamask/snaps-sdk/jsx";
import { StakingSoloContextType } from "../../types";
import { getValidatorsInfo, ValidatorPrefOverview } from "./util/getValidatorsInfo";
import { getValidatorsIdentities, Identities } from "../../utils/getValidatorIdentities";
import { ShowValidator } from "../components/ShowValidator";
import { SelectedValidatorsFlowHeader } from "./components/SelectedValidatorsFlowHeader";
import { check2 } from "../../../image/icons";

const ui = (
  identities: Identities[] | null | undefined,
  validatorsInfo: { activeValidators?: string[], elected?: ValidatorPrefOverview[], waiting?: ValidatorPrefOverview[] } = { activeValidators: undefined, elected: undefined, waiting: undefined }
) => {

  const { activeValidators, elected, waiting } = validatorsInfo;
  const hasNoValidators = activeValidators === undefined && elected === undefined && waiting === undefined;

  const [activeValidatorsInfo, electedNotActiveValidatorsInfo] = elected
    ? elected.reduce<[ValidatorPrefOverview[], ValidatorPrefOverview[]]>(
      ([activeValidatorsInfo, electedNotActiveValidatorsInfo], validator) => {
        if (activeValidators?.includes(validator.address)) {
          activeValidatorsInfo.push(validator);
        } else {
          electedNotActiveValidatorsInfo.push(validator);
        }
        return [activeValidatorsInfo, electedNotActiveValidatorsInfo];
      },
      [[], []]
    )
    : [undefined, undefined];

  return (
    <Box>
      <SelectedValidatorsFlowHeader
        action='stakeSoloIndex'
        label='Your validators'
      />
      {hasNoValidators
        ? <Box direction='horizontal' alignment="center" center>
          <Icon name='warning' color="muted" size="inherit"/>
          <Text color='warning'>
            No validators are selected yet!
          </Text>
        </Box>
        : <Box>
          <Box direction='horizontal' alignment="start" center>
            <Image src={check2} />
            <Text>
              <Bold>{`Elected (${elected?.length || 0})`}</Bold>
            </Text>
          </Box>
          <Text color='muted' size="sm">
            Your active validator(s) with your stake assigned
          </Text>
          {activeValidatorsInfo?.length
            ? activeValidatorsInfo.map(({ address, prefs, overviews }) => {
              const maybeIdentity = identities?.find(({ accountId }) => accountId === address)
              return (
                <ShowValidator
                  accountId={address}
                  commission={prefs.commission}
                  identity={maybeIdentity?.identity}
                  nominatorsCount={overviews?.nominatorCount}
                />
              )
            })
            : <Text color='warning'>
              No active validator this era, so no rewards.
            </Text>
          }

          <Text color='muted' size="sm">
            Validators without your stake assigned
          </Text>
          {electedNotActiveValidatorsInfo?.length
            ? electedNotActiveValidatorsInfo.map(({ address, prefs, overviews }) => {
              const maybeIdentity = identities?.find(({ accountId }) => accountId === address)
              return (
                <ShowValidator
                  accountId={address}
                  commission={prefs.commission}
                  identity={maybeIdentity?.identity}
                  nominatorsCount={overviews?.nominatorCount}
                />
                // <Tooltip content={`Members: ${overviews?.nominatorCount}, Total staked: ${amountToHuman(overviews.total, decimal, 2, true)} ${token}`}>
              )
            }) : <Text color='warning'>
              No elected validators this era; consider updating your selection.
            </Text>
          }
          <Box direction='horizontal' alignment="start" center>
            <Icon name='clock' color='muted' size='md' />
            <Text color='muted'>
              <Bold>{`Waiting (${waiting?.length ?? 0})`}</Bold>
            </Text>
          </Box>
          <Text color='muted' size="sm">
            Validators not elected due to low stake or pending inclusion
          </Text>
          {waiting?.length
            ? waiting.map(({ address, prefs, overviews }) => {
              const maybeIdentity = identities?.find(({ accountId }) => accountId === address)
              return (
                <ShowValidator
                  accountId={address}
                  commission={prefs.commission}
                  identity={maybeIdentity?.identity}
                  nominatorsCount={overviews?.nominatorCount}
                />
              )
            }) : <Text color='success'>
              All validators elected, no waiting—great selection!
            </Text>}
        </Box>
      }
    </Box>
  );
};

export async function yourValidators(id: string, context: StakingSoloContextType) {
  let { address, genesisHash, solo: { nominators } } = context;

  const validatorsInfo = nominators ? await getValidatorsInfo(address, genesisHash, nominators) : undefined;
  const identities = nominators ? await getValidatorsIdentities(genesisHash, nominators, 'NOMINATED_VALIDATORS_IDENTITIES') : undefined;

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(identities, validatorsInfo),
      context: {
        ...(context ?? {}),
      }
    },
  });
}