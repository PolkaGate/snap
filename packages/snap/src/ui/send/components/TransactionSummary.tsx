import {
  Row,
  Section,
  Text,
  Value,
  type SnapComponent,
} from '@metamask/snaps-sdk/jsx';
import type { Balance } from '@polkadot/types/interfaces';
import { amountToHuman } from '../../../util/amountToHuman';


/**
 * The props for the {@link TransactionSummary} component.
 *
 * @property decimal - The decimal of the chain.
 * @property fee - The fee for the transaction.
 * @property priceInUsd - The price of selected token in usd.
 * @property total - The total cost of the transaction.
 * @property token - The selected token.
 */
export type TransactionSummaryProps = {
  decimal: number;
  fee: Balance;
  priceInUsd: number;
  total: number;
  token: string;
};

/**
 * A component that shows the transaction summary.
 *
 * @param props - The component props.
 * @param props.decimal - The decimal of the chain.
 * @param props.fee - The fee for the transaction.
 * @param props.priceInUsd - The price of selected token in usd.
 * @param props.total - The total cost of the transaction.
 * @param props.token - The selected token.
 * @returns The TransactionSummary component.
 */
export const TransactionSummary: SnapComponent<TransactionSummaryProps> = ({
  decimal,
  fee,
  priceInUsd,
  token,
  total
}) => {

  const feeInUsd = Number(amountToHuman(fee, decimal)) * priceInUsd;

  return (
    <Section>
      <Row label="Estimated network fee">
        <Value
          value={`${amountToHuman(String(fee), decimal, 4, true)} ${token}`}
          extra={`$${feeInUsd.toFixed(2)}`}
        />
      </Row>
      <Row label="Transaction speed" tooltip="The estimated time of the TX">
        <Text>6 sec</Text>
      </Row>
      <Row label="Total">
        <Value
          value={`${total.toFixed(4)} ${token}`}
          extra={`$${(total * priceInUsd).toFixed(2)}`}
        />
      </Row>
    </Section>
  )
};