// $import ("js/apis/BytesMapAPI.js");

const bytesMap = {

	minimal: (k) => {
		return {
			w: `{>(regBase.minimal(@k))}`,
			f: {
				k: k,
			}
		}
	},

	basic: (k) => {
		return {
			w: `<div id="{$@id}">
				{>(regBase.basic(@k))}
				</div>`,
			f: {
				k: k,
			}
		}
	},

	advanced: (k) => {
		return new Tilux({
			w: `<div id="{$@id}>"
					{>(regBase.advanced(@k))}
					<div>
						<input id="key-input-{$@kAddr}" placeholder="Key" class="mono" type="text"></input>
						<button onclick="bytesMap.getBytes(e,{$@k})">Get</button>
						<div>
							<p><textarea id="text-area-{$@kAddr}" placeholder="Enter bytes to store"></textarea></p>
						</div>
					</div>
				</div>`,
			f: {
				k: k,
				kAddr: k.address,
			}
		});
	}
}

bytesMap.getBytes = function(e, k) {
	let types = "0x42ccbbbe";
	let b = k.bytes(e.target.value);
	let t = k.bytes(types+b.slice[2,10]);
	$id("text-area-${k.address}").innerHTML = web3.toUtf8(t);
}

console.log("ran BytesMap.js");
