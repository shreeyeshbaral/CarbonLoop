import { NextRequest, NextResponse } from "next/server";
import { MOCK_DEPARTMENTS, MOCK_IMPACT_METRICS } from "@/lib/mockData";
import { MOCK_ASSETS } from "@/lib/mockAssets";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, userRole } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // 1. Try Live OpenAI API if key is present
    if (apiKey && apiKey.startsWith("sk-")) {
      try {
        const systemPrompt = `You are the CarbonLoop Campus Circular AI Copilot for ITER, Siksha 'O' Anusandhan (SOA) Deemed to be University, Bhubaneswar, Odisha, India.
You are an expert in institutional circular asset management, Scope 3 greenhouse gas (GHG) carbon accounting, NIST 800-88 IT data sanitization compliance, and Google OR-Tools reverse logistics.

### Authentic Campus Knowledge & Topology:
- Campus Location: ITER SOA University, Jagamara, Bhubaneswar (20.2474° N, 85.8008° E)
- Academic Blocks & Buildings:
  1. Centre for Data Science & C-block: Computer Science & AI Labs, High-Performance Servers
  2. ITER Administrative Block: Central Stores & Logistics Van Depot (Dr. Alok Verma)
  3. ITER Central Library: Reference Halls, Ergonomic Furniture, Multimedia Bays
  4. D-block: Electronics & Communication (ECE / VLSI Labs)
  5. Bansuri Guru Auditorium & Media Wing: Design & Innovation Media Studio
  6. F-Block & G-Block: Mechanical Engineering & CAD/CAM Labs
  7. A-Block: Civil Engineering & Survey Stores
  8. S-Block & Discovery Center: Advanced Nanotechnology & Cleanroom Office

### Live Institutional Stats & Metrics:
- Avoided Procurement: ₹${(MOCK_IMPACT_METRICS.procurementAvoidedInr / 100000).toFixed(2)} Lakhs (Direct capital retained)
- Scope 3 CO2e Abatement: ${(MOCK_IMPACT_METRICS.co2AvoidedKg / 1000).toFixed(2)} Metric Tons
- Landfill E-Waste Diverted: ${(MOCK_IMPACT_METRICS.wasteDivertedKg / 1000).toFixed(2)} Metric Tons
- Reverse Logistics Mileage Saved: ${MOCK_IMPACT_METRICS.logisticsKmOptimized} km via Google OR-Tools (41.2% distance reduction)
- Active Surplus Inventory: ${MOCK_ASSETS.length} tracked assets (Dell Laptops, 4K BenQ Monitors, Herman Miller Chairs, Cisco PoE Switches, Epson Projectors).

### Guidelines for Responses:
- Speak professionally, enthusiastically, and concisely as an institutional sustainability copilot.
- Use markdown formatting with bolding, bullet points, and emoji headers.
- Reference real ITER buildings (e.g. C-block, D-block, Bansuri Guru Wing, Central Library).
- Link to relevant platform routes when appropriate: [Asset Marketplace](/assets), [Campus Resource Map](/map), [Matching Engine](/intelligence), [Route Optimizer](/routes), [Impact & ESG Analytics](/analytics).
- When asked about data wipe, explain the 3-pass cryptographic NIST SP 800-88 Rev. 1 sanitization certificate.`;

        const openAiMessages = [
          { role: "system", content: systemPrompt },
          ...messages.slice(-6).map((m: any) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        ];

        const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: openAiMessages,
            temperature: 0.7,
            max_tokens: 600,
          }),
        });

        if (openAiRes.ok) {
          const data = await openAiRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              role: "assistant",
              content: reply,
              timestamp: new Date().toISOString(),
              provider: "OpenAI GPT-4o-mini",
            });
          }
        } else {
          const errorData = await openAiRes.json().catch(() => ({}));
          console.warn("OpenAI API returned non-200, falling back to local engine:", errorData);
        }
      } catch (openAiErr) {
        console.warn("OpenAI fetch failed, activating local deterministic fallback:", openAiErr);
      }
    }

    // 2. Local Deterministic Campus Intelligence Engine Fallback
    const latestUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    let reply = "";

    if (
      latestUserMessage.includes("laptop") ||
      latestUserMessage.includes("computer") ||
      latestUserMessage.includes("pc") ||
      latestUserMessage.includes("workstation")
    ) {
      const laptops = MOCK_ASSETS.filter((a) => a.category === "LAPTOP" || a.category === "DESKTOP");
      reply = `### 💻 Available Laptops & Workstations at ITER:\n\nWe currently have **${laptops.length} surplus computing systems** in inventory:\n\n` +
        laptops.map(l => `- **${l.name}** (${l.assetTag}) — *${l.condition} condition*, located at **${l.department?.name || l.location.building}** (Value: ₹${l.estimatedValue.toLocaleString('en-IN')})`).join('\n') +
        `\n\n💡 **Action Recommendation**: You can inspect or claim these systems directly from the **[Asset Marketplace](/assets)**. For inter-faculty transfers, IT Security NIST 800-88 data sanitization will be automatically scheduled.`;
    } else if (
      latestUserMessage.includes("d-block") ||
      latestUserMessage.includes("ece") ||
      latestUserMessage.includes("electronics")
    ) {
      const eceDept = MOCK_DEPARTMENTS.find(d => d.code === "ECE");
      const eceAssets = MOCK_ASSETS.filter(a => a.department?.code === "ECE" || a.departmentId === "dept-ece");
      reply = `### 📍 ITER D-block (Electronics & Communication Engineering):\n\n- **Building**: ${eceDept?.building}\n- **Surplus Nodes**: **+${eceDept?.surplusCount || 29} available units**\n- **Shortages**: **-${eceDept?.shortageCount || 15} requisitions**\n\n**Featured Equipment in D-block**:\n` +
        eceAssets.map(a => `- **${a.name}** (${a.assetTag}) — ${a.condition} (${a.recommendedAction})`).join('\n') +
        `\n\n🗺️ Open the **[Campus Resource Map](/map)** to view geospatial transit polylines originating from D-block.`;
    } else if (
      latestUserMessage.includes("co2") ||
      latestUserMessage.includes("carbon") ||
      latestUserMessage.includes("savings") ||
      latestUserMessage.includes("procurement") ||
      latestUserMessage.includes("esg") ||
      latestUserMessage.includes("impact")
    ) {
      reply = `### 📊 ITER Campus Circular ESG & Financial Summary:\n\n- 💰 **Avoided Procurement**: **₹${(MOCK_IMPACT_METRICS.procurementAvoidedInr / 100000).toFixed(2)} Lakhs** (Direct capital retained)\n- 🌿 **Embodied CO₂e Abatement**: **${(MOCK_IMPACT_METRICS.co2AvoidedKg / 1000).toFixed(2)} Metric Tons**\n- ♻️ **Landfill Diversion**: **${(MOCK_IMPACT_METRICS.wasteDivertedKg / 1000).toFixed(2)} Metric Tons of E-Waste**\n- 🚚 **Optimized Reverse Logistics Mileage**: **${MOCK_IMPACT_METRICS.logisticsKmOptimized} km** saved via Google OR-Tools Hamiltonian routing\n\n📈 Visit the **[Impact & ESG Analytics](/analytics)** dashboard for Scope 3 Category 1 GHG audit charts.`;
    } else if (
      latestUserMessage.includes("data wipe") ||
      latestUserMessage.includes("nist") ||
      latestUserMessage.includes("security") ||
      latestUserMessage.includes("sanitiz")
    ) {
      reply = `### 🔒 NIST SP 800-88 Rev. 1 IT Sanitization Protocol:\n\n1. **Automated Flagging**: Any asset with persistent memory (Laptops, Desktops, Servers, Managed Switches) automatically enters \`DATA_WIPE_PENDING\` state upon surplus declaration.\n2. **Cryptographic Erase / 3-Pass Overwrite**: Completed by authorized IT Security Officers in compliance with university privacy policies.\n3. **Cryptographic Certificate**: Generates a verifiable SHA-256 tamper-evident hash stored in PostgreSQL before the asset can be loaded onto campus transit vans.\n\n🛡️ Switch your role to **IT Security Officer** in the top header to review pending data-wipe queues on individual asset dossiers!`;
    } else if (
      latestUserMessage.includes("route") ||
      latestUserMessage.includes("logistics") ||
      latestUserMessage.includes("van") ||
      latestUserMessage.includes("pickup")
    ) {
      reply = `### 🚚 Campus Reverse Logistics & Route Optimization:\n\nOur reverse logistics engine uses **Google OR-Tools (Vehicle Routing Problem / TSP solver)** to optimize campus delivery vans between ITER academic blocks:\n\n- **Depot**: ITER Central Stores (Admin Block)\n- **Transit Loop**: Admin Block $\\to$ C-block (Data Science) $\\to$ D-block (ECE) $\\to$ Bansuri Guru Wing $\\to$ Central Library $\\to$ Admin Block\n- **Mileage Reduction**: **41.2% lower fuel consumption** vs ad-hoc multi-trip dispatch.\n\n📍 Inspect the live dispatch itinerary on the **[Route Optimizer](/routes)**!`;
    } else if (
      latestUserMessage.includes("shortage") ||
      latestUserMessage.includes("need") ||
      latestUserMessage.includes("match")
    ) {
      reply = `### 🤝 Campus Surplus ↔ Shortage Matching Engine:\n\nOur multi-factor matching engine continuously pairs open requisitions using a 4-factor scoring model:\n- **Compatibility**: 40%\n- **Condition vs Requirement**: 25%\n- **Intra-Campus Proximity (Haversine)**: 20%\n- **Urgency (Critical / High / Medium)**: 15%\n\n✨ Open the **[Matching Engine](/intelligence)** to view real-time pairings or click **"Declare Equipment Shortage"** to post a new request!`;
    } else {
      reply = `### 🌿 CarbonLoop Campus Circular Copilot\n\nHello! I am your AI circular asset assistant for **ITER, Siksha 'O' Anusandhan University**.\n\nHere are some things you can ask me:\n- 💻 *"Show surplus laptops available for research labs"*\n- 🗺️ *"What equipment is currently located in D-block or C-block?"*\n- 📊 *"Summarize our avoided procurement and carbon abatement numbers"*\n- 🔒 *"How does NIST 800-88 data sanitization work?"*\n- 🚚 *"How does the van route optimization calculate mileage savings?"*\n- ➕ *"How do I declare a new shortage for my department?"*\n\nHow can I assist your department today?`;
    }

    return NextResponse.json({
      role: "assistant",
      content: reply,
      timestamp: new Date().toISOString(),
      provider: "CarbonLoop Local Campus Engine",
    });
  } catch (error: any) {
    console.error("AI Chatbot Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response", details: error.message },
      { status: 500 }
    );
  }
}
