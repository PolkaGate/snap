
// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StakingInitContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../send/Confirmation";
import { OUTPUT_TYPE } from "../../../../constants";
import { getRedeemSolo } from "./util/getRedeemSolo";

export async function soloRedeemConfirm(id: string, context: StakingInitContextType) {
  const { address, genesisHash } = context;

  const { call, params } = await getRedeemSolo(address, genesisHash, OUTPUT_TYPE.CALL_PARAMS)


  const keyPair = await getKeyPair(genesisHash);
  const txHash = await call(...(params || [])).signAndSend(keyPair);

  const chainName = await getChainName(genesisHash)

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      context: {
        ...(context || {}),
      },
      ui: (
        <Confirmation
          chainName={chainName}
          button='Done'
          action='stakeSoloReviewWithUpdate'
          txHash={String(txHash)}
        />
      )
    },
  });
};