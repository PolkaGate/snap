
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getKeyPair } from "../util";
import getChainName from "../util/getChainName";
import { Confirmation } from "./components/Confirmation";
import { Json } from "@metamask/snaps-sdk";
import { SubmittableExtrinsicFunction } from "@polkadot/api/types";
import { AnyTuple } from "@polkadot/types/types";

export async function showConfirm(
  action: string,
  id: string,
  context: Record<string, Json>,
  call: SubmittableExtrinsicFunction<"promise", AnyTuple>,
  params: unknown[]
) {

  const { genesisHash } = context;

  const keyPair = await getKeyPair(genesisHash);
  const txHash = await call(...(params || [])).signAndSend(keyPair);
  const chainName = await getChainName(genesisHash);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      context: {
        ...(context || {}),
      },
      id,
      ui: (
        <Confirmation
          action={action}
          button='Done'
          chainName={chainName}
          txHash={String(txHash)}
        />
      )
    },
  });
};