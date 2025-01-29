// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OnTransactionHandler } from "@metamask/snaps-sdk";
import { Box, Divider, Heading, Icon, Section, Text } from "@metamask/snaps-sdk/jsx";
import { hasProperty, remove0x } from '@metamask/utils';
import { AddressRow, Row2 } from "../ui/components";

const FUNCTION_SIGNATURES = [
  {
    name: 'ERC-20',
    signature: 'a9059cbb',
  },
  {
    name: 'ERC-721',
    signature: '23b872dd',
  },
  {
    name: 'ERC-1155',
    signature: 'f242432a',
  },
];

export function decodeData(data: string) {
  const normalisedData = remove0x(data);
  const signature = normalisedData.slice(0, 8);

  const functionSignature = FUNCTION_SIGNATURES.find(
    (value) => value.signature === signature,
  );

  return functionSignature?.name ?? signature;
}

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}) => {

  let type = 'unknown'
  if (
    hasProperty(transaction, 'data') &&
    typeof transaction.data === 'string'
  ) {
    type = decodeData(transaction.data);
  }


  const gas = parseInt(transaction.gas, 16); // Gas limit
  const gasPrice = parseInt(transaction.gasPrice, 16); // Gas price in wei
  const value = parseInt(transaction.value, 16);

  return {
    content: (
      <Box>
        <Box direction="horizontal" alignment="start">
          <Icon name='warning' color="muted" />
          <Text color="warning" size='sm'>
            This is a test transaction on Westend, Polkadot’s testnet, with no monetary value for Testnet WST.
          </Text>
        </Box>
        <Divider />
        <Section>
          <AddressRow
            label='From'
            address={transaction.from}
          />
          <AddressRow
            label='To'
            address={transaction.to}
          />
          <Row2
            label='Chain Id'
            value={chainId}
          />
        </Section>
        <Section>
          <Row2
            label='type'
            value={type}
          />
          <Row2
            label='Value'
            value={String(value)}
          />
        </Section>
        <Section>
          <Row2
            label='Gas'
            value={String(gas)}
          />
          <Row2
            label='Gas Price'
            value={String(gasPrice)}
          />
          <Row2
            label='Origin'
            value={String(transactionOrigin)}
          />

        </Section>
        <Box direction="vertical">
          <Text size="sm" color="muted">
            Data
          </Text>
          <Text size="sm">
            {transaction.data}
          </Text>
        </Box>
      </Box>
    ),
  };
};