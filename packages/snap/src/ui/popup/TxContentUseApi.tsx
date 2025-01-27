// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Balance } from '@polkadot/types/interfaces';
import type { SignerPayloadJSON } from '@polkadot/types/types';

import { Body, Header, PopupFooter } from '.';
import { Box, SnapComponent } from '@metamask/snaps-sdk/jsx';
import type { Decoded } from '../../util/decodeTxMethod';

type Props = {
  api: ApiPromise;
  chainName: string | undefined;
  origin: string;
  payload: SignerPayloadJSON;
  partialFee: Balance;
  decoded: Decoded;
  maybeReceiverIdentity: string | null;
}

export const TxContentUseApi: SnapComponent<Props> = ({ api, chainName, origin, payload, partialFee, decoded, maybeReceiverIdentity }) => {
  const { args, callIndex } = api.createType('Call', payload.method);
  const { method, section } = api.registry.findMetaCall(callIndex);
  const token = api.registry.chainTokens[0];
  const decimal = api.registry.chainDecimals[0];
  const action = `${section}_${method}`;

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
        maybeReceiverIdentity={maybeReceiverIdentity}
      />
      <PopupFooter
        args={args}
        action={action}
        docs={decoded.docs}
        chainName={chainName}
        partialFee={partialFee}
      />
    </Box>
  )
};