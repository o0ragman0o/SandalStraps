$import ("js/apis/RegistrarAPI.js");

function registrar(kAddr){
	let k = RegistrarContract.at(kAddr);
	let addresses = registrar.getAddrs(k);

	return {
		minimal: new Tilux({
			w: `{>(regBase(@kAddr).minimal)}`,
			f: {
				kAddr: kAddr,
			}
		}),
	
		basic: new Tilux({
			w: `
				<div class="ss-flex-container" id="{@id}">
					<input type="checkbox"/>
					{>(regBase(@kAddr).basic)}
					<ul>{#(['li'], @addresses)}</ul>
				</div>
			`,
			f: {
				kAddr: kAddr,
				id: `registrar-${kAddr}-bas`,
				addresses: addresses.map(addr=>{return Tilux.l(regBase(addr).minimal)}),
			}
		}),
	
		advanced: new Tilux({
			w: `
				<div class="" id="registrar-{@id}-adv">
					{>(regBase(@kAddr).advanced)}
					<div>
						<input class="ss-input ss-addr" id="register-{@kAddr}" onchange="" placeholder="Contract Address"></input>
						<button onclick="{@register}">Register Contract</button>
					</div>
					<div class="kTable">
					{#([''], @addresses)}
					</div>
				</div>
			`,
			f: {
				kAddr: kAddr,
				id: `registrar-${kAddr}-adv`,
				addresses: addresses.map(addr=>{return Tilux.l(regBase(addr).basic)}),
			}
		}),
	}
}


registrar.getAddrs = function(k) {
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
	k.register(rAddr,{from: currAccount, gas: 100000})
}