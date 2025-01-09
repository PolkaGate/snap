// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Section, Text, Image, Bold, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { calendar } from "../../../../image/icons";

export const PendingRewardsBanner: SnapComponent = () => {

  return (
    <Section>
      <Box direction='horizontal' alignment="space-between">
        <Box direction="vertical" alignment="start">
          <Text color='warning'>
            <Bold> Validators reward every 2–3 days</Bold>
          </Text>
          <Text color='muted'>
            You can claim them before they expire, but a fee applies
          </Text>
        </Box>
        <Box direction="vertical" alignment="start">
          <Image src={calendar} />
        </Box>
      </Box>
    </Section>
  );
};
