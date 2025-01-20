
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingSoloContextType } from "../../types";
import { OUTPUT_TYPE } from "../../../../constants";
import { getPayout } from "./util/getPayout";
import { showConfirm } from "../../../showConfirm";

export async function confirmPayout(id: string, context: StakingSoloContextType) {

  const { address, selectedPayouts, genesisHash } = context;
  const { call, params } = await getPayout(address, genesisHash, selectedPayouts!, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

  const _context = {
    ...(context || {}),
    selectedPayouts: []
  }

  await showConfirm('stakeSoloIndex', id, _context, call, params)
};