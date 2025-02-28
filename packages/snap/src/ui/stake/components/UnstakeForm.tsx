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