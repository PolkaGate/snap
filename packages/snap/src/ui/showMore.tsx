import { Box, Image, Button, SnapComponent, Divider, Link, Heading, Text } from "@metamask/snaps-sdk/jsx";
import { book, email, exportAccount, twitter, webSite } from "./image/icons";

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

export const ui = () => {

  return (
    <Box direction="vertical" alignment="start">
      <Heading>PolkaGate Snap Menu</Heading>
      <MenuItem icon={exportAccount} name='export' label={'Export Account as JSON File'} />
      <Divider />
      <LinkItem icon={book} link='https://docs.polkagate.xyz' label={'View Documents'} />
      <Divider />
      <LinkItem icon={twitter} link='https://x.com/@polkagate' label={'Follow Us on X (twitter)'} />
      <LinkItem icon={twitter} link='https://x.com/@polkagate' label={'Follow Us on X (twitter)'} />
      <LinkItem icon={twitter} link='https://youtube.com/@polkagate' label={'Subscribe to YouTube Channel'} />
      <LinkItem icon={webSite} link='https://polkagate.xyz' label={'Visit Website'} />
      <LinkItem icon={email} link='mailto:polkagate@outlook.com' label={'Contact Us'} />
    </Box>
  );
};



type MenuProps = {
  icon: string;
  name: string;
  label: string;
}

type LinkProps = {
  icon: string;
  link: string;
  label: string;
}

export const MenuItem: SnapComponent<MenuProps> = ({ icon, name, label }: MenuProps) => {

  return (
    <Box direction="horizontal" alignment="start">
      <Image src={icon} />
      <Button name={name?.toLowerCase()} variant='primary'>
        {label}
      </Button>
    </Box>
  );
};

export const LinkItem: SnapComponent<LinkProps> = ({ icon, link, label }: LinkProps) => {

  return (
    <Box direction="horizontal" alignment="start">
      <Image src={icon} />
      <Link href={link}>{label}</Link>
    </Box>
  );
};