
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingPoolContextType } from "../../types";
import { amountToMachine } from "../../../../util/amountToMachine";
import { getPoolStakeMore } from "./util/getPoolStakeMore";
import { OUTPUT_TYPE } from "../../../../constants";
import { showConfirm } from "../../../showConfirm";

export async function poolStakeMoreConfirm(id: string, context: StakingPoolContextType) {
  const { address, amount, decimal, genesisHash } = context;

  const { call, params } = await getPoolStakeMore(address, amountToMachine(amount, decimal), genesisHash, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

  await showConfirm('stakePoolIndexWithUpdate', id, context, call, params)
};