import { Box, Section, Text, Heading, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { ActiveStatus } from "./ActiveStatus";
import { DEFAULT_DECIMAL_POINT } from "../../const";
import { Price } from "../../../components";

interface Props {
  amount: string | undefined;
  token: string;
  decimal: number;
  price: number;
}

/**
 * Renders a section displaying the user's staked amount and its value.
 * 
 * @param amount - The amount currently staked.
 * @param token - The token symbol.
 * @param decimal - The number of decimal places for the token.
 * @param price - The token price.
 * @returns A JSX element representing the user's stake section.
 */
export const YourStake: SnapComponent<Props> = ({ amount, decimal, token, price }) => {

  return (
    <Section>
      <Box direction="horizontal" alignment="space-between" center>
        <Text color="muted">
          Your stake
        </Text>
        <ActiveStatus amount={amount} />
      </Box>
      <Box direction="vertical" alignment="center" center>
        <Heading size="lg">
          {`${amountToHuman(amount, decimal, DEFAULT_DECIMAL_POINT, true)} ${token}`}
        </Heading>
        <Price
          amount={amount}
          decimal={decimal}
          price={price}
        />
      </Box>
    </Section>
  )
}