
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingPoolContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../components/Confirmation";
import { amountToMachine } from "../../../../util/amountToMachine";
import { getPoolStakeMore } from "./util/getPoolStakeMore";
import { OUTPUT_TYPE } from "../../../../constants";

export async function poolStakeMoreConfirm(id: string, context: StakingPoolContextType) {
  const { address, amount, decimal, genesisHash } = context;

  const { call, params } = await getPoolStakeMore(address, amountToMachine(amount, decimal), genesisHash, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;

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