
// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StakingInitContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../send/Confirmation";
import { getRedeem } from "./util/getRedeem";
import { OUTPUT_TYPE } from "../../../../constants";

export async function poolRedeemConfirm(id: string, context: StakingInitContextType) {
  const { address, genesisHash } = context;

  const { call, params } = await getRedeem(address, genesisHash, OUTPUT_TYPE.CALL_PARAMS)


  const keyPair = await getKeyPair(genesisHash);
  const txHash = await call(...(params || [])).signAndSend(keyPair);

  const chainName = await getChainName(genesisHash)

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <Confirmation
          chainName={chainName}
          txHash={String(txHash)}
        />
      )
    },
  });
};