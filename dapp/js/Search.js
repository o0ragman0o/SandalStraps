const searchForm = (searchFor) => {
	const self = new Tilux({
		w: `
			<div id='{$@id}'>
				<h1><i class="fas fa-search"></i>Search</h1>
				<p>Search by block number, address or TX hash</p>
				<input id="search-inp" class="mono" value="{$@value}"></input>
				<div id="result">
					{$@result}
				</div>
			</div>
		`,
		f: {
			value: searchFor,
			result: '',
		},
		s: {
			'#search-inp': {
				keyup: (event)=>{
					search = event.target.value;
					if(web3.eth.getBlock(search)) self.f.result = blockForm(search);
					else if(web3.eth.getTransaction(search)) self.f.result = txHashForm(search);
					else if(isAddr(search)) self.f.result = accountForm(search);
					else self.f.result = `Found nothing for:<span class="mono">${res}</span>`;
					self.f.searchFor = search;
				},
			},
		},
	});

	return self;
}

