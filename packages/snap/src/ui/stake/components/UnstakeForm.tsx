import { Box, Image, Field, Text, Input, Form, SnapComponent, Heading } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../util/amountToHuman";
import { BN } from "@polkadot/util";
import { StakeFormErrors } from "../types";
import { DEFAULT_DECIMAL_POINT } from "../const";
import { Price } from "../../components";

export interface Props {
  amount: string | undefined,
  decimal: number,
  formErrors: StakeFormErrors,
  logo: string,
  name?: string,
  placeHolder?: string,
  token: string,
  staked: BN,
  price: number,
}

/**
 * Renders an unstake form component for withdrawing staked tokens.
 * 
 * @param amount - The amount to unstake.
 * @param decimal - The number of decimal places for the token.
 * @param formErrors - The form validation errors.
 * @param logo - The token's logo URL.
 * @param name - The input field name (optional).
 * @param placeHolder - The placeholder text for the input field (optional).
 * @param token - The token symbol.
 * @param staked - The total staked balance.
 * @param price - The token price.
 * @returns A JSX element representing the unstake form.
 */
export const UnstakeForm: SnapComponent<Props> = ({
  amount,
  decimal,
  formErrors,
  logo,
  name,
  placeHolder,
  token,
  staked,
  price,
}) => {

  return (
    <Form name='unstakeForm'>
      <Box alignment="space-between" direction="horizontal">
        <Text color='muted' size='sm'>
          Amount
        </Text>
        <Box alignment="end" direction="horizontal">
          <Text color='muted' size='sm'>
            Staked:
          </Text>
          <Text size='sm'>
            {`${amountToHuman(String(staked), decimal, DEFAULT_DECIMAL_POINT, true)} ${token}`}
          </Text>
        </Box>
      </Box>


      <Field error={formErrors?.amount}>
        <Box direction="horizontal" alignment="start" center>
          <Image src={logo} />
          <Heading size="sm">
            {token}
          </Heading>
        </Box>
        <Input name={name || 'unstakeAmount'} type="number" placeholder={placeHolder || "Enter amount to unstake"} value={amount} />
        <Price
          amount={amount}
          price={price}
        />
      </Field>
    </Form>
  );
};