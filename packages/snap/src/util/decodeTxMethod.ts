// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Chain } from '@polkadot/extension-chains/types';
import type { MetadataDef } from '@polkadot/extension-inject/types';
import type { ChainProperties, Call } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
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

/**
 * Expands metadata for a given blockchain chain definition, caching the result for future use.
 * @param definition - The metadata definition for the chain to expand.
 * @returns The expanded chain object with additional metadata and properties.
 */
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

/**
 * Retrieves and expands metadata for a given genesis hash.
 * @param genesisHash - The genesis hash of the chain to retrieve metadata for.
 * @returns A Promise that resolves to the expanded chain object or null if metadata is not found.
 */
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

/**
 * Decodes the method data based on the provided chain and spec version.
 * @param data - The encoded method data to decode.
 * @param chain - The chain object containing registry and spec version.
 * @param specVersion - The specification version to validate before decoding.
 * @returns An object containing the decoded arguments, method, and documentation.
 */
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
  } catch {
    return { args, method, docs };
  }

  return { args, method, docs };
}

export const getDecoded = async (
  genesisHash: string,
  method: string,
  specVersion: BN,
): Promise<Decoded> => {
  const chain = await getMetadata(genesisHash);

  return chain?.hasMetadata
    ? decodeMethod(method, chain, specVersion)
    : { args: null, method: null, docs: '' };
};
