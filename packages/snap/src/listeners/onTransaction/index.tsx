// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OnTransactionHandler } from "@metamask/snaps-sdk";
import { Address, Box, Copyable, Divider, Icon, Text, Tooltip } from "@metamask/snaps-sdk/jsx";
import { getApi } from "../../util/getApi";
import { getContractAddress } from "./getContractAddress";
import { ContractAddress } from "./types";
import { CHAIN_ID_TO_GENESISHASH } from "../../constants";

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}) => {

  const genesisHash = CHAIN_ID_TO_GENESISHASH[`${chainId}`];
  const api = await getApi(genesisHash);

  if (!api) {
    return null;
  }

  const isDeployment = !transaction.to;

  let contractAddress: ContractAddress | undefined = undefined;

  if (isDeployment) {
    contractAddress = await getContractAddress(api, transaction, chainId);
  }

  const { evm, substrate } = contractAddress || {};

  return {
    content: (
      <Box direction='vertical'>
        <Divider />
        {isDeployment && !!evm && !!substrate &&
          <Box direction='vertical' alignment="space-between">
            <Box direction='horizontal'>
              <Text alignment='start' color='alternative'>
                Contract address
              </Text>
              <Tooltip
                content={
                  <Text size='sm'>
                    This is the predicted contract address in both EVM and Substrate formats.
                    Copy the Substrate address to send tokens to your contract from a Substrate-based chain, like Polkadot Asset Hub.
                  </Text>
                }
              >
                <Icon color="muted" size='inherit' name='question' />
              </Tooltip>
            </Box>
            <Address address={evm} displayName={true} truncate={false} />
            <Copyable value={substrate} />
          </Box>
        }
      </Box>
    ),
  };
};