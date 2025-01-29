import { Box, Text, SnapComponent, Address } from "@metamask/snaps-sdk/jsx";
import { getFormatted } from "../../util/getFormatted";
import type { HexString } from "@polkadot/util/types";

interface Props {
  address: string;
  genesisHash: HexString;
  label?: string;
}

export const Account: SnapComponent<Props> = ({
  address,
  genesisHash,
  label
}) => {

  const formatted = getFormatted(genesisHash, address);

  return (
    <Box direction='horizontal' alignment='space-between'>
      <Text color="muted">
        {label ?? 'Account'}
      </Text>
      <Address address={`polkadot:91b171bb158e2d3848fa23a9f1c25182:${formatted}`} />
    </Box>
  );
}