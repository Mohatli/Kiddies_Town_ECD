import PDFDocument from "pdfkit";
import { Writable } from "stream";

export function generateGuidePDF(stream: Writable): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        bufferPages: true,
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        size: "A4",
      });

      doc.on("error", (err) => reject(err));
      doc.pipe(stream);

      // Helper for header styling on chapters
      const addChapterHeader = (chapterNo: string, title: string, subtitle: string) => {
        doc.fillColor("#1e1b4b"); // Indigo 950
        doc.font("Helvetica-Bold").fontSize(10).text(`CHAPTER ${chapterNo}`, { paragraphGap: 2 });
        doc.font("Helvetica-Bold").fontSize(14).text(title, { paragraphGap: 4 });
        doc.fillColor("#4f46e5"); // Indigo 600
        doc.font("Helvetica-Bold").fontSize(8).text(subtitle, { paragraphGap: 12 });
        doc.fillColor("#334155"); // Slate 700
        doc.rect(50, doc.y, 495, 1).fill("#e2e8f0");
        doc.moveDown(1.5);
      };

      // Helper for subheadings
      const addSectionHeading = (title: string) => {
        doc.fillColor("#0f172a"); // Slate 900
        doc.font("Helvetica-Bold").fontSize(10).text(title, { paragraphGap: 6 });
        doc.fillColor("#334155"); // Slate 700
      };

      // Helper for clean paragraphs
      const addParagraph = (text: string, options: any = {}) => {
        doc.fillColor("#334155"); // Slate 700
        doc.font("Helvetica").fontSize(8.5).text(text, {
          lineGap: 3,
          paragraphGap: 6,
          align: "justify",
          ...options,
        });
      };

      // Helper for code blocks / key highlights
      const addCodeBlock = (code: string) => {
        doc.fillColor("#1e293b"); // Slate 800
        doc.rect(50, doc.y, 495, doc.currentLineHeight() * code.split("\n").length + 15)
           .fill("#f8fafc"); // Light Slate gray background
        
        doc.fillColor("#0f172a"); // Dark slate text
        doc.font("Courier").fontSize(7.5).text(code, doc.x + 10, doc.y + 8, {
          lineGap: 2.2,
          paragraphGap: 2,
        });
        doc.x -= 10; // Reset offset offset
        doc.moveDown(1.5);
      };

      // Helper for structured bullet points
      const addBullet = (boldText: string, normalText: string) => {
        doc.fillColor("#334155");
        doc.font("Helvetica-Bold").fontSize(8.5).text(`  •  ${boldText}: `, {
          continued: true,
        });
        doc.font("Helvetica").fontSize(8.5).text(normalText, {
          paragraphGap: 4,
          lineGap: 2,
        });
      };

      // ================= PAGE 1: TITLE & COVER =================
      doc.rect(0, 0, 15, 842).fill("#1e1b4b"); // Large deep indigo sidebar
      doc.rect(15, 0, 8, 842).fill("#4f46e5"); // Highlight strip

      doc.x = 60;
      doc.y = 120;

      doc.fillColor("#1e1b4b")
         .font("Helvetica-Bold")
         .fontSize(32)
         .text("THE ARCHITECTURE", { paragraphGap: 4 });
      
      doc.text("OF HIGH-PERFORMANCE", { paragraphGap: 4 });
      doc.text("WEB APPLICATIONS", { paragraphGap: 18 });

      doc.fillColor("#4f46e5")
         .font("Helvetica-Bold")
         .fontSize(15)
         .text("A Master Class Textbook on Full-Stack Engineering", { paragraphGap: 30 });

      doc.rect(60, doc.y, 250, 4).fill("#6366f1");
      doc.moveDown(3.5);

      doc.fillColor("#475569")
         .font("Helvetica-Oblique")
         .fontSize(10)
         .text("A step-by-step developer guide on implementing modular frontends, stateless servers, and serverless Cloud SQL databases.", { paragraphGap: 35 });

      doc.moveDown(4);

      doc.fillColor("#020617")
         .font("Helvetica-Bold")
         .fontSize(11)
         .text("PRIMARY TEXTBOOK CHAPTERS:", { paragraphGap: 10 });

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
        doc.fillColor("#334155")
           .font("Helvetica")
           .fontSize(9)
           .text(` [x]  ${ch}`, { paragraphGap: 6, indent: 15 });
      });

      doc.moveDown(6);
      doc.fillColor("#64748b")
         .font("Courier-Bold")
         .fontSize(8)
         .text("KIDDIES TOWN SYSTEM ACADEMY  •  OFFICIAL SECOND EDITION  •  PUBLISHED JUNE 2026");


      // ================= PAGE 2: TABLE OF CONTENTS =================
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


      // ================= PAGE 3: CHAPTER I =================
      doc.addPage();
      addChapterHeader("I", "Introduction to Full-Stack Systems & How to Build the App", "UNIT I - SYSTEM ARCHITECTURE AND FOLDER LAYOUTS FROM FIRST PRINCIPLES");

      addParagraph(
        "A full-stack web application is composed of three interconnected systems: (1) The Presentation Layer or Client, which executes inside the consumer's web browser, (2) The Application Logic Layer or Server, which coordinates authorization, security policies, and proxies, and (3) The Persistence Layer or Database, where persistent application records reside. Keeping these segments isolated (Separation of Concerns) is crucial."
      );

      addSectionHeading("Structuring the Base Project and Directory Layout");
      addParagraph(
        "To begin building a performance-optimized system from scratch, we establish a clean, standard workspace. A professional folder structure prevents technical debt and makes components extremely easy to reuse:"
      );

      const tree = 
`kiddies-town-app/
├── package.json          # Dependency registrations & boot script runners
├── tsconfig.json         # TypeScript compiler configurations
├── server.ts             # Custom Express API Gateway and backend routing
├── index.html            # Static HTML frame hosting the React entry point
└── src/
    ├── main.tsx          # Client-side React boot and DOM injection
    ├── App.tsx           # Global routing framework & central reactive state
    ├── index.css         # Tailwind utility styling entry point
    ├── types.ts          # Consolidated global system TypeScript interfaces
    ├── data/
    │   └── mockData.ts   # Local developer state database falls (seeding)
    └── components/
        ├── ParentPanel.tsx     # Student roster, chats and school fees
        ├── AdminPanel.tsx      # Reroute compliance, arrears calculators
        └── DevAcademy.tsx      # Interactive interactive learning portal`;

      addCodeBlock(tree);

      addSectionHeading("Dependency Selection and Config Scripts Setup");
      addParagraph(
        "We specify our dependencies inside the package.json file. For high-speed compilers, we avoid legacy webpack chains. Instead, we utilize modern compilers such as Vite and Esbuild. Our server runtime runs on Express, and we connect to the PostgreSQL cloud DB securely over WebSockets via @neondatabase/serverless."
      );


      // ================= PAGE 4: CHAPTER II =================
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

      const reactCode =
`import React, { useState, useEffect } from "react";

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


      // ================= PAGE 5: CHAPTER III =================
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
        "Avoid adding fake, simulate, or unrequested telemetry clutter (such as system uptime pings, container port details, simulated terminal lines, or redundant credits like 'Created by Cloud Native Workspace'). If a user asks for a simple profile grid, build an elegantly styled grid using luxurious off-white spaces and let the clean card stand on its own — do not decorate outer borders with fake system logs which look highly unprofessional."
      );


      // ================= PAGE 6: CHAPTER IV =================
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

      const serverTemplate = 
`import express from "express";
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
  console.log(\`⚡ Server listening on port \${PORT}\`);
});`;

      addCodeBlock(serverTemplate);


      // ================= PAGE 7: CHAPTER V =================
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

      const neonSnippet = 
`import { neon } from "@neondatabase/serverless";

// Connect to Cloud Postgres over highly-efficient pooled WebSocket transport
const sql = neon("postgres://user:password@subdomain-ep.azure.neon.tech/main");

export async function insertNewLearner(student: { id: string; name: string }) {
  // Safe prepared parameterization blocks SQL injection hacks
  const query = "INSERT INTO kt_learners (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data";
  await sql(query, [student.id, JSON.stringify(student)]);
}`;

      addCodeBlock(neonSnippet);


      // ================= PAGE 8: CHAPTER VI =================
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

      const stepsCode =
`# Step 1: Extract project archive or pull from workspace github source
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


      // ================= PAGE 9: CHAPTER VII =================
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


      // ================= PAGE 10: CHAPTER VIII =================
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

      // Write footer and page numbers
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.fillColor("#94a3b8");
        doc.font("Helvetica-Bold").fontSize(7.5).text(
          `KIDDIES TOWN SYSTEM ACADEMY  •  PAGE ${i + 1} OF ${totalPages}`, 
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
