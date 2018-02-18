// $import('js/apis/WithdrawableAPI.js');

const withdrawAll = (k) => {
	if (!!k) return {
		w: `<button onclick="{$@withdrawAll}">Withdraw All</button>`,
		f: {
			withdrawAll: () => k.withdrawAll(),
		}
	}
}

const withdrawAllFor = (k) => {
	if (!!k) return {
		w: `<input type="text" placeholder="address to withdraw to" onkeypress="withdrawForAddr = this.value" />
			<button onclick="{$@withdrawAllFor}({$@withdrawForAddr})">Withdraw All For</button>`,
		f: {
			_wfa: '',
			get withdrawForAddr() { return this._wfa},
			set withdrawForAddr(addr) { this._wfa = addr},
			withdrawAllFor: (addr) => k.withdrawAllFor(addr),
		}
	}
}

const withdrawable = (k) => {
	if (!!k ) return {
		w: `
			<div id='{$@id}'>
				{$@balance}
				{<(@isWithdraw, withdrawAll(@k), '')}
				{<(@isWithdrawFor, withdrawAllFor(@k),'')}
			</div>
		`,
		f: {
			id: `withdrawable-${k.address}`,
			k: k,
			balance: `<i class="fab fa-fw fa-ethereum"></i>${balance(k.address)}`,
			ethBalanceOf: ()=>{ if('ethBalanceOf' in k) return ether(k.ethBalanceOf(k.address));},

			withdrawForAddr: '',
			isWithdraw: 'withdrawAll' in k,
			isWithdrawFor: 'withdrawAllFor' in k,
		}
	}
}


console.log("ran Withdrawable.js");
