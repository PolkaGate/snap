// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Balance } from '@polkadot/types/interfaces';
import type { SignerPayloadJSON } from '@polkadot/types/types';

import { type Decoded } from '../../rpc';
import { ReviewBody, ReviewFooter, ReviewHeader } from '.';
import { Box, Button, Container, Footer, SnapComponent } from '@metamask/snaps-sdk/jsx';
import { FlowHeader } from '../send/FlowHeader';

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

  const action = `${section}_${method}`;
  const token = api.registry.chainTokens[0];
  const decimal = api.registry.chainDecimals[0];

  return (
    <Container>
      <Box>
        <FlowHeader
          action='send'
          label='Send review'
        />
        <Box>
          <ReviewHeader
            method={method}
            origin={origin}
            section={section}
          />
          <ReviewBody 
           decimal={decimal}
           token={token}
           args={args}
           action={action}
           decoded={decoded}
           maybeReceiverIdentity={maybeReceiverIdentity}
          />
          <ReviewFooter
            docs={decoded.docs}
            chainName={chainName}
            partialFee={partialFee}
          />
        </Box>
      </Box>
      <Footer>
        <Button name="cancelSend">Cancel</Button>
        <Button name="confirmSend">Confirm</Button>
      </Footer>
    </Container>
  )
};