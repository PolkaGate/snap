import type { SnapComponent, TextColors } from '@metamask/snaps-sdk/jsx';
import { Box, Text } from '@metamask/snaps-sdk/jsx';

type Props = {
  label: string;
  extra?: string;
  value: string;
  labelColor?: TextColors;
  extraColor?: TextColors;
  valueColor?: TextColors;
  alignment?: "space-between" | "start" | "center" | "end" | "space-around" | undefined
}

/**
 * A component that shows label, extra, value in a row with adjustable colors .
 *
 * @returns The Row 2 component.
 */
export const Row2: SnapComponent<Props> = ({ alignment, label, extra, value, labelColor = 'muted', extraColor = 'muted', valueColor = 'default' }) => (
  <Box alignment={alignment || "space-between"} direction="horizontal" center>
    <Text color={labelColor}>
      {label}{alignment === 'start' ? ':' : ''}
    </Text>
    <Box alignment="end" direction="horizontal" center>
      {!!extra &&
        <Text color={extraColor}>
          {extra}
        </Text>
      }
      <Text color={valueColor}>
        {value}
      </Text>
    </Box>
  </Box>
);