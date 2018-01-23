$import ("js/apis/BytesMapAPI.js");

const bytesMap = (kAddr) => {

	let k = BytesMapContract.at(kAddr);

	return {
		minimal: new Tilux({
			w: `{>(@regBase)}`,
			f: {
				kAddr: kAddr,
				regBase: regBase(kAddr).minimal,
			}
		}),
	
		basic: new Tilux({
			w: `{>(@regBase)}`,
			f: {
				kAddr: kAddr,
				regBase: regBase(kAddr).basic,
			}
		}),

		advanced: new Tilux({
			w: `
				{>(@regBase)}
				<div>
				<input id="key-input-{@kAddr}" placeholder="Key" class="mono" type="text"></input>
				<button onclick="bytesMap.getBytes(e,{@k})">Get</button>
				<div>
					<textarea id="text-area-{@kAddr}" placeholder="Enter bytes to store"></textarea>
				</div>
				</div>`,
			f: {
				kAddr: kAddr,
				k: k,
				regBase: regBase(kAddr).advanced,
			}
		}),
	}
}

bytesMap.getBytes = function(e, k) {
	let types = "0x42ccbbbe";
	let b = k.bytes(e.target.value);
	let t = k.bytes(types+b.slice[2,10]);
	$id("text-area-${k.address}").innerHTML = web3.toUtf8(t);
}
