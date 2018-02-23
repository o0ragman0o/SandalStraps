// $import('js/apis/DisownableAPI.js');

const disownable = (k) => {
	self = new Tilux({
		w: `
			<h3>Disown (burn) ownership</h3>
			Enter the burn phrase: "This contract is to be disowned."
			<input id="disown-inp" value="{$@phrase}"></input>
			<button id="disown-btn">Disown</button>
		`,
		f: {
			k: k,
			phrase: '',
		},
		s: {
			"#disown-inp" : {
				change: (event) => { self.f.phrase = event.target.value; },
			},
			"#disown-btn": {
				click: () => { k.disown(self.f.phrase, )},
			}
		}
	})

	return self;
}