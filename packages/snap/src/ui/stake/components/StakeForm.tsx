import { Box, Image, Field, Text, Input, Form, SnapComponent, Heading } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../util/amountToHuman";
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
  price: number,
  token: string,
  available: string,
}

export const StakeForm: SnapComponent<Props> = ({ amount, decimal, formErrors, logo, name, placeHolder, token, available, price, }) => {

  return (
    <Form name='stakeForm'>
      <Box alignment="space-between" direction="horizontal">
        <Text color='muted' size='sm'>
          Amount
        </Text>
        <Box alignment="end" direction="horizontal">
          <Text color='muted' size='sm'>
            Available:
          </Text>
          <Text size='sm'>
            {`${amountToHuman(available, decimal, DEFAULT_DECIMAL_POINT, true)} ${token}`}
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
        <Input name={name || 'stakeAmount'} type="number" placeholder={placeHolder} value={amount} />
        <Price
          amount={amount}
          price={price}
        />
      </Field>
    </Form>
  );
};