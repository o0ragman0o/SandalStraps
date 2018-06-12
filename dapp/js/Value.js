// $import ("js/apis/ValueAPI.js");

const formatValueEvents = (log) => {
	return formatRegBaseEvents(log);
}

const valueOwner = (k) => {
	const self = {		
		w: `<div>
				<input id="value-inp" class="ss-input" type="number" placeholder="Set Value" value="{$@inpValue}"/>
				<button id="value-set">Set Value</button>
			</div>
			<div>
				<input id="deci-inp" class="ss-input" type="number" placeholder="Set Decimals" min="0" max="77" value="{$@inpDeci}"/>
				<button id="deci-set">Set Decimal</button>
			</div>
			`,
		f: {
			k: k,
			inpValue: 0,
			inpDeci: 0,
		},
		s: {
			"#value-inp": {
				"change": event => {self.f.inpValue = event.target.value}
			},
			"#deci-inp": {
				"change": event => {self.f.inpDeci = event.target.value}
			},
			"#value-set": {
				"click": ()=>{ k.set(self.f.inpValue, {from: currAccountLux.address}); },
			},
			"#deci-set": { 
				"click": ()=>{ k.setDecimal(self.f.inpDeci, {from: currAccountLux.address}); },
			},			
		}
	}
	return self;
}

const value = {
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
					{$@value}
				</div>
				`,
			f: {
				k: k,
				id: `value-${k.address}.bas`,
				decimals() { return k.decimals().toNumber()},
				value() {return k.value().div(10**k.decimals()).toNumber()},
			}			
		}
	},

	advanced: (k) => {
		const self = new Tilux({
			w: `
				<div id="{$@id}">
					<div>
						{>(regBase.advanced(@k))}
					</div>
					<div class="layer">
						<h2>{$@value} {$@units}</h2>
						<label class="evnt-label">decimals</label>{$@decimals}
						{>(valueOwner(@k), @isOwner)}
					</div>
					{>(events(@k, formatValueEvents))}

				</div>`,
	
			f: {
				k: k,
				id: `value-${k.address}.adv`,
				get decimals() { return k.decimals().toNumber()},
				get value() { return k.value().div(10**k.decimals()).toNumber(); },
				get units() { return 'units' in k ? utf8(k.units()) : ''},
				get isOwner() { return k.owner() === currAccountLux.address; },
			},
			s: {
			}
		});
		return self;
	}
}


resources["Value v0.4.0"] = {
	template: value,
	interface: ValueContract,
	docPath: "docs/ValueAPI.md"
}

resources["ValueFactory v0.4.0"] = {
	template: factory,
	interface: FactoryContract,
	docPath: "docs/ValueAPI.md"
}

console.log("ran Value.js");
