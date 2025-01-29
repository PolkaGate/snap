// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getSnapState, updateSnapState } from '../rpc/stateManagement';
import { Box, Heading } from '@metamask/snaps-sdk/jsx';
import { isEmptyObject, toTitleCase } from '../utils';
import { WentWrong } from '../ui/components/WentWrong';
import { noop } from '@polkadot/util';

export type Alert = {
  id: string;
  severity: 'warning' | 'error';
  text: string;
}

export const onError = async () => {
  const maybeAlerts = (await getSnapState('alerts')) as Alert;

  if (!maybeAlerts || isEmptyObject(maybeAlerts)) {
    return null;
  }

  await updateSnapState('alerts', {}).catch(noop);

  const interfaceId = await snap.request({
    method: "snap_createInterface",
    params: {
      ui: (
        <Box direction='vertical' center>
          <Heading size='md'>
            {toTitleCase(maybeAlerts.severity ?? 'Unknown') as string}
          </Heading>
          <WentWrong
            color={maybeAlerts.severity}
            label={maybeAlerts?.text}
          />
        </Box>
      ),
    },
  });

  await snap.request({
    method: "snap_dialog",
    params: {
      type: "alert",
      id: interfaceId,
    },
  });
};
