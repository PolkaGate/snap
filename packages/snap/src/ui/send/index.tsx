import { Box, Container } from "@metamask/snaps-sdk/jsx";
import { SendFlowFooter } from "./components/SendFlowFooter";
import { BALANCE_FETCH_TYPE, handleBalancesAll } from "../../util/handleBalancesAll";
import { SendForm } from "./components/SendForm";
import { SendContextType, SendFormErrors } from "./types";
import { TransactionSummary } from "./components/TransactionSummary";
import type { HexString } from "@polkadot/util/types";
import { amountToHuman } from "../../util/amountToHuman";
import type { Balance } from "@polkadot/types/interfaces";
import { FlowHeader } from "../components/FlowHeader";
import { getTransfer } from "./utils/getTransfer";
import type { Balances } from "../../util";
import { PriceValue } from "../../util/getPrices";

const ui = (
  fee: Balance | undefined,
  tokensToList: Balances[] | undefined,
  logos: { genesisHash: HexString; logo: string; }[],
  pricesInUsd: { genesisHash: HexString; price: PriceValue; }[],
  recipient: string | undefined,
  selectedToken: Balances | undefined,
  formErrors: SendFormErrors,
  displayClearIcon: boolean | undefined,
  clearAddress: boolean | undefined,
  selectedTokenPrice: number,
  total: number
) => {

  return (
    <Container>
      <Box>
        <FlowHeader
          action='backToHome'
          label='Send'
          tooltipType="send"
        />
        <SendForm
          clearAddress={clearAddress}
          displayClearIcon={displayClearIcon}
          formErrors={formErrors}
          logos={logos}
          tokensToList={tokensToList}
          pricesInUsd={pricesInUsd}
          selectedToken={selectedToken}
          recipient={recipient}
        />
        {!!fee && !!selectedToken &&
          <TransactionSummary
            decimal={selectedToken.decimal}
            fee={fee}
            priceInUsd={selectedTokenPrice}
            total={total}
            token={selectedToken.token}
          />
        }
      </Box>
      <SendFlowFooter
        disabled={!fee}
      />
    </Container >
  );
};

export async function send(
  id: string,
  context: SendContextType,
  amount: number | undefined,
  formErrors: SendFormErrors,
  recipient: string | undefined,
  selectedTokenGenesisHash: string | undefined,
  displayClearIcon?: boolean,
  clearAddress?: boolean,
) {

  const { address, balancesAll, logos, pricesInUsd } = await handleBalancesAll(BALANCE_FETCH_TYPE.SAVED_ONLY);
  const maybeNonZeroBalances = balancesAll.filter(({ total }) => !total.isZero());
  const tokensToList = maybeNonZeroBalances?.length ? maybeNonZeroBalances : balancesAll;
  const tokenGenesis = selectedTokenGenesisHash?.split(',');
  const maybeSelectedToken = tokenGenesis && balancesAll.find(({ token, genesisHash }) => tokenGenesis[0] === token && tokenGenesis[1] === genesisHash);
  const selectedToken = maybeSelectedToken || tokensToList?.[0];
  const noError = !formErrors || Object.keys(formErrors).length === 0;
  const formIsFilledOut = !!amount && Number(amount) !== 0 && !!recipient;

  const fee = tokenGenesis && formIsFilledOut && noError && !clearAddress
    ? await getTransfer(address, amount, tokenGenesis[1] as HexString, recipient) as Balance
    : undefined;

  const total: number =
    (fee && selectedToken ? Number(amountToHuman(fee, selectedToken.decimal)) : 0) +
    (amount ? Number(amount) : 0);

  const selectedTokenPrice = pricesInUsd.find((price) => price.genesisHash === selectedToken?.genesisHash)?.price?.value || 0;

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(fee, tokensToList, logos, pricesInUsd, recipient, selectedToken, formErrors, displayClearIcon, clearAddress, selectedTokenPrice, total),
      context: {
        ...(context ?? {}),
        address,
        amount,
        decimal: selectedToken?.decimal,
        fee: fee ? fee?.toString() : undefined,
        genesisHash: selectedToken?.genesisHash,
        price: selectedTokenPrice,
        recipient,
        token: selectedToken?.token,
        transferable: selectedToken?.transferable?.toString(),
      }
    },
  });
}