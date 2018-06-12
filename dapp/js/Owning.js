// $import('js/apis/OwningAPI.js');

const owning = (k) => {
	let self = new Tilux({
		w:`
			<div class="ss-panel">
				<input id="newOwnedAddr-inp" value="{$@newOwnerAddr}"></input>
				<button id="offerOwnership-btn">Offer Ownership To...</button>
			</div>
			<div class="ss-panel">			
				<input id="receiveKaddr-inp" value="{$@receiveKAddr}"></input>
				<button id="acceptOwnership-btn">Receive Ownership Of...</button>
			</div>
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