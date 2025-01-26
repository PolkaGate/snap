
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getTransfer } from "./utils/getTransfer";
import { OUTPUT_TYPE } from "../../constants";
import { SendContextType } from "./types";
import { showConfirm } from "../showConfirm";
import type { CallParamsType } from "../stake/types";

export async function confirmSend(id: string, context: SendContextType) {
  const { address, amount, genesisHash, recipient } = context;
  const { call, params } = await getTransfer(address, amount!, genesisHash, recipient!, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

  await showConfirm('backToHomeWithUpdate', id, context, call, params)
};