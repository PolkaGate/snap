import { Box, Text, Button, SnapComponent, Divider } from "@metamask/snaps-sdk/jsx";
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
        <Box direction="horizontal" alignment="space-around">
          <Text>
            {`${amountToHuman(amount || 0, decimal, POOL_CLAIMABLE_DECIMAL, true)} ${token}`}
          </Text>
          <Button name='claimRewards' variant='primary' type='button'>
            Claim rewards
          </Button>
        </Box>
      }
    </Box>
  )
}
