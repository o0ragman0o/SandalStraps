
function start() {
	// TODO push interface names to contract resource 

	Tilux.render("#ss-style", ss_style);
	Tilux.render("#accounts", accountsTplt);
	Tilux.render("#nav-tree", navTree);
	Tilux.render("#nav-path", navPath);
	Tilux.render("#footer-tplt", footer);
	// Tilux.render("#modal", modal);

	navPath.push(alphaStrapsAddr);
}



var mainTplt = new Tilux({
	w: `<div id="{$@id}"  class="contract">
		{>(@template(@kAddr))}
		</div>
	`,
	f: {
		id: "contract-tplt",
		kAddr: "",
		template: (kAddr)=>{
			return !kCandles[kAddr] ? `<p>SandalStraps contract not found.</p>` : kCandles[kAddr].advanced;
		},
	}
})


console.log("ran main.js");