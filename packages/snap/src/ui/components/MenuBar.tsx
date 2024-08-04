// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { exportAccount, send, stake, vote, settings } from '../image/icons';
import { Btn } from "./Btn";


export const MenuBar: SnapComponent = () => {
  return (
    <Box direction="horizontal" alignment="space-around">
      <Btn
        icon={send}
        label='Send'
      />
      <Btn
        icon={stake}
        label='Stake'
      />
      <Btn
        icon={vote}
        label='Vote'
      />
      <Btn
        icon={exportAccount}
        label='Export'
      />
      <Btn
        icon={settings}
        label='Setting'
      />
    </Box>
  );
};
