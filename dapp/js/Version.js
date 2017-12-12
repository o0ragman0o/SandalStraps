$import ("js/apis/VersionAPI.js");

interfaces = {
	"RegBase v0.4.0": regBase,
	"Registrar v0.4.0": registrar,
	"RegistrarFactory v0.4.0": factory,
	"BytesMap v0.4.0": bytesMap,
	"BytesMapFactory v0.4.0": factory,
	"Value v0.4.0": value,
	"ValueFactory v0.4.0": factory,
	"SandalStraps v0.4.0": sandalStraps,
	"SandalStrapsFactory v0.4.0": factory
}

function getItfc(kAddr) {
	return interfaces[utf8(VersionContract.at(kAddr).VERSION())];
}



