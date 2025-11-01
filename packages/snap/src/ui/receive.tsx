// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Image, Box, Copyable } from "@metamask/snaps-sdk/jsx";
import { getKeyPair } from "../util";
import { getFormatted } from "../util/getFormatted";
import { ChainSwitch } from "./components";
import { getLogoByGenesisHash } from "./image/chains/getLogo";
import type { HexString } from "@polkadot/util/types";
import QRCode from 'qrcode';
import { FlowHeader } from "./components/FlowHeader";
import { STATEMINT_GENESIS_HASH } from "../constants";

const ui = (formatted: string, genesisHash: HexString, logo: string, qrCode: string) => {

  return (
    <Box>
      <FlowHeader
        action='backToHome'
        label='Choose network to view QR'
        showHome
      />
      <ChainSwitch genesisHash={genesisHash} logo={logo} />
      <Copyable value={formatted} />
      <Image src={qrCode} borderRadius="medium" />
    </Box>
  );
};

export async function receive(id: string, genesisHash?: HexString) {
  const { address } = await getKeyPair();

  const _genesisHash = genesisHash ?? STATEMINT_GENESIS_HASH;
  const formatted = getFormatted(_genesisHash, address);
  const logo = await getLogoByGenesisHash(_genesisHash, true);

  const qrCode = await QRCode.toString(formatted, { errorCorrectionLevel: 'H' });

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(formatted, _genesisHash, logo, qrCode)
    },
  });
}