import { Box, Section, Text, Heading, Image, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { solo } from "../../../image/icons";
import { BN } from "@polkadot/util";
import { updateSvgDimensions } from "../../../../util/updateSvgDimensions";
import { Price } from "../../../components";

interface Props {
  amount?: BN;
  decimal: number;
  price: number;
  token: string;
  claimable: string;
}

export const Rewards: SnapComponent<Props> = (({ amount, decimal, price, token }) =>
  <Section>
    <Box direction="horizontal" alignment="space-between" center>
      <Box direction="vertical" alignment="start">
        <Text color="muted">
          Rewards
        </Text>
        <Heading size="md">
          {`${amountToHuman(amount || '0', decimal, 3, true)} ${token}`}
        </Heading>
        <Price
          amount={amount}
          decimal={decimal}
          price={price}
        />
      </Box>
      <Image src={updateSvgDimensions(solo, 80)} />
    </Box>
  </Section>
)