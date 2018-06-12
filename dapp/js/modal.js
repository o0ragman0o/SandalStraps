const modal = new Tilux({
	w: `
		<div id="{$@id}" class="modal" style="display:{$@display}">
			<div class="modal-inner">
				{>(@candle)}
				<div>
					<button id="ok-btn" class="js-end">Ok</button>
					<button id="cancel-btn" class="js-end">Cancel</button>
				</div>
			</div>
		</div>
	`,
	f: {
		id: "ss-modal",
		candle: '',
		display: 'none',
		onOk: '',
	},
	s: {
		"#ok-btn": {
			click: ()=>{modal.f.onOk(modal.f.candle);},
		},
		"#cancel-btn": {
			click: ()=>{modal.hide();},
		},
	},
});

modal.show = (candle, onOkCb) => {
	modal.f.candle = candle;
	modal.f.display = 'block';
	modal.f.onOk = onOkCb || candle.f.okCb || modal.hide;
}

modal.hide = () => {
	modal.f.candle = '';
	modal.f.display = 'none';
}