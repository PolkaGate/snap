// Copyright 2023-2024 @polkagate/snap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balances } from '../../util/getBalance';

import { Box, Card, Divider, Text, Row, SnapComponent, Section } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from '../../util/amountToHuman';

type Props = {
  balances: Balances;
  price: number;
  logo: string;
  showDetail?: boolean;
}

export const BalanceInfo: SnapComponent<Props> = ({ balances, price, logo, showDetail }: Props) => {
  const { total, transferable, locked, soloTotal, pooledBalance, decimal, token } = balances;
  const totalPrice = parseFloat(amountToHuman(total, decimal)) * price;

  return (
    <Box>
      <Card
        image={logo}
        title={token}
        description={`$${price}`}
        value={`${amountToHuman(total, decimal)} ${token}`}
        extra={`$${totalPrice.toFixed(2)}`}
      />
      {!!showDetail &&
        <Section>
          <Divider />
          <Row label="Transferable">
            <Text>{`${amountToHuman(transferable, decimal)} ${token}`}</Text>
          </Row>
          {!locked.isZero() &&
            <Row label="Locked" tooltip='The amount locked in referenda.'>
              <Text>{`${amountToHuman(locked, decimal)} ${token}`}</Text>
            </Row>
          }
          {!!(soloTotal && !soloTotal.isZero()) &&
            <Row label="Staked (solo)">
              <Text>{`${amountToHuman(soloTotal, decimal)} ${token}`}</Text>
            </Row>
          }
          {!!(pooledBalance && !pooledBalance.isZero()) &&
            <Row label="Staked (pool)">
              <Text>{`${amountToHuman(pooledBalance, decimal)} ${token}`}</Text>
            </Row>
          }
        </Section>
      }
    </Box>
  );
};
