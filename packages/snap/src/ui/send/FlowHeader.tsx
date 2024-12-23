import type { SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Box, Button, Heading, Icon, Tooltip } from '@metamask/snaps-sdk/jsx';

type Props={
action:string;
label:string;
tooltip?:string;
}

/**
 * A component that shows the send flow header.
 *
 * @returns The FlowHeader component.
 */
export const FlowHeader: SnapComponent<Props> = ({action , label, tooltip='visit apps.polkagate.xyz for advanced mode!'}) => (
  <Box direction="horizontal" alignment="space-between" center>
    <Button name={action}>
      <Icon name="arrow-left" color="primary" size="md" />
    </Button>
    <Heading>{label}</Heading>
    <Tooltip content={tooltip}>
      <Icon name="info" color="muted" size="md" />
    </Tooltip>
  </Box>
);