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
import { showMore } from '../ui/more';
import { receive } from '../ui/receive';
import { balanceDetails } from '../ui/home/balanceDetails';
import { send } from '../ui/send';
import { SendFormState } from '../ui/send/types';
import { formValidation } from '../ui/send/utils';
import { approveSend } from '../ui/send/approveSend';
import { HexString } from '@polkadot/util/types';
import { CustomizeChains } from '../ui/selectChains/CustomizeChains';
import { SelectedChainsFormState } from '../ui/selectChains/types';
import { BALANCE_FETCH_TYPE } from '../util/handleBalancesAll';
import { PoolSelectorFormState, StakeFormState, StakeMoreFormState, StakeTypeFormState } from '../ui/stake/types';
import { stakeInit } from '../ui/stake/stakeInit';
import { DEFAULT_CHAINS_GENESIS } from '../constants';
import { stakePoolFormValidation } from '../ui/stake/utils/stakePoolFormValidation';
import { stakingInfo } from '../ui/stake/stakingInfo';
import { stakeFirstTimeReview } from '../ui/stake/stakeFirstTimeReview';
import { stakeType } from '../ui/stake/stakeType';
import { selectValidators } from '../ui/stake/selectValidators';
import { confirmStake } from '../ui/stake/confirmStake';
import { stakePoolReview } from '../ui/stake/pool/stakePoolReview';
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
import { sendConfirmation } from '../ui/send/sendConfirmation';
import { poolRedeem } from '../ui/stake/pool/redeem/poolRedeem';
import { poolRedeemConfirm } from '../ui/stake/pool/redeem/poolRedeemConfirm';
import { exportAccount } from '../ui/more/exportAccount';
import { showJsonContent } from '../ui/more/showJsonContent';
import { stakeSoloReview } from '../ui/stake/solo';
import { soloRedeem } from '../ui/stake/solo/redeem/soloRedeem';
import { soloRedeemConfirm } from '../ui/stake/solo/redeem/soloRedeemConfirm';
import { soloStakeMore } from '../ui/stake/solo/stakeMore/soloStakeMore';
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
import { SoloUnstakeFormState } from '../ui/stake/solo/unstake/types';


export const onUserInput: OnUserInputHandler = async ({ id, event, context }) => {

  const state = await snap.request({
    method: 'snap_getInterfaceState',
    params: { id },
  });

  const sendForm = state.sendForm as unknown as SendFormState;
  const stakeForm = state.stakeForm as unknown as StakeFormState;

  if (event.type === UserInputEventType.ButtonClickEvent || event.type === UserInputEventType.InputChangeEvent) {

    let eventName = event.name;
    let maybeGenesisHash: HexString;

    if (eventName?.includes(',')) {
      [eventName, maybeGenesisHash] = eventName.split(',');
    }

    switch (eventName) {
      //===================================HOME===================================//
      case 'balanceDetails':
        await balanceDetails(id, context?.show === undefined ? true : !context.show);
        break;

      case 'hideBalance':
        await updateSnapState('hideBalance', true);
        await home(id);
        break;

      case 'showBalance':
        await updateSnapState('hideBalance', false);
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

          await send(id, sendForm?.amount, formErrors, sendForm?.to, sendForm?.tokenSelector, displayClearIcon, clearAddress);
          break;
        }

      case 'sendReview':
        await showSpinner(id, 'Loading, please wait ...');
        const { tokenSelector, amount, to } = sendForm;
        const genesisHash = tokenSelector.split(',')[1] as HexString;
        await approveSend(id, genesisHash, amount, to);
        break;

      case 'confirmSend':
        await showSpinner(id, 'Working, please wait ...');
        await sendConfirmation(id, context.payload);
        break;

      //===================================STAKING===================================//
      case 'enableTestnetStaking':
        const testNetStaking = state.testNetStaking as SelectedChainsFormState;
        await updateSnapState('enableTestnetStaking', testNetStaking.enableTestnetStaking);
      case 'stakeIndex':
        await showSpinner(id, 'Loading, please wait ...');
        await stakingIndex(id);
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
          const stakeTypeForm = state.stakeTypeForm as StakeTypeFormState;

          const formErrors = stakePoolFormValidation(stakeForm, context);
          const selectPoolForm = state.selectPoolForm as PoolSelectorFormState;
          const newSelection = {
            selectPoolForm,
            selectedValidators: eventName === 'stakeInitWithSelectedValidators' ? context.selectedValidators : undefined
          }
          await stakeInit(id, stakeForm?.stakeAmount, formErrors, context, newSelection, stakeTypeForm);
          break;
        }
      case 'stakingType':
        await showSpinner(id, 'Loading, please wait ...');
      case 'stakingTypeOptions':
        const stakeTypeForm = state.stakeTypeForm as StakeTypeFormState;
        if (stakeTypeForm?.stakingTypeOptions === 'Pool') {
          await showSpinner(id, 'Loading, please wait ...');
        }
        await stakeType(id, context, stakeTypeForm);
        break;

      case 'selectValidators':
        await showSpinner(id, 'Loading, please wait ...');
      case 'selectedValidator':
        const validatorSelectionForm = state.validatorSelectionForm as StakeTypeFormState;
        await selectValidators(id, context, validatorSelectionForm);
        break;

      case 'selectValidatorsShow':
        {
          const validatorSelectionForm = state.validatorSelectionForm as StakeTypeFormState;
          await selectValidators(id, context, validatorSelectionForm, true);
          break;
        }

      case 'stakeFirstTimeReview':
        await showSpinner(id, 'Loading, please wait ...');
        await stakeFirstTimeReview(id, context);
        break;

      case 'stakeConfirm':
        await showSpinner(id, 'Working, please wait ...', true);
        await confirmStake(id, context);
        break;

      // POOL 
      case 'stakeDetailsPool':
        await showSpinner(id, 'Loading, please wait ...');
        await stakePoolReview(id, context, maybeGenesisHash);
        break;

      case 'stakePoolReviewWithUpdate':
        await showSpinner(id, 'Updating, please wait ...');
        await stakePoolReview(id, context, maybeGenesisHash, true);
        break;

      // SOLO 
      case 'stakeDetailsSolo':
        await showSpinner(id, 'Loading, please wait ...');
        await stakeSoloReview(id, context, maybeGenesisHash);
        break;

      case 'stakeSoloReviewWithUpdate':
        await showSpinner(id, 'Updating, please wait ...');
        await stakeSoloReview(id, context, maybeGenesisHash, true);
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

      //===================================OTHERS===================================//
      case 'vote':
        await voting(id);
        break;

      case 'more':
        await showMore(id);
        break;

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
