
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingPoolContextType } from "../../types";
import { amountToMachine } from "../../../../util/amountToMachine";
import { amountToHuman } from "../../../../util/amountToHuman";
import { getPoolUnstake } from "./util/getPoolUnstake";
import { OUTPUT_TYPE } from "../../../../constants";
import { BN } from "@polkadot/util";
import { showConfirm } from "../../../showConfirm";
import { DEFAULT_DECIMAL_POINT } from "../../const";

export async function poolUnstakeConfirm(id: string, context: StakingPoolContextType) {
  const { address, active, amount, decimal, genesisHash, poolId } = context;

  let amountAsBN = amountToMachine(amount, decimal);

  if (active && Number(amountToHuman(active, decimal, DEFAULT_DECIMAL_POINT)) === Number(amount)) { // if wants unstake all
    amountAsBN = new BN(active);
  }

  const { call, params } = await getPoolUnstake(address, amountAsBN, genesisHash, poolId!, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

  await showConfirm('stakePoolIndexWithUpdate', id, context, call, params)
};