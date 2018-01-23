function $import(file) {
    // DOM: Create the script element
    var jsElm = document.createElement("script");
    jsElm.type = "application/javascript";
    jsElm.src = file;
    document.head.appendChild(jsElm);
}

$import ("js/lib/blockies.js");
$import ("js/lib/Web3Tools.js");
$import ("js/style.js");
$import ("js/Accounts.js");
$import ("js/RegBase.js");
$import ("js/Factory.js");
$import ("js/Registrar.js");
$import ("js/SandalStraps.js");
$import ("js/Value.js");
$import ("js/BytesMap.js");
$import ("js/Version.js");
$import ("js/path.js");
$import ("js/app.js");

var contracts = {};

function start() {
	// TODO push interface names to contract resource 
	Tilux.render("#ss-style", ss_style);
	Tilux.render("#accounts", accountsTplt);
	Tilux.render("#nav-path", navPath);
	accountsTplt.
	navPath.push(alphaStrapsAddr);
	// mainTplt.f.kAddr = alphaStrapsAddr;
}

function getContractTplt(kAddr) {
	if (!web3.isAddress(kAddr)) return '';
	if (!(kAddr in contracts)) {
		contracts[kAddr] = getItfc(kAddr)(kAddr);
	}	
	return contracts[kAddr];
}

function getRegName(kAddr) {
	return utf8(RegBaseContract.at(kAddr).regName());
}

var mainTplt = new Tilux({
	w: `
		{>(@k(@kAddr))}
	`,
	f: {
		id: "main-tplt",
		kAddr: "",
		k: (kAddr)=>{return getContractTplt(kAddr).advanced || {w:'Contract not found',f:{}}}
	}
})