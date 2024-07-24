// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkadot/apps-config';
import getChainName, { sanitizeChainName } from './getChainName';

export default async function getEndpoint(
  _genesisHash: string | undefined,
): Promise<string | undefined> {

  if (!_genesisHash) {
    console.error('genesisHash should not be undefined');
    return undefined;
  }
  const allEndpoints = createWsEndpoints(() => '');
  const chainName = await getChainName(_genesisHash);
  const sanitizedChainName = sanitizeChainName(chainName)?.toLocaleLowerCase();

  const endpoints = sanitizedChainName
    ? allEndpoints?.filter((e) =>
      e.value &&
      (
        String(e.info)?.toLowerCase() === sanitizedChainName ||
        String(e.text)?.toLowerCase()?.includes(sanitizedChainName || '')
      )
    )
    : [];

  return (
    endpoints[3]?.value ||
    endpoints[2]?.value ||
    endpoints[1]?.value ||
    endpoints[0]?.value
  );
}
