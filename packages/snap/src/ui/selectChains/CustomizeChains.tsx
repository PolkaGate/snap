import { Image, Box, Button, Container, Footer, Heading, Icon, Section, Text, Checkbox, Form } from "@metamask/snaps-sdk/jsx";
import { getChainOptions, Options } from "../../chains";
import { getLogoByGenesisHash } from "../image/chains/getLogoByGenesisHash";
import type { HexString } from "@polkadot/util/types";
import { getSnapState } from "../../rpc/stateManagement";
import { DEFAULT_CHAINS_GENESIS } from "../../constants";

const ui = (options: Options[], logoList: string[], selectedChains: HexString[]) => {

  const sortedOptions = options.sort(({ value: a }, { value: b }) => {
    const isCheckedA = selectedChains.includes(a as HexString);
    const isCheckedB = selectedChains.includes(b as HexString);
  
    return Number(isCheckedB) - Number(isCheckedA);
  });


  return (
    <Container>
      <Box direction="vertical" alignment="start">
        <Box direction="horizontal" alignment="space-between" center>
          <Button name='backToHomeWithoutUpdate'>
            <Icon name="arrow-left" color="primary" size="md" />
          </Button>
          <Heading>Networks</Heading>
          <Box direction="horizontal" alignment="end">
            <Button name='refreshSelectedChains' variant='primary' >
              <Icon size='md' color='primary' name='eraser' />
            </Button >
            <Text alignment='end' color='muted' size="sm">
              Reset
            </Text>
          </Box>
        </Box>
        <Form name='selectedChains'>
          {sortedOptions.map(({ text, value }, index) => {
            return (
              <Section>
                <Box direction='horizontal' alignment='space-between' center>
                  <Box direction='horizontal' alignment='start' center>
                    <Image src={logoList[index]} />
                    <Text alignment='start'>
                      {text}
                    </Text>
                  </Box>
                  <Checkbox name={`${value}`} variant="toggle" checked={selectedChains.includes(value as HexString)} />
                </Box>
              </Section>
            )
          })}
        </Form>
      </Box >
      <Footer>
        <Button form='selectedChains' name='applySelectedChains' type="submit">
          Apply
        </Button>
      </Footer>
    </Container >
  );
};

export async function CustomizeChains(id: string) {
  const options = getChainOptions()
  const logoList = await Promise.all(options.map(({ value }) => getLogoByGenesisHash(value as HexString)));
  const selectedChains = (await getSnapState('selectedChains')) || DEFAULT_CHAINS_GENESIS;

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: ui(options, logoList, selectedChains)
    },
  });
}