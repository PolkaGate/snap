import { HexString } from "@polkadot/util/types";
import { getApi } from "../../../../../util/getApi";
import { Balance } from "@polkadot/types/interfaces";
import { OUTPUT_TYPE } from "../../../../../constants";
import { handleOutput } from "../../../../../util/handleOutput";
import { CallParamsType } from "../../../types";

const INTER_BLOCK_SPACE = 6; // sec

export const getNominate = async (
  address: string,
  genesisHash: HexString,
  selectedValidators: string[],
  output?: OUTPUT_TYPE
): Promise<CallParamsType | { fee: Balance, changeEffectiveAt: number }> => {

  const api = await getApi(genesisHash);
  if (!api) {
    throw new Error('cant connect to network, check your internet connection!');
  }



  let call = api.tx['staking']['nominate'];
  let params = [selectedValidators];

  let result = await handleOutput(address, api, call, params, output);

  let changeEffectiveAt;
  if (output === OUTPUT_TYPE.FEE) {
    const { eraLength, eraProgress } = await api.derive.session.progress();
    const remainingToTheEndOfEra = eraLength.sub(eraProgress).muln(INTER_BLOCK_SPACE);
    changeEffectiveAt = Date.now() + Number(remainingToTheEndOfEra.muln(1000));

    return {
      fee: result as Balance,
      changeEffectiveAt: changeEffectiveAt
    }
  }

  return result as CallParamsType;

}