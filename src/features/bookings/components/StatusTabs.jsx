import { STATUS_TABS } from '../constants.js';

export default function StatusTabs({ active, onChange, counts }) {
  return (
    <div className="status-tabs">
      {STATUS_TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={'status-tab' + (active === tab.key ? ' active' : '')}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
          <span className="status-tab-count">{counts[tab.key] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}
