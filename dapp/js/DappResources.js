

const resources = new Proxy(
	{},
	{
		get: (target, key) => { return target[key] || target['DefaultResource']; }
	}
);

const contracts = new Proxy(new Map(),
	{
		get: (target, kAddr) => {
			kAddr = kAddr.toLowerCase();
			if (!web3.isAddress(kAddr)) return undefined;
			if (!(target.has(kAddr))) {
				k = RegBaseContract.at(kAddr);
				let regName = k.regName();
				let ver = utf8(k.VERSION());
				if(ver && regName) {
					k = resources[ver].interface.at(kAddr);
					// k = interfaceLUT[ver].at(kAddr);
					k.events = k.allEvents({fromBlock:0, toBlock:'latest'});
					target.set(kAddr, k);
				} else {
					return undefined;
				}
			}
			return target.get(kAddr);
		},
	}
);

const kCandles = new Proxy(new Map(),
	{
		get: (target, kAddr) => {
			kAddr = kAddr.toLowerCase();
			if (!web3.isAddress(kAddr)) return undefined;
			if (!(target.has(kAddr))) {
				let k = contracts[kAddr];
				if(!k) return undefined;
				let template = resources[utf8(k.VERSION())].template;
				// let template = templateLUT[utf8(k.VERSION())];
				target.set(kAddr, {
					minimal: template.minimal(k),
					basic: template.basic(k),
					advanced: template.advanced(k),
				})
				target.get(kAddr).advanced.gaze(currAccountLux);
				target.get(kAddr).advanced.gaze(blockLux);
			}
			return target.get(kAddr);		
		},
	}
);

function getRegName(kAddr) { return utf8(RegBaseContract.at(kAddr).regName()); }


console.log("ran DappResources.js");
