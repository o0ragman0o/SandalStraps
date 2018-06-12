// $import ("js/apis/SandalStrapsAPI.js");

const alphaStrapsAddr = {
	1: "0x4CfD8a09A3C88d20A5B166f86a9DfcB48eB464aF",
	108: "0xC81eAd39FB82Cd54c819bb4cC542eD1Ac97b378A",
	}[networkLux.network];


const formatSandalStrapsEvents = (log, k) => {
	switch (log.event) {
		case 'ProductCreated': return Tilux.l(`
				<h4>'${utf8(log.args._regName)}' Created from Factory '${utf8(log.args._factoryName)}'</h4>
				<label>Address</label> {>(ethAddrSml('${log.args._kAddr}'))}<br />
				<label>Created By</label> {>(ethAddrSml('${log.args._by}'))}<br />
				`);
			break;
		case 'RegistrarRegister': return Tilux.l(`
				<h4>Registered in '${utf8(log.args._registrar)}'</h4>
				<label>Address</label> {>(ethAddrSml('${log.args._kAddr}'))}
			`);
			break;
		case 'RegistrarRemove': return Tilux.l(`
				<h4>Deregistered from '${utf8(log.args._registrar)}'</h4>
				<label>Address</label> {>(ethAddrSml('${log.args._kAddr}'))}
			`);
			break;
		default: return formatWithdrawableEvents(log, k);						
	}
}


const fromFactoryPrice = (k) => {
	return {
		w: `
			<span id='{$@id}'><b class="upper">{$@name}</b> for {>(ethVal(@price))}</span>
		`,
		f: {
			id: "factory-price",
			name: "...",
			price: '0.0',
		}
	}
}
 

const sandalStrapsOwner = (k) => {
	let metaReg = contracts[k.metaRegistrar()];
	let regReg = contracts[metaReg.addressByName('registrar')];
	const self = {
		w: `
			<div class="layer">
				<h3>SandalStraps Additional Owner Functions</h3>
				<div class="ss-panel">
					<select id="reg-in-name" class="ss-input" placeholder="Registrar">
						{#(['option'], @rr_n)}
					</select>
					<input id="reg-in-kaddr" class="ss-input ss-addr" type="text" placeholder="Contract Address"></input>
					<button id="btn-reg-in">Register In...</button>
				</div>
				<div class="ss-panel">
					<select id="reg-rem-name" class="ss-input" placeholder="Registrar" selected={$@selRegVal}>
						{#(['option'], @rr_n)}
					</select>
					<input id="reg-rem-kaddr" class="ss-input ss-addr" type="text" placeholder="Contract Address"></input>
					<button id="btn-reg-rem">Remove From...</button>
				</div>
				<div class="ss-panel">
					<input id="chg-owner-kAddr" class="ss-input ss-addr" type="text" placeholder="Contract Address"></input>
					<input id="chg-owner-oAddr" class="ss-input ss-addr" type="text" placeholder="New Owner Address"></input>
					<button id="btn-chg-owner">Change Owner Of...</button>
				</div>
				<div class="ss-panel">
					<input id="chg-res-kAddr" class="ss-input ss-addr" type="text" placeholder="Contract Address"></input>
					<input id="chg-res-val" class="ss-input mono" type="text" placeholder="Resource"></input>
					<button id="btn-chg-res">Change Resource Of...</button>
				</div>
				<div class="ss-panel">
					<input id="set-val-kAddr"  class="ss-input ss-addr" type="text"placeholder="Contract Address"></input>
					<input id="set-val-val" class="ss-input" type="number" placeholder="Value"></input>
					<button id="btn-set-val">Set Value Of...</button>
				</div>
				<div class="ss-panel">
					<textarea id="rsv-names" class="ss-input" placeholder='Reserved Names JSON, e.g.[{name:"reservethisname", reserved:"true"},{name:"clearthisname", reserved:"false"},...]'></textarea>
					<button id="btn-rsv-names">Reserve Names</button>
				</div>
				<div class="ss-panel">
					<input id="pxy-call-kAddr" class="ss-input ss-addr" type="text" placeholder="Contract Address"></input>
					<textarea id="pxy-call-data" class="ss-input mono" placeholder="Call Data, e.g. 0xacb123..."></textarea>
					<button id="btn-pxy-call">Call Contract By Proxy</button>
				</div>
			</div>
		`,
		f: {
			k: k,
			rr_n: [''].concat(registrar.getNames(regReg)),
			regInName: '',
			regInKAddr: '',
			regRemName: '',
			regRemKAddr: '',
			chgOwnerKAddr: '',
			chgOwnerOAddr: '',
			chgResKAddr: '',
			chgResVal: '',
			setValKAddr: '',
			setValVal: 0,
			rsvNames: '',
			pxyCallKAddr: '',
			pxyCallData: ''
		},
		s: {
			"#reg-in-name": {
				'change': event => self.f.regInName = event.target.value,
			},
			"#reg-in-kaddr": {
				'change': event => self.f.regInKAddr = event.target.value,
			},
			"#btn-reg-in": {
				'click': () => self.f.k.registerIn(self.f.regInName, self.f.regKAddr, {from: currAccountLux.address}),
			},

			"#reg-rem-name": {
				'change': event => self.f.regRemName = event.target.value,
			},
			"#reg-rem-kaddr": {
				'change': event => self.f.regRemKAddr = event.target.value,
			},
			"#btn-reg-rem": {
				'click': () => self.f.k.removeFromIn(self.f.regRemName, self.f.regRemKAddr, {from: currAccountLux.address}),
			},

			"#chg-owner-kaddr": {
				'change': event => self.f.chgOwnerKAddr = event.target.value,
			},
			"#chg-owner-oaddr": {
				'change': event => self.f.chgOwnerOAddr = event.target.value,
			},
			"#btn-chg-owner": {
				'click': () => self.f.k.changeOwnerOf(self.f.chgOwnerKAddr, self.f.chgOwnerOAddr, {from: currAccountLux.address}),
			},

			"#chg-res-kaddr": {
				'change': event => self.f.chgResKAddr = event.target.value,
			},
			"#chg-res-val": {
				'change': event => self.f.chgResVal= event.target.value,
			},
			"#btn-chg-res": {
				'click': () => self.f.k.changeResourceOf(self.f.chgResKAddr, self.f.chgResVal, {from: currAccountLux.address}),
			},

			"#set-val-kaddr": {
				'change': event => self.f.setValKAddr = event.target.value,
			},
			"#set-val-val": {
				'change': event => self.f.setValVal= event.target.value,
			},
			"#btn-set-val": {
				'click': () => {
					let decimals = 0;
					let vk = contracts[self.f.setValKAddr];
					if('decimals' in vk) decimals = contracts[self.f.setValKAddr].decimals();
					self.f.k.setValueOf(self.f.setValKAddr, self.f.setValVal*10**decimals, {from: currAccountLux.address});
				},
			},

			"#rsv-names": {
				'change': event => self.f.rsvNames = event.target.value,
			},
			"#btn-rsv-names": {
				'click': () => self.f.k.reserveNames(self.f.regName, self.f.regKAddr, {from: currAccountLux.address}),
			},

			"#pxy-call-kaddr": {
				'change': event => self.f.pxyCallKAddr = event.target.value,
			},
			"#pxy-call-data": {
				'change': event => self.f.pxyCallData = event.target.value,
			},
			"#btn-pxy-call": {
				'click': () => self.f.k.callAsContract(self.f.pxyCallKAddr, self.f.pxyCallData, {from: currAccountLux.address}),
			},
		}
	}

	return self;
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
		const self = new Tilux({
			w: `
			<div class="" id="{$@id}">
				{>(regBase.advanced(@k))}
				{>(kCandles[@metaReg.address].minimal)}
				{>(sandalStrapsOwner(@k), @isOwner)}
				<div class="layer">
					<h3>User Functions</h3>
					<div class="ss-panel">
						<h3>Create a <strong>{$@crtProdFact}</strong> contract for  {>(ethVal(@crtProdPrice))}</h3>
						<select id="sel-factory" class="ss-input" placeholder="Product" value="{$@crtProdFact}">
							{#(['option'], @fc_n)}
						</select>
						<input id="crt-prod-name" class="ss-input" type="text" placeholder="Contract Name" value="{$@crtProdName}"></input>
						<input id="crt-prod-owner" class="ss-input ss-addr" type="text" placeholder="Owner Address" value="{$@crtProdOwner}"></input>
						<button id="btn-crt-prod">Create New...</button>
						{>(@s_selFact)} 
					</div>
					<div class="ss-panel">
						<input id="add-factory-inp" class="ss-input ss-addr" placeholder="Factory Address" value="{$@addFactAddr}"></input>
						<button id="add-factory-btn">Add Factory</button>
						{>(@s_addFact)}
					</div>
				</div>
				{>(events(@k, formatSandalStrapsEvents))}					
			</div>
			`,
			f: {
				id: `sandalstraps-${k.address}-adv`,
				k: k,
				kAddr: k.address,
				metaReg: metaReg,
				factReg: factReg,
				fc_n: [''].concat(registrar.getNames(factReg)),
				s_selFact: new Tilux({w:'<span id={$@id}>{>(@c)}</span>', f:{id:"factory-min", c:''}}),
				s_addFact: new Tilux({w:'<span id={$@id}>{>(@c)}</span>', f:{id:"add-factory-min", c:''}}),
				selFactIndex: 0,
				addFactAddr: '',
				crtProdFact: '',
				crtProdName: '',
				crtProdOwner: '',
				crtProdPrice: new BigNumber(0),
				get isOwner() {return k.owner() === currAccountLux.address;},
			},
			s: {
				'#add-factory-inp': {
					change: (event)=>{
						let kAddr = event.target.value;
						self.f.addFactAddr = kAddr;
						if (isAddr(kAddr) && !!contracts[kAddr]) {
							self.f.s_addFact.f.c = regBase.minimal(contracts[kAddr]);
							console.log(self.f.addFactAddr);
						}
					},
				},
				'#add-factory-btn': {
					click: ()=>{
						if(!!contracts[self.f.addFactAddr]) {
							k.registerFactory(self.f.addFactAddr, {from: currAccountLux.address, gas:500000})
						}
					},
				},
				'#sel-factory': {
					change: (event)=>{
						if (self.f.selFactIndex !== 0 && event.target.selectedIndex === 0) {
							event.target.selectedIndex = self.f.selFactIndex;
							return;
						}
						let fName = event.target.value;
						let fAddr = self.f.factReg.addressByName(fName);
						self.f.selFactIndex = event.target.selectedIndex;
						self.f.crtProdFact = fName;
						self.f.crtProdPrice = self.f.k.getProductPrice(fName);
						self.f.s_selFact.f.c = fAddr == "0x0000000000000000000000000000000000000000" ? '' : kCandles[fAddr].minimal;
					},
				},
				'#crt-prod-name': {
					change: event => self.f.crtProdName = event.target.value,
				},
				'#crt-prod-owner': {
					change: event => self.f.crtProdOwner = event.target.value,
				},
				'#btn-crt-prod': {
					click: () => self.f.k.newProduct(self.f.crtProdFact, self.f.crtProdName, self.f.crtProdOwner,
						{from: currAccountLux.address, value: self.f.crtProdPrice, gas: 3000000}),
				},
			},
		});

		return self;
	},
}



resources["SandalStraps v0.4.0"] = {
	template: sandalStraps,
	interface: SandalStrapsContract,
	docPath: "docs/SandalStrapsAPI.md"
}

resources["SandalStrapsFactory v0.4.0"] = {
	template: factory,
	interface: FactoryContract,
	docPath: "docs/SandalStrapsAPI.md"
}

console.log("ran SandalStraps.js");
