import { Button, Footer, type SnapComponent } from '@metamask/snaps-sdk/jsx';

type Props = {
  disabled?: boolean,
  name?: string;
};

/**
 * A component that shows the send flow footer.
 *
 * @returns The SendFlowFooter component.
 */
export const SendFlowFooter: SnapComponent<Props> = ({ disabled, name = "sendReview" }) => (
  <Footer>
    <Button name={name} disabled={disabled}>
      Continue
    </Button>
  </Footer>
);