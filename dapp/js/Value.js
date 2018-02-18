// $import ("js/apis/ValueAPI.js");

const Value = {
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
			w: `<div class="tplt" id="{$@id}">
					{>(regBase.basic(@k))}
					{$@value()}
				</div>
				`,
			f: {
				k: k,
				id: `value-${k.address}.bas`,
				decimals: () => { return k.decimals().toNumber()},
				value: () => {return k.value().div(10**this.decimals).toNumber()},
			}			
		}
	},

	advanced: (k) => {
		return {
			w: `
				<div id="{$@id}">
					<div>
						{>(regBase.advanced(@k))}
					</div>
					<div class="layer">
						<h2>{$@value()}</h2>
						decimals: {$@decimals()}
						<div>
							<input id="value-inp" class="ss-input" type="number" placeholder="Set Value" />
							<button id="value-set">Set</button>
						</div>
						<div>
							<input id="deci-inp" class="ss-input" type="number" placeholder="Set Decimals" min="0" max="77"/>
							<button id="deci-btn>Set</button>
						</div>
					</div>
				</div>`,
	
			f: {
				k: k,
				id: `value-${k.address}.adv`,
				decimals: () => { return k.decimals().toNumber()},
				value: () => {return k.value().div(10**this.decimals).toNumber()},
			}
		}
	}
}

console.log("ran Value.js");
