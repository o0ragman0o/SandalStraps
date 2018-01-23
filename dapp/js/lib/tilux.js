// TODO
// work out event function handling
// Implement revokation
var candleNum = 0;

const nullTplt={w:'',f:{}}

// Proxy handler for nested reactive objects
var handler = {
	get: (target ,key) => {
		if (typeof target[key] !== 'object') return target[key];
		target[key]._p = target;
		return new Proxy(target[key], handler);
	},
	set: (target, key, value) => {
		target[key] = value;
		if(key === '_p' || key === 'cbs') return true;
		do {
			if("cbs" in target) target.cbs.forEach(
				cb => { if(!!cb) cb(value, key, target); }
			);
			target = target._p;
		} while(!!target);
		return true;
	}
}

// A reactive object class
class Lux {
	constructor(target = {}, cbs = []) {
		if(typeof target !== "object") target = {value: target};
		target.cbs = cbs;
		return new Proxy(target, handler);
	}
}

// The 'candle' template rendering class
class Tilux {
	constructor(candle = {w:``, f:{}}, cbs = []) {
		if(candle.f.id === undefined) candle.f.id = `tlx_${candleNum++}`;
		cbs.push(()=>{Tilux.render(`#${candle.f.id}`, candle);})
		return new Lux(candle, cbs);
	}

	// Renders a template to a collection of HTML elements
	static render(s,c) {
		document.querySelectorAll(s).forEach(
			(e)=>{ e.innerHTML= this.l(c); }
		)
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