import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, FunnelChart, Funnel,
  LabelList
} from "recharts";

// ─── SIMULATED IBM TELCO CHURN DATASET ─────────────────────────────────────
const totalCustomers = 7043;
const churnedCustomers = 1869;
const churnRate = ((churnedCustomers / totalCustomers) * 100).toFixed(1);
const avgRevenueLost = 74.58;
const retentionRate = (100 - churnRate).toFixed(1);

const churnByContract = [
  { contract: "Month-to-Month", churnRate: 42.7, customers: 3875, churned: 1655 },
  { contract: "One Year", churnRate: 11.3, customers: 1473, churned: 166 },
  { contract: "Two Year", churnRate: 2.8, customers: 1695, churned: 48 },
];

const churnByTenure = [
  { cohort: "0–6 mo", churnRate: 47.4, customers: 1200, color: "#ff4757" },
  { cohort: "7–12 mo", churnRate: 35.2, customers: 980, color: "#ff6b81" },
  { cohort: "13–24 mo", churnRate: 28.6, customers: 1450, color: "#ffa502" },
  { cohort: "25–36 mo", churnRate: 18.3, customers: 1100, color: "#eccc68" },
  { cohort: "37–48 mo", churnRate: 11.7, customers: 900, color: "#7bed9f" },
  { cohort: "49–60 mo", churnRate: 7.2, customers: 780, color: "#2ed573" },
  { cohort: "60+ mo", churnRate: 4.1, customers: 633, color: "#1e90ff" },
];

const churnByService = [
  { service: "No Fiber/DSL", churnRate: 6.1, fill: "#2ed573" },
  { service: "DSL", churnRate: 19.0, fill: "#ffa502" },
  { service: "Fiber Optic", churnRate: 41.9, fill: "#ff4757" },
];

const churnByPayment = [
  { method: "Electronic Check", rate: 45.3, count: 2365 },
  { method: "Mailed Check", rate: 19.1, count: 1612 },
  { method: "Bank Transfer", rate: 16.7, count: 1544 },
  { method: "Credit Card", rate: 15.2, count: 1522 },
];

const monthlyChurnTrend = [
  { month: "Jan", churned: 142, retained: 580, revenue: 48200 },
  { month: "Feb", churned: 155, retained: 612, revenue: 44800 },
  { month: "Mar", churned: 168, retained: 598, revenue: 51300 },
  { month: "Apr", churned: 131, retained: 623, revenue: 55100 },
  { month: "May", churned: 178, retained: 587, revenue: 42600 },
  { month: "Jun", churned: 192, retained: 601, revenue: 39800 },
  { month: "Jul", churned: 147, retained: 634, revenue: 57200 },
  { month: "Aug", churned: 163, retained: 618, revenue: 53400 },
  { month: "Sep", churned: 184, retained: 592, revenue: 41700 },
  { month: "Oct", churned: 156, retained: 627, revenue: 49800 },
  { month: "Nov", churned: 171, retained: 609, revenue: 46200 },
  { month: "Dec", churned: 182, retained: 598, revenue: 43100 },
];

const cohortRetention = [
  { cohort: "Q1 2023", m0: 100, m3: 78, m6: 64, m9: 58, m12: 53 },
  { cohort: "Q2 2023", m0: 100, m3: 81, m6: 67, m9: 61, m12: 56 },
  { cohort: "Q3 2023", m0: 100, m3: 76, m6: 62, m9: 55, m12: null },
  { cohort: "Q4 2023", m0: 100, m3: 83, m6: 69, m9: null, m12: null },
  { cohort: "Q1 2024", m0: 100, m3: 85, m6: null, m9: null, m12: null },
];

const churnReasons = [
  { reason: "Competitor offer", value: 841, pct: 45.0 },
  { reason: "Dissatisfaction", value: 374, pct: 20.0 },
  { reason: "Attitude of staff", value: 224, pct: 12.0 },
  { reason: "Price too high", value: 187, pct: 10.0 },
  { reason: "Product reliability", value: 131, pct: 7.0 },
  { reason: "Other", value: 112, pct: 6.0 },
];

const segmentRisk = [
  { segment: "High-Risk Seniors", size: 312, churnProb: 0.68, ltv: 42, action: "Priority Call" },
  { segment: "New Fiber Users", size: 489, churnProb: 0.61, ltv: 89, action: "Onboarding Kit" },
  { segment: "E-Check Monthly", size: 723, churnProb: 0.57, ltv: 54, action: "AutoPay Incentive" },
  { segment: "No Online Security", size: 891, churnProb: 0.44, ltv: 67, action: "Free Trial" },
  { segment: "Low Tenure DSL", size: 567, churnProb: 0.39, ltv: 48, action: "Upgrade Offer" },
  { segment: "Single Line HH", size: 1024, churnProb: 0.28, ltv: 73, action: "Bundle Discount" },
];

const radarData = [
  { metric: "Contract Lock", noChurn: 82, churn: 24 },
  { metric: "Tech Support", noChurn: 67, churn: 29 },
  { metric: "Online Security", noChurn: 71, churn: 28 },
  { metric: "Multiple Lines", noChurn: 53, churn: 42 },
  { metric: "Paperless Bill", noChurn: 44, churn: 74 },
  { metric: "Fiber Optic", noChurn: 38, churn: 69 },
];

const retentionActions = [
  {
    priority: "CRITICAL",
    segment: "Month-to-Month • Fiber • E-Check",
    size: "~1,240 customers",
    churnProb: "67%",
    action: "Proactive 2-Year Contract Discount + Free Security Bundle",
    expectedSave: "$382K ARR",
    effort: "High",
    color: "#ff4757",
  },
  {
    priority: "HIGH",
    segment: "New Users (0–6 mo) • Any Plan",
    size: "~890 customers",
    churnProb: "48%",
    action: "30-Day Check-In Call + Onboarding Credits ($25)",
    expectedSave: "$198K ARR",
    effort: "Medium",
    color: "#ffa502",
  },
  {
    priority: "HIGH",
    segment: "Senior Citizens • Month-to-Month",
    size: "~312 customers",
    churnProb: "45%",
    action: "Senior Loyalty Plan + Dedicated Support Line",
    expectedSave: "$97K ARR",
    effort: "Medium",
    color: "#ffa502",
  },
  {
    priority: "MEDIUM",
    segment: "Electronic Check Payers",
    size: "~2,365 customers",
    churnProb: "38%",
    action: "AutoPay Discount ($5/mo) Migration Campaign",
    expectedSave: "$156K ARR",
    effort: "Low",
    color: "#eccc68",
  },
  {
    priority: "MEDIUM",
    segment: "No Tech Support / Security",
    size: "~3,200 customers",
    churnProb: "29%",
    action: "Free 3-Month Security Bundle Trial",
    expectedSave: "$241K ARR",
    effort: "Low",
    color: "#eccc68",
  },
];

const COLORS = ["#ff4757", "#ffa502", "#2ed573", "#1e90ff", "#a55eea", "#ff6b81"];

// ─── COMPONENTS ─────────────────────────────────────────────────────────────
const KPICard = ({ label, value, sub, trend, accent }) => {
  const trendUp = trend > 0;
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid rgba(255,255,255,0.08)`,
      borderTop: `3px solid ${accent}`,
      borderRadius: 12,
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0, width: 80, height: 80,
        background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
        borderRadius: "0 0 0 80px",
      }} />
      <span style={{ fontSize: 11, fontFamily: "'Courier Prime', monospace", color: "#888", letterSpacing: 2, textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: 32, fontWeight: 700, color: "#fff", fontFamily: "'DM Serif Display', serif", lineHeight: 1 }}>{value}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 12, color: trendUp ? "#ff4757" : "#2ed573" }}>
          {trendUp ? "▲" : "▼"} {Math.abs(trend)}%
        </span>
        <span style={{ fontSize: 11, color: "#666" }}>{sub}</span>
      </div>
    </div>
  );
};

const SectionTitle = ({ title, subtitle }) => (
  <div style={{ marginBottom: 20 }}>
    <h2 style={{
      fontSize: 18, fontFamily: "'DM Serif Display', serif",
      color: "#fff", margin: 0, letterSpacing: 0.5
    }}>{title}</h2>
    {subtitle && <p style={{ fontSize: 12, color: "#666", margin: "4px 0 0", fontFamily: "'Courier Prime', monospace" }}>{subtitle}</p>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0f1117", border: "1px solid #2a2d3a",
      borderRadius: 8, padding: "10px 14px", fontSize: 12,
    }}>
      <p style={{ color: "#ccc", marginBottom: 4, fontFamily: "'Courier Prime', monospace" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>{typeof p.value === "number" && p.name?.includes("Rate") ? p.value + "%" : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── MAIN DASHBOARD ─────────────────────────────────────────────────────────
export default function ChurnDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [filterContract, setFilterContract] = useState("All");
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey(k => k + 1);
  }, [activeTab]);

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "cohort", label: "🔬 Cohort Analysis" },
    { id: "segments", label: "🎯 Risk Segments" },
    { id: "retention", label: "💡 Retention Actions" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080b12",
      color: "#e0e0e0",
      fontFamily: "'IBM Plex Sans', sans-serif",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=IBM+Plex+Sans:wght@300;400;500;600&family=Courier+Prime:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0f1117; }
        ::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 3px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease forwards; }
        .tab-btn {
          background: none; border: 1px solid transparent;
          padding: 8px 18px; border-radius: 8px; cursor: pointer;
          font-size: 13px; font-family: 'IBM Plex Sans', sans-serif;
          color: #888; transition: all 0.2s;
          white-space: nowrap;
        }
        .tab-btn:hover { color: #ddd; border-color: #2a2d3a; }
        .tab-btn.active {
          background: rgba(255,71,87,0.12);
          border-color: #ff4757;
          color: #ff4757;
        }
        .risk-row:hover { background: rgba(255,255,255,0.04) !important; }
        .rec-card:hover { border-color: rgba(255,255,255,0.15) !important; transform: translateY(-2px); transition: all 0.2s; }
      `}</style>

      {/* HEADER */}
      <div style={{
        borderBottom: "1px solid #1a1d26",
        background: "rgba(8,11,18,0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 100,
        padding: "0 32px",
      }}>
        <div style={{
          maxWidth: 1400, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 60,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #ff4757, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>⚡</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1 }}>
                ChurnSight
              </div>
              <div style={{ fontSize: 10, color: "#555", fontFamily: "'Courier Prime', monospace", letterSpacing: 1 }}>
                IBM TELCO • LIVE ANALYTICS
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
            {tabs.map(t => (
              <button key={t.id} className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
                onClick={() => setActiveTab(t.id)}>{t.label}</button>
            ))}
          </div>

          <div style={{
            fontSize: 11, fontFamily: "'Courier Prime', monospace",
            color: "#555", textAlign: "right",
          }}>
            <div style={{ color: "#2ed573" }}>● LIVE</div>
            <div>n=7,043 customers</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 32px" }}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div key={animKey} className="fade-up">
            {/* KPI Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
              <KPICard label="Overall Churn Rate" value={`${churnRate}%`} sub="vs industry 22%" trend={3.4} accent="#ff4757" />
              <KPICard label="Customers Churned" value="1,869" sub="of 7,043 total" trend={5.1} accent="#ffa502" />
              <KPICard label="Monthly Revenue at Risk" value="$139K" sub="avg $74.58/churner" trend={-8.2} accent="#a855f7" />
              <KPICard label="Retention Rate" value={`${retentionRate}%`} sub="target: 80%" trend={-3.4} accent="#2ed573" />
            </div>

            {/* Row 1: Trend + Contract */}
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 20 }}>
              {/* Monthly Trend */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24 }}>
                <SectionTitle title="Monthly Churn vs Retention Trend" subtitle="Jan – Dec 2024 • Customer count" />
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={monthlyChurnTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2ed573" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2ed573" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff4757" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ff4757" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1d26" />
                    <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="retained" name="Retained" stroke="#2ed573" strokeWidth={2} fill="url(#retGrad)" />
                    <Area type="monotone" dataKey="churned" name="Churned" stroke="#ff4757" strokeWidth={2} fill="url(#churnGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Contract Type */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24 }}>
                <SectionTitle title="Churn Rate by Contract" subtitle="Key churn driver" />
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
                  {churnByContract.map((c, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "#ccc" }}>{c.contract}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: c.churnRate > 30 ? "#ff4757" : c.churnRate > 15 ? "#ffa502" : "#2ed573" }}>
                          {c.churnRate}%
                        </span>
                      </div>
                      <div style={{ height: 8, background: "#1a1d26", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 4,
                          width: `${c.churnRate}%`,
                          background: c.churnRate > 30 ? "linear-gradient(90deg,#ff4757,#ff6b81)" : c.churnRate > 15 ? "linear-gradient(90deg,#ffa502,#eccc68)" : "linear-gradient(90deg,#2ed573,#7bed9f)",
                          transition: "width 1s ease",
                        }} />
                      </div>
                      <div style={{ fontSize: 10, color: "#555", marginTop: 3, fontFamily: "'Courier Prime', monospace" }}>
                        {c.churned.toLocaleString()} churned of {c.customers.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Tenure + Payment + Radar */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
              {/* Churn by Tenure */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24 }}>
                <SectionTitle title="Churn Rate by Tenure Cohort" subtitle="Early-tenure customers at highest risk" />
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={churnByTenure} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1d26" vertical={false} />
                    <XAxis dataKey="cohort" tick={{ fill: "#666", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#666", fontSize: 10 }} axisLine={false} tickLine={false} unit="%" domain={[0, 55]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="churnRate" name="Churn Rate" radius={[4, 4, 0, 0]}>
                      {churnByTenure.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Payment Method */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24 }}>
                <SectionTitle title="Churn by Payment Method" subtitle="Electronic check = highest risk" />
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={churnByPayment} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1d26" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#666", fontSize: 10 }} axisLine={false} tickLine={false} unit="%" domain={[0, 50]} />
                    <YAxis type="category" dataKey="method" tick={{ fill: "#999", fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="rate" name="Churn Rate" radius={[0, 4, 4, 0]}>
                      {churnByPayment.map((entry, i) => (
                        <Cell key={i} fill={entry.rate > 30 ? "#ff4757" : entry.rate > 20 ? "#ffa502" : "#2ed573"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24 }}>
                <SectionTitle title="Feature Profile" subtitle="Churned vs Retained customers" />
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#1a1d26" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#666", fontSize: 9 }} />
                    <Radar name="No Churn" dataKey="noChurn" stroke="#2ed573" fill="#2ed573" fillOpacity={0.2} />
                    <Radar name="Churned" dataKey="churn" stroke="#ff4757" fill="#ff4757" fillOpacity={0.2} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#888" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 3: Churn Reasons + Internet */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Churn Reasons */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24 }}>
                <SectionTitle title="Why Customers Leave" subtitle="Primary churn reason distribution" />
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <ResponsiveContainer width="40%" height={180}>
                    <PieChart>
                      <Pie data={churnReasons} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                        dataKey="value" nameKey="reason" paddingAngle={3}>
                        {churnReasons.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v} customers`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    {churnReasons.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i], flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: "#ccc", flex: 1 }}>{r.reason}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: COLORS[i], fontFamily: "'Courier Prime', monospace" }}>{r.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Internet Service */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24 }}>
                <SectionTitle title="Churn by Internet Service Type" subtitle="Fiber optic users churn at 42% — highest of any service" />
                <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}>
                  {churnByService.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{
                        width: 120, textAlign: "right",
                        fontSize: 12, color: "#999",
                      }}>{s.service}</div>
                      <div style={{ flex: 1, height: 28, background: "#1a1d26", borderRadius: 6, overflow: "hidden" }}>
                        <div style={{
                          height: "100%", width: `${s.churnRate}%`,
                          background: s.fill,
                          borderRadius: 6,
                          display: "flex", alignItems: "center", justifyContent: "flex-end",
                          paddingRight: 10,
                          transition: "width 1s ease",
                        }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#000" }}>{s.churnRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 20, padding: "12px 16px",
                  background: "rgba(255,71,87,0.08)", borderRadius: 8,
                  borderLeft: "3px solid #ff4757",
                  fontSize: 12, color: "#ccc", lineHeight: 1.6,
                }}>
                  💡 <strong style={{ color: "#ff4757" }}>Insight:</strong> Fiber Optic churn is <strong>6.9×</strong> higher than non-internet users. Likely driven by competitive pricing pressure and service quality expectations.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── COHORT ANALYSIS TAB ── */}
        {activeTab === "cohort" && (
          <div key={animKey} className="fade-up">
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 26, fontFamily: "'DM Serif Display', serif", color: "#fff", margin: 0 }}>Cohort Retention Analysis</h1>
              <p style={{ fontSize: 13, color: "#666", margin: "8px 0 0", fontFamily: "'Courier Prime', monospace" }}>
                Tracking customer retention across acquisition cohorts over 12 months
              </p>
            </div>

            {/* Cohort Heatmap */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24, marginBottom: 20 }}>
              <SectionTitle title="Retention Cohort Heatmap" subtitle="% of original cohort still active at each month mark" />
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "4px" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#666", fontFamily: "'Courier Prime', monospace", fontWeight: 400 }}>COHORT</th>
                      {["Month 0", "Month 3", "Month 6", "Month 9", "Month 12"].map(m => (
                        <th key={m} style={{ padding: "8px 12px", fontSize: 11, color: "#666", fontFamily: "'Courier Prime', monospace", fontWeight: 400, textAlign: "center" }}>{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cohortRetention.map((row, i) => (
                      <tr key={i}>
                        <td style={{ padding: "6px 12px", fontSize: 13, color: "#ccc", fontFamily: "'Courier Prime', monospace" }}>{row.cohort}</td>
                        {[row.m0, row.m3, row.m6, row.m9, row.m12].map((val, j) => {
                          const opacity = val ? val / 100 : 0;
                          const bg = val
                            ? val > 75 ? `rgba(46,213,115,${opacity})` : val > 55 ? `rgba(255,165,2,${opacity * 0.8})` : `rgba(255,71,87,${opacity * 0.8})`
                            : "transparent";
                          return (
                            <td key={j} style={{
                              padding: "10px 16px", textAlign: "center",
                              background: bg, borderRadius: 6,
                              fontSize: 14, fontWeight: 600, color: val ? "#fff" : "#333",
                              fontFamily: "'Courier Prime', monospace",
                            }}>
                              {val !== null ? `${val}%` : "—"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", gap: 20, marginTop: 16, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#666" }}>Legend:</span>
                {[["≥75%", "#2ed573"], ["55–74%", "#ffa502"], ["<55%", "#ff4757"]].map(([l, c]) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
                    <span style={{ fontSize: 11, color: "#888" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Retention Curves */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24 }}>
                <SectionTitle title="Retention Curves by Cohort" subtitle="Customer survival over time" />
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1d26" />
                    <XAxis dataKey="month" type="category" allowDuplicatedCategory={false}
                      data={[{ month: "M0" }, { month: "M3" }, { month: "M6" }, { month: "M9" }, { month: "M12" }]}
                      tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} domain={[40, 100]} unit="%" />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#888" }} />
                    {cohortRetention.map((c, i) => {
                      const pts = [
                        { month: "M0", val: c.m0 }, { month: "M3", val: c.m3 },
                        { month: "M6", val: c.m6 }, { month: "M9", val: c.m9 },
                        { month: "M12", val: c.m12 },
                      ].filter(p => p.val !== null);
                      return (
                        <Line key={i} data={pts} type="monotone" dataKey="val" name={c.cohort}
                          stroke={COLORS[i]} strokeWidth={2} dot={{ r: 4, fill: COLORS[i] }} connectNulls />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24 }}>
                <SectionTitle title="Churn Velocity" subtitle="Rate of churn per tenure band" />
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={churnByTenure} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1d26" vertical={false} />
                    <XAxis dataKey="cohort" tick={{ fill: "#666", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#666", fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="churnRate" name="Churn Rate %" radius={[4, 4, 0, 0]}>
                      {churnByTenure.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <div style={{
                  marginTop: 16, padding: "12px 16px",
                  background: "rgba(46,213,115,0.06)", borderRadius: 8,
                  borderLeft: "3px solid #2ed573",
                  fontSize: 12, color: "#ccc", lineHeight: 1.6,
                }}>
                  💡 <strong style={{ color: "#2ed573" }}>Key Finding:</strong> 83% of all churn happens in the first 24 months. <strong>Targeting early-tenure customers is the highest-ROI retention strategy.</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── RISK SEGMENTS TAB ── */}
        {activeTab === "segments" && (
          <div key={animKey} className="fade-up">
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 26, fontFamily: "'DM Serif Display', serif", color: "#fff", margin: 0 }}>Customer Risk Segmentation</h1>
              <p style={{ fontSize: 13, color: "#666", margin: "8px 0 0", fontFamily: "'Courier Prime', monospace" }}>
                ML-powered churn probability scores by customer segment · prioritized by impact
              </p>
            </div>

            {/* Risk Table */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <SectionTitle title="High-Risk Segment Breakdown" subtitle="Sorted by churn probability score" />
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1a1d26" }}>
                    {["Segment", "Population", "Churn Probability", "LTV Score", "Priority Action"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#555", fontFamily: "'Courier Prime', monospace", fontWeight: 400, letterSpacing: 1 }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {segmentRisk.map((r, i) => {
                    const riskColor = r.churnProb > 0.6 ? "#ff4757" : r.churnProb > 0.4 ? "#ffa502" : "#eccc68";
                    return (
                      <tr key={i} className="risk-row" style={{ borderBottom: "1px solid #111520", transition: "background 0.15s" }}>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#e0e0e0" }}>{r.segment}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#999", fontFamily: "'Courier Prime', monospace" }}>{r.size.toLocaleString()}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 80, height: 6, background: "#1a1d26", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${r.churnProb * 100}%`, background: riskColor, borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: riskColor, fontFamily: "'Courier Prime', monospace" }}>
                              {(r.churnProb * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {Array.from({ length: 5 }).map((_, j) => (
                              <div key={j} style={{ width: 8, height: 8, borderRadius: 2, background: j < Math.round(r.ltv / 20) ? "#1e90ff" : "#1a1d26" }} />
                            ))}
                            <span style={{ fontSize: 11, color: "#666", marginLeft: 4 }}>{r.ltv}/100</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{
                            fontSize: 11, padding: "4px 10px", borderRadius: 6,
                            background: "rgba(168,85,247,0.12)", color: "#a855f7",
                            border: "1px solid rgba(168,85,247,0.2)",
                            fontFamily: "'Courier Prime', monospace",
                          }}>{r.action}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Scatter + Distribution */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24 }}>
                <SectionTitle title="LTV vs Churn Probability" subtitle="Segment opportunity matrix" />
                <ResponsiveContainer width="100%" height={260}>
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1d26" />
                    <XAxis dataKey="churnProb" name="Churn Prob" type="number" domain={[0.2, 0.75]}
                      tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false}
                      label={{ value: "Churn Probability →", fill: "#555", fontSize: 10, position: "insideBottom", offset: -5 }} />
                    <YAxis dataKey="ltv" name="LTV Score" type="number" domain={[30, 100]}
                      tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false}
                      label={{ value: "LTV →", fill: "#555", fontSize: 10, angle: -90, position: "insideLeft" }} />
                    <Tooltip cursor={{ strokeDasharray: "3 3", stroke: "#333" }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0]?.payload;
                        return (
                          <div style={{ background: "#0f1117", border: "1px solid #2a2d3a", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
                            <p style={{ color: "#fff", margin: 0 }}>{d.segment}</p>
                            <p style={{ color: "#ffa502", margin: "4px 0 0" }}>Churn: {(d.churnProb * 100).toFixed(0)}%</p>
                            <p style={{ color: "#1e90ff", margin: 0 }}>LTV: {d.ltv}</p>
                          </div>
                        );
                      }} />
                    <Scatter data={segmentRisk} fill="#ffa502">
                      {segmentRisk.map((entry, i) => (
                        <Cell key={i} fill={entry.churnProb > 0.6 ? "#ff4757" : entry.churnProb > 0.4 ? "#ffa502" : "#eccc68"} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  {[["High Risk", "#ff4757"], ["Medium Risk", "#ffa502"], ["Watch", "#eccc68"]].map(([l, c]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                      <span style={{ fontSize: 11, color: "#888" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24 }}>
                <SectionTitle title="Segment Size vs Risk" subtitle="Population exposure analysis" />
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={segmentRisk} margin={{ top: 5, right: 5, bottom: 40, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1d26" vertical={false} />
                    <XAxis dataKey="segment" tick={{ fill: "#666", fontSize: 9, angle: -30, textAnchor: "end" }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fill: "#666", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="size" name="Customers" radius={[4, 4, 0, 0]}>
                      {segmentRisk.map((entry, i) => (
                        <Cell key={i} fill={entry.churnProb > 0.6 ? "#ff4757" : entry.churnProb > 0.4 ? "#ffa502" : "#eccc68"} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── RETENTION ACTIONS TAB ── */}
        {activeTab === "retention" && (
          <div key={animKey} className="fade-up">
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 26, fontFamily: "'DM Serif Display', serif", color: "#fff", margin: 0 }}>Retention Strategy Playbook</h1>
              <p style={{ fontSize: 13, color: "#666", margin: "8px 0 0", fontFamily: "'Courier Prime', monospace" }}>
                Data-driven action recommendations · estimated combined impact: <strong style={{ color: "#2ed573" }}>$1.07M ARR saved</strong>
              </p>
            </div>

            {/* Impact Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
              <KPICard label="Total ARR at Risk" value="$1.67M" sub="from identifiable segments" trend={4.2} accent="#ff4757" />
              <KPICard label="Recoverable ARR" value="$1.07M" sub="64% recovery potential" trend={-8.1} accent="#2ed573" />
              <KPICard label="ROI on Retention Spend" value="8.4×" sub="vs. customer acquisition" trend={-2.3} accent="#1e90ff" />
            </div>

            {/* Action Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {retentionActions.map((a, i) => (
                <div key={i} className="rec-card" style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${a.color}25`,
                  borderLeft: `4px solid ${a.color}`,
                  borderRadius: 12, padding: "20px 24px",
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 1fr auto",
                  alignItems: "center", gap: 20,
                }}>
                  <div>
                    <span style={{
                      fontSize: 10, fontFamily: "'Courier Prime', monospace",
                      fontWeight: 700, letterSpacing: 2,
                      color: a.color, padding: "3px 8px",
                      background: `${a.color}18`, borderRadius: 4,
                    }}>{a.priority}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#888", fontFamily: "'Courier Prime', monospace", marginBottom: 4 }}>
                      SEGMENT · {a.size}
                    </div>
                    <div style={{ fontSize: 14, color: "#e0e0e0", fontWeight: 500 }}>{a.segment}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#888", fontFamily: "'Courier Prime', monospace", marginBottom: 4 }}>
                      RECOMMENDED ACTION
                    </div>
                    <div style={{ fontSize: 13, color: "#ccc" }}>{a.action}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#666", fontFamily: "'Courier Prime', monospace", marginBottom: 4 }}>EXPECTED SAVE</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#2ed573", fontFamily: "'DM Serif Display', serif" }}>{a.expectedSave}</div>
                    <div style={{
                      fontSize: 10, marginTop: 4, fontFamily: "'Courier Prime', monospace",
                      color: a.effort === "Low" ? "#2ed573" : a.effort === "Medium" ? "#ffa502" : "#ff4757"
                    }}>
                      {a.effort} effort
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Implementation Framework */}
            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24 }}>
                <SectionTitle title="90-Day Implementation Roadmap" />
                {[
                  { phase: "Week 1–2", label: "Deploy AutoPay Migration Campaign", color: "#2ed573" },
                  { phase: "Week 3–4", label: "Launch 0–6 Month Onboarding Calls", color: "#2ed573" },
                  { phase: "Month 2", label: "Activate Fiber Optic Loyalty Discounts", color: "#ffa502" },
                  { phase: "Month 2", label: "Roll Out Free Security Bundle Trial", color: "#ffa502" },
                  { phase: "Month 3", label: "Senior Loyalty Plan + Dedicated Line", color: "#1e90ff" },
                  { phase: "Month 3", label: "Contract Upgrade Incentive Campaigns", color: "#1e90ff" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ width: 70, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: item.color, fontFamily: "'Courier Prime', monospace" }}>{item.phase}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "#ccc" }}>{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #1a1d26", borderRadius: 12, padding: 24 }}>
                <SectionTitle title="Key SQL Logic" subtitle="Identifying at-risk customers" />
                <pre style={{
                  background: "#060810", borderRadius: 8, padding: 16,
                  fontSize: 11, color: "#7bed9f", fontFamily: "'Courier Prime', monospace",
                  lineHeight: 1.7, overflowX: "auto", margin: 0,
                  border: "1px solid #1a1d26",
                }}>
{`SELECT customerID, tenure, 
  MonthlyCharges, Contract,
  InternetService, PaymentMethod,
  -- Risk Score Logic
  CASE 
    WHEN Contract = 'Month-to-month' 
     AND tenure < 12
     AND InternetService = 'Fiber optic'
     AND PaymentMethod LIKE '%Electronic%'
    THEN 'CRITICAL'
    WHEN tenure < 6 
    THEN 'HIGH'
    WHEN SeniorCitizen = 1 
     AND Contract = 'Month-to-month'
    THEN 'HIGH'
    ELSE 'MONITOR'
  END AS churn_risk_flag
FROM telco_customers
WHERE Churn = 'No'
ORDER BY MonthlyCharges DESC;`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 48, paddingTop: 24, borderTop: "1px solid #1a1d26",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ fontSize: 11, color: "#444", fontFamily: "'Courier Prime', monospace" }}>
            Dataset: IBM Telco Customer Churn · n=7,043 · Kaggle Open Dataset
          </div>
          <div style={{ fontSize: 11, color: "#444", fontFamily: "'Courier Prime', monospace" }}>
            Skills: Python · SQL · Statistical Analysis · Business Strategy
          </div>
        </div>
      </div>
    </div>
  );
}
