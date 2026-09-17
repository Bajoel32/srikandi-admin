import { STATUS_BADGE } from '../constants.js';

export default function StatusBadge({ status }) {
  const cfg = STATUS_BADGE[status] ?? { label: status, className: '' };
  return <span className={'status-badge ' + cfg.className}>{cfg.label}</span>;
}
