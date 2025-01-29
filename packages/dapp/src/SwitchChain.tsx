import { useState, useMemo } from 'react';
import './App.css';
import { Avatar, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { allChains } from './util/allChains';
import getLogo, { sanitizeChainName } from './util/getLogo';
import { getChain } from './util/getChain';

interface Props {
  currentChainName: string;
  setChainName: React.Dispatch<React.SetStateAction<string>>
}
function TransferFund({ currentChainName, setChainName }: Props) {
  const [currentGenesisHash, setCurrentGenesisHash] = useState<string>(getChain(currentChainName).genesisHash[0]);

  const chains = useMemo(() => allChains(), []);

  const handleChange = (event: SelectChangeEvent) => {
    setCurrentGenesisHash(event.target.value as string);
    const chain = getChain(event.target.value);
    setChainName(sanitizeChainName(chain.displayName)?.toLowerCase() ?? currentChainName);
  };

  return (
    <Grid container item justifyContent='center'>
      <FormControl sx={{ width: '400px' }}>
        <InputLabel>Chain</InputLabel>
        <Select
          value={currentGenesisHash}
          label="Chain"
          onChange={handleChange}
        >
          {chains.map(({ genesisHash, displayName }, index) => {
            const logo = getLogo(displayName)
            return (
              <MenuItem value={genesisHash} key={index}>
                <Grid container item alignItems='center'>
                  <Avatar
                    alt="logo"
                    src={logo}
                    sx={{ width: 24, height: 24, display: 'inline-block' }}
                  />
                  <Typography sx={{ pl: '10px', display: 'inline-block' }}>
                    {displayName}
                  </Typography>
                </Grid>
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </Grid>
  );
}

export default TransferFund;
