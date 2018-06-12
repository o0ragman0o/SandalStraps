/*******************************************************************\

Tilux JS 
file:	tilux.js
ver:	0.0.5
author: Darryl Morris
email:  o0ragman0o AT gmail.com
updated:20-May-2018
copyright: 2018

Release Notes:
* Rolled parser into one replace function
* Using 'Function' constructor instead of 'eval'
* incorporate template branch selector {< into literal renderer {>

TODO:

\*******************************************************************/
	
let candleNum = 0;

let sparks = [];

const t_rplc = {'@':'c.f.','{$':'${','{#':'${Tilux.t','{>':'${Tilux.l'};

// Proxy handler for nested reactive objects
const luxHandler = {
	has: (target, key) => {
		if (key === "__isLux") return true;
		return key in target;
	},

	get: (target, key) => {
		if (key === '_p') return;
		let ret = target[key];
		if (typeof ret !== 'object' || ret === null) return ret;
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
		this.f.id = candle.f.id || `tlx_${candleNum++}`;
		cbs.push(()=>{Tilux.render(`#${this.f.id}`, this);})
		// cbs.push(()=>{Tilux.render(`#${candle.f.id}`, candle);})
		return new Lux(this, cbs);
	}

	gaze(lux){
		lux.cbs.push(()=>{Tilux.render(`#${this.f.id}`, this)})
		// console.log(`Gaze`, this, `at`, lux);
	}

	// Renders a template to a collection of HTML elements
	static render(s,c) {
		// render as HTML to DOM
		document.querySelectorAll(s).forEach( e => {
			sparks.push([]);
			e.outerHTML = this.l(c);
			// console.log(e);
		});
		// Required to run selection again as the DOM doesn't immediately register the outerHTML change 
		document.querySelectorAll(s).forEach( e => {
			sparks.pop().forEach( spark => {
				for(let k in spark) {
					e.querySelectorAll(k).forEach( chld => {
						for(let ev in spark[k])
							chld.addEventListener(ev, spark[k][ev]);
					});
				}
			});
		});
	}

	// Recursive template rendering
	static t(l,a) {
		return a.map(
			(e)=>{
				return `${!!l[0]?`<${l[0]}>`:``}${!e.map?e:this.t(l.slice(1),e)}${!!l[0]?`</${l[0]}>`:``}`
			}).join('')
	}
	
	// Template literal renderer
	static l(c, d=true, e='') {
		// cast primitives to candle
		c = d ? c : e;
		if(typeof c !== 'object') c = {w:c || ''};
		if(c.s) sparks[sparks.length - 1].push(c.s);
		return Function('c', `"use strict"; return \`${c.w.replace(/@|{\$|{#|{>/g, f=>t_rplc[f])}\`;`)(c)
	}
}
