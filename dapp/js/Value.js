$import ("js/apis/ValueAPI.js");


value = {
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
}

function valueTplt(kAddr) {

	let k = ValueContract.at(kAddr);
	let d = k.decimals().toNumber();
	let v = k.value().div(10**d).toNumber();

	return `
	<div class="tplt" id="value-${kAddr}">
		<div>
			${regBaseTplt(kAddr)}
		</div>
		<h1>${v}</h1>
		decimals: ${d}
		<div>
			Set Value
			<input id="value-${kAddr}" class="ss-input" type="text" placeholder="${v}" />
			<button onclick="(e)=>{vSet(e, ${k})}">Set</button>
		</div>
		<div>
			Set Decimals
			<input id="deci-${kAddr}" class="ss-input" type="number" value="${d}" min="0" max="77"/>
			<button onclick="(e)=>{dSet(e, ${k})}">Set</button>
		</div>
	</div>`
}

function vSet(e, k) {
	let t_v = $id(`value-${k.address}`).value;
	let v = (new web3.BigNumber(t_v)).mul(10**k.decimals());
	k.set(v, {from: currAccount});
}

function dSet(e, k) {
	let d = $id(`deci-${k.address}`).value;
	k.setDecimal(d, {from: currAccount});
}