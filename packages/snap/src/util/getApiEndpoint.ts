// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkagate/apps-config';
import type { LinkOption } from '@polkagate/apps-config/endpoints/types';

const endpoints = createWsEndpoints((k, v) => v?.toString() || k);

/**
 * Get all api endpoint info using api url.
 *
 * @param apiUrl - An url of an endpoint.
 * @returns The linkOption related to the url.
 */
export function getApiEndpoint(apiUrl?: string): LinkOption | null {
  return endpoints.find(({ value }) => value === apiUrl) || null;
}
