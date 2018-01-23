const navPath = new Tilux({
		w: `
			<div id="{@id}">
			{#([''],navPath.getPath())}
			</div>
		`,
		f: {
			id: "path-tplt",
			selected: -1,
			pathItems: [],
		}
	});

navPath.push = function(kAddr) {
	navPath.f.pathItems = navPath.f.pathItems.slice(0, 1 + navPath.f.selected).concat([pathItem(kAddr, 1+navPath.f.selected)]);
	navPath.select(navPath.f.pathItems.length-1);
}

navPath.select = function(i) {
	// navPath.f.pathItems[navPath.f.selected].f.active = false;
	// navPath.f.pathItems[i].f.active = true;
	navPath.f.selected = i;
	mainTplt.f.kAddr = navPath.f.pathItems[i].f.kAddr;
}

navPath.getPath = function() {
	return navPath.f.pathItems.length > 0 ? navPath.f.pathItems.map(i=>Tilux.l(i)) : [];
}

function pathItem(kAddr,i) {
	return new Tilux({
		w: `
			<div class="path-item {<(@active,{w:"active"},nullTplt)}" onclick="navPath.select(${i})">${getRegName(kAddr)}</div>
		`,
		f: {
			kAddr: kAddr,
			active: false,
		}
	})
}