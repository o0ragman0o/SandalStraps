
const txForm = (txObj = {}) => {
	let self = new Tilux({
		w: `
			<div id="txForm">
				{>(accountsTplt)}
				<input id="tx-to" placeholder="To Address"></input>
				<input id="tx-val" type="number" placeholder="Ether value to send" value="{$@txObj.value}"></input>
				<input id="tx-gas" type="number" placeholder="Maximum gas" value="{$@txObj.gas}"></input>
				<input id="tx-gas-price" type="number" placeholder="Gas price" value="{$@txObj.gasPrice}"></input>
				<textarea id="tx-data" placeholder="Enter TX data" value="{$@txObj.data}"></textarea>
				<button id="send-btn">Send</button>
			</div>
		`,
		f: {
			txObj: txObj,
			from: currentAccountLux.address,
			cb: txObj.cb
		},
		s:{

			"#tx-to": {
				change: (event) => { self.f.txObj.to = event.target.value; } 
			},
			"#tx-val": {
				change: (event) => { self.f.txObj.value = event.target.value; } 
			},
			"#tx-gas": {
				change: (event) => { self.f.txObj.gas = event.target.value; } 
			},
			"#tx-gas-price": {
				change: (event) => { self.f.txObj.gasPrice = event.target.value; } 
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
	}),

	return self;
}