import { Box, Button, Icon, SnapComponent, IconName } from "@metamask/snaps-sdk/jsx";

interface Props {
  label: string;
  name: string;
  icon: IconName;
}

export const StakingAction: SnapComponent<Props> = ({ label, name, icon }) => (
  <Box direction="horizontal" alignment="space-between" center>
    <Box direction="horizontal" alignment="start" center>
      <Button name={name} variant='primary' type='button'>
        <Icon color="muted" name={icon} />
      </Button>
      <Button name={name} variant='primary' type='button'>
          {label}
      </Button>
    </Box>
    <Button name={name} variant='primary' type='button'>
      <Icon name='arrow-right' color='muted' size='md' />
    </Button>
  </Box>
)