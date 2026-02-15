import { Box, Text, SnapComponent, Image } from "@metamask/snaps-sdk/jsx";
import { getLogoByChainName } from "../image/chains/getLogo";
import { toTitleCase } from "../../utils";
import { sanitizeChainName } from "../../util/getChainName";

interface Props {
  chainName: string;
  label?: string;
}

export const Network: SnapComponent<Props> = ({
  chainName,
  label
}) => {

  const logo = getLogoByChainName(chainName)
  const _chainName = toTitleCase(sanitizeChainName(chainName, true));

  return (
    <Box direction='horizontal' alignment='space-between'>
      <Text color="muted">
        {label || 'Network'}
      </Text>
      <Box direction='horizontal' alignment='end' center>
        <Image src={logo} />
        <Text>
          {_chainName || 'Unknown'}
        </Text>
      </Box>
    </Box>
  );
}