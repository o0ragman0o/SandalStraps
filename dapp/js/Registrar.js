$import ("js/apis/RegistrarAPI.js");

registrar = {
	minimal: (kAddr) => {
		return `
			${regBase.minimal(kAddr)}
		`
	},

	basic: (kAddr) => {
		let k = RegistrarContract.at(kAddr);
		let addresses = registrar.getAddrs(k);
		return `
			<div class="ss-flex-container" id="registrar-${kAddr}">
				<input type="checkbox"/>
				${regBase.minimal(kAddr)}
				<ul>${$list('li',addresses.map(addr=>{return getItfc(addr).basic(addr);}))}</ul>
			</div>
		`
	},

	advanced: (kAddr)=> {
		let k = RegistrarContract.at(kAddr);
		let addresses = registrar.getAddrs(k);
		return `
			<div class="ss-flex-container" id="registrar-${kAddr}">
				<input type="checkbox" />
				${regBase.advanced(kAddr)}
				<ul>${$list('li', addresses.map(addr=>{return regBase.basic(addr)}))}</ul>
			</div>
		`;
	},

	getAddrs: (k) => {
		let i = 1;
		let s = k.size().toNumber();
		var r = [];
		for(i; i <= s; i++) {
			r.push(k.addressByIndex(i));
		}
		return r;
	},

	getNames: (k) => {
		let i = 1;
		let s = k.size().toNumber();
		var n = [];
		for(i; i <= s; i++) {
			n.push(web3.toUtf8(k.nameByIndex(i)));
		}
		return n;
	}
}