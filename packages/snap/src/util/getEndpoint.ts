// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkagate/apps-config';
import getChainName from './getChainName';
import { HexString } from '@polkadot/util/types';

export default async function getEndpoint(_genesisHash: HexString | undefined, ignoreLightClient = true, multiple?: boolean): Promise<string | string[] | undefined> {
  console.info(`Getting ENDPOINT for ${_genesisHash}`)

  if (!_genesisHash) {
    console.error('genesisHash should not be undefined');
    return undefined;
  }
  const allEndpoints = createWsEndpoints(() => '');
  let sanitizedChainName = await getChainName(_genesisHash, true);

  // FixMe: should be removed when its applied in polkadot apps config, or using polkagate package
  if (sanitizedChainName === 'hydration') {
    sanitizedChainName = 'hydradx'
  }

  let endpoints = sanitizedChainName
    ? allEndpoints?.filter((e) =>
      e.value && (!ignoreLightClient || !e.value.startsWith('light')) && !e.value.includes('onfinality') &&
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

  // remove this after apps-config fixing
  if (sanitizedChainName === 'paseo') {
    const excludeKeywords = ['ajuna', 'bajun', 'integritee'];

    endpoints = endpoints.filter(({ value }) =>
      !excludeKeywords.some(keyword => value.includes(keyword)));
  }

  if (multiple) {
    return endpoints.map(({ value }) => value);
  }

  return (
    endpoints[4]?.value ||
    endpoints[3]?.value ||
    endpoints[2]?.value ||
    endpoints[1]?.value ||
    endpoints[0]?.value
  );
}
