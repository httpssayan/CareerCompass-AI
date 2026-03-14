/* Career Compass AI – frontend logic (API unchanged) */

const CHART_LABEL_COLOR = "#9ca3af";
const CHART_GRID_COLOR = "rgba(255,255,255,0.05)";
const CHART_BAR_COLOR = "#22c55e";
const CHART_RADAR_FILL = "rgba(56, 189, 248, 0.25)";
const CHART_RADAR_BORDER = "#38bdf8";

/* ---------- API: send message and display results ---------- */
async function sendMessage() {
  const text = document.getElementById("userInput").value;

  if (text === "") {
    alert("Please enter your skills");
    return;
  }

  document.getElementById("career").innerText = "Analyzing...";
  document.getElementById("career").classList.remove("card__career-name--ready");

  const response = await fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await response.json();
  displayResults(data);
}

/* ---------- Display results (same data shape, new UI) ---------- */
function displayResults(data) {
  renderDetectedSkills(data.detected_skills);
  renderRecommendedCareer(data.recommended_career);
  renderTopCareers(data.top_careers);
  renderMissingSkills(data.missing_skills);
  renderRoadmap(data.roadmap);
  renderResources(data.resources);
  createCareerChart(data.top_careers);
  createSkillRadar(data.expanded_skills);

  runResultAnimations();
}

function renderDetectedSkills(skills) {
  const container = document.getElementById("skills");
  container.innerHTML = "";

  (skills || []).forEach((skill) => {
    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = formatSkillLabel(skill);
    container.appendChild(pill);
  });
}

function renderRecommendedCareer(careerName) {
  const el = document.getElementById("career");
  const text =
    (careerName || "")
      .split(" ")
      .map((w) => (w.toUpperCase() === "NLP" ? "NLP" : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(" ") || "—";
  el.innerText = text;
  el.classList.add("card__career-name--ready");
}

function renderTopCareers(topCareers) {
  const container = document.getElementById("topCareers");
  container.innerHTML = "";

  (topCareers || []).forEach((item) => {
    const careerName = item[0];
    const score = item[1];
    const div = document.createElement("div");
    div.className = "progress-item";
    div.innerHTML = `
      <div class="progress-item__label">
        <span>${formatCareerLabel(careerName)}</span>
        <span>${score}%</span>
      </div>
      <div class="progress-item__bar-wrap">
        <div class="progress-item__bar" data-score="${score}" style="width: 0%"></div>
      </div>
    `;
    container.appendChild(div);
  });

  /* Animate bars filling on load (after a short delay) */
  setTimeout(() => {
    container.querySelectorAll(".progress-item__bar").forEach((bar) => {
      const score = parseInt(bar.getAttribute("data-score"), 10);
      bar.style.width = score + "%";
    });
  }, 350);
}

function renderMissingSkills(skills) {
  const container = document.getElementById("missing");
  container.innerHTML = "";

  (skills || []).forEach((skill) => {
    const pill = document.createElement("span");
    pill.className = "pill pill--missing";
    pill.textContent = formatSkillLabel(skill);
    container.appendChild(pill);
  });
}

function renderRoadmap(steps) {
  const list = document.getElementById("roadmap");
  list.innerHTML = "";

  (steps || []).forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    list.appendChild(li);
  });
}

function renderResources(resources) {
  const container = document.getElementById("resources");
  container.innerHTML = "";

  if (!resources || typeof resources !== "object") return;

  for (const skill in resources) {
    const group = document.createElement("div");
    group.className = "resource-group";
    const title = document.createElement("h4");
    title.className = "resource-group__skill";
    title.textContent = formatSkillLabel(skill);
    const ul = document.createElement("ul");
    ul.className = "resource-group__list";
    (resources[skill] || []).forEach((r) => {
      const li = document.createElement("li");
      li.textContent = r;
      ul.appendChild(li);
    });
    group.appendChild(title);
    group.appendChild(ul);
    container.appendChild(group);
  }
}

function formatSkillLabel(s) {
  if (!s || typeof s !== "string") return "";
  return s
    .trim()
    .split(" ")
    .map((w) => (w.toUpperCase() === "NLP" ? "NLP" : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ");
}

function formatCareerLabel(s) {
  if (!s || typeof s !== "string") return "";
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ---------- Animations (Anime.js) ---------- */
function runResultAnimations() {
  const cards = document.querySelectorAll(".dashboard [data-card]");
  const pills = document.querySelectorAll(".card__pills .pill, .card--missing .pill");
  const careerEl = document.getElementById("career");
  const chartWraps = document.querySelectorAll(".card__chart-wrap");

  cards.forEach((c) => {
    c.style.opacity = "0";
    c.style.transform = "translateY(40px)";
  });
  chartWraps.forEach((w) => { w.style.opacity = "0"; });

  /* Cards slide in from bottom, 700ms, stagger */
  anime({
    targets: ".dashboard [data-card]",
    translateY: [40, 0],
    opacity: [0, 1],
    duration: 700,
    easing: "easeOutCubic",
    delay: anime.stagger(90)
  });

  /* Skill tags pop in */
  if (pills.length) {
    anime({
      targets: pills,
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 450,
      delay: anime.stagger(45, { start: 400 }),
      easing: "easeOutElastic(1, 0.6)"
    });
  }

  /* Recommended career text glow */
  if (careerEl && careerEl.innerText && careerEl.innerText !== "Analyzing...") {
    careerEl.style.opacity = "0";
    careerEl.style.transform = "scale(0.9)";
    anime({
      targets: careerEl,
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 550,
      delay: 350,
      easing: "easeOutCubic"
    });
  }

  /* Charts fade in */
  anime({
    targets: ".card__chart-wrap",
    opacity: [0, 1],
    duration: 700,
    delay: 600,
    easing: "easeOutCubic"
  });
}

function runPageLoadAnimation() {
  const wrapper = document.querySelector(".page-wrapper");
  if (!wrapper) return;
  wrapper.style.opacity = "0";
  anime({
    targets: wrapper,
    opacity: [0, 1],
    duration: 700,
    easing: "easeOutCubic"
  });
}

/* ---------- Charts (Chart.js) – same logic, dark theme ---------- */
let careerChart;

function createCareerChart(careers) {
  const labels = (careers || []).map((c) => formatCareerLabel(c[0]));
  const scores = (careers || []).map((c) => c[1]);
  const ctx = document.getElementById("careerChart");

  if (careerChart) careerChart.destroy();

  careerChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Match %",
          data: scores,
          backgroundColor: CHART_BAR_COLOR
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: CHART_GRID_COLOR },
          ticks: { color: CHART_LABEL_COLOR }
        },
        x: {
          grid: { display: false },
          ticks: { color: CHART_LABEL_COLOR }
        }
      }
    }
  });
}

let radarChart;

function createSkillRadar(skills) {
  const labels = (skills || []).slice(0, 6).map((s) => formatSkillLabel(s));
  const values = labels.map(() => Math.floor(Math.random() * 40) + 60);
  const ctx = document.getElementById("skillRadar");

  if (radarChart) radarChart.destroy();

  radarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels,
      datasets: [
        {
          label: "Skill Strength",
          data: values,
          backgroundColor: CHART_RADAR_FILL,
          borderColor: CHART_RADAR_BORDER,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          grid: { color: CHART_GRID_COLOR },
          pointLabels: { color: CHART_LABEL_COLOR },
          ticks: { color: CHART_LABEL_COLOR }
        }
      }
    }
  });
}

/* ---------- Init: page load animation ---------- */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runPageLoadAnimation);
} else {
  runPageLoadAnimation();
}
