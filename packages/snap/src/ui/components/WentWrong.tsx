import { Box, Image, Text, SnapComponent } from '@metamask/snaps-sdk/jsx';
import { fox } from '../image/icons';

interface Props {
  label?: string
}
export const WentWrong: SnapComponent<Props> = ({ label }) => {

  const text = label || 'Something went wrong ...';

  return (
    <Box direction='vertical' alignment='center' center>
      <Image src={fox} />
      <Text color='muted' alignment='center'>
        {text}
      </Text>
    </Box>

  );
};