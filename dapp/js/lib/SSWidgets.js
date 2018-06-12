
const ethAddrSml = (addr) => {
	let link;
	return !contracts[addr] ?
		`<img class="idicon-sml" src="{$blockieTny('${addr}')}" /> <a class="ss-addr" href="http://etherscan.io/address/${addr}" target="_">${addr}</a>` :
		`<img class="idicon-sml" src="{$blockieTny('${addr}')}" /> <span class="ss-addr" onclick="navPath.push('${addr}')">${addr}</span>`
}

const txHash = (hash) => {
	return `<a class="mono" href="javascript:modal.show(txHashForm('${hash}'))" target="_">${hash}</a>`;
	// return `<a class="mono" href="http://etherscan.io/tx/${hash}" target="_">${hash}</a>`;
}

const blockLink = (blkNum) => {
	return `<a class="mono" href="http://etherscan.io/block/${blkNum}" target="_">${blkNum}</a>`;
}

const ethVal = (val) => {
	return `<i class="fab fa-fw fa-ethereum"></i> <span class="ss-val">${toEther(val)}</span>`;
}

const ethAddrInp = (addr, placeHolder) => {
	const self = new Tilux({
		w: `<img class="idicon-sml" src="{$blockieSml('{$@addr}')}" /><input id="ethAddr" class="ss-input ss-addr" placeholder="${placeHolder}" value="{$@addr}"></input>`,
		f: {
			addr: addr,
		},
		s: {
			'#ethAddr': {
				change: (event)=>{
					self.f.addr = event.target.value;
				}
			}
		}
	});

	return self;
}
const ethValInp = (value, placeHolder) => {
	const self = new Tilux({
		w: `<input id="ethVal" class="ss-input" placeholder="${placeHolder}" value="{$@value}"></input>`,
		f: {
			value: value,
		},
		s: {
			'#ethVal': {
				change: (event)=>{
					self.f.value = event.target.value;
				}
			}
		}
	});

	return self;
}