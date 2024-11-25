import { HexString } from "@polkadot/util/types";
import type { MetadataDef } from '@polkadot/extension-inject/types';
import { PricesType } from "../util/getPrices";

interface State {
  balancesAll?: any;
  currentGenesisHash?: HexString;
  metadata?: Record<HexString, MetadataDef>;
  priceInfo?: {
    currencyCode: string;
    date: number;
    prices: PricesType
  }
}

type StateValues = State[keyof State];

export const setSnapState = async (newState: State) => {
  return await snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', newState },
  });
};

export const getSnapState = async () =>
  await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  }) as State;

export const updateSnapState = async (field: keyof State, data: any) => {
  const state = (await getSnapState()) || {};

  state[field] = JSON.parse(JSON.stringify(data));

  const response = await setSnapState(state);

  console.info(`${field} updated in snap state with data:`, data);

  return Boolean(response);
};