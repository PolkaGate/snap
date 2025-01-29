
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingInitContextType } from "../../types";
import { getClaim } from "./util/getClaim";
import { OUTPUT_TYPE } from "../../../../constants";
import { showConfirm } from "../../../showConfirm";

export async function confirmClaim(id: string, context: StakingInitContextType) {
  const { address, genesisHash, restakeRewards } = context;

  const { call, params } = await getClaim(address, genesisHash, restakeRewards, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

  await showConfirm('stakePoolIndexWithUpdate', id, context, call, params)
};