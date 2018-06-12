// $import ("js/apis/YankAPI.js");

const formatYankEvents = (log, k) => {
	switch (log.event) {
		case 'Failed': return Tilux.l(`
				<h4>Failed</h4>
				<label>Contract</label> {>(ethAddrSml('${log.args._kAddr}'))}
				<label>Account</label> {>(ethAddrSml('${log.args._for}'))}
				`);
			break;
		default: return formatWithdrawableEvents(log, k);						
	}
}


const yank = {

	minimal: (k)=>{
		const self = new Tilux({
			w: `{>(regBase.minimal(@k))}
			`,
			f: {
				k: k,
			},
			s: {

			}
		})

		return self;
	},
	basic: (k)=>{
		const self = new Tilux({
			w: `
			`,
			f: {

			},
			s: {

			}
		})

		return self;
	},
	advanced: (k)=>{
		const self = new Tilux({
			w: `<div id="{$@id}">
					{>(regBase.advanced(@k))}
					<div class="layer">
					{>(ethAddrInput)}
					</div>
					{>(events(@k, formatYankEvents))}
				</div>`,
			f: {
				k: k,
			},
			s: {

			}
		})

		return self;
	},
}


resources["Yank v0.4.2"] = {
	template: yank,
	interface: YankContract,
	docPath: "docs/YankAPI.md"
}


console.log("ran yank.js");
