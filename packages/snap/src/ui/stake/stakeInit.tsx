import { Box, Container, Section, Text, Footer, Button, Icon } from "@metamask/snaps-sdk/jsx";
import { HexString } from "@polkadot/util/types";
import { amountToHuman } from "../../util/amountToHuman";
import { getBalances, getKeyPair } from "../../util";
import { getLogoByGenesisHash } from "../image/chains/getLogoByGenesisHash";
import { getSnapState } from "../../rpc/stateManagement";
import { StakeForm } from "./components/StakeForm";
import { POLKAGATE_POOL_IDS } from "./const";
import { Row2 } from "./components/Row2";
import { PoolSelectorFormState, StakeFormErrors, StakeTypeFormState, StakingDataType, StakingInitContextType } from "./types";
import { ellipsis } from "./components/PoolSelector";
import { isEmptyObject } from "../../utils";
import { FlowHeader } from "../components/FlowHeader";
import { areArraysEqual } from "../../util/areArraysEqual";

interface NewSelectionType {
  selectPoolForm: PoolSelectorFormState | undefined;
  selectedValidators: HexString[] | undefined;
}

export async function stakeInit(
  id: string,
  formAmount: number | undefined,
  formErrors: StakeFormErrors,
  context: StakingInitContextType,
  newSelection: NewSelectionType,
  stakeTypeForm: StakeTypeFormState
) {

  const { address, amount, genesisHash, logo, price, recommendedValidators, rate, sanitizedChainName, stakingRates, stakingInfo, transferable } = context;
  const _amount = formAmount !== undefined ? String(formAmount) : amount;

  const decimal = stakingInfo!.decimal;
  const token = stakingInfo!.token;

  const minimumActiveStake = stakingInfo?.minimumActiveStake
  const minimumActiveStakeInHuman = Number(amountToHuman(minimumActiveStake, decimal) || 0);
  const stakingType = stakeTypeForm?.stakingTypeOptions || (Number(_amount) < minimumActiveStakeInHuman ? 'Pool' : 'Solo');

  const DEFAULT_STAKING_DATA = {
    type: stakingType,
    pool: {
      id: POLKAGATE_POOL_IDS[genesisHash],
      name: '❤️ PolkaGate | https://polkagate.xyz'
    },
    solo: {
      validators: recommendedValidators[sanitizedChainName]
    }
  };

  const _address = address || (await getKeyPair(undefined, genesisHash)).address;
  const _logo = logo || await getLogoByGenesisHash(genesisHash);

  let _transferable = transferable;

  if (!(_transferable)) {
    const balances = await getBalances(genesisHash, _address)
    _transferable = balances.transferable.toString();
  }

  let _price = price;
  let _rate = rate;

  if (_price === undefined || !_rate) {
    const priceInfo = await getSnapState('priceInfo');

    _price = priceInfo?.prices?.[sanitizedChainName]?.value || 0;
    _rate = stakingRates?.[sanitizedChainName || ''] || 0;
  }

  let isRecommended = true;

  let maybeSelectedStakingData: StakingDataType | undefined = undefined;
  const { selectPoolForm, selectedValidators } = newSelection;

  if (selectPoolForm || selectedValidators) {
    if (selectPoolForm) {
      const [id, name] = selectPoolForm.poolSelector.split(',');
      maybeSelectedStakingData = { type: 'Pool', pool: { id: Number(id), name } }
      isRecommended = Number(id) === DEFAULT_STAKING_DATA.pool.id;
    } else {
      maybeSelectedStakingData = { type: 'Solo', solo: { validators: selectedValidators } }
      isRecommended = areArraysEqual(selectedValidators, DEFAULT_STAKING_DATA.solo.validators)
    }
  }

  const stakingData = maybeSelectedStakingData || DEFAULT_STAKING_DATA;

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      context: {
        ...(context || {}),
        address: _address,
        amount: _amount,
        decimal,
        genesisHash,
        logo: _logo,
        price: _price!,
        rate: _rate!,
        transferable: _transferable!,
        token,
        stakingData,
        DEFAULT_STAKING_DATA
      },
      id,
      ui: ui(_amount, decimal, formErrors, _logo, token, _transferable, _price, stakingType, _rate, stakingData, isRecommended, DEFAULT_STAKING_DATA),
    },
  });
}

const ui = (
  amount: string | undefined,
  decimal: number,
  formErrors: StakeFormErrors,
  logo: string,
  token: string,
  transferable: string,
  price: number,
  stakingType: string,
  rate: number | undefined,
  stakingData: StakingDataType,
  isRecommended: boolean,
  DEFAULT_STAKING_DATA
) => {


  return (
    <Container>
      <Box>
        <FlowHeader
          action='stakeIndex'
          label={`Stake ${token}`}
          showHome
          tooltipType='staking'
        />
        <StakeForm
          amount={amount}
          decimal={decimal}
          formErrors={formErrors}
          logo={logo}
          token={token}
          transferable={transferable}
          price={price}
        />
        {!!stakingType && !!amount &&
          <Box direction="vertical">
            <Section>
              <Box alignment="space-between" direction="horizontal" center>
                <Box direction="vertical" alignment="start">
                  <Text>
                    {stakingType} staking
                  </Text>
                  <Text color={isRecommended ? 'success' : 'muted'}>
                    {
                      isRecommended
                        ? 'Recommended'
                        : stakingData.pool
                          ? ellipsis(stakingData.pool?.name || 'Unknown')
                          : `Validators: ${stakingData.solo?.validators?.length} of ${DEFAULT_STAKING_DATA.solo.validators.length}`
                    }
                  </Text>
                </Box>
                <Button name='stakingType' variant='primary'>
                  <Icon name='arrow-right' color='muted' size='md' />
                </Button>
              </Box>
            </Section>
            <Row2
              label='Estimated rewards'
              extra={`${String(rate || 0)} %`}
              extraColor="success"
              value=' / year'
              valueColor='muted'
            />
          </Box>
        }
      </Box>
      <Footer>
        <Button name='stakeFirstTimeReview' disabled={!Number(amount) || !isEmptyObject(formErrors)}>
          Continue
        </Button>
      </Footer>
    </Container >
  );
};