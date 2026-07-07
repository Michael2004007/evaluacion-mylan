const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "evaluations.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

const STORES = {
  SDG01: { name: "SDG01", city: "Salto del Guairá", bilingual: true },
  SDG02: { name: "SDG02", city: "Salto del Guairá", bilingual: true },
  "CDE-PARIS": { name: "CDE-PARIS", city: "Ciudad del Este", bilingual: true },
  "CDE-JEBAI": { name: "CDE-JEBAI", city: "Ciudad del Este", bilingual: true },
  "CDE-CENTRO": { name: "CDE-CENTRO", city: "Ciudad del Este", bilingual: true },
  ENCARNACION: { name: "ENCARNACION", city: "Encarnación", bilingual: false },
  "PJC-DUBAI": { name: "PJC-DUBAI", city: "Pedro Juan Caballero", bilingual: true },
  "ASU-PINEDO": { name: "ASU-PINEDO", city: "Asunción", bilingual: false },
  "ASU-MULTIPLAZA": { name: "ASU-MULTIPLAZA", city: "Asunción", bilingual: false },
  "ASU-MARIANO-GONDOLA": { name: "ASU-MARIANO-GONDOLA", label: "ASU - MARIANO GONDOLA", city: "Asunción", bilingual: false },
  "ASU-MARIANO-TIENDA": { name: "ASU-MARIANO-TIENDA", city: "Asunción", bilingual: false },
  "ASU-PLAZA-NORTE": { name: "ASU-PLAZA-NORTE", city: "Asunción", bilingual: false },
  "ASU-SAN-LORENZO": { name: "ASU-SAN-LORENZO", city: "Asunción", bilingual: false },
};

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]\n", "utf8");
}

function readEvaluations() {
  ensureDataFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeEvaluations(evaluations) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(evaluations, null, 2), "utf8");
}

function send(res, status, body, contentType = "application/json; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function parseJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, (error, content) => {
    if (error) {
      send(res, 404, "Not found", "text/plain; charset=utf-8");
      return;
    }
    send(res, 200, content, MIME_TYPES[ext] || "application/octet-stream");
  });
}

function toCsv(rows) {
  const headers = ["Fecha y hora", "Ciudad", "Tienda", "Idioma", "Evaluacion", "Sugerencia", "Celular"];
  const escape = (value) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };
  return [headers.map(escape).join(",")]
    .concat(rows.map((row) => [
      row.createdAt,
      row.city,
      row.store,
      row.language,
      row.rating,
      row.suggestion,
      row.phone,
    ].map(escape).join(",")))
    .join("\n");
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

async function handleApi(req, res, url) {
  if (url.pathname === "/api/stores" && req.method === "GET") {
    send(res, 200, JSON.stringify(STORES));
    return true;
  }

  if (url.pathname === "/api/evaluations" && req.method === "GET") {
    send(res, 200, JSON.stringify(readEvaluations()));
    return true;
  }

  if (url.pathname === "/api/evaluations" && req.method === "POST") {
    try {
      const payload = await parseJson(req);
      const storeCode = normalizeStoreCode(payload.store);
      const store = STORES[storeCode];
      const validRatings = new Set(["good", "neutral", "bad"]);
      const validLanguages = new Set(["es", "pt"]);

      if (!store || !validRatings.has(payload.rating) || !validLanguages.has(payload.language)) {
        send(res, 400, JSON.stringify({ error: "Datos invalidos" }));
        return true;
      }

      const evaluation = {
        id: crypto.randomUUID(),
        store: store.name,
        city: store.city,
        language: payload.language,
        rating: payload.rating,
        suggestion: String(payload.suggestion || "").slice(0, 1000),
        phone: String(payload.phone || "").slice(0, 40),
        createdAt: new Date().toISOString(),
      };

      const evaluations = readEvaluations();
      evaluations.unshift(evaluation);
      writeEvaluations(evaluations);
      send(res, 201, JSON.stringify(evaluation));
      return true;
    } catch {
      send(res, 400, JSON.stringify({ error: "JSON invalido" }));
      return true;
    }
  }

  if (url.pathname === "/api/export.csv" && req.method === "GET") {
    const rows = readEvaluations();
    res.writeHead(200, {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"reporte-evaluaciones.csv\"",
      "Cache-Control": "no-store",
    });
    res.end(toCsv(rows));
    return true;
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (await handleApi(req, res, url)) return;

  if (url.pathname === "/" || url.pathname === "/admin" || url.pathname.startsWith("/avaliar/")) {
    serveFile(res, path.join(PUBLIC_DIR, "index.html"));
    return;
  }

  const requestedPath = path.normalize(url.pathname.replace(/^\/+/, ""));
  const filePath = path.join(PUBLIC_DIR, requestedPath);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  serveFile(res, filePath);
});

server.listen(PORT, () => {
  ensureDataFile();
  console.log(`Sistema de evaluación listo en http://localhost:${PORT}`);
  console.log(`Dashboard: http://localhost:${PORT}/admin`);
  console.log(`Ejemplo QR: http://localhost:${PORT}/avaliar/SDG01`);
});
