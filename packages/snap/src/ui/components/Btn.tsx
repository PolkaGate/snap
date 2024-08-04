// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Image, Button, SnapComponent } from "@metamask/snaps-sdk/jsx";

type Props = {
  icon: string;
  label: string;
}

export const Btn: SnapComponent<Props> = ({ icon, label }: Props) => {

  return (
    <Box direction="vertical" alignment="center">
      <Button name={label?.toLocaleLowerCase()} variant='primary'>
        {label}
      </Button>
      <Image src={icon} />
    </Box>
  );
};
