import { Box, Button, SnapComponent, Link, Icon, Section, Footer, Container, Text, Image } from "@metamask/snaps-sdk/jsx";
import { ActionRow } from "../components/ActionRow";
import { book, currency, email, github, language, telegram, twitter, web, youtube } from "../image/icons";
import { getKeyPair } from "../../util";
import { FlowHeader } from "../components/FlowHeader";

type LinkProps = {
  icon: string;
  link: string;
  label: string;
}

const LinkItem: SnapComponent<LinkProps> = ({ icon, link, label }: LinkProps) => (
  <Box direction="horizontal" alignment="start">
    <Image src={icon} />
    <Link href={link}>
      {label}
    </Link>
  </Box>
);

interface PreferenceProps {
  icon: string;
  label: string;
  value: string;
}

const Preference: SnapComponent<PreferenceProps> = ({ icon, label, value }) => (
  <Box direction="horizontal" alignment="space-between">
    <Box direction="horizontal" alignment="start" center>
      <Image src={icon} />
      <Text color="muted" size='sm'>
        {label}
      </Text>
    </Box>
    <Text>
      {value}
    </Text>
  </Box>
);

const ui = (address: string) => {

  return (
    <Container>
      <Box direction="vertical" alignment="start">
        <FlowHeader
          action='backToHomeWithoutUpdate'
          label='Settings'
          tooltip='To unlock the full range of features, download the PolkaGate Extension today!'
        />

        <Text color='muted' size="sm">
          WALLET
        </Text>
        <Section>
          <ActionRow
            label='Export Account as JSON File'
            name='export'
            icon='export'
          />
          <ActionRow
            label='Register Account'
            name='register'
            icon='link'
          />
          <Box direction="horizontal" alignment="start">
            <Icon color="muted" size='md' name='explore' />
            <Link href={`https://portfolio.subscan.io/account/${address}`}>
              View Account on Explorer
            </Link>
          </Box>
        </Section>

        <Text color='muted' size="sm">
          PREFERENCES
        </Text>
        <Section>
          <Preference icon={currency} label='Currency' value='USD' />
          <Preference icon={language} label='Language' value='English' />
        </Section>

        <Text color='muted' size="sm">
          SUPPORT & FEEDBACK
        </Text>
        <Section>
          <LinkItem icon={book} link='https://docs.polkagate.xyz/polkagate/metamask-snap-user-guide/installing-polkagate-snap' label={'Wiki & Help Center'} />
          <LinkItem icon={email} link='mailto:support@polkagate.xyz' label={'Contact Us'} />
        </Section>

        <Text color='muted' size="sm">
          COMMUNITY
        </Text>
        <Section>
          <LinkItem icon={twitter} link='https://x.com/@polkagate' label={'X'} />
          <LinkItem icon={telegram} link='https://t.me/polkagate' label={'Telegram'} />
          <LinkItem icon={youtube} link='https://youtube.com/@polkagate' label={'YouTube'} />
        </Section>

        <Text color='muted' size="sm">
          ABOUT
        </Text>
        <Section>
          <LinkItem icon={web} link='https://polkagate.xyz' label={'Website'} />
          <LinkItem icon={github} link='https://github.com/PolkaGate/snap/' label={'Github'} />
        </Section>

      </Box>
      <Footer>
        <Button name='backToHome' variant="destructive">
          Back
        </Button>
      </Footer>
    </Container>
  );
};

/**
 * This shows the more page
 *
 * @param id - The id of UI interface to be updated.
 */
export async function settings(id: string) {

  const { address } = await getKeyPair();

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(address)
    },
  });
}