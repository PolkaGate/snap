import { HexString } from "@polkadot/util/types";
import { amountToMachine } from "../../../util/amountToMachine";
import { getApi } from "../../../util/getApi";
import { checkAndUpdateMetaData } from "../../../rpc";
import { BN_ONE, BN_ZERO } from "@polkadot/util";
import { Balance } from "@polkadot/types/interfaces";
import { StakingDataType } from "../types";


export const getStakingFee = async (
  address: string,
  amount: string | undefined,
  genesisHash: HexString,
  stakingData: StakingDataType | undefined
): Promise<Balance> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }

  checkAndUpdateMetaData(api).catch(console.error);

  const decimal = api.registry.chainDecimals[0];
  const amountAsBN = amountToMachine(amount, decimal);
  let feeAsBalance = api.createType('Balance', BN_ZERO);

  let params;
  let call;

  if (stakingData?.pool) {
    params = [amountAsBN, BN_ONE];
    call = api.tx['nominationPools']['join']; // can add auto compound tx fee as well

  } else {

    const bonded = api.tx['staking']['bond'];
    const bondParams = [amountAsBN, 'Staked'];
    const nominated = api.tx['staking']['nominate'];

    const ids = stakingData.solo.validators;
    call = api.tx['utility']['batchAll'];

    params = [[bonded(...bondParams), nominated(ids)]];
  }

  if (call) {
    const { partialFee } = await call(...params).paymentInfo(address);
    feeAsBalance = api.createType('Balance', partialFee || BN_ZERO);
  }

  return feeAsBalance as Balance;    
}