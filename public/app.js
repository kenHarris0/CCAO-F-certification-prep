const DOMAINS = {
  1: "Prompting & Task Execution",
  2: "Output Evaluation & Validation",
  3: "Product & Model Selection",
  4: "Workflow Integration & Solution Design",
  5: "Configuration & Knowledge Management",
  6: "Governance, Risk & Responsible Use",
  7: "Troubleshooting & Optimization"
};
const WEIGHTS = { 1: 14, 2: 21, 3: 12, 4: 16, 5: 12, 6: 15, 7: 10 };
const PASS_TARGET = 75; // % we recommend before booking; real exam uses a scaled 720/1000

const $app = document.getElementById("app");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// Data comes from data/lessons.js and data/questions.js (loaded in index.html).
const lessons = [...window.LESSONS].sort((a, b) => a.domain - b.domain);
const QUESTIONS = window.QUESTIONS;
const stats = { questions: {}, total: QUESTIONS.length };
QUESTIONS.forEach((q) => (stats.questions[q.domain] = (stats.questions[q.domain] || 0) + 1));

// Split `count` across domains proportionally to exam weights, capped by availability.
function weightedPick(count) {
  const byDomain = {};
  QUESTIONS.forEach((q) => (byDomain[q.domain] ||= []).push(q));
  const domains = Object.keys(WEIGHTS).map(Number);
  const avail = (d) => (byDomain[d] || []).length;
  const alloc = {};
  let assigned = 0;
  for (const d of domains) { alloc[d] = Math.min(Math.round((count * WEIGHTS[d]) / 100), avail(d)); assigned += alloc[d]; }
  const order = [...domains].sort((a, b) => WEIGHTS[b] - WEIGHTS[a]);
  for (let guard = 0; assigned !== count && guard < 1000; guard++) {
    let changed = false;
    for (const d of order) {
      if (assigned < count && alloc[d] < avail(d)) { alloc[d]++; assigned++; changed = true; }
      else if (assigned > count && alloc[d] > 0) { alloc[d]--; assigned--; changed = true; }
      if (assigned === count) break;
    }
    if (!changed) break;
  }
  return shuffle(domains.flatMap((d) => shuffle(byDomain[d] || []).slice(0, alloc[d])));
}

function pickQuestions(mode, domain, count) {
  count = Math.max(1, Math.min(200, count || 10));
  if (mode === "domain") return shuffle(QUESTIONS.filter((q) => q.domain === domain)).slice(0, count);
  if (mode === "mock") return weightedPick(Math.min(count, QUESTIONS.length));
  return shuffle(QUESTIONS).slice(0, count);
}
let quiz = null; // active quiz state
let timerId = null;

// ───────── navigation ─────────
document.querySelectorAll("nav button").forEach((b) => b.addEventListener("click", () => go(b.dataset.view)));
function go(view, arg) {
  if (quiz && !quiz.finished && view !== "run" && !confirm("Leave the current quiz? Your progress in it will be lost.")) return;
  if (view !== "run") stopTimer();
  if (view !== "run" && view !== "results") quiz = null;
  document.querySelectorAll("nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === (view === "run" || view === "results" ? "quiz" : view)));
  window.scrollTo(0, 0);
  ({ home: renderHome, learn: renderLearn, quiz: renderQuizSetup, run: renderQuestion, results: renderResults })[view](arg);
}

// ───────── overview ─────────
function renderHome() {
  const ov = lessons.find((l) => l.domain === 0);
  $app.innerHTML = `
    <h1>Claude Certified Associate – Foundations</h1>
    <p class="muted">${esc(ov?.summary)}</p>
    <div class="grid" style="margin:20px 0">
      <div class="card"><div class="stat">60</div><div class="muted">questions</div></div>
      <div class="card"><div class="stat">120 min</div><div class="muted">time limit</div></div>
      <div class="card"><div class="stat">720 / 1000</div><div class="muted">scaled passing score</div></div>
      <div class="card"><div class="stat">${stats.total}</div><div class="muted">practice questions</div></div>
    </div>
    <div class="card">
      <h2 style="margin-top:0">Domain weights</h2>
      ${Object.keys(DOMAINS).map((d) => `
        <div class="wrow"><div><div class="lbl">${d}. ${DOMAINS[d]}</div><div class="bar"><span style="width:${WEIGHTS[d] * 4}%"></span></div></div>
        <strong>${WEIGHTS[d]}%</strong></div>`).join("")}
    </div>
    ${(ov?.sections || []).filter((s) => s.heading !== "The 7 domains").map((s) => `
      <div class="card"><h3 style="margin-top:0">${esc(s.heading)}</h3>
      <ul class="points">${s.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>`).join("")}
    <p class="muted" style="font-size:13px">${(ov?.sources || []).map(esc).join(" ")}</p>
    <div class="row">
      <button class="btn" onclick="go('learn', 1)">Start learning →</button>
      <button class="btn ghost" onclick="go('quiz')">Take a practice quiz</button>
    </div>`;
}

// ───────── learn ─────────
function renderLearn(domain = 1) {
  const l = lessons.find((x) => x.domain === domain);
  $app.innerHTML = `
    <div class="learn">
      <aside class="side card" style="padding:10px">
        ${lessons.filter((x) => x.domain > 0).map((x) => `
          <button class="${x.domain === domain ? "active" : ""}" onclick="go('learn', ${x.domain})">
            ${x.domain}. ${esc(x.title)}<br><small>${x.weight}% of exam · ${stats.questions[x.domain] || 0} Qs</small></button>`).join("")}
      </aside>
      <article>
        <span class="pill">Domain ${l.domain} · ${l.weight}% of exam</span>
        <h1 style="margin-top:10px">${esc(l.title)}</h1>
        <p class="muted">${esc(l.summary)}</p>
        ${l.sections.map((s) => `<div class="card"><h3 style="margin-top:0">${esc(s.heading)}</h3>
          <ul class="points">${s.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>`).join("")}
        ${l.traps?.length ? `<h3>⚠ Exam traps</h3>${l.traps.map((t) => `<div class="trap">${esc(t)}</div>`).join("")}` : ""}
        <div class="row" style="margin-top:20px">
          <button class="btn" onclick="startQuiz({mode:'domain', domain:${l.domain}, count:10, instant:true})">Practice Domain ${l.domain} →</button>
          ${l.domain < 7 ? `<button class="btn ghost" onclick="go('learn', ${l.domain + 1})">Next lesson</button>` : ""}
        </div>
      </article>
    </div>`;
}

// ───────── quiz setup ─────────
let setup = { mode: "mixed", domain: 1, count: 10, instant: true };
function renderQuizSetup() {
  const modes = [
    ["mixed", "Quick mixed quiz", "Random questions from every domain."],
    ["domain", "By domain", "Focus on one domain."],
    ["mock", "Full mock exam", "Weighted like the real exam, with a 120-min timer. Answers are shown at the end."]
  ];
  $app.innerHTML = `
    <h1>Practice quiz</h1>
    <p class="muted">Choose a mode. When you answer wrong, the app shows the correct answer and explains why.</p>
    <div class="grid">
      ${modes.map(([k, t, d]) => `<div class="card mode ${setup.mode === k ? "sel" : ""}" onclick="pickMode('${k}')">
        <strong>${t}</strong><div class="muted" style="font-size:14px">${d}</div></div>`).join("")}
    </div>
    <div class="card row">
      ${setup.mode === "domain" ? `<label>Domain <select id="dom">${Object.keys(DOMAINS).map((d) =>
        `<option value="${d}" ${+d === setup.domain ? "selected" : ""}>${d}. ${DOMAINS[d]} (${stats.questions[d] || 0})</option>`).join("")}</select></label>` : ""}
      <label>Questions <input id="cnt" type="number" min="1" max="${stats.total}" value="${setup.mode === "mock" ? Math.min(60, stats.total) : setup.count}" style="width:80px"></label>
      <label><input id="inst" type="checkbox" ${setup.mode === "mock" ? "" : "checked"}> Show answer after each question</label>
      <button class="btn" id="startBtn">Start →</button>
    </div>`;
  document.getElementById("startBtn").onclick = () => {
    const opts = {
      mode: setup.mode === "mixed" ? "all" : setup.mode,
      domain: +(document.getElementById("dom")?.value || setup.domain),
      count: +document.getElementById("cnt").value || 10,
      instant: document.getElementById("inst").checked
    };
    if (setup.mode === "domain") setup.domain = opts.domain;
    if (setup.mode !== "mock") setup.count = opts.count;
    startQuiz(opts);
  };
}
function pickMode(m) { setup.mode = m; renderQuizSetup(); }

function startQuiz({ mode, domain, count, instant, questions }) {
  const qs = questions || pickQuestions(mode, domain, count);
  if (!qs.length) { alert("No questions found for this selection."); return; }
  quiz = {
    mode, domain, instant,
    items: qs.map((q) => ({ q, order: shuffle(q.options.map((_, i) => i)), chosen: [], submitted: false, correct: false })),
    i: 0, start: Date.now(), finished: false,
    timeLimit: mode === "mock" ? Math.round((120 * 60 * qs.length) / 60) : null // 2 min per question
  };
  if (quiz.timeLimit) startTimer();
  go("run");
}

function startTimer() {
  stopTimer();
  timerId = setInterval(() => {
    const el = document.getElementById("timer");
    const left = quiz.timeLimit - Math.floor((Date.now() - quiz.start) / 1000);
    if (el) el.textContent = fmtTime(Math.max(0, left));
    if (left <= 0) { stopTimer(); alert("Time's up!"); finishQuiz(); }
  }, 1000);
}
function stopTimer() { if (timerId) clearInterval(timerId); timerId = null; }

// ───────── question ─────────
function renderQuestion() {
  const it = quiz.items[quiz.i];
  const { q } = it;
  const multi = q.answer.length > 1;
  const done = it.submitted && quiz.instant;
  const letters = "ABCDEFGH";
  const answeredCount = quiz.items.filter((x) => x.submitted).length;

  $app.innerHTML = `
    <div class="qhead">
      <span>Question <strong>${quiz.i + 1}</strong> of ${quiz.items.length}</span>
      <span class="pill">D${q.domain} · ${DOMAINS[q.domain]}</span>
      ${quiz.timeLimit ? `<span>⏱ <span class="timer" id="timer">--:--</span></span>` : ""}
    </div>
    <div class="bar" style="margin-bottom:18px"><span style="width:${(answeredCount / quiz.items.length) * 100}%"></span></div>
    <div class="card">
      ${q.tags?.includes("sample-style") ? `<span class="pill">Exam-style sample</span>` : ""}
      <div class="question">${esc(q.question)}</div>
      ${multi ? `<p class="muted" style="margin-top:-8px">Select ${q.answer.length} answers.</p>` : ""}
      ${it.order.map((orig, k) => {
        let cls = "opt" + (multi ? " multi" : "");
        if (done) {
          if (q.answer.includes(orig)) cls += " right";
          else if (it.chosen.includes(orig)) cls += " wrong";
        } else if (it.chosen.includes(orig)) cls += " chosen";
        return `<button class="${cls}" data-o="${orig}" ${done ? "disabled" : ""}>
          <span class="key">${letters[k]}</span><span>${esc(q.options[orig])}</span></button>`;
      }).join("")}
      ${done ? `
        <div class="feedback ${it.correct ? "ok" : "bad"}">
          <strong>${it.correct ? "✔ Correct!" : "✘ Not quite."}</strong>
          ${it.correct ? "" : `<div style="margin-top:6px"><strong>Correct answer:</strong> ${q.answer
            .map((a) => `${letters[it.order.indexOf(a)]}. ${esc(q.options[a])}`).join("<br>")}</div>`}
          <div style="margin-top:8px"><strong>Why:</strong> ${esc(q.explanation)}</div>
        </div>` : ""}
      <div class="row" style="justify-content:space-between">
        <button class="btn ghost" id="prev" ${quiz.i === 0 ? "disabled" : ""}>← Back</button>
        <div class="row">
          ${!quiz.instant || !it.submitted ? `<button class="btn" id="submit" ${it.chosen.length !== q.answer.length ? "disabled" : ""}>
            ${quiz.instant ? "Check answer" : quiz.i === quiz.items.length - 1 ? "Save & finish" : "Save & next"}</button>` : ""}
          ${quiz.instant && it.submitted ? `<button class="btn" id="next">${quiz.i === quiz.items.length - 1 ? "See results →" : "Next →"}</button>` : ""}
          ${!quiz.instant ? `<button class="btn ghost" id="finish">Finish exam</button>` : ""}
        </div>
      </div>
    </div>`;

  if (quiz.timeLimit) document.getElementById("timer").textContent =
    fmtTime(Math.max(0, quiz.timeLimit - Math.floor((Date.now() - quiz.start) / 1000)));

  $app.querySelectorAll(".opt").forEach((b) => b.addEventListener("click", () => {
    const o = +b.dataset.o;
    if (multi) {
      if (it.chosen.includes(o)) it.chosen = it.chosen.filter((x) => x !== o);
      else if (it.chosen.length < q.answer.length) it.chosen.push(o);
    } else it.chosen = [o];
    if (!quiz.instant) it.submitted = false;
    renderQuestion();
  }));
  document.getElementById("prev").onclick = () => { quiz.i--; renderQuestion(); };
  const sub = document.getElementById("submit");
  if (sub) sub.onclick = () => {
    it.submitted = true;
    it.correct = it.chosen.length === q.answer.length && q.answer.every((a) => it.chosen.includes(a));
    if (quiz.instant) renderQuestion();
    else if (quiz.i < quiz.items.length - 1) { quiz.i++; renderQuestion(); }
    else finishQuiz();
  };
  const nx = document.getElementById("next");
  if (nx) nx.onclick = () => { if (quiz.i < quiz.items.length - 1) { quiz.i++; renderQuestion(); } else finishQuiz(); };
  const fin = document.getElementById("finish");
  if (fin) fin.onclick = () => {
    const left = quiz.items.filter((x) => !x.submitted).length;
    if (!left || confirm(`${left} question(s) unanswered. They'll be marked wrong. Finish anyway?`)) finishQuiz();
  };
}

function finishQuiz() {
  stopTimer();
  quiz.finished = true;
  quiz.durationSec = Math.round((Date.now() - quiz.start) / 1000);
  go("results");
}

function retryMissed() {
  const missed = quiz.items.filter((x) => !(x.submitted && x.correct)).map((x) => x.q);
  quiz = null;
  startQuiz({ mode: "retry", instant: true, questions: shuffle(missed) });
}

// ───────── results ─────────
function renderResults() {
  const items = quiz.items;
  const right = items.filter((x) => x.submitted && x.correct).length;
  const pct = Math.round((right / items.length) * 100);
  const byD = {};
  items.forEach((x) => { const d = (byD[x.q.domain] ||= { t: 0, c: 0 }); d.t++; if (x.submitted && x.correct) d.c++; });
  const wrong = items.filter((x) => !(x.submitted && x.correct));
  const letters = "ABCDEFGH";

  $app.innerHTML = `
    <h1>Results</h1>
    <div class="card row" style="gap:28px">
      <div><div class="big ${pct >= PASS_TARGET ? "ok-t" : "bad-t"}">${pct}%</div><div class="muted">${right} / ${items.length} correct</div></div>
      <div style="flex:1;min-width:220px">
        <strong>${pct >= PASS_TARGET ? "🎉 On track: you're at or above the 75% readiness target." : "Keep practicing. Aim for 75% or more before booking the exam."}</strong>
        <div class="muted" style="font-size:14px">Time: ${fmtTime(quiz.durationSec)}. The real exam reports a scaled score (720/1000 to pass), so treat this percentage as a readiness guide only.</div>
      </div>
    </div>
    <div class="card"><h3 style="margin-top:0">By domain</h3>
      ${Object.keys(byD).sort().map((d) => { const p = Math.round((byD[d].c / byD[d].t) * 100); return `
        <div class="wrow"><div><div class="lbl">${d}. ${DOMAINS[d]} <span class="muted">(${byD[d].c}/${byD[d].t})</span></div>
        <div class="bar"><span style="width:${p}%;background:${p >= PASS_TARGET ? "var(--ok)" : "var(--bad)"}"></span></div></div>
        <strong>${p}%</strong></div>`; }).join("")}
    </div>
    <div class="row" style="margin-bottom:16px">
      ${wrong.length ? `<button class="btn" onclick="retryMissed()">Retry the ${wrong.length} I missed</button>` : ""}
      <button class="btn ghost" onclick="go('quiz')">New quiz</button>
      <button class="btn ghost" onclick="go('learn', ${wrong[0]?.q.domain || 1})">Review lessons</button>
    </div>
    ${wrong.length ? `<div class="card"><h3 style="margin-top:0">Review: questions you missed (${wrong.length})</h3>
      ${wrong.map((x) => `<div class="review-item">
        <span class="pill">D${x.q.domain}</span>
        <div class="question" style="font-size:16px">${esc(x.q.question)}</div>
        <div class="bad-t"><strong>Your answer:</strong> ${x.chosen.length ? x.chosen.map((c) => esc(x.q.options[c])).join("; ") : "<em>(not answered)</em>"}</div>
        <div class="ok-t"><strong>Correct answer:</strong> ${x.q.answer.map((a) => esc(x.q.options[a])).join("; ")}</div>
        <div class="muted" style="margin-top:6px"><strong>Why:</strong> ${esc(x.q.explanation)}</div>
      </div>`).join("")}</div>` : `<div class="card ok-t"><strong>Perfect score. No mistakes to review!</strong></div>`}`;
}

// ───────── boot ─────────
go("home");
