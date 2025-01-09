
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getKeyPair } from "../../util";
import getChainName from "../../util/getChainName";
import { Confirmation } from "../components/Confirmation";
import { getTransfer } from "./utils/getTransfer";
import { OUTPUT_TYPE } from "../../constants";
import { SendContextType } from "./types";

export async function confirmSend(id: string, context: SendContextType) {
  const { address, amount, genesisHash, recipient } = context;
  const { call, params } = await getTransfer(address, amount, genesisHash, recipient!, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

  const keyPair = await getKeyPair(genesisHash);
  const txHash = await call(...(params || [])).signAndSend(keyPair);
  const chainName = await getChainName(genesisHash);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <Confirmation
          action='backToHomeWithUpdate'
          button='Done'
          chainName={chainName}
          txHash={String(txHash)}
        />
      )
    },
  });
};