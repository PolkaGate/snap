import { Text, Box, Button, Option, Image, Container, Field, Footer, Form, Input, Section, Copyable, Address, Avatar, Divider, Icon, SnapComponent, Dropdown } from '@metamask/snaps-sdk/jsx';
import { FlowHeader } from '../components/FlowHeader';
import { isEthereumAddress } from '@polkadot/util-crypto';
import jazzicon1 from '../image/jazzicon/jazzicon1.svg';
import { evmToPolkadotAddress } from '../../util/evmToPolkadotAddress';
import { getLogoByChainName } from '../image/chains/getLogo';
import { RELAY_CHAINS_NAMES } from '../../constants';


type Props = {
  chainName?: string
}

export const ChainSelect: SnapComponent<Props> = ({ chainName }: Props) => {
  const logo = getLogoByChainName(chainName, true);

  return (
    <Box direction="horizontal" alignment="center">
      <Image src={logo} width={40} height={40} />
      <Dropdown name="switchMetamaskToSubstrateChain" value={chainName}>
        {RELAY_CHAINS_NAMES.map((item) => (
          <Option value={item}>
            {item}
          </Option>
        ))}
      </Dropdown>
    </Box>
  );
};


type Addresses = {
  metamaskAddress: `0x${string}`;
  polkadotAddress: string;
}

/**
 * The state of the contract form.
 *
 * @property contractAddress - The contract address.
 */
export type ContractFormState = {
  contractAddress: `0x${string}` | undefined;
};

const ui = (addresses: Addresses[], clearAddress: boolean | undefined, contractAddress: `0x${string}` | undefined, displayClearIcon: boolean, chainName?: string) => {
  const isEthereum = isEthereumAddress(contractAddress);
  const polkadotContractAddress = isEthereum ? evmToPolkadotAddress(contractAddress, chainName) : undefined;
  const errorMsg = contractAddress && !isEthereum ? 'Invalid address!' : ''

  const _chainName = chainName ?? RELAY_CHAINS_NAMES[0];

  return (
    <Container>
      <Box direction='vertical' alignment='start'>
        <FlowHeader
          action='settings'
          label='MetaMask → Substrate Addresses'
          showHome
        />
        <Text alignment='start' color='muted'>
          Your MetaMask accounts in {_chainName} format
        </Text>
        <ChainSelect
          chainName={_chainName}
        />
        <Box direction='vertical' alignment='start'>
          {addresses.map(({ metamaskAddress, polkadotAddress }) => (
            <Section>
              <Address address={metamaskAddress} displayName={true} />
              <Copyable value={polkadotAddress} />
            </Section>
          ))
          }
          <Divider />
          <Text alignment='start' color='muted'>
            Convert external EVM address
          </Text>
          <Section>
            <Form name='contractForm'>
              <Field label='EVM address' error={errorMsg}
              >
                <Box>
                  {contractAddress
                    ? <Avatar address={`eip155:1:${contractAddress}`} size='sm' />
                    : <Image src={jazzicon1} />
                  }
                </Box>
                <Input
                  name='contractAddress'
                  placeholder='Paste EVM address'
                  value={clearAddress ? '' : undefined}
                />
                {displayClearIcon && (
                  <Box>
                    <Button name='clearContractAddress'>
                      <Icon name='close' color='primary' />
                    </Button>
                  </Box>
                )}
              </Field>
            </Form>
            {!!polkadotContractAddress &&
              <Copyable value={polkadotContractAddress} />
            }
          </Section>
        </Box>
      </Box>
      <Footer>
        <Button name='settings' variant='primary'>
          Close
        </Button>
      </Footer>
    </Container>
  );
};

export async function metamaskAddressesToPolkadot(id: string, clearAddress: boolean | undefined, contractAddress: `0x${string}` | undefined, displayClearIcon: boolean, chainName?: string) {
  const metamaskAddresses = await ethereum.request({ method: "eth_requestAccounts" });

  const addresses = metamaskAddresses?.map((metamaskAddress) => ({
    metamaskAddress,
    polkadotAddress: evmToPolkadotAddress(metamaskAddress, chainName)
  })) as Addresses[];

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(addresses, clearAddress, contractAddress, displayClearIcon, chainName),
    },
  });
}