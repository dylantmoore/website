import { C as prefersReducedMotion, D as FilmFigure, I as term$1, N as derive, O as createTimeline, P as equation, S as drawTraces, W as defineDerivation, _ as Link, ct as InlineMath, j as markRouteEntry, lt as SvgMathLabel, st as BlockMath$1, v as chainDerivations, x as ballTrace, y as stackBalls } from "./core.js";
import { C as FIGURE_MODEL, S as CH1_DEFAULTS, _ as RED_OPACITY, a as cdfFilm, b as morphPopulation, c as stroke$1, d as WIDE, f as shareY, g as loadBaseline, h as VIEWBOX$3, i as Overlay$3, l as CDF_LOG_DOMAIN, m as TIMELINE$3, n as C$2, o as dot$1, p as STEP_INDEX$3, r as Label$5, s as draw$2, u as GUIDE_LABELS, v as baselinePeople, x as CDF_PLOT, y as decliningLaw } from "./chapter-1.js";
import { Fragment, createElement, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "https://cdn.jsdelivr.net/npm/react@19.2.6/+esm";
import { Fragment as Fragment$1, jsx, jsxs } from "https://cdn.jsdelivr.net/npm/react@19.2.6/jsx-runtime/+esm";
var positive = (x2, name) => {
  if (!(x2 > 0) || !Number.isFinite(x2)) throw new RangeError(`${name} must be finite and positive`);
};
function data(d2) {
  const B2 = d2.top - d2.bottom;
  positive(B2, "bunching mass");
  positive(d2.leftDensity, "left density");
  positive(d2.rightDensity, "right density");
  if (!(d2.bottom > 0 && d2.top < 1)) throw new RangeError("Jump heights must be interior probabilities");
  return {
    B: B2,
    h0: d2.leftDensity,
    h1: d2.rightDensity
  };
}
function economy(law, e2, design) {
  positive(e2, "elasticity");
  positive(design.tau0 - design.tau1, "log rate gap");
  const { threshold: a2, tau0: tau02, tau1: tau12 } = design;
  const H02 = (x2) => law.cdf(x2 - e2 * tau02);
  const H12 = (x2) => law.cdf(x2 - e2 * tau12);
  const h02 = (x2) => law.pdf(x2 - e2 * tau02);
  const h12 = (x2) => law.pdf(x2 - e2 * tau12);
  const observed2 = {
    ...design,
    bottom: H02(a2),
    top: H12(a2),
    leftDensity: h02(a2),
    rightDensity: h12(a2),
    cdf: (x2) => x2 < a2 ? H02(x2) : H12(x2),
    density: (x2) => x2 < a2 ? h02(x2) : h12(x2)
  };
  data(observed2);
  return {
    e: e2,
    delta: e2 * (tau02 - tau12),
    H0: H02,
    H1: H12,
    h0: h02,
    h1: h12,
    observed: observed2
  };
}
function pointRules(d2) {
  const { B: B2, h0: h02, h1: h12 } = data(d2);
  const q = h02 + h12 - 2 * B2;
  const root = Math.hypot(q, Math.sqrt(8 * h02 * B2));
  const excess = q >= 0 ? 4 * B2 / (q + root) : (root - q) / (2 * h02);
  return {
    left: B2 / h02,
    right: B2 / h12,
    logTrapezoid: 2 * B2 / (h02 + h12),
    saezLevels: Math.log1p(excess)
  };
}
function monotoneBounds(d2) {
  const { B: B2, h0: h02, h1: h12 } = data(d2);
  return {
    empty: false,
    lower: B2 / Math.max(h02, h12),
    upper: B2 / Math.min(h02, h12)
  };
}
function lipschitzBounds(d2, M2) {
  const { B: B2, h0: h02, h1: h12 } = data(d2);
  if (M2 < 0 || !Number.isFinite(M2)) throw new RangeError("Slope cap must be finite and nonnegative");
  if (M2 === 0) return h02 === h12 ? {
    empty: false,
    lower: B2 / h02,
    upper: B2 / h02
  } : {
    empty: true,
    lower: NaN,
    upper: NaN
  };
  if (B2 < Math.abs(h12 * h12 - h02 * h02) / (2 * M2) - 1e-14) return {
    empty: true,
    lower: NaN,
    upper: NaN
  };
  const S = (h02 * h02 + h12 * h12) / 2;
  return {
    empty: false,
    lower: ((h02 - h12) ** 2 / M2 + 4 * B2) / (2 * Math.sqrt(S + M2 * B2) + h02 + h12),
    upper: B2 >= S / M2 ? Infinity : (4 * B2 - (h02 - h12) ** 2 / M2) / (h02 + h12 + 2 * Math.sqrt(S - M2 * B2))
  };
}
function logRemainderRatio(r3) {
  if (Math.abs(r3) >= 1e-3) return ((1 + r3) * Math.log1p(r3) - r3) / r3;
  let sum = 0;
  for (let n = 2; n <= 10; n++) sum += (n % 2 ? -1 : 1) * r3 ** (n - 1) / (n * (n - 1));
  return sum;
}
function goffBounds(d2) {
  const { B: B2, h0: h02, h1: h12 } = data(d2);
  const g = (A2, h, mass2) => A2 / h * logRemainderRatio(mass2 / A2);
  return {
    empty: false,
    lower: g(d2.bottom, h02, B2) + g(1 - d2.top, h12, B2),
    upper: -g(1 - d2.bottom, h02, -B2) - g(d2.top, h12, -B2)
  };
}
function goffEnvelopes(d2, distance) {
  data(d2);
  return {
    lowerFromLeft: 1 - (1 - d2.bottom) * Math.exp(-d2.leftDensity * distance / (1 - d2.bottom)),
    upperFromLeft: d2.bottom * Math.exp(d2.leftDensity * distance / d2.bottom),
    upperFromRight: d2.top * Math.exp(-d2.rightDensity * distance / d2.top),
    lowerFromRight: 1 - (1 - d2.top) * Math.exp(d2.rightDensity * distance / (1 - d2.top))
  };
}
function logTrapezoid(d2) {
  const { h0: h02, h1: h12 } = data(d2), delta = pointRules(d2).logTrapezoid;
  return {
    delta,
    density: (x2) => h02 + (h12 - h02) * x2 / delta,
    cdf: (x2) => d2.bottom + h02 * x2 + (h12 - h02) * x2 * x2 / (2 * delta)
  };
}
function lipschitzCompletion(d2, M2, side) {
  const bounds = lipschitzBounds(d2, M2);
  const delta = side === "tent" ? bounds.lower : bounds.upper;
  if (bounds.empty || !Number.isFinite(delta)) throw new RangeError("No finite extreme completion");
  const density = (x2) => side === "tent" ? Math.min(d2.leftDensity + M2 * x2, d2.rightDensity + M2 * (delta - x2)) : Math.max(0, d2.leftDensity - M2 * x2, d2.rightDensity - M2 * (delta - x2));
  const join = M2 === 0 ? delta / 2 : (delta + (side === "tent" ? 1 : -1) * (d2.rightDensity - d2.leftDensity) / M2) / 2;
  const cdf = (x2) => {
    const s = side === "tent" ? M2 : -M2;
    const left = Math.min(x2, join), right = Math.max(0, x2 - join);
    return d2.bottom + d2.leftDensity * left + s * left * left / 2 + (d2.leftDensity + s * join) * right - s * right * right / 2;
  };
  return {
    delta,
    density,
    cdf
  };
}
function secondEconomy(first2) {
  const d2 = first2.observed, { B: B2, h0: h02, h1: h12 } = data(d2), delta = first2.delta / 2, e2 = first2.e / 2;
  const c = 2 * B2 / delta - h02 - h12;
  const bridgeDensity = (u) => h02 + (h12 - h02) * u + c * Math.sin(Math.PI * u) ** 2;
  const candidates = [0, 1];
  if (c !== 0 && Math.abs((h02 - h12) / (Math.PI * c)) <= 1) {
    const angle = Math.asin((h02 - h12) / (Math.PI * c));
    for (const t of [
      angle,
      Math.PI - angle,
      angle + 2 * Math.PI,
      Math.PI - angle + 2 * Math.PI
    ]) if (t > 0 && t < 2 * Math.PI) candidates.push(t / (2 * Math.PI));
  }
  const minimumDensity = Math.min(...candidates.map(bridgeDensity));
  positive(minimumDensity, "second-economy bridge minimum");
  const a2 = d2.threshold;
  const H02 = (x2) => {
    if (x2 <= a2) return first2.H0(x2);
    if (x2 >= a2 + delta) return first2.H1(x2 - delta);
    const u = (x2 - a2) / delta;
    return d2.bottom + delta * (h02 * u + (h12 - h02) * u * u / 2 + c * (u / 2 - Math.sin(2 * Math.PI * u) / (4 * Math.PI)));
  };
  const hLower = (x2) => x2 <= a2 ? first2.h0(x2) : x2 >= a2 + delta ? first2.h1(x2 - delta) : bridgeDensity((x2 - a2) / delta);
  const H12 = (x2) => H02(x2 + delta);
  return {
    e: e2,
    delta,
    H0: H02,
    H1: H12,
    law: {
      cdf: (w) => H02(w + e2 * d2.tau0),
      pdf: (w) => hLower(w + e2 * d2.tau0)
    },
    bridgeDensity,
    minimumDensity,
    observedCdf: (x2) => x2 < a2 ? H02(x2) : H12(x2)
  };
}
var normalPdf = (x2) => Math.exp(-x2 * x2 / 2) / Math.sqrt(2 * Math.PI);
function normalCdf(x2) {
  if (x2 < 0) return 1 - normalCdf(-x2);
  if (x2 > 8) return 1;
  if (x2 > 3) {
    let fraction = 0;
    for (let n = 120; n >= 1; n--) fraction = n / (x2 + fraction);
    return 1 - normalPdf(x2) / (x2 + fraction);
  }
  let term2 = x2, sum = x2;
  for (let n = 1; n < 100; n++) {
    term2 *= x2 * x2 / (2 * n + 1);
    sum += term2;
    if (Math.abs(term2) < 1e-16 * Math.abs(sum)) break;
  }
  return 0.5 + normalPdf(x2) * sum;
}
function populationTobit(observed2, window2, options = {}) {
  const { threshold: a2, tau0: tau02, tau1: tau12 } = observed2, [L, U] = window2;
  if (!(L < a2 && a2 < U)) return {
    success: false,
    reason: "Window must straddle the kink"
  };
  const W2 = observed2.cdf(U) - observed2.cdf(L), B2 = observed2.top - observed2.bottom;
  if (!(W2 > B2 && B2 > 0)) return {
    success: false,
    reason: "Window has insufficient continuous mass"
  };
  const n = options.panels ?? 256;
  if (n < 2 || n % 2 !== 0) return {
    success: false,
    reason: "Quadrature panels must be positive and even"
  };
  const samples2 = [];
  for (const [lo, hi, tau, endpoint] of [[
    L,
    a2,
    tau02,
    observed2.leftDensity
  ], [
    a2,
    U,
    tau12,
    observed2.rightDensity
  ]]) for (let i = 0; i <= n; i++) {
    const x2 = lo + (hi - lo) * i / n;
    const density = x2 === a2 ? endpoint : observed2.density(x2);
    samples2.push({
      x: x2,
      tau,
      weight: (hi - lo) / (3 * n) * (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * density / W2
    });
  }
  const objective = (p) => {
    const e3 = Math.exp(p[0]), m2 = p[1], s2 = Math.exp(p[2]);
    const pm = normalCdf((a2 - e3 * tau12 - m2) / s2) - normalCdf((a2 - e3 * tau02 - m2) / s2);
    const Z = normalCdf((U - e3 * tau12 - m2) / s2) - normalCdf((L - e3 * tau02 - m2) / s2);
    if (!(pm > 1e-15 && Z > 1e-15) || !Number.isFinite(s2 + e3)) return Infinity;
    let ll = B2 / W2 * Math.log(pm) - Math.log(Z);
    for (const t of samples2) ll += t.weight * (-Math.log(s2) - Math.log(2 * Math.PI) / 2 - ((t.x - e3 * t.tau - m2) / s2) ** 2 / 2);
    return -ll;
  };
  const scale = (U - L) / 2;
  const initialE = B2 / ((observed2.leftDensity + observed2.rightDensity) / 2) / (tau02 - tau12);
  let best;
  for (const factor of [
    0.6,
    1,
    1.8
  ]) {
    const e3 = initialE * factor;
    const result = minimize(objective, [
      Math.log(e3),
      a2 - e3 * (tau02 + tau12) / 2,
      Math.log(scale)
    ], [
      0.2,
      scale * 0.2,
      0.2
    ], options.maxIterations ?? 2e3);
    if (result.converged && (!best || result.value < best.value)) best = result;
  }
  if (!best || !Number.isFinite(best.value)) return {
    success: false,
    reason: "Population Tobit optimizer did not converge to a finite fit"
  };
  const e2 = Math.exp(best.p[0]), m = best.p[1], s = Math.exp(best.p[2]);
  return {
    success: true,
    e: e2,
    m,
    s,
    delta: e2 * (tau02 - tau12),
    objective: best.value,
    iterations: best.iterations,
    H0: (x2) => normalCdf((x2 - e2 * tau02 - m) / s),
    H1: (x2) => normalCdf((x2 - e2 * tau12 - m) / s)
  };
}
function minimize(fn2, start, steps, limit) {
  let simplex = [start, ...steps.map((step, i) => start.map((v, j) => v + (i === j ? step : 0)))].map((p) => ({
    p,
    value: fn2(p)
  }));
  for (let iterations = 0; iterations < limit; iterations++) {
    simplex.sort((a2, b) => a2.value - b.value);
    if (Number.isFinite(simplex[0].value) && simplex.every((v) => Math.abs(v.value - simplex[0].value) < 1e-11 && v.p.every((x2, j) => Math.abs(x2 - simplex[0].p[j]) < 2e-7))) return {
      ...simplex[0],
      iterations,
      converged: true
    };
    const center = start.map((_, j) => (simplex[0].p[j] + simplex[1].p[j] + simplex[2].p[j]) / 3);
    const trial2 = (factor) => {
      const p = center.map((v, j) => v + factor * (v - simplex[3].p[j]));
      return {
        p,
        value: fn2(p)
      };
    };
    const reflected = trial2(1);
    if (reflected.value < simplex[0].value) {
      const expanded = trial2(2);
      simplex[3] = expanded.value < reflected.value ? expanded : reflected;
    } else if (reflected.value < simplex[2].value) simplex[3] = reflected;
    else {
      const contracted = trial2(reflected.value < simplex[3].value ? 0.5 : -0.5);
      if (contracted.value < Math.min(reflected.value, simplex[3].value)) simplex[3] = contracted;
      else simplex = simplex.map((v, i) => {
        if (!i) return v;
        const p = v.p.map((x2, j) => (x2 + simplex[0].p[j]) / 2);
        return {
          p,
          value: fn2(p)
        };
      });
    }
  }
  simplex.sort((a2, b) => a2.value - b.value);
  return {
    ...simplex[0],
    iterations: limit,
    converged: false
  };
}
var C$1 = {
  ...C$2,
  approx: "#bf7824",
  bound: "#858078"
};
var P$2 = {
  ...CDF_PLOT,
  left: WIDE.left,
  right: WIDE.right
};
var { e: e$1, t0: t0$1, t1: t1$1, zStar: k } = CH1_DEFAULTS;
var a = Math.log(k);
var tau0 = Math.log1p(-t0$1);
var tau1 = Math.log1p(-t1$1);
var source$1 = decliningLaw();
var first = economy({
  cdf: (w) => source$1.H0(Math.exp(w + e$1 * tau0)),
  pdf: (w) => {
    const z = Math.exp(w + e$1 * tau0);
    return z * source$1.density(z, 0);
  }
}, e$1, {
  threshold: a,
  tau0,
  tau1
});
var d = first.observed;
var D = first.delta;
var points$1 = pointRules(d);
var second = secondEconomy(first);
var trapezoid$1 = logTrapezoid(d);
var x$1 = (logZ) => WIDE.at(logZ);
var y$1 = (share, strip2 = false) => strip2 ? 430 - share / 1.08 * (430 - P$2.top) : shareY(share);
var domain = [CDF_LOG_DOMAIN.lo, CDF_LOG_DOMAIN.hi];
var minSlope = Math.abs(d.rightDensity ** 2 - d.leftDensity ** 2) / (2 * (d.top - d.bottom));
var observedSlope = (() => {
  let M2 = 0;
  for (let i = 0; i <= 2e3; i++) {
    const z = a - 0.8 + 1.6 * i / 2e3, eps = 1e-5, h = z < a ? first.h0 : first.h1;
    if (Math.abs(z - a) > eps) M2 = Math.max(M2, Math.abs((h(z + eps) - h(z - eps)) / (2 * eps)));
  }
  return Math.max(minSlope, M2);
})();
var maxSlope = 4 * (d.leftDensity ** 2 + d.rightDensity ** 2) / (2 * (d.top - d.bottom));
var slopeCap = (probe) => minSlope + (maxSlope - minSlope) * probe;
var DEFAULT_SLOPE = (observedSlope - minSlope) / (maxSlope - minSlope);
var intervalSet = (probe) => ({
  lipschitz: lipschitzBounds(d, slopeCap(probe)),
  goff: goffBounds(d),
  monotone: monotoneBounds(d)
});
var fits = new Map();
function normalFit(window2) {
  let fit2 = fits.get(window2);
  if (!fit2) {
    fit2 = populationTobit(d, [a - window2, a + window2]);
    fits.set(window2, fit2);
    if (fits.size > 40) fits.delete(fits.keys().next().value);
  }
  return fit2;
}
function curve$3(fn2, lo, hi, strip2 = false) {
  return Array.from({ length: 120 }, (_, i) => {
    const z = lo + (hi - lo) * i / 119;
    return [x$1(z), y$1(fn2(z), strip2)];
  });
}
function anchoredNormal(window2) {
  const fit2 = normalFit(window2);
  if (!fit2.success) return fit2;
  const lo = fit2.H0(a), span = fit2.H1(a) - lo;
  const calibrate = (v) => d.bottom + (d.top - d.bottom) * (v - lo) / span;
  return {
    ...fit2,
    H0: (z) => calibrate(fit2.H0(z)),
    H1: (z) => calibrate(fit2.H1(z))
  };
}
var POINT_ROWS = [
  "left",
  "right",
  "trapezoid",
  "normal"
];
var PARTIAL_ROWS = [
  "lipschitz",
  "goff",
  "monotone"
];
var pointRowY = (i) => 328 + i * 30;
var partialRowY = (i) => 500 + i * 44;
var RULE_LABELS = {
  left: "Left-linear",
  right: "Right-linear",
  trapezoid: "Trapezoid in log income",
  normal: "Local normal",
  lipschitz: "Lipschitz density",
  goff: "Bi-log-concavity",
  monotone: "Monotone density"
};
function pointGap(id, window2) {
  const fit2 = normalFit(window2);
  return id === "left" ? points$1.left : id === "right" ? points$1.right : id === "trapezoid" ? points$1.logTrapezoid : fit2.success ? fit2.delta : null;
}
var PRESSES$2 = [
  {
    key: "recall",
    stage: 0,
    text: "Rank matching gives Δ, but it needs H̃₀ above z⋆, which we never see.",
    derivationAt: 0
  },
  {
    key: "mass",
    stage: 0,
    text: "What we do see is the jump: the bunching mass. We use it to approximate Δ.",
    derivationAt: 1
  },
  {
    key: "tangent",
    stage: 1,
    text: "Near z⋆, replace H̃₀ by its tangent: start at the bottom of the jump and keep its slope.",
    derivationAt: 0
  },
  {
    key: "rise",
    stage: 1,
    text: "Written with the CDFs: the tangent has to climb the whole jump.",
    derivationAt: 1
  },
  {
    key: "left",
    stage: 1,
    text: "Where the tangent reaches the top of the jump is our approximation of log z⋆+Δ.",
    derivationAt: 2
  },
  {
    key: "truth",
    stage: 2,
    text: "The true Δ is where H̃₀ itself reaches that height. The two differ by how much H̃₀ bends across the gap."
  },
  {
    key: "elasticity",
    stage: 3,
    text: "Recall Δ = e(τ₀−τ₁). Everything on the right is observed: the jump, the density just below z⋆, and the two tax rates.",
    derivationAt: 0
  },
  {
    key: "right",
    stage: 4,
    text: "Read the rank equation from the other side: extend H̃₁ back from the top of the jump. Same data, a different answer.",
    derivationAt: 0
  },
  {
    key: "area",
    stage: 4,
    text: "Across the gap, H̃₀ rises by exactly the jump B, from the bottom of the shaded box to its top. That rise is the area under its density h̃₀ over the gap.",
    derivationAt: 1
  },
  {
    key: "trapezoid",
    stage: 4,
    text: "This is Saez's (2010) two-sided rule, written in logs: let the density change in a straight line across the gap, from its value just below z⋆ to its value just above.",
    derivationAt: 2
  },
  {
    key: "points",
    stage: 5,
    text: "Each rule is an assumption about the part of F̃ we can't see. These give one answer each. Click one to see what it assumes."
  },
  {
    key: "intervals",
    stage: 5,
    text: "These assume less and give a range instead of a point."
  },
  {
    key: "data",
    stage: 6,
    text: "This is everything the data contain."
  },
  {
    key: "economy",
    stage: 6,
    text: "One economy that produces these data: elasticity e and its distribution of types."
  },
  {
    key: "second",
    stage: 6,
    text: "A second economy, with half the elasticity and a different distribution of types, produces exactly the same data."
  },
  {
    key: "indistinguishable",
    stage: 6,
    text: "No rule can tell them apart from the data. Each rule simply picks one."
  },
  {
    key: "literature",
    stage: 7,
    text: "Every rule adds an assumption about F̃ across the gap: a shape, a family, or a bound. Others add data instead, such as several kinks or covariates that predict types."
  },
  {
    key: "extensions",
    stage: 7,
    text: "If people's elasticities differ, the same argument still identifies a weighted average of them. Without quasi-linear utility, it identifies a local average uncompensated elasticity."
  },
  {
    key: "bridge",
    stage: 8,
    text: "So B identifies e only together with an assumption about H̃₀ across the gap, or with more data. Is there anything we get with no assumption about F̃? Yes, if we change the question: the effect of moving the kink. That is Chapter 3."
  }
];
var TIMELINE$2 = createTimeline(PRESSES$2.map((p) => ({
  key: p.key,
  duration: 0.55
})));
function sceneAt$2(t) {
  const index = TIMELINE$2.ends.findIndex((end) => t <= end + 1e-8), step = index < 0 ? PRESSES$2.length - 1 : index;
  return {
    step,
    progress: Math.max(0, Math.min(1, (t - TIMELINE$2.starts[step]) / (TIMELINE$2.ends[step] - TIMELINE$2.starts[step])))
  };
}
var INITIAL = {
  step: -1,
  lens: null,
  window: 0.6,
  slope: DEFAULT_SLOPE,
  ready: false
};
function reduceLens(state, action) {
  if (action.type === "navigate") return {
    ...INITIAL,
    step: action.step
  };
  if (action.type === "ready") return action.step === state.step && !state.ready ? {
    ...state,
    ready: true
  } : state;
  if (!state.ready) return state;
  if (action.type === "lens") return {
    ...state,
    lens: state.lens === action.lens ? null : action.lens
  };
  if (action.type === "window") return {
    ...state,
    window: Math.max(0.3, Math.min(1, action.value))
  };
  return {
    ...state,
    slope: Math.max(0, Math.min(1, action.value))
  };
}
var snapshot = INITIAL;
var listeners$1 = new Set();
var subscribe$1 = (fn2) => {
  listeners$1.add(fn2);
  return () => {
    listeners$1.delete(fn2);
  };
};
var getSnapshot$1 = () => snapshot;
var getServerSnapshot$1 = () => INITIAL;
function dispatch(action) {
  const next = reduceLens(snapshot, action);
  if (next !== snapshot) {
    snapshot = next;
    listeners$1.forEach((fn2) => fn2());
  }
}
var stateForStep = (state, step) => state.step === step ? state : {
  ...INITIAL,
  step
};
var LAST_CDF = TIMELINE$3.total;
var LOWER_LABEL = Math.log(FIGURE_MODEL.lowerLabelIncome), UPPER_LABEL = Math.log(FIGURE_MODEL.upperLabelIncome);
var HALF_BRACKET_Y = P$2.bottom - 38, HALF_TICK = 6;
var densityLens = (lens) => lens === "trapezoid" || lens === "lipschitz" || lens === "monotone";
var menuShown = (step) => step === 10 || step === 11 || step === 16 || step === 17;
function fill(ctx, pts, color, alpha2 = 0.12) {
  ctx.save();
  ctx.globalAlpha = alpha2;
  ctx.beginPath();
  pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}
function line$1(ctx, from, to, height, color, dash = [], strip2 = false) {
  stroke$1(ctx, [[x$1(from), y$1(height, strip2)], [x$1(to), y$1(height, strip2)]], color, 2, dash);
}
function drawFrameCore(ctx, t, assets, state, theme, view) {
  const { step, progress } = sceneAt$2(t), s = stateForStep(state, step), lens = s.lens, strip2 = densityLens(lens);
  if (step === 0) {
    cdfFilm.draw(ctx, LAST_CDF, assets, theme, view);
    return;
  }
  const Y = (v) => y$1(v, strip2), bottom = strip2 ? 430 : P$2.bottom;
  draw$2(ctx, LAST_CDF, null, theme);
  if (strip2) {
    ctx.clearRect(0, 0, VIEWBOX$3.width, VIEWBOX$3.height);
    ctx.fillStyle = theme.paper;
    ctx.fillRect(0, 0, VIEWBOX$3.width, VIEWBOX$3.height);
  }
  if (strip2) stroke$1(ctx, [
    [P$2.left, P$2.top],
    [P$2.left, bottom],
    [P$2.right, bottom]
  ], C$1.ink, 1.5);
  ctx.save();
  ctx.beginPath();
  ctx.rect(P$2.left, P$2.top, P$2.right - P$2.left, bottom - P$2.top);
  ctx.clip();
  if (assets) {
    const people2 = morphPopulation(assets.sweep.people, 1), pts = [[x$1(domain[0]), bottom]];
    let previous = 0;
    for (const p of people2) {
      const share = (p.rank + 1) / people2.length;
      pts.push([x$1(Math.log(p.z)), Y(previous)], [x$1(Math.log(p.z)), Y(share)]);
      previous = share;
    }
    stroke$1(ctx, pts, C$1.ink, 1.5);
    ctx.globalAlpha = RED_OPACITY;
    ctx.fillStyle = C$1.buncher;
    ctx.fillRect(x$1(a) - 3, Y(d.top), 6, Y(d.bottom) - Y(d.top));
    ctx.globalAlpha = 1;
  }
  if ((step <= 6 || step === 13 || step === 14 || step === 15) && !lens) {
    ctx.globalAlpha = step === 6 ? Math.max(0, 1 - progress / 0.33) : step >= 2 && step <= 4 ? 0.35 : 1;
    stroke$1(ctx, curve$3(first.H0, a, domain[1], strip2), C$1.lower, 2.5, [3, 5]);
    stroke$1(ctx, curve$3(first.H1, domain[0], a, strip2), C$1.upper, 2.5, [3, 5]);
    ctx.globalAlpha = 1;
  }
  stroke$1(ctx, curve$3(first.H0, domain[0], a, strip2), C$1.lower, 2.5);
  stroke$1(ctx, curve$3(first.H1, a, domain[1], strip2), C$1.upper, 2.5);
  stroke$1(ctx, [[x$1(a), Y(d.bottom)], [x$1(a), Y(d.top)]], C$1.buncher, step === 1 ? 4 + 2 * Math.sin(Math.PI * progress) ** 2 : 4);
  for (const height of [d.bottom, d.top]) line$1(ctx, domain[0], a, height, C$1.buncher, [3, 5], strip2);
  if (step <= 5 || step >= 7 && step <= 11 || lens) for (const height of [d.bottom, d.top]) line$1(ctx, a, domain[1], height, "#c9c5bc", [3, 5], strip2);
  if (step <= 4 && !lens) {
    line$1(ctx, a, a + D, d.top, C$1.ink, [5, 4], strip2);
    dot$1(ctx, x$1(a), Y(d.top), C$1.upper, 6);
    dot$1(ctx, x$1(a + D), Y(d.top), C$1.lower, 6, true);
    ctx.beginPath();
    ctx.ellipse(x$1(a + D), Y(d.top), 16, 16, 0, 0, Math.PI * 2);
    ctx.strokeStyle = C$1.buncher;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  if (step === 6) {
    ctx.globalAlpha = Math.sin(Math.PI * progress) ** 2;
    stroke$1(ctx, curve$3(first.H0, a - 0.12, a, strip2), C$1.lower, 6);
    stroke$1(ctx, [[x$1(a), Y(d.bottom)], [x$1(a), Y(d.top)]], C$1.buncher, 7);
    ctx.globalAlpha = 1;
  }
  const reveal = (at2) => step === at2 ? progress : 1;
  const fade = Math.min(1, progress / 0.33);
  ctx.globalAlpha = fade;
  const left = () => {
    stroke$1(ctx, curve$3((z) => d.bottom + d.leftDensity * (z - a), a, a + points$1.left * 1.6 * reveal(2), strip2), C$1.lower, 2.5, [6, 4]);
    if (step >= 4 || lens) {
      dot$1(ctx, x$1(a + points$1.left), Y(d.top), C$1.approx, 5);
      stroke$1(ctx, [[x$1(a + points$1.left), Y(d.top)], [x$1(a + points$1.left), bottom]], C$1.approx, 1.5, [4, 4]);
    }
  };
  const right = () => {
    stroke$1(ctx, curve$3((z) => d.top + d.rightDensity * (z - a), a - points$1.right * reveal(7), a, strip2), C$1.upper, 2.5, [6, 4]);
    dot$1(ctx, x$1(a - points$1.right), Y(d.bottom), C$1.approx, 5);
    line$1(ctx, a - points$1.right, a, d.bottom, C$1.approx, [], strip2);
  };
  const trap = () => {
    stroke$1(ctx, curve$3((z) => trapezoid$1.cdf(z - a), a, a + trapezoid$1.delta * reveal(9), strip2), C$1.lower, 3);
    dot$1(ctx, x$1(a + trapezoid$1.delta), Y(d.top), C$1.approx, 5);
  };
  if (!lens && step >= 2 && step <= 9) left();
  if (!lens && step >= 7 && step <= 9) right();
  if (!lens && (step === 3 || step === 4)) {
    ctx.globalAlpha = step === 4 ? 1 - fade : 1;
    stroke$1(ctx, [[x$1(a + points$1.left), Y(d.bottom)], [x$1(a + points$1.left), Y(d.bottom + (d.top - d.bottom) * (step === 3 ? progress : 1))]], C$1.buncher, 3);
    ctx.globalAlpha = 1;
  }
  if (!lens && (step === 5 || step === 13 || step === 14 || step === 15)) {
    stroke$1(ctx, [[x$1(a + D), Y(d.top)], [x$1(a + D), bottom]], C$1.ink, 1.5, [2, 4]);
    dot$1(ctx, x$1(a + D), Y(d.top), C$1.lower, 6, true);
    line$1(ctx, a, a + D, d.top, C$1.ink, [5, 4], strip2);
  }
  if (!lens && step === 6) {
    ctx.globalAlpha = Math.max(0, 1 - progress / 0.33);
    stroke$1(ctx, [[x$1(a + D), Y(d.top)], [x$1(a + D), bottom]], C$1.ink, 1.5, [2, 4]);
    ctx.globalAlpha = 1;
    left();
  }
  if (!lens && step >= 8 && step <= 9) {
    fill(ctx, [
      [x$1(a), Y(d.bottom)],
      [x$1(a + D), Y(d.bottom)],
      [x$1(a + D), Y(d.top)],
      [x$1(a), Y(d.top)]
    ], C$1.lower, 0.1);
    if (step === 9) trap();
  }
  if (menuShown(step) && !strip2) {
    const intervals = intervalSet(s.slope);
    const dim = (id) => lens && lens !== id ? 0.2 : 1;
    POINT_ROWS.forEach((id, i) => {
      const gap = pointGap(id, s.window), yy = pointRowY(i);
      ctx.globalAlpha = dim(id) * 0.55;
      stroke$1(ctx, [[x$1(a), yy], [P$2.right, yy]], C$1.bound, 1);
      if (gap === null) return;
      ctx.globalAlpha = dim(id);
      if (x$1(a + gap) > P$2.right) {
        stroke$1(ctx, [
          [P$2.right - 12, yy - 7],
          [P$2.right, yy],
          [P$2.right - 12, yy + 7]
        ], C$1.approx, 2);
        return;
      }
      stroke$1(ctx, [[x$1(a + gap), yy - 9], [x$1(a + gap), yy + 9]], C$1.approx, 2.5);
    });
    if (step >= 11) PARTIAL_ROWS.forEach((id, i) => {
      const b = intervals[id], yy = partialRowY(i), hi = Math.min(domain[1], a + b.upper);
      ctx.globalAlpha = dim(id);
      stroke$1(ctx, [[x$1(a + b.lower), yy], [x$1(hi), yy]], C$1.bound, 5);
      for (const xx of [x$1(a + b.lower), x$1(hi)]) stroke$1(ctx, [[xx, yy - 7], [xx, yy + 7]], C$1.bound, 1.5);
      if (a + b.upper > domain[1]) stroke$1(ctx, [
        [P$2.right - 10, yy - 5],
        [P$2.right, yy],
        [P$2.right - 10, yy + 5]
      ], C$1.bound, 2);
    });
    ctx.globalAlpha = 1;
  }
  if (!lens && step >= 14 && step <= 15) {
    ctx.globalAlpha = reveal(14) * 0.65;
    stroke$1(ctx, curve$3(second.H0, a, domain[1], strip2), C$1.lower, 2.5, [7, 6]);
    stroke$1(ctx, curve$3(second.H1, domain[0], a, strip2), C$1.upper, 2.5, [7, 6]);
    const by = HALF_BRACKET_Y;
    stroke$1(ctx, [[x$1(a), by], [x$1(a + second.delta), by]], C$1.ink, 2);
    stroke$1(ctx, [[x$1(a), by - HALF_TICK], [x$1(a), by + HALF_TICK]], C$1.ink, 2);
    stroke$1(ctx, [[x$1(a + second.delta), by - HALF_TICK], [x$1(a + second.delta), by + HALF_TICK]], C$1.ink, 2);
    dot$1(ctx, x$1(a + second.delta), Y(d.top), C$1.lower, 5, true);
    ctx.globalAlpha = 1;
  }
  if (lens === "left") left();
  if (lens === "right") right();
  if (lens === "trapezoid") trap();
  if (lens === "normal") {
    const fit2 = anchoredNormal(s.window);
    fill(ctx, [
      [x$1(a - s.window), P$2.top],
      [x$1(a + s.window), P$2.top],
      [x$1(a + s.window), bottom],
      [x$1(a - s.window), bottom]
    ], C$1.bound, 0.08);
    if (fit2.success) {
      stroke$1(ctx, curve$3(fit2.H0, a - s.window, a + s.window, strip2), C$1.lower, 2, [6, 4]);
      stroke$1(ctx, curve$3(fit2.H1, a - s.window, a + s.window, strip2), C$1.upper, 2, [6, 4]);
      line$1(ctx, a, a + fit2.delta, d.top, C$1.approx, [], strip2);
    }
  }
  if (lens === "monotone") {
    const lo = Math.min(points$1.left, points$1.right), hi = Math.max(points$1.left, points$1.right);
    fill(ctx, [
      [x$1(a), Y(d.bottom)],
      [x$1(a + lo), Y(d.top)],
      [x$1(a + hi), Y(d.top)]
    ], C$1.bound, 0.16);
    left();
    stroke$1(ctx, curve$3((z) => d.bottom + d.rightDensity * (z - a), a, a + points$1.right, strip2), C$1.upper, 2);
  }
  if (lens === "goff") {
    for (const side of ["left", "right"]) {
      const lo = side === "left" ? a : a - D, hi = side === "left" ? a + D : a;
      const low = (z) => {
        const q = goffEnvelopes(d, Math.abs(z - a));
        return side === "left" ? q.lowerFromLeft : q.lowerFromRight;
      }, high = (z) => {
        const q = goffEnvelopes(d, Math.abs(z - a));
        return side === "left" ? q.upperFromLeft : q.upperFromRight;
      };
      fill(ctx, [...curve$3(low, lo, hi, strip2), ...curve$3(high, lo, hi, strip2).reverse()], C$1.bound, 0.06);
      stroke$1(ctx, curve$3(low, lo, hi, strip2), C$1.bound);
      stroke$1(ctx, curve$3(high, lo, hi, strip2), C$1.bound);
    }
    left();
  }
  if (lens === "lipschitz") {
    const M2 = slopeCap(s.slope), b = intervalSet(s.slope).lipschitz;
    const tent = lipschitzCompletion(d, M2, "tent");
    stroke$1(ctx, curve$3((z) => tent.cdf(z - a), a, a + tent.delta, strip2), C$1.bound, 2.5);
    if (Number.isFinite(b.upper)) {
      const valley = lipschitzCompletion(d, M2, "valley");
      stroke$1(ctx, curve$3((z) => valley.cdf(z - a), a, a + valley.delta, strip2), C$1.bound, 2.5);
      fill(ctx, [
        ...curve$3((z) => tent.cdf(z - a), a, a + tent.delta, strip2),
        [x$1(a + valley.delta), Y(d.top)],
        ...curve$3((z) => valley.cdf(z - a), a, a + valley.delta, strip2).reverse()
      ], C$1.bound, 0.13);
    }
  }
  if (step === 18) {
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = C$1.buncher;
    ctx.fillRect(x$1(a) - 12, Y(d.top) - 7, 24, Y(d.bottom) - Y(d.top) + 14);
    ctx.globalAlpha = 1;
  }
  ctx.globalAlpha = 1;
  ctx.restore();
  if (strip2) drawDensity(ctx, s);
}
var transitions = new WeakMap();
function drawFrame(...args) {
  const [ctx, t, , state] = args, canvas = ctx.canvas;
  if (!canvas?.ownerDocument || typeof requestAnimationFrame === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    drawFrameCore(...args);
    return;
  }
  const key = `${sceneAt$2(t).step}:${state.lens}`;
  let transition = transitions.get(ctx);
  if (!transition) {
    transition = {
      key,
      start: -Infinity,
      old: canvas.ownerDocument.createElement("canvas"),
      current: canvas.ownerDocument.createElement("canvas"),
      raf: 0
    };
    transitions.set(ctx, transition);
  }
  cancelAnimationFrame(transition.raf);
  if (transition.key !== key) {
    transition.key = key;
    transition.start = performance.now();
    for (const layer of [transition.old, transition.current]) {
      layer.width = canvas.width;
      layer.height = canvas.height;
    }
    transition.old.getContext("2d").drawImage(canvas, 0, 0);
  }
  drawFrameCore(...args);
  const alpha2 = Math.min(1, (performance.now() - transition.start) / 180);
  if (alpha2 < 1) {
    const current = transition.current.getContext("2d");
    current.clearRect(0, 0, canvas.width, canvas.height);
    current.drawImage(canvas, 0, 0);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.drawImage(transition.old, 0, 0);
    ctx.globalAlpha = alpha2;
    ctx.drawImage(transition.current, 0, 0);
    ctx.restore();
    transition.raf = requestAnimationFrame(() => {
      if (canvas.isConnected) drawFrame(...args);
    });
  }
}
function densityCeiling(s) {
  let peak = Math.max(d.leftDensity, d.rightDensity);
  if (s.lens === "lipschitz") {
    const M2 = slopeCap(s.slope), bounds = intervalSet(s.slope).lipschitz;
    for (const side of ["tent", "valley"]) {
      if (side === "valley" && !Number.isFinite(bounds.upper)) continue;
      const completion = lipschitzCompletion(d, M2, side), end = Math.min(completion.delta, Math.max(points$1.right, D) * 1.4);
      for (let i = 0; i <= 120; i++) peak = Math.max(peak, completion.density(end * i / 120));
    }
  }
  return peak * 1.1;
}
function drawDensity(ctx, s) {
  const left = P$2.left, right = P$2.right, top = 510, bottom = 610, width = right - left, span = Math.max(points$1.right, D) * 1.4;
  const ceiling = densityCeiling(s);
  const X2 = (v) => left + v / span * width, Y = (v) => bottom - v / ceiling * (bottom - top);
  stroke$1(ctx, [
    [left, top],
    [left, bottom],
    [right, bottom]
  ], C$1.bound, 1);
  ctx.save();
  ctx.beginPath();
  ctx.rect(left, top - 2, width, bottom - top + 4);
  ctx.clip();
  const path2 = (fn2, delta, color, dash = []) => stroke$1(ctx, Array.from({ length: 120 }, (_, i) => {
    const z = delta * i / 119;
    return [X2(z), Y(fn2(z))];
  }), color, 2, dash);
  const B2 = d.top - d.bottom;
  if (s.lens === "trapezoid") {
    fill(ctx, [
      [left, bottom],
      [X2(trapezoid$1.delta), bottom],
      [X2(trapezoid$1.delta), Y(d.rightDensity)],
      [left, Y(d.leftDensity)]
    ], C$1.lower, 0.18);
    path2(trapezoid$1.density, trapezoid$1.delta, C$1.lower);
  }
  if (s.lens === "monotone") {
    fill(ctx, [
      [left, Y(d.leftDensity)],
      [right, Y(d.leftDensity)],
      [right, Y(d.rightDensity)],
      [left, Y(d.rightDensity)]
    ], C$1.bound, 0.18);
    for (const h of [d.leftDensity, d.rightDensity]) stroke$1(ctx, [[left, Y(h)], [right, Y(h)]], C$1.bound, 1, [3, 4]);
  }
  if (s.lens === "lipschitz") {
    const M2 = slopeCap(s.slope), bounds = intervalSet(s.slope).lipschitz;
    for (const side of ["tent", "valley"]) {
      if (side === "valley" && !Number.isFinite(bounds.upper)) continue;
      const completion = lipschitzCompletion(d, M2, side);
      path2(completion.density, completion.delta, C$1.bound, side === "valley" ? [4, 4] : []);
    }
    if (!Number.isFinite(bounds.upper)) {
      const gap = Math.max(span, 2 * B2 / Math.min(d.leftDensity, d.rightDensity));
      path2((z) => Math.max(0, d.leftDensity - M2 * z, d.rightDensity - M2 * (gap - z)), span, C$1.bound, [4, 4]);
    }
  }
  ctx.restore();
}
function Label$4({ tex, x: xx, y: yy, width = 220, anchor = "start" }) {
  return jsx(SvgMathLabel, {
    tex,
    x: xx,
    y: yy,
    width,
    height: 48,
    anchor,
    className: "cdf-label ni-glyph-halo"
  });
}
function RuleLabel({ text, x: xx, y: yy }) {
  return jsx("text", {
    x: xx,
    y: yy,
    className: "ni-rule-label ni-glyph-halo",
    children: text
  });
}
function Overlay$2(props) {
  const { step, progress } = sceneAt$2(props.t), snapshot2 = useSyncExternalStore(subscribe$1, getSnapshot$1, getServerSnapshot$1);
  useEffect(() => {
    if (progress >= 0.99999999) dispatch({
      type: "ready",
      step
    });
  }, [
    step,
    progress,
    snapshot2.step
  ]);
  return jsx(FrameLabels, {
    ...props,
    state: snapshot2
  });
}
function FrameLabels(props) {
  const { step } = sceneAt$2(props.t), s = stateForStep(props.state ?? INITIAL, step), strip2 = densityLens(s.lens);
  const Original = cdfFilm.Overlay;
  if (step === 0 && Original) return jsx(Original, {
    ...props,
    t: LAST_CDF
  });
  const Y = (v) => y$1(v, strip2), bottom = strip2 ? 430 : P$2.bottom;
  return jsxs("g", { children: [
    jsx("g", {
      transform: strip2 ? `translate(0,${430 - P$2.bottom})` : void 0,
      children: jsx(Overlay$3, {
        ...props,
        assets: null,
        t: TIMELINE$3.ends[STEP_INDEX$3.lawSwitch]
      })
    }),
    strip2 && jsxs(Fragment$1, { children: [jsx("path", {
      d: `M${P$2.left - 5},${y$1(1, true)}h5`,
      stroke: C$1.ink
    }), jsx(Label$5, {
      tex: "1",
      x: P$2.left - 16,
      y: y$1(1, true) + 10,
      width: 40,
      anchor: "end"
    })] }),
    jsxs("g", {
      className: "ni-fade",
      children: [
        s.lens === "normal" ? jsx(Label$4, {
          tex: String.raw`\widetilde H_0`,
          x: x$1(a) + 40,
          y: Y(d.bottom) + 100,
          width: 145
        }) : s.lens === "goff" ? jsx(Label$4, {
          tex: String.raw`\widetilde H_0`,
          x: x$1(a - D) - 10,
          y: P$2.bottom - 16,
          width: 145,
          anchor: "end"
        }) : jsx(Label$4, {
          tex: String.raw`\widetilde H_0`,
          x: x$1(LOWER_LABEL),
          y: Y(first.H0(LOWER_LABEL)) + 70 * (strip2 ? (430 - P$2.top) / (P$2.bottom - P$2.top) : 1),
          width: 145
        }),
        jsx(Label$4, {
          tex: String.raw`\widetilde H_1`,
          x: x$1(UPPER_LABEL),
          y: Y(first.H1(UPPER_LABEL)) - 30,
          width: 145
        }),
        jsx(Label$4, {
          tex: String.raw`\widetilde H_0(\log z^\star)`,
          x: GUIDE_LABELS.lower.x,
          y: Y(d.bottom) - 26,
          width: GUIDE_LABELS.lower.width
        }),
        jsx(Label$4, {
          tex: String.raw`\widetilde H_1(\log z^\star)`,
          x: GUIDE_LABELS.upper.x,
          y: Y(d.top) - 26,
          width: GUIDE_LABELS.upper.width
        }),
        jsx(Label$4, {
          tex: "B",
          x: x$1(a) + 6,
          y: Y(d.bottom) + 70,
          width: 55,
          anchor: "middle"
        }),
        step >= 4 && step <= 6 && jsx("g", {
          className: "ni-orange",
          children: jsx(Label$4, {
            tex: String.raw`\log z^\star+\Delta`,
            x: x$1(a + points$1.left) + 10,
            y: bottom - 30,
            width: 270
          })
        }),
        !s.lens && (step === 13 || step === 14 || step === 15) && jsxs(Fragment$1, { children: [jsx(Label$4, {
          tex: "e",
          x: x$1(a + D) + 10,
          y: Y(d.top) + 170,
          width: 60
        }), jsx(Label$4, {
          tex: String.raw`\Delta`,
          x: x$1(a + D) + 20,
          y: Y(d.top) + 10,
          width: 90
        })] }),
        !s.lens && (step === 14 || step === 15) && jsxs(Fragment$1, { children: [jsx(Label$4, {
          tex: String.raw`\frac{e}{2}`,
          x: x$1(a + second.delta) + 12,
          y: HALF_BRACKET_Y + 12,
          width: 100
        }), jsx(Label$4, {
          tex: String.raw`\frac{\Delta}{2}`,
          x: x$1(a + second.delta / 2),
          y: HALF_BRACKET_Y - 31,
          width: 110,
          anchor: "middle"
        })] }),
        step === 9 && jsxs(Fragment$1, { children: [jsx(Label$4, {
          tex: String.raw`\text{trapezoid}`,
          x: x$1(a + Math.max(points$1.left, trapezoid$1.delta)) + 14,
          y: Y((d.bottom + d.top) / 2) - 4,
          width: 200
        }), jsx(Label$4, {
          tex: String.raw`\text{in log income}`,
          x: x$1(a + Math.max(points$1.left, trapezoid$1.delta)) + 14,
          y: Y((d.bottom + d.top) / 2) + 22,
          width: 200
        })] }),
        menuShown(step) && !strip2 && jsxs("g", {
          className: "ni-rule-labels",
          children: [POINT_ROWS.map((id, i) => {
            const gap = pointGap(id, s.window);
            if (gap === null) return null;
            const xx = Math.min(x$1(a + gap), P$2.right);
            return jsx("g", {
              opacity: s.lens && s.lens !== id ? 0.25 : 1,
              children: jsx(RuleLabel, {
                text: RULE_LABELS[id],
                x: xx + 12,
                y: pointRowY(i) + 7
              })
            }, id);
          }), step >= 11 && PARTIAL_ROWS.map((id, i) => {
            const b = intervalSet(s.slope)[id];
            return jsx("g", {
              opacity: s.lens && s.lens !== id ? 0.25 : 1,
              children: jsx(RuleLabel, {
                text: RULE_LABELS[id],
                x: x$1(a + b.lower),
                y: partialRowY(i) - 13
              })
            }, id);
          })]
        }),
        strip2 && jsxs(Fragment$1, { children: [jsx(Label$4, {
          tex: String.raw`\widetilde h_0`,
          x: P$2.left - 10,
          y: 550,
          width: 90,
          anchor: "end"
        }), s.lens !== "monotone" && jsx(Label$4, {
          tex: "B",
          x: P$2.left + 120,
          y: 650,
          width: 60
        })] }),
        s.lens === "normal" && jsxs("foreignObject", {
          x: P$2.left + 8,
          y: 654,
          width: 290,
          height: 55,
          children: [jsxs("label", {
            className: "ni-probe",
            children: ["Window around the kink", jsx("input", {
              "aria-label": "Window around the kink",
              "aria-valuetext": s.window < 0.5 ? "Narrow window" : s.window > 0.8 ? "Wide window" : "Intermediate window",
              type: "range",
              min: 0.3,
              max: 1,
              step: 0.025,
              value: s.window,
              onChange: (event) => dispatch({
                type: "window",
                value: Number(event.target.value)
              })
            })]
          }), !normalFit(s.window).success && jsx("span", {
            className: "ni-fit-failed",
            role: "status",
            children: "The local-normal fit failed for this window."
          })]
        }),
        s.lens === "lipschitz" && jsx("foreignObject", {
          x: P$2.left + 8,
          y: 654,
          width: 290,
          height: 55,
          children: jsxs("label", {
            className: "ni-probe",
            children: [jsxs("span", {
              className: "ni-probe-title",
              children: [jsx(InlineMath, { tex: "M" }), " — density slope cap"]
            }), jsx("input", {
              "aria-label": "Density slope cap",
              "aria-valuetext": s.slope === 0 ? "Smallest admissible cap" : s.slope < 0.5 ? "Tighter cap" : "Looser cap",
              type: "range",
              min: 0,
              max: 1,
              step: 5e-3,
              value: s.slope,
              onChange: (event) => dispatch({
                type: "slope",
                value: Number(event.target.value)
              })
            })]
          })
        })
      ]
    }, `${step}-${s.lens}`)
  ] });
}
function createFilm(state = INITIAL) {
  return {
    viewBox: VIEWBOX$3,
    timeline: TIMELINE$2,
    load: loadBaseline,
    draw: (ctx, t, assets, theme, view) => drawFrame(ctx, t, assets, state, theme, view),
    Overlay: Overlay$2,
    ariaLabel: (t) => {
      const { step } = sceneAt$2(t);
      return step >= 13 && step <= 15 ? "Different elasticities reproduce the same observed CDF and jump" : "Observed log-income CDF branches, the bunching jump, and identifying assumptions";
    }
  };
}
function NonidentificationFigure({ step, entering }) {
  const state = useSyncExternalStore(subscribe$1, getSnapshot$1, getServerSnapshot$1);
  useEffect(() => {
    dispatch({
      type: "navigate",
      step
    });
    return () => dispatch({
      type: "navigate",
      step: -1
    });
  }, [step]);
  return jsx(FilmFigure, {
    film: useMemo(() => createFilm(state), [state]),
    step,
    entering,
    className: "cdf-chapter ni-chapter"
  });
}
var r$9 = String.raw;
var A$1 = r$9`\log z^\star`;
var H0$2 = r$9`\widetilde H_0(\log z^\star)`;
var H1$2 = r$9`\widetilde H_1(\log z^\star)`;
var h0$1 = r$9`\widetilde h_0(\log z^\star)`;
var h1$1 = r$9`\widetilde h_1(\log z^\star)`;
var TEX = {
  recall: r$9`\widetilde H_0(\log z^\star+\Delta)=\widetilde H_1(\log z^\star)`,
  types: r$9`\widetilde F(\log z^\star+\Delta-e\tau_0)=\widetilde F(\log z^\star-e\tau_1)`,
  mass: r$9`B=${H1$2}-${H0$2}`,
  left: r$9`\Delta\approx\frac{B}{${h0$1}}`,
  right: r$9`\Delta\approx\frac{B}{${h1$1}}`,
  area: r$9`\int_{\log z^\star}^{\log z^\star+\Delta}\widetilde h_0(\tilde z)\,d\tilde z=B`,
  trapezoid: r$9`\Delta\approx\frac{2B}{${h0$1}+${h1$1}}`,
  elasticity: r$9`e\approx\frac{B}{${h0$1}(\tau_0-\tau_1)}`,
  trapezoidE: r$9`e\approx\frac{2B}{\big(${h0$1}+${h1$1}\big)(\tau_0-\tau_1)}`,
  saez: r$9`\begin{aligned}B&\approx\frac{\exp(\Delta)-1}{2}\\&\quad\times\Big[\widetilde h_0+\exp(-\Delta)\,\widetilde h_1\Big]\end{aligned}`,
  saezRoot: r$9`\begin{aligned}q&=2B+\widetilde h_0-\widetilde h_1\\\exp(\Delta)&\approx\frac{q+\sqrt{q^2+4\widetilde h_0\widetilde h_1}}{2\widetilde h_0}\end{aligned}`,
  normal: r$9`\begin{aligned}\Delta=s\Big[&\Phi^{-1}\big(${H1$2}\big)\\ &-\Phi^{-1}\big(${H0$2}\big)\Big]\end{aligned}`,
  normalLaw: r$9`\begin{gathered}\widetilde F(\tilde w)=\Phi\Big(\frac{\tilde w-m}{s}\Big)\\ \text{near the kink}\end{gathered}`,
  normalCdf: r$9`\widetilde H_i(\tilde z)=\Phi\Big(\frac{\tilde z-e\tau_i-m}{s}\Big)`,
  lipschitz: r$9`\frac{2\sqrt{\frac{\widetilde h_0^2+\widetilde h_1^2}{2}+MB}-(\widetilde h_0+\widetilde h_1)}{M}\le\Delta`,
  lipschitzUpper: r$9`\Delta\le\frac{(\widetilde h_0+\widetilde h_1)-2\sqrt{\frac{\widetilde h_0^2+\widetilde h_1^2}{2}-MB}}{M}`,
  goffLower: r$9`\begin{gathered}\frac{\widetilde H_0}{\widetilde h_0B}\Big[\widetilde H_1\log\frac{\widetilde H_1}{\widetilde H_0}-B\Big]\\ {}+\frac{1-\widetilde H_1}{\widetilde h_1B}\Big[(1-\widetilde H_0)\log\frac{1-\widetilde H_0}{1-\widetilde H_1}-B\Big]\\ \le\Delta\end{gathered}`,
  goffUpper: r$9`\begin{gathered}\Delta\le\\\frac{1-\widetilde H_0}{\widetilde h_0B}\Big[B-(1-\widetilde H_1)\log\frac{1-\widetilde H_0}{1-\widetilde H_1}\Big]\\ {}+\frac{\widetilde H_1}{\widetilde h_1B}\Big[B-\widetilde H_0\log\frac{\widetilde H_1}{\widetilde H_0}\Big]\end{gathered}`,
  monotone: r$9`\frac{B}{\max\{\widetilde h_0,\widetilde h_1\}}\le\Delta\le\frac{B}{\min\{\widetilde h_0,\widetilde h_1\}}`,
  remainder: r$9`B=${h0$1}\Delta+\frac{1}{2}\widetilde h_0'(\xi)\Delta^2`
};
var r$8 = String.raw;
var dApprox = r$8`\k{dApprox}{\Delta}`;
var mass = r$8`\k{B}{B}`, density0 = r$8`\k{h0}{${h0$1}}`, rateGap = r$8`\k{rateGap}{(\tau_0-\tau_1)}`;
var eq = (l, v, rel = "=") => equation(term$1("left", l), term$1("right", v), rel);
var build = (id) => derive(`nonid-${id}`, {
  maxLines: 2,
  braces: "content",
  roles: {
    H0: "lower",
    H1: "upper",
    h0: "lower",
    h1: "upper",
    B: "buncher",
    dApprox: "approx"
  }
});
var recallIdentity = build("recall").group((b) => b.start(eq(r$8`\widetilde H_0(${A$1}+\Delta)`, H1$2)).copyLine().to(eq(r$8`\widetilde F(${A$1}+\Delta-e\tau_0)`, r$8`\widetilde F(${A$1}-e\tau_1)`))).build();
var massDefinition = build("mass").start(eq("B", `${H1$2}-${H0$2}`)).build();
var recall = chainDerivations("nonid-recall-and-mass", [{
  name: "recallIdentity",
  spec: recallIdentity
}, {
  name: "massDefinition",
  spec: massDefinition
}]).spec;
var leftLinear = build("taylor").group((b) => b.start(eq(r$8`\widetilde F(${A$1}+\Delta-e\tau_0)`, r$8`\widetilde F(${A$1}-e\tau_1)`)).copyLine().to(equation([term$1("H0", r$8`\widetilde F(${A$1}-e\tau_0)`), term$1("slope", r$8`\tilde f(${A$1}-e\tau_0)\,${dApprox}`)], term$1("H1", r$8`\widetilde F(${A$1}-e\tau_1)`), r$8`\approx`))).group((b) => b.substitute({
  H0: H0$2,
  H1: H1$2,
  slope: r$8`${h0$1}\,${dApprox}`
}).moveAcross("H0", { bareLanding: true })).group((b) => b.to(eq(dApprox, r$8`\frac{${H1$2}-${H0$2}}{${h0$1}}`, r$8`\approx`), { path: { right: "under" } }).substitute({ right: r$8`\frac{B}{${h0$1}}` }).mark({ "*": "circumscribe" })).build();
var elasticityFromGap = build("elasticity").group((b) => b.start(eq(dApprox, r$8`\frac{${mass}}{${density0}}`, r$8`\approx`)).substitute({ left: r$8`e${rateGap}` }).to(eq("e", r$8`\frac{${mass}}{${density0}${rateGap}}`, r$8`\approx`), {
  path: { right: "under" },
  phases: [["h0", "rateGap"], ["B"]]
}).mark({ "*": "circumscribe" })).build();
var dens1 = r$8`\k{dens}{${h1$1}}`;
var rightLinear = build("right").group((b) => b.start(eq(r$8`\widetilde H_1(${A$1}-\Delta)`, H0$2)).to(equation([term$1("H1", H1$2), term$1("slope", r$8`${dens1}\,${dApprox}`, "-")], term$1("H0", H0$2), r$8`\approx`)).to(equation([term$1("H1", H1$2), term$1("H0", H0$2, "-")], term$1("slope", r$8`${dens1}\,${dApprox}`), r$8`\approx`), {
  from: { "H0.s": "slope.s" },
  path: {
    slope: "over",
    H0: "under"
  }
}).to(equation(term$1("jump", "B"), term$1("slope", r$8`${dens1}\,${dApprox}`), r$8`\approx`)).to(eq(dApprox, r$8`\frac{\k{jump}{B}}{${dens1}}`, r$8`\approx`), { path: {
  dApprox: "under",
  jump: "over"
} }).mark({ "*": "circumscribe" })).build();
var trapezoid = build("area").group((b) => b.start(eq(r$8`\widetilde H_0(${A$1}+\Delta)`, H1$2)).to(equation(term$1("rise", r$8`\widetilde H_0(${A$1}+\Delta)`), [term$1("B", "B"), term$1("H0", H0$2)])).moveAcross("H0", { bareLanding: true }).to(eq(r$8`\int_{${A$1}}^{${A$1}+\Delta}\widetilde h_0(\tilde z)\,d\tilde z`, "B"))).group((b) => b.to(eq(r$8`\frac{${h0$1}+${h1$1}}{2}\,${dApprox}`, "B", r$8`\approx`)).to(eq(dApprox, r$8`\frac{2B}{${h0$1}+${h1$1}}`, r$8`\approx`), { path: { right: "under" } }).mark({ "*": "circumscribe" }).copyLine().substitute({ left: r$8`e(\tau_0-\tau_1)` }).to(eq("e", r$8`\frac{2B}{\big(${h0$1}+${h1$1}\big)(\tau_0-\tau_1)}`, r$8`\approx`)).mark({ "*": "circumscribe" })).build();
var otherSides = chainDerivations("nonid-other-sides", [{
  name: "rightLinear",
  spec: rightLinear
}, {
  name: "trapezoid",
  spec: trapezoid
}]).spec;
build("local-normal").start(eq(r$8`\widetilde F(\tilde w)`, r$8`\Phi\Big(\frac{\tilde w-m}{s}\Big)\ \text{in a window around the kink}`)).substitute({
  left: r$8`\widetilde H_i(\tilde z)`,
  right: r$8`\Phi\Big(\frac{\tilde z-e\tau_i-m}{s}\Big)`
}).group((b) => b.to(eq(r$8`\Phi^{-1}\big(${H1$2}\big)-\Phi^{-1}\big(${H0$2}\big)`, r$8`\frac{${A$1}-e\tau_1-m}{s}-\frac{${A$1}-e\tau_0-m}{s}`)).to(eq(r$8`\Delta`, r$8`s\Big[\Phi^{-1}\big(${H1$2}\big)-\Phi^{-1}\big(${H0$2}\big)\Big]`))).build();
var shorts$1 = [
  "What we can see",
  "Linear extrapolation",
  "True vs approximate",
  "From Δ to e",
  "Other sides of the gap",
  "The menu",
  "Same data, different e",
  "What the literature assumes",
  "Moving the kink"
];
var titles$1 = [
  "We see the jump, not the gap",
  "Approximate the gap by linear extrapolation",
  "Exact only if the density is flat across the gap",
  "From the bunching mass to an elasticity",
  "From the other side, the answer changes",
  "Every estimator is an assumption about what we can't see",
  "Two economies, the same data, different elasticities",
  "What the literature assumes",
  "Is there anything we can get nonparametrically?"
];
var bodies$2 = [
  "Rank matching makes Δ the horizontal gap between the counterfactual CDFs. The data show only the vertical gap B.",
  "The tangent replaces the unseen CDF locally. There is no small-remainder guarantee for a large kink.",
  jsxs(Fragment$1, { children: [
    jsx(InlineMath, { tex: TEX.remainder }),
    " for some ξ in the gap. So the orange point minus the true one is ",
    jsx(InlineMath, { tex: String.raw`\frac{\widetilde h_0'(\xi)\Delta^2}{2\widetilde h_0(\log z^\star)}` }),
    ". If the density rises across the gap, the orange point lies right of the true one; if it falls, left. There is no small-remainder guarantee for a large kink."
  ] }),
  jsxs(Fragment$1, { children: [
    "The log net-of-tax rate gap is ",
    jsx(InlineMath, { tex: String.raw`\tau_0-\tau_1=\log\frac{1-t_0}{1-t_1}>0` }),
    ". The jump, endpoint density and rates are observed."
  ] }),
  jsx(Fragment$1, { children: "The right endpoint of the missing density equals the observed upper-branch density. The trapezoid is exact when the density is affine in log income. Its answer is the harmonic mean of the one-sided answers. To see Saez’s level formula, select Trapezoid in log income." }),
  "Every rule adds a shape, family or bound across the unseen gap. Open an assumption to see its construction. Next and Back clear it.",
  "Both economies match the solid branches and jump exactly. The second has half the elasticity and a positive smooth density with the same endpoint densities and total mass.",
  jsx(Fragment$1, { children: "Several kinks, budget-set variation or covariates can add information." }),
  "Frictions blur the jump. Chapter 4 shows that B can still be recovered (Cattaneo, Jansson, Ma and Slemrod)."
];
var derivations$2 = [
  recall,
  leftLinear,
  void 0,
  elasticityFromGap,
  otherSides
];
var references = jsxs("span", {
  className: "ni-references",
  children: [jsx("span", {
    className: "ni-references-head",
    children: "Sources of the rules:"
  }), [
    {
      who: "Saez, E. (2010).",
      title: "“Do Taxpayers Bunch at Kink Points?”",
      venue: "American Economic Journal: Economic Policy",
      rest: " 2(3), 180–212."
    },
    {
      who: "Bertanha, M., A. H. McCallum and N. Seegert (2023).",
      title: "“Better Bunching, Nicer Notching.”",
      venue: "Journal of Econometrics",
      rest: " 237(2), 105512."
    },
    {
      who: "Aronsson, T., K. Jenderny and G. Lanot (2024).",
      title: "“A maximum likelihood bunching estimator of the elasticity of taxable income.”",
      venue: "Journal of Applied Econometrics",
      rest: " 39(1), 200–216."
    },
    {
      who: "Goff, L. (2021).",
      title: "“Treatment Effects in Bunching Designs: The Impact of the Federal Overtime Rule on Hours.”",
      venue: "",
      rest: "Working paper, Columbia University. Current version: “Partial Identification from Bunching at Kinks and Notches,” arXiv 2205.10310."
    },
    {
      who: "Blomquist, S., W. Newey, A. Kumar and C.-Y. Liang (2021).",
      title: "“On Bunching and Identification of the Taxable Income Elasticity.”",
      venue: "Journal of Political Economy",
      rest: " 129(8), 2320–2343."
    }
  ].map((r3) => jsxs("span", { children: [
    " ",
    r3.who,
    " ",
    r3.title,
    " ",
    r3.venue && jsx("em", { children: r3.venue }),
    r3.rest
  ] }, r3.who))]
});
var STAGES$3 = titles$1.map((title2, i) => ({
  eyebrow: shorts$1[i],
  short: shorts$1[i],
  title: title2,
  body: i === 7 ? jsxs(Fragment$1, { children: [
    bodies$2[i],
    " ",
    references
  ] }) : bodies$2[i],
  prompt: "",
  figureTitle: shorts$1[i],
  derivation: derivations$2[i]
}));
var LENSES = [
  {
    id: "left",
    group: "point",
    label: "Left-linear",
    cite: "Saez (2010)",
    source: "Saez (2010) treats the density as flat across a small bunching segment, so the bunching mass is the density at the kink times the segment's width.",
    text: "Assume the density just below z⋆ holds across the gap, so H̃₀ follows its tangent. Exact when that density is constant there.",
    math: [TEX.left, TEX.elasticity],
    citation: "Saez, equation (1); the left-linear rule."
  },
  {
    id: "right",
    group: "point",
    label: "Right-linear",
    cite: "mirror of Saez (2010)",
    source: "No paper states this rule as its own; it mirrors Saez (2010) from the other side of z⋆.",
    text: "Assume the density just above z⋆ holds across the gap, so H̃₁ follows its tangent back. Exact when that density is constant there.",
    math: [TEX.right, String.raw`e\approx\frac{B}{\widetilde h_1(\log z^\star)(\tau_0-\tau_1)}`],
    citation: "The mirror of the left-linear rule."
  },
  {
    id: "trapezoid",
    group: "point",
    label: "Trapezoid in log income",
    cite: "after Saez (2010)",
    source: "Saez (2010) assumes the density moves in a straight line across the bunching segment, in income levels; this rule does the same in logs. His rule, in levels:",
    text: "Assume the density moves in a straight line across the gap. Then B is a trapezoid's area. The answer is the harmonic mean of the left and right ones.",
    math: [
      TEX.trapezoid,
      TEX.saez,
      TEX.saezRoot
    ],
    note: "The two agree for small kinks and part on large ones.",
    citation: "Saez, equations (3)–(5) (levels); also in Bertanha, McCallum and Seegert (2023)."
  },
  {
    id: "normal",
    group: "point",
    label: "Local normal",
    cite: "Bertanha et al. (2023)",
    source: "Bertanha, McCallum and Seegert (2023) assume log potential income is normal, at least in a window around the kink, and estimate e by maximum likelihood. Aronsson, Jenderny and Lanot (2024) also use maximum likelihood with normal types, truncated on either side of the kink, and add a normal error to observed income (Chapter 4).",
    text: "Under the normal assumption, the two observed pieces pin one curve twice, shifted by Δ. The answer moves with the window, so check it across windows.",
    math: [
      TEX.normalLaw,
      TEX.normalCdf,
      TEX.normal
    ],
    note: "The inverse-rank identity holds under an exact fit. The mark uses a censored-normal (Tobit) fit. The drawn shapes share a rank rescaling to meet the observed jump heights; their horizontal shift is the fitted gap.",
    citation: "Bertanha, McCallum and Seegert (2023)."
  },
  {
    id: "lipschitz",
    group: "partial",
    label: "Lipschitz density",
    cite: "Bertanha et al. (2023)",
    source: "Bertanha, McCallum and Seegert (2023) assume only that the density of log potential income has a bounded slope, at most M in absolute value.",
    text: "A density that rises then falls packs B into a short gap; one that falls then rises needs a longer gap. Everything between is possible.",
    math: [
      String.raw`|\widetilde h_0'|\le M`,
      TEX.lipschitz,
      TEX.lipschitzUpper
    ],
    note: "The set is empty below the admissible slope cap. When the density reaches zero, there is no finite upper bound.",
    citation: "Bertanha, McCallum and Seegert (2023)."
  },
  {
    id: "goff",
    group: "partial",
    label: "Bi-log-concavity",
    cite: "Goff (2021)",
    source: "Goff (2021) assumes the distribution is bi-log-concave: log F̃ and log(1−F̃) are both concave. Here that is imposed in log income.",
    text: "Each CDF can then bend only so fast beyond where we see it. The left-linear rule is one admissible path.",
    math: [TEX.goffLower, TEX.goffUpper],
    note: "With one shared e the bound can be tightened rank by rank. That tightening is ours, not Goff's.",
    citation: "Goff, Theorem 1 (averaged bounds)."
  },
  {
    id: "monotone",
    group: "partial",
    label: "Monotone density across the gap",
    cite: "after Blomquist et al. (2021)",
    source: "Blomquist, Newey, Kumar and Liang (2021) bound the density across the bunching segment by multiples of its values at the two ends; a monotone density meets their condition with both multiples equal to one.",
    text: "If the density only rises or only falls across the gap, Δ lies between the left and right answers. This is a log-income version of their bound, which they state for the level density.",
    math: [TEX.monotone],
    citation: "Blomquist, Newey, Kumar and Liang (2021), with both density ratios equal to unity."
  }
];
function Menu({ step }) {
  const snapshot2 = useSyncExternalStore(subscribe$1, getSnapshot$1, getServerSnapshot$1);
  const state = stateForStep(snapshot2, step);
  if (!(step === 10 || step === 11 || step === 16 || step === 17) || snapshot2.step !== step) return null;
  if (state.lens) return jsxs("span", {
    className: "ni-menu ni-menu-open",
    children: [jsx("button", {
      type: "button",
      onClick: () => dispatch({
        type: "lens",
        lens: null
      }),
      children: "← all assumptions"
    }), jsx("strong", { children: LENSES.find((l) => l.id === state.lens).label })]
  });
  return jsx("span", {
    className: "ni-menu",
    "aria-label": "Identifying assumptions",
    children: ["point", "partial"].map((group) => (group === "point" || step >= 11) && jsxs("span", {
      className: "ni-menu-group",
      children: [jsx("strong", { children: group === "point" ? "Point identification" : "Partial identification" }), jsx("span", {
        className: "ni-menu-buttons",
        children: LENSES.filter((l) => l.group === group).map((l) => jsxs("button", {
          type: "button",
          disabled: !state.ready,
          "aria-pressed": state.lens === l.id,
          onClick: () => dispatch({
            type: "lens",
            lens: l.id
          }),
          children: [
            jsx("span", {
              className: "ni-menu-label",
              children: l.label
            }),
            " ",
            jsx("span", {
              className: "ni-menu-cite",
              children: l.cite
            })
          ]
        }, l.id))
      })]
    }, group))
  });
}
function Narration({ step }) {
  const state = stateForStep(useSyncExternalStore(subscribe$1, getSnapshot$1, getServerSnapshot$1), step);
  const lens = state.lens && LENSES.find((l) => l.id === state.lens);
  return jsxs("span", {
    className: "ni-narration",
    children: [jsx(Menu, { step }), jsx("span", {
      className: "ni-main-copy",
      children: lens ? jsx(Assumption, { lens }, `${step}-${lens.id}`) : jsx(MathCopy, { text: PRESSES$2[step].text })
    })]
  });
}
var SYMBOLS = {
  "log z⋆+Δ": String.raw`\log z^\star+\Delta`,
  "Δ = e(τ₀−τ₁)": String.raw`\Delta = e(\tau_0-\tau_1)`,
  "z⋆": String.raw`z^\star`,
  "H̃₀": String.raw`\widetilde H_0`,
  "H̃₁": String.raw`\widetilde H_1`,
  "F̃": String.raw`\widetilde F`,
  "Δ": String.raw`\Delta`,
  "h̃₀": String.raw`\widetilde h_0`,
  "τ₀": String.raw`\tau_0`,
  "τ₁": String.raw`\tau_1`,
  "B": "B",
  "e": "e"
};
function MathCopy({ text }) {
  return jsx(Fragment$1, { children: text.split(/((?:log z⋆\+Δ|Δ = e\(τ₀−τ₁\)|z⋆|H̃₀|H̃₁|F̃|h̃₀|τ₀|τ₁|Δ|(?<![\p{L}])[Be](?![\p{L}]))[,.;:!?)]*)/gu).map((part, i) => {
    const trail = /[,.;:!?)]*$/.exec(part)?.[0] ?? "";
    let cut = 0;
    while (cut < trail.length && !SYMBOLS[part.slice(0, part.length - cut)]) cut++;
    const punctuation = part.slice(part.length - cut), symbol = part.slice(0, part.length - cut);
    return SYMBOLS[symbol] ? jsxs("span", {
      className: "ni-math-word",
      children: [jsx(InlineMath, { tex: SYMBOLS[symbol] }), punctuation]
    }, i) : part;
  }) });
}
var assumptionPages = (lens) => {
  const page = (text, math, note) => ({
    text,
    math,
    note
  });
  const lead = `${lens.source} ${lens.text}`;
  if (lens.id === "trapezoid") return [page(lens.source, lens.math.slice(1), lens.note), page(lens.text, lens.math.slice(0, 1), lens.citation)];
  if (lens.id === "normal") return [page(lead, lens.math.slice(0, 2)), page("The gap follows from inverse ranks under an exact fit.", lens.math.slice(2), `${lens.note} ${lens.citation}`)];
  if (lens.id === "goff") return [page(lead, lens.math.slice(0, 1)), page("The corresponding upper bound:", lens.math.slice(1), `${lens.note} ${lens.citation}`)];
  if (lens.id === "lipschitz") return [page(lead, lens.math.slice(0, 2)), page("The corresponding upper bound:", lens.math.slice(2), `${lens.note} ${lens.citation}`)];
  return [page(lead, lens.math, lens.citation)];
};
function AssumptionPage({ lens, index, onPage }) {
  const pages = assumptionPages(lens), page = pages[index];
  return jsxs("span", {
    className: "ni-lens-copy",
    role: "region",
    "aria-label": `${lens.label} assumption`,
    children: [
      pages.length > 1 && jsxs("span", {
        className: "ni-page-nav",
        children: [
          jsx("button", {
            type: "button",
            disabled: index === 0,
            onClick: () => onPage(index - 1),
            children: "← previous"
          }),
          jsxs("span", { children: [
            index + 1,
            " / ",
            pages.length
          ] }),
          jsx("button", {
            type: "button",
            disabled: index === pages.length - 1,
            onClick: () => onPage(index + 1),
            children: "next →"
          })
        ]
      }),
      jsx("span", { children: jsx(MathCopy, { text: page.text }) }),
      jsxs("span", {
        className: "ni-evaluation-note",
        children: [
          "Densities and CDF heights below are evaluated at ",
          jsx(InlineMath, { tex: String.raw`\log z^\star` }),
          "."
        ]
      }),
      page.math.map((tex) => jsx("span", {
        className: "ni-lens-math",
        children: jsx(InlineMath, { tex: String.raw`\displaystyle ` + tex })
      }, tex)),
      page.note && jsx("span", {
        className: "ni-page-note",
        children: jsx(MathCopy, { text: page.note })
      }),
      jsxs("span", {
        className: "ni-conversion",
        children: [
          "For elasticity, divide the gap by ",
          jsx(InlineMath, { tex: String.raw`\tau_0-\tau_1` }),
          "."
        ]
      })
    ]
  });
}
function Assumption({ lens }) {
  const [index, onPage] = useState(0);
  return jsx(AssumptionPage, {
    lens,
    index,
    onPage
  });
}
var nonidentificationChapter = {
  id: 2,
  slug: "02-nonidentification",
  part: "I",
  title: "Identifying an elasticity",
  label: "Identifying an elasticity",
  steps: PRESSES$2.map((p, i) => ({
    key: p.key,
    stage: p.stage,
    narration: jsx(Narration, { step: i }),
    derivationAt: "derivationAt" in p ? p.derivationAt : null
  })),
  stages: STAGES$3,
  Figure: NonidentificationFigure,
  viewBox: VIEWBOX$3,
  initialParameters: CH1_DEFAULTS,
  defaults: CH1_DEFAULTS
};
var BETA_LAW = {
  lo: 31,
  hi: 291,
  a: 2,
  b: 3
};
function betaLaw(parameters, law = BETA_LAW) {
  const { t0: t02, t1: t12, zStar: k2, e: e2 } = parameters;
  const { lo, hi, b } = law;
  const span = hi - lo;
  const q0 = 1 - t02;
  const q1 = 1 - t12;
  const s0 = q0 ** e2;
  const s1 = q1 ** e2;
  const unit = (w) => Math.max(0, Math.min(1, (w - lo) / span));
  const F = (w) => {
    const u = unit(w);
    return 1 - (1 - u) ** b * (1 + b * u);
  };
  const f = (w) => {
    if (w <= lo || w >= hi) return 0;
    const u = (w - lo) / span;
    return b * (b + 1) * u * (1 - u) ** (b - 1) / span;
  };
  const Finv = (p) => {
    if (p <= 0) return lo;
    if (p >= 1) return hi;
    let a0 = lo, a1 = hi;
    for (let i = 0; i < 64; i += 1) {
      const mid = (a0 + a1) / 2;
      if (F(mid) < p) a0 = mid;
      else a1 = mid;
    }
    return (a0 + a1) / 2;
  };
  const H02 = (z) => F(z / s0);
  const H12 = (z) => F(z / s1);
  const density02 = (z) => f(z / s0) / s0;
  const density1 = (z) => f(z / s1) / s1;
  const quantile2 = (branch, p) => Finv(p) * (branch === 0 ? s0 : s1);
  const below = H02(k2);
  const top = H12(k2);
  return {
    q0,
    q1,
    s0,
    s1,
    k: k2,
    e: e2,
    lo,
    hi,
    F,
    f,
    Finv,
    H0: H02,
    H1: H12,
    density0: density02,
    density1,
    quantile: quantile2,
    below,
    top,
    B: top - below,
    ranks: (n) => Array.from({ length: n }, (_, i) => Finv((i + 0.5) / n))
  };
}
var PARAMETERS = CH1_DEFAULTS;
var LAW$1 = betaLaw(PARAMETERS, BETA_LAW);
var Z_SMALL = 97.4;
var { H0: H0$1, H1: H1$1 } = LAW$1;
var Z_STAR = PARAMETERS.zStar;
var T0$1 = PARAMETERS.t0;
var T1$1 = PARAMETERS.t1;
var quantile = (branch, p) => LAW$1.quantile(branch, p);
LAW$1.hi * Math.max(LAW$1.s0, LAW$1.s1);
var Z_TOP1 = LAW$1.hi * LAW$1.s1;
function choice(w, k2) {
  const z0 = w * LAW$1.s0;
  const z1 = w * LAW$1.s1;
  if (z0 <= k2) return {
    z: z0,
    region: "lower",
    mc: 1 - T0$1,
    z0,
    z1
  };
  if (z1 >= k2) return {
    z: z1,
    region: "upper",
    mc: 1 - T1$1,
    z0,
    z1
  };
  return {
    z: k2,
    region: "buncher",
    mc: Math.pow(k2 / w, 1 / PARAMETERS.e),
    z0,
    z1
  };
}
var HEIGHTS = {
  below: H0$1(Z_STAR),
  top: H1$1(Z_STAR),
  B: H1$1(Z_STAR) - H0$1(Z_STAR),
  above: 1 - H1$1(Z_STAR)
};
var PEOPLE = LAW$1.ranks(64);
function dots(zPrime = 85) {
  return PEOPLE.map((w, index) => {
    const before = choice(w, Z_STAR);
    const after = choice(w, zPrime);
    let group;
    if (before.region === "lower" && after.region === "lower") group = "stayLower";
    else if (before.region === "upper") group = "stayUpper";
    else if (before.region === "lower") group = "newBuncher";
    else if (after.region === "buncher") group = "follower";
    else group = "formerBuncher";
    return {
      index,
      w,
      before,
      after,
      group
    };
  });
}
var SUFFICIENT_STATISTIC_DEFAULTS = PARAMETERS;
var P$1 = CDF_PLOT;
var SCALE = 1.08;
var r2 = (value) => Math.round(value * 100) / 100;
var x = (z) => r2(P$1.left + z / 196 * (P$1.right - P$1.left));
var y = (p) => r2(P$1.bottom - p / SCALE * (P$1.bottom - P$1.top));
var Y_ONE = y(1);
var N$2 = 120;
function curve$2(fn2, a2, b, n = N$2) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const z = a2 + (b - a2) * i / n;
    return `${i ? "L" : "M"}${x(z)},${y(fn2(z))}`;
  }).join(" ");
}
function band(upper, lower, a2, b, n = N$2) {
  const top = Array.from({ length: n + 1 }, (_, i) => {
    const z = a2 + (b - a2) * i / n;
    return `${i ? "L" : "M"}${x(z)},${y(upper(z))}`;
  });
  const bottom = Array.from({ length: n + 1 }, (_, i) => {
    const z = b - (b - a2) * i / n;
    return `L${x(z)},${y(lower(z))}`;
  });
  return `${top.join(" ")} ${bottom.join(" ")} Z`;
}
var one$1 = () => 1;
function cdfAt(k2) {
  return {
    h0Solid: curve$2(H0$1, 0, k2),
    h0Dashed: curve$2(H0$1, k2, 196),
    h1Dashed: curve$2(H1$1, 0, k2),
    h1Solid: curve$2(H1$1, k2, 196),
    jump: `M${x(k2)},${y(H0$1(k2))} L${x(k2)},${y(H1$1(k2))}`,
    lower: band(one$1, H0$1, 0, k2),
    upper: band(one$1, H1$1, k2, 196)
  };
}
function shapesAt(k2) {
  return {
    mechanical: band(one$1, H1$1, k2, Z_STAR, 40),
    behavioral: band(H1$1, H0$1, k2, Z_STAR, 40)
  };
}
y(H0$1(Z_STAR)), y(H1$1(Z_STAR));
function arrows(zPrime = 85) {
  const p0 = H0$1(zPrime), p1 = H0$1(Z_STAR), p2 = H1$1(zPrime), p3 = H1$1(Z_STAR);
  const within = (lo, hi, n) => Array.from({ length: n }, (_, i) => lo + (hi - lo) * (i + 0.5) / n);
  const count = (lo, hi) => Math.max(1, Math.min(4, Math.floor((y(lo) - y(hi)) / 18)));
  const clamp = (lo, hi) => (v) => Math.min(hi, Math.max(lo, v));
  return {
    newBunchers: within(p0, p1, count(p0, p1)).map((p) => ({
      p,
      from: quantile(0, p),
      to: zPrime
    })),
    followers: within(p1, p2, count(p1, p2)).map((p) => ({
      p,
      from: Z_STAR,
      to: zPrime
    })),
    formerBunchers: within(p2, p3, count(p2, p3)).map((p) => ({
      p,
      from: Z_STAR,
      to: quantile(1, p)
    })),
    edges: [p1, p2].map((p) => `M${x(zPrime)},${y(p)} L${x(Z_STAR)},${y(p)}`).join(" "),
    bands: {
      newBunchers: band(() => p1, (z) => clamp(p0, p1)(H0$1(z)), zPrime, Z_STAR, 40),
      followers: `M${x(zPrime)},${y(p2)} L${x(Z_STAR)},${y(p2)} L${x(Z_STAR)},${y(p1)} L${x(zPrime)},${y(p1)} Z`,
      formerBunchers: band((z) => clamp(p2, p3)(H1$1(z)), () => p2, zPrime, Z_STAR, 40)
    }
  };
}
var MB = {
  lower: 1 - T0$1,
  upper: 1 - T1$1
};
var mbStep = (k2) => `M${x(0)},${y(MB.lower)} L${x(k2)},${y(MB.lower)} L${x(k2)},${y(MB.upper)} L${x(196)},${y(MB.upper)}`;
function choiceRegions(k2) {
  const wA = k2 / Math.pow(MB.lower, LAW$1.e);
  const wB = k2 / Math.pow(MB.upper, LAW$1.e);
  const mc = (w) => (z) => Math.min(1.08, Math.pow(z / w, 1 / LAW$1.e));
  const top = () => 1.08;
  const floor = () => 0;
  return {
    lower: band(top, mc(wA), 0, 196, 80),
    buncher: band(mc(wA), mc(wB), 0, 196, 80),
    upper: band(mc(wB), floor, 0, 196, 80)
  };
}
var PANELS = {
  liability: {
    left: 110,
    right: 430,
    top: 190,
    bottom: 540
  },
  rate: {
    left: 520,
    right: 840,
    top: 190,
    bottom: 540
  }
};
var S_MAX = 245;
var T_MAX = 120;
var sx = (panel, z) => r2(PANELS[panel].left + z / S_MAX * (PANELS[panel].right - PANELS[panel].left));
var ly = (t) => r2(PANELS.liability.bottom - t / T_MAX * (PANELS.liability.bottom - PANELS.liability.top));
var ry = (rate) => r2(PANELS.rate.bottom - rate / 1 * (PANELS.rate.bottom - PANELS.rate.top));
var liabilityLower = (k2) => `M${sx("liability", 0)},${ly(0)} L${sx("liability", k2)},${ly(T0$1 * k2)}`;
var liabilityUpper = (k2, t12) => `M${sx("liability", k2)},${ly(T0$1 * k2)} L${sx("liability", S_MAX)},${ly(T0$1 * k2 + t12 * (S_MAX - k2))}`;
var rateLower = (k2) => `M${sx("rate", 0)},${ry(T0$1)} L${sx("rate", k2)},${ry(T0$1)}`;
var rateUpper = (k2, t12) => `M${sx("rate", k2)},${ry(t12)} L${sx("rate", S_MAX)},${ry(t12)}`;
var SCHEDULE = {
  k: Z_STAR,
  t1: T1$1,
  kReform: 70,
  t1Reform: 0.8,
  sMax: S_MAX
};
var one = () => 1;
function outlinePoints(region) {
  const zs = Array.from({ length: 61 }, (_, i) => region.a + (region.b - region.a) * i / 60);
  const ps = zs.flatMap((z) => [region.top(z), region.bottom(z)]);
  const lo = Math.min(...ps), hi = Math.max(...ps);
  const X2 = (z) => (z - region.a) / (region.b - region.a || 1) * 100;
  const Y = (p) => (hi - p) / (hi - lo || 1) * 100;
  return [...zs.map((z) => [X2(z), Y(region.top(z))]), ...[...zs].reverse().map((z) => [X2(z), Y(region.bottom(z))])];
}
var barPoints = () => [...Array.from({ length: 61 }, (_, i) => [100 * i / 60, 0]), ...Array.from({ length: 61 }, (_, i) => [100 * (60 - i) / 60, 100])];
var pathOf = (pts) => pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(2)} ${py.toFixed(2)}`).join(" ") + " Z";
function edgeOf(pts, side) {
  return (side === "top" ? pts.slice(0, 61) : pts.slice(61).reverse()).map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(2)} ${py.toFixed(2)}`).join(" ");
}
function extent(region) {
  const ps = Array.from({ length: 61 }, (_, i) => region.a + (region.b - region.a) * i / 60).flatMap((z) => [region.top(z), region.bottom(z)]);
  return {
    lo: Math.min(...ps),
    hi: Math.max(...ps)
  };
}
var lowerArea = (k2) => ({
  top: one,
  bottom: H0$1,
  a: 0,
  b: k2
});
var upperArea = (k2) => ({
  top: one,
  bottom: H1$1,
  a: k2,
  b: Math.min(196, Z_TOP1)
});
var mechanical = (k2) => ({
  top: one,
  bottom: H1$1,
  a: k2,
  b: Z_STAR
});
var behavioral = (k2) => ({
  top: H1$1,
  bottom: H0$1,
  a: k2,
  b: Z_STAR
});
var tealStrip = (k2) => ({
  top: one,
  bottom: H0$1,
  a: k2,
  b: Z_STAR
});
var GLYPHS = {
  L: {
    w: 0.95,
    h: 1.45,
    color: "lower",
    region: lowerArea(Z_STAR)
  },
  U: {
    w: 1.5,
    h: 0.95,
    color: "upper",
    region: upperArea(Z_STAR)
  },
  L2: {
    w: 0.78,
    h: 1.45,
    color: "lower",
    region: lowerArea(85)
  },
  U2: {
    w: 1.75,
    h: 1.15,
    color: "upper",
    region: upperArea(85)
  },
  S: {
    w: 1.35,
    h: 1.45,
    color: "lower",
    region: tealStrip(85)
  },
  M: {
    w: 1.35,
    h: 1.25,
    color: "upper",
    region: mechanical(85)
  },
  Bh: {
    w: 1.35,
    h: 0.96,
    color: "buncher",
    region: behavioral(85)
  },
  Md: {
    w: 1.35,
    h: 1.25,
    color: "upper",
    region: mechanical(85),
    dashed: "bottom"
  },
  Bhd: {
    w: 1.35,
    h: 0.96,
    color: "buncher",
    region: behavioral(85),
    dashed: "top"
  },
  m: {
    w: 0.2,
    h: 1.5,
    color: "upper",
    region: mechanical(Z_SMALL)
  },
  b: {
    w: 0.2,
    h: 1.17,
    color: "buncher",
    region: behavioral(Z_SMALL)
  },
  mH: {
    w: 1.5,
    h: 0.2,
    color: "upper"
  },
  bH: {
    w: 1.17,
    h: 0.2,
    color: "buncher"
  }
};
var glyphPoints = (name) => {
  const g = GLYPHS[name];
  return g.region ? outlinePoints(g.region) : barPoints();
};
function glyph(name) {
  const g = GLYPHS[name];
  return String.raw`\,\vcenter{\htmlData{ssg=${name}}{\rule{${g.w}em}{${g.h}em}}}\,`;
}
var svg = (body) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='-2 -2 104 104' preserveAspectRatio='none'>${body}</svg>`)}")`;
function glyphCss() {
  const rules2 = [`[data-ssg] > .katex-rule{border-color:transparent!important;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;}`];
  for (const [name, g] of Object.entries(GLYPHS)) {
    const sel = `[data-ssg="${name}"] > .katex-rule`;
    let mask;
    let edge = "";
    if (g.region) {
      const pts = outlinePoints(g.region);
      mask = svg(`<path d='${pathOf(pts)}' fill='black' fill-opacity='${g.dashed ? 0.5 : 1}'/>`);
      if (g.dashed) edge = svg(`<path d='${edgeOf(pts, g.dashed)}' fill='none' stroke='black' stroke-width='8' stroke-dasharray='15 11'/>`);
    } else mask = svg(`<rect x='0' y='0' width='100' height='100' fill='black'/>`);
    const layers = g.dashed ? `${edge},${mask}` : mask;
    rules2.push(`${sel}{background-color:var(--${g.color});-webkit-mask-image:${layers};mask-image:${layers};}`);
  }
  return rules2.join("\n");
}
var FIGURE_CLOCK = {
  ms: 900,
  ease: [
    0.33,
    1,
    0.68,
    1
  ]
};
var FADE_CLOCK = {
  ms: 520,
  ease: [
    0.25,
    0.1,
    0.25,
    1
  ]
};
var TURN_CLOCK = {
  ms: 900,
  ease: [
    0.65,
    0,
    0.35,
    1
  ]
};
var MORPHS = {
  redraw: [{
    key: "gLP",
    fromKey: "gL",
    from: "L",
    to: "L2",
    clock: FIGURE_CLOCK
  }, {
    key: "gUP",
    fromKey: "gU",
    from: "U",
    to: "U2",
    clock: FIGURE_CLOCK
  }],
  cancel: [{
    key: "gUP",
    from: "U2",
    to: "M",
    clock: "track"
  }, {
    key: "gLS",
    from: "L",
    to: "S",
    clock: "track"
  }],
  lift: [{
    key: "gMs",
    fromKey: "gLS",
    from: "S",
    to: "M",
    kind: "split",
    clock: "track"
  }, {
    key: "gBh",
    fromKey: "gLS",
    from: "S",
    to: "Bh",
    kind: "split",
    clock: "track"
  }],
  hiddenH1: [{
    key: "gM",
    from: "M",
    to: "Md",
    clock: FADE_CLOCK
  }, {
    key: "gBh",
    from: "Bh",
    to: "Bhd",
    clock: FADE_CLOCK
  }],
  thin: [{
    key: "gM",
    from: "Md",
    to: "m",
    clock: FIGURE_CLOCK
  }, {
    key: "gBh",
    from: "Bhd",
    to: "b",
    clock: FIGURE_CLOCK
  }],
  bars: [{
    key: "gM",
    from: "m",
    to: "mH",
    kind: "rotate",
    clock: TURN_CLOCK
  }, {
    key: "gBh",
    from: "b",
    to: "bH",
    kind: "rotate",
    clock: TURN_CLOCK
  }]
};
var token = (job) => `${job.key}-${job.to}`;
function morphCss() {
  const seen = new Set();
  const rules2 = [];
  for (const jobs of Object.values(MORPHS)) for (const job of jobs) {
    const t = token(job);
    if (seen.has(t)) continue;
    seen.add(t);
    rules2.push(`html[data-ss-morph~="${t}"] [data-term="${job.key}"] [data-ssg="${job.to}"] > .katex-rule{visibility:hidden!important}`);
  }
  rules2.push(`.ss-morph{position:fixed;z-index:60;pointer-events:none;transform-origin:50% 50%}.ss-morph svg{display:block;width:100%;height:100%;overflow:hidden}`);
  return rules2.join("\n");
}
var lerp$6 = (a2, b, t) => a2 + (b - a2) * t;
var clamp01$6 = (t) => Math.min(1, Math.max(0, t));
function bezier([x1, y1, x2, y2]) {
  const bz = (t, p1, p2) => 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t;
  return (u) => {
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    let lo = 0, hi = 1;
    for (let i = 0; i < 28; i += 1) {
      const mid = (lo + hi) / 2;
      if (bz(mid, x1, x2) < u) lo = mid;
      else hi = mid;
    }
    return bz((lo + hi) / 2, y1, y2);
  };
}
function outlineAt(from, to, p) {
  const a2 = GLYPHS[from].region, b = GLYPHS[to].region;
  if (a2 && b && a2.top === b.top && a2.bottom === b.bottom) return outlinePoints({
    top: a2.top,
    bottom: a2.bottom,
    a: lerp$6(a2.a, b.a, p),
    b: lerp$6(a2.b, b.b, p)
  });
  const pa = glyphPoints(from), pb = glyphPoints(to);
  return pa.map(([x2, y2], i) => [lerp$6(x2, pb[i][0], p), lerp$6(y2, pb[i][1], p)]);
}
var turned = (pts) => pts.map(([x2, y2]) => [y2, 100 - x2]);
function turnOutlineAt(from, p) {
  const a2 = turned(glyphPoints(from)), b = turned(barPoints());
  return a2.map(([x2, y2], i) => [lerp$6(x2, b[i][0], p), lerp$6(y2, b[i][1], p)]);
}
function pieceBand(parent, piece) {
  const P2 = extent(GLYPHS[parent].region), Q = extent(GLYPHS[piece].region);
  const span = P2.hi - P2.lo || 1;
  return {
    y0: (P2.hi - Q.hi) / span,
    y1: (P2.hi - Q.lo) / span
  };
}
var boxOf = (el) => {
  const r3 = el.getBoundingClientRect();
  return {
    x: r3.left,
    y: r3.top,
    w: r3.width,
    h: r3.height
  };
};
var lerpBox = (a2, b, t) => ({
  x: lerp$6(a2.x, b.x, t),
  y: lerp$6(a2.y, b.y, t),
  w: lerp$6(a2.w, b.w, t),
  h: lerp$6(a2.h, b.h, t)
});
var rules = (key, glyph2) => [...document.querySelectorAll(`.derivation-slot [data-term="${key}"] [data-ssg="${glyph2}"] > .katex-rule`)].filter((el) => el.getBoundingClientRect().width > 0);
var target = (job) => rules(job.key, job.to).filter((el) => !el.closest(".dv-clone")).at(-1) ?? null;
var source = (job) => {
  const all = rules(job.fromKey ?? job.key, job.from);
  return all.find((el) => !el.closest(".dv-clone")) ?? all[0] ?? null;
};
function travelling(job) {
  for (const rule of rules(job.key, job.to)) {
    const wrapper = rule.closest(".dv-clone");
    if (!wrapper) continue;
    const anim = wrapper.getAnimations().find((a2) => {
      return (a2.effect?.getKeyframes?.() ?? []).some((k2) => "transform" in k2);
    });
    if (anim) return {
      rule,
      wrapper,
      anim
    };
  }
  return null;
}
function readColors() {
  const cs = getComputedStyle(document.documentElement);
  const rgb = (name) => {
    const v = cs.getPropertyValue(name).trim();
    const m = /^#?([0-9a-f]{6})$/i.exec(v);
    if (!m) return [
      27,
      39,
      66
    ];
    const n = parseInt(m[1], 16);
    return [
      n >> 16 & 255,
      n >> 8 & 255,
      n & 255
    ];
  };
  return {
    lower: rgb("--lower"),
    upper: rgb("--upper"),
    buncher: rgb("--buncher")
  };
}
function makeOverlay() {
  const holder = document.createElement("div");
  holder.className = "ss-morph";
  holder.setAttribute("aria-hidden", "true");
  const ns = "http://www.w3.org/2000/svg";
  const svg2 = document.createElementNS(ns, "svg");
  svg2.setAttribute("viewBox", "-2 -2 104 104");
  svg2.setAttribute("preserveAspectRatio", "none");
  const fill2 = document.createElementNS(ns, "path");
  const edge = document.createElementNS(ns, "path");
  edge.setAttribute("fill", "none");
  edge.setAttribute("stroke-width", "8");
  edge.setAttribute("stroke-dasharray", "15 11");
  svg2.append(fill2, edge);
  holder.appendChild(svg2);
  document.body.appendChild(holder);
  return {
    holder,
    fill: fill2,
    edge
  };
}
function playMorphs(key) {
  const jobs = MORPHS[key];
  if (!jobs?.length) return () => {
  };
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return () => {
  };
  const root = document.documentElement;
  const colors = readColors();
  const hidden = new Set();
  const sync = () => {
    if (hidden.size) root.dataset.ssMorph = [...hidden].join(" ");
    else delete root.dataset.ssMorph;
  };
  const runs = jobs.map((job) => ({
    job,
    overlay: null,
    start: null,
    O: null,
    track: null,
    O0: null,
    done: false,
    shown: false
  }));
  for (const run of runs) if (run.job.clock !== "track") hidden.add(token(run.job));
  sync();
  const clock = () => Number(document.timeline?.currentTime ?? performance.now());
  const born = clock();
  let frame = 0;
  const paint = (run, box, p, rotate = 0) => {
    const { job } = run;
    const A2 = GLYPHS[job.from], B2 = GLYPHS[job.to];
    if (!run.overlay) run.overlay = makeOverlay();
    const { holder, fill: fill2, edge } = run.overlay;
    let pts;
    if (job.kind === "rotate") pts = turnOutlineAt(job.from, p);
    else if (job.kind === "split") pts = glyphPoints(job.to);
    else pts = outlineAt(job.from, job.to, p);
    const ca = colors[A2.color], cb = colors[B2.color];
    const c = ca.map((v, i) => Math.round(lerp$6(v, cb[i], p)));
    const color = `rgb(${c[0]},${c[1]},${c[2]})`;
    fill2.setAttribute("d", pathOf(pts));
    fill2.setAttribute("fill", color);
    fill2.setAttribute("fill-opacity", String(lerp$6(A2.dashed ? 0.5 : 1, B2.dashed ? 0.5 : 1, p)));
    const side = A2.dashed ?? B2.dashed;
    const edgeOpacity = lerp$6(A2.dashed ? 1 : 0, B2.dashed ? 1 : 0, p);
    if (side && edgeOpacity > 0.01 && job.kind !== "rotate") {
      edge.setAttribute("d", edgeOf(pts, side));
      edge.setAttribute("stroke", color);
      edge.setAttribute("opacity", String(edgeOpacity));
    } else edge.removeAttribute("d");
    Object.assign(holder.style, {
      left: `${box.x}px`,
      top: `${box.y}px`,
      width: `${Math.max(0.5, box.w)}px`,
      height: `${Math.max(0.5, box.h)}px`,
      transform: rotate ? `rotate(${rotate}deg)` : ""
    });
    run.shown = true;
  };
  const finish = (run) => {
    run.done = true;
    run.overlay?.holder.remove();
    run.overlay = null;
    hidden.delete(token(run.job));
    sync();
  };
  const tick = () => {
    const now = clock();
    let live = false;
    for (const run of runs) {
      if (run.done) continue;
      const { job } = run;
      live = true;
      if (job.clock === "track") {
        if (!run.track) {
          run.track = travelling(job);
          if (!run.track) {
            if (now - born > 4e3) finish(run);
            continue;
          }
          hidden.add(token(job));
          sync();
        }
        const { rule, wrapper, anim } = run.track;
        const timing = anim.effect?.getComputedTiming();
        if (!wrapper.isConnected || anim.playState === "finished" || anim.playState === "idle") {
          finish(run);
          continue;
        }
        const raw = timing?.progress;
        const p2 = raw == null ? 0 : clamp01$6(raw);
        const R = boxOf(rule);
        if (!run.O0) run.O0 = R;
        let box = R;
        if (job.kind === "split") {
          const band2 = pieceBand(job.from, job.to);
          const sub = {
            x: run.O0.x,
            y: run.O0.y + band2.y0 * run.O0.h,
            w: run.O0.w,
            h: (band2.y1 - band2.y0) * run.O0.h
          };
          box = {
            x: R.x + (1 - p2) * (sub.x - run.O0.x),
            y: R.y + (1 - p2) * (sub.y - run.O0.y),
            w: R.w + (1 - p2) * (sub.w - run.O0.w),
            h: R.h + (1 - p2) * (sub.h - run.O0.h)
          };
        }
        paint(run, box, p2);
        continue;
      }
      if (!run.O) {
        const el = source(job);
        if (!el) {
          if (now - born > 600) finish(run);
          continue;
        }
        run.O = boxOf(el);
        run.start = now;
      }
      const N2 = target(job);
      if (!N2) continue;
      const Nb = boxOf(N2);
      const u = clamp01$6((now - (run.start ?? now)) / job.clock.ms);
      const p = bezier(job.clock.ease)(u);
      if (job.kind === "rotate") {
        const cx = lerp$6(run.O.x + run.O.w / 2, Nb.x + Nb.w / 2, p), cy = lerp$6(run.O.y + run.O.h / 2, Nb.y + Nb.h / 2, p);
        paint(run, {
          x: cx - Nb.w / 2,
          y: cy - Nb.h / 2,
          w: Nb.w,
          h: Nb.h
        }, p, 90 * (1 - p));
      } else paint(run, lerpBox(run.O, Nb, p), p);
      if (u >= 1) {
        if (!(travelling(job)?.anim.playState === "running")) finish(run);
      }
    }
    if (live) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frame);
    for (const run of runs) run.overlay?.holder.remove();
    hidden.clear();
    sync();
  };
}
var r$7 = String.raw;
var roles$2 = {
  t0: "lower",
  t0b: "lower",
  t0c: "lower",
  t0d: "lower",
  t0e: "lower",
  t0P: "lower",
  t0S: "lower",
  t1: "upper",
  t1b: "upper",
  t1c: "upper",
  t1d: "upper",
  t1P: "upper",
  t1S: "upper",
  B: "buncher",
  B2: "buncher",
  B3: "buncher",
  B4: "buncher",
  mh: "upper",
  mh2: "upper",
  mh3: "upper",
  bh: "buncher"
};
var jump = defineDerivation({
  id: "ss-jump",
  roles: roles$2,
  maxLines: 2,
  states: [{
    tex: r$7`\k{B}{B} \k{rel}{=} \k{top}{H_1(z^\star)} \k{bot.s}{-} \k{bot}{H_0(z^\star)}`,
    roles: {
      top: "upper",
      bot: "lower"
    },
    label: "B equals H 1 of z star minus H 0 of z star: the jump is the bunching mass."
  }]
});
var T0 = (k2 = "t0") => r$7`\k{${k2}}{t_0}`;
var T1 = (k2 = "t1") => r$7`\k{${k2}}{t_1}`;
var GAP = (k2 = "gap") => r$7`\k{${k2}}{(\k{${k2}.t1}{t_1}-\k{${k2}.t0}{t_0})}`;
var gapRoles = (k2 = "gap") => ({
  [`${k2}.t1`]: "upper",
  [`${k2}.t0`]: "lower"
});
var TIMES = (k2) => r$7`\k{${k2}}{\times}`;
var label = (k2, a2, b) => r$7`\k{${k2}}{\begin{gathered}\small\text{${a2}}\\[-3pt]\small\text{${b}}\end{gathered}}`;
var rows$1 = (mech, behav, labels = true) => r$7`\begin{aligned}` + (labels ? label("mlab", "Mechanical", "effect") : "") + r$7` & \k{mrel}{=} ${GAP()} ${TIMES("mx")} ${mech} \\[6pt] ` + (labels ? label("blab", "Behavioral", "response effect") : "") + r$7` & \k{brel}{=} \k{bs}{-}${T0("t0b")} ${TIMES("bx")} ${behav}` + r$7`\end{aligned}`;
var DZ = (k2) => r$7`\,\k{${k2}}{dz^\star}`;
var MECH_H = r$7`\k{mh}{(1-H_1(z^\star))}`;
var BEHAV_H = r$7`\k{bh}{(H_1(z^\star)-H_0(z^\star))}`;
var REV = (lhs, l, u, s = "") => r$7`\k{lhs${s}}{R(${lhs})} \k{rel${s}}{=} ${T0(`t0${s}`)} ${TIMES(`x0${s}`)} \k{gL${s}}{${l}} \k{plus${s}}{+} ${T1(`t1${s}`)} ${TIMES(`x1${s}`)} \k{gU${s}}{${u}}`;
var DIFF = r$7`\k{lhsP}{R(z')} \k{lm}{-} \k{lhsS}{R(z^\star)} \k{relP}{=}`;
var RESULT = r$7`\k{lhs}{-R'(z^\star)} \k{mrel}{=} ${GAP()} ${TIMES("mx")} ${MECH_H} \brk \k{bs}{-}${T0("t0b")} ${TIMES("bx")} \k{B}{B}`;
var SUM = (dz) => r$7`\begin{aligned}& \k{lhs}{-R'(z^\star)}${dz ? DZ("dz0") : ""} \k{mrel}{=} ${GAP()} ${TIMES("mx")} ${MECH_H}${dz ? DZ("dz1") : ""} \\[0.45pt] ` + r$7`& \hspace{1.064em}\k{bs}{-}${T0("t0b")} ${TIMES("bx")} \k{ub}{\underbrace{${BEHAV_H}}_{\k{ubl}{\text{bunching mass}}}}${dz ? DZ("dz2") : ""}\end{aligned}`;
var DEN = r$7`${GAP("gap3")}\k{mh3}{(1-H_1(z^\star))}\k{dm}{-}\k{t0d}{t_0}\k{B4}{B}`;
var WTP = r$7`${GAP("gap2")}\k{lb}{\big[}\k{mh2}{(1-H_1(z^\star))}\k{np}{+}\k{k}{k}\k{B2}{B}\k{rb}{\big]}`;
var WTP_K0 = WTP.replace(r$7`\k{k}{k}`, r$7`\k{k0}{0}`);
var MVPF_EXACT = r$7`\k{mv}{\mathrm{MVPF}} \k{mrel2}{=} \k{mfrac}{\frac{${WTP}}{${DEN}}}`;
var revenue = defineDerivation({
  id: "ss-revenue",
  roles: roles$2,
  maxLines: 2,
  states: [
    {
      tex: r$7`\k{lhs}{R(z^\star)} \k{rel}{=} ${T0()} ${TIMES("x0")} \k{gL}{${glyph("L")}}`,
      label: "R of z star equals t 0 times the teal area."
    },
    {
      tex: REV(r$7`z^\star`, glyph("L"), glyph("U")),
      label: "Plus t 1 times the indigo area."
    },
    {
      tex: REV(r$7`z'`, glyph("L2"), glyph("U2"), "P"),
      keep: true,
      from: {
        lhsP: "lhs",
        relP: "rel",
        t0P: "t0",
        x0P: "x0",
        gLP: "gL",
        plusP: "plus",
        t1P: "t1",
        x1P: "x1",
        gUP: "gU"
      },
      label: "R of z prime equals t 0 times the new teal area plus t 1 times the new indigo area."
    },
    {
      tex: r$7`${DIFF} ${T0("t0P")} ${TIMES("x0P")} \k{gLP}{${glyph("L2")}} \k{plusP}{+} ${T1("t1P")} ${TIMES("x1P")} \k{gUP}{${glyph("U2")}} \brk \k{m0}{-}${T0("t0S")} ${TIMES("x0S")} \k{gLS}{${glyph("L")}} \k{m1}{-}${T1("t1S")} ${TIMES("x1S")} \k{gUS}{${glyph("U")}}`,
      from: {
        lhsS: "lhs",
        t0S: "t0",
        x0S: "x0",
        gLS: "gL",
        t1S: "t1",
        x1S: "x1",
        gUS: "gU"
      },
      label: "R of z prime minus R of z star equals t 0 times the new teal area plus t 1 times the new indigo area, minus t 0 times the old teal area, minus t 1 times the old indigo area."
    },
    {
      tex: r$7`${DIFF} ${T1("t1P")} ${TIMES("x1P")} \k{pa}{(}\k{gUP}{${glyph("U2")}} \k{m1}{-} \k{gUS}{${glyph("U")}}\k{pb}{)} \brk \k{m0}{-}${T0("t0S")} ${TIMES("x0S")} \k{pc}{(}\k{gLS}{${glyph("L")}} \k{mL}{-} \k{gLP}{${glyph("L2")}}\k{pd}{)}`,
      sub: true,
      exit: {
        t0P: "collapse",
        x0P: "collapse",
        plusP: "collapse",
        t1S: "collapse",
        x1S: "collapse"
      },
      label: "Collect: t 1 times the new indigo area minus the old, minus t 0 times the old teal area minus the new."
    },
    {
      tex: r$7`${DIFF} ${T1("t1P")} ${TIMES("x1P")} \k{pa}{(}\k{gUP}{${glyph("U2")}} \k{m1}{-} \k{gUS}{${glyph("U")}}\k{pb}{)} \brk \k{m0}{-}${T0("t0S")} ${TIMES("x0S")} \k{pc}{(}\k{gLS}{${glyph("L")}} \k{mL}{-} \k{gLP}{${glyph("L2")}}\k{pd}{)}`,
      emphasis: {
        gUS: "cancel",
        gLP: "cancel"
      },
      label: "The old indigo area is part of the new one, and the new teal area is part of the old one."
    },
    {
      tex: r$7`${DIFF} ${T1("t1P")} ${TIMES("x1P")} \k{gUP}{${glyph("M")}} \brk \k{m0}{-}${T0("t0S")} ${TIMES("x0S")} \k{gLS}{${glyph("S")}}`,
      sub: true,
      exit: {
        pa: "collapse",
        m1: "collapse",
        gUS: "collapse",
        pb: "collapse",
        pc: "collapse",
        mL: "collapse",
        gLP: "collapse",
        pd: "collapse"
      },
      label: "They cancel. R of z prime minus R of z star equals t 1 times the indigo strip minus t 0 times the teal strip."
    },
    {
      tex: r$7`${DIFF} ${T1("t1P")} ${TIMES("x1P")} \k{gUP}{${glyph("M")}} \brk \k{m0}{-}${T0("t0S")} ${TIMES("x0S")} \k{pe}{(}\k{gMs}{${glyph("M")}} \k{ps}{+} \k{gBh}{${glyph("Bh")}}\k{pf}{)}`,
      from: {
        gMs: "gLS",
        gBh: "gLS"
      },
      label: "The teal strip is the indigo strip plus the red shape."
    },
    {
      tex: r$7`${DIFF} ${GAP()} ${TIMES("mx")} \k{gM}{${glyph("M")}} \brk \k{bs}{-}${T0("t0b")} ${TIMES("bx")} \k{gBh}{${glyph("Bh")}}`,
      sub: true,
      roles: gapRoles(),
      from: {
        "gap.t1": "t1P",
        "gap.t0": "t0S",
        mx: "x1P",
        gM: "gUP",
        bs: "m0",
        t0b: "t0S",
        bx: "x0S"
      },
      exit: {
        gMs: "collapse",
        pe: "collapse",
        ps: "collapse",
        pf: "collapse"
      },
      label: "R of z prime minus R of z star equals t 1 minus t 0 times the indigo strip, minus t 0 times the red shape."
    },
    {
      tex: rows$1(r$7`\k{gM}{${glyph("M")}}`, r$7`\k{gBh}{${glyph("Bh")}}`),
      sub: true,
      roles: gapRoles(),
      from: { mrel: "relP" },
      label: "Mechanical effect equals t 1 minus t 0 times the indigo strip. Behavioral response effect equals minus t 0 times the red shape."
    },
    {
      tex: rows$1(r$7`\k{gM}{${glyph("Md")}}`, r$7`\k{gBh}{${glyph("Bhd")}}`),
      roles: gapRoles(),
      label: "The H 1 edge of each shape is dashed: not observed."
    },
    {
      tex: rows$1(r$7`\k{gM}{${glyph("m")}}`, r$7`\k{gBh}{${glyph("b")}}`),
      roles: gapRoles(),
      label: "Each shape becomes a thin strip at z star."
    },
    {
      tex: rows$1(r$7`\k{gM}{${glyph("mH")}}`, r$7`\k{gBh}{${glyph("bH")}}`),
      roles: gapRoles(),
      label: "The strips turn horizontal."
    },
    {
      tex: rows$1(r$7`${MECH_H}${DZ("dz1")}`, r$7`\k{gBh}{${glyph("bH")}}`),
      roles: gapRoles(),
      from: { mh: "gM" },
      emphasis: { mh: "highlight" },
      label: "Mechanical effect equals t 1 minus t 0 times one minus H 1 of z star, d z star."
    },
    {
      tex: rows$1(r$7`${MECH_H}${DZ("dz1")}`, r$7`${BEHAV_H}${DZ("dz2")}`),
      roles: gapRoles(),
      from: { bh: "gBh" },
      emphasis: { bh: "highlight" },
      label: "Behavioral response effect equals minus t 0 times H 1 of z star minus H 0 of z star, d z star."
    },
    {
      tex: rows$1(r$7`${MECH_H}${DZ("dz1")}`, r$7`\k{ub}{\underbrace{${BEHAV_H}}_{\k{ubl}{\text{bunching mass}}}}${DZ("dz2")}`),
      roles: {
        ...gapRoles(),
        ubl: "buncher"
      },
      label: "The jump is the bunching mass."
    },
    {
      tex: SUM(true),
      roles: {
        ...gapRoles(),
        ubl: "buncher"
      },
      label: "The two rows add up to minus R prime of z star times d z star."
    },
    {
      tex: SUM(false),
      sub: true,
      roles: {
        ...gapRoles(),
        ubl: "buncher"
      },
      exit: {
        dz0: "collapse",
        dz1: "collapse",
        dz2: "collapse"
      },
      label: "Divide by d z star."
    },
    {
      tex: RESULT,
      sub: true,
      roles: gapRoles(),
      from: { B: "ub" },
      emphasis: { "*": "circumscribe" },
      label: "Minus R prime of z star equals t 1 minus t 0 times one minus H 1 of z star, minus t 0 times B."
    },
    {
      tex: r$7`\k{fe}{\mathit{FE}(z^\star)} \k{frel}{=} \k{fs}{-}\k{frac}{\frac{${T0("t0b")}\k{B}{B}}{${GAP()}\k{mh}{(1-H_1(z^\star))}}}`,
      keep: true,
      roles: gapRoles(),
      phases: [
        [
          "fe",
          "frel",
          "fs"
        ],
        ["t0b", "B"],
        [
          "gap",
          "gap.*",
          "mh"
        ]
      ],
      label: "The fiscal externality, F E of z star, equals minus t 0 B over t 1 minus t 0 times one minus H 1 of z star."
    },
    {
      tex: r$7`\k{mv}{\mathrm{MVPF}} \k{mrel2}{=} \k{mfrac}{\frac{\k{wtp}{\text{willingness to pay}}}{\k{cost}{\text{net cost}}}}`,
      keep: true,
      label: "M V P F equals willingness to pay over net cost."
    },
    {
      tex: r$7`\k{mv}{\mathrm{MVPF}} \k{mrel2}{=} \k{mfrac}{\frac{${WTP}}{\k{cost}{\text{net cost}}}}`,
      roles: {
        ...gapRoles("gap2"),
        mh2: "upper",
        k: "buncher"
      },
      from: {
        gap2: "wtp",
        mh2: "wtp"
      },
      phases: [[
        "gap2",
        "gap2.*",
        "lb",
        "mh2",
        "rb"
      ], [
        "np",
        "k",
        "B2"
      ]],
      label: "Willingness to pay is t 1 minus t 0 times one minus H 1 of z star, plus k B."
    },
    {
      tex: MVPF_EXACT,
      sub: true,
      roles: {
        ...gapRoles("gap2"),
        ...gapRoles("gap3"),
        mh2: "upper",
        mh3: "upper",
        k: "buncher"
      },
      from: {
        gap3: "cost",
        mh3: "cost"
      },
      phases: [[
        "gap3",
        "gap3.*",
        "mh3"
      ], [
        "dm",
        "t0d",
        "B4"
      ]],
      emphasis: { "*": "circumscribe" },
      label: "Net cost is t 1 minus t 0 times one minus H 1 of z star, minus t 0 B."
    },
    {
      tex: r$7`\k{mv}{\mathrm{MVPF}} \mathrel{\underset{\k{mcond}{\,\mathit{FE}>-1\,}}{\k{mrel3}{\ge}}} \k{mfrac}{\frac{${WTP_K0}}{${DEN}}}`,
      keep: true,
      roles: {
        ...gapRoles("gap2"),
        ...gapRoles("gap3"),
        mh2: "upper",
        mh3: "upper",
        k0: "buncher"
      },
      from: {
        k0: "k",
        mrel3: "mrel2"
      },
      emphasis: { k0: "highlight" },
      phases: [[
        "mv",
        "mrel3",
        "mfrac",
        "gap*",
        "lb",
        "mh*",
        "np",
        "k0",
        "B2",
        "rb",
        "dm",
        "t0d",
        "B4"
      ], ["mcond"]],
      label: "Since k is at least zero, and F E is above minus one so the net cost is positive, M V P F is at least the same fraction with k set to zero."
    },
    {
      tex: r$7`\k{mv}{\mathrm{MVPF}} \mathrel{\underset{\k{mcond}{\,\mathit{FE}>-1\,}}{\k{mrel3}{\ge}}} \k{mfrac}{\frac{${GAP("gap2")}\k{mh2}{(1-H_1(z^\star))}}{${DEN}}}`,
      sub: true,
      roles: {
        ...gapRoles("gap2"),
        ...gapRoles("gap3"),
        mh2: "upper",
        mh3: "upper"
      },
      exit: {
        lb: "collapse",
        rb: "collapse",
        np: "collapse",
        k0: "collapse",
        B2: "collapse"
      },
      label: "M V P F is at least t 1 minus t 0 times one minus H 1 of z star over the net cost."
    },
    {
      tex: r$7`\k{mv}{\mathrm{MVPF}} \mathrel{\underset{\k{mcond}{\,\mathit{FE}>-1\,}}{\k{mrel3}{\ge}}} \k{mfrac}{\frac{\k{one}{1}}{\k{one2}{1}\k{fp}{+}\k{fe3}{\mathit{FE}(z^\star)}}}`,
      sub: true,
      from: {
        one: "gap2",
        one2: "gap3"
      },
      exit: {
        mh2: "collapse",
        mh3: "collapse",
        dm: "collapse",
        t0d: "collapse",
        B4: "collapse"
      },
      enter: { fe3: "replace" },
      phases: [["one", "one2"], ["fp", "fe3"]],
      emphasis: { "*": "circumscribe" },
      label: "So M V P F is at least one over one plus F E."
    },
    {
      tex: r$7`\k{lhs}{-R'(z^\star)} \k{prel}{\ge} \k{zero}{0}`,
      keep: true,
      label: "Pareto efficiency requires minus R prime of z star at least zero."
    },
    {
      tex: r$7`${GAP("gap4")}\k{mh4}{(1-H_1(z^\star))} \k{prel}{\ge} ${T0("t0e")}\k{B3}{B}`,
      sub: true,
      roles: {
        ...gapRoles("gap4"),
        mh4: "upper"
      },
      label: "That is, t 1 minus t 0 times one minus H 1 of z star at least t 0 B."
    },
    {
      tex: r$7`\k{fe2}{\mathit{FE}(z^\star)} \k{prel}{\ge} \k{m1}{-1}`,
      sub: true,
      enter: {
        fe2: "replace",
        m1: "replace"
      },
      emphasis: { "*": "circumscribe" },
      label: "Equivalently, F E of z star at least minus one."
    }
  ]
});
var summary$1 = defineDerivation({
  id: "ss-summary",
  roles: roles$2,
  maxLines: 2,
  states: [{
    tex: RESULT,
    roles: gapRoles(),
    emphasis: { "*": "circumscribe" },
    label: "Minus R prime of z star equals t 1 minus t 0 times one minus H 1 of z star, minus t 0 times B."
  }]
});
var AT = {
  revenueLower: 0,
  revenueUpper: 1,
  reformed: 2,
  subtract: 3,
  cancel: 4,
  rows: 5,
  dashed: 6,
  thin: 7,
  bars: 8,
  mechHeight: 9,
  behavHeight: 10,
  underbrace: 11,
  result: 12,
  fe: 13,
  mvpf: 14,
  mvpfK: 15,
  mvpfBound: 16,
  pareto: 17
};
var M$3 = ({ tex }) => jsx(InlineMath, { tex });
var r$6 = String.raw;
var Para = ({ children }) => jsx("span", {
  className: "ss-more-p",
  children
});
var BlockMath = ({ tex }) => jsx("span", {
  className: "ss-more-math",
  children: jsx(InlineMath, { tex: String.raw`\displaystyle ${tex}` })
});
var STAGES$2 = [
  {
    eyebrow: "Recap",
    short: "Recap",
    title: "Reforms can change rates, or move bracket thresholds",
    derivation: jump,
    body: jsxs(Fragment$1, { children: [
      "A two-bracket schedule taxes income below ",
      jsx(M$3, { tex: "z^\\star" }),
      " at ",
      jsx(M$3, { tex: "t_0" }),
      " and income above it at",
      " ",
      jsx(M$3, { tex: "t_1>t_0" }),
      ". Chapter 1 built the choices and the CDF; this chapter redraws them in dollars. Heights of a CDF are shares of people, so they do not depend on whether income is measured in logs or dollars."
    ] }),
    prompt: "",
    figureTitle: "A two-bracket schedule, the choices it induces, and the CDF of income with its jump at the threshold"
  },
  {
    eyebrow: "Revenue on the CDF",
    short: "Revenue",
    title: "The CDF of taxable income shows tax revenue",
    derivation: revenue,
    body: jsxs(Fragment$1, { children: [
      jsx(Para, { children: "The shapes stand for areas above the CDF:" }),
      jsx(BlockMath, { tex: r$6`R(z^\star)=t_0\int_0^{z^\star}[1-H_0(z)]\,dz+t_1\int_{z^\star}^{\infty}[1-H_1(z)]\,dz.` }),
      jsxs(Para, { children: [
        "By the layer-cake identity the first area is ",
        jsx(M$3, { tex: r$6`\mathbb E[\min(z,z^\star)]` }),
        ", everyone’s income up to ",
        jsx(M$3, { tex: "z^\\star" }),
        ", and the second is ",
        jsx(M$3, { tex: r$6`\mathbb E[(z-z^\star)_+]` }),
        ", the dollars earned above ",
        jsx(M$3, { tex: "z^\\star" }),
        ". The second is not upper earners’ whole income,",
        " ",
        jsx(M$3, { tex: r$6`\mathbb E[z\,\mathbf 1\{z>z^\star\}]` }),
        ", which also contains",
        " ",
        jsx(M$3, { tex: r$6`z^\star(1-H_1(z^\star))` }),
        "."
      ] })
    ] }),
    prompt: "",
    figureTitle: "Revenue as two areas above the CDF: teal taxed at the lower rate, indigo at the upper rate"
  },
  {
    eyebrow: "Lower the threshold",
    short: "Reform",
    title: "Lower the threshold: who moves?",
    derivation: revenue,
    body: jsxs(Fragment$1, { children: [
      "Only the threshold moves, from ",
      jsx(M$3, { tex: "z^\\star" }),
      " to ",
      jsx(M$3, { tex: "z'<z^\\star" }),
      ". With no income effects nobody else changes their choice. Six before-and-after cases are possible, including taxpayers who would jump straight from the lower to the upper bracket; the reform drawn here has none."
    ] }),
    prompt: "",
    figureTitle: "Marginal benefit and choices before and after lowering the threshold"
  },
  {
    eyebrow: "The revenue effect",
    short: "Effect",
    title: "The CDF shows the revenue effect of the reform",
    derivation: revenue,
    body: jsxs(Fragment$1, { children: [
      jsx(Para, { children: "The shapes in the two rows are" }),
      jsx(BlockMath, { tex: r$6`\int_{z'}^{z^\star}[1-H_1(z)]\,dz\quad\text{and}\quad\int_{z'}^{z^\star}[H_1(z)-H_0(z)]\,dz.` }),
      jsxs(Para, { children: [
        "Subtract the two revenue lines. The new indigo area contains the old one and the old teal area contains the new one, so the common ranges cancel; what is left of the teal area, the strip above",
        " ",
        jsx(M$3, { tex: "H_0" }),
        " on ",
        jsx(M$3, { tex: r$6`[z',z^\star]` }),
        ", splits at ",
        jsx(M$3, { tex: "H_1" }),
        " into the indigo strip and the red shape:"
      ] }),
      jsx(BlockMath, { tex: r$6`\begin{aligned}R(z')-R(z^\star)&=t_1\int_{z'}^{z^\star}[1-H_1]\,dz-t_0\int_{z'}^{z^\star}[1-H_0]\,dz\\&=t_1\int_{z'}^{z^\star}[1-H_1]\,dz-t_0\int_{z'}^{z^\star}[1-H_1]\,dz\\&\qquad-t_0\int_{z'}^{z^\star}[H_1-H_0]\,dz\\&=(t_1-t_0)\int_{z'}^{z^\star}[1-H_1(z)]\,dz\\&\qquad-t_0\int_{z'}^{z^\star}[H_1(z)-H_0(z)]\,dz.\end{aligned}` }),
      jsxs(Para, { children: [
        "The arrows tile the red region. When no one jumps straight from the lower to the upper bracket,",
        " ",
        jsx(M$3, { tex: r$6`H_1(z')\ge H_0(z^\star)` }),
        ", and"
      ] }),
      jsx(BlockMath, { tex: r$6`\begin{aligned}&\int_{H_0(z')}^{H_0(z^\star)}\big(H_0^{-1}(p)-z'\big)\,dp+(z^\star-z')\big[H_1(z')-H_0(z^\star)\big]\\&\quad+\int_{H_1(z')}^{H_1(z^\star)}\big(z^\star-H_1^{-1}(p)\big)\,dp=\int_{z'}^{z^\star}[H_1(z)-H_0(z)]\,dz.\end{aligned}` }),
      jsx(Para, { children: "The “mechanical” area prices dollars at post-reform choices; it agrees with the frozen-income convention to first order." })
    ] }),
    prompt: "",
    figureTitle: "The reformed CDF: the indigo strip changes rate, and the red region is the income movers give up"
  },
  {
    eyebrow: "What we observe",
    short: "Observe",
    title: "A discrete reform's revenue effect is not identified",
    derivation: revenue,
    body: jsxs(Fragment$1, { children: [
      "Before the reform the CDF shows ",
      jsx(M$3, { tex: "H_0" }),
      " below ",
      jsx(M$3, { tex: "z^\\star" }),
      " and ",
      jsx(M$3, { tex: "H_1" }),
      " above it. Between ",
      jsx(M$3, { tex: "z'" }),
      " and ",
      jsx(M$3, { tex: "z^\\star" }),
      " it shows ",
      jsx(M$3, { tex: "H_0" }),
      " only, so the top edge of the red shape, and the bottom edge of the indigo strip, are unobserved."
    ] }),
    prompt: "",
    figureTitle: "The observed part of H0 and the unobserved part of H1 between z prime and z star"
  },
  {
    eyebrow: "A small decrease",
    short: "Small",
    title: "The bunching mass is a sufficient statistic",
    derivation: revenue,
    body: jsxs(Fragment$1, { children: [jsxs(Para, { children: [
      "The two rows add up to ",
      jsx(M$3, { tex: r$6`R(z^\star-dz^\star)-R(z^\star)` }),
      ", which to first order is",
      " ",
      jsx(M$3, { tex: r$6`-R'(z^\star)\,dz^\star` }),
      ". Dividing by ",
      jsx(M$3, { tex: r$6`dz^\star` }),
      " gives the boxed line."
    ] }), jsxs(Para, { children: [
      "With income effects the same argument holds with ",
      jsx(M$3, { tex: "B" }),
      " as the compensated response, and an income-effect term that the observed CDF does not identify is added."
    ] })] }),
    prompt: "",
    figureTitle: "The shapes thin into strips at z star; their heights are the share above the kink and the jump"
  },
  {
    eyebrow: "What it buys",
    short: "Buys",
    title: "The fiscal externality, the MVPF and a Pareto test",
    derivation: revenue,
    body: jsxs(Fragment$1, { children: [
      jsxs(Para, { children: [
        jsx("strong", { children: "MVPF." }),
        " Raising the threshold by ",
        jsx(M$3, { tex: r$6`dz^\star` }),
        " lowers every upper-bracket taxpayer’s bill by ",
        jsx(M$3, { tex: r$6`(t_1-t_0)\,dz^\star` }),
        ", which she values at exactly that. A buncher follows the threshold up and gains ",
        jsx(M$3, { tex: r$6`(1-t_0-MRS)\,dz^\star` }),
        ", where ",
        jsx(M$3, { tex: "MRS" }),
        " is her marginal rate of substitution at ",
        jsx(M$3, { tex: r$6`z^\star` }),
        ". Bunching puts it between",
        " ",
        jsx(M$3, { tex: r$6`1-t_1` }),
        " and ",
        jsx(M$3, { tex: r$6`1-t_0` }),
        ", so her gain is a share between ",
        jsx(M$3, { tex: "0" }),
        " and",
        " ",
        jsx(M$3, { tex: "1" }),
        " of the tax cut; ",
        jsx(M$3, { tex: "k" }),
        " is the bunchers’ average share. This is the first-order welfare effect of Moore, “Evaluating Tax Reforms without Elasticities: What Bunching Can Identify” (working paper), with every welfare weight equal to one. Since",
        " ",
        jsx(M$3, { tex: r$6`(1-H_1(z^\star))+B=1-H_0(z^\star)` }),
        ", the two ends of ",
        jsx(M$3, { tex: "k" }),
        " bound the MVPF by observed quantities:"
      ] }),
      jsx(BlockMath, { tex: r$6`\frac{1}{1+\mathit{FE}(z^\star)}\;\le\;\mathrm{MVPF}\;\le\;\frac{1}{1+\mathit{FE}(z^\star)}\cdot\frac{1-H_0(z^\star)}{1-H_1(z^\star)}` }),
      jsxs(Para, { children: [
        "when ",
        jsx(M$3, { tex: r$6`\mathit{FE}(z^\star)>-1` }),
        ". Neither end is reached when ",
        jsx(M$3, { tex: r$6`B>0` }),
        ", but the CDF cannot rule out values near either. When ",
        jsx(M$3, { tex: r$6`\mathit{FE}(z^\star)\le-1` }),
        " the raise pays for itself, and the schedule fails the Pareto test."
      ] }),
      jsxs(Para, { children: [jsx("strong", { children: "Pareto test." }), " Failing it is decisive: there is a reform everyone weakly prefers that also raises revenue. Passing it says only that this one reform is not a free lunch."] })
    ] }),
    prompt: "",
    figureTitle: "The fiscal externality as two bars: t0 times the jump against t1 minus t0 times the share above z star"
  },
  {
    eyebrow: "In sum",
    short: "Sum",
    title: "Chapter 3 in sum",
    derivation: summary$1,
    body: jsxs(Fragment$1, { children: [jsxs(Para, { children: [
      "With income effects, ",
      jsx(M$3, { tex: "B" }),
      " in the boxed line is the compensated response, and a term the observed CDF does not identify is added. With several brackets, each threshold has its own line, read at its own kink."
    ] }), jsx(Para, { children: "At a notch the tax bill itself jumps, and the marginal buncher compares two bundles that differ by a discrete amount, so the loss from a small move of the threshold is first order." })] }),
    prompt: "",
    figureTitle: "The CDF before the reform, with the two heights at z star that the result needs"
  }
];
function prose$1(text, ...tail) {
  const parts = text.split("$");
  if (parts.length % 2 === 0) throw new Error(`prose: unbalanced $ in ${JSON.stringify(text)}`);
  const lead = parts.map(() => "");
  const trail = parts.map(() => "");
  const body = [...parts];
  for (let i = 1; i < parts.length; i += 2) {
    const after = /^[.,;:!?)…]+/.exec(body[i + 1]);
    if (after) {
      trail[i] = after[0];
      body[i + 1] = body[i + 1].slice(after[0].length);
    }
    const before = /[(“]+$/.exec(body[i - 1]);
    if (before) {
      lead[i] = before[0];
      body[i - 1] = body[i - 1].slice(0, -before[0].length);
    }
  }
  return jsxs(Fragment$1, { children: [body.map((part, index) => index % 2 === 1 ? jsxs("span", {
    className: "ss-nowrap",
    children: [
      lead[index],
      jsx(InlineMath, { tex: part }),
      trail[index]
    ]
  }, index) : jsx(Fragment, { children: part }, index)), tail.map((node, index) => jsx(Fragment, { children: node }, `tail-${index}`))] });
}
var STEP_DEFS$2 = [
  {
    key: "schedules",
    stage: 0,
    derivationAt: null,
    text: "A reform can change a rate within a bracket, or move a bracket threshold. The revenue effect of moving a threshold a little needs no elasticity. The bunching mass is a sufficient statistic: it tells us all we need to know about the behavioral response."
  },
  {
    key: "choices",
    stage: 0,
    text: "Below the kink, people choose what they would under a flat tax at $t_0$; above it, what they would at $t_1$. Those at $z^\\star$ bunch."
  },
  {
    key: "cdf",
    stage: 0,
    derivationAt: 0,
    text: "In dollars now, since revenue is counted in dollars; heights don't change. Below $z^\\star$ the CDF is $H_0$, above it $H_1$. The jump is the bunching mass."
  },
  {
    key: "revenueLower",
    stage: 1,
    derivationAt: AT.revenueLower,
    text: "The strip above the CDF at each income is the share who earn that dollar. Left of $z^\\star$, that is everyone's first $z^\\star$ dollars, each taxed at $t_0$."
  },
  {
    key: "revenueUpper",
    stage: 1,
    derivationAt: AT.revenueUpper,
    text: "Right of $z^\\star$, the area above $H_1$ counts the dollars earned above $z^\\star$, each taxed at $t_1$."
  },
  {
    key: "lower",
    stage: 2,
    derivationAt: AT.revenueUpper,
    text: "Lower the threshold from $z^\\star$ to $z'$, with both rates unchanged."
  },
  {
    key: "newBunchers",
    stage: 2,
    text: "Lower-bracket taxpayers between $z'$ and $z^\\star$ now bunch at $z'$. They are new bunchers."
  },
  {
    key: "formerBunchers",
    stage: 2,
    text: "Former bunchers leave $z^\\star$ for their upper-rate choice; the rest follow the threshold down. Everyone who responds earns less."
  },
  {
    key: "redraw",
    stage: 3,
    derivationAt: AT.reformed,
    text: "After the reform the CDF follows $H_0$ up to $z'$, then $H_1$. Revenue is the same two areas."
  },
  {
    key: "strip",
    stage: 3,
    text: "These dollars used to be taxed at $t_0$; now they are taxed at $t_1$."
  },
  {
    key: "arrowsNew",
    stage: 3,
    text: "Each mover's lost income is a horizontal arrow on the CDF. New bunchers move from their lower-rate choice down to $z'$."
  },
  {
    key: "arrowsRest",
    stage: 3,
    text: "The bunchers who follow the threshold and the former bunchers move left too. All of this income is lost to the behavioral response."
  },
  {
    key: "subtract",
    stage: 3,
    derivationAt: AT.subtract,
    text: "Subtract the revenue before the reform from the revenue after, and pair the terms by rate."
  },
  {
    key: "cancel",
    stage: 3,
    derivationAt: AT.cancel,
    text: "In each pair one area contains the other, so the shared part cancels. What is left lies between $z'$ and $z^\\star$."
  },
  {
    key: "lift",
    stage: 3,
    derivationAt: AT.rows,
    text: "$H_1$ splits the teal strip into the indigo strip and the red shape. Revenue gains $t_1-t_0$ on the indigo dollars and loses $t_0$ on the red ones."
  },
  {
    key: "observeH0",
    stage: 4,
    derivationAt: AT.rows,
    text: "Before the reform we observe this part of $H_0$…"
  },
  {
    key: "hiddenH1",
    stage: 4,
    derivationAt: AT.dashed,
    text: "…but not this part of $H_1$. So the revenue effect of a discrete reform is not identified ex ante."
  },
  {
    key: "thin",
    stage: 5,
    derivationAt: AT.thin,
    text: "Make the decrease small: $z'=z^\\star-dz^\\star$. Each shape compresses into a thin strip at $z^\\star$."
  },
  {
    key: "bars",
    stage: 5,
    derivationAt: AT.bars,
    text: "Turn each strip a quarter turn: its area is its height times its width, $dz^\\star$."
  },
  {
    key: "mechHeight",
    stage: 5,
    derivationAt: AT.mechHeight,
    text: "The indigo height is the share above the kink."
  },
  {
    key: "behavHeight",
    stage: 5,
    derivationAt: AT.behavHeight,
    text: "The red height is the jump. Both heights sit at $z^\\star$, where we observe them."
  },
  {
    key: "underbrace",
    stage: 5,
    derivationAt: AT.underbrace,
    text: "The bunching mass is a sufficient statistic for the behavioral response effect."
  },
  {
    key: "result",
    stage: 5,
    derivationAt: AT.result,
    text: "Per dollar of decrease, revenue changes by $-R'(z^\\star)$. It is identified by the pre-reform distribution of income."
  },
  {
    key: "fe",
    stage: 6,
    derivationAt: AT.fe,
    text: "Divide the behavioral term by the mechanical one. The fiscal externality is the revenue lost to the behavioral response per dollar raised mechanically. Each bar is an observed height at $z^\\star$ times its rate."
  },
  {
    key: "mvpf",
    stage: 6,
    derivationAt: AT.mvpf,
    text: "Run the reform the other way and raise the threshold. Its marginal value of public funds, the MVPF, is what taxpayers would pay for the higher threshold divided by its net cost to the government."
  },
  {
    key: "mvpfK",
    stage: 6,
    derivationAt: AT.mvpfK,
    text: "Taxpayers above $z^\\star$ value their tax cut at what it costs. Bunchers sit at a corner, where the envelope theorem fails, and value it at a share $k$ of it on average. The net cost is the revenue lost, $-R'(z^\\star)$."
  },
  {
    key: "mvpfBound",
    stage: 6,
    derivationAt: AT.mvpfBound,
    text: "The CDF does not reveal $k$, which depends on bunchers' preferences at the kink. But $k$ lies between $0$ and $1$. Setting it to $0$ gives a bound that is observed: when $\\mathit{FE}>-1$, the MVPF is at least $1/(1+\\mathit{FE})$."
  },
  {
    key: "pareto",
    stage: 6,
    derivationAt: AT.pareto,
    text: "Raising the threshold leaves no one worse off. If it also raised revenue, the schedule would not be Pareto efficient. So efficiency requires $-R'(z^\\star)\\ge0$: the mechanical gain must cover the bunchers' loss."
  },
  {
    key: "sum",
    stage: 7,
    derivationAt: 0,
    text: "The CDF before the reform identifies the revenue effect of moving a threshold a little, through the bunching mass and the share above the kink. No elasticity is needed, no assumption on the type distribution, and preferences can differ across people."
  },
  {
    key: "end",
    stage: 7,
    derivationAt: 0,
    text: "The result extends to general and heterogeneous preferences, to income effects (then $B$ is the compensated response), and to several brackets. It does not carry over to notches: there the marginal buncher's loss is first order. And real bunching is diffuse. What about frictions?"
  }
].map((row) => ({
  key: row.key,
  stage: row.stage,
  narration: row.key === "end" ? prose$1(row.text) : prose$1(row.text),
  ..."derivationAt" in row ? { derivationAt: row.derivationAt } : {}
}));
var STEP_INDEX$2 = Object.fromEntries(STEP_DEFS$2.map((step, index) => [step.key, index]));
STEP_DEFS$2.length - 1;
var cls = (...parts) => parts.filter(Boolean).join(" ");
var morph = (d2) => ({
  d: d2,
  style: { d: `path("${d2}")` }
});
var at = (x0, y0) => ({ transform: `translate(${x0}px, ${y0}px)` });
var GLYPH_CSS = `${glyphCss()}
${morphCss()}`;
var LABEL_H = 48;
function Label$3({ tex, x: lx, y: ly0, width = 160, anchor = "start", className = "" }) {
  return jsx(SvgMathLabel, {
    tex,
    x: lx,
    y: ly0,
    width,
    height: LABEL_H,
    anchor,
    className: cls("ss-label", className)
  });
}
function cuesFor(step) {
  const key = STEP_DEFS$2[step].key;
  const index = STEP_INDEX$2[key];
  return {
    key,
    stage: STEP_DEFS$2[step].stage,
    is: (...keys) => keys.includes(key),
    from: (start) => index >= STEP_INDEX$2[start],
    until: (end) => index < STEP_INDEX$2[end]
  };
}
var SCHEDULE_KEYFRAMES = (() => {
  const { k: k2, t1: t12, kReform, t1Reform } = SCHEDULE;
  const frames = (fn2) => `0%,6%{d:path("${fn2(k2, t12)}")} 20%,30%{d:path("${fn2(k2, t1Reform)}")} 44%,54%{d:path("${fn2(k2, t12)}")} 68%,78%{d:path("${fn2(kReform, t12)}")} 92%,100%{d:path("${fn2(k2, t12)}")}`;
  const shift = (panel) => {
    return `0%,54%{transform:translateX(0)} 68%,78%{transform:translateX(${sx(panel, kReform) - sx(panel, k2)}px)} 92%,100%{transform:translateX(0)}`;
  };
  const rise = ry(t1Reform) - ry(t12);
  return [
    `@keyframes ss-liab-lo{${frames((kk) => liabilityLower(kk))}}`,
    `@keyframes ss-liab-up{${frames(liabilityUpper)}}`,
    `@keyframes ss-rate-lo{${frames((kk) => rateLower(kk))}}`,
    `@keyframes ss-rate-up{${frames(rateUpper)}}`,
    `@keyframes ss-guide-l{${shift("liability")}}`,
    `@keyframes ss-guide-r{${shift("rate")}}`,
    `@keyframes ss-t1-label{0%,6%{transform:translateY(0)} 20%,30%{transform:translateY(${rise}px)} 44%,100%{transform:translateY(0)}}`
  ].join("\n");
})();
function ScheduleScene({ cue }) {
  const on = cue.is("schedules");
  const { k: k2, t1: t12 } = SCHEDULE;
  const L = PANELS.liability;
  const R = PANELS.rate;
  return jsxs("g", {
    className: cls("ss-scene ss-t", !on && "ss-off"),
    "aria-hidden": !on,
    children: [
      jsx("style", { children: SCHEDULE_KEYFRAMES }),
      jsx("path", {
        className: "ss-axis",
        d: `M${L.left},${L.top - 20} L${L.left},${L.bottom} L${L.right + 10},${L.bottom}`
      }),
      jsxs("g", {
        className: "ss-guide-l",
        children: [jsx("path", {
          className: "ss-threshold",
          d: `M${sx("liability", k2)},${L.top} L${sx("liability", k2)},${L.bottom}`
        }), jsx(Label$3, {
          tex: "z^\\star",
          x: sx("liability", k2),
          y: L.bottom + 38,
          width: 60,
          anchor: "middle"
        })]
      }),
      jsx("path", {
        className: "ss-schedule ss-liab-lo ss-sched-lower",
        d: liabilityLower(k2)
      }),
      jsx("path", {
        className: "ss-schedule ss-liab-up ss-sched-upper",
        d: liabilityUpper(k2, t12)
      }),
      jsx(Label$3, {
        tex: "T(z)",
        x: L.left - 10,
        y: L.top - 34,
        width: 90,
        anchor: "start"
      }),
      jsx(Label$3, {
        tex: "z",
        x: L.right + 4,
        y: L.bottom + 38,
        width: 40,
        anchor: "start"
      }),
      jsx(Label$3, {
        tex: "t_0",
        x: sx("liability", 50),
        y: ly(T0$1 * 50) - 22,
        width: 50,
        anchor: "middle",
        className: "ss-tone-lower"
      }),
      jsx(Label$3, {
        tex: "t_1",
        x: sx("liability", 160) - 18,
        y: ly(T0$1 * k2 + t12 * 60) - 8,
        width: 50,
        anchor: "end",
        className: "ss-tone-upper"
      }),
      jsx("path", {
        className: "ss-axis",
        d: `M${R.left},${R.top - 20} L${R.left},${R.bottom} L${R.right + 10},${R.bottom}`
      }),
      jsxs("g", {
        className: "ss-guide-r",
        children: [jsx("path", {
          className: "ss-threshold",
          d: `M${sx("rate", k2)},${R.top} L${sx("rate", k2)},${R.bottom}`
        }), jsx(Label$3, {
          tex: "z^\\star",
          x: sx("rate", k2),
          y: R.bottom + 38,
          width: 60,
          anchor: "middle"
        })]
      }),
      jsx("path", {
        className: "ss-schedule ss-rate-lo ss-sched-lower",
        d: rateLower(k2)
      }),
      jsx("path", {
        className: "ss-schedule ss-rate-up ss-sched-upper",
        d: rateUpper(k2, t12)
      }),
      jsx(Label$3, {
        tex: "T'(z)",
        x: R.left - 10,
        y: R.top - 34,
        width: 90,
        anchor: "start"
      }),
      jsx(Label$3, {
        tex: "z",
        x: R.right + 4,
        y: R.bottom + 38,
        width: 40,
        anchor: "start"
      }),
      jsx(Label$3, {
        tex: "t_0",
        x: sx("rate", 50),
        y: ry(T0$1) - 16,
        width: 50,
        anchor: "middle",
        className: "ss-tone-lower"
      }),
      jsx("g", {
        className: "ss-t1-label",
        children: jsx(Label$3, {
          tex: "t_1",
          x: sx("rate", 175),
          y: ry(t12) - 16,
          width: 50,
          anchor: "middle",
          className: "ss-tone-upper"
        })
      })
    ]
  });
}
var DOTS = dots(85);
var regionOf = (r3) => r3;
function ChoiceScene({ cue }) {
  const on = cue.is("choices", "lower", "newBunchers", "formerBunchers");
  const reformed = cue.from("lower");
  const k2 = reformed ? 85 : Z_STAR;
  const regions = choiceRegions(k2);
  const where = (d2) => {
    const moved = cue.from("formerBunchers") || cue.from("newBunchers") && d2.group === "newBuncher";
    const c = moved ? d2.after : d2.before;
    const kk = moved ? 85 : Z_STAR;
    const m = c.region === "buncher" ? Math.pow(kk / d2.w, 1 / LAW$1.e) : c.mc;
    return {
      x: x(c.z),
      y: y(m),
      region: regionOf(c.region),
      moved
    };
  };
  return jsxs("g", {
    className: cls("ss-scene ss-t", !on && "ss-off"),
    "aria-hidden": !on,
    children: [
      jsxs("defs", { children: [[
        "lower",
        "buncher",
        "upper"
      ].map((r3, i) => jsx("pattern", {
        id: `ss-hatch-${r3}`,
        width: "11",
        height: "11",
        patternUnits: "userSpaceOnUse",
        patternTransform: `rotate(${i === 1 ? 45 : 45})`,
        children: jsx("line", {
          x1: "0",
          y1: "0",
          x2: "0",
          y2: "11",
          className: `ss-hatch ss-hatch-${r3}`
        })
      }, r3)), jsx("clipPath", {
        id: "ss-mb-clip",
        children: jsx("rect", {
          x: P$1.left,
          y: P$1.top,
          width: P$1.right - P$1.left,
          height: P$1.bottom - P$1.top
        })
      })] }),
      jsx("g", {
        clipPath: "url(#ss-mb-clip)",
        children: [
          "lower",
          "buncher",
          "upper"
        ].map((r3) => jsx("path", {
          className: "ss-hatch-region ss-t",
          fill: `url(#ss-hatch-${r3})`,
          ...morph(regions[r3])
        }, r3))
      }),
      jsx("path", {
        className: "ss-axis",
        d: `M${P$1.left},${P$1.top} L${P$1.left},${P$1.bottom} L${P$1.right},${P$1.bottom}`
      }),
      jsx("path", {
        className: cls("ss-mb-old ss-t", !reformed && "ss-off"),
        d: mbStep(Z_STAR)
      }),
      jsx("path", {
        className: "ss-mb ss-t",
        ...morph(mbStep(k2))
      }),
      jsx(Label$3, {
        tex: "1-t_0",
        x: P$1.left - 10,
        y: y(MB.lower) + 9,
        width: 84,
        anchor: "end"
      }),
      jsx(Label$3, {
        tex: "1-t_1",
        x: P$1.left - 10,
        y: y(MB.upper) + 9,
        width: 84,
        anchor: "end"
      }),
      jsx(Label$3, {
        tex: "z",
        x: 795,
        y: P$1.bottom + 41,
        width: 65
      }),
      jsx(Label$3, {
        tex: "z^\\star",
        x: x(Z_STAR),
        y: P$1.bottom + 41,
        width: 70,
        anchor: "middle"
      }),
      jsxs("g", {
        className: cls("ss-t", !reformed && "ss-off"),
        children: [jsx("path", {
          className: "ss-threshold-faint",
          d: `M${x(85)},${y(MB.upper)} L${x(85)},${P$1.bottom}`
        }), jsx(Label$3, {
          tex: "z'",
          x: x(85),
          y: P$1.bottom + 41,
          width: 60,
          anchor: "middle"
        })]
      }),
      jsx("path", {
        className: cls("ss-threshold-faint ss-t", reformed && "ss-dim"),
        d: `M${x(Z_STAR)},${y(MB.upper)} L${x(Z_STAR)},${P$1.bottom}`
      }),
      DOTS.map((d2) => {
        const p = where(d2);
        return jsx("circle", {
          className: cls("ss-dot ss-t", `ss-dot-${p.region}`),
          r: 5.5,
          cx: 0,
          cy: 0,
          style: at(p.x, p.y)
        }, d2.index);
      })
    ]
  });
}
var AT_STAR = cdfAt(Z_STAR);
var AT_PRIME = cdfAt(85);
var AT_SMALL = cdfAt(Z_SMALL);
var SHAPES_PRIME = shapesAt(85);
var SHAPES_SMALL = shapesAt(Z_SMALL);
var ARROWS = arrows(85);
var STRIP$2 = band(() => 1, H0$1, 85, Z_STAR, 40);
var FE = (() => {
  const X0 = 505;
  const th = 16;
  const rows2 = {
    buncher: 492,
    upper: 542
  };
  const yJumpBottom = y(H0$1(Z_STAR));
  const yJumpTop = y(H1$1(Z_STAR));
  const bars = {
    buncher: {
      full: yJumpBottom - yJumpTop,
      rate: T0$1,
      from: yJumpBottom,
      row: rows2.buncher
    },
    upper: {
      full: yJumpTop - Y_ONE,
      rate: T1$1 - T0$1,
      from: yJumpTop,
      row: rows2.upper
    }
  };
  const len = (b) => Math.round(b.full * b.rate * 100) / 100;
  return {
    X0,
    th,
    rows: rows2,
    bars,
    red: len(bars.buncher),
    indigo: len(bars.upper)
  };
})();
var FE_KEYFRAMES = ["buncher", "upper"].map((r3) => {
  const b = FE.bars[r3];
  const start = `translate(${x(Z_STAR)}px, ${b.from}px) rotate(-90deg) scale(1, 0.4)`;
  return `@keyframes ss-fe-${r3}{0%{transform:${start};opacity:0} 10%{transform:${start};opacity:1} 55%,68%{transform:${`translate(${FE.X0}px, ${b.row}px) rotate(0deg) scale(1, 1)`};opacity:1} 100%{transform:${`translate(${FE.X0}px, ${b.row}px) rotate(0deg) scale(${b.rate}, 1)`};opacity:1}}`;
}).join("\n");
function FeInset({ cue }) {
  const on = cue.stage === 6;
  const netCost = cue.from("mvpfK") && on;
  const pareto = cue.is("pareto");
  const { X0, th, rows: rows2, bars, red, indigo } = FE;
  const brY = rows2.upper + th / 2 + 6;
  return jsxs("g", {
    className: cls("ss-fe ss-t", !on && "ss-off"),
    "aria-hidden": !on,
    children: [
      jsx("style", { children: FE_KEYFRAMES }),
      ["buncher", "upper"].map((r3) => {
        const b = bars[r3];
        return jsx("rect", {
          className: `ss-fe-bar ss-fe-bar-${r3}`,
          x: 0,
          y: -th / 2,
          width: b.full,
          height: th,
          style: { transform: `translate(${X0}px, ${b.row}px) rotate(0deg) scale(${b.rate}, 1)` }
        }, r3);
      }),
      jsxs("g", {
        className: "ss-fe-labels",
        children: [jsx(Label$3, {
          tex: "t_0B",
          x: X0 + red + 12,
          y: rows2.buncher + 9,
          width: 70,
          className: "ss-small ss-tone-buncher"
        }), jsx(Label$3, {
          tex: "(t_1-t_0)(1-H_1(z^\\star))",
          x: X0 + indigo + 12,
          y: rows2.upper + 9,
          width: 250,
          className: "ss-small ss-tone-upper"
        })]
      }),
      jsxs("g", {
        className: cls("ss-fe-net ss-t", !netCost && "ss-off"),
        children: [jsx("path", {
          className: "ss-fe-bracket",
          d: `M${X0 + red},${brY - 5} L${X0 + red},${brY} L${X0 + indigo},${brY} L${X0 + indigo},${brY - 5}`
        }), jsx(Label$3, {
          tex: "-R'(z^\\star)",
          x: X0 + (red + indigo) / 2,
          y: brY + 30,
          width: 110,
          anchor: "middle",
          className: "ss-small"
        })]
      }),
      jsx("path", {
        className: cls("ss-fe-guide ss-t", !pareto && "ss-off"),
        d: `M${X0 + red},${rows2.buncher - th / 2 - 6} L${X0 + red},${rows2.upper + th / 2}`
      })
    ]
  });
}
function arrowPath(p, from, to) {
  const yy = y(p), x0 = x(from) - 2, x1 = x(to) + 6;
  return `M${x0},${yy} L${x1},${yy} M${x1 + 8},${yy - 5} L${x1},${yy} L${x1 + 8},${yy + 5}`;
}
function CdfScene({ cue }) {
  const on = cue.is("cdf") || cue.stage === 1 || cue.stage >= 3;
  const reformed = cue.from("redraw");
  const small = cue.from("thin");
  const g = small ? AT_SMALL : reformed ? AT_PRIME : AT_STAR;
  const observedAgain = cue.from("observeH0");
  const lines = observedAgain ? AT_STAR : g;
  const shapes = small ? SHAPES_SMALL : SHAPES_PRIME;
  const tinted = cue.from("strip");
  const lowerOn = cue.from("revenueLower");
  const upperOn = cue.from("revenueUpper");
  const arrowsNew = cue.from("arrowsNew");
  const arrowsRest = cue.from("arrowsRest");
  const arrowsShown = arrowsNew && cue.until("subtract");
  const oldOutlines = cue.is("subtract");
  const strip2 = cue.is("cancel");
  const redRegion = cue.from("lift");
  const focusMech = cue.is("mechHeight");
  const focusBehav = cue.is("behavHeight");
  const circled = cue.is("result") || cue.stage === 7;
  const guideH0 = y(H0$1(Z_STAR));
  const guideH1 = y(H1$1(Z_STAR));
  const h1Label = 120;
  return jsxs("g", {
    className: cls("ss-scene ss-t", !on && "ss-off"),
    "aria-hidden": !on,
    children: [
      jsx("defs", { children: jsx("clipPath", {
        id: "ss-cdf-clip",
        children: jsx("rect", {
          x: P$1.left,
          y: P$1.top - 2,
          width: P$1.right - P$1.left + 2,
          height: P$1.bottom - P$1.top + 2
        })
      }) }),
      jsxs("g", {
        clipPath: "url(#ss-cdf-clip)",
        children: [
          jsx("path", {
            className: cls("ss-region ss-region-lower ss-t", !lowerOn && "ss-off", tinted && "is-tint"),
            "data-ss-shape": "lower",
            ...morph(g.lower)
          }),
          jsx("path", {
            className: cls("ss-region ss-region-upper ss-t", !upperOn && "ss-off", tinted && "is-tint"),
            "data-ss-shape": "upper",
            ...morph(g.upper)
          }),
          jsx("path", {
            className: cls("ss-region ss-region-mech ss-t", !tinted && "ss-off", focusBehav && "is-dim", focusMech && "is-focus"),
            "data-ss-shape": "mech",
            ...morph(shapes.mechanical)
          }),
          jsx("path", {
            className: cls("ss-region ss-region-red ss-t", !arrowsShown && "ss-off"),
            d: ARROWS.bands.newBunchers
          }),
          jsx("path", {
            className: cls("ss-region ss-region-red ss-region-always ss-t", !(arrowsRest && arrowsShown) && "ss-off"),
            d: ARROWS.bands.followers
          }),
          jsx("path", {
            className: cls("ss-region ss-region-red ss-t", !(arrowsRest && arrowsShown) && "ss-off"),
            d: ARROWS.bands.formerBunchers
          }),
          jsx("path", {
            className: cls("ss-band-edge ss-t", !(arrowsRest && arrowsShown) && "ss-off"),
            d: ARROWS.edges
          }),
          jsx("path", {
            className: cls("ss-region ss-region-red ss-t", !redRegion && "ss-off", focusMech && "is-dim", focusBehav && "is-focus"),
            "data-ss-shape": "behav",
            ...morph(shapes.behavioral)
          }),
          jsx("path", {
            className: cls("ss-region ss-region-strip ss-t", !strip2 && "ss-off"),
            "data-ss-shape": "strip",
            d: STRIP$2
          }),
          jsx("path", {
            className: cls("ss-old-outline ss-old-lower ss-t", !oldOutlines && "ss-off"),
            d: AT_STAR.lower
          }),
          jsx("path", {
            className: cls("ss-old-outline ss-old-upper ss-t", !oldOutlines && "ss-off"),
            d: AT_STAR.upper
          })
        ]
      }),
      jsxs("g", {
        "aria-hidden": "true",
        children: [jsx("path", {
          className: "ss-rot-ghost ss-rot-mech",
          d: SHAPES_SMALL.mechanical
        }), jsx("path", {
          className: "ss-rot-ghost ss-rot-behav",
          d: SHAPES_SMALL.behavioral
        })]
      }),
      jsx("path", {
        className: "ss-axis",
        d: `M${P$1.left},${P$1.top} L${P$1.left},${P$1.bottom} L${P$1.right},${P$1.bottom}`
      }),
      jsx("path", {
        className: "ss-one",
        d: `M${P$1.left},${Y_ONE} L${P$1.right},${Y_ONE}`
      }),
      jsx(Label$3, {
        tex: "1",
        x: P$1.left - 12,
        y: Y_ONE + 9,
        width: 40,
        anchor: "end"
      }),
      jsx(Label$3, {
        tex: "0",
        x: P$1.left - 12,
        y: P$1.bottom + 9,
        width: 40,
        anchor: "end"
      }),
      jsx(Label$3, {
        tex: "z",
        x: 795,
        y: P$1.bottom + 41,
        width: 65
      }),
      jsx("path", {
        className: "ss-guide",
        d: `M${P$1.left},${guideH0} L${x(Z_STAR)},${guideH0}`
      }),
      jsx("path", {
        className: "ss-guide",
        d: `M${P$1.left},${guideH1} L${x(Z_STAR)},${guideH1}`
      }),
      jsx(Label$3, {
        tex: "H_0(z^\\star)",
        x: P$1.left - 8,
        y: guideH0 + 9,
        width: 88,
        anchor: "end",
        className: "ss-small"
      }),
      jsx(Label$3, {
        tex: "H_1(z^\\star)",
        x: P$1.left - 8,
        y: guideH1 + 9,
        width: 88,
        anchor: "end",
        className: "ss-small"
      }),
      jsx("path", {
        className: cls("ss-threshold ss-t", reformed && !small && "ss-dim"),
        d: `M${x(Z_STAR)},${Y_ONE} L${x(Z_STAR)},${P$1.bottom}`
      }),
      jsx(Label$3, {
        tex: "z^\\star",
        x: x(Z_STAR),
        y: P$1.bottom + 41,
        width: 70,
        anchor: "middle"
      }),
      jsx("path", {
        className: cls("ss-threshold ss-t", (!reformed || small) && "ss-off"),
        d: `M${x(85)},${Y_ONE} L${x(85)},${P$1.bottom}`
      }),
      jsx("g", {
        className: cls("ss-t", (!reformed || small) && "ss-off"),
        children: jsx(Label$3, {
          tex: "z'",
          x: x(85),
          y: P$1.bottom + 41,
          width: 60,
          anchor: "middle"
        })
      }),
      jsx("path", {
        className: "ss-cdf ss-cdf-lower is-dashed ss-t",
        ...morph(lines.h0Dashed)
      }),
      jsx("path", {
        className: "ss-cdf ss-cdf-upper is-dashed ss-t",
        ...morph(lines.h1Dashed)
      }),
      jsx("path", {
        className: "ss-cdf ss-cdf-lower ss-t",
        ...morph(lines.h0Solid)
      }),
      jsx("path", {
        className: "ss-cdf ss-cdf-upper ss-t",
        ...morph(lines.h1Solid)
      }),
      jsx("path", {
        className: cls("ss-jump-old ss-t", (!reformed || observedAgain) && "ss-off"),
        d: AT_STAR.jump
      }),
      jsx("path", {
        className: "ss-jump ss-t",
        ...morph(lines.jump)
      }),
      jsx(Label$3, {
        tex: "H_0(z)",
        x: x(160),
        y: y(H0$1(160)) + 44,
        width: 100,
        anchor: "start",
        className: "ss-tone-lower"
      }),
      jsx(Label$3, {
        tex: "H_1(z)",
        x: x(h1Label) + 14,
        y: y(H1$1(h1Label)) + 30,
        width: 100,
        anchor: "start",
        className: "ss-tone-upper"
      }),
      jsx("g", {
        className: cls("ss-arrows ss-t", !arrowsShown && "ss-off"),
        children: ARROWS.newBunchers.map((a2) => jsx("path", {
          className: "ss-arrow",
          d: arrowPath(a2.p, a2.from, a2.to)
        }, `n${a2.p}`))
      }),
      jsx("g", {
        className: cls("ss-arrows ss-t", !(arrowsRest && arrowsShown) && "ss-off"),
        children: [...ARROWS.followers, ...ARROWS.formerBunchers].map((a2) => jsx("path", {
          className: "ss-arrow",
          d: arrowPath(a2.p, a2.from, a2.to)
        }, `r${a2.p}`))
      }),
      jsx("path", {
        className: cls("ss-observed ss-t", !(cue.from("observeH0") && cue.until("thin")) && "ss-off"),
        d: curve$2(H0$1, 85, Z_STAR, 30)
      }),
      jsx("path", {
        className: cls("ss-hidden ss-t", !(cue.from("hiddenH1") && cue.until("thin")) && "ss-off"),
        d: curve$2(H1$1, 85, Z_STAR, 30)
      }),
      jsx(FeInset, { cue }),
      jsxs("g", {
        className: cls("ss-circles ss-t", !circled && "ss-off"),
        children: [jsx("rect", {
          className: "ss-circle ss-circle-upper",
          x: x(Z_STAR) - 17,
          y: Y_ONE - 8,
          width: 26,
          height: guideH1 - Y_ONE + 8 - 7,
          rx: 13
        }), jsx("rect", {
          className: "ss-circle ss-circle-buncher",
          x: x(Z_STAR) - 17,
          y: guideH1 + 7,
          width: 26,
          height: guideH0 - guideH1 - 7 + 8,
          rx: 13
        })]
      })
    ]
  });
}
function useGlyphMorphs(key, animate) {
  useEffect(() => {
    if (!animate) return;
    return playMorphs(key);
  }, [key, animate]);
}
var ARIA$1 = {};
function SufficientStatisticFigure({ step, entering }) {
  const cue = cuesFor(step);
  const svgRef = useRef(null);
  useGlyphMorphs(cue.key, entering);
  const [opening, setOpening] = useState({
    step,
    moved: false
  });
  if (!opening.moved && step !== opening.step) setOpening({
    step,
    moved: true
  });
  const fresh = !opening.moved && step === opening.step;
  const playSchedule = cue.is("schedules") && (entering || fresh);
  const label2 = ARIA$1[step] ?? STAGES$2[cue.stage].figureTitle;
  const scene = jsxs(Fragment$1, { children: [
    jsx(ScheduleScene, { cue }),
    jsx(ChoiceScene, { cue }),
    jsx(CdfScene, { cue })
  ] });
  return jsxs("div", {
    className: cls("figure-stage ss-chapter", entering && "ss-animate", playSchedule && "ss-play-schedule"),
    "data-step": cue.key,
    children: [
      jsx("style", { children: GLYPH_CSS }),
      jsx("div", { className: "figure-caption" }),
      jsx("svg", {
        ref: svgRef,
        className: "economics-figure",
        viewBox: `0 0 ${VIEWBOX$3.width} ${VIEWBOX$3.height}`,
        role: "img",
        "aria-label": label2,
        children: scene
      })
    ]
  });
}
({ ...HEIGHTS });
var sufficientStatisticChapter = {
  id: 3,
  slug: "03-sufficient-statistic",
  part: "I",
  title: "Bunching as a sufficient statistic",
  label: "Bunching as a sufficient statistic",
  steps: STEP_DEFS$2,
  stages: STAGES$2,
  Figure: SufficientStatisticFigure,
  viewBox: VIEWBOX$3,
  initialParameters: SUFFICIENT_STATISTIC_DEFAULTS,
  defaults: SUFFICIENT_STATISTIC_DEFAULTS
};
var { t0, t1, e, zStar } = CH1_DEFAULTS;
var LAW = betaLaw(CH1_DEFAULTS, BETA_LAW);
var A = Math.log(zStar);
var BELOW = LAW.below;
var TOP = LAW.top;
var B = TOP - BELOW;
var DELTA = e * (Math.log(1 - t0) - Math.log(1 - t1));
var SIGMA_THREE = 0.075;
var SIGMA_FIVE = SIGMA_THREE * Math.sqrt(5 / 3);
var SIGMA = SIGMA_THREE;
function normalDraws(count, seed = 40417) {
  let state = seed >>> 0;
  const uniform = () => {
    state = Math.imul(1664525, state) + 1013904223 >>> 0;
    return (state + 0.5) / 4294967296;
  };
  const out = [];
  while (out.length < count) {
    const u = uniform(), v = uniform();
    const r3 = Math.sqrt(-2 * Math.log(u));
    out.push(r3 * Math.cos(2 * Math.PI * v));
    if (out.length < count) out.push(r3 * Math.sin(2 * Math.PI * v));
  }
  return out;
}
var cachedPeople;
function people() {
  if (cachedPeople) return cachedPeople;
  const settled = baselinePeople();
  const draws = normalDraws(settled.length);
  cachedPeople = settled.map((p) => ({
    id: p.id,
    sourceIndex: p.sourceIndex,
    z: p.z,
    region: p.region,
    eps: draws[p.sourceIndex]
  })).sort((a2, b) => a2.sourceIndex - b.sourceIndex);
  return cachedPeople;
}
var recorded = (person, sigma) => person.z * Math.exp(sigma * person.eps);
var latentLower = (x2) => LAW.H0(Math.exp(x2));
var latentUpper = (x2) => LAW.H1(Math.exp(x2));
var latent = (x2) => x2 < A ? latentLower(x2) : latentUpper(x2);
var continuous = (x2) => x2 < A ? latentLower(x2) : latentUpper(x2) - B;
var densityLower = (x2) => Math.exp(x2) * LAW.density0(Math.exp(x2));
var densityUpper = (x2) => Math.exp(x2) * LAW.density1(Math.exp(x2));
var continuousDensity = (x2) => x2 < A ? densityLower(x2) : densityUpper(x2);
var phi = (u) => Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
function Phi(u) {
  const x2 = Math.abs(u) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x2);
  const y2 = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x2 * x2);
  return u >= 0 ? 0.5 * (1 + y2) : 0.5 * (1 - y2);
}
function smooth(f, x2, s, n = 280) {
  if (s <= 0) return f(x2);
  const lo = -7, h = (7 - lo) / n;
  let total = 0;
  for (let i = 0; i <= n; i += 1) {
    const u = lo + i * h;
    const w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2;
    total += w * f(x2 - s * u) * phi(u);
  }
  return total * h / 3;
}
var observed = (x2, s = SIGMA) => s <= 0 ? latent(x2) : smooth(continuous, x2, s) + B * Phi((x2 - A) / s);
var observedDensity = (x2, s = SIGMA) => smooth(continuousDensity, x2, s) + B * phi((x2 - A) / s) / s;
var candidate = (x2, sigmaPrime, s = SIGMA) => observed(x2, Math.sqrt(Math.max(0, s * s - sigmaPrime * sigmaPrime)));
var GRID_STEP = 0.08;
function grid$1(from, to, step = GRID_STEP) {
  const first2 = Math.ceil((from - A) / step), last = Math.floor((to - A) / step);
  const out = [];
  for (let j = first2; j <= last; j += 1) {
    const x2 = A + j * step;
    const p = continuous(x2 + step / 2) - continuous(x2 - step / 2) + (j === 0 ? B : 0);
    out.push({
      j,
      x: x2,
      p,
      atom: j === 0
    });
  }
  return out;
}
var gridCdf = (x2, step = GRID_STEP) => {
  const j = Math.floor((x2 - A) / step + 1e-12);
  return continuous(A + j * step + step / 2) + (j >= 0 ? B : 0);
};
var bump$1 = (g, x2, s = SIGMA) => g.p * phi((x2 - g.x) / s) / s;
var PRESSES$1 = [
  {
    key: "dropThree",
    stage: 0,
    text: "Same people, same taxes. Now each chosen income gets a random knock, and the tax data record where it lands.",
    derivationAt: null
  },
  {
    key: "settled",
    stage: 0,
    text: "Everyone in red is a buncher and chose $z^\\star$ exactly. The knocks spread them out."
  },
  {
    key: "dropFive",
    stage: 0,
    text: "More noise: the same red balls, spread wider."
  },
  {
    key: "sweep",
    stage: 1,
    text: "Pile them up from the left, as in Chapter 1.",
    derivationAt: null
  },
  {
    key: "noJump",
    stage: 1,
    text: "The problem: in the data we don't see a jump.",
    derivationAt: 0
  },
  {
    key: "friction",
    stage: 1,
    text: "Optimization error can explain this."
  },
  {
    key: "product",
    stage: 2,
    text: "Here $y$ is recorded income, $z$ is chosen income and $\\xi$ is the error.",
    derivationAt: 0
  },
  {
    key: "logs",
    stage: 2,
    text: "In logs the error adds. A tilde marks a log, and $\\nu=\\log\\xi$ is the log error.",
    derivationAt: 1
  },
  {
    key: "errorLaw",
    stage: 2,
    text: "Assume the log error is independent of the choice, with CDF $Q$ and density $q$. Log-normal error is the special case: $\\nu\\sim\\mathcal N(0,\\sigma^2)$, so $Q(v)=\\Phi(v/\\sigma)$, where $\\Phi$ is the standard normal CDF.",
    derivationAt: 2
  },
  {
    key: "latentJump",
    stage: 2,
    text: "And assume the CDF of chosen income jumps at the kink.",
    derivationAt: 3
  },
  {
    key: "ramp",
    stage: 2,
    text: "The bunchers all chose $\\log z^\\star$. Recorded, they spread like the error; their share is still $B$.",
    derivationAt: 4
  },
  {
    key: "identified",
    stage: 3,
    text: "With log-normal error, the CDF of chosen income and $\\sigma$ are identified (Cattaneo, Jansson, Ma and Slemrod 2018, “CJMS”).",
    derivationAt: null
  },
  {
    key: "intuition",
    stage: 3,
    text: "Only one $\\sigma$ brings the jump back. Undo less noise, $\\sigma'<\\sigma$, and the curve stays smooth; undo more and no CDF of chosen income could have produced the data."
  },
  {
    key: "branches",
    stage: 3,
    text: "Remove the error and both branches of the CDF of chosen income come back: $\\widetilde H_0$ below the kink and $\\widetilde H_1$ above it."
  },
  {
    key: "jump",
    stage: 3,
    text: "And so does the jump.",
    derivationAt: 0
  },
  {
    key: "sieve",
    stage: 4,
    text: "CJMS put the chosen incomes on a grid of points $\\tilde z_j$, with an unknown weight $p_j$ on each.",
    derivationAt: 0
  },
  {
    key: "likelihood",
    stage: 4,
    text: "A record is a grid point plus the error, so its density is a mix of normals. For each $\\sigma$, choose the weights that make the data most likely; then search over $\\sigma$.",
    derivationAt: 1
  },
  {
    key: "accuracy",
    stage: 4,
    text: "Identification does not settle accuracy. The answer for $\\sigma$ depends on how fine the grid is, and CJMS's consistency result covers the CDF, not $B$."
  },
  {
    key: "caveats",
    stage: 4,
    text: "Both CJMS and Aronsson, Jenderny and Lanot (2024) estimate by maximum likelihood with a normal error. They differ in the types. CJMS leave their distribution free: nonparametric maximum likelihood (NPMLE). Aronsson, Jenderny and Lanot make it parametric, a truncated normal on either side of the kink."
  },
  {
    key: "spectral",
    stage: 4,
    text: "One more route to $B$ is my spectral bunching estimator, which works with the frequencies of the data rather than its histogram. An extension to this chapter shows how it works."
  },
  {
    key: "survives",
    stage: 5,
    text: "Chapter 3's revenue effect needs only $B$ and the CDF height at $z^\\star$; both survive the noise, so Chapter 3 still works.",
    derivationAt: 0
  },
  {
    key: "gap",
    stage: 5,
    text: "But $e$ still needs $\\widetilde h_0$ across the gap. Removing the error does not show it. That is Chapter 2's missing piece.",
    derivationAt: 1
  }
];
var STEP_INDEX$1 = Object.fromEntries(PRESSES$1.map((p, i) => [p.key, i]));
var VIEWBOX$2 = {
  width: 880,
  height: 713
};
var P = CDF_PLOT;
var W = P.right - P.left;
var RELEASE_START = 0.15, RELEASE_SPAN = 4.4, FALL = 1.45;
var DROP_SECONDS = RELEASE_START + RELEASE_SPAN + FALL;
var BOARD_FADE = 0.45;
var DROP_FIVE_LEAD = 0.45;
var SWEEP_LEAD = 0.6;
var BIN_SECONDS = 0.09;
var DURATIONS = {
  dropThree: DROP_SECONDS,
  settled: 0.7,
  dropFive: DROP_FIVE_LEAD + BOARD_FADE + DROP_SECONDS,
  sweep: 0,
  noJump: 1.6,
  friction: 0.3,
  product: 0.45,
  logs: 1.6,
  errorLaw: 0.3,
  latentJump: 0.9,
  ramp: 1,
  identified: 0.8,
  intuition: 2.6,
  branches: 1.1,
  jump: 0.7,
  sieve: 1.7,
  likelihood: 1.7,
  accuracy: 0.7,
  caveats: 0.3,
  spectral: 0.3,
  survives: 1.5,
  gap: 1.1
};
var levelX = (z) => P.left + z / 250 * W;
var BIN_UNITS = levelX(5) - levelX(0);
var RADIUS = BIN_UNITS / 4 * 0.47;
var RADIUS_SOLO = 0.9 * BIN_UNITS / 2 * 0.47;
var rows = (first2, count) => Array.from({ length: count }, (_, k2) => first2 + 18 * k2);
var BOARDS = {
  three: {
    key: "three",
    sigma: SIGMA_THREE,
    rows: rows(96, 3),
    rail: 62,
    band: [84, 144],
    floor: P.bottom
  },
  five: {
    key: "five",
    sigma: SIGMA_FIVE,
    rows: rows(96, 5),
    rail: 62,
    band: [84, 180],
    floor: 330
  }
};
function pegs(board) {
  const out = [];
  board.rows.forEach((y2, k2) => {
    for (let x2 = levelX(6) + (k2 % 2 ? 16 / 2 : 0); x2 <= levelX(240); x2 += 16) out.push([x2, y2]);
  });
  return out;
}
function hash$1(i, k2) {
  let h = (Math.imul(i + 1, 2654435761) ^ Math.imul(k2 + 7, 40503)) >>> 0;
  h = Math.imul(h ^ h >>> 15, 2246822507) >>> 0;
  return ((h ^ h >>> 13) >>> 0) / 4294967296;
}
var layouts = new Map();
function balls(board) {
  const cached = layouts.get(board.key);
  if (cached) return cached;
  const list = people();
  const n = list.length;
  const out = list.map((person, i) => {
    const y2 = recorded(person, board.sigma);
    const release = RELEASE_START + RELEASE_SPAN * i / n;
    const gutter = y2 < 0 ? -1 : y2 > 250 ? 1 : 0;
    const bin = Math.floor(y2 / 5);
    const x0 = levelX(person.z);
    const xT = gutter ? gutter < 0 ? P.left - 6 : P.right + 6 : levelX(y2);
    const jitter = board.rows.map((_, k2) => k2 === board.rows.length - 1 ? 0 : (hash$1(i, k2) < 0.5 ? -1 : 1) * 16 * 0.42);
    return {
      person,
      region: person.region,
      y: y2,
      release,
      x0,
      xT,
      jitter,
      slot: [0, 0],
      solo: [0, 0],
      bin,
      gutter
    };
  });
  const key = (b) => b.gutter ? 1e6 * b.gutter : b.bin;
  const gutterX = (k2) => k2 < 0 ? P.left - 6 : P.right + 6;
  const settle = (radius) => stackBalls({
    count: out.length,
    bin: (i) => key(out[i]),
    dropX: (i) => out[i].xT,
    walls: (k2) => Math.abs(k2) >= 1e6 ? [gutterX(k2) - radius, gutterX(k2) + radius] : [levelX(k2 * 5), levelX((k2 + 1) * 5)],
    radius
  });
  const shared = settle(RADIUS);
  out.forEach((ball2, i) => {
    ball2.slot = [shared.x[i], board.floor - shared.h[i]];
  });
  if (board.key === "three") {
    const solo = settle(RADIUS_SOLO);
    out.forEach((ball2, i) => {
      ball2.solo = [solo.x[i], board.floor - solo.h[i]];
    });
  } else out.forEach((ball2) => {
    ball2.solo = ball2.slot;
  });
  layouts.set(board.key, out);
  return out;
}
var TRACE$1 = {
  lag: 0.12,
  samples: 6,
  capRadii: 13.6
};
var HOP = 0.12;
var topFall = (board) => 0.3 + (board.rows[0] - board.rail) / 1400;
var ease$1 = (u) => u * u;
var clamp01$5 = (u) => Math.max(0, Math.min(1, u));
function ballAt(ball2, board, tau, slot = ball2.slot) {
  let s = tau - ball2.release;
  if (s < 0) return null;
  const R = board.rows.length;
  const TOP_FALL = topFall(board);
  if (s < TOP_FALL) return [ball2.x0, board.rail + (board.rows[0] - board.rail) * ease$1(s / TOP_FALL)];
  s -= TOP_FALL;
  const D2 = ball2.xT - ball2.x0;
  const xs2 = [ball2.x0, ...board.rows.map((_, k2) => ball2.x0 + D2 * (k2 + 1) / R + ball2.jitter[k2])];
  const ys = [...board.rows, board.band[1] + 8];
  for (let k2 = 0; k2 < R; k2 += 1) {
    if (s < HOP) {
      const u2 = s / HOP;
      return [xs2[k2] + (xs2[k2 + 1] - xs2[k2]) * u2, ys[k2] + (ys[k2 + 1] - ys[k2]) * u2 - 7 * Math.sin(Math.PI * u2) * (1 - u2)];
    }
    s -= HOP;
  }
  const rest = FALL - TOP_FALL - R * HOP;
  const u = clamp01$5(s / Math.max(0.2, rest));
  if (u >= 1) return slot;
  return [xs2[R] + (slot[0] - xs2[R]) * u, ys[R] + (slot[1] - ys[R]) * ease$1(u)];
}
var sweepCache;
function makeSweep() {
  const board = BOARDS.three;
  const list = balls(board).filter((b) => !b.gutter);
  const ranked = [...list].sort((a2, b) => a2.y - b.y || a2.person.sourceIndex - b.person.sourceIndex);
  const n = ranked.length;
  const rankOf = new Map(ranked.map((b, i) => [b, i]));
  const runs = [];
  ranked.forEach((b, i) => {
    const last = runs[runs.length - 1];
    if (last && last.region === b.region) last.to = (i + 1) / n;
    else runs.push({
      region: b.region,
      from: i / n,
      to: (i + 1) / n
    });
  });
  const binIds = [...new Set(ranked.map((b) => b.bin))].sort((a2, b) => a2 - b);
  const bins = [];
  let count = 0, clock = SWEEP_LEAD;
  for (let bin = binIds[0]; bin <= binIds[binIds.length - 1]; bin += 1) {
    const k2 = list.filter((b) => b.bin === bin).length;
    bins.push({
      bin,
      right: levelX((bin + 1) * 5),
      start: clock,
      end: clock + BIN_SECONDS,
      from: count / n,
      to: (count + k2) / n
    });
    count += k2;
    clock += BIN_SECONDS;
  }
  const sortedY = ranked.map((b) => b.y);
  return {
    list,
    ranked,
    rankOf,
    runs,
    bins,
    duration: clock + 0.35,
    n,
    sortedY
  };
}
var sweep = () => sweepCache ??= makeSweep();
DURATIONS.sweep = sweep().duration;
var TIMELINE$1 = createTimeline(PRESSES$1.map((p) => ({
  key: p.key,
  duration: DURATIONS[p.key]
})));
var I$1 = STEP_INDEX$1;
function sceneAt$1(t) {
  const index = TIMELINE$1.ends.findIndex((end) => t <= end + 1e-8);
  const step = index < 0 ? PRESSES$1.length - 1 : index;
  const span = TIMELINE$1.ends[step] - TIMELINE$1.starts[step];
  return {
    step,
    key: PRESSES$1[step].key,
    progress: span > 0 ? clamp01$5((t - TIMELINE$1.starts[step]) / span) : 1
  };
}
function pr(t, key, a2 = 0, b = 1) {
  const i = I$1[key];
  const start = TIMELINE$1.starts[i], end = TIMELINE$1.ends[i];
  const from = start + (end - start) * a2, to = start + (end - start) * b;
  if (t <= from) return 0;
  if (t >= to) return 1;
  return (t - from) / (to - from);
}
var since$1 = (t, key) => t - TIMELINE$1.starts[I$1[key]];
var smoothstep$1 = (u) => {
  const x2 = clamp01$5(u);
  return x2 * x2 * (3 - 2 * x2);
};
var WINDOW = {
  zLo: 35,
  zHi: 200,
  vLo: 0,
  vHi: 1.08
};
var STRIP$1 = {
  cdfBottom: 384,
  top: 452
};
var lerp$5 = (a2, b, u) => a2 + (b - a2) * u;
var xFull = levelX;
var xZoom = (z) => P.left + (z - WINDOW.zLo) / (WINDOW.zHi - WINDOW.zLo) * W;
var xLog = (z) => P.left + Math.log(Math.max(1e-9, z) / WINDOW.zLo) / Math.log(WINDOW.zHi / WINDOW.zLo) * W;
var yFull = (v) => P.bottom - v / 1.08 * (P.bottom - P.top);
var yZoom = (v) => P.bottom - (v - WINDOW.vLo) / (WINDOW.vHi - WINDOW.vLo) * (P.bottom - P.top);
var yStrip = (v) => STRIP$1.cdfBottom - (v - WINDOW.vLo) / (WINDOW.vHi - WINDOW.vLo) * (STRIP$1.cdfBottom - P.top);
var CROP = {
  xLo: Math.log(zStar) - 0.48,
  xHi: Math.log(zStar) + 0.32,
  vLo: 0.18,
  vHi: 0.94
};
var xCrop = (z) => P.left + (Math.log(Math.max(1e-9, z)) - CROP.xLo) / (CROP.xHi - CROP.xLo) * W;
var yCrop = (v) => P.bottom - (v - CROP.vLo) / (CROP.vHi - CROP.vLo) * (P.bottom - P.top);
function camera$1(t) {
  const zoom2 = smoothstep$1(pr(t, "noJump", 0, 0.85));
  const warp = smoothstep$1(pr(t, "logs", 0, 0.8));
  const crop = smoothstep$1(pr(t, "intuition", 0, 0.3)) * (1 - smoothstep$1(pr(t, "branches", 0, 0.45)));
  const strip2 = smoothstep$1(pr(t, "sieve", 0, 0.45)) * (1 - smoothstep$1(pr(t, "survives", 0, 0.45)));
  const base = (z) => warp > 0 ? lerp$5(xZoom(z), xLog(z), warp) : lerp$5(xFull(z), xZoom(z), zoom2);
  const X2 = (z) => crop > 0 ? lerp$5(base(z), xCrop(z), crop) : base(z);
  const XL = (x2) => X2(Math.exp(x2));
  const Y = (v) => lerp$5(lerp$5(lerp$5(yFull(v), yZoom(v), zoom2), yCrop(v), crop), yStrip(v), strip2);
  return {
    zoom: zoom2,
    warp,
    crop,
    strip: strip2,
    X: X2,
    XL,
    Y,
    cdfBottom: lerp$5(P.bottom, STRIP$1.cdfBottom, strip2)
  };
}
var LOG_RANGE = [Math.log(WINDOW.zLo) - 0.02, Math.log(WINDOW.zHi) + 0.02];
var open = false;
var openStep = -1;
var listeners = new Set();
var subscribe = (fn2) => {
  listeners.add(fn2);
  return () => {
    listeners.delete(fn2);
  };
};
var getSnapshot = () => open ? openStep : -1;
var getServerSnapshot = () => -1;
function setProof(step) {
  const next = step === null ? -1 : step;
  if ((open ? openStep : -1) === next) return;
  open = next >= 0;
  openStep = next;
  listeners.forEach((fn2) => fn2());
}
var r$5 = String.raw;
var PROOF_TEX = {
  cf: r$5`\psi_{\tilde y}(s)=\mathbb E\,\exp(is\tilde y)=\mathbb E\,\exp(is\tilde z)\;\mathbb E\,\exp(is\nu)=\psi_{\tilde z}(s)\,\exp(-\sigma^2s^2/2)`,
  second: r$5`\psi_{\tilde z}(s)\,\exp(-\sigma^2s^2/2)=\psi'_{\tilde z}(s)\,\exp(-\sigma'^2s^2/2)`,
  divide: r$5`\psi_{\tilde z}(s)=\psi'_{\tilde z}(s)\,\exp\bigl(-(\sigma'^2-\sigma^2)s^2/2\bigr)`,
  invert: r$5`\psi_{\tilde z}(s)=\psi_{\tilde y}(s)\,\exp(\sigma^2s^2/2)`
};
var M$2 = ({ tex }) => jsx(InlineMath, { tex });
function ProofButton({ step }) {
  const open2 = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) === step;
  return jsxs("button", {
    type: "button",
    className: "rf-proof-toggle",
    "aria-expanded": open2,
    "aria-controls": "rf-proof-card",
    onClick: () => setProof(open2 ? null : step),
    children: ["Proof ", open2 ? "▾" : "▸"]
  });
}
function ProofCard({ step }) {
  if (useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) !== step) return null;
  return jsxs("section", {
    id: "rf-proof-card",
    className: "rf-proof-card",
    "aria-label": "Proof of identification",
    children: [
      jsxs("header", { children: [jsxs("h3", { children: [
        "Why ",
        jsx(M$2, { tex: r$5`\sigma` }),
        " and the CDF of chosen income are identified"
      ] }), jsx("button", {
        type: "button",
        className: "rf-proof-close",
        onClick: () => setProof(null),
        "aria-label": "Close the proof",
        children: "×"
      })] }),
      jsx("p", {
        className: "rf-proof-source",
        children: "Cattaneo, Jansson, Ma and Slemrod (2018), in logs."
      }),
      jsxs("ol", {
        className: "rf-proof-assume",
        children: [
          jsxs("li", { children: [
            jsx(M$2, { tex: r$5`y_i=\xi_i z_i` }),
            ", with ",
            jsx(M$2, { tex: r$5`\xi_i` }),
            " independent of ",
            jsx(M$2, { tex: r$5`z_i` }),
            ", iid."
          ] }),
          jsxs("li", { children: [
            jsx(M$2, { tex: r$5`\nu=\log\xi\sim\mathcal N(0,\sigma^2)` }),
            ", with ",
            jsx(M$2, { tex: r$5`\sigma>0` }),
            " unknown."
          ] }),
          jsxs("li", { children: [
            "The CDF of chosen log income jumps at the known kink: ",
            jsx(M$2, { tex: r$5`B>0` }),
            "."
          ] })
        ]
      }),
      jsx("p", { children: "Characteristic functions multiply under independent addition:" }),
      jsx(BlockMath$1, { tex: PROOF_TEX.cf }),
      jsxs("p", { children: [
        "Suppose a second pair ",
        jsx(M$2, { tex: r$5`(\widetilde H',\sigma')` }),
        " with ",
        jsx(M$2, { tex: r$5`\sigma'>\sigma` }),
        " fits the same data:"
      ] }),
      jsx(BlockMath$1, { tex: PROOF_TEX.second }),
      jsx(BlockMath$1, { tex: PROOF_TEX.divide }),
      jsxs("p", { children: [
        "Then ",
        jsx(M$2, { tex: r$5`\tilde z` }),
        " has the law of ",
        jsx(M$2, { tex: r$5`\tilde z'` }),
        " plus independent ",
        jsx(M$2, { tex: r$5`\mathcal N(0,\sigma'^2-\sigma^2)` }),
        " noise, so its CDF is continuous: no jump, which contradicts (3). So ",
        jsx(M$2, { tex: r$5`\sigma` }),
        " is unique, and"
      ] }),
      jsx(BlockMath$1, { tex: PROOF_TEX.invert }),
      jsxs("p", { children: [
        "gives ",
        jsx(M$2, { tex: r$5`\widetilde H` }),
        " by Fourier inversion (the Gaussian factor never vanishes), hence ",
        jsx(M$2, { tex: r$5`B` }),
        ",",
        " ",
        jsx(M$2, { tex: r$5`\widetilde H_0` }),
        " below ",
        jsx(M$2, { tex: r$5`\log z^\star` }),
        " and ",
        jsx(M$2, { tex: r$5`\widetilde H_1` }),
        " at and above it."
      ] }),
      jsxs("p", { children: [
        jsx("strong", { children: "Why (3) is needed." }),
        " Without it every ",
        jsx(M$2, { tex: r$5`\sigma'<\sigma` }),
        " fits, with chosen log income",
        " ",
        jsx(M$2, { tex: r$5`\tilde z+\mathcal N(0,\sigma^2-\sigma'^2)` }),
        ", which has no jump."
      ] }),
      jsxs("p", { children: [
        jsx("strong", { children: "Not identified." }),
        " ",
        jsx(M$2, { tex: r$5`\widetilde h_0` }),
        " across ",
        jsx(M$2, { tex: r$5`(\log z^\star,\log z^\star+\Delta)` }),
        ", hence ",
        jsx(M$2, { tex: r$5`e` }),
        "."
      ] }),
      jsx("p", {
        className: "rf-proof-source",
        children: "CJMS write the error additively in levels; this is the log analogue, which leaves the argument unchanged."
      })
    ]
  });
}
var C = {
  ...C$2,
  muted: "#8d877d",
  peg: "#9c968b"
};
var COLOR$2 = (region) => C[region];
var lerp$4 = (a2, b, u) => a2 + (b - a2) * u;
var N_CURVE = 220;
var xs = Array.from({ length: N_CURVE }, (_, i) => LOG_RANGE[0] + (LOG_RANGE[1] - LOG_RANGE[0]) * i / (N_CURVE - 1));
var obsCache;
var observedCurve = () => obsCache ??= xs.map((x2) => observed(x2));
var densCache;
var densityCurve = () => densCache ??= xs.map((x2) => observedDensity(x2));
var GRID = grid$1(LOG_RANGE[0] - 5 * SIGMA, LOG_RANGE[1] + 5 * SIGMA);
var VISIBLE_GRID = GRID.filter((g) => g.x >= LOG_RANGE[0] + 0.03 && g.x <= LOG_RANGE[1] - 0.03);
var DENSITY_MAX = Math.max(...densityCurve()) * 1.12;
var STEM_MAX = Math.max(...GRID.map((g) => g.p)) * 1.25;
var traceCache = new Map();
var trace = (fraction) => {
  let v = traceCache.get(fraction);
  if (!v) {
    v = xs.map((x2) => candidate(x2, fraction * SIGMA));
    traceCache.set(fraction, v);
  }
  return v;
};
var TRACE_FRACTIONS = [
  0.5,
  0.75,
  0.9
];
var HEIGHT_DX = -30;
function curve$1(ctx, cam, values, color, width, dash = [], from = -Infinity, to = Infinity) {
  const pts = [];
  xs.forEach((x2, i) => {
    if (x2 >= from && x2 <= to) pts.push([cam.XL(x2), cam.Y(values[i])]);
  });
  stroke$1(ctx, pts, color, width, dash);
}
function fn(ctx, cam, f, from, to, color, width, dash = [], n = 120) {
  stroke$1(ctx, Array.from({ length: n + 1 }, (_, i) => {
    const x2 = from + (to - from) * i / n;
    return [cam.XL(x2), cam.Y(f(x2))];
  }), color, width, dash);
}
function alpha(ctx, a2, draw2) {
  if (a2 <= 2e-3) return;
  const old = ctx.globalAlpha;
  ctx.globalAlpha = old * Math.min(1, a2);
  draw2();
  ctx.globalAlpha = old;
}
function ball(ctx, x2, y2, r3, color) {
  ctx.beginPath();
  ctx.arc(x2, y2, r3, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}
function drawBoard(ctx, board, tau, dimOthers, frame, pegsAlpha = frame, pack = 1) {
  alpha(ctx, pegsAlpha, () => {
    ctx.fillStyle = "rgba(41,39,34,.055)";
    ctx.fillRect(levelX(2), board.band[0], levelX(244) - levelX(2), board.band[1] - board.band[0]);
    ctx.fillStyle = C.peg;
    for (const [x2, y2] of pegs(board)) {
      ctx.beginPath();
      ctx.arc(x2, y2, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  alpha(ctx, frame, () => {
    stroke$1(ctx, [[P.left, board.floor], [P.right, board.floor]], C.ink, 1.5);
    stroke$1(ctx, [[levelX(zStar), board.floor], [levelX(zStar), board.floor + 7]], C.ink, 1.5);
  });
  const list = balls(board);
  const radius = lerp$4(RADIUS_SOLO, RADIUS, pack) * 1.1;
  const endOf = (b) => pack >= 1 ? b.slot : [lerp$4(b.solo[0], b.slot[0], pack), lerp$4(b.solo[1], b.slot[1], pack)];
  const shade = (b) => frame * (b.region === "buncher" ? 1 : 1 - 0.7 * dimOthers);
  const reduced = prefersReducedMotion();
  const traces = {
    lower: [],
    upper: [],
    buncher: []
  };
  for (const b of list) {
    const end = endOf(b);
    const now = ballAt(b, board, tau, end);
    if (!now || now === end) continue;
    const path2 = ballTrace((time) => ballAt(b, board, time, end), tau, {
      lag: TRACE$1.lag,
      samples: TRACE$1.samples,
      cap: TRACE$1.capRadii * radius,
      reduced
    });
    if (path2) traces[b.region].push({
      path: path2,
      radius,
      strength: 1
    });
  }
  for (const region of [
    "lower",
    "upper",
    "buncher"
  ]) if (traces[region].length) alpha(ctx, frame * (region === "buncher" ? 1 : 1 - 0.7 * dimOthers), () => drawTraces(ctx, traces[region], COLOR$2(region)));
  for (const pass of [0, 1]) for (const b of list) {
    if (b.region === "buncher" !== (pass === 1)) continue;
    const pos = ballAt(b, board, tau, endOf(b));
    if (!pos) continue;
    alpha(ctx, shade(b), () => ball(ctx, pos[0], pos[1], radius, COLOR$2(b.region)));
  }
  const tops = new Map();
  for (const b of list) {
    if (b.gutter) continue;
    const end = endOf(b);
    if (ballAt(b, board, tau, end) !== end) continue;
    tops.set(b.bin, Math.min(tops.get(b.bin) ?? Infinity, end[1]));
  }
  if (tops.size) alpha(ctx, frame * 0.5, () => {
    const bins = [...tops.keys()].sort((a2, b) => a2 - b);
    ctx.beginPath();
    ctx.strokeStyle = C.muted;
    ctx.lineWidth = 1;
    let last = -Infinity;
    for (const k2 of bins) {
      const x0 = levelX(k2 * 5), x1 = levelX((k2 + 1) * 5), y2 = tops.get(k2) - radius - 0.5;
      if (k2 !== last + 1) {
        if (last > -Infinity) ctx.lineTo(levelX((last + 1) * 5), board.floor);
        ctx.moveTo(x0, board.floor);
      }
      ctx.lineTo(x0, y2);
      ctx.lineTo(x1, y2);
      last = k2;
    }
    ctx.lineTo(levelX((last + 1) * 5), board.floor);
    ctx.stroke();
  });
}
function towerRuns(upTo) {
  return sweep().runs.filter((r3) => r3.from < upTo).map((r3) => ({
    ...r3,
    to: Math.min(r3.to, upTo)
  }));
}
function drawSweep(ctx, t, cam) {
  const s = sweep();
  const local = since$1(t, "sweep");
  const done = t >= TIMELINE$1.ends[I$1.sweep];
  const ghostFade = 1 - smoothstep$1(pr(t, "noJump", 0, 0.5));
  const active = s.bins.find((b) => local < b.end);
  const wallShare = done || !active ? 1 : active.from + (active.to - active.from) * smoothstep$1((local - active.start) / (active.end - active.start));
  const towerW = 6;
  alpha(ctx, 0.17 * ghostFade, () => {
    for (const b of s.bins) {
      if (!done && local < b.end) break;
      if (b.to <= 0) continue;
      const left = cam.X(b.bin * 5) + 1, right = cam.X((b.bin + 1) * 5) - 1;
      for (const run of towerRuns(b.to)) {
        ctx.fillStyle = C[run.region];
        ctx.fillRect(left, cam.Y(run.to), right - left, cam.Y(run.from) - cam.Y(run.to));
      }
    }
  });
  if (!done && active && local >= s.bins[0].start) {
    const wallX = lerp$4(cam.X(active.bin * 5), active.right, smoothstep$1((local - active.start) / (active.end - active.start)));
    for (const run of towerRuns(wallShare)) {
      ctx.fillStyle = C[run.region];
      ctx.fillRect(wallX - towerW, cam.Y(run.to), towerW, cam.Y(run.from) - cam.Y(run.to));
    }
    stroke$1(ctx, [[wallX, P.top + 10], [wallX, P.bottom]], C.ink, 1, [2, 4]);
  }
  if (!done) for (const b of s.ranked) {
    if (active && b.bin < active.bin) continue;
    const rank = s.rankOf.get(b);
    let [x2, y2] = b.slot;
    let r3 = RADIUS * 1.1;
    if (active && b.bin === active.bin && local >= active.start) {
      const u = smoothstep$1((local - active.start) / (active.end - active.start));
      x2 = lerp$4(x2, active.right - 3, u);
      y2 = lerp$4(y2, cam.Y((rank + 0.5) / s.n), u);
      r3 = lerp$4(RADIUS * 1.1, 0.5, u);
    }
    ball(ctx, x2, y2, r3, COLOR$2(b.region));
  }
  const exact = smoothstep$1(pr(t, "noJump", 0.1, 0.6));
  const toSmooth = smoothstep$1(pr(t, "logs", 0.45, 1));
  alpha(ctx, 1 - exact, () => {
    const pts = [[P.left, cam.Y(0)]];
    let prev = 0;
    for (const b of s.bins) {
      if (!done && local < b.end) break;
      pts.push([b.right, cam.Y(prev)], [b.right, cam.Y(b.to)]);
      prev = b.to;
    }
    if (pts.length > 1) stroke$1(ctx, pts, C.ink, 1.5);
  });
  alpha(ctx, exact * (1 - toSmooth), () => {
    const pts = [[P.left - 40, cam.Y(0)]];
    s.sortedY.forEach((y2, i) => {
      const x2 = cam.X(y2);
      pts.push([x2, cam.Y(i / s.n)], [x2, cam.Y((i + 1) / s.n)]);
    });
    pts.push([P.right + 40, cam.Y(1)]);
    stroke$1(ctx, pts, C.ink, 1.6);
  });
}
function drawCurves(ctx, t, cam) {
  const smoothIn = smoothstep$1(pr(t, "logs", 0.45, 1));
  const recovered = smoothstep$1(pr(t, "branches", 0, 0.8));
  const survivesBack = smoothstep$1(pr(t, "survives", 0, 0.45));
  const staircase = smoothstep$1(pr(t, "sieve", 0.4, 0.8)) * (1 - survivesBack);
  alpha(ctx, smoothIn * lerp$4(1, 0.55, recovered), () => curve$1(ctx, cam, observedCurve(), C.ink, 2.2));
  alpha(ctx, smoothstep$1(pr(t, "latentJump", 0, 0.8)) * (1 - smoothstep$1(pr(t, "identified", 0, 0.8))) * 0.75, () => {
    fn(ctx, cam, latentLower, LOG_RANGE[0], A, C.lower, 2.4, [6, 5]);
    fn(ctx, cam, latentUpper, A, LOG_RANGE[1], C.upper, 2.4, [6, 5]);
    stroke$1(ctx, [[cam.XL(A), cam.Y(BELOW)], [cam.XL(A), cam.Y(TOP)]], C.buncher, 2.6, [6, 5]);
  });
  const sweepU = pr(t, "intuition", 0, 0.85);
  if (t > TIMELINE$1.starts[I$1.intuition] && t < TIMELINE$1.ends[I$1.gap] + 1) {
    const fadeTraces = 1 - smoothstep$1(pr(t, "branches", 0, 0.6));
    for (const f of TRACE_FRACTIONS) if (sweepU * 1 >= f) alpha(ctx, 0.32 * fadeTraces, () => curve$1(ctx, cam, trace(f), C.ink, 1.4));
    const live = smoothstep$1(sweepU);
    if (live < 1) curve$1(ctx, cam, xs.map((x2) => candidate(x2, live * SIGMA)), C.muted, 2.4);
    else alpha(ctx, 1 - recovered, () => {
      fn(ctx, cam, latentLower, LOG_RANGE[0], A, C.muted, 2.4);
      fn(ctx, cam, latentUpper, A, LOG_RANGE[1], C.muted, 2.4);
      stroke$1(ctx, [[cam.XL(A), cam.Y(BELOW)], [cam.XL(A), cam.Y(TOP)]], C.muted, 2.4);
    });
  }
  if (recovered > 0) {
    const reach = lerp$4(LOG_RANGE[0], LOG_RANGE[1], recovered);
    alpha(ctx, 1 - staircase, () => {
      fn(ctx, cam, latentLower, LOG_RANGE[0], Math.min(A, reach), C.lower, 3);
      if (reach > A) fn(ctx, cam, latentUpper, A, reach, C.upper, 3);
    });
  }
  const jump2 = smoothstep$1(pr(t, "jump", 0, 0.7));
  if (jump2 > 0) alpha(ctx, 1 - staircase, () => {
    stroke$1(ctx, [[cam.XL(A), cam.Y(BELOW)], [cam.XL(A), cam.Y(lerp$4(BELOW, TOP, jump2))]], C.buncher, 4);
    alpha(ctx, jump2, () => {
      for (const h of [BELOW, TOP]) stroke$1(ctx, [[P.left, cam.Y(h)], [cam.XL(A), cam.Y(h)]], C.buncher, 1, [3, 5]);
    });
  });
  if (staircase > 0) alpha(ctx, staircase, () => {
    let prevY = gridCdf(LOG_RANGE[0]);
    let x0 = LOG_RANGE[0];
    for (const g of VISIBLE_GRID) {
      const color = g.atom ? C.buncher : g.x < A ? C.lower : C.upper;
      stroke$1(ctx, [[cam.XL(x0), cam.Y(prevY)], [cam.XL(g.x), cam.Y(prevY)]], g.x <= A ? C.lower : C.upper, 2.6);
      const nextY = gridCdf(g.x);
      stroke$1(ctx, [[cam.XL(g.x), cam.Y(prevY)], [cam.XL(g.x), cam.Y(nextY)]], color, g.atom ? 3.4 : 2.6);
      prevY = nextY;
      x0 = g.x;
    }
    stroke$1(ctx, [[cam.XL(x0), cam.Y(prevY)], [cam.XL(LOG_RANGE[1]), cam.Y(prevY)]], C.upper, 2.6);
  });
  const glow2 = pr(t, "survives", 0.35, 1);
  const glowOut = 1 - smoothstep$1(pr(t, "gap", 0, 0.4));
  if (glow2 > 0 && t >= TIMELINE$1.starts[I$1.survives] && glowOut > 0) {
    const halo = 0.16 + 0.22 * Math.sin(Math.PI * Math.min(1, glow2 * 1.4)) ** 2;
    alpha(ctx, smoothstep$1(glow2 * 2) * glowOut, () => {
      ctx.save();
      ctx.globalAlpha *= halo;
      ctx.lineCap = "round";
      stroke$1(ctx, [[cam.XL(A), cam.Y(BELOW)], [cam.XL(A), cam.Y(TOP)]], C.buncher, 16);
      stroke$1(ctx, [[cam.XL(A) + HEIGHT_DX, cam.Y(TOP)], [cam.XL(A) + HEIGHT_DX, cam.Y(1)]], C.upper, 12);
      ctx.restore();
      const bx = cam.XL(A) + HEIGHT_DX;
      stroke$1(ctx, [[bx, cam.Y(TOP)], [bx, cam.Y(1)]], C.upper, 2.4);
      for (const v of [TOP, 1]) stroke$1(ctx, [[bx - 6, cam.Y(v)], [bx + 6, cam.Y(v)]], C.upper, 2.4);
    });
  }
  const gap = smoothstep$1(pr(t, "gap", 0, 0.8));
  if (gap > 0) {
    const reach = A + DELTA * gap;
    alpha(ctx, gap, () => {
      const top = Array.from({ length: 61 }, (_, i) => {
        const x2 = A + (reach - A) * i / 60;
        return [cam.XL(x2), cam.Y(latentLower(x2))];
      });
      ctx.save();
      ctx.globalAlpha *= 0.16;
      ctx.fillStyle = C.lower;
      ctx.beginPath();
      ctx.moveTo(cam.XL(A), cam.Y(BELOW));
      for (const [x2, y2] of top) ctx.lineTo(x2, y2);
      ctx.lineTo(cam.XL(reach), cam.Y(BELOW));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      stroke$1(ctx, top, C.lower, 2.6, [5, 5]);
      stroke$1(ctx, [[cam.XL(A), cam.Y(BELOW)], [cam.XL(reach), cam.Y(BELOW)]], C.ink, 2);
      for (const x2 of [A, reach]) stroke$1(ctx, [[cam.XL(x2), cam.Y(BELOW) - 7], [cam.XL(x2), cam.Y(BELOW) + 7]], C.ink, 2);
      if (gap >= 1) dot$1(ctx, cam.XL(A + DELTA), cam.Y(TOP), C.lower, 5, true);
    });
  }
}
function drawStrip$1(ctx, t, cam) {
  const show2 = cam.strip;
  if (show2 <= 0.01) return;
  const stems = smoothstep$1(pr(t, "sieve", 0.45, 1));
  const bumps = smoothstep$1(pr(t, "likelihood", 0, 0.75));
  const total = smoothstep$1(pr(t, "likelihood", 0.45, 1));
  const ring2 = smoothstep$1(pr(t, "accuracy", 0, 0.8));
  const base = P.bottom, top = STRIP$1.top;
  const D2 = (d2) => base - d2 / DENSITY_MAX * (base - top);
  const S = (p) => base - p / STEM_MAX * (base - top) * stems;
  alpha(ctx, show2, () => {
    stroke$1(ctx, [[P.left, top - 8], [P.left, base]], C.ink, 1.5);
    for (const g of VISIBLE_GRID) {
      const color = g.atom ? C.buncher : g.x < A ? C.lower : C.upper;
      if (bumps > 0) alpha(ctx, 0.85 * bumps, () => {
        stroke$1(ctx, Array.from({ length: 61 }, (_, i) => {
          const x2 = g.x - 3.2 * SIGMA + 6.4 * SIGMA * i / 60;
          return [cam.XL(x2), D2(bump$1(g, x2) * bumps)];
        }), color, 1.4);
      });
      if (stems > 0) {
        stroke$1(ctx, [[cam.XL(g.x), base], [cam.XL(g.x), S(g.p)]], color, g.atom ? 3 : 2);
        dot$1(ctx, cam.XL(g.x), S(g.p), color, g.atom ? 4 : 3);
      }
    }
    if (total > 0) alpha(ctx, total, () => stroke$1(ctx, xs.map((x2, i) => [cam.XL(x2), D2(densityCurve()[i])]), C.ink, 2.4));
    if (ring2 > 0) {
      const g = VISIBLE_GRID.find((p) => p.atom);
      ctx.save();
      ctx.globalAlpha *= ring2;
      ctx.beginPath();
      ctx.ellipse(cam.XL(g.x), S(g.p), 15, 15, 0, 0, Math.PI * 2);
      ctx.strokeStyle = C.buncher;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  });
}
var sinceFive = (t) => since$1(t, "dropFive") - DROP_FIVE_LEAD;
function draw$1(ctx, t, _assets, theme) {
  ctx.clearRect(0, 0, VIEWBOX$2.width, VIEWBOX$2.height);
  ctx.fillStyle = theme.paper;
  ctx.fillRect(0, 0, VIEWBOX$2.width, VIEWBOX$2.height);
  const { step } = sceneAt$1(t);
  const cam = camera$1(t);
  if (step <= I$1.dropFive || step === I$1.sweep) {
    const dim = smoothstep$1(pr(t, "settled")) * (1 - smoothstep$1(pr(t, "sweep", 0, 0.12)));
    const frameFade = 1 - smoothstep$1(pr(t, "sweep", 0, 0.1));
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, VIEWBOX$2.width, VIEWBOX$2.height);
    ctx.clip();
    if (step >= I$1.dropFive) {
      const reveal = smoothstep$1(Math.min(1, sinceFive(t) / 0.4));
      const tau = sinceFive(t) - 0.45;
      drawBoard(ctx, BOARDS.five, tau, dim, reveal * frameFade);
    }
    const makeRoom = step >= I$1.dropFive ? smoothstep$1(Math.min(1, sinceFive(t) / 0.4)) : 0;
    if (step < I$1.sweep) drawBoard(ctx, BOARDS.three, since$1(t, "dropThree"), dim, 1, 1 - makeRoom, makeRoom);
    ctx.restore();
  }
  const axisIn = smoothstep$1(pr(t, "sweep", 0, 0.12));
  if (step >= I$1.sweep) {
    alpha(ctx, axisIn, () => stroke$1(ctx, [[P.left, P.top], [P.left, cam.cdfBottom]], C.ink, 1.5));
    stroke$1(ctx, [[P.left, P.bottom], [P.right, P.bottom]], C.ink, 1.5);
    stroke$1(ctx, [[cam.X(zStar), P.bottom], [cam.X(zStar), P.bottom + 7]], C.ink, 1.5);
    alpha(ctx, smoothstep$1(pr(t, "noJump", 0.5, 1)), () => stroke$1(ctx, [[cam.X(zStar), P.top], [cam.X(zStar), cam.cdfBottom]], C.ink, 1, [4, 5]));
    ctx.save();
    ctx.beginPath();
    ctx.rect(P.left + 1, P.top - 4, P.right - P.left + 6, P.bottom - P.top + 3);
    ctx.clip();
    if (step <= I$1.logs) drawSweep(ctx, t, cam);
    if (step >= I$1.logs) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(P.left + 1, P.top - 4, P.right - P.left + 6, cam.cdfBottom - P.top + 3);
      ctx.clip();
      drawCurves(ctx, t, cam);
      ctx.restore();
    }
    drawStrip$1(ctx, t, cam);
    ctx.restore();
  } else if (step >= I$1.dropThree) {
  }
}
function Label$2({ tex, x: x2, y: y2, width = 160, anchor = "start", halo = true, color }) {
  return jsx("g", {
    className: halo ? "cdf-glyph-halo" : void 0,
    style: color ? { color } : void 0,
    opacity: 1,
    children: jsx(SvgMathLabel, {
      tex,
      x: x2,
      y: y2,
      width,
      height: 48,
      anchor,
      className: `cdf-label${color ? " rf-coloured" : ""}`
    })
  });
}
function Overlay$1({ t }) {
  const { step } = sceneAt$1(t);
  const cam = camera$1(t);
  const r3 = String.raw;
  const fade = (a2, node, key) => a2 > 0.01 ? jsx("g", {
    opacity: Math.min(1, a2),
    children: node
  }, key) : null;
  const out = [];
  if (step <= I$1.dropFive || step === I$1.sweep) {
    if (step >= I$1.dropFive) out.push(fade((1 - smoothstep$1(pr(t, "sweep", 0, 0.1))) * smoothstep$1(sinceFive(t) / 0.4), jsx(Label$2, {
      tex: r3`z^\star`,
      x: levelX(zStar),
      y: BOARDS.five.floor + 36,
      anchor: "middle",
      width: 90
    }), "zs5"));
    if (step >= I$1.dropFive) {
      const rowsIn = (1 - smoothstep$1(pr(t, "sweep", 0, 0.1))) * smoothstep$1(sinceFive(t) / 0.4);
      out.push(fade(rowsIn, jsx(Label$2, {
        tex: r3`\text{more noise}`,
        x: levelX(250) - 6,
        y: BOARDS.five.floor - 22,
        anchor: "end",
        width: 200
      }), "noise5"));
      out.push(fade(rowsIn, jsx(Label$2, {
        tex: r3`\text{noise}`,
        x: levelX(250) - 6,
        y: BOARDS.three.floor - 22,
        anchor: "end",
        width: 200
      }), "noise3"));
    }
  }
  const warp = cam.warp;
  out.push(jsx(Label$2, {
    tex: r3`z^\star`,
    x: cam.X(zStar),
    y: P.bottom + 41,
    anchor: "middle",
    width: 60
  }, "zs"));
  out.push(fade(warp, jsx(Label$2, {
    tex: r3`\log`,
    x: cam.X(zStar) - 17,
    y: P.bottom + 41,
    anchor: "end",
    width: 70
  }), "lzs"));
  const yIn = smoothstep$1(pr(t, "product", 0, 1));
  out.push(fade(yIn * (1 - warp), jsx(Label$2, {
    tex: "y",
    x: P.right - 18,
    y: P.bottom + 41,
    width: 60
  }), "y"));
  out.push(fade(warp, jsx(Label$2, {
    tex: r3`\tilde y`,
    x: P.right - 18,
    y: P.bottom + 41,
    width: 60
  }), "yt"));
  const axis = smoothstep$1(pr(t, "sweep", 0, 0.12)) * (1 - cam.crop);
  out.push(fade(axis, jsx(Label$2, {
    tex: "0",
    x: P.left - 14,
    y: cam.Y(0) + 10,
    anchor: "end",
    width: 40,
    halo: false
  }), "0"));
  out.push(fade(axis, jsxs(Fragment$1, { children: [jsx("path", {
    d: `M${P.left - 6},${cam.Y(1)}h6`,
    stroke: C.ink,
    strokeWidth: 1.5
  }), jsx(Label$2, {
    tex: "1",
    x: P.left - 14,
    y: cam.Y(1) + 10,
    anchor: "end",
    width: 40,
    halo: false
  })] }), "1"));
  const recordedName = smoothstep$1(pr(t, "logs", 0.6, 1)) * (1 - smoothstep$1(pr(t, "branches", 0, 0.5)));
  const rx = lerp$4(Math.log(150), A + 0.14, cam.crop);
  out.push(fade(recordedName, jsx(Label$2, {
    tex: r3`\text{CDF of }\tilde y`,
    x: cam.XL(rx) + 14,
    y: cam.Y(observed(rx)) + 44,
    width: 190
  }), "recorded"));
  const ghost = smoothstep$1(pr(t, "latentJump", 0.3, 1)) * (1 - smoothstep$1(pr(t, "identified", 0, 0.6)));
  const gx = Math.log(62);
  out.push(fade(ghost, jsx(Label$2, {
    tex: r3`\text{CDF of }\tilde z`,
    x: cam.XL(gx) - 10,
    y: cam.Y(latentLower(gx)) - 26,
    anchor: "end",
    width: 190,
    color: C.muted
  }), "ghost"));
  const intuitionLabels = smoothstep$1(pr(t, "intuition", 0.85, 1)) * (1 - smoothstep$1(pr(t, "branches", 0, 0.5)));
  out.push(fade(intuitionLabels, jsx(Label$2, {
    tex: r3`\sigma'=\sigma`,
    x: cam.XL(A) + 12,
    y: cam.Y(BELOW) + 30,
    width: 110,
    color: C.muted
  }), "s1"));
  const sx2 = A - 2.2 * SIGMA;
  out.push(fade(intuitionLabels, jsx(Label$2, {
    tex: r3`\sigma'=\sigma/2`,
    x: cam.XL(sx2) - 12,
    y: cam.Y(candidate(sx2, SIGMA / 2)) - 18,
    anchor: "end",
    width: 130,
    halo: true
  }), "s2"));
  const rec = smoothstep$1(pr(t, "branches", 0.5, 1));
  const lx = Math.log(78), ux = Math.log(128);
  out.push(fade(rec, jsx(Label$2, {
    tex: r3`\widetilde H_0`,
    x: cam.XL(lx) + 16,
    y: cam.Y(latentLower(lx)) + 40,
    width: 90,
    color: C.lower
  }), "H0"));
  out.push(fade(rec, jsx(Label$2, {
    tex: r3`\widetilde H_1`,
    x: cam.XL(ux),
    y: cam.Y(latentUpper(ux)) - 22,
    anchor: "middle",
    width: 90,
    color: C.upper
  }), "H1"));
  const hb = smoothstep$1(pr(t, "survives", 0.5, 1)) * (1 - smoothstep$1(pr(t, "gap", 0, 0.4)));
  out.push(fade(hb, jsx(Label$2, {
    tex: r3`1-\widetilde H_1(\log z^\star)`,
    x: cam.XL(A) + HEIGHT_DX - 12,
    y: cam.Y((TOP + 1) / 2) + 10,
    anchor: "end",
    width: 230,
    color: C.upper
  }), "above"));
  const jb = smoothstep$1(pr(t, "jump", 0.4, 1));
  out.push(fade(jb, jsx(Label$2, {
    tex: "B",
    x: cam.XL(A) - 14,
    y: cam.Y((BELOW + TOP) / 2) + 12,
    anchor: "end",
    width: 40,
    color: C.buncher
  }), "B"));
  const stems = smoothstep$1(pr(t, "sieve", 0.6, 1)) * cam.strip;
  const g = VISIBLE_GRID.find((p) => p.j === -3);
  if (g) {
    const S = P.bottom - g.p / STEM_MAX * (P.bottom - STRIP$1.top);
    out.push(fade(stems * (1 - smoothstep$1(pr(t, "likelihood", 0, 0.4))), jsx(Label$2, {
      tex: "p_j",
      x: cam.XL(g.x),
      y: S - 16,
      anchor: "middle",
      width: 60,
      color: C.lower
    }), "pj"));
    out.push(fade(stems, jsx(Label$2, {
      tex: r3`\tilde z_j`,
      x: cam.XL(g.x),
      y: P.bottom + 41,
      anchor: "middle",
      width: 60,
      color: C.lower
    }), "zj"));
  }
  const gap = smoothstep$1(pr(t, "gap", 0.6, 1));
  out.push(fade(gap, jsx(Label$2, {
    tex: r3`\Delta`,
    x: (cam.XL(A) + cam.XL(A + DELTA)) / 2,
    y: cam.Y(BELOW) + 38,
    anchor: "middle",
    width: 50
  }), "D"));
  return jsx("g", { children: out });
}
function describe$1(t) {
  const { key } = sceneAt$1(t);
  return {
    dropThree: "Balls fall from their chosen incomes through three rows of pegs and pile up by recorded income; the red bunchers all start at z star.",
    settled: "The settled pile. The red balls, who all chose z star, are spread over several bins around it.",
    dropFive: "A second board with five rows of pegs above the first: the same red balls spread wider.",
    sweep: "A wall sweeps the first pile from left to right; the tower's height traces the empirical CDF as a staircase.",
    noJump: "The empirical CDF alone, zoomed around z star, with a dashed guide at z star. It rises steeply but has no jump.",
    friction: "The empirical CDF around z star.",
    product: "The empirical CDF of recorded income y.",
    logs: "The axis warps to logs and the staircase becomes the smooth CDF of recorded log income.",
    errorLaw: "The CDF of recorded log income.",
    latentJump: "A dashed ghost of the CDF of chosen log income, with its jump at log z star.",
    ramp: "The recorded CDF and the dashed CDF of chosen log income, with its jump at log z star.",
    identified: "The ghost fades, leaving the recorded CDF.",
    intuition: "Zoomed in close around log z star: undoing more and more noise sharpens the curve; only the full amount brings back a jump.",
    branches: "The recovered lower branch in teal and upper branch in indigo over the recorded CDF.",
    jump: "The red recovered jump at log z star.",
    sieve: "The recovered CDF becomes a staircase on a grid; below, a stem for each grid weight, the one at log z star red.",
    likelihood: "Each stem grows a normal bump; the bumps add up to the recorded density.",
    accuracy: "The red stem at log z star is ringed.",
    caveats: "The grid weights and their normal bumps; the red stem at log z star stays ringed.",
    spectral: "The grid weights and their normal bumps.",
    survives: "The recovered CDF; the jump and the height at its top glow.",
    gap: "The gap from log z star to log z star plus Delta is shaded under the dashed lower branch."
  }[key] ?? "Chapter 4 figure.";
}
var randomFrictionsFilm = {
  viewBox: VIEWBOX$2,
  timeline: TIMELINE$1,
  load: () => Promise.resolve(true),
  draw: draw$1,
  Overlay: Overlay$1,
  ariaLabel: describe$1
};
function RandomFrictionsFigure({ step, entering }) {
  useEffect(() => () => setProof(null), [step]);
  return jsxs("div", {
    className: "rf-figure",
    children: [jsx(FilmFigure, {
      film: randomFrictionsFilm,
      step,
      entering,
      className: "rf-chapter"
    }), step >= I$1.identified && step <= I$1.jump && jsx(ProofCard, { step: I$1.identified })]
  });
}
var r$4 = String.raw;
var roles$1 = {
  B: "buncher",
  lz: "buncher",
  lz2: "buncher",
  H0: "lower",
  H1: "upper",
  h0: "lower",
  atom: "buncher"
};
var spec$1 = (id, states) => defineDerivation({
  id: `rf-${id}`,
  roles: roles$1,
  maxLines: 2,
  states
});
var brk = (...pieces) => pieces.join(r$4` \brk `);
var H0 = r$4`\k{H0}{\widetilde H_0(\log z^\star)}`;
var H1 = r$4`\k{H1}{\widetilde H_1(\log z^\star)}`;
var unseen = r$4`\k{claim}{H_1(z^\star)-H_0(z^\star)>0}`;
var noJump = spec$1("no-jump", [{
  tex: unseen,
  label: "The theory predicts a jump: H one at z star minus H zero at z star is positive."
}, {
  tex: unseen,
  sub: true,
  emphasis: { claim: "cancel" },
  label: "Struck through: in the data we don't see it."
}]);
var LOGY = r$4`\k{lo}{\log}\,\k{y}{y}`;
var logs = spec$1("logs", [
  {
    tex: r$4`\k{y}{y}\k{rel}{=}\k{xi}{\xi}\k{z}{z}`,
    label: "Recorded income is the error times chosen income."
  },
  {
    tex: r$4`${LOGY}\k{rel}{=}\k{ro}{\log}\k{lp}{(}\k{xi}{\xi}\k{z}{z}\k{rp}{)}`,
    enter: {
      lo: "write",
      ro: "write",
      lp: "grow",
      rp: "grow"
    },
    label: "Take logs of both sides."
  },
  {
    tex: r$4`${LOGY}\k{rel}{=}\k{ro}{\log}\,\k{z}{z}\k{plus}{+}\k{ro2}{\log}\,\k{xi}{\xi}`,
    sub: true,
    from: { ro2: "ro" },
    exit: {
      lp: "collapse",
      rp: "collapse"
    },
    label: "The log of a product is the sum of the logs."
  },
  {
    tex: r$4`\k{yt}{\tilde y}\k{rel}{=}\k{zt}{\tilde z}\k{plus}{+}\k{nu}{\nu}`,
    sub: true,
    from: {
      yt: "y",
      zt: "z",
      nu: "xi"
    },
    exit: {
      lo: "collapse",
      ro: "collapse",
      ro2: "collapse"
    },
    label: "In tildes: log recorded income is log chosen income plus nu, the log error."
  }
]);
var errorLaw = spec$1("error-law", [{
  tex: r$4`\k{nu}{\nu}\k{sim}{\sim}\k{Q}{Q},\quad\k{nu2}{\nu}\k{perp}{\perp}\k{z}{z}`,
  label: "Nu has CDF Q and is independent of chosen income."
}]);
var latentJump = spec$1("latent-jump", [{
  tex: brk(r$4`\k{B}{B}\k{rel}{=}${H1}\k{minus}{-}${H0}`, r$4`\k{gt}{>}\k{zero}{0}`),
  label: "B, the jump in the CDF of chosen log income at log z star, is positive."
}]);
var LZ$1 = r$4`\k{lz}{\log z^\star}`;
var ramp$1 = spec$1("ramp", [
  {
    tex: r$4`\k{B}{B}\,\k{Pr}{\Pr}\k{lp}{\big(}${LZ$1}\k{plus}{+}\k{nu}{\nu}\k{le}{\le}\k{yt}{\tilde y}\k{rp}{\big)}`,
    label: "The bunchers' share recorded at or below y tilde: B times the probability that log z star plus nu is at most y tilde."
  },
  {
    tex: r$4`\k{B}{B}\,\k{Pr}{\Pr}\k{lp}{\big(}\k{nu}{\nu}\k{le}{\le}\k{yt}{\tilde y}\k{minus}{-}${LZ$1}\k{rp}{\big)}`,
    sub: true,
    from: { minus: "plus" },
    path: { lz: "over" },
    label: "Move log z star across the inequality."
  },
  {
    tex: r$4`\k{B}{B}\,\k{Q}{Q}\k{lp}{\big(}\k{yt}{\tilde y}\k{minus}{-}${LZ$1}\k{rp}{\big)}`,
    sub: true,
    from: { Q: "Pr" },
    exit: {
      nu: "collapse",
      le: "collapse"
    },
    label: "That probability is the error's CDF Q at y tilde minus log z star."
  },
  {
    tex: brk(r$4`\k{B}{B}\,\k{Q}{Q}\k{lp}{\big(}\k{yt}{\tilde y}\k{minus}{-}${LZ$1}\k{rp}{\big)}`, r$4`\k{rel}{=}\k{B2}{B}\,\k{Phi}{\Phi}\Big(\frac{\k{yt2}{\tilde y}\k{minus2}{-}\k{lz2}{\log z^\star}}{\k{sig}{\sigma}}\Big)\ \k{note}{\text{if normal}}`),
    sub: true,
    from: {
      B2: "B",
      yt2: "yt",
      minus2: "minus",
      lz2: "lz"
    },
    roles: { B2: "buncher" },
    label: "With normal errors, B times Phi of y tilde minus log z star over sigma."
  }
]);
var modelChain = chainDerivations("rf-model", [
  {
    name: "logs",
    spec: logs
  },
  {
    name: "errorLaw",
    spec: errorLaw
  },
  {
    name: "latentJump",
    spec: latentJump
  },
  {
    name: "ramp",
    spec: ramp$1
  }
]);
var recoveredJump = spec$1("recovered-jump", [{
  tex: r$4`\k{B}{B}\k{rel}{=}${H1}\k{minus}{-}${H0}`,
  label: "B equals H one tilde minus H zero tilde at log z star."
}]);
var sieve = spec$1("sieve", [{
  tex: r$4`\k{H}{\widetilde H(\tilde z)}\k{rel}{\approx}\k{sum}{\sum_j}\k{p}{p_j}\,\k{ind}{\mathbf 1\{\tilde z_j\le\tilde z\}}`,
  label: "The CDF of chosen log income is approximated by weights p j at grid points z tilde j."
}]);
var likelihood = spec$1("likelihood", [{
  tex: brk(r$4`\k{ell}{\ell(p;\sigma)}\k{rel}{=}\k{sumi}{\sum_{i=1}^{N}}\k{log}{\log}`, r$4`\k{sumj}{\sum_j}\k{p}{p_j}\,\k{dens}{\frac{1}{\sigma}\phi\Big(\frac{\tilde y_i-\tilde z_j}{\sigma}\Big)}`, r$4`\k{tag}{\text{(log-normal case)}}`),
  label: "The log likelihood: for each record, the log of the weighted mix of normal densities around the grid points."
}, {
  tex: brk(r$4`\k{phat}{\hat p(\sigma)}\k{rel}{=}\k{arg}{\arg\max_{p_j\ge 0,\ \sum_j p_j=1}}\ \k{ell}{\ell(p;\sigma)}`, r$4`\k{sig}{\hat\sigma\ \text{chosen by search}}`),
  keep: true,
  sub: true,
  label: "For each sigma, the weights that maximize the likelihood; sigma hat is chosen by search."
}]);
var estimateChain$1 = chainDerivations("rf-estimate", [{
  name: "sieve",
  spec: sieve
}, {
  name: "likelihood",
  spec: likelihood
}]);
var survives = spec$1("survives", [{
  tex: r$4`\k{B}{B}\k{rel}{=}${H1}\k{minus}{-}${H0}`,
  label: "B is recovered."
}, {
  tex: brk(r$4`\k{B}{B}\k{rel}{=}\k{int}{\int_{\k{lz}{\log z^\star}}^{\k{lz2}{\log z^\star}+\Delta}\k{h0}{\widetilde h_0(\tilde z)}\,d\tilde z}`, r$4`\k{D}{,\quad\Delta=e(\tau_0-\tau_1)}`),
  keep: true,
  label: "But B equals the integral of h zero tilde across the gap, whose width is Delta, e times tau zero minus tau one."
}]);
var r$3 = String.raw;
var M$1 = ({ tex }) => jsx(InlineMath, { tex });
var shorts = [
  "Noise",
  "What the data show",
  "A model of the error",
  "What is identified",
  "Estimating it",
  "What survives"
];
var titles = [
  "Recorded incomes pass through noise",
  "In data, nothing jumps",
  "Recorded income is chosen income times an error",
  "With normal error, the jump is still identified",
  "Estimating the jump by maximum likelihood",
  "The bunching mass survives the noise"
];
var bodies$1 = [
  jsxs(Fragment$1, { children: [
    "The balls are Chapter 1’s pile, with the same taxes. The smooth curves that follow use Chapter 3’s law, so ",
    jsx(M$1, { tex: "B" }),
    " is Chapter 3’s. Each ball lands at its recorded income ",
    jsx(M$1, { tex: "y" }),
    ", its chosen income ",
    jsx(M$1, { tex: "z" }),
    " times a log-normal error: ",
    jsx(M$1, { tex: r$3`\log y=\log z+\nu` }),
    ", with one fixed standard-normal draw",
    jsx(M$1, { tex: r$3`\nu/\sigma` }),
    " per person, the same on both boards; the pegs only draw the path there. The second board has more rows of pegs, so a larger ",
    jsx(M$1, { tex: r$3`\sigma` }),
    "; the draws are the same."
  ] }),
  jsxs(Fragment$1, { children: [
    "The staircase is the empirical CDF of recorded income: each step is one person. The figure then shows a window of incomes around ",
    jsx(M$1, { tex: r$3`z^\star` }),
    ". In theory the CDF jumps by ",
    jsx(M$1, { tex: "B" }),
    " at ",
    jsx(M$1, { tex: r$3`z^\star` }),
    "; recorded incomes show a steep but continuous rise instead."
  ] }),
  jsxs(Fragment$1, { children: [
    "In the normal case, ",
    jsx(M$1, { tex: r$3`\mathbb E\,\nu=0` }),
    " is a normalization, so the median of ",
    jsx(M$1, { tex: r$3`\xi` }),
    " is one (not its mean); ",
    jsx(M$1, { tex: r$3`\sigma` }),
    " is the standard deviation of the ",
    jsx("em", { children: "log" }),
    " error. Here ",
    jsx(M$1, { tex: "z" }),
    " is chosen income and ",
    jsx(M$1, { tex: r$3`y=\xi z` }),
    " is recorded income. The noise law is written generally as ",
    jsx(M$1, { tex: "Q" }),
    " with density ",
    jsx(M$1, { tex: "q" }),
    "; the normal case is",
    jsx(M$1, { tex: r$3`\;Q(v)=\Phi(v/\sigma)` }),
    ", ",
    jsx(M$1, { tex: r$3`q(v)=\sigma^{-1}\phi(v/\sigma)` }),
    ". The figure shows only the empirical CDF and, dashed, the CDF of chosen income."
  ] }),
  jsxs(Fragment$1, { children: [
    "CJMS prove identification for Gaussian noise and conjecture it for other regular parametric families. With noise of unknown shape the noise is not identified: zero noise always fits. The faint curves at the second step undo less noise than ",
    jsx(M$1, { tex: r$3`\sigma` }),
    ": each is the CDF of chosen income blurred by the noise that is left, ",
    jsx(M$1, { tex: r$3`\mathcal N(0,\sigma^2-\sigma'^2)` }),
    ", so none has a jump. Their proof is the “Proof” card at the first step. Reference: Cattaneo, M. D., M. Jansson, X. Ma and J. Slemrod (2018). “Bunching Designs: Estimation and Inference.” Working paper."
  ] }),
  jsxs(Fragment$1, { children: [
    "CJMS put the chosen incomes on a sieve of point masses and write the likelihood of recorded income as a normal mixture; the weights maximize it with",
    " ",
    jsx(M$1, { tex: r$3`\sigma` }),
    " fixed, and ",
    jsx(M$1, { tex: r$3`\hat\sigma` }),
    " maximizes the likelihood over a grid of ",
    jsx(M$1, { tex: r$3`\sigma` }),
    " values. For fixed ",
    jsx(M$1, { tex: r$3`\sigma` }),
    " the problem is concave in ",
    jsx(M$1, { tex: "p" }),
    "; the joint problem is not. The kink point’s weight also holds nearby smooth mass at finite grid spacing; CJMS separate the two by interpolating across that point. Their consistency result is for the CDF estimate. Aronsson, Jenderny and Lanot, “A maximum likelihood bunching estimator of the elasticity of taxable income”, ",
    jsx("em", { children: "Journal of Applied Econometrics" }),
    " 39(1), 2024, pp. 200–216 (doi 10.1002/jae.3015), also estimate by maximum likelihood with a normal error. Their types are parametric: a truncated normal on either side of the kink. CJMS leave the types free, on the grid, which makes theirs a nonparametric maximum likelihood estimator (NPMLE)."
  ] }),
  jsxs(Fragment$1, { children: [
    "This recovers the latent ",
    jsx(M$1, { tex: "B" }),
    " of Chapter 3. Applying Chapter 3’s revenue formula to taxes levied on realized, noisy income needs a model of how the error enters choices and tax payments. CJMS’s second step, which gets ",
    jsx(M$1, { tex: "e" }),
    ", adds a local restriction on ",
    jsx(M$1, { tex: r$3`\widetilde h_0` }),
    " across the gap."
  ] })
];
var derivations$1 = [
  void 0,
  noJump,
  modelChain.spec,
  recoveredJump,
  estimateChain$1.spec,
  survives
];
var STAGES$1 = titles.map((title2, i) => ({
  eyebrow: shorts[i],
  short: shorts[i],
  title: title2,
  body: bodies$1[i],
  prompt: "",
  figureTitle: shorts[i],
  derivation: derivations$1[i]
}));
var TRAILING_PUNCTUATION = /^[.,;:!?)]+/;
function prose(text, ...tail) {
  const parts = text.split("$");
  if (parts.length % 2 === 0) throw new Error(`prose: unbalanced $ in ${JSON.stringify(text)}`);
  const glued = parts.map((part, index) => index % 2 === 1 ? parts[index + 1].match(TRAILING_PUNCTUATION)?.[0] ?? "" : "");
  return jsxs(Fragment$1, { children: [parts.map((part, index) => index % 2 === 1 ? glued[index] ? jsxs("span", {
    style: { whiteSpace: "nowrap" },
    children: [jsx(InlineMath, { tex: part }), glued[index]]
  }, index) : jsx(InlineMath, { tex: part }, index) : jsx(Fragment, { children: index > 0 && glued[index - 1] ? part.slice(glued[index - 1].length) : part }, index)), tail.map((node, index) => jsx(Fragment, { children: node }, `tail-${index}`))] });
}
var EXTENSION_HREF = "/04-spectral";
function ExtensionLink() {
  return jsx("span", {
    className: "rf-link-row",
    children: jsx(Link, {
      className: "rf-extension-link",
      href: EXTENSION_HREF,
      onClick: () => markRouteEntry("04-spectral"),
      children: "Extension: the spectral bunching estimator →"
    })
  });
}
var SLIDES_HREF = "https://dylantmoore.github.io/website/specbunch_NTA_2026.html";
function SlidesLink() {
  return jsx("span", {
    className: "rf-link-row",
    children: jsx("a", {
      className: "rf-extension-link rf-slides-link",
      href: SLIDES_HREF,
      target: "_blank",
      rel: "noopener noreferrer",
      children: "Slides: my NTA 2026 talk on this estimator →"
    })
  });
}
function narration(key, text, index) {
  if (key === "identified") return prose(text, " ", jsx(ProofButton, { step: index }));
  if (key === "spectral") return prose(text, jsx(ExtensionLink, {}, "extension"), jsx(SlidesLink, {}, "slides"));
  return prose(text);
}
var randomFrictionsChapter = {
  id: 4,
  slug: "04-random-frictions",
  part: "II",
  title: "Accounting for Frictions",
  label: "Accounting for Frictions",
  steps: PRESSES$1.map((p, i) => ({
    key: p.key,
    stage: p.stage,
    narration: narration(p.key, p.text, i),
    ..."derivationAt" in p ? { derivationAt: p.derivationAt } : {}
  })),
  stages: STAGES$1,
  Figure: RandomFrictionsFigure,
  viewBox: VIEWBOX$2,
  initialParameters: CH1_DEFAULTS,
  defaults: CH1_DEFAULTS
};
var VIEWBOX$1 = {
  width: 880,
  height: 713
};
var PILE_FULL = {
  left: 88,
  top: 65,
  right: 824,
  bottom: 638
};
var BAND = {
  left: 88,
  top: 470,
  right: 824,
  bottom: 668
};
var CIRCLE = {
  cx: 222,
  cy: 236,
  r: 178
};
var MAG = {
  left: 498,
  top: 58,
  right: 838,
  bottom: 398
};
var COS_PANEL = {
  left: 470,
  top: 40,
  right: 846,
  bottom: 206
};
var SIN_PANEL = {
  left: 470,
  top: 232,
  right: 846,
  bottom: 398
};
var TRACE = {
  left: 88,
  top: 452,
  right: 824,
  bottom: 668
};
var S_LOW = 2.5;
var TRACE_VIEW = {
  rect: TRACE,
  x: "s",
  y: "lin",
  s: [0, 30],
  logs: [0.8, 60],
  s2: [0, 1600],
  lin: [-0.12, 1.06],
  log: [1e-4, 1.5]
};
var lerp$3 = (a2, b, u) => a2 + (b - a2) * u;
var clamp01$4 = (u) => Math.max(0, Math.min(1, u));
function xOf(view, s) {
  const { left, right } = view.rect;
  let u;
  if (view.x === "s") u = (s - view.s[0]) / (view.s[1] - view.s[0]);
  else if (view.x === "logs") {
    const lo = Math.log(view.logs[0]), hi = Math.log(view.logs[1]);
    u = (Math.log(Math.max(s, view.logs[0] / 10)) - lo) / (hi - lo);
  } else u = (s * s - view.s2[0]) / (view.s2[1] - view.s2[0]);
  return lerp$3(left, right, u);
}
function yOf(view, v) {
  const { top, bottom } = view.rect;
  let u;
  if (view.y === "lin") u = (v - view.lin[0]) / (view.lin[1] - view.lin[0]);
  else {
    const lo = Math.log(view.log[0]), hi = Math.log(view.log[1]);
    u = (Math.log(Math.max(v, view.log[0] / 10)) - lo) / (hi - lo);
  }
  return lerp$3(bottom, top, u);
}
var plotFrame = (view) => ({
  rect: view.rect,
  X: (s) => xOf(view, s),
  Y: (v) => yOf(view, v)
});
function between(a2, b, u) {
  const k2 = clamp01$4(u);
  if (k2 <= 0) return plotFrame(a2);
  if (k2 >= 1) return plotFrame(b);
  return {
    rect: {
      left: lerp$3(a2.rect.left, b.rect.left, k2),
      top: lerp$3(a2.rect.top, b.rect.top, k2),
      right: lerp$3(a2.rect.right, b.rect.right, k2),
      bottom: lerp$3(a2.rect.bottom, b.rect.bottom, k2)
    },
    X: (s) => lerp$3(xOf(a2, s), xOf(b, s), k2),
    Y: (v) => lerp$3(yOf(a2, v), yOf(b, v), k2)
  };
}
var r$2 = String.raw;
var roles = {
  B: "buncher",
  B2: "buncher",
  B3: "buncher",
  Bc: "buncher",
  lB: "buncher",
  ex0: "buncher",
  lz: "buncher",
  lz2: "buncher",
  lz3: "buncher",
  lz4: "buncher",
  lz5: "buncher",
  lz6: "buncher",
  h0: "lower",
  h0b: "lower",
  h1: "upper",
  h1d: "lower",
  cos: "cosine",
  C: "cosine",
  CN: "cosine",
  CN2: "cosine",
  J1: "cosine",
  J1b: "cosine",
  sin: "sine",
  S: "sine",
  SN: "sine",
  J0: "sine",
  J0b: "sine"
};
var spec = (id, states, maxLines = 2) => defineDerivation({
  id: `sp-${id}`,
  roles,
  maxLines,
  states
});
var LZ = (k2 = "lz") => r$2`\k{${k2}}{\log z^\star}`;
var ARG = (v, k2 = "lz") => r$2`s(${v}-${LZ(k2)})`;
var BELL = r$2`\exp(-\sigma^2s^2/2)`;
var EVERYONE = (k2 = "lz4") => r$2`\underbrace{\int_{\tilde z\neq\log z^\star}\exp\big(is(\tilde z-${LZ(k2)})\big)\,\widetilde h(\tilde z)\,d\tilde z}_{\text{everyone else}}`;
var O = r$2`o(s^{-2})`;
var AVG = r$2`\frac{1}{N}\sum_{i=1}^{N}`;
var COS_I = r$2`\cos ${ARG(r$2`\tilde y_i`, "lz2")}`;
var SIN_I = r$2`\sin ${ARG(r$2`\tilde y_i`, "lz3")}`;
var EXP_I = r$2`\exp\big(i${ARG(r$2`\tilde y_i`)}\big)`;
var circle = spec("circle", [
  {
    tex: r$2`\k{ex}{\exp(i\theta)} \k{rel}{=} \k{cos}{\cos\theta} \k{plus}{+} \k{i}{i}\,\k{sin}{\sin\theta}`,
    label: "Euler's formula: exp of i theta equals cos theta plus i sin theta."
  },
  {
    tex: r$2`\k{ex}{${EXP_I}} \brk \k{rel}{=} \k{cos}{${COS_I}} \brk \k{plus}{+} \k{i}{i}\,\k{sin}{${SIN_I}}`,
    label: "For record i, the angle is s times its distance from log z star."
  },
  {
    tex: r$2`\k{avg}{${AVG}}\k{ex}{${EXP_I}} \brk \k{rel}{=} \k{avg2}{${AVG}}\k{lp}{\Big(}\k{cos}{${COS_I}} \k{plus}{+} \k{i}{i}\,\k{sin}{${SIN_I}}\k{rp}{\Big)}`,
    enter: {
      avg: "write",
      avg2: "write",
      lp: "grow",
      rp: "grow"
    },
    label: "Average both sides over the N records."
  },
  {
    tex: r$2`\k{avg}{${AVG}}\k{ex}{${EXP_I}} \brk \k{rel}{=} \k{avg2}{${AVG}}\k{cos}{${COS_I}} \brk \k{plus}{+} \k{i}{i}\,\k{avg3}{${AVG}}\k{sin}{${SIN_I}}`,
    sub: true,
    from: { avg3: "avg2" },
    exit: {
      lp: "collapse",
      rp: "collapse"
    },
    label: "The average goes onto each term."
  },
  {
    tex: r$2`\k{psi}{\psi_N(s)} \k{def}{\equiv} \k{avg}{${AVG}}\k{ex}{${EXP_I}} \brk \k{rel}{=} \k{CN}{C_N(s)} \k{plus}{+} \k{i}{i}\,\k{SN}{S_N(s)}`,
    sub: true,
    from: {
      CN: "cos",
      SN: "sin"
    },
    enter: {
      psi: "write",
      def: "write"
    },
    exit: {
      avg2: "collapse",
      avg3: "collapse"
    },
    label: "The average point is psi N of s, the empirical characteristic function: C N of s plus i S N of s."
  },
  {
    tex: r$2`\k{CN}{C_N(s)} \k{rel}{=} \k{avg}{${AVG}}\k{cos}{${COS_I}}`,
    keep: true,
    sub: true,
    label: "C N of s is the average of the cosines."
  }
]);
var stageOne = {
  euler: 0,
  wrap: 1,
  average: 2
};
var transform = spec("transform", [
  {
    tex: r$2`\k{psi}{\psi_{\tilde y}(s)} \k{def}{\equiv} \k{E}{\mathbb E}\,\k{ex}{\exp\big(is(\k{y}{\tilde y}-${LZ()})\big)} \brk \k{rel}{=} \k{C}{C(s)} \k{plus}{+} \k{i}{i}\,\k{S}{S(s)}`,
    label: "In the population, psi of s is the expected value of exp of i s times the distance from log z star: C of s plus i S of s."
  },
  {
    tex: r$2`\k{psi}{\psi_{\tilde z}(s)} \k{def}{=} \k{E}{\mathbb E}\,\k{ex}{\exp\big(is(\k{y}{\tilde z}-${LZ()})\big)}`,
    label: "For chosen log income z tilde: psi z tilde of s."
  },
  {
    tex: r$2`\k{rel2}{=} \k{B}{B}\,\k{ex0}{\exp(is\cdot 0)} \brk \k{plus}{+} \k{int}{${EVERYONE()}}`,
    keep: true,
    label: "Split: B times exp of i s times zero, plus the integral over everyone else."
  },
  {
    tex: r$2`\k{rel2}{=} \k{B}{B} \brk \k{plus}{+} \k{int}{${EVERYONE()}} \brk \;\k{lim}{\xrightarrow{\ s\to\infty\ }}\; \k{B2}{B}`,
    sub: true,
    exit: { ex0: "collapse" },
    enter: {
      lim: "write",
      B2: "write"
    },
    label: "The atom's term is B at every frequency; everyone else winds away, so the transform tends to B."
  }
]);
var PSI_Z = r$2`\k{psi}{\psi_{\tilde z}(s)} \k{rel}{=} \k{B}{B}`;
var EXPX = (k2) => r$2`\exp\big(is(\tilde z-${LZ(k2)})\big)`;
var rates = spec("rates", [
  {
    tex: r$2`${PSI_Z} \brk \k{plus}{+} \k{int}{${EVERYONE()}}`,
    label: "Psi z tilde of s is B plus the integral over everyone else."
  },
  {
    tex: r$2`${PSI_Z} \brk \k{plus}{+} \k{int}{\int_{-\infty}^{\log z^\star}${EXPX("lz4")}\,\k{h0}{\widetilde h_0}\,d\tilde z} \brk \k{plus2}{+} \k{int2}{\int_{\log z^\star}^{\infty}${EXPX("lz5")}\,\k{h1}{\widetilde h_1}\,d\tilde z}`,
    label: "Split the integral at log z star: h zero tilde below, h one tilde above."
  },
  {
    tex: r$2`${PSI_Z} \brk \k{plus}{+} \k{J0}{\frac{i}{s}J_0} \brk \k{plus2}{+} \k{int}{\frac{i}{s}\int_{\tilde z\neq\log z^\star}${EXPX("lz4")}\,\widetilde h'\,d\tilde z}`,
    sub: true,
    exit: { int2: "collapse" },
    label: "Integrate by parts once: the boundary terms give i J zero over s."
  },
  {
    tex: r$2`${PSI_Z} \brk \k{plus}{+} \k{J0}{\frac{i}{s}J_0} \brk \k{plus2}{+} \k{J1}{\Big(\frac{i}{s}\Big)^2J_1} \brk \k{plus3}{+} \k{int}{\Big(\frac{i}{s}\Big)^2\int_{\tilde z\neq\log z^\star}${EXPX("lz4")}\,\widetilde h''\,d\tilde z}`,
    sub: true,
    label: "Once more: i over s squared times J one, and a remainder."
  },
  {
    tex: r$2`${PSI_Z} \brk \k{plus}{+} \k{J0}{\frac{iJ_0}{s}} \brk - \k{J1}{\frac{J_1}{s^2}} \brk \k{plus3}{+} \k{int}{${O}}`,
    sub: true,
    exit: { plus2: "collapse" },
    label: "Psi z tilde of s equals B plus i J zero over s minus J one over s squared plus terms that shrink faster."
  },
  {
    tex: r$2`\k{C}{C(s)} \k{rel}{=} \k{B}{B} - \k{J1}{\frac{J_1}{s^2}} \k{plus3}{+} \k{o}{${O}} \k{comma}{,} \brk \k{S}{S(s)} \k{rel2}{=} \k{J0}{\frac{J_0}{s}} \k{plus4}{+} \k{o2}{${O}}`,
    keep: true,
    label: "C of s equals B minus J one over s squared plus smaller terms; S of s equals J zero over s plus smaller terms."
  },
  {
    tex: r$2`\k{J0}{J_0} \k{rel}{=} \k{h1}{\widetilde h_1(${LZ()})} \k{minus}{-} \k{h0}{\widetilde h_0(${LZ("lz2")})}`,
    keep: true,
    label: "J zero is h one tilde minus h zero tilde at log z star."
  },
  {
    tex: r$2`\k{J0}{J_0} \k{rel}{=} \k{h1d}{\widetilde h_0(${LZ()}+\Delta)} \k{minus}{-} \k{h0}{\widetilde h_0(${LZ("lz2")})}`,
    sub: true,
    from: { h1d: "h1" },
    label: "Just above the kink the density is h zero tilde at log z star plus Delta."
  }
]);
var stageThree = {
  sides: 0,
  rates: 1,
  rateSides: 2,
  densityJump: 3
};
var PSI_Y = r$2`\k{psi}{\psi_{\tilde y}(s)} \k{rel}{=}`;
var bell$1 = spec("bell", [
  {
    tex: r$2`${PSI_Y} \k{E}{\mathbb E}\,\k{ex}{\exp\big(is(\k{y}{\tilde y}-${LZ()})\big)}`,
    label: "Psi y tilde of s is the expected value of exp of i s times the distance from log z star."
  },
  {
    tex: r$2`${PSI_Y} \k{E}{\mathbb E}\,\k{ex}{\exp\big(is(\k{z}{\tilde z}-${LZ()}\k{nu}{+\nu})\big)}`,
    sub: true,
    from: { z: "y" },
    label: "Recorded log income is chosen log income plus nu."
  },
  {
    tex: r$2`${PSI_Y} \k{E}{\mathbb E}\k{lb}{\big[}\k{ex}{\exp\big(is(\k{z}{\tilde z}-${LZ()})\big)}\,\k{en}{\exp(is\k{nu}{\nu})}\k{rb}{\big]}`,
    sub: true,
    enter: {
      lb: "grow",
      rb: "grow"
    },
    label: "The exponential of a sum is the product of exponentials."
  },
  {
    tex: r$2`${PSI_Y} \k{E}{\mathbb E}\,\k{ex}{\exp\big(is(\k{z}{\tilde z}-${LZ()})\big)}\;\k{E2}{\mathbb E}\,\k{en}{\exp(is\k{nu}{\nu})}`,
    sub: true,
    from: { E2: "E" },
    exit: {
      lb: "collapse",
      rb: "collapse"
    },
    label: "Independence: the average of the product is the product of the averages."
  },
  {
    tex: r$2`${PSI_Y} \k{pz}{\psi_{\tilde z}(s)}\;\k{E2}{\mathbb E}\,\k{en}{\exp(is\k{nu}{\nu})}`,
    sub: true,
    from: { pz: "ex" },
    exit: { E: "collapse" },
    label: "So psi y tilde is psi z tilde times the expected value of exp of i s nu."
  },
  {
    tex: r$2`${PSI_Y} \k{pz}{\psi_{\tilde z}(s)}\,\k{bell}{${BELL}}`,
    from: { bell: "en" },
    exit: { E2: "collapse" },
    label: "With log-normal error the factor is the bell, exp of minus sigma squared s squared over two."
  },
  {
    tex: r$2`\begin{aligned}\k{C}{C(s)}&\k{rel}{=}\k{bell}{${BELL}}\Big(\k{B}{B}-\k{J1}{\frac{J_1}{s^2}}+${O}\Big)\\ \k{S}{S(s)}&\k{rel2}{=}\k{bell2}{${BELL}}\Big(\k{J0}{\frac{J_0}{s}}+${O}\Big)\end{aligned}`,
    keep: true,
    label: "C of s is the bell times B minus J one over s squared and smaller terms; S of s is the bell times J zero over s and smaller terms."
  }
]);
var BRACKET = r$2`\Big(\k{B}{B}-\k{J1}{\frac{J_1}{s^2}}+${O}\Big)`;
var D9_FINAL = r$2`\k{lg}{\log}\,\k{C}{C(s)} \brk \k{rel}{=} \k{lB}{\underbrace{\log B}_{\text{intercept}}}\ \k{sl}{\underbrace{-\frac{\sigma^2}{2}}_{\text{slope}}\,s^2} \brk \k{plus}{+} \k{rest}{\underbrace{\log\Big(1-\k{J1}{\frac{J_1}{B\,s^2}}+${O}\Big)}_{\text{dies like }1/s^2}}`;
var logLine = spec("line", [
  {
    tex: r$2`\k{C}{C(s)} \k{rel}{=} \k{bell}{${BELL}}\k{br}{${BRACKET}}`,
    label: "C of s is the bell times the bracket."
  },
  {
    tex: r$2`\k{lg}{\log}\,\k{C}{C(s)} \brk \k{rel}{=} \k{lg2}{\log}\k{lp}{\Big[}\k{bell}{${BELL}}\k{br}{${BRACKET}}\k{rp}{\Big]}`,
    sub: true,
    enter: {
      lg: "write",
      lg2: "write",
      lp: "grow",
      rp: "grow"
    },
    label: "Take logs of both sides."
  },
  {
    tex: r$2`\k{lg}{\log}\,\k{C}{C(s)} \brk \k{rel}{=} \k{sl}{-\frac{\sigma^2}{2}s^2} \brk \k{plus}{+} \k{lg2}{\log}\k{br}{${BRACKET}}`,
    sub: true,
    from: { sl: "bell" },
    exit: {
      lp: "collapse",
      rp: "collapse"
    },
    label: "The log of the bell is minus sigma squared over two times s squared."
  },
  {
    tex: r$2`\k{lg}{\log}\,\k{C}{C(s)} \brk \k{rel}{=} \k{sl}{-\frac{\sigma^2}{2}s^2} \brk \k{plus2}{+} \k{lB}{\log B} \k{plus}{+} \k{rest}{\log\Big(1-\k{J1}{\frac{J_1}{B\,s^2}}+${O}\Big)}`,
    from: {
      rest: "br",
      lB: "br"
    },
    exit: { lg2: "collapse" },
    label: "Pull B out: log B plus the log of one minus J one over B s squared and smaller terms."
  },
  {
    tex: D9_FINAL,
    sub: true,
    exit: { plus2: "collapse" },
    path: { lB: "over" },
    label: "Log C of s: intercept log B, slope minus sigma squared over two in s squared, and a term that dies like one over s squared."
  }
]);
var trial = spec("trial", [
  {
    tex: r$2`\k{C}{C(s)} \brk \k{rel}{=} \k{bell}{${BELL}}\k{br}{${BRACKET}}`,
    label: "C of s is the bell times the bracket."
  },
  {
    tex: r$2`\k{C}{C(s)}\,\k{u}{\exp(\sigma'^2s^2/2)} \brk \k{rel}{=} \k{bell}{${BELL}}\,\k{u2}{\exp(\sigma'^2s^2/2)}\k{br}{${BRACKET}}`,
    sub: true,
    enter: {
      u: "write",
      u2: "write"
    },
    label: "Multiply both sides by exp of sigma prime squared s squared over two."
  },
  {
    tex: r$2`\k{C}{C(s)}\,\k{u}{\exp(\sigma'^2s^2/2)} \brk \k{rel}{=} \k{fac}{\exp\big((\sigma'^2-\sigma^2)s^2/2\big)}\k{br}{${BRACKET}}`,
    sub: true,
    from: { fac: "bell" },
    exit: { u2: "collapse" },
    label: "Combine the exponents."
  },
  {
    tex: r$2`\k{C}{C(s)}\,\k{u}{\exp(\sigma'^2s^2/2)} \brk \;\k{lim}{\xrightarrow{\ s\to\infty\ }}\; \k{cases}{\begin{cases}0&\sigma'<\sigma\\ \k{Bc}{B}&\sigma'=\sigma\\ \infty&\sigma'>\sigma\end{cases}}`,
    from: {
      cases: "br",
      Bc: "B"
    },
    exit: {
      fac: "collapse",
      rel: "fade"
    },
    enter: { lim: "write" },
    label: "As s grows: zero if sigma prime is below sigma, B if it equals sigma, infinity if it is above."
  }
]);
var interceptChain = chainDerivations("sp-intercept", [{
  name: "line",
  spec: logLine
}, {
  name: "trial",
  spec: trial
}]);
var stageFive = {
  logLine: interceptChain.at("line", 0),
  intercept: interceptChain.at("line", 1),
  trialLow: interceptChain.at("trial", 0),
  trueSigma: interceptChain.at("trial", 1)
};
var noise = spec("noise", [
  {
    tex: r$2`\k{E}{\mathbb E}\,\k{CN}{C_N(s)} \k{rel}{=} \k{C}{C(s)}`,
    label: "The expected value of C N of s is C of s: unbiased."
  },
  {
    tex: r$2`\k{var}{\operatorname{Var}}\,\k{CN}{C_N(s)} \k{rel}{=} \k{fr}{\frac{1+\k{C}{C(2s)}-2\k{C2}{C(s)}^2}{2N}} \brk \;\k{lim}{\xrightarrow{\ s\to\infty\ }\;\frac{1}{2N}}`,
    keep: true,
    sub: true,
    label: "Its variance tends to one over two N as s grows: it stops falling."
  },
  {
    tex: r$2`\k{sig}{\k{B}{B}\,${BELL}} \k{rel}{=} \k{fl}{\frac{2}{\sqrt N}}`,
    keep: true,
    label: "The signal, B times the bell, meets the floor."
  },
  {
    tex: r$2`\k{s}{s} \k{rel}{=} \k{sol}{\frac{1}{\sigma}\sqrt{2\log\big(\k{B}{B}\sqrt N/2\big)}}`,
    sub: true,
    from: { sol: "fl" },
    exit: { sig: "collapse" },
    label: "Solve for s."
  },
  {
    tex: r$2`\k{s}{s} \k{rel}{=} \k{sol}{\frac{1}{\sigma}\sqrt{2\log\big(\k{B}{B}\sqrt N/2\big)}} \brk \k{sim}{\sim} \k{gl}{\frac{\sqrt{\log N}}{\sigma}}`,
    sub: true,
    enter: {
      sim: "write",
      gl: "write"
    },
    label: "It grows like the square root of log N over sigma."
  }
]);
var windowFit = spec("window", [{
  tex: r$2`\k{CN}{C_N(s)}\,\k{u}{\exp(\sigma^2s^2/2)} \brk \k{rel}{\approx} \k{B}{B} - \k{J1}{\frac{J_1}{s^2}} \k{where}{,\quad s\text{ in the window}}`,
  label: "In the window, C N of s divided by the bell is about B minus J one over s squared."
}]);
var estimateChain = chainDerivations("sp-estimate", [{
  name: "noise",
  spec: noise
}, {
  name: "window",
  spec: windowFit
}]);
var stageSeven = {
  sampleDots: estimateChain.at("noise", 0),
  noiseFloor: estimateChain.at("noise", 1),
  window: estimateChain.at("window", 0)
};
var summary = spec("summary", [
  {
    tex: r$2`\k{psi}{\psi_{\tilde z}(s)} \;\k{lim}{\xrightarrow{\ s\to\infty\ }}\; \k{B2}{B}`,
    label: "The atom never fades: psi z tilde of s tends to B."
  },
  {
    tex: r$2`\k{C}{C(s)} \k{rel}{=} \k{bell}{${BELL}}${BRACKET}`,
    keep: true,
    sub: true,
    label: "Log-normal error multiplies every term by one bell."
  },
  {
    tex: D9_FINAL,
    keep: true,
    sub: true,
    label: "Against s squared, log C of s is a line with intercept log B."
  }
], 3);
interceptChain.spec, estimateChain.spec;
var T = {
  opening: "Is the bunching mass identified when nothing jumps?",
  circle: "Each record becomes a point on a circle",
  transform: "The average point is the characteristic function",
  atom: "An atom never winds",
  rates: "Each kind of roughness has a rate and a side",
  bell: "Frictions multiply every term by one bell",
  line: "Against $s^2$, the log transform is a straight line",
  trial: "Only the true $\\sigma$ leaves a finite, positive limit",
  needs: "What the argument needs",
  cap: "Sampling noise caps the frequencies usable for estimation",
  window: "The window trades bias against noise",
  sum: "Where things stand"
};
var PRESSES = [
  {
    key: "opening",
    stage: 0,
    title: T.opening,
    derivationAt: null,
    text: "Chapter 4 showed that $B$ is identified under log-normal error, though nothing in the recorded data jumps. This extension shows where $B$ sits in those data, and gives a second way to estimate it."
  },
  {
    key: "euler",
    stage: 0,
    title: T.circle,
    derivationAt: stageOne.euler,
    text: "Start with Euler's formula. The point at angle $\\theta$ on a circle of radius one sits $\\cos\\theta$ across and $\\sin\\theta$ up; the letter $i$, the square root of $-1$, marks the vertical direction."
  },
  {
    key: "wrap",
    stage: 0,
    title: T.circle,
    derivationAt: stageOne.wrap,
    text: "Measure each recorded income from the kink, and send it to the point at angle $s$ times that distance. The frequency $s$ sets how fast the income line wraps around the circle."
  },
  {
    key: "average",
    stage: 0,
    title: T.circle,
    derivationAt: stageOne.average,
    text: "Average the points over all $N$ records. The average point is the empirical characteristic function $\\psi_N(s)$: its horizontal coordinate $C_N(s)$ is the cosine part, its vertical coordinate $S_N(s)$ the sine part."
  },
  {
    key: "sweepWheel",
    stage: 0,
    title: T.circle,
    text: "As the frequency rises, the line wraps many times and the points scatter around the circle. The bunchers stay near angle zero longest. How the average point moves as $s$ rises is what reveals $B$."
  },
  {
    key: "transform",
    stage: 1,
    title: T.transform,
    derivationAt: 0,
    text: "In the population the average point is the characteristic function of recorded log income. Its cosine part $C(s)$ is the net shaded area: the density times a cosine wave. The density is smooth, so the lobes cancel and both parts die out as $s$ rises."
  },
  {
    key: "atom",
    stage: 1,
    title: T.atom,
    derivationAt: 1,
    text: "Now set the noise aside and take chosen income. A share $B$ chose $\\log z^\\star$ exactly: an atom, a point mass, a share of people at exactly one value. Their distance from the kink is zero, so their point stays at angle zero at every frequency."
  },
  {
    key: "settles",
    stage: 1,
    title: T.atom,
    derivationAt: 2,
    text: "Split the average. The bunchers add $B$ at every frequency; everyone else, a share $1-B$ with density $\\widetilde h_0$ below the kink and $\\widetilde h_1$ above it, winds around and cancels. So $C(s)$ settles on $B$, and the atom adds nothing to the sine part."
  },
  {
    key: "sides",
    stage: 2,
    title: T.rates,
    derivationAt: stageThree.sides,
    text: "Under the sine wave the lobes on the two sides of the kink have opposite signs, so a jump in the density leaves them unequal and they stop cancelling. Call that jump $J_0=\\widetilde h_1(\\log z^\\star)-\\widetilde h_0(\\log z^\\star)$. Under the cosine wave one lobe straddles the kink and takes in both heights, so the jump leaves no mark there."
  },
  {
    key: "rates",
    stage: 2,
    title: T.rates,
    derivationAt: stageThree.rates,
    text: "The slope of the density can jump at the kink too: call that $J_1=\\widetilde h_1'(\\log z^\\star)-\\widetilde h_0'(\\log z^\\star)$. Integrating by parts twice gives the rates: $J_0$ fades like $1/s$ and $J_1$ like $1/s^2$. The rest, written $o(s^{-2})$, shrinks faster than $1/s^2$."
  },
  {
    key: "rateSides",
    stage: 2,
    title: T.rates,
    derivationAt: stageThree.rateSides,
    text: "As the last picture showed, $J_0$ lands on the sine side; $J_1$ lands on the cosine side. There $B$ is the only term that does not fade, and the next term is smaller by a factor of $s^2$."
  },
  {
    key: "densityJump",
    stage: 2,
    title: T.rates,
    derivationAt: stageThree.densityJump,
    text: "At a tax kink the density of chosen income generally jumps. Just above the kink it is the density at the far end of Chapter 2's gap, so $J_0=\\widetilde h_0(\\log z^\\star+\\Delta)-\\widetilde h_0(\\log z^\\star)$. That jump lingers on the sine side, so $B$ is read from the cosine side."
  },
  {
    key: "multiply",
    stage: 3,
    title: T.bell,
    derivationAt: 0,
    text: "Bring the noise back. Recorded log income is chosen log income plus $\\nu$, independent of the choice, so the average of the product is the product of the averages. Noise blurs the density, but it only multiplies the transform."
  },
  {
    key: "bell",
    stage: 3,
    title: T.bell,
    derivationAt: 1,
    text: "With log-normal error the factor is the bell $\\exp(-\\sigma^2s^2/2)$, where $\\sigma$ is the standard deviation of the log error. It multiplies every term by the same amount at each frequency."
  },
  {
    key: "order",
    stage: 3,
    title: T.bell,
    derivationAt: 2,
    text: "The bell shrinks every term but keeps their order. On the cosine side $B$ still beats $J_1$ by a factor of $s^2$, whatever $\\sigma$ is."
  },
  {
    key: "logLine",
    stage: 4,
    title: T.line,
    derivationAt: stageFive.logLine,
    text: "Keep the cosine side and take logs. The bell becomes $-\\sigma^2/2$ times $s^2$, a straight line in $s^2$."
  },
  {
    key: "intercept",
    stage: 4,
    title: T.line,
    derivationAt: stageFive.intercept,
    text: "Pull $B$ out of the last term. What remains is a line in $s^2$ with intercept $\\log B$ and slope $-\\sigma^2/2$, plus a term that carries everything about everyone else and dies like $1/s^2$."
  },
  {
    key: "trialLow",
    stage: 4,
    title: T.trial,
    derivationAt: stageFive.trialLow,
    text: "Undo the bell at a trial scale $\\sigma'$: multiply $C(s)$ by $\\exp(\\sigma'^2s^2/2)$. Undo too little, $\\sigma'<\\sigma$, and the result still falls to zero."
  },
  {
    key: "trueSigma",
    stage: 4,
    title: T.trial,
    derivationAt: stageFive.trueSigma,
    text: `Undo too much and it explodes. Only at the true $\\sigma$ does it settle, and it settles on $B$. This is Chapter 4's "only one $\\sigma$ brings the jump back", read off the frequencies.`
  },
  {
    key: "needsAtom",
    stage: 5,
    title: T.needs,
    derivationAt: null,
    text: "The argument needs bunching to find, $B>0$: with no atom, a smooth distribution under less noise fits the same data. It also needs the error's family fixed in advance: log-normal with unknown $\\sigma$ works, a two-sided exponential with unknown scale does not."
  },
  {
    key: "oneSigma",
    stage: 5,
    title: T.needs,
    derivationAt: null,
    text: "It needs one $\\sigma$ for everyone: if $\\sigma$ differs across people, the fit finds the least noisy group and $B$ comes out too small. And it needs no other atoms or jumps nearby, such as zero earnings, a second kink or an edge of the data, unless they sit at known places and are corrected for."
  },
  {
    key: "credits",
    stage: 5,
    title: T.needs,
    derivationAt: null,
    text: "That $B$ is identified under log-normal error is known from CJMS, whose estimator is in Chapter 4, and from Trong and coauthors (2021). What I add: identification under other error families and its failure in some, the cosine and sine split, estimators that read $B$ off the empirical cosine part, and a way to choose the window of frequencies."
  },
  {
    key: "sampleDots",
    stage: 6,
    title: T.cap,
    derivationAt: stageSeven.sampleDots,
    text: "In a sample we have $C_N(s)$, an average of cosines, which is unbiased at every frequency. Its variance stops falling as $s$ rises, while the signal keeps falling."
  },
  {
    key: "noiseFloor",
    stage: 6,
    title: T.cap,
    derivationAt: stageSeven.noiseFloor,
    text: "The usable frequencies end where the signal meets the noise floor. A much larger sample lowers the floor a lot but moves that end only a little: it grows like $\\sqrt{\\log N}/\\sigma$."
  },
  {
    key: "window",
    stage: 6,
    title: T.window,
    derivationAt: stageSeven.window,
    text: "So estimation fits $B$ on a window of frequencies: high enough that everyone else has faded, low enough that the signal clears the floor. Start too low and $J_1$ is read as bunching; start too high and the fit is short and noisy."
  },
  {
    key: "summary",
    stage: 7,
    title: T.sum,
    derivationAt: 0,
    text: "The atom is the one part of the transform that never fades, and it sits on the cosine side. Log-normal error multiplies every term by one bell. So against $s^2$ the log cosine part is a line with intercept $\\log B$, and only at the true $\\sigma$ does $C(s)$, divided by the bell, settle on $B$."
  },
  {
    key: "close",
    stage: 7,
    title: T.sum,
    text: "So $B$ is identified when nothing jumps, under the conditions listed in “What the argument needs”."
  }
];
var STEP_INDEX = Object.fromEntries(PRESSES.map((p, i) => [p.key, i]));
var LOWER_EDGE = Math.log(LAW.lo * LAW.s0) - A;
var UPPER_EDGE = Math.log(LAW.hi * LAW.s1) - A;
var h0 = (x2) => densityLower(A + x2);
var h1 = (x2) => densityUpper(A + x2);
var hEveryoneElse = (x2) => x2 < 0 ? h0(x2) : x2 > 0 ? h1(x2) : 0;
function oneSided(f, x2, dir, h = 2e-4) {
  return dir * (-3 * f(x2) + 4 * f(x2 + dir * h) - f(x2 + 2 * dir * h)) / (2 * h);
}
var J0 = h1(0) - h0(0);
var J1 = oneSided(h1, 0, 1) - oneSided(h0, 0, -1);
oneSided(h0, LOWER_EDGE, 1);
var PIECES = [{
  from: LOWER_EDGE,
  to: 0,
  f: h0
}, {
  from: 0,
  to: UPPER_EDGE,
  f: h1
}];
var nodeCache = new Map();
function nodes(n) {
  let v = nodeCache.get(n);
  if (v) return v;
  v = PIECES.map(({ from, to, f }) => {
    const h = (to - from) / n;
    const w = new Float64Array(n + 1);
    for (let k2 = 0; k2 <= n; k2 += 1) w[k2] = (k2 === 0 || k2 === n ? 1 : k2 % 2 ? 4 : 2) * h * f(from + k2 * h) / 3;
    return {
      x0: from,
      h,
      w
    };
  });
  nodeCache.set(n, v);
  return v;
}
var nodeCount = (s) => {
  const width = UPPER_EDGE - LOWER_EDGE;
  const n = Math.max(1200, Math.ceil(24 * Math.abs(s) * width / (2 * Math.PI)));
  const even = n + n % 2;
  let m = 1200;
  while (m < even) m *= 2;
  return m;
};
function everyoneElse(s) {
  let C2 = 0, S = 0;
  for (const { x0, h, w } of nodes(nodeCount(s))) {
    let c = Math.cos(s * x0), sn = Math.sin(s * x0);
    const dc = Math.cos(s * h), ds = Math.sin(s * h);
    for (let k2 = 0; k2 < w.length; k2 += 1) {
      C2 += w[k2] * c;
      S += w[k2] * sn;
      const nc = c * dc - sn * ds;
      sn = sn * dc + c * ds;
      c = nc;
      if ((k2 & 255) === 255) {
        const r3 = Math.hypot(c, sn);
        c /= r3;
        sn /= r3;
      }
    }
  }
  return {
    C: C2,
    S
  };
}
function chosen(s) {
  const e2 = everyoneElse(s);
  return {
    C: B + e2.C,
    S: e2.S
  };
}
var bell = (s, sigma = SIGMA) => Math.exp(-(sigma * sigma * s * s) / 2);
var TABLE_DS = 0.025;
var table;
function chosenTable() {
  if (table) return table;
  const n = Math.round(80 / TABLE_DS) + 1;
  const C2 = new Float64Array(n), S = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    const v = chosen(i * TABLE_DS);
    C2[i] = v.C;
    S[i] = v.S;
  }
  return table = {
    C: C2,
    S
  };
}
function chosenFast(s) {
  if (s < 0) {
    const v = chosenFast(-s);
    return {
      C: v.C,
      S: -v.S
    };
  }
  if (s > 80) return chosen(s);
  const t = chosenTable();
  const u = s / TABLE_DS, i = Math.min(t.C.length - 2, Math.floor(u)), f = u - i;
  return {
    C: t.C[i] + (t.C[i + 1] - t.C[i]) * f,
    S: t.S[i] + (t.S[i + 1] - t.S[i]) * f
  };
}
function recordedFast(s, sigma = SIGMA) {
  const c = chosenFast(s), b = bell(s, sigma);
  return {
    C: c.C * b,
    S: c.S * b
  };
}
var EXACT_SINE_FROM = (() => {
  for (let s = 0.5; s < 20; s += 0.01) if (chosenFast(s).S > 0) return Math.round(s * 100) / 100;
  return 4;
})();
var ballsCache;
function ballDistances() {
  if (ballsCache) return ballsCache;
  const list = people();
  const x2 = new Float64Array(list.length);
  list.forEach((p, i) => {
    x2[i] = Math.log(recorded(p, SIGMA)) - A;
  });
  return ballsCache = {
    x: x2,
    region: list.map((p) => p.region)
  };
}
function empirical(s, x2 = ballDistances().x) {
  let C2 = 0, S = 0;
  for (let i = 0; i < x2.length; i += 1) {
    C2 += Math.cos(s * x2[i]);
    S += Math.sin(s * x2[i]);
  }
  return {
    C: C2 / x2.length,
    S: S / x2.length
  };
}
var sampleCache = new Map();
function resample(N2, seed = 90211) {
  const key = `${N2}:${seed}`;
  const hit = sampleCache.get(key);
  if (hit) return hit;
  let state = seed >>> 0;
  const uniform = () => {
    state = Math.imul(1664525, state) + 1013904223 >>> 0;
    return (state + 0.5) / 4294967296;
  };
  const eps = normalDraws(N2, seed ^ 1540483477);
  const { zStar: zStar2 } = CH1_DEFAULTS;
  const out = new Float64Array(N2);
  for (let i = 0; i < N2; i += 1) {
    const w = LAW.Finv(uniform());
    const z0 = w * LAW.s0, z1 = w * LAW.s1;
    out[i] = Math.log(z0 < zStar2 ? z0 : z1 > zStar2 ? z1 : zStar2) - A + SIGMA * eps[i];
  }
  sampleCache.set(key, out);
  return out;
}
var N_SAMPLE = 2e3;
var N_LARGE = 64 * N_SAMPLE;
var noiseFloor = (N2) => 2 / Math.sqrt(N2);
var floorCrossing = (N2, sigma = SIGMA) => Math.sqrt(2 * Math.log(B * Math.sqrt(N2) / 2)) / sigma;
function windowLevel(x2, sLo, sHi, n = 40, sigma = SIGMA) {
  let total = 0;
  for (let k2 = 0; k2 < n; k2 += 1) {
    const s = sLo + (sHi - sLo) * (k2 + 0.5) / n;
    total += empirical(s, x2).C / bell(s, sigma);
  }
  return total / n;
}
var TRACE_DIM = 0.35;
var REFERENCE_ALPHA = 0.3;
var AXIS_WIDTH = 1.5;
var SEAM_STATE = {
  reach: 30,
  recorded: REFERENCE_ALPHA,
  chosen: 1,
  bLine: 1,
  dim: TRACE_DIM
};
var N = 360;
function line(ctx, pts, color, width, dash = []) {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  pts.forEach(([x2, y2], i) => i ? ctx.lineTo(x2, y2) : ctx.moveTo(x2, y2));
  ctx.stroke();
  ctx.setLineDash([]);
}
function withAlpha$2(ctx, a2, draw2) {
  if (a2 <= 2e-3) return;
  const old = ctx.globalAlpha;
  ctx.globalAlpha = old * Math.min(1, a2);
  draw2();
  ctx.globalAlpha = old;
}
function samples(frame, f, from, to, n = N) {
  if (to <= from) return [];
  return Array.from({ length: n + 1 }, (_, i) => {
    const s = from + (to - from) * i / n;
    return [frame.X(s), frame.Y(f(s))];
  });
}
function drawTraceAxes(ctx, frame, ink, alpha2 = 1) {
  withAlpha$2(ctx, alpha2, () => {
    line(ctx, [[frame.X(0), frame.Y(0)], [frame.X(30), frame.Y(0)]], ink, AXIS_WIDTH);
    line(ctx, [[frame.X(0), frame.Y(0)], [frame.X(0), frame.Y(1)]], ink, AXIS_WIDTH);
  });
}
function drawTrace(ctx, frame, state, color) {
  const { reach, recorded: recorded2, chosen: chosen2, bLine, dim } = state;
  withAlpha$2(ctx, dim, () => {
    drawTraceAxes(ctx, frame, color.ink);
    withAlpha$2(ctx, bLine, () => line(ctx, [[frame.X(0), frame.Y(B)], [frame.X(30), frame.Y(B)]], color.buncher, 2.2, [8, 6]));
    withAlpha$2(ctx, recorded2, () => {
      line(ctx, samples(frame, (s) => recordedFast(s).C, 0, reach), color.cosine, 3);
      line(ctx, samples(frame, (s) => recordedFast(s).S, 0, reach), color.sine, 3);
    });
    withAlpha$2(ctx, chosen2, () => {
      line(ctx, samples(frame, (s) => chosenFast(s).C, 0, reach), color.cosine, 3);
      line(ctx, samples(frame, (s) => chosenFast(s).S, 0, reach), color.sine, 3);
    });
  });
}
function traceLabelAnchors(frame, reach = 30) {
  return {
    C: {
      x: frame.X(reach) + 8,
      y: frame.Y(chosenFast(reach).C)
    },
    S: {
      x: frame.X(reach) + 8,
      y: frame.Y(chosenFast(reach).S)
    },
    B: {
      x: frame.X(0) - 10,
      y: frame.Y(B)
    }
  };
}
var SAY = 0.45;
function palette(theme) {
  return {
    paper: theme.paper,
    ink: C$2.ink,
    muted: theme["ink-muted"],
    guide: theme.guide,
    slate: theme["ink-muted"],
    lower: C$2.lower,
    buncher: C$2.buncher,
    upper: C$2.upper,
    cosine: theme.cosine,
    sine: theme.sine
  };
}
var lerp$2 = (a2, b, u) => a2 + (b - a2) * u;
var PILE_DOMAIN = [-1.86, 0.86];
var pileX = (rect, x2) => rect.left + (x2 - PILE_DOMAIN[0]) / (PILE_DOMAIN[1] - PILE_DOMAIN[0]) * (rect.right - rect.left);
function binsOf(width) {
  const { x: x2 } = ballDistances();
  const index = new Int32Array(x2.length), rank = new Int32Array(x2.length);
  const counts = new Map();
  let max = 0;
  for (let i = 0; i < x2.length; i += 1) {
    const b = Math.floor((x2[i] - PILE_DOMAIN[0]) / width);
    const r3 = counts.get(b) ?? 0;
    counts.set(b, r3 + 1);
    index[i] = b;
    rank[i] = r3;
    max = Math.max(max, r3 + 1);
  }
  return {
    width,
    index,
    rank,
    max
  };
}
function layoutOf(bins, rect, columns, height) {
  const scale = (rect.right - rect.left) / (PILE_DOMAIN[1] - PILE_DOMAIN[0]);
  const pitch = bins.width * scale / columns;
  const { x: x2 } = ballDistances();
  const settle = (radius2) => stackBalls({
    count: bins.index.length,
    bin: (i) => bins.index[i],
    dropX: (i) => pileX(rect, x2[i]),
    walls: (b) => [rect.left + b * bins.width * scale, rect.left + (b + 1) * bins.width * scale],
    radius: radius2
  });
  let radius = pitch * 0.47, stack = settle(radius);
  for (let k2 = 0; k2 < 4 && stack.maxHeight > height; k2 += 1) {
    radius *= Math.sqrt(height / stack.maxHeight) * 0.995;
    stack = settle(radius);
  }
  const slots = new Float64Array(bins.index.length * 2);
  for (let i = 0; i < bins.index.length; i += 1) {
    slots[2 * i] = stack.x[i];
    slots[2 * i + 1] = rect.bottom - stack.h[i];
  }
  return {
    pitch,
    radius: radius * 1.1,
    slots
  };
}
function fit(bins, rect, height) {
  const scale = (rect.right - rect.left) / (PILE_DOMAIN[1] - PILE_DOMAIN[0]);
  for (let k2 = 1; k2 < 40; k2 += 1) {
    const pitch = bins.width * scale / k2;
    if (Math.ceil(bins.max / k2) * pitch <= height) return {
      k: k2,
      filled: Math.ceil(bins.max / k2) * pitch
    };
  }
  return {
    k: 40,
    filled: height
  };
}
var piles;
function pileLayouts() {
  if (piles) return piles;
  const fullH = PILE_FULL.bottom - PILE_FULL.top - 6, bandH = BAND.bottom - BAND.top - 6;
  let best = {
    width: 0.03,
    score: -1
  };
  for (let w = 0.018; w <= 0.06; w += 1e-3) {
    const f = fit(binsOf(w), PILE_FULL, fullH);
    const scale = (PILE_FULL.right - PILE_FULL.left) / (PILE_DOMAIN[1] - PILE_DOMAIN[0]);
    if (w * scale / f.k < 3.2) continue;
    const score = f.filled / fullH;
    if (score > best.score + 1e-3) best = {
      width: w,
      score
    };
  }
  const bins = binsOf(best.width);
  return piles = {
    full: layoutOf(bins, PILE_FULL, fit(bins, PILE_FULL, fullH).k, fullH),
    band: layoutOf(bins, BAND, fit(bins, BAND, bandH).k, bandH)
  };
}
var hash = (i, k2) => {
  let h = (Math.imul(i + 1, 2654435761) ^ Math.imul(k2 + 11, 40503)) >>> 0;
  h = Math.imul(h ^ h >>> 15, 2246822507) >>> 0;
  return ((h ^ h >>> 13) >>> 0) / 4294967296;
};
var pointsCache;
function points() {
  if (pointsCache) return pointsCache;
  const { x: x2, region } = ballDistances();
  const list = people();
  const n = x2.length;
  const chosen2 = new Float64Array(n), jitter = new Float64Array(n), delay = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    chosen2[i] = region[i] === "buncher" ? 0 : Math.log(list[i].z) - A;
    jitter[i] = 2 * hash(i, 1) - 1;
    delay[i] = hash(i, 2);
  }
  return pointsCache = {
    recorded: x2,
    chosen: chosen2,
    region,
    jitter,
    delay
  };
}
var onCircle = (theta, out = 0) => [CIRCLE.cx + (CIRCLE.r + out) * Math.cos(theta), CIRCLE.cy - (CIRCLE.r + out) * Math.sin(theta)];
var wheelXY = (u, v) => [CIRCLE.cx + CIRCLE.r * u, CIRCLE.cy - CIRCLE.r * v];
var MAG_REGION = {
  u0: -0.09,
  v1: 0.44,
  side: 0.66
};
var magXY = (u, v) => [MAG.left + (u - MAG_REGION.u0) / MAG_REGION.side * (MAG.right - MAG.left), MAG.top + (MAG_REGION.v1 - v) / MAG_REGION.side * (MAG.bottom - MAG.top)];
var MAG_SOURCE = (() => {
  const [l, t] = wheelXY(MAG_REGION.u0, MAG_REGION.v1);
  const [r3, b] = wheelXY(MAG_REGION.u0 + MAG_REGION.side, MAG_REGION.v1 - MAG_REGION.side);
  return {
    left: l,
    top: t,
    right: r3,
    bottom: b
  };
})();
var PATH_DS = 0.025;
var pathCache;
function empiricalPath() {
  if (pathCache) return pathCache;
  const n = Math.round((15 - S_LOW) / PATH_DS) + 1;
  const C2 = new Float64Array(n), S = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    const v = empirical(S_LOW + i * PATH_DS);
    C2[i] = v.C;
    S[i] = v.S;
  }
  return pathCache = {
    C: C2,
    S
  };
}
var ZOOM_DOMAIN = [-0.31, 0.31];
var WIDE_DOMAIN = [-1.42, 0.82];
var WAVE_AMP = 0.9;
var panelX = (v, x2) => v.rect.left + (x2 - v.x0) / (v.x1 - v.x0) * (v.rect.right - v.rect.left);
var panelY = (v, d2) => v.base - v.k * d2;
var lerpView = (a2, b, u) => ({
  rect: {
    left: lerp$2(a2.rect.left, b.rect.left, u),
    top: lerp$2(a2.rect.top, b.rect.top, u),
    right: lerp$2(a2.rect.right, b.rect.right, u),
    bottom: lerp$2(a2.rect.bottom, b.rect.bottom, u)
  },
  x0: lerp$2(a2.x0, b.x0, u),
  x1: lerp$2(a2.x1, b.x1, u),
  base: lerp$2(a2.base, b.base, u),
  k: lerp$2(a2.k, b.k, u)
});
var DENSITY_PEAK = observedDensity(A);
var BAND_VIEW = {
  rect: BAND,
  x0: PILE_DOMAIN[0],
  x1: PILE_DOMAIN[1],
  base: BAND.bottom,
  k: (BAND.bottom - BAND.top - 8) / DENSITY_PEAK
};
var wide = (rect) => {
  const h = rect.bottom - rect.top;
  const base = rect.top + 0.64 * h;
  return {
    rect,
    x0: WIDE_DOMAIN[0],
    x1: WIDE_DOMAIN[1],
    base,
    k: (base - rect.top - 4) / DENSITY_PEAK
  };
};
var zoom = (rect) => {
  const h = rect.bottom - rect.top;
  const base = rect.top + 0.56 * h;
  return {
    rect,
    x0: ZOOM_DOMAIN[0],
    x1: ZOOM_DOMAIN[1],
    base,
    k: (base - rect.top - 18) / 1
  };
};
var COS_WIDE = wide(COS_PANEL);
var SIN_WIDE = wide(SIN_PANEL);
var COS_ZOOM = zoom(COS_PANEL);
var SIN_ZOOM = zoom(SIN_PANEL);
var GRID_LO = -1.9, GRID_HI = 1, GRID_DX = 2e-3;
var contCache;
function contTable() {
  if (contCache) return contCache;
  const n = Math.round((GRID_HI - GRID_LO) / GRID_DX) + 1;
  const v = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    const x2 = GRID_LO + i * GRID_DX;
    v[i] = observedDensity(A + x2) - B * phi(x2 / SIGMA) / SIGMA;
  }
  return contCache = v;
}
function recordedContinuous(x2) {
  const t = contTable();
  const u = (x2 - GRID_LO) / GRID_DX;
  const i = Math.max(0, Math.min(t.length - 2, Math.floor(u)));
  const f = Math.max(0, Math.min(1, u - i));
  return t[i] + (t[i + 1] - t[i]) * f;
}
var bunchersBump = (x2, sigmaPrime) => B * phi(x2 / sigmaPrime) / sigmaPrime;
var everyoneElseAt = (x2, u) => lerp$2(recordedContinuous(x2), hEveryoneElse(x2), u);
var blurAt = (u) => SIGMA * (1 - u) + 12e-4 * u;
function traceAxisLabelAt() {
  const f = plotFrame(TRACE_VIEW);
  return {
    x: f.X(TRACE_VIEW.s[1]) - 24,
    y: f.Y(0) + 36
  };
}
var WHEEL_DURATIONS = {
  opening: 1.2,
  euler: 2,
  wrap: 2.2,
  average: 2,
  sweepWheel: 2.5,
  transform: 2.6,
  atom: 2,
  settles: 2.5,
  sides: 2
};
var LAST = "sides";
var lerp$1 = (a2, b, u) => a2 + (b - a2) * u;
var clamp01$3 = (u) => Math.max(0, Math.min(1, u));
var lin = (t, key, seconds, lead = SAY) => clamp01$3((since(t, key) - lead) / seconds);
function withAlpha$1(ctx, a2, draw2) {
  if (a2 <= 2e-3) return;
  const old = ctx.globalAlpha;
  ctx.globalAlpha = old * Math.min(1, a2);
  draw2();
  ctx.globalAlpha = old;
}
function path(ctx, pts, color, width, dash = []) {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  pts.forEach(([x2, y2], i) => i ? ctx.lineTo(x2, y2) : ctx.moveTo(x2, y2));
  ctx.stroke();
  ctx.setLineDash([]);
}
function disc(ctx, x2, y2, r3, color) {
  ctx.beginPath();
  ctx.arc(x2, y2, r3, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}
function arrow(ctx, x0, y0, x1, y1, color, width, head2 = 13) {
  const len = Math.hypot(x1 - x0, y1 - y0);
  if (len < 0.5) return;
  const h = Math.min(head2, len * 0.6);
  const ux = (x1 - x0) / len, uy = (y1 - y0) / len;
  const bx = x1 - ux * h, by = y1 - uy * h;
  path(ctx, [[x0, y0], [bx + ux * 1, by + uy * 1]], color, width);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(bx - uy * h * 0.45, by + ux * h * 0.45);
  ctx.lineTo(bx + uy * h * 0.45, by - ux * h * 0.45);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}
function wheelClock(t) {
  const { step } = sceneAt(t);
  const slide = show(t, "euler", 0.8);
  const ring2 = show(t, "euler", 0.8, SAY + 0.3);
  const tri = show(t, "euler", 0.45, SAY + 1);
  const triOut = show(t, "wrap", 0.4);
  const zLabel = show(t, "wrap", 0.4, SAY + 1.2);
  const arrowGrow = show(t, "average", 0.5);
  const magIn = show(t, "average", 0.5, SAY + 0.4);
  const magDots = show(t, "average", 0.4, SAY + 0.9);
  const u5 = lin(t, "sweepWheel", 2);
  const s5 = S_LOW + (15 - S_LOW) * (1 - Math.cos(2 * Math.PI * u5)) / 2;
  const pathMax = u5 < 0.5 ? s5 : 15;
  const magOut = show(t, "transform", 0.4);
  const grey = show(t, "transform", 0.5);
  const rewind6 = show(t, "transform", 0.45);
  const pileOut = show(t, "transform", 0.5);
  const move = show(t, "transform", 0.6, SAY + 0.4);
  const wave = show(t, "transform", 0.5, SAY + 0.85);
  const traceIn = show(t, "transform", 0.3, SAY + 0.6);
  const sweep6 = smoothstep(lin(t, "transform", 1.45, SAY + 0.65));
  const recLabels = show(t, "transform", 0.3, SAY + 1.8);
  const unblur = show(t, "atom", 1.1);
  const gather = show(t, "atom", 1);
  const discIn = show(t, "atom", 0.4, SAY + 0.9);
  const arrowOut = show(t, "atom", 0.5);
  const toReference = show(t, "atom", 1);
  const panelLabels = show(t, "atom", 0.4, SAY + 1.1);
  const rewind8 = show(t, "settles", 0.35);
  const arrowIn8 = show(t, "settles", 0.25, SAY + 0.3);
  const sweep8 = smoothstep(lin(t, "settles", 1.55, SAY + 0.4));
  const choLabels = show(t, "settles", 0.25, SAY + 1.75);
  const zoom2 = show(t, "sides", 1);
  const dim = show(t, "sides", 0.8);
  const net = show(t, "sides", 0.45, SAY + 1.05);
  const out = step >= I.rates ? show(t, "rates", 0.6) : 0;
  let sWheel = S_LOW;
  if (step === I.sweepWheel) sWheel = s5;
  if (step === I.transform) sWheel = rewind6 < 1 ? S_LOW * (1 - rewind6) : 30 * sweep6;
  if (step === I.atom) sWheel = 30;
  if (step === I.settles) sWheel = rewind8 < 1 ? 30 * (1 - rewind8) : 30 * sweep8;
  if (step > I.settles) sWheel = 30;
  return {
    step,
    slide,
    ring: ring2,
    tri,
    triOut,
    zLabel,
    arrowGrow,
    magIn,
    magDots,
    s5,
    pathMax,
    magOut,
    grey,
    rewind6,
    pileOut,
    move,
    wave,
    traceIn,
    sweep6,
    recLabels,
    unblur,
    gather,
    discIn,
    arrowOut,
    toReference,
    panelLabels,
    rewind8,
    arrowIn8,
    sweep8,
    choLabels,
    zoom: zoom2,
    dim,
    net,
    out,
    sWheel
  };
}
var circleAlpha = (k2) => (1 - (1 - TRACE_DIM) * k2.dim) * (1 - k2.out);
function traceLayers(t, k2) {
  const { step } = k2;
  const max = 30;
  if (step < I.transform || step > I.sides) return [];
  if (step === I.transform) return [{
    reach: max * k2.sweep6,
    recorded: 1,
    chosen: 0,
    bLine: 0,
    dim: k2.traceIn
  }];
  if (step === I.atom) return [{
    reach: max,
    recorded: 1 - (1 - REFERENCE_ALPHA) * k2.toReference,
    chosen: 0,
    bLine: k2.toReference,
    dim: 1
  }];
  if (step === I.settles) return [{
    reach: max,
    recorded: REFERENCE_ALPHA,
    chosen: 0,
    bLine: 1,
    dim: 1
  }, {
    reach: max * (k2.rewind8 < 1 ? 0 : k2.sweep8),
    recorded: 0,
    chosen: 1,
    bLine: 0,
    dim: 1
  }];
  if (k2.dim >= 1) return [SEAM_STATE];
  return [{
    ...SEAM_STATE,
    dim: 1 - (1 - TRACE_DIM) * k2.dim
  }];
}
var REGION_COLOR = (C2, r3) => C2[r3];
function drawPile(ctx, k2, C2) {
  const alpha2 = 1 - k2.pileOut;
  if (alpha2 <= 2e-3) return;
  const { full, band: band2 } = pileLayouts();
  const P2 = points();
  const radius = lerp$1(full.radius, band2.radius, k2.slide);
  const bottom = lerp$1(PILE_FULL.bottom, BAND.bottom, k2.slide);
  withAlpha$1(ctx, alpha2, () => {
    for (const pass of [0, 1]) for (const region of pass ? ["buncher"] : ["lower", "upper"]) {
      ctx.beginPath();
      for (let i = 0; i < P2.region.length; i += 1) {
        if (P2.region[i] !== region) continue;
        const x2 = lerp$1(full.slots[2 * i], band2.slots[2 * i], k2.slide);
        const y2 = lerp$1(full.slots[2 * i + 1], band2.slots[2 * i + 1], k2.slide);
        ctx.moveTo(x2 + radius, y2);
        ctx.arc(x2, y2, radius, 0, Math.PI * 2);
      }
      ctx.fillStyle = REGION_COLOR(C2, region);
      ctx.fill();
    }
    path(ctx, [[PILE_FULL.left, bottom], [PILE_FULL.right, bottom]], C2.ink, 1.5);
    const zx = pileX(PILE_FULL, 0);
    path(ctx, [[zx, bottom], [zx, bottom + 8]], C2.ink, 1.5);
  });
}
function drawCircle(ctx, t, k2, C2) {
  const a2 = circleAlpha(k2);
  const { cx, cy, r: r3 } = CIRCLE;
  withAlpha$1(ctx, a2 * k2.ring, () => {
    path(ctx, [[cx - r3 - 14, cy], [cx + r3 + 14, cy]], C2.guide, 1);
    path(ctx, [[cx, cy + r3 + 14], [cx, cy - r3 - 14]], C2.guide, 1);
  });
  if (k2.ring > 0) withAlpha$1(ctx, a2, () => {
    ctx.beginPath();
    ctx.strokeStyle = C2.ink;
    ctx.lineWidth = 2.5;
    ctx.arc(cx, cy, r3, 0, -Math.PI * 2 * k2.ring, true);
    ctx.stroke();
  });
  const triA = a2 * k2.tri * (1 - k2.triOut);
  if (triA > 2e-3) withAlpha$1(ctx, triA, () => {
    const th = THETA;
    const [px, py] = onCircle(th);
    const [fx] = wheelXY(Math.cos(th), 0);
    path(ctx, [[cx, cy], [px, py]], C2.ink, 2.5);
    path(ctx, [[cx, cy], [fx, cy]], C2.cosine, 4.5);
    path(ctx, [[fx, cy], [fx, py]], C2.sine, 4.5);
    ctx.beginPath();
    ctx.strokeStyle = C2.slate;
    ctx.lineWidth = 2;
    ctx.arc(cx, cy, 36, 0, -th, true);
    ctx.stroke();
    disc(ctx, px, py, 6, C2.ink);
  });
}
var THETA = 0.92;
function drawPoints(ctx, t, k2, C2) {
  const { step } = k2;
  if (step < I.wrap) return;
  const a2 = circleAlpha(k2);
  if (a2 <= 2e-3) return;
  const { band: band2 } = pileLayouts();
  const P2 = points();
  const n = P2.region.length;
  const riseLocal = since(t, "wrap") - SAY;
  const greyU = k2.grey;
  const baseR = lerp$1(2.7, 2.1, greyU);
  const chosenU = step < I.atom ? 0 : step > I.atom ? 1 : k2.gather;
  const bunchersFade = step < I.atom ? 0 : step > I.atom ? 1 : k2.discIn;
  const sW = k2.sWheel;
  const pos = (i) => {
    const x2 = lerp$1(P2.recorded[i], P2.chosen[i], chosenU);
    const isB = P2.region[i] === "buncher";
    const out = 5 * P2.jitter[i] * (isB ? 1 - chosenU : 1);
    const target2 = onCircle(sW * x2, out);
    if (step > I.wrap) return target2;
    const u = smoothstep((riseLocal - 0.35 * P2.delay[i]) / 1.1);
    if (u <= 0) return null;
    const from = [band2.slots[2 * i], band2.slots[2 * i + 1]];
    const lift = 60 * Math.sin(Math.PI * u);
    return [lerp$1(from[0], target2[0], u), lerp$1(from[1], target2[1], u) - lift];
  };
  const groups = [];
  if (greyU < 1) groups.push({
    regions: ["lower", "upper"],
    color: "",
    alpha: 0.55 * (1 - greyU)
  });
  if (greyU > 0) groups.push({
    regions: ["lower", "upper"],
    color: C2.guide,
    alpha: 0.6 * greyU
  });
  const bunchColour = greyU < 1 ? 1 - greyU : chosenU;
  if (bunchColour < 1) groups.push({
    regions: ["buncher"],
    color: C2.guide,
    alpha: 0.6 * (1 - bunchColour) * (1 - bunchersFade)
  });
  if (bunchColour > 0) groups.push({
    regions: ["buncher"],
    color: C2.buncher,
    alpha: 0.85 * bunchColour * (1 - bunchersFade)
  });
  withAlpha$1(ctx, a2, () => {
    for (const g of groups) for (const region of g.regions) {
      if (g.alpha <= 2e-3) continue;
      const colour = g.color || REGION_COLOR(C2, region);
      withAlpha$1(ctx, g.alpha, () => {
        ctx.beginPath();
        for (let i = 0; i < n; i += 1) {
          if (P2.region[i] !== region) continue;
          const p = pos(i);
          if (!p) continue;
          ctx.moveTo(p[0] + baseR, p[1]);
          ctx.arc(p[0], p[1], baseR, 0, Math.PI * 2);
        }
        ctx.fillStyle = colour;
        ctx.fill();
      });
    }
    if (bunchersFade > 0) withAlpha$1(ctx, bunchersFade, () => {
      const [x2, y2] = onCircle(0);
      disc(ctx, x2, y2, 12, C2.buncher);
    });
  });
}
function drawArrow(ctx, t, k2, C2) {
  const { step } = k2;
  if (step < I.average) return;
  const a2 = circleAlpha(k2);
  let tip = {
    C: 0,
    S: 0
  }, alpha2 = 1, grow2 = 1, dots2 = 0;
  if (step <= I.sweepWheel) {
    tip = empirical(k2.sWheel);
    grow2 = k2.arrowGrow;
  } else if (step === I.transform) {
    tip = k2.rewind6 < 1 ? empirical(k2.sWheel) : recordedFast(k2.sWheel);
    dots2 = k2.rewind6;
  } else if (step === I.atom) {
    tip = recordedFast(30);
    alpha2 = 1 - k2.arrowOut;
    dots2 = 1;
  } else {
    tip = chosenFast(k2.sWheel);
    alpha2 = step === I.settles ? k2.arrowIn8 : 1;
    dots2 = 1;
  }
  const [cx, cy] = wheelXY(0, 0);
  if (step >= I.settles) withAlpha$1(ctx, a2 * (step === I.settles ? k2.arrowIn8 : 1), () => {
    const [bx, by] = wheelXY(B, 0);
    path(ctx, [[cx, cy], [bx, by]], C2.buncher, 7);
  });
  withAlpha$1(ctx, a2 * alpha2, () => {
    const [tx, ty] = wheelXY(tip.C * grow2, tip.S * grow2);
    arrow(ctx, cx, cy, tx, ty, C2.slate, 3.2, 13);
    if (dots2 > 0) withAlpha$1(ctx, dots2, () => {
      const [ux, uy] = wheelXY(tip.C, 0), [vx, vy] = wheelXY(0, tip.S);
      disc(ctx, ux, uy, 5.5, C2.cosine);
      disc(ctx, vx, vy, 5.5, C2.sine);
    });
  });
}
function drawMag(ctx, t, k2, C2) {
  const { step } = k2;
  if (step < I.average || step > I.transform) return;
  const a2 = k2.magIn * (1 - k2.magOut);
  if (a2 <= 2e-3) return;
  const tip = empirical(k2.sWheel);
  withAlpha$1(ctx, a2, () => {
    const S = MAG_SOURCE;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = C2.slate;
    ctx.setLineDash([]);
    ctx.strokeRect(S.left, S.top, S.right - S.left, S.bottom - S.top);
    path(ctx, [[S.right, S.top], [MAG.left, MAG.top]], C2.guide, 1.2);
    path(ctx, [[S.right, S.bottom], [MAG.left, MAG.bottom]], C2.guide, 1.2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = C2.slate;
    ctx.strokeRect(MAG.left, MAG.top, MAG.right - MAG.left, MAG.bottom - MAG.top);
    ctx.save();
    ctx.beginPath();
    ctx.rect(MAG.left + 1, MAG.top + 1, MAG.right - MAG.left - 2, MAG.bottom - MAG.top - 2);
    ctx.clip();
    const [ox, oy] = magXY(0, 0);
    path(ctx, [[MAG.left, oy], [MAG.right, oy]], C2.guide, 1.2);
    path(ctx, [[ox, MAG.top], [ox, MAG.bottom]], C2.guide, 1.2);
    if (step >= I.sweepWheel) {
      const { C: pc, S: ps } = empiricalPath();
      const last = step > I.sweepWheel ? pc.length - 1 : Math.min(pc.length - 1, Math.round((k2.pathMax - S_LOW) / PATH_DS));
      const pts = [];
      for (let i = 0; i <= last; i += 1) pts.push(magXY(pc[i], ps[i]));
      withAlpha$1(ctx, 0.5, () => path(ctx, pts, C2.slate, 2));
    }
    const [tx, ty] = magXY(tip.C * k2.arrowGrow, tip.S * k2.arrowGrow);
    arrow(ctx, ox, oy, tx, ty, C2.slate, 3.5, 16);
    withAlpha$1(ctx, k2.magDots, () => {
      const [ux, uy] = magXY(tip.C, 0), [vx, vy] = magXY(0, tip.S);
      path(ctx, [[tx, ty], [ux, uy]], C2.cosine, 1.5, [5, 5]);
      path(ctx, [[tx, ty], [vx, vy]], C2.sine, 1.5, [5, 5]);
      disc(ctx, ux, uy, 7, C2.cosine);
      disc(ctx, vx, vy, 7, C2.sine);
    });
    ctx.restore();
  });
}
function panelViews(t) {
  const k2 = wheelClock(t);
  if (k2.step < I.transform) return null;
  return {
    k: k2,
    cos: k2.zoom > 0 ? lerpView(COS_WIDE, COS_ZOOM, k2.zoom) : lerpView(BAND_VIEW, COS_WIDE, k2.move),
    sin: k2.zoom > 0 ? lerpView(SIN_WIDE, SIN_ZOOM, k2.zoom) : lerpView(BAND_VIEW, SIN_WIDE, k2.move),
    freq: lerp$1(12, 25, k2.zoom)
  };
}
function sampleXs(v, sp) {
  const n = 420, xs2 = [];
  for (let i = 0; i <= n; i += 1) {
    const x2 = v.x0 + (v.x1 - v.x0) * i / n;
    if (Math.abs(x2) > 1e-6) xs2.push(x2);
  }
  xs2.push(-1e-7, 1e-7);
  for (let i = -40; i <= 40; i += 1) xs2.push(i / 40 * 5 * sp + (i === 0 ? 2e-7 : 0));
  return xs2.filter((x2) => x2 >= v.x0 && x2 <= v.x1).sort((a2, b) => a2 - b);
}
function drawPanel(ctx, v, kind, freq, k2, C2, alpha2) {
  if (alpha2 <= 2e-3) return;
  const side = kind === "cos" ? C2.cosine : C2.sine;
  const w = (x2) => kind === "cos" ? Math.cos(freq * x2) : Math.sin(freq * x2);
  const ub = k2.unblur;
  const sp = blurAt(ub);
  const bumpOn = ub < 1;
  const dens = (x2) => everyoneElseAt(x2, ub) + (bumpOn ? bunchersBump(x2, sp) : 0);
  const xs2 = sampleXs(v, sp);
  const m = k2.wave;
  const X2 = (x2) => panelX(v, x2), Y = (d2) => panelY(v, d2);
  const { rect } = v;
  withAlpha$1(ctx, alpha2, () => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(rect.left - 2, rect.top, rect.right - rect.left + 4, rect.bottom - rect.top);
    ctx.clip();
    if (m > 0) withAlpha$1(ctx, m, () => {
      const pts = [];
      for (let i = 0; i <= 600; i += 1) {
        const x2 = v.x0 + (v.x1 - v.x0) * i / 600;
        pts.push([X2(x2), Y(WAVE_AMP * w(x2))]);
      }
      path(ctx, pts, C2.guide, 1.6, [5, 5]);
    });
    const prod = xs2.map((x2) => [X2(x2), Y(dens(x2) * (1 - m + m * w(x2)))]);
    if (m > 0) {
      withAlpha$1(ctx, 0.24 * m * (1 - 0.45 * k2.net), () => {
        ctx.beginPath();
        ctx.moveTo(prod[0][0], v.base);
        for (const [x2, y2] of prod) ctx.lineTo(x2, y2);
        ctx.lineTo(prod[prod.length - 1][0], v.base);
        ctx.closePath();
        ctx.fillStyle = side;
        ctx.fill();
      });
      withAlpha$1(ctx, m, () => path(ctx, prod, side, 2.5));
    }
    if (kind === "sin" && k2.net > 0) {
      const half = Math.PI / freq;
      const N2 = 80;
      const upper = [], mirror = [];
      for (let i = 0; i <= N2; i += 1) {
        const x2 = half * i / N2;
        upper.push([X2(x2), Y(hEveryoneElse(x2 + 1e-9) * w(x2))]);
        mirror.push([X2(x2), Y(hEveryoneElse(-x2 - 1e-9) * w(x2))]);
      }
      withAlpha$1(ctx, k2.net, () => {
        ctx.beginPath();
        upper.forEach(([x2, y2], i) => i ? ctx.lineTo(x2, y2) : ctx.moveTo(x2, y2));
        for (let i = mirror.length - 1; i >= 0; i -= 1) ctx.lineTo(mirror[i][0], mirror[i][1]);
        ctx.closePath();
        ctx.fillStyle = side;
        ctx.globalAlpha *= 0.85;
        ctx.fill();
        ctx.globalAlpha /= 0.85;
        path(ctx, mirror, C2.lower, 2, [4, 4]);
      });
    }
    ctx.restore();
    path(ctx, [[rect.left, v.base], [rect.right, v.base]], C2.ink, 1.5);
    const left = xs2.filter((x2) => x2 < 0), right = xs2.filter((x2) => x2 > 0);
    ctx.save();
    ctx.beginPath();
    ctx.rect(rect.left - 2, rect.top, rect.right - rect.left + 4, rect.bottom - rect.top + 2);
    ctx.clip();
    withAlpha$1(ctx, 1 - ub, () => path(ctx, xs2.map((x2) => [X2(x2), Y(dens(x2))]), C2.ink, 2.5));
    if (ub > 0) withAlpha$1(ctx, ub, () => {
      path(ctx, left.map((x2) => [X2(x2), Y(everyoneElseAt(x2, ub))]), C2.lower, 2.8);
      path(ctx, right.map((x2) => [X2(x2), Y(everyoneElseAt(x2, ub))]), C2.upper, 2.8);
      if (bumpOn) path(ctx, xs2.filter((x2) => Math.abs(x2) < 5 * sp).map((x2) => [X2(x2), Y(dens(x2))]), C2.buncher, 2.8);
    });
    ctx.restore();
    const spike = smoothstep((ub - 0.8) / 0.2);
    if (spike > 0) withAlpha$1(ctx, spike, () => {
      if (kind === "cos") arrow(ctx, X2(0), v.base, X2(0), rect.top + 4, C2.buncher, 3.5, 13);
      else disc(ctx, X2(0), v.base, 6, C2.buncher);
    });
  });
}
function drawWheel(ctx, t, theme) {
  const k2 = wheelClock(t);
  if (k2.step > I.rates || k2.step === I.rates && k2.out >= 1) return;
  const C2 = palette(theme);
  drawPile(ctx, k2, C2);
  if (k2.step >= I.euler) drawCircle(ctx, t, k2, C2);
  drawPoints(ctx, t, k2, C2);
  drawArrow(ctx, t, k2, C2);
  drawMag(ctx, t, k2, C2);
  const views = panelViews(t);
  if (views) {
    const a2 = (k2.step === I.transform ? k2.pileOut : 1) * (1 - k2.out);
    drawPanel(ctx, views.cos, "cos", views.freq, k2, C2, a2);
    drawPanel(ctx, views.sin, "sin", views.freq, k2, C2, a2);
  }
  if (k2.step <= I[LAST]) for (const layer of traceLayers(t, k2)) drawTrace(ctx, plotFrame(TRACE_VIEW), layer, C2);
}
var LABEL_GAP = 8;
var COLOR$1 = {
  lower: C$2.lower,
  buncher: C$2.buncher,
  upper: C$2.upper,
  cosine: "var(--cosine)",
  sine: "var(--sine)",
  muted: "var(--ink-muted, #615c52)"
};
function Label$1({ tex, x: x2, y: y2, width = 120, anchor = "start", color }) {
  return jsx("g", {
    className: "cdf-glyph-halo",
    style: color ? { color } : void 0,
    children: jsx(SvgMathLabel, {
      tex,
      x: x2,
      y: y2,
      width,
      height: 48,
      anchor,
      className: `cdf-label${color ? " sp-coloured" : ""}`
    })
  });
}
function WheelOverlay({ t }) {
  const k2 = wheelClock(t);
  const { step } = k2;
  if (step > I.rates) return null;
  const r3 = String.raw;
  const out = [];
  const fade = (a2, node, key) => {
    if (a2 > 0.01) out.push(jsx("g", {
      opacity: Math.min(1, a2),
      children: node
    }, key));
  };
  const wheelA = circleAlpha(k2);
  const bottom = lerp$1(PILE_FULL.bottom, BAND.bottom, k2.slide);
  fade(1 - k2.pileOut, jsx(Label$1, {
    tex: r3`\log z^\star`,
    x: pileX(PILE_FULL, 0),
    y: bottom + lerp$1(38, 34, k2.slide),
    anchor: "middle",
    width: 130
  }), "pileTick");
  const triA = k2.tri * (1 - k2.triOut);
  if (step >= I.euler) {
    const { cx, cy, r: R } = CIRCLE;
    const fx = cx + R * Math.cos(THETA), py = cy - R * Math.sin(THETA);
    fade(triA, jsx(Label$1, {
      tex: r3`\cos\theta`,
      x: (cx + fx) / 2,
      y: cy + 36,
      anchor: "middle",
      width: 110,
      color: COLOR$1.cosine
    }), "cos");
    fade(triA, jsx(Label$1, {
      tex: r3`\sin\theta`,
      x: fx + 10,
      y: cy - 0.28 * (cy - py) + 10,
      width: 110,
      color: COLOR$1.sine
    }), "sin");
    fade(triA, jsx(Label$1, {
      tex: r3`\theta`,
      x: cx + 46 * Math.cos(THETA / 2) + 4,
      y: cy - 46 * Math.sin(THETA / 2) + 8,
      width: 40
    }), "theta");
    fade(triA, jsx(Label$1, {
      tex: "i",
      x: cx - 12,
      y: cy - R + 22,
      anchor: "end",
      width: 30
    }), "i");
  }
  fade(k2.zLabel * wheelA, jsx(Label$1, {
    tex: r3`\log z^\star`,
    x: CIRCLE.cx + CIRCLE.r + 18,
    y: CIRCLE.cy + 10,
    width: 120
  }), "zCircle");
  if (step >= I.average && step <= I.transform) {
    const tip = empirical(k2.sWheel);
    const a2 = k2.magDots * (1 - k2.magOut);
    const [ux, uy] = magXY(tip.C, 0), [vx, vy] = magXY(0, tip.S);
    const up = tip.S >= 0;
    fade(a2, jsx(Label$1, {
      tex: "C_N(s)",
      x: ux,
      y: up ? uy + 38 : uy - 14,
      anchor: "middle",
      width: 110,
      color: COLOR$1.cosine
    }), "CN");
    fade(a2, jsx(Label$1, {
      tex: "S_N(s)",
      x: vx + 14,
      y: up ? vy - 10 : vy + 30,
      width: 110,
      color: COLOR$1.sine
    }), "SN");
  }
  if (step >= I.transform && step <= I.sides) {
    const f = plotFrame(TRACE_VIEW);
    const traceA = step === I.sides ? 1 - (1 - TRACE_DIM) * k2.dim : 1;
    const sl = traceAxisLabelAt();
    fade(k2.traceIn * traceA, jsx(Label$1, {
      tex: "s",
      x: sl.x,
      y: sl.y,
      anchor: "middle",
      width: 40
    }), "sAxis");
    const recA = k2.recLabels * (step === I.atom ? 1 - k2.toReference : step > I.atom ? 0 : 1);
    const c4 = recordedFast(4).C;
    fade(recA, jsx(Label$1, {
      tex: "C(s)",
      x: f.X(4) + 12,
      y: f.Y(c4) - 14,
      width: 90,
      color: COLOR$1.cosine
    }), "Crec");
    fade(recA, jsx(Label$1, {
      tex: "S(s)",
      x: f.X(2),
      y: f.Y(0) + 36,
      anchor: "middle",
      width: 90,
      color: COLOR$1.sine
    }), "Srec");
    const anchors = traceLabelAnchors(f);
    const choA = (step === I.settles ? k2.choLabels : step > I.settles ? 1 : 0) * traceA;
    fade(choA, jsx(Label$1, {
      tex: "C(s)",
      x: anchors.C.x - LABEL_GAP,
      y: anchors.C.y - 12,
      anchor: "end",
      width: 90,
      color: COLOR$1.cosine
    }), "C");
    fade(choA, jsx(Label$1, {
      tex: "S(s)",
      x: anchors.S.x - LABEL_GAP,
      y: anchors.S.y - 12,
      anchor: "end",
      width: 90,
      color: COLOR$1.sine
    }), "S");
    fade((step < I.atom ? 0 : step === I.atom ? k2.toReference : 1) * traceA, jsx(Label$1, {
      tex: "B",
      x: anchors.B.x,
      y: anchors.B.y + 9,
      anchor: "end",
      width: 40,
      color: COLOR$1.buncher
    }), "Btrace");
  }
  const views = panelViews(t);
  if (views && step >= I.atom) {
    const a2 = k2.panelLabels * (1 - k2.out);
    const v = views.cos;
    const lx = lerp$1(-0.5, -0.17, k2.zoom), rx = lerp$1(0.3, 0.15, k2.zoom);
    fade(a2, jsx(Label$1, {
      tex: r3`\widetilde h_0`,
      x: panelX(v, lx) - 6,
      y: panelY(v, h0(lx)) - 14,
      anchor: "end",
      width: 70,
      color: COLOR$1.lower
    }), "h0");
    fade(a2, jsx(Label$1, {
      tex: r3`\widetilde h_1`,
      x: panelX(v, rx) + 6,
      y: panelY(v, h1(rx)) - 14,
      width: 70,
      color: COLOR$1.upper
    }), "h1");
    fade(a2, jsx(Label$1, {
      tex: "B",
      x: panelX(v, 0) - 10,
      y: v.rect.top + 26,
      anchor: "end",
      width: 40,
      color: COLOR$1.buncher
    }), "Bpanel");
    fade(k2.discIn * wheelA, jsx(Label$1, {
      tex: r3`\text{angle zero at every }s`,
      x: CIRCLE.cx + CIRCLE.r - 22,
      y: CIRCLE.cy + 54,
      anchor: "end",
      width: 300,
      color: COLOR$1.buncher
    }), "angle0");
  }
  if (!out.length) return null;
  return jsx("g", {
    className: "sp-wheel-overlay",
    children: out
  });
}
var DOTS_SMALL = [
  0.4876567,
  0.2911931,
  0.21462,
  0.1864873,
  0.1755997,
  0.1675105,
  0.1576822,
  0.1434647,
  0.1254605,
  0.1077811,
  0.09464787,
  0.08729534,
  0.08379025,
  0.08103619,
  0.07689417,
  0.07106506,
  0.0646693,
  0.05922919,
  0.05579697,
  0.0545938,
  0.05512353,
  0.05651732,
  0.05786769,
  0.0584266,
  0.05766628,
  0.0552677,
  0.05110403,
  0.04524874,
  0.03799693,
  0.02986604,
  0.02154689,
  0.01379832,
  7305677e-9,
  2541556e-9,
  -3303757e-10,
  -1479915e-9,
  -1356244e-9,
  -5708006e-10,
  2509227e-10,
  6104962e-10,
  2370635e-10,
  -8734812e-10,
  -2484762e-9,
  -419999e-8,
  -5572994e-9,
  -6222726e-9,
  -592582e-8,
  -4669131e-9,
  -2654439e-9,
  -2581582e-10,
  204243e-8,
  3759551e-9,
  4483648e-9,
  3954411e-9,
  2102979e-9,
  -9395344e-10,
  -4865768e-9,
  -9241417e-9,
  -0.01357007,
  -0.01736225,
  -0.02019798,
  -0.02177473,
  -0.02193545,
  -0.0206754,
  -0.01812937,
  -0.01454357,
  -0.01023784,
  -5564384e-9,
  -8686492e-10,
  3543276e-9,
  7427805e-9,
  0.0106165
];
var DOTS_LARGE = [
  0.4691305,
  0.2713536,
  0.2076232,
  0.1901365,
  0.181799,
  0.1702259,
  0.1557608,
  0.1398925,
  0.1238819,
  0.1092886,
  0.09731412,
  0.08811927,
  0.08098174,
  0.07496281,
  0.06944029,
  0.0642236,
  0.05936404,
  0.0549123,
  0.05079638,
  0.0468485,
  0.04291126,
  0.03893348,
  0.03500061,
  0.03129479,
  0.02801497,
  0.02529874,
  0.02317672,
  0.02157076,
  0.02032812,
  0.01927296,
  0.01825497,
  0.01718075,
  0.01602238,
  0.01480609,
  0.01358909,
  0.01243398,
  0.01138853,
  0.01047505,
  9689704e-9,
  9009339e-9,
  8402056e-9,
  7837516e-9,
  7294292e-9,
  6762988e-9,
  6245322e-9,
  5750414e-9,
  5289936e-9,
  4873671e-9,
  4506567e-9,
  4187704e-9,
  3911031e-9,
  3667295e-9,
  3446447e-9,
  3239823e-9,
  3041614e-9,
  2849421e-9,
  2663919e-9,
  2487881e-9,
  2324884e-9,
  2178033e-9,
  2048966e-9,
  1937297e-9,
  1840532e-9,
  1754402e-9,
  1673479e-9,
  1591948e-9,
  1504375e-9,
  1406384e-9,
  1295158e-9,
  1169763e-9,
  1031276e-9,
  8827509e-10
];
var DOTS_RATIO = [
  0.9952884,
  0.9672306,
  0.9170193,
  0.850285,
  0.7739363,
  0.694932,
  0.6191682,
  0.5507195,
  0.4915604,
  0.4417689,
  0.4000868,
  0.3646416,
  0.3336207,
  0.3057338,
  0.2803878,
  0.2575925,
  0.237691,
  0.2210421,
  0.2077722,
  0.1976661,
  0.1902041,
  0.1847007,
  0.1804694,
  0.1769459,
  0.1737284,
  0.1705373,
  0.1671327,
  0.1632424,
  0.1585452,
  0.1527255,
  0.1455817,
  0.1371415,
  0.1277299,
  0.1179506,
  0.108571,
  0.1003396,
  0.09379056,
  0.0890983,
  0.0860325,
  0.0840293,
  0.08235838,
  0.08033344,
  0.07750143,
  0.07375432,
  0.06933427,
  0.06473829,
  0.06055861,
  0.057312,
  0.05530813,
  0.0545888,
  0.05494289,
  0.05597747,
  0.05721188,
  0.05816239,
  0.05839807,
  0.05756684,
  0.05540536,
  0.05175161,
  0.04657224,
  0.04000237,
  0.03237962,
  0.02424639,
  0.01629843,
  9274399e-9,
  3804679e-9,
  2587654e-10,
  -1359816e-9,
  -1429704e-9,
  -6217721e-10,
  2805922e-10,
  602841e-9,
  -2423161e-11,
  -1556616e-9,
  -3557131e-9,
  -5343377e-9,
  -6221975e-9
];
var LEVELS = [
  0.3420392,
  0.3414851,
  0.3409341,
  0.3403863,
  0.3398417,
  0.3393002,
  0.338762,
  0.338227,
  0.3376953,
  0.3371668,
  0.3366415,
  0.3361195,
  0.3356008,
  0.3350854,
  0.3345733,
  0.3340644,
  0.3335589,
  0.3330566,
  0.3325577,
  0.3320621,
  0.3315698,
  0.3310808,
  0.3305952,
  0.3301128,
  0.3296338,
  0.3291581,
  0.3286857,
  0.3282167,
  0.3277509,
  0.3272885,
  0.3268293,
  0.3263735,
  0.325921,
  0.3254718,
  0.3250258,
  0.3245831,
  0.3241438,
  0.3237076,
  0.3232748,
  0.3228451,
  0.3224188,
  0.3219956,
  0.3215757,
  0.321159,
  0.3207455,
  0.3203352,
  0.319928,
  0.319524,
  0.3191232,
  0.3187255,
  0.3183309,
  0.3179395,
  0.3175511,
  0.3171659,
  0.3167836,
  0.3164045,
  0.3160284,
  0.3156553,
  0.3152852,
  0.3149181,
  0.314554,
  0.3141928,
  0.3138346,
  0.3134793,
  0.3131269,
  0.3127773,
  0.3124307,
  0.3120869,
  0.3117459,
  0.3114078,
  0.3110724,
  0.3107398,
  0.31041,
  0.3100829,
  0.3097585,
  0.3094369,
  0.3091179,
  0.3088016,
  0.3084879,
  0.3081768,
  0.3078684,
  0.3075625,
  0.3072592,
  0.3069584,
  0.3066602,
  0.3063645,
  0.3060712,
  0.3057805,
  0.3054921,
  0.3052062,
  0.3049228,
  0.3046417,
  0.3043629,
  0.3040866,
  0.3038125,
  0.3035408,
  0.3032714,
  0.3030042,
  0.3027394,
  0.3024767,
  0.3022163,
  0.3019581,
  0.301702,
  0.3014482,
  0.3011964,
  0.3009469,
  0.3006994,
  0.300454,
  0.3002108,
  0.2999696,
  0.2997304,
  0.2994933,
  0.2992582,
  0.2990251,
  0.298794,
  0.2985648,
  0.2983376,
  0.2981124,
  0.2978891,
  0.2976677,
  0.2974482,
  0.2972306,
  0.2970148,
  0.2968009,
  0.2965889,
  0.2963787,
  0.2961703,
  0.2959637,
  0.2957589,
  0.2955559,
  0.2953547,
  0.2951552,
  0.2949575,
  0.2947615,
  0.2945673,
  0.2943748,
  0.294184,
  0.2939948,
  0.2938074,
  0.2936217,
  0.2934376,
  0.2932552,
  0.2930744,
  0.2928953,
  0.2927178,
  0.292542,
  0.2923678,
  0.2921951,
  0.2920242,
  0.2918548,
  0.291687,
  0.2915208,
  0.2913561,
  0.2911931,
  0.2910316,
  0.2908717,
  0.2907134,
  0.2905566,
  0.2904013,
  0.2902477,
  0.2900955,
  0.2899449,
  0.2897958,
  0.2896483,
  0.2895023,
  0.2893578,
  0.2892148,
  0.2890734,
  0.2889335,
  0.2887951,
  0.2886581,
  0.2885227,
  0.2883888,
  0.2882564,
  0.2881255,
  0.2879961,
  0.2878682,
  0.2877418,
  0.2876169,
  0.2874935,
  0.2873715,
  0.2872511,
  0.2871321,
  0.2870146,
  0.2868986,
  0.2867841,
  0.2866711,
  0.2865595,
  0.2864495,
  0.2863409,
  0.2862337,
  0.2861281,
  0.2860239,
  0.2859212,
  0.28582,
  0.2857202,
  0.285622,
  0.2855251,
  0.2854298,
  0.2853359,
  0.2852435,
  0.2851525,
  0.285063,
  0.284975,
  0.2848884,
  0.2848033,
  0.2847197,
  0.2846375,
  0.2845567,
  0.2844775,
  0.2843996,
  0.2843232,
  0.2842483,
  0.2841748,
  0.2841027,
  0.2840321,
  0.283963,
  0.2838952,
  0.2838289,
  0.283764,
  0.2837006,
  0.2836386,
  0.283578,
  0.2835188,
  0.283461,
  0.2834047,
  0.2833497,
  0.2832962,
  0.283244,
  0.2831933,
  0.2831439,
  0.2830959,
  0.2830493,
  0.2830041,
  0.2829603,
  0.2829178,
  0.2828767,
  0.2828369,
  0.2827985,
  0.2827614,
  0.2827257,
  0.2826913,
  0.2826582,
  0.2826265,
  0.2825961,
  0.2825669,
  0.2825391,
  0.2825125,
  0.2824873,
  0.2824633,
  0.2824406,
  0.2824191,
  0.2823989,
  0.28238,
  0.2823623,
  0.2823458,
  0.2823305,
  0.2823164,
  0.2823036,
  0.2822919,
  0.2822814,
  0.2822721,
  0.282264,
  0.282257,
  0.2822511,
  0.2822464,
  0.2822428,
  0.2822403,
  0.2822389,
  0.2822386,
  0.2822394,
  0.2822412,
  0.2822441,
  0.2822481,
  0.282253,
  0.282259,
  0.2822661,
  0.2822741,
  0.2822831,
  0.282293,
  0.282304,
  0.2823158,
  0.2823287,
  0.2823424,
  0.2823571,
  0.2823726,
  0.2823891,
  0.2824064,
  0.2824246,
  0.2824436,
  0.2824634,
  0.2824841,
  0.2825056,
  0.2825279,
  0.282551,
  0.2825748,
  0.2825994,
  0.2826247,
  0.2826508,
  0.2826775,
  0.282705,
  0.2827331,
  0.282762,
  0.2827914,
  0.2828216,
  0.2828523,
  0.2828837,
  0.2829157,
  0.2829483,
  0.2829814,
  0.2830151,
  0.2830494,
  0.2830842,
  0.2831195,
  0.2831553,
  0.2831916,
  0.2832284,
  0.2832656,
  0.2833034,
  0.2833415,
  0.2833801,
  0.283419,
  0.2834584,
  0.2834982,
  0.2835383,
  0.2835788,
  0.2836196,
  0.2836608,
  0.2837023,
  0.2837441,
  0.2837861,
  0.2838285,
  0.2838711,
  0.283914,
  0.2839571,
  0.2840004,
  0.284044,
  0.2840877,
  0.2841316,
  0.2841758,
  0.28422,
  0.2842645,
  0.284309,
  0.2843537,
  0.2843985,
  0.2844434,
  0.2844884,
  0.2845335,
  0.2845786,
  0.2846238,
  0.284669,
  0.2847143,
  0.2847596,
  0.2848049,
  0.2848501,
  0.2848954,
  0.2849407,
  0.2849859,
  0.285031,
  0.2850762,
  0.2851212,
  0.2851662,
  0.285211,
  0.2852558,
  0.2853004,
  0.285345,
  0.2853894,
  0.2854336,
  0.2854777,
  0.2855217,
  0.2855655,
  0.2856091,
  0.2856524,
  0.2856956,
  0.2857386,
  0.2857814,
  0.2858239,
  0.2858662,
  0.2859083,
  0.28595,
  0.2859915,
  0.2860328,
  0.2860737,
  0.2861144,
  0.2861547,
  0.2861948,
  0.2862345,
  0.2862738,
  0.2863129,
  0.2863516,
  0.2863899,
  0.2864279,
  0.2864654,
  0.2865026,
  0.2865394,
  0.2865758,
  0.2866118,
  0.2866474,
  0.2866826,
  0.2867173,
  0.2867515,
  0.2867853,
  0.2868187,
  0.2868516,
  0.286884,
  0.2869159,
  0.2869473,
  0.2869782,
  0.2870087,
  0.2870385,
  0.2870679,
  0.2870967,
  0.287125,
  0.2871528,
  0.2871799,
  0.2872065,
  0.2872326,
  0.287258,
  0.2872829,
  0.2873071,
  0.2873308,
  0.2873538,
  0.2873762,
  0.287398,
  0.2874191,
  0.2874396,
  0.2874594,
  0.2874786,
  0.2874971,
  0.2875149,
  0.287532,
  0.2875485,
  0.2875642,
  0.2875792,
  0.2875935,
  0.2876071,
  0.2876199,
  0.2876321,
  0.2876434,
  0.287654,
  0.2876638,
  0.2876729,
  0.2876812,
  0.2876887,
  0.2876954,
  0.2877013,
  0.2877064,
  0.2877107,
  0.2877142,
  0.2877168,
  0.2877186,
  0.2877195,
  0.2877197,
  0.2877189,
  0.2877173,
  0.2877148,
  0.2877115,
  0.2877072,
  0.2877021,
  0.2876961,
  0.2876892,
  0.2876814,
  0.2876727,
  0.287663,
  0.2876525,
  0.287641,
  0.2876286,
  0.2876152,
  0.2876009,
  0.2875857,
  0.2875695,
  0.2875524,
  0.2875343,
  0.2875152,
  0.2874952,
  0.2874742,
  0.2874523,
  0.2874293,
  0.2874054,
  0.2873805,
  0.2873547,
  0.2873278,
  0.2873,
  0.2872712,
  0.2872414,
  0.2872106,
  0.2871788,
  0.287146,
  0.2871123,
  0.2870776,
  0.2870418,
  0.2870051,
  0.2869674,
  0.2869287,
  0.2868891,
  0.2868484,
  0.2868068,
  0.2867642,
  0.2867207,
  0.2866762,
  0.2866307,
  0.2865842,
  0.2865369,
  0.2864885,
  0.2864392,
  0.286389,
  0.2863379,
  0.2862859,
  0.2862329,
  0.286179,
  0.2861243,
  0.2860686,
  0.2860121,
  0.2859547,
  0.2858964,
  0.2858374,
  0.2857774,
  0.2857167,
  0.2856551,
  0.2855927,
  0.2855296,
  0.2854657,
  0.285401,
  0.2853356,
  0.2852694,
  0.2852025,
  0.285135,
  0.2850667,
  0.2849978,
  0.2849283,
  0.2848581,
  0.2847874,
  0.284716,
  0.2846441,
  0.2845716,
  0.2844986,
  0.284425,
  0.284351,
  0.2842766,
  0.2842017,
  0.2841264,
  0.2840507,
  0.2839746,
  0.2838982,
  0.2838214,
  0.2837444,
  0.2836671,
  0.2835896,
  0.2835119,
  0.283434,
  0.2833559,
  0.2832777,
  0.2831994,
  0.2831211,
  0.2830427,
  0.2829643,
  0.282886,
  0.2828077,
  0.2827295,
  0.2826514,
  0.2825734,
  0.2824957,
  0.2824182,
  0.282341,
  0.282264,
  0.2821874,
  0.2821111,
  0.2820353,
  0.2819599,
  0.2818849,
  0.2818105,
  0.2817366,
  0.2816633,
  0.2815907,
  0.2815186,
  0.2814473,
  0.2813768,
  0.281307,
  0.281238,
  0.2811699,
  0.2811026,
  0.2810364,
  0.2809711,
  0.2809068,
  0.2808435,
  0.2807814,
  0.2807204,
  0.2806606,
  0.280602,
  0.2805446,
  0.2804886,
  0.2804339,
  0.2803806,
  0.2803287,
  0.2802783,
  0.2802294,
  0.280182,
  0.2801363,
  0.2800921,
  0.2800496,
  0.2800089,
  0.2799699,
  0.2799327,
  0.2798973,
  0.2798638,
  0.2798322,
  0.2798026,
  0.2797749,
  0.2797493,
  0.2797258,
  0.2797043,
  0.2796851,
  0.279668,
  0.2796531,
  0.2796405,
  0.2796302,
  0.2796222,
  0.2796166,
  0.2796134,
  0.2796126,
  0.2796143
];
var clamp01$2 = (u) => Math.max(0, Math.min(1, u));
var lerp = (a2, b, u) => a2 + (b - a2) * u;
var ease = (t, key, from, dur) => smoothstep((since(t, key) - from) / dur);
var ramp = (t, key, from, dur) => clamp01$2((since(t, key) - from) / dur);
var ring = (t, key, from, dur) => {
  const u = ramp(t, key, from, dur);
  return u <= 0 || u >= 1 ? 0 : Math.sin(Math.PI * u);
};
var bump = (u) => (1 - Math.cos(2 * Math.PI * clamp01$2(u))) / 2;
var S_RATES = [0.8, 30];
var RATES_VIEW = {
  ...TRACE_VIEW,
  rect: {
    left: 96,
    top: 78,
    right: 640,
    bottom: 612
  },
  x: "logs",
  y: "log",
  logs: S_RATES,
  log: [6e-4, 1.6]
};
var RATES_BELL_VIEW = {
  ...RATES_VIEW,
  log: [3e-5, 1.6]
};
var RATES_STRIP_VIEW = {
  ...RATES_VIEW,
  rect: {
    ...RATES_VIEW.rect,
    bottom: 452
  }
};
var STRIP = {
  left: 96,
  top: 520,
  right: 640,
  bottom: 642
};
var LINE_VIEW = {
  ...TRACE_VIEW,
  rect: {
    left: 124,
    top: 66,
    right: 740,
    bottom: 612
  },
  x: "s2",
  y: "log",
  s2: [0, 2500],
  log: [2e-4, 1.5]
};
var TRIAL_VIEW = {
  ...TRACE_VIEW,
  rect: { ...LINE_VIEW.rect },
  x: "s",
  y: "lin",
  s: [0, 40],
  lin: [-0.03, 1.08]
};
function domainOf(view) {
  if (view.x === "logs") return view.logs;
  if (view.x === "s2") return [Math.sqrt(view.s2[0]), Math.sqrt(view.s2[1])];
  return view.s;
}
function axisY(view) {
  return view.y === "lin" ? plotFrame(view).Y(0) : view.rect.bottom;
}
var MOVES = [
  {
    key: "rates",
    from: SAY,
    dur: 0.9,
    a: TRACE_VIEW,
    b: RATES_VIEW
  },
  {
    key: "densityJump",
    from: SAY,
    dur: 0.9,
    a: RATES_VIEW,
    b: RATES_STRIP_VIEW
  },
  {
    key: "multiply",
    from: SAY,
    dur: 0.8,
    a: RATES_STRIP_VIEW,
    b: RATES_VIEW
  },
  {
    key: "bell",
    from: SAY,
    dur: 0.6,
    a: RATES_VIEW,
    b: RATES_BELL_VIEW
  },
  {
    key: "logLine",
    from: 1.15,
    dur: 1.1,
    a: RATES_BELL_VIEW,
    b: LINE_VIEW
  },
  {
    key: "trialLow",
    from: SAY,
    dur: 0.85,
    a: LINE_VIEW,
    b: TRIAL_VIEW
  },
  {
    key: "sampleDots",
    from: SAY,
    dur: 0.8,
    a: TRIAL_VIEW,
    b: LINE_VIEW
  },
  {
    key: "window",
    from: SAY,
    dur: 0.55,
    a: LINE_VIEW,
    b: TRIAL_VIEW
  },
  {
    key: "summary",
    from: SAY,
    dur: 0.9,
    a: TRIAL_VIEW,
    b: LINE_VIEW
  }
];
var weight = (a2, b, k2, test) => lerp(test(a2) ? 1 : 0, test(b) ? 1 : 0, k2);
function camera(t) {
  let a2 = MOVES[0].a, b = MOVES[0].a, k2 = 0;
  for (const m of MOVES) {
    if (I[m.key] > sceneAt(t).step) break;
    const p = ease(t, m.key, m.from, m.dur);
    if (p >= 1) {
      a2 = m.b;
      b = m.b;
      k2 = 0;
      continue;
    }
    if (p > 0) {
      a2 = m.a;
      b = m.b;
      k2 = p;
    }
    break;
  }
  const da = domainOf(a2), db = domainOf(b);
  return {
    frame: between(a2, b, k2),
    a: a2,
    b,
    k: k2,
    dom: [lerp(da[0], db[0], k2), lerp(da[1], db[1], k2)],
    axisY: lerp(axisY(a2), axisY(b), k2),
    w: {
      s2: weight(a2, b, k2, (v) => v.x === "s2"),
      trial: weight(a2, b, k2, (v) => v.x === "s" && v !== TRACE_VIEW),
      rates: weight(a2, b, k2, (v) => v.x === "logs")
    }
  };
}
var seam = (t) => ease(t, "rates", SAY, 0.9);
var head = (t) => ease(t, "rates", 1.3, 1.05);
var headS = (h) => S_RATES[0] * Math.pow(S_RATES[1] / S_RATES[0], h);
var grow = (t) => ease(t, "rateSides", SAY, 0.6);
var strip = (t) => ease(t, "densityJump", SAY, 0.9) * (1 - ease(t, "multiply", SAY, 0.8));
var glow = (t) => ease(t, "densityJump", 1.3, 0.5) * (1 - ease(t, "multiply", SAY, 0.5));
var bellSigma = (t) => SIGMA * ease(t, "bell", 0.55, 1.15) * (1 - bump(ramp(t, "order", 0.72, 1.78)));
var bellIn = (t) => ease(t, "bell", SAY, 0.25);
var barIn = (t) => ease(t, "order", SAY, 0.3);
var rateFade = (t) => 1 - ease(t, "logLine", SAY, 0.5);
var merge = (t) => ease(t, "logLine", SAY, 0.8);
var term = {
  B: (s, sg) => B * bell(s, sg),
  sine: (s, sg) => Math.abs(J0) / s * bell(s, sg),
  cosine: (s, sg) => Math.abs(J1) / (s * s) * bell(s, sg),
  exactSine: (s, sg) => chosenFast(s).S * bell(s, sg),
  exactCosine: (s, sg) => (chosenFast(s).C - B) * bell(s, sg)
};
var SINE_DRAW_FROM = (() => {
  for (let s = EXACT_SINE_FROM; s < 20; s += 5e-3) if (chosenFast(s).S >= Math.abs(J0) / s / 3) return s;
  return EXACT_SINE_FROM;
})();
var geo = (a2, b, u) => a2 > 0 && b > 0 ? Math.exp(lerp(Math.log(a2), Math.log(b), u)) : lerp(a2, b, u);
var lineDraw = (t) => ease(t, "intercept", SAY, 0.6);
var interceptIn = (t) => ease(t, "intercept", 0.9, 0.35);
var walk = (t) => ease(t, "intercept", 1.2, 1.05);
var marker = (t) => ease(t, "intercept", 1.2, 0.15) * (1 - ease(t, "intercept", 2.25, 0.2));
var lineAlpha = (t) => lineDraw(t) * Math.max(1 - ease(t, "sampleDots", SAY, 0.6), ease(t, "window", 0.85, 0.25));
var RHO_LOW = 0.55;
var RHO_HIGH = 1.2;
var trialHead = (t) => ease(t, "trialLow", 1.3, 1.1);
var passU = (t) => ramp(t, "trueSigma", SAY, 2);
function passRho(u) {
  if (u <= 0) return RHO_LOW;
  if (u < 0.55) return lerp(RHO_LOW, RHO_HIGH, smoothstep(u / 0.55));
  return lerp(RHO_HIGH, 1, smoothstep((u - 0.55) / 0.45));
}
var atomU = (t) => ramp(t, "needsAtom", SAY, 1.3);
var atomScale = (t) => 1 - bump(atomU(t));
function trialValue(s, rho, a2 = 1) {
  return (chosenFast(s).C - (1 - a2) * B) / (1 - (1 - a2) * B) * Math.exp((rho * rho - 1) * SIGMA * SIGMA * s * s / 2);
}
var bLineValue = (s, q, a2 = 1) => a2 * B * Math.exp(-(1 - q) * SIGMA * SIGMA * s * s / 2);
function inkCurve(t, cam) {
  const { step } = sceneAt(t);
  const a2 = atomScale(t);
  if (step <= I.trialLow) return {
    rho: 0,
    alpha: 1,
    a: a2
  };
  if (step === I.trueSigma) return {
    rho: passRho(passU(t)),
    alpha: 1,
    a: a2
  };
  if (step <= I.credits) return {
    rho: 1,
    alpha: 1,
    a: a2
  };
  if (step === I.sampleDots) return {
    rho: Math.sqrt(cam.w.trial),
    alpha: 1,
    a: a2
  };
  if (step === I.noiseFloor) return {
    rho: 0,
    alpha: 1,
    a: a2
  };
  if (step === I.window) return {
    rho: Math.sqrt(cam.w.trial),
    alpha: 1 - ease(t, "window", SAY, 0.5),
    a: a2
  };
  return {
    rho: Math.sqrt(cam.w.trial),
    alpha: ease(t, "summary", SAY, 0.9),
    a: a2
  };
}
function ghosts(t) {
  const out = 1 - ease(t, "sampleDots", SAY, 0.5);
  const a2 = atomScale(t);
  const started = sceneAt(t).step >= I.trueSigma ? 1 : 0;
  const high = clamp01$2((passU(t) - 0.5) / 0.08);
  const noAtom = clamp01$2((atomU(t) - 0.42) / 0.08);
  return [
    {
      rho: RHO_LOW,
      a: a2,
      alpha: 0.3 * started * out
    },
    {
      rho: RHO_HIGH,
      a: a2,
      alpha: 0.3 * high * out
    },
    {
      rho: 1,
      a: 0,
      alpha: 0.3 * noAtom * out
    }
  ];
}
var dotsIn = (t) => ramp(t, "sampleDots", 1.2, 1.2);
var floorIn = (t) => ease(t, "noiseFloor", SAY, 0.45) * (1 - ease(t, "window", SAY, 0.4));
var floorMove = (t) => ease(t, "noiseFloor", 1, 1.45);
var DOTS_S2 = Array.from({ length: 72 }, (_, k2) => Math.sqrt(2500 * (k2 + 0.6) / 72));
var DOTS_S = Array.from({ length: 76 }, (_, k2) => 40 * (k2 + 0.6) / 76);
function sampleDots(N2, grid2) {
  if (grid2 === DOTS_S) return DOTS_RATIO;
  return N2 === 128e3 ? DOTS_LARGE : DOTS_SMALL;
}
var floorLevel = (u) => geo(noiseFloor(N_SAMPLE), noiseFloor(N_LARGE), u);
var floorS = (u) => lerp(floorCrossing(N_SAMPLE), floorCrossing(N_LARGE), u);
var WINDOW_KEYS = [
  9,
  2.5,
  18,
  8
];
var windowIn = (t) => ease(t, "window", 0.95, 0.15) * (1 - ease(t, "summary", SAY, 0.5));
var ratioDotsIn = (t) => ease(t, "window", 0.7, 0.3) * (1 - ease(t, "summary", SAY, 0.5));
function windowLow(t) {
  const u = ramp(t, "window", 1.08, 1.42) * (WINDOW_KEYS.length - 1);
  const i = Math.min(WINDOW_KEYS.length - 2, Math.floor(u));
  return lerp(WINDOW_KEYS[i], WINDOW_KEYS[i + 1], smoothstep(u - i));
}
var levelCache = new Map();
function windowLevelAt(sLo) {
  const key = Math.round(sLo * 40);
  if (key >= 100 && key <= 720) return LEVELS[key - 100];
  let v = levelCache.get(key);
  if (v === void 0) {
    v = windowLevel(resample(N_SAMPLE), key / 40, 22);
    levelCache.set(key, v);
  }
  return v;
}
var closeGlow = (t) => ring(t, "close", SAY, 0.8);
var PLOT_DURATIONS = {
  rates: 2.5,
  rateSides: 1.2,
  densityJump: 2,
  multiply: 1.3,
  bell: 1.8,
  order: 2.55,
  logLine: 2.4,
  intercept: 2.5,
  trialLow: 2.5,
  trueSigma: 2.5,
  needsAtom: 2.5,
  oneSigma: 1.2,
  credits: 0.3,
  sampleDots: 2.5,
  noiseFloor: 2.5,
  window: 2.55,
  summary: 1.5,
  close: 1.4
};
var FIRST = "rates";
var r$1 = String.raw;
var clamp01$1 = (u) => Math.max(0, Math.min(1, u));
var THICK = 4.5;
var CURVE = 3.5;
var THIN = 2.5;
function withAlpha(ctx, a2, draw2) {
  if (a2 <= 2e-3) return;
  const old = ctx.globalAlpha;
  ctx.globalAlpha = old * Math.min(1, a2);
  draw2();
  ctx.globalAlpha = old;
}
function stroke(ctx, pts, color, width, dash = []) {
  if (pts.length < 2) return;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  let pen = false;
  for (const [x2, y2] of pts) {
    if (!Number.isFinite(x2) || !Number.isFinite(y2)) {
      pen = false;
      continue;
    }
    if (pen) ctx.lineTo(x2, y2);
    else {
      ctx.moveTo(x2, y2);
      pen = true;
    }
  }
  ctx.stroke();
  ctx.setLineDash([]);
}
var gridMemo = new Map();
function grid(from, to, n = 220) {
  if (!(to > from)) return [];
  const key = `${from.toFixed(4)}:${to.toFixed(4)}:${n}`;
  const hit = gridMemo.get(key);
  if (hit) return hit;
  const out = [];
  const lo = Math.max(from, 1e-3);
  for (let i = 0; i <= n; i += 1) out.push(from + (to - from) * i / n);
  if (to > lo) for (let i = 0; i <= n; i += 1) out.push(lo * Math.pow(to / lo, i / n));
  out.sort((a2, b) => a2 - b);
  if (gridMemo.size > 400) gridMemo.clear();
  gridMemo.set(key, out);
  return out;
}
function curve(F, f, from, to, n) {
  return grid(from, to, n).map((s) => {
    const y2 = F.Y(f(s));
    return [F.X(s), Math.max(-2e3, Math.min(4e3, y2))];
  });
}
function dot(ctx, x2, y2, rad, color, paper, hollow = false) {
  ctx.beginPath();
  ctx.arc(x2, y2, rad, 0, Math.PI * 2);
  ctx.fillStyle = hollow ? paper : color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();
}
function clipTo(ctx, F, draw2) {
  const { left, top, right, bottom } = F.rect;
  ctx.save();
  ctx.beginPath();
  ctx.rect(left - 3, top - 8, right - left + 8, bottom - top + 11);
  ctx.clip();
  draw2();
  ctx.restore();
}
function glowing(ctx, color, amount, draw2) {
  if (amount <= 0.01) {
    draw2();
    return;
  }
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 18 * amount;
  draw2();
  ctx.restore();
}
function drawAxes(ctx, cam, color, alpha2) {
  const { rect } = cam.frame;
  withAlpha(ctx, alpha2, () => stroke(ctx, [[rect.left, rect.top], [rect.left, Math.max(cam.axisY, rect.top)]], color, 1.5));
  withAlpha(ctx, alpha2, () => stroke(ctx, [[rect.left, cam.axisY], [rect.right, cam.axisY]], color, 1.5));
}
function drawRates(ctx, t, cam, C2) {
  const F = cam.frame;
  const m = seam(t);
  const dim = lerp(TRACE_DIM, 1, m);
  const sg = bellSigma(t);
  const mg = merge(t);
  const rf = rateFade(t);
  const [lo, hi] = cam.dom;
  const w = lerp(3, THIN, m);
  withAlpha(ctx, dim * REFERENCE_ALPHA * (1 - m), () => {
    stroke(ctx, curve(F, (s) => recordedFast(s).C, 0, 30), C2.cosine, 3);
    stroke(ctx, curve(F, (s) => recordedFast(s).S, 0, 30), C2.sine, 3);
  });
  withAlpha(ctx, dim * (1 - m), () => stroke(ctx, curve(F, () => B, 0, 30, 4), C2.buncher, 2.2, [8, 6]));
  withAlpha(ctx, dim * (1 - m) ** 2, () => {
    stroke(ctx, curve(F, (s) => chosenFast(s).S, 0, SINE_DRAW_FROM), C2.sine, w);
    stroke(ctx, curve(F, (s) => chosenFast(s).C - m * B, 8, 30), C2.cosine, w);
  });
  if (m < 1) withAlpha(ctx, dim * Math.min(1, m / 0.3), () => stroke(ctx, curve(F, (s) => B + (1 - m) * (chosenFast(s).C - B), lo, 30), C2.cosine, w));
  withAlpha(ctx, bellIn(t) * rf, () => stroke(ctx, curve(F, (s) => bell(s, sg), lo, hi, 160), C2.guide, 3, [1, 8]));
  withAlpha(ctx, dim * rf * (1 - m) ** 2, () => stroke(ctx, curve(F, (s) => term.exactSine(s, sg), SINE_DRAW_FROM, Math.min(hi, 30)), C2.sine, w));
  withAlpha(ctx, dim * (1 - mg) * (1 - m) ** 2, () => stroke(ctx, curve(F, (s) => geo(term.exactCosine(s, sg) + (1 - m) * B * bell(s, sg), recordedFast(s, sg).C, mg), lo, 8), C2.cosine, w));
  const h = head(t);
  if (h > 0) {
    const sh = headS(h);
    glowing(ctx, C2.sine, glow(t), () => withAlpha(ctx, rf, () => stroke(ctx, curve(F, (s) => term.sine(s, sg), S_RATES[0], sh), C2.sine, THICK)));
    withAlpha(ctx, 1 - mg, () => stroke(ctx, curve(F, (s) => geo(term.cosine(s, sg), recordedFast(s, sg).C, mg), S_RATES[0], Math.min(sh, hi)), C2.cosine, THICK));
    if (h < 1) {
      dot(ctx, F.X(sh), F.Y(term.sine(sh, sg)), 5.5, C2.sine, C2.paper);
      dot(ctx, F.X(sh), F.Y(term.cosine(sh, sg)), 5.5, C2.cosine, C2.paper);
    }
  }
  withAlpha(ctx, m, () => stroke(ctx, curve(F, (s) => geo(term.B(s, sg), recordedFast(s, sg).C, mg), lo, hi), mg > 0 ? mixColor(C2.buncher, C2.cosine, mg) : C2.buncher, lerp(THICK, CURVE, mg)));
  withAlpha(ctx, barIn(t) * rf, () => {
    const x2 = F.X(10), y0 = F.Y(term.B(10, sg)), y1 = F.Y(term.cosine(10, sg));
    stroke(ctx, [[x2, y0], [x2, y1]], C2.ink, 3);
    dot(ctx, x2, y0, 5.5, C2.ink, C2.paper);
    dot(ctx, x2, y1, 5.5, C2.ink, C2.paper);
  });
}
function mixColor(a2, b, u) {
  const pa = parseHex(a2), pb = parseHex(b);
  if (!pa || !pb) return u < 0.5 ? a2 : b;
  const c = pa.map((v, i) => Math.round(lerp(v, pb[i], u)));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
function parseHex(c) {
  const m = /^#([0-9a-f]{6})$/i.exec(c.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [
    n >> 16 & 255,
    n >> 8 & 255,
    n & 255
  ];
}
var STRIP_X = (x2) => lerp(STRIP.left, STRIP.right, (x2 - (LOWER_EDGE - 0.04)) / (UPPER_EDGE + 0.04 - (LOWER_EDGE - 0.04)));
var STRIP_Y = (v, dy) => lerp(STRIP.bottom, STRIP.top, v / 1) + dy;
function drawStrip(ctx, t, C2) {
  const p = strip(t);
  if (p <= 2e-3) return;
  const dy = (1 - p) * 90;
  withAlpha(ctx, p, () => {
    stroke(ctx, [[STRIP.left, STRIP_Y(0, dy)], [STRIP.right, STRIP_Y(0, dy)]], C2.ink, 1.5);
    const below = grid(LOWER_EDGE, 0, 120).map((x2) => [STRIP_X(x2), STRIP_Y(h0(x2), dy)]);
    const above = grid(0, UPPER_EDGE, 120).map((x2) => [STRIP_X(x2), STRIP_Y(h1(x2), dy)]);
    stroke(ctx, below, C2.lower, CURVE);
    stroke(ctx, above, C2.upper, CURVE);
    stroke(ctx, [[STRIP_X(0), STRIP_Y(0, dy) - 7], [STRIP_X(0), STRIP_Y(0, dy) + 7]], C2.buncher, 3);
    glowing(ctx, C2.sine, 1.4 * glow(t), () => stroke(ctx, [[STRIP_X(0), STRIP_Y(h0(0), dy)], [STRIP_X(0), STRIP_Y(h1(0), dy)]], C2.sine, 6));
  });
}
function drawLine(ctx, t, cam, C2) {
  const F = cam.frame;
  const { step } = sceneAt(t);
  const [lo, hi] = cam.dom;
  const q = cam.w.trial;
  const ink = inkCurve(t, cam);
  const fl = floorIn(t), mv = floorMove(t);
  if (fl > 2e-3) withAlpha(ctx, fl, () => {
    const x2 = F.X(floorS(mv));
    ctx.fillStyle = C2.ink;
    ctx.globalAlpha *= 0.06;
    ctx.fillRect(F.rect.left, F.rect.top, x2 - F.rect.left, cam.axisY - F.rect.top);
  });
  const wi = windowIn(t);
  if (wi > 2e-3) {
    const sLo = windowLow(t);
    withAlpha(ctx, wi, () => {
      ctx.fillStyle = C2.ink;
      ctx.globalAlpha *= 0.07;
      ctx.fillRect(F.X(sLo), F.rect.top, F.X(22) - F.X(sLo), cam.axisY - F.rect.top);
    });
  }
  if (step >= I.trueSigma) for (const g of ghosts(t)) withAlpha(ctx, g.alpha, () => stroke(ctx, curve(F, (s) => trialValue(s, g.rho, g.a), lo, hi), C2.cosine, THIN));
  if (step === I.trialLow) {
    const th = trialHead(t);
    withAlpha(ctx, 1 - th, () => stroke(ctx, curve(F, (s) => trialValue(s, 0), lo, hi), C2.cosine, CURVE));
    if (th > 0) {
      const sh = lerp(0, 40, th);
      stroke(ctx, curve(F, (s) => trialValue(s, RHO_LOW), 0, sh), C2.cosine, CURVE);
      if (th < 1) dot(ctx, F.X(sh), F.Y(trialValue(sh, RHO_LOW)), 5.5, C2.cosine, C2.paper);
    }
  } else withAlpha(ctx, ink.alpha, () => stroke(ctx, curve(F, (s) => trialValue(s, ink.rho, ink.a), lo, hi), C2.cosine, CURVE));
  const la = lineAlpha(t);
  const a2 = ink.a;
  if (la > 2e-3) withAlpha(ctx, la, () => {
    stroke(ctx, curve(F, (s) => bLineValue(s, q, a2), lerp(hi, lo, lineDraw(t)), hi, 160), C2.buncher, 4, [14, 9]);
  });
  const mk = marker(t);
  if (mk > 2e-3) withAlpha(ctx, mk, () => {
    const u = walk(t), s = 2 + 45 * u * u;
    const x2 = F.X(s), yc = F.Y(trialValue(s, 0)), yl = F.Y(bLineValue(s, 0));
    stroke(ctx, [[x2, yc], [x2, yl]], C2.ink, 3);
    dot(ctx, x2, yc, 6, C2.ink, C2.paper);
  });
  const dotsOut = 1 - ease(t, "window", SAY, 0.4);
  const di = step >= I.sampleDots ? dotsIn(t) : 0;
  if (di > 0 && dotsOut > 2e-3) {
    const small = sampleDots(N_SAMPLE, DOTS_S2);
    const large = mv > 0 ? sampleDots(N_LARGE, DOTS_S2) : small;
    const n = DOTS_S2.length;
    const drawSet = (vals, alpha2) => withAlpha(ctx, alpha2 * dotsOut, () => {
      for (let k2 = 0; k2 < n; k2 += 1) {
        const ak = clamp01$1(di * n * 1.05 - k2);
        if (ak <= 0) break;
        const v = vals[k2];
        const y2 = F.Y(Math.abs(v));
        if (y2 > cam.axisY + 2 || y2 < F.rect.top - 2) continue;
        withAlpha(ctx, ak, () => dot(ctx, F.X(DOTS_S2[k2]), y2, 4.5, C2.ink, C2.paper, v < 0));
      }
    });
    drawSet(small, 1 - mv);
    if (mv > 0) drawSet(large, mv);
  }
  if (fl > 2e-3) withAlpha(ctx, fl, () => {
    const y0 = F.Y(floorLevel(0));
    withAlpha(ctx, lerp(1, 0.35, clamp01$1(mv * 4)), () => stroke(ctx, [[F.rect.left, y0], [F.rect.right, y0]], C2.muted, 3, [1, 8]));
    if (mv > 0) withAlpha(ctx, clamp01$1(mv * 4), () => {
      const y2 = F.Y(floorLevel(mv));
      stroke(ctx, [[F.rect.left, y2], [F.rect.right, y2]], C2.muted, 3, [1, 8]);
    });
    const x2 = F.X(floorS(mv));
    stroke(ctx, [[x2, F.rect.top], [x2, cam.axisY]], C2.ink, 2.5, [9, 7]);
  });
  const rd = ratioDotsIn(t);
  if (rd > 2e-3) {
    const vals = sampleDots(N_SAMPLE, DOTS_S);
    withAlpha(ctx, rd, () => {
      DOTS_S.forEach((s, k2) => {
        const v = vals[k2] / bell(s, SIGMA);
        const y2 = F.Y(v);
        if (y2 > F.rect.bottom + 2 || y2 < F.rect.top - 2) return;
        dot(ctx, F.X(s), y2, 4.5, C2.muted, C2.paper, v < 0);
      });
    });
  }
  if (wi > 2e-3) withAlpha(ctx, wi, () => {
    const sLo = windowLow(t), y2 = F.Y(windowLevelAt(sLo));
    stroke(ctx, [[F.X(sLo), y2], [F.X(22), y2]], C2.ink, THICK);
  });
}
function drawIntercept(ctx, t, cam, C2) {
  const dotA = lineAlpha(t) * interceptIn(t);
  const F = cam.frame, g = closeGlow(t);
  if (dotA > 2e-3) withAlpha(ctx, dotA, () => glowing(ctx, C2.buncher, g, () => dot(ctx, F.X(0), F.Y(inkCurve(t, cam).a * B), 7 + 3 * g, C2.buncher, C2.paper)));
}
function drawPlot(ctx, t, theme) {
  const { step } = sceneAt(t);
  if (step < I[FIRST]) return;
  const C2 = palette(theme);
  if (seam(t) <= 0) {
    drawTrace(ctx, plotFrame(TRACE_VIEW), SEAM_STATE, C2);
    return;
  }
  const cam = camera(t);
  const m = seam(t);
  if (m < 1) withAlpha(ctx, TRACE_DIM * (1 - m), () => drawTraceAxes(ctx, cam.frame, C2.ink));
  drawAxes(ctx, cam, C2.ink, m);
  clipTo(ctx, cam.frame, () => {
    if (step <= I.logLine) drawRates(ctx, t, cam, C2);
    if (step >= I.intercept) drawLine(ctx, t, cam, C2);
  });
  if (step >= I.intercept) drawIntercept(ctx, t, cam, C2);
  if (step >= I.densityJump && step <= I.multiply) drawStrip(ctx, t, C2);
}
var COLOR = {
  ink: C$2.ink,
  buncher: C$2.buncher,
  lower: C$2.lower,
  upper: C$2.upper,
  cosine: "var(--cosine)",
  sine: "var(--sine)",
  muted: "var(--ink-muted)"
};
function Label({ tex, x: x2, y: y2, anchor = "start", width = 200, color, pulse = 0, alpha: alpha2 }) {
  const s = 1 + 0.28 * pulse;
  const transform2 = pulse > 0 ? `translate(${x2} ${y2 - 9}) scale(${s}) translate(${-x2} ${-(y2 - 9)})` : void 0;
  return jsx("g", {
    className: "cdf-glyph-halo",
    opacity: Math.min(1, alpha2),
    style: color ? { color } : void 0,
    transform: transform2,
    children: jsx(SvgMathLabel, {
      tex,
      x: x2,
      y: y2,
      width,
      height: 48,
      anchor,
      className: `cdf-label${color ? " sp-coloured" : ""}`
    })
  });
}
function plotLabels(t) {
  const { step } = sceneAt(t);
  if (step < I[FIRST]) return [];
  const out = [];
  const add = (spec2) => {
    if (spec2.alpha > 0.01 && Number.isFinite(spec2.x) && Number.isFinite(spec2.y)) out.push(spec2);
  };
  const m = seam(t);
  const cam = camera(t);
  const F = cam.frame;
  const R = F.rect;
  const anchors = traceLabelAnchors(m > 0 ? F : plotFrame(TRACE_VIEW));
  const seamA = TRACE_DIM * (1 - smoothstep01(m / 0.6));
  add({
    key: "trC",
    tex: "C(s)",
    x: anchors.C.x - 8,
    y: anchors.C.y - 12,
    alpha: seamA,
    color: COLOR.cosine,
    anchor: "end",
    width: 90
  });
  add({
    key: "trS",
    tex: "S(s)",
    x: anchors.S.x - 8,
    y: anchors.S.y - 12,
    alpha: seamA,
    color: COLOR.sine,
    anchor: "end",
    width: 90
  });
  const traceF = plotFrame(TRACE_VIEW);
  add({
    key: "trs",
    tex: "s",
    x: traceF.X(TRACE_VIEW.s[1]) - 24,
    y: traceF.Y(0) + 36,
    alpha: TRACE_DIM * (1 - smoothstep01(m / 0.3)),
    anchor: "middle",
    width: 40
  });
  add({
    key: "trB",
    tex: "B",
    x: anchors.B.x,
    y: anchors.B.y + 9,
    alpha: seamA,
    color: COLOR.buncher,
    anchor: "end",
    width: 60
  });
  if (m <= 0) return out;
  const xSym = step >= I.rates ? m : 0;
  add({
    key: "xs",
    tex: "s",
    x: R.right,
    y: cam.axisY + 38,
    alpha: xSym * (1 - cam.w.s2),
    anchor: "end",
    width: 60
  });
  add({
    key: "xs2",
    tex: "s^2",
    x: R.right,
    y: cam.axisY + 38,
    alpha: cam.w.s2,
    anchor: "end",
    width: 60
  });
  if (step <= I.logLine) {
    const sg = bellSigma(t), g = grow(t), mg = merge(t), rf = rateFade(t);
    const end = S_RATES[1], xe = F.X(end) + 14;
    const rateA = (1 - mg) * cam.w.rates;
    add({
      key: "size",
      tex: r$1`\text{size of each term}`,
      x: R.left - 6,
      y: R.top - 26,
      alpha: m * rateA,
      width: 280
    });
    const yB = F.Y(term.B(end, sg)) + 9, yS = F.Y(term.sine(end, sg)) + 9, yC = F.Y(term.cosine(end, sg)) + 9;
    const endA = ease(t, "rates", 2.1, 0.3);
    add({
      key: "B",
      tex: "B",
      x: xe,
      y: yB,
      alpha: m * (1 - g) * rateA,
      color: COLOR.buncher,
      width: 60
    });
    const bent = bellIn(t);
    add({
      key: "Bl",
      tex: r$1`B,\ \text{flat, cosine}`,
      x: xe,
      y: yB,
      alpha: g * rateA * (1 - bent),
      color: COLOR.buncher,
      width: 230
    });
    add({
      key: "Blb",
      tex: r$1`B,\ \text{cosine}`,
      x: xe,
      y: yB,
      alpha: g * rateA * bent,
      color: COLOR.buncher,
      width: 230
    });
    add({
      key: "J0",
      tex: "|J_0|/s",
      x: xe,
      y: yS,
      alpha: endA * (1 - g) * rf * cam.w.rates,
      color: COLOR.sine,
      width: 110
    });
    add({
      key: "J0l",
      tex: r$1`|J_0|/s,\ \text{sine}`,
      x: xe,
      y: yS,
      alpha: g * rf * cam.w.rates,
      color: COLOR.sine,
      width: 200
    });
    add({
      key: "J1",
      tex: "|J_1|/s^2",
      x: xe,
      y: yC,
      alpha: endA * (1 - g) * rateA,
      color: COLOR.cosine,
      width: 110
    });
    add({
      key: "J1l",
      tex: r$1`|J_1|/s^2,\ \text{cosine}`,
      x: xe,
      y: yC,
      alpha: g * rateA,
      color: COLOR.cosine,
      width: 230
    });
    add({
      key: "bell",
      tex: r$1`\exp(-\sigma^2s^2/2)`,
      x: xe,
      y: F.Y(bell(end, sg)) + 9,
      alpha: bellIn(t) * rf * cam.w.rates,
      color: COLOR.muted,
      width: 230,
      pulse: 0
    });
    const p = strip(t);
    if (p > 0) {
      const dy = (1 - p) * 90;
      add({
        key: "h0",
        tex: r$1`\widetilde h_0`,
        x: STRIP_X(LOWER_EDGE + 0.42),
        y: STRIP_Y(h0(LOWER_EDGE + 0.42), dy) - 14,
        alpha: p,
        color: COLOR.lower,
        anchor: "end",
        width: 70
      });
      add({
        key: "h1",
        tex: r$1`\widetilde h_1`,
        x: STRIP_X(0.5),
        y: STRIP_Y(h1(0.5), dy) - 14,
        alpha: p,
        color: COLOR.upper,
        width: 70
      });
      add({
        key: "lzs",
        tex: r$1`\log z^\star`,
        x: STRIP_X(0),
        y: STRIP_Y(0, dy) + 40,
        alpha: p,
        color: COLOR.buncher,
        anchor: "middle",
        width: 120
      });
    }
  }
  if (step >= I.logLine) {
    const ink = inkCurve(t, cam);
    const q = cam.w.trial;
    const la = lineAlpha(t), ia = interceptIn(t);
    const sl = 17;
    const yv = step === I.logLine ? geo(term.B(sl, SIGMA), recordedFast(sl).C, merge(t)) : trialValue(sl, ink.rho, ink.a);
    add({
      key: "Cs",
      tex: "C(s)",
      x: F.X(sl) + 8,
      y: F.Y(yv) - 16,
      alpha: merge(t) * (1 - q) * ink.alpha,
      color: COLOR.cosine,
      width: 90
    });
    const yB = F.Y(ink.a * B) + 9;
    add({
      key: "logB",
      tex: r$1`\log B`,
      x: R.left - 14,
      y: yB,
      alpha: la * ia * (1 - q),
      color: COLOR.buncher,
      anchor: "end",
      width: 110,
      pulse: closeGlow(t)
    });
    add({
      key: "Btick",
      tex: "B",
      x: R.left - 14,
      y: yB,
      alpha: la * ia * q,
      color: COLOR.buncher,
      anchor: "end",
      width: 60
    });
    const ss = 30;
    add({
      key: "slope",
      tex: r$1`\text{slope }-\sigma^2/2`,
      x: F.X(ss),
      y: F.Y(bLineValue(ss, q)) + 48,
      alpha: la * ia * (1 - q),
      color: COLOR.buncher,
      anchor: "end",
      width: 240
    });
    const yLab = step <= I.sampleDots ? r$1`C(s)\exp(\sigma'^2s^2/2)` : r$1`C_N(s)\exp(\sigma^2s^2/2)`;
    add({
      key: `ylab${step <= I.sampleDots ? 1 : 2}`,
      tex: yLab,
      x: R.left - 6,
      y: R.top - 22,
      alpha: q * (step <= I.sampleDots ? 1 : ratioDotsIn(t)),
      width: 300,
      pulse: ring(t, "needsAtom", 1.85, 0.55)
    });
    const sEnd = 40;
    add({
      key: "low",
      tex: r$1`\sigma'<\sigma`,
      x: F.X(sEnd) + 12,
      y: F.Y(trialValue(sEnd, RHO_LOW)) + 9,
      alpha: ease(t, "trialLow", 2.15, 0.3) * (1 - ease(t, "trueSigma", SAY, 0.2)),
      color: COLOR.cosine,
      width: 110
    });
    add({
      key: "eq",
      tex: r$1`\sigma'=\sigma`,
      x: F.X(sEnd) + 12,
      y: F.Y(trialValue(sEnd, 1, ink.a)) + 9,
      alpha: ease(t, "trueSigma", 2.15, 0.3) * (1 - ease(t, "sampleDots", SAY, 0.4)),
      color: COLOR.cosine,
      width: 110,
      pulse: ring(t, "oneSigma", SAY, 0.6)
    });
    const dotsA = (step >= I.sampleDots ? dotsIn(t) : 0) * (1 - ease(t, "window", SAY, 0.4));
    add({
      key: "CN",
      tex: "|C_N(s)|",
      x: F.X(Math.sqrt(2050)),
      y: F.Y(0.11),
      alpha: clamp01$1(dotsA * 2 - 0.6),
      color: COLOR.ink,
      anchor: "middle",
      width: 130
    });
    const fl = floorIn(t), mv = floorMove(t);
    add({
      key: "floor",
      tex: r$1`\text{noise floor}`,
      x: R.right + 12,
      y: F.Y(floorLevel(0)) + 9,
      alpha: fl * lerp(1, 0.45, clamp01$1(mv * 4)),
      color: COLOR.muted,
      width: 132
    });
    add({
      key: "largeN",
      tex: r$1`\text{larger }N`,
      x: R.right + 12,
      y: F.Y(floorLevel(mv)) + 9,
      alpha: fl * clamp01$1(mv * 3 - 0.5),
      color: COLOR.muted,
      width: 132
    });
  }
  return out;
}
var smoothstep01 = (u) => {
  const x2 = clamp01$1(u);
  return x2 * x2 * (3 - 2 * x2);
};
function PlotOverlay({ t }) {
  const specs = plotLabels(t);
  if (!specs.length) return null;
  return jsx("g", {
    className: "sp-plot-overlay",
    children: specs.map((s) => createElement(Label, {
      ...s,
      key: s.key
    }))
  });
}
var VIEWBOX = VIEWBOX$1;
var clamp01 = (u) => Math.max(0, Math.min(1, u));
function durations() {
  const all = {
    ...WHEEL_DURATIONS,
    ...PLOT_DURATIONS
  };
  for (const p of PRESSES) if (!(p.key in all)) throw new Error(`04-spectral film: no duration for ${p.key}`);
  return all;
}
var built;
function timeline() {
  if (!built) {
    const d2 = durations();
    built = createTimeline(PRESSES.map((p) => ({
      key: p.key,
      duration: d2[p.key]
    })));
  }
  return built;
}
var TIMELINE = {
  get keys() {
    return timeline().keys;
  },
  get starts() {
    return timeline().starts;
  },
  get ends() {
    return timeline().ends;
  },
  get total() {
    return timeline().total;
  }
};
var I = STEP_INDEX;
function sceneAt(t) {
  const index = TIMELINE.ends.findIndex((end) => t <= end + 1e-8);
  const step = index < 0 ? PRESSES.length - 1 : index;
  const span = TIMELINE.ends[step] - TIMELINE.starts[step];
  return {
    step,
    key: PRESSES[step].key,
    progress: span > 0 ? clamp01((t - TIMELINE.starts[step]) / span) : 1
  };
}
var since = (t, key) => t - TIMELINE.starts[I[key]];
function show(t, key, seconds, lead = SAY) {
  return smoothstep((since(t, key) - lead) / seconds);
}
var smoothstep = (u) => {
  const x2 = clamp01(u);
  return x2 * x2 * (3 - 2 * x2);
};
function draw(ctx, t, _assets, theme) {
  ctx.clearRect(0, 0, VIEWBOX.width, VIEWBOX.height);
  ctx.fillStyle = theme.paper;
  ctx.fillRect(0, 0, VIEWBOX.width, VIEWBOX.height);
  drawWheel(ctx, t, theme);
  drawPlot(ctx, t, theme);
}
function Overlay({ t }) {
  return jsxs("g", { children: [jsx(WheelOverlay, { t }), jsx(PlotOverlay, { t })] });
}
var ARIA = {
  opening: "The settled pile of recorded incomes on a log axis: bunchers in red, the rest by the side of the kink they chose, with log z star marked.",
  euler: "The pile slides into a band along the bottom. A unit circle appears with a radius to a point at angle theta, its horizontal leg labeled cos theta and its vertical leg sin theta.",
  wrap: "Copies of the balls rise from the pile and land on the circle, each at an angle proportional to its distance from log z star; the colors stay in arcs.",
  average: "An arrow from the center to the average point; a magnified square shows its tip, with its horizontal coordinate C N of s and its vertical coordinate S N of s.",
  sweepWheel: "The frequency rises and comes back once: the points scatter around the circle while the red bunchers stay near angle zero longest; the tip's path stays as a faint line.",
  transform: "The recorded density times a cosine wave and times a sine wave in two panels; below, C of s and S of s traced as s rises, both dying out.",
  atom: "The density of chosen income: a red spike B at log z star between the lower and upper densities; on the circle the bunchers gather at angle zero.",
  settles: "As s sweeps once, C of s falls and flattens on a dashed red line at height B, and S of s dies to zero.",
  sides: "At one high frequency near log z star: under the sine wave the lobes on the two sides of the kink differ and leave a net area; under the cosine wave only the spike B leaves a mark.",
  rates: "The trace panel grows to fill the frame on log scales: the flat B line, a sine line falling like J zero over s and a cosine line falling like J one over s squared.",
  rateSides: "The three terms are labeled: B flat on the cosine side, J zero over s on the sine side, J one over s squared on the cosine side.",
  densityJump: "A strip under the plot shows the lower density ending at log z star at one height and the upper density starting at another; the step glows with the sine line.",
  multiply: "The density strip slides away and the rates plot stays: the flat B line, the sine line falling like J zero over s and the cosine line falling like J one over s squared.",
  bell: "A dotted bell enters flat at the top and bends down; every curve bends down with it.",
  order: "A short bar joins the B curve and the J one curve at one frequency; the noise shrinks and returns, every curve moves, and the bar keeps its length.",
  logLine: "The cosine side alone, its log against s squared: after a short drop near the origin the curve is straight.",
  intercept: "A dashed red line along the straight stretch meets the axis at log B; a marker walks along the curve and its gap to the line shrinks to nothing.",
  trialLow: "C of s times the undone bell at a trial scale below sigma sags to zero; the dashed red line is at height B.",
  trueSigma: "The trial scale passes up through sigma: below it the curve sags, above it the curve explodes, and at sigma it rests flat on the B line.",
  needsAtom: "With no atom, the B line drops to zero and every smaller trial scale ends at zero too; then it returns.",
  oneSigma: "C of s with the bell undone at the true sigma rests flat on the dashed red B line; the sigma label and the log z star tick ring in turn.",
  credits: "C of s with the bell undone at the true sigma, resting flat on the dashed red line at height B.",
  sampleDots: "The size of the cosine part against s squared on a log scale: the population curve and sample dots that follow it at low s and scatter around a level band at high s.",
  noiseFloor: "A dotted noise floor and a dashed line where the curve meets it; a much larger sample lowers the floor far and moves that line right only a little.",
  window: "Sample dots divided by the bell around the B line; a shaded window of frequencies with a fitted level whose lower end slides low, then high, then rests between.",
  summary: "The log cosine part against s squared, settled, with the red line and its intercept log B.",
  close: "The log cosine part against s squared, straight after a short drop, with its dashed red line meeting the axis at log B; the log B dot glows."
};
function describe(t) {
  return ARIA[sceneAt(t).key] ?? "The spectral bunching estimator.";
}
var spectralFilm = {
  viewBox: VIEWBOX,
  timeline: TIMELINE,
  load: () => Promise.resolve(true),
  draw,
  Overlay,
  ariaLabel: describe
};
function SpectralFigure({ step, entering }) {
  return jsx("div", {
    className: "sp-figure",
    children: jsx(FilmFigure, {
      film: spectralFilm,
      step,
      entering,
      className: "sp-chapter"
    })
  });
}
var r = String.raw;
var M = ({ tex }) => jsx(InlineMath, { tex });
var Eq = ({ tex }) => jsx("span", {
  className: "sp-more-eq",
  children: jsx(InlineMath, { tex: r`\displaystyle ${tex}` })
});
var SHORTS = [
  "Points on a circle",
  "The transform",
  "Rates and sides",
  "The bell",
  "B is an intercept",
  "Requirements",
  "Estimation",
  "In sum"
];
var TITLES = [
  "Is the bunching mass identified when nothing jumps?",
  "The average point is the characteristic function",
  "Each kind of roughness has a rate and a side",
  "Frictions multiply every term by one bell",
  "Against s², the log transform is a straight line",
  "What the argument needs",
  "Sampling noise caps the frequencies usable for estimation",
  "Where things stand"
];
var X = r`x=\tilde z-\log z^\star`;
var bodies = [
  jsxs(Fragment$1, { children: [
    "The balls are Chapter 4’s people, each with the same draw of the error, so the pile is Chapter 4’s pile. Every curve in this extension is computed from Chapter 4’s model: Chapter 3’s law, Chapter 1’s ",
    jsx(M, { tex: "e" }),
    " and taxes, and Chapter 4’s ",
    jsx(M, { tex: r`\sigma` }),
    "."
  ] }),
  jsxs(Fragment$1, { children: [
    "At ",
    jsx(M, { tex: "s=0" }),
    " every point sits at angle zero, so ",
    jsx(M, { tex: "C(0)=1" }),
    " and ",
    jsx(M, { tex: "S(0)=0" }),
    ". The limit in the last line is the Riemann–Lebesgue lemma: the transform of a part with a density fades as ",
    jsx(M, { tex: "s" }),
    " rises. It needs only that everyone else has a density; the atom has none, so its term stays at ",
    jsx(M, { tex: "B" }),
    "."
  ] }),
  jsxs(Fragment$1, { children: [
    jsx("strong", { children: "Why the jump lands on the sine side." }),
    " Near the kink write the density as an even part plus the odd step",
    " ",
    jsx(M, { tex: r`\tfrac{J_0}{2}\,\mathrm{sign}(x)` }),
    ", with ",
    jsx(M, { tex: X }),
    ". The cosine wave is even, so the step integrates to zero against it; the sine wave is odd, so the step’s lobes add on both sides. So the jump term is ",
    jsx(M, { tex: r`J_0/s` }),
    " in ",
    jsx(M, { tex: "S" }),
    " and absent from",
    " ",
    jsx(M, { tex: "C" }),
    " at order ",
    jsx(M, { tex: r`1/s` }),
    ".",
    jsx("br", {}),
    jsx("strong", { children: "The two rounds of integration by parts." }),
    " With ",
    jsx(M, { tex: X }),
    ", split the integral at ",
    jsx(M, { tex: r`\log z^\star` }),
    ". On each side",
    jsx(Eq, { tex: r`\int_{-\infty}^{\log z^\star}\exp(isx)\,\widetilde h_0\,d\tilde z=\frac{\widetilde h_0(\log z^\star)}{is}-\frac{1}{is}\int_{-\infty}^{\log z^\star}\exp(isx)\,\widetilde h_0'\,d\tilde z` }),
    jsx(Eq, { tex: r`\int_{\log z^\star}^{\infty}\exp(isx)\,\widetilde h_1\,d\tilde z=-\frac{\widetilde h_1(\log z^\star)}{is}-\frac{1}{is}\int_{\log z^\star}^{\infty}\exp(isx)\,\widetilde h_1'\,d\tilde z` }),
    "The outer boundary terms vanish because the densities go to zero far from the kink. Since ",
    jsx(M, { tex: r`1/i=-i` }),
    ", the boundary terms sum to",
    " ",
    jsx(M, { tex: r`iJ_0/s` }),
    ", and the remainder is ",
    jsx(M, { tex: r`\frac{i}{s}\int\exp(isx)\,\widetilde h'\,d\tilde z` }),
    ". Once more, with",
    " ",
    jsx(M, { tex: r`\widetilde h'` }),
    ":",
    jsx(Eq, { tex: r`\psi_{\tilde z}(s)=B+\frac{i}{s}J_0+\Big(\frac{i}{s}\Big)^2J_1+\Big(\frac{i}{s}\Big)^2\int_{\tilde z\neq\log z^\star}\exp(isx)\,\widetilde h''\,d\tilde z` }),
    jsx(Eq, { tex: r`=B+\frac{iJ_0}{s}-\frac{J_1}{s^2}+o(s^{-2})` }),
    "The last integral goes to zero (Riemann–Lebesgue again), so that remainder is ",
    jsx(M, { tex: r`o(s^{-2})` }),
    ". Since ",
    jsx(M, { tex: "J_0" }),
    " and",
    " ",
    jsx(M, { tex: "J_1" }),
    " are real, the real part is ",
    jsx(M, { tex: "C(s)" }),
    " and the imaginary part is ",
    jsx(M, { tex: "S(s)" }),
    ". The same tie gives",
    " ",
    jsx(M, { tex: r`J_1=\widetilde h_0'(\log z^\star+\Delta)-\widetilde h_0'(\log z^\star)` }),
    "; both jumps are zero only by coincidence.",
    jsx("br", {}),
    jsx("strong", { children: "Order notation." }),
    " ",
    jsx(M, { tex: r`O(s^{-p})` }),
    " is a bound: the term is at most a constant times ",
    jsx(M, { tex: r`s^{-p}` }),
    ".",
    " ",
    jsx(M, { tex: r`o(s^{-p})` }),
    " means that ",
    jsx(M, { tex: r`s^p` }),
    " times the term goes to zero.",
    jsx("br", {}),
    jsx("strong", { children: "Conditions." }),
    " The expansion needs ",
    jsx(M, { tex: r`\widetilde h` }),
    " and ",
    jsx(M, { tex: r`\widetilde h'` }),
    " continuous away from",
    " ",
    jsx(M, { tex: r`\log z^\star` }),
    " and going to zero at the ends of the support. Other roughness adds its own terms. A second atom, such as zero earnings, adds a term that never fades and swings between the two sides. A second kink with no atom of its own fades like",
    " ",
    jsx(M, { tex: r`1/s` }),
    ", on both sides. An edge where the density stops fades like ",
    jsx(M, { tex: r`1/s` }),
    ", slower than the ",
    jsx(M, { tex: "J_1" }),
    " term, so it still spoils the cosine side.",
    jsx("br", {}),
    "The lines in the figure are the leading terms themselves. Other roughness in the distribution, such as the edge of its support, adds faster-fading or oscillating terms of its own, so the exact transform swings around these lines and is not drawn."
  ] }),
  jsxs(Fragment$1, { children: [
    "The product step holds for any error law ",
    jsx(M, { tex: "Q" }),
    ": the factor is ",
    jsx(M, { tex: r`\mathbb E\exp(is\nu)=\int\exp(isv)\,dQ(v)` }),
    ". It is real exactly when ",
    jsx(M, { tex: "Q" }),
    " is symmetric about zero; otherwise it mixes the cosine and sine sides. The bell is the log-normal case,",
    " ",
    jsx(M, { tex: r`Q(v)=\Phi(v/\sigma)` }),
    ". The ratio of the ",
    jsx(M, { tex: "B" }),
    " term to the ",
    jsx(M, { tex: "J_1" }),
    " term is ",
    jsx(M, { tex: r`Bs^2/|J_1|` }),
    ", free of",
    " ",
    jsx(M, { tex: r`\sigma` }),
    "."
  ] }),
  jsxs(Fragment$1, { children: [
    "The log needs ",
    jsx(M, { tex: r`C(s)>0` }),
    ", which holds once ",
    jsx(M, { tex: "s" }),
    " is large enough, since the bracket tends to ",
    jsx(M, { tex: r`B>0` }),
    "; the curve is drawn only where ",
    jsx(M, { tex: "C(s)" }),
    " is positive. The trial-scale argument needs only the limit ",
    jsx(M, { tex: r`\psi_{\tilde z}(s)\to B` }),
    "; the expansion gives its speed. The link to Chapter 4: ",
    jsx(M, { tex: r`\sigma'<\sigma` }),
    " leaves no jump (the ratio falls to zero), and",
    " ",
    jsx(M, { tex: r`\sigma'>\sigma` }),
    " asks for a transform larger than one (the ratio explodes). A characteristic function never exceeds one in size, so an exploding ratio is no transform of any CDF of chosen income. That is Chapter 4’s “no CDF of chosen income could have produced the data”."
  ] }),
  jsxs(Fragment$1, { children: [
    jsx("strong", { children: "A two-sided exponential error." }),
    " With scale ",
    jsx(M, { tex: "b" }),
    " and any trial scale ",
    jsx(M, { tex: r`b'<b` }),
    ",",
    jsx(Eq, { tex: r`\frac{1+b'^2s^2}{1+b^2s^2}=\frac{b'^2}{b^2}+\Big(1-\frac{b'^2}{b^2}\Big)\frac{1}{1+b^2s^2},` }),
    "the transform of an atom of weight ",
    jsx(M, { tex: r`b'^2/b^2` }),
    " plus two-sided exponential noise of scale ",
    jsx(M, { tex: "b" }),
    ". So data from",
    " ",
    jsx(M, { tex: r`(B,b)` }),
    " are also produced by chosen incomes with a smaller atom, ",
    jsx(M, { tex: r`Bb'^2/b^2` }),
    ", under noise of scale",
    " ",
    jsx(M, { tex: r`b'` }),
    ": ",
    jsx(M, { tex: "B" }),
    " is not identified.",
    jsx("br", {}),
    jsxs("strong", { children: [
      "One ",
      jsx(M, { tex: r`\sigma` }),
      " for everyone."
    ] }),
    " With independent noise groups of shares ",
    jsx(M, { tex: r`\pi_k` }),
    ",",
    " ",
    jsx(M, { tex: r`C(s)\approx B\sum_k\pi_k\exp(-\sigma_k^2s^2/2)` }),
    ". At high ",
    jsx(M, { tex: "s" }),
    " the least noisy group dominates, so the fit returns its",
    " ",
    jsx(M, { tex: r`\sigma` }),
    " and ",
    jsx(M, { tex: "B" }),
    " times its share, which is smaller than ",
    jsx(M, { tex: "B" }),
    ". This holds if group membership is independent of bunching.",
    jsxs("span", {
      className: "sp-references",
      children: [jsx("span", { children: "Cattaneo, M. D., M. Jansson, X. Ma and J. Slemrod (2018). “Bunching Designs: Estimation and Inference.” Working paper." }), jsxs("span", { children: [
        "Trong, D. D., N. H. Thanh, N. D. Minh and N. N. Lan (2021). “Density estimation of a mixture distribution with unknown point-mass and normal error.” ",
        jsx("em", { children: "Journal of Statistical Planning and Inference" }),
        " 215, 268–288."
      ] })]
    })
  ] }),
  jsxs(Fragment$1, { children: [
    "For records drawn independently, ",
    jsx(M, { tex: r`\operatorname{Var}C_N(s)=\big(\mathbb E\cos^2 s(\tilde y-\log z^\star)-C(s)^2\big)/N` }),
    ", and",
    " ",
    jsx(M, { tex: r`\cos^2a=(1+\cos 2a)/2` }),
    " gives the line shown; ",
    jsx(M, { tex: "C(s)" }),
    " goes to zero when ",
    jsx(M, { tex: r`\sigma>0` }),
    ". The floor is",
    " ",
    jsx(M, { tex: r`2/\sqrt N` }),
    ". The bell has fallen to ",
    jsx(M, { tex: r`\exp(-1)` }),
    " at ",
    jsx(M, { tex: r`s^\star=\sqrt2/\sigma` }),
    ". The figure divides by the bell at the true ",
    jsx(M, { tex: r`\sigma` }),
    "; in practice ",
    jsx(M, { tex: r`\sigma` }),
    " comes from the slope, and errors in it are amplified by",
    " ",
    jsx(M, { tex: r`\exp(\sigma^2s^2/2)` }),
    ". The fitted level is ",
    jsx(M, { tex: r`\hat B` }),
    ". My paper gives a data-driven rule for the window: a pilot fit, then the window that minimizes squared bias plus variance."
  ] }),
  jsxs(Fragment$1, { children: [
    "The three lines are the atom’s limit, the bell on the cosine side and the line against ",
    jsx(M, { tex: "s^2" }),
    ". The conditions are those listed in “What the argument needs”: an atom, an error family fixed in advance, one ",
    jsx(M, { tex: r`\sigma` }),
    " for everyone, and no other atoms or jumps near the kink."
  ] })
];
var derivations = [
  circle,
  transform,
  rates,
  bell$1,
  interceptChain.spec,
  void 0,
  estimateChain.spec,
  summary
];
var STAGES = TITLES.map((title2, i) => ({
  eyebrow: SHORTS[i],
  short: SHORTS[i],
  title: title2,
  body: bodies[i],
  prompt: "",
  figureTitle: SHORTS[i],
  derivation: derivations[i]
}));
var BACK_HREF = `/04-random-frictions?step=${STEP_INDEX$1.spectral}`;
function BackLink() {
  return jsx("span", {
    className: "sp-link-row",
    children: jsx(Link, {
      className: "sp-back-link",
      href: BACK_HREF,
      children: "← Back to Chapter 4"
    })
  });
}
var title = (text) => text.includes("$") ? prose(text) : text;
var spectralChapter = {
  id: 4,
  slug: "04-spectral",
  part: "II",
  title: "Accounting for Frictions",
  label: "Accounting for Frictions",
  steps: PRESSES.map((p) => ({
    key: p.key,
    stage: p.stage,
    title: title(p.title),
    narration: p.key === "close" ? prose(p.text, jsx(BackLink, {}, "back")) : prose(p.text),
    ..."derivationAt" in p ? { derivationAt: p.derivationAt } : {}
  })),
  stages: STAGES,
  Figure: SpectralFigure,
  viewBox: {
    width: VIEWBOX.width,
    height: VIEWBOX.height
  },
  initialParameters: CH1_DEFAULTS,
  defaults: CH1_DEFAULTS
};
export {
  nonidentificationChapter as a,
  sufficientStatisticChapter as i,
  randomFrictionsChapter as n,
  STEP_INDEX$1 as r,
  spectralChapter as t
};
