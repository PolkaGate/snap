import type { SnapComponent, TextColors } from '@metamask/snaps-sdk/jsx';
import { Box, Text } from '@metamask/snaps-sdk/jsx';

type Props = {
  label: string;
  extra?: string;
  value: string;
  labelColor?: TextColors;
  extraColor?: TextColors;
  valueColor?: TextColors;
}

/**
 * A component that shows label, extra, value in a row with adjustable colors .
 *
 * @returns The Row 2 component.
 */
export const Row2: SnapComponent<Props> = ({ label, extra, value, labelColor='muted',  extraColor='muted',  valueColor='default' }) => (
  <Box alignment="space-between" direction="horizontal" center>
    <Text color={labelColor}>
      {label}
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