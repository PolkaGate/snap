import { Box, Section, Text, Heading, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { ActiveStatus } from "./ActiveStatus";
import { STAKED_AMOUNT_DECIMAL_POINT } from "../../const";

interface Props {
  amount: string | undefined;
  token: string;
  decimal: number;
  price: number;
}

export const YourStake: SnapComponent<Props> = ({ amount, decimal, token, price }) => {

  return (
    <Box>
      <Section>
        <Box direction="horizontal" alignment="space-between" center>
          <Text color="muted">
            Your stake
          </Text>
          <ActiveStatus amount={amount} />
        </Box>
        <Box direction="vertical" alignment="center" center>
          <Heading size="lg">
            {`${amountToHuman(amount, decimal, STAKED_AMOUNT_DECIMAL_POINT, true)} ${token}`}
          </Heading>
          <Text color="muted">
            ${`${(Number(amountToHuman(amount, decimal)) * price).toFixed(2)}`}
          </Text>
        </Box>
      </Section>
    </Box>
  )
}