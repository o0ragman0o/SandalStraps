const navTree = new Tilux({
		w: `
			<div id="{$@id}" class="nav-tree">
			<ul>
				{#(['li'],navTree.getTree())}
			</ul>
			</div>
		`,
		f: {
			id: "tree-tplt",
			selected: -1,
			treeItems: ['root',['branch1','branch2',['leaf1','leaf2']]],
		}
	});

// navTree.push = (kAddr) => {
// 	navTree.f.TreeItems = navTree.f.TreeItems.slice(0, 1 + navTree.f.selected);
// 	navTree.f.TreeItems.push(navTree.newTreeItem(kAddr, 1 + navTree.f.selected));
// 	navTree.select(navTree.f.TreeItems.length-1);
// }

// navTree.select = (i) => {
// 	navTree.f.TreeItems[navTree.f.selected > -1 ? navTree.f.selected : 0].f.active = false;
// 	navTree.f.selected = i;
// 	navTree.f.TreeItems[i].f.active = true;
// 	mainTplt.f.kAddr = null; // Clear current template
// 	mainTplt.f.kAddr = navTree.f.TreeItems[i].f.kAddr;
// }

navTree.getTree = () => {
	// return navTree.f.treeItems.length > 0 ? navTree.f.treeItems.map(i => Tilux.l(i)) : [];
	// return ["Nav Tree","k1","k2",["k3","k4",["k5"]];
	return navTree.f.treeItems.map(i => { console.log(i); return i instanceof Array ? Tilux.l(`<ul>{#(['li'],${[i]})}</ul>`) : i });
}

navTree.newTreeItem = (kAddr,i) => {
	return new Tilux({
		w: `
			<li id="{$@id}" class="tree-item {>("active", @active)}" onclick="navTree.select(${i})">${getRegName(kAddr)}
				<ul>{#([''], @children)}</ul>
			</li>
		`,
		f: {
			kAddr: kAddr,
			active: false,
			children: ''
		}
	})
}

console.log("ran navTree.js");
