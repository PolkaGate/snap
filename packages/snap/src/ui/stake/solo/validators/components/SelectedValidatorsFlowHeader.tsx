import type { SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Box, Button, Heading, Icon } from '@metamask/snaps-sdk/jsx';

type Props = {
  action: string;
  label: string;
}

/**
 * A component that shows a flow header.
 *
 * @returns The General FlowHeader component.
 */
export const SelectedValidatorsFlowHeader: SnapComponent<Props> = ({ action, label }) => {

  return (
    <Box direction="horizontal" alignment="space-between" center>
      <Button name={action}>
        <Icon name="arrow-2-left" color="primary" size="md" />
      </Button>
      <Heading>
        {label}
      </Heading>
      <Button name='changeValidators'>
        Change
      </Button>
    </Box>
  )
}