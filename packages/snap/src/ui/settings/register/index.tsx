
import { Text, Box, Button, Container, Option, Footer, Image, Dropdown } from '@metamask/snaps-sdk/jsx';
import { FlowHeader } from '../../components/FlowHeader';
import { getLogoByGenesisHash } from '../../image/chains/getLogoByGenesisHash';
import { ASSET_HUBS, WESTEND_ASSET_HUB } from '../../../constants';
import { HexString } from '@polkadot/util/types';

const ui = (genesisHash: string, logo: string) => {

  const options = Object.entries(ASSET_HUBS).map(([key, value]) => (
    {
      text: key,
      value
    }))

  return (
    <Container>
      <Box direction='vertical' alignment='start'>
        <FlowHeader
          action='settings'
          label='Register account'
          showHome
        />
        <Text alignment='start' color='alternative'>
          To seamlessly interact with Asset Hub smart contracts, select the chain and complete a one-time registration.
        </Text>
        <Box direction="horizontal" alignment="center">
          <Image src={logo} />
          <Dropdown name="switchChainInRegisterAccount" value={genesisHash}>
            {options.map(({ value, text }) => (
              <Option value={String(value)}>
                {text}
              </Option>
            ))}
          </Dropdown>
        </Box>
      </Box>
      <Footer>
        <Button name='registerAccountReview' variant='primary' disabled={!genesisHash}>
          Continue
        </Button>
      </Footer>
    </Container>
  );
};

const DEFAULT_CHAIN = WESTEND_ASSET_HUB;

export async function registerAccount(id: string, genesisHash?: HexString) {
  const _genesisHash = genesisHash || DEFAULT_CHAIN;
  const logo = await getLogoByGenesisHash(_genesisHash, true);

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(_genesisHash, logo),
      context: {
        genesisHash: _genesisHash
      }
    },
  });
}