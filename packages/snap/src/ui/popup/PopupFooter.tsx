// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance } from '@polkadot/types/interfaces';
import { Box, Divider, Icon, Image, Section, SnapComponent, Text, Tooltip } from '@metamask/snaps-sdk/jsx';
import { getLogoByChainName } from '../image/chains/getLogoByGenesisHash';
import { Row2 } from '../components';
import { AnyTuple } from '@polkadot/types/types';
import { KNOWN_METHODS } from './Body';

export const sanitizeText = (text?: string) => {
  // To replace text formatted like a link [A](B) with a something different like (A)(B)
  return text?.replace(/\[(.*?)\]\((.*?)\)/g, '($1)($2)');
};

type Props = {
  args: AnyTuple;
  action: string;
  docs: string;
  chainName: string | undefined;
  partialFee?: Balance;
}

const Rest: SnapComponent<Props> = ({ docs, chainName }) => {
  const logo = getLogoByChainName(chainName);

  return (
    <Box>
      <Box direction='horizontal' alignment='space-between'>
        <Text color='muted' size='sm'>
          Network
        </Text>
        <Box direction='horizontal'>
          <Image src={logo} />
          <Text>
            {`${chainName ?? ''}`}
          </Text>
        </Box>
      </Box>
      <Divider />
      <Box direction='horizontal' alignment='space-between' center>
        <Text color='muted' size='sm'>
          More info
        </Text>
        <Tooltip content={`${sanitizeText(docs) ?? 'Update metadata to view this!'}`}>
          <Icon name='info' color='muted' />
        </Tooltip>
      </Box>
    </Box>
  )
};

export const PopupFooter: SnapComponent<Props> = ({ action, args, docs, chainName, partialFee }) => {

  const showWarningText = !(KNOWN_METHODS.includes(action) || args?.length ===0);

  return (
    <Box>
      <Section>
        {!!partialFee &&
          <Row2
            label='Estimated fee'
            labelSize='sm'
            value={partialFee.toHuman()}
          />
        }
        <Rest
          docs={docs}
          chainName={chainName}
        />
      </Section>
      {showWarningText &&
        <Section direction='horizontal' alignment='start'>
          <Icon name='warning' color='muted' />
          <Text size='sm' color='warning'>
            Proceed only if you understand the details above!
          </Text>
        </Section>
      }
    </Box>
  )
};
