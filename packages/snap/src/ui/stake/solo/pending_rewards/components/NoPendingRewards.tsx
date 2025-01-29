// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Text, Image, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { philippineTarsier } from "../../../../image/icons";

export const NoPendingRewards: SnapComponent = () => {

  return (
    <Box direction="vertical" alignment="center">
      <Box direction="horizontal" alignment="center">
        <Image src={philippineTarsier} />
      </Box>
      <Text color='muted' alignment="center">
        Great, you have no rewards pending!
      </Text>
    </Box>
  );
};
