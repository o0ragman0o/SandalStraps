

function $import(file, async = false) {
    // DOM: Create the script element
    let jsElm = document.createElement("script");
    jsElm.type = "application/javascript";
    jsElm.src = file;
    jsElm.async = async;
	jsElm.onload = ()=>(console.log("loaded element", jsElm));
    document.head.appendChild(jsElm);
	console.log("created", file);
}

function $loadFile(file) {
	let reader = new FileReader();
}

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

console.log("ran Domtools.js");
