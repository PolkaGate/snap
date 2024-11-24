// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkadot/apps-config';
import getChainName, { sanitizeChainName } from './getChainName';
import { HexString } from '@polkadot/util/types';

export default async function getEndpoint(_genesisHash: HexString | undefined, ignoreLightClient = true): Promise<string | undefined> {
  console.info(`Getting ENDPOINT for ${_genesisHash}`)

  if (!_genesisHash) {
    console.error('genesisHash should not be undefined');
    return undefined;
  }
  const allEndpoints = createWsEndpoints(() => '');
  const chainName = await getChainName(_genesisHash);
  const sanitizedChainName = sanitizeChainName(chainName)?.toLowerCase();

  const endpoints = sanitizedChainName
    ? allEndpoints?.filter((e) =>
      e.value && (!ignoreLightClient || !e.value.startsWith('light') ) && !e.value.includes('onfinality') &&
     // Check if e.value matches the pattern 'wss://<any_number>'
     !/^wss:\/\/\d+$/.test(e.value)
     &&
      (
        String(e.info)?.toLowerCase() === sanitizedChainName ||
        String(e.text)?.toLowerCase()?.includes(sanitizedChainName || '')
      )
    )
    : [];

  if (endpoints.length === 0) {
   return; // we can use metadata for signing in such cases
  }

  return (
    endpoints[3]?.value ||
    endpoints[2]?.value ||
    endpoints[1]?.value ||
    endpoints[0]?.value
  );
}
