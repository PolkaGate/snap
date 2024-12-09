
import { getJsonKeyPair } from '../util';
import { Text, Box, Button, Container, Divider, Field, Footer, Form, Heading, Icon, Input, Section, Copyable } from '@metamask/snaps-sdk/jsx';

/**
 * This will show the alert to get password to export account as JSON file.
 *
 * @param id - The id of UI interface to be updated.
 */
export async function exportAccount(id: string) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui()
    },
  });
}

const ui = () => {

  return (
    <Container>
      <Box direction='vertical' alignment='start'>
        <Section>
          <Box direction='horizontal' alignment='start'>
            <Icon name='export' size='md' />
            <Heading>Export Account!</Heading>
          </Box>
          <Divider />
          <Text alignment='start'> Here, you can export your account as a JSON file, which can be used to import your account in another extension or wallet.</Text>
          <Box>
            <Form name='saveExportedAccount'>
              <Field label='Enter a password to encrypt your data' error='Password can not be empty'>
                <Input name='password' placeholder='password ...' type='password' />
              </Field>
              <Button name='exportAccountBtn' type='submit' variant='primary'>
                Export
              </Button>
            </Form>
          </Box>
        </Section>
      </Box>
      <Footer>
        <Button name='backToHome' variant='destructive'>
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

const jsonContentUi = (json: string) => {

  return (
    <Container>
      <Box direction='vertical' alignment='start'>
        <Section>
          <Box direction='horizontal' alignment='start'>
            <Icon name='export' size='md' />
            <Heading>Export Account!</Heading>
          </Box>
          <Divider />
          <Text alignment='start'>Copy and save the following content in a (.json) file. This file can be imported later in extensions and wallets.</Text>
          <Copyable value={json} />
        </Section>
      </Box>
      <Footer>
        <Button name='backToHome' variant='destructive'>
          Back
        </Button>
      </Footer>
    </Container>
  );
};
