
import { Text, Box, Button, Container, Field, Footer, Form, Input, Section } from '@metamask/snaps-sdk/jsx';
import { SettingsHeader } from './SettingsHeader';

/**
 * This will show the alert to get password to export account as JSON file.
 *
 * @param id - The id of UI interface to be updated.
 */
export async function exportAccount(id: string, maybePassword?: string) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(maybePassword)
    },
  });
}

const ui = (maybePassword?: string) => {

  return (
    <Container>
      <Box direction='vertical' alignment='start'>
        <SettingsHeader
          action='settings'
          label='Export account'
          isSubAction
          showHome
        />
        <Text alignment='start' color='muted'>
          Here, you can export your account as a JSON file, which can be used to import your account in another extension or wallet.
        </Text>
        <Section>
          <Form name='exportAccountForm'>
            <Field
              label='Enter a password to encrypt your data'
              error={!maybePassword ? 'Password can not be empty' : undefined}
            >
              <Input name='exportAccountPassword' placeholder='password ...' type='password' />
            </Field>
          </Form>
        </Section>
      </Box>
      <Footer>
        <Button name='exportAccount' variant='primary' disabled={!maybePassword}>
          Export
        </Button>
      </Footer>
    </Container>
  );
};