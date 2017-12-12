$import ("js/apis/FactoryAPI.js");

factory = {
	minimal: (kAddr) => {
		return `
		${regBase.minimal(kAddr)}
		`
	},

	basic: (kAddr) => {

	let k = FactoryContract.at(kAddr);
	let v = factory.price(k);
	return `
		<div>Price ${v}&Xi;</div>
	`;
	},

	advanced: (kAddr) => {

	let k = FactoryContract.at(kAddr);
	let v = web3.fromWei(k.value()).toNumber();
	return `
		<div class="tplt" id="factory-${kAddr}">
		    <div>
				<h2>Price ${v}&Xi;</h2>
				<div>
					<input class="ss-input" type="text" id="reg-name-${kAddr}" placeholder="Contract Name"></input>
					<input class="ss-input ss-addr" type="text" id="owner-addr-${kAddr}" placeholder="Owner Address"></input>
					<button onclick="(e)=>{create(e, k);}">Create</button>
				</div>
			</div>
		</div>`;
	},

	create: (e, k) => {
		let rn = $id("reg-name-"+ k.address).value;
		let o = $id("owner-addr-"+ k.address).value;
		if(!web3.isAddress(o)) return;
		k.create(rn, o);
	},

	price: (k) => {
		return web3.fromWei(k.value()).toNumber();
	}
}


// function factoryTplt(kAddr) {

// 	let k = FactoryContract.at(kAddr);
// 	let v = web3.fromWei(k.value()).toNumber();
// 	return `
// 		<div class="tplt" id="factory-${kAddr}">
// 			${regBaseTplt(kAddr)}
// 		    <div>
// 				<h2>Price ${v}&Xi;</h2>
// 				<div>
// 					<input class="ss-input" type="text" id="reg-name-${kAddr}" placeholder="Contract Name"></input>
// 					<input class="ss-input ss-addr" type="text" id="owner-addr-${kAddr}" placeholder="Owner Address"></input>
// 					<button onclick="(e)=>{create(e, k);}">Create</button>
// 				</div>
// 			</div>
// 		</div>`;
// }

// function create(e, k) {
// 	let rn = $id("reg-name-"+ k.address).value;
// 	let o = $id("owner-addr-"+ k.address).value;
// 	if(!web3.isAddress(o)) return;
// 	k.create(rn, o);
// }

