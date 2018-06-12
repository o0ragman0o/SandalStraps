// $import ("js/apis/Erc20API.js");

const formatErc20Events = (log, k) => {
	switch (log.event) {
		case 'Transfer': return Tilux.l(`
				<h4>Transfer</h4>
				<label>From</label> {>(ethAddrSml('${log.args._from}'))}<br />
				<label>To</label> {>(ethAddrSml('${log.args._to}'))}<br />
				<label>Amount</label><i class="fas fa-fw fa-dot-circle"></i> ${log.args._value}<br />
				`);
			break;
		case 'Approval': return Tilux.l(`
				<h4>Approval</h4>
				<label>Holder</label> {>(ethAddrSml('${log.args._owner}'))}<br />
				<label>Spender</label> {>(ethAddrSml('${log.args._spender}'))}<br />
				<label>Amount</label><i class="fas fa-fw fa-dot-circle"></i> ${log.args._value}<br />
				`);
			break;
		default: return formatWithdrawableEvents(log, k);						
	}
}


const erc20Form = (k) => {
	const self = {
		w: `
		<div>
			<h2><i class="fas fa-fw fa-dot-circle"></i>{$@tokBal}</h2>
			<h3>{$@name} {$@symbol}</h3>
			<i class="fas fa-fw fa-dot-circle"></i>{$@supply} Total Supply
			<h3>Transfer</h3>
			<input id="toAddr-inp" placeholder="Recipient address" value="{$@toAddr}"></input>
			<input id="toAmnt-inp" type="number" placeholder="Amount" value="{$@toAmnt}"></input>
			<button id="transfer-btn">Transfer</button>
			<h3>Transfer From</h3>
			<p><i class="fas fa-fw fa-dot-circle"></i>{$@allowance(@allowFrom)} Approved from {$@allowFrom}</p>
			<input id="allowFrom-inp" placeholder="From address" value="{$@allowFrom}"></input>
			<input id="allowTo-inp" placeholder="Recipient address" value="{$@allowTo}"></input>
			<input id="allowAmnt-inp" type="number" placeholder="Amount" value="{$@allowAmnt}"></input>
			<button id="transferFrom-btn">Transfer</button>
			<h3>Approve</h3>
			<input id="approveAddr-inp" placeholder="Approve address" value="{$@apprAddr}"></input>
			<input id="approveAmnt-inp" type="number" placeholder="Amount" value="{$@apprAmnt}"></input>
			<button id="approve-btn">Approve</button>
		</div>
		`,
		f: {
			k: k,
			name: utf8(k.name()),
			symbol: utf8(k.symbol()),
			supply: k.totalSupply().div(10**k.decimals()),
			decimals: k.decimals().toNumber(),
			tokBal: k.balanceOf(currAccountLux.address).div(10**k.decimals().toNumber()),
			toAddr: '',
			toAmnt: '',
			allowFrom: '',
			allowTo: '',
			allowAmnt: '',
			apprAddr: '',
			apprAmnt: '',
			allowance: (frm)=>{return toDecimal(k.allowance(frm, currAccountLux.address), self.f.decimals)},
		},
		s: {
			'#toAddr-inp': {
				change: event => {self.f.toAddr = event.target.value},
			},
			'#toAmnt-inp': {
				change: event => {self.f.toAmnt = event.target.value},
			},
			'#transfer-btn': {
				click: () => {
					if(isAddr(self.f.toAddr) && self.f.toAmnt >= 0)
						self.f.k.transfer(self.f.toAddr, self.f.toAmnt * 10**self.f.decimals, {from: currAccountLux.address, gas:200000});
				},
			},
			'#allowFrom-inp': {
				change: event => {self.f.allowFrom = event.target.value},
			},
			'#allowTo-inp': {
				change: event => {self.f.allowTo = event.target.value},
			},
			'#allowAmnt-inp': {
				change: event => {self.f.allowAmnt = event.target.value},
			},
			'#transferFrom-btn': {
				click: () => {
					if(isAddr(self.f.allowFrom) && isAddr(self.f.allowTo) && self.f.allowAmnt >= 0)
						self.f.k.transferFrom(self.f.allowFrom, self.f.allowTo, toWei(self.f.toAmnt), {from: currAccountLux.address, gas:200000});
				},
			},
			'#approveAddr-inp': {
				change: event => {self.f.approveAddr = event.target.value},
			},
			'#approveAmnt-inp': {
				change: event => {self.f.approveAmnt = event.target.value},
			},
			'approve-btn': {
				click: () => {
					if(isAddr(self.f.apprAddr) && self.f.apprAmnt >= 0)
						self.f.k.approve(self.f.apprAddr, self.f.apprAmnt, toWei(self.f.toAmnt), {from: currAccountLux.address, gas:200000});
				},
			},
		},
	};

	return self;
}

const erc20 = {

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
			w: `<div id="{$@id}>"
					{>(regBase.advanced(@k))}
					{>(erc20Form(@k))}
					{>(events(@k, formatErc20Events))}
				</div>`,
			f: {
				k: k,
			}
		});
		return self;
	}
}


resources["Erc20"] = {
	template: erc20,
	interface: Erc20Contract,
	docPath: "docs/Erc20API.md"
}



console.log("ran Erc20.js");
