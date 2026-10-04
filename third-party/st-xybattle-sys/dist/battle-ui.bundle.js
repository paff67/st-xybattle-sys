//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function e(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var t = process.env.NODE_ENV === "production" ? {} : Object.freeze({}), n = process.env.NODE_ENV === "production" ? [] : Object.freeze([]), r = () => {}, i = () => !1, a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), o = (e) => e.startsWith("onUpdate:"), s = Object.assign, c = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, T = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ee = /* @__PURE__ */ e("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"), te = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ne = /-\w/g, E = te((e) => e.replace(ne, (e) => e.slice(1).toUpperCase())), re = /\B([A-Z])/g, D = te((e) => e.replace(re, "-$1").toLowerCase()), ie = te((e) => e.charAt(0).toUpperCase() + e.slice(1)), ae = te((e) => e ? `on${ie(e)}` : ""), oe = (e, t) => !Object.is(e, t), se = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, ce = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, O = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, le = (e) => {
	let t = g(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, ue, de = () => ue ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function fe(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? ge(r) : fe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
}
var pe = /;(?![^(]*\))/g, me = /:([^]+)/, he = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function ge(e) {
	let t = {};
	return e.replace(he, (e) => e.startsWith("/*") ? "" : e).split(pe).forEach((e) => {
		if (e) {
			let n = e.split(me);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function k(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = k(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var _e = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot", ve = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", ye = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics", be = /* @__PURE__ */ e(_e), xe = /* @__PURE__ */ e(ve), Se = /* @__PURE__ */ e(ye), Ce = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", we = /* @__PURE__ */ e(Ce);
Ce + "";
function Te(e) {
	return !!e || e === "";
}
function Ee(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Ae(e[i], t[i], n);
	return r;
}
function De(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Ae(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Oe(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? De(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Ae(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function ke(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Ae(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? ke(e, t, n, Ee) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : ke(e, t, n, Oe) : String(e) === String(t))));
}
function je(e, t) {
	return e.findIndex((e) => Ae(e, t));
}
var Me = (e) => !!(e && e.__v_isRef === !0), A = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? Me(e) ? A(e.value) : JSON.stringify(e, Ne, 2) : String(e), Ne = (e, t) => Me(t) ? Ne(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Pe(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Pe(e)) } : _(t) ? Pe(t) : v(t) && !d(t) && !C(t) ? String(t) : t, Pe = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e;
//#endregion
//#region node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
function Fe(e, ...t) {
	console.warn(`[Vue warn] ${e}`, ...t);
}
var j, Ie = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && j && (j.active ? (this.parent = j, this.index = (j.scopes || (j.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].pause();
			}
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].resume();
			}
			let n = this.effects.slice();
			for (e = 0, t = n.length; e < t; e++) n[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = j;
			try {
				return j = this, e();
			} finally {
				j = t;
			}
		} else process.env.NODE_ENV !== "production" && this._warnOnRun && Fe("cannot run an inactive effect scope.");
	}
	on() {
		++this._on === 1 && (this.prevScope = j, j = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (j === this) j = this.prevScope;
			else {
				let e = j;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				let e = this.scopes.slice();
				for (t = 0, n = e.length; t < n; t++) e[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function Le() {
	return j;
}
var M, Re = /* @__PURE__ */ new WeakSet(), ze = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, j && (j.active ? j.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Re.has(this) && (Re.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ue(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, nt(this), Ke(this);
		let e = M, t = Qe;
		M = this, Qe = !0;
		try {
			return this.fn();
		} finally {
			process.env.NODE_ENV !== "production" && M !== this && Fe("Active effect was not restored correctly - this is likely a Vue internal bug."), qe(this), M = e, Qe = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Xe(e);
			this.deps = this.depsTail = void 0, nt(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Re.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Je(this) && this.run();
	}
	get dirty() {
		return Je(this);
	}
}, Be = 0, Ve, He;
function Ue(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = He, He = e;
		return;
	}
	e.next = Ve, Ve = e;
}
function We() {
	Be++;
}
function Ge() {
	if (--Be > 0) return;
	if (He) {
		let e = He;
		for (He = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Ve;) {
		let t = Ve;
		for (Ve = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function Ke(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function qe(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Xe(r), Ze(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Je(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ye(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ye(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === rt) || (e.globalVersion = rt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Je(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = M, r = Qe;
	M = e, Qe = !0;
	try {
		Ke(e);
		let n = e.fn(e._value);
		(t.version === 0 || oe(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		M = n, Qe = r, qe(e), e.flags &= -3;
	}
}
function Xe(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), process.env.NODE_ENV !== "production" && n.subsHead === e && (n.subsHead = i), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Xe(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ze(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Qe = !0, $e = [];
function et() {
	$e.push(Qe), Qe = !1;
}
function tt() {
	let e = $e.pop();
	Qe = e === void 0 || e;
}
function nt(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = M;
		M = void 0;
		try {
			t();
		} finally {
			M = e;
		}
	}
}
var rt = 0, it = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, at = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
	}
	track(e) {
		if (!M || !Qe || M === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== M) t = this.activeLink = new it(M, this), M.deps ? (t.prevDep = M.depsTail, M.depsTail.nextDep = t, M.depsTail = t) : M.deps = M.depsTail = t, ot(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = M.depsTail, t.nextDep = void 0, M.depsTail.nextDep = t, M.depsTail = t, M.deps === t && (M.deps = e);
		}
		return process.env.NODE_ENV !== "production" && M.onTrack && M.onTrack(s({ effect: M }, e)), t;
	}
	trigger(e) {
		this.version++, rt++, this.notify(e);
	}
	notify(e) {
		We();
		try {
			if (process.env.NODE_ENV !== "production") for (let t = this.subsHead; t; t = t.nextSub) t.sub.onTrigger && !(t.sub.flags & 8) && t.sub.onTrigger(s({ effect: t.sub }, e));
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Ge();
		}
	}
};
function ot(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) ot(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), process.env.NODE_ENV !== "production" && e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
	}
}
var st = /* @__PURE__ */ new WeakMap(), ct = /* @__PURE__ */ Symbol(process.env.NODE_ENV === "production" ? "" : "Object iterate"), lt = /* @__PURE__ */ Symbol(process.env.NODE_ENV === "production" ? "" : "Map keys iterate"), ut = /* @__PURE__ */ Symbol(process.env.NODE_ENV === "production" ? "" : "Array iterate");
function N(e, t, n) {
	if (Qe && M) {
		let r = st.get(e);
		r || st.set(e, r = /* @__PURE__ */ new Map());
		let i = r.get(n);
		i || (r.set(n, i = new at()), i.map = r, i.key = n), process.env.NODE_ENV === "production" ? i.track() : i.track({
			target: e,
			type: t,
			key: n
		});
	}
}
function dt(e, t, n, r, i, a) {
	let o = st.get(e);
	if (!o) {
		rt++;
		return;
	}
	let s = (o) => {
		o && (process.env.NODE_ENV === "production" ? o.trigger() : o.trigger({
			target: e,
			type: t,
			key: n,
			newValue: r,
			oldValue: i,
			oldTarget: a
		}));
	};
	if (We(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === ut || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(ut)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(ct)), f(e) && s(o.get(lt)));
				break;
			case "delete":
				i || (s(o.get(ct)), f(e) && s(o.get(lt)));
				break;
			case "set": f(e) && s(o.get(ct));
		}
	}
	Ge();
}
function ft(e) {
	let t = /* @__PURE__ */ F(e);
	return t === e || (N(t, "iterate", ut), /* @__PURE__ */ P(e)) ? t : /* @__PURE__ */ en(e) ? /* @__PURE__ */ $t(e) ? t.map((e) => an(rn(e))) : t.map(an) : t.map(rn);
}
function pt(e) {
	return N(e = /* @__PURE__ */ F(e), "iterate", ut), e;
}
function mt(e, t) {
	return /* @__PURE__ */ en(e) ? an(/* @__PURE__ */ $t(e) ? rn(t) : t) : rn(t);
}
var ht = {
	__proto__: null,
	[Symbol.iterator]() {
		return gt(this, Symbol.iterator, (e) => mt(this, e));
	},
	concat(...e) {
		return ft(this).concat(...e.map((e) => d(e) ? ft(e) : e));
	},
	entries() {
		return gt(this, "entries", (e) => (e[1] = mt(this, e[1]), e));
	},
	every(e, t) {
		return vt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return vt(this, "filter", e, t, (e) => e.map((e) => mt(this, e)), arguments);
	},
	find(e, t) {
		return vt(this, "find", e, t, (e) => mt(this, e), arguments);
	},
	findIndex(e, t) {
		return vt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return vt(this, "findLast", e, t, (e) => mt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return vt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return vt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return bt(this, "includes", e);
	},
	indexOf(...e) {
		return bt(this, "indexOf", e);
	},
	join(e) {
		return ft(this).join(e);
	},
	lastIndexOf(...e) {
		return bt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return vt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return xt(this, "pop");
	},
	push(...e) {
		return xt(this, "push", e);
	},
	reduce(e, ...t) {
		return yt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return yt(this, "reduceRight", e, t);
	},
	shift() {
		return xt(this, "shift");
	},
	some(e, t) {
		return vt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return xt(this, "splice", e);
	},
	toReversed() {
		return ft(this).toReversed();
	},
	toSorted(e) {
		return ft(this).toSorted(e);
	},
	toSpliced(...e) {
		return ft(this).toSpliced(...e);
	},
	unshift(...e) {
		return xt(this, "unshift", e);
	},
	values() {
		return gt(this, "values", (e) => mt(this, e));
	}
};
function gt(e, t, n) {
	let r = pt(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ P(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var _t = Array.prototype;
function vt(e, t, n, r, i, a) {
	let o = pt(e), s = o !== e && !/* @__PURE__ */ P(e), c = o[t];
	if (c !== _t[t]) {
		let t = c.apply(e, a);
		return s ? rn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, mt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function yt(e, t, n, r) {
	let i = pt(e), a = i !== e && !/* @__PURE__ */ P(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = mt(e, t)), n.call(this, t, mt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? mt(e, c) : c;
}
function bt(e, t, n) {
	let r = /* @__PURE__ */ F(e);
	N(r, "iterate", ut);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ tn(n[0]) ? (n[0] = /* @__PURE__ */ F(n[0]), r[t](...n)) : i;
}
function xt(e, t, n = []) {
	et(), We();
	let r = (/* @__PURE__ */ F(e))[t].apply(e, n);
	return Ge(), tt(), r;
}
var St = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), Ct = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function wt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ F(this);
	return N(t, "has", e), t.hasOwnProperty(e);
}
var Tt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Kt : Gt : i ? Wt : Ut).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = ht[t])) return e;
			if (t === "hasOwnProperty") return wt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ I(e) ? e : n);
		if ((_(t) ? Ct.has(t) : St(t)) || (r || N(e, "get", t), i)) return o;
		if (/* @__PURE__ */ I(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Xt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Xt(o) : /* @__PURE__ */ Jt(o) : o;
	}
}, Et = class extends Tt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let r = /* @__PURE__ */ en(i);
			if (!/* @__PURE__ */ P(n) && !/* @__PURE__ */ en(n) && (i = /* @__PURE__ */ F(i), n = /* @__PURE__ */ F(n)), !a && /* @__PURE__ */ I(i) && !/* @__PURE__ */ I(n)) return r ? (process.env.NODE_ENV !== "production" && Fe(`Set operation on key "${String(t)}" failed: target is readonly.`, e[t]), !0) : (i.value = n, !0);
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ I(e) ? e : r);
		return e === /* @__PURE__ */ F(r) && s && (o ? oe(n, i) && dt(e, "set", t, n, i) : dt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && dt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !Ct.has(t)) && N(e, "has", t), n;
	}
	ownKeys(e) {
		return N(e, "iterate", d(e) ? "length" : ct), Reflect.ownKeys(e);
	}
}, Dt = class extends Tt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return process.env.NODE_ENV !== "production" && Fe(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
	}
	deleteProperty(e, t) {
		return process.env.NODE_ENV !== "production" && Fe(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
	}
}, Ot = /* @__PURE__ */ new Et(), kt = /* @__PURE__ */ new Dt(), At = /* @__PURE__ */ new Et(!0), jt = /* @__PURE__ */ new Dt(!0), Mt = (e) => e, Nt = (e) => Reflect.getPrototypeOf(e);
function Pt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ F(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? Mt : t ? an : rn;
		return !t && N(a, "iterate", l ? lt : ct), s(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: c ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function Ft(e) {
	return function(...t) {
		if (process.env.NODE_ENV !== "production") {
			let n = t[0] ? `on key "${t[0]}" ` : "";
			Fe(`${ie(e)} operation ${n}failed: target is readonly.`, /* @__PURE__ */ F(this));
		}
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function It(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ F(r), a = /* @__PURE__ */ F(n);
			e || (oe(n, a) && N(i, "get", n), N(i, "get", a));
			let { has: o } = Nt(i), s = t ? Mt : e ? an : rn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && N(/* @__PURE__ */ F(t), "iterate", ct), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ F(n), i = /* @__PURE__ */ F(t);
			return e || (oe(t, i) && N(r, "has", t), N(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ F(a), s = t ? Mt : e ? an : rn;
			return !e && N(o, "iterate", ct), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: Ft("add"),
		set: Ft("set"),
		delete: Ft("delete"),
		clear: Ft("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ F(this), r = Nt(n), i = /* @__PURE__ */ F(e), a = !t && !/* @__PURE__ */ P(e) && !/* @__PURE__ */ en(e) ? i : e;
			return r.has.call(n, a) || oe(e, a) && r.has.call(n, e) || oe(i, a) && r.has.call(n, i) || (n.add(a), dt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ P(n) && !/* @__PURE__ */ en(n) && (n = /* @__PURE__ */ F(n));
			let r = /* @__PURE__ */ F(this), { has: i, get: a } = Nt(r), o = i.call(r, e);
			o ? process.env.NODE_ENV !== "production" && Ht(r, i, e) : (e = /* @__PURE__ */ F(e), o = i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? oe(n, s) && dt(r, "set", e, n, s) : dt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ F(this), { has: n, get: r } = Nt(t), i = n.call(t, e);
			i ? process.env.NODE_ENV !== "production" && Ht(t, n, e) : (e = /* @__PURE__ */ F(e), i = n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && dt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ F(this), t = e.size !== 0, n = process.env.NODE_ENV === "production" ? void 0 : f(e) ? new Map(e) : new Set(e), r = e.clear();
			return t && dt(e, "clear", void 0, void 0, n), r;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Pt(r, e, t);
	}), n;
}
function Lt(e, t) {
	let n = It(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var Rt = { get: /* @__PURE__ */ Lt(!1, !1) }, zt = { get: /* @__PURE__ */ Lt(!1, !0) }, Bt = { get: /* @__PURE__ */ Lt(!0, !1) }, Vt = { get: /* @__PURE__ */ Lt(!0, !0) };
function Ht(e, t, n) {
	let r = /* @__PURE__ */ F(n);
	if (r !== n && t.call(e, r)) {
		let t = S(e);
		Fe(`Reactive ${t} contains both the raw and reactive versions of the same object${t === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
	}
}
var Ut = /* @__PURE__ */ new WeakMap(), Wt = /* @__PURE__ */ new WeakMap(), Gt = /* @__PURE__ */ new WeakMap(), Kt = /* @__PURE__ */ new WeakMap();
function qt(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function Jt(e) {
	return /* @__PURE__ */ en(e) ? e : Qt(e, !1, Ot, Rt, Ut);
}
// @__NO_SIDE_EFFECTS__
function Yt(e) {
	return Qt(e, !1, At, zt, Wt);
}
// @__NO_SIDE_EFFECTS__
function Xt(e) {
	return Qt(e, !0, kt, Bt, Gt);
}
// @__NO_SIDE_EFFECTS__
function Zt(e) {
	return Qt(e, !0, jt, Vt, Kt);
}
function Qt(e, t, n, r, i) {
	if (!v(e)) return process.env.NODE_ENV !== "production" && Fe(`value cannot be made ${t ? "readonly" : "reactive"}: ${String(e)}`), e;
	if (e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = qt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function $t(e) {
	return /* @__PURE__ */ en(e) ? /* @__PURE__ */ $t(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function en(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function P(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function tn(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function F(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ F(t) : e;
}
function nn(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && ce(e, "__v_skip", !0), e;
}
var rn = (e) => v(e) ? /* @__PURE__ */ Jt(e) : e, an = (e) => v(e) ? /* @__PURE__ */ Xt(e) : e;
// @__NO_SIDE_EFFECTS__
function I(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function on(e) {
	return cn(e, !1);
}
// @__NO_SIDE_EFFECTS__
function sn(e) {
	return cn(e, !0);
}
function cn(e, t) {
	return /* @__PURE__ */ I(e) ? e : new ln(e, t);
}
var ln = class {
	constructor(e, t) {
		this.dep = new at(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ F(e), this._value = t ? e : rn(e), this.__v_isShallow = t;
	}
	get value() {
		return process.env.NODE_ENV === "production" ? this.dep.track() : this.dep.track({
			target: this,
			type: "get",
			key: "value"
		}), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ P(e) || /* @__PURE__ */ en(e);
		e = n ? e : /* @__PURE__ */ F(e), oe(e, t) && (this._rawValue = e, this._value = n ? e : rn(e), process.env.NODE_ENV === "production" ? this.dep.trigger() : this.dep.trigger({
			target: this,
			type: "set",
			key: "value",
			newValue: e,
			oldValue: t
		}));
	}
};
function un(e) {
	return /* @__PURE__ */ I(e) ? e.value : e;
}
var dn = {
	get: (e, t, n) => t === "__v_raw" ? e : un(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ I(i) && !/* @__PURE__ */ I(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function fn(e) {
	return /* @__PURE__ */ $t(e) ? e : new Proxy(e, dn);
}
var pn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new at(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = rt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && M !== this) return Ue(this, !0), !0;
		process.env.NODE_ENV;
	}
	get value() {
		let e = process.env.NODE_ENV === "production" ? this.dep.track() : this.dep.track({
			target: this,
			type: "get",
			key: "value"
		});
		return Ye(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter ? this.setter(e) : process.env.NODE_ENV !== "production" && Fe("Write operation failed: computed value is readonly");
	}
};
// @__NO_SIDE_EFFECTS__
function mn(e, t, n = !1) {
	let r, i;
	h(e) ? r = e : (r = e.get, i = e.set);
	let a = new pn(r, i, n);
	return process.env.NODE_ENV !== "production" && t && !n && (a.onTrack = t.onTrack, a.onTrigger = t.onTrigger), a;
}
var hn = {}, gn = /* @__PURE__ */ new WeakMap(), _n = void 0;
function vn(e, t = !1, n = _n) {
	if (n) {
		let t = gn.get(n);
		t || gn.set(n, t = []), t.push(e);
	} else process.env.NODE_ENV !== "production" && !t && Fe("onWatcherCleanup() was called when there was no active watcher to associate with.");
}
function yn(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => {
		(i.onWarn || Fe)("Invalid watch source: ", e, "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.");
	}, m = (e) => o ? e : /* @__PURE__ */ P(e) || o === !1 || o === 0 ? bn(e, 1) : bn(e), g, _, v, y, b = !1, x = !1;
	if (/* @__PURE__ */ I(e) ? (_ = () => e.value, b = /* @__PURE__ */ P(e)) : /* @__PURE__ */ $t(e) ? (_ = () => m(e), b = !0) : d(e) ? (x = !0, b = e.some((e) => /* @__PURE__ */ $t(e) || /* @__PURE__ */ P(e)), _ = () => e.map((e) => {
		if (/* @__PURE__ */ I(e)) return e.value;
		if (/* @__PURE__ */ $t(e)) return m(e);
		if (h(e)) return f ? f(e, 2) : e();
		process.env.NODE_ENV !== "production" && p(e);
	})) : h(e) ? _ = n ? f ? () => f(e, 2) : e : () => {
		if (v) {
			et();
			try {
				v();
			} finally {
				tt();
			}
		}
		let t = _n;
		_n = g;
		try {
			return f ? f(e, 3, [y]) : e(y);
		} finally {
			_n = t;
		}
	} : (_ = r, process.env.NODE_ENV !== "production" && p(e)), n && o) {
		let e = _, t = o === !0 ? Infinity : o;
		_ = () => bn(e(), t);
	}
	let S = Le(), C = () => {
		g.stop(), S && S.active && c(S.effects, g);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			let n = e(...t);
			return C(), n;
		};
	}
	let w = x ? Array(e.length).fill(hn) : hn, T = (e) => {
		if (g.flags & 1 && (g.dirty || e)) {
			if (n) {
				let t = g.run();
				if (e || o || b || (x ? t.some((e, t) => oe(e, w[t])) : oe(t, w))) {
					v && v();
					let e = _n;
					_n = g;
					try {
						let e = [
							t,
							w === hn ? void 0 : x && w[0] === hn ? [] : w,
							y
						];
						w = t, f ? f(n, 3, e) : n(...e);
					} finally {
						_n = e;
					}
				}
			} else g.run();
		}
	};
	return u && u(T), g = new ze(_), g.scheduler = l ? () => l(T, !1) : T, y = (e) => vn(e, !1, g), v = g.onStop = () => {
		let e = gn.get(g);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			gn.delete(g);
		}
	}, process.env.NODE_ENV !== "production" && (g.onTrack = i.onTrack, g.onTrigger = i.onTrigger), n ? a ? T(!0) : w = g.run() : l ? l(T.bind(null, !0), !0) : g.run(), C.pause = g.pause.bind(g), C.resume = g.resume.bind(g), C.stop = C, C;
}
function bn(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ I(e)) bn(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) bn(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		bn(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) bn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && bn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var xn = [];
function Sn(e) {
	xn.push(e);
}
function Cn() {
	xn.pop();
}
var wn = !1;
function L(e, ...t) {
	if (wn) return;
	wn = !0, et();
	let n = xn.length ? xn[xn.length - 1].component : null, r = n && n.appContext.config.warnHandler, i = Tn();
	if (r) Mn(r, n, 11, [
		e + t.map((e) => e.toString?.call(e) ?? JSON.stringify(e)).join(""),
		n && n.proxy,
		i.map(({ vnode: e }) => `at <${ps(n, e.type)}>`).join("\n"),
		i
	]);
	else {
		let n = [`[Vue warn]: ${e}`, ...t];
		i.length && n.push("\n", ...En(i)), console.warn(...n);
	}
	tt(), wn = !1;
}
function Tn() {
	let e = xn[xn.length - 1];
	if (!e) return [];
	let t = [];
	for (; e;) {
		let n = t[0];
		n && n.vnode === e ? n.recurseCount++ : t.push({
			vnode: e,
			recurseCount: 0
		});
		let r = e.component && e.component.parent;
		e = r && r.vnode;
	}
	return t;
}
function En(e) {
	let t = [];
	return e.forEach((e, n) => {
		t.push(...n === 0 ? [] : ["\n"], ...Dn(e));
	}), t;
}
function Dn({ vnode: e, recurseCount: t }) {
	let n = t > 0 ? `... (${t} recursive calls)` : "", r = e.component ? e.component.parent == null : !1, i = ` at <${ps(e.component, e.type, r)}`, a = ">" + n;
	return e.props ? [
		i,
		...On(e.props),
		a
	] : [i + a];
}
function On(e) {
	let t = [], n = Object.keys(e);
	return n.slice(0, 3).forEach((n) => {
		t.push(...kn(n, e[n]));
	}), n.length > 3 && t.push(" ..."), t;
}
function kn(e, t, n) {
	return g(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : /* @__PURE__ */ I(t) ? (t = kn(e, /* @__PURE__ */ F(t.value), !0), n ? t : [
		`${e}=Ref<`,
		t,
		">"
	]) : h(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = /* @__PURE__ */ F(t), n ? t : [`${e}=`, t]);
}
function An(e, t) {
	process.env.NODE_ENV !== "production" && e !== void 0 && (typeof e == "number" ? isNaN(e) && L(`${t} is NaN - the duration expression might be incorrect.`) : L(`${t} is not a valid number - got ${JSON.stringify(e)}.`));
}
var jn = {
	sp: "serverPrefetch hook",
	bc: "beforeCreate hook",
	c: "created hook",
	bm: "beforeMount hook",
	m: "mounted hook",
	bu: "beforeUpdate hook",
	u: "updated",
	bum: "beforeUnmount hook",
	um: "unmounted hook",
	a: "activated hook",
	da: "deactivated hook",
	ec: "errorCaptured hook",
	rtc: "renderTracked hook",
	rtg: "renderTriggered hook",
	0: "setup function",
	1: "render function",
	2: "watcher getter",
	3: "watcher callback",
	4: "watcher cleanup function",
	5: "native event handler",
	6: "component event handler",
	7: "vnode hook",
	8: "directive hook",
	9: "transition hook",
	10: "app errorHandler",
	11: "app warnHandler",
	12: "ref function",
	13: "async component loader",
	14: "scheduler flush",
	15: "component update",
	16: "app unmount cleanup function"
};
function Mn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Pn(e, t, n);
	}
}
function Nn(e, t, n, r) {
	if (h(e)) {
		let i = Mn(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			Pn(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Nn(e[a], t, n, r));
		return i;
	}
	process.env.NODE_ENV !== "production" && L(`Invalid value type passed to callWithAsyncErrorHandling(): ${typeof e}`);
}
function Pn(e, n, r, i = !0) {
	let a = n ? n.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = n && n.appContext.config || t;
	if (n) {
		let t = n.parent, i = n.proxy, a = process.env.NODE_ENV === "production" ? `https://vuejs.org/error-reference/#runtime-${r}` : jn[r];
		for (; t;) {
			let n = t.ec;
			if (n) {
				for (let t = 0; t < n.length; t++) if (n[t](e, i, a) === !1) return;
			}
			t = t.parent;
		}
		if (o) {
			et(), Mn(o, null, 10, [
				e,
				i,
				a
			]), tt();
			return;
		}
	}
	Fn(e, r, a, i, s);
}
function Fn(e, t, n, r = !0, i = !1) {
	if (process.env.NODE_ENV !== "production") {
		let i = jn[t];
		if (n && Sn(n), L(`Unhandled error${i ? ` during execution of ${i}` : ""}`), n && Cn(), r) throw e;
		console.error(e);
	} else if (i) throw e;
	else console.error(e);
}
var R = [], In = -1, Ln = [], Rn = null, zn = 0, Bn = /* @__PURE__ */ Promise.resolve(), Vn = null, Hn = 100;
function Un(e) {
	let t = Vn || Bn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Wn(e) {
	let t = In + 1, n = R.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = R[r], a = Xn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Gn(e) {
	if (!(e.flags & 1)) {
		let t = Xn(e), n = R[R.length - 1];
		!n || !(e.flags & 2) && t >= Xn(n) ? R.push(e) : R.splice(Wn(t), 0, e), e.flags |= 1, Kn();
	}
}
function Kn() {
	Vn ||= Bn.then(Zn);
}
function qn(e) {
	if (!d(e)) Rn && e.id === -1 ? Rn.splice(zn + 1, 0, e) : e.flags & 1 || (Ln.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) Ln.push(e[t]);
	Kn();
}
function Jn(e, t, n = In + 1) {
	for (process.env.NODE_ENV !== "production" && (t ||= /* @__PURE__ */ new Map()); n < R.length; n++) {
		let r = R[n];
		if (r && r.flags & 2) {
			if (e && r.id !== e.uid || process.env.NODE_ENV !== "production" && Qn(t, r)) continue;
			R.splice(n, 1), n--, r.flags & 4 && (r.flags &= -2), r(), r.flags & 4 || (r.flags &= -2);
		}
	}
}
function Yn(e) {
	if (Ln.length) {
		let t = [...new Set(Ln)].sort((e, t) => Xn(e) - Xn(t));
		if (Ln.length = 0, Rn) {
			for (let e = 0; e < t.length; e++) Rn.push(t[e]);
			return;
		}
		for (Rn = t, process.env.NODE_ENV !== "production" && (e ||= /* @__PURE__ */ new Map()), zn = 0; zn < Rn.length; zn++) {
			let t = Rn[zn];
			process.env.NODE_ENV !== "production" && Qn(e, t) || (t.flags & 4 && (t.flags &= -2), t.flags & 8 || t(), t.flags &= -2);
		}
		Rn = null, zn = 0;
	}
}
var Xn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Zn(e) {
	process.env.NODE_ENV !== "production" && (e ||= /* @__PURE__ */ new Map());
	let t = process.env.NODE_ENV === "production" ? r : (t) => Qn(e, t);
	try {
		for (In = 0; In < R.length; In++) {
			let e = R[In];
			if (e && !(e.flags & 8)) {
				if (process.env.NODE_ENV !== "production" && t(e)) continue;
				e.flags & 4 && (e.flags &= -2), Mn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2);
			}
		}
	} finally {
		for (; In < R.length; In++) {
			let e = R[In];
			e && (e.flags &= -2);
		}
		In = -1, R.length = 0, Yn(e), Vn = null, (R.length || Ln.length) && Zn(e);
	}
}
function Qn(e, t) {
	let n = e.get(t) || 0;
	if (n > Hn) {
		let e = t.i, n = e && fs(e.type);
		return Pn(`Maximum recursive updates exceeded${n ? ` in component <${n}>` : ""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`, null, 10), !0;
	}
	return e.set(t, n + 1), !1;
}
var $n = !1, er = (e) => {
	try {
		return $n;
	} finally {
		$n = e;
	}
}, tr = /* @__PURE__ */ new Map();
process.env.NODE_ENV !== "production" && (de().__VUE_HMR_RUNTIME__ = {
	createRecord: ur(ar),
	rerender: ur(sr),
	reload: ur(cr)
});
var nr = /* @__PURE__ */ new Map();
function rr(e) {
	let t = e.type.__hmrId, n = nr.get(t);
	n ||= (ar(t, e.type), nr.get(t)), n.instances.add(e);
}
function ir(e) {
	nr.get(e.type.__hmrId).instances.delete(e);
}
function ar(e, t) {
	return !nr.has(e) && (nr.set(e, {
		initialDef: or(t),
		instances: /* @__PURE__ */ new Set()
	}), !0);
}
function or(e) {
	return ms(e) ? e.__vccOpts : e;
}
function sr(e, t) {
	let n = nr.get(e);
	n && (n.initialDef.render = t, [...n.instances].forEach((e) => {
		t && (e.render = t, or(e.type).render = t), e.renderCache = [], $n = !0, e.job.flags & 8 || e.update(), $n = !1;
	}));
}
function cr(e, t) {
	let n = nr.get(e);
	if (!n) return;
	t = or(t), lr(n.initialDef, t);
	let r = [...n.instances];
	for (let e = 0; e < r.length; e++) {
		let i = r[e], a = or(i.type), o = tr.get(a);
		o || (a !== n.initialDef && lr(a, t), tr.set(a, o = /* @__PURE__ */ new Set())), o.add(i), i.appContext.propsCache.delete(i.type), i.appContext.emitsCache.delete(i.type), i.appContext.optionsCache.delete(i.type), i.ceReload ? (o.add(i), i.ceReload(t.styles), o.delete(i)) : i.parent ? Gn(() => {
			i.job.flags & 8 || ($n = !0, i.parent.update(), $n = !1, o.delete(i));
		}) : i.appContext.reload ? i.appContext.reload() : typeof window < "u" ? window.location.reload() : console.warn("[HMR] Root or manually mounted instance modified. Full reload required."), i.root.ce && i !== i.root && i.root.ce._removeChildStyle(a);
	}
	qn(() => {
		tr.clear();
	});
}
function lr(e, t) {
	s(e, t);
	for (let n in e) n !== "__file" && !(n in t) && delete e[n];
}
function ur(e) {
	return (t, n) => {
		try {
			return e(t, n);
		} catch (e) {
			console.error(e), console.warn("[HMR] Something went wrong during Vue component hot-reload. Full reload required.");
		}
	};
}
var dr, fr = [], pr = !1;
function mr(e, ...t) {
	dr ? dr.emit(e, ...t) : pr || fr.push({
		event: e,
		args: t
	});
}
function hr(e, t) {
	dr = e, dr ? (dr.enabled = !0, fr.forEach(({ event: e, args: t }) => dr.emit(e, ...t)), fr = []) : typeof window < "u" && window.HTMLElement && !(window.navigator?.userAgent)?.includes("jsdom") ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((e) => {
		hr(e, t);
	}), setTimeout(() => {
		dr || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, pr = !0, fr = []);
	}, 3e3)) : (pr = !0, fr = []);
}
function gr(e, t) {
	mr("app:init", e, t, {
		Fragment: V,
		Text: _o,
		Comment: H,
		Static: vo
	});
}
function _r(e) {
	mr("app:unmount", e);
}
var vr = /* @__PURE__ */ Sr("component:added"), yr = /* @__PURE__ */ Sr("component:updated"), br = /* @__PURE__ */ Sr("component:removed"), xr = (e) => {
	dr && typeof dr.cleanupBuffer == "function" && !dr.cleanupBuffer(e) && br(e);
};
// @__NO_SIDE_EFFECTS__
function Sr(e) {
	return (t) => {
		mr(e, t.appContext.app, t.uid, t.parent ? t.parent.uid : void 0, t);
	};
}
var Cr = /* @__PURE__ */ Tr("perf:start"), wr = /* @__PURE__ */ Tr("perf:end");
function Tr(e) {
	return (t, n, r) => {
		mr(e, t.appContext.app, t.uid, t, n, r);
	};
}
function Er(e, t, n) {
	mr("component:emit", e.appContext.app, e, t, n);
}
var Dr = null, Or = null;
function kr(e) {
	let t = Dr;
	return Dr = e, Or = e && e.type.__scopeId || null, t;
}
function Ar(e, t = Dr, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Co(-1);
		let i = kr(t), a = yo.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = yo.length; e > a; e--) xo();
			kr(i), r._d && Co(1);
		}
		return process.env.NODE_ENV !== "production" && yr(t), o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function jr(e) {
	ee(e) && L("Do not use built-in directive ids as custom directive id: " + e);
}
function z(e, n) {
	if (Dr === null) return process.env.NODE_ENV !== "production" && L("withDirectives can only be used inside render functions."), e;
	let r = ls(Dr), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && bn(o), i.push({
			dir: a,
			instance: r,
			value: o,
			oldValue: void 0,
			arg: s,
			modifiers: c
		}));
	}
	return e;
}
function Mr(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (et(), Nn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), tt());
	}
}
function Nr(e, t) {
	if (process.env.NODE_ENV !== "production" && (!J || J.isMounted) && L("provide() can only be used inside setup()."), J) {
		let n = J.provides, r = J.parent && J.parent.provides;
		r === n && (n = J.provides = Object.create(r)), n[e] = t;
	}
}
function Pr(e, t, n = !1) {
	let r = Ko();
	if (r || aa) {
		let i = aa ? aa._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
		process.env.NODE_ENV !== "production" && L(`injection "${String(e)}" not found.`);
	} else process.env.NODE_ENV !== "production" && L("inject() can only be used inside setup() or functional components.");
}
var Fr = /* @__PURE__ */ Symbol.for("v-scx"), Ir = () => {
	{
		let e = Pr(Fr);
		return e || process.env.NODE_ENV !== "production" && L("Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build."), e;
	}
};
function Lr(e, t, n) {
	return process.env.NODE_ENV !== "production" && !h(t) && L("`watch(fn, options?)` signature has been moved to a separate API. Use `watchEffect(fn, options?)` instead. `watch` now only supports `watch(source, cb, options?) signature."), Rr(e, t, n);
}
function Rr(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i;
	process.env.NODE_ENV !== "production" && !n && (a !== void 0 && L("watch() \"immediate\" option is only respected when using the watch(source, callback, options?) signature."), o !== void 0 && L("watch() \"deep\" option is only respected when using the watch(source, callback, options?) signature."), l !== void 0 && L("watch() \"once\" option is only respected when using the watch(source, callback, options?) signature."));
	let u = s({}, i);
	process.env.NODE_ENV !== "production" && (u.onWarn = L);
	let d = n && a || !n && c !== "post", f;
	if (es) {
		if (c === "sync") {
			let e = Ir();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = J;
	u.call = (e, t, n) => Nn(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		ro(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : Gn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = yn(e, n, u);
	return es && (f ? f.push(h) : d && h()), h;
}
function zr(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? Br(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = Yo(this), s = Rr(i, a.bind(r), n);
	return o(), s;
}
function Br(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Vr = /* @__PURE__ */ Symbol("_vte"), Hr = (e) => e.__isTeleport, Ur = /* @__PURE__ */ Symbol("_leaveCb"), Wr = /* @__PURE__ */ Symbol("_enterCb");
function Gr() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return yi(() => {
		e.isMounted = !0;
	}), Si(() => {
		e.isUnmounting = !0;
	}), e;
}
var Kr = [Function, Array], qr = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: Kr,
	onEnter: Kr,
	onAfterEnter: Kr,
	onEnterCancelled: Kr,
	onBeforeLeave: Kr,
	onLeave: Kr,
	onAfterLeave: Kr,
	onLeaveCancelled: Kr,
	onBeforeAppear: Kr,
	onAppear: Kr,
	onAfterAppear: Kr,
	onAppearCancelled: Kr
}, Jr = (e) => {
	let t = e.subTree;
	return t.component ? Jr(t.component) : t;
}, Yr = {
	name: "BaseTransition",
	props: qr,
	setup(e, { slots: t }) {
		let n = Ko(), r = Gr();
		return () => {
			let i = t.default && ri(t.default(), !0), a = i && i.length ? Xr(i) : n.subTree ? q() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ F(e), { mode: s } = o;
			if (process.env.NODE_ENV !== "production" && s && s !== "in-out" && s !== "out-in" && s !== "default" && L(`invalid <transition> mode: ${s}`), r.isLeaving) return ei(a);
			let c = ti(a);
			if (!c) return ei(a);
			let l = $r(c, o, r, n, (e) => l = e);
			c.type !== H && ni(c, l);
			let u = n.subTree && ti(n.subTree);
			if (u && u.type !== H && !Do(u, c) && Jr(n).type !== H) {
				let e = $r(u, o, r, n);
				if (ni(u, e), s === "out-in" && c.type !== H) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, ei(a);
				s === "in-out" && c.type !== H ? e.delayLeave = (e, t, n) => {
					let i = Qr(r, u);
					i[String(u.key)] = u, e[Ur] = () => {
						t(), e[Ur] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function Xr(e) {
	let t = e[0];
	if (e.length > 1) {
		let n = !1;
		for (let r of e) if (r.type !== H) {
			if (process.env.NODE_ENV !== "production" && n) {
				L("<transition> can only be used on a single element or component. Use <transition-group> for lists.");
				break;
			}
			if (t = r, n = !0, process.env.NODE_ENV === "production") break;
		}
	}
	return t;
}
var Zr = Yr;
function Qr(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function $r(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: f, onBeforeLeave: p, onLeave: m, onAfterLeave: h, onLeaveCancelled: g, onBeforeAppear: _, onAppear: v, onAfterAppear: y, onAppearCancelled: b } = t, x = String(e.key), S = Qr(n, e), C = (e, t) => {
		e && Nn(e, r, 9, t);
	}, w = (e, t) => {
		let n = t[1];
		C(e, t), d(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, T = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) {
				if (a) r = _ || c;
				else return;
			}
			t[Ur] && t[Ur](!0);
			let i = S[x];
			i && Do(e, i) && i.el[Ur] && i.el[Ur](), C(r, [t]);
		},
		enter(t) {
			if (!$n && S[x] === e) return;
			let r = l, i = u, o = f;
			if (!n.isMounted) {
				if (a) r = v || l, i = y || u, o = b || f;
				else return;
			}
			let s = !1;
			t[Wr] = (e) => {
				s || (s = !0, C(e ? o : i, [t]), T.delayedLeave && T.delayedLeave(), t[Wr] = void 0);
			};
			let c = t[Wr].bind(null, !1);
			r ? w(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[Wr] && t[Wr](!0), n.isUnmounting) return r();
			C(p, [t]);
			let a = !1;
			t[Ur] = (n) => {
				a || (a = !0, r(), C(n ? g : h, [t]), t[Ur] = void 0, S[i] === e && delete S[i]);
			};
			let o = t[Ur].bind(null, !1);
			S[i] = e, m ? w(m, [t, o]) : o();
		},
		clone(e) {
			let a = $r(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return T;
}
function ei(e) {
	if (di(e)) return e = Po(e), e.children = null, e;
}
function ti(e) {
	if (!di(e)) return Hr(e.type) && e.children ? Xr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function ni(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		ni(Hr(n.type) && ti(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function ri(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === V ? (o.patchFlag & 128 && i++, r = r.concat(ri(o.children, t, s))) : (t || o.type !== H) && r.push(s == null ? o : Po(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function ii(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
var ai = /* @__PURE__ */ new WeakSet();
function oi(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var si = /* @__PURE__ */ new WeakMap();
function ci(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => ci(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (ui(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && ci(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? ls(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e;
	if (process.env.NODE_ENV !== "production" && !f) {
		L("Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.");
		return;
	}
	let m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ F(v), b = v === t ? i : (e) => process.env.NODE_ENV !== "production" && (u(y, e) && !/* @__PURE__ */ I(y[e]) && L(`Template ref "${e}" used on a non-ref value. It will not work in the production build.`), ai.has(y[e])) || oi(_, e) ? !1 : u(y, e), x = (e, t) => !(process.env.NODE_ENV !== "production" && ai.has(e) || t && oi(_, t));
	if (m != null && m !== p) {
		if (li(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ I(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) Mn(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ I(p);
		if (t || n) {
			let i = () => {
				if (e.f) {
					let n = t ? b(p) ? v[p] : _[p] : x(p) || !e.k ? p.value : _[e.k];
					if (o) d(n) && c(n, s);
					else if (d(n)) n.includes(s) || n.push(s);
					else if (t) _[p] = [s], b(p) && (v[p] = _[p]);
					else {
						let t = [s];
						x(p, e.k) && (p.value = t), e.k && (_[e.k] = t);
					}
				} else t ? (_[p] = l, b(p) && (v[p] = l)) : n ? (x(p, e.k) && (p.value = l), e.k && (_[e.k] = l)) : process.env.NODE_ENV !== "production" && L("Invalid template ref type:", p, `(${typeof p})`);
			};
			if (l) {
				let t = () => {
					i(), si.delete(e);
				};
				t.id = -1, si.set(e, t), ro(t, r);
			} else li(e), i();
		} else process.env.NODE_ENV !== "production" && L("Invalid template ref type:", p, `(${typeof p})`);
	}
}
function li(e) {
	let t = si.get(e);
	t && (t.flags |= 8, si.delete(e));
}
de().requestIdleCallback, de().cancelIdleCallback;
var ui = (e) => !!e.type.__asyncLoader, di = (e) => e.type.__isKeepAlive;
function fi(e, t) {
	mi(e, "a", t);
}
function pi(e, t) {
	mi(e, "da", t);
}
function mi(e, t, n = J) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (gi(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) di(e.parent.vnode) && hi(r, t, n, e), e = e.parent;
	}
}
function hi(e, t, n, r) {
	let i = gi(t, e, r, !0);
	Ci(() => {
		c(r[t], i);
	}, n);
}
function gi(e, t, n = J, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			et();
			let i = Yo(n), a = Nn(t, n, e, r);
			return i(), tt(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
	process.env.NODE_ENV !== "production" && L(`${ae(jn[e].replace(/ hook$/, ""))} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`);
}
var _i = (e) => (t, n = J) => {
	(!es || e === "sp") && gi(e, (...e) => t(...e), n);
}, vi = _i("bm"), yi = _i("m"), bi = _i("bu"), xi = _i("u"), Si = _i("bum"), Ci = _i("um"), wi = _i("sp"), Ti = _i("rtg"), Ei = _i("rtc");
function Di(e, t = J) {
	gi("ec", e, t);
}
var Oi = /* @__PURE__ */ Symbol.for("v-ndc");
function B(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ $t(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ P(e), s = /* @__PURE__ */ en(e), e = pt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? an(rn(e[n])) : rn(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		if (process.env.NODE_ENV !== "production" && (!Number.isInteger(e) || e < 0)) L(`The v-for range expects a positive integer value but got ${e}.`), i = [];
		else {
			i = Array(e);
			for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
		}
	} else if (v(e)) {
		if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
		else {
			let n = Object.keys(e);
			i = Array(n.length);
			for (let r = 0, o = n.length; r < o; r++) {
				let o = n[r];
				i[r] = t(e[o], o, r, a && a[r]);
			}
		}
	} else i = [];
	return n && (n[r] = i), i;
}
var ki = (e) => e ? $o(e) ? ls(e) : ki(e.parent) : null, Ai = (e) => {
	let t = !1;
	for (;;) {
		if (e.patchFlag > 0 && e.patchFlag & 2048) {
			let n = ha(e.children);
			if (!n) return;
			e = n, t = !0;
			continue;
		}
		let n = e.component;
		if (n && n.subTree) {
			e = n.subTree;
			continue;
		}
		let r = e.suspense;
		if (r && r.activeBranch) {
			e = r.activeBranch;
			continue;
		}
		return t ? e.el : void 0;
	}
}, ji = (e) => {
	let t = e.subTree && Ai(e.subTree);
	return t === void 0 ? e.vnode.el : t;
}, Mi = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => process.env.NODE_ENV === "production" ? e.vnode.el : ji(e),
	$data: (e) => e.data,
	$props: (e) => process.env.NODE_ENV === "production" ? e.props : /* @__PURE__ */ Zt(e.props),
	$attrs: (e) => process.env.NODE_ENV === "production" ? e.attrs : /* @__PURE__ */ Zt(e.attrs),
	$slots: (e) => process.env.NODE_ENV === "production" ? e.slots : /* @__PURE__ */ Zt(e.slots),
	$refs: (e) => process.env.NODE_ENV === "production" ? e.refs : /* @__PURE__ */ Zt(e.refs),
	$parent: (e) => ki(e.parent),
	$root: (e) => ki(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Ki(e),
	$forceUpdate: (e) => e.f ||= () => {
		Gn(e.update);
	},
	$nextTick: (e) => e.n ||= Un.bind(e.proxy),
	$watch: (e) => zr.bind(e)
}), Ni = (e) => e === "_" || e === "$", Pi = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), Fi = {
	get({ _: e }, n) {
		if (n === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (process.env.NODE_ENV !== "production" && n === "__isVue") return !0;
		if (n[0] !== "$") {
			let e = s[n];
			if (e !== void 0) switch (e) {
				case 1: return i[n];
				case 2: return a[n];
				case 4: return r[n];
				case 3: return o[n];
			}
			else if (Pi(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else Vi && (s[n] = 0);
		}
		let d = Mi[n], f, p;
		if (d) return n === "$attrs" ? (N(e.attrs, "get", ""), process.env.NODE_ENV !== "production" && fa()) : process.env.NODE_ENV !== "production" && n === "$slots" && N(e, "get", n), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
		process.env.NODE_ENV !== "production" && Dr && (!g(n) || n.indexOf("__v") !== 0) && (a !== t && Ni(n[0]) && u(a, n) ? L(`Property ${JSON.stringify(n)} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`) : e === Dr && L(`Property ${JSON.stringify(n)} was accessed during render but is not defined on instance.`));
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return Pi(a, n) ? (a[n] = r, !0) : process.env.NODE_ENV !== "production" && a.__isScriptSetup && u(a, n) ? (L(`Cannot mutate <script setup> binding "${n}" from Options API.`), !1) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) ? (process.env.NODE_ENV !== "production" && L(`Attempting to mutate prop "${n}". Props are readonly.`), !1) : n[0] === "$" && n.slice(1) in e ? (process.env.NODE_ENV !== "production" && L(`Attempting to mutate public property "${n}". Properties starting with $ are reserved and readonly.`), !1) : (process.env.NODE_ENV !== "production" && n in e.appContext.config.globalProperties ? Object.defineProperty(o, n, {
			enumerable: !0,
			configurable: !0,
			value: r
		}) : o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || Pi(n, c) || u(o, c) || u(i, c) || u(Mi, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
process.env.NODE_ENV !== "production" && (Fi.ownKeys = (e) => (L("Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."), Reflect.ownKeys(e)));
function Ii(e) {
	let t = {};
	return Object.defineProperty(t, "_", {
		configurable: !0,
		enumerable: !1,
		get: () => e
	}), Object.keys(Mi).forEach((n) => {
		Object.defineProperty(t, n, {
			configurable: !0,
			enumerable: !1,
			get: () => Mi[n](e),
			set: r
		});
	}), t;
}
function Li(e) {
	let { ctx: t, propsOptions: [n] } = e;
	n && Object.keys(n).forEach((n) => {
		Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => e.props[n],
			set: r
		});
	});
}
function Ri(e) {
	let { ctx: t, setupState: n } = e;
	Object.keys(/* @__PURE__ */ F(n)).forEach((e) => {
		if (!n.__isScriptSetup) {
			if (Ni(e[0])) {
				L(`setup() return property ${JSON.stringify(e)} should not start with "$" or "_" which are reserved prefixes for Vue internals.`);
				return;
			}
			Object.defineProperty(t, e, {
				enumerable: !0,
				configurable: !0,
				get: () => n[e],
				set: r
			});
		}
	});
}
function zi(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function Bi() {
	let e = /* @__PURE__ */ Object.create(null);
	return (t, n) => {
		e[n] ? L(`${t} property "${n}" is already defined in ${e[n]}.`) : e[n] = t;
	};
}
var Vi = !0;
function Hi(e) {
	let t = Ki(e), n = e.proxy, i = e.ctx;
	Vi = !1, t.beforeCreate && Wi(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: b, deactivated: x, beforeDestroy: S, beforeUnmount: C, destroyed: w, unmounted: T, render: ee, renderTracked: te, renderTriggered: ne, errorCaptured: E, serverPrefetch: re, expose: D, inheritAttrs: ie, components: ae, directives: oe, filters: se } = t, ce = process.env.NODE_ENV === "production" ? null : Bi();
	if (process.env.NODE_ENV !== "production") {
		let [t] = e.propsOptions;
		if (t) for (let e in t) ce("Props", e);
	}
	if (u && Ui(u, i, ce), s) for (let e in s) {
		let t = s[e];
		h(t) ? (process.env.NODE_ENV === "production" ? i[e] = t.bind(n) : Object.defineProperty(i, e, {
			value: t.bind(n),
			configurable: !0,
			enumerable: !0,
			writable: !0
		}), process.env.NODE_ENV !== "production" && ce("Methods", e)) : process.env.NODE_ENV !== "production" && L(`Method "${e}" has type "${typeof t}" in the component definition. Did you reference the function correctly?`);
	}
	if (a) {
		process.env.NODE_ENV !== "production" && !h(a) && L("The data option must be a function. Plain object usage is no longer supported.");
		let t = a.call(n, n);
		if (process.env.NODE_ENV !== "production" && y(t) && L("data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>."), !v(t)) process.env.NODE_ENV !== "production" && L("data() should return an object.");
		else if (e.data = /* @__PURE__ */ Jt(t), process.env.NODE_ENV !== "production") for (let e in t) ce("Data", e), Ni(e[0]) || Object.defineProperty(i, e, {
			configurable: !0,
			enumerable: !0,
			get: () => t[e],
			set: r
		});
	}
	if (Vi = !0, o) for (let e in o) {
		let t = o[e], a = h(t) ? t.bind(n, n) : h(t.get) ? t.get.bind(n, n) : r;
		process.env.NODE_ENV !== "production" && a === r && L(`Computed property "${e}" has no getter.`);
		let s = Y({
			get: a,
			set: !h(t) && h(t.set) ? t.set.bind(n) : process.env.NODE_ENV === "production" ? r : () => {
				L(`Write operation failed: computed property "${e}" is readonly.`);
			}
		});
		Object.defineProperty(i, e, {
			enumerable: !0,
			configurable: !0,
			get: () => s.value,
			set: (e) => s.value = e
		}), process.env.NODE_ENV !== "production" && ce("Computed", e);
	}
	if (c) for (let e in c) Gi(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Nr(t, e[t]);
		});
	}
	f && Wi(f, e, "c");
	function O(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (O(vi, p), O(yi, m), O(bi, g), O(xi, _), O(fi, b), O(pi, x), O(Di, E), O(Ei, te), O(Ti, ne), O(Si, C), O(Ci, T), O(wi, re), d(D)) {
		if (D.length) {
			let t = e.exposed ||= {};
			D.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	ee && e.render === r && (e.render = ee), ie != null && (e.inheritAttrs = ie), ae && (e.components = ae), oe && (e.directives = oe), re && ii(e);
}
function Ui(e, t, n = r) {
	d(e) && (e = Zi(e));
	for (let r in e) {
		let i = e[r], a;
		a = v(i) ? "default" in i ? Pr(i.from || r, i.default, !0) : Pr(i.from || r) : Pr(i), /* @__PURE__ */ I(a) ? Object.defineProperty(t, r, {
			enumerable: !0,
			configurable: !0,
			get: () => a.value,
			set: (e) => a.value = e
		}) : t[r] = a, process.env.NODE_ENV !== "production" && n("Inject", r);
	}
}
function Wi(e, t, n) {
	Nn(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Gi(e, t, n, r) {
	let i = r.includes(".") ? Br(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) ? Lr(i, n) : process.env.NODE_ENV !== "production" && L(`Invalid watch handler specified by key "${e}"`, n);
	} else if (h(e)) Lr(i, e.bind(n));
	else if (v(e)) {
		if (d(e)) e.forEach((e) => Gi(e, t, n, r));
		else {
			let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
			h(r) ? Lr(i, r, e) : process.env.NODE_ENV !== "production" && L(`Invalid watch handler specified by key "${e.handler}"`, r);
		}
	} else process.env.NODE_ENV !== "production" && L(`Invalid watch option: "${r}"`, e);
}
function Ki(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => qi(c, e, o, !0)), qi(c, t, o)), v(t) && a.set(t, c), c;
}
function qi(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && qi(e, a, n, !0), i && i.forEach((t) => qi(e, t, n, !0));
	for (let i in t) if (r && i === "expose") process.env.NODE_ENV !== "production" && L("\"expose\" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.");
	else {
		let r = Ji[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Ji = {
	data: Yi,
	props: ea,
	emits: ea,
	methods: $i,
	computed: $i,
	beforeCreate: Qi,
	created: Qi,
	beforeMount: Qi,
	mounted: Qi,
	beforeUpdate: Qi,
	updated: Qi,
	beforeDestroy: Qi,
	beforeUnmount: Qi,
	destroyed: Qi,
	unmounted: Qi,
	activated: Qi,
	deactivated: Qi,
	errorCaptured: Qi,
	serverPrefetch: Qi,
	components: $i,
	directives: $i,
	watch: ta,
	provide: Yi,
	inject: Xi
};
function Yi(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function Xi(e, t) {
	return $i(Zi(e), Zi(t));
}
function Zi(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Qi(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function $i(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function ea(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), zi(e), zi(t ?? {})) : t;
}
function ta(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Qi(e[r], t[r]);
	return n;
}
function na() {
	return {
		app: null,
		config: {
			isNativeTag: i,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var ra = 0;
function ia(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (process.env.NODE_ENV !== "production" && L("root props passed to app.mount() must be an object."), r = null);
		let i = na(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: ra++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: _s,
			get config() {
				return i.config;
			},
			set config(e) {
				process.env.NODE_ENV !== "production" && L("app.config cannot be replaced. Modify individual options instead.");
			},
			use(e, ...t) {
				return a.has(e) ? process.env.NODE_ENV !== "production" && L("Plugin has already been applied to target app.") : e && h(e.install) ? (a.add(e), e.install(l, ...t)) : h(e) ? (a.add(e), e(l, ...t)) : process.env.NODE_ENV !== "production" && L("A plugin must either be a function or an object with an \"install\" function."), l;
			},
			mixin(e) {
				return i.mixins.includes(e) ? process.env.NODE_ENV !== "production" && L("Mixin has already been applied to target app" + (e.name ? `: ${e.name}` : "")) : i.mixins.push(e), l;
			},
			component(e, t) {
				return process.env.NODE_ENV !== "production" && Qo(e, i.config), t ? (process.env.NODE_ENV !== "production" && i.components[e] && L(`Component "${e}" has already been registered in target app.`), i.components[e] = t, l) : i.components[e];
			},
			directive(e, t) {
				return process.env.NODE_ENV !== "production" && jr(e), t ? (process.env.NODE_ENV !== "production" && i.directives[e] && L(`Directive "${e}" has already been registered in target app.`), i.directives[e] = t, l) : i.directives[e];
			},
			mount(a, o, s) {
				if (c) process.env.NODE_ENV !== "production" && L("App has already been mounted.\nIf you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. `const createMyApp = () => createApp(App)`");
				else {
					process.env.NODE_ENV !== "production" && a.__vue_app__ && L("There is already an app instance mounted on the host container.\n If you want to mount another app on the same host container, you need to unmount the previous app by calling `app.unmount()` first.");
					let u = l._ceVNode || K(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), process.env.NODE_ENV !== "production" && (i.reload = () => {
						let t = Po(u);
						t.el = null, e(t, a, s);
					}), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, process.env.NODE_ENV !== "production" && (l._instance = u.component, gr(l, _s)), ls(u.component);
				}
			},
			onUnmount(e) {
				process.env.NODE_ENV !== "production" && typeof e != "function" && L(`Expected function as first argument to app.onUnmount(), but got ${typeof e}`), o.push(e);
			},
			unmount() {
				c ? (Nn(o, l._instance, 16), e(null, l._container), process.env.NODE_ENV !== "production" && (l._instance = null, _r(l)), delete l._container.__vue_app__) : process.env.NODE_ENV !== "production" && L("Cannot unmount an app that is not mounted.");
			},
			provide(e, t) {
				return process.env.NODE_ENV !== "production" && e in i.provides && (u(i.provides, e) ? L(`App already provides property with key "${String(e)}". It will be overwritten with the new value.`) : L(`App already provides property with key "${String(e)}" inherited from its parent element. It will be overwritten with the new value.`)), i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = aa;
				aa = l;
				try {
					return e();
				} finally {
					aa = t;
				}
			}
		};
		return l;
	};
}
var aa = null, oa = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${E(t)}Modifiers`] || e[`${D(t)}Modifiers`];
function sa(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t;
	if (process.env.NODE_ENV !== "production") {
		let { emitsOptions: t, propsOptions: [i] } = e;
		if (t) {
			if (!(n in t)) (!i || !(ae(E(n)) in i)) && L(`Component emitted event "${n}" but it is neither declared in the emits option nor as an "${ae(E(n))}" prop.`);
			else {
				let e = t[n];
				h(e) && (e(...r) || L(`Invalid event arguments: event validation failed for event "${n}".`));
			}
		}
	}
	let a = r, o = n.startsWith("update:"), s = o && oa(i, n.slice(7));
	if (s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(O))), process.env.NODE_ENV !== "production" && Er(e, n, a), process.env.NODE_ENV !== "production") {
		let t = n.toLowerCase();
		t !== n && i[ae(t)] && L(`Event "${t}" is emitted in component ${ps(e, e.type)} but the handler is registered for "${n}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${D(n)}" instead of "${n}".`);
	}
	let c, l = i[c = ae(n)] || i[c = ae(E(n))];
	!l && o && (l = i[c = ae(D(n))]), l && Nn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, Nn(u, e, 6, a);
	}
}
var ca = /* @__PURE__ */ new WeakMap();
function la(e, t, n = !1) {
	let r = n ? ca : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = la(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function ua(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, D(t)) || u(e, t));
}
var da = !1;
function fa() {
	da = !0;
}
function pa(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [s], slots: c, attrs: l, emit: u, render: d, renderCache: f, props: p, data: m, setupState: h, ctx: g, inheritAttrs: _ } = e, v = kr(e), y, b;
	process.env.NODE_ENV !== "production" && (da = !1);
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = process.env.NODE_ENV !== "production" && h.__isScriptSetup ? new Proxy(e, { get(e, t, n) {
				return L(`Property '${String(t)}' was accessed via 'this'. Avoid using 'this' in templates.`), Reflect.get(e, t, n);
			} }) : e;
			y = Ro(d.call(t, e, f, process.env.NODE_ENV === "production" ? p : /* @__PURE__ */ Zt(p), h, m, g)), b = l;
		} else {
			let e = t;
			process.env.NODE_ENV !== "production" && l === p && fa(), y = Ro(e.length > 1 ? e(process.env.NODE_ENV === "production" ? p : /* @__PURE__ */ Zt(p), process.env.NODE_ENV === "production" ? {
				attrs: l,
				slots: c,
				emit: u
			} : {
				get attrs() {
					return fa(), /* @__PURE__ */ Zt(l);
				},
				slots: c,
				emit: u
			}) : e(process.env.NODE_ENV === "production" ? p : /* @__PURE__ */ Zt(p), null)), b = t.props ? l : ga(l);
		}
	} catch (t) {
		yo.length = 0, Pn(t, e, 1), y = K(H);
	}
	let x = y, S;
	if (process.env.NODE_ENV !== "production" && y.patchFlag > 0 && y.patchFlag & 2048 && ([x, S] = ma(y)), b && _ !== !1) {
		let e = Object.keys(b), { shapeFlag: t } = x;
		if (e.length) {
			if (t & 7) s && e.some(o) && (b = _a(b, s)), x = Po(x, b, !1, !0);
			else if (process.env.NODE_ENV !== "production" && !da && x.type !== H) {
				let e = Object.keys(l), t = [], n = [];
				for (let r = 0, i = e.length; r < i; r++) {
					let i = e[r];
					a(i) ? o(i) || t.push(i[2].toLowerCase() + i.slice(3)) : n.push(i);
				}
				n.length && L(`Extraneous non-props attributes (${n.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes.`), t.length && L(`Extraneous non-emits event listeners (${t.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`);
			}
		}
	}
	if (n.dirs && (process.env.NODE_ENV !== "production" && !va(x) && L("Runtime directive used on component with non-element root node. The directives will not function as intended."), x = Po(x, null, !1, !0), x.dirs = x.dirs ? x.dirs.concat(n.dirs) : n.dirs), n.transition) {
		let e = Hr(x.type) && ti(x) || x;
		process.env.NODE_ENV !== "production" && !va(e) && L("Component inside <Transition> renders non-element root node that cannot be animated."), ni(e, n.transition);
	}
	return process.env.NODE_ENV !== "production" && S ? S(x) : y = x, kr(v), y;
}
var ma = (e) => {
	let t = e.children, n = e.dynamicChildren, r = ha(t, !1);
	if (!r) return [e, void 0];
	if (process.env.NODE_ENV !== "production" && r.patchFlag > 0 && r.patchFlag & 2048) return ma(r);
	let i = t.indexOf(r), a = n ? n.indexOf(r) : -1;
	return [Ro(r), (r) => {
		t[i] = r, n && (a > -1 ? n[a] = r : r.patchFlag > 0 && (e.dynamicChildren = [...n, r]));
	}];
};
function ha(e, t = !0) {
	let n;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (Eo(i)) {
			if (i.type !== H || i.children === "v-if") {
				if (n) return;
				if (n = i, process.env.NODE_ENV !== "production" && t && n.patchFlag > 0 && n.patchFlag & 2048) return ha(n.children);
			}
		} else return;
	}
	return n;
}
var ga = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, _a = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
}, va = (e) => e.shapeFlag & 7 || e.type === H;
function ya(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (process.env.NODE_ENV !== "production" && (i || s) && $n || t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? ba(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (xa(o, r, n) && !ua(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || ba(r, o, l) : !!o;
	return !1;
}
function ba(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (xa(t, e, a) && !ua(n, a)) return !0;
	}
	return !1;
}
function xa(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !Ae(r, i) : r !== i;
}
function Sa({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Ca = {}, wa = () => Object.create(Ca), Ta = (e) => Object.getPrototypeOf(e) === Ca;
function Ea(e, t, n, r = !1) {
	let i = {}, a = wa();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), ka(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	process.env.NODE_ENV !== "production" && Fa(t || {}, i, e), e.props = n ? r ? i : /* @__PURE__ */ Yt(i) : e.type.props ? i : a, e.attrs = a;
}
function Da(e) {
	for (; e;) {
		if (e.type.__hmrId) return !0;
		e = e.parent;
	}
}
function Oa(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ F(i), [c] = e.propsOptions, l = !1;
	if (!(process.env.NODE_ENV !== "production" && Da(e)) && (r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (ua(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = E(o);
						i[t] = Aa(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		ka(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = D(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Aa(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && dt(e.attrs, "set", ""), process.env.NODE_ENV !== "production" && Fa(t || {}, i, e);
}
function ka(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = E(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : ua(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ F(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = Aa(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function Aa(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Yo(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === D(n)) && (r = !0));
	}
	return r;
}
var ja = /* @__PURE__ */ new WeakMap();
function Ma(e, r, i = !1) {
	let a = i ? ja : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = Ma(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		process.env.NODE_ENV !== "production" && !g(c[e]) && L("props must be strings when using array syntax.", c[e]);
		let n = E(c[e]);
		Na(n) && (l[n] = t);
	}
	else if (c) {
		process.env.NODE_ENV !== "production" && !v(c) && L("invalid props options", c);
		for (let e in c) {
			let t = E(e);
			if (Na(t)) {
				let n = c[e], r = l[t] = d(n) || h(n) ? { type: n } : s({}, n), i = r.type, a = !1, o = !0;
				if (d(i)) for (let e = 0; e < i.length; ++e) {
					let t = i[e], n = h(t) && t.name;
					if (n === "Boolean") {
						a = !0;
						break;
					}
					n === "String" && (o = !1);
				}
				else a = h(i) && i.name === "Boolean";
				r[0] = a, r[1] = o, (a || u(r, "default")) && f.push(t);
			}
		}
	}
	let m = [l, f];
	return v(e) && a.set(e, m), m;
}
function Na(e) {
	return e[0] !== "$" && !T(e) || (process.env.NODE_ENV !== "production" && L(`Invalid prop name: "${e}" is a reserved property.`), !1);
}
function Pa(e) {
	return e === null ? "null" : typeof e == "function" ? e.name || "" : typeof e == "object" && e.constructor && e.constructor.name || "";
}
function Fa(e, t, n) {
	let r = /* @__PURE__ */ F(t), i = n.propsOptions[0], a = Object.keys(e).map((e) => E(e));
	for (let e in i) {
		let t = i[e];
		t != null && Ia(e, r[e], t, process.env.NODE_ENV === "production" ? r : /* @__PURE__ */ Zt(r), !a.includes(e));
	}
}
function Ia(e, t, n, r, i) {
	let { type: a, required: o, validator: s, skipCheck: c } = n;
	if (o && i) {
		L("Missing required prop: \"" + e + "\"");
		return;
	}
	if (t != null || o) {
		if (a != null && a !== !0 && !c) {
			let n = !1, r = d(a) ? a : [a], i = [];
			for (let e = 0; e < r.length && !n; e++) {
				let { valid: a, expectedType: o } = Ra(t, r[e]);
				i.push(o || ""), n = a;
			}
			if (!n) {
				L(za(e, t, i));
				return;
			}
		}
		s && !s(t, r) && L("Invalid prop: custom validator check failed for prop \"" + e + "\".");
	}
}
var La = /* @__PURE__ */ e("String,Number,Boolean,Function,Symbol,BigInt");
function Ra(e, t) {
	let n, r = Pa(t);
	if (r === "null") n = e === null;
	else if (La(r)) {
		let i = typeof e;
		n = i === r.toLowerCase(), !n && i === "object" && (n = e instanceof t);
	} else n = r === "Object" ? v(e) : r === "Array" ? d(e) : e instanceof t;
	return {
		valid: n,
		expectedType: r
	};
}
function za(e, t, n) {
	if (n.length === 0) return `Prop type [] for prop "${e}" won't match anything. Did you mean to use type Array instead?`;
	let r = `Invalid prop: type check failed for prop "${e}". Expected ${n.map(ie).join(" | ")}`, i = n[0], a = S(t), o = Ba(t, i), s = Ba(t, a);
	return n.length === 1 && Va(i) && Ha(i, a) && (r += ` with value ${o}`), r += `, got ${a} `, Va(a) && (r += `with value ${s}.`), r;
}
function Ba(e, t) {
	return _(e) ? e.toString() : t === "String" ? `"${e}"` : t === "Number" ? `${Number(e)}` : `${e}`;
}
function Va(e) {
	return [
		"string",
		"number",
		"boolean"
	].some((t) => e.toLowerCase() === t);
}
function Ha(...e) {
	return e.every((e) => {
		let t = e.toLowerCase();
		return t !== "boolean" && t !== "symbol";
	});
}
var Ua = (e) => e === "_" || e === "_ctx" || e === "$stable", Wa = (e) => d(e) ? e.map(Ro) : [Ro(e)], Ga = (e, t, n) => {
	if (t._n) return t;
	let r = Ar((...r) => (process.env.NODE_ENV !== "production" && J && !(n === null && Dr) && !(n && n.root !== J.root) && L(`Slot "${e}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`), Wa(t(...r))), n);
	return r._c = !1, r;
}, Ka = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Ua(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = Ga(n, i, r);
		else if (i != null) {
			process.env.NODE_ENV !== "production" && L(`Non-function value encountered for slot "${n}". Prefer function slots for better performance.`);
			let e = Wa(i);
			t[n] = () => e;
		}
	}
}, qa = (e, t) => {
	process.env.NODE_ENV !== "production" && !di(e.vnode) && L("Non-function value encountered for default slot. Prefer function slots for better performance.");
	let n = Wa(t);
	e.slots.default = () => n;
}, Ja = (e, t, n) => {
	for (let r in t) (n || !Ua(r)) && (e[r] = t[r]);
}, Ya = (e, t, n) => {
	let r = e.slots = wa();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Ja(r, t, n), n && ce(r, "_", e, !0)) : Ka(t, r);
	} else t && qa(e, t);
}, Xa = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let t = n._;
		t ? process.env.NODE_ENV !== "production" && $n ? (Ja(a, n, r), dt(e, "set", "$slots")) : r && t === 1 ? o = !1 : Ja(a, n, r) : (o = !n.$stable, Ka(n, a)), s = n;
	} else n && (qa(e, n), s = { default: 1 });
	if (o) for (let e in a) !Ua(e) && s[e] == null && delete a[e];
}, Za, Qa;
function $a(e, t) {
	e.appContext.config.performance && to() && Qa.mark(`vue-${t}-${e.uid}`), process.env.NODE_ENV !== "production" && Cr(e, t, to() ? Qa.now() : Date.now());
}
function eo(e, t) {
	if (e.appContext.config.performance && to()) {
		let n = `vue-${t}-${e.uid}`, r = n + ":end", i = `<${ps(e, e.type)}> ${t}`;
		Qa.mark(r), Qa.measure(i, n, r), Qa.clearMeasures(i), Qa.clearMarks(n), Qa.clearMarks(r);
	}
	process.env.NODE_ENV !== "production" && wr(e, t, to() ? Qa.now() : Date.now());
}
function to() {
	return Za === void 0 && (typeof window < "u" && window.performance ? (Za = !0, Qa = window.performance) : Za = !1), Za;
}
function no() {
	let e = [];
	if (process.env.NODE_ENV !== "production" && e.length) {
		let t = e.length > 1;
		console.warn(`Feature flag${t ? "s" : ""} ${e.join(", ")} ${t ? "are" : "is"} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`);
	}
}
var ro = go;
function io(e) {
	return ao(e);
}
function ao(e, i) {
	no();
	let a = de();
	a.__VUE__ = !0, process.env.NODE_ENV !== "production" && hr(a.__VUE_DEVTOOLS_GLOBAL_HOOK__, a);
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = process.env.NODE_ENV !== "production" && $n ? !1 : !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Do(e, t) && (i = xe(e), k(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case _o:
				y(e, t, r, i);
				break;
			case H:
				b(e, t, r, i);
				break;
			case vo:
				e == null ? x(t, r, i, s) : process.env.NODE_ENV !== "production" && S(e, t, r, s);
				break;
			case V:
				ae(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? ee(e, t, r, i, a, o, s, c, l) : f & 6 ? oe(e, t, r, i, a, o, s, c, l) : f & 64 || f & 128 ? u.process(e, t, r, i, a, o, s, c, l, we) : process.env.NODE_ENV !== "production" && L("Invalid VNode type:", u, `(${typeof u})`);
		}
		d != null && a ? ci(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && ci(e.ref, null, o, e, !0);
	}, y = (e, t, n, r) => {
		if (e == null) o(t.el = u(t.children), n, r);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, r) => {
		e == null ? o(t.el = d(t.children || ""), n, r) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = (e, t, n, r) => {
		if (t.children !== e.children) {
			let i = h(e.anchor);
			w(e), [t.el, t.anchor] = _(t.children, n, i, r);
		} else t.el = e.el, t.anchor = e.anchor;
	}, C = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, w = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, ee = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) te(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), re(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, te = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && E(e.children, d, null, r, i, oo(e, a), s, u), _ && Mr(e, null, r, "created"), ne(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Ho(f, r, e);
		}
		process.env.NODE_ENV !== "production" && (ce(d, "__vnode", e, !0), ce(d, "__vueParentComponent", r, !0)), _ && Mr(e, null, r, "beforeMount");
		let v = co(i, g);
		if (v && g.beforeEnter(d), o(d, t, n), (f = m && m.onVnodeMounted) || v || _) {
			let t = process.env.NODE_ENV !== "production" && $n;
			ro(() => {
				let n;
				process.env.NODE_ENV !== "production" && (n = er(t));
				try {
					f && Ho(f, r, e), v && g.enter(d), _ && Mr(e, null, r, "mounted");
				} finally {
					process.env.NODE_ENV !== "production" && er(n);
				}
			}, i);
		}
	}, ne = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (process.env.NODE_ENV !== "production" && n.patchFlag > 0 && n.patchFlag & 2048 && (n = ha(n.children) || n), t === n || ho(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ne(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, E = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? zo(e[l]) : Ro(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, re = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el;
		process.env.NODE_ENV !== "production" && (l.__vnode = n);
		let { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && so(r, !1), (g = h.onVnodeBeforeUpdate) && Ho(g, r, n, e), f && Mr(n, e, r, "beforeUpdate"), r && so(r, !0), (process.env.NODE_ENV !== "production" && $n || d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length)) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? (D(e.dynamicChildren, d, l, r, i, oo(n, a), o), process.env.NODE_ENV !== "production" && lo(e, n)) : s || pe(e, n, l, null, r, i, oo(n, a), o, !1), u > 0) {
			if (u & 16) ie(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && ie(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && ro(() => {
			g && Ho(g, r, n, e), f && Mr(n, e, r, "updated");
		}, i);
	}, D = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === V || !Do(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, ie = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !T(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (T(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ae = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		process.env.NODE_ENV !== "production" && ($n || p & 2048) && (p = 0, l = !1, m = null), h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), E(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (D(e.dynamicChildren, m, n, i, a, s, c), process.env.NODE_ENV === "production" ? (t.key != null || i && t === i.subTree) && lo(e, t, !0) : lo(e, t)) : pe(e, t, n, f, i, a, s, c, l);
	}, oe = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : O(t, n, r, i, a, o, c) : le(e, t, c);
	}, O = (e, t, n, r, i, a, o) => {
		let s = e.component = Go(e, r, i);
		if (process.env.NODE_ENV !== "production" && s.type.__hmrId && rr(s), process.env.NODE_ENV !== "production" && (Sn(e), $a(s, "mount")), di(e) && (s.ctx.renderer = we), process.env.NODE_ENV !== "production" && $a(s, "init"), ts(s, !1, o), process.env.NODE_ENV !== "production" && eo(s, "init"), process.env.NODE_ENV !== "production" && $n && (e.el = null), s.asyncDep) {
			if (i && i.registerDep(s, ue, o), !e.el) {
				let r = s.subTree = K(H);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ue(s, e, t, n, i, a, o);
		process.env.NODE_ENV !== "production" && (Cn(), eo(s, "mount"));
	}, le = (e, t, n) => {
		let r = t.component = e.component;
		if (ya(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				process.env.NODE_ENV !== "production" && Sn(t), t.el = e.el, fe(r, t, n), process.env.NODE_ENV !== "production" && Cn();
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, ue = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = fo(e);
					if (n) {
						t && (t.el = c.el, fe(e, t, o)), n.asyncDep.then(() => {
							ro(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				process.env.NODE_ENV !== "production" && Sn(t || e.vnode), so(e, !1), t ? (t.el = c.el, fe(e, t, o)) : t = c, n && se(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Ho(d, s, t, c), so(e, !0), process.env.NODE_ENV !== "production" && $a(e, "render");
				let f = pa(e);
				process.env.NODE_ENV !== "production" && eo(e, "render");
				let p = e.subTree;
				e.subTree = f, process.env.NODE_ENV !== "production" && $a(e, "patch"), v(p, f, m(p.el), xe(p), e, i, a), process.env.NODE_ENV !== "production" && eo(e, "patch"), t.el = f.el, u === null && Sa(e, f.el), r && ro(r, i), (d = t.props && t.props.onVnodeUpdated) && ro(() => Ho(d, s, t, c), i), process.env.NODE_ENV !== "production" && yr(e), process.env.NODE_ENV !== "production" && Cn();
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = ui(t);
				if (so(e, !1), l && se(l), !m && (o = c && c.onVnodeBeforeMount) && Ho(o, d, t), so(e, !0), s && Ee) {
					let t = () => {
						process.env.NODE_ENV !== "production" && $a(e, "render"), e.subTree = pa(e), process.env.NODE_ENV !== "production" && eo(e, "render"), process.env.NODE_ENV !== "production" && $a(e, "hydrate"), Ee(s, e.subTree, e, i, null), process.env.NODE_ENV !== "production" && eo(e, "hydrate");
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0), process.env.NODE_ENV !== "production" && $a(e, "render");
					let o = e.subTree = pa(e);
					process.env.NODE_ENV !== "production" && eo(e, "render"), process.env.NODE_ENV !== "production" && $a(e, "patch"), v(null, o, n, r, e, i, a), process.env.NODE_ENV !== "production" && eo(e, "patch"), t.el = o.el;
				}
				if (u && ro(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					ro(() => Ho(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && ui(d.vnode) && d.vnode.shapeFlag & 256) && e.a && ro(e.a, i), e.isMounted = !0, process.env.NODE_ENV !== "production" && vr(e), t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new ze(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Gn(u), so(e, !0), process.env.NODE_ENV !== "production" && (c.onTrack = e.rtc ? (t) => se(e.rtc, t) : void 0, c.onTrigger = e.rtg ? (t) => se(e.rtg, t) : void 0), l();
	}, fe = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Oa(e, t.props, r, n), Xa(e, t.children, n), et(), Jn(e), tt();
	}, pe = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				he(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				me(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && be(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? he(l, d, n, r, i, a, o, s, c) : be(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && E(d, n, r, i, a, o, s, c));
	}, me = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? zo(t[p]) : Ro(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? be(e, a, o, !0, !1, f) : E(t, r, i, a, o, s, c, l, f);
	}, he = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? zo(t[u]) : Ro(t[u]);
			if (Do(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? zo(t[p]) : Ro(t[p]);
			if (Do(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? zo(t[u]) : Ro(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) k(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? zo(t[u]) : Ro(t[u]);
				e.key != null && (process.env.NODE_ENV !== "production" && g.has(e.key) && L("Duplicate keys found during update:", JSON.stringify(e.key), "Make sure keys are unique."), g.set(e.key, u));
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					k(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Do(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? k(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? uo(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || mo(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? ge(n, r, p, 2) : _--);
			}
		}
	}, ge = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			ge(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, we);
			return;
		}
		if (c === V) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) ge(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === vo) {
			C(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Ur] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), ro(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Ur];
					a._isLeaving && a[Ur](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, k = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (et(), ci(s, null, n, e, !0), tt()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !ui(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ho(_, t, e), u & 6) ye(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Mr(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, we, r) : l && !l.hasOnce && (a !== V || d > 0 && d & 64) ? be(l, t, n, !1, !0) : (a === V && d & 384 || !i && u & 16) && be(c, t, n), r && _e(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && ro(() => {
			_ && Ho(_, t, e), h && Mr(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, _e = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === V) {
			process.env.NODE_ENV !== "production" && e.patchFlag > 0 && e.patchFlag & 2048 && i && !i.persisted ? e.children.forEach((e) => {
				e.type === H ? s(e.el) : _e(e);
			}) : ve(n, r);
			return;
		}
		if (t === vo) {
			w(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, ve = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, ye = (e, t, n) => {
		process.env.NODE_ENV !== "production" && e.type.__hmrId && ir(e);
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		po(c), po(l), r && se(r), i.stop(), a ? (a.flags |= 8, k(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, k(o, e, t, n)), s && ro(s, t), ro(() => {
			e.isUnmounted = !0;
		}, t), process.env.NODE_ENV !== "production" && xr(e);
	}, be = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) k(e[o], t, n, r, i);
	}, xe = (e) => {
		if (e.shapeFlag & 6) return xe(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Vr];
		return n ? h(n) : t;
	}, Se = !1, Ce = (e, t, n) => {
		let r;
		e == null ? t._vnode && (k(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, Se ||= (Se = !0, Jn(r), Yn(), !1);
	}, we = {
		p: v,
		um: k,
		m: ge,
		r: _e,
		mt: O,
		mc: E,
		pc: pe,
		pbc: D,
		n: xe,
		o: e
	}, Te, Ee;
	return i && ([Te, Ee] = i(we)), {
		render: Ce,
		hydrate: Te,
		createApp: ia(Ce, Te)
	};
}
function oo({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function so({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function co(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function lo(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = zo(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && lo(t, a)), a.type === _o && (a.patchFlag === -1 && (a = i[e] = zo(a)), a.el = t.el), a.type === H && !a.el && (a.el = t.el), process.env.NODE_ENV !== "production" && a.el && (a.el.__vnode = a);
	}
}
function uo(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function fo(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : fo(t);
}
function po(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function mo(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? mo(t.subTree) : null;
}
var ho = (e) => e.__isSuspense;
function go(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : qn(e);
}
var V = /* @__PURE__ */ Symbol.for("v-fgt"), _o = /* @__PURE__ */ Symbol.for("v-txt"), H = /* @__PURE__ */ Symbol.for("v-cmt"), vo = /* @__PURE__ */ Symbol.for("v-stc"), yo = [], bo = null;
function U(e = !1) {
	yo.push(bo = e ? null : []);
}
function xo() {
	yo.pop(), bo = yo[yo.length - 1] || null;
}
var So = 1;
function Co(e, t = !1) {
	So += e, e < 0 && bo && t && (bo.hasOnce = !0);
}
function wo(e) {
	return e.dynamicChildren = So > 0 ? bo || n : null, xo(), So > 0 && bo && bo.push(e), e;
}
function W(e, t, n, r, i, a) {
	return wo(G(e, t, n, r, i, a, !0));
}
function To(e, t, n, r, i) {
	return wo(K(e, t, n, r, i, !0));
}
function Eo(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Do(e, t) {
	if (process.env.NODE_ENV !== "production" && t.shapeFlag & 6 && e.component) {
		let n = tr.get(t.type);
		if (n && n.has(e.component)) return e.shapeFlag &= -257, t.shapeFlag &= -513, !1;
	}
	return e.type === t.type && e.key === t.key;
}
var Oo = (...e) => Mo(...e), ko = ({ key: e }) => e ?? null, Ao = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ I(e) || h(e) ? {
	i: Dr,
	r: e,
	k: t,
	f: !!n
} : e);
function G(e, t = null, n = null, r = 0, i = null, a = e === V ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && ko(t),
		ref: t && Ao(t),
		scopeId: Or,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: Dr
	};
	if (s ? (Bo(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), process.env.NODE_ENV !== "production" && c.key !== c.key && L("VNode created with invalid key (NaN). VNode type:", c.type), process.env.NODE_ENV !== "production" && t && c.shapeFlag & 1) {
		let e = t.innerHTML == null ? t.textContent == null ? null : "textContent" : "innerHTML";
		e && jo(c.children) && L(`The \`${e}\` prop on <${c.type}> will override its children. Remove either the \`${e}\` prop or the children.`);
	}
	return So > 0 && !o && bo && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && bo.push(c), c;
}
function jo(e) {
	return g(e) ? e !== "" : d(e) ? e.length > 0 : !1;
}
var K = process.env.NODE_ENV === "production" ? Mo : Oo;
function Mo(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Oi) && (process.env.NODE_ENV !== "production" && !e && L(`Invalid vnode type when creating vnode: ${e}.`), e = H), Eo(e)) {
		let r = Po(e, t, !0);
		return n && Bo(r, n), So > 0 && !a && bo && (r.shapeFlag & 6 ? bo[bo.indexOf(e)] = r : bo.push(r)), r.patchFlag = -2, r;
	}
	if (ms(e) && (e = e.__vccOpts), t) {
		t = No(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = k(e)), v(n) && (/* @__PURE__ */ tn(n) && !d(n) && (n = s({}, n)), t.style = fe(n));
	}
	let o = g(e) ? 1 : ho(e) ? 128 : Hr(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return process.env.NODE_ENV !== "production" && o & 4 && /* @__PURE__ */ tn(e) && (e = /* @__PURE__ */ F(e), L("Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.", "\nComponent that was made reactive: ", e)), G(e, t, n, r, i, o, a, !0);
}
function No(e) {
	return e ? /* @__PURE__ */ tn(e) || Ta(e) ? s({}, e) : e : null;
}
function Po(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Vo(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ko(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(Ao(t)) : [a, Ao(t)] : Ao(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: process.env.NODE_ENV !== "production" && o === -1 && d(s) ? s.map(Fo) : s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== V ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Po(e.ssContent),
		ssFallback: e.ssFallback && Po(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && ni(u, c.clone(u)), u;
}
function Fo(e) {
	let t = Po(e);
	return d(e.children) && (t.children = e.children.map(Fo)), t;
}
function Io(e = " ", t = 0) {
	return K(_o, null, e, t);
}
function Lo(e, t) {
	let n = K(vo, null, e);
	return n.staticCount = t, n;
}
function q(e = "", t = !1) {
	return t ? (U(), To(H, null, e)) : K(H, null, e);
}
function Ro(e) {
	return e == null || typeof e == "boolean" ? K(H) : d(e) ? K(V, null, e.slice()) : Eo(e) ? zo(e) : K(_o, null, String(e));
}
function zo(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Po(e);
}
function Bo(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Bo(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Ta(t) ? t._ctx = Dr : r === 3 && Dr && (Dr.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			Bo(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Dr
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Io(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Vo(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = k([t.class, r.class]));
		else if (e === "style") t.style = fe([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ho(e, t, n, r = null) {
	Nn(e, t, 7, [n, r]);
}
var Uo = na(), Wo = 0;
function Go(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || Uo, o = {
		uid: Wo++,
		vnode: e,
		type: i,
		parent: n,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new Ie(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: n ? n.provides : Object.create(a.provides),
		ids: n ? n.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: Ma(i, a),
		emitsOptions: la(i, a),
		emit: null,
		emitted: null,
		propsDefaults: t,
		inheritAttrs: i.inheritAttrs,
		ctx: t,
		data: t,
		props: t,
		attrs: t,
		slots: t,
		refs: t,
		setupState: t,
		setupContext: null,
		suspense: r,
		suspenseId: r ? r.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return o.ctx = process.env.NODE_ENV === "production" ? { _: o } : Ii(o), o.root = n ? n.root : o, o.emit = sa.bind(null, o), e.ce && e.ce(o), o;
}
var J = null, Ko = () => J || Dr, qo, Jo;
{
	let e = de(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	qo = t("__VUE_INSTANCE_SETTERS__", (e) => J = e), Jo = t("__VUE_SSR_SETTERS__", (e) => es = e);
}
var Yo = (e) => {
	let t = J;
	return qo(e), e.scope.on(), () => {
		e.scope.off(), qo(t);
	};
}, Xo = () => {
	J && J.scope.off(), qo(null);
}, Zo = /* @__PURE__ */ e("slot,component");
function Qo(e, { isNativeTag: t }) {
	(Zo(e) || t(e)) && L("Do not use built-in or reserved HTML elements as component id: " + e);
}
function $o(e) {
	return e.vnode.shapeFlag & 4;
}
var es = !1;
function ts(e, t = !1, n = !1) {
	t && Jo(t);
	let { props: r, children: i } = e.vnode, a = $o(e);
	Ea(e, r, a, t), Ya(e, i, n || t);
	let o = a ? ns(e, t) : void 0;
	return t && Jo(!1), o;
}
function ns(e, t) {
	let n = e.type;
	if (process.env.NODE_ENV !== "production") {
		if (n.name && Qo(n.name, e.appContext.config), n.components) {
			let t = Object.keys(n.components);
			for (let n = 0; n < t.length; n++) Qo(t[n], e.appContext.config);
		}
		if (n.directives) {
			let e = Object.keys(n.directives);
			for (let t = 0; t < e.length; t++) jr(e[t]);
		}
		n.compilerOptions && is() && L("\"compilerOptions\" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.");
	}
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Fi), process.env.NODE_ENV !== "production" && Li(e);
	let { setup: r } = n;
	if (r) {
		et();
		let i = e.setupContext = r.length > 1 ? cs(e) : null, a = Yo(e), o = Mn(r, e, 0, [process.env.NODE_ENV === "production" ? e.props : /* @__PURE__ */ Zt(e.props), i]), s = y(o);
		if (tt(), a(), (s || e.sp) && !ui(e) && ii(e), s) {
			if (o.then(Xo, Xo), t) return o.then((n) => {
				Jo(!0);
				try {
					rs(e, n, t);
				} finally {
					Jo(!1);
				}
			}).catch((t) => {
				Pn(t, e, 0);
			});
			e.asyncDep = o, process.env.NODE_ENV !== "production" && !e.suspense && L(`Component <${ps(e, n)}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`);
		} else rs(e, o, t);
	} else as(e, t);
}
function rs(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) ? (process.env.NODE_ENV !== "production" && Eo(t) && L("setup() should not return VNodes directly - return a render function instead."), process.env.NODE_ENV !== "production" && (e.devtoolsRawSetupState = t), e.setupState = fn(t), process.env.NODE_ENV !== "production" && Ri(e)) : process.env.NODE_ENV !== "production" && t !== void 0 && L(`setup() should return an object. Received: ${t === null ? "null" : typeof t}`), as(e, n);
}
var is = () => !0;
function as(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
	{
		let t = Yo(e);
		et();
		try {
			Hi(e);
		} finally {
			tt(), t();
		}
	}
	process.env.NODE_ENV !== "production" && !i.render && e.render === r && !t && (i.template ? L("Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias \"vue\" to \"vue/dist/vue.esm-bundler.js\".") : L("Component is missing template or render function: ", i));
}
var os = process.env.NODE_ENV === "production" ? { get(e, t) {
	return N(e, "get", ""), e[t];
} } : {
	get(e, t) {
		return fa(), N(e, "get", ""), e[t];
	},
	set() {
		return L("setupContext.attrs is readonly."), !1;
	},
	deleteProperty() {
		return L("setupContext.attrs is readonly."), !1;
	}
};
function ss(e) {
	return new Proxy(e.slots, { get(t, n) {
		return N(e, "get", "$slots"), t[n];
	} });
}
function cs(e) {
	let t = (t) => {
		if (process.env.NODE_ENV !== "production" && (e.exposed && L("expose() should be called only once per setup()."), t != null)) {
			let e = typeof t;
			e === "object" && (d(t) ? e = "array" : /* @__PURE__ */ I(t) && (e = "ref")), e !== "object" && L(`expose() should be passed a plain object, received ${e}.`);
		}
		e.exposed = t || {};
	};
	if (process.env.NODE_ENV !== "production") {
		let n, r;
		return Object.freeze({
			get attrs() {
				return n ||= new Proxy(e.attrs, os);
			},
			get slots() {
				return r ||= ss(e);
			},
			get emit() {
				return (t, ...n) => e.emit(t, ...n);
			},
			expose: t
		});
	}
	return {
		attrs: new Proxy(e.attrs, os),
		slots: e.slots,
		emit: e.emit,
		expose: t
	};
}
function ls(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(fn(nn(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Mi) return Mi[n](e);
		},
		has(e, t) {
			return t in e || t in Mi;
		}
	}) : e.proxy;
}
var us = /(?:^|[-_])\w/g, ds = (e) => e.replace(us, (e) => e.toUpperCase()).replace(/[-_]/g, "");
function fs(e, t = !0) {
	return h(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function ps(e, t, n = !1) {
	let r = fs(t);
	if (!r && t.__file) {
		let e = t.__file.match(/([^/\\]+)\.\w+$/);
		e && (r = e[1]);
	}
	if (!r && e) {
		let n = (e) => {
			for (let n in e) if (e[n] === t) return n;
		};
		r = n(e.components) || e.parent && n(e.parent.type.components) || n(e.appContext.components);
	}
	return r ? ds(r) : n ? "App" : "Anonymous";
}
function ms(e) {
	return h(e) && "__vccOpts" in e;
}
var Y = (e, t) => {
	let n = /* @__PURE__ */ mn(e, t, es);
	if (process.env.NODE_ENV !== "production") {
		let e = Ko();
		e && e.appContext.config.warnRecursiveComputed && (n._warnRecursive = !0);
	}
	return n;
};
function hs(e, t, n) {
	try {
		Co(-1);
		let r = arguments.length;
		return r === 2 ? v(t) && !d(t) ? Eo(t) ? K(e, null, [t]) : K(e, t) : K(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Eo(n) && (n = [n]), K(e, t, n));
	} finally {
		Co(1);
	}
}
function gs() {
	if (process.env.NODE_ENV === "production" || typeof window > "u") return;
	let e = { style: "color:#3ba776" }, n = { style: "color:#1677ff" }, r = { style: "color:#f5222d" }, i = { style: "color:#eb2f96" }, a = {
		__vue_custom_formatter: !0,
		header(t) {
			if (!v(t)) return null;
			if (t.__isVue) return [
				"div",
				e,
				"VueInstance"
			];
			if (/* @__PURE__ */ I(t)) {
				et();
				let n = t.value;
				return tt(), [
					"div",
					{},
					[
						"span",
						e,
						p(t)
					],
					"<",
					l(n),
					">"
				];
			}
			return /* @__PURE__ */ $t(t) ? [
				"div",
				{},
				[
					"span",
					e,
					/* @__PURE__ */ P(t) ? "ShallowReactive" : "Reactive"
				],
				"<",
				l(t),
				`>${/* @__PURE__ */ en(t) ? " (readonly)" : ""}`
			] : /* @__PURE__ */ en(t) ? [
				"div",
				{},
				[
					"span",
					e,
					/* @__PURE__ */ P(t) ? "ShallowReadonly" : "Readonly"
				],
				"<",
				l(t),
				">"
			] : null;
		},
		hasBody(e) {
			return e && e.__isVue;
		},
		body(e) {
			if (e && e.__isVue) return [
				"div",
				{},
				...o(e.$)
			];
		}
	};
	function o(e) {
		let n = [];
		e.type.props && e.props && n.push(c("props", /* @__PURE__ */ F(e.props))), e.setupState !== t && n.push(c("setup", e.setupState)), e.data !== t && n.push(c("data", /* @__PURE__ */ F(e.data)));
		let r = u(e, "computed");
		r && n.push(c("computed", r));
		let a = u(e, "inject");
		return a && n.push(c("injected", a)), n.push([
			"div",
			{},
			[
				"span",
				{ style: i.style + ";opacity:0.66" },
				"$ (internal): "
			],
			["object", { object: e }]
		]), n;
	}
	function c(e, t) {
		return t = s({}, t), Object.keys(t).length ? [
			"div",
			{ style: "line-height:1.25em;margin-bottom:0.6em" },
			[
				"div",
				{ style: "color:#476582" },
				e
			],
			[
				"div",
				{ style: "padding-left:1.25em" },
				...Object.keys(t).map((e) => [
					"div",
					{},
					[
						"span",
						i,
						e + ": "
					],
					l(t[e], !1)
				])
			]
		] : ["span", {}];
	}
	function l(e, t = !0) {
		return typeof e == "number" ? [
			"span",
			n,
			e
		] : typeof e == "string" ? [
			"span",
			r,
			JSON.stringify(e)
		] : typeof e == "boolean" ? [
			"span",
			i,
			e
		] : v(e) ? ["object", { object: t ? /* @__PURE__ */ F(e) : e }] : [
			"span",
			r,
			String(e)
		];
	}
	function u(e, t) {
		let n = e.type;
		if (h(n)) return;
		let r = {};
		for (let i in e.ctx) f(n, i, t) && (r[i] = e.ctx[i]);
		return r;
	}
	function f(e, t, n) {
		let r = e[n];
		if (d(r) && r.includes(t) || v(r) && t in r || e.extends && f(e.extends, t, n) || e.mixins && e.mixins.some((e) => f(e, t, n))) return !0;
	}
	function p(e) {
		return /* @__PURE__ */ P(e) ? "ShallowRef" : e.effect ? "ComputedRef" : "Ref";
	}
	window.devtoolsFormatters ? window.devtoolsFormatters.push(a) : window.devtoolsFormatters = [a];
}
var _s = "3.5.43", vs = process.env.NODE_ENV === "production" ? r : L;
process.env.NODE_ENV, process.env.NODE_ENV;
//#endregion
//#region node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var ys = void 0, bs = typeof window < "u" && window.trustedTypes;
if (bs) try {
	ys = /* @__PURE__ */ bs.createPolicy("vue", { createHTML: (e) => e });
} catch (e) {
	process.env.NODE_ENV !== "production" && vs(`Error creating trusted types policy: ${e}`);
}
var xs = ys ? (e) => ys.createHTML(e) : (e) => e, Ss = "http://www.w3.org/2000/svg", Cs = "http://www.w3.org/1998/Math/MathML", ws = typeof document < "u" ? document : null, Ts = ws && /* @__PURE__ */ ws.createElement("template"), Es = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? ws.createElementNS(Ss, e) : t === "mathml" ? ws.createElementNS(Cs, e) : n ? ws.createElement(e, { is: n }) : ws.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => ws.createTextNode(e),
	createComment: (e) => ws.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => ws.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Ts.innerHTML = xs(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ts.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ds = "transition", Os = "animation", ks = /* @__PURE__ */ Symbol("_vtc"), As = {
	name: String,
	type: String,
	css: {
		type: Boolean,
		default: !0
	},
	duration: [
		String,
		Number,
		Object
	],
	enterFromClass: String,
	enterActiveClass: String,
	enterToClass: String,
	appearFromClass: String,
	appearActiveClass: String,
	appearToClass: String,
	leaveFromClass: String,
	leaveActiveClass: String,
	leaveToClass: String
}, js = /* @__PURE__ */ s({}, qr, As), Ms = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = js, e))((e, { slots: t }) => hs(Zr, Fs(e), t)), Ns = (e, t = []) => {
	d(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, Ps = (e) => e ? d(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function Fs(e) {
	let t = {};
	for (let n in e) n in As || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: c = `${n}-enter-to`, appearFromClass: l = a, appearActiveClass: u = o, appearToClass: d = c, leaveFromClass: f = `${n}-leave-from`, leaveActiveClass: p = `${n}-leave-active`, leaveToClass: m = `${n}-leave-to` } = e, h = Is(i), g = h && h[0], _ = h && h[1], { onBeforeEnter: v, onEnter: y, onEnterCancelled: b, onLeave: x, onLeaveCancelled: S, onBeforeAppear: C = v, onAppear: w = y, onAppearCancelled: T = b } = t, ee = (e, t, n, r) => {
		e._enterCancelled = r, zs(e, t ? d : c), zs(e, t ? u : o), n && n();
	}, te = (e, t) => {
		e._isLeaving = !1, zs(e, f), zs(e, m), zs(e, p), t && t();
	}, ne = (e) => (t, n) => {
		let i = e ? w : y, o = () => ee(t, e, n);
		Ns(i, [t, o]), Bs(() => {
			zs(t, e ? l : a), Rs(t, e ? d : c), Ps(i) || Hs(t, r, g, o);
		});
	};
	return s(t, {
		onBeforeEnter(e) {
			Ns(v, [e]), Rs(e, a), Rs(e, o);
		},
		onBeforeAppear(e) {
			Ns(C, [e]), Rs(e, l), Rs(e, u);
		},
		onEnter: ne(!1),
		onAppear: ne(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => te(e, t);
			Rs(e, f), e._enterCancelled ? (Rs(e, p), Ks(e)) : (Ks(e), Rs(e, p)), Bs(() => {
				e._isLeaving && (zs(e, f), Rs(e, m), Ps(x) || Hs(e, r, _, n));
			}), Ns(x, [e, n]);
		},
		onEnterCancelled(e) {
			ee(e, !1, void 0, !0), Ns(b, [e]);
		},
		onAppearCancelled(e) {
			ee(e, !0, void 0, !0), Ns(T, [e]);
		},
		onLeaveCancelled(e) {
			te(e), Ns(S, [e]);
		}
	});
}
function Is(e) {
	if (e == null) return null;
	if (v(e)) return [Ls(e.enter), Ls(e.leave)];
	{
		let t = Ls(e);
		return [t, t];
	}
}
function Ls(e) {
	let t = le(e);
	return process.env.NODE_ENV !== "production" && An(t, "<transition> explicit duration"), t;
}
function Rs(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[ks] || (e[ks] = /* @__PURE__ */ new Set())).add(t);
}
function zs(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[ks];
	n && (n.delete(t), n.size || (e[ks] = void 0));
}
function Bs(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var Vs = 0;
function Hs(e, t, n, r) {
	let i = e._endId = ++Vs, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = Us(e, t);
	if (!o) return r();
	let l = o + "end", u = 0, d = () => {
		e.removeEventListener(l, f), a();
	}, f = (t) => {
		t.target === e && ++u >= c && d();
	};
	setTimeout(() => {
		u < c && d();
	}, s + 1), e.addEventListener(l, f);
}
function Us(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${Ds}Delay`), a = r(`${Ds}Duration`), o = Ws(i, a), s = r(`${Os}Delay`), c = r(`${Os}Duration`), l = Ws(s, c), u = null, d = 0, f = 0;
	t === Ds ? o > 0 && (u = Ds, d = o, f = a.length) : t === Os ? l > 0 && (u = Os, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? Ds : Os : null, f = u ? u === Ds ? a.length : c.length : 0);
	let p = u === Ds && /\b(?:transform|all)(?:,|$)/.test(r(`${Ds}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function Ws(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => Gs(t) + Gs(e[n])));
}
function Gs(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function Ks(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function qs(e, t, n) {
	let r = e[ks];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Js = /* @__PURE__ */ Symbol("_vod"), Ys = /* @__PURE__ */ Symbol("_vsh"), Xs = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[Js] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Zs(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Zs(e, !0), r.enter(e)) : r.leave(e, () => {
			Zs(e, !1);
		}) : Zs(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Zs(e, t);
	}
};
function Zs(e, t) {
	e.style.display = t ? e[Js] : "none", e[Ys] = !t;
}
var Qs = /* @__PURE__ */ Symbol(process.env.NODE_ENV === "production" ? "" : "CSS_VAR_TEXT"), $s = /(?:^|;)\s*display\s*:/;
function ec(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? rc(r, t, "");
			}
			else for (let e in t) n[e] ?? rc(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? rc(r, i, "") : sc(e, i, !g(t) && t ? t[i] : void 0, o) || rc(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Qs];
			e && (n += ";" + e), r.cssText = n, a = $s.test(n);
		}
	} else t && e.removeAttribute("style");
	Js in e && (e[Js] = a ? r.display : "", e[Ys] && (r.display = "none"));
}
var tc = /[^\\];\s*$/, nc = /\s*!important$/;
function rc(e, t, n) {
	if (d(n)) n.forEach((n) => rc(e, t, n));
	else if (n ??= "", process.env.NODE_ENV !== "production" && tc.test(n) && vs(`Unexpected semicolon at the end of '${t}' style value: '${n}'`), t.startsWith("--")) nc.test(n) ? e.setProperty(t, n.replace(nc, ""), "important") : e.setProperty(t, n);
	else {
		let r = oc(e, t);
		nc.test(n) ? e.setProperty(D(r), n.replace(nc, ""), "important") : e[r] = n;
	}
}
var ic = [
	"Webkit",
	"Moz",
	"ms"
], ac = {};
function oc(e, t) {
	let n = ac[t];
	if (n) return n;
	let r = E(t);
	if (r !== "filter" && r in e) return ac[t] = r;
	r = ie(r);
	for (let n = 0; n < ic.length; n++) {
		let i = ic[n] + r;
		if (i in e) return ac[t] = i;
	}
	return t;
}
function sc(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var cc = "http://www.w3.org/1999/xlink";
function lc(e, t, n, r, i, a = we(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(cc, t.slice(6, t.length)) : e.setAttributeNS(cc, t, n) : n == null || a && !Te(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function uc(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? xs(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		(r !== i || !("_value" in e)) && (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = Te(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch (e) {
		process.env.NODE_ENV !== "production" && !o && vs(`Failed setting prop "${t}" on <${a.toLowerCase()}>: value ${n} is invalid.`, e);
	}
	o && e.removeAttribute(i || t);
}
function dc(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function fc(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var pc = /* @__PURE__ */ Symbol("_vei");
function mc(e, t, n, r, i = null) {
	let a = e[pc] || (e[pc] = {}), o = a[t];
	if (r && o) o.value = process.env.NODE_ENV === "production" ? r : Sc(r, t);
	else {
		let [n, s] = _c(t);
		r ? dc(e, n, a[t] = xc(process.env.NODE_ENV === "production" ? r : Sc(r, t), i), s) : o && (fc(e, n, o, s), a[t] = void 0);
	}
}
var hc = /(Once|Passive|Capture)$/, gc = /^on:?(?:Once|Passive|Capture)$/;
function _c(e) {
	let t, n;
	for (; (n = e.match(hc)) && !gc.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : D(e.slice(2)), t];
}
var vc = 0, yc = /* @__PURE__ */ Promise.resolve(), bc = () => vc ||= (yc.then(() => vc = 0), Date.now());
function xc(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (d(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && Nn(e, t, 5, a);
			}
		} else Nn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = bc(), n;
}
function Sc(e, t) {
	return h(e) || d(e) ? e : (vs(`Wrong type passed as event handler to ${t} - did you forget @ or : in front of your prop?
Expected function or array of functions, received type ${typeof e}.`), r);
}
var Cc = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, wc = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? qs(e, r, c) : t === "style" ? ec(e, n, r) : a(t) ? o(t) || mc(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Tc(e, t, r, c)) ? (uc(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && lc(e, t, r, c, s, t !== "value")) : e._isVueCE && (Ec(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? uc(e, E(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), lc(e, t, r, c));
};
function Tc(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Cc(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Cc(t) && g(n) ? !1 : t in e;
}
function Ec(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = E(t);
	return Array.isArray(n) ? n.some((e) => E(e) === r) : Object.keys(n).some((e) => E(e) === r);
}
var Dc = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => se(t, e) : t;
};
function Oc(e) {
	e.target.composing = !0;
}
function kc(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Ac = /* @__PURE__ */ Symbol("_assign"), jc = /* @__PURE__ */ Symbol("_initialValue");
function Mc(e, t, n) {
	return t && (e = e.trim()), n && (e = O(e)), e;
}
var Nc = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[jc] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[jc] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Ac] = Dc(i);
		let a = r || i.props && i.props.type === "number";
		dc(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Ac](Mc(e.value, n, a));
		}), (n || a) && dc(e, "change", () => {
			e.value = Mc(e.value, n, a);
		}), t || (dc(e, "compositionstart", Oc), dc(e, "compositionend", kc), dc(e, "change", kc));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[jc];
		delete e[jc], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Ac](Mc(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Ac] = Dc(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? O(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Pc = {
	deep: !0,
	created(e, t, n) {
		e[Ac] = Dc(n), dc(e, "change", () => {
			let t = e._modelValue, n = Bc(e), r = e.checked, i = e[Ac];
			if (d(t)) {
				let e = je(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (p(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(Vc(e, r));
		});
	},
	mounted: Fc,
	beforeUpdate(e, t, n) {
		e[Ac] = Dc(n), Fc(e, t, n);
	}
};
function Fc(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (d(t)) i = je(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Ae(t, Vc(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Ic = {
	created(e, { value: t }, n) {
		e.checked = Ae(t, n.props.value), e[Ac] = Dc(n), dc(e, "change", () => {
			e[Ac](Bc(e));
		});
	},
	beforeUpdate(e, { value: t, oldValue: n }, r) {
		e[Ac] = Dc(r), t !== n && (e.checked = Ae(t, r.props.value));
	}
}, Lc = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, dc(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? O(Bc(e)) : Bc(e)), r = e.multiple, i = r ? p(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? d(i) ? t.slice() : t : i];
			try {
				e[Ac](i);
			} finally {
				Un(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Ac] = Dc(r);
	},
	mounted(e, { value: t }) {
		zc(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Ac] = Dc(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !Rc(t, n[1], n[0])) && zc(e, t);
	}
};
function Rc(e, t, n) {
	if (!n || d(e)) return Ae(e, t);
	if (p(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function zc(e, t) {
	let n = e.multiple, r = d(t);
	if (n && !r && !p(t)) {
		process.env.NODE_ENV !== "production" && vs(`<select multiple v-model> expects an Array or Set value for its binding, but got ${Object.prototype.toString.call(t).slice(8, -1)}.`);
		return;
	}
	for (let i = 0, a = e.options.length; i < a; i++) {
		let a = e.options[i], o = Bc(a);
		if (n) {
			if (r) {
				let e = typeof o;
				a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : je(t, o) > -1;
			} else a.selected = t.has(o);
		} else if (Ae(Bc(a), t)) {
			e.selectedIndex !== i && (e.selectedIndex = i);
			return;
		}
	}
	!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
}
function Bc(e) {
	return "_value" in e ? e._value : e.value;
}
function Vc(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var Hc = {
	created(e, t, n) {
		Wc(e, t, n, null, "created");
	},
	mounted(e, t, n) {
		Wc(e, t, n, null, "mounted");
	},
	beforeUpdate(e, t, n, r) {
		Wc(e, t, n, r, "beforeUpdate");
	},
	updated(e, t, n, r) {
		Wc(e, t, n, r, "updated");
	}
};
function Uc(e, t) {
	switch (e) {
		case "SELECT": return Lc;
		case "TEXTAREA": return Nc;
		default: switch (t) {
			case "checkbox": return Pc;
			case "radio": return Ic;
			default: return Nc;
		}
	}
}
function Wc(e, t, n, r, i) {
	let a = Uc(e.tagName, n.props && n.props.type)[i];
	a && a(e, t, n, r);
}
var Gc = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], Kc = {
	stop: (e) => e.stopPropagation(),
	prevent: (e) => e.preventDefault(),
	self: (e) => e.target !== e.currentTarget,
	ctrl: (e) => !e.ctrlKey,
	shift: (e) => !e.shiftKey,
	alt: (e) => !e.altKey,
	meta: (e) => !e.metaKey,
	left: (e) => "button" in e && e.button !== 0,
	middle: (e) => "button" in e && e.button !== 1,
	right: (e) => "button" in e && e.button !== 2,
	exact: (e, t) => Gc.some((n) => e[`${n}Key`] && !t.includes(n))
}, qc = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = Kc[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, Jc = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, Yc = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = D(n.key);
		if (t.some((e) => e === r || Jc[e] === r)) return e(n);
	}));
}, Xc = /* @__PURE__ */ s({ patchProp: wc }, Es), Zc;
function Qc() {
	return Zc ||= io(Xc);
}
var $c = ((...e) => {
	let t = Qc().createApp(...e);
	process.env.NODE_ENV !== "production" && (tl(t), nl(t));
	let { mount: n } = t;
	return t.mount = (e) => {
		let r = rl(e);
		if (!r) return;
		let i = t._component;
		!h(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, el(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function el(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function tl(e) {
	Object.defineProperty(e.config, "isNativeTag", {
		value: (e) => be(e) || xe(e) || Se(e),
		writable: !1
	});
}
function nl(e) {
	if (is()) {
		let t = e.config.isCustomElement;
		Object.defineProperty(e.config, "isCustomElement", {
			get() {
				return t;
			},
			set() {
				vs("The `isCustomElement` config option is deprecated. Use `compilerOptions.isCustomElement` instead.");
			}
		});
		let n = e.config.compilerOptions, r = "The `compilerOptions` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka \"full build\"). Since you are using the runtime-only build, `compilerOptions` must be passed to `@vue/compiler-dom` in the build setup instead.\n- For vue-loader: pass it via vue-loader's `compilerOptions` loader option.\n- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader\n- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-sfc";
		Object.defineProperty(e.config, "compilerOptions", {
			get() {
				return vs(r), n;
			},
			set() {
				vs(r);
			}
		});
	}
}
function rl(e) {
	if (g(e)) {
		let t = document.querySelector(e);
		return process.env.NODE_ENV !== "production" && !t && vs(`Failed to mount app: mount target selector "${e}" returned null.`), t;
	}
	return process.env.NODE_ENV !== "production" && window.ShadowRoot && e instanceof window.ShadowRoot && e.mode === "closed" && vs("mounting on a ShadowRoot with `{mode: \"closed\"}` may lead to unpredictable bugs"), e;
}
//#endregion
//#region node_modules/vue/dist/vue.runtime.esm-bundler.js
function il() {
	gs();
}
process.env.NODE_ENV !== "production" && il();
//#endregion
//#region \0plugin-vue:export-helper
var al = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, ol = {
	key: 0,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, sl = {
	key: 1,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, cl = {
	key: 2,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, ll = {
	key: 3,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, ul = {
	key: 4,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, dl = {
	key: 5,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, fl = {
	key: 6,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, pl = {
	key: 7,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, ml = {
	key: 8,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, hl = {
	key: 9,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, gl = {
	key: 10,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, _l = {
	key: 11,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, vl = {
	key: 12,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, yl = {
	key: 13,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, bl = {
	key: 14,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, xl = {
	key: 15,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Sl = {
	key: 16,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	class: "xy-icon"
}, X = /*#__PURE__*/ al({
	__name: "Icons",
	props: { name: {
		type: String,
		required: !0
	} },
	setup(e) {
		return (t, n) => e.name === "swords" ? (U(), W("svg", ol, [...n[0] ||= [Lo("<polyline points=\"14.5 17.5 3 6 3 3 6 3 17.5 14.5\" data-v-41f5e159></polyline><line x1=\"13\" y1=\"19\" x2=\"19\" y2=\"13\" data-v-41f5e159></line><line x1=\"16\" y1=\"16\" x2=\"20\" y2=\"20\" data-v-41f5e159></line><line x1=\"19\" y1=\"21\" x2=\"21\" y2=\"19\" data-v-41f5e159></line><polyline points=\"14.5 6.5 18 3 21 3 21 6 17.5 9.5\" data-v-41f5e159></polyline><line x1=\"5\" y1=\"14\" x2=\"9\" y2=\"18\" data-v-41f5e159></line><line x1=\"7\" y1=\"17\" x2=\"4\" y2=\"20\" data-v-41f5e159></line><line x1=\"3\" y1=\"19\" x2=\"5\" y2=\"21\" data-v-41f5e159></line>", 8)]])) : e.name === "settings" ? (U(), W("svg", sl, [...n[1] ||= [G("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		}, null, -1), G("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" }, null, -1)]])) : e.name === "scroll" ? (U(), W("svg", cl, [...n[2] ||= [G("path", { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" }, null, -1)]])) : e.name === "search" ? (U(), W("svg", ll, [...n[3] ||= [G("circle", {
			cx: "11",
			cy: "11",
			r: "8"
		}, null, -1), G("line", {
			x1: "21",
			y1: "21",
			x2: "16.65",
			y2: "16.65"
		}, null, -1)]])) : e.name === "close" ? (U(), W("svg", ul, [...n[4] ||= [G("line", {
			x1: "18",
			y1: "6",
			x2: "6",
			y2: "18"
		}, null, -1), G("line", {
			x1: "6",
			y1: "6",
			x2: "18",
			y2: "18"
		}, null, -1)]])) : e.name === "play" ? (U(), W("svg", dl, [...n[5] ||= [G("polygon", { points: "5 3 19 12 5 21 5 3" }, null, -1)]])) : e.name === "next" ? (U(), W("svg", fl, [...n[6] ||= [G("polygon", { points: "5 4 15 12 5 20 5 4" }, null, -1), G("line", {
			x1: "19",
			y1: "5",
			x2: "19",
			y2: "19"
		}, null, -1)]])) : e.name === "stop" ? (U(), W("svg", pl, [...n[7] ||= [G("rect", {
			x: "4",
			y: "4",
			width: "16",
			height: "16",
			rx: "2"
		}, null, -1)]])) : e.name === "refresh" ? (U(), W("svg", ml, [...n[8] ||= [G("polyline", { points: "23 4 23 10 17 10" }, null, -1), G("path", { d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10" }, null, -1)]])) : e.name === "send" ? (U(), W("svg", hl, [...n[9] ||= [G("line", {
			x1: "22",
			y1: "2",
			x2: "11",
			y2: "13"
		}, null, -1), G("polygon", { points: "22 2 15 22 11 13 2 9 22 2" }, null, -1)]])) : e.name === "lock" ? (U(), W("svg", gl, [...n[10] ||= [G("rect", {
			x: "3",
			y: "11",
			width: "18",
			height: "11",
			rx: "2",
			ry: "2"
		}, null, -1), G("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }, null, -1)]])) : e.name === "sparkles" ? (U(), W("svg", _l, [...n[11] ||= [G("path", { d: "m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" }, null, -1)]])) : e.name === "copy" ? (U(), W("svg", vl, [...n[12] ||= [G("rect", {
			width: "14",
			height: "14",
			x: "8",
			y: "8",
			rx: "2",
			ry: "2"
		}, null, -1), G("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }, null, -1)]])) : e.name === "check" ? (U(), W("svg", yl, [...n[13] ||= [G("polyline", { points: "20 6 9 17 4 12" }, null, -1)]])) : e.name === "eye" ? (U(), W("svg", bl, [...n[14] ||= [G("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }, null, -1), G("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		}, null, -1)]])) : e.name === "eye-off" ? (U(), W("svg", xl, [...n[15] ||= [G("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }, null, -1), G("line", {
			x1: "1",
			y1: "1",
			x2: "23",
			y2: "23"
		}, null, -1)]])) : (U(), W("svg", Sl, [...n[16] ||= [G("circle", {
			cx: "12",
			cy: "12",
			r: "10"
		}, null, -1)]]));
	}
}, [["__scopeId", "data-v-41f5e159"]]), Cl = { class: "xy-header" }, wl = { class: "xy-header-left" }, Tl = { class: "xy-header-titles" }, El = { class: "xy-kicker" }, Dl = ["title"], Ol = { class: "xy-title" }, kl = { class: "xy-title-text" }, Al = {
	key: 0,
	class: "xy-round-seal"
}, jl = { class: "xy-subtitle" }, Ml = { class: "xy-nav-tabs" }, Nl = ["onClick"], Pl = {
	key: 0,
	class: "xy-tab-badge"
}, Fl = { class: "xy-header-right" }, Il = { class: "xy-phase-name" }, Ll = { class: "xy-meta-tag" }, Rl = { class: "xy-meta-mode" }, zl = { class: "xy-meta-ver" }, Bl = /*#__PURE__*/ al({
	__name: "StageHeader",
	props: {
		scene: {
			type: Object,
			default: () => ({})
		},
		semanticState: {
			type: Object,
			default: () => ({})
		},
		round: {
			type: Number,
			default: 0
		},
		version: {
			type: Number,
			default: 1
		},
		phase: {
			type: String,
			default: "idle"
		},
		scope: {
			type: Object,
			default: () => ({
				chatId: "",
				branchId: ""
			})
		},
		currentTab: {
			type: String,
			default: "workbench"
		},
		adjudicatorMode: {
			type: String,
			default: "unconfigured"
		},
		logCount: {
			type: Number,
			default: 0
		}
	},
	emits: ["update:tab", "close"],
	setup(e) {
		let t = e, n = [
			{
				id: "workbench",
				label: "战场对决",
				icon: "swords"
			},
			{
				id: "settings",
				label: "独立机枢",
				icon: "settings"
			},
			{
				id: "data",
				label: "演武经卷",
				icon: "scroll"
			},
			{
				id: "developer",
				label: "天道秘录",
				icon: "search"
			}
		], r = {
			idle: "待战 (IDLE)",
			awaiting_player: "玩家决策中",
			judging: "天道裁定中…",
			committed: "裁定已确立",
			narrating: "正文演进中…",
			awaiting_next: "待启下一回合",
			ended: "战局已终",
			rewrite: "重写裁定记录"
		}, i = Y(() => r[t.phase] || t.phase), a = Y(() => ({
			http: "真实模型",
			mock: "离线演示",
			main_story: "主剧情桥接",
			packet: "场景包",
			unconfigured: "未配模型"
		})[t.adjudicatorMode] || t.adjudicatorMode), o = Y(() => {
			let e = t.semanticState.压制 || t.semanticState.control || "";
			return e.includes("主角") || e.includes("胜") ? "tone-player" : e.includes("敌") || e.includes("劣") ? "tone-enemy" : "tone-neutral";
		});
		return (t, r) => (U(), W("header", Cl, [
			G("div", wl, [r[7] ||= G("div", { class: "xy-brand-seal" }, [G("span", { class: "xy-seal-symbol" }, "弦")], -1), G("div", Tl, [
				G("div", El, [
					r[1] ||= G("span", null, "XY BATTLE SYSTEM", -1),
					r[2] ||= G("span", { class: "xy-kicker-dot" }, "·", -1),
					r[3] ||= G("span", null, "叠浪玄潮决", -1),
					r[4] ||= G("span", { class: "xy-kicker-dot" }, "·", -1),
					G("span", {
						class: "xy-scope-pill",
						title: "作用域: " + e.scope.chatId + " / " + e.scope.branchId
					}, A(e.scope.chatId) + " / " + A(e.scope.branchId), 9, Dl)
				]),
				G("h1", Ol, [G("span", kl, A(e.scene.location || "待定战场"), 1), e.round > 0 ? (U(), W("span", Al, "第 " + A(e.round) + " 回合", 1)) : q("", !0)]),
				G("p", jl, [
					G("span", null, A(e.scene.time || "时辰未定"), 1),
					r[5] ||= G("span", { class: "xy-sep" }, "|", -1),
					G("span", null, A(e.scene.initiative || "均势先发"), 1),
					r[6] ||= G("span", { class: "xy-sep" }, "|", -1),
					G("span", { class: k(["xy-control-state", o.value]) }, A(e.semanticState.压制 || e.semanticState.control || "均势"), 3)
				])
			])]),
			G("nav", Ml, [(U(), W(V, null, B(n, (n) => G("button", {
				key: n.id,
				class: k(["xy-tab-btn", { active: e.currentTab === n.id }]),
				onClick: (e) => t.$emit("update:tab", n.id)
			}, [
				K(X, {
					name: n.icon,
					class: "xy-tab-icon"
				}, null, 8, ["name"]),
				G("span", null, A(n.label), 1),
				n.id === "developer" && e.logCount > 0 ? (U(), W("span", Pl, A(e.logCount), 1)) : q("", !0)
			], 10, Nl)), 64))]),
			G("div", Fl, [
				G("div", { class: k(["xy-phase-indicator", "phase-" + e.phase]) }, [r[8] ||= G("span", { class: "xy-phase-pulse" }, null, -1), G("span", Il, A(i.value), 1)], 2),
				G("div", Ll, [G("span", Rl, A(a.value), 1), G("span", zl, "v" + A(e.version), 1)]),
				G("button", {
					class: "xy-close-btn",
					onClick: r[0] ||= (e) => t.$emit("close"),
					"aria-label": "关闭工作台",
					title: "关闭 (Esc)"
				}, [K(X, { name: "close" })])
			])
		]));
	}
}, [["__scopeId", "data-v-cd4538e3"]]), Vl = {
	class: "xy-atmosphere",
	"aria-hidden": "true"
}, Hl = /*#__PURE__*/ al({
	__name: "AtmosphereBackground",
	setup(e) {
		return (e, t) => (U(), W("div", Vl, [...t[0] ||= [Lo("<div class=\"xy-water-mist\" data-v-a4741ffe></div><svg class=\"xy-string-canvas\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\" viewBox=\"0 0 1440 800\" data-v-a4741ffe><defs data-v-a4741ffe><linearGradient id=\"stringGrad1\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\" data-v-a4741ffe><stop offset=\"0%\" stop-color=\"#38bdf8\" stop-opacity=\"0.02\" data-v-a4741ffe></stop><stop offset=\"35%\" stop-color=\"#38bdf8\" stop-opacity=\"0.25\" data-v-a4741ffe></stop><stop offset=\"65%\" stop-color=\"#2dd4bf\" stop-opacity=\"0.2\" data-v-a4741ffe></stop><stop offset=\"100%\" stop-color=\"#38bdf8\" stop-opacity=\"0.02\" data-v-a4741ffe></stop></linearGradient><linearGradient id=\"stringGrad2\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\" data-v-a4741ffe><stop offset=\"0%\" stop-color=\"#fbbf24\" stop-opacity=\"0\" data-v-a4741ffe></stop><stop offset=\"50%\" stop-color=\"#fbbf24\" stop-opacity=\"0.18\" data-v-a4741ffe></stop><stop offset=\"100%\" stop-color=\"#fbbf24\" stop-opacity=\"0\" data-v-a4741ffe></stop></linearGradient><linearGradient id=\"vortexGrad\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\" data-v-a4741ffe><stop offset=\"0%\" stop-color=\"#38bdf8\" stop-opacity=\"0.12\" data-v-a4741ffe></stop><stop offset=\"100%\" stop-color=\"#07101e\" stop-opacity=\"0\" data-v-a4741ffe></stop></linearGradient></defs><path class=\"xy-chord-line chord-1\" d=\"M 0 320 Q 360 280 720 320 T 1440 320\" fill=\"none\" stroke=\"url(#stringGrad1)\" stroke-width=\"1.2\" data-v-a4741ffe></path><path class=\"xy-chord-line chord-2\" d=\"M 0 460 Q 400 500 720 460 T 1440 460\" fill=\"none\" stroke=\"url(#stringGrad1)\" stroke-width=\"1\" data-v-a4741ffe></path><path class=\"xy-chord-line chord-3\" d=\"M 0 390 Q 380 430 720 390 T 1440 390\" fill=\"none\" stroke=\"url(#stringGrad2)\" stroke-width=\"0.9\" data-v-a4741ffe></path><ellipse cx=\"720\" cy=\"400\" rx=\"340\" ry=\"110\" fill=\"none\" stroke=\"url(#vortexGrad)\" stroke-width=\"1.5\" stroke-dasharray=\"6 8\" class=\"xy-vortex-ring\" data-v-a4741ffe></ellipse><ellipse cx=\"720\" cy=\"400\" rx=\"200\" ry=\"65\" fill=\"none\" stroke=\"rgba(56, 189, 248, 0.08)\" stroke-width=\"1\" data-v-a4741ffe></ellipse><ellipse cx=\"720\" cy=\"400\" rx=\"80\" ry=\"26\" fill=\"rgba(56, 189, 248, 0.03)\" stroke=\"rgba(251, 191, 36, 0.15)\" stroke-width=\"1\" data-v-a4741ffe></ellipse></svg><div class=\"xy-particles\" data-v-a4741ffe><span class=\"xy-sparkle s1\" data-v-a4741ffe></span><span class=\"xy-sparkle s2\" data-v-a4741ffe></span><span class=\"xy-sparkle s3\" data-v-a4741ffe></span><span class=\"xy-sparkle s4\" data-v-a4741ffe></span><span class=\"xy-sparkle s5\" data-v-a4741ffe></span></div>", 3)]]));
	}
}, [["__scopeId", "data-v-a4741ffe"]]), Ul = {
	key: 0,
	class: "xy-figure-custom"
}, Wl = ["src", "alt"], Gl = {
	class: "xy-daoist-svg",
	viewBox: "0 0 220 380",
	preserveAspectRatio: "xMidYMid meet"
}, Kl = ["id"], ql = ["stop-color"], Jl = ["stop-color"], Yl = ["stop-color"], Xl = ["id"], Zl = {
	class: "xy-base-ripples",
	transform: "translate(110, 350)"
}, Ql = ["stroke"], $l = ["stroke"], eu = ["stroke"], tu = { class: "xy-orbiting-chords" }, nu = [
	"d",
	"stroke",
	"filter"
], ru = ["d", "stroke"], iu = ["filter"], au = ["fill"], ou = ["fill"], su = ["fill"], cu = ["fill"], lu = ["fill"], uu = ["fill"], du = ["stroke"], fu = ["stroke"], pu = /*#__PURE__*/ al({
	__name: "CharacterFigure",
	props: {
		side: {
			type: String,
			default: "player"
		},
		name: {
			type: String,
			default: ""
		},
		avatar: {
			type: String,
			default: ""
		}
	},
	setup(e) {
		let t = e, n = Y(() => !!t.avatar), r = Y(() => t.avatar), i = Y(() => t.side === "player" ? "#38bdf8" : "#f43f5e"), a = Y(() => t.side === "player" ? "#2dd4bf" : "#fbbf24");
		return (t, o) => (U(), W("div", { class: k(["xy-figure-container", ["figure-" + e.side]]) }, [o[6] ||= G("div", {
			class: "xy-figure-halo",
			"aria-hidden": "true"
		}, null, -1), n.value ? (U(), W("div", Ul, [G("img", {
			src: r.value,
			alt: e.name,
			class: "xy-custom-img"
		}, null, 8, Wl), o[0] ||= G("div", { class: "xy-custom-frame-deco" }, null, -1)])) : (U(), W("div", {
			key: 1,
			class: k(["xy-figure-silhouette", e.side])
		}, [(U(), W("svg", Gl, [
			G("defs", null, [
				o[2] ||= Lo("<linearGradient id=\"playerRobeGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\" data-v-a2f25129><stop offset=\"0%\" stop-color=\"#38bdf8\" stop-opacity=\"0.9\" data-v-a2f25129></stop><stop offset=\"40%\" stop-color=\"#0284c7\" stop-opacity=\"0.8\" data-v-a2f25129></stop><stop offset=\"85%\" stop-color=\"#082f49\" stop-opacity=\"0.95\" data-v-a2f25129></stop><stop offset=\"100%\" stop-color=\"#03070d\" stop-opacity=\"1\" data-v-a2f25129></stop></linearGradient><linearGradient id=\"enemyRobeGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\" data-v-a2f25129><stop offset=\"0%\" stop-color=\"#fb7185\" stop-opacity=\"0.9\" data-v-a2f25129></stop><stop offset=\"40%\" stop-color=\"#be123c\" stop-opacity=\"0.8\" data-v-a2f25129></stop><stop offset=\"85%\" stop-color=\"#4c0519\" stop-opacity=\"0.95\" data-v-a2f25129></stop><stop offset=\"100%\" stop-color=\"#03070d\" stop-opacity=\"1\" data-v-a2f25129></stop></linearGradient>", 2),
				G("radialGradient", {
					id: e.side + "CoreGrad",
					cx: "50%",
					cy: "50%",
					r: "50%"
				}, [
					G("stop", {
						offset: "0%",
						"stop-color": e.side === "player" ? "#e0f2fe" : "#ffe4e6",
						"stop-opacity": "1"
					}, null, 8, ql),
					G("stop", {
						offset: "40%",
						"stop-color": e.side === "player" ? "#38bdf8" : "#f43f5e",
						"stop-opacity": "0.8"
					}, null, 8, Jl),
					G("stop", {
						offset: "100%",
						"stop-color": e.side === "player" ? "#0369a1" : "#881337",
						"stop-opacity": "0"
					}, null, 8, Yl)
				], 8, Kl),
				G("filter", {
					id: e.side + "Glow",
					x: "-20%",
					y: "-20%",
					width: "140%",
					height: "140%"
				}, [...o[1] ||= [G("feGaussianBlur", {
					stdDeviation: "4",
					result: "blur"
				}, null, -1), G("feComposite", {
					in: "SourceGraphic",
					in2: "blur",
					operator: "over"
				}, null, -1)]], 8, Xl)
			]),
			G("g", Zl, [
				G("ellipse", {
					cx: "0",
					cy: "0",
					rx: "75",
					ry: "14",
					fill: "none",
					stroke: i.value,
					"stroke-opacity": "0.3",
					"stroke-width": "1.2"
				}, null, 8, Ql),
				G("ellipse", {
					cx: "0",
					cy: "0",
					rx: "55",
					ry: "10",
					fill: "none",
					stroke: i.value,
					"stroke-opacity": "0.5",
					"stroke-width": "1"
				}, null, 8, $l),
				G("ellipse", {
					cx: "0",
					cy: "0",
					rx: "30",
					ry: "6",
					fill: "none",
					stroke: i.value,
					"stroke-opacity": "0.7",
					"stroke-width": "1.5"
				}, null, 8, eu)
			]),
			G("g", tu, [G("path", {
				d: e.side === "player" ? "M 20 280 C 10 160, 200 120, 195 240 C 190 320, 40 330, 25 240" : "M 200 280 C 210 160, 20 120, 25 240 C 30 320, 180 330, 195 240",
				fill: "none",
				stroke: i.value,
				"stroke-width": "1.5",
				"stroke-dasharray": "6 4",
				opacity: "0.6",
				filter: `url(#${e.side}Glow)`
			}, null, 8, nu), G("path", {
				d: e.side === "player" ? "M 45 220 C 30 140, 180 90, 175 190 C 170 270, 60 280, 48 200" : "M 175 220 C 190 140, 40 90, 45 190 C 50 270, 160 280, 172 200",
				fill: "none",
				stroke: a.value,
				"stroke-width": "1",
				opacity: "0.4"
			}, null, 8, ru)]),
			G("g", {
				class: "xy-figure-body-group",
				filter: `url(#${e.side}Glow)`
			}, [
				G("path", {
					d: "M 110 95 \n               C 135 110, 165 170, 175 260 \n               C 180 305, 165 345, 150 355 \n               C 125 345, 95 345, 70 355 \n               C 55 345, 40 305, 45 260 \n               C 55 170, 85 110, 110 95 Z",
					fill: `url(#${e.side}RobeGrad)`,
					stroke: "rgba(255,255,255,0.2)",
					"stroke-width": "0.8"
				}, null, 8, au),
				G("path", {
					d: "M 85 130 C 55 160, 30 220, 38 270 C 45 275, 62 250, 72 210 Z",
					fill: e.side === "player" ? "#075985" : "#9f1239",
					opacity: "0.8"
				}, null, 8, ou),
				G("path", {
					d: "M 135 130 C 165 160, 190 220, 182 270 C 175 275, 158 250, 148 210 Z",
					fill: e.side === "player" ? "#075985" : "#9f1239",
					opacity: "0.8"
				}, null, 8, su),
				o[3] ||= G("path", {
					d: "M 110 98 L 95 150 L 110 240 L 125 150 Z",
					fill: "rgba(255,255,255,0.08)",
					stroke: "rgba(255,255,255,0.25)",
					"stroke-width": "0.8"
				}, null, -1),
				G("circle", {
					cx: "110",
					cy: "180",
					r: "14",
					fill: `url(#${e.side}CoreGrad)`
				}, null, 8, cu),
				o[4] ||= G("circle", {
					cx: "110",
					cy: "180",
					r: "4",
					fill: "#ffffff",
					opacity: "0.9"
				}, null, -1),
				G("ellipse", {
					cx: "110",
					cy: "72",
					rx: "16",
					ry: "21",
					fill: `url(#${e.side}RobeGrad)`,
					stroke: "rgba(255,255,255,0.3)",
					"stroke-width": "0.8"
				}, null, 8, lu),
				G("path", {
					d: "M 103 52 L 110 42 L 117 52 Z",
					fill: a.value
				}, null, 8, uu),
				G("line", {
					x1: "94",
					y1: "48",
					x2: "126",
					y2: "48",
					stroke: a.value,
					"stroke-width": "1.5"
				}, null, 8, du),
				G("circle", {
					cx: "110",
					cy: "68",
					r: "32",
					fill: "none",
					stroke: i.value,
					"stroke-width": "1",
					"stroke-dasharray": "4 6",
					opacity: "0.6"
				}, null, 8, fu)
			], 8, iu)
		])), o[5] ||= G("div", { class: "xy-figure-sparkles" }, [
			G("span", { class: "xy-f-dot d1" }),
			G("span", { class: "xy-f-dot d2" }),
			G("span", { class: "xy-f-dot d3" })
		], -1)], 2))], 2));
	}
}, [["__scopeId", "data-v-a2f25129"]]), mu = {
	class: "xy-wings-rays-svg",
	viewBox: "0 0 380 400",
	preserveAspectRatio: "none"
}, hu = ["id"], gu = ["stop-color"], _u = ["stop-color"], vu = ["d", "stroke"], yu = { class: "xy-wings-container" }, bu = ["title", "onClick"], xu = { class: "xy-feather-inner" }, Su = { class: "xy-feather-name" }, Cu = {
	key: 0,
	class: "xy-feather-lock",
	title: "条件未足"
}, wu = {
	key: 1,
	class: "xy-feather-badge"
}, Tu = {
	key: 0,
	class: "xy-wings-empty"
}, Eu = /*#__PURE__*/ al({
	__name: "ChordWings",
	props: {
		items: {
			type: Array,
			default: () => []
		},
		side: {
			type: String,
			default: "player"
		},
		selectedTermId: {
			type: String,
			default: ""
		},
		isModalOpen: {
			type: Boolean,
			default: !1
		}
	},
	emits: ["select-wing"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = Y(() => n.items.slice(0, 6)), a = Y(() => n.isModalOpen && !!n.selectedTermId);
		function o(e) {
			return n.selectedTermId === e.id;
		}
		function s(e) {
			return n.side === "player" && e.status && !e.status.available;
		}
		function c(e) {
			return n.side === "player" ? e.triggered ? "已发" : e.status && !e.status.available ? "锁" : "可用" : {
				known: "已知",
				inferred: "推测",
				unknown: "未知"
			}[e.status] || "观察";
		}
		function l(e) {
			r("select-wing", {
				side: n.side,
				item: e
			});
		}
		function u(e, t) {
			if (t <= 1) return n.side === "player" ? "M 0 200 L 380 200" : "M 380 200 L 0 200";
			let r = e / (t - 1), i = 70 + r * 260, a = 40 + r * 320;
			return n.side === "player" ? `M 10 ${i} C 140 ${i}, 250 ${a}, 375 ${a}` : `M 370 ${i} C 240 ${i}, 130 ${a}, 5 ${a}`;
		}
		function d(e, t, r) {
			if (t <= 1) return {};
			let i = e / (t - 1), s = (i - .5) * 36, c = Math.sin(i * Math.PI) * 20, l = {
				"--angle": `${s}deg`,
				"--arch": `${c}px`
			};
			return l.transform = a.value ? o(r) ? n.side === "player" ? `rotate(${s}deg) translateX(${c + 42}px) scale(1.22)` : `rotate(${-s}deg) translateX(${-(c + 42)}px) scale(1.22)` : n.side === "player" ? `rotate(${s * .7}deg) translateX(${c - 28}px) scale(0.68)` : `rotate(${-s * .7}deg) translateX(${-(c - 28)}px) scale(0.68)` : n.side === "player" ? `rotate(${s}deg) translateX(${c}px)` : `rotate(${-s}deg) translateX(${-c}px)`, l;
		}
		return (t, n) => (U(), W("div", { class: k(["xy-chord-wings", ["wings-" + e.side]]) }, [(U(), W("svg", mu, [G("defs", null, [G("linearGradient", {
			id: e.side + "RayGrad",
			x1: "0%",
			y1: "0%",
			x2: "100%",
			y2: "0%"
		}, [G("stop", {
			offset: "0%",
			"stop-color": e.side === "player" ? "#38bdf8" : "#fb7185",
			"stop-opacity": "0.7"
		}, null, 8, gu), G("stop", {
			offset: "100%",
			"stop-color": e.side === "player" ? "#2dd4bf" : "#fbbf24",
			"stop-opacity": "0.1"
		}, null, 8, _u)], 8, hu)]), (U(!0), W(V, null, B(i.value, (t, n) => (U(), W("path", {
			key: "ray-" + n,
			d: u(n, i.value.length),
			fill: "none",
			stroke: `url(#${e.side}RayGrad)`,
			"stroke-width": "1.5",
			"stroke-dasharray": "5 7",
			opacity: "0.6"
		}, null, 8, vu))), 128))])), G("div", yu, [(U(!0), W(V, null, B(i.value, (t, r) => (U(), W("button", {
			key: t.id || r,
			class: k(["xy-wing-feather", ["feather-" + e.side, {
				"is-selected": o(t),
				"is-shrunk": a.value && !o(t),
				"is-locked": s(t)
			}]]),
			style: fe(d(r, i.value.length, t)),
			title: t.name + (s(t) ? "（机缘未备·点击查阅密卷）" : "（本轮可用·点击查阅或起势）"),
			onClick: (e) => l(t)
		}, [
			n[1] ||= G("span", { class: "xy-feather-tip" }, null, -1),
			G("div", xu, [
				n[0] ||= G("span", { class: "xy-feather-crest" }, "◆", -1),
				G("span", Su, A(t.name), 1),
				s(t) ? (U(), W("span", Cu, "🔒")) : (U(), W("span", wu, A(c(t)), 1))
			]),
			n[2] ||= G("span", {
				class: "xy-feather-string",
				"aria-hidden": "true"
			}, null, -1)
		], 14, bu))), 128)), e.items.length ? q("", !0) : (U(), W("div", Tu, [G("span", null, A(e.side === "player" ? "未感应到可用功法弦羽" : "未见可察敌招"), 1)]))])], 2));
	}
}, [["__scopeId", "data-v-908c10ba"]]), Du = { class: "xy-buff-box-lane" }, Ou = { class: "xy-buff-header" }, ku = { class: "xy-buff-icon" }, Au = { class: "xy-buff-title" }, ju = { class: "xy-buff-content" }, Mu = {
	key: 0,
	class: "xy-buff-badges"
}, Nu = { class: "xy-pill-label" }, Pu = {
	key: 0,
	class: "xy-pill-round"
}, Fu = {
	key: 1,
	class: "xy-buff-empty"
}, Iu = { class: "xy-zone-middle" }, Lu = { class: "xy-figure-wrapper" }, Ru = { class: "xy-wings-wrapper" }, zu = { class: "xy-wings-wrapper" }, Bu = { class: "xy-figure-wrapper" }, Vu = { class: "xy-info-box-lane" }, Hu = { class: "xy-info-top" }, Uu = { class: "xy-info-title-group" }, Wu = { class: "xy-side-kicker" }, Gu = { class: "xy-actor-name" }, Ku = { class: "xy-actor-id" }, qu = {
	key: 0,
	class: "xy-target-switchers"
}, Ju = ["onClick"], Yu = { class: "xy-traits-row" }, Xu = { class: "xy-trait-k" }, Zu = { class: "xy-trait-v" }, Qu = {
	key: 0,
	class: "xy-trait-none"
}, $u = {
	key: 0,
	class: "xy-resources-row"
}, ed = { class: "xy-res-chips" }, td = /*#__PURE__*/ al({
	__name: "FighterZone",
	props: {
		actor: {
			type: Object,
			default: () => ({})
		},
		side: {
			type: String,
			default: "player"
		},
		effects: {
			type: Array,
			default: () => []
		},
		techniques: {
			type: Array,
			default: () => []
		},
		selectedTermId: {
			type: String,
			default: ""
		},
		isModalOpen: {
			type: Boolean,
			default: !1
		},
		isSelectedTarget: {
			type: Boolean,
			default: !1
		},
		enemiesList: {
			type: Array,
			default: () => []
		}
	},
	emits: ["select-petal", "select-target"],
	setup(e) {
		let t = e, n = Y(() => t.enemiesList?.length || 0), r = Y(() => {
			let e = t.actor.visibleInfo;
			if (!e || typeof e != "object") return {};
			let n = [
				"techniques",
				"abilities",
				"skills",
				"spells",
				"术法",
				"功法",
				"招式",
				"observedTechniques",
				"observedAbilities",
				"可观察招式"
			], r = {};
			for (let [t, i] of Object.entries(e)) !n.includes(t) && i != null && i !== "" && (r[t] = i);
			return r;
		}), i = Y(() => Object.keys(r.value).length > 0), a = Y(() => {
			let e = t.actor.resources;
			return e && typeof e == "object" && Object.keys(e).length > 0;
		});
		function o(e) {
			return typeof e == "object" ? JSON.stringify(e) : String(e);
		}
		return (t, s) => (U(), W("div", { class: k(["xy-fighter-zone", ["zone-" + e.side, { "is-active-target": e.isSelectedTarget }]]) }, [
			G("div", Du, [G("div", { class: k(["xy-buff-card", "buff-" + e.side]) }, [G("div", Ou, [G("span", ku, A(e.side === "player" ? "✦" : "✧"), 1), G("span", Au, A(e.side === "player" ? "本尊加持与异常" : "敌修气机附着"), 1)]), G("div", ju, [e.effects.length ? (U(), W("div", Mu, [(U(!0), W(V, null, B(e.effects, (e, t) => (U(), W("span", {
				key: t,
				class: k(["xy-buff-pill", { "is-field": e.lane === "field" }])
			}, [
				s[2] ||= G("span", { class: "xy-pill-dot" }, null, -1),
				G("span", Nu, A(e.label), 1),
				e.remainingRounds === void 0 ? q("", !0) : (U(), W("small", Pu, A(e.remainingRounds) + "轮", 1))
			], 2))), 128))])) : (U(), W("div", Fu, [...s[3] ||= [G("span", null, "灵息平稳 · 无异常灵息", -1)]]))])], 2)]),
			G("div", Iu, [e.side === "player" ? (U(), W(V, { key: 0 }, [G("div", Lu, [K(pu, {
				side: "player",
				name: e.actor.name || "主角",
				avatar: e.actor.avatar || e.actor.portrait || ""
			}, null, 8, ["name", "avatar"])]), G("div", Ru, [K(Eu, {
				side: "player",
				items: e.techniques,
				"selected-term-id": e.selectedTermId,
				"is-modal-open": e.isModalOpen,
				onSelectWing: s[0] ||= (e) => t.$emit("select-petal", e)
			}, null, 8, [
				"items",
				"selected-term-id",
				"is-modal-open"
			])])], 64)) : (U(), W(V, { key: 1 }, [G("div", zu, [K(Eu, {
				side: "enemy",
				items: e.techniques,
				"selected-term-id": e.selectedTermId,
				"is-modal-open": e.isModalOpen,
				onSelectWing: s[1] ||= (e) => t.$emit("select-petal", e)
			}, null, 8, [
				"items",
				"selected-term-id",
				"is-modal-open"
			])]), G("div", Bu, [K(pu, {
				side: "enemy",
				name: e.actor.name || "敌手",
				avatar: e.actor.avatar || e.actor.portrait || ""
			}, null, 8, ["name", "avatar"])])], 64))]),
			G("div", Vu, [G("div", { class: k(["xy-character-info-card", "info-" + e.side]) }, [
				G("div", Hu, [G("div", Uu, [
					G("span", Wu, A(e.side === "player" ? "DAOIST" : "OPPONENT"), 1),
					G("h3", Gu, A(e.actor.name || (e.side === "player" ? "主角" : "敌手")), 1),
					G("span", Ku, "#" + A(e.actor.id), 1)
				]), e.side === "enemy" && n.value > 1 ? (U(), W("div", qu, [(U(!0), W(V, null, B(e.enemiesList, (n) => (U(), W("button", {
					key: n.id,
					class: k(["xy-switch-btn", { active: n.id === e.actor.id }]),
					onClick: (e) => t.$emit("select-target", n.id)
				}, A(n.name), 11, Ju))), 128))])) : q("", !0)]),
				G("div", Yu, [(U(!0), W(V, null, B(r.value, (e, t) => (U(), W("span", {
					key: t,
					class: "xy-trait-item"
				}, [G("b", Xu, A(t) + ":", 1), G("span", Zu, A(o(e)), 1)]))), 128)), i.value ? q("", !0) : (U(), W("span", Qu, "平稳对峙 · 无显露法力特征"))]),
				a.value ? (U(), W("div", $u, [s[4] ||= G("span", { class: "xy-res-label" }, "气海机枢:", -1), G("div", ed, [(U(!0), W(V, null, B(e.actor.resources, (e, t) => (U(), W("span", {
					key: t,
					class: "xy-res-tag"
				}, [G("b", null, A(t), 1), Io(" " + A(e), 1)]))), 128))])])) : q("", !0)
			], 2)])
		], 2));
	}
}, [["__scopeId", "data-v-687b8d07"]]), nd = { class: "xy-harmonic-gauge" }, rd = { class: "xy-gauge-round" }, id = { class: "xy-round-num" }, ad = { class: "xy-dom-label" }, od = /*#__PURE__*/ al({
	__name: "HarmonicGauge",
	props: {
		round: {
			type: Number,
			default: 0
		},
		semanticState: {
			type: Object,
			default: () => ({})
		}
	},
	setup(e) {
		let t = e, n = Y(() => t.semanticState.压制 || t.semanticState.control || "均势对峙"), r = Y(() => {
			let e = n.value;
			return e.includes("主角") || e.includes("胜") ? "dom-player" : e.includes("敌") || e.includes("劣") ? "dom-enemy" : "dom-neutral";
		});
		return (t, i) => (U(), W("div", nd, [
			G("div", rd, [i[0] ||= G("span", { class: "xy-round-roman" }, "ROUND", -1), G("b", id, A(e.round > 0 ? e.round < 10 ? "0" + e.round : e.round : "—"), 1)]),
			i[1] ||= Lo("<div class=\"xy-wave-resonator\" data-v-becd49ff><svg class=\"xy-wave-svg\" viewBox=\"0 0 120 70\" preserveAspectRatio=\"none\" data-v-becd49ff><defs data-v-becd49ff><linearGradient id=\"waveCyanGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\" data-v-becd49ff><stop offset=\"0%\" stop-color=\"#38bdf8\" stop-opacity=\"0.8\" data-v-becd49ff></stop><stop offset=\"50%\" stop-color=\"#2dd4bf\" stop-opacity=\"0.9\" data-v-becd49ff></stop><stop offset=\"100%\" stop-color=\"#fb7185\" stop-opacity=\"0.8\" data-v-becd49ff></stop></linearGradient></defs><path class=\"xy-sine-path p1\" d=\"M 0 35 Q 30 18, 60 35 T 120 35\" fill=\"none\" stroke=\"url(#waveCyanGrad)\" stroke-width=\"1.8\" data-v-becd49ff></path><path class=\"xy-sine-path p2\" d=\"M 0 35 Q 30 52, 60 35 T 120 35\" fill=\"none\" stroke=\"rgba(251, 191, 36, 0.5)\" stroke-width=\"1.2\" data-v-becd49ff></path><circle cx=\"60\" cy=\"35\" r=\"3.5\" fill=\"#fbbf24\" class=\"xy-center-node\" data-v-becd49ff></circle></svg></div><div class=\"xy-vs-emblem\" data-v-becd49ff><span class=\"xy-vs-text\" data-v-becd49ff>VS</span><div class=\"xy-vs-aura\" data-v-becd49ff></div></div>", 2),
			G("div", { class: k(["xy-dominance-pill", r.value]) }, [G("span", ad, A(n.value), 1)], 2)
		]));
	}
}, [["__scopeId", "data-v-becd49ff"]]), sd = { class: "xy-center-stage" }, cd = { class: "xy-center-head" }, ld = { class: "xy-center-weather" }, ud = { class: "xy-weather-text" }, dd = { class: "xy-center-body xy-custom-scroll" }, fd = {
	class: "xy-term-scroll-view",
	key: "term"
}, pd = { class: "xy-scroll-top-bar" }, md = { class: "xy-scroll-badge" }, hd = { class: "xy-badge-origin" }, gd = { class: "xy-scroll-tech-title" }, _d = { class: "xy-tech-name-glow" }, vd = { class: "xy-scroll-quote" }, yd = { class: "xy-scroll-details" }, bd = {
	key: 0,
	class: "xy-detail-block"
}, xd = { class: "xy-detail-list" }, Sd = {
	key: 1,
	class: "xy-detail-block"
}, Cd = { class: "xy-detail-list" }, wd = {
	key: 2,
	class: "xy-detail-block"
}, Td = {
	key: 3,
	class: "xy-detail-block"
}, Ed = { class: "xy-rule-tags" }, Dd = {
	key: 0,
	class: "xy-scroll-action"
}, Od = {
	class: "xy-situation-view",
	key: "situation"
}, kd = { class: "xy-positions-card" }, Ad = { class: "xy-pos-clash" }, jd = { class: "xy-pos-node player" }, Md = { class: "xy-node-name" }, Nd = { class: "xy-node-val" }, Pd = { class: "xy-pos-bridge" }, Fd = { class: "xy-bridge-dist" }, Id = { class: "xy-pos-node enemy" }, Ld = { class: "xy-node-name" }, Rd = { class: "xy-node-val" }, zd = {
	key: 0,
	class: "xy-semantic-grid"
}, Bd = { class: "xy-sem-k" }, Vd = { class: "xy-sem-v" }, Hd = { class: "xy-verdict-card" }, Ud = { class: "xy-verdict-header" }, Wd = {
	key: 0,
	class: "xy-verdict-round"
}, Gd = {
	key: 0,
	class: "xy-verdict-body"
}, Kd = { class: "xy-verdict-action" }, qd = {
	key: 0,
	class: "xy-verdict-prose"
}, Jd = {
	key: 1,
	class: "xy-verdict-summary"
}, Yd = {
	key: 2,
	class: "xy-verdict-await"
}, Xd = {
	key: 1,
	class: "xy-verdict-empty"
}, Zd = { class: "xy-center-footer" }, Qd = { class: "xy-footer-status" }, $d = /*#__PURE__*/ al({
	__name: "CenterStage",
	props: {
		round: {
			type: Number,
			default: 0
		},
		phase: {
			type: String,
			default: "idle"
		},
		semanticState: {
			type: Object,
			default: () => ({})
		},
		allEffects: {
			type: Array,
			default: () => []
		},
		player: {
			type: Object,
			default: () => ({})
		},
		currentEnemy: {
			type: Object,
			default: () => ({})
		},
		latestRecord: {
			type: Object,
			default: null
		},
		selectedTermData: {
			type: Object,
			default: null
		},
		selectedTermSide: {
			type: String,
			default: "player"
		},
		selectedTermParentName: {
			type: String,
			default: ""
		},
		selectedTermAvailability: {
			type: Object,
			default: () => ({
				available: !0,
				reason: ""
			})
		}
	},
	emits: [
		"clear-term",
		"apply-technique",
		"open-history"
	],
	setup(e) {
		let t = e, n = Y(() => {
			let e = t.allEffects?.filter((e) => e.lane === "field") || [];
			return e.length ? e.map((e) => e.label).join(" · ") : "天地肃穆 · 水平如镜";
		}), r = Y(() => t.semanticState.positions?.player || t.semanticState.主角站位 || "近岸"), i = Y(() => {
			let e = t.currentEnemy?.id || "enemy-1";
			return t.semanticState.positions?.[e] || t.semanticState.敌方站位 || "台心";
		}), a = Y(() => t.currentEnemy?.visibleInfo?.站位 || "中距对峙"), o = Y(() => {
			let e = t.semanticState, n = [];
			for (let t of [
				"潮眼",
				"回弦",
				"破绽"
			]) if (e[t] !== void 0 && e[t] !== null) {
				let r = !!e[t], i = e[t];
				typeof i == "boolean" ? i = i ? "已凝显" : "潜隐" : Array.isArray(i) && (i = i.length ? i.join("、") : "无破绽"), n.push({
					key: t,
					val: String(i),
					active: r
				});
			}
			return n;
		}), s = Y(() => {
			let e = t.selectedTermData;
			return e ? e.rawDescription || e.originalDefinition || e.description || "暂无古籍阐发" : "";
		}), c = Y(() => t.selectedTermData?.mechanics || []), l = Y(() => t.selectedTermData?.triggeredState || []), u = Y(() => t.selectedTermData?.ruleRefs || []), d = Y(() => t.selectedTermSide === "player" ? t.selectedTermAvailability?.available ?? !0 : !0), f = Y(() => t.selectedTermAvailability?.reason || (d.value ? "契合当前环境，随时可发" : "前置弦势未足")), p = Y(() => t.selectedTermSide === "player" ? d.value ? "status-pass" : "status-fail" : "status-observe"), m = Y(() => t.selectedTermSide === "player" ? d.value ? "本轮可用" : "机缘未备" : "公开可察招式"), h = Y(() => t.phase === "judging" ? "天道推演裁定中……" : t.phase === "narrating" ? "正文撰刻中……" : t.phase === "awaiting_player" ? "天道神念就绪 · 请修士落子起弦" : t.phase === "awaiting_next" ? "裁定已确立 · 静候进发下一轮" : "灵台安宁 · 待启战局");
		return (t, g) => (U(), W("div", sd, [
			G("div", cd, [
				g[4] ||= G("div", { class: "xy-pillar-crest" }, [G("span", { class: "xy-pillar-crest-dot" }, "☯"), G("span", { class: "xy-pillar-title" }, "战状核心枢纽")], -1),
				K(od, {
					round: e.round,
					"semantic-state": e.semanticState
				}, null, 8, ["round", "semantic-state"]),
				G("div", ld, [g[3] ||= G("span", { class: "xy-weather-dot" }, "●", -1), G("span", ud, A(n.value), 1)])
			]),
			G("div", dd, [K(Ms, {
				name: "center-fade",
				mode: "out-in"
			}, {
				default: Ar(() => [e.selectedTermData ? (U(), W("div", fd, [
					G("div", pd, [G("div", md, [
						G("span", null, "📜 " + A(e.selectedTermSide === "player" ? "主角传承" : "敌手破招"), 1),
						g[5] ||= G("span", { class: "xy-badge-sep" }, "·", -1),
						G("span", hd, A(e.selectedTermParentName), 1)
					]), G("button", {
						class: "xy-scroll-close-btn",
						onClick: g[0] ||= (e) => t.$emit("clear-term"),
						title: "返回战况"
					}, "✕")]),
					G("h4", gd, [
						g[6] ||= G("span", { class: "xy-bracket" }, "【", -1),
						G("span", _d, A(e.selectedTermData.name), 1),
						g[7] ||= G("span", { class: "xy-bracket" }, "】", -1),
						G("span", { class: k(["xy-tech-status-chip", p.value]) }, A(m.value), 3)
					]),
					G("blockquote", vd, [G("p", null, A(s.value), 1)]),
					G("div", yd, [
						c.value.length ? (U(), W("div", bd, [g[8] ||= G("span", { class: "xy-detail-label" }, "⚙ 演化机制", -1), G("ul", xd, [(U(!0), W(V, null, B(c.value, (e, t) => (U(), W("li", { key: t }, A(e), 1))), 128))])])) : q("", !0),
						l.value.length ? (U(), W("div", Sd, [g[9] ||= G("span", { class: "xy-detail-label" }, "⚡ 触发态势", -1), G("ul", Cd, [(U(!0), W(V, null, B(l.value, (e, t) => (U(), W("li", { key: t }, A(e), 1))), 128))])])) : q("", !0),
						e.selectedTermSide === "player" ? (U(), W("div", wd, [g[10] ||= G("span", { class: "xy-detail-label" }, "⚖ 本轮机缘", -1), G("p", { class: k(["xy-cond-text", d.value ? "pass" : "fail"]) }, A(f.value), 3)])) : q("", !0),
						u.value.length ? (U(), W("div", Td, [g[11] ||= G("span", { class: "xy-detail-label" }, "💠 规制出处", -1), G("div", Ed, [(U(!0), W(V, null, B(u.value, (e) => (U(), W("span", {
							key: e,
							class: "xy-rule-tag"
						}, A(e), 1))), 128))])])) : q("", !0)
					]),
					e.selectedTermSide === "player" && d.value ? (U(), W("div", Dd, [G("button", {
						class: "xy-pick-tech-btn",
						onClick: g[1] ||= (n) => t.$emit("apply-technique", e.selectedTermData.id)
					}, [...g[12] ||= [G("span", null, "选用此招并起势", -1), G("span", { class: "xy-btn-arrow" }, "→", -1)]])])) : q("", !0)
				])) : (U(), W("div", Od, [
					G("div", kd, [g[14] ||= G("div", { class: "xy-pos-header" }, [G("span", { class: "xy-pos-crest" }, "⚔"), G("span", null, "两仪站位与间距")], -1), G("div", Ad, [
						G("div", jd, [G("span", Md, A(e.player?.name || "主角"), 1), G("span", Nd, A(r.value), 1)]),
						G("div", Pd, [G("span", Fd, A(a.value), 1), g[13] ||= G("span", { class: "xy-bridge-line" }, null, -1)]),
						G("div", Id, [G("span", Ld, A(e.currentEnemy?.name || "敌修"), 1), G("span", Rd, A(i.value), 1)])
					])]),
					o.value.length ? (U(), W("div", zd, [(U(!0), W(V, null, B(o.value, (e) => (U(), W("div", {
						key: e.key,
						class: k(["xy-sem-card", { active: e.active }])
					}, [G("span", Bd, A(e.key), 1), G("span", Vd, A(e.val), 1)], 2))), 128))])) : q("", !0),
					G("div", Hd, [G("div", Ud, [g[15] ||= G("span", { class: "xy-verdict-title" }, "天道裁定战状判词", -1), e.latestRecord ? (U(), W("span", Wd, "第 " + A(e.latestRecord.round) + " 回合", 1)) : q("", !0)]), e.latestRecord ? (U(), W("div", Gd, [G("p", Kd, [g[16] ||= G("b", null, "行止动作:", -1), Io(" " + A(e.latestRecord.actionLabel || e.latestRecord.techniqueId || "自由出招"), 1)]), e.latestRecord.narrative?.text ? (U(), W("div", qd, [G("p", null, A(e.latestRecord.narrative.text), 1)])) : e.latestRecord.outcomeSummary ? (U(), W("p", Jd, [g[17] ||= G("b", null, "战局变化:", -1), Io(" " + A(e.latestRecord.outcomeSummary), 1)])) : (U(), W("p", Yd, " 裁定已落，正文撰刻中…… "))])) : (U(), W("div", Xd, [...g[18] ||= [G("span", null, "战局未启 · 请修士在下方输入心念行止并提交裁定", -1)]]))]),
					G("button", {
						class: "xy-view-timeline-btn",
						onClick: g[2] ||= (e) => t.$emit("open-history")
					}, [...g[19] ||= [G("span", null, "📜 查阅完整战史演进与天道批注", -1)]])
				]))]),
				_: 1
			})]),
			G("div", Zd, [g[20] ||= G("span", { class: "xy-footer-pulse" }, null, -1), G("span", Qd, A(h.value), 1)])
		]));
	}
}, [["__scopeId", "data-v-1a5aed34"]]), ef = { class: "xy-skill-modal-card" }, tf = { class: "xy-modal-header" }, nf = { class: "xy-modal-crest" }, rf = { class: "xy-crest-side" }, af = { class: "xy-crest-origin" }, of = { class: "xy-modal-title-row" }, sf = { class: "xy-modal-title" }, cf = { class: "xy-tech-name-glow" }, lf = { class: "xy-modal-ancient-quote" }, uf = { class: "xy-quote-text" }, df = { class: "xy-modal-grid" }, ff = {
	key: 0,
	class: "xy-grid-cell"
}, pf = { class: "xy-cell-list" }, mf = {
	key: 1,
	class: "xy-grid-cell"
}, hf = { class: "xy-cell-list" }, gf = {
	key: 2,
	class: "xy-grid-cell"
}, _f = { class: "xy-grid-cell" }, vf = { class: "xy-rulerefs-tags" }, yf = {
	key: 0,
	class: "xy-no-rules"
}, bf = { class: "xy-modal-footer" }, xf = { class: "xy-footer-hint" }, Sf = { class: "xy-footer-btns" }, Cf = ["disabled", "title"], wf = {
	key: 0,
	class: "xy-btn-lock"
}, Tf = {
	key: 1,
	class: "xy-btn-arrow"
}, Ef = /*#__PURE__*/ al({
	__name: "SkillModal",
	props: {
		isOpen: {
			type: Boolean,
			default: !1
		},
		termData: {
			type: Object,
			default: null
		},
		isPlayer: {
			type: Boolean,
			default: !0
		},
		parentName: {
			type: String,
			default: ""
		},
		availabilityStatus: {
			type: Object,
			default: () => ({
				available: !0,
				reason: ""
			})
		}
	},
	emits: ["close", "apply"],
	setup(e, { emit: t }) {
		let n = e, r = t;
		function i() {
			r("close");
		}
		function a(e) {
			e.key === "Escape" && n.isOpen && r("close");
		}
		yi(() => {
			window.addEventListener("keydown", a);
		}), Ci(() => {
			window.removeEventListener("keydown", a);
		});
		let o = Y(() => n.termData ? n.termData.rawDescription || n.termData.originalDefinition || n.termData.description || "暂无古籍阐发" : ""), s = Y(() => n.termData?.mechanics || []), c = Y(() => n.termData?.triggeredState || []), l = Y(() => n.termData?.ruleRefs || []), u = Y(() => n.isPlayer ? n.availabilityStatus?.available ?? !0 : !0), d = Y(() => n.isPlayer ? n.availabilityStatus?.reason || (u.value ? "契合当前环境，随时可发" : "前置弦势未足") : "公开观察到的招式特征"), f = Y(() => {
			if (n.isPlayer) return u.value ? "tone-emerald" : "tone-amber";
			{
				let e = n.termData?.status;
				return e === "known" ? "tone-emerald" : e === "inferred" ? "tone-amber" : "tone-slate";
			}
		}), p = Y(() => n.isPlayer ? u.value ? "本轮可用" : "机缘未备" : {
			known: "已明悟",
			inferred: "推测中",
			unknown: "未知虚实"
		}[n.termData?.status] || "公开可察招式");
		return (t, n) => (U(), To(Ms, { name: "xy-modal-pop" }, {
			default: Ar(() => [e.isOpen && e.termData ? (U(), W("div", {
				key: 0,
				class: "xy-skill-modal-backdrop",
				role: "dialog",
				"aria-modal": "true",
				onClick: qc(i, ["self"])
			}, [G("div", ef, [
				n[13] ||= G("span", { class: "xy-card-corner top-left" }, null, -1),
				n[14] ||= G("span", { class: "xy-card-corner top-right" }, null, -1),
				n[15] ||= G("span", { class: "xy-card-corner bottom-left" }, null, -1),
				n[16] ||= G("span", { class: "xy-card-corner bottom-right" }, null, -1),
				G("div", tf, [G("div", nf, [
					n[3] ||= G("span", { class: "xy-crest-icon" }, "📜", -1),
					G("span", rf, A(e.isPlayer ? "主角传承" : "敌修破招"), 1),
					n[4] ||= G("span", { class: "xy-crest-dot" }, "·", -1),
					G("span", af, A(e.parentName), 1)
				]), G("button", {
					class: "xy-modal-close-btn",
					onClick: n[0] ||= (e) => t.$emit("close"),
					"aria-label": "关闭弹窗",
					title: "关闭 (Esc / 点击空白处)"
				}, " ✕ ")]),
				G("div", of, [G("h3", sf, [
					n[5] ||= G("span", { class: "xy-bracket" }, "【", -1),
					G("span", cf, A(e.termData.name), 1),
					n[6] ||= G("span", { class: "xy-bracket" }, "】", -1)
				]), G("div", { class: k(["xy-modal-status-badge", f.value]) }, [n[7] ||= G("span", { class: "xy-status-dot" }, null, -1), G("span", null, A(p.value), 1)], 2)]),
				G("blockquote", lf, [G("p", uf, "“" + A(o.value) + "”", 1)]),
				G("div", df, [
					s.value.length ? (U(), W("div", ff, [n[8] ||= G("span", { class: "xy-cell-title" }, [G("span", { class: "xy-cell-icon" }, "⚙"), G("span", null, "演化机制")], -1), G("ul", pf, [(U(!0), W(V, null, B(s.value, (e, t) => (U(), W("li", { key: t }, A(e), 1))), 128))])])) : q("", !0),
					c.value.length ? (U(), W("div", mf, [n[9] ||= G("span", { class: "xy-cell-title" }, [G("span", { class: "xy-cell-icon" }, "⚡"), G("span", null, "触发态势")], -1), G("ul", hf, [(U(!0), W(V, null, B(c.value, (e, t) => (U(), W("li", { key: t }, A(e), 1))), 128))])])) : q("", !0),
					e.isPlayer ? (U(), W("div", gf, [n[10] ||= G("span", { class: "xy-cell-title" }, [G("span", { class: "xy-cell-icon" }, "⚖"), G("span", null, "本轮机缘")], -1), G("p", { class: k(["xy-condition-note", u.value ? "cond-pass" : "cond-fail"]) }, A(d.value), 3)])) : q("", !0),
					G("div", _f, [n[11] ||= G("span", { class: "xy-cell-title" }, [G("span", { class: "xy-cell-icon" }, "💠"), G("span", null, "规制出处")], -1), G("div", vf, [(U(!0), W(V, null, B(l.value, (e) => (U(), W("span", {
						key: e,
						class: "xy-rule-chip"
					}, A(e), 1))), 128)), l.value.length ? q("", !0) : (U(), W("span", yf, "未注明规则出处"))])])
				]),
				G("div", bf, [G("span", xf, A(e.isPlayer ? "功法源于结构化 Registry · 遵循语义裁定机枢" : "敌方内部资源与 Hidden 战术已被天道法则严格屏蔽"), 1), G("div", Sf, [G("button", {
					class: "xy-footer-dismiss-btn",
					onClick: n[1] ||= (e) => t.$emit("close")
				}, " 返回战场 "), e.isPlayer ? (U(), W("button", {
					key: 0,
					class: k(["xy-footer-apply-btn", { "is-locked": !u.value }]),
					disabled: !u.value,
					title: u.value ? "选用此招并起势" : d.value || "机缘未备，尚未满足施展条件",
					onClick: n[2] ||= (n) => u.value && t.$emit("apply", e.termData.id)
				}, [
					u.value ? q("", !0) : (U(), W("span", wf, "🔒")),
					n[12] ||= G("span", null, "选用此招并起势", -1),
					u.value ? (U(), W("span", Tf, "→")) : q("", !0)
				], 10, Cf)) : q("", !0)])])
			])])) : q("", !0)]),
			_: 1
		}));
	}
}, [["__scopeId", "data-v-9c6c036b"]]), Df = { class: "xy-action-topbar" }, Of = { class: "xy-action-controls" }, kf = ["disabled"], Af = ["disabled"], jf = ["disabled"], Mf = ["disabled"], Nf = ["disabled"], Pf = { class: "xy-action-console" }, Ff = { class: "xy-technique-selector" }, If = { class: "xy-tech-picker-label" }, Lf = ["value", "disabled"], Rf = ["value", "disabled"], zf = { class: "xy-input-box-wrapper" }, Bf = [
	"value",
	"disabled",
	"onKeydown"
], Vf = ["disabled"], Hf = { class: "xy-submit-content" }, Uf = { class: "xy-submit-text" }, Wf = /*#__PURE__*/ al({
	__name: "ActionDock",
	props: {
		phase: {
			type: String,
			default: "idle"
		},
		isBusy: {
			type: Boolean,
			default: !1
		},
		actionLabel: {
			type: String,
			default: ""
		},
		selectedTechniqueId: {
			type: String,
			default: ""
		},
		techniqueOptions: {
			type: Array,
			default: () => []
		},
		latestCommitted: {
			type: Object,
			default: null
		},
		hasBridgeQueued: {
			type: Boolean,
			default: !1
		},
		hostSyncPending: {
			type: Boolean,
			default: !1
		}
	},
	emits: [
		"submit",
		"start",
		"next",
		"stop",
		"rewrite",
		"queue",
		"skip-narrative",
		"retry-host",
		"update:actionLabel",
		"update:techniqueId"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ on(null), a = Y(() => n.isBusy ? n.phase === "judging" ? "天道裁定中…" : n.phase === "narrating" ? "正文撰刻中…" : "推演中…" : n.phase === "awaiting_player" ? "提交裁定" : "静候机枢");
		function o() {
			n.isBusy || n.phase !== "awaiting_player" || r("submit");
		}
		return (t, n) => (U(), W("section", { class: k(["xy-action-dock", { "is-busy": e.isBusy }]) }, [G("div", Df, [G("div", Of, [
			G("button", {
				class: "xy-ctrl-btn btn-start",
				disabled: e.isBusy || !["idle", "ended"].includes(e.phase),
				onClick: n[0] ||= (e) => t.$emit("start")
			}, [K(X, { name: "play" }), n[11] ||= G("span", null, "启战 / 继续", -1)], 8, kf),
			G("button", {
				class: "xy-ctrl-btn btn-next",
				disabled: e.isBusy || !["awaiting_next", "committed"].includes(e.phase),
				onClick: n[1] ||= (e) => t.$emit("next")
			}, [K(X, { name: "next" }), n[12] ||= G("span", null, "进发下轮", -1)], 8, Af),
			G("button", {
				class: "xy-ctrl-btn btn-stop",
				disabled: ["idle", "ended"].includes(e.phase),
				onClick: n[2] ||= (e) => t.$emit("stop")
			}, [K(X, { name: "stop" }), n[13] ||= G("span", null, "止戈停战", -1)], 8, jf),
			e.latestCommitted ? (U(), W("button", {
				key: 0,
				class: "xy-ctrl-btn btn-rewrite",
				disabled: e.isBusy,
				onClick: n[3] ||= (e) => t.$emit("rewrite"),
				title: "重写本轮正文 (保留已判决事实，不重裁)"
			}, [K(X, { name: "refresh" }), n[14] ||= G("span", null, "重写正文", -1)], 8, Mf)) : q("", !0),
			e.latestCommitted ? (U(), W("button", {
				key: 1,
				class: "xy-ctrl-btn btn-inject",
				disabled: e.isBusy,
				onClick: n[4] ||= (e) => t.$emit("queue"),
				title: "注入酒馆主剧情下条提示词"
			}, [K(X, { name: "send" }), n[15] ||= G("span", null, "注为主剧情", -1)], 8, Nf)) : q("", !0),
			e.hasBridgeQueued ? (U(), W("button", {
				key: 2,
				class: "xy-ctrl-btn btn-skip",
				onClick: n[5] ||= (e) => t.$emit("skip-narrative")
			}, [...n[16] ||= [G("span", null, "跳过本轮正文", -1)]])) : q("", !0),
			e.hostSyncPending ? (U(), W("button", {
				key: 3,
				class: "xy-ctrl-btn btn-retry-host",
				onClick: n[6] ||= (e) => t.$emit("retry-host")
			}, [...n[17] ||= [G("span", null, "重试宿主同步", -1)]])) : q("", !0),
			G("button", {
				class: "xy-ctrl-btn btn-history",
				onClick: n[7] ||= (e) => t.$emit("toggle-history"),
				title: "演武战史与批注"
			}, [K(X, { name: "scroll" }), n[18] ||= G("span", null, "战史演进", -1)])
		])]), G("div", Pf, [
			G("div", Ff, [G("label", If, [n[20] ||= G("span", { class: "xy-picker-kicker" }, "选用心法", -1), G("select", {
				class: "xy-tech-select",
				value: e.selectedTechniqueId,
				disabled: e.isBusy,
				onChange: n[8] ||= (e) => t.$emit("update:techniqueId", e.target.value)
			}, [n[19] ||= G("option", { value: "" }, "自由身法 (自由行动)", -1), (U(!0), W(V, null, B(e.techniqueOptions, (e) => (U(), W("option", {
				key: e.id,
				value: e.id,
				disabled: !e.available
			}, A(e.name) + A(e.available ? "" : " (机缘未至)"), 9, Rf))), 128))], 40, Lf)]), e.selectedTechniqueId ? (U(), W("button", {
				key: 0,
				class: "xy-clear-tech-btn",
				onClick: n[9] ||= (e) => t.$emit("update:techniqueId", ""),
				title: "切为自由行动"
			}, " 取消心法 ")) : q("", !0)]),
			G("div", zf, [G("textarea", {
				ref_key: "textareaRef",
				ref: i,
				class: "xy-action-textarea xy-custom-scroll",
				value: e.actionLabel,
				disabled: e.isBusy,
				rows: "2",
				placeholder: "凝神运功，详述主角心意、起手引弦与应对之势…… (按 Ctrl+Enter 快速提交)",
				onInput: n[10] ||= (e) => t.$emit("update:actionLabel", e.target.value),
				onKeydown: Yc(qc(o, ["ctrl"]), ["enter"])
			}, null, 40, Bf), n[21] ||= G("span", { class: "xy-textarea-deco" }, null, -1)]),
			G("button", {
				class: k(["xy-submit-btn", { "is-loading": e.isBusy }]),
				disabled: e.isBusy || e.phase !== "awaiting_player",
				onClick: o
			}, [
				n[22] ||= G("div", { class: "xy-submit-bg" }, null, -1),
				n[23] ||= G("div", { class: "xy-submit-ripple" }, null, -1),
				G("div", Hf, [K(X, {
					name: e.isBusy ? "sparkles" : "send",
					class: "xy-submit-icon"
				}, null, 8, ["name"]), G("span", Uf, A(a.value), 1)])
			], 10, Vf)
		])], 2));
	}
}, [["__scopeId", "data-v-1eb3dc65"]]), Gf = { class: "xy-timeline-drawer-panel" }, Kf = { class: "xy-drawer-header" }, qf = { class: "xy-drawer-title" }, Jf = { class: "xy-count-badge" }, Yf = { class: "xy-drawer-body xy-custom-scroll" }, Xf = {
	key: 0,
	class: "xy-timeline-stream"
}, Zf = { class: "xy-t-head" }, Qf = { class: "xy-t-round" }, $f = {
	key: 0,
	class: "xy-t-action-id"
}, ep = { class: "xy-t-label" }, tp = { class: "xy-t-outcome" }, np = {
	key: 0,
	class: "xy-t-narrative"
}, rp = {
	key: 1,
	class: "xy-t-narrative-empty"
}, ip = {
	key: 1,
	class: "xy-timeline-empty"
}, ap = {
	key: 2,
	class: "xy-public-events-section"
}, op = { class: "xy-pe-title" }, sp = { class: "xy-pe-list" }, cp = /*#__PURE__*/ al({
	__name: "TimelineDrawer",
	props: {
		isOpen: {
			type: Boolean,
			default: !1
		},
		timeline: {
			type: Array,
			default: () => []
		},
		publicEvents: {
			type: Array,
			default: () => []
		}
	},
	emits: ["close"],
	setup(e) {
		function t(e) {
			return {
				complete: "演进圆满",
				committed: "裁定已定",
				interrupted: "行动中断",
				prepared: "预备就绪"
			}[e] || e;
		}
		return (n, r) => (U(), To(Ms, { name: "xy-drawer-slide" }, {
			default: Ar(() => [e.isOpen ? (U(), W("aside", {
				key: 0,
				class: "xy-timeline-drawer-backdrop",
				onClick: r[1] ||= qc((e) => n.$emit("close"), ["self"])
			}, [G("div", Gf, [G("div", Kf, [G("div", qf, [
				r[2] ||= G("span", { class: "xy-d-icon" }, "⏳", -1),
				r[3] ||= G("span", null, "演武战史与天道批注", -1),
				G("span", Jf, A(e.timeline.length), 1)
			]), G("button", {
				class: "xy-close-drawer-btn",
				onClick: r[0] ||= (e) => n.$emit("close"),
				"aria-label": "收起战史"
			}, "✕")]), G("div", Yf, [e.timeline.length ? (U(), W("div", Xf, [(U(!0), W(V, null, B(e.timeline.slice().reverse(), (e) => (U(), W("article", {
				key: e.actionId || e.roundId,
				class: "xy-timeline-card"
			}, [
				G("div", Zf, [
					G("span", Qf, A(e.roundId), 1),
					G("span", { class: k(["xy-t-status", "st-" + e.status]) }, A(t(e.status)), 3),
					e.actionId ? (U(), W("span", $f, "#" + A(e.actionId.slice(-6)), 1)) : q("", !0)
				]),
				G("h4", ep, "【行动】" + A(e.label), 1),
				G("div", tp, [r[4] ||= G("b", null, "裁定结果：", -1), G("span", null, A(e.outcome || "天道判定无明文"), 1)]),
				e.narrative ? (U(), W("div", np, [r[5] ||= G("b", null, "正文演化：", -1), G("p", null, A(e.narrative), 1)])) : (U(), W("div", rp, [...r[6] ||= [G("span", null, "裁定已确立；等待主剧情推进演化……", -1)]]))
			]))), 128))])) : (U(), W("div", ip, [...r[7] ||= [G("span", null, "战端初起，尚无回合记录。", -1)]])), e.publicEvents.length ? (U(), W("div", ap, [G("h5", op, "可观测天地变数 (" + A(e.publicEvents.length) + ")", 1), G("ol", sp, [(U(!0), W(V, null, B(e.publicEvents.slice(-8), (e, t) => (U(), W("li", { key: t }, A(e), 1))), 128))])])) : q("", !0)])])])) : q("", !0)]),
			_: 1
		}));
	}
}, [["__scopeId", "data-v-f0a0816e"]]), Z = (e) => e === void 0 ? void 0 : JSON.parse(JSON.stringify(e));
function lp(e) {
	return Array.isArray(e) ? `[${e.map(lp).join(",")}]` : e && typeof e == "object" ? `{${Object.keys(e).sort().map((t) => `${JSON.stringify(t)}:${lp(e[t])}`).join(",")}}` : JSON.stringify(e);
}
function up(e) {
	if (e?.aborted) throw new DOMException("操作已停止或聊天作用域已变化", "AbortError");
}
function Q(e, t = []) {
	return typeof e == "string" ? t.filter(Boolean).reduce((e, t) => e.split(t).join("[REDACTED]"), e) : Array.isArray(e) ? e.map((e) => Q(e, t)) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).filter(([e]) => !/^(api[-_]?key|authorization|access[-_]?token|password|credential|secret)$/i.test(e)).map(([e, n]) => [e, Q(n, t)]));
}
function dp(e) {
	return Q({
		kind: e.kind,
		at: e.at,
		actionId: e.actionId || e.request?.actionId || e.internal?.requestMetadata?.actionId,
		roundId: e.roundId || e.request?.roundId,
		requestMetadata: e.internal?.requestMetadata,
		playerVisible: e.playerVisible,
		validation: e.validation || e.internal?.programValidation,
		commit: e.kind === "commit" ? {
			status: "committed",
			version: e.record?.version
		} : void 0,
		bridge: e.kind.startsWith("host_") ? e.capability : void 0
	});
}
//#endregion
//#region src/battle-context.js
var fp = /* @__PURE__ */ new Set([
	"hidden",
	"internal",
	"gm",
	"secret"
]), pp = [
	"techniques",
	"abilities",
	"skills",
	"spells",
	"术法",
	"功法",
	"招式"
];
function mp(e) {
	return typeof e == "string" ? e.trim() : e == null ? "" : String(e);
}
function hp(e) {
	return Array.isArray(e) ? e : e && typeof e == "object" ? Object.entries(e).map(([e, t]) => ({
		name: e,
		description: t
	})) : [];
}
function gp(e, t, n = "known") {
	if (typeof e == "string") return {
		id: `enemy-${e}`,
		name: e,
		description: "已从公开上下文识别名称；具体效果尚未公开。",
		status: n,
		source: t,
		visibility: "public"
	};
	if (!e || typeof e != "object") return null;
	let r = mp(e.visibility || e.exposure || "public").toLowerCase();
	if (fp.has(r)) return null;
	let i = mp(e.name || e.label || e.title || e.id);
	return i ? {
		id: mp(e.id || `enemy-${i}`),
		name: i,
		description: mp(e.description || e.originalDefinition || e.definition || e.summary || "已识别名称；完整效果尚未公开。"),
		mechanics: Array.isArray(e.mechanics) ? Z(e.mechanics) : [],
		status: mp(e.status || n) || n,
		source: t,
		visibility: "public",
		confidence: e.confidence ?? (n === "known" ? "high" : "medium")
	} : null;
}
function _p(e = {}, t = {}) {
	let n = [], r = /* @__PURE__ */ new Set(), i = (e, t, i) => {
		let a = gp(e, t, i);
		a && !r.has(a.id) && (r.add(a.id), n.push(a));
	};
	for (let t of pp) {
		let n = e[t] ?? e.visibleInfo?.[t], r = e.visibleInfo && Object.hasOwn(e.visibleInfo, t);
		for (let e of hp(n)) (t !== "techniques" || r || !e || typeof e != "object" || e.exposed === !0 || ["public", "player"].includes(mp(e.visibility).toLowerCase())) && i(e, `敌方公开资料 · ${t}`, e?.status || (t === "techniques" ? "known" : "inferred"));
	}
	let a = e.visibleInfo?.observedTechniques || e.visibleInfo?.observedAbilities || e.visibleInfo?.可观察招式;
	for (let e of hp(a)) i(e, "本轮公开观察", "inferred");
	if (n.length) return n;
	let o = t.scene?.publicEvents || [], s = mp(e.name);
	for (let e of o) {
		let t = mp(e);
		if (!t || s && !t.includes(s)) continue;
		let n = t.match(/(?:施展|使用|祭出|发动|招式|术式)[：:\s]*([^，。；,.;]+)/);
		n?.[1] && i({
			id: `observed-${n[1].trim()}`,
			name: n[1].trim(),
			description: "从公开战报中观察到的名称，具体效果需由裁定器确认。"
		}, "公开战报", "inferred");
	}
	return n.length || n.push({
		id: `unknown-${e.id || "enemy"}`,
		name: "招式未识别",
		description: "当前上下文没有公开的敌方招式定义。点击可查看信息边界；裁定器仍可依据隐藏上下文判断敌方行动。",
		status: "unknown",
		source: "未发现公开来源",
		visibility: "public",
		confidence: "none"
	}), n;
}
function vp(e) {
	if (typeof e == "string") return {
		id: e,
		label: e,
		lane: "field"
	};
	let t = e?.side || e?.target || (e?.actorId === "player" ? "player" : e?.actorId ? "enemy" : "field"), n = [
		"player",
		"self",
		"ally"
	].includes(t) ? "player" : ["enemy", "opponent"].includes(t) ? "enemy" : "field";
	return {
		...Z(e),
		lane: n,
		label: mp(e?.label || e?.id || "未命名效果")
	};
}
function yp(e = []) {
	let t = {
		player: [],
		enemy: [],
		field: []
	};
	for (let n of e) t[vp(n).lane].push(vp(n));
	return t;
}
//#endregion
//#region src/ui/components/BattleStage.vue
var bp = { class: "xy-battle-stage" }, xp = { class: "xy-stage-arena" }, Sp = { class: "xy-arena-columns" }, Cp = /*#__PURE__*/ al({
	__name: "BattleStage",
	props: {
		view: {
			type: Object,
			default: () => ({})
		},
		state: {
			type: Object,
			default: () => ({})
		},
		controller: {
			type: Object,
			default: null
		}
	},
	emits: [
		"start",
		"next",
		"stop",
		"rewrite",
		"queue",
		"skip-narrative",
		"retry-host",
		"submit"
	],
	setup(e, { emit: t }) {
		let n = e, r = /* @__PURE__ */ on(""), i = /* @__PURE__ */ on(""), a = /* @__PURE__ */ on(""), o = /* @__PURE__ */ on("player"), s = /* @__PURE__ */ on(""), c = /* @__PURE__ */ on(!1), l = /* @__PURE__ */ on(!1), u = Y(() => [
			"judging",
			"narrating",
			"rewrite"
		].includes(n.view.phase)), d = Y(() => n.view.player || {}), f = Y(() => n.view.semanticState || {}), p = Y(() => f.value.effects || []), m = Y(() => yp(p.value)), h = Y(() => m.value.player || []), g = Y(() => m.value.enemy || []), _ = Y(() => n.state.actors?.enemies || n.view.enemies || []), v = Y(() => {
			if (!_.value.length) return null;
			if (s.value) {
				let e = _.value.find((e) => e.id === s.value);
				if (e) return e;
			}
			return _.value[0];
		});
		Lr(v, (e) => {
			e && !s.value && (s.value = e.id);
		}, { immediate: !0 });
		function y(e) {
			s.value = e;
		}
		let b = Y(() => {
			if (!n.controller?.registry) return [];
			let e = n.controller.registry.list().filter((e) => ["public", "player"].includes(e.visibility)), t = n.state.actors?.player?.techniques || [];
			return e.flatMap((e) => e.techniques.filter((n) => ["public", "player"].includes(n.visibility) && t.some((t) => t.registryId === e.id && t.techniqueIds?.includes(n.id))).map((t) => {
				let r = n.controller.registry.availability(e.id, t.id, f.value);
				return {
					...t,
					entry: e,
					status: r
				};
			}));
		}), x = Y(() => v.value ? _p(v.value, n.state) : []), S = Y(() => b.value.map((e) => ({
			id: e.id,
			name: e.name,
			available: e.status?.available ?? !0
		})));
		function C({ side: e, item: t }) {
			a.value = t.id, o.value = e, l.value = !0;
		}
		function w() {
			l.value = !1, a.value = "";
		}
		function T(e) {
			i.value = e, a.value = "", o.value = "player", l.value = !1;
		}
		function ee(e) {
			i.value = e, e ? (a.value = e, o.value = "player") : a.value = "";
		}
		function te(e) {
			i.value = e, a.value = e, o.value = "player";
		}
		let ne = Y(() => a.value ? o.value === "player" ? b.value.find((e) => e.id === a.value) || null : x.value.find((e) => e.id === a.value) || null : null), E = Y(() => o.value === "player" ? ne.value?.entry?.name || "叠浪玄潮决" : v.value?.name || "对手功法"), re = Y(() => ne.value?.status || {
			available: !0,
			reason: ""
		}), D = Y(() => (n.state.history || []).filter((e) => ["committed", "complete"].includes(e.status)).at(-1) || null), ie = Y(() => !!n.controller?.bridgeQueuedAction), ae = Y(() => n.controller?.state?.hostSync?.status === "pending");
		return (t, n) => (U(), W("div", bp, [
			K(Hl),
			G("div", xp, [G("div", Sp, [
				K(td, {
					side: "player",
					actor: d.value,
					effects: h.value,
					techniques: b.value,
					"selected-term-id": a.value,
					"is-modal-open": l.value,
					onSelectPetal: C
				}, null, 8, [
					"actor",
					"effects",
					"techniques",
					"selected-term-id",
					"is-modal-open"
				]),
				K($d, {
					round: e.view.round || 0,
					phase: e.view.phase || "idle",
					"semantic-state": f.value,
					"all-effects": p.value,
					player: d.value,
					"current-enemy": v.value,
					"latest-record": D.value,
					"selected-term-data": null,
					"selected-term-side": o.value,
					"selected-term-parent-name": E.value,
					"selected-term-availability": re.value,
					onClearTerm: n[0] ||= (e) => a.value = "",
					onApplyTechnique: te,
					onOpenHistory: n[1] ||= (e) => c.value = !0
				}, null, 8, [
					"round",
					"phase",
					"semantic-state",
					"all-effects",
					"player",
					"current-enemy",
					"latest-record",
					"selected-term-side",
					"selected-term-parent-name",
					"selected-term-availability"
				]),
				K(td, {
					side: "enemy",
					actor: v.value || {},
					effects: g.value,
					techniques: x.value,
					"selected-term-id": a.value,
					"is-modal-open": l.value,
					"is-selected-target": !0,
					"enemies-list": _.value,
					onSelectPetal: C,
					onSelectTarget: y
				}, null, 8, [
					"actor",
					"effects",
					"techniques",
					"selected-term-id",
					"is-modal-open",
					"enemies-list"
				])
			])]),
			K(Wf, {
				phase: e.view.phase,
				"is-busy": u.value,
				"action-label": r.value,
				"selected-technique-id": i.value,
				"technique-options": S.value,
				"latest-committed": D.value,
				"has-bridge-queued": ie.value,
				"host-sync-pending": ae.value,
				onStart: n[2] ||= (e) => t.$emit("start"),
				onNext: n[3] ||= (e) => t.$emit("next"),
				onStop: n[4] ||= (e) => t.$emit("stop"),
				onRewrite: n[5] ||= (e) => t.$emit("rewrite"),
				onQueue: n[6] ||= (e) => t.$emit("queue"),
				onSkipNarrative: n[7] ||= (e) => t.$emit("skip-narrative"),
				onRetryHost: n[8] ||= (e) => t.$emit("retry-host"),
				onToggleHistory: n[9] ||= (e) => c.value = !c.value,
				onSubmit: n[10] ||= (e) => t.$emit("submit", {
					label: r.value,
					techniqueId: i.value
				}),
				"onUpdate:actionLabel": n[11] ||= (e) => r.value = e,
				"onUpdate:techniqueId": ee
			}, null, 8, [
				"phase",
				"is-busy",
				"action-label",
				"selected-technique-id",
				"technique-options",
				"latest-committed",
				"has-bridge-queued",
				"host-sync-pending"
			]),
			K(Ef, {
				"is-open": l.value,
				"term-data": ne.value,
				"is-player": o.value === "player",
				"parent-name": E.value,
				"availability-status": re.value,
				onClose: w,
				onApply: T
			}, null, 8, [
				"is-open",
				"term-data",
				"is-player",
				"parent-name",
				"availability-status"
			]),
			K(cp, {
				"is-open": c.value,
				timeline: e.view.timeline || [],
				"public-events": e.view.scene?.publicEvents || [],
				onClose: n[12] ||= (e) => c.value = !1
			}, null, 8, [
				"is-open",
				"timeline",
				"public-events"
			])
		]));
	}
}, [["__scopeId", "data-v-83aea667"]]), wp = { class: "xy-settings-panel xy-custom-scroll" }, Tp = { class: "xy-config-card" }, Ep = { class: "xy-form-grid" }, Dp = { class: "xy-form-field" }, Op = { class: "xy-form-field" }, kp = { class: "xy-form-field xy-col-span-2" }, Ap = { class: "xy-form-field xy-col-span-2" }, jp = { class: "xy-password-wrap" }, Mp = ["type"], Np = { class: "xy-form-field" }, Pp = { class: "xy-form-field" }, Fp = { class: "xy-form-field" }, Ip = { class: "xy-form-field" }, Lp = { class: "xy-config-card" }, Rp = { class: "xy-form-grid" }, zp = { class: "xy-form-field" }, Bp = { class: "xy-form-field" }, Vp = { class: "xy-form-field xy-col-span-2" }, Hp = { class: "xy-form-field xy-col-span-2" }, Up = { class: "xy-password-wrap" }, Wp = ["type"], Gp = { class: "xy-form-field" }, Kp = { class: "xy-form-field" }, qp = { class: "xy-config-card" }, Jp = { class: "xy-toggle-row" }, Yp = { class: "xy-checkbox-label" }, Xp = { class: "xy-form-field xy-mt-3" }, Zp = { class: "xy-settings-footer" }, Qp = /*#__PURE__*/ al({
	__name: "SettingsPanel",
	props: { settings: {
		type: Object,
		default: () => ({})
	} },
	emits: ["save", "back"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ on(!1), a = /* @__PURE__ */ on(!1), o = /* @__PURE__ */ Jt({
			judge: {
				mode: "unconfigured",
				endpoint: "",
				model: "",
				apiKey: "",
				maxOutput: 800,
				temperature: .2,
				repairAttempts: 2,
				timeoutMs: 6e4
			},
			narrator: {
				mode: "main_story",
				endpoint: "",
				model: "",
				apiKey: "",
				maxOutput: 1200,
				temperature: .8,
				repairAttempts: 1,
				timeoutMs: 6e4
			},
			autoNarrative: !0,
			originalPrompt: ""
		});
		Lr(() => n.settings, (e) => {
			e && (e.adjudicator && Object.assign(o.judge, e.adjudicator), e.narrator && Object.assign(o.narrator, e.narrator), o.autoNarrative = !!e.autoNarrative, o.originalPrompt = e.originalPrompt || "");
		}, {
			immediate: !0,
			deep: !0
		});
		function s() {
			r("save", {
				adjudicator: { ...o.judge },
				narrator: { ...o.narrator },
				autoNarrative: o.autoNarrative,
				originalPrompt: o.originalPrompt
			});
		}
		return (e, t) => (U(), W("div", wp, [
			t[42] ||= G("div", { class: "xy-panel-header" }, [G("div", null, [G("span", { class: "xy-panel-kicker" }, "INDEPENDENT ADAPTER CONFIGURATION"), G("h2", { class: "xy-panel-title" }, "独立机枢 · 模型与演算法")]), G("p", { class: "xy-panel-desc" }, " 裁定 AI 与正文生成可分别调配独立接入点与参数；敏感秘钥仅驻留内存，绝不落盘或混入战报存档。 ")], -1),
			G("fieldset", Tp, [t[28] ||= G("legend", { class: "xy-card-legend" }, [G("span", { class: "xy-legend-icon" }, "⚖"), G("span", null, "战斗裁定 AI (Adjudicator)")], -1), G("div", Ep, [
				G("label", Dp, [t[20] ||= G("span", { class: "xy-field-label" }, "推理模式", -1), z(G("select", {
					"onUpdate:modelValue": t[0] ||= (e) => o.judge.mode = e,
					class: "xy-input-select"
				}, [...t[19] ||= [
					G("option", { value: "unconfigured" }, "未配置 (拒绝请求，安全保护)", -1),
					G("option", { value: "mock" }, "离线 Mock 演示 (免 API Key 极速验算)", -1),
					G("option", { value: "http" }, "真实 OpenAI-Compatible 接口", -1)
				]], 512), [[Lc, o.judge.mode]])]),
				G("label", Op, [t[21] ||= G("span", { class: "xy-field-label" }, "模型标识 (Model)", -1), z(G("input", {
					"onUpdate:modelValue": t[1] ||= (e) => o.judge.model = e,
					placeholder: "例如: gpt-4o, claude-3-5-sonnet...",
					class: "xy-input-text"
				}, null, 512), [[Nc, o.judge.model]])]),
				G("label", kp, [t[22] ||= G("span", { class: "xy-field-label" }, "服务接入点 (Endpoint)", -1), z(G("input", {
					"onUpdate:modelValue": t[2] ||= (e) => o.judge.endpoint = e,
					placeholder: "https://api.openai.com/v1/chat/completions",
					class: "xy-input-text"
				}, null, 512), [[Nc, o.judge.endpoint]])]),
				G("label", Ap, [t[23] ||= G("span", { class: "xy-field-label" }, [G("span", null, "API Key (仅驻留内存)"), G("small", { class: "xy-field-hint" }, "刷新页面需重填，绝不进入持久化文件")], -1), G("div", jp, [z(G("input", {
					"onUpdate:modelValue": t[3] ||= (e) => o.judge.apiKey = e,
					type: i.value ? "text" : "password",
					placeholder: "sk-...",
					autocomplete: "off",
					class: "xy-input-text"
				}, null, 8, Mp), [[Hc, o.judge.apiKey]]), G("button", {
					type: "button",
					class: "xy-pwd-toggle",
					onClick: t[4] ||= (e) => i.value = !i.value
				}, [K(X, { name: i.value ? "eye-off" : "eye" }, null, 8, ["name"])])])]),
				G("label", Np, [t[24] ||= G("span", { class: "xy-field-label" }, "最大输出 (Max Tokens)", -1), z(G("input", {
					"onUpdate:modelValue": t[5] ||= (e) => o.judge.maxOutput = e,
					type: "number",
					min: "10",
					class: "xy-input-text"
				}, null, 512), [[
					Nc,
					o.judge.maxOutput,
					void 0,
					{ number: !0 }
				]])]),
				G("label", Pp, [t[25] ||= G("span", { class: "xy-field-label" }, "发散温度 (Temperature)", -1), z(G("input", {
					"onUpdate:modelValue": t[6] ||= (e) => o.judge.temperature = e,
					type: "number",
					min: "0",
					max: "2",
					step: "0.1",
					class: "xy-input-text"
				}, null, 512), [[
					Nc,
					o.judge.temperature,
					void 0,
					{ number: !0 }
				]])]),
				G("label", Fp, [t[26] ||= G("span", { class: "xy-field-label" }, "结构容错修复次数", -1), z(G("input", {
					"onUpdate:modelValue": t[7] ||= (e) => o.judge.repairAttempts = e,
					type: "number",
					min: "0",
					max: "3",
					class: "xy-input-text"
				}, null, 512), [[
					Nc,
					o.judge.repairAttempts,
					void 0,
					{ number: !0 }
				]])]),
				G("label", Ip, [t[27] ||= G("span", { class: "xy-field-label" }, "请求超时 (毫秒)", -1), z(G("input", {
					"onUpdate:modelValue": t[8] ||= (e) => o.judge.timeoutMs = e,
					type: "number",
					min: "1000",
					step: "1000",
					class: "xy-input-text"
				}, null, 512), [[
					Nc,
					o.judge.timeoutMs,
					void 0,
					{ number: !0 }
				]])])
			])]),
			G("fieldset", Lp, [t[36] ||= G("legend", { class: "xy-card-legend" }, [G("span", { class: "xy-legend-icon" }, "📜"), G("span", null, "正文演化与主剧情桥接 (Narrator)")], -1), G("div", Rp, [
				G("label", zp, [t[30] ||= G("span", { class: "xy-field-label" }, "桥接模式", -1), z(G("select", {
					"onUpdate:modelValue": t[9] ||= (e) => o.narrator.mode = e,
					class: "xy-input-select"
				}, [...t[29] ||= [Lo("<option value=\"main_story\" data-v-f5646050>酒馆主剧情注入 (推荐，沿用酒馆设定)</option><option value=\"packet\" data-v-f5646050>仅生成场景包 (供剪贴板与第三方调用)</option><option value=\"http\" data-v-f5646050>独立 OpenAI-Compatible 正文模型</option><option value=\"mock\" data-v-f5646050>离线 Mock 演进</option><option value=\"unconfigured\" data-v-f5646050>未配置</option>", 5)]], 512), [[Lc, o.narrator.mode]])]),
				G("label", Bp, [t[31] ||= G("span", { class: "xy-field-label" }, "模型标识 (Model)", -1), z(G("input", {
					"onUpdate:modelValue": t[10] ||= (e) => o.narrator.model = e,
					placeholder: "正文生成模型名...",
					class: "xy-input-text"
				}, null, 512), [[Nc, o.narrator.model]])]),
				G("label", Vp, [t[32] ||= G("span", { class: "xy-field-label" }, "独立接入点 (Endpoint)", -1), z(G("input", {
					"onUpdate:modelValue": t[11] ||= (e) => o.narrator.endpoint = e,
					placeholder: "https://...",
					class: "xy-input-text"
				}, null, 512), [[Nc, o.narrator.endpoint]])]),
				G("label", Hp, [t[33] ||= G("span", { class: "xy-field-label" }, "API Key (仅驻留内存)", -1), G("div", Up, [z(G("input", {
					"onUpdate:modelValue": t[12] ||= (e) => o.narrator.apiKey = e,
					type: a.value ? "text" : "password",
					placeholder: "sk-...",
					autocomplete: "off",
					class: "xy-input-text"
				}, null, 8, Wp), [[Hc, o.narrator.apiKey]]), G("button", {
					type: "button",
					class: "xy-pwd-toggle",
					onClick: t[13] ||= (e) => a.value = !a.value
				}, [K(X, { name: a.value ? "eye-off" : "eye" }, null, 8, ["name"])])])]),
				G("label", Gp, [t[34] ||= G("span", { class: "xy-field-label" }, "最大输出 (Max Tokens)", -1), z(G("input", {
					"onUpdate:modelValue": t[14] ||= (e) => o.narrator.maxOutput = e,
					type: "number",
					min: "50",
					class: "xy-input-text"
				}, null, 512), [[
					Nc,
					o.narrator.maxOutput,
					void 0,
					{ number: !0 }
				]])]),
				G("label", Kp, [t[35] ||= G("span", { class: "xy-field-label" }, "发散温度 (Temperature)", -1), z(G("input", {
					"onUpdate:modelValue": t[15] ||= (e) => o.narrator.temperature = e,
					type: "number",
					min: "0",
					max: "2",
					step: "0.1",
					class: "xy-input-text"
				}, null, 512), [[
					Nc,
					o.narrator.temperature,
					void 0,
					{ number: !0 }
				]])])
			])]),
			G("div", qp, [
				t[39] ||= G("h3", { class: "xy-card-title" }, "宿主桥接与输入契约", -1),
				G("div", Jp, [G("label", Yp, [z(G("input", {
					type: "checkbox",
					"onUpdate:modelValue": t[16] ||= (e) => o.autoNarrative = e,
					class: "xy-checkbox"
				}, null, 512), [[Pc, o.autoNarrative]]), t[37] ||= G("span", null, "裁定提交后，自动备好正文场景包向宿主注入", -1)])]),
				G("label", Xp, [t[38] ||= G("span", { class: "xy-field-label" }, "独立 HTTP 模式下的原始 Prompt（主剧情模式自动保留宿主日常输入）", -1), z(G("textarea", {
					"onUpdate:modelValue": t[17] ||= (e) => o.originalPrompt = e,
					rows: "2",
					class: "xy-input-textarea",
					placeholder: "我抬起弦弓，观察水面与对手的节奏。"
				}, null, 512), [[Nc, o.originalPrompt]])])
			]),
			G("div", Zp, [G("button", {
				class: "xy-save-btn",
				onClick: s
			}, [K(X, { name: "check" }), t[40] ||= G("span", null, "保存机枢设定", -1)]), G("button", {
				class: "xy-back-btn",
				onClick: t[18] ||= (t) => e.$emit("back")
			}, [...t[41] ||= [G("span", null, "返回战场", -1)]])])
		]));
	}
}, [["__scopeId", "data-v-f5646050"]]), $p = { class: "xy-data-panel xy-custom-scroll" }, em = { class: "xy-quick-actions-bar" }, tm = { class: "xy-import-console" }, nm = { class: "xy-console-header" }, rm = { class: "xy-file-upload-btn" }, im = { class: "xy-import-btns" }, am = ["disabled"], om = ["disabled"], sm = ["disabled"], cm = { class: "xy-snapshot-details" }, lm = { class: "xy-snapshot-pre xy-custom-scroll" }, um = /*#__PURE__*/ al({
	__name: "DataPanel",
	props: { snapshot: {
		type: Object,
		default: () => ({})
	} },
	emits: [
		"load-demo",
		"export-full",
		"export-public",
		"import-scene",
		"import-registry",
		"import-save"
	],
	setup(e, { emit: t }) {
		let n = e, r = /* @__PURE__ */ on(""), i = Y(() => JSON.stringify(n.snapshot, null, 2));
		async function a(e) {
			let t = e.target.files?.[0];
			t && (r.value = await t.text());
		}
		return (e, t) => (U(), W("div", $p, [
			t[16] ||= G("div", { class: "xy-panel-header" }, [G("div", null, [G("span", { class: "xy-panel-kicker" }, "SCENE & PRESET MANAGEMENT"), G("h2", { class: "xy-panel-title" }, "演武经卷 · 场景与道藏存档")]), G("p", { class: "xy-panel-desc" }, " 可导入特定世界观战场、角色卡快照与功法 Registry；支持当前分支存档无损导入导出。 ")], -1),
			G("div", em, [
				G("button", {
					class: "xy-action-btn btn-demo",
					onClick: t[0] ||= (t) => e.$emit("load-demo")
				}, [K(X, { name: "sparkles" }), t[7] ||= G("span", null, "载入《叠浪玄潮决》演示场景", -1)]),
				G("button", {
					class: "xy-action-btn",
					onClick: t[1] ||= (t) => e.$emit("export-full")
				}, [K(X, { name: "copy" }), t[8] ||= G("span", null, "导出完整战局存档 (JSON)", -1)]),
				G("button", {
					class: "xy-action-btn",
					onClick: t[2] ||= (t) => e.$emit("export-public")
				}, [K(X, { name: "scroll" }), t[9] ||= G("span", null, "导出公开战报摘要", -1)])
			]),
			G("div", tm, [
				G("div", nm, [t[11] ||= G("span", { class: "xy-console-title" }, "经卷解析与录入 (JSON)", -1), G("label", rm, [t[10] ||= G("span", null, "选择本地 JSON 文件", -1), G("input", {
					type: "file",
					accept: "application/json,.json",
					onChange: a,
					class: "xy-hidden-input"
				}, null, 32)])]),
				z(G("textarea", {
					"onUpdate:modelValue": t[3] ||= (e) => r.value = e,
					class: "xy-json-textarea xy-custom-scroll",
					rows: "10",
					placeholder: "粘贴 battle_v2_scene、battle_v2_export 或 registry JSON 文本……"
				}, null, 512), [[Nc, r.value]]),
				G("div", im, [
					G("button", {
						class: "xy-imp-btn",
						disabled: !r.value.trim(),
						onClick: t[4] ||= (t) => e.$emit("import-scene", r.value)
					}, [...t[12] ||= [G("span", null, "导入为新场景", -1)]], 8, am),
					G("button", {
						class: "xy-imp-btn",
						disabled: !r.value.trim(),
						onClick: t[5] ||= (t) => e.$emit("import-registry", r.value)
					}, [...t[13] ||= [G("span", null, "导入功法 Registry", -1)]], 8, om),
					G("button", {
						class: "xy-imp-btn btn-danger",
						disabled: !r.value.trim(),
						onClick: t[6] ||= (t) => e.$emit("import-save", r.value)
					}, [...t[14] ||= [G("span", null, "恢复分支存档", -1)]], 8, sm)
				])
			]),
			G("details", cm, [t[15] ||= G("summary", { class: "xy-snapshot-summary" }, [G("span", null, "当前环境与角色快照 (包含内部状态与裁定器上下文)")], -1), G("pre", lm, A(i.value), 1)])
		]));
	}
}, [["__scopeId", "data-v-66484a01"]]), dm = { class: "xy-dev-panel xy-custom-scroll" }, fm = { class: "xy-dev-actions" }, pm = {
	class: "xy-log-section",
	open: ""
}, mm = { class: "xy-log-pre xy-custom-scroll" }, hm = { class: "xy-log-list-container" }, gm = { class: "xy-list-title" }, _m = {
	key: 0,
	class: "xy-log-items"
}, vm = { class: "xy-item-summary" }, ym = {
	key: 0,
	class: "xy-item-action"
}, bm = { class: "xy-item-time" }, xm = { class: "xy-item-pre xy-custom-scroll" }, Sm = {
	key: 1,
	class: "xy-empty-logs"
}, Cm = /*#__PURE__*/ al({
	__name: "DeveloperPanel",
	props: {
		aiContext: {
			type: Object,
			default: () => ({})
		},
		logs: {
			type: Array,
			default: () => []
		}
	},
	emits: [
		"copy-debug",
		"export-debug",
		"export-public"
	],
	setup(e) {
		let t = e, n = Y(() => JSON.stringify(t.aiContext, null, 2)), r = Y(() => t.logs.slice().reverse());
		function i(e) {
			return JSON.stringify(e, null, 2);
		}
		return (t, a) => (U(), W("div", dm, [
			a[8] ||= G("div", { class: "xy-panel-header" }, [G("div", null, [G("span", { class: "xy-panel-kicker" }, "TIANDAO AUDIT & MODEL PROMPTS"), G("h2", { class: "xy-panel-title" }, "天道秘录 · 裁定审计与日志")]), G("p", { class: "xy-panel-desc" }, " 完整记录裁定模型接收的结构化上下文、原始输入输出、规则校验及宿主契约收据。敏感凭据已自动脱敏。 ")], -1),
			G("div", fm, [
				G("button", {
					class: "xy-dev-btn",
					onClick: a[0] ||= (e) => t.$emit("copy-debug")
				}, [K(X, { name: "copy" }), a[3] ||= G("span", null, "复制完整开发审计 JSON", -1)]),
				G("button", {
					class: "xy-dev-btn",
					onClick: a[1] ||= (e) => t.$emit("export-debug")
				}, [K(X, { name: "scroll" }), a[4] ||= G("span", null, "导出开发审计文件 (JSON)", -1)]),
				G("button", {
					class: "xy-dev-btn",
					onClick: a[2] ||= (e) => t.$emit("export-public")
				}, [K(X, { name: "eye" }), a[5] ||= G("span", null, "导出公开脱敏战报", -1)])
			]),
			G("details", pm, [a[6] ||= G("summary", { class: "xy-sec-summary" }, [G("span", { class: "xy-sec-tag" }, "AI READ CONTEXT"), G("span", null, "当前裁定器实际读取的完整结构化上下文 (含敌方 Hidden 信息)")], -1), G("pre", mm, A(n.value), 1)]),
			G("div", hm, [G("h3", gm, "模型与程序事件流水 (" + A(e.logs.length) + ")", 1), e.logs.length ? (U(), W("div", _m, [(U(!0), W(V, null, B(r.value, (e, t) => (U(), W("details", {
				key: t,
				class: "xy-log-detail-item"
			}, [G("summary", vm, [
				G("span", { class: k(["xy-item-kind", "kind-" + e.kind]) }, A(e.kind), 3),
				e.actionId ? (U(), W("span", ym, "#" + A(e.actionId.slice(-6)), 1)) : q("", !0),
				G("span", bm, A(e.at), 1)
			]), G("pre", xm, A(i(e)), 1)]))), 128))])) : (U(), W("div", Sm, [...a[7] ||= [G("span", null, "尚无调用日志。进行裁定、正文生成或宿主同步后将自动记述于此。", -1)]]))])
		]));
	}
}, [["__scopeId", "data-v-cd04e2a1"]]);
//#endregion
//#region src/utils.js
function wm(e, t) {
	if (typeof document > "u") return !1;
	let n = new Blob([t], { type: "application/json;charset=utf-8" }), r = URL.createObjectURL(n), i = document.createElement("a");
	return i.href = r, i.download = e, i.click(), setTimeout(() => URL.revokeObjectURL(r), 0), !0;
}
var Tm = {
	id: "gongfa.dielang-xuanchaojue",
	name: "叠浪玄潮诀",
	rank: "演示摘录（非权威全本）",
	element: "水·弦",
	corePrinciple: "以弦势引潮，以叠潮积势，再以回弦回收冲击；潮眼是可观察的稳定窗口。",
	mechanics: [
		"语义状态优先",
		"弦势与叠潮可并存",
		"回弦会改变站位与压制关系",
		"潮眼出现时下一次相关行动更容易稳定"
	],
	techniques: [
		{
			id: "xianshi",
			name: "弦势",
			originalDefinition: "以无形弦线建立身体、武器与目标之间的牵引方向。",
			mechanics: ["建立牵引方向", "可改变站位解释"],
			availability: {
				default: "available",
				conditions: ["需要可感知的目标或媒介"],
				requires: []
			},
			triggeredState: ["弦势已建立"],
			visibility: "player",
			ruleRefs: ["wave-string.1"],
			rawDescription: "以无形弦线建立身体、武器与目标之间的牵引方向。"
		},
		{
			id: "dielang",
			name: "叠潮",
			originalDefinition: "将连续动作的余势叠入同一潮线，形成累积压制。",
			mechanics: ["叠加前序余势", "不直接等价固定伤害"],
			availability: {
				default: "conditional",
				conditions: ["弦势已建立或已有潮势"],
				requires: [{
					path: "statuses",
					op: "includes",
					value: "xianshi:triggered"
				}]
			},
			triggeredState: ["叠潮层数变化"],
			visibility: "player",
			ruleRefs: ["wave-stack.1"],
			rawDescription: "将连续动作的余势叠入同一潮线，形成累积压制。"
		},
		{
			id: "huixian",
			name: "回弦",
			originalDefinition: "沿已建立弦线收回自身或冲击，重置部分距离关系。",
			mechanics: ["回收冲击", "可能改变站位"],
			availability: {
				default: "conditional",
				conditions: ["存在弦势"],
				requires: [{
					path: "statuses",
					op: "includes",
					value: "xianshi:triggered"
				}]
			},
			triggeredState: ["回弦窗口打开"],
			visibility: "player",
			ruleRefs: ["wave-recoil.1"],
			rawDescription: "沿已建立弦线收回自身或冲击，重置部分距离关系。"
		},
		{
			id: "chaoyan",
			name: "潮眼",
			originalDefinition: "叠潮中的短暂稳定点，可用于观察敌方破绽与重定节奏。",
			mechanics: ["稳定语义状态", "允许更可靠的下一步判断"],
			availability: {
				default: "conditional",
				conditions: ["叠潮达到临界或裁定明确形成"],
				requires: [{
					path: "statuses",
					op: "includes",
					value: "dielang:triggered"
				}]
			},
			triggeredState: ["潮眼存在"],
			visibility: "player",
			ruleRefs: ["wave-eye.1"],
			rawDescription: "叠潮中的短暂稳定点，可用于观察敌方破绽与重定节奏。"
		},
		{
			id: "zhendang-huichao",
			name: "颤弓·回潮",
			originalDefinition: "令弦势短促震颤，把外放的潮势折返至弓身与脚下。",
			mechanics: ["折返外放潮势", "可缓解被压制的站位"],
			availability: {
				default: "conditional",
				conditions: ["有可回收潮势"],
				requires: [{
					path: "statuses",
					op: "includes",
					value: "huixian:triggered"
				}]
			},
			triggeredState: ["回潮已触发"],
			visibility: "player",
			ruleRefs: ["wave-return.1"],
			rawDescription: "令弦势短促震颤，把外放的潮势折返至弓身与脚下。"
		},
		{
			id: "fanyin-chaoyan",
			name: "泛音·潮眼",
			originalDefinition: "在潮眼内叠加泛音，让观察到的微小偏差成为可用的节奏信号。",
			mechanics: ["放大可见偏差", "为下一次行动提供叙事依据"],
			availability: {
				default: "conditional",
				conditions: ["潮眼存在"],
				requires: [{
					path: "潮眼",
					op: "truthy"
				}]
			},
			triggeredState: ["泛音已触发"],
			visibility: "player",
			ruleRefs: ["wave-harmonic.1"],
			rawDescription: "在潮眼内叠加泛音，让观察到的微小偏差成为可用的节奏信号。"
		}
	],
	synergies: [
		"弦势→叠潮→潮眼",
		"潮眼→泛音·潮眼",
		"回弦→颤弓·回潮"
	],
	narrativeGuidance: ["用水面、弦鸣、回流和站位描写状态变化", "不要把语义状态自动换算为固定伤害"],
	version: "1.0.0",
	visibility: "player",
	ruleRefs: ["wave-core.1", "semantic-state.1"],
	source: {
		kind: "demonstration",
		note: "仅验证 registry/UI；原始功法全文应以经用户确认的世界书来源导入。"
	}
}, Em = [
	"mechanics",
	"techniques",
	"synergies",
	"narrativeGuidance",
	"ruleRefs"
], Dm = /* @__PURE__ */ new Set([
	"public",
	"player",
	"gm",
	"internal"
]);
function Om(e, t) {
	if (typeof e != "string" || !e.trim()) throw Error(`${t} 必须是非空文字`);
}
function km(e) {
	let t = [
		"id",
		"name",
		"rank",
		"element",
		"corePrinciple",
		...Em,
		"version",
		"visibility"
	].filter((t) => !(t in (e || {})));
	if (t.length) throw Error(`功法字段缺失：${t.join(",")}`);
	for (let t of [
		"id",
		"name",
		"rank",
		"element",
		"corePrinciple",
		"version"
	]) Om(e[t], t);
	if (!Dm.has(e.visibility)) throw Error("visibility 无效");
	for (let t of Em) if (!Array.isArray(e[t])) throw Error(`${t} 必须是数组`);
	let n = /* @__PURE__ */ new Set();
	for (let t of e.techniques) {
		for (let e of [
			"id",
			"name",
			"originalDefinition",
			"mechanics",
			"availability",
			"triggeredState",
			"visibility",
			"ruleRefs"
		]) if (!(e in t)) throw Error(`词条缺少 ${e}`);
		for (let e of [
			"id",
			"name",
			"originalDefinition"
		]) Om(t[e], e);
		if (n.has(t.id)) throw Error(`词条 id 重复：${t.id}`);
		if (n.add(t.id), !Array.isArray(t.mechanics) || !Array.isArray(t.triggeredState) || !Array.isArray(t.ruleRefs) || !t.ruleRefs.length || !Dm.has(t.visibility)) throw Error(`词条 ${t.id} 结构无效`);
		if (![
			"available",
			"conditional",
			"unavailable"
		].includes(t.availability?.default) || !Array.isArray(t.availability.conditions)) throw Error(`词条 ${t.id} 可用性定义无效`);
	}
	if (!e.ruleRefs.length || e.ruleRefs.some((e) => typeof e != "string" || !e.trim())) throw Error("ruleRefs 不得为空");
	return !0;
}
function Am(e, t) {
	return String(t).split(".").reduce((e, t) => e?.[t], e);
}
function jm(e, t) {
	let n = Am(e, t.path);
	return t.op === "includes" ? Array.isArray(n) && n.includes(t.value) : t.op === "truthy" ? !!n : t.op === "equals" ? n === t.value : t.op === "not" && n !== t.value;
}
var Mm = class {
	constructor(e = [Tm]) {
		this.entries = /* @__PURE__ */ new Map(), e.forEach((e) => this.register(e));
	}
	register(e) {
		if (km(e), this.entries.has(e.id)) throw Error(`功法已存在：${e.id}`);
		return this.entries.set(e.id, Z(e)), this;
	}
	get(e) {
		return Z(this.entries.get(e));
	}
	list() {
		return [...this.entries.values()].map(Z);
	}
	snapshot() {
		return this.list();
	}
	technique(e, t) {
		return this.get(e)?.techniques.find((e) => e.id === t);
	}
	findTechnique(e) {
		for (let t of this.list()) {
			let n = t.techniques.find((t) => t.id === e);
			if (n) return {
				entry: t,
				technique: n
			};
		}
	}
	availability(e, t, n = {}) {
		let r = this.technique(e, t);
		if (!r) return {
			available: !1,
			state: "unavailable",
			reason: "词条不存在",
			triggered: !1
		};
		let i = r.availability.requires || [], a = r.availability.default !== "unavailable" && (i.length ? i.every((e) => jm(n, e)) : r.availability.default === "available"), o = (n.statuses || []).some((e) => e === `${t}:triggered`) || (n.effects || []).some((e) => typeof e == "string" ? e.startsWith(`${t}`) : e.techniqueId === t);
		return {
			available: a,
			state: a ? "available" : "conditional",
			reason: r.availability.conditions.join("；"),
			triggered: o
		};
	}
}, Nm = Object.freeze([
	"idle",
	"active",
	"awaiting_player",
	"judging",
	"committed",
	"narrating",
	"awaiting_next",
	"ended",
	"rewrite"
]), Pm = [
	"statuses",
	"effects",
	"positions",
	"control"
];
function Fm({ sessionId: e = `battle-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, chatId: t = "default-chat", branchId: n = "main", location: r = "未设定地点", time: i = "未设定时间", player: a, enemies: o = [], registrySnapshot: s = [], semanticState: c, resourceRules: l = [], scene: u = {} } = {}) {
	return {
		schema: "battle_v2",
		version: 1,
		sessionId: e,
		scope: {
			chatId: String(t),
			branchId: String(n),
			extension: "st-xybattle-sys"
		},
		phase: "idle",
		round: 0,
		roundId: null,
		actionSeq: 0,
		scene: {
			location: r,
			time: i,
			turn: 0,
			initiative: "pending",
			positions: {},
			publicEvents: [],
			...Z(u)
		},
		actors: {
			player: Z(a || {
				id: "player",
				name: "主角",
				visibleInfo: "可见",
				resources: {},
				techniques: []
			}),
			enemies: Z(o)
		},
		semanticState: {
			statuses: [],
			effects: [],
			positions: {},
			control: "均势",
			...Z(c || {})
		},
		resourceRules: Z(l),
		registrySnapshot: Z(s),
		history: [],
		pending: null,
		lastError: null,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function Im(e, t, n = {}) {
	return {
		...e,
		...n,
		phase: t,
		version: e.version + 1,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function Lm(e, t) {
	if (!t.includes(e.phase)) throw Error(`当前状态 ${e.phase} 不允许此操作，需要 ${t.join("/")}`);
}
function Rm(e) {
	return Lm(e, ["idle", "ended"]), Im(e, "awaiting_player", {
		round: e.round + 1,
		roundId: `${e.sessionId}-r${e.round + 1}`,
		scene: {
			...e.scene,
			turn: e.round + 1
		},
		pending: null,
		lastError: null
	});
}
function zm(e, t = "用户停止") {
	return Im(e, "ended", { lastError: t });
}
function Bm(e) {
	if (!e || e.schema !== "battle_v2" || !Nm.includes(e.phase) || !e.scope || !e.actors || !e.semanticState || !Array.isArray(e.history) || !Array.isArray(e.registrySnapshot)) throw Error("无法恢复：不是有效 battle_v2 会话");
	let t = Z(e);
	if (new Mm(t.registrySnapshot), t.resourceRules ||= [], [
		"judging",
		"narrating",
		"rewrite",
		"active",
		"committed"
	].includes(t.phase)) {
		let e = t.history.at(-1), n = e && ["committed", "complete"].includes(e.status);
		if (t.phase === "judging" && t.pending) {
			let e = t.history.find((e) => e.actionId === t.pending.actionId);
			e && (e.status = "interrupted");
		}
		t.phase = n ? "awaiting_next" : t.roundId ? "awaiting_player" : "idle", t.pending = null, t.lastError = "检测到上次操作中断；已提交事实保留，未完成请求不会自动重发。";
	}
	return t;
}
function Vm(e = []) {
	return e.flatMap((e) => typeof e == "string" || !Number.isInteger(e.remainingRounds) ? [e] : e.remainingRounds > 1 ? [{
		...e,
		remainingRounds: e.remainingRounds - 1
	}] : []);
}
function Hm(e) {
	Lm(e, ["awaiting_next", "committed"]);
	let t = {
		...e.semanticState,
		effects: Vm(e.semanticState.effects)
	};
	return Rm({
		...e,
		phase: "ended",
		semanticState: t
	});
}
function Um(e) {
	return {
		...Z(e),
		effects: (e.effects || []).filter((e) => typeof e == "string" || [
			"public",
			"player",
			void 0
		].includes(e.visibility))
	};
}
function Wm(e) {
	return {
		schema: e.schema,
		version: e.version,
		scope: Z(e.scope),
		phase: e.phase,
		round: e.round,
		roundId: e.roundId,
		scene: Z(e.scene),
		semanticState: Um(e.semanticState),
		player: Z(e.actors.player),
		enemies: e.actors.enemies.map((e) => ({
			id: e.id,
			name: e.name,
			visibleInfo: Z(e.visibleInfo || {})
		})),
		timeline: e.history.filter((e) => ["committed", "complete"].includes(e.status)).slice(-12).map((e) => ({
			actionId: e.actionId,
			roundId: e.roundId,
			label: e.action?.label,
			outcome: e.adjudication?.summary,
			narrative: e.narrative?.text,
			status: e.status
		}))
	};
}
function Gm(e) {
	return {
		session: {
			id: e.sessionId,
			version: e.version,
			round: e.round,
			phase: e.phase,
			scope: Z(e.scope)
		},
		scene: Z(e.scene),
		actors: Z(e.actors),
		semanticState: Z(e.semanticState),
		resourceRules: Z(e.resourceRules),
		registry: Z(e.registrySnapshot),
		priorCommittedFacts: e.history.filter((e) => ["committed", "complete"].includes(e.status)).map((e) => Z(e.adjudication))
	};
}
function Km(e, t, n = {}) {
	if (Lm(e, ["awaiting_player"]), !t || typeof t.label != "string" || !t.label.trim()) throw Error("行动需要非空 label");
	let r = Gm(e);
	if (t.techniqueId) {
		let n = new Mm(e.registrySnapshot), r = n.findTechnique(t.techniqueId);
		if (!r) throw Error("行动功法未注册");
		if (!(e.actors.player.techniques || []).some((e) => e.registryId === r.entry.id && e.techniqueIds?.includes(t.techniqueId))) throw Error("主角未拥有该词条");
		let i = n.availability(r.entry.id, t.techniqueId, e.semanticState);
		if (!i.available) throw Error(`本轮词条条件不足：${i.reason}`);
	}
	let i = n.adjudicator || n;
	return {
		type: "BATTLE_ADJUDICATION_REQUEST",
		actionId: t.actionId || `${e.sessionId}-a${e.actionSeq + 1}`,
		roundId: e.roundId,
		version: e.version,
		scope: Z(e.scope),
		settings: {
			model: i.model || "",
			temperature: i.temperature ?? .2,
			maxOutput: i.maxOutput ?? 1600,
			repairAttempts: i.repairAttempts ?? 2
		},
		action: {
			label: t.label.trim(),
			techniqueId: t.techniqueId || null,
			intent: t.intent || ""
		},
		context: r,
		playerVisibleContext: Wm(e),
		prompt: qm(r, t)
	};
}
function qm(e, t) {
	return [
		"你是独立 battle_v2 战斗裁定器。只依据给定结构化上下文和原始功法定义裁定本轮，不使用酒馆主预设。",
		"只返回 JSON：{summary,before,after,reason,ruleRefs,publicEvents,confidence,resourceChanges?}。before/after 是完整 semanticState；summary/publicEvents 只含玩家可观察事实；hidden 用于决定内部因果，不得泄露。",
		"资源只按 resourceRules 定义的边界改变，未定义数值不得创建。语义站位、压制、破绽和持续效果优先。effects 对象格式：{id,label,techniqueId?,remainingRounds:正整数,visibility:\"public\"|\"player\"|\"gm\"|\"internal\",ruleRefs:[]}；不设remainingRounds表示直到显式终止。",
		`行动 JSON：${JSON.stringify(t)}`,
		`完整上下文 JSON：${JSON.stringify(e)}`,
		"可选 resourceChanges 是 [{actorId,resource,before,after,reason,ruleRefs}]，只能改变resourceRules已声明的角色资源；没有变更请省略。",
		"ruleRefs 必须引用给定 registry/resourceRules 中的精确引用。禁止自由编造规则；不返回演员整表、不复写 session/version。"
	].join("\n");
}
function Jm(e) {
	return !e || typeof e != "object" ? typeof e == "string" && e.length > 3 ? [e] : [] : Object.values(e).flatMap(Jm);
}
function Ym(e, t, { allowMock: n = !1 } = {}) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw Error("裁定响应不是对象");
	for (let t of [
		"summary",
		"before",
		"after",
		"reason",
		"ruleRefs",
		"publicEvents"
	]) if (!(t in e)) throw Error(`裁定缺少字段 ${t}`);
	if (typeof e.summary != "string" || !e.summary.trim() || typeof e.reason != "string" || !e.reason.trim() || !Array.isArray(e.ruleRefs) || !e.ruleRefs.length || !Array.isArray(e.publicEvents)) throw Error("裁定字段类型或非空约束错误");
	if (lp(e.before) !== lp(t.semanticState)) throw Error("裁定 before 与当前状态不一致");
	if (!e.after || Array.isArray(e.after) || typeof e.after != "object") throw Error("after 必须是完整对象");
	let r = Object.keys(t.semanticState);
	for (let t of r) if (!(t in e.after)) throw Error(`after 缺少 ${t}`);
	let i = /* @__PURE__ */ new Set([...Pm, ...r]);
	for (let t of Object.keys(e.after)) if (!i.has(t)) throw Error(`裁定越权修改字段 ${t}`);
	for (let [n, r] of Object.entries(t.semanticState)) {
		let i = e.after[n];
		if (Array.isArray(r) ? !Array.isArray(i) : typeof r != typeof i || r && typeof r == "object" && (i === null || Array.isArray(i))) throw Error(`语义字段类型不匹配：${n}`);
		if (typeof r == "number" && r !== i && !(t.resourceRules || []).some((e) => e.path === n)) throw Error(`未定义资源规则：${n}`);
	}
	let a = new Set(t.registrySnapshot.flatMap((e) => [...e.ruleRefs, ...e.techniques.flatMap((e) => e.ruleRefs)]).concat((t.resourceRules || []).flatMap((e) => e.ruleRefs || [])));
	for (let t of e.ruleRefs) if (typeof t != "string" || !a.has(t) && !(n && t.startsWith("mock."))) throw Error(`未知 ruleRef：${t}`);
	for (let n of (t.resourceRules || []).filter((e) => e.path)) {
		let t = n.path.split(".").reduce((e, t) => e?.[t], e.after);
		if (typeof t != "number" || !Number.isFinite(t) || t < (n.min ?? -Infinity) || t > (n.max ?? Infinity)) throw Error(`资源边界不合法：${n.path}`);
	}
	for (let t of e.after.effects || []) if (typeof t != "string") {
		if (!t || typeof t.id != "string" || typeof t.label != "string" || ![
			"public",
			"player",
			"gm",
			"internal"
		].includes(t.visibility) || !Array.isArray(t.ruleRefs) || t.remainingRounds !== void 0 && (!Number.isInteger(t.remainingRounds) || t.remainingRounds < 1)) throw Error("持续效果结构无效");
		for (let e of t.ruleRefs) if (!a.has(e) && !(n && e.startsWith("mock."))) throw Error(`效果引用未知规则：${e}`);
	}
	let o = e.resourceChanges === void 0 ? [] : e.resourceChanges;
	if (!Array.isArray(o)) throw Error("resourceChanges 必须是数组");
	let s = /* @__PURE__ */ new Set();
	for (let e of o) {
		let n = [t.actors.player, ...t.actors.enemies].find((t) => t.id === e.actorId), r = t.resourceRules.find((t) => t.actorId === e.actorId && t.resource === e.resource), i = `${e.actorId}:${e.resource}`;
		if (!n || !r || !Object.hasOwn(n.resources || {}, e.resource)) throw Error("资源变化没有角色/权威规则定义");
		if (s.has(i)) throw Error("资源重复变更");
		if (s.add(i), !Number.isFinite(e.before) || !Number.isFinite(e.after) || e.before !== n.resources[e.resource]) throw Error("资源 before/after 不是当前有限数");
		if (e.after < (r.min ?? -Infinity) || e.after > (r.max ?? Infinity)) throw Error("资源变化超出世界规则边界");
		if (typeof e.reason != "string" || !e.reason.trim() || !Array.isArray(e.ruleRefs) || !e.ruleRefs.length || !e.ruleRefs.some((e) => r.ruleRefs.includes(e)) || e.ruleRefs.some((e) => !a.has(e))) throw Error("资源变化缺少权威reason/ruleRefs");
	}
	let c = JSON.stringify({
		summary: e.summary,
		publicEvents: e.publicEvents,
		after: Um(e.after)
	});
	for (let e of t.actors.enemies.flatMap((e) => Jm(e.hidden))) if (c.includes(e)) throw Error("裁定公开结果包含敌方隐藏信息，拒绝发布");
	return {
		summary: e.summary,
		before: Z(e.before),
		after: Z(e.after),
		reason: e.reason,
		ruleRefs: Z(e.ruleRefs),
		publicEvents: e.publicEvents.map(String),
		...e.resourceChanges === void 0 ? {} : { resourceChanges: Z(o) },
		confidence: Number.isFinite(e.confidence) ? e.confidence : null
	};
}
function Xm(e, t, n) {
	return {
		type: "BATTLE_SCENE_PACKET",
		schema: "battle_v2",
		scope: Z(e.scope),
		sessionId: e.sessionId,
		roundId: t.roundId,
		actionId: t.actionId,
		preserveUserPrompt: !0,
		committedFacts: [t.adjudication.summary, ...t.adjudication.publicEvents],
		location: e.scene.location,
		time: e.scene.time,
		publicEvents: Z(e.scene.publicEvents),
		descriptionRequirements: ["描写本轮可见因果和语义状态变化", "保持角色信息边界"],
		prohibitions: [
			"禁止复判本轮行动",
			"禁止新增未提交数值结算",
			"禁止泄露隐藏敌情"
		],
		nextDecisionPoint: "等待玩家选择下一步行动",
		playerVisibleContext: Wm(e),
		originalAction: Z(n.action)
	};
}
function Zm(e) {
	return typeof e == "string" ? { text: e } : {
		text: String(e?.text || ""),
		pending: e?.pending === !0,
		metadata: Z(e?.metadata || {})
	};
}
async function Qm(e, t, { adjudicator: n, narrator: r, settings: i = {}, signal: a, save: o = () => {}, logger: s = () => {}, onCommit: c = () => {} } = {}) {
	let l = t?.actionId ? e.history.find((e) => e.actionId === t.actionId) : null;
	if (l) return {
		state: e,
		record: Z(l),
		deduplicated: !0
	};
	let u = Km(e, t, i), d = n?.isMock === !0 || (i.adjudicator?.mode || i.mode) === "mock", f = {
		actionId: u.actionId,
		roundId: u.roundId,
		action: Z(u.action),
		status: "prepared",
		version: e.version,
		before: Z(e.semanticState)
	}, p = Im(e, "judging", {
		actionSeq: e.actionSeq + 1,
		pending: {
			actionId: u.actionId,
			roundId: u.roundId
		},
		history: [...e.history, f]
	});
	s({
		kind: "adjudication_request",
		actionId: u.actionId,
		roundId: u.roundId,
		aiRead: Z(u.context),
		playerVisible: u.playerVisibleContext,
		request: Z(u),
		internal: { requestMetadata: {
			type: u.type,
			actionId: u.actionId,
			roundId: u.roundId,
			version: u.version,
			settings: u.settings
		} }
	}), await o(p);
	let m, h, g = u.settings.repairAttempts;
	try {
		for (let t = 0;; t += 1) try {
			m = t === 0 ? await n.judge(u, {
				signal: a,
				logger: s
			}) : await n.repair(u, m, h, {
				signal: a,
				logger: s
			}), up(a), s({
				kind: "ai_raw_response",
				actionId: u.actionId,
				rawResponse: Z(m),
				repairAttempt: t
			}), h = Ym(m, e, { allowMock: d }), s({
				kind: "program_validation",
				actionId: u.actionId,
				validation: {
					valid: !0,
					repairAttempt: t
				}
			});
			break;
		} catch (e) {
			if (up(a), s({
				kind: "program_validation",
				actionId: u.actionId,
				validation: {
					valid: !1,
					error: e.message,
					repairAttempt: t
				}
			}), m = e.rawContent ?? m, t >= g || typeof n.repair != "function" || m === void 0) throw e;
			h = e;
		}
	} catch (e) {
		throw p = Im(p, "awaiting_player", {
			pending: null,
			lastError: e.message,
			history: p.history.map((t) => t.actionId === u.actionId ? {
				...t,
				status: e.name === "AbortError" ? "interrupted" : "rejected",
				error: e.message
			} : t)
		}), a?.aborted || await o(p), e;
	}
	let _ = Z(p.actors);
	for (let e of h.resourceChanges || []) {
		let t = [_.player, ..._.enemies].find((t) => t.id === e.actorId);
		t.resources[e.resource] = e.after;
	}
	p = Im(p, "committed", {
		actors: _,
		semanticState: Z(h.after),
		scene: {
			...p.scene,
			publicEvents: [...p.scene.publicEvents, ...h.publicEvents]
		},
		pending: null
	});
	let v = {
		...f,
		status: "committed",
		version: p.version,
		adjudication: h,
		before: Z(e.semanticState),
		after: Z(p.semanticState),
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	v.narrativePacket = Xm(p, v, u), p = {
		...p,
		history: p.history.map((e) => e.actionId === v.actionId ? v : e)
	}, up(a), await o(p), s({
		kind: "commit",
		actionId: v.actionId,
		playerVisible: Wm(p),
		record: Z(v),
		internal: {
			programValidation: { valid: !0 },
			aiRawResponse: Z(m)
		}
	});
	let y = await c(Z(v), p);
	if (up(a), y?.allowed === !1) return p = Im(p, "awaiting_next", {
		lastError: y.reason || "宿主保存待确认；裁定已保留，不重裁",
		history: p.history.map((e) => e.actionId === v.actionId ? {
			...v,
			narrativeError: y.reason
		} : e)
	}), await o(p), {
		state: p,
		record: Z(p.history.find((e) => e.actionId === v.actionId)),
		request: u,
		deduplicated: !1
	};
	if (i.autoNarrative === !1) return p = Im(p, "awaiting_next"), await o(p), s({
		kind: "narrative_packet",
		actionId: v.actionId,
		packet: v.narrativePacket
	}), {
		state: p,
		record: Z(v),
		request: u,
		deduplicated: !1
	};
	p = Im(p, "narrating", { pending: {
		actionId: v.actionId,
		roundId: v.roundId
	} }), await o(p);
	let b;
	try {
		b = Zm(await r.generate(v.narrativePacket, {
			signal: a,
			logger: s,
			originalPrompt: i.originalPrompt || ""
		})), up(a);
	} catch (e) {
		throw p = Im(p, "awaiting_next", {
			pending: null,
			lastError: e.message,
			history: p.history.map((t) => t.actionId === v.actionId ? {
				...v,
				narrativeError: e.message
			} : t)
		}), a?.aborted || await o(p), e;
	}
	let x = {
		...v,
		narrative: b,
		status: b.pending ? "committed" : "complete"
	};
	return p = Im(p, "awaiting_next", {
		history: p.history.map((e) => e.actionId === v.actionId ? x : e),
		pending: null,
		lastError: null
	}), await o(p), s({
		kind: "narrative_result",
		actionId: v.actionId,
		packet: v.narrativePacket,
		narrative: b
	}), {
		state: p,
		record: Z(x),
		request: u,
		deduplicated: !1
	};
}
async function $m(e, t, n, { signal: r, save: i = () => {}, logger: a = () => {}, originalPrompt: o = "" } = {}) {
	Lm(e, [
		"awaiting_next",
		"committed",
		"ended"
	]);
	let s = e.history.find((e) => e.actionId === t && ["committed", "complete"].includes(e.status));
	if (!s?.narrativePacket) throw Error("找不到可重写的已提交行动");
	let c = Im(e, "rewrite", { pending: {
		actionId: t,
		roundId: s.roundId
	} });
	await i(c);
	let l;
	try {
		l = Zm(await n.rewrite(s.narrativePacket, s.narrative, {
			signal: r,
			logger: a,
			originalPrompt: o
		})), up(r);
	} catch (e) {
		throw r?.aborted || await i(Im(c, "awaiting_next", {
			pending: null,
			lastError: e.message
		})), e;
	}
	let u = {
		...s,
		narrative: l,
		status: l.pending ? "committed" : "complete",
		rewrittenAt: (/* @__PURE__ */ new Date()).toISOString()
	}, d = Im(c, "awaiting_next", {
		history: c.history.map((e) => e.actionId === t ? u : e),
		pending: null,
		lastError: null
	});
	return await i(d), a({
		kind: "rewrite",
		actionId: t,
		packet: s.narrativePacket,
		narrative: l
	}), {
		state: d,
		record: Z(u)
	};
}
var eh = {
	schema: "battle_v2_scene",
	scene: {
		location: "离线演示·临水练武台",
		time: "清晨",
		initiative: "玩家先行"
	},
	actors: {
		player: {
			id: "player",
			name: "演示主角",
			visibleInfo: {
				境界: "演示设定",
				装备: "弦弓"
			},
			resources: {},
			techniques: [{
				registryId: "gongfa.dielang-xuanchaojue",
				techniqueIds: [
					"xianshi",
					"dielang",
					"huixian",
					"chaoyan",
					"zhendang-huichao",
					"fanyin-chaoyan"
				]
			}]
		},
		enemies: [{
			id: "enemy-1",
			name: "演示对手",
			visibleInfo: {
				姿态: "守势",
				站位: "中距",
				observedTechniques: [{
					id: "guard-wave",
					name: "守势回流",
					description: "从公开动作中观察到的回流式守势；完整效果仍交由裁定器判断。"
				}]
			},
			hidden: { strategy: "隐藏战术仅供裁定器读取" },
			resources: {},
			techniques: []
		}]
	},
	semanticState: {
		statuses: [],
		effects: [],
		positions: {
			player: "近岸",
			"enemy-1": "台心"
		},
		control: "均势",
		潮眼: !1,
		回弦: !1,
		站位: "中距",
		压制: "均势",
		破绽: []
	},
	registry: [{
		id: "gongfa.dielang-xuanchaojue",
		name: "叠浪玄潮诀",
		rank: "演示摘录（非权威全本）",
		element: "水·弦",
		corePrinciple: "以弦势引潮，以叠潮积势，再以回弦回收冲击；潮眼是可观察的稳定窗口。",
		mechanics: [
			"语义状态优先",
			"弦势与叠潮可并存",
			"回弦会改变站位与压制关系",
			"潮眼出现时下一次相关行动更容易稳定"
		],
		techniques: [
			{
				id: "xianshi",
				name: "弦势",
				originalDefinition: "以无形弦线建立身体、武器与目标之间的牵引方向。",
				mechanics: ["建立牵引方向", "可改变站位解释"],
				availability: {
					default: "available",
					conditions: ["需要可感知的目标或媒介"],
					requires: []
				},
				triggeredState: ["弦势已建立"],
				visibility: "player",
				ruleRefs: ["wave-string.1"],
				rawDescription: "以无形弦线建立身体、武器与目标之间的牵引方向。"
			},
			{
				id: "dielang",
				name: "叠潮",
				originalDefinition: "将连续动作的余势叠入同一潮线，形成累积压制。",
				mechanics: ["叠加前序余势", "不直接等价固定伤害"],
				availability: {
					default: "conditional",
					conditions: ["弦势已建立或已有潮势"],
					requires: [{
						path: "statuses",
						op: "includes",
						value: "xianshi:triggered"
					}]
				},
				triggeredState: ["叠潮层数变化"],
				visibility: "player",
				ruleRefs: ["wave-stack.1"],
				rawDescription: "将连续动作的余势叠入同一潮线，形成累积压制。"
			},
			{
				id: "huixian",
				name: "回弦",
				originalDefinition: "沿已建立弦线收回自身或冲击，重置部分距离关系。",
				mechanics: ["回收冲击", "可能改变站位"],
				availability: {
					default: "conditional",
					conditions: ["存在弦势"],
					requires: [{
						path: "statuses",
						op: "includes",
						value: "xianshi:triggered"
					}]
				},
				triggeredState: ["回弦窗口打开"],
				visibility: "player",
				ruleRefs: ["wave-recoil.1"],
				rawDescription: "沿已建立弦线收回自身或冲击，重置部分距离关系。"
			},
			{
				id: "chaoyan",
				name: "潮眼",
				originalDefinition: "叠潮中的短暂稳定点，可用于观察敌方破绽与重定节奏。",
				mechanics: ["稳定语义状态", "允许更可靠的下一步判断"],
				availability: {
					default: "conditional",
					conditions: ["叠潮达到临界或裁定明确形成"],
					requires: [{
						path: "statuses",
						op: "includes",
						value: "dielang:triggered"
					}]
				},
				triggeredState: ["潮眼存在"],
				visibility: "player",
				ruleRefs: ["wave-eye.1"],
				rawDescription: "叠潮中的短暂稳定点，可用于观察敌方破绽与重定节奏。"
			},
			{
				id: "zhendang-huichao",
				name: "颤弓·回潮",
				originalDefinition: "令弦势短促震颤，把外放的潮势折返至弓身与脚下。",
				mechanics: ["折返外放潮势", "可缓解被压制的站位"],
				availability: {
					default: "conditional",
					conditions: ["有可回收潮势"],
					requires: [{
						path: "statuses",
						op: "includes",
						value: "huixian:triggered"
					}]
				},
				triggeredState: ["回潮已触发"],
				visibility: "player",
				ruleRefs: ["wave-return.1"],
				rawDescription: "令弦势短促震颤，把外放的潮势折返至弓身与脚下。"
			},
			{
				id: "fanyin-chaoyan",
				name: "泛音·潮眼",
				originalDefinition: "在潮眼内叠加泛音，让观察到的微小偏差成为可用的节奏信号。",
				mechanics: ["放大可见偏差", "为下一次行动提供叙事依据"],
				availability: {
					default: "conditional",
					conditions: ["潮眼存在"],
					requires: [{
						path: "潮眼",
						op: "truthy"
					}]
				},
				triggeredState: ["泛音已触发"],
				visibility: "player",
				ruleRefs: ["wave-harmonic.1"],
				rawDescription: "在潮眼内叠加泛音，让观察到的微小偏差成为可用的节奏信号。"
			}
		],
		synergies: [
			"弦势→叠潮→潮眼",
			"潮眼→泛音·潮眼",
			"回弦→颤弓·回潮"
		],
		narrativeGuidance: ["用水面、弦鸣、回流和站位描写状态变化", "不要把语义状态自动换算为固定伤害"],
		version: "1.0.0",
		visibility: "player",
		ruleRefs: ["wave-core.1", "semantic-state.1"],
		source: {
			kind: "demonstration",
			note: "仅验证 registry/UI；原始功法全文应以经用户确认的世界书来源导入。"
		}
	}]
}, th = {
	id: "xybattle-v2-root",
	class: "xy-root-container"
}, nh = {
	id: "xybattle-v2-panel",
	class: "xy-workbench-panel",
	role: "dialog",
	"aria-label": "独立战斗工作台"
}, rh = { class: "xy-notice-icon" }, ih = { class: "xy-notice-text" }, ah = {
	__name: "App",
	props: {
		controller: {
			type: Object,
			required: !0
		},
		hostAdapter: {
			type: Object,
			default: null
		}
	},
	setup(e, { expose: t }) {
		let n = e, r = /* @__PURE__ */ on(!1), i = /* @__PURE__ */ on("workbench"), a = /* @__PURE__ */ on(""), o = /* @__PURE__ */ sn(n.controller.playerView()), s = /* @__PURE__ */ sn(n.controller.state);
		function c() {
			o.value = n.controller.playerView(), s.value = n.controller.state;
		}
		n.controller.onChange = () => {
			c();
		};
		let l = Y(() => o.value.phase === "judging"), u = Y(() => {
			let e = o.value.phase;
			return e === "judging" ? "裁定中" : e === "narrating" ? "正文中" : e === "awaiting_next" ? "待下轮" : "";
		}), d = /* @__PURE__ */ Jt({
			x: null,
			y: null
		}), f = null, p = !1, m = Y(() => d.x === null || d.y === null ? {} : {
			left: `${d.x}px`,
			top: `${d.y}px`,
			right: "auto",
			bottom: "auto"
		});
		function h(e) {
			f = {
				startX: e.clientX,
				startY: e.clientY,
				initialLeft: e.currentTarget.offsetLeft,
				initialTop: e.currentTarget.offsetTop
			}, p = !1, e.currentTarget.setPointerCapture?.(e.pointerId);
			let t = (e) => {
				if (!f) return;
				let t = e.clientX - f.startX, n = e.clientY - f.startY;
				if (Math.abs(t) + Math.abs(n) > 5) {
					p = !0;
					let e = window.innerWidth - 70, r = window.innerHeight - 70;
					d.x = Math.max(10, Math.min(e, f.initialLeft + t)), d.y = Math.max(10, Math.min(r, f.initialTop + n));
				}
			}, n = (e) => {
				f = null, window.removeEventListener("pointermove", t), window.removeEventListener("pointerup", n);
			};
			window.addEventListener("pointermove", t), window.addEventListener("pointerup", n);
		}
		function g() {
			if (p) {
				p = !1;
				return;
			}
			r.value = !r.value;
		}
		function _() {
			r.value = !1;
		}
		function v(e) {
			e.key === "Escape" && r.value && _();
		}
		yi(() => {
			window.addEventListener("keydown", v);
		}), Ci(() => {
			window.removeEventListener("keydown", v);
		});
		async function y() {
			try {
				a.value = "", n.controller.start(), c();
			} catch (e) {
				a.value = e.message;
			}
		}
		async function b() {
			try {
				a.value = "", n.controller.continueNext(), c();
			} catch (e) {
				a.value = e.message;
			}
		}
		function x() {
			try {
				a.value = "", n.controller.stop(), c();
			} catch (e) {
				a.value = e.message;
			}
		}
		async function S({ label: e, techniqueId: t }) {
			try {
				a.value = "", await n.controller.submit({
					label: e,
					techniqueId: t || null
				}), c();
			} catch (e) {
				a.value = e.message;
			}
		}
		async function C() {
			try {
				a.value = "";
				let e = s.value.history?.filter((e) => ["committed", "complete"].includes(e.status)).at(-1);
				if (!e) return;
				await n.controller.rewrite(e.actionId), c();
			} catch (e) {
				a.value = e.message;
			}
		}
		async function w() {
			try {
				a.value = "";
				let e = s.value.history?.filter((e) => ["committed", "complete"].includes(e.status)).at(-1);
				if (!e) return;
				let t = n.hostAdapter?.scope?.() || s.value.scope;
				await n.controller.queueMainStory(e, t), a.value = "场景包已交给宿主适配器；请在酒馆正常发送下一条 Prompt。", c();
			} catch (e) {
				a.value = e.message;
			}
		}
		function T() {
			try {
				n.controller.skipPendingNarrative(), a.value = "已跳过本轮正文，裁定事实已完整保留", c();
			} catch (e) {
				a.value = e.message;
			}
		}
		async function ee() {
			try {
				let e = await n.controller.retryHostPersistence();
				a.value = e?.confirmed ? "宿主持久化已确认" : `保存待确认：${e?.reason || "无宿主能力"}`, c();
			} catch (e) {
				a.value = e.message;
			}
		}
		function te(e) {
			try {
				n.controller.setSettings(e), a.value = "独立机枢设定已保存；敏感凭据绝不落盘", c();
			} catch (e) {
				a.value = e.message;
			}
		}
		function ne() {
			try {
				n.controller.importScene(eh), a.value = "已成功载入《叠浪玄潮决》演示场景", c();
			} catch (e) {
				a.value = e.message;
			}
		}
		function E() {
			wm(`battle-v2-save-${Date.now()}.json`, n.controller.exportData());
		}
		function re() {
			wm(`battle-v2-public-${Date.now()}.json`, JSON.stringify(n.controller.playerView(), null, 2));
		}
		function D() {
			wm(`battle-v2-public-logs-${Date.now()}.json`, n.controller.logExport());
		}
		function ie() {
			wm(`battle-v2-developer-logs-${Date.now()}.json`, n.controller.debugLogExport());
		}
		async function ae() {
			await navigator.clipboard.writeText(n.controller.debugLogExport()), a.value = "已复制完整天道开发审计日志";
		}
		function oe(e) {
			try {
				n.controller.importScene(e), a.value = "场景已成功导入", c();
			} catch (e) {
				a.value = e.message;
			}
		}
		function se(e) {
			try {
				n.controller.importRegistry(e), a.value = "功法 Registry 已成功导入", c();
			} catch (e) {
				a.value = e.message;
			}
		}
		function ce(e) {
			try {
				n.controller.importData(e), a.value = "当前分支战局存档已恢复", c();
			} catch (e) {
				a.value = e.message;
			}
		}
		let O = Y(() => ({
			scene: s.value.scene,
			actors: s.value.actors,
			semanticState: s.value.semanticState,
			resourceRules: s.value.resourceRules
		})), le = Y(() => Q(Gm(s.value), n.controller.secrets()));
		return t({
			open: () => {
				r.value = !0;
			},
			close: () => {
				r.value = !1;
			}
		}), (t, n) => (U(), W("div", th, [G("button", {
			ref: "launcherRef",
			id: "xybattle-v2-launcher",
			class: k(["xy-launcher-seal", {
				"is-active": r.value,
				"is-judging": l.value
			}]),
			style: fe(m.value),
			"aria-label": "开启水·弦独立战斗工作台",
			onPointerdown: h,
			onClick: g
		}, [
			n[3] ||= G("div", { class: "xy-seal-ring" }, null, -1),
			n[4] ||= G("div", { class: "xy-seal-inner" }, [G("span", { class: "xy-seal-icon" }, "⚔"), G("span", { class: "xy-seal-text" }, "战斗")], -1),
			u.value ? (U(), W("span", {
				key: 0,
				class: k(["xy-launcher-badge", "bg-" + o.value.phase])
			}, A(u.value), 3)) : q("", !0)
		], 38), K(Ms, { name: "xy-modal-fade" }, {
			default: Ar(() => [r.value ? (U(), W("div", {
				key: 0,
				class: "xy-modal-backdrop",
				onClick: qc(_, ["self"])
			}, [G("section", nh, [
				K(Bl, {
					scene: o.value.scene,
					"semantic-state": o.value.semanticState,
					round: o.value.round || 0,
					version: o.value.version || 1,
					phase: o.value.phase || "idle",
					scope: o.value.scope || {
						chatId: "",
						branchId: ""
					},
					"current-tab": i.value,
					"adjudicator-mode": e.controller.settings?.adjudicator?.mode || "unconfigured",
					"log-count": e.controller.logs?.length || 0,
					"onUpdate:tab": n[0] ||= (e) => i.value = e,
					onClose: _
				}, null, 8, [
					"scene",
					"semantic-state",
					"round",
					"version",
					"phase",
					"scope",
					"current-tab",
					"adjudicator-mode",
					"log-count"
				]),
				K(Ms, { name: "xy-notice-slide" }, {
					default: Ar(() => [a.value || s.value.lastError ? (U(), W("div", {
						key: 0,
						class: k(["xy-notice-banner", { "is-error": !!s.value.lastError }]),
						role: "status"
					}, [
						G("span", rh, A(s.value.lastError ? "⚠️" : "✨"), 1),
						G("span", ih, A(a.value || s.value.lastError), 1),
						G("button", {
							class: "xy-notice-dismiss",
							onClick: n[1] ||= (e) => {
								a.value = "", s.value.lastError = "";
							}
						}, "✕")
					], 2)) : q("", !0)]),
					_: 1
				}),
				G("div", { class: k(["xy-content-body xy-custom-scroll", { "is-scrollable": i.value !== "workbench" }]) }, [z(K(Cp, {
					view: o.value,
					state: s.value,
					controller: e.controller,
					onStart: y,
					onNext: b,
					onStop: x,
					onRewrite: C,
					onQueue: w,
					onSkipNarrative: T,
					onRetryHost: ee,
					onSubmit: S
				}, null, 8, [
					"view",
					"state",
					"controller"
				]), [[Xs, i.value === "workbench"]]), i.value === "settings" ? (U(), To(Qp, {
					key: 0,
					settings: e.controller.settings,
					onSave: te,
					onBack: n[2] ||= (e) => i.value = "workbench"
				}, null, 8, ["settings"])) : i.value === "data" ? (U(), To(um, {
					key: 1,
					snapshot: O.value,
					onLoadDemo: ne,
					onExportFull: E,
					onExportPublic: re,
					onImportScene: oe,
					onImportRegistry: se,
					onImportSave: ce
				}, null, 8, ["snapshot"])) : i.value === "developer" ? (U(), To(Cm, {
					key: 2,
					"ai-context": le.value,
					logs: e.controller.logs || [],
					onCopyDebug: ae,
					onExportDebug: ie,
					onExportPublic: D
				}, null, 8, ["ai-context", "logs"])) : q("", !0)], 2)
			])])) : q("", !0)]),
			_: 1
		})]));
	}
};
//#endregion
//#region src/adapters.js
function oh(e = {}) {
	let t = {
		mode: "unconfigured",
		endpoint: "",
		model: "",
		maxOutput: 1600,
		temperature: .2,
		repairAttempts: 2,
		timeoutMs: 6e4
	}, n = {
		...t,
		...e.adjudicator || {}
	};
	if (!e.adjudicator) for (let r of Object.keys(t).concat("apiKey")) e[r] !== void 0 && (n[r] = e[r]);
	let r = {
		...t,
		mode: "main_story",
		temperature: .7,
		...e.narrator
	};
	!e.narrator && e.mode === "mock" && (r.mode = "mock"), !e.narrator && e.mode === "http" && Object.assign(r, {
		...n,
		repairAttempts: 0
	});
	for (let e of [n, r]) {
		if (![
			"unconfigured",
			"http",
			"mock",
			"main_story",
			"packet"
		].includes(e.mode)) throw Error("未知模型模式");
		if (e.temperature = Number(e.temperature), e.maxOutput = Number(e.maxOutput), e.repairAttempts = Number(e.repairAttempts), e.timeoutMs = Number(e.timeoutMs), !Number.isFinite(e.temperature) || e.temperature < 0 || e.temperature > 2 || !Number.isInteger(e.maxOutput) || e.maxOutput < 1 || !Number.isInteger(e.repairAttempts) || e.repairAttempts < 0 || e.repairAttempts > 3 || !Number.isFinite(e.timeoutMs) || e.timeoutMs < 100) throw Error("模型参数无效（温度0~2；修复0~3）");
	}
	return {
		adjudicator: n,
		narrator: r,
		autoNarrative: e.autoNarrative !== !1,
		originalPrompt: e.originalPrompt || "",
		developerLogs: e.developerLogs !== !1
	};
}
function sh(e) {
	if (e && typeof e == "object") return Z(e);
	let t = String(e || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
	try {
		return JSON.parse(t);
	} catch {
		let e = t.indexOf("{"), n = t.lastIndexOf("}");
		if (e >= 0 && n > e) return JSON.parse(t.slice(e, n + 1));
		throw Error("AI 响应不是合法 JSON");
	}
}
var ch = class {
	async judge() {
		throw Error("未配置裁定 AI；请在独立设置中选择 HTTP，或明确选择离线 Mock 演示");
	}
}, lh = class {
	async generate() {
		throw Error("未配置正文 AI；默认可选择主剧情一次性注入");
	}
	async rewrite() {
		return this.generate();
	}
}, uh = class {
	constructor() {
		this.mode = "main_story";
	}
	async generate() {
		return {
			pending: !0,
			text: "",
			metadata: {
				mode: "main_story",
				status: "waiting_for_normal_generation"
			}
		};
	}
	async rewrite() {
		return this.generate();
	}
}, dh = class extends uh {
	constructor() {
		super(), this.mode = "packet";
	}
}, fh = class {
	constructor() {
		this.calls = [], this.isMock = !0;
	}
	async judge(e, { signal: t } = {}) {
		up(t), this.calls.push(Z(e));
		let n = Z(e.context.semanticState), r = Z(n), i = e.action.techniqueId;
		return "潮眼" in r && i === "chaoyan" && (r.潮眼 = !0), "回弦" in r && i === "huixian" && (r.回弦 = !0), "站位" in r && i === "xianshi" && (r.站位 = "中近距"), "压制" in r && i === "dielang" && (r.压制 = "我方取得节奏"), "破绽" in r && i === "fanyin-chaoyan" && (r.破绽 = ["敌方节奏出现可见偏差"]), r.statuses = [.../* @__PURE__ */ new Set([...r.statuses || [], ...i ? [`${i}:triggered`] : []])], r.effects = [...(r.effects || []).filter((e) => e.id !== `mock-${i}`), ...i ? [{
			id: `mock-${i}`,
			label: `${i}余势`,
			techniqueId: i,
			remainingRounds: 2,
			visibility: "public",
			ruleRefs: ["mock.semantic.1"]
		}] : []], {
			summary: `离线裁定：${e.action.label}`,
			before: n,
			after: r,
			reason: "Mock 仅验证结构、语义状态和幂等流程。",
			ruleRefs: ["mock.semantic.1"],
			publicEvents: [`${e.action.label}造成可观察的节奏变化`],
			confidence: .5
		};
	}
}, ph = class {
	constructor() {
		this.calls = [], this.mode = "mock";
	}
	async generate(e) {
		return this.calls.push(e), { text: `【离线正文演示】${e.originalAction.label}使${e.location}的节奏发生变化。下一决策点：${e.nextDecisionPoint}` };
	}
	async rewrite(e) {
		return this.calls.push({
			rewrite: !0,
			packet: e
		}), { text: `【离线重写】保留已提交事实：${e.committedFacts.join("；")}。` };
	}
};
async function mh(e, t, n = {}) {
	if (!e.endpoint || !e.model) throw Error("HTTP 适配器缺少 endpoint 或 model");
	up(n.signal);
	let r = new AbortController(), i = () => r.abort();
	n.signal?.addEventListener("abort", i, { once: !0 });
	let a = setTimeout(i, e.timeoutMs ?? 6e4), o = { "content-type": "application/json" };
	e.apiKey && (o.authorization = `Bearer ${e.apiKey}`);
	let s = {
		model: e.model,
		messages: t,
		temperature: e.temperature ?? .2,
		max_tokens: e.maxOutput ?? 1600,
		stream: !1
	};
	n.jsonMode && e.jsonMode === !0 && (s.response_format = { type: "json_object" }), n.logger?.({
		kind: "model_request",
		requestMetadata: {
			model: e.model,
			temperature: s.temperature,
			maxOutput: s.max_tokens
		},
		body: Z(s)
	});
	try {
		let t = await fetch(e.endpoint, {
			method: "POST",
			headers: o,
			signal: r.signal,
			body: JSON.stringify(s)
		}), i = await t.text();
		if (n.logger?.({
			kind: "model_response",
			metadata: {
				status: t.status,
				requestId: t.headers.get("x-request-id"),
				model: e.model
			},
			rawResponse: i
		}), !t.ok) throw Error(`模型 API ${t.status}（详情见开发者日志）`);
		let a = JSON.parse(i);
		return {
			content: a.result ?? a.choices?.[0]?.message?.content ?? a.output_text ?? a.text ?? a,
			metadata: {
				model: a.model || e.model,
				usage: a.usage || null
			}
		};
	} finally {
		clearTimeout(a), n.signal?.removeEventListener("abort", i);
	}
}
var hh = class {
	constructor(e = {}) {
		this.config = {
			timeoutMs: 6e4,
			repairAttempts: 2,
			...e
		}, this.isMock = !1;
	}
	async judge(e, t = {}) {
		let n = await mh({
			...this.config,
			temperature: this.config.temperature ?? e.settings.temperature,
			maxOutput: this.config.maxOutput ?? e.settings.maxOutput
		}, [{
			role: "system",
			content: "你是独立战斗裁定器。只依据给定规则返回 JSON，不描写正文。"
		}, {
			role: "user",
			content: e.prompt
		}], {
			...t,
			jsonMode: !0
		});
		try {
			return sh(n.content);
		} catch (e) {
			throw e.rawContent = n.content, e;
		}
	}
	async repair(e, t, n, r = {}) {
		let i = [{
			role: "system",
			content: "这是结构修复；保持原行动裁定事实，禁止重新裁定。只修复 JSON 和被程序指出的字段。"
		}, {
			role: "user",
			content: `${e.prompt}\n原返回：${JSON.stringify(t)}\n程序拒绝原因：${n.message}`
		}];
		return sh((await mh(this.config, i, {
			...r,
			jsonMode: !0
		})).content);
	}
}, gh = class {
	constructor(e = {}) {
		this.config = {
			timeoutMs: 6e4,
			...e
		}, this.mode = "http";
	}
	async generate(e, t = {}) {
		return this.generateFromBattlePacket(t.originalPrompt ?? this.config.originalPrompt ?? "", e, t);
	}
	async generateFromBattlePacket(e, t, n = {}) {
		let r = [{
			role: "system",
			content: `依据已提交战斗场景描写，禁止复判；禁止新增未提交结算。\nBATTLE_SCENE_PACKET:\n${JSON.stringify(t)}`
		}, {
			role: "user",
			content: e || "继续描写这一已提交战斗场景。"
		}], i = await mh(this.config, r, n);
		return {
			text: typeof i.content == "string" ? i.content : JSON.stringify(i.content),
			metadata: i.metadata
		};
	}
	async rewrite(e, t, n = {}) {
		return this.generateFromBattlePacket(`${n.originalPrompt ?? this.config.originalPrompt ?? ""}\n重写正文，保持提交事实：${t?.text || ""}`, e, n);
	}
}, _h = "battle_v2";
function vh(e) {
	return JSON.stringify([String(e.chatId || "default-chat"), String(e.branchId || "main")]);
}
var yh = class e {
	constructor(e = globalThis.localStorage, t = {
		chatId: "default-chat",
		branchId: "main"
	}) {
		this.storage = e && typeof e.getItem == "function" ? e : null, this.scope = {
			chatId: String(t.chatId || "default-chat"),
			branchId: String(t.branchId || "main")
		}, this.token = encodeURIComponent(vh(this.scope)), this.memory = /* @__PURE__ */ new Map();
	}
	withScope(t) {
		return new e(this.storage, t);
	}
	key(e) {
		return `${_h}.${e}.${this.token}`;
	}
	readSettings() {
		return this.read(`${_h}.settings`, this.read(this.key("settings"), {}));
	}
	writeSettings(e) {
		let t = Q(e);
		return this.write(`${_h}.settings`, t), t;
	}
	readSession() {
		return this.read(this.key("session"), null);
	}
	writeSession(e) {
		if (e?.scope && (e.scope.chatId !== this.scope.chatId || e.scope.branchId !== this.scope.branchId)) throw Error("存储作用域不匹配，拒绝串写");
		return this.write(this.key("session"), Q(e)), e;
	}
	readLogs() {
		return this.read(this.key("logs"), []);
	}
	replaceLogs(e) {
		return this.write(this.key("logs"), Q(e)), e;
	}
	appendLog(e) {
		let t = [...this.readLogs(), {
			...e,
			at: (/* @__PURE__ */ new Date()).toISOString()
		}].slice(-300);
		return this.replaceLogs(t);
	}
	clear() {
		for (let e of ["session", "logs"]) this.storage?.removeItem(this.key(e));
		this.memory.clear();
	}
	read(e, t) {
		let n = this.storage?.getItem(e) || this.memory.get(e);
		if (!n) return t;
		try {
			return JSON.parse(n);
		} catch {
			return t;
		}
	}
	write(e, t) {
		let n = JSON.stringify(t);
		this.storage ? this.storage.setItem(e, n) : this.memory.set(e, n);
	}
};
//#endregion
//#region src/battle-controller.js
function bh(e = {}) {
	let t = oh(e), n = t.adjudicator, r = t.narrator;
	return {
		adjudicator: n.mode === "mock" ? new fh() : n.mode === "http" ? new hh(n) : new ch(),
		narrator: r.mode === "mock" ? new ph() : r.mode === "http" ? new gh(r) : r.mode === "main_story" ? new uh() : r.mode === "packet" ? new dh() : new lh()
	};
}
var xh = class {
	constructor({ storage: e, chatId: t = "default-chat", branchId: n = "main", adjudicator: r, narrator: i, hostAdapter: a, registry: o = new Mm(), onChange: s = () => {}, initialScene: c = {}, initialPlayer: l, initialEnemies: u = [], semanticState: d } = {}) {
		this.storage = e instanceof yh ? e : new yh(e, {
			chatId: t,
			branchId: n
		}), this.registry = o, this.settings = oh(this.storage.readSettings());
		let f = bh(this.settings);
		this.adjudicator = r || f.adjudicator, this.narrator = i || f.narrator, this.customAdapters = {
			adjudicator: r,
			narrator: i
		}, this.hostAdapter = a, this.onChange = s, this.epoch = 0, this.inFlight = null, this.checkpoints = Promise.resolve(), this.bridgeQueuedAction = null, this.initialOptions = {
			registrySnapshot: o.snapshot(),
			player: l || this.defaultPlayer(),
			enemies: u,
			...c,
			semanticState: d
		};
		let p = this.storage.readSession();
		this.state = p ? Bm(p) : Fm({
			...this.initialOptions,
			chatId: t,
			branchId: n
		}), p && (this.registry = new Mm(this.state.registrySnapshot)), this.logs = this.storage.readLogs(), this.ready = Promise.resolve(), a && (a.start?.(), this.unsubScope = a.subscribeScopeChange?.((e) => {
			this.ready = this.switchScope(e);
		}), this.unsubNarrative = a.subscribeNarrative?.((e) => this.recordHostNarrative(e)), this.ready = this.initializeHost());
	}
	defaultPlayer() {
		return {
			id: "player",
			name: "主角",
			visibleInfo: "导入真实场景后再裁定",
			resources: {},
			techniques: [{
				registryId: "gongfa.dielang-xuanchaojue",
				techniqueIds: this.registry.list()[0]?.techniques.map((e) => e.id) || []
			}]
		};
	}
	async initializeHost() {
		return await this.hostAdapter.ready?.(), await this.switchScope(this.hostAdapter.scope?.() || this.state.scope, !1), this;
	}
	async switchScope(e, t = !0) {
		let n = this.storage.readSession();
		t && (this.cancelPending("聊天/分支切换"), this.hostAdapter?.clearScenePacket?.());
		let r = this.state.scope;
		(r.chatId !== String(e.chatId) || r.branchId !== String(e.branchId)) && (this.storage = this.storage.withScope(e), n = this.storage.readSession(), this.state = n ? Bm(n) : Fm({
			...this.initialOptions,
			chatId: e.chatId,
			branchId: e.branchId
		}), this.logs = this.storage.readLogs());
		let i = this.epoch, a = await this.hostAdapter?.loadSession?.(e);
		if (i === this.epoch) {
			if (a?.loaded && a.state) {
				let e = Bm(a.state);
				e.scope.chatId === this.state.scope.chatId && e.scope.branchId === this.state.scope.branchId && (!n || e.sessionId === this.state.sessionId && e.version >= this.state.version || Date.parse(e.updatedAt) > Date.parse(this.state.updatedAt) ? (this.state = e, this.storage.writeSession(e)) : this.log({
					kind: "host_local_ahead",
					capability: { reason: "本地checkpoint比宿主新，将重试持久化；不回退回合" }
				}));
			}
			this.registry = new Mm(this.state.registrySnapshot), this.emit();
		}
	}
	emit() {
		if (this.storage.writeSession(Q(this.state, this.secrets())), this.onChange(this.state, Wm(this.state)), this.hostAdapter) {
			let e = Z(this.state), t = Z(this.hostAdapter.scope?.() || this.state.scope), n = this.epoch;
			this.checkpoints = this.checkpoints.catch(() => {}).then(async () => {
				if (n !== this.epoch) return {
					persisted: !1,
					confirmed: !1,
					stale: !0
				};
				let r = await this.persistToHost(null, e, t);
				return n === this.epoch && this.state.version === e.version && (this.state.hostSync = {
					status: r?.persisted && r?.confirmed ? "confirmed" : "pending",
					reason: r?.reason || null
				}, this.storage.writeSession(Q(this.state, this.secrets())), this.onChange(this.state, Wm(this.state))), r;
			});
		}
	}
	secrets() {
		return [this.settings.adjudicator.apiKey, this.settings.narrator.apiKey];
	}
	log(e) {
		this.logs = this.storage.appendLog(Q(e, this.secrets()));
	}
	setSettings(e) {
		if (this.inFlight) throw Error("请求中不能更换模型设置");
		let t = {
			...this.settings,
			...e
		};
		return e.adjudicator && (t.adjudicator = {
			...this.settings.adjudicator,
			...e.adjudicator
		}), e.narrator && (t.narrator = {
			...this.settings.narrator,
			...e.narrator
		}), e.mode !== void 0 && (delete t.adjudicator, delete t.narrator), this.settings = oh(t), this.storage.writeSettings(this.settings), this.setAdapters(bh(this.settings)), this.emit(), this.settings;
	}
	setAdapters({ adjudicator: e, narrator: t } = {}) {
		e && (this.adjudicator = e), t && (this.narrator = t);
	}
	start() {
		return this.assertIdleRequest(), this.state = Rm(this.state), this.emit(), this.state;
	}
	cancelPending() {
		this.epoch += 1, this.inFlight?.abort(), this.inFlight = null, this.bridgeQueuedAction = null;
	}
	stop(e = "用户停止") {
		return this.cancelPending(), this.hostAdapter?.clearScenePacket?.(), this.state = zm({
			...this.state,
			history: this.state.history.map((t) => t.status === "prepared" ? {
				...t,
				status: "interrupted",
				error: e
			} : t)
		}, e), this.emit(), this.state;
	}
	continueNext() {
		if (this.assertIdleRequest(), this.bridgeQueuedAction) throw Error("本轮场景包仍等待主剧情生成；请先生成正文或跳过本轮正文");
		return this.state = Hm(this.state), this.emit(), this.state;
	}
	assertIdleRequest() {
		if (this.inFlight) throw Error("正在处理本轮请求，请等待或停止");
	}
	async persistToHost(e, t, n) {
		if (!this.hostAdapter) return {
			persisted: !0,
			confirmed: !0,
			localOnly: !0
		};
		try {
			let r = await this.hostAdapter.persistReceipt?.(Q(e, this.secrets()), Q(t, this.secrets()), n);
			return this.log({
				kind: "host_persistence",
				actionId: e?.actionId,
				capability: r
			}), r || {
				persisted: !1,
				confirmed: !1,
				reason: "宿主未返回保存确认"
			};
		} catch (e) {
			let t = {
				persisted: !1,
				confirmed: !1,
				reason: e.message
			};
			return this.log({
				kind: "host_persistence",
				capability: t
			}), t;
		}
	}
	async queueMainStory(e, t) {
		await this.checkpoints;
		let n = await this.persistToHost(e, this.state, t);
		if (this.hostAdapter && (!n?.persisted || !n?.confirmed)) return this.state.hostSync = {
			status: "pending",
			reason: n?.reason
		}, this.storage.writeSession(Q(this.state, this.secrets())), this.log({
			kind: "host_injection",
			actionId: e.actionId,
			capability: {
				queued: !1,
				reason: "宿主保存未确认，已保留本地提交；重试保存不会重新裁定"
			}
		}), {
			queued: !1,
			pending: !0
		};
		if (!this.hostAdapter) {
			this.log({
				kind: "host_injection",
				actionId: e.actionId,
				capability: {
					queued: !1,
					reason: "宿主不可用；可复制场景包或使用独立正文API"
				}
			});
			return;
		}
		try {
			let n = await this.hostAdapter.injectScenePacket?.(e.narrativePacket, t);
			return this.log({
				kind: "host_injection",
				actionId: e.actionId,
				capability: n
			}), n?.queued && (this.bridgeQueuedAction = e.actionId), n;
		} catch (e) {
			this.log({
				kind: "host_injection",
				capability: {
					queued: !1,
					reason: e.message
				}
			});
		}
	}
	async submit(e) {
		await this.ready, await this.checkpoints;
		let t = e?.actionId ? this.state.history.find((t) => t.actionId === e.actionId) : null;
		if (t) return {
			state: this.state,
			record: Z(t),
			deduplicated: !0
		};
		this.assertIdleRequest();
		let n = this.epoch, r = new AbortController();
		this.inFlight = r;
		let i = Z(this.hostAdapter?.scope?.() || this.state.scope), a = async (e) => {
			if (n !== this.epoch) throw new DOMException("作用域已变化", "AbortError");
			this.state = e, this.emit(), await this.checkpoints;
		};
		try {
			let t = await Qm(this.state, e, {
				adjudicator: this.adjudicator,
				narrator: this.narrator,
				settings: this.settings,
				signal: r.signal,
				save: a,
				logger: (e) => {
					n === this.epoch && this.log(e);
				},
				onCommit: async (e, t) => {
					if (n !== this.epoch) return;
					let a = await this.persistToHost(e, t, i);
					return up(r.signal), {
						allowed: !this.hostAdapter || !!(a?.persisted && a?.confirmed),
						reason: a?.reason
					};
				}
			});
			if (n !== this.epoch) return {
				stale: !0,
				state: this.state
			};
			this.state = t.state, this.emit(), await this.checkpoints;
			let o = await this.persistToHost(t.record, this.state, i);
			return this.settings.autoNarrative && this.settings.narrator.mode === "main_story" && o?.persisted && o?.confirmed ? await this.queueMainStory(t.record, i) : this.settings.narrator.mode === "main_story" && this.hostAdapter && (this.state.hostSync = {
				status: "pending",
				reason: o?.reason
			}), this.storage.writeSession(Q(this.state, this.secrets())), this.onChange(this.state, Wm(this.state)), t;
		} catch (e) {
			if (n !== this.epoch || r.signal.aborted) return {
				stale: !0,
				state: this.state
			};
			throw e;
		} finally {
			this.inFlight === r && (this.inFlight = null);
		}
	}
	async rewrite(e) {
		await this.ready, this.assertIdleRequest(), this.hostAdapter?.clearScenePacket?.();
		let t = this.epoch, n = new AbortController();
		this.inFlight = n;
		let r = Z(this.hostAdapter?.scope?.() || this.state.scope), i = async (e) => {
			if (t !== this.epoch) throw new DOMException("作用域已变化", "AbortError");
			this.state = e, this.emit(), await this.checkpoints;
		};
		try {
			let a = await $m(this.state, e, this.narrator, {
				signal: n.signal,
				save: i,
				logger: (e) => {
					t === this.epoch && this.log(e);
				},
				originalPrompt: this.settings.originalPrompt
			});
			return t === this.epoch ? (this.state = a.state, await this.persistToHost(a.record, this.state, r), this.emit(), await this.checkpoints, this.settings.narrator.mode === "main_story" && await this.queueMainStory(a.record, r), a) : {
				stale: !0,
				state: this.state
			};
		} catch (e) {
			if (t !== this.epoch || n.signal.aborted) return {
				stale: !0,
				state: this.state
			};
			throw e;
		} finally {
			this.inFlight === n && (this.inFlight = null);
		}
	}
	async retryHostPersistence() {
		await this.checkpoints;
		let e = this.hostAdapter?.scope?.() || this.state.scope, t = this.state.history.filter((e) => ["committed", "complete"].includes(e.status)).at(-1), n = await this.persistToHost(t, this.state, e);
		return this.state.hostSync = {
			status: n?.persisted && n?.confirmed ? "confirmed" : "pending",
			reason: n?.reason
		}, this.storage.writeSession(Q(this.state, this.secrets())), n?.persisted && n?.confirmed && t && !t.narrative?.text && this.settings.narrator.mode === "main_story" && await this.queueMainStory(t, e), this.onChange(this.state, Wm(this.state)), n;
	}
	skipPendingNarrative() {
		this.hostAdapter?.clearScenePacket?.(), this.bridgeQueuedAction = null;
		let e = this.state.history.filter((e) => ["committed", "complete"].includes(e.status)).at(-1);
		e?.narrative?.pending && (e.narrative = {
			...e.narrative,
			pending: !1,
			metadata: {
				mode: "skipped",
				reason: "玩家跳过正文，裁定事实保留"
			}
		}), this.state = {
			...this.state,
			version: this.state.version + 1
		}, this.emit();
	}
	async recordHostNarrative(e) {
		if (this.bridgeQueuedAction = null, e.scope?.chatId !== this.state.scope.chatId || e.scope?.branchId !== this.state.scope.branchId) return;
		let t = this.state.history.find((t) => t.actionId === e.actionId);
		t && t.narrativePacket && (e.status === "complete" ? (t.narrative = {
			text: String(e.text || ""),
			metadata: { source: "SillyTavern normal generation" }
		}, t.status = "complete") : t.narrativeError = "主剧情生成已停止；裁定事实保持", this.state = {
			...this.state,
			version: this.state.version + 1,
			phase: "awaiting_next",
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}, this.log({
			kind: "host_narrative_result",
			actionId: t.actionId,
			narrative: t.narrative,
			capability: { status: e.status }
		}), this.emit(), await this.persistToHost(t, this.state, e.scope));
	}
	importScene(e) {
		if (this.assertIdleRequest(), !["idle", "ended"].includes(this.state.phase)) throw Error("活动战斗中不能导入新场景，请先停止");
		let t = typeof e == "string" ? JSON.parse(e) : Z(e), n = new Mm(t.registry || this.registry.snapshot());
		if (!t.scene || !t.actors?.player || !Array.isArray(t.actors.enemies)) throw Error("场景需 scene、actors.player、actors.enemies");
		for (let e of [t.actors.player, ...t.actors.enemies]) if (!e.id || !e.name) throw Error("角色需id/name");
		if (new Set([t.actors.player, ...t.actors.enemies].map((e) => e.id)).size !== t.actors.enemies.length + 1) throw Error("角色id重复");
		this.cancelPending(), this.hostAdapter?.clearScenePacket?.();
		let r = this.state.version;
		return this.registry = n, this.state = Fm({
			chatId: this.state.scope.chatId,
			branchId: this.state.scope.branchId,
			scene: t.scene,
			player: t.actors.player,
			enemies: t.actors.enemies,
			semanticState: t.semanticState,
			resourceRules: t.resourceRules,
			registrySnapshot: n.snapshot()
		}), this.state.version = r + 1, this.logs = [], this.storage.replaceLogs([]), this.emit(), this.state;
	}
	importRegistry(e) {
		if (this.assertIdleRequest(), !["idle", "ended"].includes(this.state.phase)) throw Error("活动战斗中不能替换功法");
		let t = typeof e == "string" ? JSON.parse(e) : e, n = new Mm(Array.isArray(t) ? t : t.registry || [t]);
		return this.registry = n, this.state = {
			...this.state,
			registrySnapshot: n.snapshot(),
			version: this.state.version + 1
		}, this.emit(), n.snapshot();
	}
	exportData() {
		return JSON.stringify(Q({
			schema: "battle_v2_export",
			exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
			state: this.state,
			logs: this.logs,
			settings: this.settings,
			registry: this.registry.snapshot()
		}, this.secrets()), null, 2);
	}
	importData(e) {
		this.assertIdleRequest();
		let t = typeof e == "string" ? JSON.parse(e) : Z(e), n = Bm(t.state || t);
		if (n.scope.chatId !== this.state.scope.chatId || n.scope.branchId !== this.state.scope.branchId) throw Error("导入文件作用域与当前聊天/分支不一致");
		return this.cancelPending(), this.hostAdapter?.clearScenePacket?.(), this.state = {
			...n,
			version: Math.max(n.version, this.state.version) + 1
		}, this.registry = new Mm(n.registrySnapshot), this.logs = Q(Array.isArray(t.logs) ? t.logs : [], this.secrets()), this.storage.replaceLogs(this.logs), t.settings && (this.settings = oh(Q(t.settings)), this.storage.writeSettings(this.settings), this.setAdapters(bh(this.settings))), this.emit(), this.state;
	}
	playerView() {
		return Wm(this.state);
	}
	logExport() {
		return JSON.stringify(this.logs.map(dp), null, 2);
	}
	debugLogExport() {
		return JSON.stringify(Q(this.logs, this.secrets()), null, 2);
	}
	dispose() {
		this.cancelPending(), this.unsubScope?.(), this.unsubNarrative?.(), this.hostAdapter?.dispose?.();
	}
}, $ = (e) => e == null ? e : JSON.parse(JSON.stringify(e)), Sh = (e) => e != null && e !== "" && Number.isInteger(Number(e)) && Number(e) >= 0 ? Number(e) : null, Ch = (e) => !!e && (e.role === "assistant" || e.role == null && e.is_user === !1 && e.extra?.type !== "narrator"), wh = [
	"chatId",
	"branchId",
	"messageId",
	"swipeId",
	"messageUid"
], Th = (e, t, n = !1) => !!e && !!t && wh.every((n) => e[n] == null || String(e[n]) === String(t[n])) && (!n || e.scopeEpoch == null || e.scopeEpoch === t.scopeEpoch), Eh = (e) => Object.fromEntries(wh.map((t) => [t, e[t]]));
function Dh(e) {
	return Array.isArray(e) ? `[${e.map(Dh).join(",")}]` : e && typeof e == "object" ? `{${Object.keys(e).sort().map((t) => `${JSON.stringify(t)}:${Dh(e[t])}`).join(",")}}` : JSON.stringify(e);
}
function Oh(e) {
	return Array.isArray(e) ? e.map(Oh) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).filter(([e]) => ![
		"apiKey",
		"api_key",
		"authorization"
	].includes(e)).map(([e, t]) => [e, Oh(t)]));
}
function kh(e) {
	return e?.extra?.battle_v2_message_uuid || e?.extra?.message_uuid || e?.swipe_info?.find((e) => e?.battle_v2_message_uuid)?.battle_v2_message_uuid || e?.swipes_info?.find((e) => e?.battle_v2_message_uuid)?.battle_v2_message_uuid;
}
var Ah = class {
	constructor({ contextProvider: e = () => globalThis.SillyTavern?.getContext?.() || {}, helper: t, eventEmitter: n, eventTypes: r, windowRef: i = globalThis, extensionName: a = "st-xybattle-sys" } = {}) {
		Object.assign(this, {
			contextProvider: e,
			helperDependency: t,
			eventEmitterDependency: n,
			eventTypesDependency: r,
			windowRef: i,
			extensionName: a
		}), this.anchor = null, this.currentScope = null, this.epoch = 0, this.messageUids = /* @__PURE__ */ new WeakMap(), this.scopeListeners = /* @__PURE__ */ new Set(), this.narrativeListeners = /* @__PURE__ */ new Set(), this.disposers = [], this.boundEmitter = null, this.packet = null, this.activePacket = null, this.injected = !1, this.lastInjection = null, this.writeQueue = Promise.resolve(), this.uncertainScopes = /* @__PURE__ */ new Set(), this.disposed = !1, this.start();
	}
	context() {
		return this.contextProvider() || {};
	}
	helper() {
		return this.helperDependency === void 0 ? globalThis.TavernHelper : this.helperDependency;
	}
	chatId(e) {
		return String(e.chatId ?? e.getCurrentChatId?.() ?? e.chat?.id ?? "");
	}
	explicitMessageId(e) {
		return Sh(e.messageId ?? e.message_id ?? e.message?.message_id);
	}
	latestAssistantId(e) {
		if (!Array.isArray(e.chat)) return null;
		for (let t = e.chat.length - 1; t >= 0; --t) if (Ch(e.chat[t])) return t;
		return null;
	}
	storedAnchorId(e, t) {
		if (!Array.isArray(e.chat)) return null;
		for (let n = e.chat.length - 1; n >= 0; --n) {
			let r = e.chat[n], i = r?.swipe_info?.[r.swipe_id ?? 0]?.battle_v2 || r?.extra?.battle_v2;
			if (Ch(r) && i?.schema === "battle_v2_host_store" && i.scope?.chatId === t && i.scope?.messageId === n && i.scope?.swipeId === (r.swipe_id ?? 0)) return n;
		}
		return null;
	}
	readMessageSync(e, t = this.context()) {
		let n = this.helper();
		if (typeof n?.getChatMessages == "function") {
			let r = n.getChatMessages(e, { include_swipes: !0 });
			if (r?.then) throw Error("getChatMessages must follow the synchronous TavernHelper contract");
			let i = r?.[0];
			if (i?.message_id !== e) return null;
			let a = $(i), o = t.chat?.[e]?.extra;
			return a.swipes_info && o && (a.swipes_info[a.swipe_id] = {
				...$(o),
				...a.swipes_info[a.swipe_id]
			}), a;
		}
		let r = t.chat?.[e] || (this.explicitMessageId(t) === e ? t.message : null);
		if (!r) return null;
		let i = r.swipes || [r.mes ?? r.message ?? ""], a = Sh(r.swipe_id ?? r.swipeId) ?? 0, o = Array.from({ length: i.length }, (e, t) => $(r.swipe_info?.[t] ?? r.swipes_info?.[t] ?? (t === a ? r.extra : {}) ?? {}));
		return o[a] = {
			...$(r.extra || {}),
			...o[a]
		}, {
			message_id: e,
			name: r.name,
			role: r.role || (r.is_user ? "user" : r.extra?.type === "narrator" ? "system" : "assistant"),
			is_hidden: !!r.is_system,
			swipe_id: a,
			swipes: $(i),
			swipes_data: Array.from({ length: i.length }, (e, t) => $(r.variables?.[t] ?? r.swipes_data?.[t] ?? {})),
			swipes_info: o
		};
	}
	scope() {
		let e = this.context(), t = this.chatId(e), n = this.explicitMessageId(e), r = this.anchor?.chatId === t ? this.anchor.messageId : null, i = !1;
		if (n != null && (r = n), r == null && (r = this.storedAnchorId(e, t), i = r != null, r ??= this.latestAssistantId(e), r == null)) try {
			r = Sh(this.helper()?.getCurrentMessageId?.());
		} catch {}
		let a;
		try {
			a = r == null ? null : this.readMessageSync(r, e);
		} catch {
			a = null;
		}
		let o = e.chat?.[r] || (n === r ? e.message : null);
		if (!t || !Ch(a) || Sh(a?.swipe_id) == null) return this.publishScope({
			chatId: t || "default-chat",
			branchId: "main",
			messageId: null,
			swipeId: null,
			messageUid: null,
			available: !1,
			writable: !1
		}), this.anchor = null, { ...this.currentScope };
		let s = kh(o) || kh(a), c = this.anchor?.chatId === t && this.anchor.messageId === r && (o ? o === this.anchor.raw || s === this.anchor.messageUid : !s || s === this.anchor.messageUid), l = s || (c ? this.anchor.messageUid : o && this.messageUids.get(o));
		l ||= globalThis.crypto?.randomUUID?.() || `battle-message-${Date.now()}-${Math.random().toString(36).slice(2)}`, o && this.messageUids.set(o, l);
		let u = this.latestAssistantId(e), d = c ? this.anchor.writable : i || u == null || u === r;
		return this.anchor = {
			chatId: t,
			messageId: r,
			messageUid: String(l),
			raw: o,
			writable: d
		}, this.publishScope({
			chatId: t,
			branchId: `message:${r}:swipe:${a.swipe_id}`,
			messageId: r,
			swipeId: a.swipe_id,
			messageUid: String(l),
			available: !0,
			writable: d
		}), { ...this.currentScope };
	}
	publishScope(e, t = !1) {
		let n = this.currentScope;
		if (t || !n || !Th(n, e) || n.available !== e.available || n.writable !== e.writable) {
			this.epoch += 1, this.currentScope = {
				...e,
				scopeEpoch: this.epoch
			}, this.clearScenePacket();
			for (let e of this.scopeListeners) e({ ...this.currentScope }, n && { ...n });
		} else this.currentScope = {
			...e,
			scopeEpoch: this.epoch
		};
	}
	validateScope(e, { writable: t = !1 } = {}) {
		let n = this.scope();
		if (!n.available) throw Error("No assistant message anchor is available");
		if (!Th(e, n, !0)) throw Error("Host scope changed; refusing a late cross-chat or cross-swipe operation");
		if (t && !n.writable) throw Error("Historical message anchors are read-only");
		return n;
	}
	capability() {
		let e = this.context(), t = this.helper(), n = typeof t?.getChatMessages == "function" ? "tavern-helper" : Array.isArray(e.chat) ? "context-chat" : "unavailable", r = n === "tavern-helper" && typeof t?.setChatMessages == "function" ? "tavern-helper" : Array.isArray(e.chat) ? "context-chat" : "unavailable";
		return {
			read: n,
			write: r,
			save: typeof e.saveChat == "function" ? "awaitable-save-chat" : r === "tavern-helper" ? "debounced-only" : "unavailable",
			injection: typeof t?.injectPrompts == "function" && this.boundEmitter ? "once-generation-event" : "unavailable",
			events: !!this.boundEmitter,
			liveVerified: !1
		};
	}
	async ready() {
		return this.start(), {
			scope: this.scope(),
			capability: this.capability()
		};
	}
	subscribeScopeChange(e) {
		return this.scopeListeners.add(e), () => this.scopeListeners.delete(e);
	}
	subscribeNarrative(e) {
		return this.narrativeListeners.add(e), () => this.narrativeListeners.delete(e);
	}
	async loadSession(e = this.scope()) {
		let t = this.capability();
		try {
			let n = this.validateScope(e), r = this.readMessageSync(n.messageId)?.swipes_info?.[n.swipeId]?.battle_v2;
			if (!r) return {
				loaded: !1,
				state: null,
				receipts: {},
				scope: n,
				capability: t
			};
			if (r.schema !== "battle_v2_host_store" || !Th(r.scope, n) || !Th(r.state?.scope || r.scope, n)) throw Error("Stored battle_v2 scope does not match this message branch");
			let i = $(r.state);
			return i && (i.scope = {
				...i.scope,
				...n
			}), {
				loaded: !!i,
				state: i,
				receipts: $(r.receipts || {}),
				version: r.version,
				scope: n,
				capability: t
			};
		} catch (n) {
			return {
				loaded: !1,
				state: null,
				receipts: {},
				scope: e,
				capability: t,
				reason: n.message,
				stale: !0
			};
		}
	}
	persistReceipt(e, t, n = e?.scope || t?.scope || this.scope()) {
		let r = { ...n }, i = Oh($(e)), a = Oh($(t)), o = this.writeQueue.catch(() => {}).then(() => this.writeReceipt(i, a, r));
		return this.writeQueue = o, o;
	}
	async writeReceipt(e, t, n) {
		let r = this.capability();
		try {
			let i = this.validateScope(n, { writable: !0 });
			if (e?.scope && !Th(e.scope, i, !0) || t?.scope && !Th(t.scope, i, !0)) throw Error("Receipt/session scope mismatch");
			if (r.write === "unavailable" || r.save !== "awaitable-save-chat") return {
				persisted: !1,
				confirmed: !1,
				scope: i,
				capability: r,
				reason: "Awaitable host message persistence is unavailable"
			};
			let a = this.readMessageSync(i.messageId);
			if (!a || a.swipe_id !== i.swipeId) throw Error("Anchored swipe is no longer selected");
			let o = a.swipes_info?.[i.swipeId]?.battle_v2;
			if (o && (o.schema !== "battle_v2_host_store" || !Th(o.scope, i))) throw Error("Existing host store has an incompatible scope/schema");
			let s = Dh(Eh(i)), c = Math.max(Number(e?.version ?? 0), Number(t?.version ?? 0));
			if (!Number.isFinite(c) || c < 0) throw Error("Invalid host store version");
			let l = e?.actionId && o?.receipts?.[e.actionId], u = e && {
				...e,
				scope: Eh(i)
			};
			if (o && c < o.version) {
				if (!this.uncertainScopes.has(s) && l && Dh(l) === Dh(u)) return {
					persisted: !0,
					confirmed: !0,
					scope: i,
					capability: r,
					deduplicated: !0,
					version: o.version
				};
				throw Error("Older host version refused; persisted state cannot roll back");
			}
			if (e && !e.actionId) throw Error("A receipt must carry a stable actionId");
			if (l) {
				for (let e of [
					"actionId",
					"roundId",
					"action",
					"adjudication",
					"before",
					"after",
					"narrativePacket"
				]) if (l.status !== "prepared" && Dh(l[e]) !== Dh(u[e])) throw Error("Conflicting duplicate actionId refused");
				let t = {
					prepared: 0,
					committed: 1,
					complete: 2
				};
				if ((t[e.status] ?? -1) < (t[l.status] ?? -1) && !e.rewrittenAt) throw Error("Receipt status cannot regress");
			}
			let d = {
				...o || {},
				schema: "battle_v2_host_store",
				scope: Eh(i),
				version: Math.max(c, o?.version || 0),
				state: t ? {
					...t,
					scope: {
						...t.scope,
						...Eh(i)
					}
				} : o?.state || null,
				receipts: { ...o?.receipts }
			};
			if (u && (d.receipts[e.actionId] = u, d.lastActionId = e.actionId), !this.uncertainScopes.has(s) && o && Dh(o) === Dh(d)) return {
				persisted: !0,
				confirmed: !0,
				scope: i,
				capability: r,
				deduplicated: !0,
				version: d.version
			};
			let f = a.swipes_info.map((e) => $(e || {}));
			f[i.swipeId] = {
				...f[i.swipeId],
				battle_v2_message_uuid: i.messageUid,
				battle_v2: d
			};
			let p = {
				message_id: a.message_id,
				swipe_id: a.swipe_id,
				swipes: $(a.swipes),
				swipes_data: $(a.swipes_data),
				swipes_info: f
			};
			this.validateScope(i, { writable: !0 });
			let m = this.context();
			if (this.uncertainScopes.add(s), r.write === "tavern-helper") {
				if (await this.helper().setChatMessages([p], { refresh: "none" }) === !1) throw Error("setChatMessages returned false");
			} else Object.assign(m.chat[i.messageId], {
				swipe_id: p.swipe_id,
				swipes: p.swipes,
				variables: p.swipes_data,
				swipe_info: p.swipes_info,
				mes: p.swipes[p.swipe_id],
				extra: p.swipes_info[p.swipe_id]
			});
			if (this.validateScope(i, { writable: !0 }), await m.saveChat() === !1) throw Error("saveChat returned false");
			this.validateScope(i, { writable: !0 });
			let h = this.readMessageSync(i.messageId)?.swipes_info?.[i.swipeId]?.battle_v2;
			if (Dh(h) !== Dh(d)) throw Error("Host persistence readback mismatch");
			return this.uncertainScopes.delete(s), {
				persisted: !0,
				confirmed: !0,
				scope: i,
				capability: r,
				version: d.version
			};
		} catch (e) {
			return {
				persisted: !1,
				confirmed: !1,
				scope: n,
				capability: r,
				reason: e.message,
				stale: /scope|swipe|Older|Historical|anchor/.test(e.message)
			};
		}
	}
	async injectScenePacket(e, t = e?.scope || this.scope()) {
		this.start();
		try {
			let n = this.validateScope(t, { writable: !0 });
			if (!e || e.type !== "BATTLE_SCENE_PACKET" || !e.actionId) throw Error("A committed BATTLE_SCENE_PACKET with actionId is required");
			if (e.scope && !Th(e.scope, n, !0)) throw Error("Scene packet scope mismatch");
			if (this.capability().injection === "unavailable") return {
				queued: !1,
				injected: !1,
				capability: this.capability(),
				reason: "injectPrompts or generation events are unavailable"
			};
			let r = this.readMessageSync(n.messageId)?.swipes_info?.[n.swipeId]?.battle_v2, i = r?.receipts?.[e.actionId];
			if (this.uncertainScopes.has(Dh(Eh(n)))) throw Error("Host persistence is unconfirmed after a failed save");
			if (!i || ["prepared", "judging"].includes(i.status)) throw Error("Scene packet has no persisted committed receipt");
			if (e.version != null && Number(e.version) !== r.version) throw Error("Scene packet version mismatch");
			return this.clearScenePacket(), this.packet = {
				...$(e),
				packet: $(e),
				scope: n,
				version: r.version
			}, {
				queued: !0,
				injected: !1,
				scope: n,
				capability: this.capability()
			};
		} catch (e) {
			return this.clearScenePacket(), {
				queued: !1,
				injected: !1,
				reason: e.message,
				stale: !0,
				capability: this.capability()
			};
		}
	}
	beforeGeneration(...e) {
		if (!this.packet || this.activePacket) return;
		let t = typeof e[0] == "string" ? e[0] : e[0]?.type;
		if (t && !["normal", "generate"].includes(t) || e.some((e) => e === !0 || e?.dryRun === !0 || e?.dry_run === !0)) return;
		let n = this.packet;
		try {
			this.validateScope(n.scope, { writable: !0 });
			let e = this.readMessageSync(n.scope.messageId)?.swipes_info?.[n.scope.swipeId]?.battle_v2;
			if (!e || e.version !== n.version || !e.receipts?.[n.packet.actionId]) throw Error("Scene packet version/scope changed before generation");
			let t = this.context(), r = this.latestAssistantId(t), i = r == null ? null : t.chat[r]?.mes, a = this.helper().injectPrompts([{
				id: `${this.extensionName}:battle_v2:${n.packet.actionId}`,
				role: "system",
				position: "in_chat",
				depth: 0,
				should_scan: !1,
				content: JSON.stringify(n.packet),
				filter: () => {
					try {
						return this.validateScope(n.scope), this.readMessageSync(n.scope.messageId)?.swipes_info?.[n.scope.swipeId]?.battle_v2?.version === n.version;
					} catch {
						return !1;
					}
				}
			}], { once: !0 });
			if (typeof a?.uninject != "function") throw Error("injectPrompts did not return its documented uninject handle");
			this.activePacket = {
				...n,
				uninject: a.uninject,
				baselineId: r,
				baselineText: i
			}, this.packet = null, this.injected = !0, this.lastInjection = {
				injected: !0,
				actionId: n.packet.actionId,
				scope: n.scope
			};
		} catch (e) {
			this.clearScenePacket(), this.lastInjection = {
				injected: !1,
				reason: e.message
			};
		}
	}
	async finishGeneration(e) {
		let t = this.activePacket;
		if (this.clearScenePacket(), t) try {
			if (this.validateScope(t.scope), this.readMessageSync(t.scope.messageId)?.swipes_info?.[t.scope.swipeId]?.battle_v2?.version !== t.version) throw Error("Scene packet version changed during generation");
			let n = this.context(), r = this.latestAssistantId(n), i = r == null ? null : n.chat[r], a = i?.mes ?? i?.message ?? "";
			r != null && typeof this.helper()?.getChatMessages == "function" && (a = this.helper().getChatMessages(r, { include_swipes: !1 })?.[0]?.message ?? a);
			let o = e === "complete" && typeof a == "string" && a.trim() && (r !== t.baselineId || a !== t.baselineText), s = {
				actionId: t.packet.actionId,
				scope: t.scope,
				text: o ? a : "",
				status: o ? "complete" : "stopped",
				packet: $(t.packet),
				messageId: r
			};
			for (let e of this.narrativeListeners) await e(s);
		} catch (e) {
			this.lastInjection = {
				injected: !1,
				reason: e.message,
				stale: !0
			};
		}
	}
	clearScenePacket() {
		let e = this.activePacket;
		this.activePacket = null, this.packet = null, this.injected = !1, e?.uninject && e.uninject();
	}
	start() {
		if (this.disposed) return this.capability();
		let e = this.context(), t = this.helper(), n = this.eventEmitterDependency || e.eventSource || t?.eventSource;
		if (n === this.boundEmitter && this.disposers.length) return this.capability();
		if (this.disposers.length) {
			for (let e of this.disposers.splice(0)) e();
			this.boundEmitter = null;
		}
		let r = this.eventTypesDependency || e.event_types || t?.tavern_events || globalThis.tavern_events || {}, i = (e, t) => {
			n?.on && (n.on(e, t), this.disposers.push(() => (n.off || n.removeListener)?.call(n, e, t)));
		};
		if (n?.on) {
			this.boundEmitter = n, i(r.GENERATION_AFTER_COMMANDS || "GENERATION_AFTER_COMMANDS", (...e) => this.beforeGeneration(...e)), i(r.GENERATION_ENDED || "GENERATION_ENDED", () => this.finishGeneration("complete")), i(r.GENERATION_STOPPED || "GENERATION_STOPPED", () => this.finishGeneration("stopped"));
			let e = t?.iframe_events?.GENERATION_ENDED;
			e && e !== r.GENERATION_ENDED && i(e, () => this.finishGeneration("complete")), i(r.CHAT_CHANGED || "CHAT_CHANGED", () => {
				this.clearScenePacket(), this.anchor = null;
				let e = this.scope();
				this.publishScope(e, !0);
			});
			for (let e of [
				"MESSAGE_SWIPED",
				"MESSAGE_SWIPE_DELETED",
				"MESSAGE_DELETED",
				"MESSAGE_UPDATED"
			]) i(r[e] || e, (t) => {
				this.clearScenePacket(), e === "MESSAGE_SWIPED" && Sh(t) != null && this.anchor && (this.anchor = {
					...this.anchor,
					messageId: Sh(t),
					raw: null
				}), this.scope();
			});
		}
		if (this.windowRef?.addEventListener) {
			let e = () => this.clearScenePacket();
			this.windowRef.addEventListener("pagehide", e), this.disposers.push(() => this.windowRef.removeEventListener?.("pagehide", e));
		}
		return this.capability();
	}
	dispose() {
		this.clearScenePacket();
		for (let e of this.disposers.splice(0)) e();
		this.boundEmitter = null, this.scopeListeners.clear(), this.narrativeListeners.clear(), this.disposed = !0;
	}
};
//#endregion
//#region src/ui/mount.js
function jh({ documentRef: e = globalThis.document, storage: t = globalThis.localStorage, hostAdapter: n, controller: r, chatId: i = "demo-local", branchId: a = "main" } = {}) {
	if (!e) return null;
	if (e.getElementById("xybattle-v2-root")) return globalThis.XYBattle;
	let o = e.createElement("div");
	o.id = "xybattle-v2-root-wrapper", e.body.appendChild(o);
	try {
		let t = new URL("data:text/css;base64,Lnh5LWljb25bZGF0YS12LTQxZjVlMTU5XXt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7ZmxleC1zaHJpbms6MDt3aWR0aDoxZW07aGVpZ2h0OjFlbTtkaXNwbGF5OmlubGluZS1ibG9ja30ueHktaGVhZGVyW2RhdGEtdi1jZDQ1MzhlM117ei1pbmRleDoxMDtib3JkZXItYm90dG9tOjFweCBzb2xpZCB2YXIoLS14eS1ib3JkZXItc3VidGxlKTtiYWNrZHJvcC1maWx0ZXI6Ymx1cigxNnB4KTt1c2VyLXNlbGVjdDpub25lO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KCMwODEyMjBmMiAwJSwjMDUwYzE2Y2MgMTAwJSk7ZmxleC1zaHJpbms6MDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7cGFkZGluZzoxMnB4IDMycHggMTBweDtkaXNwbGF5OmZsZXg7cG9zaXRpb246cmVsYXRpdmV9Lnh5LWhlYWRlci1sZWZ0W2RhdGEtdi1jZDQ1MzhlM117YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxNnB4O2Rpc3BsYXk6ZmxleH0ueHktYnJhbmQtc2VhbFtkYXRhLXYtY2Q0NTM4ZTNde2JvcmRlcjoxcHggc29saWQgdmFyKC0teHktYm9yZGVyLWdsb3cpO3dpZHRoOjQ0cHg7aGVpZ2h0OjQ0cHg7Ym94LXNoYWRvdzowIDAgMTZweCB2YXIoLS14eS1jeWFuLWdsb3cpLCBpbnNldCAwIDAgMTBweCAjMzhiZGY4MzM7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDMwJSAzMCUsIzM4YmRmODQwLCMwNzEwMWVmMik7Ym9yZGVyLXJhZGl1czo4cHg7ZmxleC1zaHJpbms6MDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtkaXNwbGF5OmZsZXh9Lnh5LXNlYWwtc3ltYm9sW2RhdGEtdi1jZDQ1MzhlM117Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y29sb3I6dmFyKC0teHktY3lhbi0zMDApO3RleHQtc2hhZG93OjAgMCA4cHggdmFyKC0teHktY3lhbi00MDApO2ZvbnQtc2l6ZToyNHB4O2ZvbnQtd2VpZ2h0OjYwMH0ueHkta2lja2VyW2RhdGEtdi1jZDQ1MzhlM117bGV0dGVyLXNwYWNpbmc6LjE2ZW07Y29sb3I6dmFyKC0teHktY3lhbi00MDApO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtmb250LXNpemU6MTBweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O2Rpc3BsYXk6ZmxleH0ueHkta2lja2VyLWRvdFtkYXRhLXYtY2Q0NTM4ZTNde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpfS54eS1zY29wZS1waWxsW2RhdGEtdi1jZDQ1MzhlM117Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCk7YmFja2dyb3VuZDojZmZmZmZmMGE7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmMGQ7Ym9yZGVyLXJhZGl1czo0cHg7cGFkZGluZzoxcHggNnB4O2ZvbnQtc2l6ZTo5cHh9Lnh5LXRpdGxlW2RhdGEtdi1jZDQ1MzhlM117YWxpZ24taXRlbXM6YmFzZWxpbmU7Z2FwOjEycHg7bWFyZ2luOjJweCAwIDNweDtkaXNwbGF5OmZsZXh9Lnh5LXRpdGxlLXRleHRbZGF0YS12LWNkNDUzOGUzXXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjp2YXIoLS14eS10ZXh0LXRpdGxlKTtsZXR0ZXItc3BhY2luZzouMDZlbTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZiAwJSwjYmFlNmZkIDYwJSwjN2RkM2ZjIDEwMCUpOy13ZWJraXQtdGV4dC1maWxsLWNvbG9yOnRyYW5zcGFyZW50Oy13ZWJraXQtYmFja2dyb3VuZC1jbGlwOnRleHQ7Zm9udC1zaXplOjI0cHg7Zm9udC13ZWlnaHQ6NTAwfS54eS1yb3VuZC1zZWFsW2RhdGEtdi1jZDQ1MzhlM117Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y29sb3I6dmFyKC0teHktZ29sZC0zMDApO2JvcmRlcjoxcHggc29saWQgdmFyKC0teHktYm9yZGVyLWdvbGQpO2xldHRlci1zcGFjaW5nOi4xZW07YmFja2dyb3VuZDojZmJiZjI0MTQ7Ym9yZGVyLXJhZGl1czo0cHg7cGFkZGluZzoycHggOHB4O2ZvbnQtc2l6ZToxMXB4fS54eS1zdWJ0aXRsZVtkYXRhLXYtY2Q0NTM4ZTNde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O21hcmdpbjowO2ZvbnQtc2l6ZToxMnB4O2Rpc3BsYXk6ZmxleH0ueHktc2VwW2RhdGEtdi1jZDQ1MzhlM117Y29sb3I6I2ZmZmZmZjFmfS54eS1jb250cm9sLXN0YXRlW2RhdGEtdi1jZDQ1MzhlM117Zm9udC13ZWlnaHQ6NTAwfS50b25lLXBsYXllcltkYXRhLXYtY2Q0NTM4ZTNde2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKTt0ZXh0LXNoYWRvdzowIDAgNnB4IHZhcigtLXh5LWN5YW4tZ2xvdyl9LnRvbmUtZW5lbXlbZGF0YS12LWNkNDUzOGUzXXtjb2xvcjp2YXIoLS14eS1jcmltc29uLTQwMCk7dGV4dC1zaGFkb3c6MCAwIDZweCB2YXIoLS14eS1jcmltc29uLWdsb3cpfS50b25lLW5ldXRyYWxbZGF0YS12LWNkNDUzOGUzXXtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCl9Lnh5LW5hdi10YWJzW2RhdGEtdi1jZDQ1MzhlM117LXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6Ymx1cigyMHB4KXNhdHVyYXRlKDE2MCUpO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMDgxNDI2OTkgMCUsIzA0MGMxOGJmIDEwMCUpO2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjFmO2JvcmRlci1yYWRpdXM6OTk5cHg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo0cHg7cGFkZGluZzo0cHg7ZGlzcGxheTpmbGV4O2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMS41cHggI2ZmZmZmZjJlLGluc2V0IDAgLTFweCAycHggIzAwMDYsMCA4cHggMjRweCAjMDAwMDAwNTl9Lnh5LXRhYi1idG5bZGF0YS12LWNkNDUzOGUzXXtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtmb250LXNpemU6MTNweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNhbnMpO2N1cnNvcjpwb2ludGVyO2JhY2tncm91bmQ6MCAwO2JvcmRlcjoxcHggc29saWQgIzAwMDA7Ym9yZGVyLXJhZGl1czo5OTlweDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtwYWRkaW5nOjhweCAxNnB4O3RyYW5zaXRpb246YWxsIC4yNHMgY3ViaWMtYmV6aWVyKC4xNiwxLC4zLDEpO2Rpc3BsYXk6ZmxleH0ueHktdGFiLWJ0bltkYXRhLXYtY2Q0NTM4ZTNdOmhvdmVye2NvbG9yOiNmZmY7YmFja2dyb3VuZDojZmZmZmZmMTR9Lnh5LXRhYi1idG4uYWN0aXZlW2RhdGEtdi1jZDQ1MzhlM117Y29sb3I6I2ZmZjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzM4YmRmODU5IDAlLCMwZWE1ZTkyNiAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICM3ZGQzZmM2Njtib3gtc2hhZG93Omluc2V0IDAgMXB4IDEuNXB4ICNmZmY2LDAgNHB4IDE2cHggIzM4YmRmODQwfS54eS10YWItYmFkZ2VbZGF0YS12LWNkNDUzOGUzXXtmb250LXNpemU6MTBweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKTtiYWNrZ3JvdW5kOiMzOGJkZjgzMztib3JkZXItcmFkaXVzOjk5OXB4O3BhZGRpbmc6MXB4IDZweH0ueHktaGVhZGVyLXJpZ2h0W2RhdGEtdi1jZDQ1MzhlM117YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4O2Rpc3BsYXk6ZmxleH0ueHktcGhhc2UtaW5kaWNhdG9yW2RhdGEtdi1jZDQ1MzhlM117Zm9udC1zaXplOjExcHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtsZXR0ZXItc3BhY2luZzouMDhlbTtiYWNrZ3JvdW5kOiNmZmZmZmYwYTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYxNDtib3JkZXItcmFkaXVzOjk5OXB4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6N3B4O3BhZGRpbmc6NnB4IDEycHg7ZGlzcGxheTpmbGV4fS54eS1waGFzZS1wdWxzZVtkYXRhLXYtY2Q0NTM4ZTNde2JhY2tncm91bmQ6Y3VycmVudENvbG9yO2JvcmRlci1yYWRpdXM6NTAlO3dpZHRoOjZweDtoZWlnaHQ6NnB4fS5waGFzZS1pZGxlW2RhdGEtdi1jZDQ1MzhlM117Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCl9LnBoYXNlLWF3YWl0aW5nX3BsYXllcltkYXRhLXYtY2Q0NTM4ZTNde2NvbG9yOnZhcigtLXh5LWN5YW4tNDAwKTtib3JkZXItY29sb3I6dmFyKC0teHktYm9yZGVyLWdsb3cpO2JhY2tncm91bmQ6IzM4YmRmODE0fS5waGFzZS1hd2FpdGluZ19wbGF5ZXIgLnh5LXBoYXNlLXB1bHNlW2RhdGEtdi1jZDQ1MzhlM117YW5pbWF0aW9uOjJzIGluZmluaXRlIHh5LXB1bHNlLWdsb3d9LnBoYXNlLWp1ZGdpbmdbZGF0YS12LWNkNDUzOGUzXXtjb2xvcjp2YXIoLS14eS1nb2xkLTQwMCk7Ym9yZGVyLWNvbG9yOnZhcigtLXh5LWJvcmRlci1nb2xkKTtiYWNrZ3JvdW5kOiNmYmJmMjQxYX0ucGhhc2UtanVkZ2luZyAueHktcGhhc2UtcHVsc2VbZGF0YS12LWNkNDUzOGUzXXthbmltYXRpb246MXMgaW5maW5pdGUgeHktcHVsc2UtZ2xvd30ucGhhc2UtY29tbWl0dGVkW2RhdGEtdi1jZDQ1MzhlM117Y29sb3I6dmFyKC0teHktamFkZS00MDApO2JhY2tncm91bmQ6IzJkZDRiZjE0O2JvcmRlci1jb2xvcjojMmRkNGJmNGR9LnBoYXNlLW5hcnJhdGluZ1tkYXRhLXYtY2Q0NTM4ZTNde2NvbG9yOiNhNzhiZmE7YmFja2dyb3VuZDojYTc4YmZhMTQ7Ym9yZGVyLWNvbG9yOiNhNzhiZmE0ZH0ueHktbWV0YS10YWdbZGF0YS12LWNkNDUzOGUzXXtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtmb250LXNpemU6MTBweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpmbGV4LWVuZDtsaW5lLWhlaWdodDoxLjM7ZGlzcGxheTpmbGV4fS54eS1tZXRhLW1vZGVbZGF0YS12LWNkNDUzOGUzXXtjb2xvcjp2YXIoLS14eS1jeWFuLTMwMCl9Lnh5LWNsb3NlLWJ0bltkYXRhLXYtY2Q0NTM4ZTNdey13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweCk7d2lkdGg6MzRweDtoZWlnaHQ6MzRweDtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZmZmZjE0IDAlLCNmZmZmZmYwNSAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYyNDtib3JkZXItcmFkaXVzOjk5OXB4O2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO3RyYW5zaXRpb246YWxsIC4yNHMgY3ViaWMtYmV6aWVyKC4xNiwxLC4zLDEpO2Rpc3BsYXk6ZmxleDtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCAjZmZmZmZmNDAsMCA0cHggMTJweCAjMDAwMDAwNGR9Lnh5LWNsb3NlLWJ0bltkYXRhLXYtY2Q0NTM4ZTNdOmhvdmVye2NvbG9yOiNmY2E1YTU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmNDNmNWU0MCAwJSwjZTExZDQ4MWEgMTAwJSk7Ym9yZGVyLWNvbG9yOiNmNDNmNWU4MDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KTtib3gtc2hhZG93Omluc2V0IDAgMXB4IDEuNXB4ICNmZmY2LDAgNnB4IDE4cHggI2Y0M2Y1ZTU5fS54eS1hdG1vc3BoZXJlW2RhdGEtdi1hNDc0MWZmZV17cG9pbnRlci1ldmVudHM6bm9uZTt6LWluZGV4OjA7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtvdmVyZmxvdzpoaWRkZW59Lnh5LXdhdGVyLW1pc3RbZGF0YS12LWE0NzQxZmZlXXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNTAlIDQwJSwjMGVhNWU5MWYgMCUsIzAwMDAgNjUlKSxyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDE4JSAzMCUsIzJkZDRiZjEyIDAlLCMwMDAwIDUwJSkscmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCA4MiUgMzUlLCNmNDNmNWUwZiAwJSwjMDAwMCA1MCUpLGxpbmVhci1ncmFkaWVudCgjMDcxMDFlNGQgMCUsIzAzMDcwZGQ5IDEwMCUpO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjB9Lnh5LXN0cmluZy1jYW52YXNbZGF0YS12LWE0NzQxZmZlXXt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjB9Lnh5LWNob3JkLWxpbmVbZGF0YS12LWE0NzQxZmZlXXt3aWxsLWNoYW5nZTp0cmFuc2Zvcm19LmNob3JkLTFbZGF0YS12LWE0NzQxZmZlXXthbmltYXRpb246OXMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYWx0ZXJuYXRlIHh5LXNpbmUtZHJpZnQtYTQ3NDFmZmV9LmNob3JkLTJbZGF0YS12LWE0NzQxZmZlXXthbmltYXRpb246MTFzIGVhc2UtaW4tb3V0IGluZmluaXRlIGFsdGVybmF0ZS1yZXZlcnNlIHh5LXNpbmUtZHJpZnQtYTQ3NDFmZmV9LmNob3JkLTNbZGF0YS12LWE0NzQxZmZlXXthbmltYXRpb246N3MgZWFzZS1pbi1vdXQgaW5maW5pdGUgYWx0ZXJuYXRlIHh5LXNpbmUtZHJpZnQtYTQ3NDFmZmV9Lnh5LXZvcnRleC1yaW5nW2RhdGEtdi1hNDc0MWZmZV17dHJhbnNmb3JtLW9yaWdpbjo3MjBweCA0MDBweDthbmltYXRpb246NjBzIGxpbmVhciBpbmZpbml0ZSB4eS1yb3RhdGUtc2xvdy1hNDc0MWZmZX1Aa2V5ZnJhbWVzIHh5LXNpbmUtZHJpZnQtYTQ3NDFmZmV7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTRweClzY2FsZVkoLjk2KX01MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoNXB4KXNjYWxlWSgxLjA1KX10b3t0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMnB4KXNjYWxlWSgxKX19QGtleWZyYW1lcyB4eS1yb3RhdGUtc2xvdy1hNDc0MWZmZXswJXt0cmFuc2Zvcm06cm90YXRlKDApfXRve3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19Lnh5LXBhcnRpY2xlc1tkYXRhLXYtYTQ3NDFmZmVde3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjB9Lnh5LXNwYXJrbGVbZGF0YS12LWE0NzQxZmZlXXtvcGFjaXR5Oi4zO2JhY2tncm91bmQ6IzM4YmRmODtib3JkZXItcmFkaXVzOjUwJTt3aWR0aDozcHg7aGVpZ2h0OjNweDthbmltYXRpb246NnMgZWFzZS1pbi1vdXQgaW5maW5pdGUgeHktc3BhcmtsZS1mbG9hdC1hNDc0MWZmZTtwb3NpdGlvbjphYnNvbHV0ZTtib3gtc2hhZG93OjAgMCA4cHggIzM4YmRmOH0uczFbZGF0YS12LWE0NzQxZmZlXXthbmltYXRpb24tZGVsYXk6MHM7dG9wOjIyJTtsZWZ0OjI0JX0uczJbZGF0YS12LWE0NzQxZmZlXXtiYWNrZ3JvdW5kOiNmYmJmMjQ7YW5pbWF0aW9uLWRlbGF5OjEuNXM7dG9wOjM4JTtsZWZ0Ojc2JTtib3gtc2hhZG93OjAgMCA4cHggI2ZiYmYyNH0uczNbZGF0YS12LWE0NzQxZmZlXXthbmltYXRpb24tZGVsYXk6M3M7dG9wOjY1JTtsZWZ0OjQ1JX0uczRbZGF0YS12LWE0NzQxZmZlXXthbmltYXRpb24tZGVsYXk6Mi4yczt0b3A6MTUlO2xlZnQ6NjAlfS5zNVtkYXRhLXYtYTQ3NDFmZmVde2JhY2tncm91bmQ6IzJkZDRiZjthbmltYXRpb24tZGVsYXk6NC4xczt0b3A6NzglO2xlZnQ6MzAlfUBrZXlmcmFtZXMgeHktc3BhcmtsZS1mbG9hdC1hNDc0MWZmZXswJSx0b3tvcGFjaXR5Oi4yO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApc2NhbGUoLjgpfTUwJXtvcGFjaXR5Oi43O3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xNnB4KXNjYWxlKDEuNCl9fS54eS1maWd1cmUtY29udGFpbmVyW2RhdGEtdi1hMmYyNTEyOV17dXNlci1zZWxlY3Q6bm9uZTtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21pbi1oZWlnaHQ6MjYwcHg7bWF4LWhlaWdodDozODBweDtkaXNwbGF5OmZsZXg7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVufS54eS1maWd1cmUtaGFsb1tkYXRhLXYtYTJmMjUxMjlde3BvaW50ZXItZXZlbnRzOm5vbmU7ZmlsdGVyOmJsdXIoNDBweCk7b3BhY2l0eTouMjg7ei1pbmRleDowO2JvcmRlci1yYWRpdXM6NTAlO3dpZHRoOjIyMHB4O2hlaWdodDoyMjBweDtwb3NpdGlvbjphYnNvbHV0ZX0uZmlndXJlLXBsYXllciAueHktZmlndXJlLWhhbG9bZGF0YS12LWEyZjI1MTI5XXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUsIzAyODRjNyAwJSwjMzhiZGY4IDUwJSwjMDAwMCA3NSUpfS5maWd1cmUtZW5lbXkgLnh5LWZpZ3VyZS1oYWxvW2RhdGEtdi1hMmYyNTEyOV17YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlLCNlMTFkNDggMCUsI2ZiNzE4NSA1MCUsIzAwMDAgNzUlKX0ueHktZmlndXJlLWN1c3RvbVtkYXRhLXYtYTJmMjUxMjlde3otaW5kZXg6MTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLXh5LWJvcmRlci1zdWJ0bGUpO2JvcmRlci1yYWRpdXM6MTZweDt3aWR0aDoxODBweDtoZWlnaHQ6MjgwcHg7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVuO2JveC1zaGFkb3c6MCAxNnB4IDQwcHggIzAwMDl9Lnh5LWN1c3RvbS1pbWdbZGF0YS12LWEyZjI1MTI5XXtvYmplY3QtZml0OmNvdmVyO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCV9Lnh5LWZpZ3VyZS1zaWxob3VldHRlW2RhdGEtdi1hMmYyNTEyOV17ei1pbmRleDoxO2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7YW5pbWF0aW9uOjhzIGVhc2UtaW4tb3V0IGluZmluaXRlIGFsdGVybmF0ZSBmaWd1cmUtc3dheS1hMmYyNTEyOTtkaXNwbGF5OmZsZXg7cG9zaXRpb246cmVsYXRpdmV9QGtleWZyYW1lcyBmaWd1cmUtc3dheS1hMmYyNTEyOXswJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKXNjYWxlKDEpfTUwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNnB4KXNjYWxlKDEuMDEpfXRve3RyYW5zZm9ybTp0cmFuc2xhdGVZKDJweClzY2FsZSguOTk1KX19Lnh5LWRhb2lzdC1zdmdbZGF0YS12LWEyZjI1MTI5XXtmaWx0ZXI6ZHJvcC1zaGFkb3coMCAxMnB4IDI0cHggIzAwMDAwMDgwKTt3aWR0aDoxMDAlO21heC13aWR0aDoyMDBweDtoZWlnaHQ6MTAwJTttYXgtaGVpZ2h0OjM0MHB4fS54eS1vcmJpdGluZy1jaG9yZHNbZGF0YS12LWEyZjI1MTI5XXt0cmFuc2Zvcm0tb3JpZ2luOjExMHB4IDIyMHB4O2FuaW1hdGlvbjoyNHMgbGluZWFyIGluZmluaXRlIGNob3JkLXJvdGF0ZS1hMmYyNTEyOX1Aa2V5ZnJhbWVzIGNob3JkLXJvdGF0ZS1hMmYyNTEyOXswJXt0cmFuc2Zvcm06cm90YXRlKDApfXRve3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19Lnh5LWZpZ3VyZS1zcGFya2xlc1tkYXRhLXYtYTJmMjUxMjlde3BvaW50ZXItZXZlbnRzOm5vbmU7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MH0ueHktZi1kb3RbZGF0YS12LWEyZjI1MTI5XXtib3JkZXItcmFkaXVzOjUwJTt3aWR0aDozcHg7aGVpZ2h0OjNweDthbmltYXRpb246NHMgZWFzZS1pbi1vdXQgaW5maW5pdGUgZG90LXJpc2UtYTJmMjUxMjk7cG9zaXRpb246YWJzb2x1dGV9LmZpZ3VyZS1wbGF5ZXIgLnh5LWYtZG90W2RhdGEtdi1hMmYyNTEyOV17YmFja2dyb3VuZDojMzhiZGY4O2JveC1zaGFkb3c6MCAwIDhweCAjMzhiZGY4fS5maWd1cmUtZW5lbXkgLnh5LWYtZG90W2RhdGEtdi1hMmYyNTEyOV17YmFja2dyb3VuZDojZmI3MTg1O2JveC1zaGFkb3c6MCAwIDhweCAjZmI3MTg1fS5kMVtkYXRhLXYtYTJmMjUxMjlde2FuaW1hdGlvbi1kZWxheTowczt0b3A6NjAlO2xlZnQ6MzUlfS5kMltkYXRhLXYtYTJmMjUxMjlde2FuaW1hdGlvbi1kZWxheToxLjVzO3RvcDo0MCU7bGVmdDo2NSV9LmQzW2RhdGEtdi1hMmYyNTEyOV17YW5pbWF0aW9uLWRlbGF5OjIuOHM7dG9wOjc1JTtsZWZ0OjUwJX1Aa2V5ZnJhbWVzIGRvdC1yaXNlLWEyZjI1MTI5ezAle29wYWNpdHk6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgxMHB4KXNjYWxlKC41KX01MCV7b3BhY2l0eTouODt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMTVweClzY2FsZSgxLjIpfXRve29wYWNpdHk6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMzBweClzY2FsZSguNCl9fS54eS1jaG9yZC13aW5nc1tkYXRhLXYtOTA4YzEwYmFde3VzZXItc2VsZWN0Om5vbmU7anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7bWluLXdpZHRoOjI1MHB4O21heC13aWR0aDozMjBweDtoZWlnaHQ6MTAwJTttaW4taGVpZ2h0OjM0MHB4O2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZX0ueHktd2luZ3MtcmF5cy1zdmdbZGF0YS12LTkwOGMxMGJhXXtwb2ludGVyLWV2ZW50czpub25lO3otaW5kZXg6MDt3aWR0aDpjYWxjKDEwMCUgKyAzMHB4KTtoZWlnaHQ6Y2FsYygxMDAlICsgMzBweCk7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6LTE1cHg7b3ZlcmZsb3c6dmlzaWJsZX0ueHktd2luZ3MtY29udGFpbmVyW2RhdGEtdi05MDhjMTBiYV17ei1pbmRleDoxO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MTRweDt3aWR0aDoxMDAlO2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZX0ueHktd2luZy1mZWF0aGVyW2RhdGEtdi05MDhjMTBiYV17Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS14eS1ib3JkZXItc3VidGxlKTtiYWNrZHJvcC1maWx0ZXI6Ymx1cigxNnB4KTt3aWR0aDoxMDAlO21pbi1oZWlnaHQ6NTJweDtjb2xvcjp2YXIoLS14eS10ZXh0LXRpdGxlKTtjdXJzb3I6cG9pbnRlcjt0cmFuc2Zvcm0tb3JpZ2luOjA7Ym94LXNpemluZzpib3JkZXItYm94O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMGUxZTM2ZjAgMCUsIzA2MGUxYWZhIDEwMCUpO2JvcmRlci1yYWRpdXM6MTBweDtvdXRsaW5lOm5vbmU7YWxpZ24taXRlbXM6Y2VudGVyO3BhZGRpbmc6MTNweCAyMHB4O3RyYW5zaXRpb246dHJhbnNmb3JtIC40NXMgY3ViaWMtYmV6aWVyKC4xNiwxLC4zLDEpLG9wYWNpdHkgLjRzIGN1YmljLWJlemllciguMTYsMSwuMywxKSxmaWx0ZXIgLjRzLGJveC1zaGFkb3cgLjNzLGJvcmRlci1jb2xvciAuM3M7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlO2JveC1zaGFkb3c6MCA2cHggMjBweCAjMDAwMDAwNzMsaW5zZXQgMCAxcHggI2ZmZmZmZjE0fS53aW5ncy1lbmVteSAueHktd2luZy1mZWF0aGVyW2RhdGEtdi05MDhjMTBiYV17dHJhbnNmb3JtLW9yaWdpbjoxMDAlO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMmExMDFjZjAgMCUsIzE0MDYwZWZhIDEwMCUpO2JvcmRlci1jb2xvcjojZjQzZjVlNDc7ZmxleC1kaXJlY3Rpb246cm93LXJldmVyc2V9LmZlYXRoZXItcGxheWVyW2RhdGEtdi05MDhjMTBiYV06aG92ZXI6bm90KDpkaXNhYmxlZCk6bm90KC5pcy1zaHJ1bmspe2JvcmRlci1jb2xvcjp2YXIoLS14eS1jeWFuLTMwMCk7Ym94LXNoYWRvdzowIDhweCAzMHB4IHZhcigtLXh5LWN5YW4tZ2xvdyksIGluc2V0IDAgMCAxNnB4ICMzOGJkZjg1OTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzEyMmU1MmZhIDAlLCMwODE2MjggMTAwJSl9LmZlYXRoZXItZW5lbXlbZGF0YS12LTkwOGMxMGJhXTpob3Zlcjpub3QoOmRpc2FibGVkKTpub3QoLmlzLXNocnVuayl7Ym9yZGVyLWNvbG9yOnZhcigtLXh5LWNyaW1zb24tNDAwKTtib3gtc2hhZG93OjAgOHB4IDMwcHggdmFyKC0teHktY3JpbXNvbi1nbG93KSwgaW5zZXQgMCAwIDE2cHggI2Y0M2Y1ZTU5O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMzYxNjI0ZmEgMCUsIzFhMDgxMiAxMDAlKX0ueHktd2luZy1mZWF0aGVyLmlzLXNlbGVjdGVkW2RhdGEtdi05MDhjMTBiYV17Ym9yZGVyLWNvbG9yOnZhcigtLXh5LWdvbGQtNDAwKTtib3gtc2hhZG93OjAgMCAzMnB4IHZhcigtLXh5LWdvbGQtZ2xvdyksIDAgMTJweCAzNnB4ICMwMDAwMDBiMzt6LWluZGV4OjI1O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMWUzYTYwIDAlLCMwZTFlMzYgMTAwJSl9LndpbmdzLWVuZW15IC54eS13aW5nLWZlYXRoZXIuaXMtc2VsZWN0ZWRbZGF0YS12LTkwOGMxMGJhXXtib3JkZXItY29sb3I6dmFyKC0teHktY3JpbXNvbi00MDApO2JveC1zaGFkb3c6MCAwIDMycHggdmFyKC0teHktY3JpbXNvbi1nbG93KSwgMCAxMnB4IDM2cHggIzAwMDAwMGIzO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjNDAxODJhIDAlLCMxYzBhMTQgMTAwJSl9Lnh5LXdpbmctZmVhdGhlci5pcy1zaHJ1bmtbZGF0YS12LTkwOGMxMGJhXXtvcGFjaXR5Oi4yMjtmaWx0ZXI6Ymx1ciguOHB4KTtwb2ludGVyLWV2ZW50czpub25lO2JveC1zaGFkb3c6MCAycHggOHB4ICMwMDAwMDA0ZH0ueHktd2luZy1mZWF0aGVyLmlzLWxvY2tlZFtkYXRhLXYtOTA4YzEwYmFde29wYWNpdHk6LjY1O2N1cnNvcjpwb2ludGVyO2JvcmRlci1zdHlsZTpkYXNoZWR9LmZlYXRoZXItcGxheWVyLmlzLWxvY2tlZFtkYXRhLXYtOTA4YzEwYmFdOmhvdmVyOm5vdCguaXMtc2hydW5rKXtvcGFjaXR5Oi45NTtib3JkZXItY29sb3I6dmFyKC0teHktY3lhbi00MDApO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMGUyMjNjZjIgMCUsIzA2MTAyMCAxMDAlKTtib3gtc2hhZG93OjAgNnB4IDI0cHggIzM4YmRmODQwLGluc2V0IDAgMCAxMnB4ICMzOGJkZjgzM30ueHktZmVhdGhlci10aXBbZGF0YS12LTkwOGMxMGJhXXtwb2ludGVyLWV2ZW50czpub25lO2JvcmRlci1yYWRpdXM6NTAlO3dpZHRoOjZweDtoZWlnaHQ6NnB4O3RyYW5zaXRpb246YWxsIC4zcztwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpfS5mZWF0aGVyLXBsYXllciAueHktZmVhdGhlci10aXBbZGF0YS12LTkwOGMxMGJhXXtiYWNrZ3JvdW5kOnZhcigtLXh5LWN5YW4tNDAwKTtib3gtc2hhZG93OjAgMCAxMHB4IHZhcigtLXh5LWN5YW4tZ2xvdyk7cmlnaHQ6LTNweH0uZmVhdGhlci1lbmVteSAueHktZmVhdGhlci10aXBbZGF0YS12LTkwOGMxMGJhXXtiYWNrZ3JvdW5kOnZhcigtLXh5LWNyaW1zb24tNDAwKTtib3gtc2hhZG93OjAgMCAxMHB4IHZhcigtLXh5LWNyaW1zb24tZ2xvdyk7bGVmdDotM3B4fS54eS13aW5nLWZlYXRoZXIuaXMtc2VsZWN0ZWQgLnh5LWZlYXRoZXItdGlwW2RhdGEtdi05MDhjMTBiYV17YmFja2dyb3VuZDp2YXIoLS14eS1nb2xkLTQwMCk7d2lkdGg6OHB4O2hlaWdodDo4cHg7Ym94LXNoYWRvdzowIDAgMTZweCB2YXIoLS14eS1nb2xkLWdsb3cpfS54eS1mZWF0aGVyLWlubmVyW2RhdGEtdi05MDhjMTBiYV17anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4O3dpZHRoOjEwMCU7ZGlzcGxheTpmbGV4fS54eS1mZWF0aGVyLWNyZXN0W2RhdGEtdi05MDhjMTBiYV17Y29sb3I6dmFyKC0teHktZ29sZC00MDApO29wYWNpdHk6Ljg7Zm9udC1zaXplOjEwcHh9Lnh5LWZlYXRoZXItbmFtZVtkYXRhLXYtOTA4YzEwYmFde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2xldHRlci1zcGFjaW5nOi4wOGVtO2NvbG9yOnZhcigtLXh5LWN5YW4tMTAwKTt3aGl0ZS1zcGFjZTpub3dyYXA7dGV4dC1vdmVyZmxvdzplbGxpcHNpcztmb250LXNpemU6MTVweDtmb250LXdlaWdodDo2MDA7b3ZlcmZsb3c6aGlkZGVufS5mZWF0aGVyLWVuZW15IC54eS1mZWF0aGVyLW5hbWVbZGF0YS12LTkwOGMxMGJhXXtjb2xvcjojZmVkN2FhfS54eS13aW5nLWZlYXRoZXIuaXMtc2VsZWN0ZWQgLnh5LWZlYXRoZXItbmFtZVtkYXRhLXYtOTA4YzEwYmFde2NvbG9yOiNmZmY7dGV4dC1zaGFkb3c6MCAwIDEycHggdmFyKC0teHktZ29sZC0zMDApfS54eS1mZWF0aGVyLWJhZGdlW2RhdGEtdi05MDhjMTBiYV17Zm9udC1zaXplOjEwcHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtiYWNrZ3JvdW5kOiNmZmZmZmYxNDtib3JkZXItcmFkaXVzOjRweDtwYWRkaW5nOjJweCA3cHh9LmZlYXRoZXItcGxheWVyIC54eS1mZWF0aGVyLWJhZGdlW2RhdGEtdi05MDhjMTBiYV17Y29sb3I6dmFyKC0teHktY3lhbi0zMDApO2JhY2tncm91bmQ6IzM4YmRmODI2fS5mZWF0aGVyLWVuZW15IC54eS1mZWF0aGVyLWJhZGdlW2RhdGEtdi05MDhjMTBiYV17Y29sb3I6dmFyKC0teHktY3JpbXNvbi0zMDApO2JhY2tncm91bmQ6I2Y0M2Y1ZTI2fS54eS1mZWF0aGVyLWxvY2tbZGF0YS12LTkwOGMxMGJhXXtmb250LXNpemU6MTJweH0ueHktd2luZ3MtZW1wdHlbZGF0YS12LTkwOGMxMGJhXXt0ZXh0LWFsaWduOmNlbnRlcjtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtib3JkZXI6MXB4IGRhc2hlZCAjZmZmZmZmMWE7Ym9yZGVyLXJhZGl1czoxMHB4O3BhZGRpbmc6MjBweDtmb250LXNpemU6MTJweDtmb250LXN0eWxlOml0YWxpY30ueHktZmlnaHRlci16b25lW2RhdGEtdi02ODdiOGQwN117ZmxleC1kaXJlY3Rpb246Y29sdW1uO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2dhcDoxMnB4O2hlaWdodDoxMDAlO21pbi1oZWlnaHQ6MDtkaXNwbGF5OmZsZXh9Lnh5LWJ1ZmYtYm94LWxhbmVbZGF0YS12LTY4N2I4ZDA3XXtmbGV4LXNocmluazowO3dpZHRoOjEwMCV9Lnh5LWJ1ZmYtY2FyZFtkYXRhLXYtNjg3YjhkMDdde2JvcmRlcjoxcHggc29saWQgdmFyKC0teHktYm9yZGVyLXN1YnRsZSk7YmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweCk7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMwZTFjMzBjYyAwJSwjMDYwZTFhZTYgMTAwJSk7Ym9yZGVyLXJhZGl1czo4cHg7cGFkZGluZzo4cHggMTRweDtib3gtc2hhZG93OjAgNHB4IDE0cHggIzAwMDAwMDU5fS5idWZmLXBsYXllcltkYXRhLXYtNjg3YjhkMDdde2JvcmRlci1jb2xvcjojMzhiZGY4NDB9LmJ1ZmYtZW5lbXlbZGF0YS12LTY4N2I4ZDA3XXtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzIwMGUxNmNjIDAlLCMwZTA2MGFlNiAxMDAlKTtib3JkZXItY29sb3I6I2Y0M2Y1ZTQwfS54eS1idWZmLWhlYWRlcltkYXRhLXYtNjg3YjhkMDdde2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O21hcmdpbi1ib3R0b206NnB4O2Rpc3BsYXk6ZmxleH0ueHktYnVmZi1pY29uW2RhdGEtdi02ODdiOGQwN117Zm9udC1zaXplOjExcHh9LmJ1ZmYtcGxheWVyIC54eS1idWZmLWljb25bZGF0YS12LTY4N2I4ZDA3XXtjb2xvcjp2YXIoLS14eS1jeWFuLTQwMCl9LmJ1ZmYtZW5lbXkgLnh5LWJ1ZmYtaWNvbltkYXRhLXYtNjg3YjhkMDdde2NvbG9yOnZhcigtLXh5LWNyaW1zb24tNDAwKX0ueHktYnVmZi10aXRsZVtkYXRhLXYtNjg3YjhkMDdde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2xldHRlci1zcGFjaW5nOi4wOGVtO2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO2ZvbnQtc2l6ZToxMXB4fS54eS1idWZmLWNvbnRlbnRbZGF0YS12LTY4N2I4ZDA3XXthbGlnbi1pdGVtczpjZW50ZXI7bWluLWhlaWdodDoyNHB4O2Rpc3BsYXk6ZmxleH0ueHktYnVmZi1iYWRnZXNbZGF0YS12LTY4N2I4ZDA3XXtmbGV4LXdyYXA6d3JhcDtnYXA6NnB4O2Rpc3BsYXk6ZmxleH0ueHktYnVmZi1waWxsW2RhdGEtdi02ODdiOGQwN117Y29sb3I6dmFyKC0teHktY3lhbi0yMDApO2JhY2tncm91bmQ6IzBlYTVlOTFmO2JvcmRlcjoxcHggc29saWQgIzM4YmRmODRkO2JvcmRlci1yYWRpdXM6NHB4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NXB4O3BhZGRpbmc6MnB4IDhweDtmb250LXNpemU6MTFweDtkaXNwbGF5OmlubGluZS1mbGV4fS5idWZmLWVuZW15IC54eS1idWZmLXBpbGxbZGF0YS12LTY4N2I4ZDA3XXtjb2xvcjp2YXIoLS14eS1jcmltc29uLTMwMCk7YmFja2dyb3VuZDojZjQzZjVlMWY7Ym9yZGVyLWNvbG9yOiNmNDNmNWU1OX0ueHktcGlsbC1kb3RbZGF0YS12LTY4N2I4ZDA3XXtiYWNrZ3JvdW5kOmN1cnJlbnRDb2xvcjtib3JkZXItcmFkaXVzOjUwJTt3aWR0aDo0cHg7aGVpZ2h0OjRweH0ueHktcGlsbC1yb3VuZFtkYXRhLXYtNjg3YjhkMDdde2ZvbnQtc2l6ZTo5cHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtvcGFjaXR5Oi44fS54eS1idWZmLWVtcHR5W2RhdGEtdi02ODdiOGQwN117Y29sb3I6dmFyKC0teHktdGV4dC1oaW50KTtmb250LXNpemU6MTFweDtmb250LXN0eWxlOml0YWxpY30ueHktem9uZS1taWRkbGVbZGF0YS12LTY4N2I4ZDA3XXtmbGV4OjE7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciAyNzBweDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjE2cHg7bWluLWhlaWdodDowO2Rpc3BsYXk6Z3JpZDtwb3NpdGlvbjpyZWxhdGl2ZX0uem9uZS1lbmVteSAueHktem9uZS1taWRkbGVbZGF0YS12LTY4N2I4ZDA3XXtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MjcwcHggMWZyfS54eS1maWd1cmUtd3JhcHBlcltkYXRhLXYtNjg3YjhkMDddLC54eS13aW5ncy13cmFwcGVyW2RhdGEtdi02ODdiOGQwN117anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7aGVpZ2h0OjEwMCU7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlfS54eS1pbmZvLWJveC1sYW5lW2RhdGEtdi02ODdiOGQwN117ZmxleC1zaHJpbms6MDt3aWR0aDoxMDAlfS54eS1jaGFyYWN0ZXItaW5mby1jYXJkW2RhdGEtdi02ODdiOGQwN117Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS14eS1ib3JkZXItZ29sZCk7YmFja2Ryb3AtZmlsdGVyOmJsdXIoMjBweCk7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMwZTFjMzBlNiAwJSwjMDYwZTFhZjIgMTAwJSk7Ym9yZGVyLXJhZGl1czoxMHB4O3BhZGRpbmc6MTJweCAxOHB4O2JveC1zaGFkb3c6MCA4cHggMjRweCAjMDAwNixpbnNldCAwIDFweCAjZmJiZjI0MWZ9LmluZm8tcGxheWVyW2RhdGEtdi02ODdiOGQwN117Ym9yZGVyLWNvbG9yOiNmYmJmMjQ1OX0uaW5mby1lbmVteVtkYXRhLXYtNjg3YjhkMDdde2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMjAwZTE2ZTYgMCUsIzBlMDYwYWYyIDEwMCUpO2JvcmRlci1jb2xvcjojZjQzZjVlNGR9Lnh5LWluZm8tdG9wW2RhdGEtdi02ODdiOGQwN117anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO21hcmdpbi1ib3R0b206NnB4O2Rpc3BsYXk6ZmxleH0ueHktaW5mby10aXRsZS1ncm91cFtkYXRhLXYtNjg3YjhkMDdde2FsaWduLWl0ZW1zOmJhc2VsaW5lO2dhcDo4cHg7ZGlzcGxheTpmbGV4fS54eS1zaWRlLWtpY2tlcltkYXRhLXYtNjg3YjhkMDdde2ZvbnQtc2l6ZTo5cHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtsZXR0ZXItc3BhY2luZzouMTRlbTtjb2xvcjp2YXIoLS14eS1nb2xkLTQwMCl9LmluZm8tZW5lbXkgLnh5LXNpZGUta2lja2VyW2RhdGEtdi02ODdiOGQwN117Y29sb3I6dmFyKC0teHktY3JpbXNvbi00MDApfS54eS1hY3Rvci1uYW1lW2RhdGEtdi02ODdiOGQwN117Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7bGV0dGVyLXNwYWNpbmc6LjA2ZW07Y29sb3I6dmFyKC0teHktdGV4dC10aXRsZSk7bWFyZ2luOjA7Zm9udC1zaXplOjE4cHg7Zm9udC13ZWlnaHQ6NjAwfS54eS1hY3Rvci1pZFtkYXRhLXYtNjg3YjhkMDdde2ZvbnQtc2l6ZToxMHB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktdGV4dC1oaW50KX0ueHktdGFyZ2V0LXN3aXRjaGVyc1tkYXRhLXYtNjg3YjhkMDdde2dhcDo1cHg7ZGlzcGxheTpmbGV4fS54eS1zd2l0Y2gtYnRuW2RhdGEtdi02ODdiOGQwN117LXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6Ymx1cigxMnB4KTtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZmZmZjE0IDAlLCNmZmZmZmYwNSAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYyNDtib3JkZXItcmFkaXVzOjk5OXB4O3BhZGRpbmc6M3B4IDEwcHg7Zm9udC1zaXplOjEwcHg7dHJhbnNpdGlvbjphbGwgLjI0cyBjdWJpYy1iZXppZXIoLjE2LDEsLjMsMSk7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxcHggI2ZmZjMsMCAycHggOHB4ICMwMDAwMDA0MH0ueHktc3dpdGNoLWJ0bltkYXRhLXYtNjg3YjhkMDddOmhvdmVye2NvbG9yOiNmY2E1YTU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmNDNmNWUzMyAwJSwjZTExZDQ4MTQgMTAwJSk7Ym9yZGVyLWNvbG9yOiNmNDNmNWU2Njt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KTtib3gtc2hhZG93Omluc2V0IDAgMXB4IDEuNXB4ICNmZmZmZmY1OSwwIDRweCAxMnB4ICNmNDNmNWU0ZH0ueHktc3dpdGNoLWJ0bi5hY3RpdmVbZGF0YS12LTY4N2I4ZDA3XXtib3JkZXItY29sb3I6dmFyKC0teHktY3JpbXNvbi00MDApO2NvbG9yOiNmZmY7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmNDNmNWU1OSAwJSwjZTExZDQ4MjYgMTAwJSk7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxLjVweCAjZmZmNiwwIDAgMTZweCAjZjQzZjVlNTl9Lnh5LXRyYWl0cy1yb3dbZGF0YS12LTY4N2I4ZDA3XXtmbGV4LXdyYXA6d3JhcDtnYXA6OHB4IDE0cHg7bWFyZ2luLWJvdHRvbTo2cHg7Zm9udC1zaXplOjExcHg7ZGlzcGxheTpmbGV4fS54eS10cmFpdC1pdGVtW2RhdGEtdi02ODdiOGQwN117Z2FwOjVweDtkaXNwbGF5OmlubGluZS1mbGV4fS54eS10cmFpdC1rW2RhdGEtdi02ODdiOGQwN117Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCk7Zm9udC13ZWlnaHQ6NTAwfS54eS10cmFpdC12W2RhdGEtdi02ODdiOGQwN117Y29sb3I6dmFyKC0teHktY3lhbi0yMDApfS5pbmZvLWVuZW15IC54eS10cmFpdC12W2RhdGEtdi02ODdiOGQwN117Y29sb3I6I2ZlZDdhYX0ueHktdHJhaXQtbm9uZVtkYXRhLXYtNjg3YjhkMDdde2NvbG9yOnZhcigtLXh5LXRleHQtaGludCk7Zm9udC1zaXplOjExcHg7Zm9udC1zdHlsZTppdGFsaWN9Lnh5LXJlc291cmNlcy1yb3dbZGF0YS12LTY4N2I4ZDA3XXtib3JkZXItdG9wOjFweCBkYXNoZWQgI2ZmZmZmZjE0O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O3BhZGRpbmctdG9wOjZweDtkaXNwbGF5OmZsZXh9Lnh5LXJlcy1sYWJlbFtkYXRhLXYtNjg3YjhkMDdde2ZvbnQtc2l6ZToxMHB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCl9Lnh5LXJlcy1jaGlwc1tkYXRhLXYtNjg3YjhkMDdde2dhcDo2cHg7ZGlzcGxheTpmbGV4fS54eS1yZXMtdGFnW2RhdGEtdi02ODdiOGQwN117Zm9udC1zaXplOjEwcHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCk7YmFja2dyb3VuZDojZmZmZmZmMGY7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmMTQ7Ym9yZGVyLXJhZGl1czo0cHg7cGFkZGluZzoxcHggNnB4fS54eS1oYXJtb25pYy1nYXVnZVtkYXRhLXYtYmVjZDQ5ZmZde3VzZXItc2VsZWN0Om5vbmU7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7bWluLXdpZHRoOjEwMHB4O2Rpc3BsYXk6ZmxleH0ueHktZ2F1Z2Utcm91bmRbZGF0YS12LWJlY2Q0OWZmXXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7bGluZS1oZWlnaHQ6MS4xO2Rpc3BsYXk6ZmxleH0ueHktcm91bmQtcm9tYW5bZGF0YS12LWJlY2Q0OWZmXXtsZXR0ZXItc3BhY2luZzouMjJlbTtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtmb250LXNpemU6OHB4fS54eS1yb3VuZC1udW1bZGF0YS12LWJlY2Q0OWZmXXtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCk7dGV4dC1zaGFkb3c6MCAwIDEwcHggdmFyKC0teHktZ29sZC1nbG93KTtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo2MDB9Lnh5LXdhdmUtcmVzb25hdG9yW2RhdGEtdi1iZWNkNDlmZl17d2lkdGg6OTBweDtoZWlnaHQ6MjhweH0ueHktd2F2ZS1zdmdbZGF0YS12LWJlY2Q0OWZmXXt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO292ZXJmbG93OnZpc2libGV9Lnh5LXNpbmUtcGF0aC5wMVtkYXRhLXYtYmVjZDQ5ZmZde2FuaW1hdGlvbjozcyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGUgc2luZS13YXZlLXB1bHNlLWJlY2Q0OWZmfS54eS1zaW5lLXBhdGgucDJbZGF0YS12LWJlY2Q0OWZmXXthbmltYXRpb246Mi4ycyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGUtcmV2ZXJzZSBzaW5lLXdhdmUtcHVsc2UtYmVjZDQ5ZmZ9QGtleWZyYW1lcyBzaW5lLXdhdmUtcHVsc2UtYmVjZDQ5ZmZ7MCV7dHJhbnNmb3JtOnNjYWxlWSguNyl9dG97dHJhbnNmb3JtOnNjYWxlWSgxLjMpfX0ueHktY2VudGVyLW5vZGVbZGF0YS12LWJlY2Q0OWZmXXthbmltYXRpb246MnMgaW5maW5pdGUgeHktcHVsc2UtZ2xvd30ueHktdnMtZW1ibGVtW2RhdGEtdi1iZWNkNDlmZl17Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS14eS1ib3JkZXItZ29sZCk7d2lkdGg6NDRweDtoZWlnaHQ6NDRweDtib3gtc2hhZG93OjAgMCAxNnB4IHZhcigtLXh5LWdvbGQtZ2xvdyksIDAgNHB4IDEycHggIzAwMDAwMDgwO2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCAzNSUgMzUlLCMxOTJkNGJlNiwjMDgxMDFjZjIpO2JvcmRlci1yYWRpdXM6NTAlO2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZX0ueHktdnMtdGV4dFtkYXRhLXYtYmVjZDQ5ZmZde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2xldHRlci1zcGFjaW5nOi4wOGVtO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjZmVmMDhhIDAlLCNmNTllMGIgNjAlLCNkOTc3MDYgMTAwJSk7LXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6dHJhbnNwYXJlbnQ7dGV4dC1zaGFkb3c6MCAwIDhweCAjZmJiZjI0NGQ7LXdlYmtpdC1iYWNrZ3JvdW5kLWNsaXA6dGV4dDtmb250LXNpemU6MThweDtmb250LXdlaWdodDo3MDB9Lnh5LXZzLWF1cmFbZGF0YS12LWJlY2Q0OWZmXXtib3JkZXI6MXB4IGRhc2hlZCAjZmJiZjI0NGQ7Ym9yZGVyLXJhZGl1czo1MCU7YW5pbWF0aW9uOjIwcyBsaW5lYXIgaW5maW5pdGUgdnMtcm90YXRlLWJlY2Q0OWZmO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0Oi0zcHh9QGtleWZyYW1lcyB2cy1yb3RhdGUtYmVjZDQ5ZmZ7MCV7dHJhbnNmb3JtOnJvdGF0ZSgwKX10b3t0cmFuc2Zvcm06cm90YXRlKDM2MGRlZyl9fS54eS1kb21pbmFuY2UtcGlsbFtkYXRhLXYtYmVjZDQ5ZmZde2ZvbnQtc2l6ZToxMHB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2Fucyk7bGV0dGVyLXNwYWNpbmc6LjA4ZW07d2hpdGUtc3BhY2U6bm93cmFwO2JhY2tncm91bmQ6I2ZmZmZmZjBhO2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjE0O2JvcmRlci1yYWRpdXM6OTk5cHg7cGFkZGluZzozcHggMTBweH0uZG9tLW5ldXRyYWxbZGF0YS12LWJlY2Q0OWZmXXtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCk7Ym9yZGVyLWNvbG9yOiNmYmJmMjQ0MH0uZG9tLXBsYXllcltkYXRhLXYtYmVjZDQ5ZmZde2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKTt0ZXh0LXNoYWRvdzowIDAgOHB4IHZhcigtLXh5LWN5YW4tZ2xvdyk7YmFja2dyb3VuZDojMzhiZGY4MTQ7Ym9yZGVyLWNvbG9yOiMzOGJkZjg1OX0uZG9tLWVuZW15W2RhdGEtdi1iZWNkNDlmZl17Y29sb3I6dmFyKC0teHktY3JpbXNvbi0zMDApO3RleHQtc2hhZG93OjAgMCA4cHggdmFyKC0teHktY3JpbXNvbi1nbG93KTtiYWNrZ3JvdW5kOiNmNDNmNWUxNDtib3JkZXItY29sb3I6I2Y0M2Y1ZTU5fS54eS1jZW50ZXItc3RhZ2VbZGF0YS12LTFhNWFlZDM0XXtib3JkZXI6MXB4IHNvbGlkIHZhcigtLXh5LWJvcmRlci1zdWJ0bGUpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDI0cHgpO3VzZXItc2VsZWN0Om5vbmU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoIzBhMTYyNmYyIDAlLCMwNTBjMTZmYSAxMDAlKTtib3JkZXItcmFkaXVzOjEycHg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2hlaWdodDoxMDAlO21pbi1oZWlnaHQ6MDtkaXNwbGF5OmZsZXg7b3ZlcmZsb3c6aGlkZGVuO2JveC1zaGFkb3c6MCAxNnB4IDQ4cHggIzAwMDksaW5zZXQgMCAxcHggI2ZmZmZmZjE0fS54eS1jZW50ZXItaGVhZFtkYXRhLXYtMWE1YWVkMzRde2JhY2tncm91bmQ6IzA3MTAxZTgwO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNmZmZmZmYwZjtmbGV4LWRpcmVjdGlvbjpjb2x1bW47ZmxleC1zaHJpbms6MDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtwYWRkaW5nOjEycHggMTZweCA4cHg7ZGlzcGxheTpmbGV4fS54eS1waWxsYXItY3Jlc3RbZGF0YS12LTFhNWFlZDM0XXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtsZXR0ZXItc3BhY2luZzouMTRlbTtjb2xvcjp2YXIoLS14eS1nb2xkLTQwMCk7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7Zm9udC1zaXplOjExcHg7ZGlzcGxheTpmbGV4fS54eS1waWxsYXItY3Jlc3QtZG90W2RhdGEtdi0xYTVhZWQzNF17Zm9udC1zaXplOjEzcHh9Lnh5LWNlbnRlci13ZWF0aGVyW2RhdGEtdi0xYTVhZWQzNF17Y29sb3I6dmFyKC0teHktY3lhbi0yMDApO2JhY2tncm91bmQ6IzM4YmRmODE0O2JvcmRlcjoxcHggc29saWQgIzM4YmRmODI5O2JvcmRlci1yYWRpdXM6OTk5cHg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7cGFkZGluZzoycHggMTBweDtmb250LXNpemU6MTBweDtkaXNwbGF5OmlubGluZS1mbGV4fS54eS13ZWF0aGVyLWRvdFtkYXRhLXYtMWE1YWVkMzRde2NvbG9yOnZhcigtLXh5LWN5YW4tNDAwKTtmb250LXNpemU6NnB4fS54eS1jZW50ZXItYm9keVtkYXRhLXYtMWE1YWVkMzRde2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtmbGV4OjE7Z2FwOjEycHg7bWluLWhlaWdodDowO3BhZGRpbmc6MTJweCAxNnB4O2Rpc3BsYXk6ZmxleDtvdmVyZmxvdy15OmF1dG99Lnh5LXRlcm0tc2Nyb2xsLXZpZXdbZGF0YS12LTFhNWFlZDM0XXthbmltYXRpb246dmlldy1pbi0xYTVhZWQzNCAuMnMgdmFyKC0teHktZWFzZS1vdXQtZXhwbyk7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoxMHB4O2Rpc3BsYXk6ZmxleH0ueHktc2Nyb2xsLXRvcC1iYXJbZGF0YS12LTFhNWFlZDM0XXtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7ZGlzcGxheTpmbGV4fS54eS1zY3JvbGwtYmFkZ2VbZGF0YS12LTFhNWFlZDM0XXtmb250LXNpemU6MTBweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjp2YXIoLS14eS1nb2xkLTQwMCk7Z2FwOjVweDtkaXNwbGF5OmZsZXh9Lnh5LXNjcm9sbC1jbG9zZS1idG5bZGF0YS12LTFhNWFlZDM0XXtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOjAgMDtib3JkZXI6MDtwYWRkaW5nOjJweCA2cHg7Zm9udC1zaXplOjE0cHh9Lnh5LXNjcm9sbC1jbG9zZS1idG5bZGF0YS12LTFhNWFlZDM0XTpob3Zlcntjb2xvcjp2YXIoLS14eS1jcmltc29uLTQwMCl9Lnh5LXNjcm9sbC10ZWNoLXRpdGxlW2RhdGEtdi0xYTVhZWQzNF17Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7bGV0dGVyLXNwYWNpbmc6LjA2ZW07anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO21hcmdpbjowO2ZvbnQtc2l6ZToxOHB4O2ZvbnQtd2VpZ2h0OjYwMDtkaXNwbGF5OmZsZXh9Lnh5LXRlY2gtbmFtZS1nbG93W2RhdGEtdi0xYTVhZWQzNF17YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmZmYgMCUsI2JhZTZmZCA2MCUsIzM4YmRmOCAxMDAlKTstd2Via2l0LXRleHQtZmlsbC1jb2xvcjp0cmFuc3BhcmVudDstd2Via2l0LWJhY2tncm91bmQtY2xpcDp0ZXh0fS54eS1icmFja2V0W2RhdGEtdi0xYTVhZWQzNF17Y29sb3I6dmFyKC0teHktY3lhbi00MDApO29wYWNpdHk6LjZ9Lnh5LXRlY2gtc3RhdHVzLWNoaXBbZGF0YS12LTFhNWFlZDM0XXtmb250LXNpemU6MTBweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2JvcmRlci1yYWRpdXM6OTk5cHg7cGFkZGluZzoycHggN3B4fS5zdGF0dXMtcGFzc1tkYXRhLXYtMWE1YWVkMzRde2NvbG9yOnZhcigtLXh5LWphZGUtMzAwKTtiYWNrZ3JvdW5kOiMyZGQ0YmYyNjtib3JkZXI6MXB4IHNvbGlkICMyZGQ0YmY2Nn0uc3RhdHVzLWZhaWxbZGF0YS12LTFhNWFlZDM0XXtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCk7YmFja2dyb3VuZDojZmJiZjI0MjY7Ym9yZGVyOjFweCBzb2xpZCAjZmJiZjI0NjZ9LnN0YXR1cy1vYnNlcnZlW2RhdGEtdi0xYTVhZWQzNF17Y29sb3I6dmFyKC0teHktY3JpbXNvbi0zMDApO2JhY2tncm91bmQ6I2Y0M2Y1ZTI2O2JvcmRlcjoxcHggc29saWQgI2Y0M2Y1ZTY2fS54eS1zY3JvbGwtcXVvdGVbZGF0YS12LTFhNWFlZDM0XXtib3JkZXItbGVmdDoycHggc29saWQgdmFyKC0teHktZ29sZC00MDApO2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LWN5YW4tMTAwKTtiYWNrZ3JvdW5kOiNmYmJmMjQwZDtib3JkZXItcmFkaXVzOjAgNnB4IDZweCAwO21hcmdpbjowO3BhZGRpbmc6OHB4IDEycHg7Zm9udC1zaXplOjEycHg7bGluZS1oZWlnaHQ6MS42fS54eS1zY3JvbGwtZGV0YWlsc1tkYXRhLXYtMWE1YWVkMzRde2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O2Rpc3BsYXk6ZmxleH0ueHktZGV0YWlsLWJsb2NrW2RhdGEtdi0xYTVhZWQzNF17YmFja2dyb3VuZDojMDcxMDFlOTk7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmMGY7Ym9yZGVyLXJhZGl1czo2cHg7cGFkZGluZzo4cHggMTBweH0ueHktZGV0YWlsLWxhYmVsW2RhdGEtdi0xYTVhZWQzNF17Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y29sb3I6dmFyKC0teHktZ29sZC0zMDApO21hcmdpbi1ib3R0b206NHB4O2ZvbnQtc2l6ZToxMHB4O2Rpc3BsYXk6YmxvY2t9Lnh5LWRldGFpbC1saXN0W2RhdGEtdi0xYTVhZWQzNF17Y29sb3I6dmFyKC0teHktdGV4dC1ib2R5KTttYXJnaW46MDtwYWRkaW5nLWxlZnQ6MTRweDtmb250LXNpemU6MTFweDtsaW5lLWhlaWdodDoxLjV9Lnh5LWNvbmQtdGV4dFtkYXRhLXYtMWE1YWVkMzRde21hcmdpbjowO2ZvbnQtc2l6ZToxMXB4fS54eS1jb25kLXRleHQucGFzc1tkYXRhLXYtMWE1YWVkMzRde2NvbG9yOnZhcigtLXh5LWphZGUtMzAwKX0ueHktY29uZC10ZXh0LmZhaWxbZGF0YS12LTFhNWFlZDM0XXtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCl9Lnh5LXJ1bGUtdGFnc1tkYXRhLXYtMWE1YWVkMzRde2ZsZXgtd3JhcDp3cmFwO2dhcDo0cHg7ZGlzcGxheTpmbGV4fS54eS1ydWxlLXRhZ1tkYXRhLXYtMWE1YWVkMzRde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktY3lhbi0yMDApO2JhY2tncm91bmQ6IzM4YmRmODI2O2JvcmRlcjoxcHggc29saWQgIzM4YmRmODRkO2JvcmRlci1yYWRpdXM6M3B4O3BhZGRpbmc6MXB4IDVweDtmb250LXNpemU6OXB4fS54eS1zY3JvbGwtYWN0aW9uW2RhdGEtdi0xYTVhZWQzNF17bWFyZ2luLXRvcDo0cHh9Lnh5LXBpY2stdGVjaC1idG5bZGF0YS12LTFhNWFlZDM0XXtib3JkZXI6MXB4IHNvbGlkIHZhcigtLXh5LWN5YW4tNDAwKTtjb2xvcjojZmZmO3dpZHRoOjEwMCU7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y3Vyc29yOnBvaW50ZXI7Ym94LXNoYWRvdzowIDRweCAxMnB4IHZhcigtLXh5LWN5YW4tZ2xvdyk7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMwMjg0YzdjYyAwJSwjMDM2OWExZTYgMTAwJSk7Ym9yZGVyLXJhZGl1czo2cHg7anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtwYWRkaW5nOjhweCAxNHB4O2ZvbnQtc2l6ZToxMnB4O2ZvbnQtd2VpZ2h0OjUwMDt0cmFuc2l0aW9uOmFsbCAuMnM7ZGlzcGxheTpmbGV4fS54eS1waWNrLXRlY2gtYnRuW2RhdGEtdi0xYTVhZWQzNF06aG92ZXJ7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMwMjg0YzcgMCUsIzAzNjlhMSAxMDAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KX0ueHktc2l0dWF0aW9uLXZpZXdbZGF0YS12LTFhNWFlZDM0XXtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjEwcHg7ZGlzcGxheTpmbGV4fS54eS1wb3NpdGlvbnMtY2FyZFtkYXRhLXYtMWE1YWVkMzRde2JhY2tncm91bmQ6IzA3MTAxZTk5O2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjE0O2JvcmRlci1yYWRpdXM6OHB4O3BhZGRpbmc6MTBweCAxMnB4fS54eS1wb3MtaGVhZGVyW2RhdGEtdi0xYTVhZWQzNF17Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7bGV0dGVyLXNwYWNpbmc6LjFlbTtjb2xvcjp2YXIoLS14eS1nb2xkLTQwMCk7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo1cHg7bWFyZ2luLWJvdHRvbTo4cHg7Zm9udC1zaXplOjEwcHg7ZGlzcGxheTpmbGV4fS54eS1wb3MtY2xhc2hbZGF0YS12LTFhNWFlZDM0XXtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7ZGlzcGxheTpmbGV4fS54eS1wb3Mtbm9kZVtkYXRhLXYtMWE1YWVkMzRde2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjJweDtkaXNwbGF5OmZsZXh9Lnh5LW5vZGUtbmFtZVtkYXRhLXYtMWE1YWVkMzRde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO2ZvbnQtc2l6ZToxMHB4fS54eS1ub2RlLXZhbFtkYXRhLXYtMWE1YWVkMzRde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OjUwMH0ueHktcG9zLW5vZGUucGxheWVyIC54eS1ub2RlLXZhbFtkYXRhLXYtMWE1YWVkMzRde2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKX0ueHktcG9zLW5vZGUuZW5lbXkgLnh5LW5vZGUtdmFsW2RhdGEtdi0xYTVhZWQzNF17Y29sb3I6dmFyKC0teHktY3JpbXNvbi00MDApfS54eS1wb3MtYnJpZGdlW2RhdGEtdi0xYTVhZWQzNF17ZmxleC1kaXJlY3Rpb246Y29sdW1uO2ZsZXg6MTthbGlnbi1pdGVtczpjZW50ZXI7cGFkZGluZzowIDEycHg7ZGlzcGxheTpmbGV4fS54eS1icmlkZ2UtZGlzdFtkYXRhLXYtMWE1YWVkMzRde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktZ29sZC0zMDApO21hcmdpbi1ib3R0b206M3B4O2ZvbnQtc2l6ZTo5cHh9Lnh5LWJyaWRnZS1saW5lW2RhdGEtdi0xYTVhZWQzNF17b3BhY2l0eTouNjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCg5MGRlZywjMzhiZGY4IDAlLCNmYmJmMjQgNTAlLCNmYjcxODUgMTAwJSk7d2lkdGg6MTAwJTtoZWlnaHQ6MXB4fS54eS1zZW1hbnRpYy1ncmlkW2RhdGEtdi0xYTVhZWQzNF17Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgzLDFmcik7Z2FwOjZweDtkaXNwbGF5OmdyaWR9Lnh5LXNlbS1jYXJkW2RhdGEtdi0xYTVhZWQzNF17YmFja2dyb3VuZDojZmZmZmZmMDg7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmMGY7Ym9yZGVyLXJhZGl1czo0cHg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MnB4O3BhZGRpbmc6NXB4IDZweDtkaXNwbGF5OmZsZXh9Lnh5LXNlbS1jYXJkLmFjdGl2ZVtkYXRhLXYtMWE1YWVkMzRde2JhY2tncm91bmQ6IzJkZDRiZjE0O2JvcmRlci1jb2xvcjojMmRkNGJmNGR9Lnh5LXNlbS1rW2RhdGEtdi0xYTVhZWQzNF17Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCk7Zm9udC1zaXplOjlweH0ueHktc2VtLXZbZGF0YS12LTFhNWFlZDM0XXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2NvbG9yOnZhcigtLXh5LXRleHQtYm9keSk7Zm9udC1zaXplOjEwcHh9Lnh5LXNlbS1jYXJkLmFjdGl2ZSAueHktc2VtLXZbZGF0YS12LTFhNWFlZDM0XXtjb2xvcjp2YXIoLS14eS1qYWRlLTMwMCl9Lnh5LXZlcmRpY3QtY2FyZFtkYXRhLXYtMWE1YWVkMzRde2JhY2tncm91bmQ6IzA3MTAxZTk5O2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjE0O2JvcmRlci1yYWRpdXM6OHB4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4O3BhZGRpbmc6MTBweCAxMnB4O2Rpc3BsYXk6ZmxleH0ueHktdmVyZGljdC1oZWFkZXJbZGF0YS12LTFhNWFlZDM0XXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjp2YXIoLS14eS1nb2xkLTQwMCk7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2ZvbnQtc2l6ZToxMXB4O2Rpc3BsYXk6ZmxleH0ueHktdmVyZGljdC1yb3VuZFtkYXRhLXYtMWE1YWVkMzRde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCk7Zm9udC1zaXplOjlweH0ueHktdmVyZGljdC1ib2R5W2RhdGEtdi0xYTVhZWQzNF17Y29sb3I6dmFyKC0teHktdGV4dC1ib2R5KTtmb250LXNpemU6MTFweDtsaW5lLWhlaWdodDoxLjV9Lnh5LXZlcmRpY3QtYWN0aW9uW2RhdGEtdi0xYTVhZWQzNF17Y29sb3I6dmFyKC0teHktY3lhbi0yMDApO21hcmdpbjowIDAgNHB4fS54eS12ZXJkaWN0LXByb3NlIHBbZGF0YS12LTFhNWFlZDM0XXtjb2xvcjojZTJlOGYwO21hcmdpbjowfS54eS12ZXJkaWN0LXN1bW1hcnlbZGF0YS12LTFhNWFlZDM0XXtjb2xvcjojY2JkNWUxO21hcmdpbjowfS54eS12ZXJkaWN0LWF3YWl0W2RhdGEtdi0xYTVhZWQzNF17Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCk7bWFyZ2luOjA7Zm9udC1zdHlsZTppdGFsaWN9Lnh5LXZlcmRpY3QtZW1wdHlbZGF0YS12LTFhNWFlZDM0XXtjb2xvcjp2YXIoLS14eS10ZXh0LWhpbnQpO3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MTBweCAwO2ZvbnQtc2l6ZToxMXB4O2ZvbnQtc3R5bGU6aXRhbGljfS54eS12aWV3LXRpbWVsaW5lLWJ0bltkYXRhLXYtMWE1YWVkMzRde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO2N1cnNvcjpwb2ludGVyO3RleHQtYWxpZ246Y2VudGVyO2JhY2tncm91bmQ6I2ZmZmZmZjBhO2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjE0O2JvcmRlci1yYWRpdXM6NnB4O3BhZGRpbmc6NnB4IDEycHg7Zm9udC1zaXplOjExcHg7dHJhbnNpdGlvbjphbGwgLjJzfS54eS12aWV3LXRpbWVsaW5lLWJ0bltkYXRhLXYtMWE1YWVkMzRdOmhvdmVye2NvbG9yOnZhcigtLXh5LWN5YW4tMjAwKTtiYWNrZ3JvdW5kOiMzOGJkZjgxYTtib3JkZXItY29sb3I6IzM4YmRmODRkfS54eS1jZW50ZXItZm9vdGVyW2RhdGEtdi0xYTVhZWQzNF17Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCk7YmFja2dyb3VuZDojMDQwOTEyOTk7Ym9yZGVyLXRvcDoxcHggc29saWQgI2ZmZmZmZjBmO2ZsZXgtc2hyaW5rOjA7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7cGFkZGluZzo4cHggMTZweDtmb250LXNpemU6MTBweDtkaXNwbGF5OmZsZXh9Lnh5LWZvb3Rlci1wdWxzZVtkYXRhLXYtMWE1YWVkMzRde2JhY2tncm91bmQ6dmFyKC0teHktY3lhbi00MDApO2JvcmRlci1yYWRpdXM6NTAlO3dpZHRoOjVweDtoZWlnaHQ6NXB4O2FuaW1hdGlvbjoycyBpbmZpbml0ZSB4eS1wdWxzZS1nbG93fUBrZXlmcmFtZXMgdmlldy1pbi0xYTVhZWQzNHswJXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoNHB4KX10b3tvcGFjaXR5OjE7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9fS54eS1za2lsbC1tb2RhbC1iYWNrZHJvcFtkYXRhLXYtOWM2YzAzNmJde3otaW5kZXg6MTAwOy13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTRweCk7Ym94LXNpemluZzpib3JkZXItYm94O2JhY2tncm91bmQ6IzAyMDYwZTczO2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO3BhZGRpbmc6MjRweDtkaXNwbGF5OmZsZXg7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MH0ueHktc2tpbGwtbW9kYWwtY2FyZFtkYXRhLXYtOWM2YzAzNmJde2JvcmRlcjoxcHggc29saWQgdmFyKC0teHktYm9yZGVyLWdsb3cpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDMycHgpO2JveC1zaXppbmc6Ym9yZGVyLWJveDt3aWR0aDoxMDAlO21heC13aWR0aDo2NjBweDthbmltYXRpb246Y2FyZC1zcHJpbmctaW4tOWM2YzAzNmIgLjM1cyB2YXIoLS14eS1lYXNlLW91dC1leHBvKTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxNDVkZWcsIzBlMWMzNGY1IDAlLCMwNjBlMWNmYSAxMDAlKTtib3JkZXItcmFkaXVzOjIwcHg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoxNHB4O3BhZGRpbmc6MjRweCAyOHB4O2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZTtib3gtc2hhZG93OjAgMjhweCA4MHB4ICMwMDAwMDBkOSxpbnNldCAwIDFweCAjZmZmZmZmMjYsMCAwIDQwcHggIzM4YmRmODJlfS54eS1jYXJkLWNvcm5lcltkYXRhLXYtOWM2YzAzNmJde3BvaW50ZXItZXZlbnRzOm5vbmU7d2lkdGg6MTJweDtoZWlnaHQ6MTJweDtwb3NpdGlvbjphYnNvbHV0ZX0ueHktY2FyZC1jb3JuZXIudG9wLWxlZnRbZGF0YS12LTljNmMwMzZiXXtib3JkZXItdG9wOjFweCBzb2xpZCB2YXIoLS14eS1nb2xkLTQwMCk7Ym9yZGVyLWxlZnQ6MXB4IHNvbGlkIHZhcigtLXh5LWdvbGQtNDAwKTtib3JkZXItdG9wLWxlZnQtcmFkaXVzOjE0cHg7dG9wOjZweDtsZWZ0OjZweH0ueHktY2FyZC1jb3JuZXIudG9wLXJpZ2h0W2RhdGEtdi05YzZjMDM2Yl17Ym9yZGVyLXRvcDoxcHggc29saWQgdmFyKC0teHktZ29sZC00MDApO2JvcmRlci1yaWdodDoxcHggc29saWQgdmFyKC0teHktZ29sZC00MDApO2JvcmRlci10b3AtcmlnaHQtcmFkaXVzOjE0cHg7dG9wOjZweDtyaWdodDo2cHh9Lnh5LWNhcmQtY29ybmVyLmJvdHRvbS1sZWZ0W2RhdGEtdi05YzZjMDM2Yl17Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0teHktZ29sZC00MDApO2JvcmRlci1sZWZ0OjFweCBzb2xpZCB2YXIoLS14eS1nb2xkLTQwMCk7Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czoxNHB4O2JvdHRvbTo2cHg7bGVmdDo2cHh9Lnh5LWNhcmQtY29ybmVyLmJvdHRvbS1yaWdodFtkYXRhLXYtOWM2YzAzNmJde2JvcmRlci1ib3R0b206MXB4IHNvbGlkIHZhcigtLXh5LWdvbGQtNDAwKTtib3JkZXItcmlnaHQ6MXB4IHNvbGlkIHZhcigtLXh5LWdvbGQtNDAwKTtib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czoxNHB4O2JvdHRvbTo2cHg7cmlnaHQ6NnB4fS54eS1tb2RhbC1oZWFkZXJbZGF0YS12LTljNmMwMzZiXXtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7ZGlzcGxheTpmbGV4fS54eS1tb2RhbC1jcmVzdFtkYXRhLXYtOWM2YzAzNmJde2ZvbnQtc2l6ZToxMnB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LWdvbGQtMzAwKTtsZXR0ZXItc3BhY2luZzouMDhlbTthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtkaXNwbGF5OmZsZXh9Lnh5LWNyZXN0LWljb25bZGF0YS12LTljNmMwMzZiXXtmb250LXNpemU6MTRweH0ueHktY3Jlc3Qtc2lkZVtkYXRhLXYtOWM2YzAzNmJde2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKTtmb250LXdlaWdodDo1MDB9Lnh5LWNyZXN0LWRvdFtkYXRhLXYtOWM2YzAzNmJde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpfS54eS1jcmVzdC1vcmlnaW5bZGF0YS12LTljNmMwMzZiXXtjb2xvcjp2YXIoLS14eS1jeWFuLTEwMCl9Lnh5LW1vZGFsLWNsb3NlLWJ0bltkYXRhLXYtOWM2YzAzNmJdey13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweCk7d2lkdGg6MzJweDtoZWlnaHQ6MzJweDtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZmZmZjE0IDAlLCNmZmZmZmYwNSAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYyOTtib3JkZXItcmFkaXVzOjk5OXB4O2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2ZvbnQtc2l6ZToxNHB4O3RyYW5zaXRpb246YWxsIC4yNHMgY3ViaWMtYmV6aWVyKC4xNiwxLC4zLDEpO2Rpc3BsYXk6ZmxleDtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCAjZmZmZmZmNDAsMCA0cHggMTBweCAjMDAwMDAwNGR9Lnh5LW1vZGFsLWNsb3NlLWJ0bltkYXRhLXYtOWM2YzAzNmJdOmhvdmVye2NvbG9yOiNmY2E1YTU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmNDNmNWU0MCAwJSwjZTExZDQ4MWEgMTAwJSk7Ym9yZGVyLWNvbG9yOiNmNDNmNWU4MDt0cmFuc2Zvcm06cm90YXRlKDkwZGVnKXNjYWxlKDEuMDUpO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMS41cHggI2ZmZjYsMCA0cHggMTZweCAjZjQzZjVlNTl9Lnh5LW1vZGFsLXRpdGxlLXJvd1tkYXRhLXYtOWM2YzAzNmJde2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtkaXNwbGF5OmZsZXh9Lnh5LW1vZGFsLXRpdGxlW2RhdGEtdi05YzZjMDM2Yl17Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7bGV0dGVyLXNwYWNpbmc6LjA2ZW07YWxpZ24taXRlbXM6YmFzZWxpbmU7bWFyZ2luOjA7Zm9udC1zaXplOjIycHg7Zm9udC13ZWlnaHQ6NjAwO2Rpc3BsYXk6ZmxleH0ueHktdGVjaC1uYW1lLWdsb3dbZGF0YS12LTljNmMwMzZiXXtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZiAwJSwjZTBmMmZlIDUwJSwjMzhiZGY4IDEwMCUpOy13ZWJraXQtdGV4dC1maWxsLWNvbG9yOnRyYW5zcGFyZW50O3RleHQtc2hhZG93OjAgMCAyMHB4ICMzOGJkZjg2Njstd2Via2l0LWJhY2tncm91bmQtY2xpcDp0ZXh0fS54eS1icmFja2V0W2RhdGEtdi05YzZjMDM2Yl17Y29sb3I6dmFyKC0teHktY3lhbi00MDApO29wYWNpdHk6LjZ9Lnh5LW1vZGFsLXN0YXR1cy1iYWRnZVtkYXRhLXYtOWM2YzAzNmJde2ZvbnQtc2l6ZToxMXB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Ym9yZGVyLXJhZGl1czo5OTlweDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtwYWRkaW5nOjNweCAxMHB4O2Rpc3BsYXk6aW5saW5lLWZsZXh9Lnh5LXN0YXR1cy1kb3RbZGF0YS12LTljNmMwMzZiXXtiYWNrZ3JvdW5kOmN1cnJlbnRDb2xvcjtib3JkZXItcmFkaXVzOjUwJTt3aWR0aDo1cHg7aGVpZ2h0OjVweH0udG9uZS1lbWVyYWxkW2RhdGEtdi05YzZjMDM2Yl17Y29sb3I6dmFyKC0teHktamFkZS0zMDApO2JhY2tncm91bmQ6IzJkZDRiZjI0O2JvcmRlcjoxcHggc29saWQgIzJkZDRiZjY2fS50b25lLWFtYmVyW2RhdGEtdi05YzZjMDM2Yl17Y29sb3I6dmFyKC0teHktZ29sZC0zMDApO2JhY2tncm91bmQ6I2ZiYmYyNDI0O2JvcmRlcjoxcHggc29saWQgI2ZiYmYyNDY2fS50b25lLXNsYXRlW2RhdGEtdi05YzZjMDM2Yl17Y29sb3I6I2NiZDVlMTtiYWNrZ3JvdW5kOiM5NGEzYjgyNDtib3JkZXI6MXB4IHNvbGlkICM5NGEzYjg1OX0ueHktbW9kYWwtYW5jaWVudC1xdW90ZVtkYXRhLXYtOWM2YzAzNmJde2JvcmRlci1sZWZ0OjNweCBzb2xpZCB2YXIoLS14eS1nb2xkLTQwMCk7YmFja2dyb3VuZDojZmJiZjI0MGY7Ym9yZGVyLXJhZGl1czowIDhweCA4cHggMDttYXJnaW46MDtwYWRkaW5nOjEwcHggMTZweH0ueHktcXVvdGUtdGV4dFtkYXRhLXYtOWM2YzAzNmJde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LWN5YW4tMTAwKTtsZXR0ZXItc3BhY2luZzouMDRlbTttYXJnaW46MDtmb250LXNpemU6MTNweDtsaW5lLWhlaWdodDoxLjZ9Lnh5LW1vZGFsLWdyaWRbZGF0YS12LTljNmMwMzZiXXtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDIsMWZyKTtnYXA6MTJweDtkaXNwbGF5OmdyaWR9Lnh5LWdyaWQtY2VsbFtkYXRhLXYtOWM2YzAzNmJde2JhY2tncm91bmQ6IzA3MTAxZWIzO2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjEyO2JvcmRlci1yYWRpdXM6MTBweDtwYWRkaW5nOjEwcHggMTRweH0ueHktY2VsbC10aXRsZVtkYXRhLXYtOWM2YzAzNmJde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LWdvbGQtMzAwKTthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjVweDttYXJnaW4tYm90dG9tOjZweDtmb250LXNpemU6MTFweDtkaXNwbGF5OmZsZXh9Lnh5LWNlbGwtaWNvbltkYXRhLXYtOWM2YzAzNmJde2ZvbnQtc2l6ZToxMXB4fS54eS1jZWxsLWxpc3RbZGF0YS12LTljNmMwMzZiXXtjb2xvcjp2YXIoLS14eS10ZXh0LWJvZHkpO21hcmdpbjowO3BhZGRpbmctbGVmdDoxNnB4O2ZvbnQtc2l6ZToxMnB4O2xpbmUtaGVpZ2h0OjEuNn0ueHktY29uZGl0aW9uLW5vdGVbZGF0YS12LTljNmMwMzZiXXttYXJnaW46MDtmb250LXNpemU6MTJweDtsaW5lLWhlaWdodDoxLjV9LmNvbmQtcGFzc1tkYXRhLXYtOWM2YzAzNmJde2NvbG9yOnZhcigtLXh5LWphZGUtMzAwKX0uY29uZC1mYWlsW2RhdGEtdi05YzZjMDM2Yl17Y29sb3I6dmFyKC0teHktZ29sZC0zMDApfS54eS1ydWxlcmVmcy10YWdzW2RhdGEtdi05YzZjMDM2Yl17ZmxleC13cmFwOndyYXA7Z2FwOjZweDtkaXNwbGF5OmZsZXh9Lnh5LXJ1bGUtY2hpcFtkYXRhLXYtOWM2YzAzNmJde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktY3lhbi0yMDApO2JhY2tncm91bmQ6IzM4YmRmODI0O2JvcmRlcjoxcHggc29saWQgIzM4YmRmODU5O2JvcmRlci1yYWRpdXM6NHB4O3BhZGRpbmc6MnB4IDdweDtmb250LXNpemU6MTBweH0ueHktbm8tcnVsZXNbZGF0YS12LTljNmMwMzZiXXtjb2xvcjp2YXIoLS14eS10ZXh0LWhpbnQpO2ZvbnQtc2l6ZToxMXB4O2ZvbnQtc3R5bGU6aXRhbGljfS54eS1tb2RhbC1mb290ZXJbZGF0YS12LTljNmMwMzZiXXtib3JkZXItdG9wOjFweCBzb2xpZCAjZmZmZmZmMTQ7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4O21hcmdpbi10b3A6NHB4O3BhZGRpbmctdG9wOjEycHg7ZGlzcGxheTpmbGV4fS54eS1mb290ZXItaGludFtkYXRhLXYtOWM2YzAzNmJde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO2ZvbnQtc2l6ZToxMHB4fS54eS1mb290ZXItYnRuc1tkYXRhLXYtOWM2YzAzNmJde2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTBweDtkaXNwbGF5OmZsZXh9Lnh5LWZvb3Rlci1kaXNtaXNzLWJ0bltkYXRhLXYtOWM2YzAzNmJdey13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweCk7Y29sb3I6dmFyKC0teHktdGV4dC1ib2R5KTtmb250LXNpemU6MTNweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNhbnMpO2N1cnNvcjpwb2ludGVyO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjZmZmZmZmMTQgMCUsI2ZmZmZmZjA1IDEwMCUpO2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjI2O2JvcmRlci1yYWRpdXM6OTk5cHg7cGFkZGluZzo4cHggMThweDt0cmFuc2l0aW9uOmFsbCAuMjRzIGN1YmljLWJlemllciguMTYsMSwuMywxKTtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCAjZmZmZmZmMzgsMCA0cHggMTJweCAjMDAwMDAwNDB9Lnh5LWZvb3Rlci1kaXNtaXNzLWJ0bltkYXRhLXYtOWM2YzAzNmJdOmhvdmVye2NvbG9yOiNmZmY7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmZmZmZmYyZSAwJSwjZmZmZmZmMGQgMTAwJSk7Ym9yZGVyLWNvbG9yOiNmZmZmZmY0ZDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KTtib3gtc2hhZG93Omluc2V0IDAgMXB4IDEuNXB4ICNmZmZmZmY1OSwwIDZweCAxOHB4ICMwMDAwMDA1OX0ueHktZm9vdGVyLWFwcGx5LWJ0bltkYXRhLXYtOWM2YzAzNmJdey13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweClzYXR1cmF0ZSgxODAlKTtjb2xvcjojZmZmO2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OjUwMDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzBlYTVlOWQ5IDAlLCMwMjg0YzdiZiA1MCUsIzAzNjlhMWQ5IDEwMCUpO2JvcmRlcjoxcHggc29saWQgI2JhZTZmZDczO2JvcmRlci1yYWRpdXM6OTk5cHg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7cGFkZGluZzo4cHggMjJweDt0cmFuc2l0aW9uOmFsbCAuMjRzIGN1YmljLWJlemllciguMTYsMSwuMywxKTtkaXNwbGF5OmlubGluZS1mbGV4O2JveC1zaGFkb3c6aW5zZXQgMCAxLjVweCAycHggI2ZmZmZmZmE2LGluc2V0IDAgLTEuNXB4IDJweCAjMDAwNiwwIDhweCAyNHB4ICMwMjg0Yzc2NiwwIDAgMTZweCAjMzhiZGY4NGR9Lnh5LWZvb3Rlci1hcHBseS1idG5bZGF0YS12LTljNmMwMzZiXTpob3Zlcjpub3QoOmRpc2FibGVkKXtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzM4YmRmOGYyIDAlLCMwZWE1ZTlkOSA1MCUsIzAyODRjN2U2IDEwMCUpO2JvcmRlci1jb2xvcjojYmFlNmZkO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0ycHgpO2JveC1zaGFkb3c6aW5zZXQgMCAycHggM3B4ICNmZmZjLDAgMTJweCAzMnB4ICMzOGJkZjg4YywwIDAgMjRweCAjMzhiZGY4NjZ9Lnh5LWZvb3Rlci1hcHBseS1idG5bZGF0YS12LTljNmMwMzZiXTpkaXNhYmxlZCwueHktZm9vdGVyLWFwcGx5LWJ0bi5pcy1sb2NrZWRbZGF0YS12LTljNmMwMzZiXXtjdXJzb3I6bm90LWFsbG93ZWQ7b3BhY2l0eTouNDU7Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCk7Ym94LXNoYWRvdzpub25lO2JhY2tncm91bmQ6I2ZmZmZmZjBhO2JvcmRlci1jb2xvcjojZmZmZmZmMWY7dHJhbnNmb3JtOm5vbmUhaW1wb3J0YW50fS54eS1idG4tbG9ja1tkYXRhLXYtOWM2YzAzNmJde21hcmdpbi1yaWdodDo0cHg7Zm9udC1zaXplOjEzcHh9Lnh5LWJ0bi1hcnJvd1tkYXRhLXYtOWM2YzAzNmJde2ZvbnQtc2l6ZToxNHB4fS54eS1tb2RhbC1wb3AtZW50ZXItYWN0aXZlW2RhdGEtdi05YzZjMDM2Yl0sLnh5LW1vZGFsLXBvcC1sZWF2ZS1hY3RpdmVbZGF0YS12LTljNmMwMzZiXXt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzIHZhcigtLXh5LWVhc2Utc21vb3RoKX0ueHktbW9kYWwtcG9wLWVudGVyLWFjdGl2ZSAueHktc2tpbGwtbW9kYWwtY2FyZFtkYXRhLXYtOWM2YzAzNmJdLC54eS1tb2RhbC1wb3AtbGVhdmUtYWN0aXZlIC54eS1za2lsbC1tb2RhbC1jYXJkW2RhdGEtdi05YzZjMDM2Yl17dHJhbnNpdGlvbjp0cmFuc2Zvcm0gLjM1cyB2YXIoLS14eS1lYXNlLW91dC1leHBvKSwgb3BhY2l0eSAuM3MgdmFyKC0teHktZWFzZS1zbW9vdGgpfS54eS1tb2RhbC1wb3AtZW50ZXItZnJvbVtkYXRhLXYtOWM2YzAzNmJdLC54eS1tb2RhbC1wb3AtbGVhdmUtdG9bZGF0YS12LTljNmMwMzZiXXtvcGFjaXR5OjB9Lnh5LW1vZGFsLXBvcC1lbnRlci1mcm9tIC54eS1za2lsbC1tb2RhbC1jYXJkW2RhdGEtdi05YzZjMDM2Yl0sLnh5LW1vZGFsLXBvcC1sZWF2ZS10byAueHktc2tpbGwtbW9kYWwtY2FyZFtkYXRhLXYtOWM2YzAzNmJde29wYWNpdHk6MDt0cmFuc2Zvcm06c2NhbGUoLjkyKXRyYW5zbGF0ZVkoMTJweCl9QGtleWZyYW1lcyBjYXJkLXNwcmluZy1pbi05YzZjMDM2YnswJXtvcGFjaXR5OjA7dHJhbnNmb3JtOnNjYWxlKC45Mil0cmFuc2xhdGVZKDEycHgpfXRve29wYWNpdHk6MTt0cmFuc2Zvcm06c2NhbGUoMSl0cmFuc2xhdGVZKDApfX0ueHktYWN0aW9uLWRvY2tbZGF0YS12LTFlYjNkYzY1XXt6LWluZGV4OjIwO2JvcmRlci10b3A6MXB4IHNvbGlkIHZhcigtLXh5LWJvcmRlci1zdWJ0bGUpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDI0cHgpO3VzZXItc2VsZWN0Om5vbmU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoIzA4MTIyMGYyIDAlLCMwNDA5MTJmYyAxMDAlKTtmbGV4LXNocmluazowO3BhZGRpbmc6MTBweCAzMnB4IDE0cHg7cG9zaXRpb246c3RpY2t5O2JvdHRvbTowO2JveC1zaGFkb3c6MCAtOHB4IDMwcHggIzAwMDl9Lnh5LWFjdGlvbi10b3BiYXJbZGF0YS12LTFlYjNkYzY1XXtqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1lbmQ7YWxpZ24taXRlbXM6Y2VudGVyO21heC13aWR0aDoxODQwcHg7bWFyZ2luLWJvdHRvbToxMHB4O21hcmdpbi1sZWZ0OmF1dG87bWFyZ2luLXJpZ2h0OmF1dG87ZGlzcGxheTpmbGV4fS54eS1hY3Rpb24tY29udHJvbHNbZGF0YS12LTFlYjNkYzY1XXthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtkaXNwbGF5OmZsZXh9Lnh5LWN0cmwtYnRuW2RhdGEtdi0xZWIzZGM2NV17LXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6Ymx1cigxNnB4KXNhdHVyYXRlKDE2MCUpO2NvbG9yOnZhcigtLXh5LXRleHQtYm9keSk7Zm9udC1zaXplOjEycHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zYW5zKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZmZmZjE0IDAlLCNmZmZmZmYwNSAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYyOTtib3JkZXItcmFkaXVzOjk5OXB4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O3BhZGRpbmc6NnB4IDE0cHg7dHJhbnNpdGlvbjphbGwgLjI0cyBjdWJpYy1iZXppZXIoLjE2LDEsLjMsMSk7ZGlzcGxheTppbmxpbmUtZmxleDtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCAjZmZmZmZmNDAsaW5zZXQgMCAtMXB4IDFweCAjMDAwMDAwNTksMCA0cHggMTRweCAjMDAwMDAwNGR9Lnh5LWN0cmwtYnRuW2RhdGEtdi0xZWIzZGM2NV06aG92ZXI6bm90KDpkaXNhYmxlZCl7Y29sb3I6I2ZmZjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZmZmZjJlIDAlLCNmZmZmZmYwZCAxMDAlKTtib3JkZXItY29sb3I6I2ZmZmZmZjUyO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xcHgpO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMS41cHggI2ZmZjYsMCA2cHggMjBweCAjMDAwNn0ueHktY3RybC1idG5bZGF0YS12LTFlYjNkYzY1XTpkaXNhYmxlZHtvcGFjaXR5Oi4zNTtjdXJzb3I6bm90LWFsbG93ZWQ7dHJhbnNmb3JtOm5vbmV9LmJ0bi1zdGFydFtkYXRhLXYtMWViM2RjNjVde2NvbG9yOiM3ZGQzZmM7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMzOGJkZjgyZSAwJSwjMGVhNWU5MGQgMTAwJSk7Ym9yZGVyLWNvbG9yOiMzOGJkZjg2Njtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCAjZmZmZmZmNTksMCA0cHggMTZweCAjMzhiZGY4MzN9LmJ0bi1zdGFydFtkYXRhLXYtMWViM2RjNjVdOmhvdmVyOm5vdCg6ZGlzYWJsZWQpe2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMzhiZGY4NGQgMCUsIzBlYTVlOTFmIDEwMCUpO2JvcmRlci1jb2xvcjojMzhiZGY4O2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMS41cHggI2ZmZmZmZjgwLDAgNnB4IDIycHggIzM4YmRmODU5fS5idG4tbmV4dFtkYXRhLXYtMWViM2RjNjVde2NvbG9yOiNmZGU2OGE7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmYmJmMjQyZSAwJSwjZjU5ZTBiMGQgMTAwJSk7Ym9yZGVyLWNvbG9yOiNmYmJmMjQ2Njtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCAjZmZmZmZmNTksMCA0cHggMTZweCAjZmJiZjI0MzN9LmJ0bi1uZXh0W2RhdGEtdi0xZWIzZGM2NV06aG92ZXI6bm90KDpkaXNhYmxlZCl7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmYmJmMjQ0ZCAwJSwjZjU5ZTBiMWYgMTAwJSk7Ym9yZGVyLWNvbG9yOiNmYmJmMjQ7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxLjVweCAjZmZmZmZmODAsMCA2cHggMjJweCAjZmJiZjI0NTl9LmJ0bi1zdG9wW2RhdGEtdi0xZWIzZGM2NV17Y29sb3I6I2ZjYTVhNTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2Y0M2Y1ZTJlIDAlLCNlMTFkNDgwZCAxMDAlKTtib3JkZXItY29sb3I6I2Y0M2Y1ZTU5fS5idG4tc3RvcFtkYXRhLXYtMWViM2RjNjVdOmhvdmVyOm5vdCg6ZGlzYWJsZWQpe2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjZjQzZjVlNDcgMCUsI2UxMWQ0ODFmIDEwMCUpO2JvcmRlci1jb2xvcjojZjQzZjVlO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMS41cHggI2ZmZmZmZjczLDAgNnB4IDIycHggI2Y0M2Y1ZTRkfS54eS1hY3Rpb24tY29uc29sZVtkYXRhLXYtMWViM2RjNjVde2dyaWQtdGVtcGxhdGUtY29sdW1uczoyMTBweCAxZnIgMTQwcHg7YWxpZ24taXRlbXM6c3RyZXRjaDtnYXA6MTJweDttYXgtd2lkdGg6MTg0MHB4O21hcmdpbi1sZWZ0OmF1dG87bWFyZ2luLXJpZ2h0OmF1dG87ZGlzcGxheTpncmlkfS54eS10ZWNobmlxdWUtc2VsZWN0b3JbZGF0YS12LTFlYjNkYzY1XXstd2Via2l0LWJhY2tkcm9wLWZpbHRlcjpibHVyKDIwcHgpc2F0dXJhdGUoMTYwJSk7dHJhbnNpdGlvbjphbGwgLjI1cyB2YXIoLS14eS1lYXNlLXNtb290aCk7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMxMDI0NDA4YyAwJSwjMDgxNDI2YTYgMTAwJSk7Ym9yZGVyOjFweCBzb2xpZCAjMzhiZGY4Mzg7Ym9yZGVyLXJhZGl1czoxNHB4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2dhcDo0cHg7cGFkZGluZzo4cHggMTRweDtkaXNwbGF5OmZsZXg7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxLjVweCAjZmZmMyxpbnNldCAwIC0xcHggMnB4ICMwMDAwMDA1OSwwIDhweCAyNHB4ICMwMDAwMDA0ZH0ueHktdGVjaG5pcXVlLXNlbGVjdG9yW2RhdGEtdi0xZWIzZGM2NV06aG92ZXJ7Ym9yZGVyLWNvbG9yOiMzOGJkZjg2Njtib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCAjZmZmZmZmNGQsMCA4cHggMjhweCAjMDAwMDAwNTl9Lnh5LXRlY2gtcGlja2VyLWxhYmVsW2RhdGEtdi0xZWIzZGM2NV17ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo0cHg7ZGlzcGxheTpmbGV4fS54eS1waWNrZXIta2lja2VyW2RhdGEtdi0xZWIzZGM2NV17Zm9udC1zaXplOjEwcHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y29sb3I6dmFyKC0teHktY3lhbi0zMDApO2xldHRlci1zcGFjaW5nOi4xZW19Lnh5LXRlY2gtc2VsZWN0W2RhdGEtdi0xZWIzZGM2NV17Y29sb3I6dmFyKC0teHktdGV4dC10aXRsZSk7Zm9udC1zaXplOjEzcHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y3Vyc29yOnBvaW50ZXI7YmFja2dyb3VuZDowIDA7Ym9yZGVyOjA7b3V0bGluZTpub25lO3BhZGRpbmc6NHB4IDB9Lnh5LXRlY2gtc2VsZWN0IG9wdGlvbltkYXRhLXYtMWViM2RjNjVde2NvbG9yOiNlMmU4ZjA7YmFja2dyb3VuZDojMGIxNzI4fS54eS1jbGVhci10ZWNoLWJ0bltkYXRhLXYtMWViM2RjNjVde2NvbG9yOnZhcigtLXh5LWdvbGQtNDAwKTtjdXJzb3I6cG9pbnRlcjt0ZXh0LWFsaWduOmxlZnQ7YmFja2dyb3VuZDowIDA7Ym9yZGVyOjA7cGFkZGluZzowO2ZvbnQtc2l6ZToxMHB4O3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9Lnh5LWlucHV0LWJveC13cmFwcGVyW2RhdGEtdi0xZWIzZGM2NV17ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlfS54eS1hY3Rpb24tdGV4dGFyZWFbZGF0YS12LTFlYjNkYzY1XXstd2Via2l0LWJhY2tkcm9wLWZpbHRlcjpibHVyKDIwcHgpc2F0dXJhdGUoMTYwJSk7d2lkdGg6MTAwJTttaW4taGVpZ2h0OjY0cHg7Y29sb3I6dmFyKC0teHktdGV4dC10aXRsZSk7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zYW5zKTtyZXNpemU6dmVydGljYWw7dHJhbnNpdGlvbjphbGwgLjI1cyB2YXIoLS14eS1lYXNlLXNtb290aCk7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMwYTE4MmU4YyAwJSwjMDYwZjFlYWQgMTAwJSk7Ym9yZGVyOjFweCBzb2xpZCAjMzhiZGY4MzM7Ym9yZGVyLXJhZGl1czoxNHB4O291dGxpbmU6bm9uZTtwYWRkaW5nOjEycHggMTZweDtmb250LXNpemU6MTNweDtsaW5lLWhlaWdodDoxLjY7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxLjVweCAjZmZmZmZmMjksaW5zZXQgMCAtMXB4IDJweCAjMDAwMDAwNTksMCA4cHggMjRweCAjMDAwMDAwNDB9Lnh5LWFjdGlvbi10ZXh0YXJlYVtkYXRhLXYtMWViM2RjNjVdOmZvY3Vze2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMGUyMDNhYjggMCUsIzA4MTQyNmNjIDEwMCUpO2JvcmRlci1jb2xvcjojMzhiZGY4OGM7Ym94LXNoYWRvdzppbnNldCAwIDFweCAycHggI2ZmZmZmZjQ3LDAgMCAyNHB4ICMzOGJkZjg0ZCwwIDhweCAzMHB4ICMwMDA2fS54eS1zdWJtaXQtYnRuW2RhdGEtdi0xZWIzZGM2NV17LXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6Ymx1cigxNnB4KXNhdHVyYXRlKDE4MCUpO2NvbG9yOiNmZmY7Y3Vyc29yOnBvaW50ZXI7dHJhbnNpdGlvbjphbGwgLjI1cyB2YXIoLS14eS1lYXNlLW91dC1leHBvKTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzBlYTVlOWQ5IDAlLCMwMjg0YzdiZiA1MCUsIzAzNjlhMWQ5IDEwMCUpO2JvcmRlcjoxcHggc29saWQgI2JhZTZmZDczO2JvcmRlci1yYWRpdXM6MTRweDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtkaXNwbGF5OmZsZXg7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVuO2JveC1zaGFkb3c6aW5zZXQgMCAxLjVweCAycHggI2ZmZmZmZmE2LGluc2V0IDAgLTEuNXB4IDJweCAjMDAwMDAwNzMsMCA4cHggMjhweCAjMDI4NGM3NzMsMCAwIDIwcHggIzM4YmRmODU5fS54eS1zdWJtaXQtYnRuW2RhdGEtdi0xZWIzZGM2NV06aG92ZXI6bm90KDpkaXNhYmxlZCl7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMzOGJkZjhmMiAwJSwjMGVhNWU5ZDkgNTAlLCMwMjg0YzdlNiAxMDAlKTtib3JkZXItY29sb3I6I2JhZTZmZDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMnB4KTtib3gtc2hhZG93Omluc2V0IDAgMnB4IDNweCAjZmZmYywwIDEycHggMzZweCAjMzhiZGY4OTksMCAwIDI4cHggIzM4YmRmODgwfS54eS1zdWJtaXQtYnRuW2RhdGEtdi0xZWIzZGM2NV06ZGlzYWJsZWR7b3BhY2l0eTouNDtjdXJzb3I6bm90LWFsbG93ZWQ7Ym94LXNoYWRvdzpub25lO2JhY2tncm91bmQ6I2ZmZmZmZjBkO2JvcmRlci1jb2xvcjojZmZmZmZmMWF9Lnh5LXN1Ym1pdC1jb250ZW50W2RhdGEtdi0xZWIzZGM2NV17ei1pbmRleDoyO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjVweDtkaXNwbGF5OmZsZXg7cG9zaXRpb246cmVsYXRpdmV9Lnh5LXN1Ym1pdC1pY29uW2RhdGEtdi0xZWIzZGM2NV17Zm9udC1zaXplOjE2cHh9Lnh5LXN1Ym1pdC10ZXh0W2RhdGEtdi0xZWIzZGM2NV17Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7bGV0dGVyLXNwYWNpbmc6LjFlbTtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo2MDB9Lnh5LXN1Ym1pdC1idG4uaXMtbG9hZGluZyAueHktc3VibWl0LWljb25bZGF0YS12LTFlYjNkYzY1XXthbmltYXRpb246MXMgaW5maW5pdGUgeHktcHVsc2UtZ2xvd30ueHktdGltZWxpbmUtZHJhd2VyLWJhY2tkcm9wW2RhdGEtdi1mMGEwODE2ZV17YmFja2Ryb3AtZmlsdGVyOmJsdXIoOHB4KTt6LWluZGV4OjUwO2JhY2tncm91bmQ6IzAzMDcwZDgwO2p1c3RpZnktY29udGVudDpmbGV4LWVuZDtkaXNwbGF5OmZsZXg7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MH0ueHktdGltZWxpbmUtZHJhd2VyLXBhbmVsW2RhdGEtdi1mMGEwODE2ZV17Ym9yZGVyLWxlZnQ6MXB4IHNvbGlkIHZhcigtLXh5LWJvcmRlci1nbG93KTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgjMGExNjI2ZmEgMCUsIzA2MGUxYWZjIDEwMCUpO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjt3aWR0aDo0NDBweDttYXgtd2lkdGg6OTB2dztoZWlnaHQ6MTAwJTtkaXNwbGF5OmZsZXg7Ym94LXNoYWRvdzotMTZweCAwIDUwcHggIzAwMDAwMGIzfS54eS1kcmF3ZXItaGVhZGVyW2RhdGEtdi1mMGEwODE2ZV17YmFja2dyb3VuZDojMDgxMjIwZTY7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2ZmZmZmZjE0O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtwYWRkaW5nOjE2cHggMjBweDtkaXNwbGF5OmZsZXh9Lnh5LWRyYXdlci10aXRsZVtkYXRhLXYtZjBhMDgxNmVde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LWN5YW4tMjAwKTthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo1MDA7ZGlzcGxheTpmbGV4fS54eS1kLWljb25bZGF0YS12LWYwYTA4MTZlXXtmb250LXNpemU6MTVweH0ueHktY291bnQtYmFkZ2VbZGF0YS12LWYwYTA4MTZlXXtmb250LXNpemU6MTBweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKTtiYWNrZ3JvdW5kOiMzOGJkZjgyNjtib3JkZXI6MXB4IHNvbGlkICMzOGJkZjg0ZDtib3JkZXItcmFkaXVzOjk5OXB4O3BhZGRpbmc6MXB4IDdweH0ueHktY2xvc2UtZHJhd2VyLWJ0bltkYXRhLXYtZjBhMDgxNmVdey13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTJweCk7d2lkdGg6MjhweDtoZWlnaHQ6MjhweDtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZmZmZjE0IDAlLCNmZmZmZmYwNSAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYyNDtib3JkZXItcmFkaXVzOjk5OXB4O2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2ZvbnQtc2l6ZToxM3B4O3RyYW5zaXRpb246YWxsIC4yNHMgY3ViaWMtYmV6aWVyKC4xNiwxLC4zLDEpO2Rpc3BsYXk6ZmxleDtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCAjZmZmMywwIDJweCA4cHggIzAwMDAwMDQwfS54eS1jbG9zZS1kcmF3ZXItYnRuW2RhdGEtdi1mMGEwODE2ZV06aG92ZXJ7Y29sb3I6I2ZjYTVhNTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2Y0M2Y1ZTQwIDAlLCNlMTFkNDgxYSAxMDAlKTtib3JkZXItY29sb3I6I2Y0M2Y1ZTgwO3RyYW5zZm9ybTpyb3RhdGUoOTBkZWcpc2NhbGUoMS4wNSk7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxLjVweCAjZmZmNiwwIDRweCAxNHB4ICNmNDNmNWU0ZH0ueHktZHJhd2VyLWJvZHlbZGF0YS12LWYwYTA4MTZlXXtmbGV4LWRpcmVjdGlvbjpjb2x1bW47ZmxleDoxO2dhcDoxNnB4O3BhZGRpbmc6MTZweCAyMHB4IDI0cHg7ZGlzcGxheTpmbGV4O292ZXJmbG93LXk6YXV0b30ueHktdGltZWxpbmUtc3RyZWFtW2RhdGEtdi1mMGEwODE2ZV17ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoxMnB4O2Rpc3BsYXk6ZmxleH0ueHktdGltZWxpbmUtY2FyZFtkYXRhLXYtZjBhMDgxNmVde2JhY2tncm91bmQ6IzBlMWMzMGQ5O2JvcmRlcjoxcHggc29saWQgIzM4YmRmODI2O2JvcmRlci1yYWRpdXM6OHB4O3BhZGRpbmc6MTJweCAxNHB4O2JveC1zaGFkb3c6MCA0cHggMTRweCAjMDAwMDAwNGR9Lnh5LXQtaGVhZFtkYXRhLXYtZjBhMDgxNmVde2ZvbnQtc2l6ZToxMHB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7bWFyZ2luLWJvdHRvbTo2cHg7ZGlzcGxheTpmbGV4fS54eS10LXJvdW5kW2RhdGEtdi1mMGEwODE2ZV17Y29sb3I6dmFyKC0teHktZ29sZC00MDApO2ZvbnQtd2VpZ2h0OjYwMH0ueHktdC1zdGF0dXNbZGF0YS12LWYwYTA4MTZlXXtib3JkZXItcmFkaXVzOjNweDtwYWRkaW5nOjFweCA2cHh9LnN0LWNvbXBsZXRlW2RhdGEtdi1mMGEwODE2ZV17Y29sb3I6dmFyKC0teHktamFkZS0zMDApO2JhY2tncm91bmQ6IzJkZDRiZjI2fS5zdC1jb21taXR0ZWRbZGF0YS12LWYwYTA4MTZlXXtjb2xvcjp2YXIoLS14eS1jeWFuLTMwMCk7YmFja2dyb3VuZDojMzhiZGY4MjZ9LnN0LWludGVycnVwdGVkW2RhdGEtdi1mMGEwODE2ZV17Y29sb3I6dmFyKC0teHktY3JpbXNvbi00MDApO2JhY2tncm91bmQ6I2Y0M2Y1ZTI2fS54eS10LWFjdGlvbi1pZFtkYXRhLXYtZjBhMDgxNmVde2NvbG9yOnZhcigtLXh5LXRleHQtaGludCk7bWFyZ2luLWxlZnQ6YXV0b30ueHktdC1sYWJlbFtkYXRhLXYtZjBhMDgxNmVde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LXRleHQtdGl0bGUpO21hcmdpbjowIDAgNnB4O2ZvbnQtc2l6ZToxM3B4fS54eS10LW91dGNvbWVbZGF0YS12LWYwYTA4MTZlXSwueHktdC1uYXJyYXRpdmVbZGF0YS12LWYwYTA4MTZlXXtjb2xvcjp2YXIoLS14eS10ZXh0LWJvZHkpO2ZvbnQtc2l6ZToxMnB4O2xpbmUtaGVpZ2h0OjEuNn0ueHktdC1vdXRjb21lIGJbZGF0YS12LWYwYTA4MTZlXSwueHktdC1uYXJyYXRpdmUgYltkYXRhLXYtZjBhMDgxNmVde2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKTtmb250LXdlaWdodDo1MDB9Lnh5LXQtbmFycmF0aXZlIHBbZGF0YS12LWYwYTA4MTZlXXtjb2xvcjojZTJlOGYwO21hcmdpbjo0cHggMCAwfS54eS10LW5hcnJhdGl2ZS1lbXB0eVtkYXRhLXYtZjBhMDgxNmVde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO21hcmdpbi10b3A6NHB4O2ZvbnQtc2l6ZToxMXB4O2ZvbnQtc3R5bGU6aXRhbGljfS54eS10aW1lbGluZS1lbXB0eVtkYXRhLXYtZjBhMDgxNmVde3RleHQtYWxpZ246Y2VudGVyO2NvbG9yOnZhcigtLXh5LXRleHQtaGludCk7cGFkZGluZzozMHB4IDA7Zm9udC1zaXplOjEycHh9Lnh5LXB1YmxpYy1ldmVudHMtc2VjdGlvbltkYXRhLXYtZjBhMDgxNmVde2JvcmRlci10b3A6MXB4IGRhc2hlZCAjZmZmZmZmMTQ7cGFkZGluZy10b3A6MTRweH0ueHktcGUtdGl0bGVbZGF0YS12LWYwYTA4MTZlXXtmb250LXNpemU6MTFweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCk7bWFyZ2luOjAgMCA4cHh9Lnh5LXBlLWxpc3RbZGF0YS12LWYwYTA4MTZlXXtjb2xvcjp2YXIoLS14eS10ZXh0LWJvZHkpO21hcmdpbjowO3BhZGRpbmctbGVmdDoxNnB4O2ZvbnQtc2l6ZToxMXB4O2xpbmUtaGVpZ2h0OjEuN30ueHktZHJhd2VyLXNsaWRlLWVudGVyLWFjdGl2ZVtkYXRhLXYtZjBhMDgxNmVdLC54eS1kcmF3ZXItc2xpZGUtbGVhdmUtYWN0aXZlW2RhdGEtdi1mMGEwODE2ZV17dHJhbnNpdGlvbjpvcGFjaXR5IC4yNXMgdmFyKC0teHktZWFzZS1zbW9vdGgpfS54eS1kcmF3ZXItc2xpZGUtZW50ZXItZnJvbVtkYXRhLXYtZjBhMDgxNmVdLC54eS1kcmF3ZXItc2xpZGUtbGVhdmUtdG9bZGF0YS12LWYwYTA4MTZlXXtvcGFjaXR5OjB9Lnh5LWRyYXdlci1zbGlkZS1lbnRlci1hY3RpdmUgLnh5LXRpbWVsaW5lLWRyYXdlci1wYW5lbFtkYXRhLXYtZjBhMDgxNmVde3RyYW5zaXRpb246dHJhbnNmb3JtIC4zcyB2YXIoLS14eS1lYXNlLW91dC1leHBvKX0ueHktZHJhd2VyLXNsaWRlLWxlYXZlLWFjdGl2ZSAueHktdGltZWxpbmUtZHJhd2VyLXBhbmVsW2RhdGEtdi1mMGEwODE2ZV17dHJhbnNpdGlvbjp0cmFuc2Zvcm0gLjI1cyB2YXIoLS14eS1lYXNlLXNtb290aCl9Lnh5LWRyYXdlci1zbGlkZS1lbnRlci1mcm9tIC54eS10aW1lbGluZS1kcmF3ZXItcGFuZWxbZGF0YS12LWYwYTA4MTZlXSwueHktZHJhd2VyLXNsaWRlLWxlYXZlLXRvIC54eS10aW1lbGluZS1kcmF3ZXItcGFuZWxbZGF0YS12LWYwYTA4MTZlXXt0cmFuc2Zvcm06dHJhbnNsYXRlKDEwMCUpfS54eS1iYXR0bGUtc3RhZ2VbZGF0YS12LTgzYWVhNjY3XXtiYWNrZ3JvdW5kOnZhcigtLXh5LWJnLWFieXNzKTtmbGV4LWRpcmVjdGlvbjpjb2x1bW47anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTttaW4taGVpZ2h0OjA7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbn0ueHktc3RhZ2UtYXJlbmFbZGF0YS12LTgzYWVhNjY3XXt6LWluZGV4OjI7Ym94LXNpemluZzpib3JkZXItYm94O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtmbGV4OjE7d2lkdGg6MTAwJTttYXgtd2lkdGg6MTkyMHB4O21pbi1oZWlnaHQ6MDttYXJnaW46MCBhdXRvO3BhZGRpbmc6MTRweCAyNHB4O2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZX0ueHktYXJlbmEtY29sdW1uc1tkYXRhLXYtODNhZWE2Njdde2dyaWQtdGVtcGxhdGUtY29sdW1uczptaW5tYXgoMzgwcHgsMS4yZnIpIG1pbm1heCgzMjBweCwzODBweCkgbWlubWF4KDM4MHB4LDEuMmZyKTthbGlnbi1pdGVtczpzdHJldGNoO2dhcDoyNHB4O2hlaWdodDoxMDAlO21pbi1oZWlnaHQ6MDtkaXNwbGF5OmdyaWR9Lnh5LXNldHRpbmdzLXBhbmVsW2RhdGEtdi1mNTY0NjA1MF17ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoyMHB4O21heC13aWR0aDoxMTAwcHg7bWFyZ2luOjAgYXV0bztwYWRkaW5nOjI0cHggMjhweCA0MHB4O2Rpc3BsYXk6ZmxleH0ueHktcGFuZWwtaGVhZGVyW2RhdGEtdi1mNTY0NjA1MF17Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0teHktYm9yZGVyLXN1YnRsZSk7cGFkZGluZy1ib3R0b206MTRweH0ueHktcGFuZWwta2lja2VyW2RhdGEtdi1mNTY0NjA1MF17bGV0dGVyLXNwYWNpbmc6LjE4ZW07Zm9udC1zaXplOjEwcHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtjb2xvcjp2YXIoLS14eS1jeWFuLTQwMCl9Lnh5LXBhbmVsLXRpdGxlW2RhdGEtdi1mNTY0NjA1MF17Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y29sb3I6dmFyKC0teHktdGV4dC10aXRsZSk7bGV0dGVyLXNwYWNpbmc6LjA0ZW07bWFyZ2luOjRweCAwIDZweDtmb250LXNpemU6MjRweDtmb250LXdlaWdodDo1MDB9Lnh5LXBhbmVsLWRlc2NbZGF0YS12LWY1NjQ2MDUwXXtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTttYXJnaW46MDtmb250LXNpemU6MTJweDtsaW5lLWhlaWdodDoxLjZ9Lnh5LWNvbmZpZy1jYXJkW2RhdGEtdi1mNTY0NjA1MF17Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS14eS1ib3JkZXItc3VidGxlKTtiYWNrZHJvcC1maWx0ZXI6Ymx1cigxNnB4KTtiYWNrZ3JvdW5kOiMwYzFhMmViZjtib3JkZXItcmFkaXVzOjEycHg7bWFyZ2luOjA7cGFkZGluZzoxOHB4IDIycHh9Lnh5LWNhcmQtbGVnZW5kW2RhdGEtdi1mNTY0NjA1MF0sLnh5LWNhcmQtdGl0bGVbZGF0YS12LWY1NjQ2MDUwXXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCk7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7cGFkZGluZzowIDZweDtmb250LXNpemU6MTVweDtmb250LXdlaWdodDo1MDA7ZGlzcGxheTpmbGV4fS54eS1sZWdlbmQtaWNvbltkYXRhLXYtZjU2NDYwNTBde2ZvbnQtc2l6ZToxNHB4fS54eS1mb3JtLWdyaWRbZGF0YS12LWY1NjQ2MDUwXXtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDQsMWZyKTtnYXA6MTRweDttYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpncmlkfS54eS1jb2wtc3Bhbi0yW2RhdGEtdi1mNTY0NjA1MF17Z3JpZC1jb2x1bW46c3BhbiAyfS54eS1mb3JtLWZpZWxkW2RhdGEtdi1mNTY0NjA1MF17ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo2cHg7ZGlzcGxheTpmbGV4fS54eS1maWVsZC1sYWJlbFtkYXRhLXYtZjU2NDYwNTBde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO2ZvbnQtc2l6ZToxMXB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2Fucyk7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2Rpc3BsYXk6ZmxleH0ueHktZmllbGQtaGludFtkYXRhLXYtZjU2NDYwNTBde2NvbG9yOnZhcigtLXh5LWdvbGQtNDAwKTtmb250LXNpemU6OXB4fS54eS1pbnB1dC10ZXh0W2RhdGEtdi1mNTY0NjA1MF0sLnh5LWlucHV0LXNlbGVjdFtkYXRhLXYtZjU2NDYwNTBdLC54eS1pbnB1dC10ZXh0YXJlYVtkYXRhLXYtZjU2NDYwNTBdey13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweCk7Y29sb3I6dmFyKC0teHktdGV4dC10aXRsZSk7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zYW5zKTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzA4MTIyNDk5IDAlLCMwNDBhMTZiZiAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICMzOGJkZjgzMztib3JkZXItcmFkaXVzOjEwcHg7b3V0bGluZTpub25lO3BhZGRpbmc6OHB4IDEycHg7Zm9udC1zaXplOjEzcHg7dHJhbnNpdGlvbjphbGwgLjI0cyBjdWJpYy1iZXppZXIoLjE2LDEsLjMsMSk7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxcHggI2ZmZmZmZjI2LGluc2V0IDAgLTFweCAxcHggIzAwMDAwMDRkfS54eS1pbnB1dC10ZXh0W2RhdGEtdi1mNTY0NjA1MF06Zm9jdXMsLnh5LWlucHV0LXNlbGVjdFtkYXRhLXYtZjU2NDYwNTBdOmZvY3VzLC54eS1pbnB1dC10ZXh0YXJlYVtkYXRhLXYtZjU2NDYwNTBdOmZvY3Vze2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMGMxYTMwYmYgMCUsIzA2MTAyMGQ5IDEwMCUpO2JvcmRlci1jb2xvcjojMzhiZGY4OGM7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxLjVweCAjZmZmZmZmNDAsMCAwIDE2cHggIzM4YmRmODQwfS54eS1wYXNzd29yZC13cmFwW2RhdGEtdi1mNTY0NjA1MF17ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlfS54eS1wYXNzd29yZC13cmFwIGlucHV0W2RhdGEtdi1mNTY0NjA1MF17d2lkdGg6MTAwJTtwYWRkaW5nLXJpZ2h0OjM2cHh9Lnh5LXB3ZC10b2dnbGVbZGF0YS12LWY1NjQ2MDUwXXtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOjAgMDtib3JkZXI6MDtwYWRkaW5nOjRweDtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO3JpZ2h0OjZweDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKX0ueHktcHdkLXRvZ2dsZVtkYXRhLXYtZjU2NDYwNTBdOmhvdmVye2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKX0ueHktdG9nZ2xlLXJvd1tkYXRhLXYtZjU2NDYwNTBde2FsaWduLWl0ZW1zOmNlbnRlcjttYXJnaW4tdG9wOjEwcHg7ZGlzcGxheTpmbGV4fS54eS1jaGVja2JveC1sYWJlbFtkYXRhLXYtZjU2NDYwNTBde2NvbG9yOnZhcigtLXh5LXRleHQtYm9keSk7Y3Vyc29yOnBvaW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7Zm9udC1zaXplOjEzcHg7ZGlzcGxheTppbmxpbmUtZmxleH0ueHktY2hlY2tib3hbZGF0YS12LWY1NjQ2MDUwXXt3aWR0aDoxNnB4O2hlaWdodDoxNnB4O2FjY2VudC1jb2xvcjp2YXIoLS14eS1jeWFuLTUwMCl9Lnh5LW10LTNbZGF0YS12LWY1NjQ2MDUwXXttYXJnaW4tdG9wOjEycHh9Lnh5LXNldHRpbmdzLWZvb3RlcltkYXRhLXYtZjU2NDYwNTBde2dhcDoxMnB4O21hcmdpbi10b3A6MTBweDtkaXNwbGF5OmZsZXh9Lnh5LXNhdmUtYnRuW2RhdGEtdi1mNTY0NjA1MF17LXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6Ymx1cigxNnB4KXNhdHVyYXRlKDE4MCUpO2NvbG9yOiNmZmY7Zm9udC1zaXplOjE0cHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7bGV0dGVyLXNwYWNpbmc6LjA1ZW07Y3Vyc29yOnBvaW50ZXI7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMwZWE1ZTlkOSAwJSwjMDI4NGM3YmYgNTAlLCMwMzY5YTFkOSAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICNiYWU2ZmQ3Mztib3JkZXItcmFkaXVzOjk5OXB4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O3BhZGRpbmc6MTBweCAyNnB4O2ZvbnQtd2VpZ2h0OjUwMDt0cmFuc2l0aW9uOmFsbCAuMjRzIGN1YmljLWJlemllciguMTYsMSwuMywxKTtkaXNwbGF5OmlubGluZS1mbGV4O2JveC1zaGFkb3c6aW5zZXQgMCAxLjVweCAycHggI2ZmZmZmZmE2LGluc2V0IDAgLTEuNXB4IDJweCAjMDAwNiwwIDhweCAyNHB4ICMwMjg0Yzc2NiwwIDAgMTZweCAjMzhiZGY4NGR9Lnh5LXNhdmUtYnRuW2RhdGEtdi1mNTY0NjA1MF06aG92ZXJ7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMzOGJkZjhmMiAwJSwjMGVhNWU5ZDkgNTAlLCMwMjg0YzdlNiAxMDAlKTtib3JkZXItY29sb3I6I2JhZTZmZDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMnB4KTtib3gtc2hhZG93Omluc2V0IDAgMnB4IDNweCAjZmZmYywwIDEycHggMzJweCAjMzhiZGY4OGMsMCAwIDI0cHggIzM4YmRmODY2fS54eS1iYWNrLWJ0bltkYXRhLXYtZjU2NDYwNTBdey13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweCk7Y29sb3I6dmFyKC0teHktdGV4dC1ib2R5KTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZmZmZjE0IDAlLCNmZmZmZmYwNSAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYyNjtib3JkZXItcmFkaXVzOjk5OXB4O3BhZGRpbmc6MTBweCAyMnB4O2ZvbnQtc2l6ZToxM3B4O3RyYW5zaXRpb246YWxsIC4yNHMgY3ViaWMtYmV6aWVyKC4xNiwxLC4zLDEpO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMXB4ICNmZmZmZmYzOCwwIDRweCAxMnB4ICMwMDAwMDA0MH0ueHktYmFjay1idG5bZGF0YS12LWY1NjQ2MDUwXTpob3Zlcntjb2xvcjojZmZmO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjZmZmZmZmMmUgMCUsI2ZmZmZmZjBkIDEwMCUpO2JvcmRlci1jb2xvcjojZmZmZmZmNGQ7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTFweCk7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxLjVweCAjZmZmZmZmNTksMCA2cHggMThweCAjMDAwMDAwNTl9Lnh5LWRhdGEtcGFuZWxbZGF0YS12LTY2NDg0YTAxXXtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjIwcHg7bWF4LXdpZHRoOjExMDBweDttYXJnaW46MCBhdXRvO3BhZGRpbmc6MjRweCAyOHB4IDQwcHg7ZGlzcGxheTpmbGV4fS54eS1wYW5lbC1oZWFkZXJbZGF0YS12LTY2NDg0YTAxXXtib3JkZXItYm90dG9tOjFweCBzb2xpZCB2YXIoLS14eS1ib3JkZXItc3VidGxlKTtwYWRkaW5nLWJvdHRvbToxNHB4fS54eS1wYW5lbC1raWNrZXJbZGF0YS12LTY2NDg0YTAxXXtsZXR0ZXItc3BhY2luZzouMThlbTtmb250LXNpemU6MTBweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2NvbG9yOnZhcigtLXh5LWN5YW4tNDAwKX0ueHktcGFuZWwtdGl0bGVbZGF0YS12LTY2NDg0YTAxXXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjp2YXIoLS14eS10ZXh0LXRpdGxlKTtsZXR0ZXItc3BhY2luZzouMDRlbTttYXJnaW46NHB4IDAgNnB4O2ZvbnQtc2l6ZToyNHB4O2ZvbnQtd2VpZ2h0OjUwMH0ueHktcGFuZWwtZGVzY1tkYXRhLXYtNjY0ODRhMDFde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO21hcmdpbjowO2ZvbnQtc2l6ZToxMnB4fS54eS1xdWljay1hY3Rpb25zLWJhcltkYXRhLXYtNjY0ODRhMDFde2ZsZXgtd3JhcDp3cmFwO2dhcDoxMHB4O2Rpc3BsYXk6ZmxleH0ueHktYWN0aW9uLWJ0bltkYXRhLXYtNjY0ODRhMDFde2NvbG9yOnZhcigtLXh5LXRleHQtdGl0bGUpO2ZvbnQtc2l6ZToxM3B4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2Fucyk7Y3Vyc29yOnBvaW50ZXI7YmFja2dyb3VuZDojMGUxYzMwYjM7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmMWY7Ym9yZGVyLXJhZGl1czo4cHg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7cGFkZGluZzo5cHggMThweDt0cmFuc2l0aW9uOmFsbCAuMnM7ZGlzcGxheTppbmxpbmUtZmxleH0ueHktYWN0aW9uLWJ0bltkYXRhLXYtNjY0ODRhMDFdOmhvdmVye2JvcmRlci1jb2xvcjp2YXIoLS14eS1jeWFuLTQwMCk7Ym94LXNoYWRvdzowIDAgMTZweCB2YXIoLS14eS1jeWFuLWdsb3cpO2JhY2tncm91bmQ6IzE0MmE0OGU2fS5idG4tZGVtb1tkYXRhLXYtNjY0ODRhMDFde2NvbG9yOnZhcigtLXh5LWdvbGQtMzAwKTtiYWNrZ3JvdW5kOiNmYmJmMjQxNDtib3JkZXItY29sb3I6I2ZiYmYyNDY2fS5idG4tZGVtb1tkYXRhLXYtNjY0ODRhMDFdOmhvdmVye2JvcmRlci1jb2xvcjp2YXIoLS14eS1nb2xkLTQwMCk7Ym94LXNoYWRvdzowIDAgMTZweCB2YXIoLS14eS1nb2xkLWdsb3cpO2JhY2tncm91bmQ6I2ZiYmYyNDJlfS54eS1pbXBvcnQtY29uc29sZVtkYXRhLXYtNjY0ODRhMDFde2JvcmRlcjoxcHggc29saWQgdmFyKC0teHktYm9yZGVyLXN1YnRsZSk7YmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweCk7YmFja2dyb3VuZDojMGMxYTJlYmY7Ym9yZGVyLXJhZGl1czoxMnB4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MTJweDtwYWRkaW5nOjE4cHggMjJweDtkaXNwbGF5OmZsZXh9Lnh5LWNvbnNvbGUtaGVhZGVyW2RhdGEtdi02NjQ4NGEwMV17anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2Rpc3BsYXk6ZmxleH0ueHktY29uc29sZS10aXRsZVtkYXRhLXYtNjY0ODRhMDFde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LWN5YW4tMjAwKTtmb250LXNpemU6MTRweH0ueHktZmlsZS11cGxvYWQtYnRuW2RhdGEtdi02NjQ4NGEwMV17Y29sb3I6dmFyKC0teHktY3lhbi0zMDApO2N1cnNvcjpwb2ludGVyO2JhY2tncm91bmQ6IzM4YmRmODE0O2JvcmRlcjoxcHggc29saWQgIzM4YmRmODQwO2JvcmRlci1yYWRpdXM6NnB4O3BhZGRpbmc6NXB4IDEycHg7Zm9udC1zaXplOjExcHg7dHJhbnNpdGlvbjphbGwgLjJzfS54eS1maWxlLXVwbG9hZC1idG5bZGF0YS12LTY2NDg0YTAxXTpob3ZlcntiYWNrZ3JvdW5kOiMzOGJkZjgyZX0ueHktaGlkZGVuLWlucHV0W2RhdGEtdi02NjQ4NGEwMV17ZGlzcGxheTpub25lfS54eS1qc29uLXRleHRhcmVhW2RhdGEtdi02NjQ4NGEwMV17Y29sb3I6I2JhZTZmZDt3aWR0aDoxMDAlO2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7cmVzaXplOnZlcnRpY2FsO2JhY2tncm91bmQ6IzA2MGUxYWU2O2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjFhO2JvcmRlci1yYWRpdXM6OHB4O291dGxpbmU6bm9uZTtwYWRkaW5nOjEycHggMTRweDtmb250LXNpemU6MTJweDtsaW5lLWhlaWdodDoxLjZ9Lnh5LWpzb24tdGV4dGFyZWFbZGF0YS12LTY2NDg0YTAxXTpmb2N1c3tib3JkZXItY29sb3I6dmFyKC0teHktY3lhbi00MDApO2JveC1zaGFkb3c6MCAwIDEycHggdmFyKC0teHktY3lhbi1nbG93KX0ueHktaW1wb3J0LWJ0bnNbZGF0YS12LTY2NDg0YTAxXXtnYXA6MTBweDtkaXNwbGF5OmZsZXh9Lnh5LWltcC1idG5bZGF0YS12LTY2NDg0YTAxXXtjb2xvcjp2YXIoLS14eS10ZXh0LXRpdGxlKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOiNmZmZmZmYwZDtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYxZjtib3JkZXItcmFkaXVzOjZweDtwYWRkaW5nOjhweCAxNnB4O2ZvbnQtc2l6ZToxMnB4O3RyYW5zaXRpb246YWxsIC4yc30ueHktaW1wLWJ0bltkYXRhLXYtNjY0ODRhMDFdOmhvdmVyOm5vdCg6ZGlzYWJsZWQpe2JvcmRlci1jb2xvcjp2YXIoLS14eS1jeWFuLTQwMCk7YmFja2dyb3VuZDojMzhiZGY4MjZ9Lnh5LWltcC1idG5bZGF0YS12LTY2NDg0YTAxXTpkaXNhYmxlZHtvcGFjaXR5Oi4zNTtjdXJzb3I6bm90LWFsbG93ZWR9LmJ0bi1kYW5nZXJbZGF0YS12LTY2NDg0YTAxXXtjb2xvcjp2YXIoLS14eS1jcmltc29uLTMwMCk7Ym9yZGVyLWNvbG9yOiNmNDNmNWU0ZH0uYnRuLWRhbmdlcltkYXRhLXYtNjY0ODRhMDFdOmhvdmVyOm5vdCg6ZGlzYWJsZWQpe2JvcmRlci1jb2xvcjp2YXIoLS14eS1jcmltc29uLTQwMCk7YmFja2dyb3VuZDojZjQzZjVlMjZ9Lnh5LXNuYXBzaG90LWRldGFpbHNbZGF0YS12LTY2NDg0YTAxXXtiYWNrZ3JvdW5kOiMwNjBlMWE5OTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYxNDtib3JkZXItcmFkaXVzOjhweDtwYWRkaW5nOjEwcHggMTRweH0ueHktc25hcHNob3Qtc3VtbWFyeVtkYXRhLXYtNjY0ODRhMDFde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO2N1cnNvcjpwb2ludGVyO291dGxpbmU6bm9uZTtmb250LXNpemU6MTJweH0ueHktc25hcHNob3QtcHJlW2RhdGEtdi02NjQ4NGEwMV17Y29sb3I6IzdkZDNmYztmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2JhY2tncm91bmQ6IzAzMDcwZGYyO2JvcmRlci1yYWRpdXM6NnB4O21heC1oZWlnaHQ6MzIwcHg7bWFyZ2luOjEwcHggMCAwO3BhZGRpbmc6MTJweDtmb250LXNpemU6MTFweDtsaW5lLWhlaWdodDoxLjY7b3ZlcmZsb3c6YXV0b30ueHktZGV2LXBhbmVsW2RhdGEtdi1jZDA0ZTJhMV17ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoyMHB4O21heC13aWR0aDoxMTAwcHg7bWFyZ2luOjAgYXV0bztwYWRkaW5nOjI0cHggMjhweCA0MHB4O2Rpc3BsYXk6ZmxleH0ueHktcGFuZWwtaGVhZGVyW2RhdGEtdi1jZDA0ZTJhMV17Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0teHktYm9yZGVyLXN1YnRsZSk7cGFkZGluZy1ib3R0b206MTRweH0ueHktcGFuZWwta2lja2VyW2RhdGEtdi1jZDA0ZTJhMV17bGV0dGVyLXNwYWNpbmc6LjE4ZW07Zm9udC1zaXplOjEwcHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtjb2xvcjp2YXIoLS14eS1jeWFuLTQwMCl9Lnh5LXBhbmVsLXRpdGxlW2RhdGEtdi1jZDA0ZTJhMV17Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y29sb3I6dmFyKC0teHktdGV4dC10aXRsZSk7bGV0dGVyLXNwYWNpbmc6LjA0ZW07bWFyZ2luOjRweCAwIDZweDtmb250LXNpemU6MjRweDtmb250LXdlaWdodDo1MDB9Lnh5LXBhbmVsLWRlc2NbZGF0YS12LWNkMDRlMmExXXtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTttYXJnaW46MDtmb250LXNpemU6MTJweH0ueHktZGV2LWFjdGlvbnNbZGF0YS12LWNkMDRlMmExXXtnYXA6MTBweDtkaXNwbGF5OmZsZXh9Lnh5LWRldi1idG5bZGF0YS12LWNkMDRlMmExXXtjb2xvcjp2YXIoLS14eS10ZXh0LXRpdGxlKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOiMwZTFjMzBiMztib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYxZjtib3JkZXItcmFkaXVzOjhweDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjdweDtwYWRkaW5nOjhweCAxNnB4O2ZvbnQtc2l6ZToxMnB4O3RyYW5zaXRpb246YWxsIC4ycztkaXNwbGF5OmlubGluZS1mbGV4fS54eS1kZXYtYnRuW2RhdGEtdi1jZDA0ZTJhMV06aG92ZXJ7Ym9yZGVyLWNvbG9yOnZhcigtLXh5LWN5YW4tNDAwKTtib3gtc2hhZG93OjAgMCAxNHB4IHZhcigtLXh5LWN5YW4tZ2xvdyk7YmFja2dyb3VuZDojMTQyYTQ4ZTZ9Lnh5LWxvZy1zZWN0aW9uW2RhdGEtdi1jZDA0ZTJhMV17YmFja2dyb3VuZDojMDgxMjIwZDk7Ym9yZGVyOjFweCBzb2xpZCAjMzhiZGY4MzM7Ym9yZGVyLXJhZGl1czoxMHB4O3BhZGRpbmc6MTJweCAxNnB4fS54eS1zZWMtc3VtbWFyeVtkYXRhLXYtY2QwNGUyYTFde2ZvbnQtc2l6ZToxMnB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LWN5YW4tMjAwKTtjdXJzb3I6cG9pbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtkaXNwbGF5OmZsZXh9Lnh5LXNlYy10YWdbZGF0YS12LWNkMDRlMmExXXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKTtiYWNrZ3JvdW5kOiMzOGJkZjgzMztib3JkZXItcmFkaXVzOjNweDtwYWRkaW5nOjJweCA2cHg7Zm9udC1zaXplOjlweH0ueHktbG9nLXByZVtkYXRhLXYtY2QwNGUyYTFde2NvbG9yOiM3ZGQzZmM7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtiYWNrZ3JvdW5kOiMwMzA3MGRmMjtib3JkZXItcmFkaXVzOjZweDttYXgtaGVpZ2h0OjMwMHB4O21hcmdpbjoxMnB4IDAgMDtwYWRkaW5nOjE0cHg7Zm9udC1zaXplOjExcHg7bGluZS1oZWlnaHQ6MS42O292ZXJmbG93OmF1dG99Lnh5LWxvZy1saXN0LWNvbnRhaW5lcltkYXRhLXYtY2QwNGUyYTFde2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MTBweDtkaXNwbGF5OmZsZXh9Lnh5LWxpc3QtdGl0bGVbZGF0YS12LWNkMDRlMmExXXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCk7bWFyZ2luOjA7Zm9udC1zaXplOjE1cHh9Lnh5LWxvZy1pdGVtc1tkYXRhLXYtY2QwNGUyYTFde2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O2Rpc3BsYXk6ZmxleH0ueHktbG9nLWRldGFpbC1pdGVtW2RhdGEtdi1jZDA0ZTJhMV17YmFja2dyb3VuZDojMGExNjI2YjM7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmMTQ7Ym9yZGVyLXJhZGl1czo4cHg7b3ZlcmZsb3c6aGlkZGVufS54eS1pdGVtLXN1bW1hcnlbZGF0YS12LWNkMDRlMmExXXtjdXJzb3I6cG9pbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEwcHg7cGFkZGluZzoxMHB4IDE0cHg7Zm9udC1zaXplOjEycHg7ZGlzcGxheTpmbGV4fS54eS1pdGVtLWtpbmRbZGF0YS12LWNkMDRlMmExXXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2JhY2tncm91bmQ6I2ZmZmZmZjE0O2JvcmRlci1yYWRpdXM6NHB4O3BhZGRpbmc6MnB4IDhweDtmb250LXNpemU6MTBweH0ua2luZC1hZGp1ZGljYXRpb25bZGF0YS12LWNkMDRlMmExXXtjb2xvcjp2YXIoLS14eS1jeWFuLTMwMCk7YmFja2dyb3VuZDojMzhiZGY4MzN9LmtpbmQtaG9zdF9wZXJzaXN0ZW5jZVtkYXRhLXYtY2QwNGUyYTFde2NvbG9yOnZhcigtLXh5LWdvbGQtMzAwKTtiYWNrZ3JvdW5kOiNmYmJmMjQzM30ua2luZC1ob3N0X2luamVjdGlvbltkYXRhLXYtY2QwNGUyYTFde2NvbG9yOnZhcigtLXh5LWphZGUtMzAwKTtiYWNrZ3JvdW5kOiMyZGQ0YmYzM30ua2luZC1uYXJyYXRpdmVbZGF0YS12LWNkMDRlMmExXXtjb2xvcjojYzRiNWZkO2JhY2tncm91bmQ6I2E3OGJmYTMzfS54eS1pdGVtLWFjdGlvbltkYXRhLXYtY2QwNGUyYTFde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCl9Lnh5LWl0ZW0tdGltZVtkYXRhLXYtY2QwNGUyYTFde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktdGV4dC1oaW50KTttYXJnaW4tbGVmdDphdXRvO2ZvbnQtc2l6ZToxMHB4fS54eS1pdGVtLXByZVtkYXRhLXYtY2QwNGUyYTFde2NvbG9yOiNiYWU2ZmQ7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtiYWNrZ3JvdW5kOiMwNDA5MTBmMjtib3JkZXItdG9wOjFweCBzb2xpZCAjZmZmZmZmMGY7bWF4LWhlaWdodDoyODBweDttYXJnaW46MDtwYWRkaW5nOjEycHggMTRweDtmb250LXNpemU6MTFweDtsaW5lLWhlaWdodDoxLjY7b3ZlcmZsb3c6YXV0b30ueHktZW1wdHktbG9nc1tkYXRhLXYtY2QwNGUyYTFde3RleHQtYWxpZ246Y2VudGVyO2NvbG9yOnZhcigtLXh5LXRleHQtaGludCk7Ym9yZGVyOjFweCBkYXNoZWQgI2ZmZmZmZjE0O2JvcmRlci1yYWRpdXM6OHB4O3BhZGRpbmc6MjRweDtmb250LXNpemU6MTJweH06cm9vdHstLXh5LWJnLXZvaWQ6IzAzMDcwZDstLXh5LWJnLWFieXNzOiMwNzEwMWU7LS14eS1iZy1zdXJmYWNlLTE6IzBhMTYyOGQxOy0teHktYmctc3VyZmFjZS0yOiMwZjIwM2FiODstLXh5LWJnLXN1cmZhY2UtMzojMTYyZTUyOGM7LS14eS1iZy1jYXJkOiMwYzFhMzBlMDstLXh5LWJnLWdsYXNzOiMxMDIzNDA3MzstLXh5LWN5YW4tNTA6I2YwZjlmZjstLXh5LWN5YW4tMTAwOiNlMGYyZmU7LS14eS1jeWFuLTIwMDojYmFlNmZkOy0teHktY3lhbi0zMDA6IzdkZDNmYzstLXh5LWN5YW4tNDAwOiMzOGJkZjg7LS14eS1jeWFuLTUwMDojMGVhNWU5Oy0teHktY3lhbi1nbG93OiMzOGJkZjg1OTstLXh5LWphZGUtMzAwOiM1ZWVhZDQ7LS14eS1qYWRlLTQwMDojMmRkNGJmOy0teHktamFkZS01MDA6IzE0YjhhNjstLXh5LWphZGUtZ2xvdzojMmRkNGJmNDc7LS14eS1nb2xkLTIwMDojZmRlNjhhOy0teHktZ29sZC0zMDA6I2ZjZDM0ZDstLXh5LWdvbGQtNDAwOiNmYmJmMjQ7LS14eS1nb2xkLTUwMDojZjU5ZTBiOy0teHktZ29sZC1nbG93OiNmYmJmMjQ1MjstLXh5LWNyaW1zb24tMzAwOiNmZGE0YWY7LS14eS1jcmltc29uLTQwMDojZmI3MTg1Oy0teHktY3JpbXNvbi01MDA6I2Y0M2Y1ZTstLXh5LWNyaW1zb24tNjAwOiNlMTFkNDg7LS14eS1jcmltc29uLWdsb3c6I2Y0M2Y1ZTRkOy0teHktdGV4dC10aXRsZTojZjhmYWZjOy0teHktdGV4dC1ib2R5OiNjYmQ1ZTE7LS14eS10ZXh0LW11dGVkOiM2NDc0OGI7LS14eS10ZXh0LWhpbnQ6IzQ3NTU2OTstLXh5LWJvcmRlci1zdWJ0bGU6IzM4YmRmODFmOy0teHktYm9yZGVyLWdsb3c6IzM4YmRmODUyOy0teHktYm9yZGVyLWdvbGQ6I2ZiYmYyNDQ3Oy0teHktYm9yZGVyLWNyaW1zb246I2Y0M2Y1ZTQ3Oy0teHktZWFzZS1vdXQtZXhwbzpjdWJpYy1iZXppZXIoLjE2LCAxLCAuMywgMSk7LS14eS1lYXNlLXNwcmluZzpjdWJpYy1iZXppZXIoLjM0LCAxLjU2LCAuNjQsIDEpOy0teHktZWFzZS1zbW9vdGg6Y3ViaWMtYmV6aWVyKC40LCAwLCAuMiwgMSk7LS14eS1mb250LXNlcmlmOiJTb25ndGkgU0MiLCAiTm90byBTZXJpZiBTQyIsICJTb3VyY2UgSGFuIFNlcmlmIENOIiwgU1RTb25nLCAiU2ltU3VuIiwgR2VvcmdpYSwgc2VyaWY7LS14eS1mb250LXNhbnM6c3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCAiU2Vnb2UgVUkiLCBSb2JvdG8sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7LS14eS1mb250LW1vbm86IkpldEJyYWlucyBNb25vIiwgIlNGIE1vbm8iLCBDb25zb2xhcywgIkNvdXJpZXIgTmV3IiwgbW9ub3NwYWNlfUBrZXlmcmFtZXMgeHktcHVsc2UtZ2xvd3swJSx0b3tvcGFjaXR5Oi40NTt0cmFuc2Zvcm06c2NhbGUoMSl9NTAle29wYWNpdHk6Ljk7dHJhbnNmb3JtOnNjYWxlKDEuMDQpfX1Aa2V5ZnJhbWVzIHh5LWNob3JkLXZpYnJhdGV7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9MjAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0ycHgpfTQwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgycHgpfTYwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KX04MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMXB4KX10b3t0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKX19QGtleWZyYW1lcyB4eS13YXRlci1yaXBwbGV7MCV7b3BhY2l0eTouODt0cmFuc2Zvcm06c2NhbGUoLjgpfXRve29wYWNpdHk6MDt0cmFuc2Zvcm06c2NhbGUoMi4yKX19QGtleWZyYW1lcyB4eS1mbG93LXNpbmV7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZSgwKX10b3t0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUpfX0ueHktY3VzdG9tLXNjcm9sbDo6LXdlYmtpdC1zY3JvbGxiYXJ7d2lkdGg6NnB4O2hlaWdodDo2cHh9Lnh5LWN1c3RvbS1zY3JvbGw6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNre2JhY2tncm91bmQ6IzA0MDkxMjY2fS54eS1jdXN0b20tc2Nyb2xsOjotd2Via2l0LXNjcm9sbGJhci10aHVtYntiYWNrZ3JvdW5kOiMzOGJkZjg0MDtib3JkZXItcmFkaXVzOjk5OXB4fS54eS1jdXN0b20tc2Nyb2xsOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlcntiYWNrZ3JvdW5kOiMzOGJkZjg4MH0ueHktcm9vdC1jb250YWluZXJ7ei1pbmRleDoyMTQ3NDgzMDAwO2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2Fucyk7Y29sb3I6dmFyKC0teHktdGV4dC1ib2R5KTtwb3NpdGlvbjpyZWxhdGl2ZX0ueHktbGF1bmNoZXItc2VhbHtib3JkZXI6MXB4IHNvbGlkIHZhcigtLXh5LWJvcmRlci1nbG93KTt3aWR0aDo1OHB4O2hlaWdodDo1OHB4O2JveC1zaGFkb3c6MCA4cHggMzJweCAjMDAwOSwgMCAwIDIwcHggdmFyKC0teHktY3lhbi1nbG93KTtjdXJzb3I6Z3JhYjt0b3VjaC1hY3Rpb246bm9uZTt6LWluZGV4OjIxNDc0ODMwMDA7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gLjJzIHZhcigtLXh5LWVhc2Utb3V0LWV4cG8pLCBib3gtc2hhZG93IC4yczt1c2VyLXNlbGVjdDpub25lO2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCAzNSUgMzUlLCMwZWE1ZTlmMiwjMDcxMDFlZmEpO2JvcmRlci1yYWRpdXM6NTAlO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtwYWRkaW5nOjA7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOmZpeGVkO2JvdHRvbToyOHB4O3JpZ2h0OjI4cHh9Lnh5LWxhdW5jaGVyLXNlYWw6aG92ZXJ7dHJhbnNmb3JtOnNjYWxlKDEuMDgpO2JveC1zaGFkb3c6MCAxMnB4IDM2cHggIzAwMDAwMGIzLDAgMCAyOHB4ICMzOGJkZjg5OX0ueHktbGF1bmNoZXItc2VhbC5pcy1qdWRnaW5ne2JvcmRlci1jb2xvcjp2YXIoLS14eS1nb2xkLTQwMCk7Ym94LXNoYWRvdzowIDAgMjRweCB2YXIoLS14eS1nb2xkLWdsb3cpO2FuaW1hdGlvbjoxLjVzIGluZmluaXRlIHh5LXB1bHNlLWdsb3d9Lnh5LXNlYWwtcmluZ3twb2ludGVyLWV2ZW50czpub25lO2JvcmRlcjoxcHggZGFzaGVkICMzOGJkZjg2Njtib3JkZXItcmFkaXVzOjUwJTthbmltYXRpb246MjRzIGxpbmVhciBpbmZpbml0ZSB4eS1yb3RhdGUtc2xvdztwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDotM3B4fS54eS1zZWFsLWlubmVye2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7bGluZS1oZWlnaHQ6MS4xO2Rpc3BsYXk6ZmxleH0ueHktc2VhbC1pY29ue2NvbG9yOiNmZmY7Zm9udC1zaXplOjE2cHh9Lnh5LXNlYWwtdGV4dHtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjojZmZmO2xldHRlci1zcGFjaW5nOi4wOGVtO2ZvbnQtc2l6ZToxMXB4O2ZvbnQtd2VpZ2h0OjYwMH0ueHktbGF1bmNoZXItYmFkZ2V7Zm9udC1zaXplOjlweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2JhY2tncm91bmQ6dmFyKC0teHktZ29sZC01MDApO2NvbG9yOiMwMDA7Ym9yZGVyLXJhZGl1czo5OTlweDtwYWRkaW5nOjFweCA2cHg7Zm9udC13ZWlnaHQ6NzAwO3Bvc2l0aW9uOmFic29sdXRlO3RvcDotNHB4O3JpZ2h0Oi00cHg7Ym94LXNoYWRvdzowIDJweCA4cHggIzAwMDAwMDgwfS54eS1tb2RhbC1iYWNrZHJvcHtiYWNrZHJvcC1maWx0ZXI6Ymx1cigyMHB4KTt6LWluZGV4OjIxNDc0ODMwMDA7Ym94LXNpemluZzpib3JkZXItYm94O2JhY2tncm91bmQ6IzAyMDYwY2ViO2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO3BhZGRpbmc6OHB4IDEycHg7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOmZpeGVkO2luc2V0OjB9Lnh5LXdvcmtiZW5jaC1wYW5lbHtiYWNrZ3JvdW5kOnZhcigtLXh5LWJnLWFieXNzKTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLXh5LWJvcmRlci1zdWJ0bGUpO2JveC1zaXppbmc6Ym9yZGVyLWJveDtib3JkZXItcmFkaXVzOjEycHg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO3dpZHRoOjEwMCU7bWF4LXdpZHRoOjE5MjBweDtoZWlnaHQ6MTAwJTttYXgtaGVpZ2h0OjEwMCU7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbjtib3gtc2hhZG93OjAgMjRweCA4MHB4ICMwMDAwMDBmMiwwIDAgMCAxcHggIzM4YmRmODI2fS54eS1ub3RpY2UtYmFubmVye2NvbG9yOnZhcigtLXh5LWdvbGQtMjAwKTtiYWNrZ3JvdW5kOiNmYmJmMjQxZjtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZmJiZjI0NGQ7ZmxleC1zaHJpbms6MDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEwcHg7cGFkZGluZzo4cHggMjRweDtmb250LXNpemU6MTJweDtkaXNwbGF5OmZsZXh9Lnh5LW5vdGljZS1iYW5uZXIuaXMtZXJyb3J7Y29sb3I6dmFyKC0teHktY3JpbXNvbi0zMDApO2JhY2tncm91bmQ6I2Y0M2Y1ZTI0O2JvcmRlci1ib3R0b20tY29sb3I6I2Y0M2Y1ZTU5fS54eS1ub3RpY2UtdGV4dHtmbGV4OjF9Lnh5LW5vdGljZS1kaXNtaXNze2NvbG9yOmN1cnJlbnRDb2xvcjtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOjAgMDtib3JkZXI6MDtwYWRkaW5nOjJweCA2cHg7Zm9udC1zaXplOjE0cHh9Lnh5LWNvbnRlbnQtYm9keXtib3gtc2l6aW5nOmJvcmRlci1ib3g7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2ZsZXg6MTttaW4taGVpZ2h0OjA7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbjt3aWR0aDoxMDAlIWltcG9ydGFudDttYXgtd2lkdGg6bm9uZSFpbXBvcnRhbnQ7bWFyZ2luOjAhaW1wb3J0YW50O3BhZGRpbmc6MCFpbXBvcnRhbnR9Lnh5LWNvbnRlbnQtYm9keS5pcy1zY3JvbGxhYmxle292ZXJmbG93LXk6YXV0b30ueHktbW9kYWwtZmFkZS1lbnRlci1hY3RpdmUsLnh5LW1vZGFsLWZhZGUtbGVhdmUtYWN0aXZle3RyYW5zaXRpb246b3BhY2l0eSAuM3MgdmFyKC0teHktZWFzZS1zbW9vdGgpfS54eS1tb2RhbC1mYWRlLWVudGVyLWZyb20sLnh5LW1vZGFsLWZhZGUtbGVhdmUtdG97b3BhY2l0eTowfS54eS1tb2RhbC1mYWRlLWVudGVyLWFjdGl2ZSAueHktd29ya2JlbmNoLXBhbmVse3RyYW5zaXRpb246dHJhbnNmb3JtIC4zNXMgdmFyKC0teHktZWFzZS1vdXQtZXhwbyksIG9wYWNpdHkgLjNzIHZhcigtLXh5LWVhc2Utc21vb3RoKX0ueHktbW9kYWwtZmFkZS1lbnRlci1mcm9tIC54eS13b3JrYmVuY2gtcGFuZWx7b3BhY2l0eTowO3RyYW5zZm9ybTpzY2FsZSguOTYpdHJhbnNsYXRlWSgxMnB4KX0ueHktbm90aWNlLXNsaWRlLWVudGVyLWFjdGl2ZSwueHktbm90aWNlLXNsaWRlLWxlYXZlLWFjdGl2ZXt0cmFuc2l0aW9uOmFsbCAuMjVzIHZhcigtLXh5LWVhc2Utb3V0LWV4cG8pfS54eS1ub3RpY2Utc2xpZGUtZW50ZXItZnJvbSwueHktbm90aWNlLXNsaWRlLWxlYXZlLXRve29wYWNpdHk6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMTAwJSl9Ci8qJHZpdGUkOjEqLw==", "" + import.meta.url).href;
		if (!e.querySelector("link[href*=\"style.css\"]")) {
			let n = e.createElement("link");
			n.rel = "stylesheet", n.href = t, e.head.appendChild(n);
		}
	} catch {}
	let s = n || (globalThis.SillyTavern?.getContext ? new Ah({ contextProvider: () => globalThis.SillyTavern.getContext() }) : null), c = r || new xh({
		storage: t,
		chatId: i,
		branchId: a,
		hostAdapter: s
	}), l = $c(ah, {
		controller: c,
		hostAdapter: s
	}), u = l.mount(o), d = {
		controller: c,
		root: o,
		app: l,
		vm: u,
		open: () => u.open?.(),
		close: () => u.close?.(),
		render: () => {
			c.emit();
		},
		destroy: () => {
			c.dispose(), l.unmount(), o.remove(), delete globalThis.XYBattle;
		}
	};
	return globalThis.XYBattle = d, d;
}
//#endregion
export { jh as mountBattleSystem };
