// $import ("js/apis/PayableERC20API.js");

const formatPayableErc20Events = (log, k) => {
	switch (log.event) {
		case 'OrphanedTokensClaim': return Tilux.l(`
			<h4>Orphaned Tokens Claim</h4>
				<label>From</label> {>(ethAddrSml('${log.args._from}'))}<br />
				<label>To</label> {>(ethAddrSml('${log.args._to}'))}<br />
				<label>Amount</label><i class="fas fa-fw fa-dot-circle"></i> ${log.args._amount}<br />
				<label>Value</label> {>(ethVal('${log.args._value}'))}<br />
			`);
			break;
		case 'ExternalCall': return Tilux.l(`
			<h4>Orphaned Tokens Claim</h4>
				<label>To</label> {>(ethAddrSml('${log.args._to}'))}<br />
				<label>Value</label> {>(ethVal('${log.args._value}'))}<br />
			`);
			break;
		default: return formatErc20Events(log, k);
	}
}

const payableErc20 = {

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
		var self = new Tilux({
			w: `<div id="{$@id}">
					{>(regBase.advanced(@k))}
					<div class="layer">
						<h2>{>(ethVal(@ethBal))}</h2>
						{>(erc20Form(@k))}
					</div>
				</div>
				{>(events(@k, formatPayableErc20Events))}
			`,
			f: {
				k: k,
				get ethBal() {return k.etherBalanceOf(currAccountLux.address)},
			}
		});

		return self;
	}
}


resources["PayableERC20 v0.4.3"] = {
	template: payableErc20,
	interface: PayableERC20Contract,
	docPath: "docs/PayableERC20API.md"
}

resources["PayableERC20Factory v0.4.3"] = {
	template: factory,
	interface: FactoryContract,
	docPath: "docs/PayableERC20API.md"
}


console.log("ran PayableERC20.js");
