// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { UserInputEventType } from '@metamask/snaps-sdk';
import type { OnUserInputHandler } from '@metamask/snaps-sdk';
import {
  showSpinner,
  home,
  voting,
  stakingIndex
} from '../ui';
import { updateSnapState } from '../rpc/stateManagement';
import { settings } from '../ui/settings';
import { receive } from '../ui/receive';
import { send } from '../ui/send';
import { PayoutSelectionFormState, SendFormState } from '../ui/send/types';
import { formValidation } from '../ui/send/utils/utils';
import { reviewSend } from '../ui/send/reviewSend';
import type { HexString } from '@polkadot/util/types';
import { CustomizeChains } from '../ui/selectChains/CustomizeChains';
import { SelectedChainsFormState } from '../ui/selectChains/types';
import { BALANCE_FETCH_TYPE } from '../util/handleBalancesAll';
import { PoolSelectorFormState, StakeFormState, StakeMoreFormState } from '../ui/stake/types';
import { stakeInit } from '../ui/stake/stakeInit';
import { DEFAULT_CHAINS_GENESIS } from '../constants';
import { stakePoolFormValidation } from '../ui/stake/utils/stakePoolFormValidation';
import { stakingInfo } from '../ui/stake/stakingInfo';
import { stakeFirstTimeReview } from '../ui/stake/stakeFirstTimeReview';
import { stakeType } from '../ui/stake/stakeType';
import { selectValidators } from '../ui/stake/selectValidators';
import { confirmStake } from '../ui/stake/confirmStake';
import { stakePoolIndex } from '../ui/stake/pool';
import { claim } from '../ui/stake/pool/claim/claim';
import { confirmClaim } from '../ui/stake/pool/claim/confirmClaim';
import { poolStakeMore } from '../ui/stake/pool/stakeMore/poolStakeMore';
import { poolStakeMoreReview } from '../ui/stake/pool/stakeMore/poolStakeMoreReview';
import { poolStakeMoreConfirm } from '../ui/stake/pool/stakeMore/poolStakeMoreConfirm';
import { poolUnstake } from '../ui/stake/pool/unstake';
import { unstakePoolFormValidation } from '../ui/stake/pool/unstake/util/unstakePoolFormValidation';
import { stakeMorePoolFormValidation } from '../ui/stake/pool/stakeMore/util/stakeMorePoolFormValidation';
import { PoolUnstakeFormState } from '../ui/stake/pool/unstake/types';
import { poolUnstakeReview } from '../ui/stake/pool/unstake/poolUnstakeReview';
import { poolUnstakeConfirm } from '../ui/stake/pool/unstake/poolUnstakeConfirm';
import { confirmSend } from '../ui/send/confirmSend';
import { poolRedeem } from '../ui/stake/pool/redeem/poolRedeem';
import { poolRedeemConfirm } from '../ui/stake/pool/redeem/poolRedeemConfirm';
import { exportAccount } from '../ui/settings/exportAccount';
import { showJsonContent } from '../ui/settings/showJsonContent';
import { stakeSoloIndex } from '../ui/stake/solo';
import { soloRedeem } from '../ui/stake/solo/redeem';
import { soloRedeemConfirm } from '../ui/stake/solo/redeem/soloRedeemConfirm';
import { soloStakeMore } from '../ui/stake/solo/stakeMore';
import { soloStakeMoreReview } from '../ui/stake/solo/stakeMore/soloStakeMoreReview';
import { soloStakeMoreConfirm } from '../ui/stake/solo/stakeMore/soloStakeMoreConfirm';
import { StakeMoreSoloFormState, stakeMoreSoloFormValidation } from '../ui/stake/solo/stakeMore/util/stakeMoreSoloFormValidation';
import { soloUnstake } from '../ui/stake/solo/unstake';
import { soloUnstakeReview } from '../ui/stake/solo/unstake/soloUnstakeReview';
import { soloUnstakeConfirm } from '../ui/stake/solo/unstake/soloUnstakeConfirm';
import { unstakeSoloFormValidation } from '../ui/stake/solo/unstake/util/unstakeSoloFormValidation';
import { rewardsDestination } from '../ui/stake/solo/rewards';
import { rewardsDestinationReview } from '../ui/stake/solo/rewards/rewardsDestinationReview';
import { rewardsDestinationConfirm } from '../ui/stake/solo/rewards/rewardsDestinationConfirm';
import type { SoloUnstakeFormState } from '../ui/stake/solo/unstake/types';
import { yourValidators } from '../ui/stake/solo/validators';
import { changeValidators } from '../ui/stake/solo/validators/changeValidators';
import { reviewChangeValidators } from '../ui/stake/solo/validators/reviewChangeValidators';
import { confirmChangeValidators } from '../ui/stake/solo/validators/confirmChangeValidators';
import { pendingRewards } from '../ui/stake/solo/pending_rewards';
import { confirmPayout } from '../ui/stake/solo/pending_rewards/confirmPayout';
import { reviewPayout } from '../ui/stake/solo/pending_rewards/reviewPayout';

export const onUserInput: OnUserInputHandler = async ({ id, event, context }) => {

  const state = await snap.request({
    method: 'snap_getInterfaceState',
    params: { id },
  });

  const sendForm = state.sendForm as unknown as SendFormState;
  const stakeForm = state.stakeForm as unknown as StakeFormState;

  if (event.type === UserInputEventType.ButtonClickEvent || event.type === UserInputEventType.InputChangeEvent) {

    let eventName = event.name;
    let maybeGenesisHash: HexString | undefined = undefined;

    if (eventName?.includes(',')) {
      [eventName, maybeGenesisHash] = eventName.split(',') as [string, HexString];
    }

    switch (eventName) {
      //===================================HOME===================================//
      case 'balanceDetails':
        await home(id, BALANCE_FETCH_TYPE.RECENTLY_FETCHED, context?.show === undefined ? true : !context.show);
        break;

      case 'hideBalance':
      case 'showBalance':
        const shouldHide = eventName === 'hideBalance';
        await updateSnapState('hideBalance', shouldHide);
        await home(id);
        break;

      case 'backToHomeWithoutUpdate':
        await showSpinner(id, 'Loading, please wait ...');
        await home(id, BALANCE_FETCH_TYPE.SAVED_ONLY);
        break;

      case 'refreshBalances':
      case 'backToHomeWithUpdate':
        await showSpinner(id, 'Updating, please wait ...');
        await home(id, BALANCE_FETCH_TYPE.FORCE_UPDATE);
        break;

      case 'backToHome':
        await showSpinner(id, 'Loading, please wait ...');
        await home(id);
        break;

      //===================================CUSTOMIZE CHAINS===================================//
      case 'refreshSelectedChains':
        await showSpinner(id, 'Resetting, please wait ...');
        await updateSnapState('selectedChains', DEFAULT_CHAINS_GENESIS);
      case 'customizeChains':
        await showSpinner(id, 'Loading, please wait ...');
        await CustomizeChains(id);
        break;

      case 'applySelectedChains':
        await showSpinner(id, 'Applying, please wait ...');
        const selectedChains = state.selectedChains as SelectedChainsFormState;
        const filtered = Object.entries(selectedChains).filter(([key, value]) => value).map(([key]) => key);
        await updateSnapState('selectedChains', filtered);
        await home(id);
        break;

      //===================================RECEIVE===================================//
      case 'receive':
        await receive(id);
        break;

      case 'switchChain': {
        const genesisHash = event.value;
        await updateSnapState('currentGenesisHash', genesisHash);
        await receive(id, genesisHash);
        break;
      }

      //===================================SEND FUND===================================//
      case 'send':
      case 'tokenSelector':
      case 'amount':
      case 'clear':
      case 'to':
        {
          const formErrors = formValidation(sendForm, context);
          const clearAddress = event.name === 'clear';
          const displayClearIcon = !clearAddress && sendForm && Boolean(sendForm.to) && sendForm.to !== '';

          await send(id, context, sendForm?.amount, formErrors, sendForm?.to?.trim(), sendForm?.tokenSelector, displayClearIcon, clearAddress);
          break;
        }

      case 'sendReview':
        await showSpinner(id, 'Loading, please wait ...');
        const { tokenSelector, amount, to } = sendForm;
        const genesisHash = tokenSelector.split(',')[1] as HexString;
        await reviewSend(id, genesisHash, amount, to, context);
        break;

      case 'sendConfirm':
        await showSpinner(id, 'Working, please wait ...');
        await confirmSend(id, context);
        break;

      //===================================STAKING===================================//
      case 'enableTestnetStaking':
        const testNetStaking = state.testNetStaking as SelectedChainsFormState;
        await updateSnapState('enableTestnetStaking', testNetStaking.enableTestnetStaking);
      case 'stakeIndex':
        await showSpinner(id, 'Loading, please wait ...');
        await stakingIndex(id);
        break;

      case 'stakeIndexWithUpdate':
        await showSpinner(id, 'Loading, please wait ...');
        await stakingIndex(id, BALANCE_FETCH_TYPE.FORCE_UPDATE);
        break;

      case 'stakingInfo':
        await showSpinner(id, 'Loading, please wait ...');
        await stakingInfo(id, maybeGenesisHash!, context);
        break;

      case 'stakeInitWithSelectedValidators':
      case 'stakeInit':
        await showSpinner(id, 'Loading, please wait ...');
      case 'stakeAmount':
        {
          const formErrors = stakePoolFormValidation(stakeForm, context);
          const selectPoolForm = state.selectPoolForm as PoolSelectorFormState;
          const newSelection = {
            selectPoolForm,
            selectedValidators: eventName === 'stakeInitWithSelectedValidators' ? context.selectedValidators : undefined
          }
          await stakeInit(id, stakeForm?.stakeAmount, formErrors, context, newSelection);
          break;
        }
      case 'stakingType':
        await showSpinner(id, 'Loading, please wait ...');
      case 'stakingTypeOptions':
        const [__, stakingTypeOption] = event.name.split(',');

        if (stakingTypeOption === 'Pool') {
          await showSpinner(id, 'Loading, please wait ...');
        }
        await stakeType(id, context, stakingTypeOption);
        break;

      case 'stakeFirstTimeReview':
        await showSpinner(id, 'Loading, please wait ...');
        await stakeFirstTimeReview(id, context);
        break;

      case 'stakeConfirm':
        await showSpinner(id, 'Working, please wait ...', true);
        await confirmStake(id, context);
        break;

      // POOL 
      case 'stakePoolIndex':
        await showSpinner(id, 'Loading, please wait ...');
        await stakePoolIndex(id, context, maybeGenesisHash);
        break;

      case 'stakePoolIndexWithUpdate':
        await showSpinner(id, 'Updating, please wait ...');
        await stakePoolIndex(id, context, maybeGenesisHash, BALANCE_FETCH_TYPE.FORCE_UPDATE);
        break;

      // SOLO 
      case 'stakeSoloIndex':
        await showSpinner(id, 'Loading, please wait ...');
        await stakeSoloIndex(id, context, maybeGenesisHash);
        break;

      case 'stakeSoloIndexWithUpdate':
        await showSpinner(id, 'Updating, please wait ...');
        await stakeSoloIndex(id, context, maybeGenesisHash, BALANCE_FETCH_TYPE.FORCE_UPDATE);
        break;

      /** ----------------------------claim--------------------------------- */
      case 'claimRewards':
        await showSpinner(id, 'Loading, please wait ...');
      case 'restakeRewards':
        await claim(id, context, state.poolClaimableRestakeForm?.restakeRewards);
        break;

      case 'claimConfirm':
        await showSpinner(id, 'Working, please wait ...');
        await confirmClaim(id, context);
        break;

      /** ----------------------------redeem--------------------------------- */

      // SOLO
      case 'soloRedeem':
        await showSpinner(id, 'Loading, please wait ...');
        await soloRedeem(id, context);
        break;

      case 'soloRedeemConfirm':
        await showSpinner(id, 'Working, please wait ...');
        await soloRedeemConfirm(id, context);
        break;

      // POOL
      case 'poolRedeem':
        await showSpinner(id, 'Loading, please wait ...');
        await poolRedeem(id, context);
        break;

      case 'poolRedeemConfirm':
        await showSpinner(id, 'Working, please wait ...');
        await poolRedeemConfirm(id, context);
        break;

      /** ---------------------------- stake more--------------------------------- */

      // SOLO
      case 'soloStakeMore':
        await showSpinner(id, 'Loading, please wait ...');
      case 'stakeMoreAmountSolo':
        {
          const stakeMoreForm = state.stakeForm as StakeMoreSoloFormState;
          const formErrors = stakeMoreSoloFormValidation(stakeMoreForm, context);
          await soloStakeMore(id, stakeMoreForm?.stakeMoreAmountSolo, formErrors, context);
          break;
        }

      case 'soloStakeMoreReview':
        await showSpinner(id, 'Loading, please wait ...');
        await soloStakeMoreReview(id, context);
        break;

      case 'soloStakeMoreConfirm':
        await showSpinner(id, 'Working, please wait ...');
        await soloStakeMoreConfirm(id, context);
        break;

      // POOL
      case 'poolStakeMore':
        await showSpinner(id, 'Loading, please wait ...');
      case 'stakeMoreAmount':
        {
          const stakeMoreForm = state.stakeForm as StakeMoreFormState;
          const formErrors = stakeMorePoolFormValidation(stakeMoreForm, context);
          await poolStakeMore(id, stakeMoreForm?.stakeMoreAmount, formErrors, context);
          break;
        }

      case 'poolStakeMoreReview':
        await showSpinner(id, 'Loading, please wait ...');
        await poolStakeMoreReview(id, context);
        break;

      case 'poolStakeMoreConfirm':
        await showSpinner(id, 'Working, please wait ...');
        await poolStakeMoreConfirm(id, context);
        break;
      /** ---------------------------- unstake--------------------------------- */

      // SOLO      
      case 'soloUnstake':
        await showSpinner(id, 'Loading, please wait ...');
      case 'soloUnstakeAmount':
        {
          const unstakeForm = state.unstakeForm as unknown as SoloUnstakeFormState;
          const formErrors = unstakeSoloFormValidation(unstakeForm, context);
          await soloUnstake(id, unstakeForm?.soloUnstakeAmount, formErrors, context);
          break;
        }

      case 'soloUnstakeReview':
        await showSpinner(id, 'Loading, please wait ...');
        await soloUnstakeReview(id, context);
        break;

      case 'soloUnstakeConfirm':
        await showSpinner(id, 'Working, please wait ...');
        await soloUnstakeConfirm(id, context);
        break;

      // POOL
      case 'poolUnstake':
        await showSpinner(id, 'Loading, please wait ...');
      case 'poolUnstakeAmount':
        {
          const unstakeForm = state.unstakeForm as unknown as PoolUnstakeFormState;
          const formErrors = unstakePoolFormValidation(unstakeForm, context);
          await poolUnstake(id, unstakeForm?.poolUnstakeAmount, formErrors, context);
          break;
        }

      case 'poolUnstakeReview':
        await showSpinner(id, 'Loading, please wait ...');
        await poolUnstakeReview(id, context);
        break;

      case 'poolUnstakeConfirm':
        await showSpinner(id, 'Working, please wait ...');
        await poolUnstakeConfirm(id, context);
        break;

      /** ---------------------------- rewardsDestination--------------------------------- */
      case 'rewardsDestination':
      case 'rewardsDestinationOptions':
        const [_, option] = event.name.split(',');

        await showSpinner(id, 'Loading, please wait ...');

        await rewardsDestination(id, context, option);
        break;

      case 'rewardsDestinationReview':
        await showSpinner(id);
        await rewardsDestinationReview(id, context);
        break;

      case 'rewardsDestinationConfirm':
        await showSpinner(id, 'Working, please wait ...', true);
        await rewardsDestinationConfirm(id, context);
        break;

      /** ---------------------------- Validators--------------------------------- */
      case 'changeValidatorsByMySelf':
      case 'selectValidators':
        await showSpinner(id, 'Loading, please wait ...');
      case 'selectedValidator':
        const selectedValidators = eventName === 'changeValidatorsByMySelf'
          ? context.nominators
          : state.validatorSelectionForm && Object.entries(state.validatorSelectionForm).filter(([, value]) => value).map(([key]) => key.split(',')[1])
        await selectValidators(id, context, selectedValidators);
        break;

      case 'selectValidatorsShow':
        await selectValidators(id, context, context.selectedValidators, true);
        break;

      case 'changeValidatorsByRecommended':
        await showSpinner(id, 'Loading, please wait ...');
        await selectValidators(id, context, context.recommendedValidatorsOnThisChain, true);
        break;

      case 'yourValidators':
        await showSpinner(id, 'Loading, please wait ...');
        await yourValidators(id, context);
        break;

      case 'changeValidators':
        await showSpinner(id, 'Loading, please wait ...');
        await changeValidators(id, context);
        break;

      case 'changeValidatorsReview':
        await showSpinner(id, 'Loading, please wait ...');
        await reviewChangeValidators(id, context);
        break;

      case 'changeValidatorsConfirm':
        await showSpinner(id, 'Loading, please wait ...');
        await confirmChangeValidators(id, context);
        break;

      /** ---------------------------- Rewards Solo--------------------------------- */
      case 'pendingRewards':
        await showSpinner(id, 'Loading, please wait ...');
      case 'selectAllToPayOut':
      case 'selectedPendingReward':

        let selectedPayouts = [] as string[];
        if (['selectAllToPayOut', 'selectedPendingReward'].includes(eventName)) {
          const payoutSelectionForm = state.payoutSelectionForm as PayoutSelectionFormState;

          selectedPayouts =
            eventName === 'selectAllToPayOut'
              ? (state.selectAllToPayOutForm as PayoutSelectionFormState).selectAllToPayOut
                ? Object.entries(payoutSelectionForm).map(([key]) => key.substring(key.indexOf(',') + 1)) // select all
                : [] // deselect all
              : Object.entries(payoutSelectionForm).filter(([, value]) => value).map(([key]) => key.substring(key.indexOf(',') + 1))
        }

        await pendingRewards(id, context, selectedPayouts);
        break;

      case 'payoutReview':
        await showSpinner(id, 'Loading, please wait ...');
        await reviewPayout(id, context);
        break;

      case 'payoutConfirm':
        await showSpinner(id, 'Working, please wait ...');
        await confirmPayout(id, context);
        break;

      //===================================OTHERS===================================//
      case 'vote':
        await voting(id);
        break;

      case 'settings':
        await settings(id);
        break;

      /** ---------------------------- Export Account --------------------------------- */
      case 'export':
      case 'exportAccountPassword':
        const exportPasswordForm = state.exportAccountForm;

        await exportAccount(id, exportPasswordForm?.exportAccountPassword);
        break;

      case 'exportAccount':
        {
          const exportPasswordForm = state.exportAccountForm as unknown as StakeFormState;
          await showSpinner(id, 'Exporting, please wait ...');
          await showJsonContent(id, exportPasswordForm?.exportAccountPassword as string);
          break;
        }

      default:
        break;
    }
  }
};
