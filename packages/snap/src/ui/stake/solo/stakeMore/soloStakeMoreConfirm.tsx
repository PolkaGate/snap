
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingSoloContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../components/Confirmation";
import { amountToMachine } from "../../../../util/amountToMachine";
import { getSoloStakeMore } from "./util/getSoloStakeMore";
import { OUTPUT_TYPE } from "../../../../constants";

export async function soloStakeMoreConfirm(id: string, context: StakingSoloContextType) {
  const { address, amount, decimal, genesisHash } = context;

  const amountAsBN = amountToMachine(amount, decimal)
  const { call, params } = await getSoloStakeMore(address, amountAsBN, genesisHash, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

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