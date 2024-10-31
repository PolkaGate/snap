import { Box, Button, SnapComponent, Divider, Link, Heading, Icon, Section, IconName, Footer, Container } from "@metamask/snaps-sdk/jsx";

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
        <Section>
          <Box direction='horizontal' alignment='start'>
            <Icon name="menu" size="md" />
            <Heading>PolkaGate Snap Menu</Heading>
          </Box>
          <Divider />
          <MenuItem icon='export' name='export' label={'Export Account as JSON File'} />
          <Divider />
          <LinkItem icon={'book'} link='https://docs.polkagate.xyz' label={'View Documents'} />
          <Divider />
          <LinkItem icon={'twitter'} link='https://x.com/@polkagate' label={'Follow Us on X (twitter)'} />
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


type MenuProps = {
  icon: IconName;
  name: string;
  label: string;
}

type LinkProps = {
  icon: IconName;
  link: string;
  label: string;
}

export const MenuItem: SnapComponent<MenuProps> = ({ icon, name, label }: MenuProps) => {

  return (
    <Box direction="horizontal" alignment="start">
      <Icon name={icon} size="md" />
      <Button name={name?.toLowerCase()} variant='primary'>
        {label}
      </Button>
    </Box>
  );
};

export const LinkItem: SnapComponent<LinkProps> = ({ icon, link, label }: LinkProps) => {

  return (
    <Box direction="horizontal" alignment="start">
      <Icon name={icon} size="md" />
      <Link href={link}>
        {label}
      </Link>
    </Box>
  );
};