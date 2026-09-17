import { describe, expect, it } from 'vitest';
import { formatDateTimeJakarta, formatRelativeTime } from './format.js';

describe('formatDateTimeJakarta', () => {
  it('memformat waktu UTC ke "d MMM yyyy, HH.mm" zona Asia/Jakarta (UTC+7)', () => {
    // 17 Sep 2026 07:30 UTC == 17 Sep 2026 14.30 WIB
    expect(formatDateTimeJakarta('2026-09-17T07:30:00Z')).toBe('17 Sep 2026, 14.30');
  });

  it('mengembalikan string kosong untuk input kosong', () => {
    expect(formatDateTimeJakarta('')).toBe('');
    expect(formatDateTimeJakarta(null)).toBe('');
  });
});

describe('formatRelativeTime', () => {
  it('menampilkan "X jam lalu" untuk selisih beberapa jam', () => {
    const now = new Date('2026-09-17T10:00:00Z');
    expect(formatRelativeTime('2026-09-17T08:00:00Z', now)).toBe('2 jam lalu');
  });

  it('menampilkan "baru saja" untuk selisih kurang dari 1 menit', () => {
    const now = new Date('2026-09-17T10:00:00Z');
    expect(formatRelativeTime('2026-09-17T09:59:40Z', now)).toBe('baru saja');
  });
});
