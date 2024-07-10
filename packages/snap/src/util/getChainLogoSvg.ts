// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createWsEndpoints } from '@polkadot/apps-config';
import getChainName from './getChainName';

const endpoints = createWsEndpoints(() => '');

const EMPTY_LOGO = `<svg width="100" height="100">
<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>`;

/**
 * Find a chain logo related to its genesisHAsh.
 *
 * @param _genesisHash - A genesisHash of a chain.
 * @returns The logo in base64 format.
 */
export default function getChainLogoSvg(_genesisHash: string): string | null {
  const chainName = getChainName(_genesisHash);
  
  if (!chainName) {
    return null;
  }
  const endpoint = endpoints.find((o) => o.info?.toLowerCase() === chainName);

  const dataURI = endpoint?.ui?.logo as string;

  if (dataURI) {
    const maybeSvgString = atob(
      dataURI.replace(/data:image\/svg\+xml;base64,/u, ''),
    );
    const indexOfFirstSvgTag = maybeSvgString.indexOf('<svg');

    let chainLogoSvg = EMPTY_LOGO;

    if (indexOfFirstSvgTag !== -1) {
      return chainLogoSvg = maybeSvgString.substring(indexOfFirstSvgTag);
    }
  }

return EMPTY_LOGO;
}