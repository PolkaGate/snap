// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkagate/apps-config';
import getChainName from './getChainName';
import type { HexString } from '@polkadot/util/types';

/**
 * Retrieves the WebSocket endpoint(s) for the given genesis hash.
 * This function fetches the endpoints based on the chain's genesis hash, filters them based on conditions 
 * such as whether light clients should be ignored, and optionally returns multiple endpoints or a single one.
 * @param _genesisHash - The genesis hash of the chain for which the endpoint is to be retrieved.
 * @param ignoreLightClient - Flag to indicate whether light client endpoints should be ignored.
 * @param multiple - If true, an array of endpoints will be returned. If false or undefined, a single endpoint will be returned.
 * @returns - Returns a single endpoint or an array of endpoints, or undefined if no valid endpoints are found.
 * @throws - If the genesis hash is invalid or if no valid endpoints are found.
 */
export default async function getEndpoint(_genesisHash: HexString | undefined, ignoreLightClient = true, multiple?: boolean): Promise<string | string[] | undefined> {

  if (!_genesisHash) {
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
        (e.text && typeof e.text === 'string' ? e.text : JSON.stringify(e.text))?.toLowerCase()?.includes(sanitizedChainName || '')      )
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
    endpoints[4]?.value ??
    endpoints[3]?.value ??
    endpoints[2]?.value ??
    endpoints[1]?.value ??
    endpoints[0]?.value
  );
}
