
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingPoolContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../send/Confirmation";
import { getRedeem } from "./util/getRedeem";
import { OUTPUT_TYPE } from "../../../../constants";
import { BN } from "@polkadot/util";

export async function poolRedeemConfirm(id: string, context: StakingPoolContextType) {

  const { address, active, genesisHash } = context;
  const { call, params } = await getRedeem(address, genesisHash, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;
  const keyPair = await getKeyPair(genesisHash);
  const txHash = await call(...(params || [])).signAndSend(keyPair);
  const chainName = await getChainName(genesisHash)
  const returnPage = new BN(active || 0).isZero() ? 'stakeInit' : 'stakePoolReviewWithUpdate';

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      context: {
        ...(context || {}),
      },
      id,
      ui: (
        <Confirmation
          action={returnPage}
          button='Done'
          chainName={chainName}
          txHash={String(txHash)}
        />
      )
    },
  });
};