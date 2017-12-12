var web3;
var currAccount;
var accs;

function web3Connect(url) {
	if(typeof web3 === 'undefined')
	web3 = new Web3(new Web3.providers.HttpProvider(url || 'http://localhost:8545'));
}

function accounts() {
	return web3.eth.accounts;
}

function balance(addr) {
	return web3.fromWei(web3.eth.getBalance(currAccount)).toFormat(3);
}

function setAccount(acc) {
    currAccount = acc;
}

function isAddr(addr) {
	return web3.isAddress(addr);
}

function notAddr(addr) {
	return !web3.isAddress(addr);	
}

function shortAddr(addr) {
	return `${addr.slice(0,8)}...${addr.slice(-6)}`;
}

function utf8(hex) {
	return web3.toUtf8(hex);
}

function blockie(addr) {
	return blockies.create({seed:addr.toLowerCase()});
}

web3Connect();