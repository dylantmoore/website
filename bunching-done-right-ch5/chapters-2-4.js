import { Z as InlineMath } from "./core.js";
import { t as CH1_DEFAULTS } from "./chapter-1.js";
import { Fragment } from "https://cdn.jsdelivr.net/npm/react@19.2.6/+esm";
import { Fragment as Fragment$1, jsx, jsxs } from "https://cdn.jsdelivr.net/npm/react@19.2.6/jsx-runtime/+esm";
var STEP_INDEX = Object.fromEntries([
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
    text: "One more route to $B$ is my spectral bunching estimator, which works with the frequencies of the data rather than its histogram. I will be presenting it at the NTA: “An Application of Euler's Formula to Bunching Methodology: Addressing Frictions via Spectral Deconvolution”, in the session “Frontiers in Measurement with Tax Microdata”, Friday, November 13, 8:30–10:00 am, Butler West (Floor 2, The Westin Pittsburgh)."
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
].map((p, i) => [p.key, i]));
var BETA_LAW = {
  lo: 31,
  hi: 291,
  a: 2,
  b: 3
};
function betaLaw(parameters, law = BETA_LAW) {
  const { t0: t02, t1: t12, zStar: k, e: e2 } = parameters;
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
  const H0 = (z) => F(z / s0);
  const H1 = (z) => F(z / s1);
  const density0 = (z) => f(z / s0) / s0;
  const density1 = (z) => f(z / s1) / s1;
  const quantile = (branch, p) => Finv(p) * (branch === 0 ? s0 : s1);
  const below = H0(k);
  const top = H1(k);
  return {
    q0,
    q1,
    s0,
    s1,
    k,
    e: e2,
    lo,
    hi,
    F,
    f,
    Finv,
    H0,
    H1,
    density0,
    density1,
    quantile,
    below,
    top,
    B: top - below,
    ranks: (n) => Array.from({ length: n }, (_, i) => Finv((i + 0.5) / n))
  };
}
var { t0, t1, e, zStar } = CH1_DEFAULTS;
var LAW = betaLaw(CH1_DEFAULTS, BETA_LAW);
var BELOW = LAW.below;
LAW.top - BELOW;
e * (Math.log(1 - t0) - Math.log(1 - t1));
var SIGMA_THREE = 0.075;
SIGMA_THREE * Math.sqrt(5 / 3);
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
    const r = Math.sqrt(-2 * Math.log(u));
    out.push(r * Math.cos(2 * Math.PI * v));
    if (out.length < count) out.push(r * Math.sin(2 * Math.PI * v));
  }
  return out;
}
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
export {
  STEP_INDEX as i,
  SIGMA as n,
  normalDraws as r,
  prose as t
};
