import { Text, SnapComponent } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../util/amountToHuman";
import { commifyNumber } from "../../utils";
import type { BN } from "@polkadot/util";

interface Props {
  amount: string | number | BN | undefined;
  decimal: number | undefined;
  price: number;
  size?: "md" | "sm" | undefined;
}

export const Price: SnapComponent<Props> = ({ amount, decimal, price , size='md'}) => {

  const total = Number(amountToHuman(amount || 0, decimal || 0)) * price;
  const commifiedTotal = commifyNumber(total, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Text color="alternative" size={size}>
      ${commifiedTotal}
    </Text>
  )
}