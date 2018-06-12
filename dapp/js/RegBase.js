// $import('js/apis/RegBaseAPI.js');

const formatRegBaseEvents = (log) => {
	switch (log.event) {
		case 'ChangeResource': return Tilux.l(`
				<h4>Changed Resource</h4>
				Resource: ${utf8(log.args._resource)}<br />
				`);
			break;
		case 'ChangedOwner': return Tilux.l(`
				<h4>Changed Owner</h4>
				<label class="evnt-label">Old Owner</label> {>(ethAddrSml('${log.args._oldOwner}'))}<br />
				<label class="evnt-label">New Owner</label> {>(ethAddrSml('${log.args._newOwner}'))}<br />
			`);
			break;
		case 'ChangeOwnerTo': return Tilux.l(`
				<h4>Change Owner To</h4>
				<label class="evnt-label">Offered To</label> {>(ethAddrSml('${log.args._newOwner}'))}
			`);
			break;
		case 'ReceivedOwnership': return Tilux.l(`
				<h4>Received Ownership Of</h4>
				<label class="evnt-label">Address</label> {>(ethAddrSml('${log.args._kAddr}'))}
			`);
			break;
		default: return formatUnknownEvents(log);
	}
}

const regOwned = (k) => {
	let self = {
		w: `
			<h3>RegBase Owner Functions</h3>
			{>(owned(@k))}
			<div class="ss-panel">
				<input id="change-res-inp" type="text" placeholder="New resource hash" value="{$@res}"/>
				<button id="change-res-btn">Change Resource</button>
			</div>
			<div>
				<button id="destroy-btn">Destroy Contract</button>
			</div>
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
					toTx(self.f.k.changeResource, self.k.res);
					// self.f.k.changeResource.get(newResource);
				},
			},
			"destroy-btn": {
				click: ()=>{
					toTx(self.f.k.destroy);
					// self.f.k.destroy();
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
				<div id="{$@id}" class="rb-button" onclick="{$@click}('{$@kAddr}')">
					<img class="idicon-sml" src="{$blockieSml(@kAddr)}" />
					<div class="inline">
						<div class="rb-regname-sml">{$@regName}</div>
						<div class="rb-version-sml darkest">{$@version}</div>
						<div class="ss-addr-sml">{$shortenAddr(@kAddr)}</div>
					</div>
				</div>
			`,
			f: {
				id: `regBase-${k.address}-min`,
				k: k,
				kAddr: checksumAddr(k.address),
				regName: utf8(k.regName()),
				version: utf8(k.VERSION()),
				click: 'navPath.push',
			},
			s: {

			}
		}
	},

	basic: (k) => {
		if(k) return {
			w: `
				<div id="{$@id}" class="ss-button" onclick="{$@click}('{$@kAddr}')">
					<img class="idicon-sml" src="{$blockieSml(@kAddr)}" />
					<div class="inline">
						<div class="rb-regname-sml">{$@k.regname}</div>
						<div class="rb-version-sml darkest">{$@k.version}</div>
						<div class="ss-addr-sml">{$@kAddr}</div>
					</div>
				</div>
			`,
			f: {
				id: `regBase-${k.address}-bas`,
				k: k,
				kAddr: checksumAddr(k.address),
				regName: utf8(k.regName()),
				version: utf8(k.VERSION()),
				click: 'navPath.push',
			},
		}
	},

	advanced: (k) => {
		if(k) {
			const self = new Tilux({
				w: `<div id="{$@id}" class="layer" >
						<div class="regBase-adv">
							<img class="rb-idicon idicon" src="{$blockie(@kAddr)}" />
							<div class="rb-title"><span class="rb-regname">{$@regName}</span> <span class="rb-version">{$@version}</span> <i id="docsLink" class="far fa-question-circle docs-link"></i></div>
							<div class="rb-addr ss-addr-sml k-addr"><i class="fas fa-fw fa-file-alt"></i> <a href="https://etherscan.io/address/{$@kAddr}" target="_blank">{$@kAddr}</a></div>
							<div class="rb-owner ss-addr-sml u-addr"><i class="fas fa-fw fa-user"></i> <a href="https://etherscan.io/address/{$@owner}" target="_blank">{$@owner}</a></div>
							<div class="rb-bal js-end as-end">{>(ethVal(@ethBal))}</div>
							<div class="rb-ext">
								{>(withdrawable(@k))}
								{>(regOwned(@k), @isOwner)}
								{>(owning(@k), @isOwner)}
								{>(newOwner(@k),  @isNewOwner)}
							</div>
						</div>
					</div>
					`,
				f: {
					id: `regBase-${k.address}-adv`,
					k: k,
					kAddr: checksumAddr(k.address),
					regName: 'regName' in k ? utf8(k.regName()) : 'Contract is not SandalStraps compliant',
					version: 'VERSION' in k ? utf8(k.VERSION()) : 'No version found',
					ethBal: web3.eth.getBalance(k.address),
					s_owning: owning(k),
					s_newOwner: newOwner(k),
					get owner() {return 'owner' in k ? checksumAddr(k.owner()) : 'Contract is not ownable'},
					get isOwner() {return 'owner' in k ? k.owner() === currAccountLux.address : false;},
					get isNewOwner() {return 'newOwner' in k ? k.newOwner() === currAccountLux.address : false;},
					get resource() {return 'resource' in k ? k.resource() : 'Contract has no resource field';},
					get docsPath() { return resources[this.version].docPath }
				},
				s: {
					"#docsLink": {
						click() {
							modal.show(resources[self.f.version].docPath);
						}
					}
				}
			});
			return self;
		}
	},
}

resources["RegBase v0.4.0"] = {
	template: regBase,
	interface: RegBaseContract,
	docPath: "docs/RegBaseAPI.md"
}


console.log("ran RegBase.js");


