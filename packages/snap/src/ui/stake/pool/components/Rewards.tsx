import { Box, Section, Text, Heading, Image, SnapComponent, Divider, Button } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../../util/amountToHuman";
import { pool } from "../../../image/icons";
import { BN } from "@polkadot/util";
import { updateSvgDimensions } from "../../../../util/updateSvgDimensions";

interface Props {
  amount?: BN;
  decimal: number;
  price: number;
  token: string;
  claimable: string;
}

export const POOL_CLAIMABLE_DECIMAL = 5;

export const Rewards: SnapComponent<Props> = ({ amount, decimal, price, token, claimable }) => {
  const hasClaimable = !!claimable && !new BN(claimable).isZero();

  return (
    <Section>
      <Box direction="horizontal" alignment="space-between" center>
        <Box direction="vertical" alignment="start">
          <Text color="muted">
            Rewards all
          </Text>
          <Heading size="md">
            {`${amountToHuman(amount || 0, decimal, 3, true)} ${token}`}
          </Heading>
          <Text color="alternative">
            ${`${(Number(amountToHuman(amount || 0, decimal)) * price).toFixed(2)}`}
          </Text>
        </Box>
        <Image src={updateSvgDimensions(pool, 80)} />
      </Box>

      {hasClaimable &&
        <Divider />
      }
      {hasClaimable &&
        <Box direction="horizontal" alignment="space-around">
          <Heading size="sm">
            {`${amountToHuman(claimable || 0, decimal, POOL_CLAIMABLE_DECIMAL, true)} ${token}`}
          </Heading>
          <Button name='claimRewards' variant='primary' type='button'>
            Claim rewards
          </Button>
        </Box>
      }

    </Section>
  )
}