// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SignerPayloadJSON } from '@polkadot/types/types';

import { Body, Header, PopupFooter } from '.';
import { Box, SnapComponent } from '@metamask/snaps-sdk/jsx';
import type { Chain } from '@polkadot/extension-chains/cjs/types';
import type { Decoded } from '../../util/decodeTxMethod';

type Props = {
  chain: Chain,
  origin: string,
  payload: SignerPayloadJSON,
  decoded: Decoded,
}

export const TxContentUseMetadata: SnapComponent<Props> = ({ chain, origin, payload, decoded }) => {
  const registry = chain.registry;
  registry.setSignedExtensions(payload.signedExtensions, chain.definition.userExtensions);

  const { args, callIndex } = registry.createType('Call', payload.method);
  const { method, section } = registry.findMetaCall(callIndex);
  const { tokenDecimals: decimal, tokenSymbol: token } = chain;

  const action = `${section}_${method}`;
  const chainName = chain.name;

  return (
    <Box>
      <Header
        method={method}
        origin={origin}
        section={section}
      />
      <Body
        decimal={decimal}
        token={token}
        args={args}
        action={action}
        decoded={decoded}
      />
      <PopupFooter
        docs={decoded.docs}
        args={args}
        action={action}
        chainName={chainName}
      />
    </Box>
  )
};