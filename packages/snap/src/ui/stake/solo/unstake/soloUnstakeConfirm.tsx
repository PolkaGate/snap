
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingSoloContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../send/Confirmation";
import { OUTPUT_TYPE } from "../../../../constants";
import { getSoloUnstake } from "./util/getSoloUnstake";

export async function soloUnstakeConfirm(id: string, context: StakingSoloContextType) {
  const { address, amount, genesisHash } = context;

  const { call, params } = await getSoloUnstake(address, amount!, genesisHash, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

  const keyPair = await getKeyPair(genesisHash);
  const txHash = await call(...(params || [])).signAndSend(keyPair);

  const chainName = await getChainName(genesisHash)

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      context: {
        ...(context || {}),
      },
      id,
      ui: (
        <Confirmation
          action='stakeSoloReviewWithUpdate'
          button='Done'
          chainName={chainName}
          txHash={String(txHash)}
        />
      )
    },
  });
};