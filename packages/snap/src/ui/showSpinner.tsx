import { Box, Image, Spinner, Text } from "@metamask/snaps-sdk/jsx";
import { clock, working } from "./image/icons";

export const ui = (label?: string, disabled?: boolean) => {

  const isWorking = label?.includes('Working');

  return (
    <Box direction="vertical" alignment="center" center>
      <Image src={isWorking ? working : clock} />
      <Text alignment="center" color="muted">
        {label ?? 'Processing, Please Wait!'}
      </Text>
      <Spinner />
    </Box>
  );
};

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

