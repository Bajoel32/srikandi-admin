const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// "17 Sep 2026, 14.30" pada zona Asia/Jakarta.
export function formatDateTimeJakarta(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';

  const day = get('day');
  const month = MONTHS_ID[Number(get('month')) - 1];
  const year = get('year');
  const hour = get('hour') === '24' ? '00' : get('hour');
  const minute = get('minute');
  return `${day} ${month} ${year}, ${hour}.${minute}`;
}

// "17 Sep 2026" pada zona Asia/Jakarta, untuk tanggal saja (mis. estimated_date).
export function formatDateJakarta(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate.length <= 10 ? `${isoDate}T00:00:00Z` : isoDate);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('day')} ${MONTHS_ID[Number(get('month')) - 1]} ${get('year')}`;
}

// "2 jam lalu"
export function formatRelativeTime(isoString, now = new Date()) {
  if (!isoString) return '';
  const diffMs = now.getTime() - new Date(isoString).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return 'baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 30) return `${diffDay} hari lalu`;
  const diffMonth = Math.round(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} bulan lalu`;
  const diffYear = Math.round(diffMonth / 12);
  return `${diffYear} tahun lalu`;
}
