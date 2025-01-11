// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OnUpdateHandler } from "@metamask/snaps-sdk";
import { Bold, Box, Heading, SnapComponent, Text, Image, Divider, Link } from "@metamask/snaps-sdk/jsx";
import { update } from "../ui/image/icons";

export const onUpdate: OnUpdateHandler = async () => {
  await snap.request({
    method: "snap_dialog",
    params: {
      type: "alert",
      content: <UpdateInfo />,
    },
  })
}

export const UpdateInfo: SnapComponent = () => (
  <Box>
    <Heading size="md">Snap Updated Successfully!</Heading>
    <Text color='muted'>Experience enhanced features and improved performance.</Text>
    <Box direction="horizontal" alignment="space-between" center>
      <Text>
        <Bold>
          What’s New
        </Bold>
      </Text>
      <Image src={update} />
    </Box>
    <Box direction="vertical">
      <Text>
        <Bold>
          Stake within the Snap:
        </Bold>
        Manage your staking activities directly inside the Snap—no need to navigate away.
      </Text>
    </Box>

    <Divider />
    <Box direction="horizontal">
      <Text>
        For more detail
      </Text>
      <Link href='https://docs.polkagate.xyz/polkagate/metamask-snap-user-guide/installing-polkagate-snap'>
        visit our User Guide.
      </Link>
    </Box>

      <Text>
        Need assistance?
      </Text>
      <Link href='https://matrix.to/#/#polkagate:matrix.org'>
        Join our Community Support.
      </Link>
  </Box>
);