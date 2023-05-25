var W = Object.defineProperty;
var Z = (t, e, n) => e in t ? W(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var w = (t, e, n) => (Z(t, typeof e != "symbol" ? e + "" : e, n), n);
import { defineComponent as z, getCurrentInstance as G, toRefs as J, ref as Q, watch as X, useAttrs as Y, computed as ee, resolveDirective as te, withDirectives as ne, openBlock as ie, createElementBlock as re, mergeProps as ae, unref as h } from "vue";
const l = {
  debug: !1,
  masked: !1,
  prefix: "",
  suffix: "",
  thousands: ",",
  decimal: ".",
  precision: 2,
  disableNegative: !1,
  disabled: !1,
  min: null,
  max: null,
  allowBlank: !1,
  minimumNumberOfCharacters: 0,
  modelModifiers: {
    number: !1
  },
  shouldRound: !0,
  focusOnRight: !1
}, M = ["+", "-"], V = ["decimal", "thousands", "prefix", "suffix"];
function f(t) {
  return Math.max(0, Math.min(t, 1e3));
}
function N(t, e) {
  return t = t.padStart(e + 1, "0"), e === 0 ? t : `${t.slice(0, -e)}.${t.slice(-e)}`;
}
function F(t) {
  return t = t ? t.toString() : "", t.replace(/\D+/g, "") || "0";
}
function se(t, e) {
  return t.replace(/(\d)(?=(?:\d{3})+\b)/gm, `$1${e}`);
}
function ue(t, e, n) {
  return e ? t + n + e : t;
}
function b(t, e) {
  return M.includes(t) ? (console.warn(`v-money3 "${e}" property don't accept "${t}" as a value.`), !1) : /\d/g.test(t) ? (console.warn(`v-money3 "${e}" property don't accept "${t}" (any number) as a value.`), !1) : !0;
}
function le(t) {
  for (const e of V)
    if (!b(t[e], e))
      return !1;
  return !0;
}
function x(t) {
  for (const e of V) {
    t[e] = t[e].replace(/\d+/g, "");
    for (const n of M)
      t[e] = t[e].replaceAll(n, "");
  }
  return t;
}
function I(t) {
  const e = t.length, n = t.indexOf(".");
  return e - (n + 1);
}
function C(t) {
  return t.replace(/^(-?)0+(?!\.)(.+)/, "$1$2");
}
function A(t) {
  return /^-?[\d]+$/g.test(t);
}
function D(t) {
  return /^-?[\d]+(\.[\d]+)$/g.test(t);
}
function O(t, e, n) {
  return e > t.length - 1 ? t : t.substring(0, e) + n + t.substring(e + 1);
}
function P(t, e) {
  const n = e - I(t);
  if (n >= 0)
    return t;
  let i = t.slice(0, n);
  const a = t.slice(n);
  if (i.charAt(i.length - 1) === "." && (i = i.slice(0, -1)), parseInt(a.charAt(0), 10) >= 5) {
    for (let s = i.length - 1; s >= 0; s -= 1) {
      const u = i.charAt(s);
      if (u !== "." && u !== "-") {
        const c = parseInt(u, 10) + 1;
        if (c < 10)
          return O(i, s, c);
        i = O(i, s, "0");
      }
    }
    return `1${i}`;
  }
  return i;
}
function _(t, e) {
  const n = () => {
    t.setSelectionRange(e, e);
  };
  t === document.activeElement && (n(), setTimeout(n, 1));
}
function j(t) {
  return new Event(t, { bubbles: !0, cancelable: !1 });
}
function r({ debug: t = !1 }, ...e) {
  t && console.log(...e);
}
class p {
  constructor(e) {
    w(this, "number", 0n);
    w(this, "decimal", 0);
    this.setNumber(e);
  }
  getNumber() {
    return this.number;
  }
  getDecimalPrecision() {
    return this.decimal;
  }
  setNumber(e) {
    this.decimal = 0, typeof e == "bigint" ? this.number = e : typeof e == "number" ? this.setupString(e.toString()) : this.setupString(e);
  }
  toFixed(e = 0, n = !0) {
    let i = this.toString();
    const a = e - this.getDecimalPrecision();
    return a > 0 ? (i.includes(".") || (i += "."), i.padEnd(i.length + a, "0")) : a < 0 ? n ? P(i, e) : i.slice(0, a) : i;
  }
  toString() {
    let e = this.number.toString();
    if (this.decimal) {
      let n = !1;
      return e.charAt(0) === "-" && (e = e.substring(1), n = !0), e = e.padStart(e.length + this.decimal, "0"), e = `${e.slice(0, -this.decimal)}.${e.slice(-this.decimal)}`, e = C(e), (n ? "-" : "") + e;
    }
    return e;
  }
  lessThan(e) {
    const [n, i] = this.adjustComparisonNumbers(e);
    return n < i;
  }
  biggerThan(e) {
    const [n, i] = this.adjustComparisonNumbers(e);
    return n > i;
  }
  isEqual(e) {
    const [n, i] = this.adjustComparisonNumbers(e);
    return n === i;
  }
  setupString(e) {
    if (e = C(e), A(e))
      this.number = BigInt(e);
    else if (D(e))
      this.decimal = I(e), this.number = BigInt(e.replace(".", ""));
    else
      throw new Error(`BigNumber has received and invalid format for the constructor: ${e}`);
  }
  adjustComparisonNumbers(e) {
    let n;
    e.constructor.name !== "BigNumber" ? n = new p(e) : n = e;
    const i = this.getDecimalPrecision() - n.getDecimalPrecision();
    let a = this.getNumber(), s = n.getNumber();
    return i > 0 ? s = n.getNumber() * 10n ** BigInt(i) : i < 0 && (a = this.getNumber() * 10n ** BigInt(i * -1)), [a, s];
  }
}
function k(t, e = l, n = "") {
  if (r(e, "utils format() - caller", n), r(e, "utils format() - input1", t), t == null)
    t = "";
  else if (typeof t == "number")
    e.shouldRound ? t = t.toFixed(f(e.precision)) : t = t.toFixed(f(e.precision) + 1).slice(0, -1);
  else if (e.modelModifiers && e.modelModifiers.number && A(t))
    t = Number(t).toFixed(f(e.precision));
  else if (!e.disableNegative && t === "-")
    return t;
  r(e, "utils format() - input2", t);
  const i = e.disableNegative ? "" : t.indexOf("-") >= 0 ? "-" : "";
  let a = t.replace(e.prefix, "").replace(e.suffix, "");
  r(e, "utils format() - filtered", a), !e.precision && e.thousands !== "." && D(a) && (a = P(a, 0), r(e, "utils format() - !opt.precision && isValidFloat()", a));
  const s = F(a);
  r(e, "utils format() - numbers", s), r(e, "utils format() - numbersToCurrency", i + N(s, e.precision));
  const u = new p(i + N(s, e.precision));
  r(e, "utils format() - bigNumber1", u.toString()), e.max && u.biggerThan(e.max) && u.setNumber(e.max), e.min && u.lessThan(e.min) && u.setNumber(e.min);
  const c = u.toFixed(f(e.precision), e.shouldRound);
  if (r(e, "utils format() - bigNumber2", u.toFixed(f(e.precision))), /^0(\.0+)?$/g.test(c) && e.allowBlank)
    return "";
  let [g, m] = c.split(".");
  const v = m !== void 0 ? m.length : 0;
  g = g.padStart(e.minimumNumberOfCharacters - v, "0"), g = se(g, e.thousands);
  const y = e.prefix + ue(g, m, e.decimal) + e.suffix;
  return r(e, "utils format() - output", y), y;
}
function S(t, e = l, n = "") {
  if (r(e, "utils unformat() - caller", n), r(e, "utils unformat() - input", t), !e.disableNegative && t === "-")
    return r(e, "utils unformat() - return netagive symbol", t), t;
  const i = e.disableNegative ? "" : t.indexOf("-") >= 0 ? "-" : "", a = t.replace(e.prefix, "").replace(e.suffix, "");
  r(e, "utils unformat() - filtered", a);
  const s = F(a);
  r(e, "utils unformat() - numbers", s);
  const u = new p(i + N(s, e.precision));
  r(e, "utils unformat() - bigNumber1", s.toString()), e.max && u.biggerThan(e.max) && u.setNumber(e.max), e.min && u.lessThan(e.min) && u.setNumber(e.min);
  let c = u.toFixed(f(e.precision), e.shouldRound);
  return e.modelModifiers && e.modelModifiers.number && (c = parseFloat(c)), r(e, "utils unformat() - output", c), c;
}
const R = (t, e, n) => {
  if (r(e, "directive setValue() - caller", n), !le(e)) {
    r(e, "directive setValue() - validateRestrictedOptions() return false. Stopping here...", t.value);
    return;
  }
  let i = t.value.length - (t.selectionEnd || 0);
  t.value = k(t.value, e, n), i = Math.max(i, e.suffix.length), i = t.value.length - i, i = Math.max(i, e.prefix.length), _(t, i), t.dispatchEvent(j("change"));
}, T = (t, e) => {
  const n = t.currentTarget, i = t.code === "Backspace" || t.code === "Delete", a = n.value.length - (n.selectionEnd || 0) === 0;
  if (r(e, "directive onkeydown() - el.value", n.value), r(e, "directive onkeydown() - backspacePressed", i), r(e, "directive onkeydown() - isAtEndPosition", a), e.allowBlank && i && a && S(n.value, e, "directive onkeydown allowBlank") === 0 && (r(e, 'directive onkeydown() - set el.value = ""', n.value), n.value = "", n.dispatchEvent(j("change"))), r(e, "directive onkeydown() - e.key", t.key), t.key === "+") {
    r(e, "directive onkeydown() - unformat el.value", n.value);
    let s = S(n.value, e, "directive onkeydown +");
    typeof s == "string" && (s = parseFloat(s)), s < 0 && (n.value = String(s * -1));
  }
}, $ = (t, e) => {
  const n = t.currentTarget;
  r(e, "directive oninput()", n.value), /^[1-9]$/.test(n.value) && (n.value = N(n.value, f(e.precision)), r(e, "directive oninput() - is 1-9", n.value)), R(n, e, "directive oninput");
}, E = (t, e) => {
  const n = t.currentTarget;
  r(e, "directive onFocus()", n.value), e.focusOnRight && _(n, n.value.length - e.suffix.length);
}, q = {
  mounted(t, e) {
    if (!e.value)
      return;
    const n = x({ ...l, ...e.value });
    if (r(n, "directive mounted() - opt", n), t.tagName.toLocaleUpperCase() !== "INPUT") {
      const i = t.getElementsByTagName("input");
      i.length !== 1 || (t = i[0]);
    }
    t.onkeydown = (i) => {
      T(i, n);
    }, t.oninput = (i) => {
      $(i, n);
    }, t.onfocus = (i) => {
      E(i, n);
    }, r(n, "directive mounted() - el.value", t.value), R(t, n, "directive mounted");
  },
  updated(t, e) {
    if (!e.value)
      return;
    const n = x({ ...l, ...e.value });
    t.onkeydown = (i) => {
      T(i, n);
    }, t.oninput = (i) => {
      $(i, n);
    }, t.onfocus = (i) => {
      E(i, n);
    }, r(n, "directive updated() - el.value", t.value), r(n, "directive updated() - opt", n), R(t, n, "directive updated");
  },
  beforeUnmount(t) {
    t.onkeydown = null, t.oninput = null, t.onfocus = null;
  }
}, oe = ["id", "value", "disabled"], ce = {
  inheritAttrs: !1,
  name: "Money3",
  directives: {
    money3: q
  }
}, de = /* @__PURE__ */ z({
  ...ce,
  props: {
    debug: {
      required: !1,
      type: Boolean,
      default: !1
    },
    id: {
      required: !1,
      type: [Number, String],
      default: () => {
        const t = G();
        return t ? t.uid : null;
      }
    },
    modelValue: {
      required: !0,
      type: [Number, String]
    },
    modelModifiers: {
      required: !1,
      type: Object,
      default: () => ({ number: !1 })
    },
    masked: {
      type: Boolean,
      default: !1
    },
    precision: {
      type: Number,
      default: () => l.precision
    },
    decimal: {
      type: String,
      default: () => l.decimal,
      validator(t) {
        return b(t, "decimal");
      }
    },
    thousands: {
      type: String,
      default: () => l.thousands,
      validator(t) {
        return b(t, "thousands");
      }
    },
    prefix: {
      type: String,
      default: () => l.prefix,
      validator(t) {
        return b(t, "prefix");
      }
    },
    suffix: {
      type: String,
      default: () => l.suffix,
      validator(t) {
        return b(t, "suffix");
      }
    },
    disableNegative: {
      type: Boolean,
      default: !1
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    max: {
      type: [Number, String],
      default: () => l.max
    },
    min: {
      type: [Number, String],
      default: () => l.min
    },
    allowBlank: {
      type: Boolean,
      default: () => l.allowBlank
    },
    minimumNumberOfCharacters: {
      type: Number,
      default: () => l.minimumNumberOfCharacters
    },
    shouldRound: {
      type: Boolean,
      default: () => l.shouldRound
    },
    focusOnRight: {
      type: Boolean,
      default: () => l.focusOnRight
    }
  },
  emits: ["update:model-value"],
  setup(t, { emit: e }) {
    const n = t, { modelValue: i, modelModifiers: a, masked: s, precision: u, shouldRound: c, focusOnRight: g } = J(n);
    r(n, "component setup()", n);
    let m = i.value;
    (n.disableNegative || m !== "-") && a.value && a.value.number && (c.value ? m = Number(i.value).toFixed(f(u.value)) : m = Number(i.value).toFixed(f(u.value) + 1).slice(0, -1));
    const v = Q(k(m, n, "component setup"));
    r(n, "component setup() - data.formattedValue", v.value), X(i, y);
    function y(d) {
      r(n, "component watch() -> value", d);
      const o = k(
        d,
        x({ ...n }),
        "component watch"
      );
      o !== v.value && (r(n, "component watch() changed -> formatted", o), v.value = o);
    }
    let B = null;
    function U(d) {
      let o = d.target.value;
      r(n, "component change() -> evt.target.value", o), s.value && !a.value.number || (o = S(
        o,
        x({ ...n }),
        "component change"
      )), o !== B && (B = o, r(n, "component change() -> update:model-value", o), e("update:model-value", o));
    }
    const L = Y(), H = ee(() => {
      const d = {
        ...L
      };
      return delete d["onUpdate:modelValue"], d;
    });
    return (d, o) => {
      const K = te("money3");
      return ne((ie(), re("input", ae({
        id: `${t.id}`
      }, h(H), {
        ref: "input",
        type: "tel",
        class: "v-money3",
        value: v.value,
        disabled: n.disabled,
        onChange: U,
        onEnter: o[0] || (o[0] = (fe) => d.$emit("enter"))
      }), null, 16, oe)), [
        [K, {
          precision: h(u),
          decimal: n.decimal,
          thousands: n.thousands,
          prefix: n.prefix,
          suffix: n.suffix,
          disableNegative: n.disableNegative,
          min: n.min,
          max: n.max,
          allowBlank: n.allowBlank,
          minimumNumberOfCharacters: n.minimumNumberOfCharacters,
          debug: n.debug,
          modelModifiers: h(a),
          shouldRound: h(c),
          focusOnRight: h(g)
        }]
      ]);
    };
  }
}), ve = {
  install(t) {
    t.component("money3", de), t.directive("money3", q);
  }
};
export {
  p as BigNumber,
  de as Money,
  de as Money3,
  de as Money3Component,
  q as Money3Directive,
  q as VMoney,
  q as VMoney3,
  ve as default,
  k as format,
  S as unformat
};
