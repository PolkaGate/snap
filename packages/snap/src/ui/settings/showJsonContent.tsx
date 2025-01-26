
import { Text, Box, Button, Container, Footer, Section, Copyable } from '@metamask/snaps-sdk/jsx';
import { getJsonKeyPair } from '../../util';
import { FlowHeader } from '../components/FlowHeader';

const jsonContentUi = (json: string) => {

  return (
    <Container>
      <Box direction='vertical' alignment='start'>
        <FlowHeader
          action='settings'
          label='Export account'
          showHome
        />
        <Text alignment='start' color='muted'>
          Copy and save the following content in a (.json) file. This file can be imported later in extensions and wallets.
        </Text>
        <Section>
          <Copyable value={json} />
        </Section>
      </Box>
      <Footer>
        <Button name='backToHomeWithoutUpdate' variant='destructive'>
          Back
        </Button>
      </Footer>
    </Container>
  );
};


/**
 * This will show the exported account content that can be copied in a file.
 *
 * @param id - The id of UI interface to be updated.
 * @param password - The password to encode the content.
 */
export async function showJsonContent(id: string, password: string | null) {
  if (!password) {
    return;
  }

  const json = await getJsonKeyPair(password);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: jsonContentUi(json)
    },
  });
}