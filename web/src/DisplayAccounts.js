import React from 'react';
import PropTypes from 'prop-types';

function DisplayAccounts(props, context) {
  const web3Context = context.web3;

  /**
   * web3Context = {
   *   accounts: {Array<string>} - All accounts
   *   selectedAccount: {string} - Default ETH account address (coinbase)
   *   network: {string} - One of 'MAINNET', 'ROPSTEN', or 'UNKNOWN'
   *   networkId: {string} - The network ID (e.g. '1' for main net)
   * }
   */

  return (
    <div>
      Account Address: {web3Context.selectedAccount}
    </div>
  );
}

DisplayAccounts.contextTypes = {
  web3: PropTypes.object
};

export default DisplayAccounts;
