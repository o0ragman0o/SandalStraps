$import ("js/apis/RegBaseAPI.js");

regBase = {
	minimal: (kAddr)=> {
		let k = RegBaseContract.at(kAddr);
		let idicon = blockie(kAddr);
		if(regBase.ver(k) === '') return;
		return `
			<div class="col2 ss-button" id="regBase-${kAddr}" onclick="$t('main-tmplt',getItfc(${kAddr}).advanced()')">
				${utf8(k.regName())}<span class="ss-addr">${shortAddr(kAddr)}</span>
			</div>
		`;
	},

	basic: (kAddr)=>{
		let k = RegBaseContract.at(kAddr);
		let idicon = blockie(kAddr);
		let ver = regBase.ver(k);
		if(ver === '') return;
		return `
			<div class="col3 ss-button" id="regBase-${kAddr}" onclick="$t('main-tmplt',getItfc(${kAddr}).advanced()')">
				<div class=""><b class="upper">${utf8(k.regName())}</b></div>
				<div class="ss-addr">${shortAddr(kAddr)}</div>
			</div>
		`;
	},

	advanced: (kAddr)=>{
		let k = RegBaseContract.at(kAddr);
		let owner = k.owner();
		let idicon = blockie(kAddr);
		let ver = regBase.ver(k);
		if(ver === '') return;
		return `
			<div class="col12 ss-button" id="regBase-${kAddr} onclick="$t('main-tmplt',getItfc(${kAddr}).advanced()'">
				<div class=""><b class="upper">${web3.toUtf8(k.regName())}</b> ${web3.toUtf8(k.VERSION())}</div>
				<div class="ss-addr">${kAddr}</div>
			</div>
			<hr />
			`;
	},

	ver: (k) => {
		return utf8(k.VERSION());
	},
}
