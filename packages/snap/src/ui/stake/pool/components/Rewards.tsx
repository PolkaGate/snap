import { Box, Section, Text, Heading, Image, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { pool } from "../../../image/icons";
import { ClaimRewards } from "./ClaimRewards";
import { BN } from "@polkadot/util";

interface Props {
  amount?: BN;
  decimal: number;
  price: number;
  token: string;
  claimable: string;
}

export const Rewards: SnapComponent<Props> = (({ amount, decimal, price, token, claimable }) =>
  <Section>
    <Box direction="horizontal" alignment="space-between" center>
      <Box direction="vertical" alignment="start">
        <Text color="muted">
          Rewards
        </Text>
        <Heading size="md">
          {`${amountToHuman(amount || 0, decimal, 3, true)} ${token}`}
        </Heading>
        <Text color="muted">
          ${`${(Number(amountToHuman(amount || 0, decimal)) * price).toFixed(2)}`}
        </Text>
      </Box>
      <Image src={pool} />
    </Box>
    <ClaimRewards
      decimal={decimal}
      token={token}
      price={price}
      amount={claimable}
    />
  </Section>
)