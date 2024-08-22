interface PriceValue {
  value: number,
  change: number
}

export interface PricesType {
  [priceId: string]: PriceValue;
}

export interface Prices {
  currencyCode: string;
  date: number;
  prices: PricesType;
};