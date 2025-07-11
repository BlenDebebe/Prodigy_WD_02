let startTime = 0;
let elapsed = 0;
let timerInterval = null;
let running = false;

const display = document.getElementById("display");
const laps = document.getElementById("laps");
const startPauseBtn = document.getElementById("start-pause-btn");
const resetBtn = document.getElementById("reset-btn");
const lapBtn = document.getElementById("lap-btn");
const exportBtn = document.getElementById("export-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const body = document.body;

function formatTime(ms) {
  let milliseconds = ms % 1000;
  let totalSeconds = Math.floor(ms / 1000);
  let seconds = totalSeconds % 60;
  let minutes = Math.floor(totalSeconds / 60) % 60;
  let hours = Math.floor(totalSeconds / 3600);

  return (
    String(hours).padStart(2, '0') + ":" +
    String(minutes).padStart(2, '0') + ":" +
    String(seconds).padStart(2, '0') + "." +
    String(milliseconds).padStart(3, '0')
  );
}

function updateDisplay() {
  const now = Date.now();
  const time = elapsed + (running ? now - startTime : 0);
  display.textContent = formatTime(time);
}

function start() {
  if (running) return;
  startTime = Date.now();
  timerInterval = setInterval(updateDisplay, 10);
  running = true;
  updateButtons();
}

function pause() {
  if (!running) return;
  elapsed += Date.now() - startTime;
  clearInterval(timerInterval);
  running = false;
  updateButtons();
}

function reset() {
  clearInterval(timerInterval);
  startTime = 0;
  elapsed = 0;
  running = false;
  updateDisplay();
  laps.innerHTML = '';
  updateButtons();
  saveState();
}

function recordLap() {
  if (!running) return;
  const now = Date.now();
  const lapTime = formatTime(elapsed + (now - startTime));
  const li = document.createElement("li");
  li.textContent = `Lap: ${lapTime}`;
  laps.appendChild(li);
  saveState();
}

function exportLaps() {
  if (!laps.children.length) return alert("No laps to export.");
  let csv = "Lap Number,Time\n";
  Array.from(laps.children).forEach((li, i) => {
    csv += `${i + 1},${li.textContent.replace("Lap: ", "")}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "laps.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function updateButtons() {
  startPauseBtn.textContent = running ? "Pause" : "Start";
  lapBtn.disabled = !running;
}

function saveState() {
  const lapTexts = Array.from(laps.children).map(li => li.textContent);
  const state = {
    elapsed: elapsed,
    laps: lapTexts
  };
  localStorage.setItem("stopwatchState", JSON.stringify(state));
}

function loadState() {
  const state = JSON.parse(localStorage.getItem("stopwatchState") || "{}");
  elapsed = state.elapsed || 0;
  if (state.laps && Array.isArray(state.laps)) {
    laps.innerHTML = "";
    state.laps.forEach(text => {
      const li = document.createElement("li");
      li.textContent = text;
      laps.appendChild(li);
    });
  }
  updateDisplay();
  updateButtons();
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const useLight = saved ? saved === 'light' : prefersLight;

  body.classList.toggle("light-theme", useLight);
  themeToggleBtn.textContent = useLight ? "Switch to Dark Theme" : "Switch to Light Theme";
}

themeToggleBtn.addEventListener("click", () => {
  body.classList.toggle("light-theme");
  const isLight = body.classList.contains("light-theme");
  themeToggleBtn.textContent = isLight ? "Switch to Dark Theme" : "Switch to Light Theme";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

startPauseBtn.addEventListener("click", () => running ? pause() : start());
resetBtn.addEventListener("click", reset);
lapBtn.addEventListener("click", recordLap);
exportBtn.addEventListener("click", exportLaps);

document.addEventListener("keydown", e => {
  if (e.target.tagName === "INPUT") return;
  if (e.key === " ") { e.preventDefault(); running ? pause() : start(); }
  if (e.key === "r" || e.key === "R") reset();
  if (e.key === "l" || e.key === "L") recordLap();
});

initTheme();
loadState();
