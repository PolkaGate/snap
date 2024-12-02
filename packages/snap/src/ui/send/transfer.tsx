
// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getKeyPair } from "../../util";
import { getApi } from "../../util/getApi";
import getChainName from "../../util/getChainName";
import { SignerPayloadJSON } from "@polkadot/types/types";
import { SendConfirmation } from "./SendConfirmation";

export async function transfer(id: string, payload: SignerPayloadJSON) {
  const { genesisHash } = payload;
  const api = await getApi(genesisHash);

  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const { args, callIndex } = api.createType('Call', payload.method);
  const { method, section } = api.registry.findMetaCall(callIndex);

  const call = api.tx[section][method](...args)

  const keyPair = await getKeyPair(genesisHash);

  const txHash = await call.signAndSend(keyPair);

  const chainName = await getChainName(genesisHash)

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <SendConfirmation
          chainName={chainName}
          txHash={String(txHash)}
        />
      )
    },
  });
};