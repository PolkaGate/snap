// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0


import { formatCamelCase } from '../../util/formatCamelCase';
import { Box, Heading, Icon, Section, SnapComponent, Text } from '@metamask/snaps-sdk/jsx';

type Props = {
  method: string,
  origin: string,
  section: any
}

export const ReviewHeader: SnapComponent<Props> = ({ method, origin, section }) => {
  return (
    <Section>
      <Box alignment='center' direction='vertical'>
        <Box alignment='center' direction='horizontal' center>
          <Icon name='send-1' size='md' />
          <Heading size='md'>
            Action
          </Heading>
        </Box>
        <Text alignment='center'>
          {`${formatCamelCase(section) ?? ''} (${formatCamelCase(method) ?? ''})`}
        </Text>
      </Box>
    </Section>
  )
};
