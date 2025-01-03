
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingPoolContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../send/Confirmation";
import { amountToMachine } from "../../../../util/amountToMachine";
import { amountToHuman } from "../../../../util/amountToHuman";
import { STAKED_AMOUNT_DECIMAL_POINT } from "../../components/UnstakeForm";
import { getPoolUnstake } from "./util/getPoolUnstake";
import { OUTPUT_TYPE } from "../../../../constants";
import { BN } from "@polkadot/util";

export async function poolUnstakeConfirm(id: string, context: StakingPoolContextType) {
  const { address, active, amount, decimal, genesisHash, poolId } = context;

  let amountAsBN = amountToMachine(amount, decimal);

  if (active && Number(amountToHuman(active, decimal, STAKED_AMOUNT_DECIMAL_POINT)) === Number(amount)) { // if wants unstake all
    amountAsBN = new BN(active);
  }

  const { call, params } = await getPoolUnstake(address, amountAsBN, genesisHash, poolId, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

  const keyPair = await getKeyPair(genesisHash);
  const txHash = await call(...(params || [])).signAndSend(keyPair);

  const chainName = await getChainName(genesisHash)

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      context: {
        ...(context || {}),
      },
      id,
      ui: (
        <Confirmation
          action='stakePoolReviewWithUpdate'
          button='Done'
          chainName={chainName}
          txHash={String(txHash)}
        />
      )
    },
  });
};