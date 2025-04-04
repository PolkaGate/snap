// Copyright 2023-2025 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0


import { getChainOptions } from '../chains';
import { Balances, getBalances, getKeyPair } from '.';
import { getLogoByGenesisHash } from '../ui/image/chains/getLogoByGenesisHash';
import type { HexString } from '@polkadot/util/types';
import { getSnapState, updateSnapState } from '../rpc/stateManagement';
import { getNativeTokenPrice } from './getNativeTokenPrice';
import { DEFAULT_CHAIN_NAME, DEFAULT_CHAINS_GENESIS, PRICE_VALIDITY_PERIOD } from '../constants';
import { updateTokenPrices } from './updateTokenPrices';
import { isHexToBn } from '../utils';
import { areArraysEqual } from './areArraysEqual';

export enum BALANCE_FETCH_TYPE {
  RECENTLY_FETCHED, // default
  SAVED_ONLY,
  FORCE_UPDATE
}

export const handleBalancesAll = async (fetchType?: BALANCE_FETCH_TYPE) => {
  const options = getChainOptions();
  const snapState = await getSnapState();
  const selectedChains = snapState?.selectedChains ?? DEFAULT_CHAINS_GENESIS;

  const selectedOptions = options.filter(({ value }) => selectedChains.includes(value));

  const { address } = await getKeyPair(DEFAULT_CHAIN_NAME);
  let balancesAll: Balances[];

  let noChainsChange;
  if (snapState.balancesAll) {
    const parsedBalancesAll = JSON.parse(snapState.balancesAll.data);
    const savedBalancedChains = parsedBalancesAll.map(({ genesisHash }) => genesisHash);
    noChainsChange = areArraysEqual(savedBalancedChains, selectedChains);
  }


  if (noChainsChange && snapState.balancesAll && fetchType !== BALANCE_FETCH_TYPE.FORCE_UPDATE && (fetchType === BALANCE_FETCH_TYPE.SAVED_ONLY || ((Date.now() - Number(snapState.balancesAll.date)) < PRICE_VALIDITY_PERIOD))) {
    const parsedBalancesAll = JSON.parse(snapState.balancesAll.data);

    parsedBalancesAll.forEach((item) => {
      item.total = isHexToBn(item.total)
      item.transferable = isHexToBn(item.transferable)
      item.locked = isHexToBn(item.locked)
      item.soloTotal = isHexToBn(item.soloTotal)
      item.pooledBalance = isHexToBn(item.pooledBalance);
      if (item.pooled) {
        item.pooled.total = isHexToBn(item.pooled.total);
        item.pooled.active = isHexToBn(item.pooled.active);
        item.pooled.claimable = isHexToBn(item.pooled.claimable);
        item.pooled.unlocking = isHexToBn(item.pooled.unlocking);
        item.pooled.redeemable = isHexToBn(item.pooled.redeemable);
      }
      if (item.solo) {
        item.solo.total = isHexToBn(item.solo.total);
        item.solo.active = isHexToBn(item.solo.active);
        item.solo.unlocking = isHexToBn(item.solo.unlocking);
        item.solo.redeemable = isHexToBn(item.solo.redeemable);
      }
    })

    balancesAll = parsedBalancesAll;

  } else {

    const balancesAllPromises = selectedOptions.map(({ value }) => getBalances(value as HexString, address))
    balancesAll = await Promise.all(balancesAllPromises);

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