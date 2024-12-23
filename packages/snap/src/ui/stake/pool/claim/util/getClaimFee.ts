import { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import { BN_ZERO } from "@polkadot/util";
import { Balance } from "@polkadot/types/interfaces";


export const getClaimFee = async (
  address: string,
  genesisHash: HexString,
  restakeRewards: boolean | undefined
): Promise<Balance> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  let feeAsBalance = api.createType('Balance', BN_ZERO);

  let params = [];
  let call = api.tx['nominationPools']['claimPayout'];

  if (restakeRewards) {
    params = ['Rewards'];
    call = api.tx['nominationPools']['bondExtra'];
  }

  if (call) {
    const { partialFee } = await call(...params).paymentInfo(address);
    feeAsBalance = api.createType('Balance', partialFee || BN_ZERO);
  }

  return feeAsBalance as Balance;
}