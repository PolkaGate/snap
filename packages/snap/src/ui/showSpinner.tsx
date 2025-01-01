import { Box, Button, Container, Footer, Image, Spinner, Text } from "@metamask/snaps-sdk/jsx";
import { clock, working } from "./image/icons";
import { FlowHeader } from "./components/FlowHeader";

/**
 * Show an spinner while processing.
 *
 * @param id - The id of interface.
 * @param label - The title to show while spinning.
 */

export async function showSpinner(id: string, label?: string, disabled?: boolean) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(label, disabled)
    },
  });
}

export const ui = (label?: string, disabled?: boolean) => {

  const isWorking = label?.includes('Working');

  return (
    <Container>
      <Box>
        <FlowHeader
          action='backToHomeWithoutUpdate'
          label=' '
          showHome
        />
        <Box direction="vertical" alignment="center" center>
          <Image src={isWorking ? working : clock} />
          <Text alignment="center" color="muted">
            {label || 'Processing, Please Wait!'}
          </Text>
          <Spinner />
        </Box>
      </Box>
      <Footer>
        <Button name='backToHomeWithoutUpdate' variant="destructive" disabled={disabled}>
          Cancel
        </Button>
      </Footer>
    </Container>
  );
};