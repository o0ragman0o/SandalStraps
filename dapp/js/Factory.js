$import ("js/apis/FactoryAPI.js");

const factory = (kAddr) => {
	const k = FactoryContract.at(kAddr);
	const v = web3.fromWei(k.value()).toNumber();
	return{ 
		minimal: new Tilux({
			w: `
				{>(@regBase)}
			`,
			f: {
				regBase: regBase(kAddr).minimal,
			}
		}),
	
		basic: new Tilux({
			w: `
				{>(@regBase)}
				<div>Price {@price}&Xi;</div>
			`,
			f: {
				regBase: regBase(kAddr).basic,
				price: v,
			}
		}),
	
		advanced: new Tilux({
			w: `
			<div class="tplt" id="factory-${kAddr}">
				{>(@regBase)}
					<h2>Create a '{@regBase.f.regName}' contract for ${v}&Xi;</h2>
					<div>
						<input class="ss-input" type="text" id="reg-name-${kAddr}" placeholder="New Contract Name"></input>
						<input class="ss-input ss-addr" type="text" id="owner-addr-${kAddr}" placeholder="Owner Address"></input>
						<button onclick="(e)=>{create(e, k);}">Create</button>
					</div>
					<p>* Note: Contracts created directly by a factory are not registered in a registrar
					</p>
			</div>`,
			f: {
				regBase: regBase(kAddr).advanced,
				price: v,
			}

		}),
	
		create: (e, k) => {
			const rn = $id("reg-name-"+ k.address).value;
			const o = $id("owner-addr-"+ k.address).value;
			if(!web3.isAddress(o)) return;
			k.create(rn, o);
		},
	
		price: (k) => {
			return web3.fromWei(k.value()).toNumber();
		}
	}
}