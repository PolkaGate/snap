const fs = require('fs');
const packageJson = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';
console.log(`set path says isProduction is ${isProduction}`)
packageJson.dependencies['@polkagate/extension-dapp'] = isProduction
  ? '^0.48.2'
  : '../../../polkadot-js-extension/packages/extension-dapp/build';

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));