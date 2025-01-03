// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Image, Button, SnapComponent, Text } from "@metamask/snaps-sdk/jsx";

type Props = {
  icon: string;
  label: string;
}

export const Btn: SnapComponent<Props> = ({ icon, label }: Props) => {

  return (
    <Box direction="vertical" alignment="center">
      <Button name={label?.toLowerCase()} variant='primary'>
        <Image src={icon} />
      </Button>
      <Text alignment='start'>{label}</Text>
    </Box>
  );
};
