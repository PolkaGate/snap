import { ApiPromise } from "@polkadot/api";

export const getSpanCount = async (
  api: ApiPromise,
  address: String,
): Promise<number> => {

  const optSpans = await api.query.staking?.slashingSpans?.(address) as any;
 return optSpans
    ? optSpans?.isNone ? 0 : optSpans.unwrap().prior.length + 1
    : 0;
}