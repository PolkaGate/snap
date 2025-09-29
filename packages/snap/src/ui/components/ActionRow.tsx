import { Box, Button, Icon, Text, SnapComponent, IconName } from "@metamask/snaps-sdk/jsx";

interface Props {
  disabled?: boolean;
  icon: `${IconName}`;
  label: string;
  name: string;
  tag?: number;
  variant?: "destructive" | "primary" | undefined
}

export const ActionRow: SnapComponent<Props> = ({ label, name, icon, disabled, tag, variant='primary' }) => (
  <Box direction="horizontal" alignment="space-between" center>
    <Box direction="horizontal" alignment="start" center>
      <Button name={name} variant={variant} type='button' disabled={disabled}>
        <Icon color="muted" size='md' name={icon} />
      </Button>
      <Button name={name} size='sm' variant={variant} type='button' disabled={disabled}>
        {label}
      </Button>
    </Box>
    <Box direction="horizontal" alignment="end" center>
      {!!tag &&
        <Text color="alternative">
          {String(tag)}
        </Text>
      }
      <Button name={name} variant={variant} size='sm' type='button' disabled={disabled}>
        <Icon name='arrow-right' color='muted' size='inherit' />
      </Button>
    </Box>
  </Box>
)