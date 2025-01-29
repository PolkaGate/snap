// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Box, Section, Text, Address, Image, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { getFormatted } from "../../../../../util/getFormatted";
import { account } from "../../../../image/icons";
import type { HexString } from "@polkadot/util/types";


interface Props {
  show?: boolean
  address: string;
  genesisHash: HexString;
}

export const PayoutAccount: SnapComponent<Props> = ({ address, genesisHash, show }) => {
  const formatted = getFormatted(genesisHash, address);

  return (
    <Box direction='vertical' alignment='start'>
      {!!show &&
        <Box direction='vertical' alignment='start'>
          <Text color="muted" size="sm">
            Payout account
          </Text>
          <Section direction="horizontal" alignment="space-between">
            <Image src={account} />
            <Address address={`polkadot:91b171bb158e2d3848fa23a9f1c25182:${formatted}`} />
          </Section>
        </Box>
      }
    </Box >
  )
};