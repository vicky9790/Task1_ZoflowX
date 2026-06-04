import { useState, useEffect } from "react";
import { Zap, Radio, TrendingUp, Building2 } from "lucide-react";
import "./Header.css";

export default function Header({ companies, lastScan, onFullScan }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const highPotential = companies.filter((c) => c.businessPotential === "High").length;
  const totalSignals = companies.reduce((acc, c) => acc + c.signals.length, 0);
  const avgScore = Math.round(companies.reduce((acc, c) => acc + c.opportunityScore, 0) / companies.length);

  return (
    <header className="header">
      <div className="header-glow" />
      <div className="header-content">
        <div className="header-brand">
          <div className="brand-icon">
            <Radio size={22} />
          </div>
          <div>
            <h1 className="brand-name">Opportunity Radar</h1>
            <p className="brand-tagline">AI-Powered Business Signal Intelligence</p>
          </div>
        </div>

        <div className="header-stats">
          <StatPill icon={<Building2 size={14} />} label="Companies" value={companies.length} color="blue" />
          <StatPill icon={<Zap size={14} />} label="Signals" value={totalSignals} color="yellow" />
          <StatPill icon={<TrendingUp size={14} />} label="High Potential" value={highPotential} color="green" />
          <StatPill icon={<Radio size={14} />} label="Avg Score" value={`${avgScore}/100`} color="purple" />
          {/* Full AI Scan button */}
          <button className="full-scan-btn" onClick={() => onFullScan && onFullScan()}>Run Full AI Scan</button>
        </div>

        <div className="header-meta">
          <div className="live-badge">
            <span className="live-dot" />
            LIVE
          </div>
          <div className="header-time">
            <span className="time-label">Current time</span>
            <span className="time-value">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
          <div className="header-time">
            <span className="time-label">Last scan</span>
            <span className="time-value">{lastScan}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatPill({ icon, label, value, color }) {
  return (
    <div className={`stat-pill stat-pill--${color}`}>
      <span className="stat-icon">{icon}</span>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
