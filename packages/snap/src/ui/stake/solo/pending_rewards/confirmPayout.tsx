
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingSoloContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../components/Confirmation";
import { OUTPUT_TYPE } from "../../../../constants";
import { getPayout } from "./util/getPayout";

export async function confirmPayout(id: string, context: StakingSoloContextType) {

  const { address, selectedPayouts, genesisHash } = context;
  const { call, params } = await getPayout(address, genesisHash, selectedPayouts!, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;
  const keyPair = await getKeyPair(genesisHash);
  const txHash = await call(...(params || [])).signAndSend(keyPair);
  const chainName = await getChainName(genesisHash)

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      context: {
        ...(context || {}),
        selectedPayouts: []
      },
      ui: (
        <Confirmation
          action='stakeDetailsSolo'
          chainName={chainName}
          button='Done'
          txHash={String(txHash)}
        />
      )
    },
  });
};