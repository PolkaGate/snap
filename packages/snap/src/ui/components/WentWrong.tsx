import { Box, Image, Text, SnapComponent, TextColors, Section } from '@metamask/snaps-sdk/jsx';
import { fox } from '../image/icons';

interface Props {
  color?: TextColors
  label?: string
}
export const WentWrong: SnapComponent<Props> = ({ color, label }) => {

  const text = label || 'Something went wrong ...';

  return (
    <Box direction='vertical' alignment='center' center>
      <Image src={fox} />
      <Section>
        <Text color={color ?? 'muted'} alignment='center'>
          {text}
        </Text>
      </Section>
    </Box>

  );
};