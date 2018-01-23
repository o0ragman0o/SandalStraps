$import ("js/apis/RegBaseAPI.js");


function regBase(kAddr){
	let	k = RegBaseContract.at(kAddr);
	if(!k || !kAddr) return nullTplt;
	let shortAddr = shortenAddr(kAddr);
	let idicon = `<img class="rb-idicon idicon" src="${blockie(kAddr)}" />`;
	let idiconSml = `<img class="rb-idicon-sml idicon-sml" src="${blockieSml(kAddr)}" />`;
	let regName = utf8(k.regName());
	let version = utf8(k.VERSION());
	return {
		minimal: new Tilux({
			w: `
				<div class="ss-button" id="regBase-${kAddr}-min" onclick="{@click}('{@kAddr}')">
					${idiconSml}
					<div class="inline">
						<div class="upper lightest">${regName}</div>
						<div class="darkest">${version}</div>
						<div class="ss-addr darkest">${shortAddr}</div>
					</div>
				</div>
			`,
			f: {
				regName: regName,
				kAddr: kAddr,
				click: 'navPath.push',
				// click: `mainTplt.f.kAddr = '${kAddr}'`,
			},
		}),

		basic: new Tilux({
			w: `<div class="ss-button inline" id="regBase-${kAddr}-bas" onclick="{@click}('{@kAddr}')">
					${idicon}
					<div class="inline">
						<div class="upper lightest"><b>${regName}</b></div>
						<div class="darkest">${version}</div>
						<div class="ss-addr">${kAddr}</div>
					</div>
				</div>
			`,
			f: {
				kAddr: kAddr,
				click: 'navPath.push',
			},
		}),

		advanced: new Tilux({
			w: `<div class="regbase-adv" id="regBase-${kAddr}-adv" onclick="{@click}">
						${idicon}
						<div class="rb-title"><span class="rb-regname">{@regName}</span> <span class="rb-version">${version}</div>
						<div class="rb-addr ss-addr">${kAddr}</div>
						<div class="rb-owner ss-addr">{@owner}</div>
						<div class="rb-bal">&Xi; {@balance}</div>
				</div>
				`,
			f: {
				kAddr: kAddr,
				regName: regName,
				owner: k.owner(),
				resource: k.resource(),
				balance: web3.fromWei(web3.eth.getBalance(kAddr), 'ether'),
				click: `mainTplt.f.kAddr = '${kAddr}'`,
			},
		}),
	}
}