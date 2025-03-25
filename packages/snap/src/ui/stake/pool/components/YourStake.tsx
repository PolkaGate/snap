import { Box, Section, Text, Heading, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { ActiveStatus } from "./ActiveStatus";
import { DEFAULT_DECIMAL_POINT } from "../../const";
import { Price } from "../../../components";
import { BN } from "@polkadot/util";

interface Props {
  amount: string | BN | undefined;
  decimal: number;
  nominatorsCount?: number | undefined;
  price: number;
  token: string;
}

/**
 * Renders a section displaying the user's staked amount and its value.
 * 
 * @param amount - The amount currently staked.
 * @param token - The token symbol.
 * @param decimal - The number of decimal places for the token.
 * @param nominatorsCount - The number of nominators in solo staking.
 * @param price - The token price.
 * @returns A JSX element representing the user's stake section.
 */
export const YourStake: SnapComponent<Props> = ({ amount, decimal, nominatorsCount, token, price }) => {
  const hasStake = !!amount && !(new BN(amount).isZero());
  const isActive = nominatorsCount !== undefined ? (!!nominatorsCount && hasStake) : hasStake;

  return (
    <Section>
      <Box direction="horizontal" alignment="space-between" center>
        <Text color="muted">
          Your stake
        </Text>
        <ActiveStatus isActive={isActive} />
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