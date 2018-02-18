// $import ("js/apis/FactoryAPI.js");

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
		return {
			w: `<div id="{$@id}">
				{>(regBase.advanced(@k))}
				<div class="layer" id="{$@id}">
						<h2>Create a {$@regName} contract for <i class="fab fa-fw fa-ethereum"></i>{$@price}</h2>
						<div>
							<input class="ss-input" type="text" placeholder="New Contract Name" onchange="{$@prodName} = this.value"></input>
							<input class="ss-input ss-addr" type="text" placeholder="Owner Address" value="{$@forOwner}" onchange="{$@forOwner} = this.value"></input>
							<button onclick="{$@create}({$@kAddr}, {$@prodName}, {$@forOwner})">Create</button>
						</div>
						<p>* Note: Contracts created directly by a factory are not registered in a registrar
						</p>
						<p>* If owner address is not given, the contract owner defaults to the creating accounts address
						</p>
				</div>
			</div>`,
			f: {
				id: `factory-${k.address}-adv`,
				k: k,
				kAddr: k.address,
				regName: utf8(k.regName()),
				price: toEther(k.value()),
				prodName: '',
				forOwner: currAccountLux.value,
				create: (kAddr, name, owner) => {contracts[kAddr].createNew(name, owner)}
			},
		}
	},
}

console.log("ran Factory.js");
