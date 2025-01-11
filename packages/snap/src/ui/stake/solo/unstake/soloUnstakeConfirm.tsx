
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingSoloContextType } from "../../types";
import { OUTPUT_TYPE } from "../../../../constants";
import { getSoloUnstake } from "./util/getSoloUnstake";
import { showConfirm } from "../../../showConfirm";

export async function soloUnstakeConfirm(id: string, context: StakingSoloContextType) {
  const { address, amount, genesisHash } = context;

  const { call, params } = await getSoloUnstake(address, amount!, genesisHash, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

  await showConfirm('stakeSoloReviewWithUpdate', id, context, call, params)
};