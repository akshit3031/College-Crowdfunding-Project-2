import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';

import { StateContextProvider } from './context';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Custom Hardhat localhost chain
const localhostChain = {
  chainId: 31337,
  rpc: ["http://127.0.0.1:8545"],
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  shortName: "localhost",
  slug: "localhost",
  testnet: true,
  chain: "Hardhat Local",
  name: "Localhost 8545",
};

root.render(
  <ThirdwebProvider activeChain={localhostChain}>
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);
