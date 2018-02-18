function $import(file, _async) {
    // DOM: Create the script element
    // setTimeout(()=>{
	    let jsElm = document.createElement("script");
	    jsElm.type = "application/javascript";
	    jsElm.src = file;
	    // jsElm.defer = !!_async;
	    document.head.appendChild(jsElm),0;
	    jsElm.onload = ()=>(console.log("loaded element", jsElm, !!_async?"async":""));
	    console.log("created", file);
    // },0);
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
