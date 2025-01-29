import type { HexString } from "@polkadot/util/types";
import type { MetadataDef } from '@polkadot/extension-inject/types';
import type { PricesType } from "../util/getPrices";
import type { ManageStateResult } from "@metamask/snaps-sdk";

type State = {
  balancesAll?: any;
  selectedChains?: string[];
  currentGenesisHash?: HexString;
  metadata?: Record<HexString, MetadataDef>;
  priceInfo?: {
    currencyCode: string;
    date: number;
    prices: PricesType
  }
}

export const setSnapState = async (newState: State):Promise<ManageStateResult> => {
  return await snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', newState },
  });
};

export const getSnapState = async (label?: string):Promise<ManageStateResult> => {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  }) as State;

  return label ? state?.[label] : state;
}

export const updateSnapState = async (field: keyof State | string, data: unknown): Promise<boolean> => {
  const state = (await getSnapState()) ?? {};

  state[field] = JSON.parse(JSON.stringify(data));

  const response = await setSnapState(state);

  return Boolean(response);
};