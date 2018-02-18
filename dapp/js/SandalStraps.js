// $import ("js/apis/SandalStrapsAPI.js");

const alphaStrapsAddr = "0x4CfD8a09A3C88d20A5B166f86a9DfcB48eB464aF";
// const alphaStrapsAddr = "0xC81eAd39FB82Cd54c819bb4cC542eD1Ac97b378A";

const fromFactoryPrice = (k) => {
	return {
		w: `
			<span id='{$@id}'><b class="upper">{$@name}</b> for <i class="fab fa-fw fa-ethereum"></i>{$@price}</span>
		`,
		f: {
			id: "factory-price",
			name: "...",
			price: '0.0',
		}
	}
}

const sandalStraps = {
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
			w: `{>(regBase.basic(@k))}`,
			f: {
				k: k,
			}
		}
	},
	
	advanced: (k) => {
		let metaReg = contracts[k.metaRegistrar()];
		let factReg = contracts[metaReg.addressByName('factories')];
		let self = new Tilux({
			w: `
			<div class="" id="sandalstraps-{$@kAddr}-adv">
				{>(regBase.advanced(@k))}
				<div class="layer">		
					<h3>Create New <span id="factory-price"></span></h3>
					<div>
						<select id="sel-factory" class="ss-input" placeholder="Product" selected={$@selFactVal}>
							{#(['option'], @fc_n)}
						</select>
						<input class="ss-input" type="text" id="reg-name-{$@kAddr}" placeholder="Contract Name"></input>
						<input class="ss-input ss-addr" type="text" id="owner-addr-{$@kAddr}" placeholder="Owner Address"></input>
						<button onclick="(e)=>{create(e, k);}">Create</button>
						{>(@s_selFact)}
					</div>
		
					<h3>Add Factory</h3>
					<div>
						<input id="add-factory-inp" class="ss-input ss-addr" placeholder="Factory Address"></input>
						<button id="add-factory-btn" onclick="{$@addFactory}">Add Factory</button>
						{>(@s_addFact)}
					</div>
		
					<h3>Register Contract In...</h3>
					<div>
						<select id="sel-reg" class="ss-input">
							{#(['option'], @mr_n)}
						</select>
						<input class="ss-input ss-addr" id="reg-k-{$@kAddr}" placeholder="Contract Address"></input>
						<button id="register-btn">Register</button>
						{>(@s_selReg)}
					</div>
				</div>
				<div class="layer">
					{>(kCandles[@metaReg.address].minimal)}
				</div>
			</div>
			`,
			f: {
				id: `sandalstraps-${k.address}-adv`,
				k: k,
				kAddr: k.address,
				metaReg: metaReg,
				factReg: factReg,
				mr_n: [''].concat(registrar.getNames(metaReg)),
				fc_n: [''].concat(registrar.getNames(factReg)),
				s_selFact: new Tilux({w:'<div id={$@id}>{>(@c)}</div>',f:{id:"factory-min", c:''}}),
				s_selReg: new Tilux({w:'<div id={$@id}>{>(@c)}</div>',f:{id:"registrar-min", c:''}}),
				s_addFact: new Tilux({w:'<div id={$@id}>{>(@c)}</div>',f:{id:"add-factory-min", c:''}}),
			},
			s: {
				'#add-factory-inp': {
					keypress: (event)=>{
						let kAddr = event.target.value;
						if (web3.isAddress(kAddr) && !!contracts[kAddr].VERSION()) {
							self.f.s_addFact.f.c = regBase.minimal(kAddr);
							console.log(self.f.addFactAddr);
						}
					},
				},
				'#add-factory-btn': {
					click: ()=>{console.log('add factory pressed. ')}
				},
				'#sel-factory': {
					change: (event)=>{
						let fAddr = self.f.factReg.addressByName(event.target.value);
						self.f.s_selFact.f.c = kCandles[fAddr].minimal;
					},
				},
				'#sel-reg': {
					change: (event) => {
						let rAddr = self.f.metaReg.addressByName(event.target.value);
						self.f.s_selReg.f.c = kCandles[rAddr].minimal;
					},
				},
			},
		});
		return self;
	},
}

console.log("ran SandalStraps.js");
