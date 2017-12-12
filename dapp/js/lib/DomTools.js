// (function () {
	function $(selector, parent = document) {
		return Array.prototype.slice.call(parent.querySelectorAll(selector),0);
	}

	function $$(selector, parent) {
		return $(selector)[0];
	}

	function $id(domId, parent = document) {
		return parent.getElementById(domId);
	}

	function $tag(tag, ns) {
		let e;
		if (ns) {
			e = document.createElementNS(ns, tag);
		} else {
			e = document.createElement(tag);
		}
		return e;
	}

	function $replace(a, b) {
		a.replaceWith(b);
	}

	function $t(eId, tplt) {
		e = $id(eId)
		if(e !== 'null') e.innerHTML = tplt;	
	}

	function $teval(t) {
		return eval('`' + t.replace(/{{/g,'${').replace(/}}/,'}') + '`');
	}

	function $list(tag, arr) {
		return arr.map((e)=> `<${tag}>${e}</${tag}>`).join('');
	}

	function $with(obj, tplt) {

	}

// 	var api = {
// 		$: $,
// 		$$: $$,
// 		id: $id,
// 		tag: $tag,
// 		tt: $t,
// 		list: $list
// 	}
// 	if (typeof module !== "undefined") {
// 		module.exports = api;
// 	}
// 	if (typeof window !== "undefined") {
// 		 window.blockies = api;
// 	}
// })()