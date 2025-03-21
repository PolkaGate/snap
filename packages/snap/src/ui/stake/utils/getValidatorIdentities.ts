// Copyright 2019-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { getApi } from '../../../util/getApi';
import type { HexString } from '@polkadot/util/types';

import { hexToString } from '@polkadot/util';
import { PEOPLE_CHAINS } from '../../../constants';
import { getSnapState, updateSnapState } from '../../../rpc/stateManagement';
import type { Registration } from '@polkadot/types/interfaces';

export type Identity = {
  display: string;
  displayParent?: string;
  email: string;
  judgements: unknown;
  legal: string;
  riot: string;
  twitter: string;
  web: string;
}

const convertId = (id: Registration): Identity => ({
  display: hexToString(id.info.display.asRaw.toHex()),
  email: hexToString(id.info.email.asRaw.toHex()),
  // github: id.info.github && hexToString(id.info.github.asRaw.toHex()),
  judgements: id.judgements,
  legal: hexToString(id.info.legal.asRaw.toHex()),
  riot: hexToString(
    id.info.riot
      ? id.info.riot.asRaw.toHex()
      : id.info.matrix.asRaw.toHex()
  ),
  twitter: hexToString(id.info.twitter.asRaw.toHex()),
  web: hexToString(id.info.web.asRaw.toHex())
});

export type Identities = {
  accountId: string,
  identity: Identity
};

const SAVED_VALIDITY_PERIOD = 2 * 60 * 60 * 1000;

/**
 * Fetches the identities of validators from a specified blockchain network.
 * The function first checks if the identities are cached; if not, it fetches them from the network and updates the cache.
 * @param genesisHash - The genesis hash of the blockchain network to connect to.
 * @param accountIds - An array of account IDs for which the identities need to be fetched.
 * @param storageName - The name of the storage used to cache the identities (optional, defaults to 'VALIDATORS_IDENTITIES').
 * @returns An array of `Identities` objects containing the validator identities, or `null` if an error occurs.
 * @throws Will throw an error if the network connection fails or if fetching identities fails.
 */
export async function getValidatorsIdentities(genesisHash: HexString, accountIds: string[], storageName = 'VALIDATORS_IDENTITIES'): Promise<Identities[] | null> {
  try {

    const nameInStorage = `${storageName}_${genesisHash}`;
    const savedResult = await getSnapState(nameInStorage);
    if (savedResult) {
      const { result, date } = savedResult as { result: Identities[], date: number };
      if (Date.now() - date < SAVED_VALIDITY_PERIOD) {
        return result;
      }
    }

    const peopleChainGenesis = PEOPLE_CHAINS[genesisHash];
    const api = await getApi(peopleChainGenesis);

    if (!api) {
      throw new Error('cant connect to network, check your internet connection!');
    }

    let accountsInfo = [];
    let accountSubInfo = [];
    let mayHaveSubId = [];
    const page = accountIds.length < 50 ? accountIds.length : 50;
    let totalFetched = 0;

    // get identity of validators if they have
    while (accountIds.length > totalFetched) {
      const info = await Promise.all(
        accountIds
          .slice(totalFetched, totalFetched + page)
          .map(async (i) =>
            api.query.identity.identityOf(i)
          ));

      const parsedInfo = info
        .map((i, index) => {
          const id = i.isSome ? i.unwrap() as Registration: undefined;

          return id?.info
            ? {
              accountId: accountIds[index + totalFetched],
              identity: convertId(id)
            }
            : undefined;
        })
        .filter((i) => !!i);

      const noIdentities = info
        .map((i, index) => i.isSome ? undefined : accountIds[totalFetched + index])
        .filter((i) => !!i);

      mayHaveSubId = mayHaveSubId.concat(noIdentities);
      accountsInfo = accountsInfo.concat(parsedInfo);
      totalFetched += page;
    }

    // Fetch sub Id for validators which have not identity
    totalFetched = 0;

    while (mayHaveSubId.length > totalFetched) {
      // Fetching validators SUB identities
      const subInfo = await Promise.all(
        mayHaveSubId.slice(totalFetched, totalFetched + page)
          .map(async (i) =>
            api.query.identity.superOf(i)
          ));

      const parsedSubInfo = subInfo.map((i, index) => {
        const subId = i.isSome ? i.unwrap() : undefined;

        return subId
          ? {
            accountId: mayHaveSubId[index + totalFetched],
            display: hexToString(subId[1].asRaw.toHex()),
            parentAddress: subId[0].toString()
          }
          : undefined;
      }).filter((i) => !!i);

      accountSubInfo = accountSubInfo.concat(parsedSubInfo);
      totalFetched += page;
    }

    // get parent identity of validators who those have not identity but sub identity
    totalFetched = 0;

    while (accountSubInfo.length > totalFetched) {
      // Fetching validators PARENT identities
      const parentInfo = await Promise.all(
        accountSubInfo.slice(totalFetched, totalFetched + page)
          .map(async (i) =>
            api.query.identity.identityOf(i.parentAddress)
          ));

      const parsedParentInfo = parentInfo.map((i, index) => {
        const id = i.isSome ? i.unwrap()[0] as Registration : undefined;

        return id?.info
          ? {
            accountId: accountSubInfo[index].accountId,
            identity: {
              ...convertId(id),
              display: accountSubInfo[index].display,
              displayParent: hexToString(id.info.display.asRaw.toHex())
            }
          }
          : undefined;
      }).filter((i) => !!i);

      accountsInfo = accountsInfo.concat(parsedParentInfo);
      totalFetched += page;
    }

    accountsInfo.length && await updateSnapState(nameInStorage, { result: accountsInfo, date: Date.now() });

    return accountsInfo;

  } catch {
    // something went wrong while getting validators id
    return null;
  }
}