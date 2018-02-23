// $import ("js/apis/PayableERC20API.js");

const payableErc20 = {

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
		var self = new Tilux({
			w: `<div id="{$@id}>"
					{>(regBase.advanced(@k))}
					<div class="layer">
						<h2><i class="fab fa-fw fa-ethereum"></i> {$@ethBal}</h2>
						{>(erc20Form(@k))}
					</div>
				</div>`,
			f: {
				k: k,
				supply: k.totalSupply().toNumber(),
				ethBal: toEther(k.etherBalanceOf(currAccountLux.address)),
				tokBal: k.balanceOf(currAccountLux.address).div(10**k.decimals().toNumber()),
			}
		});
		return self;
	}
}

console.log("ran PayableERC20.js");
