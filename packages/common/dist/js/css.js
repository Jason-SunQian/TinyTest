import { utils as ao } from "@opentiny/tiny-engine-utils";
const _t = 0, g = 1, C = 2, I = 3, E = 4, de = 5, kt = 6, U = 7, K = 8, S = 9, k = 10, z = 11, w = 12, P = 13, Qe = 14, Q = 15, q = 16, Y = 17, fe = 18, J = 19, le = 20, N = 21, O = 22, H = 23, ne = 24, W = 25, so = 0;
function F(e) {
  return e >= 48 && e <= 57;
}
function ve(e) {
  return F(e) || // 0 .. 9
  e >= 65 && e <= 70 || // A .. F
  e >= 97 && e <= 102;
}
function ln(e) {
  return e >= 65 && e <= 90;
}
function lo(e) {
  return e >= 97 && e <= 122;
}
function co(e) {
  return ln(e) || lo(e);
}
function uo(e) {
  return e >= 128;
}
function ut(e) {
  return co(e) || uo(e) || e === 95;
}
function Tr(e) {
  return ut(e) || F(e) || e === 45;
}
function ho(e) {
  return e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e === 127;
}
function ht(e) {
  return e === 10 || e === 13 || e === 12;
}
function Ae(e) {
  return ht(e) || e === 32 || e === 9;
}
function pe(e, t) {
  return !(e !== 92 || ht(t) || t === so);
}
function ot(e, t, n) {
  return e === 45 ? ut(t) || t === 45 || pe(t, n) : ut(e) ? !0 : e === 92 ? pe(e, t) : !1;
}
function Ot(e, t, n) {
  return e === 43 || e === 45 ? F(t) ? 2 : t === 46 && F(n) ? 3 : 0 : e === 46 ? F(t) ? 2 : 0 : F(e) ? 1 : 0;
}
function _r(e) {
  return e === 65279 || e === 65534 ? 1 : 0;
}
const Vt = new Array(128), po = 128, at = 130, Or = 131, cn = 132, $r = 133;
for (let e = 0; e < Vt.length; e++)
  Vt[e] = Ae(e) && at || F(e) && Or || ut(e) && cn || ho(e) && $r || e || po;
function $t(e) {
  return e < 128 ? Vt[e] : cn;
}
function Ee(e, t) {
  return t < e.length ? e.charCodeAt(t) : 0;
}
function Kt(e, t, n) {
  return n === 13 && Ee(e, t + 1) === 10 ? 2 : 1;
}
function ze(e, t, n) {
  let r = e.charCodeAt(t);
  return ln(r) && (r = r | 32), r === n;
}
function We(e, t, n, r) {
  if (n - t !== r.length || t < 0 || n > e.length)
    return !1;
  for (let i = t; i < n; i++) {
    const o = r.charCodeAt(i - t);
    let s = e.charCodeAt(i);
    if (ln(s) && (s = s | 32), s !== o)
      return !1;
  }
  return !0;
}
function fo(e, t) {
  for (; t >= 0 && Ae(e.charCodeAt(t)); t--)
    ;
  return t + 1;
}
function Ze(e, t) {
  for (; t < e.length && Ae(e.charCodeAt(t)); t++)
    ;
  return t;
}
function Lt(e, t) {
  for (; t < e.length && F(e.charCodeAt(t)); t++)
    ;
  return t;
}
function Pe(e, t) {
  if (t += 2, ve(Ee(e, t - 1))) {
    for (const r = Math.min(e.length, t + 5); t < r && ve(Ee(e, t)); t++)
      ;
    const n = Ee(e, t);
    Ae(n) && (t += Kt(e, t, n));
  }
  return t;
}
function Je(e, t) {
  for (; t < e.length; t++) {
    const n = e.charCodeAt(t);
    if (!Tr(n)) {
      if (pe(n, Ee(e, t + 1))) {
        t = Pe(e, t) - 1;
        continue;
      }
      break;
    }
  }
  return t;
}
function xt(e, t) {
  let n = e.charCodeAt(t);
  if ((n === 43 || n === 45) && (n = e.charCodeAt(t += 1)), F(n) && (t = Lt(e, t + 1), n = e.charCodeAt(t)), n === 46 && F(e.charCodeAt(t + 1)) && (t += 2, t = Lt(e, t)), ze(
    e,
    t,
    101
    /* e */
  )) {
    let r = 0;
    n = e.charCodeAt(t + 1), (n === 45 || n === 43) && (r = 1, n = e.charCodeAt(t + 2)), F(n) && (t = Lt(e, t + 1 + r + 1));
  }
  return t;
}
function Et(e, t) {
  for (; t < e.length; t++) {
    const n = e.charCodeAt(t);
    if (n === 41) {
      t++;
      break;
    }
    pe(n, Ee(e, t + 1)) && (t = Pe(e, t));
  }
  return t;
}
function Lr(e) {
  if (e.length === 1 && !ve(e.charCodeAt(0)))
    return e[0];
  let t = parseInt(e, 16);
  return (t === 0 || // If this number is zero,
  t >= 55296 && t <= 57343 || // or is for a surrogate,
  t > 1114111) && (t = 65533), String.fromCodePoint(t);
}
const Er = [
  "EOF-token",
  "ident-token",
  "function-token",
  "at-keyword-token",
  "hash-token",
  "string-token",
  "bad-string-token",
  "url-token",
  "bad-url-token",
  "delim-token",
  "number-token",
  "percentage-token",
  "dimension-token",
  "whitespace-token",
  "CDO-token",
  "CDC-token",
  "colon-token",
  "semicolon-token",
  "comma-token",
  "[-token",
  "]-token",
  "(-token",
  ")-token",
  "{-token",
  "}-token"
], mo = 16 * 1024;
function pt(e = null, t) {
  return e === null || e.length < t ? new Uint32Array(Math.max(t + 1024, mo)) : e;
}
const On = 10, go = 12, $n = 13;
function Ln(e) {
  const t = e.source, n = t.length, r = t.length > 0 ? _r(t.charCodeAt(0)) : 0, i = pt(e.lines, n), o = pt(e.columns, n);
  let s = e.startLine, u = e.startColumn;
  for (let c = r; c < n; c++) {
    const a = t.charCodeAt(c);
    i[c] = s, o[c] = u++, (a === On || a === $n || a === go) && (a === $n && c + 1 < n && t.charCodeAt(c + 1) === On && (c++, i[c] = s, o[c] = u), s++, u = 1);
  }
  i[n] = s, o[n] = u, e.lines = i, e.columns = o, e.computed = !0;
}
class bo {
  constructor() {
    this.lines = null, this.columns = null, this.computed = !1;
  }
  setSource(t, n = 0, r = 1, i = 1) {
    this.source = t, this.startOffset = n, this.startLine = r, this.startColumn = i, this.computed = !1;
  }
  getLocation(t, n) {
    return this.computed || Ln(this), {
      source: n,
      offset: this.startOffset + t,
      line: this.lines[t],
      column: this.columns[t]
    };
  }
  getLocationRange(t, n, r) {
    return this.computed || Ln(this), {
      source: r,
      start: {
        offset: this.startOffset + t,
        line: this.lines[t],
        column: this.columns[t]
      },
      end: {
        offset: this.startOffset + n,
        line: this.lines[n],
        column: this.columns[n]
      }
    };
  }
}
const ee = 16777215, ye = 24, yo = /* @__PURE__ */ new Map([
  [C, O],
  [N, O],
  [J, le],
  [H, ne]
]);
class ko {
  constructor(t, n) {
    this.setSource(t, n);
  }
  reset() {
    this.eof = !1, this.tokenIndex = -1, this.tokenType = 0, this.tokenStart = this.firstCharOffset, this.tokenEnd = this.firstCharOffset;
  }
  setSource(t = "", n = () => {
  }) {
    t = String(t || "");
    const r = t.length, i = pt(this.offsetAndType, t.length + 1), o = pt(this.balance, t.length + 1);
    let s = 0, u = 0, c = 0, a = -1;
    for (this.offsetAndType = null, this.balance = null, n(t, (l, d, m) => {
      switch (l) {
        default:
          o[s] = r;
          break;
        case u: {
          let b = c & ee;
          for (c = o[b], u = c >> ye, o[s] = b, o[b++] = s; b < s; b++)
            o[b] === r && (o[b] = s);
          break;
        }
        case N:
        case C:
        case J:
        case H:
          o[s] = c, u = yo.get(l), c = u << ye | s;
          break;
      }
      i[s++] = l << ye | m, a === -1 && (a = d);
    }), i[s] = _t << ye | r, o[s] = r, o[r] = r; c !== 0; ) {
      const l = c & ee;
      c = o[l], o[l] = r;
    }
    this.source = t, this.firstCharOffset = a === -1 ? 0 : a, this.tokenCount = s, this.offsetAndType = i, this.balance = o, this.reset(), this.next();
  }
  lookupType(t) {
    return t += this.tokenIndex, t < this.tokenCount ? this.offsetAndType[t] >> ye : _t;
  }
  lookupOffset(t) {
    return t += this.tokenIndex, t < this.tokenCount ? this.offsetAndType[t - 1] & ee : this.source.length;
  }
  lookupValue(t, n) {
    return t += this.tokenIndex, t < this.tokenCount ? We(
      this.source,
      this.offsetAndType[t - 1] & ee,
      this.offsetAndType[t] & ee,
      n
    ) : !1;
  }
  getTokenStart(t) {
    return t === this.tokenIndex ? this.tokenStart : t > 0 ? t < this.tokenCount ? this.offsetAndType[t - 1] & ee : this.offsetAndType[this.tokenCount] & ee : this.firstCharOffset;
  }
  substrToCursor(t) {
    return this.source.substring(t, this.tokenStart);
  }
  isBalanceEdge(t) {
    return this.balance[this.tokenIndex] < t;
  }
  isDelim(t, n) {
    return n ? this.lookupType(n) === S && this.source.charCodeAt(this.lookupOffset(n)) === t : this.tokenType === S && this.source.charCodeAt(this.tokenStart) === t;
  }
  skip(t) {
    let n = this.tokenIndex + t;
    n < this.tokenCount ? (this.tokenIndex = n, this.tokenStart = this.offsetAndType[n - 1] & ee, n = this.offsetAndType[n], this.tokenType = n >> ye, this.tokenEnd = n & ee) : (this.tokenIndex = this.tokenCount, this.next());
  }
  next() {
    let t = this.tokenIndex + 1;
    t < this.tokenCount ? (this.tokenIndex = t, this.tokenStart = this.tokenEnd, t = this.offsetAndType[t], this.tokenType = t >> ye, this.tokenEnd = t & ee) : (this.eof = !0, this.tokenIndex = this.tokenCount, this.tokenType = _t, this.tokenStart = this.tokenEnd = this.source.length);
  }
  skipSC() {
    for (; this.tokenType === P || this.tokenType === W; )
      this.next();
  }
  skipUntilBalanced(t, n) {
    let r = t, i, o;
    e:
      for (; r < this.tokenCount; r++) {
        if (i = this.balance[r], i < t)
          break e;
        switch (o = r > 0 ? this.offsetAndType[r - 1] & ee : this.firstCharOffset, n(this.source.charCodeAt(o))) {
          case 1:
            break e;
          case 2:
            r++;
            break e;
          default:
            this.balance[i] === r && (r = i);
        }
      }
    this.skip(r - this.tokenIndex);
  }
  forEachToken(t) {
    for (let n = 0, r = this.firstCharOffset; n < this.tokenCount; n++) {
      const i = r, o = this.offsetAndType[n], s = o & ee, u = o >> ye;
      r = s, t(u, i, s, n);
    }
  }
  dump() {
    const t = new Array(this.tokenCount);
    return this.forEachToken((n, r, i, o) => {
      t[o] = {
        idx: o,
        type: Er[n],
        chunk: this.source.substring(r, i),
        balance: this.balance[o]
      };
    }), t;
  }
}
function vt(e, t) {
  function n(d) {
    return d < u ? e.charCodeAt(d) : 0;
  }
  function r() {
    if (a = xt(e, a), ot(n(a), n(a + 1), n(a + 2))) {
      l = w, a = Je(e, a);
      return;
    }
    if (n(a) === 37) {
      l = z, a++;
      return;
    }
    l = k;
  }
  function i() {
    const d = a;
    if (a = Je(e, a), We(e, d, a, "url") && n(a) === 40) {
      if (a = Ze(e, a + 1), n(a) === 34 || n(a) === 39) {
        l = C, a = d + 4;
        return;
      }
      s();
      return;
    }
    if (n(a) === 40) {
      l = C, a++;
      return;
    }
    l = g;
  }
  function o(d) {
    for (d || (d = n(a++)), l = de; a < e.length; a++) {
      const m = e.charCodeAt(a);
      switch ($t(m)) {
        case d:
          a++;
          return;
        case at:
          if (ht(m)) {
            a += Kt(e, a, m), l = kt;
            return;
          }
          break;
        case 92:
          if (a === e.length - 1)
            break;
          const b = n(a + 1);
          ht(b) ? a += Kt(e, a + 1, b) : pe(m, b) && (a = Pe(e, a) - 1);
          break;
      }
    }
  }
  function s() {
    for (l = U, a = Ze(e, a); a < e.length; a++) {
      const d = e.charCodeAt(a);
      switch ($t(d)) {
        case 41:
          a++;
          return;
        case at:
          if (a = Ze(e, a), n(a) === 41 || a >= e.length) {
            a < e.length && a++;
            return;
          }
          a = Et(e, a), l = K;
          return;
        case 34:
        case 39:
        case 40:
        case $r:
          a = Et(e, a), l = K;
          return;
        case 92:
          if (pe(d, n(a + 1))) {
            a = Pe(e, a) - 1;
            break;
          }
          a = Et(e, a), l = K;
          return;
      }
    }
  }
  e = String(e || "");
  const u = e.length;
  let c = _r(n(0)), a = c, l;
  for (; a < u; ) {
    const d = e.charCodeAt(a);
    switch ($t(d)) {
      case at:
        l = P, a = Ze(e, a + 1);
        break;
      case 34:
        o();
        break;
      case 35:
        Tr(n(a + 1)) || pe(n(a + 1), n(a + 2)) ? (l = E, a = Je(e, a + 1)) : (l = S, a++);
        break;
      case 39:
        o();
        break;
      case 40:
        l = N, a++;
        break;
      case 41:
        l = O, a++;
        break;
      case 43:
        Ot(d, n(a + 1), n(a + 2)) ? r() : (l = S, a++);
        break;
      case 44:
        l = fe, a++;
        break;
      case 45:
        Ot(d, n(a + 1), n(a + 2)) ? r() : n(a + 1) === 45 && n(a + 2) === 62 ? (l = Q, a = a + 3) : ot(d, n(a + 1), n(a + 2)) ? i() : (l = S, a++);
        break;
      case 46:
        Ot(d, n(a + 1), n(a + 2)) ? r() : (l = S, a++);
        break;
      case 47:
        n(a + 1) === 42 ? (l = W, a = e.indexOf("*/", a + 2), a = a === -1 ? e.length : a + 2) : (l = S, a++);
        break;
      case 58:
        l = q, a++;
        break;
      case 59:
        l = Y, a++;
        break;
      case 60:
        n(a + 1) === 33 && n(a + 2) === 45 && n(a + 3) === 45 ? (l = Qe, a = a + 4) : (l = S, a++);
        break;
      case 64:
        ot(n(a + 1), n(a + 2), n(a + 3)) ? (l = I, a = Je(e, a + 1)) : (l = S, a++);
        break;
      case 91:
        l = J, a++;
        break;
      case 92:
        pe(d, n(a + 1)) ? i() : (l = S, a++);
        break;
      case 93:
        l = le, a++;
        break;
      case 123:
        l = H, a++;
        break;
      case 125:
        l = ne, a++;
        break;
      case Or:
        r();
        break;
      case cn:
        i();
        break;
      default:
        l = S, a++;
    }
    t(l, c, c = a);
  }
}
let Te = null;
class R {
  static createItem(t) {
    return {
      prev: null,
      next: null,
      data: t
    };
  }
  constructor() {
    this.head = null, this.tail = null, this.cursor = null;
  }
  createItem(t) {
    return R.createItem(t);
  }
  // cursor helpers
  allocateCursor(t, n) {
    let r;
    return Te !== null ? (r = Te, Te = Te.cursor, r.prev = t, r.next = n, r.cursor = this.cursor) : r = {
      prev: t,
      next: n,
      cursor: this.cursor
    }, this.cursor = r, r;
  }
  releaseCursor() {
    const { cursor: t } = this;
    this.cursor = t.cursor, t.prev = null, t.next = null, t.cursor = Te, Te = t;
  }
  updateCursors(t, n, r, i) {
    let { cursor: o } = this;
    for (; o !== null; )
      o.prev === t && (o.prev = n), o.next === r && (o.next = i), o = o.cursor;
  }
  *[Symbol.iterator]() {
    for (let t = this.head; t !== null; t = t.next)
      yield t.data;
  }
  // getters
  get size() {
    let t = 0;
    for (let n = this.head; n !== null; n = n.next)
      t++;
    return t;
  }
  get isEmpty() {
    return this.head === null;
  }
  get first() {
    return this.head && this.head.data;
  }
  get last() {
    return this.tail && this.tail.data;
  }
  // convertors
  fromArray(t) {
    let n = null;
    this.head = null;
    for (let r of t) {
      const i = R.createItem(r);
      n !== null ? n.next = i : this.head = i, i.prev = n, n = i;
    }
    return this.tail = n, this;
  }
  toArray() {
    return [...this];
  }
  toJSON() {
    return [...this];
  }
  // array-like methods
  forEach(t, n = this) {
    const r = this.allocateCursor(null, this.head);
    for (; r.next !== null; ) {
      const i = r.next;
      r.next = i.next, t.call(n, i.data, i, this);
    }
    this.releaseCursor();
  }
  forEachRight(t, n = this) {
    const r = this.allocateCursor(this.tail, null);
    for (; r.prev !== null; ) {
      const i = r.prev;
      r.prev = i.prev, t.call(n, i.data, i, this);
    }
    this.releaseCursor();
  }
  reduce(t, n, r = this) {
    let i = this.allocateCursor(null, this.head), o = n, s;
    for (; i.next !== null; )
      s = i.next, i.next = s.next, o = t.call(r, o, s.data, s, this);
    return this.releaseCursor(), o;
  }
  reduceRight(t, n, r = this) {
    let i = this.allocateCursor(this.tail, null), o = n, s;
    for (; i.prev !== null; )
      s = i.prev, i.prev = s.prev, o = t.call(r, o, s.data, s, this);
    return this.releaseCursor(), o;
  }
  some(t, n = this) {
    for (let r = this.head; r !== null; r = r.next)
      if (t.call(n, r.data, r, this))
        return !0;
    return !1;
  }
  map(t, n = this) {
    const r = new R();
    for (let i = this.head; i !== null; i = i.next)
      r.appendData(t.call(n, i.data, i, this));
    return r;
  }
  filter(t, n = this) {
    const r = new R();
    for (let i = this.head; i !== null; i = i.next)
      t.call(n, i.data, i, this) && r.appendData(i.data);
    return r;
  }
  nextUntil(t, n, r = this) {
    if (t === null)
      return;
    const i = this.allocateCursor(null, t);
    for (; i.next !== null; ) {
      const o = i.next;
      if (i.next = o.next, n.call(r, o.data, o, this))
        break;
    }
    this.releaseCursor();
  }
  prevUntil(t, n, r = this) {
    if (t === null)
      return;
    const i = this.allocateCursor(t, null);
    for (; i.prev !== null; ) {
      const o = i.prev;
      if (i.prev = o.prev, n.call(r, o.data, o, this))
        break;
    }
    this.releaseCursor();
  }
  // mutation
  clear() {
    this.head = null, this.tail = null;
  }
  copy() {
    const t = new R();
    for (let n of this)
      t.appendData(n);
    return t;
  }
  prepend(t) {
    return this.updateCursors(null, t, this.head, t), this.head !== null ? (this.head.prev = t, t.next = this.head) : this.tail = t, this.head = t, this;
  }
  prependData(t) {
    return this.prepend(R.createItem(t));
  }
  append(t) {
    return this.insert(t);
  }
  appendData(t) {
    return this.insert(R.createItem(t));
  }
  insert(t, n = null) {
    if (n !== null)
      if (this.updateCursors(n.prev, t, n, t), n.prev === null) {
        if (this.head !== n)
          throw new Error("before doesn't belong to list");
        this.head = t, n.prev = t, t.next = n, this.updateCursors(null, t);
      } else
        n.prev.next = t, t.prev = n.prev, n.prev = t, t.next = n;
    else
      this.updateCursors(this.tail, t, null, t), this.tail !== null ? (this.tail.next = t, t.prev = this.tail) : this.head = t, this.tail = t;
    return this;
  }
  insertData(t, n) {
    return this.insert(R.createItem(t), n);
  }
  remove(t) {
    if (this.updateCursors(t, t.prev, t, t.next), t.prev !== null)
      t.prev.next = t.next;
    else {
      if (this.head !== t)
        throw new Error("item doesn't belong to list");
      this.head = t.next;
    }
    if (t.next !== null)
      t.next.prev = t.prev;
    else {
      if (this.tail !== t)
        throw new Error("item doesn't belong to list");
      this.tail = t.prev;
    }
    return t.prev = null, t.next = null, t;
  }
  push(t) {
    this.insert(R.createItem(t));
  }
  pop() {
    return this.tail !== null ? this.remove(this.tail) : null;
  }
  unshift(t) {
    this.prepend(R.createItem(t));
  }
  shift() {
    return this.head !== null ? this.remove(this.head) : null;
  }
  prependList(t) {
    return this.insertList(t, this.head);
  }
  appendList(t) {
    return this.insertList(t);
  }
  insertList(t, n) {
    return t.head === null ? this : (n != null ? (this.updateCursors(n.prev, t.tail, n, t.head), n.prev !== null ? (n.prev.next = t.head, t.head.prev = n.prev) : this.head = t.head, n.prev = t.tail, t.tail.next = n) : (this.updateCursors(this.tail, t.tail, null, t.head), this.tail !== null ? (this.tail.next = t.head, t.head.prev = this.tail) : this.head = t.head, this.tail = t.tail), t.head = null, t.tail = null, this);
  }
  replace(t, n) {
    "head" in n ? this.insertList(n, t) : this.insert(n, t), this.remove(t);
  }
}
function wt(e, t) {
  const n = Object.create(SyntaxError.prototype), r = new Error();
  return Object.assign(n, {
    name: e,
    message: t,
    get stack() {
      return (r.stack || "").replace(/^(.+\n){1,3}/, `${e}: ${t}
`);
    }
  });
}
const zt = 100, En = 60, zn = "    ";
function Pn({ source: e, line: t, column: n }, r) {
  function i(l, d) {
    return o.slice(l, d).map(
      (m, b) => String(l + b + 1).padStart(c) + " |" + m
    ).join(`
`);
  }
  const o = e.split(/\r\n?|\n|\f/), s = Math.max(1, t - r) - 1, u = Math.min(t + r, o.length + 1), c = Math.max(4, String(u).length) + 1;
  let a = 0;
  n += (zn.length - 1) * (o[t - 1].substr(0, n - 1).match(/\t/g) || []).length, n > zt && (a = n - En + 3, n = En - 2);
  for (let l = s; l <= u; l++)
    l >= 0 && l < o.length && (o[l] = o[l].replace(/\t/g, zn), o[l] = (a > 0 && o[l].length > a ? "…" : "") + o[l].substr(a, zt - 2) + (o[l].length > a + zt - 1 ? "…" : ""));
  return [
    i(s, t),
    new Array(n + c + 2).join("-") + "^",
    i(t, u)
  ].filter(Boolean).join(`
`);
}
function Mn(e, t, n, r, i) {
  return Object.assign(wt("SyntaxError", e), {
    source: t,
    offset: n,
    line: r,
    column: i,
    sourceFragment(s) {
      return Pn({ source: t, line: r, column: i }, isNaN(s) ? 0 : s);
    },
    get formattedMessage() {
      return `Parse error: ${e}
` + Pn({ source: t, line: r, column: i }, 2);
    }
  });
}
function xo(e) {
  const t = this.createList();
  let n = !1;
  const r = {
    recognizer: e
  };
  for (; !this.eof; ) {
    switch (this.tokenType) {
      case W:
        this.next();
        continue;
      case P:
        n = !0, this.next();
        continue;
    }
    let i = e.getNode.call(this, r);
    if (i === void 0)
      break;
    n && (e.onWhiteSpace && e.onWhiteSpace.call(this, i, t, r), n = !1), t.push(i);
  }
  return n && e.onWhiteSpace && e.onWhiteSpace.call(this, null, t, r), t;
}
const In = () => {
}, vo = 33, wo = 35, Pt = 59, jn = 123, Nn = 0;
function So(e) {
  return function() {
    return this[e]();
  };
}
function Mt(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n in e) {
    const r = e[n], i = r.parse || r;
    i && (t[n] = i);
  }
  return t;
}
function Co(e) {
  const t = {
    context: /* @__PURE__ */ Object.create(null),
    scope: Object.assign(/* @__PURE__ */ Object.create(null), e.scope),
    atrule: Mt(e.atrule),
    pseudo: Mt(e.pseudo),
    node: Mt(e.node)
  };
  for (const n in e.parseContext)
    switch (typeof e.parseContext[n]) {
      case "function":
        t.context[n] = e.parseContext[n];
        break;
      case "string":
        t.context[n] = So(e.parseContext[n]);
        break;
    }
  return {
    config: t,
    ...t,
    ...t.node
  };
}
function Ao(e) {
  let t = "", n = "<unknown>", r = !1, i = In, o = !1;
  const s = new bo(), u = Object.assign(new ko(), Co(e || {}), {
    parseAtrulePrelude: !0,
    parseRulePrelude: !0,
    parseValue: !0,
    parseCustomProperty: !1,
    readSequence: xo,
    consumeUntilBalanceEnd: () => 0,
    consumeUntilLeftCurlyBracket(a) {
      return a === jn ? 1 : 0;
    },
    consumeUntilLeftCurlyBracketOrSemicolon(a) {
      return a === jn || a === Pt ? 1 : 0;
    },
    consumeUntilExclamationMarkOrSemicolon(a) {
      return a === vo || a === Pt ? 1 : 0;
    },
    consumeUntilSemicolonIncluded(a) {
      return a === Pt ? 2 : 0;
    },
    createList() {
      return new R();
    },
    createSingleNodeList(a) {
      return new R().appendData(a);
    },
    getFirstListNode(a) {
      return a && a.first;
    },
    getLastListNode(a) {
      return a && a.last;
    },
    parseWithFallback(a, l) {
      const d = this.tokenIndex;
      try {
        return a.call(this);
      } catch (m) {
        if (o)
          throw m;
        const b = l.call(this, d);
        return o = !0, i(m, b), o = !1, b;
      }
    },
    lookupNonWSType(a) {
      let l;
      do
        if (l = this.lookupType(a++), l !== P)
          return l;
      while (l !== Nn);
      return Nn;
    },
    charCodeAt(a) {
      return a >= 0 && a < t.length ? t.charCodeAt(a) : 0;
    },
    substring(a, l) {
      return t.substring(a, l);
    },
    substrToCursor(a) {
      return this.source.substring(a, this.tokenStart);
    },
    cmpChar(a, l) {
      return ze(t, a, l);
    },
    cmpStr(a, l, d) {
      return We(t, a, l, d);
    },
    consume(a) {
      const l = this.tokenStart;
      return this.eat(a), this.substrToCursor(l);
    },
    consumeFunctionName() {
      const a = t.substring(this.tokenStart, this.tokenEnd - 1);
      return this.eat(C), a;
    },
    consumeNumber(a) {
      const l = t.substring(this.tokenStart, xt(t, this.tokenStart));
      return this.eat(a), l;
    },
    eat(a) {
      if (this.tokenType !== a) {
        const l = Er[a].slice(0, -6).replace(/-/g, " ").replace(/^./, (b) => b.toUpperCase());
        let d = `${/[[\](){}]/.test(l) ? `"${l}"` : l} is expected`, m = this.tokenStart;
        switch (a) {
          case g:
            this.tokenType === C || this.tokenType === U ? (m = this.tokenEnd - 1, d = "Identifier is expected but function found") : d = "Identifier is expected";
            break;
          case E:
            this.isDelim(wo) && (this.next(), m++, d = "Name is expected");
            break;
          case z:
            this.tokenType === k && (m = this.tokenEnd, d = "Percent sign is expected");
            break;
        }
        this.error(d, m);
      }
      this.next();
    },
    eatIdent(a) {
      (this.tokenType !== g || this.lookupValue(0, a) === !1) && this.error(`Identifier "${a}" is expected`), this.next();
    },
    eatDelim(a) {
      this.isDelim(a) || this.error(`Delim "${String.fromCharCode(a)}" is expected`), this.next();
    },
    getLocation(a, l) {
      return r ? s.getLocationRange(
        a,
        l,
        n
      ) : null;
    },
    getLocationFromList(a) {
      if (r) {
        const l = this.getFirstListNode(a), d = this.getLastListNode(a);
        return s.getLocationRange(
          l !== null ? l.loc.start.offset - s.startOffset : this.tokenStart,
          d !== null ? d.loc.end.offset - s.startOffset : this.tokenStart,
          n
        );
      }
      return null;
    },
    error(a, l) {
      const d = typeof l < "u" && l < t.length ? s.getLocation(l) : this.eof ? s.getLocation(fo(t, t.length - 1)) : s.getLocation(this.tokenStart);
      throw new Mn(
        a || "Unexpected input",
        t,
        d.offset,
        d.line,
        d.column
      );
    }
  });
  return Object.assign(function(a, l) {
    t = a, l = l || {}, u.setSource(t, vt), s.setSource(
      t,
      l.offset,
      l.line,
      l.column
    ), n = l.filename || "<unknown>", r = !!l.positions, i = typeof l.onParseError == "function" ? l.onParseError : In, o = !1, u.parseAtrulePrelude = "parseAtrulePrelude" in l ? !!l.parseAtrulePrelude : !0, u.parseRulePrelude = "parseRulePrelude" in l ? !!l.parseRulePrelude : !0, u.parseValue = "parseValue" in l ? !!l.parseValue : !0, u.parseCustomProperty = "parseCustomProperty" in l ? !!l.parseCustomProperty : !1;
    const { context: d = "default", onComment: m } = l;
    if (!(d in u.context))
      throw new Error("Unknown context `" + d + "`");
    typeof m == "function" && u.forEachToken((T, G, D) => {
      if (T === W) {
        const x = u.getLocation(G, D), $ = We(t, D - 2, D, "*/") ? t.slice(G + 2, D - 2) : t.slice(G + 2, D);
        m($, x);
      }
    });
    const b = u.context[d].call(u, l);
    return u.eof || u.error(), b;
  }, {
    SyntaxError: Mn,
    config: u.config
  });
}
var un = {}, hn = {}, Dn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
hn.encode = function(e) {
  if (0 <= e && e < Dn.length)
    return Dn[e];
  throw new TypeError("Must be between 0 and 63: " + e);
};
hn.decode = function(e) {
  var t = 65, n = 90, r = 97, i = 122, o = 48, s = 57, u = 43, c = 47, a = 26, l = 52;
  return t <= e && e <= n ? e - t : r <= e && e <= i ? e - r + a : o <= e && e <= s ? e - o + l : e == u ? 62 : e == c ? 63 : -1;
};
var zr = hn, pn = 5, Pr = 1 << pn, Mr = Pr - 1, Ir = Pr;
function To(e) {
  return e < 0 ? (-e << 1) + 1 : (e << 1) + 0;
}
function _o(e) {
  var t = (e & 1) === 1, n = e >> 1;
  return t ? -n : n;
}
un.encode = function(t) {
  var n = "", r, i = To(t);
  do
    r = i & Mr, i >>>= pn, i > 0 && (r |= Ir), n += zr.encode(r);
  while (i > 0);
  return n;
};
un.decode = function(t, n, r) {
  var i = t.length, o = 0, s = 0, u, c;
  do {
    if (n >= i)
      throw new Error("Expected more digits in base 64 VLQ value.");
    if (c = zr.decode(t.charCodeAt(n++)), c === -1)
      throw new Error("Invalid base64 digit: " + t.charAt(n - 1));
    u = !!(c & Ir), c &= Mr, o = o + (c << s), s += pn;
  } while (u);
  r.value = _o(o), r.rest = n;
};
var St = {};
(function(e) {
  function t(h, p, y) {
    if (p in h)
      return h[p];
    if (arguments.length === 3)
      return y;
    throw new Error('"' + p + '" is a required argument.');
  }
  e.getArg = t;
  var n = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/, r = /^data:.+\,.+$/;
  function i(h) {
    var p = h.match(n);
    return p ? {
      scheme: p[1],
      auth: p[2],
      host: p[3],
      port: p[4],
      path: p[5]
    } : null;
  }
  e.urlParse = i;
  function o(h) {
    var p = "";
    return h.scheme && (p += h.scheme + ":"), p += "//", h.auth && (p += h.auth + "@"), h.host && (p += h.host), h.port && (p += ":" + h.port), h.path && (p += h.path), p;
  }
  e.urlGenerate = o;
  var s = 32;
  function u(h) {
    var p = [];
    return function(y) {
      for (var f = 0; f < p.length; f++)
        if (p[f].input === y) {
          var me = p[0];
          return p[0] = p[f], p[f] = me, p[0].result;
        }
      var oe = h(y);
      return p.unshift({
        input: y,
        result: oe
      }), p.length > s && p.pop(), oe;
    };
  }
  var c = u(function(p) {
    var y = p, f = i(p);
    if (f) {
      if (!f.path)
        return p;
      y = f.path;
    }
    for (var me = e.isAbsolute(y), oe = [], Ye = 0, V = 0; ; )
      if (Ye = V, V = y.indexOf("/", Ye), V === -1) {
        oe.push(y.slice(Ye));
        break;
      } else
        for (oe.push(y.slice(Ye, V)); V < y.length && y[V] === "/"; )
          V++;
    for (var Xe, je = 0, V = oe.length - 1; V >= 0; V--)
      Xe = oe[V], Xe === "." ? oe.splice(V, 1) : Xe === ".." ? je++ : je > 0 && (Xe === "" ? (oe.splice(V + 1, je), je = 0) : (oe.splice(V, 2), je--));
    return y = oe.join("/"), y === "" && (y = me ? "/" : "."), f ? (f.path = y, o(f)) : y;
  });
  e.normalize = c;
  function a(h, p) {
    h === "" && (h = "."), p === "" && (p = ".");
    var y = i(p), f = i(h);
    if (f && (h = f.path || "/"), y && !y.scheme)
      return f && (y.scheme = f.scheme), o(y);
    if (y || p.match(r))
      return p;
    if (f && !f.host && !f.path)
      return f.host = p, o(f);
    var me = p.charAt(0) === "/" ? p : c(h.replace(/\/+$/, "") + "/" + p);
    return f ? (f.path = me, o(f)) : me;
  }
  e.join = a, e.isAbsolute = function(h) {
    return h.charAt(0) === "/" || n.test(h);
  };
  function l(h, p) {
    h === "" && (h = "."), h = h.replace(/\/$/, "");
    for (var y = 0; p.indexOf(h + "/") !== 0; ) {
      var f = h.lastIndexOf("/");
      if (f < 0 || (h = h.slice(0, f), h.match(/^([^\/]+:\/)?\/*$/)))
        return p;
      ++y;
    }
    return Array(y + 1).join("../") + p.substr(h.length + 1);
  }
  e.relative = l;
  var d = function() {
    var h = /* @__PURE__ */ Object.create(null);
    return !("__proto__" in h);
  }();
  function m(h) {
    return h;
  }
  function b(h) {
    return G(h) ? "$" + h : h;
  }
  e.toSetString = d ? m : b;
  function T(h) {
    return G(h) ? h.slice(1) : h;
  }
  e.fromSetString = d ? m : T;
  function G(h) {
    if (!h)
      return !1;
    var p = h.length;
    if (p < 9 || h.charCodeAt(p - 1) !== 95 || h.charCodeAt(p - 2) !== 95 || h.charCodeAt(p - 3) !== 111 || h.charCodeAt(p - 4) !== 116 || h.charCodeAt(p - 5) !== 111 || h.charCodeAt(p - 6) !== 114 || h.charCodeAt(p - 7) !== 112 || h.charCodeAt(p - 8) !== 95 || h.charCodeAt(p - 9) !== 95)
      return !1;
    for (var y = p - 10; y >= 0; y--)
      if (h.charCodeAt(y) !== 36)
        return !1;
    return !0;
  }
  function D(h, p, y) {
    var f = v(h.source, p.source);
    return f !== 0 || (f = h.originalLine - p.originalLine, f !== 0) || (f = h.originalColumn - p.originalColumn, f !== 0 || y) || (f = h.generatedColumn - p.generatedColumn, f !== 0) || (f = h.generatedLine - p.generatedLine, f !== 0) ? f : v(h.name, p.name);
  }
  e.compareByOriginalPositions = D;
  function x(h, p, y) {
    var f;
    return f = h.originalLine - p.originalLine, f !== 0 || (f = h.originalColumn - p.originalColumn, f !== 0 || y) || (f = h.generatedColumn - p.generatedColumn, f !== 0) || (f = h.generatedLine - p.generatedLine, f !== 0) ? f : v(h.name, p.name);
  }
  e.compareByOriginalPositionsNoSource = x;
  function $(h, p, y) {
    var f = h.generatedLine - p.generatedLine;
    return f !== 0 || (f = h.generatedColumn - p.generatedColumn, f !== 0 || y) || (f = v(h.source, p.source), f !== 0) || (f = h.originalLine - p.originalLine, f !== 0) || (f = h.originalColumn - p.originalColumn, f !== 0) ? f : v(h.name, p.name);
  }
  e.compareByGeneratedPositionsDeflated = $;
  function ce(h, p, y) {
    var f = h.generatedColumn - p.generatedColumn;
    return f !== 0 || y || (f = v(h.source, p.source), f !== 0) || (f = h.originalLine - p.originalLine, f !== 0) || (f = h.originalColumn - p.originalColumn, f !== 0) ? f : v(h.name, p.name);
  }
  e.compareByGeneratedPositionsDeflatedNoLine = ce;
  function v(h, p) {
    return h === p ? 0 : h === null ? 1 : p === null ? -1 : h > p ? 1 : -1;
  }
  function X(h, p) {
    var y = h.generatedLine - p.generatedLine;
    return y !== 0 || (y = h.generatedColumn - p.generatedColumn, y !== 0) || (y = v(h.source, p.source), y !== 0) || (y = h.originalLine - p.originalLine, y !== 0) || (y = h.originalColumn - p.originalColumn, y !== 0) ? y : v(h.name, p.name);
  }
  e.compareByGeneratedPositionsInflated = X;
  function ie(h) {
    return JSON.parse(h.replace(/^\)]}'[^\n]*\n/, ""));
  }
  e.parseSourceMapInput = ie;
  function j(h, p, y) {
    if (p = p || "", h && (h[h.length - 1] !== "/" && p[0] !== "/" && (h += "/"), p = h + p), y) {
      var f = i(y);
      if (!f)
        throw new Error("sourceMapURL could not be parsed");
      if (f.path) {
        var me = f.path.lastIndexOf("/");
        me >= 0 && (f.path = f.path.substring(0, me + 1));
      }
      p = a(o(f), p);
    }
    return c(p);
  }
  e.computeSourceURL = j;
})(St);
var jr = {}, dn = St, fn = Object.prototype.hasOwnProperty, Ce = typeof Map < "u";
function be() {
  this._array = [], this._set = Ce ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
}
be.fromArray = function(t, n) {
  for (var r = new be(), i = 0, o = t.length; i < o; i++)
    r.add(t[i], n);
  return r;
};
be.prototype.size = function() {
  return Ce ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};
be.prototype.add = function(t, n) {
  var r = Ce ? t : dn.toSetString(t), i = Ce ? this.has(t) : fn.call(this._set, r), o = this._array.length;
  (!i || n) && this._array.push(t), i || (Ce ? this._set.set(t, o) : this._set[r] = o);
};
be.prototype.has = function(t) {
  if (Ce)
    return this._set.has(t);
  var n = dn.toSetString(t);
  return fn.call(this._set, n);
};
be.prototype.indexOf = function(t) {
  if (Ce) {
    var n = this._set.get(t);
    if (n >= 0)
      return n;
  } else {
    var r = dn.toSetString(t);
    if (fn.call(this._set, r))
      return this._set[r];
  }
  throw new Error('"' + t + '" is not in the set.');
};
be.prototype.at = function(t) {
  if (t >= 0 && t < this._array.length)
    return this._array[t];
  throw new Error("No element indexed by " + t);
};
be.prototype.toArray = function() {
  return this._array.slice();
};
jr.ArraySet = be;
var Nr = {}, Dr = St;
function Oo(e, t) {
  var n = e.generatedLine, r = t.generatedLine, i = e.generatedColumn, o = t.generatedColumn;
  return r > n || r == n && o >= i || Dr.compareByGeneratedPositionsInflated(e, t) <= 0;
}
function Ct() {
  this._array = [], this._sorted = !0, this._last = { generatedLine: -1, generatedColumn: 0 };
}
Ct.prototype.unsortedForEach = function(t, n) {
  this._array.forEach(t, n);
};
Ct.prototype.add = function(t) {
  Oo(this._last, t) ? (this._last = t, this._array.push(t)) : (this._sorted = !1, this._array.push(t));
};
Ct.prototype.toArray = function() {
  return this._sorted || (this._array.sort(Dr.compareByGeneratedPositionsInflated), this._sorted = !0), this._array;
};
Nr.MappingList = Ct;
var Ne = un, M = St, dt = jr.ArraySet, $o = Nr.MappingList;
function re(e) {
  e || (e = {}), this._file = M.getArg(e, "file", null), this._sourceRoot = M.getArg(e, "sourceRoot", null), this._skipValidation = M.getArg(e, "skipValidation", !1), this._ignoreInvalidMapping = M.getArg(e, "ignoreInvalidMapping", !1), this._sources = new dt(), this._names = new dt(), this._mappings = new $o(), this._sourcesContents = null;
}
re.prototype._version = 3;
re.fromSourceMap = function(t, n) {
  var r = t.sourceRoot, i = new re(Object.assign(n || {}, {
    file: t.file,
    sourceRoot: r
  }));
  return t.eachMapping(function(o) {
    var s = {
      generated: {
        line: o.generatedLine,
        column: o.generatedColumn
      }
    };
    o.source != null && (s.source = o.source, r != null && (s.source = M.relative(r, s.source)), s.original = {
      line: o.originalLine,
      column: o.originalColumn
    }, o.name != null && (s.name = o.name)), i.addMapping(s);
  }), t.sources.forEach(function(o) {
    var s = o;
    r !== null && (s = M.relative(r, o)), i._sources.has(s) || i._sources.add(s);
    var u = t.sourceContentFor(o);
    u != null && i.setSourceContent(o, u);
  }), i;
};
re.prototype.addMapping = function(t) {
  var n = M.getArg(t, "generated"), r = M.getArg(t, "original", null), i = M.getArg(t, "source", null), o = M.getArg(t, "name", null);
  !this._skipValidation && this._validateMapping(n, r, i, o) === !1 || (i != null && (i = String(i), this._sources.has(i) || this._sources.add(i)), o != null && (o = String(o), this._names.has(o) || this._names.add(o)), this._mappings.add({
    generatedLine: n.line,
    generatedColumn: n.column,
    originalLine: r != null && r.line,
    originalColumn: r != null && r.column,
    source: i,
    name: o
  }));
};
re.prototype.setSourceContent = function(t, n) {
  var r = t;
  this._sourceRoot != null && (r = M.relative(this._sourceRoot, r)), n != null ? (this._sourcesContents || (this._sourcesContents = /* @__PURE__ */ Object.create(null)), this._sourcesContents[M.toSetString(r)] = n) : this._sourcesContents && (delete this._sourcesContents[M.toSetString(r)], Object.keys(this._sourcesContents).length === 0 && (this._sourcesContents = null));
};
re.prototype.applySourceMap = function(t, n, r) {
  var i = n;
  if (n == null) {
    if (t.file == null)
      throw new Error(
        `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`
      );
    i = t.file;
  }
  var o = this._sourceRoot;
  o != null && (i = M.relative(o, i));
  var s = new dt(), u = new dt();
  this._mappings.unsortedForEach(function(c) {
    if (c.source === i && c.originalLine != null) {
      var a = t.originalPositionFor({
        line: c.originalLine,
        column: c.originalColumn
      });
      a.source != null && (c.source = a.source, r != null && (c.source = M.join(r, c.source)), o != null && (c.source = M.relative(o, c.source)), c.originalLine = a.line, c.originalColumn = a.column, a.name != null && (c.name = a.name));
    }
    var l = c.source;
    l != null && !s.has(l) && s.add(l);
    var d = c.name;
    d != null && !u.has(d) && u.add(d);
  }, this), this._sources = s, this._names = u, t.sources.forEach(function(c) {
    var a = t.sourceContentFor(c);
    a != null && (r != null && (c = M.join(r, c)), o != null && (c = M.relative(o, c)), this.setSourceContent(c, a));
  }, this);
};
re.prototype._validateMapping = function(t, n, r, i) {
  if (n && typeof n.line != "number" && typeof n.column != "number") {
    var o = "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.";
    if (this._ignoreInvalidMapping)
      return typeof console < "u" && console.warn && console.warn(o), !1;
    throw new Error(o);
  }
  if (!(t && "line" in t && "column" in t && t.line > 0 && t.column >= 0 && !n && !r && !i)) {
    if (t && "line" in t && "column" in t && n && "line" in n && "column" in n && t.line > 0 && t.column >= 0 && n.line > 0 && n.column >= 0 && r)
      return;
    var o = "Invalid mapping: " + JSON.stringify({
      generated: t,
      source: r,
      original: n,
      name: i
    });
    if (this._ignoreInvalidMapping)
      return typeof console < "u" && console.warn && console.warn(o), !1;
    throw new Error(o);
  }
};
re.prototype._serializeMappings = function() {
  for (var t = 0, n = 1, r = 0, i = 0, o = 0, s = 0, u = "", c, a, l, d, m = this._mappings.toArray(), b = 0, T = m.length; b < T; b++) {
    if (a = m[b], c = "", a.generatedLine !== n)
      for (t = 0; a.generatedLine !== n; )
        c += ";", n++;
    else if (b > 0) {
      if (!M.compareByGeneratedPositionsInflated(a, m[b - 1]))
        continue;
      c += ",";
    }
    c += Ne.encode(a.generatedColumn - t), t = a.generatedColumn, a.source != null && (d = this._sources.indexOf(a.source), c += Ne.encode(d - s), s = d, c += Ne.encode(a.originalLine - 1 - i), i = a.originalLine - 1, c += Ne.encode(a.originalColumn - r), r = a.originalColumn, a.name != null && (l = this._names.indexOf(a.name), c += Ne.encode(l - o), o = l)), u += c;
  }
  return u;
};
re.prototype._generateSourcesContent = function(t, n) {
  return t.map(function(r) {
    if (!this._sourcesContents)
      return null;
    n != null && (r = M.relative(n, r));
    var i = M.toSetString(r);
    return Object.prototype.hasOwnProperty.call(this._sourcesContents, i) ? this._sourcesContents[i] : null;
  }, this);
};
re.prototype.toJSON = function() {
  var t = {
    version: this._version,
    sources: this._sources.toArray(),
    names: this._names.toArray(),
    mappings: this._serializeMappings()
  };
  return this._file != null && (t.file = this._file), this._sourceRoot != null && (t.sourceRoot = this._sourceRoot), this._sourcesContents && (t.sourcesContent = this._generateSourcesContent(t.sources, t.sourceRoot)), t;
};
re.prototype.toString = function() {
  return JSON.stringify(this.toJSON());
};
var Lo = re;
const Rn = /* @__PURE__ */ new Set(["Atrule", "Selector", "Declaration"]);
function Eo(e) {
  const t = new Lo(), n = {
    line: 1,
    column: 0
  }, r = {
    line: 0,
    // should be zero to add first mapping
    column: 0
  }, i = {
    line: 1,
    column: 0
  }, o = {
    generated: i
  };
  let s = 1, u = 0, c = !1;
  const a = e.node;
  e.node = function(m) {
    if (m.loc && m.loc.start && Rn.has(m.type)) {
      const b = m.loc.start.line, T = m.loc.start.column - 1;
      (r.line !== b || r.column !== T) && (r.line = b, r.column = T, n.line = s, n.column = u, c && (c = !1, (n.line !== i.line || n.column !== i.column) && t.addMapping(o)), c = !0, t.addMapping({
        source: m.loc.source,
        original: r,
        generated: n
      }));
    }
    a.call(this, m), c && Rn.has(m.type) && (i.line = s, i.column = u);
  };
  const l = e.emit;
  e.emit = function(m, b, T) {
    for (let G = 0; G < m.length; G++)
      m.charCodeAt(G) === 10 ? (s++, u = 0) : u++;
    l(m, b, T);
  };
  const d = e.result;
  return e.result = function() {
    return c && t.addMapping(o), {
      css: d(),
      map: t
    };
  }, e;
}
const zo = 43, Po = 45, It = (e, t) => {
  if (e === S && (e = t), typeof e == "string") {
    const n = e.charCodeAt(0);
    return n > 127 ? 32768 : n << 8;
  }
  return e;
}, Rr = [
  [g, g],
  [g, C],
  [g, U],
  [g, K],
  [g, "-"],
  [g, k],
  [g, z],
  [g, w],
  [g, Q],
  [g, N],
  [I, g],
  [I, C],
  [I, U],
  [I, K],
  [I, "-"],
  [I, k],
  [I, z],
  [I, w],
  [I, Q],
  [E, g],
  [E, C],
  [E, U],
  [E, K],
  [E, "-"],
  [E, k],
  [E, z],
  [E, w],
  [E, Q],
  [w, g],
  [w, C],
  [w, U],
  [w, K],
  [w, "-"],
  [w, k],
  [w, z],
  [w, w],
  [w, Q],
  ["#", g],
  ["#", C],
  ["#", U],
  ["#", K],
  ["#", "-"],
  ["#", k],
  ["#", z],
  ["#", w],
  ["#", Q],
  // https://github.com/w3c/csswg-drafts/pull/6874
  ["-", g],
  ["-", C],
  ["-", U],
  ["-", K],
  ["-", "-"],
  ["-", k],
  ["-", z],
  ["-", w],
  ["-", Q],
  // https://github.com/w3c/csswg-drafts/pull/6874
  [k, g],
  [k, C],
  [k, U],
  [k, K],
  [k, k],
  [k, z],
  [k, w],
  [k, "%"],
  [k, Q],
  // https://github.com/w3c/csswg-drafts/pull/6874
  ["@", g],
  ["@", C],
  ["@", U],
  ["@", K],
  ["@", "-"],
  ["@", Q],
  // https://github.com/w3c/csswg-drafts/pull/6874
  [".", k],
  [".", z],
  [".", w],
  ["+", k],
  ["+", z],
  ["+", w],
  ["/", "*"]
], Mo = Rr.concat([
  [g, E],
  [w, E],
  [E, E],
  [I, N],
  [I, de],
  [I, q],
  [z, z],
  [z, w],
  [z, C],
  [z, "-"],
  [O, g],
  [O, C],
  [O, z],
  [O, w],
  [O, E],
  [O, "-"]
]);
function Fr(e) {
  const t = new Set(
    e.map(([n, r]) => It(n) << 16 | It(r))
  );
  return function(n, r, i) {
    const o = It(r, i), s = i.charCodeAt(0);
    return (s === Po && r !== g && r !== C && r !== Q || s === zo ? t.has(n << 16 | s << 8) : t.has(n << 16 | o)) && this.emit(" ", P, !0), o;
  };
}
const Io = Fr(Rr), Br = Fr(Mo), Fn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  safe: Br,
  spec: Io
}, Symbol.toStringTag, { value: "Module" })), jo = 92;
function No(e, t) {
  if (typeof t == "function") {
    let n = null;
    e.children.forEach((r) => {
      n !== null && t.call(this, n), this.node(r), n = r;
    });
    return;
  }
  e.children.forEach(this.node, this);
}
function Do(e) {
  vt(e, (t, n, r) => {
    this.token(t, e.slice(n, r));
  });
}
function Ro(e) {
  const t = /* @__PURE__ */ new Map();
  for (let n in e.node) {
    const r = e.node[n];
    typeof (r.generate || r) == "function" && t.set(n, r.generate || r);
  }
  return function(n, r) {
    let i = "", o = 0, s = {
      node(c) {
        if (t.has(c.type))
          t.get(c.type).call(u, c);
        else
          throw new Error("Unknown node type: " + c.type);
      },
      tokenBefore: Br,
      token(c, a) {
        o = this.tokenBefore(o, c, a), this.emit(a, c, !1), c === S && a.charCodeAt(0) === jo && this.emit(`
`, P, !0);
      },
      emit(c) {
        i += c;
      },
      result() {
        return i;
      }
    };
    r && (typeof r.decorator == "function" && (s = r.decorator(s)), r.sourceMap && (s = Eo(s)), r.mode in Fn && (s.tokenBefore = Fn[r.mode]));
    const u = {
      node: (c) => s.node(c),
      children: No,
      token: (c, a) => s.token(c, a),
      tokenize: Do
    };
    return s.node(n), s.result();
  };
}
function Fo(e) {
  return {
    fromPlainObject(t) {
      return e(t, {
        enter(n) {
          n.children && !(n.children instanceof R) && (n.children = new R().fromArray(n.children));
        }
      }), t;
    },
    toPlainObject(t) {
      return e(t, {
        leave(n) {
          n.children && n.children instanceof R && (n.children = n.children.toArray());
        }
      }), t;
    }
  };
}
const { hasOwnProperty: mn } = Object.prototype, Re = function() {
};
function Bn(e) {
  return typeof e == "function" ? e : Re;
}
function Un(e, t) {
  return function(n, r, i) {
    n.type === t && e.call(this, n, r, i);
  };
}
function Bo(e, t) {
  const n = t.structure, r = [];
  for (const i in n) {
    if (mn.call(n, i) === !1)
      continue;
    let o = n[i];
    const s = {
      name: i,
      type: !1,
      nullable: !1
    };
    Array.isArray(o) || (o = [o]);
    for (const u of o)
      u === null ? s.nullable = !0 : typeof u == "string" ? s.type = "node" : Array.isArray(u) && (s.type = "list");
    s.type && r.push(s);
  }
  return r.length ? {
    context: t.walkContext,
    fields: r
  } : null;
}
function Uo(e) {
  const t = {};
  for (const n in e.node)
    if (mn.call(e.node, n)) {
      const r = e.node[n];
      if (!r.structure)
        throw new Error("Missed `structure` field in `" + n + "` node type definition");
      t[n] = Bo(n, r);
    }
  return t;
}
function qn(e, t) {
  const n = e.fields.slice(), r = e.context, i = typeof r == "string";
  return t && n.reverse(), function(o, s, u, c) {
    let a;
    i && (a = s[r], s[r] = o);
    for (const l of n) {
      const d = o[l.name];
      if (!l.nullable || d) {
        if (l.type === "list") {
          if (t ? d.reduceRight(c, !1) : d.reduce(c, !1))
            return !0;
        } else if (u(d))
          return !0;
      }
    }
    i && (s[r] = a);
  };
}
function Hn({
  StyleSheet: e,
  Atrule: t,
  Rule: n,
  Block: r,
  DeclarationList: i
}) {
  return {
    Atrule: {
      StyleSheet: e,
      Atrule: t,
      Rule: n,
      Block: r
    },
    Rule: {
      StyleSheet: e,
      Atrule: t,
      Rule: n,
      Block: r
    },
    Declaration: {
      StyleSheet: e,
      Atrule: t,
      Rule: n,
      Block: r,
      DeclarationList: i
    }
  };
}
function qo(e) {
  const t = Uo(e), n = {}, r = {}, i = Symbol("break-walk"), o = Symbol("skip-node");
  for (const a in t)
    mn.call(t, a) && t[a] !== null && (n[a] = qn(t[a], !1), r[a] = qn(t[a], !0));
  const s = Hn(n), u = Hn(r), c = function(a, l) {
    function d(x, $, ce) {
      const v = m.call(D, x, $, ce);
      return v === i ? !0 : v === o ? !1 : !!(T.hasOwnProperty(x.type) && T[x.type](x, D, d, G) || b.call(D, x, $, ce) === i);
    }
    let m = Re, b = Re, T = n, G = (x, $, ce, v) => x || d($, ce, v);
    const D = {
      break: i,
      skip: o,
      root: a,
      stylesheet: null,
      atrule: null,
      atrulePrelude: null,
      rule: null,
      selector: null,
      block: null,
      declaration: null,
      function: null
    };
    if (typeof l == "function")
      m = l;
    else if (l && (m = Bn(l.enter), b = Bn(l.leave), l.reverse && (T = r), l.visit)) {
      if (s.hasOwnProperty(l.visit))
        T = l.reverse ? u[l.visit] : s[l.visit];
      else if (!t.hasOwnProperty(l.visit))
        throw new Error("Bad value `" + l.visit + "` for `visit` option (should be: " + Object.keys(t).sort().join(", ") + ")");
      m = Un(m, l.visit), b = Un(b, l.visit);
    }
    if (m === Re && b === Re)
      throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
    d(a);
  };
  return c.break = i, c.skip = o, c.find = function(a, l) {
    let d = null;
    return c(a, function(m, b, T) {
      if (l.call(this, m, b, T))
        return d = m, i;
    }), d;
  }, c.findLast = function(a, l) {
    let d = null;
    return c(a, {
      reverse: !0,
      enter(m, b, T) {
        if (l.call(this, m, b, T))
          return d = m, i;
      }
    }), d;
  }, c.findAll = function(a, l) {
    const d = [];
    return c(a, function(m, b, T) {
      l.call(this, m, b, T) && d.push(m);
    }), d;
  }, c;
}
function Ho(e) {
  return e;
}
function Go(e) {
  const { min: t, max: n, comma: r } = e;
  return t === 0 && n === 0 ? r ? "#?" : "*" : t === 0 && n === 1 ? "?" : t === 1 && n === 0 ? r ? "#" : "+" : t === 1 && n === 1 ? "" : (r ? "#" : "") + (t === n ? "{" + t + "}" : "{" + t + "," + (n !== 0 ? n : "") + "}");
}
function Wo(e) {
  switch (e.type) {
    case "Range":
      return " [" + (e.min === null ? "-∞" : e.min) + "," + (e.max === null ? "∞" : e.max) + "]";
    default:
      throw new Error("Unknown node type `" + e.type + "`");
  }
}
function Vo(e, t, n, r) {
  const i = e.combinator === " " || r ? e.combinator : " " + e.combinator + " ", o = e.terms.map((s) => gn(s, t, n, r)).join(i);
  return e.explicit || n ? (r || o[0] === "," ? "[" : "[ ") + o + (r ? "]" : " ]") : o;
}
function gn(e, t, n, r) {
  let i;
  switch (e.type) {
    case "Group":
      i = Vo(e, t, n, r) + (e.disallowEmpty ? "!" : "");
      break;
    case "Multiplier":
      return gn(e.term, t, n, r) + t(Go(e), e);
    case "Type":
      i = "<" + e.name + (e.opts ? t(Wo(e.opts), e.opts) : "") + ">";
      break;
    case "Property":
      i = "<'" + e.name + "'>";
      break;
    case "Keyword":
      i = e.name;
      break;
    case "AtKeyword":
      i = "@" + e.name;
      break;
    case "Function":
      i = e.name + "(";
      break;
    case "String":
    case "Token":
      i = e.value;
      break;
    case "Comma":
      i = ",";
      break;
    default:
      throw new Error("Unknown node type `" + e.type + "`");
  }
  return t(i, e);
}
function bn(e, t) {
  let n = Ho, r = !1, i = !1;
  return typeof t == "function" ? n = t : t && (r = !!t.forceBraces, i = !!t.compact, typeof t.decorate == "function" && (n = t.decorate)), gn(e, n, r, i);
}
const Gn = { offset: 0, line: 1, column: 1 };
function Ko(e, t) {
  const n = e.tokens, r = e.longestMatch, i = r < n.length && n[r].node || null, o = i !== t ? i : null;
  let s = 0, u = 0, c = 0, a = "", l, d;
  for (let m = 0; m < n.length; m++) {
    const b = n[m].value;
    m === r && (u = b.length, s = a.length), o !== null && n[m].node === o && (m <= r ? c++ : c = 0), a += b;
  }
  return r === n.length || c > 1 ? (l = et(o || t, "end") || Fe(Gn, a), d = Fe(l)) : (l = et(o, "start") || Fe(et(t, "start") || Gn, a.slice(0, s)), d = et(o, "end") || Fe(l, a.substr(s, u))), {
    css: a,
    mismatchOffset: s,
    mismatchLength: u,
    start: l,
    end: d
  };
}
function et(e, t) {
  const n = e && e.loc && e.loc[t];
  return n ? "line" in n ? Fe(n) : n : null;
}
function Fe({ offset: e, line: t, column: n }, r) {
  const i = {
    offset: e,
    line: t,
    column: n
  };
  if (r) {
    const o = r.split(/\n|\r\n?|\f/);
    i.offset += r.length, i.line += o.length - 1, i.column = o.length === 1 ? i.column + r.length : o.pop().length + 1;
  }
  return i;
}
const De = function(e, t) {
  const n = wt(
    "SyntaxReferenceError",
    e + (t ? " `" + t + "`" : "")
  );
  return n.reference = t, n;
}, Qo = function(e, t, n, r) {
  const i = wt("SyntaxMatchError", e), {
    css: o,
    mismatchOffset: s,
    mismatchLength: u,
    start: c,
    end: a
  } = Ko(r, n);
  return i.rawMessage = e, i.syntax = t ? bn(t) : "<generic>", i.css = o, i.mismatchOffset = s, i.mismatchLength = u, i.message = e + `
  syntax: ` + i.syntax + `
   value: ` + (o || "<empty string>") + `
  --------` + new Array(i.mismatchOffset + 1).join("-") + "^", Object.assign(i, c), i.loc = {
    source: n && n.loc && n.loc.source || "<unknown>",
    start: c,
    end: a
  }, i;
}, tt = /* @__PURE__ */ new Map(), _e = /* @__PURE__ */ new Map(), ft = 45, jt = Yo, Wn = Xo;
function yn(e, t) {
  return t = t || 0, e.length - t >= 2 && e.charCodeAt(t) === ft && e.charCodeAt(t + 1) === ft;
}
function Ur(e, t) {
  if (t = t || 0, e.length - t >= 3 && e.charCodeAt(t) === ft && e.charCodeAt(t + 1) !== ft) {
    const n = e.indexOf("-", t + 2);
    if (n !== -1)
      return e.substring(t, n + 1);
  }
  return "";
}
function Yo(e) {
  if (tt.has(e))
    return tt.get(e);
  const t = e.toLowerCase();
  let n = tt.get(t);
  if (n === void 0) {
    const r = yn(t, 0), i = r ? "" : Ur(t, 0);
    n = Object.freeze({
      basename: t.substr(i.length),
      name: t,
      prefix: i,
      vendor: i,
      custom: r
    });
  }
  return tt.set(e, n), n;
}
function Xo(e) {
  if (_e.has(e))
    return _e.get(e);
  let t = e, n = e[0];
  n === "/" ? n = e[1] === "/" ? "//" : "/" : n !== "_" && n !== "*" && n !== "$" && n !== "#" && n !== "+" && n !== "&" && (n = "");
  const r = yn(t, n.length);
  if (!r && (t = t.toLowerCase(), _e.has(t))) {
    const u = _e.get(t);
    return _e.set(e, u), u;
  }
  const i = r ? "" : Ur(t, n.length), o = t.substr(0, n.length + i.length), s = Object.freeze({
    basename: t.substr(o.length),
    name: t.substr(n.length),
    hack: n,
    vendor: i,
    prefix: o,
    custom: r
  });
  return _e.set(e, s), s;
}
const qr = [
  "initial",
  "inherit",
  "unset",
  "revert",
  "revert-layer"
], Ve = 43, ue = 45, Nt = 110, Oe = !0, Zo = !1;
function Qt(e, t) {
  return e !== null && e.type === S && e.value.charCodeAt(0) === t;
}
function He(e, t, n) {
  for (; e !== null && (e.type === P || e.type === W); )
    e = n(++t);
  return t;
}
function xe(e, t, n, r) {
  if (!e)
    return 0;
  const i = e.value.charCodeAt(t);
  if (i === Ve || i === ue) {
    if (n)
      return 0;
    t++;
  }
  for (; t < e.value.length; t++)
    if (!F(e.value.charCodeAt(t)))
      return 0;
  return r + 1;
}
function Dt(e, t, n) {
  let r = !1, i = He(e, t, n);
  if (e = n(i), e === null)
    return t;
  if (e.type !== k)
    if (Qt(e, Ve) || Qt(e, ue)) {
      if (r = !0, i = He(n(++i), i, n), e = n(i), e === null || e.type !== k)
        return 0;
    } else
      return t;
  if (!r) {
    const o = e.value.charCodeAt(0);
    if (o !== Ve && o !== ue)
      return 0;
  }
  return xe(e, r ? 0 : 1, r, i);
}
function Jo(e, t) {
  let n = 0;
  if (!e)
    return 0;
  if (e.type === k)
    return xe(e, 0, Zo, n);
  if (e.type === g && e.value.charCodeAt(0) === ue) {
    if (!ze(e.value, 1, Nt))
      return 0;
    switch (e.value.length) {
      case 2:
        return Dt(t(++n), n, t);
      case 3:
        return e.value.charCodeAt(2) !== ue ? 0 : (n = He(t(++n), n, t), e = t(n), xe(e, 0, Oe, n));
      default:
        return e.value.charCodeAt(2) !== ue ? 0 : xe(e, 3, Oe, n);
    }
  } else if (e.type === g || Qt(e, Ve) && t(n + 1).type === g) {
    if (e.type !== g && (e = t(++n)), e === null || !ze(e.value, 0, Nt))
      return 0;
    switch (e.value.length) {
      case 1:
        return Dt(t(++n), n, t);
      case 2:
        return e.value.charCodeAt(1) !== ue ? 0 : (n = He(t(++n), n, t), e = t(n), xe(e, 0, Oe, n));
      default:
        return e.value.charCodeAt(1) !== ue ? 0 : xe(e, 2, Oe, n);
    }
  } else if (e.type === w) {
    let r = e.value.charCodeAt(0), i = r === Ve || r === ue ? 1 : 0, o = i;
    for (; o < e.value.length && F(e.value.charCodeAt(o)); o++)
      ;
    return o === i || !ze(e.value, o, Nt) ? 0 : o + 1 === e.value.length ? Dt(t(++n), n, t) : e.value.charCodeAt(o + 1) !== ue ? 0 : o + 2 === e.value.length ? (n = He(t(++n), n, t), e = t(n), xe(e, 0, Oe, n)) : xe(e, o + 2, Oe, n);
  }
  return 0;
}
const ea = 43, Hr = 45, Gr = 63, ta = 117;
function Yt(e, t) {
  return e !== null && e.type === S && e.value.charCodeAt(0) === t;
}
function na(e, t) {
  return e.value.charCodeAt(0) === t;
}
function Be(e, t, n) {
  let r = 0;
  for (let i = t; i < e.value.length; i++) {
    const o = e.value.charCodeAt(i);
    if (o === Hr && n && r !== 0)
      return Be(e, t + r + 1, !1), 6;
    if (!ve(o) || ++r > 6)
      return 0;
  }
  return r;
}
function nt(e, t, n) {
  if (!e)
    return 0;
  for (; Yt(n(t), Gr); ) {
    if (++e > 6)
      return 0;
    t++;
  }
  return t;
}
function ra(e, t) {
  let n = 0;
  if (e === null || e.type !== g || !ze(e.value, 0, ta) || (e = t(++n), e === null))
    return 0;
  if (Yt(e, ea))
    return e = t(++n), e === null ? 0 : e.type === g ? nt(Be(e, 0, !0), ++n, t) : Yt(e, Gr) ? nt(1, ++n, t) : 0;
  if (e.type === k) {
    const r = Be(e, 1, !0);
    return r === 0 ? 0 : (e = t(++n), e === null ? n : e.type === w || e.type === k ? !na(e, Hr) || !Be(e, 1, !1) ? 0 : n + 1 : nt(r, n, t));
  }
  return e.type === w ? nt(Be(e, 1, !0), ++n, t) : 0;
}
const ia = ["calc(", "-moz-calc(", "-webkit-calc("], kn = /* @__PURE__ */ new Map([
  [C, O],
  [N, O],
  [J, le],
  [H, ne]
]);
function se(e, t) {
  return t < e.length ? e.charCodeAt(t) : 0;
}
function Wr(e, t) {
  return We(e, 0, e.length, t);
}
function Vr(e, t) {
  for (let n = 0; n < t.length; n++)
    if (Wr(e, t[n]))
      return !0;
  return !1;
}
function Kr(e, t) {
  return t !== e.length - 2 ? !1 : se(e, t) === 92 && // U+005C REVERSE SOLIDUS (\)
  F(se(e, t + 1));
}
function At(e, t, n) {
  if (e && e.type === "Range") {
    const r = Number(
      n !== void 0 && n !== t.length ? t.substr(0, n) : t
    );
    if (isNaN(r) || e.min !== null && r < e.min && typeof e.min != "string" || e.max !== null && r > e.max && typeof e.max != "string")
      return !0;
  }
  return !1;
}
function oa(e, t) {
  let n = 0, r = [], i = 0;
  e:
    do {
      switch (e.type) {
        case ne:
        case O:
        case le:
          if (e.type !== n)
            break e;
          if (n = r.pop(), r.length === 0) {
            i++;
            break e;
          }
          break;
        case C:
        case N:
        case J:
        case H:
          r.push(n), n = kn.get(e.type);
          break;
      }
      i++;
    } while (e = t(i));
  return i;
}
function te(e) {
  return function(t, n, r) {
    return t === null ? 0 : t.type === C && Vr(t.value, ia) ? oa(t, n) : e(t, n, r);
  };
}
function L(e) {
  return function(t) {
    return t === null || t.type !== e ? 0 : 1;
  };
}
function aa(e) {
  if (e === null || e.type !== g)
    return 0;
  const t = e.value.toLowerCase();
  return Vr(t, qr) || Wr(t, "default") ? 0 : 1;
}
function sa(e) {
  return e === null || e.type !== g || se(e.value, 0) !== 45 || se(e.value, 1) !== 45 ? 0 : 1;
}
function la(e) {
  if (e === null || e.type !== E)
    return 0;
  const t = e.value.length;
  if (t !== 4 && t !== 5 && t !== 7 && t !== 9)
    return 0;
  for (let n = 1; n < t; n++)
    if (!ve(se(e.value, n)))
      return 0;
  return 1;
}
function ca(e) {
  return e === null || e.type !== E || !ot(se(e.value, 1), se(e.value, 2), se(e.value, 3)) ? 0 : 1;
}
function ua(e, t) {
  if (!e)
    return 0;
  let n = 0, r = [], i = 0;
  e:
    do {
      switch (e.type) {
        case kt:
        case K:
          break e;
        case ne:
        case O:
        case le:
          if (e.type !== n)
            break e;
          n = r.pop();
          break;
        case Y:
          if (n === 0)
            break e;
          break;
        case S:
          if (n === 0 && e.value === "!")
            break e;
          break;
        case C:
        case N:
        case J:
        case H:
          r.push(n), n = kn.get(e.type);
          break;
      }
      i++;
    } while (e = t(i));
  return i;
}
function ha(e, t) {
  if (!e)
    return 0;
  let n = 0, r = [], i = 0;
  e:
    do {
      switch (e.type) {
        case kt:
        case K:
          break e;
        case ne:
        case O:
        case le:
          if (e.type !== n)
            break e;
          n = r.pop();
          break;
        case C:
        case N:
        case J:
        case H:
          r.push(n), n = kn.get(e.type);
          break;
      }
      i++;
    } while (e = t(i));
  return i;
}
function ge(e) {
  return e && (e = new Set(e)), function(t, n, r) {
    if (t === null || t.type !== w)
      return 0;
    const i = xt(t.value, 0);
    if (e !== null) {
      const o = t.value.indexOf("\\", i), s = o === -1 || !Kr(t.value, o) ? t.value.substr(i) : t.value.substring(i, o);
      if (e.has(s.toLowerCase()) === !1)
        return 0;
    }
    return At(r, t.value, i) ? 0 : 1;
  };
}
function pa(e, t, n) {
  return e === null || e.type !== z || At(n, e.value, e.value.length - 1) ? 0 : 1;
}
function Qr(e) {
  return typeof e != "function" && (e = function() {
    return 0;
  }), function(t, n, r) {
    return t !== null && t.type === k && Number(t.value) === 0 ? 1 : e(t, n, r);
  };
}
function da(e, t, n) {
  if (e === null)
    return 0;
  const r = xt(e.value, 0);
  return !(r === e.value.length) && !Kr(e.value, r) || At(n, e.value, r) ? 0 : 1;
}
function fa(e, t, n) {
  if (e === null || e.type !== k)
    return 0;
  let r = se(e.value, 0) === 43 || // U+002B PLUS SIGN (+)
  se(e.value, 0) === 45 ? 1 : 0;
  for (; r < e.value.length; r++)
    if (!F(se(e.value, r)))
      return 0;
  return At(n, e.value, r) ? 0 : 1;
}
const ma = {
  "ident-token": L(g),
  "function-token": L(C),
  "at-keyword-token": L(I),
  "hash-token": L(E),
  "string-token": L(de),
  "bad-string-token": L(kt),
  "url-token": L(U),
  "bad-url-token": L(K),
  "delim-token": L(S),
  "number-token": L(k),
  "percentage-token": L(z),
  "dimension-token": L(w),
  "whitespace-token": L(P),
  "CDO-token": L(Qe),
  "CDC-token": L(Q),
  "colon-token": L(q),
  "semicolon-token": L(Y),
  "comma-token": L(fe),
  "[-token": L(J),
  "]-token": L(le),
  "(-token": L(N),
  ")-token": L(O),
  "{-token": L(H),
  "}-token": L(ne)
}, ga = {
  // token type aliases
  string: L(de),
  ident: L(g),
  // percentage
  percentage: te(pa),
  // numeric
  zero: Qr(),
  number: te(da),
  integer: te(fa),
  // complex types
  "custom-ident": aa,
  "custom-property-name": sa,
  "hex-color": la,
  "id-selector": ca,
  // element( <id-selector> )
  "an-plus-b": Jo,
  urange: ra,
  "declaration-value": ua,
  "any-value": ha
};
function ba(e) {
  const {
    angle: t,
    decibel: n,
    frequency: r,
    flex: i,
    length: o,
    resolution: s,
    semitones: u,
    time: c
  } = e || {};
  return {
    dimension: te(ge(null)),
    angle: te(ge(t)),
    decibel: te(ge(n)),
    frequency: te(ge(r)),
    flex: te(ge(i)),
    length: te(Qr(ge(o))),
    resolution: te(ge(s)),
    semitones: te(ge(u)),
    time: te(ge(c))
  };
}
function ya(e) {
  return {
    ...ma,
    ...ga,
    ...ba(e)
  };
}
const ka = [
  // absolute length units https://www.w3.org/TR/css-values-3/#lengths
  "cm",
  "mm",
  "q",
  "in",
  "pt",
  "pc",
  "px",
  // font-relative length units https://drafts.csswg.org/css-values-4/#font-relative-lengths
  "em",
  "rem",
  "ex",
  "rex",
  "cap",
  "rcap",
  "ch",
  "rch",
  "ic",
  "ric",
  "lh",
  "rlh",
  // viewport-percentage lengths https://drafts.csswg.org/css-values-4/#viewport-relative-lengths
  "vw",
  "svw",
  "lvw",
  "dvw",
  "vh",
  "svh",
  "lvh",
  "dvh",
  "vi",
  "svi",
  "lvi",
  "dvi",
  "vb",
  "svb",
  "lvb",
  "dvb",
  "vmin",
  "svmin",
  "lvmin",
  "dvmin",
  "vmax",
  "svmax",
  "lvmax",
  "dvmax",
  // container relative lengths https://drafts.csswg.org/css-contain-3/#container-lengths
  "cqw",
  "cqh",
  "cqi",
  "cqb",
  "cqmin",
  "cqmax"
], xa = ["deg", "grad", "rad", "turn"], va = ["s", "ms"], wa = ["hz", "khz"], Sa = ["dpi", "dpcm", "dppx", "x"], Ca = ["fr"], Aa = ["db"], Ta = ["st"], Vn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  angle: xa,
  decibel: Aa,
  flex: Ca,
  frequency: wa,
  length: ka,
  resolution: Sa,
  semitones: Ta,
  time: va
}, Symbol.toStringTag, { value: "Module" }));
function _a(e, t, n) {
  return Object.assign(wt("SyntaxError", e), {
    input: t,
    offset: n,
    rawMessage: e,
    message: e + `
  ` + t + `
--` + new Array((n || t.length) + 1).join("-") + "^"
  });
}
const Oa = 9, $a = 10, La = 12, Ea = 13, za = 32;
class Pa {
  constructor(t) {
    this.str = t, this.pos = 0;
  }
  charCodeAt(t) {
    return t < this.str.length ? this.str.charCodeAt(t) : 0;
  }
  charCode() {
    return this.charCodeAt(this.pos);
  }
  nextCharCode() {
    return this.charCodeAt(this.pos + 1);
  }
  nextNonWsCode(t) {
    return this.charCodeAt(this.findWsEnd(t));
  }
  findWsEnd(t) {
    for (; t < this.str.length; t++) {
      const n = this.str.charCodeAt(t);
      if (n !== Ea && n !== $a && n !== La && n !== za && n !== Oa)
        break;
    }
    return t;
  }
  substringToPos(t) {
    return this.str.substring(this.pos, this.pos = t);
  }
  eat(t) {
    this.charCode() !== t && this.error("Expect `" + String.fromCharCode(t) + "`"), this.pos++;
  }
  peek() {
    return this.pos < this.str.length ? this.str.charAt(this.pos++) : "";
  }
  error(t) {
    throw new _a(t, this.str, this.pos);
  }
}
const Ma = 9, Ia = 10, ja = 12, Na = 13, Da = 32, Yr = 33, xn = 35, Kn = 38, mt = 39, Xr = 40, Ra = 41, Zr = 42, vn = 43, wn = 44, Qn = 45, Sn = 60, Jr = 62, Xt = 63, Fa = 64, Tt = 91, Cn = 93, gt = 123, Yn = 124, Xn = 125, Zn = 8734, Ke = new Uint8Array(128).map(
  (e, t) => /[a-zA-Z0-9\-]/.test(String.fromCharCode(t)) ? 1 : 0
), Jn = {
  " ": 1,
  "&&": 2,
  "||": 3,
  "|": 4
};
function bt(e) {
  return e.substringToPos(
    e.findWsEnd(e.pos)
  );
}
function Me(e) {
  let t = e.pos;
  for (; t < e.str.length; t++) {
    const n = e.str.charCodeAt(t);
    if (n >= 128 || Ke[n] === 0)
      break;
  }
  return e.pos === t && e.error("Expect a keyword"), e.substringToPos(t);
}
function yt(e) {
  let t = e.pos;
  for (; t < e.str.length; t++) {
    const n = e.str.charCodeAt(t);
    if (n < 48 || n > 57)
      break;
  }
  return e.pos === t && e.error("Expect a number"), e.substringToPos(t);
}
function Ba(e) {
  const t = e.str.indexOf("'", e.pos + 1);
  return t === -1 && (e.pos = e.str.length, e.error("Expect an apostrophe")), e.substringToPos(t + 1);
}
function er(e) {
  let t = null, n = null;
  return e.eat(gt), t = yt(e), e.charCode() === wn ? (e.pos++, e.charCode() !== Xn && (n = yt(e))) : n = t, e.eat(Xn), {
    min: Number(t),
    max: n ? Number(n) : 0
  };
}
function Ua(e) {
  let t = null, n = !1;
  switch (e.charCode()) {
    case Zr:
      e.pos++, t = {
        min: 0,
        max: 0
      };
      break;
    case vn:
      e.pos++, t = {
        min: 1,
        max: 0
      };
      break;
    case Xt:
      e.pos++, t = {
        min: 0,
        max: 1
      };
      break;
    case xn:
      e.pos++, n = !0, e.charCode() === gt ? t = er(e) : e.charCode() === Xt ? (e.pos++, t = {
        min: 0,
        max: 0
      }) : t = {
        min: 1,
        max: 0
      };
      break;
    case gt:
      t = er(e);
      break;
    default:
      return null;
  }
  return {
    type: "Multiplier",
    comma: n,
    min: t.min,
    max: t.max,
    term: null
  };
}
function Ie(e, t) {
  const n = Ua(e);
  return n !== null ? (n.term = t, e.charCode() === xn && e.charCodeAt(e.pos - 1) === vn ? Ie(e, n) : n) : t;
}
function Rt(e) {
  const t = e.peek();
  return t === "" ? null : {
    type: "Token",
    value: t
  };
}
function qa(e) {
  let t;
  return e.eat(Sn), e.eat(mt), t = Me(e), e.eat(mt), e.eat(Jr), Ie(e, {
    type: "Property",
    name: t
  });
}
function Ha(e) {
  let t = null, n = null, r = 1;
  return e.eat(Tt), e.charCode() === Qn && (e.peek(), r = -1), r == -1 && e.charCode() === Zn ? e.peek() : (t = r * Number(yt(e)), Ke[e.charCode()] !== 0 && (t += Me(e))), bt(e), e.eat(wn), bt(e), e.charCode() === Zn ? e.peek() : (r = 1, e.charCode() === Qn && (e.peek(), r = -1), n = r * Number(yt(e)), Ke[e.charCode()] !== 0 && (n += Me(e))), e.eat(Cn), {
    type: "Range",
    min: t,
    max: n
  };
}
function Ga(e) {
  let t, n = null;
  return e.eat(Sn), t = Me(e), e.charCode() === Xr && e.nextCharCode() === Ra && (e.pos += 2, t += "()"), e.charCodeAt(e.findWsEnd(e.pos)) === Tt && (bt(e), n = Ha(e)), e.eat(Jr), Ie(e, {
    type: "Type",
    name: t,
    opts: n
  });
}
function Wa(e) {
  const t = Me(e);
  return e.charCode() === Xr ? (e.pos++, {
    type: "Function",
    name: t
  }) : Ie(e, {
    type: "Keyword",
    name: t
  });
}
function Va(e, t) {
  function n(i, o) {
    return {
      type: "Group",
      terms: i,
      combinator: o,
      disallowEmpty: !1,
      explicit: !1
    };
  }
  let r;
  for (t = Object.keys(t).sort((i, o) => Jn[i] - Jn[o]); t.length > 0; ) {
    r = t.shift();
    let i = 0, o = 0;
    for (; i < e.length; i++) {
      const s = e[i];
      s.type === "Combinator" && (s.value === r ? (o === -1 && (o = i - 1), e.splice(i, 1), i--) : (o !== -1 && i - o > 1 && (e.splice(
        o,
        i - o,
        n(e.slice(o, i), r)
      ), i = o + 1), o = -1));
    }
    o !== -1 && t.length && e.splice(
      o,
      i - o,
      n(e.slice(o, i), r)
    );
  }
  return r;
}
function ei(e) {
  const t = [], n = {};
  let r, i = null, o = e.pos;
  for (; r = Qa(e); )
    r.type !== "Spaces" && (r.type === "Combinator" ? ((i === null || i.type === "Combinator") && (e.pos = o, e.error("Unexpected combinator")), n[r.value] = !0) : i !== null && i.type !== "Combinator" && (n[" "] = !0, t.push({
      type: "Combinator",
      value: " "
    })), t.push(r), i = r, o = e.pos);
  return i !== null && i.type === "Combinator" && (e.pos -= o, e.error("Unexpected combinator")), {
    type: "Group",
    terms: t,
    combinator: Va(t, n) || " ",
    disallowEmpty: !1,
    explicit: !1
  };
}
function Ka(e) {
  let t;
  return e.eat(Tt), t = ei(e), e.eat(Cn), t.explicit = !0, e.charCode() === Yr && (e.pos++, t.disallowEmpty = !0), t;
}
function Qa(e) {
  let t = e.charCode();
  if (t < 128 && Ke[t] === 1)
    return Wa(e);
  switch (t) {
    case Cn:
      break;
    case Tt:
      return Ie(e, Ka(e));
    case Sn:
      return e.nextCharCode() === mt ? qa(e) : Ga(e);
    case Yn:
      return {
        type: "Combinator",
        value: e.substringToPos(
          e.pos + (e.nextCharCode() === Yn ? 2 : 1)
        )
      };
    case Kn:
      return e.pos++, e.eat(Kn), {
        type: "Combinator",
        value: "&&"
      };
    case wn:
      return e.pos++, {
        type: "Comma"
      };
    case mt:
      return Ie(e, {
        type: "String",
        value: Ba(e)
      });
    case Da:
    case Ma:
    case Ia:
    case Na:
    case ja:
      return {
        type: "Spaces",
        value: bt(e)
      };
    case Fa:
      return t = e.nextCharCode(), t < 128 && Ke[t] === 1 ? (e.pos++, {
        type: "AtKeyword",
        name: Me(e)
      }) : Rt(e);
    case Zr:
    case vn:
    case Xt:
    case xn:
    case Yr:
      break;
    case gt:
      if (t = e.nextCharCode(), t < 48 || t > 57)
        return Rt(e);
      break;
    default:
      return Rt(e);
  }
}
function ti(e) {
  const t = new Pa(e), n = ei(t);
  return t.pos !== e.length && t.error("Unexpected input"), n.terms.length === 1 && n.terms[0].type === "Group" ? n.terms[0] : n;
}
const Ue = function() {
};
function tr(e) {
  return typeof e == "function" ? e : Ue;
}
function Ya(e, t, n) {
  function r(s) {
    switch (i.call(n, s), s.type) {
      case "Group":
        s.terms.forEach(r);
        break;
      case "Multiplier":
        r(s.term);
        break;
      case "Type":
      case "Property":
      case "Keyword":
      case "AtKeyword":
      case "Function":
      case "String":
      case "Token":
      case "Comma":
        break;
      default:
        throw new Error("Unknown type: " + s.type);
    }
    o.call(n, s);
  }
  let i = Ue, o = Ue;
  if (typeof t == "function" ? i = t : t && (i = tr(t.enter), o = tr(t.leave)), i === Ue && o === Ue)
    throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
  r(e);
}
const Xa = {
  decorator(e) {
    const t = [];
    let n = null;
    return {
      ...e,
      node(r) {
        const i = n;
        n = r, e.node.call(this, r), n = i;
      },
      emit(r, i, o) {
        t.push({
          type: i,
          value: r,
          node: o ? null : n
        });
      },
      result() {
        return t;
      }
    };
  }
};
function Za(e) {
  const t = [];
  return vt(
    e,
    (n, r, i) => t.push({
      type: n,
      value: e.slice(r, i),
      node: null
    })
  ), t;
}
function Ja(e, t) {
  return typeof e == "string" ? Za(e) : t.generate(e, Xa);
}
const A = { type: "Match" }, _ = { type: "Mismatch" }, An = { type: "DisallowEmpty" }, es = 40, ts = 41;
function B(e, t, n) {
  return t === A && n === _ || e === A && t === A && n === A ? e : (e.type === "If" && e.else === _ && t === A && (t = e.then, e = e.match), {
    type: "If",
    match: e,
    then: t,
    else: n
  });
}
function ni(e) {
  return e.length > 2 && e.charCodeAt(e.length - 2) === es && e.charCodeAt(e.length - 1) === ts;
}
function nr(e) {
  return e.type === "Keyword" || e.type === "AtKeyword" || e.type === "Function" || e.type === "Type" && ni(e.name);
}
function Zt(e, t, n) {
  switch (e) {
    case " ": {
      let r = A;
      for (let i = t.length - 1; i >= 0; i--) {
        const o = t[i];
        r = B(
          o,
          r,
          _
        );
      }
      return r;
    }
    case "|": {
      let r = _, i = null;
      for (let o = t.length - 1; o >= 0; o--) {
        let s = t[o];
        if (nr(s) && (i === null && o > 0 && nr(t[o - 1]) && (i = /* @__PURE__ */ Object.create(null), r = B(
          {
            type: "Enum",
            map: i
          },
          A,
          r
        )), i !== null)) {
          const u = (ni(s.name) ? s.name.slice(0, -1) : s.name).toLowerCase();
          if (!(u in i)) {
            i[u] = s;
            continue;
          }
        }
        i = null, r = B(
          s,
          A,
          r
        );
      }
      return r;
    }
    case "&&": {
      if (t.length > 5)
        return {
          type: "MatchOnce",
          terms: t,
          all: !0
        };
      let r = _;
      for (let i = t.length - 1; i >= 0; i--) {
        const o = t[i];
        let s;
        t.length > 1 ? s = Zt(
          e,
          t.filter(function(u) {
            return u !== o;
          }),
          !1
        ) : s = A, r = B(
          o,
          s,
          r
        );
      }
      return r;
    }
    case "||": {
      if (t.length > 5)
        return {
          type: "MatchOnce",
          terms: t,
          all: !1
        };
      let r = n ? A : _;
      for (let i = t.length - 1; i >= 0; i--) {
        const o = t[i];
        let s;
        t.length > 1 ? s = Zt(
          e,
          t.filter(function(u) {
            return u !== o;
          }),
          !0
        ) : s = A, r = B(
          o,
          s,
          r
        );
      }
      return r;
    }
  }
}
function ns(e) {
  let t = A, n = Tn(e.term);
  if (e.max === 0)
    n = B(
      n,
      An,
      _
    ), t = B(
      n,
      null,
      // will be a loop
      _
    ), t.then = B(
      A,
      A,
      t
      // make a loop
    ), e.comma && (t.then.else = B(
      { type: "Comma", syntax: e },
      t,
      _
    ));
  else
    for (let r = e.min || 1; r <= e.max; r++)
      e.comma && t !== A && (t = B(
        { type: "Comma", syntax: e },
        t,
        _
      )), t = B(
        n,
        B(
          A,
          A,
          t
        ),
        _
      );
  if (e.min === 0)
    t = B(
      A,
      A,
      t
    );
  else
    for (let r = 0; r < e.min - 1; r++)
      e.comma && t !== A && (t = B(
        { type: "Comma", syntax: e },
        t,
        _
      )), t = B(
        n,
        t,
        _
      );
  return t;
}
function Tn(e) {
  if (typeof e == "function")
    return {
      type: "Generic",
      fn: e
    };
  switch (e.type) {
    case "Group": {
      let t = Zt(
        e.combinator,
        e.terms.map(Tn),
        !1
      );
      return e.disallowEmpty && (t = B(
        t,
        An,
        _
      )), t;
    }
    case "Multiplier":
      return ns(e);
    case "Type":
    case "Property":
      return {
        type: e.type,
        name: e.name,
        syntax: e
      };
    case "Keyword":
      return {
        type: e.type,
        name: e.name.toLowerCase(),
        syntax: e
      };
    case "AtKeyword":
      return {
        type: e.type,
        name: "@" + e.name.toLowerCase(),
        syntax: e
      };
    case "Function":
      return {
        type: e.type,
        name: e.name.toLowerCase() + "(",
        syntax: e
      };
    case "String":
      return e.value.length === 3 ? {
        type: "Token",
        value: e.value.charAt(1),
        syntax: e
      } : {
        type: e.type,
        value: e.value.substr(1, e.value.length - 2).replace(/\\'/g, "'"),
        syntax: e
      };
    case "Token":
      return {
        type: e.type,
        value: e.value,
        syntax: e
      };
    case "Comma":
      return {
        type: e.type,
        syntax: e
      };
    default:
      throw new Error("Unknown node type:", e.type);
  }
}
function Jt(e, t) {
  return typeof e == "string" && (e = ti(e)), {
    type: "MatchGraph",
    match: Tn(e),
    syntax: t || null,
    source: e
  };
}
const { hasOwnProperty: rr } = Object.prototype, rs = 0, is = 1, en = 2, ri = 3, ir = "Match", os = "Mismatch", as = "Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)", or = 15e3;
function ss(e) {
  let t = null, n = null, r = e;
  for (; r !== null; )
    n = r.prev, r.prev = t, t = r, r = n;
  return t;
}
function Ft(e, t) {
  if (e.length !== t.length)
    return !1;
  for (let n = 0; n < e.length; n++) {
    const r = t.charCodeAt(n);
    let i = e.charCodeAt(n);
    if (i >= 65 && i <= 90 && (i = i | 32), i !== r)
      return !1;
  }
  return !0;
}
function ls(e) {
  return e.type !== S ? !1 : e.value !== "?";
}
function ar(e) {
  return e === null ? !0 : e.type === fe || e.type === C || e.type === N || e.type === J || e.type === H || ls(e);
}
function sr(e) {
  return e === null ? !0 : e.type === O || e.type === le || e.type === ne || e.type === S && e.value === "/";
}
function cs(e, t, n) {
  function r() {
    do
      $++, x = $ < e.length ? e[$] : null;
    while (x !== null && (x.type === P || x.type === W));
  }
  function i(X) {
    const ie = $ + X;
    return ie < e.length ? e[ie] : null;
  }
  function o(X, ie) {
    return {
      nextState: X,
      matchStack: v,
      syntaxStack: d,
      thenStack: m,
      tokenIndex: $,
      prev: ie
    };
  }
  function s(X) {
    m = {
      nextState: X,
      matchStack: v,
      syntaxStack: d,
      prev: m
    };
  }
  function u(X) {
    b = o(X, b);
  }
  function c() {
    v = {
      type: is,
      syntax: t.syntax,
      token: x,
      prev: v
    }, r(), T = null, $ > ce && (ce = $);
  }
  function a() {
    d = {
      syntax: t.syntax,
      opts: t.syntax.opts || d !== null && d.opts || null,
      prev: d
    }, v = {
      type: en,
      syntax: t.syntax,
      token: v.token,
      prev: v
    };
  }
  function l() {
    v.type === en ? v = v.prev : v = {
      type: ri,
      syntax: d.syntax,
      token: v.token,
      prev: v
    }, d = d.prev;
  }
  let d = null, m = null, b = null, T = null, G = 0, D = null, x = null, $ = -1, ce = 0, v = {
    type: rs,
    syntax: null,
    token: null,
    prev: null
  };
  for (r(); D === null && ++G < or; )
    switch (t.type) {
      case "Match":
        if (m === null) {
          if (x !== null && ($ !== e.length - 1 || x.value !== "\\0" && x.value !== "\\9")) {
            t = _;
            break;
          }
          D = ir;
          break;
        }
        if (t = m.nextState, t === An)
          if (m.matchStack === v) {
            t = _;
            break;
          } else
            t = A;
        for (; m.syntaxStack !== d; )
          l();
        m = m.prev;
        break;
      case "Mismatch":
        if (T !== null && T !== !1)
          (b === null || $ > b.tokenIndex) && (b = T, T = !1);
        else if (b === null) {
          D = os;
          break;
        }
        t = b.nextState, m = b.thenStack, d = b.syntaxStack, v = b.matchStack, $ = b.tokenIndex, x = $ < e.length ? e[$] : null, b = b.prev;
        break;
      case "MatchGraph":
        t = t.match;
        break;
      case "If":
        t.else !== _ && u(t.else), t.then !== A && s(t.then), t = t.match;
        break;
      case "MatchOnce":
        t = {
          type: "MatchOnceBuffer",
          syntax: t,
          index: 0,
          mask: 0
        };
        break;
      case "MatchOnceBuffer": {
        const j = t.syntax.terms;
        if (t.index === j.length) {
          if (t.mask === 0 || t.syntax.all) {
            t = _;
            break;
          }
          t = A;
          break;
        }
        if (t.mask === (1 << j.length) - 1) {
          t = A;
          break;
        }
        for (; t.index < j.length; t.index++) {
          const h = 1 << t.index;
          if (!(t.mask & h)) {
            u(t), s({
              type: "AddMatchOnce",
              syntax: t.syntax,
              mask: t.mask | h
            }), t = j[t.index++];
            break;
          }
        }
        break;
      }
      case "AddMatchOnce":
        t = {
          type: "MatchOnceBuffer",
          syntax: t.syntax,
          index: 0,
          mask: t.mask
        };
        break;
      case "Enum":
        if (x !== null) {
          let j = x.value.toLowerCase();
          if (j.indexOf("\\") !== -1 && (j = j.replace(/\\[09].*$/, "")), rr.call(t.map, j)) {
            t = t.map[j];
            break;
          }
        }
        t = _;
        break;
      case "Generic": {
        const j = d !== null ? d.opts : null, h = $ + Math.floor(t.fn(x, i, j));
        if (!isNaN(h) && h > $) {
          for (; $ < h; )
            c();
          t = A;
        } else
          t = _;
        break;
      }
      case "Type":
      case "Property": {
        const j = t.type === "Type" ? "types" : "properties", h = rr.call(n, j) ? n[j][t.name] : null;
        if (!h || !h.match)
          throw new Error(
            "Bad syntax reference: " + (t.type === "Type" ? "<" + t.name + ">" : "<'" + t.name + "'>")
          );
        if (T !== !1 && x !== null && t.type === "Type" && // https://drafts.csswg.org/css-values-4/#custom-idents
        // When parsing positionally-ambiguous keywords in a property value, a <custom-ident> production
        // can only claim the keyword if no other unfulfilled production can claim it.
        (t.name === "custom-ident" && x.type === g || // https://drafts.csswg.org/css-values-4/#lengths
        // ... if a `0` could be parsed as either a <number> or a <length> in a property (such as line-height),
        // it must parse as a <number>
        t.name === "length" && x.value === "0")) {
          T === null && (T = o(t, b)), t = _;
          break;
        }
        a(), t = h.match;
        break;
      }
      case "Keyword": {
        const j = t.name;
        if (x !== null) {
          let h = x.value;
          if (h.indexOf("\\") !== -1 && (h = h.replace(/\\[09].*$/, "")), Ft(h, j)) {
            c(), t = A;
            break;
          }
        }
        t = _;
        break;
      }
      case "AtKeyword":
      case "Function":
        if (x !== null && Ft(x.value, t.name)) {
          c(), t = A;
          break;
        }
        t = _;
        break;
      case "Token":
        if (x !== null && x.value === t.value) {
          c(), t = A;
          break;
        }
        t = _;
        break;
      case "Comma":
        x !== null && x.type === fe ? ar(v.token) ? t = _ : (c(), t = sr(x) ? _ : A) : t = ar(v.token) || sr(x) ? A : _;
        break;
      case "String":
        let X = "", ie = $;
        for (; ie < e.length && X.length < t.value.length; ie++)
          X += e[ie].value;
        if (Ft(X, t.value)) {
          for (; $ < ie; )
            c();
          t = A;
        } else
          t = _;
        break;
      default:
        throw new Error("Unknown node type: " + t.type);
    }
  switch (D) {
    case null:
      console.warn("[csstree-match] BREAK after " + or + " iterations"), D = as, v = null;
      break;
    case ir:
      for (; d !== null; )
        l();
      break;
    default:
      v = null;
  }
  return {
    tokens: e,
    reason: D,
    iterations: G,
    match: v,
    longestMatch: ce
  };
}
function lr(e, t, n) {
  const r = cs(e, t, n || {});
  if (r.match === null)
    return r;
  let i = r.match, o = r.match = {
    syntax: t.syntax || null,
    match: []
  };
  const s = [o];
  for (i = ss(i).prev; i !== null; ) {
    switch (i.type) {
      case en:
        o.match.push(o = {
          syntax: i.syntax,
          match: []
        }), s.push(o);
        break;
      case ri:
        s.pop(), o = s[s.length - 1];
        break;
      default:
        o.match.push({
          syntax: i.syntax || null,
          token: i.token.value,
          node: i.token.node
        });
    }
    i = i.prev;
  }
  return r;
}
function ii(e) {
  function t(i) {
    return i === null ? !1 : i.type === "Type" || i.type === "Property" || i.type === "Keyword";
  }
  function n(i) {
    if (Array.isArray(i.match)) {
      for (let o = 0; o < i.match.length; o++)
        if (n(i.match[o]))
          return t(i.syntax) && r.unshift(i.syntax), !0;
    } else if (i.node === e)
      return r = t(i.syntax) ? [i.syntax] : [], !0;
    return !1;
  }
  let r = null;
  return this.matched !== null && n(this.matched), r;
}
function us(e, t) {
  return _n(this, e, (n) => n.type === "Type" && n.name === t);
}
function hs(e, t) {
  return _n(this, e, (n) => n.type === "Property" && n.name === t);
}
function ps(e) {
  return _n(this, e, (t) => t.type === "Keyword");
}
function _n(e, t, n) {
  const r = ii.call(e, t);
  return r === null ? !1 : r.some(n);
}
const ds = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getTrace: ii,
  isKeyword: ps,
  isProperty: hs,
  isType: us
}, Symbol.toStringTag, { value: "Module" }));
function oi(e) {
  return "node" in e ? e.node : oi(e.match[0]);
}
function ai(e) {
  return "node" in e ? e.node : ai(e.match[e.match.length - 1]);
}
function cr(e, t, n, r, i) {
  function o(u) {
    if (u.syntax !== null && u.syntax.type === r && u.syntax.name === i) {
      const c = oi(u), a = ai(u);
      e.syntax.walk(t, function(l, d, m) {
        if (l === c) {
          const b = new R();
          do {
            if (b.appendData(d.data), d.data === a)
              break;
            d = d.next;
          } while (d !== null);
          s.push({
            parent: m,
            nodes: b
          });
        }
      });
    }
    Array.isArray(u.match) && u.match.forEach(o);
  }
  const s = [];
  return n.matched !== null && o(n.matched), s;
}
const { hasOwnProperty: Ge } = Object.prototype;
function Bt(e) {
  return typeof e == "number" && isFinite(e) && Math.floor(e) === e && e >= 0;
}
function ur(e) {
  return !!e && Bt(e.offset) && Bt(e.line) && Bt(e.column);
}
function fs(e, t) {
  return function(r, i) {
    if (!r || r.constructor !== Object)
      return i(r, "Type of node should be an Object");
    for (let o in r) {
      let s = !0;
      if (Ge.call(r, o) !== !1) {
        if (o === "type")
          r.type !== e && i(r, "Wrong node type `" + r.type + "`, expected `" + e + "`");
        else if (o === "loc") {
          if (r.loc === null)
            continue;
          if (r.loc && r.loc.constructor === Object)
            if (typeof r.loc.source != "string")
              o += ".source";
            else if (!ur(r.loc.start))
              o += ".start";
            else if (!ur(r.loc.end))
              o += ".end";
            else
              continue;
          s = !1;
        } else if (t.hasOwnProperty(o)) {
          s = !1;
          for (let u = 0; !s && u < t[o].length; u++) {
            const c = t[o][u];
            switch (c) {
              case String:
                s = typeof r[o] == "string";
                break;
              case Boolean:
                s = typeof r[o] == "boolean";
                break;
              case null:
                s = r[o] === null;
                break;
              default:
                typeof c == "string" ? s = r[o] && r[o].type === c : Array.isArray(c) && (s = r[o] instanceof R);
            }
          }
        } else
          i(r, "Unknown field `" + o + "` for " + e + " node type");
        s || i(r, "Bad value for `" + e + "." + o + "`");
      }
    }
    for (const o in t)
      Ge.call(t, o) && Ge.call(r, o) === !1 && i(r, "Field `" + e + "." + o + "` is missed");
  };
}
function ms(e, t) {
  const n = t.structure, r = {
    type: String,
    loc: !0
  }, i = {
    type: '"' + e + '"'
  };
  for (const o in n) {
    if (Ge.call(n, o) === !1)
      continue;
    const s = [], u = r[o] = Array.isArray(n[o]) ? n[o].slice() : [n[o]];
    for (let c = 0; c < u.length; c++) {
      const a = u[c];
      if (a === String || a === Boolean)
        s.push(a.name);
      else if (a === null)
        s.push("null");
      else if (typeof a == "string")
        s.push("<" + a + ">");
      else if (Array.isArray(a))
        s.push("List");
      else
        throw new Error("Wrong value `" + a + "` in `" + e + "." + o + "` structure definition");
    }
    i[o] = s.join(" | ");
  }
  return {
    docs: i,
    check: fs(e, r)
  };
}
function gs(e) {
  const t = {};
  if (e.node) {
    for (const n in e.node)
      if (Ge.call(e.node, n)) {
        const r = e.node[n];
        if (r.structure)
          t[n] = ms(n, r);
        else
          throw new Error("Missed `structure` field in `" + n + "` node type definition");
      }
  }
  return t;
}
const bs = Jt(qr.join(" | "));
function tn(e, t, n) {
  const r = {};
  for (const i in e)
    e[i].syntax && (r[i] = n ? e[i].syntax : bn(e[i].syntax, { compact: t }));
  return r;
}
function ys(e, t, n) {
  const r = {};
  for (const [i, o] of Object.entries(e))
    r[i] = {
      prelude: o.prelude && (n ? o.prelude.syntax : bn(o.prelude.syntax, { compact: t })),
      descriptors: o.descriptors && tn(o.descriptors, t, n)
    };
  return r;
}
function ks(e) {
  for (let t = 0; t < e.length; t++)
    if (e[t].value.toLowerCase() === "var(")
      return !0;
  return !1;
}
function ae(e, t, n) {
  return {
    matched: e,
    iterations: n,
    error: t,
    ...ds
  };
}
function $e(e, t, n, r) {
  const i = Ja(n, e.syntax);
  let o;
  return ks(i) ? ae(null, new Error("Matching for a tree with var() is not supported")) : (r && (o = lr(i, e.cssWideKeywordsSyntax, e)), (!r || !o.match) && (o = lr(i, t.match, e), !o.match) ? ae(
    null,
    new Qo(o.reason, t.syntax, n, o),
    o.iterations
  ) : ae(o.match, null, o.iterations));
}
class hr {
  constructor(t, n, r) {
    if (this.cssWideKeywordsSyntax = bs, this.syntax = n, this.generic = !1, this.units = { ...Vn }, this.atrules = /* @__PURE__ */ Object.create(null), this.properties = /* @__PURE__ */ Object.create(null), this.types = /* @__PURE__ */ Object.create(null), this.structure = r || gs(t), t) {
      if (t.units)
        for (const i of Object.keys(Vn))
          Array.isArray(t.units[i]) && (this.units[i] = t.units[i]);
      if (t.types)
        for (const i in t.types)
          this.addType_(i, t.types[i]);
      if (t.generic) {
        this.generic = !0;
        for (const [i, o] of Object.entries(ya(this.units)))
          this.addType_(i, o);
      }
      if (t.atrules)
        for (const i in t.atrules)
          this.addAtrule_(i, t.atrules[i]);
      if (t.properties)
        for (const i in t.properties)
          this.addProperty_(i, t.properties[i]);
    }
  }
  checkStructure(t) {
    function n(o, s) {
      i.push({ node: o, message: s });
    }
    const r = this.structure, i = [];
    return this.syntax.walk(t, function(o) {
      r.hasOwnProperty(o.type) ? r[o.type].check(o, n) : n(o, "Unknown node type `" + o.type + "`");
    }), i.length ? i : !1;
  }
  createDescriptor(t, n, r, i = null) {
    const o = {
      type: n,
      name: r
    }, s = {
      type: n,
      name: r,
      parent: i,
      serializable: typeof t == "string" || t && typeof t.type == "string",
      syntax: null,
      match: null
    };
    return typeof t == "function" ? s.match = Jt(t, o) : (typeof t == "string" ? Object.defineProperty(s, "syntax", {
      get() {
        return Object.defineProperty(s, "syntax", {
          value: ti(t)
        }), s.syntax;
      }
    }) : s.syntax = t, Object.defineProperty(s, "match", {
      get() {
        return Object.defineProperty(s, "match", {
          value: Jt(s.syntax, o)
        }), s.match;
      }
    })), s;
  }
  addAtrule_(t, n) {
    n && (this.atrules[t] = {
      type: "Atrule",
      name: t,
      prelude: n.prelude ? this.createDescriptor(n.prelude, "AtrulePrelude", t) : null,
      descriptors: n.descriptors ? Object.keys(n.descriptors).reduce(
        (r, i) => (r[i] = this.createDescriptor(n.descriptors[i], "AtruleDescriptor", i, t), r),
        /* @__PURE__ */ Object.create(null)
      ) : null
    });
  }
  addProperty_(t, n) {
    n && (this.properties[t] = this.createDescriptor(n, "Property", t));
  }
  addType_(t, n) {
    n && (this.types[t] = this.createDescriptor(n, "Type", t));
  }
  checkAtruleName(t) {
    if (!this.getAtrule(t))
      return new De("Unknown at-rule", "@" + t);
  }
  checkAtrulePrelude(t, n) {
    const r = this.checkAtruleName(t);
    if (r)
      return r;
    const i = this.getAtrule(t);
    if (!i.prelude && n)
      return new SyntaxError("At-rule `@" + t + "` should not contain a prelude");
    if (i.prelude && !n && !$e(this, i.prelude, "", !1).matched)
      return new SyntaxError("At-rule `@" + t + "` should contain a prelude");
  }
  checkAtruleDescriptorName(t, n) {
    const r = this.checkAtruleName(t);
    if (r)
      return r;
    const i = this.getAtrule(t), o = jt(n);
    if (!i.descriptors)
      return new SyntaxError("At-rule `@" + t + "` has no known descriptors");
    if (!i.descriptors[o.name] && !i.descriptors[o.basename])
      return new De("Unknown at-rule descriptor", n);
  }
  checkPropertyName(t) {
    if (!this.getProperty(t))
      return new De("Unknown property", t);
  }
  matchAtrulePrelude(t, n) {
    const r = this.checkAtrulePrelude(t, n);
    if (r)
      return ae(null, r);
    const i = this.getAtrule(t);
    return i.prelude ? $e(this, i.prelude, n || "", !1) : ae(null, null);
  }
  matchAtruleDescriptor(t, n, r) {
    const i = this.checkAtruleDescriptorName(t, n);
    if (i)
      return ae(null, i);
    const o = this.getAtrule(t), s = jt(n);
    return $e(this, o.descriptors[s.name] || o.descriptors[s.basename], r, !1);
  }
  matchDeclaration(t) {
    return t.type !== "Declaration" ? ae(null, new Error("Not a Declaration node")) : this.matchProperty(t.property, t.value);
  }
  matchProperty(t, n) {
    if (Wn(t).custom)
      return ae(null, new Error("Lexer matching doesn't applicable for custom properties"));
    const r = this.checkPropertyName(t);
    return r ? ae(null, r) : $e(this, this.getProperty(t), n, !0);
  }
  matchType(t, n) {
    const r = this.getType(t);
    return r ? $e(this, r, n, !1) : ae(null, new De("Unknown type", t));
  }
  match(t, n) {
    return typeof t != "string" && (!t || !t.type) ? ae(null, new De("Bad syntax")) : ((typeof t == "string" || !t.match) && (t = this.createDescriptor(t, "Type", "anonymous")), $e(this, t, n, !1));
  }
  findValueFragments(t, n, r, i) {
    return cr(this, n, this.matchProperty(t, n), r, i);
  }
  findDeclarationValueFragments(t, n, r) {
    return cr(this, t.value, this.matchDeclaration(t), n, r);
  }
  findAllFragments(t, n, r) {
    const i = [];
    return this.syntax.walk(t, {
      visit: "Declaration",
      enter: (o) => {
        i.push.apply(i, this.findDeclarationValueFragments(o, n, r));
      }
    }), i;
  }
  getAtrule(t, n = !0) {
    const r = jt(t);
    return (r.vendor && n ? this.atrules[r.name] || this.atrules[r.basename] : this.atrules[r.name]) || null;
  }
  getAtrulePrelude(t, n = !0) {
    const r = this.getAtrule(t, n);
    return r && r.prelude || null;
  }
  getAtruleDescriptor(t, n) {
    return this.atrules.hasOwnProperty(t) && this.atrules.declarators && this.atrules[t].declarators[n] || null;
  }
  getProperty(t, n = !0) {
    const r = Wn(t);
    return (r.vendor && n ? this.properties[r.name] || this.properties[r.basename] : this.properties[r.name]) || null;
  }
  getType(t) {
    return hasOwnProperty.call(this.types, t) ? this.types[t] : null;
  }
  validate() {
    function t(i, o, s, u) {
      if (s.has(o))
        return s.get(o);
      s.set(o, !1), u.syntax !== null && Ya(u.syntax, function(c) {
        if (c.type !== "Type" && c.type !== "Property")
          return;
        const a = c.type === "Type" ? i.types : i.properties, l = c.type === "Type" ? n : r;
        (!hasOwnProperty.call(a, c.name) || t(i, c.name, l, a[c.name])) && s.set(o, !0);
      }, this);
    }
    let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    for (const i in this.types)
      t(this, i, n, this.types[i]);
    for (const i in this.properties)
      t(this, i, r, this.properties[i]);
    return n = [...n.keys()].filter((i) => n.get(i)), r = [...r.keys()].filter((i) => r.get(i)), n.length || r.length ? {
      types: n,
      properties: r
    } : null;
  }
  dump(t, n) {
    return {
      generic: this.generic,
      units: this.units,
      types: tn(this.types, !n, t),
      properties: tn(this.properties, !n, t),
      atrules: ys(this.atrules, !n, t)
    };
  }
  toString() {
    return JSON.stringify(this.dump());
  }
}
function Ut(e, t) {
  return typeof t == "string" && /^\s*\|/.test(t) ? typeof e == "string" ? e + t : t.replace(/^\s*\|\s*/, "") : t || null;
}
function pr(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const [r, i] of Object.entries(e))
    if (i) {
      n[r] = {};
      for (const o of Object.keys(i))
        t.includes(o) && (n[r][o] = i[o]);
    }
  return n;
}
function nn(e, t) {
  const n = { ...e };
  for (const [r, i] of Object.entries(t))
    switch (r) {
      case "generic":
        n[r] = !!i;
        break;
      case "units":
        n[r] = { ...e[r] };
        for (const [o, s] of Object.entries(i))
          n[r][o] = Array.isArray(s) ? s : [];
        break;
      case "atrules":
        n[r] = { ...e[r] };
        for (const [o, s] of Object.entries(i)) {
          const u = n[r][o] || {}, c = n[r][o] = {
            prelude: u.prelude || null,
            descriptors: {
              ...u.descriptors
            }
          };
          if (s) {
            c.prelude = s.prelude ? Ut(c.prelude, s.prelude) : c.prelude || null;
            for (const [a, l] of Object.entries(s.descriptors || {}))
              c.descriptors[a] = l ? Ut(c.descriptors[a], l) : null;
            Object.keys(c.descriptors).length || (c.descriptors = null);
          }
        }
        break;
      case "types":
      case "properties":
        n[r] = { ...e[r] };
        for (const [o, s] of Object.entries(i))
          n[r][o] = Ut(n[r][o], s);
        break;
      case "scope":
        n[r] = { ...e[r] };
        for (const [o, s] of Object.entries(i))
          n[r][o] = { ...n[r][o], ...s };
        break;
      case "parseContext":
        n[r] = {
          ...e[r],
          ...i
        };
        break;
      case "atrule":
      case "pseudo":
        n[r] = {
          ...e[r],
          ...pr(i, ["parse"])
        };
        break;
      case "node":
        n[r] = {
          ...e[r],
          ...pr(i, ["name", "structure", "parse", "generate", "walkContext"])
        };
        break;
    }
  return n;
}
function si(e) {
  const t = Ao(e), n = qo(e), r = Ro(e), { fromPlainObject: i, toPlainObject: o } = Fo(n), s = {
    lexer: null,
    createLexer: (u) => new hr(u, s, s.lexer.structure),
    tokenize: vt,
    parse: t,
    generate: r,
    walk: n,
    find: n.find,
    findLast: n.findLast,
    findAll: n.findAll,
    fromPlainObject: i,
    toPlainObject: o,
    fork(u) {
      const c = nn({}, e);
      return si(
        typeof u == "function" ? u(c, Object.assign) : nn(c, u)
      );
    }
  };
  return s.lexer = new hr({
    generic: !0,
    units: e.units,
    types: e.types,
    atrules: e.atrules,
    properties: e.properties,
    node: e.node
  }, s), s;
}
const xs = (e) => si(nn({}, e)), vs = {
  generic: !0,
  units: {
    angle: [
      "deg",
      "grad",
      "rad",
      "turn"
    ],
    decibel: [
      "db"
    ],
    flex: [
      "fr"
    ],
    frequency: [
      "hz",
      "khz"
    ],
    length: [
      "cm",
      "mm",
      "q",
      "in",
      "pt",
      "pc",
      "px",
      "em",
      "rem",
      "ex",
      "rex",
      "cap",
      "rcap",
      "ch",
      "rch",
      "ic",
      "ric",
      "lh",
      "rlh",
      "vw",
      "svw",
      "lvw",
      "dvw",
      "vh",
      "svh",
      "lvh",
      "dvh",
      "vi",
      "svi",
      "lvi",
      "dvi",
      "vb",
      "svb",
      "lvb",
      "dvb",
      "vmin",
      "svmin",
      "lvmin",
      "dvmin",
      "vmax",
      "svmax",
      "lvmax",
      "dvmax",
      "cqw",
      "cqh",
      "cqi",
      "cqb",
      "cqmin",
      "cqmax"
    ],
    resolution: [
      "dpi",
      "dpcm",
      "dppx",
      "x"
    ],
    semitones: [
      "st"
    ],
    time: [
      "s",
      "ms"
    ]
  },
  types: {
    "abs()": "abs( <calc-sum> )",
    "absolute-size": "xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large",
    "acos()": "acos( <calc-sum> )",
    "alpha-value": "<number>|<percentage>",
    "angle-percentage": "<angle>|<percentage>",
    "angular-color-hint": "<angle-percentage>",
    "angular-color-stop": "<color>&&<color-stop-angle>?",
    "angular-color-stop-list": "[<angular-color-stop> [, <angular-color-hint>]?]# , <angular-color-stop>",
    "animateable-feature": "scroll-position|contents|<custom-ident>",
    "asin()": "asin( <calc-sum> )",
    "atan()": "atan( <calc-sum> )",
    "atan2()": "atan2( <calc-sum> , <calc-sum> )",
    attachment: "scroll|fixed|local",
    "attr()": "attr( <attr-name> <type-or-unit>? [, <attr-fallback>]? )",
    "attr-matcher": "['~'|'|'|'^'|'$'|'*']? '='",
    "attr-modifier": "i|s",
    "attribute-selector": "'[' <wq-name> ']'|'[' <wq-name> <attr-matcher> [<string-token>|<ident-token>] <attr-modifier>? ']'",
    "auto-repeat": "repeat( [auto-fill|auto-fit] , [<line-names>? <fixed-size>]+ <line-names>? )",
    "auto-track-list": "[<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>? <auto-repeat> [<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>?",
    axis: "block|inline|vertical|horizontal",
    "baseline-position": "[first|last]? baseline",
    "basic-shape": "<inset()>|<circle()>|<ellipse()>|<polygon()>|<path()>",
    "bg-image": "none|<image>",
    "bg-layer": "<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
    "bg-position": "[[left|center|right|top|bottom|<length-percentage>]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]|[center|[left|right] <length-percentage>?]&&[center|[top|bottom] <length-percentage>?]]",
    "bg-size": "[<length-percentage>|auto]{1,2}|cover|contain",
    "blur()": "blur( <length> )",
    "blend-mode": "normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity",
    box: "border-box|padding-box|content-box",
    "brightness()": "brightness( <number-percentage> )",
    "calc()": "calc( <calc-sum> )",
    "calc-sum": "<calc-product> [['+'|'-'] <calc-product>]*",
    "calc-product": "<calc-value> ['*' <calc-value>|'/' <number>]*",
    "calc-value": "<number>|<dimension>|<percentage>|<calc-constant>|( <calc-sum> )",
    "calc-constant": "e|pi|infinity|-infinity|NaN",
    "cf-final-image": "<image>|<color>",
    "cf-mixing-image": "<percentage>?&&<image>",
    "circle()": "circle( [<shape-radius>]? [at <position>]? )",
    "clamp()": "clamp( <calc-sum>#{3} )",
    "class-selector": "'.' <ident-token>",
    "clip-source": "<url>",
    color: "<rgb()>|<rgba()>|<hsl()>|<hsla()>|<hwb()>|<lab()>|<lch()>|<hex-color>|<named-color>|currentcolor|<deprecated-system-color>",
    "color-stop": "<color-stop-length>|<color-stop-angle>",
    "color-stop-angle": "<angle-percentage>{1,2}",
    "color-stop-length": "<length-percentage>{1,2}",
    "color-stop-list": "[<linear-color-stop> [, <linear-color-hint>]?]# , <linear-color-stop>",
    combinator: "'>'|'+'|'~'|['||']",
    "common-lig-values": "[common-ligatures|no-common-ligatures]",
    "compat-auto": "searchfield|textarea|push-button|slider-horizontal|checkbox|radio|square-button|menulist|listbox|meter|progress-bar|button",
    "composite-style": "clear|copy|source-over|source-in|source-out|source-atop|destination-over|destination-in|destination-out|destination-atop|xor",
    "compositing-operator": "add|subtract|intersect|exclude",
    "compound-selector": "[<type-selector>? <subclass-selector>* [<pseudo-element-selector> <pseudo-class-selector>*]*]!",
    "compound-selector-list": "<compound-selector>#",
    "complex-selector": "<compound-selector> [<combinator>? <compound-selector>]*",
    "complex-selector-list": "<complex-selector>#",
    "conic-gradient()": "conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )",
    "contextual-alt-values": "[contextual|no-contextual]",
    "content-distribution": "space-between|space-around|space-evenly|stretch",
    "content-list": "[<string>|contents|<image>|<counter>|<quote>|<target>|<leader()>|<attr()>]+",
    "content-position": "center|start|end|flex-start|flex-end",
    "content-replacement": "<image>",
    "contrast()": "contrast( [<number-percentage>] )",
    "cos()": "cos( <calc-sum> )",
    counter: "<counter()>|<counters()>",
    "counter()": "counter( <counter-name> , <counter-style>? )",
    "counter-name": "<custom-ident>",
    "counter-style": "<counter-style-name>|symbols( )",
    "counter-style-name": "<custom-ident>",
    "counters()": "counters( <counter-name> , <string> , <counter-style>? )",
    "cross-fade()": "cross-fade( <cf-mixing-image> , <cf-final-image>? )",
    "cubic-bezier-timing-function": "ease|ease-in|ease-out|ease-in-out|cubic-bezier( <number [0,1]> , <number> , <number [0,1]> , <number> )",
    "deprecated-system-color": "ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonFace|ButtonHighlight|ButtonShadow|ButtonText|CaptionText|GrayText|Highlight|HighlightText|InactiveBorder|InactiveCaption|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText",
    "discretionary-lig-values": "[discretionary-ligatures|no-discretionary-ligatures]",
    "display-box": "contents|none",
    "display-inside": "flow|flow-root|table|flex|grid|ruby",
    "display-internal": "table-row-group|table-header-group|table-footer-group|table-row|table-cell|table-column-group|table-column|table-caption|ruby-base|ruby-text|ruby-base-container|ruby-text-container",
    "display-legacy": "inline-block|inline-list-item|inline-table|inline-flex|inline-grid",
    "display-listitem": "<display-outside>?&&[flow|flow-root]?&&list-item",
    "display-outside": "block|inline|run-in",
    "drop-shadow()": "drop-shadow( <length>{2,3} <color>? )",
    "east-asian-variant-values": "[jis78|jis83|jis90|jis04|simplified|traditional]",
    "east-asian-width-values": "[full-width|proportional-width]",
    "element()": "element( <custom-ident> , [first|start|last|first-except]? )|element( <id-selector> )",
    "ellipse()": "ellipse( [<shape-radius>{2}]? [at <position>]? )",
    "ending-shape": "circle|ellipse",
    "env()": "env( <custom-ident> , <declaration-value>? )",
    "exp()": "exp( <calc-sum> )",
    "explicit-track-list": "[<line-names>? <track-size>]+ <line-names>?",
    "family-name": "<string>|<custom-ident>+",
    "feature-tag-value": "<string> [<integer>|on|off]?",
    "feature-type": "@stylistic|@historical-forms|@styleset|@character-variant|@swash|@ornaments|@annotation",
    "feature-value-block": "<feature-type> '{' <feature-value-declaration-list> '}'",
    "feature-value-block-list": "<feature-value-block>+",
    "feature-value-declaration": "<custom-ident> : <integer>+ ;",
    "feature-value-declaration-list": "<feature-value-declaration>",
    "feature-value-name": "<custom-ident>",
    "fill-rule": "nonzero|evenodd",
    "filter-function": "<blur()>|<brightness()>|<contrast()>|<drop-shadow()>|<grayscale()>|<hue-rotate()>|<invert()>|<opacity()>|<saturate()>|<sepia()>",
    "filter-function-list": "[<filter-function>|<url>]+",
    "final-bg-layer": "<'background-color'>||<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
    "fixed-breadth": "<length-percentage>",
    "fixed-repeat": "repeat( [<integer [1,∞]>] , [<line-names>? <fixed-size>]+ <line-names>? )",
    "fixed-size": "<fixed-breadth>|minmax( <fixed-breadth> , <track-breadth> )|minmax( <inflexible-breadth> , <fixed-breadth> )",
    "font-stretch-absolute": "normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded|<percentage>",
    "font-variant-css21": "[normal|small-caps]",
    "font-weight-absolute": "normal|bold|<number [1,1000]>",
    "frequency-percentage": "<frequency>|<percentage>",
    "general-enclosed": "[<function-token> <any-value> )]|( <ident> <any-value> )",
    "generic-family": "serif|sans-serif|cursive|fantasy|monospace|-apple-system",
    "generic-name": "serif|sans-serif|cursive|fantasy|monospace",
    "geometry-box": "<shape-box>|fill-box|stroke-box|view-box",
    gradient: "<linear-gradient()>|<repeating-linear-gradient()>|<radial-gradient()>|<repeating-radial-gradient()>|<conic-gradient()>|<repeating-conic-gradient()>|<-legacy-gradient>",
    "grayscale()": "grayscale( <number-percentage> )",
    "grid-line": "auto|<custom-ident>|[<integer>&&<custom-ident>?]|[span&&[<integer>||<custom-ident>]]",
    "historical-lig-values": "[historical-ligatures|no-historical-ligatures]",
    "hsl()": "hsl( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsl( <hue> , <percentage> , <percentage> , <alpha-value>? )",
    "hsla()": "hsla( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsla( <hue> , <percentage> , <percentage> , <alpha-value>? )",
    hue: "<number>|<angle>",
    "hue-rotate()": "hue-rotate( <angle> )",
    "hwb()": "hwb( [<hue>|none] [<percentage>|none] [<percentage>|none] [/ [<alpha-value>|none]]? )",
    "hypot()": "hypot( <calc-sum># )",
    image: "<url>|<image()>|<image-set()>|<element()>|<paint()>|<cross-fade()>|<gradient>",
    "image()": "image( <image-tags>? [<image-src>? , <color>?]! )",
    "image-set()": "image-set( <image-set-option># )",
    "image-set-option": "[<image>|<string>] [<resolution>||type( <string> )]",
    "image-src": "<url>|<string>",
    "image-tags": "ltr|rtl",
    "inflexible-breadth": "<length-percentage>|min-content|max-content|auto",
    "inset()": "inset( <length-percentage>{1,4} [round <'border-radius'>]? )",
    "invert()": "invert( <number-percentage> )",
    "keyframes-name": "<custom-ident>|<string>",
    "keyframe-block": "<keyframe-selector># { <declaration-list> }",
    "keyframe-block-list": "<keyframe-block>+",
    "keyframe-selector": "from|to|<percentage>",
    "lab()": "lab( [<percentage>|<number>|none] [<percentage>|<number>|none] [<percentage>|<number>|none] [/ [<alpha-value>|none]]? )",
    "layer()": "layer( <layer-name> )",
    "layer-name": "<ident> ['.' <ident>]*",
    "lch()": "lch( [<percentage>|<number>|none] [<percentage>|<number>|none] [<hue>|none] [/ [<alpha-value>|none]]? )",
    "leader()": "leader( <leader-type> )",
    "leader-type": "dotted|solid|space|<string>",
    "length-percentage": "<length>|<percentage>",
    "line-names": "'[' <custom-ident>* ']'",
    "line-name-list": "[<line-names>|<name-repeat>]+",
    "line-style": "none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset",
    "line-width": "<length>|thin|medium|thick",
    "linear-color-hint": "<length-percentage>",
    "linear-color-stop": "<color> <color-stop-length>?",
    "linear-gradient()": "linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
    "log()": "log( <calc-sum> , <calc-sum>? )",
    "mask-layer": "<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||<geometry-box>||[<geometry-box>|no-clip]||<compositing-operator>||<masking-mode>",
    "mask-position": "[<length-percentage>|left|center|right] [<length-percentage>|top|center|bottom]?",
    "mask-reference": "none|<image>|<mask-source>",
    "mask-source": "<url>",
    "masking-mode": "alpha|luminance|match-source",
    "matrix()": "matrix( <number>#{6} )",
    "matrix3d()": "matrix3d( <number>#{16} )",
    "max()": "max( <calc-sum># )",
    "media-and": "<media-in-parens> [and <media-in-parens>]+",
    "media-condition": "<media-not>|<media-and>|<media-or>|<media-in-parens>",
    "media-condition-without-or": "<media-not>|<media-and>|<media-in-parens>",
    "media-feature": "( [<mf-plain>|<mf-boolean>|<mf-range>] )",
    "media-in-parens": "( <media-condition> )|<media-feature>|<general-enclosed>",
    "media-not": "not <media-in-parens>",
    "media-or": "<media-in-parens> [or <media-in-parens>]+",
    "media-query": "<media-condition>|[not|only]? <media-type> [and <media-condition-without-or>]?",
    "media-query-list": "<media-query>#",
    "media-type": "<ident>",
    "mf-boolean": "<mf-name>",
    "mf-name": "<ident>",
    "mf-plain": "<mf-name> : <mf-value>",
    "mf-range": "<mf-name> ['<'|'>']? '='? <mf-value>|<mf-value> ['<'|'>']? '='? <mf-name>|<mf-value> '<' '='? <mf-name> '<' '='? <mf-value>|<mf-value> '>' '='? <mf-name> '>' '='? <mf-value>",
    "mf-value": "<number>|<dimension>|<ident>|<ratio>",
    "min()": "min( <calc-sum># )",
    "minmax()": "minmax( [<length-percentage>|min-content|max-content|auto] , [<length-percentage>|<flex>|min-content|max-content|auto] )",
    "mod()": "mod( <calc-sum> , <calc-sum> )",
    "name-repeat": "repeat( [<integer [1,∞]>|auto-fill] , <line-names>+ )",
    "named-color": "transparent|aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen|<-non-standard-color>",
    "namespace-prefix": "<ident>",
    "ns-prefix": "[<ident-token>|'*']? '|'",
    "number-percentage": "<number>|<percentage>",
    "numeric-figure-values": "[lining-nums|oldstyle-nums]",
    "numeric-fraction-values": "[diagonal-fractions|stacked-fractions]",
    "numeric-spacing-values": "[proportional-nums|tabular-nums]",
    nth: "<an-plus-b>|even|odd",
    "opacity()": "opacity( [<number-percentage>] )",
    "overflow-position": "unsafe|safe",
    "outline-radius": "<length>|<percentage>",
    "page-body": "<declaration>? [; <page-body>]?|<page-margin-box> <page-body>",
    "page-margin-box": "<page-margin-box-type> '{' <declaration-list> '}'",
    "page-margin-box-type": "@top-left-corner|@top-left|@top-center|@top-right|@top-right-corner|@bottom-left-corner|@bottom-left|@bottom-center|@bottom-right|@bottom-right-corner|@left-top|@left-middle|@left-bottom|@right-top|@right-middle|@right-bottom",
    "page-selector-list": "[<page-selector>#]?",
    "page-selector": "<pseudo-page>+|<ident> <pseudo-page>*",
    "page-size": "A5|A4|A3|B5|B4|JIS-B5|JIS-B4|letter|legal|ledger",
    "path()": "path( [<fill-rule> ,]? <string> )",
    "paint()": "paint( <ident> , <declaration-value>? )",
    "perspective()": "perspective( [<length [0,∞]>|none] )",
    "polygon()": "polygon( <fill-rule>? , [<length-percentage> <length-percentage>]# )",
    position: "[[left|center|right]||[top|center|bottom]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]?|[[left|right] <length-percentage>]&&[[top|bottom] <length-percentage>]]",
    "pow()": "pow( <calc-sum> , <calc-sum> )",
    "pseudo-class-selector": "':' <ident-token>|':' <function-token> <any-value> ')'",
    "pseudo-element-selector": "':' <pseudo-class-selector>",
    "pseudo-page": ": [left|right|first|blank]",
    quote: "open-quote|close-quote|no-open-quote|no-close-quote",
    "radial-gradient()": "radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
    ratio: "<number [0,∞]> [/ <number [0,∞]>]?",
    "relative-selector": "<combinator>? <complex-selector>",
    "relative-selector-list": "<relative-selector>#",
    "relative-size": "larger|smaller",
    "rem()": "rem( <calc-sum> , <calc-sum> )",
    "repeat-style": "repeat-x|repeat-y|[repeat|space|round|no-repeat]{1,2}",
    "repeating-conic-gradient()": "repeating-conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )",
    "repeating-linear-gradient()": "repeating-linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
    "repeating-radial-gradient()": "repeating-radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
    "reversed-counter-name": "reversed( <counter-name> )",
    "rgb()": "rgb( <percentage>{3} [/ <alpha-value>]? )|rgb( <number>{3} [/ <alpha-value>]? )|rgb( <percentage>#{3} , <alpha-value>? )|rgb( <number>#{3} , <alpha-value>? )",
    "rgba()": "rgba( <percentage>{3} [/ <alpha-value>]? )|rgba( <number>{3} [/ <alpha-value>]? )|rgba( <percentage>#{3} , <alpha-value>? )|rgba( <number>#{3} , <alpha-value>? )",
    "rotate()": "rotate( [<angle>|<zero>] )",
    "rotate3d()": "rotate3d( <number> , <number> , <number> , [<angle>|<zero>] )",
    "rotateX()": "rotateX( [<angle>|<zero>] )",
    "rotateY()": "rotateY( [<angle>|<zero>] )",
    "rotateZ()": "rotateZ( [<angle>|<zero>] )",
    "round()": "round( <rounding-strategy>? , <calc-sum> , <calc-sum> )",
    "rounding-strategy": "nearest|up|down|to-zero",
    "saturate()": "saturate( <number-percentage> )",
    "scale()": "scale( [<number>|<percentage>]#{1,2} )",
    "scale3d()": "scale3d( [<number>|<percentage>]#{3} )",
    "scaleX()": "scaleX( [<number>|<percentage>] )",
    "scaleY()": "scaleY( [<number>|<percentage>] )",
    "scaleZ()": "scaleZ( [<number>|<percentage>] )",
    scroller: "root|nearest",
    "self-position": "center|start|end|self-start|self-end|flex-start|flex-end",
    "shape-radius": "<length-percentage>|closest-side|farthest-side",
    "sign()": "sign( <calc-sum> )",
    "skew()": "skew( [<angle>|<zero>] , [<angle>|<zero>]? )",
    "skewX()": "skewX( [<angle>|<zero>] )",
    "skewY()": "skewY( [<angle>|<zero>] )",
    "sepia()": "sepia( <number-percentage> )",
    shadow: "inset?&&<length>{2,4}&&<color>?",
    "shadow-t": "[<length>{2,3}&&<color>?]",
    shape: "rect( <top> , <right> , <bottom> , <left> )|rect( <top> <right> <bottom> <left> )",
    "shape-box": "<box>|margin-box",
    "side-or-corner": "[left|right]||[top|bottom]",
    "sin()": "sin( <calc-sum> )",
    "single-animation": "<time>||<easing-function>||<time>||<single-animation-iteration-count>||<single-animation-direction>||<single-animation-fill-mode>||<single-animation-play-state>||[none|<keyframes-name>]",
    "single-animation-direction": "normal|reverse|alternate|alternate-reverse",
    "single-animation-fill-mode": "none|forwards|backwards|both",
    "single-animation-iteration-count": "infinite|<number>",
    "single-animation-play-state": "running|paused",
    "single-animation-timeline": "auto|none|<timeline-name>|scroll( <axis>? <scroller>? )",
    "single-transition": "[none|<single-transition-property>]||<time>||<easing-function>||<time>",
    "single-transition-property": "all|<custom-ident>",
    size: "closest-side|farthest-side|closest-corner|farthest-corner|<length>|<length-percentage>{2}",
    "sqrt()": "sqrt( <calc-sum> )",
    "step-position": "jump-start|jump-end|jump-none|jump-both|start|end",
    "step-timing-function": "step-start|step-end|steps( <integer> [, <step-position>]? )",
    "subclass-selector": "<id-selector>|<class-selector>|<attribute-selector>|<pseudo-class-selector>",
    "supports-condition": "not <supports-in-parens>|<supports-in-parens> [and <supports-in-parens>]*|<supports-in-parens> [or <supports-in-parens>]*",
    "supports-in-parens": "( <supports-condition> )|<supports-feature>|<general-enclosed>",
    "supports-feature": "<supports-decl>|<supports-selector-fn>",
    "supports-decl": "( <declaration> )",
    "supports-selector-fn": "selector( <complex-selector> )",
    symbol: "<string>|<image>|<custom-ident>",
    "tan()": "tan( <calc-sum> )",
    target: "<target-counter()>|<target-counters()>|<target-text()>",
    "target-counter()": "target-counter( [<string>|<url>] , <custom-ident> , <counter-style>? )",
    "target-counters()": "target-counters( [<string>|<url>] , <custom-ident> , <string> , <counter-style>? )",
    "target-text()": "target-text( [<string>|<url>] , [content|before|after|first-letter]? )",
    "time-percentage": "<time>|<percentage>",
    "timeline-name": "<custom-ident>|<string>",
    "easing-function": "linear|<cubic-bezier-timing-function>|<step-timing-function>",
    "track-breadth": "<length-percentage>|<flex>|min-content|max-content|auto",
    "track-list": "[<line-names>? [<track-size>|<track-repeat>]]+ <line-names>?",
    "track-repeat": "repeat( [<integer [1,∞]>] , [<line-names>? <track-size>]+ <line-names>? )",
    "track-size": "<track-breadth>|minmax( <inflexible-breadth> , <track-breadth> )|fit-content( <length-percentage> )",
    "transform-function": "<matrix()>|<translate()>|<translateX()>|<translateY()>|<scale()>|<scaleX()>|<scaleY()>|<rotate()>|<skew()>|<skewX()>|<skewY()>|<matrix3d()>|<translate3d()>|<translateZ()>|<scale3d()>|<scaleZ()>|<rotate3d()>|<rotateX()>|<rotateY()>|<rotateZ()>|<perspective()>",
    "transform-list": "<transform-function>+",
    "translate()": "translate( <length-percentage> , <length-percentage>? )",
    "translate3d()": "translate3d( <length-percentage> , <length-percentage> , <length> )",
    "translateX()": "translateX( <length-percentage> )",
    "translateY()": "translateY( <length-percentage> )",
    "translateZ()": "translateZ( <length> )",
    "type-or-unit": "string|color|url|integer|number|length|angle|time|frequency|cap|ch|em|ex|ic|lh|rlh|rem|vb|vi|vw|vh|vmin|vmax|mm|Q|cm|in|pt|pc|px|deg|grad|rad|turn|ms|s|Hz|kHz|%",
    "type-selector": "<wq-name>|<ns-prefix>? '*'",
    "var()": "var( <custom-property-name> , <declaration-value>? )",
    "viewport-length": "auto|<length-percentage>",
    "visual-box": "content-box|padding-box|border-box",
    "wq-name": "<ns-prefix>? <ident-token>",
    "-legacy-gradient": "<-webkit-gradient()>|<-legacy-linear-gradient>|<-legacy-repeating-linear-gradient>|<-legacy-radial-gradient>|<-legacy-repeating-radial-gradient>",
    "-legacy-linear-gradient": "-moz-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-linear-gradient( <-legacy-linear-gradient-arguments> )",
    "-legacy-repeating-linear-gradient": "-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )",
    "-legacy-linear-gradient-arguments": "[<angle>|<side-or-corner>]? , <color-stop-list>",
    "-legacy-radial-gradient": "-moz-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-radial-gradient( <-legacy-radial-gradient-arguments> )",
    "-legacy-repeating-radial-gradient": "-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )",
    "-legacy-radial-gradient-arguments": "[<position> ,]? [[[<-legacy-radial-gradient-shape>||<-legacy-radial-gradient-size>]|[<length>|<percentage>]{2}] ,]? <color-stop-list>",
    "-legacy-radial-gradient-size": "closest-side|closest-corner|farthest-side|farthest-corner|contain|cover",
    "-legacy-radial-gradient-shape": "circle|ellipse",
    "-non-standard-font": "-apple-system-body|-apple-system-headline|-apple-system-subheadline|-apple-system-caption1|-apple-system-caption2|-apple-system-footnote|-apple-system-short-body|-apple-system-short-headline|-apple-system-short-subheadline|-apple-system-short-caption1|-apple-system-short-footnote|-apple-system-tall-body",
    "-non-standard-color": "-moz-ButtonDefault|-moz-ButtonHoverFace|-moz-ButtonHoverText|-moz-CellHighlight|-moz-CellHighlightText|-moz-Combobox|-moz-ComboboxText|-moz-Dialog|-moz-DialogText|-moz-dragtargetzone|-moz-EvenTreeRow|-moz-Field|-moz-FieldText|-moz-html-CellHighlight|-moz-html-CellHighlightText|-moz-mac-accentdarkestshadow|-moz-mac-accentdarkshadow|-moz-mac-accentface|-moz-mac-accentlightesthighlight|-moz-mac-accentlightshadow|-moz-mac-accentregularhighlight|-moz-mac-accentregularshadow|-moz-mac-chrome-active|-moz-mac-chrome-inactive|-moz-mac-focusring|-moz-mac-menuselect|-moz-mac-menushadow|-moz-mac-menutextselect|-moz-MenuHover|-moz-MenuHoverText|-moz-MenuBarText|-moz-MenuBarHoverText|-moz-nativehyperlinktext|-moz-OddTreeRow|-moz-win-communicationstext|-moz-win-mediatext|-moz-activehyperlinktext|-moz-default-background-color|-moz-default-color|-moz-hyperlinktext|-moz-visitedhyperlinktext|-webkit-activelink|-webkit-focus-ring-color|-webkit-link|-webkit-text",
    "-non-standard-image-rendering": "optimize-contrast|-moz-crisp-edges|-o-crisp-edges|-webkit-optimize-contrast",
    "-non-standard-overflow": "-moz-scrollbars-none|-moz-scrollbars-horizontal|-moz-scrollbars-vertical|-moz-hidden-unscrollable",
    "-non-standard-width": "fill-available|min-intrinsic|intrinsic|-moz-available|-moz-fit-content|-moz-min-content|-moz-max-content|-webkit-min-content|-webkit-max-content",
    "-webkit-gradient()": "-webkit-gradient( <-webkit-gradient-type> , <-webkit-gradient-point> [, <-webkit-gradient-point>|, <-webkit-gradient-radius> , <-webkit-gradient-point>] [, <-webkit-gradient-radius>]? [, <-webkit-gradient-color-stop>]* )",
    "-webkit-gradient-color-stop": "from( <color> )|color-stop( [<number-zero-one>|<percentage>] , <color> )|to( <color> )",
    "-webkit-gradient-point": "[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]",
    "-webkit-gradient-radius": "<length>|<percentage>",
    "-webkit-gradient-type": "linear|radial",
    "-webkit-mask-box-repeat": "repeat|stretch|round",
    "-webkit-mask-clip-style": "border|border-box|padding|padding-box|content|content-box|text",
    "-ms-filter-function-list": "<-ms-filter-function>+",
    "-ms-filter-function": "<-ms-filter-function-progid>|<-ms-filter-function-legacy>",
    "-ms-filter-function-progid": "'progid:' [<ident-token> '.']* [<ident-token>|<function-token> <any-value>? )]",
    "-ms-filter-function-legacy": "<ident-token>|<function-token> <any-value>? )",
    "-ms-filter": "<string>",
    age: "child|young|old",
    "attr-name": "<wq-name>",
    "attr-fallback": "<any-value>",
    "bg-clip": "<box>|border|text",
    bottom: "<length>|auto",
    "generic-voice": "[<age>? <gender> <integer>?]",
    gender: "male|female|neutral",
    left: "<length>|auto",
    "mask-image": "<mask-reference>#",
    paint: "none|<color>|<url> [none|<color>]?|context-fill|context-stroke",
    right: "<length>|auto",
    "scroll-timeline-axis": "block|inline|vertical|horizontal",
    "scroll-timeline-name": "none|<custom-ident>",
    "single-animation-composition": "replace|add|accumulate",
    "svg-length": "<percentage>|<length>|<number>",
    "svg-writing-mode": "lr-tb|rl-tb|tb-rl|lr|rl|tb",
    top: "<length>|auto",
    x: "<number>",
    y: "<number>",
    declaration: "<ident-token> : <declaration-value>? ['!' important]?",
    "declaration-list": "[<declaration>? ';']* <declaration>?",
    url: "url( <string> <url-modifier>* )|<url-token>",
    "url-modifier": "<ident>|<function-token> <any-value> )",
    "number-zero-one": "<number [0,1]>",
    "number-one-or-greater": "<number [1,∞]>",
    "-non-standard-display": "-ms-inline-flexbox|-ms-grid|-ms-inline-grid|-webkit-flex|-webkit-inline-flex|-webkit-box|-webkit-inline-box|-moz-inline-stack|-moz-box|-moz-inline-box"
  },
  properties: {
    "--*": "<declaration-value>",
    "-ms-accelerator": "false|true",
    "-ms-block-progression": "tb|rl|bt|lr",
    "-ms-content-zoom-chaining": "none|chained",
    "-ms-content-zooming": "none|zoom",
    "-ms-content-zoom-limit": "<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>",
    "-ms-content-zoom-limit-max": "<percentage>",
    "-ms-content-zoom-limit-min": "<percentage>",
    "-ms-content-zoom-snap": "<'-ms-content-zoom-snap-type'>||<'-ms-content-zoom-snap-points'>",
    "-ms-content-zoom-snap-points": "snapInterval( <percentage> , <percentage> )|snapList( <percentage># )",
    "-ms-content-zoom-snap-type": "none|proximity|mandatory",
    "-ms-filter": "<string>",
    "-ms-flow-from": "[none|<custom-ident>]#",
    "-ms-flow-into": "[none|<custom-ident>]#",
    "-ms-grid-columns": "none|<track-list>|<auto-track-list>",
    "-ms-grid-rows": "none|<track-list>|<auto-track-list>",
    "-ms-high-contrast-adjust": "auto|none",
    "-ms-hyphenate-limit-chars": "auto|<integer>{1,3}",
    "-ms-hyphenate-limit-lines": "no-limit|<integer>",
    "-ms-hyphenate-limit-zone": "<percentage>|<length>",
    "-ms-ime-align": "auto|after",
    "-ms-overflow-style": "auto|none|scrollbar|-ms-autohiding-scrollbar",
    "-ms-scrollbar-3dlight-color": "<color>",
    "-ms-scrollbar-arrow-color": "<color>",
    "-ms-scrollbar-base-color": "<color>",
    "-ms-scrollbar-darkshadow-color": "<color>",
    "-ms-scrollbar-face-color": "<color>",
    "-ms-scrollbar-highlight-color": "<color>",
    "-ms-scrollbar-shadow-color": "<color>",
    "-ms-scrollbar-track-color": "<color>",
    "-ms-scroll-chaining": "chained|none",
    "-ms-scroll-limit": "<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>",
    "-ms-scroll-limit-x-max": "auto|<length>",
    "-ms-scroll-limit-x-min": "<length>",
    "-ms-scroll-limit-y-max": "auto|<length>",
    "-ms-scroll-limit-y-min": "<length>",
    "-ms-scroll-rails": "none|railed",
    "-ms-scroll-snap-points-x": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
    "-ms-scroll-snap-points-y": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
    "-ms-scroll-snap-type": "none|proximity|mandatory",
    "-ms-scroll-snap-x": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>",
    "-ms-scroll-snap-y": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>",
    "-ms-scroll-translation": "none|vertical-to-horizontal",
    "-ms-text-autospace": "none|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space",
    "-ms-touch-select": "grippers|none",
    "-ms-user-select": "none|element|text",
    "-ms-wrap-flow": "auto|both|start|end|maximum|clear",
    "-ms-wrap-margin": "<length>",
    "-ms-wrap-through": "wrap|none",
    "-moz-appearance": "none|button|button-arrow-down|button-arrow-next|button-arrow-previous|button-arrow-up|button-bevel|button-focus|caret|checkbox|checkbox-container|checkbox-label|checkmenuitem|dualbutton|groupbox|listbox|listitem|menuarrow|menubar|menucheckbox|menuimage|menuitem|menuitemtext|menulist|menulist-button|menulist-text|menulist-textfield|menupopup|menuradio|menuseparator|meterbar|meterchunk|progressbar|progressbar-vertical|progresschunk|progresschunk-vertical|radio|radio-container|radio-label|radiomenuitem|range|range-thumb|resizer|resizerpanel|scale-horizontal|scalethumbend|scalethumb-horizontal|scalethumbstart|scalethumbtick|scalethumb-vertical|scale-vertical|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|separator|sheet|spinner|spinner-downbutton|spinner-textfield|spinner-upbutton|splitter|statusbar|statusbarpanel|tab|tabpanel|tabpanels|tab-scroll-arrow-back|tab-scroll-arrow-forward|textfield|textfield-multiline|toolbar|toolbarbutton|toolbarbutton-dropdown|toolbargripper|toolbox|tooltip|treeheader|treeheadercell|treeheadersortarrow|treeitem|treeline|treetwisty|treetwistyopen|treeview|-moz-mac-unified-toolbar|-moz-win-borderless-glass|-moz-win-browsertabbar-toolbox|-moz-win-communicationstext|-moz-win-communications-toolbox|-moz-win-exclude-glass|-moz-win-glass|-moz-win-mediatext|-moz-win-media-toolbox|-moz-window-button-box|-moz-window-button-box-maximized|-moz-window-button-close|-moz-window-button-maximize|-moz-window-button-minimize|-moz-window-button-restore|-moz-window-frame-bottom|-moz-window-frame-left|-moz-window-frame-right|-moz-window-titlebar|-moz-window-titlebar-maximized",
    "-moz-binding": "<url>|none",
    "-moz-border-bottom-colors": "<color>+|none",
    "-moz-border-left-colors": "<color>+|none",
    "-moz-border-right-colors": "<color>+|none",
    "-moz-border-top-colors": "<color>+|none",
    "-moz-context-properties": "none|[fill|fill-opacity|stroke|stroke-opacity]#",
    "-moz-float-edge": "border-box|content-box|margin-box|padding-box",
    "-moz-force-broken-image-icon": "0|1",
    "-moz-image-region": "<shape>|auto",
    "-moz-orient": "inline|block|horizontal|vertical",
    "-moz-outline-radius": "<outline-radius>{1,4} [/ <outline-radius>{1,4}]?",
    "-moz-outline-radius-bottomleft": "<outline-radius>",
    "-moz-outline-radius-bottomright": "<outline-radius>",
    "-moz-outline-radius-topleft": "<outline-radius>",
    "-moz-outline-radius-topright": "<outline-radius>",
    "-moz-stack-sizing": "ignore|stretch-to-fit",
    "-moz-text-blink": "none|blink",
    "-moz-user-focus": "ignore|normal|select-after|select-before|select-menu|select-same|select-all|none",
    "-moz-user-input": "auto|none|enabled|disabled",
    "-moz-user-modify": "read-only|read-write|write-only",
    "-moz-window-dragging": "drag|no-drag",
    "-moz-window-shadow": "default|menu|tooltip|sheet|none",
    "-webkit-appearance": "none|button|button-bevel|caps-lock-indicator|caret|checkbox|default-button|inner-spin-button|listbox|listitem|media-controls-background|media-controls-fullscreen-background|media-current-time-display|media-enter-fullscreen-button|media-exit-fullscreen-button|media-fullscreen-button|media-mute-button|media-overlay-play-button|media-play-button|media-seek-back-button|media-seek-forward-button|media-slider|media-sliderthumb|media-time-remaining-display|media-toggle-closed-captions-button|media-volume-slider|media-volume-slider-container|media-volume-sliderthumb|menulist|menulist-button|menulist-text|menulist-textfield|meter|progress-bar|progress-bar-value|push-button|radio|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbargripper-horizontal|scrollbargripper-vertical|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|searchfield-cancel-button|searchfield-decoration|searchfield-results-button|searchfield-results-decoration|slider-horizontal|slider-vertical|sliderthumb-horizontal|sliderthumb-vertical|square-button|textarea|textfield|-apple-pay-button",
    "-webkit-border-before": "<'border-width'>||<'border-style'>||<color>",
    "-webkit-border-before-color": "<color>",
    "-webkit-border-before-style": "<'border-style'>",
    "-webkit-border-before-width": "<'border-width'>",
    "-webkit-box-reflect": "[above|below|right|left]? <length>? <image>?",
    "-webkit-line-clamp": "none|<integer>",
    "-webkit-mask": "[<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||[<box>|border|padding|content|text]||[<box>|border|padding|content]]#",
    "-webkit-mask-attachment": "<attachment>#",
    "-webkit-mask-clip": "[<box>|border|padding|content|text]#",
    "-webkit-mask-composite": "<composite-style>#",
    "-webkit-mask-image": "<mask-reference>#",
    "-webkit-mask-origin": "[<box>|border|padding|content]#",
    "-webkit-mask-position": "<position>#",
    "-webkit-mask-position-x": "[<length-percentage>|left|center|right]#",
    "-webkit-mask-position-y": "[<length-percentage>|top|center|bottom]#",
    "-webkit-mask-repeat": "<repeat-style>#",
    "-webkit-mask-repeat-x": "repeat|no-repeat|space|round",
    "-webkit-mask-repeat-y": "repeat|no-repeat|space|round",
    "-webkit-mask-size": "<bg-size>#",
    "-webkit-overflow-scrolling": "auto|touch",
    "-webkit-tap-highlight-color": "<color>",
    "-webkit-text-fill-color": "<color>",
    "-webkit-text-stroke": "<length>||<color>",
    "-webkit-text-stroke-color": "<color>",
    "-webkit-text-stroke-width": "<length>",
    "-webkit-touch-callout": "default|none",
    "-webkit-user-modify": "read-only|read-write|read-write-plaintext-only",
    "accent-color": "auto|<color>",
    "align-content": "normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>",
    "align-items": "normal|stretch|<baseline-position>|[<overflow-position>? <self-position>]",
    "align-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? <self-position>",
    "align-tracks": "[normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>]#",
    all: "initial|inherit|unset|revert|revert-layer",
    animation: "<single-animation>#",
    "animation-composition": "<single-animation-composition>#",
    "animation-delay": "<time>#",
    "animation-direction": "<single-animation-direction>#",
    "animation-duration": "<time>#",
    "animation-fill-mode": "<single-animation-fill-mode>#",
    "animation-iteration-count": "<single-animation-iteration-count>#",
    "animation-name": "[none|<keyframes-name>]#",
    "animation-play-state": "<single-animation-play-state>#",
    "animation-timing-function": "<easing-function>#",
    "animation-timeline": "<single-animation-timeline>#",
    appearance: "none|auto|textfield|menulist-button|<compat-auto>",
    "aspect-ratio": "auto|<ratio>",
    azimuth: "<angle>|[[left-side|far-left|left|center-left|center|center-right|right|far-right|right-side]||behind]|leftwards|rightwards",
    "backdrop-filter": "none|<filter-function-list>",
    "backface-visibility": "visible|hidden",
    background: "[<bg-layer> ,]* <final-bg-layer>",
    "background-attachment": "<attachment>#",
    "background-blend-mode": "<blend-mode>#",
    "background-clip": "<bg-clip>#",
    "background-color": "<color>",
    "background-image": "<bg-image>#",
    "background-origin": "<box>#",
    "background-position": "<bg-position>#",
    "background-position-x": "[center|[[left|right|x-start|x-end]? <length-percentage>?]!]#",
    "background-position-y": "[center|[[top|bottom|y-start|y-end]? <length-percentage>?]!]#",
    "background-repeat": "<repeat-style>#",
    "background-size": "<bg-size>#",
    "block-overflow": "clip|ellipsis|<string>",
    "block-size": "<'width'>",
    border: "<line-width>||<line-style>||<color>",
    "border-block": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-block-color": "<'border-top-color'>{1,2}",
    "border-block-style": "<'border-top-style'>",
    "border-block-width": "<'border-top-width'>",
    "border-block-end": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-block-end-color": "<'border-top-color'>",
    "border-block-end-style": "<'border-top-style'>",
    "border-block-end-width": "<'border-top-width'>",
    "border-block-start": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-block-start-color": "<'border-top-color'>",
    "border-block-start-style": "<'border-top-style'>",
    "border-block-start-width": "<'border-top-width'>",
    "border-bottom": "<line-width>||<line-style>||<color>",
    "border-bottom-color": "<'border-top-color'>",
    "border-bottom-left-radius": "<length-percentage>{1,2}",
    "border-bottom-right-radius": "<length-percentage>{1,2}",
    "border-bottom-style": "<line-style>",
    "border-bottom-width": "<line-width>",
    "border-collapse": "collapse|separate",
    "border-color": "<color>{1,4}",
    "border-end-end-radius": "<length-percentage>{1,2}",
    "border-end-start-radius": "<length-percentage>{1,2}",
    "border-image": "<'border-image-source'>||<'border-image-slice'> [/ <'border-image-width'>|/ <'border-image-width'>? / <'border-image-outset'>]?||<'border-image-repeat'>",
    "border-image-outset": "[<length>|<number>]{1,4}",
    "border-image-repeat": "[stretch|repeat|round|space]{1,2}",
    "border-image-slice": "<number-percentage>{1,4}&&fill?",
    "border-image-source": "none|<image>",
    "border-image-width": "[<length-percentage>|<number>|auto]{1,4}",
    "border-inline": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-inline-end": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-inline-color": "<'border-top-color'>{1,2}",
    "border-inline-style": "<'border-top-style'>",
    "border-inline-width": "<'border-top-width'>",
    "border-inline-end-color": "<'border-top-color'>",
    "border-inline-end-style": "<'border-top-style'>",
    "border-inline-end-width": "<'border-top-width'>",
    "border-inline-start": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-inline-start-color": "<'border-top-color'>",
    "border-inline-start-style": "<'border-top-style'>",
    "border-inline-start-width": "<'border-top-width'>",
    "border-left": "<line-width>||<line-style>||<color>",
    "border-left-color": "<color>",
    "border-left-style": "<line-style>",
    "border-left-width": "<line-width>",
    "border-radius": "<length-percentage>{1,4} [/ <length-percentage>{1,4}]?",
    "border-right": "<line-width>||<line-style>||<color>",
    "border-right-color": "<color>",
    "border-right-style": "<line-style>",
    "border-right-width": "<line-width>",
    "border-spacing": "<length> <length>?",
    "border-start-end-radius": "<length-percentage>{1,2}",
    "border-start-start-radius": "<length-percentage>{1,2}",
    "border-style": "<line-style>{1,4}",
    "border-top": "<line-width>||<line-style>||<color>",
    "border-top-color": "<color>",
    "border-top-left-radius": "<length-percentage>{1,2}",
    "border-top-right-radius": "<length-percentage>{1,2}",
    "border-top-style": "<line-style>",
    "border-top-width": "<line-width>",
    "border-width": "<line-width>{1,4}",
    bottom: "<length>|<percentage>|auto",
    "box-align": "start|center|end|baseline|stretch",
    "box-decoration-break": "slice|clone",
    "box-direction": "normal|reverse|inherit",
    "box-flex": "<number>",
    "box-flex-group": "<integer>",
    "box-lines": "single|multiple",
    "box-ordinal-group": "<integer>",
    "box-orient": "horizontal|vertical|inline-axis|block-axis|inherit",
    "box-pack": "start|center|end|justify",
    "box-shadow": "none|<shadow>#",
    "box-sizing": "content-box|border-box",
    "break-after": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
    "break-before": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
    "break-inside": "auto|avoid|avoid-page|avoid-column|avoid-region",
    "caption-side": "top|bottom|block-start|block-end|inline-start|inline-end",
    caret: "<'caret-color'>||<'caret-shape'>",
    "caret-color": "auto|<color>",
    "caret-shape": "auto|bar|block|underscore",
    clear: "none|left|right|both|inline-start|inline-end",
    clip: "<shape>|auto",
    "clip-path": "<clip-source>|[<basic-shape>||<geometry-box>]|none",
    color: "<color>",
    "print-color-adjust": "economy|exact",
    "color-scheme": "normal|[light|dark|<custom-ident>]+&&only?",
    "column-count": "<integer>|auto",
    "column-fill": "auto|balance|balance-all",
    "column-gap": "normal|<length-percentage>",
    "column-rule": "<'column-rule-width'>||<'column-rule-style'>||<'column-rule-color'>",
    "column-rule-color": "<color>",
    "column-rule-style": "<'border-style'>",
    "column-rule-width": "<'border-width'>",
    "column-span": "none|all",
    "column-width": "<length>|auto",
    columns: "<'column-width'>||<'column-count'>",
    contain: "none|strict|content|[[size||inline-size]||layout||style||paint]",
    "contain-intrinsic-size": "[none|<length>|auto <length>]{1,2}",
    "contain-intrinsic-block-size": "none|<length>|auto <length>",
    "contain-intrinsic-height": "none|<length>|auto <length>",
    "contain-intrinsic-inline-size": "none|<length>|auto <length>",
    "contain-intrinsic-width": "none|<length>|auto <length>",
    content: "normal|none|[<content-replacement>|<content-list>] [/ [<string>|<counter>]+]?",
    "content-visibility": "visible|auto|hidden",
    "counter-increment": "[<counter-name> <integer>?]+|none",
    "counter-reset": "[<counter-name> <integer>?|<reversed-counter-name> <integer>?]+|none",
    "counter-set": "[<counter-name> <integer>?]+|none",
    cursor: "[[<url> [<x> <y>]? ,]* [auto|default|none|context-menu|help|pointer|progress|wait|cell|crosshair|text|vertical-text|alias|copy|move|no-drop|not-allowed|e-resize|n-resize|ne-resize|nw-resize|s-resize|se-resize|sw-resize|w-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|col-resize|row-resize|all-scroll|zoom-in|zoom-out|grab|grabbing|hand|-webkit-grab|-webkit-grabbing|-webkit-zoom-in|-webkit-zoom-out|-moz-grab|-moz-grabbing|-moz-zoom-in|-moz-zoom-out]]",
    direction: "ltr|rtl",
    display: "[<display-outside>||<display-inside>]|<display-listitem>|<display-internal>|<display-box>|<display-legacy>|<-non-standard-display>",
    "empty-cells": "show|hide",
    filter: "none|<filter-function-list>|<-ms-filter-function-list>",
    flex: "none|[<'flex-grow'> <'flex-shrink'>?||<'flex-basis'>]",
    "flex-basis": "content|<'width'>",
    "flex-direction": "row|row-reverse|column|column-reverse",
    "flex-flow": "<'flex-direction'>||<'flex-wrap'>",
    "flex-grow": "<number>",
    "flex-shrink": "<number>",
    "flex-wrap": "nowrap|wrap|wrap-reverse",
    float: "left|right|none|inline-start|inline-end",
    font: "[[<'font-style'>||<font-variant-css21>||<'font-weight'>||<'font-stretch'>]? <'font-size'> [/ <'line-height'>]? <'font-family'>]|caption|icon|menu|message-box|small-caption|status-bar",
    "font-family": "[<family-name>|<generic-family>]#",
    "font-feature-settings": "normal|<feature-tag-value>#",
    "font-kerning": "auto|normal|none",
    "font-language-override": "normal|<string>",
    "font-optical-sizing": "auto|none",
    "font-variation-settings": "normal|[<string> <number>]#",
    "font-size": "<absolute-size>|<relative-size>|<length-percentage>",
    "font-size-adjust": "none|[ex-height|cap-height|ch-width|ic-width|ic-height]? [from-font|<number>]",
    "font-smooth": "auto|never|always|<absolute-size>|<length>",
    "font-stretch": "<font-stretch-absolute>",
    "font-style": "normal|italic|oblique <angle>?",
    "font-synthesis": "none|[weight||style||small-caps]",
    "font-variant": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]",
    "font-variant-alternates": "normal|[stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )]",
    "font-variant-caps": "normal|small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps",
    "font-variant-east-asian": "normal|[<east-asian-variant-values>||<east-asian-width-values>||ruby]",
    "font-variant-ligatures": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>]",
    "font-variant-numeric": "normal|[<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero]",
    "font-variant-position": "normal|sub|super",
    "font-weight": "<font-weight-absolute>|bolder|lighter",
    "forced-color-adjust": "auto|none",
    gap: "<'row-gap'> <'column-gap'>?",
    grid: "<'grid-template'>|<'grid-template-rows'> / [auto-flow&&dense?] <'grid-auto-columns'>?|[auto-flow&&dense?] <'grid-auto-rows'>? / <'grid-template-columns'>",
    "grid-area": "<grid-line> [/ <grid-line>]{0,3}",
    "grid-auto-columns": "<track-size>+",
    "grid-auto-flow": "[row|column]||dense",
    "grid-auto-rows": "<track-size>+",
    "grid-column": "<grid-line> [/ <grid-line>]?",
    "grid-column-end": "<grid-line>",
    "grid-column-gap": "<length-percentage>",
    "grid-column-start": "<grid-line>",
    "grid-gap": "<'grid-row-gap'> <'grid-column-gap'>?",
    "grid-row": "<grid-line> [/ <grid-line>]?",
    "grid-row-end": "<grid-line>",
    "grid-row-gap": "<length-percentage>",
    "grid-row-start": "<grid-line>",
    "grid-template": "none|[<'grid-template-rows'> / <'grid-template-columns'>]|[<line-names>? <string> <track-size>? <line-names>?]+ [/ <explicit-track-list>]?",
    "grid-template-areas": "none|<string>+",
    "grid-template-columns": "none|<track-list>|<auto-track-list>|subgrid <line-name-list>?",
    "grid-template-rows": "none|<track-list>|<auto-track-list>|subgrid <line-name-list>?",
    "hanging-punctuation": "none|[first||[force-end|allow-end]||last]",
    height: "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )",
    "hyphenate-character": "auto|<string>",
    hyphens: "none|manual|auto",
    "image-orientation": "from-image|<angle>|[<angle>? flip]",
    "image-rendering": "auto|crisp-edges|pixelated|optimizeSpeed|optimizeQuality|<-non-standard-image-rendering>",
    "image-resolution": "[from-image||<resolution>]&&snap?",
    "ime-mode": "auto|normal|active|inactive|disabled",
    "initial-letter": "normal|[<number> <integer>?]",
    "initial-letter-align": "[auto|alphabetic|hanging|ideographic]",
    "inline-size": "<'width'>",
    "input-security": "auto|none",
    inset: "<'top'>{1,4}",
    "inset-block": "<'top'>{1,2}",
    "inset-block-end": "<'top'>",
    "inset-block-start": "<'top'>",
    "inset-inline": "<'top'>{1,2}",
    "inset-inline-end": "<'top'>",
    "inset-inline-start": "<'top'>",
    isolation: "auto|isolate",
    "justify-content": "normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]",
    "justify-items": "normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]|legacy|legacy&&[left|right|center]",
    "justify-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]",
    "justify-tracks": "[normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]]#",
    left: "<length>|<percentage>|auto",
    "letter-spacing": "normal|<length-percentage>",
    "line-break": "auto|loose|normal|strict|anywhere",
    "line-clamp": "none|<integer>",
    "line-height": "normal|<number>|<length>|<percentage>",
    "line-height-step": "<length>",
    "list-style": "<'list-style-type'>||<'list-style-position'>||<'list-style-image'>",
    "list-style-image": "<image>|none",
    "list-style-position": "inside|outside",
    "list-style-type": "<counter-style>|<string>|none",
    margin: "[<length>|<percentage>|auto]{1,4}",
    "margin-block": "<'margin-left'>{1,2}",
    "margin-block-end": "<'margin-left'>",
    "margin-block-start": "<'margin-left'>",
    "margin-bottom": "<length>|<percentage>|auto",
    "margin-inline": "<'margin-left'>{1,2}",
    "margin-inline-end": "<'margin-left'>",
    "margin-inline-start": "<'margin-left'>",
    "margin-left": "<length>|<percentage>|auto",
    "margin-right": "<length>|<percentage>|auto",
    "margin-top": "<length>|<percentage>|auto",
    "margin-trim": "none|in-flow|all",
    mask: "<mask-layer>#",
    "mask-border": "<'mask-border-source'>||<'mask-border-slice'> [/ <'mask-border-width'>? [/ <'mask-border-outset'>]?]?||<'mask-border-repeat'>||<'mask-border-mode'>",
    "mask-border-mode": "luminance|alpha",
    "mask-border-outset": "[<length>|<number>]{1,4}",
    "mask-border-repeat": "[stretch|repeat|round|space]{1,2}",
    "mask-border-slice": "<number-percentage>{1,4} fill?",
    "mask-border-source": "none|<image>",
    "mask-border-width": "[<length-percentage>|<number>|auto]{1,4}",
    "mask-clip": "[<geometry-box>|no-clip]#",
    "mask-composite": "<compositing-operator>#",
    "mask-image": "<mask-reference>#",
    "mask-mode": "<masking-mode>#",
    "mask-origin": "<geometry-box>#",
    "mask-position": "<position>#",
    "mask-repeat": "<repeat-style>#",
    "mask-size": "<bg-size>#",
    "mask-type": "luminance|alpha",
    "masonry-auto-flow": "[pack|next]||[definite-first|ordered]",
    "math-depth": "auto-add|add( <integer> )|<integer>",
    "math-shift": "normal|compact",
    "math-style": "normal|compact",
    "max-block-size": "<'max-width'>",
    "max-height": "none|<length-percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )",
    "max-inline-size": "<'max-width'>",
    "max-lines": "none|<integer>",
    "max-width": "none|<length-percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|<-non-standard-width>",
    "min-block-size": "<'min-width'>",
    "min-height": "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )",
    "min-inline-size": "<'min-width'>",
    "min-width": "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|<-non-standard-width>",
    "mix-blend-mode": "<blend-mode>|plus-lighter",
    "object-fit": "fill|contain|cover|none|scale-down",
    "object-position": "<position>",
    offset: "[<'offset-position'>? [<'offset-path'> [<'offset-distance'>||<'offset-rotate'>]?]?]! [/ <'offset-anchor'>]?",
    "offset-anchor": "auto|<position>",
    "offset-distance": "<length-percentage>",
    "offset-path": "none|ray( [<angle>&&<size>&&contain?] )|<path()>|<url>|[<basic-shape>||<geometry-box>]",
    "offset-position": "auto|<position>",
    "offset-rotate": "[auto|reverse]||<angle>",
    opacity: "<alpha-value>",
    order: "<integer>",
    orphans: "<integer>",
    outline: "[<'outline-color'>||<'outline-style'>||<'outline-width'>]",
    "outline-color": "<color>|invert",
    "outline-offset": "<length>",
    "outline-style": "auto|<'border-style'>",
    "outline-width": "<line-width>",
    overflow: "[visible|hidden|clip|scroll|auto]{1,2}|<-non-standard-overflow>",
    "overflow-anchor": "auto|none",
    "overflow-block": "visible|hidden|clip|scroll|auto",
    "overflow-clip-box": "padding-box|content-box",
    "overflow-clip-margin": "<visual-box>||<length [0,∞]>",
    "overflow-inline": "visible|hidden|clip|scroll|auto",
    "overflow-wrap": "normal|break-word|anywhere",
    "overflow-x": "visible|hidden|clip|scroll|auto",
    "overflow-y": "visible|hidden|clip|scroll|auto",
    "overscroll-behavior": "[contain|none|auto]{1,2}",
    "overscroll-behavior-block": "contain|none|auto",
    "overscroll-behavior-inline": "contain|none|auto",
    "overscroll-behavior-x": "contain|none|auto",
    "overscroll-behavior-y": "contain|none|auto",
    padding: "[<length>|<percentage>]{1,4}",
    "padding-block": "<'padding-left'>{1,2}",
    "padding-block-end": "<'padding-left'>",
    "padding-block-start": "<'padding-left'>",
    "padding-bottom": "<length>|<percentage>",
    "padding-inline": "<'padding-left'>{1,2}",
    "padding-inline-end": "<'padding-left'>",
    "padding-inline-start": "<'padding-left'>",
    "padding-left": "<length>|<percentage>",
    "padding-right": "<length>|<percentage>",
    "padding-top": "<length>|<percentage>",
    "page-break-after": "auto|always|avoid|left|right|recto|verso",
    "page-break-before": "auto|always|avoid|left|right|recto|verso",
    "page-break-inside": "auto|avoid",
    "paint-order": "normal|[fill||stroke||markers]",
    perspective: "none|<length>",
    "perspective-origin": "<position>",
    "place-content": "<'align-content'> <'justify-content'>?",
    "place-items": "<'align-items'> <'justify-items'>?",
    "place-self": "<'align-self'> <'justify-self'>?",
    "pointer-events": "auto|none|visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|inherit",
    position: "static|relative|absolute|sticky|fixed|-webkit-sticky",
    quotes: "none|auto|[<string> <string>]+",
    resize: "none|both|horizontal|vertical|block|inline",
    right: "<length>|<percentage>|auto",
    rotate: "none|<angle>|[x|y|z|<number>{3}]&&<angle>",
    "row-gap": "normal|<length-percentage>",
    "ruby-align": "start|center|space-between|space-around",
    "ruby-merge": "separate|collapse|auto",
    "ruby-position": "[alternate||[over|under]]|inter-character",
    scale: "none|<number>{1,3}",
    "scrollbar-color": "auto|<color>{2}",
    "scrollbar-gutter": "auto|stable&&both-edges?",
    "scrollbar-width": "auto|thin|none",
    "scroll-behavior": "auto|smooth",
    "scroll-margin": "<length>{1,4}",
    "scroll-margin-block": "<length>{1,2}",
    "scroll-margin-block-start": "<length>",
    "scroll-margin-block-end": "<length>",
    "scroll-margin-bottom": "<length>",
    "scroll-margin-inline": "<length>{1,2}",
    "scroll-margin-inline-start": "<length>",
    "scroll-margin-inline-end": "<length>",
    "scroll-margin-left": "<length>",
    "scroll-margin-right": "<length>",
    "scroll-margin-top": "<length>",
    "scroll-padding": "[auto|<length-percentage>]{1,4}",
    "scroll-padding-block": "[auto|<length-percentage>]{1,2}",
    "scroll-padding-block-start": "auto|<length-percentage>",
    "scroll-padding-block-end": "auto|<length-percentage>",
    "scroll-padding-bottom": "auto|<length-percentage>",
    "scroll-padding-inline": "[auto|<length-percentage>]{1,2}",
    "scroll-padding-inline-start": "auto|<length-percentage>",
    "scroll-padding-inline-end": "auto|<length-percentage>",
    "scroll-padding-left": "auto|<length-percentage>",
    "scroll-padding-right": "auto|<length-percentage>",
    "scroll-padding-top": "auto|<length-percentage>",
    "scroll-snap-align": "[none|start|end|center]{1,2}",
    "scroll-snap-coordinate": "none|<position>#",
    "scroll-snap-destination": "<position>",
    "scroll-snap-points-x": "none|repeat( <length-percentage> )",
    "scroll-snap-points-y": "none|repeat( <length-percentage> )",
    "scroll-snap-stop": "normal|always",
    "scroll-snap-type": "none|[x|y|block|inline|both] [mandatory|proximity]?",
    "scroll-snap-type-x": "none|mandatory|proximity",
    "scroll-snap-type-y": "none|mandatory|proximity",
    "scroll-timeline": "<scroll-timeline-name>||<scroll-timeline-axis>",
    "scroll-timeline-axis": "block|inline|vertical|horizontal",
    "scroll-timeline-name": "none|<custom-ident>",
    "shape-image-threshold": "<alpha-value>",
    "shape-margin": "<length-percentage>",
    "shape-outside": "none|[<shape-box>||<basic-shape>]|<image>",
    "tab-size": "<integer>|<length>",
    "table-layout": "auto|fixed",
    "text-align": "start|end|left|right|center|justify|match-parent",
    "text-align-last": "auto|start|end|left|right|center|justify",
    "text-combine-upright": "none|all|[digits <integer>?]",
    "text-decoration": "<'text-decoration-line'>||<'text-decoration-style'>||<'text-decoration-color'>||<'text-decoration-thickness'>",
    "text-decoration-color": "<color>",
    "text-decoration-line": "none|[underline||overline||line-through||blink]|spelling-error|grammar-error",
    "text-decoration-skip": "none|[objects||[spaces|[leading-spaces||trailing-spaces]]||edges||box-decoration]",
    "text-decoration-skip-ink": "auto|all|none",
    "text-decoration-style": "solid|double|dotted|dashed|wavy",
    "text-decoration-thickness": "auto|from-font|<length>|<percentage>",
    "text-emphasis": "<'text-emphasis-style'>||<'text-emphasis-color'>",
    "text-emphasis-color": "<color>",
    "text-emphasis-position": "[over|under]&&[right|left]",
    "text-emphasis-style": "none|[[filled|open]||[dot|circle|double-circle|triangle|sesame]]|<string>",
    "text-indent": "<length-percentage>&&hanging?&&each-line?",
    "text-justify": "auto|inter-character|inter-word|none",
    "text-orientation": "mixed|upright|sideways",
    "text-overflow": "[clip|ellipsis|<string>]{1,2}",
    "text-rendering": "auto|optimizeSpeed|optimizeLegibility|geometricPrecision",
    "text-shadow": "none|<shadow-t>#",
    "text-size-adjust": "none|auto|<percentage>",
    "text-transform": "none|capitalize|uppercase|lowercase|full-width|full-size-kana",
    "text-underline-offset": "auto|<length>|<percentage>",
    "text-underline-position": "auto|from-font|[under||[left|right]]",
    top: "<length>|<percentage>|auto",
    "touch-action": "auto|none|[[pan-x|pan-left|pan-right]||[pan-y|pan-up|pan-down]||pinch-zoom]|manipulation",
    transform: "none|<transform-list>",
    "transform-box": "content-box|border-box|fill-box|stroke-box|view-box",
    "transform-origin": "[<length-percentage>|left|center|right|top|bottom]|[[<length-percentage>|left|center|right]&&[<length-percentage>|top|center|bottom]] <length>?",
    "transform-style": "flat|preserve-3d",
    transition: "<single-transition>#",
    "transition-delay": "<time>#",
    "transition-duration": "<time>#",
    "transition-property": "none|<single-transition-property>#",
    "transition-timing-function": "<easing-function>#",
    translate: "none|<length-percentage> [<length-percentage> <length>?]?",
    "unicode-bidi": "normal|embed|isolate|bidi-override|isolate-override|plaintext|-moz-isolate|-moz-isolate-override|-moz-plaintext|-webkit-isolate|-webkit-isolate-override|-webkit-plaintext",
    "user-select": "auto|text|none|contain|all",
    "vertical-align": "baseline|sub|super|text-top|text-bottom|middle|top|bottom|<percentage>|<length>",
    visibility: "visible|hidden|collapse",
    "white-space": "normal|pre|nowrap|pre-wrap|pre-line|break-spaces",
    widows: "<integer>",
    width: "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|fill|stretch|intrinsic|-moz-max-content|-webkit-max-content|-moz-fit-content|-webkit-fit-content",
    "will-change": "auto|<animateable-feature>#",
    "word-break": "normal|break-all|keep-all|break-word",
    "word-spacing": "normal|<length>",
    "word-wrap": "normal|break-word",
    "writing-mode": "horizontal-tb|vertical-rl|vertical-lr|sideways-rl|sideways-lr|<svg-writing-mode>",
    "z-index": "auto|<integer>",
    zoom: "normal|reset|<number>|<percentage>",
    "-moz-background-clip": "padding|border",
    "-moz-border-radius-bottomleft": "<'border-bottom-left-radius'>",
    "-moz-border-radius-bottomright": "<'border-bottom-right-radius'>",
    "-moz-border-radius-topleft": "<'border-top-left-radius'>",
    "-moz-border-radius-topright": "<'border-bottom-right-radius'>",
    "-moz-control-character-visibility": "visible|hidden",
    "-moz-osx-font-smoothing": "auto|grayscale",
    "-moz-user-select": "none|text|all|-moz-none",
    "-ms-flex-align": "start|end|center|baseline|stretch",
    "-ms-flex-item-align": "auto|start|end|center|baseline|stretch",
    "-ms-flex-line-pack": "start|end|center|justify|distribute|stretch",
    "-ms-flex-negative": "<'flex-shrink'>",
    "-ms-flex-pack": "start|end|center|justify|distribute",
    "-ms-flex-order": "<integer>",
    "-ms-flex-positive": "<'flex-grow'>",
    "-ms-flex-preferred-size": "<'flex-basis'>",
    "-ms-interpolation-mode": "nearest-neighbor|bicubic",
    "-ms-grid-column-align": "start|end|center|stretch",
    "-ms-grid-row-align": "start|end|center|stretch",
    "-ms-hyphenate-limit-last": "none|always|column|page|spread",
    "-webkit-background-clip": "[<box>|border|padding|content|text]#",
    "-webkit-column-break-after": "always|auto|avoid",
    "-webkit-column-break-before": "always|auto|avoid",
    "-webkit-column-break-inside": "always|auto|avoid",
    "-webkit-font-smoothing": "auto|none|antialiased|subpixel-antialiased",
    "-webkit-mask-box-image": "[<url>|<gradient>|none] [<length-percentage>{4} <-webkit-mask-box-repeat>{2}]?",
    "-webkit-print-color-adjust": "economy|exact",
    "-webkit-text-security": "none|circle|disc|square",
    "-webkit-user-drag": "none|element|auto",
    "-webkit-user-select": "auto|none|text|all",
    "alignment-baseline": "auto|baseline|before-edge|text-before-edge|middle|central|after-edge|text-after-edge|ideographic|alphabetic|hanging|mathematical",
    "baseline-shift": "baseline|sub|super|<svg-length>",
    behavior: "<url>+",
    "clip-rule": "nonzero|evenodd",
    cue: "<'cue-before'> <'cue-after'>?",
    "cue-after": "<url> <decibel>?|none",
    "cue-before": "<url> <decibel>?|none",
    "dominant-baseline": "auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge",
    fill: "<paint>",
    "fill-opacity": "<number-zero-one>",
    "fill-rule": "nonzero|evenodd",
    "glyph-orientation-horizontal": "<angle>",
    "glyph-orientation-vertical": "<angle>",
    kerning: "auto|<svg-length>",
    marker: "none|<url>",
    "marker-end": "none|<url>",
    "marker-mid": "none|<url>",
    "marker-start": "none|<url>",
    pause: "<'pause-before'> <'pause-after'>?",
    "pause-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
    "pause-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
    rest: "<'rest-before'> <'rest-after'>?",
    "rest-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
    "rest-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
    "shape-rendering": "auto|optimizeSpeed|crispEdges|geometricPrecision",
    src: "[<url> [format( <string># )]?|local( <family-name> )]#",
    speak: "auto|none|normal",
    "speak-as": "normal|spell-out||digits||[literal-punctuation|no-punctuation]",
    stroke: "<paint>",
    "stroke-dasharray": "none|[<svg-length>+]#",
    "stroke-dashoffset": "<svg-length>",
    "stroke-linecap": "butt|round|square",
    "stroke-linejoin": "miter|round|bevel",
    "stroke-miterlimit": "<number-one-or-greater>",
    "stroke-opacity": "<number-zero-one>",
    "stroke-width": "<svg-length>",
    "text-anchor": "start|middle|end",
    "unicode-range": "<urange>#",
    "voice-balance": "<number>|left|center|right|leftwards|rightwards",
    "voice-duration": "auto|<time>",
    "voice-family": "[[<family-name>|<generic-voice>] ,]* [<family-name>|<generic-voice>]|preserve",
    "voice-pitch": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
    "voice-range": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
    "voice-rate": "[normal|x-slow|slow|medium|fast|x-fast]||<percentage>",
    "voice-stress": "normal|strong|moderate|none|reduced",
    "voice-volume": "silent|[[x-soft|soft|medium|loud|x-loud]||<decibel>]"
  },
  atrules: {
    charset: {
      prelude: "<string>",
      descriptors: null
    },
    "counter-style": {
      prelude: "<counter-style-name>",
      descriptors: {
        "additive-symbols": "[<integer>&&<symbol>]#",
        fallback: "<counter-style-name>",
        negative: "<symbol> <symbol>?",
        pad: "<integer>&&<symbol>",
        prefix: "<symbol>",
        range: "[[<integer>|infinite]{2}]#|auto",
        "speak-as": "auto|bullets|numbers|words|spell-out|<counter-style-name>",
        suffix: "<symbol>",
        symbols: "<symbol>+",
        system: "cyclic|numeric|alphabetic|symbolic|additive|[fixed <integer>?]|[extends <counter-style-name>]"
      }
    },
    document: {
      prelude: "[<url>|url-prefix( <string> )|domain( <string> )|media-document( <string> )|regexp( <string> )]#",
      descriptors: null
    },
    "font-face": {
      prelude: null,
      descriptors: {
        "ascent-override": "normal|<percentage>",
        "descent-override": "normal|<percentage>",
        "font-display": "[auto|block|swap|fallback|optional]",
        "font-family": "<family-name>",
        "font-feature-settings": "normal|<feature-tag-value>#",
        "font-variation-settings": "normal|[<string> <number>]#",
        "font-stretch": "<font-stretch-absolute>{1,2}",
        "font-style": "normal|italic|oblique <angle>{0,2}",
        "font-weight": "<font-weight-absolute>{1,2}",
        "font-variant": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]",
        "line-gap-override": "normal|<percentage>",
        "size-adjust": "<percentage>",
        src: "[<url> [format( <string># )]?|local( <family-name> )]#",
        "unicode-range": "<urange>#"
      }
    },
    "font-feature-values": {
      prelude: "<family-name>#",
      descriptors: null
    },
    import: {
      prelude: "[<string>|<url>] [layer|layer( <layer-name> )]? [supports( [<supports-condition>|<declaration>] )]? <media-query-list>?",
      descriptors: null
    },
    keyframes: {
      prelude: "<keyframes-name>",
      descriptors: null
    },
    layer: {
      prelude: "[<layer-name>#|<layer-name>?]",
      descriptors: null
    },
    media: {
      prelude: "<media-query-list>",
      descriptors: null
    },
    namespace: {
      prelude: "<namespace-prefix>? [<string>|<url>]",
      descriptors: null
    },
    page: {
      prelude: "<page-selector-list>",
      descriptors: {
        bleed: "auto|<length>",
        marks: "none|[crop||cross]",
        size: "<length>{1,2}|auto|[<page-size>||[portrait|landscape]]"
      }
    },
    property: {
      prelude: "<custom-property-name>",
      descriptors: {
        syntax: "<string>",
        inherits: "true|false",
        "initial-value": "<string>"
      }
    },
    "scroll-timeline": {
      prelude: "<timeline-name>",
      descriptors: null
    },
    supports: {
      prelude: "<supports-condition>",
      descriptors: null
    },
    viewport: {
      prelude: null,
      descriptors: {
        height: "<viewport-length>{1,2}",
        "max-height": "<viewport-length>",
        "max-width": "<viewport-length>",
        "max-zoom": "auto|<number>|<percentage>",
        "min-height": "<viewport-length>",
        "min-width": "<viewport-length>",
        "min-zoom": "auto|<number>|<percentage>",
        orientation: "auto|portrait|landscape",
        "user-zoom": "zoom|fixed",
        "viewport-fit": "auto|contain|cover",
        width: "<viewport-length>{1,2}",
        zoom: "auto|<number>|<percentage>"
      }
    },
    nest: {
      prelude: "<complex-selector-list>",
      descriptors: null
    }
  }
}, he = 43, Z = 45, st = 110, Se = !0, ws = !1;
function lt(e, t) {
  let n = this.tokenStart + e;
  const r = this.charCodeAt(n);
  for ((r === he || r === Z) && (t && this.error("Number sign is not allowed"), n++); n < this.tokenEnd; n++)
    F(this.charCodeAt(n)) || this.error("Integer is expected", n);
}
function Le(e) {
  return lt.call(this, 0, e);
}
function ke(e, t) {
  if (!this.cmpChar(this.tokenStart + e, t)) {
    let n = "";
    switch (t) {
      case st:
        n = "N is expected";
        break;
      case Z:
        n = "HyphenMinus is expected";
        break;
    }
    this.error(n, this.tokenStart + e);
  }
}
function qt() {
  let e = 0, t = 0, n = this.tokenType;
  for (; n === P || n === W; )
    n = this.lookupType(++e);
  if (n !== k)
    if (this.isDelim(he, e) || this.isDelim(Z, e)) {
      t = this.isDelim(he, e) ? he : Z;
      do
        n = this.lookupType(++e);
      while (n === P || n === W);
      n !== k && (this.skip(e), Le.call(this, Se));
    } else
      return null;
  return e > 0 && this.skip(e), t === 0 && (n = this.charCodeAt(this.tokenStart), n !== he && n !== Z && this.error("Number sign is expected")), Le.call(this, t !== 0), t === Z ? "-" + this.consume(k) : this.consume(k);
}
const Ss = "AnPlusB", Cs = {
  a: [String, null],
  b: [String, null]
};
function li() {
  const e = this.tokenStart;
  let t = null, n = null;
  if (this.tokenType === k)
    Le.call(this, ws), n = this.consume(k);
  else if (this.tokenType === g && this.cmpChar(this.tokenStart, Z))
    switch (t = "-1", ke.call(this, 1, st), this.tokenEnd - this.tokenStart) {
      case 2:
        this.next(), n = qt.call(this);
        break;
      case 3:
        ke.call(this, 2, Z), this.next(), this.skipSC(), Le.call(this, Se), n = "-" + this.consume(k);
        break;
      default:
        ke.call(this, 2, Z), lt.call(this, 3, Se), this.next(), n = this.substrToCursor(e + 2);
    }
  else if (this.tokenType === g || this.isDelim(he) && this.lookupType(1) === g) {
    let r = 0;
    switch (t = "1", this.isDelim(he) && (r = 1, this.next()), ke.call(this, 0, st), this.tokenEnd - this.tokenStart) {
      case 1:
        this.next(), n = qt.call(this);
        break;
      case 2:
        ke.call(this, 1, Z), this.next(), this.skipSC(), Le.call(this, Se), n = "-" + this.consume(k);
        break;
      default:
        ke.call(this, 1, Z), lt.call(this, 2, Se), this.next(), n = this.substrToCursor(e + r + 1);
    }
  } else if (this.tokenType === w) {
    const r = this.charCodeAt(this.tokenStart), i = r === he || r === Z;
    let o = this.tokenStart + i;
    for (; o < this.tokenEnd && F(this.charCodeAt(o)); o++)
      ;
    o === this.tokenStart + i && this.error("Integer is expected", this.tokenStart + i), ke.call(this, o - this.tokenStart, st), t = this.substring(e, o), o + 1 === this.tokenEnd ? (this.next(), n = qt.call(this)) : (ke.call(this, o - this.tokenStart + 1, Z), o + 2 === this.tokenEnd ? (this.next(), this.skipSC(), Le.call(this, Se), n = "-" + this.consume(k)) : (lt.call(this, o - this.tokenStart + 2, Se), this.next(), n = this.substrToCursor(o + 1)));
  } else
    this.error();
  return t !== null && t.charCodeAt(0) === he && (t = t.substr(1)), n !== null && n.charCodeAt(0) === he && (n = n.substr(1)), {
    type: "AnPlusB",
    loc: this.getLocation(e, this.tokenStart),
    a: t,
    b: n
  };
}
function As(e) {
  if (e.a) {
    const t = e.a === "+1" && "n" || e.a === "1" && "n" || e.a === "-1" && "-n" || e.a + "n";
    if (e.b) {
      const n = e.b[0] === "-" || e.b[0] === "+" ? e.b : "+" + e.b;
      this.tokenize(t + n);
    } else
      this.tokenize(t);
  } else
    this.tokenize(e.b);
}
const Ts = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: As,
  name: Ss,
  parse: li,
  structure: Cs
}, Symbol.toStringTag, { value: "Module" }));
function dr(e) {
  return this.Raw(e, this.consumeUntilLeftCurlyBracketOrSemicolon, !0);
}
function _s() {
  for (let e = 1, t; t = this.lookupType(e); e++) {
    if (t === ne)
      return !0;
    if (t === H || t === I)
      return !1;
  }
  return !1;
}
const Os = "Atrule", $s = "atrule", Ls = {
  name: String,
  prelude: ["AtrulePrelude", "Raw", null],
  block: ["Block", null]
};
function ci(e = !1) {
  const t = this.tokenStart;
  let n, r, i = null, o = null;
  switch (this.eat(I), n = this.substrToCursor(t + 1), r = n.toLowerCase(), this.skipSC(), this.eof === !1 && this.tokenType !== H && this.tokenType !== Y && (this.parseAtrulePrelude ? i = this.parseWithFallback(this.AtrulePrelude.bind(this, n, e), dr) : i = dr.call(this, this.tokenIndex), this.skipSC()), this.tokenType) {
    case Y:
      this.next();
      break;
    case H:
      hasOwnProperty.call(this.atrule, r) && typeof this.atrule[r].block == "function" ? o = this.atrule[r].block.call(this, e) : o = this.Block(_s.call(this));
      break;
  }
  return {
    type: "Atrule",
    loc: this.getLocation(t, this.tokenStart),
    name: n,
    prelude: i,
    block: o
  };
}
function Es(e) {
  this.token(I, "@" + e.name), e.prelude !== null && this.node(e.prelude), e.block ? this.node(e.block) : this.token(Y, ";");
}
const zs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Es,
  name: Os,
  parse: ci,
  structure: Ls,
  walkContext: $s
}, Symbol.toStringTag, { value: "Module" })), Ps = "AtrulePrelude", Ms = "atrulePrelude", Is = {
  children: [[]]
};
function ui(e) {
  let t = null;
  return e !== null && (e = e.toLowerCase()), this.skipSC(), hasOwnProperty.call(this.atrule, e) && typeof this.atrule[e].prelude == "function" ? t = this.atrule[e].prelude.call(this) : t = this.readSequence(this.scope.AtrulePrelude), this.skipSC(), this.eof !== !0 && this.tokenType !== H && this.tokenType !== Y && this.error("Semicolon or block is expected"), {
    type: "AtrulePrelude",
    loc: this.getLocationFromList(t),
    children: t
  };
}
function js(e) {
  this.children(e);
}
const Ns = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: js,
  name: Ps,
  parse: ui,
  structure: Is,
  walkContext: Ms
}, Symbol.toStringTag, { value: "Module" })), Ds = 36, hi = 42, ct = 61, Rs = 94, rn = 124, Fs = 126;
function Bs() {
  this.eof && this.error("Unexpected end of input");
  const e = this.tokenStart;
  let t = !1;
  return this.isDelim(hi) ? (t = !0, this.next()) : this.isDelim(rn) || this.eat(g), this.isDelim(rn) ? this.charCodeAt(this.tokenStart + 1) !== ct ? (this.next(), this.eat(g)) : t && this.error("Identifier is expected", this.tokenEnd) : t && this.error("Vertical line is expected"), {
    type: "Identifier",
    loc: this.getLocation(e, this.tokenStart),
    name: this.substrToCursor(e)
  };
}
function Us() {
  const e = this.tokenStart, t = this.charCodeAt(e);
  return t !== ct && // =
  t !== Fs && // ~=
  t !== Rs && // ^=
  t !== Ds && // $=
  t !== hi && // *=
  t !== rn && this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected"), this.next(), t !== ct && (this.isDelim(ct) || this.error("Equal sign is expected"), this.next()), this.substrToCursor(e);
}
const qs = "AttributeSelector", Hs = {
  name: "Identifier",
  matcher: [String, null],
  value: ["String", "Identifier", null],
  flags: [String, null]
};
function pi() {
  const e = this.tokenStart;
  let t, n = null, r = null, i = null;
  return this.eat(J), this.skipSC(), t = Bs.call(this), this.skipSC(), this.tokenType !== le && (this.tokenType !== g && (n = Us.call(this), this.skipSC(), r = this.tokenType === de ? this.String() : this.Identifier(), this.skipSC()), this.tokenType === g && (i = this.consume(g), this.skipSC())), this.eat(le), {
    type: "AttributeSelector",
    loc: this.getLocation(e, this.tokenStart),
    name: t,
    matcher: n,
    value: r,
    flags: i
  };
}
function Gs(e) {
  this.token(S, "["), this.node(e.name), e.matcher !== null && (this.tokenize(e.matcher), this.node(e.value)), e.flags !== null && this.token(g, e.flags), this.token(S, "]");
}
const Ws = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Gs,
  name: qs,
  parse: pi,
  structure: Hs
}, Symbol.toStringTag, { value: "Module" })), Vs = 38;
function di(e) {
  return this.Raw(e, null, !0);
}
function fr() {
  return this.parseWithFallback(this.Rule, di);
}
function mr(e) {
  return this.Raw(e, this.consumeUntilSemicolonIncluded, !0);
}
function Ks() {
  if (this.tokenType === Y)
    return mr.call(this, this.tokenIndex);
  const e = this.parseWithFallback(this.Declaration, mr);
  return this.tokenType === Y && this.next(), e;
}
const Qs = "Block", Ys = "block", Xs = {
  children: [[
    "Atrule",
    "Rule",
    "Declaration"
  ]]
};
function fi(e) {
  const t = e ? Ks : fr, n = this.tokenStart;
  let r = this.createList();
  this.eat(H);
  e:
    for (; !this.eof; )
      switch (this.tokenType) {
        case ne:
          break e;
        case P:
        case W:
          this.next();
          break;
        case I:
          r.push(this.parseWithFallback(this.Atrule.bind(this, e), di));
          break;
        default:
          e && this.isDelim(Vs) ? r.push(fr.call(this)) : r.push(t.call(this));
      }
  return this.eof || this.eat(ne), {
    type: "Block",
    loc: this.getLocation(n, this.tokenStart),
    children: r
  };
}
function Zs(e) {
  this.token(H, "{"), this.children(e, (t) => {
    t.type === "Declaration" && this.token(Y, ";");
  }), this.token(ne, "}");
}
const Js = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Zs,
  name: Qs,
  parse: fi,
  structure: Xs,
  walkContext: Ys
}, Symbol.toStringTag, { value: "Module" })), el = "Brackets", tl = {
  children: [[]]
};
function mi(e, t) {
  const n = this.tokenStart;
  let r = null;
  return this.eat(J), r = e.call(this, t), this.eof || this.eat(le), {
    type: "Brackets",
    loc: this.getLocation(n, this.tokenStart),
    children: r
  };
}
function nl(e) {
  this.token(S, "["), this.children(e), this.token(S, "]");
}
const rl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: nl,
  name: el,
  parse: mi,
  structure: tl
}, Symbol.toStringTag, { value: "Module" })), il = "CDC", ol = [];
function gi() {
  const e = this.tokenStart;
  return this.eat(Q), {
    type: "CDC",
    loc: this.getLocation(e, this.tokenStart)
  };
}
function al() {
  this.token(Q, "-->");
}
const sl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: al,
  name: il,
  parse: gi,
  structure: ol
}, Symbol.toStringTag, { value: "Module" })), ll = "CDO", cl = [];
function bi() {
  const e = this.tokenStart;
  return this.eat(Qe), {
    type: "CDO",
    loc: this.getLocation(e, this.tokenStart)
  };
}
function ul() {
  this.token(Qe, "<!--");
}
const hl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: ul,
  name: ll,
  parse: bi,
  structure: cl
}, Symbol.toStringTag, { value: "Module" })), pl = 46, dl = "ClassSelector", fl = {
  name: String
};
function yi() {
  return this.eatDelim(pl), {
    type: "ClassSelector",
    loc: this.getLocation(this.tokenStart - 1, this.tokenEnd),
    name: this.consume(g)
  };
}
function ml(e) {
  this.token(S, "."), this.token(g, e.name);
}
const gl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: ml,
  name: dl,
  parse: yi,
  structure: fl
}, Symbol.toStringTag, { value: "Module" })), bl = 43, gr = 47, yl = 62, kl = 126, xl = "Combinator", vl = {
  name: String
};
function ki() {
  const e = this.tokenStart;
  let t;
  switch (this.tokenType) {
    case P:
      t = " ";
      break;
    case S:
      switch (this.charCodeAt(this.tokenStart)) {
        case yl:
        case bl:
        case kl:
          this.next();
          break;
        case gr:
          this.next(), this.eatIdent("deep"), this.eatDelim(gr);
          break;
        default:
          this.error("Combinator is expected");
      }
      t = this.substrToCursor(e);
      break;
  }
  return {
    type: "Combinator",
    loc: this.getLocation(e, this.tokenStart),
    name: t
  };
}
function wl(e) {
  this.tokenize(e.name);
}
const Sl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: wl,
  name: xl,
  parse: ki,
  structure: vl
}, Symbol.toStringTag, { value: "Module" })), Cl = 42, Al = 47, Tl = "Comment", _l = {
  value: String
};
function xi() {
  const e = this.tokenStart;
  let t = this.tokenEnd;
  return this.eat(W), t - e + 2 >= 2 && this.charCodeAt(t - 2) === Cl && this.charCodeAt(t - 1) === Al && (t -= 2), {
    type: "Comment",
    loc: this.getLocation(e, this.tokenStart),
    value: this.substring(e + 2, t)
  };
}
function Ol(e) {
  this.token(W, "/*" + e.value + "*/");
}
const $l = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Ol,
  name: Tl,
  parse: xi,
  structure: _l
}, Symbol.toStringTag, { value: "Module" })), vi = 33, Ll = 35, El = 36, zl = 38, Pl = 42, Ml = 43, br = 47;
function Il(e) {
  return this.Raw(e, this.consumeUntilExclamationMarkOrSemicolon, !0);
}
function jl(e) {
  return this.Raw(e, this.consumeUntilExclamationMarkOrSemicolon, !1);
}
function Nl() {
  const e = this.tokenIndex, t = this.Value();
  return t.type !== "Raw" && this.eof === !1 && this.tokenType !== Y && this.isDelim(vi) === !1 && this.isBalanceEdge(e) === !1 && this.error(), t;
}
const Dl = "Declaration", Rl = "declaration", Fl = {
  important: [Boolean, String],
  property: String,
  value: ["Value", "Raw"]
};
function wi() {
  const e = this.tokenStart, t = this.tokenIndex, n = Ul.call(this), r = yn(n), i = r ? this.parseCustomProperty : this.parseValue, o = r ? jl : Il;
  let s = !1, u;
  this.skipSC(), this.eat(q);
  const c = this.tokenIndex;
  if (r || this.skipSC(), i ? u = this.parseWithFallback(Nl, o) : u = o.call(this, this.tokenIndex), r && u.type === "Value" && u.children.isEmpty) {
    for (let a = c - this.tokenIndex; a <= 0; a++)
      if (this.lookupType(a) === P) {
        u.children.appendData({
          type: "WhiteSpace",
          loc: null,
          value: " "
        });
        break;
      }
  }
  return this.isDelim(vi) && (s = ql.call(this), this.skipSC()), this.eof === !1 && this.tokenType !== Y && this.isBalanceEdge(t) === !1 && this.error(), {
    type: "Declaration",
    loc: this.getLocation(e, this.tokenStart),
    important: s,
    property: n,
    value: u
  };
}
function Bl(e) {
  this.token(g, e.property), this.token(q, ":"), this.node(e.value), e.important && (this.token(S, "!"), this.token(g, e.important === !0 ? "important" : e.important));
}
function Ul() {
  const e = this.tokenStart;
  if (this.tokenType === S)
    switch (this.charCodeAt(this.tokenStart)) {
      case Pl:
      case El:
      case Ml:
      case Ll:
      case zl:
        this.next();
        break;
      case br:
        this.next(), this.isDelim(br) && this.next();
        break;
    }
  return this.tokenType === E ? this.eat(E) : this.eat(g), this.substrToCursor(e);
}
function ql() {
  this.eat(S), this.skipSC();
  const e = this.consume(g);
  return e === "important" ? !0 : e;
}
const Hl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Bl,
  name: Dl,
  parse: wi,
  structure: Fl,
  walkContext: Rl
}, Symbol.toStringTag, { value: "Module" })), Gl = 38;
function Ht(e) {
  return this.Raw(e, this.consumeUntilSemicolonIncluded, !0);
}
const Wl = "DeclarationList", Vl = {
  children: [[
    "Declaration",
    "Atrule",
    "Rule"
  ]]
};
function Si() {
  const e = this.createList();
  for (; !this.eof; )
    switch (this.tokenType) {
      case P:
      case W:
      case Y:
        this.next();
        break;
      case I:
        e.push(this.parseWithFallback(this.Atrule.bind(this, !0), Ht));
        break;
      default:
        this.isDelim(Gl) ? e.push(this.parseWithFallback(this.Rule, Ht)) : e.push(this.parseWithFallback(this.Declaration, Ht));
    }
  return {
    type: "DeclarationList",
    loc: this.getLocationFromList(e),
    children: e
  };
}
function Kl(e) {
  this.children(e, (t) => {
    t.type === "Declaration" && this.token(Y, ";");
  });
}
const Ql = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Kl,
  name: Wl,
  parse: Si,
  structure: Vl
}, Symbol.toStringTag, { value: "Module" })), Yl = "Dimension", Xl = {
  value: String,
  unit: String
};
function Ci() {
  const e = this.tokenStart, t = this.consumeNumber(w);
  return {
    type: "Dimension",
    loc: this.getLocation(e, this.tokenStart),
    value: t,
    unit: this.substring(e + t.length, this.tokenStart)
  };
}
function Zl(e) {
  this.token(w, e.value + e.unit);
}
const Jl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Zl,
  name: Yl,
  parse: Ci,
  structure: Xl
}, Symbol.toStringTag, { value: "Module" })), ec = "Function", tc = "function", nc = {
  name: String,
  children: [[]]
};
function Ai(e, t) {
  const n = this.tokenStart, r = this.consumeFunctionName(), i = r.toLowerCase();
  let o;
  return o = t.hasOwnProperty(i) ? t[i].call(this, t) : e.call(this, t), this.eof || this.eat(O), {
    type: "Function",
    loc: this.getLocation(n, this.tokenStart),
    name: r,
    children: o
  };
}
function rc(e) {
  this.token(C, e.name + "("), this.children(e), this.token(O, ")");
}
const ic = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: rc,
  name: ec,
  parse: Ai,
  structure: nc,
  walkContext: tc
}, Symbol.toStringTag, { value: "Module" })), oc = "XXX", ac = "Hash", sc = {
  value: String
};
function Ti() {
  const e = this.tokenStart;
  return this.eat(E), {
    type: "Hash",
    loc: this.getLocation(e, this.tokenStart),
    value: this.substrToCursor(e + 1)
  };
}
function lc(e) {
  this.token(E, "#" + e.value);
}
const cc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: lc,
  name: ac,
  parse: Ti,
  structure: sc,
  xxx: oc
}, Symbol.toStringTag, { value: "Module" })), uc = "Identifier", hc = {
  name: String
};
function _i() {
  return {
    type: "Identifier",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    name: this.consume(g)
  };
}
function pc(e) {
  this.token(g, e.name);
}
const dc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: pc,
  name: uc,
  parse: _i,
  structure: hc
}, Symbol.toStringTag, { value: "Module" })), fc = "IdSelector", mc = {
  name: String
};
function Oi() {
  const e = this.tokenStart;
  return this.eat(E), {
    type: "IdSelector",
    loc: this.getLocation(e, this.tokenStart),
    name: this.substrToCursor(e + 1)
  };
}
function gc(e) {
  this.token(S, "#" + e.name);
}
const bc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: gc,
  name: fc,
  parse: Oi,
  structure: mc
}, Symbol.toStringTag, { value: "Module" })), yc = "MediaFeature", kc = {
  name: String,
  value: ["Identifier", "Number", "Dimension", "Ratio", null]
};
function $i() {
  const e = this.tokenStart;
  let t, n = null;
  if (this.eat(N), this.skipSC(), t = this.consume(g), this.skipSC(), this.tokenType !== O) {
    switch (this.eat(q), this.skipSC(), this.tokenType) {
      case k:
        this.lookupNonWSType(1) === S ? n = this.Ratio() : n = this.Number();
        break;
      case w:
        n = this.Dimension();
        break;
      case g:
        n = this.Identifier();
        break;
      default:
        this.error("Number, dimension, ratio or identifier is expected");
    }
    this.skipSC();
  }
  return this.eat(O), {
    type: "MediaFeature",
    loc: this.getLocation(e, this.tokenStart),
    name: t,
    value: n
  };
}
function xc(e) {
  this.token(N, "("), this.token(g, e.name), e.value !== null && (this.token(q, ":"), this.node(e.value)), this.token(O, ")");
}
const vc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: xc,
  name: yc,
  parse: $i,
  structure: kc
}, Symbol.toStringTag, { value: "Module" })), wc = "MediaQuery", Sc = {
  children: [[
    "Identifier",
    "MediaFeature",
    "WhiteSpace"
  ]]
};
function Li() {
  const e = this.createList();
  let t = null;
  this.skipSC();
  e:
    for (; !this.eof; ) {
      switch (this.tokenType) {
        case W:
        case P:
          this.next();
          continue;
        case g:
          t = this.Identifier();
          break;
        case N:
          t = this.MediaFeature();
          break;
        default:
          break e;
      }
      e.push(t);
    }
  return t === null && this.error("Identifier or parenthesis is expected"), {
    type: "MediaQuery",
    loc: this.getLocationFromList(e),
    children: e
  };
}
function Cc(e) {
  this.children(e);
}
const Ac = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Cc,
  name: wc,
  parse: Li,
  structure: Sc
}, Symbol.toStringTag, { value: "Module" })), Tc = "MediaQueryList", _c = {
  children: [[
    "MediaQuery"
  ]]
};
function Ei() {
  const e = this.createList();
  for (this.skipSC(); !this.eof && (e.push(this.MediaQuery()), this.tokenType === fe); )
    this.next();
  return {
    type: "MediaQueryList",
    loc: this.getLocationFromList(e),
    children: e
  };
}
function Oc(e) {
  this.children(e, () => this.token(fe, ","));
}
const $c = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Oc,
  name: Tc,
  parse: Ei,
  structure: _c
}, Symbol.toStringTag, { value: "Module" })), Lc = 38, Ec = "NestingSelector", zc = {};
function zi() {
  const e = this.tokenStart;
  return this.eatDelim(Lc), {
    type: "NestingSelector",
    loc: this.getLocation(e, this.tokenStart)
  };
}
function Pc() {
  this.token(S, "&");
}
const Mc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Pc,
  name: Ec,
  parse: zi,
  structure: zc
}, Symbol.toStringTag, { value: "Module" })), Ic = "Nth", jc = {
  nth: ["AnPlusB", "Identifier"],
  selector: ["SelectorList", null]
};
function Pi() {
  this.skipSC();
  const e = this.tokenStart;
  let t = e, n = null, r;
  return this.lookupValue(0, "odd") || this.lookupValue(0, "even") ? r = this.Identifier() : r = this.AnPlusB(), t = this.tokenStart, this.skipSC(), this.lookupValue(0, "of") && (this.next(), n = this.SelectorList(), t = this.tokenStart), {
    type: "Nth",
    loc: this.getLocation(e, t),
    nth: r,
    selector: n
  };
}
function Nc(e) {
  this.node(e.nth), e.selector !== null && (this.token(g, "of"), this.node(e.selector));
}
const Dc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Nc,
  name: Ic,
  parse: Pi,
  structure: jc
}, Symbol.toStringTag, { value: "Module" })), Rc = "Number", Fc = {
  value: String
};
function Mi() {
  return {
    type: "Number",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consume(k)
  };
}
function Bc(e) {
  this.token(k, e.value);
}
const Uc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Bc,
  name: Rc,
  parse: Mi,
  structure: Fc
}, Symbol.toStringTag, { value: "Module" })), qc = "Operator", Hc = {
  value: String
};
function Ii() {
  const e = this.tokenStart;
  return this.next(), {
    type: "Operator",
    loc: this.getLocation(e, this.tokenStart),
    value: this.substrToCursor(e)
  };
}
function Gc(e) {
  this.tokenize(e.value);
}
const Wc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Gc,
  name: qc,
  parse: Ii,
  structure: Hc
}, Symbol.toStringTag, { value: "Module" })), Vc = "Parentheses", Kc = {
  children: [[]]
};
function ji(e, t) {
  const n = this.tokenStart;
  let r = null;
  return this.eat(N), r = e.call(this, t), this.eof || this.eat(O), {
    type: "Parentheses",
    loc: this.getLocation(n, this.tokenStart),
    children: r
  };
}
function Qc(e) {
  this.token(N, "("), this.children(e), this.token(O, ")");
}
const Yc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Qc,
  name: Vc,
  parse: ji,
  structure: Kc
}, Symbol.toStringTag, { value: "Module" })), Xc = "Percentage", Zc = {
  value: String
};
function Ni() {
  return {
    type: "Percentage",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consumeNumber(z)
  };
}
function Jc(e) {
  this.token(z, e.value + "%");
}
const eu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Jc,
  name: Xc,
  parse: Ni,
  structure: Zc
}, Symbol.toStringTag, { value: "Module" })), tu = "PseudoClassSelector", nu = "function", ru = {
  name: String,
  children: [["Raw"], null]
};
function Di() {
  const e = this.tokenStart;
  let t = null, n, r;
  return this.eat(q), this.tokenType === C ? (n = this.consumeFunctionName(), r = n.toLowerCase(), hasOwnProperty.call(this.pseudo, r) ? (this.skipSC(), t = this.pseudo[r].call(this), this.skipSC()) : (t = this.createList(), t.push(
    this.Raw(this.tokenIndex, null, !1)
  )), this.eat(O)) : n = this.consume(g), {
    type: "PseudoClassSelector",
    loc: this.getLocation(e, this.tokenStart),
    name: n,
    children: t
  };
}
function iu(e) {
  this.token(q, ":"), e.children === null ? this.token(g, e.name) : (this.token(C, e.name + "("), this.children(e), this.token(O, ")"));
}
const ou = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: iu,
  name: tu,
  parse: Di,
  structure: ru,
  walkContext: nu
}, Symbol.toStringTag, { value: "Module" })), au = "PseudoElementSelector", su = "function", lu = {
  name: String,
  children: [["Raw"], null]
};
function Ri() {
  const e = this.tokenStart;
  let t = null, n, r;
  return this.eat(q), this.eat(q), this.tokenType === C ? (n = this.consumeFunctionName(), r = n.toLowerCase(), hasOwnProperty.call(this.pseudo, r) ? (this.skipSC(), t = this.pseudo[r].call(this), this.skipSC()) : (t = this.createList(), t.push(
    this.Raw(this.tokenIndex, null, !1)
  )), this.eat(O)) : n = this.consume(g), {
    type: "PseudoElementSelector",
    loc: this.getLocation(e, this.tokenStart),
    name: n,
    children: t
  };
}
function cu(e) {
  this.token(q, ":"), this.token(q, ":"), e.children === null ? this.token(g, e.name) : (this.token(C, e.name + "("), this.children(e), this.token(O, ")"));
}
const uu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: cu,
  name: au,
  parse: Ri,
  structure: lu,
  walkContext: su
}, Symbol.toStringTag, { value: "Module" })), hu = 47, pu = 46;
function yr() {
  this.skipSC();
  const e = this.consume(k);
  for (let t = 0; t < e.length; t++) {
    const n = e.charCodeAt(t);
    !F(n) && n !== pu && this.error("Unsigned number is expected", this.tokenStart - e.length + t);
  }
  return Number(e) === 0 && this.error("Zero number is not allowed", this.tokenStart - e.length), e;
}
const du = "Ratio", fu = {
  left: String,
  right: String
};
function Fi() {
  const e = this.tokenStart, t = yr.call(this);
  let n;
  return this.skipSC(), this.eatDelim(hu), n = yr.call(this), {
    type: "Ratio",
    loc: this.getLocation(e, this.tokenStart),
    left: t,
    right: n
  };
}
function mu(e) {
  this.token(k, e.left), this.token(S, "/"), this.token(k, e.right);
}
const gu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: mu,
  name: du,
  parse: Fi,
  structure: fu
}, Symbol.toStringTag, { value: "Module" }));
function bu() {
  return this.tokenIndex > 0 && this.lookupType(-1) === P ? this.tokenIndex > 1 ? this.getTokenStart(this.tokenIndex - 1) : this.firstCharOffset : this.tokenStart;
}
const yu = "Raw", ku = {
  value: String
};
function Bi(e, t, n) {
  const r = this.getTokenStart(e);
  let i;
  return this.skipUntilBalanced(e, t || this.consumeUntilBalanceEnd), n && this.tokenStart > r ? i = bu.call(this) : i = this.tokenStart, {
    type: "Raw",
    loc: this.getLocation(r, i),
    value: this.substring(r, i)
  };
}
function xu(e) {
  this.tokenize(e.value);
}
const vu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: xu,
  name: yu,
  parse: Bi,
  structure: ku
}, Symbol.toStringTag, { value: "Module" }));
function kr(e) {
  return this.Raw(e, this.consumeUntilLeftCurlyBracket, !0);
}
function wu() {
  const e = this.SelectorList();
  return e.type !== "Raw" && this.eof === !1 && this.tokenType !== H && this.error(), e;
}
const Su = "Rule", Cu = "rule", Au = {
  prelude: ["SelectorList", "Raw"],
  block: ["Block"]
};
function Ui() {
  const e = this.tokenIndex, t = this.tokenStart;
  let n, r;
  return this.parseRulePrelude ? n = this.parseWithFallback(wu, kr) : n = kr.call(this, e), r = this.Block(!0), {
    type: "Rule",
    loc: this.getLocation(t, this.tokenStart),
    prelude: n,
    block: r
  };
}
function Tu(e) {
  this.node(e.prelude), this.node(e.block);
}
const _u = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Tu,
  name: Su,
  parse: Ui,
  structure: Au,
  walkContext: Cu
}, Symbol.toStringTag, { value: "Module" })), Ou = "Selector", $u = {
  children: [[
    "TypeSelector",
    "IdSelector",
    "ClassSelector",
    "AttributeSelector",
    "PseudoClassSelector",
    "PseudoElementSelector",
    "Combinator",
    "WhiteSpace"
  ]]
};
function qi() {
  const e = this.readSequence(this.scope.Selector);
  return this.getFirstListNode(e) === null && this.error("Selector is expected"), {
    type: "Selector",
    loc: this.getLocationFromList(e),
    children: e
  };
}
function Lu(e) {
  this.children(e);
}
const Eu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Lu,
  name: Ou,
  parse: qi,
  structure: $u
}, Symbol.toStringTag, { value: "Module" })), zu = "SelectorList", Pu = "selector", Mu = {
  children: [[
    "Selector",
    "Raw"
  ]]
};
function Hi() {
  const e = this.createList();
  for (; !this.eof; ) {
    if (e.push(this.Selector()), this.tokenType === fe) {
      this.next();
      continue;
    }
    break;
  }
  return {
    type: "SelectorList",
    loc: this.getLocationFromList(e),
    children: e
  };
}
function Iu(e) {
  this.children(e, () => this.token(fe, ","));
}
const ju = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Iu,
  name: zu,
  parse: Hi,
  structure: Mu,
  walkContext: Pu
}, Symbol.toStringTag, { value: "Module" })), on = 92, Gi = 34, Nu = 39;
function Wi(e) {
  const t = e.length, n = e.charCodeAt(0), r = n === Gi || n === Nu ? 1 : 0, i = r === 1 && t > 1 && e.charCodeAt(t - 1) === n ? t - 2 : t - 1;
  let o = "";
  for (let s = r; s <= i; s++) {
    let u = e.charCodeAt(s);
    if (u === on) {
      if (s === i) {
        s !== t - 1 && (o = e.substr(s + 1));
        break;
      }
      if (u = e.charCodeAt(++s), pe(on, u)) {
        const c = s - 1, a = Pe(e, c);
        s = a - 1, o += Lr(e.substring(c + 1, a));
      } else
        u === 13 && e.charCodeAt(s + 1) === 10 && s++;
    } else
      o += e[s];
  }
  return o;
}
function Du(e, t) {
  const n = '"', r = Gi;
  let i = "", o = !1;
  for (let s = 0; s < e.length; s++) {
    const u = e.charCodeAt(s);
    if (u === 0) {
      i += "�";
      continue;
    }
    if (u <= 31 || u === 127) {
      i += "\\" + u.toString(16), o = !0;
      continue;
    }
    u === r || u === on ? (i += "\\" + e.charAt(s), o = !1) : (o && (ve(u) || Ae(u)) && (i += " "), i += e.charAt(s), o = !1);
  }
  return n + i + n;
}
const Ru = "String", Fu = {
  value: String
};
function Vi() {
  return {
    type: "String",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: Wi(this.consume(de))
  };
}
function Bu(e) {
  this.token(de, Du(e.value));
}
const Uu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Bu,
  name: Ru,
  parse: Vi,
  structure: Fu
}, Symbol.toStringTag, { value: "Module" })), qu = 33;
function xr(e) {
  return this.Raw(e, null, !1);
}
const Hu = "StyleSheet", Gu = "stylesheet", Wu = {
  children: [[
    "Comment",
    "CDO",
    "CDC",
    "Atrule",
    "Rule",
    "Raw"
  ]]
};
function Ki() {
  const e = this.tokenStart, t = this.createList();
  let n;
  for (; !this.eof; ) {
    switch (this.tokenType) {
      case P:
        this.next();
        continue;
      case W:
        if (this.charCodeAt(this.tokenStart + 2) !== qu) {
          this.next();
          continue;
        }
        n = this.Comment();
        break;
      case Qe:
        n = this.CDO();
        break;
      case Q:
        n = this.CDC();
        break;
      case I:
        n = this.parseWithFallback(this.Atrule, xr);
        break;
      default:
        n = this.parseWithFallback(this.Rule, xr);
    }
    t.push(n);
  }
  return {
    type: "StyleSheet",
    loc: this.getLocation(e, this.tokenStart),
    children: t
  };
}
function Vu(e) {
  this.children(e);
}
const Ku = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Vu,
  name: Hu,
  parse: Ki,
  structure: Wu,
  walkContext: Gu
}, Symbol.toStringTag, { value: "Module" })), Qu = 42, vr = 124;
function Gt() {
  this.tokenType !== g && this.isDelim(Qu) === !1 && this.error("Identifier or asterisk is expected"), this.next();
}
const Yu = "TypeSelector", Xu = {
  name: String
};
function Qi() {
  const e = this.tokenStart;
  return this.isDelim(vr) ? (this.next(), Gt.call(this)) : (Gt.call(this), this.isDelim(vr) && (this.next(), Gt.call(this))), {
    type: "TypeSelector",
    loc: this.getLocation(e, this.tokenStart),
    name: this.substrToCursor(e)
  };
}
function Zu(e) {
  this.tokenize(e.name);
}
const Ju = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Zu,
  name: Yu,
  parse: Qi,
  structure: Xu
}, Symbol.toStringTag, { value: "Module" })), Yi = 43, Xi = 45, an = 63;
function qe(e, t) {
  let n = 0;
  for (let r = this.tokenStart + e; r < this.tokenEnd; r++) {
    const i = this.charCodeAt(r);
    if (i === Xi && t && n !== 0)
      return qe.call(this, e + n + 1, !1), -1;
    ve(i) || this.error(
      t && n !== 0 ? "Hyphen minus" + (n < 6 ? " or hex digit" : "") + " is expected" : n < 6 ? "Hex digit is expected" : "Unexpected input",
      r
    ), ++n > 6 && this.error("Too many hex digits", r);
  }
  return this.next(), n;
}
function rt(e) {
  let t = 0;
  for (; this.isDelim(an); )
    ++t > e && this.error("Too many question marks"), this.next();
}
function eh(e) {
  this.charCodeAt(this.tokenStart) !== e && this.error((e === Yi ? "Plus sign" : "Hyphen minus") + " is expected");
}
function th() {
  let e = 0;
  switch (this.tokenType) {
    case k:
      if (e = qe.call(this, 1, !0), this.isDelim(an)) {
        rt.call(this, 6 - e);
        break;
      }
      if (this.tokenType === w || this.tokenType === k) {
        eh.call(this, Xi), qe.call(this, 1, !1);
        break;
      }
      break;
    case w:
      e = qe.call(this, 1, !0), e > 0 && rt.call(this, 6 - e);
      break;
    default:
      if (this.eatDelim(Yi), this.tokenType === g) {
        e = qe.call(this, 0, !0), e > 0 && rt.call(this, 6 - e);
        break;
      }
      if (this.isDelim(an)) {
        this.next(), rt.call(this, 5);
        break;
      }
      this.error("Hex digit or question mark is expected");
  }
}
const nh = "UnicodeRange", rh = {
  value: String
};
function Zi() {
  const e = this.tokenStart;
  return this.eatIdent("u"), th.call(this), {
    type: "UnicodeRange",
    loc: this.getLocation(e, this.tokenStart),
    value: this.substrToCursor(e)
  };
}
function ih(e) {
  this.tokenize(e.value);
}
const oh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: ih,
  name: nh,
  parse: Zi,
  structure: rh
}, Symbol.toStringTag, { value: "Module" })), ah = 32, sn = 92, sh = 34, lh = 39, ch = 40, Ji = 41;
function uh(e) {
  const t = e.length;
  let n = 4, r = e.charCodeAt(t - 1) === Ji ? t - 2 : t - 1, i = "";
  for (; n < r && Ae(e.charCodeAt(n)); )
    n++;
  for (; n < r && Ae(e.charCodeAt(r)); )
    r--;
  for (let o = n; o <= r; o++) {
    let s = e.charCodeAt(o);
    if (s === sn) {
      if (o === r) {
        o !== t - 1 && (i = e.substr(o + 1));
        break;
      }
      if (s = e.charCodeAt(++o), pe(sn, s)) {
        const u = o - 1, c = Pe(e, u);
        o = c - 1, i += Lr(e.substring(u + 1, c));
      } else
        s === 13 && e.charCodeAt(o + 1) === 10 && o++;
    } else
      i += e[o];
  }
  return i;
}
function hh(e) {
  let t = "", n = !1;
  for (let r = 0; r < e.length; r++) {
    const i = e.charCodeAt(r);
    if (i === 0) {
      t += "�";
      continue;
    }
    if (i <= 31 || i === 127) {
      t += "\\" + i.toString(16), n = !0;
      continue;
    }
    i === ah || i === sn || i === sh || i === lh || i === ch || i === Ji ? (t += "\\" + e.charAt(r), n = !1) : (n && ve(i) && (t += " "), t += e.charAt(r), n = !1);
  }
  return "url(" + t + ")";
}
const ph = "Url", dh = {
  value: String
};
function eo() {
  const e = this.tokenStart;
  let t;
  switch (this.tokenType) {
    case U:
      t = uh(this.consume(U));
      break;
    case C:
      this.cmpStr(this.tokenStart, this.tokenEnd, "url(") || this.error("Function name must be `url`"), this.eat(C), this.skipSC(), t = Wi(this.consume(de)), this.skipSC(), this.eof || this.eat(O);
      break;
    default:
      this.error("Url or Function is expected");
  }
  return {
    type: "Url",
    loc: this.getLocation(e, this.tokenStart),
    value: t
  };
}
function fh(e) {
  this.token(U, hh(e.value));
}
const mh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: fh,
  name: ph,
  parse: eo,
  structure: dh
}, Symbol.toStringTag, { value: "Module" })), gh = "Value", bh = {
  children: [[]]
};
function to() {
  const e = this.tokenStart, t = this.readSequence(this.scope.Value);
  return {
    type: "Value",
    loc: this.getLocation(e, this.tokenStart),
    children: t
  };
}
function yh(e) {
  this.children(e);
}
const kh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: yh,
  name: gh,
  parse: to,
  structure: bh
}, Symbol.toStringTag, { value: "Module" })), xh = Object.freeze({
  type: "WhiteSpace",
  loc: null,
  value: " "
}), vh = "WhiteSpace", wh = {
  value: String
};
function no() {
  return this.eat(P), xh;
}
function Sh(e) {
  this.token(P, e.value);
}
const Ch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  generate: Sh,
  name: vh,
  parse: no,
  structure: wh
}, Symbol.toStringTag, { value: "Module" })), ro = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnPlusB: Ts,
  Atrule: zs,
  AtrulePrelude: Ns,
  AttributeSelector: Ws,
  Block: Js,
  Brackets: rl,
  CDC: sl,
  CDO: hl,
  ClassSelector: gl,
  Combinator: Sl,
  Comment: $l,
  Declaration: Hl,
  DeclarationList: Ql,
  Dimension: Jl,
  Function: ic,
  Hash: cc,
  IdSelector: bc,
  Identifier: dc,
  MediaFeature: vc,
  MediaQuery: Ac,
  MediaQueryList: $c,
  NestingSelector: Mc,
  Nth: Dc,
  Number: Uc,
  Operator: Wc,
  Parentheses: Yc,
  Percentage: eu,
  PseudoClassSelector: ou,
  PseudoElementSelector: uu,
  Ratio: gu,
  Raw: vu,
  Rule: _u,
  Selector: Eu,
  SelectorList: ju,
  String: Uu,
  StyleSheet: Ku,
  TypeSelector: Ju,
  UnicodeRange: oh,
  Url: mh,
  Value: kh,
  WhiteSpace: Ch
}, Symbol.toStringTag, { value: "Module" })), Ah = {
  generic: !0,
  ...vs,
  node: ro
}, Th = 35, _h = 42, wr = 43, Oh = 45, $h = 47, Lh = 117;
function io(e) {
  switch (this.tokenType) {
    case E:
      return this.Hash();
    case fe:
      return this.Operator();
    case N:
      return this.Parentheses(this.readSequence, e.recognizer);
    case J:
      return this.Brackets(this.readSequence, e.recognizer);
    case de:
      return this.String();
    case w:
      return this.Dimension();
    case z:
      return this.Percentage();
    case k:
      return this.Number();
    case C:
      return this.cmpStr(this.tokenStart, this.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, e.recognizer);
    case U:
      return this.Url();
    case g:
      return this.cmpChar(this.tokenStart, Lh) && this.cmpChar(this.tokenStart + 1, wr) ? this.UnicodeRange() : this.Identifier();
    case S: {
      const t = this.charCodeAt(this.tokenStart);
      if (t === $h || t === _h || t === wr || t === Oh)
        return this.Operator();
      t === Th && this.error("Hex or identifier is expected", this.tokenStart + 1);
      break;
    }
  }
}
const Eh = {
  getNode: io
}, zh = 35, Ph = 38, Mh = 42, Ih = 43, jh = 47, Sr = 46, Nh = 62, Dh = 124, Rh = 126;
function Fh(e, t) {
  t.last !== null && t.last.type !== "Combinator" && e !== null && e.type !== "Combinator" && t.push({
    // FIXME: this.Combinator() should be used instead
    type: "Combinator",
    loc: null,
    name: " "
  });
}
function Bh() {
  switch (this.tokenType) {
    case J:
      return this.AttributeSelector();
    case E:
      return this.IdSelector();
    case q:
      return this.lookupType(1) === q ? this.PseudoElementSelector() : this.PseudoClassSelector();
    case g:
      return this.TypeSelector();
    case k:
    case z:
      return this.Percentage();
    case w:
      this.charCodeAt(this.tokenStart) === Sr && this.error("Identifier is expected", this.tokenStart + 1);
      break;
    case S: {
      switch (this.charCodeAt(this.tokenStart)) {
        case Ih:
        case Nh:
        case Rh:
        case jh:
          return this.Combinator();
        case Sr:
          return this.ClassSelector();
        case Mh:
        case Dh:
          return this.TypeSelector();
        case zh:
          return this.IdSelector();
        case Ph:
          return this.NestingSelector();
      }
      break;
    }
  }
}
const Uh = {
  onWhiteSpace: Fh,
  getNode: Bh
};
function qh() {
  return this.createSingleNodeList(
    this.Raw(this.tokenIndex, null, !1)
  );
}
function Hh() {
  const e = this.createList();
  if (this.skipSC(), e.push(this.Identifier()), this.skipSC(), this.tokenType === fe) {
    e.push(this.Operator());
    const t = this.tokenIndex, n = this.parseCustomProperty ? this.Value(null) : this.Raw(this.tokenIndex, this.consumeUntilExclamationMarkOrSemicolon, !1);
    if (n.type === "Value" && n.children.isEmpty) {
      for (let r = t - this.tokenIndex; r <= 0; r++)
        if (this.lookupType(r) === P) {
          n.children.appendData({
            type: "WhiteSpace",
            loc: null,
            value: " "
          });
          break;
        }
    }
    e.push(n);
  }
  return e;
}
function Cr(e) {
  return e !== null && e.type === "Operator" && (e.value[e.value.length - 1] === "-" || e.value[e.value.length - 1] === "+");
}
const Gh = {
  getNode: io,
  onWhiteSpace(e, t) {
    Cr(e) && (e.value = " " + e.value), Cr(t.last) && (t.last.value += " ");
  },
  expression: qh,
  var: Hh
}, Wh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AtrulePrelude: Eh,
  Selector: Uh,
  Value: Gh
}, Symbol.toStringTag, { value: "Module" })), Vh = {
  parse: {
    prelude: null,
    block() {
      return this.Block(!0);
    }
  }
}, Kh = {
  parse: {
    prelude() {
      const e = this.createList();
      switch (this.skipSC(), this.tokenType) {
        case de:
          e.push(this.String());
          break;
        case U:
        case C:
          e.push(this.Url());
          break;
        default:
          this.error("String or url() is expected");
      }
      return (this.lookupNonWSType(0) === g || this.lookupNonWSType(0) === N) && e.push(this.MediaQueryList()), e;
    },
    block: null
  }
}, Qh = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.MediaQueryList()
      );
    },
    block(e = !1) {
      return this.Block(e);
    }
  }
}, Yh = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.SelectorList()
      );
    },
    block() {
      return this.Block(!0);
    }
  }
}, Xh = {
  parse: {
    prelude() {
      return this.createSingleNodeList(
        this.SelectorList()
      );
    },
    block() {
      return this.Block(!0);
    }
  }
};
function Zh() {
  return this.createSingleNodeList(
    this.Raw(this.tokenIndex, null, !1)
  );
}
function Jh() {
  return this.skipSC(), this.tokenType === g && this.lookupNonWSType(1) === q ? this.createSingleNodeList(
    this.Declaration()
  ) : oo.call(this);
}
function oo() {
  const e = this.createList();
  let t;
  this.skipSC();
  e:
    for (; !this.eof; ) {
      switch (this.tokenType) {
        case W:
        case P:
          this.next();
          continue;
        case C:
          t = this.Function(Zh, this.scope.AtrulePrelude);
          break;
        case g:
          t = this.Identifier();
          break;
        case N:
          t = this.Parentheses(Jh, this.scope.AtrulePrelude);
          break;
        default:
          break e;
      }
      e.push(t);
    }
  return e;
}
const ep = {
  parse: {
    prelude() {
      const e = oo.call(this);
      return this.getFirstListNode(e) === null && this.error("Condition is expected"), e;
    },
    block(e = !1) {
      return this.Block(e);
    }
  }
}, tp = {
  "font-face": Vh,
  import: Kh,
  media: Qh,
  nest: Yh,
  page: Xh,
  supports: ep
}, we = {
  parse() {
    return this.createSingleNodeList(
      this.SelectorList()
    );
  }
}, Wt = {
  parse() {
    return this.createSingleNodeList(
      this.Selector()
    );
  }
}, Ar = {
  parse() {
    return this.createSingleNodeList(
      this.Identifier()
    );
  }
}, it = {
  parse() {
    return this.createSingleNodeList(
      this.Nth()
    );
  }
}, np = {
  dir: Ar,
  has: we,
  lang: Ar,
  matches: we,
  is: we,
  "-moz-any": we,
  "-webkit-any": we,
  where: we,
  not: we,
  "nth-child": it,
  "nth-last-child": it,
  "nth-last-of-type": it,
  "nth-of-type": it,
  slotted: Wt,
  host: Wt,
  "host-context": Wt
}, rp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AnPlusB: li,
  Atrule: ci,
  AtrulePrelude: ui,
  AttributeSelector: pi,
  Block: fi,
  Brackets: mi,
  CDC: gi,
  CDO: bi,
  ClassSelector: yi,
  Combinator: ki,
  Comment: xi,
  Declaration: wi,
  DeclarationList: Si,
  Dimension: Ci,
  Function: Ai,
  Hash: Ti,
  IdSelector: Oi,
  Identifier: _i,
  MediaFeature: $i,
  MediaQuery: Li,
  MediaQueryList: Ei,
  NestingSelector: zi,
  Nth: Pi,
  Number: Mi,
  Operator: Ii,
  Parentheses: ji,
  Percentage: Ni,
  PseudoClassSelector: Di,
  PseudoElementSelector: Ri,
  Ratio: Fi,
  Raw: Bi,
  Rule: Ui,
  Selector: qi,
  SelectorList: Hi,
  String: Vi,
  StyleSheet: Ki,
  TypeSelector: Qi,
  UnicodeRange: Zi,
  Url: eo,
  Value: to,
  WhiteSpace: no
}, Symbol.toStringTag, { value: "Module" })), ip = {
  parseContext: {
    default: "StyleSheet",
    stylesheet: "StyleSheet",
    atrule: "Atrule",
    atrulePrelude(e) {
      return this.AtrulePrelude(e.atrule ? String(e.atrule) : null);
    },
    mediaQueryList: "MediaQueryList",
    mediaQuery: "MediaQuery",
    rule: "Rule",
    selectorList: "SelectorList",
    selector: "Selector",
    block() {
      return this.Block(!0);
    },
    declarationList: "DeclarationList",
    declaration: "Declaration",
    value: "Value"
  },
  scope: Wh,
  atrule: tp,
  pseudo: np,
  node: rp
}, op = {
  node: ro
}, ap = xs({
  ...Ah,
  ...ip,
  ...op
}), {
  tokenize: pp,
  parse: sp,
  generate: lp,
  lexer: dp,
  createLexer: fp,
  walk: mp,
  find: gp,
  findLast: bp,
  findAll: yp,
  toPlainObject: kp,
  fromPlainObject: xp,
  fork: vp
} = ap, { hyphenate: cp } = ao, wp = (e) => {
  const t = sp(e), n = {};
  return t.children.filter(({ type: r }) => r === "Rule").forEach((r) => {
    const i = lp(r).match(/^(.+){(.+)}$/);
    if (!i)
      return;
    const [o, s, u] = i;
    n[s] = u;
  }), n;
}, up = (e = "") => `:root { ${e}
}`, Sp = (e = {}, t = !0) => {
  const n = Object.entries(e).map(([r, i]) => i ? `${cp(r)}: ${i};` : "");
  return t ? up(n.join(`
  `)) : ` { 
 ${n.join(`
  `)} 
}`;
};
export {
  wp as getCssObjectFromStyleStr,
  Sp as obj2StyleStr,
  up as styleStrAddRoot
};
//# sourceMappingURL=css.js.map
