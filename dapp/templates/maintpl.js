var maintpl = new Tilux({
	w: `
		{>(@k(@kAddr))}
	`,
	f: {
		id: main-tplt,
		kAddr: alphaStrapsAddr,
		k: ()=>{return getContract(kAddr).advanced}
	}
})