const modalTXForm = () => {

	const self = new Tilux({
		w: `
			<div id="{$@id}">
			<h1>Transact</h1>
			<label>From</label>{>(ethAddrInp(@fromAddr, "From Address"))}<br />
			<label>To</label>{>(ethAddrInp(@toAddr, "To Address"))}<br />
			<label>Ether</label>{>(ethValInp(@ethValue, "Ether To Send"))}<br />
			<label>Transaction Data</label>
			<textarea placeholder="Transaction data">{$@txData}</textarea>
			<label>Gas</label><input type="number" value="{$@gas}" placeholder="Gas" /><br />
			<label>Gas Price (GWei)</label><input type="number" value="{$@gasPrice}" placeholder="Gas Price" /><br />
			</div>
		`,
		f: {
			id: 'modalTXForm',
			get fromAddr(){return currAccountLux.address},
			toAddr: '0x0',
			ethValue: 0.0,
			txData: '',
			gas: 90000,
			gasPrice: 10,
			okCb: ()=>{ modal.show("Hell Yeah!") },
		},
		s: {

		}
	})

	return self;
}