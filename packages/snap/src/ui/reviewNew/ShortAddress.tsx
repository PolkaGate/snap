// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Image, SnapComponent, Text } from '@metamask/snaps-sdk/jsx';
import jazzicon2 from '../image/jazzicon/jazzicon2.svg';

type Props = {
  address: string;
  size: number;
}

export const ShortAddress: SnapComponent<Props> = ({ address, size = 4 }) => {

  return (
    <Box direction='horizontal'>
      <Image src={jazzicon2} />
      <Text>
        {`${address.slice(0, size)} ... ${address.slice(-size)}`}
      </Text>
    </Box>
  );
}