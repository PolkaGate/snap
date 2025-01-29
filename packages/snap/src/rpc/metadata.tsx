import type { ApiPromise } from '@polkadot/api';
import type {
  InjectedMetadataKnown,
  MetadataDef,
} from '@polkadot/extension-inject/types';

import getChainInfo from '../util/getChainInfo';
import { rand } from '../util/rand';
import type { HexString } from '@polkadot/util/types';
import { getSnapState, setSnapState } from './stateManagement';
import { MetadataUpdate } from '../ui/popup';

let selfOrigin: string;

async function showConfirmUpdateMetadata(  origin: string,  data: MetadataDef): Promise<string | boolean | null> {
  const userResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      content: <MetadataUpdate
        origin={origin}
        metadata={data}
      />,
      type: 'confirmation',
    },
  });

  return !!userResponse;
}

export const getMetadataList = async (): Promise<InjectedMetadataKnown[]> => {
  const persistedData = await getSnapState();

  return persistedData?.metadata
    ? Object.values(persistedData.metadata as Record<string, { genesisHash: string; specVersion: number }>)?.map(({ genesisHash, specVersion }) => ({
      genesisHash,
      specVersion,
    }),
    )
    : [{ genesisHash: '0x' as `0x${string}`, specVersion: 0 }];
};

export const getSavedMeta = async (genesisHash?: HexString): Promise<MetadataDef | undefined | Record<string, MetadataDef>> => {
  const persistedData = await getSnapState();

  return genesisHash
    ? (persistedData?.metadata as unknown as Record<string, MetadataDef>)?.[genesisHash]
    : (persistedData?.metadata as unknown as Record<string, MetadataDef>);
};

export const setMetadata = async (origin: string, data: MetadataDef): Promise<boolean> => {
  const state = (await getSnapState()) ?? {};
  if (!state.metadata) {
    state.metadata = {};
  }

  if (origin !== selfOrigin) { // If the setMetadata function is called from a source other than the selfOrigin, we should prompt the user for confirmation before proceeding.
    /** ask user approval before saving in the snap state */
    const isConfirmed = await showConfirmUpdateMetadata(origin, data);

    if (!isConfirmed) {
      throw new Error('User declined the signing request.');
    }
  }

  state.metadata[data.genesisHash] = data;

  return Boolean(await setSnapState(state));
};

export const checkAndUpdateMetaData = async (api: ApiPromise): Promise<boolean | undefined> => {
  const list = await getMetadataList();
  const _genesisHash = api.genesisHash.toString();

  const maybeExistingMetadata = list.find(({ genesisHash }) => genesisHash === _genesisHash);

  if (maybeExistingMetadata?.specVersion === api.runtimeVersion.specVersion.toNumber()) {
    return true; // The saved metadata is already up-to-date, so no action is required.
  }

  const metaData = await getChainInfo(api);

  if (metaData) {
    selfOrigin = `Polkagate-${rand()}`;
    return await setMetadata(selfOrigin, metaData);
  }
};