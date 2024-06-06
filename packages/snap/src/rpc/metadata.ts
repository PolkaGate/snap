import type {
  InjectedMetadataKnown,
  MetadataDef,
} from '@polkadot/extension-inject/types';
import { divider, heading, panel, text } from '@metamask/snaps-sdk';
import type { ApiPromise } from '@polkadot/api';
import getChainInfo from '../util/getChainInfo';
import { rand } from '../util/rand';

let selfOrigin: string;

const contentMetadata = (origin: string, metadata: MetadataDef) => {
  return panel([
    heading(`Update Request from ${origin}`),
    divider(),
    text(`Chain: **${metadata.chain}**`),
    divider(),
    text(`Token: **${metadata.tokenSymbol}**`),
    divider(),
    text(`Decimals: **${metadata.tokenDecimals}**`),
    divider(),
    text(`Spec Version: **${metadata.specVersion}**`),
    divider(),
    text(`Genesis Hash: **${metadata.genesisHash}**`),
  ]);
};

// eslint-disable-next-line jsdoc/require-jsdoc
async function showConfirmUpdateMetadata(
  origin: string,
  data: MetadataDef,
): Promise<string | boolean | null> {
  const userResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      content: contentMetadata(origin, data),
      type: 'confirmation',
    },
  });

  return userResponse;
}

export const getState = async () =>
  await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });

export const updateState = async (state: any) => {
  return await snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', newState: state },
  });
};

export const getMetadataList = async (): Promise<InjectedMetadataKnown[]> => {
  const persistedData = await getState();

  return persistedData?.metadata
    ? Object.values(persistedData.metadata)?.map(
        ({ genesisHash, specVersion }: MetadataDef) => ({
          genesisHash,
          specVersion,
        }),
      )
    : [{ genesisHash: '0x' as `0x${string}`, specVersion: 0 }];
};

export const getSavedMeta = async (
  genesisHash: string,
): Promise<MetadataDef | undefined> => {
  const persistedData = await getState();

  return (persistedData?.metadata as unknown as Record<string, MetadataDef>)?.[
    genesisHash
  ];
};

export const setMetadata = async (origin: string, data: MetadataDef) => {
  const state = (await getState()) || {};
  if (!state.metadata) {
    state.metadata = {};
  }

  if (origin !== selfOrigin) {
    /** ask user approval before saving in the snap state */
    const isConfirmed = await showConfirmUpdateMetadata(origin, data);

    if (!isConfirmed) {
      throw new Error('User declined the signing request.');
    }
  }

  state.metadata[data.genesisHash] = data;

  return Boolean(await updateState(state));
};

export const checkAndUpdateMetaData = async (api: ApiPromise) => {
  const list = await getMetadataList();
  const _genesisHash = api.genesisHash.toString();
  const maybeExistingMetadata = list.find(
    ({ genesisHash }) => genesisHash === _genesisHash,
  );
  if (
    maybeExistingMetadata?.specVersion ===
    api.runtimeVersion.specVersion.toNumber()
  ) {
    return; // do nothing
  }
  const metaData = await getChainInfo(api);
  if (metaData) {
    selfOrigin = `Polkagate-${rand()}`;
    setMetadata(selfOrigin, metaData);
  }
};
