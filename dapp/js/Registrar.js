// $import ("js/apis/RegistrarAPI.js");

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
				registered: () => {
					var seen = new WeakSet();
					return registrar.getRegistered(k).map(addr=>{
						if (!seen.has(addr)) return kCandles[addr].minimal;
					})
				},
			}
		}
	},

	advanced: (k) => {
		let self = new Tilux({
			w: `
				<div class="" id="{$@id}">
					{>(regBase.advanced(@k))}
					<div class="layer">
						<input id="register-inp" class="ss-input ss-addr" placeholder="Contract Address"></input>
						<button id="register-btn">Register Contract</button>
					</div>
					<div class="layer">
						{#([''], @registered())}
					</div>
				</div>
			`,
			f: {
				id: `registrar-${k.address}-adv`,
				k: k,
				rAddr: '',
				registered: () => {
					return registrar.getRegistered(k).map(addr=>Tilux.l(kCandles[addr].minimal));
				},
			},
			s: {
				"#register-btn": {
					"click": () => {self.f.k.register(self.f.rAddr,{from: currAccount, gas: 100000});},
				},
				"#register-inp": {
					"change": (event) => {self.f.rAddr = event.target.value;},
				}
			}
		})
		return self;
	},

	events: (k) => {

	}
}

registrar.getRegistered = function(k) {
	let i = 1;
	let s = k.size().toNumber();
	var r = [];
	for(i; i <= s; i++) {
		r.push(k.addressByIndex(i));
	}
	return r;
}

registrar.getNames = function(k) {
	let i = 1;
	let s = k.size().toNumber();
	var n = [];
	for(i; i <= s; i++) {
		n.push(web3.toUtf8(k.nameByIndex(i)));
	}
	return n;
}

registrar.register = function(k, rAddr) {
}

console.log("ran Registrar.js");

