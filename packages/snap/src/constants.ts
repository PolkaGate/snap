import { KUSAMA_GENESIS, PASEO_GENESIS, POLKADOT_GENESIS, WESTEND_GENESIS } from "@polkadot/apps-config";
import type { HexString } from "@polkadot/util/types";

export const DEFAULT_NETWORK_PREFIX = 42; // 42 is for substrate
export const DEFAULT_COIN_TYPE = 354; // 354 is for Polkadot
export const DEFAULT_CHAIN_NAME = 'polkadot'; // Since Westend shares the same address prefix as Substrate, the address format for both is identical

export const PRICE_VALIDITY_PERIOD = 10 * 60 * 1000; // 10 min

export const DEFAULT_CHAINS_GENESIS = [POLKADOT_GENESIS, KUSAMA_GENESIS, WESTEND_GENESIS];

export const RELAY_CHAINS_NAMES = ['Polkadot', 'Kusama', 'Westend', 'Paseo'];

export const POLKADOT_PEOPLE_GENESIS_HASH = '0x67fa177a097bfa18f77ea95ab56e9bcdfeb0e5b8a40e46298bb93e16b6fc5008' as HexString;
export const KUSAMA_PEOPLE_GENESIS_HASH = '0xc1af4cb4eb3918e5db15086c0cc5ec17fb334f728b7c65dd44bfe1e174ff8b3f' as HexString;
export const WESTEND_PEOPLE_GENESIS_HASH = '0x1eb6fb0ba5187434de017a70cb84d4f47142df1d571d0ef9e7e1407f2b80b93c' as HexString;
export const PASEO_PEOPLE_GENESIS_HASH = '0xe6c30d6e148f250b887105237bcaa5cb9f16dd203bf7b5b9d4f1da7387cb86ec' as HexString;

export const PEOPLE_CHAINS = {
    [POLKADOT_GENESIS]: POLKADOT_PEOPLE_GENESIS_HASH,
    [KUSAMA_GENESIS]: KUSAMA_PEOPLE_GENESIS_HASH,
    [WESTEND_GENESIS]: WESTEND_PEOPLE_GENESIS_HASH,
    [PASEO_GENESIS]: PASEO_PEOPLE_GENESIS_HASH,
}

export const POLKADOT_ASSET_HUB = '0x68d56f15f85d3136970ec16946040bc1752654e906147f7e43e9d539d7c3de2f'
export const KUSAMA_ASSET_HUB = '0x48239ef607d7928874027a43a67689209727dfb3d3dc5e5b03a39bdc2eda771a'
export const WESTEND_ASSET_HUB = '0x67f9723393ef76214df0118c34bbbd3dbebc8ed46a10973a8c969d48fe7598c9'

export const ASSET_HUBS = {
    'Polkadot Asset Hub': POLKADOT_ASSET_HUB,
    'Kusama Asset Hub': KUSAMA_ASSET_HUB,
    'Westend Asset Hub': WESTEND_ASSET_HUB,
}

export const OUTPUT_TYPE = {
    FEE: 1,
    CALL_PARAMS: 2
}