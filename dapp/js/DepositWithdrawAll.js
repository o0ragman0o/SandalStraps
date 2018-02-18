// $import ("js/apis/DepositWithdrawAllAPI.js");

const depositWithdrawAll = {

	minimal: (k) => {
		return {
			w: `{>(regBase.minimal(@k))}
			`,
			f: {
				k: k
			},
		}
	},

	basic: (k) => {
		return {
			w: `<div id="{$@id}>
					{>(regBase.basic(k))}
				</div>`,
			f: {
				k: k
			},
		}
	},

	advanced: (k) => {
		let self = new Tilux({
			w: `<div id="{$@id}>"
					{>(regBase.advanced(@k))}
					<div class="layer">
					<h2>Forwarding to {$@forwardTo}</h2>
					<button onclick="{$@click}">Withdraw All</button>
					</div>
				</div>`,
			f: {
				k: k,
				forwardTo: k.forwardTo(),
			}
		});
		return self;
	}
}

console.log("ran DepositWithdrawAll.js");
