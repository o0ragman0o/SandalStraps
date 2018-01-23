
const accountsTplt = new Tilux({
	w:`
		{>(accBalTplt)}
		<select id="accounts" class="ss-input ss-addr" onchange="{@evEthBal}(event)">
			{#(['option'], @accounts)}
		</select>
	`,
	f: {
		id:"accounts",
		accounts: accounts(),
		evEthBal: 'accountsTplt.f.ethBal',

		ethBal: (event)=>{
			let addr = event.target.value;
			if (!addr) return;
			setAccount(addr);
			accBalTplt.f.balance = balance(addr);
		},
	}
})

