const STORAGE_KEY = "henrikslag-checks-v1";

const events = [
  { title: "Møt i Moss", date: "2026-04-17T11:00:00+02:00" },
  { title: "Avreise mot Hønefoss", date: "2026-04-17T12:00:00+02:00" },
  { title: "Oppmøte hos ABC Racing", date: "2026-04-17T14:00:00+02:00" },
  { title: "Grand Prix Super", date: "2026-04-17T14:30:00+02:00" },
  { title: "Pølsegrilling hos ABC Racing", date: "2026-04-17T16:15:00+02:00" },
  { title: "Avreise mot Hafjell", date: "2026-04-17T17:30:00+02:00" },
  { title: "Stor frokost", date: "2026-04-18T09:00:00+02:00" },
  { title: "Olympiske leker", date: "2026-04-18T10:30:00+02:00" },
  { title: "Festmiddag", date: "2026-04-18T17:30:00+02:00" },
  { title: "Ølsmaking", date: "2026-04-18T20:00:00+02:00" },
  { title: "Hjemreise", date: "2026-04-19T12:00:00+02:00" }
];

function formatCountdown(milliseconds) {
  const totalMinutes = Math.max(0, Math.floor(milliseconds / 60000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}t ${minutes}m`;
  }

  return `${hours}t ${minutes}m`;
}

function updateNextEvent() {
  const nextEventElement = document.getElementById("nextEvent");
  const countdownElement = document.getElementById("countdown");
  const now = new Date();

  const upcoming = events
    .map((event) => ({ ...event, eventDate: new Date(event.date) }))
    .find((event) => event.eventDate > now);

  if (!upcoming) {
    nextEventElement.textContent = "Helga er i gang eller gjennomført. God tur!";
    countdownElement.textContent = "";
    return;
  }

  nextEventElement.textContent = `Neste aktivitet: ${upcoming.title}`;
  countdownElement.textContent = `Starter om ${formatCountdown(upcoming.eventDate - now)}`;
}

function loadChecks() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const boxes = document.querySelectorAll("input[type='checkbox'][data-id]");

  boxes.forEach((box) => {
    box.checked = Boolean(saved[box.dataset.id]);
    box.addEventListener("change", () => {
      saved[box.dataset.id] = box.checked;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    });
  });
}

function setupResetButton() {
  const button = document.getElementById("resetBtn");
  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    const boxes = document.querySelectorAll("input[type='checkbox'][data-id]");
    boxes.forEach((box) => {
      box.checked = false;
    });
  });
}

updateNextEvent();
setInterval(updateNextEvent, 30000);
loadChecks();
setupResetButton();