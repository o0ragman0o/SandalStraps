// $import('js/apis/RegBaseAPI.js');

const regOwned = (k) => {
	let self = {
		w: `
			{>(owned(@k))}
			<input id="change-res-inp" type="text" placeholder="New resource hash" value="{$@res}"/>
			<button id="change-res-btn">Change Resource</button><br>
			<button id="destroy-btn">Destroy Contract</button><br>
		`,
		f: {
			k: k,
			res: '',
		},
		s: {
			"change-res-inp": {
				change: (event) => {
					self.f.res = event.target.value;
				},
			},
			"change-res-btn": {
				click: () => {
					self.f.k.changeResource(newResource);
					console.log('changeResource',self.f.k.address, newResource);
				},
			},
			"destroy-btn": {
				click: ()=>{
					self.f.k.destroy();
					console.log('destroy',kAddr);
				},
			},
		},
	};
	return self;
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
								{<(@isOwner(), regOwned(@k), '')}
								{<(@isOwner(), owning(@k), '')}
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
					s_owning: owning(k),
					s_newOwner: newOwner(k),
					isOwner: () => {return k.owner() === currAccountLux.address;},
					isNewOwner: () => {return k.newOwner() === currAccountLux.address;},
					resource: k.resource(),
				},
			});
			ret.gaze(currAccountLux);
			return ret;
		}
	},
}


console.log("ran RegBase.js");


