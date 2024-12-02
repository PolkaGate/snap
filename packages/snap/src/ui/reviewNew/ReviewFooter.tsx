// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces';
import { Box, Divider, Icon, Row, Section, SnapComponent, Text, Tooltip } from '@metamask/snaps-sdk/jsx';

export const sanitizeText = (text?: string) => {
  // To replace text formatted like a link [A](B) with a something different like (A)(B)
  return text?.replace(/\[(.*?)\]\((.*?)\)/g, '($1)($2)');
};

type Props = {
  docs: string;
  chainName: string | undefined;
  partialFee?: Balance
}

const Rest: SnapComponent<Props> = ({ docs, chainName }) => {
  return (
    <Box>
      <Divider />
      <Row label="Chain Name" tooltip='The extrinsic which will be send to blockchain.'>
        <Text>
          {`${chainName ?? ''}`}
        </Text>
      </Row>
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

export const ReviewFooter: SnapComponent<Props> = ({ docs, chainName, partialFee }) => {
  return (
    <Box>
      <Section>
        {!!partialFee &&
          <Box>
            <Row label="Estimated Fee">
              <Text>
                {partialFee.toHuman()}
              </Text>
            </Row>
          </Box>
        }
        <Rest
          docs={docs}
          chainName={chainName}
        />
      </Section>
      <Row label="Attention" variant='warning'>
        <Text>
          proceed only if you understand the details above
        </Text>
      </Row>
    </Box>)
};
