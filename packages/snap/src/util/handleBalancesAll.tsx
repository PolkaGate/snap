// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0


import { getChainOptions } from '../chains';
import { Balances, getBalances, getKeyPair } from '.';
import { getLogo } from '../ui/image/chains/getLogo';
import { HexString } from '@polkadot/util/types';
import { getSnapState, updateSnapState } from '../rpc/stateManagement';
import { getNativeTokenPrice } from './getNativeTokenPrice';
import { DEFAULT_CHAIN_NAME, NOT_LISTED_CHAINS, PRICE_VALIDITY_PERIOD } from '../constants';
import { updateTokenPrices } from './getCurrentChainTokenPrice';
import { isHexToBn } from '../utils';

export const handleBalancesAll = async () => {
  const options = getChainOptions()
  const selectedOptions = options.filter(({ value }) => !NOT_LISTED_CHAINS.includes(value))//.slice(0, 3);

  const currentChainName = DEFAULT_CHAIN_NAME; // to reset chain on each new visit
  const { address } = await getKeyPair(currentChainName);
  let balancesAll: Balances[];
  const savedBalancesAll = await getSnapState();

  const logoList = await Promise.all(selectedOptions.map(({ value }) => getLogo(value as HexString)));

  const logos = selectedOptions.map(({ value }, index) => {
    return { genesisHash: value, logo: logoList[index] }
  });

  if (savedBalancesAll.balancesAll && Date.now() - Number(savedBalancesAll.balancesAll.date) < PRICE_VALIDITY_PERIOD) {
    const temp = JSON.parse(savedBalancesAll.balancesAll.data);

    temp.forEach((item) => {
      item.total = isHexToBn(item.total)
      item.transferable = isHexToBn(item.transferable)
      item.locked = isHexToBn(item.locked)
      item.soloTotal = isHexToBn(item.soloTotal)
      item.pooledBalance = isHexToBn(item.pooledBalance);
    })
    balancesAll = temp;

  } else {

    const balancesAllPromises = selectedOptions.map(({ value }) => getBalances(value as HexString, address))
    balancesAll = await Promise.all(balancesAllPromises)
    await updateSnapState('balancesAll', { date: Date.now(), data: JSON.stringify(balancesAll) });
  }

  await updateTokenPrices();
  const pricesInUsd = await Promise.all(selectedOptions.map(({ value }) => getNativeTokenPrice(value as HexString)));

  return { address, balancesAll, logos, pricesInUsd }
}