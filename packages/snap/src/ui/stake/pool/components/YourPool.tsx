import { Box, Section, Text, Image, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-identicon-sprites';

interface Props {
  poolId?: number;
  poolName?: string;
}
export const YourPool: SnapComponent<Props> = ({ poolId, poolName }) => {

  const icon = createAvatar(style, {
    seed: String(poolId),
    size: 15
  });

  return (
    <Box>
      {poolId !== undefined &&
        <Section>
          <Box direction="vertical" alignment="start">
            <Text color='muted'>
              {`Your pool (#${poolId})`}
            </Text>
            <Box direction="horizontal" alignment="start">
              <Image src={icon} />
              <Text >
                {`${poolName})`}
              </Text>
            </Box>
          </Box>
        </Section>
      }
    </Box>
  )
}