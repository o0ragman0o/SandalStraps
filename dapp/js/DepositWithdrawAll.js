// $import ("js/apis/DepositWithdrawAllAPI.js");

const formatDepositWithdrawAllEvents = (log, k) => {
	switch (log.event) {
		case 'ForwardingTo': return Tilux.l(`
				<h4>Forward To</h4>
				<label>Address</label> {>(ethAddrSml('${log.args._to}'))}
				`);
			break;
		default: return formatWithdrawableEvents(log, k);						
	}
}

const depositWithdrawAllOwner = (k) => {
	let self = {
		w: `
			<div>
				<input id="fAddr-inp" placeholder="Forwarding Address" value="{$@fAddr}"></input>
				<button id="fwrd-btn">Set Forwarding Address</button>
			</div>
		`,
		f: {
			k: k,
			fAddr: '',
		},
		s: {
			"#fAddr-inp": {
				'change': (event)=>{self.f.fAddr = event.target.value},
			},
			"#fwrd-btn": {
				'click': ()=>{if(isAddr(self.f.fAddr)) self.f.k.changeForwardTo(self.f.fAddr,{from:currAccountLux.address})},
			}
		}
	}
	return self;
}

const depositWithdrawAll = {

	minimal: (k) => {
		return {
			w: `{>(regBase.minimal(@k))}
			`,
			f: {
				k: k
			},
		}
	},

	basic: (k) => {
		return {
			w: `<div id="{$@id}>
					{>(regBase.basic(k))}
				</div>`,
			f: {
				k: k
			},
		}
	},

	advanced: (k) => {
		let self = new Tilux({
			w: `<div id="{$@id}">
					{>(regBase.advanced(@k))}
					<div class="layer">
					<h3>Forwarding to</h3>
					<img class="rb-idicon-sml idicon-sml" src="{$blockieSml(@forwardTo)}" />
					<a class="mono" href="https://etherscan.io/address/{$@forwardTo}" target="_blank">{$@forwardTo}</a>
					{>(depositWithdrawAllOwner(@k), @isOwner)}
					</div>
					{>(events(@k, formatDepositWithdrawAllEvents))}
				</div>`,
			f: {
				k: k,
				get forwardTo() { return k.forwardTo();},
				get isOwner() {return k.owner() === currAccountLux.address;},
			}
		});

		return self;
	}
}


resources["DepositWithdrawAll v0.4.1"] = {
	template: depositWithdrawAll,
	interface: DepositWithdrawAllContract,
	docPath: "docs/DepositWithdrawAllAPI.md"
}

resources["DepositWithdrawAllFactory v0.4.1"] = {
	template: factory,
	interface: FactoryContract,
	docPath: "docs/DepositWithdrawAllAPI.md"
}


console.log("ran DepositWithdrawAll.js");
