import { KUSAMA_GENESIS, PASEO_GENESIS, POLKADOT_GENESIS, WESTEND_GENESIS } from "@polkadot/apps-config";

export const DEFAULT_NETWORK_PREFIX = 42; // 42 is for substrate
export const DEFAULT_COIN_TYPE = 354; // 354 is for Polkadot
export const DEFAULT_CHAIN_NAME = 'polkadot'; // Since Westend shares the same address prefix as Substrate, the address format for both is identical

export const PRICE_VALIDITY_PERIOD = 2 * 60 * 1000;

export const DEFAULT_CHAINS_GENESIS = [POLKADOT_GENESIS, KUSAMA_GENESIS, WESTEND_GENESIS];

export const RELAY_CHAINS_NAMES = ['Polkadot', 'Kusama', 'Westend', 'Paseo'];

export const POLKADOT_PEOPLE_GENESIS_HASH = '0x67fa177a097bfa18f77ea95ab56e9bcdfeb0e5b8a40e46298bb93e16b6fc5008';
export const KUSAMA_PEOPLE_GENESIS_HASH = '0xc1af4cb4eb3918e5db15086c0cc5ec17fb334f728b7c65dd44bfe1e174ff8b3f';
export const WESTEND_PEOPLE_GENESIS_HASH = '0x1eb6fb0ba5187434de017a70cb84d4f47142df1d571d0ef9e7e1407f2b80b93c';
export const PASEO_PEOPLE_GENESIS_HASH = '0xe6c30d6e148f250b887105237bcaa5cb9f16dd203bf7b5b9d4f1da7387cb86ec';

export const PEOPLE_CHAINS = {
    [POLKADOT_GENESIS]: POLKADOT_PEOPLE_GENESIS_HASH,
    [KUSAMA_GENESIS]: KUSAMA_PEOPLE_GENESIS_HASH,
    [WESTEND_GENESIS]: WESTEND_PEOPLE_GENESIS_HASH,
    [PASEO_GENESIS]: PASEO_PEOPLE_GENESIS_HASH,

}

export enum OUTPUT_TYPE {
FEE,
CALL_PARAMS
}