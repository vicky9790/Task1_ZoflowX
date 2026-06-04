import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  ExternalLink, 
  TrendingUp, 
  DollarSign, 
  UserPlus, 
  Flame, 
  Handshake, 
  Cpu, 
  UserCheck, 
  Calendar, 
  Mail, 
  Copy, 
  Check, 
  ChevronRight, 
  ArrowLeft,
  LayoutDashboard,
  BarChart3,
  AlertCircle,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend
} from "recharts";

import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import { processCompanies } from "./data/companies";
import { analyzeCompanyWithGemini } from "./services/gemini";
import "./App.css";

// Signal helpers for icons, colors, and human-readable text
const getSignalConfig = (type) => {
  switch (type) {
    case "funding":
      return { icon: <DollarSign size={15} />, color: "emerald", label: "Funding Round" };
    case "hiring":
      return { icon: <UserPlus size={15} />, color: "amber", label: "Talent Scaling" };
    case "product_launch":
      return { icon: <Flame size={15} />, color: "rose", label: "Product Launch" };
    case "expansion":
      return { icon: <MapPin size={15} />, color: "blue", label: "Market Expansion" };
    case "partnership":
      return { icon: <Handshake size={15} />, color: "indigo", label: "Strategic Partnership" };
    case "tech_adoption":
      return { icon: <Cpu size={15} />, color: "cyan", label: "Tech Stack Update" };
    case "leadership_change":
      return { icon: <UserCheck size={15} />, color: "violet", label: "Leadership Change" };
    case "market_entry":
      return { icon: <Globe size={15} />, color: "teal", label: "Market Entry" };
    default:
      return { icon: <AlertCircle size={15} />, color: "gray", label: "Business Signal" };
  }
};


function App() {
  const [activeTab, setActiveTab] = useState("radar"); // "radar" or "analytics"
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  // Gemini AI state — key is loaded from .env, never exposed to users
  // Load cached Gemini analysis from localStorage (if any)
  const [geminiData, setGeminiData] = useState(() => {
    try {
      const saved = localStorage.getItem("gemini_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear invalid old cached data (e.g. scores > 100 or missing breakdown)
        const validData = {};
        for (const key in parsed) {
          if (parsed[key].opportunityScore <= 100 && parsed[key].scoreBreakdown) {
            validData[key] = parsed[key];
          }
        }
        return validData;
      }
      return {};
    } catch (e) {
      console.warn("Failed to parse cached Gemini data", e);
      return {};
    }
  });
  // Sync geminiData to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("gemini_data", JSON.stringify(geminiData));
    } catch (e) {
      console.warn("Failed to store Gemini data", e);
    }
  }, [geminiData]);
  const lastGeminiCallRef = useRef(0);
  const [geminiCallCount, setGeminiCallCount] = useState(0);
  const callCountResetRef = useRef(Date.now());
  const [apiError, setApiError] = useState("");
  const [loadingCompanyId, setLoadingCompanyId] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    industry: "All",
    potential: "All",
    sort: "score_desc",
    minScore: 0,
  });

  // Calculate scan timestamp once
  const lastScan = useMemo(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, []);

  const allCompanies = useMemo(() => processCompanies(), []);

  // Filter and sort companies based on combined (Gemini + Local) data
  const filteredCompanies = useMemo(() => {
    return allCompanies
      .map((c) => {
        const aiData = geminiData[c.id];
        return {
          ...c,
          opportunityScore: aiData?.opportunityScore ?? c.opportunityScore,
          businessPotential: aiData?.businessPotential ?? c.businessPotential,
        };
      })
      .filter((company) => {
        const matchesSearch = !filters.search || 
          company.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          company.industry.toLowerCase().includes(filters.search.toLowerCase()) ||
          company.recommendedService.toLowerCase().includes(filters.search.toLowerCase()) ||
          company.signals.some((s) => s.detail.toLowerCase().includes(filters.search.toLowerCase()));

        const matchesIndustry = filters.industry === "All" || company.industry === filters.industry;
        const matchesPotential = filters.potential === "All" || company.businessPotential === filters.potential;
        const matchesScore = company.opportunityScore >= filters.minScore;

        return matchesSearch && matchesIndustry && matchesPotential && matchesScore;
      })
      .sort((a, b) => {
        if (filters.sort === "score_desc") return b.opportunityScore - a.opportunityScore;
        if (filters.sort === "score_asc") return a.opportunityScore - b.opportunityScore;
        if (filters.sort === "name_asc") return a.name.localeCompare(b.name);
        if (filters.sort === "signals_desc") return b.signals.length - a.signals.length;
        return 0;
      });
  }, [allCompanies, filters, geminiData]);

  // Handle selected company synchronization
  const selectedCompany = useMemo(() => {
    const found = filteredCompanies.find((c) => c.id === selectedCompanyId);
    return found || filteredCompanies[0] || null;
  }, [filteredCompanies, selectedCompanyId]);

  // Auto-trigger Gemini analysis whenever selected company changes
  useEffect(() => {
    if (!selectedCompany) return;

    const companyId = selectedCompany.id;
    if (geminiData[companyId] || loadingCompanyId === companyId) return;

    const now = Date.now();
    // Reset call count each minute
    if (now - callCountResetRef.current >= 60000) {
      setGeminiCallCount(0);
      callCountResetRef.current = now;
    }
    if (now - lastGeminiCallRef.current < 60000) {
      setApiError("Rate limit reached: please wait a minute before another AI analysis.");
      return;
    }
    lastGeminiCallRef.current = now;

    let isMounted = true;

    const runAI = async () => {
      setLoadingCompanyId(companyId);
      setApiError("");
      try {
        const data = await analyzeCompanyWithGemini(selectedCompany);
        if (isMounted) {
          setGeminiData(prev => ({
            ...prev,
            [companyId]: data,
          }));
        }
      } catch (err) {
        if (isMounted) {
          setApiError(err.message || "Gemini analysis failed. Check the console for details.");
        }
      } finally {
        if (isMounted) {
          setLoadingCompanyId(null);
        }
      }
    };

    runAI();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany, geminiData, loadingCompanyId]);

  // Re-run Gemini analysis manually (refresh button)
  const handleRegenerateAI = async () => {
    if (!selectedCompany) return;
    const companyId = selectedCompany.id;
    setLoadingCompanyId(companyId);
    setApiError("");
    try {
      const data = await analyzeCompanyWithGemini(selectedCompany);
      setGeminiData(prev => ({ ...prev, [companyId]: data }));
    } catch (err) {
      setApiError(err.message || "Gemini analysis failed. Check the console for details.");
    } finally {
      setLoadingCompanyId(null);
    }
  };

  // Full AI scan – processes every company respecting free‑tier limits
  const runFullScan = useCallback(async (progressCallback) => {
    const companiesToScan = allCompanies.filter(c => !geminiData[c.id]);
    const total = companiesToScan.length;
    let done = 0;
    for (const company of companiesToScan) {
      // Respect rate limit: max 5 calls per minute
      if (geminiCallCount >= 5) {
        const waitMs = 60000 - (Date.now() - callCountResetRef.current);
        if (waitMs > 0) await new Promise(r => setTimeout(r, waitMs));
        setGeminiCallCount(0);
        callCountResetRef.current = Date.now();
      }
      try {
        const data = await analyzeCompanyWithGemini(company);
        setGeminiData(prev => ({ ...prev, [company.id]: data }));
        // Store in localStorage immediately
        const stored = JSON.parse(localStorage.getItem("gemini_data") || "{}");
        stored[company.id] = data;
        localStorage.setItem("gemini_data", JSON.stringify(stored));
        setGeminiCallCount(c => c + 1);
      } catch (e) {
        console.error("Full scan error for", company.id, e);
        // Continue with next company
      }
      done++;
      if (progressCallback) progressCallback({ done, total });
    }
  }, [allCompanies, geminiData, geminiCallCount]);

  // Generate local rule-based outreach email as fallback
  const fallbackOutreachEmail = useMemo(() => {
    if (!selectedCompany) return "";
    return `Subject: Partnership Proposal: AI-Powered ${selectedCompany.recommendedService} for ${selectedCompany.name}

Hi Team,

I noticed your recent signal: "${selectedCompany.signals[0]?.detail || "significant industry momentum"}". Congratulations on this progress!

With your current trajectory and scaling requirements, I believe introducing our ${selectedCompany.recommendedService} could provide massive leverage. We've helped similar companies streamline operations and boost margins by up to 25%.

Would you be open to a quick 10-minute introduction call this Thursday?

Warm regards,

[Your Name]
Opportunity Outreach Team`;
  }, [selectedCompany]);

  // Compute actual company parameters to display (overridden by Gemini if loaded)
  const displayCompany = useMemo(() => {
    if (!selectedCompany) return null;
    const aiData = geminiData[selectedCompany.id];
    if (aiData) {
      return {
        ...selectedCompany,
        // Score & potential stay deterministic from local data — AI only enriches text fields
        opportunityScore: selectedCompany.opportunityScore,
        businessPotential: selectedCompany.businessPotential,
        reason: aiData.reason ?? selectedCompany.reason,
        recommendedService: aiData.recommendedService ?? selectedCompany.recommendedService,
        recommendedAction: aiData.recommendedAction ?? selectedCompany.recommendedAction,
        outreachEmail: aiData.outreachEmail ?? "",
        scoreBreakdown: null  // breakdown always comes from local signals
      };
    }
    return {
      ...selectedCompany,
      outreachEmail: fallbackOutreachEmail
    };
  }, [selectedCompany, geminiData, fallbackOutreachEmail]);

  const handleCopyOutreach = () => {
    if (displayCompany) {
      navigator.clipboard.writeText(displayCompany.outreachEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Recharts Analytics calculations using active scores
  const industryChartData = useMemo(() => {
    const group = {};
    allCompanies.forEach((c) => {
      const aiData = geminiData[c.id];
      const score = aiData ? aiData.opportunityScore : c.opportunityScore;

      if (!group[c.industry]) {
        group[c.industry] = { name: c.industry, count: 0, totalScore: 0 };
      }
      group[c.industry].count += 1;
      group[c.industry].totalScore += score;
    });

    return Object.values(group).map((ind) => ({
      name: ind.name,
      avgScore: Math.round(ind.totalScore / ind.count),
      count: ind.count,
    }));
  }, [allCompanies, geminiData]);

  const potentialChartData = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    allCompanies.forEach((c) => {
      const aiData = geminiData[c.id];
      const potential = aiData ? aiData.businessPotential : c.businessPotential;
      counts[potential] = (counts[potential] || 0) + 1;
    });

    return Object.keys(counts).map((key) => ({
      name: `${key} Potential`,
      value: counts[key],
    }));
  }, [allCompanies, geminiData]);

  const COLORS = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#3b82f6",
    chart: ["#8b5cf6", "#3b82f6", "#10b981", "#ec4899", "#f59e0b", "#06b6d4"],
  };

  // Auto‑run full scan once on first load (dev helper)
  useEffect(() => {
    // Progress callback simply logs to console – can be removed later
    const progress = ({ done, total }) => console.log(`Full scan progress: ${done}/${total}`);
    runFullScan(progress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-container">
      {/* Brand & Stats Header */}
      <Header companies={allCompanies} lastScan={lastScan} onFullScan={runFullScan} />

      {/* Main Tabs Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === "radar" ? "tab-btn--active" : ""}`}
          onClick={() => { setActiveTab("radar"); setIsMobileDetailOpen(false); }}
        >
          <LayoutDashboard size={16} />
          Radar Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === "analytics" ? "tab-btn--active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          <BarChart3 size={16} />
          Signal Analytics
        </button>
      </div>

      {activeTab === "radar" ? (
        <>
          {/* Filtering Controls */}
          <FilterBar filters={filters} onFilterChange={setFilters} />

          {/* Dual Panel Layout */}
          <div className="dashboard-content">
            {/* List Panel */}
            <div className={`list-panel ${isMobileDetailOpen ? "list-panel--hidden" : ""}`}>
              <div className="list-panel-header">
                <span className="results-count">
                  Found <strong>{filteredCompanies.length}</strong> matching targets
                </span>
              </div>

              {filteredCompanies.length > 0 ? (
                <div className="company-list">
                  {filteredCompanies.map((company) => {
                    const isSelected = selectedCompany && selectedCompany.id === company.id;
                    const potentialClass = `potential--${company.businessPotential.toLowerCase()}`;
                    const isAiScanned = !!geminiData[company.id];

                    return (
                      <div
                        key={company.id}
                        className={`company-card ${isSelected ? "company-card--selected" : ""}`}
                        onClick={() => {
                          setSelectedCompanyId(company.id);
                          setIsMobileDetailOpen(true);
                          setCopied(false);
                        }}
                      >
                        <div className="company-card-main">
                          <span className="company-logo">{company.logo}</span>
                          <div className="company-info">
                            <h3 className="company-name">
                              {company.name}
                              {isAiScanned && <span className="ai-badge-sparkle" title="Gemini AI Analyzed">✨ AI Powered ✓</span>}
                            </h3>
                            <div className="company-tags">
                              <span className="tag-industry">{company.industry}</span>
                              <span className="tag-stage">{company.size}</span>
                            </div>
                          </div>
                          
                          <div className="score-badge-wrap">
                            <div className={`score-badge ${company.opportunityScore >= 70 ? "score--high" : company.opportunityScore >= 50 ? "score--med" : "score--low"}`}>
                              {company.opportunityScore}
                            </div>
                            <span className={`potential-dot ${potentialClass}`} title={`${company.businessPotential} Business Potential`} />
                          </div>
                        </div>
                        
                        <p className="card-excerpt">{company.description}</p>
                        
                        <div className="card-key-signals">
                          <span className="key-signals-title">Key Signals</span>
                          <ul>
                            {company.signals.slice(0, 4).map((s, i) => (
                              <li key={i}>✓ {s.detail}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <AlertCircle size={40} className="empty-icon" />
                  <h4>No Targets Found</h4>
                  <p>Try widening your search terms or lowering the minimum score filter.</p>
                  <button 
                    className="clear-filters-btn"
                    onClick={() => setFilters({ search: "", industry: "All", potential: "All", sort: "score_desc", minScore: 0 })}
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Details Panel */}
            <div className={`details-panel ${isMobileDetailOpen ? "details-panel--open" : ""}`}>
              {selectedCompany ? (
                <div className="details-container">
                  {/* Mobile Back Button */}
                  <button className="back-btn" onClick={() => setIsMobileDetailOpen(false)}>
                    <ArrowLeft size={16} /> Back to radar list
                  </button>

                  {/* Gemini Loading Spinner */}
                  {loadingCompanyId === selectedCompany.id ? (
                    <div className="ai-loading-container">
                      <div className="ai-loader-pulse">
                        <Sparkles size={32} className="ai-loader-icon" />
                      </div>
                      <h3>Gemini AI Scrutinizing Signal Data...</h3>
                      <p>Evaluating latest funding stages, organizational growth, and drafting outreach templates...</p>
                    </div>
                  ) : (
                    <>
                      {/* API Error Notification */}
                      {apiError && (
                        <div className="api-error-box">
                          <AlertCircle size={16} />
                          <span>{apiError}</span>
                          <button className="error-retry-btn" onClick={handleRegenerateAI}>
                            Retry
                          </button>
                        </div>
                      )}

                      {/* ── 1. COMPANY HEADER ── */}
                      <div className="details-header">
                        <div className="details-logo-wrap">
                          <span className="details-logo">{selectedCompany.logo}</span>
                        </div>
                        <div className="details-identity">
                          <div className="details-title-row">
                            <h2>{selectedCompany.name}</h2>
                            <a
                              href={`https://${selectedCompany.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="website-link"
                            >
                              {selectedCompany.website} <ExternalLink size={12} />
                            </a>
                          </div>
                          <div className="details-meta-row">
                            <span className="meta-pill"><Building2 size={12} /> {selectedCompany.industry}</span>
                            <span className="meta-pill"><Users size={12} /> {selectedCompany.employees} Employees</span>
                            <span className="meta-pill"><MapPin size={12} /> {selectedCompany.location}</span>
                          </div>
                        </div>
                        <button className="ai-refresh-btn" onClick={handleRegenerateAI} title="Regenerate AI Analysis">
                          <RefreshCw size={14} />
                          <span>Scan target</span>
                        </button>
                      </div>

                      <p className="details-description">{selectedCompany.description}</p>

                      {/* ── 2. GEMINI AI EVALUATION ── */}
                      <div className="detail-card AI-reason-card">
                        <h4 className="detail-card-title">
                          {geminiData[selectedCompany.id] ? "✨ Gemini AI Evaluation" : "📊 Business Analysis"}
                        </h4>
                        <p className="reason-text">{displayCompany.reason}</p>
                      </div>

                      {/* ── 3. OPPORTUNITY SCORE ── */}
                      <div className="scoring-grid">
                        <div className="detail-card dial-card">
                          <h4 className="detail-card-title">Opportunity Score</h4>
                          <div className="dial-content">
                            <div className={`gauge-ring ${displayCompany.opportunityScore >= 70 ? "gauge--high" : displayCompany.opportunityScore >= 50 ? "gauge--med" : "gauge--low"}`}>
                              <svg width="100" height="100" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" className="gauge-bg" />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="42"
                                  className="gauge-progress"
                                  strokeDasharray="264"
                                  strokeDashoffset={264 - (264 * displayCompany.opportunityScore) / 100}
                                />
                              </svg>
                              <span className="gauge-value">{displayCompany.opportunityScore}</span>
                            </div>
                            <div className="dial-labels">
                              <span className={`badge-potential potential--${displayCompany.businessPotential.toLowerCase()}`}>
                                {displayCompany.businessPotential} Potential
                              </span>
                              <span className="scoring-stage">{selectedCompany.size}</span>
                              {geminiData[selectedCompany.id] && (
                                <span className="gemini-verified-pill">
                                  <Sparkles size={9} /> AI Powered ✓
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="score-breakdown">
                            <h5 className="breakdown-title">Score Breakdown</h5>
                            <ul className="breakdown-list">
                              {selectedCompany.signals.map((sig, i) => (
                                <li key={i}>
                                  <span>{getSignalConfig(sig.type).label}</span>
                                  <span className="breakdown-score">+{sig.weight || 10}</span>
                                </li>
                              ))}
                              <li className="breakdown-total">
                                <span>Total Score</span>
                                <span>{displayCompany.opportunityScore}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* ── 4. RECOMMENDED ACTIONS + 5. OUTREACH EMAIL ── */}
                      <div className="detail-card copilot-card">
                        <div className="copilot-header">
                          <div className="copilot-title-wrap">
                            <Mail size={18} className="copilot-icon" />
                            <h4 className="detail-card-title">Outreach Campaign Copilot</h4>
                          </div>
                          <span className="recommended-pill">Recommended Outreach</span>
                        </div>

                        <div className="recommendation-accent-box">
                          <div className="recommended-actions-list">
                            <strong>Recommended Actions</strong>
                            <ul>
                              {displayCompany.recommendedAction.split('\n').map((action, i) => (
                                <li key={i}>{action}</li>
                              ))}
                            </ul>
                          </div>
                          <p className="recommendation-service">Target Offering: <strong>{displayCompany.recommendedService}</strong></p>
                        </div>

                        <div className="email-draft-box">
                          <div className="email-draft-header">
                            <span>{geminiData[selectedCompany.id] ? "✨ Gemini Prospecting Email Draft" : "Prospecting Email Draft"}</span>
                            <button className="copy-btn" onClick={handleCopyOutreach}>
                              {copied ? <Check size={14} className="copy-success-icon" /> : <Copy size={14} />}
                              {copied ? "Copied!" : "Copy Template"}
                            </button>
                          </div>
                          <pre className="email-draft-body">{displayCompany.outreachEmail}</pre>
                        </div>
                      </div>

                      {/* ── 6. SIGNAL HISTORY ── */}
                      <div className="detail-card signals-timeline-card">
                        <h4 className="detail-card-title">Signal History</h4>
                        <div className="timeline">
                          {selectedCompany.signals.map((signal, index) => {
                            const cfg = getSignalConfig(signal.type);
                            return (
                              <div key={index} className="timeline-item">
                                <div className={`timeline-icon timeline-icon--${cfg.color}`}>
                                  {cfg.icon}
                                </div>
                                <div className="timeline-content">
                                  <div className="timeline-header">
                                    <span className="timeline-label">{cfg.label}</span>
                                    <div className="timeline-meta">
                                      <span className="timeline-source">via {signal.source}</span>
                                      <span className="timeline-date"><Calendar size={10} /> {signal.date}</span>
                                    </div>
                                  </div>
                                  <p className="timeline-detail">{signal.detail}</p>
                                  <div className="signal-weight-bar-wrap">
                                    <span className="weight-label">Signal Impact: +{signal.weight}</span>
                                    <div className="weight-track">
                                      <div className={`weight-fill fill--${cfg.color}`} style={{ width: `${(signal.weight / 35) * 100}%` }} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="empty-details">
                  <TrendingUp size={48} className="details-empty-icon" />
                  <p>Select a company target to analyze key indicators and copy outreach campaigns.</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Analytics View */
        <div className="analytics-content">
          <div className="analytics-grid">
            {/* Avg Score by Industry */}
            <div className="chart-card">
              <h3 className="chart-card-title">Average Opportunity Score by Industry (Combined Radar)</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={industryChartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                    <XAxis 
                      dataKey="name" 
                      stroke="var(--text)" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="var(--text)" 
                      fontSize={11} 
                      domain={[0, 100]} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: "rgba(22, 23, 29, 0.9)", 
                        border: "1px solid var(--border)", 
                        borderRadius: "8px",
                        color: "var(--text-h)"
                      }}
                    />
                    <Bar dataKey="avgScore" name="Avg Opportunity Score" radius={[6, 6, 0, 0]}>
                      {industryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Target Breakdown by Potential */}
            <div className="chart-card">
              <h3 className="chart-card-title">Company Potential Breakdown</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={potentialChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill={COLORS.high} />
                      <Cell fill={COLORS.medium} />
                      <Cell fill={COLORS.low} />
                    </Pie>
                    <Tooltip
                      contentStyle={{ 
                        background: "rgba(22, 23, 29, 0.9)", 
                        border: "1px solid var(--border)", 
                        borderRadius: "8px",
                        color: "var(--text-h)"
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value) => <span style={{ color: "var(--text-h)", fontSize: 12 }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="analytics-summary-box">
            <h4>💡 Executive Signal Briefing</h4>
            <ul>
              <li><strong>Highest Engagement Value:</strong> PropTech and HealthTech sectors present the highest average Opportunity Scores due to a concentration of series funding and scaling teams.</li>
              <li><strong>Priority Funnel:</strong> Out of {allCompanies.length} monitored organizations, there are <strong>{allCompanies.filter(c => c.businessPotential === "High").length} High-Potential Targets</strong> showing immediate business buy signals.</li>
              <li><strong>Lead Drivers:</strong> Funding announcements (+30 points) and product launches (+25 points) represent the strongest drivers for outreach.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
