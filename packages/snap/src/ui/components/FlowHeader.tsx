import type { SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Box, Button, Heading, Icon, Tooltip } from '@metamask/snaps-sdk/jsx';

type Props = {
  action: string;
  label: string;
  tooltip?: string;
  showHome?: boolean;
  isSubAction?: boolean;
  tooltipType: 'staking' | 'send';
}

/**
 * A component that shows a flow header.
 *
 * @returns The General FlowHeader component.
 */
export const FlowHeader: SnapComponent<Props> = ({ action, label, showHome = false, tooltip, tooltipType, isSubAction }) => {

  const _tooltip = tooltip ||
    (
      tooltipType === 'staking'
        ? 'visit staking.polkadot.cloud for advanced mode!'
        : tooltipType === 'send'
          ? 'visit apps.polkagate.xyz for advanced mode!'
          : ''
    );

  return (
    <Box direction="horizontal" alignment="space-between" center>
      <Button name={action}>
        <Icon name={isSubAction ? "arrow-double-left" : "arrow-2-left"} color="primary" size="md" />
      </Button>
      <Heading>{label}</Heading>
      {showHome
        ? <Button name='backToHome'>
          <Icon name="home" color="muted" size="md" />
        </Button>
        : <Tooltip content={_tooltip}>
          <Icon name="info" color="muted" size="md" />
        </Tooltip>
      }
    </Box>
  )
}