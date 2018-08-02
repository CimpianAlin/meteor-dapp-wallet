// Set provider
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  if (window.chrome && window.chrome.ipcRenderer) {
    web3 = new Web3();
    window.chrome.ipcRenderer.on('eth-wallet-geth-address', (e, address) => {
      web3.setProvider(address);
    });
    window.chrome.ipcRenderer.send('eth-wallet-get-geth-address');
  } else {
    web3 = new Web3('ws://localhost:8546');
  }
}
