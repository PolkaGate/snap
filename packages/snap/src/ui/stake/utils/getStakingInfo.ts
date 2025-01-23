import { HexString } from "@polkadot/util/types";
import { getApi } from "../../../util/getApi";
import { getSnapState, updateSnapState } from "../../../rpc/stateManagement";
import { StakingInfoType } from "../types";

/**
 * get staking info mostly consts.
 *
 * @param genesisHash - The chain genesisHash.
 * @returns The staking info including staking consts and minimumActiveStake.
 */

const STAKING_INFO_VALIDITY_PERIOD = 12 * 60 * 60 * 1000; //ms
export async function getStakingInfo(genesisHash: HexString): Promise<StakingInfoType | null> {
  const stateLabel = `stakingInfo_${genesisHash}`;
  const maybeSavedInfo = await getSnapState(stateLabel);

  if (maybeSavedInfo) {
    const { date, info } = maybeSavedInfo;

    if (Date.now() - date < STAKING_INFO_VALIDITY_PERIOD) {
      console.info('stake info served from local state!')
      return info;
    }
  }
  try {
    const api = await getApi(genesisHash);
    if (!api) {
      throw new Error('cant connect to network, check your internet connection!');
    }

    const minJoinBond = await api.query.nominationPools.minJoinBond();
    const at = await api.rpc.chain.getFinalizedHead();
    const apiAt = await api.at(at);

    const maxNominations = apiAt.consts.staking.maxNominations?.toNumber() || 16;

    const maxNominatorRewardedPerValidator = (apiAt.consts.staking.maxNominatorRewardedPerValidator || apiAt.consts.staking.maxExposurePageSize).toNumber();
    const existentialDeposit = apiAt.consts.balances.existentialDeposit.toNumber();
    const bondingDuration = apiAt.consts.staking.bondingDuration.toNumber();
    const sessionsPerEra = apiAt.consts.staking.sessionsPerEra.toNumber();
    const epochDuration = apiAt.consts.babe.epochDuration.toNumber();
    const expectedBlockTime = api.consts.babe.expectedBlockTime.toNumber();
    const epochDurationInHours = epochDuration * expectedBlockTime / 3600000; // 1000 milSec * 60sec * 60min
    const [minNominatorBond, currentEraIndex, minimumActiveStake] = await Promise.all([
      apiAt.query.staking.minNominatorBond(),
      api.query.staking.currentEra(),
      api.query.staking.minimumActiveStake()
    ]);

    const token = api.registry.chainTokens[0];
    const decimal = api.registry.chainDecimals[0];

    const info = {
      bondingDuration,
      decimal,
      eraIndex: Number(currentEraIndex?.toString() || '0'),
      existentialDeposit,
      maxNominations,
      maxNominatorRewardedPerValidator,
      minNominatorBond: minNominatorBond.toNumber(),
      minJoinBond: minJoinBond.toNumber(),
      minimumActiveStake: minimumActiveStake.toNumber(),
      token,
      eraDuration: sessionsPerEra * epochDurationInHours,
      unbondingDuration: bondingDuration * sessionsPerEra * epochDurationInHours / 24 // unbondingDuration in days
    }

    await updateSnapState(stateLabel, { date: Date.now(), info })

    return info;
  } catch (error) {
   // something went wrong while getStakingInfo.

    return null;
  }
}
