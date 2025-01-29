// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Section, Icon, Text, SnapComponent } from '@metamask/snaps-sdk/jsx';

export const NoTokensSection: SnapComponent = () => (
  <Section>
    <Text alignment='center'> No tokens on the selected networks!</Text>
    <Box direction='horizontal' alignment='center'>
      <Text alignment='center' color='muted'>Select your preferred networks using the icon above.</Text>
      <Icon size='md' color='muted' name='customize' />
    </Box>
  </Section>

)

