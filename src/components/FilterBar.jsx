import { Search, Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import "./FilterBar.css";

const INDUSTRIES = ["All", "HealthTech", "FinTech", "Supply Chain", "PropTech", "EdTech", "CyberSecurity", "AgriTech", "RetailTech", "Logistics", "LegalTech"];
const POTENTIALS = ["All", "High", "Medium", "Low"];
const SORTS = [
  { label: "Score (High → Low)", value: "score_desc" },
  { label: "Score (Low → High)", value: "score_asc" },
  { label: "Company Name (A-Z)", value: "name_asc" },
  { label: "Signals Count", value: "signals_desc" },
];

export default function FilterBar({ filters, onFilterChange }) {

  return (
    <div className="filterbar">
      <div className="filterbar-search-wrap">
        <Search size={16} className="search-icon" />
        <input
          id="company-search"
          className="filterbar-search"
          type="text"
          placeholder="Search companies, industries, or signals…"
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
        {filters.search && (
          <button className="search-clear" onClick={() => onFilterChange({ ...filters, search: "" })}>×</button>
        )}
      </div>

      <div className="filterbar-controls">
        <div className="filter-group">
          <Filter size={14} />
          <select
            id="industry-filter"
            className="filter-select"
            value={filters.industry}
            onChange={(e) => onFilterChange({ ...filters, industry: e.target.value })}
          >
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i === "All" ? "All Industries" : i}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <SlidersHorizontal size={14} />
          <select
            id="potential-filter"
            className="filter-select"
            value={filters.potential}
            onChange={(e) => onFilterChange({ ...filters, potential: e.target.value })}
          >
            {POTENTIALS.map((p) => (
              <option key={p} value={p}>{p === "All" ? "All Potentials" : `${p} Potential`}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <ChevronDown size={14} />
          <select
            id="sort-select"
            className="filter-select"
            value={filters.sort}
            onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="score-range">
          <span className="score-range-label">Min Score: <strong>{filters.minScore}</strong></span>
          <input
            id="min-score-slider"
            type="range"
            min="0"
            max="90"
            step="5"
            value={filters.minScore}
            onChange={(e) => onFilterChange({ ...filters, minScore: Number(e.target.value) })}
            className="score-slider"
          />
        </div>
      </div>
    </div>
  );
}
