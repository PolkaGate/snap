import {
  Field,
  Selector,
  SelectorOption,
  type SnapComponent,
  Form,
  Card
} from '@metamask/snaps-sdk/jsx';

import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-identicon-sprites';

import { amountToHuman } from '../../../util/amountToHuman';
import { PoolInfo } from '../utils/getPools';
import { StakingInitContextType } from '../types';
import { WentWrong } from '../../components/WentWrong';

export type Props = {
  poolsInfo: PoolInfo[] | undefined,
  selectedPoolId: number | undefined,
  context: StakingInitContextType
};

const MAX_POOL_NAME_TO_SHOW = 25;

export const ellipsis = (name: string, limit = MAX_POOL_NAME_TO_SHOW) => {
  const maybeDots = name.length > limit ? '...' : '';

  return name.slice(0, limit) + maybeDots;
}


export const PoolSelector: SnapComponent<Props> = ({
  poolsInfo,
  selectedPoolId,
  context
}) => {

  const { decimal, token } = context;
  const selectedPoolMetadata = poolsInfo?.find(({ poolId }) => poolId === selectedPoolId)?.metadata
  const selectedPoolValue = `${selectedPoolId},${selectedPoolMetadata}`;

  return (
    <Form name='selectPoolForm'>
      <Field>
        <Selector
          name="poolSelector"
          title="Select pool"
          value={selectedPoolValue}
        >
          {!poolsInfo
            ? <WentWrong />
            : poolsInfo.map(({ poolId, metadata, bondedPool }) => {

              const members = bondedPool.memberCounter;
              const staked = bondedPool.points;
              const ellipsisPoolName = metadata && metadata.length > MAX_POOL_NAME_TO_SHOW ? ellipsis(metadata) : metadata;

              const icon = createAvatar(style, {
                seed: String(poolId),
                size: 25
              });

              return (
                <SelectorOption value={`${poolId},${metadata}`}>
                  <Card
                    image={icon}
                    title={String(ellipsisPoolName)}
                    description={`${amountToHuman(staked, decimal, 1, true)} ${token}`}
                    value='​ '
                    extra={String(members)}
                  />
                </SelectorOption>
              )
            })}
        </Selector>
      </Field>
    </Form>
  )
};