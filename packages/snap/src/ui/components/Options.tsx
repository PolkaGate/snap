// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0


import { Box, Section, Text, SnapComponent, Image, Button } from '@metamask/snaps-sdk/jsx';

import { check, unCheck } from '../image/option';

type Props = {
  title: string;
  text1: string;
  text2: string;
  description1?: string;
  description2?: string;
  form: string;
  optionNames: Record<number, string>;
  selectedOption?: string;
}

// const OPTION_NAMES = {
//   1: 'option1',
//   2: 'option2',
// }

type OptionProps = {
  form: string;
  name: string;
  text: string;
  description?: string;
  selected: string;
}

export const OptionButton: SnapComponent<OptionProps> = ({ description, form, name, selected, text }) => {
  const isSelected = selected === name;

  return (
    <Section direction='horizontal' alignment='start'>
      <Box direction='vertical' alignment='start'>
        <Button name={`${form},${name}`}>
          <Image src={isSelected ? check : unCheck} />
        </Button>
      </Box>

      <Box direction='vertical'>
        <Text alignment='start'>
          {text}
        </Text>
        {!!description &&
          <Text alignment='start' color='muted' size='sm'>
            {description}
          </Text>}
      </Box>
    </Section>
  )
}

export const Options: SnapComponent<Props> = ({ description1, description2, form, optionNames, selectedOption, text1, text2, title }) => {
  const selected = selectedOption || optionNames[1];

  return (
    <Box direction='vertical'>
      <Text alignment='start' color='muted' size='sm'>
        {title}
      </Text>
      <OptionButton
        form={form}
        name={optionNames[1]}
        description={description1}
        selected={selected}
        text={text1}
      />
      <OptionButton
        form={form}
        name={optionNames[2]}
        description={description2}
        selected={selected}
        text={text2}
      />
    </Box>
  )
}