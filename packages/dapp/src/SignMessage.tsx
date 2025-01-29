import React, { useCallback, useState } from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import './App.css';
import LoadingButton from '@mui/lab/LoadingButton';
import { Key as KeyIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { web3FromSource } from '@polkagate/extension-dapp';
import { Divider, Grid, TextField, Typography } from '@mui/material';
import type { ApiPromise } from '@polkadot/api';
import { SignerPayloadRaw } from '@polkadot/types/types';
import { verifySignature } from './util/verifySignature';

interface Props {
  api: ApiPromise | undefined;
  account: InjectedAccountWithMeta | undefined;
  isPolkaMaskInstalled: boolean | undefined;
}
function SignMessage({ api, account, isPolkaMaskInstalled }: Props) {
  const [message, setMessage] = useState<string>();
  const [_signature, setSignature] = useState<string>();
  const [isSignatureValid, setIsSignatureValid] = useState<boolean>();
  const [waitingForUserApproval, setWaiting] = useState<boolean>();
  const [error, setError] = useState<string>();

  const handleMessage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event?.target?.value && setMessage(event.target.value);
      setSignature('');
      setIsSignatureValid(undefined);
      setWaiting(undefined);
      setError(undefined);
    }, [],);

  const handleSignClick = async () => {
    try {
      if (!api || !account || !message) {
        return;
      }

      setWaiting(true);
      setError('');
      const injector = await web3FromSource(account.meta.source);
      const signRaw = injector?.signer?.signRaw;
      if (signRaw) {
        const payload: SignerPayloadRaw = {
          address: account.address,
          type: 'bytes',
          data: message
        }
        const signResult = await signRaw(payload);

        setWaiting(false);
        const signature = signResult?.signature;
        if (signature) {
          setSignature(signature);

          const isValid = verifySignature(account.address, message, signature)
          setIsSignatureValid(isValid);
        } else {
          window.alert('User rejected to sign the transaction!');
        }
      }
    } catch (e: any) {
      setWaiting(false);
      setError(e?.message || 'An unknown occurred');
      console.error('Error while signing:', e);
    }
  };

  return (
    <Grid container item justifyContent='center'>
      {isPolkaMaskInstalled
        && <>
          <Grid container justifyContent="center" py='5px'>
            <Typography variant="h5" sx={{ fontWeight: '500' }}>
              Sign a Message and Verify the Signature
            </Typography>
          </Grid>
          <Divider sx={{ width: '80%', mb: '35px' }} />
          <Grid container item justifyContent="center" sx={{ mt: '25px' }}>
            <TextField
              label="Message"
              variant="outlined"
              focused
              sx={{ width: '600px', marginTop: '20px' }}
              inputProps={{ style: { fontSize: 20 } }}
              InputLabelProps={{ style: { fontSize: 18 } }}
              onChange={handleMessage}
            />
          </Grid>
          <Grid container item justifyContent="center" sx={{ width: '600px', mt: '25px' }}>
            <LoadingButton
              loading={waitingForUserApproval}
              loadingPosition="start"
              startIcon={<KeyIcon />}
              variant="contained"
              onClick={handleSignClick}
              disabled={
                !api ||
                !isPolkaMaskInstalled ||
                waitingForUserApproval ||
                !message
              }
              sx={{ fontSize: '18px', width: '100%' }}
            >
              {waitingForUserApproval
                ? 'Approve signing in Metamask'
                : 'Sign'}
            </LoadingButton>
          </Grid>
        </>
      }
      {error && (
        <Grid item container justifyContent='center' sx={{ textAlign: 'center', pt: '10px' }}>
          <Typography variant="body1" sx={{ pl: '10px', fontWeight: '600', color: 'red' }}>
            {error}
          </Typography>
        </Grid>
      )}
      <Grid container pt="15px" justifyContent="center" alignItems='center'>
        {_signature && (
          <>
            <Typography variant="body1">Received Signature:</Typography>
            <Typography variant="body2">{_signature}</Typography>
            <Grid container item justifyContent="center" py="15px">
              {isSignatureValid && <CheckCircleIcon color='success' />}
              <Typography variant="body1"> {isSignatureValid ? 'Verified' : 'Not Verified'}</Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default SignMessage;
