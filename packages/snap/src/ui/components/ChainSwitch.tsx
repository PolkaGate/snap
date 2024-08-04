// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Option, SnapComponent, Dropdown, Image, Text } from "@metamask/snaps-sdk/jsx";
import { getChainOptions } from "../../chains";
import { HexString } from "@polkadot/util/types";

type Props = {
  genesisHash: HexString
  logo: string
}

export const ChainSwitch: SnapComponent<Props> = ({ genesisHash, logo }: Props) => {
  const options = getChainOptions()

  return (
    <Box direction="horizontal" alignment="space-between">
      <Text> Chain</Text>
      <Box direction="horizontal" >
        <Dropdown name="switchChain" value={genesisHash}>
          {options.map(({ value, text }) => (
            <Option value={String(value)}>
              {text}
            </Option>
          ))}
        </Dropdown>
        <Image src={logo} />
      </Box>

    </Box>
  );
};
