
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from "@polkadot/util";
import { amountToMachine } from "../../util/amountToMachine";
import { getApi } from "../../util/getApi";
import { StakingInitContextType } from "./types";
import { showConfirm } from "../showConfirm";

export async function confirmStake(id: string, context: StakingInitContextType) {
  const { genesisHash, amount, decimal, stakingData } = context;
  const api = await getApi(genesisHash);

  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  const amountAsBN = amountToMachine(amount, decimal);

  let params;
  let call;
  let returnPage = 'stakeSoloIndexWithUpdate';

  if (stakingData?.type === 'Pool') {
    const poolId = new BN(stakingData.pool!.id);
    params = [amountAsBN, poolId];
    call = api.tx['nominationPools']['join']; // can add auto compound tx fee as well
    returnPage = 'stakePoolIndexWithUpdate';

  } else {
    const bonded = api.tx['staking']['bond'];
    const bondParams = [amountAsBN, 'Staked'];
    const nominated = api.tx['staking']['nominate'];

    const ids = stakingData!.solo!.validators;
    call = api.tx['utility']['batchAll'];

    params = [[bonded(...bondParams), nominated(ids)]];
  }

  await showConfirm(returnPage, id, context, call, params)
};