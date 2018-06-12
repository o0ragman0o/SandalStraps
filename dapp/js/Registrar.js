// $import ("js/apis/RegistrarAPI.js");

const formatRegistrarEvents = (log, k) => {
	switch (log.event) {
		case 'Registered': return Tilux.l(`
			<h4>Registered '${utf8(log.args._regName)}'</h4>
			<label>Address</label>{>(ethAddrSml('${log.args._address}'))}
			`);
			break;
		case 'Removed': return Tilux.l(`
			<h4>Removed '${utf8(log.args._regName)}'</h4>
			<label>Address</label>{>(ethAddrSml('${log.args._address}'))}
			`);
			break;
		default: return formatWithdrawableEvents(log, k);						
	}
}

const registrar = {

	minimal: (k) => {
		return {
			w: `{>(regBase.minimal(@k))}`,
			f: {
				k: k,
			},
		}
	},

	basic: (k) => {
		return {
			w: `
				<div class="" id="{$@id}">
					{>(regBase.basic(@k))}
					<input type="checkbox" />
					<ul>{#(['li'], @registered)}</ul>
				</div>
			`,
			f: {
				id: `registrar-${k.address}-bas`,
				k: k,
				get registered() {
					var seen = new WeakSet();
					return registrar.getRegistered(k).map(addr=>{
						if (!seen.has(addr)) return kCandles[addr].minimal;
					})
				},
			}
		}
	},

	advanced: (k) => {
		const self = new Tilux({
			w: `
				<div class="" id="{$@id}">
					{>(regBase.advanced(@k))}
					<div class="layer">
						<input id="register-inp" class="ss-input ss-addr" placeholder="Contract Address"></input>
						<button id="register-btn">Register Contract</button><br />
						* Note: This is an owned public registrar.<br />  
						Anyone can register a contract and remove their own registered contract.<br />
						The registrar owner may remove or replace any registered contract.
					</div>
					<div class="layer ss-flex-container">
						{#([''], @registered)}
					</div>
					{>(events(@k, formatRegistrarEvents))}
				</div>
			`,
			f: {
				id: `registrar-${k.address}-adv`,
				k: k,
				rAddr: '',
				get registered () {
					return registrar.getRegistered(k).map(addr=>Tilux.l(kCandles[addr].minimal));
				},
			},
			s: {
				"#register-inp": {
					"change": (event) => {self.f.rAddr = event.target.value;},
				},
				"#register-btn": {
					"click": () => { self.f.k.register(self.f.rAddr,{from: currAccount, gas: 100000}); },
				},
			}
		})
		return self;
	},
}

registrar.getRegistered = function(k) {
	let n = registrar.getNames(k);
	let r = [];
	for(let i = 0; i < n.length; i++) {
		let addr = k.addressByName(n[i]);
		if(addr) r.push(addr);
	}
	return r;
}


registrar.getNames = function(k) {
	let i = 1;
	let s = k.size().toNumber();
	let n = [];
	for(i; i <= s; i++) {
		let name = web3.toUtf8(k.nameByIndex(i));
		if(name) n.push(name);
	}
	return n.sort();
}

resources["Registrar v0.4.0"] = {
	template: registrar,
	interface: RegistrarContract,
	docPath: "docs/registrarAPI.md"
}

resources["RegistrarFactory v0.4.0"] = {
	template: factory,
	interface: FactoryContract,
	docPath: "docs/RegistrarAPI.md"
}

console.log("ran Registrar.js");

