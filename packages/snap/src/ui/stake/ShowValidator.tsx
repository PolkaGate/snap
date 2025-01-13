import { Box, Text, Tooltip, Icon, Checkbox, Avatar, SnapComponent } from '@metamask/snaps-sdk/jsx';
import { Identity } from './utils/getValidatorIdentities';
import { BN } from '@polkadot/util';
import { AccountId } from '@polkadot/types/interfaces';
import { ellipsis } from './utils/ellipsis';

interface Props {
  accountId: AccountId;
  commission: BN;
  identity?: Identity;
  isSelected?: boolean;
  nominatorsCount: number | undefined;
  showCheckBox?: boolean;
}

export const ShowValidator: SnapComponent<Props> = ({ accountId, commission, identity, isSelected, nominatorsCount, showCheckBox }) => {
  return (
    <Box direction='horizontal' alignment='space-between' center>
      <Box direction='horizontal' alignment='start' center>
        {!!showCheckBox &&
          <Checkbox name={`selectedValidator,${accountId}`} checked={isSelected} />
        }
        {identity
          ? <Box direction='horizontal' alignment='start' center>
            <Avatar address={`polkadot:91b171bb158e2d3848fa23a9f1c25182:${accountId}`} size='sm' />
            <Tooltip content={`${accountId}`}>
              <Text alignment='start'>
                {ellipsis(identity.display, 16)}
              </Text>
            </Tooltip>
          </Box>
          : //<Address address={`polkadot:91b171bb158e2d3848fa23a9f1c25182:${accountId}`} /> //this can be used instead, when avatar size is available
          <Box direction='horizontal' alignment='start' center>
            <Avatar address={`polkadot:91b171bb158e2d3848fa23a9f1c25182:${accountId}`} size='sm' />
            <Tooltip content={`${accountId}`}>
              <Text alignment='start'>
                {ellipsis(String(accountId), 16)}
              </Text>
            </Tooltip>
          </Box>
        }
      </Box>
      <Box direction='horizontal' alignment='end' center>
        <Text alignment='end' color='muted'>
          {String(Number(commission) / (10 ** 7) < 1 ? 0 : Number(commission) / (10 ** 7))}%
        </Text>
        {!!nominatorsCount &&
          <Tooltip content={`Members: ${nominatorsCount || 0}`}>
            <Icon name="info" color='muted' />
          </Tooltip>
        }
      </Box>
    </Box>
  );
};