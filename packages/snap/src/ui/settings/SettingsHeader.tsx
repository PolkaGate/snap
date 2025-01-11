import type { SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Box, Button, Heading, Icon, Tooltip } from '@metamask/snaps-sdk/jsx';

type Props = {
  action: string;
  label: string;
  isSubAction?: boolean;
  showHome?: boolean;
}

/**
 * A component that shows the more flow header.
 *
 * @returns The Settings FlowHeader component.
 */
export const SettingsHeader: SnapComponent<Props> = ({ action, label, isSubAction, showHome }) => (
  <Box direction="horizontal" alignment="space-between" center>
    <Button name={action}>
      <Icon name={isSubAction ? "arrow-2-left" : "arrow-left"} color="primary" size="md" />
    </Button>
    <Heading>{label}</Heading>
    {showHome
      ? <Button name='backToHomeWithoutUpdate'>
        <Icon name="home" color="muted" size="md" />
      </Button>
      : <Tooltip content='To unlock the full range of features, download the PolkaGate Extension today!'>
        <Icon name="info" color="muted" size="md" />
      </Tooltip>
    }
  </Box>
);