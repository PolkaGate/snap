
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingSoloContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../components/Confirmation";
import { OUTPUT_TYPE } from "../../../../constants";
import { getRedeemSolo } from "./util/getRedeemSolo";
import { BN } from "@polkadot/util";

export async function soloRedeemConfirm(id: string, context: StakingSoloContextType) {
  const { address, active, genesisHash } = context;

  const { call, params } = await getRedeemSolo(address, genesisHash, OUTPUT_TYPE.CALL_PARAMS) as CallParamsType;


  const keyPair = await getKeyPair(genesisHash);
  const txHash = await call(...(params || [])).signAndSend(keyPair);

  const chainName = await getChainName(genesisHash)
  const returnPage = new BN(active || 0).isZero() ? 'stakeIndex' : 'stakeSoloReviewWithUpdate';

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      context: {
        ...(context || {}),
      },
      ui: (
        <Confirmation
          chainName={chainName}
          button='Done'
          action={returnPage}
          txHash={String(txHash)}
        />
      )
    },
  });
};