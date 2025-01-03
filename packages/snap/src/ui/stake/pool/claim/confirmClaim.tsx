
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingInitContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../send/Confirmation";
import { getClaim } from "./util/getClaim";
import { OUTPUT_TYPE } from "../../../../constants";

export async function confirmClaim(id: string, context: StakingInitContextType) {
  const { address, genesisHash, restakeRewards } = context;

  const { call, params } = await getClaim(address, genesisHash, restakeRewards, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

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
          action='stakePoolReviewWithUpdate'
          button='Done'
          chainName={chainName}
          txHash={String(txHash)}
        />
      )
    },
  });
};