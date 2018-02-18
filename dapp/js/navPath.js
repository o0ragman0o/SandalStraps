const navPath = new Tilux({
		w: `
			<div id="{$@id}" class="navpath">
			{#([''],navPath.getPath())}
			</div>
		`,
		f: {
			id: "path-tplt",
			selected: -1,
			pathItems: [],
		}
	});

navPath.push = (kAddr) => {
	navPath.f.pathItems = navPath.f.pathItems.slice(0, 1 + navPath.f.selected);
	navPath.f.pathItems.push(navPath.newPathItem(kAddr, 1 + navPath.f.selected));
	navPath.select(navPath.f.pathItems.length-1);
}

navPath.select = (i) => {
	navPath.f.pathItems[navPath.f.selected > -1 ? navPath.f.selected : 0].f.active = false;
	navPath.f.selected = i;
	navPath.f.pathItems[navPath.f.selected].f.active = true;
	mainTplt.f.kAddr = navPath.f.pathItems[i].f.kAddr;
}

navPath.getPath = () => {
	return navPath.f.pathItems.length > 0 ? navPath.f.pathItems.map(i => Tilux.l(i)) : [];
}

navPath.newPathItem = (kAddr,i) => {
	return new Tilux({
		w: `
			<div class="path-item {<(@active,{w:"active",f:{}},'')}" onclick="navPath.select(${i})">${getRegName(kAddr)}</div>
		`,
		f: {
			kAddr: kAddr,
			active: false,
		}
	})
}

console.log("ran navPath.js");
