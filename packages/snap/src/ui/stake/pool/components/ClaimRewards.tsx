import { Box, Section, Text, Button, SnapComponent, Divider } from "@metamask/snaps-sdk/jsx";
import { BN } from "@polkadot/util";
import { amountToHuman } from "../../../../util/amountToHuman";

interface Props {
  amount: string | undefined;
  token: string;
  decimal: number;
  price: number;
}

export const ClaimRewards: SnapComponent<Props> = ({ amount, token, decimal, price }) => (
  <Box>
    {!!amount && !new BN(amount).isZero() &&
      <Box>
        <Divider />
        <Section>
          <Box direction="horizontal" alignment="space-between" center>
            <Box direction="vertical" alignment="start">
              <Text>
                {`${amountToHuman(amount || 0, decimal, 5, true)} ${token}`}
              </Text>
              <Text color="muted">
                ${`${(Number(amountToHuman(amount || 0, decimal)) * price).toFixed(2)}`}
              </Text>
            </Box>
            <Button name='claimRewards' variant='primary' type='button'>
              Claim rewards
            </Button>
          </Box>
        </Section>
      </Box>
    }
  </Box>
)
