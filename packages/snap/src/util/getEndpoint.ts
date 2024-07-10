// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkadot/apps-config';
import getChainName from './getChainName';

export default function getEndpoint(
  _genesisHash: string | undefined,
): string | undefined {
  if (!_genesisHash) {
    console.error('genesisHash should not be undefined');
    return undefined;
  }
  const allEndpoints = createWsEndpoints(() => '');
  const chainName = getChainName(_genesisHash);

  const endpoints = chainName
    ? allEndpoints?.filter(
      (e) =>
        e.value &&
        (String(e.info)?.toLowerCase() === chainName ||
          String(e.text)
            ?.toLowerCase()
            ?.includes(chainName || '')),
    )
    : [];

  return (
    endpoints[3]?.value ||
    endpoints[2]?.value ||
    endpoints[1]?.value ||
    endpoints[0]?.value
  );
}
