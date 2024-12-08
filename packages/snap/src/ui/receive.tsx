// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Image, Box, Button, Container, Copyable, Footer, Icon, Section, Text } from "@metamask/snaps-sdk/jsx";
import { getKeyPair } from "../util";
import { POLKADOT_GENESIS } from "@polkadot/apps-config";
import { getFormatted } from "../util/getFormatted";
import { ChainSwitch } from "./components";
import { getLogoByGenesisHash } from "./image/chains/getLogoByGenesisHash";
import { HexString } from "@polkadot/util/types";
import QRCode from 'qrcode';

export async function receive(id: string, genesisHash?: HexString) {
  const { address } = await getKeyPair();

  const _genesisHash = genesisHash || POLKADOT_GENESIS;
  const formatted = getFormatted(_genesisHash, address);
  const logo = await getLogoByGenesisHash(_genesisHash);

  const qrCode = await QRCode.toString(formatted, { errorCorrectionLevel: 'H' })

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(formatted, _genesisHash, logo, qrCode)
    },
  });
}

const ui = (formatted: string, genesisHash: HexString, logo: string, qrCode: string) => {

  return (
    <Container>
      <Section>
        <Box direction='horizontal' alignment="start">
          <Icon color='muted' name='wallet' size='md' />
          <Text color='muted'>Select a network to view your address and its QR code.</Text>
        </Box>
        <ChainSwitch genesisHash={genesisHash} logo={logo} />
        <Copyable value={formatted} />
        <Image src={qrCode} />
      </Section>
      <Footer>
        <Button name='backToHome' variant="destructive">
          Back
        </Button>
      </Footer>
    </Container>
  );
};