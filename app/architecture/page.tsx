export default function ArchitecturePage() {
  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 550" fontFamily="system-ui, -apple-system, sans-serif" style={{ width: "100%", maxWidth: 1100 }}>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#64748b"/>
          </marker>
        </defs>

        <rect width="900" height="550" fill="#0f172a" rx="10"/>
        <text x="450" y="35" textAnchor="middle" fill="#f8fafc" fontSize="18" fontWeight="700">Friendly Neighbor — Architecture</text>

        {/* User */}
        <rect x="50" y="80" width="180" height="60" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <text x="140" y="108" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">👤 User (Browser)</text>
        <text x="140" y="126" textAnchor="middle" fill="#94a3b8" fontSize="10">Voice + Map + Location</text>

        {/* VAPI */}
        <rect x="360" y="70" width="220" height="80" rx="10" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2.5"/>
        <text x="470" y="100" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">⭐ VAPI</text>
        <text x="470" y="120" textAnchor="middle" fill="#c7d2fe" fontSize="10">Voice AI + GPT-4o tool-calling</text>
        <text x="470" y="136" textAnchor="middle" fill="#c7d2fe" fontSize="10">+ outbound phone calls</text>

        {/* Next.js */}
        <rect x="320" y="230" width="260" height="70" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <text x="450" y="258" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">⚙️ Next.js Server</text>
        <text x="450" y="278" textAnchor="middle" fill="#94a3b8" fontSize="10">API routes, SSE, orchestration</text>

        {/* APIFY */}
        <rect x="50" y="380" width="220" height="70" rx="10" fill="#052e16" stroke="#10b981" strokeWidth="2.5"/>
        <text x="160" y="408" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">⭐ APIFY</text>
        <text x="160" y="428" textAnchor="middle" fill="#a7f3d0" fontSize="10">Google Places search near user</text>

        {/* BOX */}
        <rect x="630" y="230" width="220" height="70" rx="10" fill="#1c1917" stroke="#f59e0b" strokeWidth="2.5"/>
        <text x="740" y="258" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">⭐ BOX</text>
        <text x="740" y="278" textAnchor="middle" fill="#fde68a" fontSize="10">Store PDFs + webhook triggers</text>

        {/* AWS SNS */}
        <rect x="630" y="380" width="220" height="60" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <text x="740" y="408" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">📱 AWS SNS</text>
        <text x="740" y="426" textAnchor="middle" fill="#94a3b8" fontSize="10">SMS to neighbor</text>

        {/* Neighbor */}
        <rect x="360" y="470" width="200" height="60" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
        <text x="460" y="498" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">📞 Neighbor</text>
        <text x="460" y="516" textAnchor="middle" fill="#94a3b8" fontSize="10">Receives call + SMS</text>

        {/* Arrows */}
        <line x1="230" y1="100" x2="355" y2="100" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arrow)"/>
        <text x="292" y="92" textAnchor="middle" fill="#a5b4fc" fontSize="9">voice</text>

        <line x1="470" y1="152" x2="450" y2="225" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arrow)"/>
        <text x="475" y="190" textAnchor="start" fill="#a5b4fc" fontSize="9">tool calls</text>

        <line x1="350" y1="300" x2="220" y2="380" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrow)"/>
        <text x="265" y="340" textAnchor="middle" fill="#6ee7b7" fontSize="9">search</text>

        <line x1="270" y1="390" x2="370" y2="295" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="4,3"/>
        <text x="340" y="355" textAnchor="middle" fill="#6ee7b7" fontSize="9">places</text>

        <line x1="580" y1="260" x2="625" y2="260" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrow)"/>
        <text x="602" y="252" textAnchor="middle" fill="#fcd34d" fontSize="9">upload</text>

        <line x1="630" y1="280" x2="585" y2="280" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="4,3"/>
        <text x="607" y="293" textAnchor="middle" fill="#fcd34d" fontSize="9">webhook</text>

        <path d="M 550 230 Q 600 180 580 150" fill="none" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arrow)"/>
        <text x="590" y="180" textAnchor="start" fill="#c4b5fd" fontSize="9">trigger call</text>

        <path d="M 470 150 Q 420 400 460 465" fill="none" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="4,3"/>
        <text x="410" y="430" textAnchor="middle" fill="#c4b5fd" fontSize="9">phone call</text>

        <line x1="580" y1="290" x2="660" y2="380" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)"/>
        <text x="635" y="340" textAnchor="middle" fill="#94a3b8" fontSize="9">SMS</text>

        <line x1="700" y1="440" x2="560" y2="490" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="4,3"/>

        <line x1="320" y1="250" x2="200" y2="140" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="4,3"/>
        <text x="240" y="190" textAnchor="middle" fill="#94a3b8" fontSize="9">SSE (map)</text>
      </svg>
    </div>
  );
}
