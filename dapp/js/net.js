var blockLux = new Lux({block:web3.eth.getBlock('latest'), sync:web3.eth.syncing});
var networkLux = new Lux(web3.version);


const netStats = new Tilux({
	w: `
		<div id='{$@id}'>
			<i class="fas fa-fw fa-share-alt"></i> {$networkLux.network} {$@netName}<br>
			<i class="fas fa-fw fa-cubes"></i> {$blockLux.block.number} / {$blockLux.sync.highestBlock || "sync'd"}<br>
			<i class="fas fa-fw fa-users"></i> {$web3.net.peerCount}
		 </div>
	`,
	f:{
		id: 'net-stats',
		get netName() {return {0:'Olympic',1:'Main Net',2:'Mordon',3:'Ropsten',4:'Rinkeby',42:'Kovan',77:'Sokol',99:'Core'}[networkLux.network] || `Private`;},
	},
})

const network = new Tilux({
	w: `
		<div id={$@id} class="net">
		{>(netStats, @isConnected, {w:'Offline',f:{}})}
		</div>
	`,
	f: {
		id: "network-tplt",
		isConnected: web3.isConnected(),
	}
})

netStats.gaze(blockLux);
netStats.gaze(networkLux);
network.gaze(networkLux);

const BlockFilter = web3.eth.filter('latest');

BlockFilter.watch((err, res) => {
	if (err) {
		console.log(`Watch error: ${err}`);
	} else {
		web3.eth.getBlock('latest',
			(err, block)=>{
				if(!err) blockLux.block = block;
			});
		web3.eth.getBalance(currAccountLux.address,
			(err, bal)=>{
				if(!err) currAccountLux.balance = bal
			});
	}
});


console.log("ran net.js");
