import { Image, Box, Button, Container, Footer, Heading, Icon, Section, Text, Checkbox, Form } from "@metamask/snaps-sdk/jsx";
import { getChainOptions, Options } from "../../chains";
import { getLogoByGenesisHash } from "../image/chains/getLogoByGenesisHash";
import { HexString } from "@polkadot/util/types";
import { getSnapState } from "../../rpc/stateManagement";
import { DEFAULT_CHAINS_GENESIS } from "../../constants";

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

const ui = (options: Options[], logoList: string[], selectedChains: HexString[]) => {

  return (
    <Container>
      <Box direction="vertical" alignment="start">
        <Box center direction='horizontal' alignment="space-between">
          <Heading>Networks</Heading>
          <Box direction="horizontal" alignment="end">
            <Button name='refreshSelectedChains' variant='primary' >
              <Icon size='md' color='primary' name='eraser' />
            </Button >
            <Text alignment='end' color='muted'>
              Reset
            </Text>
          </Box>
        </Box>
        <Form name='selectedChains'>
          {options.map(({ text, value }, index) => {
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
        <Button form='selectedChains' name='applySelectedChains' variant="destructive" type="submit">
          Apply
        </Button>
      </Footer>
    </Container >
  );
};