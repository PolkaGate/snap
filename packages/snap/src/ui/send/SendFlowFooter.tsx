import { Button, Footer, type SnapComponent } from '@metamask/snaps-sdk/jsx';

type Props = { disabled?: boolean };
/**
 * A component that shows the send flow footer.
 *
 * @returns The SendFlowFooter component.
 */
export const SendFlowFooter: SnapComponent<Props> = ({ disabled }) => (
  <Footer>
    <Button name="sendReview" disabled={disabled}>
      Review
    </Button>
  </Footer>
);