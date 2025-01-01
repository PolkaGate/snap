import { Box, Button, Icon, SnapComponent, IconName } from "@metamask/snaps-sdk/jsx";

interface Props {
  label: string;
  name: string;
  icon: `${IconName}`;
  disabled?: boolean;
}

export const ActionRow: SnapComponent<Props> = ({ label, name, icon, disabled }) => (
  <Box direction="horizontal" alignment="space-between" center>
    <Box direction="horizontal" alignment="start" center>
      <Button name={name} variant='primary' type='button' disabled={disabled}>
        <Icon color="muted" size='md' name={icon} />
      </Button>
      <Button name={name} variant='primary' type='button' disabled={disabled}>
        {label}
      </Button>
    </Box>
    <Button name={name} variant='primary' type='button' disabled={disabled}>
      <Icon name='arrow-right' color='muted' size='md' />
    </Button>
  </Box>
)