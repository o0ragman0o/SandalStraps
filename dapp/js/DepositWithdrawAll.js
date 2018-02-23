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
					<h3>Forwarding to</h3>
					<img class="rb-idicon-sml idicon-sml" src="{$blockieSml(@forwardTo)}" />
					<a class="mono" href="https://etherscan.io/address/{$@forwardTo}" target="_blank">{$@forwardTo}</a>
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
