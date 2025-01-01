// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { InfoRow } from "../../../components/InfoRow";

interface Props {
  unbondingDuration: number;
}

export const SoloUnstakeExtraInfo: SnapComponent<Props> = ({ unbondingDuration }) => (
  <Box>
    <InfoRow
      text={`Unstaking requires a ~${String(unbondingDuration)}-day waiting period.`}
    />
    <InfoRow
      text='Tokens earn no rewards during the unstaking period.'
    />
    <InfoRow
      text='After the unstaking period, you will need to redeem your tokens.'
    />
  </Box>
);