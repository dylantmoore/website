import { createContext, isValidElement, useContext, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "https://cdn.jsdelivr.net/npm/react@19.2.6/+esm";
import katex from "https://cdn.jsdelivr.net/npm/katex@0.18.1/+esm";
import { jsx, jsxs } from "https://cdn.jsdelivr.net/npm/react@19.2.6/jsx-runtime/+esm";
var latexCache = new Map();
function latexMarkup(tex, displayMode = false) {
  const key = `${displayMode ? "display" : "inline"}:${tex}`;
  const cached = latexCache.get(key);
  if (cached) return cached;
  const markup = katex.renderToString(tex, {
    displayMode,
    output: "htmlAndMathml",
    throwOnError: true,
    trust: false,
    strict: "ignore"
  });
  latexCache.set(key, markup);
  return markup;
}
function InlineMath({ tex, className = "" }) {
  return jsx("span", {
    className: `inline-latex ${className}`.trim(),
    "data-tex": tex,
    dangerouslySetInnerHTML: { __html: latexMarkup(tex) }
  });
}
function BlockMath({ tex }) {
  return jsx("div", {
    className: "block-latex",
    "data-tex": tex,
    dangerouslySetInnerHTML: { __html: latexMarkup(tex, true) }
  });
}
function SvgMathLabel({ tex, x, y, width = 240, height = 40, anchor = "start", className = "" }) {
  return jsx("foreignObject", {
    x: anchor === "middle" ? x - width / 2 : anchor === "end" ? x - width : x,
    y: y - height * 0.73,
    width,
    height,
    className: `svg-math-label ${className}`.trim(),
    "aria-hidden": "true",
    children: jsx("div", {
      className: `svg-math-inner align-${anchor}`,
      children: jsx(InlineMath, { tex })
    })
  });
}
function stub(slug) {
  return {
    slug,
    id: 0,
    title: "",
    steps: [],
    stages: []
  };
}
var incomeEffectsChapter = stub("01-income-effects");
var menusNotNoiseChapter = stub("05-menus-not-noise");
var notchesFrictionlessChapter = stub("06-notches-frictionless");
var notchExtensionsChapter = stub("07-notch-extensions");
var notchesFrictionsChapter = stub("08-notches-frictions");
var taggingKinksChapter = stub("09-tagging-kinks");
var taggingNotchesChapter = stub("10-tagging-notches");
var capsChapter = stub("11-caps");
var dentsIroningChapter = stub("12-dents-ironing");
var COLORS = {
  paper: "var(--paper)",
  ink: "var(--ink)",
  muted: "var(--ink-muted)",
  guide: "var(--guide)",
  peach: "var(--peach)",
  sand: "var(--sand)",
  lower: "var(--lower)",
  lowerSoft: "var(--lower-soft)",
  buncher: "var(--buncher)",
  buncherSoft: "var(--buncher-soft)",
  upper: "var(--upper)",
  upperSoft: "var(--upper-soft)"
};
var DEFAULTS = {
  t0: 0.2,
  t1: 0.65,
  zStar: 100,
  e: 0.7,
  w: 160
};
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function choiceFor(w, parameters) {
  const { t0, t1, zStar, e } = parameters;
  const z0 = w * Math.pow(1 - t0, e);
  const z1 = w * Math.pow(1 - t1, e);
  if (z0 <= zStar) return {
    region: "lower",
    z: z0,
    mc: 1 - t0,
    z0,
    z1
  };
  if (z1 >= zStar) return {
    region: "upper",
    z: z1,
    mc: 1 - t1,
    z0,
    z1
  };
  return {
    region: "buncher",
    z: zStar,
    mc: Math.pow(zStar / w, 1 / e),
    z0,
    z1
  };
}
function deriveModel(parameters) {
  const lowerBoundary = parameters.zStar / Math.pow(1 - parameters.t0, parameters.e);
  const upperBoundary = parameters.zStar / Math.pow(1 - parameters.t1, parameters.e);
  const wMin = 22;
  const wMax = 295;
  return {
    lowerBoundary,
    upperBoundary,
    wMin,
    wMax,
    xMax: 240,
    displayTypeGrid: Array.from({ length: 79 }, (_, index) => wMin + (wMax - wMin) * index / 78)
  };
}
function regionColor(region, soft = false) {
  if (region === "lower") return soft ? COLORS.lowerSoft : COLORS.lower;
  if (region === "upper") return soft ? COLORS.upperSoft : COLORS.upper;
  return soft ? COLORS.buncherSoft : COLORS.buncher;
}
var SPACING = new Set([
  "\\quad",
  "\\qquad",
  "\\,",
  "\\;",
  "\\:",
  "\\!",
  "\\ ",
  "~",
  "\\enspace",
  "\\thinspace",
  "\\medspace",
  "\\thickspace",
  "\\displaystyle",
  "\\textstyle",
  "&",
  "\\\\"
]);
var REL = new Set([
  "=",
  "<",
  ">",
  ":",
  "\\le",
  "\\leq",
  "\\ge",
  "\\geq",
  "\\ne",
  "\\neq",
  "\\equiv",
  "\\approx",
  "\\sim",
  "\\simeq",
  "\\propto",
  "\\to",
  "\\rightarrow",
  "\\Rightarrow",
  "\\Longrightarrow",
  "\\implies",
  "\\iff",
  "\\Leftrightarrow",
  "\\Longleftrightarrow",
  "\\mapsto",
  "\\in",
  "\\subset",
  "\\subseteq",
  "\\coloneqq",
  "\\gets",
  "\\leftarrow",
  "\\Leftarrow"
]);
var BIN = new Set([
  "+",
  "-",
  "*",
  "\\pm",
  "\\mp",
  "\\times",
  "\\cdot",
  "\\div",
  "\\circ",
  "\\cup",
  "\\cap",
  "\\setminus"
]);
var PUNCT = new Set([
  ",",
  ";",
  "\\colon"
]);
var OPEN = new Set([
  "(",
  "[",
  "\\{",
  "\\langle",
  "\\lbrack",
  "\\lbrace",
  "\\lvert",
  "\\lVert"
]);
var CLOSE = new Set([
  ")",
  "]",
  "\\}",
  "\\rangle",
  "\\rbrack",
  "\\rbrace",
  "\\rvert",
  "\\rVert"
]);
var ARGC = {
  "\\frac": 2,
  "\\dfrac": 2,
  "\\tfrac": 2,
  "\\cfrac": 2,
  "\\binom": 2,
  "\\dbinom": 2,
  "\\tbinom": 2,
  "\\overset": 2,
  "\\underset": 2,
  "\\stackrel": 2,
  "\\sqrt": 1,
  "\\mathrm": 1,
  "\\mathit": 1,
  "\\mathbf": 1,
  "\\mathsf": 1,
  "\\mathtt": 1,
  "\\mathcal": 1,
  "\\mathbb": 1,
  "\\mathfrak": 1,
  "\\boldsymbol": 1,
  "\\bm": 1,
  "\\text": 1,
  "\\textrm": 1,
  "\\textit": 1,
  "\\textbf": 1,
  "\\operatorname": 1,
  "\\boxed": 1,
  "\\overline": 1,
  "\\underline": 1,
  "\\hat": 1,
  "\\widehat": 1,
  "\\tilde": 1,
  "\\widetilde": 1,
  "\\bar": 1,
  "\\vec": 1,
  "\\dot": 1,
  "\\ddot": 1,
  "\\underbrace": 1,
  "\\overbrace": 1,
  "\\mathord": 1,
  "\\mathrel": 1,
  "\\mathbin": 1,
  "\\mathop": 1,
  "\\mathopen": 1,
  "\\mathclose": 1,
  "\\mathpunct": 1,
  "\\mathinner": 1,
  "\\phantom": 1,
  "\\hphantom": 1,
  "\\vphantom": 1,
  "\\color": 1,
  "\\textcolor": 2,
  "\\htmlData": 2,
  "\\cancel": 1,
  "\\bcancel": 1,
  "\\xcancel": 1
};
function skipSpace(s, i) {
  while (i < s.length && /\s/.test(s[i])) i += 1;
  return i;
}
function readGroup(s, i) {
  if (s[i] !== "{") throw new Error(`derivation tex: expected "{" at ${i} in ${JSON.stringify(s)}`);
  let depth = 0;
  for (let j = i; j < s.length; j += 1) {
    const ch = s[j];
    if (ch === "\\") {
      j += 1;
      continue;
    }
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return [s.slice(i + 1, j), j + 1];
    }
  }
  throw new Error(`derivation tex: unbalanced braces in ${JSON.stringify(s)}`);
}
function readOptional(s, i) {
  const k = skipSpace(s, i);
  if (s[k] !== "[") return ["", i];
  let depth = 0;
  for (let j = k; j < s.length; j += 1) if (s[j] === "{") depth += 1;
  else if (s[j] === "}") depth -= 1;
  else if (s[j] === "]" && depth === 0) return [s.slice(k, j + 1), j + 1];
  throw new Error(`derivation tex: unbalanced [ in ${JSON.stringify(s)}`);
}
function readControl(s, i) {
  let j = i + 1;
  if (/[A-Za-z]/.test(s[j] ?? "")) {
    while (j < s.length && /[A-Za-z]/.test(s[j])) j += 1;
    return [s.slice(i, j), j];
  }
  return [s.slice(i, j + 1), j + 1];
}
function readToken(s, i) {
  const k = skipSpace(s, i);
  if (s[k] === "{") {
    const [, end] = readGroup(s, k);
    return [s.slice(k, end), end];
  }
  if (s[k] === "\\") return readControl(s, k);
  if (k >= s.length) throw new Error(`derivation tex: missing argument in ${JSON.stringify(s)}`);
  return [s[k], k + 1];
}
function readDelimiter(s, i) {
  const k = skipSpace(s, i);
  if (s[k] === "\\") return readControl(s, k);
  return [s[k], k + 1];
}
function readScripts(s, i) {
  let out = "";
  let j = i;
  for (; ; ) {
    const k = skipSpace(s, j);
    const ch = s[k];
    if (ch === "^" || ch === "_") {
      const [tok2, end] = readToken(s, k + 1);
      out += `${ch}${tok2}`;
      j = end;
    } else if (ch === "'") {
      out += "'";
      j = k + 1;
    } else return [out, j];
  }
}
function readLeftRight(s, i) {
  const [open, afterOpen] = readDelimiter(s, i + 5);
  let depth = 1;
  let j = afterOpen;
  while (j < s.length) if (s[j] === "\\") {
    const [cmd, end] = readControl(s, j);
    if (cmd === "\\left") depth += 1;
    if (cmd === "\\right") {
      depth -= 1;
      if (depth === 0) {
        const body = s.slice(afterOpen, j);
        const [close, afterClose] = readDelimiter(s, end);
        const [scripts, afterScripts] = readScripts(s, afterClose);
        return {
          kind: "left",
          open,
          body,
          close,
          scripts,
          end: afterScripts
        };
      }
    }
    j = end;
  } else j += 1;
  throw new Error(`derivation tex: \\left without \\right in ${JSON.stringify(s)}`);
}
function atomize(s) {
  const atoms = [];
  let i = 0;
  while (i < s.length) {
    i = skipSpace(s, i);
    if (i >= s.length) break;
    const ch = s[i];
    if (ch === "{") {
      const [body, end] = readGroup(s, i);
      const [scripts2, after2] = readScripts(s, end);
      atoms.push({
        kind: "group",
        body,
        scripts: scripts2
      });
      i = after2;
      continue;
    }
    if (ch === "&") {
      atoms.push({
        kind: "raw",
        tex: "&"
      });
      i += 1;
      continue;
    }
    if (ch === "\\") {
      const [cmd, end] = readControl(s, i);
      if (cmd === "\\k") {
        const [name, afterName] = readGroup(s, skipSpace(s, end));
        const [body, afterBody] = readGroup(s, skipSpace(s, afterName));
        const [scripts3, after3] = readScripts(s, afterBody);
        atoms.push({
          kind: "term",
          name: name.trim(),
          body,
          scripts: scripts3
        });
        i = after3;
        continue;
      }
      if (cmd === "\\brk") {
        const level = /^\[(\d+)\]/.exec(s.slice(end));
        atoms.push({
          kind: "brk",
          pen: level ? Number(level[1]) : 0
        });
        i = end + (level ? level[0].length : 0);
        continue;
      }
      if (cmd === "\\left") {
        const atom = readLeftRight(s, i);
        atoms.push(atom);
        i = atom.end;
        continue;
      }
      if (SPACING.has(cmd)) {
        atoms.push({
          kind: "raw",
          tex: cmd
        });
        i = end;
        continue;
      }
      if (cmd === "\\begin") {
        const [env] = readGroup(s, end);
        const open = `\\begin{${env}}`;
        const close = `\\end{${env}}`;
        let stop = end;
        for (let depth = 1; depth > 0; ) {
          const nextClose = s.indexOf(close, stop);
          if (nextClose < 0) throw new Error(`derivation tex: missing ${close}`);
          const nextOpen = s.indexOf(open, stop);
          if (nextOpen >= 0 && nextOpen < nextClose) {
            depth += 1;
            stop = nextOpen + open.length;
          } else {
            depth -= 1;
            stop = depth ? nextClose + close.length : nextClose;
          }
        }
        const [scripts3, after3] = readScripts(s, stop + close.length);
        atoms.push({
          kind: "atom",
          head: s.slice(i, stop + close.length),
          scripts: scripts3
        });
        i = after3;
        continue;
      }
      let head = cmd;
      let j = end;
      if (cmd === "\\sqrt") {
        const [opt, afterOpt] = readOptional(s, j);
        head += opt;
        j = afterOpt;
      }
      for (let a = 0; a < (ARGC[cmd] ?? 0); a += 1) {
        const [tok2, afterTok] = readToken(s, j);
        head += tok2.startsWith("{") ? tok2 : `{${tok2}}`;
        j = afterTok;
      }
      const [scripts2, after2] = readScripts(s, j);
      atoms.push({
        kind: "atom",
        head,
        scripts: scripts2
      });
      i = after2;
      continue;
    }
    if (ch === "^" || ch === "_") {
      const [tok2, end] = readToken(s, i + 1);
      atoms.push({
        kind: "raw",
        tex: `${ch}${tok2}`
      });
      i = end;
      continue;
    }
    const [scripts, after] = readScripts(s, i + 1);
    atoms.push({
      kind: "atom",
      head: ch,
      scripts
    });
    i = after;
  }
  return atoms;
}
function normalizeTex(tex) {
  return tex.replace(/\s+/g, " ").replace(/\s*([{}^_()=+\-,;])\s*/g, "$1").trim();
}
function atomSource(atom) {
  switch (atom.kind) {
    case "left":
      return `\\left${atom.open}${atom.body}\\right${atom.close}${atom.scripts}`;
    case "group":
      return `{${atom.body}}${atom.scripts}`;
    case "atom":
      return `${atom.head}${atom.scripts}`;
    case "raw":
      return atom.tex;
    case "term":
      return `\\k{${atom.name}}{${atom.body}}${atom.scripts}`;
    case "brk":
      return atom.pen ? `\\brk[${atom.pen}]` : "\\brk";
  }
}
var BREAK_PENALTY = {
  comma: 4,
  rel: 8,
  bin: 12,
  product: 30,
  depth: 40
};
var MAX_DEPTH = 2;
var NULL_DELIMITER = "0.12em";
var SIZE = /^\\(big|Big|bigg|Bigg)[lrm]?$/;
var BIGOP = new Set([
  "\\int",
  "\\iint",
  "\\iiint",
  "\\oint",
  "\\sum",
  "\\prod",
  "\\lim",
  "\\max",
  "\\min",
  "\\sup",
  "\\inf"
]);
var FRAC = /^\\(frac|dfrac|tfrac|cfrac|binom|dbinom|tbinom)\{/;
var COLON = new Set([":", "\\colon"]);
function hashOf(tex) {
  let hash = 0;
  for (let index = 0; index < tex.length; index += 1) hash = hash * 31 + tex.charCodeAt(index) | 0;
  return (hash >>> 0).toString(36);
}
function stripMarks(tex) {
  return tex.replace(/\\k\s*\{[^{}]*\}/g, "").replace(/\\brk(\[\d+\])?/g, " ");
}
function tok(src, cls, depth, term2, extra = {}) {
  return {
    src,
    cls,
    depth,
    term: term2,
    group: -1,
    glue: false,
    factorEnd: false,
    factorStart: false,
    named: false,
    ...extra
  };
}
function classify(atom, depth, term2) {
  const src = atomSource(atom);
  if (atom.kind === "raw") {
    if (SPACING.has(atom.tex) || /^\\q?quad(\{\})?$/.test(atom.tex)) return tok(src, "space", depth, term2);
    return tok(src, "ord", depth, term2, { glue: atom.tex.startsWith("^") || atom.tex.startsWith("_") });
  }
  if (atom.kind === "left") return tok(src, "ord", depth, term2, {
    factorEnd: true,
    factorStart: true
  });
  if (atom.kind === "group") return tok(src, "ord", depth, term2);
  if (atom.kind === "term") {
    const inner = atomize(atom.body);
    if (!atom.scripts && inner.length === 2 && inner[0].kind === "atom" && SIZE.test(inner[0].head)) {
      const delimiter = classify(inner[1], depth, term2);
      if (delimiter.cls === "open" || delimiter.cls === "close") return {
        ...delimiter,
        src
      };
    }
    if (inner.length === 1 && !atom.scripts && inner[0].kind !== "brk") return {
      ...classify(inner[0], depth, term2),
      src
    };
    return tok(src, "ord", depth, term2);
  }
  if (atom.kind === "brk") return tok("", "space", depth, term2);
  const { head, scripts } = atom;
  if (!scripts) {
    if (COLON.has(head) || PUNCT.has(head)) return tok(src, "punct", depth, term2);
    if (REL.has(head)) return tok(src, "rel", depth, term2);
    if (BIN.has(head)) return tok(src, "bin", depth, term2);
  }
  if (OPEN.has(head)) return tok(src, "open", depth, term2, { factorStart: true });
  if (CLOSE.has(head)) return tok(src, "close", depth, term2, { factorEnd: true });
  if (FRAC.test(head)) return tok(src, "ord", depth, term2, {
    factorEnd: true,
    factorStart: true
  });
  if (BIGOP.has(head)) return tok(src, "ord", depth, term2, { factorStart: true });
  return tok(src, "ord", depth, term2, { named: /^(\\[A-Za-z]+|[A-Za-z])/.test(head) });
}
var operand = (t) => t.cls === "ord" || t.cls === "close";
function startsFactor(toks, i) {
  const c = toks[i];
  if (c.factorStart) return true;
  if (!c.named) return false;
  let j = i + 1;
  while (j < toks.length && toks[j].cls === "space") j += 1;
  return j < toks.length && (toks[j].cls === "open" || toks[j].src.startsWith("\\left"));
}
function opportunity(toks, i) {
  const p = toks[i - 1];
  const c = toks[i];
  if (!p || c.glue) return null;
  const depth = c.depth + (c.cls === "close" ? 1 : 0);
  if (depth > MAX_DEPTH) return null;
  const extra = BREAK_PENALTY.depth * depth;
  if (c.cls === "rel" && operand(p)) return BREAK_PENALTY.rel + extra;
  if (c.cls === "bin" && operand(p)) return BREAK_PENALTY.bin + extra;
  if (c.cls === "ord" || c.cls === "open") {
    let j = i - 1;
    while (j >= 0 && toks[j].cls === "space") j -= 1;
    if (j >= 0 && toks[j].cls === "punct") return BREAK_PENALTY.comma + extra;
  }
  if (p.factorEnd && startsFactor(toks, i)) return BREAK_PENALTY.product + extra;
  if (p.cls === "space" && /^\\text(rm|it|bf)?\{/.test(c.src)) return BREAK_PENALTY.rel + extra;
  return null;
}
function openable(flat, start, end, auto) {
  for (let i = start + 1; i < end; i += 1) {
    if (flat.forced.has(i)) return true;
    if (auto && opportunity(flat.toks, i) !== null) return true;
  }
  return false;
}
function flatten(flat, atoms, depth, term2, auto, lineLevel) {
  let d = depth;
  for (let index = 0; index < atoms.length; index += 1) {
    const atom = atoms[index];
    if (atom.kind === "brk") {
      const at = flat.toks.length;
      flat.forced.set(at, Math.min(flat.forced.get(at) ?? Number.POSITIVE_INFINITY, atom.pen));
      continue;
    }
    if (atom.kind === "term" && lineLevel && !atom.scripts) {
      const start = flat.toks.length;
      const forcedBefore = new Map(flat.forced);
      flat.terms.push({ name: atom.name.trim() });
      const id = flat.terms.length - 1;
      flatten(flat, atomize(atom.body), d, id, auto, false);
      if (flat.toks.length - start > 1 && openable(flat, start, flat.toks.length, auto)) continue;
      flat.toks.length = start;
      flat.forced = forcedBefore;
      flat.terms.pop();
      flat.toks.push(classify(atom, d, term2));
      continue;
    }
    if (atom.kind === "left" && atomize(atom.body).length > 1) {
      const start = flat.toks.length;
      const forcedBefore = new Map(flat.forced);
      const groupsBefore = flat.groups.length;
      flat.groups.push({ phantom: stripMarks(atom.body) });
      const id = flat.groups.length - 1;
      flat.toks.push(tok(`\\left${atom.open}`, "open", d, term2, {
        group: id,
        factorStart: true
      }));
      flatten(flat, atomize(atom.body), d + 1, term2, auto, false);
      flat.toks.push(tok(`\\right${atom.close}${atom.scripts}`, "close", d, term2, {
        group: id,
        factorEnd: true
      }));
      if (openable(flat, start, flat.toks.length, auto)) continue;
      flat.toks.length = start;
      flat.forced = forcedBefore;
      flat.groups.length = groupsBefore;
      flat.toks.push(classify(atom, d, term2));
      continue;
    }
    if (atom.kind === "atom" && SIZE.test(atom.head) && !atom.scripts && index + 1 < atoms.length) {
      const next = atoms[index + 1];
      if (next.kind === "atom" && (OPEN.has(next.head) || CLOSE.has(next.head))) {
        const inner = classify(next, d, term2);
        if (inner.cls === "close") d -= 1;
        flat.toks.push({
          ...inner,
          src: `${atom.head} ${atomSource(next)}`,
          depth: d
        });
        if (inner.cls === "open") d += 1;
        index += 1;
        continue;
      }
    }
    const words = auto && atom.kind === "atom" && !atom.scripts ? /^\\text\{([^{}\\]*)\}$/.exec(atom.head) : null;
    if (words && /\s/.test(words[1].trim())) {
      words[1].trim().split(/\s+/).forEach((word, w) => {
        if (w) flat.toks.push(tok("\\ ", "space", d, term2));
        flat.toks.push(tok(`\\text{${word}}`, "ord", d, term2));
      });
      continue;
    }
    const t = classify(atom, d, term2);
    if (t.cls === "close") {
      d = Math.max(depth, d - 1);
      t.depth = d;
    }
    flat.toks.push(t);
    if (t.cls === "open") d += 1;
  }
}
function assemble(flat, cuts, pens) {
  const { toks } = flat;
  const opens = new Map();
  const closes = new Map();
  toks.forEach((t, i) => {
    if (t.group < 0) return;
    if (t.cls === "open") opens.set(t.group, i);
    else closes.set(t.group, i);
  });
  const started = new Set();
  const used = new Set();
  const bounds = [
    0,
    ...cuts,
    toks.length
  ];
  const pieces = [];
  for (let s = 0; s + 1 < bounds.length; s += 1) {
    const a = bounds[s];
    const b = bounds[s + 1];
    if (a >= b) continue;
    const through = (g, o) => o < a && (closes.get(g) ?? -1) >= b;
    const carried = [...opens.entries()].filter(([g, o]) => o < a && (closes.get(g) ?? -1) >= a && !through(g, o)).sort((x, y) => x[1] - y[1]);
    const pending = [...opens.entries()].filter(([g, o]) => o < b && (closes.get(g) ?? -1) >= b && !through(g, o)).sort((x, y) => y[1] - x[1]);
    const prefix = carried.map(([g]) => `\\left.\\kern-${NULL_DELIMITER}\\vphantom{${flat.groups[g].phantom}}`).join(" ");
    const suffix = pending.map(([g]) => `\\vphantom{${flat.groups[g].phantom}}\\kern-${NULL_DELIMITER}\\right.`).join(" ");
    let last = b - 1;
    while (last >= a && toks[last].cls === "space") last -= 1;
    const trailing = b < toks.length && last >= a && toks[last].cls === "punct" ? " {}" : "";
    const runs = [];
    for (let i = a; i < b; i += 1) {
      const last2 = runs[runs.length - 1];
      if (last2 && last2.term === toks[i].term) last2.to = i + 1;
      else runs.push({
        term: toks[i].term,
        from: i,
        to: i + 1
      });
    }
    const out = runs.map((run, r) => {
      let from = run.from;
      let op = "";
      const first = toks[from];
      if (run.term >= 0 && started.has(run.term) && r === 0 && !carried.length && (first.cls === "bin" || first.cls === "rel") && run.to - from > 1) {
        op = first.src;
        from += 1;
      }
      const visible = toks.slice(from, run.to).map((t) => t.src).join(" ");
      let body = r === runs.length - 1 ? `${visible}${trailing}` : visible;
      if (r === 0 && prefix) body = `${prefix} ${body}`;
      if (r === runs.length - 1 && suffix) body = `${body} ${suffix}`;
      if (run.term < 0) return body;
      const base = flat.terms[run.term].name;
      let name = base;
      if (started.has(run.term)) {
        const hash = hashOf(`${op}|${visible}`);
        name = `${base}/${hash}`;
        for (let n = 2; used.has(name); n += 1) name = `${base}/${hash}_${n}`;
      }
      started.add(run.term);
      used.add(name);
      return `${op ? `\\k{${name}.s}{${op}} ` : ""}\\k{${name}}{${body}}`;
    });
    pieces.push({
      tex: out.join(" "),
      pen: s === 0 ? 0 : pens.get(a) ?? 0
    });
  }
  return pieces;
}
function hasInnerBreak(tex) {
  return (tex.match(/\\brk(?![A-Za-z])/g) ?? []).length > atomize(tex).filter((atom) => atom.kind === "brk").length;
}
function splitPieces(tex, mode) {
  const flat = {
    toks: [],
    forced: new Map(),
    terms: [],
    groups: []
  };
  const auto = mode === "auto";
  flatten(flat, atomize(tex), 0, -1, auto, true);
  const pens = new Map();
  let braceDepth = 0;
  for (let i = 1; i < flat.toks.length; i += 1) {
    const previous = flat.toks[i - 1];
    if (previous.cls === "open" && /\\\{|\\lbrace/.test(previous.src)) braceDepth++;
    if (previous.cls === "close" && /\\\}|\\rbrace/.test(previous.src)) braceDepth = Math.max(0, braceDepth - 1);
    if (braceDepth) continue;
    const forced = flat.forced.get(i);
    const chance = auto ? opportunity(flat.toks, i) : null;
    const pen = Math.min(forced ?? Number.POSITIVE_INFINITY, chance ?? Number.POSITIVE_INFINITY);
    if (Number.isFinite(pen)) pens.set(i, pen);
  }
  const cuts = [...pens.keys()].sort((x, y) => x - y);
  if (!flat.toks.length) return [{
    tex: "",
    pen: 0
  }];
  return assemble(flat, cuts, pens);
}
var ENV_RE = /^\\begin\{(cases|aligned|gathered)\}([\s\S]*)\\end\{\1\}$/;
function estimateWidth(tex) {
  return stripMarks(tex).replace(/\\(left|right|big|Big|bigg|Bigg)[lrm]?/g, "").replace(/\\(vphantom|phantom)\{[^{}]*\}/g, "").replace(/\\(,|;|:|!|displaystyle|textstyle)/g, "").replace(/\\(quad)/g, "xx").replace(/\\(qquad)/g, "xxxx").replace(/\\(mathrm|mathbf|mathbb|mathcal|mathfrak|operatorname|widetilde|tilde|hat|bar|text)\b/g, "").replace(/\\[A-Za-z]+/g, "x").replace(/[{}\s^_&]/g, "").length;
}
function parseEnv(head, scripts) {
  const match = ENV_RE.exec(head);
  if (!match) return null;
  const rows = [{ cells: [[]] }];
  for (const atom of atomize(match[2])) if (atom.kind === "raw" && atom.tex === "\\\\") rows.push({ cells: [[]] });
  else if (atom.kind === "raw" && atom.tex === "&") rows[rows.length - 1].cells.push([]);
  else rows[rows.length - 1].cells[rows[rows.length - 1].cells.length - 1].push(atom);
  return {
    name: match[1],
    rows,
    scripts
  };
}
var cellTex = (atoms) => atoms.map(atomSource).join(" ");
function envTex(env) {
  return `\\begin{${env.name}}${env.rows.map((row) => row.cells.map(cellTex).join(" & ")).join(" \\\\ ")}\\end{${env.name}}${env.scripts}`;
}
function splitCells(env, row) {
  if (env.name === "cases") return row.cells.length > 1 ? [0, 1] : [0];
  return [row.cells.length - 1];
}
function cellBreak(atoms) {
  const toks = atoms.map((atom) => classify(atom, 0, -1));
  let d = 0;
  toks.forEach((t) => {
    if (t.cls === "close") d = Math.max(0, d - 1);
    t.depth = d;
    if (t.cls === "open") d += 1;
  });
  const widths = atoms.map((atom) => estimateWidth(atomSource(atom)));
  const total = widths.reduce((x, y) => x + y, 0);
  let best = null;
  let left = widths[0] ?? 0;
  const firstInk = toks.findIndex((t) => t.cls !== "space");
  for (let i = 1; i < toks.length; i += 1) {
    const pen = opportunity(toks, i);
    if (pen !== null && toks[i].depth <= 1 && firstInk >= 0 && firstInk < i) {
      const score = Math.abs(left - total / 2) + pen / 4;
      if (!best || score < best.score) best = {
        at: i,
        score
      };
    }
    left += widths[i];
  }
  return best?.at ?? null;
}
function splitWidest(envs) {
  let best = null;
  for (const env2 of envs) env2.rows.forEach((row2, r) => {
    for (const c2 of splitCells(env2, row2)) {
      const at2 = cellBreak(row2.cells[c2] ?? []);
      if (at2 === null) continue;
      const width = estimateWidth(row2.cells.map(cellTex).join(" "));
      if (!best || width > best.width) best = {
        env: env2,
        row: r,
        cell: c2,
        at: at2,
        width
      };
      break;
    }
  });
  if (!best) return false;
  const { env, row, cell: c, at } = best;
  const cells = env.rows[row].cells;
  const head = cells[c].slice(0, at);
  const tail = cells[c].slice(at);
  const indent = {
    kind: "raw",
    tex: (env.name === "aligned" ? "\\qquad" : "\\quad") + (tail[0] && classify(tail[0], 0, -1).cls === "bin" ? "{}" : "")
  };
  const first = { cells: cells.map((cell, i) => i === c ? head : i < c ? cell : []) };
  const second = { cells: cells.map((cell, i) => i === c ? [indent, ...tail] : i > c ? cell : []) };
  env.rows.splice(row, 1, first, second);
  return true;
}
function rewriteEnvs(tex, splits) {
  const envs = [];
  const rebuild = [];
  for (const atom of atomize(tex)) {
    if (atom.kind === "atom") {
      const env = parseEnv(atom.head, atom.scripts);
      if (env) {
        envs.push(env);
        rebuild.push(() => envTex(env));
        continue;
      }
    }
    if (atom.kind === "term") {
      const body = atomize(atom.body);
      const parts = body.map((inner) => {
        const env = inner.kind === "atom" ? parseEnv(inner.head, inner.scripts) : null;
        if (env) envs.push(env);
        return env ? () => envTex(env) : () => atomSource(inner);
      });
      if (parts.length && body.some((inner) => inner.kind === "atom" && ENV_RE.test(inner.head))) {
        rebuild.push(() => `\\k{${atom.name}}{${parts.map((part) => part()).join(" ")}}${atom.scripts}`);
        continue;
      }
    }
    rebuild.push(() => atomSource(atom));
  }
  if (!envs.length) return null;
  for (let k = 0; k < splits; k += 1) if (!splitWidest(envs)) return null;
  return rebuild.map((part) => part()).join(" ");
}
var DERIVATION_ROLES = [
  "lower",
  "buncher",
  "upper",
  "ink",
  "ink-muted",
  "approx",
  "cosine",
  "sine"
];
var FACTOR_OPS = new Set(["\\cdot", "\\times"]);
var INVISIBLE = /^\\(kern|mkern|hskip|mskip|vphantom|phantom|hphantom)\b/;
function breakKind(tex) {
  for (const atom of atomize(tex)) {
    if (atom.kind === "brk" || atom.kind === "raw") continue;
    if (atom.kind === "group") {
      if (!atom.body.trim()) continue;
      return breakKind(atom.body);
    }
    if (atom.kind === "term") return breakKind(atom.body);
    if (atom.kind === "left") return "other";
    if (INVISIBLE.test(atom.head)) continue;
    if (REL.has(atom.head)) return "rel";
    if (FACTOR_OPS.has(atom.head)) return "factor";
    if (BIN.has(atom.head)) return "term";
    return "other";
  }
  return "other";
}
var NAME_RE = /^[A-Za-z][A-Za-z0-9_.:-]*$/;
var FRAGMENT_RE = /^([A-Za-z][A-Za-z0-9_.:-]*)\/[a-z0-9_]+(\.s)?$/;
function atomClass(body) {
  const atoms = atomize(body);
  if (atoms.length !== 1) return "\\mathord";
  const a = atoms[0];
  if (a.kind !== "atom" || a.scripts) return "\\mathord";
  if (REL.has(a.head)) return "\\mathrel";
  if (BIN.has(a.head)) return "\\mathbin";
  if (PUNCT.has(a.head)) return "\\mathpunct";
  if (OPEN.has(a.head)) return "\\mathopen";
  if (CLOSE.has(a.head)) return "\\mathclose";
  return "\\mathord";
}
function wrap(ctx, unit, inner, cls) {
  const own = (map) => map?.[unit.key] ?? (unit.base ? map?.[unit.base] : void 0) ?? null;
  const role = unit.auto ? ctx.options.roles?.[unit.tex] ?? null : own(ctx.options.roles);
  if (role && !DERIVATION_ROLES.includes(role)) throw new Error(`derivation tex: unknown role "${role}" for ${unit.key}`);
  const emphasis = unit.auto ? null : own(ctx.options.emphasis);
  const chunk = unit.auto ? null : own(ctx.options.chunks);
  ctx.units.push({
    ...unit,
    role,
    emphasis,
    chunk
  });
  const attrs = [`term=${unit.id}`];
  if (role) attrs.push(`role=${role}`);
  if (emphasis) attrs.push(`emph=${emphasis}`);
  if (chunk) attrs.push(`chunk=${chunk}`);
  return `${cls}{\\htmlData{${attrs.join(",")}}{${inner}}}`;
}
function convert(ctx, tex, parent, auto) {
  const atoms = atomize(tex);
  const out = [];
  for (let index = 0; index < atoms.length; index++) {
    let atom = atoms[index];
    if (atom.kind === "atom" && /^\\(?:big|Big|bigg|Bigg)$/.test(atom.head)) {
      const next = atoms[index + 1];
      if (next?.kind === "atom" && (OPEN.has(next.head) || CLOSE.has(next.head))) {
        atom = {
          kind: "atom",
          head: `${atom.head}${next.head}`,
          scripts: next.scripts
        };
        index++;
      }
    }
    if (atom.kind === "brk") throw new Error("derivation tex: \\brk is only allowed at the top level of a line or of a top-level term's body");
    if (atom.kind === "raw") {
      out.push(atom.tex);
      continue;
    }
    if (atom.kind === "term") {
      const fragment = FRAGMENT_RE.exec(atom.name);
      if (!NAME_RE.test(atom.name) && !fragment) throw new Error(`derivation tex: invalid term name "${atom.name}" (use letters, digits, _ . : -)`);
      if (ctx.explicit.has(atom.name)) throw new Error(`derivation tex: duplicate term "${atom.name}" in one line; give repeated symbols distinct names`);
      ctx.explicit.add(atom.name);
      const slot2 = ctx.units.length;
      const inner2 = convert(ctx, atom.body, atom.name, false);
      const scripts = convertNested(ctx, atom.scripts, atom.name);
      const children2 = ctx.units.splice(slot2);
      const wrapped = wrap(ctx, {
        id: atom.name,
        key: atom.name,
        auto: false,
        tex: normalizeTex(atom.body + atom.scripts),
        parent,
        base: fragment?.[1] ?? null
      }, scripts ? `{${inner2}}${scripts}` : inner2, atomClass(atom.body + atom.scripts));
      ctx.units.push(...children2);
      out.push(wrapped);
      continue;
    }
    if (!auto) {
      out.push(convertNested(ctx, atomSource(atom), parent));
      continue;
    }
    const source = atomSource(atom);
    const norm = normalizeTex(source);
    const n = ctx.occurrences.get(norm) ?? 0;
    ctx.occurrences.set(norm, n + 1);
    const id = `${ctx.options.idPrefix ?? ""}_a${ctx.autoCount++}`;
    const slot = ctx.units.length;
    let inner;
    if (atom.kind === "left") inner = `\\left${atom.open}${convert(ctx, atom.body, id, true)}\\right${atom.close}${convertNested(ctx, atom.scripts, id)}`;
    else if (atom.kind === "group") inner = `{${convert(ctx, atom.body, id, true)}}${convertNested(ctx, atom.scripts, id)}`;
    else inner = convertNested(ctx, source, id);
    const children = ctx.units.splice(slot);
    out.push(wrap(ctx, {
      id,
      key: `~${norm}#${n}`,
      auto: true,
      tex: norm,
      parent,
      base: null
    }, inner, atomClass(source)));
    ctx.units.push(...children);
  }
  return out.join(" ");
}
function convertNested(ctx, tex, parent) {
  if (!tex.includes("\\k")) return tex;
  let out = "";
  let i = 0;
  while (i < tex.length) {
    if (tex[i] === "\\") {
      const [cmd, end] = readControl(tex, i);
      if (cmd === "\\k") {
        const [name, afterName] = readGroup(tex, skipSpace(tex, end));
        const [body, afterBody] = readGroup(tex, skipSpace(tex, afterName));
        const [scripts, after] = readScripts(tex, afterBody);
        out += convert(ctx, `\\k{${name}}{${body}}${scripts}`, parent, false);
        i = after;
        continue;
      }
      out += cmd;
      i = end;
      continue;
    }
    out += tex[i];
    i += 1;
  }
  return out;
}
function processLine(tex, options = {}) {
  const ctx = {
    units: [],
    occurrences: new Map(),
    explicit: new Set(),
    autoCount: 0,
    options
  };
  let pieces;
  if (options.autoBreak) {
    const source = options.envSplits ? rewriteEnvs(tex, options.envSplits) : tex;
    if (source === null) throw new Error("derivation tex: no environment row left to split");
    pieces = splitPieces(source, "auto");
  } else if (hasInnerBreak(tex) || /\\(?:big|Big|bigg|Bigg|left)?\\?\{|\\lbrace/.test(tex)) pieces = splitPieces(tex, "authored");
  else {
    const parts = [[]];
    for (const atom of atomize(tex)) if (atom.kind === "brk") parts.push([]);
    else parts[parts.length - 1].push(atomSource(atom));
    pieces = parts.map((part) => ({
      tex: part.join(" "),
      pen: 0
    }));
  }
  const segments = pieces.map((piece, index) => {
    const body = convert(ctx, piece.tex, null, true);
    return `\\displaystyle ${index > 0 ? "{} " : ""}${body}${index < pieces.length - 1 ? " {}" : ""}`;
  });
  for (const key of Object.keys(options.emphasis ?? {})) if (key !== "*" && !ctx.explicit.has(key)) throw new Error(`derivation tex: emphasis on unknown term "${key}"`);
  const kinds = pieces.map((piece, index) => index ? breakKind(piece.tex) : "start");
  return {
    segments,
    pens: pieces.map((piece) => piece.pen),
    kinds,
    units: ctx.units
  };
}
var MAX_ENV_SPLITS = 3;
var KATEX_BASE = {
  displayMode: false,
  throwOnError: true,
  strict: "ignore",
  trust: (context) => context.command === "\\htmlData"
};
function renderSegments(line) {
  return line.segments.map((tex) => katex.renderToString(tex, {
    ...KATEX_BASE,
    output: "html"
  }));
}
function compileVariant(tex, options, extra = {}) {
  const active = processLine(tex, {
    ...options,
    ...extra
  });
  const history = processLine(tex, {
    roles: options.roles,
    chunks: options.chunks,
    ...extra
  });
  return {
    units: active.units,
    activeHtml: renderSegments(active),
    historyHtml: renderSegments(history),
    pens: active.pens,
    kinds: active.kinds
  };
}
var ALT_FAILURES = [];
function compileAlts(tex, options, base) {
  const alts = [];
  const seen = new Set([base.activeHtml.join("\0")]);
  const push = (variant) => {
    const sig = variant.activeHtml.join("\0");
    if (seen.has(sig)) return;
    seen.add(sig);
    alts.push(variant);
  };
  try {
    push(compileVariant(tex, options, { autoBreak: true }));
    for (let splits = 1; splits <= MAX_ENV_SPLITS; splits += 1) {
      if (rewriteEnvs(tex, splits) === null) break;
      push(compileVariant(tex, options, {
        autoBreak: true,
        envSplits: splits
      }));
    }
  } catch (error) {
    ALT_FAILURES.push(`${error.message} in ${JSON.stringify(tex)}`);
  }
  return alts;
}
function hintFor(map, key) {
  if (!map) return void 0;
  if (Object.prototype.hasOwnProperty.call(map, key)) return map[key];
  let best;
  for (const [pattern, value] of Object.entries(map)) {
    if (!pattern.includes("*")) continue;
    if (new RegExp(`^${pattern.split("*").map((p) => p.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*")}$`).test(key) && (!best || pattern.length > best.len)) best = {
      len: pattern.length,
      value
    };
  }
  return best?.value;
}
var compiledCache = new WeakMap();
function compileDerivation(spec) {
  const cached = compiledCache.get(spec);
  if (cached) return cached;
  if (!spec.id || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(spec.id)) throw new Error(`derivation: id must be a simple identifier, got ${JSON.stringify(spec.id)}`);
  if (!spec.states.length) throw new Error(`derivation ${spec.id}: needs at least one state`);
  if (spec.states[0].keep) throw new Error(`derivation ${spec.id}: state 0 cannot keep a previous line`);
  if (spec.states[0].sub) throw new Error(`derivation ${spec.id}: state 0 cannot be a sub-state`);
  const lines = spec.states.map((state, index) => {
    const roles = {
      ...spec.roles ?? {},
      ...state.roles ?? {}
    };
    const where = `derivation ${spec.id} state ${index}`;
    const emphasis = { ...state.emphasis ?? {} };
    const lineEmphasis = emphasis["*"] ?? null;
    let active;
    let variant;
    let alts;
    try {
      active = processLine(state.tex, {
        roles,
        emphasis,
        chunks: state.chunks
      });
      variant = compileVariant(state.tex, {
        roles,
        emphasis,
        chunks: state.chunks
      });
      alts = compileAlts(state.tex, {
        roles,
        emphasis,
        chunks: state.chunks
      }, variant);
    } catch (error) {
      throw new Error(`${where}: ${error.message}`);
    }
    const keys = new Set(active.units.map((u) => u.key));
    for (const to of Object.keys(state.from ?? {})) {
      if (!keys.has(to)) throw new Error(`${where}: from-map target "${to}" is not a term of this state`);
      if (index === 0) throw new Error(`${where}: state 0 has no previous state`);
    }
    for (const key of Object.keys(state.chunks ?? {})) if (!keys.has(key)) throw new Error(`${where}: chunk on unknown term "${key}"`);
    let mathml;
    try {
      mathml = katex.renderToString(active.segments.join(" "), {
        ...KATEX_BASE,
        output: "mathml"
      });
    } catch (error) {
      throw new Error(`${where}: KaTeX: ${error.message}`);
    }
    return {
      ...variant,
      state: index,
      alts,
      mathml,
      lineEmphasis,
      empty: !state.tex.trim()
    };
  });
  const stepEnds = [];
  spec.states.forEach((state, index) => {
    if (index > 0 && state.sub) stepEnds[stepEnds.length - 1] = index;
    else stepEnds.push(index);
  });
  const compiled = {
    id: spec.id,
    spec,
    lines,
    maxLines: Math.max(1, spec.maxLines ?? 3),
    stepEnds
  };
  spec.states.forEach((state, index) => {
    if (!state.from || index === 0) return;
    const visible = displayLines(compiled, index - 1).flatMap((line) => lines[line.state].units.map((u) => u.key));
    for (const [to, fromKey] of Object.entries(state.from)) if (!visible.includes(fromKey)) throw new Error(`derivation ${spec.id} state ${index}: from-map source "${fromKey}" (for "${to}") is not visible in state ${index - 1}`);
  });
  compiledCache.set(spec, compiled);
  return compiled;
}
function defineDerivation(spec) {
  if (/^(kink|cdf|identification|general|mixture|ss|noise)-/.test(spec.id)) spec = {
    ...spec,
    states: spec.states.map((state) => ({
      ...state,
      tex: state.tex.replace(/\\big(?=\\[{}])/g, "\\Big").replace(/\\bigg(?=\\[{}])/g, "\\Bigg")
    }))
  };
  compileDerivation(spec);
  return spec;
}
function stepCount(spec) {
  return compileDerivation(spec).stepEnds.length;
}
function clampState(compiled, state) {
  if (!Number.isFinite(state)) return 0;
  return Math.max(0, Math.min(compiled.lines.length - 1, Math.trunc(state)));
}
function clampStep(compiled, step) {
  if (!Number.isFinite(step)) return 0;
  return Math.max(0, Math.min(compiled.stepEnds.length - 1, Math.trunc(step)));
}
function stateAtStep(compiled, step) {
  if (step === null || step === -1) return -1;
  return compiled.stepEnds[clampStep(compiled, step)];
}
function isEmptyState(compiled, state) {
  if (state === -1) return true;
  const lines = displayLines(compiled, state);
  return lines.length === 1 && compiled.lines[lines[0].state].empty;
}
function isEmptyAt(spec, at) {
  const compiled = compileDerivation(spec);
  return isEmptyState(compiled, stateAtStep(compiled, at));
}
function statesBetween(compiled, fromStep, toStep) {
  const a = stateAtStep(compiled, fromStep);
  const b = stateAtStep(compiled, toStep);
  const out = [];
  for (let i = a + 1; i <= b; i += 1) out.push(i);
  return out;
}
function displayLines(compiled, state) {
  if (state === -1) return [];
  const k = clampState(compiled, state);
  const chain = [k];
  let j = k;
  let cursor = k;
  while (chain.length < compiled.maxLines) {
    let start = cursor;
    while (start > 0 && !compiled.spec.states[start].keep) start -= 1;
    if (!compiled.spec.states[start].keep || start === 0) break;
    j = start - 1;
    chain.unshift(j);
    cursor = j;
  }
  return chain.map((state2) => ({
    state: state2,
    history: state2 !== k
  }));
}
function segmentsMarkup(variant, history, auto) {
  const attrs = (i) => {
    if (i === 0) return "";
    if (auto) return ` data-brk="${variant.pens[i]}" data-kind="${variant.kinds[i]}"`;
    return ` data-kind="${variant.kinds[i]}"${variant.pens[i] ? ` data-brk="${variant.pens[i]}"` : ""}`;
  };
  return (history ? variant.historyHtml : variant.activeHtml).map((html, i) => `<span class="dv-seg"${attrs(i)}>${html}</span>`).join("");
}
function stateMarkup(compiled, state) {
  if (isEmptyState(compiled, state)) return "";
  return displayLines(compiled, state).map(({ state: s, history }) => lineMarkup(compiled, s, history)).join("");
}
function lineMarkup(compiled, s, history = false) {
  const line = compiled.lines[clampState(compiled, s)];
  const emph = !history && line.lineEmphasis ? ` data-emph="${line.lineEmphasis}"` : "";
  const open = `<div class="dv-line${history ? " is-history" : " is-active"}" data-line="${line.state}"${emph}`;
  if (!line.alts.length) return `${open}>${segmentsMarkup(line, history, false)}</div>`;
  return `${open} data-variant="0">${[line, ...line.alts].map((variant, v) => `<span class="dv-var" data-v="${v}"${v ? " hidden" : ""}>${segmentsMarkup(variant, history, v > 0)}</span>`).join("")}</div>`;
}
function unitsOf(compiled, state, v = 0) {
  const line = compiled.lines[state];
  return (v > 0 ? line.alts[v - 1] : void 0)?.units ?? line.units;
}
function stateMathml(compiled, state) {
  if (isEmptyState(compiled, state)) return [];
  return displayLines(compiled, state).map(({ state: s, history }) => ({
    state: s,
    history,
    mathml: compiled.lines[s].mathml,
    label: compiled.spec.states[s].label ?? null
  }));
}
function unitHint(map, u) {
  return hintFor(map, u.key) ?? (u.base ? hintFor(map, u.base) : void 0);
}
function planTransition(compiled, fromState, toState, variants = {}) {
  const from = fromState === -1 ? -1 : clampState(compiled, fromState);
  const to = toState === -1 ? -1 : clampState(compiled, toState);
  const target = to === -1 ? { tex: "" } : compiled.spec.states[to];
  const oldLines = isEmptyState(compiled, from) ? [] : displayLines(compiled, from);
  const newLines = isEmptyState(compiled, to) ? [] : displayLines(compiled, to);
  const vFrom = variants.from ?? (() => 0);
  const vTo = variants.to ?? (() => 0);
  const oldUnits = (state) => unitsOf(compiled, state, vFrom(state));
  const newUnits = (state) => unitsOf(compiled, state, vTo(state));
  const oldStates = new Set(oldLines.map((l) => l.state));
  const newStates = new Set(newLines.map((l) => l.state));
  const persists = (state) => oldStates.has(state) && vFrom(state) === vTo(state);
  const searchOrder = [...oldLines].reverse().map((l) => l.state);
  const keyIndex = new Map();
  for (const l of oldLines) keyIndex.set(l.state, new Map(oldUnits(l.state).map((u) => [u.key, u])));
  const used = new Set();
  const plan = {
    from,
    to,
    moves: [],
    enters: [],
    exits: [],
    persistLines: newLines.filter((l) => oldStates.has(l.state)).map((l) => l.state),
    enterLines: newLines.filter((l) => !oldStates.has(l.state)).map((l) => l.state),
    exitLines: oldLines.filter((l) => !newStates.has(l.state)).map((l) => l.state),
    emphasis: [],
    phaseCount: target.phases?.length ?? 0
  };
  const phaseMaps = (target.phases ?? []).map((group) => Object.fromEntries(group.map((p) => [p, true])));
  const phaseOf = (u, units) => {
    if (!phaseMaps.length) return null;
    const byId = new Map(units.map((x) => [x.id, x]));
    for (let cur = u; cur; cur = cur.parent ? byId.get(cur.parent) : void 0) {
      const unit = cur;
      const i = phaseMaps.findIndex((m) => unitHint(m, unit));
      if (i >= 0) return i;
    }
    return null;
  };
  for (const line of newLines) {
    const units = newUnits(line.state);
    if (persists(line.state)) {
      for (const u of units) {
        const ref = {
          line: line.state,
          id: u.id
        };
        plan.moves.push({
          to: ref,
          from: ref,
          copy: false,
          path: null,
          phase: null
        });
        used.add(`${line.state}|${u.id}`);
      }
      continue;
    }
    const morph = compiled.spec.states[line.state].from ?? {};
    const byId = new Map(units.map((u) => [u.id, u]));
    const pathOf = (u) => {
      for (let cur = u; cur; cur = cur.parent ? byId.get(cur.parent) : void 0) {
        const hit = unitHint(target.path, cur);
        if (hit) return hit;
      }
      return null;
    };
    for (const u of units) {
      const sources = [morph[u.key] ?? u.key];
      if (u.base && u.key !== u.base && morph[u.base]) sources.push(`${morph[u.base]}${u.key.slice(u.base.length)}`);
      let found = null;
      for (const sourceKey of sources) {
        for (const s of searchOrder) {
          const hit = keyIndex.get(s)?.get(sourceKey);
          if (hit) {
            found = {
              line: s,
              id: hit.id
            };
            break;
          }
        }
        if (found) break;
      }
      const ref = {
        line: line.state,
        id: u.id
      };
      if (found) {
        const tag = `${found.line}|${found.id}`;
        plan.moves.push({
          to: ref,
          from: found,
          copy: used.has(tag) || newStates.has(found.line),
          path: pathOf(u),
          phase: phaseOf(u, units)
        });
        used.add(tag);
      } else plan.enters.push({
        ref,
        style: unitHint(target.enter, u) ?? "write",
        phase: phaseOf(u, units)
      });
    }
  }
  for (const line of oldLines) {
    const units = oldUnits(line.state);
    for (const u of units) if (!used.has(`${line.state}|${u.id}`)) plan.exits.push({
      ref: {
        line: line.state,
        id: u.id
      },
      style: unitHint(target.exit, u) ?? "fade",
      phase: phaseOf(u, units)
    });
  }
  const active = newLines[newLines.length - 1];
  if (!active) return plan;
  const activeLine = compiled.lines[active.state];
  if (activeLine.lineEmphasis) plan.emphasis.push({
    ref: {
      line: active.state,
      id: "*"
    },
    kind: activeLine.lineEmphasis
  });
  for (const u of newUnits(active.state)) if (u.emphasis) plan.emphasis.push({
    ref: {
      line: active.state,
      id: u.id
    },
    kind: u.emphasis
  });
  return plan;
}
function transitionKind(prev, next, options) {
  if (prev === null || prev === next) return "none";
  if (options.reducedMotion) return "instant";
  const forwardOne = next === prev + 1 || prev === -1 || next === -1;
  const allowed = options.animate ?? true;
  return forwardOne && allowed ? "animate" : "instant";
}
var MIN_ONE_ROW_SCALE = 0.86;
var VARIANT_GAIN = 0.01;
var ROW_COST = 24;
var FILL_COST = 30;
var SLACK = 1;
function horizontalPadding(el) {
  const cs = getComputedStyle(el);
  return parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
}
var segmentsOf = (container) => Array.from(container.children).filter((el) => el.classList.contains("dv-seg"));
var widthOf = (el) => el.getBoundingClientRect().width;
function layoutRows(widths, pens, avail, firstPad, restPad, kinds) {
  const n = widths.length;
  const prefix = [0];
  for (const w of widths) prefix.push(prefix[prefix.length - 1] + w);
  const pad = (i) => i === 0 ? firstPad : restPad;
  let scale = 1;
  for (let i = 0; i < n; i += 1) scale = Math.min(scale, (avail - SLACK) / (widths[i] + pad(i)));
  scale = Math.max(0.05, Math.floor(scale * 1e3) / 1e3);
  for (let attempt = 0; attempt < 300 && scale >= 0.05; attempt += 1) {
    const budget = (i) => (avail - SLACK) / scale - pad(i);
    const cost = new Array(n + 1).fill(Number.POSITIVE_INFINITY);
    const from = new Array(n + 1).fill(-1);
    cost[0] = 0;
    for (let j = 1; j <= n; j += 1) for (let i = 0; i < j; i += 1) {
      if (!Number.isFinite(cost[i])) continue;
      if (kinds && i > 0 && kinds[i] === "factor" && kinds[i - 1] !== "factor") continue;
      const width = prefix[j] - prefix[i];
      const room = budget(i);
      if (width > room) continue;
      const fill = j < n ? FILL_COST * ((room - width) / room) ** 2 : 0;
      const c = cost[i] + ROW_COST + (i > 0 ? pens[i] + (kinds?.[i] === "factor" ? KIND_COST.factor : 0) : 0) + fill;
      if (c < cost[j]) {
        cost[j] = c;
        from[j] = i;
      }
    }
    if (Number.isFinite(cost[n])) {
      const starts = [];
      for (let j = n; j > 0; j = from[j]) if (from[j] > 0) starts.unshift(from[j]);
      return {
        scale,
        starts
      };
    }
    scale = Math.floor(scale * 0.99 * 1e3) / 1e3;
  }
  return {
    scale,
    starts: Array.from({ length: Math.max(0, n - 1) }, (_, i) => i + 1)
  };
}
var KIND_COST = {
  start: 0,
  term: 4,
  other: 8,
  rel: 10,
  factor: 40
};
var HANG_COST = 10;
var SOFT_SCALE_COST = 100;
var LEGIBLE_SCALE = 0.7;
var MAX_ROW_SEGMENTS = 14;
var ranksBefore = (a, b) => {
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) return a[i] < b[i];
  return false;
};
function chooseRows(segs, spec) {
  const n = segs.length;
  if (n < 2 || n > MAX_ROW_SEGMENTS) return null;
  const room = spec.avail - SLACK;
  const firstRel = segs.findIndex((seg, i) => i > 0 && seg.kind === "rel");
  let best = null;
  for (const align of [true, false]) for (let mask = 0; mask < 1 << n - 1; mask += 1) {
    const x = new Array(n);
    const starts = [];
    const indents = [];
    const ends = [];
    let soft = 0;
    let orphan = false;
    let cuts = 0;
    let hung = false;
    let lastRel = -1;
    x[0] = spec.padLeft;
    for (let k = 1; k < n; k += 1) {
      const seg = segs[k];
      const end = x[k - 1] + segs[k - 1].width;
      if (mask & 1 << k - 1) {
        ends.push(end);
        const lead = seg.lead ?? 0;
        let at = spec.padLeft + spec.hang;
        if (seg.kind === "factor") {
          cuts += 1;
          let first = k;
          while (first > 1 && segs[first - 1].kind === "factor") first -= 1;
          if (first < k) at = x[first] + (segs[first].lead ?? 0) - lead;
          else orphan = true;
        } else if (seg.kind === "term" && lastRel >= 0) if (align) at = x[lastRel] + (segs[lastRel].rhs ?? segs[lastRel].width) - lead;
        else hung = true;
        else if (seg.kind === "rel" && firstRel >= 0 && firstRel < k) if (align) at = x[firstRel] + (segs[firstRel].lead ?? 0) - lead;
        else hung = true;
        x[k] = Math.max(spec.padLeft, at);
        soft += KIND_COST[seg.kind] + (seg.pen ?? 0);
        starts.push(k);
        indents.push(x[k]);
      } else x[k] = end;
      if (seg.kind === "rel") lastRel = k;
    }
    ends.push(x[n - 1] + segs[n - 1].width);
    const widest = Math.max(...ends) + spec.padRight;
    const scale = Math.min(1, Math.floor(room / widest * 1e3) / 1e3);
    const space = room / scale;
    soft += ROW_COST * starts.length + (hung ? HANG_COST : 0) + SOFT_SCALE_COST * (1 - scale);
    for (let r = 0; r < ends.length - 1; r += 1) soft += FILL_COST * ((space - ends[r] - spec.padRight) / space) ** 2;
    const legible = scale >= LEGIBLE_SCALE;
    const key = [
      orphan ? legible ? 1 : 3 : legible ? 0 : 2,
      scale >= 0.86 ? 0 : Math.round((MIN_ONE_ROW_SCALE - scale) * 1e3),
      cuts,
      -Math.round(scale * 100),
      soft
    ];
    if (!best || ranksBefore(key, best.key)) best = {
      scale,
      starts,
      indents,
      key
    };
  }
  return best;
}
function showVariant(line, variants, v) {
  variants.forEach((el, i) => {
    el.hidden = i !== v;
  });
  line.dataset.variant = String(v);
}
var HANG_EM = 1.28;
function topTerms(seg) {
  return Array.from(seg.querySelectorAll("[data-term]")).filter((el) => {
    const outer = el.parentElement?.closest("[data-term]");
    return !outer || !seg.contains(outer);
  });
}
function measuredRows(line, segs, widths, avail) {
  if (segs.length < 2 || segs.length > MAX_ROW_SEGMENTS) return null;
  const cs = getComputedStyle(line);
  const rowSegs = segs.map((seg, i) => {
    const left = seg.getBoundingClientRect().left;
    const tops = topTerms(seg);
    const kind = i ? seg.dataset.kind ?? "other" : "start";
    return {
      width: widths[i],
      kind,
      pen: i ? Number(seg.dataset.brk) || 0 : 0,
      lead: tops[0] ? tops[0].getBoundingClientRect().left - left : 0,
      rhs: kind === "rel" ? tops[1] ? tops[1].getBoundingClientRect().left - left : widths[i] : void 0
    };
  });
  const padLeft = parseFloat(cs.paddingLeft);
  const fontPx = parseFloat(cs.fontSize);
  const choice = chooseRows(rowSegs, {
    avail,
    padLeft,
    padRight: parseFloat(cs.paddingRight),
    hang: HANG_EM * fontPx
  });
  return choice && {
    ...choice,
    padLeft,
    fontPx
  };
}
function applyRows(line, segs, rows) {
  line.classList.toggle("is-rows", rows.starts.length > 0);
  line.classList.toggle("is-broken", rows.starts.length > 0);
  rows.starts.forEach((start, r) => {
    const brk = document.createElement("span");
    brk.className = "dv-break";
    brk.setAttribute("aria-hidden", "true");
    segs[start].before(brk);
    const margin = (rows.indents[r] - rows.padLeft) / rows.fontPx;
    if (margin > 1e-3) segs[start].style.marginLeft = `${margin.toFixed(4)}em`;
  });
  if (rows.scale < 1) line.style.fontSize = `${rows.scale}em`;
}
var variantWins = (rows, current) => {
  const a = rows.key.slice(0, 3);
  const b = current.key.slice(0, 3);
  if (a.some((value, i) => value !== b[i])) return ranksBefore(a, b);
  return rows.scale > current.scale + VARIANT_GAIN;
};
function fitLine(line, avail) {
  line.style.fontSize = "";
  line.classList.remove("is-wrapping", "is-broken", "is-rows");
  line.querySelectorAll(".dv-break").forEach((el) => el.remove());
  line.querySelectorAll(".dv-seg").forEach((seg) => {
    seg.style.marginLeft = "";
  });
  const variants = Array.from(line.children).filter((el) => el.classList.contains("dv-var"));
  if (variants.length) showVariant(line, variants, 0);
  const segs = segmentsOf(variants[0] ?? line);
  const widths = segs.map(widthOf);
  const total = widths.reduce((a, b) => a + b, 0);
  const pad = horizontalPadding(line);
  if (total + pad <= avail + 0.5) return;
  const oneRow = avail / (total + pad);
  const setScale = (value) => {
    const scale2 = Math.floor(value * 1e3) / 1e3;
    if (scale2 < 1) line.style.fontSize = `${scale2}em`;
  };
  if (oneRow >= 0.86) {
    setScale(oneRow);
    return;
  }
  const authored = measuredRows(line, segs, widths, avail);
  let pick = authored && authored.scale >= oneRow ? {
    v: 0,
    segs,
    rows: authored
  } : null;
  let unranked = false;
  if ((pick?.rows.scale ?? oneRow) < 1 && variants.length) {
    for (let v = 1; v < variants.length; v += 1) {
      showVariant(line, variants, v);
      const cut = segmentsOf(variants[v]);
      const rows = measuredRows(line, cut, cut.map(widthOf), avail);
      if (!rows) {
        unranked ||= cut.length > MAX_ROW_SEGMENTS;
        continue;
      }
      if (pick ? variantWins(rows, pick.rows) : rows.scale > oneRow + VARIANT_GAIN) pick = {
        v,
        segs: cut,
        rows
      };
    }
    showVariant(line, variants, pick?.v ?? 0);
  }
  if (unranked && (!pick || pick.v === 0)) {
    line.classList.add("is-wrapping");
    const wrapPad2 = horizontalPadding(line);
    line.classList.remove("is-wrapping");
    if (tryVariants(line, variants, avail, pad, wrapPad2, pick?.rows.scale ?? oneRow)) return;
  }
  if (pick) {
    applyRows(line, pick.segs, pick.rows);
    return;
  }
  if (segs.length < 2) {
    setScale(oneRow);
    return;
  }
  line.classList.add("is-wrapping");
  const wrapPad = horizontalPadding(line);
  const rest = widths.slice(1);
  const need = Math.max(widths[0] + pad, ...rest.map((w) => w + wrapPad));
  const scale = Math.min(1, avail / need);
  if (scale < 1 && variants.length && tryVariants(line, variants, avail, pad, wrapPad, scale)) return;
  setScale(scale);
}
function tryVariants(line, variants, avail, pad, wrapPad, baseline) {
  let best = null;
  for (let v = 1; v < variants.length; v += 1) {
    showVariant(line, variants, v);
    const segs2 = segmentsOf(variants[v]);
    const layout = layoutRows(segs2.map(widthOf), segs2.map((seg, i) => i ? Number(seg.dataset.brk) || 0 : 0), avail, pad, wrapPad, segs2.map((seg, i) => i ? seg.dataset.kind ?? "other" : "start"));
    if (layout.scale > (best?.layout.scale ?? baseline) + VARIANT_GAIN) best = {
      v,
      layout
    };
  }
  if (!best) {
    showVariant(line, variants, 0);
    return false;
  }
  showVariant(line, variants, best.v);
  const segs = segmentsOf(variants[best.v]);
  const rows = best.layout.starts.length > 0;
  line.classList.toggle("is-wrapping", rows);
  line.classList.toggle("is-broken", rows);
  for (const start of best.layout.starts) {
    const brk = document.createElement("span");
    brk.className = "dv-break";
    brk.setAttribute("aria-hidden", "true");
    segs[start].before(brk);
  }
  if (best.layout.scale < 1) line.style.fontSize = `${best.layout.scale}em`;
  return true;
}
var fixedFits = new WeakMap();
var lineKey = (line) => `${line.dataset.line}:${line.classList.contains("is-history")}`;
function fitDerivation(root, compiled, force = false) {
  const width = root.clientWidth;
  if (!width) return;
  const old = fixedFits.get(root);
  if (!force && old?.compiled === compiled && old.width === width) return;
  fixedFits.delete(root);
  delete root.dataset.dvFitLocked;
  const measure = document.createElement("div");
  measure.className = "dv-stage dv-ghost";
  root.appendChild(measure);
  const lines = new Map();
  let scale = 1;
  for (let i = 0; i < compiled.lines.length; i++) for (const history of [false, true]) {
    measure.innerHTML = lineMarkup(compiled, i, history);
    const line = measure.firstElementChild;
    fitLine(line, width);
    scale = Math.min(scale, parseFloat(line.style.fontSize) || 1);
    lines.set(lineKey(line), {
      html: line.innerHTML,
      classes: [
        "is-wrapping",
        "is-broken",
        "is-rows"
      ].filter((c) => line.classList.contains(c)),
      variant: line.dataset.variant
    });
  }
  fixedFits.set(root, {
    compiled,
    width,
    scale,
    lines
  });
  root.dataset.dvScale = String(scale);
  let peak = 0;
  for (let i = 0; i < compiled.lines.length; i++) {
    measure.innerHTML = stateMarkup(compiled, i);
    fitStack(measure);
    peak = Math.max(peak, measure.getBoundingClientRect().height);
  }
  root.dataset.dvWholePeak = String(peak);
  measure.remove();
}
function fitStack(container) {
  const avail = container.clientWidth;
  if (!avail) return;
  const root = container.closest(".dv");
  const fixed = root && fixedFits.get(root);
  const lines = Array.from(container.children).filter((el) => el.classList?.contains("dv-line"));
  for (const line of lines) {
    const plan = fixed?.lines.get(lineKey(line));
    if (!plan || !fixed) {
      fitLine(line, avail);
      continue;
    }
    line.innerHTML = plan.html;
    for (const c of [
      "is-wrapping",
      "is-broken",
      "is-rows"
    ]) line.classList.toggle(c, plan.classes.includes(c));
    if (plan.variant !== void 0) line.dataset.variant = plan.variant;
    line.style.fontSize = `${fixed.scale}em`;
  }
}
var TIMING = {
  move: 820,
  hold: 380,
  emphasis: 640,
  phase: 600,
  maxSpan: 1900,
  grow: 260,
  settle: 200
};
var EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
function easeProgress(u, x1 = 0.65, y1 = 0, x2 = 0.35, y2 = 1) {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  const bz = (t, p1, p2) => 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t;
  let lo = 0, hi = 1;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (bz(mid, x1, x2) < u) lo = mid;
    else hi = mid;
  }
  return bz((lo + hi) / 2, y1, y2);
}
var EASE_OUT = "cubic-bezier(0.2, 0, 0, 1)";
function rectOf(el, origin) {
  const r = el.getBoundingClientRect();
  return {
    x: r.left - origin.left,
    y: r.top - origin.top,
    w: r.width,
    h: r.height
  };
}
function shownPart(line) {
  return line.querySelector(":scope > .dv-var:not([hidden])") ?? line;
}
function findUnit(layer, ref) {
  const line = layer.querySelector(`:scope > .dv-line[data-line="${ref.line}"]`);
  if (!line) return null;
  if (ref.id === "*") return line;
  return shownPart(line).querySelector(`[data-term="${CSS.escape(ref.id)}"]`);
}
function variantsOf(layer) {
  return (state) => Number(layer.querySelector(`:scope > .dv-line[data-line="${state}"]`)?.dataset.variant ?? 0);
}
function pressTiming(timing, totals, settles) {
  const holds = Math.max(0, totals.length - 1);
  const sum = totals.reduce((x, y) => x + y, 0);
  const cost = (f2) => f2 * sum + holds * Math.max(200, timing.hold * f2) + (settles ? Math.max(200, timing.settle * f2) : 0);
  if (cost(1) <= 2500) return timing;
  let lo = 0.15;
  let hi = 1;
  for (let i = 0; i < 24; i += 1) {
    const mid = (lo + hi) / 2;
    if (cost(mid) <= 2500) lo = mid;
    else hi = mid;
  }
  const f = lo;
  return {
    move: timing.move * f,
    phase: timing.phase * f,
    maxSpan: timing.maxSpan * f,
    emphasis: timing.emphasis * f,
    hold: Math.max(200, timing.hold * f),
    grow: Math.min(timing.grow, timing.move * f),
    settle: Math.max(200, timing.settle * f)
  };
}
function lineOpacity(el) {
  const line = el.closest(".dv-line");
  return line ? Number.parseFloat(getComputedStyle(line).opacity) || 1 : 1;
}
function signature(el) {
  const copy = el.cloneNode(true);
  copy.querySelectorAll("[data-term]").forEach((n) => n.replaceChildren());
  return `${ownGlyphMarkup(copy.innerHTML)}|${getComputedStyle(el).color}|${el.getAttribute("data-chunk") ?? ""}`;
}
function ownGlyphMarkup(html) {
  return html.replace(/<([a-z]+)([^>]*?)\sdata-term="[^"]*"([^>]*)>/g, (_, tag, a, b) => `<${tag}${`${a}${b}`.replace(/\sstyle="[^"]*"/g, "")}>`).replace(/\sdata-emph="[^"]*"/g, "");
}
var DELIMS = new Set([
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
  "|",
  "‖",
  "⟨",
  "⟩",
  "⌊",
  "⌋",
  "⌈",
  "⌉",
  "/"
]);
var RULES = ".frac-line, .rule, .katex-rule, .overline-line, .underline-line, .hline";
function inkIdentity(el) {
  if (el.matches(".delimsizing.mult")) return `bigdelim|${(el.textContent ?? "").trim().charAt(0)}|${getComputedStyle(el).color}`;
  if (el instanceof SVGElement || el.matches(RULES)) return `rule|${getComputedStyle(el).color}`;
  const cs = getComputedStyle(el);
  const text = (el.textContent ?? "").trim();
  return `${text}|${DELIMS.has(text) ? "delim" : cs.fontFamily}|${cs.fontStyle}|${cs.fontWeight}|${cs.color}`;
}
function pieceRect(el, origin) {
  if (!el.matches(".delimsizing.mult")) return rectOf(el, origin);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const n of el.querySelectorAll("*")) {
    if (n.closest("svg") && !(n instanceof SVGSVGElement)) continue;
    if (!(n instanceof SVGSVGElement || n.childElementCount === 0 && (n.textContent ?? "").trim() !== "")) continue;
    const r = n.getBoundingClientRect();
    if (r.width < 0.5 || r.height < 0.5) continue;
    x0 = Math.min(x0, r.left);
    y0 = Math.min(y0, r.top);
    x1 = Math.max(x1, r.right);
    y1 = Math.max(y1, r.bottom);
  }
  if (!Number.isFinite(x0)) return rectOf(el, origin);
  return {
    x: x0 - origin.left,
    y: y0 - origin.top,
    w: x1 - x0,
    h: y1 - y0
  };
}
function drawn(el) {
  const cs = getComputedStyle(el);
  for (let p = el; p && !p.classList.contains("dv-line"); p = p.parentElement) if (p.style?.visibility === "hidden" || p.classList?.contains("vlist-s")) return false;
  if (cs.display === "none" || Number.parseFloat(cs.opacity) === 0) return false;
  if (/rgba\([^)]*,\s*0\)$/.test(cs.color) || cs.color === "transparent") return false;
  const r = el.getBoundingClientRect();
  return r.width > 0.5 || r.height > 0.5;
}
function atomicOp(op) {
  return (op.textContent ?? "").trim().length > 1 && !op.querySelector("svg, .vlist, .msupsub, [data-term]") && !op.hasAttribute("data-term");
}
function ownInk(el, keep) {
  const out = [];
  const owned = (n) => {
    for (let p = n; p && p !== el; p = p.parentElement) if (p instanceof HTMLElement && p.hasAttribute("data-term") && !keep?.has(p.dataset.term ?? "")) return false;
    return true;
  };
  for (const n of [el, ...el.querySelectorAll("*")]) {
    if (n.closest("svg") && !(n instanceof SVGSVGElement)) continue;
    const big = n.closest(".delimsizing.mult");
    if (big && big !== n && el.contains(big)) continue;
    if (n.matches(".delimsizing.mult")) {
      if (owned(n) && drawn(n)) out.push(n);
      continue;
    }
    const op = n.closest(".mop");
    if (op && op !== n && el.contains(op) && atomicOp(op)) continue;
    if (n.matches(".mop") && atomicOp(n)) {
      if (owned(n) && drawn(n)) out.push(n);
      continue;
    }
    const isSvg = n instanceof SVGSVGElement;
    const isRule = !isSvg && n.matches(RULES);
    const isText = !isSvg && !isRule && n.childElementCount === 0 && (n.textContent ?? "").replace(/[\s\u200b\u2061-\u2064]/g, "") !== "";
    if (!(isSvg || isRule || isText)) continue;
    if (!owned(n) || !drawn(n)) continue;
    out.push(n);
  }
  return out;
}
function matchInk(a, b, reach, coherence = Number.POSITIVE_INFINITY) {
  const usedA = new Array(a.length).fill(false);
  const usedB = new Array(b.length).fill(false);
  const pairs = [];
  let block = 0;
  const dist = (i, j) => Math.hypot(a[i].x + a[i].w / 2 - b[j].x - b[j].w / 2, a[i].y + a[i].h / 2 - b[j].y - b[j].h / 2);
  const shiftGap = (i0, j0, i1, j1) => Math.hypot(b[j1].x - a[i1].x - (b[j0].x - a[i0].x), b[j1].y - a[i1].y - (b[j0].y - a[i0].y));
  for (; ; ) {
    let best = {
      len: 0,
      i: -1,
      j: -1,
      cost: Number.POSITIVE_INFINITY
    };
    for (let i = 0; i < a.length; i++) {
      if (usedA[i]) continue;
      for (let j = 0; j < b.length; j++) {
        if (usedB[j] || a[i].id !== b[j].id) continue;
        let len = 0;
        let cost = 0;
        while (i + len < a.length && j + len < b.length && !usedA[i + len] && !usedB[j + len] && a[i + len].id === b[j + len].id && (len === 0 || shiftGap(i + len - 1, j + len - 1, i + len, j + len) <= coherence)) {
          cost += dist(i + len, j + len);
          len++;
        }
        const mean = cost / len;
        if (len > best.len || len === best.len && mean < best.cost - 0.01) best = {
          len,
          i,
          j,
          cost: mean
        };
      }
    }
    if (best.len < 2) break;
    for (let k = 0; k < best.len; k++) {
      usedA[best.i + k] = true;
      usedB[best.j + k] = true;
      pairs.push([
        best.i + k,
        best.j + k,
        block
      ]);
    }
    block++;
  }
  const singles = [];
  for (let i = 0; i < a.length; i++) {
    if (usedA[i]) continue;
    for (let j = 0; j < b.length; j++) {
      if (usedB[j] || a[i].id !== b[j].id) continue;
      const d = dist(i, j);
      const dy = Math.abs(a[i].y + a[i].h / 2 - b[j].y - b[j].h / 2);
      if (d <= (a[i].id.startsWith("bigdelim|") ? 4 * reach : reach) && dy <= 0.5 * Math.max(a[i].h, b[j].h, 1)) singles.push([
        d,
        i,
        j
      ]);
    }
  }
  singles.sort((x, y) => x[0] - y[0]);
  for (const [, i, j] of singles) {
    if (usedA[i] || usedB[j]) continue;
    usedA[i] = usedB[j] = true;
    pairs.push([
      i,
      j,
      block++
    ]);
  }
  return pairs;
}
function makeClone(fx, origin, el, keepEmphasis = false, keep, hide) {
  const home = rectOf(el, origin);
  const wrapper = document.createElement("div");
  wrapper.className = "dv-clone katex";
  const body = el.cloneNode(true);
  if (hide?.size) {
    const from = [el, ...el.querySelectorAll("*")];
    const to = [body, ...body.querySelectorAll("*")];
    from.forEach((n, i) => {
      if (hide.has(n)) to[i].style.visibility = "hidden";
    });
  }
  if (!keepEmphasis || !el.closest(".dv-line.is-active")) body.removeAttribute("data-emph");
  body.querySelectorAll("[data-emph]").forEach((n) => n.removeAttribute("data-emph"));
  body.querySelectorAll("[data-term]").forEach((n) => {
    if (!keep?.has(n.dataset.term ?? "")) n.style.visibility = "hidden";
  });
  const cs = getComputedStyle(el);
  body.style.fontSize = cs.fontSize;
  body.style.color = cs.color;
  wrapper.appendChild(body);
  fx.appendChild(wrapper);
  const r0 = body.getBoundingClientRect();
  const ox = r0.left - origin.left;
  const oy = r0.top - origin.top;
  wrapper.style.left = `${home.x - ox}px`;
  wrapper.style.top = `${home.y - oy}px`;
  wrapper.style.transformOrigin = `${ox}px ${oy}px`;
  return {
    wrapper,
    body,
    home
  };
}
function makeInkClone(fx, origin, el) {
  const owner = el.parentElement?.closest("[data-term]") ?? el.closest(".dv-seg") ?? el.parentElement;
  const ownerHome = rectOf(owner, origin);
  const home = pieceRect(el, origin);
  const wrapper = document.createElement("div");
  wrapper.className = "dv-clone katex";
  const body = owner.cloneNode(true);
  const from = [owner, ...owner.querySelectorAll("*")];
  const to = [body, ...body.querySelectorAll("*")];
  body.style.visibility = "hidden";
  body.removeAttribute("data-emph");
  body.removeAttribute("data-chunk");
  body.querySelectorAll("[data-emph],[data-chunk]").forEach((n) => {
    n.removeAttribute("data-emph");
    n.removeAttribute("data-chunk");
  });
  const piece = to[from.indexOf(el)];
  if (piece) piece.style.visibility = "visible";
  const cs = getComputedStyle(owner);
  body.style.fontSize = cs.fontSize;
  body.style.color = cs.color;
  body.style.margin = "0";
  wrapper.appendChild(body);
  fx.appendChild(wrapper);
  const r0 = body.getBoundingClientRect();
  const ox = r0.left - origin.left;
  const oy = r0.top - origin.top;
  wrapper.style.left = `${ownerHome.x - ox}px`;
  wrapper.style.top = `${ownerHome.y - oy}px`;
  wrapper.style.transformOrigin = `${ox + home.x - ownerHome.x}px ${oy + home.y - ownerHome.y}px`;
  return {
    wrapper,
    body,
    home
  };
}
function travelInk(clone2, a, b, path, lift, rule) {
  const { home } = clone2;
  return SAMPLES.map((t) => {
    const r = lerpRect(a, b, t, path, lift);
    const sy = home.h > 0.5 ? r.h / home.h : 1;
    const sx = rule ? home.w > 0.5 ? r.w / home.w : 1 : sy;
    const cx = r.x + r.w / 2 - (home.x + home.w / 2);
    const cy = r.y + r.h / 2 - (home.y + home.h / 2);
    const tx = cx + home.w * (1 - sx) / 2;
    const ty = cy + home.h * (1 - sy) / 2;
    return {
      offset: t,
      transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`
    };
  });
}
function placeAt(home, r) {
  const sx = home.w > 0.5 ? r.w / home.w : 1;
  const sy = home.h > 0.5 ? r.h / home.h : 1;
  return `translate(${(r.x - home.x).toFixed(2)}px, ${(r.y - home.y).toFixed(2)}px) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
}
var smooth = (x) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};
function arcShape(t) {
  return smooth(Math.min(t, 1 - t) / 0.3);
}
function arcSlide(t) {
  return smooth((t - 0.2) / 0.6);
}
function arcRiseAtSlide(edge) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (smooth(mid) < edge) lo = mid;
    else hi = mid;
  }
  return arcShape(0.2 + 0.6 * lo);
}
var ROW_STEP = -1;
function lerpRect(a, b, t, path, lift = 0) {
  if (!path && lift === ROW_STEP) {
    const down = b.y > a.y;
    const py = smooth(down ? t / 0.55 : (t - 0.45) / 0.55);
    const px = smooth(down ? (t - 0.45) / 0.55 : t / 0.55);
    return {
      x: a.x + (b.x - a.x) * px,
      y: a.y + (b.y - a.y) * py,
      w: a.w + (b.w - a.w) * px,
      h: a.h + (b.h - a.h) * px
    };
  }
  if (!path) return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    w: a.w + (b.w - a.w) * t,
    h: a.h + (b.h - a.h) * t
  };
  const p = arcSlide(t);
  const rise = (path === "over" ? -1 : 1) * lift * arcShape(t);
  return {
    x: a.x + (b.x - a.x) * p,
    y: a.y + (b.y - a.y) * p + rise,
    w: a.w + (b.w - a.w) * p,
    h: a.h + (b.h - a.h) * p
  };
}
var SAMPLES = [
  0,
  0.0625,
  0.125,
  0.1875,
  0.25,
  0.3125,
  0.375,
  0.4375,
  0.5,
  0.5625,
  0.625,
  0.6875,
  0.75,
  0.8125,
  0.875,
  0.9375,
  1
];
function copyOpacity(a, b, path, lift, opacity, lineHeight = Math.max(a.h, b.h), obstacles = []) {
  const on = (r, o) => Math.min(r.x + r.w, o.x + o.w) - Math.max(r.x, o.x) > 1 && Math.min(r.y + r.h, o.y + o.h) - Math.max(r.y, o.y) > 1;
  const gap = Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w), b.y - (a.y + a.h), a.y - (b.y + b.h)) >= lineHeight / 2 ? lineHeight / 2 : 0;
  return SAMPLES.map((t) => {
    const r = lerpRect(a, b, t, path, lift);
    const separated = r.x >= a.x + a.w + gap || r.x + r.w <= a.x - gap || r.y >= a.y + a.h + gap || r.y + r.h <= a.y - gap;
    const clear = t === 1 || !obstacles.some((o) => on(inkBox(r, true), o));
    return {
      offset: t,
      opacity: separated && clear ? opacity : 0,
      easing: "steps(1, end)"
    };
  });
}
function keyframeAt(frames, u) {
  for (let i = 1; i < frames.length; i++) {
    const a = frames[i - 1], b = frames[i];
    const ua = Number(a.offset ?? 0), ub = Number(b.offset ?? 1);
    if (u <= ub) return Number(a.opacity) + (Number(b.opacity) - Number(a.opacity)) * (ub > ua ? (u - ua) / (ub - ua) : 1);
  }
  return Number(frames[frames.length - 1].opacity);
}
function peelOpacity(at, source, opacity) {
  const clear = (r) => r.x >= source.x + source.w || r.x + r.w <= source.x || r.y >= source.y + source.h || r.y + r.h <= source.y;
  let t0 = 1;
  for (let i = 0; i <= 32; i++) if (clear(at(i / 32))) {
    t0 = i / 32;
    break;
  }
  t0 = Math.min(t0, 0.85);
  return [
    {
      opacity: 0,
      offset: 0
    },
    {
      opacity: 0,
      offset: t0
    },
    {
      opacity,
      offset: Math.min(1, t0 + 0.15)
    },
    {
      opacity,
      offset: 1
    }
  ];
}
function peelSource(own, run, margin) {
  const x0 = Math.min(own.x, run.x) - margin, y0 = Math.min(own.y, run.y) - margin;
  return {
    x: x0,
    y: y0,
    w: Math.max(own.x + own.w, run.x + run.w) + margin - x0,
    h: Math.max(own.y + own.h, run.y + run.h) + margin - y0
  };
}
function travel(clone2, a, b, path, lift = 0) {
  return SAMPLES.map((t) => ({
    offset: t,
    transform: placeAt(clone2.home, lerpRect(a, b, t, path, lift))
  }));
}
function detourRect(a, b, t, side) {
  const s = smooth(Math.min(t, 1 - t) / 0.25);
  const p = smooth((t - 0.2) / 0.6);
  return {
    x: a.x + (b.x - a.x) * p + side * s,
    y: a.y + (b.y - a.y) * p,
    w: a.w + (b.w - a.w) * p,
    h: a.h + (b.h - a.h) * p
  };
}
function tradeDetours(ms, rooms, margin, minMove) {
  const roomOf = (i) => Array.isArray(rooms) ? rooms[i] : rooms;
  const side = new Array(ms.length).fill(0);
  let short = 0;
  const cy = (r) => r.y + r.h / 2;
  const mid = (m) => ({
    x: (m.a.x + m.b.x) / 2,
    y: (m.a.y + m.b.y) / 2,
    w: (m.a.w + m.b.w) / 2,
    h: (m.a.h + m.b.h) / 2
  });
  for (let i = 0; i < ms.length; i++) for (let j = i + 1; j < ms.length; j++) {
    const p = ms[i], q = ms[j];
    if (Math.abs(cy(p.b) - cy(p.a)) < minMove || Math.abs(cy(q.b) - cy(q.a)) < minMove) continue;
    if ((cy(p.a) - cy(q.a)) * (cy(p.b) - cy(q.b)) >= 0) continue;
    const mp = mid(p), mq = mid(q);
    const over = Math.min(mp.x + mp.w + side[i], mq.x + mq.w + side[j]) - Math.max(mp.x + side[i], mq.x + side[j]);
    if (over <= -margin) continue;
    const need = over + margin;
    const [r, l] = mp.x + mp.w / 2 + side[i] >= mq.x + mq.w / 2 + side[j] ? [i, j] : [j, i];
    const rightRoom = side[r] < 0 ? 0 : Math.max(0, roomOf(r).right - Math.max(ms[r].a.x + ms[r].a.w, ms[r].b.x + ms[r].b.w) - Math.max(0, side[r]));
    const leftRoom = side[l] > 0 ? 0 : Math.max(0, Math.min(ms[l].a.x, ms[l].b.x) + Math.min(0, side[l]) - roomOf(l).left);
    const toRight = Math.min(rightRoom, Math.max(need / 2, need - leftRoom));
    const toLeft = Math.min(leftRoom, need - toRight);
    side[r] += toRight;
    side[l] -= toLeft;
    short = Math.max(short, need - toRight - toLeft);
  }
  return {
    side,
    short
  };
}
function travelDetour(clone2, a, b, side) {
  return SAMPLES.map((t) => ({
    offset: t,
    transform: placeAt(clone2.home, detourRect(a, b, t, side))
  }));
}
function travelInkDetour(clone2, a, b, side, rule) {
  const { home } = clone2;
  return SAMPLES.map((t) => {
    const r = detourRect(a, b, t, side);
    const sy = home.h > 0.5 ? r.h / home.h : 1;
    const sx = rule ? home.w > 0.5 ? r.w / home.w : 1 : sy;
    const tx = r.x + r.w / 2 - (home.x + home.w / 2) + home.w * (1 - sx) / 2;
    const ty = r.y + r.h / 2 - (home.y + home.h / 2) + home.h * (1 - sy) / 2;
    return {
      offset: t,
      transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`
    };
  });
}
function riseRect(a, b, t) {
  const px = smooth(t / 0.55);
  const py = smooth((t - 0.45) / 0.55);
  return {
    x: a.x + (b.x - a.x) * px,
    y: a.y + (b.y - a.y) * py,
    w: a.w + (b.w - a.w) * px,
    h: a.h + (b.h - a.h) * px
  };
}
function travelRise(clone2, a, b) {
  return SAMPLES.map((t) => ({
    offset: t,
    transform: placeAt(clone2.home, riseRect(a, b, t))
  }));
}
function hasOwnInk(el, keep) {
  const copy = el.cloneNode(true);
  copy.querySelectorAll("[data-term]").forEach((n) => {
    if (!keep?.has(n.dataset.term ?? "")) n.remove();
  });
  if ((copy.textContent ?? "").replace(/[\s\u200b\u2061-\u2064]/g, "")) return true;
  return copy.querySelector(".frac-line, svg, .rule, .katex-rule, .overline-line, .underline-line, .hline") !== null;
}
function scaleAbout(home, s, sy = s) {
  return `translate(${(home.w * (1 - s) / 2).toFixed(2)}px, ${(home.h * (1 - sy) / 2).toFixed(2)}px) scale(${s}, ${sy})`;
}
function enterKeyframes(style, clone2, o) {
  if (style === "grow") return {
    el: clone2.wrapper,
    frames: [{
      transform: scaleAbout(clone2.home, 0.25, 0.6),
      opacity: 0
    }, {
      transform: "none",
      opacity: o
    }]
  };
  return {
    el: clone2.wrapper,
    frames: [{ opacity: 0 }, { opacity: o }]
  };
}
function twin(src, body, el) {
  if (el === src) return body;
  const i = [...src.querySelectorAll("*")].indexOf(el);
  return i >= 0 ? body.querySelectorAll("*")[i] ?? null : null;
}
function exitKeyframes(style, clone2, o) {
  if (style === "collapse") return [
    {
      transform: "none",
      opacity: o,
      offset: 0
    },
    {
      transform: scaleAbout(clone2.home, 0.75, 0.92),
      opacity: o * 0.35,
      offset: 0.25
    },
    {
      transform: scaleAbout(clone2.home, 0.45, 0.85),
      opacity: 0,
      offset: 0.45
    },
    {
      transform: scaleAbout(clone2.home, 0.2, 0.8),
      opacity: 0,
      offset: 1
    }
  ];
  const s = Math.max(0.82, 1 - 4 / Math.max(1, clone2.home.w));
  return [{
    transform: "none",
    opacity: o
  }, {
    transform: scaleAbout(clone2.home, s),
    opacity: 0
  }];
}
function ghostLayer(fx, compiled, state) {
  const ghost = document.createElement("div");
  ghost.className = "dv-stage dv-ghost";
  ghost.innerHTML = stateMarkup(compiled, state);
  fx.appendChild(ghost);
  fitStack(ghost);
  return ghost;
}
var SVG_NS = "http://www.w3.org/2000/svg";
function emphasisEffects(fx, origin, kind, el, clone2, delay, timing, animations) {
  const r = rectOf(el, origin);
  const fontSize = Number.parseFloat(getComputedStyle(el).fontSize) || 20;
  if (kind === "indicate") {
    if (!clone2) return;
    clone2.body.style.transformOrigin = "50% 55%";
    animations.push(clone2.body.animate([
      { transform: "none" },
      {
        transform: "scale(1.2)",
        color: "var(--buncher)",
        offset: 0.4
      },
      { transform: "none" }
    ], {
      duration: timing.emphasis,
      delay,
      easing: "ease-in-out"
    }));
    return;
  }
  if (kind === "circumscribe") {
    const off = 0.16 * fontSize;
    const sw = Math.max(1.5, 0.08 * fontSize);
    const pad = off + sw / 2;
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "dv-circumscribe");
    const w = r.w + 2 * pad;
    const h = r.h + 2 * pad;
    svg.setAttribute("width", String(w + sw));
    svg.setAttribute("height", String(h + sw));
    svg.style.left = `${r.x - pad - sw / 2}px`;
    svg.style.top = `${r.y - pad - sw / 2}px`;
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("x", String(sw / 2));
    rect.setAttribute("y", String(sw / 2));
    rect.setAttribute("width", String(w));
    rect.setAttribute("height", String(h));
    rect.setAttribute("rx", String(0.22 * fontSize + off));
    rect.setAttribute("stroke-width", String(sw));
    rect.setAttribute("pathLength", "100");
    rect.style.strokeDasharray = "100";
    rect.style.strokeDashoffset = "100";
    svg.appendChild(rect);
    fx.appendChild(svg);
    animations.push(rect.animate([{ strokeDashoffset: 100 }, { strokeDashoffset: 0 }], {
      duration: timing.emphasis,
      delay,
      easing: "ease-in-out",
      fill: "forwards"
    }));
    return;
  }
  const decor = document.createElement("div");
  decor.className = "dv-decor";
  decor.dataset.decor = kind;
  decor.style.left = `${r.x}px`;
  decor.style.top = `${r.y}px`;
  decor.style.width = `${r.w}px`;
  decor.style.height = `${r.h}px`;
  decor.style.fontSize = `${fontSize}px`;
  decor.style.color = getComputedStyle(el).color;
  fx.appendChild(decor);
  const frames = kind === "cancel" ? [{
    clipPath: "inset(-20% 125% -20% -20%)",
    opacity: 1
  }, {
    clipPath: "inset(-20% -20% -20% -20%)",
    opacity: 1
  }] : [{ opacity: 0 }, { opacity: 1 }];
  animations.push(decor.animate(frames, {
    duration: timing.emphasis * 0.7,
    delay,
    easing: "ease-out",
    fill: "both"
  }));
}
function coverage(a, b) {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  if (w <= 0 || h <= 0) return 0;
  return w * h / Math.max(1, b.w * b.h);
}
function resolveLandings(plan, source, target, origin) {
  if (!plan.phaseCount) return;
  const leavers = [...plan.moves.filter((m) => !m.copy).map((m) => ({
    unit: m,
    ref: m.from,
    to: findUnit(target, m.to)
  })), ...plan.exits.map((e) => ({
    unit: e,
    ref: e.ref,
    to: null
  }))].map((l) => ({
    ...l,
    el: findUnit(source, l.ref)
  })).filter((l) => l.el !== null && l.unit.phase !== null).map((l) => ({
    ...l,
    from: rectOf(l.el, origin),
    dest: l.to ? rectOf(l.to, origin) : null
  })).filter((l) => !l.dest || Math.abs(l.from.x - l.dest.x) + Math.abs(l.from.y - l.dest.y) > 1);
  const landings = plan.moves.map((m) => ({
    m,
    src: findUnit(source, m.from),
    el: findUnit(target, m.to)
  })).filter((x) => x.el !== null).map((x) => ({
    ...x,
    rect: rectOf(x.el, origin)
  }));
  for (let changed = true, guard = 0; changed && guard < 8; guard += 1) {
    changed = false;
    for (const { m, src, rect } of landings) {
      if (m.phase === null) continue;
      for (const l of leavers) {
        if (l.unit === m || (l.unit.phase ?? 0) <= m.phase) continue;
        if (src && (src.contains(l.el) || l.el.contains(src))) continue;
        if (coverage(rect, l.from) > 0.5) {
          const duck = m.path === "over" ? "under" : m.path === "under" ? "over" : null;
          const later = l.unit.phase;
          const mid = (r) => r.x + r.w / 2;
          const from = src ? rectOf(src, origin) : null;
          for (const unit of plan.moves) {
            if (unit.phase !== later) continue;
            const a = findUnit(source, unit.from);
            const b = findUnit(target, unit.to);
            if (duck && from && a && b && !unit.path) {
              if ((mid(rectOf(a, origin)) - mid(from)) * (mid(rectOf(b, origin)) - mid(rect)) < 0) unit.path = duck;
            }
          }
          for (const unit of [
            ...plan.moves,
            ...plan.exits,
            ...plan.enters
          ]) if (unit.phase === later) unit.phase = m.phase;
          changed = true;
        }
      }
    }
  }
}
var keyOf = (ref) => `${ref.line}|${ref.id}`;
function prepare(compiled, source, target, a, b, origin) {
  const plan = planTransition(compiled, a, b, {
    from: variantsOf(source),
    to: variantsOf(target)
  });
  resolveLandings(plan, source, target, origin);
  const shows = (el) => hasOwnInk(el) || el.hasAttribute("data-chunk") || el.hasAttribute("data-emph");
  const moves = [];
  for (const mv of plan.moves) {
    const oldEl = findUnit(source, mv.from);
    const newEl = findUnit(target, mv.to);
    if (!oldEl || !newEl) continue;
    const settledSource = mv.copy && mv.phase !== null && mv.phase > 0 ? findUnit(target, {
      line: mv.to.line,
      id: mv.from.id
    }) : null;
    const O = rectOf(settledSource ?? oldEl, origin);
    const N = rectOf(newEl, origin);
    const oO = lineOpacity(oldEl);
    const oN = lineOpacity(newEl);
    const morph = signature(oldEl) !== signature(newEl);
    const visible = (Math.abs(O.x - N.x) + Math.abs(O.y - N.y) > 0.75 || Math.abs(O.w - N.w) + Math.abs(O.h - N.h) > 0.75 || morph || Math.abs(oO - oN) > 0.01) && (shows(oldEl) || shows(newEl));
    const nudge = Math.max(8, 0.35 * Math.max(O.h, N.h));
    const significant = visible && (morph || Math.abs(oO - oN) > 0.01 || Math.hypot(O.x - N.x, O.y - N.y) > nudge || Math.max(Math.abs(O.w - N.w), Math.abs(O.h - N.h)) > nudge);
    moves.push({
      mv,
      oldEl,
      newEl,
      settledSource,
      O,
      N,
      oO,
      oN,
      morph,
      visible,
      significant
    });
  }
  const exits = plan.exits.map((ex) => ({
    ex,
    el: findUnit(source, ex.ref)
  })).filter((x) => x.el !== null);
  const enters = plan.enters.map((en) => ({
    en,
    el: findUnit(target, en.ref)
  })).filter((x) => x.el !== null);
  const live = new Set();
  for (const m of moves) if (m.significant && m.mv.phase !== null) live.add(m.mv.phase);
  for (const { ex, el } of exits) if (ex.phase !== null && shows(el)) live.add(ex.phase);
  for (const { en, el } of enters) if (en.phase !== null && shows(el)) live.add(en.phase);
  const renumber = new Map([...live].sort((x, y) => x - y).map((p, i) => [p, i]));
  const remap = (p) => p === null ? null : renumber.get(p) ?? null;
  for (const m of moves) m.mv.phase = remap(m.mv.phase);
  for (const { ex } of exits) ex.phase = remap(ex.phase);
  for (const { en } of enters) en.phase = remap(en.phase);
  const still = !exits.some((x) => shows(x.el)) && !enters.some((x) => shows(x.el)) && !moves.some((m) => m.visible);
  return {
    plan,
    origin,
    moves,
    exits,
    enters,
    phaseCount: renumber.size,
    still,
    duration: compiled.spec.states[b]?.duration
  };
}
function motionSpan(n, still, timing, duration) {
  return still ? 0 : duration !== void 0 ? duration * timing.move / TIMING.move : n ? n * Math.min(timing.phase, timing.maxSpan / n) : timing.move;
}
function spanOfPrepared(prep, timing) {
  const span = motionSpan(prep.phaseCount, prep.still, timing, prep.duration);
  return {
    span,
    total: span + (prep.plan.emphasis.length ? timing.emphasis : 0)
  };
}
var INK_GAP = 0.01;
function inkWindows(span, has = {
  out: true,
  in: true,
  move: true
}) {
  const out = has.out ?? true;
  const inn = has.in ?? true;
  const move = has.move ?? true;
  const exitEnd = inn ? 0.36 : move ? 0.4 : 0.7;
  const enterStart = out ? exitEnd + Math.min(INK_GAP, 50 / Math.max(1, span)) : move ? 0.62 : 0;
  const moveStart = out ? 0.14 : 0;
  const moveEnd = inn ? out ? 0.86 : 0.62 : 1;
  const w = (a, b) => ({
    delay: span * a,
    duration: Math.max(1, span * (b - a))
  });
  return {
    exit: w(0, exitEnd),
    move: w(moveStart, moveEnd),
    enter: w(enterStart, 1)
  };
}
function reflowSlots(lanes) {
  const present = new Set(lanes);
  const order = [
    1,
    0,
    -1
  ].filter((l) => present.has(l));
  return {
    count: order.length,
    slot: (lane) => Math.max(0, order.indexOf(lane))
  };
}
function unitRow(el) {
  const segment = el.closest(".dv-seg");
  if (!segment) return 0;
  let row = 0;
  for (let sibling = segment.previousElementSibling; sibling; sibling = sibling.previousElementSibling) if (sibling.classList.contains("dv-break")) row++;
  return row;
}
function rowCount(layer) {
  const line = layer.querySelector(".dv-line.is-active");
  if (!line) return 0;
  return 1 + shownPart(line).querySelectorAll(".dv-break").length;
}
function historyLifts(prep) {
  if (!prep.plan.persistLines.length || !prep.moves.some((job) => job.mv.copy)) return false;
  return prep.moves.some((job) => prep.plan.persistLines.includes(job.mv.from.line) && job.mv.from.id === job.mv.to.id && Math.abs(job.N.y - job.O.y) > 1);
}
function reflowSlotCount(prep, source, target) {
  const { pre, rise } = reflowSplit(prep, source, target);
  return pre + (rise ? 1 : 0);
}
function splitReflow(lanes, resolves2) {
  const all = [...lanes];
  const rise = resolves2 && all.includes(-1);
  const before = rise ? all.filter((l) => l !== -1) : all;
  return {
    pre: before.length ? reflowSlots(before).count : 0,
    rise
  };
}
function reflowSplit(prep, source, target) {
  if (historyLifts(prep)) return {
    pre: 1,
    rise: false
  };
  if (rowCount(source) === rowCount(target)) return {
    pre: 0,
    rise: false
  };
  const lanes = [];
  for (const job of prep.moves) {
    if (job.mv.copy || prep.plan.persistLines.includes(job.mv.from.line)) continue;
    const d = unitRow(job.newEl) - unitRow(job.oldEl);
    lanes.push(d > 0 ? 1 : d < 0 ? -1 : 0);
  }
  const { pre, rise } = splitReflow(lanes, resolves(prep));
  return {
    pre: rise ? pre : Math.max(1, pre),
    rise
  };
}
function resolves(prep) {
  const persists = new Set(prep.plan.persistLines);
  return prep.moves.some((j) => j.morph && j.visible && !persists.has(j.mv.from.line)) || prep.exits.some((x) => !persists.has(x.ex.ref.line));
}
function risers(prep) {
  const persists = new Set(prep.plan.persistLines);
  return new Set(prep.moves.filter((j) => !j.mv.copy && !j.morph && !persists.has(j.mv.from.line) && unitRow(j.newEl) < unitRow(j.oldEl)));
}
function reflowOld(fx, prep, slotMs, animations, deferRise = false) {
  const persists = new Set(prep.plan.persistLines);
  const lift = historyLifts(prep);
  const shifts = new Map();
  const groupShift = new Map();
  const groupOf = (job) => {
    const seg = job.oldEl.closest(".dv-seg");
    const segs = seg ? [...seg.parentElement?.children ?? []].indexOf(seg) : -1;
    return `${job.mv.from.line}|${segs}|${unitRow(job.newEl)}`;
  };
  const jobs = prep.moves.filter((job) => {
    if (job.mv.copy) return false;
    return lift ? persists.has(job.mv.from.line) && job.mv.from.id === job.mv.to.id : !persists.has(job.mv.from.line);
  });
  for (const morphing2 of [false, true]) for (const job of jobs) {
    if (job.morph !== morphing2 || unitRow(job.newEl) === unitRow(job.oldEl)) continue;
    const g = groupOf(job);
    if (!groupShift.has(g)) groupShift.set(g, {
      x: job.N.x - job.O.x,
      y: job.N.y - job.O.y
    });
  }
  const morphing = jobs.filter((job) => job.morph).map((job) => job.oldEl);
  const landsOnMorph = (job) => {
    const D = inkBox({
      ...job.O,
      x: job.N.x,
      y: job.N.y
    }, true);
    return jobs.some((m) => {
      if (!m.morph || m === job || m.oldEl.contains(job.oldEl) || job.oldEl.contains(m.oldEl)) return false;
      const o = inkBox(m.O, true);
      const w = Math.min(D.x + D.w, o.x + o.w) - Math.max(D.x, o.x);
      const h = Math.min(D.y + D.h, o.y + o.h) - Math.max(D.y, o.y);
      return w > 0.15 * D.w && h > 0.3 * Math.min(D.h, o.h);
    });
  };
  for (const job of jobs) {
    if (shifts.has(job.oldEl)) continue;
    const d = unitRow(job.newEl) - unitRow(job.oldEl);
    const lane = d > 0 ? 1 : d < 0 ? -1 : 0;
    if (lane === 0 && morphing.some((m) => m !== job.oldEl && m.contains(job.oldEl))) continue;
    if (lane === 0 && landsOnMorph(job)) continue;
    if (lane === -1 && deferRise) continue;
    const group = lane !== 0 ? groupShift.get(groupOf(job)) : void 0;
    const x = group ? group.x : !job.morph ? job.N.x - job.O.x : 0;
    shifts.set(job.oldEl, {
      x,
      y: group ? group.y : job.N.y - job.O.y,
      lane
    });
  }
  const movers = [...shifts.keys()];
  for (const { el } of lift ? [] : prep.exits) {
    if (shifts.has(el)) continue;
    let p = el.parentElement?.closest("[data-term]");
    while (p && !shifts.has(p)) p = p.parentElement?.closest("[data-term]");
    if (p) continue;
    const seg = el.closest(".dv-seg");
    const r = rectOf(el, prep.origin);
    let best = null;
    let bestD = Number.POSITIVE_INFINITY;
    for (const m of movers) {
      if (m.closest(".dv-seg") !== seg || m.contains(el) || el.contains(m)) continue;
      const q = rectOf(m, prep.origin);
      const d = Math.max(0, q.x - (r.x + r.w), r.x - (q.x + q.w)) + Math.abs(q.y + q.h / 2 - (r.y + r.h / 2)) * 0.5;
      if (d < bestD) {
        bestD = d;
        best = m;
      }
    }
    if (best) shifts.set(el, shifts.get(best));
  }
  const { slot } = reflowSlots([...shifts.values()].map((s) => s.lane));
  const clones = [];
  const layer = prep.moves[0]?.oldEl.closest(".dv-stage") ?? null;
  const standing = layer ? inkMap(layer, prep.origin) : [];
  const fxTop = fx.getBoundingClientRect().top;
  const prevEl = fx.closest(".dv")?.parentElement?.previousElementSibling;
  const em = Number.parseFloat(getComputedStyle(layer?.querySelector(".dv-line.is-active") ?? fx).fontSize) || 18;
  const slideOver = (el, O, D, sh) => {
    if (Math.abs(sh.x) < em || Math.abs(sh.y) > 0.5 * O.h) return null;
    const others = standing.filter((x) => {
      if (el.contains(x.el)) return false;
      for (const [m, t] of shifts) if (m.contains(x.el) && Math.hypot(t.x - sh.x, t.y - sh.y) < 0.5 * em) return false;
      return true;
    }).flatMap((x) => {
      let t;
      for (const [m, v] of shifts) if (m.contains(x.el)) t = v;
      return t ? [x.r, {
        ...x.r,
        x: x.r.x + t.x,
        y: x.r.y + t.y
      }] : [x.r];
    });
    const bounds = {
      top: prevEl ? Math.max(-2 * em, prevEl.getBoundingClientRect().bottom - fxTop + 4) : -0.6 * em,
      bottom: Number.POSITIVE_INFINITY
    };
    const p = arcPlan(inkBox(O, true), inkBox(D, true), others, sh.x < 0 ? "over" : "under", em, bounds);
    return p.crosses ? p : null;
  };
  const own = new Map();
  for (const [el, s] of shifts) {
    let p = el.parentElement?.closest("[data-term]");
    while (p && !shifts.has(p)) p = p.parentElement?.closest("[data-term]");
    const ps = p ? shifts.get(p) : void 0;
    if (!ps || Math.abs(ps.x - s.x) + Math.abs(ps.y - s.y) > 0.5 || ps.lane !== s.lane) own.set(el, s);
  }
  for (const [el, s] of own) {
    const keep = new Set();
    el.querySelectorAll("[data-term]").forEach((d) => {
      let p = d;
      while (p && p !== el && !own.has(p)) p = p.parentElement?.closest("[data-term]") ?? null;
      if (p === el) keep.add(d.dataset.term ?? "");
    });
    const c = makeClone(fx, prep.origin, el, true, keep);
    clones.push(c);
    c.wrapper.style.opacity = String(lineOpacity(el));
    const O = rectOf(el, prep.origin);
    const k = slot(s.lane);
    const D = {
      ...O,
      x: O.x + s.x,
      y: O.y + s.y
    };
    const corner = s.lane > 0 ? {
      ...O,
      y: D.y
    } : s.lane < 0 ? {
      ...O,
      x: D.x
    } : null;
    const slide = corner ? null : slideOver(el, O, D, s);
    const frames = corner ? [
      {
        offset: 0,
        transform: placeAt(c.home, O)
      },
      {
        offset: 0.5,
        transform: placeAt(c.home, corner)
      },
      {
        offset: 1,
        transform: placeAt(c.home, D)
      }
    ] : travel(c, O, D, slide?.path ?? null, slide?.lift ?? 0);
    animations.push(c.wrapper.animate(frames, {
      delay: k * slotMs,
      duration: slotMs,
      easing: EASE,
      fill: "both"
    }));
  }
  const moving = (el) => {
    for (let p = el; p; p = p.parentElement?.closest("[data-term]") ?? null) if (own.has(p)) return true;
    return false;
  };
  const stills = new Set();
  for (const job of prep.moves) if (!moving(job.oldEl)) stills.add(job.oldEl);
  for (const { el } of prep.exits) if (!moving(el)) stills.add(el);
  const leaving = new Set(lift ? prep.exits.map((x) => x.el) : []);
  for (const el of stills) {
    const c = makeClone(fx, prep.origin, el, true);
    clones.push(c);
    if (leaving.has(el)) animations.push(c.wrapper.animate([{ opacity: lineOpacity(el) }, { opacity: 0 }], {
      duration: slotMs,
      easing: "ease-in",
      fill: "both"
    }));
    else c.wrapper.style.opacity = String(lineOpacity(el));
  }
  return () => {
    for (const [el, shift] of shifts) {
      let parent = el.parentElement;
      while (parent && !shifts.has(parent)) parent = parent.parentElement;
      const inherited = parent ? shifts.get(parent) : {
        x: 0,
        y: 0
      };
      el.style.transform = `translate(${shift.x - inherited.x}px, ${shift.y - inherited.y}px)`;
      el.style.display = "inline-block";
    }
    for (const el of leaving) el.style.visibility = "hidden";
    clones.forEach((c) => c.wrapper.remove());
  };
}
function poolsExit(line, from, persists) {
  return line === from && !persists.has(line);
}
function vacateWindow(arcWin, crossAt) {
  const end = crossAt ?? arcWin.delay + arcWin.duration / 2;
  return {
    delay: arcWin.delay,
    duration: Math.max(1, Math.min(arcWin.duration, end - arcWin.delay))
  };
}
function handoverOut(o) {
  return [
    {
      opacity: o,
      offset: 0
    },
    {
      opacity: 0.5 * o,
      offset: 0.86
    },
    {
      opacity: 0.25 * o,
      offset: 0.93
    },
    {
      opacity: 0,
      offset: 1
    }
  ];
}
function handoverIn(o, duration) {
  const k = Math.min(0.4, 40 / Math.max(1, duration));
  return [
    {
      opacity: 0,
      offset: 0
    },
    {
      opacity: 0.6 * o,
      offset: k
    },
    {
      opacity: o,
      offset: 1
    }
  ];
}
function handoverEnd(exitEnd, firstIn) {
  return firstIn - exitEnd > 80 ? firstIn - 40 : exitEnd;
}
function pairBraces(items) {
  const opens = new Set([..."([{⟨⌊⌈⎧⎨⎩⎛⎜⎝⎡⎢⎣"]);
  const closes = new Set([...")]}⟩⌋⌉⎫⎬⎭⎞⎟⎠⎤⎥⎦"]);
  const twin2 = new Map();
  for (const o of items.filter((x) => opens.has(x.ch))) for (const c of items.filter((x) => closes.has(x.ch) && !twin2.has(x.k) && x.line === o.line && x.b.x > o.b.x).sort((x, y) => x.b.x - y.b.x)) if (Math.min(o.b.y + o.b.h, c.b.y + c.b.h) - Math.max(o.b.y, c.b.y) > 0.8 * Math.max(o.b.h, c.b.h)) {
    twin2.set(o.k, c.k);
    twin2.set(c.k, o.k);
    break;
  }
  return twin2;
}
function fadesWhole(line, enterLines, movedInto) {
  return enterLines.includes(line) && !movedInto.includes(line);
}
function newLineWindow(fresh, dimStarts, span) {
  return {
    delay: fresh || !dimStarts.length ? 0 : Math.min(...dimStarts),
    duration: Math.max(1, 0.6 * span)
  };
}
function insertionWindows(span, on) {
  const D = on ? 0.35 * span : 0;
  const k = on ? (span - D) / span : 1;
  return {
    on,
    open: {
      delay: 0,
      duration: Math.max(1, D)
    },
    after: (w) => on ? {
      delay: D + w.delay * k,
      duration: Math.max(1, w.duration * k)
    } : w
  };
}
function runEnds(a, b, pairs) {
  const usedA = new Set(pairs.map((p) => p[0]));
  const usedB = new Set(pairs.map((p) => p[1]));
  const byBlock = new Map();
  for (const [i, j, k] of pairs) byBlock.set(k, [...byBlock.get(k) ?? [], [i, j]]);
  const glyph = (id) => !id.startsWith("rule|") && !id.startsWith("bigdelim|");
  const side = (id) => /^[([{]$/.test(id.split("|")[0]) ? 1 : /^[)\]}|]$/.test(id.split("|")[0]) ? -1 : 0;
  const sameBase = (x, y) => x.split("|")[0] === y.split("|")[0];
  const out = [];
  for (const [k, list] of byBlock) {
    if (list.length < 2) continue;
    list.sort((x, y) => x[0] - y[0]);
    const [i0, j0] = list[0];
    const [i1, j1] = list[list.length - 1];
    const dx = b[j0].x - a[i0].x, dy = b[j0].y - a[i0].y;
    for (const [i, j] of [[i0 - 1, j0 - 1], [i1 + 1, j1 + 1]]) {
      if (i < 0 || j < 0 || i >= a.length || j >= b.length || usedA.has(i) || usedB.has(j)) continue;
      if (!glyph(a[i].id) || !glyph(b[j].id) || a[i].id === b[j].id || side(a[i].id) !== side(b[j].id) || !side(a[i].id) && sameBase(a[i].id, b[j].id)) continue;
      const ratio = b[j].h / Math.max(1, a[i].h);
      if (ratio < 0.6 || ratio > 1.6) continue;
      const tol = Math.max(a[i].h, b[j].h);
      if (Math.abs(b[j].x - a[i].x - dx) > tol || Math.abs(b[j].y - a[i].y - dy) > 0.5 * tol) continue;
      usedA.add(i);
      usedB.add(j);
      out.push([
        i,
        j,
        k
      ]);
    }
  }
  return out;
}
function runRiders(b, pairs, runs, em) {
  const usedB = new Set(pairs.map((p) => p[1]));
  const byBlock = new Map();
  for (const [, j, k] of pairs) if (runs.has(k)) byBlock.set(k, [...byBlock.get(k) ?? [], j]);
  const best = new Map();
  const cy = (r) => r.y + r.h / 2;
  for (const [k, js] of byBlock) {
    js.sort((x, y) => x - y);
    for (const [start, step] of [[js[js.length - 1], 1], [js[0], -1]]) {
      let edge = b[start];
      const cap = Math.min(3, js.length);
      for (let j = start + step, n = 0; j >= 0 && j < b.length && n < cap; j += step, n++) {
        if (usedB.has(j)) break;
        const x = b[j];
        if (x.line !== b[start].line || x.id.startsWith("rule|") || x.id.startsWith("bigdelim|")) break;
        if (Math.abs(cy(x) - cy(edge)) > 0.8 * em) break;
        if ((step > 0 ? x.x - (edge.x + edge.w) : edge.x - (x.x + x.w)) > 0.8 * em) break;
        const d = step > 0 ? x.x - (b[start].x + b[start].w) : b[start].x - (x.x + x.w);
        const had = best.get(j);
        if (!had || d < had[1]) best.set(j, [k, d]);
        edge = x;
      }
    }
  }
  return [...best.entries()].map(([j, [k]]) => [j, k]).sort((x, y) => x[0] - y[0]);
}
function delimitersWait(pieces, wins) {
  const opens = new Set([
    "(",
    "[",
    "{",
    "⟨",
    "|"
  ]), closes = new Set([
    ")",
    "]",
    "}",
    "⟩"
  ]);
  const content = (i) => !opens.has(pieces[i].text) && !closes.has(pieces[i].text);
  return wins.map((w, i) => {
    if (!pieces[i].rest) return w;
    const step = closes.has(pieces[i].text) ? -1 : opens.has(pieces[i].text) ? 1 : 0;
    if (!step) return w;
    for (let j = i + step; j >= 0 && j < pieces.length; j += step) if (content(j)) return wins[j].delay > w.delay ? {
      delay: wins[j].delay,
      duration: w.duration
    } : w;
    return w;
  });
}
function dropOrder(ds) {
  const on = (x, y) => Math.min(x.x + x.w, y.x + y.w) - Math.max(x.x, y.x) > 1 && Math.min(x.y + x.h, y.y + y.h) - Math.max(x.y, y.y) > 1;
  const level = ds.map(() => 0);
  for (let round = 0; round < ds.length; round++) {
    let changed = false;
    ds.forEach((d, i) => ds.forEach((e, j) => {
      if (i !== j && on(d.b, e.a) && !on(e.b, d.a) && level[i] <= level[j]) {
        level[i] = level[j] + 1;
        changed = true;
      }
    }));
    if (!changed) break;
  }
  return level;
}
function inkBox(r, text) {
  return text ? {
    x: r.x,
    y: r.y + 0.18 * r.h,
    w: r.w,
    h: 0.64 * r.h
  } : r;
}
function inkExtent(el, origin) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const n of el.querySelectorAll("*")) {
    if (n.closest("svg") && !(n instanceof SVGSVGElement)) continue;
    const text = n.childElementCount === 0 && (n.textContent ?? "").replace(/[\s\u200b\u2061-\u2064]/g, "") !== "";
    if (!(text || n instanceof SVGSVGElement || n.matches(RULES))) continue;
    const r0 = rectOf(n, origin);
    if (r0.w < 0.5 && r0.h < 0.5) continue;
    const r = inkBox(r0, text);
    x0 = Math.min(x0, r.x);
    y0 = Math.min(y0, r.y);
    x1 = Math.max(x1, r.x + r.w);
    y1 = Math.max(y1, r.y + r.h);
  }
  return Number.isFinite(x0) ? {
    x: x0,
    y: y0,
    w: x1 - x0,
    h: y1 - y0
  } : inkBox(rectOf(el, origin), true);
}
function inkMap(layer, origin) {
  const out = [];
  layer.querySelectorAll(":scope > .dv-line").forEach((line) => {
    shownPart(line).querySelectorAll("*").forEach((n) => {
      if (n.closest("svg") && !(n instanceof SVGSVGElement)) return;
      const text = n.childElementCount === 0 && (n.textContent ?? "").replace(/[\s\u200b\u2061-\u2064]/g, "") !== "";
      if (!(text || n instanceof SVGSVGElement || n.matches(RULES))) return;
      const r = rectOf(n, origin);
      if (r.w < 0.5 && r.h < 0.5) return;
      out.push({
        el: n,
        r: inkBox(r, text)
      });
    });
  });
  return out;
}
function passSides(bs, minMove) {
  const n = bs.length;
  const cx = (r) => r.x + r.w / 2;
  const cy = (r) => r.y + r.h / 2;
  const band = (x) => [Math.min(x.a.y, x.b.y), Math.max(x.a.y + x.a.h, x.b.y + x.b.h)];
  const passes = (i, j) => {
    const p = bs[i], q = bs[j];
    if (Math.abs(cx(p.b) - cx(p.a)) < minMove && Math.abs(cx(q.b) - cx(q.a)) < minMove) return false;
    const [p0, p1] = band(p), [q0, q1] = band(q);
    if (Math.min(p1, q1) - Math.max(p0, q0) <= 0) return false;
    return Math.sign(cx(p.a) - cx(q.a)) !== Math.sign(cx(p.b) - cx(q.b));
  };
  const nb = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (passes(i, j)) {
    nb[i].push(j);
    nb[j].push(i);
  }
  const group = Array.from({ length: n }, (_, i) => i);
  const find = (i) => group[i] === i ? i : group[i] = find(group[i]);
  for (let i = 0; i < n; i++) for (const j of nb[i]) group[find(i)] = find(j);
  const side = new Array(n).fill(void 0);
  const order = [...Array(n).keys()].filter((i) => nb[i].length).sort((i, j) => Math.abs(cx(bs[j].b) - cx(bs[j].a)) - Math.abs(cx(bs[i].b) - cx(bs[i].a)));
  for (const i of order) {
    const taken = new Set(nb[i].map((j) => side[j]).filter((s) => !!s));
    if (taken.has("over") && taken.has("under")) {
      side[i] = null;
      continue;
    }
    if (taken.has("over")) {
      side[i] = "under";
      continue;
    }
    if (taken.has("under")) {
      side[i] = "over";
      continue;
    }
    const mine = cy(bs[i].a);
    const others = nb[i].map((j) => cy(bs[j].a));
    side[i] = others.every((y) => mine < y - 2) ? "over" : others.every((y) => mine > y + 2) ? "under" : cx(bs[i].b) < cx(bs[i].a) ? "over" : "under";
  }
  return {
    side,
    group: group.map((_, i) => find(i))
  };
}
var MIN_LIFT_EM = 0.35;
function arcPlan(a, b, others, path, em, bounds, fixed = false) {
  let crosses = false;
  const x0 = Math.min(a.x, b.x);
  const x1 = Math.max(a.x + a.w, b.x + b.w);
  const top = Math.min(a.y, b.y);
  const bottom = Math.max(a.y + a.h, b.y + b.h);
  const across = others.filter((r) => r.x < x1 && r.x + r.w > x0);
  const least = Math.max(MIN_LIFT_EM * em, 0.5 * Math.max(a.h, b.h));
  const margin = 0.15 * em;
  let needOver = least;
  let needUnder = least;
  const dx = b.x - a.x;
  for (const r of across) {
    if (r.y >= bottom || r.y + r.h <= top) continue;
    let t0 = 0;
    let t1 = 1;
    if (Math.abs(dx) > 0.5) {
      const ta = (r.x - (a.x + a.w)) / dx;
      const tb = (r.x + r.w - a.x) / dx;
      t0 = Math.max(0, Math.min(ta, tb));
      t1 = Math.min(1, Math.max(ta, tb));
    }
    if (t1 <= t0) continue;
    const g = Math.max(0.3, arcRiseAtSlide(Math.min(t0, 1 - t1, 0.5)));
    crosses = true;
    const ay = a.y + (b.y - a.y) * ((t0 + t1) / 2);
    const ah = a.h + (b.h - a.h) * ((t0 + t1) / 2);
    needOver = Math.max(needOver, (ay + ah - r.y + margin) / g);
    needUnder = Math.max(needUnder, (r.y + r.h - ay + margin) / g);
  }
  let roomOver = top - bounds.top;
  let roomUnder = bounds.bottom - bottom;
  for (const r of across) {
    if (r.y + r.h <= top + 1) roomOver = Math.min(roomOver, top - (r.y + r.h));
    if (r.y >= bottom - 1) roomUnder = Math.min(roomUnder, r.y - bottom);
  }
  roomOver = Math.max(0, roomOver - 2);
  roomUnder = Math.max(0, roomUnder - 2);
  const fits = (p) => p === "over" ? needOver <= roomOver : needUnder <= roomUnder;
  const other = path === "over" ? "under" : "over";
  let side = path;
  if (fixed) side = path;
  else if (!fits(path) && fits(other)) side = other;
  else if (!fits(path) && !fits(other)) {
    const ratio = (p) => p === "over" ? roomOver / needOver : roomUnder / needUnder;
    side = ratio(other) > ratio(path) + 0.15 ? other : path;
  }
  return {
    path: side,
    lift: Math.max(0, Math.min(side === "over" ? needOver : needUnder, Math.max(side === "over" ? roomOver : roomUnder, least))),
    crosses
  };
}
function animateOne(fx, prep, target, source, timing, animations, grow = () => {
}, rise = 0) {
  const { plan, origin } = prep;
  const created = [];
  const newClones = new Map();
  const n = prep.phaseCount;
  const { span } = spanOfPrepared(prep, timing);
  const opts = (w, easing = EASE) => ({
    ...w,
    easing,
    fill: "both"
  });
  const fresh = plan.from === -1 || !source.querySelector(".dv-line");
  const jobs = [];
  const order = new Map();
  let index = 0;
  target.querySelectorAll(":scope > .dv-line").forEach((lineEl) => {
    shownPart(lineEl).querySelectorAll("[data-term]").forEach((el) => order.set(`${lineEl.dataset.line ?? ""}|${el.dataset.term}`, index++));
  });
  const persists = new Set(plan.persistLines);
  const retained = (job) => persists.has(job.mv.from.line) && job.mv.from.line === job.mv.to.line && job.mv.from.id === job.mv.to.id;
  const byOld = new Map(prep.moves.map((job) => [job.oldEl, job]));
  const byNew = new Map(prep.moves.map((job) => [job.newEl, job]));
  const exitEls = new Set(prep.exits.map((x) => x.el));
  const enterEls = new Set(prep.enters.map((x) => x.el));
  const keepOld = new Map();
  const keepNew = new Map();
  const absorber = (el, byEl, loose) => {
    for (let p = el.parentElement?.closest("[data-term]"); p; p = p.parentElement?.closest("[data-term]")) {
      const job = byEl.get(p);
      if (job) return job.morph && job.visible ? job : null;
      if (!loose.has(p)) return null;
    }
    return null;
  };
  const absorbedExits = new Set();
  for (const { ex, el } of prep.exits) {
    if (ex.style !== "fade" || el.hasAttribute("data-emph")) continue;
    const job = absorber(el, byOld, exitEls);
    if (!job) continue;
    absorbedExits.add(el);
    if (!keepOld.has(job)) keepOld.set(job, new Set());
    keepOld.get(job)?.add(el.dataset.term ?? "");
  }
  const absorbedEnters = new Set();
  const writePhase = new Map();
  for (const { en, el } of prep.enters) {
    if (en.style === "grow" || en.style === "replace") continue;
    const job = absorber(el, byNew, enterEls);
    if (!job) continue;
    absorbedEnters.add(el);
    if (en.phase !== null && job.mv.phase === null) writePhase.set(job, Math.min(en.phase, writePhase.get(job) ?? Infinity));
    if (!keepNew.has(job)) keepNew.set(job, new Set());
    keepNew.get(job)?.add(el.dataset.term ?? "");
  }
  const rising = rise > 0 ? risers(prep) : new Set();
  const sorted = [...prep.moves].sort((m, k) => (order.get(keyOf(m.mv.to)) ?? 0) - (order.get(keyOf(k.mv.to)) ?? 0));
  const claimants = new Map();
  for (const job of sorted) {
    const { mv } = job;
    if (mv.from.line === mv.to.line && mv.from.id === mv.to.id) continue;
    const k = keyOf(mv.from);
    claimants.set(k, [...claimants.get(k) ?? [], job]);
  }
  const carrier = new Set();
  const reach = (job) => job.settledSource ? Number.POSITIVE_INFINITY : job.mv.to.id === job.mv.from.id ? -1 : Math.hypot(job.O.x - job.N.x, job.O.y - job.N.y);
  for (const list of claimants.values()) {
    if (persists.has(list[0].mv.from.line)) continue;
    let near = list[0];
    for (const job of list) if (reach(job) < reach(near) - 0.5) near = job;
    carrier.add(near);
  }
  const isCopy = (job) => {
    const { mv } = job;
    if (mv.from.line === mv.to.line && mv.from.id === mv.to.id) return false;
    return claimants.has(keyOf(mv.from)) && !carrier.has(job);
  };
  const copyOf = (job) => isCopy(job) || job.settledSource !== null;
  const oldPieces = [];
  const newPieces = [];
  const morphs = sorted.filter((job) => job.visible && job.morph);
  for (const job of morphs) {
    const copy = copyOf(job);
    for (const el of ownInk(job.oldEl, keepOld.get(job))) oldPieces.push({
      el,
      r: pieceRect(el, origin),
      id: inkIdentity(el),
      op: job.oO,
      phase: job.mv.phase,
      job,
      copy
    });
    for (const el of ownInk(job.newEl, keepNew.get(job))) newPieces.push({
      el,
      r: pieceRect(el, origin),
      id: inkIdentity(el),
      op: job.oN,
      phase: job.mv.phase,
      job,
      copy
    });
  }
  const wholeExits = new Set();
  if (!fresh) {
    for (const { ex, el } of prep.exits) {
      if (absorbedExits.has(el) || ex.style !== "fade" && ex.style !== "collapse" || el.hasAttribute("data-emph")) continue;
      if (!poolsExit(ex.ref.line, plan.from, persists)) {
        wholeExits.add(el);
        continue;
      }
      const op = lineOpacity(el);
      for (const g of ownInk(el)) oldPieces.push({
        el: g,
        r: pieceRect(g, origin),
        id: inkIdentity(g),
        op,
        phase: ex.phase,
        job: null,
        copy: false
      });
    }
    for (const { en, el } of prep.enters) {
      if (absorbedEnters.has(el) || en.style === "replace") continue;
      const op = lineOpacity(el);
      for (const g of ownInk(el)) newPieces.push({
        el: g,
        r: pieceRect(g, origin),
        id: inkIdentity(g),
        op,
        phase: en.phase,
        job: null,
        copy: false
      });
    }
  }
  const before = (x, y) => x === y ? 0 : x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  const ordered = (pieces) => {
    const groups = new Map();
    for (const p of pieces) {
      const key = p.job ?? p.el.parentElement?.closest("[data-term]") ?? p.el;
      groups.set(key, [...groups.get(key) ?? [], p]);
    }
    const lists = [...groups.values()].map((list) => list.sort((x, y) => before(x.el, y.el)));
    lists.sort((x, y) => before(x[0].el, y[0].el) || 0);
    return lists.flat();
  };
  oldPieces.splice(0, oldPieces.length, ...ordered(oldPieces));
  newPieces.splice(0, newPieces.length, ...ordered(newPieces));
  const lineEm = Number.parseFloat(getComputedStyle(target.querySelector(".dv-line.is-active") ?? target).fontSize) || 18;
  const pairs = matchInk(oldPieces.map((p) => ({
    id: p.id,
    ...p.r
  })), newPieces.map((p) => ({
    id: p.id,
    ...p.r
  })), 4 * lineEm, 0.5 * lineEm).map(([i, j, k]) => [
    oldPieces[i],
    newPieces[j],
    k
  ]);
  const shared = pairs.filter(([o]) => !o.copy).length;
  if (shared && shared === pairs.length && shared <= 4 && shared < 0.2 * newPieces.length && shared < 0.5 * oldPieces.length) pairs.length = 0;
  const swapNew = new Set();
  const riderNew = new Set();
  const copyRider = new Set();
  const runRidersList = [];
  {
    const ia = new Map(oldPieces.map((p, i) => [p, i]));
    const jb = new Map(newPieces.map((p, j) => [p, j]));
    const triples = pairs.map(([o, nw, k]) => [
      ia.get(o),
      jb.get(nw),
      k
    ]);
    for (const [i, j, k] of runEnds(oldPieces.map((p) => ({
      id: p.id,
      ...p.r
    })), newPieces.map((p) => ({
      id: p.id,
      ...p.r
    })), triples)) {
      if (oldPieces[i].copy) continue;
      pairs.push([
        oldPieces[i],
        newPieces[j],
        k
      ]);
      swapNew.add(newPieces[j].el);
    }
    const tr = pairs.map(([o, nw, k]) => [
      ia.get(o),
      jb.get(nw),
      k
    ]);
    const runKs = new Set();
    for (const [o, nw, k] of pairs) if (!o.id.startsWith("rule|") && !o.id.startsWith("bigdelim|") && Math.hypot(nw.r.x - o.r.x, nw.r.y - o.r.y) > 0.5 * lineEm) runKs.add(k);
    for (const [j, k] of runRiders(newPieces.map((p) => ({
      id: p.id,
      ...p.r,
      line: p.el.closest(".dv-line")
    })), tr, runKs, lineEm)) {
      const [o0, n0] = pairs.find(([o, nw2, kk]) => kk === k && !o.id.startsWith("rule|") && !o.id.startsWith("bigdelim|") && Math.hypot(nw2.r.x - o.r.x, nw2.r.y - o.r.y) > 0.5 * lineEm);
      const nw = newPieces[j];
      const r = {
        ...nw.r,
        x: nw.r.x - (n0.r.x - o0.r.x),
        y: nw.r.y - (n0.r.y - o0.r.y)
      };
      if (!o0.copy) riderNew.add(nw.el);
      else copyRider.add(nw.el);
      runRidersList.push([
        {
          ...o0,
          r,
          id: nw.id
        },
        nw,
        k
      ]);
    }
  }
  const hidden = new Set();
  for (const [o, nw] of pairs) {
    if (!o.copy) hidden.add(o.el);
    hidden.add(nw.el);
  }
  const matchedOld = new Set(pairs.map(([o]) => o.el));
  const blockOfNew = new Map(pairs.map(([, nw, k]) => [nw.el, k]));
  const matchedNew = new Set(pairs.map(([, nw]) => nw.el));
  const blocks = new Map();
  const union = (x, y) => {
    const x0 = Math.min(x.x, y.x), y0 = Math.min(x.y, y.y);
    return {
      x: x0,
      y: y0,
      w: Math.max(x.x + x.w, y.x + y.w) - x0,
      h: Math.max(x.y + x.h, y.y + y.h) - y0
    };
  };
  const tight = (p) => inkBox(p.r, !p.id.startsWith("rule|") && !p.id.startsWith("bigdelim|"));
  for (const [o, nw, k] of pairs) {
    const bl = blocks.get(k);
    if (!bl) blocks.set(k, {
      a: tight(o),
      b: tight(nw),
      olds: [o.el],
      news: [nw.el]
    });
    else {
      bl.a = union(bl.a, tight(o));
      bl.b = union(bl.b, tight(nw));
      bl.olds.push(o.el);
      bl.news.push(nw.el);
    }
  }
  const outLeft = oldPieces.some((p) => !matchedOld.has(p.el) && !p.copy) || wholeExits.size > 0 || prep.exits.some((x) => x.el.hasAttribute("data-emph") || x.ex.style === "vacate");
  const inLeft = newPieces.some((p) => !matchedNew.has(p.el)) || prep.enters.some((x) => x.en.style === "replace") || fresh;
  const anyMove = prep.moves.some((m) => m.significant) || pairs.length > 0;
  const P = n ? span / n : span;
  const phaseOut = new Set();
  const phaseIn = new Set();
  for (const p of oldPieces) if (!matchedOld.has(p.el)) phaseOut.add(p.phase);
  for (const p of newPieces) if (!matchedNew.has(p.el)) phaseIn.add(p.phase);
  for (const { ex, el } of prep.exits) if (el.hasAttribute("data-emph") || ex.style === "vacate") phaseOut.add(ex.phase);
  const dropsDown = (a, b) => b.y + b.h / 2 - (a.y + a.h / 2) > Math.max(0.8 * lineEm, 0.4 * Math.max(a.h, b.h));
  const dropUnits = new Set(sorted.filter((j) => !j.morph && j.significant && !copyOf(j) && !retained(j) && dropsDown(inkBox(j.O, true), inkBox(j.N, true))));
  const copyPairBlocks = new Set(pairs.filter(([o]) => o.copy).map(([, , k]) => k));
  const isTall = (k) => pairs.every(([, nw, kk]) => kk !== k || nw.id.startsWith("bigdelim|"));
  const dropBlocks = new Set([...blocks.keys()].filter((k) => !copyPairBlocks.has(k) && !isTall(k) && dropsDown(blocks.get(k).a, blocks.get(k).b)));
  const vacated = [...[...dropUnits].map((j) => inkBox(j.O, true)), ...[...dropBlocks].map((k) => blocks.get(k).a)];
  const arrivals = [
    ...[...blocks.entries()].filter(([k]) => !dropBlocks.has(k)).map(([, bl]) => bl.b),
    ...newPieces.filter((p) => !matchedNew.has(p.el)).map((p) => inkBox(p.r, true)),
    ...sorted.filter((j) => j.significant && !dropUnits.has(j) && !j.morph).map((j) => inkBox(j.N, true))
  ];
  const hit = (x, y) => Math.min(x.x + x.w, y.x + y.w) - Math.max(x.x, y.x) > 1 && Math.min(x.y + x.h, y.y + y.h) - Math.max(x.y, y.y) > 0.3 * Math.min(x.h, y.h);
  const landed = [...[...dropUnits].map((j) => inkBox(j.N, true)), ...[...dropBlocks].map((k) => blocks.get(k).b)];
  const risesFrom = [...sorted.filter((j) => !j.morph && j.significant && !copyOf(j) && dropsDown(inkBox(j.N, true), inkBox(j.O, true))).map((j) => inkBox(j.O, true)), ...[...blocks.values()].filter((bl) => dropsDown(bl.b, bl.a)).map((bl) => bl.a)];
  const trades = landed.some((l) => risesFrom.some((r) => hit(l, r)));
  const insertion = insertionWindows(span, pairs.some(([o, nw]) => nw.id.startsWith("bigdelim|") && nw.r.h - o.r.h > 0.5 * lineEm) && !trades && vacated.some((v) => arrivals.some((a) => hit(v, a))));
  const win = (phase, kind) => insertion.after(win0(phase, kind));
  for (const rd of runRidersList.filter(([o]) => insertion.on || o.copy)) {
    const [, nw, k] = rd;
    pairs.push(rd);
    hidden.add(nw.el);
    matchedNew.add(nw.el);
    blockOfNew.set(nw.el, k);
    blocks.get(k).news.push(nw.el);
  }
  const droppers = [...[...dropUnits].map((j) => ({
    key: j,
    a: inkBox(j.O, true),
    b: inkBox(j.N, true)
  })), ...[...dropBlocks].map((k) => ({
    key: k,
    a: blocks.get(k).a,
    b: blocks.get(k).b
  }))];
  const dropLevel = dropOrder(droppers.map((d) => ({
    a: d.a,
    b: d.b
  })));
  const dropTop = Math.max(0, ...dropLevel);
  const openWin = (key) => {
    const i = droppers.findIndex((d) => d.key === key);
    const L = i < 0 ? 0 : dropLevel[i];
    const seg = insertion.open.duration / (dropTop + 1);
    return {
      delay: L * seg,
      duration: Math.max(1, seg)
    };
  };
  const writeInsOnly = n > 1 && prep.moves.every((m) => m.mv.phase === null) && prep.enters.length > 0;
  const win0 = (phase, kind) => {
    if (!n) return inkWindows(span, {
      out: outLeft,
      in: inLeft,
      move: anyMove
    })[kind];
    if (phase === null) {
      if (kind === "move") return writeInsOnly ? {
        delay: 0,
        duration: P
      } : {
        delay: 0,
        duration: span
      };
      if (kind === "exit") return {
        delay: 0,
        duration: 0.4 * P
      };
      return {
        delay: (n - 1 + 0.6) * P,
        duration: 0.4 * P
      };
    }
    if (writeInsOnly && kind === "enter") return {
      delay: (0.6 + 0.45 * phase) * P,
      duration: 0.4 * P
    };
    const w = inkWindows(P, {
      out: phaseOut.has(phase),
      in: phaseIn.has(phase) || kind === "enter",
      move: true
    })[kind];
    return {
      delay: phase * P + w.delay,
      duration: w.duration
    };
  };
  const windowOf = (job) => {
    const w = win(job.mv.phase, "move");
    const list = claimants.get(keyOf(job.mv.from)) ?? [];
    if (list.length < 2 || job.mv.phase !== null) return w;
    const step = w.duration * 0.35 / (list.length - 1);
    return {
      delay: w.delay + list.indexOf(job) * step,
      duration: w.duration - (list.length - 1) * step
    };
  };
  const inkBoth = [...inkMap(source, origin), ...inkMap(target, origin)];
  const fxBox = fx.getBoundingClientRect();
  const slot = fx.closest(".dv")?.parentElement;
  const prevEl = slot?.previousElementSibling;
  const nextEl = slot?.nextElementSibling;
  const bounds = {
    top: prevEl ? Math.max(-2 * lineEm, prevEl.getBoundingClientRect().bottom - fxBox.top + 4) : -0.6 * lineEm,
    bottom: 0
  };
  const freeBottom = nextEl ? Math.min(fxBox.height + 2 * lineEm, nextEl.getBoundingClientRect().top - fxBox.top - 4) : fxBox.height + 0.6 * lineEm;
  bounds.bottom = freeBottom + 2 * lineEm;
  const arcs = new Map();
  const ducks = new Set();
  const duckOf = new Map();
  const band = (a, b) => {
    return [Math.min(a.y, b.y), Math.max(a.y + a.h, b.y + b.h)];
  };
  const pairLift = (mine, theirs, theirLift) => {
    const [a0, a1] = band(...mine);
    const [b0, b1] = band(...theirs);
    return Math.min(a1, b1) - Math.max(a0, b0) + 0.15 * lineEm - theirLift;
  };
  const roomBeyond = (job, side) => {
    const y0 = Math.min(job.O.y, job.N.y), y1 = Math.max(job.O.y + job.O.h, job.N.y + job.N.h);
    const x0 = Math.min(job.O.x, job.N.x), x1 = Math.max(job.O.x + job.O.w, job.N.x + job.N.w);
    const lines = [job.oldEl.closest(".dv-line"), job.newEl.closest(".dv-line")];
    const near = inkBoth.filter((x) => (!lines.includes(x.el.closest(".dv-line")) || x.r.y >= y1 + 0.25 * lineEm || x.r.y + x.r.h <= y0 - 0.25 * lineEm) && !job.oldEl.contains(x.el) && !job.newEl.contains(x.el) && x.r.w > 0.5 && x.r.x < x1 && x.r.x + x.r.w > x0).map((x) => x.r);
    return {
      y0,
      y1,
      near,
      room: side === "over" ? y0 - Math.max(-Infinity, ...near.filter((r) => r.y + r.h <= y0 + 1).map((r) => r.y + r.h)) : Math.min(Infinity, ...near.filter((r) => r.y >= y1 - 1).map((r) => r.y)) - y1
    };
  };
  const slideArc = (job) => {
    const none = {
      path: null,
      lift: 0
    };
    if (job.morph || !job.significant || retained(job) || copyOf(job) || rising.has(job)) return none;
    const dx = job.N.x - job.O.x;
    if (Math.abs(dx) < lineEm || Math.abs(job.N.y - job.O.y) > 0.5 * Math.max(job.O.h, job.N.h)) return none;
    for (let p2 = job.oldEl.parentElement?.closest("[data-term]"); p2; p2 = p2.parentElement?.closest("[data-term]")) if (byOld.get(p2)?.significant) return arcFor(byOld.get(p2));
    const others = inkBoth.filter((x) => {
      if (job.oldEl.contains(x.el) || job.newEl.contains(x.el)) return false;
      const ln = x.el.closest(".dv-line");
      if (ln !== job.oldEl.closest(".dv-line") && ln !== job.newEl.closest(".dv-line")) return false;
      const old = source.contains(x.el);
      if (old && prep.exits.some((e) => e.el.contains(x.el))) return false;
      let owner = null;
      for (const m of prep.moves) if ((m.oldEl.contains(x.el) || m.newEl.contains(x.el)) && (!owner || owner.oldEl.contains(m.oldEl))) owner = m;
      const entering = prep.enters.filter((e) => e.el.contains(x.el)).map((e) => e.el);
      if (!old && entering.some((e) => !owner || owner.newEl.contains(e))) return false;
      if (old && owner?.morph && owner.visible) return false;
      return !(owner && owner.significant && !owner.morph);
    }).map((x) => x.r);
    const em = Number.parseFloat(getComputedStyle(job.newEl.closest(".dv-line")).fontSize) || 16;
    const p = arcPlan(inkBox(job.O, true), inkBox(job.N, true), others, dx < 0 ? "over" : "under", em, bounds);
    if (!p.crosses) return none;
    const { y0, y1, near, room } = roomBeyond(job, p.path);
    if (room - 2 < p.lift) {
      const q = arcPlan(inkBox(job.O, true), inkBox(job.N, true), [...others, ...near.filter((r) => r.y + r.h <= y0 + 1 || r.y >= y1 - 1)], p.path, em, bounds, true);
      return {
        path: q.path,
        lift: Math.min(q.lift, Math.max(0, room - 2))
      };
    }
    return {
      path: p.path,
      lift: p.lift
    };
  };
  const arcFor = (job) => {
    const hit2 = arcs.get(job);
    if (hit2) return hit2;
    if (!job.mv.path) {
      const plan3 = slideArc(job);
      arcs.set(job, plan3);
      return plan3;
    }
    for (let p = job.oldEl.parentElement?.closest("[data-term]"); p; p = p.parentElement?.closest("[data-term]")) {
      const parent = byOld.get(p);
      if (parent && job.mv.phase !== null && job.mv.phase !== parent.mv.phase) break;
      if (parent && parent.mv.path && parent.visible) {
        const plan3 = arcFor(parent);
        arcs.set(job, plan3);
        return plan3;
      }
      if (parent && !parent.mv.path && parent.visible && arcFor(parent).path) {
        const plan3 = arcFor(parent);
        arcs.set(job, plan3);
        return plan3;
      }
    }
    const mine = (el) => job.oldEl.contains(el) || job.newEl.contains(el);
    const fellow = (el) => prep.moves.some((m) => m.mv.path && m.mv.phase === job.mv.phase && (m.oldEl.contains(el) || m.newEl.contains(el)) && m.visible);
    const others = inkBoth.filter((x) => !mine(x.el) && !fellow(x.el)).map((x) => x.r);
    const em = Number.parseFloat(getComputedStyle(job.newEl.closest(".dv-line")).fontSize) || 16;
    const jdx = job.N.x - job.O.x;
    const partnered = prep.moves.some((m) => m !== job && m.visible && m.significant && m.mv.path && m.mv.path !== job.mv.path && m.mv.phase === job.mv.phase && (m.N.x - m.O.x) * jdx < 0 && !ducks.has(m));
    let plan2 = arcPlan(inkBox(job.O, true), inkBox(job.N, true), others, job.mv.path, em, bounds, ducks.has(job) || partnered);
    if (partnered && !ducks.has(job) && plan2.path && roomBeyond(job, plan2.path).room - 2 < plan2.lift) plan2 = arcPlan(inkBox(job.O, true), inkBox(job.N, true), others, job.mv.path, em, bounds, false);
    const passed = duckOf.get(job);
    if (passed) {
      const theirs = arcFor(passed);
      const need = pairLift([inkExtent(job.oldEl, origin), inkExtent(job.newEl, origin)], [inkExtent(passed.oldEl, origin), inkExtent(passed.newEl, origin)], theirs.lift);
      if (need > plan2.lift) plan2.lift = need;
    }
    arcs.set(job, plan2);
    return plan2;
  };
  const passer = (job) => !job.mv.path && arcFor(job).path !== null;
  const lineInk = new Map();
  const sourceLineInk = (line) => {
    const key = String(line);
    if (!lineInk.has(key)) lineInk.set(key, inkMap(source, origin).filter((x) => x.el.closest(".dv-line")?.dataset.line === key).map((x) => x.r));
    return lineInk.get(key);
  };
  const leaveTallFirst = (src, c, w) => {
    for (const g of ownInk(src)) {
      if (!g.matches(".delimsizing.mult") || matchedOld.has(g)) continue;
      const node = twin(src, c.body, g);
      if (node) animations.push(node.animate([{ opacity: 1 }, { opacity: 0 }], {
        delay: w.delay,
        duration: Math.max(1, Math.min(w.duration, 0.15 * span)),
        easing: "ease-out",
        fill: "both"
      }));
    }
  };
  const moveWins = sorted.filter((j) => j.mv.path && j.significant).map((j) => windowOf(j));
  const arcWin = moveWins.length ? moveWins.reduce((x, y) => y.delay < x.delay ? y : x) : null;
  const crossTime = (vacated2) => {
    const mover = sorted.find((j) => j.mv.path && j.significant && arcWin && windowOf(j).delay === arcWin.delay);
    if (!mover || !arcWin) return null;
    const v = rectOf(vacated2, origin);
    const O = inkBox(mover.O, true), N = inkBox(mover.N, true);
    const dir = Math.sign(N.x - O.x);
    if (!dir) return null;
    const line = vacated2.closest(".dv-line");
    const gapL = dir < 0 ? v.x + v.w : O.x + O.w, gapR = dir < 0 ? O.x : v.x;
    const signs = inkMap(source, origin).filter((x) => x.el.closest(".dv-line") === line && !vacated2.contains(x.el) && !mover.oldEl.contains(x.el) && x.r.x >= gapL - 1 && x.r.x + x.r.w <= gapR + 1);
    if (!signs.length) return null;
    const sign = signs.reduce((a, b) => Math.abs((dir < 0 ? b.r.x : b.r.x + b.r.w) - (dir < 0 ? gapL : gapR)) < Math.abs((dir < 0 ? a.r.x : a.r.x + a.r.w) - (dir < 0 ? gapL : gapR)) ? b : a).r;
    const { path, lift } = arcFor(mover);
    for (let i = 0; i <= 64; i++) {
      const u = i / 64;
      const r = lerpRect(O, N, easeProgress(u), path, lift);
      if (dir < 0 ? r.x <= sign.x : r.x + r.w >= sign.x + sign.w) return arcWin.delay + u * arcWin.duration;
    }
    return null;
  };
  for (const { ex, el } of prep.exits) {
    if (absorbedExits.has(el)) continue;
    jobs.push(() => {
      const c = makeClone(fx, origin, el, true, void 0, hidden);
      created.push(c);
      const w = ex.style === "vacate" ? arcWin ? vacateWindow(arcWin, crossTime(el)) : win(ex.phase, "exit") : win(ex.phase, "exit");
      animations.push(c.wrapper.animate(exitKeyframes(ex.style === "vacate" ? "fade" : ex.style, c, lineOpacity(el)), opts(w, ex.style === "vacate" ? "linear" : "ease-out")));
      leaveTallFirst(el, c, w);
    });
  }
  for (const job of sorted) {
    if (!job.visible && !isCopy(job)) {
      jobs.push(() => {
        const c = makeClone(fx, origin, job.newEl);
        c.wrapper.style.opacity = String(job.oN);
        created.push(c);
        newClones.set(keyOf(job.mv.to), c);
      });
      continue;
    }
    jobs.push(() => {
      const { mv, O, N, oO, oN } = job;
      const { path, lift } = arcFor(job);
      const copy = copyOf(job);
      if (!job.morph) {
        const lead = unitWindow(job);
        const c2 = makeClone(fx, origin, job.newEl);
        created.push(c2);
        newClones.set(keyOf(mv.to), c2);
        const aside = rising.has(job) ? 0 : unitDetour(job);
        animations.push(c2.wrapper.animate(rising.has(job) ? travelRise(c2, O, N) : aside ? travelDetour(c2, O, N, aside) : travel(c2, O, N, path, lift), opts(lead)));
        const fade = copy ? c2.wrapper.animate(copyOpacity(O, N, path, lift, oN, 4, sourceLineInk(mv.from.line)), opts(lead)) : c2.wrapper.animate([{ opacity: oO }, { opacity: oN }], opts(lead));
        animations.push(fade);
        return;
      }
      const old = makeClone(fx, origin, job.oldEl, false, keepOld.get(job), hidden);
      const c = makeClone(fx, origin, job.newEl, false, keepNew.get(job), hidden);
      created.push(old, c);
      newClones.set(keyOf(mv.to), c);
      const rest = newPieces.filter((p) => p.job === job && !matchedNew.has(p.el));
      const starts = delimitersWait(newPieces.filter((p) => p.job === job).map((p) => ({
        text: (p.el.textContent ?? "").trim(),
        rest: !matchedNew.has(p.el)
      })), newPieces.filter((p) => p.job === job).map((p) => {
        if (!matchedNew.has(p.el)) return clearAfter([tight(p)], win(writePhase.get(job) ?? mv.phase, "enter"));
        const bw = blockWin(blockOfNew.get(p.el));
        return {
          delay: bw.delay + 0.5 * bw.duration,
          duration: bw.duration
        };
      })).filter((_, i) => !matchedNew.has(newPieces.filter((p) => p.job === job)[i].el));
      c.wrapper.style.opacity = String(oN);
      rest.forEach((p, i) => {
        const node = twin(job.newEl, c.body, p.el);
        if (node) animations.push(node.animate(handoverIn(1, starts[i].duration), opts(starts[i], "linear")));
      });
      const ew = win(mv.phase, "exit");
      const oldRest = oldPieces.filter((p) => p.job === job && !matchedOld.has(p.el)).map(tight);
      const hold = copy ? 0 : handoverDelay(ew, starts.map((w) => w.delay), oldRest);
      const out = {
        delay: ew.delay + hold,
        duration: ew.duration
      };
      if (copy) animations.push(old.wrapper.animate([{ opacity: 0 }, { opacity: 0 }], opts(out)));
      else if (!sweptBetween(oldRest, out.delay, out.delay + out.duration)) animations.push(old.wrapper.animate(handoverOut(oO), opts(out, "linear")));
      else animations.push(old.wrapper.animate([{ opacity: oO }, { opacity: 0 }], opts(goneBefore(oldRest, out), "ease-out")));
      if (!copy) leaveTallFirst(job.oldEl, old, out);
    });
  }
  const enters = [...prep.enters].sort((m, k) => (order.get(keyOf(m.en.ref)) ?? 0) - (order.get(keyOf(k.en.ref)) ?? 0));
  const wholeLine = (line) => fresh || fadesWhole(line, plan.enterLines, prep.moves.map((m) => m.mv.to.line));
  const lineWins = new Map();
  const lineWin = (line) => {
    const hit2 = lineWins.get(line);
    if (hit2) return hit2;
    const w0 = newLineWindow(fresh, sorted.filter((j) => retained(j) && j.visible).map((j) => unitWindow(j).delay), span);
    const w = fresh ? w0 : clearAfter(prep.enters.filter((x) => x.en.ref.line === line).map((x) => inkExtent(x.el, origin)), w0);
    lineWins.set(line, w);
    return w;
  };
  for (const { en, el } of enters) {
    if (absorbedEnters.has(el)) continue;
    jobs.push(() => {
      const c = makeClone(fx, origin, el, false, void 0, hidden);
      created.push(c);
      newClones.set(keyOf(en.ref), c);
      const o = lineOpacity(el);
      if (wholeLine(en.ref.line) || en.style === "grow" || en.style === "replace") {
        const { el: animEl, frames } = enterKeyframes(en.style === "grow" && !wholeLine(en.ref.line) ? "grow" : "fade", c, o);
        const w = wholeLine(en.ref.line) ? lineWin(en.ref.line) : clearAfter([inkExtent(el, origin)], win(en.phase, "enter"));
        animations.push(animEl.animate(frames, opts(w, "ease-out")));
        return;
      }
      c.wrapper.style.opacity = String(o);
      for (const g of ownInk(el)) {
        if (hidden.has(g)) continue;
        const node = twin(el, c.body, g);
        if (!node) continue;
        const w = clearAfter([inkBox(pieceRect(g, origin), !(g instanceof SVGElement) && !g.matches(RULES) && !g.matches(".delimsizing.mult"))], win(en.phase, "enter"));
        animations.push(node.animate(handoverIn(1, w.duration), opts(w, "linear")));
      }
    });
  }
  const ids = [...blocks.keys()];
  const overlaps = (x, y) => {
    const w = Math.min(x.x + x.w, y.x + y.w) - Math.max(x.x, y.x);
    const h = Math.min(x.y + x.h, y.y + y.h) - Math.max(x.y, y.y);
    return w > 0 && h > 0 && w * h / Math.max(1, Math.min(x.w * x.h, y.w * y.h)) > 0.15;
  };
  const moved = (k) => {
    const bl = blocks.get(k);
    return Math.hypot(bl.b.x - bl.a.x, bl.b.y - bl.a.y) > 1;
  };
  const copyBlocks = new Set(pairs.filter(([o]) => o.copy).map(([, , k]) => k));
  const tallOnly = (k) => pairs.every(([, nw, kk]) => kk !== k || nw.id.startsWith("bigdelim|"));
  const deps = new Map(ids.map((k) => [k, moved(k) && !tallOnly(k) ? ids.filter((j) => j !== k && moved(j) && !copyBlocks.has(j) && !tallOnly(j) && overlaps(blocks.get(k).b, blocks.get(j).a)) : []]));
  const leadUnits = new Set();
  const unitSwap = new Map();
  const waitsForUnit = new Set();
  const waitsOn = new Map();
  for (const job of sorted) {
    if (job.morph || !job.significant || job.mv.path || copyOf(job) || retained(job) || passer(job)) continue;
    const from = inkBox(job.O, true);
    for (const k of ids) {
      const bl = blocks.get(k);
      if (bl.olds.some((el) => job.oldEl.contains(el))) continue;
      if (overlaps(bl.b, from) && !overlaps(bl.b, inkBox(job.N, true))) {
        if (overlaps(inkBox(job.N, true), bl.a)) {
          unitSwap.set(k, job);
          job.mv.path = "over";
          arcs.delete(job);
          ducks.add(job);
          continue;
        }
        leadUnits.add(job);
        waitsForUnit.add(k);
        waitsOn.set(k, [...waitsOn.get(k) ?? [], job]);
      }
    }
  }
  for (let grew = true; grew; ) {
    grew = false;
    for (const job of sorted) {
      if (leadUnits.has(job) || job.morph || !job.significant || job.mv.path || copyOf(job) || retained(job) || passer(job)) continue;
      const from = inkBox(job.O, true);
      for (const lead of leadUnits) {
        if (lead.oldEl.contains(job.oldEl)) {
          leadUnits.add(job);
          grew = true;
          break;
        }
        if (job.oldEl.contains(lead.oldEl)) continue;
        const sameStep2 = Math.abs(lead.N.x - lead.O.x - (job.N.x - job.O.x)) < 1.5 && Math.abs(lead.N.y - lead.O.y - (job.N.y - job.O.y)) < 1.5;
        const sameRow = Math.min(lead.O.y + lead.O.h, job.O.y + job.O.h) - Math.max(lead.O.y, job.O.y) > 0.3 * Math.min(lead.O.h, job.O.h);
        if (overlaps(inkBox(lead.N, true), from) || sameStep2 && sameRow) {
          leadUnits.add(job);
          grew = true;
          break;
        }
      }
    }
  }
  const rowChange = (k) => {
    const bl = blocks.get(k);
    return Math.abs(bl.b.y + bl.b.h / 2 - bl.a.y - bl.a.h / 2) > Math.max(lineEm, 0.6 * Math.max(bl.a.h, bl.b.h));
  };
  const braceOnly = (k) => pairs.every(([, nw, kk]) => kk !== k || nw.id.startsWith("bigdelim|"));
  const sameRowIds = ids.filter((k) => moved(k) && !rowChange(k) && !braceOnly(k));
  const pass = passSides(sameRowIds.map((k) => blocks.get(k)), 0.3 * lineEm);
  const sideOf = new Map();
  const passGroup = new Map();
  sameRowIds.forEach((k, i) => {
    if (pass.side[i] !== void 0) sideOf.set(k, pass.side[i]);
    passGroup.set(k, pass.group[i]);
  });
  const partnersOf = (k) => sideOf.has(k) ? sameRowIds.filter((j) => j !== k && sideOf.has(j) && passGroup.get(j) === passGroup.get(k)) : [];
  const level = new Map(ids.map((k) => [k, waitsForUnit.has(k) ? 1 : 0]));
  for (let round = 0; round < ids.length; round++) {
    let changed = false;
    for (const k of ids) {
      const group = partnersOf(k);
      const need = Math.max(waitsForUnit.has(k) ? 1 : 0, ...group.map((j) => level.get(j)), ...deps.get(k).filter((j) => !group.includes(j)).map((j) => level.get(j) + 1));
      const capped = Math.min(need, 2);
      if (capped !== level.get(k)) {
        level.set(k, capped);
        changed = true;
      }
    }
    if (!changed) break;
  }
  {
    const top = Math.min(2, Math.max(0, ...level.values()) + 1);
    for (const [, nw, k] of pairs) if (nw.id.startsWith("bigdelim|") && Math.abs(blocks.get(k).b.x - blocks.get(k).a.x) > 0.5 * lineEm && blocks.get(k).news.length === 1) level.set(k, top);
  }
  const followUnits = new Set();
  const movers = sorted.some((j) => j.mv.path && j.significant) ? [] : sorted.filter((j) => !j.morph && j.significant && !j.mv.path && !retained(j) && !passer(j));
  for (const j of movers) for (const k of movers) {
    if (j === k || j.oldEl.contains(k.oldEl) || k.oldEl.contains(j.oldEl) || j.newEl.contains(k.newEl) || k.newEl.contains(j.newEl)) continue;
    if (copyOf(k) && k.mv.from.id === j.mv.from.id) continue;
    if (overlaps(inkBox(j.N, true), inkBox(k.O, true)) && !overlaps(inkBox(j.N, true), inkBox(k.N, true))) {
      followUnits.add(j);
      leadUnits.add(k);
    }
  }
  for (const j of followUnits) leadUnits.delete(j);
  for (const j of movers) for (const f of [...followUnits]) if (f.oldEl.contains(j.oldEl) && j !== f) followUnits.add(j);
  const sameStep = (x, y) => Math.abs(x.N.x - x.O.x - (y.N.x - y.O.x)) < 1.5 && Math.abs(x.N.y - x.O.y - (y.N.y - y.O.y)) < 1.5 && Math.min(x.O.y + x.O.h, y.O.y + y.O.h) - Math.max(x.O.y, y.O.y) > 0.3 * Math.min(x.O.h, y.O.h);
  for (let grew = true; grew; ) {
    grew = false;
    for (const f of [...followUnits]) for (const j of sorted) {
      if (followUnits.has(j) || j.morph || !j.significant || j.mv.path || copyOf(j) || retained(j) || passer(j) || !sameStep(f, j)) continue;
      followUnits.add(j);
      grew = true;
    }
  }
  for (const [k, js] of waitsOn) if (js.some((j) => followUnits.has(j))) level.set(k, Math.max(level.get(k), 2));
  for (let round = 0; round < ids.length; round++) {
    let changed = false;
    for (const k of ids) {
      const need = Math.min(3, Math.max(level.get(k), ...deps.get(k).filter((j) => !partnersOf(k).includes(j)).map((j) => level.get(j) + 1)));
      if (need !== level.get(k)) {
        level.set(k, need);
        changed = true;
      }
    }
    if (!changed) break;
  }
  const levels = Math.max(followUnits.size ? 2 : 1, Math.max(0, ...level.values()) + 1);
  const blockWindow = (k, w) => {
    if (levels < 2) return w;
    const seg = Math.min(w.duration, w.duration / levels * 1.3);
    const L = k === -1 ? 0 : k === -2 ? 1 : level.get(k);
    return {
      delay: w.delay + L * (w.duration - seg) / (levels - 1),
      duration: seg
    };
  };
  const unitWindow = (job) => {
    if (rising.has(job)) return {
      delay: span,
      duration: rise
    };
    if (insertion.on && dropUnits.has(job)) return openWin(job);
    const w = windowOf(job);
    if (retained(job)) return w;
    return followUnits.has(job) && levels > 1 ? blockWindow(-2, w) : leadUnits.has(job) && levels > 1 ? blockWindow(-1, w) : w;
  };
  const inBlock = new Set();
  for (const bl of blocks.values()) for (const el of [...bl.olds, ...bl.news]) inBlock.add(el);
  const blockArc = new Map();
  const overlapsAny = (r, list) => list.some((x) => Math.min(r.x + r.w, x.x + x.w) > Math.max(r.x, x.x) && Math.min(r.y + r.h, x.y + x.h) > Math.max(r.y, x.y));
  const blockArcFor = (k) => {
    const hit2 = blockArc.get(k);
    if (hit2) return hit2;
    const bl = blocks.get(k);
    const L = level.get(k);
    const side = sideOf.get(k);
    const group = partnersOf(k);
    const others = inkBoth.filter((x) => !inBlock.has(x.el)).map((x) => x.r);
    for (const j of ids) {
      if (j === k) continue;
      if (group.includes(j) && sideOf.get(j) !== null && sideOf.get(j) !== side) continue;
      const o = blocks.get(j);
      const Lj = level.get(j);
      if (Lj < L) others.push(o.b);
      else if (Lj > L) others.push(o.a);
      else others.push(o.a, o.b);
    }
    const dx = bl.b.x + bl.b.w / 2 - (bl.a.x + bl.a.w / 2);
    let plan2 = {
      path: null,
      lift: 0
    };
    if (rowChange(k) && !braceOnly(k) && Math.abs(dx) > lineEm) plan2 = {
      path: null,
      lift: ROW_STEP
    };
    if (rowChange(k) || braceOnly(k)) {
      blockArc.set(k, plan2);
      return plan2;
    }
    if (unitSwap.has(k)) {
      const u = unitSwap.get(k);
      const p2 = arcPlan(bl.a, bl.b, inkBoth.filter((x) => !inBlock.has(x.el) && !u.oldEl.contains(x.el) && !u.newEl.contains(x.el)).map((x) => x.r), "under", lineEm, bounds, true);
      plan2 = {
        path: p2.path,
        lift: Math.max(p2.lift, pairLift([bl.a, bl.b], [inkExtent(u.oldEl, origin), inkExtent(u.newEl, origin)], arcFor(u).lift))
      };
      blockArc.set(k, plan2);
      return plan2;
    }
    if (side !== void 0) {
      if (side) {
        const p2 = arcPlan(bl.a, bl.b, others, side, lineEm, bounds, true);
        plan2 = {
          path: p2.path,
          lift: p2.lift
        };
      }
      blockArc.set(k, plan2);
      return plan2;
    }
    if (Math.abs(dx) < 0.3 * lineEm) {
      blockArc.set(k, plan2);
      return plan2;
    }
    const mid = (r) => r.x + r.w / 2;
    for (const u of sorted) {
      if (u.mv.path || bl.olds.some((el) => u.oldEl.contains(el))) continue;
      const up = arcFor(u);
      if (!up.path) continue;
      const ua = inkExtent(u.oldEl, origin), ub = inkExtent(u.newEl, origin);
      const [b0, b1] = band(bl.a, bl.b), [u0, u1] = band(ua, ub);
      if (Math.min(b1, u1) <= Math.max(b0, u0) || (mid(bl.a) - mid(ua)) * (mid(bl.b) - mid(ub)) >= 0) continue;
      const side2 = up.path === "over" ? "under" : "over";
      const q = arcPlan(bl.a, bl.b, others.filter((r) => !overlapsAny(r, [ua, ub])), side2, lineEm, bounds, true);
      plan2 = {
        path: side2,
        lift: Math.max(q.lift, pairLift([bl.a, bl.b], [ua, ub], up.lift))
      };
      blockArc.set(k, plan2);
      return plan2;
    }
    const p = arcPlan(bl.a, bl.b, others, dx < 0 ? "over" : "under", lineEm, bounds);
    if (p.crosses) plan2 = {
      path: p.path,
      lift: p.lift
    };
    if (plan2.path) for (const u of sorted) {
      if (!u.mv.path || !u.significant || u.morph || bl.olds.some((el) => u.oldEl.contains(el) || el.contains(u.oldEl))) continue;
      const up = arcFor(u);
      if (!up.path || up.path === plan2.path) continue;
      const ua = inkExtent(u.oldEl, origin), ub = inkExtent(u.newEl, origin);
      const [b0, b1] = band(bl.a, bl.b), [u0, u1] = band(ua, ub);
      const mid2 = (r) => r.x + r.w / 2;
      if (Math.min(b1, u1) <= Math.max(b0, u0) || (mid2(bl.a) - mid2(ua)) * (mid2(bl.b) - mid2(ub)) >= 0) continue;
      plan2 = {
        path: plan2.path,
        lift: Math.max(plan2.lift, pairLift([bl.a, bl.b], [ua, ub], up.lift))
      };
    }
    blockArc.set(k, plan2);
    return plan2;
  };
  const riders = new Map();
  const riderFor = (k, owner) => {
    if (riders.has(k)) return riders.get(k);
    const bl = blocks.get(k);
    const dx = bl.b.x - bl.a.x;
    const dy = bl.b.y - bl.a.y;
    let found = null;
    if (owner && Math.abs(dy) < 0.5 * Math.max(bl.a.h, bl.b.h) && Math.abs(dx) > 0.5) for (const j of prep.moves) {
      if (j === owner || !owner.oldEl.contains(j.oldEl) || copyOf(j)) continue;
      const jx = j.N.x - j.O.x;
      if (Math.abs(j.N.y - j.O.y - dy) < 1.5 && jx * dx > 0 && Math.abs(jx - dx) < 0.5 * lineEm) {
        found = j;
        break;
      }
    }
    if (!found && Math.hypot(dx, dy) > 0.5) {
      const near = {
        x: bl.a.x - lineEm,
        y: bl.a.y,
        w: bl.a.w + 2 * lineEm,
        h: bl.a.h
      };
      for (const j of sorted) {
        if (j.morph || !j.significant || copyOf(j) || bl.olds.some((el) => j.oldEl.contains(el))) continue;
        if (Math.hypot(j.N.x - j.O.x - dx, j.N.y - j.O.y - dy) > 0.5 * lineEm || !overlaps(inkBox(j.O, true), near)) continue;
        found = j;
        break;
      }
    }
    riders.set(k, found);
    return found;
  };
  const blockOwner = new Map();
  const blockPhase = new Map();
  for (const [o, nw, k] of pairs) {
    if (!blockOwner.has(k)) blockOwner.set(k, nw.job ?? o.job);
    if (!blockPhase.has(k)) blockPhase.set(k, nw.phase);
  }
  const blockWinOwn = (k) => {
    const job = blockOwner.get(k) ?? null;
    const rider = riderFor(k, job);
    return rider ? unitWindow(rider) : blockWindow(k, job ? windowOf(job) : win(blockPhase.get(k) ?? null, "move"));
  };
  const braceTwin = new Map();
  {
    const solo = (k) => {
      const bl = blocks.get(k);
      if (bl.news.length !== 1) return null;
      const p = pairs.find(([, nw, kk]) => kk === k && nw.id.startsWith("bigdelim|"));
      return p ? {
        k,
        ch: p[1].id.split("|")[1],
        b: bl.b,
        line: p[1].el.closest(".dv-line")
      } : null;
    };
    for (const [x, y] of pairBraces(ids.map(solo).filter((x2) => x2 !== null))) braceTwin.set(x, y);
  }
  const growsInPlace = (k) => Math.abs(blocks.get(k).b.x - blocks.get(k).a.x) < 0.5 * lineEm;
  const blockWin = (k) => {
    if (insertion.on && dropBlocks.has(k)) return openWin(k);
    if (insertion.on && braceTwin.has(k) && growsInPlace(k) && growsInPlace(braceTwin.get(k))) return insertion.open;
    const t = braceTwin.get(k);
    const own = blockWinOwn(k);
    if (t === void 0) return own;
    const other = blockWinOwn(t);
    return other.delay > own.delay ? other : own;
  };
  let sweeps = null;
  const sweepList = () => {
    if (sweeps) return sweeps;
    sweeps = [];
    for (const j of sorted) {
      if (!j.visible || !j.significant || j.morph || copyOf(j)) continue;
      const { path, lift } = arcFor(j);
      const a = inkExtent(j.oldEl, origin);
      const b = inkExtent(j.newEl, origin);
      sweeps.push({
        a,
        b,
        path,
        lift,
        w: unitWindow(j)
      });
    }
    for (const k of ids) {
      if (!moved(k)) continue;
      const bl = blocks.get(k);
      const rider = riderFor(k, blockOwner.get(k) ?? null);
      const { path, lift } = rider ? arcFor(rider) : blockArcFor(k);
      sweeps.push({
        a: bl.a,
        b: bl.b,
        path,
        lift,
        w: blockWin(k),
        k
      });
    }
    return sweeps;
  };
  let lateEnd = 0;
  const clearAfter = (boxes, w) => {
    let end = w.delay;
    for (const sw of sweepList()) for (let i = 0; i <= 16; i++) {
      const u = i / 16;
      const at = sw.w.delay + u * sw.w.duration;
      if (at <= end) continue;
      const r = lerpRect(sw.a, sw.b, easeProgress(u), sw.path, sw.lift);
      if (boxes.some((x) => overlaps(x, r))) end = Math.max(end, Math.min(sw.w.delay + sw.w.duration, at + sw.w.duration / 16));
    }
    if (end <= w.delay + 1) return w;
    lateEnd = Math.max(lateEnd, end + w.duration);
    return {
      delay: end,
      duration: w.duration
    };
  };
  const sweptBetween = (boxes, t0, t1) => {
    for (const sw of sweepList()) for (let i = 0; i <= 16; i++) {
      const u = i / 16;
      const at = sw.w.delay + u * sw.w.duration;
      if (at < t0 || at > t1) continue;
      if (boxes.some((x) => overlaps(x, lerpRect(sw.a, sw.b, easeProgress(u), sw.path, sw.lift)))) return true;
    }
    return false;
  };
  const goneBefore = (boxes, w) => {
    let first = Infinity;
    for (const sw of sweepList()) {
      if (boxes.some((x) => overlaps(x, sw.a)) || sw.k !== void 0 && copyPairBlocks.has(sw.k)) continue;
      for (let i = 0; i <= 16; i++) {
        const u = i / 16;
        const at = sw.w.delay + u * sw.w.duration;
        if (at >= first) break;
        if (boxes.some((x) => overlaps(x, lerpRect(sw.a, sw.b, easeProgress(u), sw.path, sw.lift)))) {
          first = at;
          break;
        }
      }
    }
    const end = Math.min(w.delay + w.duration, first);
    if (end >= w.delay + w.duration) return w;
    const delay = Math.max(0, Math.min(w.delay, end - 0.5 * w.duration));
    return {
      delay,
      duration: Math.max(1, end - delay)
    };
  };
  const handoverDelay = (exit, starts, oldBoxes) => {
    if (!starts.length || !oldBoxes.length) return 0;
    const end = exit.delay + exit.duration;
    const want = handoverEnd(end, Math.min(...starts));
    if (want <= end || sweptBetween(oldBoxes, end - exit.duration, want)) return 0;
    return want - end;
  };
  let detours = null;
  const detourPlan = () => {
    if (detours) return detours;
    detours = {
      unit: new Map(),
      block: new Map()
    };
    const ms = [];
    for (const j of sorted) {
      if (!j.visible || !j.significant || j.morph || copyOf(j) || rising.has(j) || retained(j)) continue;
      if (ms.some((m) => m.job && m.job.oldEl.contains(j.oldEl))) continue;
      ms.push({
        a: inkExtent(j.oldEl, origin),
        b: inkExtent(j.newEl, origin),
        job: j
      });
    }
    for (const k of ids) if (moved(k) && rowChange(k) && !riderFor(k, blockOwner.get(k) ?? null)) ms.push({
      a: blocks.get(k).a,
      b: blocks.get(k).b,
      k
    });
    const panel = fx.closest(".explanation-panel")?.getBoundingClientRect();
    const room = panel ? {
      left: panel.left - origin.left + 4,
      right: panel.right - origin.left - 4
    } : {
      left: -0.5 * lineEm,
      right: origin.width + 0.5 * lineEm
    };
    const { side } = tradeDetours(ms, ms.map((m) => {
      const x0 = Math.min(m.a.x, m.b.x), x1 = Math.max(m.a.x + m.a.w, m.b.x + m.b.w);
      const y0 = Math.min(m.a.y, m.b.y), y1 = Math.max(m.a.y + m.a.h, m.b.y + m.b.h);
      let left = room.left, right = room.right;
      for (const { r } of inkBoth) {
        if (r.y >= y1 || r.y + r.h <= y0) continue;
        if (r.x + r.w <= x0 + 1) left = Math.max(left, r.x + r.w + 0.15 * lineEm);
        else if (r.x >= x1 - 1) right = Math.min(right, r.x - 0.15 * lineEm);
      }
      return {
        left,
        right
      };
    }), 0.2 * lineEm, 0.5 * lineEm);
    ms.forEach((m, i) => {
      if (!side[i]) return;
      if (m.job) detours.unit.set(m.job, side[i]);
      if (m.k !== void 0) detours.block.set(m.k, side[i]);
    });
    return detours;
  };
  const unitDetour = (job) => {
    const d = detourPlan().unit;
    for (const [j, side] of d) if (j === job || j.oldEl.contains(job.oldEl)) return side;
    return 0;
  };
  const tallPieces = pairs.map(([o, nw, k], i) => ({
    i,
    k,
    o,
    nw,
    ch: nw.id.split("|")[1] ?? "",
    line: nw.el.closest(".dv-line")
  })).filter((x) => x.nw.id.startsWith("bigdelim|") && Math.abs(x.nw.r.h - x.o.r.h) > 0.5 * lineEm);
  const tallTwin = pairBraces(tallPieces.map((x) => ({
    k: x.i,
    ch: x.ch,
    b: x.nw.r,
    line: x.line
  })));
  const tallBlocks = new Set(pairs.filter(([, nw]) => nw.id.startsWith("bigdelim|")).map(([, , k]) => k));
  const bracePlans = new Map();
  const bracePlan = (i) => {
    const t = tallTwin.get(i);
    if (t === void 0) return null;
    const key = Math.min(i, t);
    if (bracePlans.has(key)) return bracePlans.get(key);
    const plan2 = (() => {
      const P2 = tallPieces.find((x) => x.i === i), Q = tallPieces.find((x) => x.i === t);
      const [L, R] = P2.o.r.x < Q.o.r.x ? [P2, Q] : [Q, P2];
      const xl = Math.min(L.o.r.x + L.o.r.w, L.nw.r.x + L.nw.r.w), xr = Math.max(R.o.r.x, R.nw.r.x);
      const inside = (r, br) => r.x + r.w / 2 > xl && r.x + r.w / 2 < xr && r.y + r.h / 2 > br.y && r.y + r.h / 2 < br.y + br.h;
      const ms = sweepList().filter((sw) => (sw.k === void 0 || !tallBlocks.has(sw.k)) && (inside(sw.a, L.o.r) || inside(sw.b, L.nw.r)));
      if (!ms.length) return null;
      const end = Math.max(...[L.k, R.k].map((k) => blockWin(k).delay + blockWin(k).duration), ...ms.map((m) => m.w.delay + m.w.duration));
      const N = 32;
      const e = Array.from({ length: N + 1 }, (_, n2) => {
        const T = n2 / N * end;
        let top = Infinity, bot = -Infinity;
        for (const m of ms) {
          const r = lerpRect(m.a, m.b, easeProgress((T - m.w.delay) / Math.max(1, m.w.duration)), m.path, m.lift);
          top = Math.min(top, r.y);
          bot = Math.max(bot, r.y + r.h);
        }
        return {
          top,
          bot
        };
      });
      const prog = (edge, outward) => {
        const c0 = e[0][edge], c1 = e[N][edge];
        const out = e.map((x, n2) => Math.abs(c1 - c0) < 1 ? n2 / N : Math.max(0, Math.min(1, (x[edge] - c0) / (c1 - c0))));
        if (outward) for (let n2 = 1; n2 <= N; n2++) out[n2] = Math.max(out[n2], out[n2 - 1]);
        else for (let n2 = N - 1; n2 >= 0; n2--) out[n2] = Math.min(out[n2], out[n2 + 1]);
        out[N] = 1;
        return out;
      };
      return {
        end,
        top: prog("top", L.nw.r.y < L.o.r.y),
        bot: prog("bot", L.nw.r.y + L.nw.r.h > L.o.r.y + L.o.r.h)
      };
    })();
    bracePlans.set(key, plan2);
    return plan2;
  };
  let standingInk = null;
  const standing = () => standingInk ??= (() => {
    const before2 = inkMap(source, origin);
    return inkMap(target, origin).filter((x) => before2.some((y) => Math.abs(y.r.x - x.r.x) < 1 && Math.abs(y.r.y - x.r.y) < 1 && y.r.w > 0.5)).map((x) => inkBox(x.r, true));
  })();
  const riderOpacity = (a, b, path, lift, w, k, op, base) => SAMPLES.map((u) => {
    const r = inkBox(lerpRect(a, b, easeProgress(u), path, lift), true);
    const T = w.delay + u * w.duration;
    const hit2 = u < 1 && (sweepList().some((sw) => sw.k !== k && overlaps(r, lerpRect(sw.a, sw.b, easeProgress((T - sw.w.delay) / Math.max(1, sw.w.duration)), sw.path, sw.lift))) || standing().some((x) => overlaps(r, x)));
    const f = base ? keyframeAt(base, u) : Math.max(0, Math.min(1, (u - 0.4) / 0.35)) * op;
    return {
      offset: u,
      opacity: hit2 ? 0 : f
    };
  });
  const braceFrames = (g, a, b, plan2, w) => {
    const N = plan2.top.length - 1;
    return plan2.top.map((_, n2) => {
      const px = easeProgress((n2 / N * plan2.end - w.delay) / Math.max(1, w.duration));
      const y0 = a.y + (b.y - a.y) * plan2.top[n2], y1 = a.y + a.h + (b.y + b.h - a.y - a.h) * plan2.bot[n2];
      return {
        offset: n2 / N,
        transform: placeAt(g.home, {
          x: a.x + (b.x - a.x) * px,
          w: a.w + (b.w - a.w) * px,
          y: y0,
          h: Math.max(1, y1 - y0)
        })
      };
    });
  };
  const tallSide = (ch, twin2, o) => twin2 ? o.r.x < twin2.o.r.x ? 1 : -1 : "({[⟨⌊⌈".includes(ch) ? 1 : ")}]⟩⌋⌉".includes(ch) ? -1 : 0;
  const tallFrames = (g, a, b, side, w) => {
    const near = [...standing(), ...sweepList().filter((sw) => sw.w.delay + sw.w.duration <= w.delay + 1).map((sw) => inkBox(sw.b, true))].filter((x) => Math.min(x.y + x.h, b.y + b.h) > Math.max(x.y, b.y) && (side > 0 ? x.x >= b.x + b.w - 2 && x.x < b.x + b.w + lineEm : x.x + x.w <= b.x + 2 && x.x + x.w > b.x - lineEm));
    const edge = side > 0 ? Math.min(Infinity, ...near.map((x) => x.x)) : Math.max(-Infinity, ...near.map((x) => x.x + x.w));
    return SAMPLES.map((u) => {
      const r = lerpRect(a, b, u, null, 0);
      let x0 = r.x, x1 = r.x + r.w;
      if (side > 0 && Number.isFinite(edge)) x1 = Math.max(Math.min(x1, edge), b.x + b.w, x0 + 1);
      if (side < 0 && Number.isFinite(edge)) x0 = Math.min(Math.max(x0, edge), b.x, x1 - 1);
      return {
        offset: u,
        transform: placeAt(g.home, {
          x: x0,
          w: x1 - x0,
          y: r.y,
          h: r.h
        })
      };
    });
  };
  const droppedBy = new Map();
  if (insertion.on) {
    for (const [o, nw, k] of pairs) if (!o.copy && dropBlocks.has(k)) droppedBy.set(o.el, {
      x: nw.r.x - o.r.x,
      y: nw.r.y - o.r.y
    });
  }
  for (const [o0, nw, k] of pairs) {
    if (swapNew.has(nw.el)) jobs.push(() => {
      const g = makeInkClone(fx, origin, o0.el);
      created.push(g);
      const job = nw.job ?? o0.job;
      const rider = riderFor(k, job);
      const { path, lift } = rider ? arcFor(rider) : job?.mv.path ? arcFor(job) : blockArcFor(k);
      const dest = {
        ...nw.r,
        w: o0.r.w * (nw.r.h / Math.max(1, o0.r.h))
      };
      const w = blockWin(k);
      animations.push(g.wrapper.animate(travelInk(g, o0.r, dest, path, lift, false), opts(w)));
      animations.push(g.wrapper.animate([
        {
          opacity: o0.op,
          offset: 0
        },
        {
          opacity: o0.op,
          offset: 0.1
        },
        {
          opacity: 0,
          offset: 0.4
        },
        {
          opacity: 0,
          offset: 1
        }
      ], opts(w)));
    });
    const shift = o0.copy ? droppedBy.get(o0.el) : void 0;
    const o = shift ? {
      ...o0,
      r: {
        ...o0.r,
        x: o0.r.x + shift.x,
        y: o0.r.y + shift.y
      }
    } : o0;
    jobs.push(() => {
      const g = makeInkClone(fx, origin, nw.el);
      created.push(g);
      const job = nw.job ?? o.job;
      const rider = riderFor(k, job);
      const w = blockWin(k);
      const { path, lift } = Math.hypot(nw.r.x - o.r.x, nw.r.y - o.r.y) < 1 || braceTwin.has(k) ? {
        path: null,
        lift: 0
      } : rider ? arcFor(rider) : job?.mv.path ? arcFor(job) : blockArcFor(k);
      const isRule = nw.id.startsWith("rule|") || nw.id.startsWith("bigdelim|");
      const aside = braceTwin.has(k) ? 0 : rider ? unitDetour(rider) : detourPlan().block.get(k) ?? 0;
      const ti = tallPieces.find((x) => x.nw === nw && x.o === o0);
      const track = ti ? bracePlan(ti.i) : null;
      const twin2 = ti ? tallPieces.find((x) => x.i === tallTwin.get(ti.i)) : void 0;
      const delimCh = nw.id.startsWith("bigdelim|") ? nw.id.split("|")[1] ?? "" : nw.id.includes("|delim|") ? nw.id.split("|")[0] : "";
      const lone = !track && delimCh && Math.abs(nw.r.h - o.r.h) > 0.5 * lineEm ? tallSide(delimCh, twin2, o0) : 0;
      if (track) animations.push(g.wrapper.animate(braceFrames(g, o.r, nw.r, track, w), opts({
        delay: 0,
        duration: Math.max(1, track.end)
      }, "linear")));
      else if (lone && !aside && !path) animations.push(g.wrapper.animate(tallFrames(g, o.r, nw.r, lone, w), opts(w)));
      else animations.push(g.wrapper.animate(aside ? travelInkDetour(g, o.r, nw.r, aside, isRule) : travelInk(g, o.r, nw.r, path, lift, isRule), opts(w)));
      animations.push(g.wrapper.animate(o.copy ? persists.has(Number(o.el.closest(".dv-line")?.dataset.line)) ? copyOpacity(o.r, nw.r, path, lift, nw.op) : ((frames) => copyRider.has(nw.el) && !aside ? riderOpacity(o.r, nw.r, path, lift, w, k, nw.op, frames) : frames)(peelOpacity((t) => {
        const bl = blocks.get(k);
        const a = shift ? {
          ...bl.a,
          x: bl.a.x + shift.x,
          y: bl.a.y + shift.y
        } : bl.a;
        return aside ? detourRect(a, bl.b, t, aside) : lerpRect(a, bl.b, t, path, lift);
      }, peelSource(o.r, shift ? {
        ...blocks.get(k).a,
        x: blocks.get(k).a.x + shift.x,
        y: blocks.get(k).a.y + shift.y
      } : blocks.get(k).a, 0.1 * lineEm), nw.op)) : riderNew.has(nw.el) && !aside ? riderOpacity(o.r, nw.r, path, lift, w, k, nw.op) : swapNew.has(nw.el) || riderNew.has(nw.el) ? [
        {
          opacity: 0,
          offset: 0
        },
        {
          opacity: 0,
          offset: 0.4
        },
        {
          opacity: nw.op,
          offset: 0.75
        },
        {
          opacity: nw.op,
          offset: 1
        }
      ] : [{ opacity: o.op }, { opacity: nw.op }], opts(w)));
    });
  }
  const traders = new Set();
  const plain = (m) => m.significant && m.visible && !m.morph && !m.mv.path && !copyOf(m) && !retained(m) && !arcFor(m).path;
  for (const j of sorted) {
    if (!plain(j)) continue;
    for (const k of sorted) {
      if (k === j || !plain(k) || j.oldEl.contains(k.oldEl) || k.oldEl.contains(j.oldEl)) continue;
      const jdx = j.N.x - j.O.x, kdx = k.N.x - k.O.x;
      if (jdx * kdx >= 0 || Math.abs(jdx) < Math.abs(kdx) || Math.abs(jdx) < 0.5 * lineEm) continue;
      const sameRow = Math.min(j.O.y + j.O.h, k.O.y + k.O.h) - Math.max(j.O.y, k.O.y) > 0.3 * Math.min(j.O.h, k.O.h);
      const trade = Math.sign(j.O.x - k.O.x) !== Math.sign(j.N.x - k.N.x);
      if (!sameRow || !trade) continue;
      j.mv.path = "over";
      arcs.delete(j);
      traders.add(j);
      break;
    }
  }
  for (const j of sorted) {
    if (!j.significant || copyOf(j) || traders.has(j)) continue;
    const a = arcFor(j);
    if (!a.path) continue;
    const jdx = j.N.x - j.O.x;
    for (const k of sorted) {
      if (k === j || k.mv.path || ducks.has(j) || !k.mv.path && arcFor(k).path || !k.significant || k.morph || copyOf(k) || retained(k) || j.oldEl.contains(k.oldEl) || k.oldEl.contains(j.oldEl)) continue;
      const kdx = k.N.x - k.O.x;
      if (jdx * kdx >= 0 || Math.abs(kdx) < 0.3 * lineEm) continue;
      const sameRow = Math.min(j.O.y + j.O.h, k.O.y + k.O.h) - Math.max(j.O.y, k.O.y) > 0.3 * Math.min(j.O.h, k.O.h);
      const crossX = Math.min(Math.max(j.O.x, j.N.x) + j.O.w, Math.max(k.O.x, k.N.x) + k.O.w) - Math.max(Math.min(j.O.x, j.N.x), Math.min(k.O.x, k.N.x)) > 0;
      if (!sameRow || !crossX) continue;
      const crossedBy = (m) => Math.min(Math.max(m.O.x, m.N.x) + m.O.w, Math.max(k.O.x, k.N.x) + k.O.w) - Math.max(Math.min(m.O.x, m.N.x), Math.min(k.O.x, k.N.x)) > 0 && Math.min(m.O.y + m.O.h, k.O.y + k.O.h) - Math.max(m.O.y, k.O.y) > 0.3 * Math.min(m.O.h, k.O.h);
      const clears = (m) => {
        const p = arcFor(m);
        return p.path === "over" ? Math.max(m.O.y + m.O.h, m.N.y + m.N.h) - p.lift <= k.O.y + 1 : Math.min(m.O.y, m.N.y) + p.lift >= k.O.y + k.O.h - 1;
      };
      if (clears(j) && sorted.some((m) => m !== j && m.significant && m.visible && m.mv.path && !ducks.has(m) && m.mv.phase === j.mv.phase && arcFor(m).path && arcFor(m).path !== a.path && crossedBy(m) && clears(m))) continue;
      k.mv.path = a.path === "over" ? "under" : "over";
      arcs.delete(k);
      ducks.add(k);
      duckOf.set(k, j);
    }
  }
  for (const job of sorted) {
    if (!job.mv.path || !job.visible || !job.significant || ducks.has(job)) continue;
    const a = arcs.get(job);
    if (!a?.path) continue;
    const dx = job.N.x - job.O.x;
    const side = sorted.filter((m) => m.mv.path === job.mv.path && m.visible && m.significant && !ducks.has(m) && m.mv.phase === job.mv.phase && Math.abs(m.N.x - m.O.x - dx) < 1 && Math.abs(m.O.y - job.O.y) < 0.5 * lineEm && arcs.get(m)?.path === a.path);
    if (side.length < 2) continue;
    const top = Math.max(...side.map((m) => arcs.get(m).lift));
    for (const m of side) arcs.get(m).lift = top;
  }
  let overhang = 0;
  for (const job of sorted) {
    if (!job.mv.path || !(job.visible || isCopy(job))) continue;
    const a = arcFor(job);
    if (a.path === "under") overhang = Math.max(overhang, Math.max(job.O.y + job.O.h, job.N.y + job.N.h) + a.lift - freeBottom);
  }
  for (const k of ids) {
    const a = blockArcFor(k);
    const bl = blocks.get(k);
    if (a.path === "under") overhang = Math.max(overhang, Math.max(bl.a.y + bl.a.h, bl.b.y + bl.b.h) + a.lift - freeBottom);
  }
  if (overhang > 0.5) grow(Math.ceil(overhang));
  jobs.forEach((job) => job());
  for (const em of plan.emphasis) {
    const el = findUnit(target, em.ref);
    if (!el) continue;
    emphasisEffects(fx, origin, em.kind, el, newClones.get(keyOf(em.ref)), span, timing, animations);
  }
  return {
    created,
    total: Math.max(span + rise, lateEnd) + (plan.emphasis.length ? timing.emphasis : 0)
  };
}
function playSequence(options) {
  const { root, stage, fx, compiled, states } = options;
  const base = {
    ...TIMING,
    ...options.timing ?? {}
  };
  const animations = [];
  let cancelled = false;
  let resolveDone = () => {
  };
  const done = new Promise((resolve) => {
    resolveDone = resolve;
  });
  const cleanup = () => {
    animations.splice(0).forEach((a) => a.cancel());
    fx.replaceChildren();
    delete root.dataset.dvAnimating;
    delete root.dataset.dvSettling;
    delete root.dataset.dvPeak;
    delete root.dataset.dvSubPhase;
    resolveDone();
  };
  root.dataset.dvAnimating = "true";
  const wait = (ms) => {
    const clock = fx.animate([{ opacity: 1 }, { opacity: 1 }], { duration: Math.max(1, ms) });
    animations.push(clock);
    return clock.finished.then(() => void 0);
  };
  const boxTo = (from, to, duration, easing) => {
    const box2 = root.animate([{ height: `${from}px` }, { height: `${to}px` }], {
      duration: Math.abs(to - from) > 0.5 ? Math.max(1, duration) : 1,
      easing,
      fill: "forwards"
    });
    animations.push(box2);
    return box2;
  };
  const layers = states.map((state, i) => i === states.length - 1 ? stage : ghostLayer(fx, compiled, state));
  const heights = layers.map((layer) => layer.offsetHeight);
  const origin = fx.getBoundingClientRect();
  const totals = states.slice(1).map((state, i) => {
    const prep = prepare(compiled, layers[i], layers[i + 1], states[i], state, origin);
    return spanOfPrepared(prep, base).total + reflowSlotCount(prep, layers[i], layers[i + 1]) * 200;
  });
  layers.forEach((layer) => {
    if (layer !== stage) layer.remove();
  });
  root.dataset.dvPeak = String(Math.max(...heights));
  const timing = pressTiming(base, totals, Math.max(...heights) > heights[heights.length - 1] + 0.5);
  let box = heights[0];
  (async () => {
    for (let i = 0; i < states.length - 1; i += 1) {
      if (cancelled) return;
      const last = i === states.length - 2;
      animations.splice(0).forEach((a) => a.cancel());
      fx.replaceChildren();
      const hold = Math.max(box, heights[i], heights[i + 1]);
      boxTo(box, hold, timing.grow, EASE_OUT);
      box = hold;
      const source = ghostLayer(fx, compiled, states[i]);
      const target = last ? stage : ghostLayer(fx, compiled, states[i + 1]);
      let prep = prepare(compiled, source, target, states[i], states[i + 1], fx.getBoundingClientRect());
      const { pre: slots, rise } = reflowSplit(prep, source, target);
      const slotMs = 200 * timing.move / base.move;
      if (slots) {
        root.dataset.dvSubPhase = "reflow";
        const finish = reflowOld(fx, prep, slotMs, animations, rise);
        await wait(slots * slotMs);
        if (cancelled) return;
        finish();
        prep = prepare(compiled, source, target, states[i], states[i + 1], fx.getBoundingClientRect());
      }
      root.dataset.dvSubPhase = "morph";
      const { total } = animateOne(fx, prep, target, source, timing, animations, (px) => {
        boxTo(box, box + px, Math.min(timing.grow, 200), EASE_OUT);
        box += px;
        root.dataset.dvPeak = String(Math.max(Number(root.dataset.dvPeak) || 0, box));
      }, rise ? slotMs : 0);
      await wait(total + (last ? 0 : timing.hold));
    }
    if (cancelled) return;
    animations.splice(0).forEach((a) => a.cancel());
    fx.replaceChildren();
    delete root.dataset.dvAnimating;
    const settled = stage.offsetHeight;
    if (box > settled + 0.5) {
      root.dataset.dvSettling = "true";
      await boxTo(box, settled, timing.settle, EASE).finished;
    }
    if (!cancelled) cleanup();
  })().catch(() => {
    if (!cancelled) cleanup();
  });
  return {
    cancel() {
      if (cancelled) return;
      cancelled = true;
      cleanup();
    },
    done
  };
}
var useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
function subscribeReducedMotion(callback) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
}
function Derivation({ derivation, at, animate = true, reducedMotion, size, timing, className = "", label, onSettled, fade = true, handle }) {
  const compiled = useMemo(() => compileDerivation(derivation), [derivation]);
  const step = at === null ? -1 : clampStep(compiled, at);
  const state = stateAtStep(compiled, step);
  const empty = isEmptyState(compiled, state);
  const stageHtml = useMemo(() => ({ __html: stateMarkup(compiled, state) }), [compiled, state]);
  const lines = useMemo(() => stateMathml(compiled, state).map((line) => ({
    ...line,
    html: { __html: line.mathml }
  })), [compiled, state]);
  const history = lines.slice(0, -1);
  const active = lines[lines.length - 1];
  const systemReduced = usePrefersReducedMotion();
  const reduced = reducedMotion ?? systemReduced;
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const fxRef = useRef(null);
  const prevRef = useRef(null);
  const runningRef = useRef(null);
  const pendingRefit = useRef(false);
  const pressRef = useRef(null);
  const startRef = useRef(() => {
  });
  const settledRef = useRef(onSettled);
  const timingRef = useRef(timing);
  useEffect(() => {
    settledRef.current = onSettled;
    timingRef.current = timing;
  });
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const fx = fxRef.current;
    if (!root || !stage || !fx) return;
    runningRef.current?.cancel();
    runningRef.current = null;
    fitDerivation(root, compiled);
    fitStack(stage);
    const prev = prevRef.current && prevRef.current.compiled === compiled ? prevRef.current.step : animate && step === 0 ? -1 : null;
    prevRef.current = {
      compiled,
      step
    };
    pressRef.current = null;
    const kind = transitionKind(prev, step, {
      reducedMotion: reduced,
      animate
    });
    const start = (states, target) => {
      root.getAnimations().forEach((animation) => animation.cancel());
      pressRef.current = {
        states,
        step: target
      };
      const running = playSequence({
        root,
        stage,
        fx,
        compiled,
        states,
        timing: timingRef.current
      });
      runningRef.current = running;
      running.done.then(() => {
        if (runningRef.current === running) {
          if (pendingRefit.current) {
            fitDerivation(root, compiled, true);
            pendingRefit.current = false;
          }
          fitStack(stage);
          runningRef.current = null;
          pressRef.current = null;
          settledRef.current?.(target === -1 ? null : target);
        }
      });
    };
    startRef.current = start;
    if (kind === "animate" && prev !== null) {
      start(step === -1 ? [stateAtStep(compiled, prev), state] : [stateAtStep(compiled, prev), ...statesBetween(compiled, prev, step)], step);
      return;
    }
    if (kind === "instant" && fade && !reduced && !empty && typeof root.animate === "function") root.animate([{ opacity: 0.25 }, { opacity: 1 }], {
      duration: 160,
      easing: "ease-out"
    });
    if (kind !== "none") settledRef.current?.(step === -1 ? null : step);
  }, [
    compiled,
    step,
    reduced,
    animate
  ]);
  useImperativeHandle(handle, () => ({ restartPress() {
    const press = pressRef.current;
    const running = runningRef.current;
    const stage = stageRef.current;
    if (!press || !running || !stage) return false;
    runningRef.current = null;
    running.cancel();
    fitStack(stage);
    startRef.current(press.states, press.step);
    return true;
  } }), []);
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    let lastWidth = root.clientWidth;
    const observer = new ResizeObserver(() => {
      if (root.clientWidth === lastWidth) return;
      lastWidth = root.clientWidth;
      if (runningRef.current) {
        pendingRefit.current = true;
        return;
      }
      fitDerivation(root, compiled, true);
      fitStack(stage);
    });
    observer.observe(root);
    const refit = () => {
      if (runningRef.current) {
        pendingRefit.current = true;
        return;
      }
      fitDerivation(root, compiled, true);
      fitStack(stage);
    };
    window.addEventListener("resize", refit);
    document.fonts?.ready.then(refit);
    for (const family of [
      "KaTeX_Size1",
      "KaTeX_Size2",
      "KaTeX_Size3",
      "KaTeX_Size4",
      "KaTeX_Math",
      "KaTeX_Main"
    ]) document.fonts?.load(`1em ${family}`).catch(() => {
    });
    document.fonts?.addEventListener("loadingdone", refit);
    return () => {
      window.removeEventListener("resize", refit);
      document.fonts?.removeEventListener("loadingdone", refit);
      observer.disconnect();
      runningRef.current?.cancel();
    };
  }, [compiled]);
  const style = size ? { "--dv-size": size } : void 0;
  return jsxs("div", {
    ref: rootRef,
    className: `dv ${className}`.trim(),
    "data-derivation": compiled.id,
    "data-step": step === -1 ? "none" : step,
    "data-state": state === -1 ? "none" : state,
    "data-empty": empty ? "" : void 0,
    style,
    role: "group",
    "aria-label": label ?? "Derivation",
    children: [
      jsx("div", {
        ref: stageRef,
        className: "dv-stage",
        "aria-hidden": "true",
        dangerouslySetInnerHTML: stageHtml
      }),
      jsx("div", {
        ref: fxRef,
        className: "dv-fx",
        "aria-hidden": "true"
      }),
      jsxs("div", {
        className: "dv-sr",
        children: [history.map((line) => jsx("div", { dangerouslySetInnerHTML: line.html }, line.state)), jsxs("div", {
          "aria-live": "polite",
          "aria-atomic": "true",
          children: [active?.label ? jsxs("span", { children: [active.label, " "] }) : null, active ? jsx("span", { dangerouslySetInnerHTML: active.html }) : null]
        })]
      })
    ]
  });
}
function createVisibility(steps, step, entering) {
  const indices = new Map(steps.map((definition, index) => [definition.key, index]));
  const indexFor = (key) => {
    const index = indices.get(key);
    if (index === void 0) throw new Error(`Unknown step key: ${key}`);
    return index;
  };
  return {
    on: (key) => step >= indexFor(key),
    between: (key, endKey) => step >= indexFor(key) && step < indexFor(endKey),
    enter: (key) => entering && step === indexFor(key) ? " build-enter" : ""
  };
}
function createFigureScales({ width, height, margins, xDomain, yDomain }) {
  const plotWidth = width - margins.left - margins.right;
  const plotHeight = height - margins.top - margins.bottom;
  const x = (value) => margins.left + (value - xDomain[0]) / (xDomain[1] - xDomain[0]) * plotWidth;
  const y = (value) => margins.top + (1 - (value - yDomain[0]) / (yDomain[1] - yDomain[0])) * plotHeight;
  return {
    x,
    y,
    plotWidth,
    plotHeight
  };
}
function mcPath({ w, e, x, y }) {
  const pieces = [];
  for (let index = 0; index <= 61; index += 1) {
    const mc = index === 49 ? 1 : 0.02 + 0.02 * index;
    const z = w * Math.pow(mc, e);
    const pointX = mc === 1 ? x(z) : x(z).toFixed(2);
    const pointY = mc === 1 ? y(mc) : y(mc).toFixed(2);
    pieces.push(`${index === 0 ? "M" : "L"}${pointX},${pointY}`);
  }
  return pieces.join(" ");
}
function histogramBars({ shares, binWidth, x, y, baseline, inset = 1 }) {
  const width = Math.max(0, x(binWidth) - x(0) - inset * 2);
  return shares.map((share, index) => {
    const left = x(index * binWidth);
    const top = y(share);
    return {
      index,
      share,
      x: left + inset,
      y: top,
      width,
      height: baseline - top
    };
  });
}
function term(key, tex, sign = "+") {
  return {
    key,
    tex,
    sign
  };
}
function product(key, sign, factors) {
  return {
    key,
    sign,
    factors
  };
}
function toTerm(input) {
  return {
    key: input.key,
    sign: input.sign ?? "+",
    op: input.op ?? null,
    factors: input.factors ? input.factors.map((f) => ({
      key: f.key,
      tex: f.tex,
      op: f.op ?? null,
      chunk: f.chunk ?? null
    })) : [{
      key: input.key,
      tex: input.tex ?? "",
      op: null,
      chunk: null
    }]
  };
}
function toSide(key, input) {
  if (typeof input === "string") return {
    key,
    terms: [toTerm({
      key: key === "L" ? "lhs" : "rhs",
      tex: input
    })]
  };
  return {
    key,
    terms: (Array.isArray(input) ? input : [input]).map(toTerm)
  };
}
function equation(lhs, rhs, rel = "=") {
  return {
    lhs: toSide("L", lhs),
    rel,
    rhs: toSide("R", rhs)
  };
}
var clone = (eq) => JSON.parse(JSON.stringify(eq));
function braces(body, sizing = "classic") {
  if (/\\frac|\\left|\\dfrac|\^\{[^}]*\\frac/.test(body)) return sizing === "content" ? ["\\Bigg\\{", "\\Bigg\\}"] : ["\\bigg\\{", "\\bigg\\}"];
  return sizing === "content" && /\^/.test(body.replace(/\\k\{[^{}]*\}/g, "")) || sizing === "content" ? ["\\Big\\{", "\\Big\\}"] : ["\\big\\{", "\\big\\}"];
}
function wrapOp(prefix, op, body, chunk = null, keyedGroup = true, sizing = "classic") {
  const [lb, rb] = braces(body, sizing);
  const inner = `\\k{${prefix}.op}{${op}} \\k{${prefix}.lb}{${lb}} ${body} \\k{${prefix}.rb}{${rb}}`;
  return keyedGroup || chunk ? `\\k{${prefix}.g}{${inner}}` : inner;
}
function renderFactor(f, index, dots, breakable = false, sizing = "classic") {
  const dot = index > 0 && dots ? `${breakable ? "\\brk " : ""}\\k{${f.key}.dot}{\\cdot} ` : "";
  const body = `\\k{${f.key}}{${f.tex}}`;
  if (f.op) return dot + wrapOp(f.key, f.op, body, f.chunk ?? null, true, sizing);
  if (f.chunk) return `${dot}\\k{${f.key}.g}{${body}}`;
  return dot + body;
}
function renderTerm(t, index, topLevel = false, sizing = "classic") {
  const sign = index === 0 && t.sign === "+" && !t.showPlus ? "" : `\\k{${t.key}.s}{${t.sign}} `;
  const factors = t.factors.map((f, i) => renderFactor(f, i, t.dots ?? false, topLevel && !t.op, sizing)).join(" ");
  return sign + (t.op ? wrapOp(t.key, t.op, factors, null, true, sizing) : factors);
}
function renderSide(side, sizing = "classic") {
  const terms = side.terms.map((t, i) => i > 0 ? `\\brk ${renderTerm(t, i, !side.op, sizing)}` : renderTerm(t, i, !side.op, sizing)).join(" ");
  if (!side.op) return terms;
  const [lb, rb] = braces(terms, sizing);
  return `\\k{${side.key}.op}{${side.op}} \\k{${side.key}.lb}{${lb}} ${terms} \\k{${side.key}.rb}{${rb}}`;
}
function renderEq(eq, options = {}) {
  const sizing = options.braces ?? "classic";
  return `${renderSide(eq.lhs, sizing)} \\brk \\k{rel}{${eq.rel}} ${renderSide(eq.rhs, sizing)}`;
}
function findTerm(eq, key) {
  for (const side of [eq.lhs, eq.rhs]) {
    const index = side.terms.findIndex((t) => t.key === key);
    if (index >= 0) return {
      side,
      index,
      term: side.terms[index]
    };
  }
  throw new Error(`moves: no term "${key}"`);
}
function findFactor(eq, key) {
  for (const side of [eq.lhs, eq.rhs]) for (const t of side.terms) {
    const index = t.factors.findIndex((f) => f.key === key);
    if (index >= 0) return {
      term: t,
      index,
      factor: t.factors[index]
    };
  }
  return null;
}
function chunksOf(eq) {
  const out = {};
  for (const side of [eq.lhs, eq.rhs]) for (const t of side.terms) for (const f of t.factors) if (f.chunk) out[`${f.key}.g`] = f.chunk;
  return out;
}
function termPatterns(t) {
  return [`${t.key}*`, ...t.factors.map((f) => `${f.key}*`)];
}
var DerivationBuilder = class {
  constructor(id, options = {}) {
    this.id = id;
    this.options = options;
    this.states = [];
    this.eq = null;
    this.inGroup = false;
    this.groupStarted = false;
  }
  push({ eq, keep, hints, label }) {
    const sub = this.inGroup && this.groupStarted;
    if (this.inGroup) this.groupStarted = true;
    const chunks = {
      ...chunksOf(eq),
      ...hints?.chunks ?? {}
    };
    this.states.push({
      tex: renderEq(eq, { braces: this.options.braces ?? (/^(kink|cdf|nonid|identification|general|mixture|ss|rf)-/.test(this.id) ? "content" : "classic") }),
      keep: keep || void 0,
      sub: sub || void 0,
      label: label ?? this.nextLabel,
      ...hints?.duration ? { duration: hints.duration } : {},
      ...hints?.from ? { from: hints.from } : {},
      ...hints?.enter ? { enter: hints.enter } : {},
      ...hints?.exit ? { exit: hints.exit } : {},
      ...hints?.path ? { path: hints.path } : {},
      ...hints?.phases ? { phases: hints.phases } : {},
      ...hints?.emphasis ? { emphasis: hints.emphasis } : {},
      ...Object.keys(chunks).length ? { chunks } : {}
    });
    this.nextLabel = void 0;
    this.eq = eq;
    return this;
  }
  current() {
    if (!this.eq) throw new Error(`moves ${this.id}: call start() first`);
    return clone(this.eq);
  }
  say(label) {
    this.nextLabel = label;
    return this;
  }
  start(eq) {
    if (this.eq) throw new Error(`moves ${this.id}: start() called twice`);
    return this.push({ eq: clone(eq) });
  }
  group(build) {
    this.inGroup = true;
    this.groupStarted = false;
    build(this);
    this.inGroup = false;
    this.groupStarted = false;
    return this;
  }
  copyLine() {
    return this.push({
      eq: this.current(),
      keep: true
    });
  }
  wrap(op, sides = "both") {
    const eq = this.current();
    for (const side of [eq.lhs, eq.rhs]) if (sides === "both" || sides === side.key) side.op = op;
    return this.push({
      eq,
      hints: { enter: {
        "L.op": "write",
        "R.op": "write",
        "L.lb": "grow",
        "L.rb": "grow",
        "R.lb": "grow",
        "R.rb": "grow"
      } }
    });
  }
  distribute() {
    const eq = this.current();
    const from = {};
    const enter = { "*.g": "fade" };
    const phases = [];
    for (const side of [eq.lhs, eq.rhs]) {
      if (!side.op) continue;
      side.terms.forEach((t, i) => {
        phases.push([
          `${t.key}.op`,
          `${t.key}.lb`,
          `${t.key}.rb`,
          `${t.key}.g`
        ]);
        t.op = side.op;
        from[`${t.key}.op`] = `${side.key}.op`;
        from[`${t.key}.lb`] = `${side.key}.lb`;
        if (i === side.terms.length - 1) from[`${t.key}.rb`] = `${side.key}.rb`;
        else enter[`${t.key}.rb`] = "grow";
      });
      side.op = null;
    }
    return this.push({
      eq,
      hints: {
        from,
        enter,
        phases
      }
    });
  }
  resolve(map) {
    const eq = this.current();
    const from = {};
    const exit = {};
    const toFactors = (spec, fallbackKey) => typeof spec === "string" ? [{
      key: fallbackKey,
      tex: spec,
      op: null,
      chunk: null
    }] : spec.map((f) => ({
      key: f.key,
      tex: f.tex,
      op: f.op ?? null,
      chunk: f.chunk ?? null
    }));
    for (const [key, spec] of Object.entries(map)) {
      const factorHit = findFactor(eq, key);
      const termHit = eq.lhs.terms.concat(eq.rhs.terms).find((t) => t.key === key) ?? null;
      if (termHit && termHit.op) {
        const result = toFactors(spec, `${key}_d`);
        from[result[0].key] = termHit.factors[0].key;
        for (const part of [
          "op",
          "lb",
          "rb"
        ]) exit[`${key}.${part}`] = "collapse";
        termHit.op = null;
        termHit.factors = result;
        termHit.dots = false;
      } else if (factorHit && factorHit.factor.op) {
        const f = factorHit.factor;
        const result = toFactors(spec, `${key}_d`).map((r) => ({
          ...r,
          chunk: r.chunk ?? f.chunk ?? null
        }));
        from[result[0].key] = key;
        if (f.chunk) from[`${result[0].key}.g`] = `${key}.g`;
        if (factorHit.index > 0 && factorHit.term.dots) from[`${result[0].key}.dot`] = `${key}.dot`;
        for (const part of [
          "op",
          "lb",
          "rb"
        ]) exit[`${key}.${part}`] = "collapse";
        factorHit.term.factors.splice(factorHit.index, 1, ...result);
      } else if (factorHit) factorHit.term.factors.splice(factorHit.index, 1, ...toFactors(spec, key));
      else if (termHit) {
        const oldKey = termHit.factors[0]?.key;
        termHit.factors = toFactors(spec, key);
        const lead = termHit.factors[termHit.factors.length - 1];
        if (oldKey && lead && !termHit.factors.some((f) => f.key === oldKey)) from[lead.key] = oldKey;
      } else throw new Error(`moves ${this.id}: resolve() found no term or factor "${key}"`);
    }
    return this.push({
      eq,
      hints: {
        from,
        exit
      }
    });
  }
  substitute(map) {
    return this.resolve(map);
  }
  chainSplit(termKey, factors, from = {}) {
    const { term: old } = findTerm(this.current(), termKey);
    if (!old.op) throw new Error(`moves ${this.id}: chainSplit("${termKey}") needs an operator on the term`);
    const op = old.op;
    const constants = factors.filter((f) => !f.op && old.factors.some((o) => o.key === f.key));
    const operated = factors.filter((f) => f.op);
    const target = operated[0];
    const run = () => {
      const canPull = constants.length > 0 && target && old.factors.length === constants.length + 1;
      if (canPull) {
        const eq2 = this.current();
        const { term: t2 } = findTerm(eq2, termKey);
        const body = old.factors.find((o) => !constants.some((c) => c.key === o.key));
        if (!body) throw new Error(`moves ${this.id}: chainSplit could not find the operated body`);
        t2.op = null;
        t2.dots = true;
        t2.factors = [...constants.map((c) => ({
          key: c.key,
          tex: c.tex,
          op: null,
          chunk: null
        })), {
          key: target.key,
          tex: body.tex,
          op,
          chunk: null
        }];
        const path = {};
        for (const c of constants) path[c.key] = "over";
        this.push({
          eq: eq2,
          hints: {
            from: {
              [`${target.key}.op`]: `${termKey}.op`,
              [`${target.key}.lb`]: `${termKey}.lb`,
              [`${target.key}.rb`]: `${termKey}.rb`,
              ...target.key !== body.key ? { [target.key]: body.key } : {}
            },
            path,
            enter: { "*.dot": "fade" },
            phases: [[...constants.map((c) => c.key), `${termKey}.s`], [target.key, `${target.key}.*`]]
          }
        });
      }
      const eq = this.current();
      const { term: t } = findTerm(eq, termKey);
      const map = { ...from };
      if (!canPull) for (const f of operated) {
        map[`${f.key}.op`] ??= `${termKey}.op`;
        map[`${f.key}.lb`] ??= `${termKey}.lb`;
        map[`${f.key}.rb`] ??= `${termKey}.rb`;
      }
      t.op = null;
      t.dots = true;
      t.factors = factors.map((f) => ({
        key: f.key,
        tex: f.tex,
        op: f.op ?? null,
        chunk: f.chunk ?? null
      }));
      const phases = operated.flatMap((f) => map[f.key] && map[f.key] !== f.key ? [[f.key], [`${f.key}.*`]] : [[f.key, `${f.key}.*`]]);
      this.push({
        eq,
        hints: {
          from: map,
          enter: {
            "*.g": "fade",
            "*.dot": "fade",
            "*.lb": "grow",
            "*.rb": "grow"
          },
          phases
        }
      });
    };
    if (this.inGroup) run();
    else this.group(run);
    return this;
  }
  cancel(pair, after) {
    const marked = this.current();
    const wasGrouped = this.inGroup;
    const run = () => {
      this.push({
        eq: marked,
        hints: { emphasis: {
          [pair[0]]: "cancel",
          [pair[1]]: "cancel"
        } }
      });
      const eq = this.current();
      for (const [key, tex] of Object.entries(after)) {
        const hit = findFactor(eq, key);
        if (!hit) throw new Error(`moves ${this.id}: cancel() found no factor "${key}"`);
        if (tex === null) hit.term.factors.splice(hit.index, 1);
        else hit.factor.tex = tex;
      }
      for (const side of [eq.lhs, eq.rhs]) for (const t of side.terms) if (t.factors.length === 1) {
        t.dots = false;
        t.factors[0].chunk = null;
      }
      const exit = {
        [pair[0]]: "collapse",
        [pair[1]]: "collapse"
      };
      for (const [key, tex] of Object.entries(after)) if (tex === null) exit[`${key}*`] = "collapse";
      this.push({
        eq,
        hints: { exit }
      });
    };
    if (wasGrouped) run();
    else this.group(run);
    return this;
  }
  moveAcross(termKey, options = {}) {
    const run = () => {
      const eq = this.current();
      const { side, index, term: t } = findTerm(eq, termKey);
      side.terms.splice(index, 1);
      const other = side === eq.lhs ? eq.rhs : eq.lhs;
      t.sign = t.sign === "+" ? "-" : "+";
      t.showPlus = !options.bareLanding;
      const exit = options.bareLanding ? { [`${termKey}.s`]: "fade" } : {};
      if (other.terms.length === 1 && other.terms[0].factors.length === 1 && other.terms[0].factors[0].tex.trim() === "0") {
        exit[`${other.terms[0].key}*`] = options.bareLanding ? "vacate" : "collapse";
        other.terms = [t];
      } else if (options.to === "start") other.terms.unshift(t);
      else other.terms.push(t);
      if (!side.terms.length) side.terms.push(toTerm({
        key: `${side.key}0`,
        tex: "0"
      }));
      this.push({
        eq,
        hints: {
          path: Object.fromEntries(termPatterns(t).map((p) => [p, "over"])),
          exit,
          emphasis: options.bareLanding ? {} : { [`${termKey}.s`]: "indicate" }
        }
      });
      const after = this.current();
      const moved = findTerm(after, termKey);
      moved.term.showPlus = false;
      if (!options.bareLanding && moved.index === 0 && moved.term.sign === "+") this.push({
        eq: after,
        hints: { exit: { [`${termKey}.s`]: "collapse" } }
      });
      else this.eq = after;
    };
    if (this.inGroup) run();
    else this.group(run);
    return this;
  }
  swapSides() {
    const eq = this.current();
    const lhsTerms = eq.lhs.terms;
    eq.lhs.terms = eq.rhs.terms;
    eq.rhs.terms = lhsTerms;
    const path = {};
    for (const t of eq.lhs.terms) for (const p of termPatterns(t)) path[p] = "under";
    for (const t of eq.rhs.terms) for (const p of termPatterns(t)) path[p] = "over";
    return this.push({
      eq,
      hints: { path }
    });
  }
  setSide(side, tex, key = `${side}0`, options = {}) {
    const eq = this.current();
    const target = side === "L" ? eq.lhs : eq.rhs;
    const exit = {};
    for (const t of target.terms) exit[`${t.key}*`] = options.atomic ? "fade" : "collapse";
    target.terms = [toTerm({
      key,
      tex
    })];
    target.op = null;
    return this.push({
      eq,
      hints: {
        exit,
        enter: { [key]: options.atomic ? "replace" : "grow" }
      }
    });
  }
  emphasize(emphasis) {
    return this.push({
      eq: this.current(),
      hints: { emphasis }
    });
  }
  mark(emphasis) {
    const last = this.states[this.states.length - 1];
    if (!last) throw new Error(`moves ${this.id}: nothing to mark`);
    last.emphasis = {
      ...last.emphasis ?? {},
      ...emphasis
    };
    return this;
  }
  to(eq, hints = {}, keep = false) {
    return this.push({
      eq: clone(eq),
      hints,
      keep
    });
  }
  peek() {
    return this.current();
  }
  build() {
    return defineDerivation({
      id: this.id,
      roles: this.options.roles,
      maxLines: this.options.maxLines,
      states: this.states
    });
  }
};
function derive(id, options = {}) {
  return new DerivationBuilder(id, options);
}
var FilmEntry = createContext(0);
var ROUTE_ENTRY_KEY = "bdr-route-entry";
function markRouteEntry(slug) {
  try {
    window.sessionStorage.setItem(ROUTE_ENTRY_KEY, slug);
  } catch {
  }
}
function takeRouteEntry(slug) {
  try {
    const mark = window.sessionStorage.getItem(ROUTE_ENTRY_KEY);
    window.sessionStorage.removeItem(ROUTE_ENTRY_KEY);
    return mark === slug;
  } catch {
    return false;
  }
}
function createTimeline(segments) {
  const starts = [];
  const ends = [];
  let clock = 0;
  for (const segment of segments) {
    if (!(segment.duration >= 0) || !Number.isFinite(segment.duration)) throw new Error(`Film segment ${segment.key} needs a finite, non-negative duration`);
    starts.push(clock);
    clock += segment.duration;
    ends.push(clock);
  }
  return {
    keys: segments.map((segment) => segment.key),
    starts,
    ends,
    total: clock
  };
}
function settledTime(timeline, step) {
  const index = Math.max(0, Math.min(timeline.ends.length - 1, step));
  return timeline.ends[index];
}
function planStep(timeline, previous, step, entering, reducedMotion) {
  const to = settledTime(timeline, step);
  const from = timeline.starts[Math.max(0, Math.min(timeline.starts.length - 1, step))];
  const single = previous !== null && step === previous + 1;
  if (entering && single && !reducedMotion && to > from) return {
    kind: "play",
    step,
    from,
    to
  };
  return {
    kind: "jump",
    step,
    t: to
  };
}
function planEntry(timeline, reducedMotion) {
  const from = timeline.starts[0] ?? 0;
  const to = settledTime(timeline, 0);
  if (!reducedMotion && to > from) return {
    kind: "play",
    step: 0,
    from,
    to
  };
  return {
    kind: "jump",
    step: 0,
    t: to
  };
}
function clockFromPlan(plan) {
  return plan.kind === "play" ? {
    step: plan.step,
    t: plan.from,
    playing: {
      from: plan.from,
      to: plan.to,
      startedAt: null
    }
  } : {
    step: plan.step,
    t: plan.t,
    playing: null
  };
}
function advanceClock(clock, now) {
  if (!clock.playing) return clock;
  const startedAt = clock.playing.startedAt ?? now;
  const t = Math.min(clock.playing.to, clock.playing.from + (now - startedAt) / 1e3);
  return t >= clock.playing.to ? {
    step: clock.step,
    t: clock.playing.to,
    playing: null
  } : {
    step: clock.step,
    t,
    playing: {
      ...clock.playing,
      startedAt
    }
  };
}
var smoothstep = (u) => {
  const x = Math.max(0, Math.min(1, u));
  return x * x * (3 - 2 * x);
};
function hermiteWarp(knots) {
  for (let k = 1; k < knots.length; k += 1) if (!(knots[k][0] > knots[k - 1][0]) || knots[k][1] < knots[k - 1][1]) throw new Error("Warp knots must increase");
  return (time) => {
    if (time <= knots[0][0]) return knots[0][1];
    const last = knots[knots.length - 1];
    if (time >= last[0]) return last[1];
    let k = 0;
    while (k < knots.length - 2 && knots[k + 1][0] <= time) k += 1;
    const [t0, r0, m0] = knots[k];
    const [t1, r1, m1] = knots[k + 1];
    const h = t1 - t0;
    const u = (time - t0) / h;
    const u2 = u * u;
    const u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * r0 + (u3 - 2 * u2 + u) * h * m0 + (-2 * u3 + 3 * u2) * r1 + (u3 - u2) * h * m1;
  };
}
var FILM_TOKENS = [
  "paper",
  "ink",
  "ink-muted",
  "guide",
  "lower",
  "lower-soft",
  "buncher",
  "buncher-soft",
  "upper",
  "upper-soft",
  "cosine",
  "sine",
  "ui",
  "display",
  "math"
];
var FALLBACK_THEME = {
  paper: "#fcfaf6",
  ink: "#231f20",
  "ink-muted": "#6f6962",
  guide: "#afabab",
  lower: "#00a5ab",
  "lower-soft": "#66c9cc",
  buncher: "#ea1c35",
  "buncher-soft": "#f27685",
  upper: "#394ba0",
  "upper-soft": "#8893c6",
  cosine: "#1b2742",
  sine: "#836328",
  ui: "system-ui, sans-serif",
  display: "Georgia, serif",
  math: "Georgia, serif"
};
function readFilmTheme(element) {
  if (!element || typeof getComputedStyle !== "function") return FALLBACK_THEME;
  const style = getComputedStyle(element);
  const theme = { ...FALLBACK_THEME };
  for (const token of FILM_TOKENS) {
    const value = style.getPropertyValue(`--${token}`).trim();
    if (value) theme[token] = value;
  }
  return theme;
}
var serialize = (theme) => FILM_TOKENS.map((token) => theme[token]).join("");
var FALLBACK_KEY = serialize(FALLBACK_THEME);
function subscribeTheme(onChange) {
  if (typeof MutationObserver !== "function") return () => {
  };
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [
      "data-theme",
      "class",
      "style"
    ]
  });
  if (document.body) observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-theme", "class"]
  });
  return () => observer.disconnect();
}
function useFilmTheme(root) {
  const key = useSyncExternalStore(subscribeTheme, () => root ? serialize(readFilmTheme(root)) : FALLBACK_KEY, () => FALLBACK_KEY);
  return useMemo(() => {
    const values = key.split("");
    return Object.fromEntries(FILM_TOKENS.map((token, index) => [token, values[index]]));
  }, [key]);
}
function subscribeMotion(onChange) {
  const query = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)");
  query?.addEventListener?.("change", onChange);
  return () => query?.removeEventListener?.("change", onChange);
}
function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false, () => false);
}
function FilmFigure({ film, step, entering, className = "" }) {
  const { timeline, viewBox, Overlay } = film;
  const fitMin = film.fitHeight?.min ?? viewBox.height;
  const fitMax = film.fitHeight?.max ?? viewBox.height;
  const reduced = useReducedMotion();
  const [root, setRoot] = useState(null);
  const canvasRef = useRef(null);
  const theme = useFilmTheme(root);
  const [assets, setAssets] = useState(null);
  const [failed, setFailed] = useState(false);
  const [size, setSize] = useState(null);
  const entry = useContext(FilmEntry);
  const [seenEntry, setSeenEntry] = useState(entry);
  const [clock, setClock] = useState(() => clockFromPlan(entry > 0 && step === 0 ? planEntry(timeline, reduced) : planStep(timeline, null, step, entering, reduced)));
  if (entry !== seenEntry) {
    setSeenEntry(entry);
    if (step === 0 && entry > 0) setClock(clockFromPlan(planEntry(timeline, reduced)));
  } else if (clock.step !== step) setClock(clockFromPlan(planStep(timeline, clock.step, step, entering, reduced)));
  else if (reduced && clock.playing) setClock({
    step,
    t: settledTime(timeline, step),
    playing: null
  });
  useEffect(() => {
    let live = true;
    film.load().then((value) => live && setAssets(() => value), () => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [film]);
  const playing = clock.playing !== null && assets !== null;
  useEffect(() => {
    if (!playing) return;
    let frame = requestAnimationFrame(function tick(now) {
      setClock((current) => advanceClock(current, now));
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  useEffect(() => {
    if (!root) return;
    const measure = () => {
      const box = root.getBoundingClientRect();
      const fitted = box.width > 0 ? Math.round(viewBox.width * box.height / box.width) : viewBox.height;
      const units = Math.max(fitMin, Math.min(fitMax, fitted));
      const width = Math.max(1, Math.min(box.width, box.height * viewBox.width / units));
      const height = width * units / viewBox.width;
      const dpr = Math.min(3, globalThis.devicePixelRatio || 1);
      setSize((old) => old && Math.abs(old.width - width) < 0.5 && Math.abs(old.height - height) < 0.5 && old.dpr === dpr && old.units === units ? old : {
        width,
        height,
        dpr,
        units
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    const media = globalThis.matchMedia?.(`(resolution: ${globalThis.devicePixelRatio || 1}dppx)`);
    media?.addEventListener?.("change", measure);
    return () => {
      observer.disconnect();
      media?.removeEventListener?.("change", measure);
    };
  }, [
    root,
    viewBox.height,
    viewBox.width,
    fitMin,
    fitMax
  ]);
  const t = clock.t;
  const viewHeight = size?.units ?? viewBox.height;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !size) return;
    const backingWidth = Math.round(size.width * size.dpr);
    const backingHeight = Math.round(size.height * size.dpr);
    if (canvas.width !== backingWidth) canvas.width = backingWidth;
    if (canvas.height !== backingHeight) canvas.height = backingHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(backingWidth / viewBox.width, 0, 0, backingHeight / viewHeight, 0, 0);
    film.draw(ctx, t, assets, theme, {
      width: viewBox.width,
      height: viewHeight
    });
  }, [
    assets,
    film,
    size,
    t,
    theme,
    viewHeight,
    viewBox.width
  ]);
  const state = failed ? "failed" : assets === null ? "loading" : clock.playing ? "playing" : "held";
  const frameStyle = size ? {
    width: `${size.width}px`,
    height: `${size.height}px`
  } : void 0;
  return jsx("div", {
    ref: setRoot,
    className: `film-figure ${className}`.trim(),
    "data-film-state": state,
    "data-film-step": step,
    "data-film-t": t.toFixed(3),
    "aria-busy": state === "loading",
    children: jsxs("div", {
      className: "film-frame",
      style: frameStyle,
      children: [jsx("canvas", {
        ref: canvasRef,
        className: "film-canvas",
        role: "img",
        "aria-label": film.ariaLabel(t)
      }), Overlay && jsx("svg", {
        className: "film-overlay",
        viewBox: `0 0 ${viewBox.width} ${viewHeight}`,
        "aria-hidden": "true",
        children: jsx(Overlay, {
          t,
          assets,
          theme,
          view: {
            width: viewBox.width,
            height: viewHeight
          }
        })
      })]
    })
  });
}
function decodeTracks(buffer, { mouthY = 430 } = {}) {
  const view = new DataView(buffer);
  const words = new Uint16Array(buffer.byteLength >> 1);
  for (let i = 0; i < words.length; i += 1) words[i] = view.getUint16(i * 2, true);
  const [fps, count, frames] = words;
  const start = new Uint32Array(count);
  const length = new Uint32Array(count);
  const offset = new Uint32Array(count);
  let cursor = 3;
  for (let i = 0; i < count; i += 1) {
    start[i] = words[cursor];
    length[i] = words[cursor + 1];
    offset[i] = cursor + 2;
    cursor += 2 + 2 * length[i];
  }
  if (cursor !== words.length) throw new Error("Track file length does not match its header");
  const landed = new Float64Array(count);
  const mouth = mouthY * 16;
  for (let i = 0; i < count; i += 1) {
    const base = offset[i];
    const n = length[i];
    let found = n - 1;
    for (let f = 0; f < n; f += 1) {
      const y = words[base + 2 * f + 1];
      if (y < mouth) continue;
      if (words[base + 2 * Math.min(n - 1, f + 5) + 1] - y < 8) {
        found = f;
        break;
      }
    }
    landed[i] = start[i] + found;
  }
  return {
    fps,
    count,
    frames,
    duration: frames / fps,
    start,
    length,
    offset,
    words,
    landed
  };
}
function ballAt(tracks, i, seconds, out) {
  const f = Math.min(tracks.frames, Math.max(0, seconds) * tracks.fps) - tracks.start[i];
  if (f < 0) return false;
  const n = tracks.length[i];
  const a = Math.min(n - 1, Math.floor(f));
  const b = Math.min(n - 1, a + 1);
  const u = b === a ? 0 : f - Math.floor(f);
  const base = tracks.offset[i];
  out[0] = (tracks.words[base + 2 * a] * (1 - u) + tracks.words[base + 2 * b] * u) / 16;
  out[1] = (tracks.words[base + 2 * a + 1] * (1 - u) + tracks.words[base + 2 * b + 1] * u) / 16;
  return true;
}
function hasLanded(tracks, i, seconds) {
  return seconds * tracks.fps >= tracks.landed[i];
}
function finalPosition(tracks, i) {
  const base = tracks.offset[i] + 2 * (tracks.length[i] - 1);
  return [tracks.words[base] / 16, tracks.words[base + 1] / 16];
}
var cache = new Map();
function fetchTrackBuffer(url) {
  let pending = cache.get(url);
  if (!pending) {
    pending = fetch(url).then((response) => {
      if (!response.ok) throw new Error(`Could not load ${url}`);
      return response.arrayBuffer();
    });
    pending.catch(() => cache.delete(url));
    cache.set(url, pending);
  }
  return pending;
}
var TRACE_STYLE = Object.freeze({
  width: 1.16,
  alpha: 0.3,
  halo: 2.06,
  haloAlpha: 0.16
});
function ballTrace(at, t, options) {
  if (options.reduced) return null;
  const head = at(t);
  if (!head) return null;
  const path = [head];
  let length = 0;
  for (let k = 1; k <= options.samples; k += 1) {
    const point = at(t - options.lag * k / options.samples);
    if (!point) break;
    const last = path[path.length - 1];
    const step = Math.hypot(point[0] - last[0], point[1] - last[1]);
    if (step === 0) continue;
    if (length + step >= options.cap) {
      const u = (options.cap - length) / step;
      path.push([last[0] + (point[0] - last[0]) * u, last[1] + (point[1] - last[1]) * u]);
      length = options.cap;
      break;
    }
    path.push(point);
    length += step;
  }
  return length > (options.minLength ?? 0.5) ? path : null;
}
function drawTraces(ctx, traces, color) {
  const groups = new Map();
  for (const trace of traces) {
    const level = Math.ceil(trace.strength * 4 - 1e-9) / 4;
    if (level <= 0) continue;
    let list = groups.get(level);
    if (!list) groups.set(level, list = []);
    list.push(trace);
  }
  const base = ctx.globalAlpha;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "butt";
  ctx.lineJoin = "round";
  for (const [level, list] of groups) {
    const radius = list.reduce((sum, trace) => sum + trace.radius, 0) / list.length;
    ctx.globalAlpha = base * TRACE_STYLE.alpha * level;
    ctx.lineWidth = radius * TRACE_STYLE.width;
    ctx.beginPath();
    for (const { path } of list) {
      ctx.moveTo(path[0][0], path[0][1]);
      for (let k = 1; k < path.length; k += 1) ctx.lineTo(path[k][0], path[k][1]);
    }
    ctx.stroke();
    ctx.globalAlpha = base * TRACE_STYLE.haloAlpha * level;
    ctx.beginPath();
    for (const { path, radius: r } of list) {
      ctx.moveTo(path[0][0] + r * TRACE_STYLE.halo, path[0][1]);
      ctx.arc(path[0][0], path[0][1], r * TRACE_STYLE.halo, 0, Math.PI * 2);
    }
    ctx.fill();
  }
  ctx.globalAlpha = base;
  return groups.size;
}
function prefersReducedMotion() {
  return globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}
var EPS = 1e-9;
function stackBalls(input) {
  const { count, radius: R } = input;
  const D = 2 * R, D2 = D * D;
  const x = new Float64Array(count), h = new Float64Array(count);
  const members = new Map();
  const tops = new Map();
  let maxHeight = 0;
  for (let n = 0; n < count; n += 1) {
    const i = input.order ? input.order[n] : n;
    const bin = input.bin(i);
    let list = members.get(bin);
    if (!list) members.set(bin, list = []);
    const [wallL, wallR] = input.walls(bin);
    const lo = wallL + R, hi = Math.max(lo, wallR - R);
    const tie = i * 37 % 2 ? 1 : -1;
    let px = Math.max(lo, Math.min(hi, input.dropX(i)));
    let ph = Infinity;
    let support = -1;
    let dir = 0;
    let placed = false;
    for (let iteration = 0; iteration < 400 && !placed; iteration += 1) {
      if (support < 0) {
        let best = R, who = -1;
        for (const j2 of list) {
          const dx2 = px - x[j2];
          if (dx2 * dx2 >= D2) continue;
          const contact = h[j2] + Math.sqrt(D2 - dx2 * dx2);
          if (contact > best && contact <= ph + EPS) {
            best = contact;
            who = j2;
          }
        }
        ph = best;
        if (who < 0) {
          placed = true;
          break;
        }
        support = who;
        const dx = px - x[who];
        dir = Math.abs(dx) > EPS ? Math.sign(dx) : px >= hi - EPS ? -1 : px <= lo + EPS ? 1 : tie;
      }
      const j = support;
      const phi0 = Math.atan2(Math.abs(px - x[j]), ph - h[j]);
      let bestPhi = Math.PI / 2 + EPS, bx = 0, bh = 0, kind = 0, other = -1;
      const wall = dir > 0 ? hi : lo;
      const wdx = wall - x[j];
      if (wdx * dir >= -EPS && wdx * wdx <= D2 + 1e-9) {
        const phi = Math.atan2(Math.abs(wdx), Math.sqrt(Math.max(0, D2 - wdx * wdx)));
        if (phi >= phi0 - 1e-7 && phi < bestPhi) {
          bestPhi = phi;
          bx = wall;
          bh = h[j] + Math.sqrt(Math.max(0, D2 - wdx * wdx));
          kind = 1;
        }
      }
      for (const k of list) {
        if (k === j) continue;
        const tx = x[k] - px, th = h[k] - ph;
        if (Math.abs(tx * tx + th * th - D2) < 1e-6) {
          if (tx * dir > EPS && 0 < bestPhi) {
            bestPhi = phi0;
            bx = px;
            bh = ph;
            kind = 2;
            other = k;
          }
          continue;
        }
        const ex = x[k] - x[j], eh = h[k] - h[j], d2 = ex * ex + eh * eh;
        if (d2 >= 4 * D2 || d2 < EPS) continue;
        const d = Math.sqrt(d2), a = d / 2, q = Math.sqrt(Math.max(0, D2 - a * a));
        const mx = x[j] + ex / 2, mh = h[j] + eh / 2;
        for (const s of [1, -1]) {
          const cx = mx - s * eh * q / d, ch = mh + s * ex * q / d;
          const rx = cx - x[j], rh = ch - h[j];
          if (rx * dir < -EPS || rh < -EPS) continue;
          const phi = Math.atan2(Math.abs(rx), rh);
          if (phi < phi0 - 1e-7 || phi >= bestPhi) continue;
          bestPhi = phi;
          bx = cx;
          bh = ch;
          kind = 2;
          other = k;
        }
      }
      if (kind === 0) {
        px = Math.max(lo, Math.min(hi, x[j] + dir * D));
        ph = h[j];
        support = -1;
        continue;
      }
      px = bx;
      ph = bh;
      if (kind === 1) {
        placed = true;
        break;
      }
      if ((px - x[j]) * (x[other] - px) > EPS) {
        placed = true;
        break;
      }
      if (ph < h[other] + EPS) {
        support = -1;
        continue;
      }
      support = other;
      dir = Math.abs(px - x[other]) > EPS ? Math.sign(px - x[other]) : dir;
    }
    for (let guard = 0; guard < 8; guard += 1) {
      let lift = -Infinity;
      for (const j of list) {
        const dx = px - x[j], dh = ph - h[j];
        if (dx * dx + dh * dh < D2 - 1e-6) lift = Math.max(lift, h[j] + Math.sqrt(Math.max(0, D2 - dx * dx)));
      }
      if (lift === -Infinity) break;
      ph = lift;
    }
    x[i] = px;
    h[i] = ph;
    list.push(i);
    const top = ph + R;
    if (top > (tops.get(bin) ?? 0)) tops.set(bin, top);
    if (top > maxHeight) maxHeight = top;
  }
  return {
    x,
    h,
    radius: R,
    tops,
    maxHeight
  };
}
var MARK = /\\k\{([A-Za-z][A-Za-z0-9_.:-]*)\}/g;
var LINE = "*";
function namesOf(spec) {
  const names = new Set();
  for (const state of spec.states) for (const match of state.tex.matchAll(MARK)) names.add(match[1]);
  return names;
}
function renamer(prefix, names) {
  const key = (value) => {
    if (value === LINE) return value;
    if (value.includes("*")) return `${prefix}${value}`;
    return names.has(value) ? `${prefix}${value}` : value;
  };
  const map = (record) => record ? Object.fromEntries(Object.entries(record).map(([name, value]) => [key(name), value])) : void 0;
  return {
    key,
    map
  };
}
function namespaced(spec, prefix) {
  const { key, map } = renamer(prefix, namesOf(spec));
  return {
    states: spec.states.map((state) => {
      const next = {
        ...state,
        tex: state.tex.replace(MARK, (_, name) => `\\k{${prefix}${name}}`)
      };
      if (state.from) next.from = Object.fromEntries(Object.entries(state.from).map(([to, from]) => [key(to), key(from)]));
      if (state.emphasis) next.emphasis = map(state.emphasis);
      if (state.roles) next.roles = map(state.roles);
      if (state.chunks) next.chunks = map(state.chunks);
      if (state.enter) next.enter = map(state.enter);
      if (state.exit) next.exit = map(state.exit);
      if (state.path) next.path = map(state.path);
      if (state.phases) next.phases = state.phases.map((group) => group.map(key));
      return next;
    }),
    roles: map(spec.roles) ?? {}
  };
}
function chainDerivations(id, parts) {
  if (!parts.length) throw new Error(`chain ${id}: needs at least one derivation`);
  const states = [];
  const roles = {};
  const offsets = {};
  const counts = {};
  let offset = 0;
  parts.forEach((part, index) => {
    if (part.name in offsets) throw new Error(`chain ${id}: duplicate part "${part.name}"`);
    const prefix = `${part.name}:`;
    const renamed = namespaced(part.spec, prefix);
    Object.assign(roles, renamed.roles);
    renamed.states.forEach((state, local) => {
      if (local === 0 && index > 0) {
        const previous = `${parts[index - 1].name}:`;
        const link = part.link ? Object.fromEntries(Object.entries(part.link).map(([to, from]) => [`${prefix}${to}`, `${previous}${from}`])) : void 0;
        states.push({
          ...state,
          keep: link ? void 0 : true,
          sub: void 0,
          ...link ? { from: {
            ...link,
            ...state.from ?? {}
          } } : {}
        });
      } else states.push(state);
    });
    offsets[part.name] = offset;
    counts[part.name] = stepCount(part.spec);
    offset += counts[part.name];
  });
  const spec = defineDerivation({
    id,
    states,
    roles,
    maxLines: Math.max(...parts.map((part) => part.spec.maxLines ?? 3)),
    parts: parts.map((part) => ({
      name: part.name,
      start: offsets[part.name],
      count: counts[part.name]
    }))
  });
  const at = (name, step = 0) => {
    if (!(name in offsets)) throw new Error(`chain ${id}: no part "${name}"`);
    if (step < 0 || step >= counts[name]) throw new Error(`chain ${id}: ${name} has no step ${step}`);
    return offsets[name] + step;
  };
  return {
    spec,
    at,
    offsets,
    counts
  };
}
function Link({ href, children, prefetch, ...rest }) {
  return jsx("a", {
    href,
    ...rest,
    children
  });
}
function derivationStepFor(steps, index) {
  const i = Math.max(0, Math.min(steps.length - 1, index));
  const stage = steps[i]?.stage;
  for (let j = i; j >= 0 && steps[j].stage === stage; j -= 1) {
    const at = steps[j].derivationAt;
    if (typeof at === "number" || at === null) return at;
  }
  return null;
}
function stageSpan(steps, index) {
  const stage = steps[index].stage;
  let first = index;
  let last = index;
  while (first > 0 && steps[first - 1].stage === stage) first -= 1;
  while (last < steps.length - 1 && steps[last + 1].stage === stage) last += 1;
  return {
    first,
    last
  };
}
function shownStep(steps, spec, index) {
  const at = derivationStepFor(steps, index);
  if (at === null || isEmptyAt(spec, at)) return null;
  const count = compileDerivation(spec).stepEnds.length;
  return Math.max(0, Math.min(count - 1, at));
}
function partRange(spec, at) {
  const count = compileDerivation(spec).stepEnds.length;
  for (const part of spec.parts ?? []) if (at >= part.start && at < part.start + part.count) return {
    start: part.start,
    end: part.start + part.count - 1
  };
  return {
    start: 0,
    end: count - 1
  };
}
function derivationEnd(steps, stages, index) {
  const spec = stages[steps[index].stage]?.derivation;
  if (!spec) return null;
  const at = shownStep(steps, spec, index);
  if (at === null) return null;
  const { end } = partRange(spec, at);
  if (at >= end) return null;
  const { last } = stageSpan(steps, index);
  let furthest = null;
  for (let j = index + 1; j <= last; j += 1) {
    const d = shownStep(steps, spec, j);
    if (d !== null && d > end) break;
    if (d === null || d < at) continue;
    if (d === end) return j;
    if (furthest === null || d > (shownStep(steps, spec, furthest) ?? -1)) furthest = j;
  }
  return furthest;
}
function derivationStart(steps, stages, index) {
  const spec = stages[steps[index].stage]?.derivation;
  if (!spec) return null;
  const at = shownStep(steps, spec, index);
  if (at === null) return null;
  const { start } = partRange(spec, at);
  const { first } = stageSpan(steps, index);
  let earliest = null;
  for (let j = index - 1; j >= first; j -= 1) {
    const d = shownStep(steps, spec, j);
    if (d === null || d < start || d > at) break;
    earliest = j;
  }
  return earliest;
}
function sequenceEnd(steps, stages, index) {
  return derivationEnd(steps, stages, index) ?? stageSpan(steps, index).last;
}
function sequenceStart(steps, stages, index) {
  return derivationStart(steps, stages, index) ?? stageSpan(steps, index).first;
}
function optionalSkipTarget(steps, stages, index) {
  const stage = steps[index]?.stage;
  if (stage === void 0 || !stages[stage]?.optional) return null;
  const { first, last } = stageSpan(steps, index);
  if (index !== first || last + 1 >= steps.length) return null;
  return last + 1;
}
function boardRows(spec) {
  const compiled = compileDerivation(spec);
  const rows = [];
  const partOf = (step) => {
    const index = (spec.parts ?? []).findIndex((p) => step >= p.start && step < p.start + p.count);
    return index < 0 ? 0 : index;
  };
  compiled.stepEnds.forEach((state, step) => {
    if (compiled.lines[state].empty) return;
    const previous = rows[rows.length - 1];
    if (previous && previous.lastStep === step - 1 && spec.states[previous.state].tex === spec.states[state].tex) {
      previous.lastStep = step;
      previous.state = state;
      return;
    }
    rows.push({
      firstStep: step,
      lastStep: step,
      state,
      part: partOf(step)
    });
  });
  return rows;
}
function DerivationBoard({ derivation, at, title, eyebrow, stepLabel, onClose }) {
  const compiled = useMemo(() => compileDerivation(derivation), [derivation]);
  const rows = useMemo(() => boardRows(derivation), [derivation]);
  const listRef = useRef(null);
  const closeRef = useRef(null);
  const html = useMemo(() => rows.map((row) => ({
    visual: { __html: lineMarkup(compiled, row.state) },
    sr: { __html: compiled.lines[row.state].mathml }
  })), [compiled, rows]);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const fitAll = () => list.querySelectorAll(".dv-board-line .dv-stage").forEach((stage) => fitStack(stage));
    fitAll();
    let lastWidth = list.clientWidth;
    const observer = new ResizeObserver(() => {
      if (list.clientWidth === lastWidth) return;
      lastWidth = list.clientWidth;
      fitAll();
    });
    observer.observe(list);
    document.fonts?.ready.then(fitAll).catch(() => {
    });
    return () => observer.disconnect();
  }, [html]);
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    listRef.current?.querySelector(".dv-board-row.is-current")?.scrollIntoView({ block: "nearest" });
  }, [at, rows]);
  return jsxs("section", {
    className: "dv-board",
    role: "dialog",
    "aria-modal": "false",
    "aria-labelledby": "dv-board-title",
    children: [jsxs("header", {
      className: "dv-board-head",
      children: [jsxs("div", { children: [jsxs("p", {
        className: "dv-board-eyebrow",
        children: [eyebrow, " · The whole derivation"]
      }), jsx("h2", {
        className: "dv-board-title",
        id: "dv-board-title",
        children: title
      })] }), jsx("button", {
        type: "button",
        ref: closeRef,
        className: "dv-board-close",
        onClick: onClose,
        "aria-label": "Close the whole derivation",
        title: "Close (B or Esc)",
        children: jsx("svg", {
          viewBox: "0 0 16 16",
          "aria-hidden": "true",
          children: jsx("path", { d: "M3.5 3.5l9 9M12.5 3.5l-9 9" })
        })
      })]
    }), jsx("ol", {
      className: "dv-board-rows",
      ref: listRef,
      children: rows.map((row, index) => {
        const status = at === null || row.firstStep > at ? "ahead" : row.lastStep >= at ? "current" : "done";
        const label = stepLabel(row.firstStep);
        return jsxs("li", {
          className: `dv-board-row is-${status}${index > 0 && rows[index - 1].part !== row.part ? " is-part-start" : ""}`,
          "aria-current": status === "current" ? "step" : void 0,
          children: [jsx("span", {
            className: "dv-board-num",
            "aria-label": label ? `Step ${label}` : void 0,
            children: label ?? ""
          }), jsxs("div", {
            className: "dv dv-board-line",
            children: [jsx("div", {
              className: "dv-stage",
              "aria-hidden": "true",
              dangerouslySetInnerHTML: html[index].visual
            }), jsx("div", {
              className: "dv-sr",
              dangerouslySetInnerHTML: html[index].sr
            })]
          })]
        }, row.firstStep);
      })
    })]
  });
}
var LAYOUT_VARIANTS = [
  "left-392",
  "left-440",
  "left-480",
  "left-520",
  "right-480"
];
function readDevQuery() {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  const out = new URLSearchParams();
  const layout = params.get("layout");
  if (layout && LAYOUT_VARIANTS.includes(layout)) out.set("layout", layout);
  if (params.get("fig") === "fit") out.set("fig", "fit");
  const query = out.toString();
  return query ? `?${query}` : "";
}
var subscribe = (callback) => {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
};
function useDevQuery() {
  return useSyncExternalStore(subscribe, readDevQuery, () => "");
}
function layoutFromQuery(query) {
  const layout = new URLSearchParams(query).get("layout");
  return LAYOUT_VARIANTS.includes(layout ?? "") ? layout : "right-480";
}
var HOLD_ACCELERATION = 0.85;
var realClock = {
  now: () => typeof performance !== "undefined" ? performance.now() : Date.now(),
  after: (ms, run) => globalThis.setTimeout(run, ms),
  clear: (handle) => globalThis.clearTimeout(handle)
};
function createPressMachine(options) {
  const clock = options.clock ?? realClock;
  const doubleTapMs = options.doubleTapMs ?? 300;
  const holdDelayMs = options.holdDelayMs ?? 420;
  const holdBack = options.holdBackRewinds ?? true;
  let pressed = null;
  let held = null;
  let timer = null;
  let lastTap = null;
  const stopTimer = () => {
    if (timer !== null) clock.clear(timer);
    timer = null;
  };
  const tick = (direction, interval) => {
    timer = clock.after(interval, () => {
      timer = null;
      if (held !== direction || pressed !== direction) return;
      options.onIntent({
        kind: "hold-step",
        direction
      });
      tick(direction, Math.max(85, interval * HOLD_ACCELERATION));
    });
  };
  const release = (direction) => {
    if (pressed !== direction) return;
    pressed = null;
    stopTimer();
    if (held === direction) {
      held = null;
      options.onIntent({
        kind: "hold-end",
        direction
      });
    }
  };
  const down = (direction, opts = {}) => {
    if (pressed === direction) return;
    if (pressed) release(pressed);
    pressed = direction;
    const at = clock.now();
    if ((opts.double ?? true) && lastTap && lastTap.direction === direction && at - lastTap.at <= doubleTapMs) {
      lastTap = null;
      options.onIntent({
        kind: "jump",
        direction
      });
    } else {
      lastTap = {
        direction,
        at
      };
      options.onIntent({
        kind: "step",
        direction
      });
    }
    if (direction === "back" && !holdBack) return;
    timer = clock.after(holdDelayMs, () => {
      timer = null;
      if (pressed !== direction) return;
      held = direction;
      lastTap = null;
      options.onIntent({
        kind: "hold-step",
        direction
      });
      tick(direction, 200);
    });
  };
  return {
    down,
    up: release,
    tap(direction, opts) {
      down(direction, opts);
      release(direction);
    },
    cancel() {
      if (pressed) release(pressed);
      stopTimer();
      lastTap = null;
    },
    holding: () => held
  };
}
var FORWARD_KEYS = new Set([
  "ArrowRight",
  "PageDown",
  " ",
  "Spacebar"
]);
var BACK_KEYS = new Set(["ArrowLeft", "PageUp"]);
function keyDirection(key, shiftKey = false) {
  if ((key === " " || key === "Spacebar") && shiftKey) return "back";
  if (FORWARD_KEYS.has(key)) return "forward";
  if (BACK_KEYS.has(key)) return "back";
  return null;
}
function keyBelongsToTarget(target, key) {
  if (!target || !target.tagName) return false;
  const tag = target.tagName.toUpperCase();
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable) return true;
  const role = target.getAttribute?.("role");
  if (role === "slider" || role === "spinbutton" || role === "textbox" || role === "combobox") return true;
  if (key === " " || key === "Spacebar" || key === "Enter") return tag === "BUTTON" || tag === "A" || tag === "SUMMARY" || role === "button" || role === "link";
  return false;
}
function SidebarTitle({ id, stage, title, role, size, crossFade }) {
  const [shown, setShown] = useState({
    id,
    node: title,
    role,
    size,
    entering: false,
    stage
  });
  const [leaving, setLeaving] = useState(null);
  if (shown.id !== id) {
    const fade = crossFade && shown.stage === stage;
    setLeaving(fade ? {
      ...shown,
      nonce: (leaving?.nonce ?? 0) + 1
    } : null);
    setShown({
      id,
      node: title,
      role,
      size,
      entering: fade,
      stage
    });
  } else if (shown.node !== title) setShown({
    ...shown,
    node: title
  });
  return jsxs("h1", {
    className: "sidebar-title",
    "data-crossfade": leaving ? "true" : void 0,
    children: [jsx("span", {
      className: `sidebar-title-text${shown.entering ? " is-entering" : ""}`,
      "data-role": shown.role,
      "data-size": shown.size,
      children: shown.node
    }, shown.id), leaving && jsx("span", {
      className: "sidebar-title-text is-leaving",
      "aria-hidden": "true",
      "data-role": leaving.role,
      "data-size": leaving.size,
      onAnimationEnd: () => setLeaving(null),
      children: leaving.node
    }, `leaving-${leaving.nonce}`)]
  });
}
var REVISED_SIDEBAR_SLUGS = [
  "01-kink",
  "01-pile",
  "01-cdf",
  "02-nonidentification",
  "03-sufficient-statistic",
  "04-random-frictions",
  "04-spectral"
];
function isRevisedSidebar(slug) {
  return REVISED_SIDEBAR_SLUGS.includes(slug);
}
function eyebrowRepeatsTitle(eyebrowLabel, title) {
  const norm = (text) => text.replace(/\s+/g, " ").trim().toLowerCase();
  return norm(eyebrowLabel) !== "" && norm(eyebrowLabel) === norm(title);
}
function titleText(node, exact = false) {
  if (node === null || node === void 0 || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map((child) => titleText(child, exact)).join("");
  if (isValidElement(node)) {
    const props = node.props;
    if (typeof props.tex === "string") {
      if (exact) return "\\(" + props.tex + "\\)";
      return "x".repeat(props.tex.replace(/\\[a-zA-Z]+/g, "x").replace(/[{}^_\s]/g, "").length);
    }
    return titleText(props.children, exact);
  }
  return "";
}
var TITLE_STEPS = [
  46,
  54,
  62
];
function titleSize(text) {
  const length = text.replace(/\s+/g, " ").trim().length;
  if (length <= TITLE_STEPS[0]) return 0;
  if (length <= TITLE_STEPS[1]) return 1;
  if (length <= TITLE_STEPS[2]) return 2;
  return 3;
}
export {
  regionColor as $,
  hermiteWarp as A,
  histogramBars as B,
  ballAt as C,
  hasLanded as D,
  finalPosition as E,
  derive as F,
  fitStack as G,
  createVisibility as H,
  equation as I,
  COLORS as J,
  defineDerivation as K,
  product as L,
  FilmEntry as M,
  markRouteEntry as N,
  FilmFigure as O,
  takeRouteEntry as P,
  deriveModel as Q,
  term as R,
  prefersReducedMotion as S,
  fetchTrackBuffer as T,
  Derivation as U,
  mcPath as V,
  usePrefersReducedMotion as W,
  choiceFor as X,
  DEFAULTS as Y,
  clamp as Z,
  Link as _,
  SidebarTitle as a,
  notchesFrictionlessChapter as at,
  ballTrace as b,
  keyDirection as c,
  taggingNotchesChapter as ct,
  DerivationBoard as d,
  SvgMathLabel as dt,
  capsChapter as et,
  derivationEnd as f,
  derivationStepFor as g,
  sequenceStart as h,
  titleText as i,
  notchExtensionsChapter as it,
  smoothstep as j,
  createTimeline as k,
  layoutFromQuery as l,
  BlockMath as lt,
  sequenceEnd as m,
  isRevisedSidebar as n,
  incomeEffectsChapter as nt,
  createPressMachine as o,
  notchesFrictionsChapter as ot,
  optionalSkipTarget as p,
  isEmptyAt as q,
  titleSize as r,
  menusNotNoiseChapter as rt,
  keyBelongsToTarget as s,
  taggingKinksChapter as st,
  eyebrowRepeatsTitle as t,
  dentsIroningChapter as tt,
  useDevQuery as u,
  InlineMath as ut,
  chainDerivations as v,
  decodeTracks as w,
  drawTraces as x,
  stackBalls as y,
  createFigureScales as z
};
