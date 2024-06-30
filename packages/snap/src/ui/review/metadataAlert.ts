// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  DialogResult,
  divider,
  heading,
  panel,
  text,
  image
} from '@metamask/snaps-sdk';
import metadata from "../image/metadata.svg";

export async function metadataAlert(): Promise<DialogResult> {

  const userResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      content: panel([
        heading('Metadata Not Found for This Chain'),
        divider(),
        image(metadata),
        text('Update chain metadata by visiting **Settings/Metadata** menu on **[https://apps.polkagate.xyz](https://apps.polkagate.xyz)**'),
      ]),
      type: 'alert',
    },
  });

  return userResponse;
}