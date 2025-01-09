import { Box, Button, Icon, Text, SnapComponent, IconName } from "@metamask/snaps-sdk/jsx";

interface Props {
  disabled?: boolean;
  icon: `${IconName}`;
  label: string;
  name: string;
  tag?: number;
}

export const ActionRow: SnapComponent<Props> = ({ label, name, icon, disabled, tag }) => (
  <Box direction="horizontal" alignment="space-between" center>
    <Box direction="horizontal" alignment="start" center>
      <Button name={name} variant='primary' type='button' disabled={disabled}>
        <Icon color="muted" size='md' name={icon} />
      </Button>
      <Button name={name} variant='primary' type='button' disabled={disabled}>
        {label}
      </Button>
    </Box>
    <Box direction="horizontal" alignment="end" center>
      {!!tag &&
        <Text color="muted">
          {String(tag)}
        </Text>
      }
      <Button name={name} variant='primary' type='button' disabled={disabled}>
        <Icon name='arrow-right' color='muted' size='md' />
      </Button>
    </Box>
  </Box>
)