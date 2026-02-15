// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KUSAMA_ASSET_HUB, PASEO_ASSET_HUB, POLKADOT_ASSET_HUB, WESTEND_ASSET_HUB } from "../../constants";

export const CHAIN_ID_TO_GENESISHASH: Record<string, `0x${string}`> = {
  'eip155:420420421': WESTEND_ASSET_HUB,
  'eip155:420420417': PASEO_ASSET_HUB,
  'eip155:420420419': POLKADOT_ASSET_HUB,
  'eip155:420420418': KUSAMA_ASSET_HUB,
}
