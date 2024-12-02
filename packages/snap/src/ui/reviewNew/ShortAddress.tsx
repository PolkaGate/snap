// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SnapComponent, Text } from '@metamask/snaps-sdk/jsx';

type Props = {
  address: string;
  size: number;
}

export const ShortAddress: SnapComponent<Props> = ({ address, size = 4 }) => {

  return (
    <Text>
      {`${address.slice(0, size)} ... ${address.slice(-size)}`}
    </Text>
  );
}