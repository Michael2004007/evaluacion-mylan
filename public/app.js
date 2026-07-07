const stores = {
  SDG01: { name: "SDG01", city: "Salto del Guairá", displayCity: "Salto del Guairá", bilingual: true },
  SDG02: { name: "SDG02", city: "Salto del Guairá", displayCity: "Salto del Guairá", bilingual: true },
  "CDE-PARIS": { name: "CDE-PARIS", city: "Ciudad del Este", displayCity: "Ciudad del Este", bilingual: true },
  "CDE-JEBAI": { name: "CDE-JEBAI", city: "Ciudad del Este", displayCity: "Ciudad del Este", bilingual: true },
  "CDE-CENTRO": { name: "CDE-CENTRO", city: "Ciudad del Este", displayCity: "Ciudad del Este", bilingual: true },
  ENCARNACION: { name: "ENCARNACION", city: "Encarnación", displayCity: "Encarnación", bilingual: false },
  "PJC-DUBAI": { name: "PJC-DUBAI", city: "Pedro Juan Caballero", displayCity: "Pedro Juan Caballero", bilingual: true },
  "ASU-PINEDO": { name: "ASU-PINEDO", city: "Asunción", displayCity: "Asunción", bilingual: false },
  "ASU-MULTIPLAZA": { name: "ASU-MULTIPLAZA", city: "Asunción", displayCity: "Asunción", bilingual: false },
  "ASU-MARIANO-GONDOLA": { name: "ASU-MARIANO-GONDOLA", label: "ASU - MARIANO GONDOLA", city: "Asunción", displayCity: "Asunción", bilingual: false },
  "ASU-MARIANO-TIENDA": { name: "ASU-MARIANO-TIENDA", city: "Asunción", displayCity: "Asunción", bilingual: false },
  "ASU-PLAZA-NORTE": { name: "ASU-PLAZA-NORTE", city: "Asunción", displayCity: "Asunción", bilingual: false },
  "ASU-SAN-LORENZO": { name: "ASU-SAN-LORENZO", city: "Asunción", displayCity: "Asunción", bilingual: false },
};

const copy = {
  es: {
    chooseTitle: "Seleccioná tu idioma",
    chooseSubtitle: "Seleccione su idioma para continuar",
    info: "Al continuar, serás direccionado a la evaluación.",
    question: "¿Qué te pareció la atención?",
    subQuestion: "Tu opinión es muy importante para nosotros",
    good: "Bueno",
    neutral: "Neutro",
    bad: "Malo",
    suggestion: "¿Tenés alguna sugerencia?",
    placeholder: "Escribí tu sugerencia aquí...",
    phoneHelp: "Ingresá tu número de teléfono para recibir descuentos y novedades.",
    phone: "Número de celular",
    phonePlaceholder: "+595 986444084",
    submit: "Enviar evaluación",
    thanks: "¡Gracias por ayudarnos a mejorar tu experiencia!",
    error: "Seleccioná una evaluación para continuar.",
  },
  pt: {
    chooseTitle: "Escolha seu idioma",
    chooseSubtitle: "Selecione seu idioma para continuar",
    info: "Ao continuar, você será direcionado para a avaliação.",
    question: "O que voce achou do atendimento?",
    subQuestion: "Sua opinião é muito importante para nós",
    good: "Bom",
    neutral: "Neutro",
    bad: "Ruim",
    suggestion: "Tem alguma sugestão?",
    placeholder: "Escreva sua sugestão aqui...",
    phoneHelp: "Informe seu número de telefone para receber descontos e novidades.",
    phone: "Número de celular",
    phonePlaceholder: "+55 11 98765-4321",
    submit: "Enviar avaliação",
    thanks: "Obrigado por nos ajudar a melhorar sua experiência!",
    error: "Selecione uma avaliação para continuar.",
  },
};

const cityOrder = ["Salto del Guairá", "Ciudad del Este", "Encarnación", "Pedro Juan Caballero", "Asunción"];
const ratingScore = { good: 5, neutral: 3, bad: 1 };
const ratingEmoji = { good: "😊", neutral: "🤔", bad: "😞" };
let evaluationsCache = [];
let activeDashboardView = "dashboard";

function storeTitle(store) {
  return store.label || store.name;
}

function normalizeStoreCode(code) {
  const normalized = decodeURIComponent(code || "")
    .trim()
    .toUpperCase()
    .replace(/\s*-\s*/g, "-")
    .replace(/\s+/g, "-");
  const aliases = {
    "ASU-MARIANO-GÓNDOLA": "ASU-MARIANO-GONDOLA",
    "ASU-MARIANO-GONDOLA": "ASU-MARIANO-GONDOLA",
  };
  return aliases[normalized] || normalized;
}

function app() {
  const path = window.location.pathname;
  if (path.startsWith("/avaliar/")) {
    const storeCode = normalizeStoreCode(path.split("/").pop());
    renderEvaluation(storeCode);
    return;
  }
  renderDashboard();
}

function renderEvaluation(storeCode) {
  const store = stores[storeCode];
  if (!store) {
    document.getElementById("app").innerHTML = mobileShell(`
      <div class="thanks-card">
        <div>
          <div class="thanks-icon">!</div>
          <h1 class="title">Tienda no encontrada</h1>
          <p class="subtitle">Verifica el link del QR.</p>
        </div>
      </div>
    `);
    return;
  }

  if (store.bilingual) {
    renderLanguage(store);
  } else {
    renderForm(store, "es");
  }
}

function mobileShell(content) {
  return `
    <main class="phone-shell">
      <section class="phone-frame">
        <div class="browser-bar">
          <div class="url-pill">🔒 evaluacion.com.br</div>
        </div>
        <div class="mobile-screen">
          <div class="mobile-content">${content}</div>
        </div>
      </section>
    </main>
  `;
}

function renderLanguage(store) {
  document.getElementById("app").innerHTML = mobileShell(`
    <h1 class="title">${copy.pt.chooseTitle}</h1>
    <p class="subtitle">${copy.pt.chooseSubtitle}</p>
    <div class="ornament"><span></span></div>
    <div class="language-list">
      <button class="language-card" data-lang="es">
        <span class="flag flag-py" aria-hidden="true"><span></span></span>
        <span><strong class="language-name">Español</strong><span class="language-country">Paraguay</span></span>
        <span class="arrow">›</span>
      </button>
      <button class="language-card" data-lang="pt">
        <span class="flag flag-br" aria-hidden="true"><span></span></span>
        <span><strong class="language-name">Português</strong><span class="language-country">Brasil</span></span>
        <span class="arrow">›</span>
      </button>
    </div>
    <div class="info-note">
      <div class="info-icon">i</div>
      ${copy.pt.info}
    </div>
  `);

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => renderForm(store, button.dataset.lang));
  });
}

function renderForm(store, language) {
  const t = copy[language];
  document.getElementById("app").innerHTML = mobileShell(`
    <div class="store-chip"><span class="mini-flag ${language === "pt" ? "flag-br" : "flag-py"}"><span></span></span>${storeTitle(store)} · ${store.displayCity}</div>
    <h1 class="title">${t.question}</h1>
    <p class="subtitle">${t.subQuestion}</p>
    <div class="ornament"><span></span></div>
    <form id="evaluationForm">
      <div class="rating-grid" role="radiogroup" aria-label="${t.question}">
        ${ratingButton("good", t.good)}
        ${ratingButton("neutral", t.neutral)}
        ${ratingButton("bad", t.bad)}
      </div>
      <input type="hidden" id="rating" name="rating">
      <div class="field">
        <label for="suggestion">${t.suggestion}</label>
        <textarea id="suggestion" name="suggestion" placeholder="${t.placeholder}"></textarea>
      </div>
      <div class="phone-helper">
        <div class="phone-helper-icon">📱</div>
        <div>${t.phoneHelp}</div>
      </div>
      <div class="field">
        <label for="phone">${t.phone}</label>
        <input id="phone" name="phone" inputmode="tel" placeholder="${t.phonePlaceholder}">
      </div>
      <button class="submit-btn" type="submit">${t.submit} ✈</button>
    </form>
  `);

  document.querySelectorAll(".rating-card").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".rating-card").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      document.getElementById("rating").value = button.dataset.rating;
    });
  });

  document.getElementById("evaluationForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const rating = document.getElementById("rating").value;
    if (!rating) {
      alert(t.error);
      return;
    }

    const payload = {
      store: store.name,
      language,
      rating,
      suggestion: document.getElementById("suggestion").value.trim(),
      phone: document.getElementById("phone").value.trim(),
    };

    await saveEvaluation(payload);
    renderThanks(language);
  });
}

function ratingButton(type, label) {
  return `
    <button type="button" class="rating-card ${type}" data-rating="${type}">
      <span class="emoji">${ratingEmoji[type]}</span>
      <span class="rating-label">${label}</span>
    </button>
  `;
}

function renderThanks(language) {
  document.getElementById("app").innerHTML = mobileShell(`
    <div class="thanks-card">
      <div>
        <div class="thanks-icon">✓</div>
        <h1 class="title">${copy[language].thanks}</h1>
      </div>
    </div>
  `);
}

async function saveEvaluation(payload) {
  try {
    const response = await fetch("/api/evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) return;
  } catch {
    // Static-file fallback.
  }

  const local = JSON.parse(localStorage.getItem("evaluations") || "[]");
  const store = stores[payload.store];
  local.unshift({
    id: `${Date.now()}-${Math.random()}`,
    store: payload.store,
    city: store.city,
    language: payload.language,
    rating: payload.rating,
    suggestion: payload.suggestion,
    phone: payload.phone,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem("evaluations", JSON.stringify(local));
}

async function loadEvaluations() {
  try {
    const response = await fetch("/api/evaluations");
    if (response.ok) return await response.json();
  } catch {
    // Static-file fallback.
  }
  return JSON.parse(localStorage.getItem("evaluations") || "[]");
}

async function renderDashboard() {
  document.getElementById("app").innerHTML = `
    <main class="dashboard">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">A</div>
          <div>
            <span class="brand-title">AVALIACAO</span>
            <span class="brand-subtitle">EXPERIENCIA QUE CONECTA</span>
          </div>
        </div>
        <nav class="nav">
          ${navButton("▣", "Dashboard", "dashboard", true)}
          ${navButton("☑", "Evaluaciones", "evaluations")}
          ${navButton("◈", "Ciudades", "cities")}
          ${navButton("▤", "Tiendas", "stores")}
          ${navButton("▥", "Reportes", "reports")}
          ${navButton("⚙", "Configuración", "settings")}
        </nav>
        <div class="side-card">
          <strong>¿Necesitas ayuda?</strong>
          <p>Nuestro equipo está listo para ayudarte.</p>
          <button class="outline-btn">Contactar soporte ↗</button>
        </div>
      </aside>
      <section class="main">
        <div class="topbar">
          <div>
            <h1>Dashboard de Evaluación de Atendimento</h1>
            <p>Monitoreo en tiempo real de la experiencia del cliente.</p>
          </div>
          <div class="actions">
            <input class="search" id="search" placeholder="Buscar...">
            <button class="outline-btn" id="exportBtn">⇩ Exportar PDF</button>
          </div>
        </div>
        <section class="filters">
          ${filterSelect("cityFilter", "Ciudad", ["Todas las ciudades"].concat(cityOrder))}
          ${filterSelect("storeFilter", "Tienda", ["Todas las tiendas"].concat(Object.values(stores).map(storeTitle)))}
          ${filterSelect("periodFilter", "Periodo", ["Todo", "Últimos 7 días", "Últimos 30 días", "Este mes"])}
          ${filterSelect("langFilter", "Idioma", ["ES / PT", "ES", "PT"])}
          ${filterSelect("ratingFilter", "Evaluación", ["Todas", "Bueno / Bom", "Neutro", "Malo / Ruim"])}
        </section>
        <div id="dashboardContent"></div>
      </section>
    </main>
    <div class="modal" id="storeModal" hidden></div>
  `;

  evaluationsCache = await loadEvaluations();
  if (!evaluationsCache.length) {
    evaluationsCache = demoEvaluations();
  }

  ["cityFilter", "storeFilter", "periodFilter", "langFilter", "ratingFilter", "search"].forEach((id) => {
    document.getElementById(id).addEventListener("input", updateDashboard);
  });
  document.querySelectorAll(".nav button").forEach((button) => {
    button.addEventListener("click", () => {
      activeDashboardView = button.dataset.view;
      document.querySelectorAll(".nav button").forEach((item) => item.classList.toggle("active", item === button));
      updateDashboard();
    });
  });
  document.querySelector(".side-card .outline-btn").addEventListener("click", () => openSupportModal());
  document.getElementById("exportBtn").addEventListener("click", exportPdf);
  updateDashboard();
}

function navButton(icon, label, view, active = false) {
  return `<button class="${active ? "active" : ""}" data-view="${view}" type="button"><span>${icon}</span>${label}</button>`;
}

function filterSelect(id, label, options) {
  return `
    <label>
      <span>${label}</span>
      <select id="${id}">
        ${options.map((option) => `<option>${option}</option>`).join("")}
      </select>
    </label>
  `;
}

function getFilters() {
  return {
    city: document.getElementById("cityFilter").value,
    store: document.getElementById("storeFilter").value,
    period: document.getElementById("periodFilter").value,
    lang: document.getElementById("langFilter").value,
    rating: document.getElementById("ratingFilter").value,
    search: document.getElementById("search").value.trim().toLowerCase(),
  };
}

function applyFilters(rows) {
  const filters = getFilters();
  const now = new Date();
  return rows.filter((row) => {
    if (filters.city !== "Todas las ciudades" && row.city !== filters.city) return false;
    if (filters.store !== "Todas las tiendas" && storeTitle(stores[row.store] || { name: row.store }) !== filters.store) return false;
    if (filters.lang !== "ES / PT" && row.language !== filters.lang.toLowerCase()) return false;
    if (filters.rating === "Bueno / Bom" && row.rating !== "good") return false;
    if (filters.rating === "Neutro" && row.rating !== "neutral") return false;
    if (filters.rating === "Malo / Ruim" && row.rating !== "bad") return false;
    if (filters.period !== "Todo") {
      const created = new Date(row.createdAt);
      const days = (now - created) / 86400000;
      if (filters.period === "Últimos 7 días" && days > 7) return false;
      if (filters.period === "Últimos 30 días" && days > 30) return false;
      if (filters.period === "Este mes" && (created.getMonth() !== now.getMonth() || created.getFullYear() !== now.getFullYear())) return false;
    }
    if (filters.search) {
      const haystack = `${row.city} ${row.store} ${row.suggestion} ${row.phone}`.toLowerCase();
      if (!haystack.includes(filters.search)) return false;
    }
    return true;
  });
}

function updateDashboard() {
  const rows = applyFilters(evaluationsCache);
  const stats = getStats(rows);
  const content = {
    dashboard: dashboardView(rows, stats),
    evaluations: evaluationsView(rows, stats),
    cities: citiesView(rows),
    stores: storesView(rows),
    reports: reportsView(rows, stats),
    settings: settingsView(),
  }[activeDashboardView] || dashboardView(rows, stats);

  document.getElementById("dashboardContent").innerHTML = content;

  document.querySelectorAll("[data-detail-store]").forEach((button) => {
    button.addEventListener("click", () => openStoreDetail(button.dataset.detailStore));
  });
  document.querySelectorAll("[data-view-action]").forEach((button) => {
    button.addEventListener("click", () => {
      activeDashboardView = button.dataset.viewAction;
      document.querySelectorAll(".nav button").forEach((item) => {
        item.classList.toggle("active", item.dataset.view === activeDashboardView);
      });
      updateDashboard();
    });
  });
  document.querySelectorAll("[data-copy-link]").forEach((button) => {
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(button.dataset.copyLink);
      button.textContent = "Copiado";
      setTimeout(() => button.textContent = "Copiar link", 1200);
    });
  });
  const reportPdf = document.getElementById("reportPdfBtn");
  if (reportPdf) reportPdf.addEventListener("click", () => exportPdf(applyFilters(evaluationsCache), "Reporte con filtros activos", "filtros", reportPdf));
  const reportCsv = document.getElementById("reportCsvBtn");
  if (reportCsv) reportCsv.addEventListener("click", () => exportCsv(applyFilters(evaluationsCache), "evaluaciones-filtradas.csv", reportCsv));
  const allPdf = document.getElementById("allPdfBtn");
  if (allPdf) allPdf.addEventListener("click", () => exportPdf(evaluationsCache, "Reporte completo de todas las evaluaciones", "todas", allPdf));
  const allCsv = document.getElementById("allCsvBtn");
  if (allCsv) allCsv.addEventListener("click", () => exportCsv(evaluationsCache, "evaluaciones-todas.csv", allCsv));
  const cityPdf = document.getElementById("cityPdfBtn");
  if (cityPdf) cityPdf.addEventListener("click", () => exportCityReport("pdf", cityPdf));
  const cityCsv = document.getElementById("cityCsvBtn");
  if (cityCsv) cityCsv.addEventListener("click", () => exportCityReport("csv", cityCsv));
}

function dashboardView(rows, stats) {
  return `
    <section class="kpis">
      ${kpi("▣", "Total evaluaciones", stats.total, "↗ Datos filtrados")}
      ${kpi("😊", "Bom / Bueno", stats.good, `${stats.goodPct}% del total`)}
      ${kpi("🤔", "Neutro", stats.neutral, `${stats.neutralPct}% del total`, "yellow")}
      ${kpi("😞", "Ruim / Malo", stats.bad, `${stats.badPct}% del total`, "red")}
      ${kpi("☆", "Satisfaccion general", `${stats.score} / 5`, "Promedio ponderado")}
    </section>
    <section class="analytics">
      ${cityBars(rows)}
      ${donutPanel(stats)}
      ${trendPanel(rows)}
      ${rankingPanel(rows)}
    </section>
    ${citySections(rows)}
    ${recentTable(rows)}
  `;
}

function evaluationsView(rows, stats) {
  return `
    <section class="kpis">
      ${kpi("☑", "Evaluaciones filtradas", stats.total, "Tabla completa")}
      ${kpi("😊", "Positivas", stats.good, `${stats.goodPct}% del total`)}
      ${kpi("🤔", "Neutras", stats.neutral, `${stats.neutralPct}% del total`, "yellow")}
      ${kpi("😞", "Negativas", stats.bad, `${stats.badPct}% del total`, "red")}
      ${kpi("☆", "Promedio", `${stats.score} / 5`, "Satisfacción")}
    </section>
    ${recentTable(rows, "Todas las evaluaciones", 60)}
  `;
}

function citiesView(rows) {
  return `
    <section class="analytics city-analytics">
      ${cityBars(rows)}
      ${donutPanel(getStats(rows))}
    </section>
    ${cityOrder.map((city) => {
      const cityRows = rows.filter((row) => row.city === city);
      const stats = getStats(cityRows);
      return `
        <article class="panel city-summary">
          <div>
            <h2>${city}</h2>
            <p>${stats.total} evaluaciones · ${stats.score} / 5 satisfacción</p>
          </div>
          <div class="summary-metrics">
            <strong>${stats.goodPct}% Bueno</strong>
            <strong>${stats.neutralPct}% Neutro</strong>
            <strong>${stats.badPct}% Malo</strong>
          </div>
        </article>
      `;
    }).join("")}
  `;
}

function storesView(rows) {
  return citySections(rows);
}

function reportsView(rows, stats) {
  const best = bestStore(rows);
  const worst = worstStore(rows);
  return `
    <section class="report-hero">
      <div>
        <span>Reporte ejecutivo</span>
        <h2>Experiencia de atención por tienda</h2>
        <p>Exportá un PDF premium con los mismos filtros activos del dashboard, métricas, ranking, distribución y últimas respuestas.</p>
      </div>
      <div class="report-actions">
        <button class="submit-btn compact" id="reportPdfBtn" type="button">PDF con filtros actuales</button>
        <button class="outline-btn" id="reportCsvBtn" type="button">CSV con filtros actuales</button>
      </div>
    </section>
    <section class="report-downloads">
      <article class="panel report-download-card">
        <div>
          <h2>Todas las evaluaciones</h2>
          <p>Descarga completa con todas las ciudades, tiendas, celulares, sugerencias, idioma, fecha y hora.</p>
        </div>
        <div class="report-actions inline">
          <button class="submit-btn compact" id="allPdfBtn" type="button">PDF completo</button>
          <button class="outline-btn" id="allCsvBtn" type="button">CSV completo</button>
        </div>
      </article>
      <article class="panel report-download-card">
        <div>
          <h2>Evaluaciones por ciudad</h2>
          <p>Elegí una ciudad y descargá todas sus respuestas completas, no solo las recientes.</p>
          <select id="reportCitySelect">
            ${cityOrder.map((city) => `<option>${city}</option>`).join("")}
          </select>
        </div>
        <div class="report-actions inline">
          <button class="submit-btn compact" id="cityPdfBtn" type="button">PDF por ciudad</button>
          <button class="outline-btn" id="cityCsvBtn" type="button">CSV por ciudad</button>
        </div>
      </article>
    </section>
    <section class="kpis">
      ${kpi("▣", "Total incluido", stats.total, "Según filtros")}
      ${kpi("☆", "Satisfacción", `${stats.score} / 5`, "Promedio")}
      ${kpi("😊", "Mejor tienda", best.name, best.note)}
      ${kpi("😞", "Más negativas", worst.name, worst.note, "red")}
      ${kpi("▥", "Formato", "PDF", "Visual ejecutivo")}
    </section>
    ${recentTable(rows, "Vista previa de datos incluidos por filtros", 12)}
  `;
}

function settingsView() {
  const origin = window.location.origin;
  return `
    <article class="panel">
      <div class="panel-head">
        <h2>Links QR por tienda</h2>
        <strong>${Object.keys(stores).length} sucursales</strong>
      </div>
      <div class="qr-grid">
        ${Object.values(stores).map((store) => {
          const link = `${origin}/avaliar/${store.name}`;
          return `
            <div class="qr-row">
              <div>
                <strong>${storeTitle(store)}</strong>
                <span>${store.displayCity} · ${store.bilingual ? "ES / PT" : "ES"}</span>
              </div>
              <button class="outline-btn" data-copy-link="${link}" type="button">Copiar link</button>
            </div>
          `;
        }).join("")}
      </div>
    </article>
  `;
}

function getStats(rows) {
  const total = rows.length;
  const good = rows.filter((row) => row.rating === "good").length;
  const neutral = rows.filter((row) => row.rating === "neutral").length;
  const bad = rows.filter((row) => row.rating === "bad").length;
  const avg = total ? rows.reduce((sum, row) => sum + ratingScore[row.rating], 0) / total : 0;
  return {
    total,
    good,
    neutral,
    bad,
    goodPct: pct(good, total),
    neutralPct: pct(neutral, total),
    badPct: pct(bad, total),
    score: avg.toFixed(2).replace(".", ","),
  };
}

function pct(value, total) {
  return total ? Math.round((value / total) * 1000) / 10 : 0;
}

function kpi(icon, label, value, note, color = "") {
  return `
    <article class="kpi-card ${color}">
      <div class="kpi-icon">${icon}</div>
      <div>
        <div class="kpi-label">${label}</div>
        <div class="kpi-value">${value}</div>
        <div class="kpi-note">${note}</div>
      </div>
    </article>
  `;
}

function cityBars(rows) {
  const counts = cityOrder.map((city) => ({ city, count: rows.filter((row) => row.city === city).length }));
  const max = Math.max(1, ...counts.map((item) => item.count));
  return `
    <article class="panel">
      <div class="panel-head"><h2>Evaluaciones por ciudad</h2><strong>Total</strong></div>
      <div class="bars">
        ${counts.map((item) => `
          <div class="bar-wrap">
            <div class="bar-value">${item.count}</div>
            <div class="bar" style="height:${Math.max(8, (item.count / max) * 132)}px"></div>
            <div class="bar-label">${item.city}</div>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function donutPanel(stats) {
  return `
    <article class="panel">
      <div class="panel-head"><h2>Distribución de respuestas</h2></div>
      <div class="donut-row">
        <div class="donut" style="background: conic-gradient(var(--green-700) 0 ${stats.goodPct}%, var(--yellow) ${stats.goodPct}% ${stats.goodPct + stats.neutralPct}%, var(--red) ${stats.goodPct + stats.neutralPct}% 100%)">
          <div class="donut-inner">${stats.total}<br><small>Total</small></div>
        </div>
        <div class="legend">
          <div><span class="dot" style="background:var(--green-700)"></span>Bom / Bueno ${stats.good} (${stats.goodPct}%)</div>
          <div><span class="dot" style="background:var(--yellow)"></span>Neutro ${stats.neutral} (${stats.neutralPct}%)</div>
          <div><span class="dot" style="background:var(--red)"></span>Ruim / Malo ${stats.bad} (${stats.badPct}%)</div>
        </div>
      </div>
    </article>
  `;
}

function trendPanel(rows) {
  const days = [...Array(7)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return date;
  });
  const values = days.map((day) => rows.filter((row) => sameDay(new Date(row.createdAt), day)).length);
  const max = Math.max(1, ...values);
  const points = values.map((value, index) => `${18 + index * 52},${138 - (value / max) * 100}`).join(" ");
  return `
    <article class="panel">
      <div class="panel-head"><h2>Tendencia semanal</h2><strong>7 días</strong></div>
      <svg class="line-chart" viewBox="0 0 340 160" role="img" aria-label="Tendencia semanal">
        <defs>
          <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
            <stop stop-color="#2f7d38" stop-opacity="0.22"/>
            <stop offset="1" stop-color="#2f7d38" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polyline fill="none" stroke="#2f7d38" stroke-width="3" points="${points}"/>
        <polygon fill="url(#area)" points="${points} 330,150 18,150"/>
        ${values.map((value, index) => `<circle cx="${18 + index * 52}" cy="${138 - (value / max) * 100}" r="4" fill="#fff" stroke="#2f7d38" stroke-width="3"/><text x="${18 + index * 52}" y="154" text-anchor="middle" font-size="10">${value}</text>`).join("")}
      </svg>
    </article>
  `;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function rankingPanel(rows) {
  const storeStats = Object.keys(stores).map((store) => {
    const storeRows = rows.filter((row) => row.store === store);
    const avg = storeRows.length ? storeRows.reduce((sum, row) => sum + ratingScore[row.rating], 0) / storeRows.length : 0;
    return { store, avg, total: storeRows.length };
  }).filter((item) => item.total).sort((a, b) => b.avg - a.avg).slice(0, 5);

  return `
    <article class="panel">
      <div class="panel-head"><h2>Rendimiento por tienda</h2></div>
      <div class="ranking">
        ${storeStats.length ? storeStats.map((item) => `
          <div class="rank-row">
            <div class="rank-meta"><span>${storeTitle(stores[item.store] || { name: item.store })}</span><span>${item.avg.toFixed(2).replace(".", ",")}</span></div>
            <div class="progress"><span style="width:${(item.avg / 5) * 100}%"></span></div>
          </div>
        `).join("") : `<div class="empty">Sin datos para mostrar.</div>`}
      </div>
    </article>
  `;
}

function bestStore(rows) {
  const ranked = storeRanking(rows);
  const best = ranked[0];
  return best ? { name: storeTitle(stores[best.store]), note: `${best.avg.toFixed(2).replace(".", ",")} / 5` } : { name: "-", note: "Sin datos" };
}

function worstStore(rows) {
  const ranked = Object.keys(stores).map((store) => {
    const storeRows = rows.filter((row) => row.store === store);
    const bad = storeRows.filter((row) => row.rating === "bad").length;
    return { store, bad, total: storeRows.length };
  }).filter((item) => item.total).sort((a, b) => b.bad - a.bad);
  const worst = ranked[0];
  return worst ? { name: storeTitle(stores[worst.store]), note: `${worst.bad} negativas` } : { name: "-", note: "Sin datos" };
}

function storeRanking(rows) {
  return Object.keys(stores).map((store) => {
    const storeRows = rows.filter((row) => row.store === store);
    const avg = storeRows.length ? storeRows.reduce((sum, row) => sum + ratingScore[row.rating], 0) / storeRows.length : 0;
    return { store, avg, total: storeRows.length };
  }).filter((item) => item.total).sort((a, b) => b.avg - a.avg);
}

function citySections(rows) {
  return cityOrder.map((city) => {
    const cityStores = Object.values(stores).filter((store) => store.city === city);
    return `
      <section class="city-section">
        <h2 class="city-title">${city}</h2>
        <div class="stores-grid">
          ${cityStores.map((store) => storeCard(store, rows.filter((row) => row.store === store.name))).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function storeCard(store, rows) {
  const stats = getStats(rows);
  return `
    <article class="store-card">
      <h3>${storeTitle(store)}</h3>
      <p>${store.displayCity}</p>
      <div class="store-metrics">
        <div class="metric"><strong>${stats.total}</strong><span>evaluaciones</span></div>
        <div class="metric"><strong>${stats.score} / 5</strong><span>satisfaccion</span></div>
        <div class="metric"><strong>${stats.goodPct}%</strong><span>Bueno / Bom</span></div>
        <div class="metric"><strong>${stats.badPct}%</strong><span>Malo / Ruim</span></div>
      </div>
      <button class="detail-btn" data-detail-store="${store.name}">Ver detalles</button>
    </article>
  `;
}

function recentTable(rows, title = "Respuestas recientes", limit = 8) {
  const visible = rows.slice(0, limit);
  return `
    <article class="panel table-panel">
      <div class="panel-head"><h2>${title}</h2><strong>${rows.length} registros</strong></div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Fecha y hora</th><th>Ciudad</th><th>Tienda</th><th>Idioma</th><th>Evaluación</th><th>Sugerencia</th><th>Celular</th>
            </tr>
          </thead>
          <tbody>
            ${visible.length ? visible.map(rowTemplate).join("") : `<tr><td colspan="7" class="empty">Sin respuestas para estos filtros.</td></tr>`}
          </tbody>
        </table>
      </div>
    </article>
  `;
}

function rowTemplate(row) {
  return `
    <tr>
      <td>${formatDate(row.createdAt)}</td>
      <td>${row.city}</td>
      <td>${storeTitle(stores[row.store] || { name: row.store })}</td>
      <td>${row.language.toUpperCase()}</td>
      <td><span class="pill ${row.rating}">${ratingEmoji[row.rating]} ${ratingLabel(row)}</span></td>
      <td>${escapeHtml(row.suggestion || "-")}</td>
      <td>${escapeHtml(row.phone || "-")}</td>
    </tr>
  `;
}

function ratingLabel(row) {
  if (row.rating === "good") return row.language === "pt" ? "Bom" : "Bueno";
  if (row.rating === "bad") return row.language === "pt" ? "Ruim" : "Malo";
  return "Neutro";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-PY", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function openStoreDetail(storeName) {
  const rows = evaluationsCache.filter((row) => row.store === storeName);
  const stats = getStats(rows);
  const modal = document.getElementById("storeModal");
  modal.innerHTML = `
    <section class="modal-card">
      <div class="modal-head">
        <div>
          <h2>${storeTitle(stores[storeName] || { name: storeName })}</h2>
          <p>${stores[storeName].displayCity} · ${stats.total} evaluaciones · ${stats.score} / 5</p>
        </div>
        <button class="close-btn" aria-label="Cerrar">×</button>
      </div>
      <div class="modal-body">
        <section class="kpis">
          ${kpi("😊", "Bueno / Bom", stats.good, `${stats.goodPct}%`)}
          ${kpi("🤔", "Neutro", stats.neutral, `${stats.neutralPct}%`, "yellow")}
          ${kpi("😞", "Malo / Ruim", stats.bad, `${stats.badPct}%`, "red")}
          ${kpi("☆", "Promedio", `${stats.score} / 5`, "Satisfacción")}
          ${kpi("▣", "Total", stats.total, "Respuestas")}
        </section>
        <section class="analytics" style="grid-template-columns: 1fr 1fr;">
          ${donutPanel(stats)}
          ${trendPanel(rows)}
        </section>
        ${recentTable(rows, "Todas las evaluaciones de la tienda")}
      </div>
    </section>
  `;
  modal.hidden = false;
  modal.querySelector(".close-btn").addEventListener("click", () => modal.hidden = true);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.hidden = true;
  }, { once: true });
}

function openSupportModal() {
  const modal = document.getElementById("storeModal");
  modal.innerHTML = `
    <section class="modal-card support-modal">
      <div class="modal-head">
        <div>
          <h2>Soporte administrativo</h2>
          <p>Canal interno para asistencia del dashboard y reportes.</p>
        </div>
        <button class="close-btn" aria-label="Cerrar">×</button>
      </div>
      <div class="modal-body">
        <section class="kpis">
          ${kpi("☎", "WhatsApp", "+595 986444084", "Atención comercial")}
          ${kpi("▥", "Reportes", "PDF / CSV", "Exportación activa")}
          ${kpi("▣", "Sucursales", Object.keys(stores).length, "Tiendas configuradas")}
          ${kpi("☆", "Estado", "Online", "Sistema operativo")}
          ${kpi("⚙", "Deploy", "Railway", "Producción")}
        </section>
      </div>
    </section>
  `;
  modal.hidden = false;
  modal.querySelector(".close-btn").addEventListener("click", () => modal.hidden = true);
}

function exportCityReport(format, button) {
  const city = document.getElementById("reportCitySelect")?.value || cityOrder[0];
  const rows = evaluationsCache.filter((row) => row.city === city);
  const slug = slugify(city);
  if (format === "pdf") {
    exportPdf(rows, `Reporte completo - ${city}`, `ciudad-${slug}`, button);
    return;
  }
  exportCsv(rows, `evaluaciones-${slug}.csv`, button);
}

function exportCsv(rows = applyFilters(evaluationsCache), filename = "evaluaciones-filtradas.csv", button) {
  setExportStatus(button, "Generando...");
  const csv = [
    ["Fecha y hora", "Ciudad", "Tienda", "Idioma", "Evaluación", "Sugerencia", "Celular"],
    ...rows.map((row) => [
      row.createdAt,
      row.city,
      storeTitle(stores[row.store] || { name: row.store }),
      row.language,
      ratingLabel(row),
      row.suggestion,
      row.phone,
    ]),
  ].map((line) => line.map((value) => `"${String(value || "").replace(/"/g, '""')}"`).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
  showToast(`Descarga lista: ${filename}`);
  setExportStatus(button, "Listo", true);
}

function exportPdf(rows = applyFilters(evaluationsCache), title = "Reporte con filtros activos", scope = "filtros", button) {
  setExportStatus(button, "Generando...");
  const stats = getStats(rows);
  const tableStart = 730;
  const rowHeight = 24;
  const pageHeight = Math.max(1191, tableStart + 70 + Math.max(rows.length, 1) * rowHeight);
  const doc = createPdfDocument(pageHeight);
  const margin = 42;
  const pageW = 842;
  const green = [5, 40, 21];
  const green2 = [38, 115, 58];
  const gold = [191, 138, 19];
  const red = [217, 39, 28];
  const yellow = [241, 173, 25];
  const line = [229, 226, 218];

  doc.rect(0, 0, pageW, 112, [248, 250, 246]);
  doc.circle(66, 55, 22, null, gold, 2);
  doc.text("A", 58, 64, 24, green, "bold");
  doc.text("AVALIACAO", 100, 48, 24, green, "bold");
  doc.text("EXPERIENCIA QUE CONECTA", 101, 67, 8, gold, "bold");
  doc.text(title, margin, 104, 20, green, "bold");
  doc.text(`Generado: ${new Date().toLocaleString("es-PY")}`, 620, 104, 9, [91, 98, 93]);

  const filters = getFilters();
  const filterText = scope === "todas"
    ? "Alcance: todas las evaluaciones registradas en todas las ciudades y tiendas"
    : scope.startsWith("ciudad-")
      ? `Alcance: todas las evaluaciones de ciudad seleccionada (${rows[0]?.city || "sin datos"})`
      : `Filtros: Ciudad ${filters.city} | Tienda ${filters.store} | Periodo ${filters.period} | Idioma ${filters.lang} | Evaluacion ${filters.rating}`;
  doc.text(filterText, margin, 130, 9, [91, 98, 93]);

  const cards = [
    ["Total evaluaciones", stats.total, green2],
    ["Bueno / Bom", `${stats.good} (${stats.goodPct}%)`, green2],
    ["Neutro", `${stats.neutral} (${stats.neutralPct}%)`, yellow],
    ["Malo / Ruim", `${stats.bad} (${stats.badPct}%)`, red],
    ["Satisfaccion", `${stats.score} / 5`, gold],
  ];
  cards.forEach((card, index) => {
    const x = margin + index * 150;
    doc.roundRect(x, 154, 136, 72, 8, [255, 255, 255], line);
    doc.circle(x + 24, 190, 18, tint(card[2]), card[2], 1);
    doc.text(String(card[1]), x + 50, 190, 17, green, "bold");
    doc.text(card[0], x + 50, 207, 8, [65, 74, 68], "bold");
  });

  doc.text("Evaluaciones por ciudad", margin, 264, 15, green, "bold");
  const cityCounts = cityOrder.map((city) => ({ city, count: rows.filter((row) => row.city === city).length }));
  const maxCity = Math.max(1, ...cityCounts.map((item) => item.count));
  cityCounts.forEach((item, index) => {
    const x = margin + index * 80;
    const h = Math.max(8, (item.count / maxCity) * 95);
    doc.rect(x, 382 - h, 34, h, green2);
    doc.text(String(item.count), x, 398, 9, green, "bold");
    doc.text(item.city, x, 414, 7, [65, 74, 68]);
  });

  doc.text("Distribucion", 500, 264, 15, green, "bold");
  [
    ["Bueno / Bom", stats.goodPct, green2],
    ["Neutro", stats.neutralPct, yellow],
    ["Malo / Ruim", stats.badPct, red],
  ].forEach((item, index) => {
    const y = 295 + index * 38;
    doc.text(item[0], 500, y, 10, [65, 74, 68], "bold");
    doc.roundRect(590, y - 11, 160, 10, 5, [236, 238, 233]);
    doc.roundRect(590, y - 11, Math.max(2, item[1] * 1.6), 10, 5, item[2]);
    doc.text(`${item[1]}%`, 762, y, 9, green, "bold");
  });

  doc.text("Rendimiento por tienda", margin, 462, 15, green, "bold");
  storeRanking(rows).slice(0, 8).forEach((item, index) => {
    const y = 492 + index * 24;
    const width = (item.avg / 5) * 260;
    doc.text(storeTitle(stores[item.store]), margin, y, 9, [42, 49, 44], "bold");
    doc.roundRect(238, y - 9, 280, 8, 4, [236, 238, 233]);
    doc.roundRect(238, y - 9, width, 8, 4, green2);
    doc.text(`${item.avg.toFixed(2).replace(".", ",")} / 5`, 535, y, 9, green, "bold");
  });

  doc.text(`Detalle completo de evaluaciones (${rows.length})`, margin, 705, 15, green, "bold");
  drawPdfTable(doc, rows, tableStart);
  doc.text("Reporte generado automaticamente por el sistema de evaluacion QR.", margin, 575, 8, [110, 116, 111]);
  const filename = `reporte-evaluacion-${scope}-${new Date().toISOString().slice(0, 10)}.pdf`;
  downloadBlob(doc.blob(), filename);
  showToast(`Descarga lista: ${filename}`);
  setExportStatus(button, "Listo", true);
}

function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function tint(rgb) {
  return rgb.map((value) => Math.round(value + (255 - value) * 0.86));
}

function drawPdfTable(doc, rows, startY) {
  const cols = [42, 128, 222, 334, 386, 462, 676];
  const headers = ["Fecha", "Ciudad", "Tienda", "Idioma", "Eval.", "Sugerencia", "Celular"];
  doc.roundRect(38, startY - 20, 766, 28, 6, [245, 250, 242]);
  headers.forEach((header, index) => doc.text(header, cols[index], startY - 2, 8, [5, 40, 21], "bold"));
  rows.forEach((row, index) => {
    const y = startY + 22 + index * 24;
    doc.line(38, y - 14, 804, y - 14, [232, 230, 223]);
    const values = [
      formatDate(row.createdAt),
      row.city,
      storeTitle(stores[row.store] || { name: row.store }),
      row.language.toUpperCase(),
      ratingLabel(row),
      row.suggestion || "-",
      row.phone || "-",
    ];
    values.forEach((value, col) => doc.text(value, cols[col], y, col === 4 ? 8 : 7, [42, 49, 44], col === 4 ? "bold" : "regular", col === 5 ? 32 : 18));
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    link.remove();
    URL.revokeObjectURL(url);
  }, 4000);
}

function setExportStatus(button, text, restore = false) {
  if (!button) return;
  if (!button.dataset.originalText) button.dataset.originalText = button.textContent;
  button.textContent = text;
  button.disabled = true;
  if (restore) {
    setTimeout(() => {
      button.textContent = button.dataset.originalText;
      button.disabled = false;
    }, 1400);
  }
}

function showToast(message) {
  let toast = document.getElementById("exportToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "exportToast";
    toast.className = "export-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3600);
}

function createPdfDocument(pageH = 1191) {
  const objects = [];
  let content = "";
  const esc = (text) => String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/[()\\]/g, "\\$&");
  const color = (rgb) => `${rgb.map((v) => (v / 255).toFixed(3)).join(" ")} rg`;
  const stroke = (rgb) => `${rgb.map((v) => (v / 255).toFixed(3)).join(" ")} RG`;
  const add = (line) => { content += `${line}\n`; };
  const font = (weight) => weight === "bold" ? "F2" : "F1";
  return {
    text(text, x, y, size = 10, rgb = [0, 0, 0], weight = "regular", maxChars = 60) {
      const lines = wrapPdfText(esc(text), maxChars);
      lines.slice(0, 2).forEach((line, index) => {
        add(`BT /${font(weight)} ${size} Tf ${rgb.map((v) => (v / 255).toFixed(3)).join(" ")} rg ${x} ${pageH - y - index * (size + 3)} Td (${line}) Tj ET`);
      });
    },
    rect(x, y, w, h, fill, border) {
      if (fill) add(`${color(fill)} ${x} ${pageH - y - h} ${w} ${h} re f`);
      if (border) add(`${stroke(border)} ${x} ${pageH - y - h} ${w} ${h} re S`);
    },
    roundRect(x, y, w, h, r, fill, border) {
      this.rect(x, y, w, h, fill, border);
    },
    line(x1, y1, x2, y2, rgb) {
      add(`${stroke(rgb)} ${x1} ${pageH - y1} m ${x2} ${pageH - y2} l S`);
    },
    circle(x, y, r, fill, border, width = 1) {
      const c = 0.5522847498 * r;
      if (fill) add(color(fill));
      if (border) add(`${stroke(border)} ${width} w`);
      add(`${x + r} ${pageH - y} m ${x + r} ${pageH - (y - c)} ${x + c} ${pageH - (y - r)} ${x} ${pageH - (y - r)} c ${x - c} ${pageH - (y - r)} ${x - r} ${pageH - (y - c)} ${x - r} ${pageH - y} c ${x - r} ${pageH - (y + c)} ${x - c} ${pageH - (y + r)} ${x} ${pageH - (y + r)} c ${x + c} ${pageH - (y + r)} ${x + r} ${pageH - (y + c)} ${x + r} ${pageH - y} c ${fill ? "f" : "S"}`);
    },
    blob() {
      objects.push("<< /Type /Catalog /Pages 2 0 R >>");
      objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
      objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 ${pageH}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`);
      objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
      objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
      objects.push(`<< /Length ${content.length} >>\nstream\n${content}endstream`);
      let pdf = "%PDF-1.4\n";
      const xref = [0];
      objects.forEach((object, index) => {
        xref.push(pdf.length);
        pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
      });
      const xrefStart = pdf.length;
      pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
      xref.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
      pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
      return new Blob([pdf], { type: "application/pdf" });
    },
  };
}

function wrapPdfText(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  words.forEach((word) => {
    if (`${line} ${word}`.trim().length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  });
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function demoEvaluations() {
  const suggestions = [
    "Excelente atención, muy amables y rápidos.",
    "Buena experiencia en general.",
    "El producto llegó bien, pero el tiempo de espera fue largo.",
    "Falta más variedad de productos en stock.",
    "Muy buena atención del personal, recomiendo.",
    "Atendimento muito bom e equipe atenciosa.",
    "Poderia melhorar a organizacao da fila.",
  ];
  const ratings = ["good", "good", "good", "neutral", "bad"];
  const storeCodes = Object.keys(stores);
  return Array.from({ length: 86 }, (_, index) => {
    const store = stores[storeCodes[index % storeCodes.length]];
    const rating = ratings[index % ratings.length];
    const created = new Date();
    created.setDate(created.getDate() - (index % 34));
    created.setHours(9 + (index % 10), 10 + (index % 45));
    return {
      id: `demo-${index}`,
      store: store.name,
      city: store.city,
      language: store.bilingual && index % 3 === 0 ? "pt" : "es",
      rating,
      suggestion: suggestions[index % suggestions.length],
      phone: `(09${70 + (index % 20)}) ${123 + index}-${String(456 + index).padStart(3, "0")}`,
      createdAt: created.toISOString(),
    };
  });
}

app();
