import React, { useCallback, useState } from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import './App.css';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import { web3FromSource } from '@polkagate/extension-dapp';
import { Box, CircularProgress, Divider, Grid, InputAdornment, Link, Skeleton, TextField, Typography } from '@mui/material';
import type { ApiPromise } from '@polkadot/api';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { TxResult, send } from './apis/send';
import { amountToMachine } from './util/utils';
import { buildPayload } from './util/buildPayload';
import subscan from './assets/subscan.svg';
import isValidAddress from './util/isValidAddress';

interface Props {
  api: ApiPromise | undefined;
  account: InjectedAccountWithMeta | undefined;
  balances: DeriveBalancesAll | undefined;
  currentChainName: string;
  formatted: string | undefined;
  isPolkaMaskInstalled: boolean | undefined;
  token: string | undefined;

}
function TransferFund({ api, account, balances, currentChainName, formatted, isPolkaMaskInstalled, token }: Props): React.ReactElement<Props> {
  const [toAddress, setToAddress] = useState<string>();
  const [_signature, setSignature] = useState<string>();
  const [_result, setResult] = useState<TxResult>();
  const [transferAmount, setTransferAmount] = useState<string>();
  const [waitingForUserApproval, setWaiting] = useState<boolean>();

  const handleToAddress = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const mayBeAddress = event?.target?.value
      if (isValidAddress(mayBeAddress)) {
        setToAddress(event.target.value);
      }
    }, [],);

  const handleAmount = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN((Number(event?.target?.value)))) {
      return
    }

    setTransferAmount(parseFloat(event.target.value).toFixed(4));
  }, [],);

  const handleSendClick = async () => {
    setSignature(undefined);
    setResult(undefined);

    try {
      if (!api || !account || !toAddress) {
        return;
      }

      setWaiting(true);
      const decimal = api.registry.chainDecimals[0];
      const amount = amountToMachine(transferAmount, decimal);
      const params = [toAddress, amount];
      const tx = api.tx.balances.transferKeepAlive(...params);
      const payload = await buildPayload(api, tx, account.address);
      const injector = await web3FromSource(account.meta.source);
      const signPayload = injector?.signer?.signPayload;
      if (payload && signPayload) {
        const signResult = await signPayload(payload);

        setWaiting(false);

        if (signResult?.signature) {
          setSignature(signResult.signature);
          const result = await send(
            payload.address,
            api,
            tx,
            payload,
            signResult.signature,
          );
          console.log('result:', result);
          setResult(result);
        } else {
          window.alert('User rejected to sign the transaction!');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Grid container item justifyContent='center'>
      {isPolkaMaskInstalled
        && <>
          <Grid container item justifyContent="center" py='5px'>
            <Typography variant="h5" sx={{ fontWeight: '500' }}>
              Transfer Fund and View the Result
            </Typography>
          </Grid>
          <Divider sx={{ width: '80%', mb: '35px' }} />
          <Grid container item justifyContent="center" alignItems='center'>
            <Typography variant="body1">
              From:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 500, ml: '10px' }}>
              {formatted
                ? <code>{formatted}</code>
                : <Skeleton animation="wave" sx={{ display: 'inline-block', fontWeight: 'bold', transform: 'none', width: '650px', height: '27px' }} />}
            </Typography>
          </Grid>
          <Grid container item alignItems='center' justifyContent="center" pt="15px" flexDirection='column'>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography variant="body1">
                Transferable Balance:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 500, ml: '10px' }}>
                {balances
                  ? balances.availableBalance.toHuman()
                  : <Skeleton animation="wave" sx={{ display: 'inline-block', fontWeight: 'bold', transform: 'none', width: '100px', height: '27px' }} />}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography variant="body1">
                Chain:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 500, ml: '10px' }}>
                {currentChainName
                  ? currentChainName
                  : <Skeleton animation="wave" sx={{ display: 'inline-block', fontWeight: 'bold', transform: 'none', width: '100px', height: '27px' }} />}
              </Typography>
            </Box>
          </Grid>
          <Grid container item justifyContent="center" py="25px">
            {balances?.availableBalance?.isZero() && currentChainName as string === 'westend' && (
              <Typography variant="body1" color='success' sx={{ textAlign: 'center' }}>
                {` You can top up your address by sending `}
                <code>{`!drip ${formatted}`}</code>
                {` to the `}
                <Link
                  href="https://matrix.to/#/#westend_faucet:matrix.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Westend element channel
                </Link>
              </Typography>
            )}
          </Grid>
          <Grid container item justifyContent="center">
            <TextField
              label="To"
              variant="outlined"
              sx={{ width: '600px', marginTop: '20px' }}
              inputProps={{ style: { fontSize: 20 } }}
              InputLabelProps={{ style: { fontSize: 20 } }}
              onChange={handleToAddress}
            />
          </Grid>
          <Grid container item justifyContent="center">
            <TextField
              label="Amount"
              variant="outlined"
              sx={{ width: '600px', marginTop: '20px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="h6">{token || 'token'}</Typography>
                  </InputAdornment>
                ),
                style: { fontSize: 20 },
              }}
              InputLabelProps={{ style: { fontSize: 20 } }}
              onChange={handleAmount}
            />
          </Grid>
          <Grid container item justifyContent='center' sx={{ border: 1, p: '10px', borderRadius: '10px', width: '600px', mt: '20px' }}>
            {toAddress && (
              <Typography variant="body1">
                {`Click to send ${transferAmount} ${token} to recipient address ${toAddress}`}
              </Typography>
            )}
            <Grid container item justifyContent="center" mt="5px">
              <LoadingButton
                loading={waitingForUserApproval}
                loadingPosition="start"
                startIcon={<SendIcon sx={{ transform: 'rotate(-25deg)' }} />}
                variant="contained"
                onClick={handleSendClick}
                disabled={
                  (!api ||
                    !isPolkaMaskInstalled ||
                    waitingForUserApproval ||
                    !transferAmount ||
                    !toAddress)
                  ||
                  (!!_signature && !_result)
                }
                sx={{ fontSize: '18px', width: '100%' }}
              >
                {waitingForUserApproval
                  ? 'Approve transaction in Metamask'
                  : 'Send'}
              </LoadingButton>
            </Grid>
          </Grid>
        </>
      }
      {/* {state.error && (
        <Grid item container>
          <b>An error happened:</b> {state.error.message}
        </Grid>
      )} */}
      <Grid container item pt="15px" justifyContent="center" alignItems='center'>
        {_signature && (
          <>
            <Typography variant="body1">Received Signature:</Typography>
            <Typography variant="body2">{_signature}</Typography>
          </>
        )}
        <Grid container item justifyContent="center" py="15px">
          {_signature && !_result ? (
            <CircularProgress />
          ) : (
            _result && (
              <>
                {_result?.txHash && (
                  <Grid container justifyContent="center" alignItems='center' item>
                    <Typography variant="body1">Transaction Hash:</Typography>
                    <Typography variant="body2">{_result?.txHash}</Typography>
                  </Grid>
                )}
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  item
                >
                  <Typography variant="h6">
                    {`Transfer was ${_result.success ? 'SUCCESSFUL' : 'FAILED'
                      }`}
                  </Typography>
                  {_result?.txHash && (
                    <Grid container justifyContent="center" item>
                      <Link
                        href={`https://westend.subscan.io/extrinsic/${_result?.txHash}`}
                        rel="noreferrer"
                        target="_blank"
                        underline="none"
                        sx={{ display: 'block', textAlign: 'center' }}
                      >
                        <Box
                          alt={'subscan'}
                          component="img"
                          height="20px"
                          mt="9px"
                          src={subscan}
                          width="20px"
                        />
                      </Link>
                    </Grid>
                  )}
                </Grid>
              </>
            )
          )}
        </Grid>
      </Grid>
    </Grid >
  );
}

export default TransferFund;
