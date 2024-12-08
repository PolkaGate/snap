import { KUSAMA_GENESIS, POLKADOT_GENESIS, WESTEND_GENESIS } from "@polkadot/apps-config";

export const DEFAULT_NETWORK_PREFIX = 42; // 42 is for substrate
export const DEFAULT_COIN_TYPE = 354; // 354 is for Polkadot
export const DEFAULT_CHAIN_NAME = 'polkadot'; // Since Westend shares the same address prefix as Substrate, the address format for both is identical

export const PRICE_VALIDITY_PERIOD = 2 * 60 * 1000;

export const DEFAULT_CHAINS_GENESIS = [POLKADOT_GENESIS, KUSAMA_GENESIS];
