"use strict";
const birthdayConfig = { name: "Sakshi", age: 22, birthday: "24 October", passkey: "24102004" };
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
let timers = [], typeTimer = null, loading = false, scratched = false, envOpened = false, letterDone = false;
const later = (f, ms) => { const t = setTimeout(f, ms); timers.push(t); return t; };

/* ---------- navigation ---------- */
function navigateToScreen(id) {
  timers.forEach(clearTimeout); timers = []; clearInterval(typeTimer);
  $$(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
  window.scrollTo(0, 0); $("#" + id).scrollTop = 0;
  if (id === "scratch") initializeScratchCard();
  if (id === "letter") startLetter();
  if (id === "final") showFinalGift();
}

/* ---------- gate + loading ---------- */
function validatePasskey(e) {
  e.preventDefault();
  if (loading) return;
  const v = $("#passkey").value;
  if (v === birthdayConfig.passkey) { $("#err").textContent = ""; showLoadingScreen(); return; }
  $("#err").textContent = "That's not quite it. Try the date as DDMMYYYY.";
  const c = $("#gateCard"); c.classList.remove("shake"); void c.offsetWidth; c.classList.add("shake");
}
function showLoadingScreen() {
  loading = true; navigateToScreen("loading");
  const msgs = ["Unlocking something special...", "Gathering all the little pieces of love...", `Your birthday surprise is almost ready, ${birthdayConfig.name} ♥`];
  msgs.forEach((m, i) => later(() => ($("#loadMsg").textContent = m), i * 900));
  later(() => { loading = false; navigateToScreen("welcome"); toggleMusic(); }, 2800);
}

/* ---------- envelope + letter ---------- */
function openEnvelope() {
  if (envOpened) return;
  envOpened = true; $("#env").classList.add("open"); $("#openEnv").hidden = true;
  later(() => playConfetti(40), 900);
  later(() => ($("#toLetter").hidden = false), 1600);
}
function startLetter() {
  const ps = $$("#letterBody p");
  if (letterDone) { ps.forEach((p) => p.classList.add("show")); return; }
  let i = 0;
  typeTimer = setInterval(() => {
    if (i >= ps.length) { clearInterval(typeTimer); letterDone = true; return; }
    ps[i].style.display = "block"; requestAnimationFrame(() => ps[i - 1 < 0 ? 0 : i].classList.add("show")); i++;
  }, reduced ? 50 : 1100);
}
function showFullLetter() {
  clearInterval(typeTimer); letterDone = true;
  $$("#letterBody p").forEach((p) => p.classList.add("show"));
}

/* ---------- scratch card ---------- */
function initializeScratchCard() {
  const cv = $("#scratchCanvas");
  if (scratched) { cv.classList.add("done"); return; }
  const r = cv.getBoundingClientRect(), ctx = cv.getContext("2d");
  cv.width = Math.round(r.width); cv.height = Math.round(r.height);
  const g = ctx.createLinearGradient(0, 0, cv.width, cv.height);
  g.addColorStop(0, "#e8d3ae"); g.addColorStop(.5, "#D7B58B"); g.addColorStop(1, "#f3e4c6");
  ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = "#813846"; ctx.textAlign = "center"; ctx.font = "700 12px DM Sans, sans-serif";
  ctx.fillText("A LITTLE GIFT FOR YOU", cv.width / 2, cv.height / 2 - 14);
  ctx.font = "500 18px Cormorant Garamond, serif";
  ctx.fillText("Scratch here to reveal your birthday surprise! ✨", cv.width / 2, cv.height / 2 + 12, cv.width - 20);
  let down = false, moves = 0;
  const scratch = (e) => {
    const b = cv.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out"; ctx.beginPath();
    ctx.arc(e.clientX - b.left, e.clientY - b.top, 20, 0, 7); ctx.fill();
    if (++moves % 6 === 0 && clearedFraction(ctx, cv) > 0.4) revealScratchReward();
  };
  cv.onpointerdown = (e) => { down = true; cv.setPointerCapture(e.pointerId); e.preventDefault(); scratch(e); };
  cv.onpointermove = (e) => { if (down) { e.preventDefault(); scratch(e); } };
  cv.onpointerup = cv.onpointercancel = () => { down = false; };
}
function clearedFraction(ctx, cv) {
  const d = ctx.getImageData(0, 0, cv.width, cv.height).data; let c = 0, n = 0;
  for (let i = 3; i < d.length; i += 16) { n++; if (d[i] < 20) c++; }
  return c / n;
}
function revealScratchReward() {
  if (scratched) return;
  scratched = true; $("#scratchCanvas").classList.add("done"); $("#revealBtn").hidden = true;
  $("#scratchMsg").textContent = "You found your little surprise! ♥"; $("#toCake").hidden = false; playConfetti(110);
}

/* ---------- cake ---------- */
function makeWish() {
  $("#cake").classList.add("dim"); $("#cakeSvg").classList.add("glowing");
  $("#cakeMsg").textContent = "Close your eyes, make a little wish, and keep it in your heart.";
  playConfetti(25, "star");
}
function blowOutCandles() {
  $("#cakeSvg").classList.remove("glowing"); $("#cakeSvg").classList.add("out"); $("#cake").classList.remove("dim");
  $("#cakeMsg").textContent = "Wish sealed. It's already on its way. ✨"; playConfetti(40);
}
function cutCake() {
  if ($("#cakeSvg").classList.contains("cut")) return;
  $("#cakeSvg").classList.add("cut"); $("#cutBtn").disabled = true;
  later(() => { playConfetti(120); $("#cakeMsg").textContent = "A sweet moment for the sweetest birthday girl ❤️"; $("#toGift").hidden = false; }, 1400);
}

/* ---------- gift ---------- */
function openGiftBox() {
  const g = $("#giftBox"); $("#openGift").disabled = true;
  [["bounce", 0], ["loose", 1300], ["lift", 1900], ["light", 2400], ["away", 3400]].forEach(([c, t]) => later(() => g.classList.add(c), t));
  later(() => { playConfetti(100); floatHearts(10); }, 2500);
  later(() => navigateToScreen("final"), 4600);
}

/* ---------- final ---------- */
function showFinalGift() {
  const f = $("#final"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go");
}
function thankYou() {
  $("#thankMsg").textContent = "Your gift has been accepted. Happy Birthday, Sakshi! ❤️"; playConfetti(100); floatHearts(14);
}
function restartExperience() {
  scratched = envOpened = letterDone = false; loading = false;
  $("#passkey").value = ""; $("#err").textContent = "";
  $("#env").classList.remove("open"); $("#openEnv").hidden = false; $("#toLetter").hidden = true;
  $$("#letterBody p").forEach((p) => { p.classList.remove("show"); p.style.display = ""; });
  $("#revealBtn").hidden = false; $("#scratchMsg").textContent = ""; $("#toCake").hidden = true; $("#scratchCanvas").classList.remove("done");
  $("#cakeSvg").className.baseVal = ""; $("#cake").classList.remove("dim"); $("#cakeMsg").textContent = ""; $("#cutBtn").disabled = false; $("#toGift").hidden = true;
  $("#giftBox").className = "gift"; $("#openGift").disabled = false; $("#thankMsg").textContent = "";
  navigateToScreen("gate");
}

/* ---------- confetti + hearts ---------- */
let parts = [], raf = 0;
function playConfetti(n = 80, kind) {
  const cv = $("#confetti"), ctx = cv.getContext("2d");
  cv.width = innerWidth; cv.height = innerHeight;
  if (reduced) n = Math.min(n, 15);
  const cols = ["#813846", "#C66A76", "#F3CECC", "#D7B58B", "#fff"];
  for (let i = 0; i < n; i++) parts.push({ x: Math.random() * cv.width, y: -10 - Math.random() * 120, vx: Math.random() * 4 - 2, vy: 2 + Math.random() * 3, s: 5 + Math.random() * 6, r: Math.random() * 6, c: cols[i % 5], star: kind === "star" });
  if (raf) return;
  (function loop() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter((p) => p.y < cv.height + 20);
    parts.forEach((p) => { p.x += p.vx; p.y += p.vy; p.r += .1; ctx.fillStyle = p.c; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      if (p.star) { ctx.font = p.s * 2 + "px serif"; ctx.fillText("✦", 0, 0); } else ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); ctx.restore(); });
    raf = parts.length ? requestAnimationFrame(loop) : (ctx.clearRect(0, 0, cv.width, cv.height), 0);
  })();
}
function floatHearts(n) {
  const box = $("#hearts");
  for (let i = 0; i < n; i++) {
    const h = document.createElement("span"); h.textContent = "♥";
    h.style.cssText = `left:${Math.random() * 100}%;font-size:${14 + Math.random() * 22}px;animation-duration:${8 + Math.random() * 8}s;animation-delay:${Math.random() * 3}s`;
    box.appendChild(h); if (box.children.length > 40) box.firstChild.remove();
  }
}

/* ---------- music ---------- */
function toggleMusic() {
  const a = $("#audio"), m = document.querySelector(".music");
  if (a.paused) a.play().then(() => { m.classList.add("on"); $("#musicBtn").textContent = "🔊"; $("#musicBtn").setAttribute("aria-label", "Pause music"); }).catch(() => musicMissing());
  else { a.pause(); m.classList.remove("on"); $("#musicBtn").textContent = "🔈"; $("#musicBtn").setAttribute("aria-label", "Play music"); }
}
function musicMissing() { $("#musicBtn").disabled = true; $("#musicTitle").textContent = "Add assets/audio/birthday-music.mp3"; }

/* ---------- wiring ---------- */
document.addEventListener("DOMContentLoaded", () => {
  floatHearts(14);
  $("#passkey").addEventListener("input", (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 8); });
  $("#gateCard").addEventListener("submit", validatePasskey);
  $$("[data-go]").forEach((b) => b.addEventListener("click", () => navigateToScreen(b.dataset.go)));
  $("#openEnv").addEventListener("click", openEnvelope);
  $("#fullLetter").addEventListener("click", showFullLetter);
  $("#revealBtn").addEventListener("click", revealScratchReward);
  $("#wishBtn").addEventListener("click", makeWish);
  $("#blowBtn").addEventListener("click", blowOutCandles);
  $("#cutBtn").addEventListener("click", cutCake);
  $("#openGift").addEventListener("click", openGiftBox);
  $("#thankBtn").addEventListener("click", thankYou);
  $("#replay").addEventListener("click", restartExperience);
  $("#musicBtn").addEventListener("click", toggleMusic);
  $("#audio").addEventListener("error", musicMissing);
  $("#thanks").addEventListener("error", (e) => {
    e.target.outerHTML = '<svg class="thanks" viewBox="0 0 200 120" role="img" aria-label="A heart with the words thank you"><rect width="200" height="120" rx="14" fill="#F3CECC"/><path d="M100 88C40 52 60 18 100 42c40-24 60 10 0 46z" fill="#C66A76"/><text x="100" y="108" text-anchor="middle" font-family="Caveat,cursive" font-size="20" fill="#813846">thank you</text></svg>';
  });
});
