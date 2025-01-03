
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from "@polkadot/util";
import { getKeyPair } from "../../util";
import { amountToMachine } from "../../util/amountToMachine";
import { getApi } from "../../util/getApi";
import getChainName from "../../util/getChainName";
import { Confirmation } from "../send/Confirmation";
import { StakingInitContextType } from "./types";

export async function confirmStake(id: string, context: StakingInitContextType) {
  const { genesisHash, amount, decimal, stakingData } = context;
  const api = await getApi(genesisHash);

  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const amountAsBN = amountToMachine(amount, decimal);

  let params;
  let call;

  if (stakingData.type === 'Pool') {
    const poolId = new BN(stakingData.pool.id);
    params = [amountAsBN, poolId];
    call = api.tx['nominationPools']['join']; // can add auto compound tx fee as well

  } else {
    const bonded = api.tx['staking']['bond'];
    const bondParams = [amountAsBN, 'Staked'];
    const nominated = api.tx['staking']['nominate'];

    const ids = stakingData.solo.validators;
    call = api.tx['utility']['batchAll'];

    params = [[bonded(...bondParams), nominated(ids)]];
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
          action='stakeSoloReviewWithUpdate'
          button='Done'
          chainName={chainName}
          txHash={String(txHash)}
        />
      )
    },
  });
};