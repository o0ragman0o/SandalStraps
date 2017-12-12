$import ("js/apis/BytesMapAPI.js");

bytesMap = {
	minimal: (kAddr) => {
		return `
		${regBase.minimal(kAddr)}
		`
	},

	basic: (kAddr) => {
		return `
		${regBase.basic(kAddr)}
		`
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
}

function bytesMapTplt(kAddr) {

	let k = RegistrarContract.at(kAddr);
	return `
		<div class="tplt" id="bytesmap-${kAddr}">
			${regBaseTplt(kAddr)}
		</div>
		<div>
		<label>Key</key><input id="key-input-${kAddr}" class="mono" type="text"></inputs>
		<button onclick="getBytes(e,${k})">Get</button>
		<label for="text-area-${kAddr}">Type</label> <span id="type-${kAddr}"></span>
		<textarea id="text-area-${kAddr}"></textarea>
		</div>`;
}

function getBytes(e, k) {
	let types = "0x42ccbbbe";
	let b = k.bytes(e.target.value);
	let t = k.bytes(types+b.slice[2,10]);
	$id("text-area-${k.address}").innerHTML = web3.toUtf8(t);
}
