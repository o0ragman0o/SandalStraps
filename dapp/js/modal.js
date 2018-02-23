const modal = new Tilux({
		w: `
			<div id="{$@id}" class="modal" style="display:{$@display}">
				<div class="modal-content">
					{>(@candle)}
					<button id="ok-btn">Ok</button>
					<button id="cancel-btn">Cancel</button>
				</div>
			</div>
		`,
		f: {
			id: "modal",
			candle: '',
			display: 'none',
			onOk: ()=>{},
		},
		s: {
			"#ok-btn": {
				click: ()=>{self.f.onOk();},
			},
			"#cancel-btn": {
				click: closeModal,
			},
		},
	});

function openModal(candle, onOkCb) {
	modal.f.candle = candle;
	modal.f.display = 'block';
	modal.f.onOk = onOkCb;
}

function closeModal() {
	modal.f.candle = '';
	modal.f.display = 'none';
}