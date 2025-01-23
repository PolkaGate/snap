import { Box, Button, Image, Heading, Section, Text, Icon, Bold, SnapComponent } from '@metamask/snaps-sdk/jsx';
import { amountToHuman } from '../../../util/amountToHuman';
import { Balances } from '../../../util';
import { sanitizeChainName } from '../../../util/getChainName';
import { HexString } from '@polkadot/util/types';
import { getLogoByChainName } from '../../image/chains/getLogoByGenesisHash';
import { toTitleCase } from '../../../utils';

interface Props {
  balancesAll: Balances[],
  nonStakedChainInfo: { genesisHash: HexString, name: string }[],
  stakingRates: Record<string, number>
}


export const StakeAndEarn: SnapComponent<Props> = ({ balancesAll, nonStakedChainInfo, stakingRates }) => {

  return (
    <Box direction='vertical' >
      <Heading>Stake and earn rewards </Heading>
      {nonStakedChainInfo.map(({ genesisHash, name }) => {

        const sanitizedChainName = sanitizeChainName(name)?.toLocaleLowerCase() as string;
        const rate = stakingRates[sanitizedChainName];
        const logo = getLogoByChainName(sanitizedChainName, true)
        const balance = balancesAll.find((balance) => balance.genesisHash === genesisHash)

        return (
          <Section>
            <Box direction='horizontal' alignment='space-between' center>
              <Box direction='horizontal' alignment='start' center>
                <Image src={logo} />
                <Box direction='vertical' alignment='start'>
                  <Text>
                    <Bold> {toTitleCase(sanitizedChainName) || 'Unknown'}</Bold>
                  </Text>
                  {!!balance?.transferable && !balance.transferable.isZero() &&
                    <Text color='muted' size='sm'>
                      {`Available: ${amountToHuman(balance.transferable, balance?.decimal || 10, 2, true)} ${balance?.token || 'Unit'}`}
                    </Text>
                  }
                </Box>
              </Box>
              <Box direction='horizontal' alignment='end' center>
                <Box direction='vertical' alignment='end'>
                  <Text color='success' alignment='end'>
                    <Bold>{`+${rate}%`}</Bold>
                  </Text>
                  <Text color='muted' alignment='end' size='sm'>
                    per year
                  </Text>
                </Box>
                <Button name={`stakingInfo,${genesisHash}`} variant='primary'>
                  <Icon name='arrow-right' color='muted' size='md' />
                </Button>
              </Box>
            </Box>
          </Section>
        )
      })}
    </Box>
  );
};