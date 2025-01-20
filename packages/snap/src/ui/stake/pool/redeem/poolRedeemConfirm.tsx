
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingPoolContextType } from "../../types";
import { getRedeem } from "./util/getRedeem";
import { OUTPUT_TYPE } from "../../../../constants";
import { BN } from "@polkadot/util";
import { showConfirm } from "../../../showConfirm";

export async function poolRedeemConfirm(id: string, context: StakingPoolContextType) {

  const { address, active, genesisHash, unlocking } = context;
  const { call, params } = await getRedeem(address, genesisHash, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

  const returnPage = new BN(active || 0).isZero() &&  new BN(unlocking || 0).isZero() ? 'stakeIndexWithUpdate' : 'stakePoolIndexWithUpdate';

  await showConfirm(returnPage, id,  context,    call,    params)
};