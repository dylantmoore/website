import { $ as dentsIroningChapter, A as FilmEntry, B as createVisibility, G as isEmptyAt, H as usePrefersReducedMotion, M as takeRouteEntry, Q as capsChapter, U as fitStack, V as Derivation, Y as clamp, _ as Link, a as SidebarTitle, at as taggingKinksChapter, c as keyDirection, d as DerivationBoard, et as incomeEffectsChapter, f as derivationEnd, g as derivationStepFor, h as sequenceStart, i as titleText, it as notchesFrictionsChapter, j as markRouteEntry, l as layoutFromQuery, m as sequenceEnd, n as isRevisedSidebar, nt as notchExtensionsChapter, o as createPressMachine, ot as taggingNotchesChapter, p as optionalSkipTarget, r as titleSize, rt as notchesFrictionlessChapter, s as keyBelongsToTarget, st as BlockMath, t as eyebrowRepeatsTitle, tt as menusNotNoiseChapter, u as useDevQuery } from "./core.js";
import { T as kinkChapter, t as cdfChapter, w as pileChapter } from "./chapter-1.js";
import { a as nonidentificationChapter, i as sufficientStatisticChapter, n as randomFrictionsChapter, r as STEP_INDEX, t as spectralChapter } from "./chapters-2-4.js";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "https://cdn.jsdelivr.net/npm/react@19.2.6/+esm";
import { createRoot } from "https://cdn.jsdelivr.net/npm/react-dom@19.2.6/client/+esm";
import { flushSync } from "https://cdn.jsdelivr.net/npm/react-dom@19.2.6/+esm";
import { Fragment as Fragment$1, jsx, jsxs } from "https://cdn.jsdelivr.net/npm/react@19.2.6/jsx-runtime/+esm";
var CHAPTER_11_TITLE = "Caps, dents, and perceived rates";
var EXTENSION_TITLE = "Extension · The spectral bunching estimator";
var EXTENSION_RETURN = `/04-random-frictions?step=${STEP_INDEX.spectral}`;
var BOOK = [
  {
    id: "I",
    title: "In the Garden: Kinks with No Frictions",
    chapters: [
      {
        id: 1,
        title: "Why bunching occurs",
        sections: [
          {
            slug: "01-kink",
            title: "Choices at a kink",
            status: "ready",
            chapter: kinkChapter
          },
          {
            slug: "01-pile",
            title: "From choices to a pile",
            status: "ready",
            chapter: pileChapter
          },
          {
            slug: "01-cdf",
            title: "From choices to the CDF",
            status: "ready",
            chapter: cdfChapter
          }
        ]
      },
      {
        id: 2,
        title: "Identifying an elasticity",
        sections: [{
          slug: "02-nonidentification",
          title: "Horizontal CDF differences",
          status: "ready",
          chapter: nonidentificationChapter
        }]
      },
      {
        id: 3,
        title: "Bunching as a sufficient statistic",
        sections: [{
          slug: "03-sufficient-statistic",
          title: "Moving the threshold",
          status: "ready",
          chapter: sufficientStatisticChapter
        }]
      }
    ]
  },
  {
    id: "II",
    title: "A Fallen World: Frictions",
    chapters: [{
      id: 4,
      title: "Accounting for Frictions",
      sections: [{
        slug: "04-random-frictions",
        title: "Noise in recorded income",
        status: "ready",
        chapter: randomFrictionsChapter
      }],
      optional: [{
        title: EXTENSION_TITLE,
        slug: "04-spectral"
      }]
    }, {
      id: 5,
      title: "Limited menus of choices",
      sections: [{
        slug: "05-menus-not-noise",
        title: "Choosing from a menu",
        status: "ready",
        chapter: menusNotNoiseChapter
      }]
    }]
  },
  {
    id: "III",
    title: "A Fallen World: Notches",
    chapters: [
      {
        id: 6,
        title: "Notches without frictions",
        sections: [{
          slug: "06-notches-frictionless",
          title: "The threshold and the hole",
          status: "ready",
          chapter: notchesFrictionlessChapter
        }]
      },
      {
        id: 7,
        title: "Moving notches and heterogeneous elasticities",
        sections: [{
          slug: "07-notch-extensions",
          title: "Switching and heterogeneous responses",
          status: "ready",
          chapter: notchExtensionsChapter
        }]
      },
      {
        id: 8,
        title: "Notches with frictions",
        sections: [{
          slug: "08-notches-frictions",
          title: "Choices inside the hole",
          status: "ready",
          chapter: notchesFrictionsChapter
        }]
      }
    ]
  },
  {
    id: "IV",
    title: "Multidimensional Choices (bunching & tagging)",
    chapters: [{
      id: 9,
      title: "Other choices at kinks",
      sections: [{
        slug: "09-tagging-kinks",
        title: "Following other choices",
        status: "ready",
        chapter: taggingKinksChapter
      }]
    }, {
      id: 10,
      title: "Other choices at notches",
      sections: [{
        slug: "10-tagging-notches",
        title: "Resources and selection",
        status: "ready",
        chapter: taggingNotchesChapter
      }]
    }]
  },
  {
    id: "V",
    title: "Other (Possibly Irrelevant) Identification Results",
    chapters: [{
      id: 11,
      title: CHAPTER_11_TITLE,
      sections: [{
        slug: "11-caps",
        title: "Caps and limits",
        status: "ready",
        chapter: capsChapter
      }, {
        slug: "12-dents-ironing",
        title: "Dents, perceived rates, and pseudo-bunching",
        status: "ready",
        chapter: dentsIroningChapter
      }]
    }, {
      id: 12,
      title: "Open questions",
      notesOnly: true,
      sections: [{
        slug: "13-open-questions",
        title: "Questions for further work",
        status: "planned"
      }]
    }]
  }
];
function chapterHref(slug) {
  return `/${slug}`;
}
function deckTitle(chapter, section) {
  return chapter.sections.length > 1 ? section.title : chapter.title;
}
function stamped(definition, id, title) {
  if (definition.id === id && definition.title === title && (definition.label ?? definition.title) === title) return definition;
  return {
    ...definition,
    id,
    title,
    label: title
  };
}
var CHAPTER_PARTS$1 = BOOK.map((part) => ({
  id: part.id,
  title: part.title,
  chapters: part.chapters.flatMap((chapter) => {
    if (chapter.notesOnly) {
      const [first] = chapter.sections;
      return [{
        id: chapter.id,
        slug: first.slug,
        title: chapter.title,
        status: "planned"
      }];
    }
    return chapter.sections.map((section) => {
      const title = deckTitle(chapter, section);
      return section.status === "ready" ? {
        id: chapter.id,
        slug: section.slug,
        title,
        status: section.status,
        chapter: stamped(section.chapter, chapter.id, title)
      } : {
        id: chapter.id,
        slug: section.slug,
        title,
        status: section.status
      };
    });
  })
}));
{
  const part = CHAPTER_PARTS$1.find((entry) => entry.chapters.some((item) => item.slug === "04-random-frictions"));
  if (part) {
    const at = part.chapters.findIndex((item) => item.slug === "04-random-frictions") + 1;
    const chapter = {
      ...stamped(spectralChapter, 4, EXTENSION_TITLE),
      backHref: EXTENSION_RETURN,
      eyebrowFallback: "Extension"
    };
    part.chapters.splice(at, 0, {
      id: 4,
      slug: "04-spectral",
      title: EXTENSION_TITLE,
      status: "ready",
      chapter,
      appendix: true
    });
  }
}
var UNLISTED_ROUTES = [{
  id: 1,
  slug: "01-income-effects",
  title: "Ch.1 · Appendix: income effects",
  status: "ready",
  chapter: incomeEffectsChapter,
  appendix: true
}];
[...CHAPTER_PARTS$1.flatMap((part) => part.chapters).filter((entry) => entry.status === "ready"), ...UNLISTED_ROUTES];
CHAPTER_PARTS$1.flatMap((part) => part.chapters).filter((entry) => entry.status === "ready" && !entry.appendix);
var ROUTES$1 = [
  "01-kink",
  "01-pile",
  "01-cdf",
  "02-nonidentification",
  "03-sufficient-statistic",
  "04-random-frictions",
  "04-spectral"
];
function retitled(entry) {
  for (const part of BOOK) for (const chapter of part.chapters) {
    if (chapter.sections.findIndex((section) => section.slug === entry.slug) === -1) continue;
    const shown = chapter.sections.filter((section) => ROUTES$1.includes(section.slug));
    if (chapter.sections.length > 1 && shown.length === 1) {
      const title = chapter.title;
      return {
        ...entry,
        title,
        chapter: {
          ...entry.chapter,
          title,
          label: title
        }
      };
    }
    return entry;
  }
  return entry;
}
var CHAPTER_PARTS = CHAPTER_PARTS$1.map((part) => ({
  ...part,
  chapters: part.chapters.filter((entry) => entry.status === "ready" && ROUTES$1.includes(entry.slug)).map((entry) => retitled(entry))
})).filter((part) => part.chapters.length > 0);
var ALL_READY_CHAPTERS = CHAPTER_PARTS.flatMap((part) => part.chapters);
var READY_CHAPTERS = ALL_READY_CHAPTERS.filter((entry) => !entry.appendix);
function getChapter(slug) {
  return (ALL_READY_CHAPTERS.find((entry) => entry.slug === slug) ?? READY_CHAPTERS[0]).chapter;
}
function TourLayer(props) {
  return null;
}
function CiteThis(props) {
  return null;
}
var STYLE$1 = `
.bdr-end {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-width: 0;
  height: calc(100% - 8px);
  margin: 4px 0 4px 10px;
  padding: 0 16px;
  border: 1px solid var(--rule);
  background: var(--paper-warm, var(--paper));
  color: var(--ink);
  text-align: right;
}
.bdr-end-kicker {
  font: 600 11px var(--caps);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-muted);
  white-space: nowrap;
}
.bdr-end-line {
  font: 14px/1.25 var(--text);
  white-space: nowrap;
}
.bdr-end-link {
  font: 13px/1.25 var(--text);
  color: var(--buncher);
  text-decoration: underline;
  text-underline-offset: 2px;
  white-space: nowrap;
}
.bdr-end.has-link {
  gap: 0;
}
.bdr-end.has-link .bdr-end-kicker {
  font-size: 10px;
  line-height: 1.2;
}
.bdr-end.has-link .bdr-end-line {
  font-size: 12.5px;
  line-height: 1.2;
}
.bdr-end.has-link .bdr-end-link {
  font-size: 12.5px;
  line-height: 1.2;
}
.bdr-end-link:focus-visible {
  outline: 2px solid var(--buncher);
  outline-offset: 2px;
}
.present-hud .bdr-end-present {
  position: absolute;
  right: 18px;
  bottom: 16px;
  padding: 6px 12px;
  border: 1px solid var(--rule);
  background: var(--paper);
  color: var(--ink-muted);
  font: 600 11px var(--caps);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  pointer-events: auto;
}
`;
var offersExtension = (slug) => slug === "04-random-frictions" && [
  "01-kink",
  "01-pile",
  "01-cdf",
  "02-nonidentification",
  "03-sufficient-statistic",
  "04-random-frictions",
  "04-spectral"
].includes("04-spectral");
function ExtensionOffer() {
  return jsx(Link, {
    className: "bdr-end-link",
    href: "/04-spectral",
    onClick: () => markRouteEntry("04-spectral"),
    children: "Extension: the spectral bunching estimator →"
  });
}
function PublicEnd({ slug }) {
  return jsxs("div", {
    className: offersExtension(slug) ? "bdr-end has-link" : "bdr-end",
    role: "note",
    "aria-label": "End of the chapters posted so far",
    children: [
      jsx("style", { children: STYLE$1 }),
      jsx("span", {
        className: "bdr-end-kicker",
        children: "End of the chapters posted so far"
      }),
      jsx("span", {
        className: "bdr-end-line",
        children: "Later chapters are in preparation."
      }),
      offersExtension(slug) && jsx(ExtensionOffer, {})
    ]
  });
}
function PublicEndPresent({ slug }) {
  return jsxs("span", {
    className: "bdr-end-present",
    role: "note",
    children: ["End of the chapters posted so far", offersExtension(slug) && jsxs(Fragment$1, { children: [" · ", jsx(ExtensionOffer, {})] })]
  });
}
var THEME_KEY$1 = "bdr-theme";
function readTheme() {
  if (typeof window === "undefined") return "deco";
  const param = new URLSearchParams(window.location.search).get("theme");
  if (param === "deco" || param === "classic") {
    try {
      window.localStorage.setItem(THEME_KEY$1, param);
    } catch {
    }
    return param;
  }
  try {
    const stored = window.localStorage.getItem(THEME_KEY$1);
    if (stored === "deco" || stored === "classic") return stored;
  } catch {
  }
  return "deco";
}
var THEME_EVENT = "bdr-theme-change";
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(THEME_EVENT));
}
function subscribeTheme(callback) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}
function themeSnapshot() {
  return document.documentElement.dataset.theme === "classic" ? "classic" : "deco";
}
var PRESENT_KEY = "bdr-present";
var PRESENT_EVENT = "bdr-present-change";
function setPresentMode(on) {
  if (on) document.documentElement.dataset.present = "true";
  else delete document.documentElement.dataset.present;
  try {
    if (on) window.sessionStorage.setItem(PRESENT_KEY, "1");
    else window.sessionStorage.removeItem(PRESENT_KEY);
  } catch {
  }
  window.dispatchEvent(new Event(PRESENT_EVENT));
}
function subscribePresent(callback) {
  window.addEventListener(PRESENT_EVENT, callback);
  return () => window.removeEventListener(PRESENT_EVENT, callback);
}
function presentSnapshot() {
  return document.documentElement.dataset.present === "true";
}
var SWIPE_MIN_DX = 48;
var SWIPE_MAX_MS = 800;
function swipeBlocked(target, root) {
  let node = target instanceof Element ? target : null;
  if (node?.closest("input, textarea, select, button, a, summary, [role='slider'], .sidebar-more[open], .dv-board")) return true;
  for (; node && node !== root; node = node.parentElement) if (getComputedStyle(node).touchAction === "none") return true;
  return false;
}
function eyebrowName(eyebrow) {
  return eyebrow.replace(/^\s*(?:(?:\d+(?:\.\d+)?|[A-Z]|Optional)\s*·\s*)+/i, "");
}
function chapterNumber(id) {
  return `Nº ${String(id).padStart(2, "0")}`;
}
function Crest() {
  const rays = [];
  for (let a = 180; a <= 360; a += 15) {
    const t = a * Math.PI / 180;
    const r = a % 30 ? 13 : 17;
    rays.push(`M${(20 + 6 * Math.cos(t)).toFixed(1)},${(20 + 6 * Math.sin(t)).toFixed(1)}L${(20 + r * Math.cos(t)).toFixed(1)},${(20 + r * Math.sin(t)).toFixed(1)}`);
  }
  return jsxs("svg", {
    className: "deco-crest deco-ornament",
    viewBox: "0 0 40 22",
    "aria-hidden": "true",
    children: [jsx("path", { d: rays.join("") }), jsx("path", {
      d: "M16,20A4,4 0 0 1 24,20Z",
      className: "deco-crest-sun"
    })]
  });
}
function FrameCorners() {
  return jsx("div", {
    className: "deco-frame deco-ornament",
    "aria-hidden": "true",
    children: [
      "tl",
      "tr",
      "bl",
      "br"
    ].map((corner) => jsxs("svg", {
      className: `deco-corner deco-corner-${corner}`,
      viewBox: "0 0 30 30",
      children: [jsx("path", { d: "M0,30H8V8H30" }), jsx("path", { d: "M0,17H17V0" })]
    }, corner))
  });
}
var ICON_PATHS = {
  replay: "M3.4 9.6A4.9 4.9 0 1 0 4.9 4.3M4.7 1.9v2.8h2.8",
  skip: "M2 8h9M8 4.6 11.4 8 8 11.4M13.6 3.4v9.2",
  board: "M2 2.6h12v10.8H2zM4.4 5.6h7.2M4.4 8h7.2M4.4 10.4h4.6",
  present: "M1.6 2.6h12.8v8H1.6zM8 10.6v2.8M5.2 13.4h5.6",
  exit: "M3.6 3.6l8.8 8.8M12.4 3.6l-8.8 8.8"
};
function Icon({ name }) {
  return jsx("svg", {
    className: "ui-icon",
    viewBox: "0 0 16 16",
    "aria-hidden": "true",
    children: jsx("path", { d: ICON_PATHS[name] })
  });
}
function marginGrowth(slot) {
  if (!slot || typeof slot.getAnimations !== "function" || typeof CSSTransition === "undefined") return 0;
  for (const animation of slot.getAnimations()) {
    if (!(animation instanceof CSSTransition) || animation.transitionProperty !== "margin-top") continue;
    const frames = animation.effect?.getKeyframes() ?? [];
    const end = parseFloat(String(frames[frames.length - 1]?.marginTop ?? ""));
    const now = parseFloat(getComputedStyle(slot).marginTop);
    if (Number.isFinite(end) && Number.isFinite(now)) return Math.max(0, end - now);
  }
  return 0;
}
function Shell({ chapter, initialStep = 0 }) {
  const LAST_STEP = chapter.steps.length - 1;
  const boundedInitialStep = clamp(initialStep, 0, LAST_STEP);
  const [step, setStep] = useState(boundedInitialStep);
  const [maxVisited, setMaxVisited] = useState(boundedInitialStep);
  const [movedForward, setMovedForward] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [parameters, setParameters] = useState(chapter.initialParameters);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const theme = useSyncExternalStore(subscribeTheme, themeSnapshot, () => "deco");
  const devQuery = useDevQuery();
  const present = useSyncExternalStore(subscribePresent, presentSnapshot, () => false);
  const panelRef = useRef(null);
  const derivationHandle = useRef(null);
  const boardButtonRef = useRef(null);
  useEffect(() => {
    applyTheme(readTheme());
    try {
      if (window.sessionStorage.getItem(PRESENT_KEY) === "1") setPresentMode(true);
    } catch {
    }
  }, []);
  const chooseTheme = (next) => {
    try {
      window.localStorage.setItem(THEME_KEY$1, next);
    } catch {
    }
    applyTheme(next);
  };
  const STAGE_FIRST_STEP = useMemo(() => chapter.steps.reduce((firsts, definition, index) => {
    if (firsts.length === definition.stage) firsts.push(index);
    return firsts;
  }, []), [chapter.steps]);
  const STAGE_STEP_COUNT = useMemo(() => chapter.steps.reduce((counts, definition) => {
    counts[definition.stage] = (counts[definition.stage] ?? 0) + 1;
    return counts;
  }, []), [chapter.steps]);
  const live = step === LAST_STEP;
  const stage2 = chapter.steps[step].stage;
  const activeParameters = live ? parameters : chapter.defaults;
  const displayW = chapter.displayWForStep ? chapter.displayWForStep({
    stage: stage2,
    live,
    parameters: activeParameters
  }) : activeParameters.w;
  const current = chapter.stages[stage2];
  const stepDef = chapter.steps[step];
  const sidebarTitle = stepDef.title ?? current.title;
  const sidebarTitleText = titleText(sidebarTitle);
  const titleRole = stepDef.titleRole;
  const revised = isRevisedSidebar(chapter.slug);
  const eyebrowLabel = eyebrowName(current.eyebrow);
  const eyebrowNumberOnly = revised && eyebrowRepeatsTitle(eyebrowLabel, sidebarTitleText);
  const helpers = useMemo(() => createVisibility(chapter.steps, step, movedForward), [
    chapter.steps,
    movedForward,
    step
  ]);
  const goTo = useCallback((next, forward, scrub = false) => {
    const target = clamp(next, 0, LAST_STEP);
    setMovedForward(forward);
    setScrubbing(scrub);
    setStep(target);
    setMaxVisited((visited) => Math.max(visited, target));
    setMoreOpen(false);
  }, [LAST_STEP]);
  const goBack = useCallback(() => {
    goTo(step - 1, false);
  }, [goTo, step]);
  const goForward = useCallback(() => {
    goTo(step + 1, true);
  }, [goTo, step]);
  const jumpToStage = useCallback((index) => {
    const first = STAGE_FIRST_STEP[index];
    if (first > maxVisited) return;
    goTo(first, false);
  }, [
    STAGE_FIRST_STEP,
    goTo,
    maxVisited
  ]);
  const tapOriginRef = useRef(boundedInitialStep);
  const intentRef = useRef(() => {
  });
  useLayoutEffect(() => {
    intentRef.current = (intent) => {
      const forward = intent.direction === "forward";
      if (intent.kind === "step") {
        tapOriginRef.current = step;
        if (forward) goForward();
        else goBack();
      } else if (intent.kind === "jump") {
        const origin = tapOriginRef.current;
        const target = forward ? sequenceEnd(chapter.steps, chapter.stages, origin) : sequenceStart(chapter.steps, chapter.stages, origin);
        if (forward ? target > step : target < step) goTo(target, false);
      } else if (intent.kind === "hold-step") {
        if (forward ? step < LAST_STEP : step > 0) goTo(forward ? step + 1 : step - 1, false, true);
      }
    };
  });
  const machinesRef = useRef(null);
  useEffect(() => {
    const onIntent = (intent) => intentRef.current(intent);
    const machines = {
      keys: createPressMachine({ onIntent }),
      buttons: createPressMachine({ onIntent }),
      swipes: createPressMachine({
        onIntent,
        doubleTapMs: 450
      })
    };
    machinesRef.current = machines;
    const stop = () => Object.values(machines).forEach((machine) => machine.cancel());
    const onVisibility = () => {
      if (document.hidden) stop();
    };
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", onVisibility);
      machinesRef.current = null;
    };
  }, []);
  const togglePresent = useCallback(() => setPresentMode(!presentSnapshot()), []);
  const [entryNonce, setEntryNonce] = useState(0);
  useLayoutEffect(() => {
    if (boundedInitialStep === 0 && takeRouteEntry(chapter.slug)) {
      setMovedForward(true);
      setEntryNonce((n) => n + 1);
    }
  }, [boundedInitialStep, chapter.slug]);
  const replay = useCallback(() => {
    if (step === 0) {
      setMovedForward(true);
      setEntryNonce((n) => n + 1);
      return;
    }
    const target = step;
    flushSync(() => goTo(target - 1, false, true));
    goTo(target, true);
  }, [goTo, step]);
  const dvEnd = useMemo(() => derivationEnd(chapter.steps, chapter.stages, step), [
    chapter.steps,
    chapter.stages,
    step
  ]);
  const skipDerivation = useCallback(() => {
    if (dvEnd !== null) goTo(dvEnd, dvEnd === step + 1);
  }, [
    dvEnd,
    goTo,
    step
  ]);
  const skipTarget = optionalSkipTarget(chapter.steps, chapter.stages, step);
  const canBoard = Boolean(current.derivation);
  const closeBoard = useCallback(() => {
    setBoardOpen(false);
    boardButtonRef.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (keyBelongsToTarget(event.target, event.key)) return;
      const direction = keyDirection(event.key, event.shiftKey);
      if (direction) {
        event.preventDefault();
        machinesRef.current?.keys.down(direction);
        return;
      }
      if (event.repeat) return;
      const key = event.key.toLowerCase();
      if (key === "p") {
        event.preventDefault();
        togglePresent();
      } else if (key === "r") {
        event.preventDefault();
        replay();
      } else if (key === "b" && canBoard) {
        event.preventDefault();
        if (boardOpen) closeBoard();
        else setBoardOpen(true);
      } else if (event.key === "Escape") {
        if (boardOpen) {
          event.preventDefault();
          closeBoard();
        } else if (presentSnapshot()) {
          event.preventDefault();
          setPresentMode(false);
        }
      }
    };
    const onKeyUp = (event) => {
      if (!keyDirection(event.key, false) && !keyDirection(event.key, true)) return;
      machinesRef.current?.keys.up("forward");
      machinesRef.current?.keys.up("back");
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [
    boardOpen,
    canBoard,
    closeBoard,
    replay,
    togglePresent
  ]);
  const backButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  useEffect(() => {
    const wire = (button, direction) => {
      if (!button) return () => {
      };
      const down = (event) => {
        if (event.button !== 0 || button.disabled) return;
        button.setPointerCapture?.(event.pointerId);
        machinesRef.current?.buttons.down(direction, { double: event.pointerType !== "mouse" });
      };
      const up = () => machinesRef.current?.buttons.up(direction);
      const menu = (event) => event.preventDefault();
      button.addEventListener("pointerdown", down);
      button.addEventListener("pointerup", up);
      button.addEventListener("pointercancel", up);
      button.addEventListener("lostpointercapture", up);
      button.addEventListener("contextmenu", menu);
      return () => {
        button.removeEventListener("pointerdown", down);
        button.removeEventListener("pointerup", up);
        button.removeEventListener("pointercancel", up);
        button.removeEventListener("lostpointercapture", up);
        button.removeEventListener("contextmenu", menu);
      };
    };
    const unwireBack = wire(backButtonRef.current, "back");
    const unwireNext = wire(nextButtonRef.current, "forward");
    return () => {
      unwireBack();
      unwireNext();
    };
  }, []);
  const swipeRef = useRef(null);
  const onSwipeStart = (event) => {
    swipeRef.current = null;
    if (event.pointerType === "mouse" || !event.isPrimary) return;
    if (swipeBlocked(event.target, event.currentTarget)) return;
    swipeRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      t: event.timeStamp
    };
  };
  const onSwipeEnd = (event) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_DX || Math.abs(dx) < 1.5 * Math.abs(dy) || event.timeStamp - start.t > SWIPE_MAX_MS) return;
    machinesRef.current?.swipes.tap(dx < 0 ? "forward" : "back");
  };
  const updateParameter = (key, value) => {
    setParameters((previous) => {
      const next = {
        ...previous,
        [key]: value
      };
      if (key === "t0" && next.t1 - next.t0 < 0.2) next.t0 = next.t1 - 0.2;
      if (key === "t1" && next.t1 - next.t0 < 0.2) next.t1 = next.t0 + 0.2;
      return next;
    });
  };
  const resetModel = () => setParameters(chapter.initialParameters);
  const stageFirst = STAGE_FIRST_STEP[stage2];
  const subIndex = step - stageFirst;
  const stageStepCount = STAGE_STEP_COUNT[stage2];
  const Figure = chapter.Figure;
  const Ledger = chapter.Ledger;
  const Dock = chapter.Dock;
  const tryIt = live && Dock;
  const chapterIndex = READY_CHAPTERS.findIndex((entry) => entry.slug === chapter.slug);
  chapter.slug;
  const nextChapter = chapterIndex >= 0 ? READY_CHAPTERS[chapterIndex + 1] : void 0;
  const lines = chapter.steps.slice(stageFirst, step + 1).map((definition, offset) => ({
    key: definition.key,
    index: stageFirst + offset,
    narration: definition.narration
  })).filter((line) => line.index === step || line.narration !== null && line.narration !== void 0 && line.narration !== "");
  const reducedMotion = usePrefersReducedMotion();
  const derivationAt = derivationStepFor(chapter.steps, step);
  const derivationEmpty = current.derivation ? isEmptyAt(current.derivation, derivationAt) : false;
  const fitRef = useRef(() => {
  });
  const onDerivationSettled = useCallback(() => fitRef.current(), []);
  const foldFloorRef = useRef({
    step: -1,
    count: 0
  });
  const levelFloorRef = useRef({
    step: -1,
    level: 0
  });
  const pressFitRef = useRef({
    step: -1,
    level: 0
  });
  const fitStepRef = useRef(-1);
  const foldMemoRef = useRef(new Map());
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const fit2 = () => {
      const more = panel.querySelector(".sidebar-more");
      if (more?.open) return;
      const formulaSlot = panel.querySelector(".derivation-slot:not(.has-derivation)");
      if (formulaSlot) {
        formulaSlot.style.fontSize = "";
        const display = formulaSlot.querySelector(".katex-display") ?? formulaSlot;
        let size = parseFloat(getComputedStyle(formulaSlot).fontSize);
        while (display.scrollWidth > display.clientWidth + 1 && size > 15) {
          size -= 0.5;
          formulaSlot.style.fontSize = `${size}px`;
        }
      }
      const derivationSlot = panel.querySelector(".derivation-slot.has-derivation");
      const dvRoot = derivationSlot?.querySelector(".dv") ?? null;
      const dvStage2 = dvRoot?.querySelector(".dv-stage") ?? null;
      const busy = Boolean(dvRoot && (dvRoot.dataset.dvAnimating || dvRoot.dataset.dvSettling));
      const deciding = busy && pressFitRef.current.step !== step;
      const earlier = Array.from(panel.querySelectorAll(".narration-line.is-earlier"));
      const fold = panel.querySelector(".narration-fold");
      const list = panel.querySelector(".narration-list");
      const pending = () => (dvRoot ? Math.max(0, (Number(dvRoot.dataset.dvPeak) || 0) - dvRoot.offsetHeight) : 0) + marginGrowth(derivationSlot);
      const free = () => {
        if (list && more && more.offsetParent !== null) return more.getBoundingClientRect().top - list.getBoundingClientRect().bottom;
        if (!derivationSlot) return Number.POSITIVE_INFINITY;
        return panel.getBoundingClientRect().bottom - parseFloat(getComputedStyle(panel).paddingBottom) - derivationSlot.getBoundingClientRect().bottom;
      };
      const overflowing = () => panel.scrollHeight > panel.clientHeight + 0.5 || pending() > free() + 0.5;
      const hide = (count) => {
        earlier.forEach((line, index) => line.classList.toggle("is-hidden", index < count));
        if (!fold) return;
        fold.hidden = count === 0;
        fold.dataset.count = String(count);
        fold.dataset.capped = count > 8 ? "true" : "false";
        const pips = document.createElement("span");
        pips.className = "narration-fold-pips";
        for (let i = 0; i < Math.min(count, 8); i += 1) pips.append(document.createElement("i"));
        const label = document.createElement("span");
        label.className = "narration-fold-label";
        label.textContent = count === 1 ? "1 earlier step" : `${count} earlier steps`;
        fold.replaceChildren(pips, label);
      };
      const canScale = Boolean(derivationSlot && !derivationSlot.hasAttribute("data-empty"));
      let scale = Number(derivationSlot?.style.getPropertyValue("--dv-fit")) || 1;
      const setLevel = (level2) => {
        panel.dataset.compact = String(level2);
        if (!derivationSlot || dvRoot?.dataset.dvFitLocked || busy && !deciding) return;
        const next = !canScale ? scale : Math.min(scale, level2 >= 3 ? 0.85 : level2 === 2 ? 0.92 : 1);
        if (next === scale) return;
        scale = next;
        derivationSlot.style.setProperty("--dv-fit", String(next));
        if (dvStage2) fitStack(dvStage2);
        if (busy) derivationHandle.current?.restartPress();
      };
      let level = Math.max(levelFloorRef.current.step === step ? levelFloorRef.current.level : 0, busy && !deciding ? pressFitRef.current.level : 0);
      setLevel(level);
      let folded = (busy || restoring) && foldFloorRef.current.step === step ? Math.min(foldFloorRef.current.count, earlier.length) : 0;
      if (panel.dataset.sidebar === "revised") folded = Math.max(folded, earlier.length - 2);
      hide(folded);
      while (folded < earlier.length && overflowing()) hide(folded += 1);
      while (level < 4 && overflowing()) setLevel(level += 1);
      if (busy) {
        foldFloorRef.current = {
          step,
          count: folded
        };
        levelFloorRef.current = {
          step,
          level
        };
        if (deciding) pressFitRef.current = {
          step,
          level
        };
      }
      if (dvRoot && canScale) dvRoot.dataset.dvFitLocked = String(scale);
      if (!restoring) foldMemoRef.current.set(step, folded);
      panel.dataset.overflow = overflowing() ? "true" : "false";
    };
    fitRef.current = fit2;
    const remembered = foldMemoRef.current.get(step);
    const restoring = !movedForward && remembered !== void 0;
    foldFloorRef.current = {
      step,
      count: restoring ? remembered : 0
    };
    levelFloorRef.current = {
      step: -1,
      level: 0
    };
    if (fitStepRef.current !== step) pressFitRef.current = {
      step: -1,
      level: 0
    };
    fitStepRef.current = step;
    fit2();
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        fit2();
      });
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(panel);
    const dvStage = panel.querySelector(".dv-stage");
    if (dvStage) observer.observe(dvStage);
    document.fonts?.ready.then(schedule).catch(() => {
    });
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [
    step,
    theme,
    movedForward,
    present
  ]);
  const moreRef = useRef(null);
  useLayoutEffect(() => {
    if (moreOpen) {
      if (moreRef.current) moreRef.current.scrollTop = 0;
    } else fitRef.current();
  }, [moreOpen]);
  const boardStepLabel = useMemo(() => {
    const first = new Map();
    for (let j = stageFirst; j < stageFirst + stageStepCount; j += 1) {
      const at = derivationStepFor(chapter.steps, j);
      if (at !== null && !first.has(at)) first.set(at, j - stageFirst + 1);
    }
    return (derivationStep) => first.get(derivationStep) ?? null;
  }, [
    chapter.steps,
    stageFirst,
    stageStepCount
  ]);
  return jsxs("main", {
    className: `lecture-app chapter-${chapter.slug}`,
    "data-deck-step": step,
    "data-scrubbing": scrubbing ? "true" : void 0,
    "data-present": present ? "true" : void 0,
    "data-layout": layoutFromQuery(devQuery),
    children: [
      jsx(FrameCorners, {}),
      jsxs("header", {
        className: "app-header",
        children: [jsxs("a", {
          className: "compact-wordmark",
          href: "#01-kink",
          title: "Bunching, Done Right: the first page",
          children: [
            jsxs("strong", { children: ["Bunching, ", jsx("em", { children: "done right." })] }),
            jsx("span", { children: "An interactive visual textbook" }),
            jsx("span", {
              className: "bdr-prelim",
              children: "Very preliminary"
            })
          ]
        }), jsxs("div", {
          className: "header-right",
          children: [
            jsx("div", {
              className: "theme-toggle",
              role: "group",
              "aria-label": "Visual theme",
              children: ["deco", "classic"].map((option) => jsx("button", {
                type: "button",
                "aria-pressed": theme === option,
                className: theme === option ? "is-current" : void 0,
                onClick: () => chooseTheme(option),
                children: option === "deco" ? "Deco" : "Classic"
              }, option))
            }),
            jsxs("button", {
              type: "button",
              className: "present-toggle",
              "aria-pressed": present,
              "aria-keyshortcuts": "P",
              onClick: togglePresent,
              title: "Present: only the figure and the derivation (P)",
              children: [jsx(Icon, { name: "present" }), jsx("span", { children: "Present" })]
            }),
            jsxs("div", {
              className: "chapter-label chapter-switcher",
              children: [jsxs("button", {
                type: "button",
                className: "chapter-switcher-trigger",
                "aria-expanded": switcherOpen,
                "aria-controls": "chapter-switcher-menu",
                onClick: () => setSwitcherOpen((open) => !open),
                children: [
                  jsx("span", { children: chapterNumber(chapter.id) }),
                  jsx("strong", { children: chapter.label ?? chapter.title }),
                  jsx("i", {
                    "aria-hidden": "true",
                    children: "▾"
                  })
                ]
              }), switcherOpen && jsx("div", {
                className: "chapter-switcher-menu",
                id: "chapter-switcher-menu",
                children: CHAPTER_PARTS.map((part) => jsxs("section", { children: [jsxs("p", { children: [
                  jsx("span", { children: part.id }),
                  " ",
                  part.title
                ] }), part.chapters.map((item) => item.status === "ready" ? jsxs("a", {
                  href: chapterHref(item.slug) + devQuery,
                  "aria-current": item.slug === chapter.slug ? "page" : void 0,
                  children: [jsx("span", { children: String(item.id).padStart(2, "0") }), item.title]
                }, item.slug) : jsxs("button", {
                  type: "button",
                  disabled: true,
                  children: [jsx("span", { children: String(item.id).padStart(2, "0") }), item.title]
                }, item.slug))] }, part.id))
              })]
            })
          ]
        })]
      }),
      jsxs("section", {
        className: `lesson-viewport lesson-stage-${stage2}`,
        "aria-live": "polite",
        "data-derivation-column": current.derivation || current.formulaTex ? "true" : "false",
        onPointerDown: onSwipeStart,
        onPointerUp: onSwipeEnd,
        onPointerCancel: () => {
          swipeRef.current = null;
        },
        children: [
          jsxs("aside", {
            className: "explanation-panel sidebar",
            ref: panelRef,
            "data-compact": "0",
            "data-sidebar": revised ? "revised" : void 0,
            children: [
              jsxs("div", {
                className: "sidebar-head",
                children: [jsxs("p", {
                  className: "sidebar-eyebrow",
                  children: [
                    jsx(Crest, {}),
                    jsx("span", {
                      className: "sidebar-eyebrow-number",
                      children: chapterNumber(chapter.id)
                    }),
                    (!eyebrowNumberOnly || chapter.eyebrowFallback) && jsxs(Fragment$1, { children: [jsx("span", {
                      className: "sidebar-eyebrow-dot",
                      "aria-hidden": "true",
                      children: "·"
                    }), jsx("span", {
                      className: "sidebar-eyebrow-name",
                      children: eyebrowNumberOnly ? chapter.eyebrowFallback : eyebrowLabel
                    })] })
                  ]
                }), jsx(SidebarTitle, {
                  id: `${stage2}|${titleRole ?? ""}|${titleText(sidebarTitle, true)}`,
                  stage: stage2,
                  title: sidebarTitle,
                  role: titleRole,
                  size: revised ? titleSize(sidebarTitleText) : void 0,
                  crossFade: movedForward && !scrubbing && !reducedMotion
                })]
              }),
              skipTarget !== null && jsxs("p", {
                className: "optional-stage-note",
                children: [
                  jsx("span", {
                    className: "optional-stage-tag",
                    children: "Optional stage"
                  }),
                  " ",
                  jsxs("button", {
                    type: "button",
                    className: "optional-stage-skip",
                    onClick: () => goTo(skipTarget, false),
                    "aria-label": `Skip this optional stage and go to stage ${chapter.steps[skipTarget].stage + 1}, ${chapter.stages[chapter.steps[skipTarget].stage].short}`,
                    children: ["Skip this optional stage ", jsx("span", {
                      "aria-hidden": "true",
                      children: "→"
                    })]
                  })
                ]
              }),
              current.derivation ? jsx("div", {
                className: "derivation-slot stage-formula has-derivation",
                "data-slot": "derivation",
                "data-empty": derivationEmpty ? "" : void 0,
                children: jsx(Derivation, {
                  derivation: current.derivation,
                  at: derivationAt,
                  animate: movedForward,
                  reducedMotion,
                  size: "calc(1em * var(--dv-fit, 1))",
                  label: current.title,
                  onSettled: onDerivationSettled,
                  fade: !scrubbing,
                  handle: derivationHandle
                }, current.derivation.id)
              }, "derivation") : current.formulaTex && jsx("div", {
                className: "derivation-slot stage-formula",
                "data-slot": "derivation",
                children: jsx(BlockMath, { tex: current.formulaTex })
              }, "formula"),
              jsxs("ol", {
                className: "narration-list",
                "aria-label": "This stage, step by step",
                children: [jsx("li", {
                  className: "narration-fold",
                  "aria-hidden": "true",
                  hidden: true
                }), lines.map((line) => {
                  const isCurrent = line.index === step;
                  const enter = isCurrent && movedForward ? " build-enter-line" : "";
                  if (isCurrent && tryIt) return jsxs("li", {
                    className: `narration-line is-current is-try${enter}`,
                    children: [jsx("span", {
                      className: "narration-try-label",
                      children: "Try it"
                    }), jsx("span", {
                      className: "build-narration",
                      children: chapter.livePrompt ?? current.prompt
                    })]
                  }, `${line.key}-live`);
                  return jsx("li", {
                    className: `narration-line ${isCurrent ? "is-current" : "is-earlier"}${enter}`,
                    children: isCurrent ? jsx("span", {
                      className: "build-narration",
                      children: line.narration || current.prompt
                    }) : line.narration
                  }, line.key);
                })]
              }),
              jsxs("details", {
                ref: moreRef,
                className: "sidebar-more",
                open: moreOpen,
                onToggle: (event) => setMoreOpen(event.currentTarget.open),
                children: [
                  jsx("summary", { children: jsx("span", { children: moreOpen ? "Close notes" : "More on this stage" }) }),
                  jsxs("div", {
                    className: "sidebar-more-body",
                    children: [
                      jsxs("p", {
                        className: "sidebar-figure-title",
                        children: [
                          jsx("span", { children: "Figure" }),
                          " ",
                          current.figureTitle
                        ]
                      }),
                      jsx("p", {
                        className: "stage-explanation",
                        children: current.body
                      }),
                      current.quote && jsxs("blockquote", {
                        className: "stage-quote",
                        children: [jsxs("p", { children: [
                          "“",
                          current.quote.text,
                          "”"
                        ] }), jsx("footer", { children: current.quote.source })]
                      }),
                      current.definitions && jsx("dl", {
                        className: `definition-list definitions-${current.definitions.length}`,
                        children: current.definitions.map((definition, index) => jsxs("div", { children: [jsx("dt", { children: definition.term }), jsx("dd", { children: definition.meaning })] }, index))
                      }),
                      Ledger && jsx(Ledger, { stage: stage2 }),
                      !tryIt && current.prompt && jsxs("p", {
                        className: "reader-prompt",
                        children: [jsx("span", {
                          className: "reader-prompt-label",
                          children: "Where this goes"
                        }), jsx("span", {
                          className: "reader-prompt-copy",
                          children: current.prompt
                        })]
                      }),
                      jsx(CiteThis, {
                        route: chapter.slug,
                        stageIndex: stage2
                      })
                    ]
                  }),
                  jsx("div", {
                    className: "sidebar-more-fade",
                    "aria-hidden": "true"
                  })
                ]
              })
            ]
          }),
          jsxs("section", {
            className: "figure-panel",
            "data-has-dock": Boolean(Dock),
            children: [jsx(FilmEntry.Provider, {
              value: entryNonce,
              children: jsx(Figure, {
                step,
                entering: movedForward,
                parameters: activeParameters,
                displayW,
                helpers
              })
            }), jsx("div", {
              className: "build-strip",
              children: live && Dock && jsx("div", {
                className: "build-strip-dock build-enter-strip",
                children: jsx(Dock, {
                  parameters,
                  displayW,
                  onChange: updateParameter,
                  onReset: resetModel
                })
              })
            })]
          }),
          boardOpen && current.derivation && jsx(DerivationBoard, {
            derivation: current.derivation,
            at: derivationEmpty ? null : derivationAt,
            title: current.title,
            eyebrow: `${chapterNumber(chapter.id)} · ${eyebrowName(current.eyebrow)}`,
            stepLabel: boardStepLabel,
            onClose: closeBoard
          })
        ]
      }),
      jsxs("footer", {
        className: "stage-transport",
        children: [
          step === 0 && chapter.backHref && jsxs("a", {
            className: "transport-button back-button back-link",
            href: chapter.backHref,
            children: [jsx("span", {
              "aria-hidden": "true",
              children: "←"
            }), " Back"]
          }),
          jsxs("button", {
            type: "button",
            className: "transport-button back-button",
            style: step === 0 && chapter.backHref ? { display: "none" } : void 0,
            onClick: (event) => {
              if (event.detail === 0) goBack();
            },
            disabled: step === 0,
            "aria-keyshortcuts": "ArrowLeft PageUp",
            title: "Back (←). Two quick taps: the start of this sequence. Hold: rewind.",
            ref: backButtonRef,
            children: [jsx("span", {
              "aria-hidden": "true",
              children: "←"
            }), " Back"]
          }),
          jsx("nav", {
            className: "stage-timeline",
            "aria-label": "Lesson stages",
            children: chapter.stages.map((item, index) => {
              const locked = STAGE_FIRST_STEP[index] > maxVisited;
              return jsxs("button", {
                type: "button",
                "data-stage-index": index,
                "data-locked": locked ? "true" : "false",
                "data-optional": item.optional ? "true" : void 0,
                onClick: () => jumpToStage(index),
                disabled: locked,
                className: index === stage2 ? "is-current" : locked ? "is-locked" : "is-past",
                "aria-current": index === stage2 ? "step" : void 0,
                title: `${item.short}${item.optional ? " (optional)" : ""}${locked ? ". Advance with Next to unlock" : ""}`,
                children: [jsxs("span", { children: [String(index + 1).padStart(2, "0"), item.optional && jsx("i", {
                  className: "stage-optional-mark",
                  children: "Opt"
                })] }), jsx("strong", { children: item.short })]
              }, item.short);
            })
          }),
          jsxs("div", {
            className: "reader-controls",
            role: "group",
            "aria-label": "Reader controls",
            children: [
              jsx("button", {
                type: "button",
                className: "reader-control",
                onClick: replay,
                "aria-label": "Replay this step",
                "aria-keyshortcuts": "R",
                title: "Replay this step (R)",
                children: jsx(Icon, { name: "replay" })
              }),
              jsx("button", {
                type: "button",
                className: "reader-control",
                onClick: skipDerivation,
                disabled: dvEnd === null,
                "aria-label": "Skip to the end of this derivation",
                title: "Skip to the end of this derivation (two quick taps of →)",
                children: jsx(Icon, { name: "skip" })
              }),
              jsx("button", {
                type: "button",
                ref: boardButtonRef,
                className: "reader-control",
                onClick: () => boardOpen ? closeBoard() : setBoardOpen(true),
                disabled: !canBoard,
                "aria-pressed": boardOpen && canBoard,
                "aria-label": "Show the whole derivation",
                "aria-keyshortcuts": "B",
                title: "Show the whole derivation (B)",
                children: jsx(Icon, { name: "board" })
              })
            ]
          }),
          jsxs("div", {
            className: "build-meta",
            "aria-label": `Step ${subIndex + 1} of ${stageStepCount} in this stage`,
            children: [stageStepCount <= 16 ? jsx("span", {
              className: "build-dots",
              "aria-hidden": "true",
              children: Array.from({ length: stageStepCount }, (_, index) => jsx("i", { className: index < subIndex ? "is-done" : index === subIndex ? "is-done is-now" : "" }, index))
            }) : jsxs("span", {
              className: "build-gauge",
              "aria-hidden": "true",
              style: { "--gauge": String(subIndex / (stageStepCount - 1)) },
              children: [jsx("i", { className: "build-gauge-fill" }), jsx("i", { className: "build-gauge-now" })]
            }), jsxs("strong", { children: [
              subIndex + 1,
              jsx("em", { children: "/" }),
              stageStepCount
            ] })]
          }),
          jsxs("button", {
            type: "button",
            className: "transport-button next-button",
            "data-engine-direction": "next",
            "data-replaced": step === LAST_STEP ? "true" : void 0,
            onClick: (event) => {
              if (event.detail === 0) goForward();
            },
            disabled: step === LAST_STEP,
            "aria-keyshortcuts": "ArrowRight PageDown Space",
            title: "Next (→ or Space). Two quick taps: the end of this sequence. Hold: fast-forward.",
            ref: nextButtonRef,
            children: [
              step === LAST_STEP ? "The end" : "Next",
              " ",
              jsx("span", {
                "aria-hidden": "true",
                children: "→"
              })
            ]
          }),
          step === LAST_STEP && nextChapter && jsxs("a", {
            className: "transport-button next-chapter-link",
            href: chapterHref(nextChapter.slug) + devQuery,
            onClick: () => markRouteEntry(nextChapter.slug),
            children: [jsxs("span", {
              className: "next-chapter-kicker",
              children: ["Next · ", chapterNumber(nextChapter.id)]
            }), jsxs("span", {
              className: "next-chapter-title",
              children: [
                nextChapter.chapter.label ?? nextChapter.title,
                " ",
                jsx("span", {
                  "aria-hidden": "true",
                  children: "→"
                })
              ]
            })]
          }),
          step === LAST_STEP && !nextChapter && jsx(PublicEnd, { slug: chapter.slug })
        ]
      }),
      present && jsxs("div", {
        className: "present-hud",
        children: [
          jsx("button", {
            type: "button",
            className: "present-exit",
            onClick: () => setPresentMode(false),
            "aria-label": "Leave present mode",
            title: "Leave present mode (P or Esc)",
            children: jsx(Icon, { name: "exit" })
          }),
          step === LAST_STEP && nextChapter && jsxs("a", {
            className: "present-next",
            href: chapterHref(nextChapter.slug) + devQuery,
            onClick: () => markRouteEntry(nextChapter.slug),
            children: [
              "Next · ",
              chapterNumber(nextChapter.id),
              " ",
              jsx("span", {
                "aria-hidden": "true",
                children: "→"
              })
            ]
          }),
          step === LAST_STEP && !nextChapter && jsx(PublicEndPresent, { slug: chapter.slug }),
          jsx("span", {
            className: "present-progress",
            "aria-hidden": "true",
            style: { "--progress": String(LAST_STEP ? step / LAST_STEP : 1) }
          })
        ]
      }),
      jsx(TourLayer, {
        slug: chapter.slug,
        stepKey: chapter.steps[step].key,
        step,
        lastStep: LAST_STEP,
        chapterId: chapter.id,
        present
      })
    ]
  });
}
function ReaderRoute({ slug, initialStep = 0, returnTo }) {
  return jsx(Fragment$1, { children: jsx(Shell, {
    chapter: getChapter(slug),
    initialStep
  }, `${slug}-${initialStep}`) });
}
var THEME_KEY = "bdr-theme";
var MemoryStorage = class {
  constructor() {
    this.items = new Map();
  }
  get length() {
    return this.items.size;
  }
  clear() {
    this.items.clear();
  }
  getItem(key) {
    return this.items.has(key) ? this.items.get(key) : null;
  }
  key(index) {
    return [...this.items.keys()][index] ?? null;
  }
  removeItem(key) {
    this.items.delete(key);
  }
  setItem(key, value) {
    this.items.set(key, String(value));
  }
};
function sessionStorageWorks() {
  try {
    const storage = window.sessionStorage;
    storage.setItem("bdr-probe", "1");
    storage.removeItem("bdr-probe");
    return true;
  } catch {
    return false;
  }
}
function ensureSessionStorage() {
  if (sessionStorageWorks()) return;
  try {
    Object.defineProperty(window, "sessionStorage", {
      value: new MemoryStorage(),
      configurable: true
    });
  } catch {
  }
}
function guardHistory() {
  const keepsPage = (url) => url === void 0 || url === null || String(url).startsWith("#");
  const replace = history.replaceState.bind(history);
  const push = history.pushState.bind(history);
  history.replaceState = (data, unused, url) => keepsPage(url) ? replace(data, unused, url) : replace(data, unused);
  history.pushState = (data, unused, url) => keepsPage(url) ? push(data, unused, url) : replace(data, unused);
}
var TRACKS_PATH = "/choice-animation/tracks/";
async function unpackTrack(response) {
  const text = (await response.text()).replace(/\s+/g, "");
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  if (bytes[0] !== 31 || bytes[1] !== 139) return new Response(bytes);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Response(await new Response(stream).arrayBuffer());
}
function routeTrackFetches() {
  const fetchOriginal = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (typeof url === "string" && url.startsWith(TRACKS_PATH)) {
      const file = url.slice(25).replace(/\.bin$/, ".txt");
      return fetchOriginal(new URL(`tracks/${file}`, document.baseURI), init).then((response) => response.ok ? unpackTrack(response) : response);
    }
    return fetchOriginal(input, init);
  };
}
function boot() {
  ensureSessionStorage();
  guardHistory();
  routeTrackFetches();
  try {
    window.localStorage.removeItem(THEME_KEY);
  } catch {
  }
  document.documentElement.dataset.theme = "deco";
}
var DESIGN = {
  width: 1366,
  height: 768
};
var FOCUS_HEIGHT = DESIGN.height - 40;
var HINT_GAP = 12;
var TOGGLE_ROW = 48;
var fit = null;
var stage = null;
var rectOf = Element.prototype.getBoundingClientRect;
var screenRect = (element) => rectOf.call(element);
function patchRects() {
  Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
    const rect = rectOf.call(this);
    if (!fit || !stage || this === stage || !stage.contains(this)) return rect;
    const origin = rectOf.call(stage);
    const { scale } = fit;
    return new DOMRect((rect.x - origin.x) / scale, (rect.y - origin.y) / scale, rect.width / scale, rect.height / scale);
  };
}
function patchPixelRatio() {
  const own = Object.getOwnPropertyDescriptor(window, "devicePixelRatio");
  const proto = Object.getOwnPropertyDescriptor(Window.prototype, "devicePixelRatio");
  const descriptor = own?.get ? own : proto;
  if (!descriptor?.get || own && !own.configurable) return;
  const read = descriptor.get;
  try {
    Object.defineProperty(window, "devicePixelRatio", {
      configurable: true,
      enumerable: true,
      get() {
        const ratio = read.call(window);
        return fit ? Math.min(2, ratio) : ratio;
      }
    });
  } catch {
  }
}
function routeBodyAppends(target) {
  const body = document.body;
  const onStage = (node) => node instanceof Element && !(node instanceof HTMLScriptElement) && !(node instanceof HTMLStyleElement) && !(node instanceof HTMLLinkElement) && node.id !== "bdr-frame";
  const append = body.appendChild.bind(body);
  const insert = body.insertBefore.bind(body);
  const remove = body.removeChild.bind(body);
  const appendMany = body.append.bind(body);
  body.appendChild = function appendChild(node) {
    return onStage(node) ? target.appendChild(node) : append(node);
  };
  body.insertBefore = function insertBefore(node, child) {
    if (!onStage(node)) return insert(node, child);
    return target.insertBefore(node, child && child.parentNode === target ? child : null);
  };
  body.removeChild = function removeChild(node) {
    return node.parentNode === target ? target.removeChild(node) : remove(node);
  };
  body.append = function appendNodes(...nodes) {
    for (const node of nodes) if (onStage(node)) target.append(node);
    else appendMany(node);
  };
}
function px(value) {
  const number = parseFloat(value);
  return Number.isFinite(number) ? number : 0;
}
var afterFit = new Set();
function onFit(listener2) {
  afterFit.add(listener2);
  return () => afterFit.delete(listener2);
}
var relayout = () => {
};
function refit() {
  relayout(true);
}
function installFit() {
  const frame = document.getElementById("bdr-frame");
  stage = document.getElementById("bdr-stage");
  const hint = document.getElementById("bdr-hint");
  if (!frame || !stage) return;
  const box = stage;
  patchRects();
  patchPixelRatio();
  routeBodyAppends(box);
  let last = "";
  const layout = (force = false) => {
    const style = getComputedStyle(frame);
    const padLeft = px(style.paddingLeft);
    const padTop = px(style.paddingTop);
    const width = frame.clientWidth - padLeft - px(style.paddingRight);
    const height = frame.clientHeight - padTop - px(style.paddingBottom);
    if (width <= 0 || height <= 0) return;
    const focus = frame.dataset.focus === "true";
    const designHeight = focus ? FOCUS_HEIGHT : DESIGN.height;
    const small = width < DESIGN.width - 0.5 || height < designHeight - 0.5;
    const portrait = height > width;
    const key = `${width}x${height}:${padLeft},${padTop}:${focus}`;
    if (key === last && !force) return;
    last = key;
    frame.dataset.orientation = portrait ? "portrait" : "landscape";
    if (!small) {
      fit = null;
      delete frame.dataset.fit;
      box.style.removeProperty("left");
      box.style.removeProperty("top");
      box.style.removeProperty("width");
      box.style.removeProperty("height");
      box.style.removeProperty("transform");
      for (const listener2 of afterFit) listener2();
      return;
    }
    frame.dataset.fit = "scaled";
    const hintHeight = portrait && hint ? hint.offsetHeight + HINT_GAP + TOGGLE_ROW : 0;
    let scale = Math.min(width / DESIGN.width, height / designHeight);
    if (portrait) scale = Math.min(width / DESIGN.width, (height - hintHeight) / designHeight);
    const shownWidth = DESIGN.width * scale;
    const shownHeight = designHeight * scale;
    const left = padLeft + (width - shownWidth) / 2;
    const top = padTop + (portrait ? 0 : (height - shownHeight) / 2);
    fit = {
      scale,
      left,
      top
    };
    box.style.left = `${left}px`;
    box.style.top = `${top}px`;
    box.style.width = `${DESIGN.width}px`;
    box.style.height = `${designHeight}px`;
    box.style.transform = `scale(${scale})`;
    if (hint) hint.style.top = `${top + shownHeight + HINT_GAP + TOGGLE_ROW}px`;
    for (const listener2 of afterFit) listener2();
  };
  relayout = layout;
  layout();
  window.addEventListener("resize", () => layout());
  window.addEventListener("orientationchange", () => layout());
  new ResizeObserver(() => layout()).observe(frame);
}
var SIZE = 40;
var GAP = 4;
var doc = document;
var ICONS = {
  expand: "M3 7V3h4M13 3h4v4M17 13v4h-4M7 17H3v-4",
  collapse: "M7 3v4H3M13 3v4h4M13 17v-4h4M7 17v-4H3",
  focus: "M3 6h14M3 14h14M6 9.5h8v1H6z"
};
function fullscreenSupported(frame) {
  const enabled = doc.fullscreenEnabled ?? doc.webkitFullscreenEnabled ?? false;
  return Boolean(enabled) && (typeof frame.requestFullscreen === "function" || typeof frame.webkitRequestFullscreen === "function");
}
var fullscreenElement = () => doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
var STYLE = `
#bdr-screen {
  position: absolute;
  z-index: 50;
  display: grid;
  place-items: center;
  width: ${SIZE}px;
  height: ${SIZE}px;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
#bdr-screen[hidden] { display: none; }
#bdr-screen span {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--rule);
  border-radius: 2px;
  background: var(--paper);
  opacity: 0.82;
}
#bdr-screen:hover span, #bdr-screen[aria-pressed="true"] span { opacity: 1; border-color: var(--ink); }
#bdr-screen:focus { outline: none; }
#bdr-screen:focus-visible span { opacity: 1; outline: 2px solid var(--ink); outline-offset: 2px; }
#bdr-screen svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: square; }
@media (prefers-reduced-motion: no-preference) { #bdr-screen span { transition: opacity 120ms ease, border-color 120ms ease; } }
#bdr-frame[data-focus="true"] .lecture-app { --header-height: 0px; grid-template-rows: minmax(0, 1fr) var(--transport-height); }
#bdr-frame[data-focus="true"] .lecture-app[data-present="true"] { grid-template-rows: minmax(0, 1fr); }
#bdr-frame[data-focus="true"] .lecture-app > .app-header,
#bdr-frame[data-focus="true"] .lecture-app .stage-timeline { display: none; }
`;
var overlaps = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
function controls(stage2) {
  const boxes = [];
  for (const el of stage2.querySelectorAll("a[href], button, input, select, summary, [role=button], [tabindex], .compact-wordmark, .chapter-switcher-trigger")) {
    const rect = screenRect(el);
    if (rect.width > 0 && rect.height > 0) boxes.push({
      left: rect.left - GAP,
      top: rect.top - GAP,
      right: rect.right + GAP,
      bottom: rect.bottom + GAP
    });
  }
  return boxes;
}
function installScreenToggle() {
  const frame = document.getElementById("bdr-frame");
  const stage2 = document.getElementById("bdr-stage");
  if (!frame || !stage2) return;
  const style = document.createElement("style");
  style.dataset.bdr = "screen";
  style.textContent = STYLE;
  document.head.append(style);
  const canFullscreen = fullscreenSupported(frame);
  const button = document.createElement("button");
  button.type = "button";
  button.id = "bdr-screen";
  button.dataset.mode = canFullscreen ? "fullscreen" : "focus";
  button.innerHTML = `<span><svg viewBox="0 0 20 20" aria-hidden="true"><path d=""/></svg></span>`;
  frame.append(button);
  const path = button.querySelector("path");
  const isOn = () => canFullscreen ? fullscreenElement() === frame : frame.dataset.focus === "true";
  const render = () => {
    const on = isOn();
    const label = canFullscreen ? on ? "Exit full screen" : "Full screen" : on ? "Exit focus view" : "Focus view";
    button.setAttribute("aria-label", label);
    button.title = `${label} (F)`;
    button.setAttribute("aria-pressed", String(on));
    path.setAttribute("d", canFullscreen ? on ? ICONS.collapse : ICONS.expand : on ? ICONS.collapse : ICONS.focus);
  };
  const coarse = () => window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const lockLandscape = () => {
    const orientation = screen.orientation;
    if (!coarse() || typeof orientation?.lock !== "function") return;
    try {
      orientation.lock("landscape").catch(() => {
      });
    } catch {
    }
  };
  const unlock = () => {
    try {
      screen.orientation?.unlock?.();
    } catch {
    }
  };
  const toggle = () => {
    if (canFullscreen) {
      try {
        if (fullscreenElement()) {
          const exit = doc.exitFullscreen?.bind(doc) ?? doc.webkitExitFullscreen?.bind(doc);
          Promise.resolve(exit?.()).catch(() => {
          });
        } else {
          const request = frame.requestFullscreen?.bind(frame) ?? frame.webkitRequestFullscreen?.bind(frame);
          Promise.resolve(request?.()).then(lockLandscape, () => {
          });
        }
      } catch {
      }
      return;
    }
    if (frame.dataset.focus === "true") delete frame.dataset.focus;
    else frame.dataset.focus = "true";
    render();
    refit();
  };
  const onChange = () => {
    if (!fullscreenElement()) unlock();
    render();
    refit();
  };
  document.addEventListener("fullscreenchange", onChange);
  document.addEventListener("webkitfullscreenchange", onChange);
  button.addEventListener("click", toggle);
  window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key !== "f" && event.key !== "F") return;
    const target = event.target;
    const tag = target?.tagName?.toUpperCase();
    if (target?.isContentEditable || tag === "TEXTAREA" || tag === "SELECT") return;
    if (tag === "INPUT" && !/^(range|checkbox|radio|button|submit|reset)$/i.test(target.type)) return;
    event.preventDefault();
    toggle();
  });
  const place = () => {
    const page = screenRect(frame);
    const deck = screenRect(stage2);
    const width = page.width;
    const height = page.height;
    const scaled = frame.dataset.fit === "scaled";
    const portrait = frame.dataset.orientation === "portrait";
    const spots = [];
    const leftMargin = deck.left - page.left;
    const rightMargin = page.right - deck.right;
    const below = page.bottom - deck.bottom;
    if (scaled && rightMargin >= SIZE) spots.push({
      left: deck.right - page.left + (rightMargin - SIZE) / 2,
      top: deck.top - page.top,
      free: true
    });
    if (scaled && leftMargin >= SIZE) spots.push({
      left: (leftMargin - SIZE) / 2,
      top: deck.top - page.top,
      free: true
    });
    if (scaled && portrait && below >= SIZE + 8) spots.push({
      left: deck.right - page.left - SIZE - 4,
      top: deck.bottom - page.top + 6,
      free: true
    });
    spots.push({
      left: width - SIZE,
      top: 0
    }, {
      left: 0,
      top: 0
    });
    const right = stage2.querySelector(".header-right");
    if (right) {
      const box = screenRect(right);
      if (box.width > 0) spots.push({
        left: box.left - page.left - SIZE - 12,
        top: box.top - page.top + (box.height - SIZE) / 2
      });
    }
    spots.push({
      left: width - SIZE,
      top: height - SIZE
    });
    const taken = controls(stage2);
    const spot = spots.find((s) => s.free) ?? spots.find((s) => !taken.some((box) => overlaps(box, {
      left: page.left + s.left,
      top: page.top + s.top,
      right: page.left + s.left + SIZE,
      bottom: page.top + s.top + SIZE
    }))) ?? spots[0];
    button.style.left = `${Math.round(spot.left)}px`;
    button.style.top = `${Math.round(spot.top)}px`;
  };
  let queued = 0;
  const schedule = () => {
    if (queued) return;
    queued = window.setTimeout(() => {
      queued = 0;
      place();
    }, 120);
  };
  onFit(schedule);
  new MutationObserver(schedule).observe(stage2, {
    childList: true,
    subtree: true
  });
  new MutationObserver(schedule).observe(document.documentElement, {
    attributes: true,
    attributeFilter: [
      "data-present",
      "data-tour",
      "data-theme"
    ]
  });
  window.addEventListener("load", schedule);
  document.fonts?.ready.then(schedule, () => {
  });
  render();
  place();
}
var ROUTES = [
  "01-kink",
  "01-pile",
  "01-cdf",
  "02-nonidentification",
  "03-sufficient-statistic",
  "04-random-frictions",
  "04-spectral"
];
var FIRST = ROUTES[0];
var HASH = /^#?([0-9a-z-]+?)(?:-step-(\d+))?$/;
function routeHash(slug, step = 0) {
  return step > 0 ? `#${slug}-step-${step}` : `#${slug}`;
}
function parseHash(hash) {
  const match = HASH.exec(hash);
  if (!match || !ROUTES.includes(match[1])) return null;
  return {
    slug: match[1],
    step: match[2] === void 0 ? void 0 : Number(match[2])
  };
}
function parseLink(href) {
  if (/^[a-z]+:/i.test(href) || href.startsWith("//")) return "external";
  const local = href.startsWith("#") ? `/${href.slice(1)}` : href;
  const url = new URL(local, "https://tour.invalid");
  const slug = url.pathname.replace(/^\/+|\/+$/g, "");
  if (!ROUTES.includes(slug)) return "inert";
  const raw = url.searchParams.get("step") ?? "0";
  return {
    slug,
    step: /^\d+$/.test(raw) ? Number(raw) : 0,
    returnTo: url.searchParams.get("returnTo") ?? void 0
  };
}
function createRouter(onRoute) {
  const fromHash = parseHash(window.location.hash);
  let visit = 0;
  let current = {
    slug: fromHash?.slug ?? FIRST,
    step: fromHash?.step ?? 0,
    visit
  };
  const leftAt = new Map();
  const returnFor = new Map();
  let pending = null;
  const deckStep = () => {
    const value = document.querySelector("main.lecture-app")?.dataset.deckStep;
    return value && /^\d+$/.test(value) ? Number(value) : 0;
  };
  const show = (route) => {
    leftAt.set(current.slug, deckStep());
    if (route.returnTo) returnFor.set(route.slug, route.returnTo);
    visit += 1;
    current = {
      ...route,
      visit
    };
    onRoute(current);
    window.scrollTo(0, 0);
  };
  const onHashChange = () => {
    const hash = window.location.hash;
    if (pending && pending.hash === hash) {
      const { route } = pending;
      pending = null;
      show(route);
      return;
    }
    pending = null;
    const parsed = parseHash(hash);
    const slug = parsed?.slug ?? FIRST;
    show({
      slug,
      step: parsed?.step ?? leftAt.get(slug) ?? 0,
      returnTo: returnFor.get(slug)
    });
  };
  const go = (route) => {
    const hash = routeHash(route.slug, route.step);
    if (window.location.hash === hash) {
      show(route);
      return;
    }
    pending = {
      hash,
      route
    };
    window.location.hash = hash;
  };
  const onClick = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target?.closest?.("a[href]");
    if (!anchor) return;
    const target = parseLink(anchor.getAttribute("href") ?? "");
    if (target === "external") return;
    event.preventDefault();
    if (target !== "inert") go(target);
  };
  window.addEventListener("hashchange", onHashChange);
  document.addEventListener("click", onClick, true);
  return {
    initial: current,
    dispose() {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick, true);
    }
  };
}
boot();
installFit();
installScreenToggle();
function App({ initial, subscribe }) {
  const [route, setRoute] = useState(initial);
  useEffect(() => subscribe(setRoute), [subscribe]);
  return jsx(ReaderRoute, {
    slug: route.slug,
    initialStep: route.step,
    returnTo: route.returnTo
  }, route.visit);
}
var listener = () => {
};
var router = createRouter((route) => listener(route));
var container = document.getElementById("bdr-root");
if (container) createRoot(container).render(jsx(App, {
  initial: router.initial,
  subscribe: (next) => {
    listener = next;
  }
}));
