
// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CallParamsType, StakingSoloContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../send/Confirmation";
import { GET_PAYEE_OUTPUT_TYPE, getPayee } from "./util/getPayee";

export async function rewardsDestinationConfirm(id: string, context: StakingSoloContextType) {
  const { address, genesisHash, payee } = context;

  const { call, params } = await getPayee(address, genesisHash, GET_PAYEE_OUTPUT_TYPE.CALL_PARAMS, payee?.maybeNew) as CallParamsType;

  const keyPair = await getKeyPair(genesisHash);
  const txHash = await call(...(params || [])).signAndSend(keyPair);

  const chainName = await getChainName(genesisHash)

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      context: {
        ...(context || {}),
        payee: {} // to reset payee on confirm which force to fetch payee again on stakeSoloReview
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