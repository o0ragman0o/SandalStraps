const socLinks = new Tilux({
	w: `
		<div id={$@id} class="soc">
		<a href="https://github.com/o0ragman0o/SandalStraps" target="_blank"><i class="fab fa-fw fa-github"></i></a>
		<a href="https://twitter.com/o0ragman0o" target="_blank"><i class="fab fa-fw fa-twitter"></i></a>
		</div>
	`,
	f: {
		id: "links-tplt",
	}
})


console.log("ran socLinks.js");
