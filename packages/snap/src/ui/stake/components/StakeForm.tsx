import { Box, Image, Field, Text, Input, Form, SnapComponent, Heading } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../util/amountToHuman";
import { Row2 } from "./Row2";
import { StakeFormErrors } from "../types";

export interface Props {
  amount: string | undefined,
  decimal: number,
  formErrors: StakeFormErrors,
  logo: string,
  name?: string,
  placeHolder?: string,
  price: number,
  token: string,
  transferable: string,
}

export const StakeForm: SnapComponent<Props> = ({ amount, decimal, formErrors, logo, name, placeHolder, token, transferable, price, }) => {

  return (
    <Form name='stakeForm'>
      <Field label='Amount' error={formErrors?.amount}>
        <Box direction="horizontal" alignment="start" center>
          <Image src={logo} />
          <Heading size="sm">
            {token}
          </Heading>
        </Box>
        <Input name={name || 'stakeAmount'} type="number" placeholder={placeHolder || "Enter amount to stake"} value={amount} />
        <Text color="muted">
          ${(Number(amount || 0) * price).toFixed(2)}
        </Text>
      </Field>
      <Row2
        label='Available'
        value={`${amountToHuman(transferable, decimal, 4, true)} ${token}`}
      />
    </Form>
  );
};