import { Box, Image, Field, Text, Input, Form, SnapComponent, Heading } from "@metamask/snaps-sdk/jsx";
import { amountToHuman } from "../../../util/amountToHuman";
import { StakeFormErrors } from "../types";
import { STAKED_AMOUNT_DECIMAL_POINT } from "../const";

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
      <Box alignment="space-between" direction="horizontal">
        <Text color='muted' size='sm'>
          Amount
        </Text>
        <Box alignment="end" direction="horizontal">
          <Text color='muted' size='sm'>
            Available:
          </Text>
          <Text size='sm'>
            {`${amountToHuman(transferable, decimal, STAKED_AMOUNT_DECIMAL_POINT, true)} ${token}`}
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
        <Text color="alternative">
          ${(Number(amount || 0) * price).toFixed(2)}
        </Text>
      </Field>
    </Form>
  );
};