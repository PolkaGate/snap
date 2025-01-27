import type { SnapComponent, TextColors } from '@metamask/snaps-sdk/jsx';
import { Box, Text } from '@metamask/snaps-sdk/jsx';

type Props = {
  alignment?: "space-between" | "start" | "center" | "end" | "space-around" | undefined
  extra?: string;
  extraColor?: TextColors;
  label: string;
  labelColor?: TextColors;
  value: string;
  valueColor?: TextColors;
  labelSize?: 'sm' | 'md' | undefined;
  valueSize?: 'sm' | 'md' | undefined;
  extraSize?: 'sm' | 'md' | undefined;
}

/**
 * A component that shows label, extra, value in a row with adjustable colors .
 *
 * @returns The Row 2 component.
 */
export const Row2: SnapComponent<Props> = ({ alignment, label, labelColor = 'muted', extra, extraColor = 'alternative', labelSize,valueSize,extraSize, value, valueColor = 'default' }) => (
  <Box alignment={alignment || "space-between"} direction="horizontal" center>
    <Text color={labelColor} size={labelSize}>
      {label}{alignment === 'start' ? ':' : ''}
    </Text>

    <Box alignment="end" direction="horizontal" center>
      {!!extra &&
        <Text color={extraColor} size={extraSize}>
          {extra}
        </Text>
      }
      <Text color={valueColor} size={valueSize}>
        {value}
      </Text>
    </Box>
  </Box>
);