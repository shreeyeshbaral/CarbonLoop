# 🌱 CarbonLoop

> **"Turning Institutional Surplus into Circular Value."**

CarbonLoop is an institutional circular asset management, AI copilot, and reverse-logistics platform engineered for **ITER, Siksha 'O' Anusandhan (SOA) Deemed to be University, Bhubaneswar, Odisha, India**.

Instead of allowing working departmental equipment (laptops, lab instruments, monitors, furniture) to gather dust in basements across ITER academic blocks (C-block Data Science, D-block ECE, Admin Block, Central Library, F-Block & G-Block Mechanical, A-Block Civil, S-Block Research) or end up in landfills while neighboring faculties order new gear, **CarbonLoop autonomously bridges supply and demand through deterministic multi-factor matching, a floating AI Copilot, IT data-wipe compliance, high-capacity IndexedDB/PostgreSQL storage, and Google OR-Tools reverse logistics.**

---

## 🏛️ System Architecture

CarbonLoop follows a **modular, multi-service architecture** separating presentation, business persistence, artificial intelligence inference, and mathematical vehicle routing optimization:

```
                               ┌───────────────────────────────────────────────┐
                               │             USER INTERFACE LAYER              │
                               │        Next.js 14 (React / TypeScript)        │
                               │    Tailwind CSS (Warm Coffee-White Theme)     │
                               │     shadcn/ui + React-Leaflet + Recharts      │
                               │   🤖 Global Floating Campus AI Copilot Widget │
                               │           (ITER Bhubaneswar Theme)            │
                               └──────────────────────┬────────────────────────┘
                                                      │ HTTPS / JSON REST (Port 3000)
                                                      ▼
                               ┌───────────────────────────────────────────────┐
                               │             CORE BACKEND SERVICE              │
                               │               Node.js + Express               │
                               │         Zod Validation / State Machine        │
                               │            Deterministic Matcher              │
                               │          Impact Calculation Engine            │
                               └───────┬──────────────┬──────────────┬─────────┘
                                       │ (Port 5000)  │              │
                    Prisma ORM Queries │              │ Internal HTTP│ Internal HTTP
                                       ▼              │              │
               ┌───────────────────────────────┐      │              │
               │       DATA PERSISTENCE        │      │              │
               │ 1. Supabase PostgreSQL (Cloud)│      │              │
               │ 2. IndexedDB Engine (Client)  │      │              │
               │ Relational Schema / Enums     │      │              │
               │ Configurable Factor Table     │      │              │
               └───────────────────────────────┘      │              │
                                                      ▼              ▼
                    ┌──────────────────────────────────┐  ┌───────────────────────────┐
                    │        PYTHON AI SERVICE         │  │   OPTIMIZATION SERVICE    │
                    │       FastAPI + Pydantic         │  │    FastAPI + OR-Tools     │
                    │   LLM Parsing (Structured JSON)  │  │  VRP Route Solver + OSRM  │
                    │          (Port 8000)             │  │        (Port 8001)        │
                    └──────────────────────────────────┘  └───────────────────────────┘
```

---

## 📍 Campus Geospatial Deployment: ITER SOA University, Bhubaneswar

- **Campus Center Coordinates**: `20.2474° N, 85.8008° E` (Jagamara / Khandagiri Campus, Bhubaneswar)
- **Authentic Academic Blocks Mapped**:
  1. **Centre for Data Science & C-block**: Computer Science & AI Labs (`20.2476° N, 85.8010° E`)
  2. **ITER Administrative Block**: Central Stores & Logistics Depot (`20.2482° N, 85.8000° E`)
  3. **ITER Central Library**: Reference Halls & Multimedia Bays (`20.2464° N, 85.7997° E`)
  4. **D-block**: Electronics & Communication Engineering / VLSI Labs (`20.2466° N, 85.8003° E`)
  5. **Bansuri Guru Auditorium & Media Wing**: Design & Innovation Studio (`20.2475° N, 85.8014° E`)
  6. **F-Block & G-Block**: Mechanical Engineering & CAD/CAM Labs (`20.2465° N, 85.8018° E`)
  7. **A-Block**: Civil Engineering & Survey Stores (`20.2488° N, 85.7996° E`)
  8. **S-Block & Discovery Center**: Advanced Nanotechnology & Research (`20.2466° N, 85.8011° E`)

---

## 🚀 Core Features & Modules

### 1. 🤖 Campus Circular AI Copilot (`AICopilotWidget.tsx`)
- **Global Floating Assistant**: Available on all pages to answer natural language questions about ITER surplus inventory, building locations, and carbon calculations.
- **Hybrid Intelligence Architecture**: Zero-key local deterministic NLP engine + seamless bridge to OpenAI GPT-4o, Google Gemini 1.5, or Groq.
- **1-Tap Quick Action Prompts**: Instantly lists surplus laptops, queries D-block inventory, explains NIST 800-88 data-wipe protocols, and summarizes Scope 3 carbon savings.

### 2. 📊 Executive Overview Dashboard (`/dashboard`)
- **Tri-Pillar Circular Dividends**: Real-time aggregation of **Capital Retained (₹48.65 Lakhs)**, **E-Waste Diverted (3.42 Metric Tons)**, and **Scope 3 $CO_2e$ Abated (9.15 Metric Tons)**.
- **Interactive Pathway Distribution**: Donut breakdown of `REUSE`, `REPAIR`, `REDISTRIBUTE`, and `RECYCLE`.
- **Departmental Imbalance Monitor**: Grouped bar telemetry tracking surplus declarations vs. procurement shortages across all 8 ITER departments.
- **Geospatial Preview**: Dynamic Leaflet map centered directly on ITER Khandagiri Campus.

### 3. 📦 Asset Marketplace & Live Editing (`/assets`)
- **Live Asset Editing**: Click the ✏️ **Edit** button on any asset card to change name, condition, assigned ITER building, valuation (₹), repair cost (₹), or circular action.
- **Certified E-Waste Recycling Action**: Decommission non-repairable units and increment landfill diversion counters.
- **Surplus Intake Modal**: Declare surplus equipment with instant **AI Assistant Classification** preview.

### 4. ⚡ Deterministic Matching Engine & Shortage Requisitions (`/intelligence`)
- **"Declare Equipment Shortage" Modal**: Allows department heads to post urgent equipment needs with urgency levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- **Multi-Factor Compatibility Formula**:
  $$\text{MatchScore} = \text{Compatibility (40\%)} + \text{Condition (25\%)} + \text{Proximity (20\%)} + \text{Urgency (15\%) }$$
- Calculates inter-building walking/transit distances across ITER blocks using the **Haversine formula**.
- Generates transparent, human-readable algorithmic justification reasons with one-click transfer dispatch!

### 5. 🗺️ Geospatial Resource Map (`/map`)
- **Dual-Mode Interactive Leaflet Canvas**:
  - **Inventory Mode**: ITER department nodes with live surplus/shortage counters.
  - **Logistics Mode**: Active inter-department transfer paths drawn with animated directional polylines across the Jagamara campus.
- **Department Telemetry Side Drawer**: Deep inspection of all surplus equipment inside any campus building with one-click claim buttons.

### 6. 🛡️ IT Security & NIST 800-88 Data-Wipe Governance
- Mandatory security guard for data-bearing assets (laptops, desktops, switches).
- **IT Officer Verification Modal**: Certifies zero-entropy drive overwrite, MDM release, and generates cryptographic certificate hashes (`CERT-NIST-2024-XXXX`).

### 7. 🚛 Reverse Logistics Route Optimizer (`/routes`)
- Solves the **Vehicle Routing Problem (VRP)** / Traveling Salesperson Problem (TSP) using **Google OR-Tools**.
- Generates the shortest Hamiltonian pickup-and-delivery loop starting and finishing at the SOA Central Depot.
- **Achieves 41.2% mileage reduction**, saving fuel and avoided van combustion emissions ($kg\ CO_2$).

### 8. 📈 ESG Impact Accounting & Analytics (`/analytics`)
- Historical monthly time-series trajectories for monetary capital retention and greenhouse gas abatement.
- **Department Circularity Index (DCI)** leaderboard ranking all 8 departments (Gold/Silver/Bronze tiers).
- **Transparent Factor Table**: Audited conversion constants stored in database (`ImpactFactorConfig`) conforming to GHG Protocol Scope 3 Category 1.

---

## 🎨 Warm Enterprise Visual Identity

CarbonLoop strictly avoids dark mode and saturated blues/purples in favor of a **warm coffee-white and forest sustainability palette**:

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Canvas Background** | `#F7F4EC` | Primary warm coffee-white viewport canvas |
| **Card Surface** | `#FFFDF8` | Crisp elevated container background |
| **Forest Green** | `#176B3A` | Primary actions, surplus badges, high-impact highlights |
| **Leaf Green** | `#2E9B59` | Secondary accents, positive growth trends |
| **Warm Amber** | `#E98A3A` | Shortage alerts, in-transit telemetry, warnings |
| **Charcoal Ink** | `#18201B` | High-contrast readable typography |
| **Warm Border** | `#DCD8CC` | Subtle structural dividers |

---

## 👥 Multi-Role Perspective Switcher (Demo Mode)

CarbonLoop includes a persistent **Role Switcher** in the top-right navigation bar to test the platform from any stakeholder's perspective without re-logging:

1. **ADMIN** (*Dr. Alok Verma*): Full institutional oversight, impact policies, and audit trails.
2. **DEPARTMENT_MANAGER** (*Prof. Priya Sharma - ITER CSE*): Manages faculty assets, declares surplus, and approves outgoing transfers.
3. **IT_OFFICER** (*Rohan Nair - Central IT*): Performs cryptographic NIST 800-88 data-wipe audits and digital sanitization sign-offs.
4. **REQUESTER** (*Aanya Mehta - ITER Design Studio*): Searches surplus inventory and submits departmental acquisition requests.

---

## 🛠️ Quickstart & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/shreeyeshbaral/CarbonLoop.git
cd CarbonLoop
```

### 2. Run the Next.js Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to interact with the live platform and try the **Campus AI Copilot**!

---

## 📜 License
Engineered for open sustainability and circular innovation at **ITER, Siksha 'O' Anusandhan University, Bhubaneswar** under the MIT License.
