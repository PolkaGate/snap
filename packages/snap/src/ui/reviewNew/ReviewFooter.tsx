// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces';
import { Box, Divider, Icon, Image, Row, Section, SnapComponent, Text, Tooltip } from '@metamask/snaps-sdk/jsx';

export const sanitizeText = (text?: string) => {
  // To replace text formatted like a link [A](B) with a something different like (A)(B)
  return text?.replace(/\[(.*?)\]\((.*?)\)/g, '($1)($2)');
};

type Props = {
  docs: string;
  chainName: string | undefined;
  logo: string;
  partialFee?: Balance;
}

const Rest: SnapComponent<Props> = ({ docs, chainName, logo }) => {

  return (
    <Box>
      <Divider />
      <Box direction='horizontal' alignment='space-between'>
        <Text>
          Chain name
        </Text>
        <Box direction='horizontal'>
          <Image src={logo} />
          <Text>
          {`${chainName ?? ''}`}
          </Text>
        </Box>
      </Box>
      <Divider />
      <Box direction='horizontal' alignment='start' center>
        <Text>
          More info
        </Text>
        <Tooltip content={`${sanitizeText(docs) ?? 'Update metadata to view this!'}`}>
          <Icon name='info' />
        </Tooltip>
      </Box>
    </Box>
  )
};

export const ReviewFooter: SnapComponent<Props> = ({ docs, chainName, logo, partialFee }) => {
  return (
    <Box>
      <Section>
        {!!partialFee &&
          <Box>
            <Row label="Estimated fee">
              <Text>
                {partialFee.toHuman()}
              </Text>
            </Row>
          </Box>
        }
        <Rest
          docs={docs}
          chainName={chainName}
          logo={logo}
        />
      </Section>
      <Row label="Attention" variant='warning'>
        <Text>
          proceed only if you understand the details above
        </Text>
      </Row>
    </Box>)
};
