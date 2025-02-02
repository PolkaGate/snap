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
  const normalizedData = remove0x(data);
  const signature = normalizedData.slice(0, 8);

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


  const gas = transaction.gas ? parseInt(transaction.gas, 16) : 0;
  console.log("Raw gas limit:", transaction.gas);

  const gasPrice = transaction.gasPrice ? parseInt(transaction.gasPrice, 16) : 0;
  const value = parseInt(transaction.value, 16);

  return {
    content: (
      <Box>
        <Box direction="horizontal" alignment="start">
          <Icon name='warning' color="muted" />
          <Text color="warning" size='sm'>
            Test transaction on Westend testnet, with no real value in WST.
          </Text>
        </Box>
        <Divider />
        {/* <AddressRow
            label='From'
            address={transaction.from}
          />
          <AddressRow
            label='To'
            address={transaction.to}
          /> */}
        <Row2
          label='Chain Id'
          value={chainId}
        />
        <Row2
          label='Gas'
          value={String(gas)}
        />
        <Row2
          label='Gas Price'
          value={String(gasPrice)}
        />
        {/* <Row2
            label='Origin'
            value={String(transactionOrigin)}
          /> */}
        <Row2
          label='type'
          value={type}
        />
        <Row2
          label='Value'
          value={String(value)}
        />
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