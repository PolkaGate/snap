import fs from 'fs';
import packageJson from './package.json' assert { type: 'json' };

const isProduction = process.env.NODE_ENV === 'production';
packageJson.dependencies['@polkagate/extension-dapp'] = isProduction
  ? '^0.48.2'
  : '../../../polkadot-js-extension/packages/extension-dapp/build';

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));