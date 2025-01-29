// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Text, Image, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { info } from "../../image/icons";

interface InoRowProps {
  text: string;
}

export const InfoRow: SnapComponent<InoRowProps> = ({ text }) => (
  <Box direction="horizontal" alignment="start">
    <Image src={info} />
    <Text color='muted' size="sm">
      {text}
    </Text>
  </Box>
)

