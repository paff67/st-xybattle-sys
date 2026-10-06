//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function e(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var t = {}, n = [], r = () => {}, i = () => !1, a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), o = (e) => e.startsWith("onUpdate:"), s = Object.assign, c = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, T = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ee = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, te = /-\w/g, E = ee((e) => e.replace(te, (e) => e.slice(1).toUpperCase())), ne = /\B([A-Z])/g, D = ee((e) => e.replace(ne, "-$1").toLowerCase()), re = ee((e) => e.charAt(0).toUpperCase() + e.slice(1)), ie = ee((e) => e ? `on${re(e)}` : ""), ae = (e, t) => !Object.is(e, t), oe = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, O = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, se = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ce = (e) => {
	let t = g(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, le, ue = () => le ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function de(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? he(r) : de(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
}
var fe = /;(?![^(]*\))/g, pe = /:([^]+)/, me = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function he(e) {
	let t = {};
	return e.replace(me, (e) => e.startsWith("/*") ? "" : e).split(fe).forEach((e) => {
		if (e) {
			let n = e.split(pe);
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
var ge = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", _e = /* @__PURE__ */ e(ge);
ge + "";
function ve(e) {
	return !!e || e === "";
}
function ye(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Ce(e[i], t[i], n);
	return r;
}
function be(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Ce(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function xe(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? be(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Ce(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function Se(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Ce(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? Se(e, t, n, ye) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : Se(e, t, n, xe) : String(e) === String(t))));
}
function we(e, t) {
	return e.findIndex((e) => Ce(e, t));
}
var Te = (e) => !!(e && e.__v_isRef === !0), A = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? Te(e) ? A(e.value) : JSON.stringify(e, Ee, 2) : String(e), Ee = (e, t) => Te(t) ? Ee(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[De(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => De(e)) } : _(t) ? De(t) : v(t) && !d(t) && !C(t) ? String(t) : t, De = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, j, Oe = class {
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
		}
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
function ke() {
	return j;
}
var M, Ae = /* @__PURE__ */ new WeakSet(), je = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, j && (j.active ? j.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ae.has(this) && (Ae.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Fe(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Je(this), Re(this);
		let e = M, t = We;
		M = this, We = !0;
		try {
			return this.fn();
		} finally {
			ze(this), M = e, We = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) He(e);
			this.deps = this.depsTail = void 0, Je(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ae.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Be(this) && this.run();
	}
	get dirty() {
		return Be(this);
	}
}, Me = 0, Ne, Pe;
function Fe(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Pe, Pe = e;
		return;
	}
	e.next = Ne, Ne = e;
}
function Ie() {
	Me++;
}
function Le() {
	if (--Me > 0) return;
	if (Pe) {
		let e = Pe;
		for (Pe = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Ne;) {
		let t = Ne;
		for (Ne = void 0; t;) {
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
function Re(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function ze(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), He(r), Ue(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Be(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ve(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ve(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ye) || (e.globalVersion = Ye, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Be(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = M, r = We;
	M = e, We = !0;
	try {
		Re(e);
		let n = e.fn(e._value);
		(t.version === 0 || ae(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		M = n, We = r, ze(e), e.flags &= -3;
	}
}
function He(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) He(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ue(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var We = !0, Ge = [];
function Ke() {
	Ge.push(We), We = !1;
}
function qe() {
	let e = Ge.pop();
	We = e === void 0 || e;
}
function Je(e) {
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
var Ye = 0, Xe = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ze = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!M || !We || M === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== M) t = this.activeLink = new Xe(M, this), M.deps ? (t.prevDep = M.depsTail, M.depsTail.nextDep = t, M.depsTail = t) : M.deps = M.depsTail = t, Qe(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = M.depsTail, t.nextDep = void 0, M.depsTail.nextDep = t, M.depsTail = t, M.deps === t && (M.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ye++, this.notify(e);
	}
	notify(e) {
		Ie();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Le();
		}
	}
};
function Qe(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Qe(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var $e = /* @__PURE__ */ new WeakMap(), et = /* @__PURE__ */ Symbol(""), tt = /* @__PURE__ */ Symbol(""), nt = /* @__PURE__ */ Symbol("");
function N(e, t, n) {
	if (We && M) {
		let t = $e.get(e);
		t || $e.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ze()), r.map = t, r.key = n), r.track();
	}
}
function rt(e, t, n, r, i, a) {
	let o = $e.get(e);
	if (!o) {
		Ye++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Ie(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === nt || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(nt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(et)), f(e) && s(o.get(tt)));
				break;
			case "delete":
				i || (s(o.get(et)), f(e) && s(o.get(tt)));
				break;
			case "set": f(e) && s(o.get(et));
		}
	}
	Le();
}
function it(e) {
	let t = /* @__PURE__ */ P(e);
	return t === e || (N(t, "iterate", nt), /* @__PURE__ */ Ut(e)) ? t : /* @__PURE__ */ Ht(e) ? /* @__PURE__ */ Vt(e) ? t.map((e) => qt(Kt(e))) : t.map(qt) : t.map(Kt);
}
function at(e) {
	return N(e = /* @__PURE__ */ P(e), "iterate", nt), e;
}
function ot(e, t) {
	return /* @__PURE__ */ Ht(e) ? qt(/* @__PURE__ */ Vt(e) ? Kt(t) : t) : Kt(t);
}
var st = {
	__proto__: null,
	[Symbol.iterator]() {
		return ct(this, Symbol.iterator, (e) => ot(this, e));
	},
	concat(...e) {
		return it(this).concat(...e.map((e) => d(e) ? it(e) : e));
	},
	entries() {
		return ct(this, "entries", (e) => (e[1] = ot(this, e[1]), e));
	},
	every(e, t) {
		return ut(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return ut(this, "filter", e, t, (e) => e.map((e) => ot(this, e)), arguments);
	},
	find(e, t) {
		return ut(this, "find", e, t, (e) => ot(this, e), arguments);
	},
	findIndex(e, t) {
		return ut(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return ut(this, "findLast", e, t, (e) => ot(this, e), arguments);
	},
	findLastIndex(e, t) {
		return ut(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return ut(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ft(this, "includes", e);
	},
	indexOf(...e) {
		return ft(this, "indexOf", e);
	},
	join(e) {
		return it(this).join(e);
	},
	lastIndexOf(...e) {
		return ft(this, "lastIndexOf", e);
	},
	map(e, t) {
		return ut(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return pt(this, "pop");
	},
	push(...e) {
		return pt(this, "push", e);
	},
	reduce(e, ...t) {
		return dt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return dt(this, "reduceRight", e, t);
	},
	shift() {
		return pt(this, "shift");
	},
	some(e, t) {
		return ut(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return pt(this, "splice", e);
	},
	toReversed() {
		return it(this).toReversed();
	},
	toSorted(e) {
		return it(this).toSorted(e);
	},
	toSpliced(...e) {
		return it(this).toSpliced(...e);
	},
	unshift(...e) {
		return pt(this, "unshift", e);
	},
	values() {
		return ct(this, "values", (e) => ot(this, e));
	}
};
function ct(e, t, n) {
	let r = at(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Ut(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var lt = Array.prototype;
function ut(e, t, n, r, i, a) {
	let o = at(e), s = o !== e && !/* @__PURE__ */ Ut(e), c = o[t];
	if (c !== lt[t]) {
		let t = c.apply(e, a);
		return s ? Kt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, ot(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function dt(e, t, n, r) {
	let i = at(e), a = i !== e && !/* @__PURE__ */ Ut(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = ot(e, t)), n.call(this, t, ot(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? ot(e, c) : c;
}
function ft(e, t, n) {
	let r = /* @__PURE__ */ P(e);
	N(r, "iterate", nt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Wt(n[0]) ? (n[0] = /* @__PURE__ */ P(n[0]), r[t](...n)) : i;
}
function pt(e, t, n = []) {
	Ke(), Ie();
	let r = (/* @__PURE__ */ P(e))[t].apply(e, n);
	return Le(), qe(), r;
}
var mt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), ht = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function gt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ P(this);
	return N(t, "has", e), t.hasOwnProperty(e);
}
var _t = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Ft : Pt : i ? Nt : Mt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = st[t])) return e;
			if (t === "hasOwnProperty") return gt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ Jt(e) ? e : n);
		if ((_(t) ? ht.has(t) : mt(t)) || (r || N(e, "get", t), i)) return o;
		if (/* @__PURE__ */ Jt(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ zt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ zt(o) : /* @__PURE__ */ Lt(o) : o;
	}
}, vt = class extends _t {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Ht(i);
			if (!/* @__PURE__ */ Ut(n) && !/* @__PURE__ */ Ht(n) && (i = /* @__PURE__ */ P(i), n = /* @__PURE__ */ P(n)), !a && /* @__PURE__ */ Jt(i) && !/* @__PURE__ */ Jt(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ Jt(e) ? e : r);
		return e === /* @__PURE__ */ P(r) && s && (o ? ae(n, i) && rt(e, "set", t, n, i) : rt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && rt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !ht.has(t)) && N(e, "has", t), n;
	}
	ownKeys(e) {
		return N(e, "iterate", d(e) ? "length" : et), Reflect.ownKeys(e);
	}
}, yt = class extends _t {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, bt = /* @__PURE__ */ new vt(), xt = /* @__PURE__ */ new yt(), St = /* @__PURE__ */ new vt(!0), Ct = (e) => e, wt = (e) => Reflect.getPrototypeOf(e);
function Tt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ P(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? Ct : t ? qt : Kt;
		return !t && N(a, "iterate", l ? tt : et), s(Object.create(u), { next() {
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
function Et(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Dt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ P(r), a = /* @__PURE__ */ P(n);
			e || (ae(n, a) && N(i, "get", n), N(i, "get", a));
			let { has: o } = wt(i), s = t ? Ct : e ? qt : Kt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && N(/* @__PURE__ */ P(t), "iterate", et), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ P(n), i = /* @__PURE__ */ P(t);
			return e || (ae(t, i) && N(r, "has", t), N(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ P(a), s = t ? Ct : e ? qt : Kt;
			return !e && N(o, "iterate", et), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: Et("add"),
		set: Et("set"),
		delete: Et("delete"),
		clear: Et("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ P(this), r = wt(n), i = /* @__PURE__ */ P(e), a = !t && !/* @__PURE__ */ Ut(e) && !/* @__PURE__ */ Ht(e) ? i : e;
			return r.has.call(n, a) || ae(e, a) && r.has.call(n, e) || ae(i, a) && r.has.call(n, i) || (n.add(a), rt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Ut(n) && !/* @__PURE__ */ Ht(n) && (n = /* @__PURE__ */ P(n));
			let r = /* @__PURE__ */ P(this), { has: i, get: a } = wt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ P(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? ae(n, s) && rt(r, "set", e, n, s) : rt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ P(this), { has: n, get: r } = wt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ P(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && rt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ P(this), t = e.size !== 0, n = e.clear();
			return t && rt(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Tt(r, e, t);
	}), n;
}
function Ot(e, t) {
	let n = Dt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var kt = { get: /* @__PURE__ */ Ot(!1, !1) }, At = { get: /* @__PURE__ */ Ot(!1, !0) }, jt = { get: /* @__PURE__ */ Ot(!0, !1) }, Mt = /* @__PURE__ */ new WeakMap(), Nt = /* @__PURE__ */ new WeakMap(), Pt = /* @__PURE__ */ new WeakMap(), Ft = /* @__PURE__ */ new WeakMap();
function It(e) {
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
function Lt(e) {
	return /* @__PURE__ */ Ht(e) ? e : Bt(e, !1, bt, kt, Mt);
}
// @__NO_SIDE_EFFECTS__
function Rt(e) {
	return Bt(e, !1, St, At, Nt);
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return Bt(e, !0, xt, jt, Pt);
}
function Bt(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = It(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return /* @__PURE__ */ Ht(e) ? /* @__PURE__ */ Vt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Ht(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Ut(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Wt(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function P(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ P(t) : e;
}
function Gt(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && O(e, "__v_skip", !0), e;
}
var Kt = (e) => v(e) ? /* @__PURE__ */ Lt(e) : e, qt = (e) => v(e) ? /* @__PURE__ */ zt(e) : e;
// @__NO_SIDE_EFFECTS__
function Jt(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function F(e) {
	return Xt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Yt(e) {
	return Xt(e, !0);
}
function Xt(e, t) {
	return /* @__PURE__ */ Jt(e) ? e : new Zt(e, t);
}
var Zt = class {
	constructor(e, t) {
		this.dep = new Ze(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ P(e), this._value = t ? e : Kt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Ut(e) || /* @__PURE__ */ Ht(e);
		e = n ? e : /* @__PURE__ */ P(e), ae(e, t) && (this._rawValue = e, this._value = n ? e : Kt(e), this.dep.trigger());
	}
};
function Qt(e) {
	return /* @__PURE__ */ Jt(e) ? e.value : e;
}
var $t = {
	get: (e, t, n) => t === "__v_raw" ? e : Qt(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ Jt(i) && !/* @__PURE__ */ Jt(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function en(e) {
	return /* @__PURE__ */ Vt(e) ? e : new Proxy(e, $t);
}
var tn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ze(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ye - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && M !== this) return Fe(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Ve(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function nn(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new tn(r, i, n);
}
var rn = {}, an = /* @__PURE__ */ new WeakMap(), on = void 0;
function sn(e, t = !1, n = on) {
	if (n) {
		let t = an.get(n);
		t || an.set(n, t = []), t.push(e);
	}
}
function cn(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ Ut(e) || o === !1 || o === 0 ? ln(e, 1) : ln(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ Jt(e) ? (g = () => e.value, y = /* @__PURE__ */ Ut(e)) : /* @__PURE__ */ Vt(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Vt(e) || /* @__PURE__ */ Ut(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ Jt(e)) return e.value;
		if (/* @__PURE__ */ Vt(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			Ke();
			try {
				_();
			} finally {
				qe();
			}
		}
		let t = on;
		on = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			on = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => ln(e(), t);
	}
	let x = ke(), S = () => {
		m.stop(), x && x.active && c(x.effects, m);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(rn) : rn, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (n) {
				let t = m.run();
				if (e || o || y || (b ? t.some((e, t) => ae(e, C[t])) : ae(t, C))) {
					_ && _();
					let e = on;
					on = m;
					try {
						let e = [
							t,
							C === rn ? void 0 : b && C[0] === rn ? [] : C,
							v
						];
						C = t, f ? f(n, 3, e) : n(...e);
					} finally {
						on = e;
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new je(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => sn(e, !1, m), _ = m.onStop = () => {
		let e = an.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			an.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function ln(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ Jt(e)) ln(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) ln(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		ln(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) ln(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && ln(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function un(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		fn(e, t, n);
	}
}
function dn(e, t, n, r) {
	if (h(e)) {
		let i = un(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			fn(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(dn(e[a], t, n, r));
		return i;
	}
}
function fn(e, n, r, i = !0) {
	let a = n ? n.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = n && n.appContext.config || t;
	if (n) {
		let t = n.parent, i = n.proxy, a = `https://vuejs.org/error-reference/#runtime-${r}`;
		for (; t;) {
			let n = t.ec;
			if (n) {
				for (let t = 0; t < n.length; t++) if (n[t](e, i, a) === !1) return;
			}
			t = t.parent;
		}
		if (o) {
			Ke(), un(o, null, 10, [
				e,
				i,
				a
			]), qe();
			return;
		}
	}
	pn(e, r, a, i, s);
}
function pn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var mn = [], hn = -1, gn = [], _n = null, vn = 0, yn = /* @__PURE__ */ Promise.resolve(), bn = null;
function xn(e) {
	let t = bn || yn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Sn(e) {
	let t = hn + 1, n = mn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = mn[r], a = On(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Cn(e) {
	if (!(e.flags & 1)) {
		let t = On(e), n = mn[mn.length - 1];
		!n || !(e.flags & 2) && t >= On(n) ? mn.push(e) : mn.splice(Sn(t), 0, e), e.flags |= 1, wn();
	}
}
function wn() {
	bn ||= yn.then(kn);
}
function Tn(e) {
	if (!d(e)) _n && e.id === -1 ? _n.splice(vn + 1, 0, e) : e.flags & 1 || (gn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) gn.push(e[t]);
	wn();
}
function En(e, t, n = hn + 1) {
	for (; n < mn.length; n++) {
		let t = mn[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			mn.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function Dn(e) {
	if (gn.length) {
		let e = [...new Set(gn)].sort((e, t) => On(e) - On(t));
		if (gn.length = 0, _n) {
			for (let t = 0; t < e.length; t++) _n.push(e[t]);
			return;
		}
		for (_n = e, vn = 0; vn < _n.length; vn++) {
			let e = _n[vn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		_n = null, vn = 0;
	}
}
var On = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function kn(e) {
	try {
		for (hn = 0; hn < mn.length; hn++) {
			let e = mn[hn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), un(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; hn < mn.length; hn++) {
			let e = mn[hn];
			e && (e.flags &= -2);
		}
		hn = -1, mn.length = 0, Dn(e), bn = null, (mn.length || gn.length) && kn(e);
	}
}
var An = null, jn = null;
function Mn(e) {
	let t = An;
	return An = e, jn = e && e.type.__scopeId || null, t;
}
function Nn(e, t = An, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ea(-1);
		let i = Mn(t), a = Xi.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Xi.length; e > a; e--) Qi();
			Mn(i), r._d && ea(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function I(e, n) {
	if (An === null) return e;
	let r = Na(An), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && ln(o), i.push({
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
function Pn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ke(), dn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), qe());
	}
}
function Fn(e, t) {
	if (W) {
		let n = W.provides, r = W.parent && W.parent.provides;
		r === n && (n = W.provides = Object.create(r)), n[e] = t;
	}
}
function In(e, t, n = !1) {
	let r = ba();
	if (r || ri) {
		let i = ri ? ri._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var Ln = /* @__PURE__ */ Symbol.for("v-scx"), Rn = () => In(Ln);
function zn(e, t, n) {
	return Bn(e, t, n);
}
function Bn(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (Ea) {
		if (c === "sync") {
			let e = Rn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = W;
	u.call = (e, t, n) => dn(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		Pi(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : Cn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = cn(e, n, u);
	return Ea && (f ? f.push(h) : d && h()), h;
}
function Vn(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? Hn(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = Ca(this), s = Bn(i, a.bind(r), n);
	return o(), s;
}
function Hn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Un = /* @__PURE__ */ Symbol("_vte"), Wn = (e) => e.__isTeleport, Gn = /* @__PURE__ */ Symbol("_leaveCb"), Kn = /* @__PURE__ */ Symbol("_enterCb");
function qn() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return br(() => {
		e.isMounted = !0;
	}), Cr(() => {
		e.isUnmounting = !0;
	}), e;
}
var Jn = [Function, Array], Yn = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: Jn,
	onEnter: Jn,
	onAfterEnter: Jn,
	onEnterCancelled: Jn,
	onBeforeLeave: Jn,
	onLeave: Jn,
	onAfterLeave: Jn,
	onLeaveCancelled: Jn,
	onBeforeAppear: Jn,
	onAppear: Jn,
	onAfterAppear: Jn,
	onAppearCancelled: Jn
}, Xn = (e) => {
	let t = e.subTree;
	return t.component ? Xn(t.component) : t;
}, Zn = {
	name: "BaseTransition",
	props: Yn,
	setup(e, { slots: t }) {
		let n = ba(), r = qn();
		return () => {
			let i = t.default && ar(t.default(), !0), a = i && i.length ? Qn(i) : n.subTree ? U() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ P(e), { mode: s } = o;
			if (r.isLeaving) return nr(a);
			let c = rr(a);
			if (!c) return nr(a);
			let l = tr(c, o, r, n, (e) => l = e);
			c.type !== Ji && ir(c, l);
			let u = n.subTree && rr(n.subTree);
			if (u && u.type !== Ji && !ia(u, c) && Xn(n).type !== Ji) {
				let e = tr(u, o, r, n);
				if (ir(u, e), s === "out-in" && c.type !== Ji) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, nr(a);
				s === "in-out" && c.type !== Ji ? e.delayLeave = (e, t, n) => {
					let i = er(r, u);
					i[String(u.key)] = u, e[Gn] = () => {
						t(), e[Gn] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function Qn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Ji) {
			t = n;
			break;
		}
	}
	return t;
}
var $n = Zn;
function er(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function tr(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: f, onBeforeLeave: p, onLeave: m, onAfterLeave: h, onLeaveCancelled: g, onBeforeAppear: _, onAppear: v, onAfterAppear: y, onAppearCancelled: b } = t, x = String(e.key), S = er(n, e), C = (e, t) => {
		e && dn(e, r, 9, t);
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
			t[Gn] && t[Gn](!0);
			let i = S[x];
			i && ia(e, i) && i.el[Gn] && i.el[Gn](), C(r, [t]);
		},
		enter(t) {
			if (S[x] === e) return;
			let r = l, i = u, o = f;
			if (!n.isMounted) {
				if (a) r = v || l, i = y || u, o = b || f;
				else return;
			}
			let s = !1;
			t[Kn] = (e) => {
				s || (s = !0, C(e ? o : i, [t]), T.delayedLeave && T.delayedLeave(), t[Kn] = void 0);
			};
			let c = t[Kn].bind(null, !1);
			r ? w(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[Kn] && t[Kn](!0), n.isUnmounting) return r();
			C(p, [t]);
			let a = !1;
			t[Gn] = (n) => {
				a || (a = !0, r(), C(n ? g : h, [t]), t[Gn] = void 0, S[i] === e && delete S[i]);
			};
			let o = t[Gn].bind(null, !1);
			S[i] = e, m ? w(m, [t, o]) : o();
		},
		clone(e) {
			let a = tr(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return T;
}
function nr(e) {
	if (fr(e)) return e = la(e), e.children = null, e;
}
function rr(e) {
	if (!fr(e)) return Wn(e.type) && e.children ? Qn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function ir(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		ir(Wn(n.type) && rr(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function ar(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === R ? (o.patchFlag & 128 && i++, r = r.concat(ar(o.children, t, s))) : (t || o.type !== Ji) && r.push(s == null ? o : la(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function or(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function sr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var cr = /* @__PURE__ */ new WeakMap();
function lr(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => lr(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (dr(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && lr(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? Na(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ P(v), b = v === t ? i : (e) => !sr(_, e) && u(y, e), x = (e, t) => !(t && sr(_, t));
	if (m != null && m !== p) {
		if (ur(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ Jt(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) un(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ Jt(p);
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
				} else t ? (_[p] = l, b(p) && (v[p] = l)) : n && (x(p, e.k) && (p.value = l), e.k && (_[e.k] = l));
			};
			if (l) {
				let t = () => {
					i(), cr.delete(e);
				};
				t.id = -1, cr.set(e, t), Pi(t, r);
			} else ur(e), i();
		}
	}
}
function ur(e) {
	let t = cr.get(e);
	t && (t.flags |= 8, cr.delete(e));
}
ue().requestIdleCallback, ue().cancelIdleCallback;
var dr = (e) => !!e.type.__asyncLoader, fr = (e) => e.type.__isKeepAlive;
function pr(e, t) {
	hr(e, "a", t);
}
function mr(e, t) {
	hr(e, "da", t);
}
function hr(e, t, n = W) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (_r(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) fr(e.parent.vnode) && gr(r, t, n, e), e = e.parent;
	}
}
function gr(e, t, n, r) {
	let i = _r(t, e, r, !0);
	wr(() => {
		c(r[t], i);
	}, n);
}
function _r(e, t, n = W, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ke();
			let i = Ca(n), a = dn(t, n, e, r);
			return i(), qe(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var vr = (e) => (t, n = W) => {
	(!Ea || e === "sp") && _r(e, (...e) => t(...e), n);
}, yr = vr("bm"), br = vr("m"), xr = vr("bu"), Sr = vr("u"), Cr = vr("bum"), wr = vr("um"), Tr = vr("sp"), Er = vr("rtg"), Dr = vr("rtc");
function Or(e, t = W) {
	_r("ec", e, t);
}
var kr = "components";
function Ar(e, t) {
	return Mr(kr, e, !0, t) || e;
}
var jr = /* @__PURE__ */ Symbol.for("v-ndc");
function Mr(e, t, n = !0, r = !1) {
	let i = An || W;
	if (i) {
		let n = i.type;
		if (e === kr) {
			let e = Pa(n, !1);
			if (e && (e === t || e === E(t) || e === re(E(t)))) return n;
		}
		let a = Nr(i[e] || n[e], t) || Nr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function Nr(e, t) {
	return e && (e[t] || e[E(t)] || e[re(E(t))]);
}
function L(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Vt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Ut(e), s = /* @__PURE__ */ Ht(e), e = at(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? qt(Kt(e[n])) : Kt(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
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
var Pr = (e) => e ? Ta(e) ? Na(e) : Pr(e.parent) : null, Fr = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Pr(e.parent),
	$root: (e) => Pr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Wr(e),
	$forceUpdate: (e) => e.f ||= () => {
		Cn(e.update);
	},
	$nextTick: (e) => e.n ||= xn.bind(e.proxy),
	$watch: (e) => Vn.bind(e)
}), Ir = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), Lr = {
	get({ _: e }, n) {
		if (n === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (n[0] !== "$") {
			let e = s[n];
			if (e !== void 0) switch (e) {
				case 1: return i[n];
				case 2: return a[n];
				case 4: return r[n];
				case 3: return o[n];
			}
			else if (Ir(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else zr && (s[n] = 0);
		}
		let d = Fr[n], f, p;
		if (d) return n === "$attrs" && N(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return Ir(a, n) ? (a[n] = r, !0) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || Ir(n, c) || u(o, c) || u(i, c) || u(Fr, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Rr(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var zr = !0;
function Br(e) {
	let t = Wr(e), n = e.proxy, i = e.ctx;
	zr = !1, t.beforeCreate && Hr(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: T, renderTracked: ee, renderTriggered: te, errorCaptured: E, serverPrefetch: ne, expose: D, inheritAttrs: re, components: ie, directives: ae, filters: oe } = t;
	if (u && Vr(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ Lt(t));
	}
	if (zr = !0, o) for (let e in o) {
		let t = o[e], a = G({
			get: h(t) ? t.bind(n, n) : h(t.get) ? t.get.bind(n, n) : r,
			set: !h(t) && h(t.set) ? t.set.bind(n) : r
		});
		Object.defineProperty(i, e, {
			enumerable: !0,
			configurable: !0,
			get: () => a.value,
			set: (e) => a.value = e
		});
	}
	if (c) for (let e in c) Ur(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Fn(t, e[t]);
		});
	}
	f && Hr(f, e, "c");
	function O(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (O(yr, p), O(br, m), O(xr, g), O(Sr, _), O(pr, y), O(mr, b), O(Or, E), O(Dr, ee), O(Er, te), O(Cr, S), O(wr, w), O(Tr, ne), d(D)) {
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
	T && e.render === r && (e.render = T), re != null && (e.inheritAttrs = re), ie && (e.components = ie), ae && (e.directives = ae), ne && or(e);
}
function Vr(e, t, n = r) {
	d(e) && (e = Yr(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? In(r.from || n, r.default, !0) : In(r.from || n) : In(r), /* @__PURE__ */ Jt(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Hr(e, t, n) {
	dn(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Ur(e, t, n, r) {
	let i = r.includes(".") ? Hn(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && zn(i, n);
	} else if (h(e)) zn(i, e.bind(n));
	else if (v(e)) {
		if (d(e)) e.forEach((e) => Ur(e, t, n, r));
		else {
			let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
			h(r) && zn(i, r, e);
		}
	}
}
function Wr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Gr(c, e, o, !0)), Gr(c, t, o)), v(t) && a.set(t, c), c;
}
function Gr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Gr(e, a, n, !0), i && i.forEach((t) => Gr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Kr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Kr = {
	data: qr,
	props: Qr,
	emits: Qr,
	methods: Zr,
	computed: Zr,
	beforeCreate: Xr,
	created: Xr,
	beforeMount: Xr,
	mounted: Xr,
	beforeUpdate: Xr,
	updated: Xr,
	beforeDestroy: Xr,
	beforeUnmount: Xr,
	destroyed: Xr,
	unmounted: Xr,
	activated: Xr,
	deactivated: Xr,
	errorCaptured: Xr,
	serverPrefetch: Xr,
	components: Zr,
	directives: Zr,
	watch: $r,
	provide: qr,
	inject: Jr
};
function qr(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function Jr(e, t) {
	return Zr(Yr(e), Yr(t));
}
function Yr(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function Xr(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Zr(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Qr(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), Rr(e), Rr(t ?? {})) : t;
}
function $r(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = Xr(e[r], t[r]);
	return n;
}
function ei() {
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
var ti = 0;
function ni(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = ei(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: ti++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: La,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && h(e.install) ? (a.add(e), e.install(l, ...t)) : h(e) && (a.add(e), e(l, ...t))), l;
			},
			mixin(e) {
				return i.mixins.includes(e) || i.mixins.push(e), l;
			},
			component(e, t) {
				return t ? (i.components[e] = t, l) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, l) : i.directives[e];
			},
			mount(a, o, s) {
				if (!c) {
					let u = l._ceVNode || H(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, Na(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (dn(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = ri;
				ri = l;
				try {
					return e();
				} finally {
					ri = t;
				}
			}
		};
		return l;
	};
}
var ri = null, ii = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${E(t)}Modifiers`] || e[`${D(t)}Modifiers`];
function ai(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && ii(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(se)));
	let c, l = i[c = ie(n)] || i[c = ie(E(n))];
	!l && o && (l = i[c = ie(D(n))]), l && dn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, dn(u, e, 6, a);
	}
}
var oi = /* @__PURE__ */ new WeakMap();
function si(e, t, n = !1) {
	let r = n ? oi : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = si(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function ci(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, D(t)) || u(e, t));
}
function li(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Mn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = fa(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = fa(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : ui(c);
		}
	} catch (t) {
		Xi.length = 0, fn(t, e, 1), v = H(Ji);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = di(y, a)), b = la(b, y, !1, !0));
	}
	return n.dirs && (b = la(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && ir(Wn(b.type) && rr(b) || b, n.transition), v = b, Mn(_), v;
}
var ui = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, di = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function fi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? pi(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (mi(o, r, n) && !ci(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || pi(r, o, l) : !!o;
	return !1;
}
function pi(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (mi(t, e, a) && !ci(n, a)) return !0;
	}
	return !1;
}
function mi(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !Ce(r, i) : r !== i;
}
function hi({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var gi = {}, _i = () => Object.create(gi), vi = (e) => Object.getPrototypeOf(e) === gi;
function yi(e, t, n, r = !1) {
	let i = {}, a = _i();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), xi(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Rt(i) : e.type.props ? i : a, e.attrs = a;
}
function bi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ P(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (ci(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = E(o);
						i[t] = Si(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		xi(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = D(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Si(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && rt(e.attrs, "set", "");
}
function xi(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = E(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : ci(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ P(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = Si(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function Si(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Ca(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === D(n)) && (r = !0));
	}
	return r;
}
var Ci = /* @__PURE__ */ new WeakMap();
function wi(e, r, i = !1) {
	let a = i ? Ci : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = wi(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = E(c[e]);
		Ti(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = E(e);
		if (Ti(t)) {
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
	let m = [l, f];
	return v(e) && a.set(e, m), m;
}
function Ti(e) {
	return e[0] !== "$" && !T(e);
}
var Ei = (e) => e === "_" || e === "_ctx" || e === "$stable", Di = (e) => d(e) ? e.map(fa) : [fa(e)], Oi = (e, t, n) => {
	if (t._n) return t;
	let r = Nn((...e) => Di(t(...e)), n);
	return r._c = !1, r;
}, ki = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Ei(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = Oi(n, i, r);
		else if (i != null) {
			let e = Di(i);
			t[n] = () => e;
		}
	}
}, Ai = (e, t) => {
	let n = Di(t);
	e.slots.default = () => n;
}, ji = (e, t, n) => {
	for (let r in t) (n || !Ei(r)) && (e[r] = t[r]);
}, Mi = (e, t, n) => {
	let r = e.slots = _i();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (ji(r, t, n), n && O(r, "_", e, !0)) : ki(t, r);
	} else t && Ai(e, t);
}, Ni = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : ji(a, n, r) : (o = !n.$stable, ki(n, a)), s = n;
	} else n && (Ai(e, n), s = { default: 1 });
	if (o) for (let e in a) !Ei(e) && s[e] == null && delete a[e];
}, Pi = Ki;
function Fi(e) {
	return Ii(e);
}
function Ii(e, i) {
	let a = ue();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ia(e, t) && (i = ye(e), he(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case qi:
				y(e, t, r, i);
				break;
			case Ji:
				b(e, t, r, i);
				break;
			case Yi:
				e ?? x(t, r, i, s);
				break;
			case R:
				ie(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? ae(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, Se);
		}
		d != null && a ? lr(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && lr(e.ref, null, o, e, !0);
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
	}, S = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) ee(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), ne(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, ee = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && E(e.children, d, null, r, i, Li(e, a), s, u), _ && Pn(e, null, r, "created"), te(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && ga(f, r, e);
		}
		_ && Pn(e, null, r, "beforeMount");
		let v = zi(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && Pi(() => {
			try {
				f && ga(f, r, e), v && g.enter(d), _ && Pn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, te = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Gi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				te(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, E = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? pa(e[l]) : fa(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, ne = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Ri(r, !1), (g = h.onVnodeBeforeUpdate) && ga(g, r, n, e), f && Pn(n, e, r, "beforeUpdate"), r && Ri(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? D(e.dynamicChildren, d, l, r, i, Li(n, a), o) : s || de(e, n, l, null, r, i, Li(n, a), o, !1), u > 0) {
			if (u & 16) re(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && re(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && Pi(() => {
			g && ga(g, r, n, e), f && Pn(n, e, r, "updated");
		}, i);
	}, D = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === R || !ia(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, re = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !T(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (T(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ie = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), E(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (D(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Bi(e, t, !0)) : de(e, t, n, f, i, a, s, c, l);
	}, ae = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : O(t, n, r, i, a, o, c) : se(e, t, c);
	}, O = (e, t, n, r, i, a, o) => {
		let s = e.component = ya(e, r, i);
		if (fr(e) && (s.ctx.renderer = Se), Da(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ce, o), !e.el) {
				let r = s.subTree = H(Ji);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ce(s, e, t, n, i, a, o);
	}, se = (e, t, n) => {
		let r = t.component = e.component;
		if (fi(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, le(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, ce = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Hi(e);
					if (n) {
						t && (t.el = c.el, le(e, t, o)), n.asyncDep.then(() => {
							Pi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Ri(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && oe(n), (d = t.props && t.props.onVnodeBeforeUpdate) && ga(d, s, t, c), Ri(e, !0);
				let f = li(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ye(p), e, i, a), t.el = f.el, u === null && hi(e, f.el), r && Pi(r, i), (d = t.props && t.props.onVnodeUpdated) && Pi(() => ga(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = dr(t);
				if (Ri(e, !1), l && oe(l), !m && (o = c && c.onVnodeBeforeMount) && ga(o, d, t), Ri(e, !0), s && we) {
					let t = () => {
						e.subTree = li(e), we(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = li(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Pi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Pi(() => ga(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && dr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Pi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new je(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Cn(u), Ri(e, !0), l();
	}, le = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, bi(e, t.props, r, n), Ni(e, t.children, n), Ke(), En(e), qe();
	}, de = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				pe(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				fe(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && ve(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? pe(l, d, n, r, i, a, o, s, c) : ve(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && E(d, n, r, i, a, o, s, c));
	}, fe = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? pa(t[p]) : fa(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? ve(e, a, o, !0, !1, f) : E(t, r, i, a, o, s, c, l, f);
	}, pe = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? pa(t[u]) : fa(t[u]);
			if (ia(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? pa(t[p]) : fa(t[p]);
			if (ia(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? pa(t[u]) : fa(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) he(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? pa(t[u]) : fa(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					he(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && ia(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? he(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? Vi(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Wi(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? me(n, r, p, 2) : _--);
			}
		}
	}, me = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			me(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, Se);
			return;
		}
		if (c === R) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) me(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Yi) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Gn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), Pi(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Gn];
					a._isLeaving && a[Gn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, he = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ke(), lr(s, null, n, e, !0), qe()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !dr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && ga(_, t, e), u & 6) _e(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Pn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, Se, r) : l && !l.hasOnce && (a !== R || d > 0 && d & 64) ? ve(l, t, n, !1, !0) : (a === R && d & 384 || !i && u & 16) && ve(c, t, n), r && k(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Pi(() => {
			_ && ga(_, t, e), h && Pn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, k = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === R) {
			ge(n, r);
			return;
		}
		if (t === Yi) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, ge = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, _e = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Ui(c), Ui(l), r && oe(r), i.stop(), a ? (a.flags |= 8, he(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, he(o, e, t, n)), s && Pi(s, t), Pi(() => {
			e.isUnmounted = !0;
		}, t);
	}, ve = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) he(e[o], t, n, r, i);
	}, ye = (e) => {
		if (e.shapeFlag & 6) return ye(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Un];
		return n ? h(n) : t;
	}, be = !1, xe = (e, t, n) => {
		let r;
		e == null ? t._vnode && (he(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, be ||= (be = !0, En(r), Dn(), !1);
	}, Se = {
		p: v,
		um: he,
		m: me,
		r: k,
		mt: O,
		mc: E,
		pc: de,
		pbc: D,
		n: ye,
		o: e
	}, Ce, we;
	return i && ([Ce, we] = i(Se)), {
		render: xe,
		hydrate: Ce,
		createApp: ni(xe, Ce)
	};
}
function Li({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ri({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function zi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Bi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = pa(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Bi(t, a)), a.type === qi && (a.patchFlag === -1 && (a = i[e] = pa(a)), a.el = t.el), a.type === Ji && !a.el && (a.el = t.el);
	}
}
function Vi(e) {
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
function Hi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Hi(t);
}
function Ui(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Wi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Wi(t.subTree) : null;
}
var Gi = (e) => e.__isSuspense;
function Ki(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : Tn(e);
}
var R = /* @__PURE__ */ Symbol.for("v-fgt"), qi = /* @__PURE__ */ Symbol.for("v-txt"), Ji = /* @__PURE__ */ Symbol.for("v-cmt"), Yi = /* @__PURE__ */ Symbol.for("v-stc"), Xi = [], Zi = null;
function z(e = !1) {
	Xi.push(Zi = e ? null : []);
}
function Qi() {
	Xi.pop(), Zi = Xi[Xi.length - 1] || null;
}
var $i = 1;
function ea(e, t = !1) {
	$i += e, e < 0 && Zi && t && (Zi.hasOnce = !0);
}
function ta(e) {
	return e.dynamicChildren = $i > 0 ? Zi || n : null, Qi(), $i > 0 && Zi && Zi.push(e), e;
}
function B(e, t, n, r, i, a) {
	return ta(V(e, t, n, r, i, a, !0));
}
function na(e, t, n, r, i) {
	return ta(H(e, t, n, r, i, !0));
}
function ra(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ia(e, t) {
	return e.type === t.type && e.key === t.key;
}
var aa = ({ key: e }) => e ?? null, oa = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ Jt(e) || h(e) ? {
	i: An,
	r: e,
	k: t,
	f: !!n
} : e);
function V(e, t = null, n = null, r = 0, i = null, a = e === R ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && aa(t),
		ref: t && oa(t),
		scopeId: jn,
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
		ctx: An
	};
	return s ? (ma(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), $i > 0 && !o && Zi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Zi.push(c), c;
}
var H = sa;
function sa(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === jr) && (e = Ji), ra(e)) {
		let r = la(e, t, !0);
		return n && ma(r, n), $i > 0 && !a && Zi && (r.shapeFlag & 6 ? Zi[Zi.indexOf(e)] = r : Zi.push(r)), r.patchFlag = -2, r;
	}
	if (Fa(e) && (e = e.__vccOpts), t) {
		t = ca(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = k(e)), v(n) && (/* @__PURE__ */ Wt(n) && !d(n) && (n = s({}, n)), t.style = de(n));
	}
	let o = g(e) ? 1 : Gi(e) ? 128 : Wn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return V(e, t, n, r, i, o, a, !0);
}
function ca(e) {
	return e ? /* @__PURE__ */ Wt(e) || vi(e) ? s({}, e) : e : null;
}
function la(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ha(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && aa(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(oa(t)) : [a, oa(t)] : oa(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== R ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && la(e.ssContent),
		ssFallback: e.ssFallback && la(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && ir(u, c.clone(u)), u;
}
function ua(e = " ", t = 0) {
	return H(qi, null, e, t);
}
function da(e, t) {
	let n = H(Yi, null, e);
	return n.staticCount = t, n;
}
function U(e = "", t = !1) {
	return t ? (z(), na(Ji, null, e)) : H(Ji, null, e);
}
function fa(e) {
	return e == null || typeof e == "boolean" ? H(Ji) : d(e) ? H(R, null, e.slice()) : ra(e) ? pa(e) : H(qi, null, String(e));
}
function pa(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : la(e);
}
function ma(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), ma(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !vi(t) ? t._ctx = An : r === 3 && An && (An.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			ma(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: An
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [ua(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ha(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = k([t.class, r.class]));
		else if (e === "style") t.style = de([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function ga(e, t, n, r = null) {
	dn(e, t, 7, [n, r]);
}
var _a = ei(), va = 0;
function ya(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || _a, o = {
		uid: va++,
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
		scope: new Oe(!0),
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
		propsOptions: wi(i, a),
		emitsOptions: si(i, a),
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = ai.bind(null, o), e.ce && e.ce(o), o;
}
var W = null, ba = () => W || An, xa, Sa;
{
	let e = ue(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	xa = t("__VUE_INSTANCE_SETTERS__", (e) => W = e), Sa = t("__VUE_SSR_SETTERS__", (e) => Ea = e);
}
var Ca = (e) => {
	let t = W;
	return xa(e), e.scope.on(), () => {
		e.scope.off(), xa(t);
	};
}, wa = () => {
	W && W.scope.off(), xa(null);
};
function Ta(e) {
	return e.vnode.shapeFlag & 4;
}
var Ea = !1;
function Da(e, t = !1, n = !1) {
	t && Sa(t);
	let { props: r, children: i } = e.vnode, a = Ta(e);
	yi(e, r, a, t), Mi(e, i, n || t);
	let o = a ? Oa(e, t) : void 0;
	return t && Sa(!1), o;
}
function Oa(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Lr);
	let { setup: r } = n;
	if (r) {
		Ke();
		let n = e.setupContext = r.length > 1 ? Ma(e) : null, i = Ca(e), a = un(r, e, 0, [e.props, n]), o = y(a);
		if (qe(), i(), (o || e.sp) && !dr(e) && or(e), o) {
			if (a.then(wa, wa), t) return a.then((n) => {
				Sa(!0);
				try {
					ka(e, n, t);
				} finally {
					Sa(!1);
				}
			}).catch((t) => {
				fn(t, e, 0);
			});
			e.asyncDep = a;
		} else ka(e, a, t);
	} else Aa(e, t);
}
function ka(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = en(t)), Aa(e, n);
}
function Aa(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
	{
		let t = Ca(e);
		Ke();
		try {
			Br(e);
		} finally {
			qe(), t();
		}
	}
}
var ja = { get(e, t) {
	return N(e, "get", ""), e[t];
} };
function Ma(e) {
	return {
		attrs: new Proxy(e.attrs, ja),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Na(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(en(Gt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Fr) return Fr[n](e);
		},
		has(e, t) {
			return t in e || t in Fr;
		}
	}) : e.proxy;
}
function Pa(e, t = !0) {
	return h(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Fa(e) {
	return h(e) && "__vccOpts" in e;
}
var G = (e, t) => /* @__PURE__ */ nn(e, t, Ea);
function Ia(e, t, n) {
	try {
		ea(-1);
		let r = arguments.length;
		return r === 2 ? v(t) && !d(t) ? ra(t) ? H(e, null, [t]) : H(e, t) : H(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && ra(n) && (n = [n]), H(e, t, n));
	} finally {
		ea(1);
	}
}
var La = "3.5.43", Ra = void 0, za = typeof window < "u" && window.trustedTypes;
if (za) try {
	Ra = /* @__PURE__ */ za.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Ba = Ra ? (e) => Ra.createHTML(e) : (e) => e, Va = "http://www.w3.org/2000/svg", Ha = "http://www.w3.org/1998/Math/MathML", Ua = typeof document < "u" ? document : null, Wa = Ua && /* @__PURE__ */ Ua.createElement("template"), Ga = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Ua.createElementNS(Va, e) : t === "mathml" ? Ua.createElementNS(Ha, e) : n ? Ua.createElement(e, { is: n }) : Ua.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Ua.createTextNode(e),
	createComment: (e) => Ua.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Ua.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Wa.innerHTML = Ba(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Wa.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ka = "transition", qa = "animation", Ja = /* @__PURE__ */ Symbol("_vtc"), Ya = {
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
}, Xa = /* @__PURE__ */ s({}, Yn, Ya), Za = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = Xa, e))((e, { slots: t }) => Ia($n, eo(e), t)), Qa = (e, t = []) => {
	d(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, $a = (e) => e ? d(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function eo(e) {
	let t = {};
	for (let n in e) n in Ya || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: c = `${n}-enter-to`, appearFromClass: l = a, appearActiveClass: u = o, appearToClass: d = c, leaveFromClass: f = `${n}-leave-from`, leaveActiveClass: p = `${n}-leave-active`, leaveToClass: m = `${n}-leave-to` } = e, h = to(i), g = h && h[0], _ = h && h[1], { onBeforeEnter: v, onEnter: y, onEnterCancelled: b, onLeave: x, onLeaveCancelled: S, onBeforeAppear: C = v, onAppear: w = y, onAppearCancelled: T = b } = t, ee = (e, t, n, r) => {
		e._enterCancelled = r, io(e, t ? d : c), io(e, t ? u : o), n && n();
	}, te = (e, t) => {
		e._isLeaving = !1, io(e, f), io(e, m), io(e, p), t && t();
	}, E = (e) => (t, n) => {
		let i = e ? w : y, o = () => ee(t, e, n);
		Qa(i, [t, o]), ao(() => {
			io(t, e ? l : a), ro(t, e ? d : c), $a(i) || so(t, r, g, o);
		});
	};
	return s(t, {
		onBeforeEnter(e) {
			Qa(v, [e]), ro(e, a), ro(e, o);
		},
		onBeforeAppear(e) {
			Qa(C, [e]), ro(e, l), ro(e, u);
		},
		onEnter: E(!1),
		onAppear: E(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => te(e, t);
			ro(e, f), e._enterCancelled ? (ro(e, p), fo(e)) : (fo(e), ro(e, p)), ao(() => {
				e._isLeaving && (io(e, f), ro(e, m), $a(x) || so(e, r, _, n));
			}), Qa(x, [e, n]);
		},
		onEnterCancelled(e) {
			ee(e, !1, void 0, !0), Qa(b, [e]);
		},
		onAppearCancelled(e) {
			ee(e, !0, void 0, !0), Qa(T, [e]);
		},
		onLeaveCancelled(e) {
			te(e), Qa(S, [e]);
		}
	});
}
function to(e) {
	if (e == null) return null;
	if (v(e)) return [no(e.enter), no(e.leave)];
	{
		let t = no(e);
		return [t, t];
	}
}
function no(e) {
	return ce(e);
}
function ro(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[Ja] || (e[Ja] = /* @__PURE__ */ new Set())).add(t);
}
function io(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[Ja];
	n && (n.delete(t), n.size || (e[Ja] = void 0));
}
function ao(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var oo = 0;
function so(e, t, n, r) {
	let i = e._endId = ++oo, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = co(e, t);
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
function co(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${Ka}Delay`), a = r(`${Ka}Duration`), o = lo(i, a), s = r(`${qa}Delay`), c = r(`${qa}Duration`), l = lo(s, c), u = null, d = 0, f = 0;
	t === Ka ? o > 0 && (u = Ka, d = o, f = a.length) : t === qa ? l > 0 && (u = qa, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? Ka : qa : null, f = u ? u === Ka ? a.length : c.length : 0);
	let p = u === Ka && /\b(?:transform|all)(?:,|$)/.test(r(`${Ka}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function lo(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => uo(t) + uo(e[n])));
}
function uo(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function fo(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function po(e, t, n) {
	let r = e[Ja];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var mo = /* @__PURE__ */ Symbol("_vod"), ho = /* @__PURE__ */ Symbol("_vsh"), go = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[mo] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : _o(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), _o(e, !0), r.enter(e)) : r.leave(e, () => {
			_o(e, !1);
		}) : _o(e, t));
	},
	beforeUnmount(e, { value: t }) {
		_o(e, t);
	}
};
function _o(e, t) {
	e.style.display = t ? e[mo] : "none", e[ho] = !t;
}
var vo = /* @__PURE__ */ Symbol(""), yo = /(?:^|;)\s*display\s*:/;
function bo(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? So(r, t, "");
			}
			else for (let e in t) n[e] ?? So(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? So(r, i, "") : Eo(e, i, !g(t) && t ? t[i] : void 0, o) || So(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[vo];
			e && (n += ";" + e), r.cssText = n, a = yo.test(n);
		}
	} else t && e.removeAttribute("style");
	mo in e && (e[mo] = a ? r.display : "", e[ho] && (r.display = "none"));
}
var xo = /\s*!important$/;
function So(e, t, n) {
	if (d(n)) n.forEach((n) => So(e, t, n));
	else if (n ??= "", t.startsWith("--")) xo.test(n) ? e.setProperty(t, n.replace(xo, ""), "important") : e.setProperty(t, n);
	else {
		let r = To(e, t);
		xo.test(n) ? e.setProperty(D(r), n.replace(xo, ""), "important") : e[r] = n;
	}
}
var Co = [
	"Webkit",
	"Moz",
	"ms"
], wo = {};
function To(e, t) {
	let n = wo[t];
	if (n) return n;
	let r = E(t);
	if (r !== "filter" && r in e) return wo[t] = r;
	r = re(r);
	for (let n = 0; n < Co.length; n++) {
		let i = Co[n] + r;
		if (i in e) return wo[t] = i;
	}
	return t;
}
function Eo(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var Do = "http://www.w3.org/1999/xlink";
function Oo(e, t, n, r, i, a = _e(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Do, t.slice(6, t.length)) : e.setAttributeNS(Do, t, n) : n == null || a && !ve(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function ko(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ba(n) : n);
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
		r === "boolean" ? n = ve(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Ao(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function jo(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Mo = /* @__PURE__ */ Symbol("_vei");
function No(e, t, n, r, i = null) {
	let a = e[Mo] || (e[Mo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Io(t);
		r ? Ao(e, n, a[t] = Bo(r, i), s) : o && (jo(e, n, o, s), a[t] = void 0);
	}
}
var Po = /(Once|Passive|Capture)$/, Fo = /^on:?(?:Once|Passive|Capture)$/;
function Io(e) {
	let t, n;
	for (; (n = e.match(Po)) && !Fo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : D(e.slice(2)), t];
}
var Lo = 0, Ro = /* @__PURE__ */ Promise.resolve(), zo = () => Lo ||= (Ro.then(() => Lo = 0), Date.now());
function Bo(e, t) {
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
				e && dn(e, t, 5, a);
			}
		} else dn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = zo(), n;
}
var Vo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Ho = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? po(e, r, c) : t === "style" ? bo(e, n, r) : a(t) ? o(t) || No(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Uo(e, t, r, c)) ? (ko(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Oo(e, t, r, c, s, t !== "value")) : e._isVueCE && (Wo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? ko(e, E(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Oo(e, t, r, c));
};
function Uo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Vo(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Vo(t) && g(n) ? !1 : t in e;
}
function Wo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = E(t);
	return Array.isArray(n) ? n.some((e) => E(e) === r) : Object.keys(n).some((e) => E(e) === r);
}
var Go = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => oe(t, e) : t;
};
function Ko(e) {
	e.target.composing = !0;
}
function qo(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Jo = /* @__PURE__ */ Symbol("_assign"), Yo = /* @__PURE__ */ Symbol("_initialValue");
function Xo(e, t, n) {
	return t && (e = e.trim()), n && (e = se(e)), e;
}
var K = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Yo] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Yo] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Jo] = Go(i);
		let a = r || i.props && i.props.type === "number";
		Ao(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Jo](Xo(e.value, n, a));
		}), (n || a) && Ao(e, "change", () => {
			e.value = Xo(e.value, n, a);
		}), t || (Ao(e, "compositionstart", Ko), Ao(e, "compositionend", qo), Ao(e, "change", qo));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Yo];
		delete e[Yo], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Jo](Xo(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Jo] = Go(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? se(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Zo = {
	deep: !0,
	created(e, t, n) {
		e[Jo] = Go(n), Ao(e, "change", () => {
			let t = e._modelValue, n = rs(e), r = e.checked, i = e[Jo];
			if (d(t)) {
				let e = we(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (p(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(is(e, r));
		});
	},
	mounted: Qo,
	beforeUpdate(e, t, n) {
		e[Jo] = Go(n), Qo(e, t, n);
	}
};
function Qo(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (d(t)) i = we(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Ce(t, is(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var $o = {
	created(e, { value: t }, n) {
		e.checked = Ce(t, n.props.value), e[Jo] = Go(n), Ao(e, "change", () => {
			e[Jo](rs(e));
		});
	},
	beforeUpdate(e, { value: t, oldValue: n }, r) {
		e[Jo] = Go(r), t !== n && (e.checked = Ce(t, r.props.value));
	}
}, es = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Ao(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? se(rs(e)) : rs(e)), r = e.multiple, i = r ? p(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? d(i) ? t.slice() : t : i];
			try {
				e[Jo](i);
			} finally {
				xn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Jo] = Go(r);
	},
	mounted(e, { value: t }) {
		ns(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Jo] = Go(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !ts(t, n[1], n[0])) && ns(e, t);
	}
};
function ts(e, t, n) {
	if (!n || d(e)) return Ce(e, t);
	if (p(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function ns(e, t) {
	let n = e.multiple, r = d(t);
	if (!n || r || p(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = rs(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : we(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (Ce(rs(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function rs(e) {
	return "_value" in e ? e._value : e.value;
}
function is(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var as = {
	created(e, t, n) {
		ss(e, t, n, null, "created");
	},
	mounted(e, t, n) {
		ss(e, t, n, null, "mounted");
	},
	beforeUpdate(e, t, n, r) {
		ss(e, t, n, r, "beforeUpdate");
	},
	updated(e, t, n, r) {
		ss(e, t, n, r, "updated");
	}
};
function os(e, t) {
	switch (e) {
		case "SELECT": return es;
		case "TEXTAREA": return K;
		default: switch (t) {
			case "checkbox": return Zo;
			case "radio": return $o;
			default: return K;
		}
	}
}
function ss(e, t, n, r, i) {
	let a = os(e.tagName, n.props && n.props.type)[i];
	a && a(e, t, n, r);
}
var cs = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], ls = {
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
	exact: (e, t) => cs.some((n) => e[`${n}Key`] && !t.includes(n))
}, us = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = ls[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, ds = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, fs = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = D(n.key);
		if (t.some((e) => e === r || ds[e] === r)) return e(n);
	}));
}, ps = /* @__PURE__ */ s({ patchProp: Ho }, Ga), ms;
function hs() {
	return ms ||= Fi(ps);
}
var gs = ((...e) => {
	let t = hs().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = vs(e);
		if (!r) return;
		let i = t._component;
		!h(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, _s(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function _s(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function vs(e) {
	return g(e) ? document.querySelector(e) : e;
}
//#endregion
//#region \0plugin-vue:export-helper
var q = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, ys = {
	key: 0,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, bs = {
	key: 1,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, xs = {
	key: 2,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Ss = {
	key: 3,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Cs = {
	key: 4,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, ws = {
	key: 5,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Ts = {
	key: 6,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Es = {
	key: 7,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Ds = {
	key: 8,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Os = {
	key: 9,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, ks = {
	key: 10,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, As = {
	key: 11,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, js = {
	key: 12,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Ms = {
	key: 13,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Ns = {
	key: 14,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Ps = {
	key: 15,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Fs = {
	key: 16,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	class: "xy-icon"
}, J = /*#__PURE__*/ q({
	__name: "Icons",
	props: { name: {
		type: String,
		required: !0
	} },
	setup(e) {
		return (t, n) => e.name === "swords" ? (z(), B("svg", ys, [...n[0] ||= [da("<polyline points=\"14.5 17.5 3 6 3 3 6 3 17.5 14.5\" data-v-7df92507></polyline><line x1=\"13\" y1=\"19\" x2=\"19\" y2=\"13\" data-v-7df92507></line><line x1=\"16\" y1=\"16\" x2=\"20\" y2=\"20\" data-v-7df92507></line><line x1=\"19\" y1=\"21\" x2=\"21\" y2=\"19\" data-v-7df92507></line><polyline points=\"14.5 6.5 18 3 21 3 21 6 17.5 9.5\" data-v-7df92507></polyline><line x1=\"5\" y1=\"14\" x2=\"9\" y2=\"18\" data-v-7df92507></line><line x1=\"7\" y1=\"17\" x2=\"4\" y2=\"20\" data-v-7df92507></line><line x1=\"3\" y1=\"19\" x2=\"5\" y2=\"21\" data-v-7df92507></line>", 8)]])) : e.name === "settings" ? (z(), B("svg", bs, [...n[1] ||= [V("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		}, null, -1), V("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" }, null, -1)]])) : e.name === "scroll" ? (z(), B("svg", xs, [...n[2] ||= [V("path", { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" }, null, -1)]])) : e.name === "search" ? (z(), B("svg", Ss, [...n[3] ||= [V("circle", {
			cx: "11",
			cy: "11",
			r: "8"
		}, null, -1), V("line", {
			x1: "21",
			y1: "21",
			x2: "16.65",
			y2: "16.65"
		}, null, -1)]])) : e.name === "close" ? (z(), B("svg", Cs, [...n[4] ||= [V("line", {
			x1: "18",
			y1: "6",
			x2: "6",
			y2: "18"
		}, null, -1), V("line", {
			x1: "6",
			y1: "6",
			x2: "18",
			y2: "18"
		}, null, -1)]])) : e.name === "play" ? (z(), B("svg", ws, [...n[5] ||= [V("polygon", { points: "5 3 19 12 5 21 5 3" }, null, -1)]])) : e.name === "next" ? (z(), B("svg", Ts, [...n[6] ||= [V("polygon", { points: "5 4 15 12 5 20 5 4" }, null, -1), V("line", {
			x1: "19",
			y1: "5",
			x2: "19",
			y2: "19"
		}, null, -1)]])) : e.name === "stop" ? (z(), B("svg", Es, [...n[7] ||= [V("rect", {
			x: "4",
			y: "4",
			width: "16",
			height: "16",
			rx: "2"
		}, null, -1)]])) : e.name === "refresh" ? (z(), B("svg", Ds, [...n[8] ||= [V("polyline", { points: "23 4 23 10 17 10" }, null, -1), V("path", { d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10" }, null, -1)]])) : e.name === "send" ? (z(), B("svg", Os, [...n[9] ||= [V("line", {
			x1: "22",
			y1: "2",
			x2: "11",
			y2: "13"
		}, null, -1), V("polygon", { points: "22 2 15 22 11 13 2 9 22 2" }, null, -1)]])) : e.name === "lock" ? (z(), B("svg", ks, [...n[10] ||= [V("rect", {
			x: "3",
			y: "11",
			width: "18",
			height: "11",
			rx: "2",
			ry: "2"
		}, null, -1), V("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }, null, -1)]])) : e.name === "sparkles" ? (z(), B("svg", As, [...n[11] ||= [V("path", { d: "m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" }, null, -1)]])) : e.name === "copy" ? (z(), B("svg", js, [...n[12] ||= [V("rect", {
			width: "14",
			height: "14",
			x: "8",
			y: "8",
			rx: "2",
			ry: "2"
		}, null, -1), V("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }, null, -1)]])) : e.name === "check" ? (z(), B("svg", Ms, [...n[13] ||= [V("polyline", { points: "20 6 9 17 4 12" }, null, -1)]])) : e.name === "eye" ? (z(), B("svg", Ns, [...n[14] ||= [V("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }, null, -1), V("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		}, null, -1)]])) : e.name === "eye-off" ? (z(), B("svg", Ps, [...n[15] ||= [V("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }, null, -1), V("line", {
			x1: "1",
			y1: "1",
			x2: "23",
			y2: "23"
		}, null, -1)]])) : (z(), B("svg", Fs, [...n[16] ||= [V("circle", {
			cx: "12",
			cy: "12",
			r: "10"
		}, null, -1)]]));
	}
}, [["__scopeId", "data-v-7df92507"]]), Is = { class: "xy-header" }, Ls = { class: "xy-header-left" }, Rs = { class: "xy-header-titles" }, zs = { class: "xy-kicker" }, Bs = ["title"], Vs = { class: "xy-title" }, Hs = { class: "xy-title-text" }, Us = {
	key: 0,
	class: "xy-round-seal"
}, Ws = { class: "xy-subtitle" }, Gs = { class: "xy-nav-tabs" }, Ks = ["onClick"], qs = {
	key: 0,
	class: "xy-tab-badge"
}, Js = { class: "xy-header-right" }, Ys = { class: "xy-phase-name" }, Xs = { class: "xy-meta-tag" }, Zs = { class: "xy-meta-mode" }, Qs = { class: "xy-meta-ver" }, $s = /*#__PURE__*/ q({
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
				id: "library",
				label: "内容库",
				icon: "book-open"
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
		}, i = G(() => r[t.phase] || t.phase), a = G(() => ({
			http: "真实模型",
			mock: "离线演示",
			main_story: "主剧情桥接",
			packet: "场景包",
			unconfigured: "未配模型"
		})[t.adjudicatorMode] || t.adjudicatorMode), o = G(() => {
			let e = t.semanticState.压制 || t.semanticState.control || "";
			return e.includes("主角") || e.includes("胜") ? "tone-player" : e.includes("敌") || e.includes("劣") ? "tone-enemy" : "tone-neutral";
		});
		return (t, r) => (z(), B("header", Is, [
			V("div", Ls, [r[7] ||= V("div", { class: "xy-brand-seal" }, [V("span", { class: "xy-seal-symbol" }, "弦")], -1), V("div", Rs, [
				V("div", zs, [
					r[1] ||= V("span", null, "XY BATTLE SYSTEM", -1),
					r[2] ||= V("span", { class: "xy-kicker-dot" }, "·", -1),
					r[3] ||= V("span", null, "叠浪玄潮决", -1),
					r[4] ||= V("span", { class: "xy-kicker-dot" }, "·", -1),
					V("span", {
						class: "xy-scope-pill",
						title: "作用域: " + e.scope.chatId + " / " + e.scope.branchId
					}, A(e.scope.chatId) + " / " + A(e.scope.branchId), 9, Bs)
				]),
				V("h1", Vs, [V("span", Hs, A(e.scene.location || "待定战场"), 1), e.round > 0 ? (z(), B("span", Us, "第 " + A(e.round) + " 回合", 1)) : U("", !0)]),
				V("p", Ws, [
					V("span", null, A(e.scene.time || "时辰未定"), 1),
					r[5] ||= V("span", { class: "xy-sep" }, "|", -1),
					V("span", null, A(e.scene.initiative || "均势先发"), 1),
					r[6] ||= V("span", { class: "xy-sep" }, "|", -1),
					V("span", { class: k(["xy-control-state", o.value]) }, A(e.semanticState.压制 || e.semanticState.control || "均势"), 3)
				])
			])]),
			V("nav", Gs, [(z(), B(R, null, L(n, (n) => V("button", {
				key: n.id,
				class: k(["xy-tab-btn", { active: e.currentTab === n.id }]),
				onClick: (e) => t.$emit("update:tab", n.id)
			}, [
				H(J, {
					name: n.icon,
					class: "xy-tab-icon"
				}, null, 8, ["name"]),
				V("span", null, A(n.label), 1),
				n.id === "developer" && e.logCount > 0 ? (z(), B("span", qs, A(e.logCount), 1)) : U("", !0)
			], 10, Ks)), 64))]),
			V("div", Js, [
				V("div", { class: k(["xy-phase-indicator", "phase-" + e.phase]) }, [r[8] ||= V("span", { class: "xy-phase-pulse" }, null, -1), V("span", Ys, A(i.value), 1)], 2),
				V("div", Xs, [V("span", Zs, A(a.value), 1), V("span", Qs, "v" + A(e.version), 1)]),
				V("button", {
					class: "xy-close-btn",
					onClick: r[0] ||= (e) => t.$emit("close"),
					"aria-label": "关闭工作台",
					title: "关闭 (Esc)"
				}, [H(J, { name: "close" })])
			])
		]));
	}
}, [["__scopeId", "data-v-a4513581"]]), ec = {
	class: "xy-atmosphere",
	"aria-hidden": "true"
}, tc = /*#__PURE__*/ q({
	__name: "AtmosphereBackground",
	setup(e) {
		return (e, t) => (z(), B("div", ec, [...t[0] ||= [da("<div class=\"xy-water-mist\" data-v-03bd5794></div><svg class=\"xy-string-canvas\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\" viewBox=\"0 0 1440 800\" data-v-03bd5794><defs data-v-03bd5794><linearGradient id=\"stringGrad1\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\" data-v-03bd5794><stop offset=\"0%\" stop-color=\"#38bdf8\" stop-opacity=\"0.02\" data-v-03bd5794></stop><stop offset=\"35%\" stop-color=\"#38bdf8\" stop-opacity=\"0.25\" data-v-03bd5794></stop><stop offset=\"65%\" stop-color=\"#2dd4bf\" stop-opacity=\"0.2\" data-v-03bd5794></stop><stop offset=\"100%\" stop-color=\"#38bdf8\" stop-opacity=\"0.02\" data-v-03bd5794></stop></linearGradient><linearGradient id=\"stringGrad2\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\" data-v-03bd5794><stop offset=\"0%\" stop-color=\"#fbbf24\" stop-opacity=\"0\" data-v-03bd5794></stop><stop offset=\"50%\" stop-color=\"#fbbf24\" stop-opacity=\"0.18\" data-v-03bd5794></stop><stop offset=\"100%\" stop-color=\"#fbbf24\" stop-opacity=\"0\" data-v-03bd5794></stop></linearGradient><linearGradient id=\"vortexGrad\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\" data-v-03bd5794><stop offset=\"0%\" stop-color=\"#38bdf8\" stop-opacity=\"0.12\" data-v-03bd5794></stop><stop offset=\"100%\" stop-color=\"#07101e\" stop-opacity=\"0\" data-v-03bd5794></stop></linearGradient></defs><path class=\"xy-chord-line chord-1\" d=\"M 0 320 Q 360 280 720 320 T 1440 320\" fill=\"none\" stroke=\"url(#stringGrad1)\" stroke-width=\"1.2\" data-v-03bd5794></path><path class=\"xy-chord-line chord-2\" d=\"M 0 460 Q 400 500 720 460 T 1440 460\" fill=\"none\" stroke=\"url(#stringGrad1)\" stroke-width=\"1\" data-v-03bd5794></path><path class=\"xy-chord-line chord-3\" d=\"M 0 390 Q 380 430 720 390 T 1440 390\" fill=\"none\" stroke=\"url(#stringGrad2)\" stroke-width=\"0.9\" data-v-03bd5794></path><ellipse cx=\"720\" cy=\"400\" rx=\"340\" ry=\"110\" fill=\"none\" stroke=\"url(#vortexGrad)\" stroke-width=\"1.5\" stroke-dasharray=\"6 8\" class=\"xy-vortex-ring\" data-v-03bd5794></ellipse><ellipse cx=\"720\" cy=\"400\" rx=\"200\" ry=\"65\" fill=\"none\" stroke=\"rgba(56, 189, 248, 0.08)\" stroke-width=\"1\" data-v-03bd5794></ellipse><ellipse cx=\"720\" cy=\"400\" rx=\"80\" ry=\"26\" fill=\"rgba(56, 189, 248, 0.03)\" stroke=\"rgba(251, 191, 36, 0.15)\" stroke-width=\"1\" data-v-03bd5794></ellipse></svg><div class=\"xy-particles\" data-v-03bd5794><span class=\"xy-sparkle s1\" data-v-03bd5794></span><span class=\"xy-sparkle s2\" data-v-03bd5794></span><span class=\"xy-sparkle s3\" data-v-03bd5794></span><span class=\"xy-sparkle s4\" data-v-03bd5794></span><span class=\"xy-sparkle s5\" data-v-03bd5794></span></div>", 3)]]));
	}
}, [["__scopeId", "data-v-03bd5794"]]), Y = (e) => e === void 0 ? void 0 : JSON.parse(JSON.stringify(e));
function nc(e) {
	let t = String(e || "").trim().replace(/\/+$/, "");
	return !t || /\/chat\/completions$/i.test(t) ? t : /\/v1$/i.test(t) ? `${t}/chat/completions` : t;
}
function rc(e) {
	return Array.isArray(e) ? `[${e.map(rc).join(",")}]` : e && typeof e == "object" ? `{${Object.keys(e).sort().map((t) => `${JSON.stringify(t)}:${rc(e[t])}`).join(",")}}` : JSON.stringify(e);
}
function ic(e) {
	if (e?.aborted) throw new DOMException("操作已停止或聊天作用域已变化", "AbortError");
}
function X(e, t = []) {
	return typeof e == "string" ? t.filter(Boolean).reduce((e, t) => e.split(t).join("[REDACTED]"), e) : Array.isArray(e) ? e.map((e) => X(e, t)) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).filter(([e]) => !/^(api[-_]?key|authorization|access[-_]?token|password|credential|secret)$/i.test(e)).map(([e, n]) => [e, X(n, t)]));
}
function ac(e) {
	return X({
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
//#region src/combat-profile.js
var oc = "battle_combat_profile_v2", sc = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : {}, Z = (e) => typeof e == "string" ? e.trim() : "", cc = (e) => Array.isArray(e) ? e : typeof e == "string" && e.trim() ? [e] : [], lc = (e) => cc(e).filter((e) => typeof e == "string" && e.trim()), uc = (...e) => e.find((e) => e != null && e !== ""), dc = (e, t) => [
	"public",
	"player",
	"internal",
	"gm"
].includes(e) ? e : t;
function fc(e = {}) {
	if (typeof e == "string") return e ? { description: e } : {};
	let t = {};
	for (let [n, r] of Object.entries({
		identity: ["identity", "身份"],
		cultivationRealm: [
			"cultivationRealm",
			"realm",
			"境界",
			"修为"
		],
		currentState: ["currentState", "当前状态"],
		stance: ["stance", "姿态"],
		position: ["position", "站位"],
		weapon: ["weapon", "武器"],
		appearance: ["appearance", "外貌"],
		aura: ["aura", "气息"],
		environmentalEffect: ["environmentalEffect", "环境影响"],
		description: [
			"description",
			"说明",
			"公开表现"
		]
	})) {
		let i = uc(...r.map((t) => e[t]));
		typeof i == "string" || typeof i == "number" ? t[n] = i : n === "weapon" && i && typeof i == "object" && (t.weapon = [
			Z(i.name || i.名称),
			Z(i.state || i.状态),
			i.drawn === !1 ? "未出鞘" : "",
			Z(i.grip),
			Z(i.observableState)
		].filter(Boolean).join("；"));
	}
	return t;
}
function pc(e = {}, { id: t, side: n = "enemy" } = {}) {
	let r = sc(e.candidate || e.profile || e.fields || e), i = fc(r.visibleInfo || r.可见情报 || {}), a = sc(r.generated), o = r.resourceDefinitions || r.resourceModel || a.battleResourceModel || r.resources || [], s = (Array.isArray(o) ? o : Object.entries(sc(o)).map(([e, t]) => ({
		key: e,
		...typeof t == "number" ? { current: t } : sc(t)
	}))).map(sc).map((e, t) => ({
		key: Z(e.key || e.resource || e.id) || `resource-${t + 1}`,
		name: Z(e.name || e.label || e.名称 || e.key),
		current: uc(e.current, e.value, r.resources?.[e.key]) ?? null,
		min: uc(e.min, 0),
		max: uc(e.max, e.maximum, e.capacity) ?? null,
		definition: Z(e.definition || e.description),
		recovery: Z(e.recovery || e.regeneration),
		visibility: dc(e.visibility, n === "player" ? "player" : "internal")
	})), c = cc(r.techniques || r.skills || r.招式).map(sc).map((e) => ({
		name: Z(e.name || e.名称),
		school: Z(e.school || e.martialArt || e.所属功法),
		category: Z(e.category || e.type),
		originalDefinition: Z(e.originalDefinition || e.definition || e.description),
		mechanics: lc(e.mechanics),
		cost: Z(e.cost),
		range: Z(e.range),
		cooldown: Z(e.cooldown),
		counterplay: Z(e.counterplay || e.interruptConditions || e.破解方式),
		availability: {
			default: [
				"available",
				"conditional",
				"unavailable"
			].includes(e.availability?.default) ? e.availability.default : "available",
			conditions: lc(e.availability?.conditions),
			requires: cc(e.availability?.requires),
			description: Z(e.availability?.description || e.requirements)
		},
		triggeredState: lc(e.triggeredState),
		visibility: dc(e.visibility, n === "player" ? "player" : "internal")
	})), l = typeof r.behavior == "string" ? { preference: r.behavior } : sc(r.behavior);
	return {
		profileSchema: oc,
		id: t || Z(r.id),
		name: Z(r.name || r.姓名),
		identity: Z(r.identity || r.身份 || i.identity),
		cultivationRealm: Z(r.cultivationRealm || r.realm || r.境界 || i.cultivationRealm),
		combatStyle: Z(r.combatStyle || r.战斗方式),
		currentState: Z(r.currentState || r.当前状态 || i.currentState),
		visibleInfo: i,
		martialArts: cc(r.martialArts || r.功法).map(sc).map((e) => ({
			name: Z(e.name || e.名称),
			rank: Z(e.rank || e.品阶),
			description: Z(e.description || e.originalDefinition || e.definition),
			principle: Z(e.principle || e.corePrinciple)
		})),
		techniques: c,
		resourceDefinitions: s,
		resources: Object.fromEntries(s.filter((e) => Number.isFinite(e.current)).map((e) => [e.key, e.current])),
		behavior: {
			preference: Z(l.preference || l.preferredRange || l.style),
			opening: Z(l.opening || l.openingMove),
			tactics: lc(l.tactics || l.priorities),
			retreat: Z(l.retreat || l.retreatConditions)
		},
		weaknesses: lc(r.weaknesses || r.弱点),
		hidden: Y(sc(r.hidden))
	};
}
var mc = /^(?:未知|不明|待定|待补充|未提供|待裁定|unknown|tbd|player|主角|演示主角)$/i, hc = (e) => !!Z(e) && !mc.test(e);
function gc(e) {
	let t = [];
	for (let [n, r] of Object.entries({
		name: "姓名",
		identity: "身份",
		cultivationRealm: "修为境界",
		combatStyle: "战斗方式",
		currentState: "当前状态"
	})) hc(e[n]) || t.push(`请补全${r}`);
	(!hc(e.behavior?.preference) || !hc(e.behavior?.opening) || !e.behavior?.tactics?.length) && t.push("请补全战斗偏好、起手和战术"), e.martialArts?.length || t.push("至少需要一门有完整设定的功法");
	for (let n of e.martialArts || []) (!hc(n.name) || !hc(n.description) || !hc(n.principle)) && t.push(`${n.name || "功法"}缺少名称、完整设定或核心原理`);
	e.techniques?.length || t.push("至少需要一项有完整设定的招式");
	for (let n of e.techniques || []) {
		let r = Object.entries({
			name: "名称",
			school: "所属功法",
			originalDefinition: "完整定义",
			cost: "消耗",
			range: "范围",
			cooldown: "冷却",
			counterplay: "应对与打断方式"
		}).filter(([e]) => !hc(n[e])).map(([, e]) => e);
		n.mechanics?.length || r.push("作用机制"), hc(n.availability?.description) || r.push("使用条件"), r.length && t.push(`${n.name || "招式"}缺少${r.join("、")}`), n.availability?.default === "conditional" && !n.availability.requires?.length && t.push(`${n.name || "招式"}缺少可检查的解锁条件；普通消耗限制请写在使用条件中并设为可用`), n.availability?.requires?.some((e) => !hc(e?.path) || ![
			"includes",
			"truthy",
			"equals",
			"not"
		].includes(e?.op)) && t.push(`${n.name || "招式"}的解锁条件无效`), (e.martialArts || []).some((e) => e.name === n.school) || t.push(`${n.name || "招式"}的所属功法未定义`);
	}
	e.resourceDefinitions?.length || t.push("请定义至少一种战斗资源及其边界");
	let n = /* @__PURE__ */ new Set();
	for (let r of e.resourceDefinitions || []) (!hc(r.name) || !hc(r.definition) || !Number.isFinite(r.current) || !Number.isFinite(r.min) || !Number.isFinite(r.max) || r.current < r.min || r.current > r.max || r.min > r.max || n.has(r.key)) && t.push(`${r.name || "资源"}的名称、定义、当前值或边界无效`), n.add(r.key);
	return e.weaknesses?.length || t.push("请补全战斗弱点与限制"), [...new Set(t)];
}
function _c(e, t) {
	let n = pc(e, {
		id: e.id,
		side: t
	}), r = gc(n);
	if (r.length) throw Error(`${n.name || "人物"}资料不完整：${r.join("；")}`);
	let i = `combat-profile.${encodeURIComponent(n.id)}`, a = n.techniques.map((e, t) => ({
		...e,
		id: `${i}.move-${t + 1}`,
		ruleRefs: [`${i}.move-${t + 1}.definition`]
	})), o = {
		id: i,
		name: `${n.name}·战斗功法`,
		rank: n.cultivationRealm,
		element: "人物已确认设定",
		corePrinciple: n.martialArts.map((e) => `${e.name}：${e.description}；${e.principle}`).join("\n"),
		mechanics: [n.combatStyle],
		techniques: a,
		synergies: [],
		narrativeGuidance: [],
		ruleRefs: [`${i}.profile`],
		version: "1",
		visibility: t === "player" ? "player" : "internal",
		characterProfileId: n.id
	}, s = n.resourceDefinitions.map((e) => ({
		actorId: n.id,
		resource: e.key,
		min: e.min,
		max: e.max,
		name: e.name,
		definition: e.definition,
		recovery: e.recovery,
		visibility: e.visibility,
		ruleRefs: [`${i}.resource.${encodeURIComponent(e.key)}`]
	})), c = {
		...n,
		techniques: t === "player" ? [{
			registryId: i,
			techniqueIds: a.map((e) => e.id)
		}] : a
	};
	return c.visibleInfo = {
		...n.visibleInfo,
		identity: n.identity,
		cultivationRealm: n.cultivationRealm,
		currentState: n.currentState
	}, {
		actor: c,
		entry: o,
		resourceRules: s
	};
}
function vc(e) {
	let t = fc(e.visibleInfo || {}), n = (e.techniques || []).filter((e) => ["public", "player"].includes(e.visibility));
	if (n.length) t.techniques = Y(n);
	else for (let n of [
		"observedTechniques",
		"observedAbilities",
		"可观察招式"
	]) e.visibleInfo?.[n] && (t[n] = Y(e.visibleInfo[n]));
	return {
		id: e.id,
		name: e.name,
		visibleInfo: t
	};
}
//#endregion
//#region src/character-presentation.js
var yc = Object.fromEntries(Object.entries({
	id: "内部编号",
	name: "名称",
	identity: "身份",
	cultivationRealm: "修为境界",
	cultivation: "修为",
	realm: "境界",
	currentState: "当前状态",
	combatStyle: "战斗方式",
	weapon: "武器",
	weapons: "武器",
	stance: "姿态",
	position: "站位",
	visibleInfo: "可见情报",
	resources: "灵力与资源",
	techniques: "功法与招式",
	abilities: "能力",
	skills: "技能",
	behavior: "行动倾向",
	weaknesses: "弱点",
	observed: "已观察情报",
	generated: "构造补充",
	hidden: "裁定专用资料",
	originalDefinition: "完整定义",
	mechanics: "作用机制",
	cost: "施术消耗",
	costs: "施术消耗",
	availability: "使用条件",
	visibility: "可见范围",
	ruleRefs: "规则依据",
	category: "类型",
	effects: "效果",
	effect: "效果",
	notes: "备注",
	description: "说明",
	type: "类型",
	value: "数值",
	status: "状态",
	default: "默认状态",
	conditions: "条件",
	condition: "条件",
	trigger: "触发条件",
	triggers: "触发条件",
	duration: "持续时间",
	cooldown: "冷却",
	cooldowns: "冷却限制",
	remainingRounds: "剩余回合",
	rounds: "回合数",
	range: "作用范围",
	target: "目标",
	targets: "目标",
	limitation: "限制",
	limitations: "限制",
	counters: "应对方式",
	risks: "风险",
	risk: "风险",
	confidence: "可信程度",
	evidence: "依据",
	source: "来源",
	health: "生命",
	hp: "生命",
	qi: "真气",
	mana: "灵力",
	stamina: "体力",
	spiritualPower: "灵力",
	current: "当前值",
	max: "上限",
	min: "下限",
	capacity: "容量",
	amount: "数量",
	unit: "单位",
	recovery: "恢复方式",
	regeneration: "恢复",
	reservePlan: "后备计划",
	intent: "意图",
	intentSummary: "意图概述",
	tactics: "战术",
	strategy: "策略",
	personality: "性格",
	opening: "起手",
	openingMove: "起手招式",
	priorities: "行动优先顺序",
	preferredRange: "偏好距离",
	retreatCondition: "撤退条件",
	retreatConditions: "撤退条件",
	surrenderConditions: "投降条件",
	goals: "目标",
	motivation: "动机",
	confirmationStatus: "资料确认状态",
	battleStateEffect: "对战局的影响",
	missingFields: "待补充资料",
	uncertainties: "待核实事项",
	assumptions: "构造假设",
	equipment: "装备",
	artifacts: "法宝",
	level: "层级",
	rank: "品阶",
	title: "称谓",
	faction: "所属势力",
	appearance: "外貌",
	background: "背景",
	injuries: "伤势",
	buffs: "增益",
	debuffs: "负面状态",
	resistances: "抗性",
	damage: "伤害",
	defense: "防御",
	attack: "攻击",
	speed: "速度",
	accuracy: "命中",
	power: "威力",
	strength: "强度",
	requirements: "施展要求",
	prerequisites: "前置条件",
	interruptConditions: "打断条件",
	interruption: "打断方式",
	public: "公开",
	private: "不公开",
	secret: "隐秘",
	enabled: "启用",
	reason: "原因",
	summary: "概述",
	martialArts: "功法",
	school: "所属功法",
	principle: "核心原理",
	definition: "规则定义",
	resourceDefinitions: "战斗资源",
	preference: "战斗偏好",
	retreat: "撤退条件",
	counterplay: "应对与打断",
	triggeredState: "触发效果",
	environmentalEffect: "环境影响",
	aura: "气息"
}).map(([e, t]) => [e.replace(/[_\-\s]/g, "").toLowerCase(), t])), bc = (e) => String(e).replace(/[_\-\s]/g, "").toLowerCase();
function xc(e, t = 0) {
	return /^\d+$/.test(String(e)) ? `第 ${Number(e) + 1} 项` : yc[bc(e)] || (/\p{Script=Han}/u.test(e) ? e : `补充资料 ${t + 1}`);
}
function Sc(e) {
	return String(e).split(".").map((e, t) => xc(e, t)).join(" · ");
}
var Cc = {
	visibility: {
		public: "公开可见",
		player: "主角可见",
		gm: "仅供裁定",
		private: "仅供裁定",
		hidden: "隐藏",
		internal: "仅供裁定",
		secret: "隐藏"
	},
	status: {
		available: "可用",
		unavailable: "不可用",
		locked: "未解锁",
		pending: "待确认",
		confirmed: "已确认",
		active: "生效中",
		inactive: "未生效"
	},
	default: {
		available: "可用",
		conditional: "满足条件后可用",
		unavailable: "不可用",
		locked: "未解锁"
	},
	confirmationstatus: {
		pending: "待确认",
		confirmed: "已确认",
		awaiting_confirmation: "待确认"
	},
	stance: {
		guard: "守势",
		defensive: "守势",
		offensive: "攻势",
		neutral: "中立"
	}
};
function wc(e, t = "") {
	return e == null || e === "" ? "未提供" : typeof e == "boolean" ? e ? "是" : "否" : Array.isArray(e) ? e.length ? e.map((e) => wc(e, t)).join("；") : "暂无条目" : typeof e == "object" ? Object.entries(e).map(([e, t], n) => `${xc(e, n)}：${wc(t, e)}`).join("\n") || "暂无资料" : Cc[bc(t)]?.[e] || String(e);
}
var Tc = [
	{
		id: "identity",
		label: "身份与当前状态",
		keys: [
			"id",
			"name",
			"identity",
			"cultivationRealm",
			"cultivation",
			"realm",
			"currentState",
			"combatStyle",
			"weapon",
			"weapons",
			"stance",
			"position",
			"身份",
			"境界",
			"修为",
			"当前状态",
			"武器",
			"姿态",
			"站位"
		]
	},
	{
		id: "visible",
		label: "可见情报与行动倾向",
		keys: [
			"visibleInfo",
			"observed",
			"behavior",
			"公开表现",
			"可观察招式",
			"可能特征"
		]
	},
	{
		id: "techniques",
		label: "功法、招式与能力",
		keys: [
			"martialArts",
			"techniques",
			"skills",
			"abilities",
			"功法",
			"招式",
			"技能",
			"能力"
		]
	},
	{
		id: "resources",
		label: "资源、装备与弱点",
		keys: [
			"resourceDefinitions",
			"resources",
			"weaknesses",
			"equipment",
			"artifacts",
			"资源",
			"弱点",
			"装备",
			"法宝"
		]
	},
	{
		id: "hidden",
		label: "构造补充与裁定专用资料",
		keys: [
			"hidden",
			"generated",
			"隐藏信息"
		]
	},
	{
		id: "other",
		label: "补充资料",
		keys: []
	}
], Ec = /* @__PURE__ */ new Set([
	"id",
	"key",
	"profileschema",
	"rulerefs",
	"registryid",
	"techniqueids",
	"sourcescope",
	"sourcekind",
	"branchknown",
	"confirmationstatus",
	"battlestateeffect",
	"provenance",
	"sources",
	"confirmation",
	"priority",
	"generated",
	"observed",
	"version"
]);
function Dc(e, t = {}, n = e) {
	let r = jc(e, t, n).flatMap((e) => e.rows);
	function i(e, t, n = 0) {
		let a = t.at(-1);
		if (Ec.has(bc(a)) || !/^\d+$/.test(a) && !yc[bc(a)] && !/\p{Script=Han}/u.test(a)) return null;
		let o = t.join("."), s = /^\d+$/.test(a) && e && typeof e == "object" ? Oc(e) || xc(a) : xc(a, n);
		return e && typeof e == "object" ? {
			path: o,
			keys: t,
			label: s,
			children: Object.entries(e).map(([e, n], r) => i(n, [...t, e], r)).filter(Boolean),
			group: !0,
			canAdd: Array.isArray(e) && [
				"martialArts",
				"techniques",
				"resourceDefinitions",
				"weaknesses",
				"tactics",
				"mechanics",
				"triggeredState",
				"conditions"
			].includes(a)
		} : {
			...r.find((e) => e.path === o),
			path: o,
			keys: t,
			label: s,
			value: e,
			display: wc(e, a),
			...a === "default" ? { options: {
				available: "可用",
				conditional: "满足条件后可用",
				unavailable: "不可用"
			} } : {}
		};
	}
	return Tc.filter((e) => !["other", "hidden"].includes(e.id)).map((t) => ({
		...t,
		children: Object.entries(e || {}).filter(([n]) => t.keys.some((e) => bc(e) === bc(n)) && !(n === "resources" && e.resourceDefinitions?.length)).map(([e, t], n) => i(t, [e], n)).filter(Boolean)
	})).filter((e) => e.children.length);
}
function Oc(e) {
	return typeof e.name == "string" ? e.name : typeof e.名称 == "string" ? e.名称 : "";
}
function kc(e) {
	return Object.fromEntries(Object.entries(fc(e.visibleInfo)).map(([e, t]) => [xc(e), wc(t, e)]));
}
function Ac(e) {
	return Object.fromEntries(Object.entries(e.resources || {}).filter(([, e]) => Number.isFinite(e)).map(([t, n]) => [e.resourceDefinitions?.find((e) => e.key === t)?.name || yc[bc(t)] || "战斗资源", n]));
}
function jc(e, t = {}, n = e) {
	let r = Tc.map((e) => ({
		...e,
		rows: []
	}));
	function i(e, r, a, o, s = 0) {
		let c = r.at(-1), l = xc(c, s), u = r.join(".");
		if (e && typeof e == "object" && Object.keys(e).length) {
			let t = typeof e.name == "string" ? e.name : typeof e.名称 == "string" ? e.名称 : "", n = Array.isArray(e) ? l : t || l;
			for (let [t, [s, c]] of Object.entries(e).entries()) i(c, [...r, s], [...a, n], o, t);
			return;
		}
		let d = [...r], f;
		for (; d.length && !f;) f = t[d.join(".")]?.source, d.pop();
		let p = r.reduce((e, t) => e?.[t], n);
		o.rows.push({
			path: u,
			keys: r,
			label: r.length === 1 && c === "name" ? "姓名" : l,
			context: a.join(" · "),
			value: e,
			display: wc(e, c),
			source: JSON.stringify(p) === JSON.stringify(e) ? f || "unknown" : "user_edited",
			editable: (e === null || [
				"string",
				"number",
				"boolean"
			].includes(typeof e)) && ![
				"id",
				"ruleRefs",
				"visibility",
				"confirmationStatus",
				"battleStateEffect"
			].some((e) => r.includes(e))
		});
	}
	for (let [t, [n, a]] of Object.entries(e || {}).entries()) {
		let e = r.find((e) => e.keys.some((e) => bc(e) === bc(n))) || r.at(-1);
		i(a, [n], [], e, t);
	}
	return r.filter((e) => e.rows.length);
}
function Mc(e, t, n) {
	let r = structuredClone(e), i = t.at(-1), a = t.slice(0, -1).reduce((e, t) => e[t], r), o = a[i];
	if (typeof o == "number" || o === null && [
		"current",
		"min",
		"max"
	].includes(i)) {
		if (String(n).trim() === "" || !Number.isFinite(Number(n))) throw Error("请填写有效数字");
		a[i] = Number(n);
	} else a[i] = typeof o == "boolean" ? n === !0 || n === "true" : String(n);
	return r;
}
//#endregion
//#region src/ui/components/CharacterFigure.vue
var Nc = {
	key: 0,
	class: "xy-figure-custom"
}, Pc = ["src", "alt"], Fc = {
	class: "xy-daoist-svg",
	viewBox: "0 0 220 380",
	preserveAspectRatio: "xMidYMid meet"
}, Ic = ["id"], Lc = ["stop-color"], Rc = ["stop-color"], zc = ["stop-color"], Bc = ["id"], Vc = {
	class: "xy-base-ripples",
	transform: "translate(110, 350)"
}, Hc = ["stroke"], Uc = ["stroke"], Wc = ["stroke"], Gc = { class: "xy-orbiting-chords" }, Kc = [
	"d",
	"stroke",
	"filter"
], qc = ["d", "stroke"], Jc = ["filter"], Yc = ["fill"], Xc = ["fill"], Zc = ["fill"], Qc = ["fill"], $c = ["fill"], el = ["fill"], tl = ["stroke"], nl = ["stroke"], rl = /*#__PURE__*/ q({
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
		let t = e, n = G(() => !!t.avatar), r = G(() => t.avatar), i = G(() => t.side === "player" ? "#38bdf8" : "#f43f5e"), a = G(() => t.side === "player" ? "#2dd4bf" : "#fbbf24");
		return (t, o) => (z(), B("div", { class: k(["xy-figure-container", ["figure-" + e.side]]) }, [o[6] ||= V("div", {
			class: "xy-figure-halo",
			"aria-hidden": "true"
		}, null, -1), n.value ? (z(), B("div", Nc, [V("img", {
			src: r.value,
			alt: e.name,
			class: "xy-custom-img"
		}, null, 8, Pc), o[0] ||= V("div", { class: "xy-custom-frame-deco" }, null, -1)])) : (z(), B("div", {
			key: 1,
			class: k(["xy-figure-silhouette", e.side])
		}, [(z(), B("svg", Fc, [
			V("defs", null, [
				o[2] ||= da("<linearGradient id=\"playerRobeGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\" data-v-86c24f93><stop offset=\"0%\" stop-color=\"#38bdf8\" stop-opacity=\"0.9\" data-v-86c24f93></stop><stop offset=\"40%\" stop-color=\"#0284c7\" stop-opacity=\"0.8\" data-v-86c24f93></stop><stop offset=\"85%\" stop-color=\"#082f49\" stop-opacity=\"0.95\" data-v-86c24f93></stop><stop offset=\"100%\" stop-color=\"#03070d\" stop-opacity=\"1\" data-v-86c24f93></stop></linearGradient><linearGradient id=\"enemyRobeGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\" data-v-86c24f93><stop offset=\"0%\" stop-color=\"#fb7185\" stop-opacity=\"0.9\" data-v-86c24f93></stop><stop offset=\"40%\" stop-color=\"#be123c\" stop-opacity=\"0.8\" data-v-86c24f93></stop><stop offset=\"85%\" stop-color=\"#4c0519\" stop-opacity=\"0.95\" data-v-86c24f93></stop><stop offset=\"100%\" stop-color=\"#03070d\" stop-opacity=\"1\" data-v-86c24f93></stop></linearGradient>", 2),
				V("radialGradient", {
					id: e.side + "CoreGrad",
					cx: "50%",
					cy: "50%",
					r: "50%"
				}, [
					V("stop", {
						offset: "0%",
						"stop-color": e.side === "player" ? "#e0f2fe" : "#ffe4e6",
						"stop-opacity": "1"
					}, null, 8, Lc),
					V("stop", {
						offset: "40%",
						"stop-color": e.side === "player" ? "#38bdf8" : "#f43f5e",
						"stop-opacity": "0.8"
					}, null, 8, Rc),
					V("stop", {
						offset: "100%",
						"stop-color": e.side === "player" ? "#0369a1" : "#881337",
						"stop-opacity": "0"
					}, null, 8, zc)
				], 8, Ic),
				V("filter", {
					id: e.side + "Glow",
					x: "-20%",
					y: "-20%",
					width: "140%",
					height: "140%"
				}, [...o[1] ||= [V("feGaussianBlur", {
					stdDeviation: "4",
					result: "blur"
				}, null, -1), V("feComposite", {
					in: "SourceGraphic",
					in2: "blur",
					operator: "over"
				}, null, -1)]], 8, Bc)
			]),
			V("g", Vc, [
				V("ellipse", {
					cx: "0",
					cy: "0",
					rx: "75",
					ry: "14",
					fill: "none",
					stroke: i.value,
					"stroke-opacity": "0.3",
					"stroke-width": "1.2"
				}, null, 8, Hc),
				V("ellipse", {
					cx: "0",
					cy: "0",
					rx: "55",
					ry: "10",
					fill: "none",
					stroke: i.value,
					"stroke-opacity": "0.5",
					"stroke-width": "1"
				}, null, 8, Uc),
				V("ellipse", {
					cx: "0",
					cy: "0",
					rx: "30",
					ry: "6",
					fill: "none",
					stroke: i.value,
					"stroke-opacity": "0.7",
					"stroke-width": "1.5"
				}, null, 8, Wc)
			]),
			V("g", Gc, [V("path", {
				d: e.side === "player" ? "M 20 280 C 10 160, 200 120, 195 240 C 190 320, 40 330, 25 240" : "M 200 280 C 210 160, 20 120, 25 240 C 30 320, 180 330, 195 240",
				fill: "none",
				stroke: i.value,
				"stroke-width": "1.5",
				"stroke-dasharray": "6 4",
				opacity: "0.6",
				filter: `url(#${e.side}Glow)`
			}, null, 8, Kc), V("path", {
				d: e.side === "player" ? "M 45 220 C 30 140, 180 90, 175 190 C 170 270, 60 280, 48 200" : "M 175 220 C 190 140, 40 90, 45 190 C 50 270, 160 280, 172 200",
				fill: "none",
				stroke: a.value,
				"stroke-width": "1",
				opacity: "0.4"
			}, null, 8, qc)]),
			V("g", {
				class: "xy-figure-body-group",
				filter: `url(#${e.side}Glow)`
			}, [
				V("path", {
					d: "M 110 95 \r\n               C 135 110, 165 170, 175 260 \r\n               C 180 305, 165 345, 150 355 \r\n               C 125 345, 95 345, 70 355 \r\n               C 55 345, 40 305, 45 260 \r\n               C 55 170, 85 110, 110 95 Z",
					fill: `url(#${e.side}RobeGrad)`,
					stroke: "rgba(255,255,255,0.2)",
					"stroke-width": "0.8"
				}, null, 8, Yc),
				V("path", {
					d: "M 85 130 C 55 160, 30 220, 38 270 C 45 275, 62 250, 72 210 Z",
					fill: e.side === "player" ? "#075985" : "#9f1239",
					opacity: "0.8"
				}, null, 8, Xc),
				V("path", {
					d: "M 135 130 C 165 160, 190 220, 182 270 C 175 275, 158 250, 148 210 Z",
					fill: e.side === "player" ? "#075985" : "#9f1239",
					opacity: "0.8"
				}, null, 8, Zc),
				o[3] ||= V("path", {
					d: "M 110 98 L 95 150 L 110 240 L 125 150 Z",
					fill: "rgba(255,255,255,0.08)",
					stroke: "rgba(255,255,255,0.25)",
					"stroke-width": "0.8"
				}, null, -1),
				V("circle", {
					cx: "110",
					cy: "180",
					r: "14",
					fill: `url(#${e.side}CoreGrad)`
				}, null, 8, Qc),
				o[4] ||= V("circle", {
					cx: "110",
					cy: "180",
					r: "4",
					fill: "#ffffff",
					opacity: "0.9"
				}, null, -1),
				V("ellipse", {
					cx: "110",
					cy: "72",
					rx: "16",
					ry: "21",
					fill: `url(#${e.side}RobeGrad)`,
					stroke: "rgba(255,255,255,0.3)",
					"stroke-width": "0.8"
				}, null, 8, $c),
				V("path", {
					d: "M 103 52 L 110 42 L 117 52 Z",
					fill: a.value
				}, null, 8, el),
				V("line", {
					x1: "94",
					y1: "48",
					x2: "126",
					y2: "48",
					stroke: a.value,
					"stroke-width": "1.5"
				}, null, 8, tl),
				V("circle", {
					cx: "110",
					cy: "68",
					r: "32",
					fill: "none",
					stroke: i.value,
					"stroke-width": "1",
					"stroke-dasharray": "4 6",
					opacity: "0.6"
				}, null, 8, nl)
			], 8, Jc)
		])), o[5] ||= V("div", { class: "xy-figure-sparkles" }, [
			V("span", { class: "xy-f-dot d1" }),
			V("span", { class: "xy-f-dot d2" }),
			V("span", { class: "xy-f-dot d3" })
		], -1)], 2))], 2));
	}
}, [["__scopeId", "data-v-86c24f93"]]), il = {
	class: "xy-wings-rays-svg",
	viewBox: "0 0 380 400",
	preserveAspectRatio: "none"
}, al = ["id"], ol = ["stop-color"], sl = ["stop-color"], cl = ["d", "stroke"], ll = { class: "xy-wings-container" }, ul = ["title", "onClick"], dl = { class: "xy-feather-inner" }, fl = { class: "xy-feather-name" }, pl = {
	key: 0,
	class: "xy-feather-lock",
	title: "条件未足"
}, ml = {
	key: 1,
	class: "xy-feather-badge"
}, hl = {
	key: 0,
	class: "xy-wings-empty"
}, gl = /*#__PURE__*/ q({
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
		let n = e, r = t, i = G(() => n.items.slice(0, 6)), a = G(() => n.isModalOpen && !!n.selectedTermId);
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
		return (t, n) => (z(), B("div", { class: k(["xy-chord-wings", ["wings-" + e.side]]) }, [(z(), B("svg", il, [V("defs", null, [V("linearGradient", {
			id: e.side + "RayGrad",
			x1: "0%",
			y1: "0%",
			x2: "100%",
			y2: "0%"
		}, [V("stop", {
			offset: "0%",
			"stop-color": e.side === "player" ? "#38bdf8" : "#fb7185",
			"stop-opacity": "0.7"
		}, null, 8, ol), V("stop", {
			offset: "100%",
			"stop-color": e.side === "player" ? "#2dd4bf" : "#fbbf24",
			"stop-opacity": "0.1"
		}, null, 8, sl)], 8, al)]), (z(!0), B(R, null, L(i.value, (t, n) => (z(), B("path", {
			key: "ray-" + n,
			d: u(n, i.value.length),
			fill: "none",
			stroke: `url(#${e.side}RayGrad)`,
			"stroke-width": "1.5",
			"stroke-dasharray": "5 7",
			opacity: "0.6"
		}, null, 8, cl))), 128))])), V("div", ll, [(z(!0), B(R, null, L(i.value, (t, r) => (z(), B("button", {
			key: t.id || r,
			class: k(["xy-wing-feather", ["feather-" + e.side, {
				"is-selected": o(t),
				"is-shrunk": a.value && !o(t),
				"is-locked": s(t)
			}]]),
			style: de(d(r, i.value.length, t)),
			title: t.name + (s(t) ? "（机缘未备·点击查阅密卷）" : "（本轮可用·点击查阅或起势）"),
			onClick: (e) => l(t)
		}, [
			n[1] ||= V("span", { class: "xy-feather-tip" }, null, -1),
			V("div", dl, [
				n[0] ||= V("span", { class: "xy-feather-crest" }, "◆", -1),
				V("span", fl, A(t.name), 1),
				s(t) ? (z(), B("span", pl, "🔒")) : (z(), B("span", ml, A(c(t)), 1))
			]),
			n[2] ||= V("span", {
				class: "xy-feather-string",
				"aria-hidden": "true"
			}, null, -1)
		], 14, ul))), 128)), e.items.length ? U("", !0) : (z(), B("div", hl, [V("span", null, A(e.side === "player" ? "未感应到可用功法弦羽" : "未见可察敌招"), 1)]))])], 2));
	}
}, [["__scopeId", "data-v-918b413f"]]), _l = { class: "xy-buff-box-lane" }, vl = { class: "xy-buff-header" }, yl = { class: "xy-buff-icon" }, bl = { class: "xy-buff-title" }, xl = { class: "xy-buff-content" }, Sl = {
	key: 0,
	class: "xy-buff-badges"
}, Cl = { class: "xy-pill-label" }, wl = {
	key: 0,
	class: "xy-pill-round"
}, Tl = {
	key: 1,
	class: "xy-buff-empty"
}, El = { class: "xy-zone-middle" }, Dl = { class: "xy-figure-wrapper" }, Ol = { class: "xy-wings-wrapper" }, kl = { class: "xy-wings-wrapper" }, Al = { class: "xy-figure-wrapper" }, jl = { class: "xy-info-box-lane" }, Ml = { class: "xy-info-top" }, Nl = { class: "xy-info-title-group" }, Pl = { class: "xy-side-kicker" }, Fl = { class: "xy-actor-name" }, Il = {
	key: 0,
	class: "xy-target-switchers"
}, Ll = ["onClick"], Rl = { class: "xy-traits-row" }, zl = { class: "xy-trait-k" }, Bl = { class: "xy-trait-v" }, Vl = {
	key: 0,
	class: "xy-trait-none"
}, Hl = {
	key: 0,
	class: "xy-resources-row"
}, Ul = { class: "xy-res-chips" }, Wl = /*#__PURE__*/ q({
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
		let t = e, n = G(() => t.enemiesList?.length || 0), r = G(() => kc(t.actor)), i = G(() => Object.keys(r.value).length > 0), a = G(() => t.side === "player" ? Ac(t.actor) : {}), o = G(() => Object.keys(a.value).length > 0);
		function s(e) {
			return String(e);
		}
		return (t, c) => (z(), B("div", { class: k(["xy-fighter-zone", ["zone-" + e.side, { "is-active-target": e.isSelectedTarget }]]) }, [
			V("div", _l, [V("div", { class: k(["xy-buff-card", "buff-" + e.side]) }, [V("div", vl, [V("span", yl, A(e.side === "player" ? "✦" : "✧"), 1), V("span", bl, A(e.side === "player" ? "本尊加持与异常" : "敌修气机附着"), 1)]), V("div", xl, [e.effects.length ? (z(), B("div", Sl, [(z(!0), B(R, null, L(e.effects, (e, t) => (z(), B("span", {
				key: t,
				class: k(["xy-buff-pill", { "is-field": e.lane === "field" }])
			}, [
				c[2] ||= V("span", { class: "xy-pill-dot" }, null, -1),
				V("span", Cl, A(e.label), 1),
				e.remainingRounds === void 0 ? U("", !0) : (z(), B("small", wl, A(e.remainingRounds) + "轮", 1))
			], 2))), 128))])) : (z(), B("div", Tl, [...c[3] ||= [V("span", null, "灵息平稳 · 无异常灵息", -1)]]))])], 2)]),
			V("div", El, [e.side === "player" ? (z(), B(R, { key: 0 }, [V("div", Dl, [H(rl, {
				side: "player",
				name: e.actor.name || "主角",
				avatar: e.actor.avatar || e.actor.portrait || ""
			}, null, 8, ["name", "avatar"])]), V("div", Ol, [H(gl, {
				side: "player",
				items: e.techniques,
				"selected-term-id": e.selectedTermId,
				"is-modal-open": e.isModalOpen,
				onSelectWing: c[0] ||= (e) => t.$emit("select-petal", e)
			}, null, 8, [
				"items",
				"selected-term-id",
				"is-modal-open"
			])])], 64)) : (z(), B(R, { key: 1 }, [V("div", kl, [H(gl, {
				side: "enemy",
				items: e.techniques,
				"selected-term-id": e.selectedTermId,
				"is-modal-open": e.isModalOpen,
				onSelectWing: c[1] ||= (e) => t.$emit("select-petal", e)
			}, null, 8, [
				"items",
				"selected-term-id",
				"is-modal-open"
			])]), V("div", Al, [H(rl, {
				side: "enemy",
				name: e.actor.name || "敌手",
				avatar: e.actor.avatar || e.actor.portrait || ""
			}, null, 8, ["name", "avatar"])])], 64))]),
			V("div", jl, [V("div", { class: k(["xy-character-info-card", "info-" + e.side]) }, [
				V("div", Ml, [V("div", Nl, [V("span", Pl, A(e.side === "player" ? "主角" : "敌方"), 1), V("h3", Fl, A(e.actor.name || (e.side === "player" ? "主角" : "敌手")), 1)]), e.side === "enemy" && n.value > 1 ? (z(), B("div", Il, [(z(!0), B(R, null, L(e.enemiesList, (n) => (z(), B("button", {
					key: n.id,
					class: k(["xy-switch-btn", { active: n.id === e.actor.id }]),
					onClick: (e) => t.$emit("select-target", n.id)
				}, A(n.name), 11, Ll))), 128))])) : U("", !0)]),
				V("div", Rl, [(z(!0), B(R, null, L(r.value, (e, t) => (z(), B("span", {
					key: t,
					class: "xy-trait-item"
				}, [V("b", zl, A(t) + ":", 1), V("span", Bl, A(s(e)), 1)]))), 128)), i.value ? U("", !0) : (z(), B("span", Vl, "平稳对峙 · 无显露法力特征"))]),
				o.value ? (z(), B("div", Hl, [c[4] ||= V("span", { class: "xy-res-label" }, "气海机枢:", -1), V("div", Ul, [(z(!0), B(R, null, L(a.value, (e, t) => (z(), B("span", {
					key: t,
					class: "xy-res-tag"
				}, [V("b", null, A(t), 1), ua(" " + A(e), 1)]))), 128))])])) : U("", !0)
			], 2)])
		], 2));
	}
}, [["__scopeId", "data-v-924edb67"]]), Gl = { class: "xy-harmonic-gauge" }, Kl = { class: "xy-gauge-round" }, ql = { class: "xy-round-num" }, Jl = { class: "xy-dom-label" }, Yl = /*#__PURE__*/ q({
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
		let t = e, n = G(() => t.semanticState.压制 || t.semanticState.control || "均势对峙"), r = G(() => {
			let e = n.value;
			return e.includes("主角") || e.includes("胜") ? "dom-player" : e.includes("敌") || e.includes("劣") ? "dom-enemy" : "dom-neutral";
		});
		return (t, i) => (z(), B("div", Gl, [
			V("div", Kl, [i[0] ||= V("span", { class: "xy-round-roman" }, "ROUND", -1), V("b", ql, A(e.round > 0 ? e.round < 10 ? "0" + e.round : e.round : "—"), 1)]),
			i[1] ||= da("<div class=\"xy-wave-resonator\" data-v-ed77923f><svg class=\"xy-wave-svg\" viewBox=\"0 0 120 70\" preserveAspectRatio=\"none\" data-v-ed77923f><defs data-v-ed77923f><linearGradient id=\"waveCyanGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\" data-v-ed77923f><stop offset=\"0%\" stop-color=\"#38bdf8\" stop-opacity=\"0.8\" data-v-ed77923f></stop><stop offset=\"50%\" stop-color=\"#2dd4bf\" stop-opacity=\"0.9\" data-v-ed77923f></stop><stop offset=\"100%\" stop-color=\"#fb7185\" stop-opacity=\"0.8\" data-v-ed77923f></stop></linearGradient></defs><path class=\"xy-sine-path p1\" d=\"M 0 35 Q 30 18, 60 35 T 120 35\" fill=\"none\" stroke=\"url(#waveCyanGrad)\" stroke-width=\"1.8\" data-v-ed77923f></path><path class=\"xy-sine-path p2\" d=\"M 0 35 Q 30 52, 60 35 T 120 35\" fill=\"none\" stroke=\"rgba(251, 191, 36, 0.5)\" stroke-width=\"1.2\" data-v-ed77923f></path><circle cx=\"60\" cy=\"35\" r=\"3.5\" fill=\"#fbbf24\" class=\"xy-center-node\" data-v-ed77923f></circle></svg></div><div class=\"xy-vs-emblem\" data-v-ed77923f><span class=\"xy-vs-text\" data-v-ed77923f>VS</span><div class=\"xy-vs-aura\" data-v-ed77923f></div></div>", 2),
			V("div", { class: k(["xy-dominance-pill", r.value]) }, [V("span", Jl, A(n.value), 1)], 2)
		]));
	}
}, [["__scopeId", "data-v-ed77923f"]]), Xl = { class: "xy-center-stage" }, Zl = { class: "xy-center-head" }, Ql = { class: "xy-center-weather" }, $l = { class: "xy-weather-text" }, eu = { class: "xy-center-body xy-custom-scroll" }, tu = {
	class: "xy-term-scroll-view",
	key: "term"
}, nu = { class: "xy-scroll-top-bar" }, ru = { class: "xy-scroll-badge" }, iu = { class: "xy-badge-origin" }, au = { class: "xy-scroll-tech-title" }, ou = { class: "xy-tech-name-glow" }, su = { class: "xy-scroll-quote" }, cu = { class: "xy-scroll-details" }, lu = {
	key: 0,
	class: "xy-detail-block"
}, uu = { class: "xy-detail-list" }, du = {
	key: 1,
	class: "xy-detail-block"
}, fu = { class: "xy-detail-list" }, pu = {
	key: 2,
	class: "xy-detail-block"
}, mu = {
	key: 3,
	class: "xy-detail-block"
}, hu = { class: "xy-rule-tags" }, gu = {
	key: 0,
	class: "xy-scroll-action"
}, _u = {
	class: "xy-situation-view",
	key: "situation"
}, vu = { class: "xy-positions-card" }, yu = { class: "xy-pos-clash" }, bu = { class: "xy-pos-node player" }, xu = { class: "xy-node-name" }, Su = { class: "xy-node-val" }, Cu = { class: "xy-pos-bridge" }, wu = { class: "xy-bridge-dist" }, Tu = { class: "xy-pos-node enemy" }, Eu = { class: "xy-node-name" }, Du = { class: "xy-node-val" }, Ou = {
	key: 0,
	class: "xy-semantic-grid"
}, ku = { class: "xy-sem-k" }, Au = { class: "xy-sem-v" }, ju = { class: "xy-verdict-card" }, Mu = { class: "xy-verdict-header" }, Nu = {
	key: 0,
	class: "xy-verdict-round"
}, Pu = {
	key: 0,
	class: "xy-verdict-body"
}, Fu = { class: "xy-verdict-action" }, Iu = {
	key: 0,
	class: "xy-verdict-prose"
}, Lu = {
	key: 1,
	class: "xy-verdict-summary"
}, Ru = {
	key: 2,
	class: "xy-verdict-await"
}, zu = {
	key: 1,
	class: "xy-verdict-empty"
}, Bu = { class: "xy-center-footer" }, Vu = { class: "xy-footer-status" }, Hu = /*#__PURE__*/ q({
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
		let t = e, n = G(() => {
			let e = t.allEffects?.filter((e) => e.lane === "field") || [];
			return e.length ? e.map((e) => e.label).join(" · ") : "天地肃穆 · 水平如镜";
		}), r = G(() => t.semanticState.positions?.[t.player?.id] || t.player?.visibleInfo?.position || t.semanticState.主角站位 || "站位未明"), i = G(() => {
			let e = t.currentEnemy?.id || "enemy-1";
			return t.semanticState.positions?.[e] || t.currentEnemy?.visibleInfo?.position || t.semanticState.敌方站位 || "站位未明";
		}), a = G(() => t.semanticState.间距 || t.semanticState.distance || "距离未明"), o = G(() => {
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
		}), s = G(() => {
			let e = t.selectedTermData;
			return e ? e.rawDescription || e.originalDefinition || e.description || "暂无古籍阐发" : "";
		}), c = G(() => t.selectedTermData?.mechanics || []), l = G(() => t.selectedTermData?.triggeredState || []), u = G(() => t.selectedTermData?.ruleRefs || []), d = G(() => t.selectedTermSide === "player" ? t.selectedTermAvailability?.available ?? !0 : !0), f = G(() => t.selectedTermAvailability?.reason || (d.value ? "契合当前环境，随时可发" : "前置弦势未足")), p = G(() => t.selectedTermSide === "player" ? d.value ? "status-pass" : "status-fail" : "status-observe"), m = G(() => t.selectedTermSide === "player" ? d.value ? "本轮可用" : "机缘未备" : "公开可察招式"), h = G(() => t.phase === "judging" ? "天道推演裁定中……" : t.phase === "narrating" ? "正文撰刻中……" : t.phase === "awaiting_player" ? "天道神念就绪 · 请修士落子起弦" : t.phase === "awaiting_next" ? "裁定已确立 · 静候进发下一轮" : "灵台安宁 · 待启战局");
		return (t, g) => (z(), B("div", Xl, [
			V("div", Zl, [
				g[4] ||= V("div", { class: "xy-pillar-crest" }, [V("span", { class: "xy-pillar-crest-dot" }, "☯"), V("span", { class: "xy-pillar-title" }, "战状核心枢纽")], -1),
				H(Yl, {
					round: e.round,
					"semantic-state": e.semanticState
				}, null, 8, ["round", "semantic-state"]),
				V("div", Ql, [g[3] ||= V("span", { class: "xy-weather-dot" }, "●", -1), V("span", $l, A(n.value), 1)])
			]),
			V("div", eu, [H(Za, {
				name: "center-fade",
				mode: "out-in"
			}, {
				default: Nn(() => [e.selectedTermData ? (z(), B("div", tu, [
					V("div", nu, [V("div", ru, [
						V("span", null, "📜 " + A(e.selectedTermSide === "player" ? "主角传承" : "敌手破招"), 1),
						g[5] ||= V("span", { class: "xy-badge-sep" }, "·", -1),
						V("span", iu, A(e.selectedTermParentName), 1)
					]), V("button", {
						class: "xy-scroll-close-btn",
						onClick: g[0] ||= (e) => t.$emit("clear-term"),
						title: "返回战况"
					}, "✕")]),
					V("h4", au, [
						g[6] ||= V("span", { class: "xy-bracket" }, "【", -1),
						V("span", ou, A(e.selectedTermData.name), 1),
						g[7] ||= V("span", { class: "xy-bracket" }, "】", -1),
						V("span", { class: k(["xy-tech-status-chip", p.value]) }, A(m.value), 3)
					]),
					V("blockquote", su, [V("p", null, A(s.value), 1)]),
					V("div", cu, [
						c.value.length ? (z(), B("div", lu, [g[8] ||= V("span", { class: "xy-detail-label" }, "⚙ 演化机制", -1), V("ul", uu, [(z(!0), B(R, null, L(c.value, (e, t) => (z(), B("li", { key: t }, A(e), 1))), 128))])])) : U("", !0),
						l.value.length ? (z(), B("div", du, [g[9] ||= V("span", { class: "xy-detail-label" }, "⚡ 触发态势", -1), V("ul", fu, [(z(!0), B(R, null, L(l.value, (e, t) => (z(), B("li", { key: t }, A(e), 1))), 128))])])) : U("", !0),
						e.selectedTermSide === "player" ? (z(), B("div", pu, [g[10] ||= V("span", { class: "xy-detail-label" }, "⚖ 本轮机缘", -1), V("p", { class: k(["xy-cond-text", d.value ? "pass" : "fail"]) }, A(f.value), 3)])) : U("", !0),
						u.value.length ? (z(), B("div", mu, [g[11] ||= V("span", { class: "xy-detail-label" }, "💠 规制出处", -1), V("div", hu, [(z(!0), B(R, null, L(u.value, (e) => (z(), B("span", {
							key: e,
							class: "xy-rule-tag"
						}, A(e), 1))), 128))])])) : U("", !0)
					]),
					e.selectedTermSide === "player" && d.value ? (z(), B("div", gu, [V("button", {
						class: "xy-pick-tech-btn",
						onClick: g[1] ||= (n) => t.$emit("apply-technique", e.selectedTermData.id)
					}, [...g[12] ||= [V("span", null, "选用此招并起势", -1), V("span", { class: "xy-btn-arrow" }, "→", -1)]])])) : U("", !0)
				])) : (z(), B("div", _u, [
					V("div", vu, [g[14] ||= V("div", { class: "xy-pos-header" }, [V("span", { class: "xy-pos-crest" }, "⚔"), V("span", null, "两仪站位与间距")], -1), V("div", yu, [
						V("div", bu, [V("span", xu, A(e.player?.name || "主角"), 1), V("span", Su, A(r.value), 1)]),
						V("div", Cu, [V("span", wu, A(a.value), 1), g[13] ||= V("span", { class: "xy-bridge-line" }, null, -1)]),
						V("div", Tu, [V("span", Eu, A(e.currentEnemy?.name || "敌修"), 1), V("span", Du, A(i.value), 1)])
					])]),
					o.value.length ? (z(), B("div", Ou, [(z(!0), B(R, null, L(o.value, (e) => (z(), B("div", {
						key: e.key,
						class: k(["xy-sem-card", { active: e.active }])
					}, [V("span", ku, A(e.key), 1), V("span", Au, A(e.val), 1)], 2))), 128))])) : U("", !0),
					V("div", ju, [V("div", Mu, [g[15] ||= V("span", { class: "xy-verdict-title" }, "天道裁定战状判词", -1), e.latestRecord ? (z(), B("span", Nu, "第 " + A(e.latestRecord.round) + " 回合", 1)) : U("", !0)]), e.latestRecord ? (z(), B("div", Pu, [V("p", Fu, [g[16] ||= V("b", null, "行止动作:", -1), ua(" " + A(e.latestRecord.actionLabel || e.latestRecord.techniqueId || "自由出招"), 1)]), e.latestRecord.narrative?.text ? (z(), B("div", Iu, [V("p", null, A(e.latestRecord.narrative.text), 1)])) : e.latestRecord.outcomeSummary ? (z(), B("p", Lu, [g[17] ||= V("b", null, "战局变化:", -1), ua(" " + A(e.latestRecord.outcomeSummary), 1)])) : (z(), B("p", Ru, " 裁定已落，正文撰刻中…… "))])) : (z(), B("div", zu, [...g[18] ||= [V("span", null, "战局未启 · 请修士在下方输入心念行止并提交裁定", -1)]]))]),
					V("button", {
						class: "xy-view-timeline-btn",
						onClick: g[2] ||= (e) => t.$emit("open-history")
					}, [...g[19] ||= [V("span", null, "📜 查阅完整战史演进与天道批注", -1)]])
				]))]),
				_: 1
			})]),
			V("div", Bu, [g[20] ||= V("span", { class: "xy-footer-pulse" }, null, -1), V("span", Vu, A(h.value), 1)])
		]));
	}
}, [["__scopeId", "data-v-835f0ead"]]), Uu = { class: "xy-skill-modal-card" }, Wu = { class: "xy-modal-header" }, Gu = { class: "xy-modal-crest" }, Ku = { class: "xy-crest-side" }, qu = { class: "xy-crest-origin" }, Ju = { class: "xy-modal-title-row" }, Yu = { class: "xy-modal-title" }, Xu = { class: "xy-tech-name-glow" }, Zu = { class: "xy-modal-ancient-quote" }, Qu = { class: "xy-quote-text" }, $u = { class: "xy-modal-grid" }, ed = {
	key: 0,
	class: "xy-grid-cell"
}, td = { class: "xy-cell-list" }, nd = {
	key: 1,
	class: "xy-grid-cell"
}, rd = { class: "xy-cell-list" }, id = {
	key: 2,
	class: "xy-grid-cell"
}, ad = { class: "xy-cell-title" }, od = { class: "xy-modal-footer" }, sd = { class: "xy-footer-hint" }, cd = { class: "xy-footer-btns" }, ld = ["disabled", "title"], ud = {
	key: 0,
	class: "xy-btn-lock"
}, dd = {
	key: 1,
	class: "xy-btn-arrow"
}, fd = /*#__PURE__*/ q({
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
		br(() => {
			window.addEventListener("keydown", a);
		}), wr(() => {
			window.removeEventListener("keydown", a);
		});
		let o = G(() => n.termData ? n.termData.rawDescription || n.termData.originalDefinition || n.termData.description || "暂无古籍阐发" : ""), s = G(() => n.termData?.mechanics || []), c = G(() => n.termData?.triggeredState || []), l = G(() => [
			{
				label: "施展消耗",
				value: n.termData?.cost
			},
			{
				label: "作用范围",
				value: n.termData?.range
			},
			{
				label: "使用条件",
				value: n.termData?.availability?.description
			},
			{
				label: "冷却间隔",
				value: n.termData?.cooldown
			},
			{
				label: "应对与打断",
				value: n.termData?.counterplay
			}
		].filter((e) => typeof e.value == "string" && e.value)), u = G(() => n.isPlayer ? n.availabilityStatus?.available ?? !0 : !0), d = G(() => n.isPlayer ? n.availabilityStatus?.reason || (u.value ? "契合当前环境，随时可发" : "前置弦势未足") : "公开观察到的招式特征"), f = G(() => {
			if (n.isPlayer) return u.value ? "tone-emerald" : "tone-amber";
			{
				let e = n.termData?.status;
				return e === "known" ? "tone-emerald" : e === "inferred" ? "tone-amber" : "tone-slate";
			}
		}), p = G(() => n.isPlayer ? u.value ? "本轮可用" : "机缘未备" : {
			known: "已明悟",
			inferred: "推测中",
			unknown: "未知虚实"
		}[n.termData?.status] || "公开可察招式");
		return (t, n) => (z(), na(Za, { name: "xy-modal-pop" }, {
			default: Nn(() => [e.isOpen && e.termData ? (z(), B("div", {
				key: 0,
				class: "xy-skill-modal-backdrop",
				role: "dialog",
				"aria-modal": "true",
				onClick: us(i, ["self"])
			}, [V("div", Uu, [
				n[12] ||= V("span", { class: "xy-card-corner top-left" }, null, -1),
				n[13] ||= V("span", { class: "xy-card-corner top-right" }, null, -1),
				n[14] ||= V("span", { class: "xy-card-corner bottom-left" }, null, -1),
				n[15] ||= V("span", { class: "xy-card-corner bottom-right" }, null, -1),
				V("div", Wu, [V("div", Gu, [
					n[3] ||= V("span", { class: "xy-crest-icon" }, "📜", -1),
					V("span", Ku, A(e.isPlayer ? "主角传承" : "敌修破招"), 1),
					n[4] ||= V("span", { class: "xy-crest-dot" }, "·", -1),
					V("span", qu, A(e.parentName), 1)
				]), V("button", {
					class: "xy-modal-close-btn",
					onClick: n[0] ||= (e) => t.$emit("close"),
					"aria-label": "关闭弹窗",
					title: "关闭 (Esc / 点击空白处)"
				}, " ✕ ")]),
				V("div", Ju, [V("h3", Yu, [
					n[5] ||= V("span", { class: "xy-bracket" }, "【", -1),
					V("span", Xu, A(e.termData.name), 1),
					n[6] ||= V("span", { class: "xy-bracket" }, "】", -1)
				]), V("div", { class: k(["xy-modal-status-badge", f.value]) }, [n[7] ||= V("span", { class: "xy-status-dot" }, null, -1), V("span", null, A(p.value), 1)], 2)]),
				V("blockquote", Zu, [V("p", Qu, "“" + A(o.value) + "”", 1)]),
				V("div", $u, [
					s.value.length ? (z(), B("div", ed, [n[8] ||= V("span", { class: "xy-cell-title" }, [V("span", { class: "xy-cell-icon" }, "⚙"), V("span", null, "演化机制")], -1), V("ul", td, [(z(!0), B(R, null, L(s.value, (e, t) => (z(), B("li", { key: t }, A(e), 1))), 128))])])) : U("", !0),
					c.value.length ? (z(), B("div", nd, [n[9] ||= V("span", { class: "xy-cell-title" }, [V("span", { class: "xy-cell-icon" }, "⚡"), V("span", null, "触发态势")], -1), V("ul", rd, [(z(!0), B(R, null, L(c.value, (e, t) => (z(), B("li", { key: t }, A(e), 1))), 128))])])) : U("", !0),
					e.isPlayer ? (z(), B("div", id, [n[10] ||= V("span", { class: "xy-cell-title" }, [V("span", { class: "xy-cell-icon" }, "⚖"), V("span", null, "本轮机缘")], -1), V("p", { class: k(["xy-condition-note", u.value ? "cond-pass" : "cond-fail"]) }, A(d.value), 3)])) : U("", !0),
					(z(!0), B(R, null, L(l.value, (e) => (z(), B("div", {
						key: e.label,
						class: "xy-grid-cell"
					}, [V("span", ad, A(e.label), 1), V("p", null, A(e.value), 1)]))), 128))
				]),
				V("div", od, [V("span", sd, A(e.isPlayer ? "按已确认的功法设定裁定本轮行动" : "这里只展示已公开的招式资料"), 1), V("div", cd, [V("button", {
					class: "xy-footer-dismiss-btn",
					onClick: n[1] ||= (e) => t.$emit("close")
				}, " 返回战场 "), e.isPlayer ? (z(), B("button", {
					key: 0,
					class: k(["xy-footer-apply-btn", { "is-locked": !u.value }]),
					disabled: !u.value,
					title: u.value ? "选用此招并起势" : d.value || "机缘未备，尚未满足施展条件",
					onClick: n[2] ||= (n) => u.value && t.$emit("apply", e.termData.id)
				}, [
					u.value ? U("", !0) : (z(), B("span", ud, "🔒")),
					n[11] ||= V("span", null, "选用此招并起势", -1),
					u.value ? (z(), B("span", dd, "→")) : U("", !0)
				], 10, ld)) : U("", !0)])])
			])])) : U("", !0)]),
			_: 1
		}));
	}
}, [["__scopeId", "data-v-c3cc09ac"]]), pd = { class: "xy-action-topbar" }, md = { class: "xy-action-controls" }, hd = ["disabled"], gd = ["disabled"], _d = ["disabled"], vd = ["disabled"], yd = ["disabled"], bd = { class: "xy-action-console" }, xd = { class: "xy-technique-selector" }, Sd = { class: "xy-tech-picker-label" }, Cd = ["value", "disabled"], wd = ["value", "disabled"], Td = { class: "xy-input-box-wrapper" }, Ed = [
	"value",
	"disabled",
	"onKeydown"
], Dd = ["disabled"], Od = { class: "xy-submit-content" }, kd = { class: "xy-submit-text" }, Ad = /*#__PURE__*/ q({
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
		let n = e, r = t, i = /* @__PURE__ */ F(null), a = G(() => n.isBusy ? n.phase === "judging" ? "天道裁定中…" : n.phase === "narrating" ? "正文撰刻中…" : "推演中…" : n.phase === "awaiting_player" ? "提交裁定" : "静候机枢");
		function o() {
			n.isBusy || n.phase !== "awaiting_player" || r("submit");
		}
		return (t, n) => (z(), B("section", { class: k(["xy-action-dock", { "is-busy": e.isBusy }]) }, [V("div", pd, [V("div", md, [
			V("button", {
				class: "xy-ctrl-btn btn-start",
				disabled: e.isBusy || !["idle", "ended"].includes(e.phase),
				onClick: n[0] ||= (e) => t.$emit("start")
			}, [H(J, { name: "play" }), n[11] ||= V("span", null, "启战 / 继续", -1)], 8, hd),
			V("button", {
				class: "xy-ctrl-btn btn-next",
				disabled: e.isBusy || !["awaiting_next", "committed"].includes(e.phase),
				onClick: n[1] ||= (e) => t.$emit("next")
			}, [H(J, { name: "next" }), n[12] ||= V("span", null, "进发下轮", -1)], 8, gd),
			V("button", {
				class: "xy-ctrl-btn btn-stop",
				disabled: ["idle", "ended"].includes(e.phase),
				onClick: n[2] ||= (e) => t.$emit("stop")
			}, [H(J, { name: "stop" }), n[13] ||= V("span", null, "止戈停战", -1)], 8, _d),
			e.latestCommitted ? (z(), B("button", {
				key: 0,
				class: "xy-ctrl-btn btn-rewrite",
				disabled: e.isBusy,
				onClick: n[3] ||= (e) => t.$emit("rewrite"),
				title: "重写本轮正文 (保留已判决事实，不重裁)"
			}, [H(J, { name: "refresh" }), n[14] ||= V("span", null, "重写正文", -1)], 8, vd)) : U("", !0),
			e.latestCommitted ? (z(), B("button", {
				key: 1,
				class: "xy-ctrl-btn btn-inject",
				disabled: e.isBusy,
				onClick: n[4] ||= (e) => t.$emit("queue"),
				title: "注入酒馆主剧情下条提示词"
			}, [H(J, { name: "send" }), n[15] ||= V("span", null, "注为主剧情", -1)], 8, yd)) : U("", !0),
			e.hasBridgeQueued ? (z(), B("button", {
				key: 2,
				class: "xy-ctrl-btn btn-skip",
				onClick: n[5] ||= (e) => t.$emit("skip-narrative")
			}, [...n[16] ||= [V("span", null, "跳过本轮正文", -1)]])) : U("", !0),
			e.hostSyncPending ? (z(), B("button", {
				key: 3,
				class: "xy-ctrl-btn btn-retry-host",
				onClick: n[6] ||= (e) => t.$emit("retry-host")
			}, [...n[17] ||= [V("span", null, "重试宿主同步", -1)]])) : U("", !0),
			V("button", {
				class: "xy-ctrl-btn btn-history",
				onClick: n[7] ||= (e) => t.$emit("toggle-history"),
				title: "演武战史与批注"
			}, [H(J, { name: "scroll" }), n[18] ||= V("span", null, "战史演进", -1)])
		])]), V("div", bd, [
			V("div", xd, [V("label", Sd, [n[20] ||= V("span", { class: "xy-picker-kicker" }, "选用心法", -1), V("select", {
				class: "xy-tech-select",
				value: e.selectedTechniqueId,
				disabled: e.isBusy,
				onChange: n[8] ||= (e) => t.$emit("update:techniqueId", e.target.value)
			}, [n[19] ||= V("option", { value: "" }, "自由身法 (自由行动)", -1), (z(!0), B(R, null, L(e.techniqueOptions, (e) => (z(), B("option", {
				key: e.id,
				value: e.id,
				disabled: !e.available
			}, A(e.name) + A(e.available ? "" : " (机缘未至)"), 9, wd))), 128))], 40, Cd)]), e.selectedTechniqueId ? (z(), B("button", {
				key: 0,
				class: "xy-clear-tech-btn",
				onClick: n[9] ||= (e) => t.$emit("update:techniqueId", ""),
				title: "切为自由行动"
			}, " 取消心法 ")) : U("", !0)]),
			V("div", Td, [V("textarea", {
				ref_key: "textareaRef",
				ref: i,
				class: "xy-action-textarea xy-custom-scroll",
				value: e.actionLabel,
				disabled: e.isBusy,
				rows: "2",
				placeholder: "凝神运功，详述主角心意、起手引弦与应对之势…… (按 Ctrl+Enter 快速提交)",
				onInput: n[10] ||= (e) => t.$emit("update:actionLabel", e.target.value),
				onKeydown: fs(us(o, ["ctrl"]), ["enter"])
			}, null, 40, Ed), n[21] ||= V("span", { class: "xy-textarea-deco" }, null, -1)]),
			V("button", {
				class: k(["xy-submit-btn", { "is-loading": e.isBusy }]),
				disabled: e.isBusy || e.phase !== "awaiting_player",
				onClick: o
			}, [
				n[22] ||= V("div", { class: "xy-submit-bg" }, null, -1),
				n[23] ||= V("div", { class: "xy-submit-ripple" }, null, -1),
				V("div", Od, [H(J, {
					name: e.isBusy ? "sparkles" : "send",
					class: "xy-submit-icon"
				}, null, 8, ["name"]), V("span", kd, A(a.value), 1)])
			], 10, Dd)
		])], 2));
	}
}, [["__scopeId", "data-v-847a2743"]]), jd = { class: "xy-timeline-drawer-panel" }, Md = { class: "xy-drawer-header" }, Nd = { class: "xy-drawer-title" }, Pd = { class: "xy-count-badge" }, Fd = { class: "xy-drawer-body xy-custom-scroll" }, Id = {
	key: 0,
	class: "xy-timeline-stream"
}, Ld = { class: "xy-t-head" }, Rd = { class: "xy-t-round" }, zd = {
	key: 0,
	class: "xy-t-action-id"
}, Bd = { class: "xy-t-label" }, Vd = { class: "xy-t-outcome" }, Hd = {
	key: 0,
	class: "xy-t-narrative"
}, Ud = {
	key: 1,
	class: "xy-t-narrative-empty"
}, Wd = {
	key: 1,
	class: "xy-timeline-empty"
}, Gd = {
	key: 2,
	class: "xy-public-events-section"
}, Kd = { class: "xy-pe-title" }, qd = { class: "xy-pe-list" }, Jd = /*#__PURE__*/ q({
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
		return (n, r) => (z(), na(Za, { name: "xy-drawer-slide" }, {
			default: Nn(() => [e.isOpen ? (z(), B("aside", {
				key: 0,
				class: "xy-timeline-drawer-backdrop",
				onClick: r[1] ||= us((e) => n.$emit("close"), ["self"])
			}, [V("div", jd, [V("div", Md, [V("div", Nd, [
				r[2] ||= V("span", { class: "xy-d-icon" }, "⏳", -1),
				r[3] ||= V("span", null, "演武战史与天道批注", -1),
				V("span", Pd, A(e.timeline.length), 1)
			]), V("button", {
				class: "xy-close-drawer-btn",
				onClick: r[0] ||= (e) => n.$emit("close"),
				"aria-label": "收起战史"
			}, "✕")]), V("div", Fd, [e.timeline.length ? (z(), B("div", Id, [(z(!0), B(R, null, L(e.timeline.slice().reverse(), (e) => (z(), B("article", {
				key: e.actionId || e.roundId,
				class: "xy-timeline-card"
			}, [
				V("div", Ld, [
					V("span", Rd, A(e.roundId), 1),
					V("span", { class: k(["xy-t-status", "st-" + e.status]) }, A(t(e.status)), 3),
					e.actionId ? (z(), B("span", zd, "#" + A(e.actionId.slice(-6)), 1)) : U("", !0)
				]),
				V("h4", Bd, "【行动】" + A(e.label), 1),
				V("div", Vd, [r[4] ||= V("b", null, "裁定结果：", -1), V("span", null, A(e.outcome || "天道判定无明文"), 1)]),
				e.narrative ? (z(), B("div", Hd, [r[5] ||= V("b", null, "正文演化：", -1), V("p", null, A(e.narrative), 1)])) : (z(), B("div", Ud, [...r[6] ||= [V("span", null, "裁定已确立；等待主剧情推进演化……", -1)]]))
			]))), 128))])) : (z(), B("div", Wd, [...r[7] ||= [V("span", null, "战端初起，尚无回合记录。", -1)]])), e.publicEvents.length ? (z(), B("div", Gd, [V("h5", Kd, "可观测天地变数 (" + A(e.publicEvents.length) + ")", 1), V("ol", qd, [(z(!0), B(R, null, L(e.publicEvents.slice(-8), (e, t) => (z(), B("li", { key: t }, A(e), 1))), 128))])])) : U("", !0)])])])) : U("", !0)]),
			_: 1
		}));
	}
}, [["__scopeId", "data-v-3e5a6368"]]), Yd = /* @__PURE__ */ new Set([
	"hidden",
	"internal",
	"gm",
	"secret"
]), Xd = [
	"techniques",
	"abilities",
	"skills",
	"spells",
	"术法",
	"功法",
	"招式"
];
function Zd(e) {
	return typeof e == "string" ? e.trim() : e == null ? "" : String(e);
}
function Qd(e) {
	return Array.isArray(e) ? e : e && typeof e == "object" ? Object.entries(e).map(([e, t]) => ({
		name: e,
		description: t
	})) : [];
}
function $d(e, t, n = "known") {
	if (typeof e == "string") return {
		id: `enemy-${e}`,
		name: e,
		description: "已从公开上下文识别名称；具体效果尚未公开。",
		status: n,
		source: t,
		visibility: "public"
	};
	if (!e || typeof e != "object") return null;
	let r = Zd(e.visibility || e.exposure || "public").toLowerCase();
	if (Yd.has(r)) return null;
	let i = Zd(e.name || e.label || e.title || e.id);
	return i ? {
		id: Zd(e.id || `enemy-${i}`),
		name: i,
		description: Zd(e.description || e.originalDefinition || e.definition || e.summary || "已识别名称；完整效果尚未公开。"),
		mechanics: Array.isArray(e.mechanics) ? Y(e.mechanics) : [],
		cost: Zd(e.cost),
		range: Zd(e.range),
		cooldown: Zd(e.cooldown),
		counterplay: Zd(e.counterplay),
		availability: Y(e.availability || {}),
		triggeredState: Y(e.triggeredState || []),
		ruleRefs: Y(e.ruleRefs || []),
		status: Zd(e.status || n) || n,
		source: t,
		visibility: "public",
		confidence: e.confidence ?? (n === "known" ? "high" : "medium")
	} : null;
}
function ef(e = {}, t = {}) {
	let n = [], r = /* @__PURE__ */ new Set(), i = (e, t, i) => {
		let a = $d(e, t, i);
		a && !r.has(a.id) && (r.add(a.id), n.push(a));
	};
	for (let t of Xd) {
		let n = e.visibleInfo?.[t] ?? e[t], r = e.visibleInfo && Object.hasOwn(e.visibleInfo, t);
		for (let e of Qd(n)) (t !== "techniques" || r || !e || typeof e != "object" || e.exposed === !0 || ["public", "player"].includes(Zd(e.visibility).toLowerCase())) && i(e, `敌方公开资料 · ${t}`, e?.status || (t === "techniques" ? "known" : "inferred"));
	}
	let a = e.visibleInfo?.observedTechniques || e.visibleInfo?.observedAbilities || e.visibleInfo?.可观察招式;
	for (let e of Qd(a)) i(e, "本轮公开观察", "inferred");
	if (n.length) return n;
	let o = t.scene?.publicEvents || [], s = Zd(e.name);
	for (let e of o) {
		let t = Zd(e);
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
function tf(e) {
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
		...Y(e),
		lane: n,
		label: Zd(e?.label || e?.id || "未命名效果")
	};
}
function nf(e = []) {
	let t = {
		player: [],
		enemy: [],
		field: []
	};
	for (let n of e) t[tf(n).lane].push(tf(n));
	return t;
}
//#endregion
//#region src/ui/components/BattleStage.vue
var rf = { class: "xy-battle-stage" }, af = { class: "xy-stage-arena" }, of = { class: "xy-arena-columns" }, sf = /*#__PURE__*/ q({
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
		let n = e, r = /* @__PURE__ */ F(""), i = /* @__PURE__ */ F(""), a = /* @__PURE__ */ F(""), o = /* @__PURE__ */ F("player"), s = /* @__PURE__ */ F(""), c = /* @__PURE__ */ F(!1), l = /* @__PURE__ */ F(!1), u = G(() => [
			"judging",
			"narrating",
			"rewrite"
		].includes(n.view.phase)), d = G(() => n.view.player || {}), f = G(() => n.view.semanticState || {}), p = G(() => f.value.effects || []), m = G(() => nf(p.value)), h = G(() => m.value.player || []), g = G(() => m.value.enemy || []), _ = G(() => n.view.enemies || []), v = G(() => {
			if (!_.value.length) return null;
			if (s.value) {
				let e = _.value.find((e) => e.id === s.value);
				if (e) return e;
			}
			return _.value[0];
		});
		zn(v, (e) => {
			e && !s.value && (s.value = e.id);
		}, { immediate: !0 });
		function y(e) {
			s.value = e;
		}
		let b = G(() => {
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
		}), x = G(() => v.value ? ef(v.value, n.view) : []), S = G(() => b.value.map((e) => ({
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
		let E = G(() => a.value ? o.value === "player" ? b.value.find((e) => e.id === a.value) || null : x.value.find((e) => e.id === a.value) || null : null), ne = G(() => o.value === "player" ? E.value?.entry?.name || "叠浪玄潮决" : v.value?.name || "对手功法"), D = G(() => E.value?.status || {
			available: !0,
			reason: ""
		}), re = G(() => (n.state.history || []).filter((e) => ["committed", "complete"].includes(e.status)).at(-1) || null), ie = G(() => !!n.controller?.bridgeQueuedAction), ae = G(() => n.controller?.state?.hostSync?.status === "pending");
		return (t, n) => (z(), B("div", rf, [
			H(tc),
			V("div", af, [V("div", of, [
				H(Wl, {
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
				H(Hu, {
					round: e.view.round || 0,
					phase: e.view.phase || "idle",
					"semantic-state": f.value,
					"all-effects": p.value,
					player: d.value,
					"current-enemy": v.value,
					"latest-record": re.value,
					"selected-term-data": null,
					"selected-term-side": o.value,
					"selected-term-parent-name": ne.value,
					"selected-term-availability": D.value,
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
				H(Wl, {
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
			H(Ad, {
				phase: e.view.phase,
				"is-busy": u.value,
				"action-label": r.value,
				"selected-technique-id": i.value,
				"technique-options": S.value,
				"latest-committed": re.value,
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
			H(fd, {
				"is-open": l.value,
				"term-data": E.value,
				"is-player": o.value === "player",
				"parent-name": ne.value,
				"availability-status": D.value,
				onClose: w,
				onApply: T
			}, null, 8, [
				"is-open",
				"term-data",
				"is-player",
				"parent-name",
				"availability-status"
			]),
			H(Jd, {
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
}, [["__scopeId", "data-v-ab76461a"]]), cf = { class: "xy-settings-panel xy-custom-scroll" }, lf = { class: "xy-config-card" }, uf = { class: "xy-form-grid" }, df = { class: "xy-form-field" }, ff = { class: "xy-form-field" }, pf = { class: "xy-form-field xy-col-span-2" }, mf = { class: "xy-form-field xy-col-span-2" }, hf = { class: "xy-password-wrap" }, gf = ["type"], _f = { class: "xy-form-field" }, vf = { class: "xy-form-field" }, yf = { class: "xy-form-field" }, bf = { class: "xy-form-field" }, xf = { class: "xy-config-card" }, Sf = { class: "xy-form-grid" }, Cf = { class: "xy-form-field" }, wf = { class: "xy-form-field" }, Tf = { class: "xy-form-field xy-col-span-2" }, Ef = { class: "xy-form-field xy-col-span-2" }, Df = { class: "xy-password-wrap" }, Of = ["type"], kf = { class: "xy-form-field" }, Af = { class: "xy-form-field" }, jf = { class: "xy-config-card" }, Mf = { class: "xy-toggle-row" }, Nf = { class: "xy-checkbox-label" }, Pf = { class: "xy-form-field xy-mt-3" }, Ff = { class: "xy-form-field xy-mt-3" }, If = { class: "xy-form-field xy-mt-3" }, Lf = { class: "xy-form-field xy-mt-3" }, Rf = { class: "xy-settings-footer" }, zf = /*#__PURE__*/ q({
	__name: "SettingsPanel",
	props: { settings: {
		type: Object,
		default: () => ({})
	} },
	emits: ["save", "back"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ F(!1), a = /* @__PURE__ */ F(!1), o = /* @__PURE__ */ Lt({
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
			originalPrompt: "",
			characterCompletionPrompt: "",
			characterMaxOutput: 8e3,
			adjudicationPrompt: ""
		});
		zn(() => n.settings, (e) => {
			e && (e.adjudicator && Object.assign(o.judge, e.adjudicator), e.narrator && Object.assign(o.narrator, e.narrator), o.autoNarrative = !!e.autoNarrative, o.originalPrompt = e.originalPrompt || "", o.characterCompletionPrompt = e.characterCompletionPrompt || "", o.characterMaxOutput = e.characterMaxOutput || 8e3, o.adjudicationPrompt = e.adjudicationPrompt || "");
		}, {
			immediate: !0,
			deep: !0
		});
		function s() {
			r("save", {
				adjudicator: { ...o.judge },
				narrator: { ...o.narrator },
				autoNarrative: o.autoNarrative,
				originalPrompt: o.originalPrompt,
				characterCompletionPrompt: o.characterCompletionPrompt,
				characterMaxOutput: o.characterMaxOutput,
				adjudicationPrompt: o.adjudicationPrompt
			});
		}
		return (e, t) => (z(), B("div", cf, [
			t[48] ||= V("div", { class: "xy-panel-header" }, [V("div", null, [V("span", { class: "xy-panel-kicker" }, "INDEPENDENT ADAPTER CONFIGURATION"), V("h2", { class: "xy-panel-title" }, "独立机枢 · 模型与演算法")]), V("p", { class: "xy-panel-desc" }, " 裁定 AI 与正文生成可分别调配独立接入点与参数；凭据保存到当前浏览器本地，仅用于本机请求，不写入聊天、战报或导出文件。 ")], -1),
			V("fieldset", lf, [t[31] ||= V("legend", { class: "xy-card-legend" }, [V("span", { class: "xy-legend-icon" }, "⚖"), V("span", null, "战斗裁定 AI (Adjudicator)")], -1), V("div", uf, [
				V("label", df, [t[23] ||= V("span", { class: "xy-field-label" }, "推理模式", -1), I(V("select", {
					"onUpdate:modelValue": t[0] ||= (e) => o.judge.mode = e,
					class: "xy-input-select"
				}, [...t[22] ||= [
					V("option", { value: "unconfigured" }, "未配置 (拒绝请求，安全保护)", -1),
					V("option", { value: "mock" }, "离线 Mock 演示 (免 API Key 极速验算)", -1),
					V("option", { value: "http" }, "真实 OpenAI-Compatible 接口", -1)
				]], 512), [[es, o.judge.mode]])]),
				V("label", ff, [t[24] ||= V("span", { class: "xy-field-label" }, "模型标识 (Model)", -1), I(V("input", {
					"onUpdate:modelValue": t[1] ||= (e) => o.judge.model = e,
					placeholder: "例如: gpt-4o, claude-3-5-sonnet...",
					class: "xy-input-text"
				}, null, 512), [[K, o.judge.model]])]),
				V("label", pf, [t[25] ||= V("span", { class: "xy-field-label" }, "服务接入点 (Endpoint)", -1), I(V("input", {
					"onUpdate:modelValue": t[2] ||= (e) => o.judge.endpoint = e,
					placeholder: "https://api.openai.com/v1/chat/completions",
					class: "xy-input-text"
				}, null, 512), [[K, o.judge.endpoint]])]),
				V("label", mf, [t[26] ||= V("span", { class: "xy-field-label" }, [V("span", null, "API Key (浏览器本地保存)"), V("small", { class: "xy-field-hint" }, "保存后刷新页面仍可使用；清空并保存即可移除")], -1), V("div", hf, [I(V("input", {
					"onUpdate:modelValue": t[3] ||= (e) => o.judge.apiKey = e,
					type: i.value ? "text" : "password",
					placeholder: "sk-...",
					autocomplete: "off",
					class: "xy-input-text"
				}, null, 8, gf), [[as, o.judge.apiKey]]), V("button", {
					type: "button",
					class: "xy-pwd-toggle",
					onClick: t[4] ||= (e) => i.value = !i.value
				}, [H(J, { name: i.value ? "eye-off" : "eye" }, null, 8, ["name"])])])]),
				V("label", _f, [t[27] ||= V("span", { class: "xy-field-label" }, "最大输出 (Max Tokens)", -1), I(V("input", {
					"onUpdate:modelValue": t[5] ||= (e) => o.judge.maxOutput = e,
					type: "number",
					min: "10",
					class: "xy-input-text"
				}, null, 512), [[
					K,
					o.judge.maxOutput,
					void 0,
					{ number: !0 }
				]])]),
				V("label", vf, [t[28] ||= V("span", { class: "xy-field-label" }, "发散温度 (Temperature)", -1), I(V("input", {
					"onUpdate:modelValue": t[6] ||= (e) => o.judge.temperature = e,
					type: "number",
					min: "0",
					max: "2",
					step: "0.1",
					class: "xy-input-text"
				}, null, 512), [[
					K,
					o.judge.temperature,
					void 0,
					{ number: !0 }
				]])]),
				V("label", yf, [t[29] ||= V("span", { class: "xy-field-label" }, "结构容错修复次数", -1), I(V("input", {
					"onUpdate:modelValue": t[7] ||= (e) => o.judge.repairAttempts = e,
					type: "number",
					min: "0",
					max: "3",
					class: "xy-input-text"
				}, null, 512), [[
					K,
					o.judge.repairAttempts,
					void 0,
					{ number: !0 }
				]])]),
				V("label", bf, [t[30] ||= V("span", { class: "xy-field-label" }, "请求超时 (毫秒)", -1), I(V("input", {
					"onUpdate:modelValue": t[8] ||= (e) => o.judge.timeoutMs = e,
					type: "number",
					min: "1000",
					step: "1000",
					class: "xy-input-text"
				}, null, 512), [[
					K,
					o.judge.timeoutMs,
					void 0,
					{ number: !0 }
				]])])
			])]),
			V("fieldset", xf, [t[39] ||= V("legend", { class: "xy-card-legend" }, [V("span", { class: "xy-legend-icon" }, "📜"), V("span", null, "正文演化与主剧情桥接 (Narrator)")], -1), V("div", Sf, [
				V("label", Cf, [t[33] ||= V("span", { class: "xy-field-label" }, "桥接模式", -1), I(V("select", {
					"onUpdate:modelValue": t[9] ||= (e) => o.narrator.mode = e,
					class: "xy-input-select"
				}, [...t[32] ||= [da("<option value=\"main_story\" data-v-a57f404b>酒馆主剧情注入 (推荐，沿用酒馆设定)</option><option value=\"packet\" data-v-a57f404b>仅生成场景包 (供剪贴板与第三方调用)</option><option value=\"http\" data-v-a57f404b>独立 OpenAI-Compatible 正文模型</option><option value=\"mock\" data-v-a57f404b>离线 Mock 演进</option><option value=\"unconfigured\" data-v-a57f404b>未配置</option>", 5)]], 512), [[es, o.narrator.mode]])]),
				V("label", wf, [t[34] ||= V("span", { class: "xy-field-label" }, "模型标识 (Model)", -1), I(V("input", {
					"onUpdate:modelValue": t[10] ||= (e) => o.narrator.model = e,
					placeholder: "正文生成模型名...",
					class: "xy-input-text"
				}, null, 512), [[K, o.narrator.model]])]),
				V("label", Tf, [t[35] ||= V("span", { class: "xy-field-label" }, "独立接入点 (Endpoint)", -1), I(V("input", {
					"onUpdate:modelValue": t[11] ||= (e) => o.narrator.endpoint = e,
					placeholder: "https://...",
					class: "xy-input-text"
				}, null, 512), [[K, o.narrator.endpoint]])]),
				V("label", Ef, [t[36] ||= V("span", { class: "xy-field-label" }, "API Key (浏览器本地保存)", -1), V("div", Df, [I(V("input", {
					"onUpdate:modelValue": t[12] ||= (e) => o.narrator.apiKey = e,
					type: a.value ? "text" : "password",
					placeholder: "sk-...",
					autocomplete: "off",
					class: "xy-input-text"
				}, null, 8, Of), [[as, o.narrator.apiKey]]), V("button", {
					type: "button",
					class: "xy-pwd-toggle",
					onClick: t[13] ||= (e) => a.value = !a.value
				}, [H(J, { name: a.value ? "eye-off" : "eye" }, null, 8, ["name"])])])]),
				V("label", kf, [t[37] ||= V("span", { class: "xy-field-label" }, "最大输出 (Max Tokens)", -1), I(V("input", {
					"onUpdate:modelValue": t[14] ||= (e) => o.narrator.maxOutput = e,
					type: "number",
					min: "50",
					class: "xy-input-text"
				}, null, 512), [[
					K,
					o.narrator.maxOutput,
					void 0,
					{ number: !0 }
				]])]),
				V("label", Af, [t[38] ||= V("span", { class: "xy-field-label" }, "发散温度 (Temperature)", -1), I(V("input", {
					"onUpdate:modelValue": t[15] ||= (e) => o.narrator.temperature = e,
					type: "number",
					min: "0",
					max: "2",
					step: "0.1",
					class: "xy-input-text"
				}, null, 512), [[
					K,
					o.narrator.temperature,
					void 0,
					{ number: !0 }
				]])])
			])]),
			V("div", jf, [
				t[45] ||= V("h3", { class: "xy-card-title" }, "宿主桥接与输入契约", -1),
				V("div", Mf, [V("label", Nf, [I(V("input", {
					type: "checkbox",
					"onUpdate:modelValue": t[16] ||= (e) => o.autoNarrative = e,
					class: "xy-checkbox"
				}, null, 512), [[Zo, o.autoNarrative]]), t[40] ||= V("span", null, "裁定提交后，自动备好正文场景包向宿主注入", -1)])]),
				V("label", Pf, [t[41] ||= V("span", { class: "xy-field-label" }, "独立 HTTP 模式下的原始 Prompt（主剧情模式自动保留宿主日常输入）", -1), I(V("textarea", {
					"onUpdate:modelValue": t[17] ||= (e) => o.originalPrompt = e,
					rows: "2",
					class: "xy-input-textarea",
					placeholder: "我抬起弦弓，观察水面与对手的节奏。"
				}, null, 512), [[K, o.originalPrompt]])]),
				V("label", Ff, [t[42] ||= V("span", { class: "xy-field-label" }, "人物档案生成输出上限（独立于每轮裁定，默认 8000）", -1), I(V("input", {
					"onUpdate:modelValue": t[18] ||= (e) => o.characterMaxOutput = e,
					type: "number",
					min: "1024",
					step: "1024",
					class: "xy-input-text"
				}, null, 512), [[
					K,
					o.characterMaxOutput,
					void 0,
					{ number: !0 }
				]])]),
				V("label", If, [t[43] ||= V("span", { class: "xy-field-label" }, "候选人物补全提示词（固定境界、功法、招式、资源与战斗偏好；确认后生效）", -1), I(V("textarea", {
					"onUpdate:modelValue": t[19] ||= (e) => o.characterCompletionPrompt = e,
					rows: "12",
					class: "xy-input-textarea xy-prompt-editor"
				}, null, 512), [[K, o.characterCompletionPrompt]])]),
				V("label", Lf, [t[44] ||= V("span", { class: "xy-field-label" }, "战斗裁定提示词（保存后作为独立裁定 AI 的 system prompt）", -1), I(V("textarea", {
					"onUpdate:modelValue": t[20] ||= (e) => o.adjudicationPrompt = e,
					rows: "16",
					class: "xy-input-textarea xy-prompt-editor"
				}, null, 512), [[K, o.adjudicationPrompt]])])
			]),
			V("div", Rf, [V("button", {
				class: "xy-save-btn",
				onClick: s
			}, [H(J, { name: "check" }), t[46] ||= V("span", null, "保存机枢设定", -1)]), V("button", {
				class: "xy-back-btn",
				onClick: t[21] ||= (t) => e.$emit("back")
			}, [...t[47] ||= [V("span", null, "返回战场", -1)]])])
		]));
	}
}, [["__scopeId", "data-v-a57f404b"]]), Bf = { class: "xy-data-panel xy-custom-scroll" }, Vf = { class: "xy-quick-actions-bar" }, Hf = { class: "xy-import-console" }, Uf = { class: "xy-console-header" }, Wf = { class: "xy-file-upload-btn" }, Gf = { class: "xy-import-btns" }, Kf = ["disabled"], qf = ["disabled"], Jf = ["disabled"], Yf = { class: "xy-snapshot-details" }, Xf = { class: "xy-snapshot-pre xy-custom-scroll" }, Zf = /*#__PURE__*/ q({
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
		let n = e, r = /* @__PURE__ */ F(""), i = G(() => JSON.stringify(n.snapshot, null, 2));
		async function a(e) {
			let t = e.target.files?.[0];
			t && (r.value = await t.text());
		}
		return (e, t) => (z(), B("div", Bf, [
			t[16] ||= V("div", { class: "xy-panel-header" }, [V("div", null, [V("span", { class: "xy-panel-kicker" }, "SCENE & PRESET MANAGEMENT"), V("h2", { class: "xy-panel-title" }, "演武经卷 · 场景与道藏存档")]), V("p", { class: "xy-panel-desc" }, " 可导入特定世界观战场、角色卡快照与功法 Registry；支持当前分支存档无损导入导出。 ")], -1),
			V("div", Vf, [
				V("button", {
					class: "xy-action-btn btn-demo",
					onClick: t[0] ||= (t) => e.$emit("load-demo")
				}, [H(J, { name: "sparkles" }), t[7] ||= V("span", null, "载入《叠浪玄潮决》演示场景", -1)]),
				V("button", {
					class: "xy-action-btn",
					onClick: t[1] ||= (t) => e.$emit("export-full")
				}, [H(J, { name: "copy" }), t[8] ||= V("span", null, "导出完整战局存档 (JSON)", -1)]),
				V("button", {
					class: "xy-action-btn",
					onClick: t[2] ||= (t) => e.$emit("export-public")
				}, [H(J, { name: "scroll" }), t[9] ||= V("span", null, "导出公开战报摘要", -1)])
			]),
			V("div", Hf, [
				V("div", Uf, [t[11] ||= V("span", { class: "xy-console-title" }, "经卷解析与录入 (JSON)", -1), V("label", Wf, [t[10] ||= V("span", null, "选择本地 JSON 文件", -1), V("input", {
					type: "file",
					accept: "application/json,.json",
					onChange: a,
					class: "xy-hidden-input"
				}, null, 32)])]),
				I(V("textarea", {
					"onUpdate:modelValue": t[3] ||= (e) => r.value = e,
					class: "xy-json-textarea xy-custom-scroll",
					rows: "10",
					placeholder: "粘贴 battle_v2_scene、battle_v2_export 或 registry JSON 文本……"
				}, null, 512), [[K, r.value]]),
				V("div", Gf, [
					V("button", {
						class: "xy-imp-btn",
						disabled: !r.value.trim(),
						onClick: t[4] ||= (t) => e.$emit("import-scene", r.value)
					}, [...t[12] ||= [V("span", null, "导入为新场景", -1)]], 8, Kf),
					V("button", {
						class: "xy-imp-btn",
						disabled: !r.value.trim(),
						onClick: t[5] ||= (t) => e.$emit("import-registry", r.value)
					}, [...t[13] ||= [V("span", null, "导入功法 Registry", -1)]], 8, qf),
					V("button", {
						class: "xy-imp-btn btn-danger",
						disabled: !r.value.trim(),
						onClick: t[6] ||= (t) => e.$emit("import-save", r.value)
					}, [...t[14] ||= [V("span", null, "恢复分支存档", -1)]], 8, Jf)
				])
			]),
			V("details", Yf, [t[15] ||= V("summary", { class: "xy-snapshot-summary" }, [V("span", null, "当前环境与角色快照 (包含内部状态与裁定器上下文)")], -1), V("pre", Xf, A(i.value), 1)])
		]));
	}
}, [["__scopeId", "data-v-8887c668"]]), Qf = { class: "xy-dev-panel xy-custom-scroll" }, $f = { class: "xy-dev-actions" }, ep = {
	class: "xy-log-section",
	open: ""
}, tp = { class: "xy-log-pre xy-custom-scroll" }, np = { class: "xy-log-list-container" }, rp = { class: "xy-list-title" }, ip = {
	key: 0,
	class: "xy-log-items"
}, ap = { class: "xy-item-summary" }, op = {
	key: 0,
	class: "xy-item-action"
}, sp = { class: "xy-item-time" }, cp = { class: "xy-item-pre xy-custom-scroll" }, lp = {
	key: 1,
	class: "xy-empty-logs"
}, up = /*#__PURE__*/ q({
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
		let t = e, n = G(() => JSON.stringify(t.aiContext, null, 2)), r = G(() => t.logs.slice().reverse());
		function i(e) {
			return JSON.stringify(e, null, 2);
		}
		return (t, a) => (z(), B("div", Qf, [
			a[8] ||= V("div", { class: "xy-panel-header" }, [V("div", null, [V("span", { class: "xy-panel-kicker" }, "TIANDAO AUDIT & MODEL PROMPTS"), V("h2", { class: "xy-panel-title" }, "天道秘录 · 裁定审计与日志")]), V("p", { class: "xy-panel-desc" }, " 完整记录裁定模型接收的结构化上下文、原始输入输出、规则校验及宿主契约收据。敏感凭据已自动脱敏。 ")], -1),
			V("div", $f, [
				V("button", {
					class: "xy-dev-btn",
					onClick: a[0] ||= (e) => t.$emit("copy-debug")
				}, [H(J, { name: "copy" }), a[3] ||= V("span", null, "复制完整开发审计 JSON", -1)]),
				V("button", {
					class: "xy-dev-btn",
					onClick: a[1] ||= (e) => t.$emit("export-debug")
				}, [H(J, { name: "scroll" }), a[4] ||= V("span", null, "导出开发审计文件 (JSON)", -1)]),
				V("button", {
					class: "xy-dev-btn",
					onClick: a[2] ||= (e) => t.$emit("export-public")
				}, [H(J, { name: "eye" }), a[5] ||= V("span", null, "导出公开脱敏战报", -1)])
			]),
			V("details", ep, [a[6] ||= V("summary", { class: "xy-sec-summary" }, [V("span", { class: "xy-sec-tag" }, "AI READ CONTEXT"), V("span", null, "当前裁定器实际读取的完整结构化上下文 (含敌方 Hidden 信息)")], -1), V("pre", tp, A(n.value), 1)]),
			V("div", np, [V("h3", rp, "模型与程序事件流水 (" + A(e.logs.length) + ")", 1), e.logs.length ? (z(), B("div", ip, [(z(!0), B(R, null, L(r.value, (e, t) => (z(), B("details", {
				key: t,
				class: "xy-log-detail-item"
			}, [V("summary", ap, [
				V("span", { class: k(["xy-item-kind", "kind-" + e.kind]) }, A(e.kind), 3),
				e.actionId ? (z(), B("span", op, "#" + A(e.actionId.slice(-6)), 1)) : U("", !0),
				V("span", sp, A(e.at), 1)
			]), V("pre", cp, A(i(e)), 1)]))), 128))])) : (z(), B("div", lp, [...a[7] ||= [V("span", null, "尚无调用日志。进行裁定、正文生成或宿主同步后将自动记述于此。", -1)]]))])
		]));
	}
}, [["__scopeId", "data-v-78f0b392"]]), dp = {
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
}, fp = [
	"mechanics",
	"techniques",
	"synergies",
	"narrativeGuidance",
	"ruleRefs"
], pp = /* @__PURE__ */ new Set([
	"public",
	"player",
	"gm",
	"internal"
]);
function mp(e, t) {
	if (typeof e != "string" || !e.trim()) throw Error(`${t} 必须是非空文字`);
}
function hp(e) {
	let t = [
		"id",
		"name",
		"rank",
		"element",
		"corePrinciple",
		...fp,
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
	]) mp(e[t], t);
	if (!pp.has(e.visibility)) throw Error("visibility 无效");
	for (let t of fp) if (!Array.isArray(e[t])) throw Error(`${t} 必须是数组`);
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
		]) mp(t[e], e);
		if (n.has(t.id)) throw Error(`词条 id 重复：${t.id}`);
		if (n.add(t.id), !Array.isArray(t.mechanics) || !Array.isArray(t.triggeredState) || !Array.isArray(t.ruleRefs) || !t.ruleRefs.length || !pp.has(t.visibility)) throw Error(`词条 ${t.id} 结构无效`);
		if (![
			"available",
			"conditional",
			"unavailable"
		].includes(t.availability?.default) || !Array.isArray(t.availability.conditions)) throw Error(`词条 ${t.id} 可用性定义无效`);
	}
	if (!e.ruleRefs.length || e.ruleRefs.some((e) => typeof e != "string" || !e.trim())) throw Error("ruleRefs 不得为空");
	return !0;
}
function gp(e, t) {
	return String(t).split(".").reduce((e, t) => e?.[t], e);
}
function _p(e, t) {
	let n = gp(e, t.path);
	return t.op === "includes" ? Array.isArray(n) && n.includes(t.value) : t.op === "truthy" ? !!n : t.op === "equals" ? n === t.value : t.op === "not" && n !== t.value;
}
var vp = class {
	constructor(e = [dp]) {
		this.entries = /* @__PURE__ */ new Map(), e.forEach((e) => this.register(e));
	}
	register(e) {
		if (hp(e), this.entries.has(e.id)) throw Error(`功法已存在：${e.id}`);
		return this.entries.set(e.id, Y(e)), this;
	}
	get(e) {
		return Y(this.entries.get(e));
	}
	list() {
		return [...this.entries.values()].map(Y);
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
		let i = r.availability.requires || [], a = r.availability.default !== "unavailable" && (i.length ? i.every((e) => _p(n, e)) : r.availability.default === "available"), o = (n.statuses || []).some((e) => e === `${t}:triggered`) || (n.effects || []).some((e) => typeof e == "string" ? e.startsWith(`${t}`) : e.techniqueId === t);
		return {
			available: a,
			state: a ? "available" : "conditional",
			reason: r.availability.conditions.join("；"),
			triggered: o
		};
	}
}, yp = "xybattle-content-v1", bp = Object.freeze(["technique", "treasure"]), xp = "xybattle-content-export-v1", Sp = /* @__PURE__ */ new Set([
	"public",
	"player",
	"gm",
	"internal"
]);
function Cp(e) {
	if (typeof e == "string") try {
		return JSON.parse(e);
	} catch (e) {
		throw Error(`内容 JSON 无法解析：${e.message}`);
	}
	if (!e || typeof e != "object") throw Error("内容必须是 JSON 对象或数组");
	return Y(e);
}
function wp(e, t) {
	let n = t ?? e?.contentType ?? e?.kind ?? e?.type;
	return n === "功法" || n === "gongfa" || n === "technique" ? "technique" : n === "法宝" || n === "fabao" || n === "treasure" || typeof e?.id == "string" && e.id.startsWith("fabao.") ? "treasure" : n != null && n !== "" ? null : "technique";
}
function Tp(e) {
	let t = Cp(e);
	if (t.schema && t.schema !== "xybattle-content-export-v1" && t.schema !== "xybattle-content-v1") throw Error(`内容 schema 不受支持：${t.schema}`);
	return t.schema === "xybattle-content-export-v1" && Array.isArray(t.items) ? t.items : Array.isArray(t) ? t : Array.isArray(t.registry) ? t.registry : t.entry && typeof t.entry == "object" ? t.entry : t.content && typeof t.content == "object" ? t.content : t;
}
function Ep(e, t = {}) {
	let n = Cp(e);
	if (n.schema && !["xybattle-content-v1", "xybattle-content-export-v1"].includes(n.schema) && !n.entry && !n.content) throw Error(`内容 schema 不受支持：${n.schema}`);
	let r = n.entry && typeof n.entry == "object" ? n.entry : n.content && typeof n.content == "object" ? n.content : n, i = wp(r, t.contentType ?? n.contentType ?? n.kind ?? (n.entry ? void 0 : n.type));
	if (!bp.includes(i)) throw Error(`内容类型无效：${i}`);
	if (hp(r), !/^(gongfa|fabao)\.[a-z0-9._-]+$/i.test(r.id)) throw Error("内容 id 必须使用 gongfa. 或 fabao. 前缀");
	for (let e of [
		"mechanics",
		"synergies",
		"narrativeGuidance",
		"ruleRefs"
	]) if (!r[e].every((e) => typeof e == "string" && e.trim())) throw Error(`${e} 必须是非空文字数组`);
	for (let e of r.techniques) {
		if (!e.mechanics.every((e) => typeof e == "string" && e.trim()) || !e.triggeredState.every((e) => typeof e == "string" && e.trim())) throw Error(`词条 ${e.id} 的机制文字无效`);
		if (!Array.isArray(e.availability.conditions) || !e.availability.conditions.every((e) => typeof e == "string" && e.trim())) throw Error(`词条 ${e.id} 的可用性条件无效`);
		let t = e.availability.requires ?? [];
		if (!Array.isArray(t) || t.some((e) => !e || typeof e != "object" || typeof e.path != "string" || ![
			"includes",
			"truthy",
			"equals",
			"not"
		].includes(e.op))) throw Error(`词条 ${e.id} 的 requires 无效`);
	}
	if (r.id.startsWith("fabao.") && i !== "treasure") throw Error("fabao 条目必须标记为 treasure");
	if (r.id.startsWith("gongfa.") && i !== "technique") throw Error("gongfa 条目必须标记为 technique");
	if (t.excludeIds?.includes(r.id)) throw Error(`内容已被排除：${r.id}`);
	if (t.requirePrefix !== !1 && !/^(gongfa|fabao)\.[a-z0-9._-]+$/i.test(r.id)) throw Error("内容 id 必须使用 gongfa. 或 fabao. 前缀");
	return Y(r);
}
function Dp(e, t = {}) {
	let n = Tp(e), r = Array.isArray(n) ? n : [n], i = /* @__PURE__ */ new Set();
	return r.map((e) => {
		let n = Ep(e, t);
		if (i.has(n.id)) throw Error(`内容 id 重复：${n.id}`);
		return i.add(n.id), n;
	});
}
function Op(e, t = {}) {
	let n = Ep(e, t), r = t.now || (/* @__PURE__ */ new Date()).toISOString(), i = t.createdAt || r, a = t.updatedAt || r;
	return {
		schema: yp,
		protocolVersion: 1,
		id: n.id,
		contentType: wp(n, t.contentType),
		name: n.name,
		version: n.version,
		createdAt: i,
		updatedAt: a,
		entry: n
	};
}
function kp(e, t = {}) {
	let n = (Array.isArray(e) ? e : [e]).map((e) => e?.entry ? Op(e.entry, e) : Op(e, t));
	return {
		schema: xp,
		protocolVersion: 1,
		exportedAt: t.exportedAt || (/* @__PURE__ */ new Date()).toISOString(),
		items: n
	};
}
function Ap(e, t = {}) {
	let n = Cp(e);
	if (n.schema === "xybattle-content-export-v1") {
		if (n.protocolVersion !== 1) throw Error(`内容协议版本不支持：${n.protocolVersion}`);
		if (!Array.isArray(n.items)) throw Error("内容导出文件缺少 items 数组");
		let e = n.items.map((e) => Op(e.entry || e.content || e, {
			...t,
			contentType: e.contentType,
			createdAt: e.createdAt,
			updatedAt: e.updatedAt
		})), r = /* @__PURE__ */ new Set();
		for (let t of e) {
			if (r.has(t.id)) throw Error(`内容 id 重复：${t.id}`);
			r.add(t.id);
		}
		return e;
	}
	return Dp(n, t).map((e) => Op(e, t));
}
function jp(e) {
	if (e && !e.entry && e.id && !Array.isArray(e.techniques)) return {
		id: e.id,
		contentType: e.contentType || wp(e, e.contentType),
		name: e.name || e.id,
		version: e.version || "",
		createdAt: e.createdAt,
		updatedAt: e.updatedAt
	};
	let t = e?.entry ? e : Op(e);
	return {
		id: t.id,
		contentType: t.contentType,
		name: t.name,
		version: t.version,
		createdAt: t.createdAt,
		updatedAt: t.updatedAt
	};
}
function Mp(e) {
	if (!e || e.schema !== "xybattle-content-v1" || e.protocolVersion !== 1) throw Error("不是有效的 xybattle 内容记录");
	if (!e.id || !e.entry || e.id !== e.entry.id) throw Error("内容记录 id 与 entry 不一致");
	if (!Sp.has(e.entry.visibility)) throw Error("visibility 无效");
	let t = Ep(e.entry, { contentType: e.contentType });
	if (e.name !== t.name || e.version !== t.version) throw Error("内容记录元数据与 entry 不一致");
	return !0;
}
//#endregion
//#region src/content-importer.js
function Np(e, t = {}) {
	let n = Ap(e, t), r = /* @__PURE__ */ new Set(), i = [];
	for (let e of n) {
		if (r.has(e.id)) throw Error(`内容 id 重复：${e.id}`);
		r.add(e.id);
	}
	return {
		schema: xp,
		protocolVersion: 1,
		valid: !0,
		count: n.length,
		records: Y(n),
		ids: n.map((e) => e.id),
		conflicts: i
	};
}
async function Pp(e, t, { mode: n = "reject" } = {}) {
	if (!e?.valid || !Array.isArray(e.records)) throw Error("无效的内容导入预览");
	if (!t?.getRecord) return [];
	let r = [];
	for (let i of e.records) await t.getRecord(i.id) && r.push({
		id: i.id,
		action: n === "replace" ? "replace" : "reject"
	});
	return r;
}
async function Fp(e, { store: t, mode: n = "reject", ...r } = {}) {
	if (!t) throw Error("导入内容需要 ContentStore");
	if (!["reject", "replace"].includes(n)) throw Error(`不支持的导入模式：${n}`);
	let i = Np(e, r), a = await Pp(i, t, { mode: n });
	if (n === "reject" && a.length) throw Error(`内容已存在：${a.map((e) => e.id).join("、")}`);
	if (typeof t.putMany == "function") await t.putMany(i.records, { overwrite: n === "replace" });
	else if (typeof t.importRecords == "function") await t.importRecords(i.records, { overwrite: n === "replace" });
	else throw Error("ContentStore 缺少原子批量导入接口");
	return {
		...i,
		conflicts: a,
		imported: i.records.map((e) => e.id)
	};
}
async function Ip(e, t, n = {}) {
	if (!e?.exportContents) throw Error("导出内容需要 ContentStore");
	return e.exportContents(t, n);
}
async function Lp(e, t, n = {}) {
	let r = await Ip(e, t, n);
	return JSON.stringify(r, null, n.pretty === !1 ? 0 : 2);
}
//#endregion
//#region src/ui/components/ContentLibraryPanel.vue
var Rp = {
	class: "xy-content-library xy-custom-scroll",
	"aria-label": "功法与法宝内容库"
}, zp = { class: "xy-library-header" }, Bp = { class: "xy-library-actions" }, Vp = { class: "xy-upload-button" }, Hp = ["disabled"], Up = ["disabled"], Wp = { class: "xy-library-grid" }, Gp = {
	class: "xy-library-list",
	"aria-label": "内容列表"
}, Kp = { class: "xy-library-toolbar" }, qp = ["onClick"], Jp = {
	key: 0,
	class: "xy-library-empty"
}, Yp = { class: "xy-library-editor" }, Xp = {
	key: 0,
	class: "xy-library-preview"
}, Zp = {
	key: 0,
	class: "warning"
}, Qp = { class: "xy-library-buttons" }, $p = ["disabled"], em = ["disabled"], tm = ["disabled"], nm = ["disabled"], rm = ["disabled"], im = ["disabled"], am = /*#__PURE__*/ q({
	__name: "ContentLibraryPanel",
	props: { store: {
		type: Object,
		required: !0
	} },
	emits: [
		"changed",
		"error",
		"export",
		"apply"
	],
	setup(e, { expose: t, emit: n }) {
		let r = e, i = n, a = /* @__PURE__ */ F([]), o = /* @__PURE__ */ F(""), s = /* @__PURE__ */ F(""), c = /* @__PURE__ */ F(""), l = /* @__PURE__ */ F(""), u = /* @__PURE__ */ F(null), d = /* @__PURE__ */ F(!1), f = /* @__PURE__ */ F(""), p = /* @__PURE__ */ F(""), m = G(() => a.value.find((e) => e.id === o.value)), h = G(() => a.value.filter((e) => (!l.value || e.contentType === l.value) && (!c.value || `${e.name} ${e.id}`.toLowerCase().includes(c.value.toLowerCase()))));
		function g(e, t = "") {
			f.value = e, p.value = t;
		}
		function _() {
			u.value = null;
		}
		function v(e) {
			let t = `${e === "treasure" ? "fabao" : "gongfa"}.new-${Date.now().toString(36)}`;
			s.value = JSON.stringify({
				id: t,
				name: e === "treasure" ? "未命名法宝" : "未命名功法",
				rank: "天阶",
				element: "水",
				corePrinciple: "",
				mechanics: [],
				techniques: [],
				synergies: [],
				narrativeGuidance: [],
				ruleRefs: ["user-authored.1"],
				version: "1.0.0",
				visibility: "player"
			}, null, 2), o.value = "", _(), g("已生成空白模板，请补齐必填字段后预览校验");
		}
		async function y(e) {
			let t = e.target.files?.[0];
			if (e.target.value = "", t) {
				if (t.size > 5242880) {
					g("JSON 文件不能超过 5 MiB", "error");
					return;
				}
				try {
					s.value = await t.text(), _(), g(`已载入 ${t.name}，请先预览校验`);
				} catch (e) {
					g(`文件读取失败：${e.message}`, "error");
				}
			}
		}
		async function b() {
			a.value = await r.store.listRecords(), o.value && !a.value.some((e) => e.id === o.value) && (o.value = "");
		}
		async function x(e) {
			o.value = e;
			let t = await r.store.get(e);
			t && (s.value = JSON.stringify(t, null, 2)), _();
		}
		async function S() {
			if (!d.value) try {
				let e = Np(s.value);
				e.conflicts = [];
				for (let t of e.records) await r.store.getRecord(t.id) && e.conflicts.push({ id: t.id });
				u.value = e, g(`校验通过：${e.count} 条内容`);
			} catch (e) {
				u.value = null, g(e.message, "error"), i("error", e);
			}
		}
		async function C() {
			await T("reject");
		}
		async function w() {
			await T("replace");
		}
		async function T(e) {
			if (d.value || !u.value) return;
			let t = s.value;
			d.value = !0;
			try {
				let n = await Fp(t, {
					store: r.store,
					mode: e
				});
				await b(), u.value = null, g(`已导入 ${n.imported.length} 条内容`), i("changed", n);
			} catch (e) {
				g(e.message, "error"), i("error", e);
			} finally {
				d.value = !1;
			}
		}
		async function ee() {
			if (m.value) try {
				let e = JSON.parse(s.value);
				await r.store.update(m.value.id, e), await b(), g("编辑已保存"), i("changed", {
					id: m.value.id,
					action: "update"
				});
			} catch (e) {
				g(e.message, "error"), i("error", e);
			}
		}
		async function te() {
			m.value && i("apply", [m.value.entry]);
		}
		async function E() {
			if (m.value) try {
				let e = await r.store.copy(m.value.id);
				await b(), await x(e.id), g(`已复制：${e.name}`), i("changed", {
					id: e.id,
					action: "copy"
				});
			} catch (e) {
				g(e.message, "error"), i("error", e);
			}
		}
		async function ne() {
			if (m.value) try {
				let e = m.value.id;
				await r.store.remove(e), o.value = "", s.value = "", await b(), g(`已删除：${e}`), i("changed", {
					id: e,
					action: "delete"
				});
			} catch (e) {
				g(e.message, "error"), i("error", e);
			}
		}
		async function D() {
			try {
				let e = await Lp(r.store, o.value);
				i("export", e), g("已生成选中内容导出 JSON");
			} catch (e) {
				g(e.message, "error"), i("error", e);
			}
		}
		async function re() {
			try {
				let e = await Lp(r.store);
				i("export", e), g("已生成全部内容导出 JSON");
			} catch (e) {
				g(e.message, "error"), i("error", e);
			}
		}
		return br(b), zn(s, _), t({
			refresh: b,
			previewImport: S,
			commitImport: C,
			replaceImport: w
		}), (e, t) => (z(), B("section", Rp, [
			V("header", zp, [t[6] ||= V("div", null, [
				V("span", { class: "xy-panel-kicker" }, "TECHNIQUE & TREASURE LIBRARY"),
				V("h2", { class: "xy-panel-title" }, "功法与法宝 · 内容库"),
				V("p", { class: "xy-panel-desc" }, "标准 JSON 先预览后写入浏览器内容库。编辑内容库不会改动已开始战斗的 registry snapshot。")
			], -1), V("div", Bp, [
				V("button", {
					type: "button",
					onClick: b
				}, "刷新"),
				V("button", {
					type: "button",
					onClick: t[0] ||= (e) => v("technique")
				}, "新建功法模板"),
				V("button", {
					type: "button",
					onClick: t[1] ||= (e) => v("treasure")
				}, "新建法宝模板"),
				V("label", Vp, [t[5] ||= ua("上传 JSON", -1), V("input", {
					type: "file",
					accept: "application/json,.json",
					onChange: y
				}, null, 32)]),
				V("button", {
					type: "button",
					disabled: !m.value,
					onClick: D
				}, "导出选中", 8, Hp),
				V("button", {
					type: "button",
					disabled: !a.value.length,
					onClick: re
				}, "导出全部", 8, Up)
			])]),
			f.value ? (z(), B("div", {
				key: 0,
				class: k(["xy-library-notice", { error: p.value === "error" }])
			}, A(f.value), 3)) : U("", !0),
			V("div", Wp, [V("aside", Gp, [
				V("div", Kp, [I(V("input", {
					"onUpdate:modelValue": t[2] ||= (e) => c.value = e,
					type: "search",
					placeholder: "搜索名称或 ID"
				}, null, 512), [[K, c.value]]), I(V("select", { "onUpdate:modelValue": t[3] ||= (e) => l.value = e }, [...t[7] ||= [
					V("option", { value: "" }, "全部", -1),
					V("option", { value: "technique" }, "功法", -1),
					V("option", { value: "treasure" }, "法宝", -1)
				]], 512), [[es, l.value]])]),
				(z(!0), B(R, null, L(h.value, (e) => (z(), B("button", {
					key: e.id,
					type: "button",
					class: k(["xy-library-item", { active: o.value === e.id }]),
					onClick: (t) => x(e.id)
				}, [V("strong", null, A(e.name), 1), V("small", null, A(e.contentType === "treasure" ? "法宝" : "功法") + " · " + A(e.id), 1)], 10, qp))), 128)),
				h.value.length ? U("", !0) : (z(), B("p", Jp, "内容库暂无匹配条目"))
			]), V("div", Yp, [
				I(V("textarea", {
					"onUpdate:modelValue": t[4] ||= (e) => s.value = e,
					rows: "18",
					spellcheck: "false",
					placeholder: "粘贴单条、数组或 xybattle-content-export-v1 JSON"
				}, null, 512), [[K, s.value]]),
				u.value ? (z(), B("div", Xp, [
					t[8] ||= V("strong", null, "导入预览", -1),
					V("span", null, A(u.value.count) + " 条 · " + A(u.value.ids.join("、")), 1),
					u.value.conflicts?.length ? (z(), B("span", Zp, "已有同 ID：" + A(u.value.conflicts.map((e) => e.id).join("、")), 1)) : U("", !0)
				])) : U("", !0),
				V("div", Qp, [
					V("button", {
						type: "button",
						onClick: S
					}, "预览校验"),
					V("button", {
						type: "button",
						disabled: !u.value,
						onClick: C
					}, "新增导入", 8, $p),
					V("button", {
						type: "button",
						disabled: !u.value,
						onClick: w
					}, "覆盖导入", 8, em),
					V("button", {
						type: "button",
						disabled: !m.value,
						onClick: ee
					}, "保存编辑", 8, tm),
					V("button", {
						type: "button",
						disabled: !m.value,
						onClick: E
					}, "复制", 8, nm),
					V("button", {
						type: "button",
						class: "danger",
						disabled: !m.value,
						onClick: ne
					}, "删除", 8, rm),
					V("button", {
						type: "button",
						disabled: !m.value,
						onClick: te
					}, "应用到本场", 8, im)
				])
			])])
		]));
	}
}, [["__scopeId", "data-v-c7aecbcf"]]), om = { class: "xy-character-tree" }, sm = ["data-field-group"], cm = { key: 0 }, lm = ["disabled", "onClick"], um = ["data-field-path"], dm = { class: "xy-character-tree__value" }, fm = {
	key: 0,
	class: "xy-character-tree__edit"
}, pm = [
	"value",
	"disabled",
	"onChange"
], mm = ["value"], hm = [
	"value",
	"disabled",
	"onChange"
], gm = [
	"value",
	"disabled",
	"onInput"
], _m = [
	"value",
	"disabled",
	"onInput"
], vm = {
	key: 1,
	class: "xy-character-tree__error",
	role: "alert"
}, ym = { key: 2 }, bm = /*#__PURE__*/ q(/* @__PURE__ */ Object.assign({ name: "CharacterFieldTree" }, {
	__name: "CharacterFieldTree",
	props: {
		nodes: {
			type: Array,
			default: () => []
		},
		disabled: Boolean,
		errors: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ["edit", "add"],
	setup(e, { emit: t }) {
		let n = t;
		function r(e, t) {
			n("edit", {
				field: e,
				input: t
			});
		}
		return (t, n) => {
			let i = Ar("CharacterFieldTree", !0);
			return z(), B("div", om, [(z(!0), B(R, null, L(e.nodes, (a) => (z(), B(R, { key: a.path }, [a.group ? (z(), B("details", {
				key: 0,
				class: "xy-character-tree__group",
				"data-field-group": a.path
			}, [
				V("summary", null, [ua(A(a.label) + " ", 1), V("small", null, A(a.children.length) + " 项", 1)]),
				H(i, {
					nodes: a.children,
					disabled: e.disabled,
					errors: e.errors,
					onEdit: n[0] ||= (e) => t.$emit("edit", e),
					onAdd: n[1] ||= (e) => t.$emit("add", e)
				}, null, 8, [
					"nodes",
					"disabled",
					"errors"
				]),
				a.children.length ? U("", !0) : (z(), B("p", cm, "暂无条目")),
				a.canAdd ? (z(), B("button", {
					key: 1,
					type: "button",
					disabled: e.disabled,
					onClick: (e) => t.$emit("add", a)
				}, "添加条目", 8, lm)) : U("", !0)
			], 8, sm)) : (z(), B("div", {
				key: 1,
				class: "xy-character-tree__field",
				"data-field-path": a.path
			}, [V("strong", null, A(a.label), 1), V("div", dm, [
				V("span", null, A(a.display), 1),
				a.editable ? (z(), B("details", fm, [n[3] ||= V("summary", null, "修改", -1), V("label", null, [V("span", null, A(a.label), 1), a.options ? (z(), B("select", {
					key: 0,
					value: a.value,
					disabled: e.disabled,
					onChange: (e) => r(a, e.target.value)
				}, [(z(!0), B(R, null, L(a.options, (e, t) => (z(), B("option", {
					key: t,
					value: t
				}, A(e), 9, mm))), 128))], 40, pm)) : typeof a.value == "boolean" ? (z(), B("select", {
					key: 1,
					value: String(a.value),
					disabled: e.disabled,
					onChange: (e) => r(a, e.target.value)
				}, [...n[2] ||= [V("option", { value: "true" }, "是", -1), V("option", { value: "false" }, "否", -1)]], 40, hm)) : typeof a.value == "number" || a.value === null && [
					"current",
					"min",
					"max"
				].includes(a.keys.at(-1)) ? (z(), B("input", {
					key: 2,
					type: "number",
					step: "any",
					value: a.value,
					disabled: e.disabled,
					onInput: (e) => r(a, e.target.value)
				}, null, 40, gm)) : (z(), B("textarea", {
					key: 3,
					value: a.value,
					rows: "3",
					disabled: e.disabled,
					onInput: (e) => r(a, e.target.value)
				}, null, 40, _m))])])) : U("", !0),
				e.errors[a.path] ? (z(), B("span", vm, A(e.errors[a.path]), 1)) : U("", !0),
				a.source === "user_edited" ? (z(), B("small", ym, "用户修改，待确认")) : U("", !0)
			])], 8, um))], 64))), 128))]);
		};
	}
}), [["__scopeId", "data-v-2eca262c"]]), xm = {
	class: "xy-character-confirmation",
	"data-testid": "character-confirmation-panel",
	"aria-labelledby": "character-confirmation-title"
}, Sm = { class: "xy-character-confirmation__header" }, Cm = { class: "xy-character-confirmation__header-actions" }, wm = ["data-status"], Tm = {
	class: "xy-character-confirmation__body xy-custom-scroll",
	tabindex: "0",
	"aria-label": "候选人物资料，可上下滚动"
}, Em = {
	key: 0,
	class: "xy-character-confirmation__busy",
	role: "status",
	"aria-live": "polite"
}, Dm = {
	key: 1,
	class: "xy-character-confirmation__empty"
}, Om = ["disabled"], km = {
	class: "xy-character-confirmation__sources",
	"aria-label": "资料来源状态"
}, Am = ["data-source-status"], jm = {
	key: 0,
	class: "xy-character-confirmation__progress",
	role: "status",
	"aria-live": "polite"
}, Mm = { class: "xy-character-confirmation__progress-count" }, Nm = { class: "xy-character-confirmation__progress-hint" }, Pm = {
	key: 1,
	class: "xy-character-confirmation__empty"
}, Fm = ["data-candidate-id"], Im = { class: "xy-character-candidate__header" }, Lm = { class: "xy-character-candidate__id" }, Rm = [
	"disabled",
	"data-action",
	"onClick"
], zm = { class: "xy-character-candidate__ack" }, Bm = [
	"checked",
	"disabled",
	"onChange"
], Vm = {
	key: 0,
	class: "xy-character-candidate__error",
	role: "alert"
}, Hm = {
	key: 1,
	class: "xy-character-candidate__error",
	role: "alert"
}, Um = {
	key: 2,
	class: "xy-character-candidate__sections",
	"aria-label": "人物资料"
}, Wm = ["data-section"], Gm = {
	key: 3,
	class: "xy-character-candidate__raw"
}, Km = [
	"value",
	"aria-label",
	"disabled",
	"data-candidate-json",
	"onInput"
], qm = {
	key: 4,
	class: "xy-character-conflicts",
	"aria-label": "资料冲突"
}, Jm = ["data-conflict-path"], Ym = { class: "xy-character-confirmation__actions" }, Xm = {
	class: "xy-character-confirmation__notice",
	role: "status",
	"aria-live": "polite"
}, Zm = { class: "xy-character-confirmation__buttons" }, Qm = ["disabled"], $m = ["disabled"], eh = ["disabled"], th = /*#__PURE__*/ q({
	__name: "CharacterConfirmationPanel",
	props: {
		preparation: {
			type: Object,
			default: null
		},
		busy: {
			type: Boolean,
			default: !1
		}
	},
	emits: [
		"prepare",
		"retry",
		"confirm",
		"cancel"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ Lt({}), a = /* @__PURE__ */ Lt({}), o = /* @__PURE__ */ Lt({}), s = /* @__PURE__ */ Lt(/* @__PURE__ */ new Set()), c = /* @__PURE__ */ Lt(/* @__PURE__ */ new Set()), l = {
			mvu_dynamic: "MVU 动态值",
			database: "数据库资料",
			context_explicit: "上下文明确事实",
			ai_extracted: "AI 提取",
			ai_inferred: "AI 推断",
			ai_completed: "AI 构造草稿",
			user_confirmed: "用户确认",
			user_edited: "用户修改，待确认",
			unknown: "来源未标注"
		};
		function u(e) {
			for (let e of Object.keys(i)) delete i[e];
			for (let e of Object.keys(a)) delete a[e];
			for (let e of Object.keys(o)) delete o[e];
			s.clear(), c.clear();
			for (let t of e?.candidates || []) i[t.id] = JSON.stringify(t.fields || {}, null, 2);
		}
		zn(() => n.preparation, u, { immediate: !0 });
		let d = G(() => n.preparation ? n.busy || n.preparation.status === "loading" ? "读取中" : n.preparation.status === "confirmed" ? "已确认" : n.preparation.status === "awaiting_confirmation" ? "待确认" : "等待处理" : "待读取");
		function f(e) {
			return l[e] || "来源未标注";
		}
		function p(e) {
			try {
				let t = JSON.parse(i[e.id] || "{}");
				return t && typeof t == "object" && !Array.isArray(t) ? t : e.fields || {};
			} catch {
				return e.fields || {};
			}
		}
		let m = G(() => Object.fromEntries((n.preparation?.candidates || []).map((e) => [e.id, Dc(p(e), e.provenance, e.fields)]))), h = G(() => Object.fromEntries((n.preparation?.candidates || []).map((e) => [e.id, n.preparation.requiresCompleteProfiles ? gc(pc(p(e), {
			id: e.id,
			side: e.role || "enemy"
		})) : []])));
		function g(e, t) {
			let n = p(e), r = t.keys.reduce((e, t) => e[t], n);
			if (!Array.isArray(r)) return;
			let i = pc({
				techniques: [{}],
				martialArts: [{}],
				resourceDefinitions: [{
					current: 0,
					min: 0,
					max: 0
				}]
			})[t.keys.at(-1)]?.[0] || "";
			if (t.keys.at(-1) === "resourceDefinitions") {
				let e = r.length + 1;
				for (; r.some((t) => t.key === `resource-${e}`);) e += 1;
				i.key = `resource-${e}`;
			}
			r.push(i), C(e.id, JSON.stringify(n, null, 2));
		}
		function _(e, t) {
			return t.split(".").reduce((e, t) => e?.[t], p(e));
		}
		function v(e) {
			return n.busy || n.preparation?.status !== "awaiting_confirmation" || s.has(e.id) || !!a[e.id];
		}
		function y(e, t, n) {
			if (!v(e)) {
				c.delete(e.id), o[e.id] ||= {};
				try {
					i[e.id] = JSON.stringify(Mc(p(e), t.keys, n), null, 2), delete o[e.id][t.path];
				} catch (n) {
					o[e.id][t.path] = n.message;
				}
			}
		}
		function b(e) {
			return [{
				source: e.ignored,
				value: e.ignoredValue
			}, {
				source: e.kept,
				value: e.keptValue
			}].filter((e) => e.source);
		}
		function x(e) {
			let t = e?.status;
			return t === "available" || t === "ok" || t === "success" || t === "matched" ? {
				text: "已读取",
				tone: "ok"
			} : t === "missing" || t === "not_found" ? {
				text: "未找到",
				tone: "missing"
			} : t === "failed" || t === "error" || t === "read_failed" ? {
				text: `读取失败${e.error ? `：${e.error}` : ""}`,
				tone: "error"
			} : t === "not_configured" ? {
				text: "未配置",
				tone: "unknown"
			} : t === "not_requested" ? {
				text: "未请求",
				tone: "unknown"
			} : {
				text: "状态未知",
				tone: "unknown"
			};
		}
		let S = G(() => {
			let e = n.preparation?.candidates || [], t = (t) => e.find((e) => e.sourceStatus?.[t]?.status === "read_failed")?.sourceStatus[t] || e.find((e) => e.sourceStatus?.[t]?.status === "matched")?.sourceStatus[t] || e[0]?.sourceStatus?.[t], r = n.preparation?.scope;
			return [
				[
					"branch",
					"分支作用域",
					r?.branchId ? { status: "available" } : { status: "unknown" }
				],
				[
					"mvu_dynamic",
					"MVU 动态值",
					t("mvu_dynamic")
				],
				[
					"database",
					"数据库资料",
					t("database")
				],
				[
					"ai_extract",
					"AI 提取",
					t("ai_extract")
				],
				[
					"ai_complete",
					"AI 构造",
					t("ai_complete")
				],
				[
					"ai_fill",
					"AI 补全",
					t("ai_fill")
				]
			].map(([e, t, n]) => {
				let i = x(n);
				return e === "branch" && !r?.branchId ? {
					key: e,
					label: t,
					text: "未知（未绑定聊天分支）",
					tone: "unknown"
				} : {
					key: e,
					label: t,
					...i
				};
			});
		});
		function C(e, t) {
			i[e] = t, c.delete(e), o[e] = {};
			try {
				let n = JSON.parse(t);
				if (!n || typeof n != "object" || Array.isArray(n)) throw Error("资料必须是对象");
				delete a[e];
			} catch {
				a[e] = "原始资料格式有误。请在高级编辑区修正；上方暂显示读取时的资料。";
			}
		}
		function w(e) {
			s.has(e) ? s.delete(e) : s.add(e), c.delete(e);
		}
		function T(e, t) {
			t && !a[e] && !Object.keys(o[e] || {}).length ? c.add(e) : c.delete(e);
		}
		let ee = G(() => (n.preparation?.candidates || []).some((e) => !s.has(e.id) && (a[e.id] || Object.keys(o[e.id] || {}).length || h.value[e.id]?.length))), te = G(() => {
			let e = n.preparation;
			return ee.value || n.busy || !e || e.status !== "awaiting_confirmation" || !e.candidates?.length || [...s].length >= e.candidates.length || !e.candidates.some((e) => e.role !== "player" && !s.has(e.id)) || e.candidates.some((e) => !s.has(e.id) && !c.has(e.id));
		}), E = G(() => (n.preparation?.candidates || []).filter((e) => !s.has(e.id)).length), ne = G(() => [...c].filter((e) => !s.has(e)).length), D = G(() => n.preparation?.status === "confirmed" ? "已确认" : "确认并开始战斗"), re = G(() => n.preparation?.status === "confirmed" ? "人物资料已确认，可以进入战斗。" : n.busy ? "正在读取资料，请稍候。" : ee.value ? "请补齐缺失的战斗设定，并修正资料错误后重新勾选。" : (n.preparation?.candidates || []).some((e) => e.role !== "player" && !s.has(e.id)) ? ne.value < E.value ? `请逐名勾选并核对人物资料，还差 ${E.value - ne.value} 名。` : "所有保留人物都已核对，可以确认并开始战斗。" : "至少保留一名敌方人物。");
		function ie() {
			if (te.value) return;
			let e = {}, t = !1;
			for (let r of n.preparation.candidates || []) if (!s.has(r.id)) try {
				if (e[r.id] = JSON.parse(i[r.id]), !e[r.id] || typeof e[r.id] != "object" || Array.isArray(e[r.id])) throw Error("必须是 JSON 对象");
			} catch (e) {
				a[r.id] = `JSON 无效：${e.message}`, t = !0;
			}
			t || r("confirm", {
				edits: e,
				removeIds: [...s]
			});
		}
		return (t, n) => (z(), B("section", xm, [
			V("header", Sm, [n[3] ||= V("div", null, [
				V("span", { class: "xy-character-confirmation__eyebrow" }, "战前准备 · 核对人物"),
				V("h3", { id: "character-confirmation-title" }, "战前人物档案确认"),
				V("p", { class: "xy-character-confirmation__hint" }, " 逐名核对并勾选资料，然后点击“确认并开始战斗”。资料可以直接修改，修改后需要重新勾选。 ")
			], -1), V("div", Cm, [V("span", {
				class: "xy-character-confirmation__state",
				"data-status": e.preparation?.status || "idle"
			}, A(d.value), 9, wm)])]),
			V("div", Tm, [e.busy ? (z(), B("div", Em, " 正在读取人物资料；确认操作暂不可用。 ")) : U("", !0), e.preparation ? (z(), B(R, { key: 2 }, [
				V("div", km, [(z(!0), B(R, null, L(S.value, (e) => (z(), B("span", {
					key: e.key,
					class: k(["xy-source-status", `is-${e.tone}`]),
					"data-source-status": e.key
				}, [V("b", null, A(e.label), 1), ua("：" + A(e.text), 1)], 10, Am))), 128))]),
				e.preparation.candidates?.length ? (z(), B("div", jm, [V("span", Mm, "已核对 " + A(ne.value) + " / " + A(E.value) + " 名人物", 1), V("span", Nm, A(re.value), 1)])) : U("", !0),
				e.preparation.candidates?.length ? U("", !0) : (z(), B("div", Pm, [...n[5] ||= [V("p", null, "没有可审核的敌方人物候选。", -1)]])),
				(z(!0), B(R, null, L(e.preparation.candidates, (t) => (z(), B("article", {
					key: t.id,
					class: k(["xy-character-candidate", { "is-removed": s.has(t.id) }]),
					"data-candidate-id": t.id
				}, [
					V("header", Im, [V("div", null, [V("span", Lm, A(t.role === "player" ? "主角资料" : "敌方资料"), 1), V("h4", null, A(p(t).name || (t.role === "player" ? "主角资料待补全" : "敌方资料待补全")), 1)]), t.role === "player" ? U("", !0) : (z(), B("button", {
						key: 0,
						type: "button",
						class: "xy-character-candidate__remove",
						disabled: e.busy || e.preparation.status === "confirmed",
						"data-action": s.has(t.id) ? "restore" : "remove",
						onClick: (e) => w(t.id)
					}, A(s.has(t.id) ? "恢复候选" : "删除候选"), 9, Rm))]),
					V("label", zm, [V("input", {
						type: "checkbox",
						checked: c.has(t.id),
						disabled: e.busy || e.preparation.status === "confirmed" || s.has(t.id) || !!a[t.id] || Object.keys(o[t.id] || {}).length > 0,
						onChange: (e) => T(t.id, e.target.checked)
					}, null, 40, Bm), n[6] ||= V("span", null, "我已核对并接受此人物资料", -1)]),
					a[t.id] ? (z(), B("p", Vm, A(a[t.id]), 1)) : U("", !0),
					h.value[t.id]?.length ? (z(), B("div", Hm, [n[7] ||= V("strong", null, "资料尚未完整，补齐后才能开始战斗", -1), V("ul", null, [(z(!0), B(R, null, L(h.value[t.id], (e) => (z(), B("li", { key: e }, A(e), 1))), 128))])])) : U("", !0),
					s.has(t.id) ? U("", !0) : (z(), B("div", Um, [(z(!0), B(R, null, L(m.value[t.id], (e) => (z(), B("details", {
						key: e.id,
						class: "xy-character-section",
						"data-section": e.id
					}, [V("summary", null, A(e.label), 1), H(bm, {
						nodes: e.children,
						disabled: v(t),
						errors: o[t.id] || {},
						onEdit: (e) => y(t, e.field, e.input),
						onAdd: (e) => g(t, e)
					}, null, 8, [
						"nodes",
						"disabled",
						"errors",
						"onEdit",
						"onAdd"
					])], 8, Wm))), 128))])),
					s.has(t.id) ? U("", !0) : (z(), B("details", Gm, [
						n[8] ||= V("summary", null, "高级编辑：查看或修改原始人物资料 JSON", -1),
						n[9] ||= V("p", null, "普通用户无需编辑这里；修改后请重新核对上方字段并勾选确认。", -1),
						V("textarea", {
							value: i[t.id],
							rows: "10",
							"aria-label": `${t.name}的原始人物资料`,
							spellcheck: "false",
							disabled: e.busy || e.preparation.status === "confirmed" || s.has(t.id),
							"data-candidate-json": t.id,
							onInput: (e) => C(t.id, e.target.value)
						}, null, 40, Km)
					])),
					t.conflicts?.length ? (z(), B("details", qm, [
						n[11] ||= V("summary", null, "查看原始来源分歧", -1),
						n[12] ||= V("p", null, "各来源没有自动优先级。请核对当前草稿，必要时修改上方资料。", -1),
						(z(!0), B(R, null, L(t.conflicts || [], (e) => (z(), B("div", {
							key: `${t.id}:${e.path}`,
							class: "xy-character-conflict",
							"data-conflict-path": e.path
						}, [
							V("b", null, A(Qt(Sc)(e.path)), 1),
							V("span", null, [n[10] ||= ua("当前采用：", -1), V("code", null, A(Qt(wc)(_(t, e.path))), 1)]),
							(z(!0), B(R, null, L(e.values || b(e), (e) => (z(), B("span", { key: `${e.source}:${Qt(wc)(e.value)}` }, [V("code", null, A(f(e.source)) + "：" + A(Qt(wc)(e.value)), 1)]))), 128))
						], 8, Jm))), 128))
					])) : U("", !0)
				], 10, Fm))), 128))
			], 64)) : (z(), B("div", Dm, [n[4] ||= V("p", null, "尚未生成候选人物。先从当前上下文、MVU 和人物资料库读取候选。", -1), V("button", {
				type: "button",
				"data-action": "prepare",
				disabled: e.busy,
				onClick: n[0] ||= (e) => t.$emit("prepare")
			}, "读取候选人物", 8, Om)]))]),
			V("footer", Ym, [V("div", Xm, [V("strong", null, "已核对 " + A(ne.value) + " / " + A(E.value) + " 名人物", 1), V("span", null, A(re.value), 1)]), V("div", Zm, [
				V("button", {
					type: "button",
					"data-action": "cancel",
					disabled: e.busy,
					onClick: n[1] ||= (e) => t.$emit("cancel")
				}, "取消", 8, Qm),
				V("button", {
					type: "button",
					"data-action": "retry",
					disabled: e.busy,
					onClick: n[2] ||= (e) => t.$emit("retry")
				}, "重新读取", 8, $m),
				V("button", {
					type: "button",
					class: "is-primary xy-character-confirmation__confirm-button",
					"data-action": "confirm",
					disabled: te.value,
					onClick: ie
				}, A(D.value), 9, eh)
			])])
		]));
	}
}, [["__scopeId", "data-v-a2c17061"]]);
//#endregion
//#region src/utils.js
function nh(e, t) {
	if (typeof document > "u") return !1;
	let n = new Blob([t], { type: "application/json;charset=utf-8" }), r = URL.createObjectURL(n), i = document.createElement("a");
	return i.href = r, i.download = e, i.click(), setTimeout(() => URL.revokeObjectURL(r), 0), !0;
}
//#endregion
//#region src/battle-adjudicator-prompt.js
var rh = "你是修仙战斗系统专属的【天道推演玄枢 · 独立功法战斗裁定核心】（Heavenly Combat Adjudicator）。\n你的唯一职责是：纯粹、严密、客观地对本轮攻防交锋进行功法机理推演与规则裁定。\n你完全独立于宿主聊天主预设、角色卡背景和世俗剧情，禁止进行小说文学创作，禁止输出剧情正文，只返回符合天道规范的结构化裁定数据 JSON。\n\n【核心裁定职责与分析原则】\n1. 功法招式机理推演（Technique Mechanics）：\n   - 深入分析主角所施展招式的起手运劲、真元流转、引动法则（如音波织网、叠浪贯通、潮汐共鸣）与出招心念意图。\n   - 深入分析敌方当前姿态、防御手段、已知功法与境界压制（如重剑开合、体魄罡气、真元厚度）。\n   - 内部因果考量（含暗藏私密底牌）：你拥有探知敌方隐藏底牌、暗疾与暗中算计（hidden）的天道神念。必须依据敌我真实情况裁定深层因果，但【严禁】在面向玩家公开的 summary 和 publicEvents 中明文泄露尚未暴露的隐藏底牌！\n\n2. 给出对敌人的实质影响（Target Impact）：\n   - 严谨判定招式对敌手造成的物理与灵力效果：\n     * 受制部位（如双足被水网缠裹、重剑挥击受阻、重心失衡向前倾跌）；\n     * 灵力与经脉反应（如真元运行滞涩、护体罡罩受震碎裂、逆流反噬）；\n     * 战术姿态改变（如硬直后退、招架露出破绽、狂攻冲锋被迫中断）；\n     * 资源损耗（若规则定义了气血/真元/架势消耗）。\n\n3. 给出对战场环境的天地剧变（Environmental Impact）：\n   - 严谨判定打斗对周围天地气象、灵气分布与地形造成的剧烈冲击：\n     * 地形形貌破坏（如青玄石板碎裂飞溅、深坑沟壑、碎石四溅）；\n     * 灵气与气象变化（如水汽撕裂凝聚成网、狂暴重浪屏风横推、煞气黑烟被冲散或压缩、狂风呼啸）；\n     * 天地灵压与声学变化（如音波炸裂、龙吟长啸、水平如镜被打破）。\n\n4. 确立战局走向与确凿事实（Committed Facts）：\n   - 判定节奏归属（谁取得节奏、谁被压制、站位变动）；\n   - 更新持续语义效果（如生效余势剩余回合、新激活状态）；\n   - 输出明确的公开事实列表（publicEvents），将对敌效果与对环境效果封装确立；\n   - 本裁定一经落定即为天道定数，后续正文 AI 必须严格遵守，禁止复判或推翻。\n\n【严格输出格式（JSON）】\n只返回合法 JSON 对象，严禁包裹任何 markdown 解释，结构如下：\n{\n  \"summary\": \"简练概括本轮核心攻防战况与裁定结果（包含对敌与对环境的核心定论）\",\n  \"before\": { /* 完整的原 semanticState 对象，必须原样保持 */ },\n  \"after\": {\n    /* 更新后的完整 semanticState 对象，保留原有所有字段，更新 statuses, effects, 站位, 压制, 破绽等 */\n  },\n  \"reason\": \"天道裁定因果推演阐述（阐述功法机理如何克制或受挫，可引用内部因果与敌我暗藏底牌）\",\n  \"ruleRefs\": [ \"引用的权威功法规则或词条ID，如 gongfa.dielang-xuanchaojue.xianshi\" ],\n  \"publicEvents\": [\n    \"【对敌影响】具体受制部位、姿态破坏与灵力震荡事实（无剧透）\",\n    \"【环境剧变】具体地形破坏与天地气象冲击事实\",\n    \"【局势转移】站位距离与攻守节奏归属事实\"\n  ],\n  \"confidence\": 0.95,\n  \"resourceChanges\": [\n    /* 可选资源变动：[{ \"actorId\": \"player\", \"resource\": \"qi\", \"before\": 120, \"after\": 105, \"reason\": \"消耗真元\", \"ruleRefs\": [...] }] */\n  ]\n}";
function ih(e, t) {
	let n = e.actors?.player || {}, r = e.actors?.enemies || [], i = e.scene || {}, a = e.semanticState || {};
	return [
		"=== 天道功法裁定请求 (ADJUDICATION REQUEST) ===",
		"",
		"【1. 修士本轮行止行动】",
		`- 动作招式：${t.label || "自由出招"}`,
		`- 选用功法词条ID：${t.techniqueId || "无（自由身法）"}`,
		`- 出招心念与意图：${t.intent || "凝神运劲，克敌制胜"}`,
		"",
		"【2. 主角修者面板】",
		`- 道号姓名：${n.name || "主角"} (#${n.id || "player"})`,
		`- 境界与装备：${JSON.stringify(n.visibleInfo || {})}`,
		`- 气海机枢：${JSON.stringify(n.resources || {})}`,
		`- 所修功法与传承词条：${JSON.stringify(n.techniques || [])}`,
		`- 已确认的身份、战斗方式与战术：${JSON.stringify({
			identity: n.identity,
			cultivationRealm: n.cultivationRealm,
			combatStyle: n.combatStyle,
			behavior: n.behavior,
			weaknesses: n.weaknesses
		})}`,
		"",
		"【3. 敌方修者面板】",
		...r.map((e, t) => [
			`[敌手 ${t + 1}]：${e.name || "对手"} (#${e.id || "enemy"})`,
			`- 公开情报与境界：${JSON.stringify(e.visibleInfo || {})}`,
			`- 气海机枢：${JSON.stringify(e.resources || {})}`,
			`- 已知招式：${JSON.stringify(e.observedTechniques || [])}`,
			`- 已确认的固定战斗档案（内部可读，按 visibility 控制公开）：${JSON.stringify({
				identity: e.identity,
				cultivationRealm: e.cultivationRealm,
				combatStyle: e.combatStyle,
				martialArts: e.martialArts,
				techniques: e.techniques,
				behavior: e.behavior,
				weaknesses: e.weaknesses
			})}`,
			`- 【天道私密情报·仅供内部因果裁定·严禁公开泄密】：${JSON.stringify(e.hidden || {})}`
		].join("\n")),
		"",
		"【4. 战场环境与时空标尺】",
		`- 对决地点：${i.location || "未知战场"}`,
		`- 时辰天色：${i.time || "破晓"}`,
		`- 天地气象：${i.weather || "长风激荡"}`,
		`- 先手天机：${i.initiative || "均势"}`,
		"",
		"【5. 交锋前战局语义状态 (before)】",
		JSON.stringify(a, null, 2),
		"",
		"【6. 因果级生命周期状态（只允许通过 causalChanges 改变；正文重写不得改写）】",
		JSON.stringify(e.causalState || {}, null, 2),
		"因果期限只能按 storyClock / elapsedStoryHours 推进；不得使用现实时间。支持可配置 15 日冷却、一个月影响、22 小时死亡等期限；缺少明确规则时标记待定，不得凭空补境界细则。",
		"",
		"【7. 权威功法注册表与可用规则库】",
		JSON.stringify(e.registry || {}, null, 2),
		"【资源规则：所有消耗/恢复通过 resourceChanges 提交，不修改人物定义】",
		JSON.stringify(e.resourceRules || [], null, 2),
		"",
		"【8. 裁定要求】",
		"人物境界、功法与招式是用户已确认的固定定义，禁止临场补出新能力或重新生成敌人。按已定义的消耗、距离、冷却、条件、弱点与战斗偏好选择和裁定敌方行动；状态变化写入 semanticState，资源结算写入 resourceChanges。",
		"1. 依据【主角招式机理】与【敌方功法防备】，深度推演功法碰撞与生克因果。",
		"2. 明确给出【对敌人的实质影响】（受制、破防、身法脱节、经脉反噬、破绽）。",
		"3. 明确给出【对战场环境的天地剧变】（地形破坏、水汽激荡、灵气屏风、气象冲击）。",
		"4. 确立节奏转移并更新 semanticState（before 必须原样一致，after 必须为完整更新对象）。",
		"5. 输出标准 JSON，字段包含 summary, before, after, reason, ruleRefs, publicEvents, confidence；如因果状态改变，增加 causalChanges 数组，每个操作必须有 operationId、scope、ruleRefs（仅引用权威规则），不得直接回写 causalState。"
	].join("\n");
}
function ah(e, t = "") {
	let n = Array.isArray(e.committedFacts) ? e.committedFacts : [], r = Array.isArray(e.descriptionRequirements) ? e.descriptionRequirements : [], i = Array.isArray(e.prohibitions) ? e.prohibitions : [];
	return [
		"【天道战局裁定已确立 · 主剧情战斗正文描写指令】",
		"天道功法战斗系统已完成本回合交锋的推演与规则裁定。以下为已发生的确凿事实链，禁止重新判定胜负或颠覆事实：",
		"",
		`【本轮交锋行止】：${e.originalAction?.label || "双方交手"}`,
		e.originalAction?.intent ? `【主角出招意图】：${e.originalAction.intent}` : "",
		`【战场环境与地点】：${e.location || "战场"}（${e.time || "破晓"}）`,
		"",
		"【已确凿落定的事实判定（必须在正文中生动展开展现）】：",
		...n.map((e) => `• ${e}`),
		"",
		"【正文撰刻约束】：",
		...r.map((e) => `• ${e}`),
		...i.map((e) => `• 警告：${e}`),
		`• 下一步决断点：${e.nextDecisionPoint || "等待玩家行动"}`,
		"",
		"请结合当前小说的上下文情节、世界观主预设与人物性格，展开波澜壮阔、生动精妙的修仙小说战斗正文描写。",
		t ? `玩家剧情引导：${t}` : "",
		"",
		`BATTLE_SCENE_PACKET_JSON:\n${JSON.stringify(e)}`
	].filter(Boolean).join("\n");
}
//#endregion
//#region src/causal-state.js
var oh = "battle_v2_causal", sh = Object.freeze([
	"branch",
	"actor",
	"relation",
	"scene",
	"global"
]), ch = Object.freeze({
	cooldown15d: Object.freeze({
		unit: "story_days",
		value: 15,
		storyHours: 360
	}),
	influenceMonth: Object.freeze({
		unit: "story_months",
		value: 1,
		storyHours: 720
	}),
	death22h: Object.freeze({
		unit: "story_hours",
		value: 22,
		storyHours: 22
	})
}), Q = (e, t) => {
	let n = String(e ?? "").trim();
	if (!n) throw Error(`${t} 不能为空`);
	if (n.length > 256) throw Error(`${t} 过长`);
	return n;
}, lh = (e, t) => String(e?.chatId) === String(t?.chatId) && String(e?.branchId) === String(t?.branchId), uh = (e) => e && typeof e == "object" && !Array.isArray(e) ? Y(e) : {}, dh = (e) => Array.isArray(e) ? Y(e) : [], fh = (e = {}) => ({
	day: Number.isFinite(e.day) ? Math.max(0, Number(e.day)) : 0,
	hour: Number.isFinite(e.hour) ? Math.max(0, Number(e.hour)) : 0,
	minute: Number.isFinite(e.minute) ? Math.max(0, Number(e.minute)) : 0,
	totalStoryHours: Number.isFinite(e.totalStoryHours) ? Math.max(0, Number(e.totalStoryHours)) : Math.max(0, Number(e.day || 0) * 24 + Number(e.hour || 0) + Number(e.minute || 0) / 60)
});
function ph(e) {
	if (e == null) return null;
	if (typeof e == "string" && ch[e]) return {
		...Y(ch[e]),
		key: e
	};
	if (typeof e == "number" && Number.isFinite(e) && e >= 0) return {
		unit: "story_hours",
		value: e,
		storyHours: e
	};
	if (!e || typeof e != "object") throw Error("因果期限必须是故事时间对象");
	let t = String(e.unit || "story_hours"), n = Number(e.value ?? e.hours ?? e.days ?? e.months);
	if (!Number.isFinite(n) || n < 0) throw Error("因果期限数值无效");
	let r = t === "story_days" || t === "days" ? 24 : t === "story_months" || t === "months" ? 720 : 1;
	if (![
		"story_hours",
		"hours",
		"story_days",
		"days",
		"story_months",
		"months"
	].includes(t)) throw Error(`未知因果期限单位：${t}`);
	return {
		unit: t.startsWith("story_") ? t : `story_${t}`,
		value: n,
		storyHours: n * r
	};
}
function mh(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return e;
	let t = ph(e.duration ?? e.storyDuration);
	if (!t) return Y(e);
	let n = {
		...Y(e),
		duration: t,
		remainingStoryHours: Number.isFinite(e.remainingStoryHours) ? e.remainingStoryHours : t.storyHours
	};
	return delete n.storyDuration, n;
}
function hh(e = {}) {
	let t = {
		chatId: Q(e.chatId ?? "default-chat", "因果 scope.chatId"),
		branchId: Q(e.branchId ?? "main", "因果 scope.branchId")
	};
	if (e.kind !== void 0) {
		if (!sh.includes(e.kind)) throw Error(`未知因果作用范围：${e.kind}`);
		t.kind = e.kind;
	} else t.kind = "branch";
	return e.id !== void 0 && e.id !== null && (t.id = Q(e.id, "因果 scope.id")), t;
}
function gh({ scope: e, chatId: t = "default-chat", branchId: n = "main", anchors: r = [], relations: i = [], debts: a = [], cooldowns: o = {}, ledger: s = [], appliedActions: c = {}, clock: l, version: u = 1 } = {}) {
	let d = hh(e || {
		chatId: t,
		branchId: n
	});
	return vh({
		schema: oh,
		version: Number.isInteger(u) && u > 0 ? u : 1,
		scope: d,
		clock: fh(l),
		anchors: dh(r).map(mh),
		relations: dh(i).map(mh),
		debts: dh(a).map(mh),
		cooldowns: Object.fromEntries(Object.entries(uh(o)).map(([e, t]) => [e, mh(t)])),
		ledger: dh(s),
		appliedActions: uh(c),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	}, { scope: d });
}
function _h(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i of e) {
		if (!i || typeof i != "object" || Array.isArray(i)) throw Error(`因果 ${t} 条目无效`);
		let e = Q(i.id, `因果 ${t}.id`);
		if (r.has(e)) throw Error(`因果 ${t} id 重复：${e}`);
		if (r.add(e), i.scope !== void 0 && n && !lh(hh(i.scope), n)) throw Error(`因果 ${t} 作用域不匹配`);
	}
}
function vh(e, { scope: t } = {}) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw Error("因果状态不是对象");
	if (e.schema !== "battle_v2_causal") throw Error("因果状态 schema 不匹配");
	if (!Number.isInteger(e.version) || e.version < 1) throw Error("因果状态 version 无效");
	let n = hh(e.scope);
	if (t && !lh(n, hh(t))) throw Error("因果状态作用域不匹配");
	for (let t of [
		"anchors",
		"relations",
		"debts",
		"ledger"
	]) if (!Array.isArray(e[t])) throw Error(`因果状态 ${t} 必须是数组`);
	if (e.clock !== void 0 && fh(e.clock), !e.cooldowns || typeof e.cooldowns != "object" || Array.isArray(e.cooldowns)) throw Error("因果状态 cooldowns 必须是对象");
	if (!e.appliedActions || typeof e.appliedActions != "object" || Array.isArray(e.appliedActions)) throw Error("因果状态 appliedActions 必须是对象");
	for (let [t, r] of Object.entries(e.cooldowns)) {
		if (!r || typeof r != "object" || Array.isArray(r)) throw Error(`因果 cooldown 无效：${t}`);
		if (r.scope !== void 0 && !lh(hh(r.scope), n)) throw Error("因果 cooldown 作用域不匹配");
		if (r.remainingStoryHours !== void 0 && (!Number.isFinite(r.remainingStoryHours) || r.remainingStoryHours < 0)) throw Error("因果 cooldown.remainingStoryHours 无效");
		if (r.remainingRounds !== void 0 && (!Number.isInteger(r.remainingRounds) || r.remainingRounds < 0)) throw Error("因果 cooldown.remainingRounds 无效");
	}
	_h(e.anchors, "anchor", n), _h(e.relations, "relation", n), _h(e.debts, "debt", n);
	for (let t of e.ledger) {
		if (!t || typeof t != "object" || Array.isArray(t)) throw Error("因果 ledger 条目无效");
		if (Q(t.entryId, "因果 ledger.entryId"), Q(t.actionId, "因果 ledger.actionId"), t.scope && !lh(n, hh(t.scope))) throw Error("因果 ledger 作用域不匹配");
	}
	for (let [t, n] of Object.entries(e.appliedActions)) if (Q(t, "因果 appliedActions.actionId"), !n || typeof n != "object" || typeof n.hash != "string" || !Array.isArray(n.entryIds)) throw Error("因果幂等收据无效");
	return Y({
		...e,
		scope: n,
		clock: fh(e.clock)
	});
}
function yh(e, { scope: t, chatId: n = "default-chat", branchId: r = "main" } = {}) {
	return e == null ? gh({
		scope: t,
		chatId: n,
		branchId: r
	}) : vh({
		schema: e.schema || "battle_v2_causal",
		version: e.version || 1,
		scope: e.scope || t || {
			chatId: n,
			branchId: r
		},
		clock: e.clock,
		anchors: e.anchors || [],
		relations: e.relations || [],
		debts: e.debts || [],
		cooldowns: e.cooldowns || {},
		ledger: e.ledger || [],
		appliedActions: e.appliedActions || {},
		updatedAt: e.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
	}, { scope: t });
}
function bh(e, t) {
	let n = hh(e.scope || t);
	if (!lh(n, t)) throw Error("因果变更作用域与当前分支不匹配");
	return n;
}
function xh(e, t) {
	return e.findIndex((e) => e.id === t);
}
function Sh(e, t, n) {
	let r = xh(e, Q(t.id, `因果 ${n}.id`)), i = mh(t);
	if (r < 0) return [...e, Y(i)];
	let a = e.slice();
	return a[r] = Y(i), a;
}
function Ch(e, t) {
	return e.filter((e) => e.id !== t);
}
function wh(e, t) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw Error(`因果变更 ${t + 1} 无效`);
	let n = String(e.operation || e.type || "").trim();
	if (!n) throw Error(`因果变更 ${t + 1} 缺少 operation`);
	let r = String(e.operationId || `${t + 1}`).trim();
	if (!r) throw Error(`因果变更 ${t + 1} 缺少 operationId`);
	return {
		...Y(e),
		operation: n,
		operationId: r
	};
}
function Th(e, t, n, r) {
	return {
		entryId: `${t}:${e.operationId}`,
		actionId: t,
		operationId: e.operationId,
		operation: e.operation,
		scope: Y(n),
		roundId: e.roundId || null,
		version: r,
		data: Y(e),
		at: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function Eh(e, t = [], { actionId: n, roundId: r = null, scope: i, version: a, knownRuleRefs: o = [], allowMock: s = !1, requireRuleRefs: c = !1, authority: l = "adjudicator" } = {}) {
	let u = yh(e, { scope: i || e?.scope }), d = Q(n, "因果 actionId");
	if (!Array.isArray(t)) throw Error("causalChanges 必须是数组");
	if (!lh(hh(i || u.scope), u.scope)) throw Error("因果提交作用域不匹配");
	let f = t.map(wh).map((e) => ({
		...e,
		roundId: e.roundId || r,
		scope: bh(e, u.scope)
	})), p = rc(f), m = u.appliedActions[d];
	if (m) {
		if (m.hash !== p) throw Error(`因果 actionId 重复但内容不一致：${d}`);
		return {
			state: u,
			deduplicated: !0,
			entries: u.ledger.filter((e) => m.entryIds.includes(e.entryId))
		};
	}
	let h = /* @__PURE__ */ new Set(), g = Y(u), _ = [];
	for (let e of f) {
		if (h.has(e.operationId)) throw Error(`因果 operationId 重复：${e.operationId}`);
		h.add(e.operationId);
		let t = String(e.authority || l);
		if (!["adjudicator", "system"].includes(t)) throw Error("因果变更来源无权限");
		let n = Array.isArray(e.ruleRefs) ? e.ruleRefs : [];
		if (c && !s && n.length === 0) throw Error("因果变更缺少权威 ruleRefs");
		if (n.some((e) => typeof e != "string" || !o.includes(e) && !(s && e.startsWith("mock.")))) throw Error("因果变更引用未知规则");
		let r = Th(e, d, e.scope, (a ?? u.version) + 1);
		if (g.ledger.some((e) => e.entryId === r.entryId)) throw Error(`因果 ledger entry 已存在：${r.entryId}`);
		let i = e.operation.toLowerCase(), f = e.value || e.entity || e.data || e;
		if ([
			"anchor.upsert",
			"anchor.add",
			"upsertanchor",
			"addanchor"
		].includes(i)) g.anchors = Sh(g.anchors, {
			...Y(f),
			id: Q(f.id, "因果 anchor.id"),
			scope: Y(e.scope)
		}, "anchor");
		else if ([
			"anchor.remove",
			"anchor.delete",
			"removeanchor",
			"deleteanchor"
		].includes(i)) g.anchors = Ch(g.anchors, Q(e.id || f.id, "因果 anchor.id"));
		else if ([
			"relation.upsert",
			"relation.add",
			"upsertrelation",
			"addrelation"
		].includes(i)) g.relations = Sh(g.relations, {
			...Y(f),
			id: Q(f.id, "因果 relation.id"),
			scope: Y(e.scope)
		}, "relation");
		else if ([
			"relation.remove",
			"relation.delete",
			"removerelation",
			"deleterelation"
		].includes(i)) g.relations = Ch(g.relations, Q(e.id || f.id, "因果 relation.id"));
		else if ([
			"debt.open",
			"debt.upsert",
			"debt.add",
			"opendebt",
			"upsertdebt"
		].includes(i)) g.debts = Sh(g.debts, {
			status: "open",
			...Y(f),
			id: Q(f.id, "因果 debt.id"),
			scope: Y(e.scope)
		}, "debt");
		else if ([
			"debt.update",
			"debt.settle",
			"updatedebt",
			"settledebt"
		].includes(i)) {
			let t = Q(e.id || f.id, "因果 debt.id"), n = xh(g.debts, t);
			if (n < 0) throw Error(`因果 debt 不存在：${t}`);
			let r = g.debts[n];
			g.debts = Sh(g.debts, {
				...r,
				...Y(f),
				id: t,
				status: i.includes("settle") || f.status === "settled" ? "settled" : f.status || r.status,
				scope: Y(e.scope)
			}, "debt");
		} else if ([
			"cooldown.set",
			"cooldown.upsert",
			"setcooldown",
			"upsertcooldown"
		].includes(i)) {
			let t = Q(e.key || f.key || f.id, "因果 cooldown.key"), n = {
				...Y(f),
				key: t,
				scope: Y(e.scope)
			};
			if (n.remainingRounds !== void 0 && (!Number.isInteger(n.remainingRounds) || n.remainingRounds < 1)) throw Error("因果 cooldown.remainingRounds 无效");
			g.cooldowns[t] = n;
		} else if (["cooldown.clear", "clearcooldown"].includes(i)) delete g.cooldowns[Q(e.key || f.key || f.id, "因果 cooldown.key")];
		else if (![
			"ledger.append",
			"ledger",
			"appendledger"
		].includes(i)) throw Error(`未知因果 operation：${e.operation}`);
		_.push(r), g.ledger.push(r);
	}
	let v = Math.max(Number.isInteger(a) ? a : 0, u.version) + 1;
	return g.version = v, g.appliedActions[d] = {
		hash: p,
		entryIds: _.map((e) => e.entryId),
		version: v
	}, g.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), {
		state: vh(g, { scope: u.scope }),
		deduplicated: !1,
		entries: Y(_)
	};
}
function Dh(e, { roundId: t = null, scope: n, elapsedStoryHours: r = 0, storyTime: i, advanceId: a } = {}) {
	let o = yh(e, { scope: n || e?.scope }), s = a || t ? `clock:${a || t}` : null;
	if (s && o.appliedActions[s]) return o;
	let c = i ? fh(i) : {
		...o.clock,
		totalStoryHours: o.clock.totalStoryHours + (Number.isFinite(r) && r > 0 ? r : 0)
	};
	if (c.totalStoryHours < o.clock.totalStoryHours) throw Error("故事时间不能倒退");
	let l = c.totalStoryHours - o.clock.totalStoryHours, u = {}, d = [];
	for (let [e, n] of Object.entries(o.cooldowns)) if (n) {
		if (l > 0 && !n.expired && Number.isFinite(n.remainingStoryHours)) {
			let r = n.remainingStoryHours - l;
			u[e] = r > 0 ? {
				...n,
				remainingStoryHours: r,
				lastAdvancedRoundId: t || n.lastAdvancedRoundId || null
			} : {
				...n,
				remainingStoryHours: 0,
				status: "ready",
				expired: !0,
				expiredAtStoryHours: c.totalStoryHours
			};
		} else Number.isInteger(n.remainingRounds) ? n.remainingRounds > 1 && (u[e] = {
			...n,
			remainingRounds: n.remainingRounds - 1,
			lastAdvancedRoundId: t || n.lastAdvancedRoundId || null
		}) : u[e] = n;
	}
	let f = (e, n) => e.map((e) => {
		if (!l || e?.expired || !Number.isFinite(e?.remainingStoryHours)) return [e];
		let r = e.remainingStoryHours - l;
		if (r > 0) return [{
			...e,
			remainingStoryHours: r,
			lastAdvancedRoundId: t || e.lastAdvancedRoundId || null
		}];
		let i = e.duration?.key === "death22h" || e.onExpire === "death" || e.expiryEffect === "death", a = i ? "dead" : "expired";
		return d.push({
			entryId: `${s || "clock"}:${n}:${e.id}`,
			actionId: s || "story-clock",
			operationId: `expire:${n}:${e.id}`,
			operation: "causal.expire",
			scope: Y(o.scope),
			version: o.version + 1,
			data: {
				kind: n,
				id: e.id,
				status: a,
				consequence: i ? "death" : "expiry"
			},
			at: (/* @__PURE__ */ new Date()).toISOString()
		}), [{
			...e,
			remainingStoryHours: 0,
			status: a,
			expired: !0,
			expiredAtStoryHours: c.totalStoryHours,
			...i ? { consequence: {
				type: "death",
				committed: !0
			} } : {}
		}];
	}), p = o.version + 1, m = {
		...o,
		version: p,
		clock: c,
		cooldowns: u,
		anchors: f(o.anchors, "anchor").flat(),
		relations: f(o.relations, "relation").flat(),
		debts: f(o.debts, "debt").flat(),
		ledger: [...o.ledger, ...d],
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	return s && (m.appliedActions[s] = {
		hash: rc({
			elapsedStoryHours: l,
			storyTime: c
		}),
		entryIds: d.map((e) => e.entryId),
		version: p
	}), vh(m, { scope: o.scope });
}
function Oh(e) {
	let t = yh(e, { scope: e?.scope }), n = (e) => ![
		"hidden",
		"private",
		"gm",
		"internal"
	].includes(e.visibility), r = (e) => ({
		id: e.id,
		status: e.status,
		label: e.label,
		type: e.type,
		remainingStoryHours: e.remainingStoryHours,
		expired: e.expired,
		...e.consequence?.committed && e.consequence?.type ? { consequence: {
			type: e.consequence.type,
			committed: !0
		} } : {}
	});
	return {
		schema: t.schema,
		version: t.version,
		scope: Y(t.scope),
		clock: Y(t.clock),
		anchors: t.anchors.filter(n).map(r),
		relations: t.relations.filter(n).map(r),
		debts: t.debts.filter(n).map(r),
		cooldowns: Object.fromEntries(Object.entries(t.cooldowns).filter(([, e]) => n(e)).map(([e, t]) => [e, r({
			...t,
			id: e
		})]))
	};
}
//#endregion
//#region src/battle-state.js
var kh = Object.freeze([
	"idle",
	"active",
	"awaiting_player",
	"judging",
	"committed",
	"narrating",
	"awaiting_next",
	"ended",
	"rewrite"
]), Ah = [
	"statuses",
	"effects",
	"positions",
	"control"
];
function jh({ sessionId: e = `battle-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, chatId: t = "default-chat", branchId: n = "main", location: r = "未设定地点", time: i = "未设定时间", player: a, enemies: o = [], registrySnapshot: s = [], semanticState: c, resourceRules: l = [], scene: u = {}, causalState: d } = {}) {
	let f = {
		chatId: String(t),
		branchId: String(n)
	};
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
			...Y(u)
		},
		actors: {
			player: Y(a || {
				id: "player",
				name: "主角",
				visibleInfo: "可见",
				resources: {},
				techniques: []
			}),
			enemies: Y(o)
		},
		semanticState: {
			statuses: [],
			effects: [],
			positions: {},
			control: "均势",
			...Y(c || {})
		},
		causalState: d ? yh(d, { scope: f }) : gh({ scope: f }),
		resourceRules: Y(l),
		registrySnapshot: Y(s),
		history: [],
		pending: null,
		lastError: null,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function Mh(e, t, n = {}) {
	return {
		...e,
		...n,
		phase: t,
		version: e.version + 1,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function Nh(e, t) {
	if (!t.includes(e.phase)) throw Error(`当前状态 ${e.phase} 不允许此操作，需要 ${t.join("/")}`);
}
function Ph(e) {
	return Nh(e, ["idle", "ended"]), Mh(e, "awaiting_player", {
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
function Fh(e, t = "用户停止") {
	return Mh(e, "ended", { lastError: t });
}
function Ih(e) {
	if (!e || e.schema !== "battle_v2" || !kh.includes(e.phase) || !e.scope || !e.actors || !e.semanticState || !Array.isArray(e.history) || !Array.isArray(e.registrySnapshot)) throw Error("无法恢复：不是有效 battle_v2 会话");
	let t = Y(e);
	if (new vp(t.registrySnapshot), t.resourceRules ||= [], t.causalState = yh(t.causalState, { scope: t.scope }), t.characterPreparation && t.characterPreparation.status !== "confirmed" && (t.characterPreparation = Y(t.characterPreparation)), [
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
function Lh(e = []) {
	return e.flatMap((e) => typeof e == "string" || !Number.isInteger(e.remainingRounds) ? [e] : e.remainingRounds > 1 ? [{
		...e,
		remainingRounds: e.remainingRounds - 1
	}] : []);
}
function Rh(e, { elapsedStoryHours: t = 0, storyTime: n } = {}) {
	Nh(e, ["awaiting_next", "committed"]);
	let r = {
		...e.semanticState,
		effects: Lh(e.semanticState.effects)
	}, i = Dh(e.causalState, {
		roundId: e.roundId,
		scope: e.scope,
		elapsedStoryHours: t,
		storyTime: n
	});
	return Ph({
		...e,
		phase: "ended",
		semanticState: r,
		causalState: i
	});
}
function zh(e) {
	return {
		...Y(e),
		effects: (e.effects || []).filter((e) => typeof e == "string" || [
			"public",
			"player",
			void 0
		].includes(e.visibility))
	};
}
function Bh(e, t) {
	let n = t.positions?.[e.id];
	return typeof n == "string" ? {
		...e,
		visibleInfo: {
			...typeof e.visibleInfo == "object" ? e.visibleInfo : {},
			position: n
		}
	} : e;
}
function Vh(e) {
	return {
		schema: e.schema,
		version: e.version,
		scope: Y(e.scope),
		phase: e.phase,
		round: e.round,
		roundId: e.roundId,
		scene: Y(e.scene),
		semanticState: zh(e.semanticState),
		causalState: Oh(e.causalState),
		player: Bh(Y(e.actors.player), e.semanticState),
		enemies: e.actors.enemies.map((t) => Bh(vc(t), e.semanticState)),
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
function Hh(e) {
	let t = Y(e.actors);
	return e.characterPreparation && e.characterPreparation.status !== "confirmed" && (t.enemies = []), {
		session: {
			id: e.sessionId,
			version: e.version,
			round: e.round,
			phase: e.phase,
			scope: Y(e.scope)
		},
		scene: Y(e.scene),
		actors: t,
		semanticState: Y(e.semanticState),
		causalState: Y(e.causalState),
		resourceRules: Y(e.resourceRules),
		registry: Y(e.registrySnapshot),
		priorCommittedFacts: e.history.filter((e) => ["committed", "complete"].includes(e.status)).map((e) => Y(e.adjudication))
	};
}
function Uh(e, t, n = {}) {
	if (Nh(e, ["awaiting_player"]), !t || typeof t.label != "string" || !t.label.trim()) throw Error("行动需要非空 label");
	if (e.characterPreparation && e.characterPreparation.status !== "confirmed") throw Error("敌方人物资料尚未确认，禁止进入裁定器");
	let r = Hh(e);
	if (t.techniqueId) {
		let n = new vp(e.registrySnapshot), r = n.findTechnique(t.techniqueId);
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
		scope: Y(e.scope),
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
		playerVisibleContext: Vh(e),
		systemPrompt: n.adjudicationPrompt || i.adjudicationPrompt || rh,
		prompt: ih(r, t)
	};
}
function Wh(e) {
	return !e || typeof e != "object" ? typeof e == "string" && e.length > 3 ? [e] : [] : Object.values(e).flatMap(Wh);
}
function Gh(e, t, { allowMock: n = !1 } = {}) {
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
	if (rc(e.before) !== rc(t.semanticState)) throw Error("裁定 before 与当前状态不一致");
	if (!e.after || Array.isArray(e.after) || typeof e.after != "object") throw Error("after 必须是完整对象");
	let r = Object.keys(t.semanticState);
	for (let t of r) if (!(t in e.after)) throw Error(`after 缺少 ${t}`);
	let i = /* @__PURE__ */ new Set([...Ah, ...r]);
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
		after: zh(e.after)
	});
	for (let e of t.actors.enemies.flatMap((e) => Wh(e.hidden))) if (c.includes(e)) throw Error("裁定公开结果包含敌方隐藏信息，拒绝发布");
	let l = e.causalChanges === void 0 ? [] : e.causalChanges;
	if (!Array.isArray(l) || l.some((e) => !e || typeof e != "object" || Array.isArray(e) || !(e.operation || e.type))) throw Error("causalChanges 必须是带 operation/type 的对象数组");
	if (l.some((e) => e.scope && (String(e.scope.chatId) !== String(t.scope.chatId) || String(e.scope.branchId) !== String(t.scope.branchId)))) throw Error("因果变更作用域不匹配");
	return {
		summary: e.summary,
		before: Y(e.before),
		after: Y(e.after),
		reason: e.reason,
		ruleRefs: Y(e.ruleRefs),
		publicEvents: e.publicEvents.map(String),
		...e.resourceChanges === void 0 ? {} : { resourceChanges: Y(o) },
		...e.causalChanges === void 0 ? {} : { causalChanges: Y(l) },
		confidence: Number.isFinite(e.confidence) ? e.confidence : null
	};
}
function Kh(e, t, n) {
	let r = {
		type: "BATTLE_SCENE_PACKET",
		schema: "battle_v2",
		scope: Y(e.scope),
		sessionId: e.sessionId,
		roundId: t.roundId,
		actionId: t.actionId,
		preserveUserPrompt: !0,
		committedFacts: [t.adjudication.summary, ...t.adjudication.publicEvents],
		location: e.scene.location,
		time: e.scene.time,
		publicEvents: Y(e.scene.publicEvents),
		descriptionRequirements: [
			"细致描写本轮交锋对敌手造成的物理与灵力实质创伤/制约",
			"生动描写本轮交锋对周围地形与天地气象造成的剧烈冲击",
			"保持修者境界与功法机理特色，严守敌我可见信息边界"
		],
		prohibitions: [
			"禁止复判本轮行动胜负",
			"禁止新增未提交数值结算",
			"禁止泄露隐藏敌情"
		],
		nextDecisionPoint: "等待玩家选择下一步行动",
		playerVisibleContext: Vh(e),
		originalAction: Y(n.action)
	};
	return r.storyAiDirective = ah(r), r;
}
function qh(e) {
	return typeof e == "string" ? { text: e } : {
		text: String(e?.text || ""),
		pending: e?.pending === !0,
		metadata: Y(e?.metadata || {})
	};
}
async function Jh(e, t, { adjudicator: n, narrator: r, settings: i = {}, signal: a, save: o = () => {}, logger: s = () => {}, onCommit: c = () => {} } = {}) {
	let l = t?.actionId ? e.history.find((e) => e.actionId === t.actionId) : null;
	if (l) return {
		state: e,
		record: Y(l),
		deduplicated: !0
	};
	let u = Uh(e, t, i), d = n?.isMock === !0 || (i.adjudicator?.mode || i.mode) === "mock", f = {
		actionId: u.actionId,
		roundId: u.roundId,
		action: Y(u.action),
		status: "prepared",
		version: e.version,
		before: Y(e.semanticState),
		causalBefore: Y(e.causalState)
	}, p = Mh(e, "judging", {
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
		aiRead: Y(u.context),
		playerVisible: u.playerVisibleContext,
		request: Y(u),
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
			}), ic(a), s({
				kind: "ai_raw_response",
				actionId: u.actionId,
				rawResponse: Y(m),
				repairAttempt: t
			}), h = Gh(m, e, {
				allowMock: d,
				actionId: u.actionId,
				roundId: u.roundId
			}), s({
				kind: "program_validation",
				actionId: u.actionId,
				validation: {
					valid: !0,
					repairAttempt: t
				}
			});
			break;
		} catch (e) {
			if (ic(a), s({
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
		throw p = Mh(p, "awaiting_player", {
			pending: null,
			lastError: e.message,
			history: p.history.map((t) => t.actionId === u.actionId ? {
				...t,
				status: e.name === "AbortError" ? "interrupted" : "rejected",
				error: e.message
			} : t)
		}), a?.aborted || await o(p), e;
	}
	let _ = Y(p.actors);
	for (let e of h.resourceChanges || []) {
		let t = [_.player, ..._.enemies].find((t) => t.id === e.actorId);
		t.resources[e.resource] = e.after;
		let n = t.resourceDefinitions?.find((t) => t.key === e.resource);
		n && (n.current = e.after);
	}
	let v = p.causalState;
	try {
		if ((h.causalChanges || []).length) {
			let t = e.registrySnapshot.flatMap((e) => [...e.ruleRefs, ...e.techniques.flatMap((e) => e.ruleRefs)]).concat((e.resourceRules || []).flatMap((e) => e.ruleRefs || []));
			v = Eh(v, h.causalChanges, {
				actionId: u.actionId,
				roundId: u.roundId,
				scope: e.scope,
				version: p.version,
				knownRuleRefs: t,
				allowMock: d,
				requireRuleRefs: !0
			}).state;
		}
	} catch (e) {
		throw p = Mh(p, "awaiting_player", {
			pending: null,
			lastError: e.message,
			history: p.history.map((t) => t.actionId === u.actionId ? {
				...t,
				status: "rejected",
				error: e.message
			} : t)
		}), await o(p), e;
	}
	p = Mh(p, "committed", {
		actors: _,
		semanticState: Y(h.after),
		causalState: v,
		scene: {
			...p.scene,
			publicEvents: [...p.scene.publicEvents, ...h.publicEvents]
		},
		pending: null
	});
	let y = {
		...f,
		status: "committed",
		version: p.version,
		adjudication: h,
		before: Y(e.semanticState),
		after: Y(p.semanticState),
		causalAfter: Y(p.causalState),
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	y.narrativePacket = Kh(p, y, u), p = {
		...p,
		history: p.history.map((e) => e.actionId === y.actionId ? y : e)
	}, ic(a), await o(p), s({
		kind: "commit",
		actionId: y.actionId,
		playerVisible: Vh(p),
		record: Y(y),
		internal: {
			programValidation: { valid: !0 },
			aiRawResponse: Y(m)
		}
	});
	let b = await c(Y(y), p);
	if (ic(a), b?.allowed === !1) return p = Mh(p, "awaiting_next", {
		lastError: b.reason || "宿主保存待确认；裁定已保留，不重裁",
		history: p.history.map((e) => e.actionId === y.actionId ? {
			...y,
			narrativeError: b.reason
		} : e)
	}), await o(p), {
		state: p,
		record: Y(p.history.find((e) => e.actionId === y.actionId)),
		request: u,
		deduplicated: !1
	};
	if (i.autoNarrative === !1) return p = Mh(p, "awaiting_next"), await o(p), s({
		kind: "narrative_packet",
		actionId: y.actionId,
		packet: y.narrativePacket
	}), {
		state: p,
		record: Y(y),
		request: u,
		deduplicated: !1
	};
	p = Mh(p, "narrating", { pending: {
		actionId: y.actionId,
		roundId: y.roundId
	} }), await o(p);
	let x;
	try {
		x = qh(await r.generate(y.narrativePacket, {
			signal: a,
			logger: s,
			originalPrompt: i.originalPrompt || ""
		})), ic(a);
	} catch (e) {
		throw p = Mh(p, "awaiting_next", {
			pending: null,
			lastError: e.message,
			history: p.history.map((t) => t.actionId === y.actionId ? {
				...y,
				narrativeError: e.message
			} : t)
		}), a?.aborted || await o(p), e;
	}
	let S = {
		...y,
		narrative: x,
		status: x.pending ? "committed" : "complete"
	};
	return p = Mh(p, "awaiting_next", {
		history: p.history.map((e) => e.actionId === y.actionId ? S : e),
		pending: null,
		lastError: null
	}), await o(p), s({
		kind: "narrative_result",
		actionId: y.actionId,
		packet: y.narrativePacket,
		narrative: x
	}), {
		state: p,
		record: Y(S),
		request: u,
		deduplicated: !1
	};
}
async function Yh(e, t, n, { signal: r, save: i = () => {}, logger: a = () => {}, originalPrompt: o = "" } = {}) {
	Nh(e, [
		"awaiting_next",
		"committed",
		"ended"
	]);
	let s = e.history.find((e) => e.actionId === t && ["committed", "complete"].includes(e.status));
	if (!s?.narrativePacket) throw Error("找不到可重写的已提交行动");
	let c = Mh(e, "rewrite", { pending: {
		actionId: t,
		roundId: s.roundId
	} });
	await i(c);
	let l;
	try {
		l = qh(await n.rewrite(s.narrativePacket, s.narrative, {
			signal: r,
			logger: a,
			originalPrompt: o
		})), ic(r);
	} catch (e) {
		throw r?.aborted || await i(Mh(c, "awaiting_next", {
			pending: null,
			lastError: e.message
		})), e;
	}
	let u = {
		...s,
		narrative: l,
		status: l.pending ? "committed" : "complete",
		rewrittenAt: (/* @__PURE__ */ new Date()).toISOString()
	}, d = Mh(c, "awaiting_next", {
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
		record: Y(u)
	};
}
var Xh = {
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
}, Zh = "st-xybattle-content", Qh = "contents", $h = "xybattle.content.index", eg = "xybattle.content.settings", tg = /* @__PURE__ */ new Map();
function ng(e, t) {
	let n = `${e}::${t}`;
	return tg.has(n) || tg.set(n, /* @__PURE__ */ new Map()), tg.get(n);
}
function rg() {
	return Math.random().toString(36).slice(2, 8);
}
function ig(e, t) {
	if (e == null || e === "") return Y(t);
	try {
		return JSON.parse(e);
	} catch {
		return Y(t);
	}
}
function ag(e) {
	return e && typeof e.getItem == "function" && typeof e.setItem == "function";
}
function og(e) {
	return new Promise((t, n) => {
		e.onsuccess = () => t(e.result), e.onerror = () => n(e.error || /* @__PURE__ */ Error("IndexedDB 请求失败"));
	});
}
function sg(e) {
	return new Promise((t, n) => {
		e.oncomplete = () => t(), e.onerror = () => n(e.error || /* @__PURE__ */ Error("IndexedDB 事务失败")), e.onabort = () => n(e.error || /* @__PURE__ */ Error("IndexedDB 事务已中止"));
	});
}
function cg(e, t) {
	e.__xyError = t;
	try {
		e.abort();
	} catch {}
}
var lg = class {
	constructor({ dbName: e = Zh, dbVersion: t = 1, storeName: n = Qh, indexedDB: r = globalThis.indexedDB, localStorage: i = globalThis.localStorage, memory: a = !1 } = {}) {
		this.dbName = e, this.dbVersion = t, this.storeName = n, this.indexedDB = r, this.localStorage = ag(i) ? i : null, this.memoryMode = a || !r || typeof r.open != "function", this.durability = this.memoryMode ? "temporary" : "indexeddb", this.warning = this.memoryMode ? "IndexedDB 不可用，内容只保存在当前运行期间" : null, this.memory = ng(e, n), this.dbPromise = null;
	}
	async ready() {
		return this.memoryMode ? null : (this.dbPromise ||= new Promise((e, t) => {
			let n;
			try {
				n = this.indexedDB.open(this.dbName, this.dbVersion);
			} catch (t) {
				this.memoryMode = !0, this.durability = "temporary", this.warning = t.message, e(null);
				return;
			}
			n.onupgradeneeded = () => {
				let e = n.result;
				if (!e.objectStoreNames.contains(this.storeName)) {
					let t = e.createObjectStore(this.storeName, { keyPath: "id" });
					t.createIndex("updatedAt", "updatedAt", { unique: !1 }), t.createIndex("contentType", "contentType", { unique: !1 });
				}
			}, n.onsuccess = () => e(n.result), n.onerror = () => {
				this.memoryMode = !0, this.durability = "temporary", this.warning = "IndexedDB 打开失败，内容只保存在当前运行期间", e(null);
			}, n.onblocked = () => {
				this.memoryMode = !0, this.durability = "temporary", this.warning = "IndexedDB 被阻塞，内容只保存在当前运行期间", e(null);
			};
		}), this.dbPromise);
	}
	status() {
		return {
			mode: this.durability,
			durable: this.durability === "indexeddb",
			warning: this.warning
		};
	}
	readSettings(e = {}) {
		return ig(this.localStorage?.getItem(eg), e);
	}
	writeSettings(e) {
		let t = X(Y(e || {}));
		return this.localStorage && this.localStorage.setItem(eg, JSON.stringify(t)), t;
	}
	readIndex() {
		let e = ig(this.localStorage?.getItem($h), []);
		return Array.isArray(e) ? e : [];
	}
	writeIndex(e) {
		let t = Array.isArray(e) ? e.map((e) => jp(e)) : [];
		if (this.localStorage) try {
			this.localStorage.setItem($h, JSON.stringify(t));
		} catch (e) {
			this.warning = `内容已写入 IndexedDB，但索引缓存不可用：${e.message}`;
		}
		return t;
	}
	async _readAll() {
		let e = await this.ready();
		return e ? (await og(e.transaction(this.storeName, "readonly").objectStore(this.storeName).getAll())).map(Y) : [...this.memory.values()].map(Y);
	}
	async _read(e) {
		let t = await this.ready();
		return Y(t ? await og(t.transaction(this.storeName, "readonly").objectStore(this.storeName).get(String(e))) : this.memory.get(String(e)));
	}
	async _write(e, { overwrite: t = !0 } = {}) {
		let n = await this.ready();
		if (!n) {
			if (!t && this.memory.has(e.id)) throw Error(`内容已存在：${e.id}`);
			this.memory.set(e.id, Y(e));
			return;
		}
		let r = n.transaction(this.storeName, "readwrite"), i = r.objectStore(this.storeName), a = t ? i.put(Y(e)) : i.add(Y(e));
		a.onerror = () => {
			a.error?.name === "ConstraintError" && cg(r, /* @__PURE__ */ Error(`内容已存在：${e.id}`));
		};
		try {
			await sg(r);
		} catch (e) {
			throw r.__xyError || e;
		}
	}
	async _remove(e) {
		let t = await this.ready();
		if (!t) {
			this.memory.delete(String(e));
			return;
		}
		let n = t.transaction(this.storeName, "readwrite");
		n.objectStore(this.storeName).delete(String(e)), await sg(n);
	}
	async _replaceIndex() {
		let e = await this._readAll();
		return this.writeIndex(e.map(jp).sort((e, t) => String(t.updatedAt).localeCompare(String(e.updatedAt))));
	}
	async list({ contentType: e, type: t, query: n } = {}) {
		let r = e || t;
		return (await this._readAll()).filter((e) => !r || e.contentType === r).filter((e) => !n || `${e.name || ""} ${e.id}`.toLowerCase().includes(String(n).toLowerCase())).sort((e, t) => String(t.updatedAt).localeCompare(String(e.updatedAt))).map((e) => Y(e.entry));
	}
	async listRecords(e = {}) {
		let t = e.contentType || e.type;
		return (await this._readAll()).filter((e) => !t || e.contentType === t).sort((e, t) => String(t.updatedAt).localeCompare(String(e.updatedAt))).map(Y);
	}
	async get(e) {
		let t = await this._read(e);
		return t ? Y(t.entry) : void 0;
	}
	async getRecord(e) {
		return Y(await this._read(e));
	}
	async put(e, t = {}) {
		let n = e?.id ? await this._read(e.id) : void 0, r = Op(e, {
			...t,
			createdAt: t.createdAt || n?.createdAt,
			updatedAt: t.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
		});
		if (n && !t.overwrite) throw Error(`内容已存在：${r.id}`);
		return await this._write(r, { overwrite: t.overwrite !== !1 }), await this._replaceIndex(), Y(r.entry);
	}
	async add(e, t = {}) {
		return this.put(e, {
			...t,
			overwrite: !1
		});
	}
	async save(e, t = {}) {
		return this.put(e, {
			...t,
			overwrite: !0
		});
	}
	async putMany(e, t = {}) {
		if (!Array.isArray(e) || !e.length) return [];
		let n = e.map((e) => {
			let n = e?.entry ? Y(e) : Op(e, t);
			return Mp(n), n;
		}), r = /* @__PURE__ */ new Set();
		for (let e of n) {
			if (r.has(e.id)) throw Error(`内容 id 重复：${e.id}`);
			r.add(e.id);
		}
		let i = await this._readAll(), a = new Set(i.map((e) => e.id));
		if (!t.overwrite) {
			for (let e of n) if (a.has(e.id)) throw Error(`内容已存在：${e.id}`);
		}
		let o = await this.ready();
		if (o) {
			let e = o.transaction(this.storeName, "readwrite"), r = e.objectStore(this.storeName);
			for (let i of n) {
				let n = t.overwrite ? r.put(Y(i)) : r.add(Y(i));
				n.onerror = () => {
					n.error?.name === "ConstraintError" && cg(e, /* @__PURE__ */ Error(`内容已存在：${i.id}`));
				};
			}
			try {
				await sg(e);
			} catch (t) {
				throw e.__xyError || t;
			}
		} else {
			let e = new Map(this.memory);
			try {
				for (let e of n) this.memory.set(e.id, Y(e));
			} catch (t) {
				this.memory.clear();
				for (let [t, n] of e) this.memory.set(t, n);
				throw t;
			}
		}
		return await this._replaceIndex(), n.map((e) => Y(e.entry));
	}
	async importRecords(e, t = {}) {
		return this.putMany(e, t);
	}
	async update(e, t, n = {}) {
		let r = await this._read(e);
		if (!r) throw Error(`内容不存在：${e}`);
		let i = typeof t == "function" ? t(Y(r.entry)) : {
			...r.entry,
			...Y(t)
		};
		if (i.id && i.id !== e) throw Error("编辑不允许修改内容 id，请使用复制");
		return i.id = e, this.put(i, {
			...n,
			overwrite: !0,
			createdAt: r.createdAt
		});
	}
	async remove(e) {
		return await this._read(e) ? (await this._remove(e), await this._replaceIndex(), !0) : !1;
	}
	async delete(e) {
		return this.remove(e);
	}
	async copy(e, t = {}) {
		let n = await this._read(e);
		if (!n) throw Error(`内容不存在：${e}`);
		let r = t.id || `${n.id}-copy-${Date.now().toString(36)}-${rg()}`;
		if (await this._read(r)) throw Error(`内容已存在：${r}`);
		let i = Y(n.entry);
		i.id = r, i.name = t.name ? t.name : `${i.name} 副本`;
		let a = new Map((i.techniques || []).map((e, t) => [e.id, `${r}.technique-${t + 1}`])), o = (e) => {
			if (typeof e == "string") {
				let t = e;
				for (let [e, n] of a) t = t.replace(RegExp(`(^|[^A-Za-z0-9_.-])${e.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}(?=[:\\s,;.)]|$)`, "g"), `$1${n}`);
				return t;
			}
			return Array.isArray(e) ? e.map(o) : e && typeof e == "object" ? Object.fromEntries(Object.entries(e).map(([e, t]) => [e, o(t)])) : e;
		}, s = o(i);
		return s.techniques.forEach((e, t) => {
			e.id = `${r}.technique-${t + 1}`;
		}), this.put(s, { contentType: n.contentType });
	}
	async clear() {
		let e = await this._readAll(), t = await this.ready();
		if (!t) this.memory.clear();
		else {
			let e = t.transaction(this.storeName, "readwrite");
			e.objectStore(this.storeName).clear(), await sg(e);
		}
		return this.writeIndex([]), e.length;
	}
	async exportContents(e, t = {}) {
		let n = e == null ? null : new Set(Array.isArray(e) ? e : [e]);
		return kp((await this._readAll()).filter((e) => !n || n.has(e.id)), t);
	}
	async exportData(e, t = {}) {
		let n = await this.exportContents(e, t);
		return JSON.stringify(n, null, t.pretty === !1 ? 0 : 2);
	}
	async export(e, t = {}) {
		return this.exportData(e, t);
	}
}, ug = {
	id: "xybattle-v2-root",
	class: "xy-root-container"
}, dg = {
	id: "xybattle-v2-panel",
	class: "xy-workbench-panel",
	role: "dialog",
	"aria-label": "独立战斗工作台"
}, fg = { class: "xy-notice-icon" }, pg = { class: "xy-notice-text" }, mg = {
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
		let n = e, r = /* @__PURE__ */ F(!1), i = /* @__PURE__ */ F("workbench"), a = /* @__PURE__ */ F(""), o = new lg(), s = /* @__PURE__ */ F(!1), c = /* @__PURE__ */ F(!1), l = /* @__PURE__ */ Yt(null), u = /* @__PURE__ */ Yt(n.controller.playerView()), d = /* @__PURE__ */ Yt(n.controller.state);
		function f() {
			u.value = n.controller.playerView(), d.value = n.controller.state;
		}
		n.controller.onChange = () => {
			f();
		};
		let p = G(() => u.value.phase === "judging"), m = G(() => {
			let e = u.value.phase;
			return e === "judging" ? "裁定中" : e === "narrating" ? "正文中" : e === "awaiting_next" ? "待下轮" : "";
		}), h = /* @__PURE__ */ Lt({
			x: null,
			y: null
		}), g = null, _ = !1, v = G(() => h.x === null || h.y === null ? {} : {
			left: `${h.x}px`,
			top: `${h.y}px`,
			right: "auto",
			bottom: "auto"
		});
		function y(e) {
			g = {
				startX: e.clientX,
				startY: e.clientY,
				initialLeft: e.currentTarget.offsetLeft,
				initialTop: e.currentTarget.offsetTop
			}, _ = !1, e.currentTarget.setPointerCapture?.(e.pointerId);
			let t = (e) => {
				if (!g) return;
				let t = e.clientX - g.startX, n = e.clientY - g.startY;
				if (Math.abs(t) + Math.abs(n) > 5) {
					_ = !0;
					let e = window.innerWidth - 70, r = window.innerHeight - 70;
					h.x = Math.max(10, Math.min(e, g.initialLeft + t)), h.y = Math.max(10, Math.min(r, g.initialTop + n));
				}
			}, n = (e) => {
				g = null, window.removeEventListener("pointermove", t), window.removeEventListener("pointerup", n);
			};
			window.addEventListener("pointermove", t), window.addEventListener("pointerup", n);
		}
		function b() {
			if (_) {
				_ = !1;
				return;
			}
			r.value = !r.value;
		}
		function x() {
			r.value = !1;
		}
		function S(e) {
			e.key === "Escape" && r.value && x();
		}
		br(() => {
			window.addEventListener("keydown", S), o.ready().then(() => n.controller.hydrateContentStore?.(o)).then(() => {
				o.status().warning && (a.value = o.status().warning);
			}).catch((e) => {
				a.value = `内容库读取失败：${e.message}`;
			});
		}), wr(() => {
			window.removeEventListener("keydown", S);
		});
		async function C() {
			try {
				if (a.value = "", n.controller.hostAdapter && (n.controller.state.characterPreparation?.status !== "confirmed" || n.controller.state.characterPreparation?.profileSchema !== "battle_combat_profile_v2")) {
					s.value = !0, await w();
					return;
				}
				n.controller.start(), f();
			} catch (e) {
				a.value = e.message;
			}
		}
		async function w() {
			c.value = !0, l.value = null;
			try {
				a.value = "", l.value = await n.controller.prepareCharacters();
			} catch (e) {
				a.value = e.message;
			} finally {
				c.value = !1;
			}
		}
		function T({ edits: e, removeIds: t }) {
			try {
				n.controller.confirmCharacters(e, { removeIds: t }), l.value = null, s.value = !1, n.controller.start(), f();
			} catch (e) {
				a.value = e.message;
			}
		}
		function ee() {
			n.controller.cancelCharacterPreparation(), l.value = null, s.value = !1;
		}
		async function te() {
			try {
				a.value = "", n.controller.continueNext(), f();
			} catch (e) {
				a.value = e.message;
			}
		}
		function E() {
			try {
				a.value = "", n.controller.stop(), f();
			} catch (e) {
				a.value = e.message;
			}
		}
		async function ne({ label: e, techniqueId: t }) {
			try {
				a.value = "", await n.controller.submit({
					label: e,
					techniqueId: t || null
				}), f();
			} catch (e) {
				a.value = e.message;
			}
		}
		async function D() {
			try {
				a.value = "";
				let e = d.value.history?.filter((e) => ["committed", "complete"].includes(e.status)).at(-1);
				if (!e) return;
				await n.controller.rewrite(e.actionId), f();
			} catch (e) {
				a.value = e.message;
			}
		}
		async function re() {
			try {
				a.value = "";
				let e = d.value.history?.filter((e) => ["committed", "complete"].includes(e.status)).at(-1);
				if (!e) return;
				let t = n.hostAdapter?.scope?.() || d.value.scope;
				await n.controller.queueMainStory(e, t), a.value = "场景包已交给宿主适配器；请在酒馆正常发送下一条 Prompt。", f();
			} catch (e) {
				a.value = e.message;
			}
		}
		function ie() {
			try {
				n.controller.skipPendingNarrative(), a.value = "已跳过本轮正文，裁定事实已完整保留", f();
			} catch (e) {
				a.value = e.message;
			}
		}
		async function ae() {
			try {
				let e = await n.controller.retryHostPersistence();
				a.value = e?.confirmed ? "宿主持久化已确认" : `保存待确认：${e?.reason || "无宿主能力"}`, f();
			} catch (e) {
				a.value = e.message;
			}
		}
		function oe(e) {
			try {
				n.controller.setSettings(e), a.value = "独立机枢设定已保存；凭据仅保存在当前浏览器本地，不写入战报或导出", f();
			} catch (e) {
				a.value = e.message;
			}
		}
		function O() {
			try {
				n.controller.importScene(Xh), a.value = "已成功载入《叠浪玄潮决》演示场景", f();
			} catch (e) {
				a.value = e.message;
			}
		}
		function se() {
			nh(`battle-v2-save-${Date.now()}.json`, n.controller.exportData());
		}
		function ce() {
			nh(`battle-v2-public-${Date.now()}.json`, JSON.stringify(n.controller.playerView(), null, 2));
		}
		function le() {
			nh(`battle-v2-public-logs-${Date.now()}.json`, n.controller.logExport());
		}
		function ue() {
			nh(`battle-v2-developer-logs-${Date.now()}.json`, n.controller.debugLogExport());
		}
		async function fe() {
			await navigator.clipboard.writeText(n.controller.debugLogExport()), a.value = "已复制完整天道开发审计日志";
		}
		function pe(e) {
			try {
				n.controller.importScene(e), a.value = "场景已成功导入", f();
			} catch (e) {
				a.value = e.message;
			}
		}
		function me(e) {
			try {
				n.controller.importRegistry(e), a.value = "功法 Registry 已成功导入", f();
			} catch (e) {
				a.value = e.message;
			}
		}
		function he(e) {
			try {
				n.controller.importData(e), a.value = "当前分支战局存档已恢复", f();
			} catch (e) {
				a.value = e.message;
			}
		}
		function ge(e) {
			a.value = "内容库已更新；已开始的战斗仍使用各自的 registry snapshot", e?.action === "delete" && f();
		}
		function _e(e) {
			nh(`xybattle-content-${Date.now()}.json`, e);
		}
		function ve(e) {
			try {
				n.controller.applyContentEntries(e), a.value = "已将选中内容应用到本场注册表；正在进行的战斗不会被改写", f();
			} catch (e) {
				a.value = e.message;
			}
		}
		let ye = G(() => ({
			scene: d.value.scene,
			actors: d.value.actors,
			semanticState: d.value.semanticState,
			resourceRules: d.value.resourceRules
		})), be = G(() => X(Hh(d.value), n.controller.secrets()));
		return t({
			open: () => {
				r.value = !0;
			},
			close: () => {
				r.value = !1;
			}
		}), (t, n) => (z(), B("div", ug, [V("button", {
			ref: "launcherRef",
			id: "xybattle-v2-launcher",
			class: k(["xy-launcher-seal", {
				"is-active": r.value,
				"is-judging": p.value
			}]),
			style: de(v.value),
			"aria-label": "开启水·弦独立战斗工作台",
			onPointerdown: y,
			onClick: b
		}, [
			n[3] ||= V("div", { class: "xy-seal-ring" }, null, -1),
			n[4] ||= V("div", { class: "xy-seal-inner" }, [V("span", { class: "xy-seal-icon" }, "⚔"), V("span", { class: "xy-seal-text" }, "战斗")], -1),
			m.value ? (z(), B("span", {
				key: 0,
				class: k(["xy-launcher-badge", "bg-" + u.value.phase])
			}, A(m.value), 3)) : U("", !0)
		], 38), H(Za, { name: "xy-modal-fade" }, {
			default: Nn(() => [r.value ? (z(), B("div", {
				key: 0,
				class: "xy-modal-backdrop",
				onClick: us(x, ["self"])
			}, [V("section", dg, [
				H($s, {
					scene: u.value.scene,
					"semantic-state": u.value.semanticState,
					round: u.value.round || 0,
					version: u.value.version || 1,
					phase: u.value.phase || "idle",
					scope: u.value.scope || {
						chatId: "",
						branchId: ""
					},
					"current-tab": i.value,
					"adjudicator-mode": e.controller.settings?.adjudicator?.mode || "unconfigured",
					"log-count": e.controller.logs?.length || 0,
					"onUpdate:tab": n[0] ||= (e) => i.value = e,
					onClose: x
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
				H(Za, { name: "xy-notice-slide" }, {
					default: Nn(() => [a.value || d.value.lastError ? (z(), B("div", {
						key: 0,
						class: k(["xy-notice-banner", { "is-error": !!d.value.lastError }]),
						role: "status"
					}, [
						V("span", fg, A(d.value.lastError ? "⚠️" : "✨"), 1),
						V("span", pg, A(a.value || d.value.lastError || d.value.hostSync?.reason), 1),
						V("button", {
							class: "xy-notice-dismiss",
							onClick: n[1] ||= (e) => {
								a.value = "", d.value.lastError = "";
							}
						}, "✕")
					], 2)) : U("", !0)]),
					_: 1
				}),
				V("div", { class: k(["xy-content-body xy-custom-scroll", { "is-scrollable": i.value !== "workbench" || s.value }]) }, [
					i.value === "workbench" && s.value ? (z(), na(th, {
						key: 0,
						preparation: l.value,
						busy: c.value,
						onPrepare: w,
						onRetry: w,
						onConfirm: T,
						onCancel: ee
					}, null, 8, ["preparation", "busy"])) : U("", !0),
					I(H(sf, {
						view: u.value,
						state: d.value,
						controller: e.controller,
						onStart: C,
						onNext: te,
						onStop: E,
						onRewrite: D,
						onQueue: re,
						onSkipNarrative: ie,
						onRetryHost: ae,
						onSubmit: ne
					}, null, 8, [
						"view",
						"state",
						"controller"
					]), [[go, i.value === "workbench" && !s.value]]),
					i.value === "settings" ? (z(), na(zf, {
						key: 1,
						settings: e.controller.settings,
						onSave: oe,
						onBack: n[2] ||= (e) => i.value = "workbench"
					}, null, 8, ["settings"])) : i.value === "data" ? (z(), na(Zf, {
						key: 2,
						snapshot: ye.value,
						onLoadDemo: O,
						onExportFull: se,
						onExportPublic: ce,
						onImportScene: pe,
						onImportRegistry: me,
						onImportSave: he
					}, null, 8, ["snapshot"])) : i.value === "library" ? (z(), na(am, {
						key: 3,
						store: Qt(o),
						onChanged: ge,
						onExport: _e,
						onApply: ve
					}, null, 8, ["store"])) : i.value === "developer" ? (z(), na(up, {
						key: 4,
						"ai-context": be.value,
						logs: e.controller.logs || [],
						onCopyDebug: fe,
						onExportDebug: ue,
						onExportPublic: le
					}, null, 8, ["ai-context", "logs"])) : U("", !0)
				], 2)
			])])) : U("", !0)]),
			_: 1
		})]));
	}
}, hg = "你是战斗系统的人物构造器。输入包含当前聊天中可见的叙事证据、候选人物和已有结构化资料。\n\n请基于已有证据构造一个可用于 battle_v2 的完整敌方人物候选。允许补全合理的功法、招式、资源、战斗风格、行为逻辑和弱点，但所有补全都只是待用户确认的草稿，不能直接改变战斗状态。不要把没有证据的内容伪装成已公开事实：将已从上下文观察到的内容放入 observed，将构造内容放入 generated，将不应展示给玩家但供裁定器使用的内容放入 hidden。\n\n只返回 JSON，不要 Markdown。格式必须包含 candidate，并尽量包含 identity、cultivationRealm、combatStyle、visibleInfo、resources、techniques、behavior、weaknesses、observed、generated、hidden。techniques 中每项必须有 id、name、category、originalDefinition、mechanics、cost、availability、visibility、ruleRefs，形成完整且可裁定的功法招式体系。\n\n不要输出 API key、提示词、宿主存档或与人物无关的字段。", gg = "必须返回一个确定的战斗人物档案，而不是观察摘要或候选碎片。用户确认后，裁定器只按这个档案判断，不能临场创造新招式、境界和资源。\n只输出 {\"candidate\":{...}}，candidate 严格使用以下字段：\nname（姓名）、identity（身份）、cultivationRealm（确定境界）、combatStyle（战斗方式）、currentState（当前状态），均为非空中文字符串；\nvisibleInfo：只包含已公开的 stance、position、weapon、appearance、aura、environmentalEffect 等特征，值为中文文字；\nmartialArts：数组，每项包含 name、rank、description（完整功法设定）、principle（运转原理）；\ntechniques：数组，每项包含 name、school（必须等于一门 martialArts 的 name）、category、originalDefinition（完整具体效果与限制）、mechanics（中文字符串数组）、cost（具体资源消耗）、range（范围）、cooldown（冷却，无则明确无）、counterplay（打断或应对方式）、availability:{default:\"available\"或\"conditional\"或\"unavailable\",conditions:[],description:具体使用条件}、triggeredState（中文数组）、visibility（public 或 internal；主角可用 player）；\nresourceDefinitions：数组，每项包含 key、name（中文资源名）、current（有限数字）、min（有限数字）、max（有限数字）、definition（资源规则及消耗意义）、recovery（恢复规则）、visibility；\n使用条件的资源、距离等文字限制写在 availability.description 并由裁定器校验；只有依赖明确语义状态标记时使用 default=conditional，同时给 requires:[{path:\"statuses\",op:\"includes\",value:\"已确认的状态标记\"}]。不要生成没有解锁条件的永久锁定招式。\nbehavior:{preference:战斗偏好,opening:起手选择,tactics:[具体战术],retreat:撤退条件}；weaknesses:[具体弱点与限制]；hidden:{}（仅裁定可知的隐秘）。\n严禁把结构包在 observed、generated、battleResourceModel 里，严禁把“待裁定”“未知”“可能具备”当作已完成的定义。不要生成内部 id、规则引用、来源追踪和确认元数据，程序会生成这些字段。\n敌人：根据境界与证据构造自洽的功法和固定招式（通常3~6招），缺乏证据的细节允许构造，但不是已公开事实；未暴露招式 visibility=internal。已观察到的招式可以 public，并补齐它确定的完整规则。\n主角（side=player）：必须依据聊天、用户人设、导入档案和已拥有功法还原，不能凭空添加功法或提升境界。上下文 registry 的定义可供精确匹配引用，不能因为库中有某功法就视为主角拥有。关键资料缺失则留空，交由用户补充，绝不能代入演示主角。\n来源冲突在本次构造中形成一个一致草稿，供用户审核。不要丢掉已知的限制、弱点或完整功法定义。", _g = `你是独立战斗系统的人物档案构造器。请先读取上下文证据，再生成一份可由用户核对、确认并用于实际战斗裁定的完整档案。

${gg}

资料确认前不写入战斗状态；确认后固定人物境界、功法和招式定义，后续裁定只结算行动、资源、伤势、持续效果与位置变化，不重新构造人物。所有文本使用清楚的中文，不输出凭据、宿主存档或提示词。`;
function vg(e) {
	let t = typeof e == "string" ? e.trim() : "";
	return !t || t === hg.trim() ? _g : t;
}
function yg(e, t) {
	return (typeof e == "string" ? e.trim() : "") || t;
}
//#endregion
//#region src/adapters.js
function bg(e = {}) {
	let t = Number(e.characterMaxOutput ?? 8e3);
	if (!Number.isInteger(t) || t < 1024) throw Error("人物档案输出上限必须是至少 1024 的整数");
	let n = {
		mode: "unconfigured",
		endpoint: "",
		model: "",
		maxOutput: 1600,
		temperature: .2,
		repairAttempts: 2,
		timeoutMs: 6e4
	}, r = {
		...n,
		...e.adjudicator || {}
	};
	if (!e.adjudicator) for (let t of Object.keys(n).concat("apiKey")) e[t] !== void 0 && (r[t] = e[t]);
	let i = {
		...n,
		mode: "main_story",
		temperature: .7,
		...e.narrator
	};
	!e.narrator && e.mode === "mock" && (i.mode = "mock"), !e.narrator && e.mode === "http" && Object.assign(i, {
		...r,
		repairAttempts: 0
	});
	for (let e of [r, i]) {
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
		adjudicator: r,
		narrator: i,
		autoNarrative: e.autoNarrative !== !1,
		originalPrompt: e.originalPrompt || "",
		characterMaxOutput: t,
		characterCompletionPrompt: vg(e.characterCompletionPrompt),
		adjudicationPrompt: yg(e.adjudicationPrompt, rh),
		developerLogs: e.developerLogs !== !1
	};
}
function xg(e) {
	if (e && typeof e == "object") return Y(e);
	let t = String(e || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
	try {
		return JSON.parse(t);
	} catch {
		let e = t.indexOf("{"), n = t.lastIndexOf("}");
		if (e >= 0 && n > e) return JSON.parse(t.slice(e, n + 1));
		throw Error("AI 响应不是合法 JSON");
	}
}
var Sg = class {
	async judge() {
		throw Error("未配置裁定 AI；请在独立设置中选择 HTTP，或明确选择离线 Mock 演示");
	}
}, Cg = class {
	async generate() {
		throw Error("未配置正文 AI；默认可选择主剧情一次性注入");
	}
	async rewrite() {
		return this.generate();
	}
}, wg = class {
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
}, Tg = class extends wg {
	constructor() {
		super(), this.mode = "packet";
	}
}, Eg = class {
	constructor() {
		this.calls = [], this.isMock = !0;
	}
	async judge(e, { signal: t } = {}) {
		ic(t), this.calls.push(Y(e));
		let n = Y(e.context.semanticState), r = Y(n), i = e.action.techniqueId;
		"潮眼" in r && i === "chaoyan" && (r.潮眼 = !0), "回弦" in r && i === "huixian" && (r.回弦 = !0), "站位" in r && i === "xianshi" && (r.站位 = "中近距"), "压制" in r && i === "dielang" && (r.压制 = "我方取得节奏"), "破绽" in r && i === "fanyin-chaoyan" && (r.破绽 = ["敌方节奏出现可见偏差"]), r.statuses = [.../* @__PURE__ */ new Set([...r.statuses || [], ...i ? [`${i}:triggered`] : []])], r.effects = [...(r.effects || []).filter((e) => e.id !== `mock-${i}`), ...i ? [{
			id: `mock-${i}`,
			label: `${i}余势`,
			techniqueId: i,
			remainingRounds: 2,
			visibility: "public",
			ruleRefs: ["mock.semantic.1"]
		}] : []];
		let a = i === "xianshi" ? "【对敌影响】弦音水网无形延展缠缚敌手重靴下盘，敌方冲锋攻势受阻，重心脱节" : i === "dielang" ? "【对敌影响】三重重浪连续砸击敌方护体煞气罡罩，产生钝力冲击，逼退敌方并造成硬直破绽" : `【对敌影响】${e.action.label}迫使敌方防御身法出现停滞`, o = i === "xianshi" ? "【环境剧变】试剑台周遭弥漫水汽被清越琴音撕裂重聚，在青石板缝隙间织成微光水网" : i === "dielang" ? "【环境剧变】湖面激荡掀起半人高碧青水浪屏风，青玄石台受水压与煞气碰撞震裂数处" : "【环境剧变】气劲与灵波激荡四周天地环境", s = `${e.action.label}造成可观察的节奏变化`;
		return {
			summary: `离线裁定：${e.action.label}。${a}；${o}。`,
			before: n,
			after: r,
			reason: "独立裁定预设推演：功法起手与机理契合水域环境，达成对敌实质牵制与天地水势共鸣。",
			ruleRefs: ["mock.semantic.1"],
			publicEvents: [
				s,
				a,
				o
			],
			confidence: .95
		};
	}
}, Dg = class {
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
async function Og(e, t, n = {}) {
	if (!e.endpoint || !e.model) throw Error("HTTP 适配器缺少 endpoint 或 model");
	ic(n.signal);
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
		body: Y(s)
	});
	try {
		let t = await fetch(nc(e.endpoint), {
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
var kg = class {
	constructor(e = {}) {
		this.config = {
			timeoutMs: 6e4,
			repairAttempts: 2,
			...e
		}, this.isMock = !1;
	}
	async judge(e, t = {}) {
		let n = await Og({
			...this.config,
			temperature: this.config.temperature ?? e.settings.temperature,
			maxOutput: this.config.maxOutput ?? e.settings.maxOutput
		}, [{
			role: "system",
			content: e.systemPrompt || rh
		}, {
			role: "user",
			content: e.prompt
		}], {
			...t,
			jsonMode: !0
		});
		try {
			return xg(n.content);
		} catch (e) {
			throw e.rawContent = n.content, e;
		}
	}
	async repair(e, t, n, r = {}) {
		let i = [{
			role: "system",
			content: "这是结构修复；保持原行动裁定事实与对敌对环境影响，禁止重新裁定。只修复 JSON 和被程序指出的字段。"
		}, {
			role: "user",
			content: `${e.prompt}\n原返回：${JSON.stringify(t)}\n程序拒绝原因：${n.message}`
		}];
		return xg((await Og(this.config, i, {
			...r,
			jsonMode: !0
		})).content);
	}
}, Ag = class {
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
			content: `依据已提交战斗场景描写，禁止复判；禁止新增未提交结算。\n${ah(t, e)}`
		}, {
			role: "user",
			content: e || "继续描写这一已提交战斗场景。"
		}], i = await Og(this.config, r, n);
		return {
			text: typeof i.content == "string" ? i.content : JSON.stringify(i.content),
			metadata: i.metadata
		};
	}
	async rewrite(e, t, n = {}) {
		return this.generateFromBattlePacket(`${n.originalPrompt ?? this.config.originalPrompt ?? ""}\n重写正文，保持提交事实：${t?.text || ""}`, e, n);
	}
}, jg = "battle_v2";
function Mg(e) {
	return JSON.stringify([String(e.chatId || "default-chat"), String(e.branchId || "main")]);
}
var Ng = class e {
	constructor(e = globalThis.localStorage, t = {
		chatId: "default-chat",
		branchId: "main"
	}) {
		this.storage = e && typeof e.getItem == "function" ? e : null, this.scope = {
			chatId: String(t.chatId || "default-chat"),
			branchId: String(t.branchId || "main")
		}, this.token = encodeURIComponent(Mg(this.scope)), this.memory = /* @__PURE__ */ new Map();
	}
	withScope(t) {
		return new e(this.storage, t);
	}
	key(e) {
		return `${jg}.${e}.${this.token}`;
	}
	readSettings() {
		return this.read(`${jg}.settings`, this.read(this.key("settings"), {}));
	}
	writeSettings(e) {
		let t = X(e);
		return this.write(`${jg}.settings`, t), t;
	}
	readSession() {
		return this.read(this.key("session"), null);
	}
	writeSession(e) {
		if (e?.scope && (e.scope.chatId !== this.scope.chatId || e.scope.branchId !== this.scope.branchId)) throw Error("存储作用域不匹配，拒绝串写");
		return this.write(this.key("session"), X(e)), e;
	}
	readLogs() {
		return this.read(this.key("logs"), []);
	}
	replaceLogs(e) {
		return this.write(this.key("logs"), X(e)), e;
	}
	appendLog(e) {
		let t = [...this.readLogs(), {
			...e,
			at: (/* @__PURE__ */ new Date()).toISOString()
		}].slice(-300);
		return this.replaceLogs(t);
	}
	clear() {
		for (let e of ["session", "logs"]) {
			let t = this.key(e);
			typeof this.storage?.removeItem == "function" ? this.storage.removeItem(t) : this.storage?.setItem && this.storage.setItem(t, "");
		}
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
}, Pg = "xybattle.credentials.v1";
function Fg(e) {
	if (e !== void 0) return e && typeof e.getItem == "function" && typeof e.setItem == "function" ? e : null;
	try {
		let e = globalThis?.localStorage;
		return e && typeof e.getItem == "function" && typeof e.setItem == "function" ? e : null;
	} catch {
		return null;
	}
}
function Ig() {
	return {
		adjudicator: { apiKey: "" },
		narrator: { apiKey: "" }
	};
}
function Lg(e) {
	let t = Fg(e);
	if (!t) return Ig();
	try {
		let e = t.getItem(Pg);
		if (!e) return Ig();
		let n = JSON.parse(e);
		return {
			adjudicator: { apiKey: typeof n?.adjudicator?.apiKey == "string" ? n.adjudicator.apiKey : "" },
			narrator: { apiKey: typeof n?.narrator?.apiKey == "string" ? n.narrator.apiKey : "" }
		};
	} catch {
		return Ig();
	}
}
function Rg(e, t) {
	let n = Fg(t);
	if (!n) return !1;
	let r = {
		version: 1,
		adjudicator: { apiKey: String(e?.adjudicator?.apiKey || "") },
		narrator: { apiKey: String(e?.narrator?.apiKey || "") }
	};
	try {
		return !r.adjudicator.apiKey && !r.narrator.apiKey ? n.removeItem?.(Pg) : n.setItem(Pg, JSON.stringify(r)), !0;
	} catch {
		return !1;
	}
}
//#endregion
//#region src/character-preparation.js
var zg = "battle_character_preparation_v1", Bg = Object.freeze({
	ai_extracted: 0,
	ai_inferred: 0,
	ai_completed: 0,
	context_explicit: 0,
	database: 0,
	mvu_dynamic: 0,
	user_confirmed: 0
}), Vg = /* @__PURE__ */ new Set([
	"apiKey",
	"api_key",
	"authorization",
	"token",
	"password",
	"secret"
]), Hg = /* @__PURE__ */ new Set([
	"__proto__",
	"prototype",
	"constructor"
]), Ug = [
	["enemies", "context_explicit"],
	["opponents", "context_explicit"],
	["hostiles", "context_explicit"],
	["actors.enemies", "context_explicit"],
	["battle.enemies", "context_explicit"],
	["combat.enemies", "context_explicit"],
	["scene.enemies", "context_explicit"],
	["characters", "context_explicit"],
	["actors.characters", "context_explicit"]
], Wg = {
	mvu_dynamic: [
		"getEnemy",
		"getCharacter",
		"lookup",
		"query",
		"read"
	],
	database: [
		"getEnemyProfile",
		"getCharacter",
		"findById",
		"lookup",
		"query",
		"read",
		"get"
	]
};
function Gg(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function $(e) {
	return typeof e == "string" ? e.trim() : e == null ? "" : String(e).trim();
}
function Kg(e, t) {
	return t.split(".").reduce((e, t) => e?.[t], e);
}
function qg(e, t = "enemy") {
	return $(e).toLowerCase().replace(/[^\w\u4e00-\u9fff-]+/g, "-").replace(/^-+|-+$/g, "") || t;
}
function Jg(e) {
	return Array.isArray(e) ? e.map(Jg) : Gg(e) ? Object.fromEntries(Object.entries(e).filter(([e]) => !Vg.has(e) && !Hg.has(e)).map(([e, t]) => [e, Jg(t)])) : e;
}
function Yg(e) {
	return Bg[e] ?? 0;
}
function Xg(e) {
	if (!e) return "context_explicit";
	let t = String(e);
	return t === "mvu" || t === "mvu_dynamic_value" ? "mvu_dynamic" : t === "db" || t === "database_profile" ? "database" : t === "context" || t === "explicit" ? "context_explicit" : t === "ai" || t === "inference" || t === "ai_inference" ? "ai_inferred" : t === "ai_extract" || t === "ai_extracted" ? "ai_extracted" : t === "user" || t === "confirmed" ? "user_confirmed" : t;
}
function Zg(e) {
	return [
		"enemy",
		"opponent",
		"hostile",
		"foe",
		"敌方",
		"对手"
	].includes($(e).toLowerCase());
}
function Qg(e, t, n = "context_explicit") {
	if (typeof e == "string") {
		let r = $(e);
		return r ? {
			id: `enemy-${qg(r, t + 1)}`,
			name: r,
			fields: {
				id: `enemy-${qg(r, t + 1)}`,
				name: r
			},
			source: Xg(n)
		} : null;
	}
	if (!Gg(e)) return null;
	let r = $(e.name || e.characterName || e.displayName || e.title || e.label), i = $(e.id || e.characterId || e.uid || e.uuid);
	if (!r && !i) return null;
	let a = i || `enemy-${qg(r, t + 1)}`, o = Jg({
		...e,
		id: a,
		...r ? { name: r } : {}
	});
	return {
		id: a,
		name: r || a,
		fields: o,
		source: Xg(n)
	};
}
function $g(e) {
	return Array.isArray(e) ? e : typeof e == "string" ? [e] : Gg(e) ? Object.entries(e).map(([e, t]) => Gg(t) ? {
		id: t.id || e,
		...t
	} : {
		id: e,
		name: t
	}) : [];
}
function e_(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = $(n.id || n.name).toLowerCase();
		if (!e) continue;
		let r = t.get(e);
		r ? t.set(e, {
			...r,
			fields: {
				...r.fields,
				...n.fields
			},
			source: r.source || n.source
		}) : t.set(e, n);
	}
	return [...t.values()];
}
function t_(e = {}, { maxCandidates: t = 32 } = {}) {
	let n = [], r = (r, i) => {
		for (let a of $g(r)) {
			let o = Qg(a, n.length, i);
			if (o && (i !== "context_explicit" || Kg(e, "characters") !== r && Kg(e, "actors.characters") !== r || Zg(a?.side || a?.faction || a?.role || a?.alignment || a?.team)) && (n.push(o), n.length >= t)) return;
		}
	};
	for (let [i, a] of Ug) {
		if (n.length >= t) break;
		r(Kg(e, i), a);
	}
	return n.length < t && r(e.enemy || e.opponent || e.hostile, "context_explicit"), e_(n).slice(0, t);
}
function n_(e, t, n) {
	if (n == null) return null;
	let r = t === "ai_extracted" ? n.explicitFacts || n.explicit || n.facts || n : t === "ai_inferred" ? n.inferred || n.inference || n.guess || n.predicted || (n.inferred === !0 ? n.fields : n) : t === "ai_completed" && (n.candidate || n.fields || n.profile) || n, i = Gg(r) ? Jg(r) : { value: Jg(r) };
	return {
		source: Xg(t),
		priority: Yg(Xg(t)),
		data: i
	};
}
function r_(e, t = "") {
	if (Array.isArray(e)) return e.length ? e.flatMap((e, n) => r_(e, `${t}.${n}`)) : t ? [[t, []]] : [];
	if (!Gg(e)) return t ? [[t, e]] : [];
	let n = [];
	for (let [r, i] of Object.entries(e)) {
		if (Vg.has(r) || Hg.has(r) || r === "provenance" || r === "sources" || r === "confirmation") continue;
		let e = t ? `${t}.${r}` : r;
		Gg(i) ? n.push(...r_(i, e)) : n.push([e, i]);
	}
	return n;
}
function i_(e, t, n) {
	let r = t.split("."), i = e;
	r.forEach((e, t) => {
		if (!e || e === "__proto__" || e === "constructor" || e === "prototype") throw Error("人物资料字段路径非法");
		if (t === r.length - 1) i[e] = Y(n);
		else {
			let n = /^\d+$/.test(r[t + 1]);
			!Gg(i[e]) && !Array.isArray(i[e]) && (i[e] = n ? [] : {}), i = i[e];
		}
	});
}
function a_(e, { mvu: t, database: n, inference: r, aiExtracted: i, aiCompleted: a } = {}) {
	return [
		n_(e, "ai_extracted", i),
		n_(e, "ai_inferred", r),
		n_(e, e.source || "context_explicit", e.fields || e),
		n_(e, "database", n),
		n_(e, "mvu_dynamic", t),
		n_(e, "ai_completed", a)
	].filter(Boolean);
}
function o_(e, t = {}) {
	let n = a_(e, t), r = {}, i = {}, a = [];
	for (let e of n) for (let [t, n] of r_(e.data)) {
		let o = i[t], s = Kg(r, t);
		if (o && JSON.stringify(s) !== JSON.stringify(n)) {
			let r = a.find((e) => e.path === t), i = r?.values || [{
				source: o.source,
				value: Y(s)
			}, {
				source: e.source,
				value: Y(n)
			}];
			r ? (i.some((t) => t.source === e.source && JSON.stringify(t.value) === JSON.stringify(n)) || i.push({
				source: e.source,
				value: Y(n)
			}), r.draftValue = Y(n), r.kept = e.source, r.ignored = o.source, r.keptValue = Y(n), r.ignoredValue = Y(s)) : a.push({
				path: t,
				values: i,
				draftValue: Y(n),
				kept: e.source,
				ignored: o.source,
				keptValue: Y(n),
				ignoredValue: Y(s)
			});
		}
		i_(r, t, n), i[t] = {
			source: e.source,
			priority: 0
		};
	}
	let o = $(r.id || e.id) || `enemy-${qg(r.name || e.name)}`, s = $(r.name || e.name || o);
	return r.id = o, r.name = s, i.id ||= {
		source: e.source || "context_explicit",
		priority: Yg(e.source || "context_explicit")
	}, i.name ||= i.id, {
		id: o,
		name: s,
		fields: Jg(r),
		sources: Object.fromEntries(n.map((e) => [e.source, Y(e.data)])),
		provenance: i,
		conflicts: a,
		confirmation: {
			status: "pending",
			required: !0
		}
	};
}
async function s_(e, t, n, r) {
	if (!e) return null;
	let i = {
		candidate: Y(t),
		id: t.id,
		name: t.name,
		context: Y(n),
		source: r
	};
	if (typeof e == "function") return e(i);
	if (r === "mvu_dynamic" && typeof e.getMvuData == "function") {
		let r = n.scope || n;
		return l_(await e.getMvuData({
			type: "message",
			message_id: r.messageId ?? n.messageId
		}), t);
	}
	let a = Wg[r] || [
		"resolve",
		"lookup",
		"query",
		"read",
		"get"
	];
	for (let n of a) if (typeof e[n] == "function") {
		let r = await e[n](i);
		if (r != null) return l_(r, t);
	}
	return null;
}
async function c_(e, t, n, r) {
	if (!e) return {
		value: null,
		status: "missing",
		error: null
	};
	try {
		let i = await s_(e, t, n, r);
		return i && typeof i == "object" && typeof i.status == "string" && ("data" in i || "reason" in i || "error" in i) ? {
			value: i.data ?? null,
			status: i.status,
			error: i.error || i.reason || null,
			metadata: Object.fromEntries(Object.entries(i).filter(([e]) => ![
				"status",
				"data",
				"error",
				"reason"
			].includes(e)))
		} : {
			value: i,
			status: i == null ? "missing" : "matched",
			error: null,
			metadata: {}
		};
	} catch (e) {
		return {
			value: null,
			status: "read_failed",
			error: String(e?.message || e),
			metadata: {}
		};
	}
}
function l_(e, t) {
	if (e == null) return null;
	if (Array.isArray(e)) return e.find((e) => $(e?.id || e?.characterId || e?.uid) === t.id || $(e?.name || e?.characterName) === t.name) || null;
	if (!Gg(e)) return e;
	for (let n of [
		"enemies",
		"opponents",
		"characters",
		"actors",
		"profiles",
		"data"
	]) {
		let r = e[n];
		if (Array.isArray(r)) {
			let e = r.find((e) => $(e?.id || e?.characterId || e?.uid) === t.id || $(e?.name || e?.characterName) === t.name);
			if (e) return e;
		} else if (Gg(r) && (r[t.id] || r[t.name])) return r[t.id] || r[t.name];
	}
	return e[t.id] || e[t.name] ? e[t.id] || e[t.name] : $(e.id || e.characterId || e.uid) === t.id || $(e.name || e.characterName) === t.name ? e : null;
}
async function u_(e, t, n) {
	if (!e) return [];
	let r = typeof e == "function" ? await e(Y(t)) : typeof e.extract == "function" ? await e.extract(Y(t)) : typeof e.inferCandidates == "function" ? await e.inferCandidates(Y(t), { signal: n }) : typeof e.infer == "function" ? await e.infer(Y(t)) : e, i = r?.data ?? r;
	return Array.isArray(i) ? i : i?.enemies || i?.candidates || [];
}
function d_(e = {}) {
	let t = e.explicitFacts || e.explicit || e.facts || e.contextFacts || (e.inferred === !0 ? {} : e.fields) || {}, n = (e.inferred === !0 ? e.fields : e.inferred) || e.inference || e.guess || e.predicted || {};
	return {
		explicit: Gg(t) ? Jg(t) : {},
		inferred: Gg(n) ? Jg(n) : {}
	};
}
function f_(e, t, n) {
	let r = d_(t), i = Qg({
		id: t?.id || t?.characterId,
		name: t?.name || t?.characterName || r.explicit.name
	}, n, "ai_extracted");
	return i && (i.aiExtracted = r.explicit, i.aiInferred = r.inferred), i ? e.find((e) => e.id === i.id || e.name === i.name) || i : null;
}
async function p_(e = {}, { mvu: t, database: n, inference: r, ai: i, maxCandidates: a = 32, signal: o, requireProfiles: s = !1, includePlayer: c = !1 } = {}) {
	if (o?.aborted) throw new DOMException("人物准备已取消", "AbortError");
	let l = t_(e, { maxCandidates: a }), u = i || r, d = typeof u?.inferParticipants == "function" ? await u.inferParticipants(Y(e), { signal: o }) : null, f = d ? d.candidates || [] : await u_(u, e, o), p = s || typeof u?.completeCandidate == "function", m = [...l];
	if (f.forEach((e, t) => {
		let n = f_(m, e, t);
		n && !m.includes(n) && m.push(n);
	}), c) {
		let t = d?.player || e.playerCandidate || {}, n = t.explicitFacts || t.fields || t;
		m.unshift({
			...Qg({
				...n,
				name: t.name || n.name || "",
				id: e.playerId || "player"
			}, 0),
			role: "player",
			extracted: t
		});
	}
	let h = [];
	for (let r of m.slice(0, a)) {
		if (o?.aborted) throw new DOMException("人物准备已取消", "AbortError");
		let i = r.role === "player" ? r.extracted : f.find((e) => $(e?.id || e?.name || e?.characterName) === r.id || $(e?.name || e?.characterName) === r.name), a = i ? d_(i) : {
			explicit: {},
			inferred: {}
		}, [s, c] = await Promise.all([c_(t, r, e, "mvu_dynamic"), c_(n, r, e, "database")]), l = i ? {
			...a.explicit,
			id: i.id || i.characterId || r.id,
			name: i.name || i.characterName || r.name
		} : null, d = o_(r, {
			mvu: s.value,
			database: c.value,
			inference: a.inferred,
			aiExtracted: l
		}), m = { status: u ? "not_requested" : "not_configured" }, g = u && typeof u.completeCandidate == "function" ? u.completeCandidate.bind(u) : null;
		if (g) try {
			let t = await g({
				candidate: Y(d.fields),
				knownFields: Y(d.fields),
				context: Y(e),
				signal: o,
				side: r.role || "enemy"
			}), n = t?.data ?? t?.candidate ?? t?.fields ?? t;
			n && typeof n == "object" ? (d = o_(d, {
				mvu: s.value,
				database: c.value,
				inference: a.inferred,
				aiExtracted: l,
				aiCompleted: n
			}), p && (d.fields = pc(Jg(n), {
				id: r.id,
				side: r.role || "enemy"
			})), m = { status: "matched" }) : m = { status: "missing" };
		} catch (e) {
			p && e.partialProfile && (d.fields = pc(Jg(e.partialProfile), {
				id: r.id,
				side: r.role || "enemy"
			})), m = {
				status: "read_failed",
				error: String(e?.message || e)
			};
		}
		let _ = { status: u ? "not_requested" : "not_configured" }, v = u && (typeof u.fill == "function" ? u.fill.bind(u) : typeof u.fillMissingFields == "function" ? u.fillMissingFields.bind(u) : null);
		if (v && !g) {
			let t = [
				"realm",
				"境界",
				"visibleInfo",
				"resources",
				"techniques",
				"abilities",
				"skills"
			].filter((e) => d.fields?.[e] == null);
			try {
				let n = await v({
					candidate: Y(d.fields),
					knownFields: Y(d.fields),
					missingFields: t,
					context: Y(e),
					signal: o
				}, {
					context: Y(e),
					signal: o
				}), r = n?.data ?? n;
				if (r && typeof r == "object" && n?.status !== "read_failed") {
					let e = r.fields || r.inferred || r;
					d = o_(d, {
						mvu: s.value,
						database: c.value,
						inference: e,
						aiExtracted: l
					});
				}
				_ = n?.status ? {
					status: n.status,
					...n.error || n.reason ? { error: n.error || n.reason } : {}
				} : { status: r ? "matched" : "missing" };
			} catch (e) {
				_ = {
					status: "read_failed",
					error: String(e?.message || e)
				};
			}
		}
		d.sourceStatus = {
			mvu_dynamic: {
				status: s.status,
				...s.error ? { error: s.error } : {},
				...s.metadata || {}
			},
			database: {
				status: c.status,
				...c.error ? { error: c.error } : {},
				...c.metadata || {}
			},
			ai_extract: i ? { status: "matched" } : { status: u ? "missing" : "not_configured" },
			ai_complete: m,
			ai_fill: _
		}, d.role = r.role || "enemy", p && (d.fields = pc(d.fields, {
			id: r.id,
			side: d.role
		}), d.name = d.fields.name, d.validationIssues = gc(d.fields)), h.push(d);
	}
	return {
		schema: zg,
		version: 1,
		status: "awaiting_confirmation",
		requiresCompleteProfiles: p,
		requiresPlayer: c,
		...p ? { profileSchema: oc } : {},
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		scope: Y(e.scope || null),
		candidates: h,
		confirmedAt: null
	};
}
function m_(e) {
	return e ? Array.isArray(e) ? Object.fromEntries(e.map((e) => [e.id, e.fields || e.patch || e])) : e : {};
}
function h_(e, t = {}, { removeIds: n = [], requireName: r = !0 } = {}) {
	g_(e);
	let i = m_(t), a = new Set(n.map(String));
	if (e.requiresPlayer && e.candidates.some((e) => e.role === "player" && a.has(e.id))) throw Error("不能移除主角资料");
	let o = e.candidates.filter((e) => !a.has(String(e.id))).map((t) => {
		let n = i[t.id] || {}, a = Jg(Y(t.fields));
		for (let [e, t] of r_(n)) i_(a, e, t);
		if (e.requiresCompleteProfiles) {
			a = pc(a, {
				id: t.id,
				side: t.role || "enemy"
			});
			let e = gc(a);
			if (e.length) throw Error(`${a.name || "人物"}资料不完整：${e.join("；")}`);
		}
		let o = $(a.id || t.id), s = $(a.name || t.name || o);
		if (!o || r && !s) throw Error(`敌方人物 ${t.id} 缺少 id/name`);
		a.id = o, a.name = s;
		let c = { ...t.provenance };
		for (let [e] of r_(n)) c[e] = {
			source: "user_confirmed",
			priority: Yg("user_confirmed")
		};
		return c.id = {
			source: "user_confirmed",
			priority: Yg("user_confirmed")
		}, c.name = {
			source: "user_confirmed",
			priority: Yg("user_confirmed")
		}, {
			...t,
			id: o,
			name: s,
			fields: a,
			provenance: c,
			confirmation: {
				status: "confirmed",
				required: !0,
				confirmedAt: (/* @__PURE__ */ new Date()).toISOString()
			}
		};
	});
	if (!o.some((e) => e.role !== "player")) throw Error("确认后没有可用的敌方人物");
	if (e.requiresPlayer && o.filter((e) => e.role === "player").length !== 1) throw Error("请先补全并确认主角资料");
	if (new Set(o.map((e) => e.id)).size !== o.length) throw Error("敌方人物 id 重复");
	let s = (/* @__PURE__ */ new Date()).toISOString();
	return {
		...Y(e),
		status: "confirmed",
		confirmedAt: s,
		candidates: o
	};
}
function g_(e) {
	if (!e || e.schema !== "battle_character_preparation_v1" || !Array.isArray(e.candidates)) throw Error("无效的人物准备草稿");
	return e;
}
function __(e) {
	if (g_(e), e.status !== "confirmed" || !e.confirmedAt || e.candidates.some((e) => e.confirmation?.status !== "confirmed")) throw Error("敌方人物资料尚未确认，禁止进入裁定器");
	return e;
}
function v_(e) {
	return __(e), e.candidates.filter((e) => e.role !== "player").map((e) => Y(e.fields));
}
function y_(e, t) {
	if (__(t), !e || !["idle", "ended"].includes(e.phase)) throw Error("只能在战斗开始前写入已确认人物");
	if (t.scope && (String(t.scope.chatId) !== String(e.scope?.chatId) || String(t.scope.branchId) !== String(e.scope?.branchId))) throw Error("人物准备作用域与当前聊天/分支不一致");
	if (t.requiresCompleteProfiles) {
		let n = t.candidates.map((e) => _c(e.fields, e.role || "enemy")), r = n.find((e) => t.candidates.find((t) => t.id === e.actor.id)?.role === "player")?.actor || Y(e.actors.player);
		if (t.candidates.some((e) => e.role !== "player" && e.id === r.id)) throw Error("敌方人物 id 与主角重复");
		let i = n.filter((e) => e.actor.id !== r.id).map((e) => e.actor);
		if ((/* @__PURE__ */ new Set([r.id, ...i.map((e) => e.id)])).size !== i.length + 1) throw Error("敌方人物 id 与主角重复");
		let a = [...e.registrySnapshot.filter((e) => !e.characterProfileId), ...n.map((e) => e.entry)];
		new vp(a);
		let o = /* @__PURE__ */ new Set([...n.map((e) => e.actor.id), ...e.actors.enemies.map((e) => e.id)]), s = [...(e.resourceRules || []).filter((e) => !o.has(e.actorId)), ...n.flatMap((e) => e.resourceRules)], c = Object.fromEntries([r, ...i].filter((e) => e.visibleInfo?.position).map((e) => [e.id, e.visibleInfo.position]));
		return {
			...Y(e),
			actors: {
				player: r,
				enemies: i
			},
			registrySnapshot: a,
			resourceRules: s,
			semanticState: {
				...Y(e.semanticState),
				positions: c
			},
			characterPreparation: Y(t),
			version: Number(e.version || 0) + 1,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
	}
	let n = v_(t);
	if (n.some((t) => t.id === e.actors?.player?.id)) throw Error("敌方人物 id 与主角重复");
	return {
		...Y(e),
		actors: {
			...Y(e.actors),
			enemies: n
		},
		characterPreparation: Y(t),
		version: Number(e.version || 0) + 1,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function b_(e) {
	return g_(e), {
		schema: zg,
		status: e.status,
		scope: Y(e.scope),
		requiresCompleteProfiles: e.requiresCompleteProfiles,
		requiresPlayer: e.requiresPlayer,
		candidates: e.candidates.map((e) => ({
			id: e.id,
			name: e.name,
			role: e.role || "enemy",
			validationIssues: Y(e.validationIssues || []),
			fields: Y(e.fields),
			editableFields: Object.keys(e.fields),
			provenance: Y(e.provenance),
			conflicts: Y(e.conflicts),
			sourceStatus: Y(e.sourceStatus || {}),
			confirmation: Y(e.confirmation)
		}))
	};
}
//#endregion
//#region src/character-source-adapters.js
var x_ = (e) => e == null ? "" : String(e).trim(), S_ = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function C_(e, t) {
	let n = Array.isArray(e) ? e : e && typeof e == "object" ? Object.entries(e).map(([e, t]) => S_(t) ? {
		id: t.id || e,
		...t
	} : {
		id: e,
		name: t
	}) : [], r = x_(t?.id), i = x_(t?.name), a = n.filter((e) => x_(e?.id || e?.characterId || e?.uid) === r || x_(e?.name || e?.characterName || e?.displayName || e?.姓名 || e?.名称) === i);
	if (a.length > 1) throw Error(`人物资料匹配歧义：${r || i}`);
	return a[0] ? Y(a[0]) : null;
}
function w_(e) {
	let t = e?.stat_data ?? e?.data?.stat_data ?? e;
	if (!t || typeof t != "object") return [];
	let n = t.player || t.protagonist || t.主角, r = [
		t.enemies,
		t.opponents,
		t.characters,
		t.actors,
		t.敌方,
		t.对手,
		...n ? [[n]] : []
	].filter(Boolean);
	return r.length ? r.flatMap((e) => Array.isArray(e) ? e : Object.entries(e).map(([e, t]) => S_(t) ? {
		id: t.id || e,
		...t
	} : {
		id: e,
		name: t
	})) : Object.entries(t).filter(([, e]) => S_(e)).map(([e, t]) => ({
		id: t.id || e,
		...t
	}));
}
async function T_({ candidate: e, context: t = {} } = {}, { mvu: n = globalThis.Mvu } = {}) {
	if (!n?.getMvuData) return null;
	let r = t.scope || t, i = r.messageId ?? t.messageId ?? t.message_id;
	if (i == null) throw Error("MVU 当前消息作用域不可用");
	let a = C_(w_(await n.getMvuData({
		type: "message",
		message_id: i
	})), e);
	return a ? {
		...a,
		sourceScope: {
			chatId: r.chatId,
			branchId: r.branchId,
			messageId: i,
			swipeId: r.swipeId
		},
		sourceKind: "mvu_dynamic",
		branchKnown: !0
	} : null;
}
function E_(e) {
	return Object.values(e || {}).flatMap((e) => {
		let t = e?.content;
		if (!Array.isArray(t) || !Array.isArray(t[0])) return [];
		let n = t[0].map((e) => x_(e));
		return t.slice(1).filter(Array.isArray).map((e) => Object.fromEntries(n.map((t, n) => [t, e[n]])));
	});
}
async function D_({ candidate: e } = {}, { database: t = globalThis.AutoCardUpdaterAPI } = {}) {
	if (!t?.exportTableAsJson) return null;
	let n = C_(E_(await t.exportTableAsJson()), e);
	return n ? {
		...n,
		sourceKind: "database",
		sourceScope: { branchKnown: !1 },
		branchKnown: !1
	} : null;
}
async function O_(e) {
	if (!e?.ok) throw Error(`人物 AI HTTP ${e?.status || "失败"}`);
	let t = await e.json();
	if (t?.choices?.[0]?.finish_reason === "length") throw Error("人物档案输出被截断，请提高人物生成输出上限");
	let n = t?.choices?.[0]?.message?.content ?? t?.output_text ?? t;
	if (typeof n == "string") {
		let e = n.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] || n;
		return JSON.parse(e);
	}
	return n;
}
function k_({ endpoint: e, model: t, apiKey: n = "", fetchImpl: r = globalThis.fetch, timeoutMs: i = 6e4, fillTimeoutMs: a = 15e3, maxOutput: o = 5e3, temperature: s = .4, characterCompletionPrompt: c = _g } = {}) {
	if (!e || typeof r != "function") throw Error("人物 AI 需要 endpoint 与 fetch");
	let l = async (a, c, l = i, u) => {
		let d = new AbortController(), f = () => d.abort();
		if (u?.aborted) throw new DOMException("人物 AI 请求已取消", "AbortError");
		u?.addEventListener("abort", f, { once: !0 });
		let p = setTimeout(f, l);
		try {
			return await O_(await r(nc(e), {
				method: "POST",
				headers: {
					"content-type": "application/json",
					...n ? { authorization: `Bearer ${n}` } : {}
				},
				body: JSON.stringify({
					model: t || "",
					temperature: s,
					max_tokens: o,
					response_format: { type: "json_object" },
					messages: [{
						role: "system",
						content: a
					}, {
						role: "user",
						content: `上下文：${JSON.stringify(c)}`
					}]
				}),
				signal: d.signal
			}));
		} finally {
			clearTimeout(p), u?.removeEventListener("abort", f);
		}
	};
	return {
		async inferParticipants(e, { signal: t } = {}) {
			return l("从聊天和人设识别当前实际主角与敌人。返回 {\"player\":{\"name\":\"主角实际姓名\",\"explicitFacts\":{}},\"candidates\":[{\"id\":\"可选稳定标识\",\"name\":\"敌人姓名\",\"explicitFacts\":{},\"inferred\":{}}]}。主角不是助手角色的默认称呼，不得复用演示人物；主角依据不足时 player=null。角色卡仅是证据，不能直接认定其角色是主角。提取已有境界、功法完整设定、当前状态、资源和战斗偏好，明确事实放 explicitFacts；此步不要创造新能力。", Y(e), i, t);
		},
		async inferCandidates(e, { signal: t } = {}) {
			let n = await l("只提取敌方候选人物，返回 {\"candidates\":[{\"id\":\"...\",\"name\":\"...\",\"explicitFacts\":{},\"inferred\":{}}]}。明确事实放 explicitFacts；不确定的内容放 inferred；不要构造完整人物。", Y(e), i, t);
			return Array.isArray(n) ? n : n?.candidates || [];
		},
		async completeCandidate({ candidate: e, knownFields: t, context: n, signal: r, side: a = "enemy" } = {}) {
			let o, s, u;
			for (let d = 0; d < 2; d += 1) try {
				o = await l(`${yg(c, _g)}\n\n以下输出契约优先于上方可编辑风格提示：\n${gg}`, {
					task: "complete_combat_profile",
					side: a,
					candidate: e,
					knownFields: t,
					context: n,
					...d ? { repair: {
						issues: s,
						previous: o
					} } : {}
				}, i, r);
				let f = pc(o, {
					id: e?.id,
					side: a
				});
				if (u = f, s = gc(f), !s.length) return f;
			} catch (e) {
				if (r?.aborted || e.name === "AbortError") throw e;
				s = [e.message];
			}
			throw Object.assign(/* @__PURE__ */ Error(`人物档案仍不完整：${s.join("；")}`), { partialProfile: u });
		},
		async fillMissingFields({ candidate: e, knownFields: t, context: n, signal: r }) {
			let i = await l("仅补全明确缺失字段，返回 {\"fields\":{...},\"inferred\":true}，不得覆盖已有字段。", {
				candidate: e,
				knownFields: t,
				context: n
			}, a, r);
			return i?.fields || i || {};
		}
	};
}
function A_(e = {}) {
	let t = e.mvu || globalThis.Mvu, n = e.database || globalThis.AutoCardUpdaterAPI;
	return {
		mvu: (e) => T_(e, { mvu: t }),
		database: (e) => D_(e, { database: n }),
		...e.inference ? { inference: e.inference } : {}
	};
}
//#endregion
//#region src/battle-controller.js
function j_(e = {}) {
	let t = bg(e), n = t.adjudicator, r = t.narrator;
	return {
		adjudicator: n.mode === "mock" ? new Eg() : n.mode === "http" ? new kg(n) : new Sg(),
		narrator: r.mode === "mock" ? new Dg() : r.mode === "http" ? new Ag(r) : r.mode === "main_story" ? new wg() : r.mode === "packet" ? new Tg() : new Cg()
	};
}
var M_ = class {
	constructor({ storage: e, credentialStorage: t, chatId: n = "default-chat", branchId: r = "main", adjudicator: i, narrator: a, hostAdapter: o, registry: s = new vp(), onChange: c = () => {}, initialScene: l = {}, initialPlayer: u, initialEnemies: d = [], semanticState: f } = {}) {
		this.storage = e instanceof Ng ? e : new Ng(e, {
			chatId: n,
			branchId: r
		}), this.credentialStorage = t, this.registry = s;
		let p = this.storage.readSettings(), m = Lg(this.credentialStorage);
		this.settings = bg({
			...p,
			adjudicator: {
				...p.adjudicator,
				...m.adjudicator
			},
			narrator: {
				...p.narrator,
				...m.narrator
			}
		});
		let h = j_(this.settings);
		this.adjudicator = i || h.adjudicator, this.narrator = a || h.narrator, this.customAdapters = {
			adjudicator: i,
			narrator: a
		}, this.hostAdapter = o, this.onChange = c, this.epoch = 0, this.inFlight = null, this.checkpoints = Promise.resolve(), this.bridgeQueuedAction = null, this.characterPreparation = null, this.characterPreparationRequest = 0, this.initialOptions = {
			registrySnapshot: s.snapshot(),
			player: u || this.defaultPlayer(),
			enemies: d,
			...l,
			semanticState: f
		};
		let g = this.storage.readSession();
		this.state = g ? Ih(g) : jh({
			...this.initialOptions,
			chatId: n,
			branchId: r
		}), g && (this.registry = new vp(this.state.registrySnapshot)), this.logs = this.storage.readLogs(), this.ready = Promise.resolve(), o && (o.start?.(), this.unsubScope = o.subscribeScopeChange?.((e) => {
			this.ready = this.switchScope(e);
		}), this.unsubNarrative = o.subscribeNarrative?.((e) => this.recordHostNarrative(e)), this.ready = this.initializeHost());
	}
	defaultPlayer() {
		let e = this.registry.findEntry?.("gongfa.dielang-xuanchaojue") || this.registry.list().find((e) => e.id === "gongfa.dielang-xuanchaojue") || this.registry.list()[0];
		return {
			id: "player",
			name: "主角",
			visibleInfo: "导入真实场景后再裁定",
			resources: {},
			techniques: e ? [{
				registryId: e.id,
				techniqueIds: e.techniques.map((e) => e.id)
			}] : []
		};
	}
	async initializeHost() {
		return await this.hostAdapter.ready?.(), await this.switchScope(this.hostAdapter.scope?.() || this.state.scope, !1), this;
	}
	async switchScope(e, t = !0) {
		let n = this.storage.readSession();
		t && (this.cancelPending("聊天/分支切换"), this.characterPreparation = null, this.characterPreparationRequest += 1, this.hostAdapter?.clearScenePacket?.());
		let r = String(e?.chatId || this.state.scope.chatId), i = String(e?.branchId || "main");
		if (e?.available === !1) {
			this.cancelPending("当前聊天已没有可用的助手消息锚点"), this.characterPreparation = null, this.characterPreparationRequest += 1, this.hostAdapter?.clearScenePacket?.(), this.storage = this.storage.withScope({
				chatId: r,
				branchId: i
			}), this.storage.clear(), this.logs = [], this.registry = new vp(this.initialOptions.registrySnapshot), this.state = jh({
				...this.initialOptions,
				chatId: r,
				branchId: i
			}), this.state.hostSync = {
				status: "unavailable",
				reason: null
			}, this.emit({ persistHost: !1 });
			return;
		}
		let a = this.state.scope;
		(a.chatId !== r || a.branchId !== i) && (this.characterPreparation = null, this.characterPreparationRequest += 1, this.storage = this.storage.withScope({
			chatId: r,
			branchId: i
		}), n = this.storage.readSession(), this.state = n ? Ih(n) : jh({
			...this.initialOptions,
			chatId: r,
			branchId: i
		}), this.logs = this.storage.readLogs());
		let o = this.epoch, s = await this.hostAdapter?.loadSession?.(e);
		if (o === this.epoch) {
			if (s?.loaded && s.state) {
				let e = Ih(s.state);
				e.scope.chatId === this.state.scope.chatId && e.scope.branchId === this.state.scope.branchId && (!n || e.sessionId === this.state.sessionId && e.version >= this.state.version || Date.parse(e.updatedAt) > Date.parse(this.state.updatedAt) ? (this.state = e, this.storage.writeSession(e)) : this.log({
					kind: "host_local_ahead",
					capability: { reason: "本地checkpoint比宿主新，将重试持久化；不回退回合" }
				}));
			}
			this.registry = new vp(this.state.registrySnapshot), this.emit();
		}
	}
	emit({ persistHost: e = !0 } = {}) {
		if (this.storage.writeSession(X(this.state, this.secrets())), this.onChange(this.state, Vh(this.state)), this.hostAdapter && e) {
			let e = Y(this.state), t = Y(this.hostAdapter.scope?.() || this.state.scope), n = this.epoch;
			if (t.available === !1) return;
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
				}, this.storage.writeSession(X(this.state, this.secrets())), this.onChange(this.state, Vh(this.state))), r;
			});
		}
	}
	secrets() {
		return [this.settings.adjudicator.apiKey, this.settings.narrator.apiKey];
	}
	log(e) {
		this.logs = this.storage.appendLog(X(e, this.secrets()));
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
		}), e.mode !== void 0 && (delete t.adjudicator, delete t.narrator), this.settings = bg(t), this.storage.writeSettings(this.settings), Rg(this.settings, this.credentialStorage), this.setAdapters(j_(this.settings)), this.emit(), this.settings;
	}
	setAdapters({ adjudicator: e, narrator: t } = {}) {
		e && (this.adjudicator = e), t && (this.narrator = t);
	}
	async hydrateContentStore(e) {
		if (!e?.list) throw Error("内容库不可用");
		return this.contentStore = e, e.listRecords ? e.listRecords() : e.list();
	}
	applyContentEntries(e = []) {
		if (this.assertIdleRequest(), !["idle", "ended"].includes(this.state.phase)) throw Error("活动战斗中不能替换本场功法");
		if (!Array.isArray(e) || !e.length) throw Error("至少选择一条内容");
		let t = new vp(e).snapshot(), n = new Set(t.map((e) => e.id)), r = new vp([...this.registry.snapshot().filter((e) => !n.has(e.id)), ...t]);
		return this.registry = r, this.state = {
			...this.state,
			registrySnapshot: r.snapshot(),
			version: this.state.version + 1,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}, this.initialOptions.registrySnapshot = r.snapshot(), this.emit(), r.snapshot();
	}
	characterConfirmationPanel() {
		return this.characterPreparation ? b_(this.characterPreparation) : null;
	}
	async prepareCharacters({ context: e, mvu: t, database: n, inference: r } = {}) {
		if (await this.ready, this.assertIdleRequest(), !["idle", "ended"].includes(this.state.phase)) throw Error("只能在战斗开始前准备敌方人物");
		let i = Y(this.hostAdapter?.scope?.() || this.state.scope);
		if (i.available === !1) throw Error("当前聊天没有可用的助手消息锚点；请先生成新的正文消息。");
		if (i.chatId !== this.state.scope.chatId || i.branchId !== this.state.scope.branchId) throw Error("当前聊天分支已改变");
		let a = this.hostAdapter?.context?.() || {}, o = Array.isArray(a.chat) ? a.chat.slice(-20).map((e) => ({
			role: e.role || (e.is_user ? "user" : "assistant"),
			text: String(e.mes || e.message || "").slice(0, 4e3)
		})) : [], s = a.characters?.[a.characterId], c = {
			...Y(e || {}),
			scope: i,
			recentMessages: o,
			playerId: this.state.actors.player.id,
			playerCandidate: e?.playerCandidate || e?.player || ([
				"主角",
				"演示主角",
				"player"
			].includes(this.state.actors.player.name) ? void 0 : this.state.actors.player),
			persona: {
				name: a.name1 || "",
				description: a.powerUserSettings?.persona_description || a.persona?.description || ""
			},
			characterCard: s ? {
				name: s.name,
				description: s.description || s.data?.description,
				scenario: s.scenario || s.data?.scenario
			} : void 0,
			registry: this.registry.snapshot(),
			enemies: Y(e?.enemies || (this.hostAdapter ? [] : this.state.actors.enemies))
		}, l = this.settings.adjudicator, u = A_({
			mvu: t,
			database: n,
			inference: r || (l.mode === "http" && l.endpoint && l.model ? k_({
				endpoint: l.endpoint,
				model: l.model,
				apiKey: l.apiKey || "",
				timeoutMs: l.timeoutMs,
				maxOutput: this.settings.characterMaxOutput,
				temperature: l.temperature,
				characterCompletionPrompt: this.settings.characterCompletionPrompt
			}) : null)
		}), d = this.epoch, f = ++this.characterPreparationRequest;
		this.characterPreparation = null;
		let p = await p_(c, {
			...u,
			requireProfiles: !!this.hostAdapter,
			includePlayer: !!this.hostAdapter
		});
		if (f !== this.characterPreparationRequest || d !== this.epoch || this.state.scope.chatId !== i.chatId || this.state.scope.branchId !== i.branchId) throw Error("人物读取期间聊天分支已改变或读取已取消，请重新读取");
		return this.characterPreparation = p, this.characterConfirmationPanel();
	}
	confirmCharacters(e = {}, t = {}) {
		if (this.assertIdleRequest(), !this.characterPreparation) throw Error("请先读取敌方人物资料");
		let n = this.hostAdapter?.scope?.() || this.state.scope;
		if (n.chatId !== this.state.scope.chatId || n.branchId !== this.state.scope.branchId) throw Error("当前聊天分支已改变");
		let r = h_(this.characterPreparation, e, t), i = y_(this.state, r);
		return this.registry = new vp(i.registrySnapshot), this.state = i, this.characterPreparation = null, this.emit(), this.state;
	}
	cancelCharacterPreparation() {
		this.characterPreparationRequest += 1, this.characterPreparation = null;
	}
	start() {
		if (this.assertIdleRequest(), this.characterPreparation?.status && this.characterPreparation.status !== "confirmed") throw Error("请先在人物确认页逐项确认全部候选人物");
		if (this.hostAdapter?.scope?.()?.available === !1) throw Error("当前聊天没有可用的助手消息锚点；请先生成新的正文消息。");
		return this.state = Ph(this.state), this.emit(), this.state;
	}
	cancelPending() {
		this.epoch += 1, this.inFlight?.abort(), this.inFlight = null, this.bridgeQueuedAction = null;
	}
	stop(e = "用户停止") {
		return this.cancelPending(), this.hostAdapter?.clearScenePacket?.(), this.state = Fh({
			...this.state,
			history: this.state.history.map((t) => t.status === "prepared" ? {
				...t,
				status: "interrupted",
				error: e
			} : t)
		}, e), this.emit(), this.state;
	}
	continueNext(e = {}) {
		if (this.assertIdleRequest(), this.bridgeQueuedAction) throw Error("本轮场景包仍等待主剧情生成；请先生成正文或跳过本轮正文");
		return this.state = Rh(this.state, e), this.emit(), this.state;
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
			let r = await this.hostAdapter.persistReceipt?.(X(e, this.secrets()), X(t, this.secrets()), n);
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
		}, this.storage.writeSession(X(this.state, this.secrets())), this.log({
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
			record: Y(t),
			deduplicated: !0
		};
		this.assertIdleRequest();
		let n = this.epoch, r = new AbortController();
		this.inFlight = r;
		let i = Y(this.hostAdapter?.scope?.() || this.state.scope), a = async (e) => {
			if (n !== this.epoch) throw new DOMException("作用域已变化", "AbortError");
			this.state = e, this.emit(), await this.checkpoints;
		};
		try {
			let t = await Jh(this.state, e, {
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
					return ic(r.signal), {
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
			}), this.storage.writeSession(X(this.state, this.secrets())), this.onChange(this.state, Vh(this.state)), t;
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
		let r = Y(this.hostAdapter?.scope?.() || this.state.scope), i = async (e) => {
			if (t !== this.epoch) throw new DOMException("作用域已变化", "AbortError");
			this.state = e, this.emit(), await this.checkpoints;
		};
		try {
			let a = await Yh(this.state, e, this.narrator, {
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
		}, this.storage.writeSession(X(this.state, this.secrets())), n?.persisted && n?.confirmed && t && !t.narrative?.text && this.settings.narrator.mode === "main_story" && await this.queueMainStory(t, e), this.onChange(this.state, Vh(this.state)), n;
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
		let t = typeof e == "string" ? JSON.parse(e) : Y(e), n = new vp(t.registry || this.registry.snapshot());
		if (!t.scene || !t.actors?.player || !Array.isArray(t.actors.enemies)) throw Error("场景需 scene、actors.player、actors.enemies");
		for (let e of [t.actors.player, ...t.actors.enemies]) if (!e.id || !e.name) throw Error("角色需id/name");
		if (new Set([t.actors.player, ...t.actors.enemies].map((e) => e.id)).size !== t.actors.enemies.length + 1) throw Error("角色id重复");
		this.cancelPending(), this.characterPreparationRequest += 1, this.characterPreparation = null, this.hostAdapter?.clearScenePacket?.();
		let r = this.state.version;
		return this.registry = n, this.state = jh({
			chatId: this.state.scope.chatId,
			branchId: this.state.scope.branchId,
			scene: t.scene,
			player: t.actors.player,
			enemies: t.actors.enemies,
			semanticState: t.semanticState,
			causalState: t.causalState,
			resourceRules: t.resourceRules,
			registrySnapshot: n.snapshot()
		}), this.state.version = r + 1, this.logs = [], this.storage.replaceLogs([]), this.emit(), this.state;
	}
	importRegistry(e) {
		if (this.assertIdleRequest(), !["idle", "ended"].includes(this.state.phase)) throw Error("活动战斗中不能替换功法");
		let t = typeof e == "string" ? JSON.parse(e) : e, n = new vp(Array.isArray(t) ? t : t.registry || [t]);
		return this.registry = n, this.state = {
			...this.state,
			registrySnapshot: n.snapshot(),
			version: this.state.version + 1
		}, this.emit(), n.snapshot();
	}
	exportData() {
		return JSON.stringify(X({
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
		let t = typeof e == "string" ? JSON.parse(e) : Y(e), n = Ih(t.state || t);
		if (n.scope.chatId !== this.state.scope.chatId || n.scope.branchId !== this.state.scope.branchId) throw Error("导入文件作用域与当前聊天/分支不一致");
		return this.cancelPending(), this.hostAdapter?.clearScenePacket?.(), this.state = {
			...n,
			version: Math.max(n.version, this.state.version) + 1
		}, this.registry = new vp(n.registrySnapshot), this.logs = X(Array.isArray(t.logs) ? t.logs : [], this.secrets()), this.storage.replaceLogs(this.logs), t.settings && (this.settings = bg(X(t.settings)), this.storage.writeSettings(this.settings), this.setAdapters(j_(this.settings))), this.emit(), this.state;
	}
	playerView() {
		return Vh(this.state);
	}
	logExport() {
		return JSON.stringify(this.logs.map(ac), null, 2);
	}
	debugLogExport() {
		return JSON.stringify(X(this.logs, this.secrets()), null, 2);
	}
	dispose() {
		this.cancelPending(), this.unsubScope?.(), this.unsubNarrative?.(), this.hostAdapter?.dispose?.();
	}
}, N_ = "[[XY_BATTLE_PACKET v1 ", P_ = "[[/XY_BATTLE_PACKET]]", F_ = (e) => e == null ? e : JSON.parse(JSON.stringify(e)), I_ = (e) => Number.isInteger(Number(e)) && Number(e) >= 0 ? Number(e) : null;
function L_(e, t = {}) {
	let n = e?.scope || {};
	return {
		chatId: n.chatId ?? t.chatId,
		branchId: n.branchId ?? t.branchId,
		messageId: n.messageId ?? t.messageId,
		swipeId: n.swipeId ?? t.swipeId,
		messageUid: n.messageUid ?? t.messageUid
	};
}
function R_(e, t = {}) {
	let n = L_(e, t), r = String(e?.actionId ?? "").trim(), i = String(n.branchId ?? "").trim(), a = I_(e?.version ?? t.version);
	if (!r) throw Error("BATTLE_SCENE_PACKET requires actionId");
	if (!i) throw Error("BATTLE_SCENE_PACKET requires scope.branchId");
	if (a == null) throw Error("BATTLE_SCENE_PACKET requires a non-negative integer version");
	return {
		actionId: r,
		version: a,
		branchId: i
	};
}
function z_(e, t = {}) {
	let n = R_(e, t);
	return JSON.stringify([
		n.branchId,
		n.version,
		n.actionId
	]);
}
function B_(e, t = {}) {
	if (!e || typeof e != "object" || Array.isArray(e)) throw Error("BATTLE_SCENE_PACKET must be an object");
	if (e.type !== "BATTLE_SCENE_PACKET") throw Error("Expected a BATTLE_SCENE_PACKET");
	let n = R_(e, t), r = e.scope?.branchId;
	if (r != null && String(r) !== n.branchId) throw Error("BATTLE_SCENE_PACKET scope.branchId is inconsistent");
	if (t.branchId != null && String(t.branchId) !== n.branchId) throw Error("BATTLE_SCENE_PACKET branchId does not match the active scope");
	return n;
}
function V_(e, t = {}) {
	let n = B_(e, t), r = encodeURIComponent(JSON.stringify(n)), i = {
		...F_(e),
		version: n.version
	};
	return `${N_}${r}]]\n${JSON.stringify(i).replaceAll(P_, "\\u005b\\u005b/XY_BATTLE_PACKET]]")}\n${P_}`;
}
function H_(e) {
	if (!e || /[\r\n]/.test(e)) throw Error("Malformed XY_BATTLE_PACKET header");
	let t;
	try {
		t = JSON.parse(decodeURIComponent(e));
	} catch {
		throw Error("Malformed XY_BATTLE_PACKET header");
	}
	if (!t || typeof t != "object" || Array.isArray(t)) throw Error("Malformed XY_BATTLE_PACKET header");
	return R_({
		actionId: t.actionId,
		version: t.version,
		scope: { branchId: t.branchId }
	});
}
var U_ = /* @__PURE__ */ RegExp("^\\[\\[XY_BATTLE_PACKET v1 ([^\\r\\n]+)\\]\\]$", "gm");
function W_(e, t, n, r, i) {
	let a = H_(e), o;
	try {
		o = JSON.parse(t);
	} catch {
		throw Error("Malformed XY_BATTLE_PACKET payload");
	}
	let s = B_(o, { branchId: a.branchId });
	if (s.actionId !== a.actionId || s.version !== a.version || s.branchId !== a.branchId) throw Error("XY_BATTLE_PACKET header does not match payload");
	return {
		packet: o,
		header: a,
		key: JSON.stringify([
			a.branchId,
			a.version,
			a.actionId
		]),
		identity: JSON.stringify([a.branchId, a.actionId]),
		raw: n.slice(r, i),
		start: r,
		end: i
	};
}
function G_(e) {
	if (typeof e != "string" || !e) return [];
	let t = [];
	U_.lastIndex = 0;
	let n;
	for (; n = U_.exec(e);) {
		let r = n.index + n[0].length;
		e.slice(r, r + 2) === "\r\n" ? r += 2 : e[r] === "\n" && (r += 1);
		let i = e.indexOf(P_, r);
		if (i < 0) continue;
		let a = i;
		e[a - 2] === "\r" && e[a - 1] === "\n" ? a -= 2 : e[a - 1] === "\n" && --a;
		let o = i + 21;
		try {
			t.push(W_(n[1], e.slice(r, a), e, n.index, o));
		} catch {}
		U_.lastIndex = o;
	}
	return t;
}
function K_(e, t, n = {}) {
	let r = typeof e == "string" ? e : "", i = B_(t, n), a = JSON.stringify([
		i.branchId,
		i.version,
		i.actionId
	]), o = JSON.stringify([i.branchId, i.actionId]), s = G_(r), c = s.find((e) => e.key === a);
	if (c) return {
		text: r,
		marker: c.raw,
		match: c,
		packet: F_(c.packet),
		key: a,
		identity: o,
		deduplicated: !0,
		appended: !1
	};
	if (s.find((e) => e.identity === o)) throw Error("An XY_BATTLE_PACKET for this action and branch already has a different version");
	let l = V_(t, n), u = r && !r.endsWith("\n") ? "\n\n" : r ? "\n" : "", d = `${r}${u}${l}`;
	return {
		text: d,
		marker: l,
		packet: F_(t),
		key: a,
		identity: o,
		deduplicated: !1,
		appended: !0,
		start: r.length + u.length,
		end: d.length
	};
}
function q_(e) {
	return e ? "value" in e && typeof e.value == "string" ? e.value : typeof e.textContent == "string" ? e.textContent : "" : "";
}
function J_(e, t) {
	if (!e) return !1;
	if ("value" in e) {
		let n = Object.getPrototypeOf(e), r = n && Object.getOwnPropertyDescriptor(n, "value")?.set;
		r ? r.call(e, t) : e.value = t;
	} else e.textContent = t;
	return !0;
}
function Y_(e, t = ["input", "change"]) {
	if (!e?.dispatchEvent) return;
	let n = e.ownerDocument?.defaultView?.Event || globalThis.Event;
	for (let r of t) try {
		let t = typeof n == "function" ? new n(r, { bubbles: !0 }) : {
			type: r,
			bubbles: !0
		};
		e.dispatchEvent(t);
	} catch {}
}
function X_(e, t) {
	return e?.textarea && (typeof e.textarea == "object" || typeof e.textarea == "function") ? e.textarea : e?.input && (typeof e.input == "object" || typeof e.input == "function") ? e.input : t?.querySelector?.("#send_textarea, textarea#send_textarea, textarea[data-testid=\"send-textarea\"], textarea");
}
var Z_ = class {
	constructor({ contextProvider: e = () => globalThis.SillyTavern?.getContext?.() || {}, getInputElement: t, documentRef: n = globalThis.document, eventEmitter: r, eventTypes: i, windowRef: a = globalThis, dispatch: o = Y_, bindPageLifecycle: s = !0 } = {}) {
		Object.assign(this, {
			contextProvider: e,
			getInputElement: t,
			documentRef: n,
			eventEmitter: r,
			eventTypes: i,
			windowRef: a,
			dispatch: o,
			bindPageLifecycle: s
		}), this.active = null, this.disposers = [], this.boundEmitter = null, this.disposed = !1, this.start();
	}
	context() {
		return this.contextProvider?.() || {};
	}
	inputElement() {
		return this.getInputElement ? this.getInputElement(this.context(), this.documentRef) : X_(this.context(), this.documentRef);
	}
	read(e = this.inputElement()) {
		return q_(e);
	}
	write(e, t) {
		let n = J_(e, t);
		return n && this.dispatch(e), n;
	}
	dispatch(e) {
		this.dispatchInput?.(e);
	}
	dispatchInput(e) {
		this.dispatch(e);
	}
	capability() {
		let e = this.inputElement();
		return {
			input: e ? "available" : "unavailable",
			mode: "input-box",
			source: e ? "context-or-dom" : "none"
		};
	}
	append(e, t = {}) {
		if (this.disposed) return {
			queued: !1,
			injected: !1,
			reason: "HostInputBridge is disposed",
			capability: this.capability()
		};
		let n;
		try {
			n = z_(e, t);
		} catch (e) {
			return {
				queued: !1,
				injected: !1,
				reason: e.message,
				capability: this.capability()
			};
		}
		if (this.active?.key === n) return {
			queued: !0,
			injected: !0,
			deduplicated: !0,
			key: n,
			capability: this.capability()
		};
		if (this.active) {
			let e = this.clear();
			if (!e.cleared && !e.preservedUserEdit) return {
				queued: !1,
				injected: !1,
				reason: "A previous battle packet is still attached to the input",
				key: n,
				capability: this.capability()
			};
		}
		let r = this.inputElement();
		if (!r) return {
			queued: !1,
			injected: !1,
			reason: "Input element is unavailable",
			key: n,
			capability: this.capability()
		};
		let i = this.read(r), a;
		try {
			a = K_(i, e, t);
		} catch (e) {
			return {
				queued: !1,
				injected: !1,
				conflict: /already has a different version|already contains/i.test(e.message),
				reason: e.message,
				key: n,
				capability: this.capability()
			};
		}
		return a.deduplicated ? (this.active = {
			key: n,
			identity: a.identity,
			packet: F_(e),
			marker: a.marker,
			element: r,
			owns: !1,
			scope: F_(t)
		}, {
			queued: !0,
			injected: !0,
			deduplicated: !0,
			key: n,
			capability: this.capability()
		}) : (this.write(r, a.text), this.active = {
			key: n,
			identity: a.identity,
			packet: F_(e),
			marker: a.marker,
			element: r,
			previousValue: i,
			injectedValue: a.text,
			scope: F_(t),
			owns: !0
		}, {
			queued: !0,
			injected: !0,
			deduplicated: !1,
			key: n,
			capability: this.capability()
		});
	}
	inject(e, t = {}) {
		return this.append(e, t);
	}
	queue(e, t = {}) {
		return this.append(e, t);
	}
	verify(e, t = {}) {
		let n;
		try {
			n = z_(e, t);
		} catch {
			return {
				valid: !1,
				reason: "Packet identity is incomplete"
			};
		}
		let r = G_(this.read(this.inputElement())).find((e) => e.key === n);
		return r ? {
			valid: !0,
			key: n,
			marker: r.raw,
			packet: F_(r.packet)
		} : {
			valid: !1,
			key: n,
			reason: "Exact packet marker is absent from the input"
		};
	}
	clear() {
		let e = this.active;
		if (!e) return {
			cleared: !1,
			preservedUserEdit: !1
		};
		if (this.active = null, !e.owns) return {
			cleared: !1,
			preservedUserEdit: !0,
			key: e.key
		};
		let t = this.read(e.element);
		if (t === e.injectedValue) return this.write(e.element, e.previousValue), {
			cleared: !0,
			preservedUserEdit: !1,
			key: e.key
		};
		if (typeof t == "string" && t.endsWith(e.marker)) {
			let n = t.slice(0, -e.marker.length);
			return n = n.replace(/\n{1,2}$/, ""), this.write(e.element, n), {
				cleared: !0,
				preservedUserEdit: !0,
				key: e.key
			};
		}
		return {
			cleared: !1,
			preservedUserEdit: !0,
			key: e.key
		};
	}
	clearScenePacket() {
		return this.clear();
	}
	state() {
		return this.active ? {
			key: this.active.key,
			identity: this.active.identity,
			scope: F_(this.active.scope),
			owns: this.active.owns
		} : null;
	}
	start() {
		if (this.disposed) return this.capability();
		let e = this.eventEmitter || this.context()?.eventSource;
		if (!e?.on || e === this.boundEmitter) return this.capability();
		this.disposers.length && this.stop(), this.boundEmitter = e;
		let t = this.eventTypes || this.context()?.event_types || {};
		for (let n of [
			"CHAT_CHANGED",
			"MESSAGE_SWIPED",
			"MESSAGE_SWIPE_DELETED",
			"MESSAGE_DELETED",
			"GENERATION_ENDED",
			"GENERATION_STOPPED"
		]) {
			let r = t[n] || n, i = () => this.clear();
			e.on(r, i), this.disposers.push(() => (e.off || e.removeListener)?.call(e, r, i));
		}
		if (this.bindPageLifecycle && this.windowRef?.addEventListener) {
			let e = () => this.clear();
			this.windowRef.addEventListener("pagehide", e), this.disposers.push(() => this.windowRef.removeEventListener?.("pagehide", e));
		}
		return this.capability();
	}
	stop() {
		for (let e of this.disposers.splice(0)) e();
		this.boundEmitter = null;
	}
	dispose() {
		this.clear(), this.stop(), this.disposed = !0;
	}
};
//#endregion
//#region src/battle-packet-markers.js
function Q_(e) {
	return G_(e);
}
//#endregion
//#region src/host-display-folding.js
function $_(e, t) {
	return t || e?.ownerDocument || globalThis.document;
}
function ev(e) {
	return e?.nodeType === 1 && e.hasAttribute?.("data-xy-battle-packet-key");
}
function tv(e) {
	let t = [], n = (e) => {
		if (e && !ev(e)) {
			if (e.nodeType === 3) {
				t.push({
					node: e,
					length: e.nodeValue?.length || 0,
					text: e.nodeValue || ""
				});
				return;
			}
			if (e.nodeType === 1 && String(e.tagName).toLowerCase() === "br") {
				t.push({
					node: null,
					length: 1,
					text: "\n"
				});
				return;
			}
			for (let t of [...e.childNodes || []]) n(t);
		}
	};
	return n(e), t;
}
function nv(e, t, n = !1) {
	let r = 0;
	for (let i = 0; i < e.length; i += 1) {
		let a = e[i], o = a.length;
		if (t <= r + o || n && t === r + o) {
			if (a.node) return {
				node: a.node,
				offset: Math.max(0, Math.min(o, t - r))
			};
			let s = [...e.slice(0, i)].reverse().find((e) => e.node), c = e.slice(i + 1).find((e) => e.node);
			return n && s ? {
				node: s.node,
				offset: s.length
			} : c ? {
				node: c.node,
				offset: 0
			} : s ? {
				node: s.node,
				offset: s.length
			} : null;
		}
		r += o;
	}
	let i = [...e].reverse().find((e) => e.node);
	return i ? {
		node: i.node,
		offset: i.length
	} : null;
}
function rv(e, t, n, r) {
	let i = tv(e), a = nv(i, t.start), o = nv(i, t.end, !0);
	if (!a || !o || !n.createRange) return !1;
	let s = n.createRange();
	s.setStart(a.node, a.offset), s.setEnd(o.node, o.offset);
	let c = n.createElement("details");
	c.dataset.xyBattlePacketKey = t.key, c.setAttribute("data-xy-battle-packet-key", t.key);
	let l = n.createElement("summary");
	l.textContent = `${r}${t.packet?.actionId ? ` · ${t.packet.actionId}` : ""}`, c.appendChild(l);
	let u = n.createElement("pre");
	return u.className = "xy-battle-packet-source", u.textContent = t.raw, c.appendChild(u), s.deleteContents(), s.insertNode(c), s.detach?.(), !0;
}
function iv(e, { documentRef: t, placeholder: n = "战斗场景包（已折叠）" } = {}) {
	let r = $_(e, t);
	if (!e || !r?.createElement) return {
		folded: 0,
		available: !1
	};
	let i = 0, a = e.matches?.(".mes_text") ? [e] : [...e.querySelectorAll?.(".mes_text") || []];
	a.length || a.push(e);
	for (let e of a) {
		let t = Q_(tv(e).map((e) => e.text).join(""));
		for (let a of [...t].reverse()) rv(e, a, r, n) && (i += 1);
	}
	return {
		folded: i,
		available: !0
	};
}
var av = class {
	constructor({ documentRef: e = globalThis.document, root: t, rootSelector: n = "#chat", placeholder: r } = {}) {
		Object.assign(this, {
			documentRef: e,
			root: t,
			rootSelector: n,
			placeholder: r
		}), this.observer = null, this.boundRoots = /* @__PURE__ */ new Set();
	}
	resolveRoot() {
		return this.root || this.documentRef?.querySelector?.(this.rootSelector);
	}
	apply(e = this.resolveRoot()) {
		return iv(e, {
			documentRef: this.documentRef,
			placeholder: this.placeholder
		});
	}
	observe(e = this.resolveRoot()) {
		if (!e || !this.documentRef?.defaultView?.MutationObserver && !globalThis.MutationObserver) return {
			observed: !1,
			reason: "MutationObserver is unavailable"
		};
		this.boundRoots.add(e);
		let t = this.documentRef?.defaultView?.MutationObserver || globalThis.MutationObserver;
		return this.observer ||= new t((e) => {
			for (let t of e) if (t.type === "childList" || t.type === "characterData") {
				let e = t.target?.nodeType === 1 ? t.target : t.target?.parentElement;
				e && this.apply(e.closest?.(".mes_text") || e);
			}
		}), this.observer.observe(e, {
			childList: !0,
			subtree: !0,
			characterData: !0
		}), this.apply(e), { observed: !0 };
	}
	disconnect() {
		this.observer?.disconnect?.(), this.observer = null, this.boundRoots.clear();
	}
	dispose() {
		this.disconnect();
	}
}, ov = (e) => e == null ? e : JSON.parse(JSON.stringify(e)), sv = (e) => e != null && e !== "" && Number.isInteger(Number(e)) && Number(e) >= 0 ? Number(e) : null, cv = (e) => !!e && (e.role === "assistant" || e.role == null && e.is_user === !1 && e.extra?.type !== "narrator"), lv = [
	"chatId",
	"branchId",
	"messageId",
	"swipeId",
	"messageUid"
], uv = (e, t, n = !1) => {
	if (!e || !t) return !1;
	let r = e.messageUid != null && t.messageUid != null && String(e.messageUid) === String(t.messageUid);
	return lv.every((n) => e[n] == null || r && (n === "messageId" || n === "branchId") ? !0 : String(e[n]) === String(t[n])) && (!n || e.scopeEpoch == null || e.scopeEpoch === t.scopeEpoch);
}, dv = (e) => Object.fromEntries(lv.map((t) => [t, e[t]]));
function fv(e) {
	return Array.isArray(e) ? `[${e.map(fv).join(",")}]` : e && typeof e == "object" ? `{${Object.keys(e).sort().map((t) => `${JSON.stringify(t)}:${fv(e[t])}`).join(",")}}` : JSON.stringify(e);
}
function pv(e) {
	return Array.isArray(e) ? e.map(pv) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).filter(([e]) => ![
		"apiKey",
		"api_key",
		"authorization"
	].includes(e)).map(([e, t]) => [e, pv(t)]));
}
function mv(e) {
	return e?.extra?.battle_v2_message_uuid || e?.extra?.message_uuid || e?.swipe_info?.find((e) => e?.battle_v2_message_uuid)?.battle_v2_message_uuid || e?.swipes_info?.find((e) => e?.battle_v2_message_uuid)?.battle_v2_message_uuid;
}
var hv = class {
	constructor({ contextProvider: e = () => globalThis.SillyTavern?.getContext?.() || {}, helper: t, eventEmitter: n, eventTypes: r, windowRef: i = globalThis, documentRef: a = globalThis.document, inputBridge: o, displayFolding: s, extensionName: c = "st-xybattle-sys" } = {}) {
		Object.assign(this, {
			contextProvider: e,
			helperDependency: t,
			eventEmitterDependency: n,
			eventTypesDependency: r,
			windowRef: i,
			documentRef: a,
			extensionName: c
		}), this.anchor = null, this.currentScope = null, this.epoch = 0, this.messageUids = /* @__PURE__ */ new WeakMap(), this.scopeListeners = /* @__PURE__ */ new Set(), this.narrativeListeners = /* @__PURE__ */ new Set(), this.disposers = [], this.boundEmitter = null, this.packet = null, this.activePacket = null, this.injected = !1, this.lastInjection = null, this.inputBridge = o || new Z_({
			contextProvider: e,
			documentRef: a,
			windowRef: i,
			bindPageLifecycle: !1,
			getInputElement: (e, t) => t?.querySelector?.("#send_textarea, textarea#send_textarea, textarea[data-testid=\"send-textarea\"]") || null
		}), this.displayFolding = s || new av({ documentRef: a }), this.writeQueue = Promise.resolve(), this.uncertainScopes = /* @__PURE__ */ new Set(), this.disposed = !1, this.start();
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
		return sv(e.messageId ?? e.message_id ?? e.message?.message_id);
	}
	latestAssistantId(e) {
		if (!Array.isArray(e.chat)) return null;
		for (let t = e.chat.length - 1; t >= 0; --t) if (cv(e.chat[t])) return t;
		return null;
	}
	storedAnchorId(e, t) {
		if (!Array.isArray(e.chat)) return null;
		let n = [];
		for (let r = e.chat.length - 1; r >= 0; --r) {
			let i = e.chat[r], a = i?.swipe_id ?? 0, o = (i?.swipe_info?.[a] || i?.swipes_info?.[a] || i?.extra || {})?.battle_v2;
			if (!cv(i) || o?.schema !== "battle_v2_host_store" || String(o.scope?.chatId) !== String(t) || String(o.scope?.swipeId) !== String(a)) continue;
			let s = +(String(o.scope?.messageId) === String(r)), c = Number(o.version ?? o.state?.version ?? 0);
			n.push({
				index: r,
				exactIndex: s,
				version: Number.isFinite(c) ? c : 0,
				updatedAt: Date.parse(o.state?.updatedAt || "") || 0
			});
		}
		return n.sort((e, t) => t.exactIndex - e.exactIndex || t.version - e.version || t.updatedAt - e.updatedAt || t.index - e.index), n[0]?.index ?? null;
	}
	readMessageSync(e, t = this.context()) {
		let n = this.helper();
		if (typeof n?.getChatMessages == "function") {
			let r = n.getChatMessages(e, { include_swipes: !0 });
			if (r?.then) throw Error("getChatMessages must follow the synchronous TavernHelper contract");
			let i = r?.[0];
			if (i?.message_id !== e) return null;
			let a = ov(i), o = t.chat?.[e]?.extra;
			return a.swipes_info && o && (a.swipes_info[a.swipe_id] = {
				...ov(o),
				...a.swipes_info[a.swipe_id]
			}), a;
		}
		let r = t.chat?.[e] || (this.explicitMessageId(t) === e ? t.message : null);
		if (!r) return null;
		let i = r.swipes || [r.mes ?? r.message ?? ""], a = sv(r.swipe_id ?? r.swipeId) ?? 0, o = Array.from({ length: i.length }, (e, t) => ov(r.swipe_info?.[t] ?? r.swipes_info?.[t] ?? (t === a ? r.extra : {}) ?? {}));
		return o[a] = {
			...ov(r.extra || {}),
			...o[a]
		}, {
			message_id: e,
			name: r.name,
			role: r.role || (r.is_user ? "user" : r.extra?.type === "narrator" ? "system" : "assistant"),
			is_hidden: !!r.is_system,
			swipe_id: a,
			swipes: ov(i),
			swipes_data: Array.from({ length: i.length }, (e, t) => ov(r.variables?.[t] ?? r.swipes_data?.[t] ?? {})),
			swipes_info: o
		};
	}
	scope() {
		let e = this.context(), t = this.chatId(e), n = this.explicitMessageId(e), r = this.anchor?.chatId === t ? this.anchor.messageId : null, i = !1;
		if (n != null && (r = n), r == null && (r = this.storedAnchorId(e, t), i = r != null, r ??= this.latestAssistantId(e), r == null)) try {
			r = sv(this.helper()?.getCurrentMessageId?.());
		} catch {}
		let a;
		try {
			a = r == null ? null : this.readMessageSync(r, e);
		} catch {
			a = null;
		}
		if (r != null && !cv(a)) {
			this.anchor = null, r = this.storedAnchorId(e, t), i = r != null, r ??= this.latestAssistantId(e);
			try {
				a = r == null ? null : this.readMessageSync(r, e);
			} catch {
				a = null;
			}
		}
		let o = e.chat?.[r] || (n === r ? e.message : null);
		if (!t || !cv(a) || sv(a?.swipe_id) == null) return this.publishScope({
			chatId: t || "default-chat",
			branchId: "main",
			messageId: null,
			swipeId: null,
			messageUid: null,
			available: !1,
			writable: !1
		}), this.anchor = null, { ...this.currentScope };
		let s = mv(o) || mv(a), c = this.anchor?.chatId === t && this.anchor.messageId === r && (o ? o === this.anchor.raw || s === this.anchor.messageUid : !s || s === this.anchor.messageUid), l = s || (c ? this.anchor.messageUid : o && this.messageUids.get(o));
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
		if (t || !n || !uv(n, e) || n.available !== e.available || n.writable !== e.writable) {
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
		if (!uv(e, n, !0)) throw Error("Host scope changed; refusing a late cross-chat or cross-swipe operation");
		if (t && !n.writable) throw Error("Historical message anchors are read-only");
		return n;
	}
	capability() {
		let e = this.context(), t = this.helper(), n = typeof t?.getChatMessages == "function" ? "tavern-helper" : Array.isArray(e.chat) ? "context-chat" : "unavailable", r = n === "tavern-helper" && typeof t?.setChatMessages == "function" ? "tavern-helper" : Array.isArray(e.chat) ? "context-chat" : "unavailable", i = this.inputBridge?.capability?.() || { input: "unavailable" }, a = i.input === "available" && this.boundEmitter ? "input-box-once-generation-event" : typeof t?.injectPrompts == "function" && this.boundEmitter ? "once-generation-event" : "unavailable";
		return {
			read: n,
			write: r,
			save: typeof e.saveChat == "function" ? "awaitable-save-chat" : r === "tavern-helper" ? "debounced-only" : "unavailable",
			injection: a,
			input: i.input,
			display: this.displayFolding ? "dom-projection" : "unavailable",
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
			if (r.schema !== "battle_v2_host_store" || !uv(r.scope, n) || !uv(r.state?.scope || r.scope, n)) throw Error("Stored battle_v2 scope does not match this message branch");
			let i = ov(r.state);
			return i && (i.scope = {
				...i.scope,
				...n
			}), {
				loaded: !!i,
				state: i,
				receipts: ov(r.receipts || {}),
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
		let r = { ...n }, i = pv(ov(e)), a = pv(ov(t)), o = this.writeQueue.catch(() => {}).then(() => this.writeReceipt(i, a, r));
		return this.writeQueue = o, o;
	}
	async writeReceipt(e, t, n) {
		let r = this.capability();
		try {
			let i = this.validateScope(n, { writable: !0 });
			if (e?.scope && !uv(e.scope, i, !0) || t?.scope && !uv(t.scope, i, !0)) throw Error("Receipt/session scope mismatch");
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
			if (o && (o.schema !== "battle_v2_host_store" || !uv(o.scope, i))) throw Error("Existing host store has an incompatible scope/schema");
			let s = fv(dv(i)), c = Math.max(Number(e?.version ?? 0), Number(t?.version ?? 0));
			if (!Number.isFinite(c) || c < 0) throw Error("Invalid host store version");
			let l = e?.actionId && o?.receipts?.[e.actionId], u = e && {
				...e,
				scope: dv(i)
			};
			if (o && c < o.version) {
				if (!this.uncertainScopes.has(s) && l && fv(l) === fv(u)) return {
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
				]) if (l.status !== "prepared" && fv(l[e]) !== fv(u[e])) throw Error("Conflicting duplicate actionId refused");
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
				scope: dv(i),
				version: Math.max(c, o?.version || 0),
				state: t ? {
					...t,
					scope: {
						...t.scope,
						...dv(i)
					}
				} : o?.state || null,
				receipts: { ...o?.receipts }
			};
			if (u && (d.receipts[e.actionId] = u, d.lastActionId = e.actionId), !this.uncertainScopes.has(s) && o && fv(o) === fv(d)) return {
				persisted: !0,
				confirmed: !0,
				scope: i,
				capability: r,
				deduplicated: !0,
				version: d.version
			};
			let f = a.swipes_info.map((e) => ov(e || {}));
			f[i.swipeId] = {
				...f[i.swipeId],
				battle_v2_message_uuid: i.messageUid,
				battle_v2: d
			};
			let p = {
				message_id: a.message_id,
				swipe_id: a.swipe_id,
				swipes: ov(a.swipes),
				swipes_data: ov(a.swipes_data),
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
			if (fv(h) !== fv(d)) throw Error("Host persistence readback mismatch");
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
			if (e.scope && !uv(e.scope, n, !0)) throw Error("Scene packet scope mismatch");
			if (this.capability().injection === "unavailable") return {
				queued: !1,
				injected: !1,
				capability: this.capability(),
				reason: "injectPrompts or generation events are unavailable"
			};
			let r = this.readMessageSync(n.messageId)?.swipes_info?.[n.swipeId]?.battle_v2, i = r?.receipts?.[e.actionId];
			if (this.uncertainScopes.has(fv(dv(n)))) throw Error("Host persistence is unconfirmed after a failed save");
			if (!i || ["prepared", "judging"].includes(i.status)) throw Error("Scene packet has no persisted committed receipt");
			if (e.version != null && Number(e.version) !== r.version) throw Error("Scene packet version mismatch");
			let a = z_(e, {
				branchId: n.branchId,
				version: r.version
			});
			if (!a) throw Error("Scene packet identity is incomplete");
			if (this.packet?.key === a || this.activePacket?.key === a) return {
				queued: !0,
				injected: !!this.activePacket,
				deduplicated: !0,
				scope: n,
				capability: this.capability()
			};
			this.clearScenePacket();
			let o = this.inputBridge?.append?.(e, {
				...n,
				version: r.version
			});
			if (o?.conflict) throw Error(o.reason || "Input contains a conflicting XY_BATTLE_PACKET");
			return this.packet = {
				...ov(e),
				packet: ov(e),
				scope: n,
				version: r.version,
				key: a,
				transportCandidate: o?.queued ? "input-box" : null,
				inputResult: o
			}, {
				queued: !0,
				injected: !1,
				scope: n,
				transport: o?.queued ? "input-box" : "extension-prompt",
				pendingVerification: !!o?.queued,
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
			let t = this.context(), r = this.latestAssistantId(t), i = r == null ? null : t.chat[r]?.mes, a = n.transportCandidate === "input-box" ? this.inputBridge?.verify?.(n.packet, {
				...n.scope,
				version: n.version
			}) : { valid: !1 };
			if (a?.valid) {
				this.activePacket = {
					...n,
					baselineId: r,
					baselineText: i,
					transport: "input-box",
					inputResult: a
				}, this.packet = null, this.injected = !0, this.lastInjection = {
					injected: !0,
					transport: "input-box",
					verified: !1,
					pendingVerification: !0,
					deduplicated: !!a.deduplicated,
					actionId: n.packet.actionId,
					scope: n.scope
				};
				return;
			}
			this.inputBridge?.clear?.();
			let o = this.helper();
			if (typeof o?.injectPrompts != "function") throw Error(a?.reason || "injectPrompts is unavailable");
			let s = o.injectPrompts([{
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
			if (typeof s?.uninject != "function") throw Error("injectPrompts did not return its documented uninject handle");
			this.activePacket = {
				...n,
				uninject: s.uninject,
				baselineId: r,
				baselineText: i,
				transport: "extension-prompt"
			}, this.packet = null, this.injected = !0, this.lastInjection = {
				injected: !0,
				transport: "extension-prompt",
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
		if (this.clearScenePacket(), t) {
			t.transport === "input-box" && t.inputVerified !== !0 && (this.lastInjection = {
				...this.lastInjection,
				transport: "input-box",
				verified: !1,
				pendingVerification: !1,
				reason: "The rendered user message was not observed with an exact XY_BATTLE_PACKET"
			});
			try {
				if (this.validateScope(t.scope), this.readMessageSync(t.scope.messageId)?.swipes_info?.[t.scope.swipeId]?.battle_v2?.version !== t.version) throw Error("Scene packet version changed during generation");
				let n = this.context(), r = this.latestAssistantId(n), i = r == null ? null : n.chat[r], a = i?.mes ?? i?.message ?? "";
				r != null && typeof this.helper()?.getChatMessages == "function" && (a = this.helper().getChatMessages(r, { include_swipes: !1 })?.[0]?.message ?? a);
				let o = e === "complete" && typeof a == "string" && a.trim() && (r !== t.baselineId || a !== t.baselineText), s = {
					actionId: t.packet.actionId,
					scope: t.scope,
					text: o ? a : "",
					status: o ? "complete" : "stopped",
					packet: ov(t.packet),
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
	}
	verifyRenderedUserMessage(e) {
		let t = this.activePacket;
		if (!t || t.transport !== "input-box") return;
		let n = this.context(), r = sv(e) ?? (Array.isArray(n.chat) ? n.chat.reduce((e, t, n) => t?.is_user || t?.role === "user" ? n : e, null) : null), i = r == null ? null : n.chat?.[r], a = i?.mes ?? i?.message ?? "", o = Q_(String(a)).some((e) => e.key === t.key);
		if (t.inputVerified = o, o) {
			this.lastInjection = {
				...this.lastInjection,
				transport: "input-box",
				verified: !0,
				pendingVerification: !1
			};
			return;
		}
		let s = this.helper();
		try {
			if (typeof s?.injectPrompts != "function") throw Error("injectPrompts is unavailable after input verification failed");
			let e = s.injectPrompts([{
				id: `${this.extensionName}:battle_v2:${t.packet.actionId}`,
				role: "system",
				position: "in_chat",
				depth: 0,
				should_scan: !1,
				content: JSON.stringify(t.packet),
				filter: () => {
					try {
						return this.validateScope(t.scope), this.readMessageSync(t.scope.messageId)?.swipes_info?.[t.scope.swipeId]?.battle_v2?.version === t.version;
					} catch {
						return !1;
					}
				}
			}], { once: !0 });
			if (typeof e?.uninject != "function") throw Error("injectPrompts did not return its documented uninject handle");
			t.uninject = e.uninject, t.transport = "extension-prompt", this.lastInjection = {
				injected: !0,
				transport: "extension-prompt",
				fallback: !0,
				actionId: t.packet.actionId,
				scope: t.scope,
				reason: "Rendered user message did not retain exact XY_BATTLE_PACKET"
			};
		} catch (e) {
			this.lastInjection = {
				injected: !1,
				transport: "input-box",
				verified: !1,
				reason: e.message
			};
		}
	}
	clearScenePacket() {
		let e = this.activePacket, t = this.packet;
		this.activePacket = null, this.packet = null, this.injected = !1, e?.uninject && e.uninject(), (e?.transport === "input-box" || t?.transportCandidate === "input-box") && this.inputBridge?.clear?.();
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
				this.clearScenePacket(), e === "MESSAGE_SWIPED" && sv(t) != null && this.anchor && (this.anchor = {
					...this.anchor,
					messageId: sv(t),
					raw: null
				}), this.scope();
			});
			i(r.USER_MESSAGE_RENDERED || "USER_MESSAGE_RENDERED", (e) => {
				this.displayFolding?.apply?.(), this.verifyRenderedUserMessage(e);
			});
			for (let e of ["CHARACTER_MESSAGE_RENDERED", "MESSAGE_RENDERED"]) i(r[e] || e, () => {
				this.displayFolding?.apply?.(), this.scope();
			});
		}
		if (this.displayFolding?.observe?.(), this.windowRef?.addEventListener) {
			let e = () => this.clearScenePacket();
			this.windowRef.addEventListener("pagehide", e), this.disposers.push(() => this.windowRef.removeEventListener?.("pagehide", e));
		}
		return this.capability();
	}
	dispose() {
		this.clearScenePacket(), this.inputBridge?.dispose?.(), this.displayFolding?.dispose?.();
		for (let e of this.disposers.splice(0)) e();
		this.boundEmitter = null, this.scopeListeners.clear(), this.narrativeListeners.clear(), this.disposed = !0;
	}
};
//#endregion
//#region src/ui/mount.js
function gv({ documentRef: e = globalThis.document, storage: t = globalThis.localStorage, hostAdapter: n, controller: r, chatId: i = "demo-local", branchId: a = "main" } = {}) {
	if (!e) return null;
	if (e.getElementById("xybattle-v2-root")) return globalThis.XYBattle;
	let o = e.createElement("div");
	o.id = "xybattle-v2-root-wrapper", e.body.appendChild(o);
	try {
		let t = new URL([
			"..",
			"..",
			"style.css"
		].join("/"), import.meta.url).href;
		if (!e.querySelector("link[href*=\"style.css\"]")) {
			let n = e.createElement("link");
			n.rel = "stylesheet", n.href = t, e.head.appendChild(n);
		}
	} catch {}
	let s = n || (globalThis.SillyTavern?.getContext ? new hv({ contextProvider: () => globalThis.SillyTavern.getContext() }) : null), c = r || new M_({
		storage: t,
		chatId: i,
		branchId: a,
		hostAdapter: s
	}), l = gs(mg, {
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
export { gv as mountBattleSystem };
