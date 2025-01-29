
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingSoloContextType } from "../../types";
import { OUTPUT_TYPE } from "../../../../constants";
import { getNominate } from "./util/getNominate";
import { showConfirm } from "../../../showConfirm";

export async function confirmChangeValidators(id: string, context: StakingSoloContextType) {

  const { address, genesisHash, selectedValidators } = context;
  const { call, params } = await getNominate(address, genesisHash, selectedValidators!, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

  await showConfirm('stakeSoloIndexWithUpdate', id, context, call, params)
};