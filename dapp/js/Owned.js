// $import('js/apis/OwnedAPI.js');

const owned = (k) => {

	let self = new Tilux({
		w: `
			<div id="{$@id}" class="ss-panel">
				<input id="new-owner-inp" type="text" placeholder="New owner address" value="{$@newOwner}"/>
				{>(dapp_addressInput())}
				<button id="change-owner-btn">Change Owner</button><br>
			</div>
		`,
		f: {
			id: `owned-${k.address}`,
			k: k,
			ownsOwner: () => { return contracts[k.owner()].owner() === currendAccountLux.address; },
			newOwner: '',
			res: web3.toHex(k.resource()),
		},
		s: {
			'#new-owner-inp': {
				change: (event) => { self.f.newOwner = event.target.value; },
			},
			'#change-owner-btn': {
				click: () => { toTx(self.f.k, 'changeOwner', self.f.newOwner); },
				// click: () => { regBase.changeOwner(k.address, self.f.newOwner); },
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
