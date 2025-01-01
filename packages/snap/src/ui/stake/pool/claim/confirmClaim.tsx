
// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getApi } from "../../../../util/getApi";
import { StakingInitContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../send/Confirmation";

export async function confirmClaim(id: string, context: StakingInitContextType) {
  const { genesisHash, restakeRewards } = context;
  const api = await getApi(genesisHash);

  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  let params = [] as unknown[];
  let call = api.tx['nominationPools']['claimPayout'];

  if (restakeRewards) {
    params = ['Rewards'];
    call = api.tx['nominationPools']['bondExtra'];
  }

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