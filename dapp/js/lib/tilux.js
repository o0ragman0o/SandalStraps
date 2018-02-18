/*******************************************************************\

Tilux JS 
file:	tilux.js
ver:	0.0.3
author: Darryl Morris
email:  o0ragman0o AT gmail.com
updated:16-Feb-2018
copyright: 2018

Release Notes:
* Added 'sparks' for event handling

TODO:
Test `eval()` exploits

\*******************************************************************/
	
let candleNum = 0;

let sparks = [];

// Proxy handler for nested reactive objects
var luxHandler = {
	has: (target, key) => {
		if (key === "__isLux") return true;
		return key in target;
	},

	get: (target, key) => {
		if (key === '_p') return;
		let ret = target[key];
		if (typeof ret !== 'object') return ret;
		if (!key.startsWith('s_')) ret._p = target;
		if ('__isLux' in ret) return ret;
		return new Proxy(ret, luxHandler);
	},

	set: (target, key, value) => {
		target[key] = value;
		if(key === '_p' || key === 'cbs') return true;
		do {
			// run callbacks
			if("cbs" in target) target.cbs.forEach(
				cb => { if(!!cb) cb(value, key, target); }
			);
			target = target._p;
		} while(!!target);
		return true;
	},
}

// A reactive object class
class Lux {
	constructor(target = {}, cbs = []) {
		if(typeof target !== "object") target = {value: target};
		target.cbs = cbs;
		return new Proxy(target, luxHandler);
	}
}

// The 'candle' template rendering class
class Tilux {
	constructor(candle = {}, cbs = []) {
		this.w = candle.w || '';
		this.f = candle.f || {};
		this.s = candle.s || undefined;
		this.f.id = this.f.id || `tlx_${candleNum++}`;
		cbs.push(()=>{Tilux.render(`#${candle.f.id}`, candle);})
		return new Lux(this, cbs);
	}

	gaze(lux){
		lux.cbs.push(()=>{Tilux.render(`#${this.f.id}`, this)})
	}

	// Renders a template to a collection of HTML elements
	static render(s,c) {
		// render as HTML to DOM
		// sparks = [];
		document.querySelectorAll(s).forEach( e => { e.outerHTML = this.l(c); });
		// Required to run selection again as the DOM doesn't immediately register the outerHTML change 
		document.querySelectorAll(s).forEach( e => {
			sparks.forEach( spark=>{
				for(let k in spark) {
					e.querySelectorAll(k).forEach( chld => {
						for(let ev in spark[k])
							chld.addEventListener(ev, spark[k][ev]);
					});
				}
			});
			// sparks = [];
		});
	}

	// Binary template selector
	static b(o,a,b) { return this.l(o?a:b); }

	// Recursive template rendering
	static t(l,a) {
		return a.map(
			(e)=>{
				return `${!!l[0]?`<${l[0]}>`:``}${!e.map?e:this.t(l.slice(1),e)}${!!l[0]?`</${l[0]}>`:``}`
			}).join('')
	}
	
	// Template literal renderer
	static l(c) {
		// case primitives to candle
		if(typeof c !== 'object') c = {w:c || ''};
		if(c.s) sparks.push(c.s);
		return eval(
			'`'
			+ c.w
			.replace(/@|{\$/g, (f)=>({'@':'c.f.','{$':'${'})[f])
			.replace(/{</g, '${Tilux.b')
			.replace(/{#/g, '${Tilux.t')
			.replace(/{>/g, '${Tilux.l')
			+ '`'
			)
	}
}

console.log("ran tilux.js");
