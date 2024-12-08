// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0


import { getChainOptions } from '../chains';
import { Balances, getBalances, getKeyPair } from '.';
import { getLogoByGenesisHash } from '../ui/image/chains/getLogoByGenesisHash';
import { HexString } from '@polkadot/util/types';
import { getSnapState, updateSnapState } from '../rpc/stateManagement';
import { getNativeTokenPrice } from './getNativeTokenPrice';
import { DEFAULT_CHAIN_NAME, DEFAULT_CHAINS_GENESIS, NOT_LISTED_CHAINS, PRICE_VALIDITY_PERIOD } from '../constants';
import { updateTokenPrices } from './getCurrentChainTokenPrice';
import { isHexToBn } from '../utils';

export function areArraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false; // Check length

  const sortedArr1 = [...arr1].sort(); // Sort the first array
  const sortedArr2 = [...arr2].sort(); // Sort the second array

  return sortedArr1.every((value, index) => value === sortedArr2[index]); // Compare values
}

export const handleBalancesAll = async (savedOnly?: boolean) => {
  const options = getChainOptions();
  const snapState = await getSnapState();
  const selectedChains = snapState?.selectedChains || DEFAULT_CHAINS_GENESIS;

  const selectedOptions = options.filter(({ value }) => selectedChains.includes(value));

  const currentChainName = DEFAULT_CHAIN_NAME; // to reset chain on each new visit

  const { address } = await getKeyPair(currentChainName);
  let balancesAll: Balances[];

  let noChainsChange;
  if (snapState.balancesAll) {
    const parsedBalancesAll = JSON.parse(snapState.balancesAll.data);
    const savedBalancedChains = parsedBalancesAll.map(({ genesisHash }) => genesisHash);
    noChainsChange = areArraysEqual(savedBalancedChains, selectedChains);
  }

  if (noChainsChange && snapState.balancesAll && (savedOnly || Date.now() - Number(snapState.balancesAll.date) < PRICE_VALIDITY_PERIOD)) {
    const parsedBalancesAll = JSON.parse(snapState.balancesAll.data);

    parsedBalancesAll.forEach((item) => {
      item.total = isHexToBn(item.total)
      item.transferable = isHexToBn(item.transferable)
      item.locked = isHexToBn(item.locked)
      item.soloTotal = isHexToBn(item.soloTotal)
      item.pooledBalance = isHexToBn(item.pooledBalance);
    })
    balancesAll = parsedBalancesAll;

  } else {

    const balancesAllPromises = selectedOptions.map(({ value }) => getBalances(value as HexString, address))
    balancesAll = await Promise.all(balancesAllPromises)
    await updateSnapState('balancesAll', { date: Date.now(), data: JSON.stringify(balancesAll) });
  }

  const logoList = await Promise.all(selectedOptions.map(({ value }) => getLogoByGenesisHash(value as HexString)));
  const logos = selectedOptions.map(({ value }, index) => {
    return { genesisHash: value, logo: logoList[index] }
  });

  await updateTokenPrices();
  const pricesInUsd = await Promise.all(selectedOptions.map(({ value }) => getNativeTokenPrice(value as HexString)));

  return { address, balancesAll, logos, pricesInUsd }
}