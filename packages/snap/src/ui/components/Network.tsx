import { Box, Text, SnapComponent, Image } from "@metamask/snaps-sdk/jsx";
import { getLogoByChainName } from "../image/chains/getLogoByGenesisHash";
import { toTitleCase } from "../../utils";

interface Props {
  chainName: string;
  label?: string;
}

export const Network: SnapComponent<Props> = ({
  chainName,
  label
}) => {

  const logo = getLogoByChainName(chainName)

  return (
    <Box direction='horizontal' alignment='space-between'>
      <Text color="muted">
        {label || 'Network'}
      </Text>
      <Box direction='horizontal' alignment='end' center>
        <Image src={logo} />
        <Text>
          {toTitleCase(chainName) || 'Unknown'}
        </Text>
      </Box>
    </Box>
  );
}