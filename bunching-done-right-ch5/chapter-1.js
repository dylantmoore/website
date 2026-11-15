import { N as DEFAULTS } from "./core.js";
var CH1_DEFAULTS = {
  ...DEFAULTS,
  t0: 0.2,
  t1: 0.65,
  zStar: 100,
  e: 0.4,
  w: 130
};
var RATES = {
  t0: 0.2,
  t1: 0.65,
  zStar: 100
};
var W_RANGE = [20, 280];
var COUNT = 2e3;
var EXEMPLARS = [
  70,
  130,
  220
];
var BIN_ORIGIN = -2.5;
Math.floor((RATES.zStar - BIN_ORIGIN) / 5);
var INTERVAL = 3;
function choice(w, e) {
  const lo = w * (1 - RATES.t0) ** e;
  const hi = w * (1 - RATES.t1) ** e;
  const region = lo < RATES.zStar ? "lower" : hi > RATES.zStar ? "upper" : "buncher";
  const z = region === "lower" ? lo : region === "upper" ? hi : RATES.zStar;
  return {
    w,
    z,
    mc: (z / w) ** (1 / e),
    region
  };
}
var populations = new Map();
function population(e, count = COUNT) {
  const key = `${e}:${count}`;
  const cached = populations.get(key);
  if (cached) return cached;
  const span = W_RANGE[1] - W_RANGE[0];
  const ws = Array.from({ length: count - 3 }, (_, i) => W_RANGE[0] + (i + 0.5) * span / (count - 3));
  let seed = 92841;
  for (let i = ws.length - 1; i > 0; i -= 1) {
    seed = Math.imul(1664525, seed) + 1013904223 >>> 0;
    const j = seed % (i + 1);
    [ws[i], ws[j]] = [ws[j], ws[i]];
  }
  const people = [...EXEMPLARS, ...ws].map((w, i) => {
    const c = choice(w, e);
    const bin = Math.min(48, Math.floor((c.z - BIN_ORIGIN) / 5));
    return Object.freeze({
      ...c,
      bin,
      birth: 0.6 + i * INTERVAL
    });
  });
  populations.set(key, people);
  return people;
}
Object.freeze({
  floor: 879,
  radius: 2,
  binWidth: 20,
  drawScale: 1.1
});
var occupied = population(0.4).map((p) => p.bin);
var FIRST_BIN = Math.min(...occupied);
(Math.max(...occupied) - FIRST_BIN + 1) * 110 + 500;
export {
  CH1_DEFAULTS as t
};
