// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  OnRpcRequestHandler,
} from '@metamask/snaps-sdk';

import {
  getMetadataList,
  setMetadata,
  getAddress,
  signJSON,
  signRaw,
} from '../rpc';

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  const _params = request.params;

  switch (request.method) {
    case 'signJSON':
      return _params?.payload && (await signJSON(origin, _params.payload));
    case 'signRaw':
      return _params?.raw && (await signRaw(origin, _params.raw));
    case 'getAddress':
      return await getAddress(_params?.chainName);
    case 'setMetadata' /** To manage snap state */:
      return (
        _params?.metaData && (await setMetadata(origin, _params?.metaData))
      );
    case 'getMetadataList':
      return await getMetadataList();

    default:
      throw new Error('Method not found in the snap onRpcRequest.');
  }
};
