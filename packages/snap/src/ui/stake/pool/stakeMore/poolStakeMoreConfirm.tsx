
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getApi } from "../../../../util/getApi";
import { StakingPoolContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../send/Confirmation";
import { amountToMachine } from "../../../../util/amountToMachine";

export async function poolStakeMoreConfirm(id: string, context: StakingPoolContextType) {
  const { amount, decimal, genesisHash } = context;
  const api = await getApi(genesisHash);

  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const amountAsBN = amountToMachine(amount, decimal)
  let params = [{ FreeBalance: amountAsBN.toString() }];
  let call = api.tx['nominationPools']['bondExtra'];

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