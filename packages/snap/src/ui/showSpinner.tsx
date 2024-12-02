import { Box, Icon, Spinner, Text } from "@metamask/snaps-sdk/jsx";
/**
 * Show an spinner while processing.
 *
 * @param id - The id of interface.
 * @param label - The title to show while spinning.
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
    <Box direction="vertical" alignment="center" center>
      <Spinner />
      <Box direction="horizontal" alignment="center" center>
        <Icon name="loading" size="md" color='muted'/>
        <Text alignment="center">
          {label || 'Processing, Please Wait!'}
        </Text>
      </Box>
    </Box>

  );
};