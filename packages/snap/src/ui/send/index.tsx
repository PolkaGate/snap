import { Box, Container } from "@metamask/snaps-sdk/jsx";
import { SendFlowFooter } from "./SendFlowFooter";
import { handleBalancesAll } from "../../util/handleBalancesAll";
import { SendForm } from "./SendForm";
import { SendFormErrors } from "./types";
import { TransactionSummary } from "./TransactionSummary";
import { HexString } from "@polkadot/util/types";
import { amountToHuman } from "../../util/amountToHuman";
import { Balance } from "@polkadot/types/interfaces";
import { getTransferFee } from "./utils";
import { FlowHeader } from "./FlowHeader";

export async function send(
  id: string,
  selectedTokenGenesisHash: string | undefined,
  amount: string | undefined,
  recipient: string | undefined,
  formErrors: SendFormErrors,
  displayClearIcon?: boolean,
  clearAddress?: boolean
) {

  const { address, balancesAll, logos, pricesInUsd } = await handleBalancesAll();
  const nonZeroBalances = balancesAll.filter(({ total }) => !total.isZero());
  const tokenGenesis = selectedTokenGenesisHash?.split(',');
  const maybeSelectedToken = tokenGenesis && balancesAll.find(({ token, genesisHash }) => tokenGenesis[0] === token && tokenGenesis[1] === genesisHash);
  const selectedToken = maybeSelectedToken || nonZeroBalances[0];
  const noError = !formErrors || Object.keys(formErrors).length === 0;
  const formIsFilledOut = amount && recipient;
  const fee: Balance | undefined = tokenGenesis && formIsFilledOut && noError ? await getTransferFee(address, amount, tokenGenesis[1] as HexString, recipient) : undefined;
  const total: number = (fee ? Number(amountToHuman(fee, selectedToken.decimal)) : 0) + (amount ? Number(amount) : 0);
  const selectedTokenPrice = pricesInUsd.find((price) => price.genesisHash === selectedToken.genesisHash)?.price?.value || 0;

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(fee, nonZeroBalances, logos, pricesInUsd, selectedToken, formErrors, displayClearIcon, clearAddress, selectedTokenPrice, total),
      context: {
        transferable: selectedToken.transferable.toString(),
        decimal: selectedToken.decimal
      }
    },
  });
}

const ui = (fee, nonZeroBalances, logos, pricesInUsd, selectedToken, formErrors, displayClearIcon, clearAddress, selectedTokenPrice, total) => {

  return (
    <Container>
      <Box>
        <FlowHeader
          action='backToHome'
          label='Send'
        />
        <SendForm
          clearAddress={clearAddress}
          displayClearIcon={displayClearIcon}
          formErrors={formErrors}
          logos={logos}
          nonZeroBalances={nonZeroBalances}
          pricesInUsd={pricesInUsd}
          selectedToken={selectedToken}
        />
        {fee &&
          <TransactionSummary
            decimal={selectedToken.decimal}
            fee={fee}
            priceInUsd={selectedTokenPrice}
            total={total}
            token={selectedToken.token}
          />
        }
      </Box>
      <SendFlowFooter disabled={!fee} />
    </Container >
  );
};