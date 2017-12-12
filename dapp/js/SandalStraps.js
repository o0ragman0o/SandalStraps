$import ("js/apis/SandalStrapsAPI.js");

var alphaStrapsAddr = "0xC81eAd39FB82Cd54c819bb4cC542eD1Ac97b378A";
// var alphaStrapsAddr = "0x4CfD8a09A3C88d20A5B166f86a9DfcB48eB464aF";
var currStraps = {};

sandalStraps = {
	minimal: (kAddr) => {
		return `
		${regBase.minimal(kAddr)}
		`
	},

	basic: (kAddr) => {
		return `
		${regBase.basic(kAddr)}
		`
	},

	advanced: (kAddr) => {
		let k = SandalStrapsContract.at(kAddr);
		let mr_a = k.metaRegistrar();
		return `
		${regBase.advanced(kAddr)}
		${registrar.basic(mr_a)}
		`		
	}
}

function sandalStrapsTplt(kAddr) {

	let k = SandalStrapsContract.at(kAddr);
	let mr_a = k.metaRegistrar();
	let mr_k = RegistrarContract.at(mr_a);
	let mr_n = getNames(mr_k);
	let fc_a = mr_k.addressByName("factories");
	let fc_k = RegistrarContract.at(fc_a);
	let fc_n = getNames(fc_k);

	return `
	<div class="tplt" id="sandalstraps-${kAddr}">
		${regBase.basic(kAddr)}
		<button class="ss-button" onclick="goAddr('${mr_a}')">
			MetaRegistrar<br>
			<span class="ss-addr">${shortAddr(mr_a)}</span>
		</button>

		<h3>Create New...</h3>
		<div>
			<select class="ss-input" onchange="getFactory(event)">
				${$list('option', fc_n)}
			</select>
			<div id="sel-factory"></div>
			<input class="ss-input" type="text" id="reg-name-${kAddr}" placeholder="Contract Name"></input>
			<input class="ss-input ss-addr" type="text" id="owner-addr-${kAddr}" placeholder="Owner Address"></input>
			<button onclick="(e)=>{create(e, k);}">Create</button> Price <span id="create-price"></span> &Xi;
		</div>

		<h3>Add Factory</h3>
		<div>
			<input class="ss-input ss-addr" id="add-fact-${kAddr}" onchange="(e,'add-factory')=>{Factory(event)}" placeholder="Factory Address"></input>
			<div id="add-factory"></div>
			<button onclick="(e)=>{addFactory(e,${k})}">Add Factory</button>
		</div>

		<h3>Register Contract In...</h3>
		<div>
			<select class="ss-input" onchange="getRegistrar(event)">
				${$list('option', mr_n)}
			</select>
			<div id="reg-k"></div>
			<input class="ss-input ss-addr" id="reg-k-${kAddr}" onchange="(e)=>{$t('k-to-reg', regBaseTplt(e.target.value))}" placeholder="Contract Address"></input>
			<div id="k-to-reg"></div>
			<button onclick="(e)=>{registerK(e,${k})}">Register</button>
		</div>
	</div>
	`;
}

function changeStraps(kAddr) {
	if (web3.isAddress(kAddr))
		currStraps = SandalStrapsContract.at(kAddr);
}(alphaStrapsAddr);

function addFactory(e, k) {
	k.addFactory(e.target.value);
}

function registerK(e, k) {

}

function getRegistrar(e) {
	rg_n = e.target.value;
	rg_a = currStraps.addressByNameFrom("registrars", rg_n);
	$t("reg-k",regBaseTplt(rg_a));
}

function getFactory(e) {
	fc_n = e.target.value;
	fc_a = currStraps.addressByNameFrom("factories", fc_n);
	$t("sel-factory",regBaseTplt(fc_a));
	price = currStraps.getProductPrice(fc_n);
	$t("create-price",price);
}

function getRegBase(e, kAddr) {
	div = $id("sel-factory");
	fa = currStraps.addressByNameFrom("factories", e.target.value);
	div.innerHTML = regBaseTplt(fa);
}
