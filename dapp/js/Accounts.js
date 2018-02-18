var currAccountLux = new Lux({address:web3.eth.accounts[0], balance:new web3.BigNumber(0)});
// var currBalanceLux = new Lux(0);

const accountBalTplt = new Tilux({

	w:`
		<span id="{$@id}" class="balance">
		<i class="fab fa-fw fa-ethereum"></i>{$balance(currAccountLux.address)}
		</span>
	`,
	f: {
		id: 'accBal',
	}
})

accountBalTplt.gaze(currAccountLux);

const accountsTplt = new Tilux({
	w:`<div id="{$@id}" class="accounts">
		<span>
		{>(accountBalTplt)}
		</span>
		<select id="acc-sel" class="ss-input ss-addr" onchange="currAccountLux.address = this.value;">
			{#(['option'], @accounts)}
		</select>
	</div>
	`,
	f: {
		id:"accounts",
		accounts: accounts(),
		changed: (addr)=>{
			currAccountLux.address = addr;
		},
	}
})

console.log("ran Accounts.js");

