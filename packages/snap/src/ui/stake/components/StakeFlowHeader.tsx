import type { SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Box, Button, Heading, Icon, Tooltip } from '@metamask/snaps-sdk/jsx';

type Props = {
  action: string;
  label: string;
  tooltip?: string;
  showHome?: boolean;
  isSubAction?: boolean;
}

/**
 * A component that shows the staking flow header.
 *
 * @returns The StakeFlowHeader component.
 */
export const StakeFlowHeader: SnapComponent<Props> = ({ action, label, showHome = false, tooltip = 'visit staking.polkadot.cloud for advanced mode!', isSubAction }) => (
  <Box direction="horizontal" alignment="space-between" center>
    <Button name={action}>
      <Icon name={isSubAction ? "arrow-2-left" : "arrow-left"} color="primary" size="md" />
    </Button>
    <Heading>{label}</Heading>
    {showHome
      ? <Button name='backToHome'>
        <Icon name="home" color="muted" size="md" />
      </Button>
      : <Tooltip content={tooltip}>
        <Icon name="info" color="muted" size="md" />
      </Tooltip>
    }
  </Box>
);