
// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StakingSoloContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../send/Confirmation";
import { amountToMachine } from "../../../../util/amountToMachine";
import { amountToHuman } from "../../../../util/amountToHuman";
import { STAKED_AMOUNT_DECIMAL_POINT } from "../../components/UnstakeForm";
import { OUTPUT_TYPE } from "../../../../constants";
import { BN } from "@polkadot/util";
import { getSoloUnstake } from "./util/getSoloUnstake";

export async function soloUnstakeConfirm(id: string, context: StakingSoloContextType) {
  const { address, active, amount, decimal, genesisHash } = context;

  let amountAsBN = amountToMachine(amount, decimal);

  if (Number(amountToHuman(active, decimal, STAKED_AMOUNT_DECIMAL_POINT)) === Number(amount)) { // if wants unstake all
    amountAsBN = new BN(active);
  }

  const { call, params } = await getSoloUnstake(address, amountAsBN, genesisHash, OUTPUT_TYPE.CALL_PARAMS);

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
          action='stakeSoloReviewWithUpdate'
          button='Done'
          chainName={chainName}
          txHash={String(txHash)}
        />
      )
    },
  });
};