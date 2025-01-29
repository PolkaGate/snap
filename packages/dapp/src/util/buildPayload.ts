import type { ApiPromise } from '@polkadot/api';
import { SignerPayloadJSON } from '@polkadot/types/types';

export const buildPayload = async (
  api: ApiPromise,
  tx: any,
  from: string,
): Promise<SignerPayloadJSON | undefined> => {
  if (api && tx) {
    const lastHeader = await api.rpc.chain.getHeader();
    const blockNumber = api.registry.createType(
      'BlockNumber',
      lastHeader.number.toNumber(),
    );
    const method = api.createType('Call', tx);
    const era = api.registry.createType('ExtrinsicEra', {
      current: lastHeader.number.toNumber(),
      period: 64,
    });

    const { accountNonce } = await api.derive.balances.account(from);
    const nonce = api.registry.createType('Compact<Index>', accountNonce);

    const payload = {
      address: from,
      assetId: null,
      blockHash: lastHeader.hash,
      blockNumber,
      era,
      genesisHash: api.genesisHash,
      metadataHash: null, //api.runtimeMetadata.hash.toHex(),
      method,
      mode: 0,  // default value to ignore CheckMetadataHash
      nonce,
      signedExtensions: [
        'CheckNonZeroSender',
        'CheckSpecVersion',
        'CheckTxVersion',
        'CheckGenesis',
        'CheckMortality',
        'CheckNonce',
        'CheckWeight',
        'ChargeTransactionPayment',
        'CheckMetadataHash'
      ],
      runtimeVersion: api.runtimeVersion,
      tip: 0,
      version: tx.version,
    };

    // ExtrinsicPayload vs SignerPayload
    const raw = api.registry.createType('SignerPayload', payload, {
      version: payload.version,
    });

    return raw.toPayload() as SignerPayloadJSON;
  }
};
