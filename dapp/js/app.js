var app = (tplt) => {
	return {
		w: `{>(@tplt)}`,
		f: {
			tplt: tplt,
		},
	}
}