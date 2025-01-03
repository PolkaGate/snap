
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getKeyPair } from "../../util";
import { HexString } from "@polkadot/util/types";
import { getApi } from "../../util/getApi";
import { amountToMachine } from "../../util/amountToMachine";
import { buildPayload } from "../../util/buildPayload";
import { getDecoded } from "../../rpc";
import getChainName from "../../util/getChainName";
import { getTransferFee } from "./utils";
import { bnToBn } from "@polkadot/util";
import { getIdentity } from "../../util/getIdentity";
import { TxContentUseApi } from "../reviewNew";
import { Json } from "@metamask/utils";
import { getLogoByGenesisHash } from "../image/chains/getLogoByGenesisHash";

export async function approveSend(id: string, genesisHash: HexString, amount: string, recipient: string) {
  const { address } = await getKeyPair();
  const api = await getApi(genesisHash);

  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const decimal = api.registry.chainDecimals[0];
  const amountAsBN = amountToMachine(amount, decimal);
  const params = [recipient, amountAsBN];
  const tx = api.tx.balances.transferKeepAlive(...params); // When transferAll?
  const payload = await buildPayload(api, tx, address);

  if (!payload) {
    throw new Error('Failed to make payload to sign!');
  }

  const origin = 'PolkaGate'
  const chainName = await getChainName(genesisHash);
  const fee = await getTransferFee(address, amount, genesisHash, recipient);
  const { method, specVersion } = payload;
  const decoded = await getDecoded(
    genesisHash,
    method,
    bnToBn(specVersion),
  );

  const maybeReceiverIdentity = await getIdentity(api, address);
  const logo = await getLogoByGenesisHash(genesisHash);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <TxContentUseApi
          api={api}
          chainName={chainName}
          origin={origin}
          payload={payload}
          partialFee={fee}
          decoded={decoded}
          maybeReceiverIdentity={maybeReceiverIdentity}
          logo={logo}
        />
      ),
      context: {
        genesisHash,
        payload: payload as unknown as Json
      }
    },
  });
};