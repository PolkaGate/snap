// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type ContractAddress = {
  evm: `0x${string}`;
  substrate: string | undefined;
}