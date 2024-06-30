import type { SignerResult } from '@polkadot/api/types';
import type { SignerPayloadJSON } from '@polkadot/types/types';

import { checkAndUpdateMetaData, getSavedMeta, reviewUseApi } from '.';
import { getApi } from '../util/getApi';
import { getKeyPair } from '../util/getKeyPair';
import { metadataExpand } from '@polkadot/extension-chains';
import { reviewUseMetadata } from '../ui/review/reviewUseMetadata';
import { hasEndpoint } from '../util';
import { metadataAlert } from '../ui/review/metadataAlert';

export const signJSON = async (
  origin: string,
  payload: SignerPayloadJSON,
): Promise<SignerResult | undefined> => {
  try {
    const metadata = await getSavedMeta(payload.genesisHash);

    let registry;
    let isConfirmed;

    if (metadata) {
      console.info(' signing with metadata ...')

      // sign with metadata
      const chain = metadataExpand(metadata, false);

      registry = chain.registry;
      registry.setSignedExtensions(payload.signedExtensions);

      isConfirmed = await reviewUseMetadata(chain, origin, payload);

    } else if (hasEndpoint(payload.genesisHash)) {

      console.info(' signing with api ...')
      // sign with api
      const api = await getApi(payload.genesisHash);
      checkAndUpdateMetaData(api).catch(console.error);
      registry = api.registry
      isConfirmed = await reviewUseApi(api, origin, payload);

    } else {

      // ask user to update metadata
      await metadataAlert();
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
    // TODO: discover new methods for obtaining chain metadata offline!

  } catch (error) {
    console.info('Error while signing JSON:', error);
    return undefined;
  }
};
