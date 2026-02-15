import { Box, Text, Image, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { activeIcon, inActiveIcon } from "../../../image/icons";

interface Props {
  isActive: boolean;
}

export const ActiveStatus: SnapComponent<Props> = ({ isActive }) => {

  return (
    <Box direction="horizontal" alignment="end" center>
      <Image src={isActive ? activeIcon : inActiveIcon} />
      <Text color={isActive ? "success" : 'error'} size="sm">
        {isActive ? 'ACTIVE' : 'INACTIVE'}
      </Text>
    </Box>
  )
}