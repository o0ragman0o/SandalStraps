function toTx(k, func, data, txObj = {}) {	
	if(!txObj.from) txObj.from = currAccountLux.address;
	if(!txObj.to) txObj.to = k.address;
	if(!txObj.value) txObj.value = 0;
	if(!txObj.data) txObj.data = k[func].getData(data);
	if(!txObj.gasPrice) txObj.gasPrice = web3.eth.gasPrice;
	if(!txObj.gas) txObj.gas = web3.eth.estimateGas(txObj);
	modal.show(txForm(txObj));
	return txObj;
}


const txForm = (txObj = {}) => {
	if(!txObj.from) txObj.from = currAccountLux.address;
	if(!txObj.to) txObj.to = null;
	if(!txObj.value) txObj.value = 0;
	if(!txObj.gasPrice) txObj.gasPrice = web3.eth.gasPrice;
	if(!txObj.gas) txObj.gas = 90000;
	let self = new Tilux({
		w: `
			<div id="txForm">
				<h1><i class="fa fa-paper-plane" aria-hidden="true"></i> Send Transaction</h1>
				<div class="modal-content">
					<label>From</label><input id="tx-from" placeholder="To Address" value="{$@from}"></input><br />
					<label>To</label><input id="tx-to" placeholder="To Address" value="{$@to}"></input><br />
					<label>Value</label><input id="tx-val" type="number" placeholder="Ether value to send" value="{$@value}"></input><br />
					<label>Gas</label><input id="tx-gas" type="number" placeholder="Maximum gas" value="{$@gas}"></input><br />
					<label>Gas Price</label><input id="tx-gas-price" type="number" placeholder="Gas price" value="{$@gasPrice}"></input><br />
					<label>Data</label><textarea id="tx-data" placeholder="Enter TX data (0x...)">{$@data}</textarea>
				</div>
				<button id="send-btn">Send</button>
			</div>
		`,
		f: {
			txObj: txObj,
			cb: txObj.cb,
			get from() { return txObj.from || currAccountLux.address },
			get value() { return web3.fromWei(txObj.value) },
			get gas() { return txObj.gas },
			get gasPrice() { return txObj.gasPrice || web3.eth.gasPrice },
			get to() { return txObj.to || ''},
			get data() {return txObj.data || ''},
		},
		s:{

			"#tx-to": {
				change: (event) => { self.f.txObj.to = event.target.value; } 
			},
			"#tx-val": {
				change: (event) => { self.f.txObj.value = web3.toWei(event.target.value); } 
			},
			"#tx-gas": {
				change: (event) => { self.f.txObj.gas = web3.toWei(event.target.value); } 
			},
			"#tx-gas-price": {
				change: (event) => {
					self.f.txObj.gasPrice = web3.toWei(event.target.value); } 
			},
			"#to-data": {
				change: (event) => { self.f.txObj.data = event.target.value; } 
			},
			"#to-nonce": {
				change: (event) => { self.f.txObj.nonce = event.target.value; } 
			},
			"#tx-send-btn": {
				click: (event) => {
					self.f.txObj.from = self.f.from;
					return web3.eth.sendTransaction(self.f.txObj, self.f.cb);
				}
			}
		}
	});

	return self;
}

const txHashForm = (txHash) => {
	let tx = web3.eth.getTransaction(txHash);
	let txr = web3.eth.getTransactionReceipt(txHash);
	if(!tx) return `No transaction found.`

	return {
		w: `
			<div id="tx-receipt" class="fs10">
				<h1>Transaction Information</h1>
				<label>TX Hash</label><span class="mono">{$@txr.transactionHash}</span><br />
				<label>Block Hash</label><span class="mono">{$@txr.blockHash}</span><br />
				<label>Block Number</label><span class="mono">{$@txr.blockNumber}</span><br />
				<label>From</label><span class="mono">{$@txr.from}</span><br />
				<label>To</label><span class="mono">{$@txr.to}</span><br />
				<label>Nonce</label><span class="mono">{$@tx.nonce}</span><br />

				<label>Gas Provided</label><span class="mono">{$@tx.gas}</span><br />
				<label>Gas Used</label><span class="mono">{$@txr.gasUsed}</span><br />
				<label>Gas Price</label><span class="mono">{$@tx.gasPrice}</span><br />
				<label>Status</label><span class="mono">{$@txr.status}</span><br />
				<label>r</label><span class="mono">{$@tx.r}</span><br />
				<label>s</label><span class="mono">{$@tx.s}</span><br />
				<label>v</label><span class="mono">{$@tx.v}</span><br />
				<label>Input</label><span class="mono">{$@tx.input}</span><br />
			</div>
		`,
		f: {
			tx: tx,
			txr: txr
		}		
	}
}

// {
//   blockHash: "0x0c395dc1b0a19d4355960ac6c27ab6331697e8df128c89c1e141dfe3cec9ffe7",
//   blockNumber: 241,
//   contractAddress: null,
//   cumulativeGasUsed: 30933,
//   from: "0x3a98a42756a7e08d29809b2a3fefe0e80abaff36",
//   gasUsed: 30933,
//   logs: [{
//       address: "0xb711d683358746cd76f02a09368eb71e77afdcd7",
//       blockHash: "0x0c395dc1b0a19d4355960ac6c27ab6331697e8df128c89c1e141dfe3cec9ffe7",
//       blockNumber: 241,
//       data: "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
//       logIndex: 0,
//       removed: false,
//       topics: ["0x2717ead6b9200dd235aad468c9809ea400fe33ac69b5bfaa6d3e90fc922b6398", "0x0000000000000000000000003a98a42756a7e08d29809b2a3fefe0e80abaff36", "0x0000000000000000000000003a98a42756a7e08d29809b2a3fefe0e80abaff36"],
//       transactionHash: "0xcd1ba33b5f8c59d13dd2427326a8d5b7b0221bc708e3e8d41af782211b35cda5",
//       transactionIndex: 0
//   }],
//   logsBloom: "0x00000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000010000000000000208000000000000000000000000000000000080000000000000000000000000000000000080000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
//   status: "0x1",
//   to: "0xb711d683358746cd76f02a09368eb71e77afdcd7",
//   transactionHash: "0xcd1ba33b5f8c59d13dd2427326a8d5b7b0221bc708e3e8d41af782211b35cda5",
//   transactionIndex: 0
// }

// {
//   blockHash: "0x0c395dc1b0a19d4355960ac6c27ab6331697e8df128c89c1e141dfe3cec9ffe7",
//   blockNumber: 241,
//   from: "0x3a98a42756a7e08d29809b2a3fefe0e80abaff36",
//   gas: 100000,
//   gasPrice: 18000000000,
//   hash: "0xcd1ba33b5f8c59d13dd2427326a8d5b7b0221bc708e3e8d41af782211b35cda5",
//   input: "0x853828b6",
//   nonce: 78,
//   r: "0x5e6ec6455372adf963302f854d264d176218b393fac7042062d43c0882f745b0",
//   s: "0x27fc99a8d9bd474512ebb10efa247a311f61fbf04aef484b938214c40b8909e9",
//   to: "0xb711d683358746cd76f02a09368eb71e77afdcd7",
//   transactionIndex: 0,
//   v: "0x1b",
//   value: 0
// }
