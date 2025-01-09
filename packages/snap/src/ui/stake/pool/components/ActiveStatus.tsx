import { Box, Text, Image, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { BN } from "@polkadot/util";
import { activeIcon, inActiveIcon } from "../../../image/icons";

interface Props {
  amount: string | BN | undefined;
}

export const ActiveStatus: SnapComponent<Props> = ({ amount }) => {
  const isActive = !!amount && !new BN(amount).isZero();

  return (
    <Box direction="horizontal" alignment="end" center>
      <Image src={isActive ? activeIcon : inActiveIcon} />
      <Text color={isActive ? "success" : 'error'}>
        {isActive ? 'ACTIVE' : 'INACTIVE'}
      </Text>
    </Box>
  )
}