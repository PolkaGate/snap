// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0


import { formatCamelCase } from '../../util/formatCamelCase';
import { Bold, Box, Icon, Section, SnapComponent, Text } from '@metamask/snaps-sdk/jsx';
import { Row2 } from '../components';

type Props = {
  method: string,
  origin: string,
  section: any
}

export const Header: SnapComponent<Props> = ({ method, origin, section }) => {

  return (
    <Box  >
      <Box center >
        <Box direction='horizontal' center>
          <Icon name='key' size='inherit'/>
          <Text size='md'>
            <Bold>
              Signing request
            </Bold>
          </Text>
        </Box>
        <Text alignment='center' size='md'>
          {origin}
        </Text>
      </Box>

      <Section>
        <Row2
          label='Action'
          labelSize='sm'
          value={`${formatCamelCase(section) ?? ''} / ${formatCamelCase(method) ?? ''}`}
          valueSize='sm'
        />
      </Section>
    </Box>
  )
};
