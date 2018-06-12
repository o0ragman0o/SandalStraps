// $import ("js/apis/StringsMapAPI.js");


const formatStringsMapEvents = (log, k) => {
	switch (log.event) {
		case 'Stored': return Tilux.l(`
			<h4>Stored</h4>
			<label>Hash</label><span class="mono">${log.args._hash}</span>
			`);
			break;
		default: return formatWithdrawableEvents(log, k);						
	}
}


const stringsMap = {

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
		const self =  new Tilux({
			w: `<div id="{$@id}">
					{>(regBase.advanced(@k))}
					<div class="layer">
						<input id="get-hash" placeholder="Key" class="mono" type="text" value="{$@hash}"></input>
						<button id="clear-hsh-btn">Clear Hash</button>
						<textarea id="string" placeholder="Enter string to store">{$@string}</textarea><br />
						<button id="store-btn">Store</button>
						<button id="clear-str-btn">Clear String</button>
					</div>
					{>(events(@k, formatStringsMapEvents))}
				</div>`,
			f: {
				k: k,
				kAddr: k.address,
				hash: '',
				string: '',
			},
			s: {
				"#get-hash": {
					change: event => {
						self.f.hash = event.target.value;
						self.f.string = self.f.k.strings(self.f.hash);
					},
				},
				"#string": {
					change: event => {
						self.f.string = event.target.value;
					},
				},
				"#store-btn": {
					click: event => {
						self.f.k.store(self.f.string, {from: currAccountLux.address})
					},
				},
				"#clear-str-btn": {
					click: event => {
						self.f.k.clear(self.f.string, {from: currAccountLux.address})						
					}
				},
				"#clear-hsh-btn": {
					click: event => {
						self.f.k.clearHash(self.f.hash, {from: currAccountLux.address})						
					}
				},
			}
		});

		return self;
	}
}


resources["StringsMap v0.4.0"] = {
	template: stringsMap,
	interface: StringsMapContract,
	docPath: "docs/StringsMapAPI.md"
}

resources["StringsMapFactory v0.4.0"] = {
	template: factory,
	interface: FactoryContract,
	docPath: "docs/StringsMapAPI.md"
}


console.log("ran StringsMap.js");
