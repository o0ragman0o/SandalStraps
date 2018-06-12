const navPath = new Tilux({
		w: `
			<div id="{$@id}" class="nav-path js-start">
			{#([''],navPath.getPath())}
			</div>
		`,
		f: {
			id: "nav-path",
			selected: -1,
			pathItems: [],
		}
	});

navPath.getPath = () => {
	return navPath.f.pathItems.length > 0 ? navPath.f.pathItems.map(i => Tilux.l(i)) : [];
}

navPath.select = (i) => {
	navPath.f.pathItems[navPath.f.selected > -1 ? navPath.f.selected : 0].f.active = false;
	navPath.f.selected = i;
	navPath.f.pathItems[i].f.active = true;
	mainTplt.f.kAddr = null; // Clear current template
	mainTplt.f.kAddr = navPath.f.pathItems[i].f.kAddr;
}

navPath.push = (kAddr) => {
	navPath.f.pathItems = navPath.f.pathItems.slice(0, 1 + navPath.f.selected);
	navPath.f.pathItems.push(navPath.newPathItem(kAddr, 1 + navPath.f.selected));
	navPath.select(navPath.f.pathItems.length-1);
}

navPath.newPathItem = (kAddr,i) => {
	return new Tilux({
		w: `
			<div id="{$@id}" class="path-item {>("active", @active)}" onclick="navPath.select(${i})">${getRegName(kAddr)}</div>
		`,
		f: {
			kAddr: kAddr,
			active: false,
		}
	})
}

console.log("ran navPath.js");
