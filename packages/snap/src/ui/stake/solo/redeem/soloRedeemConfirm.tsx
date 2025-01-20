
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingSoloContextType } from "../../types";
import { OUTPUT_TYPE } from "../../../../constants";
import { getRedeemSolo } from "./util/getRedeemSolo";
import { BN } from "@polkadot/util";
import { showConfirm } from "../../../showConfirm";

export async function soloRedeemConfirm(id: string, context: StakingSoloContextType) {
  const { address, active, genesisHash, unlocking } = context;

  const { call, params } = await getRedeemSolo(address, genesisHash, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;
  const returnPage = new BN(active || 0).isZero() && new BN(unlocking || 0).isZero() ? 'stakeIndexWithUpdate' : 'stakeSoloIndexWithUpdate';

  await showConfirm(returnPage, id, context, call, params)
};