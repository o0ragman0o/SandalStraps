// $import('js/apis/RegBaseAPI.js');


const owned = (k) => {

	let self = new Tilux({
		w: `
			<div id="{$@id}">
			<h3>Owner Functions</h3>
				<button id="check">Check</button><br>
				<input id="new-owner-inp" type="text" placeholder="New owner address" value="{$@newOwner}"/>
				<button id="change-owner-btn">Change Owner</button><br>
				<input id="change-res-inp" type="text" placeholder="New resource hash" value="{$@res}"/>
				<button id="change-res-btn">Change Resource</button><br>
				<button id="destroy-btn">Destroy Contract</button><br>
			</div>
		`,
		f: {
			id: `owned-${k.address}`,
			newOwner: '',
			k: k,
			res: web3.toHex(k.resource()),
		},
		s: {
			'#check': {
				click: (event) => {	alert("Check! Check! Check 1, 2"); },
			},
			'#new-owner-inp': {
				change: (event) => { self.f.newOwner = event.target.value; },
			},
			'#change-owner-btn': {
				click: () => { regBase.changeOwner(k.address, self.f.newOwner); },
			},
			'#change-res-inp': {
				change: (event) => { self.f.res = event.target.value; },
			},
			'#change-res-btn': {
				click: () => { self.f.k.changeResourse(self.k.res); },
			},
			'#destroy-btn': {
				click: () => { self.f.k.destroy(); },
			},
		},
	})

	return self;
}

const newOwner = (k) => {
	return {
		w: '<button id="acc-owner-btn">Accept Ownership</button></br>',
		f: {

		},
		s: {
			'#acc-owner-btn': {
				click: () => { k.acceptOwnership(); },
			},
		},
	}
}

const regBase = {
	minimal: (k)=>{
		if(k) return {
			w: `
				<div class="ss-button" id="{$@id}" onclick="{$@click}('{$@kAddr}')">
					<img class="rb-idicon-sml idicon-sml" src="{$blockieSml(@kAddr)}" />
					<div class="inline">
						<div class="rb-regname-sml">{$@regName}</div>
						<div class="rb-version-sml darkest">{$@version}</div>
						<div class="ss-addr">{$shortenAddr(@kAddr)}</div>
					</div>
				</div>
			`,
			f: {
				id: `regBase-${k.address}-min`,
				k: k,
				kAddr: k.address,
				regName: utf8(k.regName()),
				version: utf8(k.VERSION()),
				click: 'navPath.push',
			},
		}
	},

	basic: (k) => {
		if(k) return {
			w: `
				<div id="{$@id}" class="ss-button" onclick="{$@click}('{$@kAddr}')">
					<img class="rb-idicon-sml idicon-sml" src="{$blockieSml(@kAddr)}" />
					<div class="inline">
						<div class="rb-regname-sml">{$@k.regname}</div>
						<div class="rb-version-sml darkest">{$@k.version}</div>
						<div class="ss-addr">{$@kAddr}</div>
					</div>
				</div>
			`,
			f: {
				id: `regBase-${k.address}-bas`,
				k: k,
				kAddr: k.address,
				regName: utf8(k.regName()),
				version: utf8(k.VERSION()),
				click: 'navPath.push',
			},
		}
	},

	advanced: (k) => {
		if(k) {
			let ret = new Tilux({
				w: `<div id="{$@id}" class="layer" >
						<div class="regBase-adv">
							<img class="rb-idicon idicon" src="{$blockie(@kAddr)}" />
							<div class="rb-title"><span class="rb-regname">{$@regName}</span> <span class="rb-version">{$@version}</div>
							<div class="rb-addr ss-addr k-addr"><i class="fas fa-fw fa-file-alt"></i> <a href="https://etherscan.io/address/{$@kAddr}" target="_blank">{$@kAddr}</a></div>
							<div class="rb-owner ss-addr u-addr"><i class="fas fa-fw fa-user"></i> <a href="https://etherscan.io/address/{$@owner}" target="_blank">{$@owner}</a></div>
							<div class="rb-ext">
								{>(withdrawable(@k))}
								{<(@isOwner(), @owned, '')}
								{<(@isNewOwner(),@newOwner,'')}
							</div>
						</div>
					</div>
					`,
				f: {
					id: `regBase-${k.address}-adv`,
					k: k,
					kAddr: k.address,
					regName: utf8(k.regName()),
					version: utf8(k.VERSION()),
					owner: k.owner(),
					owned: owned(k),
					newOwner: newOwner(k),
					isOwner: () => {return k.owner() == currAccountLux.address;},
					isNewOwner: () => {return k.newOwner() == currAccountLux.address;},
					resource: k.resource(),
				},
			});
			ret.gaze(currAccountLux);
			return ret;
		}
	},

	changeOwner(kAddr, newOwner){
		console.log('changeOwner',kAddr, newOwner);
	},

	changeResource(kAddr, newResource){
		console.log('changeResource',kAddr, newResource);
	},

	accpetOwnership(kAddr){
		console.log('acceptOwnership',kAddr);
	},

	destroy(kAddr){
		console.log('destroy',kAddr);
	},
}


console.log("ran RegBase.js");


