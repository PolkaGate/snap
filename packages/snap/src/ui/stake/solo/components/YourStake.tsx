import { Box, Section, Text, Heading, Image, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { BN } from "@polkadot/util";
import { activeIcon } from "../../../image/icons";

interface Props {
  amount: string | undefined;
  token: string;
  decimal: number;
  price: number;
}

export const YourStake: SnapComponent<Props> = ({ amount, decimal, token, price }) => (
  <Box>
    {!!amount && !new BN(amount).isZero() &&
      <Section>
        <Box direction="horizontal" alignment="space-between" center>
          <Text color="muted">
            Your stake
          </Text>
          <Box direction="horizontal" alignment="end" center>
            <Image src={activeIcon} />
            <Text color="success">
              ACTIVE
            </Text>
          </Box>
        </Box>
        <Box direction="vertical" alignment="center" center>
          <Heading size="lg">
            {`${amountToHuman(amount, decimal, 3, true)} ${token}`}
          </Heading>
          <Text color="muted">
            ${`${(Number(amountToHuman(amount, decimal)) * price).toFixed(2)}`}
          </Text>
        </Box>
      </Section>
    }
  </Box>
)