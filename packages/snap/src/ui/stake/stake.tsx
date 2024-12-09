import { Box, Container } from "@metamask/snaps-sdk/jsx";
import { SendFlowFooter } from "../send/SendFlowFooter";
import { handleBalancesAll } from "../../util/handleBalancesAll";
import { SendFormErrors } from "../send/types";
import { TransactionSummary } from "../send/TransactionSummary";
import { HexString } from "@polkadot/util/types";
import { amountToHuman } from "../../util/amountToHuman";
import { Balance } from "@polkadot/types/interfaces";
import { FlowHeader } from "../send/FlowHeader";
import { StakeForm } from "./StakeForm";
import { getStakingInfo } from "./utils";
import { Balances } from "../../util";
import { PriceValue } from "../../util/getPrices";

export async function stake(
  id: string,
  selectedTokenGenesisHash: string | undefined,
  amount: string | undefined,
  formErrors: SendFormErrors,
  contextStakingInfo?:any
) {

  const { address, balancesAll, logos, pricesInUsd } = await handleBalancesAll();
  const nonZeroBalances = balancesAll.filter(({ total }) => !total.isZero());
  const defaultTokenGenesis = `${nonZeroBalances[0].token},${nonZeroBalances[0].genesisHash}`;
  const tokenGenesis = (selectedTokenGenesisHash || defaultTokenGenesis).split(',');
  const maybeSelectedToken = tokenGenesis && balancesAll.find(({ token, genesisHash }) => tokenGenesis[0] === token && tokenGenesis[1] === genesisHash);
  const selectedToken = maybeSelectedToken || nonZeroBalances[0];
  const noError = !formErrors || Object.keys(formErrors).length === 0;

  let stakingInfo = contextStakingInfo;
  if (tokenGenesis && contextStakingInfo?.token !== selectedToken.token) { // if token has changed fetch staking info again
     stakingInfo = await getStakingInfo(address, amount, tokenGenesis[1] as HexString);
  }


  const showTransactionSummary = amount !== undefined && !!Number(amount) && stakingInfo?.fee !== undefined && noError;
  const total: number = (stakingInfo?.fee ? Number(amountToHuman(stakingInfo.fee, selectedToken.decimal)) : 0) + (amount ? Number(amount) : 0);
  const selectedTokenPrice = pricesInUsd.find((price) => price.genesisHash === selectedToken.genesisHash)?.price?.value || 0;

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(stakingInfo?.fee, nonZeroBalances, logos, pricesInUsd, selectedToken, formErrors, showTransactionSummary, selectedTokenPrice, total),
      context: {
        decimal: selectedToken.decimal,
        stakingInfo,
        transferable: selectedToken.transferable.toString(),
      }
    },
  });
}

const ui = (
  fee: Balance | undefined,
  nonZeroBalances: Balances[],
  logos: { genesisHash: string; logo: string; }[],
  pricesInUsd: { genesisHash: HexString; price: PriceValue; }[],
  selectedToken: Balances,
  formErrors: SendFormErrors,
  showTransactionSummary: boolean,
  selectedTokenPrice: number,
  total: number,
) => {

  return (
    <Container>
      <Box>
        <FlowHeader
          action='backToHome'
          label='Stake'
        />
        <StakeForm
          formErrors={formErrors}
          logos={logos}
          nonZeroBalances={nonZeroBalances}
          pricesInUsd={pricesInUsd}
          selectedToken={selectedToken}
        />
        {!!showTransactionSummary && !!fee &&
          <TransactionSummary
            decimal={selectedToken.decimal}
            fee={fee}
            priceInUsd={selectedTokenPrice}
            total={total}
            token={selectedToken.token}
          />
        }
      </Box>
      <SendFlowFooter disabled={!fee} name='stakeReview' />
    </Container >
  );
};