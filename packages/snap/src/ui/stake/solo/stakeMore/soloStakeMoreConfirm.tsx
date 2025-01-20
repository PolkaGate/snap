
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingSoloContextType } from "../../types";
import { amountToMachine } from "../../../../util/amountToMachine";
import { getSoloStakeMore } from "./util/getSoloStakeMore";
import { OUTPUT_TYPE } from "../../../../constants";
import { showConfirm } from "../../../showConfirm";

export async function soloStakeMoreConfirm(id: string, context: StakingSoloContextType) {
  const { address, amount, decimal, genesisHash } = context;

  const amountAsBN = amountToMachine(amount, decimal)
  const { call, params } = await getSoloStakeMore(address, amountAsBN, genesisHash, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

  await showConfirm('stakeSoloIndexWithUpdate', id, context, call, params)
};