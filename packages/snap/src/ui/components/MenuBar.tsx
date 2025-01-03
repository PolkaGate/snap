// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { send, stake, vote, more } from '../image/icons';
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
        icon={more}
        label='More'
      />
    </Box>
  );
};
