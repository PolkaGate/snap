import TransferFund from './TransferFund';
import React, { useCallback, useEffect, useState } from 'react';
import type { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
import './App.css';
import { web3Accounts, web3Enable } from '@polkagate/extension-dapp';
import { Box, Tabs, Tab, Button, Grid, Link, Typography } from '@mui/material';
import { ApiPromise, WsProvider } from '@polkadot/api';
import useEndpoint from './hooks/useEndpoint';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { DEFAULT_SNAP_ORIGIN, POLKAMASK_ACCOUNT_META_SOURCE } from './util/consts';
import { getFormatted } from './util/getFormatted';
import { getChain } from './util/getChain';
import { installPolkaMask } from './util/installPolkaMask';
import logo from './assets/logo.svg';
import SignMessage from './SignMessage';
import { hasFlask } from './util/hasFlask';
import SwitchChain from './SwitchChain';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const currentChainName = 'westend';

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function App() {
  const [chainName, setChainName] = useState(currentChainName);
  const [value, setValue] = useState(0);
  const endpoint = useEndpoint(chainName)
  const [extensions, setExtensions] = useState<InjectedExtension[] | undefined>();
  const [account, setAccount] = useState<InjectedAccountWithMeta>();
  const [api, setApi] = useState<ApiPromise>();
  const [formatted, setFormatted] = useState<string>();
  const [isPolkaMaskInstalled, setIsSnapInstalled] = useState<boolean>();
  const [balances, setBalances] = useState<DeriveBalancesAll>();
  const [hasFlaskDetected, setHasFlask] = useState<boolean>();

  const token = api && api.registry.chainTokens[0];

  useEffect(() => {
    if (!endpoint) {
      return;
    }
    const wsProvider = new WsProvider(endpoint);

    ApiPromise.create({ provider: wsProvider }).then(setApi);
  }, [endpoint]);

  useEffect(() => {
    isPolkaMaskInstalled && web3Enable('snap-dapp').then((ext: InjectedExtension[] | undefined) => {
      console.log('All injected extensions:', ext);
      setExtensions(ext);
    });
  }, [isPolkaMaskInstalled]);

  useEffect(() => {
    /** To getPolkaMask account */
    extensions?.length &&
      web3Accounts().then((accounts: any) => {
        const maybePolkamaskAccount = accounts.find((account: InjectedAccountWithMeta) => account.meta.source === POLKAMASK_ACCOUNT_META_SOURCE)
        setAccount(maybePolkamaskAccount);
        console.info('Polkagate snap account:', maybePolkamaskAccount);
      });
  }, [extensions, isPolkaMaskInstalled]);

  useEffect(() => {
    /** To format account address based on the dApp chain */
    const chain = getChain(chainName);

    const maybeChainLatestGenesisHash = chain?.genesisHash?.[0];
    if (maybeChainLatestGenesisHash && account?.address) {
      const formatted = getFormatted(String(maybeChainLatestGenesisHash), account.address)
      setFormatted(formatted);
    }
  }, [account, chainName]);

  const handleInstallClick = useCallback(() => {
    if (hasFlaskDetected === false) {
      const FLASK_URL = 'https://chromewebstore.google.com/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk';

      window.open(FLASK_URL, '_blank');

      return;
    }

    installPolkaMask().then((installedSnap) => {
      installedSnap && setIsSnapInstalled(installedSnap[DEFAULT_SNAP_ORIGIN]?.enabled)
    });
  }, [hasFlaskDetected]);

  useEffect(() => {
    handleInstallClick()
  }, [handleInstallClick]);

  useEffect(() => {
    hasFlask().then(setHasFlask)
    // getSnaps().then((snaps) => {
    //   if (snaps?.length) {
    //     const isDefaultSnapInstalled = !!Object.keys(snaps).find((id) => POLKAMASK_SNAP_IDS.includes(id));
    //     setIsSnapInstalled(isDefaultSnapInstalled);
    //     console.log('Installed snaps:', snaps)
    //   }
    // })
  }, []);

  useEffect(() => {
    api && formatted && api.derive.balances?.all(formatted).then(setBalances);
  }, [api, formatted]);


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid alignItems='center' container item justifyContent="space-between" mb='50px' p='10px' sx={{ borderBottom: 1 }}>
        <Grid container item alignItems='center' xs={8}>
          <Grid container item>
            <Grid item>
              <Box
                component="img"
                alt="snap logo"
                src={logo}
                sx={{ width: '30px', height: '30px', objectFit: 'cover' }}
              />
            </Grid>
            <Typography variant="h5" sx={{ fontWeight: '700', display: 'inline-block', ml: '5px' }}>
              PolkaGate
            </Typography>
          </Grid>
          <Grid item>
            <Typography sx={{ fontSize: '13px', ml: '5px' }}>
              This is a simple app designed for testing the PolkaGate Snap. For a complete experience, please visit <Link href='https://apps.polkagate.xyz' underline="hover" rel="noreferrer" target="_blank">apps.polkagate.xyz</Link>.
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs textAlign='right'>
          <Button
            variant="contained"
            color='secondary'
            onClick={handleInstallClick}
            disabled={isPolkaMaskInstalled}
            sx={{ fontSize: '16px', width: 'fit-content' }}
          >
            Install {hasFlaskDetected ? 'Polkagate Snap' : 'Flask'}
          </Button>
        </Grid>
      </Grid>
      <Grid container
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}
      >
        {!isPolkaMaskInstalled
          ? <Grid container justifyContent="center" p='auto' m='auto' >
            <Typography variant="h5" sx={{ fontWeight: '500' }}>
              {hasFlaskDetected ? 'Polkagate Snap' : 'Flask'} is not installed. Please install it using the button above.
            </Typography>
          </Grid>
          : <Grid item sx={{ width: '20%' }}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab label="Sign Extrinsic" {...a11yProps(0)} />
              <Tab label="Sign Message" {...a11yProps(1)} />
              <Tab label="Switch chain" {...a11yProps(2)} />
            </Tabs>
          </Grid>
        }
        <Grid item sx={{ width: '79%' }}>
          <TabPanel value={value} index={0}>
            <TransferFund
              api={api}
              account={account}
              isPolkaMaskInstalled={isPolkaMaskInstalled}
              formatted={formatted}
              balances={balances}
              currentChainName={chainName}
              token={token}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <SignMessage
              api={api}
              account={account}
              isPolkaMaskInstalled={isPolkaMaskInstalled}
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <SwitchChain
              currentChainName={chainName}
              setChainName={setChainName}
            />
          </TabPanel>
        </Grid>
      </Grid>
    </>
  );
}