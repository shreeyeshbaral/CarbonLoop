# 🌱 CarbonLoop

> **"Turning Institutional Surplus into Circular Value."**

CarbonLoop is an institutional circular asset management and reverse-logistics platform engineered for universities, enterprise campuses, and municipal organizations.

Instead of allowing working departmental equipment (laptops, lab instruments, monitors, furniture) to gather dust in basements or end up in landfills while neighboring faculties order new gear, **CarbonLoop autonomously bridges supply and demand through deterministic algorithms, AI-assisted classification, IT data-wipe compliance, and Google OR-Tools reverse logistics.**

---

## 🏛️ System Architecture

CarbonLoop follows a **modular, multi-service architecture** separating presentation, business persistence, artificial intelligence inference, and mathematical vehicle routing optimization:

```
                               ┌───────────────────────────────────────────────┐
                               │             USER INTERFACE LAYER              │
                               │        Next.js 14 (React / TypeScript)        │
                               │    Tailwind CSS (Warm Coffee-White Theme)     │
                               │     shadcn/ui + React-Leaflet + Recharts      │
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

## 🚀 Core Features & Modules

### 1. 📊 Executive Overview Dashboard (`/dashboard`)
- **Tri-Pillar Circular Dividends**: Real-time aggregation of **Capital Retained (₹)**, **E-Waste Diverted (kg)**, and **Scope 3 $CO_2e$ Abated**.
- **Interactive Pathway Distribution**: Donut breakdown of `REUSE`, `REPAIR`, `REDISTRIBUTE`, and `RECYCLE`.
- **Departmental Imbalance Monitor**: Grouped bar telemetry tracking surplus declarations vs. procurement shortages across 8 campus faculties.
- **Geospatial Preview**: Dynamic Leaflet map highlighting net-surplus (+🟢) and net-shortage (-🟠) nodes.

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
  - **Inventory Mode**: Department nodes with live surplus/shortage counters.
  - **Logistics Mode**: Active inter-department transfer paths drawn with animated directional polylines.
- **Department Telemetry Side Drawer**: Deep inspection of all surplus equipment inside any campus building with one-click claim buttons.

### 5. ⚡ Deterministic Matching Engine (`/intelligence`)
- **Multi-Factor Compatibility Formula**:
  $$\text{MatchScore} = \text{Compatibility (40\%)} + \text{Condition (25\%)} + \text{Proximity (20\%)} + \text{Urgency (15\%) }$$
- Calculates inter-building walking/transit distances using the **Haversine formula**.
- Generates transparent, human-readable algorithmic justification reasons.

### 6. 🛡️ IT Security & NIST 800-88 Data-Wipe Governance
- Mandatory security guard for data-bearing assets (laptops, desktops, switches).
- **IT Officer Verification Modal**: Certifies zero-entropy drive overwrite, MDM release, and generates cryptographic certificate hashes (`CERT-NIST-2024-XXXX`).

### 7. 🚛 Reverse Logistics Route Optimizer (`/routes`)
- Solves the **Vehicle Routing Problem (VRP)** / Traveling Salesperson Problem (TSP) using **Google OR-Tools**.
- Generates the shortest Hamiltonian pickup-and-delivery loop starting and finishing at the Central Campus Depot.
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
2. **DEPARTMENT_MANAGER** (*Prof. Priya Sharma - CSE*): Manages faculty assets, declares surplus, and approves outgoing transfers.
3. **IT_OFFICER** (*Rohan Nair*): Performs cryptographic NIST 800-88 data-wipe audits and digital sanitization sign-offs.
4. **REQUESTER** (*Aanya Mehta - Design Lab*): Searches surplus inventory and submits departmental acquisition requests.

---

## 🛠️ Quickstart & Local Setup

### Prerequisites
- **Node.js**: v18.0+ or v20.0+
- **Python**: v3.10+ or v3.11+
- **Git**

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

### 3. Run the Node.js / Express Core Backend (Port 5000)
```bash
cd ../backend
npm install
npx prisma generate
npm run dev
```

### 4. Run the Python AI Microservice (Port 8000)
```bash
cd ../ai-service
python -m venv .venv
source .venv/bin/activate # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
```

### 5. Run the Python OR-Tools Optimization Service (Port 8001)
```bash
cd ../optimization-service
python -m venv .venv
source .venv/bin/activate # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8001 --reload
```

---

## 📡 API Endpoints Dictionary

| Service | Method | Route | Description |
| :--- | :--- | :--- | :--- |
| **Backend** | `GET` | `/api/departments` | Fetch all 8 departments with live surplus/shortage telemetry |
| **Backend** | `GET` | `/api/assets` | Filterable and searchable asset catalog with pagination |
| **Backend** | `GET` | `/api/assets/:id` | Deep asset dossier lookup with data-wipe and custody logs |
| **Backend** | `POST`| `/api/assets` | Register new surplus asset with Zod validation |
| **Backend** | `GET` | `/api/requests` | Fetch departmental equipment shortage requests |
| **Backend** | `POST`| `/api/requests` | Submit new equipment shortage request |
| **Backend** | `GET` | `/api/impact/summary` | Aggregate ESG, financial, and logistics circularity metrics |
| **AI** | `POST`| `/api/ai/assess-asset` | Unformatted text $\to$ Pydantic structured JSON classification |
| **AI** | `POST`| `/api/ai/parse-search` | Natural search query $\to$ Structured database query filters |
| **Optimization**| `POST`| `/api/routes/optimize` | Solves Google OR-Tools VRP route loop for batch transfers |

---

## 🧪 Synthetic Dataset Disclosure

For hackathon demonstration purposes, CarbonLoop includes a synthetic dataset of **250+ realistic institutional assets** across 8 canonical faculties (Computer Science, Mechanical, Electronics, Civil, Design, Library, Central Admin, Research Lab) located at authentic GPS coordinates around an engineering campus. All database and API layers are designed for turnkey replacement with real university ERP/CSV pipelines.

---

## 📜 License
Engineered for open sustainability and circular innovation under the MIT License.
