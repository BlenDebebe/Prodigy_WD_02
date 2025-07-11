let [hours, minutes, seconds, centiseconds] = [0, 0, 0, 0];
let display = document.getElementById("display");
let interval = null;
let running = false;

function updateDisplay() {
  let h = hours < 10 ? "0" + hours : hours;
  let m = minutes < 10 ? "0" + minutes : minutes;
  let s = seconds < 10 ? "0" + seconds : seconds;
  let cs = centiseconds < 10 ? "0" + centiseconds : centiseconds;
  display.innerText = `${h}:${m}:${s}.${cs}`;
}

function startStopwatch() {
  if (!running) {
    interval = setInterval(() => {
      centiseconds++;
      if (centiseconds === 100) {
        centiseconds = 0;
        seconds++;
      }
      if (seconds === 60) {
        seconds = 0;
        minutes++;
      }
      if (minutes === 60) {
        minutes = 0;
        hours++;
      }
      updateDisplay();
    }, 10); // 10ms = 1 centisecond
    running = true;
  }
}

function pauseStopwatch() {
  clearInterval(interval);
  running = false;
}

function resetStopwatch() {
  clearInterval(interval);
  [hours, minutes, seconds, centiseconds] = [0, 0, 0, 0];
  updateDisplay();
  document.getElementById("laps").innerHTML = "";
  running = false;
}

function recordLap() {
  if (running) {
    let lapTime = display.innerText;
    const lapItem = document.createElement("li");
    lapItem.textContent = `Lap: ${lapTime}`;
    document.getElementById("laps").appendChild(lapItem);
  }
}
