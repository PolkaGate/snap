
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingSoloContextType } from "../../types";
import { GET_PAYEE_OUTPUT_TYPE, getPayee } from "./util/getPayee";
import { showConfirm } from "../../../showConfirm";

export async function rewardsDestinationConfirm(id: string, context: StakingSoloContextType) {
  const { address, genesisHash, payee } = context;

  const { call, params } = await getPayee(address, genesisHash, GET_PAYEE_OUTPUT_TYPE.CALL_PARAMS, payee?.maybeNew) as CallParamsType;

  await showConfirm('stakeSoloIndexWithUpdate', id, { ...context ,  payee: {}}, call, params)
};