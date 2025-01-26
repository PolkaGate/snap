import { Box, Container, Section, Footer, Button } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import type { Balance } from "@polkadot/types/interfaces";
import { Row2 } from "../../components/Row2";
import { StakingSoloContextType } from "../../types";
import { Account } from "../../../components/Account";
import { FlowHeader } from "../../../components/FlowHeader";
import { getNominate } from "./util/getNominate";
import { InfoRow } from "../../components/InfoRow";
import { OUTPUT_TYPE } from "../../../../constants";

const ui = (
  fee: Balance,
  context: StakingSoloContextType,
  changeEffectiveAt: number
) => {

  let { address, decimal, genesisHash, token, price, selectedValidators, recommendedValidatorsOnThisChain } = context;
  const feeInUsd = Number(amountToHuman(fee, decimal)) * price;

  const remainingTime = new Date(changeEffectiveAt - Date.now());
  const hours = remainingTime.getUTCHours();
  const minutes = remainingTime.getUTCMinutes();
  const timeString = `${hours} hrs ${minutes} mins`;

  return (
    <Container>
      <Box>
        <FlowHeader
          action='yourValidators'
          label='Change validators'
          tooltipType="staking"
        />
        <Section>
          <Account
            address={address}
            genesisHash={genesisHash}
          />
          <Row2
            label='Network fee'
            value={`${amountToHuman(String(fee), decimal, 4, true)} ${token}`}
            extra={`$${feeInUsd.toFixed(2)}`}
          />
        </Section>
        <Section>
          <Row2
            label='Selected validators'
            value={`${selectedValidators!.length} (max ${recommendedValidatorsOnThisChain.length})`}
          />
        </Section>
        <InfoRow text={`Your validators will take effect in ${timeString}`} />
      </Box>
      <Footer>
        <Button name='changeValidatorsConfirm'>
          Confirm
        </Button>
      </Footer>
    </Container >
  );
};

export async function reviewChangeValidators(id: string, context: StakingSoloContextType) {

  let { address, genesisHash, selectedValidators } = context;
  const { fee, changeEffectiveAt } = await getNominate(address, genesisHash, selectedValidators!, OUTPUT_TYPE.FEE) as { fee: Balance; changeEffectiveAt: number; };

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(fee, context, changeEffectiveAt),
      context: {
        ...(context ?? {})
      }
    },
  });
}