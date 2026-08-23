# 🌱 CarbonLoop

> **"Turning Institutional Surplus into Circular Value."**

CarbonLoop is an institutional circular asset management and reverse-logistics platform engineered for **ITER, Siksha 'O' Anusandhan (SOA) Deemed to be University, Bhubaneswar, Odisha, India**.

Instead of allowing working departmental equipment (laptops, lab instruments, monitors, furniture) to gather dust in basements across ITER academic blocks (Block 1 CSE, Block 3 Mech, Block 4 ECE, Block 5 Civil, Block 6 Design, Biju Patnaik Central Library) or end up in landfills while neighboring faculties order new gear, **CarbonLoop autonomously bridges supply and demand through deterministic algorithms, AI-assisted classification, IT data-wipe compliance, and Google OR-Tools reverse logistics.**

---

## 🏛️ System Architecture

CarbonLoop follows a **modular, multi-service architecture** separating presentation, business persistence, artificial intelligence inference, and mathematical vehicle routing optimization:

```
                               ┌───────────────────────────────────────────────┐
                               │             USER INTERFACE LAYER              │
                               │        Next.js 14 (React / TypeScript)        │
                               │    Tailwind CSS (Warm Coffee-White Theme)     │
                               │     shadcn/ui + React-Leaflet + Recharts      │
                               │          (ITER Bhubaneswar Theme)             │
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
               ┌───────────────────────────┐          │              │
               │      DATA PERSISTENCE     │          │              │
               │   PostgreSQL + Prisma     │          │              │
               │ Relational Schema / Enums │          │              │
               │ Configurable Factor Table │          │              │
               └───────────────────────────┘          │              │
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

- **Campus Center Coordinates**: `20.2520° N, 85.7980° E` (Jagamara / Khandagiri Campus, Bhubaneswar)
- **Academic Blocks Mapped**:
  1. **ITER Block 1**: Computer Science & Engineering (CSE / CSIT Complex)
  2. **ITER Block 3**: Mechanical Engineering & Thermal Labs
  3. **ITER Block 4**: Electronics & Communication Engineering (VLSI Labs)
  4. **ITER Block 5**: Civil Engineering & Environmental Lab
  5. **ITER Block 6**: Design & Innovation Media Studio
  6. **ITER Central Library**: Biju Patnaik Central Knowledge Resource Center
  7. **SOA Admin Bhavan**: Central University Administration & Stores, Khandagiri Road
  8. **ITER Discovery Center**: Center for Advanced Nanotechnology & AI Research

---

## 🚀 Core Features & Modules

### 1. 📊 Executive Overview Dashboard (`/dashboard`)
- **Tri-Pillar Circular Dividends**: Real-time aggregation of **Capital Retained (₹48.65 Lakhs)**, **E-Waste Diverted (3.42 Metric Tons)**, and **Scope 3 $CO_2e$ Abated (9.15 Metric Tons)**.
- **Interactive Pathway Distribution**: Donut breakdown of `REUSE`, `REPAIR`, `REDISTRIBUTE`, and `RECYCLE`.
- **Departmental Imbalance Monitor**: Grouped bar telemetry tracking surplus declarations vs. procurement shortages across all 8 ITER departments.
- **Geospatial Preview**: Dynamic Leaflet map centered directly on ITER Khandagiri Campus.

### 2. 📦 Asset Marketplace (`/assets`)
- Multi-dimensional predicate filtering by Category, Condition, Department, and Circular Pathway.
- Instant search across asset tags, serial numbers, manufacturers, and model numbers.
- **Surplus Intake Modal**: Declare surplus equipment with instant **AI Assistant Classification** preview.

### 3. 🔬 Deep Asset Dossier (`/assets/[id]`)
- Hardware technical specifications, serial numbers, and maintenance metadata.
- **Explainable AI Recommendation**: Confidence scores with transparent reasoning paragraphs.
- **Chain of Custody Timeline**: Immutable chronological log of asset registration, security audits, and transfers.
- **Interactive State Transition Controls**: Governed by role permissions and security guards.

### 4. 🗺️ Geospatial Resource Map (`/map`)
- **Dual-Mode Interactive Leaflet Canvas**:
  - **Inventory Mode**: ITER department nodes with live surplus/shortage counters.
  - **Logistics Mode**: Active inter-department transfer paths drawn with animated directional polylines across the Jagamara campus.
- **Department Telemetry Side Drawer**: Deep inspection of all surplus equipment inside any campus building with one-click claim buttons.

### 5. ⚡ Deterministic Matching Engine (`/intelligence`)
- **Multi-Factor Compatibility Formula**:
  $$\text{MatchScore} = \text{Compatibility (40\%)} + \text{Condition (25\%)} + \text{Proximity (20\%)} + \text{Urgency (15\%) }$$
- Calculates inter-building walking/transit distances across ITER blocks using the **Haversine formula**.
- Generates transparent, human-readable algorithmic justification reasons.

### 6. 🛡️ IT Security & NIST 800-88 Data-Wipe Governance
- Mandatory security guard for data-bearing assets (laptops, desktops, switches).
- **IT Officer Verification Modal**: Certifies zero-entropy drive overwrite, MDM release, and generates cryptographic certificate hashes (`CERT-NIST-2024-XXXX`).

### 7. 🚛 Reverse Logistics Route Optimizer (`/routes`)
- Solves the **Vehicle Routing Problem (VRP)** / Traveling Salesperson Problem (TSP) using **Google OR-Tools**.
- Generates the shortest Hamiltonian pickup-and-delivery loop starting and finishing at the SOA Central Depot.
- Calculates fleet mileage savings, duration in minutes, and avoided van emissions.

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
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📜 License
Engineered for open sustainability and circular innovation at **ITER, Siksha 'O' Anusandhan University, Bhubaneswar** under the MIT License.
