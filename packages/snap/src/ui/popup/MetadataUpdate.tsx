// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0


import { Box, Text, Section, SnapComponent, Bold, Icon } from '@metamask/snaps-sdk/jsx';
import { Row2 } from '../components';
import { MetadataDef } from '@polkadot/extension-inject/cjs/types';
import { ellipsis } from '../stake/utils/ellipsis';

type Props = {
  origin: string;
  metadata: MetadataDef;
}

export const MetadataUpdate: SnapComponent<Props> = ({ metadata, origin }) => {
  const { chain, chainType, genesisHash, tokenSymbol, specVersion, tokenDecimals } = metadata;

  return (
    <Box>
      <Box center >
        <Box direction='horizontal' center>
          <Icon name='download' size='inherit' />
          <Text size='md'>
            <Bold>
              Update request
            </Bold>
          </Text>
        </Box>
        <Text alignment='center' size='md'>
          {origin}
        </Text>
      </Box>

      <Section>
        <Row2
          label='Network'
          labelSize='sm'
          value={chain}
        />
      </Section>
      <Section>
        <Row2
          label='Token'
          labelSize='sm'
          value={tokenSymbol}
        />
        <Row2
          label='Decimal'
          labelSize='sm'
          value={String(tokenDecimals)}
        />
      </Section>
      <Section>
        <Row2
          label='Spec Version'
          labelSize='sm'
          value={String(specVersion)}
        />
        <Row2
          label='Genesis Hash'
          labelSize='sm'
          value={ellipsis(genesisHash, 25)}
        />
        {!!chainType &&
          <Row2
            label='Network type'
            labelSize='sm'
            value={chainType}
          />}
      </Section>
    </Box>
  )
};
