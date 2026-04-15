const MARKDOWN_FILE = "henrikslag_v6_mobile.md";
const STORAGE_KEY = "henrikslag-checks-v2";
let parsedEvents = [];

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

  if (!nextEventElement || !countdownElement) {
    return;
  }

  if (!parsedEvents.length) {
    nextEventElement.textContent = "Ingen aktiviteter funnet i planen ennå.";
    countdownElement.textContent = "";
    return;
  }

  const now = new Date();

  const upcoming = parsedEvents
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

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hashText(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function parseEventsFromMarkdown(markdownText) {
  const lines = markdownText.split(/\r?\n/);
  const events = [];
  const yearMatch = markdownText.match(/20\d{2}/);
  const year = yearMatch ? Number(yearMatch[0]) : new Date().getFullYear();
  let currentDate = "";

  lines.forEach((line) => {
    const headingMatch = line.match(/^##\s+(Fredag|Lørdag|Søndag)\s+(\d{1,2})\.\s+april/i);
    if (headingMatch) {
      const day = String(headingMatch[2]).padStart(2, "0");
      currentDate = `${year}-04-${day}`;
      return;
    }

    const timeMatch = line.match(/^-\s*(\d{1,2}):(\d{2})\s+(.+)$/);
    if (timeMatch && currentDate) {
      const hour = String(timeMatch[1]).padStart(2, "0");
      const minute = timeMatch[2];
      const title = timeMatch[3].trim();
      events.push({
        title,
        date: `${currentDate}T${hour}:${minute}:00+02:00`
      });
    }
  });

  return events;
}

function decorateMarkdownContent() {
  const markdownRoot = document.getElementById("markdownContent");
  if (!markdownRoot) {
    return;
  }

  const headingElements = markdownRoot.querySelectorAll("h2, h3");
  headingElements.forEach((heading) => {
    if (!heading.id) {
      heading.id = slugify(heading.textContent || "section");
    }
  });
}

function loadChecks() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const boxes = document.querySelectorAll("#markdownContent input[type='checkbox']");

  boxes.forEach((box, index) => {
    box.removeAttribute("disabled");

    const itemText = box.closest("li")?.textContent?.trim() || `item-${index}`;
    const id = `check-${hashText(itemText)}-${index}`;
    box.dataset.id = id;

    box.checked = id in saved ? Boolean(saved[id]) : box.checked;
    box.addEventListener("change", () => {
      saved[id] = box.checked;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    });

    const parentItem = box.closest("li");
    if (parentItem) {
      parentItem.classList.add("checklist-item");
    }
  });

  const resetButton = document.getElementById("resetBtn");
  if (resetButton) {
    resetButton.hidden = boxes.length === 0;
  }
}

function setupResetButton() {
  const button = document.getElementById("resetBtn");
  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    const boxes = document.querySelectorAll("#markdownContent input[type='checkbox'][data-id]");
    boxes.forEach((box) => {
      box.checked = false;
    });
  });
}

async function renderMarkdown() {
  const markdownRoot = document.getElementById("markdownContent");
  if (!markdownRoot) {
    return;
  }

  try {
    const response = await fetch(MARKDOWN_FILE, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Kunne ikke laste ${MARKDOWN_FILE}`);
    }

    const markdownText = await response.text();
    markdownRoot.innerHTML = marked.parse(markdownText);

    parsedEvents = parseEventsFromMarkdown(markdownText);
    decorateMarkdownContent();
    loadChecks();
    setupResetButton();
    updateNextEvent();
    setInterval(updateNextEvent, 30000);
  } catch (error) {
    markdownRoot.innerHTML = "<p>Kunne ikke laste planen akkurat nå.</p>";
    const nextEventElement = document.getElementById("nextEvent");
    const countdownElement = document.getElementById("countdown");
    if (nextEventElement && countdownElement) {
      nextEventElement.textContent = "Planen er utilgjengelig.";
      countdownElement.textContent = "Sjekk at markdown-filen finnes i repoet.";
    }
  }
}

renderMarkdown();
