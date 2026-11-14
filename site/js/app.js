import { answers, categories } from "./answers.js";

const HOLD_MS = 3400;
const LAMP_COUNT = 7;
const COVERS = ["Love", "Courage", "Hope"];

const body = document.body;
const theater = document.querySelector(".theater");
const stage = document.getElementById("stage");
const company = document.getElementById("company");
const holdBtn = document.getElementById("hold");
const title = document.getElementById("apron-title");
const titleSlot = document.getElementById("title-slot");
const hint = document.getElementById("hint");
const lampsEl = document.getElementById("lamps");
const actions = document.getElementById("actions");
const statusEl = document.getElementById("status");
const todayBtn = document.getElementById("today");
const reading = document.getElementById("reading");
const readingCopy = document.getElementById("reading-copy");
const readingImg = document.getElementById("reading-img");
const readingCat = document.getElementById("reading-cat");
const readingNote = document.getElementById("reading-note");
const live = document.getElementById("live");
const keepBtn = document.getElementById("keep");
const linkBtn = document.getElementById("link");
const backBtn = document.getElementById("back");
const againBtn = document.getElementById("again");

const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");

const state = {
  mode: "rest",
  holding: false,
  ready: false,
  holdStart: 0,
  reduced: reduceQuery.matches,
  lastInput: "pointer",
  deck: [],
  pick: null,
  dealt: false,
  phase: "rest",
  angle: 0,
  settled: true,
  hoverRate: 1,
  roving: 0,
};

const cards = [];
let raf = 0;
let lastFrame = 0;
let holdRaf = 0;
let statusTimer = 0;

function slug(category) {
  return category.toLowerCase();
}

function imageSrc(category) {
  return `images/card-${slug(category)}.webp`;
}

function hashString(value) {
  let h = 2166136261;
  for (const ch of value) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function drawDeck() {
  return categories.map((category) => {
    const pool = answers[category];
    const index = Math.floor(Math.random() * pool.length);
    return { category, index, text: pool[index] };
  });
}

function todayPick() {
  const now = new Date();
  const key = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const h = hashString(key);
  const category = categories[h % categories.length];
  const index = Math.imul(h, 2246822519) >>> 0;
  const answerIndex = index % answers[category].length;
  return {
    category,
    index: answerIndex,
    text: answers[category][answerIndex],
    key,
  };
}

function todayNote() {
  const label = new Date().toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });
  return `For ${label}`;
}

function parseHash(hash) {
  const raw = decodeURIComponent(hash.replace(/^#/, ""));
  if (!raw || raw.toLowerCase() === "today") return raw.toLowerCase() === "today" ? "today" : null;
  const match = raw.match(/^([a-z]+)\/(\d+)$/i);
  if (!match) return null;
  const category = categories.find((item) => item.toLowerCase() === match[1].toLowerCase());
  const index = Number(match[2]);
  if (!category || index < 0 || index >= answers[category].length) return null;
  return { category, index, text: answers[category][index] };
}

function publishHash(pick) {
  const next = `#${slug(pick.category)}/${pick.index}`;
  if (location.hash !== next) {
    history.replaceState({ card: slug(pick.category), index: pick.index }, "", next);
  }
}

function say(text) {
  live.textContent = "";
  requestAnimationFrame(() => {
    live.textContent = text;
  });
}

function setStatus(text) {
  statusEl.textContent = text;
  window.clearTimeout(statusTimer);
  if (text) {
    statusTimer = window.setTimeout(() => {
      statusEl.textContent = "";
    }, 3200);
  }
}

function buildLamps() {
  for (let i = 0; i < LAMP_COUNT; i += 1) {
    const lamp = document.createElement("span");
    lamp.className = "lamp";
    lampsEl.appendChild(lamp);
  }
}

function paintLamps(progress) {
  const lamps = lampsEl.children;
  for (let i = 0; i < lamps.length; i += 1) {
    lamps[i].classList.toggle("is-on", progress >= (i + 1) / lamps.length);
  }
}

function buildCards() {
  categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.className = "card";
    button.type = "button";
    button.dataset.index = String(index);
    button.tabIndex = -1;
    button.setAttribute("aria-label", category);
    const hinge = document.createElement("span");
    hinge.className = "hinge";
    ["back", "front"].forEach((side) => {
      const face = document.createElement("span");
      face.className = `face ${side}`;
      const img = document.createElement("img");
      img.alt = "";
      img.width = 300;
      img.height = 420;
      img.src = imageSrc(category);
      img.decoding = "async";
      img.draggable = false;
      if (side === "back" && COVERS.includes(category)) img.setAttribute("fetchpriority", "high");
      face.appendChild(img);
      hinge.appendChild(face);
    });
    button.appendChild(hinge);
    button.pose = { x: 0, y: 0, scale: 1, rot: 0, tilt: 0, zDepth: 0, dim: 1, vx: 0, vy: 0, vscale: 0, vrot: 0, z: 1 };
    button.addEventListener("click", () => choose(index));
    button.addEventListener("pointerenter", () => preview(category));
    button.addEventListener("focus", () => preview(category));
    company.appendChild(button);
    cards.push(button);
  });
}

function heroScale() {
  const cardH = cards[0]?.offsetHeight || 180;
  const target = Math.min(company.clientWidth * 0.58, company.clientHeight * 0.5);
  if (!target) return 1.3;
  return Math.max(1.2, Math.min(2.05, target / cardH));
}

function restTarget(index) {
  const rank = COVERS.indexOf(categories[index]);
  const hero = heroScale();
  if (rank === 0) return { x: 10, y: -8, scale: hero, rot: -2.5, z: 40 };
  if (rank === 1) return { x: -48, y: 18, scale: hero * 0.92, rot: -12, z: 39 };
  if (rank === 2) return { x: 54, y: 24, scale: hero * 0.88, rot: 11, z: 38 };
  return { x: 0, y: 18, scale: hero * 0.82, rot: 0, z: 8 };
}

function ellipseTarget(index, angle) {
  const w = company.clientWidth || 320;
  const h = company.clientHeight || 320;
  const cardW = cards[0]?.offsetWidth || 140;
  const cardH = cards[0]?.offsetHeight || 196;
  const narrow = w < 560;
  const frontScale = narrow ? 1 : 1.08;
  const rx = narrow ? w * 0.46 : Math.min(w * 0.36, Math.max(48, w * 0.46 - (cardW * frontScale) / 2));
  const ry = narrow ? h * 0.2 : Math.min(h * 0.28, Math.max(36, h * 0.46 - (cardH * frontScale) / 2));
  const a = angle + (index / cards.length) * Math.PI * 2;
  const x = Math.cos(a) * rx;
  const y = Math.sin(a) * ry;
  const front = (Math.sin(a) + 1) / 2;
  return {
    x,
    y,
    scale: narrow ? 0.72 + front * 0.4 : 0.55 + front * 0.62,
    rot: 0,
    tilt: (0.5 - front) * 26,
    zDepth: (front - 0.42) * 200,
    dim: 0.38 + front * 0.62,
    z: 5 + Math.round(front * 80),
  };
}

function targetFor(index) {
  if (state.phase === "rest") return restTarget(index);
  return ellipseTarget(index, state.angle);
}

function applyPose(card) {
  const pose = card.pose;
  const depth = pose.zDepth || 0;
  const tilt = pose.tilt || 0;
  card.style.opacity = String(pose.dim == null ? 1 : pose.dim);
  card.style.transform = `translate(-50%, -50%) translate3d(${pose.x}px, ${pose.y}px, ${depth}px) rotateX(${tilt}deg) rotate(${pose.rot}deg) scale(${pose.scale})`;
  card.style.zIndex = String(pose.z);
}

function applyParallax() {
  if (state.reduced || (state.mode !== "spread" && state.mode !== "lift")) {
    if (state.mode !== "rest") company.style.transform = "";
    return;
  }
  const x = state.parallaxX || 0;
  const y = state.parallaxY || 0;
  company.style.transform = `rotateX(${14 + y}deg) rotateY(${x}deg)`;
}

function placeImmediate() {
  cards.forEach((card, index) => {
    const target = targetFor(index);
    card.pose.x = target.x;
    card.pose.y = target.y;
    card.pose.scale = target.scale;
    card.pose.rot = target.rot;
    card.pose.tilt = target.tilt || 0;
    card.pose.zDepth = target.zDepth || 0;
    card.pose.dim = target.dim == null ? 1 : target.dim;
    card.pose.z = target.z;
    card.pose.vx = card.pose.vy = card.pose.vscale = card.pose.vrot = 0;
    applyPose(card);
  });
}

function stepSpring(dt) {
  const stiffness = 74;
  const damping = 11;
  let energy = 0;
  cards.forEach((card, index) => {
    const target = targetFor(index);
    const pose = card.pose;
    const keys = [
      ["x", "vx"],
      ["y", "vy"],
      ["scale", "vscale"],
      ["rot", "vrot"],
    ];
    keys.forEach(([key, velocity]) => {
      const acc = (target[key] - pose[key]) * stiffness - pose[velocity] * damping;
      pose[velocity] += acc * dt;
      pose[key] += pose[velocity] * dt;
      energy += Math.abs(pose[velocity]) + Math.abs(target[key] - pose[key]);
    });
    pose.tilt = target.tilt || 0;
    pose.zDepth = target.zDepth || 0;
    pose.dim = target.dim == null ? 1 : target.dim;
    pose.z = target.z;
    applyPose(card);
  });
  return energy;
}

function frame(now) {
  const dt = Math.min(0.032, (now - lastFrame) / 1000 || 0.016);
  lastFrame = now;
  if (state.phase === "orbit") {
    state.angle += dt * 0.16 * state.hoverRate;
    cards.forEach((card, index) => {
      const target = ellipseTarget(index, state.angle);
      Object.assign(card.pose, target, { vx: 0, vy: 0, vscale: 0, vrot: 0 });
      applyPose(card);
    });
    applyParallax();
  } else if (state.phase === "spring") {
    const energy = stepSpring(dt);
    applyParallax();
    if (energy < 22) {
      state.phase = "orbit";
      state.settled = true;
      unlockDeck();
    }
  } else if (state.phase === "lift") {
    stepLift(dt);
    applyParallax();
  }
  if ((state.mode === "spread" || state.mode === "lift") && !state.reduced) {
    raf = requestAnimationFrame(frame);
  }
}

function stepLift(dt) {
  const stiffness = 86;
  const damping = 14;
  cards.forEach((card) => {
    const pose = card.pose;
    if (card.classList.contains("is-chosen")) {
      const goal = card.liftGoal;
      ["x", "y", "scale"].forEach((key) => {
        const velocity = `v${key === "scale" ? "scale" : key}`;
        const acc = (goal[key] - pose[key]) * stiffness - pose[velocity] * damping;
        pose[velocity] += acc * dt;
        pose[key] += pose[velocity] * dt;
      });
      pose.zDepth += (goal.zDepth - pose.zDepth) * Math.min(1, dt * 6);
      pose.tilt += ((goal.tilt || 0) - (pose.tilt || 0)) * Math.min(1, dt * 6);
      pose.dim = 1;
      pose.z = 200;
    } else {
      pose.dim = Math.max(0, (pose.dim == null ? 1 : pose.dim) - dt * 1.8);
      pose.zDepth -= dt * 220;
      pose.scale *= 1 - dt * 0.35;
    }
    applyPose(card);
  });
}

function startLoop() {
  cancelAnimationFrame(raf);
  lastFrame = performance.now();
  raf = requestAnimationFrame(frame);
}

function stopLoop() {
  cancelAnimationFrame(raf);
  raf = 0;
}

function preview(category) {
  if (state.mode !== "spread") return;
  hint.hidden = false;
  hint.textContent = category;
}

function setRoving(index) {
  state.roving = (index + cards.length) % cards.length;
  cards.forEach((card, i) => {
    card.tabIndex = state.mode === "spread" && i === state.roving ? 0 : -1;
  });
}

function unlockDeck() {
  company.removeAttribute("inert");
  company.removeAttribute("aria-hidden");
  setRoving(0);
  say("The deck is open. Choose a card.");
  if (state.lastInput === "key") cards[0].focus();
}

function lockDeck() {
  company.setAttribute("inert", "");
  company.setAttribute("aria-hidden", "true");
  cards.forEach((card) => {
    card.tabIndex = -1;
  });
}

function restCopy() {
  title.className = "apron-title";
  title.textContent = "Hold your question.";
  delete title.dataset.length;
  titleSlot.appendChild(title);
  hint.hidden = false;
  hint.textContent = "Press and hold the deck for one breath.";
  lampsEl.hidden = false;
  actions.hidden = true;
  todayBtn.hidden = false;
  statusEl.textContent = "";
  reading.hidden = true;
  reading.classList.remove("is-arriving");
  readingNote.hidden = true;
  paintLamps(0);
}

function openDeck() {
  state.deck = drawDeck();
  state.dealt = true;
  state.pick = null;
  state.mode = "spread";
  state.settled = state.reduced;
  body.dataset.mode = "spread";
  title.className = "apron-title";
  title.textContent = "Choose one.";
  delete title.dataset.length;
  titleSlot.appendChild(title);
  hint.hidden = false;
  hint.textContent = "Each one holds a different answer.";
  lampsEl.hidden = true;
  actions.hidden = true;
  todayBtn.hidden = true;
  reading.hidden = true;
  paintLamps(0);
  company.style.transform = "";
  if (state.reduced) {
    state.phase = "rest";
    placeImmediate();
    unlockDeck();
    return;
  }
  state.phase = "spring";
  state.angle = -Math.PI / 2;
  cards.forEach((card, index) => {
    const target = ellipseTarget(index, state.angle);
    const len = Math.hypot(target.x, target.y) || 1;
    card.pose.x = 0;
    card.pose.y = 0;
    card.pose.scale = 0.45;
    card.pose.vx = (target.x / len) * 1280;
    card.pose.vy = (target.y / len) * 1280;
    card.pose.vscale = 1.6;
    card.style.opacity = "1";
    card.classList.remove("is-chosen", "is-turning");
  });
  lockDeck();
  startLoop();
  window.setTimeout(() => {
    if (state.mode === "spread" && !state.settled) {
      state.phase = "orbit";
      state.settled = true;
      unlockDeck();
    }
  }, 1700);
}

function showReading(pick, options = {}) {
  state.pick = pick;
  state.mode = "reading";
  body.dataset.mode = "reading";
  stopLoop();
  lockDeck();
  reading.hidden = false;
  reading.classList.toggle("is-arriving", !state.reduced);
  readingImg.src = imageSrc(pick.category);
  readingImg.alt = `Illustration for ${pick.category}`;
  title.className = "reading-title";
  title.dataset.length = pick.text.length > 52 ? "long" : pick.text.length > 32 ? "mid" : "short";
  title.textContent = pick.text;
  title.tabIndex = -1;
  readingCopy.insertBefore(title, readingCat);
  readingCat.textContent = pick.category;
  if (options.note) {
    readingNote.hidden = false;
    readingNote.textContent = options.note;
  } else {
    readingNote.hidden = true;
    readingNote.textContent = "";
  }
  hint.hidden = true;
  lampsEl.hidden = true;
  actions.hidden = false;
  todayBtn.hidden = true;
  publishHash(pick);
  say(`${pick.category}. ${pick.text}`);
  if (state.lastInput === "key") {
    window.setTimeout(() => {
      if (state.mode === "reading") keepBtn.focus();
    }, state.reduced ? 0 : 180);
  }
}

function backToDeck() {
  if (!state.dealt) {
    state.deck = drawDeck();
    state.dealt = true;
  }
  resetFlight();
  state.mode = "spread";
  state.pick = null;
  body.dataset.mode = "spread";
  reading.hidden = true;
  title.className = "apron-title";
  title.textContent = "Choose one.";
  delete title.dataset.length;
  title.removeAttribute("tabindex");
  titleSlot.appendChild(title);
  hint.hidden = false;
  hint.textContent = "Each one holds a different answer.";
  actions.hidden = true;
  todayBtn.hidden = true;
  lampsEl.hidden = true;
  setStatus("");
  history.replaceState(null, "", location.pathname + location.search);
  if (state.reduced) {
    unlockDeck();
    return;
  }
  state.phase = "orbit";
  state.settled = true;
  unlockDeck();
  startLoop();
  const index = state.roving || 0;
  cards[index].focus();
}

function askAgain() {
  state.mode = "rest";
  state.pick = null;
  state.ready = false;
  state.phase = "rest";
  body.dataset.mode = "rest";
  stopLoop();
  company.style.transform = "";
  restCopy();
  title.removeAttribute("tabindex");
  lockDeck();
  placeImmediate();
  history.replaceState(null, "", location.pathname + location.search);
  holdBtn.focus();
}

function resetFlight() {
  cards.forEach((card) => {
    card.classList.remove("is-chosen", "is-turning");
    card.liftGoal = null;
    if (card.pose) card.pose.dim = 1;
  });
}

function choose(index) {
  if (state.mode !== "spread") return;
  if (!state.reduced && !state.settled) return;
  const pick = state.deck[index];
  if (!pick) return;
  state.roving = index;
  if (navigator.vibrate) navigator.vibrate(10);
  if (state.reduced) {
    showReading(pick);
    return;
  }
  flyCard(index, pick);
}

function flyCard(index, pick) {
  const card = cards[index];
  state.mode = "lift";
  state.phase = "lift";
  body.dataset.mode = "lift";
  card.classList.add("is-chosen");
  const stageH = stage.clientHeight || 420;
  const cardH = card.offsetHeight || 196;
  card.liftGoal = {
    x: 0,
    y: 6,
    scale: Math.min(1.85, (stageH * 0.62) / cardH),
    zDepth: Math.min(90, stageH * 0.12),
    tilt: 0,
  };
  lockDeck();
  startLoop();
  window.setTimeout(() => {
    if (state.mode === "lift") card.classList.add("is-turning");
  }, 420);
  window.setTimeout(() => {
    if (state.mode !== "lift") return;
    showReading(pick);
  }, 1020);
}

function beginHold() {
  if (state.holding || state.mode !== "rest") return;
  state.holding = true;
  state.ready = false;
  state.holdStart = performance.now();
  holdBtn.setAttribute("aria-pressed", "true");
  tickHold();
}

function tickHold() {
  if (!state.holding) return;
  const progress = Math.min(1, (performance.now() - state.holdStart) / HOLD_MS);
  paintLamps(progress);
  if (!state.reduced) {
    const lift = progress >= 1 ? -10 : 0;
    const scale = 1 + Math.min(progress, 1) * 0.04;
    company.style.transform = `translateY(${lift}px) scale(${scale})`;
  }
  if (progress >= 1 && !state.ready) {
    state.ready = true;
    title.textContent = "Release.";
    hint.textContent = "The deck will open.";
    say("Release to open the deck.");
    if (navigator.vibrate) navigator.vibrate(18);
  }
  holdRaf = requestAnimationFrame(tickHold);
}

function endHold() {
  if (!state.holding) return;
  state.holding = false;
  cancelAnimationFrame(holdRaf);
  holdBtn.setAttribute("aria-pressed", "false");
  company.style.transform = "";
  if (state.ready) {
    openDeck();
    return;
  }
  paintLamps(0);
  title.textContent = "Hold your question.";
  hint.textContent = "Press and hold the deck for one breath.";
}

function cancelHold() {
  if (!state.holding) return;
  state.ready = false;
  endHold();
}

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines;
}

async function renderCard(pick) {
  await document.fonts.load("800 72px Anybody");
  await document.fonts.load("560 54px Petrona");
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1440;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#241428";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#e23b12";
  ctx.lineWidth = 28;
  ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);
  ctx.fillStyle = "#f4ecdf";
  ctx.fillRect(64, 64, canvas.width - 128, canvas.height - 128);

  const img = new Image();
  img.src = imageSrc(pick.category);
  await img.decode();
  const artX = 110;
  const artY = 120;
  const artW = 860;
  const artH = 760;
  const scale = Math.min(artW / img.width, artH / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, artX + (artW - dw) / 2, artY + (artH - dh) / 2, dw, dh);

  ctx.fillStyle = "#1c1210";
  ctx.font = "560 54px Petrona, Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const lines = wrapLines(ctx, pick.text, 820);
  let y = 930;
  lines.forEach((line) => {
    ctx.fillText(line, canvas.width / 2, y);
    y += 68;
  });
  ctx.fillStyle = "#4a2278";
  ctx.font = "750 32px Anybody, sans-serif";
  ctx.fillText(pick.category, canvas.width / 2, y + 18);
  ctx.fillStyle = "#1c1210";
  ctx.font = "700 28px Anybody, sans-serif";
  ctx.fillText("Cards of Answers", canvas.width / 2, 1288);
  ctx.font = "500 22px Petrona, Georgia, serif";
  ctx.fillText("saberzou.github.io/cards-of-answers", canvas.width / 2, 1334);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob || blob.size < 8000) throw new Error("empty image");
  return blob;
}

async function keepCard() {
  if (!state.pick) return;
  keepBtn.disabled = true;
  try {
    const blob = await renderCard(state.pick);
    const file = new File([blob], `cards-of-answers-${slug(state.pick.category)}.png`, {
      type: "image/png",
    });
    const shareData = {
      files: [file],
      title: "Cards of Answers",
      text: state.pick.text,
      url: location.href,
    };
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share(shareData);
      setStatus("Share sheet opened.");
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setStatus("Image saved.");
    }
  } catch (error) {
    if (error && error.name === "AbortError") {
      setStatus("");
    } else {
      setStatus("The image couldn’t be made. Copy the link instead.");
    }
  } finally {
    keepBtn.disabled = false;
  }
}

async function copyLink() {
  const url = location.href;
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const field = document.createElement("textarea");
    field.value = url;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-999px";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
  setStatus("Link copied.");
}

function openToday() {
  const pick = todayPick();
  state.deck = categories.map((category) => {
    const index = category === pick.category ? pick.index : 0;
    return { category, index, text: answers[category][index] };
  });
  state.dealt = false;
  try {
    localStorage.setItem("coa-today", pick.key);
  } catch {
    /* private mode */
  }
  showReading(pick, { note: todayNote() });
}

function openFromHash() {
  const parsed = parseHash(location.hash);
  if (parsed === "today") {
    openToday();
    return;
  }
  if (parsed) {
    state.deck = categories.map((category) => {
      const index = category === parsed.category ? parsed.index : 0;
      return { category, index, text: answers[category][index] };
    });
    state.dealt = false;
    showReading(parsed);
  }
}

function syncReduced() {
  state.reduced = reduceQuery.matches;
  body.classList.toggle("is-reduced", state.reduced);
  if (state.reduced) stopLoop();
  else if (state.mode === "spread") {
    state.phase = "orbit";
    startLoop();
  } else {
    state.phase = "rest";
    placeImmediate();
  }
}

function keepAnswerSelectable(event) {
  return Boolean(event.target.closest && event.target.closest(".reading-title"));
}

theater.addEventListener("touchstart", (event) => {
  if (keepAnswerSelectable(event)) return;
  event.preventDefault();
}, { passive: false, capture: true });
theater.addEventListener("contextmenu", (event) => {
  if (keepAnswerSelectable(event)) return;
  event.preventDefault();
});
document.addEventListener("selectstart", (event) => {
  if (keepAnswerSelectable(event)) return;
  event.preventDefault();
});
document.addEventListener("dragstart", (event) => {
  if (event.target.closest && event.target.closest("img")) event.preventDefault();
});

stage.addEventListener("pointermove", (event) => {
  if (state.reduced || (state.mode !== "spread" && state.mode !== "lift")) return;
  const rect = stage.getBoundingClientRect();
  state.parallaxX = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
  state.parallaxY = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
});
stage.addEventListener("pointerleave", () => {
  state.parallaxX = 0;
  state.parallaxY = 0;
});

holdBtn.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  state.lastInput = "pointer";
  holdBtn.setPointerCapture(event.pointerId);
  event.preventDefault();
  beginHold();
});
holdBtn.addEventListener("pointerup", endHold);
holdBtn.addEventListener("pointercancel", cancelHold);
holdBtn.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  if (event.key !== " " && event.key !== "Enter") return;
  state.lastInput = "key";
  event.preventDefault();
  beginHold();
});
holdBtn.addEventListener("keyup", (event) => {
  if (event.key !== " " && event.key !== "Enter") return;
  event.preventDefault();
  endHold();
});
holdBtn.addEventListener("blur", cancelHold);
holdBtn.addEventListener("click", (event) => event.preventDefault());

company.addEventListener("keydown", (event) => {
  if (state.mode !== "spread") return;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    setRoving(state.roving + 1);
    cards[state.roving].focus();
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    setRoving(state.roving - 1);
    cards[state.roving].focus();
  }
});

company.addEventListener("pointerenter", (event) => {
  if (finePointer.matches && event.pointerType === "mouse") state.hoverRate = 0.22;
});
company.addEventListener("pointerleave", () => {
  state.hoverRate = document.activeElement && company.contains(document.activeElement) ? 0.4 : 1;
});
company.addEventListener("focusin", () => {
  state.hoverRate = 0.4;
});
company.addEventListener("focusout", () => {
  state.hoverRate = 1;
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (state.mode === "reading") {
    event.preventDefault();
    backToDeck();
  } else if (state.mode === "spread") {
    event.preventDefault();
    askAgain();
  }
});

keepBtn.addEventListener("click", keepCard);
linkBtn.addEventListener("click", copyLink);
backBtn.addEventListener("click", backToDeck);
againBtn.addEventListener("click", askAgain);
todayBtn.addEventListener("click", () => {
  state.lastInput = "pointer";
  openToday();
});

window.addEventListener("hashchange", openFromHash);
reduceQuery.addEventListener("change", syncReduced);
window.addEventListener("resize", () => {
  if (state.mode === "rest") placeImmediate();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopLoop();
  else if ((state.mode === "spread" || state.mode === "lift") && !state.reduced) startLoop();
});

buildLamps();
buildCards();
state.deck = drawDeck();
syncReduced();
lockDeck();
state.phase = "rest";
placeImmediate();
requestAnimationFrame(() => {
  if (state.mode === "rest") placeImmediate();
});
openFromHash();
