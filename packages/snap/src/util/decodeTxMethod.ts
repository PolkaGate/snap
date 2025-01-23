// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Chain } from '@polkadot/extension-chains/types';
import type { MetadataDef } from '@polkadot/extension-inject/types';
import type { ChainProperties, Call } from '@polkadot/types/interfaces';
import { BN } from '@polkadot/util';
import type { AnyJson } from '@polkadot/types/types';
import { Metadata, TypeRegistry } from '@polkadot/types';
import { base64Decode } from '@polkadot/util-crypto';
import { getSavedMeta } from '../rpc';

export type Decoded = {
  args: AnyJson | null;
  method: Call | null;
  docs: string;
};

const expanded = new Map<string, Chain>();

function metadataExpand(definition: MetadataDef): Chain {
  const cached = expanded.get(definition.genesisHash);

  if (cached && cached.specVersion === definition.specVersion) {
    return cached;
  }

  const {
    chain,
    genesisHash,
    icon,
    metaCalls,
    specVersion,
    ss58Format,
    tokenDecimals,
    tokenSymbol,
    types,
    userExtensions,
  } = definition;
  const registry = new TypeRegistry();

  registry.register(types);

  registry.setChainProperties(
    registry.createType('ChainProperties', {
      ss58Format,
      tokenDecimals,
      tokenSymbol,
    }) as unknown as ChainProperties,
  );

  const hasMetadata = Boolean(metaCalls);

  if (hasMetadata) {
    registry.setMetadata(
      new Metadata(registry, base64Decode(metaCalls)),
      undefined,
      userExtensions,
    );
  }

  const isUnknown = genesisHash === '0x';

  const result = {
    definition,
    genesisHash: isUnknown ? undefined : genesisHash,
    hasMetadata,
    icon: icon || 'substrate',
    isUnknown,
    name: chain,
    registry,
    specVersion,
    ss58Format,
    tokenDecimals,
    tokenSymbol,
  };

  if (result.genesisHash) {
    expanded.set(result.genesisHash, result);
  }

  return result;
}

async function getMetadata(genesisHash?: string | null): Promise<Chain | null> {
  if (!genesisHash) {
    return null;
  }

  const def = await getSavedMeta(genesisHash);

  if (def) {
    return metadataExpand(def);
  }

  return null;
}

function decodeMethod(data: string, chain: Chain, specVersion: BN): Decoded {
  let args: AnyJson | null = null;
  let method: Call | null = null;
  let docs = '';

  try {
    if (specVersion.eqn(chain.specVersion)) {
      method = chain.registry.createType('Call', data);
      docs = (method.meta.docs.toHuman() as string[])
        .join(' ')
        .replace(/`/gu, '');
      args = (method.toHuman() as { args: AnyJson }).args;
    } else {
      // Outdated metadata to decode
    }
  } catch (error) {
    console.error(
      'Error decoding method',
      chain,
      specVersion,
      (error as Error).message,
    );
  }

  return { args, method, docs };
}

export const getDecoded = async (
  genesisHash: string,
  method: string,
  specVersion: BN,
) => {
  const chain = await getMetadata(genesisHash);

  return chain?.hasMetadata
    ? decodeMethod(method, chain, specVersion)
    : { args: null, method: null, docs: '' };
};
