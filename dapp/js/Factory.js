// $import ("js/apis/FactoryAPI.js");
    

const formatFactoryEvents = (log) => {
	switch (log.event) {
		case 'Created': return Tilux.l(`
				<h4>Created '${utf8(log.args._regName)}'</h4>
				<label>Address</label> {>(ethAddrSml('${log.args._kAddr}'))}<br />
				<label>Creator</label> {>(ethAddrSml('${log.args._creator}'))}<br />
				`);
			break;
		default: return formatWithdrawableEvents(log);						
	}
}

const factory = {
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
				<div>Price <i class="fab fa-fw fa-ethereum"></i>{$@price}</div>
				</div>
			`,
			f: {
				k: k,
				id: `factory-${k.address}-bas`,
				price: toEther(k.value()),
			},
		}
	},

	advanced: (k) => {
		const self = new Tilux({
			w: `<div id="{$@id}">
				{>(regBase.advanced(@k))}
				<div class="layer" id="{$@id}">
					<h2>Create a {$@regName} contract for <i class="fab fa-fw fa-ethereum"></i>{$@prodPrice}</h2>
					<div class="ss-panel">
						<input id="prod-name" class="ss-input" type="text" placeholder="New Contract Name"></input>
						<input id="prod-owner" class="ss-input ss-addr" type="text" placeholder="Owner Address"></input>
						<button id="btn-prod-crt" Create">Create</button>
					</div>
					<p>* Note: Contracts created directly by a factory are not registered in a registrar. If the product contract is required to be a registered 
					component of a SandalStraps organisation, then it should be created using 'Create New' in the organisation's SandalsStraps contract.
					</p>
					<p>* If no owner address is given, the product contract owner defaults to the creating accounts address
					</p>
				</div>
				{>(events(@k, formatFactoryEvents))}
			</div>`,
			f: {
				id: `factory-${k.address}-adv`,
				k: k,
				kAddr: k.address,
				regName: utf8(k.regName()),
				prodPrice: toEther(k.value()),
				prodName: '',
				forOwner: currAccountLux.value,
			},
			s: {
				"#prod-name": {
					change: event => self.f.prodName = event.target.value,
				},
				"#prod-owner": {
					change: event => self.f.prodOwner = event.target.value,					
				},
				"#btn-prod-crt": {
					'click': () => {
						self.f.k.createNew(self.f.prodName, self.f.prodOwner, {from: currAccountLux.address, gas: 3000000, value: self.f.k.value()})
					},
				},
			}
		});

		return self;
	},
}

console.log("ran Factory.js");
