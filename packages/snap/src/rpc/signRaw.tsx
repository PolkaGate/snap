/* eslint-disable jsdoc/require-jsdoc */
import type { SignerPayloadRaw, SignerResult } from '@polkadot/types/types';
import { getKeyPair } from '../util/getKeyPair';
import { SignMessage } from '../ui/popup';

async function showConfirmSignRaw(origin: string, data: string): Promise<string | boolean | null> {
  const userResponse = await snap.request({
    method: 'snap_dialog',
    params: {
      content: <SignMessage
        origin={origin}
        data={data}
      />,
      type: 'confirmation',
    },
  });

  return !!userResponse;
}

export const signRaw = async (origin: string, raw: SignerPayloadRaw): Promise<SignerResult> => {
  const { address, data } = raw; // polkadot js sends the address of the requester along with the sign request
  const isConfirmed = await showConfirmSignRaw(origin, data);

  if (!isConfirmed) {
    throw new Error(`User ${address} declined the signing request.`);
  }
  const keypair = await getKeyPair();

  const signature = keypair.sign(data);
  const hexSignature = Buffer.from(signature).toString('hex');

  return { signature: `0x${hexSignature}` }; // polkadot js apps, assigns id to its requests
  // return { id: 1, signature: `0x${hexSignature}` }; // polkadot js apps, assigns id to its requests
};
