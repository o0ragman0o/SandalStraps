$import ("js/apis/SandalStrapsAPI.js");

const alphaStrapsAddr = "0xC81eAd39FB82Cd54c819bb4cC542eD1Ac97b378A";
// const alphaStrapsAddr = "0x4CfD8a09A3C88d20A5B166f86a9DfcB48eB464aF";
// var currStraps = {};

const fromFactoryPrice = new Tilux({
	w: `
		<span id='{@id}'>: {@name} for &Xi; {@price}</span>
	`,
	f: {
		name: "...",
		price: '',
	}
})

let newFromFactoryTplt = new Tilux({
	w: `
		<div id="{@id}">{>(@k(@kAddr))}</div>
	`,
	f: {
		id: "from-factory",
		kAddr: "",
		k: (kAddr)=>{return getContractTplt(kAddr).minimal || nullTplt}
	}
})

let registerKAddrTplt = new Tilux({
	w: `
		<div id="{@id}">{>(@k(@kAddr))}</div>
	`,
	f: {
		id: "register-kAddr",
		kAddr: "",
		k: (kAddr)=>{return getContractTplt(kAddr).minimal || nullTplt}
	}
})

function sandalStraps(kAddr){
	const k = SandalStrapsContract.at(kAddr);
	if(!k) return nullTplt;
	const regName = utf8(k.regName());
	const mr_a = k.metaRegistrar().toString();
	const mr_k = RegistrarContract.at(mr_a);
	const mr_n = [' '].concat(registrar.getNames(mr_k));
	const fc_a = mr_k.addressByName("factories").toString();
	const fc_k = RegistrarContract.at(fc_a);
	const fc_n = [' '].concat(registrar.getNames(fc_k));
	return {
		minimal: new Tilux({
			w: `
				{>(@regBase)}
			`,
			f: {
				kAddr: kAddr,
				regName: regName, 
				regBase: regBase(kAddr).minimal
			}
		}),
	
		basic: new Tilux({
			w: `
				{>(@regBase)}
			`,
			f: {
				kAddr: kAddr,
				regBase: regBase(kAddr).basic
			}
		}),
	
		advanced: new Tilux({
			w: `
			<div class="" id="{@id}">
				{>(@regBase)}
				<div class="layer">		
					<h3>Create New{>(fromFactoryPrice)}</h3>
					<div>
						<select id="sel-factory" class="ss-input" placeholder="Product" onchange="{@getFactory}(event,'{@kAddr}')">
							{#(['option'], @fc_n)}
						</select>
						<input class="ss-input" type="text" id="reg-name-{@kAddr}" placeholder="Contract Name"></input>
						<input class="ss-input ss-addr" type="text" id="owner-addr-{@kAddr}" placeholder="Owner Address"></input>
						<button onclick="(e)=>{create(e, k);}">Create</button>
						{>(newFromFactoryTplt)}
					</div>
		
					<h3>Add Factory</h3>
					<div>
						<input class="ss-input ss-addr" id="add-fact-{@kAddr}" onchange="" placeholder="Factory Address"></input>
						<button onclick="{@addFactory}">Add Factory</button>
						<div id="add-factory"></div>
					</div>
		
					<h3>Register Contract In...</h3>
					<div>
						<div id="reg-k"></div>
						<select class="ss-input" onchange="{@getRegistrar}(event,'{@kAddr}')">
							{#(['option'], @mr_n)}
						</select>
						<input class="ss-input ss-addr" id="reg-k-{@kAddr}" onchange="" placeholder="Contract Address"></input>
						<button onclick="(e)=>{@registerK}">Register</button>
						<div id="k-to-reg"></div>
						<div id="register-kAddr"></div>
					</div>
				</div>
				{>(@metaReg)}
			</div>
			`,
			f: {
				id: `sandalstraps-${kAddr}`,
				kAddr: kAddr,
				k: k,
				regBase: regBase(kAddr).advanced,
				metaReg: regBase(mr_a).minimal,
				mr_a: mr_a,
				mr_k: mr_k,
				mr_n: mr_n,
				fc_a: fc_a,
				fc_k: fc_k,
				fc_n: fc_n,
				getFactory: "sandalStraps.getFactory",
				getRegistrar: "sandalStraps.getRegistrar",
	
				addFactory: (e, k) => {
					k.addFactory(e.target.value);
				},
	
				registerK: (e, k) => {
	
				},
	
				inpChange: (e) => {
					Tilux.render('#k-to-reg', regBase(e.target.value).basic);
				},
			},
		})
	}
}

sandalStraps.getFactory = function(event, kAddr){
	let fName = event.target.value;
	let k = SandalStrapsContract.at(kAddr);
	newFromFactoryTplt.f.kAddr = k.addressByNameFrom('factories', fName);
	fromFactoryPrice.f.name = fName;
	fromFactoryPrice.f.price = k.getProductPrice(fName);
}

sandalStraps.getRegistrar = function(event, kAddr){
	let fName = event.target.value;
	let k = SandalStrapsContract.at(kAddr);
	registerKAddrTplt.f.kAddr = k.addressByNameFrom('metaregistrar', fName);
}



