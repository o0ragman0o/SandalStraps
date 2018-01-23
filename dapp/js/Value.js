$import ("js/apis/ValueAPI.js");

function Value(kAddr){

	let k = ValueContract.at(kAddr);
	let decimals = k.decimals().toNumber();
	let value = k.value().div(10**decimals).toNumber();

	return {
		minimal: new Tilux({
			w: `<div class="tplt" id="value-{@kAddr}.min">
					{>(regBase(@kAddr).minimal)}
					{@value}
				</div>
			`,
			f: {
				kAddr: kAddr,
				value: value,
			}
		}),

		basic: new Tilux({
			w: `<div class="tplt" id="value-{@kAddr}.bas">
					{>(regBase(@kAddr).basic)}
					{@value}
				</div>
				`,
			f: {
				kAddr: kAddr,
				value: value,
			}
		}),

		advanced: new Tilux({
			w: `<div class="tplt" id="value-{@kAddr}.adv">
				<div>
					{>(regBase(@kAddr).advanced)}
				</div>
				<h2>{@value}</h2>
				decimals: {@decimals}
				<div>
					<input id="value-{@kAddr}" class="ss-input" type="number" placeholder="Set Value" />
					<button onclick="Value.vset('{@kAddr}')">Set</button>
				</div>
				<div>
					<input id="deci-{@kAddr}" class="ss-input" type="number" placeholder="Set Decimals" min="0" max="77"/>
					<button onclick="Value.dset('{@kAddr}')">Set</button>
				</div>
			</div>`,

			f: {
				kAddr: kAddr,
				value: value,
				decimals: decimals,
			}
		})
	}
}

Value.vset = function(kAddr) {
	let k = ValueContract.at(kAddr);
	let t_v = $id(`value-${kAddr}`).value;
	let v = (new web3.BigNumber(t_v)).mul(10**k.decimals());
	k.set(v, {from: currAccount, gas: 90000},()=>{contracts[kAddr] = Value(kAddr)});
}

Value.dSet = function(kAddr) {
	let k = ValueContract.at(kAddr);
	let d = $id(`deci-${k.address}`).value;
	k.setDecimal(d, {from: currAccount, gas: 90000},()=>{contracts[kAddr] = Value(kAddr)});
}			
