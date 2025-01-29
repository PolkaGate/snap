import type { SnapComponent, TextColors } from '@metamask/snaps-sdk/jsx';
import { Address, Avatar, Box, Text } from '@metamask/snaps-sdk/jsx';

type Props = {
  alignment?: "space-between" | "start" | "center" | "end" | "space-around" | undefined
  label: string;
  labelColor?: TextColors;
  address: `0x${string}`;
  labelSize?: 'sm' | 'md' | undefined;
}

/**
 * A component that shows label, address in a row with adjustable color .
 *
 * @returns The AddressRow component.
 */
export const AddressRow: SnapComponent<Props> = ({ alignment, label, labelColor = 'muted', labelSize, address}) => (
  <Box alignment={alignment || "space-between"} direction="horizontal" center>
    <Text color={labelColor} size={labelSize}>
      {label}{alignment === 'start' ? ':' : ''}
    </Text>

    <Address address={`${address}`} />
  </Box >
);