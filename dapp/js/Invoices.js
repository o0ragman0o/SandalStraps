// $import ("js/apis/InvoicesAPI.js");

const refundee = (k) => {
	const self = {
		w: `<div class="ss-panel">
				<input id="refundee-inp" type="text" placeholder="New refund address" value="{$@rfAddrs}" />
				<button id="refundee-btn">Change Refund Address</button>
			<div>
		`,
		f: {
			k: k,
			rfAddr: '',
		},
		s: {
			"#refundee-inp": {
				change: event => {if (isAddr(event.target.value)) refundee.f.rfAddr = event.target.value},
			},
			"#wdAllFor-btn": {
				click: () => {
					k.changeRefundTo([self.f.rfAddr], {from: currAccountLux.address, gas: 100000})},
			},
		},
	}
	return self;
}

const changeInvoiceRes = (k) => {
	const self = {
		w: `<input id="change-res-inp" value="{$@changeResInp}"" placeholder="Resource Hash"/><button id="change-res-btn">Change Resource</button>
		`,
		f: {
			k: k,
			owner: k.owner(),
			changeResInp: '',
		},
		s: {
			'#change-res-inp': {
				change(event) { self.f.changeResInp = event.target.value},
			},
			'#change-res-btn': {
				click() { contracts[self.f.owner].changeResource(self.f.changeResInp, {from: currAccountLux.address})}
			}
		}
	}

	return self;
}

const invoice = {

	minimal: (k) => {
		return {
			w: `{>(regBase.minimal(@k))}
			`,
			f: {
				k: k,
			},			
		}
	},

	basic: (k) => {
		return {
			w: `{>(regBase.basic(@k))}
			`,
			f: {
				k: k,
			},			
		}
	},

	advanced: (k) => {
		const self = new Tilux({
			w: `<div id="{$@id}">
					<div class="regBase-adv">
						<img class="rb-idicon idicon" src="{$blockie(@kAddr)}" />
						<div class="rb-title"><span class="rb-regname">{$@regName}</span> <span class="rb-version">{$@version}</div>
						<div class="rb-addr ss-addr-sml k-addr"><i class="fas fa-fw fa-file-alt"></i> <a href="https://etherscan.io/address/{$@kAddr}" target="_blank">{$@kAddr}</a></div>
						<div class="rb-owner ss-addr-sml u-addr"><i class="fas fa-fw fa-user"></i> <a href="https://etherscan.io/address/{$@owner}" target="_blank">{$@owner}</a></div>
						<div class="rb-ext">
							{>(withdrawable(@k))}
						</div>
					</div>
					<div class="layer">
						<label>Amount Due</label>{$ethVal(@amountDue)}<br />
						<label>Refund Address</label>{>(ethAddrSml(@refundTo))}<br />
						<label>Resource</label>{$@resource}<br />
						{>(changeInvoiceRes(@k),@isOwnerOfOwner)}
					</div>
					{>(refundee(@k), @isRefundee)}
					{>(events(@k, formatWithdrawableEvents))}
				</div>`,
			f: {
				k: k,
				kAddr: checksumAddr(k.address),
				regName: utf8(k.regName()),
				version: utf8(k.VERSION()),
				owner: checksumAddr(k.owner()),
				ownerOfOwner: contracts[k.owner()].owner(),
				get refundTo() {return checksumAddr(k.refundTo());},
				get isOwner() {return self.f.owner === currAccountLux.address;},
				get isRefundee() {return self.f.refundTo === currAccountLux.address;},
				get resource() { return k.resource()},
				get amountDue() {return k.amountDue()},
			},
			s: {
			}
		});

		return self;
	}
}


const formatInvoicesEvents = (log, k) => {
	switch (log.event) {
		case 'NewInvoice': return Tilux.l(`
			<h4>New Invoice</h4>
			<label>Address</label>{>(ethAddrSml('${log.args._kAddr}'))}<br />
			<label>Amount Payable</label>{>(ethVal('${log.args._value}'))}<br />
			<label>Refund Address</label>{>(ethAddrSml('${log.args._refundTo}'))}<br />
			`);
			break;
		case 'Removed': return Tilux.l(`
			<h4>Removed '${utf8(log.args._regName)}'</h4>
			<label>Address</label>{>(ethAddrSml('${log.args._address}'))}
			`);
			break;
		default: return formatRegistrarEvents(log, k);						
	}
}


const invoicesOwner = (k) =>{
	const self = {
		w: `
			<div class="layer">
					<input id="inv-name-inp" class="ss-input" type="text" placeholder="Invoice Name" value="{$@invName}"></input>
					<input id="res-hash-inp" class="ss-input ss-hash" type="text" placeholder="Resource Hash" value="{$@resHash}"></input>
					<input id="inv-value-inp" class="ss-input ss-val" type="number" placeholder="Invoice Value" value="{$@invValue}"></input>
					<input id="inv-refundaddr-inp" class="ss-input ss-addr" type="text" placeholder="Refund Address" value="{$@invRefAddr}"></input>
					<button id="btn-crt-inv">Create New...</button>
			</div>
			<div class="layer ss-flex-container">
				{#([''], @invoices)}
			</div>
		`,
		f: {
			k: k,
			invName: '',
			resHash: '',
			invValue: '',
			invRefAddr: '',
			get invoices() {
				return invoices.getInvoices(k).map(addr=>Tilux.l(kCandles[addr].minimal));
			},
		},
		s: {
			"#inv-name-inp": {
				change: (event)=>{ self.f.invName = event.target.value; }
			},
			"#res-hash-inp": {
				change: (event)=>{ self.f.resHash = event.target.value; }
			},
			"#inv-value-inp": {
				change: (event)=>{ self.f.invValue = event.target.value; }
			},
			"#inv-refundaddr-inp": {
				change: (event)=>{ self.f.invRefAddr = event.target.value; }
			},
			"#btn-crt-inv": {
				click: ()=>{
					self.f.k.newInvoice(
						self.f.invName,
						self.f.resHash,
						toWei(self.f.invValue),
						self.f.invRefAddr,
						{from: currAccountLux.address, gas:500000}
					);
				}
			}
		},
	}

	return self;
}

const invoices = {

	minimal: (k) => {
		return {
			w: `{>(regBase.minimal(@k))}
			`,
			f: {
				k: k,
			},			
		}
	},

	basic: (k) => {
		return {
			w: `{>(regBase.basic(@k))}
			`,
			f: {
				k: k,
			},			
		}
	},

	advanced: (k) => {
		const self = new Tilux({
			w: `<div id="{$@id}">
					{>(regBase.advanced(@k))}
					{>(invoicesOwner(@k), @isOwner)}
					{>(events(@k, formatInvoicesEvents))}
				</div>`,
			f: {
				k: k,
				get isOwner() {return k.owner() === currAccountLux.address;},
			},
			s: {
			}
		});

		return self;
	}
}


invoices.getInvoices = function(k) {
	let n = invoices.getNames(k);
	let r = [];
	for(let i = 0; i < n.length; i++) {
		r.push(k.addressByName(n[i]));
	}
	return r;
}


invoices.getNames = function(k) {
	let i = 1;
	let s = k.size().toNumber();
	let n = [];
	for(i; i <= s; i++) {
		let name = web3.toUtf8(k.nameByIndex(i));
		if(name) n.push(name);
	}
	return n.sort();
}


resources["Invoice v0.4.0"] = {
	template: invoice,
	interface: InvoiceContract,
	docPath: "docs/InvoicesAPI.md"
}

resources["Invoices v0.4.0"] = {
	template: invoices,
	interface: InvoicesContract,
	docPath: "docs/InvoicesAPI.md"
}

resources["InvoicesFactory v0.4.0"] = {
	template: factory,
	interface: FactoryContract,
	docPath: "docs/InvoicesAPI.md"
}

resources["Invoice v0.4.2"] = {
	template: invoice,
	interface: InvoiceContract,
	docPath: "docs/InvoicesAPI.md"
}

resources["Invoices v0.4.2"] = {
	template: invoices,
	interface: InvoicesContract,
	docPath: "docs/InvoicesAPI.md"
}

resources["InvoicesFactory v0.4.2"] = {
	template: factory,
	interface: FactoryContract,
	docPath: "docs/InvoicesAPI.md"
}


console.log("ran Invoices.js");

