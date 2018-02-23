// $import ("js/apis/Erc20API.js");

const erc20Form = (k) => {
	let self = {
		w: `
		<div>
			<h2>{$@name} {$@symbol}</h2>
			<h2><i class="fas fa-fw fa-dot-circle"></i> {$@tokBal}</h2>
			<h3>Total Supply</h3>
			<i class="fas fa-fw fa-dot-circle"></i> {$@k.totalSupply()}
			<h3>Transfer</h3>
			<input id="to-inp" placeholder="Recipient address"></input>
			<input id="to-amount" type="number" placeholder="Amount"></input>
			<button id="transfer-btn">Transfer</button>
			<h3>Transfer From</h3>
			<p>{$@allowance(@from)}</p>
			<input id="from-inp" placeholder="From address" value="{@from}"></input>
			<input id="to-inp" placeholder="Recipient address"></input>
			<input id="to-amount" type="number" placeholder="Amount"></input>
			<button id="transfer-btn">Transfer</button>
		</div>
		`,
		f: {
			k: k,
			name: utf8(k.name()),
			symbol: utf8(k.symbol()),
			supply: toDecimal(k.totalSupply(),k.decimals()),
			decimals: k.decimals().toNumber(),
			tokBal: k.balanceOf(currAccountLux.address).div(10**k.decimals().toNumber()),
			from: '',
			allowance: (frm)=>{toDecimal(k.allowance(frm, currAccountLux.address),self.decimals)},
		},
		s: {
			'#from-inp': event => self.f.from = event.target.value,
		}
	};

	return self;
}

const erc20 = {

	minimal: (k) => {
		return {
			w: `{>(regBase.minimal(@k))}
			`,
			f: {
				k: k,
			},			
		}
	},

	basic: (k) => {
		return {
			w: `{>(regBase.basic(@k))}
			`,
			f: {
				k: k,
			},			
		}
	},

	advanced: (k) => {
		let self = new Tilux({
			w: `<div id="{$@id}>"
					{>(regBase.advanced(@k))}
					<h2><i class="fab fa-fw fa-ethereum"></i>{$@ethBal}</h2>
					{>(erc20Form(@k))}
				</div>`,
			f: {
				k: k,
				ethBal: toEther(k.etherBalance(currentAccountLux.address)),
			}
		});
		return self;
	}
}

console.log("ran PayableERC20.js");
