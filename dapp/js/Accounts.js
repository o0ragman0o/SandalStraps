const currAccountLux = new Lux({address:web3.eth.accounts[0], balance:new web3.BigNumber(0)});

const accountBalTplt = new Tilux({

	w:`
		<span id="{$@id}" class="balance">
		{>(ethVal(balance(currAccountLux.address)))}
		</span>
	`,
	f: {
		id: 'accBal',
	}
})

accountBalTplt.gaze(currAccountLux);

const accountsTplt = new Tilux({
	w:`
		<div id="{$@id}" class="js-end">
			<span id="search">
				<i class="fas fa-search"></i>
			</span>
			<span id="send-tx">
				<i class="fa fa-paper-plane" aria-hidden="true"></i>
			</span>
			<span>
			{>(accountBalTplt)}
			</span>
			<select id="acc-sel" class="ss-input ss-addr" onchange="currAccountLux.address = this.value">
				{#(['option'], @accounts)}
			</select>
		</div>
	`,
	f: {
		id:"accounts",
		accounts: accounts(),
	},
	s: {
		"#send-tx": {
			click() { modal.show(txForm()) }
		},
		"#search": {
			click() { modal.show(searchForm()) }
		},
	}
})

console.log("ran Accounts.js");

