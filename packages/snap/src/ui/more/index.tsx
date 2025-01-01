import { Box, Button, SnapComponent, Divider, Link, Heading, Icon, Section, IconName, Footer, Container } from "@metamask/snaps-sdk/jsx";
import { MoreHeader } from "./MoreHeader";
import { ActionRow } from "../components/ActionRow";

/**
 * This shows the more page
 *
 * @param id - The id of UI interface to be updated.
 */
export async function showMore(id: string) {
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
      <Box direction="vertical" alignment="start">
        <MoreHeader
          action='backToHomeWithoutUpdate'
          label='More settings'
        />
        <Section>
          <ActionRow
            label='Export Account as JSON File'
            name='export'
            icon='export'
          />
        </Section>
        <Section>
          <LinkItem icon={'book'} link='https://docs.polkagate.xyz' label={'View Documents'} />
        </Section>
        <Section>
          <LinkItem icon={'twitter'} link='https://x.com/@polkagate' label={'Follow Us on X'} />
          <LinkItem icon={'bookmark'} link='https://youtube.com/@polkagate' label={'Subscribe to YouTube Channel'} />
          <LinkItem icon={'home'} link='https://polkagate.xyz' label={'Visit Website'} />
          <LinkItem icon={'people'} link='mailto:polkagate@outlook.com' label={'Contact Us'} />
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


type LinkProps = {
  icon: IconName;
  link: string;
  label: string;
}

const LinkItem: SnapComponent<LinkProps> = ({ icon, link, label }: LinkProps) => (
  <Box direction="horizontal" alignment="start">
    <Icon name={icon} size="inherit" color="muted" />
    <Link href={link}>
      {label}
    </Link>
  </Box>
);
