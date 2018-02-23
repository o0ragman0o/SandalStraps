// $import('js/apis/OwningAPI.js');

const owning = (k) => {
	let self = new Tilux({
		w:`
			<h3>Change Owner Of</h3>
			<input id="newOwnedAddr-inp" value="{$@newOwnerAddr}"></input>
			<button id="offerOwnership-btn">Offer Ownership</button>
			<h3>Receive Ownership Of</h3>
			<input id="receiveKaddr-inp" value="{$@receiveKAddr}"></input>
			<button id="acceptOwnership-btn">Accept Ownership</button>

		`,
		f: {
			k: k,
			newOwnerAddr: null,
			receiveKAddr: null,
		},
		s: {

		}
	})

}