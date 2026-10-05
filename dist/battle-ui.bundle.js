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
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ee = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), te = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ne = /-\w/g, T = te((e) => e.replace(ne, (e) => e.slice(1).toUpperCase())), re = /\B([A-Z])/g, E = te((e) => e.replace(re, "-$1").toLowerCase()), ie = te((e) => e.charAt(0).toUpperCase() + e.slice(1)), ae = te((e) => e ? `on${ie(e)}` : ""), D = (e, t) => !Object.is(e, t), oe = (e, ...t) => {
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
		(t.version === 0 || D(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
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
		let o = Reflect.get(e, t, /* @__PURE__ */ F(e) ? e : n);
		if ((_(t) ? ht.has(t) : mt(t)) || (r || N(e, "get", t), i)) return o;
		if (/* @__PURE__ */ F(o)) {
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
			if (!/* @__PURE__ */ Ut(n) && !/* @__PURE__ */ Ht(n) && (i = /* @__PURE__ */ P(i), n = /* @__PURE__ */ P(n)), !a && /* @__PURE__ */ F(i) && !/* @__PURE__ */ F(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ F(e) ? e : r);
		return e === /* @__PURE__ */ P(r) && s && (o ? D(n, i) && rt(e, "set", t, n, i) : rt(e, "add", t, n)), s;
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
			e || (D(n, a) && N(i, "get", n), N(i, "get", a));
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
			return e || (D(t, i) && N(r, "has", t), N(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
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
			return r.has.call(n, a) || D(e, a) && r.has.call(n, e) || D(i, a) && r.has.call(n, i) || (n.add(a), rt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Ut(n) && !/* @__PURE__ */ Ht(n) && (n = /* @__PURE__ */ P(n));
			let r = /* @__PURE__ */ P(this), { has: i, get: a } = wt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ P(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? D(n, s) && rt(r, "set", e, n, s) : rt(r, "add", e, n), this;
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
function F(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function Jt(e) {
	return Xt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function Yt(e) {
	return Xt(e, !0);
}
function Xt(e, t) {
	return /* @__PURE__ */ F(e) ? e : new Zt(e, t);
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
		e = n ? e : /* @__PURE__ */ P(e), D(e, t) && (this._rawValue = e, this._value = n ? e : Kt(e), this.dep.trigger());
	}
};
function Qt(e) {
	return /* @__PURE__ */ F(e) ? e.value : e;
}
var $t = {
	get: (e, t, n) => t === "__v_raw" ? e : Qt(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ F(i) && !/* @__PURE__ */ F(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
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
	if (/* @__PURE__ */ F(e) ? (g = () => e.value, y = /* @__PURE__ */ Ut(e)) : /* @__PURE__ */ Vt(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ Vt(e) || /* @__PURE__ */ Ut(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ F(e)) return e.value;
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
				if (e || o || y || (b ? t.some((e, t) => D(e, C[t])) : D(t, C))) {
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
	if (n.set(e, t), t--, /* @__PURE__ */ F(e)) ln(e.value, t, n);
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
var I = [], mn = -1, hn = [], gn = null, _n = 0, vn = /* @__PURE__ */ Promise.resolve(), yn = null;
function bn(e) {
	let t = yn || vn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function xn(e) {
	let t = mn + 1, n = I.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = I[r], a = Dn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Sn(e) {
	if (!(e.flags & 1)) {
		let t = Dn(e), n = I[I.length - 1];
		!n || !(e.flags & 2) && t >= Dn(n) ? I.push(e) : I.splice(xn(t), 0, e), e.flags |= 1, Cn();
	}
}
function Cn() {
	yn ||= vn.then(On);
}
function wn(e) {
	if (!d(e)) gn && e.id === -1 ? gn.splice(_n + 1, 0, e) : e.flags & 1 || (hn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) hn.push(e[t]);
	Cn();
}
function Tn(e, t, n = mn + 1) {
	for (; n < I.length; n++) {
		let t = I[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			I.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function En(e) {
	if (hn.length) {
		let e = [...new Set(hn)].sort((e, t) => Dn(e) - Dn(t));
		if (hn.length = 0, gn) {
			for (let t = 0; t < e.length; t++) gn.push(e[t]);
			return;
		}
		for (gn = e, _n = 0; _n < gn.length; _n++) {
			let e = gn[_n];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		gn = null, _n = 0;
	}
}
var Dn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function On(e) {
	try {
		for (mn = 0; mn < I.length; mn++) {
			let e = I[mn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), un(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; mn < I.length; mn++) {
			let e = I[mn];
			e && (e.flags &= -2);
		}
		mn = -1, I.length = 0, En(e), yn = null, (I.length || hn.length) && On(e);
	}
}
var kn = null, An = null;
function jn(e) {
	let t = kn;
	return kn = e, An = e && e.type.__scopeId || null, t;
}
function Mn(e, t = kn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && qi(-1);
		let i = jn(t), a = Ui.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Ui.length; e > a; e--) Gi();
			jn(i), r._d && qi(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function L(e, n) {
	if (kn === null) return e;
	let r = Ea(kn), i = e.dirs ||= [];
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
function Nn(e, t, n, r) {
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
function Pn(e, t) {
	if (q) {
		let n = q.provides, r = q.parent && q.parent.provides;
		r === n && (n = q.provides = Object.create(r)), n[e] = t;
	}
}
function Fn(e, t, n = !1) {
	let r = pa();
	if (r || Zr) {
		let i = Zr ? Zr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var In = /* @__PURE__ */ Symbol.for("v-scx"), Ln = () => Fn(In);
function Rn(e, t, n) {
	return zn(e, t, n);
}
function zn(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (ya) {
		if (c === "sync") {
			let e = Ln();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = q;
	u.call = (e, t, n) => dn(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		Oi(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : Sn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = cn(e, n, u);
	return ya && (f ? f.push(h) : d && h()), h;
}
function Bn(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? Vn(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = ga(this), s = zn(i, a.bind(r), n);
	return o(), s;
}
function Vn(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Hn = /* @__PURE__ */ Symbol("_vte"), Un = (e) => e.__isTeleport, Wn = /* @__PURE__ */ Symbol("_leaveCb"), Gn = /* @__PURE__ */ Symbol("_enterCb");
function Kn() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return yr(() => {
		e.isMounted = !0;
	}), Sr(() => {
		e.isUnmounting = !0;
	}), e;
}
var qn = [Function, Array], Jn = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: qn,
	onEnter: qn,
	onAfterEnter: qn,
	onEnterCancelled: qn,
	onBeforeLeave: qn,
	onLeave: qn,
	onAfterLeave: qn,
	onLeaveCancelled: qn,
	onBeforeAppear: qn,
	onAppear: qn,
	onAfterAppear: qn,
	onAppearCancelled: qn
}, Yn = (e) => {
	let t = e.subTree;
	return t.component ? Yn(t.component) : t;
}, Xn = {
	name: "BaseTransition",
	props: Jn,
	setup(e, { slots: t }) {
		let n = pa(), r = Kn();
		return () => {
			let i = t.default && ir(t.default(), !0), a = i && i.length ? Zn(i) : n.subTree ? K() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ P(e), { mode: s } = o;
			if (r.isLeaving) return tr(a);
			let c = nr(a);
			if (!c) return tr(a);
			let l = er(c, o, r, n, (e) => l = e);
			c.type !== V && rr(c, l);
			let u = n.subTree && nr(n.subTree);
			if (u && u.type !== V && !Zi(u, c) && Yn(n).type !== V) {
				let e = er(u, o, r, n);
				if (rr(u, e), s === "out-in" && c.type !== V) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, tr(a);
				s === "in-out" && c.type !== V ? e.delayLeave = (e, t, n) => {
					let i = $n(r, u);
					i[String(u.key)] = u, e[Wn] = () => {
						t(), e[Wn] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function Zn(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== V) {
			t = n;
			break;
		}
	}
	return t;
}
var Qn = Xn;
function $n(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function er(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: f, onBeforeLeave: p, onLeave: m, onAfterLeave: h, onLeaveCancelled: g, onBeforeAppear: _, onAppear: v, onAfterAppear: y, onAppearCancelled: b } = t, x = String(e.key), S = $n(n, e), C = (e, t) => {
		e && dn(e, r, 9, t);
	}, w = (e, t) => {
		let n = t[1];
		C(e, t), d(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, ee = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) {
				if (a) r = _ || c;
				else return;
			}
			t[Wn] && t[Wn](!0);
			let i = S[x];
			i && Zi(e, i) && i.el[Wn] && i.el[Wn](), C(r, [t]);
		},
		enter(t) {
			if (S[x] === e) return;
			let r = l, i = u, o = f;
			if (!n.isMounted) {
				if (a) r = v || l, i = y || u, o = b || f;
				else return;
			}
			let s = !1;
			t[Gn] = (e) => {
				s || (s = !0, C(e ? o : i, [t]), ee.delayedLeave && ee.delayedLeave(), t[Gn] = void 0);
			};
			let c = t[Gn].bind(null, !1);
			r ? w(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[Gn] && t[Gn](!0), n.isUnmounting) return r();
			C(p, [t]);
			let a = !1;
			t[Wn] = (n) => {
				a || (a = !0, r(), C(n ? g : h, [t]), t[Wn] = void 0, S[i] === e && delete S[i]);
			};
			let o = t[Wn].bind(null, !1);
			S[i] = e, m ? w(m, [t, o]) : o();
		},
		clone(e) {
			let a = er(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return ee;
}
function tr(e) {
	if (dr(e)) return e = na(e), e.children = null, e;
}
function nr(e) {
	if (!dr(e)) return Un(e.type) && e.children ? Zn(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function rr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		rr(Un(n.type) && nr(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function ir(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === B ? (o.patchFlag & 128 && i++, r = r.concat(ir(o.children, t, s))) : (t || o.type !== V) && r.push(s == null ? o : na(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function ar(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function or(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var sr = /* @__PURE__ */ new WeakMap();
function cr(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => cr(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (ur(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && cr(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? Ea(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ P(v), b = v === t ? i : (e) => !or(_, e) && u(y, e), x = (e, t) => !(t && or(_, t));
	if (m != null && m !== p) {
		if (lr(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ F(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) un(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ F(p);
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
					i(), sr.delete(e);
				};
				t.id = -1, sr.set(e, t), Oi(t, r);
			} else lr(e), i();
		}
	}
}
function lr(e) {
	let t = sr.get(e);
	t && (t.flags |= 8, sr.delete(e));
}
ue().requestIdleCallback, ue().cancelIdleCallback;
var ur = (e) => !!e.type.__asyncLoader, dr = (e) => e.type.__isKeepAlive;
function fr(e, t) {
	mr(e, "a", t);
}
function pr(e, t) {
	mr(e, "da", t);
}
function mr(e, t, n = q) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (gr(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) dr(e.parent.vnode) && hr(r, t, n, e), e = e.parent;
	}
}
function hr(e, t, n, r) {
	let i = gr(t, e, r, !0);
	Cr(() => {
		c(r[t], i);
	}, n);
}
function gr(e, t, n = q, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ke();
			let i = ga(n), a = dn(t, n, e, r);
			return i(), qe(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var _r = (e) => (t, n = q) => {
	(!ya || e === "sp") && gr(e, (...e) => t(...e), n);
}, vr = _r("bm"), yr = _r("m"), br = _r("bu"), xr = _r("u"), Sr = _r("bum"), Cr = _r("um"), wr = _r("sp"), Tr = _r("rtg"), Er = _r("rtc");
function Dr(e, t = q) {
	gr("ec", e, t);
}
var Or = /* @__PURE__ */ Symbol.for("v-ndc");
function R(e, t, n, r) {
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
var kr = (e) => e ? va(e) ? Ea(e) : kr(e.parent) : null, Ar = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => kr(e.parent),
	$root: (e) => kr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => zr(e),
	$forceUpdate: (e) => e.f ||= () => {
		Sn(e.update);
	},
	$nextTick: (e) => e.n ||= bn.bind(e.proxy),
	$watch: (e) => Bn.bind(e)
}), jr = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), Mr = {
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
			else if (jr(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else Pr && (s[n] = 0);
		}
		let d = Ar[n], f, p;
		if (d) return n === "$attrs" && N(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return jr(a, n) ? (a[n] = r, !0) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || jr(n, c) || u(o, c) || u(i, c) || u(Ar, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Nr(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var Pr = !0;
function Fr(e) {
	let t = zr(e), n = e.proxy, i = e.ctx;
	Pr = !1, t.beforeCreate && Lr(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: S, destroyed: C, unmounted: w, render: ee, renderTracked: te, renderTriggered: ne, errorCaptured: T, serverPrefetch: re, expose: E, inheritAttrs: ie, components: ae, directives: D, filters: oe } = t;
	if (u && Ir(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ Lt(t));
	}
	if (Pr = !0, o) for (let e in o) {
		let t = o[e], a = J({
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
	if (c) for (let e in c) Rr(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Pn(t, e[t]);
		});
	}
	f && Lr(f, e, "c");
	function O(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (O(vr, p), O(yr, m), O(br, g), O(xr, _), O(fr, y), O(pr, b), O(Dr, T), O(Er, te), O(Tr, ne), O(Sr, S), O(Cr, w), O(wr, re), d(E)) {
		if (E.length) {
			let t = e.exposed ||= {};
			E.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	ee && e.render === r && (e.render = ee), ie != null && (e.inheritAttrs = ie), ae && (e.components = ae), D && (e.directives = D), re && ar(e);
}
function Ir(e, t, n = r) {
	d(e) && (e = Wr(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? Fn(r.from || n, r.default, !0) : Fn(r.from || n) : Fn(r), /* @__PURE__ */ F(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Lr(e, t, n) {
	dn(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Rr(e, t, n, r) {
	let i = r.includes(".") ? Vn(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && Rn(i, n);
	} else if (h(e)) Rn(i, e.bind(n));
	else if (v(e)) {
		if (d(e)) e.forEach((e) => Rr(e, t, n, r));
		else {
			let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
			h(r) && Rn(i, r, e);
		}
	}
}
function zr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Br(c, e, o, !0)), Br(c, t, o)), v(t) && a.set(t, c), c;
}
function Br(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Br(e, a, n, !0), i && i.forEach((t) => Br(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Vr[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Vr = {
	data: Hr,
	props: Kr,
	emits: Kr,
	methods: Gr,
	computed: Gr,
	beforeCreate: z,
	created: z,
	beforeMount: z,
	mounted: z,
	beforeUpdate: z,
	updated: z,
	beforeDestroy: z,
	beforeUnmount: z,
	destroyed: z,
	unmounted: z,
	activated: z,
	deactivated: z,
	errorCaptured: z,
	serverPrefetch: z,
	components: Gr,
	directives: Gr,
	watch: qr,
	provide: Hr,
	inject: Ur
};
function Hr(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function Ur(e, t) {
	return Gr(Wr(e), Wr(t));
}
function Wr(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function z(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Gr(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Kr(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), Nr(e), Nr(t ?? {})) : t;
}
function qr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = z(e[r], t[r]);
	return n;
}
function Jr() {
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
var Yr = 0;
function Xr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = Jr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: Yr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: ka,
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
					let u = l._ceVNode || G(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, Ea(u.component);
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
				let t = Zr;
				Zr = l;
				try {
					return e();
				} finally {
					Zr = t;
				}
			}
		};
		return l;
	};
}
var Zr = null, Qr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${T(t)}Modifiers`] || e[`${E(t)}Modifiers`];
function $r(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && Qr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(se)));
	let c, l = i[c = ae(n)] || i[c = ae(T(n))];
	!l && o && (l = i[c = ae(E(n))]), l && dn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, dn(u, e, 6, a);
	}
}
var ei = /* @__PURE__ */ new WeakMap();
function ti(e, t, n = !1) {
	let r = n ? ei : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = ti(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function ni(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, E(t)) || u(e, t));
}
function ri(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = jn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = aa(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = aa(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : ii(c);
		}
	} catch (t) {
		Ui.length = 0, fn(t, e, 1), v = G(V);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = ai(y, a)), b = na(b, y, !1, !0));
	}
	return n.dirs && (b = na(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && rr(Un(b.type) && nr(b) || b, n.transition), v = b, jn(_), v;
}
var ii = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, ai = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function oi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? si(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (ci(o, r, n) && !ni(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || si(r, o, l) : !!o;
	return !1;
}
function si(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (ci(t, e, a) && !ni(n, a)) return !0;
	}
	return !1;
}
function ci(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !Ce(r, i) : r !== i;
}
function li({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var ui = {}, di = () => Object.create(ui), fi = (e) => Object.getPrototypeOf(e) === ui;
function pi(e, t, n, r = !1) {
	let i = {}, a = di();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), hi(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Rt(i) : e.type.props ? i : a, e.attrs = a;
}
function mi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ P(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (ni(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = T(o);
						i[t] = gi(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		hi(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = E(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = gi(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && rt(e.attrs, "set", "");
}
function hi(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (ee(t)) continue;
		let l = n[t], d;
		a && u(a, d = T(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : ni(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ P(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = gi(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function gi(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = ga(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === E(n)) && (r = !0));
	}
	return r;
}
var _i = /* @__PURE__ */ new WeakMap();
function vi(e, r, i = !1) {
	let a = i ? _i : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = vi(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = T(c[e]);
		yi(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = T(e);
		if (yi(t)) {
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
function yi(e) {
	return e[0] !== "$" && !ee(e);
}
var bi = (e) => e === "_" || e === "_ctx" || e === "$stable", xi = (e) => d(e) ? e.map(aa) : [aa(e)], Si = (e, t, n) => {
	if (t._n) return t;
	let r = Mn((...e) => xi(t(...e)), n);
	return r._c = !1, r;
}, Ci = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (bi(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = Si(n, i, r);
		else if (i != null) {
			let e = xi(i);
			t[n] = () => e;
		}
	}
}, wi = (e, t) => {
	let n = xi(t);
	e.slots.default = () => n;
}, Ti = (e, t, n) => {
	for (let r in t) (n || !bi(r)) && (e[r] = t[r]);
}, Ei = (e, t, n) => {
	let r = e.slots = di();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Ti(r, t, n), n && O(r, "_", e, !0)) : Ci(t, r);
	} else t && wi(e, t);
}, Di = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : Ti(a, n, r) : (o = !n.$stable, Ci(n, a)), s = n;
	} else n && (wi(e, n), s = { default: 1 });
	if (o) for (let e in a) !bi(e) && s[e] == null && delete a[e];
}, Oi = Bi;
function ki(e) {
	return Ai(e);
}
function Ai(e, i) {
	let a = ue();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Zi(e, t) && (i = ye(e), he(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case Vi:
				y(e, t, r, i);
				break;
			case V:
				b(e, t, r, i);
				break;
			case Hi:
				e ?? x(t, r, i, s);
				break;
			case B:
				ae(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? D(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, Se);
		}
		d != null && a ? cr(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && cr(e.ref, null, o, e, !0);
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
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && T(e.children, d, null, r, i, ji(e, a), s, u), _ && Nn(e, null, r, "created"), ne(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !ee(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && la(f, r, e);
		}
		_ && Nn(e, null, r, "beforeMount");
		let v = Ni(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && Oi(() => {
			try {
				f && la(f, r, e), v && g.enter(d), _ && Nn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, ne = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || zi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ne(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, T = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? oa(e[l]) : aa(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, re = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && Mi(r, !1), (g = h.onVnodeBeforeUpdate) && la(g, r, n, e), f && Nn(n, e, r, "beforeUpdate"), r && Mi(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? E(e.dynamicChildren, d, l, r, i, ji(n, a), o) : s || de(e, n, l, null, r, i, ji(n, a), o, !1), u > 0) {
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
		((g = h.onVnodeUpdated) || f) && Oi(() => {
			g && la(g, r, n, e), f && Nn(n, e, r, "updated");
		}, i);
	}, E = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === B || !Zi(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, ie = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !ee(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (ee(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ae = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), T(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (E(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && Pi(e, t, !0)) : de(e, t, n, f, i, a, s, c, l);
	}, D = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : O(t, n, r, i, a, o, c) : se(e, t, c);
	}, O = (e, t, n, r, i, a, o) => {
		let s = e.component = fa(e, r, i);
		if (dr(e) && (s.ctx.renderer = Se), ba(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ce, o), !e.el) {
				let r = s.subTree = G(V);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ce(s, e, t, n, i, a, o);
	}, se = (e, t, n) => {
		let r = t.component = e.component;
		if (oi(e, t, n)) {
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
					let n = Ii(e);
					if (n) {
						t && (t.el = c.el, le(e, t, o)), n.asyncDep.then(() => {
							Oi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Mi(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && oe(n), (d = t.props && t.props.onVnodeBeforeUpdate) && la(d, s, t, c), Mi(e, !0);
				let f = ri(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ye(p), e, i, a), t.el = f.el, u === null && li(e, f.el), r && Oi(r, i), (d = t.props && t.props.onVnodeUpdated) && Oi(() => la(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = ur(t);
				if (Mi(e, !1), l && oe(l), !m && (o = c && c.onVnodeBeforeMount) && la(o, d, t), Mi(e, !0), s && we) {
					let t = () => {
						e.subTree = ri(e), we(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = ri(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Oi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Oi(() => la(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && ur(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Oi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new je(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Sn(u), Mi(e, !0), l();
	}, le = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, mi(e, t.props, r, n), Di(e, t.children, n), Ke(), Tn(e), qe();
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
		m & 8 ? (u & 16 && ve(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? pe(l, d, n, r, i, a, o, s, c) : ve(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && T(d, n, r, i, a, o, s, c));
	}, fe = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? oa(t[p]) : aa(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? ve(e, a, o, !0, !1, f) : T(t, r, i, a, o, s, c, l, f);
	}, pe = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? oa(t[u]) : aa(t[u]);
			if (Zi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? oa(t[p]) : aa(t[p]);
			if (Zi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? oa(t[u]) : aa(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) he(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? oa(t[u]) : aa(t[u]);
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
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Zi(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? he(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? Fi(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Ri(f) : i;
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
		if (c === B) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) me(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Hi) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Wn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), Oi(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Wn];
					a._isLeaving && a[Wn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, he = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (Ke(), cr(s, null, n, e, !0), qe()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !ur(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && la(_, t, e), u & 6) _e(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Nn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, Se, r) : l && !l.hasOnce && (a !== B || d > 0 && d & 64) ? ve(l, t, n, !1, !0) : (a === B && d & 384 || !i && u & 16) && ve(c, t, n), r && k(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Oi(() => {
			_ && la(_, t, e), h && Nn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, k = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === B) {
			ge(n, r);
			return;
		}
		if (t === Hi) {
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
		Li(c), Li(l), r && oe(r), i.stop(), a ? (a.flags |= 8, he(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, he(o, e, t, n)), s && Oi(s, t), Oi(() => {
			e.isUnmounted = !0;
		}, t);
	}, ve = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) he(e[o], t, n, r, i);
	}, ye = (e) => {
		if (e.shapeFlag & 6) return ye(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Hn];
		return n ? h(n) : t;
	}, be = !1, xe = (e, t, n) => {
		let r;
		e == null ? t._vnode && (he(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, be ||= (be = !0, Tn(r), En(), !1);
	}, Se = {
		p: v,
		um: he,
		m: me,
		r: k,
		mt: O,
		mc: T,
		pc: de,
		pbc: E,
		n: ye,
		o: e
	}, Ce, we;
	return i && ([Ce, we] = i(Se)), {
		render: xe,
		hydrate: Ce,
		createApp: Xr(xe, Ce)
	};
}
function ji({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Mi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Ni(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Pi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = oa(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Pi(t, a)), a.type === Vi && (a.patchFlag === -1 && (a = i[e] = oa(a)), a.el = t.el), a.type === V && !a.el && (a.el = t.el);
	}
}
function Fi(e) {
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
function Ii(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Ii(t);
}
function Li(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ri(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ri(t.subTree) : null;
}
var zi = (e) => e.__isSuspense;
function Bi(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : wn(e);
}
var B = /* @__PURE__ */ Symbol.for("v-fgt"), Vi = /* @__PURE__ */ Symbol.for("v-txt"), V = /* @__PURE__ */ Symbol.for("v-cmt"), Hi = /* @__PURE__ */ Symbol.for("v-stc"), Ui = [], Wi = null;
function H(e = !1) {
	Ui.push(Wi = e ? null : []);
}
function Gi() {
	Ui.pop(), Wi = Ui[Ui.length - 1] || null;
}
var Ki = 1;
function qi(e, t = !1) {
	Ki += e, e < 0 && Wi && t && (Wi.hasOnce = !0);
}
function Ji(e) {
	return e.dynamicChildren = Ki > 0 ? Wi || n : null, Gi(), Ki > 0 && Wi && Wi.push(e), e;
}
function U(e, t, n, r, i, a) {
	return Ji(W(e, t, n, r, i, a, !0));
}
function Yi(e, t, n, r, i) {
	return Ji(G(e, t, n, r, i, !0));
}
function Xi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Zi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Qi = ({ key: e }) => e ?? null, $i = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ F(e) || h(e) ? {
	i: kn,
	r: e,
	k: t,
	f: !!n
} : e);
function W(e, t = null, n = null, r = 0, i = null, a = e === B ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Qi(t),
		ref: t && $i(t),
		scopeId: An,
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
		ctx: kn
	};
	return s ? (sa(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), Ki > 0 && !o && Wi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Wi.push(c), c;
}
var G = ea;
function ea(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Or) && (e = V), Xi(e)) {
		let r = na(e, t, !0);
		return n && sa(r, n), Ki > 0 && !a && Wi && (r.shapeFlag & 6 ? Wi[Wi.indexOf(e)] = r : Wi.push(r)), r.patchFlag = -2, r;
	}
	if (Da(e) && (e = e.__vccOpts), t) {
		t = ta(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = k(e)), v(n) && (/* @__PURE__ */ Wt(n) && !d(n) && (n = s({}, n)), t.style = de(n));
	}
	let o = g(e) ? 1 : zi(e) ? 128 : Un(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return W(e, t, n, r, i, o, a, !0);
}
function ta(e) {
	return e ? /* @__PURE__ */ Wt(e) || fi(e) ? s({}, e) : e : null;
}
function na(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ca(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Qi(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat($i(t)) : [a, $i(t)] : $i(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== B ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && na(e.ssContent),
		ssFallback: e.ssFallback && na(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && rr(u, c.clone(u)), u;
}
function ra(e = " ", t = 0) {
	return G(Vi, null, e, t);
}
function ia(e, t) {
	let n = G(Hi, null, e);
	return n.staticCount = t, n;
}
function K(e = "", t = !1) {
	return t ? (H(), Yi(V, null, e)) : G(V, null, e);
}
function aa(e) {
	return e == null || typeof e == "boolean" ? G(V) : d(e) ? G(B, null, e.slice()) : Xi(e) ? oa(e) : G(Vi, null, String(e));
}
function oa(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : na(e);
}
function sa(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), sa(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !fi(t) ? t._ctx = kn : r === 3 && kn && (kn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			sa(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: kn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [ra(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ca(...e) {
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
function la(e, t, n, r = null) {
	dn(e, t, 7, [n, r]);
}
var ua = Jr(), da = 0;
function fa(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || ua, o = {
		uid: da++,
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
		propsOptions: vi(i, a),
		emitsOptions: ti(i, a),
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
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = $r.bind(null, o), e.ce && e.ce(o), o;
}
var q = null, pa = () => q || kn, ma, ha;
{
	let e = ue(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ma = t("__VUE_INSTANCE_SETTERS__", (e) => q = e), ha = t("__VUE_SSR_SETTERS__", (e) => ya = e);
}
var ga = (e) => {
	let t = q;
	return ma(e), e.scope.on(), () => {
		e.scope.off(), ma(t);
	};
}, _a = () => {
	q && q.scope.off(), ma(null);
};
function va(e) {
	return e.vnode.shapeFlag & 4;
}
var ya = !1;
function ba(e, t = !1, n = !1) {
	t && ha(t);
	let { props: r, children: i } = e.vnode, a = va(e);
	pi(e, r, a, t), Ei(e, i, n || t);
	let o = a ? xa(e, t) : void 0;
	return t && ha(!1), o;
}
function xa(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Mr);
	let { setup: r } = n;
	if (r) {
		Ke();
		let n = e.setupContext = r.length > 1 ? Ta(e) : null, i = ga(e), a = un(r, e, 0, [e.props, n]), o = y(a);
		if (qe(), i(), (o || e.sp) && !ur(e) && ar(e), o) {
			if (a.then(_a, _a), t) return a.then((n) => {
				ha(!0);
				try {
					Sa(e, n, t);
				} finally {
					ha(!1);
				}
			}).catch((t) => {
				fn(t, e, 0);
			});
			e.asyncDep = a;
		} else Sa(e, a, t);
	} else Ca(e, t);
}
function Sa(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = en(t)), Ca(e, n);
}
function Ca(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
	{
		let t = ga(e);
		Ke();
		try {
			Fr(e);
		} finally {
			qe(), t();
		}
	}
}
var wa = { get(e, t) {
	return N(e, "get", ""), e[t];
} };
function Ta(e) {
	return {
		attrs: new Proxy(e.attrs, wa),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Ea(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(en(Gt(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Ar) return Ar[n](e);
		},
		has(e, t) {
			return t in e || t in Ar;
		}
	}) : e.proxy;
}
function Da(e) {
	return h(e) && "__vccOpts" in e;
}
var J = (e, t) => /* @__PURE__ */ nn(e, t, ya);
function Oa(e, t, n) {
	try {
		qi(-1);
		let r = arguments.length;
		return r === 2 ? v(t) && !d(t) ? Xi(t) ? G(e, null, [t]) : G(e, t) : G(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Xi(n) && (n = [n]), G(e, t, n));
	} finally {
		qi(1);
	}
}
var ka = "3.5.43", Aa = void 0, ja = typeof window < "u" && window.trustedTypes;
if (ja) try {
	Aa = /* @__PURE__ */ ja.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Ma = Aa ? (e) => Aa.createHTML(e) : (e) => e, Na = "http://www.w3.org/2000/svg", Pa = "http://www.w3.org/1998/Math/MathML", Fa = typeof document < "u" ? document : null, Ia = Fa && /* @__PURE__ */ Fa.createElement("template"), La = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Fa.createElementNS(Na, e) : t === "mathml" ? Fa.createElementNS(Pa, e) : n ? Fa.createElement(e, { is: n }) : Fa.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Fa.createTextNode(e),
	createComment: (e) => Fa.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Fa.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Ia.innerHTML = Ma(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ia.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ra = "transition", za = "animation", Ba = /* @__PURE__ */ Symbol("_vtc"), Va = {
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
}, Ha = /* @__PURE__ */ s({}, Jn, Va), Ua = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = Ha, e))((e, { slots: t }) => Oa(Qn, Ka(e), t)), Wa = (e, t = []) => {
	d(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, Ga = (e) => e ? d(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function Ka(e) {
	let t = {};
	for (let n in e) n in Va || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: c = `${n}-enter-to`, appearFromClass: l = a, appearActiveClass: u = o, appearToClass: d = c, leaveFromClass: f = `${n}-leave-from`, leaveActiveClass: p = `${n}-leave-active`, leaveToClass: m = `${n}-leave-to` } = e, h = qa(i), g = h && h[0], _ = h && h[1], { onBeforeEnter: v, onEnter: y, onEnterCancelled: b, onLeave: x, onLeaveCancelled: S, onBeforeAppear: C = v, onAppear: w = y, onAppearCancelled: ee = b } = t, te = (e, t, n, r) => {
		e._enterCancelled = r, Xa(e, t ? d : c), Xa(e, t ? u : o), n && n();
	}, ne = (e, t) => {
		e._isLeaving = !1, Xa(e, f), Xa(e, m), Xa(e, p), t && t();
	}, T = (e) => (t, n) => {
		let i = e ? w : y, o = () => te(t, e, n);
		Wa(i, [t, o]), Za(() => {
			Xa(t, e ? l : a), Ya(t, e ? d : c), Ga(i) || $a(t, r, g, o);
		});
	};
	return s(t, {
		onBeforeEnter(e) {
			Wa(v, [e]), Ya(e, a), Ya(e, o);
		},
		onBeforeAppear(e) {
			Wa(C, [e]), Ya(e, l), Ya(e, u);
		},
		onEnter: T(!1),
		onAppear: T(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => ne(e, t);
			Ya(e, f), e._enterCancelled ? (Ya(e, p), ro(e)) : (ro(e), Ya(e, p)), Za(() => {
				e._isLeaving && (Xa(e, f), Ya(e, m), Ga(x) || $a(e, r, _, n));
			}), Wa(x, [e, n]);
		},
		onEnterCancelled(e) {
			te(e, !1, void 0, !0), Wa(b, [e]);
		},
		onAppearCancelled(e) {
			te(e, !0, void 0, !0), Wa(ee, [e]);
		},
		onLeaveCancelled(e) {
			ne(e), Wa(S, [e]);
		}
	});
}
function qa(e) {
	if (e == null) return null;
	if (v(e)) return [Ja(e.enter), Ja(e.leave)];
	{
		let t = Ja(e);
		return [t, t];
	}
}
function Ja(e) {
	return ce(e);
}
function Ya(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[Ba] || (e[Ba] = /* @__PURE__ */ new Set())).add(t);
}
function Xa(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[Ba];
	n && (n.delete(t), n.size || (e[Ba] = void 0));
}
function Za(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var Qa = 0;
function $a(e, t, n, r) {
	let i = e._endId = ++Qa, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = eo(e, t);
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
function eo(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${Ra}Delay`), a = r(`${Ra}Duration`), o = to(i, a), s = r(`${za}Delay`), c = r(`${za}Duration`), l = to(s, c), u = null, d = 0, f = 0;
	t === Ra ? o > 0 && (u = Ra, d = o, f = a.length) : t === za ? l > 0 && (u = za, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? Ra : za : null, f = u ? u === Ra ? a.length : c.length : 0);
	let p = u === Ra && /\b(?:transform|all)(?:,|$)/.test(r(`${Ra}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function to(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => no(t) + no(e[n])));
}
function no(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function ro(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function io(e, t, n) {
	let r = e[Ba];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var ao = /* @__PURE__ */ Symbol("_vod"), oo = /* @__PURE__ */ Symbol("_vsh"), so = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[ao] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : co(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), co(e, !0), r.enter(e)) : r.leave(e, () => {
			co(e, !1);
		}) : co(e, t));
	},
	beforeUnmount(e, { value: t }) {
		co(e, t);
	}
};
function co(e, t) {
	e.style.display = t ? e[ao] : "none", e[oo] = !t;
}
var lo = /* @__PURE__ */ Symbol(""), uo = /(?:^|;)\s*display\s*:/;
function fo(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? mo(r, t, "");
			}
			else for (let e in t) n[e] ?? mo(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? mo(r, i, "") : vo(e, i, !g(t) && t ? t[i] : void 0, o) || mo(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[lo];
			e && (n += ";" + e), r.cssText = n, a = uo.test(n);
		}
	} else t && e.removeAttribute("style");
	ao in e && (e[ao] = a ? r.display : "", e[oo] && (r.display = "none"));
}
var po = /\s*!important$/;
function mo(e, t, n) {
	if (d(n)) n.forEach((n) => mo(e, t, n));
	else if (n ??= "", t.startsWith("--")) po.test(n) ? e.setProperty(t, n.replace(po, ""), "important") : e.setProperty(t, n);
	else {
		let r = _o(e, t);
		po.test(n) ? e.setProperty(E(r), n.replace(po, ""), "important") : e[r] = n;
	}
}
var ho = [
	"Webkit",
	"Moz",
	"ms"
], go = {};
function _o(e, t) {
	let n = go[t];
	if (n) return n;
	let r = T(t);
	if (r !== "filter" && r in e) return go[t] = r;
	r = ie(r);
	for (let n = 0; n < ho.length; n++) {
		let i = ho[n] + r;
		if (i in e) return go[t] = i;
	}
	return t;
}
function vo(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var yo = "http://www.w3.org/1999/xlink";
function bo(e, t, n, r, i, a = _e(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(yo, t.slice(6, t.length)) : e.setAttributeNS(yo, t, n) : n == null || a && !ve(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function xo(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ma(n) : n);
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
function So(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Co(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var wo = /* @__PURE__ */ Symbol("_vei");
function To(e, t, n, r, i = null) {
	let a = e[wo] || (e[wo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Oo(t);
		r ? So(e, n, a[t] = Mo(r, i), s) : o && (Co(e, n, o, s), a[t] = void 0);
	}
}
var Eo = /(Once|Passive|Capture)$/, Do = /^on:?(?:Once|Passive|Capture)$/;
function Oo(e) {
	let t, n;
	for (; (n = e.match(Eo)) && !Do.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : E(e.slice(2)), t];
}
var ko = 0, Ao = /* @__PURE__ */ Promise.resolve(), jo = () => ko ||= (Ao.then(() => ko = 0), Date.now());
function Mo(e, t) {
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
	return n.value = e, n.attached = jo(), n;
}
var No = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Po = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? io(e, r, c) : t === "style" ? fo(e, n, r) : a(t) ? o(t) || To(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Fo(e, t, r, c)) ? (xo(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && bo(e, t, r, c, s, t !== "value")) : e._isVueCE && (Io(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? xo(e, T(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), bo(e, t, r, c));
};
function Fo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && No(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return No(t) && g(n) ? !1 : t in e;
}
function Io(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = T(t);
	return Array.isArray(n) ? n.some((e) => T(e) === r) : Object.keys(n).some((e) => T(e) === r);
}
var Lo = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => oe(t, e) : t;
};
function Ro(e) {
	e.target.composing = !0;
}
function zo(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Bo = /* @__PURE__ */ Symbol("_assign"), Vo = /* @__PURE__ */ Symbol("_initialValue");
function Ho(e, t, n) {
	return t && (e = e.trim()), n && (e = se(e)), e;
}
var Uo = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Vo] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Vo] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Bo] = Lo(i);
		let a = r || i.props && i.props.type === "number";
		So(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Bo](Ho(e.value, n, a));
		}), (n || a) && So(e, "change", () => {
			e.value = Ho(e.value, n, a);
		}), t || (So(e, "compositionstart", Ro), So(e, "compositionend", zo), So(e, "change", zo));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Vo];
		delete e[Vo], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Bo](Ho(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Bo] = Lo(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? se(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Wo = {
	deep: !0,
	created(e, t, n) {
		e[Bo] = Lo(n), So(e, "change", () => {
			let t = e._modelValue, n = Xo(e), r = e.checked, i = e[Bo];
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
			} else i(Zo(e, r));
		});
	},
	mounted: Go,
	beforeUpdate(e, t, n) {
		e[Bo] = Lo(n), Go(e, t, n);
	}
};
function Go(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (d(t)) i = we(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Ce(t, Zo(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Ko = {
	created(e, { value: t }, n) {
		e.checked = Ce(t, n.props.value), e[Bo] = Lo(n), So(e, "change", () => {
			e[Bo](Xo(e));
		});
	},
	beforeUpdate(e, { value: t, oldValue: n }, r) {
		e[Bo] = Lo(r), t !== n && (e.checked = Ce(t, r.props.value));
	}
}, qo = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, So(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? se(Xo(e)) : Xo(e)), r = e.multiple, i = r ? p(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? d(i) ? t.slice() : t : i];
			try {
				e[Bo](i);
			} finally {
				bn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Bo] = Lo(r);
	},
	mounted(e, { value: t }) {
		Yo(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Bo] = Lo(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !Jo(t, n[1], n[0])) && Yo(e, t);
	}
};
function Jo(e, t, n) {
	if (!n || d(e)) return Ce(e, t);
	if (p(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function Yo(e, t) {
	let n = e.multiple, r = d(t);
	if (!n || r || p(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = Xo(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : we(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (Ce(Xo(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function Xo(e) {
	return "_value" in e ? e._value : e.value;
}
function Zo(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var Qo = {
	created(e, t, n) {
		es(e, t, n, null, "created");
	},
	mounted(e, t, n) {
		es(e, t, n, null, "mounted");
	},
	beforeUpdate(e, t, n, r) {
		es(e, t, n, r, "beforeUpdate");
	},
	updated(e, t, n, r) {
		es(e, t, n, r, "updated");
	}
};
function $o(e, t) {
	switch (e) {
		case "SELECT": return qo;
		case "TEXTAREA": return Uo;
		default: switch (t) {
			case "checkbox": return Wo;
			case "radio": return Ko;
			default: return Uo;
		}
	}
}
function es(e, t, n, r, i) {
	let a = $o(e.tagName, n.props && n.props.type)[i];
	a && a(e, t, n, r);
}
var ts = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], ns = {
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
	exact: (e, t) => ts.some((n) => e[`${n}Key`] && !t.includes(n))
}, rs = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = ns[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, is = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, as = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = E(n.key);
		if (t.some((e) => e === r || is[e] === r)) return e(n);
	}));
}, os = /* @__PURE__ */ s({ patchProp: Po }, La), ss;
function cs() {
	return ss ||= ki(os);
}
var ls = ((...e) => {
	let t = cs().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = ds(e);
		if (!r) return;
		let i = t._component;
		!h(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, us(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function us(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function ds(e) {
	return g(e) ? document.querySelector(e) : e;
}
//#endregion
//#region \0plugin-vue:export-helper
var Y = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, fs = {
	key: 0,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, ps = {
	key: 1,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, ms = {
	key: 2,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, hs = {
	key: 3,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, gs = {
	key: 4,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, _s = {
	key: 5,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, vs = {
	key: 6,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, ys = {
	key: 7,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, bs = {
	key: 8,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, xs = {
	key: 9,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Ss = {
	key: 10,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Cs = {
	key: 11,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, ws = {
	key: 12,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Ts = {
	key: 13,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Es = {
	key: 14,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Ds = {
	key: 15,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	class: "xy-icon"
}, Os = {
	key: 16,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2",
	class: "xy-icon"
}, X = /*#__PURE__*/ Y({
	__name: "Icons",
	props: { name: {
		type: String,
		required: !0
	} },
	setup(e) {
		return (t, n) => e.name === "swords" ? (H(), U("svg", fs, [...n[0] ||= [ia("<polyline points=\"14.5 17.5 3 6 3 3 6 3 17.5 14.5\" data-v-7df92507></polyline><line x1=\"13\" y1=\"19\" x2=\"19\" y2=\"13\" data-v-7df92507></line><line x1=\"16\" y1=\"16\" x2=\"20\" y2=\"20\" data-v-7df92507></line><line x1=\"19\" y1=\"21\" x2=\"21\" y2=\"19\" data-v-7df92507></line><polyline points=\"14.5 6.5 18 3 21 3 21 6 17.5 9.5\" data-v-7df92507></polyline><line x1=\"5\" y1=\"14\" x2=\"9\" y2=\"18\" data-v-7df92507></line><line x1=\"7\" y1=\"17\" x2=\"4\" y2=\"20\" data-v-7df92507></line><line x1=\"3\" y1=\"19\" x2=\"5\" y2=\"21\" data-v-7df92507></line>", 8)]])) : e.name === "settings" ? (H(), U("svg", ps, [...n[1] ||= [W("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		}, null, -1), W("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" }, null, -1)]])) : e.name === "scroll" ? (H(), U("svg", ms, [...n[2] ||= [W("path", { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" }, null, -1)]])) : e.name === "search" ? (H(), U("svg", hs, [...n[3] ||= [W("circle", {
			cx: "11",
			cy: "11",
			r: "8"
		}, null, -1), W("line", {
			x1: "21",
			y1: "21",
			x2: "16.65",
			y2: "16.65"
		}, null, -1)]])) : e.name === "close" ? (H(), U("svg", gs, [...n[4] ||= [W("line", {
			x1: "18",
			y1: "6",
			x2: "6",
			y2: "18"
		}, null, -1), W("line", {
			x1: "6",
			y1: "6",
			x2: "18",
			y2: "18"
		}, null, -1)]])) : e.name === "play" ? (H(), U("svg", _s, [...n[5] ||= [W("polygon", { points: "5 3 19 12 5 21 5 3" }, null, -1)]])) : e.name === "next" ? (H(), U("svg", vs, [...n[6] ||= [W("polygon", { points: "5 4 15 12 5 20 5 4" }, null, -1), W("line", {
			x1: "19",
			y1: "5",
			x2: "19",
			y2: "19"
		}, null, -1)]])) : e.name === "stop" ? (H(), U("svg", ys, [...n[7] ||= [W("rect", {
			x: "4",
			y: "4",
			width: "16",
			height: "16",
			rx: "2"
		}, null, -1)]])) : e.name === "refresh" ? (H(), U("svg", bs, [...n[8] ||= [W("polyline", { points: "23 4 23 10 17 10" }, null, -1), W("path", { d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10" }, null, -1)]])) : e.name === "send" ? (H(), U("svg", xs, [...n[9] ||= [W("line", {
			x1: "22",
			y1: "2",
			x2: "11",
			y2: "13"
		}, null, -1), W("polygon", { points: "22 2 15 22 11 13 2 9 22 2" }, null, -1)]])) : e.name === "lock" ? (H(), U("svg", Ss, [...n[10] ||= [W("rect", {
			x: "3",
			y: "11",
			width: "18",
			height: "11",
			rx: "2",
			ry: "2"
		}, null, -1), W("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }, null, -1)]])) : e.name === "sparkles" ? (H(), U("svg", Cs, [...n[11] ||= [W("path", { d: "m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" }, null, -1)]])) : e.name === "copy" ? (H(), U("svg", ws, [...n[12] ||= [W("rect", {
			width: "14",
			height: "14",
			x: "8",
			y: "8",
			rx: "2",
			ry: "2"
		}, null, -1), W("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }, null, -1)]])) : e.name === "check" ? (H(), U("svg", Ts, [...n[13] ||= [W("polyline", { points: "20 6 9 17 4 12" }, null, -1)]])) : e.name === "eye" ? (H(), U("svg", Es, [...n[14] ||= [W("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }, null, -1), W("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		}, null, -1)]])) : e.name === "eye-off" ? (H(), U("svg", Ds, [...n[15] ||= [W("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }, null, -1), W("line", {
			x1: "1",
			y1: "1",
			x2: "23",
			y2: "23"
		}, null, -1)]])) : (H(), U("svg", Os, [...n[16] ||= [W("circle", {
			cx: "12",
			cy: "12",
			r: "10"
		}, null, -1)]]));
	}
}, [["__scopeId", "data-v-7df92507"]]), ks = { class: "xy-header" }, As = { class: "xy-header-left" }, js = { class: "xy-header-titles" }, Ms = { class: "xy-kicker" }, Ns = ["title"], Ps = { class: "xy-title" }, Fs = { class: "xy-title-text" }, Is = {
	key: 0,
	class: "xy-round-seal"
}, Ls = { class: "xy-subtitle" }, Rs = { class: "xy-nav-tabs" }, zs = ["onClick"], Bs = {
	key: 0,
	class: "xy-tab-badge"
}, Vs = { class: "xy-header-right" }, Hs = { class: "xy-phase-name" }, Us = { class: "xy-meta-tag" }, Ws = { class: "xy-meta-mode" }, Gs = { class: "xy-meta-ver" }, Ks = /*#__PURE__*/ Y({
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
		}, i = J(() => r[t.phase] || t.phase), a = J(() => ({
			http: "真实模型",
			mock: "离线演示",
			main_story: "主剧情桥接",
			packet: "场景包",
			unconfigured: "未配模型"
		})[t.adjudicatorMode] || t.adjudicatorMode), o = J(() => {
			let e = t.semanticState.压制 || t.semanticState.control || "";
			return e.includes("主角") || e.includes("胜") ? "tone-player" : e.includes("敌") || e.includes("劣") ? "tone-enemy" : "tone-neutral";
		});
		return (t, r) => (H(), U("header", ks, [
			W("div", As, [r[7] ||= W("div", { class: "xy-brand-seal" }, [W("span", { class: "xy-seal-symbol" }, "弦")], -1), W("div", js, [
				W("div", Ms, [
					r[1] ||= W("span", null, "XY BATTLE SYSTEM", -1),
					r[2] ||= W("span", { class: "xy-kicker-dot" }, "·", -1),
					r[3] ||= W("span", null, "叠浪玄潮决", -1),
					r[4] ||= W("span", { class: "xy-kicker-dot" }, "·", -1),
					W("span", {
						class: "xy-scope-pill",
						title: "作用域: " + e.scope.chatId + " / " + e.scope.branchId
					}, A(e.scope.chatId) + " / " + A(e.scope.branchId), 9, Ns)
				]),
				W("h1", Ps, [W("span", Fs, A(e.scene.location || "待定战场"), 1), e.round > 0 ? (H(), U("span", Is, "第 " + A(e.round) + " 回合", 1)) : K("", !0)]),
				W("p", Ls, [
					W("span", null, A(e.scene.time || "时辰未定"), 1),
					r[5] ||= W("span", { class: "xy-sep" }, "|", -1),
					W("span", null, A(e.scene.initiative || "均势先发"), 1),
					r[6] ||= W("span", { class: "xy-sep" }, "|", -1),
					W("span", { class: k(["xy-control-state", o.value]) }, A(e.semanticState.压制 || e.semanticState.control || "均势"), 3)
				])
			])]),
			W("nav", Rs, [(H(), U(B, null, R(n, (n) => W("button", {
				key: n.id,
				class: k(["xy-tab-btn", { active: e.currentTab === n.id }]),
				onClick: (e) => t.$emit("update:tab", n.id)
			}, [
				G(X, {
					name: n.icon,
					class: "xy-tab-icon"
				}, null, 8, ["name"]),
				W("span", null, A(n.label), 1),
				n.id === "developer" && e.logCount > 0 ? (H(), U("span", Bs, A(e.logCount), 1)) : K("", !0)
			], 10, zs)), 64))]),
			W("div", Vs, [
				W("div", { class: k(["xy-phase-indicator", "phase-" + e.phase]) }, [r[8] ||= W("span", { class: "xy-phase-pulse" }, null, -1), W("span", Hs, A(i.value), 1)], 2),
				W("div", Us, [W("span", Ws, A(a.value), 1), W("span", Gs, "v" + A(e.version), 1)]),
				W("button", {
					class: "xy-close-btn",
					onClick: r[0] ||= (e) => t.$emit("close"),
					"aria-label": "关闭工作台",
					title: "关闭 (Esc)"
				}, [G(X, { name: "close" })])
			])
		]));
	}
}, [["__scopeId", "data-v-7ddda437"]]), qs = {
	class: "xy-atmosphere",
	"aria-hidden": "true"
}, Js = /*#__PURE__*/ Y({
	__name: "AtmosphereBackground",
	setup(e) {
		return (e, t) => (H(), U("div", qs, [...t[0] ||= [ia("<div class=\"xy-water-mist\" data-v-03bd5794></div><svg class=\"xy-string-canvas\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"none\" viewBox=\"0 0 1440 800\" data-v-03bd5794><defs data-v-03bd5794><linearGradient id=\"stringGrad1\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\" data-v-03bd5794><stop offset=\"0%\" stop-color=\"#38bdf8\" stop-opacity=\"0.02\" data-v-03bd5794></stop><stop offset=\"35%\" stop-color=\"#38bdf8\" stop-opacity=\"0.25\" data-v-03bd5794></stop><stop offset=\"65%\" stop-color=\"#2dd4bf\" stop-opacity=\"0.2\" data-v-03bd5794></stop><stop offset=\"100%\" stop-color=\"#38bdf8\" stop-opacity=\"0.02\" data-v-03bd5794></stop></linearGradient><linearGradient id=\"stringGrad2\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\" data-v-03bd5794><stop offset=\"0%\" stop-color=\"#fbbf24\" stop-opacity=\"0\" data-v-03bd5794></stop><stop offset=\"50%\" stop-color=\"#fbbf24\" stop-opacity=\"0.18\" data-v-03bd5794></stop><stop offset=\"100%\" stop-color=\"#fbbf24\" stop-opacity=\"0\" data-v-03bd5794></stop></linearGradient><linearGradient id=\"vortexGrad\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\" data-v-03bd5794><stop offset=\"0%\" stop-color=\"#38bdf8\" stop-opacity=\"0.12\" data-v-03bd5794></stop><stop offset=\"100%\" stop-color=\"#07101e\" stop-opacity=\"0\" data-v-03bd5794></stop></linearGradient></defs><path class=\"xy-chord-line chord-1\" d=\"M 0 320 Q 360 280 720 320 T 1440 320\" fill=\"none\" stroke=\"url(#stringGrad1)\" stroke-width=\"1.2\" data-v-03bd5794></path><path class=\"xy-chord-line chord-2\" d=\"M 0 460 Q 400 500 720 460 T 1440 460\" fill=\"none\" stroke=\"url(#stringGrad1)\" stroke-width=\"1\" data-v-03bd5794></path><path class=\"xy-chord-line chord-3\" d=\"M 0 390 Q 380 430 720 390 T 1440 390\" fill=\"none\" stroke=\"url(#stringGrad2)\" stroke-width=\"0.9\" data-v-03bd5794></path><ellipse cx=\"720\" cy=\"400\" rx=\"340\" ry=\"110\" fill=\"none\" stroke=\"url(#vortexGrad)\" stroke-width=\"1.5\" stroke-dasharray=\"6 8\" class=\"xy-vortex-ring\" data-v-03bd5794></ellipse><ellipse cx=\"720\" cy=\"400\" rx=\"200\" ry=\"65\" fill=\"none\" stroke=\"rgba(56, 189, 248, 0.08)\" stroke-width=\"1\" data-v-03bd5794></ellipse><ellipse cx=\"720\" cy=\"400\" rx=\"80\" ry=\"26\" fill=\"rgba(56, 189, 248, 0.03)\" stroke=\"rgba(251, 191, 36, 0.15)\" stroke-width=\"1\" data-v-03bd5794></ellipse></svg><div class=\"xy-particles\" data-v-03bd5794><span class=\"xy-sparkle s1\" data-v-03bd5794></span><span class=\"xy-sparkle s2\" data-v-03bd5794></span><span class=\"xy-sparkle s3\" data-v-03bd5794></span><span class=\"xy-sparkle s4\" data-v-03bd5794></span><span class=\"xy-sparkle s5\" data-v-03bd5794></span></div>", 3)]]));
	}
}, [["__scopeId", "data-v-03bd5794"]]), Ys = {
	key: 0,
	class: "xy-figure-custom"
}, Xs = ["src", "alt"], Zs = {
	class: "xy-daoist-svg",
	viewBox: "0 0 220 380",
	preserveAspectRatio: "xMidYMid meet"
}, Qs = ["id"], $s = ["stop-color"], ec = ["stop-color"], tc = ["stop-color"], nc = ["id"], rc = {
	class: "xy-base-ripples",
	transform: "translate(110, 350)"
}, ic = ["stroke"], ac = ["stroke"], oc = ["stroke"], sc = { class: "xy-orbiting-chords" }, cc = [
	"d",
	"stroke",
	"filter"
], lc = ["d", "stroke"], uc = ["filter"], dc = ["fill"], fc = ["fill"], pc = ["fill"], mc = ["fill"], hc = ["fill"], gc = ["fill"], _c = ["stroke"], vc = ["stroke"], yc = /*#__PURE__*/ Y({
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
		let t = e, n = J(() => !!t.avatar), r = J(() => t.avatar), i = J(() => t.side === "player" ? "#38bdf8" : "#f43f5e"), a = J(() => t.side === "player" ? "#2dd4bf" : "#fbbf24");
		return (t, o) => (H(), U("div", { class: k(["xy-figure-container", ["figure-" + e.side]]) }, [o[6] ||= W("div", {
			class: "xy-figure-halo",
			"aria-hidden": "true"
		}, null, -1), n.value ? (H(), U("div", Ys, [W("img", {
			src: r.value,
			alt: e.name,
			class: "xy-custom-img"
		}, null, 8, Xs), o[0] ||= W("div", { class: "xy-custom-frame-deco" }, null, -1)])) : (H(), U("div", {
			key: 1,
			class: k(["xy-figure-silhouette", e.side])
		}, [(H(), U("svg", Zs, [
			W("defs", null, [
				o[2] ||= ia("<linearGradient id=\"playerRobeGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\" data-v-86c24f93><stop offset=\"0%\" stop-color=\"#38bdf8\" stop-opacity=\"0.9\" data-v-86c24f93></stop><stop offset=\"40%\" stop-color=\"#0284c7\" stop-opacity=\"0.8\" data-v-86c24f93></stop><stop offset=\"85%\" stop-color=\"#082f49\" stop-opacity=\"0.95\" data-v-86c24f93></stop><stop offset=\"100%\" stop-color=\"#03070d\" stop-opacity=\"1\" data-v-86c24f93></stop></linearGradient><linearGradient id=\"enemyRobeGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\" data-v-86c24f93><stop offset=\"0%\" stop-color=\"#fb7185\" stop-opacity=\"0.9\" data-v-86c24f93></stop><stop offset=\"40%\" stop-color=\"#be123c\" stop-opacity=\"0.8\" data-v-86c24f93></stop><stop offset=\"85%\" stop-color=\"#4c0519\" stop-opacity=\"0.95\" data-v-86c24f93></stop><stop offset=\"100%\" stop-color=\"#03070d\" stop-opacity=\"1\" data-v-86c24f93></stop></linearGradient>", 2),
				W("radialGradient", {
					id: e.side + "CoreGrad",
					cx: "50%",
					cy: "50%",
					r: "50%"
				}, [
					W("stop", {
						offset: "0%",
						"stop-color": e.side === "player" ? "#e0f2fe" : "#ffe4e6",
						"stop-opacity": "1"
					}, null, 8, $s),
					W("stop", {
						offset: "40%",
						"stop-color": e.side === "player" ? "#38bdf8" : "#f43f5e",
						"stop-opacity": "0.8"
					}, null, 8, ec),
					W("stop", {
						offset: "100%",
						"stop-color": e.side === "player" ? "#0369a1" : "#881337",
						"stop-opacity": "0"
					}, null, 8, tc)
				], 8, Qs),
				W("filter", {
					id: e.side + "Glow",
					x: "-20%",
					y: "-20%",
					width: "140%",
					height: "140%"
				}, [...o[1] ||= [W("feGaussianBlur", {
					stdDeviation: "4",
					result: "blur"
				}, null, -1), W("feComposite", {
					in: "SourceGraphic",
					in2: "blur",
					operator: "over"
				}, null, -1)]], 8, nc)
			]),
			W("g", rc, [
				W("ellipse", {
					cx: "0",
					cy: "0",
					rx: "75",
					ry: "14",
					fill: "none",
					stroke: i.value,
					"stroke-opacity": "0.3",
					"stroke-width": "1.2"
				}, null, 8, ic),
				W("ellipse", {
					cx: "0",
					cy: "0",
					rx: "55",
					ry: "10",
					fill: "none",
					stroke: i.value,
					"stroke-opacity": "0.5",
					"stroke-width": "1"
				}, null, 8, ac),
				W("ellipse", {
					cx: "0",
					cy: "0",
					rx: "30",
					ry: "6",
					fill: "none",
					stroke: i.value,
					"stroke-opacity": "0.7",
					"stroke-width": "1.5"
				}, null, 8, oc)
			]),
			W("g", sc, [W("path", {
				d: e.side === "player" ? "M 20 280 C 10 160, 200 120, 195 240 C 190 320, 40 330, 25 240" : "M 200 280 C 210 160, 20 120, 25 240 C 30 320, 180 330, 195 240",
				fill: "none",
				stroke: i.value,
				"stroke-width": "1.5",
				"stroke-dasharray": "6 4",
				opacity: "0.6",
				filter: `url(#${e.side}Glow)`
			}, null, 8, cc), W("path", {
				d: e.side === "player" ? "M 45 220 C 30 140, 180 90, 175 190 C 170 270, 60 280, 48 200" : "M 175 220 C 190 140, 40 90, 45 190 C 50 270, 160 280, 172 200",
				fill: "none",
				stroke: a.value,
				"stroke-width": "1",
				opacity: "0.4"
			}, null, 8, lc)]),
			W("g", {
				class: "xy-figure-body-group",
				filter: `url(#${e.side}Glow)`
			}, [
				W("path", {
					d: "M 110 95 \r\n               C 135 110, 165 170, 175 260 \r\n               C 180 305, 165 345, 150 355 \r\n               C 125 345, 95 345, 70 355 \r\n               C 55 345, 40 305, 45 260 \r\n               C 55 170, 85 110, 110 95 Z",
					fill: `url(#${e.side}RobeGrad)`,
					stroke: "rgba(255,255,255,0.2)",
					"stroke-width": "0.8"
				}, null, 8, dc),
				W("path", {
					d: "M 85 130 C 55 160, 30 220, 38 270 C 45 275, 62 250, 72 210 Z",
					fill: e.side === "player" ? "#075985" : "#9f1239",
					opacity: "0.8"
				}, null, 8, fc),
				W("path", {
					d: "M 135 130 C 165 160, 190 220, 182 270 C 175 275, 158 250, 148 210 Z",
					fill: e.side === "player" ? "#075985" : "#9f1239",
					opacity: "0.8"
				}, null, 8, pc),
				o[3] ||= W("path", {
					d: "M 110 98 L 95 150 L 110 240 L 125 150 Z",
					fill: "rgba(255,255,255,0.08)",
					stroke: "rgba(255,255,255,0.25)",
					"stroke-width": "0.8"
				}, null, -1),
				W("circle", {
					cx: "110",
					cy: "180",
					r: "14",
					fill: `url(#${e.side}CoreGrad)`
				}, null, 8, mc),
				o[4] ||= W("circle", {
					cx: "110",
					cy: "180",
					r: "4",
					fill: "#ffffff",
					opacity: "0.9"
				}, null, -1),
				W("ellipse", {
					cx: "110",
					cy: "72",
					rx: "16",
					ry: "21",
					fill: `url(#${e.side}RobeGrad)`,
					stroke: "rgba(255,255,255,0.3)",
					"stroke-width": "0.8"
				}, null, 8, hc),
				W("path", {
					d: "M 103 52 L 110 42 L 117 52 Z",
					fill: a.value
				}, null, 8, gc),
				W("line", {
					x1: "94",
					y1: "48",
					x2: "126",
					y2: "48",
					stroke: a.value,
					"stroke-width": "1.5"
				}, null, 8, _c),
				W("circle", {
					cx: "110",
					cy: "68",
					r: "32",
					fill: "none",
					stroke: i.value,
					"stroke-width": "1",
					"stroke-dasharray": "4 6",
					opacity: "0.6"
				}, null, 8, vc)
			], 8, uc)
		])), o[5] ||= W("div", { class: "xy-figure-sparkles" }, [
			W("span", { class: "xy-f-dot d1" }),
			W("span", { class: "xy-f-dot d2" }),
			W("span", { class: "xy-f-dot d3" })
		], -1)], 2))], 2));
	}
}, [["__scopeId", "data-v-86c24f93"]]), bc = {
	class: "xy-wings-rays-svg",
	viewBox: "0 0 380 400",
	preserveAspectRatio: "none"
}, xc = ["id"], Sc = ["stop-color"], Cc = ["stop-color"], wc = ["d", "stroke"], Tc = { class: "xy-wings-container" }, Ec = ["title", "onClick"], Dc = { class: "xy-feather-inner" }, Oc = { class: "xy-feather-name" }, kc = {
	key: 0,
	class: "xy-feather-lock",
	title: "条件未足"
}, Ac = {
	key: 1,
	class: "xy-feather-badge"
}, jc = {
	key: 0,
	class: "xy-wings-empty"
}, Mc = /*#__PURE__*/ Y({
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
		let n = e, r = t, i = J(() => n.items.slice(0, 6)), a = J(() => n.isModalOpen && !!n.selectedTermId);
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
		return (t, n) => (H(), U("div", { class: k(["xy-chord-wings", ["wings-" + e.side]]) }, [(H(), U("svg", bc, [W("defs", null, [W("linearGradient", {
			id: e.side + "RayGrad",
			x1: "0%",
			y1: "0%",
			x2: "100%",
			y2: "0%"
		}, [W("stop", {
			offset: "0%",
			"stop-color": e.side === "player" ? "#38bdf8" : "#fb7185",
			"stop-opacity": "0.7"
		}, null, 8, Sc), W("stop", {
			offset: "100%",
			"stop-color": e.side === "player" ? "#2dd4bf" : "#fbbf24",
			"stop-opacity": "0.1"
		}, null, 8, Cc)], 8, xc)]), (H(!0), U(B, null, R(i.value, (t, n) => (H(), U("path", {
			key: "ray-" + n,
			d: u(n, i.value.length),
			fill: "none",
			stroke: `url(#${e.side}RayGrad)`,
			"stroke-width": "1.5",
			"stroke-dasharray": "5 7",
			opacity: "0.6"
		}, null, 8, wc))), 128))])), W("div", Tc, [(H(!0), U(B, null, R(i.value, (t, r) => (H(), U("button", {
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
			n[1] ||= W("span", { class: "xy-feather-tip" }, null, -1),
			W("div", Dc, [
				n[0] ||= W("span", { class: "xy-feather-crest" }, "◆", -1),
				W("span", Oc, A(t.name), 1),
				s(t) ? (H(), U("span", kc, "🔒")) : (H(), U("span", Ac, A(c(t)), 1))
			]),
			n[2] ||= W("span", {
				class: "xy-feather-string",
				"aria-hidden": "true"
			}, null, -1)
		], 14, Ec))), 128)), e.items.length ? K("", !0) : (H(), U("div", jc, [W("span", null, A(e.side === "player" ? "未感应到可用功法弦羽" : "未见可察敌招"), 1)]))])], 2));
	}
}, [["__scopeId", "data-v-918b413f"]]), Nc = { class: "xy-buff-box-lane" }, Pc = { class: "xy-buff-header" }, Fc = { class: "xy-buff-icon" }, Ic = { class: "xy-buff-title" }, Lc = { class: "xy-buff-content" }, Rc = {
	key: 0,
	class: "xy-buff-badges"
}, zc = { class: "xy-pill-label" }, Bc = {
	key: 0,
	class: "xy-pill-round"
}, Vc = {
	key: 1,
	class: "xy-buff-empty"
}, Hc = { class: "xy-zone-middle" }, Uc = { class: "xy-figure-wrapper" }, Wc = { class: "xy-wings-wrapper" }, Gc = { class: "xy-wings-wrapper" }, Kc = { class: "xy-figure-wrapper" }, qc = { class: "xy-info-box-lane" }, Jc = { class: "xy-info-top" }, Yc = { class: "xy-info-title-group" }, Xc = { class: "xy-side-kicker" }, Zc = { class: "xy-actor-name" }, Qc = { class: "xy-actor-id" }, $c = {
	key: 0,
	class: "xy-target-switchers"
}, el = ["onClick"], tl = { class: "xy-traits-row" }, nl = { class: "xy-trait-k" }, rl = { class: "xy-trait-v" }, il = {
	key: 0,
	class: "xy-trait-none"
}, al = {
	key: 0,
	class: "xy-resources-row"
}, ol = { class: "xy-res-chips" }, sl = /*#__PURE__*/ Y({
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
		let t = e, n = J(() => t.enemiesList?.length || 0), r = J(() => {
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
		}), i = J(() => Object.keys(r.value).length > 0), a = J(() => {
			let e = t.actor.resources;
			return e && typeof e == "object" && Object.keys(e).length > 0;
		});
		function o(e) {
			return typeof e == "object" ? JSON.stringify(e) : String(e);
		}
		return (t, s) => (H(), U("div", { class: k(["xy-fighter-zone", ["zone-" + e.side, { "is-active-target": e.isSelectedTarget }]]) }, [
			W("div", Nc, [W("div", { class: k(["xy-buff-card", "buff-" + e.side]) }, [W("div", Pc, [W("span", Fc, A(e.side === "player" ? "✦" : "✧"), 1), W("span", Ic, A(e.side === "player" ? "本尊加持与异常" : "敌修气机附着"), 1)]), W("div", Lc, [e.effects.length ? (H(), U("div", Rc, [(H(!0), U(B, null, R(e.effects, (e, t) => (H(), U("span", {
				key: t,
				class: k(["xy-buff-pill", { "is-field": e.lane === "field" }])
			}, [
				s[2] ||= W("span", { class: "xy-pill-dot" }, null, -1),
				W("span", zc, A(e.label), 1),
				e.remainingRounds === void 0 ? K("", !0) : (H(), U("small", Bc, A(e.remainingRounds) + "轮", 1))
			], 2))), 128))])) : (H(), U("div", Vc, [...s[3] ||= [W("span", null, "灵息平稳 · 无异常灵息", -1)]]))])], 2)]),
			W("div", Hc, [e.side === "player" ? (H(), U(B, { key: 0 }, [W("div", Uc, [G(yc, {
				side: "player",
				name: e.actor.name || "主角",
				avatar: e.actor.avatar || e.actor.portrait || ""
			}, null, 8, ["name", "avatar"])]), W("div", Wc, [G(Mc, {
				side: "player",
				items: e.techniques,
				"selected-term-id": e.selectedTermId,
				"is-modal-open": e.isModalOpen,
				onSelectWing: s[0] ||= (e) => t.$emit("select-petal", e)
			}, null, 8, [
				"items",
				"selected-term-id",
				"is-modal-open"
			])])], 64)) : (H(), U(B, { key: 1 }, [W("div", Gc, [G(Mc, {
				side: "enemy",
				items: e.techniques,
				"selected-term-id": e.selectedTermId,
				"is-modal-open": e.isModalOpen,
				onSelectWing: s[1] ||= (e) => t.$emit("select-petal", e)
			}, null, 8, [
				"items",
				"selected-term-id",
				"is-modal-open"
			])]), W("div", Kc, [G(yc, {
				side: "enemy",
				name: e.actor.name || "敌手",
				avatar: e.actor.avatar || e.actor.portrait || ""
			}, null, 8, ["name", "avatar"])])], 64))]),
			W("div", qc, [W("div", { class: k(["xy-character-info-card", "info-" + e.side]) }, [
				W("div", Jc, [W("div", Yc, [
					W("span", Xc, A(e.side === "player" ? "DAOIST" : "OPPONENT"), 1),
					W("h3", Zc, A(e.actor.name || (e.side === "player" ? "主角" : "敌手")), 1),
					W("span", Qc, "#" + A(e.actor.id), 1)
				]), e.side === "enemy" && n.value > 1 ? (H(), U("div", $c, [(H(!0), U(B, null, R(e.enemiesList, (n) => (H(), U("button", {
					key: n.id,
					class: k(["xy-switch-btn", { active: n.id === e.actor.id }]),
					onClick: (e) => t.$emit("select-target", n.id)
				}, A(n.name), 11, el))), 128))])) : K("", !0)]),
				W("div", tl, [(H(!0), U(B, null, R(r.value, (e, t) => (H(), U("span", {
					key: t,
					class: "xy-trait-item"
				}, [W("b", nl, A(t) + ":", 1), W("span", rl, A(o(e)), 1)]))), 128)), i.value ? K("", !0) : (H(), U("span", il, "平稳对峙 · 无显露法力特征"))]),
				a.value ? (H(), U("div", al, [s[4] ||= W("span", { class: "xy-res-label" }, "气海机枢:", -1), W("div", ol, [(H(!0), U(B, null, R(e.actor.resources, (e, t) => (H(), U("span", {
					key: t,
					class: "xy-res-tag"
				}, [W("b", null, A(t), 1), ra(" " + A(e), 1)]))), 128))])])) : K("", !0)
			], 2)])
		], 2));
	}
}, [["__scopeId", "data-v-4e525baf"]]), cl = { class: "xy-harmonic-gauge" }, ll = { class: "xy-gauge-round" }, ul = { class: "xy-round-num" }, dl = { class: "xy-dom-label" }, fl = /*#__PURE__*/ Y({
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
		let t = e, n = J(() => t.semanticState.压制 || t.semanticState.control || "均势对峙"), r = J(() => {
			let e = n.value;
			return e.includes("主角") || e.includes("胜") ? "dom-player" : e.includes("敌") || e.includes("劣") ? "dom-enemy" : "dom-neutral";
		});
		return (t, i) => (H(), U("div", cl, [
			W("div", ll, [i[0] ||= W("span", { class: "xy-round-roman" }, "ROUND", -1), W("b", ul, A(e.round > 0 ? e.round < 10 ? "0" + e.round : e.round : "—"), 1)]),
			i[1] ||= ia("<div class=\"xy-wave-resonator\" data-v-ed77923f><svg class=\"xy-wave-svg\" viewBox=\"0 0 120 70\" preserveAspectRatio=\"none\" data-v-ed77923f><defs data-v-ed77923f><linearGradient id=\"waveCyanGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\" data-v-ed77923f><stop offset=\"0%\" stop-color=\"#38bdf8\" stop-opacity=\"0.8\" data-v-ed77923f></stop><stop offset=\"50%\" stop-color=\"#2dd4bf\" stop-opacity=\"0.9\" data-v-ed77923f></stop><stop offset=\"100%\" stop-color=\"#fb7185\" stop-opacity=\"0.8\" data-v-ed77923f></stop></linearGradient></defs><path class=\"xy-sine-path p1\" d=\"M 0 35 Q 30 18, 60 35 T 120 35\" fill=\"none\" stroke=\"url(#waveCyanGrad)\" stroke-width=\"1.8\" data-v-ed77923f></path><path class=\"xy-sine-path p2\" d=\"M 0 35 Q 30 52, 60 35 T 120 35\" fill=\"none\" stroke=\"rgba(251, 191, 36, 0.5)\" stroke-width=\"1.2\" data-v-ed77923f></path><circle cx=\"60\" cy=\"35\" r=\"3.5\" fill=\"#fbbf24\" class=\"xy-center-node\" data-v-ed77923f></circle></svg></div><div class=\"xy-vs-emblem\" data-v-ed77923f><span class=\"xy-vs-text\" data-v-ed77923f>VS</span><div class=\"xy-vs-aura\" data-v-ed77923f></div></div>", 2),
			W("div", { class: k(["xy-dominance-pill", r.value]) }, [W("span", dl, A(n.value), 1)], 2)
		]));
	}
}, [["__scopeId", "data-v-ed77923f"]]), pl = { class: "xy-center-stage" }, ml = { class: "xy-center-head" }, hl = { class: "xy-center-weather" }, gl = { class: "xy-weather-text" }, _l = { class: "xy-center-body xy-custom-scroll" }, vl = {
	class: "xy-term-scroll-view",
	key: "term"
}, yl = { class: "xy-scroll-top-bar" }, bl = { class: "xy-scroll-badge" }, xl = { class: "xy-badge-origin" }, Sl = { class: "xy-scroll-tech-title" }, Cl = { class: "xy-tech-name-glow" }, wl = { class: "xy-scroll-quote" }, Tl = { class: "xy-scroll-details" }, El = {
	key: 0,
	class: "xy-detail-block"
}, Dl = { class: "xy-detail-list" }, Ol = {
	key: 1,
	class: "xy-detail-block"
}, kl = { class: "xy-detail-list" }, Al = {
	key: 2,
	class: "xy-detail-block"
}, jl = {
	key: 3,
	class: "xy-detail-block"
}, Ml = { class: "xy-rule-tags" }, Nl = {
	key: 0,
	class: "xy-scroll-action"
}, Pl = {
	class: "xy-situation-view",
	key: "situation"
}, Fl = { class: "xy-positions-card" }, Il = { class: "xy-pos-clash" }, Ll = { class: "xy-pos-node player" }, Rl = { class: "xy-node-name" }, zl = { class: "xy-node-val" }, Bl = { class: "xy-pos-bridge" }, Vl = { class: "xy-bridge-dist" }, Hl = { class: "xy-pos-node enemy" }, Ul = { class: "xy-node-name" }, Wl = { class: "xy-node-val" }, Gl = {
	key: 0,
	class: "xy-semantic-grid"
}, Kl = { class: "xy-sem-k" }, ql = { class: "xy-sem-v" }, Jl = { class: "xy-verdict-card" }, Yl = { class: "xy-verdict-header" }, Xl = {
	key: 0,
	class: "xy-verdict-round"
}, Zl = {
	key: 0,
	class: "xy-verdict-body"
}, Ql = { class: "xy-verdict-action" }, $l = {
	key: 0,
	class: "xy-verdict-prose"
}, eu = {
	key: 1,
	class: "xy-verdict-summary"
}, tu = {
	key: 2,
	class: "xy-verdict-await"
}, nu = {
	key: 1,
	class: "xy-verdict-empty"
}, ru = { class: "xy-center-footer" }, iu = { class: "xy-footer-status" }, au = /*#__PURE__*/ Y({
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
		let t = e, n = J(() => {
			let e = t.allEffects?.filter((e) => e.lane === "field") || [];
			return e.length ? e.map((e) => e.label).join(" · ") : "天地肃穆 · 水平如镜";
		}), r = J(() => t.semanticState.positions?.player || t.semanticState.主角站位 || "近岸"), i = J(() => {
			let e = t.currentEnemy?.id || "enemy-1";
			return t.semanticState.positions?.[e] || t.semanticState.敌方站位 || "台心";
		}), a = J(() => t.currentEnemy?.visibleInfo?.站位 || "中距对峙"), o = J(() => {
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
		}), s = J(() => {
			let e = t.selectedTermData;
			return e ? e.rawDescription || e.originalDefinition || e.description || "暂无古籍阐发" : "";
		}), c = J(() => t.selectedTermData?.mechanics || []), l = J(() => t.selectedTermData?.triggeredState || []), u = J(() => t.selectedTermData?.ruleRefs || []), d = J(() => t.selectedTermSide === "player" ? t.selectedTermAvailability?.available ?? !0 : !0), f = J(() => t.selectedTermAvailability?.reason || (d.value ? "契合当前环境，随时可发" : "前置弦势未足")), p = J(() => t.selectedTermSide === "player" ? d.value ? "status-pass" : "status-fail" : "status-observe"), m = J(() => t.selectedTermSide === "player" ? d.value ? "本轮可用" : "机缘未备" : "公开可察招式"), h = J(() => t.phase === "judging" ? "天道推演裁定中……" : t.phase === "narrating" ? "正文撰刻中……" : t.phase === "awaiting_player" ? "天道神念就绪 · 请修士落子起弦" : t.phase === "awaiting_next" ? "裁定已确立 · 静候进发下一轮" : "灵台安宁 · 待启战局");
		return (t, g) => (H(), U("div", pl, [
			W("div", ml, [
				g[4] ||= W("div", { class: "xy-pillar-crest" }, [W("span", { class: "xy-pillar-crest-dot" }, "☯"), W("span", { class: "xy-pillar-title" }, "战状核心枢纽")], -1),
				G(fl, {
					round: e.round,
					"semantic-state": e.semanticState
				}, null, 8, ["round", "semantic-state"]),
				W("div", hl, [g[3] ||= W("span", { class: "xy-weather-dot" }, "●", -1), W("span", gl, A(n.value), 1)])
			]),
			W("div", _l, [G(Ua, {
				name: "center-fade",
				mode: "out-in"
			}, {
				default: Mn(() => [e.selectedTermData ? (H(), U("div", vl, [
					W("div", yl, [W("div", bl, [
						W("span", null, "📜 " + A(e.selectedTermSide === "player" ? "主角传承" : "敌手破招"), 1),
						g[5] ||= W("span", { class: "xy-badge-sep" }, "·", -1),
						W("span", xl, A(e.selectedTermParentName), 1)
					]), W("button", {
						class: "xy-scroll-close-btn",
						onClick: g[0] ||= (e) => t.$emit("clear-term"),
						title: "返回战况"
					}, "✕")]),
					W("h4", Sl, [
						g[6] ||= W("span", { class: "xy-bracket" }, "【", -1),
						W("span", Cl, A(e.selectedTermData.name), 1),
						g[7] ||= W("span", { class: "xy-bracket" }, "】", -1),
						W("span", { class: k(["xy-tech-status-chip", p.value]) }, A(m.value), 3)
					]),
					W("blockquote", wl, [W("p", null, A(s.value), 1)]),
					W("div", Tl, [
						c.value.length ? (H(), U("div", El, [g[8] ||= W("span", { class: "xy-detail-label" }, "⚙ 演化机制", -1), W("ul", Dl, [(H(!0), U(B, null, R(c.value, (e, t) => (H(), U("li", { key: t }, A(e), 1))), 128))])])) : K("", !0),
						l.value.length ? (H(), U("div", Ol, [g[9] ||= W("span", { class: "xy-detail-label" }, "⚡ 触发态势", -1), W("ul", kl, [(H(!0), U(B, null, R(l.value, (e, t) => (H(), U("li", { key: t }, A(e), 1))), 128))])])) : K("", !0),
						e.selectedTermSide === "player" ? (H(), U("div", Al, [g[10] ||= W("span", { class: "xy-detail-label" }, "⚖ 本轮机缘", -1), W("p", { class: k(["xy-cond-text", d.value ? "pass" : "fail"]) }, A(f.value), 3)])) : K("", !0),
						u.value.length ? (H(), U("div", jl, [g[11] ||= W("span", { class: "xy-detail-label" }, "💠 规制出处", -1), W("div", Ml, [(H(!0), U(B, null, R(u.value, (e) => (H(), U("span", {
							key: e,
							class: "xy-rule-tag"
						}, A(e), 1))), 128))])])) : K("", !0)
					]),
					e.selectedTermSide === "player" && d.value ? (H(), U("div", Nl, [W("button", {
						class: "xy-pick-tech-btn",
						onClick: g[1] ||= (n) => t.$emit("apply-technique", e.selectedTermData.id)
					}, [...g[12] ||= [W("span", null, "选用此招并起势", -1), W("span", { class: "xy-btn-arrow" }, "→", -1)]])])) : K("", !0)
				])) : (H(), U("div", Pl, [
					W("div", Fl, [g[14] ||= W("div", { class: "xy-pos-header" }, [W("span", { class: "xy-pos-crest" }, "⚔"), W("span", null, "两仪站位与间距")], -1), W("div", Il, [
						W("div", Ll, [W("span", Rl, A(e.player?.name || "主角"), 1), W("span", zl, A(r.value), 1)]),
						W("div", Bl, [W("span", Vl, A(a.value), 1), g[13] ||= W("span", { class: "xy-bridge-line" }, null, -1)]),
						W("div", Hl, [W("span", Ul, A(e.currentEnemy?.name || "敌修"), 1), W("span", Wl, A(i.value), 1)])
					])]),
					o.value.length ? (H(), U("div", Gl, [(H(!0), U(B, null, R(o.value, (e) => (H(), U("div", {
						key: e.key,
						class: k(["xy-sem-card", { active: e.active }])
					}, [W("span", Kl, A(e.key), 1), W("span", ql, A(e.val), 1)], 2))), 128))])) : K("", !0),
					W("div", Jl, [W("div", Yl, [g[15] ||= W("span", { class: "xy-verdict-title" }, "天道裁定战状判词", -1), e.latestRecord ? (H(), U("span", Xl, "第 " + A(e.latestRecord.round) + " 回合", 1)) : K("", !0)]), e.latestRecord ? (H(), U("div", Zl, [W("p", Ql, [g[16] ||= W("b", null, "行止动作:", -1), ra(" " + A(e.latestRecord.actionLabel || e.latestRecord.techniqueId || "自由出招"), 1)]), e.latestRecord.narrative?.text ? (H(), U("div", $l, [W("p", null, A(e.latestRecord.narrative.text), 1)])) : e.latestRecord.outcomeSummary ? (H(), U("p", eu, [g[17] ||= W("b", null, "战局变化:", -1), ra(" " + A(e.latestRecord.outcomeSummary), 1)])) : (H(), U("p", tu, " 裁定已落，正文撰刻中…… "))])) : (H(), U("div", nu, [...g[18] ||= [W("span", null, "战局未启 · 请修士在下方输入心念行止并提交裁定", -1)]]))]),
					W("button", {
						class: "xy-view-timeline-btn",
						onClick: g[2] ||= (e) => t.$emit("open-history")
					}, [...g[19] ||= [W("span", null, "📜 查阅完整战史演进与天道批注", -1)]])
				]))]),
				_: 1
			})]),
			W("div", ru, [g[20] ||= W("span", { class: "xy-footer-pulse" }, null, -1), W("span", iu, A(h.value), 1)])
		]));
	}
}, [["__scopeId", "data-v-4b90d29b"]]), ou = { class: "xy-skill-modal-card" }, su = { class: "xy-modal-header" }, cu = { class: "xy-modal-crest" }, lu = { class: "xy-crest-side" }, uu = { class: "xy-crest-origin" }, du = { class: "xy-modal-title-row" }, fu = { class: "xy-modal-title" }, pu = { class: "xy-tech-name-glow" }, mu = { class: "xy-modal-ancient-quote" }, hu = { class: "xy-quote-text" }, gu = { class: "xy-modal-grid" }, _u = {
	key: 0,
	class: "xy-grid-cell"
}, vu = { class: "xy-cell-list" }, yu = {
	key: 1,
	class: "xy-grid-cell"
}, bu = { class: "xy-cell-list" }, xu = {
	key: 2,
	class: "xy-grid-cell"
}, Su = { class: "xy-grid-cell" }, Cu = { class: "xy-rulerefs-tags" }, wu = {
	key: 0,
	class: "xy-no-rules"
}, Tu = { class: "xy-modal-footer" }, Eu = { class: "xy-footer-hint" }, Du = { class: "xy-footer-btns" }, Ou = ["disabled", "title"], ku = {
	key: 0,
	class: "xy-btn-lock"
}, Au = {
	key: 1,
	class: "xy-btn-arrow"
}, ju = /*#__PURE__*/ Y({
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
		yr(() => {
			window.addEventListener("keydown", a);
		}), Cr(() => {
			window.removeEventListener("keydown", a);
		});
		let o = J(() => n.termData ? n.termData.rawDescription || n.termData.originalDefinition || n.termData.description || "暂无古籍阐发" : ""), s = J(() => n.termData?.mechanics || []), c = J(() => n.termData?.triggeredState || []), l = J(() => n.termData?.ruleRefs || []), u = J(() => n.isPlayer ? n.availabilityStatus?.available ?? !0 : !0), d = J(() => n.isPlayer ? n.availabilityStatus?.reason || (u.value ? "契合当前环境，随时可发" : "前置弦势未足") : "公开观察到的招式特征"), f = J(() => {
			if (n.isPlayer) return u.value ? "tone-emerald" : "tone-amber";
			{
				let e = n.termData?.status;
				return e === "known" ? "tone-emerald" : e === "inferred" ? "tone-amber" : "tone-slate";
			}
		}), p = J(() => n.isPlayer ? u.value ? "本轮可用" : "机缘未备" : {
			known: "已明悟",
			inferred: "推测中",
			unknown: "未知虚实"
		}[n.termData?.status] || "公开可察招式");
		return (t, n) => (H(), Yi(Ua, { name: "xy-modal-pop" }, {
			default: Mn(() => [e.isOpen && e.termData ? (H(), U("div", {
				key: 0,
				class: "xy-skill-modal-backdrop",
				role: "dialog",
				"aria-modal": "true",
				onClick: rs(i, ["self"])
			}, [W("div", ou, [
				n[13] ||= W("span", { class: "xy-card-corner top-left" }, null, -1),
				n[14] ||= W("span", { class: "xy-card-corner top-right" }, null, -1),
				n[15] ||= W("span", { class: "xy-card-corner bottom-left" }, null, -1),
				n[16] ||= W("span", { class: "xy-card-corner bottom-right" }, null, -1),
				W("div", su, [W("div", cu, [
					n[3] ||= W("span", { class: "xy-crest-icon" }, "📜", -1),
					W("span", lu, A(e.isPlayer ? "主角传承" : "敌修破招"), 1),
					n[4] ||= W("span", { class: "xy-crest-dot" }, "·", -1),
					W("span", uu, A(e.parentName), 1)
				]), W("button", {
					class: "xy-modal-close-btn",
					onClick: n[0] ||= (e) => t.$emit("close"),
					"aria-label": "关闭弹窗",
					title: "关闭 (Esc / 点击空白处)"
				}, " ✕ ")]),
				W("div", du, [W("h3", fu, [
					n[5] ||= W("span", { class: "xy-bracket" }, "【", -1),
					W("span", pu, A(e.termData.name), 1),
					n[6] ||= W("span", { class: "xy-bracket" }, "】", -1)
				]), W("div", { class: k(["xy-modal-status-badge", f.value]) }, [n[7] ||= W("span", { class: "xy-status-dot" }, null, -1), W("span", null, A(p.value), 1)], 2)]),
				W("blockquote", mu, [W("p", hu, "“" + A(o.value) + "”", 1)]),
				W("div", gu, [
					s.value.length ? (H(), U("div", _u, [n[8] ||= W("span", { class: "xy-cell-title" }, [W("span", { class: "xy-cell-icon" }, "⚙"), W("span", null, "演化机制")], -1), W("ul", vu, [(H(!0), U(B, null, R(s.value, (e, t) => (H(), U("li", { key: t }, A(e), 1))), 128))])])) : K("", !0),
					c.value.length ? (H(), U("div", yu, [n[9] ||= W("span", { class: "xy-cell-title" }, [W("span", { class: "xy-cell-icon" }, "⚡"), W("span", null, "触发态势")], -1), W("ul", bu, [(H(!0), U(B, null, R(c.value, (e, t) => (H(), U("li", { key: t }, A(e), 1))), 128))])])) : K("", !0),
					e.isPlayer ? (H(), U("div", xu, [n[10] ||= W("span", { class: "xy-cell-title" }, [W("span", { class: "xy-cell-icon" }, "⚖"), W("span", null, "本轮机缘")], -1), W("p", { class: k(["xy-condition-note", u.value ? "cond-pass" : "cond-fail"]) }, A(d.value), 3)])) : K("", !0),
					W("div", Su, [n[11] ||= W("span", { class: "xy-cell-title" }, [W("span", { class: "xy-cell-icon" }, "💠"), W("span", null, "规制出处")], -1), W("div", Cu, [(H(!0), U(B, null, R(l.value, (e) => (H(), U("span", {
						key: e,
						class: "xy-rule-chip"
					}, A(e), 1))), 128)), l.value.length ? K("", !0) : (H(), U("span", wu, "未注明规则出处"))])])
				]),
				W("div", Tu, [W("span", Eu, A(e.isPlayer ? "功法源于结构化 Registry · 遵循语义裁定机枢" : "敌方内部资源与 Hidden 战术已被天道法则严格屏蔽"), 1), W("div", Du, [W("button", {
					class: "xy-footer-dismiss-btn",
					onClick: n[1] ||= (e) => t.$emit("close")
				}, " 返回战场 "), e.isPlayer ? (H(), U("button", {
					key: 0,
					class: k(["xy-footer-apply-btn", { "is-locked": !u.value }]),
					disabled: !u.value,
					title: u.value ? "选用此招并起势" : d.value || "机缘未备，尚未满足施展条件",
					onClick: n[2] ||= (n) => u.value && t.$emit("apply", e.termData.id)
				}, [
					u.value ? K("", !0) : (H(), U("span", ku, "🔒")),
					n[12] ||= W("span", null, "选用此招并起势", -1),
					u.value ? (H(), U("span", Au, "→")) : K("", !0)
				], 10, Ou)) : K("", !0)])])
			])])) : K("", !0)]),
			_: 1
		}));
	}
}, [["__scopeId", "data-v-ae39d47f"]]), Mu = { class: "xy-action-topbar" }, Nu = { class: "xy-action-controls" }, Pu = ["disabled"], Fu = ["disabled"], Iu = ["disabled"], Lu = ["disabled"], Ru = ["disabled"], zu = { class: "xy-action-console" }, Bu = { class: "xy-technique-selector" }, Vu = { class: "xy-tech-picker-label" }, Hu = ["value", "disabled"], Uu = ["value", "disabled"], Wu = { class: "xy-input-box-wrapper" }, Gu = [
	"value",
	"disabled",
	"onKeydown"
], Ku = ["disabled"], qu = { class: "xy-submit-content" }, Ju = { class: "xy-submit-text" }, Yu = /*#__PURE__*/ Y({
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
		let n = e, r = t, i = /* @__PURE__ */ Jt(null), a = J(() => n.isBusy ? n.phase === "judging" ? "天道裁定中…" : n.phase === "narrating" ? "正文撰刻中…" : "推演中…" : n.phase === "awaiting_player" ? "提交裁定" : "静候机枢");
		function o() {
			n.isBusy || n.phase !== "awaiting_player" || r("submit");
		}
		return (t, n) => (H(), U("section", { class: k(["xy-action-dock", { "is-busy": e.isBusy }]) }, [W("div", Mu, [W("div", Nu, [
			W("button", {
				class: "xy-ctrl-btn btn-start",
				disabled: e.isBusy || !["idle", "ended"].includes(e.phase),
				onClick: n[0] ||= (e) => t.$emit("start")
			}, [G(X, { name: "play" }), n[11] ||= W("span", null, "启战 / 继续", -1)], 8, Pu),
			W("button", {
				class: "xy-ctrl-btn btn-next",
				disabled: e.isBusy || !["awaiting_next", "committed"].includes(e.phase),
				onClick: n[1] ||= (e) => t.$emit("next")
			}, [G(X, { name: "next" }), n[12] ||= W("span", null, "进发下轮", -1)], 8, Fu),
			W("button", {
				class: "xy-ctrl-btn btn-stop",
				disabled: ["idle", "ended"].includes(e.phase),
				onClick: n[2] ||= (e) => t.$emit("stop")
			}, [G(X, { name: "stop" }), n[13] ||= W("span", null, "止戈停战", -1)], 8, Iu),
			e.latestCommitted ? (H(), U("button", {
				key: 0,
				class: "xy-ctrl-btn btn-rewrite",
				disabled: e.isBusy,
				onClick: n[3] ||= (e) => t.$emit("rewrite"),
				title: "重写本轮正文 (保留已判决事实，不重裁)"
			}, [G(X, { name: "refresh" }), n[14] ||= W("span", null, "重写正文", -1)], 8, Lu)) : K("", !0),
			e.latestCommitted ? (H(), U("button", {
				key: 1,
				class: "xy-ctrl-btn btn-inject",
				disabled: e.isBusy,
				onClick: n[4] ||= (e) => t.$emit("queue"),
				title: "注入酒馆主剧情下条提示词"
			}, [G(X, { name: "send" }), n[15] ||= W("span", null, "注为主剧情", -1)], 8, Ru)) : K("", !0),
			e.hasBridgeQueued ? (H(), U("button", {
				key: 2,
				class: "xy-ctrl-btn btn-skip",
				onClick: n[5] ||= (e) => t.$emit("skip-narrative")
			}, [...n[16] ||= [W("span", null, "跳过本轮正文", -1)]])) : K("", !0),
			e.hostSyncPending ? (H(), U("button", {
				key: 3,
				class: "xy-ctrl-btn btn-retry-host",
				onClick: n[6] ||= (e) => t.$emit("retry-host")
			}, [...n[17] ||= [W("span", null, "重试宿主同步", -1)]])) : K("", !0),
			W("button", {
				class: "xy-ctrl-btn btn-history",
				onClick: n[7] ||= (e) => t.$emit("toggle-history"),
				title: "演武战史与批注"
			}, [G(X, { name: "scroll" }), n[18] ||= W("span", null, "战史演进", -1)])
		])]), W("div", zu, [
			W("div", Bu, [W("label", Vu, [n[20] ||= W("span", { class: "xy-picker-kicker" }, "选用心法", -1), W("select", {
				class: "xy-tech-select",
				value: e.selectedTechniqueId,
				disabled: e.isBusy,
				onChange: n[8] ||= (e) => t.$emit("update:techniqueId", e.target.value)
			}, [n[19] ||= W("option", { value: "" }, "自由身法 (自由行动)", -1), (H(!0), U(B, null, R(e.techniqueOptions, (e) => (H(), U("option", {
				key: e.id,
				value: e.id,
				disabled: !e.available
			}, A(e.name) + A(e.available ? "" : " (机缘未至)"), 9, Uu))), 128))], 40, Hu)]), e.selectedTechniqueId ? (H(), U("button", {
				key: 0,
				class: "xy-clear-tech-btn",
				onClick: n[9] ||= (e) => t.$emit("update:techniqueId", ""),
				title: "切为自由行动"
			}, " 取消心法 ")) : K("", !0)]),
			W("div", Wu, [W("textarea", {
				ref_key: "textareaRef",
				ref: i,
				class: "xy-action-textarea xy-custom-scroll",
				value: e.actionLabel,
				disabled: e.isBusy,
				rows: "2",
				placeholder: "凝神运功，详述主角心意、起手引弦与应对之势…… (按 Ctrl+Enter 快速提交)",
				onInput: n[10] ||= (e) => t.$emit("update:actionLabel", e.target.value),
				onKeydown: as(rs(o, ["ctrl"]), ["enter"])
			}, null, 40, Gu), n[21] ||= W("span", { class: "xy-textarea-deco" }, null, -1)]),
			W("button", {
				class: k(["xy-submit-btn", { "is-loading": e.isBusy }]),
				disabled: e.isBusy || e.phase !== "awaiting_player",
				onClick: o
			}, [
				n[22] ||= W("div", { class: "xy-submit-bg" }, null, -1),
				n[23] ||= W("div", { class: "xy-submit-ripple" }, null, -1),
				W("div", qu, [G(X, {
					name: e.isBusy ? "sparkles" : "send",
					class: "xy-submit-icon"
				}, null, 8, ["name"]), W("span", Ju, A(a.value), 1)])
			], 10, Ku)
		])], 2));
	}
}, [["__scopeId", "data-v-847a2743"]]), Xu = { class: "xy-timeline-drawer-panel" }, Zu = { class: "xy-drawer-header" }, Qu = { class: "xy-drawer-title" }, $u = { class: "xy-count-badge" }, ed = { class: "xy-drawer-body xy-custom-scroll" }, td = {
	key: 0,
	class: "xy-timeline-stream"
}, nd = { class: "xy-t-head" }, rd = { class: "xy-t-round" }, id = {
	key: 0,
	class: "xy-t-action-id"
}, ad = { class: "xy-t-label" }, od = { class: "xy-t-outcome" }, sd = {
	key: 0,
	class: "xy-t-narrative"
}, cd = {
	key: 1,
	class: "xy-t-narrative-empty"
}, ld = {
	key: 1,
	class: "xy-timeline-empty"
}, ud = {
	key: 2,
	class: "xy-public-events-section"
}, dd = { class: "xy-pe-title" }, fd = { class: "xy-pe-list" }, pd = /*#__PURE__*/ Y({
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
		return (n, r) => (H(), Yi(Ua, { name: "xy-drawer-slide" }, {
			default: Mn(() => [e.isOpen ? (H(), U("aside", {
				key: 0,
				class: "xy-timeline-drawer-backdrop",
				onClick: r[1] ||= rs((e) => n.$emit("close"), ["self"])
			}, [W("div", Xu, [W("div", Zu, [W("div", Qu, [
				r[2] ||= W("span", { class: "xy-d-icon" }, "⏳", -1),
				r[3] ||= W("span", null, "演武战史与天道批注", -1),
				W("span", $u, A(e.timeline.length), 1)
			]), W("button", {
				class: "xy-close-drawer-btn",
				onClick: r[0] ||= (e) => n.$emit("close"),
				"aria-label": "收起战史"
			}, "✕")]), W("div", ed, [e.timeline.length ? (H(), U("div", td, [(H(!0), U(B, null, R(e.timeline.slice().reverse(), (e) => (H(), U("article", {
				key: e.actionId || e.roundId,
				class: "xy-timeline-card"
			}, [
				W("div", nd, [
					W("span", rd, A(e.roundId), 1),
					W("span", { class: k(["xy-t-status", "st-" + e.status]) }, A(t(e.status)), 3),
					e.actionId ? (H(), U("span", id, "#" + A(e.actionId.slice(-6)), 1)) : K("", !0)
				]),
				W("h4", ad, "【行动】" + A(e.label), 1),
				W("div", od, [r[4] ||= W("b", null, "裁定结果：", -1), W("span", null, A(e.outcome || "天道判定无明文"), 1)]),
				e.narrative ? (H(), U("div", sd, [r[5] ||= W("b", null, "正文演化：", -1), W("p", null, A(e.narrative), 1)])) : (H(), U("div", cd, [...r[6] ||= [W("span", null, "裁定已确立；等待主剧情推进演化……", -1)]]))
			]))), 128))])) : (H(), U("div", ld, [...r[7] ||= [W("span", null, "战端初起，尚无回合记录。", -1)]])), e.publicEvents.length ? (H(), U("div", ud, [W("h5", dd, "可观测天地变数 (" + A(e.publicEvents.length) + ")", 1), W("ol", fd, [(H(!0), U(B, null, R(e.publicEvents.slice(-8), (e, t) => (H(), U("li", { key: t }, A(e), 1))), 128))])])) : K("", !0)])])])) : K("", !0)]),
			_: 1
		}));
	}
}, [["__scopeId", "data-v-3e5a6368"]]), Z = (e) => e === void 0 ? void 0 : JSON.parse(JSON.stringify(e));
function md(e) {
	return Array.isArray(e) ? `[${e.map(md).join(",")}]` : e && typeof e == "object" ? `{${Object.keys(e).sort().map((t) => `${JSON.stringify(t)}:${md(e[t])}`).join(",")}}` : JSON.stringify(e);
}
function hd(e) {
	if (e?.aborted) throw new DOMException("操作已停止或聊天作用域已变化", "AbortError");
}
function Q(e, t = []) {
	return typeof e == "string" ? t.filter(Boolean).reduce((e, t) => e.split(t).join("[REDACTED]"), e) : Array.isArray(e) ? e.map((e) => Q(e, t)) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).filter(([e]) => !/^(api[-_]?key|authorization|access[-_]?token|password|credential|secret)$/i.test(e)).map(([e, n]) => [e, Q(n, t)]));
}
function gd(e) {
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
var _d = /* @__PURE__ */ new Set([
	"hidden",
	"internal",
	"gm",
	"secret"
]), vd = [
	"techniques",
	"abilities",
	"skills",
	"spells",
	"术法",
	"功法",
	"招式"
];
function yd(e) {
	return typeof e == "string" ? e.trim() : e == null ? "" : String(e);
}
function bd(e) {
	return Array.isArray(e) ? e : e && typeof e == "object" ? Object.entries(e).map(([e, t]) => ({
		name: e,
		description: t
	})) : [];
}
function xd(e, t, n = "known") {
	if (typeof e == "string") return {
		id: `enemy-${e}`,
		name: e,
		description: "已从公开上下文识别名称；具体效果尚未公开。",
		status: n,
		source: t,
		visibility: "public"
	};
	if (!e || typeof e != "object") return null;
	let r = yd(e.visibility || e.exposure || "public").toLowerCase();
	if (_d.has(r)) return null;
	let i = yd(e.name || e.label || e.title || e.id);
	return i ? {
		id: yd(e.id || `enemy-${i}`),
		name: i,
		description: yd(e.description || e.originalDefinition || e.definition || e.summary || "已识别名称；完整效果尚未公开。"),
		mechanics: Array.isArray(e.mechanics) ? Z(e.mechanics) : [],
		status: yd(e.status || n) || n,
		source: t,
		visibility: "public",
		confidence: e.confidence ?? (n === "known" ? "high" : "medium")
	} : null;
}
function Sd(e = {}, t = {}) {
	let n = [], r = /* @__PURE__ */ new Set(), i = (e, t, i) => {
		let a = xd(e, t, i);
		a && !r.has(a.id) && (r.add(a.id), n.push(a));
	};
	for (let t of vd) {
		let n = e[t] ?? e.visibleInfo?.[t], r = e.visibleInfo && Object.hasOwn(e.visibleInfo, t);
		for (let e of bd(n)) (t !== "techniques" || r || !e || typeof e != "object" || e.exposed === !0 || ["public", "player"].includes(yd(e.visibility).toLowerCase())) && i(e, `敌方公开资料 · ${t}`, e?.status || (t === "techniques" ? "known" : "inferred"));
	}
	let a = e.visibleInfo?.observedTechniques || e.visibleInfo?.observedAbilities || e.visibleInfo?.可观察招式;
	for (let e of bd(a)) i(e, "本轮公开观察", "inferred");
	if (n.length) return n;
	let o = t.scene?.publicEvents || [], s = yd(e.name);
	for (let e of o) {
		let t = yd(e);
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
function Cd(e) {
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
		label: yd(e?.label || e?.id || "未命名效果")
	};
}
function wd(e = []) {
	let t = {
		player: [],
		enemy: [],
		field: []
	};
	for (let n of e) t[Cd(n).lane].push(Cd(n));
	return t;
}
//#endregion
//#region src/ui/components/BattleStage.vue
var Td = { class: "xy-battle-stage" }, Ed = { class: "xy-stage-arena" }, Dd = { class: "xy-arena-columns" }, Od = /*#__PURE__*/ Y({
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
		let n = e, r = /* @__PURE__ */ Jt(""), i = /* @__PURE__ */ Jt(""), a = /* @__PURE__ */ Jt(""), o = /* @__PURE__ */ Jt("player"), s = /* @__PURE__ */ Jt(""), c = /* @__PURE__ */ Jt(!1), l = /* @__PURE__ */ Jt(!1), u = J(() => [
			"judging",
			"narrating",
			"rewrite"
		].includes(n.view.phase)), d = J(() => n.view.player || {}), f = J(() => n.view.semanticState || {}), p = J(() => f.value.effects || []), m = J(() => wd(p.value)), h = J(() => m.value.player || []), g = J(() => m.value.enemy || []), _ = J(() => n.state.actors?.enemies || n.view.enemies || []), v = J(() => {
			if (!_.value.length) return null;
			if (s.value) {
				let e = _.value.find((e) => e.id === s.value);
				if (e) return e;
			}
			return _.value[0];
		});
		Rn(v, (e) => {
			e && !s.value && (s.value = e.id);
		}, { immediate: !0 });
		function y(e) {
			s.value = e;
		}
		let b = J(() => {
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
		}), x = J(() => v.value ? Sd(v.value, n.state) : []), S = J(() => b.value.map((e) => ({
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
		function ee(e) {
			i.value = e, a.value = "", o.value = "player", l.value = !1;
		}
		function te(e) {
			i.value = e, e ? (a.value = e, o.value = "player") : a.value = "";
		}
		function ne(e) {
			i.value = e, a.value = e, o.value = "player";
		}
		let T = J(() => a.value ? o.value === "player" ? b.value.find((e) => e.id === a.value) || null : x.value.find((e) => e.id === a.value) || null : null), re = J(() => o.value === "player" ? T.value?.entry?.name || "叠浪玄潮决" : v.value?.name || "对手功法"), E = J(() => T.value?.status || {
			available: !0,
			reason: ""
		}), ie = J(() => (n.state.history || []).filter((e) => ["committed", "complete"].includes(e.status)).at(-1) || null), ae = J(() => !!n.controller?.bridgeQueuedAction), D = J(() => n.controller?.state?.hostSync?.status === "pending");
		return (t, n) => (H(), U("div", Td, [
			G(Js),
			W("div", Ed, [W("div", Dd, [
				G(sl, {
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
				G(au, {
					round: e.view.round || 0,
					phase: e.view.phase || "idle",
					"semantic-state": f.value,
					"all-effects": p.value,
					player: d.value,
					"current-enemy": v.value,
					"latest-record": ie.value,
					"selected-term-data": null,
					"selected-term-side": o.value,
					"selected-term-parent-name": re.value,
					"selected-term-availability": E.value,
					onClearTerm: n[0] ||= (e) => a.value = "",
					onApplyTechnique: ne,
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
				G(sl, {
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
			G(Yu, {
				phase: e.view.phase,
				"is-busy": u.value,
				"action-label": r.value,
				"selected-technique-id": i.value,
				"technique-options": S.value,
				"latest-committed": ie.value,
				"has-bridge-queued": ae.value,
				"host-sync-pending": D.value,
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
				"onUpdate:techniqueId": te
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
			G(ju, {
				"is-open": l.value,
				"term-data": T.value,
				"is-player": o.value === "player",
				"parent-name": re.value,
				"availability-status": E.value,
				onClose: w,
				onApply: ee
			}, null, 8, [
				"is-open",
				"term-data",
				"is-player",
				"parent-name",
				"availability-status"
			]),
			G(pd, {
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
}, [["__scopeId", "data-v-b29b2b87"]]), kd = { class: "xy-settings-panel xy-custom-scroll" }, Ad = { class: "xy-config-card" }, jd = { class: "xy-form-grid" }, Md = { class: "xy-form-field" }, Nd = { class: "xy-form-field" }, Pd = { class: "xy-form-field xy-col-span-2" }, Fd = { class: "xy-form-field xy-col-span-2" }, Id = { class: "xy-password-wrap" }, Ld = ["type"], Rd = { class: "xy-form-field" }, zd = { class: "xy-form-field" }, Bd = { class: "xy-form-field" }, Vd = { class: "xy-form-field" }, Hd = { class: "xy-config-card" }, Ud = { class: "xy-form-grid" }, Wd = { class: "xy-form-field" }, Gd = { class: "xy-form-field" }, Kd = { class: "xy-form-field xy-col-span-2" }, qd = { class: "xy-form-field xy-col-span-2" }, Jd = { class: "xy-password-wrap" }, Yd = ["type"], Xd = { class: "xy-form-field" }, Zd = { class: "xy-form-field" }, Qd = { class: "xy-config-card" }, $d = { class: "xy-toggle-row" }, ef = { class: "xy-checkbox-label" }, tf = { class: "xy-form-field xy-mt-3" }, nf = { class: "xy-settings-footer" }, rf = /*#__PURE__*/ Y({
	__name: "SettingsPanel",
	props: { settings: {
		type: Object,
		default: () => ({})
	} },
	emits: ["save", "back"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ Jt(!1), a = /* @__PURE__ */ Jt(!1), o = /* @__PURE__ */ Lt({
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
		Rn(() => n.settings, (e) => {
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
		return (e, t) => (H(), U("div", kd, [
			t[42] ||= W("div", { class: "xy-panel-header" }, [W("div", null, [W("span", { class: "xy-panel-kicker" }, "INDEPENDENT ADAPTER CONFIGURATION"), W("h2", { class: "xy-panel-title" }, "独立机枢 · 模型与演算法")]), W("p", { class: "xy-panel-desc" }, " 裁定 AI 与正文生成可分别调配独立接入点与参数；敏感秘钥仅驻留内存，绝不落盘或混入战报存档。 ")], -1),
			W("fieldset", Ad, [t[28] ||= W("legend", { class: "xy-card-legend" }, [W("span", { class: "xy-legend-icon" }, "⚖"), W("span", null, "战斗裁定 AI (Adjudicator)")], -1), W("div", jd, [
				W("label", Md, [t[20] ||= W("span", { class: "xy-field-label" }, "推理模式", -1), L(W("select", {
					"onUpdate:modelValue": t[0] ||= (e) => o.judge.mode = e,
					class: "xy-input-select"
				}, [...t[19] ||= [
					W("option", { value: "unconfigured" }, "未配置 (拒绝请求，安全保护)", -1),
					W("option", { value: "mock" }, "离线 Mock 演示 (免 API Key 极速验算)", -1),
					W("option", { value: "http" }, "真实 OpenAI-Compatible 接口", -1)
				]], 512), [[qo, o.judge.mode]])]),
				W("label", Nd, [t[21] ||= W("span", { class: "xy-field-label" }, "模型标识 (Model)", -1), L(W("input", {
					"onUpdate:modelValue": t[1] ||= (e) => o.judge.model = e,
					placeholder: "例如: gpt-4o, claude-3-5-sonnet...",
					class: "xy-input-text"
				}, null, 512), [[Uo, o.judge.model]])]),
				W("label", Pd, [t[22] ||= W("span", { class: "xy-field-label" }, "服务接入点 (Endpoint)", -1), L(W("input", {
					"onUpdate:modelValue": t[2] ||= (e) => o.judge.endpoint = e,
					placeholder: "https://api.openai.com/v1/chat/completions",
					class: "xy-input-text"
				}, null, 512), [[Uo, o.judge.endpoint]])]),
				W("label", Fd, [t[23] ||= W("span", { class: "xy-field-label" }, [W("span", null, "API Key (仅驻留内存)"), W("small", { class: "xy-field-hint" }, "刷新页面需重填，绝不进入持久化文件")], -1), W("div", Id, [L(W("input", {
					"onUpdate:modelValue": t[3] ||= (e) => o.judge.apiKey = e,
					type: i.value ? "text" : "password",
					placeholder: "sk-...",
					autocomplete: "off",
					class: "xy-input-text"
				}, null, 8, Ld), [[Qo, o.judge.apiKey]]), W("button", {
					type: "button",
					class: "xy-pwd-toggle",
					onClick: t[4] ||= (e) => i.value = !i.value
				}, [G(X, { name: i.value ? "eye-off" : "eye" }, null, 8, ["name"])])])]),
				W("label", Rd, [t[24] ||= W("span", { class: "xy-field-label" }, "最大输出 (Max Tokens)", -1), L(W("input", {
					"onUpdate:modelValue": t[5] ||= (e) => o.judge.maxOutput = e,
					type: "number",
					min: "10",
					class: "xy-input-text"
				}, null, 512), [[
					Uo,
					o.judge.maxOutput,
					void 0,
					{ number: !0 }
				]])]),
				W("label", zd, [t[25] ||= W("span", { class: "xy-field-label" }, "发散温度 (Temperature)", -1), L(W("input", {
					"onUpdate:modelValue": t[6] ||= (e) => o.judge.temperature = e,
					type: "number",
					min: "0",
					max: "2",
					step: "0.1",
					class: "xy-input-text"
				}, null, 512), [[
					Uo,
					o.judge.temperature,
					void 0,
					{ number: !0 }
				]])]),
				W("label", Bd, [t[26] ||= W("span", { class: "xy-field-label" }, "结构容错修复次数", -1), L(W("input", {
					"onUpdate:modelValue": t[7] ||= (e) => o.judge.repairAttempts = e,
					type: "number",
					min: "0",
					max: "3",
					class: "xy-input-text"
				}, null, 512), [[
					Uo,
					o.judge.repairAttempts,
					void 0,
					{ number: !0 }
				]])]),
				W("label", Vd, [t[27] ||= W("span", { class: "xy-field-label" }, "请求超时 (毫秒)", -1), L(W("input", {
					"onUpdate:modelValue": t[8] ||= (e) => o.judge.timeoutMs = e,
					type: "number",
					min: "1000",
					step: "1000",
					class: "xy-input-text"
				}, null, 512), [[
					Uo,
					o.judge.timeoutMs,
					void 0,
					{ number: !0 }
				]])])
			])]),
			W("fieldset", Hd, [t[36] ||= W("legend", { class: "xy-card-legend" }, [W("span", { class: "xy-legend-icon" }, "📜"), W("span", null, "正文演化与主剧情桥接 (Narrator)")], -1), W("div", Ud, [
				W("label", Wd, [t[30] ||= W("span", { class: "xy-field-label" }, "桥接模式", -1), L(W("select", {
					"onUpdate:modelValue": t[9] ||= (e) => o.narrator.mode = e,
					class: "xy-input-select"
				}, [...t[29] ||= [ia("<option value=\"main_story\" data-v-b8b80bd6>酒馆主剧情注入 (推荐，沿用酒馆设定)</option><option value=\"packet\" data-v-b8b80bd6>仅生成场景包 (供剪贴板与第三方调用)</option><option value=\"http\" data-v-b8b80bd6>独立 OpenAI-Compatible 正文模型</option><option value=\"mock\" data-v-b8b80bd6>离线 Mock 演进</option><option value=\"unconfigured\" data-v-b8b80bd6>未配置</option>", 5)]], 512), [[qo, o.narrator.mode]])]),
				W("label", Gd, [t[31] ||= W("span", { class: "xy-field-label" }, "模型标识 (Model)", -1), L(W("input", {
					"onUpdate:modelValue": t[10] ||= (e) => o.narrator.model = e,
					placeholder: "正文生成模型名...",
					class: "xy-input-text"
				}, null, 512), [[Uo, o.narrator.model]])]),
				W("label", Kd, [t[32] ||= W("span", { class: "xy-field-label" }, "独立接入点 (Endpoint)", -1), L(W("input", {
					"onUpdate:modelValue": t[11] ||= (e) => o.narrator.endpoint = e,
					placeholder: "https://...",
					class: "xy-input-text"
				}, null, 512), [[Uo, o.narrator.endpoint]])]),
				W("label", qd, [t[33] ||= W("span", { class: "xy-field-label" }, "API Key (仅驻留内存)", -1), W("div", Jd, [L(W("input", {
					"onUpdate:modelValue": t[12] ||= (e) => o.narrator.apiKey = e,
					type: a.value ? "text" : "password",
					placeholder: "sk-...",
					autocomplete: "off",
					class: "xy-input-text"
				}, null, 8, Yd), [[Qo, o.narrator.apiKey]]), W("button", {
					type: "button",
					class: "xy-pwd-toggle",
					onClick: t[13] ||= (e) => a.value = !a.value
				}, [G(X, { name: a.value ? "eye-off" : "eye" }, null, 8, ["name"])])])]),
				W("label", Xd, [t[34] ||= W("span", { class: "xy-field-label" }, "最大输出 (Max Tokens)", -1), L(W("input", {
					"onUpdate:modelValue": t[14] ||= (e) => o.narrator.maxOutput = e,
					type: "number",
					min: "50",
					class: "xy-input-text"
				}, null, 512), [[
					Uo,
					o.narrator.maxOutput,
					void 0,
					{ number: !0 }
				]])]),
				W("label", Zd, [t[35] ||= W("span", { class: "xy-field-label" }, "发散温度 (Temperature)", -1), L(W("input", {
					"onUpdate:modelValue": t[15] ||= (e) => o.narrator.temperature = e,
					type: "number",
					min: "0",
					max: "2",
					step: "0.1",
					class: "xy-input-text"
				}, null, 512), [[
					Uo,
					o.narrator.temperature,
					void 0,
					{ number: !0 }
				]])])
			])]),
			W("div", Qd, [
				t[39] ||= W("h3", { class: "xy-card-title" }, "宿主桥接与输入契约", -1),
				W("div", $d, [W("label", ef, [L(W("input", {
					type: "checkbox",
					"onUpdate:modelValue": t[16] ||= (e) => o.autoNarrative = e,
					class: "xy-checkbox"
				}, null, 512), [[Wo, o.autoNarrative]]), t[37] ||= W("span", null, "裁定提交后，自动备好正文场景包向宿主注入", -1)])]),
				W("label", tf, [t[38] ||= W("span", { class: "xy-field-label" }, "独立 HTTP 模式下的原始 Prompt（主剧情模式自动保留宿主日常输入）", -1), L(W("textarea", {
					"onUpdate:modelValue": t[17] ||= (e) => o.originalPrompt = e,
					rows: "2",
					class: "xy-input-textarea",
					placeholder: "我抬起弦弓，观察水面与对手的节奏。"
				}, null, 512), [[Uo, o.originalPrompt]])])
			]),
			W("div", nf, [W("button", {
				class: "xy-save-btn",
				onClick: s
			}, [G(X, { name: "check" }), t[40] ||= W("span", null, "保存机枢设定", -1)]), W("button", {
				class: "xy-back-btn",
				onClick: t[18] ||= (t) => e.$emit("back")
			}, [...t[41] ||= [W("span", null, "返回战场", -1)]])])
		]));
	}
}, [["__scopeId", "data-v-b8b80bd6"]]), af = { class: "xy-data-panel xy-custom-scroll" }, of = { class: "xy-quick-actions-bar" }, sf = { class: "xy-import-console" }, cf = { class: "xy-console-header" }, lf = { class: "xy-file-upload-btn" }, uf = { class: "xy-import-btns" }, df = ["disabled"], ff = ["disabled"], pf = ["disabled"], mf = { class: "xy-snapshot-details" }, hf = { class: "xy-snapshot-pre xy-custom-scroll" }, gf = /*#__PURE__*/ Y({
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
		let n = e, r = /* @__PURE__ */ Jt(""), i = J(() => JSON.stringify(n.snapshot, null, 2));
		async function a(e) {
			let t = e.target.files?.[0];
			t && (r.value = await t.text());
		}
		return (e, t) => (H(), U("div", af, [
			t[16] ||= W("div", { class: "xy-panel-header" }, [W("div", null, [W("span", { class: "xy-panel-kicker" }, "SCENE & PRESET MANAGEMENT"), W("h2", { class: "xy-panel-title" }, "演武经卷 · 场景与道藏存档")]), W("p", { class: "xy-panel-desc" }, " 可导入特定世界观战场、角色卡快照与功法 Registry；支持当前分支存档无损导入导出。 ")], -1),
			W("div", of, [
				W("button", {
					class: "xy-action-btn btn-demo",
					onClick: t[0] ||= (t) => e.$emit("load-demo")
				}, [G(X, { name: "sparkles" }), t[7] ||= W("span", null, "载入《叠浪玄潮决》演示场景", -1)]),
				W("button", {
					class: "xy-action-btn",
					onClick: t[1] ||= (t) => e.$emit("export-full")
				}, [G(X, { name: "copy" }), t[8] ||= W("span", null, "导出完整战局存档 (JSON)", -1)]),
				W("button", {
					class: "xy-action-btn",
					onClick: t[2] ||= (t) => e.$emit("export-public")
				}, [G(X, { name: "scroll" }), t[9] ||= W("span", null, "导出公开战报摘要", -1)])
			]),
			W("div", sf, [
				W("div", cf, [t[11] ||= W("span", { class: "xy-console-title" }, "经卷解析与录入 (JSON)", -1), W("label", lf, [t[10] ||= W("span", null, "选择本地 JSON 文件", -1), W("input", {
					type: "file",
					accept: "application/json,.json",
					onChange: a,
					class: "xy-hidden-input"
				}, null, 32)])]),
				L(W("textarea", {
					"onUpdate:modelValue": t[3] ||= (e) => r.value = e,
					class: "xy-json-textarea xy-custom-scroll",
					rows: "10",
					placeholder: "粘贴 battle_v2_scene、battle_v2_export 或 registry JSON 文本……"
				}, null, 512), [[Uo, r.value]]),
				W("div", uf, [
					W("button", {
						class: "xy-imp-btn",
						disabled: !r.value.trim(),
						onClick: t[4] ||= (t) => e.$emit("import-scene", r.value)
					}, [...t[12] ||= [W("span", null, "导入为新场景", -1)]], 8, df),
					W("button", {
						class: "xy-imp-btn",
						disabled: !r.value.trim(),
						onClick: t[5] ||= (t) => e.$emit("import-registry", r.value)
					}, [...t[13] ||= [W("span", null, "导入功法 Registry", -1)]], 8, ff),
					W("button", {
						class: "xy-imp-btn btn-danger",
						disabled: !r.value.trim(),
						onClick: t[6] ||= (t) => e.$emit("import-save", r.value)
					}, [...t[14] ||= [W("span", null, "恢复分支存档", -1)]], 8, pf)
				])
			]),
			W("details", mf, [t[15] ||= W("summary", { class: "xy-snapshot-summary" }, [W("span", null, "当前环境与角色快照 (包含内部状态与裁定器上下文)")], -1), W("pre", hf, A(i.value), 1)])
		]));
	}
}, [["__scopeId", "data-v-8887c668"]]), _f = { class: "xy-dev-panel xy-custom-scroll" }, vf = { class: "xy-dev-actions" }, yf = {
	class: "xy-log-section",
	open: ""
}, bf = { class: "xy-log-pre xy-custom-scroll" }, xf = { class: "xy-log-list-container" }, Sf = { class: "xy-list-title" }, Cf = {
	key: 0,
	class: "xy-log-items"
}, wf = { class: "xy-item-summary" }, Tf = {
	key: 0,
	class: "xy-item-action"
}, Ef = { class: "xy-item-time" }, Df = { class: "xy-item-pre xy-custom-scroll" }, Of = {
	key: 1,
	class: "xy-empty-logs"
}, kf = /*#__PURE__*/ Y({
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
		let t = e, n = J(() => JSON.stringify(t.aiContext, null, 2)), r = J(() => t.logs.slice().reverse());
		function i(e) {
			return JSON.stringify(e, null, 2);
		}
		return (t, a) => (H(), U("div", _f, [
			a[8] ||= W("div", { class: "xy-panel-header" }, [W("div", null, [W("span", { class: "xy-panel-kicker" }, "TIANDAO AUDIT & MODEL PROMPTS"), W("h2", { class: "xy-panel-title" }, "天道秘录 · 裁定审计与日志")]), W("p", { class: "xy-panel-desc" }, " 完整记录裁定模型接收的结构化上下文、原始输入输出、规则校验及宿主契约收据。敏感凭据已自动脱敏。 ")], -1),
			W("div", vf, [
				W("button", {
					class: "xy-dev-btn",
					onClick: a[0] ||= (e) => t.$emit("copy-debug")
				}, [G(X, { name: "copy" }), a[3] ||= W("span", null, "复制完整开发审计 JSON", -1)]),
				W("button", {
					class: "xy-dev-btn",
					onClick: a[1] ||= (e) => t.$emit("export-debug")
				}, [G(X, { name: "scroll" }), a[4] ||= W("span", null, "导出开发审计文件 (JSON)", -1)]),
				W("button", {
					class: "xy-dev-btn",
					onClick: a[2] ||= (e) => t.$emit("export-public")
				}, [G(X, { name: "eye" }), a[5] ||= W("span", null, "导出公开脱敏战报", -1)])
			]),
			W("details", yf, [a[6] ||= W("summary", { class: "xy-sec-summary" }, [W("span", { class: "xy-sec-tag" }, "AI READ CONTEXT"), W("span", null, "当前裁定器实际读取的完整结构化上下文 (含敌方 Hidden 信息)")], -1), W("pre", bf, A(n.value), 1)]),
			W("div", xf, [W("h3", Sf, "模型与程序事件流水 (" + A(e.logs.length) + ")", 1), e.logs.length ? (H(), U("div", Cf, [(H(!0), U(B, null, R(r.value, (e, t) => (H(), U("details", {
				key: t,
				class: "xy-log-detail-item"
			}, [W("summary", wf, [
				W("span", { class: k(["xy-item-kind", "kind-" + e.kind]) }, A(e.kind), 3),
				e.actionId ? (H(), U("span", Tf, "#" + A(e.actionId.slice(-6)), 1)) : K("", !0),
				W("span", Ef, A(e.at), 1)
			]), W("pre", Df, A(i(e)), 1)]))), 128))])) : (H(), U("div", Of, [...a[7] ||= [W("span", null, "尚无调用日志。进行裁定、正文生成或宿主同步后将自动记述于此。", -1)]]))])
		]));
	}
}, [["__scopeId", "data-v-78f0b392"]]);
//#endregion
//#region src/utils.js
function Af(e, t) {
	if (typeof document > "u") return !1;
	let n = new Blob([t], { type: "application/json;charset=utf-8" }), r = URL.createObjectURL(n), i = document.createElement("a");
	return i.href = r, i.download = e, i.click(), setTimeout(() => URL.revokeObjectURL(r), 0), !0;
}
var jf = {
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
}, Mf = [
	"mechanics",
	"techniques",
	"synergies",
	"narrativeGuidance",
	"ruleRefs"
], Nf = /* @__PURE__ */ new Set([
	"public",
	"player",
	"gm",
	"internal"
]);
function Pf(e, t) {
	if (typeof e != "string" || !e.trim()) throw Error(`${t} 必须是非空文字`);
}
function Ff(e) {
	let t = [
		"id",
		"name",
		"rank",
		"element",
		"corePrinciple",
		...Mf,
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
	]) Pf(e[t], t);
	if (!Nf.has(e.visibility)) throw Error("visibility 无效");
	for (let t of Mf) if (!Array.isArray(e[t])) throw Error(`${t} 必须是数组`);
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
		]) Pf(t[e], e);
		if (n.has(t.id)) throw Error(`词条 id 重复：${t.id}`);
		if (n.add(t.id), !Array.isArray(t.mechanics) || !Array.isArray(t.triggeredState) || !Array.isArray(t.ruleRefs) || !t.ruleRefs.length || !Nf.has(t.visibility)) throw Error(`词条 ${t.id} 结构无效`);
		if (![
			"available",
			"conditional",
			"unavailable"
		].includes(t.availability?.default) || !Array.isArray(t.availability.conditions)) throw Error(`词条 ${t.id} 可用性定义无效`);
	}
	if (!e.ruleRefs.length || e.ruleRefs.some((e) => typeof e != "string" || !e.trim())) throw Error("ruleRefs 不得为空");
	return !0;
}
function If(e, t) {
	return String(t).split(".").reduce((e, t) => e?.[t], e);
}
function Lf(e, t) {
	let n = If(e, t.path);
	return t.op === "includes" ? Array.isArray(n) && n.includes(t.value) : t.op === "truthy" ? !!n : t.op === "equals" ? n === t.value : t.op === "not" && n !== t.value;
}
var Rf = class {
	constructor(e = [jf]) {
		this.entries = /* @__PURE__ */ new Map(), e.forEach((e) => this.register(e));
	}
	register(e) {
		if (Ff(e), this.entries.has(e.id)) throw Error(`功法已存在：${e.id}`);
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
		let i = r.availability.requires || [], a = r.availability.default !== "unavailable" && (i.length ? i.every((e) => Lf(n, e)) : r.availability.default === "available"), o = (n.statuses || []).some((e) => e === `${t}:triggered`) || (n.effects || []).some((e) => typeof e == "string" ? e.startsWith(`${t}`) : e.techniqueId === t);
		return {
			available: a,
			state: a ? "available" : "conditional",
			reason: r.availability.conditions.join("；"),
			triggered: o
		};
	}
}, zf = "你是修仙战斗系统专属的【天道推演玄枢 · 独立功法战斗裁定核心】（Heavenly Combat Adjudicator）。\n你的唯一职责是：纯粹、严密、客观地对本轮攻防交锋进行功法机理推演与规则裁定。\n你完全独立于宿主聊天主预设、角色卡背景和世俗剧情，禁止进行小说文学创作，禁止输出剧情正文，只返回符合天道规范的结构化裁定数据 JSON。\n\n【核心裁定职责与分析原则】\n1. 功法招式机理推演（Technique Mechanics）：\n   - 深入分析主角所施展招式的起手运劲、真元流转、引动法则（如音波织网、叠浪贯通、潮汐共鸣）与出招心念意图。\n   - 深入分析敌方当前姿态、防御手段、已知功法与境界压制（如重剑开合、体魄罡气、真元厚度）。\n   - 内部因果考量（含暗藏私密底牌）：你拥有探知敌方隐藏底牌、暗疾与暗中算计（hidden）的天道神念。必须依据敌我真实情况裁定深层因果，但【严禁】在面向玩家公开的 summary 和 publicEvents 中明文泄露尚未暴露的隐藏底牌！\n\n2. 给出对敌人的实质影响（Target Impact）：\n   - 严谨判定招式对敌手造成的物理与灵力效果：\n     * 受制部位（如双足被水网缠裹、重剑挥击受阻、重心失衡向前倾跌）；\n     * 灵力与经脉反应（如真元运行滞涩、护体罡罩受震碎裂、逆流反噬）；\n     * 战术姿态改变（如硬直后退、招架露出破绽、狂攻冲锋被迫中断）；\n     * 资源损耗（若规则定义了气血/真元/架势消耗）。\n\n3. 给出对战场环境的天地剧变（Environmental Impact）：\n   - 严谨判定打斗对周围天地气象、灵气分布与地形造成的剧烈冲击：\n     * 地形形貌破坏（如青玄石板碎裂飞溅、深坑沟壑、碎石四溅）；\n     * 灵气与气象变化（如水汽撕裂凝聚成网、狂暴重浪屏风横推、煞气黑烟被冲散或压缩、狂风呼啸）；\n     * 天地灵压与声学变化（如音波炸裂、龙吟长啸、水平如镜被打破）。\n\n4. 确立战局走向与确凿事实（Committed Facts）：\n   - 判定节奏归属（谁取得节奏、谁被压制、站位变动）；\n   - 更新持续语义效果（如生效余势剩余回合、新激活状态）；\n   - 输出明确的公开事实列表（publicEvents），将对敌效果与对环境效果封装确立；\n   - 本裁定一经落定即为天道定数，后续正文 AI 必须严格遵守，禁止复判或推翻。\n\n【严格输出格式（JSON）】\n只返回合法 JSON 对象，严禁包裹任何 markdown 解释，结构如下：\n{\n  \"summary\": \"简练概括本轮核心攻防战况与裁定结果（包含对敌与对环境的核心定论）\",\n  \"before\": { /* 完整的原 semanticState 对象，必须原样保持 */ },\n  \"after\": {\n    /* 更新后的完整 semanticState 对象，保留原有所有字段，更新 statuses, effects, 站位, 压制, 破绽等 */\n  },\n  \"reason\": \"天道裁定因果推演阐述（阐述功法机理如何克制或受挫，可引用内部因果与敌我暗藏底牌）\",\n  \"ruleRefs\": [ \"引用的权威功法规则或词条ID，如 gongfa.dielang-xuanchaojue.xianshi\" ],\n  \"publicEvents\": [\n    \"【对敌影响】具体受制部位、姿态破坏与灵力震荡事实（无剧透）\",\n    \"【环境剧变】具体地形破坏与天地气象冲击事实\",\n    \"【局势转移】站位距离与攻守节奏归属事实\"\n  ],\n  \"confidence\": 0.95,\n  \"resourceChanges\": [\n    /* 可选资源变动：[{ \"actorId\": \"player\", \"resource\": \"qi\", \"before\": 120, \"after\": 105, \"reason\": \"消耗真元\", \"ruleRefs\": [...] }] */\n  ]\n}";
function Bf(e, t) {
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
		"",
		"【3. 敌方修者面板】",
		...r.map((e, t) => [
			`[敌手 ${t + 1}]：${e.name || "对手"} (#${e.id || "enemy"})`,
			`- 公开情报与境界：${JSON.stringify(e.visibleInfo || {})}`,
			`- 气海机枢：${JSON.stringify(e.resources || {})}`,
			`- 已知招式：${JSON.stringify(e.observedTechniques || [])}`,
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
		"【6. 权威功法注册表与可用规则库】",
		JSON.stringify(e.registry || {}, null, 2),
		"",
		"【7. 裁定要求】",
		"1. 依据【主角招式机理】与【敌方功法防备】，深度推演功法碰撞与生克因果。",
		"2. 明确给出【对敌人的实质影响】（受制、破防、身法脱节、经脉反噬、破绽）。",
		"3. 明确给出【对战场环境的天地剧变】（地形破坏、水汽激荡、灵气屏风、气象冲击）。",
		"4. 确立节奏转移并更新 semanticState（before 必须原样一致，after 必须为完整更新对象）。",
		"5. 输出标准 JSON，字段包含 summary, before, after, reason, ruleRefs, publicEvents, confidence。"
	].join("\n");
}
function Vf(e, t = "") {
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
//#region src/battle-state.js
var Hf = Object.freeze([
	"idle",
	"active",
	"awaiting_player",
	"judging",
	"committed",
	"narrating",
	"awaiting_next",
	"ended",
	"rewrite"
]), Uf = [
	"statuses",
	"effects",
	"positions",
	"control"
];
function Wf({ sessionId: e = `battle-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, chatId: t = "default-chat", branchId: n = "main", location: r = "未设定地点", time: i = "未设定时间", player: a, enemies: o = [], registrySnapshot: s = [], semanticState: c, resourceRules: l = [], scene: u = {} } = {}) {
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
function Gf(e, t, n = {}) {
	return {
		...e,
		...n,
		phase: t,
		version: e.version + 1,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function Kf(e, t) {
	if (!t.includes(e.phase)) throw Error(`当前状态 ${e.phase} 不允许此操作，需要 ${t.join("/")}`);
}
function qf(e) {
	return Kf(e, ["idle", "ended"]), Gf(e, "awaiting_player", {
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
function Jf(e, t = "用户停止") {
	return Gf(e, "ended", { lastError: t });
}
function Yf(e) {
	if (!e || e.schema !== "battle_v2" || !Hf.includes(e.phase) || !e.scope || !e.actors || !e.semanticState || !Array.isArray(e.history) || !Array.isArray(e.registrySnapshot)) throw Error("无法恢复：不是有效 battle_v2 会话");
	let t = Z(e);
	if (new Rf(t.registrySnapshot), t.resourceRules ||= [], [
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
function Xf(e = []) {
	return e.flatMap((e) => typeof e == "string" || !Number.isInteger(e.remainingRounds) ? [e] : e.remainingRounds > 1 ? [{
		...e,
		remainingRounds: e.remainingRounds - 1
	}] : []);
}
function Zf(e) {
	Kf(e, ["awaiting_next", "committed"]);
	let t = {
		...e.semanticState,
		effects: Xf(e.semanticState.effects)
	};
	return qf({
		...e,
		phase: "ended",
		semanticState: t
	});
}
function Qf(e) {
	return {
		...Z(e),
		effects: (e.effects || []).filter((e) => typeof e == "string" || [
			"public",
			"player",
			void 0
		].includes(e.visibility))
	};
}
function $f(e) {
	return {
		schema: e.schema,
		version: e.version,
		scope: Z(e.scope),
		phase: e.phase,
		round: e.round,
		roundId: e.roundId,
		scene: Z(e.scene),
		semanticState: Qf(e.semanticState),
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
function ep(e) {
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
function tp(e, t, n = {}) {
	if (Kf(e, ["awaiting_player"]), !t || typeof t.label != "string" || !t.label.trim()) throw Error("行动需要非空 label");
	let r = ep(e);
	if (t.techniqueId) {
		let n = new Rf(e.registrySnapshot), r = n.findTechnique(t.techniqueId);
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
		playerVisibleContext: $f(e),
		systemPrompt: zf,
		prompt: Bf(r, t)
	};
}
function np(e) {
	return !e || typeof e != "object" ? typeof e == "string" && e.length > 3 ? [e] : [] : Object.values(e).flatMap(np);
}
function rp(e, t, { allowMock: n = !1 } = {}) {
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
	if (md(e.before) !== md(t.semanticState)) throw Error("裁定 before 与当前状态不一致");
	if (!e.after || Array.isArray(e.after) || typeof e.after != "object") throw Error("after 必须是完整对象");
	let r = Object.keys(t.semanticState);
	for (let t of r) if (!(t in e.after)) throw Error(`after 缺少 ${t}`);
	let i = /* @__PURE__ */ new Set([...Uf, ...r]);
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
		after: Qf(e.after)
	});
	for (let e of t.actors.enemies.flatMap((e) => np(e.hidden))) if (c.includes(e)) throw Error("裁定公开结果包含敌方隐藏信息，拒绝发布");
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
function ip(e, t, n) {
	let r = {
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
		playerVisibleContext: $f(e),
		originalAction: Z(n.action)
	};
	return r.storyAiDirective = Vf(r), r;
}
function ap(e) {
	return typeof e == "string" ? { text: e } : {
		text: String(e?.text || ""),
		pending: e?.pending === !0,
		metadata: Z(e?.metadata || {})
	};
}
async function op(e, t, { adjudicator: n, narrator: r, settings: i = {}, signal: a, save: o = () => {}, logger: s = () => {}, onCommit: c = () => {} } = {}) {
	let l = t?.actionId ? e.history.find((e) => e.actionId === t.actionId) : null;
	if (l) return {
		state: e,
		record: Z(l),
		deduplicated: !0
	};
	let u = tp(e, t, i), d = n?.isMock === !0 || (i.adjudicator?.mode || i.mode) === "mock", f = {
		actionId: u.actionId,
		roundId: u.roundId,
		action: Z(u.action),
		status: "prepared",
		version: e.version,
		before: Z(e.semanticState)
	}, p = Gf(e, "judging", {
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
			}), hd(a), s({
				kind: "ai_raw_response",
				actionId: u.actionId,
				rawResponse: Z(m),
				repairAttempt: t
			}), h = rp(m, e, { allowMock: d }), s({
				kind: "program_validation",
				actionId: u.actionId,
				validation: {
					valid: !0,
					repairAttempt: t
				}
			});
			break;
		} catch (e) {
			if (hd(a), s({
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
		throw p = Gf(p, "awaiting_player", {
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
	p = Gf(p, "committed", {
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
	v.narrativePacket = ip(p, v, u), p = {
		...p,
		history: p.history.map((e) => e.actionId === v.actionId ? v : e)
	}, hd(a), await o(p), s({
		kind: "commit",
		actionId: v.actionId,
		playerVisible: $f(p),
		record: Z(v),
		internal: {
			programValidation: { valid: !0 },
			aiRawResponse: Z(m)
		}
	});
	let y = await c(Z(v), p);
	if (hd(a), y?.allowed === !1) return p = Gf(p, "awaiting_next", {
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
	if (i.autoNarrative === !1) return p = Gf(p, "awaiting_next"), await o(p), s({
		kind: "narrative_packet",
		actionId: v.actionId,
		packet: v.narrativePacket
	}), {
		state: p,
		record: Z(v),
		request: u,
		deduplicated: !1
	};
	p = Gf(p, "narrating", { pending: {
		actionId: v.actionId,
		roundId: v.roundId
	} }), await o(p);
	let b;
	try {
		b = ap(await r.generate(v.narrativePacket, {
			signal: a,
			logger: s,
			originalPrompt: i.originalPrompt || ""
		})), hd(a);
	} catch (e) {
		throw p = Gf(p, "awaiting_next", {
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
	return p = Gf(p, "awaiting_next", {
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
async function sp(e, t, n, { signal: r, save: i = () => {}, logger: a = () => {}, originalPrompt: o = "" } = {}) {
	Kf(e, [
		"awaiting_next",
		"committed",
		"ended"
	]);
	let s = e.history.find((e) => e.actionId === t && ["committed", "complete"].includes(e.status));
	if (!s?.narrativePacket) throw Error("找不到可重写的已提交行动");
	let c = Gf(e, "rewrite", { pending: {
		actionId: t,
		roundId: s.roundId
	} });
	await i(c);
	let l;
	try {
		l = ap(await n.rewrite(s.narrativePacket, s.narrative, {
			signal: r,
			logger: a,
			originalPrompt: o
		})), hd(r);
	} catch (e) {
		throw r?.aborted || await i(Gf(c, "awaiting_next", {
			pending: null,
			lastError: e.message
		})), e;
	}
	let u = {
		...s,
		narrative: l,
		status: l.pending ? "committed" : "complete",
		rewrittenAt: (/* @__PURE__ */ new Date()).toISOString()
	}, d = Gf(c, "awaiting_next", {
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
var cp = {
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
}, lp = {
	id: "xybattle-v2-root",
	class: "xy-root-container"
}, up = {
	id: "xybattle-v2-panel",
	class: "xy-workbench-panel",
	role: "dialog",
	"aria-label": "独立战斗工作台"
}, dp = { class: "xy-notice-icon" }, fp = { class: "xy-notice-text" }, pp = {
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
		let n = e, r = /* @__PURE__ */ Jt(!1), i = /* @__PURE__ */ Jt("workbench"), a = /* @__PURE__ */ Jt(""), o = /* @__PURE__ */ Yt(n.controller.playerView()), s = /* @__PURE__ */ Yt(n.controller.state);
		function c() {
			o.value = n.controller.playerView(), s.value = n.controller.state;
		}
		n.controller.onChange = () => {
			c();
		};
		let l = J(() => o.value.phase === "judging"), u = J(() => {
			let e = o.value.phase;
			return e === "judging" ? "裁定中" : e === "narrating" ? "正文中" : e === "awaiting_next" ? "待下轮" : "";
		}), d = /* @__PURE__ */ Lt({
			x: null,
			y: null
		}), f = null, p = !1, m = J(() => d.x === null || d.y === null ? {} : {
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
		yr(() => {
			window.addEventListener("keydown", v);
		}), Cr(() => {
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
		function ee() {
			try {
				n.controller.skipPendingNarrative(), a.value = "已跳过本轮正文，裁定事实已完整保留", c();
			} catch (e) {
				a.value = e.message;
			}
		}
		async function te() {
			try {
				let e = await n.controller.retryHostPersistence();
				a.value = e?.confirmed ? "宿主持久化已确认" : `保存待确认：${e?.reason || "无宿主能力"}`, c();
			} catch (e) {
				a.value = e.message;
			}
		}
		function ne(e) {
			try {
				n.controller.setSettings(e), a.value = "独立机枢设定已保存；敏感凭据绝不落盘", c();
			} catch (e) {
				a.value = e.message;
			}
		}
		function T() {
			try {
				n.controller.importScene(cp), a.value = "已成功载入《叠浪玄潮决》演示场景", c();
			} catch (e) {
				a.value = e.message;
			}
		}
		function re() {
			Af(`battle-v2-save-${Date.now()}.json`, n.controller.exportData());
		}
		function E() {
			Af(`battle-v2-public-${Date.now()}.json`, JSON.stringify(n.controller.playerView(), null, 2));
		}
		function ie() {
			Af(`battle-v2-public-logs-${Date.now()}.json`, n.controller.logExport());
		}
		function ae() {
			Af(`battle-v2-developer-logs-${Date.now()}.json`, n.controller.debugLogExport());
		}
		async function D() {
			await navigator.clipboard.writeText(n.controller.debugLogExport()), a.value = "已复制完整天道开发审计日志";
		}
		function oe(e) {
			try {
				n.controller.importScene(e), a.value = "场景已成功导入", c();
			} catch (e) {
				a.value = e.message;
			}
		}
		function O(e) {
			try {
				n.controller.importRegistry(e), a.value = "功法 Registry 已成功导入", c();
			} catch (e) {
				a.value = e.message;
			}
		}
		function se(e) {
			try {
				n.controller.importData(e), a.value = "当前分支战局存档已恢复", c();
			} catch (e) {
				a.value = e.message;
			}
		}
		let ce = J(() => ({
			scene: s.value.scene,
			actors: s.value.actors,
			semanticState: s.value.semanticState,
			resourceRules: s.value.resourceRules
		})), le = J(() => Q(ep(s.value), n.controller.secrets()));
		return t({
			open: () => {
				r.value = !0;
			},
			close: () => {
				r.value = !1;
			}
		}), (t, n) => (H(), U("div", lp, [W("button", {
			ref: "launcherRef",
			id: "xybattle-v2-launcher",
			class: k(["xy-launcher-seal", {
				"is-active": r.value,
				"is-judging": l.value
			}]),
			style: de(m.value),
			"aria-label": "开启水·弦独立战斗工作台",
			onPointerdown: h,
			onClick: g
		}, [
			n[3] ||= W("div", { class: "xy-seal-ring" }, null, -1),
			n[4] ||= W("div", { class: "xy-seal-inner" }, [W("span", { class: "xy-seal-icon" }, "⚔"), W("span", { class: "xy-seal-text" }, "战斗")], -1),
			u.value ? (H(), U("span", {
				key: 0,
				class: k(["xy-launcher-badge", "bg-" + o.value.phase])
			}, A(u.value), 3)) : K("", !0)
		], 38), G(Ua, { name: "xy-modal-fade" }, {
			default: Mn(() => [r.value ? (H(), U("div", {
				key: 0,
				class: "xy-modal-backdrop",
				onClick: rs(_, ["self"])
			}, [W("section", up, [
				G(Ks, {
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
				G(Ua, { name: "xy-notice-slide" }, {
					default: Mn(() => [a.value || s.value.lastError ? (H(), U("div", {
						key: 0,
						class: k(["xy-notice-banner", { "is-error": !!s.value.lastError }]),
						role: "status"
					}, [
						W("span", dp, A(s.value.lastError ? "⚠️" : "✨"), 1),
						W("span", fp, A(a.value || s.value.lastError), 1),
						W("button", {
							class: "xy-notice-dismiss",
							onClick: n[1] ||= (e) => {
								a.value = "", s.value.lastError = "";
							}
						}, "✕")
					], 2)) : K("", !0)]),
					_: 1
				}),
				W("div", { class: k(["xy-content-body xy-custom-scroll", { "is-scrollable": i.value !== "workbench" }]) }, [L(G(Od, {
					view: o.value,
					state: s.value,
					controller: e.controller,
					onStart: y,
					onNext: b,
					onStop: x,
					onRewrite: C,
					onQueue: w,
					onSkipNarrative: ee,
					onRetryHost: te,
					onSubmit: S
				}, null, 8, [
					"view",
					"state",
					"controller"
				]), [[so, i.value === "workbench"]]), i.value === "settings" ? (H(), Yi(rf, {
					key: 0,
					settings: e.controller.settings,
					onSave: ne,
					onBack: n[2] ||= (e) => i.value = "workbench"
				}, null, 8, ["settings"])) : i.value === "data" ? (H(), Yi(gf, {
					key: 1,
					snapshot: ce.value,
					onLoadDemo: T,
					onExportFull: re,
					onExportPublic: E,
					onImportScene: oe,
					onImportRegistry: O,
					onImportSave: se
				}, null, 8, ["snapshot"])) : i.value === "developer" ? (H(), Yi(kf, {
					key: 2,
					"ai-context": le.value,
					logs: e.controller.logs || [],
					onCopyDebug: D,
					onExportDebug: ae,
					onExportPublic: ie
				}, null, 8, ["ai-context", "logs"])) : K("", !0)], 2)
			])])) : K("", !0)]),
			_: 1
		})]));
	}
};
//#endregion
//#region src/adapters.js
function mp(e = {}) {
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
function hp(e) {
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
var gp = class {
	async judge() {
		throw Error("未配置裁定 AI；请在独立设置中选择 HTTP，或明确选择离线 Mock 演示");
	}
}, _p = class {
	async generate() {
		throw Error("未配置正文 AI；默认可选择主剧情一次性注入");
	}
	async rewrite() {
		return this.generate();
	}
}, vp = class {
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
}, yp = class extends vp {
	constructor() {
		super(), this.mode = "packet";
	}
}, bp = class {
	constructor() {
		this.calls = [], this.isMock = !0;
	}
	async judge(e, { signal: t } = {}) {
		hd(t), this.calls.push(Z(e));
		let n = Z(e.context.semanticState), r = Z(n), i = e.action.techniqueId;
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
}, xp = class {
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
async function Sp(e, t, n = {}) {
	if (!e.endpoint || !e.model) throw Error("HTTP 适配器缺少 endpoint 或 model");
	hd(n.signal);
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
var Cp = class {
	constructor(e = {}) {
		this.config = {
			timeoutMs: 6e4,
			repairAttempts: 2,
			...e
		}, this.isMock = !1;
	}
	async judge(e, t = {}) {
		let n = await Sp({
			...this.config,
			temperature: this.config.temperature ?? e.settings.temperature,
			maxOutput: this.config.maxOutput ?? e.settings.maxOutput
		}, [{
			role: "system",
			content: e.systemPrompt || zf
		}, {
			role: "user",
			content: e.prompt
		}], {
			...t,
			jsonMode: !0
		});
		try {
			return hp(n.content);
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
		return hp((await Sp(this.config, i, {
			...r,
			jsonMode: !0
		})).content);
	}
}, wp = class {
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
			content: `依据已提交战斗场景描写，禁止复判；禁止新增未提交结算。\n${Vf(t, e)}`
		}, {
			role: "user",
			content: e || "继续描写这一已提交战斗场景。"
		}], i = await Sp(this.config, r, n);
		return {
			text: typeof i.content == "string" ? i.content : JSON.stringify(i.content),
			metadata: i.metadata
		};
	}
	async rewrite(e, t, n = {}) {
		return this.generateFromBattlePacket(`${n.originalPrompt ?? this.config.originalPrompt ?? ""}\n重写正文，保持提交事实：${t?.text || ""}`, e, n);
	}
}, Tp = "battle_v2";
function Ep(e) {
	return JSON.stringify([String(e.chatId || "default-chat"), String(e.branchId || "main")]);
}
var Dp = class e {
	constructor(e = globalThis.localStorage, t = {
		chatId: "default-chat",
		branchId: "main"
	}) {
		this.storage = e && typeof e.getItem == "function" ? e : null, this.scope = {
			chatId: String(t.chatId || "default-chat"),
			branchId: String(t.branchId || "main")
		}, this.token = encodeURIComponent(Ep(this.scope)), this.memory = /* @__PURE__ */ new Map();
	}
	withScope(t) {
		return new e(this.storage, t);
	}
	key(e) {
		return `${Tp}.${e}.${this.token}`;
	}
	readSettings() {
		return this.read(`${Tp}.settings`, this.read(this.key("settings"), {}));
	}
	writeSettings(e) {
		let t = Q(e);
		return this.write(`${Tp}.settings`, t), t;
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
function Op(e = {}) {
	let t = mp(e), n = t.adjudicator, r = t.narrator;
	return {
		adjudicator: n.mode === "mock" ? new bp() : n.mode === "http" ? new Cp(n) : new gp(),
		narrator: r.mode === "mock" ? new xp() : r.mode === "http" ? new wp(r) : r.mode === "main_story" ? new vp() : r.mode === "packet" ? new yp() : new _p()
	};
}
var kp = class {
	constructor({ storage: e, chatId: t = "default-chat", branchId: n = "main", adjudicator: r, narrator: i, hostAdapter: a, registry: o = new Rf(), onChange: s = () => {}, initialScene: c = {}, initialPlayer: l, initialEnemies: u = [], semanticState: d } = {}) {
		this.storage = e instanceof Dp ? e : new Dp(e, {
			chatId: t,
			branchId: n
		}), this.registry = o, this.settings = mp(this.storage.readSettings());
		let f = Op(this.settings);
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
		this.state = p ? Yf(p) : Wf({
			...this.initialOptions,
			chatId: t,
			branchId: n
		}), p && (this.registry = new Rf(this.state.registrySnapshot)), this.logs = this.storage.readLogs(), this.ready = Promise.resolve(), a && (a.start?.(), this.unsubScope = a.subscribeScopeChange?.((e) => {
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
		(r.chatId !== String(e.chatId) || r.branchId !== String(e.branchId)) && (this.storage = this.storage.withScope(e), n = this.storage.readSession(), this.state = n ? Yf(n) : Wf({
			...this.initialOptions,
			chatId: e.chatId,
			branchId: e.branchId
		}), this.logs = this.storage.readLogs());
		let i = this.epoch, a = await this.hostAdapter?.loadSession?.(e);
		if (i === this.epoch) {
			if (a?.loaded && a.state) {
				let e = Yf(a.state);
				e.scope.chatId === this.state.scope.chatId && e.scope.branchId === this.state.scope.branchId && (!n || e.sessionId === this.state.sessionId && e.version >= this.state.version || Date.parse(e.updatedAt) > Date.parse(this.state.updatedAt) ? (this.state = e, this.storage.writeSession(e)) : this.log({
					kind: "host_local_ahead",
					capability: { reason: "本地checkpoint比宿主新，将重试持久化；不回退回合" }
				}));
			}
			this.registry = new Rf(this.state.registrySnapshot), this.emit();
		}
	}
	emit() {
		if (this.storage.writeSession(Q(this.state, this.secrets())), this.onChange(this.state, $f(this.state)), this.hostAdapter) {
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
				}, this.storage.writeSession(Q(this.state, this.secrets())), this.onChange(this.state, $f(this.state))), r;
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
		}), e.mode !== void 0 && (delete t.adjudicator, delete t.narrator), this.settings = mp(t), this.storage.writeSettings(this.settings), this.setAdapters(Op(this.settings)), this.emit(), this.settings;
	}
	setAdapters({ adjudicator: e, narrator: t } = {}) {
		e && (this.adjudicator = e), t && (this.narrator = t);
	}
	start() {
		return this.assertIdleRequest(), this.state = qf(this.state), this.emit(), this.state;
	}
	cancelPending() {
		this.epoch += 1, this.inFlight?.abort(), this.inFlight = null, this.bridgeQueuedAction = null;
	}
	stop(e = "用户停止") {
		return this.cancelPending(), this.hostAdapter?.clearScenePacket?.(), this.state = Jf({
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
		return this.state = Zf(this.state), this.emit(), this.state;
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
			let t = await op(this.state, e, {
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
					return hd(r.signal), {
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
			}), this.storage.writeSession(Q(this.state, this.secrets())), this.onChange(this.state, $f(this.state)), t;
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
			let a = await sp(this.state, e, this.narrator, {
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
		}, this.storage.writeSession(Q(this.state, this.secrets())), n?.persisted && n?.confirmed && t && !t.narrative?.text && this.settings.narrator.mode === "main_story" && await this.queueMainStory(t, e), this.onChange(this.state, $f(this.state)), n;
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
		let t = typeof e == "string" ? JSON.parse(e) : Z(e), n = new Rf(t.registry || this.registry.snapshot());
		if (!t.scene || !t.actors?.player || !Array.isArray(t.actors.enemies)) throw Error("场景需 scene、actors.player、actors.enemies");
		for (let e of [t.actors.player, ...t.actors.enemies]) if (!e.id || !e.name) throw Error("角色需id/name");
		if (new Set([t.actors.player, ...t.actors.enemies].map((e) => e.id)).size !== t.actors.enemies.length + 1) throw Error("角色id重复");
		this.cancelPending(), this.hostAdapter?.clearScenePacket?.();
		let r = this.state.version;
		return this.registry = n, this.state = Wf({
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
		let t = typeof e == "string" ? JSON.parse(e) : e, n = new Rf(Array.isArray(t) ? t : t.registry || [t]);
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
		let t = typeof e == "string" ? JSON.parse(e) : Z(e), n = Yf(t.state || t);
		if (n.scope.chatId !== this.state.scope.chatId || n.scope.branchId !== this.state.scope.branchId) throw Error("导入文件作用域与当前聊天/分支不一致");
		return this.cancelPending(), this.hostAdapter?.clearScenePacket?.(), this.state = {
			...n,
			version: Math.max(n.version, this.state.version) + 1
		}, this.registry = new Rf(n.registrySnapshot), this.logs = Q(Array.isArray(t.logs) ? t.logs : [], this.secrets()), this.storage.replaceLogs(this.logs), t.settings && (this.settings = mp(Q(t.settings)), this.storage.writeSettings(this.settings), this.setAdapters(Op(this.settings))), this.emit(), this.state;
	}
	playerView() {
		return $f(this.state);
	}
	logExport() {
		return JSON.stringify(this.logs.map(gd), null, 2);
	}
	debugLogExport() {
		return JSON.stringify(Q(this.logs, this.secrets()), null, 2);
	}
	dispose() {
		this.cancelPending(), this.unsubScope?.(), this.unsubNarrative?.(), this.hostAdapter?.dispose?.();
	}
}, $ = (e) => e == null ? e : JSON.parse(JSON.stringify(e)), Ap = (e) => e != null && e !== "" && Number.isInteger(Number(e)) && Number(e) >= 0 ? Number(e) : null, jp = (e) => !!e && (e.role === "assistant" || e.role == null && e.is_user === !1 && e.extra?.type !== "narrator"), Mp = [
	"chatId",
	"branchId",
	"messageId",
	"swipeId",
	"messageUid"
], Np = (e, t, n = !1) => !!e && !!t && Mp.every((n) => e[n] == null || String(e[n]) === String(t[n])) && (!n || e.scopeEpoch == null || e.scopeEpoch === t.scopeEpoch), Pp = (e) => Object.fromEntries(Mp.map((t) => [t, e[t]]));
function Fp(e) {
	return Array.isArray(e) ? `[${e.map(Fp).join(",")}]` : e && typeof e == "object" ? `{${Object.keys(e).sort().map((t) => `${JSON.stringify(t)}:${Fp(e[t])}`).join(",")}}` : JSON.stringify(e);
}
function Ip(e) {
	return Array.isArray(e) ? e.map(Ip) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).filter(([e]) => ![
		"apiKey",
		"api_key",
		"authorization"
	].includes(e)).map(([e, t]) => [e, Ip(t)]));
}
function Lp(e) {
	return e?.extra?.battle_v2_message_uuid || e?.extra?.message_uuid || e?.swipe_info?.find((e) => e?.battle_v2_message_uuid)?.battle_v2_message_uuid || e?.swipes_info?.find((e) => e?.battle_v2_message_uuid)?.battle_v2_message_uuid;
}
var Rp = class {
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
		return Ap(e.messageId ?? e.message_id ?? e.message?.message_id);
	}
	latestAssistantId(e) {
		if (!Array.isArray(e.chat)) return null;
		for (let t = e.chat.length - 1; t >= 0; --t) if (jp(e.chat[t])) return t;
		return null;
	}
	storedAnchorId(e, t) {
		if (!Array.isArray(e.chat)) return null;
		for (let n = e.chat.length - 1; n >= 0; --n) {
			let r = e.chat[n], i = r?.swipe_info?.[r.swipe_id ?? 0]?.battle_v2 || r?.extra?.battle_v2;
			if (jp(r) && i?.schema === "battle_v2_host_store" && i.scope?.chatId === t && i.scope?.messageId === n && i.scope?.swipeId === (r.swipe_id ?? 0)) return n;
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
		let i = r.swipes || [r.mes ?? r.message ?? ""], a = Ap(r.swipe_id ?? r.swipeId) ?? 0, o = Array.from({ length: i.length }, (e, t) => $(r.swipe_info?.[t] ?? r.swipes_info?.[t] ?? (t === a ? r.extra : {}) ?? {}));
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
			r = Ap(this.helper()?.getCurrentMessageId?.());
		} catch {}
		let a;
		try {
			a = r == null ? null : this.readMessageSync(r, e);
		} catch {
			a = null;
		}
		let o = e.chat?.[r] || (n === r ? e.message : null);
		if (!t || !jp(a) || Ap(a?.swipe_id) == null) return this.publishScope({
			chatId: t || "default-chat",
			branchId: "main",
			messageId: null,
			swipeId: null,
			messageUid: null,
			available: !1,
			writable: !1
		}), this.anchor = null, { ...this.currentScope };
		let s = Lp(o) || Lp(a), c = this.anchor?.chatId === t && this.anchor.messageId === r && (o ? o === this.anchor.raw || s === this.anchor.messageUid : !s || s === this.anchor.messageUid), l = s || (c ? this.anchor.messageUid : o && this.messageUids.get(o));
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
		if (t || !n || !Np(n, e) || n.available !== e.available || n.writable !== e.writable) {
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
		if (!Np(e, n, !0)) throw Error("Host scope changed; refusing a late cross-chat or cross-swipe operation");
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
			if (r.schema !== "battle_v2_host_store" || !Np(r.scope, n) || !Np(r.state?.scope || r.scope, n)) throw Error("Stored battle_v2 scope does not match this message branch");
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
		let r = { ...n }, i = Ip($(e)), a = Ip($(t)), o = this.writeQueue.catch(() => {}).then(() => this.writeReceipt(i, a, r));
		return this.writeQueue = o, o;
	}
	async writeReceipt(e, t, n) {
		let r = this.capability();
		try {
			let i = this.validateScope(n, { writable: !0 });
			if (e?.scope && !Np(e.scope, i, !0) || t?.scope && !Np(t.scope, i, !0)) throw Error("Receipt/session scope mismatch");
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
			if (o && (o.schema !== "battle_v2_host_store" || !Np(o.scope, i))) throw Error("Existing host store has an incompatible scope/schema");
			let s = Fp(Pp(i)), c = Math.max(Number(e?.version ?? 0), Number(t?.version ?? 0));
			if (!Number.isFinite(c) || c < 0) throw Error("Invalid host store version");
			let l = e?.actionId && o?.receipts?.[e.actionId], u = e && {
				...e,
				scope: Pp(i)
			};
			if (o && c < o.version) {
				if (!this.uncertainScopes.has(s) && l && Fp(l) === Fp(u)) return {
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
				]) if (l.status !== "prepared" && Fp(l[e]) !== Fp(u[e])) throw Error("Conflicting duplicate actionId refused");
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
				scope: Pp(i),
				version: Math.max(c, o?.version || 0),
				state: t ? {
					...t,
					scope: {
						...t.scope,
						...Pp(i)
					}
				} : o?.state || null,
				receipts: { ...o?.receipts }
			};
			if (u && (d.receipts[e.actionId] = u, d.lastActionId = e.actionId), !this.uncertainScopes.has(s) && o && Fp(o) === Fp(d)) return {
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
			if (Fp(h) !== Fp(d)) throw Error("Host persistence readback mismatch");
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
			if (e.scope && !Np(e.scope, n, !0)) throw Error("Scene packet scope mismatch");
			if (this.capability().injection === "unavailable") return {
				queued: !1,
				injected: !1,
				capability: this.capability(),
				reason: "injectPrompts or generation events are unavailable"
			};
			let r = this.readMessageSync(n.messageId)?.swipes_info?.[n.swipeId]?.battle_v2, i = r?.receipts?.[e.actionId];
			if (this.uncertainScopes.has(Fp(Pp(n)))) throw Error("Host persistence is unconfirmed after a failed save");
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
				this.clearScenePacket(), e === "MESSAGE_SWIPED" && Ap(t) != null && this.anchor && (this.anchor = {
					...this.anchor,
					messageId: Ap(t),
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
function zp({ documentRef: e = globalThis.document, storage: t = globalThis.localStorage, hostAdapter: n, controller: r, chatId: i = "demo-local", branchId: a = "main" } = {}) {
	if (!e) return null;
	if (e.getElementById("xybattle-v2-root")) return globalThis.XYBattle;
	let o = e.createElement("div");
	o.id = "xybattle-v2-root-wrapper", e.body.appendChild(o);
	try {
		let t = new URL("data:text/css;base64,Lnh5LWljb25bZGF0YS12LTdkZjkyNTA3XXt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7ZmxleC1zaHJpbms6MDt3aWR0aDoxZW07aGVpZ2h0OjFlbTtkaXNwbGF5OmlubGluZS1ibG9ja30ueHktaGVhZGVyW2RhdGEtdi03ZGRkYTQzN117ei1pbmRleDoxMDtib3JkZXItYm90dG9tOjFweCBzb2xpZCB2YXIoLS14eS1ib3JkZXItc3VidGxlKTtiYWNrZHJvcC1maWx0ZXI6Ymx1cigxNnB4KTt1c2VyLXNlbGVjdDpub25lO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KCMwODEyMjBmMiAwJSwjMDUwYzE2Y2MgMTAwJSk7ZmxleC1zaHJpbms6MDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7cGFkZGluZzoxMnB4IDMycHggMTBweDtkaXNwbGF5OmZsZXg7cG9zaXRpb246cmVsYXRpdmV9Lnh5LWhlYWRlci1sZWZ0W2RhdGEtdi03ZGRkYTQzN117YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxNnB4O2Rpc3BsYXk6ZmxleH0ueHktYnJhbmQtc2VhbFtkYXRhLXYtN2RkZGE0Mzdde2JvcmRlcjoxcHggc29saWQgdmFyKC0teHktYm9yZGVyLWdsb3cpO3dpZHRoOjQ0cHg7aGVpZ2h0OjQ0cHg7Ym94LXNoYWRvdzowIDAgMTZweCB2YXIoLS14eS1jeWFuLWdsb3cpLCBpbnNldCAwIDAgMTBweCAjMzhiZGY4MzM7YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDMwJSAzMCUsIzM4YmRmODQwLCMwNzEwMWVmMik7Ym9yZGVyLXJhZGl1czo4cHg7ZmxleC1zaHJpbms6MDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtkaXNwbGF5OmZsZXh9Lnh5LXNlYWwtc3ltYm9sW2RhdGEtdi03ZGRkYTQzN117Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y29sb3I6dmFyKC0teHktY3lhbi0zMDApO3RleHQtc2hhZG93OjAgMCA4cHggdmFyKC0teHktY3lhbi00MDApO2ZvbnQtc2l6ZToyNHB4O2ZvbnQtd2VpZ2h0OjYwMH0ueHkta2lja2VyW2RhdGEtdi03ZGRkYTQzN117bGV0dGVyLXNwYWNpbmc6LjE2ZW07Y29sb3I6dmFyKC0teHktY3lhbi00MDApO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtmb250LXNpemU6MTBweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O2Rpc3BsYXk6ZmxleH0ueHkta2lja2VyLWRvdFtkYXRhLXYtN2RkZGE0Mzdde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpfS54eS1zY29wZS1waWxsW2RhdGEtdi03ZGRkYTQzN117Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCk7YmFja2dyb3VuZDojZmZmZmZmMGE7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmMGQ7Ym9yZGVyLXJhZGl1czo0cHg7cGFkZGluZzoxcHggNnB4O2ZvbnQtc2l6ZTo5cHh9Lnh5LXRpdGxlW2RhdGEtdi03ZGRkYTQzN117YWxpZ24taXRlbXM6YmFzZWxpbmU7Z2FwOjEycHg7bWFyZ2luOjJweCAwIDNweDtkaXNwbGF5OmZsZXh9Lnh5LXRpdGxlLXRleHRbZGF0YS12LTdkZGRhNDM3XXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjp2YXIoLS14eS10ZXh0LXRpdGxlKTtsZXR0ZXItc3BhY2luZzouMDZlbTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZiAwJSwjYmFlNmZkIDYwJSwjN2RkM2ZjIDEwMCUpOy13ZWJraXQtdGV4dC1maWxsLWNvbG9yOnRyYW5zcGFyZW50Oy13ZWJraXQtYmFja2dyb3VuZC1jbGlwOnRleHQ7Zm9udC1zaXplOjI0cHg7Zm9udC13ZWlnaHQ6NTAwfS54eS1yb3VuZC1zZWFsW2RhdGEtdi03ZGRkYTQzN117Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y29sb3I6dmFyKC0teHktZ29sZC0zMDApO2JvcmRlcjoxcHggc29saWQgdmFyKC0teHktYm9yZGVyLWdvbGQpO2xldHRlci1zcGFjaW5nOi4xZW07YmFja2dyb3VuZDojZmJiZjI0MTQ7Ym9yZGVyLXJhZGl1czo0cHg7cGFkZGluZzoycHggOHB4O2ZvbnQtc2l6ZToxMXB4fS54eS1zdWJ0aXRsZVtkYXRhLXYtN2RkZGE0Mzdde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O21hcmdpbjowO2ZvbnQtc2l6ZToxMnB4O2Rpc3BsYXk6ZmxleH0ueHktc2VwW2RhdGEtdi03ZGRkYTQzN117Y29sb3I6I2ZmZmZmZjFmfS54eS1jb250cm9sLXN0YXRlW2RhdGEtdi03ZGRkYTQzN117Zm9udC13ZWlnaHQ6NTAwfS50b25lLXBsYXllcltkYXRhLXYtN2RkZGE0Mzdde2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKTt0ZXh0LXNoYWRvdzowIDAgNnB4IHZhcigtLXh5LWN5YW4tZ2xvdyl9LnRvbmUtZW5lbXlbZGF0YS12LTdkZGRhNDM3XXtjb2xvcjp2YXIoLS14eS1jcmltc29uLTQwMCk7dGV4dC1zaGFkb3c6MCAwIDZweCB2YXIoLS14eS1jcmltc29uLWdsb3cpfS50b25lLW5ldXRyYWxbZGF0YS12LTdkZGRhNDM3XXtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCl9Lnh5LW5hdi10YWJzW2RhdGEtdi03ZGRkYTQzN117LXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6Ymx1cigyMHB4KXNhdHVyYXRlKDE2MCUpO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMDgxNDI2OTkgMCUsIzA0MGMxOGJmIDEwMCUpO2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjFmO2JvcmRlci1yYWRpdXM6OTk5cHg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo0cHg7cGFkZGluZzo0cHg7ZGlzcGxheTpmbGV4O2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMS41cHggI2ZmZmZmZjJlLGluc2V0IDAgLTFweCAycHggIzAwMDYsMCA4cHggMjRweCAjMDAwMDAwNTl9Lnh5LXRhYi1idG5bZGF0YS12LTdkZGRhNDM3XXtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtmb250LXNpemU6MTNweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNhbnMpO2N1cnNvcjpwb2ludGVyO2JhY2tncm91bmQ6MCAwO2JvcmRlcjoxcHggc29saWQgIzAwMDA7Ym9yZGVyLXJhZGl1czo5OTlweDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtwYWRkaW5nOjhweCAxNnB4O3RyYW5zaXRpb246YWxsIC4yNHMgY3ViaWMtYmV6aWVyKC4xNiwxLC4zLDEpO2Rpc3BsYXk6ZmxleH0ueHktdGFiLWJ0bltkYXRhLXYtN2RkZGE0MzddOmhvdmVye2NvbG9yOiNmZmY7YmFja2dyb3VuZDojZmZmZmZmMTR9Lnh5LXRhYi1idG4uYWN0aXZlW2RhdGEtdi03ZGRkYTQzN117Y29sb3I6I2ZmZjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzM4YmRmODU5IDAlLCMwZWE1ZTkyNiAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICM3ZGQzZmM2Njtib3gtc2hhZG93Omluc2V0IDAgMXB4IDEuNXB4ICNmZmY2LDAgNHB4IDE2cHggIzM4YmRmODQwfS54eS10YWItYmFkZ2VbZGF0YS12LTdkZGRhNDM3XXtmb250LXNpemU6MTBweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKTtiYWNrZ3JvdW5kOiMzOGJkZjgzMztib3JkZXItcmFkaXVzOjk5OXB4O3BhZGRpbmc6MXB4IDZweH0ueHktaGVhZGVyLXJpZ2h0W2RhdGEtdi03ZGRkYTQzN117YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4O2Rpc3BsYXk6ZmxleH0ueHktcGhhc2UtaW5kaWNhdG9yW2RhdGEtdi03ZGRkYTQzN117Zm9udC1zaXplOjExcHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtsZXR0ZXItc3BhY2luZzouMDhlbTtiYWNrZ3JvdW5kOiNmZmZmZmYwYTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYxNDtib3JkZXItcmFkaXVzOjk5OXB4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6N3B4O3BhZGRpbmc6NnB4IDEycHg7ZGlzcGxheTpmbGV4fS54eS1waGFzZS1wdWxzZVtkYXRhLXYtN2RkZGE0Mzdde2JhY2tncm91bmQ6Y3VycmVudENvbG9yO2JvcmRlci1yYWRpdXM6NTAlO3dpZHRoOjZweDtoZWlnaHQ6NnB4fS5waGFzZS1pZGxlW2RhdGEtdi03ZGRkYTQzN117Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCl9LnBoYXNlLWF3YWl0aW5nX3BsYXllcltkYXRhLXYtN2RkZGE0Mzdde2NvbG9yOnZhcigtLXh5LWN5YW4tNDAwKTtib3JkZXItY29sb3I6dmFyKC0teHktYm9yZGVyLWdsb3cpO2JhY2tncm91bmQ6IzM4YmRmODE0fS5waGFzZS1hd2FpdGluZ19wbGF5ZXIgLnh5LXBoYXNlLXB1bHNlW2RhdGEtdi03ZGRkYTQzN117YW5pbWF0aW9uOjJzIGluZmluaXRlIHh5LXB1bHNlLWdsb3d9LnBoYXNlLWp1ZGdpbmdbZGF0YS12LTdkZGRhNDM3XXtjb2xvcjp2YXIoLS14eS1nb2xkLTQwMCk7Ym9yZGVyLWNvbG9yOnZhcigtLXh5LWJvcmRlci1nb2xkKTtiYWNrZ3JvdW5kOiNmYmJmMjQxYX0ucGhhc2UtanVkZ2luZyAueHktcGhhc2UtcHVsc2VbZGF0YS12LTdkZGRhNDM3XXthbmltYXRpb246MXMgaW5maW5pdGUgeHktcHVsc2UtZ2xvd30ucGhhc2UtY29tbWl0dGVkW2RhdGEtdi03ZGRkYTQzN117Y29sb3I6dmFyKC0teHktamFkZS00MDApO2JhY2tncm91bmQ6IzJkZDRiZjE0O2JvcmRlci1jb2xvcjojMmRkNGJmNGR9LnBoYXNlLW5hcnJhdGluZ1tkYXRhLXYtN2RkZGE0Mzdde2NvbG9yOiNhNzhiZmE7YmFja2dyb3VuZDojYTc4YmZhMTQ7Ym9yZGVyLWNvbG9yOiNhNzhiZmE0ZH0ueHktbWV0YS10YWdbZGF0YS12LTdkZGRhNDM3XXtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtmb250LXNpemU6MTBweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpmbGV4LWVuZDtsaW5lLWhlaWdodDoxLjM7ZGlzcGxheTpmbGV4fS54eS1tZXRhLW1vZGVbZGF0YS12LTdkZGRhNDM3XXtjb2xvcjp2YXIoLS14eS1jeWFuLTMwMCl9Lnh5LWNsb3NlLWJ0bltkYXRhLXYtN2RkZGE0Mzddey13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweCk7d2lkdGg6MzRweDtoZWlnaHQ6MzRweDtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZmZmZjE0IDAlLCNmZmZmZmYwNSAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYyNDtib3JkZXItcmFkaXVzOjk5OXB4O2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO3RyYW5zaXRpb246YWxsIC4yNHMgY3ViaWMtYmV6aWVyKC4xNiwxLC4zLDEpO2Rpc3BsYXk6ZmxleDtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCAjZmZmZmZmNDAsMCA0cHggMTJweCAjMDAwMDAwNGR9Lnh5LWNsb3NlLWJ0bltkYXRhLXYtN2RkZGE0MzddOmhvdmVye2NvbG9yOiNmY2E1YTU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmNDNmNWU0MCAwJSwjZTExZDQ4MWEgMTAwJSk7Ym9yZGVyLWNvbG9yOiNmNDNmNWU4MDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KTtib3gtc2hhZG93Omluc2V0IDAgMXB4IDEuNXB4ICNmZmY2LDAgNnB4IDE4cHggI2Y0M2Y1ZTU5fS54eS1hdG1vc3BoZXJlW2RhdGEtdi0wM2JkNTc5NF17cG9pbnRlci1ldmVudHM6bm9uZTt6LWluZGV4OjA7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MDtvdmVyZmxvdzpoaWRkZW59Lnh5LXdhdGVyLW1pc3RbZGF0YS12LTAzYmQ1Nzk0XXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgNTAlIDQwJSwjMGVhNWU5MWYgMCUsIzAwMDAgNjUlKSxyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDE4JSAzMCUsIzJkZDRiZjEyIDAlLCMwMDAwIDUwJSkscmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCA4MiUgMzUlLCNmNDNmNWUwZiAwJSwjMDAwMCA1MCUpLGxpbmVhci1ncmFkaWVudCgjMDcxMDFlNGQgMCUsIzAzMDcwZGQ5IDEwMCUpO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjB9Lnh5LXN0cmluZy1jYW52YXNbZGF0YS12LTAzYmQ1Nzk0XXt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjB9Lnh5LWNob3JkLWxpbmVbZGF0YS12LTAzYmQ1Nzk0XXt3aWxsLWNoYW5nZTp0cmFuc2Zvcm19LmNob3JkLTFbZGF0YS12LTAzYmQ1Nzk0XXthbmltYXRpb246OXMgZWFzZS1pbi1vdXQgaW5maW5pdGUgYWx0ZXJuYXRlIHh5LXNpbmUtZHJpZnQtMDNiZDU3OTR9LmNob3JkLTJbZGF0YS12LTAzYmQ1Nzk0XXthbmltYXRpb246MTFzIGVhc2UtaW4tb3V0IGluZmluaXRlIGFsdGVybmF0ZS1yZXZlcnNlIHh5LXNpbmUtZHJpZnQtMDNiZDU3OTR9LmNob3JkLTNbZGF0YS12LTAzYmQ1Nzk0XXthbmltYXRpb246N3MgZWFzZS1pbi1vdXQgaW5maW5pdGUgYWx0ZXJuYXRlIHh5LXNpbmUtZHJpZnQtMDNiZDU3OTR9Lnh5LXZvcnRleC1yaW5nW2RhdGEtdi0wM2JkNTc5NF17dHJhbnNmb3JtLW9yaWdpbjo3MjBweCA0MDBweDthbmltYXRpb246NjBzIGxpbmVhciBpbmZpbml0ZSB4eS1yb3RhdGUtc2xvdy0wM2JkNTc5NH1Aa2V5ZnJhbWVzIHh5LXNpbmUtZHJpZnQtMDNiZDU3OTR7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTRweClzY2FsZVkoLjk2KX01MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoNXB4KXNjYWxlWSgxLjA1KX10b3t0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMnB4KXNjYWxlWSgxKX19QGtleWZyYW1lcyB4eS1yb3RhdGUtc2xvdy0wM2JkNTc5NHswJXt0cmFuc2Zvcm06cm90YXRlKDApfXRve3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19Lnh5LXBhcnRpY2xlc1tkYXRhLXYtMDNiZDU3OTRde3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjB9Lnh5LXNwYXJrbGVbZGF0YS12LTAzYmQ1Nzk0XXtvcGFjaXR5Oi4zO2JhY2tncm91bmQ6IzM4YmRmODtib3JkZXItcmFkaXVzOjUwJTt3aWR0aDozcHg7aGVpZ2h0OjNweDthbmltYXRpb246NnMgZWFzZS1pbi1vdXQgaW5maW5pdGUgeHktc3BhcmtsZS1mbG9hdC0wM2JkNTc5NDtwb3NpdGlvbjphYnNvbHV0ZTtib3gtc2hhZG93OjAgMCA4cHggIzM4YmRmOH0uczFbZGF0YS12LTAzYmQ1Nzk0XXthbmltYXRpb24tZGVsYXk6MHM7dG9wOjIyJTtsZWZ0OjI0JX0uczJbZGF0YS12LTAzYmQ1Nzk0XXtiYWNrZ3JvdW5kOiNmYmJmMjQ7YW5pbWF0aW9uLWRlbGF5OjEuNXM7dG9wOjM4JTtsZWZ0Ojc2JTtib3gtc2hhZG93OjAgMCA4cHggI2ZiYmYyNH0uczNbZGF0YS12LTAzYmQ1Nzk0XXthbmltYXRpb24tZGVsYXk6M3M7dG9wOjY1JTtsZWZ0OjQ1JX0uczRbZGF0YS12LTAzYmQ1Nzk0XXthbmltYXRpb24tZGVsYXk6Mi4yczt0b3A6MTUlO2xlZnQ6NjAlfS5zNVtkYXRhLXYtMDNiZDU3OTRde2JhY2tncm91bmQ6IzJkZDRiZjthbmltYXRpb24tZGVsYXk6NC4xczt0b3A6NzglO2xlZnQ6MzAlfUBrZXlmcmFtZXMgeHktc3BhcmtsZS1mbG9hdC0wM2JkNTc5NHswJSx0b3tvcGFjaXR5Oi4yO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDApc2NhbGUoLjgpfTUwJXtvcGFjaXR5Oi43O3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xNnB4KXNjYWxlKDEuNCl9fS54eS1maWd1cmUtY29udGFpbmVyW2RhdGEtdi04NmMyNGY5M117dXNlci1zZWxlY3Q6bm9uZTtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21pbi1oZWlnaHQ6MjYwcHg7bWF4LWhlaWdodDozODBweDtkaXNwbGF5OmZsZXg7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVufS54eS1maWd1cmUtaGFsb1tkYXRhLXYtODZjMjRmOTNde3BvaW50ZXItZXZlbnRzOm5vbmU7ZmlsdGVyOmJsdXIoNDBweCk7b3BhY2l0eTouMjg7ei1pbmRleDowO2JvcmRlci1yYWRpdXM6NTAlO3dpZHRoOjIyMHB4O2hlaWdodDoyMjBweDtwb3NpdGlvbjphYnNvbHV0ZX0uZmlndXJlLXBsYXllciAueHktZmlndXJlLWhhbG9bZGF0YS12LTg2YzI0ZjkzXXtiYWNrZ3JvdW5kOnJhZGlhbC1ncmFkaWVudChjaXJjbGUsIzAyODRjNyAwJSwjMzhiZGY4IDUwJSwjMDAwMCA3NSUpfS5maWd1cmUtZW5lbXkgLnh5LWZpZ3VyZS1oYWxvW2RhdGEtdi04NmMyNGY5M117YmFja2dyb3VuZDpyYWRpYWwtZ3JhZGllbnQoY2lyY2xlLCNlMTFkNDggMCUsI2ZiNzE4NSA1MCUsIzAwMDAgNzUlKX0ueHktZmlndXJlLWN1c3RvbVtkYXRhLXYtODZjMjRmOTNde3otaW5kZXg6MTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLXh5LWJvcmRlci1zdWJ0bGUpO2JvcmRlci1yYWRpdXM6MTZweDt3aWR0aDoxODBweDtoZWlnaHQ6MjgwcHg7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVuO2JveC1zaGFkb3c6MCAxNnB4IDQwcHggIzAwMDl9Lnh5LWN1c3RvbS1pbWdbZGF0YS12LTg2YzI0ZjkzXXtvYmplY3QtZml0OmNvdmVyO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCV9Lnh5LWZpZ3VyZS1zaWxob3VldHRlW2RhdGEtdi04NmMyNGY5M117ei1pbmRleDoxO2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7YW5pbWF0aW9uOjhzIGVhc2UtaW4tb3V0IGluZmluaXRlIGFsdGVybmF0ZSBmaWd1cmUtc3dheS04NmMyNGY5MztkaXNwbGF5OmZsZXg7cG9zaXRpb246cmVsYXRpdmV9QGtleWZyYW1lcyBmaWd1cmUtc3dheS04NmMyNGY5M3swJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKXNjYWxlKDEpfTUwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNnB4KXNjYWxlKDEuMDEpfXRve3RyYW5zZm9ybTp0cmFuc2xhdGVZKDJweClzY2FsZSguOTk1KX19Lnh5LWRhb2lzdC1zdmdbZGF0YS12LTg2YzI0ZjkzXXtmaWx0ZXI6ZHJvcC1zaGFkb3coMCAxMnB4IDI0cHggIzAwMDAwMDgwKTt3aWR0aDoxMDAlO21heC13aWR0aDoyMDBweDtoZWlnaHQ6MTAwJTttYXgtaGVpZ2h0OjM0MHB4fS54eS1vcmJpdGluZy1jaG9yZHNbZGF0YS12LTg2YzI0ZjkzXXt0cmFuc2Zvcm0tb3JpZ2luOjExMHB4IDIyMHB4O2FuaW1hdGlvbjoyNHMgbGluZWFyIGluZmluaXRlIGNob3JkLXJvdGF0ZS04NmMyNGY5M31Aa2V5ZnJhbWVzIGNob3JkLXJvdGF0ZS04NmMyNGY5M3swJXt0cmFuc2Zvcm06cm90YXRlKDApfXRve3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19Lnh5LWZpZ3VyZS1zcGFya2xlc1tkYXRhLXYtODZjMjRmOTNde3BvaW50ZXItZXZlbnRzOm5vbmU7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MH0ueHktZi1kb3RbZGF0YS12LTg2YzI0ZjkzXXtib3JkZXItcmFkaXVzOjUwJTt3aWR0aDozcHg7aGVpZ2h0OjNweDthbmltYXRpb246NHMgZWFzZS1pbi1vdXQgaW5maW5pdGUgZG90LXJpc2UtODZjMjRmOTM7cG9zaXRpb246YWJzb2x1dGV9LmZpZ3VyZS1wbGF5ZXIgLnh5LWYtZG90W2RhdGEtdi04NmMyNGY5M117YmFja2dyb3VuZDojMzhiZGY4O2JveC1zaGFkb3c6MCAwIDhweCAjMzhiZGY4fS5maWd1cmUtZW5lbXkgLnh5LWYtZG90W2RhdGEtdi04NmMyNGY5M117YmFja2dyb3VuZDojZmI3MTg1O2JveC1zaGFkb3c6MCAwIDhweCAjZmI3MTg1fS5kMVtkYXRhLXYtODZjMjRmOTNde2FuaW1hdGlvbi1kZWxheTowczt0b3A6NjAlO2xlZnQ6MzUlfS5kMltkYXRhLXYtODZjMjRmOTNde2FuaW1hdGlvbi1kZWxheToxLjVzO3RvcDo0MCU7bGVmdDo2NSV9LmQzW2RhdGEtdi04NmMyNGY5M117YW5pbWF0aW9uLWRlbGF5OjIuOHM7dG9wOjc1JTtsZWZ0OjUwJX1Aa2V5ZnJhbWVzIGRvdC1yaXNlLTg2YzI0ZjkzezAle29wYWNpdHk6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgxMHB4KXNjYWxlKC41KX01MCV7b3BhY2l0eTouODt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMTVweClzY2FsZSgxLjIpfXRve29wYWNpdHk6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMzBweClzY2FsZSguNCl9fS54eS1jaG9yZC13aW5nc1tkYXRhLXYtOTE4YjQxM2Zde3VzZXItc2VsZWN0Om5vbmU7anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7bWluLXdpZHRoOjI1MHB4O21heC13aWR0aDozMjBweDtoZWlnaHQ6MTAwJTttaW4taGVpZ2h0OjM0MHB4O2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZX0ueHktd2luZ3MtcmF5cy1zdmdbZGF0YS12LTkxOGI0MTNmXXtwb2ludGVyLWV2ZW50czpub25lO3otaW5kZXg6MDt3aWR0aDpjYWxjKDEwMCUgKyAzMHB4KTtoZWlnaHQ6Y2FsYygxMDAlICsgMzBweCk7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6LTE1cHg7b3ZlcmZsb3c6dmlzaWJsZX0ueHktd2luZ3MtY29udGFpbmVyW2RhdGEtdi05MThiNDEzZl17ei1pbmRleDoxO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MTRweDt3aWR0aDoxMDAlO2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZX0ueHktd2luZy1mZWF0aGVyW2RhdGEtdi05MThiNDEzZl17Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS14eS1ib3JkZXItc3VidGxlKTtiYWNrZHJvcC1maWx0ZXI6Ymx1cigxNnB4KTt3aWR0aDoxMDAlO21pbi1oZWlnaHQ6NTJweDtjb2xvcjp2YXIoLS14eS10ZXh0LXRpdGxlKTtjdXJzb3I6cG9pbnRlcjt0cmFuc2Zvcm0tb3JpZ2luOjA7Ym94LXNpemluZzpib3JkZXItYm94O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMGUxZTM2ZjAgMCUsIzA2MGUxYWZhIDEwMCUpO2JvcmRlci1yYWRpdXM6MTBweDtvdXRsaW5lOm5vbmU7YWxpZ24taXRlbXM6Y2VudGVyO3BhZGRpbmc6MTNweCAyMHB4O3RyYW5zaXRpb246dHJhbnNmb3JtIC40NXMgY3ViaWMtYmV6aWVyKC4xNiwxLC4zLDEpLG9wYWNpdHkgLjRzIGN1YmljLWJlemllciguMTYsMSwuMywxKSxmaWx0ZXIgLjRzLGJveC1zaGFkb3cgLjNzLGJvcmRlci1jb2xvciAuM3M7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlO2JveC1zaGFkb3c6MCA2cHggMjBweCAjMDAwMDAwNzMsaW5zZXQgMCAxcHggI2ZmZmZmZjE0fS53aW5ncy1lbmVteSAueHktd2luZy1mZWF0aGVyW2RhdGEtdi05MThiNDEzZl17dHJhbnNmb3JtLW9yaWdpbjoxMDAlO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMmExMDFjZjAgMCUsIzE0MDYwZWZhIDEwMCUpO2JvcmRlci1jb2xvcjojZjQzZjVlNDc7ZmxleC1kaXJlY3Rpb246cm93LXJldmVyc2V9LmZlYXRoZXItcGxheWVyW2RhdGEtdi05MThiNDEzZl06aG92ZXI6bm90KDpkaXNhYmxlZCk6bm90KC5pcy1zaHJ1bmspe2JvcmRlci1jb2xvcjp2YXIoLS14eS1jeWFuLTMwMCk7Ym94LXNoYWRvdzowIDhweCAzMHB4IHZhcigtLXh5LWN5YW4tZ2xvdyksIGluc2V0IDAgMCAxNnB4ICMzOGJkZjg1OTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzEyMmU1MmZhIDAlLCMwODE2MjggMTAwJSl9LmZlYXRoZXItZW5lbXlbZGF0YS12LTkxOGI0MTNmXTpob3Zlcjpub3QoOmRpc2FibGVkKTpub3QoLmlzLXNocnVuayl7Ym9yZGVyLWNvbG9yOnZhcigtLXh5LWNyaW1zb24tNDAwKTtib3gtc2hhZG93OjAgOHB4IDMwcHggdmFyKC0teHktY3JpbXNvbi1nbG93KSwgaW5zZXQgMCAwIDE2cHggI2Y0M2Y1ZTU5O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMzYxNjI0ZmEgMCUsIzFhMDgxMiAxMDAlKX0ueHktd2luZy1mZWF0aGVyLmlzLXNlbGVjdGVkW2RhdGEtdi05MThiNDEzZl17Ym9yZGVyLWNvbG9yOnZhcigtLXh5LWdvbGQtNDAwKTtib3gtc2hhZG93OjAgMCAzMnB4IHZhcigtLXh5LWdvbGQtZ2xvdyksIDAgMTJweCAzNnB4ICMwMDAwMDBiMzt6LWluZGV4OjI1O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMWUzYTYwIDAlLCMwZTFlMzYgMTAwJSl9LndpbmdzLWVuZW15IC54eS13aW5nLWZlYXRoZXIuaXMtc2VsZWN0ZWRbZGF0YS12LTkxOGI0MTNmXXtib3JkZXItY29sb3I6dmFyKC0teHktY3JpbXNvbi00MDApO2JveC1zaGFkb3c6MCAwIDMycHggdmFyKC0teHktY3JpbXNvbi1nbG93KSwgMCAxMnB4IDM2cHggIzAwMDAwMGIzO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjNDAxODJhIDAlLCMxYzBhMTQgMTAwJSl9Lnh5LXdpbmctZmVhdGhlci5pcy1zaHJ1bmtbZGF0YS12LTkxOGI0MTNmXXtvcGFjaXR5Oi4yMjtmaWx0ZXI6Ymx1ciguOHB4KTtwb2ludGVyLWV2ZW50czpub25lO2JveC1zaGFkb3c6MCAycHggOHB4ICMwMDAwMDA0ZH0ueHktd2luZy1mZWF0aGVyLmlzLWxvY2tlZFtkYXRhLXYtOTE4YjQxM2Zde29wYWNpdHk6LjY1O2N1cnNvcjpwb2ludGVyO2JvcmRlci1zdHlsZTpkYXNoZWR9LmZlYXRoZXItcGxheWVyLmlzLWxvY2tlZFtkYXRhLXYtOTE4YjQxM2ZdOmhvdmVyOm5vdCguaXMtc2hydW5rKXtvcGFjaXR5Oi45NTtib3JkZXItY29sb3I6dmFyKC0teHktY3lhbi00MDApO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMGUyMjNjZjIgMCUsIzA2MTAyMCAxMDAlKTtib3gtc2hhZG93OjAgNnB4IDI0cHggIzM4YmRmODQwLGluc2V0IDAgMCAxMnB4ICMzOGJkZjgzM30ueHktZmVhdGhlci10aXBbZGF0YS12LTkxOGI0MTNmXXtwb2ludGVyLWV2ZW50czpub25lO2JvcmRlci1yYWRpdXM6NTAlO3dpZHRoOjZweDtoZWlnaHQ6NnB4O3RyYW5zaXRpb246YWxsIC4zcztwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC01MCUpfS5mZWF0aGVyLXBsYXllciAueHktZmVhdGhlci10aXBbZGF0YS12LTkxOGI0MTNmXXtiYWNrZ3JvdW5kOnZhcigtLXh5LWN5YW4tNDAwKTtib3gtc2hhZG93OjAgMCAxMHB4IHZhcigtLXh5LWN5YW4tZ2xvdyk7cmlnaHQ6LTNweH0uZmVhdGhlci1lbmVteSAueHktZmVhdGhlci10aXBbZGF0YS12LTkxOGI0MTNmXXtiYWNrZ3JvdW5kOnZhcigtLXh5LWNyaW1zb24tNDAwKTtib3gtc2hhZG93OjAgMCAxMHB4IHZhcigtLXh5LWNyaW1zb24tZ2xvdyk7bGVmdDotM3B4fS54eS13aW5nLWZlYXRoZXIuaXMtc2VsZWN0ZWQgLnh5LWZlYXRoZXItdGlwW2RhdGEtdi05MThiNDEzZl17YmFja2dyb3VuZDp2YXIoLS14eS1nb2xkLTQwMCk7d2lkdGg6OHB4O2hlaWdodDo4cHg7Ym94LXNoYWRvdzowIDAgMTZweCB2YXIoLS14eS1nb2xkLWdsb3cpfS54eS1mZWF0aGVyLWlubmVyW2RhdGEtdi05MThiNDEzZl17anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4O3dpZHRoOjEwMCU7ZGlzcGxheTpmbGV4fS54eS1mZWF0aGVyLWNyZXN0W2RhdGEtdi05MThiNDEzZl17Y29sb3I6dmFyKC0teHktZ29sZC00MDApO29wYWNpdHk6Ljg7Zm9udC1zaXplOjEwcHh9Lnh5LWZlYXRoZXItbmFtZVtkYXRhLXYtOTE4YjQxM2Zde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2xldHRlci1zcGFjaW5nOi4wOGVtO2NvbG9yOnZhcigtLXh5LWN5YW4tMTAwKTt3aGl0ZS1zcGFjZTpub3dyYXA7dGV4dC1vdmVyZmxvdzplbGxpcHNpcztmb250LXNpemU6MTVweDtmb250LXdlaWdodDo2MDA7b3ZlcmZsb3c6aGlkZGVufS5mZWF0aGVyLWVuZW15IC54eS1mZWF0aGVyLW5hbWVbZGF0YS12LTkxOGI0MTNmXXtjb2xvcjojZmVkN2FhfS54eS13aW5nLWZlYXRoZXIuaXMtc2VsZWN0ZWQgLnh5LWZlYXRoZXItbmFtZVtkYXRhLXYtOTE4YjQxM2Zde2NvbG9yOiNmZmY7dGV4dC1zaGFkb3c6MCAwIDEycHggdmFyKC0teHktZ29sZC0zMDApfS54eS1mZWF0aGVyLWJhZGdlW2RhdGEtdi05MThiNDEzZl17Zm9udC1zaXplOjEwcHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtiYWNrZ3JvdW5kOiNmZmZmZmYxNDtib3JkZXItcmFkaXVzOjRweDtwYWRkaW5nOjJweCA3cHh9LmZlYXRoZXItcGxheWVyIC54eS1mZWF0aGVyLWJhZGdlW2RhdGEtdi05MThiNDEzZl17Y29sb3I6dmFyKC0teHktY3lhbi0zMDApO2JhY2tncm91bmQ6IzM4YmRmODI2fS5mZWF0aGVyLWVuZW15IC54eS1mZWF0aGVyLWJhZGdlW2RhdGEtdi05MThiNDEzZl17Y29sb3I6dmFyKC0teHktY3JpbXNvbi0zMDApO2JhY2tncm91bmQ6I2Y0M2Y1ZTI2fS54eS1mZWF0aGVyLWxvY2tbZGF0YS12LTkxOGI0MTNmXXtmb250LXNpemU6MTJweH0ueHktd2luZ3MtZW1wdHlbZGF0YS12LTkxOGI0MTNmXXt0ZXh0LWFsaWduOmNlbnRlcjtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtib3JkZXI6MXB4IGRhc2hlZCAjZmZmZmZmMWE7Ym9yZGVyLXJhZGl1czoxMHB4O3BhZGRpbmc6MjBweDtmb250LXNpemU6MTJweDtmb250LXN0eWxlOml0YWxpY30ueHktZmlnaHRlci16b25lW2RhdGEtdi00ZTUyNWJhZl17ZmxleC1kaXJlY3Rpb246Y29sdW1uO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2dhcDoxMnB4O2hlaWdodDoxMDAlO21pbi1oZWlnaHQ6MDtkaXNwbGF5OmZsZXh9Lnh5LWJ1ZmYtYm94LWxhbmVbZGF0YS12LTRlNTI1YmFmXXtmbGV4LXNocmluazowO3dpZHRoOjEwMCV9Lnh5LWJ1ZmYtY2FyZFtkYXRhLXYtNGU1MjViYWZde2JvcmRlcjoxcHggc29saWQgdmFyKC0teHktYm9yZGVyLXN1YnRsZSk7YmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweCk7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMwZTFjMzBjYyAwJSwjMDYwZTFhZTYgMTAwJSk7Ym9yZGVyLXJhZGl1czo4cHg7cGFkZGluZzo4cHggMTRweDtib3gtc2hhZG93OjAgNHB4IDE0cHggIzAwMDAwMDU5fS5idWZmLXBsYXllcltkYXRhLXYtNGU1MjViYWZde2JvcmRlci1jb2xvcjojMzhiZGY4NDB9LmJ1ZmYtZW5lbXlbZGF0YS12LTRlNTI1YmFmXXtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzIwMGUxNmNjIDAlLCMwZTA2MGFlNiAxMDAlKTtib3JkZXItY29sb3I6I2Y0M2Y1ZTQwfS54eS1idWZmLWhlYWRlcltkYXRhLXYtNGU1MjViYWZde2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O21hcmdpbi1ib3R0b206NnB4O2Rpc3BsYXk6ZmxleH0ueHktYnVmZi1pY29uW2RhdGEtdi00ZTUyNWJhZl17Zm9udC1zaXplOjExcHh9LmJ1ZmYtcGxheWVyIC54eS1idWZmLWljb25bZGF0YS12LTRlNTI1YmFmXXtjb2xvcjp2YXIoLS14eS1jeWFuLTQwMCl9LmJ1ZmYtZW5lbXkgLnh5LWJ1ZmYtaWNvbltkYXRhLXYtNGU1MjViYWZde2NvbG9yOnZhcigtLXh5LWNyaW1zb24tNDAwKX0ueHktYnVmZi10aXRsZVtkYXRhLXYtNGU1MjViYWZde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2xldHRlci1zcGFjaW5nOi4wOGVtO2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO2ZvbnQtc2l6ZToxMXB4fS54eS1idWZmLWNvbnRlbnRbZGF0YS12LTRlNTI1YmFmXXthbGlnbi1pdGVtczpjZW50ZXI7bWluLWhlaWdodDoyNHB4O2Rpc3BsYXk6ZmxleH0ueHktYnVmZi1iYWRnZXNbZGF0YS12LTRlNTI1YmFmXXtmbGV4LXdyYXA6d3JhcDtnYXA6NnB4O2Rpc3BsYXk6ZmxleH0ueHktYnVmZi1waWxsW2RhdGEtdi00ZTUyNWJhZl17Y29sb3I6dmFyKC0teHktY3lhbi0yMDApO2JhY2tncm91bmQ6IzBlYTVlOTFmO2JvcmRlcjoxcHggc29saWQgIzM4YmRmODRkO2JvcmRlci1yYWRpdXM6NHB4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NXB4O3BhZGRpbmc6MnB4IDhweDtmb250LXNpemU6MTFweDtkaXNwbGF5OmlubGluZS1mbGV4fS5idWZmLWVuZW15IC54eS1idWZmLXBpbGxbZGF0YS12LTRlNTI1YmFmXXtjb2xvcjp2YXIoLS14eS1jcmltc29uLTMwMCk7YmFja2dyb3VuZDojZjQzZjVlMWY7Ym9yZGVyLWNvbG9yOiNmNDNmNWU1OX0ueHktcGlsbC1kb3RbZGF0YS12LTRlNTI1YmFmXXtiYWNrZ3JvdW5kOmN1cnJlbnRDb2xvcjtib3JkZXItcmFkaXVzOjUwJTt3aWR0aDo0cHg7aGVpZ2h0OjRweH0ueHktcGlsbC1yb3VuZFtkYXRhLXYtNGU1MjViYWZde2ZvbnQtc2l6ZTo5cHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtvcGFjaXR5Oi44fS54eS1idWZmLWVtcHR5W2RhdGEtdi00ZTUyNWJhZl17Y29sb3I6dmFyKC0teHktdGV4dC1oaW50KTtmb250LXNpemU6MTFweDtmb250LXN0eWxlOml0YWxpY30ueHktem9uZS1taWRkbGVbZGF0YS12LTRlNTI1YmFmXXtmbGV4OjE7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciAyNzBweDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjE2cHg7bWluLWhlaWdodDowO2Rpc3BsYXk6Z3JpZDtwb3NpdGlvbjpyZWxhdGl2ZX0uem9uZS1lbmVteSAueHktem9uZS1taWRkbGVbZGF0YS12LTRlNTI1YmFmXXtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MjcwcHggMWZyfS54eS1maWd1cmUtd3JhcHBlcltkYXRhLXYtNGU1MjViYWZdLC54eS13aW5ncy13cmFwcGVyW2RhdGEtdi00ZTUyNWJhZl17anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7aGVpZ2h0OjEwMCU7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlfS54eS1pbmZvLWJveC1sYW5lW2RhdGEtdi00ZTUyNWJhZl17ZmxleC1zaHJpbms6MDt3aWR0aDoxMDAlfS54eS1jaGFyYWN0ZXItaW5mby1jYXJkW2RhdGEtdi00ZTUyNWJhZl17Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS14eS1ib3JkZXItZ29sZCk7YmFja2Ryb3AtZmlsdGVyOmJsdXIoMjBweCk7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMwZTFjMzBlNiAwJSwjMDYwZTFhZjIgMTAwJSk7Ym9yZGVyLXJhZGl1czoxMHB4O3BhZGRpbmc6MTJweCAxOHB4O2JveC1zaGFkb3c6MCA4cHggMjRweCAjMDAwNixpbnNldCAwIDFweCAjZmJiZjI0MWZ9LmluZm8tcGxheWVyW2RhdGEtdi00ZTUyNWJhZl17Ym9yZGVyLWNvbG9yOiNmYmJmMjQ1OX0uaW5mby1lbmVteVtkYXRhLXYtNGU1MjViYWZde2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMjAwZTE2ZTYgMCUsIzBlMDYwYWYyIDEwMCUpO2JvcmRlci1jb2xvcjojZjQzZjVlNGR9Lnh5LWluZm8tdG9wW2RhdGEtdi00ZTUyNWJhZl17anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO21hcmdpbi1ib3R0b206NnB4O2Rpc3BsYXk6ZmxleH0ueHktaW5mby10aXRsZS1ncm91cFtkYXRhLXYtNGU1MjViYWZde2FsaWduLWl0ZW1zOmJhc2VsaW5lO2dhcDo4cHg7ZGlzcGxheTpmbGV4fS54eS1zaWRlLWtpY2tlcltkYXRhLXYtNGU1MjViYWZde2ZvbnQtc2l6ZTo5cHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtsZXR0ZXItc3BhY2luZzouMTRlbTtjb2xvcjp2YXIoLS14eS1nb2xkLTQwMCl9LmluZm8tZW5lbXkgLnh5LXNpZGUta2lja2VyW2RhdGEtdi00ZTUyNWJhZl17Y29sb3I6dmFyKC0teHktY3JpbXNvbi00MDApfS54eS1hY3Rvci1uYW1lW2RhdGEtdi00ZTUyNWJhZl17Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7bGV0dGVyLXNwYWNpbmc6LjA2ZW07Y29sb3I6dmFyKC0teHktdGV4dC10aXRsZSk7bWFyZ2luOjA7Zm9udC1zaXplOjE4cHg7Zm9udC13ZWlnaHQ6NjAwfS54eS1hY3Rvci1pZFtkYXRhLXYtNGU1MjViYWZde2ZvbnQtc2l6ZToxMHB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktdGV4dC1oaW50KX0ueHktdGFyZ2V0LXN3aXRjaGVyc1tkYXRhLXYtNGU1MjViYWZde2dhcDo1cHg7ZGlzcGxheTpmbGV4fS54eS1zd2l0Y2gtYnRuW2RhdGEtdi00ZTUyNWJhZl17LXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6Ymx1cigxMnB4KTtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZmZmZjE0IDAlLCNmZmZmZmYwNSAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYyNDtib3JkZXItcmFkaXVzOjk5OXB4O3BhZGRpbmc6M3B4IDEwcHg7Zm9udC1zaXplOjEwcHg7dHJhbnNpdGlvbjphbGwgLjI0cyBjdWJpYy1iZXppZXIoLjE2LDEsLjMsMSk7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxcHggI2ZmZjMsMCAycHggOHB4ICMwMDAwMDA0MH0ueHktc3dpdGNoLWJ0bltkYXRhLXYtNGU1MjViYWZdOmhvdmVye2NvbG9yOiNmY2E1YTU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmNDNmNWUzMyAwJSwjZTExZDQ4MTQgMTAwJSk7Ym9yZGVyLWNvbG9yOiNmNDNmNWU2Njt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KTtib3gtc2hhZG93Omluc2V0IDAgMXB4IDEuNXB4ICNmZmZmZmY1OSwwIDRweCAxMnB4ICNmNDNmNWU0ZH0ueHktc3dpdGNoLWJ0bi5hY3RpdmVbZGF0YS12LTRlNTI1YmFmXXtib3JkZXItY29sb3I6dmFyKC0teHktY3JpbXNvbi00MDApO2NvbG9yOiNmZmY7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmNDNmNWU1OSAwJSwjZTExZDQ4MjYgMTAwJSk7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxLjVweCAjZmZmNiwwIDAgMTZweCAjZjQzZjVlNTl9Lnh5LXRyYWl0cy1yb3dbZGF0YS12LTRlNTI1YmFmXXtmbGV4LXdyYXA6d3JhcDtnYXA6OHB4IDE0cHg7bWFyZ2luLWJvdHRvbTo2cHg7Zm9udC1zaXplOjExcHg7ZGlzcGxheTpmbGV4fS54eS10cmFpdC1pdGVtW2RhdGEtdi00ZTUyNWJhZl17Z2FwOjVweDtkaXNwbGF5OmlubGluZS1mbGV4fS54eS10cmFpdC1rW2RhdGEtdi00ZTUyNWJhZl17Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCk7Zm9udC13ZWlnaHQ6NTAwfS54eS10cmFpdC12W2RhdGEtdi00ZTUyNWJhZl17Y29sb3I6dmFyKC0teHktY3lhbi0yMDApfS5pbmZvLWVuZW15IC54eS10cmFpdC12W2RhdGEtdi00ZTUyNWJhZl17Y29sb3I6I2ZlZDdhYX0ueHktdHJhaXQtbm9uZVtkYXRhLXYtNGU1MjViYWZde2NvbG9yOnZhcigtLXh5LXRleHQtaGludCk7Zm9udC1zaXplOjExcHg7Zm9udC1zdHlsZTppdGFsaWN9Lnh5LXJlc291cmNlcy1yb3dbZGF0YS12LTRlNTI1YmFmXXtib3JkZXItdG9wOjFweCBkYXNoZWQgI2ZmZmZmZjE0O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O3BhZGRpbmctdG9wOjZweDtkaXNwbGF5OmZsZXh9Lnh5LXJlcy1sYWJlbFtkYXRhLXYtNGU1MjViYWZde2ZvbnQtc2l6ZToxMHB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCl9Lnh5LXJlcy1jaGlwc1tkYXRhLXYtNGU1MjViYWZde2dhcDo2cHg7ZGlzcGxheTpmbGV4fS54eS1yZXMtdGFnW2RhdGEtdi00ZTUyNWJhZl17Zm9udC1zaXplOjEwcHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCk7YmFja2dyb3VuZDojZmZmZmZmMGY7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmMTQ7Ym9yZGVyLXJhZGl1czo0cHg7cGFkZGluZzoxcHggNnB4fS54eS1oYXJtb25pYy1nYXVnZVtkYXRhLXYtZWQ3NzkyM2Zde3VzZXItc2VsZWN0Om5vbmU7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7bWluLXdpZHRoOjEwMHB4O2Rpc3BsYXk6ZmxleH0ueHktZ2F1Z2Utcm91bmRbZGF0YS12LWVkNzc5MjNmXXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7bGluZS1oZWlnaHQ6MS4xO2Rpc3BsYXk6ZmxleH0ueHktcm91bmQtcm9tYW5bZGF0YS12LWVkNzc5MjNmXXtsZXR0ZXItc3BhY2luZzouMjJlbTtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtmb250LXNpemU6OHB4fS54eS1yb3VuZC1udW1bZGF0YS12LWVkNzc5MjNmXXtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCk7dGV4dC1zaGFkb3c6MCAwIDEwcHggdmFyKC0teHktZ29sZC1nbG93KTtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo2MDB9Lnh5LXdhdmUtcmVzb25hdG9yW2RhdGEtdi1lZDc3OTIzZl17d2lkdGg6OTBweDtoZWlnaHQ6MjhweH0ueHktd2F2ZS1zdmdbZGF0YS12LWVkNzc5MjNmXXt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO292ZXJmbG93OnZpc2libGV9Lnh5LXNpbmUtcGF0aC5wMVtkYXRhLXYtZWQ3NzkyM2Zde2FuaW1hdGlvbjozcyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGUgc2luZS13YXZlLXB1bHNlLWVkNzc5MjNmfS54eS1zaW5lLXBhdGgucDJbZGF0YS12LWVkNzc5MjNmXXthbmltYXRpb246Mi4ycyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGUtcmV2ZXJzZSBzaW5lLXdhdmUtcHVsc2UtZWQ3NzkyM2Z9QGtleWZyYW1lcyBzaW5lLXdhdmUtcHVsc2UtZWQ3NzkyM2Z7MCV7dHJhbnNmb3JtOnNjYWxlWSguNyl9dG97dHJhbnNmb3JtOnNjYWxlWSgxLjMpfX0ueHktY2VudGVyLW5vZGVbZGF0YS12LWVkNzc5MjNmXXthbmltYXRpb246MnMgaW5maW5pdGUgeHktcHVsc2UtZ2xvd30ueHktdnMtZW1ibGVtW2RhdGEtdi1lZDc3OTIzZl17Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS14eS1ib3JkZXItZ29sZCk7d2lkdGg6NDRweDtoZWlnaHQ6NDRweDtib3gtc2hhZG93OjAgMCAxNnB4IHZhcigtLXh5LWdvbGQtZ2xvdyksIDAgNHB4IDEycHggIzAwMDAwMDgwO2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCAzNSUgMzUlLCMxOTJkNGJlNiwjMDgxMDFjZjIpO2JvcmRlci1yYWRpdXM6NTAlO2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZX0ueHktdnMtdGV4dFtkYXRhLXYtZWQ3NzkyM2Zde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2xldHRlci1zcGFjaW5nOi4wOGVtO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjZmVmMDhhIDAlLCNmNTllMGIgNjAlLCNkOTc3MDYgMTAwJSk7LXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6dHJhbnNwYXJlbnQ7dGV4dC1zaGFkb3c6MCAwIDhweCAjZmJiZjI0NGQ7LXdlYmtpdC1iYWNrZ3JvdW5kLWNsaXA6dGV4dDtmb250LXNpemU6MThweDtmb250LXdlaWdodDo3MDB9Lnh5LXZzLWF1cmFbZGF0YS12LWVkNzc5MjNmXXtib3JkZXI6MXB4IGRhc2hlZCAjZmJiZjI0NGQ7Ym9yZGVyLXJhZGl1czo1MCU7YW5pbWF0aW9uOjIwcyBsaW5lYXIgaW5maW5pdGUgdnMtcm90YXRlLWVkNzc5MjNmO3Bvc2l0aW9uOmFic29sdXRlO2luc2V0Oi0zcHh9QGtleWZyYW1lcyB2cy1yb3RhdGUtZWQ3NzkyM2Z7MCV7dHJhbnNmb3JtOnJvdGF0ZSgwKX10b3t0cmFuc2Zvcm06cm90YXRlKDM2MGRlZyl9fS54eS1kb21pbmFuY2UtcGlsbFtkYXRhLXYtZWQ3NzkyM2Zde2ZvbnQtc2l6ZToxMHB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2Fucyk7bGV0dGVyLXNwYWNpbmc6LjA4ZW07d2hpdGUtc3BhY2U6bm93cmFwO2JhY2tncm91bmQ6I2ZmZmZmZjBhO2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjE0O2JvcmRlci1yYWRpdXM6OTk5cHg7cGFkZGluZzozcHggMTBweH0uZG9tLW5ldXRyYWxbZGF0YS12LWVkNzc5MjNmXXtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCk7Ym9yZGVyLWNvbG9yOiNmYmJmMjQ0MH0uZG9tLXBsYXllcltkYXRhLXYtZWQ3NzkyM2Zde2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKTt0ZXh0LXNoYWRvdzowIDAgOHB4IHZhcigtLXh5LWN5YW4tZ2xvdyk7YmFja2dyb3VuZDojMzhiZGY4MTQ7Ym9yZGVyLWNvbG9yOiMzOGJkZjg1OX0uZG9tLWVuZW15W2RhdGEtdi1lZDc3OTIzZl17Y29sb3I6dmFyKC0teHktY3JpbXNvbi0zMDApO3RleHQtc2hhZG93OjAgMCA4cHggdmFyKC0teHktY3JpbXNvbi1nbG93KTtiYWNrZ3JvdW5kOiNmNDNmNWUxNDtib3JkZXItY29sb3I6I2Y0M2Y1ZTU5fS54eS1jZW50ZXItc3RhZ2VbZGF0YS12LTRiOTBkMjliXXtib3JkZXI6MXB4IHNvbGlkIHZhcigtLXh5LWJvcmRlci1zdWJ0bGUpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDI0cHgpO3VzZXItc2VsZWN0Om5vbmU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoIzBhMTYyNmYyIDAlLCMwNTBjMTZmYSAxMDAlKTtib3JkZXItcmFkaXVzOjEycHg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2hlaWdodDoxMDAlO21pbi1oZWlnaHQ6MDtkaXNwbGF5OmZsZXg7b3ZlcmZsb3c6aGlkZGVuO2JveC1zaGFkb3c6MCAxNnB4IDQ4cHggIzAwMDksaW5zZXQgMCAxcHggI2ZmZmZmZjE0fS54eS1jZW50ZXItaGVhZFtkYXRhLXYtNGI5MGQyOWJde2JhY2tncm91bmQ6IzA3MTAxZTgwO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNmZmZmZmYwZjtmbGV4LWRpcmVjdGlvbjpjb2x1bW47ZmxleC1zaHJpbms6MDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtwYWRkaW5nOjEycHggMTZweCA4cHg7ZGlzcGxheTpmbGV4fS54eS1waWxsYXItY3Jlc3RbZGF0YS12LTRiOTBkMjliXXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtsZXR0ZXItc3BhY2luZzouMTRlbTtjb2xvcjp2YXIoLS14eS1nb2xkLTQwMCk7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7Zm9udC1zaXplOjExcHg7ZGlzcGxheTpmbGV4fS54eS1waWxsYXItY3Jlc3QtZG90W2RhdGEtdi00YjkwZDI5Yl17Zm9udC1zaXplOjEzcHh9Lnh5LWNlbnRlci13ZWF0aGVyW2RhdGEtdi00YjkwZDI5Yl17Y29sb3I6dmFyKC0teHktY3lhbi0yMDApO2JhY2tncm91bmQ6IzM4YmRmODE0O2JvcmRlcjoxcHggc29saWQgIzM4YmRmODI5O2JvcmRlci1yYWRpdXM6OTk5cHg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7cGFkZGluZzoycHggMTBweDtmb250LXNpemU6MTBweDtkaXNwbGF5OmlubGluZS1mbGV4fS54eS13ZWF0aGVyLWRvdFtkYXRhLXYtNGI5MGQyOWJde2NvbG9yOnZhcigtLXh5LWN5YW4tNDAwKTtmb250LXNpemU6NnB4fS54eS1jZW50ZXItYm9keVtkYXRhLXYtNGI5MGQyOWJde2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtmbGV4OjE7Z2FwOjEycHg7bWluLWhlaWdodDowO3BhZGRpbmc6MTJweCAxNnB4O2Rpc3BsYXk6ZmxleDtvdmVyZmxvdy15OmF1dG99Lnh5LXRlcm0tc2Nyb2xsLXZpZXdbZGF0YS12LTRiOTBkMjliXXthbmltYXRpb246dmlldy1pbi00YjkwZDI5YiAuMnMgdmFyKC0teHktZWFzZS1vdXQtZXhwbyk7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoxMHB4O2Rpc3BsYXk6ZmxleH0ueHktc2Nyb2xsLXRvcC1iYXJbZGF0YS12LTRiOTBkMjliXXtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7ZGlzcGxheTpmbGV4fS54eS1zY3JvbGwtYmFkZ2VbZGF0YS12LTRiOTBkMjliXXtmb250LXNpemU6MTBweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjp2YXIoLS14eS1nb2xkLTQwMCk7Z2FwOjVweDtkaXNwbGF5OmZsZXh9Lnh5LXNjcm9sbC1jbG9zZS1idG5bZGF0YS12LTRiOTBkMjliXXtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOjAgMDtib3JkZXI6MDtwYWRkaW5nOjJweCA2cHg7Zm9udC1zaXplOjE0cHh9Lnh5LXNjcm9sbC1jbG9zZS1idG5bZGF0YS12LTRiOTBkMjliXTpob3Zlcntjb2xvcjp2YXIoLS14eS1jcmltc29uLTQwMCl9Lnh5LXNjcm9sbC10ZWNoLXRpdGxlW2RhdGEtdi00YjkwZDI5Yl17Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7bGV0dGVyLXNwYWNpbmc6LjA2ZW07anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO21hcmdpbjowO2ZvbnQtc2l6ZToxOHB4O2ZvbnQtd2VpZ2h0OjYwMDtkaXNwbGF5OmZsZXh9Lnh5LXRlY2gtbmFtZS1nbG93W2RhdGEtdi00YjkwZDI5Yl17YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmZmYgMCUsI2JhZTZmZCA2MCUsIzM4YmRmOCAxMDAlKTstd2Via2l0LXRleHQtZmlsbC1jb2xvcjp0cmFuc3BhcmVudDstd2Via2l0LWJhY2tncm91bmQtY2xpcDp0ZXh0fS54eS1icmFja2V0W2RhdGEtdi00YjkwZDI5Yl17Y29sb3I6dmFyKC0teHktY3lhbi00MDApO29wYWNpdHk6LjZ9Lnh5LXRlY2gtc3RhdHVzLWNoaXBbZGF0YS12LTRiOTBkMjliXXtmb250LXNpemU6MTBweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2JvcmRlci1yYWRpdXM6OTk5cHg7cGFkZGluZzoycHggN3B4fS5zdGF0dXMtcGFzc1tkYXRhLXYtNGI5MGQyOWJde2NvbG9yOnZhcigtLXh5LWphZGUtMzAwKTtiYWNrZ3JvdW5kOiMyZGQ0YmYyNjtib3JkZXI6MXB4IHNvbGlkICMyZGQ0YmY2Nn0uc3RhdHVzLWZhaWxbZGF0YS12LTRiOTBkMjliXXtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCk7YmFja2dyb3VuZDojZmJiZjI0MjY7Ym9yZGVyOjFweCBzb2xpZCAjZmJiZjI0NjZ9LnN0YXR1cy1vYnNlcnZlW2RhdGEtdi00YjkwZDI5Yl17Y29sb3I6dmFyKC0teHktY3JpbXNvbi0zMDApO2JhY2tncm91bmQ6I2Y0M2Y1ZTI2O2JvcmRlcjoxcHggc29saWQgI2Y0M2Y1ZTY2fS54eS1zY3JvbGwtcXVvdGVbZGF0YS12LTRiOTBkMjliXXtib3JkZXItbGVmdDoycHggc29saWQgdmFyKC0teHktZ29sZC00MDApO2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LWN5YW4tMTAwKTtiYWNrZ3JvdW5kOiNmYmJmMjQwZDtib3JkZXItcmFkaXVzOjAgNnB4IDZweCAwO21hcmdpbjowO3BhZGRpbmc6OHB4IDEycHg7Zm9udC1zaXplOjEycHg7bGluZS1oZWlnaHQ6MS42fS54eS1zY3JvbGwtZGV0YWlsc1tkYXRhLXYtNGI5MGQyOWJde2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O2Rpc3BsYXk6ZmxleH0ueHktZGV0YWlsLWJsb2NrW2RhdGEtdi00YjkwZDI5Yl17YmFja2dyb3VuZDojMDcxMDFlOTk7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmMGY7Ym9yZGVyLXJhZGl1czo2cHg7cGFkZGluZzo4cHggMTBweH0ueHktZGV0YWlsLWxhYmVsW2RhdGEtdi00YjkwZDI5Yl17Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y29sb3I6dmFyKC0teHktZ29sZC0zMDApO21hcmdpbi1ib3R0b206NHB4O2ZvbnQtc2l6ZToxMHB4O2Rpc3BsYXk6YmxvY2t9Lnh5LWRldGFpbC1saXN0W2RhdGEtdi00YjkwZDI5Yl17Y29sb3I6dmFyKC0teHktdGV4dC1ib2R5KTttYXJnaW46MDtwYWRkaW5nLWxlZnQ6MTRweDtmb250LXNpemU6MTFweDtsaW5lLWhlaWdodDoxLjV9Lnh5LWNvbmQtdGV4dFtkYXRhLXYtNGI5MGQyOWJde21hcmdpbjowO2ZvbnQtc2l6ZToxMXB4fS54eS1jb25kLXRleHQucGFzc1tkYXRhLXYtNGI5MGQyOWJde2NvbG9yOnZhcigtLXh5LWphZGUtMzAwKX0ueHktY29uZC10ZXh0LmZhaWxbZGF0YS12LTRiOTBkMjliXXtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCl9Lnh5LXJ1bGUtdGFnc1tkYXRhLXYtNGI5MGQyOWJde2ZsZXgtd3JhcDp3cmFwO2dhcDo0cHg7ZGlzcGxheTpmbGV4fS54eS1ydWxlLXRhZ1tkYXRhLXYtNGI5MGQyOWJde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktY3lhbi0yMDApO2JhY2tncm91bmQ6IzM4YmRmODI2O2JvcmRlcjoxcHggc29saWQgIzM4YmRmODRkO2JvcmRlci1yYWRpdXM6M3B4O3BhZGRpbmc6MXB4IDVweDtmb250LXNpemU6OXB4fS54eS1zY3JvbGwtYWN0aW9uW2RhdGEtdi00YjkwZDI5Yl17bWFyZ2luLXRvcDo0cHh9Lnh5LXBpY2stdGVjaC1idG5bZGF0YS12LTRiOTBkMjliXXtib3JkZXI6MXB4IHNvbGlkIHZhcigtLXh5LWN5YW4tNDAwKTtjb2xvcjojZmZmO3dpZHRoOjEwMCU7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y3Vyc29yOnBvaW50ZXI7Ym94LXNoYWRvdzowIDRweCAxMnB4IHZhcigtLXh5LWN5YW4tZ2xvdyk7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMwMjg0YzdjYyAwJSwjMDM2OWExZTYgMTAwJSk7Ym9yZGVyLXJhZGl1czo2cHg7anVzdGlmeS1jb250ZW50OmNlbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtwYWRkaW5nOjhweCAxNHB4O2ZvbnQtc2l6ZToxMnB4O2ZvbnQtd2VpZ2h0OjUwMDt0cmFuc2l0aW9uOmFsbCAuMnM7ZGlzcGxheTpmbGV4fS54eS1waWNrLXRlY2gtYnRuW2RhdGEtdi00YjkwZDI5Yl06aG92ZXJ7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMwMjg0YzcgMCUsIzAzNjlhMSAxMDAlKTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KX0ueHktc2l0dWF0aW9uLXZpZXdbZGF0YS12LTRiOTBkMjliXXtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjEwcHg7ZGlzcGxheTpmbGV4fS54eS1wb3NpdGlvbnMtY2FyZFtkYXRhLXYtNGI5MGQyOWJde2JhY2tncm91bmQ6IzA3MTAxZTk5O2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjE0O2JvcmRlci1yYWRpdXM6OHB4O3BhZGRpbmc6MTBweCAxMnB4fS54eS1wb3MtaGVhZGVyW2RhdGEtdi00YjkwZDI5Yl17Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7bGV0dGVyLXNwYWNpbmc6LjFlbTtjb2xvcjp2YXIoLS14eS1nb2xkLTQwMCk7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo1cHg7bWFyZ2luLWJvdHRvbTo4cHg7Zm9udC1zaXplOjEwcHg7ZGlzcGxheTpmbGV4fS54eS1wb3MtY2xhc2hbZGF0YS12LTRiOTBkMjliXXtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7ZGlzcGxheTpmbGV4fS54eS1wb3Mtbm9kZVtkYXRhLXYtNGI5MGQyOWJde2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjJweDtkaXNwbGF5OmZsZXh9Lnh5LW5vZGUtbmFtZVtkYXRhLXYtNGI5MGQyOWJde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO2ZvbnQtc2l6ZToxMHB4fS54eS1ub2RlLXZhbFtkYXRhLXYtNGI5MGQyOWJde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OjUwMH0ueHktcG9zLW5vZGUucGxheWVyIC54eS1ub2RlLXZhbFtkYXRhLXYtNGI5MGQyOWJde2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKX0ueHktcG9zLW5vZGUuZW5lbXkgLnh5LW5vZGUtdmFsW2RhdGEtdi00YjkwZDI5Yl17Y29sb3I6dmFyKC0teHktY3JpbXNvbi00MDApfS54eS1wb3MtYnJpZGdlW2RhdGEtdi00YjkwZDI5Yl17ZmxleC1kaXJlY3Rpb246Y29sdW1uO2ZsZXg6MTthbGlnbi1pdGVtczpjZW50ZXI7cGFkZGluZzowIDEycHg7ZGlzcGxheTpmbGV4fS54eS1icmlkZ2UtZGlzdFtkYXRhLXYtNGI5MGQyOWJde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktZ29sZC0zMDApO21hcmdpbi1ib3R0b206M3B4O2ZvbnQtc2l6ZTo5cHh9Lnh5LWJyaWRnZS1saW5lW2RhdGEtdi00YjkwZDI5Yl17b3BhY2l0eTouNjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCg5MGRlZywjMzhiZGY4IDAlLCNmYmJmMjQgNTAlLCNmYjcxODUgMTAwJSk7d2lkdGg6MTAwJTtoZWlnaHQ6MXB4fS54eS1zZW1hbnRpYy1ncmlkW2RhdGEtdi00YjkwZDI5Yl17Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgzLDFmcik7Z2FwOjZweDtkaXNwbGF5OmdyaWR9Lnh5LXNlbS1jYXJkW2RhdGEtdi00YjkwZDI5Yl17YmFja2dyb3VuZDojZmZmZmZmMDg7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmMGY7Ym9yZGVyLXJhZGl1czo0cHg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MnB4O3BhZGRpbmc6NXB4IDZweDtkaXNwbGF5OmZsZXh9Lnh5LXNlbS1jYXJkLmFjdGl2ZVtkYXRhLXYtNGI5MGQyOWJde2JhY2tncm91bmQ6IzJkZDRiZjE0O2JvcmRlci1jb2xvcjojMmRkNGJmNGR9Lnh5LXNlbS1rW2RhdGEtdi00YjkwZDI5Yl17Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCk7Zm9udC1zaXplOjlweH0ueHktc2VtLXZbZGF0YS12LTRiOTBkMjliXXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2NvbG9yOnZhcigtLXh5LXRleHQtYm9keSk7Zm9udC1zaXplOjEwcHh9Lnh5LXNlbS1jYXJkLmFjdGl2ZSAueHktc2VtLXZbZGF0YS12LTRiOTBkMjliXXtjb2xvcjp2YXIoLS14eS1qYWRlLTMwMCl9Lnh5LXZlcmRpY3QtY2FyZFtkYXRhLXYtNGI5MGQyOWJde2JhY2tncm91bmQ6IzA3MTAxZTk5O2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjE0O2JvcmRlci1yYWRpdXM6OHB4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4O3BhZGRpbmc6MTBweCAxMnB4O2Rpc3BsYXk6ZmxleH0ueHktdmVyZGljdC1oZWFkZXJbZGF0YS12LTRiOTBkMjliXXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjp2YXIoLS14eS1nb2xkLTQwMCk7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2ZvbnQtc2l6ZToxMXB4O2Rpc3BsYXk6ZmxleH0ueHktdmVyZGljdC1yb3VuZFtkYXRhLXYtNGI5MGQyOWJde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCk7Zm9udC1zaXplOjlweH0ueHktdmVyZGljdC1ib2R5W2RhdGEtdi00YjkwZDI5Yl17Y29sb3I6dmFyKC0teHktdGV4dC1ib2R5KTtmb250LXNpemU6MTFweDtsaW5lLWhlaWdodDoxLjV9Lnh5LXZlcmRpY3QtYWN0aW9uW2RhdGEtdi00YjkwZDI5Yl17Y29sb3I6dmFyKC0teHktY3lhbi0yMDApO21hcmdpbjowIDAgNHB4fS54eS12ZXJkaWN0LXByb3NlIHBbZGF0YS12LTRiOTBkMjliXXtjb2xvcjojZTJlOGYwO21hcmdpbjowfS54eS12ZXJkaWN0LXN1bW1hcnlbZGF0YS12LTRiOTBkMjliXXtjb2xvcjojY2JkNWUxO21hcmdpbjowfS54eS12ZXJkaWN0LWF3YWl0W2RhdGEtdi00YjkwZDI5Yl17Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCk7bWFyZ2luOjA7Zm9udC1zdHlsZTppdGFsaWN9Lnh5LXZlcmRpY3QtZW1wdHlbZGF0YS12LTRiOTBkMjliXXtjb2xvcjp2YXIoLS14eS10ZXh0LWhpbnQpO3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmc6MTBweCAwO2ZvbnQtc2l6ZToxMXB4O2ZvbnQtc3R5bGU6aXRhbGljfS54eS12aWV3LXRpbWVsaW5lLWJ0bltkYXRhLXYtNGI5MGQyOWJde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO2N1cnNvcjpwb2ludGVyO3RleHQtYWxpZ246Y2VudGVyO2JhY2tncm91bmQ6I2ZmZmZmZjBhO2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjE0O2JvcmRlci1yYWRpdXM6NnB4O3BhZGRpbmc6NnB4IDEycHg7Zm9udC1zaXplOjExcHg7dHJhbnNpdGlvbjphbGwgLjJzfS54eS12aWV3LXRpbWVsaW5lLWJ0bltkYXRhLXYtNGI5MGQyOWJdOmhvdmVye2NvbG9yOnZhcigtLXh5LWN5YW4tMjAwKTtiYWNrZ3JvdW5kOiMzOGJkZjgxYTtib3JkZXItY29sb3I6IzM4YmRmODRkfS54eS1jZW50ZXItZm9vdGVyW2RhdGEtdi00YjkwZDI5Yl17Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCk7YmFja2dyb3VuZDojMDQwOTEyOTk7Ym9yZGVyLXRvcDoxcHggc29saWQgI2ZmZmZmZjBmO2ZsZXgtc2hyaW5rOjA7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7cGFkZGluZzo4cHggMTZweDtmb250LXNpemU6MTBweDtkaXNwbGF5OmZsZXh9Lnh5LWZvb3Rlci1wdWxzZVtkYXRhLXYtNGI5MGQyOWJde2JhY2tncm91bmQ6dmFyKC0teHktY3lhbi00MDApO2JvcmRlci1yYWRpdXM6NTAlO3dpZHRoOjVweDtoZWlnaHQ6NXB4O2FuaW1hdGlvbjoycyBpbmZpbml0ZSB4eS1wdWxzZS1nbG93fUBrZXlmcmFtZXMgdmlldy1pbi00YjkwZDI5YnswJXtvcGFjaXR5OjA7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoNHB4KX10b3tvcGFjaXR5OjE7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9fS54eS1za2lsbC1tb2RhbC1iYWNrZHJvcFtkYXRhLXYtYWUzOWQ0N2Zde3otaW5kZXg6MTAwOy13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTRweCk7Ym94LXNpemluZzpib3JkZXItYm94O2JhY2tncm91bmQ6IzAyMDYwZTczO2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO3BhZGRpbmc6MjRweDtkaXNwbGF5OmZsZXg7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MH0ueHktc2tpbGwtbW9kYWwtY2FyZFtkYXRhLXYtYWUzOWQ0N2Zde2JvcmRlcjoxcHggc29saWQgdmFyKC0teHktYm9yZGVyLWdsb3cpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDMycHgpO2JveC1zaXppbmc6Ym9yZGVyLWJveDt3aWR0aDoxMDAlO21heC13aWR0aDo2NjBweDthbmltYXRpb246Y2FyZC1zcHJpbmctaW4tYWUzOWQ0N2YgLjM1cyB2YXIoLS14eS1lYXNlLW91dC1leHBvKTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxNDVkZWcsIzBlMWMzNGY1IDAlLCMwNjBlMWNmYSAxMDAlKTtib3JkZXItcmFkaXVzOjIwcHg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoxNHB4O3BhZGRpbmc6MjRweCAyOHB4O2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZTtib3gtc2hhZG93OjAgMjhweCA4MHB4ICMwMDAwMDBkOSxpbnNldCAwIDFweCAjZmZmZmZmMjYsMCAwIDQwcHggIzM4YmRmODJlfS54eS1jYXJkLWNvcm5lcltkYXRhLXYtYWUzOWQ0N2Zde3BvaW50ZXItZXZlbnRzOm5vbmU7d2lkdGg6MTJweDtoZWlnaHQ6MTJweDtwb3NpdGlvbjphYnNvbHV0ZX0ueHktY2FyZC1jb3JuZXIudG9wLWxlZnRbZGF0YS12LWFlMzlkNDdmXXtib3JkZXItdG9wOjFweCBzb2xpZCB2YXIoLS14eS1nb2xkLTQwMCk7Ym9yZGVyLWxlZnQ6MXB4IHNvbGlkIHZhcigtLXh5LWdvbGQtNDAwKTtib3JkZXItdG9wLWxlZnQtcmFkaXVzOjE0cHg7dG9wOjZweDtsZWZ0OjZweH0ueHktY2FyZC1jb3JuZXIudG9wLXJpZ2h0W2RhdGEtdi1hZTM5ZDQ3Zl17Ym9yZGVyLXRvcDoxcHggc29saWQgdmFyKC0teHktZ29sZC00MDApO2JvcmRlci1yaWdodDoxcHggc29saWQgdmFyKC0teHktZ29sZC00MDApO2JvcmRlci10b3AtcmlnaHQtcmFkaXVzOjE0cHg7dG9wOjZweDtyaWdodDo2cHh9Lnh5LWNhcmQtY29ybmVyLmJvdHRvbS1sZWZ0W2RhdGEtdi1hZTM5ZDQ3Zl17Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0teHktZ29sZC00MDApO2JvcmRlci1sZWZ0OjFweCBzb2xpZCB2YXIoLS14eS1nb2xkLTQwMCk7Ym9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czoxNHB4O2JvdHRvbTo2cHg7bGVmdDo2cHh9Lnh5LWNhcmQtY29ybmVyLmJvdHRvbS1yaWdodFtkYXRhLXYtYWUzOWQ0N2Zde2JvcmRlci1ib3R0b206MXB4IHNvbGlkIHZhcigtLXh5LWdvbGQtNDAwKTtib3JkZXItcmlnaHQ6MXB4IHNvbGlkIHZhcigtLXh5LWdvbGQtNDAwKTtib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czoxNHB4O2JvdHRvbTo2cHg7cmlnaHQ6NnB4fS54eS1tb2RhbC1oZWFkZXJbZGF0YS12LWFlMzlkNDdmXXtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7ZGlzcGxheTpmbGV4fS54eS1tb2RhbC1jcmVzdFtkYXRhLXYtYWUzOWQ0N2Zde2ZvbnQtc2l6ZToxMnB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LWdvbGQtMzAwKTtsZXR0ZXItc3BhY2luZzouMDhlbTthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtkaXNwbGF5OmZsZXh9Lnh5LWNyZXN0LWljb25bZGF0YS12LWFlMzlkNDdmXXtmb250LXNpemU6MTRweH0ueHktY3Jlc3Qtc2lkZVtkYXRhLXYtYWUzOWQ0N2Zde2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKTtmb250LXdlaWdodDo1MDB9Lnh5LWNyZXN0LWRvdFtkYXRhLXYtYWUzOWQ0N2Zde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpfS54eS1jcmVzdC1vcmlnaW5bZGF0YS12LWFlMzlkNDdmXXtjb2xvcjp2YXIoLS14eS1jeWFuLTEwMCl9Lnh5LW1vZGFsLWNsb3NlLWJ0bltkYXRhLXYtYWUzOWQ0N2Zdey13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweCk7d2lkdGg6MzJweDtoZWlnaHQ6MzJweDtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZmZmZjE0IDAlLCNmZmZmZmYwNSAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYyOTtib3JkZXItcmFkaXVzOjk5OXB4O2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2ZvbnQtc2l6ZToxNHB4O3RyYW5zaXRpb246YWxsIC4yNHMgY3ViaWMtYmV6aWVyKC4xNiwxLC4zLDEpO2Rpc3BsYXk6ZmxleDtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCAjZmZmZmZmNDAsMCA0cHggMTBweCAjMDAwMDAwNGR9Lnh5LW1vZGFsLWNsb3NlLWJ0bltkYXRhLXYtYWUzOWQ0N2ZdOmhvdmVye2NvbG9yOiNmY2E1YTU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmNDNmNWU0MCAwJSwjZTExZDQ4MWEgMTAwJSk7Ym9yZGVyLWNvbG9yOiNmNDNmNWU4MDt0cmFuc2Zvcm06cm90YXRlKDkwZGVnKXNjYWxlKDEuMDUpO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMS41cHggI2ZmZjYsMCA0cHggMTZweCAjZjQzZjVlNTl9Lnh5LW1vZGFsLXRpdGxlLXJvd1tkYXRhLXYtYWUzOWQ0N2Zde2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtkaXNwbGF5OmZsZXh9Lnh5LW1vZGFsLXRpdGxlW2RhdGEtdi1hZTM5ZDQ3Zl17Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7bGV0dGVyLXNwYWNpbmc6LjA2ZW07YWxpZ24taXRlbXM6YmFzZWxpbmU7bWFyZ2luOjA7Zm9udC1zaXplOjIycHg7Zm9udC13ZWlnaHQ6NjAwO2Rpc3BsYXk6ZmxleH0ueHktdGVjaC1uYW1lLWdsb3dbZGF0YS12LWFlMzlkNDdmXXtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZiAwJSwjZTBmMmZlIDUwJSwjMzhiZGY4IDEwMCUpOy13ZWJraXQtdGV4dC1maWxsLWNvbG9yOnRyYW5zcGFyZW50O3RleHQtc2hhZG93OjAgMCAyMHB4ICMzOGJkZjg2Njstd2Via2l0LWJhY2tncm91bmQtY2xpcDp0ZXh0fS54eS1icmFja2V0W2RhdGEtdi1hZTM5ZDQ3Zl17Y29sb3I6dmFyKC0teHktY3lhbi00MDApO29wYWNpdHk6LjZ9Lnh5LW1vZGFsLXN0YXR1cy1iYWRnZVtkYXRhLXYtYWUzOWQ0N2Zde2ZvbnQtc2l6ZToxMXB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Ym9yZGVyLXJhZGl1czo5OTlweDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtwYWRkaW5nOjNweCAxMHB4O2Rpc3BsYXk6aW5saW5lLWZsZXh9Lnh5LXN0YXR1cy1kb3RbZGF0YS12LWFlMzlkNDdmXXtiYWNrZ3JvdW5kOmN1cnJlbnRDb2xvcjtib3JkZXItcmFkaXVzOjUwJTt3aWR0aDo1cHg7aGVpZ2h0OjVweH0udG9uZS1lbWVyYWxkW2RhdGEtdi1hZTM5ZDQ3Zl17Y29sb3I6dmFyKC0teHktamFkZS0zMDApO2JhY2tncm91bmQ6IzJkZDRiZjI0O2JvcmRlcjoxcHggc29saWQgIzJkZDRiZjY2fS50b25lLWFtYmVyW2RhdGEtdi1hZTM5ZDQ3Zl17Y29sb3I6dmFyKC0teHktZ29sZC0zMDApO2JhY2tncm91bmQ6I2ZiYmYyNDI0O2JvcmRlcjoxcHggc29saWQgI2ZiYmYyNDY2fS50b25lLXNsYXRlW2RhdGEtdi1hZTM5ZDQ3Zl17Y29sb3I6I2NiZDVlMTtiYWNrZ3JvdW5kOiM5NGEzYjgyNDtib3JkZXI6MXB4IHNvbGlkICM5NGEzYjg1OX0ueHktbW9kYWwtYW5jaWVudC1xdW90ZVtkYXRhLXYtYWUzOWQ0N2Zde2JvcmRlci1sZWZ0OjNweCBzb2xpZCB2YXIoLS14eS1nb2xkLTQwMCk7YmFja2dyb3VuZDojZmJiZjI0MGY7Ym9yZGVyLXJhZGl1czowIDhweCA4cHggMDttYXJnaW46MDtwYWRkaW5nOjEwcHggMTZweH0ueHktcXVvdGUtdGV4dFtkYXRhLXYtYWUzOWQ0N2Zde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LWN5YW4tMTAwKTtsZXR0ZXItc3BhY2luZzouMDRlbTttYXJnaW46MDtmb250LXNpemU6MTNweDtsaW5lLWhlaWdodDoxLjZ9Lnh5LW1vZGFsLWdyaWRbZGF0YS12LWFlMzlkNDdmXXtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDIsMWZyKTtnYXA6MTJweDtkaXNwbGF5OmdyaWR9Lnh5LWdyaWQtY2VsbFtkYXRhLXYtYWUzOWQ0N2Zde2JhY2tncm91bmQ6IzA3MTAxZWIzO2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjEyO2JvcmRlci1yYWRpdXM6MTBweDtwYWRkaW5nOjEwcHggMTRweH0ueHktY2VsbC10aXRsZVtkYXRhLXYtYWUzOWQ0N2Zde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LWdvbGQtMzAwKTthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjVweDttYXJnaW4tYm90dG9tOjZweDtmb250LXNpemU6MTFweDtkaXNwbGF5OmZsZXh9Lnh5LWNlbGwtaWNvbltkYXRhLXYtYWUzOWQ0N2Zde2ZvbnQtc2l6ZToxMXB4fS54eS1jZWxsLWxpc3RbZGF0YS12LWFlMzlkNDdmXXtjb2xvcjp2YXIoLS14eS10ZXh0LWJvZHkpO21hcmdpbjowO3BhZGRpbmctbGVmdDoxNnB4O2ZvbnQtc2l6ZToxMnB4O2xpbmUtaGVpZ2h0OjEuNn0ueHktY29uZGl0aW9uLW5vdGVbZGF0YS12LWFlMzlkNDdmXXttYXJnaW46MDtmb250LXNpemU6MTJweDtsaW5lLWhlaWdodDoxLjV9LmNvbmQtcGFzc1tkYXRhLXYtYWUzOWQ0N2Zde2NvbG9yOnZhcigtLXh5LWphZGUtMzAwKX0uY29uZC1mYWlsW2RhdGEtdi1hZTM5ZDQ3Zl17Y29sb3I6dmFyKC0teHktZ29sZC0zMDApfS54eS1ydWxlcmVmcy10YWdzW2RhdGEtdi1hZTM5ZDQ3Zl17ZmxleC13cmFwOndyYXA7Z2FwOjZweDtkaXNwbGF5OmZsZXh9Lnh5LXJ1bGUtY2hpcFtkYXRhLXYtYWUzOWQ0N2Zde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktY3lhbi0yMDApO2JhY2tncm91bmQ6IzM4YmRmODI0O2JvcmRlcjoxcHggc29saWQgIzM4YmRmODU5O2JvcmRlci1yYWRpdXM6NHB4O3BhZGRpbmc6MnB4IDdweDtmb250LXNpemU6MTBweH0ueHktbm8tcnVsZXNbZGF0YS12LWFlMzlkNDdmXXtjb2xvcjp2YXIoLS14eS10ZXh0LWhpbnQpO2ZvbnQtc2l6ZToxMXB4O2ZvbnQtc3R5bGU6aXRhbGljfS54eS1tb2RhbC1mb290ZXJbZGF0YS12LWFlMzlkNDdmXXtib3JkZXItdG9wOjFweCBzb2xpZCAjZmZmZmZmMTQ7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4O21hcmdpbi10b3A6NHB4O3BhZGRpbmctdG9wOjEycHg7ZGlzcGxheTpmbGV4fS54eS1mb290ZXItaGludFtkYXRhLXYtYWUzOWQ0N2Zde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO2ZvbnQtc2l6ZToxMHB4fS54eS1mb290ZXItYnRuc1tkYXRhLXYtYWUzOWQ0N2Zde2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTBweDtkaXNwbGF5OmZsZXh9Lnh5LWZvb3Rlci1kaXNtaXNzLWJ0bltkYXRhLXYtYWUzOWQ0N2Zdey13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweCk7Y29sb3I6dmFyKC0teHktdGV4dC1ib2R5KTtmb250LXNpemU6MTNweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNhbnMpO2N1cnNvcjpwb2ludGVyO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjZmZmZmZmMTQgMCUsI2ZmZmZmZjA1IDEwMCUpO2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjI2O2JvcmRlci1yYWRpdXM6OTk5cHg7cGFkZGluZzo4cHggMThweDt0cmFuc2l0aW9uOmFsbCAuMjRzIGN1YmljLWJlemllciguMTYsMSwuMywxKTtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCAjZmZmZmZmMzgsMCA0cHggMTJweCAjMDAwMDAwNDB9Lnh5LWZvb3Rlci1kaXNtaXNzLWJ0bltkYXRhLXYtYWUzOWQ0N2ZdOmhvdmVye2NvbG9yOiNmZmY7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmZmZmZmYyZSAwJSwjZmZmZmZmMGQgMTAwJSk7Ym9yZGVyLWNvbG9yOiNmZmZmZmY0ZDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KTtib3gtc2hhZG93Omluc2V0IDAgMXB4IDEuNXB4ICNmZmZmZmY1OSwwIDZweCAxOHB4ICMwMDAwMDA1OX0ueHktZm9vdGVyLWFwcGx5LWJ0bltkYXRhLXYtYWUzOWQ0N2Zdey13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweClzYXR1cmF0ZSgxODAlKTtjb2xvcjojZmZmO2ZvbnQtc2l6ZToxM3B4O2ZvbnQtd2VpZ2h0OjUwMDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzBlYTVlOWQ5IDAlLCMwMjg0YzdiZiA1MCUsIzAzNjlhMWQ5IDEwMCUpO2JvcmRlcjoxcHggc29saWQgI2JhZTZmZDczO2JvcmRlci1yYWRpdXM6OTk5cHg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7cGFkZGluZzo4cHggMjJweDt0cmFuc2l0aW9uOmFsbCAuMjRzIGN1YmljLWJlemllciguMTYsMSwuMywxKTtkaXNwbGF5OmlubGluZS1mbGV4O2JveC1zaGFkb3c6aW5zZXQgMCAxLjVweCAycHggI2ZmZmZmZmE2LGluc2V0IDAgLTEuNXB4IDJweCAjMDAwNiwwIDhweCAyNHB4ICMwMjg0Yzc2NiwwIDAgMTZweCAjMzhiZGY4NGR9Lnh5LWZvb3Rlci1hcHBseS1idG5bZGF0YS12LWFlMzlkNDdmXTpob3Zlcjpub3QoOmRpc2FibGVkKXtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzM4YmRmOGYyIDAlLCMwZWE1ZTlkOSA1MCUsIzAyODRjN2U2IDEwMCUpO2JvcmRlci1jb2xvcjojYmFlNmZkO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0ycHgpO2JveC1zaGFkb3c6aW5zZXQgMCAycHggM3B4ICNmZmZjLDAgMTJweCAzMnB4ICMzOGJkZjg4YywwIDAgMjRweCAjMzhiZGY4NjZ9Lnh5LWZvb3Rlci1hcHBseS1idG5bZGF0YS12LWFlMzlkNDdmXTpkaXNhYmxlZCwueHktZm9vdGVyLWFwcGx5LWJ0bi5pcy1sb2NrZWRbZGF0YS12LWFlMzlkNDdmXXtjdXJzb3I6bm90LWFsbG93ZWQ7b3BhY2l0eTouNDU7Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCk7Ym94LXNoYWRvdzpub25lO2JhY2tncm91bmQ6I2ZmZmZmZjBhO2JvcmRlci1jb2xvcjojZmZmZmZmMWY7dHJhbnNmb3JtOm5vbmUhaW1wb3J0YW50fS54eS1idG4tbG9ja1tkYXRhLXYtYWUzOWQ0N2Zde21hcmdpbi1yaWdodDo0cHg7Zm9udC1zaXplOjEzcHh9Lnh5LWJ0bi1hcnJvd1tkYXRhLXYtYWUzOWQ0N2Zde2ZvbnQtc2l6ZToxNHB4fS54eS1tb2RhbC1wb3AtZW50ZXItYWN0aXZlW2RhdGEtdi1hZTM5ZDQ3Zl0sLnh5LW1vZGFsLXBvcC1sZWF2ZS1hY3RpdmVbZGF0YS12LWFlMzlkNDdmXXt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzIHZhcigtLXh5LWVhc2Utc21vb3RoKX0ueHktbW9kYWwtcG9wLWVudGVyLWFjdGl2ZSAueHktc2tpbGwtbW9kYWwtY2FyZFtkYXRhLXYtYWUzOWQ0N2ZdLC54eS1tb2RhbC1wb3AtbGVhdmUtYWN0aXZlIC54eS1za2lsbC1tb2RhbC1jYXJkW2RhdGEtdi1hZTM5ZDQ3Zl17dHJhbnNpdGlvbjp0cmFuc2Zvcm0gLjM1cyB2YXIoLS14eS1lYXNlLW91dC1leHBvKSwgb3BhY2l0eSAuM3MgdmFyKC0teHktZWFzZS1zbW9vdGgpfS54eS1tb2RhbC1wb3AtZW50ZXItZnJvbVtkYXRhLXYtYWUzOWQ0N2ZdLC54eS1tb2RhbC1wb3AtbGVhdmUtdG9bZGF0YS12LWFlMzlkNDdmXXtvcGFjaXR5OjB9Lnh5LW1vZGFsLXBvcC1lbnRlci1mcm9tIC54eS1za2lsbC1tb2RhbC1jYXJkW2RhdGEtdi1hZTM5ZDQ3Zl0sLnh5LW1vZGFsLXBvcC1sZWF2ZS10byAueHktc2tpbGwtbW9kYWwtY2FyZFtkYXRhLXYtYWUzOWQ0N2Zde29wYWNpdHk6MDt0cmFuc2Zvcm06c2NhbGUoLjkyKXRyYW5zbGF0ZVkoMTJweCl9QGtleWZyYW1lcyBjYXJkLXNwcmluZy1pbi1hZTM5ZDQ3ZnswJXtvcGFjaXR5OjA7dHJhbnNmb3JtOnNjYWxlKC45Mil0cmFuc2xhdGVZKDEycHgpfXRve29wYWNpdHk6MTt0cmFuc2Zvcm06c2NhbGUoMSl0cmFuc2xhdGVZKDApfX0ueHktYWN0aW9uLWRvY2tbZGF0YS12LTg0N2EyNzQzXXt6LWluZGV4OjIwO2JvcmRlci10b3A6MXB4IHNvbGlkIHZhcigtLXh5LWJvcmRlci1zdWJ0bGUpO2JhY2tkcm9wLWZpbHRlcjpibHVyKDI0cHgpO3VzZXItc2VsZWN0Om5vbmU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoIzA4MTIyMGYyIDAlLCMwNDA5MTJmYyAxMDAlKTtmbGV4LXNocmluazowO3BhZGRpbmc6MTBweCAzMnB4IDE0cHg7cG9zaXRpb246c3RpY2t5O2JvdHRvbTowO2JveC1zaGFkb3c6MCAtOHB4IDMwcHggIzAwMDl9Lnh5LWFjdGlvbi10b3BiYXJbZGF0YS12LTg0N2EyNzQzXXtqdXN0aWZ5LWNvbnRlbnQ6ZmxleC1lbmQ7YWxpZ24taXRlbXM6Y2VudGVyO21heC13aWR0aDoxODQwcHg7bWFyZ2luLWJvdHRvbToxMHB4O21hcmdpbi1sZWZ0OmF1dG87bWFyZ2luLXJpZ2h0OmF1dG87ZGlzcGxheTpmbGV4fS54eS1hY3Rpb24tY29udHJvbHNbZGF0YS12LTg0N2EyNzQzXXthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtkaXNwbGF5OmZsZXh9Lnh5LWN0cmwtYnRuW2RhdGEtdi04NDdhMjc0M117LXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6Ymx1cigxNnB4KXNhdHVyYXRlKDE2MCUpO2NvbG9yOnZhcigtLXh5LXRleHQtYm9keSk7Zm9udC1zaXplOjEycHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zYW5zKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZmZmZjE0IDAlLCNmZmZmZmYwNSAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYyOTtib3JkZXItcmFkaXVzOjk5OXB4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O3BhZGRpbmc6NnB4IDE0cHg7dHJhbnNpdGlvbjphbGwgLjI0cyBjdWJpYy1iZXppZXIoLjE2LDEsLjMsMSk7ZGlzcGxheTppbmxpbmUtZmxleDtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCAjZmZmZmZmNDAsaW5zZXQgMCAtMXB4IDFweCAjMDAwMDAwNTksMCA0cHggMTRweCAjMDAwMDAwNGR9Lnh5LWN0cmwtYnRuW2RhdGEtdi04NDdhMjc0M106aG92ZXI6bm90KDpkaXNhYmxlZCl7Y29sb3I6I2ZmZjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZmZmZjJlIDAlLCNmZmZmZmYwZCAxMDAlKTtib3JkZXItY29sb3I6I2ZmZmZmZjUyO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xcHgpO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMS41cHggI2ZmZjYsMCA2cHggMjBweCAjMDAwNn0ueHktY3RybC1idG5bZGF0YS12LTg0N2EyNzQzXTpkaXNhYmxlZHtvcGFjaXR5Oi4zNTtjdXJzb3I6bm90LWFsbG93ZWQ7dHJhbnNmb3JtOm5vbmV9LmJ0bi1zdGFydFtkYXRhLXYtODQ3YTI3NDNde2NvbG9yOiM3ZGQzZmM7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMzOGJkZjgyZSAwJSwjMGVhNWU5MGQgMTAwJSk7Ym9yZGVyLWNvbG9yOiMzOGJkZjg2Njtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCAjZmZmZmZmNTksMCA0cHggMTZweCAjMzhiZGY4MzN9LmJ0bi1zdGFydFtkYXRhLXYtODQ3YTI3NDNdOmhvdmVyOm5vdCg6ZGlzYWJsZWQpe2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMzhiZGY4NGQgMCUsIzBlYTVlOTFmIDEwMCUpO2JvcmRlci1jb2xvcjojMzhiZGY4O2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMS41cHggI2ZmZmZmZjgwLDAgNnB4IDIycHggIzM4YmRmODU5fS5idG4tbmV4dFtkYXRhLXYtODQ3YTI3NDNde2NvbG9yOiNmZGU2OGE7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmYmJmMjQyZSAwJSwjZjU5ZTBiMGQgMTAwJSk7Ym9yZGVyLWNvbG9yOiNmYmJmMjQ2Njtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCAjZmZmZmZmNTksMCA0cHggMTZweCAjZmJiZjI0MzN9LmJ0bi1uZXh0W2RhdGEtdi04NDdhMjc0M106aG92ZXI6bm90KDpkaXNhYmxlZCl7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNmYmJmMjQ0ZCAwJSwjZjU5ZTBiMWYgMTAwJSk7Ym9yZGVyLWNvbG9yOiNmYmJmMjQ7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxLjVweCAjZmZmZmZmODAsMCA2cHggMjJweCAjZmJiZjI0NTl9LmJ0bi1zdG9wW2RhdGEtdi04NDdhMjc0M117Y29sb3I6I2ZjYTVhNTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2Y0M2Y1ZTJlIDAlLCNlMTFkNDgwZCAxMDAlKTtib3JkZXItY29sb3I6I2Y0M2Y1ZTU5fS5idG4tc3RvcFtkYXRhLXYtODQ3YTI3NDNdOmhvdmVyOm5vdCg6ZGlzYWJsZWQpe2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjZjQzZjVlNDcgMCUsI2UxMWQ0ODFmIDEwMCUpO2JvcmRlci1jb2xvcjojZjQzZjVlO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMS41cHggI2ZmZmZmZjczLDAgNnB4IDIycHggI2Y0M2Y1ZTRkfS54eS1hY3Rpb24tY29uc29sZVtkYXRhLXYtODQ3YTI3NDNde2dyaWQtdGVtcGxhdGUtY29sdW1uczoyMTBweCAxZnIgMTQwcHg7YWxpZ24taXRlbXM6c3RyZXRjaDtnYXA6MTJweDttYXgtd2lkdGg6MTg0MHB4O21hcmdpbi1sZWZ0OmF1dG87bWFyZ2luLXJpZ2h0OmF1dG87ZGlzcGxheTpncmlkfS54eS10ZWNobmlxdWUtc2VsZWN0b3JbZGF0YS12LTg0N2EyNzQzXXstd2Via2l0LWJhY2tkcm9wLWZpbHRlcjpibHVyKDIwcHgpc2F0dXJhdGUoMTYwJSk7dHJhbnNpdGlvbjphbGwgLjI1cyB2YXIoLS14eS1lYXNlLXNtb290aCk7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMxMDI0NDA4YyAwJSwjMDgxNDI2YTYgMTAwJSk7Ym9yZGVyOjFweCBzb2xpZCAjMzhiZGY4Mzg7Ym9yZGVyLXJhZGl1czoxNHB4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2dhcDo0cHg7cGFkZGluZzo4cHggMTRweDtkaXNwbGF5OmZsZXg7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxLjVweCAjZmZmMyxpbnNldCAwIC0xcHggMnB4ICMwMDAwMDA1OSwwIDhweCAyNHB4ICMwMDAwMDA0ZH0ueHktdGVjaG5pcXVlLXNlbGVjdG9yW2RhdGEtdi04NDdhMjc0M106aG92ZXJ7Ym9yZGVyLWNvbG9yOiMzOGJkZjg2Njtib3gtc2hhZG93Omluc2V0IDAgMXB4IDJweCAjZmZmZmZmNGQsMCA4cHggMjhweCAjMDAwMDAwNTl9Lnh5LXRlY2gtcGlja2VyLWxhYmVsW2RhdGEtdi04NDdhMjc0M117ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo0cHg7ZGlzcGxheTpmbGV4fS54eS1waWNrZXIta2lja2VyW2RhdGEtdi04NDdhMjc0M117Zm9udC1zaXplOjEwcHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y29sb3I6dmFyKC0teHktY3lhbi0zMDApO2xldHRlci1zcGFjaW5nOi4xZW19Lnh5LXRlY2gtc2VsZWN0W2RhdGEtdi04NDdhMjc0M117Y29sb3I6dmFyKC0teHktdGV4dC10aXRsZSk7Zm9udC1zaXplOjEzcHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y3Vyc29yOnBvaW50ZXI7YmFja2dyb3VuZDowIDA7Ym9yZGVyOjA7b3V0bGluZTpub25lO3BhZGRpbmc6NHB4IDB9Lnh5LXRlY2gtc2VsZWN0IG9wdGlvbltkYXRhLXYtODQ3YTI3NDNde2NvbG9yOiNlMmU4ZjA7YmFja2dyb3VuZDojMGIxNzI4fS54eS1jbGVhci10ZWNoLWJ0bltkYXRhLXYtODQ3YTI3NDNde2NvbG9yOnZhcigtLXh5LWdvbGQtNDAwKTtjdXJzb3I6cG9pbnRlcjt0ZXh0LWFsaWduOmxlZnQ7YmFja2dyb3VuZDowIDA7Ym9yZGVyOjA7cGFkZGluZzowO2ZvbnQtc2l6ZToxMHB4O3RleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmV9Lnh5LWlucHV0LWJveC13cmFwcGVyW2RhdGEtdi04NDdhMjc0M117ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlfS54eS1hY3Rpb24tdGV4dGFyZWFbZGF0YS12LTg0N2EyNzQzXXstd2Via2l0LWJhY2tkcm9wLWZpbHRlcjpibHVyKDIwcHgpc2F0dXJhdGUoMTYwJSk7d2lkdGg6MTAwJTttaW4taGVpZ2h0OjY0cHg7Y29sb3I6dmFyKC0teHktdGV4dC10aXRsZSk7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zYW5zKTtyZXNpemU6dmVydGljYWw7dHJhbnNpdGlvbjphbGwgLjI1cyB2YXIoLS14eS1lYXNlLXNtb290aCk7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMwYTE4MmU4YyAwJSwjMDYwZjFlYWQgMTAwJSk7Ym9yZGVyOjFweCBzb2xpZCAjMzhiZGY4MzM7Ym9yZGVyLXJhZGl1czoxNHB4O291dGxpbmU6bm9uZTtwYWRkaW5nOjEycHggMTZweDtmb250LXNpemU6MTNweDtsaW5lLWhlaWdodDoxLjY7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxLjVweCAjZmZmZmZmMjksaW5zZXQgMCAtMXB4IDJweCAjMDAwMDAwNTksMCA4cHggMjRweCAjMDAwMDAwNDB9Lnh5LWFjdGlvbi10ZXh0YXJlYVtkYXRhLXYtODQ3YTI3NDNdOmZvY3Vze2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMGUyMDNhYjggMCUsIzA4MTQyNmNjIDEwMCUpO2JvcmRlci1jb2xvcjojMzhiZGY4OGM7Ym94LXNoYWRvdzppbnNldCAwIDFweCAycHggI2ZmZmZmZjQ3LDAgMCAyNHB4ICMzOGJkZjg0ZCwwIDhweCAzMHB4ICMwMDA2fS54eS1zdWJtaXQtYnRuW2RhdGEtdi04NDdhMjc0M117LXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6Ymx1cigxNnB4KXNhdHVyYXRlKDE4MCUpO2NvbG9yOiNmZmY7Y3Vyc29yOnBvaW50ZXI7dHJhbnNpdGlvbjphbGwgLjI1cyB2YXIoLS14eS1lYXNlLW91dC1leHBvKTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzBlYTVlOWQ5IDAlLCMwMjg0YzdiZiA1MCUsIzAzNjlhMWQ5IDEwMCUpO2JvcmRlcjoxcHggc29saWQgI2JhZTZmZDczO2JvcmRlci1yYWRpdXM6MTRweDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtkaXNwbGF5OmZsZXg7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVuO2JveC1zaGFkb3c6aW5zZXQgMCAxLjVweCAycHggI2ZmZmZmZmE2LGluc2V0IDAgLTEuNXB4IDJweCAjMDAwMDAwNzMsMCA4cHggMjhweCAjMDI4NGM3NzMsMCAwIDIwcHggIzM4YmRmODU5fS54eS1zdWJtaXQtYnRuW2RhdGEtdi04NDdhMjc0M106aG92ZXI6bm90KDpkaXNhYmxlZCl7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMzOGJkZjhmMiAwJSwjMGVhNWU5ZDkgNTAlLCMwMjg0YzdlNiAxMDAlKTtib3JkZXItY29sb3I6I2JhZTZmZDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMnB4KTtib3gtc2hhZG93Omluc2V0IDAgMnB4IDNweCAjZmZmYywwIDEycHggMzZweCAjMzhiZGY4OTksMCAwIDI4cHggIzM4YmRmODgwfS54eS1zdWJtaXQtYnRuW2RhdGEtdi04NDdhMjc0M106ZGlzYWJsZWR7b3BhY2l0eTouNDtjdXJzb3I6bm90LWFsbG93ZWQ7Ym94LXNoYWRvdzpub25lO2JhY2tncm91bmQ6I2ZmZmZmZjBkO2JvcmRlci1jb2xvcjojZmZmZmZmMWF9Lnh5LXN1Ym1pdC1jb250ZW50W2RhdGEtdi04NDdhMjc0M117ei1pbmRleDoyO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjVweDtkaXNwbGF5OmZsZXg7cG9zaXRpb246cmVsYXRpdmV9Lnh5LXN1Ym1pdC1pY29uW2RhdGEtdi04NDdhMjc0M117Zm9udC1zaXplOjE2cHh9Lnh5LXN1Ym1pdC10ZXh0W2RhdGEtdi04NDdhMjc0M117Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7bGV0dGVyLXNwYWNpbmc6LjFlbTtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo2MDB9Lnh5LXN1Ym1pdC1idG4uaXMtbG9hZGluZyAueHktc3VibWl0LWljb25bZGF0YS12LTg0N2EyNzQzXXthbmltYXRpb246MXMgaW5maW5pdGUgeHktcHVsc2UtZ2xvd30ueHktdGltZWxpbmUtZHJhd2VyLWJhY2tkcm9wW2RhdGEtdi0zZTVhNjM2OF17YmFja2Ryb3AtZmlsdGVyOmJsdXIoOHB4KTt6LWluZGV4OjUwO2JhY2tncm91bmQ6IzAzMDcwZDgwO2p1c3RpZnktY29udGVudDpmbGV4LWVuZDtkaXNwbGF5OmZsZXg7cG9zaXRpb246YWJzb2x1dGU7aW5zZXQ6MH0ueHktdGltZWxpbmUtZHJhd2VyLXBhbmVsW2RhdGEtdi0zZTVhNjM2OF17Ym9yZGVyLWxlZnQ6MXB4IHNvbGlkIHZhcigtLXh5LWJvcmRlci1nbG93KTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgjMGExNjI2ZmEgMCUsIzA2MGUxYWZjIDEwMCUpO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjt3aWR0aDo0NDBweDttYXgtd2lkdGg6OTB2dztoZWlnaHQ6MTAwJTtkaXNwbGF5OmZsZXg7Ym94LXNoYWRvdzotMTZweCAwIDUwcHggIzAwMDAwMGIzfS54eS1kcmF3ZXItaGVhZGVyW2RhdGEtdi0zZTVhNjM2OF17YmFja2dyb3VuZDojMDgxMjIwZTY7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2ZmZmZmZjE0O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtwYWRkaW5nOjE2cHggMjBweDtkaXNwbGF5OmZsZXh9Lnh5LWRyYXdlci10aXRsZVtkYXRhLXYtM2U1YTYzNjhde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LWN5YW4tMjAwKTthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo1MDA7ZGlzcGxheTpmbGV4fS54eS1kLWljb25bZGF0YS12LTNlNWE2MzY4XXtmb250LXNpemU6MTVweH0ueHktY291bnQtYmFkZ2VbZGF0YS12LTNlNWE2MzY4XXtmb250LXNpemU6MTBweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKTtiYWNrZ3JvdW5kOiMzOGJkZjgyNjtib3JkZXI6MXB4IHNvbGlkICMzOGJkZjg0ZDtib3JkZXItcmFkaXVzOjk5OXB4O3BhZGRpbmc6MXB4IDdweH0ueHktY2xvc2UtZHJhd2VyLWJ0bltkYXRhLXYtM2U1YTYzNjhdey13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTJweCk7d2lkdGg6MjhweDtoZWlnaHQ6MjhweDtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZmZmZjE0IDAlLCNmZmZmZmYwNSAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYyNDtib3JkZXItcmFkaXVzOjk5OXB4O2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2ZvbnQtc2l6ZToxM3B4O3RyYW5zaXRpb246YWxsIC4yNHMgY3ViaWMtYmV6aWVyKC4xNiwxLC4zLDEpO2Rpc3BsYXk6ZmxleDtib3gtc2hhZG93Omluc2V0IDAgMXB4IDFweCAjZmZmMywwIDJweCA4cHggIzAwMDAwMDQwfS54eS1jbG9zZS1kcmF3ZXItYnRuW2RhdGEtdi0zZTVhNjM2OF06aG92ZXJ7Y29sb3I6I2ZjYTVhNTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2Y0M2Y1ZTQwIDAlLCNlMTFkNDgxYSAxMDAlKTtib3JkZXItY29sb3I6I2Y0M2Y1ZTgwO3RyYW5zZm9ybTpyb3RhdGUoOTBkZWcpc2NhbGUoMS4wNSk7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxLjVweCAjZmZmNiwwIDRweCAxNHB4ICNmNDNmNWU0ZH0ueHktZHJhd2VyLWJvZHlbZGF0YS12LTNlNWE2MzY4XXtmbGV4LWRpcmVjdGlvbjpjb2x1bW47ZmxleDoxO2dhcDoxNnB4O3BhZGRpbmc6MTZweCAyMHB4IDI0cHg7ZGlzcGxheTpmbGV4O292ZXJmbG93LXk6YXV0b30ueHktdGltZWxpbmUtc3RyZWFtW2RhdGEtdi0zZTVhNjM2OF17ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoxMnB4O2Rpc3BsYXk6ZmxleH0ueHktdGltZWxpbmUtY2FyZFtkYXRhLXYtM2U1YTYzNjhde2JhY2tncm91bmQ6IzBlMWMzMGQ5O2JvcmRlcjoxcHggc29saWQgIzM4YmRmODI2O2JvcmRlci1yYWRpdXM6OHB4O3BhZGRpbmc6MTJweCAxNHB4O2JveC1zaGFkb3c6MCA0cHggMTRweCAjMDAwMDAwNGR9Lnh5LXQtaGVhZFtkYXRhLXYtM2U1YTYzNjhde2ZvbnQtc2l6ZToxMHB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7bWFyZ2luLWJvdHRvbTo2cHg7ZGlzcGxheTpmbGV4fS54eS10LXJvdW5kW2RhdGEtdi0zZTVhNjM2OF17Y29sb3I6dmFyKC0teHktZ29sZC00MDApO2ZvbnQtd2VpZ2h0OjYwMH0ueHktdC1zdGF0dXNbZGF0YS12LTNlNWE2MzY4XXtib3JkZXItcmFkaXVzOjNweDtwYWRkaW5nOjFweCA2cHh9LnN0LWNvbXBsZXRlW2RhdGEtdi0zZTVhNjM2OF17Y29sb3I6dmFyKC0teHktamFkZS0zMDApO2JhY2tncm91bmQ6IzJkZDRiZjI2fS5zdC1jb21taXR0ZWRbZGF0YS12LTNlNWE2MzY4XXtjb2xvcjp2YXIoLS14eS1jeWFuLTMwMCk7YmFja2dyb3VuZDojMzhiZGY4MjZ9LnN0LWludGVycnVwdGVkW2RhdGEtdi0zZTVhNjM2OF17Y29sb3I6dmFyKC0teHktY3JpbXNvbi00MDApO2JhY2tncm91bmQ6I2Y0M2Y1ZTI2fS54eS10LWFjdGlvbi1pZFtkYXRhLXYtM2U1YTYzNjhde2NvbG9yOnZhcigtLXh5LXRleHQtaGludCk7bWFyZ2luLWxlZnQ6YXV0b30ueHktdC1sYWJlbFtkYXRhLXYtM2U1YTYzNjhde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LXRleHQtdGl0bGUpO21hcmdpbjowIDAgNnB4O2ZvbnQtc2l6ZToxM3B4fS54eS10LW91dGNvbWVbZGF0YS12LTNlNWE2MzY4XSwueHktdC1uYXJyYXRpdmVbZGF0YS12LTNlNWE2MzY4XXtjb2xvcjp2YXIoLS14eS10ZXh0LWJvZHkpO2ZvbnQtc2l6ZToxMnB4O2xpbmUtaGVpZ2h0OjEuNn0ueHktdC1vdXRjb21lIGJbZGF0YS12LTNlNWE2MzY4XSwueHktdC1uYXJyYXRpdmUgYltkYXRhLXYtM2U1YTYzNjhde2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKTtmb250LXdlaWdodDo1MDB9Lnh5LXQtbmFycmF0aXZlIHBbZGF0YS12LTNlNWE2MzY4XXtjb2xvcjojZTJlOGYwO21hcmdpbjo0cHggMCAwfS54eS10LW5hcnJhdGl2ZS1lbXB0eVtkYXRhLXYtM2U1YTYzNjhde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO21hcmdpbi10b3A6NHB4O2ZvbnQtc2l6ZToxMXB4O2ZvbnQtc3R5bGU6aXRhbGljfS54eS10aW1lbGluZS1lbXB0eVtkYXRhLXYtM2U1YTYzNjhde3RleHQtYWxpZ246Y2VudGVyO2NvbG9yOnZhcigtLXh5LXRleHQtaGludCk7cGFkZGluZzozMHB4IDA7Zm9udC1zaXplOjEycHh9Lnh5LXB1YmxpYy1ldmVudHMtc2VjdGlvbltkYXRhLXYtM2U1YTYzNjhde2JvcmRlci10b3A6MXB4IGRhc2hlZCAjZmZmZmZmMTQ7cGFkZGluZy10b3A6MTRweH0ueHktcGUtdGl0bGVbZGF0YS12LTNlNWE2MzY4XXtmb250LXNpemU6MTFweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCk7bWFyZ2luOjAgMCA4cHh9Lnh5LXBlLWxpc3RbZGF0YS12LTNlNWE2MzY4XXtjb2xvcjp2YXIoLS14eS10ZXh0LWJvZHkpO21hcmdpbjowO3BhZGRpbmctbGVmdDoxNnB4O2ZvbnQtc2l6ZToxMXB4O2xpbmUtaGVpZ2h0OjEuN30ueHktZHJhd2VyLXNsaWRlLWVudGVyLWFjdGl2ZVtkYXRhLXYtM2U1YTYzNjhdLC54eS1kcmF3ZXItc2xpZGUtbGVhdmUtYWN0aXZlW2RhdGEtdi0zZTVhNjM2OF17dHJhbnNpdGlvbjpvcGFjaXR5IC4yNXMgdmFyKC0teHktZWFzZS1zbW9vdGgpfS54eS1kcmF3ZXItc2xpZGUtZW50ZXItZnJvbVtkYXRhLXYtM2U1YTYzNjhdLC54eS1kcmF3ZXItc2xpZGUtbGVhdmUtdG9bZGF0YS12LTNlNWE2MzY4XXtvcGFjaXR5OjB9Lnh5LWRyYXdlci1zbGlkZS1lbnRlci1hY3RpdmUgLnh5LXRpbWVsaW5lLWRyYXdlci1wYW5lbFtkYXRhLXYtM2U1YTYzNjhde3RyYW5zaXRpb246dHJhbnNmb3JtIC4zcyB2YXIoLS14eS1lYXNlLW91dC1leHBvKX0ueHktZHJhd2VyLXNsaWRlLWxlYXZlLWFjdGl2ZSAueHktdGltZWxpbmUtZHJhd2VyLXBhbmVsW2RhdGEtdi0zZTVhNjM2OF17dHJhbnNpdGlvbjp0cmFuc2Zvcm0gLjI1cyB2YXIoLS14eS1lYXNlLXNtb290aCl9Lnh5LWRyYXdlci1zbGlkZS1lbnRlci1mcm9tIC54eS10aW1lbGluZS1kcmF3ZXItcGFuZWxbZGF0YS12LTNlNWE2MzY4XSwueHktZHJhd2VyLXNsaWRlLWxlYXZlLXRvIC54eS10aW1lbGluZS1kcmF3ZXItcGFuZWxbZGF0YS12LTNlNWE2MzY4XXt0cmFuc2Zvcm06dHJhbnNsYXRlKDEwMCUpfS54eS1iYXR0bGUtc3RhZ2VbZGF0YS12LWIyOWIyYjg3XXtiYWNrZ3JvdW5kOnZhcigtLXh5LWJnLWFieXNzKTtmbGV4LWRpcmVjdGlvbjpjb2x1bW47anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTttaW4taGVpZ2h0OjA7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbn0ueHktc3RhZ2UtYXJlbmFbZGF0YS12LWIyOWIyYjg3XXt6LWluZGV4OjI7Ym94LXNpemluZzpib3JkZXItYm94O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtmbGV4OjE7d2lkdGg6MTAwJTttYXgtd2lkdGg6MTkyMHB4O21pbi1oZWlnaHQ6MDttYXJnaW46MCBhdXRvO3BhZGRpbmc6MTRweCAyNHB4O2Rpc3BsYXk6ZmxleDtwb3NpdGlvbjpyZWxhdGl2ZX0ueHktYXJlbmEtY29sdW1uc1tkYXRhLXYtYjI5YjJiODdde2dyaWQtdGVtcGxhdGUtY29sdW1uczptaW5tYXgoMzgwcHgsMS4yZnIpIG1pbm1heCgzMjBweCwzODBweCkgbWlubWF4KDM4MHB4LDEuMmZyKTthbGlnbi1pdGVtczpzdHJldGNoO2dhcDoyNHB4O2hlaWdodDoxMDAlO21pbi1oZWlnaHQ6MDtkaXNwbGF5OmdyaWR9Lnh5LXNldHRpbmdzLXBhbmVsW2RhdGEtdi1iOGI4MGJkNl17ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoyMHB4O21heC13aWR0aDoxMTAwcHg7bWFyZ2luOjAgYXV0bztwYWRkaW5nOjI0cHggMjhweCA0MHB4O2Rpc3BsYXk6ZmxleH0ueHktcGFuZWwtaGVhZGVyW2RhdGEtdi1iOGI4MGJkNl17Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0teHktYm9yZGVyLXN1YnRsZSk7cGFkZGluZy1ib3R0b206MTRweH0ueHktcGFuZWwta2lja2VyW2RhdGEtdi1iOGI4MGJkNl17bGV0dGVyLXNwYWNpbmc6LjE4ZW07Zm9udC1zaXplOjEwcHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtjb2xvcjp2YXIoLS14eS1jeWFuLTQwMCl9Lnh5LXBhbmVsLXRpdGxlW2RhdGEtdi1iOGI4MGJkNl17Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y29sb3I6dmFyKC0teHktdGV4dC10aXRsZSk7bGV0dGVyLXNwYWNpbmc6LjA0ZW07bWFyZ2luOjRweCAwIDZweDtmb250LXNpemU6MjRweDtmb250LXdlaWdodDo1MDB9Lnh5LXBhbmVsLWRlc2NbZGF0YS12LWI4YjgwYmQ2XXtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTttYXJnaW46MDtmb250LXNpemU6MTJweDtsaW5lLWhlaWdodDoxLjZ9Lnh5LWNvbmZpZy1jYXJkW2RhdGEtdi1iOGI4MGJkNl17Ym9yZGVyOjFweCBzb2xpZCB2YXIoLS14eS1ib3JkZXItc3VidGxlKTtiYWNrZHJvcC1maWx0ZXI6Ymx1cigxNnB4KTtiYWNrZ3JvdW5kOiMwYzFhMmViZjtib3JkZXItcmFkaXVzOjEycHg7bWFyZ2luOjA7cGFkZGluZzoxOHB4IDIycHh9Lnh5LWNhcmQtbGVnZW5kW2RhdGEtdi1iOGI4MGJkNl0sLnh5LWNhcmQtdGl0bGVbZGF0YS12LWI4YjgwYmQ2XXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCk7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7cGFkZGluZzowIDZweDtmb250LXNpemU6MTVweDtmb250LXdlaWdodDo1MDA7ZGlzcGxheTpmbGV4fS54eS1sZWdlbmQtaWNvbltkYXRhLXYtYjhiODBiZDZde2ZvbnQtc2l6ZToxNHB4fS54eS1mb3JtLWdyaWRbZGF0YS12LWI4YjgwYmQ2XXtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDQsMWZyKTtnYXA6MTRweDttYXJnaW4tdG9wOjEycHg7ZGlzcGxheTpncmlkfS54eS1jb2wtc3Bhbi0yW2RhdGEtdi1iOGI4MGJkNl17Z3JpZC1jb2x1bW46c3BhbiAyfS54eS1mb3JtLWZpZWxkW2RhdGEtdi1iOGI4MGJkNl17ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo2cHg7ZGlzcGxheTpmbGV4fS54eS1maWVsZC1sYWJlbFtkYXRhLXYtYjhiODBiZDZde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO2ZvbnQtc2l6ZToxMXB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2Fucyk7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2Rpc3BsYXk6ZmxleH0ueHktZmllbGQtaGludFtkYXRhLXYtYjhiODBiZDZde2NvbG9yOnZhcigtLXh5LWdvbGQtNDAwKTtmb250LXNpemU6OXB4fS54eS1pbnB1dC10ZXh0W2RhdGEtdi1iOGI4MGJkNl0sLnh5LWlucHV0LXNlbGVjdFtkYXRhLXYtYjhiODBiZDZdLC54eS1pbnB1dC10ZXh0YXJlYVtkYXRhLXYtYjhiODBiZDZdey13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweCk7Y29sb3I6dmFyKC0teHktdGV4dC10aXRsZSk7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zYW5zKTtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzA4MTIyNDk5IDAlLCMwNDBhMTZiZiAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICMzOGJkZjgzMztib3JkZXItcmFkaXVzOjEwcHg7b3V0bGluZTpub25lO3BhZGRpbmc6OHB4IDEycHg7Zm9udC1zaXplOjEzcHg7dHJhbnNpdGlvbjphbGwgLjI0cyBjdWJpYy1iZXppZXIoLjE2LDEsLjMsMSk7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxcHggI2ZmZmZmZjI2LGluc2V0IDAgLTFweCAxcHggIzAwMDAwMDRkfS54eS1pbnB1dC10ZXh0W2RhdGEtdi1iOGI4MGJkNl06Zm9jdXMsLnh5LWlucHV0LXNlbGVjdFtkYXRhLXYtYjhiODBiZDZdOmZvY3VzLC54eS1pbnB1dC10ZXh0YXJlYVtkYXRhLXYtYjhiODBiZDZdOmZvY3Vze2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMGMxYTMwYmYgMCUsIzA2MTAyMGQ5IDEwMCUpO2JvcmRlci1jb2xvcjojMzhiZGY4OGM7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxLjVweCAjZmZmZmZmNDAsMCAwIDE2cHggIzM4YmRmODQwfS54eS1wYXNzd29yZC13cmFwW2RhdGEtdi1iOGI4MGJkNl17ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlfS54eS1wYXNzd29yZC13cmFwIGlucHV0W2RhdGEtdi1iOGI4MGJkNl17d2lkdGg6MTAwJTtwYWRkaW5nLXJpZ2h0OjM2cHh9Lnh5LXB3ZC10b2dnbGVbZGF0YS12LWI4YjgwYmQ2XXtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOjAgMDtib3JkZXI6MDtwYWRkaW5nOjRweDtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO3JpZ2h0OjZweDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKX0ueHktcHdkLXRvZ2dsZVtkYXRhLXYtYjhiODBiZDZdOmhvdmVye2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKX0ueHktdG9nZ2xlLXJvd1tkYXRhLXYtYjhiODBiZDZde2FsaWduLWl0ZW1zOmNlbnRlcjttYXJnaW4tdG9wOjEwcHg7ZGlzcGxheTpmbGV4fS54eS1jaGVja2JveC1sYWJlbFtkYXRhLXYtYjhiODBiZDZde2NvbG9yOnZhcigtLXh5LXRleHQtYm9keSk7Y3Vyc29yOnBvaW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7Zm9udC1zaXplOjEzcHg7ZGlzcGxheTppbmxpbmUtZmxleH0ueHktY2hlY2tib3hbZGF0YS12LWI4YjgwYmQ2XXt3aWR0aDoxNnB4O2hlaWdodDoxNnB4O2FjY2VudC1jb2xvcjp2YXIoLS14eS1jeWFuLTUwMCl9Lnh5LW10LTNbZGF0YS12LWI4YjgwYmQ2XXttYXJnaW4tdG9wOjEycHh9Lnh5LXNldHRpbmdzLWZvb3RlcltkYXRhLXYtYjhiODBiZDZde2dhcDoxMnB4O21hcmdpbi10b3A6MTBweDtkaXNwbGF5OmZsZXh9Lnh5LXNhdmUtYnRuW2RhdGEtdi1iOGI4MGJkNl17LXdlYmtpdC1iYWNrZHJvcC1maWx0ZXI6Ymx1cigxNnB4KXNhdHVyYXRlKDE4MCUpO2NvbG9yOiNmZmY7Zm9udC1zaXplOjE0cHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7bGV0dGVyLXNwYWNpbmc6LjA1ZW07Y3Vyc29yOnBvaW50ZXI7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMwZWE1ZTlkOSAwJSwjMDI4NGM3YmYgNTAlLCMwMzY5YTFkOSAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICNiYWU2ZmQ3Mztib3JkZXItcmFkaXVzOjk5OXB4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O3BhZGRpbmc6MTBweCAyNnB4O2ZvbnQtd2VpZ2h0OjUwMDt0cmFuc2l0aW9uOmFsbCAuMjRzIGN1YmljLWJlemllciguMTYsMSwuMywxKTtkaXNwbGF5OmlubGluZS1mbGV4O2JveC1zaGFkb3c6aW5zZXQgMCAxLjVweCAycHggI2ZmZmZmZmE2LGluc2V0IDAgLTEuNXB4IDJweCAjMDAwNiwwIDhweCAyNHB4ICMwMjg0Yzc2NiwwIDAgMTZweCAjMzhiZGY4NGR9Lnh5LXNhdmUtYnRuW2RhdGEtdi1iOGI4MGJkNl06aG92ZXJ7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCMzOGJkZjhmMiAwJSwjMGVhNWU5ZDkgNTAlLCMwMjg0YzdlNiAxMDAlKTtib3JkZXItY29sb3I6I2JhZTZmZDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMnB4KTtib3gtc2hhZG93Omluc2V0IDAgMnB4IDNweCAjZmZmYywwIDEycHggMzJweCAjMzhiZGY4OGMsMCAwIDI0cHggIzM4YmRmODY2fS54eS1iYWNrLWJ0bltkYXRhLXYtYjhiODBiZDZdey13ZWJraXQtYmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweCk7Y29sb3I6dmFyKC0teHktdGV4dC1ib2R5KTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsI2ZmZmZmZjE0IDAlLCNmZmZmZmYwNSAxMDAlKTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYyNjtib3JkZXItcmFkaXVzOjk5OXB4O3BhZGRpbmc6MTBweCAyMnB4O2ZvbnQtc2l6ZToxM3B4O3RyYW5zaXRpb246YWxsIC4yNHMgY3ViaWMtYmV6aWVyKC4xNiwxLC4zLDEpO2JveC1zaGFkb3c6aW5zZXQgMCAxcHggMXB4ICNmZmZmZmYzOCwwIDRweCAxMnB4ICMwMDAwMDA0MH0ueHktYmFjay1idG5bZGF0YS12LWI4YjgwYmQ2XTpob3Zlcntjb2xvcjojZmZmO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjZmZmZmZmMmUgMCUsI2ZmZmZmZjBkIDEwMCUpO2JvcmRlci1jb2xvcjojZmZmZmZmNGQ7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTFweCk7Ym94LXNoYWRvdzppbnNldCAwIDFweCAxLjVweCAjZmZmZmZmNTksMCA2cHggMThweCAjMDAwMDAwNTl9Lnh5LWRhdGEtcGFuZWxbZGF0YS12LTg4ODdjNjY4XXtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjIwcHg7bWF4LXdpZHRoOjExMDBweDttYXJnaW46MCBhdXRvO3BhZGRpbmc6MjRweCAyOHB4IDQwcHg7ZGlzcGxheTpmbGV4fS54eS1wYW5lbC1oZWFkZXJbZGF0YS12LTg4ODdjNjY4XXtib3JkZXItYm90dG9tOjFweCBzb2xpZCB2YXIoLS14eS1ib3JkZXItc3VidGxlKTtwYWRkaW5nLWJvdHRvbToxNHB4fS54eS1wYW5lbC1raWNrZXJbZGF0YS12LTg4ODdjNjY4XXtsZXR0ZXItc3BhY2luZzouMThlbTtmb250LXNpemU6MTBweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2NvbG9yOnZhcigtLXh5LWN5YW4tNDAwKX0ueHktcGFuZWwtdGl0bGVbZGF0YS12LTg4ODdjNjY4XXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjp2YXIoLS14eS10ZXh0LXRpdGxlKTtsZXR0ZXItc3BhY2luZzouMDRlbTttYXJnaW46NHB4IDAgNnB4O2ZvbnQtc2l6ZToyNHB4O2ZvbnQtd2VpZ2h0OjUwMH0ueHktcGFuZWwtZGVzY1tkYXRhLXYtODg4N2M2Njhde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO21hcmdpbjowO2ZvbnQtc2l6ZToxMnB4fS54eS1xdWljay1hY3Rpb25zLWJhcltkYXRhLXYtODg4N2M2Njhde2ZsZXgtd3JhcDp3cmFwO2dhcDoxMHB4O2Rpc3BsYXk6ZmxleH0ueHktYWN0aW9uLWJ0bltkYXRhLXYtODg4N2M2Njhde2NvbG9yOnZhcigtLXh5LXRleHQtdGl0bGUpO2ZvbnQtc2l6ZToxM3B4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2Fucyk7Y3Vyc29yOnBvaW50ZXI7YmFja2dyb3VuZDojMGUxYzMwYjM7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmMWY7Ym9yZGVyLXJhZGl1czo4cHg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7cGFkZGluZzo5cHggMThweDt0cmFuc2l0aW9uOmFsbCAuMnM7ZGlzcGxheTppbmxpbmUtZmxleH0ueHktYWN0aW9uLWJ0bltkYXRhLXYtODg4N2M2NjhdOmhvdmVye2JvcmRlci1jb2xvcjp2YXIoLS14eS1jeWFuLTQwMCk7Ym94LXNoYWRvdzowIDAgMTZweCB2YXIoLS14eS1jeWFuLWdsb3cpO2JhY2tncm91bmQ6IzE0MmE0OGU2fS5idG4tZGVtb1tkYXRhLXYtODg4N2M2Njhde2NvbG9yOnZhcigtLXh5LWdvbGQtMzAwKTtiYWNrZ3JvdW5kOiNmYmJmMjQxNDtib3JkZXItY29sb3I6I2ZiYmYyNDY2fS5idG4tZGVtb1tkYXRhLXYtODg4N2M2NjhdOmhvdmVye2JvcmRlci1jb2xvcjp2YXIoLS14eS1nb2xkLTQwMCk7Ym94LXNoYWRvdzowIDAgMTZweCB2YXIoLS14eS1nb2xkLWdsb3cpO2JhY2tncm91bmQ6I2ZiYmYyNDJlfS54eS1pbXBvcnQtY29uc29sZVtkYXRhLXYtODg4N2M2Njhde2JvcmRlcjoxcHggc29saWQgdmFyKC0teHktYm9yZGVyLXN1YnRsZSk7YmFja2Ryb3AtZmlsdGVyOmJsdXIoMTZweCk7YmFja2dyb3VuZDojMGMxYTJlYmY7Ym9yZGVyLXJhZGl1czoxMnB4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MTJweDtwYWRkaW5nOjE4cHggMjJweDtkaXNwbGF5OmZsZXh9Lnh5LWNvbnNvbGUtaGVhZGVyW2RhdGEtdi04ODg3YzY2OF17anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO2Rpc3BsYXk6ZmxleH0ueHktY29uc29sZS10aXRsZVtkYXRhLXYtODg4N2M2Njhde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LWN5YW4tMjAwKTtmb250LXNpemU6MTRweH0ueHktZmlsZS11cGxvYWQtYnRuW2RhdGEtdi04ODg3YzY2OF17Y29sb3I6dmFyKC0teHktY3lhbi0zMDApO2N1cnNvcjpwb2ludGVyO2JhY2tncm91bmQ6IzM4YmRmODE0O2JvcmRlcjoxcHggc29saWQgIzM4YmRmODQwO2JvcmRlci1yYWRpdXM6NnB4O3BhZGRpbmc6NXB4IDEycHg7Zm9udC1zaXplOjExcHg7dHJhbnNpdGlvbjphbGwgLjJzfS54eS1maWxlLXVwbG9hZC1idG5bZGF0YS12LTg4ODdjNjY4XTpob3ZlcntiYWNrZ3JvdW5kOiMzOGJkZjgyZX0ueHktaGlkZGVuLWlucHV0W2RhdGEtdi04ODg3YzY2OF17ZGlzcGxheTpub25lfS54eS1qc29uLXRleHRhcmVhW2RhdGEtdi04ODg3YzY2OF17Y29sb3I6I2JhZTZmZDt3aWR0aDoxMDAlO2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7cmVzaXplOnZlcnRpY2FsO2JhY2tncm91bmQ6IzA2MGUxYWU2O2JvcmRlcjoxcHggc29saWQgI2ZmZmZmZjFhO2JvcmRlci1yYWRpdXM6OHB4O291dGxpbmU6bm9uZTtwYWRkaW5nOjEycHggMTRweDtmb250LXNpemU6MTJweDtsaW5lLWhlaWdodDoxLjZ9Lnh5LWpzb24tdGV4dGFyZWFbZGF0YS12LTg4ODdjNjY4XTpmb2N1c3tib3JkZXItY29sb3I6dmFyKC0teHktY3lhbi00MDApO2JveC1zaGFkb3c6MCAwIDEycHggdmFyKC0teHktY3lhbi1nbG93KX0ueHktaW1wb3J0LWJ0bnNbZGF0YS12LTg4ODdjNjY4XXtnYXA6MTBweDtkaXNwbGF5OmZsZXh9Lnh5LWltcC1idG5bZGF0YS12LTg4ODdjNjY4XXtjb2xvcjp2YXIoLS14eS10ZXh0LXRpdGxlKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOiNmZmZmZmYwZDtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYxZjtib3JkZXItcmFkaXVzOjZweDtwYWRkaW5nOjhweCAxNnB4O2ZvbnQtc2l6ZToxMnB4O3RyYW5zaXRpb246YWxsIC4yc30ueHktaW1wLWJ0bltkYXRhLXYtODg4N2M2NjhdOmhvdmVyOm5vdCg6ZGlzYWJsZWQpe2JvcmRlci1jb2xvcjp2YXIoLS14eS1jeWFuLTQwMCk7YmFja2dyb3VuZDojMzhiZGY4MjZ9Lnh5LWltcC1idG5bZGF0YS12LTg4ODdjNjY4XTpkaXNhYmxlZHtvcGFjaXR5Oi4zNTtjdXJzb3I6bm90LWFsbG93ZWR9LmJ0bi1kYW5nZXJbZGF0YS12LTg4ODdjNjY4XXtjb2xvcjp2YXIoLS14eS1jcmltc29uLTMwMCk7Ym9yZGVyLWNvbG9yOiNmNDNmNWU0ZH0uYnRuLWRhbmdlcltkYXRhLXYtODg4N2M2NjhdOmhvdmVyOm5vdCg6ZGlzYWJsZWQpe2JvcmRlci1jb2xvcjp2YXIoLS14eS1jcmltc29uLTQwMCk7YmFja2dyb3VuZDojZjQzZjVlMjZ9Lnh5LXNuYXBzaG90LWRldGFpbHNbZGF0YS12LTg4ODdjNjY4XXtiYWNrZ3JvdW5kOiMwNjBlMWE5OTtib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYxNDtib3JkZXItcmFkaXVzOjhweDtwYWRkaW5nOjEwcHggMTRweH0ueHktc25hcHNob3Qtc3VtbWFyeVtkYXRhLXYtODg4N2M2Njhde2NvbG9yOnZhcigtLXh5LXRleHQtbXV0ZWQpO2N1cnNvcjpwb2ludGVyO291dGxpbmU6bm9uZTtmb250LXNpemU6MTJweH0ueHktc25hcHNob3QtcHJlW2RhdGEtdi04ODg3YzY2OF17Y29sb3I6IzdkZDNmYztmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2JhY2tncm91bmQ6IzAzMDcwZGYyO2JvcmRlci1yYWRpdXM6NnB4O21heC1oZWlnaHQ6MzIwcHg7bWFyZ2luOjEwcHggMCAwO3BhZGRpbmc6MTJweDtmb250LXNpemU6MTFweDtsaW5lLWhlaWdodDoxLjY7b3ZlcmZsb3c6YXV0b30ueHktZGV2LXBhbmVsW2RhdGEtdi03OGYwYjM5Ml17ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDoyMHB4O21heC13aWR0aDoxMTAwcHg7bWFyZ2luOjAgYXV0bztwYWRkaW5nOjI0cHggMjhweCA0MHB4O2Rpc3BsYXk6ZmxleH0ueHktcGFuZWwtaGVhZGVyW2RhdGEtdi03OGYwYjM5Ml17Ym9yZGVyLWJvdHRvbToxcHggc29saWQgdmFyKC0teHktYm9yZGVyLXN1YnRsZSk7cGFkZGluZy1ib3R0b206MTRweH0ueHktcGFuZWwta2lja2VyW2RhdGEtdi03OGYwYjM5Ml17bGV0dGVyLXNwYWNpbmc6LjE4ZW07Zm9udC1zaXplOjEwcHg7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtjb2xvcjp2YXIoLS14eS1jeWFuLTQwMCl9Lnh5LXBhbmVsLXRpdGxlW2RhdGEtdi03OGYwYjM5Ml17Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1zZXJpZik7Y29sb3I6dmFyKC0teHktdGV4dC10aXRsZSk7bGV0dGVyLXNwYWNpbmc6LjA0ZW07bWFyZ2luOjRweCAwIDZweDtmb250LXNpemU6MjRweDtmb250LXdlaWdodDo1MDB9Lnh5LXBhbmVsLWRlc2NbZGF0YS12LTc4ZjBiMzkyXXtjb2xvcjp2YXIoLS14eS10ZXh0LW11dGVkKTttYXJnaW46MDtmb250LXNpemU6MTJweH0ueHktZGV2LWFjdGlvbnNbZGF0YS12LTc4ZjBiMzkyXXtnYXA6MTBweDtkaXNwbGF5OmZsZXh9Lnh5LWRldi1idG5bZGF0YS12LTc4ZjBiMzkyXXtjb2xvcjp2YXIoLS14eS10ZXh0LXRpdGxlKTtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOiMwZTFjMzBiMztib3JkZXI6MXB4IHNvbGlkICNmZmZmZmYxZjtib3JkZXItcmFkaXVzOjhweDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjdweDtwYWRkaW5nOjhweCAxNnB4O2ZvbnQtc2l6ZToxMnB4O3RyYW5zaXRpb246YWxsIC4ycztkaXNwbGF5OmlubGluZS1mbGV4fS54eS1kZXYtYnRuW2RhdGEtdi03OGYwYjM5Ml06aG92ZXJ7Ym9yZGVyLWNvbG9yOnZhcigtLXh5LWN5YW4tNDAwKTtib3gtc2hhZG93OjAgMCAxNHB4IHZhcigtLXh5LWN5YW4tZ2xvdyk7YmFja2dyb3VuZDojMTQyYTQ4ZTZ9Lnh5LWxvZy1zZWN0aW9uW2RhdGEtdi03OGYwYjM5Ml17YmFja2dyb3VuZDojMDgxMjIwZDk7Ym9yZGVyOjFweCBzb2xpZCAjMzhiZGY4MzM7Ym9yZGVyLXJhZGl1czoxMHB4O3BhZGRpbmc6MTJweCAxNnB4fS54eS1zZWMtc3VtbWFyeVtkYXRhLXYtNzhmMGIzOTJde2ZvbnQtc2l6ZToxMnB4O2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2VyaWYpO2NvbG9yOnZhcigtLXh5LWN5YW4tMjAwKTtjdXJzb3I6cG9pbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtkaXNwbGF5OmZsZXh9Lnh5LXNlYy10YWdbZGF0YS12LTc4ZjBiMzkyXXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2NvbG9yOnZhcigtLXh5LWN5YW4tMzAwKTtiYWNrZ3JvdW5kOiMzOGJkZjgzMztib3JkZXItcmFkaXVzOjNweDtwYWRkaW5nOjJweCA2cHg7Zm9udC1zaXplOjlweH0ueHktbG9nLXByZVtkYXRhLXYtNzhmMGIzOTJde2NvbG9yOiM3ZGQzZmM7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtiYWNrZ3JvdW5kOiMwMzA3MGRmMjtib3JkZXItcmFkaXVzOjZweDttYXgtaGVpZ2h0OjMwMHB4O21hcmdpbjoxMnB4IDAgMDtwYWRkaW5nOjE0cHg7Zm9udC1zaXplOjExcHg7bGluZS1oZWlnaHQ6MS42O292ZXJmbG93OmF1dG99Lnh5LWxvZy1saXN0LWNvbnRhaW5lcltkYXRhLXYtNzhmMGIzOTJde2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6MTBweDtkaXNwbGF5OmZsZXh9Lnh5LWxpc3QtdGl0bGVbZGF0YS12LTc4ZjBiMzkyXXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjp2YXIoLS14eS1nb2xkLTMwMCk7bWFyZ2luOjA7Zm9udC1zaXplOjE1cHh9Lnh5LWxvZy1pdGVtc1tkYXRhLXYtNzhmMGIzOTJde2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O2Rpc3BsYXk6ZmxleH0ueHktbG9nLWRldGFpbC1pdGVtW2RhdGEtdi03OGYwYjM5Ml17YmFja2dyb3VuZDojMGExNjI2YjM7Ym9yZGVyOjFweCBzb2xpZCAjZmZmZmZmMTQ7Ym9yZGVyLXJhZGl1czo4cHg7b3ZlcmZsb3c6aGlkZGVufS54eS1pdGVtLXN1bW1hcnlbZGF0YS12LTc4ZjBiMzkyXXtjdXJzb3I6cG9pbnRlcjthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEwcHg7cGFkZGluZzoxMHB4IDE0cHg7Zm9udC1zaXplOjEycHg7ZGlzcGxheTpmbGV4fS54eS1pdGVtLWtpbmRbZGF0YS12LTc4ZjBiMzkyXXtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2JhY2tncm91bmQ6I2ZmZmZmZjE0O2JvcmRlci1yYWRpdXM6NHB4O3BhZGRpbmc6MnB4IDhweDtmb250LXNpemU6MTBweH0ua2luZC1hZGp1ZGljYXRpb25bZGF0YS12LTc4ZjBiMzkyXXtjb2xvcjp2YXIoLS14eS1jeWFuLTMwMCk7YmFja2dyb3VuZDojMzhiZGY4MzN9LmtpbmQtaG9zdF9wZXJzaXN0ZW5jZVtkYXRhLXYtNzhmMGIzOTJde2NvbG9yOnZhcigtLXh5LWdvbGQtMzAwKTtiYWNrZ3JvdW5kOiNmYmJmMjQzM30ua2luZC1ob3N0X2luamVjdGlvbltkYXRhLXYtNzhmMGIzOTJde2NvbG9yOnZhcigtLXh5LWphZGUtMzAwKTtiYWNrZ3JvdW5kOiMyZGQ0YmYzM30ua2luZC1uYXJyYXRpdmVbZGF0YS12LTc4ZjBiMzkyXXtjb2xvcjojYzRiNWZkO2JhY2tncm91bmQ6I2E3OGJmYTMzfS54eS1pdGVtLWFjdGlvbltkYXRhLXYtNzhmMGIzOTJde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktdGV4dC1tdXRlZCl9Lnh5LWl0ZW0tdGltZVtkYXRhLXYtNzhmMGIzOTJde2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtbW9ubyk7Y29sb3I6dmFyKC0teHktdGV4dC1oaW50KTttYXJnaW4tbGVmdDphdXRvO2ZvbnQtc2l6ZToxMHB4fS54eS1pdGVtLXByZVtkYXRhLXYtNzhmMGIzOTJde2NvbG9yOiNiYWU2ZmQ7Zm9udC1mYW1pbHk6dmFyKC0teHktZm9udC1tb25vKTtiYWNrZ3JvdW5kOiMwNDA5MTBmMjtib3JkZXItdG9wOjFweCBzb2xpZCAjZmZmZmZmMGY7bWF4LWhlaWdodDoyODBweDttYXJnaW46MDtwYWRkaW5nOjEycHggMTRweDtmb250LXNpemU6MTFweDtsaW5lLWhlaWdodDoxLjY7b3ZlcmZsb3c6YXV0b30ueHktZW1wdHktbG9nc1tkYXRhLXYtNzhmMGIzOTJde3RleHQtYWxpZ246Y2VudGVyO2NvbG9yOnZhcigtLXh5LXRleHQtaGludCk7Ym9yZGVyOjFweCBkYXNoZWQgI2ZmZmZmZjE0O2JvcmRlci1yYWRpdXM6OHB4O3BhZGRpbmc6MjRweDtmb250LXNpemU6MTJweH06cm9vdHstLXh5LWJnLXZvaWQ6IzAzMDcwZDstLXh5LWJnLWFieXNzOiMwNzEwMWU7LS14eS1iZy1zdXJmYWNlLTE6IzBhMTYyOGQxOy0teHktYmctc3VyZmFjZS0yOiMwZjIwM2FiODstLXh5LWJnLXN1cmZhY2UtMzojMTYyZTUyOGM7LS14eS1iZy1jYXJkOiMwYzFhMzBlMDstLXh5LWJnLWdsYXNzOiMxMDIzNDA3MzstLXh5LWN5YW4tNTA6I2YwZjlmZjstLXh5LWN5YW4tMTAwOiNlMGYyZmU7LS14eS1jeWFuLTIwMDojYmFlNmZkOy0teHktY3lhbi0zMDA6IzdkZDNmYzstLXh5LWN5YW4tNDAwOiMzOGJkZjg7LS14eS1jeWFuLTUwMDojMGVhNWU5Oy0teHktY3lhbi1nbG93OiMzOGJkZjg1OTstLXh5LWphZGUtMzAwOiM1ZWVhZDQ7LS14eS1qYWRlLTQwMDojMmRkNGJmOy0teHktamFkZS01MDA6IzE0YjhhNjstLXh5LWphZGUtZ2xvdzojMmRkNGJmNDc7LS14eS1nb2xkLTIwMDojZmRlNjhhOy0teHktZ29sZC0zMDA6I2ZjZDM0ZDstLXh5LWdvbGQtNDAwOiNmYmJmMjQ7LS14eS1nb2xkLTUwMDojZjU5ZTBiOy0teHktZ29sZC1nbG93OiNmYmJmMjQ1MjstLXh5LWNyaW1zb24tMzAwOiNmZGE0YWY7LS14eS1jcmltc29uLTQwMDojZmI3MTg1Oy0teHktY3JpbXNvbi01MDA6I2Y0M2Y1ZTstLXh5LWNyaW1zb24tNjAwOiNlMTFkNDg7LS14eS1jcmltc29uLWdsb3c6I2Y0M2Y1ZTRkOy0teHktdGV4dC10aXRsZTojZjhmYWZjOy0teHktdGV4dC1ib2R5OiNjYmQ1ZTE7LS14eS10ZXh0LW11dGVkOiM2NDc0OGI7LS14eS10ZXh0LWhpbnQ6IzQ3NTU2OTstLXh5LWJvcmRlci1zdWJ0bGU6IzM4YmRmODFmOy0teHktYm9yZGVyLWdsb3c6IzM4YmRmODUyOy0teHktYm9yZGVyLWdvbGQ6I2ZiYmYyNDQ3Oy0teHktYm9yZGVyLWNyaW1zb246I2Y0M2Y1ZTQ3Oy0teHktZWFzZS1vdXQtZXhwbzpjdWJpYy1iZXppZXIoLjE2LCAxLCAuMywgMSk7LS14eS1lYXNlLXNwcmluZzpjdWJpYy1iZXppZXIoLjM0LCAxLjU2LCAuNjQsIDEpOy0teHktZWFzZS1zbW9vdGg6Y3ViaWMtYmV6aWVyKC40LCAwLCAuMiwgMSk7LS14eS1mb250LXNlcmlmOiJTb25ndGkgU0MiLCAiTm90byBTZXJpZiBTQyIsICJTb3VyY2UgSGFuIFNlcmlmIENOIiwgU1RTb25nLCAiU2ltU3VuIiwgR2VvcmdpYSwgc2VyaWY7LS14eS1mb250LXNhbnM6c3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCAiU2Vnb2UgVUkiLCBSb2JvdG8sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7LS14eS1mb250LW1vbm86IkpldEJyYWlucyBNb25vIiwgIlNGIE1vbm8iLCBDb25zb2xhcywgIkNvdXJpZXIgTmV3IiwgbW9ub3NwYWNlfUBrZXlmcmFtZXMgeHktcHVsc2UtZ2xvd3swJSx0b3tvcGFjaXR5Oi40NTt0cmFuc2Zvcm06c2NhbGUoMSl9NTAle29wYWNpdHk6Ljk7dHJhbnNmb3JtOnNjYWxlKDEuMDQpfX1Aa2V5ZnJhbWVzIHh5LWNob3JkLXZpYnJhdGV7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9MjAle3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0ycHgpfTQwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgycHgpfTYwJXt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KX04MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMXB4KX10b3t0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKX19QGtleWZyYW1lcyB4eS13YXRlci1yaXBwbGV7MCV7b3BhY2l0eTouODt0cmFuc2Zvcm06c2NhbGUoLjgpfXRve29wYWNpdHk6MDt0cmFuc2Zvcm06c2NhbGUoMi4yKX19QGtleWZyYW1lcyB4eS1mbG93LXNpbmV7MCV7dHJhbnNmb3JtOnRyYW5zbGF0ZSgwKX10b3t0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUpfX0ueHktY3VzdG9tLXNjcm9sbDo6LXdlYmtpdC1zY3JvbGxiYXJ7d2lkdGg6NnB4O2hlaWdodDo2cHh9Lnh5LWN1c3RvbS1zY3JvbGw6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNre2JhY2tncm91bmQ6IzA0MDkxMjY2fS54eS1jdXN0b20tc2Nyb2xsOjotd2Via2l0LXNjcm9sbGJhci10aHVtYntiYWNrZ3JvdW5kOiMzOGJkZjg0MDtib3JkZXItcmFkaXVzOjk5OXB4fS54eS1jdXN0b20tc2Nyb2xsOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlcntiYWNrZ3JvdW5kOiMzOGJkZjg4MH0ueHktcm9vdC1jb250YWluZXJ7ei1pbmRleDoyMTQ3NDgzMDAwO2ZvbnQtZmFtaWx5OnZhcigtLXh5LWZvbnQtc2Fucyk7Y29sb3I6dmFyKC0teHktdGV4dC1ib2R5KTtwb3NpdGlvbjpyZWxhdGl2ZX0ueHktbGF1bmNoZXItc2VhbHtib3JkZXI6MXB4IHNvbGlkIHZhcigtLXh5LWJvcmRlci1nbG93KTt3aWR0aDo1OHB4O2hlaWdodDo1OHB4O2JveC1zaGFkb3c6MCA4cHggMzJweCAjMDAwOSwgMCAwIDIwcHggdmFyKC0teHktY3lhbi1nbG93KTtjdXJzb3I6Z3JhYjt0b3VjaC1hY3Rpb246bm9uZTt6LWluZGV4OjIxNDc0ODMwMDA7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gLjJzIHZhcigtLXh5LWVhc2Utb3V0LWV4cG8pLCBib3gtc2hhZG93IC4yczt1c2VyLXNlbGVjdDpub25lO2JhY2tncm91bmQ6cmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCAzNSUgMzUlLCMwZWE1ZTlmMiwjMDcxMDFlZmEpO2JvcmRlci1yYWRpdXM6NTAlO2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2FsaWduLWl0ZW1zOmNlbnRlcjtwYWRkaW5nOjA7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOmZpeGVkO2JvdHRvbToyOHB4O3JpZ2h0OjI4cHh9Lnh5LWxhdW5jaGVyLXNlYWw6aG92ZXJ7dHJhbnNmb3JtOnNjYWxlKDEuMDgpO2JveC1zaGFkb3c6MCAxMnB4IDM2cHggIzAwMDAwMGIzLDAgMCAyOHB4ICMzOGJkZjg5OX0ueHktbGF1bmNoZXItc2VhbC5pcy1qdWRnaW5ne2JvcmRlci1jb2xvcjp2YXIoLS14eS1nb2xkLTQwMCk7Ym94LXNoYWRvdzowIDAgMjRweCB2YXIoLS14eS1nb2xkLWdsb3cpO2FuaW1hdGlvbjoxLjVzIGluZmluaXRlIHh5LXB1bHNlLWdsb3d9Lnh5LXNlYWwtcmluZ3twb2ludGVyLWV2ZW50czpub25lO2JvcmRlcjoxcHggZGFzaGVkICMzOGJkZjg2Njtib3JkZXItcmFkaXVzOjUwJTthbmltYXRpb246MjRzIGxpbmVhciBpbmZpbml0ZSB4eS1yb3RhdGUtc2xvdztwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDotM3B4fS54eS1zZWFsLWlubmVye2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7bGluZS1oZWlnaHQ6MS4xO2Rpc3BsYXk6ZmxleH0ueHktc2VhbC1pY29ue2NvbG9yOiNmZmY7Zm9udC1zaXplOjE2cHh9Lnh5LXNlYWwtdGV4dHtmb250LWZhbWlseTp2YXIoLS14eS1mb250LXNlcmlmKTtjb2xvcjojZmZmO2xldHRlci1zcGFjaW5nOi4wOGVtO2ZvbnQtc2l6ZToxMXB4O2ZvbnQtd2VpZ2h0OjYwMH0ueHktbGF1bmNoZXItYmFkZ2V7Zm9udC1zaXplOjlweDtmb250LWZhbWlseTp2YXIoLS14eS1mb250LW1vbm8pO2JhY2tncm91bmQ6dmFyKC0teHktZ29sZC01MDApO2NvbG9yOiMwMDA7Ym9yZGVyLXJhZGl1czo5OTlweDtwYWRkaW5nOjFweCA2cHg7Zm9udC13ZWlnaHQ6NzAwO3Bvc2l0aW9uOmFic29sdXRlO3RvcDotNHB4O3JpZ2h0Oi00cHg7Ym94LXNoYWRvdzowIDJweCA4cHggIzAwMDAwMDgwfS54eS1tb2RhbC1iYWNrZHJvcHtiYWNrZHJvcC1maWx0ZXI6Ymx1cigyMHB4KTt6LWluZGV4OjIxNDc0ODMwMDA7Ym94LXNpemluZzpib3JkZXItYm94O2JhY2tncm91bmQ6IzAyMDYwY2ViO2p1c3RpZnktY29udGVudDpjZW50ZXI7YWxpZ24taXRlbXM6Y2VudGVyO3BhZGRpbmc6OHB4IDEycHg7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOmZpeGVkO2luc2V0OjB9Lnh5LXdvcmtiZW5jaC1wYW5lbHtiYWNrZ3JvdW5kOnZhcigtLXh5LWJnLWFieXNzKTtib3JkZXI6MXB4IHNvbGlkIHZhcigtLXh5LWJvcmRlci1zdWJ0bGUpO2JveC1zaXppbmc6Ym9yZGVyLWJveDtib3JkZXItcmFkaXVzOjEycHg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO3dpZHRoOjEwMCU7bWF4LXdpZHRoOjE5MjBweDtoZWlnaHQ6MTAwJTttYXgtaGVpZ2h0OjEwMCU7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbjtib3gtc2hhZG93OjAgMjRweCA4MHB4ICMwMDAwMDBmMiwwIDAgMCAxcHggIzM4YmRmODI2fS54eS1ub3RpY2UtYmFubmVye2NvbG9yOnZhcigtLXh5LWdvbGQtMjAwKTtiYWNrZ3JvdW5kOiNmYmJmMjQxZjtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZmJiZjI0NGQ7ZmxleC1zaHJpbms6MDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEwcHg7cGFkZGluZzo4cHggMjRweDtmb250LXNpemU6MTJweDtkaXNwbGF5OmZsZXh9Lnh5LW5vdGljZS1iYW5uZXIuaXMtZXJyb3J7Y29sb3I6dmFyKC0teHktY3JpbXNvbi0zMDApO2JhY2tncm91bmQ6I2Y0M2Y1ZTI0O2JvcmRlci1ib3R0b20tY29sb3I6I2Y0M2Y1ZTU5fS54eS1ub3RpY2UtdGV4dHtmbGV4OjF9Lnh5LW5vdGljZS1kaXNtaXNze2NvbG9yOmN1cnJlbnRDb2xvcjtjdXJzb3I6cG9pbnRlcjtiYWNrZ3JvdW5kOjAgMDtib3JkZXI6MDtwYWRkaW5nOjJweCA2cHg7Zm9udC1zaXplOjE0cHh9Lnh5LWNvbnRlbnQtYm9keXtib3gtc2l6aW5nOmJvcmRlci1ib3g7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2ZsZXg6MTttaW4taGVpZ2h0OjA7ZGlzcGxheTpmbGV4O3Bvc2l0aW9uOnJlbGF0aXZlO292ZXJmbG93OmhpZGRlbjt3aWR0aDoxMDAlIWltcG9ydGFudDttYXgtd2lkdGg6bm9uZSFpbXBvcnRhbnQ7bWFyZ2luOjAhaW1wb3J0YW50O3BhZGRpbmc6MCFpbXBvcnRhbnR9Lnh5LWNvbnRlbnQtYm9keS5pcy1zY3JvbGxhYmxle292ZXJmbG93LXk6YXV0b30ueHktbW9kYWwtZmFkZS1lbnRlci1hY3RpdmUsLnh5LW1vZGFsLWZhZGUtbGVhdmUtYWN0aXZle3RyYW5zaXRpb246b3BhY2l0eSAuM3MgdmFyKC0teHktZWFzZS1zbW9vdGgpfS54eS1tb2RhbC1mYWRlLWVudGVyLWZyb20sLnh5LW1vZGFsLWZhZGUtbGVhdmUtdG97b3BhY2l0eTowfS54eS1tb2RhbC1mYWRlLWVudGVyLWFjdGl2ZSAueHktd29ya2JlbmNoLXBhbmVse3RyYW5zaXRpb246dHJhbnNmb3JtIC4zNXMgdmFyKC0teHktZWFzZS1vdXQtZXhwbyksIG9wYWNpdHkgLjNzIHZhcigtLXh5LWVhc2Utc21vb3RoKX0ueHktbW9kYWwtZmFkZS1lbnRlci1mcm9tIC54eS13b3JrYmVuY2gtcGFuZWx7b3BhY2l0eTowO3RyYW5zZm9ybTpzY2FsZSguOTYpdHJhbnNsYXRlWSgxMnB4KX0ueHktbm90aWNlLXNsaWRlLWVudGVyLWFjdGl2ZSwueHktbm90aWNlLXNsaWRlLWxlYXZlLWFjdGl2ZXt0cmFuc2l0aW9uOmFsbCAuMjVzIHZhcigtLXh5LWVhc2Utb3V0LWV4cG8pfS54eS1ub3RpY2Utc2xpZGUtZW50ZXItZnJvbSwueHktbm90aWNlLXNsaWRlLWxlYXZlLXRve29wYWNpdHk6MDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMTAwJSl9Ci8qJHZpdGUkOjEqLw==", "" + import.meta.url).href;
		if (!e.querySelector("link[href*=\"style.css\"]")) {
			let n = e.createElement("link");
			n.rel = "stylesheet", n.href = t, e.head.appendChild(n);
		}
	} catch {}
	let s = n || (globalThis.SillyTavern?.getContext ? new Rp({ contextProvider: () => globalThis.SillyTavern.getContext() }) : null), c = r || new kp({
		storage: t,
		chatId: i,
		branchId: a,
		hostAdapter: s
	}), l = ls(pp, {
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
export { zp as mountBattleSystem };
