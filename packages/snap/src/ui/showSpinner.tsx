import { Box, Spinner, Text } from "@metamask/snaps-sdk/jsx";
/**
 * Show an spinner while processing.
 *
 * @param id - The id of interface.
 * @param title - The title to show while spinning.
 */
export async function showSpinner(id: string, label?: string) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(label)
    },
  });
}

export const ui = (label?: string) => {

  return (
    <Box direction="vertical" alignment="center">
      <Spinner />
      <Text>
        {label || 'Processing, Please Wait!'}
      </Text>
    </Box>
  );
};