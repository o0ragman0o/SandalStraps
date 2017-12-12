function $import(file) {
    // DOM: Create the script element
    var jsElm = document.createElement("script");
    jsElm.type = "application/javascript";
    jsElm.src = file;
    document.head.appendChild(jsElm);
}

// $import ("js/lib/DomTools.js");
$import ("js/lib/Web3Tools.js");
$import ("js/lib/blockies.js");
$import ("js/Accounts.js");
$import ("js/SandalStraps.js");
$import ("js/RegBase.js");
$import ("js/Factory.js");
$import ("js/Registrar.js");
$import ("js/Value.js");
$import ("js/BytesMap.js");
$import ("js/Version.js");

// var tplts;

function start() {
	// TODO push interface names to contract resource 

	$id("strapsAddr").value = alphaStrapsAddr;
	$t("acc-tplt", accountsTplt());
	$t("main-tmplt", getItfc(alphaStrapsAddr).advanced(alphaStrapsAddr));
}

function changeStrapsAddr(event) {
	let addr = event.target.value;
	changeStraps(addr);
	$t("main-tmplt", getItfc(alphaStrapsAddr).advanced(alphaStrapsAddr));
}