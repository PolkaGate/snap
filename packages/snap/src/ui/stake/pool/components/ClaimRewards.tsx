import { Box, Section, Text, Button, SnapComponent, Divider } from "@metamask/snaps-sdk/jsx";
import { BN } from "@polkadot/util";
import { amountToHuman } from "../../../../util/amountToHuman";

interface Props {
  amount: string | undefined;
  token: string;
  decimal: number;
  price: number;
}

export const POOL_CLAIMABLE_DECIMAL = 5;

export const ClaimRewards: SnapComponent<Props> = ({ amount, token, decimal, price }) => {
  const hasRewards = !!amount && !new BN(amount).isZero();
  return (
    <Box>
      {hasRewards &&
        <Divider />
      }
      {hasRewards &&
        <Section direction="horizontal" alignment="space-between">
            {/* <Box direction="vertical" alignment="start"> */}
              <Text>
                {`${amountToHuman(amount || 0, decimal, POOL_CLAIMABLE_DECIMAL, true)} ${token}`}
              </Text>
              {/* <Text color="muted">
                ${`${(Number(amountToHuman(amount || 0, decimal)) * price).toFixed(2)}`}
              </Text>
            </Box> */}
            <Button name='claimRewards' variant='primary' type='button'>
              Claim rewards
            </Button>
        </Section>
      }
    </Box>
  )
}
