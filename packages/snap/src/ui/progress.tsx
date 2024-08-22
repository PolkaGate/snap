// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Spinner, Text } from "@metamask/snaps-sdk/jsx";
import React from "react";

export const progress = (label?: string) => {

  return (
    <Box direction="vertical" alignment="center">
      <Spinner />
      <Text>
        {label || 'Processing, Please Wait!'}
      </Text>
    </Box>
  );
};
