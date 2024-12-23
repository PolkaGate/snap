
// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getApi } from "../../../../util/getApi";
import { StakingInitContextType } from "../../types";
import { getKeyPair } from "../../../../util";
import getChainName from "../../../../util/getChainName";
import { Confirmation } from "../../../send/Confirmation";
import { amountToMachine } from "../../../../util/amountToMachine";
import { BN } from "@polkadot/util";
import { amountToHuman } from "../../../../util/amountToHuman";
import { STAKED_AMOUNT_DECIMAL_POINT } from "../../components/UnstakeForm";
import { getPoolUnstake } from "./util/getPoolUnstake";
import { OUTPUT_TYPE } from "../../../../constants";

export async function poolUnstakeConfirm(id: string, context: StakingInitContextType) {
  const { address, amount, claimable, decimal, genesisHash, pooledBalance, poolId } = context;
  const api = await getApi(genesisHash);
  const netStaked = new BN(pooledBalance!).sub(new BN(claimable || 0));

  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  let amountAsBN = amountToMachine(amount, decimal);
  if (amountToHuman(netStaked, decimal, STAKED_AMOUNT_DECIMAL_POINT) === amount) { // if wants unstake all
    amountAsBN = netStaked
  }

  let { call, params } = await getPoolUnstake(address, amountToMachine(amount, decimal), genesisHash, poolId, OUTPUT_TYPE.CALL_PARAMS);

  const keyPair = await getKeyPair(genesisHash);
  const txHash = await call(...(params || [])).signAndSend(keyPair);

  const chainName = await getChainName(genesisHash)

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <Confirmation
          chainName={chainName}
          txHash={String(txHash)}
        />
      )
    },
  });
};