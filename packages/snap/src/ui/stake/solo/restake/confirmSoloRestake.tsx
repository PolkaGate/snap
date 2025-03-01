
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingSoloContextType } from "../../types";
import { amountToMachine } from "../../../../util/amountToMachine";
import { getSoloRestake } from "./util/getSoloRestake";
import { OUTPUT_TYPE } from "../../../../constants";
import { showConfirm } from "../../../showConfirm";
import { DEFAULT_DECIMAL_POINT } from "../../const";
import { amountToHuman } from "../../../../util/amountToHuman";

export async function confirmSoloRestake(id: string, context: StakingSoloContextType) {
  const { address, amount, decimal, genesisHash, unlocking } = context;

  const isRestakingAll = Number(amountToHuman(unlocking, decimal, DEFAULT_DECIMAL_POINT)) === Number(amount);
  const _amount = isRestakingAll ? unlocking : amount;

  const amountAsBN = amountToMachine(_amount, decimal)
  const { call, params } = await getSoloRestake(address, amountAsBN, genesisHash, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

  await showConfirm('stakeSoloIndexWithUpdate', id, context, call, params)
};