import type { SignerResult } from '@polkadot/api/types';
import type { SignerPayloadJSON } from '@polkadot/types/types';

import { checkAndUpdateMetaData, getSavedMeta, reviewUseApi } from '.';
import { getApi } from '../util/getApi';
import { getKeyPair } from '../util/getKeyPair';
import { metadataExpand } from '@polkadot/extension-chains';
import { reviewUseMetadata } from '../ui/review/reviewUseMetadata';
import { hasEndpoint } from '../util';
import { metadataAlert } from '../ui/review/metadataAlert';
import { updateSnapState } from './stateManagement';
import { noop } from '@polkadot/util/cjs/noop';

export const signJSON = async (
  origin: string,
  payload: SignerPayloadJSON,
): Promise<SignerResult | undefined> => {
  try {
    let registry;
    let isConfirmed;

    const hasEndpoints = await hasEndpoint(payload.genesisHash)
    if (hasEndpoints) {
      const api = await getApi(payload.genesisHash);
      checkAndUpdateMetaData(api).catch(noop);
      registry = api.registry

      // update current chain name for chains which have endpoint
      const currentChain = await api.rpc.system.chain();
      updateSnapState('currentChain', currentChain ).catch(noop);

      isConfirmed = await reviewUseApi(api, origin, payload);

    } else {

      const metadata = await getSavedMeta(payload.genesisHash) as any;

      if (metadata) {
        const chain = metadataExpand(metadata, false);
        registry = chain.registry;
        registry.setSignedExtensions(payload.signedExtensions);

        isConfirmed = await reviewUseMetadata(chain, origin, payload);

      } else {

        // ask user to update metadata
        await metadataAlert();
      }
    }

    if (!isConfirmed) {
      throw new Error('User declined the signing request.');
    }

    if (registry) {
      const keyPair = await getKeyPair(payload.genesisHash);

      const extrinsic = registry.createType('ExtrinsicPayload', payload, {
        version: payload.version,
      });

      const { signature } = extrinsic.sign(keyPair);

      return { id: 1, signature };
    } else {
      throw new Error('Something went wrong while signing extrinsic.')
    }

  } catch {
    await updateSnapState('alerts',
      {
        id: 'signJson',
        severity: 'Error',
        text: 'Something went wrong while signing json! Update metadata!'
      }
    ).catch(noop);
    return undefined;
  }
};
