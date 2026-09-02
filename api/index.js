var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/generatePdf.ts
var generatePdf_exports = {};
__export(generatePdf_exports, {
  generateGuidePDF: () => generateGuidePDF
});
import PDFDocument from "pdfkit";
function generateGuidePDF(stream) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        bufferPages: true,
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        size: "A4"
      });
      doc.on("error", (err) => reject(err));
      doc.pipe(stream);
      const addChapterHeader = (chapterNo, title, subtitle) => {
        doc.fillColor("#1e1b4b");
        doc.font("Helvetica-Bold").fontSize(10).text(`CHAPTER ${chapterNo}`, { paragraphGap: 2 });
        doc.font("Helvetica-Bold").fontSize(14).text(title, { paragraphGap: 4 });
        doc.fillColor("#4f46e5");
        doc.font("Helvetica-Bold").fontSize(8).text(subtitle, { paragraphGap: 12 });
        doc.fillColor("#334155");
        doc.rect(50, doc.y, 495, 1).fill("#e2e8f0");
        doc.moveDown(1.5);
      };
      const addSectionHeading = (title) => {
        doc.fillColor("#0f172a");
        doc.font("Helvetica-Bold").fontSize(10).text(title, { paragraphGap: 6 });
        doc.fillColor("#334155");
      };
      const addParagraph = (text2, options = {}) => {
        doc.fillColor("#334155");
        doc.font("Helvetica").fontSize(8.5).text(text2, {
          lineGap: 3,
          paragraphGap: 6,
          align: "justify",
          ...options
        });
      };
      const addCodeBlock = (code) => {
        doc.fillColor("#1e293b");
        doc.rect(50, doc.y, 495, doc.currentLineHeight() * code.split("\n").length + 15).fill("#f8fafc");
        doc.fillColor("#0f172a");
        doc.font("Courier").fontSize(7.5).text(code, doc.x + 10, doc.y + 8, {
          lineGap: 2.2,
          paragraphGap: 2
        });
        doc.x -= 10;
        doc.moveDown(1.5);
      };
      const addBullet = (boldText, normalText) => {
        doc.fillColor("#334155");
        doc.font("Helvetica-Bold").fontSize(8.5).text(`  \u2022  ${boldText}: `, {
          continued: true
        });
        doc.font("Helvetica").fontSize(8.5).text(normalText, {
          paragraphGap: 4,
          lineGap: 2
        });
      };
      doc.rect(0, 0, 15, 842).fill("#1e1b4b");
      doc.rect(15, 0, 8, 842).fill("#4f46e5");
      doc.x = 60;
      doc.y = 120;
      doc.fillColor("#1e1b4b").font("Helvetica-Bold").fontSize(32).text("THE ARCHITECTURE", { paragraphGap: 4 });
      doc.text("OF HIGH-PERFORMANCE", { paragraphGap: 4 });
      doc.text("WEB APPLICATIONS", { paragraphGap: 18 });
      doc.fillColor("#4f46e5").font("Helvetica-Bold").fontSize(15).text("A Master Class Textbook on Full-Stack Engineering", { paragraphGap: 30 });
      doc.rect(60, doc.y, 250, 4).fill("#6366f1");
      doc.moveDown(3.5);
      doc.fillColor("#475569").font("Helvetica-Oblique").fontSize(10).text("A step-by-step developer guide on implementing modular frontends, stateless servers, and serverless Cloud SQL databases.", { paragraphGap: 35 });
      doc.moveDown(4);
      doc.fillColor("#020617").font("Helvetica-Bold").fontSize(11).text("PRIMARY TEXTBOOK CHAPTERS:", { paragraphGap: 10 });
      const chaptersIndex = [
        "Chapter I: Introduction to Full-Stack Systems & How to Build the App",
        "Chapter II: Detailed React Technologies (Virtual DOM, Engine Cycles, Lifecycle)",
        "Chapter III: UI/UX Engineering & Design Systems (Layouts, Hierarchy, typography)",
        "Chapter IV: Backend Code Architectures & Stateless REST API Design (Express, Middleware)",
        "Chapter V: Advanced Database Solutions & Serverless SQL (Neon Database, WAL Split)",
        "Chapter VI: Troubleshooting, Local Deployments & Hosting (Dotenv, Node compilation)",
        "Chapter VII: Latest Academic & Industry Innovations (React 19, WASM Edge, Google GenAI)",
        "Chapter VIII: Full-System Synthesis Compliance Checklist & Graduation Guidelines"
      ];
      chaptersIndex.forEach((ch) => {
        doc.fillColor("#334155").font("Helvetica").fontSize(9).text(` [x]  ${ch}`, { paragraphGap: 6, indent: 15 });
      });
      doc.moveDown(6);
      doc.fillColor("#64748b").font("Courier-Bold").fontSize(8).text("KIDDIES TOWN SYSTEM ACADEMY  \u2022  OFFICIAL SECOND EDITION  \u2022  PUBLISHED JUNE 2026");
      doc.addPage();
      doc.x = 55;
      doc.y = 50;
      doc.fillColor("#1e1b4b").font("Helvetica-Bold").fontSize(18).text("SYLLABUS & TEXTBOOK INDEX MAP", { paragraphGap: 4 });
      doc.fillColor("#6366f1").font("Helvetica-Bold").fontSize(9).text("Comprehensive Overview of Learning Units and Academic Competencies", { paragraphGap: 15 });
      doc.rect(50, doc.y, 495, 1).fill("#cbd5e1");
      doc.moveDown(2);
      addSectionHeading("Course Objectives & Scope");
      addParagraph(
        "This textbook prepares aspiring software designers to build high-grade interactive platforms from first principles. By studying this guide, students learn the baseline theory behind reactive frontends, state propagation, asynchronous proxy networking, and stateless cloud server operations. The modular architecture analyzed here is derived directly from the production-ready Kiddies Town Portal built via React 18, Express, and Neon SQL."
      );
      doc.moveDown(1);
      addSectionHeading("Chapter Syllabus Roadmap & Core Competencies");
      const detailedIndex = [
        { ch: "I", title: "Introduction to Full-Stack Systems", desc: "Covers baseline architectural tiers, files system routing, configuration files, and initializing your first folder layouts." },
        { ch: "II", title: "React Frontend Technologies Deep-Dive", desc: "Detailed breakdown of the Virtual DOM, state hooks, infinite render prevention, and how Vite serves packages instantaneously." },
        { ch: "III", title: "Modern UI/UX Design Protocols", desc: "Establishes standard visual systems, Inter font paring strategies, touch targets, and why to avoid distracting 'telemetry slop'." },
        { ch: "IV", title: "Backend API Servers with Express", desc: "Explores stateless API routing, pipeline routers, Express middleware sequencing, and production bundling via esbuild." },
        { ch: "V", title: "The Serverless Postgres Paradigm", desc: "Reviews how Neon isolates SQL compute power from data storage, WebSocket connection pooling, and nested document JSONB schemas." },
        { ch: "VI", title: "Local Deployments & Workstation Hosting", desc: "Step-by-step instructions for running local scripts, terminal variables setup, caching strategies, and offline buffers." },
        { ch: "VII", title: "Forward-Looking Research Innovations", desc: "Covers React 19 Server actions, WebAssembly compilation runtimes, HTTP/3 QUIC connection stabilization, and Google GenAI APIs." },
        { ch: "VIII", title: "Full System Integration Checklist", desc: "A practical evaluation matrix, debug workflows, and a formal certification letter upon completion of course." }
      ];
      detailedIndex.forEach((unit) => {
        doc.fillColor("#1e1b4b").font("Helvetica-Bold").fontSize(9).text(`Chapter ${unit.ch}: ${unit.title}`, { continued: true });
        doc.fillColor("#475569").font("Helvetica-Oblique").fontSize(8.5).text(`  -  Unit ${unit.ch}`, { align: "right" });
        doc.fillColor("#515e70").font("Helvetica").fontSize(8).text(unit.desc, { paragraphGap: 8, indent: 12 });
      });
      doc.addPage();
      addChapterHeader("I", "Introduction to Full-Stack Systems & How to Build the App", "UNIT I - SYSTEM ARCHITECTURE AND FOLDER LAYOUTS FROM FIRST PRINCIPLES");
      addParagraph(
        "A full-stack web application is composed of three interconnected systems: (1) The Presentation Layer or Client, which executes inside the consumer's web browser, (2) The Application Logic Layer or Server, which coordinates authorization, security policies, and proxies, and (3) The Persistence Layer or Database, where persistent application records reside. Keeping these segments isolated (Separation of Concerns) is crucial."
      );
      addSectionHeading("Structuring the Base Project and Directory Layout");
      addParagraph(
        "To begin building a performance-optimized system from scratch, we establish a clean, standard workspace. A professional folder structure prevents technical debt and makes components extremely easy to reuse:"
      );
      const tree = `kiddies-town-app/
\u251C\u2500\u2500 package.json          # Dependency registrations & boot script runners
\u251C\u2500\u2500 tsconfig.json         # TypeScript compiler configurations
\u251C\u2500\u2500 server.ts             # Custom Express API Gateway and backend routing
\u251C\u2500\u2500 index.html            # Static HTML frame hosting the React entry point
\u2514\u2500\u2500 src/
    \u251C\u2500\u2500 main.tsx          # Client-side React boot and DOM injection
    \u251C\u2500\u2500 App.tsx           # Global routing framework & central reactive state
    \u251C\u2500\u2500 index.css         # Tailwind utility styling entry point
    \u251C\u2500\u2500 types.ts          # Consolidated global system TypeScript interfaces
    \u251C\u2500\u2500 data/
    \u2502   \u2514\u2500\u2500 mockData.ts   # Local developer state database falls (seeding)
    \u2514\u2500\u2500 components/
        \u251C\u2500\u2500 ParentPanel.tsx     # Student roster, chats and school fees
        \u251C\u2500\u2500 AdminPanel.tsx      # Reroute compliance, arrears calculators
        \u2514\u2500\u2500 DevAcademy.tsx      # Interactive interactive learning portal`;
      addCodeBlock(tree);
      addSectionHeading("Dependency Selection and Config Scripts Setup");
      addParagraph(
        "We specify our dependencies inside the package.json file. For high-speed compilers, we avoid legacy webpack chains. Instead, we utilize modern compilers such as Vite and Esbuild. Our server runtime runs on Express, and we connect to the PostgreSQL cloud DB securely over WebSockets via @neondatabase/serverless."
      );
      doc.addPage();
      addChapterHeader("II", "Detailed React Technologies & Engine Cycles", "UNIT II - VIRTUAL DOM COMPILATION, RE-RENDER INHIBITION, AND THE BUNDLER PIPELINE");
      addParagraph(
        "React is a declarative web framework. Writing declarative code means you describe how your user interface *should look* at any given state, and React handles syncing the browser page accordingly. This is powered by React's Virtual DOM."
      );
      addSectionHeading("Understanding the Virtual DOM and Reconciliation Pipeline");
      addParagraph(
        "Directly writing updates to the browser's Document Object Model (DOM) is an expensive operation that slows down performance. Instead, React holds a lightweight Virtual representation of the DOM tree in system memory. When state updates occur:"
      );
      addBullet("Reconciliation", "React evaluates differences between the previous virtual representation and the new tree (a process called Diffing).");
      addBullet("Batching Updates", "Once computed, React translates only the exact differing nodes to the browser's real DOM in a single rapid batch, preventing unnecessary layout recalculations.");
      addSectionHeading("Managing Core Hook Lifecycles Responsibly");
      addParagraph(
        "Incorrectly declaring state updates inside hooks is the number-one reason beginner applications freeze or suffer infinite re-runs. Analyze this standard, secure state implementation pattern below:"
      );
      const reactCode = `import React, { useState, useEffect } from "react";

export function LearnerRoster() {
  const [learners, setLearners] = useState<any[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Correct Approach: Fetches ONLY on element mounting 
    async function fetchList() {
      try {
        const response = await fetch("/api/learners");
        const list = await response.json();
        setLearners(list);
      } catch (err) {
        setLoadError(true);
      }
    }
    fetchList();
  }, []); // Empty dependency array prevents infinite recursive re-renders

  return (
    <ul>
      {learners.map((child) => (
        <li key={child.id}>{child.name}</li>
      ))}
    </ul>
  );
}`;
      addCodeBlock(reactCode);
      doc.addPage();
      addChapterHeader("III", "UI/UX Engineering & Premium Design Systems", "UNIT III - TYPOGRAPHICAL SCALES, ACCESSIBILITY COMPLIANCE, AND REDUCING VISUAL SLOP");
      addParagraph(
        "Pristine visual UI is characterized by high contrast, intentional padding variation, strict font pairing rules, and the complete elimination of distracting, unrequested technical data (Anti-AI-Slop and architectural honesty)."
      );
      doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(9.5).text("1. Typography Scaling and Hierarchical Font Selection", { paragraphGap: 6 });
      addParagraph(
        "Pair the right fonts to establish a pristine visual rhythm. Default to 'Inter' for highly legible UI dashboards. Use display fonts like 'Space Grotesk' or 'Outfit' on major display headings, and always pair technical coordinates or timestamps with monospaced accents like 'Fira Code' or 'JetBrains Mono'. Maintain a strict typographical ratio:"
      );
      addBullet("Major Headline", "32px bold, Space Grotesk font with letter-spacing tracking-tight.");
      addBullet("Sub-headings", "14px semi-bold, Inter font with balanced line-height.");
      addBullet("Metadata / Monospace", "10px, JetBrains Mono font uppercase for labels and dates.");
      doc.moveDown(1.2);
      doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(9.5).text("2. Interactive Layouts and Accessibility Tap Targets", { paragraphGap: 6 });
      addParagraph(
        "1. Touch targets (clickable areas, inputs, buttons) must cover a minimum of 44px by 44px on smaller mobile devices. This guarantees that parents checking on child records can click buttons accurately on-screen."
      );
      addParagraph(
        "2. Provide micro-interactions such as smooth CSS transitions or elastic spring transforms (using framer-motion library in React) on clickable tabs and submit buttons, which significantly boosts perceived responsiveness."
      );
      doc.moveDown(1.2);
      doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(9.5).text("3. Anti-AI-Slop: The Manifesto of Clean Design", { paragraphGap: 6 });
      addParagraph(
        "Avoid adding fake, simulate, or unrequested telemetry clutter (such as system uptime pings, container port details, simulated terminal lines, or redundant credits like 'Created by Cloud Native Workspace'). If a user asks for a simple profile grid, build an elegantly styled grid using luxurious off-white spaces and let the clean card stand on its own \u2014 do not decorate outer borders with fake system logs which look highly unprofessional."
      );
      doc.addPage();
      addChapterHeader("IV", "Backend Code Architectures & Stateless REST APIs", "UNIT IV - MIDDLEWARE CONVENTIONS, INBOUND PROTOCOLS, CORS AND ESBUILD BUNDLE COMPILATION");
      addParagraph(
        "The api server acts as a strict security barrier between public users and sensitive storage infrastructure. Express is the leading server framework for Node.js, routing requests through a modular pipeline of step-by-step middle functions."
      );
      addSectionHeading("A Robust Stateless Middleware Chain Setup");
      addParagraph(
        "Requests are sequentially processed by express middle functions before emitting response objects. This allows developers to check authorization, block malicious parameters, and parse content dynamically:"
      );
      addBullet("Body Parsing Middleware", "Express v4+ includes 'express.json()' natively, converting stringified payloads securely into request objects.");
      addBullet("Header Routing Middleware (CORS)", "Restricts resources to authorized web origins, preventing cross-site scripting vulnerabilities.");
      addBullet("Static Asset Middleware", "Delivers pre-compiled static frontend bundles (such as our CSS, JS, and HTML files) instantly inside production environments.");
      addSectionHeading("Production Packaging using Esbuild Compiler Bundlers");
      addParagraph(
        "In development modes, tsx (TypeScript Execute) lets us run server.ts dynamically. For active deployments, we bundle the backend code with Esbuild into a single CommonJS (dist/server.cjs) output. This speeds up cold-starts by 800% and avoids Node package import errors on containers:"
      );
      const serverTemplate = `import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Strict API Router endpoint proxies mapping securely to SQL databases
app.post("/api/chats", async (req, res) => {
  const { sender, message } = req.body;
  if (!sender || !message) {
    return res.status(400).json({ error: "Missing required properties" });
  }
  // Store chat records securely in PostgreSQL database...
  res.json({ success: true, timestamp: new Date().toISOString() });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(\`\u26A1 Server listening on port \${PORT}\`);
});`;
      addCodeBlock(serverTemplate);
      doc.addPage();
      addChapterHeader("V", "Serverless Database Solutions & SQL Paradigm Shift", "UNIT V - NEON POSTGRESQL ARCHITECTURE, CONNECTION POOLERS, AND REPLICA BRANCHING");
      addParagraph(
        "Relational databases (SQL) are the gold standard for data durability. High-density structures like class groups, finances, and attendance require strict transactional integrity (ACID compliance)."
      );
      addSectionHeading("How Neon Serverless Isolates Compute from Storage");
      addParagraph(
        "Classic relational databases run on unified server modules where solid states (disks) must sit next to compute engines (CPU). This leads to massive cost overruns for developer environments or early childhood school workspaces that sit empty on weekends. Neon resolves this via a dual-plane split:"
      );
      addBullet("Compute Engine Pool", "When query requests are dispatched, active serverless containers launch instantly (under 400ms) to parse, compile, and execute the SQL strings.");
      addBullet("Separated Storage Base", "The write-ahead log (WAL) is stored on auto-scaling, cloud-native storage nodes. This allows compute engines to scale completely down to zero after 5 minutes of idle time, drastically dropping operations costs.");
      addSectionHeading("Preventing Connection Starvation over Serverless Lambdas");
      addParagraph(
        "Traditional databases require persistent TCP handshakes. However, serverless backends frequently launch and destroy compute targets, exhausting available database pools instantly. Neon resolves this using WebSocket proxies:"
      );
      const neonSnippet = `import { neon } from "@neondatabase/serverless";

// Connect to Cloud Postgres over highly-efficient pooled WebSocket transport
const sql = neon("postgres://user:password@subdomain-ep.azure.neon.tech/main");

export async function insertNewLearner(student: { id: string; name: string }) {
  // Safe prepared parameterization blocks SQL injection hacks
  const query = "INSERT INTO kt_learners (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data";
  await sql(query, [student.id, JSON.stringify(student)]);
}`;
      addCodeBlock(neonSnippet);
      doc.addPage();
      addChapterHeader("VI", "Troubleshooting, Local Deployments & Hosting", "UNIT VI - PORT SPECIFICATION, PERSISTENCE BUFFER FALLBACK, AND ENVIRONMENT SETUP ROUTINES");
      addParagraph(
        "Hosting applications locally requires strict adherence to network configurations. Containers and cloud proxies expect standard routing rules."
      );
      addSectionHeading("1. Strict Local Port Routing Rules");
      addParagraph(
        "The dev systems use an Nginx proxy that exclusively routes traffic to port 3000. In package.json and your server code, never change or override port bounds. Maintain the hardcoded value 3000 mapped to host 0.0.0.0 to guarantee successful container ingress routing."
      );
      addSectionHeading("2. Running the Application Workstation Sandbox Locally");
      addParagraph(
        "Follow these exact setup commands sequentially inside your local terminal of choice to host and test this application natively:"
      );
      const stepsCode = `# Step 1: Extract project archive or pull from workspace github source
cd kiddies-town-app/

# Step 2: Install absolute dependencies listed inside package.json
npm install

# Step 3: Populate environment variables file (do NOT commit secrets!)
echo "DATABASE_URL=postgresql://neondb_owner:password@subdomain-ep.neon.tech/neondb" > .env

# Step 4: Boot local dev pipeline hosting Vite on port 3000 and hot compiling TS
npm run dev

# Step 5: (For Production Build) Compile static web blocks and bundle esbuild
npm run build
npm start`;
      addCodeBlock(stepsCode);
      addSectionHeading("3. Local States Caching and Persistence Buffer Fallback");
      addParagraph(
        "If the DATABASE_URL environment variable is missing or NeonDB is completely offline, our smart backend automatically triggers Demo Mode. It uses memory-based javascript caches (fallbackStore) to serve all requests. Parents and admins can still add students, send chats, and issue payments seamlessly without getting database error crashes, which makes local staging and presentation offline testing fully reliable."
      );
      doc.addPage();
      addChapterHeader("VII", "Tech Research & Latest Academic Innovations", "UNIT VII - THE FUTURE OF FULL-STACK NETWORKING, WEB RUNTIMES AND INTUITIVE SYSTEMS");
      addParagraph(
        "The software development landscapes of tomorrow are shifting towards native speeds on the edge, unified network protocol pipelines, and seamless language bridges."
      );
      addSectionHeading("1. React 19 Unified Server Actions and Framework Consolidation");
      addParagraph(
        "React 19 removes the traditional separation between client interaction and backend API routing. With Server Actions, developers write secure async database operations directly inside frontend component files, marking them with the 'use server' keyword directive. React handles compiling the underneath AJAX calls, CSRF tokens, and payloads automatically under the hood (Unified Compilation Paradigm)."
      );
      addSectionHeading("2. WebAssembly (WASM) Edge Compilation Nodes");
      addParagraph(
        "JavaScript is no longer the sole runtime for server routers. WebAssembly (WASM) compiler runtimes let high-speed performance languages (such as Rust and C++) run with direct native execution speeds inside globally distributed CDN edge servers (like Cloudflare Workers). This allows intense calculations, like computer vision or payment token cryptography, to run in under 1ms."
      );
      addSectionHeading("3. HTTP/3 and the QUIC Transport Protocols");
      addParagraph(
        "HTTP/3 replaces TCP with QUIC, a transport protocol designed on top of UDP. Classic TCP suffers from 'head-of-line blocking', where a single delayed network packet halts all incoming assets. QUIC handles packets dynamically on independent channels. This guarantees near-zero lag times for workspaces loading over unstable rural 3G mobile nodes."
      );
      addSectionHeading("4. Proxy Grounded Generative AI SDKs");
      addParagraph(
        "Modern systems are evolving from static dashboards into cognitive portals. We utilize the modern @google/genai TypeScript SDK to perform server-side agentic queries securely using process.env.GEMINI_API_KEY. Crucially, the api key is kept hidden from frontends using secure backend API wrapper routes."
      );
      doc.addPage();
      addChapterHeader("VIII", "Full-System Synthesis & Graduation Checklist", "UNIT VIII - COMPLIANCE EVALUATION CARD, AUDITING METRICS, AND MASTER CERTIFICATION");
      addParagraph(
        "To graduate this masterclass curriculum guide, students must verify that their localized codebases fully satisfy professional security, layout, and database integration guidelines."
      );
      doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(9).text("Section 1: The Full-Stack Architecture Compliance Checklist", { paragraphGap: 6 });
      addBullet("Vite HMR Invariant", "Vite's Hot Module Replacement should compile assets without manual refresh cycles during development.");
      addBullet("Stateless Authorization Proxy", "Client browsers must never directly talk to Neon SQL with raw postgres credentials, only wrapped REST APIs.");
      addBullet("Safe Double-Syncing Fallback", "Backend must automatically check environment bindings and fall back on offline memory caches if DATABASE_URL is void.");
      addBullet("Clean CSS Breakpoints", "Responsiveness must handle touch targets at 44px+ and adjust grid hierarchies logically across mobile, tablet, and desktop.");
      addBullet("Anti-Telemetry Honesty Compliance", "Pruned UI layouts completely void of mock terminal lines, container flags, and unrequested widgets.");
      doc.moveDown(1.5);
      doc.rect(50, doc.y, 495, 1).fill("#cbd5e1");
      doc.moveDown(1.5);
      doc.fillColor("#1e1b4b").font("Helvetica-Bold").fontSize(11).text("Academic Certification & Congrats", { paragraphGap: 6 });
      addParagraph(
        "This certifies that you possess the core technical competencies on Declarative User Interfaces, stateless Express servers, Serverless Relational DB mapping, and high-performance compilation bundling. Continuously code cleanly, respect user intention above all, keep visual layouts minimalistic, and prioritize structural performance. Your software engineering journey has successfully begun!"
      );
      doc.moveDown(2);
      doc.rect(50, doc.y, 180, 0.5).fill("#475569");
      doc.rect(310, doc.y, 180, 0.5).fill("#475569");
      doc.moveDown(0.5);
      doc.fillColor("#475569").font("Helvetica-Bold").fontSize(8).text("DEAN OF COMPUTING & SYSTEMS", 50, doc.y, { continued: true });
      doc.text("KIDDIES TOWN ACADEMY ALUMNI BOARD", 170, doc.y, { align: "right" });
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.fillColor("#94a3b8");
        doc.font("Helvetica-Bold").fontSize(7.5).text(
          `KIDDIES TOWN SYSTEM ACADEMY  \u2022  PAGE ${i + 1} OF ${totalPages}`,
          50,
          800,
          { align: "center" }
        );
      }
      doc.end();
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}
var init_generatePdf = __esm({
  "src/lib/generatePdf.ts"() {
  }
});

// server/app.ts
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import path2 from "path";
import { fileURLToPath } from "url";

// server/routes/v1/index.ts
import { Router as Router7 } from "express";

// server/routes/v1/auth.routes.ts
import { Router } from "express";

// server/config/database.ts
import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

// server/utils/logger.ts
import pino from "pino";
var isProduction = process.env.NODE_ENV === "production";
var logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  ...isProduction ? {} : {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname"
      }
    }
  }
});
var logger_default = logger;

// server/config/passwordHasher.ts
import bcrypt from "bcryptjs";
var SALT_ROUNDS = 12;
function hashPasswordSync(plain) {
  return bcrypt.hashSync(plain, SALT_ROUNDS);
}
async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}
function isBcryptHash(value) {
  return typeof value === "string" && value.startsWith("$2");
}
async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

// src/data/mockData.ts
var initialLearners = [
  {
    id: "student-jake",
    surname: "Mbeki",
    firstNames: "Jake",
    preferredName: "Jake",
    dob: "2019-03-15",
    idNumber: "1903155345084",
    gender: "Male",
    homeLanguage: "English / Zulu",
    religion: "Christian",
    gradeThisYear: "Grade R",
    schoolAttending: "Kiddies Town ECD & Academy",
    previousSchool: "None",
    classType: "Tigers",
    attendanceStatus: "Present",
    arrivedTime: "07:45",
    parentEmail: "parent@kiddiestown.co.za"
  },
  {
    id: "student-jill",
    surname: "Mbeki",
    firstNames: "Jill",
    preferredName: "Jill",
    dob: "2021-06-20",
    idNumber: "2106201234083",
    gender: "Female",
    homeLanguage: "English / Zulu",
    religion: "Christian",
    gradeThisYear: "Toddler",
    schoolAttending: "Kiddies Town ECD & Academy",
    previousSchool: "None",
    classType: "Roses",
    attendanceStatus: "Present",
    arrivedTime: "08:00",
    parentEmail: "parent@kiddiestown.co.za"
  }
];
var initialParentProfile = {
  name: "Sarah Mbeki",
  email: "sarah.mbeki@mail.com",
  phone: "+27 81 545 3500",
  address: "7 Grimm Street, Ster Park, Polokwane",
  maritalStatus: "Married",
  childLivesWith: "Both Parents",
  mother: {
    title: "Mrs.",
    surname: "Mbeki",
    firstNames: "Sarah",
    idNumber: "8610120150085",
    occupation: "Financial Analyst",
    employer: "Standard Bank",
    telWork: "015 023 0600",
    telHome: "015 023 1122",
    cellNo: "081 545 3500",
    email: "sarah.mbeki@mail.com",
    homeAddress: "7 Grimm Street, Ster Park, Polokwane",
    postalAddress: "P.O. Box 77, Polokwane, 0700",
    workAddress: "29 Hans Van Rensburg St, Polokwane"
  },
  father: {
    title: "Mr.",
    surname: "Mbeki",
    firstNames: "Thabo",
    idNumber: "8402140134081",
    occupation: "Software Consultant",
    employer: "FTech Consulting",
    telWork: "015 023 0600",
    telHome: "015 023 1122",
    cellNo: "079 386 6233",
    email: "thabo@ftechconsulting.co.za",
    homeAddress: "7 Grimm Street, Ster Park, Polokwane",
    postalAddress: "P.O. Box 77, Polokwane, 0700",
    workAddress: "29 Hillside Manor, Pretoria North, 0182"
  }
};
var initialParentProfiles = {
  "parent@kiddiestown.co.za": { ...initialParentProfile, email: "parent@kiddiestown.co.za" },
  "thabo.parent@mail.com": {
    name: "Lerato Junior",
    email: "thabo.parent@mail.com",
    phone: "+27 82 555 1234",
    address: "42 Jorissen Street, Polokwane",
    maritalStatus: "Single Parent",
    childLivesWith: "Mother",
    mother: {
      title: "Ms.",
      surname: "Junior",
      firstNames: "Lerato",
      idNumber: "8905150150082",
      occupation: "Business Analyst",
      employer: "Nedbank",
      telWork: "015 123 4567",
      telHome: "015 123 8899",
      cellNo: "082 555 1234",
      email: "thabo.parent@mail.com",
      homeAddress: "42 Jorissen Street, Polokwane",
      postalAddress: "P.O. Box 88, Polokwane",
      workAddress: "Polokwane"
    },
    father: {
      title: "Mr.",
      surname: "Junior",
      firstNames: "Thabo",
      idNumber: "8701120150083",
      occupation: "Unknown",
      employer: "Self",
      telWork: "",
      telHome: "",
      cellNo: "",
      email: "",
      homeAddress: "",
      postalAddress: "",
      workAddress: ""
    }
  },
  "amara.parent@mail.com": {
    name: "Sipho Khumalo",
    email: "amara.parent@mail.com",
    phone: "+27 83 777 9876",
    address: "15 Hospital Road, Polokwane",
    maritalStatus: "Married",
    childLivesWith: "Both Parents",
    mother: {
      title: "Mrs.",
      surname: "Khumalo",
      firstNames: "Amara",
      idNumber: "9007151345081",
      occupation: "Teacher",
      employer: "Dept of Education",
      telWork: "015 999 0001",
      telHome: "015 999 0002",
      cellNo: "083 111 2222",
      email: "amara.mother@mail.com",
      homeAddress: "15 Hospital Road, Polokwane",
      postalAddress: "P.O. Box 112, Polokwane",
      workAddress: "Polokwane High School"
    },
    father: {
      title: "Mr.",
      surname: "Khumalo",
      firstNames: "Sipho",
      idNumber: "8806201345082",
      occupation: "Structural Engineer",
      employer: "Khumalo & Sons",
      telWork: "015 999 3333",
      telHome: "015 999 0002",
      cellNo: "083 777 9876",
      email: "amara.parent@mail.com",
      homeAddress: "15 Hospital Road, Polokwane",
      postalAddress: "P.O. Box 112, Polokwane",
      workAddress: "Polokwane"
    }
  },
  "kabo.parent@mail.com": {
    name: "Lesego Molefe",
    email: "kabo.parent@mail.com",
    phone: "+27 72 444 5556",
    address: "88 Landros Mare Street, Polokwane",
    maritalStatus: "Married",
    childLivesWith: "Both Parents",
    mother: {
      title: "Mrs.",
      surname: "Molefe",
      firstNames: "Lesego",
      idNumber: "9108181234081",
      occupation: "Graphic Designer",
      employer: "Aether Studio",
      telWork: "015 555 4433",
      telHome: "015 555 1111",
      cellNo: "072 444 5556",
      email: "kabo.parent@mail.com",
      homeAddress: "88 Landros Mare Street, Polokwane",
      postalAddress: "P.O. Box 334, Polokwane",
      workAddress: "Polokwane"
    },
    father: {
      title: "Mr.",
      surname: "Molefe",
      firstNames: "Kabo",
      idNumber: "8912121234082",
      occupation: "IT Technician",
      employer: "SITA",
      telWork: "015 555 2222",
      telHome: "015 555 1111",
      cellNo: "071 333 4444",
      email: "kabo.father@mail.com",
      homeAddress: "88 Landros Mare Street, Polokwane",
      postalAddress: "P.O. Box 334, Polokwane",
      workAddress: "SITA Office"
    }
  },
  "smith.parent@mail.com": {
    name: "John Smith",
    email: "smith.parent@mail.com",
    phone: "+27 84 333 2221",
    address: "14 Gemini Avenue, Polokwane",
    maritalStatus: "Married",
    childLivesWith: "Both Parents",
    mother: {
      title: "Mrs.",
      surname: "Smith",
      firstNames: "Sarah",
      idNumber: "9109021234082",
      occupation: "Accountant",
      employer: "PwC",
      telWork: "015 444 5555",
      telHome: "015 444 1111",
      cellNo: "084 123 4567",
      email: "smith.mother@mail.com",
      homeAddress: "14 Gemini Avenue, Polokwane",
      postalAddress: "P.O. Box 11, Polokwane",
      workAddress: "PwC Office"
    },
    father: {
      title: "Mr.",
      surname: "Smith",
      firstNames: "John",
      idNumber: "8904021234083",
      occupation: "Pharmacist",
      employer: "Dis-Chem",
      telWork: "015 444 2222",
      telHome: "015 444 1111",
      cellNo: "084 333 2221",
      email: "smith.parent@mail.com",
      homeAddress: "14 Gemini Avenue, Polokwane",
      postalAddress: "P.O. Box 11, Polokwane",
      workAddress: "Dis-Chem Polokwane"
    }
  },
  "david.parent@mail.com": {
    name: "Mary Jones",
    email: "david.parent@mail.com",
    phone: "+27 82 999 8888",
    address: "25 Grobler Street, Polokwane",
    maritalStatus: "Single Parent",
    childLivesWith: "Mother",
    mother: {
      title: "Ms.",
      surname: "Jones",
      firstNames: "Mary",
      idNumber: "9004101234083",
      occupation: "Real Estate Agent",
      employer: "Pam Golding",
      telWork: "015 333 4444",
      telHome: "015 333 5555",
      cellNo: "082 999 8888",
      email: "david.parent@mail.com",
      homeAddress: "25 Grobler Street, Polokwane",
      postalAddress: "P.O. Box 99, Polokwane",
      workAddress: "Pam Golding Polokwane"
    },
    father: {
      title: "Mr.",
      surname: "Jones",
      firstNames: "David",
      idNumber: "8803101234084",
      occupation: "Unknown",
      employer: "Self",
      telWork: "",
      telHome: "",
      cellNo: "",
      email: "",
      homeAddress: "",
      postalAddress: "",
      workAddress: ""
    }
  }
};
var initialProgressReports = [
  {
    id: "report-term1",
    learnerId: "student-jake",
    academicYear: (/* @__PURE__ */ new Date()).getFullYear(),
    term: 1,
    released: true,
    releasedDate: `${(/* @__PURE__ */ new Date()).getFullYear()}-03-24`,
    recordedDaysAbsent: 1,
    indicators: {
      classroomBehavior: { A1_controlAndSafe: "A", A2_bathroomIndependent: "A" },
      communicationSkills: { B1_speaksClearly: "A" },
      readingWritingSkills: { C1_recognizesLetters: "D" },
      numbersMathArithmetic: { D1_countsRecognizes: "A" },
      musicArtSkills: { E1_dancesMusicSings: "A" },
      socialEmotionalSkills: { F1_sharesAndPlays: "A" },
      coloursAndShapes: { G1_colorsShapes: "A" },
      fineMotorSkills: {
        H1_pencilCrayonScissors: "D",
        H2_blocksPuzzles: "A",
        H3_bounceKickThrow: "A",
        H4_buttonsShoesClothes: "D"
      },
      approachesToLearn: { I1_enjoysLearning: "A" },
      computerSkills: { J1_tabletLaptopVoice: "A" }
    },
    shortSummary: "K1",
    teacherComments: "Jake had an outstanding first term! He adapts very well to group classroom dynamics and loves active play. He demonstrates strong mathematical indicators and loves counting.",
    teacherName: "Teacher Anne",
    principalName: "Mrs. Shineon"
  },
  {
    id: "report-term2",
    learnerId: "student-jake",
    academicYear: (/* @__PURE__ */ new Date()).getFullYear(),
    term: 2,
    released: true,
    releasedDate: `${(/* @__PURE__ */ new Date()).getFullYear()}-06-22`,
    recordedDaysAbsent: 0,
    indicators: {
      classroomBehavior: { A1_controlAndSafe: "A", A2_bathroomIndependent: "A" },
      communicationSkills: { B1_speaksClearly: "A" },
      readingWritingSkills: { C1_recognizesLetters: "A" },
      numbersMathArithmetic: { D1_countsRecognizes: "A" },
      musicArtSkills: { E1_dancesMusicSings: "A" },
      socialEmotionalSkills: { F1_sharesAndPlays: "A" },
      coloursAndShapes: { G1_colorsShapes: "A" },
      fineMotorSkills: {
        H1_pencilCrayonScissors: "A",
        H2_blocksPuzzles: "A",
        H3_bounceKickThrow: "A",
        H4_buttonsShoesClothes: "D"
      },
      approachesToLearn: { I1_enjoysLearning: "A" },
      computerSkills: { J1_tabletLaptopVoice: "A" }
    },
    shortSummary: "K4",
    teacherComments: "An exceptional second term for Jake! His reading and spelling skills have improved enormously. He is very kind to his peers and is a pleasure to have in the class.",
    teacherName: "Teacher Anne",
    principalName: "Mrs. Shineon"
  },
  {
    id: "report-jill-term1",
    learnerId: "student-jill",
    academicYear: (/* @__PURE__ */ new Date()).getFullYear(),
    term: 1,
    released: true,
    releasedDate: `${(/* @__PURE__ */ new Date()).getFullYear()}-03-24`,
    recordedDaysAbsent: 0,
    indicators: {
      classroomBehavior: { A1_controlAndSafe: "A", A2_bathroomIndependent: "A" },
      communicationSkills: { B1_speaksClearly: "A" },
      readingWritingSkills: { C1_recognizesLetters: "A" },
      numbersMathArithmetic: { D1_countsRecognizes: "A" },
      musicArtSkills: { E1_dancesMusicSings: "A" },
      socialEmotionalSkills: { F1_sharesAndPlays: "A" },
      coloursAndShapes: { G1_colorsShapes: "A" },
      fineMotorSkills: {
        H1_pencilCrayonScissors: "A",
        H2_blocksPuzzles: "A",
        H3_bounceKickThrow: "A",
        H4_buttonsShoesClothes: "A"
      },
      approachesToLearn: { I1_enjoysLearning: "A" },
      computerSkills: { J1_tabletLaptopVoice: "A" }
    },
    shortSummary: "K3",
    teacherComments: "Jill had an incredible first term in the toddler group! She behaves beautifully, handles all toys safely, and is very respectful towards staff and fellow learners. She is a total joy.",
    teacherName: "Teacher Anne",
    principalName: "Mrs. Shineon"
  }
];
var initialPaymentHistory = [
  {
    id: "pay-5",
    description: `Monthly Fees / October Aftercare - Jake Mbeki`,
    date: `${(/* @__PURE__ */ new Date()).getFullYear()}-10-01`,
    amount: 2500,
    status: "In Arrears",
    learnerId: "student-jake"
  },
  {
    id: "pay-4",
    description: "Monthly Fees / September - Jake Mbeki",
    date: `${(/* @__PURE__ */ new Date()).getFullYear()}-09-01`,
    amount: 2500,
    status: "Paid",
    receiptNo: `REC-${(/* @__PURE__ */ new Date()).getFullYear()}09-0021`,
    learnerId: "student-jake"
  },
  {
    id: "pay-3",
    description: "Monthly Fees / August - Jill Mbeki",
    date: `${(/* @__PURE__ */ new Date()).getFullYear()}-08-01`,
    amount: 2500,
    status: "Paid",
    receiptNo: `REC-${(/* @__PURE__ */ new Date()).getFullYear()}08-1112`,
    learnerId: "student-jill"
  }
];
var initialChatHistory = [
  {
    id: "char-1",
    sender: "Teacher",
    senderName: "Teacher Anne",
    text: "Jake and Jill are both doing incredible in class today! Jake completed his counting exercises with 100% accuracy and Jill was exceptionally creative in her finger-painting session.",
    timestamp: "11:14 AM"
  },
  {
    id: "char-2",
    sender: "Parent",
    senderName: "Sarah Mbeki",
    text: "That is wonderful to hear, Anne! Thank you so much for the update. Do they need any emergency clothing items packed for Friday?",
    timestamp: "11:20 AM"
  },
  {
    id: "char-3",
    sender: "Teacher",
    senderName: "Teacher Anne",
    text: "Yes, please pack a light change of clothes and water bottles for both of them. We are doing mud finger-painting on Friday morning!",
    timestamp: "11:25 AM"
  }
];
var initialWeeklyThemes = [
  {
    weekNo: 1,
    title: "Welcome to Kiddies Town & Daily Routines",
    description: "Introducing young learners to the classroom, playground safety, and the daily school schedule at 7 Grimm Street. Emphasizing hygiene (toilet routine) and social interaction.",
    activities: [
      "Daily Programme walking tour",
      "Meet your classroom peers (Roses, Giraffes, Tigers)",
      "Classroom safety rules puppet show",
      "Proper hand washing with bubbles"
    ]
  },
  {
    weekNo: 2,
    title: "Primary Colors, Shapes & Toy Block Magic",
    description: "Aligning with our Kiddies Town primary brand colors (red, green, blue, yellow balloons). Learners master basic geometry, sorting blocks, and finger science.",
    activities: [
      "Messy finger painting with primary colors",
      "Triangles and circles block stacking",
      "Colored water drops mix-matching experiment",
      "Giant geometric puzzle completion"
    ]
  },
  {
    weekNo: 3,
    title: "My Wonderful Family & Home Languages",
    description: "Celebrating diversity in Polokwane! Learners share stories of Mrs./Mr. parent roles, occupations, and home patterns in English, Sesotho, isiZulu, and Setswana.",
    activities: [
      "Moms & Dads drawing frame",
      "My favorite home phrase in Sesotho or isiZulu",
      "Occupations roleplaying (teacher, software consultant, banker)",
      "Grandparents storytelling circle"
    ]
  },
  {
    weekNo: 4,
    title: "Safari Adventures: Giraffes, Tigers & Roses",
    description: "Inspired by our class names! Active studies on wild animals of Limpopo, identifying sounds, footprint markings in the sandbox, and sensory touch.",
    activities: [
      "Mock dinosaur bones sandbox hunt",
      "Paper plate lion head crafting with woolly manes",
      "Learning why tall giraffes reach tree-top leaves",
      "Safari animal footsteps muddy prints matching"
    ]
  },
  {
    weekNo: 5,
    title: "Healthy Bodies, Active Sports & Oral Hygiene",
    description: "Teaches clean habits, healthy fruits vs sweets, and physical activities on the outdoor soccer pitch to develop fine and gross motor indicators.",
    activities: [
      "Tooth brushing mock drills on cardboard faces",
      "Ster Park playground soccer mini friendly",
      "Vitamins sorting (apples vs sweet candies)",
      "Jungle-gym coordination balance race"
    ]
  }
];
var YEAR = (/* @__PURE__ */ new Date()).getFullYear();
var initialSchoolEvents = [
  {
    id: "event-1",
    title: "Year End Photo Day",
    date: `${YEAR}-07-31`,
    time: "08:30 AM",
    category: "Event",
    description: "Please ensure children wear full school uniform for the individual and class photographs.",
    rsvps: [
      { parentName: "Sarah Mbeki", count: 1, status: "Yes" },
      { parentName: "Zanele Ndlovu", count: 1, status: "Yes" }
    ]
  },
  {
    id: "event-2",
    title: "Soccer Extra-Mural Friendly",
    date: `${YEAR}-08-12`,
    time: "14:00 PM",
    category: "Extra-mural",
    description: "Friendly match with Bluebird Academy. Parents are welcome to attend and cheer and offer support.",
    rsvps: [
      { parentName: "Sarah Mbeki", count: 2, status: "Yes" }
    ]
  },
  {
    id: "event-3",
    title: "Music Lesson & Recorder Day",
    date: `${YEAR}-09-04`,
    time: "09:00 AM",
    category: "Incursion",
    description: "Special visiting multi-instrumentalist will show flutes, drums, and kids play standard triangles.",
    rsvps: []
  },
  {
    id: "event-4",
    title: `Graduation Ceremony ${YEAR}`,
    date: `${YEAR}-11-15`,
    time: "10:00 AM",
    category: "Event",
    description: "A grand celebration for our 5-year old Tigers graduating to Grade 1. All families invited.",
    rsvps: []
  }
];
var initialJournalPosts = [
  {
    id: "journal-1",
    date: `19 Oct ${YEAR}`,
    title: "Creative Arts: Finger Painting",
    description: "Leo explored colors today using his fingers to create a beautiful savanna landscape with abstract trees.",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    postedBy: "Teacher Anne"
  },
  {
    id: "journal-2",
    date: `15 Oct ${YEAR}`,
    title: "Fine Motor: Block Building Castle",
    description: "Active blocks work. The Tigers class worked together to build a grand castle with towers and drawbridges! Teamwork was beautiful.",
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    postedBy: "Teacher Anne"
  },
  {
    id: "journal-3",
    date: `12 Oct ${YEAR}`,
    title: "Science Exploration: Dinosaur Hunt",
    description: "Kids searched in the sandbox sandbox utilizing brushes to uncover hidden bone replicas and dinosaur eggs!",
    imageUrl: "https://images.unsplash.com/photo-1505673542670-a5e3ff5b14a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    postedBy: "Teacher Anne"
  }
];
var initialEnrolments = [];

// server/config/database.ts
var STORE_FILE = path.join(process.cwd(), "data_store.json");
var isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
var sqlConnection = null;
var usingNeon = false;
var fallbackStore;
var seedUsers = [
  { id: "parent@kiddiestown.co.za", email: "parent@kiddiestown.co.za", password: "parent", role: "parent", name: "Sarah Mbeki" },
  { id: "teacher@kiddiestown.co.za", email: "teacher@kiddiestown.co.za", password: "teacher", role: "teacher", name: "Teacher Anne" },
  { id: "admin@kiddiestown.co.za", email: "admin@kiddiestown.co.za", password: "admin", role: "admin", name: "Shineon M." }
];
function createSeededStore() {
  return {
    learners: [...initialLearners],
    parentProfile: { ...initialParentProfile, email: "parent@kiddiestown.co.za" },
    parentProfiles: { ...initialParentProfiles },
    progressReports: [...initialProgressReports],
    paymentHistory: initialPaymentHistory.map((p) => {
      const matching = initialLearners.find((l) => l.id === p.learnerId);
      return { ...p, parentEmail: matching?.parentEmail || "parent@kiddiestown.co.za" };
    }),
    chatHistory: initialChatHistory.map((c) => ({
      ...c,
      parentEmail: "parent@kiddiestown.co.za"
    })),
    themes: [...initialWeeklyThemes],
    events: [...initialSchoolEvents],
    journalPosts: [...initialJournalPosts],
    enrolments: [...initialEnrolments],
    users: [...seedUsers],
    auditLogs: []
  };
}
function loadFallbackStore() {
  if (!isServerless && fs.existsSync(STORE_FILE)) {
    try {
      const content = fs.readFileSync(STORE_FILE, "utf8");
      return JSON.parse(content);
    } catch (e) {
      logger_default.error({ error: e }, "Failed to parse data_store.json, creating seeded store");
    }
  }
  const store = createSeededStore();
  if (!isServerless) {
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
      logger_default.info("\u{1F331} Created data_store.json with initial seed data");
    } catch {
    }
  }
  return store;
}
function normalizeUserPasswords(store) {
  let changed = false;
  for (const user of store.users ?? []) {
    if (!isBcryptHash(user.password)) {
      user.password = hashPasswordSync(String(user.password ?? ""));
      changed = true;
    }
  }
  return changed;
}
function initializeDatabase(databaseUrl) {
  fallbackStore = loadFallbackStore();
  if (normalizeUserPasswords(fallbackStore)) {
    logger_default.info("\u{1F510} Upgraded stored plaintext credentials to bcrypt hashes");
    saveFallbackStore();
  }
  if (databaseUrl) {
    try {
      sqlConnection = neon(databaseUrl);
      usingNeon = true;
      logger_default.info("\u26A1 Neon Database connection initialized");
    } catch (err) {
      logger_default.error({ error: err }, "\u274C Failed to initialize Neon client");
      usingNeon = false;
    }
  } else {
    logger_default.warn("\u26A0\uFE0F No DATABASE_URL found. Running in local JSON file mode.");
  }
}
function isNeonActive() {
  return usingNeon;
}
function setNeonInactive() {
  usingNeon = false;
}
function getSqlConnection() {
  return sqlConnection;
}
function getFallbackStore() {
  return fallbackStore;
}
function saveFallbackStore() {
  if (isServerless) return;
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(fallbackStore, null, 2), "utf8");
  } catch (e) {
    logger_default.error({ error: e }, "Failed to write to data_store.json");
  }
}
async function dbQuery(neonFn, fallbackFn) {
  if (usingNeon && sqlConnection) {
    try {
      const result2 = await neonFn(sqlConnection);
      return { result: result2, source: "neon" };
    } catch (err) {
      logger_default.error({ error: err }, "Neon query failed, falling back to local store");
    }
  }
  const result = fallbackFn(fallbackStore);
  return { result, source: "fallback" };
}
function rowToEntity(row, mappings) {
  const entity = {};
  for (const [key, value] of Object.entries(row)) {
    const tsProp = mappings[key] || key;
    entity[tsProp] = value;
  }
  return entity;
}
var MAPPINGS = {
  users: { password_hash: "password", created_at: "createdAt" },
  learners: { first_names: "firstNames", preferred_name: "preferredName", id_number: "idNumber", home_language: "homeLanguage", grade_this_year: "gradeThisYear", school_attending: "schoolAttending", previous_school: "previousSchool", class_type: "classType", attendance_status: "attendanceStatus", arrived_time: "arrivedTime", parent_email: "parentEmail", enrolment_approved: "enrolmentApproved", transport_needed: "transportNeeded", transport_route_id: "transportRouteId", transport_route_name: "transportRouteName" },
  parentProfile: { marital_status: "maritalStatus", child_lives_with: "childLivesWith" },
  reports: { learner_id: "learnerId", academic_year: "academicYear", released_date: "releasedDate", recorded_days_absent: "recordedDaysAbsent", short_summary: "shortSummary", teacher_comments: "teacherComments", teacher_name: "teacherName", principal_name: "principalName" },
  payments: { receipt_no: "receiptNo", parent_email: "parentEmail", learner_id: "learnerId" },
  chats: { sender_name: "senderName", parent_email: "parentEmail" },
  themes: { week_no: "weekNo" },
  events: {},
  journal: { image_url: "imageUrl", posted_by: "postedBy" },
  enrolments: { child_particulars: "childParticulars", parent_particulars: "parentParticulars", medical_profile: "medicalProfile", transport_details: "transportDetails", uploaded_files: "uploadedFiles", date_applied: "dateApplied" },
  auditLogs: { user_email: "userEmail" }
};
function entityToRow(entity, mappings) {
  const row = {};
  const reverseMappings = {};
  for (const [dbCol, tsProp] of Object.entries(mappings)) {
    reverseMappings[tsProp] = dbCol;
  }
  for (const [key, value] of Object.entries(entity)) {
    const dbCol = reverseMappings[key] || key;
    row[dbCol] = typeof value === "object" && value !== null ? JSON.stringify(value) : value;
  }
  return row;
}

// server/middleware/auth.ts
import jwt from "jsonwebtoken";

// server/config/environment.ts
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();
var isDev = (process.env.NODE_ENV || "development") !== "production";
var DEV_SECRET = "dev-only-secret-do-not-use-in-production-min32chars";
var envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3e3),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: isDev ? z.string().min(32).default(DEV_SECRET) : z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: isDev ? z.string().min(32).default(DEV_SECRET + "-refresh") : z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  GEMINI_API_KEY: z.string().optional(),
  APP_URL: z.string().optional()
});
function validateEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map(
      (issue) => `  ${issue.path.join(".")}: ${issue.message}`
    );
    console.error("\u274C Invalid environment variables:\n" + missing.join("\n"));
    console.error("\nCopy .env.example to .env and fill in the required values.");
    process.exit(1);
  }
  return parsed.data;
}
var env = validateEnv();

// server/utils/errors.ts
var AppError = class extends Error {
  constructor(message, statusCode, code = "INTERNAL_ERROR", isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
};
var ValidationError = class extends AppError {
  constructor(errors) {
    super("Validation failed", 400, "VALIDATION_ERROR");
    this.errors = errors;
  }
};
var UnauthorizedError = class extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
  }
};
var ForbiddenError = class extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, "FORBIDDEN");
  }
};

// server/middleware/auth.ts
var ACCESS_TOKEN_EXPIRY = "2h";
var REFRESH_TOKEN_EXPIRY = "30d";
function generateAccessToken(payload) {
  return jwt.sign(
    { email: payload.email, role: payload.role, name: payload.name, type: "access" },
    env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY, issuer: "kiddies-town", algorithm: "HS256" }
  );
}
function generateRefreshToken(payload) {
  return jwt.sign(
    { email: payload.email, role: payload.role, name: payload.name, type: "refresh" },
    env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY, issuer: "kiddies-town", algorithm: "HS256" }
  );
}
function verifyAccessToken(token) {
  const decoded = jwt.verify(token, env.JWT_SECRET, {
    issuer: "kiddies-town",
    algorithms: ["HS256"]
  });
  if (decoded.type !== "access") {
    throw new UnauthorizedError("Invalid token type");
  }
  return { email: decoded.email, role: decoded.role, name: decoded.name };
}
function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET, {
    issuer: "kiddies-town",
    algorithms: ["HS256"]
  });
  if (decoded.type !== "refresh") {
    throw new UnauthorizedError("Invalid token type");
  }
  return { email: decoded.email, role: decoded.role, name: decoded.name };
}
function requireAuth(allowGuest = false) {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : void 0;
    if (!token) {
      if (allowGuest) {
        req.user = {
          email: "guest@kiddiestown.co.za",
          role: "guest",
          name: "Guest User"
        };
        return next();
      }
      throw new UnauthorizedError("Access denied: authentication token is required");
    }
    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Session expired. Please log in again.");
      }
      if (err instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Invalid authentication token.");
      }
      throw err;
    }
  };
}

// server/middleware/auditLog.ts
var AUDIT_TABLE = "kt_audit_logs";
async function createAuditLog(operatorId, actionType, payload, ipAddress) {
  const logEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1e4)}`,
    operatorId,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    actionType,
    payload,
    ipAddress
  };
  try {
    await dbQuery(
      async (sql) => {
        await sql`INSERT INTO ${sql(AUDIT_TABLE)} (id, user_email, action, payload, timestamp) VALUES (${logEntry.id}, ${logEntry.operatorId}, ${logEntry.actionType}, ${JSON.stringify(logEntry.payload)}, ${logEntry.timestamp})`;
      },
      (store) => {
        store.auditLogs.unshift(logEntry);
      }
    );
  } catch (err) {
    logger_default.error({ error: err, logEntry }, "Failed to write audit log");
  }
}

// server/db/schema.ts
import { pgTable, varchar, text, integer, boolean, timestamp, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
var roleEnum = pgEnum("role", ["parent", "teacher", "admin"]);
var genderEnum = pgEnum("gender", ["Male", "Female"]);
var classTypeEnum = pgEnum("class_type", ["Roses", "Giraffes", "Tigers"]);
var attendanceStatusEnum = pgEnum("attendance_status", ["Present", "Absent", "Excused", "Pending"]);
var paymentStatusEnum = pgEnum("payment_status", ["Paid", "Unpaid", "In Arrears", "Pending Verification"]);
var senderEnum = pgEnum("sender", ["Teacher", "Parent", "Admin"]);
var eventCategoryEnum = pgEnum("event_category", ["Event", "Extra-mural", "Holiday", "Incursion"]);
var enrolmentStatusEnum = pgEnum("enrolment_status", ["In Review", "Pending Approval", "Approved", "Rejected"]);
var ktUsers = pgTable("kt_users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  passwordHash: text("password_hash"),
  role: roleEnum("role"),
  name: varchar("name"),
  createdAt: timestamp("created_at").defaultNow()
});
var ktLearners = pgTable("kt_learners", {
  id: varchar("id").primaryKey(),
  surname: varchar("surname"),
  firstNames: varchar("first_names"),
  preferredName: varchar("preferred_name"),
  dob: varchar("dob"),
  idNumber: varchar("id_number"),
  gender: genderEnum("gender"),
  homeLanguage: varchar("home_language"),
  religion: varchar("religion"),
  gradeThisYear: varchar("grade_this_year"),
  schoolAttending: varchar("school_attending"),
  previousSchool: varchar("previous_school"),
  classType: classTypeEnum("class_type"),
  attendanceStatus: attendanceStatusEnum("attendance_status"),
  arrivedTime: varchar("arrived_time"),
  parentEmail: varchar("parent_email"),
  enrolmentApproved: boolean("enrolment_approved"),
  transportNeeded: boolean("transport_needed"),
  transportRouteId: varchar("transport_route_id"),
  transportRouteName: varchar("transport_route_name")
}, (table) => {
  return {
    parentEmailIdx: index("idx_learners_parent_email").on(table.parentEmail),
    classTypeIdx: index("idx_learners_class_type").on(table.classType)
  };
});
var ktParentProfile = pgTable("kt_parent_profile", {
  id: varchar("id").primaryKey(),
  email: varchar("email"),
  name: varchar("name"),
  phone: varchar("phone"),
  address: text("address"),
  maritalStatus: varchar("marital_status"),
  childLivesWith: varchar("child_lives_with"),
  mother: jsonb("mother"),
  father: jsonb("father")
}, (table) => {
  return {
    emailIdx: index("idx_parent_profile_email").on(table.email)
  };
});
var ktProgressReports = pgTable("kt_progress_reports", {
  id: varchar("id").primaryKey(),
  learnerId: varchar("learner_id"),
  academicYear: integer("academic_year"),
  term: integer("term"),
  released: boolean("released"),
  releasedDate: varchar("released_date"),
  daysAbsent: integer("days_absent"),
  indicators: jsonb("indicators"),
  shortSummary: varchar("short_summary"),
  teacherComments: text("teacher_comments"),
  teacherName: varchar("teacher_name"),
  principalName: varchar("principal_name")
}, (table) => {
  return {
    learnerIdIdx: index("idx_progress_reports_learner_id").on(table.learnerId)
  };
});
var ktPayments = pgTable("kt_payments", {
  id: varchar("id").primaryKey(),
  description: text("description"),
  date: varchar("date"),
  amount: integer("amount"),
  status: paymentStatusEnum("status"),
  receiptNo: varchar("receipt_no"),
  parentEmail: varchar("parent_email"),
  learnerId: varchar("learner_id")
}, (table) => {
  return {
    parentEmailIdx: index("idx_payments_parent_email").on(table.parentEmail),
    learnerIdIdx: index("idx_payments_learner_id").on(table.learnerId),
    statusIdx: index("idx_payments_status").on(table.status)
  };
});
var ktChats = pgTable("kt_chats", {
  id: varchar("id").primaryKey(),
  sender: senderEnum("sender"),
  senderName: varchar("sender_name"),
  text: text("text"),
  timestamp: varchar("timestamp"),
  parentEmail: varchar("parent_email")
}, (table) => {
  return {
    parentEmailIdx: index("idx_chats_parent_email").on(table.parentEmail)
  };
});
var ktWeeklyThemes = pgTable("kt_weekly_themes", {
  weekNo: integer("week_no").primaryKey(),
  title: varchar("title"),
  description: text("description"),
  activities: jsonb("activities")
});
var ktSchoolEvents = pgTable("kt_school_events", {
  id: varchar("id").primaryKey(),
  title: varchar("title"),
  date: varchar("date"),
  time: varchar("time"),
  category: eventCategoryEnum("category"),
  description: text("description"),
  rsvps: jsonb("rsvps")
}, (table) => {
  return {
    dateIdx: index("idx_school_events_date").on(table.date)
  };
});
var ktJournalPosts = pgTable("kt_journal_posts", {
  id: varchar("id").primaryKey(),
  date: varchar("date"),
  title: varchar("title"),
  description: text("description"),
  imageUrl: text("image_url"),
  postedBy: varchar("posted_by")
}, (table) => {
  return {
    dateIdx: index("idx_journal_posts_date").on(table.date)
  };
});
var ktEnrolments = pgTable("kt_enrolments", {
  id: varchar("id").primaryKey(),
  childParticulars: jsonb("child_particulars"),
  parentParticulars: jsonb("parent_particulars"),
  medicalProfile: jsonb("medical_profile"),
  transportDetails: jsonb("transport_details"),
  consents: jsonb("consents"),
  uploadedFiles: jsonb("uploaded_files"),
  step: integer("step"),
  status: enrolmentStatusEnum("status"),
  dateApplied: varchar("date_applied")
}, (table) => {
  return {
    statusIdx: index("idx_enrolments_status").on(table.status)
  };
});
var ktAuditLogs = pgTable("kt_audit_logs", {
  id: varchar("id").primaryKey(),
  userEmail: varchar("user_email"),
  action: varchar("action"),
  payload: jsonb("payload"),
  timestamp: varchar("timestamp")
}, (table) => {
  return {
    userEmailIdx: index("idx_audit_logs_user_email").on(table.userEmail)
  };
});

// server/db/tables.ts
var TABLES = {
  learners: "kt_learners",
  parentProfile: "kt_parent_profile",
  reports: "kt_progress_reports",
  payments: "kt_payments",
  chats: "kt_chats",
  themes: "kt_weekly_themes",
  events: "kt_school_events",
  journal: "kt_journal_posts",
  enrolments: "kt_enrolments",
  registers: "kt_registers",
  users: "kt_users",
  auditLogs: "kt_audit_logs"
};

// server/controllers/auth.controller.ts
async function signup(req, res) {
  const { email, password, role, name } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  const { result: userExists } = await dbQuery(
    async (sql) => {
      const results = await sql.query(`SELECT * FROM ${TABLES.users} WHERE id = $1`, [normalizedEmail]);
      return results && results.length > 0;
    },
    (store) => store.users.some((u) => u.id === normalizedEmail)
  );
  if (userExists) {
    res.status(400).json({ success: false, error: "An account with this email/Academic ID already exists." });
    return;
  }
  const hashedPassword = await hashPassword(password);
  const newUser = { id: normalizedEmail, email: normalizedEmail, password: hashedPassword, role, name };
  const { source } = await dbQuery(
    async (sql) => {
      await sql.query(
        `INSERT INTO ${TABLES.users} (id, email, password_hash, role, name) VALUES ($1, $2, $3, $4, $5)`,
        [normalizedEmail, newUser.email, newUser.password, newUser.role, newUser.name]
      );
      return true;
    },
    (store) => {
      store.users.push(newUser);
      saveFallbackStore();
      return true;
    }
  );
  if (role === "parent") {
    const parentLastName = name.includes(" ") ? name.split(" ").slice(-1)[0] : "Mbeki";
    const parentFirstName = name.includes(" ") ? name.split(" ")[0] : name;
    const sampleParentProfile = {
      name,
      email: normalizedEmail,
      phone: "+27 82 " + Math.floor(1e6 + Math.random() * 9e6),
      address: "12 Pioneer Street, Ster Park, Polokwane",
      maritalStatus: "Married",
      childLivesWith: "Both Parents",
      mother: {
        title: "Mrs.",
        surname: parentLastName,
        firstNames: parentFirstName,
        idNumber: "8804100012081",
        occupation: "Manager",
        employer: "Local Corporate",
        telWork: "015 291 0000",
        telHome: "015 291 4455",
        cellNo: "082 123 4567",
        email: normalizedEmail,
        homeAddress: "12 Pioneer Street, Ster Park, Polokwane",
        postalAddress: "P.O. Box 1024, Polokwane",
        workAddress: "Polokwane Central"
      },
      father: {
        title: "Mr.",
        surname: parentLastName,
        firstNames: "Thabo",
        idNumber: "8602120012085",
        occupation: "Consultant",
        employer: "FTech",
        telWork: "015 291 1122",
        telHome: "015 291 4455",
        cellNo: "081 223 3445",
        email: "father@mail.com",
        homeAddress: "12 Pioneer Street, Ster Park, Polokwane",
        postalAddress: "P.O. Box 1024, Polokwane",
        workAddress: "Polokwane Business District"
      }
    };
    await dbQuery(
      async (sql) => {
        await sql.query(
          `INSERT INTO ${TABLES.parentProfile} (id, email, name, phone, address, marital_status, child_lives_with, mother, father) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            normalizedEmail,
            sampleParentProfile.email,
            sampleParentProfile.name,
            sampleParentProfile.phone,
            sampleParentProfile.address,
            sampleParentProfile.maritalStatus,
            sampleParentProfile.childLivesWith,
            JSON.stringify(sampleParentProfile.mother),
            JSON.stringify(sampleParentProfile.father)
          ]
        );
      },
      (store) => {
        if (!store.parentProfiles) store.parentProfiles = {};
        store.parentProfiles[normalizedEmail] = sampleParentProfile;
        saveFallbackStore();
      }
    );
  }
  const userPayload = { email: normalizedEmail, role, name };
  const accessToken = generateAccessToken(userPayload);
  const refreshToken2 = generateRefreshToken(userPayload);
  res.json({
    success: true,
    user: { role, name, email: normalizedEmail },
    token: accessToken,
    accessToken,
    refreshToken: refreshToken2
  });
}
async function login(req, res) {
  const { email, password, role } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  const { result: foundUser } = await dbQuery(
    async (sql) => {
      const results = await sql.query(`SELECT * FROM ${TABLES.users} WHERE id = $1`, [normalizedEmail]);
      if (results && results.length > 0) {
        const u = rowToEntity(results[0], MAPPINGS.users);
        if (u.role === role) {
          return u;
        }
      }
      return null;
    },
    (store) => {
      const u = store.users.find((usr) => usr.id === normalizedEmail);
      if (u && u.role === role) {
        return u;
      }
      return null;
    }
  );
  const isValidPassword = foundUser ? await comparePassword(password, foundUser.password ?? "") : false;
  if (foundUser && isValidPassword) {
    const userPayload = { email: foundUser.email, role: foundUser.role, name: foundUser.name };
    const accessToken = generateAccessToken(userPayload);
    const refreshToken2 = generateRefreshToken(userPayload);
    res.json({
      success: true,
      user: {
        role: foundUser.role,
        name: foundUser.name,
        email: foundUser.email
      },
      token: accessToken,
      accessToken,
      refreshToken: refreshToken2
    });
  } else {
    res.status(401).json({
      success: false,
      error: "Access Denied: The credentials do not match the selected school profile."
    });
  }
}
async function refreshToken(req, res) {
  const { refreshToken: token } = req.body;
  try {
    const decoded = verifyRefreshToken(token);
    const accessToken = generateAccessToken(decoded);
    res.json({
      success: true,
      accessToken
    });
  } catch {
    res.status(401).json({
      success: false,
      error: "Invalid or expired refresh token. Please log in again."
    });
  }
}
async function changePassword(req, res) {
  const authReq = req;
  const email = authReq.user.email.toLowerCase().trim();
  const { currentPassword, newPassword } = req.body;
  const { result: storedHash } = await dbQuery(
    async (sql) => {
      const results = await sql.query(`SELECT password_hash FROM ${TABLES.users} WHERE id = $1`, [email]);
      return results && results.length > 0 ? results[0].password_hash : null;
    },
    (store) => {
      const u = store.users.find((usr) => usr.id === email);
      return u ? u.password : null;
    }
  );
  if (!storedHash || !await comparePassword(currentPassword, storedHash)) {
    res.status(401).json({ success: false, error: "The current password you entered is incorrect." });
    return;
  }
  if (await comparePassword(newPassword, storedHash)) {
    res.status(409).json({ success: false, error: "The new password must be different from the current password." });
    return;
  }
  const hashedPassword = await hashPassword(newPassword);
  await dbQuery(
    async (sql) => {
      await sql.query(`UPDATE ${TABLES.users} SET password_hash = $1 WHERE id = $2`, [hashedPassword, email]);
      return true;
    },
    (store) => {
      const u = store.users.find((usr) => usr.id === email);
      if (u) u.password = hashedPassword;
      saveFallbackStore();
      return true;
    }
  );
  await createAuditLog(email, "PASSWORD_CHANGE", { email }, req.ip);
  logger_default.info({ email }, "User changed their own password");
  res.json({ success: true, message: "Your password has been updated successfully." });
}

// server/middleware/validate.ts
import { ZodError } from "zod";
function validate(schema, source = "body") {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue.code
        }));
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors
        });
        return;
      }
      next(err);
    }
  };
}

// server/middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";
var generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please try again later."
  }
});
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many authentication attempts. Please try again in 15 minutes."
  }
});
var apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: "API rate limit exceeded. Please try again later."
  }
});

// server/schemas/auth.schemas.ts
import { z as z2 } from "zod";
var signupSchema = z2.object({
  email: z2.string().email("Invalid email address").transform((v) => v.toLowerCase().trim()),
  password: z2.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number"),
  role: z2.enum(["parent", "teacher", "admin"]),
  name: z2.string().min(2, "Name must be at least 2 characters").max(100)
});
var loginSchema = z2.object({
  email: z2.string().email("Invalid email address").transform((v) => v.toLowerCase().trim()),
  password: z2.string().min(1, "Password is required"),
  role: z2.enum(["parent", "teacher", "admin"])
});
var refreshTokenSchema = z2.object({
  refreshToken: z2.string().min(1, "Refresh token is required")
});
var strongPassword = z2.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number");
var changePasswordSchema = z2.object({
  currentPassword: z2.string().min(1, "Current password is required"),
  newPassword: strongPassword
});

// server/routes/v1/auth.routes.ts
var router = Router();
router.post("/signup", authLimiter, validate(signupSchema), signup);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh-token", validate(refreshTokenSchema), refreshToken);
router.post("/change-password", requireAuth(), validate(changePasswordSchema), changePassword);
var auth_routes_default = router;

// server/routes/v1/data.routes.ts
import { Router as Router2 } from "express";

// server/controllers/data.controller.ts
async function getAllData(req, res) {
  const authReq = req;
  const userEmail = authReq.user.email.toLowerCase().trim();
  const userRole = authReq.user.role;
  const sendWithEtag = (payload) => {
    const json = JSON.stringify(payload);
    const etag = `W/"${Buffer.byteLength(json)}"`;
    res.set("ETag", etag);
    if (req.headers["if-none-match"] === etag) {
      res.status(304).end();
      return;
    }
    res.type("application/json").send(json);
  };
  if (userRole === "guest") {
    const { result: guestData } = await dbQuery(
      async (sql) => {
        const dbThemes = await sql.query(`SELECT * FROM ${TABLES.themes}`);
        const dbEvents = await sql.query(`SELECT * FROM ${TABLES.events}`);
        const dbJournal = await sql.query(`SELECT * FROM ${TABLES.journal}`);
        return {
          themes: dbThemes.map((r) => rowToEntity(r, MAPPINGS.themes)).sort((a, b) => a.weekNo - b.weekNo),
          events: dbEvents.map((r) => rowToEntity(r, MAPPINGS.events)),
          journalPosts: dbJournal.map((r) => rowToEntity(r, MAPPINGS.journal))
        };
      },
      (store) => ({
        themes: store.themes,
        events: store.events,
        journalPosts: store.journalPosts
      })
    );
    const responseData2 = {
      learners: [],
      parentProfile: null,
      progressReports: [],
      paymentHistory: [],
      chatHistory: [],
      themes: guestData.themes,
      events: guestData.events,
      journalPosts: guestData.journalPosts,
      enrolments: [],
      parentProfiles: [],
      registers: [],
      usingNeon: isNeonActive()
    };
    sendWithEtag(responseData2);
    return;
  }
  let learnersList = [];
  let parentProfileObj = null;
  let progressReportsList = [];
  let paymentHistoryList = [];
  let chatHistoryList = [];
  let themesList = [];
  let eventsList = [];
  let journalPostsList = [];
  let enrolmentsList = [];
  let registersList = [];
  const { result: mainData, source } = await dbQuery(
    async (sql) => {
      const [dbLearners, dbReports, dbPayments, dbChats, dbThemes, dbEvents, dbJournal, dbEnrolments, dbRegisters] = await Promise.all([
        sql.query(`SELECT * FROM ${TABLES.learners}`),
        sql.query(`SELECT * FROM ${TABLES.reports}`),
        sql.query(`SELECT * FROM ${TABLES.payments}`),
        sql.query(`SELECT * FROM ${TABLES.chats}`),
        sql.query(`SELECT * FROM ${TABLES.themes}`),
        sql.query(`SELECT * FROM ${TABLES.events}`),
        sql.query(`SELECT * FROM ${TABLES.journal}`),
        sql.query(`SELECT * FROM ${TABLES.enrolments}`),
        sql.query(`SELECT id, data FROM ${TABLES.registers}`).catch(() => [])
      ]);
      const data = {
        learners: dbLearners.map((r) => rowToEntity(r, MAPPINGS.learners)),
        reports: dbReports.map((r) => rowToEntity(r, MAPPINGS.reports)),
        payments: dbPayments.map((r) => rowToEntity(r, MAPPINGS.payments)),
        chats: dbChats.map((r) => rowToEntity(r, MAPPINGS.chats)),
        themes: dbThemes.map((r) => rowToEntity(r, MAPPINGS.themes)).sort((a, b) => a.weekNo - b.weekNo),
        events: dbEvents.map((r) => rowToEntity(r, MAPPINGS.events)),
        journal: dbJournal.map((r) => rowToEntity(r, MAPPINGS.journal)),
        enrolments: dbEnrolments.map((r) => rowToEntity(r, MAPPINGS.enrolments)),
        registers: dbRegisters.map((r) => typeof r.data === "string" ? JSON.parse(r.data) : r.data),
        parentProfile: null
      };
      if (userRole === "parent" && userEmail) {
        const dbProfile = await sql.query(`SELECT * FROM ${TABLES.parentProfile} WHERE id = $1`, [userEmail]);
        if (dbProfile && dbProfile.length > 0) {
          data.parentProfile = rowToEntity(dbProfile[0], MAPPINGS.parentProfile);
        } else {
          const dbDefaultProfile = await sql.query(`SELECT * FROM ${TABLES.parentProfile} WHERE id = $1`, ["default"]);
          data.parentProfile = dbDefaultProfile[0] ? rowToEntity(dbDefaultProfile[0], MAPPINGS.parentProfile) : null;
        }
      } else {
        const dbProfile = await sql.query(`SELECT * FROM ${TABLES.parentProfile} WHERE id = $1`, ["default"]);
        data.parentProfile = dbProfile[0] ? rowToEntity(dbProfile[0], MAPPINGS.parentProfile) : null;
      }
      return data;
    },
    (store) => {
      let profile = null;
      if (userRole === "parent" && userEmail) {
        profile = store.parentProfiles?.[userEmail] || store.parentProfile;
      } else {
        profile = store.parentProfile;
      }
      return {
        learners: store.learners,
        reports: store.progressReports,
        payments: store.paymentHistory,
        chats: store.chatHistory,
        themes: store.themes,
        events: store.events,
        journal: store.journalPosts,
        enrolments: store.enrolments,
        registers: store.registers || [],
        parentProfile: profile
      };
    }
  );
  learnersList = mainData.learners;
  progressReportsList = mainData.reports;
  paymentHistoryList = mainData.payments;
  chatHistoryList = mainData.chats;
  themesList = mainData.themes;
  eventsList = mainData.events;
  journalPostsList = mainData.journal;
  enrolmentsList = mainData.enrolments;
  registersList = mainData.registers || [];
  parentProfileObj = mainData.parentProfile;
  const { result: allParentProfiles } = await dbQuery(
    async (sql) => {
      const dbProfiles = await sql.query(`SELECT * FROM ${TABLES.parentProfile}`);
      return dbProfiles.map((r) => {
        const p = rowToEntity(r, MAPPINGS.parentProfile);
        return {
          email: r.id === "default" ? "parent@kiddiestown.co.za" : r.id,
          name: p.name || (p.mother?.firstNames ? p.mother.firstNames + " " + p.mother.surname : r.id),
          profile: p
        };
      });
    },
    (store) => {
      return Object.entries(store.parentProfiles || {}).map(([email, p]) => ({
        email,
        name: p.name || (p.mother?.firstNames ? p.mother.firstNames + " " + p.mother.surname : email),
        profile: p
      }));
    }
  );
  const parentMap = /* @__PURE__ */ new Map();
  allParentProfiles.forEach((p) => {
    if (p.email !== "default") {
      parentMap.set(p.email.toLowerCase().trim(), p);
    }
  });
  Object.entries(initialParentProfiles).forEach(([email, p]) => {
    const semail = email.toLowerCase().trim();
    if (!parentMap.has(semail)) {
      parentMap.set(semail, { email: semail, name: p.name, profile: p });
    } else {
      const existing = parentMap.get(semail);
      if (!existing.profile) {
        existing.profile = p;
      }
    }
  });
  const finalParentList = Array.from(parentMap.values());
  if (userRole === "parent" && userEmail) {
    const isDemoParent = userEmail === "parent@kiddiestown.co.za";
    const filteredLearners = learnersList.filter(
      (l) => l.parentEmail === userEmail || isDemoParent && (l.id === "student-jake" || l.id === "student-jill")
    );
    const myLearnerIds = filteredLearners.map((l) => l.id);
    const filteredReports = progressReportsList.filter((r) => myLearnerIds.includes(r.learnerId));
    const filteredPayments = paymentHistoryList.filter(
      (p) => p.parentEmail === userEmail || myLearnerIds.includes(p.learnerId) || isDemoParent && (p.learnerId === "student-jake" || p.learnerId === "student-jill")
    );
    let filteredChats = chatHistoryList.filter((c) => c.parentEmail === userEmail);
    if (filteredChats.length === 0 && userEmail !== "parent@kiddiestown.co.za") {
      const welcomeChat = {
        id: "chat-welcome-" + Date.now(),
        sender: "Teacher",
        senderName: "Teacher Anne",
        text: `Hello! \u{1F44B} Welcome to your Kiddies Town Parent Portal. This is a direct, confidential communication line to Teacher Anne. Please let us know if you have any questions about daily classroom schedules or lesson plans!`,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        parentEmail: userEmail
      };
      filteredChats = [welcomeChat];
      await dbQuery(
        async (sql) => {
          await sql.query(
            `INSERT INTO ${TABLES.chats} (id, sender, sender_name, text, timestamp, parent_email) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
            [welcomeChat.id, welcomeChat.sender, welcomeChat.senderName, welcomeChat.text, welcomeChat.timestamp, userEmail]
          );
        },
        (store) => {
          store.chatHistory.push(welcomeChat);
        }
      );
    }
    const responseData2 = {
      learners: filteredLearners,
      parentProfile: parentProfileObj,
      progressReports: filteredReports,
      paymentHistory: filteredPayments,
      chatHistory: filteredChats,
      themes: themesList,
      events: eventsList,
      journalPosts: journalPostsList,
      enrolments: enrolmentsList,
      // POPIA minimality: parents may only see their own household profile,
      // never the directory-wide list (admin surfaces only).
      parentProfiles: finalParentList.filter((p) => p.email === userEmail),
      usingNeon: isNeonActive()
    };
    sendWithEtag(responseData2);
    return;
  }
  const responseData = {
    learners: learnersList,
    parentProfile: parentProfileObj,
    progressReports: progressReportsList,
    paymentHistory: paymentHistoryList,
    chatHistory: chatHistoryList,
    themes: themesList,
    events: eventsList,
    journalPosts: journalPostsList,
    enrolments: enrolmentsList,
    registers: registersList,
    parentProfiles: finalParentList,
    usingNeon: isNeonActive()
  };
  sendWithEtag(responseData);
}
async function getLearners(_req, res) {
  const { result } = await dbQuery(
    async (sql) => {
      const rows = await sql.query(`SELECT * FROM ${TABLES.learners}`);
      return rows.map((r) => rowToEntity(r, MAPPINGS.learners));
    },
    (store) => store.learners
  );
  res.json(result);
}
async function getPayments(_req, res) {
  const { result } = await dbQuery(
    async (sql) => {
      const rows = await sql.query(`SELECT * FROM ${TABLES.payments}`);
      return rows.map((r) => rowToEntity(r, MAPPINGS.payments));
    },
    (store) => store.paymentHistory
  );
  res.json(result);
}
async function getThemes(_req, res) {
  const { result } = await dbQuery(
    async (sql) => {
      const rows = await sql.query(`SELECT * FROM ${TABLES.themes}`);
      return rows.map((r) => rowToEntity(r, MAPPINGS.themes)).sort((a, b) => a.weekNo - b.weekNo);
    },
    (store) => store.themes
  );
  res.json(result);
}
async function getEvents(_req, res) {
  const { result } = await dbQuery(
    async (sql) => {
      const rows = await sql.query(`SELECT * FROM ${TABLES.events}`);
      return rows.map((r) => rowToEntity(r, MAPPINGS.events));
    },
    (store) => store.events
  );
  res.json(result);
}
async function getJournalPosts(_req, res) {
  const { result } = await dbQuery(
    async (sql) => {
      const rows = await sql.query(`SELECT * FROM ${TABLES.journal}`);
      return rows.map((r) => rowToEntity(r, MAPPINGS.journal));
    },
    (store) => store.journalPosts
  );
  res.json(result);
}

// server/routes/v1/data.routes.ts
var router2 = Router2();
router2.get("/", requireAuth(true), getAllData);
router2.get("/learners", requireAuth(true), getLearners);
router2.get("/payments", requireAuth(true), getPayments);
router2.get("/themes", requireAuth(true), getThemes);
router2.get("/events", requireAuth(true), getEvents);
router2.get("/journal", requireAuth(true), getJournalPosts);
var data_routes_default = router2;

// server/routes/v1/learners.routes.ts
import { Router as Router3 } from "express";

// server/controllers/learners.controller.ts
async function createOrUpdateLearner(req, res) {
  const authReq = req;
  const learner = req.body;
  let isUpdate = false;
  let oldLearner = null;
  const { result: existing } = await dbQuery(
    async (sql) => {
      const results = await sql.query(`SELECT * FROM ${TABLES.learners} WHERE id = $1`, [learner.id]);
      if (results && results.length > 0) {
        return { found: true, data: rowToEntity(results[0], MAPPINGS.learners) };
      }
      return { found: false, data: null };
    },
    (store) => {
      const ex = store.learners.find((l) => l.id === learner.id);
      return { found: !!ex, data: ex || null };
    }
  );
  isUpdate = existing.found;
  oldLearner = existing.data;
  let actionType = isUpdate ? "STUDENT_PROFILE_CHANGE" : "CREATE_STUDENT";
  let payload = { id: learner.id, name: `${learner.firstNames} ${learner.surname}`, parentEmail: learner.parentEmail };
  if (oldLearner && oldLearner.attendanceStatus !== learner.attendanceStatus) {
    actionType = "ATTENDANCE_UPDATE";
    payload = {
      id: learner.id,
      name: `${learner.firstNames} ${learner.surname}`,
      previousStatus: oldLearner.attendanceStatus || "Pending",
      newStatus: learner.attendanceStatus
    };
  }
  const { source } = await dbQuery(
    async (sql) => {
      const row = entityToRow(learner, MAPPINGS.learners);
      const cols = Object.keys(row);
      const vals = Object.values(row);
      const colNames = cols.join(", ");
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
      const updateSets = cols.filter((c) => c !== "id").map((c) => `${c} = EXCLUDED.${c}`).join(", ");
      await sql.query(
        `INSERT INTO ${TABLES.learners} (${colNames}) VALUES (${placeholders}) ON CONFLICT (id) DO UPDATE SET ${updateSets}`,
        vals
      );
      return true;
    },
    (store) => {
      const index2 = store.learners.findIndex((l) => l.id === learner.id);
      if (index2 >= 0) {
        store.learners[index2] = learner;
      } else {
        store.learners.push(learner);
      }
      saveFallbackStore();
      return true;
    }
  );
  await createAuditLog(authReq.user.email, actionType, payload);
  res.json({ success: true, usingNeon: source === "neon" });
}
async function deleteLearner(req, res) {
  const authReq = req;
  const learnerId = req.params.id;
  const { result: deleted, source } = await dbQuery(
    async (sql) => {
      await sql.query(`DELETE FROM ${TABLES.learners} WHERE id = $1`, [learnerId]);
      return { found: true };
    },
    (store) => {
      const index2 = store.learners.findIndex((l) => l.id === learnerId);
      if (index2 >= 0) {
        const removed = store.learners[index2];
        store.learners.splice(index2, 1);
        saveFallbackStore();
        return { found: true, name: `${removed.firstNames} ${removed.surname}` };
      }
      return { found: false };
    }
  );
  if (source === "fallback" && typeof deleted === "object" && !deleted.found) {
    res.status(404).json({ success: false, error: "Student not found" });
    return;
  }
  const auditPayload = { id: learnerId };
  if (typeof deleted === "object" && deleted.name) {
    auditPayload.name = deleted.name;
  }
  await createAuditLog(authReq.user.email, "DELETE_STUDENT", auditPayload);
  res.json({ success: true, usingNeon: source === "neon" });
}

// server/middleware/rbac.ts
function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    const authReq = req;
    if (!authReq.user) {
      throw new ForbiddenError("Authentication required before authorization");
    }
    if (!allowedRoles.includes(authReq.user.role)) {
      throw new ForbiddenError("You do not have permission to access this resource");
    }
    next();
  };
}

// server/schemas/data.schemas.ts
import { z as z3 } from "zod";
var registerSchema = z3.object({
  date: z3.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  submittedBy: z3.string().optional(),
  entries: z3.array(z3.object({
    learnerId: z3.string().min(1),
    status: z3.enum(["Present", "Absent", "Excused", "Pending"]),
    arrivedTime: z3.string().optional()
  })).min(1, "Register needs at least one learner entry")
});
var learnerSchema = z3.object({
  id: z3.string().min(1),
  surname: z3.string().min(1, "Surname is required"),
  firstNames: z3.string().min(1, "First name is required"),
  preferredName: z3.string().min(1),
  dob: z3.string().min(1, "Date of birth is required"),
  idNumber: z3.string().optional().default(""),
  gender: z3.enum(["Male", "Female", "Other"]),
  homeLanguage: z3.string().min(1),
  religion: z3.string().optional(),
  gradeThisYear: z3.string().optional(),
  schoolAttending: z3.string().optional(),
  previousSchool: z3.string().optional(),
  classType: z3.enum(["Roses", "Giraffes", "Tigers"]),
  attendanceStatus: z3.enum(["Present", "Absent", "Excused", "Pending"]).default("Pending"),
  arrivedTime: z3.string().optional(),
  parentEmail: z3.string().email().optional(),
  enrolmentApproved: z3.boolean().nullish(),
  transportNeeded: z3.boolean().nullish(),
  transportRouteId: z3.string().nullish(),
  transportRouteName: z3.string().nullish()
});
var progressReportSchema = z3.object({
  id: z3.string().min(1),
  learnerId: z3.string().min(1),
  academicYear: z3.number().int().min(2020).max(2030),
  term: z3.union([z3.literal(1), z3.literal(2), z3.literal(3), z3.literal(4)]),
  released: z3.boolean().default(false),
  releasedDate: z3.string().optional(),
  recordedDaysAbsent: z3.number().int().min(0).default(0),
  indicators: z3.record(z3.string(), z3.record(z3.string(), z3.enum(["A", "D", "E", "N/O", "N/A"]))),
  shortSummary: z3.enum(["K1", "K2", "K3", "K4", "K5", "K6"]),
  teacherComments: z3.string().default(""),
  teacherName: z3.string().min(1),
  principalName: z3.string().min(1)
});
var paymentSchema = z3.object({
  id: z3.string().min(1),
  description: z3.string().min(1),
  date: z3.string().min(1),
  amount: z3.number().positive(),
  status: z3.enum(["Paid", "Unpaid", "In Arrears", "Pending Verification"]),
  receiptNo: z3.string().optional(),
  parentEmail: z3.string().email().optional(),
  learnerId: z3.string().optional()
});
var chatMessageSchema = z3.object({
  id: z3.string().min(1),
  sender: z3.enum(["Teacher", "Parent", "Admin"]),
  senderName: z3.string().min(1),
  text: z3.string().min(1, "Message cannot be empty").max(2e3),
  timestamp: z3.string().min(1),
  parentEmail: z3.string().email().optional()
});
var eventSchema = z3.object({
  id: z3.string().min(1),
  title: z3.string().min(1),
  date: z3.string().min(1),
  time: z3.string().min(1),
  category: z3.enum(["Event", "Extra-mural", "Holiday", "Incursion"]),
  description: z3.string().default(""),
  rsvps: z3.array(z3.object({
    parentName: z3.string(),
    count: z3.number().int().min(0),
    status: z3.enum(["Yes", "No", "Maybe"])
  })).default([])
});
var themeSchema = z3.object({
  weekNo: z3.number().int().positive(),
  title: z3.string().min(1),
  description: z3.string().default(""),
  activities: z3.array(z3.string()).default([])
});
var journalPostSchema = z3.object({
  id: z3.string().min(1),
  date: z3.string().min(1),
  title: z3.string().min(1),
  description: z3.string().default(""),
  imageUrl: z3.string().default(""),
  postedBy: z3.string().min(1)
});
var enrolmentSchema = z3.object({
  id: z3.string().min(1),
  childParticulars: z3.record(z3.string(), z3.unknown()).default({}),
  parentParticulars: z3.record(z3.string(), z3.unknown()).default({}),
  medicalProfile: z3.record(z3.string(), z3.unknown()).default({}),
  transportDetails: z3.record(z3.string(), z3.unknown()).default({}),
  consents: z3.record(z3.string(), z3.unknown()).default({}),
  uploadedFiles: z3.object({
    birthCertificate: z3.boolean().default(false),
    immunisationCard: z3.boolean().default(false),
    parentIds: z3.boolean().default(false),
    proofOfResidence: z3.boolean().default(false)
  }).default({ birthCertificate: false, immunisationCard: false, parentIds: false, proofOfResidence: false }),
  step: z3.number().int().min(1).max(6).default(1),
  status: z3.enum(["In Review", "Pending Approval", "Approved", "Rejected"]).default("In Review"),
  dateApplied: z3.string().min(1)
});
var createParentSchema = z3.object({
  name: z3.string().min(2, "Name is required"),
  email: z3.string().email("Valid email is required").transform((v) => v.toLowerCase().trim())
});
var bulkEmailSchema = z3.object({
  studentIds: z3.array(z3.string()).min(1, "At least one student must be selected"),
  subject: z3.string().min(1, "Subject is required"),
  body: z3.string().min(1, "Message body is required"),
  template: z3.string().optional()
});
var arrearsNoticeSchema = z3.object({
  parentName: z3.string().min(1, "Parent name is required"),
  amount: z3.number().min(0).default(0)
});

// server/schemas/common.schemas.ts
import { z as z4 } from "zod";
var idParamSchema = z4.object({
  id: z4.string().min(1, "ID parameter is required")
});
var paginationSchema = z4.object({
  page: z4.coerce.number().int().positive().default(1),
  limit: z4.coerce.number().int().positive().max(100).default(20),
  sortBy: z4.string().optional(),
  sortOrder: z4.enum(["asc", "desc"]).default("desc")
});
var emailQuerySchema = z4.object({
  email: z4.string().email().optional(),
  role: z4.enum(["parent", "teacher", "admin", "guest"]).optional()
});

// server/routes/v1/learners.routes.ts
var router3 = Router3();
router3.post("/", requireAuth(), requireRole("admin", "teacher", "parent"), validate(learnerSchema), createOrUpdateLearner);
router3.delete("/:id", requireAuth(), requireRole("admin"), validate(idParamSchema, "params"), deleteLearner);
var learners_routes_default = router3;

// server/routes/v1/resources.routes.ts
import { Router as Router4 } from "express";

// server/utils/dbHelpers.ts
var TABLE_TO_MAPPING_KEY = {
  [TABLES.parentProfile]: "parentProfile",
  [TABLES.reports]: "reports",
  [TABLES.chats]: "chats",
  [TABLES.themes]: "themes",
  [TABLES.events]: "events",
  [TABLES.journal]: "journal",
  [TABLES.enrolments]: "enrolments"
};
function createUpsertHandler(options) {
  return async (req, res) => {
    const authReq = req;
    const data = req.body;
    let id = options.getId(data);
    if (options.storeKey === "parentProfiles" && authReq.user.role === "parent") {
      id = authReq.user.email.toLowerCase().trim();
    }
    const { source } = await dbQuery(
      async (sql) => {
        const mappingKey = TABLE_TO_MAPPING_KEY[options.table];
        const row = entityToRow(data, MAPPINGS[mappingKey]);
        const cols = Object.keys(row);
        const vals = Object.values(row);
        const colNames = cols.join(", ");
        const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
        const pk = options.table === TABLES.themes ? "week_no" : "id";
        const updateSets = cols.filter((c) => c !== pk).map((col) => `${col} = EXCLUDED.${col}`).join(", ");
        const query = updateSets.length > 0 ? `INSERT INTO ${options.table} (${colNames}) VALUES (${placeholders}) ON CONFLICT (${pk}) DO UPDATE SET ${updateSets}` : `INSERT INTO ${options.table} (${colNames}) VALUES (${placeholders}) ON CONFLICT (${pk}) DO NOTHING`;
        await sql.query(query, vals);
        return true;
      },
      (store) => {
        const storeTarget = store[options.storeKey];
        if (Array.isArray(storeTarget)) {
          const index2 = storeTarget.findIndex((item) => item.id === id || item.weekNo === id);
          if (index2 >= 0) {
            storeTarget[index2] = data;
          } else {
            if (options.storeKey === "themes" || options.storeKey === "journalPosts" || options.storeKey === "enrolments") {
              store[options.storeKey].unshift(data);
            } else {
              storeTarget.push(data);
            }
          }
        } else {
          if (!store[options.storeKey]) store[options.storeKey] = {};
          store[options.storeKey][id] = data;
        }
        saveFallbackStore();
        return true;
      }
    );
    if (options.auditAction) {
      const payload = options.auditPayload ? options.auditPayload(data) : { id };
      const operator = authReq.user?.email || "guest";
      await createAuditLog(operator, options.auditAction, payload);
    } else {
    }
    res.json({ success: true, usingNeon: source === "neon" });
  };
}

// server/controllers/resources.controller.ts
var saveParentProfile = createUpsertHandler({
  table: TABLES.parentProfile,
  storeKey: "parentProfiles",
  getId: (data) => (data.email || "parent@kiddiestown.co.za").toLowerCase().trim(),
  auditAction: "UPDATE_PARENT_PROFILE",
  auditPayload: (data) => ({ email: data.email, name: data.name })
});
var saveProgressReport = createUpsertHandler({
  table: TABLES.reports,
  storeKey: "progressReports",
  getId: (data) => data.id,
  auditAction: "SAVE_PROGRESS_REPORT",
  auditPayload: (data) => ({
    id: data.id,
    studentId: data.learnerId,
    term: data.term
  })
});
async function saveRegister(req, res) {
  const authReq = req;
  const incoming = req.body;
  const register = {
    ...incoming,
    submittedBy: authReq.user?.name || incoming.submittedBy || "Teacher",
    submittedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const { source } = await dbQuery(
    async (sql) => {
      await sql.query(`CREATE TABLE IF NOT EXISTS ${TABLES.registers} (id text PRIMARY KEY, data jsonb NOT NULL)`);
      await sql.query(
        `INSERT INTO ${TABLES.registers} (id, data) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
        [register.date, JSON.stringify(register)]
      );
      return true;
    },
    (store) => {
      if (!Array.isArray(store.registers)) {
        store.registers = [];
      }
      const registers = store.registers;
      const index2 = registers.findIndex((r) => r.date === register.date);
      if (index2 >= 0) {
        registers[index2] = register;
      } else {
        registers.push(register);
      }
      saveFallbackStore();
      return true;
    }
  );
  await createAuditLog(authReq.user.email, "SUBMIT_DAILY_REGISTER", {
    date: register.date,
    entries: register.entries.length,
    present: register.entries.filter((e) => e.status === "Present").length
  });
  res.json({ success: true, usingNeon: source === "neon" });
}
async function verifyPayment(req, res) {
  const authReq = req;
  const paymentId = req.params.id;
  const { status, receiptNo } = req.body;
  const { source, result } = await dbQuery(
    async (sql) => {
      const existing = await sql.query(`SELECT * FROM ${TABLES.payments} WHERE id = $1`, [paymentId]);
      if (!existing || existing.length === 0) return { found: false };
      await sql.query(
        `UPDATE ${TABLES.payments} 
         SET status = $1, receipt_no = COALESCE($2, receipt_no) 
         WHERE id = $3`,
        [status || "Paid", receiptNo || null, paymentId]
      );
      return { found: true };
    },
    (store) => {
      const idx = store.paymentHistory.findIndex((p) => p.id === paymentId);
      if (idx >= 0) {
        const item = store.paymentHistory[idx];
        item.status = status || "Paid";
        if (receiptNo) item.receiptNo = receiptNo;
        saveFallbackStore();
        return { found: true };
      }
      return { found: false };
    }
  );
  if (!result.found) {
    res.status(404).json({ success: false, error: `Payment record ${paymentId} not found.` });
    return;
  }
  await createAuditLog(authReq.user.email, "VERIFY_PAYMENT", {
    paymentId,
    status: status || "Paid",
    receiptNo: receiptNo || void 0
  });
  res.json({ success: true, usingNeon: source === "neon" });
}
async function savePayment(req, res) {
  const authReq = req;
  const payment = req.body;
  let isUpdate = false;
  let oldPayment = null;
  const { result: existing } = await dbQuery(
    async (sql) => {
      const results = await sql.query(`SELECT * FROM ${TABLES.payments} WHERE id = $1`, [payment.id]);
      if (results && results.length > 0) {
        return { found: true, data: rowToEntity(results[0], MAPPINGS.payments) };
      }
      return { found: false, data: null };
    },
    (store) => {
      const existingIndex = store.paymentHistory.findIndex((p) => p.id === payment.id);
      if (existingIndex >= 0) {
        return { found: true, data: store.paymentHistory[existingIndex] };
      }
      return { found: false, data: null };
    }
  );
  isUpdate = existing.found;
  oldPayment = existing.data;
  const actionType = isUpdate || payment.status !== "Paid" ? "FEE_ADJUSTMENT" : "RECORD_PAYMENT";
  const payload = {
    id: payment.id,
    description: payment.description,
    amount: payment.amount,
    status: payment.status,
    studentId: payment.learnerId
  };
  const { source } = await dbQuery(
    async (sql) => {
      await sql.query(
        `INSERT INTO ${TABLES.payments} (id, description, date, amount, status, receipt_no, parent_email, learner_id) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
           ON CONFLICT (id) DO UPDATE SET 
             description = EXCLUDED.description, 
             date = EXCLUDED.date, 
             amount = EXCLUDED.amount, 
             status = EXCLUDED.status, 
             receipt_no = EXCLUDED.receipt_no, 
             parent_email = EXCLUDED.parent_email, 
             learner_id = EXCLUDED.learner_id`,
        [payment.id, payment.description, payment.date, payment.amount, payment.status, payment.receiptNo || null, payment.parentEmail || null, payment.learnerId || null]
      );
      return true;
    },
    (store) => {
      const existingIndex = store.paymentHistory.findIndex((p) => p.id === payment.id);
      if (existingIndex >= 0) {
        store.paymentHistory[existingIndex] = payment;
      } else {
        store.paymentHistory = [payment, ...store.paymentHistory];
      }
      saveFallbackStore();
      return true;
    }
  );
  await createAuditLog(authReq.user.email, actionType, payload);
  res.json({ success: true, usingNeon: source === "neon" });
}
var saveChat = createUpsertHandler({
  table: TABLES.chats,
  storeKey: "chatHistory",
  getId: (data) => data.id,
  auditAction: ""
});
var saveEvent = createUpsertHandler({
  table: TABLES.events,
  storeKey: "events",
  getId: (data) => data.id,
  auditAction: "CREATE_EVENT",
  auditPayload: (data) => ({
    id: data.id,
    title: data.title,
    date: data.date
  })
});
var saveTheme = createUpsertHandler({
  table: TABLES.themes,
  storeKey: "themes",
  getId: (data) => data.weekNo.toString(),
  auditAction: "UPDATE_WEEKLY_THEME",
  auditPayload: (data) => ({
    weekNo: data.weekNo,
    theme: data.title
    // Map correctly to log
  })
});
var saveJournalPost = createUpsertHandler({
  table: TABLES.journal,
  storeKey: "journalPosts",
  getId: (data) => data.id,
  auditAction: "POST_JOURNAL",
  auditPayload: (data) => ({
    id: data.id,
    title: data.title
  })
});
var saveEnrolment = createUpsertHandler({
  table: TABLES.enrolments,
  storeKey: "enrolments",
  getId: (data) => data.id,
  auditAction: "SUBMIT_ENROLMENT",
  auditPayload: (data) => ({
    id: data.id,
    childName: data.childParticulars?.firstNames,
    status: data.status
  })
});

// server/routes/v1/resources.routes.ts
var router4 = Router4();
router4.post("/parent-profile", requireAuth(), requireRole("parent", "admin"), saveParentProfile);
router4.post("/progress-reports", requireAuth(), requireRole("admin", "teacher"), validate(progressReportSchema), saveProgressReport);
router4.post("/payments", requireAuth(), requireRole("admin", "parent"), validate(paymentSchema), savePayment);
router4.post("/payments/:id/verify", requireAuth(), requireRole("admin"), verifyPayment);
router4.post("/chats", requireAuth(), requireRole("admin", "teacher", "parent"), validate(chatMessageSchema), saveChat);
router4.post("/events", requireAuth(), requireRole("admin", "teacher", "parent"), validate(eventSchema), saveEvent);
router4.post("/themes", requireAuth(), requireRole("admin", "teacher"), validate(themeSchema), saveTheme);
router4.post("/journal", requireAuth(), requireRole("admin", "teacher"), validate(journalPostSchema), saveJournalPost);
router4.post("/enrolments", validate(enrolmentSchema), saveEnrolment);
router4.post("/register", requireAuth(), requireRole("admin", "teacher"), validate(registerSchema), saveRegister);
var resources_routes_default = router4;

// server/routes/v1/admin.routes.ts
import { Router as Router5 } from "express";

// server/controllers/admin.controller.ts
import crypto from "crypto";

// server/db/bootstrap.ts
var initialUsers = [
  { id: "parent@kiddiestown.co.za", email: "parent@kiddiestown.co.za", password: "parent", role: "parent", name: "Sarah Mbeki" },
  { id: "teacher@kiddiestown.co.za", email: "teacher@kiddiestown.co.za", password: "teacher", role: "teacher", name: "Teacher Anne" },
  { id: "admin@kiddiestown.co.za", email: "admin@kiddiestown.co.za", password: "admin", role: "admin", name: "Shineon M." }
];
var PG_ENUMS = {
  role: ["parent", "teacher", "admin"],
  gender: ["Male", "Female"],
  class_type: ["Roses", "Giraffes", "Tigers"],
  attendance_status: ["Present", "Absent", "Excused", "Pending"],
  payment_status: ["Paid", "Unpaid", "In Arrears", "Pending Verification"],
  sender: ["Teacher", "Parent", "Admin"],
  event_category: ["Event", "Extra-mural", "Holiday", "Incursion"],
  enrolment_status: ["In Review", "Pending Approval", "Approved", "Rejected"]
};
var TABLE_DDL = [
  {
    table: TABLES.users,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.users} (
      id VARCHAR(120) PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      password_hash TEXT,
      role role,
      name VARCHAR(255),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`
  },
  {
    table: TABLES.learners,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.learners} (
      id VARCHAR(120) PRIMARY KEY,
      surname VARCHAR(120),
      first_names VARCHAR(120),
      preferred_name VARCHAR(120),
      dob VARCHAR(40),
      id_number VARCHAR(40),
      gender gender,
      home_language VARCHAR(80),
      religion VARCHAR(120),
      grade_this_year VARCHAR(40),
      school_attending VARCHAR(200),
      previous_school VARCHAR(200),
      class_type class_type,
      attendance_status attendance_status DEFAULT 'Pending',
      arrived_time VARCHAR(40),
      parent_email VARCHAR(255),
      enrolment_approved BOOLEAN,
      transport_needed BOOLEAN,
      transport_route_id VARCHAR(120),
      transport_route_name VARCHAR(160)
    )`,
    indexes: [
      `CREATE INDEX IF NOT EXISTS idx_learners_parent_email ON ${TABLES.learners} (parent_email)`,
      `CREATE INDEX IF NOT EXISTS idx_learners_class_type ON ${TABLES.learners} (class_type)`
    ]
  },
  {
    table: TABLES.parentProfile,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.parentProfile} (
      id VARCHAR(120) PRIMARY KEY,
      email VARCHAR(255),
      name VARCHAR(255),
      phone VARCHAR(60),
      address TEXT,
      marital_status VARCHAR(60),
      child_lives_with VARCHAR(120),
      mother JSONB,
      father JSONB
    )`,
    indexes: [`CREATE INDEX IF NOT EXISTS idx_parent_profile_email ON ${TABLES.parentProfile} (email)`]
  },
  {
    table: TABLES.reports,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.reports} (
      id VARCHAR(120) PRIMARY KEY,
      learner_id VARCHAR(120),
      academic_year INTEGER,
      term INTEGER,
      released BOOLEAN,
      released_date VARCHAR(40),
      recorded_days_absent INTEGER,
      indicators JSONB,
      short_summary VARCHAR(10),
      teacher_comments TEXT,
      teacher_name VARCHAR(160),
      principal_name VARCHAR(160)
    )`,
    indexes: [`CREATE INDEX IF NOT EXISTS idx_progress_reports_learner_id ON ${TABLES.reports} (learner_id)`]
  },
  {
    table: TABLES.payments,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.payments} (
      id VARCHAR(120) PRIMARY KEY,
      description TEXT,
      date VARCHAR(40),
      amount INTEGER,
      status payment_status,
      receipt_no VARCHAR(80),
      parent_email VARCHAR(255),
      learner_id VARCHAR(120)
    )`,
    indexes: [
      `CREATE INDEX IF NOT EXISTS idx_payments_parent_email ON ${TABLES.payments} (parent_email)`,
      `CREATE INDEX IF NOT EXISTS idx_payments_learner_id ON ${TABLES.payments} (learner_id)`,
      `CREATE INDEX IF NOT EXISTS idx_payments_status ON ${TABLES.payments} (status)`
    ]
  },
  {
    table: TABLES.chats,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.chats} (
      id VARCHAR(120) PRIMARY KEY,
      sender sender,
      sender_name VARCHAR(160),
      text TEXT,
      timestamp VARCHAR(40),
      parent_email VARCHAR(255)
    )`,
    indexes: [`CREATE INDEX IF NOT EXISTS idx_chats_parent_email ON ${TABLES.chats} (parent_email)`]
  },
  {
    table: TABLES.themes,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.themes} (
      week_no INTEGER PRIMARY KEY,
      title VARCHAR(255),
      description TEXT,
      activities JSONB
    )`
  },
  {
    table: TABLES.events,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.events} (
      id VARCHAR(120) PRIMARY KEY,
      title VARCHAR(255),
      date VARCHAR(40),
      time VARCHAR(40),
      category event_category,
      description TEXT,
      rsvps JSONB
    )`,
    indexes: [`CREATE INDEX IF NOT EXISTS idx_school_events_date ON ${TABLES.events} (date)`]
  },
  {
    table: TABLES.journal,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.journal} (
      id VARCHAR(120) PRIMARY KEY,
      date VARCHAR(40),
      title VARCHAR(255),
      description TEXT,
      image_url TEXT,
      posted_by VARCHAR(160)
    )`,
    indexes: [`CREATE INDEX IF NOT EXISTS idx_journal_posts_date ON ${TABLES.journal} (date)`]
  },
  {
    table: TABLES.enrolments,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.enrolments} (
      id VARCHAR(120) PRIMARY KEY,
      child_particulars JSONB,
      parent_particulars JSONB,
      medical_profile JSONB,
      transport_details JSONB,
      consents JSONB,
      uploaded_files JSONB,
      step INTEGER,
      status enrolment_status,
      date_applied VARCHAR(40)
    )`,
    indexes: [`CREATE INDEX IF NOT EXISTS idx_enrolments_status ON ${TABLES.enrolments} (status)`]
  },
  {
    table: TABLES.auditLogs,
    ddl: `CREATE TABLE IF NOT EXISTS ${TABLES.auditLogs} (
      id VARCHAR(120) PRIMARY KEY,
      user_email VARCHAR(255),
      action VARCHAR(120),
      payload JSONB,
      timestamp VARCHAR(64)
    )`,
    indexes: [`CREATE INDEX IF NOT EXISTS idx_audit_logs_user_email ON ${TABLES.auditLogs} (user_email)`]
  }
];
async function seedEntity(sql, table, mappingKey, entity) {
  const row = entityToRow(entity, MAPPINGS[mappingKey]);
  const cols = Object.keys(row);
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
  await sql.query(
    `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
    Object.values(row)
  );
}
async function bootstrapSchema() {
  if (!isNeonActive()) return;
  const sql = getSqlConnection();
  if (!sql) return;
  const isProduction2 = process.env.NODE_ENV === "production";
  try {
    if (!isProduction2) {
      for (const def of TABLE_DDL) {
        await sql.query(`DROP TABLE IF EXISTS ${def.table} CASCADE`);
      }
    }
    for (const [enumName, values] of Object.entries(PG_ENUMS)) {
      const literals = values.map((v) => `'${v}'`).join(", ");
      await sql.query(`DO $$ BEGIN CREATE TYPE ${enumName} AS ENUM (${literals}); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
    }
    for (const def of TABLE_DDL) {
      await sql.query(def.ddl);
      for (const idx of def.indexes ?? []) {
        await sql.query(idx);
      }
    }
    logger_default.info("\u2705 Neon DB schema tables verified.");
    const checkLearners = await sql.query(`SELECT count(*) FROM ${TABLES.learners}`);
    if (parseInt(checkLearners[0].count) === 0) {
      logger_default.info("\u{1F331} Database is empty! Seeding initial school records into NeonDB...");
      for (const item of initialLearners) await seedEntity(sql, TABLES.learners, "learners", item);
      await seedEntity(sql, TABLES.parentProfile, "parentProfile", { id: "default", ...initialParentProfile });
      for (const [emailKey, profileData] of Object.entries(initialParentProfiles)) {
        await seedEntity(sql, TABLES.parentProfile, "parentProfile", { id: emailKey.toLowerCase(), ...profileData });
      }
      for (const item of initialProgressReports) await seedEntity(sql, TABLES.reports, "reports", item);
      for (const item of initialPaymentHistory) {
        const matching = initialLearners.find((l) => l.id === item.learnerId);
        await seedEntity(sql, TABLES.payments, "payments", { ...item, parentEmail: matching?.parentEmail || "parent@kiddiestown.co.za" });
      }
      for (const item of initialChatHistory) {
        await seedEntity(sql, TABLES.chats, "chats", { ...item, parentEmail: "parent@kiddiestown.co.za" });
      }
      for (const item of initialWeeklyThemes) await seedEntity(sql, TABLES.themes, "themes", item);
      for (const item of initialSchoolEvents) await seedEntity(sql, TABLES.events, "events", item);
      for (const item of initialJournalPosts) await seedEntity(sql, TABLES.journal, "journal", item);
      for (const item of initialEnrolments) await seedEntity(sql, TABLES.enrolments, "enrolments", item);
      for (const user of initialUsers) {
        const seeded = { ...user, password: hashPasswordSync(user.password) };
        await seedEntity(sql, TABLES.users, "users", seeded);
      }
      logger_default.info("\u{1F389} Seed completion \u2014 initial values uploaded to NeonDB.");
    }
  } catch (error) {
    logger_default.error({ error: error?.message || String(error), stack: error?.stack }, "\u26A0\uFE0F Error while bootstrapping database tables or seeding");
    setNeonInactive();
  }
}

// server/controllers/admin.controller.ts
async function createParent(req, res) {
  const authReq = req;
  const { name, email } = req.body;
  const targetEmail = email.toLowerCase().trim();
  let issuedTempPassword = null;
  const { result: userExists } = await dbQuery(
    async (sql) => {
      const resU = await sql.query(`SELECT id FROM ${TABLES.users} WHERE id = $1`, [targetEmail]);
      return resU && resU.length > 0;
    },
    (store) => store.users.some((u) => u.id === targetEmail)
  );
  if (!userExists) {
    const tempPassword = crypto.randomBytes(9).toString("base64url");
    issuedTempPassword = tempPassword;
    const hashedPw = await hashPassword(tempPassword);
    const newUser = { id: targetEmail, email: targetEmail, password: hashedPw, role: "parent", name };
    await dbQuery(
      async (sql) => {
        await sql.query(`INSERT INTO ${TABLES.users} (id, email, password_hash, role, name) VALUES ($1, $2, $3, $4, $5)`, [targetEmail, newUser.email, newUser.password, newUser.role, newUser.name]);
      },
      (store) => {
        store.users.push(newUser);
      }
    );
  }
  const parentProfile = {
    name,
    email: targetEmail,
    phone: "+27 82 111 2233",
    address: "Kiddies Town Area, Polokwane",
    maritalStatus: "Single",
    childLivesWith: "Mother",
    mother: {
      title: "Ms.",
      surname: name.split(" ").slice(-1)[0] || name,
      firstNames: name.split(" ")[0] || name,
      idNumber: "9001010012089",
      occupation: "Professional",
      employer: "Kiddies Corp",
      telWork: "015 291 0000",
      telHome: "015 291 1122",
      cellNo: "082 111 2233",
      email: targetEmail,
      homeAddress: "Kiddies Town Area, Polokwane",
      postalAddress: "P.O. Box 123",
      workAddress: "Polokwane Central"
    },
    father: {
      title: "Mr.",
      surname: "Mbeki",
      firstNames: "Unknown",
      idNumber: "Unknown",
      occupation: "Unknown",
      employer: "Unknown",
      telWork: "",
      telHome: "",
      cellNo: "",
      email: "",
      homeAddress: "",
      postalAddress: "",
      workAddress: ""
    }
  };
  await dbQuery(
    async (sql) => {
      const mother = parentProfile.mother || {};
      const father = parentProfile.father || {};
      await sql.query(
        `INSERT INTO ${TABLES.parentProfile} (id, email, name, phone, address, marital_status, child_lives_with, mother, father)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, phone = EXCLUDED.phone,
           address = EXCLUDED.address, marital_status = EXCLUDED.marital_status, child_lives_with = EXCLUDED.child_lives_with,
           mother = EXCLUDED.mother, father = EXCLUDED.father`,
        [
          targetEmail,
          targetEmail,
          name,
          parentProfile.phone,
          parentProfile.address,
          parentProfile.maritalStatus,
          parentProfile.childLivesWith,
          JSON.stringify(mother),
          JSON.stringify(father)
        ]
      );
    },
    (store) => {
      if (!store.parentProfiles) store.parentProfiles = {};
      store.parentProfiles[targetEmail] = parentProfile;
    }
  );
  saveFallbackStore();
  await createAuditLog(authReq.user.email, "CREATE_PARENT_PROFILE_QUICK", { name, email: targetEmail });
  res.json({
    success: true,
    email: targetEmail,
    ...issuedTempPassword ? { tempPassword: issuedTempPassword } : {}
  });
}
async function sendBulkEmails(req, res) {
  const authReq = req;
  const { studentIds, subject, body, template } = req.body;
  const { result: learnersList } = await dbQuery(
    async (sql) => {
      const dbLearners = await sql.query(`SELECT * FROM ${TABLES.learners}`);
      return dbLearners.map((r) => rowToEntity(r, MAPPINGS.learners));
    },
    (store) => [...store.learners]
  );
  const selectedStudents = learnersList.filter((l) => studentIds.includes(l.id));
  if (selectedStudents.length === 0) {
    res.status(404).json({ success: false, error: "None of the selected students were found in the database." });
    return;
  }
  const notifications = [];
  selectedStudents.forEach((student) => {
    if (student.parentEmail) {
      notifications.push({
        studentName: `${student.firstNames} ${student.surname}`,
        parentEmail: student.parentEmail.toLowerCase().trim()
      });
    }
  });
  if (notifications.length === 0) {
    res.status(400).json({ success: false, error: "None of the selected students are linked to a parent email address." });
    return;
  }
  const parentEmails = Array.from(new Set(notifications.map((n) => n.parentEmail)));
  const studentNames = notifications.map((n) => n.studentName);
  await createAuditLog(authReq.user.email, "BULK_EMAIL_DISPATCH", {
    template,
    subject,
    studentCount: selectedStudents.length,
    parentCount: parentEmails.length,
    studentNames,
    parentEmails,
    bodyPreview: body.substring(0, 150) + (body.length > 150 ? "..." : "")
  });
  res.json({
    success: true,
    message: `Successfully dispatched template-based notification to ${parentEmails.length} parent contact${parentEmails.length !== 1 ? "s" : ""}.`,
    notifiedCount: parentEmails.length,
    recipients: parentEmails,
    students: studentNames
  });
}
async function sendArrearsNotice(req, res) {
  const authReq = req;
  const { parentName, amount } = req.body;
  await createAuditLog(authReq.user.email, "FEE_ADJUSTMENT", {
    description: `Dispatched financial arrears warning notification to ${parentName}`,
    amount: amount || 0,
    status: "Notice Sent"
  });
  res.json({ success: true, message: "Arrears notification successfully dispatched and audited" });
}
async function getAuditLogs(req, res) {
  const { result: logs } = await dbQuery(
    async (sql) => {
      const dbLogs = await sql.query(`SELECT id, user_email, action, payload, timestamp FROM ${TABLES.auditLogs} ORDER BY timestamp DESC LIMIT 500`);
      return dbLogs.map((r) => {
        let payload = r.payload;
        if (typeof payload === "string") {
          try {
            payload = JSON.parse(payload);
          } catch {
            payload = { raw: payload };
          }
        }
        return { id: r.id, operatorId: r.user_email, actionType: r.action, payload, timestamp: r.timestamp };
      });
    },
    (store) => store.auditLogs || []
  );
  let processedLogs = logs.map((item) => {
    if (item && item.payload_diff && !item.payload) {
      try {
        item.payload = typeof item.payload_diff === "string" ? JSON.parse(item.payload_diff) : item.payload_diff;
      } catch {
        item.payload = { raw: item.payload_diff };
      }
    }
    return item;
  });
  processedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json(processedLogs);
}
async function resetDatabase(req, res) {
  const authReq = req;
  try {
    if (isNeonActive() && getSqlConnection()) {
      const sql = getSqlConnection();
      logger_default.info("\u{1F9F9} Dropping tables for reset-db trigger...");
      const tableNames = Object.values(TABLES);
      for (const name of tableNames) {
        await sql.query(`DROP TABLE IF EXISTS ${name} CASCADE`);
      }
      logger_default.info("\u{1F331} Re-bootstrapping and seeding tables with latest mockData contents...");
      await bootstrapSchema();
      await createAuditLog(authReq.user.email, "RESET_DB", { store: "Neon Cloud DB" });
      res.json({
        success: true,
        message: "Neon Cloud DB dropped and successfully synchronized with the updated mockData structures!"
      });
    } else {
      const store = getFallbackStore();
      store.learners = [...initialLearners];
      store.parentProfile = { ...initialParentProfile, email: "parent@kiddiestown.co.za" };
      store.parentProfiles = { ...initialParentProfiles };
      store.progressReports = [...initialProgressReports];
      store.paymentHistory = initialPaymentHistory.map((p) => {
        const matchingLearner = initialLearners.find((l) => l.id === p.learnerId);
        return { ...p, parentEmail: matchingLearner?.parentEmail || "parent@kiddiestown.co.za" };
      });
      store.chatHistory = initialChatHistory.map((c) => ({
        ...c,
        parentEmail: "parent@kiddiestown.co.za"
      }));
      store.themes = [...initialWeeklyThemes];
      store.events = [...initialSchoolEvents];
      store.journalPosts = [...initialJournalPosts];
      store.enrolments = [...initialEnrolments];
      store.users = [...initialUsers];
      store.auditLogs = [];
      normalizeUserPasswords(store);
      saveFallbackStore();
      await createAuditLog(authReq.user.email, "RESET_DB", { store: "Durable JSON Local File" });
      res.json({
        success: true,
        message: "Demo memory cache successfully reset to latest mockData definitions."
      });
    }
  } catch (err) {
    logger_default.error({ error: err }, "Failed to reset application database");
    res.status(500).json({ success: false, error: err.message || "Failed to reset application database tables." });
  }
}

// server/routes/v1/admin.routes.ts
var router5 = Router5();
router5.use(requireAuth(), requireRole("admin"));
router5.post("/create-parent", validate(createParentSchema), createParent);
router5.post("/send-bulk-emails", validate(bulkEmailSchema), sendBulkEmails);
router5.post("/send-arrears-notice", validate(arrearsNoticeSchema), sendArrearsNotice);
router5.get("/audit-logs", getAuditLogs);
router5.post("/reset-db", resetDatabase);
var admin_routes_default = router5;

// server/routes/v1/pdf.routes.ts
import { Router as Router6 } from "express";
var router6 = Router6();
router6.get("/guide", async (_req, res) => {
  try {
    const { generateGuidePDF: generateGuidePDF2 } = await Promise.resolve().then(() => (init_generatePdf(), generatePdf_exports));
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=kiddies_town_parent_guide.pdf");
    await generateGuidePDF2(res);
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to generate PDF: " + err.message });
  }
});
var pdf_routes_default = router6;

// server/routes/v1/index.ts
var router7 = Router7();
router7.use("/auth", auth_routes_default);
router7.use("/data", data_routes_default);
router7.use("/learners", learners_routes_default);
router7.use("/", resources_routes_default);
router7.use("/admin", admin_routes_default);
router7.use("/pdf", pdf_routes_default);
var v1_default = router7;

// server/middleware/errorHandler.ts
function errorHandler(err, req, res, _next) {
  if (err instanceof AppError && err.isOperational) {
    logger_default.warn({
      err: { message: err.message, code: err.code, statusCode: err.statusCode },
      method: req.method,
      url: req.originalUrl,
      ip: req.ip
    }, "Operational error");
  } else {
    logger_default.error({
      err: { message: err.message, stack: err.stack, name: err.name },
      method: req.method,
      url: req.originalUrl,
      ip: req.ip
    }, "Unexpected error");
  }
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.errors
    });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
    return;
  }
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      error: "Authentication failed. Please log in again."
    });
    return;
  }
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      success: false,
      error: "Invalid JSON in request body."
    });
    return;
  }
  const isProduction2 = process.env.NODE_ENV === "production";
  res.status(500).json({
    success: false,
    error: isProduction2 ? "An internal server error occurred. Please try again later." : err.message
  });
}

// server/app.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
var PROJECT_ROOT = path2.resolve(__dirname, "..");
async function createApp() {
  const app2 = express();
  app2.use(compression());
  app2.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production" ? void 0 : false,
    crossOriginEmbedderPolicy: false
  }));
  app2.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // Allow Vercel preview deployments
    ...process.env.VERCEL ? { origin: true } : {}
  }));
  app2.use(express.json({ limit: "10mb" }));
  app2.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app2.use("/api", generalLimiter);
  app2.get("/api/health", (_req, res) => {
    res.json({ status: "healthy", timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "2.0.0" });
  });
  app2.use("/api/v1", v1_default);
  app2.use("/api", v1_default);
  app2.get("/api/all-data", requireAuth(true), getAllData);
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const react = (await import("@vitejs/plugin-react")).default;
    const tailwindcss = (await import("@tailwindcss/vite")).default;
    const vite = await createViteServer({
      configFile: false,
      root: PROJECT_ROOT,
      plugins: [react(), tailwindcss()],
      server: { middlewareMode: true },
      appType: "spa"
    });
    app2.use(vite.middlewares);
  } else {
    const distPath = path2.join(PROJECT_ROOT, "dist");
    app2.use(express.static(distPath));
    app2.get("*", (_req, res) => {
      res.sendFile(path2.join(distPath, "index.html"));
    });
  }
  app2.use(errorHandler);
  return app2;
}

// api/index.ts
initializeDatabase(process.env.DATABASE_URL);
var app = null;
async function getApp() {
  if (!app) {
    app = await createApp();
  }
  return app;
}
async function handler(req, res) {
  if (!app) {
    await bootstrapSchema();
  }
  const expressApp = await getApp();
  return expressApp(req, res);
}
export {
  handler as default
};
